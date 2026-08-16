import {
  bindTypingSound,
  isSoundEnabled,
  playCollapseSound,
  playExpansionSound,
  subscribeToSoundPreference,
  toggleSoundEnabled,
} from '../shared/audio.js';
import { initRasterCursor } from '../shared/raster-cursor.js';

const root = document.documentElement;
const metaThemeColor = document.querySelector('meta[name="theme-color"]');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const storageKeys = {
  theme: 'portfolio-shell-theme',
};
const themeModes = ['system', 'light', 'dark'];
const sectionNames = {
  intro: 'Introduction',
  work: 'Work',
  services: 'Services',
  about: 'About',
  contact: 'Contact',
};

const readStored = (key) => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeStored = (key, value) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // The prototype remains usable when storage is unavailable.
  }
};

let themeMode = themeModes.includes(readStored(storageKeys.theme))
  ? readStored(storageKeys.theme)
  : 'system';
let toastTimer;

const resolvedTheme = () => (
  themeMode === 'system'
    ? (systemTheme.matches ? 'dark' : 'light')
    : themeMode
);

const showToast = (message) => {
  const toast = document.querySelector('[data-toast]');
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.dataset.visible = 'true';
  toastTimer = window.setTimeout(() => {
    toast.dataset.visible = 'false';
  }, 2200);
};

const applyTheme = ({ announce = false } = {}) => {
  const resolved = resolvedTheme();
  root.dataset.themeMode = themeMode;
  root.dataset.resolvedTheme = resolved;
  metaThemeColor?.setAttribute('content', resolved === 'dark' ? '#211e1b' : '#f2eee5');

  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.setAttribute(
      'aria-label',
      'Theme: ' + themeMode + (themeMode === 'system' ? ', currently ' + resolved : ''),
    );
  });
  document.querySelectorAll('[data-theme-label]').forEach((label) => {
    label.textContent = 'Theme: ' + themeMode + (themeMode === 'system' ? ' · ' + resolved : '');
  });
  const commandDetail = document.querySelector('[data-command-theme-detail]');
  if (commandDetail) {
    commandDetail.textContent = themeMode === 'system'
      ? 'Follows system · currently ' + resolved
      : 'Currently ' + themeMode;
  }

  if (announce) {
    showToast('Theme: ' + themeMode + (themeMode === 'system' ? ' (' + resolved + ')' : ''));
  }
};

const cycleTheme = () => {
  const currentIndex = themeModes.indexOf(themeMode);
  themeMode = themeModes[(currentIndex + 1) % themeModes.length];
  writeStored(storageKeys.theme, themeMode);
  applyTheme({ announce: true });
};

const applySound = ({ announce = false } = {}) => {
  const soundEnabled = isSoundEnabled();
  document.querySelectorAll('[data-sound-toggle]').forEach((button) => {
    button.setAttribute('aria-pressed', String(soundEnabled));
    button.setAttribute('aria-label', 'Interface sound preference ' + (soundEnabled ? 'on' : 'off'));
  });
  document.querySelectorAll('[data-sound-label]').forEach((label) => {
    label.textContent = 'Sound ' + (soundEnabled ? 'on' : 'off');
  });
  if (announce) {
    showToast('Sound preference ' + (soundEnabled ? 'on' : 'off'));
  }
};

const toggleSound = () => {
  const soundEnabled = toggleSoundEnabled();
  applySound({ announce: true });
  return soundEnabled;
};

document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
  button.addEventListener('click', cycleTheme);
});

document.querySelectorAll('[data-sound-toggle]').forEach((button) => {
  button.addEventListener('click', toggleSound);
});

systemTheme.addEventListener('change', () => {
  if (themeMode === 'system') applyTheme();
});

const scrollBehavior = () => (reducedMotion.matches ? 'auto' : 'smooth');

const scrollToTop = () => {
  document.querySelector('#intro')?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
};

document.querySelectorAll('[data-scroll-top]').forEach((button) => {
  button.addEventListener('click', scrollToTop);
});

