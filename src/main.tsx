import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import './v2.css';
import './cursors.css';

const VITE_PRELOAD_RETRY_KEY = 'portfolio:vite-preload-retry';

window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault();

  if (window.sessionStorage.getItem(VITE_PRELOAD_RETRY_KEY) === window.location.pathname) {
    return;
  }

  window.sessionStorage.setItem(VITE_PRELOAD_RETRY_KEY, window.location.pathname);
  window.location.reload();
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
