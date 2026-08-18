import { useEffect, type ReactNode } from 'react';
import crosshairCursor from '../../assets/cursors/crosshair.png';
import defaultCursor from '../../assets/cursors/default.png';
import pointerCursor from '../../assets/cursors/pointer.png';
import pressedCursor from '../../assets/cursors/pressed.png';
import textCursor from '../../assets/cursors/text.png';

export type CursorIntent = 'default' | 'link' | 'media' | 'drag' | 'text';
export type CursorTone = 'light' | 'dark' | 'accent';

const cursorSources: Record<CursorIntent | 'pressed', string> = {
  default: defaultCursor,
  link: pointerCursor,
  media: crosshairCursor,
  drag: crosshairCursor,
  text: textCursor,
  pressed: pressedCursor,
};

const cursorHotspots: Record<CursorIntent | 'pressed', [number, number]> = {
  default: [1, 2],
  link: [0, 1],
  media: [4, 4],
  drag: [4, 4],
  text: [3, 5],
  pressed: [1, 2],
};

const cursorIntents = new Set<CursorIntent>(['default', 'link', 'media', 'drag', 'text']);
const cursorTones = new Set<CursorTone>(['light', 'dark', 'accent']);

export function inferCursorIntent(target: Element): CursorIntent {
  const explicit = target.closest<HTMLElement>('[data-cursor-intent]')?.dataset.cursorIntent;
  if (explicit && cursorIntents.has(explicit as CursorIntent)) return explicit as CursorIntent;
  if (target.closest("input, textarea, [contenteditable='true']")) return 'text';
  if (target.closest('a, button, summary')) return 'link';
  return 'default';
}

function inferCursorTone(target: Element): CursorTone {
  const explicit = target.closest<HTMLElement>('[data-cursor-tone]')?.dataset.cursorTone;
  if (explicit && cursorTones.has(explicit as CursorTone)) return explicit as CursorTone;
  return document.documentElement.dataset.portfolioResolvedTheme === 'dark' ? 'dark' : 'light';
}

export function PortfolioCursorProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('.portfolio-root');
    if (!root) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    const cursor = document.createElement('div');
    const image = document.createElement('img');
    cursor.className = 'portfolio-raster-cursor';
    cursor.hidden = true;
    cursor.setAttribute('aria-hidden', 'true');
    image.alt = '';
    image.src = cursorSources.default;
    cursor.append(image);
    document.body.append(cursor);

    let pressed = false;
    let activeIntent: CursorIntent = 'default';
    let previousPointer: { x: number; y: number; time: number } | null = null;

    const isMouse = (event: PointerEvent) =>
      finePointer.matches && (!event.pointerType || event.pointerType === 'mouse');

    const hide = () => {
      cursor.hidden = true;
      previousPointer = null;
      delete document.documentElement.dataset.portfolioCursorReady;
    };

    const render = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target || !root.contains(target) || !isMouse(event)) {
        hide();
        return;
      }

      const openDialog = target.closest('dialog[open]');
      const host = openDialog ?? document.body;
      if (cursor.parentElement !== host) host.append(cursor);

      activeIntent = inferCursorIntent(target);
      const renderedIntent = pressed ? 'pressed' : activeIntent;
      const [hotspotX, hotspotY] = cursorHotspots[renderedIntent];
      let tilt = 0;
      let stretchX = 1;
      let stretchY = 1;

      if (previousPointer && !reducedMotion.matches) {
        const elapsed = Math.max(1, performance.now() - previousPointer.time);
        const deltaX = event.clientX - previousPointer.x;
        const deltaY = event.clientY - previousPointer.y;
        const speed = Math.hypot(deltaX, deltaY) / elapsed;
        stretchX = 1 + Math.min(0.24, speed * 0.1);
        stretchY = 1 - Math.min(0.12, speed * 0.06);
        tilt = Math.min(10, Math.max(-10, deltaX * 0.3));
      }

      cursor.style.setProperty('--cursor-x', `${event.clientX - hotspotX}px`);
      cursor.style.setProperty('--cursor-y', `${event.clientY - hotspotY}px`);
      cursor.style.setProperty('--cursor-tilt', `${tilt.toFixed(2)}deg`);
      cursor.style.setProperty('--cursor-stretch-x', stretchX.toFixed(3));
      cursor.style.setProperty('--cursor-stretch-y', stretchY.toFixed(3));
      cursor.dataset.tone = inferCursorTone(target);
      image.src = cursorSources[renderedIntent];
      cursor.hidden = false;
      document.documentElement.dataset.portfolioCursorReady = 'true';
      previousPointer = { x: event.clientX, y: event.clientY, time: performance.now() };
    };

    const press = (event: PointerEvent) => {
      if (!isMouse(event) || !(event.target instanceof Element) || !root.contains(event.target)) return;
      pressed = true;
      image.src = cursorSources.pressed;
    };

    const release = (event: PointerEvent) => {
      if (!isMouse(event)) return;
      pressed = false;
      image.src = cursorSources[activeIntent];
    };

    document.addEventListener('pointermove', render, { passive: true });
    document.addEventListener('pointerdown', press, { passive: true });
    document.addEventListener('pointerup', release, { passive: true });
    document.documentElement.addEventListener('mouseleave', hide);

    return () => {
      document.removeEventListener('pointermove', render);
      document.removeEventListener('pointerdown', press);
      document.removeEventListener('pointerup', release);
      document.documentElement.removeEventListener('mouseleave', hide);
      delete document.documentElement.dataset.portfolioCursorReady;
      cursor.remove();
    };
  }, []);

  return children;
}

