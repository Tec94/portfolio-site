import {
  bindTypingSound,
  playPageCloseSound,
  playPageOpenSound,
  playProjectPreviewSound,
  setSoundEnabled as setSharedSoundEnabled,
} from "../shared/audio.js";

const root = document.documentElement;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const storageKeys = {
  cursor: "portfolio-sensory-cursor",
  engine: "portfolio-sensory-engine",
  sound: "portfolio-sensory-sound-v2",
  volume: "portfolio-sensory-volume",
};

const semanticCuelumeCues = {
  hover: "tick",
  press: "press",
  release: "release",
  toggle: "toggle",
  expansion: "whisper",
  navigation: "page",
  dismiss: "droplet",
  success: "success",
  error: "error",
  ready: "ready",
};

const cueLabels = {
  cuelume: {
    press: "press · release",
    hover: "tick",
    expansion: "whisper",
    navigation: "page",
    success: "success",
    error: "error",
  },
  webkits: {
    press: "soft key · lift",
    hover: "key clack",
    expansion: "warm rise",
    navigation: "paper flick",
    success: "soft confirm",
    error: "soft refusal",
  },
};

const rasterCursorSources = {
  default: "/src/assets/cursors/default.png",
  link: "/src/assets/cursors/pointer.png",
  media: "/src/assets/cursors/crosshair.png",
  drag: "/src/assets/cursors/crosshair.png",
  text: "/src/assets/cursors/text.png",
  pressed: "/src/assets/cursors/pressed.png",
};

const rasterHotspots = {
  default: [1, 2],
  link: [0, 1],
  media: [4, 4],
  drag: [4, 4],
  text: [3, 5],
  pressed: [1, 2],
};

const cursorLabels = {
  default: "",
  link: "OPEN",
  media: "VIEW",
  drag: "DRAG",
  text: "",
};

const engineImporters = {
  cuelume: () => import("https://esm.sh/cuelume@0.2.2"),
  webkits: () => import("https://esm.sh/@web-kits/audio@0.1.0"),
};

const loadedEngines = new Map();
const pendingEngines = new Map();

function readStorage(key, fallback) {
  try {
    return window.localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, String(value));
  } catch {
    // Storage is an enhancement; the prototype still works without it.
  }
}

const storedVolume = Number.parseFloat(readStorage(storageKeys.volume, "0.22"));
const state = {
  cursor: "raster",
  engine: "cuelume",
  sound: readStorage(storageKeys.sound, "true") !== "false",
  volume: Number.isFinite(storedVolume) ? Math.min(1, Math.max(0, storedVolume)) : 0.22,
};

const cursor = document.querySelector("[data-custom-cursor]");
const rasterImage = document.querySelector("[data-raster-image]");
const cursorLabel = document.querySelector("[data-cursor-label]");
const engineStatus = document.querySelector("[data-engine-status]");
const volumeInput = document.querySelector("[data-volume]");
const volumeOutput = document.querySelector("[data-volume-output]");
const toast = document.querySelector("[data-toast]");

let activeIntent = "default";
let pointerDown = false;
let lastPointer = null;
let lastHoverCueAt = 0;
let toastTimer = 0;

function setEngineStatus(message) {
  engineStatus.textContent = message;
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.dataset.visible = "true";
  toastTimer = window.setTimeout(() => {
    toast.dataset.visible = "false";
  }, 1800);
}

function setPressedState(selector, activeValue) {
  document.querySelectorAll(selector).forEach((button) => {
    const value = button.dataset.cursorChoice ?? button.dataset.engineChoice;
    button.setAttribute("aria-pressed", String(value === activeValue));
  });
}

function syncInterface() {
  root.dataset.cursorMode = state.cursor;
  root.dataset.soundEngine = state.engine;
  root.dataset.soundEnabled = String(state.sound);
  cursor.dataset.mode = state.cursor;
  setPressedState("[data-cursor-choice]", state.cursor);
  setPressedState("[data-engine-choice]", state.engine);

  document.querySelectorAll("[data-sound-toggle]").forEach((button) => {
    button.setAttribute("aria-pressed", String(state.sound));
    if (button.matches(".sound-toggle")) {
      button.textContent = state.sound ? "Disable sound" : "Enable sound";
    }
  });

  document.querySelectorAll("[data-persistent-sound-label]").forEach((label) => {
    label.textContent = state.sound ? "Sound on" : "Sound off";
  });

  volumeInput.value = String(state.volume);
  volumeOutput.textContent = `${Math.round(state.volume * 100)}%`;

  document.querySelectorAll("[data-cue-name]").forEach((label) => {
    label.textContent = cueLabels[state.engine][label.dataset.cueName];
  });

  if (!state.sound) {
    setEngineStatus("Off");
  } else if (loadedEngines.has(state.engine)) {
    setEngineStatus("Ready");
  } else {
    setEngineStatus("Tap a cue to load");
  }
}

