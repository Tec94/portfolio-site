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

    // Generate particles that will converge to form an outline
    const newParticles: typeof particles = [];

    // Top edge particles
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: newParticles.length,
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        targetX: (i / 20) * 100,
        targetY: 0,
      });
    }

    // Right edge particles
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: newParticles.length,
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        targetX: 100,
        targetY: (i / 15) * 100,
      });
    }

    // Bottom edge particles
    for (let i = 0; i < 20; i++) {
      newParticles.push({
        id: newParticles.length,
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        targetX: (i / 20) * 100,
        targetY: 100,
      });
    }

    // Left edge particles
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: newParticles.length,
        startX: Math.random() * 100,
        startY: Math.random() * 100,
        targetX: 0,
        targetY: (i / 15) * 100,
      });
    }

    setParticles(newParticles);
  }, [isHovered]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
      <AnimatePresence>
        {isHovered && particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full bg-green-400"
            style={{
              boxShadow: '0 0 4px rgba(0, 255, 0, 1), 0 0 8px rgba(0, 255, 0, 0.5)',
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
              opacity: [0, 1, 0.8],
              scale: [0, 1.5, 1],
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 0.8,
              ease: [0.4, 0, 0.2, 1],
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
