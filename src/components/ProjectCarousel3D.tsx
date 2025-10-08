import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, ChevronLeft, ChevronRight } from 'lucide-react';

interface Project {
  title: string;
  tech: string;
  period: string;
  description: string[];
  github: string;
}

interface ProjectCarousel3DProps {
  projects: Project[];
}

export default function ProjectCarousel3D({ projects }: ProjectCarousel3DProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    if (!isAutoPlay) return;

    const interval = setInterval(() => {
      nextProject();
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, activeIndex]);

  const getCardPosition = (index: number) => {
    const diff = (index - activeIndex + projects.length) % projects.length;
    const totalCards = projects.length;

    if (diff === 0) {
      // Active card - center front
      return {
        x: 0,
        y: 0,
        z: 0,
        rotateY: 0,
        scale: 1,
        opacity: 1,
        zIndex: 20,
      };
    }

    // Calculate circular position for background cards - centered arc
    // Distribute cards evenly in a semicircle behind the active card
    const backgroundCards = totalCards - 1;
    const cardIndex = diff - 1; // 0 to (backgroundCards - 1)

    // Center the arc: -120 to +120 degrees for wider spread
    const startAngle = -120;
    const endAngle = 120;
    const angle = startAngle + (cardIndex / (backgroundCards - 1)) * (endAngle - startAngle);

    const radius = 600; // Increased for better readability
    const depth = -400; // Deeper for more dramatic 3D effect

    return {
      x: Math.sin((angle * Math.PI) / 180) * radius,
      y: 0,
      z: depth,
      rotateY: -angle * 0.3, // Reduced rotation for better readability
      scale: 0.75,
      opacity: 0.6,
      zIndex: 1,
    };
  };

  const nextProject = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % projects.length);
  };

  const prevProject = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const goToProject = (index: number) => {
    setDirection(index > activeIndex ? 1 : -1);
    setActiveIndex(index);
    setIsAutoPlay(false);
  };

  return (
    <div
      className="relative w-full h-[700px] md:h-[700px] sm:h-[600px] flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
      style={{ perspective: '2000px' }}
    >
      {/* 3D Card Container */}
      <div className="relative w-full h-full flex items-center justify-center preserve-3d">
        <AnimatePresence mode="sync">
          {projects.map((project, index) => {
            const position = getCardPosition(index);
            const isActive = index === activeIndex;

            return (
              <motion.div
                key={index}
                className="absolute preserve-3d"
                initial={false}
                animate={{
                  x: position.x,
                  y: position.y,
                  z: position.z,
                  rotateY: position.rotateY,
                  scale: position.scale,
                  opacity: position.opacity,
                  zIndex: position.zIndex,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 80,
                  damping: 25,
                  mass: 1,
                }}
                onClick={() => !isActive && goToProject(index)}
                style={{
                  transformStyle: 'preserve-3d',
                  cursor: isActive ? 'default' : 'pointer',
                }}
              >
                <motion.div
                  className={`w-[90vw] max-w-[450px] sm:w-[400px] md:w-[450px] min-h-[400px] card relative ${!isActive ? 'cursor-pointer' : ''}`}
                  whileHover={!isActive ? { scale: 0.75, z: -250 } : {}}
                >
                  {/* Card Content */}
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold dark:text-white mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{project.period}</p>
                      </div>
                      {isActive && (
                        <motion.a
                          href="#"
                          className="text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800/30 rounded-lg"
                          initial={{ opacity: 0, scale: 0, rotate: -180 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                          whileHover={{ scale: 1.1, rotate: 360 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Github className="h-6 w-6" />
                        </motion.a>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 font-medium border-l-4 border-slate-500 pl-3">
                      {project.tech}
                    </p>

                    {isActive && (
                      <motion.ul
                        className="space-y-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        {project.description.map((desc, i) => (
                          <motion.li
                            key={i}
                            className="flex items-start text-gray-600 dark:text-gray-300 text-sm"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                          >
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-600 dark:bg-slate-400 mt-1.5 mr-3 flex-shrink-0" />
                            <span>{desc}</span>
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}

                    {!isActive && (
                      <div className="text-center py-8">
                        <p className="text-gray-400 dark:text-gray-500 text-sm">Click to view details</p>
                      </div>
                    )}
                  </div>

                  {/* Card Background Glow */}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-slate-500/10 via-slate-600/10 to-transparent rounded-2xl -z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <motion.button
        onClick={prevProject}
        className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-xl backdrop-blur-sm hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Previous project"
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800 dark:text-gray-200" />
      </motion.button>

      <motion.button
        onClick={nextProject}
        className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 z-30 p-3 sm:p-4 rounded-full bg-white/90 dark:bg-gray-800/90 shadow-xl backdrop-blur-sm hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Next project"
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-gray-800 dark:text-gray-200" />
      </motion.button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-30">
        {projects.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToProject(index)}
            className={`rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'w-12 h-3 bg-slate-700 dark:bg-slate-300'
                : 'w-3 h-3 bg-gray-400 dark:bg-gray-600 hover:bg-gray-500'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>

      {/* Project Counter */}
      <motion.div
        className="absolute top-8 right-8 z-30 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
          {activeIndex + 1} / {projects.length}
        </span>
      </motion.div>
    </div>
  );
}
