import React, { useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Awards from './components/Awards';
import FunFacts from './components/FunFacts';
import Footer from './components/Footer';
import MatrixRain from './components/MatrixRain';
import Scanlines from './components/Scanlines';
import GridBackground from './components/GridBackground';
import ScrollProgress from './components/ScrollProgress';
import AnimatedDataStreams from './components/AnimatedDataStreams';
import AOS from 'aos';
import 'aos/dist/aos.css';

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
      disable: false,
      startEvent: 'DOMContentLoaded',
      initClassName: 'aos-init',
      animatedClassName: 'aos-animate',
      useClassNames: false,
      disableMutationObserver: false,
    });

    // Refresh AOS on route change or dynamic content
    AOS.refresh();
  }, []);

  return (
    <div className="min-h-screen bg-black transition-colors duration-300 relative overflow-x-hidden">
      {/* Layered background effects */}
      <MatrixRain />
      <GridBackground />
      <AnimatedDataStreams />
      <Scanlines />
      <ScrollProgress />

      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <Experience />
          <Projects />
          <Skills />
          <Awards />
          <FunFacts />
        </main>
        <Footer />
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;