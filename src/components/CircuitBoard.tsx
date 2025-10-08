import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function CircuitBoard() {
  // Generate random circuit paths - memoized to prevent regeneration
  const circuitPaths = useMemo(() => {
    const generateCircuitPath = (index: number) => {
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const segments = 3 + Math.floor(Math.random() * 4);

      let path = `M ${startX} ${startY}`;
      let currentX = startX;
      let currentY = startY;

      for (let i = 0; i < segments; i++) {
        const horizontal = Math.random() > 0.5;
        const distance = 10 + Math.random() * 30;

        if (horizontal) {
          currentX += (Math.random() > 0.5 ? 1 : -1) * distance;
          path += ` L ${currentX} ${currentY}`;
        } else {
          currentY += (Math.random() > 0.5 ? 1 : -1) * distance;
          path += ` L ${currentX} ${currentY}`;
        }
      }

      return path;
    };

    return Array.from({ length: 15 }, (_, i) => generateCircuitPath(i));
  }, []);

  const circuitNodes = useMemo(() => {
    return Array.from({ length: 20 }, () => ({
      cx: Math.random() * 100,
      cy: Math.random() * 100,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden opacity-30" style={{ pointerEvents: 'none' }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Circuit paths */}
        {circuitPaths.map((path, i) => (
          <motion.path
            key={`path-${i}`}
            d={path}
            stroke="rgba(0, 255, 0, 0.4)"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.3,
              ease: 'linear',
            }}
          />
        ))}

        {/* Circuit nodes */}
        {circuitNodes.map((node, i) => (
          <g key={`node-${i}`}>
            {/* Outer pulse ring */}
            <motion.circle
              cx={`${node.cx}%`}
              cy={`${node.cy}%`}
              r={0}
              fill="none"
              stroke="rgba(0, 255, 0, 0.5)"
              strokeWidth="1"
              initial={{ r: 0, opacity: 0.8 }}
              animate={{
                r: [0, 15, 0],
                opacity: [0.8, 0, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />

            {/* Core node */}
            <motion.circle
              cx={`${node.cx}%`}
              cy={`${node.cy}%`}
              r={2}
              fill="rgba(0, 255, 0, 0.8)"
              initial={{ r: 2, opacity: 0.5 }}
              animate={{
                opacity: [0.5, 1, 0.5],
                r: [2, 3, 2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          </g>
        ))}

        {/* Horizontal circuit lines */}
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={`h-line-${i}`}
            x1="0%"
            y1={`${i * 12.5}%`}
            x2="100%"
            y2={`${i * 12.5}%`}
            stroke="rgba(0, 255, 0, 0.1)"
            strokeWidth="0.5"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0.2 }}
            animate={{
              pathLength: [0, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              pathLength: {
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.2,
              },
              opacity: {
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
              }
            }}
          />
        ))}

        {/* Vertical circuit lines */}
        {[...Array(8)].map((_, i) => (
          <motion.line
            key={`v-line-${i}`}
            x1={`${i * 12.5}%`}
            y1="0%"
            x2={`${i * 12.5}%`}
            y2="100%"
            stroke="rgba(0, 255, 0, 0.1)"
            strokeWidth="0.5"
            strokeDasharray="5,5"
            initial={{ pathLength: 0, opacity: 0.2 }}
            animate={{
              pathLength: [0, 1],
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              pathLength: {
                duration: 3,
                repeat: Infinity,
                ease: 'linear',
                delay: i * 0.25,
              },
              opacity: {
                duration: 2,
                repeat: Infinity,
                delay: i * 0.25,
              }
            }}
          />
        ))}
      </svg>
    </div>
  );
}
