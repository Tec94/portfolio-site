import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Experience from './Experience';
import Services from './Services';
import Projects from './Projects';
import Skills from './Skills';
import Testimonials from './Testimonials';
import FAQ from './FAQ';
import Awards from './Awards';
import Contact from './Contact';
import Footer from './Footer';
import FloatingCTA from './FloatingCTA';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <Experience />
      <Services />
      <Projects />
      <Skills />
      <Testimonials />
      <FAQ />
      <Awards />
      <Contact />
      <Footer />
      <FloatingCTA />
    </div>
  );
}
