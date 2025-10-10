import React from 'react';
import Github from 'lucide-react/dist/esm/icons/github';
import Mail from 'lucide-react/dist/esm/icons/mail';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Phone from 'lucide-react/dist/esm/icons/phone';
import { motion } from 'framer-motion';
import TerminalTyping from './TerminalTyping';
import BlurReveal from './BlurReveal';

export default function Hero() {
  return (
    <section id="about" className="min-h-screen flex items-center justify-center pt-16 relative">
      {/* Terminal Header Bar - adjusted for mobile */}
      <div className="absolute top-20 left-0 right-0 h-8 bg-green-500/10 border-y border-green-500/30 flex items-center px-2 sm:px-4 z-20">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <span className="ml-2 sm:ml-4 text-xs text-green-400 font-mono hidden sm:inline">jack@portfolio:~$</span>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20 flex flex-col items-center">
        <TerminalTyping text="Jack Cao" className="mb-6" typingSpeed={100} deletingSpeed={60} pauseDuration={3000} />

        <BlurReveal delay={0.2}>
          <h2 className="text-2xl text-green-300 mb-8 font-mono">
            <span className="text-green-500">$</span> Computer Science Student | Full-Stack Developer
          </h2>
        </BlurReveal>

        <BlurReveal delay={0.4}>
          <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-6 text-green-400 mb-12 font-mono text-xs sm:text-sm">
            <motion.span
              className="relative flex items-center border border-green-500/30 px-2 sm:px-3 py-1 rounded overflow-hidden group"
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(0, 255, 0, 0.8)',
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 10px rgba(0, 255, 0, 0.1)'
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <MapPin className="h-4 w-4 mr-2 relative z-10" />
              <span className="relative z-10">Dallas, TX</span>
              {/* Glitch outline effect */}
              <div className="absolute inset-0 border-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" style={{ clipPath: 'inset(0 0 50% 0)' }} />
            </motion.span>
            <motion.a
              href="tel:737-895-5742"
              className="relative flex items-center border border-green-500/30 px-2 sm:px-3 py-1 rounded hover:text-green-300 transition-colors duration-200 overflow-hidden group"
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(0, 255, 0, 0.8)',
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 10px rgba(0, 255, 0, 0.1)'
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <Phone className="h-4 w-4 mr-2 relative z-10" />
              <span className="relative z-10">737-895-5742</span>
              <div className="absolute inset-0 border-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" style={{ clipPath: 'inset(0 0 50% 0)' }} />
            </motion.a>
            <motion.a
              href="mailto:jack.cao@utdallas.edu"
              className="relative flex items-center border border-green-500/30 px-2 sm:px-3 py-1 rounded hover:text-green-300 transition-colors duration-200 overflow-hidden group"
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(0, 255, 0, 0.8)',
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 10px rgba(0, 255, 0, 0.1)'
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <Mail className="h-4 w-4 mr-2 relative z-10" />
              <span className="relative z-10">jack.cao@utdallas.edu</span>
              <div className="absolute inset-0 border-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" style={{ clipPath: 'inset(0 0 50% 0)' }} />
            </motion.a>
            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center border border-green-500/30 px-2 sm:px-3 py-1 rounded hover:text-green-300 transition-colors duration-200 overflow-hidden group"
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(0, 255, 0, 0.8)',
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 10px rgba(0, 255, 0, 0.1)'
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <Github className="h-4 w-4 mr-2 relative z-10" />
              <span className="relative z-10">GitHub</span>
              <div className="absolute inset-0 border-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" style={{ clipPath: 'inset(0 0 50% 0)' }} />
            </motion.a>
          </div>
        </BlurReveal>

        <BlurReveal delay={0.6}>
          <p className="text-sm sm:text-lg text-green-300 max-w-2xl mx-auto font-mono leading-relaxed px-4">
            <span className="text-green-500">{'> '}</span>Full-stack developer specializing in React, TypeScript, and Python. Experience in building scalable
            web applications, data pipelines, and automation solutions. Currently pursuing B.S. in Computer Science at UT Dallas.
          </p>
        </BlurReveal>
      </div>
    </section>
  );
}