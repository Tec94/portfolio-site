import { Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { BackgroundProvider } from './contexts/BackgroundContext';
import { StatsigWrapper } from './contexts/StatsigContext';
import Scanlines from './components/Scanlines';
import CustomCursorManager from './components/CustomCursorManager';
import { lazyWithRetry } from './lib/lazyWithRetry';
import './v2.css';
import './cursors.css';

// Lazy load components for better performance
const Portfolio = lazyWithRetry(() => import('./components/Portfolio'), 'classic');
const PaymentDemoPage = lazyWithRetry(() => import('./pages/PaymentDemoPage'), 'payment');
const ServiceDetailPage = lazyWithRetry(() => import('./pages/ServiceDetailPage'), 'service-detail');
const NotFound = lazyWithRetry(() => import('./pages/NotFound'), 'not-found');
const V2Layout = lazyWithRetry(() => import('./components/v2/V2Layout'), 'v2-layout');
const ProjectsPage = lazyWithRetry(() => import('./components/v2/ProjectsPage'), 'projects');
const ServicesPage = lazyWithRetry(() => import('./components/v2/ServicesPage'), 'services');
const AboutPage = lazyWithRetry(() => import('./components/v2/AboutPage'), 'about');
const ContactPage = lazyWithRetry(() => import('./components/v2/ContactPage'), 'contact');
const LoadingScreen = () => (
  <div className="v2-loading" role="status" aria-busy="true">
    <span className="v2-loading-mark">JC</span>
    <span>Loading portfolio</span>
  </div>
);

function AppContent() {
  const location = useLocation();
  const isPaymentRoute = location.pathname === '/payment';
  const isClassicRoute =
    location.pathname === '/classic' || location.pathname.startsWith('/services/');
  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      <a
        href="#main-content"
        className="v2-skip-link"
      >
        Skip to main content
      </a>

      {!isPaymentRoute ? <div className="fixed inset-0 bg-black -z-50" /> : null}

      {isClassicRoute ? <Scanlines /> : null}

      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route element={<V2Layout />}>
            <Route path="/v2" element={<ProjectsPage />} />
            <Route path="/v2/services" element={<ServicesPage />} />
            <Route path="/v2/about" element={<AboutPage />} />
            <Route path="/v2/contact" element={<ContactPage />} />
          </Route>
          <Route path="/classic" element={<Portfolio />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/payment" element={<PaymentDemoPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default function LegacyApp() {
  return (
    <div className="legacy-app">
    <StatsigWrapper>
      <ThemeProvider>
        <BackgroundProvider>
          <CustomCursorManager />
          <AppContent />
        </BackgroundProvider>
      </ThemeProvider>
    </StatsigWrapper>
    </div>
  );
}
