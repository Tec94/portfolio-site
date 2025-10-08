import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBackground } from '../contexts/BackgroundContext';
import CyberpunkScene3D from './CyberpunkScene3D';
import Experience3DBackground from './Experience3DBackground';

export default function UnifiedBackground() {
  const { activeSection } = useBackground();

  // Determine which background to show based on active section
  const getBackgroundType = () => {
    if (activeSection === 'experience') return 'experience';
    return 'hero'; // Default for about, projects, skills, awards
  };

  const backgroundType = getBackgroundType();

  return (
    <div className="fixed inset-0 -z-10">
      <AnimatePresence mode="wait">
        {backgroundType === 'hero' && (
          <motion.div
            key="hero-bg"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <CyberpunkScene3D />
          </motion.div>
        )}

        {backgroundType === 'experience' && (
          <motion.div
            key="experience-bg"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 1.2,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            <Experience3DBackground />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gradient overlay for depth */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/40 pointer-events-none"
        animate={{
          opacity: activeSection === 'about' ? 0.3 : 0.5,
        }}
        transition={{ duration: 1 }}
      />
    </div>
  );
}
