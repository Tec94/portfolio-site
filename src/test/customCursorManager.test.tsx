import { act, cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CustomCursorManager from '../components/CustomCursorManager';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  delete document.documentElement.dataset.cursorPressed;
  delete document.documentElement.dataset.cursorBusy;
  delete document.documentElement.dataset.cursorBusyFrame;
});

describe('CustomCursorManager', () => {
  it('briefly shows the pressed cursor for a primary mouse press', () => {
    vi.useFakeTimers();
    render(<CustomCursorManager />);

    const pointerDown = new Event('pointerdown');
    Object.defineProperties(pointerDown, {
      button: { value: 0 },
      pointerType: { value: 'mouse' },
    });
    window.dispatchEvent(pointerDown);
    expect(document.documentElement.dataset.cursorPressed).toBe('true');

    act(() => {
      vi.advanceTimersByTime(139);
    });
    expect(document.documentElement.dataset.cursorPressed).toBe('true');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(document.documentElement.dataset.cursorPressed).toBeUndefined();
  });

  it('cycles busy frames while an accessible busy region is present', async () => {
    vi.useFakeTimers();
    const { rerender } = render(
      <>
        <CustomCursorManager />
        <div aria-busy="true">Loading</div>
      </>,
    );

    expect(document.documentElement.dataset.cursorBusy).toBe('true');
    expect(document.documentElement.dataset.cursorBusyFrame).toBe('0');

    act(() => {
      vi.advanceTimersByTime(120);
    });
    expect(document.documentElement.dataset.cursorBusyFrame).toBe('1');

    await act(async () => {
      rerender(<CustomCursorManager />);
      await Promise.resolve();
    });

    expect(document.documentElement.dataset.cursorBusy).toBeUndefined();
    expect(document.documentElement.dataset.cursorBusyFrame).toBeUndefined();
  });
});
