import { useLayoutEffect } from 'react';
import busyFrame01Url from '../assets/cursors/busy-frame-01.png';
import busyFrame02Url from '../assets/cursors/busy-frame-02.png';
import busyFrame03Url from '../assets/cursors/busy-frame-03.png';
import busyFrame04Url from '../assets/cursors/busy-frame-04.png';
import crosshairCursorUrl from '../assets/cursors/crosshair.png';
import defaultCursorUrl from '../assets/cursors/default.png';
import pressedCursorUrl from '../assets/cursors/pressed.png';
import pointerCursorUrl from '../assets/cursors/pointer.png';
import textCursorUrl from '../assets/cursors/text.png';

const PRESSED_CURSOR_DURATION_MS = 140;
const BUSY_FRAME_DURATION_MS = 120;
const BUSY_FRAME_COUNT = 4;
const BUSY_SELECTOR = '[aria-busy="true"], [data-busy-cursor="true"]';
const CURSOR_IMAGE_URLS = [
  defaultCursorUrl,
  pointerCursorUrl,
  pressedCursorUrl,
  textCursorUrl,
  crosshairCursorUrl,
  busyFrame01Url,
  busyFrame02Url,
  busyFrame03Url,
  busyFrame04Url,
];

let cursorImagePreloads: HTMLImageElement[] | undefined;

function preloadCursorImages() {
  if (cursorImagePreloads || typeof Image === 'undefined') return;

  cursorImagePreloads = CURSOR_IMAGE_URLS.map((source) => {
    const image = new Image(32, 32);
    image.decoding = 'sync';
    image.src = source;

    if (typeof image.decode === 'function') {
      void image.decode().catch(() => undefined);
    }

    return image;
  });
}

export default function CustomCursorManager() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    let pressedTimer: number | undefined;
    let busyTimer: number | undefined;
    let busyFrame = 0;

    preloadCursorImages();

    const clearPressedCursor = () => {
      if (pressedTimer !== undefined) {
        window.clearTimeout(pressedTimer);
        pressedTimer = undefined;
      }

      delete root.dataset.cursorPressed;
    };

    const stopBusyCursor = () => {
      if (busyTimer !== undefined) {
        window.clearInterval(busyTimer);
        busyTimer = undefined;
      }

      busyFrame = 0;
      delete root.dataset.cursorBusy;
      delete root.dataset.cursorBusyFrame;
    };

    const startBusyCursor = () => {
      if (busyTimer !== undefined) return;

      busyFrame = 0;
      root.dataset.cursorBusy = 'true';
      root.dataset.cursorBusyFrame = String(busyFrame);

      busyTimer = window.setInterval(() => {
        busyFrame = (busyFrame + 1) % BUSY_FRAME_COUNT;
        root.dataset.cursorBusyFrame = String(busyFrame);
      }, BUSY_FRAME_DURATION_MS);
    };

    const syncBusyCursor = () => {
      if (document.querySelector(BUSY_SELECTOR)) {
        startBusyCursor();
      } else {
        stopBusyCursor();
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0 || (event.pointerType && event.pointerType !== 'mouse')) return;

      clearPressedCursor();
      root.dataset.cursorPressed = 'true';
      pressedTimer = window.setTimeout(clearPressedCursor, PRESSED_CURSOR_DURATION_MS);
    };

    const observer = new MutationObserver(syncBusyCursor);
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['aria-busy', 'data-busy-cursor'],
      childList: true,
      subtree: true,
    });

    window.addEventListener('pointerdown', handlePointerDown, true);
    window.addEventListener('pointercancel', clearPressedCursor, true);
    window.addEventListener('blur', clearPressedCursor);
    syncBusyCursor();

    return () => {
      observer.disconnect();
      window.removeEventListener('pointerdown', handlePointerDown, true);
      window.removeEventListener('pointercancel', clearPressedCursor, true);
      window.removeEventListener('blur', clearPressedCursor);
      clearPressedCursor();
      stopBusyCursor();
    };
  }, []);

  return null;
}
