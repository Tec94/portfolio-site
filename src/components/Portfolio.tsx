import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Experience from './Experience';
import Projects from './Projects';
import Skills from './Skills';
import Awards from './Awards';
import Footer from './Footer';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <Experience />
      <Projects />
      <Skills />
      <Awards />
      <Footer />
    </div>
  );
}
