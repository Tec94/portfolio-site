import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mountLedgerFavicon } from '../portfolio/ledgerFavicon';

describe('ledger favicon scheduling', () => {
  let link: HTMLLinkElement;
  let cleanup: (() => void) | undefined;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.stubGlobal('CanvasRenderingContext2D', class {});
    const context = Object.fromEntries([
      'clearRect', 'beginPath', 'roundRect', 'fill', 'save', 'moveTo', 'lineTo',
      'closePath', 'clip', 'stroke', 'fillText', 'restore', 'translate', 'scale',
    ].map((method) => [method, vi.fn()])) as unknown as CanvasRenderingContext2D;
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,ledger');
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/svg+xml';
    link.href = '/favicon.svg';
    document.head.append(link);
  });

  afterEach(() => {
    cleanup?.();
    cleanup = undefined;
    link.remove();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it('settles to idle, coalesces scroll events, and removes its work on unmount', () => {
    const originalHref = link.href;
    cleanup = mountLedgerFavicon();
    vi.runAllTimers();
    expect(link.type).toBe('image/png');
    expect(vi.getTimerCount()).toBe(0);

    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    expect(vi.getTimerCount()).toBe(1);
    cleanup?.();
    cleanup = undefined;
    expect(vi.getTimerCount()).toBe(0);
    expect(link.href).toBe(originalHref);
    expect(link.type).toBe('image/svg+xml');
    window.dispatchEvent(new Event('scroll'));
    expect(vi.getTimerCount()).toBe(0);
  });

  it('draws one settled frame with reduced motion or a hidden tab', () => {
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    cleanup = mountLedgerFavicon();
    vi.runAllTimers();
    expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
    cleanup?.();

    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    vi.spyOn(window, 'matchMedia').mockReturnValue({ ...query, matches: true });
    vi.mocked(HTMLCanvasElement.prototype.toDataURL).mockClear();
    cleanup = mountLedgerFavicon();
    vi.runAllTimers();
    expect(HTMLCanvasElement.prototype.toDataURL).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });
});
