const token = document.querySelector('meta[name="studio-token"]').content;
const $ = selector => document.querySelector(selector);
const app = $('#app'), main = $('#main'), list = $('#list'), inspector = $('#inspector');
const sections = { projects: 'Projects', writing: 'Writing', site: 'Site content', media: 'Media library', publish: 'Publish' };
const collections = ['projects', 'writing', 'site'];
// [title, group, preview path]
const siteInfo = {
  OverviewPage: ['Homepage intro', 'Pages', '/', 'Hero sentence, links, contact prompt'], OverviewAbout: ['Homepage about', 'Pages', '/', 'About blurb on the homepage'],
  AboutPage: ['About page', 'Pages', '/about', 'Headings and intro on /about'], ContactPage: ['Contact page', 'Pages', '/contact', 'Form labels and options'],
  WritingPage: ['Writing page', 'Pages', '/writing', 'Writing index labels'], WorkArchive: ['Work archive', 'Pages', '/work', 'Work index labels'],
  LabPage: ['Lab page', 'Pages', '/', 'Experiments and archive links'], pages: ['Project & article pages', 'Pages', null, 'Labels shared by case studies and articles'],
  profile: ['Profile & experience', 'Data', '/about', 'Name, links, jobs, education, timeline'], services: ['Services & pricing', 'Data', '/services', 'Service cards and prices'],
  seo: ['Search & social previews', 'Data', '/', 'Page title, description, share image'],
  PortfolioShell: ['Navigation & footer', 'Interface', '/', 'Skip link and shell labels'], CommandMenu: ['Command menu', 'Interface', '/', 'Search dialog labels'],
  ContentNavigation: ['On-this-page nav', 'Interface', '/', 'Table-of-contents label'], MediaViewer: ['Media viewer', 'Interface', '/', 'Lightbox labels'],
  PocketViewfinder: ['Pocket viewfinder', 'Interface', '/', 'Viewfinder experiment labels'], ServicesReceipts: ['Service labels', 'Interface', '/services', 'Receipt headings on /services'],
};
const fieldLabels = { title: 'Title', summary: 'Summary', completedAt: 'Completed', role: 'Role', duration: 'Time spent', live: 'Live website', repository: 'Source code', devpost: 'Devpost page', publicationDate: 'Publish date', readingMinutes: 'Reading time (minutes)', series: 'Series', aspectRatio: 'Size', narrativeRole: 'Role in story', alt: 'Description (alt text)', resumeUrl: 'Résumé URL', calUrl: 'Booking URL', timeZone: 'Time zone', href: 'Link', socialLinks: 'Social links', r_sum: 'Résumé' };
const projectTypes = ['Web app', 'Product site', 'Mobile app', 'Desktop app', 'Dashboard', 'API', 'Automation', 'Hackathon', 'Financial data', 'Design system', 'Experiment'];
const technologies = ['React', 'TypeScript', 'JavaScript', 'Next.js', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'Python', 'FastAPI', 'PostgreSQL', 'SQLite', 'Supabase', 'Better Auth', 'Auth0', 'Swift', 'SwiftUI', 'Kotlin', 'Docker', 'Cloudflare'];
const stackPresets = { 'React + Vite': ['React', 'TypeScript', 'Vite'], 'Next.js + Supabase': ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL'], 'Python API': ['Python', 'FastAPI', 'PostgreSQL'], 'Native iOS': ['Swift', 'SwiftUI'] };
const mediaPattern = /\.(png|jpe?g|webp|gif|avif|svg|mp4|webm|mov|pdf)(?:\?|$)/i;
const isVideo = source => /\.(mp4|webm|mov)(?:\?|$)/i.test(source);
const isPdf = source => /\.pdf(?:\?|$)/i.test(source);

function pref(key, fallback) { try { return localStorage.getItem(`portfolio-studio-pref:${key}`) ?? fallback; } catch { return fallback; } }
function setPref(key, value) { try { localStorage.setItem(`portfolio-studio-pref:${key}`, value); } catch { /* Preferences are optional. */ } }
const state = {
  records: [], settings: null, section: 'projects', record: null, dirty: false, saving: false, errors: {}, banner: null, undo: [],
  filter: '', status: 'all', reorder: false, newTemplate: null, focus: null, drawer: false, draftFailed: false,
  panel: pref('panel', 'outline'), collapsed: new Set(JSON.parse(pref('collapsed', '[]'))),
};
let jobController, previewObserver, inspectorTimer, dragging = null;
const openItems = new WeakMap();

// ---------- small helpers ----------
function h(tag, props, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props ?? {})) {
    if (value == null || value === false) continue;
    if (key === 'class') node.className = value;
    else if (key === 'text') node.textContent = value;
    else if (key in node && key !== 'list') node[key] = value;
    else node.setAttribute(key, value === true ? '' : value);
  }
  node.append(...kids(children));
  return node;
}
function kids(...children) { return children.flat(Infinity).filter(child => child != null && child !== false && child !== ''); }
const btn = (text, onclick, className, props) => h('button', { type: 'button', class: className, onclick, ...props }, text);
const fid = path => `f-${path.join('.')}`;
const move = (items, from, to) => items.splice(to, 0, items.splice(from, 1)[0]);
function label(key) {
  key = String(key);
  if (fieldLabels[key]) return fieldLabels[key];
  if (/^https?_/.test(key)) return `Link · ${key.replace(/^https?_(www_)?/, '').replaceAll('_', ' ')}`;
  if (/^(og|twitter)_/.test(key)) return `${key.startsWith('og') ? 'Open Graph' : 'Twitter'} ${key.replace(/^\w+?_/, '').replaceAll('_', ' ')}`;
  const repeat = key.match(/_+$/)?.[0].length;
  const text = key.replace(/_+$/, '').replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('_', ' ').trim();
  return text.charAt(0).toUpperCase() + text.slice(1) + (repeat ? ` (${repeat + 1})` : '');
}
function recordTitle(record) {
  if (record.collection === 'site') return siteInfo[record.id]?.[0] ?? label(record.id);
  return record.data.title?.trim() || (record.id ? label(record.id) : `Untitled ${record.collection === 'projects' ? 'project' : 'article'}`);
}
function notify(text, { error = false, action } = {}) {
  const toasts = $('#toasts');
  const toast = h('div', { class: `toast${error ? ' error' : ''}` }, h('p', { text }),
    action && btn(action.label, () => { toast.remove(); action.run(); }, 'small'),
    btn('×', () => toast.remove(), 'icon ghost', { 'aria-label': 'Dismiss' }));
  toasts.append(toast);
  while (toasts.childElementCount > 4) toasts.firstElementChild.remove();
  if (!error) setTimeout(() => toast.remove(), action ? 9000 : 4500);
}
async function api(action, data) {
  const response = await fetch(`/__studio/api/${action}`, { method: data === undefined ? 'GET' : 'POST', headers: { 'x-studio-token': token, ...(data === undefined ? {} : { 'Content-Type': 'application/json' }) }, body: data === undefined ? undefined : JSON.stringify(data) });
  const result = await response.json(); if (!response.ok) throw new Error(result.error); return result;
}
function preview(source, className = 'media-preview') {
  if (!source || !/^(https?:\/\/|\/)/.test(source) || source.startsWith('//')) return h('span', { class: `${className} empty-media`, text: 'No media' });
  if (isPdf(source)) return h('a', { class: `${className} pdf`, href: source, target: '_blank', rel: 'noopener', text: 'PDF ↗' });
  return isVideo(source) ? h('video', { class: className, src: source, preload: 'metadata', muted: true }) : h('img', { class: className, src: source, alt: '', loading: 'lazy' });
}

// ---------- drafts, undo, record normalisation ----------
const draftKey = record => `portfolio-studio:${record.collection}:${record.id || '~new'}`;
function readDraft(record) { try { return JSON.parse(localStorage.getItem(draftKey(record))); } catch { return null; } }
function dropDraft(record) { try { localStorage.removeItem(draftKey(record)); } catch { /* Nothing to remove. */ } }
function allDrafts() {
  const drafts = [];
  try { for (let i = 0; i < localStorage.length; i++) { const [prefix, collection, id] = localStorage.key(i).split(':'); if (prefix === 'portfolio-studio') drafts.push({ collection, id }); } } catch { /* Storage unavailable. */ }
  return drafts;
}
function changed() {
  const first = !state.dirty;
  state.dirty = true; updateSaveState();
  try { localStorage.setItem(draftKey(state.record), JSON.stringify(state.record)); state.draftFailed = false; } catch { state.draftFailed = true; }
  if (first) { renderNav(); renderList(); }
  clearTimeout(inspectorTimer);
  if (state.panel === 'outline') inspectorTimer = setTimeout(renderInspector, 400);
}
window.addEventListener('beforeunload', event => { if (state.dirty && state.draftFailed) event.preventDefault(); });
function checkpoint() {
  state.undo.push(JSON.stringify({ data: state.record.data, body: state.record.body }));
  if (state.undo.length > 50) state.undo.shift();
}
function undo() {
  const last = state.undo.pop();
  if (!last) return notify('Nothing to undo.');
  Object.assign(state.record, JSON.parse(last)); normalize(state.record); changed(); rerender();
}
function normalize(record) {
  const data = record.data;
  if (record.collection === 'projects') {
    record.data = { presentation: 'case-study', year: '', completedAt: '', role: '', duration: '', categories: [], technologies: [], highlights: [], media: [], ...data };
    record.data.links = { live: '', repository: '', devpost: '', ...(data.links && typeof data.links === 'object' ? data.links : {}) };
    record.data.media = record.data.media.map(media => ({ poster: '', caption: '', ...media, aspectRatio: { width: 0, height: 0, ...media.aspectRatio } }));
  } else if (record.collection === 'writing') {
    record.data = { format: 'Note', readingMinutes: '', series: '', tags: [], ...data };
    if (record.data.cover) record.data.cover = { poster: '', caption: '', ...record.data.cover };
  }
  return record;
}
function clean(value) {
  if (Array.isArray(value)) return value.map(clean).filter(item => typeof item !== 'string' || item.trim());
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== '').map(([key, item]) => [key, clean(item)]));
  return value;
}
const nextOrder = () => Math.max(0, ...state.records.filter(record => record.collection === 'projects').map(record => record.data.selectedWorkOrder)) + 1;
function blankRecord(collection) {
  const project = collection === 'projects';
  return { collection, id: '', revision: null, body: project ? '## Context\n\n## Process\n\n## Outcome\n' : '', data: project
    ? { slug: '', title: '', summary: '', presentation: 'case-study', publicationState: 'draft', year: new Date().getFullYear(), completedAt: new Date().toISOString().slice(0, 7), selectedWorkOrder: nextOrder(), links: {}, media: [] }
    : { slug: '', title: '', summary: '', publicationDate: new Date().toISOString().slice(0, 10), format: 'Note', tags: [], status: 'draft' } };
}
function newRecordId(record) {
  const base = record.data.title.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `${record.collection === 'projects' ? 'project' : 'article'}-${crypto.randomUUID()}`;
  let id = base, suffix = 2;
  while (state.records.some(item => item.collection === record.collection && item.id === id)) id = `${base}-${suffix++}`;
  return id;
}

