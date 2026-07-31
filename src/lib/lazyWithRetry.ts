import { lazy, type ComponentType } from 'react';

const CHUNK_ERROR_PATTERN =
  /dynamically imported module|failed to fetch|chunkloaderror|loading chunk/i;

export function lazyWithRetry<Props>(
  importer: () => Promise<{ default: ComponentType<Props> }>,
  routeKey: string,
) {
  const storageKey = `portfolio:chunk-retry:${routeKey}`;

  return lazy(async () => {
    try {
      const module = await importer();
      window.sessionStorage.removeItem(storageKey);
      return module;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const canRetry =
        typeof window !== 'undefined' &&
        CHUNK_ERROR_PATTERN.test(message) &&
        window.sessionStorage.getItem(storageKey) !== 'used';

      if (canRetry) {
        window.sessionStorage.setItem(storageKey, 'used');
        window.location.reload();
        return new Promise<{ default: ComponentType<Props> }>(() => undefined);
      }

      throw error;
    }
  });
}
