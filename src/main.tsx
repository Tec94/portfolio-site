import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './v2.css';
import './cursors.css';

const DEV_SW_CLEANUP_KEY = 'dev-service-worker-cleanup-v3';
const VITE_PRELOAD_RETRY_KEY = 'portfolio:vite-preload-retry';

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();

  if (window.sessionStorage.getItem(VITE_PRELOAD_RETRY_KEY) === window.location.pathname) {
    return;
  }

  window.sessionStorage.setItem(VITE_PRELOAD_RETRY_KEY, window.location.pathname);
  window.location.reload();
});

async function cleanupDevServiceWorkers() {
  if (!import.meta.env.DEV || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  if (window.sessionStorage.getItem(DEV_SW_CLEANUP_KEY) === 'done') {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();

  if (registrations.length === 0) {
    window.sessionStorage.setItem(DEV_SW_CLEANUP_KEY, 'done');
    return;
  }

  await Promise.all(registrations.map((registration) => registration.unregister()));

  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map((cacheName) => caches.delete(cacheName)));
  }

  window.sessionStorage.setItem(DEV_SW_CLEANUP_KEY, 'done');

  if (navigator.serviceWorker.controller) {
    window.location.reload();
  }
}

void cleanupDevServiceWorkers();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
