import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';

function App() {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Navbar />
      <main>
        <Hero />
        <Experience />
        <Projects />
        <Skills />
      </main>
    </div>
  );
}

export default App;