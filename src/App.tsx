import { Suspense } from 'react';
import { useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { lazyWithRetry } from './lib/lazyWithRetry';
import { isLegacyAppRoute } from './portfolio/routeOwnership';

const LegacyApp = lazyWithRetry(() => import('./LegacyApp'), 'legacy-app');
const PreviewPortfolio = lazyWithRetry(() => import('./portfolio/PreviewPortfolio'), 'portfolio-preview');

export default function App() {
  const { pathname } = useLocation();
  return (
    <ErrorBoundary>
      <Suspense fallback={<div className="portfolio-loading-screen" role="status" aria-busy="true"><span>Loading portfolio</span></div>}>
        {isLegacyAppRoute(pathname) ? <LegacyApp /> : <PreviewPortfolio />}
      </Suspense>
    </ErrorBoundary>
  );
}
