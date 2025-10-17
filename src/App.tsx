import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { BackgroundProvider } from './contexts/BackgroundContext';
import { StatsigWrapper } from './contexts/StatsigContext';
import Scanlines from './components/Scanlines';
import Portfolio from './components/Portfolio';
import ErrorBoundary from './components/ErrorBoundary';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// Lazy load components for better performance
const ServiceDetailPage = lazy(() => import('./pages/ServiceDetailPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading component
const LoadingScreen = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center">
      <motion.div
        className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full mx-auto mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <p className="text-green-400 font-mono text-sm">Loading...</p>
    </div>
  </div>
);

function AppContent() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 120,
      delay: 50,
      easing: 'ease-out-cubic',
      mirror: false,
      anchorPlacement: 'top-bottom',
    });

    AOS.refresh();
  }, []);

  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-6 focus:py-3 focus:bg-cyan-500 focus:text-black focus:font-mono focus:font-bold focus:rounded-lg focus:shadow-[0_0_20px_rgba(34,211,238,0.8)]"
      >
        Skip to main content
      </a>

      {/* Black background layer */}
      <div className="fixed inset-0 bg-black -z-50" />

      {/* Layered background effects */}
      <Scanlines />

      {/* Routes */}
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <StatsigWrapper>
        <ThemeProvider>
          <BackgroundProvider>
            <AppContent />
            <Analytics />
            <SpeedInsights />
          </BackgroundProvider>
        </ThemeProvider>
      </StatsigWrapper>
    </ErrorBoundary>
  );
}

export default App;