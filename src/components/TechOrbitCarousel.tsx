import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface TechOrbitCarouselProps {
  skills: {
    title: string;
    skills: string[];
  }[];
}

export default function TechOrbitCarousel({ skills }: TechOrbitCarouselProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [focusedCategory, setFocusedCategory] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten all skills with proper indexing
  const allSkills = skills.flatMap((category, catIndex) =>
    category.skills.map((skill) => ({
      name: skill,
      category: category.title,
      categoryIndex: catIndex,
    }))
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        setMousePosition({
          x: (e.clientX - centerX) / 30,
          y: (e.clientY - centerY) / 30,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const getOrbitPosition = (index: number, total: number) => {
    // Evenly distribute items around circle
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2; // Start from top
    const radius = 220; // Fixed radius for even distribution

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      angle: angle,
    };
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600px] flex items-center justify-center"
      style={{ perspective: '1500px' }}
    >
      {/* Central Tech Stack Text */}
      <motion.div
        className="absolute z-20"
        animate={{
          x: mousePosition.x * 0.3,
          y: mousePosition.y * 0.3,
        }}
        transition={{ type: 'spring', stiffness: 50, damping: 15 }}
      >
        <h3 className="text-5xl font-bold bg-gradient-to-r from-slate-700 via-slate-900 to-slate-700 dark:from-slate-200 dark:via-white dark:to-slate-200 bg-clip-text text-transparent">
          Tech Stack
        </h3>
      </motion.div>

      {/* Orbiting Skills */}
      {allSkills.map((skill, index) => {
        const position = getOrbitPosition(index, allSkills.length);
        const isFocused = focusedCategory === skill.categoryIndex;
        const isOtherFocused = focusedCategory !== null && focusedCategory !== skill.categoryIndex;

        return (
          <motion.div
            key={`${skill.categoryIndex}-${skill.name}`}
            className="absolute"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              x: position.x + mousePosition.x * (0.8 + skill.categoryIndex * 0.2),
              y: position.y + mousePosition.y * (0.8 + skill.categoryIndex * 0.2),
              opacity: isOtherFocused ? 0.3 : 1,
              scale: isFocused ? 1.2 : isOtherFocused ? 0.85 : 1,
            }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{
              x: { type: 'spring', stiffness: 40, damping: 20 },
              y: { type: 'spring', stiffness: 40, damping: 20 },
              opacity: { duration: 0.3 },
              scale: { type: 'spring', stiffness: 200, damping: 15 },
              delay: index * 0.03,
            }}
            whileHover={{
              scale: 1.25,
              zIndex: 50,
              transition: { type: 'spring', stiffness: 300, damping: 20 }
            }}
            onClick={() => setFocusedCategory(focusedCategory === skill.categoryIndex ? null : skill.categoryIndex)}
          >
            <motion.div
              className={`
                px-4 py-2 rounded-full cursor-pointer
                ${getCategoryColor(skill.categoryIndex)}
                backdrop-blur-sm shadow-lg
                hover:shadow-2xl transition-shadow duration-300
                whitespace-nowrap
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-sm font-medium text-white">
                {skill.name}
              </span>
            </motion.div>

            {/* Connection line to center on focus */}
            {isFocused && (
              <motion.div
                className="absolute top-1/2 left-1/2 origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                style={{
                  width: Math.sqrt(position.x ** 2 + position.y ** 2) + 'px',
                  height: '2px',
                  background: 'linear-gradient(to right, rgba(139, 92, 246, 0.6), transparent)',
                  transform: `rotate(${Math.atan2(-position.y, -position.x)}rad)`,
                  transformOrigin: 'left center',
                }}
              />
            )}
          </motion.div>
        );
      })}

      {/* Category Legend */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-wrap gap-3 justify-center max-w-xl">
        {skills.map((category, index) => (
          <motion.button
            key={index}
            onClick={() => setFocusedCategory(focusedCategory === index ? null : index)}
            className={`
              px-5 py-2 rounded-full text-sm font-medium transition-all duration-300
              ${getCategoryColor(index)}
              ${focusedCategory === index ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900 scale-110' : ''}
              ${focusedCategory !== null && focusedCategory !== index ? 'opacity-40' : ''}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.title}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function getCategoryColor(index: number): string {
  const colors = [
    'bg-slate-600 hover:bg-slate-700 dark:bg-slate-500 dark:hover:bg-slate-400',
    'bg-slate-700 hover:bg-slate-800 dark:bg-slate-400 dark:hover:bg-slate-300',
    'bg-slate-500 hover:bg-slate-600 dark:bg-slate-600 dark:hover:bg-slate-500',
    'bg-slate-800 hover:bg-slate-900 dark:bg-slate-300 dark:hover:bg-slate-200',
  ];
  return colors[index % colors.length];
}
