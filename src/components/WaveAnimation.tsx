import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function WaveAnimation() {
  const waveCount = 5;

  const generateWavePath = (amplitude: number, frequency: number, phase: number) => {
    const width = 100;
    const points = 50;
    let path = 'M 0 50';

    for (let i = 0; i <= points; i++) {
      const x = (i / points) * width;
      const y = 50 + amplitude * Math.sin(((i / points) * frequency * Math.PI * 2) + phase);
      path += ` L ${x} ${y}`;
    }

    return path;
  };

  const wavePaths = useMemo(() => {
    return Array.from({ length: waveCount }, (_, i) => ({
      path1: generateWavePath(3 + i * 2, 2 + i * 0.5, 0),
      path2: generateWavePath(3 + i * 2, 2 + i * 0.5, Math.PI * 2),
      opacity: 0.3 - i * 0.05,
      duration: 4 + i * 0.5,
    }));
  }, [waveCount]);

  const particles = useMemo(() => {
    return Array.from({ length: 15 }, () => ({
      cx: Math.random() * 100,
      cy: Math.random() * 100,
      cx2: Math.random() * 100,
      cy2: Math.random() * 100,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-25" style={{ pointerEvents: 'none' }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 100 100">
        {wavePaths.map((wave, i) => (
          <motion.path
            key={`wave-${i}`}
            d={wave.path1}
            fill="none"
            stroke={`rgba(0, 255, 0, ${wave.opacity})`}
            strokeWidth="0.5"
            initial={{ d: wave.path1 }}
            animate={{
              d: [wave.path1, wave.path2],
            }}
            transition={{
              duration: wave.duration,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}

        {/* Vertical wave lines */}
        {[...Array(10)].map((_, i) => (
          <motion.line
            key={`v-wave-${i}`}
            x1={`${i * 10}%`}
            y1="0%"
            x2={`${i * 10}%`}
            y2="100%"
            stroke="rgba(0, 255, 0, 0.1)"
            strokeWidth="0.3"
            strokeDasharray="2,4"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}

        {/* Flowing particles */}
        {particles.map((particle, i) => (
          <motion.circle
            key={`particle-${i}`}
            r={0.3}
            fill="rgba(0, 255, 0, 0.8)"
            initial={{
              cx: `${particle.cx}%`,
              cy: `${particle.cy}%`,
              opacity: 0,
            }}
            animate={{
              cx: [`${particle.cx}%`, `${particle.cx2}%`],
              cy: [`${particle.cy}%`, `${particle.cy2}%`],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
