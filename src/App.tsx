import React, { useEffect, useState, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { BackgroundProvider } from './contexts/BackgroundContext';
import Scanlines from './components/Scanlines';
import Portfolio from './components/Portfolio';
import ServiceDetailPage from './pages/ServiceDetailPage';
import TerminalShell from './components/Terminal/TerminalShell';
import NetworkProgram from './components/Programs/NetworkProgram';
import ScannerProgram from './components/Programs/ScannerProgram';
import BreachProgram from './components/Programs/BreachProgram';
import CalendarProgram from './components/Programs/CalendarProgram';
import { AnimatePresence, motion } from 'framer-motion';
import Terminal from 'lucide-react/dist/esm/icons/terminal';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Analytics } from '@vercel/analytics/react';

function AppContent() {
  const [activeProgram, setActiveProgram] = useState<string | null>(null);
  const [showTerminal, setShowTerminal] = useState(false);
  const location = useLocation();

  // Hide terminal button on service detail pages
  const isServiceDetailPage = location.pathname.startsWith('/services/');

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

  const handleProgramLaunch = useCallback((args: string[]) => {
    const program = args[0];
    console.log('Launching program:', program, 'with args:', args.slice(1));
    setActiveProgram(program);
  }, []);

  const handleProgramExit = useCallback(() => {
    setActiveProgram(null);
  }, []);

  const handleNavigate = useCallback((section: string) => {
    console.log('Navigating to section:', section);
    // Close terminal and programs
    setShowTerminal(false);
    setActiveProgram(null);

    // Scroll to section after a brief delay
    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  }, []);

  const handleTerminalToggle = useCallback(() => {
    setShowTerminal(prev => !prev);
    setActiveProgram(null);
  }, []);

  // Handle ESC key to close terminal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showTerminal && !activeProgram) {
        setShowTerminal(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showTerminal, activeProgram]);

  return (
    <div className="min-h-screen transition-colors duration-300 relative">
      {/* Black background layer */}
      <div className="fixed inset-0 bg-black -z-50" />

      {/* Layered background effects */}
      <Scanlines />

      {/* Routes */}
      <Routes>
        <Route path="/" element={
          <>
            {/* Main Portfolio - Always visible when terminal is closed */}
            {!showTerminal && !activeProgram && <Portfolio />}

            {/* Floating Terminal Access Button - Only show on home page when terminal is closed */}
            {!showTerminal && !activeProgram && (
              <motion.button
                onClick={handleTerminalToggle}
                className="hidden md:flex fixed bottom-6 right-6 z-40 p-4 bg-green-500/20 border-2 border-green-500/60 rounded-lg hover:bg-green-500/30 transition-all group"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                whileHover={{
                  scale: 1.1,
                  boxShadow: '0 0 30px rgba(0, 255, 0, 0.6), inset 0 0 20px rgba(0, 255, 0, 0.2)'
                }}
                whileTap={{ scale: 0.95 }}
                style={{
                  boxShadow: '0 0 20px rgba(0, 255, 0, 0.4), inset 0 0 10px rgba(0, 255, 0, 0.1)',
                }}
              >
                <Terminal className="h-6 w-6 text-green-400 group-hover:text-green-300" />
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [1, 0.5, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity
                  }}
                  style={{
                    boxShadow: '0 0 10px rgba(0, 255, 0, 0.8)'
                  }}
                />

                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-green-500/90 border border-green-400 rounded text-xs font-mono text-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Access Terminal [Side Quest]
                </div>
              </motion.button>
            )}

            {/* Terminal Shell Overlay */}
            <AnimatePresence>
              {showTerminal && !activeProgram && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50"
                >
                  <TerminalShell
                    onProgramLaunch={handleProgramLaunch}
                  />
                  {/* Exit button for terminal */}
                  <button
                    onClick={handleTerminalToggle}
                    className="fixed bottom-16 right-4 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded text-red-400 font-mono text-sm hover:bg-red-500/30 transition-colors z-50"
                  >
                    EXIT TERMINAL [ESC]
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Programs */}
            <AnimatePresence>
              {activeProgram === 'network' && (
                <NetworkProgram
                  onExit={handleProgramExit}
                  onNavigate={handleNavigate}
                />
              )}
              {activeProgram === 'scanner' && (
                <ScannerProgram
                  onExit={handleProgramExit}
                  onNavigate={handleNavigate}
                />
              )}
              {activeProgram === 'breach' && (
                <BreachProgram
                  onExit={handleProgramExit}
                  onNavigate={handleNavigate}
                />
              )}
              {activeProgram === 'calendar' && (
                <CalendarProgram
                  onExit={handleProgramExit}
                  onNavigate={handleNavigate}
                />
              )}
            </AnimatePresence>
          </>
        } />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BackgroundProvider>
        <AppContent />
        <Analytics />
      </BackgroundProvider>
    </ThemeProvider>
  );
}

export default App;