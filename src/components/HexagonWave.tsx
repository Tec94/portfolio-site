import React from 'react';
import { motion } from 'framer-motion';

export default function HexagonWave() {
  const hexSize = 40;
  const rows = 12;
  const cols = 20;

  const getHexPoints = (cx: number, cy: number, size: number) => {
    const points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = cx + size * Math.cos(angle);
      const y = cy + size * Math.sin(angle);
      points.push(`${x},${y}`);
    }
    return points.join(' ');
  };

  return (
    <div className="absolute inset-0 overflow-hidden opacity-20" style={{ pointerEvents: 'none' }}>
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {[...Array(rows)].map((_, row) =>
          [...Array(cols)].map((_, col) => {
            const cx = col * hexSize * 1.5 + (row % 2) * hexSize * 0.75;
            const cy = row * hexSize * 0.866;
            const delay = (row + col) * 0.05;

            return (
              <motion.polygon
                key={`hex-${row}-${col}`}
                points={getHexPoints(cx, cy, hexSize * 0.4)}
                fill="none"
                stroke="rgba(0, 255, 0, 0.3)"
                strokeWidth="1"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: [0.8, 1, 0.8],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: delay,
                  ease: 'easeInOut',
                }}
              />
            );
          })
        )}
      </svg>
    </div>
  );
}
