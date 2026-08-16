import {
  bindTypingSound,
  isSoundEnabled,
  playCollapseSound,
  playExpansionSound,
  playPageCloseSound,
  playPageOpenSound,
  playProjectPreviewSound,
  subscribeToSoundPreference,
  toggleSoundEnabled,
} from '../shared/audio.js';
import { initRasterCursor } from '../shared/raster-cursor.js';

const root = document.documentElement;
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const metaThemeColor = document.querySelector('meta[name="theme-color"]');

const storageKeys = {
  theme: 'portfolio-shell-theme',
};

const projects = {
  credify: {
    title: 'Credify',
    summary: 'Credit decisions with legible state and evidence.',
    year: '2024',
    date: 'Oct 2024',
    dateTime: '2024-10',
    liveUrl: 'https://hack-uta.vercel.app/',
    sourceUrl: 'https://github.com/Tec94/hack-uta',
    type: 'Product system',
    media: '/screenshots/credify.svg',
    alt: 'Credify interface preview',
    context: 'A representative product flow with dense information and a consequential decision point.',
    decisions: 'The prototype prioritizes hierarchy, state clarity, and a short path to the primary action.',
    outcome: 'This page tests the index-to-case-study transition. Verified project evidence will replace the placeholder before publication.',
  },
  citizenvoice: {
    title: 'CitizenVoice',
    summary: 'Place-based civic feedback that keeps context in view.',
    year: '2024',
    date: 'Sep 2024',
    dateTime: '2024-09',
    liveUrl: 'https://hack-rice-nine.vercel.app/',
    sourceUrl: 'https://github.com/Tec94/Hack-Rice',
    type: 'Civic platform',
    media: '/screenshots/citizen-voice.svg',
    alt: 'CitizenVoice interface preview',
    context: 'A representative civic interface that gathers place-based feedback without losing geographic context.',
    decisions: 'The prototype keeps the map and response states legible while giving the primary task a clear visual path.',
    outcome: 'This page tests how a map-led project reads in the shared case-study frame. Publication claims remain withheld pending evidence review.',
  },
  smartnest: {
    title: 'Smartnest',
    summary: 'Calm guidance for a consequential health flow.',
    year: '2024',
    date: 'Jun 2024',
    dateTime: '2024-06',
    liveUrl: 'https://smartnest.health/',
    sourceUrl: 'https://github.com/Tec94/smartnest',
    type: 'Health technology',
    media: '/screenshots/smartnest.svg',
    alt: 'Smartnest interface preview',
    context: 'A representative health-technology experience where guidance must remain calm, direct, and easy to revisit.',
    decisions: 'The prototype uses plain hierarchy and bounded actions so users can orient themselves before making a choice.',
    outcome: 'This page tests a softer visual register inside the same case-study system. Verified outcomes will be added after the content audit.',
  },
  'stock-tracker': {
    title: 'Stock Tracker',
    summary: 'A monitoring interface for changing market data.',
    year: '2024',
    date: 'May 2024',
    dateTime: '2024-05',
    liveUrl: 'https://stock-tracker-41285.bubbleapps.io/version-test',
    sourceUrl: 'https://github.com/Tec94/stock-tracker',
    type: 'Data product',
    media: '/screenshots/stock-tracker.svg',
    alt: 'Stock Tracker interface preview',
    context: 'A representative dashboard with changing values, comparisons, and repeated scanning tasks.',
    decisions: 'The prototype keeps numeric relationships stable and separates monitoring from action.',
    outcome: 'This page tests dense product media at the approved reading width. Metrics remain unpublished until they can be verified.',
  },
  munky: {
    title: '$Munky',
    summary: 'An expressive product experiment with a short path.',
    year: '2025',
    date: 'Jan 2025',
    dateTime: '2025-01',
    liveUrl: 'https://munky-sol.vercel.app/',
    sourceUrl: 'https://github.com/Tec94/munky-sol',
    type: 'Experiment',
    media: '/screenshots/munky.svg',
    alt: '$Munky interface preview',
    context: 'A representative experiment with a more expressive visual language and a short interaction path.',
    decisions: 'The prototype lets the project keep its own color while the surrounding case-study structure stays restrained.',
    outcome: 'This page tests the expressive edge of the shared template. Final content remains subject to the project evidence audit.',
  },
};

