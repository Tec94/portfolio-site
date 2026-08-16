import {
  isSoundEnabled,
  playCuelume,
  playPageCloseSound,
  playPageOpenSound,
  playProjectPreviewSound,
  subscribeToSoundPreference,
  toggleSoundEnabled,
} from "../shared/audio.js";
import { initRasterCursor } from "../shared/raster-cursor.js";

const mediaItems = [
  {
    type: "image",
    title: "Application overview",
    src: "/screenshots/credify.svg",
    alt: "Dark credit application dashboard with green status accents",
  },
  {
    type: "image",
    title: "Eligibility details",
    src: "/screenshots/smartnest.svg",
    alt: "Dark eligibility details interface with violet status accents",
  },
  {
    type: "video",
    title: "Decision flow",
    src: "/assets/project-device/reference.mp4",
    poster: "/screenshots/stock-tracker.svg",
  },
  {
    type: "image",
    title: "Review state",
    src: "/screenshots/citizen-voice.svg",
    alt: "Review state interface with amber status accents",
  },
  {
    type: "image",
    title: "Completion handoff",
    src: "/screenshots/munky.svg",
    alt: "Completion handoff interface with rose status accents",
  },
];

const root = document.documentElement;
const pageShell = document.querySelector("[data-page-shell]");
const dialog = document.querySelector("[data-media-dialog]");
const viewerTitle = document.querySelector("[data-viewer-title]");
const viewerCounter = document.querySelector("[data-viewer-counter]");
const viewerMedia = document.querySelector("[data-viewer-media]");
const viewerSlot = document.querySelector("[data-viewer-slot]");
const filmstrip = document.querySelector("[data-viewer-filmstrip]");
const closeButton = document.querySelector("[data-viewer-close]");
const themeButton = document.querySelector("[data-theme-toggle]");
const soundButton = document.querySelector("[data-sound-toggle]");
const metaThemeColor = document.querySelector('meta[name="theme-color"]');
const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const themeModes = ["system", "light", "dark"];
const themeStorageKey = "portfolio-shell-theme";

let activeIndex = 0;
let returnTarget = null;
let themeMode = readTheme();
let dragState = null;

function readTheme() {
  try {
    const stored = window.localStorage.getItem(themeStorageKey);
    return themeModes.includes(stored) ? stored : "system";
  } catch {
    return "system";
  }
}

function writeTheme(value) {
  try {
    window.localStorage.setItem(themeStorageKey, value);
  } catch {
    // Theme remains available for the current page when storage is unavailable.
  }
}

function resolvedTheme() {
  if (themeMode !== "system") return themeMode;
  return systemTheme.matches ? "dark" : "light";
}

function applyTheme() {
  const resolved = resolvedTheme();
  root.dataset.themeMode = themeMode;
  root.dataset.resolvedTheme = resolved;
  themeButton.setAttribute("aria-label", `Theme: ${themeMode}`);
  metaThemeColor?.setAttribute("content", resolved === "dark" ? "#201d1a" : "#f2eee5");
}

function cycleTheme() {
  const index = themeModes.indexOf(themeMode);
  themeMode = themeModes[(index + 1) % themeModes.length];
  writeTheme(themeMode);
  applyTheme();
  void playCuelume("toggle");
}

function applySound(enabled = isSoundEnabled()) {
  soundButton.setAttribute("aria-pressed", String(enabled));
  soundButton.setAttribute("aria-label", enabled ? "Sound on" : "Sound off");
}

function stopCurrentVideo() {
  const video = viewerSlot.querySelector("video");
  if (!video) return;
  video.pause();
  video.currentTime = 0;
}

function createMedia(item) {
  if (item.type === "video") {
    const video = document.createElement("video");
    video.src = item.src;
    video.poster = item.poster;
    video.controls = true;
    video.preload = "metadata";
    video.playsInline = true;
    video.setAttribute("aria-label", item.title);
    return video;
  }

  const image = document.createElement("img");
  image.src = item.src;
  image.alt = item.alt;
  return image;
}

function updateFilmstrip() {
  filmstrip.querySelectorAll("button").forEach((button, index) => {
    if (index === activeIndex) button.setAttribute("aria-current", "true");
    else button.removeAttribute("aria-current");
  });
}