function buildWebKitsCues(audio) {
  const sound = (frequencyStart, frequencyEnd, decay, gain = 0.18, type = "sine") =>
    audio.defineSound({
      source: { type, frequency: { start: frequencyStart, end: frequencyEnd } },
      envelope: { attack: 0.001, decay, sustain: 0, release: 0.02 },
      gain,
    });

  const tones = {
    hover: sound(510, 350, 0.028, 0.11),
    press: sound(190, 145, 0.035, 0.14, "triangle"),
    release: sound(270, 410, 0.045, 0.12),
    toggle: sound(310, 530, 0.065, 0.13),
    expansionLow: sound(180, 310, 0.09, 0.11, "triangle"),
    expansionHigh: sound(330, 510, 0.12, 0.09),
    navigationLow: sound(150, 108, 0.08, 0.12, "triangle"),
    navigationHigh: sound(470, 290, 0.055, 0.08),
    dismiss: sound(300, 120, 0.075, 0.11, "triangle"),
    successLow: sound(310, 420, 0.08, 0.1),
    successHigh: sound(520, 690, 0.1, 0.09),
    errorLow: sound(180, 150, 0.1, 0.12, "triangle"),
    errorHigh: sound(255, 190, 0.1, 0.08, "triangle"),
    ready: sound(360, 610, 0.11, 0.1),
  };

  const pair = (first, second) => {
    first();
    window.setTimeout(second, 42);
  };

  return {
    hover: tones.hover,
    press: tones.press,
    release: tones.release,
    toggle: tones.toggle,
    expansion: () => pair(tones.expansionLow, tones.expansionHigh),
    navigation: () => pair(tones.navigationLow, tones.navigationHigh),
    dismiss: tones.dismiss,
    success: () => pair(tones.successLow, tones.successHigh),
    error: () => pair(tones.errorHigh, tones.errorLow),
    ready: tones.ready,
  };
}

async function loadEngine(name) {
  if (loadedEngines.has(name)) return loadedEngines.get(name);
  if (pendingEngines.has(name)) return pendingEngines.get(name);

  setEngineStatus("Loading…");
  const pending = engineImporters[name]()
    .then(async (module) => {
      if (name === "cuelume") {
        module.setVolume(state.volume);
        module.setEnabled(state.sound);
        const engine = { module };
        loadedEngines.set(name, engine);
        return engine;
      }

      await module.ensureReady();
      module.setMasterVolume(state.volume);
      const engine = { module, cues: buildWebKitsCues(module) };
      loadedEngines.set(name, engine);
      return engine;
    })
    .then((engine) => {
      if (state.engine === name && state.sound) setEngineStatus("Ready");
      return engine;
    })
    .catch((error) => {
      console.error(`Unable to load ${name}`, error);
      if (state.engine === name) setEngineStatus("Unavailable");
      showToast(`${name === "cuelume" ? "Cuelume" : "Web Kits"} could not load`);
      throw error;
    })
    .finally(() => pendingEngines.delete(name));

  pendingEngines.set(name, pending);
  return pending;
}

async function playSemantic(eventName) {
  if (!state.sound) return;

  try {
    const engine = await loadEngine(state.engine);
    if (state.engine === "cuelume") {
      engine.module.setEnabled(true);
      engine.module.play(semanticCuelumeCues[eventName]);
    } else {
      engine.cues[eventName]?.();
    }
  } catch {
    // loadEngine already exposes the failure in the interface.
  }
}

async function toggleSound() {
  state.sound = !state.sound;
  writeStorage(storageKeys.sound, state.sound);
  setSharedSoundEnabled(state.sound);
  syncInterface();

  if (!state.sound) {
    loadedEngines.get("cuelume")?.module.setEnabled(false);
    return;
  }

  try {
    await loadEngine(state.engine);
    await playSemantic("ready");
  } catch {
    // The status and toast preserve an explicit failure state.
  }
}

