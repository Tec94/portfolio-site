import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Experience from './Experience';
import Services from './Services';
import Projects from './Projects';
import Skills from './Skills';
import Recognition from './Recognition'; // Replaced Testimonials with Recognition
// import Testimonials from './Testimonials'; // Will use once you have real client testimonials
import FAQ from './FAQ';
import Awards from './Awards';
import Contact from './Contact';
import Footer from './Footer';
import FloatingCTA from './FloatingCTA';
import BackToTop from './BackToTop';

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-black">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-green-400 focus:text-black focus:font-mono focus:font-bold focus:rounded focus:border-2 focus:border-green-500"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main-content">
        <Hero />
        <Experience />
        <Services />
        <Projects />
        <Skills />
        <Recognition /> {/* Shows hackathon wins, project metrics, achievements */}
        {/* <Testimonials /> */} {/* Uncomment once you have real client testimonials */}
        <FAQ />
        <Awards />
        <Contact />
      </main>

      <Footer />
      <FloatingCTA />
      <BackToTop />
    </div>
  );
}