function renderMedia(index, { announce = false } = {}) {
  activeIndex = (index + mediaItems.length) % mediaItems.length;
  const item = mediaItems[activeIndex];
  stopCurrentVideo();

  viewerMedia.dataset.switching = "true";
  viewerSlot.replaceChildren(createMedia(item));
  viewerTitle.textContent = item.title;
  viewerCounter.textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(mediaItems.length).padStart(2, "0")}`;
  updateFilmstrip();

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => delete viewerMedia.dataset.switching);
  });

  if (announce) void playCuelume("page");
}

function buildFilmstrip() {
  const fragment = document.createDocumentFragment();
  mediaItems.forEach((item, index) => {
    const button = document.createElement("button");
    const image = document.createElement("img");
    button.type = "button";
    button.setAttribute("aria-label", `Show ${item.title}`);
    button.addEventListener("click", () => renderMedia(index, { announce: true }));
    image.src = item.type === "video" ? item.poster : item.src;
    image.alt = "";
    button.append(image);
    fragment.append(button);
  });
  filmstrip.replaceChildren(fragment);
  updateFilmstrip();
}

function openViewer(index, trigger) {
  if (dialog.open) return;
  returnTarget = trigger;
  renderMedia(index);
  pageShell.inert = true;
  root.dataset.viewerOpen = "true";
  dialog.showModal();
  window.requestAnimationFrame(() => closeButton.focus());
  void playPageOpenSound(index);
}

function closeViewer({ sound = true } = {}) {
  if (!dialog.open) return;
  stopCurrentVideo();
  dialog.close();
  pageShell.inert = false;
  delete root.dataset.viewerOpen;
  resetDrag();
  if (sound) void playPageCloseSound();
  returnTarget?.focus();
}

function moveViewer(direction) {
  renderMedia(activeIndex + direction, { announce: true });
}

function resetDrag() {
  dragState = null;
  delete viewerMedia.dataset.dragging;
  viewerMedia.style.setProperty("--drag-x", "0px");
  viewerMedia.style.setProperty("--drag-rotation", "0deg");
}

function handlePointerDown(event) {
  if (event.button !== 0 || event.target.closest("video")) return;
  dragState = {
    pointerId: event.pointerId,
    startX: event.clientX,
    deltaX: 0,
  };
  viewerMedia.dataset.dragging = "true";
  try {
    viewerMedia.setPointerCapture(event.pointerId);
  } catch {
    // Drag remains usable when a browser does not expose capture for this pointer.
  }
}

function handlePointerMove(event) {
  if (!dragState || dragState.pointerId !== event.pointerId) return;
  dragState.deltaX = event.clientX - dragState.startX;
  if (reducedMotion.matches) return;

  const visualLimit = viewerMedia.clientWidth / 3;
  const translated = Math.max(-visualLimit, Math.min(visualLimit, dragState.deltaX));
  viewerMedia.style.setProperty("--drag-x", `${translated}px`);
  viewerMedia.style.setProperty("--drag-rotation", `${(translated / viewerMedia.clientWidth) * 3}deg`);
}

function finishPointer(event) {
  if (!dragState || dragState.pointerId !== event.pointerId) return;
  const deltaX = dragState.deltaX;
  const commitDistance = Math.max(44, viewerMedia.clientWidth * 0.1);
  resetDrag();

  if (Math.abs(deltaX) < commitDistance) return;
  moveViewer(deltaX < 0 ? 1 : -1);
}

function focusableElements() {
  return [...dialog.querySelectorAll('button:not([disabled]), video[controls], [href], [tabindex]:not([tabindex="-1"])')]
    .filter((element) => element.checkVisibility());
}

function trapFocus(event) {
  const focusable = focusableElements();
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

document.querySelectorAll("[data-media-index]").forEach((button) => {
  button.addEventListener("click", () => openViewer(Number(button.dataset.mediaIndex), button));
  button.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") void playProjectPreviewSound();
  });
});

document.querySelector("[data-viewer-previous]").addEventListener("click", () => moveViewer(-1));
document.querySelector("[data-viewer-next]").addEventListener("click", () => moveViewer(1));
closeButton.addEventListener("click", () => closeViewer());

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeViewer();
});

dialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeViewer();
});

dialog.addEventListener("keydown", (event) => {
  if (event.key === "Tab") {
    trapFocus(event);
    return;
  }
  if (event.target.closest("video, input, textarea")) return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    moveViewer(-1);
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    moveViewer(1);
  }
});

viewerMedia.addEventListener("pointerdown", handlePointerDown);
viewerMedia.addEventListener("pointermove", handlePointerMove);
viewerMedia.addEventListener("pointerup", finishPointer);
viewerMedia.addEventListener("pointercancel", resetDrag);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopCurrentVideo();
});

document.querySelector("[data-back-to-top]").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
});

themeButton.addEventListener("click", cycleTheme);
soundButton.addEventListener("click", () => {
  const enabled = toggleSoundEnabled();
  applySound(enabled);
  if (enabled) void playCuelume("toggle");
});

systemTheme.addEventListener("change", () => {
  if (themeMode === "system") applyTheme();
});

buildFilmstrip();
applyTheme();
applySound();
subscribeToSoundPreference((enabled) => applySound(enabled));
initRasterCursor();