// ---------- routing ----------
const go = (section, id) => { location.hash = `#/${section}${id ? `/${encodeURIComponent(id)}` : ''}`; };
window.addEventListener('hashchange', route);
function route() {
  const [rawSection, rawId] = location.hash.replace(/^#\/?/, '').split('/');
  const section = sections[rawSection] ? rawSection : 'projects', id = rawId ? decodeURIComponent(rawId) : null;
  if (state.section !== section) Object.assign(state, { filter: '', status: 'all', reorder: false });
  jobController?.abort();
  Object.assign(state, { section, errors: {}, banner: null, undo: [], dirty: false, drawer: false });
  state.record = id && collections.includes(section) ? openRecord(section, id) : null;
  render();
  main.scrollTop = 0;
  if (state.focus && state.record) { const { path, query } = state.focus; state.focus = null; focusPath(path, query); }
}
function openRecord(collection, id) {
  const source = id === '~new' ? (state.newTemplate?.collection === collection ? state.newTemplate : blankRecord(collection)) : state.records.find(item => item.collection === collection && item.id === id);
  if (!source) { notify('That entry no longer exists.', { error: true }); return null; }
  const record = normalize(structuredClone(source));
  const draft = readDraft(record);
  if (!draft) return record;
  if (draft.revision === record.revision) {
    state.dirty = true;
    state.banner = { text: 'Restored your unsaved changes from this browser.', actions: [['Discard changes', discardDraft]] };
    return normalize(draft);
  }
  state.banner = { text: 'You have an unsaved draft from an older version of this entry.', actions: [['Load draft', () => loadDraft(draft)], ['Discard draft', discardDraft]] };
  return record;
}
function discardDraft() {
  const record = state.record; dropDraft(record);
  const source = record.id ? state.records.find(item => item.collection === record.collection && item.id === record.id) : state.newTemplate ?? blankRecord(record.collection);
  Object.assign(state, { record: normalize(structuredClone(source)), dirty: false, banner: null, undo: [], errors: {} });
  renderNav(); renderList(); rerender();
}
function loadDraft(draft) {
  checkpoint(); state.record.data = draft.data; state.record.body = draft.body; normalize(state.record);
  state.banner = null; changed(); rerender();
}
function newRecord(collection, template) {
  if (template && readDraft({ collection, id: '' }) && !window.confirm('Replace your other unsaved new entry?')) return;
  if (template) dropDraft({ collection, id: '' });
  state.newTemplate = template ?? blankRecord(collection);
  const hash = `#/${collection}/~new`;
  if (location.hash === hash) route(); else location.hash = hash;
  setTimeout(() => $('#f-title')?.focus());
}
function duplicate() {
  const copy = structuredClone(state.record);
  Object.assign(copy, { id: '', revision: null });
  Object.assign(copy.data, { slug: '', title: `${state.record.data.title} (copy)` });
  if (copy.collection === 'projects') Object.assign(copy.data, { selectedWorkOrder: nextOrder(), publicationState: 'draft' }); else copy.data.status = 'draft';
  newRecord(copy.collection, copy);
}

// ---------- layout ----------
function render() { renderNav(); renderList(); renderMain(); renderInspector(); }
function layout() {
  app.dataset.list = String(collections.includes(state.section));
  app.dataset.record = String(!!state.record);
  app.dataset.panel = state.record ? state.panel : 'none';
  app.dataset.drawer = String(state.drawer);
}
function renderNav() {
  const drafts = allDrafts();
  $('#navigation').replaceChildren(...kids(...Object.entries(sections).map(([key, title]) => h('a', { href: `#/${key}`, class: 'nav-item', 'aria-current': state.section === key ? 'page' : null },
    h('span', { text: title }),
    drafts.some(draft => draft.collection === key) && h('i', { class: 'dot', title: 'Unsaved changes in this browser' }),
    collections.includes(key) && h('small', { text: state.records.filter(record => record.collection === key).length })))));
  layout();
}
function sortedRecords(collection) {
  const records = state.records.filter(record => record.collection === collection);
  if (collection === 'projects') return records.sort((a, b) => a.data.selectedWorkOrder - b.data.selectedWorkOrder);
  if (collection === 'writing') return records.sort((a, b) => String(b.data.publicationDate).localeCompare(String(a.data.publicationDate)));
  const groups = ['Pages', 'Data', 'Interface'], group = record => groups.indexOf(siteInfo[record.id]?.[1] ?? 'Other') >>> 0;
  return records.sort((a, b) => group(a) - group(b) || recordTitle(a).localeCompare(recordTitle(b)));
}
function renderList() {
  const section = state.section;
  if (!collections.includes(section)) { list.replaceChildren(); return layout(); }
  const entries = h('ul', { class: 'entries' });
  const search = h('input', { type: 'search', class: 'list-search', placeholder: `Filter ${sections[section].toLowerCase()}…`, value: state.filter, 'aria-label': `Filter ${sections[section]}`, disabled: state.reorder });
  search.oninput = () => { state.filter = search.value; drawEntries(entries); };
  const statusFilter = section !== 'site' && !state.reorder && h('div', { class: 'seg compact', role: 'group', 'aria-label': 'Status' },
    [['all', 'All'], ['draft', 'Drafts'], ['published', 'Published']].map(([value, text]) => btn(text, () => { state.status = value; renderList(); }, null, { 'aria-pressed': String(state.status === value) })));
  list.replaceChildren(...kids(h('div', { class: 'list-head' },
    h('div', { class: 'list-title' }, h('h2', { text: sections[section] }),
      section === 'projects' && btn(state.reorder ? 'Done' : 'Reorder', () => { Object.assign(state, { reorder: !state.reorder, filter: '', status: 'all' }); renderList(); }, 'small ghost', { 'aria-pressed': String(state.reorder) }),
      section !== 'site' && btn('+ New', () => newRecord(section), 'small primary')),
    search, statusFilter,
    state.reorder && h('p', { class: 'hint', text: 'Drag the handles, or focus one and use ↑/↓. Order saves immediately; publish to go live.' })), entries));
  drawEntries(entries); layout();
}
function drawEntries(container) {
  const section = state.section, drafts = new Set(allDrafts().filter(draft => draft.collection === section).map(draft => draft.id));
  const records = sortedRecords(section), query = state.filter.trim().toLowerCase();
  const visible = records.filter(record => (!query || [recordTitle(record), record.id, record.data.summary ?? ''].join(' ').toLowerCase().includes(query)) && (state.status === 'all' || record.status === state.status));
  let group;
  container.replaceChildren(...kids(...visible.flatMap((record, index) => {
    const nodes = [];
    if (section === 'site' && siteInfo[record.id]?.[1] !== group) { group = siteInfo[record.id]?.[1]; nodes.push(h('li', { class: 'group-label', text: group ?? 'Other' })); }
    const active = state.record?.collection === record.collection && state.record.id === record.id;
    const first = record.data.media?.[0] ?? record.data.cover;
    const thumb = first && (first.poster || (!isVideo(first.source) && first.source));
    const meta = section === 'projects' ? [label(record.data.presentation ?? ''), record.data.year].filter(Boolean).join(' · ')
      : section === 'writing' ? [record.data.publicationDate, record.data.format].filter(Boolean).join(' · ') : siteInfo[record.id]?.[3] ?? '';
    const entry = h('a', { href: `#/${section}/${encodeURIComponent(record.id)}`, class: 'entry', 'aria-current': active ? 'page' : null },
      section !== 'site' && (thumb ? preview(thumb, 'thumb') : h('span', { class: 'thumb letter', text: recordTitle(record).charAt(0) })),
      h('span', { class: 'entry-text' }, h('strong', { text: recordTitle(record) }), h('small', { text: meta })),
      drafts.has(record.id) && h('i', { class: 'dot', title: 'Unsaved changes in this browser' }),
      section !== 'site' && h('span', { class: `status ${record.status}`, title: record.status, text: record.status === 'published' ? 'Live' : 'Draft' }));
    const item = h('li', { class: 'entry-row' });
    if (state.reorder) {
      const handle = btn('⠿', null, 'handle', { 'aria-label': `Reorder ${recordTitle(record)}. Use the up and down arrow keys.`, title: 'Drag to reorder', id: `order-${record.id}` });
      item.append(handle, entry);
      sortable(item, handle, { group: 'projects', index, count: records.length, onMove: (from, to) => moveProject(from, to, record.id) });
    } else item.append(entry);
    nodes.push(item); return nodes;
  })));
  if (!visible.length) container.append(h('li', { class: 'empty', text: records.length ? 'No matches.' : 'Nothing here yet.' }));
}
async function moveProject(from, to, id, undoing = false) {
  const records = sortedRecords('projects');
  if (state.ordering || to < 0 || to >= records.length || from === to) return;
  move(records, from, to); state.ordering = true; list.inert = true;
  try {
    state.records = await api('reorder-projects', { order: records.map(({ id: recordId, revision }) => ({ id: recordId, revision })) });
    if (state.record?.collection === 'projects') {
      const saved = state.records.find(item => item.id === state.record.id);
      if (saved && !state.dirty) state.record = normalize(structuredClone(saved));
      else if (saved) Object.assign(state.record, { revision: saved.revision }, { data: { ...state.record.data, selectedWorkOrder: saved.data.selectedWorkOrder } });
    }
    renderList();
    notify(undoing ? 'Order restored.' : 'Order saved locally. Publish to update the live portfolio.', undoing ? {} : { action: { label: 'Undo', run: () => moveProject(to, from, id, true) } });
  } catch (error) { notify(error.message, { error: true }); }
  finally { state.ordering = false; list.inert = false; document.getElementById(`order-${id}`)?.focus(); }
}

// Drag-to-reorder for any list; the handle starts the drag and also takes arrow keys.
function sortable(node, handle, { group, index, count, onMove, axis = 'y' }) {
  handle.addEventListener('pointerdown', () => { node.draggable = true; });
  handle.addEventListener('pointerup', () => { node.draggable = false; });
  handle.addEventListener('keydown', event => {
    const step = { ArrowUp: -1, ArrowLeft: -1, ArrowDown: 1, ArrowRight: 1 }[event.key];
    if (!step || (axis === 'y' && ['ArrowLeft', 'ArrowRight'].includes(event.key))) return;
    event.preventDefault();
    if (index + step >= 0 && index + step < count) onMove(index, index + step);
  });
  const after = event => { const box = node.getBoundingClientRect(); return axis === 'x' ? event.clientX > box.left + box.width / 2 : event.clientY > box.top + box.height / 2; };
  const clear = () => document.querySelectorAll('.drop-before, .drop-after').forEach(item => item.classList.remove('drop-before', 'drop-after'));
  node.addEventListener('dragstart', event => {
    if (!node.draggable) return;
    event.stopPropagation(); dragging = { group, index };
    event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', String(index)); node.classList.add('dragging');
  });
  node.addEventListener('dragend', () => { node.draggable = false; node.classList.remove('dragging'); dragging = null; clear(); });
  node.addEventListener('dragover', event => {
    if (dragging?.group !== group) return;
    event.preventDefault(); event.stopPropagation();
    const isAfter = after(event); node.classList.toggle('drop-after', isAfter); node.classList.toggle('drop-before', !isAfter);
  });
  node.addEventListener('dragleave', event => { if (!node.contains(event.relatedTarget)) node.classList.remove('drop-before', 'drop-after'); });
  node.addEventListener('drop', event => {
    if (dragging?.group !== group) return;
    event.preventDefault(); event.stopPropagation(); clear();
    const from = dragging.index; let to = index + (after(event) ? 1 : 0); if (from < to) to--;
    dragging = null; if (from !== to) onMove(from, to);
  });
}

// ---------- main area ----------
function renderMain() {
  layout();
  if (state.record) { main.replaceChildren(...kids(...editorView())); updateSaveState(); return; }
  if (state.section === 'media') return void mediaView().catch(error => notify(error.message, { error: true }));
  if (state.section === 'publish') return void publishView().catch(error => notify(error.message, { error: true }));
  main.replaceChildren(...kids(emptyView()));
}
function rerender() {
  const top = main.scrollTop, focused = document.activeElement?.id;
  renderMain(); main.scrollTop = top;
  if (focused) document.getElementById(focused)?.focus({ preventScroll: true });
  renderInspector();
}
function pageHead(title, description, ...actions) {
  return h('header', { class: 'page-head' }, h('div', {}, h('h1', { text: title }), description && h('p', { class: 'description', text: description })), actions.length > 0 && h('div', { class: 'actions' }, actions));
}
function emptyView() {
  const section = state.section;
  const drafts = allDrafts().map(draft => ({ ...draft, record: state.records.find(record => record.collection === draft.collection && record.id === draft.id) })).filter(draft => draft.record || draft.id === '~new');
  const descriptions = { projects: 'Case studies, demos, and briefs in your work archive.', writing: 'Notes and write-ups.', site: 'Every word, link, and label on the site — grouped by page.' };
  return h('div', { class: 'page empty-page' },
    pageHead(sections[section], descriptions[section], section !== 'site' && btn(`+ New ${section === 'projects' ? 'project' : 'article'}`, () => newRecord(section), 'primary')),
    h('div', { class: 'tips' },
      h('p', {}, 'Pick an entry from the list, or press ', h('kbd', { text: 'Ctrl K' }), ' to search every title, sentence, and field — then jump straight to it.'),
      h('p', {}, h('kbd', { text: 'Ctrl S' }), ' saves. Unsaved edits stay in this browser until you save or discard them.')),
    drafts.length > 0 && h('section', { class: 'drafts' }, h('h2', { text: 'Unsaved changes' }),
      h('ul', {}, drafts.map(draft => h('li', {}, h('a', { href: `#/${draft.collection}/${encodeURIComponent(draft.id)}`, text: draft.record ? recordTitle(draft.record) : `New ${draft.collection === 'projects' ? 'project' : 'article'}` }), h('small', { text: sections[draft.collection] }))))));
}
function editorView() {
  const record = state.record;
  const head = h('header', { class: 'editor-head' },
    h('a', { href: `#/${record.collection}`, class: 'back', 'aria-label': `Back to ${sections[record.collection]}`, text: '←' }),
    h('div', { class: 'head-title' }, h('p', { class: 'eyebrow', text: record.revision ? sections[record.collection] : `${sections[record.collection]} · new` }), h('h1', { id: 'record-title', text: recordTitle(record) })),
    h('div', { class: 'head-actions' },
      btn('Panel', togglePanelOpen, 'small ghost', { id: 'panel-btn', title: 'Outline, preview, and history', 'aria-pressed': String(panelOpen()) }),
      moreMenu(record),
      h('span', { id: 'save-state', class: 'save-state', role: 'status' }),
      btn('Save', save, 'primary', { id: 'save-btn', title: 'Save (Ctrl S)' })));
  const banner = state.banner && h('div', { class: 'banner' }, h('p', { text: state.banner.text }), state.banner.actions.map(([text, run]) => btn(text, run, 'small')));
  const errors = Object.entries(state.errors);
  const summary = errors.length > 0 && h('div', { class: 'error-summary', role: 'alert' }, h('strong', { text: `Fix ${errors.length === 1 ? 'this' : `these ${errors.length}`} before saving` }),
    h('ul', {}, errors.map(([path, message]) => h('li', {}, btn(`${path.split('.').map(label).join(' › ')}: ${message}`, () => focusPath(path.split('.')), 'link')))));
  return [head, h('div', { class: 'editor' }, banner, summary, editorSections(record).map(panelView), editorFooter(record))];
}
function moreMenu(record) {
  const path = previewPath(record);
  return h('details', { class: 'menu' }, h('summary', { 'aria-label': 'More actions', text: '•••' }),
    h('div', { class: 'menu-items' },
      path && h('a', { href: path, target: '_blank', rel: 'noopener', text: 'Open saved page ↗' }),
      record.collection !== 'site' && btn('Duplicate', duplicate),
      btn('Undo last change', undo, null, { disabled: !state.undo.length }),
      state.dirty && record.revision && btn('Discard unsaved changes', () => { if (window.confirm('Discard your unsaved changes to this entry?')) discardDraft(); }),
      record.collection !== 'site' && record.revision && btn('Delete…', deleteRecord, 'danger')));
}
document.addEventListener('click', event => document.querySelectorAll('details.menu[open]').forEach(menu => { if (!menu.contains(event.target) || event.target.closest('.menu-items button, .menu-items a')) menu.open = false; }));
function editorFooter(record) {
  return h('footer', { class: 'editor-foot' }, h('small', { text: record.revision ? `Saved to src/content/${record.collection}/${record.id}.${record.collection === 'site' ? 'json' : 'mdx'}. Publish to go live.` : 'The URL is created from the title when you first save.' }));
}
function panelView(section) {
  const collapsed = state.collapsed.has(section.id);
  return h('section', { class: `panel${collapsed ? ' collapsed' : ''}`, id: `panel-${section.id}` },
    h('header', { class: 'panel-head' },
      h('button', { type: 'button', class: 'panel-toggle', 'aria-expanded': String(!collapsed), onclick: () => collapsePanel(section.id) }, h('span', { class: 'chev', 'aria-hidden': 'true' }), h('h2', { text: section.title })),
      section.aside && h('small', { text: section.aside })),
    h('div', { class: 'panel-body', hidden: collapsed }, section.render()));
}
function collapsePanel(id, force) {
  const collapse = force ?? !state.collapsed.has(id);
  if (collapse) state.collapsed.add(id); else state.collapsed.delete(id);
  setPref('collapsed', JSON.stringify([...state.collapsed]));
  const panel = document.getElementById(`panel-${id}`); if (!panel) return;
  panel.classList.toggle('collapsed', collapse); panel.querySelector('.panel-body').hidden = collapse;
  panel.querySelector('.panel-toggle').setAttribute('aria-expanded', String(!collapse));
}
const wide = () => matchMedia('(min-width: 1101px)').matches;
const panelOpen = () => state.panel !== 'none' && (wide() || state.drawer);
function showPanel(id) {
  state.panel = id; state.drawer = !wide(); setPref('panel', id); setPref('lastPanel', id);
  renderInspector(); $('#panel-btn')?.setAttribute('aria-pressed', 'true');
}
function hidePanel() {
  if (wide()) { state.panel = 'none'; setPref('panel', 'none'); } else state.drawer = false;
  renderInspector(); $('#panel-btn')?.setAttribute('aria-pressed', 'false'); $('#panel-btn')?.focus();
}
function closeDrawer() { if (state.drawer) { state.drawer = false; renderInspector(); } }
function togglePanelOpen() { if (panelOpen()) hidePanel(); else showPanel(state.panel !== 'none' ? state.panel : pref('lastPanel', 'outline')); }

// ---------- editor sections ----------
function requirements(data) {
  const caseStudy = data.presentation === 'case-study';
  return { year: caseStudy, completedAt: caseStudy, role: caseStudy, duration: caseStudy, technologies: caseStudy, links: caseStudy, media: data.presentation !== 'brief', highlights: data.presentation === 'brief' };
}
function editorSections(record) {
  const data = record.data;
  const updateTitle = () => { $('#record-title').textContent = recordTitle(record); };
  if (record.collection === 'projects') {
    const need = requirements(data), why = need.year ? 'Needed for a case study' : null;
    const suggestions = key => [...(key === 'technologies' ? technologies : projectTypes), ...state.records.filter(item => item.collection === 'projects').flatMap(item => item.data[key] ?? [])];
    return [
      { id: 'basics', title: 'Basics', render: () => [
        textField(data, 'title', { label: 'Project name', path: ['title'], required: true, className: 'title-field', oninput: updateTitle, hint: record.id ? `Page URL: /work/${record.id}` : 'The page URL is created from the name when you first save.' }),
        textField(data, 'summary', { label: 'Short description', path: ['summary'], multiline: true, count: 160, required: true }),
        h('div', { class: 'fields' },
          segmented(data, 'presentation', [['case-study', 'Case study'], ['demo', 'Demo'], ['brief', 'Brief']], { label: 'Page type', path: ['presentation'], onchange: rerender }),
          segmented(data, 'publicationState', [['draft', 'Draft'], ['published', 'Published']], { label: 'Status', path: ['publicationState'] }))] },
      { id: 'details', title: 'Details', render: () => h('div', { class: 'fields' },
        textField(data, 'year', { label: 'Year', path: ['year'], type: 'number', required: why }),
        textField(data, 'completedAt', { label: 'Completed', path: ['completedAt'], type: 'month', required: why }),
        textField(data, 'role', { label: 'Your role', path: ['role'], required: why }),
        textField(data, 'duration', { label: 'Time spent', path: ['duration'], required: why, placeholder: 'e.g. 6 weeks' })) },
      { id: 'highlights', title: 'Highlights', aside: need.highlights ? 'Needed for a brief' : 'Optional', render: () => stringList(data.highlights, { label: 'Highlights', path: ['highlights'], placeholder: 'One concrete outcome or detail', itemLabel: 'highlight', bare: true }) },
      { id: 'tags', title: 'Types & stack', render: () => [
        chips(data, 'categories', { label: 'Project types', path: ['categories'], suggestions: suggestions('categories'), required: true }),
        chips(data, 'technologies', { label: 'Tech stack', path: ['technologies'], suggestions: suggestions('technologies'), presets: stackPresets, required: why })] },
      { id: 'links', title: 'Links', aside: need.links ? 'At least one needed for a case study' : 'Optional', render: () => h('div', { class: 'fields' },
        ['live', 'repository', 'devpost'].map(key => textField(data.links, key, { label: label(key), path: ['links', key], placeholder: 'https://' }))) },
      { id: 'media', title: 'Images & videos', aside: `${data.media.length} item${data.media.length === 1 ? '' : 's'}${need.media ? ' · at least one needed' : ''}`, render: () => projectMedia(record) },
      { id: 'body', title: 'Case study', render: () => bodyEditor(record) },
    ];
  }
  if (record.collection === 'writing') {
    const series = [...new Set(state.records.filter(item => item.collection === 'writing').map(item => item.data.series).filter(Boolean))];
    return [
      { id: 'basics', title: 'Basics', render: () => [
        textField(data, 'title', { label: 'Article title', path: ['title'], required: true, className: 'title-field', oninput: updateTitle, hint: record.id ? `Page URL: /writing/${record.id}` : 'The page URL is created from the title when you first save.' }),
        textField(data, 'summary', { label: 'Summary', path: ['summary'], multiline: true, count: 200, required: true }),
        h('div', { class: 'fields' },
          segmented(data, 'format', [['Note', 'Note'], ['Write-up', 'Write-up']], { label: 'Format', path: ['format'] }),
          segmented(data, 'status', [['draft', 'Draft'], ['published', 'Published']], { label: 'Status', path: ['status'] }))] },
      { id: 'details', title: 'Details', render: () => h('div', { class: 'fields' },
        textField(data, 'publicationDate', { label: 'Publish date', path: ['publicationDate'], type: 'date', required: true }),
        textField(data, 'readingMinutes', { label: 'Reading time (minutes)', path: ['readingMinutes'], type: 'number', placeholder: 'Optional' }),
        textField(data, 'series', { label: 'Series', path: ['series'], placeholder: 'Optional', options: series })) },
      { id: 'tags', title: 'Tags', render: () => chips(data, 'tags', { label: 'Tags', path: ['tags'], required: true, suggestions: state.records.filter(item => item.collection === 'writing').flatMap(item => item.data.tags ?? []) }) },
      { id: 'cover', title: 'Cover', aside: 'Optional', render: () => data.cover
        ? mediaField(data, 'cover', { label: 'Cover image', path: ['cover'], onRemove: () => { checkpoint(); delete data.cover; changed(); rerender(); } })
        : btn('+ Add a cover image', () => chooseMedia(async source => { data.cover = { type: 'image', source: '', poster: '', alt: mediaDescription(source), caption: '', aspectRatio: { width: 0, height: 0 }, narrativeRole: 'hero' }; await applySource(data.cover, source); changed(); rerender(); }, { visual: true })) },
      { id: 'body', title: 'Article', render: () => bodyEditor(record) },
    ];
  }
  const shape = state.settings.shapes[record.id];
  if (Array.isArray(data)) return [{ id: `site-${record.id}`, title: recordTitle(record), aside: `${data.length} items`, render: () => genericField(record, 'data', [], shape, recordTitle(record), true) }];
  const copyKeys = Object.keys(data).filter(key => typeof data[key] !== 'object' || data[key] === null);
  const groups = Object.keys(data).filter(key => !copyKeys.includes(key));
  return [
    copyKeys.length > 0 && { id: 'copy', title: groups.length ? 'Text & links' : 'Copy', aside: `${copyKeys.length} fields`, render: () => copyPanel(data, copyKeys, shape) },
    ...groups.map(key => ({ id: `site-${key}`, title: label(key), aside: Array.isArray(data[key]) ? `${data[key].length} items` : null, render: () => genericField(data, key, [key], shape?.[key], label(key), true) })),
  ].filter(Boolean);
}
function copyPanel(data, keys, shape) {
  const fields = h('div', { class: 'fields copy' }, keys.map(key => textField(data, key, { label: label(key), path: [key], shape: shape?.[key] })));
  if (keys.length <= 8) return fields;
  const filter = h('input', { type: 'search', class: 'panel-filter', placeholder: 'Filter these fields by label or text…', 'aria-label': 'Filter fields' });
  filter.oninput = () => {
    const query = filter.value.toLowerCase();
    for (const field of fields.children) field.hidden = !!query && !`${field.dataset.filter} ${field.querySelector('input, textarea')?.value ?? ''}`.toLowerCase().includes(query);
  };
  return [filter, fields];
}

// ---------- field components ----------
function fieldError(path) { return state.errors[path.join('.')]; }
function textField(obj, key, { label: text, path, multiline, type, hint, count, placeholder, required, shape, className, oninput, options } = {}) {
  const id = fid(path), value = obj[key], error = fieldError(path);
  const boolean = typeof value === 'boolean';
  const kind = type ?? (shape === 'number' || typeof value === 'number' ? 'number' : boolean ? 'checkbox' : 'text');
  const long = multiline ?? (kind === 'text' && typeof value === 'string' && (value.length > 60 || /summary|description|paragraph|body|intro|note|highlight/i.test(key)));
  const input = long ? h('textarea', { id, rows: 2 }) : h('input', { id, type: kind });
  if (boolean) input.checked = value; else input.value = value ?? '';
  if (placeholder) input.placeholder = placeholder;
  if (error) { input.setAttribute('aria-invalid', 'true'); input.setAttribute('aria-describedby', `${id}-error`); }
  const listId = options?.length ? `${id}-options` : key === 'timeZone' ? 'time-zones' : null;
  if (listId) input.setAttribute('list', listId);
  const counter = count && h('small', { class: 'counter' });
  const linkish = /^(href|live|repository|devpost|resumeUrl|calUrl|source|poster)$/.test(key) || /url|image/i.test(key) || /^https?_/.test(key) || /^(https?:|mailto:)/.test(value ?? '');
  const link = linkish && h('a', { class: 'field-link', target: '_blank', rel: 'noopener', text: 'Open ↗' });
  const chooser = (/^(poster|resumeUrl|og_image|twitter_image|source)$/.test(key) || mediaPattern.test(value ?? '')) &&
    btn('Library', () => chooseMedia(source => { input.value = source; input.dispatchEvent(new Event('input')); }), 'small ghost');
  const sync = () => {
    if (counter) { counter.textContent = `${input.value.length}/${count}`; counter.classList.toggle('over', input.value.length > count); }
    if (link) { link.href = input.value; link.hidden = !/^(https?:|mailto:|\/[^/])/.test(input.value); }
  };
  input.addEventListener('input', () => {
    obj[key] = boolean ? input.checked : kind === 'number' ? (input.value === '' ? '' : Number(input.value)) : input.value;
    changed(); sync(); oninput?.(input.value);
  });
  sync();
  return h('div', { class: `field${long ? ' wide' : ''}${error ? ' invalid' : ''}${className ? ` ${className}` : ''}${boolean ? ' check' : ''}`, 'data-filter': `${text} ${key}`.toLowerCase() },
    h('div', { class: 'label-row' }, h('label', { htmlFor: id, text, title: text }), required && h('span', { class: 'req', text: required === true ? 'Required' : required }), counter, link, chooser),
    input, listId && listId !== 'time-zones' && h('datalist', { id: listId }, options.map(option => h('option', { value: option }))),
    hint && h('p', { class: 'hint', text: hint }), error && h('p', { class: 'error-text', id: `${id}-error`, text: error }));
}
function segmented(obj, key, options, { label: text, path, onchange }) {
  const name = fid(path);
  return h('fieldset', { class: 'field segmented', id: name },
    h('legend', { class: 'field-label', text }),
    h('div', { class: 'seg' }, options.map(([value, caption]) => h('label', {},
      h('input', { type: 'radio', name, value, checked: obj[key] === value, onchange: () => { checkpoint(); obj[key] = value; changed(); onchange?.(); } }),
      h('span', { text: caption })))));
}
function chips(obj, key, { label: text, path, suggestions = [], presets, required }) {
  const box = h('div', { class: `field wide chips-field${fieldError(path) ? ' invalid' : ''}`, id: fid(path) });
  const draw = refocus => {
    const values = obj[key] = (obj[key] ?? []).filter(value => typeof value === 'string' && value.trim());
    const input = h('input', { type: 'text', id: `${fid(path)}-input`, placeholder: values.length ? 'Add another…' : 'Type and press Enter…', autocomplete: 'off' });
    const add = value => {
      value = value.trim();
      if (value && !values.some(item => item.toLowerCase() === value.toLowerCase())) { obj[key] = [...values, value]; changed(); }
      draw(true);
    };
    input.onkeydown = event => {
      if ((event.key === 'Enter' || event.key === ',') && input.value.trim()) { event.preventDefault(); add(input.value); }
      else if (event.key === 'Backspace' && !input.value && values.length) { obj[key] = values.slice(0, -1); changed(); draw(true); }
    };
    const chipNodes = values.map((value, index) => {
      const chip = h('span', { class: 'chip', title: 'Drag to reorder' }, h('span', { text: value }),
        btn('×', () => { checkpoint(); obj[key] = values.filter(item => item !== value); changed(); draw(true); }, 'chip-remove', { 'aria-label': `Remove ${value}` }));
      sortable(chip, chip, { group: path.join('.'), index, count: values.length, axis: 'x', onMove: (from, to) => { move(values, from, to); changed(); draw(); } });
      return chip;
    });
    const pool = [...new Set(suggestions.filter(Boolean))].filter(item => !values.includes(item));
    const suggestionBox = h('div', { class: 'suggestions' });
    const drawSuggestions = () => {
      const query = input.value.trim().toLowerCase();
      const matches = pool.filter(item => item.toLowerCase().includes(query)).slice(0, query ? 24 : 16);
      suggestionBox.replaceChildren(...kids(...matches.map(item => btn(`+ ${item}`, () => add(item), 'suggestion')), query && !matches.some(item => item.toLowerCase() === query) && btn(`+ Add “${input.value.trim()}”`, () => add(input.value), 'suggestion new')));
    };
    input.oninput = drawSuggestions; drawSuggestions();
    const preset = presets && h('select', { 'aria-label': 'Add a prebuilt stack', onchange: event => { const stack = presets[event.target.value]; if (stack) { obj[key] = [...new Set([...values, ...stack])]; changed(); draw(true); } } },
      h('option', { value: '', text: 'Add a prebuilt stack…' }), Object.keys(presets).map(name => h('option', { value: name, text: name })));
    const error = fieldError(path);
    box.replaceChildren(...kids(
      h('div', { class: 'label-row' }, h('label', { htmlFor: input.id, text }), required && h('span', { class: 'req', text: required === true ? 'Required' : required }), preset),
      h('div', { class: 'chip-input', onclick: event => { if (event.target === event.currentTarget) input.focus(); } }, chipNodes, input),
      suggestionBox, error && h('p', { class: 'error-text', text: error })));
    if (refocus) input.focus();
  };
  draw(); return box;
}
function stringList(items, { label: text, path, placeholder = '', itemLabel = 'item', bare }) {
  const box = h('div', { class: 'string-list wide', id: fid(path) });
  const draw = focus => {
    const rows = items.map((value, index) => {
      const id = fid([...path, index]);
      const input = h('textarea', { id, rows: 1, value, placeholder, 'aria-label': `${text} ${index + 1}` });
      input.oninput = () => { items[index] = input.value; changed(); };
      input.onkeydown = event => {
        const step = event.altKey && { ArrowUp: -1, ArrowDown: 1 }[event.key];
        if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); checkpoint(); items.splice(index + 1, 0, ''); changed(); draw(index + 1); }
        else if (event.key === 'Backspace' && !input.value) { event.preventDefault(); checkpoint(); items.splice(index, 1); changed(); draw(Math.max(0, index - 1)); }
        else if (step && items[index + step] !== undefined) { event.preventDefault(); checkpoint(); move(items, index, index + step); changed(); draw(index + step); }
      };
      const handle = btn('⠿', null, 'handle', { 'aria-label': `Reorder ${text} ${index + 1}`, title: 'Drag, or press Alt+↑/↓ in the field' });
      const row = h('li', { class: `list-row${fieldError([...path, index]) ? ' invalid' : ''}` }, handle, input,
        btn('×', () => { checkpoint(); items.splice(index, 1); changed(); draw(); notify('Item removed.', { action: { label: 'Undo', run: undo } }); }, 'icon ghost', { 'aria-label': `Remove ${text} ${index + 1}` }));
      sortable(row, handle, { group: items, index, count: items.length, onMove: (from, to) => { checkpoint(); move(items, from, to); changed(); draw(to); } });
      return row;
    });
    box.replaceChildren(...kids(!bare && h('div', { class: 'label-row' }, h('span', { class: 'field-label', text })),
      rows.length ? h('ol', { class: 'rows' }, rows) : h('p', { class: 'hint', text: 'Nothing yet.' }),
      btn(`+ Add ${itemLabel}`, () => { checkpoint(); items.push(''); changed(); draw(items.length - 1); }, 'small add'),
      rows.length > 0 && h('p', { class: 'hint', text: 'Enter adds a row below · Backspace on an empty row removes it · Alt+↑/↓ moves.' })));
    if (focus != null) document.getElementById(fid([...path, focus]))?.focus();
  };
  draw(); return box;
}
function itemTitle(item, index) {
  if (!item || typeof item !== 'object') return `Item ${index + 1}`;
  const name = ['title', 'company', 'label', 'school', 'name', 'alt', 'slug'].map(key => item[key]).find(value => typeof value === 'string' && value.trim());
  return [item.year, name].filter(Boolean).join(' · ') || `Item ${index + 1}`;
}
const blank = value => Array.isArray(value) ? [] : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key, item]) => [key, blank(item)])) : typeof value === 'number' ? 0 : typeof value === 'boolean' ? false : '';
const fromShape = shape => Array.isArray(shape) ? [] : typeof shape === 'object' ? Object.fromEntries(Object.entries(shape).map(([key, item]) => [key, fromShape(item)])) : shape === 'number' ? 0 : shape === 'boolean' ? false : '';
function objectList(items, { label: text, path, template, renderItem, bare }) {
  const box = h('div', { class: 'object-list wide', id: fid(path) });
  const draw = focus => {
    const rows = items.map((item, index) => {
      const open = openItems.get(item) ?? false, id = fid([...path, index]);
      const title = h('span', { class: 'item-title', text: itemTitle(item, index) });
      const body = h('div', { class: 'item-body', hidden: !open }, open && renderItem(item, index));
      const toggle = h('button', { type: 'button', class: 'item-toggle', id: `${id}-toggle`, 'aria-expanded': String(open) }, h('span', { class: 'chev', 'aria-hidden': 'true' }), title);
      toggle.onclick = () => {
        const next = body.hidden; openItems.set(item, next); body.hidden = !next; row.classList.toggle('open', next);
        toggle.setAttribute('aria-expanded', String(next)); if (next && !body.childElementCount) body.append(renderItem(item, index));
      };
      body.addEventListener('input', () => { title.textContent = itemTitle(item, index); });
      const step = delta => { checkpoint(); move(items, index, index + delta); changed(); draw(index + delta); };
      const handle = btn('⠿', null, 'handle', { 'aria-label': `Reorder ${itemTitle(item, index)}`, title: 'Drag to reorder' });
      const row = h('li', { class: `item${open ? ' open' : ''}` },
        h('div', { class: 'item-head' }, handle, toggle, h('div', { class: 'item-tools' },
          btn('↑', () => step(-1), 'icon ghost', { disabled: index === 0, 'aria-label': 'Move up', title: 'Move up' }),
          btn('↓', () => step(1), 'icon ghost', { disabled: index === items.length - 1, 'aria-label': 'Move down', title: 'Move down' }),
          btn('⧉', () => { checkpoint(); const copy = structuredClone(item); items.splice(index + 1, 0, copy); openItems.set(copy, true); changed(); draw(index + 1); }, 'icon ghost', { 'aria-label': 'Duplicate', title: 'Duplicate' }),
          btn('×', () => { checkpoint(); items.splice(index, 1); changed(); draw(); notify(`Removed “${itemTitle(item, index)}”.`, { action: { label: 'Undo', run: undo } }); }, 'icon ghost danger', { 'aria-label': 'Remove', title: 'Remove' }))),
        body);
      sortable(row, handle, { group: items, index, count: items.length, onMove: (from, to) => { checkpoint(); move(items, from, to); changed(); draw(to); } });
      return row;
    });
    box.replaceChildren(...kids(
      h('div', { class: 'list-tools' }, !bare && h('span', { class: 'field-label', text }), h('small', { text: bare ? '' : `${items.length} item${items.length === 1 ? '' : 's'}` }),
        items.length > 1 && btn('Expand all', () => { items.forEach(item => openItems.set(item, true)); draw(); }, 'small ghost'),
        items.length > 1 && btn('Collapse all', () => { items.forEach(item => openItems.set(item, false)); draw(); }, 'small ghost')),
      h('ol', { class: 'items' }, rows),
      btn('+ Add item', () => { checkpoint(); const next = template(); items.push(next); openItems.set(next, true); changed(); draw(items.length - 1); }, 'small add')));
    if (focus != null) document.getElementById(`${fid([...path, focus])}-toggle`)?.focus();
  };
  draw(); return box;
}
function genericField(parent, key, path, shape, text, bare) {
  const value = parent[key];
  if (Array.isArray(value)) {
    const itemShape = Array.isArray(shape) ? shape[0] : undefined;
    if (itemShape === 'string' || (itemShape === undefined && typeof (value[0] ?? '') === 'string')) return stringList(value, { label: text, path, bare });
    return objectList(value, { label: text, path, bare, template: () => itemShape ? fromShape(itemShape) : blank(value[0]), renderItem: (item, index) => objectFields(item, [...path, index], itemShape) });
  }
  if (value && typeof value === 'object') {
    if ('source' in value && 'alt' in value) return mediaField(parent, key, { label: text, path });
    return bare ? objectFields(value, path, shape) : h('fieldset', { class: 'group wide', id: fid(path) }, h('legend', { text }), objectFields(value, path, shape));
  }
  return textField(parent, key, { label: text, path, shape });
}
function objectFields(obj, path, shape) {
  return h('div', { class: 'fields' }, Object.keys(obj).map(key => genericField(obj, key, [...path, key], shape?.[key], label(key))));
}

