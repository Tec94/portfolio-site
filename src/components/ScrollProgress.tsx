import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity } from 'framer-motion';

export default function ScrollProgress() {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const { scrollYProgress } = useScroll();

  // Add spring physics for smoother animations
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Detect scroll velocity for dynamic effects
  const yVelocity = useVelocity(scrollYProgress);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      setScrollPercentage(Math.round(latest * 100));
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  useEffect(() => {
    const unsubscribe = yVelocity.on('change', (latest) => {
      setScrollVelocity(Math.abs(latest));
    });
    return () => unsubscribe();
  }, [yVelocity]);

  // Calculate arc height based on scroll progress with spring
  const leftArcHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);
  const rightArcHeight = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  // Particle opacity based on scroll velocity
  const particleOpacity = useTransform(
    smoothProgress,
    [0, 0.5, 1],
    [0.3, 0.8, 0.3]
  );

  return (
    <>
      {/* Left side flat progress bar */}
      <div className="fixed left-0 top-0 bottom-0 w-2 z-40 pointer-events-none">
        {/* Background track */}
        <div className="absolute inset-0 bg-black/60 border-r border-green-900/30" />

        {/* Flat progress bar with subtle glow */}
        <motion.div
          className="absolute left-0 top-0 w-full bg-gradient-to-b from-green-500/80 via-green-400/80 to-green-500/80"
          style={{
            height: leftArcHeight,
            boxShadow: '2px 0 10px rgba(0, 255, 0, 0.3)',
          }}
        >
          {/* Scanning line effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-transparent"
            style={{
              height: '30%',
            }}
            animate={{
              y: ['0%', '250%'],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        </motion.div>

        {/* Horizontal tick marks */}
        {[0, 25, 50, 75, 100].map((mark) => (
          <div
            key={mark}
            className="absolute left-0 w-full h-px bg-green-400/40"
            style={{
              top: `${mark}%`,
            }}
          />
        ))}
      </div>

      {/* Right side - removed, functionality moved to floating indicator */}

      {/* 3D Floating Progress Display */}
      <motion.div
        className="fixed top-1/2 right-8 z-50 pointer-events-none perspective-1000"
        initial={{ opacity: 0, x: 50, rotateY: -45 }}
        animate={{
          opacity: 1,
          x: 0,
          rotateY: scrollVelocity > 0.01 ? -10 : 0,
        }}
        transition={{
          opacity: { delay: 0.5, duration: 0.8 },
          x: { delay: 0.5, duration: 0.8 },
          rotateY: { type: 'spring', stiffness: 200, damping: 25 }
        }}
        style={{
          perspective: '1000px',
        }}
      >
        <motion.div
          className="relative preserve-3d"
          animate={{
            rotateX: scrollVelocity > 0.01 ? [0, 5, 0] : 0,
            y: scrollVelocity > 0.01 ? [0, -5, 0] : 0,
          }}
          transition={{
            duration: 0.6,
            ease: 'easeOut'
          }}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Multiple layered shadows for depth */}
          <div className="absolute inset-0 bg-green-500/30 blur-2xl rounded-xl"
            style={{
              transform: 'translateZ(-20px)',
            }}
          />
          <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-xl"
            style={{
              transform: 'translateZ(-10px)',
            }}
          />

          {/* Main 3D card - more compact */}
          <motion.div
            className="relative w-24 h-28 preserve-3d"
            animate={{
              rotateY: [0, 3, 0, -3, 0],
              scale: scrollVelocity > 0.01 ? [1, 1.05, 1] : 1,
            }}
            transition={{
              rotateY: {
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut'
              },
              scale: {
                duration: 0.4,
              }
            }}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Front face */}
            <div
              className="absolute inset-0 rounded-xl border-2 border-green-500/50 bg-gradient-to-br from-black/95 via-black/90 to-green-950/40 backdrop-blur-md overflow-hidden"
              style={{
                transform: 'translateZ(20px)',
                boxShadow: `
                  0 0 40px rgba(0, 255, 0, 0.4),
                  0 0 80px rgba(0, 255, 0, 0.2),
                  inset 0 0 30px rgba(0, 255, 0, 0.1),
                  inset 0 -20px 40px rgba(0, 0, 0, 0.5)
                `,
              }}
            >
              {/* Scanline effect */}
              <motion.div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, rgba(0, 255, 0, 0.03), rgba(0, 255, 0, 0.03) 2px, transparent 2px, transparent 4px)',
                }}
              />

              {/* Holographic shine */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-green-400/20 via-transparent to-green-600/20"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              />

              {/* Content - more compact */}
              <div className="relative h-full flex flex-col items-center justify-center p-2">
                {/* Status indicator */}
                <div className="flex items-center gap-1 mb-1">
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-green-400"
                    animate={{
                      opacity: [0.5, 1, 0.5],
                      boxShadow: [
                        '0 0 3px rgba(0, 255, 0, 0.5)',
                        '0 0 8px rgba(0, 255, 0, 1)',
                        '0 0 3px rgba(0, 255, 0, 0.5)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                  <span className="text-[8px] text-green-400 font-mono tracking-wider">SCROLL</span>
                </div>

                {/* Main percentage */}
                <motion.div
                  className="text-3xl font-bold text-green-300 font-mono tabular-nums mb-1"
                  animate={{
                    textShadow: scrollVelocity > 0.01
                      ? [
                          '0 0 8px rgba(0, 255, 0, 0.8)',
                          '0 0 20px rgba(0, 255, 0, 1), 0 0 30px rgba(0, 255, 0, 0.5)',
                          '0 0 8px rgba(0, 255, 0, 0.8)',
                        ]
                      : '0 0 8px rgba(0, 255, 0, 0.6)',
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                >
                  {scrollPercentage}
                </motion.div>

                {/* Percentage symbol */}
                <div className="text-[8px] text-green-500/70 font-mono mb-2">%</div>

                {/* Progress bar */}
                <div className="w-full h-0.5 bg-green-900/30 rounded-full overflow-hidden relative">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-full"
                    style={{
                      width: `${scrollPercentage}%`,
                      boxShadow: '0 0 8px rgba(0, 255, 0, 0.8)',
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    style={{
                      width: '30%',
                    }}
                    animate={{
                      x: ['-100%', '300%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />
                </div>

                {/* Data visualization */}
                <div className="flex gap-0.5 mt-2">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-green-500/40 rounded-full"
                      animate={{
                        height: [
                          `${6 + Math.sin(Date.now() / 1000 + i) * 3}px`,
                          `${8 + Math.sin(Date.now() / 1000 + i + Math.PI) * 4}px`,
                          `${6 + Math.sin(Date.now() / 1000 + i) * 3}px`,
                        ],
                      }}
                      transition={{
                        duration: 1 + i * 0.1,
                        repeat: Infinity,
                        delay: i * 0.05,
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Corner accents - smaller */}
              <div className="absolute top-0.5 left-0.5 w-2 h-2 border-l border-t border-green-400/60" />
              <div className="absolute top-0.5 right-0.5 w-2 h-2 border-r border-t border-green-400/60" />
              <div className="absolute bottom-0.5 left-0.5 w-2 h-2 border-l border-b border-green-400/60" />
              <div className="absolute bottom-0.5 right-0.5 w-2 h-2 border-r border-b border-green-400/60" />
            </div>

            {/* Side faces for 3D effect - adjusted for smaller card */}
            <div
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-900/40 to-green-950/60 border-r border-green-500/30"
              style={{
                transform: 'rotateY(90deg) translateZ(12px)',
                width: '24px',
                transformOrigin: 'right',
              }}
            />
            <div
              className="absolute inset-0 rounded-xl bg-gradient-to-b from-green-950/60 to-green-900/40 border-t border-green-500/30"
              style={{
                transform: 'rotateX(90deg) translateZ(14px)',
                height: '28px',
                transformOrigin: 'top',
              }}
            />
          </motion.div>

          {/* Floating particles around the card - reduced from 6 to 3 */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-400 rounded-full"
              style={{
                left: `${50 + Math.cos((i * Math.PI * 2) / 3) * 80}%`,
                top: `${50 + Math.sin((i * Math.PI * 2) / 3) * 80}%`,
                boxShadow: '0 0 6px rgba(0, 255, 0, 0.8)',
              }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.4, 1, 0.4],
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2 + i * 0.3,
                repeat: Infinity,
                delay: i * 0.6,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </>
  );
}
