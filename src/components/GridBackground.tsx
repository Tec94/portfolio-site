import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useIsMobile } from '../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

export default function GridBackground() {
  const { scrollYProgress } = useScroll();
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();

  // Parallax transformations based on scroll - disabled on mobile if prefers reduced motion
  const shouldDisableParallax = isMobile && prefersReducedMotion;
  const gridY = useTransform(scrollYProgress, [0, 1], shouldDisableParallax ? ['200px', '200px'] : ['200px', '400px']);
  const gridOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.1, 0.15, 0.15, 0.1]);
  const horizonY = useTransform(scrollYProgress, [0, 1], shouldDisableParallax ? ['50%', '50%'] : ['50%', '60%']);

  // Create all line transforms at the top level (hooks cannot be called in loops)
  const lineTransforms = [
    useTransform(scrollYProgress, [0, 1], ['20%', '25%']),
    useTransform(scrollYProgress, [0, 1], ['35%', '40%']),
    useTransform(scrollYProgress, [0, 1], ['50%', '55%']),
    useTransform(scrollYProgress, [0, 1], ['65%', '70%']),
    useTransform(scrollYProgress, [0, 1], ['80%', '85%']),
  ];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Tron-style grid floor with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px),
            linear-gradient(0deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: isMobile ? '80px 80px' : '50px 50px', // Larger grid on mobile = fewer lines
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center top',
          y: gridY,
          opacity: gridOpacity,
        }}
      />

      {/* Glowing horizon line with parallax */}
      <motion.div
        className="absolute left-0 right-0"
        style={{
          top: horizonY,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #00ff00, transparent)',
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.8)',
        }}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Animated grid lines with parallax */}
      {lineTransforms.map((lineY, i) => (
        <motion.div
          key={i}
          className="absolute left-0 right-0"
          style={{
            top: lineY,
            height: '1px',
            background: 'rgba(0, 255, 0, 0.2)',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      ))}

      {/* Corner accents with subtle glow animation - reduced size on mobile */}
      {!isMobile && (
        <>
          <motion.div
            className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-green-500"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
            }}
          />
          <motion.div
            className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-green-500"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
            style={{
              boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
            }}
          />
          <motion.div
            className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-green-500"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
            style={{
              boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
            }}
          />
          <motion.div
            className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-green-500"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.5,
            }}
            style={{
              boxShadow: '0 0 10px rgba(0, 255, 0, 0.3)',
            }}
          />
        </>
      )}
    </div>
  );
}
