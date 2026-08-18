import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class ObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, 'ResizeObserver', { writable: true, value: ObserverStub });
Object.defineProperty(window, 'IntersectionObserver', { writable: true, value: ObserverStub });
Object.defineProperty(window, 'scrollTo', { writable: true, value: vi.fn() });

if (!HTMLDialogElement.prototype.showModal) {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value() {
      Object.defineProperty(this, 'open', { configurable: true, value: true });
      this.setAttribute('open', '');
    },
  });
}

if (!HTMLDialogElement.prototype.close) {
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value() {
      Object.defineProperty(this, 'open', { configurable: true, value: false });
      this.removeAttribute('open');
    },
  });
}