document.querySelectorAll("[data-cursor-choice]").forEach((button) => {
  button.addEventListener("click", () => {
    state.cursor = button.dataset.cursorChoice;
    writeStorage(storageKeys.cursor, state.cursor);
    syncInterface();
  });
});

document.querySelectorAll("[data-engine-choice]").forEach((button) => {
  button.addEventListener("click", async () => {
    if (button.dataset.engineChoice === state.engine) return;
    state.engine = button.dataset.engineChoice;
    writeStorage(storageKeys.engine, state.engine);
    syncInterface();
    if (!state.sound) return;

    try {
      await loadEngine(state.engine);
      await playSemantic("ready");
    } catch {
      // The selected engine remains visible so its failure can be evaluated.
    }
  });
});

document.querySelectorAll("[data-sound-toggle]").forEach((button) => {
  button.addEventListener("click", toggleSound);
});

volumeInput.addEventListener("input", () => {
  state.volume = Number.parseFloat(volumeInput.value);
  writeStorage(storageKeys.volume, state.volume);
  volumeOutput.textContent = `${Math.round(state.volume * 100)}%`;
  loadedEngines.get("cuelume")?.module.setVolume(state.volume);
  loadedEngines.get("webkits")?.module.setMasterVolume(state.volume);
});

function playHoverCue() {
  const now = performance.now();
  // Cuelume's own hover helper uses 150 ms; mirror that contract for a fair comparison.
  if (now - lastHoverCueAt < 150) return;
  lastHoverCueAt = now;
  void playSemantic("hover");
}

document.querySelectorAll("[data-audio-hover]").forEach((element) => {
  element.addEventListener("pointerenter", () => {
    if (finePointer.matches) playHoverCue();
  });
  element.addEventListener("focus", playHoverCue);
});

document.querySelectorAll("[data-cue]").forEach((button) => {
  button.addEventListener("click", () => {
    void playSemantic(button.dataset.cue);
  });
});

const pressReleaseButton = document.querySelector("[data-press-release]");
pressReleaseButton.addEventListener("pointerdown", () => void playSemantic("press"));
pressReleaseButton.addEventListener("pointerup", () => void playSemantic("release"));
pressReleaseButton.addEventListener("pointercancel", () => void playSemantic("release"));
pressReleaseButton.addEventListener("keydown", (event) => {
  if (!event.repeat && ["Enter", " "].includes(event.key)) void playSemantic("press");
});
pressReleaseButton.addEventListener("keyup", (event) => {
  if (["Enter", " "].includes(event.key)) void playSemantic("release");
});

const sampleToggle = document.querySelector("[data-sample-toggle]");
sampleToggle.addEventListener("click", () => {
  const nextState = sampleToggle.getAttribute("aria-pressed") !== "true";
  sampleToggle.setAttribute("aria-pressed", String(nextState));
  void playSemantic("toggle");
});

const expansionButton = document.querySelector("[data-expand-test]");
const expansionSample = document.querySelector("[data-expansion-sample]");
expansionButton.addEventListener("click", () => {
  const opening = expansionButton.getAttribute("aria-expanded") !== "true";
  expansionButton.setAttribute("aria-expanded", String(opening));
  expansionSample.hidden = !opening;
  if (!opening) void playSemantic("dismiss");
});

const pageDialog = document.querySelector("[data-page-dialog]");
const pageOpenButton = document.querySelector("[data-page-open]");
let pageDialogClosedWithCue = false;

function closePageDialog() {
  if (!pageDialog.open) return;
  pageDialogClosedWithCue = true;
  pageDialog.close();
  void playPageCloseSound();
}

pageOpenButton.addEventListener("click", () => {
  pageDialogClosedWithCue = false;
  pageDialog.showModal();
  void playPageOpenSound(0);
});
pageDialog.querySelector("[data-page-close]").addEventListener("click", closePageDialog);
pageDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closePageDialog();
});
pageDialog.addEventListener("click", (event) => {
  if (event.target === pageDialog) closePageDialog();
});
pageDialog.addEventListener("close", () => {
  if (!pageDialogClosedWithCue) void playPageCloseSound();
  pageOpenButton.focus();
});

const commandDialog = document.querySelector("[data-command-dialog]");
const commandOpenButton = document.querySelector("[data-command-open]");
const commandInput = document.querySelector("[data-command-input]");
const commandOptions = [...document.querySelectorAll("[data-command-option]")];
let commandIndex = 0;
let commandClosedWithCue = false;
let commandReturnTarget = commandOpenButton;

