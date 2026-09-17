const token = document.querySelector('meta[name="studio-token"]').content;
const workspace = document.querySelector('#workspace');
const message = document.querySelector('#message');
const state = { records: [], section: 'projects', record: null, dirty: false, settings: null };
let jobController;
let ordering = false;
let draggedProject = null;
const projectTypes = ['Web app', 'Product site', 'Mobile app', 'Desktop app', 'Dashboard', 'API', 'Automation', 'Hackathon', 'Financial data', 'Design system', 'Experiment'];
const technologies = ['React', 'TypeScript', 'JavaScript', 'Next.js', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'Python', 'FastAPI', 'PostgreSQL', 'SQLite', 'Supabase', 'Better Auth', 'Auth0', 'Swift', 'SwiftUI', 'Kotlin', 'Docker', 'Cloudflare'];
const stackPresets = { 'React + Vite': ['React', 'TypeScript', 'Vite'], 'Next.js + Supabase': ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL'], 'Python API': ['Python', 'FastAPI', 'PostgreSQL'], 'Native iOS': ['Swift', 'SwiftUI'] };
const sections = { projects: 'Projects', writing: 'Writing', site: 'Site content', media: 'Media library', publish: 'Publish' };
const titles = { profile: 'Profile & experience', services: 'Services & pricing', OverviewPage: 'Homepage introduction', OverviewAbout: 'Homepage about', AboutPage: 'About page', ContactPage: 'Contact page', WritingPage: 'Writing page', LabPage: 'Lab page', ServicesReceipts: 'Service labels', PortfolioShell: 'Navigation & footer', pages: 'Project & article pages', WorkArchive: 'Work archive', SelectedWork: 'Selected work', PocketViewfinder: 'Viewfinder', seo: 'Search & social previews' };
const label = value => titles[value] ?? value.replace(/([a-z])([A-Z])/g, '$1 $2').replaceAll('_', ' ').replace(/^./, c => c.toUpperCase());
const element = (tag, text, className) => { const node = document.createElement(tag); if (text !== undefined) node.textContent = text; if (className) node.className = className; return node; };
const button = (text, action, className) => { const node = element('button', text, className); node.type = 'button'; node.onclick = action; return node; };
const notify = (text, error = false) => { message.textContent = text; message.dataset.error = String(error); };
async function api(action, data) {
  const response = await fetch(`/__studio/api/${action}`, { method: data === undefined ? 'GET' : 'POST', headers: { 'x-studio-token': token, ...(data === undefined ? {} : { 'Content-Type': 'application/json' }) }, body: data === undefined ? undefined : JSON.stringify(data) });
  const result = await response.json(); if (!response.ok) throw new Error(result.error); return result;
}
function draftKey() { return `portfolio-studio:${state.record.collection}:${state.record.id}`; }
function changed() {
  state.dirty = true; document.querySelector('#save-state').textContent = 'Unsaved changes';
  try { localStorage.setItem(draftKey(), JSON.stringify(state.record)); } catch { /* Saving to files remains available when browser storage is full. */ }
}
window.addEventListener('beforeunload', event => { if (state.dirty) { event.preventDefault(); event.returnValue = ''; } });
function navigation() {
  const nav = document.querySelector('#navigation'); nav.replaceChildren();
  for (const [key, title] of Object.entries(sections)) {
    const item = button(title, () => navigate(key)); item.setAttribute('aria-current', state.section === key ? 'page' : 'false');
    if (['projects', 'writing', 'site'].includes(key)) item.append(element('span', state.records.filter(r => r.collection === key).length)); nav.append(item);
  }
}
function canLeave() { return !state.dirty || window.confirm('Leave this editor? Your unsaved draft will stay in this browser, but it will not be published.'); }
async function navigate(section) {
  if (!canLeave()) return;
  jobController?.abort();
  state.section = section; state.record = null; state.dirty = false; notify(''); document.querySelector('#save-state').textContent = 'Local files';
  document.querySelector('#breadcrumb').textContent = `Content / ${sections[section]}`; navigation();
  try {
    if (section === 'media') await mediaPage();
    else if (section === 'publish') await publishPage();
    else {
      workspace.replaceChildren(element('p', 'Loading content…', 'saved-note'));
      state.records = await api('records');
      if (state.section === section && !state.record) { navigation(); listPage(); }
    }
  } catch (error) { notify(error.message, true); }
}
function heading(title, description, action) {
  const head = element('div', undefined, 'heading'), copy = element('div');
  copy.append(element('p', 'PORTFOLIO STUDIO', 'eyebrow'), element('h1', title), element('p', description, 'description')); head.append(copy); if (action) head.append(action); return head;
}
function preview(source, className = 'media-preview') {
  if (!source || !/^(https?:\/\/|\/)/.test(source) || source.startsWith('//')) return element('span', 'No media', className);
  if (/\.pdf(?:\?|$)/i.test(source)) { const link = element('a', 'Open PDF ↗', className); link.href = source; link.target = '_blank'; link.rel = 'noopener'; return link; }
  const video = /\.(mp4|webm|mov)(?:\?|$)/i.test(source); const node = element(video ? 'video' : 'img', undefined, className);
  node.src = source; if (video) { node.controls = true; node.preload = 'metadata'; } else { node.alt = ''; node.loading = 'lazy'; } return node;
}
function listPage() {
  workspace.replaceChildren(heading(sections[state.section], state.section === 'site' ? 'Edit the words, links, and details across your portfolio.' : 'Shape the work and stories people see on your portfolio.', state.section !== 'site' ? button(`+ New ${state.section === 'projects' ? 'project' : 'article'}`, newRecord, 'primary') : null));
  const list = element('div', undefined, 'records');
  const records = state.records.filter(r => r.collection === state.section).sort((a,b) => (a.data.selectedWorkOrder ?? 0) - (b.data.selectedWorkOrder ?? 0));
  if (state.section === 'projects') workspace.append(element('p', 'Drag the handles to change project order. Changes save locally; publish when ready. Arrow buttons also work with a keyboard or touchscreen.', 'saved-note'));
  records.forEach((record, index) => {
    const row = button('', () => openRecord(record), 'record');
    const source = record.data.media?.[0]?.poster ?? record.data.media?.[0]?.source ?? record.data.cover?.source;
    row.append(source ? preview(source, '') : element('span', String(index + 1).padStart(2, '0'), 'ordinal'));
    const text = element('div'); text.append(element('strong', record.collection === 'site' ? label(record.id) : record.data.title), element('small', record.data.summary ?? 'Site copy and content')); row.append(text, element('span', record.status, 'badge'));
    if (state.section !== 'projects') { list.append(row); return; }
    const container = element('div', undefined, 'project-row'); container.dataset.projectId = record.id;
    const handle = button('⠿', () => {}, 'drag-handle'); handle.draggable = true;
    handle.setAttribute('aria-label', `Reorder ${record.data.title}. Use Up or Down arrow keys.`);
    handle.title = 'Drag to reorder';
    handle.ondragstart = event => { draggedProject = record.id; event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', record.id); container.classList.add('is-dragging'); };
    handle.ondragend = () => { draggedProject = null; workspace.querySelectorAll('.project-row').forEach(item => item.classList.remove('is-dragging', 'drop-before', 'drop-after')); };
    handle.onkeydown = event => { if (event.key === 'ArrowUp' || event.key === 'ArrowDown') { event.preventDefault(); void moveProject(record.id, index + (event.key === 'ArrowUp' ? -1 : 1)); } };
    container.ondragover = event => { if (!draggedProject || ordering) return; event.preventDefault(); event.dataTransfer.dropEffect = 'move'; container.classList.add(records.findIndex(item => item.id === draggedProject) < index ? 'drop-after' : 'drop-before'); };
    container.ondragleave = event => { if (!container.contains(event.relatedTarget)) container.classList.remove('drop-before', 'drop-after'); };
    container.ondrop = event => { event.preventDefault(); container.classList.remove('drop-before', 'drop-after'); if (draggedProject) void moveProject(draggedProject, index); };
    const controls = element('div', undefined, 'order-controls');
    const up = button('↑', () => moveProject(record.id, index - 1)); up.setAttribute('aria-label', `Move ${record.data.title} up`); up.disabled = index === 0;
    const down = button('↓', () => moveProject(record.id, index + 1)); down.setAttribute('aria-label', `Move ${record.data.title} down`); down.disabled = index === records.length - 1;
    controls.append(up, down); container.append(handle, row, controls); list.append(container);
  });
  if (!records.length) list.append(element('p', 'Nothing here yet. Create your first entry.', 'empty')); workspace.append(list);
}
async function moveProject(id, destination) {
  const records = state.records.filter(record => record.collection === 'projects').sort((a,b) => a.data.selectedWorkOrder - b.data.selectedWorkOrder);
  const index = records.findIndex(record => record.id === id);
  if (ordering || index < 0 || destination < 0 || destination >= records.length || index === destination) return;
  records.splice(destination, 0, records.splice(index, 1)[0]); ordering = true; workspace.inert = true;
  try {
    state.records = await api('reorder-projects', { order: records.map(({ id, revision }) => ({ id, revision })) });
    if (state.section === 'projects' && !state.record) listPage();
    notify('Project order saved locally. Publish to update the live portfolio.');
  } catch (error) { notify(error.message, true); }
  finally { ordering = false; draggedProject = null; workspace.inert = false; workspace.querySelector(`[data-project-id="${id}"] .drag-handle`)?.focus(); }
}
const mediaTemplate = () => ({ type: 'image', source: '', poster: '', alt: '', caption: '', aspectRatio: { width: 0, height: 0 }, narrativeRole: 'detail' });
function newRecord() {
  const id = '';
  const project = state.section === 'projects';
  const data = project ? { slug: id, title: '', summary: '', presentation: 'case-study', year: new Date().getFullYear(), completedAt: new Date().toISOString().slice(0,7), role: '', duration: '', categories: [], technologies: [], selectedWorkOrder: Math.max(0, ...state.records.filter(r=>r.collection==='projects').map(r=>r.data.selectedWorkOrder)) + 1, links: { live: '', repository: '', devpost: '' }, publicationState: 'draft', media: [] } : { slug: id, title: '', summary: '', publicationDate: new Date().toISOString().slice(0,10), tags: [''], status: 'draft' };
  openRecord({ collection: state.section, id, data, body: project ? '## Context\n\n## Process\n\n## Outcome\n' : '', revision: null });
  document.querySelector('#field-title')?.focus();
}
function newRecordId(record) {
  const base = record.data.title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `${record.collection === 'projects' ? 'project' : 'article'}-${crypto.randomUUID()}`;
  let id = base, suffix = 2;
  while (state.records.some(item => item.collection === record.collection && item.id === id)) id = `${base}-${suffix++}`;
  return id;
}
function openRecord(record) {
  state.record = structuredClone(record); state.dirty = false;
  const draft = localStorage.getItem(draftKey());
  if (draft) {
    try { const saved = JSON.parse(draft); if (saved.revision === record.revision && window.confirm('Restore the unsaved draft for this entry?')) { state.record = saved; state.dirty = true; } } catch { /* Invalid browser drafts do not affect the saved record. */ }
  }
  if (state.record.collection === 'projects') {
    state.record.data = { presentation: 'case-study', year: '', completedAt: '', role: '', duration: '', technologies: [], ...state.record.data };
    state.record.data.links = { live: '', repository: '', devpost: '', ...state.record.data.links };
    state.record.data.media = state.record.data.media.map(media => ({ poster: '', caption: '', ...media }));
  }
  renderEditor();
}
function fromShape(shape) { if (Array.isArray(shape)) return []; if (typeof shape === 'object') return Object.fromEntries(Object.entries(shape).map(([k,v])=>[k,fromShape(v)])); return shape === 'number' ? 0 : shape === 'boolean' ? false : ''; }
function projectChoices(record, key) {
  const isStack = key === 'technologies';
  const group = element('fieldset', undefined, 'project-choices'); group.append(element('legend', isStack ? 'Tech stack' : 'Project types'));
  group.append(element('p', 'Choose all that apply, or add your own.', 'saved-note'));
  const selected = () => record.data[key].filter(value => value.trim());
  const options = element('div', undefined, 'preset-options');
  const searchLabel = element('label', isStack ? 'Find a technology' : 'Find a project type', 'field');
  const search = element('input'); search.type = 'search'; searchLabel.append(search);
  const renderChoices = () => {
    const names = [...new Set([...(isStack ? technologies : projectTypes), ...state.records.filter(item => item.collection === 'projects').flatMap(item => item.data[key] ?? []), ...selected()])].filter(Boolean);
    options.replaceChildren();
    for (const name of names.filter(name => name.toLowerCase().includes(search.value.toLowerCase()))) {
      const choice = element('label', undefined, 'preset-choice'), input = element('input'); input.type = 'checkbox'; input.checked = selected().includes(name);
      input.onchange = () => { record.data[key] = input.checked ? [...new Set([...selected(), name])] : selected().filter(value => value !== name); changed(); };
      choice.append(input, element('span', name)); options.append(choice);
    }
    if (!options.childElementCount) options.append(element('p', 'No matching option. Add it below.', 'saved-note'));
  };
  if (isStack) {
    const presetLabel = element('label', 'Add a prebuilt stack', 'field');
    const select = element('select'); select.append(element('option', 'Choose a stack…'));
    for (const name of Object.keys(stackPresets)) { const option = element('option', name); option.value = name; select.append(option); }
    select.onchange = () => { if (!stackPresets[select.value]) return; record.data[key] = [...new Set([...selected(), ...stackPresets[select.value]])]; changed(); search.value = ''; renderChoices(); select.selectedIndex = 0; };
    presetLabel.append(select); group.append(presetLabel);
  }
  search.oninput = renderChoices; group.append(searchLabel, options);
  const customLabel = element('label', isStack ? 'Custom technology' : 'Custom project type', 'field'); const custom = element('input'); customLabel.append(custom);
  const add = () => { const value = custom.value.trim(); if (!value) return; record.data[key] = [...new Set([...selected(), value])]; custom.value = ''; search.value = ''; changed(); renderChoices(); custom.focus(); };
  custom.onkeydown = event => { if (event.key === 'Enter') { event.preventDefault(); add(); } };
  group.append(customLabel, button(isStack ? 'Add technology' : 'Add project type', add)); renderChoices(); return group;
}
function mediaDescription(name) {
  return decodeURIComponent(name.split('/').pop().split('?')[0]).replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').trim() || 'Project media';
}
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
function setMediaBusy(busy) { workspace.inert = busy; document.querySelector('.sidebar').inert = busy; }
function projectMediaEditor(record) {
  const group = element('fieldset', undefined, 'project-media'); group.append(element('legend', 'Images & videos'));
  group.append(element('p', 'Drop several files or choose them together. Dimensions and video thumbnails are automatic. The first item is the cover. Descriptions start from filenames; edit them when needed.', 'saved-note'));
  const zone = element('div', undefined, 'upload project-dropzone');
  const inputLabel = element('label', 'Add project images and videos', 'field-label');
  const input = element('input'); input.type = 'file'; input.multiple = true; input.accept = '.png,.jpg,.jpeg,.webp,.gif,.avif,.svg,.mp4,.webm,.mov'; inputLabel.append(element('br'), input);
  zone.append(element('strong', 'Drop images and videos here'), inputLabel);
  const grid = element('div', undefined, 'project-media-grid');
  const refresh = () => {
    grid.replaceChildren();
    record.data.media.forEach((media, index) => {
      const card = element('article', undefined, 'project-media-card');
      const mediaTitle = media.alt || `Media ${index + 1}`;
      const top = element('div', undefined, 'media-card-heading'); top.append(element('span', index === 0 ? 'Cover' : `Media ${index + 1}`, 'badge'));
      const controls = element('div', undefined, 'order-controls');
      const move = destination => { const items = record.data.media; items.splice(destination, 0, items.splice(index, 1)[0]); items[0].narrativeRole = 'hero'; for (const item of items.slice(1)) if (item.narrativeRole === 'hero') item.narrativeRole = 'detail'; changed(); refresh(); };
      const up = button('↑', () => move(index - 1)); up.setAttribute('aria-label', `Move media ${index + 1} earlier`); up.disabled = index === 0;
      const down = button('↓', () => move(index + 1)); down.setAttribute('aria-label', `Move media ${index + 1} later`); down.disabled = index === record.data.media.length - 1;
      controls.append(up, down, button('Remove', () => { record.data.media.splice(index, 1); if (record.data.media[0]) record.data.media[0].narrativeRole = 'hero'; changed(); refresh(); }, 'danger')); top.append(controls);
      card.append(top, preview(media.poster || media.source), element('p', `${media.type === 'video' ? 'Video' : 'Image'} · ${media.aspectRatio.width} × ${media.aspectRatio.height}`, 'saved-note'));
      const altLabel = element('label', 'Description', 'field'); const alt = element('input'); alt.value = media.alt; alt.setAttribute('aria-label', `Description for media ${index + 1}`); alt.oninput = () => { media.alt = alt.value; changed(); }; altLabel.append(alt); card.append(altLabel);
      const details = element('details'); details.append(element('summary', 'Caption & advanced settings'));
      for (const key of ['caption', 'poster', 'narrativeRole', 'aspectRatio', 'source']) {
        details.append(renderValue(media[key] ?? '', label(key), next => { media[key] = next; }, ['media', String(index), key]));
      }
      if (index > 0) details.append(button('Use as cover', () => move(0)));
      card.setAttribute('aria-label', mediaTitle); card.append(details); grid.append(card);
    });
  };
  const append = media => { record.data.media = record.data.media.filter(item => item.source); media.narrativeRole = record.data.media.length ? 'detail' : 'hero'; record.data.media.push(media); changed(); };
  const addFiles = async files => {
    if (!files.length) return;
    setMediaBusy(true); const errors = []; let added = 0;
    try {
      for (const [index, file] of [...files].entries()) {
        notify(`Adding ${index + 1} of ${files.length}: ${file.name}…`);
        const objectUrl = URL.createObjectURL(file);
        try {
          if (!/\.(png|jpe?g|webp|gif|avif|svg|mp4|webm|mov)$/i.test(file.name)) throw new Error('Choose an image or video.');
          const type = /\.(mp4|webm|mov)$/i.test(file.name) ? 'video' : 'image';
          const info = await readMediaInfo(objectUrl, type, type === 'video');
          const saved = await upload(file, false);
          const media = { type, source: saved.source, alt: mediaDescription(file.name), caption: '', aspectRatio: info.aspectRatio, narrativeRole: 'detail' };
          if (info.poster) media.poster = (await upload(new File([info.poster], `${file.name}-poster.png`, { type: 'image/png' }), false)).source;
          append(media); added++;
        } catch (error) { errors.push(`${file.name}: ${error.message}`); } finally { URL.revokeObjectURL(objectUrl); }
      }
    } finally { setMediaBusy(false); input.value = ''; refresh(); }
    notify(`${added} ${added === 1 ? 'file added' : 'files added'} to this project. Save changes when ready.${errors.length ? '\n' + errors.join('\n') : ''}`, errors.length > 0);
  };
  input.onchange = () => addFiles(input.files);
  zone.ondragover = event => { event.preventDefault(); zone.classList.add('is-over'); };
  zone.ondragleave = event => { if (!zone.contains(event.relatedTarget)) zone.classList.remove('is-over'); };
  zone.ondrop = event => { event.preventDefault(); zone.classList.remove('is-over'); void addFiles(event.dataTransfer.files); };
  const library = button('Choose existing media', () => chooseMedia(async source => {
    if (/\.pdf(?:\?|$)/i.test(source)) return notify('Choose an image or video for project media.', true);
    setMediaBusy(true);
    try {
      const existing = state.records.flatMap(item => [...(item.data.media ?? []), ...(item.data.cover ? [item.data.cover] : [])]).find(item => item.source === source);
      if (existing) append(structuredClone(existing));
      else { const type = /\.(mp4|webm|mov)$/i.test(source) ? 'video' : 'image'; const info = await readMediaInfo(source, type); append({ type, source, alt: mediaDescription(source), caption: '', aspectRatio: info.aspectRatio, narrativeRole: 'detail' }); }
      refresh(); notify('Media added to this project. Save changes when ready.');
    } catch (error) { notify(error.message, true); } finally { setMediaBusy(false); }
  }));
  group.append(zone, library, grid); refresh(); return group;
}
function renderValue(value, title, update, trail = [], shape) {
  const key = trail.at(-1);
  if (Array.isArray(value)) {
    const group = element('fieldset'); group.append(element('legend', title));
    value.forEach((item, index) => {
      const complex = item && typeof item === 'object';
      const row = element(complex ? 'details' : 'div', undefined, 'array-row'), controls = element('div', undefined, 'array-tools');
      if (complex) row.append(element('summary', `${index + 1}. ${item.title || item.company || item.alt || item.label || title}`));
      controls.append(button('↑ Move up', () => { if (!index) return; [value[index-1],value[index]]=[value[index],value[index-1]]; update(value); changed(); renderEditor(); }), button('↓ Move down', () => { if(index===value.length-1)return; [value[index+1],value[index]]=[value[index],value[index+1]]; update(value); changed(); renderEditor(); }), button('Remove', () => { value.splice(index,1); update(value); changed(); renderEditor(); }, 'danger'));
      row.append(controls, renderValue(item, `${title} ${index+1}`, next => { value[index]=next; update(value); }, [...trail,String(index)], Array.isArray(shape) ? shape[0] : undefined)); group.append(row);
    });
    group.append(button(`+ Add ${title.toLowerCase()}`, () => {
      const template = key === 'media' ? mediaTemplate() : Array.isArray(shape) ? fromShape(shape[0]) : typeof value[0] === 'object' ? structuredClone(value[0]) : '';
      value.push(template); update(value); changed(); renderEditor();
    })); return group;
  }
  if (value && typeof value === 'object') {
    const group = element('fieldset'); group.append(element('legend', title));
    if ('source' in value) {
      group.append(preview(value.source));
      group.append(button('Choose image or video', () => chooseMedia(async source => {
        value.source = source; value.type = /\.(mp4|webm|mov)$/i.test(source) ? 'video' : 'image';
        const media = document.createElement(value.type === 'video' ? 'video' : 'img');
        const measured = () => { value.aspectRatio = { width: media.videoWidth || media.naturalWidth, height: media.videoHeight || media.naturalHeight }; changed(); renderEditor(); };
        media.onload = measured; media.onloadedmetadata = measured;
        media.onerror = () => { changed(); renderEditor(); notify('Media selected. Enter its width and height if they could not be read.'); };
        media.src = source;
      })));
    }
    for (const [child, data] of Object.entries(value)) group.append(renderValue(data,label(child),next=>{value[child]=next;update(value);},[...trail,child],shape?.[child])); return group;
  }
  const wrapper = element('div', undefined, 'field'), fieldLabel = element('label', title, 'field-label');
  const options = { presentation: ['case-study','demo'], publicationState: ['draft','published'], status: ['draft','published'], type: ['image','video'], narrativeRole: ['hero','flow','detail','evidence'] };
  const isEnum = state.record.collection !== 'site' && options[key];
  const input = element(isEnum ? 'select' : typeof value === 'string' && !['slug','source','poster','href','completedAt','publicationDate'].includes(key) && (value.length > 85 || /summary|description|paragraph/i.test(key)) ? 'textarea' : 'input');
  input.id = `field-${trail.join('-')}`; fieldLabel.htmlFor = input.id;
  if (isEnum) options[key].forEach(option => { const node = element('option', label(option)); node.value=option; input.append(node); });
  else if (typeof value === 'number' || key === 'year') input.type='number';
  else if (typeof value === 'boolean') input.type='checkbox';
  if (typeof value === 'boolean') input.checked=value; else input.value=value ?? '';
  if (key==='slug') input.readOnly=true;
  input.oninput=()=>{update(input.type==='number' ? (input.value === '' ? '' : Number(input.value)) : typeof value==='boolean' ? input.checked : input.value);changed();};
  wrapper.append(fieldLabel,input);
  if (['poster','resumeUrl'].includes(key)) {
    const actions = element('div',undefined,'field-actions'); actions.append(button('Choose from library',()=>chooseMedia(source=>{update(source);changed();renderEditor();}))); wrapper.append(actions);
  }
  return wrapper;
}
function clean(value) {
  if (Array.isArray(value)) return value.map(clean);
  if (value && typeof value==='object') return Object.fromEntries(Object.entries(value).filter(([,v])=>v!=='').map(([k,v])=>[k,clean(v)]));
  return value;
}
async function save() {
  const record = state.record; if (!record) return;
  try {
    if (record.collection !== 'site' && !record.data.title.trim()) {
      document.querySelector('#field-title')?.focus();
      return notify(`Enter a ${record.collection === 'projects' ? 'project name' : 'title'} first.`, true);
    }
    const id = record.id || newRecordId(record);
    const data = record.collection === 'site' ? record.data : clean({ ...record.data, slug: id });
    const saved = await api('save',{...record,id,data});
    localStorage.removeItem(draftKey()); state.record=saved; state.dirty=false;
    state.records=await api('records'); navigation(); renderEditor(); notify('Saved to your local portfolio. Preview it or publish when ready.');
  } catch(error){notify(error.message,true);}
}
function renderEditor() {
  const record=state.record;
  const recordTitle = record.data.title || (record.id ? label(record.id) : `New ${record.collection === 'projects' ? 'project' : 'article'}`);
  document.querySelector('#save-state').textContent=state.dirty?'Unsaved changes':'Saved locally';
  document.querySelector('#breadcrumb').textContent=`${sections[record.collection]} / ${recordTitle}`;
  workspace.replaceChildren();
  const bar=element('div',undefined,'editor-bar'), actions=element('div',undefined,'actions');
  bar.append(button('← All entries',()=>navigate(record.collection)));
  const link=element('a','Preview ↗'); link.target='_blank'; link.rel='noopener';
  link.href=record.collection==='projects'?`/work/${record.id}`:record.collection==='writing'?`/writing/${record.id}`:'/';
  if (record.revision) actions.append(link);
  actions.append(button('Save changes',save,'primary')); bar.append(actions); workspace.append(bar,heading(recordTitle,record.revision ? 'Changes stay on this computer until you publish. Preview shows saved content.' : 'Fill in the details below. Your project URL is created automatically when you save.'));
  const form=element('div',undefined,'editor');
  const shape=state.settings.shapes[record.id];
  if (record.collection==='site') form.append(renderValue(record.data,label(record.id),next=>record.data=next,[],shape));
  else {
    const fieldLabels = { title: record.collection === 'projects' ? 'Project name' : 'Article title', summary: 'Short description', presentation: 'Project page type', completedAt: 'Completion month (YYYY-MM)', role: 'Your role', duration: 'Time spent', categories: 'Categories', technologies: 'Tools & technologies', selectedWorkOrder: 'Display order', links: 'Project links', live: 'Live website', repository: 'Source code', devpost: 'Devpost page', publicationState: 'Publication status', media: 'Images & videos' };
    const keys = record.collection === 'projects' ? ['title','summary','presentation','year','completedAt','role','duration','categories','technologies','selectedWorkOrder','links','publicationState','media'] : Object.keys(record.data);
    for(const key of keys) {
      if(key === 'slug' || key === 'selectedWorkOrder') continue;
      if (record.collection === 'projects' && (key === 'categories' || key === 'technologies')) { form.append(projectChoices(record, key)); continue; }
      if (record.collection === 'projects' && key === 'media') { form.append(projectMediaEditor(record)); continue; }
      const value = record.data[key];
      form.append(renderValue(value,fieldLabels[key] || label(key),next=>record.data[key]=next,[key]));
    }
    if(record.collection==='writing'&&!record.data.cover) form.append(button('+ Add cover image',()=>{record.data.cover=mediaTemplate();changed();renderEditor();}));
    if(record.collection==='writing'&&record.data.cover) form.append(button('Remove cover',()=>{delete record.data.cover;changed();renderEditor();}));
    const field=element('div',undefined,'field'), lab=element('label',record.collection==='projects'?'Process & case study':'Article body','field-label');lab.htmlFor='body';
    const toolbar=element('div',undefined,'toolbar'), input=element('textarea',undefined,'body-editor');input.id='body';input.value=record.body;input.oninput=()=>{record.body=input.value;changed();};
    const insert=(before,after='')=>{const start=input.selectionStart,end=input.selectionEnd;input.setRangeText(before+input.value.slice(start,end)+after,start,end,'select');record.body=input.value;changed();input.focus();};
    toolbar.append(button('Heading',()=>insert('\n## ')),button('Bold',()=>insert('**','**')),button('Italic',()=>insert('*','*')),button('Link',()=>insert('[','](https://)')),button('List',()=>insert('\n- ')),button('Insert media',()=>chooseMedia(source=>{insert(/\.(mp4|webm|mov)$/i.test(source)?`\n<video controls src="${source}" />\n`:`\n![Describe this image](${source})\n`);})));
    field.append(lab,element('p','Write in Markdown. Use headings to organize your process, decisions, and outcomes.','saved-note'),toolbar,input);form.append(field);
  }
  const history=element('div',undefined,'history');history.append(button('Show saved revisions',async()=>{
    try {const revisions=await api(`history?collection=${record.collection}&id=${record.id}`);history.replaceChildren(element('h3','Earlier versions'));if(!revisions.length)history.append(element('p','No earlier saves yet.','saved-note'));
      revisions.forEach(rev=>history.append(button(`Restore ${new Date(rev.savedAt).toLocaleString()}`,()=>{if(!canLeave())return;record.data=rev.data;record.body=rev.body;changed();renderEditor();notify('Earlier version loaded. Save changes to restore it.');})));
    }catch(error){notify(error.message,true);}
  }));form.append(history);
  if(record.collection!=='site'&&record.revision)form.append(button('Delete entry',async()=>{
    if(!window.confirm('Remove this entry from the portfolio? A recoverable copy will be kept locally.'))return;
    try{await api('delete',record);localStorage.removeItem(draftKey());state.dirty=false;state.records=await api('records');await navigate(record.collection);notify('Entry removed locally. Publish to remove it from the live site.');}catch(error){notify(error.message,true);}
  },'danger'));
  workspace.append(form);
}
async function upload(file, announce = true){
  if (announce) notify(`Uploading ${file.name} to the local library…`);
  const response=await fetch(`/__studio/api/upload?name=${encodeURIComponent(file.name)}`,{method:'POST',headers:{'x-studio-token':token},body:file});const result=await response.json();if(!response.ok)throw new Error(result.error);if (announce) notify('Media saved locally. Choose it in a content record.');return result;
}
function uploadControl(refresh){const area=element('div',undefined,'upload');const lab=element('label','Add images, videos, or a résumé PDF');const input=element('input');input.type='file';input.multiple=true;input.accept='image/*,video/*,.pdf';lab.append(element('br'),input);area.append(lab);input.onchange=async()=>{input.disabled=true;try{for(const file of input.files)await upload(file);await refresh();}catch(error){notify(error.message,true);}finally{input.disabled=false;}};return area;}
async function mediaGrid(select){
  const items=await api('media'),grid=element('div',undefined,'media-grid');
  for(const item of items){const card=element('article',undefined,'media-card');card.append(preview(item.source,''),element('p',item.name),element('p',item.references.length?`Used in ${item.references.join(', ')}`:'Not used in saved content'));
    if(select)card.append(button('Use this media',()=>select(item.source),'primary'));
    else {card.append(button('Copy path',async()=>{try{await navigator.clipboard.writeText(item.source);notify('Media path copied.');}catch{notify(item.source);}}));if(item.source.startsWith('/assets/studio/')&&!item.references.length)card.append(button('Remove',async()=>{if(!window.confirm('Move this unused upload to local trash?'))return;try{await api('remove-media',{name:item.name});await mediaPage();}catch(error){notify(error.message,true);}},'danger'));}grid.append(card);
  }if(!items.length)grid.append(element('p','Your library is empty. Upload media to get started.','empty'));return grid;
}
async function mediaPage(){workspace.replaceChildren(heading('Media library','Upload once. Reuse in projects, articles, and your profile. Removing a record’s media keeps the original available here.'),uploadControl(mediaPage));workspace.append(await mediaGrid());}
async function chooseMedia(callback){const dialog=document.querySelector('#picker'),content=document.querySelector('#picker-content');const refresh=async()=>{content.replaceChildren(uploadControl(refresh));content.append(await mediaGrid(source=>{dialog.close();callback(source);}));};try{await refresh();dialog.showModal();}catch(error){notify(error.message,true);}}
document.querySelector('#close-picker').onclick=()=>document.querySelector('#picker').close();
async function publishPage(){
  state.settings=await api('settings');const config=state.settings.config;
  workspace.replaceChildren(heading('Ready for the world.','Publish the portfolio saved on this computer. Unsaved browser drafts are not included.'));
  const card=element('section',undefined,'publish-card');card.append(element('h2','Your next release'),element('p','The publisher freezes your saved files, validates content, builds the site, uploads media, and deploys to Cloudflare. This publishes the current checkout, including any code changes.'));
  const dl=element('dl');for(const [name,value]of Object.entries({'Website':config.siteUrl,'Cloudflare project':config.projectName,'Branch':config.productionBranch,'Media bucket':config.mediaBucket}))dl.append(element('dt',name),element('dd',value));card.append(dl);
  const actions=element('div',undefined,'actions');const start=async(action)=>{try{await api(action,{});await watchJob();}catch(error){notify(error.message,true);}};
  actions.append(button('Check build',()=>start('build')),button('Publish saved changes',()=>start('publish'),'primary'));card.append(actions);workspace.append(card);
  if(state.settings.lastPublish){const last=state.settings.lastPublish;const p=element('p',`Last deployment: ${new Date(last.publishedAt).toLocaleString()} · ${last.verified?'verified':'verification pending'}`,'saved-note');workspace.append(p);}
  workspace.append(element('pre','No publishing job running.','job-log'));await watchJob();
}
async function watchJob(){
  if(state.section!=='publish')return;
  jobController?.abort(); jobController = new AbortController();
  const response = await fetch('/__studio/api/job-events', { headers: { 'x-studio-token': token }, signal: jobController.signal });
  if (!response.ok) throw new Error('Could not read publishing status.');
  const reader=response.body.getReader(), decoder=new TextDecoder(); let buffer='';
  try { while(true) {
    const {value,done}=await reader.read(); if(done)break; buffer+=decoder.decode(value,{stream:true});
    let newline; while((newline=buffer.indexOf('\n'))>=0){const job=JSON.parse(buffer.slice(0,newline));buffer=buffer.slice(newline+1);
      const log=workspace.querySelector('.job-log');if(log)log.textContent=job.log||'No publishing job running.';
      workspace.querySelectorAll('.actions button').forEach(b=>b.disabled=job.state==='running');
      if(job.state==='error')notify('The job stopped. Read the log for the failed step; an accepted deployment may still exist.',true);
      else if(job.state==='success')notify(job.result?.deployed?'Published and verified. Your portfolio is updated.':'Build passed. Nothing was published.');
    }
  }} catch(error) { if(error.name!=='AbortError')throw error; }
}
try{[state.records,state.settings]=await Promise.all([api('records'),api('settings')]);await navigate('projects');}catch(error){notify(error.message,true);}
