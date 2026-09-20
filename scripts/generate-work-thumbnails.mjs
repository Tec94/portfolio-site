import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'public/assets/work-thumbnails');
const manifest = {};
await mkdir(output, { recursive: true });

for (const file of await readdir(path.join(root, 'src/content/projects'))) {
  if (!file.endsWith('.mdx')) continue;
  const { data } = matter(await readFile(path.join(root, 'src/content/projects', file), 'utf8'));
  const media = data.media[0];
  const source = media.type === 'video' ? media.poster : media.source;
  if (!source) continue;
  let original;
  if (source.startsWith('https://')) {
    const response = await fetch(source);
    if (!response.ok) throw new Error(`Unable to read ${source}: ${response.status}`);
    original = Buffer.from(await response.arrayBuffer());
  } else {
    original = await readFile(path.join(root, 'public', source));
  }
  // List frames are at most 104 CSS pixels wide; retain detail at 3x density.
  const { data: thumbnail, info } = await sharp(original).resize({ width: 104 * 3, withoutEnlargement: true }).webp().toBuffer({ resolveWithObject: true });
  const hash = createHash('sha256').update(thumbnail).digest('hex');
  const name = `${data.slug}-${hash}.webp`;
  await writeFile(path.join(output, name), thumbnail);
  manifest[source] = { source: `/assets/work-thumbnails/${name}`, width: info.width, height: info.height };
  console.log(`${data.slug}: ${original.length} -> ${thumbnail.length} bytes`);
}
await writeFile(path.join(root, 'src/portfolio/work/thumbnails.json'), `${JSON.stringify(manifest, null, 2)}\n`);
