import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('./app.js', import.meta.url), 'utf8');
const saveSource = source.slice(source.indexOf('async function save()'), source.indexOf('async function deleteRecord()'));
const draftKeySource = source.slice(source.indexOf('const draftKey ='), source.indexOf('function readDraft('));

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>(done => { resolve = done; });
  return { promise, resolve };
}

for (const isNew of [false, true]) {
  for (const stage of ['save', 'records']) {
    for (const navigate of [false, true]) {
      test(`preserves edits to ${isNew ? 'new' : 'existing'} article during ${stage}${navigate ? ' after navigation' : ''}`, async () => {
        const record = { collection: 'writing', id: isNew ? '' : 'article', revision: isNew ? null : 'old', data: { title: 'Article', slug: isNew ? '' : 'article' }, body: 'saved body' };
        const saved = structuredClone({ ...record, id: 'article', revision: 'saved', data: { ...record.data, slug: 'article' } });
        const state = { record, records: [], dirty: true, saving: false, draftFailed: false };
        const drafts = new Map<string, string>();
        const oldKey = `portfolio-studio:writing:${isNew ? '~new' : 'article'}`;
        const saveResponse = deferred<typeof saved>(), recordsResponse = deferred<unknown[]>(), refreshing = deferred<void>();
        const context = vm.createContext({
          state, JSON, structuredClone,
          localStorage: { setItem: (key: string, value: string) => drafts.set(key, value), removeItem: (key: string) => drafts.delete(key) },
          api: (action: string) => {
            if (action === 'save') return saveResponse.promise;
            refreshing.resolve();
            return recordsResponse.promise;
          },
          clean: (value: unknown) => value, newRecordId: () => 'article', normalize: (value: unknown) => value,
          updateSaveState() {}, renderNav() {}, renderList() {}, rerender() {}, notify() {},
          history: { replaceState() {} },
        });
        vm.runInContext(`${draftKeySource}\n${saveSource}`, context);
        const pending = vm.runInContext('save()', context);
        if (stage === 'records') { saveResponse.resolve(saved); await refreshing.promise; }
        record.body = 'newer unsaved edits';
        drafts.set(oldKey, JSON.stringify(record));
        if (navigate) state.record = { ...record, id: 'other', body: 'other article' };
        saveResponse.resolve(saved);
        recordsResponse.resolve([saved]);
        await pending;
        const recovered = JSON.parse(drafts.get('portfolio-studio:writing:article')!);
        assert.equal(saved.body, 'saved body');
        assert.equal(recovered.body, 'newer unsaved edits');
        assert.equal(recovered.id, 'article');
        assert.equal(recovered.data.slug, 'article');
        assert.equal(recovered.revision, 'saved');
        if (isNew) assert.equal(drafts.has(oldKey), false);
        assert.equal(state.record.id, navigate ? 'other' : 'article');
        assert.equal(state.dirty, true);
      });
    }
  }
}