function selectCommandOption(index, withCue = false) {
  commandIndex = (index + commandOptions.length) % commandOptions.length;
  commandOptions.forEach((option, optionIndex) => {
    option.setAttribute("aria-selected", String(optionIndex === commandIndex));
  });
  commandOptions[commandIndex].scrollIntoView({ block: "nearest" });
  if (withCue) playHoverCue();
}

function openCommandMenu(trigger = document.activeElement) {
  if (commandDialog.open) return;
  commandReturnTarget =
    trigger instanceof HTMLElement && trigger !== document.body && trigger !== document.documentElement
      ? trigger
      : commandOpenButton;
  commandClosedWithCue = false;
  selectCommandOption(0);
  commandDialog.showModal();
  window.requestAnimationFrame(() => commandInput.focus());
  void playSemantic("expansion");
}

function closeCommandMenu(withCue = true) {
  if (!commandDialog.open) return;
  commandClosedWithCue = withCue;
  commandDialog.close();
  if (withCue) void playSemantic("dismiss");
  commandReturnTarget?.focus();
}

function activateCommandOption() {
  const label = commandOptions[commandIndex].querySelector("span").textContent;
  commandClosedWithCue = true;
  commandDialog.close();
  void playSemantic("navigation");
  showToast(`Opened ${label}`);
  commandReturnTarget?.focus();
}

commandOpenButton.addEventListener("click", () => openCommandMenu(commandOpenButton));
commandDialog.querySelector("[data-command-close]").addEventListener("click", () => closeCommandMenu());
commandDialog.addEventListener("cancel", (event) => {
  event.preventDefault();
  closeCommandMenu();
});
commandDialog.addEventListener("click", (event) => {
  if (event.target === commandDialog) closeCommandMenu();
});
commandDialog.addEventListener("close", () => {
  if (!commandClosedWithCue) void playSemantic("dismiss");
});

commandOptions.forEach((option, index) => {
  option.addEventListener("pointerenter", () => {
    if (!finePointer.matches || commandIndex === index) return;
    selectCommandOption(index, true);
  });
  option.addEventListener("click", () => {
    selectCommandOption(index);
    activateCommandOption();
  });
});

commandDialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown") {
    event.preventDefault();
    selectCommandOption(commandIndex + 1, true);
  } else if (event.key === "ArrowUp") {
    event.preventDefault();
    selectCommandOption(commandIndex - 1, true);
  } else if (event.key === "Enter" && document.activeElement === commandInput) {
    event.preventDefault();
    activateCommandOption();
  }
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    openCommandMenu();
  }
});

bindTypingSound(commandInput);

document.querySelector("[data-project-preview]")?.addEventListener("pointerenter", (event) => {
  if (event.pointerType === "mouse") void playProjectPreviewSound();
});

const dragObject = document.querySelector(".drag-object");
let dragPosition = { x: 0, y: 0 };
let dragStart = null;

function renderDragPosition() {
  dragObject.style.setProperty("--drag-x", `${dragPosition.x}px`);
  dragObject.style.setProperty("--drag-y", `${dragPosition.y}px`);
}

dragObject.addEventListener("pointerdown", (event) => {
  dragObject.setPointerCapture(event.pointerId);
  dragStart = {
    pointerX: event.clientX,
    pointerY: event.clientY,
    objectX: dragPosition.x,
    objectY: dragPosition.y,
  };
});

dragObject.addEventListener("pointermove", (event) => {
  if (!dragStart || !dragObject.hasPointerCapture(event.pointerId)) return;
  const surface = dragObject.closest(".test-surface").getBoundingClientRect();
  const object = dragObject.getBoundingClientRect();
  const boundaryX = Math.max(0, (surface.width - object.width) / 2 - 18);
  const boundaryY = Math.max(0, (surface.height - object.height) / 2 - 18);
  dragPosition.x = Math.min(boundaryX, Math.max(-boundaryX, dragStart.objectX + event.clientX - dragStart.pointerX));
  dragPosition.y = Math.min(boundaryY, Math.max(-boundaryY, dragStart.objectY + event.clientY - dragStart.pointerY));
  renderDragPosition();
});

function endDrag(event) {
  if (dragObject.hasPointerCapture(event.pointerId)) dragObject.releasePointerCapture(event.pointerId);
  dragStart = null;
}