const projectOrder = Object.keys(projects);
const indexView = document.querySelector('[data-page-view="index"]');
const projectView = document.querySelector('[data-page-view="project"]');
const dockIndex = document.querySelector('[data-dock-index]');
const dockProject = document.querySelector('[data-dock-project]');
const projectOnlyControls = document.querySelectorAll('[data-project-only]');
const workCollection = document.querySelector('[data-work-collection]');
const workList = document.querySelector('[data-work-list]');
const workShowcase = document.querySelector('[data-work-showcase]');
const workHeading = document.querySelector('.work-heading');
const workViews = {
  list: workList,
  showcase: workShowcase,
};
let displayedWorkView = workCollection?.dataset.layout === 'showcase' ? 'showcase' : 'list';
let requestedWorkView = displayedWorkView;
let workViewAnimation = null;
let workViewProcessor = null;
let currentProject = null;
let returnFocus = null;
let toastTimer;

const safeRead = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeWrite = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Preferences remain usable for the active page.
  }
};

let themeMode = ['system', 'light', 'dark'].includes(safeRead(storageKeys.theme))
  ? safeRead(storageKeys.theme)
  : 'system';

function showToast(message) {
  const toast = document.querySelector('[data-toast]');
  if (!toast) return;
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.dataset.visible = 'true';
  toastTimer = window.setTimeout(() => {
    toast.dataset.visible = 'false';
  }, 1800);
}

function applyTheme({ announce = false } = {}) {
  const resolved = themeMode === 'system'
    ? (systemTheme.matches ? 'dark' : 'light')
    : themeMode;

  root.dataset.themeMode = themeMode;
  root.dataset.resolvedTheme = resolved;
  metaThemeColor?.setAttribute('content', resolved === 'dark' ? '#211e1b' : '#f2eee5');

  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.setAttribute('aria-label', `Theme: ${themeMode}${themeMode === 'system' ? `, currently ${resolved}` : ''}`);
  });
  document.querySelectorAll('[data-theme-label]').forEach((label) => {
    label.textContent = `Theme: ${themeMode}${themeMode === 'system' ? ` · ${resolved}` : ''}`;
  });

  if (announce) showToast(`Theme: ${themeMode}`);
}

function cycleTheme() {
  const modes = ['system', 'light', 'dark'];
  themeMode = modes[(modes.indexOf(themeMode) + 1) % modes.length];
  safeWrite(storageKeys.theme, themeMode);
  applyTheme({ announce: true });
}

function applySound({ announce = false } = {}) {
  const soundEnabled = isSoundEnabled();
  document.querySelectorAll('[data-sound-toggle]').forEach((button) => {
    button.setAttribute('aria-pressed', String(soundEnabled));
    button.setAttribute('aria-label', `Interface sounds ${soundEnabled ? 'on' : 'off'}`);
  });
  document.querySelectorAll('[data-sound-label]').forEach((label) => {
    label.textContent = `Sound ${soundEnabled ? 'on' : 'off'}`;
  });
  if (announce) showToast(`Sound preference ${soundEnabled ? 'on' : 'off'}`);
}

document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', cycleTheme);
});

document.querySelectorAll('[data-sound-toggle]').forEach((button) => {
  button.addEventListener('click', () => {
    toggleSoundEnabled();
    applySound({ announce: true });
  });
});

systemTheme.addEventListener('change', () => {
  if (themeMode === 'system') applyTheme();
});

