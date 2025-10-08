import React from 'react';
import { motion } from 'framer-motion';

interface BlurRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}

export default function BlurReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.8
}: BlurRevealProps) {
  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        filter: 'blur(10px)',
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        filter: 'blur(0px)',
        y: 0,
      }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
