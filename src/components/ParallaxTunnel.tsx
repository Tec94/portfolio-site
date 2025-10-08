import React, { useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function ParallaxTunnel() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking with debouncing for performance
  useEffect(() => {
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId) cancelAnimationFrame(rafId);

      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 0.5;
        const y = (e.clientY / window.innerHeight - 0.5) * 0.5;
        setMousePosition({ x, y });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Smooth mouse movement with reduced stiffness for performance
  const mouseX = useSpring(mousePosition.x, { stiffness: 30, damping: 25 });
  const mouseY = useSpring(mousePosition.y, { stiffness: 30, damping: 25 });

  // Create concentric layers that pulse from center outward - reduced for performance
  const layers = [
    { depth: 0, size: 80, blur: 0, opacity: 0.7 },
    { depth: 1, size: 160, blur: 1, opacity: 0.55 },
    { depth: 2, size: 280, blur: 2, opacity: 0.4 },
    { depth: 3, size: 450, blur: 3, opacity: 0.25 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Concentric bracket layers pulsing from center */}
      {layers.map((layer, index) => {
        const animationDelay = index * 0.5; // Sequential delay for wave effect

        return (
          <motion.div
            key={index}
            className="absolute top-1/2 left-1/2"
            style={{
              width: `${layer.size}px`,
              height: `${layer.size}px`,
              x: '-50%',
              y: '-50%',
            }}
            animate={{
              scale: [0.3, 1.2, 0.3],
              opacity: [0, layer.opacity, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1], // Custom easing for smoother pulse
              delay: animationDelay,
            }}
          >
            {/* Corner brackets with subtle parallax */}
            <motion.div
              className="absolute inset-0"
              style={{
                filter: `blur(${layer.blur}px)`,
              }}
              animate={{
                x: mouseX.get() * layer.depth * 3,
                y: mouseY.get() * layer.depth * 3,
              }}
              transition={{
                type: 'spring',
                stiffness: 30,
                damping: 25,
              }}
            >
              {/* Top-left bracket */}
              <div
                className="absolute top-0 left-0"
                style={{
                  width: '30%',
                  height: '30%',
                  borderTop: `2px solid rgba(0, 255, 0, ${layer.opacity})`,
                  borderLeft: `2px solid rgba(0, 255, 0, ${layer.opacity})`,
                  boxShadow: `0 0 ${8 - layer.blur}px rgba(0, 255, 0, 0.6)`,
                }}
              />

              {/* Top-right bracket */}
              <div
                className="absolute top-0 right-0"
                style={{
                  width: '30%',
                  height: '30%',
                  borderTop: `2px solid rgba(0, 255, 0, ${layer.opacity})`,
                  borderRight: `2px solid rgba(0, 255, 0, ${layer.opacity})`,
                  boxShadow: `0 0 ${8 - layer.blur}px rgba(0, 255, 0, 0.6)`,
                }}
              />

              {/* Bottom-left bracket */}
              <div
                className="absolute bottom-0 left-0"
                style={{
                  width: '30%',
                  height: '30%',
                  borderBottom: `2px solid rgba(0, 255, 0, ${layer.opacity})`,
                  borderLeft: `2px solid rgba(0, 255, 0, ${layer.opacity})`,
                  boxShadow: `0 0 ${8 - layer.blur}px rgba(0, 255, 0, 0.6)`,
                }}
              />

              {/* Bottom-right bracket */}
              <div
                className="absolute bottom-0 right-0"
                style={{
                  width: '30%',
                  height: '30%',
                  borderBottom: `2px solid rgba(0, 255, 0, ${layer.opacity})`,
                  borderRight: `2px solid rgba(0, 255, 0, ${layer.opacity})`,
                  boxShadow: `0 0 ${8 - layer.blur}px rgba(0, 255, 0, 0.6)`,
                }}
              />

              {/* Center lines forming crosshair */}
              <div
                className="absolute top-1/2 left-0 right-0 h-px -translate-y-1/2"
                style={{
                  background: `linear-gradient(to right, transparent, rgba(0, 255, 0, ${layer.opacity * 0.5}) 50%, transparent)`,
                }}
              />
              <div
                className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
                style={{
                  background: `linear-gradient(to bottom, transparent, rgba(0, 255, 0, ${layer.opacity * 0.5}) 50%, transparent)`,
                }}
              />
            </motion.div>
          </motion.div>
        );
      })}

      {/* Central pulsing core - synchronized with layers */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '60px',
          height: '60px',
        }}
        animate={{
          scale: [0.8, 1.5, 0.8],
          opacity: [0.9, 0.4, 0.9],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
        }}
      >
        <div
          className="w-full h-full rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 0, 0.8) 0%, rgba(0, 255, 0, 0.3) 50%, transparent 70%)',
            boxShadow: '0 0 40px rgba(0, 255, 0, 0.9), inset 0 0 25px rgba(0, 255, 0, 0.7)',
          }}
        />
      </motion.div>

      {/* Radiating grid lines - reduced and optimized */}
      {[...Array(8)].map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;

        return (
          <motion.div
            key={`line-${i}`}
            className="absolute top-1/2 left-1/2 origin-left"
            style={{
              width: '120%',
              height: '1px',
              background: `linear-gradient(to right, rgba(0, 255, 0, 0.6) 0%, rgba(0, 255, 0, 0.3) 30%, transparent 70%)`,
              transform: `rotate(${angle}rad)`,
              filter: 'blur(0.5px)',
            }}
            animate={{
              opacity: [0.3, 0.7, 0.3],
              scaleX: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1],
              delay: i * 0.1,
            }}
          />
        );
      })}

      {/* Expanding rings emanating from center */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`ring-${i}`}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-green-500"
          style={{
            width: '40px',
            height: '40px',
          }}
          animate={{
            scale: [0.5, 8, 0.5],
            opacity: [0.8, 0, 0.8],
            borderWidth: ['2px', '1px', '2px'],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeOut',
            delay: i * 1.3,
          }}
        />
      ))}
    </div>
  );
}