function createShowcaseCard(slug, index) {
  const project = projects[slug];
  const article = document.createElement('article');
  article.className = 'showcase-card';
  if (index >= 3) {
    article.dataset.moreProject = '';
    article.hidden = true;
  }

  const mediaButton = document.createElement('button');
  mediaButton.className = 'showcase-media';
  mediaButton.type = 'button';
  mediaButton.dataset.projectPreview = slug;
  mediaButton.setAttribute('aria-label', `Open ${project.title} case study`);
  mediaButton.dataset.cursorIntent = 'media';
  mediaButton.dataset.cursorTone = 'dark';

  const image = document.createElement('img');
  image.src = project.media;
  image.alt = project.alt;
  mediaButton.append(image);

  const title = document.createElement('a');
  title.className = 'showcase-title';
  title.href = `?project=${slug}`;
  title.dataset.projectLink = slug;
  title.innerHTML = `<strong>${project.title}</strong>`;

  const summary = document.createElement('p');
  summary.textContent = project.summary;

  const copy = document.createElement('div');
  copy.className = 'showcase-copy';
  copy.append(title, summary);

  const date = document.createElement('time');
  date.className = 'showcase-date';
  date.dateTime = project.dateTime;
  date.textContent = project.date;

  const actions = document.createElement('div');
  actions.className = 'showcase-actions';
  actions.innerHTML = `
    <a class="showcase-action showcase-action-live" href="${project.liveUrl}" target="_blank" rel="noreferrer" aria-label="Open ${project.title} live site">
      <svg aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5"></circle><path d="M3.5 12h17M12 3.5c2.25 2.35 3.45 5.18 3.45 8.5S14.25 18.15 12 20.5M12 3.5C9.75 5.85 8.55 8.68 8.55 12s1.2 6.15 3.45 8.5"></path></svg>
    </a>
    <a class="showcase-action" href="${project.sourceUrl}" target="_blank" rel="noreferrer" aria-label="Open ${project.title} source on GitHub">
      <svg class="github-mark" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2.9a9.2 9.2 0 0 0-2.9 17.93c.46.08.63-.2.63-.44v-1.78c-2.57.56-3.11-1.09-3.11-1.09-.42-1.07-1.03-1.35-1.03-1.35-.84-.57.06-.56.06-.56.93.07 1.42.95 1.42.95.83 1.42 2.17 1.01 2.7.77.08-.6.32-1.01.59-1.24-2.05-.23-4.21-1.03-4.21-4.57 0-1.01.36-1.84.95-2.49-.1-.23-.41-1.18.09-2.45 0 0 .78-.25 2.53.95A8.8 8.8 0 0 1 12 7.22a8.7 8.7 0 0 1 2.31.31c1.76-1.2 2.53-.95 2.53-.95.5 1.27.19 2.22.09 2.45.59.65.95 1.48.95 2.49 0 3.55-2.16 4.33-4.22 4.56.33.29.63.85.63 1.72v2.59c0 .25.17.53.64.44A9.2 9.2 0 0 0 12 2.9Z"></path></svg>
    </a>`;

  const details = document.createElement('div');
  details.className = 'showcase-details';
  details.append(copy, date, actions);
  article.append(mediaButton, details);
  return article;
}

projectOrder.forEach((slug, index) => {
  workShowcase?.append(createShowcaseCard(slug, index));
});

const showcaseMore = document.createElement('button');
showcaseMore.className = 'showcase-more';
showcaseMore.type = 'button';
showcaseMore.dataset.moreProjects = '';
showcaseMore.textContent = 'More';
showcaseMore.setAttribute('aria-label', 'Show more projects');
workShowcase?.querySelector('[data-more-project]')?.before(showcaseMore);

function setWorkViewFrame(element, progress) {
  const boundedProgress = Math.min(1, Math.max(0, progress));
  element.style.clipPath = `inset(0 0 ${(1 - boundedProgress) * 100}% 0)`;
  element.style.opacity = String(boundedProgress);
}

function workViewProgress(element) {
  const opacity = Number.parseFloat(getComputedStyle(element).opacity);
  return Number.isFinite(opacity) ? Math.min(1, Math.max(0, opacity)) : 1;
}

function stopWorkViewAnimation() {
  if (!workViewAnimation) return;
  const { element, animation } = workViewAnimation;
  const progress = workViewProgress(element);
  workViewAnimation = null;
  animation.cancel();
  setWorkViewFrame(element, progress);
}

