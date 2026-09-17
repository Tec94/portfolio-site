import { createHash, randomUUID } from 'node:crypto';
import { access, mkdir, readdir, readFile, rename, stat, realpath } from 'node:fs/promises';
import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { compile } from '@mdx-js/mdx';
import { articleFrontmatterSchema, projectFrontmatterSchema } from '../src/portfolio/content/contracts.ts';

export const revision = (value: string | Buffer) => createHash('sha256').update(value).digest('hex');
export class StudioError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export const exists = async (file: string) => access(file).then(() => true, () => false);
export async function atomicWrite(file: string, value: string | Buffer) {
  await mkdir(path.dirname(file), { recursive: true });
  const temporary = `${file}.${randomUUID()}.tmp`;
  await writeFile(temporary, value);
  await rename(temporary, file);
}
type Shape = string | { [key: string]: Shape } | Shape[];
function validateShape(value: unknown, shape: Shape, label: string): void {
  if (typeof shape === 'string') {
    if (typeof value !== shape || (shape === 'number' && !Number.isFinite(value))) throw new StudioError(`${label} must be ${shape}.`);
  } else if (Array.isArray(shape)) {
    if (!Array.isArray(value)) throw new StudioError(`${label} must be a list.`);
    value.forEach((item, index) => validateShape(item, shape[0], `${label} / ${index + 1}`));
  } else {
    if (!value || typeof value !== 'object' || Array.isArray(value)) throw new StudioError(`${label} must be an object.`);
    const object = value as Record<string, unknown>;
    if (Object.keys(object).sort().join('\0') !== Object.keys(shape).sort().join('\0')) throw new StudioError(`${label}: content fields must be preserved.`);
    for (const [key, child] of Object.entries(shape)) validateShape(object[key], child, `${label} / ${key}`);
  }
}
export function validateLinks(value: unknown, key = ''): void {
  if (typeof value === 'string' && (/^(source|poster|href|live|repository|devpost|resumeUrl|calUrl)$/.test(key) || key.startsWith('https_') || key.startsWith('http_'))) {
    if (!value) return;
    if (value.startsWith('/') && !value.startsWith('//') && !value.includes('\\') && !value.split('/').includes('..')) return;
    try { if (['https:', 'http:', 'mailto:'].includes(new URL(value).protocol)) return; } catch { /* Report a field error below. */ }
    throw new StudioError(`${key}: use an https URL, email link, or local /path.`);
  }
  if (Array.isArray(value)) value.forEach(item => validateLinks(item, key));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([child, item]) => validateLinks(item, child));
}
export function createStore(root: string) {
  const contentRoot = path.join(root, 'src/content');
  const historyRoot = path.join(root, '.studio/history');
  async function fileFor(collection: string, id: string) {
    if (!['projects', 'writing', 'site'].includes(collection) || !/^[a-zA-Z0-9]+(?:[-_][a-zA-Z0-9]+)*$/.test(id)) throw new StudioError('Unknown content record.');
    const directory = path.join(contentRoot, collection);
    if (await realpath(directory) !== path.resolve(directory)) throw new StudioError('Content directories cannot be symbolic links.');
    const file = path.join(directory, `${id}.${collection === 'site' ? 'json' : 'mdx'}`);
    if (await exists(file) && await realpath(file) !== path.resolve(file)) throw new StudioError('Content files cannot be symbolic links.');
    return file;
  }
  async function read(collection: string, id: string) {
    const source = await readFile(await fileFor(collection, id), 'utf8');
    const parsed = collection === 'site' ? { data: JSON.parse(source), content: '' } : matter(source);
    return { collection, id, data: parsed.data, body: parsed.content.trim(), revision: revision(source) };
  }
  async function list() {
    const records = [];
    for (const collection of ['projects', 'writing', 'site']) {
      for (const filename of await readdir(path.join(contentRoot, collection))) {
        const extension = collection === 'site' ? '.json' : '.mdx';
        if (!filename.endsWith(extension)) continue;
        const record = await read(collection, filename.slice(0, -extension.length));
        records.push({ ...record, title: record.data.title ?? record.id, status: record.data.publicationState ?? record.data.status ?? 'saved' });
      }
    }
    return records;
  }
  async function validate(collection: string, id: string, data: unknown, body: string) {
    validateLinks(data);
    if (collection === 'site') {
      const shapes = JSON.parse(await readFile(path.join(root, 'studio/site-shapes.json'), 'utf8'));
      if (!Object.hasOwn(shapes, id)) throw new StudioError('Unknown site section.');
      validateShape(data, shapes[id], id);
      if (id === 'profile') {
        const profile = (data as { profile: { timeZone: string } }).profile;
        try { new Intl.DateTimeFormat('en-US', { timeZone: profile.timeZone }); } catch { throw new StudioError('Enter a valid IANA time zone, such as America/Chicago.'); }
      }
      return JSON.stringify(data, null, 2) + '\n';
    }
    const schema = collection === 'projects' ? projectFrontmatterSchema : articleFrontmatterSchema;
    const parsed = schema.safeParse(data);
    if (!parsed.success) throw new StudioError(parsed.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join('\n'));
    if (parsed.data.slug !== id) throw new StudioError('The slug must match the record ID.');
    if (collection === 'projects') {
      const other = (await list()).find(record => record.collection === 'projects' && record.id !== id && record.data.selectedWorkOrder === (parsed.data as { selectedWorkOrder: number }).selectedWorkOrder);
      if (other) throw new StudioError(`Display order is already used by ${other.title}.`);
    }
    const source = matter.stringify(body, parsed.data);
    try { await compile(body); } catch (error) { throw new StudioError(`Writing cannot compile: ${String(error)}`); }
    return source;
  }
  async function save(collection: string, id: string, data: unknown, body: string, expected: string | null) {
    const file = await fileFor(collection, id);
    const old = await exists(file) ? await readFile(file, 'utf8') : null;
    if ((old === null ? null : revision(old)) !== expected) throw new StudioError('This record changed in another tab or editor. Reload it before saving.', 409);
    const source = await validate(collection, id, data, body);
    if (source === old) return read(collection, id);
    if (old !== null) await atomicWrite(path.join(historyRoot, collection, id, `${Date.now()}-${randomUUID()}.json`), JSON.stringify({ source: old, savedAt: new Date().toISOString() }));
    await atomicWrite(file, source);
    return read(collection, id);
  }
  async function remove(collection: string, id: string, expected: string) {
    if (collection === 'site') throw new StudioError('Site sections cannot be deleted.');
    const file = await fileFor(collection, id);
    const old = await readFile(file, 'utf8');
    if (revision(old) !== expected) throw new StudioError('This record changed. Reload before deleting.', 409);
    const trash = path.join(root, '.studio/trash', `${Date.now()}-${randomUUID()}`, 'src/content', collection);
    await mkdir(trash, { recursive: true });
    await rename(file, path.join(trash, path.basename(file)));
  }
  async function reorderProjects(order: { id: string; revision: string }[]) {
    const projects = (await list()).filter(record => record.collection === 'projects');
    if (!Array.isArray(order) || order.length !== projects.length ||
      order.some(item => !item || typeof item.id !== 'string') ||
      new Set(order.map(item => item.id)).size !== projects.length ||
      projects.some(project => !order.some(item => item.id === project.id))) {
      throw new StudioError('The project list changed. Reload Projects before reordering.', 409);
    }
    const positions = projects.map(project => project.data.selectedWorkOrder).sort((a, b) => a - b);
    const edits: { file: string; source: string; next: string; id: string }[] = [];
    for (const [index, item] of order.entries()) {
      const file = await fileFor('projects', item.id);
      const source = await readFile(file, 'utf8');
      if (revision(source) !== item.revision) throw new StudioError('A project changed in another editor. Reload Projects before reordering.', 409);
      // Reuse the existing rank values; a reorder only changes their owners.
      const next = source.replace(/^selectedWorkOrder:[^\r\n]*/m, `selectedWorkOrder: ${positions[index]}`);
      const parsed = projectFrontmatterSchema.parse(matter(next).data);
      if (parsed.selectedWorkOrder !== positions[index]) throw new StudioError(`Could not update the display order for ${item.id}.`);
      if (next !== source) edits.push({ file, source, next, id: item.id });
    }
    for (const edit of edits) await atomicWrite(path.join(historyRoot, 'projects', edit.id, `${Date.now()}-${randomUUID()}.json`), JSON.stringify({ source: edit.source, savedAt: new Date().toISOString() }));
    const written: typeof edits = [];
    try {
      for (const edit of edits) { await atomicWrite(edit.file, edit.next); written.push(edit); }
    } catch (error) {
      const restored = await Promise.allSettled(written.map(edit => atomicWrite(edit.file, edit.source)));
      if (restored.some(result => result.status === 'rejected')) throw new StudioError('Reordering failed and some files could not be restored. Original versions are in local revision history.', 500);
      throw error;
    }
    return list();
  }
  async function history(collection: string, id: string) {
    await fileFor(collection, id);
    const folder = path.join(historyRoot, collection, id);
    if (!await exists(folder)) return [];
    return Promise.all((await readdir(folder)).sort().reverse().map(async filename => {
      const { source, savedAt } = JSON.parse(await readFile(path.join(folder, filename), 'utf8'));
      const parsed = collection === 'site' ? { data: JSON.parse(source), content: '' } : matter(source);
      return { savedAt, data: parsed.data, body: parsed.content.trim() };
    }));
  }
  async function media() {
    const files: { source: string; name: string; bytes?: number; references: string[] }[] = [];
    const refs = new Map<string, Set<string>>();
    for (const record of await list()) {
      const serialized = JSON.stringify(record);
      for (const match of serialized.matchAll(/(?:https?:\/\/[^\s"\\]+|\/assets\/[^\s"\\]+)\.(?:png|jpe?g|gif|webp|avif|svg|mp4|webm|mov|pdf)/gi)) {
        const owners = refs.get(match[0]) ?? new Set<string>();
        owners.add(`${record.collection}/${record.id}`); refs.set(match[0], owners);
      }
    }
    const folder = path.join(root, 'public/assets/studio');
    if (await exists(folder)) for (const name of await readdir(folder)) {
      if (name.endsWith('.tmp')) continue;
      const source = `/assets/studio/${name}`;
      files.push({ source, name, bytes: (await stat(path.join(folder, name))).size, references: [...(refs.get(source) ?? [])] });
      refs.delete(source);
    }
    for (const [source, owners] of refs) files.push({ source, name: source.split('/').pop()!, references: [...owners] });
    return files;
  }
  return { read, list, save, remove, reorderProjects, history, media, fileFor };
}
