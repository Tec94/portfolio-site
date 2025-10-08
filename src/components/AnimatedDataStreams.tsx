import React from 'react';
import { motion } from 'framer-motion';

export default function AnimatedDataStreams() {
  // Generate binary code for data streams
  const generateBinaryString = () => {
    return Array.from({ length: 20 }, () => Math.random() > 0.5 ? '1' : '0').join('');
  };

  return (
    <div className="fixed inset-0 -z-30 overflow-hidden pointer-events-none">
      {/* Flowing binary data streams - reduced from 12 to 6 */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`stream-${i}`}
          className="absolute font-mono text-green-500/20 text-xs whitespace-nowrap"
          style={{
            left: `${(i * 16.66)}%`,
            top: '-10%',
          }}
          animate={{
            y: ['0vh', '110vh'],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.5,
          }}
        >
          {[...Array(20)].map((_, j) => (
            <div key={j} className="mb-4">
              {generateBinaryString()}
            </div>
          ))}
        </motion.div>
      ))}

      {/* Floating particles - reduced from 30 to 15 */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 bg-green-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: '0 0 4px rgba(0, 255, 0, 0.8)',
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Horizontal scanning lines - reduced from 3 to 2 */}
      {[...Array(2)].map((_, i) => (
        <motion.div
          key={`scan-${i}`}
          className="absolute left-0 right-0 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(0, 255, 0, 0.3), transparent)',
            boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
          }}
          animate={{
            top: ['0%', '100%'],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay: i * 4,
            ease: 'linear',
          }}
        />
      ))}

      {/* Pulsing circles - reduced from 5 to 3 */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className="absolute rounded-full border border-green-500/20"
          style={{
            left: `${25 + i * 25}%`,
            top: `${30 + i * 15}%`,
            width: '100px',
            height: '100px',
          }}
          animate={{
            scale: [1, 2, 1],
            opacity: [0.3, 0, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 1.2,
          }}
        />
      ))}

      {/* Data flow lines - reduced from 8 to 4 */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={`flow-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-green-500/30 to-transparent"
          style={{
            top: `${15 + i * 25}%`,
            width: '100%',
          }}
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 10 + i * 2,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 1,
          }}
        />
      ))}

      {/* Code snippet animations - reduced from 4 to 2 */}
      {[...Array(2)].map((_, i) => {
        const codeSnippets = [
          '{ success: true }',
          'const init = () => {}'
        ];

        return (
          <motion.div
            key={`code-${i}`}
            className="absolute font-mono text-green-500/10 text-sm"
            style={{
              left: `${20 + i * 40}%`,
              top: `${25 + i * 25}%`,
            }}
            animate={{
              opacity: [0, 0.3, 0],
              y: [0, -50, -100],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              delay: i * 3,
            }}
          >
            {codeSnippets[i]}
          </motion.div>
        );
      })}
    </div>
  );
}