async function animateWorkView(element, opening) {
  const from = workViewProgress(element);
  const to = opening ? 1 : 0;
  const distance = Math.abs(to - from);

  if (reducedMotion.matches || distance < 0.001 || typeof element.animate !== 'function') {
    setWorkViewFrame(element, to);
    return;
  }

  const animation = element.animate([
    {
      clipPath: `inset(0 0 ${(1 - from) * 100}% 0)`,
      opacity: from,
    },
    {
      clipPath: `inset(0 0 ${(1 - to) * 100}% 0)`,
      opacity: to,
    },
  ], {
    duration: 260 * distance,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    fill: 'forwards',
  });
  workViewAnimation = { element, animation };

  try {
    await animation.finished;
  } catch {
    // A new view request resumes from the captured in-flight frame.
  }

  if (workViewAnimation?.animation !== animation) return;
  setWorkViewFrame(element, to);
  workViewAnimation = null;
  animation.cancel();
}

async function reconcileWorkView() {
  workCollection.dataset.switching = 'true';

  while (displayedWorkView !== requestedWorkView || workViewProgress(workViews[displayedWorkView]) < 0.999) {
    const outgoing = workViews[displayedWorkView];

    if (displayedWorkView === requestedWorkView) {
      await animateWorkView(outgoing, true);
      continue;
    }

    await animateWorkView(outgoing, false);
    if (displayedWorkView === requestedWorkView) continue;
    if (workViewProgress(outgoing) > 0.001) continue;

    outgoing.hidden = true;
    outgoing.removeAttribute('style');
    displayedWorkView = requestedWorkView;
    workCollection.dataset.layout = displayedWorkView;

    const incoming = workViews[displayedWorkView];
    incoming.hidden = false;
    setWorkViewFrame(incoming, 0);
    await animateWorkView(incoming, true);
  }

  const activeView = workViews[displayedWorkView];
  activeView.removeAttribute('style');
  Object.entries(workViews).forEach(([name, element]) => {
    element.hidden = name !== displayedWorkView;
  });
  workCollection.dataset.layout = displayedWorkView;
  delete workCollection.dataset.switching;
}

function setWorkView(view, { sound = true } = {}) {
  if (!workViews[view]) return;
  const changed = requestedWorkView !== view || displayedWorkView !== view;
  requestedWorkView = view;
  document.querySelectorAll('[data-work-view]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.workView === view));
  });

  if (!changed && !workViewProcessor) {
    workCollection.dataset.layout = view;
    Object.entries(workViews).forEach(([name, element]) => {
      element.hidden = name !== view;
    });
    return;
  }

  stopWorkViewAnimation();
  if (sound && changed) void playExpansionSound();
  if (!workViewProcessor) {
    workViewProcessor = reconcileWorkView().finally(() => {
      workViewProcessor = null;
      if (displayedWorkView !== requestedWorkView) setWorkView(requestedWorkView, { sound: false });
    });
  }
}

document.querySelectorAll('[data-work-view]').forEach((button) => {
  button.addEventListener('click', () => setWorkView(button.dataset.workView));
});

function setProjectContent(slug) {
  const project = projects[slug];
  if (!project) return false;

  document.querySelector('[data-project-title]').textContent = project.title;
  document.querySelector('[data-project-meta]').textContent = `${project.type} · ${project.date}`;
  document.querySelector('[data-project-media]').src = project.media;
  document.querySelector('[data-project-media]').alt = project.alt;
  document.querySelector('[data-project-context]').textContent = project.context;
  document.querySelector('[data-project-decisions]').textContent = project.decisions;
  document.querySelector('[data-project-outcome]').textContent = project.outcome;

  const nextIndex = (projectOrder.indexOf(slug) + 1) % projectOrder.length;
  const nextSlug = projectOrder[nextIndex];
  document.querySelector('[data-next-project]').dataset.project = nextSlug;
  document.querySelector('[data-next-project-title]').textContent = projects[nextSlug].title;
  document.title = `${project.title} — Jack Cao`;
  return true;
}

function syncView(view) {
  const isProject = view === 'project';
  root.dataset.view = isProject ? 'project' : 'index';
  indexView.hidden = isProject;
  projectView.hidden = !isProject;
  dockIndex.hidden = isProject;
  dockProject.hidden = !isProject;
  projectOnlyControls.forEach((control) => {
    control.hidden = !isProject;
  });
}

