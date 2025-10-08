import React from 'react';
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

  return (
    <div className="absolute inset-0 overflow-hidden opacity-25" style={{ pointerEvents: 'none' }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 100 100">
        {[...Array(waveCount)].map((_, i) => (
          <motion.path
            key={`wave-${i}`}
            d={generateWavePath(3 + i * 2, 2 + i * 0.5, 0)}
            fill="none"
            stroke={`rgba(0, 255, 0, ${0.3 - i * 0.05})`}
            strokeWidth="0.5"
            animate={{
              d: [
                generateWavePath(3 + i * 2, 2 + i * 0.5, 0),
                generateWavePath(3 + i * 2, 2 + i * 0.5, Math.PI * 2),
              ],
            }}
            transition={{
              duration: 4 + i * 0.5,
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
              x1: [`${i * 10}%`, `${i * 10 + 2}%`, `${i * 10}%`],
              x2: [`${i * 10}%`, `${i * 10 + 2}%`, `${i * 10}%`],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}

        {/* Flowing particles */}
        {[...Array(15)].map((_, i) => (
          <motion.circle
            key={`particle-${i}`}
            r="0.3"
            fill="rgba(0, 255, 0, 0.8)"
            initial={{
              cx: `${Math.random() * 100}%`,
              cy: `${Math.random() * 100}%`,
            }}
            animate={{
              cx: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              cy: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
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
