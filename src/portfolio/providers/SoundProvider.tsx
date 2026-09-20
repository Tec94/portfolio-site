import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode,
} from 'react';
import { play as playCuelume, setEnabled as setCuelumeEnabled, setVolume } from 'cuelume';
import { createUISFX } from 'uisfx';

export type SoundEvent = 'press' | 'navigation' | 'success' | 'error';
export const BASE_SOUND_VOLUME = 0.22;
export const TYPING_SOUND_VOLUME = 1;
const SOUND_STORAGE_KEY = 'portfolio-workshop-sound-v1';
const PAPER_SLIDE = '/audio/normalized/paper-slide.mp3';

interface SoundContextValue {
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
  toggle: () => void;
  play: (event: SoundEvent) => void;
  playTyping: () => void;
  playProjectPreview: () => void;
}
const SoundContext = createContext<SoundContextValue | null>(null);

export function readSoundPreference(storage: Pick<Storage, 'getItem'> = window.localStorage) {
  try { return storage.getItem(SOUND_STORAGE_KEY) !== 'off'; }
  catch { return true; }
}

export function PortfolioSoundProvider({ children }: { children: ReactNode }) {
  const [enabled, setEnabledState] = useState(readSoundPreference);
  const enabledRef = useRef(enabled);
  const paperPlayer = useRef<HTMLAudioElement>();
  const [typingPlayer] = useState(() => createUISFX({ pack: 'zen', volume: TYPING_SOUND_VOLUME, enabled }));

  const setEnabled = useCallback((next: boolean) => {
    // Async outcomes must respect mute immediately, including callbacks from an older render.
    enabledRef.current = next;
    setEnabledState(next);
    setCuelumeEnabled(next);
    typingPlayer.setEnabled(next);
    if (!next) {
      typingPlayer.stopAll();
      if (paperPlayer.current && !paperPlayer.current.paused) paperPlayer.current.pause();
    }
    try { window.localStorage.setItem(SOUND_STORAGE_KEY, next ? 'on' : 'off'); }
    catch { /* The in-session preference still works without storage. */ }
  }, [typingPlayer]);

  const toggle = useCallback(() => {
    const next = !enabledRef.current;
    setEnabled(next);
    if (next) playCuelume('press');
  }, [setEnabled]);

  const playPaper = useCallback((preview: boolean) => {
    if (!enabledRef.current) return;
    const player = paperPlayer.current ??= new Audio(PAPER_SLIDE);
    // A navigation replaces the quieter preview instead of layering voices.
    if (preview && !player.paused && !player.ended) return;
    if (!player.paused) player.pause();
    player.currentTime = 0;
    player.volume = BASE_SOUND_VOLUME * (preview ? 0.325 : 1);
    void player.play()?.catch(() => { /* Browser activation may not have happened yet. */ });
  }, []);

  const play = useCallback((event: SoundEvent) => {
    if (!enabledRef.current) return;
    if (event === 'navigation') playPaper(false);
    else playCuelume(event);
  }, [playPaper]);

  const playTyping = useCallback(() => {
    if (enabledRef.current) typingPlayer.play('typing', { cooldownMs: 28, retrigger: 'overlap' });
  }, [typingPlayer]);
  const playProjectPreview = useCallback(() => playPaper(true), [playPaper]);

  useEffect(() => {
    enabledRef.current = enabled;
    setCuelumeEnabled(enabled);
    typingPlayer.setEnabled(enabled);
  }, [enabled, typingPlayer]);

  useEffect(() => {
    setVolume(BASE_SOUND_VOLUME);
    return () => {
      enabledRef.current = false;
      setCuelumeEnabled(false);
      if (paperPlayer.current && !paperPlayer.current.paused) paperPlayer.current.pause();
      paperPlayer.current?.removeAttribute('src');
      paperPlayer.current = undefined;
      void typingPlayer.destroy();
    };
  }, [typingPlayer]);

  const value = useMemo(() => ({ enabled, setEnabled, toggle, play, playTyping, playProjectPreview }),
    [enabled, setEnabled, toggle, play, playTyping, playProjectPreview]);
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>;
}

export function shouldPlayTypingSound(event: KeyboardEvent | React.KeyboardEvent) {
  const isComposing = 'nativeEvent' in event ? event.nativeEvent.isComposing : event.isComposing;
  if (isComposing || event.ctrlKey || event.metaKey || event.altKey) return false;
  return event.key.length === 1 || event.key === 'Backspace' || event.key === 'Delete';
}

export function usePortfolioSound() {
  const context = useContext(SoundContext);
  if (!context) throw new Error('usePortfolioSound must be used inside PortfolioSoundProvider.');
  return context;
}