function updateUrl(slug, mode = 'push') {
  const url = new URL(window.location.href);
  if (slug) url.searchParams.set('project', slug);
  else url.searchParams.delete('project');
  history[`${mode}State`]({ project: slug }, '', url);
}

function openProject(slug, { historyMode = 'push', focusSource = null, sound = true } = {}) {
  if (!setProjectContent(slug)) return;
  returnFocus = focusSource || returnFocus;
  currentProject = slug;
  syncView('project');
  if (historyMode) updateUrl(slug, historyMode);
  if (historyMode === 'push' && sound) void playPageOpenSound(projectOrder.indexOf(slug));
  window.scrollTo({ top: 0, behavior: 'auto' });
  projectView.focus?.({ preventScroll: true });
}

function closeProject({ historyMode = 'push', restoreFocus = true } = {}) {
  currentProject = null;
  syncView('index');
  document.title = 'Work — Jack Cao';
  if (historyMode) updateUrl(null, historyMode);
  if (historyMode === 'push') void playPageCloseSound();
  window.scrollTo({ top: 0, behavior: 'auto' });
  if (restoreFocus && returnFocus?.isConnected) {
    returnFocus.focus({ preventScroll: true });
  }
}

// Timings are matched to the supplied 30 fps ja.mt reference clips.
const referenceTiming = {
  reveal: 520,
  titleExit: 260,
  previewOpen: 560,
  previewClose: 460,
};

function isPlainPrimaryClick(event) {
  return event.button === 0
    && !event.metaKey
    && !event.ctrlKey
    && !event.shiftKey
    && !event.altKey;
}

function revealMoreProjects(trigger) {
  if (workCollection.dataset.expanded === 'true') return;
  const instant = reducedMotion.matches;
  workCollection.dataset.expanded = 'true';
  indexView.dataset.revealingProjects = 'true';

  document.querySelectorAll('[data-more-project]').forEach((project) => {
    project.hidden = false;
    if (!instant) project.dataset.entering = 'true';
  });

  const moreLink = document.querySelector('.work-more-row [data-more-projects]');
  const moreThumbnail = document.querySelector('[data-more-thumbnail]');
  const projectLabel = moreLink?.querySelector('[data-project-label]');
  const moreLabel = moreLink?.querySelector('[data-more-label]');
  const moreArrow = document.querySelector('.work-more-row .more-arrow');
  if (moreLink) {
    moreLink.setAttribute('aria-label', 'Open Stock Tracker');
    moreLink.dataset.moreExpanded = 'true';
  }
  if (moreThumbnail) moreThumbnail.disabled = false;
  projectLabel?.removeAttribute('aria-hidden');
  moreLabel?.setAttribute('aria-hidden', 'true');
  if (moreArrow) moreArrow.hidden = true;

  if (showcaseMore) {
    showcaseMore.dataset.leaving = 'true';
  }

  const headingRect = workHeading.getBoundingClientRect();
  const rootSize = Number.parseFloat(getComputedStyle(root).fontSize);
  window.scrollTo({
    top: Math.max(0, window.scrollY + headingRect.top - rootSize * 1.5),
    behavior: instant ? 'auto' : 'smooth',
  });

  const settle = () => {
    delete indexView.dataset.revealingProjects;
    document.querySelectorAll('[data-more-project]').forEach((project) => {
      delete project.dataset.entering;
    });
    showcaseMore.hidden = true;
    delete showcaseMore.dataset.leaving;
  };

  if (instant) settle();
  else window.setTimeout(settle, referenceTiming.reveal);
  void playExpansionSound();
  trigger?.blur?.();
}

function animateProjectTitle(link) {
  if (reducedMotion.matches) return null;
  const title = link.querySelector('strong');
  return title?.animate([
    { opacity: 1, filter: 'blur(0)', transform: 'translateY(0)' },
    { opacity: 0, filter: 'blur(0.38rem)', transform: 'translateY(-0.45rem)' },
  ], {
    duration: referenceTiming.titleExit,
    easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    fill: 'forwards',
  });
}