const setActiveSection = (section) => {
  if (!sectionNames[section]) return;
  document.querySelectorAll('[data-section-link]').forEach((link) => {
    if (link.dataset.sectionLink === section) {
      link.setAttribute('aria-current', 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
    if (visible[0]) setActiveSection(visible[0].target.dataset.section);
  },
  { rootMargin: '-28% 0px -55% 0px', threshold: [0, 0.05, 0.2, 0.45] },
);

document.querySelectorAll('.observed-section').forEach((section) => {
  sectionObserver.observe(section);
});

const commandDialog = document.querySelector('[data-command-dialog]');
const commandInput = document.querySelector('[data-command-input]');
const commandItems = [...document.querySelectorAll('[data-command-item]')];
const commandCount = document.querySelector('[data-command-count]');
const commandEmpty = document.querySelector('[data-command-empty]');
let activeCommandIndex = 0;
let commandReturnTarget = document.querySelector('[data-command-open]');

const visibleCommandItems = () => commandItems.filter((item) => !item.hidden);

const setActiveCommand = (index) => {
  const visibleItems = visibleCommandItems();
  if (!visibleItems.length) return;
  activeCommandIndex = ((index % visibleItems.length) + visibleItems.length) % visibleItems.length;
  commandItems.forEach((item) => {
    item.dataset.active = 'false';
    item.setAttribute('aria-selected', 'false');
  });
  const activeItem = visibleItems[activeCommandIndex];
  activeItem.dataset.active = 'true';
  activeItem.setAttribute('aria-selected', 'true');
  activeItem.scrollIntoView({ block: 'nearest' });
};

const filterCommands = () => {
  const query = commandInput?.value.trim().toLocaleLowerCase() ?? '';
  commandItems.forEach((item) => {
    const haystack = (item.textContent + ' ' + item.dataset.search).toLocaleLowerCase();
    item.hidden = query.length > 0 && !haystack.includes(query);
  });
  const visibleCount = visibleCommandItems().length;
  if (commandCount) commandCount.textContent = visibleCount + ' ' + (visibleCount === 1 ? 'match' : 'matches');
  if (commandEmpty) commandEmpty.hidden = visibleCount !== 0;
  activeCommandIndex = 0;
  if (visibleCount) setActiveCommand(0);
};

const openCommands = (trigger = document.activeElement) => {
  commandReturnTarget = trigger instanceof HTMLElement && trigger !== document.body && trigger !== document.documentElement
    ? trigger
    : document.querySelector('[data-command-open]');
  if (!commandDialog?.open) {
    commandDialog?.showModal();
    void playExpansionSound();
  }
  if (commandInput) commandInput.value = '';
  filterCommands();
  window.requestAnimationFrame(() => commandInput?.focus());
};

const closeCommands = () => {
  if (commandDialog?.open) {
    commandDialog.close();
    void playCollapseSound();
    commandReturnTarget?.focus();
  }
};

const runCommand = (item) => {
  const target = item.dataset.target;
  const action = item.dataset.action;
  if (target) {
    closeCommands();
    document.querySelector(target)?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    return;
  }
  if (action === 'theme') {
    cycleTheme();
    return;
  }
  if (action === 'sound') {
    toggleSound();
    return;
  }
};

document.querySelectorAll('[data-command-open]').forEach((button) => {
  button.addEventListener('click', () => openCommands(button));
});
document.querySelector('[data-command-close]')?.addEventListener('click', closeCommands);
commandItems.forEach((item) => item.addEventListener('click', () => runCommand(item)));

commandInput?.addEventListener('input', filterCommands);
bindTypingSound(commandInput);
commandInput?.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowDown') {
    event.preventDefault();
    setActiveCommand(activeCommandIndex + 1);
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    setActiveCommand(activeCommandIndex - 1);
  }
  if (event.key === 'Enter') {
    event.preventDefault();
    const item = visibleCommandItems()[activeCommandIndex];
    if (item) runCommand(item);
  }
});

commandDialog?.addEventListener('click', (event) => {
  if (event.target === commandDialog) closeCommands();
});
commandDialog?.addEventListener('cancel', (event) => {
  event.preventDefault();
  closeCommands();
});

document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLocaleLowerCase() === 'k') {
    event.preventDefault();
    openCommands();
  }
});

document.querySelector('[data-copy-email]')?.addEventListener('click', async (event) => {
  const button = event.currentTarget;
  const label = button.querySelector('[data-copy-label]');
  try {
    await navigator.clipboard.writeText(button.dataset.email);
    if (label) label.textContent = 'Email copied';
    showToast('Email copied to clipboard');
    window.setTimeout(() => {
      if (label) label.textContent = 'Copy email';
    }, 2200);
  } catch {
    window.location.href = 'mailto:' + button.dataset.email;
  }
});

applyTheme();
applySound();
subscribeToSoundPreference(() => applySound());
setActiveSection('intro');
initRasterCursor();