dragObject.addEventListener("pointerup", endDrag);
dragObject.addEventListener("pointercancel", endDrag);
dragObject.addEventListener("keydown", (event) => {
  const keyOffsets = {
    ArrowLeft: [-8, 0],
    ArrowRight: [8, 0],
    ArrowUp: [0, -8],
    ArrowDown: [0, 8],
  };
  if (event.key === "Home") {
    event.preventDefault();
    dragPosition = { x: 0, y: 0 };
    renderDragPosition();
    return;
  }
  if (!keyOffsets[event.key]) return;
  event.preventDefault();
  dragPosition.x += keyOffsets[event.key][0];
  dragPosition.y += keyOffsets[event.key][1];
  renderDragPosition();
});

function inferCursorContext(target) {
  if (!(target instanceof Element)) return { intent: "default", tone: "light" };
  const intentRegion = target.closest("[data-cursor-intent]");
  const toneRegion = target.closest("[data-cursor-tone]");
  let intent = intentRegion?.dataset.cursorIntent;

  if (!intent) {
    if (target.closest("input, textarea, [contenteditable='true']")) intent = "text";
    else if (target.closest("a, button")) intent = "link";
    else intent = "default";
  }

  return {
    intent,
    tone: toneRegion?.dataset.cursorTone ?? "light",
  };
}

function renderCursor(event) {
  if (!finePointer.matches || event.pointerType !== "mouse") return;
  root.dataset.cursorReady = "true";
  cursor.hidden = false;

  const context = inferCursorContext(event.target);
  activeIntent = context.intent;
  const renderedIntent = pointerDown ? "pressed" : activeIntent;
  const [hotspotX, hotspotY] = state.cursor === "raster" ? rasterHotspots[renderedIntent] ?? rasterHotspots.default : [2, 2];
  const now = performance.now();
  let stretchX = 1;
  let stretchY = 1;
  let tilt = 0;
  let heading = 0;

  if (lastPointer && !reducedMotion.matches) {
    const elapsed = Math.max(1, now - lastPointer.time);
    const deltaX = event.clientX - lastPointer.x;
    const deltaY = event.clientY - lastPointer.y;
    const speed = Math.hypot(deltaX, deltaY) / elapsed;
    // Bounded deformation keeps the hotspot legible while still exposing direction and velocity.
    stretchX = 1 + Math.min(0.28, speed * 0.12);
    stretchY = 1 - Math.min(0.14, speed * 0.07);
    tilt = Math.min(12, Math.max(-12, deltaX * 0.35));
    heading = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
  }

  cursor.style.setProperty("--cursor-x", `${event.clientX - hotspotX}px`);
  cursor.style.setProperty("--cursor-y", `${event.clientY - hotspotY}px`);
  cursor.style.setProperty("--cursor-stretch-x", stretchX.toFixed(3));
  cursor.style.setProperty("--cursor-stretch-y", stretchY.toFixed(3));
  cursor.style.setProperty("--cursor-tilt", `${tilt.toFixed(2)}deg`);
  cursor.style.setProperty("--cursor-heading", `${heading.toFixed(2)}deg`);
  cursor.dataset.tone = context.tone;
  cursor.dataset.intent = activeIntent;
  rasterImage.src = rasterCursorSources[renderedIntent] ?? rasterCursorSources.default;
  cursorLabel.textContent = cursorLabels[activeIntent] ?? "";
  lastPointer = { x: event.clientX, y: event.clientY, time: now };
}

document.addEventListener("pointermove", renderCursor, { passive: true });
document.addEventListener("pointerdown", (event) => {
  if (event.pointerType !== "mouse") return;
  pointerDown = true;
  rasterImage.src = rasterCursorSources.pressed;
});
document.addEventListener("pointerup", (event) => {
  if (event.pointerType !== "mouse") return;
  pointerDown = false;
  rasterImage.src = rasterCursorSources[activeIntent] ?? rasterCursorSources.default;
});
document.documentElement.addEventListener("mouseleave", () => {
  cursor.hidden = true;
  lastPointer = null;
});

finePointer.addEventListener("change", () => {
  if (!finePointer.matches) {
    delete root.dataset.cursorReady;
    cursor.hidden = true;
    lastPointer = null;
  }
});

setSharedSoundEnabled(state.sound);
syncInterface();