function navigateToProject(link, previewTrigger = null, focusSource = link) {
  const slug = link?.dataset.projectLink || previewTrigger?.dataset.projectPreview;
  if (!slug) return;
  const trigger = previewTrigger
    || link.closest('.work-row, .showcase-card')?.querySelector('[data-project-preview]');

  if (!trigger || reducedMotion.matches) {
    openProject(slug, { focusSource });
    return;
  }

  const titleAnimation = animateProjectTitle(link);
  void openProjectPreview(trigger, { navigateAfter: true, focusSource }).finally(() => {
    titleAnimation?.cancel();
  });
}

document.querySelectorAll('[data-project-link]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (!isPlainPrimaryClick(event)) return;
    event.preventDefault();
    if (link.matches('[data-more-projects]') && workCollection.dataset.expanded !== 'true') {
      revealMoreProjects(link);
      return;
    }
    navigateToProject(link);
  });
});

document.querySelectorAll('.work-row, .showcase-media').forEach((target) => {
  target.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse') void playProjectPreviewSound();
  });
});

document.querySelectorAll('.showcase-more').forEach((button) => {
  button.addEventListener('click', () => revealMoreProjects(button));
});

const previewDialog = document.querySelector('[data-project-preview-dialog]');
const previewFrame = document.querySelector('[data-project-preview-frame]');
const previewImage = document.querySelector('[data-project-preview-image]');
const previewTitle = document.querySelector('[data-project-preview-title]');
const previewClose = document.querySelector('[data-project-preview-close]');
let previewSource = null;
let previewAnimating = false;

function nextPaint() {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => window.requestAnimationFrame(resolve));
  });
}

function sourceFrameFor(trigger) {
  return trigger.querySelector('.stack-frame-front') || trigger;
}

