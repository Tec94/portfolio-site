import React, { useEffect, useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { BackgroundProvider } from './contexts/BackgroundContext';
import Scanlines from './components/Scanlines';
import TerminalShell from './components/Terminal/TerminalShell';
import NetworkProgram from './components/Programs/NetworkProgram';
import ScannerProgram from './components/Programs/ScannerProgram';
import BreachProgram from './components/Programs/BreachProgram';
import { AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

function AppContent() {
  const [theme, setTheme] = useState('cyberpunk');
  const [glitchIntensity, setGlitchIntensity] = useState(30);
  const [activeProgram, setActiveProgram] = useState<string | null>(null);

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

  const handleProgramLaunch = (args: string[]) => {
    const program = args[0];
    console.log('Launching program:', program, 'with args:', args.slice(1));
    setActiveProgram(program);
  };

  const handleProgramExit = () => {
    setActiveProgram(null);
  };

  const handleNavigate = (section: string) => {
    console.log('Navigating to section:', section);
    // TODO: Implement actual navigation
    handleProgramExit();
  };

  const handleThemeChange = (newTheme: string) => {
    console.log('Theme changed to:', newTheme);
    setTheme(newTheme);
    // TODO: Implement theme switching
  };

  const handleGlitchChange = (intensity: number) => {
    console.log('Glitch intensity:', intensity);
    setGlitchIntensity(intensity);
    // TODO: Implement glitch effects
  };

  return (
    <div className="min-h-screen transition-colors duration-300 relative overflow-hidden">
      {/* Black background layer */}
      <div className="fixed inset-0 bg-black -z-50" />

      {/* Layered background effects */}
      <Scanlines />

      {/* Terminal Shell */}
      {!activeProgram && (
        <TerminalShell
          onProgramLaunch={handleProgramLaunch}
          onThemeChange={handleThemeChange}
          onGlitchChange={handleGlitchChange}
        />
      )}

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
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BackgroundProvider>
        <AppContent />
      </BackgroundProvider>
    </ThemeProvider>
  );
}

export default App;