// ---------- media ----------
function mediaDescription(name) { return decodeURIComponent(name.split('/').pop().split('?')[0]).replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || 'Project media'; }
function readMediaInfo(source, type, withPoster = false) {
  return new Promise((resolve, reject) => {
    const media = document.createElement(type === 'video' ? 'video' : 'img');
    if (type === 'video') { media.preload = 'auto'; media.muted = true; media.playsInline = true; }
    const release = () => { media.onload = null; media.onloadeddata = null; media.onerror = null; if (type === 'video') { media.removeAttribute('src'); media.load(); } };
    media.onerror = () => { release(); reject(new Error('This browser could not read the file. Try a PNG/JPEG image or an MP4/WebM video.')); };
    const loaded = async () => {
      try {
        const width = media.videoWidth || media.naturalWidth, height = media.videoHeight || media.naturalHeight;
        if (!width || !height) throw new Error('Media dimensions could not be read.');
        let poster;
        if (type === 'video' && withPoster) {
          const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
          canvas.getContext('2d').drawImage(media, 0, 0);
          poster = await new Promise((done, fail) => canvas.toBlob(blob => blob ? done(blob) : fail(new Error('Could not create the video thumbnail.')), 'image/png'));
        }
        resolve({ aspectRatio: { width, height }, poster });
      } catch (error) { reject(error); } finally { release(); }
    };
    if (type === 'video') media.onloadeddata = loaded; else media.onload = loaded;
    media.src = source;
  });
}
async function applySource(media, source) {
  media.source = source; media.type = isVideo(source) ? 'video' : 'image';
  try { media.aspectRatio = (await readMediaInfo(source, media.type)).aspectRatio; }
  catch { notify('Media selected, but its size could not be read. Enter width and height under More.', { error: true }); }
}
async function upload(file) {
  const response = await fetch(`/__studio/api/upload?name=${encodeURIComponent(file.name)}`, { method: 'POST', headers: { 'x-studio-token': token }, body: file });
  const result = await response.json(); if (!response.ok) throw new Error(result.error); return result;
}
function setBusy(busy) { app.inert = busy; app.classList.toggle('busy', busy); }
function mediaDetails(media, path) {
  const size = media.aspectRatio;
  return h('details', { class: 'more' }, h('summary', { text: 'More settings' }),
    textField(media, 'caption', { label: 'Caption', path: [...path, 'caption'], placeholder: 'Optional', multiline: true }),
    h('div', { class: 'field' }, h('label', { htmlFor: fid([...path, 'narrativeRole']), text: 'Role in story' }),
      h('select', { id: fid([...path, 'narrativeRole']), onchange: event => { media.narrativeRole = event.target.value; changed(); } },
        ['hero', 'flow', 'detail', 'evidence'].map(role => h('option', { value: role, text: label(role), selected: media.narrativeRole === role })))),
    h('div', { class: 'fields' },
      textField(size, 'width', { label: 'Width', path: [...path, 'aspectRatio', 'width'], type: 'number' }),
      textField(size, 'height', { label: 'Height', path: [...path, 'aspectRatio', 'height'], type: 'number' })),
    media.type === 'video' && textField(media, 'poster', { label: 'Poster image', path: [...path, 'poster'] }),
    textField(media, 'source', { label: 'File', path: [...path, 'source'] }));
}
function mediaField(parent, key, { label: text, path, onRemove }) {
  const media = parent[key];
  const box = h('div', { class: 'media-field wide', id: fid(path) });
  const draw = () => box.replaceChildren(...kids(
    h('div', { class: 'media-field-preview' }, preview(media.poster || media.source)),
    h('div', { class: 'media-field-body' },
      h('div', { class: 'label-row' }, h('span', { class: 'field-label', text }), h('small', { text: [media.type, media.aspectRatio?.width && `${media.aspectRatio.width}×${media.aspectRatio.height}`].filter(Boolean).join(' · ') })),
      h('div', { class: 'actions' }, btn(media.source ? 'Replace…' : 'Choose…', () => chooseMedia(async source => { await applySource(media, source); changed(); draw(); }, { visual: true }), 'small'), onRemove && btn('Remove', onRemove, 'small ghost danger')),
      textField(media, 'alt', { label: 'Description (alt text)', path: [...path, 'alt'], required: true }),
      mediaDetails(media, path))));
  draw(); return box;
}
function projectMedia(record) {
  const data = record.data;
  const box = h('div', { class: 'project-media', id: 'f-media' });
  const grid = h('ol', { class: 'media-cards' });
  const fixRoles = () => { if (data.media[0]) data.media[0].narrativeRole = 'hero'; for (const item of data.media.slice(1)) if (item.narrativeRole === 'hero') item.narrativeRole = 'detail'; };
  const relocate = (from, to) => { checkpoint(); move(data.media, from, to); fixRoles(); changed(); draw(); document.getElementById(`media-handle-${to}`)?.focus(); };
  const draw = () => {
    grid.replaceChildren(...kids(...data.media.map((media, index) => {
      const path = ['media', index];
      const handle = h('button', { type: 'button', class: 'media-handle', id: `media-handle-${index}`, 'aria-label': `Media ${index + 1}. Drag or use arrow keys to reorder.`, title: 'Drag to reorder' }, preview(media.poster || media.source), h('span', { class: 'badge', text: index === 0 ? 'Cover' : `${index + 1}` }));
      const card = h('li', { class: `media-card-edit${fieldError(path) || fieldError([...path, 'alt']) ? ' invalid' : ''}` }, handle,
        h('div', { class: 'card-meta' }, h('small', { text: `${media.type === 'video' ? 'Video' : 'Image'} · ${media.aspectRatio.width}×${media.aspectRatio.height}` }),
          h('div', { class: 'item-tools' },
            btn('←', () => relocate(index, index - 1), 'icon ghost', { disabled: index === 0, 'aria-label': 'Move earlier' }),
            btn('→', () => relocate(index, index + 1), 'icon ghost', { disabled: index === data.media.length - 1, 'aria-label': 'Move later' }),
            index > 0 && btn('★', () => relocate(index, 0), 'icon ghost', { 'aria-label': 'Use as cover', title: 'Use as cover' }),
            btn('×', () => { checkpoint(); data.media.splice(index, 1); fixRoles(); changed(); draw(); notify('Media removed from this project (the file stays in the library).', { action: { label: 'Undo', run: undo } }); }, 'icon ghost danger', { 'aria-label': 'Remove from project' }))),
        textField(media, 'alt', { label: 'Description', path: [...path, 'alt'], multiline: true }),
        mediaDetails(media, path));
      sortable(card, handle, { group: data.media, index, count: data.media.length, axis: 'x', onMove: relocate });
      return card;
    })));
    const aside = document.querySelector('#panel-media .panel-head small'); if (aside) aside.textContent = `${data.media.length} item${data.media.length === 1 ? '' : 's'}`;
  };
  const addFiles = async files => {
    if (!files.length) return;
    setBusy(true); const errors = []; let added = 0;
    try {
      for (const [index, file] of [...files].entries()) {
        notify(`Adding ${index + 1} of ${files.length}: ${file.name}…`);
        const objectUrl = URL.createObjectURL(file);
        try {
          if (!/\.(png|jpe?g|webp|gif|avif|svg|mp4|webm|mov)$/i.test(file.name)) throw new Error('Choose an image or video.');
          const type = isVideo(file.name) ? 'video' : 'image';
          const info = await readMediaInfo(objectUrl, type, type === 'video');
          const saved = await upload(file);
          const media = { type, source: saved.source, poster: '', alt: mediaDescription(file.name), caption: '', aspectRatio: info.aspectRatio, narrativeRole: 'detail' };
          if (info.poster) media.poster = (await upload(new File([info.poster], `${file.name}-poster.png`, { type: 'image/png' }))).source;
          if (!added) checkpoint();
          data.media.push(media); fixRoles(); added++;
        } catch (error) { errors.push(`${file.name}: ${error.message}`); } finally { URL.revokeObjectURL(objectUrl); }
      }
    } finally { setBusy(false); input.value = ''; if (added) changed(); draw(); }
    notify(`${added} ${added === 1 ? 'file' : 'files'} added. Check the descriptions, then save.${errors.length ? `\n${errors.join('\n')}` : ''}`, { error: errors.length > 0 });
  };
  const input = h('input', { type: 'file', multiple: true, accept: '.png,.jpg,.jpeg,.webp,.gif,.avif,.svg,.mp4,.webm,.mov', id: 'media-files', class: 'visually-hidden', onchange: () => addFiles(input.files) });
  const zone = h('label', { class: 'dropzone', htmlFor: 'media-files' }, h('strong', { text: 'Drop images or videos here, or click to choose' }), h('span', { text: 'Sizes and video thumbnails are automatic. The first item is the cover.' }));
  box.ondragover = event => { if (dragging || !event.dataTransfer.types.includes('Files')) return; event.preventDefault(); zone.classList.add('is-over'); };
  box.ondragleave = event => { if (!box.contains(event.relatedTarget)) zone.classList.remove('is-over'); };
  box.ondrop = event => { if (!event.dataTransfer.files.length) return; event.preventDefault(); zone.classList.remove('is-over'); void addFiles(event.dataTransfer.files); };
  const library = btn('Choose from library…', () => chooseMedia(async source => {
    setBusy(true);
    try {
      const existing = state.records.flatMap(item => [...(item.data.media ?? []), ...(item.data.cover ? [item.data.cover] : [])]).find(item => item.source === source);
      const media = existing ? { poster: '', caption: '', ...structuredClone(existing) } : { type: 'image', source: '', poster: '', alt: mediaDescription(source), caption: '', aspectRatio: { width: 0, height: 0 }, narrativeRole: 'detail' };
      if (!existing) await applySource(media, source);
      checkpoint(); data.media.push(media); fixRoles(); changed(); draw();
    } finally { setBusy(false); }
  }, { visual: true }), 'small');
  box.append(input, h('div', { class: 'media-actions' }, zone, library), grid);
  draw(); return box;
}

