import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

describe('reduced motion preference', () => {
  it('tracks changes to prefers-reduced-motion', () => {
    let listener: (() => void) | undefined;
    const media = {
      matches: true,
      media: '(prefers-reduced-motion: reduce)',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn((_event: string, callback: () => void) => {
        listener = callback;
      }),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    };
    vi.mocked(window.matchMedia).mockReturnValue(media);
    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(true);

    media.matches = false;
    act(() => listener?.());
    expect(result.current).toBe(false);
  });
});
