import React, { useRef, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface MagneticCardProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export default function MagneticCard({
  children,
  className = '',
  strength = 0.3
}: MagneticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const mouseX = useSpring(0, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(0, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseY, [-100, 100], [10, -10]);
  const rotateY = useTransform(mouseX, [-100, 100], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const offsetX = (e.clientX - centerX) * strength;
    const offsetY = (e.clientY - centerY) * strength;

    mouseX.set(offsetX);
    mouseY.set(offsetY);
  };

  const handleMouseLeave = () => {
    setHovering(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        x: mouseX,
        y: mouseY,
        rotateX: hovering ? rotateX : 0,
        rotateY: hovering ? rotateY : 0,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg opacity-0 blur-xl"
        animate={{
          opacity: hovering ? 0.5 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Card content */}
      <div className="relative" style={{ transform: 'translateZ(20px)' }}>
        {children}
      </div>
    </motion.div>
  );
}