// ---------- body editor ----------
function bodyEditor(record) {
  const area = h('textarea', { id: 'f-body', class: 'body-editor', spellcheck: true, value: record.body ?? '', 'aria-label': record.collection === 'projects' ? 'Case study' : 'Article' });
  const stats = h('small', { class: 'counter' });
  const sync = () => { const words = (area.value.match(/\S+/g) ?? []).length; stats.textContent = `${words} words · ~${Math.max(1, Math.round(words / 230))} min read`; };
  const commit = () => { area.focus(); area.dispatchEvent(new Event('input')); };
  const wrap = (before, after = '', fallback = '') => {
    const start = area.selectionStart, end = area.selectionEnd, selected = area.value.slice(start, end) || fallback;
    area.setRangeText(before + selected + after, start, end, 'end');
    area.setSelectionRange(start + before.length, start + before.length + selected.length); commit();
  };
  const linePrefix = prefix => { const start = area.value.lastIndexOf('\n', area.selectionStart - 1) + 1; area.setRangeText(prefix, start, start, 'end'); commit(); };
  area.oninput = () => { record.body = area.value; changed(); sync(); };
  area.onkeydown = event => {
    if (!(event.ctrlKey || event.metaKey)) return;
    if (event.key === 'b') { event.preventDefault(); wrap('**', '**', 'bold'); }
    if (event.key === 'i') { event.preventDefault(); wrap('*', '*', 'italic'); }
  };
  const tools = [['H2', () => linePrefix('## ')], ['H3', () => linePrefix('### ')], ['Bold', () => wrap('**', '**', 'bold')], ['Italic', () => wrap('*', '*', 'italic')],
    ['Link', () => wrap('[', '](https://)', 'link text')], ['List', () => linePrefix('- ')], ['Quote', () => linePrefix('> ')], ['Code', () => wrap('`', '`', 'code')],
    ['Media…', () => chooseMedia(source => isVideo(source) ? wrap(`\n<video controls src="${source}" />\n`) : wrap('\n![', `](${source})\n`, 'Describe this image'), { visual: true })]];
  sync();
  return h('div', { class: 'field wide body-field' },
    h('div', { class: 'toolbar', role: 'toolbar', 'aria-label': 'Formatting' }, tools.map(([text, run]) => btn(text, run, 'small ghost')), stats),
    area, h('p', { class: 'hint', text: 'Markdown and MDX. Ctrl B / Ctrl I format the selection. Headings show up in the Outline panel.' }));
}
function jumpToBody(offset, length = 0) {
  const area = $('#f-body'); if (!area) return;
  collapsePanel('body', false);
  const style = getComputedStyle(area);
  const mirror = h('div', { style: `position:absolute;visibility:hidden;white-space:pre-wrap;overflow-wrap:break-word;width:${area.clientWidth}px;font:${style.font};padding:${style.padding};line-height:${style.lineHeight}` });
  mirror.textContent = area.value.slice(0, offset); document.body.append(mirror);
  const caret = mirror.scrollHeight; mirror.remove();
  if (area.scrollHeight > area.clientHeight + 4) area.scrollTop = Math.max(0, caret - area.clientHeight / 3);
  else main.scrollTo({ top: area.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop + caret - main.clientHeight / 3 });
  area.focus({ preventScroll: true }); area.setSelectionRange(offset, offset + length);
}

