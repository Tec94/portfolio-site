import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Github from 'lucide-react/dist/esm/icons/github';
import ExternalLink from 'lucide-react/dist/esm/icons/external-link';
import Code from 'lucide-react/dist/esm/icons/code';
import Database from 'lucide-react/dist/esm/icons/database';
import Zap from 'lucide-react/dist/esm/icons/zap';
import Play from 'lucide-react/dist/esm/icons/play';
import TerminalTyping from './TerminalTyping';
import BlurReveal from './BlurReveal';

interface Project {
  title: string;
  tech: string;
  period: string;
  description: string[];
  github: string;
  demoUrl?: string;
  bubbleDesignUrl?: string;
  metrics?: {
    label: string;
    value: string;
  }[];
}

interface CyberpunkProjectsProps {
  projects: Project[];
}

export default function CyberpunkProjects({ projects }: CyberpunkProjectsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        prevProject();
      } else if (e.key === 'ArrowRight') {
        nextProject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex]);

  const nextProject = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const activeProject = projects[activeIndex];

  // Handle drag end for touch/swipe navigation
  const handleDragEnd = (event: any, info: any) => {
    const swipeThreshold = 50;
    if (info.offset.x > swipeThreshold) {
      // Swiped right, go to previous
      prevProject();
    } else if (info.offset.x < -swipeThreshold) {
      // Swiped left, go to next
      nextProject();
    }
  };

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      {/* Network Nodes Background */}

      {/* Animated circuit lines in background - reduced from 10 to 5 */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-green-500"
            style={{
              top: `${i * 20}%`,
              left: 0,
              right: 0,
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 1,
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 flex flex-col items-center">
          <TerminalTyping text="Featured Projects" className="mb-4" />
          <p className="text-green-300 max-w-2xl mx-auto font-mono mt-4">
            <span className="text-green-500">{'> '}</span>
            Showcase of my latest builds — use arrow keys to navigate
          </p>
        </div>

        {/* Main project display */}
        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 100 : -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -100 : 100 }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
              className="relative"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
            >
              {/* Project card - wider expanded view */}
              <div className="grid md:grid-cols-2 gap-6 border-2 border-green-500/40 rounded-lg overflow-hidden bg-black/80 backdrop-blur-sm p-6 h-[550px]"
                style={{
                  boxShadow: '0 0 50px rgba(0, 255, 0, 0.3), inset 0 0 50px rgba(0, 255, 0, 0.05)',
                }}
              >
                {/* Left side - Live Website Preview */}
                <div className="relative h-full w-full bg-black border border-green-500/30 rounded overflow-hidden group flex items-center justify-center">
                  <div className="relative w-full" style={{ aspectRatio: '16 / 9' }}>
                    {/* Live Website iframe - desktop view scaled down */}
                    {activeProject.demoUrl && (
                      <div className="absolute inset-0 overflow-hidden">
                        <iframe
                          src={activeProject.demoUrl}
                          className="absolute top-0 left-0"
                          title={`${activeProject.title} preview`}
                          loading="lazy"
                          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                          style={{
                            width: '1920px',
                            height: '1080px',
                            transform: 'scale(0.3)',
                            transformOrigin: 'top left',
                            border: 'none',
                            overflow: 'hidden',
                            pointerEvents: 'none'
                          }}
                        />
                      </div>
                    )}

                    {/* Scanlines effect overlay */}
                    <div className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 255, 0, 0.02), rgba(0, 255, 0, 0.02) 1px, transparent 1px, transparent 2px)',
                      }}
                    />

                    {/* Click to open overlay */}
                    <a
                      href={activeProject.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 opacity-0 hover:opacity-100 transition-all cursor-pointer group/link z-10"
                    >
                      <motion.div
                        className="bg-green-500/20 backdrop-blur-sm border-2 border-green-400 rounded-lg px-6 py-3 text-green-300 font-mono text-sm flex items-center gap-2"
                        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 255, 0, 0.6)' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>VISIT LIVE SITE</span>
                      </motion.div>
                    </a>

                    {/* Project stats overlay */}
                    {activeProject.metrics && (
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-sm border-t border-green-500/30 z-20">
                        <div className="flex gap-4 justify-around text-xs font-mono">
                          {activeProject.metrics.map((metric, idx) => (
                            <div key={idx} className="text-center">
                              <div className="text-green-400 font-bold text-lg">{metric.value}</div>
                              <div className="text-green-500/70">{metric.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right side - Project details */}
                <div className="flex flex-col">
                  {/* Header */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="text-3xl font-bold text-green-300 font-mono mb-2"
                          style={{
                            textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                          }}
                        >
                          {activeProject.title}
                        </h3>
                        <div className="text-xs text-green-500 font-mono flex items-center gap-2">
                          <Zap className="h-3 w-3" />
                          {activeProject.period}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        <motion.a
                          href={activeProject.demoUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative p-2 border border-green-500/40 rounded hover:border-green-400 transition-colors duration-200 overflow-hidden group"
                          whileHover={{
                            scale: 1.1,
                            boxShadow: '0 0 20px rgba(0, 255, 0, 0.6), inset 0 0 10px rgba(0, 255, 0, 0.2)'
                          }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        >
                          <ExternalLink className="h-4 w-4 text-green-400 relative z-10" />
                          {/* Corner brackets on hover */}
                          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-l border-t border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-r border-t border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-l border-b border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-r border-b border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                          {/* Scan line */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/30 to-transparent opacity-0 group-hover:opacity-100"
                            animate={{ y: ['-100%', '200%'] }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                          />
                        </motion.a>
                        <motion.a
                          href={`https://github.com/${activeProject.github}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative p-2 border border-green-500/40 rounded hover:border-green-400 transition-colors duration-200 overflow-hidden group"
                          whileHover={{
                            scale: 1.1,
                            boxShadow: '0 0 20px rgba(0, 255, 0, 0.6), inset 0 0 10px rgba(0, 255, 0, 0.2)'
                          }}
                          whileTap={{ scale: 0.9 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        >
                          <Github className="h-4 w-4 text-green-400 relative z-10" />
                          {/* Corner brackets on hover */}
                          <div className="absolute top-0 left-0 w-1.5 h-1.5 border-l border-t border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                          <div className="absolute top-0 right-0 w-1.5 h-1.5 border-r border-t border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                          <div className="absolute bottom-0 left-0 w-1.5 h-1.5 border-l border-b border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                          <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-r border-b border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                          {/* Scan line */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/30 to-transparent opacity-0 group-hover:opacity-100"
                            animate={{ y: ['-100%', '200%'] }}
                            transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }}
                          />
                        </motion.a>
                      </div>
                    </div>

                    {/* Tech stack tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {activeProject.tech.split(', ').map((tech, idx) => (
                        <motion.span
                          key={idx}
                          className="px-2 py-1 text-xs font-mono border border-green-500/30 rounded bg-green-500/10 text-green-400"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{
                            borderColor: 'rgba(0, 255, 0, 0.6)',
                            boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
                          }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Description - expanded */}
                  <div className="flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
                    <div className="space-y-3">
                      {activeProject.description.map((desc, idx) => (
                        <motion.div
                          key={idx}
                          className="flex items-start gap-3 text-sm text-green-300 font-mono leading-relaxed"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + idx * 0.1 }}
                        >
                          <Code className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{desc}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Data visualization hint */}
                  <div className="mt-4 pt-4 border-t border-green-500/20">
                    <div className="flex items-center gap-2 text-xs text-green-500/70 font-mono">
                      <Database className="h-3 w-3" />
                      <span>SYSTEM_STATUS: OPERATIONAL • DATA_INTEGRITY: 100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Project indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {projects.map((_, idx) => (
            <motion.button
              key={idx}
              onClick={() => {
                setDirection(idx > activeIndex ? 1 : -1);
                setActiveIndex(idx);
              }}
              className={`h-2 rounded-full transition-all ${
                idx === activeIndex ? 'w-12 bg-green-400' : 'w-2 bg-green-600/40'
              }`}
              whileHover={{ scale: 1.2 }}
              style={{
                boxShadow: idx === activeIndex ? '0 0 15px rgba(0, 255, 0, 0.6)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Navigation hint */}
        <div className="text-center mt-6 text-xs font-mono text-green-500/50">
          <span className="hidden md:inline-flex items-center gap-2">
            Use <kbd className="px-2 py-1 border border-green-500/30 rounded">←</kbd>
            <kbd className="px-2 py-1 border border-green-500/30 rounded">→</kbd> to navigate
          </span>
          <span className="md:hidden">
            Swipe left or right to navigate
          </span>
        </div>
      </div>
    </section>
  );
}
