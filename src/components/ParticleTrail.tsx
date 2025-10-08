import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticleTrailProps {
  isActive: boolean;
}

export default function ParticleTrail({ isActive }: ParticleTrailProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);
  const nextIdRef = useRef(0);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      return;
    }

    const interval = setInterval(() => {
      const newParticles = Array.from({ length: 3 }, () => ({
        id: nextIdRef.current++,
        x: Math.random() * 100,
        y: Math.random() * 100,
      }));

      setParticles((prev) => {
        const updated = [...prev, ...newParticles];
        // Keep only last 15 particles for performance
        return updated.slice(-15);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 rounded-full bg-green-400"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              boxShadow: '0 0 4px rgba(0, 255, 0, 0.8)',
            }}
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0],
              x: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 40],
              y: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 40],
            }}
            exit={{
              opacity: 0,
              scale: 0,
            }}
            transition={{
              duration: 1.5,
              ease: 'easeOut',
            }}
          />
        ))}
      </AnimatePresence>

      {/* Orbiting particles around the button */}
      {isActive && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`orbit-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-green-400"
              style={{
                left: '50%',
                top: '50%',
                boxShadow: '0 0 6px rgba(0, 255, 0, 1)',
              }}
              animate={{
                x: [
                  Math.cos((i / 8) * Math.PI * 2) * 30,
                  Math.cos((i / 8) * Math.PI * 2 + Math.PI * 2) * 30,
                ],
                y: [
                  Math.sin((i / 8) * Math.PI * 2) * 20,
                  Math.sin((i / 8) * Math.PI * 2 + Math.PI * 2) * 20,
                ],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.1,
              }}
            />
          ))}
        </>
      )}

      {/* Energy ring expanding outward */}
      {isActive && (
        <>
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`ring-${i}`}
              className="absolute border border-green-400 rounded"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              initial={{
                width: '0%',
                height: '0%',
                opacity: 0.6,
              }}
              animate={{
                width: '200%',
                height: '200%',
                opacity: 0,
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeOut',
                delay: i * 0.5,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