// ---------- focus / errors ----------
function focusPath(path, query) {
  if (path[0] === 'body') {
    const at = query ? (state.record.body ?? '').toLowerCase().indexOf(query.toLowerCase()) : 0;
    return jumpToBody(Math.max(0, at), at >= 0 && query ? query.length : 0);
  }
  let cursor = state.record.data;
  for (const segment of path) { if (Array.isArray(cursor) && cursor[segment]) openItems.set(cursor[segment], true); cursor = cursor?.[segment]; }
  rerender();
  let node;
  for (let length = path.length; !node && length > 0; length--) {
    const id = fid(path.slice(0, length));
    node = document.getElementById(id) ?? document.getElementById(`${id}-input`);
  }
  if (!node) return;
  const panel = node.closest('.panel'); if (panel?.classList.contains('collapsed')) collapsePanel(panel.id.slice(6), false);
  for (let details = node.closest('details'); details; details = details.parentElement.closest('details')) details.open = true;
  const target = node.matches('input, textarea, select, button') ? node : node.querySelector('input, textarea, select, button');
  node.scrollIntoView({ block: 'center' });
  target?.focus({ preventScroll: true });
  if (query && target && 'setSelectionRange' in target && typeof target.value === 'string') {
    const at = target.value.toLowerCase().indexOf(query.toLowerCase());
    if (at >= 0) try { target.setSelectionRange(at, at + query.length); } catch { /* Not every input type supports selection. */ }
  }
  const field = node.closest('.field, .item, .media-field, .media-card-edit, .string-list, .object-list') ?? node;
  field.classList.remove('flash'); void field.offsetWidth; field.classList.add('flash');
}
function parseErrors(message) {
  return Object.fromEntries(message.split('\n').map(line => line.match(/^([\w.]+): (.+)$/)).filter(Boolean).map(([, path, text]) => [path, text]));
}
function updateSaveState() {
  const text = $('#save-state'), button = $('#save-btn'); if (!text || !state.record) return;
  text.textContent = state.saving ? 'Saving…' : state.dirty ? 'Unsaved changes' : state.record.revision ? 'Saved' : 'Not saved yet';
  text.dataset.state = state.saving ? 'saving' : state.dirty ? 'dirty' : 'clean';
  button.disabled = state.saving || (!state.dirty && !!state.record.revision);
}
async function save() {
  const record = state.record; if (!record || state.saving) return;
  if (record.collection !== 'site' && !record.data.title?.trim()) { state.errors = { title: 'Enter a title first.' }; return focusPath(['title']); }
  state.saving = true; updateSaveState();
  const snapshot = JSON.stringify([record.data, record.body]);
  try {
    const id = record.id || newRecordId(record);
    const data = record.collection === 'site' ? record.data : clean({ ...record.data, slug: id });
    const saved = await api('save', { collection: record.collection, id, data, body: record.body ?? '', revision: record.revision });
    state.records = await api('records');
    const edited = JSON.stringify([record.data, record.body]) !== snapshot;
    const previousDraftKey = draftKey(record), wasNew = !record.id;
    Object.assign(record, { id, revision: saved.revision });
    if (record.collection !== 'site') record.data.slug = id;
    if (edited) {
      try {
        localStorage.setItem(draftKey(record), JSON.stringify(record));
        if (previousDraftKey !== draftKey(record)) localStorage.removeItem(previousDraftKey);
        if (state.record === record) state.draftFailed = false;
      } catch {
        if (state.record === record) state.draftFailed = true;
        notify('Saved, but newer edits could not be stored in this browser. Keep this page open and save them again.', { error: true });
      }
    } else {
      try { localStorage.removeItem(previousDraftKey); } catch { /* Nothing to remove. */ }
    }
    if (state.record !== record) return;
    if (wasNew) { state.newTemplate = null; history.replaceState(null, '', `#/${record.collection}/${encodeURIComponent(id)}`); }
    state.errors = {};
    if (!edited) { state.record = normalize(structuredClone(saved)); state.dirty = false; }
    renderNav(); renderList(); rerender();
    notify('Saved. Publish when you’re ready to go live.');
  } catch (error) {
    state.errors = parseErrors(error.message); rerender();
    notify(error.message, { error: true });
    const first = Object.keys(state.errors)[0]; if (first) focusPath(first.split('.'));
  } finally { state.saving = false; updateSaveState(); }
}
async function deleteRecord() {
  const record = state.record;
  if (!window.confirm(`Delete “${recordTitle(record)}”? A recoverable copy is kept in .studio/trash.`)) return;
  try {
    await api('delete', record); dropDraft(record); state.dirty = false;
    state.records = await api('records'); go(record.collection);
    notify('Deleted locally. Publish to remove it from the live site.');
  } catch (error) { notify(error.message, { error: true }); }
}

