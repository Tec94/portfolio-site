import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, mkdir, readFile, writeFile, cp, readdir } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { createStore, StudioError } from './content-store.ts';

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'portfolio-studio-test-'));
  for (const dir of ['src/content/projects','src/content/writing','src/content/site','studio']) await mkdir(path.join(root,dir),{recursive:true});
  await cp('src/content/projects/credify.mdx',path.join(root,'src/content/projects/credify.mdx'));
  await cp('src/content/site/profile.json',path.join(root,'src/content/site/profile.json'));
  await cp('studio/site-shapes.json',path.join(root,'studio/site-shapes.json'));
  return {root,store:createStore(root)};
}
test('save persists narrative, rejects stale writes, and retains a restorable revision',async()=>{
  const {root,store}=await fixture(); const original=await store.read('projects','credify');
  const changed=await store.save('projects','credify',original.data,'## My process\n\nA revised process.',original.revision);
  assert.match(await readFile(path.join(root,'src/content/projects/credify.mdx'),'utf8'),/A revised process/);
  await assert.rejects(()=>store.save('projects','credify',original.data,'Stale',original.revision),error=>error instanceof StudioError&&error.status===409);
  const [history]=await store.history('projects','credify'); assert.equal(history.body,original.body);
  await store.save('projects','credify',history.data,history.body,changed.revision);
  assert.equal((await store.read('projects','credify')).body,original.body);
});
test('invalid content, duplicate order, malformed MDX, and traversal do not mutate files',async()=>{
  const {store}=await fixture();const record=await store.read('projects','credify');
  await assert.rejects(()=>store.save('projects','credify',{...record.data,title:''},record.body,record.revision));
  await assert.rejects(()=>store.save('projects','credify',record.data,'<Unclosed>',record.revision));
  await assert.rejects(()=>store.save('projects','another',{...record.data,slug:'another'},record.body,null),/Display order/);
  await assert.rejects(()=>store.read('projects','../profile'));
  await assert.rejects(()=>store.read('../site','profile'));
  assert.equal((await store.read('projects','credify')).revision,record.revision);
});
test('site edits preserve types and reject script links or invalid time zones',async()=>{
  const {store}=await fixture();const record=await store.read('site','profile');
  const data=structuredClone(record.data);data.profile.name='Studio test name';
  const saved=await store.save('site','profile',data,'',record.revision);assert.equal(saved.data.profile.name,'Studio test name');
  data.profile.resumeUrl='javascript:alert(1)';await assert.rejects(()=>store.save('site','profile',data,'',saved.revision));
  data.profile.resumeUrl='/resume.pdf';data.profile.timeZone='not-a-time-zone';await assert.rejects(()=>store.save('site','profile',data,'',saved.revision));
});
test('media references include Markdown and deleted records move to local trash',async()=>{
  const {root,store}=await fixture();const record=await store.read('projects','credify');
  await mkdir(path.join(root,'public/assets/studio'),{recursive:true});
  await writeFile(path.join(root,'public/assets/studio/example.png'),'fixture');
  const saved=await store.save('projects','credify',record.data,'![Example](/assets/studio/example.png)',record.revision);
  assert.deepEqual((await store.media()).find(item=>item.name==='example.png')?.references,['projects/credify']);
  await store.remove('projects','credify',saved.revision);
  assert.equal((await store.list()).filter(item=>item.collection==='projects').length,0);
  assert.equal((await readdir(path.join(root,'.studio/trash'))).length,1);
});
test('reordering swaps existing ranks, preserves content, and rejects a stale or incomplete list', async () => {
  const { root, store } = await fixture();
  await cp('src/content/projects/citizenvoice.mdx', path.join(root, 'src/content/projects/citizenvoice.mdx'));
  const before = await Promise.all(['credify', 'citizenvoice'].map(id => store.read('projects', id)));
  const sources = await Promise.all(before.map(record => readFile(path.join(root, `src/content/projects/${record.id}.mdx`), 'utf8')));
  const requested = [...before].reverse().map(({ id, revision }) => ({ id, revision }));
  const result = await store.reorderProjects(requested);
  assert.deepEqual(result.filter(record => record.collection === 'projects').sort((a,b) => a.data.selectedWorkOrder-b.data.selectedWorkOrder).map(record => record.id), ['citizenvoice', 'credify']);
  for (const record of before) assert.equal((await store.read('projects', record.id)).body, record.body);
  await assert.rejects(() => store.reorderProjects(requested), error => error instanceof StudioError && error.status === 409);
  await assert.rejects(() => store.reorderProjects(requested.slice(1)), error => error instanceof StudioError && error.status === 409);
  await assert.rejects(() => store.reorderProjects([requested[0], requested[0]]));
  const current = await Promise.all(before.map(record => store.read('projects', record.id)));
  await store.reorderProjects(current.map(({ id, revision }) => ({ id, revision })));
  for (const [index, record] of before.entries()) assert.equal(await readFile(path.join(root, `src/content/projects/${record.id}.mdx`), 'utf8'), sources[index]);
});
