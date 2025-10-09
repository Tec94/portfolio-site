import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CardParticleEffectProps {
  isHovered: boolean;
}

export default function CardParticleEffect({ isHovered }: CardParticleEffectProps) {
  const [particles, setParticles] = useState<Array<{ id: number; startX: number; startY: number; targetX: number; targetY: number }>>([]);

  useEffect(() => {
    if (!isHovered) {
      setParticles([]);
      return;
    }

    // Generate particles that come from outside and form a solid outline 5-7px away
    const newParticles: typeof particles = [];
    const outlineOffset = 6; // 6px offset from edge (approximately 1.5% of typical card size)

    // Top edge particles - coming from above the card
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: newParticles.length,
        startX: (i / 50) * 100,
        startY: -30 + Math.random() * 20, // Start from above (-30% to -10%)
        targetX: (i / 50) * 100,
        targetY: -(outlineOffset / 4), // Target position 6px above edge
      });
    }

    // Right edge particles - coming from right side of card
    for (let i = 0; i < 35; i++) {
      newParticles.push({
        id: newParticles.length,
        startX: 110 + Math.random() * 20, // Start from right side (110% to 130%)
        startY: (i / 35) * 100,
        targetX: 100 + (outlineOffset / 4), // Target position 6px right of edge
        targetY: (i / 35) * 100,
      });
    }

    // Bottom edge particles - coming from below the card
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        id: newParticles.length,
        startX: (i / 50) * 100,
        startY: 110 + Math.random() * 20, // Start from below (110% to 130%)
        targetX: (i / 50) * 100,
        targetY: 100 + (outlineOffset / 4), // Target position 6px below edge
      });
    }

    // Left edge particles - coming from left side of card
    for (let i = 0; i < 35; i++) {
      newParticles.push({
        id: newParticles.length,
        startX: -30 + Math.random() * 20, // Start from left side (-30% to -10%)
        startY: (i / 35) * 100,
        targetX: -(outlineOffset / 4), // Target position 6px left of edge
        targetY: (i / 35) * 100,
      });
    }

    setParticles(newParticles);
  }, [isHovered]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-visible rounded-lg" style={{ margin: '-20px' }}>
      <AnimatePresence>
        {isHovered && particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-green-400"
            style={{
              width: '3px',
              height: '3px',
              boxShadow: '0 0 6px rgba(0, 255, 0, 1), 0 0 12px rgba(0, 255, 0, 0.8), 0 0 18px rgba(0, 255, 0, 0.4)',
            }}
            initial={{
              left: `${particle.startX}%`,
              top: `${particle.startY}%`,
              opacity: 0,
              scale: 0,
            }}
            animate={{
              left: `${particle.targetX}%`,
              top: `${particle.targetY}%`,
              opacity: [0, 0.9, 0.7],
              scale: [0, 1.2, 1],
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 0.6,
              ease: [0.4, 0, 0.2, 1],
              delay: Math.random() * 0.2, // Stagger the particles slightly
            }}
          />
        ))}
      </AnimatePresence>

      {/* Corner gathering points with extra glow */}
      <AnimatePresence>
        {isHovered && (
          <>
            {/* Top-left corner */}
            <motion.div
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: '0%',
                top: '0%',
                background: 'radial-gradient(circle, rgba(0, 255, 0, 0.8) 0%, transparent 70%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.6],
                scale: [0, 2, 1.5],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
            />

            {/* Top-right corner */}
            <motion.div
              className="absolute w-3 h-3 rounded-full"
              style={{
                right: '0%',
                top: '0%',
                background: 'radial-gradient(circle, rgba(0, 255, 0, 0.8) 0%, transparent 70%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.6],
                scale: [0, 2, 1.5],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />

            {/* Bottom-left corner */}
            <motion.div
              className="absolute w-3 h-3 rounded-full"
              style={{
                left: '0%',
                bottom: '0%',
                background: 'radial-gradient(circle, rgba(0, 255, 0, 0.8) 0%, transparent 70%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.6],
                scale: [0, 2, 1.5],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />

            {/* Bottom-right corner */}
            <motion.div
              className="absolute w-3 h-3 rounded-full"
              style={{
                right: '0%',
                bottom: '0%',
                background: 'radial-gradient(circle, rgba(0, 255, 0, 0.8) 0%, transparent 70%)',
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0.6],
                scale: [0, 2, 1.5],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Energy pulse along the outline */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 border-2 border-green-400 rounded-lg"
            style={{
              boxShadow: '0 0 20px rgba(0, 255, 0, 0.6), inset 0 0 20px rgba(0, 255, 0, 0.2)',
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.8, 0.5],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
