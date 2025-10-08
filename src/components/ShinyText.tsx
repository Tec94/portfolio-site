import React from 'react';
import { motion } from 'framer-motion';

interface ShinyTextProps {
  text: string;
  className?: string;
}

export default function ShinyText({ text, className = '' }: ShinyTextProps) {
  return (
    <motion.div
      className={`relative inline-block ${className}`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <motion.span
        className="relative bg-gradient-to-r from-green-400 via-green-500 to-green-300 bg-clip-text text-transparent bg-[length:200%_100%] font-mono"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundSize: '200% 100%',
          filter: 'drop-shadow(0 0 20px rgba(0, 255, 0, 0.6))',
        }}
      >
        {text}
      </motion.span>

      {/* Shine overlay effect - green glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-green-400/40 to-transparent"
        style={{
          backgroundSize: '200% 100%',
          mixBlendMode: 'overlay',
        }}
        animate={{
          backgroundPosition: ['-200% 0', '200% 0'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
}
