import { spawn } from 'node:child_process';
import { cp, mkdir, readdir, readFile, symlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { atomicWrite, exists, StudioError } from './content-store.ts';
import { loadEnv } from 'vite';

export function runNode(root: string, script: string, args: string[], log: (text: string) => void, environment: Record<string, string> = {}) {
  return new Promise<string>((resolve, reject) => {
    const child = spawn(process.execPath, [script, ...args], {
      cwd: root, windowsHide: true, shell: false,
      env: { ...process.env, ...environment, NODE_ENV: 'production', CI: 'true', NO_COLOR: '1' }, stdio: ['ignore', 'pipe', 'pipe'],
    });
    let output = '';
    for (const stream of [child.stdout, child.stderr]) stream.on('data', chunk => { output += chunk.toString(); log(chunk.toString()); });
    child.on('error', reject);
    child.on('close', code => code === 0 ? resolve(output) : reject(new StudioError(`Command failed with exit code ${code}. See the publishing log.`)));
  });
}
export async function publish(root: string, deploy: boolean, log: (text: string) => void, execute = runNode, request = fetch) {
  const settings = JSON.parse(await readFile(path.join(root, 'studio.config.json'), 'utf8'));
  const id = `${Date.now()}-${randomUUID()}`;
  const release = path.join(root, '.studio/releases', id);
  const snapshot = path.join(release, 'source');
  await mkdir(snapshot, { recursive: true });
  log('Creating a frozen copy of your saved portfolio…\n');
  const files = ['src', 'public', 'index.html', 'package.json', 'vite.config.ts', 'portfolioMdxSourcePlugin.ts', 'postcss.config.js', 'tailwind.config.js', 'tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json', 'studio.config.json', 'scripts/validate-portfolio-content.ts'];
  for (const name of files) await cp(path.join(root, name), path.join(snapshot, name), { recursive: true });
  await symlink(path.join(root, 'node_modules'), path.join(snapshot, 'node_modules'), 'junction');
  const nodeModule = (file: string) => path.join(root, 'node_modules', file);
  await execute(snapshot, nodeModule('tsx/dist/cli.mjs'), ['scripts/validate-portfolio-content.ts'], log);
  const publicEnvironment = loadEnv('production', root, ['VITE_', 'NEXT_PUBLIC_', 'EXPERIMENTATION_']);
  await execute(snapshot, nodeModule('vite/bin/vite.js'), ['build', '--outDir', path.join(release, 'dist')], log, publicEnvironment);
  await writeFile(path.join(release, 'dist', '__studio-release.json'), JSON.stringify({ id }));
  if (!deploy) { log('Build verified. Nothing was published.\n'); return { id, output: path.join(release, 'dist'), deployed: false }; }
  const wrangler = nodeModule('wrangler/bin/wrangler.js');
  const media = path.join(snapshot, 'public/assets/studio');
  if (await exists(media)) for (const name of await readdir(media)) {
    if (name.endsWith('.tmp')) continue;
    log(`Uploading ${name}…\n`);
    await execute(snapshot, wrangler, ['r2', 'object', 'put', `${settings.mediaBucket}/studio/${name}`, '--file', path.join(media, name), '--remote'], log);
  }
  log(`Publishing to ${settings.projectName} (${settings.productionBranch})…\n`);
  const output = await execute(snapshot, wrangler, ['pages', 'deploy', path.join(release, 'dist'), '--project-name', settings.projectName, '--branch', settings.productionBranch, '--commit-dirty=true'], log);
  const url = output.match(/https:\/\/[a-z0-9-]+\.[a-z0-9-]+\.pages\.dev/)?.[0];
  if (!url) throw new StudioError('Cloudflare accepted the command, but its deployment URL could not be read. Check Cloudflare before retrying.');
  const record = { id, url, siteUrl: settings.siteUrl, deployed: true, verified: false, publishedAt: new Date().toISOString() };
  await atomicWrite(path.join(root, '.studio/last-publish.json'), JSON.stringify(record, null, 2));
  log('Checking the deployed release marker…\n');
  const response = await request(`${url}/__studio-release.json`);
  if (!response.ok || (await response.json() as { id?: string }).id !== id) throw new StudioError(`Deployment was created at ${url}, but verification failed. Check that URL before publishing again.`);
  record.verified = true;
  await atomicWrite(path.join(root, '.studio/last-publish.json'), JSON.stringify(record, null, 2));
  log(`Published and verified: ${url}\n`);
  return record;
}
