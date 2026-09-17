import http from 'node:http';
import { createReadStream, createWriteStream } from 'node:fs';
import { mkdir, readFile, rename, rm, realpath } from 'node:fs/promises';
import { randomBytes, createHash, randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pipeline } from 'node:stream/promises';
import { Transform } from 'node:stream';
import { createServer as createViteServer } from 'vite';
import { atomicWrite, createStore, exists, StudioError } from './content-store.ts';
import { publish } from './publish.ts';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const token = randomBytes(32).toString('hex');
const store = createStore(root);
let origin = '';
let job: { state: string; log: string; result?: unknown } = { state: 'idle', log: '' };
const jobListeners = new Set<http.ServerResponse>();
function emitJob() {
  for (const response of jobListeners) {
    response.write(JSON.stringify(job) + '\n');
    if (job.state !== 'running') response.end();
  }
}
let mutating = false;
const json = (response: http.ServerResponse, value: unknown, status = 200) => {
  response.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
  response.end(JSON.stringify(value));
};
async function payload(request: http.IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of request) chunks.push(Buffer.from(chunk));
  try { return JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new StudioError('Invalid JSON request.'); }
}
const server = http.createServer();
const vite = await createViteServer({
  root, server: { middlewareMode: true, hmr: { server }, host: '127.0.0.1', watch: { ignored: ['**/.studio/**'] } }, appType: 'spa',
  define: { 'import.meta.env.VITE_STUDIO_PREVIEW': JSON.stringify('true') },
});
server.on('request', async (request, response) => {
  try {
    if (request.headers.host !== new URL(origin).host) return json(response, { error: 'Unrecognized host.' }, 403);
    const url = new URL(request.url ?? '/', origin);
    if (url.pathname === '/__studio' || url.pathname === '/__studio/') {
      response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Frame-Options': 'DENY', 'Content-Security-Policy': "frame-ancestors 'none'" });
      response.end((await readFile(path.join(root, 'studio/index.html'), 'utf8')).replace('__SESSION_TOKEN__', token));
      return;
    }
    const staticFiles: Record<string, [string, string]> = {
      '/__studio/app.js': ['app.js', 'text/javascript'], '/__studio/style.css': ['style.css', 'text/css'],
      '/__studio/project-editor.css': ['project-editor.css', 'text/css'],
    };
    if (staticFiles[url.pathname]) {
      const [file, type] = staticFiles[url.pathname];
      response.writeHead(200, { 'Content-Type': `${type}; charset=utf-8`, 'Cache-Control': 'no-store' });
      createReadStream(path.join(root, 'studio', file)).pipe(response); return;
    }
    if (!url.pathname.startsWith('/__studio/api/')) { vite.middlewares(request, response); return; }
    if (request.headers['x-studio-token'] !== token || (request.headers.origin && request.headers.origin !== origin)) return json(response, { error: 'Open the editor on this computer to access content.' }, 403);
    const action = url.pathname.slice('/__studio/api/'.length);
    if (request.method === 'GET') {
      if (action === 'job-events') {
        response.writeHead(200, { 'Content-Type': 'application/x-ndjson', 'Cache-Control': 'no-store' });
        response.write(JSON.stringify(job) + '\n');
        if (job.state !== 'running') response.end();
        else { jobListeners.add(response); response.on('close', () => jobListeners.delete(response)); }
        return;
      }
      if (action === 'records') return json(response, await store.list());
      if (action === 'history') return json(response, await store.history(url.searchParams.get('collection') ?? '', url.searchParams.get('id') ?? ''));
      if (action === 'media') return json(response, await store.media());
      if (action === 'job') return json(response, job);
      if (action === 'settings') return json(response, {
        config: JSON.parse(await readFile(path.join(root, 'studio.config.json'), 'utf8')),
        lastPublish: await exists(path.join(root, '.studio/last-publish.json')) ? JSON.parse(await readFile(path.join(root, '.studio/last-publish.json'), 'utf8')) : null,
        shapes: JSON.parse(await readFile(path.join(root, 'studio/site-shapes.json'), 'utf8')),
      });
      throw new StudioError('Unknown action.', 404);
    }
    if (request.method !== 'POST') throw new StudioError('Method not allowed.', 405);
    if (job.state === 'running' || mutating) throw new StudioError('A save or build is in progress. Please wait.', 409);
    mutating = true;
    try {
      if (action === 'upload') {
        const extension = path.extname(url.searchParams.get('name') ?? '').toLowerCase();
        if (!['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.svg', '.mp4', '.webm', '.mov', '.pdf'].includes(extension)) throw new StudioError('Choose an image, video, or PDF.');
        const folder = path.join(root, 'public/assets/studio');
        await mkdir(folder, { recursive: true });
        if (await realpath(folder) !== path.resolve(folder)) throw new StudioError('Media folder cannot be a symbolic link.');
        const temporary = path.join(folder, `${randomUUID()}.tmp`);
        const hash = createHash('sha256');
        try {
          await pipeline(request, new Transform({ transform(chunk, _encoding, done) { hash.update(chunk); done(null, chunk); } }), createWriteStream(temporary, { flags: 'wx' }));
          const name = `${hash.digest('hex')}${extension}`;
          const destination = path.join(folder, name);
          if (await exists(destination)) await rm(temporary); else await rename(temporary, destination);
          return json(response, { source: `/assets/studio/${name}`, name });
        } catch (error) { await rm(temporary, { force: true }); throw error; }
      }
      const input = await payload(request);
      if (action === 'reorder-projects') return json(response, await store.reorderProjects(input.order));
      if (action === 'save') return json(response, await store.save(input.collection, input.id, input.data, input.body ?? '', input.revision));
      if (action === 'delete') { await store.remove(input.collection, input.id, input.revision); return json(response, { ok: true }); }
      if (action === 'remove-media') {
        if (typeof input.name !== 'string' || !/^[a-f0-9]{64}\.(png|jpe?g|webp|gif|avif|svg|mp4|webm|mov|pdf)$/.test(input.name)) throw new StudioError('Only local Studio uploads can be removed.');
        const item = (await store.media()).find(media => media.source === `/assets/studio/${input.name}`);
        if (!item || item.references.length) throw new StudioError('Remove this media from its content records before deleting it.');
        const folder = path.join(root, '.studio/trash', `${Date.now()}-${randomUUID()}`);
        await mkdir(folder, { recursive: true });
        await rename(path.join(root, 'public/assets/studio', input.name), path.join(folder, input.name));
        return json(response, { ok: true });
      }
      if (action === 'publish' || action === 'build') {
        job = { state: 'running', log: '' };
        void publish(root, action === 'publish', text => { job.log += text; emitJob(); }).then(result => { job.result = result; job.state = 'success'; emitJob(); }, error => { job.log += `\n${error.message}\n`; job.state = 'error'; emitJob(); });
        return json(response, { ok: true }, 202);
      }
      throw new StudioError('Unknown action.', 404);
    } finally { mutating = false; }
  } catch (error) {
    const known = error instanceof StudioError;
    json(response, { error: error instanceof Error ? error.message : String(error) }, known ? error.status : 500);
  }
});
server.listen(Number(process.env.STUDIO_PORT ?? 0), '127.0.0.1', async () => {
  const address = server.address();
  if (!address || typeof address === 'string') return;
  origin = `http://127.0.0.1:${address.port}`;
  await atomicWrite(path.join(root, '.studio/server.json'), JSON.stringify({ url: `${origin}/__studio/`, pid: process.pid }));
  console.log(`\nPortfolio Studio → ${origin}/__studio/\nPortfolio preview → ${origin}/\n`);
});
async function stop() { await vite.close(); server.close(); }
process.on('SIGINT', () => { void stop(); });
process.on('SIGTERM', () => { void stop(); });
