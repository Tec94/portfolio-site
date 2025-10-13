import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import Star from 'lucide-react/dist/esm/icons/star';
import Award from 'lucide-react/dist/esm/icons/award';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import TerminalTyping from './TerminalTyping';
import BlurReveal from './BlurReveal';

export default function CyberpunkAwards() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const awards = [
    {
      title: "HackUTA Winner",
      organization: "UT Arlington",
      date: "October 2025",
      description: "Built Credify, an AI-powered credit card optimization platform using Google Gemini AI and Plaid API integration",
      icon: Trophy,
      color: 'from-green-400 to-green-600',
      hologramColor: 'rgba(0, 255, 0, 0.3)',
    },
    {
      title: "HackRice 15 Best Use of Auth0 Winner",
      organization: "Rice University",
      date: "September 2025",
      description: "Built CitizenVoice, a civic engagement platform with voting and proposal features, winning the Best Use of Auth0 prize",
      icon: Award,
      color: 'from-green-400 to-green-600',
      hologramColor: 'rgba(0, 255, 0, 0.3)',
    },
    {
      title: "Cryptocurrency Project Success",
      organization: "Independent Project",
      date: "January 2025",
      description: "Generated over $2,000,000 in peak trading volume with 20% daily growth rate",
      icon: Star,
      color: 'from-green-500 to-green-700',
      hologramColor: 'rgba(0, 255, 100, 0.3)',
    },
  ];

  return (
    <section id="awards" className="py-20 relative overflow-hidden">

      {/* Holographic grid background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(0deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Floating particles - reduced from 15 to 8, hidden on mobile for performance */}
      <div className="hidden md:block">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-green-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 flex flex-col items-center">
          <div className="inline-block mb-4 relative">
            <Award className="h-16 w-16 text-green-400 mx-auto"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(0, 255, 0, 0.6))',
              }}
            />
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Award className="h-16 w-16 text-green-400" />
            </motion.div>
          </div>

          <TerminalTyping text="Achievements Unlocked" className="mb-4" />
          <p className="text-green-300 max-w-2xl mx-auto font-mono mt-4">
            <span className="text-green-500">{'> '}</span>
            Milestones and recognition earned through innovation and dedication
          </p>

          {/* Achievement Counter */}
          <motion.div
            className="mt-6 inline-flex items-center gap-3 px-6 py-3 border-2 border-green-500/40 rounded-lg bg-green-500/10"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{
              boxShadow: '0 0 20px rgba(0, 255, 0, 0.3), inset 0 0 20px rgba(0, 255, 0, 0.1)',
            }}
          >
            <Sparkles className="h-5 w-5 text-green-400" />
            <div className="font-mono">
              <span className="text-2xl font-bold text-green-300">{awards.length}</span>
              <span className="text-sm text-green-400 ml-2">Achievements</span>
            </div>
          </motion.div>
        </div>

        {/* Holographic achievement cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {awards.map((award, index) => {
            const IconComponent = award.icon;
            const isHovered = hoveredIndex === index;

            return (
              <motion.div
                key={index}
                className="relative h-full"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Holographic glow effect */}
                <motion.div
                  className="absolute -inset-1 rounded-lg opacity-0"
                  animate={{
                    opacity: isHovered ? 0.6 : 0,
                  }}
                  style={{
                    background: `radial-gradient(circle at center, ${award.hologramColor}, transparent)`,
                    filter: 'blur(20px)',
                  }}
                />

                {/* Main card */}
                <motion.div
                  className="relative h-full border-2 border-green-500/40 rounded-lg overflow-hidden bg-black/70 backdrop-blur-sm flex flex-col"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{
                    boxShadow: isHovered
                      ? '0 0 40px rgba(0, 255, 0, 0.4), inset 0 0 40px rgba(0, 255, 0, 0.1)'
                      : '0 0 20px rgba(0, 255, 0, 0.2), inset 0 0 20px rgba(0, 255, 0, 0.05)',
                  }}
                >
                  {/* Holographic scan line effect */}
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: 'linear-gradient(180deg, transparent, rgba(0, 255, 0, 0.1), transparent)',
                      height: '30%',
                    }}
                    animate={{
                      y: ['0%', '300%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  />

                  <div className="p-4 relative z-10">
                    {/* Icon and sparkle effect */}
                    <div className="flex items-start gap-4 mb-4">
                      <motion.div
                        className="relative p-4 border border-green-500/40 rounded-lg bg-green-500/10"
                        animate={isHovered ? {
                          rotate: [0, 5, -5, 0],
                        } : {}}
                        transition={{ duration: 0.5 }}
                        style={{
                          boxShadow: '0 0 20px rgba(0, 255, 0, 0.3)',
                        }}
                      >
                        <IconComponent className="h-8 w-8 text-green-400" />

                        {/* Sparkles - only on desktop for performance */}
                        {isHovered && (
                          <div className="hidden md:block">
                            {[...Array(4)].map((_, i) => (
                              <motion.div
                                key={i}
                                className="absolute"
                                style={{
                                  top: '50%',
                                  left: '50%',
                                }}
                                initial={{ scale: 0, opacity: 1 }}
                                animate={{
                                  scale: 2,
                                  opacity: 0,
                                  x: Math.cos((i * Math.PI) / 2) * 30,
                                  y: Math.sin((i * Math.PI) / 2) * 30,
                                }}
                                transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 0.4 }}
                              >
                                <Sparkles className="h-3 w-3 text-green-400" />
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </motion.div>

                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-green-300 font-mono mb-1"
                          style={{
                            textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                          }}
                        >
                          {award.title}
                        </h3>
                        <p className="text-green-400 font-mono text-sm mb-1">{award.organization}</p>
                        <p className="text-green-500/70 font-mono text-xs">{award.date}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-green-300 font-mono text-sm leading-relaxed mb-4">
                      {award.description}
                    </p>

                    {/* Holographic data strip */}
                    <div className="flex items-center justify-between pt-4 border-t border-green-500/20">
                      <div className="flex gap-1">
                        {[...Array(12)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-green-500/40 rounded-full"
                            style={{ height: `${Math.random() * 20 + 10}px` }}
                            animate={{
                              height: isHovered ? `${Math.random() * 20 + 10}px` : `${Math.random() * 20 + 10}px`,
                            }}
                            transition={{ duration: 0.3, delay: i * 0.05 }}
                          />
                        ))}
                      </div>

                      <div className="text-xs font-mono text-green-500/70">
                        STATUS: <span className="text-green-400">VERIFIED</span>
                      </div>
                    </div>
                  </div>

                  {/* Corner brackets */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-green-500" />
                  <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-green-500" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-green-500" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-green-500" />
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
