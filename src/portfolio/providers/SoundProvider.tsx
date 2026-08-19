import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { play as playCuelume, setEnabled as setCuelumeEnabled, setVolume } from 'cuelume';
import { createUISFX } from 'uisfx';

export type SoundEvent =
  | 'press'
  | 'release'
  | 'toggle'
  | 'navigation'
  | 'expansion'
  | 'arrival'
  | 'success'
  | 'error';

export const BASE_SOUND_VOLUME = 0.22;
export const TYPING_SOUND_VOLUME = 0.3;
const SOUND_STORAGE_KEY = 'portfolio-workshop-sound-v1';

interface SoundContextValue {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
  play: (event: SoundEvent) => void;
  playTyping: () => void;
  playProjectPreview: () => void;
  playPageOpen: () => void;
  playPageClose: () => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);
const soundMap: Record<SoundEvent, Parameters<typeof playCuelume>[0]> = {
  press: 'press',
  release: 'release',
  toggle: 'toggle',
  navigation: 'page',
  expansion: 'whisper',
  arrival: 'arrival',
  success: 'success',
  error: 'error',
};

const projectPreviewSound = '/audio/normalized/paper-slide.mp3';
const projectPreviewVolume = BASE_SOUND_VOLUME * 0.325;
const pageOpenSounds = [
  '/audio/normalized/pencil-scribble-1.mp3',
  '/audio/normalized/pencil-scribble-2.mp3',
  '/audio/normalized/pencil-scribble-3.mp3',
  '/audio/normalized/pencil-scribble-4.mp3',
];
const pageCloseSounds = [
  '/audio/normalized/paper-rustle-1.mp3',
  '/audio/normalized/paper-rustle-2.mp3',
];

export function readSoundPreference(storage: Pick<Storage, 'getItem'> = window.localStorage) {
  try {
    return storage.getItem(SOUND_STORAGE_KEY) !== 'off';
  } catch {
    return true;
  }
}

function isTypingKey(event: KeyboardEvent | React.KeyboardEvent) {
  const isComposing = 'nativeEvent' in event ? event.nativeEvent.isComposing : event.isComposing;
  if (isComposing || event.ctrlKey || event.metaKey || event.altKey) return false;
  return event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete';
}

export function PortfolioSoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(readSoundPreference);
  const audioPlayers = useRef(new Map<string, HTMLAudioElement>());
  const projectPreviewVoices = useRef(new Set<HTMLAudioElement>());
  const pageOpenIndex = useRef(0);
  const pageCloseIndex = useRef(0);
  const [typingPlayer] = useState(() =>
    createUISFX({ pack: 'zen', volume: TYPING_SOUND_VOLUME, enabled }),
  );

  const setEnabled = useCallback(
    (nextEnabled: boolean) => {
      setEnabledState(nextEnabled);
      setCuelumeEnabled(nextEnabled);
      typingPlayer.setEnabled(nextEnabled);
      if (!nextEnabled) typingPlayer.stopAll();
      if (!nextEnabled) {
        audioPlayers.current.forEach((audio) => {
          if (!audio.paused) audio.pause();
          audio.currentTime = 0;
        });
        projectPreviewVoices.current.forEach((audio) => {
          if (!audio.paused) audio.pause();
        });
        projectPreviewVoices.current.clear();
      }
      try {
        window.localStorage.setItem(SOUND_STORAGE_KEY, nextEnabled ? 'on' : 'off');
      } catch {
        // Sound remains controllable in-session when storage is unavailable.
      }
    },
    [typingPlayer],
  );

  const toggle = useCallback(() => setEnabled(!enabled), [enabled, setEnabled]);

  const play = useCallback(
    (event: SoundEvent) => {
      if (!enabled) return;
      playCuelume(soundMap[event]);
    },
    [enabled],
  );

  const playTyping = useCallback(() => {
    if (!enabled) return;
    typingPlayer.play('typing', { cooldownMs: 28, retrigger: 'overlap' });
  }, [enabled, typingPlayer]);

  const getAudioPlayer = useCallback((source: string) => {
    const cached = audioPlayers.current.get(source);
    if (cached) return cached;
    const player = new Audio(source);
    player.preload = 'auto';
    player.volume = BASE_SOUND_VOLUME;
    audioPlayers.current.set(source, player);
    return player;
  }, []);

  const playCustomSound = useCallback(
    (source: string, restart = true) => {
      if (!enabled) return;
      const player = getAudioPlayer(source);
      if (!restart && !player.paused && !player.ended) return;
      if (restart && !player.paused) player.pause();
      player.currentTime = 0;
      const playback = player.play();
      void playback?.catch(() => {
        // Browsers may reject playback before their first user gesture.
      });
    },
    [enabled, getAudioPlayer],
  );

  const playProjectPreview = useCallback(() => {
    if (!enabled) return;
    const voice = getAudioPlayer(projectPreviewSound).cloneNode(true) as HTMLAudioElement;
    voice.volume = projectPreviewVolume;
    projectPreviewVoices.current.add(voice);
    const release = () => {
      if (!voice.paused) voice.pause();
      projectPreviewVoices.current.delete(voice);
    };
    voice.addEventListener('ended', release, { once: true });
    const playback = voice.play();
    void playback?.catch(release);
  }, [enabled, getAudioPlayer]);

  const playPageOpen = useCallback(() => {
    const source = pageOpenSounds[pageOpenIndex.current % pageOpenSounds.length];
    pageOpenIndex.current += 1;
    playCustomSound(source);
  }, [playCustomSound]);

  const playPageClose = useCallback(() => {
    const source = pageCloseSounds[pageCloseIndex.current % pageCloseSounds.length];
    pageCloseIndex.current += 1;
    playCustomSound(source);
  }, [playCustomSound]);

  useEffect(() => {
    setVolume(BASE_SOUND_VOLUME);
    getAudioPlayer(projectPreviewSound);
    const players = audioPlayers.current;
    const previewVoices = projectPreviewVoices.current;
    const unlock = () => void typingPlayer.unlock();
    window.addEventListener('pointerdown', unlock, { capture: true, once: true });
    window.addEventListener('keydown', unlock, { capture: true, once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock, true);
      window.removeEventListener('keydown', unlock, true);
      setCuelumeEnabled(false);
      players.forEach((audio) => {
        if (!audio.paused) audio.pause();
        audio.removeAttribute('src');
      });
      players.clear();
      previewVoices.forEach((audio) => {
        if (!audio.paused) audio.pause();
      });
      previewVoices.clear();
      void typingPlayer.destroy();
    };
  }, [getAudioPlayer, typingPlayer]);

  useEffect(() => {
    setCuelumeEnabled(enabled);
    typingPlayer.setEnabled(enabled);
  }, [enabled, typingPlayer]);

  const value = useMemo(
    () => ({
      enabled,
      setEnabled,
      toggle,
      play,
      playTyping,
      playProjectPreview,
      playPageOpen,
      playPageClose,
    }),
    [
      enabled,
      play,
      playPageClose,
      playPageOpen,
      playProjectPreview,
      playTyping,
      setEnabled,
      toggle,
    ],
  );

  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function shouldPlayTypingSound(event: KeyboardEvent | React.KeyboardEvent) {
  return isTypingKey(event);
}

export function usePortfolioSound() {
  const context = useContext(SoundContext);
  if (!context) throw new Error('usePortfolioSound must be used inside PortfolioSoundProvider.');
  return context;
}