// ---------- inspector ----------
function previewPath(record) {
  if (!record.revision) return null;
  if (record.collection === 'projects') return `/work/${record.id}`;
  if (record.collection === 'writing') return `/writing/${record.id}`;
  if (record.id === 'pages') { const first = sortedRecords('projects')[0]; return first ? `/work/${first.id}` : '/work'; }
  return siteInfo[record.id]?.[2] ?? '/';
}
function renderInspector() {
  previewObserver?.disconnect(); clearTimeout(inspectorTimer);
  layout();
  if (!state.record || !panelOpen()) return inspector.replaceChildren();
  const body = h('div', { class: 'inspector-body' });
  inspector.replaceChildren(h('header', { class: 'inspector-head' },
    h('div', { class: 'seg compact', role: 'group', 'aria-label': 'Panel' }, [['outline', 'Outline'], ['preview', 'Preview'], ['history', 'History']].map(([id, text]) => btn(text, () => showPanel(id), null, { 'aria-pressed': String(state.panel === id) }))),
    btn('×', hidePanel, 'icon ghost', { 'aria-label': 'Close panel' })), body);
  if (state.panel === 'preview') previewPanel(body);
  else if (state.panel === 'history') void historyPanel(body);
  else outlinePanel(body);
}
function checklist(record) {
  const data = record.data;
  if (record.collection === 'writing') return [['Title', !!data.title?.trim(), ['title']], ['Summary', !!data.summary?.trim(), ['summary']], ['Publish date', !!data.publicationDate, ['publicationDate']], ['At least one tag', data.tags.some(Boolean), ['tags']]];
  if (record.collection !== 'projects') return [];
  const need = requirements(data);
  return [
    ['Name', !!data.title?.trim(), ['title']], ['Short description', !!data.summary?.trim(), ['summary']], ['Project type', data.categories.length > 0, ['categories']],
    need.media && ['At least one image or video', data.media.length > 0, ['media']],
    data.media.length > 0 && ['Every image described', data.media.every(media => media.alt?.trim()), ['media', Math.max(0, data.media.findIndex(media => !media.alt?.trim())), 'alt']],
    need.highlights && ['At least one highlight', data.highlights.some(item => item.trim()), ['highlights']],
    ...(need.year ? [['Year', !!data.year, ['year']], ['Completed month', !!data.completedAt, ['completedAt']], ['Role', !!data.role?.trim(), ['role']], ['Time spent', !!data.duration?.trim(), ['duration']],
      ['Tech stack', data.technologies.length > 0, ['technologies']], ['A project link', Object.values(data.links).some(Boolean), ['links', 'live']]] : []),
  ].filter(Boolean);
}
function outlinePanel(body) {
  const record = state.record;
  const sectionsList = h('ol', { class: 'outline' }, editorSections(record).map(section => h('li', {}, btn(section.title, () => {
    closeDrawer(); collapsePanel(section.id, false); document.getElementById(`panel-${section.id}`)?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, 'outline-link'))));
  const headings = [...(record.body ?? '').matchAll(/^(#{2,4})\s+(.+)$/gm)];
  const checks = checklist(record), missing = checks.filter(([, ok]) => !ok).length;
  body.append(...kids(
    checks.length > 0 && h('section', { class: 'checklist' }, h('h3', { text: missing ? `${missing} thing${missing === 1 ? '' : 's'} left before publishing` : 'Ready to publish' }),
      h('ul', {}, checks.map(([text, ok, path]) => h('li', { class: ok ? 'ok' : 'todo' }, btn(text, () => { closeDrawer(); focusPath(path); }, 'outline-link'))))),
    h('h3', { text: 'Sections' }), sectionsList,
    headings.length > 0 && [h('h3', { text: 'In the body' }), h('ol', { class: 'outline headings' }, headings.map(match => h('li', { class: `level-${match[1].length}` }, btn(match[2], () => { closeDrawer(); jumpToBody(match.index, match[0].length); }, 'outline-link'))))]));
}
function previewPanel(body) {
  const path = previewPath(state.record);
  if (!path) return body.append(h('p', { class: 'hint', text: 'Save this entry once to preview it.' }));
  let device = pref('device', 'desktop');
  const holder = h('div', { class: 'preview-holder' });
  const frame = h('iframe', { src: path, title: 'Saved page preview', class: 'preview-frame' });
  const fit = () => {
    const base = device === 'mobile' ? 390 : 1280, scale = Math.min(1, holder.clientWidth / base);
    Object.assign(frame.style, { width: `${base}px`, height: `${holder.clientHeight / scale}px`, transform: `scale(${scale})` });
  };
  const deviceButton = btn(device === 'mobile' ? 'Mobile' : 'Desktop', () => { device = device === 'mobile' ? 'desktop' : 'mobile'; setPref('device', device); deviceButton.textContent = device === 'mobile' ? 'Mobile' : 'Desktop'; fit(); }, 'small ghost', { title: 'Switch preview width' });
  holder.append(frame);
  body.append(...kids(h('div', { class: 'preview-bar' }, h('code', { text: path }), deviceButton, btn('Reload', () => frame.contentWindow?.location.reload(), 'small ghost'), h('a', { href: path, target: '_blank', rel: 'noopener', text: '↗', 'aria-label': 'Open in a new tab' })),
    h('p', { class: 'hint', text: 'Shows the last saved version. Save to refresh.' }), holder));
  previewObserver = new ResizeObserver(fit); previewObserver.observe(holder);
}
async function historyPanel(body) {
  const record = state.record;
  if (!record.revision) return body.append(h('p', { class: 'hint', text: 'No saved versions yet.' }));
  body.append(h('p', { class: 'hint', text: 'Loading…' }));
  try {
    const revisions = await api(`history?collection=${encodeURIComponent(record.collection)}&id=${encodeURIComponent(record.id)}`);
    if (state.record !== record || state.panel !== 'history') return;
    const differences = revision => {
      const keys = new Set([...Object.keys(revision.data ?? {}), ...Object.keys(record.data)]);
      const changes = [...keys].filter(key => JSON.stringify(clean(revision.data?.[key] ?? '')) !== JSON.stringify(clean(record.data[key] ?? ''))).map(label);
      if ((revision.body ?? '') !== (record.body ?? '')) changes.push('Body');
      return changes;
    };
    body.replaceChildren(...kids(h('p', { class: 'hint', text: 'Each save keeps the previous version. Loading one puts it in the editor; save to keep it.' }),
      revisions.length ? h('ol', { class: 'revisions' }, revisions.map(revision => {
        const changes = differences(revision);
        return h('li', {}, h('strong', { text: new Date(revision.savedAt).toLocaleString() }),
          h('small', { text: changes.length ? `Differs in: ${changes.slice(0, 6).join(', ')}${changes.length > 6 ? '…' : ''}` : 'Same as the editor' }),
          btn('Load', () => { checkpoint(); Object.assign(record, { data: structuredClone(revision.data), body: revision.body }); normalize(record); changed(); rerender(); notify('Earlier version loaded. Save to keep it.', { action: { label: 'Undo', run: undo } }); }, 'small', { disabled: !changes.length }));
      })) : h('p', { class: 'hint', text: 'No earlier saves yet.' })));
  } catch (error) { body.replaceChildren(...kids(h('p', { class: 'error-text', text: error.message }))); }
}

// ---------- media library & picker ----------
const mediaKind = source => isPdf(source) ? 'pdf' : isVideo(source) ? 'video' : 'image';
const formatBytes = bytes => bytes == null ? 'Remote' : bytes > 1e6 ? `${(bytes / 1e6).toFixed(1)} MB` : `${Math.ceil(bytes / 1e3)} KB`;
function uploadZone(refresh) {
  const input = h('input', { type: 'file', multiple: true, accept: 'image/*,video/*,.pdf', class: 'visually-hidden', id: `upload-${crypto.randomUUID()}` });
  const zone = h('label', { class: 'dropzone', htmlFor: input.id }, h('strong', { text: 'Drop files here, or click to upload' }), h('span', { text: 'Images, videos, or a PDF résumé.' }));
  const send = async files => {
    setBusy(true);
    try { for (const file of files) await upload(file); notify(`${files.length} file${files.length === 1 ? '' : 's'} uploaded.`); await refresh(); }
    catch (error) { notify(error.message, { error: true }); } finally { setBusy(false); input.value = ''; }
  };
  input.onchange = () => send([...input.files]);
  zone.ondragover = event => { event.preventDefault(); zone.classList.add('is-over'); };
  zone.ondragleave = () => zone.classList.remove('is-over');
  zone.ondrop = event => { event.preventDefault(); zone.classList.remove('is-over'); void send([...event.dataTransfer.files]); };
  return h('div', {}, input, zone);
}
function mediaBrowser(items, select, { visual } = {}) {
  let kind = 'all';
  if (visual) items = items.filter(item => !isPdf(item.source));
  const grid = h('ul', { class: 'media-grid' }), count = h('small');
  const search = h('input', { type: 'search', placeholder: 'Search by file name or where it’s used…', 'aria-label': 'Search media' });
  const known = new Map(state.records.flatMap(record => [...(record.data.media ?? []), ...(record.data.cover ? [record.data.cover] : [])]).flatMap(media => [[media.source, media], [media.poster, media]]));
  const titleOf = item => known.get(item.source)?.alt || item.name;
  const thumbOf = item => known.get(item.source)?.poster || item.source;
  const owner = reference => { const [collection, id] = reference.split('/'); const record = state.records.find(item => item.collection === collection && item.id === id); return record ? recordTitle(record) : reference; };
  const filters = h('div', { class: 'seg compact', role: 'group', 'aria-label': 'Media type' });
  const draw = () => {
    filters.replaceChildren(...kids(...[['all', 'All'], ['image', 'Images'], ['video', 'Videos'], !visual && ['pdf', 'PDFs'], ['unused', 'Unused']].filter(Boolean).map(([value, text]) => btn(text, () => { kind = value; draw(); }, null, { 'aria-pressed': String(kind === value) }))));
    const query = search.value.toLowerCase();
    const shown = items.filter(item => (kind === 'all' || (kind === 'unused' ? !item.references.length : mediaKind(item.source) === kind)) && (!query || `${item.name} ${titleOf(item)} ${item.references.map(owner).join(' ')}`.toLowerCase().includes(query)));
    count.textContent = `${shown.length} of ${items.length}`;
    grid.replaceChildren(...kids(...shown.map(item => h('li', { class: 'media-card' },
      select ? h('button', { type: 'button', class: 'media-pick', onclick: () => select(item.source), 'aria-label': `Use ${titleOf(item)}` }, preview(thumbOf(item), '')) : preview(thumbOf(item), ''),
      h('p', { class: 'media-name', title: item.name, text: titleOf(item) }),
      h('small', { text: `${mediaKind(item.source)} · ${formatBytes(item.bytes)}` }),
      h('p', { class: 'refs' }, item.references.length ? ['Used in ', item.references.map((reference, index) => [index ? ', ' : '', select ? owner(reference) : h('a', { href: `#/${reference.split('/').map(encodeURIComponent).join('/')}`, text: owner(reference) })])] : 'Not used'),
      h('div', { class: 'actions' }, select ? btn('Use', () => select(item.source), 'small primary')
        : [btn('Copy path', async () => { try { await navigator.clipboard.writeText(item.source); notify('Path copied.'); } catch { notify(item.source); } }, 'small ghost'),
          item.source.startsWith('/assets/studio/') && !item.references.length && btn('Remove', async () => {
            if (!window.confirm('Move this unused upload to local trash?')) return;
            try { await api('remove-media', { name: item.name }); await mediaView(); } catch (error) { notify(error.message, { error: true }); }
          }, 'small ghost danger')])))));
    if (!shown.length) grid.append(h('li', { class: 'empty', text: items.length ? 'No matching media.' : 'Your library is empty. Upload something to get started.' }));
  };
  search.oninput = draw; draw();
  return h('div', { class: 'media-browser' }, h('div', { class: 'media-toolbar' }, search, filters, count), grid);
}
async function mediaView() {
  main.replaceChildren(...kids(h('div', { class: 'page' }, pageHead('Media library', 'Upload once, reuse anywhere. Media used by saved content can’t be removed.'), h('p', { class: 'hint', text: 'Loading…' }))));
  const items = await api('media');
  if (state.section !== 'media' || state.record) return;
  main.replaceChildren(...kids(h('div', { class: 'page' }, pageHead('Media library', 'Upload once, reuse anywhere. Media used by saved content can’t be removed.'), uploadZone(mediaView), mediaBrowser(items))));
}
async function chooseMedia(callback, options) {
  const dialog = $('#picker'), content = $('#picker-content');
  const refresh = async () => { const items = await api('media'); content.replaceChildren(...kids(uploadZone(refresh), mediaBrowser(items, source => { dialog.close(); callback(source); }, options))); content.querySelector('input[type=search]')?.focus(); };
  try { await refresh(); if (!dialog.open) dialog.showModal(); content.querySelector('input[type=search]')?.focus(); } catch (error) { notify(error.message, { error: true }); }
}
$('#close-picker').onclick = () => $('#picker').close();
$('#picker').onclick = event => { if (event.target === event.currentTarget) event.currentTarget.close(); };

// ---------- publish ----------
async function publishView() {
  state.settings = await api('settings');
  if (state.section !== 'publish') return;
  const config = state.settings.config, last = state.settings.lastPublish;
  const drafts = allDrafts();
  const start = async action => { try { await api(action, {}); await watchJob(); } catch (error) { notify(error.message, { error: true }); } };
  main.replaceChildren(...kids(h('div', { class: 'page' },
    pageHead('Publish', 'Ship everything saved on this computer to the live site.'),
    drafts.length > 0 && h('div', { class: 'banner' }, h('p', { text: `${drafts.length} entr${drafts.length === 1 ? 'y has' : 'ies have'} unsaved browser changes that won’t be published.` }),
      drafts.slice(0, 5).map(draft => h('a', { href: `#/${draft.collection}/${encodeURIComponent(draft.id)}`, text: (state.records.find(record => record.collection === draft.collection && record.id === draft.id) && recordTitle(state.records.find(record => record.collection === draft.collection && record.id === draft.id))) ?? 'New entry' }))),
    h('section', { class: 'publish-card' },
      h('ol', { class: 'steps' }, ['Freeze saved files', 'Validate content', 'Build the site', 'Upload media to R2', 'Deploy to Cloudflare Pages', 'Verify the release'].map(step => h('li', { text: step }))),
      h('p', { class: 'hint', text: 'This publishes the current checkout, including code changes. It doesn’t commit or push Git.' }),
      h('dl', {}, Object.entries({ Website: config.siteUrl, 'Cloudflare project': config.projectName, Branch: config.productionBranch, 'Media bucket': config.mediaBucket }).map(([name, value]) => [h('dt', { text: name }), h('dd', { text: value })])),
      h('div', { class: 'actions publish-actions' }, btn('Check build', () => start('build')), btn('Publish saved changes', () => start('publish'), 'primary')),
      last && h('p', { class: 'hint', text: `Last deployment: ${new Date(last.publishedAt).toLocaleString()} · ${last.verified ? 'verified' : 'verification pending'}` })),
    h('pre', { class: 'job-log', text: 'No publishing job running.' }))));
  await watchJob();
}
async function watchJob() {
  if (state.section !== 'publish') return;
  jobController?.abort(); jobController = new AbortController();
  const response = await fetch('/__studio/api/job-events', { headers: { 'x-studio-token': token }, signal: jobController.signal });
  if (!response.ok) throw new Error('Could not read publishing status.');
  const reader = response.body.getReader(), decoder = new TextDecoder(); let buffer = '';
  try {
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let newline;
      while ((newline = buffer.indexOf('\n')) >= 0) {
        const job = JSON.parse(buffer.slice(0, newline)); buffer = buffer.slice(newline + 1);
        const log = main.querySelector('.job-log'); if (log) { log.textContent = job.log || 'No publishing job running.'; log.scrollTop = log.scrollHeight; }
        main.querySelectorAll('.publish-actions button').forEach(button => { button.disabled = job.state === 'running'; });
        if (job.state === 'error') notify('The job stopped. Read the log for the failed step; an accepted deployment may still exist.', { error: true });
        else if (job.state === 'success') notify(job.result?.deployed ? 'Published and verified. Your portfolio is updated.' : 'Build passed. Nothing was published.');
      }
    }
  } catch (error) { if (error.name !== 'AbortError') throw error; }
}

// ---------- search palette ----------
const palette = $('#palette'), paletteInput = $('#palette-input'), paletteResults = $('#palette-results');
let paletteIndex = [], paletteItems = [], paletteActive = 0;
const skipKeys = new Set(['slug', 'source', 'poster', 'type', 'narrativeRole', 'width', 'height', 'selectedWorkOrder']);
function walk(value, path, visit) {
  if (typeof value === 'string' || typeof value === 'number') { if (String(value).trim() && !skipKeys.has(String(path.at(-1)))) visit(path, String(value)); }
  else if (Array.isArray(value)) value.forEach((item, index) => walk(item, [...path, index], visit));
  else if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) walk(item, [...path, key], visit);
}
function buildIndex() {
  const entries = [
    ...Object.entries(sections).map(([key, title]) => ({ kind: 'Go to', title, run: () => go(key) })),
    { kind: 'Action', title: 'New project', run: () => newRecord('projects') }, { kind: 'Action', title: 'New article', run: () => newRecord('writing') },
    state.record && { kind: 'Action', title: 'Save', run: save },
  ].filter(Boolean);
  const records = state.records.map(record => state.record?.collection === record.collection && state.record.id === record.id ? state.record : record);
  for (const record of records) {
    const where = recordTitle(record);
    entries.push({ kind: sections[record.collection], title: where, record });
    walk(record.data, [], (path, text) => entries.push({ kind: where, title: text, sub: path.map(segment => typeof segment === 'number' ? `#${segment + 1}` : label(segment)).join(' › '), record, path }));
    if (record.body) entries.push({ kind: where, title: record.body, sub: 'Body', record, path: ['body'] });
  }
  return entries;
}
function snippet(text, query) {
  const flat = text.replace(/\s+/g, ' '), at = query ? flat.toLowerCase().indexOf(query) : -1;
  if (flat.length <= 90) return flat;
  if (at < 0) return `${flat.slice(0, 90)}…`;
  const start = Math.max(0, at - 35);
  return `${start ? '…' : ''}${flat.slice(start, start + 90)}…`;
}
function highlighted(text, query) {
  if (!query) return text;
  const at = text.toLowerCase().indexOf(query);
  return at < 0 ? text : [text.slice(0, at), h('mark', { text: text.slice(at, at + query.length) }), text.slice(at + query.length)];
}
function drawPalette() {
  const query = paletteInput.value.trim().toLowerCase(), words = query.split(/\s+/).filter(Boolean);
  paletteItems = !query ? paletteIndex.filter(entry => entry.run || !entry.path).slice(0, 30)
    : paletteIndex.filter(entry => { const hay = `${entry.title} ${entry.sub ?? ''} ${entry.kind}`.toLowerCase(); return words.every(word => hay.includes(word)); })
      .sort((a, b) => Number(!!a.path) - Number(!!b.path) || Number(!a.title.toLowerCase().includes(query)) - Number(!b.title.toLowerCase().includes(query))).slice(0, 60);
  paletteActive = Math.min(paletteActive, Math.max(0, paletteItems.length - 1));
  paletteResults.replaceChildren(...kids(...paletteItems.map((entry, index) => h('li', { role: 'option', id: `option-${index}`, 'aria-selected': String(index === paletteActive), onclick: () => choose(entry), onmousemove: () => { if (paletteActive !== index) { paletteActive = index; mark(); } } },
    h('span', { class: 'option-kind', text: entry.kind }),
    h('span', { class: 'option-title' }, highlighted(snippet(entry.title, words[0] ?? ''), words[0] ?? '')),
    entry.sub && h('small', { text: entry.sub })))));
  if (!paletteItems.length) paletteResults.append(h('li', { class: 'empty', text: 'No matches.' }));
  mark();
}
function mark() {
  paletteResults.querySelectorAll('[role=option]').forEach((option, index) => option.setAttribute('aria-selected', String(index === paletteActive)));
  paletteInput.setAttribute('aria-activedescendant', `option-${paletteActive}`);
  document.getElementById(`option-${paletteActive}`)?.scrollIntoView({ block: 'nearest' });
}
function choose(entry) {
  palette.close();
  if (!entry) return;
  if (entry.run) return entry.run();
  const query = paletteInput.value.trim();
  const same = state.record?.collection === entry.record.collection && state.record.id === entry.record.id;
  if (same && entry.path) return focusPath(entry.path, query);
  if (entry.path) state.focus = { path: entry.path, query };
  go(entry.record.collection, entry.record.id);
}
function openPalette() { paletteIndex = buildIndex(); paletteInput.value = ''; paletteActive = 0; drawPalette(); palette.showModal(); paletteInput.focus(); }
paletteInput.oninput = () => { paletteActive = 0; drawPalette(); };
paletteInput.onkeydown = event => {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') { event.preventDefault(); paletteActive = (paletteActive + (event.key === 'ArrowDown' ? 1 : -1) + paletteItems.length) % Math.max(1, paletteItems.length); mark(); }
  else if (event.key === 'Enter') { event.preventDefault(); choose(paletteItems[paletteActive]); }
};
palette.onclick = event => { if (event.target === palette) palette.close(); };
$('#open-palette').onclick = openPalette;
document.addEventListener('keydown', event => {
  const mod = event.ctrlKey || event.metaKey, key = event.key.toLowerCase(), typing = event.target.closest?.('input, textarea, select, [contenteditable]');
  if (mod && key === 's') { event.preventDefault(); if (state.record) void save(); }
  else if (mod && key === 'k') { event.preventDefault(); if (palette.open) palette.close(); else openPalette(); }
  else if (mod && key === 'z' && !event.shiftKey && state.record && !typing) { event.preventDefault(); undo(); }
  else if (key === '/' && !typing && !mod && !document.querySelector('dialog[open]')) { event.preventDefault(); openPalette(); }
  else if (key === 'escape' && state.drawer) hidePanel();
});

// ---------- start ----------
try { document.body.append(h('datalist', { id: 'time-zones' }, Intl.supportedValuesOf('timeZone').map(zone => h('option', { value: zone })))); } catch { /* Older browsers type the zone by hand. */ }
try { [state.records, state.settings] = await Promise.all([api('records'), api('settings')]); route(); }
catch (error) { notify(error.message, { error: true }); }