function createPreviewClone(project, rect, borderWidth, borderRadius) {
  const clone = document.createElement('div');
  clone.className = 'project-preview-clone';
  Object.assign(clone.style, {
    left: `${rect.left}px`,
    top: `${rect.top}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    borderWidth: `${borderWidth}px`,
    borderRadius,
  });
  const image = document.createElement('img');
  image.src = project.media;
  image.alt = '';
  clone.append(image);
  document.body.append(clone);
  return clone;
}

async function openProjectPreview(trigger, { navigateAfter = false, focusSource = trigger } = {}) {
  const slug = trigger.dataset.projectPreview;
  const project = projects[slug];
  if (!project || previewDialog.open || previewAnimating) return;

  if (navigateAfter && reducedMotion.matches) {
    openProject(slug, { focusSource });
    return;
  }

  previewAnimating = true;
  previewSource = trigger;
  previewImage.src = project.media;
  previewImage.alt = project.alt;
  previewTitle.textContent = project.title;
  previewDialog.dataset.entering = 'true';
  previewDialog.showModal();
  root.dataset.previewOpen = 'true';
  void playPageOpenSound(projectOrder.indexOf(slug));
  await nextPaint();

  const source = sourceFrameFor(trigger);
  const sourceRect = source.getBoundingClientRect();
  const sourceStyle = getComputedStyle(source);
  const targetRect = previewFrame.getBoundingClientRect();
  const targetStyle = getComputedStyle(previewFrame);

  if (reducedMotion.matches) {
    previewFrame.style.visibility = '';
  } else {
    previewFrame.style.visibility = 'hidden';
    const clone = createPreviewClone(
      project,
      sourceRect,
      Number.parseFloat(sourceStyle.borderTopWidth) || 0,
      sourceStyle.borderRadius,
    );
    const animation = clone.animate([
      {},
      {
        left: `${targetRect.left}px`,
        top: `${targetRect.top}px`,
        width: `${targetRect.width}px`,
        height: `${targetRect.height}px`,
        borderWidth: targetStyle.borderTopWidth,
        borderRadius: targetStyle.borderRadius,
      },
    ], {
      duration: referenceTiming.previewOpen,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards',
    });
    try {
      await animation.finished;
    } catch {
      // The final viewer state remains available if animation is interrupted.
    }
    previewFrame.style.visibility = '';
    clone.remove();
  }

  delete previewDialog.dataset.entering;
  previewAnimating = false;

  if (navigateAfter) {
    previewDialog.close();
    previewFrame.style.visibility = '';
    previewTitle.removeAttribute('style');
    delete root.dataset.previewOpen;
    previewSource = null;
    openProject(slug, { focusSource, sound: false });
    return;
  }

  previewClose.focus({ preventScroll: true });
}

async function closeProjectPreview() {
  if (!previewDialog.open || previewAnimating) return;
  previewAnimating = true;
  void playPageCloseSound();
  const slug = previewSource?.dataset.projectPreview;
  const project = projects[slug];
  const source = previewSource && sourceFrameFor(previewSource);

  if (!reducedMotion.matches && project && source?.isConnected) {
    const startRect = previewFrame.getBoundingClientRect();
    const endRect = source.getBoundingClientRect();
    const startStyle = getComputedStyle(previewFrame);
    const endStyle = getComputedStyle(source);
    const clone = createPreviewClone(
      project,
      startRect,
      Number.parseFloat(startStyle.borderTopWidth) || 0,
      startStyle.borderRadius,
    );
    previewFrame.style.visibility = 'hidden';
    previewTitle.animate([
      { opacity: 1, filter: 'blur(0)', transform: 'translateY(0)' },
      { opacity: 0, filter: 'blur(0.38rem)', transform: 'translateY(0.45rem)' },
    ], {
      duration: referenceTiming.previewClose,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards',
    });
    const animation = clone.animate([
      {},
      {
        left: `${endRect.left}px`,
        top: `${endRect.top}px`,
        width: `${endRect.width}px`,
        height: `${endRect.height}px`,
        borderWidth: endStyle.borderTopWidth,
        borderRadius: endStyle.borderRadius,
      },
    ], {
      duration: referenceTiming.previewClose,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'forwards',
    });
    try {
      await animation.finished;
    } catch {
      // Closing still completes if the visual animation is interrupted.
    }
    clone.remove();
  }

  previewDialog.close();
  previewFrame.style.visibility = '';
  previewTitle.removeAttribute('style');
  delete root.dataset.previewOpen;
  previewAnimating = false;
  previewSource?.focus({ preventScroll: true });
  previewSource = null;
}

document.querySelectorAll('[data-project-preview]').forEach((button) => {
  button.addEventListener('click', () => {
    const link = button.closest('.work-row, .showcase-card')?.querySelector('[data-project-link]');
    navigateToProject(link, button, button);
  });
});

document.querySelectorAll('.work-row, .showcase-card').forEach((container) => {
  container.addEventListener('click', (event) => {
    if (!isPlainPrimaryClick(event) || event.target.closest('a, button')) return;
    const link = container.querySelector('[data-project-link]');
    if (!link) return;

    if (link.matches('[data-more-projects]') && workCollection.dataset.expanded !== 'true') {
      revealMoreProjects(link);
      return;
    }

    const trigger = container.querySelector('[data-project-preview]');
    navigateToProject(link, trigger, link);
  });
});

previewClose.addEventListener('click', () => void closeProjectPreview());
previewDialog.addEventListener('click', (event) => {
  if (event.target === previewDialog || event.target === previewDialog.querySelector('figure')) {
    void closeProjectPreview();
  }
});
previewDialog.addEventListener('cancel', (event) => {
  event.preventDefault();
  void closeProjectPreview();
});

document.querySelectorAll('[data-close-project]').forEach((button) => {
  button.addEventListener('click', () => closeProject());
});

document.querySelector('[data-next-project]')?.addEventListener('click', (event) => {
  openProject(event.currentTarget.dataset.project, { historyMode: 'push' });
});

document.querySelectorAll('[data-scroll-top]').forEach((button) => {
  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
  });
});

window.addEventListener('popstate', () => {
  const slug = new URL(window.location.href).searchParams.get('project');
  if (slug && projects[slug]) openProject(slug, { historyMode: null });
  else closeProject({ historyMode: null, restoreFocus: false });
});

const tocLinks = [...document.querySelectorAll('.project-toc a')];
const storySections = [...document.querySelectorAll('[data-project-section]')];

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const current = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!current) return;
    tocLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${current.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-20% 0px -55% 0px', threshold: [0, 0.2, 0.5] });
  storySections.forEach((section) => sectionObserver.observe(section));
}

const commandDialog = document.querySelector('[data-command-dialog]');
const commandInput = document.querySelector('[data-command-input]');
const commandItems = [...document.querySelectorAll('[data-command-item]')];
const commandCount = document.querySelector('[data-command-count]');
const commandEmpty = document.querySelector('[data-command-empty]');
let activeCommandIndex = 0;
let commandReturnTarget = document.querySelector('[data-command-open]');

function visibleCommandItems() {
  return commandItems.filter((item) => !item.hidden);
}

function setActiveCommand(index) {
  const visible = visibleCommandItems();
  if (!visible.length) return;
  activeCommandIndex = (index + visible.length) % visible.length;
  commandItems.forEach((item) => item.removeAttribute('aria-selected'));
  visible[activeCommandIndex].setAttribute('aria-selected', 'true');
  visible[activeCommandIndex].scrollIntoView({ block: 'nearest' });
}

function filterCommands() {
  const query = commandInput.value.trim().toLowerCase();
  commandItems.forEach((item) => {
    item.hidden = query.length > 0 && !item.dataset.search.toLowerCase().includes(query);
  });
  const visible = visibleCommandItems();
  commandCount.textContent = `${visible.length} ${visible.length === 1 ? 'result' : 'results'}`;
  commandEmpty.hidden = visible.length > 0;
  activeCommandIndex = 0;
  if (visible.length) setActiveCommand(0);
}

function openCommand(trigger = document.activeElement) {
  commandReturnTarget = trigger instanceof HTMLElement && trigger !== document.body && trigger !== document.documentElement
    ? trigger
    : document.querySelector('[data-command-open]');
  if (!commandDialog?.open) {
    commandDialog.showModal();
    void playExpansionSound();
  }
  commandInput.value = '';
  filterCommands();
  requestAnimationFrame(() => commandInput.focus());
}

function closeCommand() {
  if (commandDialog?.open) {
    commandDialog.close();
    void playCollapseSound();
    commandReturnTarget?.focus();
  }
}

function runCommand(item) {
  closeCommand();

  if (item.dataset.project) {
    openProject(item.dataset.project, { historyMode: 'push' });
    return;
  }

  if (item.dataset.action === 'theme') {
    cycleTheme();
    return;
  }

  if (item.dataset.href) {
    window.location.href = item.dataset.href;
    return;
  }

  if (item.dataset.target) {
    if (currentProject) closeProject({ historyMode: 'push', restoreFocus: false });
    requestAnimationFrame(() => document.querySelector(item.dataset.target)?.scrollIntoView({ behavior: reducedMotion.matches ? 'auto' : 'smooth' }));
  }
}

document.querySelectorAll('[data-command-open]').forEach((button) => {
  button.addEventListener('click', () => openCommand(button));
});
document.querySelectorAll('[data-command-close]').forEach((button) => {
  button.addEventListener('click', closeCommand);
});
commandInput?.addEventListener('input', filterCommands);
bindTypingSound(commandInput);
commandItems.forEach((item) => {
  item.addEventListener('click', () => runCommand(item));
});

commandDialog?.addEventListener('click', (event) => {
  if (event.target === commandDialog) closeCommand();
});
commandDialog?.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeCommand();
});

document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    openCommand();
    return;
  }

  if (!commandDialog?.open) return;
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    setActiveCommand(activeCommandIndex + 1);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    setActiveCommand(activeCommandIndex - 1);
  } else if (event.key === 'Enter') {
    event.preventDefault();
    const visible = visibleCommandItems();
    if (visible[activeCommandIndex]) runCommand(visible[activeCommandIndex]);
  }
});

setWorkView('list', { sound: false });
applyTheme();
applySound();
subscribeToSoundPreference(() => applySound());
initRasterCursor();

const initialProject = new URL(window.location.href).searchParams.get('project');
if (initialProject && projects[initialProject]) {
  openProject(initialProject, { historyMode: 'replace' });
} else {
  syncView('index');
}
