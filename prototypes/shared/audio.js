import { createUISFX } from "uisfx";

export const BASE_SOUND_VOLUME = 0.22;
export const TYPING_SOUND_VOLUME = 0.3;

const SOUND_STORAGE_KEY = "portfolio-workshop-sound-v1";
const CUELUME_URL = "https://esm.sh/cuelume@0.2.2";
const audioListeners = new Set();

const customSoundPaths = {
  paperSlide: ["/audio/normalized/paper-slide.mp3"],
  paperRustle: [
    "/audio/normalized/paper-rustle-1.mp3",
    "/audio/normalized/paper-rustle-2.mp3",
  ],
  pencilScribble: [
    "/audio/normalized/pencil-scribble-1.mp3",
    "/audio/normalized/pencil-scribble-2.mp3",
    "/audio/normalized/pencil-scribble-3.mp3",
    "/audio/normalized/pencil-scribble-4.mp3",
  ],
};

function readSoundPreference() {
  try {
    return window.localStorage.getItem(SOUND_STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

function writeSoundPreference(enabled) {
  try {
    window.localStorage.setItem(SOUND_STORAGE_KEY, enabled ? "on" : "off");
  } catch {
    // Persistence is an enhancement; audio remains controllable in-session.
  }
}

let soundEnabled = readSoundPreference();
let cuelumePromise;
let paperRustleIndex = 0;
let pencilScribbleIndex = 0;
let unlockBound = false;

const typingPlayer = createUISFX({
  pack: "zen",
  volume: TYPING_SOUND_VOLUME,
  enabled: soundEnabled,
});

const customPlayers = new Map();

function getCustomPlayer(path) {
  if (!customPlayers.has(path)) {
    const audio = new Audio(path);
    audio.preload = "none";
    audio.volume = BASE_SOUND_VOLUME;
    customPlayers.set(path, audio);
  }
  return customPlayers.get(path);
}

async function loadCuelume() {
  if (!cuelumePromise) {
    cuelumePromise = import(CUELUME_URL).then((cuelume) => {
      cuelume.setVolume(BASE_SOUND_VOLUME);
      cuelume.setEnabled(soundEnabled);
      return cuelume;
    });
  }
  return cuelumePromise;
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function subscribeToSoundPreference(listener) {
  audioListeners.add(listener);
  listener(soundEnabled);
  return () => audioListeners.delete(listener);
}

export function setSoundEnabled(enabled) {
  soundEnabled = Boolean(enabled);
  writeSoundPreference(soundEnabled);
  typingPlayer.setEnabled(soundEnabled);

  if (!soundEnabled) {
    typingPlayer.stopAll();
    customPlayers.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  if (cuelumePromise) {
    void cuelumePromise.then((cuelume) => cuelume.setEnabled(soundEnabled));
  }

  audioListeners.forEach((listener) => listener(soundEnabled));
  return soundEnabled;
}

export function toggleSoundEnabled() {
  return setSoundEnabled(!soundEnabled);
}

export async function unlockAudio() {
  if (!soundEnabled) return false;
  const [typingReady] = await Promise.all([
    typingPlayer.unlock(),
    loadCuelume().catch(() => null),
  ]);
  return typingReady;
}

export function bindFirstIntentAudioUnlock() {
  if (unlockBound) return;
  unlockBound = true;

  const unlock = () => {
    void unlockAudio();
    window.removeEventListener("pointerdown", unlock, true);
    window.removeEventListener("keydown", unlock, true);
  };

  window.addEventListener("pointerdown", unlock, { capture: true, once: true });
  window.addEventListener("keydown", unlock, { capture: true, once: true });
}

export async function playCuelume(cue) {
  if (!soundEnabled) return;
  try {
    const cuelume = await loadCuelume();
    cuelume.setEnabled(true);
    cuelume.play(cue);
  } catch (error) {
    console.error(`Unable to play Cuelume cue: ${cue}`, error);
  }
}

async function playCustomSound(group, index = 0, { restart = true } = {}) {
  if (!soundEnabled) return;
  const paths = customSoundPaths[group];
  const path = paths[index % paths.length];
  const audio = getCustomPlayer(path);
  if (!restart && !audio.paused && !audio.ended) return;
  if (restart) audio.pause();
  if (audio.paused || audio.ended) audio.currentTime = 0;
  audio.volume = BASE_SOUND_VOLUME;
  try {
    await audio.play();
  } catch (error) {
    if (error?.name !== "NotAllowedError" && error?.name !== "AbortError") {
      console.error(`Unable to play ${group}`, error);
    }
  }
}

export function playExpansionSound() {
  return playCuelume("whisper");
}

export function playCollapseSound() {
  return playCuelume("droplet");
}

export function playProjectPreviewSound() {
  return playCustomSound("paperSlide", 0, { restart: false });
}

export function playPageOpenSound(variant) {
  const index = Number.isInteger(variant) ? variant : pencilScribbleIndex++;
  return playCustomSound("pencilScribble", index);
}

export function playPageCloseSound() {
  return playCustomSound("paperRustle", paperRustleIndex++);
}

function isTypingKey(event) {
  if (event.isComposing || event.ctrlKey || event.metaKey || event.altKey) return false;
  return event.key.length === 1 || event.key === "Backspace" || event.key === "Delete";
}

export function playTypingSound() {
  if (!soundEnabled) return;
  void typingPlayer.unlock().then(() => {
    typingPlayer.play("typing");
  });
}

export function bindTypingSound(input) {
  if (!input) return () => {};
  const handleKeydown = (event) => {
    if (isTypingKey(event)) playTypingSound();
  };
  const handleCompositionEnd = () => playTypingSound();
  input.addEventListener("keydown", handleKeydown);
  input.addEventListener("compositionend", handleCompositionEnd);
  return () => {
    input.removeEventListener("keydown", handleKeydown);
    input.removeEventListener("compositionend", handleCompositionEnd);
  };
}

bindFirstIntentAudioUnlock();
