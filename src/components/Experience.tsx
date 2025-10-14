import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BlurReveal from './BlurReveal';
import TerminalTyping from './TerminalTyping';
import CardParticleEffect from './CardParticleEffect';

// Timeline dot component
const TimelineDot = ({ isFirst, isHovered }: { isFirst: boolean; isHovered: boolean }) => (
  <motion.div
    className={`rounded-full border-2 border-green-400 bg-black z-10 relative ${
      isFirst ? 'w-4 h-4' : 'w-3 h-3'
    }`}
    style={{
      boxShadow: isFirst
        ? '0 0 15px rgba(0, 255, 0, 0.8), inset 0 0 5px rgba(0, 255, 0, 0.5)'
        : '0 0 10px rgba(0, 255, 0, 0.6)'
    }}
    initial={{ scale: 0 }}
    animate={{
      scale: isHovered ? 1.2 : 1,
      boxShadow: isHovered
        ? '0 0 20px rgba(0, 255, 0, 1), inset 0 0 8px rgba(0, 255, 0, 0.8)'
        : isFirst
          ? '0 0 15px rgba(0, 255, 0, 0.8), inset 0 0 5px rgba(0, 255, 0, 0.5)'
          : '0 0 10px rgba(0, 255, 0, 0.6)'
    }}
    transition={{ duration: 0, type: 'tween' }}
  />
);

export default function Experience() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const experiences = [
    {
      company: "QT-Data Group",
      role: "Web Development Intern",
      location: "Ho Chi Minh, Vietnam",
      period: "June 2025 - August 2025",
      description: [
        "Engineered a Python data pipeline for profiling Gen Z billionaires using BeautifulSoup and Selenium",
        "Scheduled ingestion and QA checks to keep datasets current and deduplicated; implemented pagination and rate limiting; normalized/validated records for downstream analysis",
        "Automated YouTube script generation, narration, and thumbnail prompting with LLM-driven agents via REST APIs orchestrated in Python, reducing end-to-end production time by 70%"
      ]
    },
    {
      company: "Portlogics JSC",
      role: "Intern",
      location: "Ho Chi Minh, Vietnam",
      period: "June 2023 - August 2023",
      description: [
        "Rebuilt dashboard UI in React with reusable components and accessibility-minded patterns (keyboard focus, ARIA roles); reduced user error by 19% from QA reports",
        "Integrated REST endpoints with fetch/Axios, added client-side validation and error boundaries; streamlined object-recognition workflows and improved detection accuracy by 35% through clearer labeling and review flows"
      ]
    },
    {
      company: "Hotel Link Solutions",
      role: "Back-end Engineering Intern",
      location: "Remote",
      period: "September 2022 - December 2022",
      description: [
        "Profiled performance with Lighthouse and optimized Core Web Vitals by adding image lazy-loading, responsive srcset, code-splitting, and HTTP caching/CDN tuning—contributing to a 10% lift in checkout rate",
        "Reduced page payloads and tightened API responses via payload-size improvements and refined UX flows, yielding a 20% improvement in user task efficiency"
      ]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <section id="experience" className="py-16 md:py-20 relative">
      {/* Diagonal grid pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(45deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px),
              linear-gradient(-45deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 flex flex-col items-center">
          <TerminalTyping text="Experience" className="mb-4" />
          <p className="text-green-300 max-w-2xl mx-auto font-mono mt-4">
            <span className="text-green-500">{'> '}</span>
            Professional journey and technical contributions
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <motion.div
            className="space-y-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {experiences.map((exp, index) => (
              <BlurReveal key={index} delay={0.6 + (index * 0.2)}>
                <div className="relative">
                  {/* Timeline structure - hidden on mobile, visible on md+ */}
                  <div className="hidden md:grid md:grid-cols-[1fr_auto_2fr] md:gap-8 items-start">
                    {/* Left column: Role and Date */}
                    <motion.div
                      className="text-right pt-4"
                      initial={{ opacity: 0, x: -30 }}
                      animate={{
                        opacity: hoveredCard === index ? 1 : 0.8,
                        x: 0
                      }}
                      transition={{
                        opacity: { duration: 0 },
                        x: { delay: 0.6 + (index * 0.2), duration: 0.5 }
                      }}
                    >
                      <h4 className="text-green-300 font-mono font-semibold text-xl mb-1"
                        style={{
                          textShadow: hoveredCard === index ? '0 0 10px rgba(0, 255, 0, 0.6)' : 'none',
                          transition: 'text-shadow 0s'
                        }}
                      >
                        {exp.role}
                      </h4>
                      <p className="text-green-400/70 font-mono text-sm">
                        {exp.period}
                      </p>
                    </motion.div>

                    {/* Center: Timeline dot and connecting line */}
                    <div className="relative flex flex-col items-center pt-4">
                      <TimelineDot isFirst={index === 0} isHovered={hoveredCard === index} />

                      {/* Vertical line connecting to next dot */}
                      {index < experiences.length - 1 && (
                        <motion.div
                          className="absolute bg-green-500/30"
                          style={{
                            width: '2px',
                            // Start from center of current dot (pt-4 = 1rem + half dot height)
                            top: index === 0 ? 'calc(1rem + 0.5rem)' : 'calc(1rem + 0.375rem)',
                            // Height: measured to reach center of next dot accounting for varying card content heights
                            height: index === 0 ? '22rem' : '19rem',
                            // Center the 2px line (50% - 1px for the 2px width)
                            left: 'calc(50% - 1px)',
                            boxShadow: '0 0 5px rgba(0, 255, 0, 0.3)'
                          }}
                          initial={{ scaleY: 0, opacity: 0, transformOrigin: 'top' }}
                          animate={{ scaleY: 1, opacity: 1 }}
                          transition={{
                            delay: 0.5 + (index * 0.1),
                            duration: 0.4,
                            ease: 'easeOut'
                          }}
                        />
                      )}
                    </div>

                    {/* Right column: Experience card */}
                    <motion.div
                      className="relative"
                      onMouseEnter={() => setHoveredCard(index)}
                      onMouseLeave={() => setHoveredCard(null)}
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + (index * 0.2), duration: 0.5 }}
                      whileHover={{
                        boxShadow: '0 0 40px rgba(0, 255, 0, 0.25), inset 0 0 40px rgba(0, 255, 0, 0.08)',
                      }}
                      style={{
                        transition: 'box-shadow 0s'
                      }}
                    >
                      <div
                        className="relative p-4 border-2 border-green-500/40 rounded-lg bg-black/70 backdrop-blur-sm overflow-hidden"
                        style={{
                          boxShadow: '0 0 30px rgba(0, 255, 0, 0.2), inset 0 0 30px rgba(0, 255, 0, 0.05)',
                        }}
                      >
                        {/* Particle gathering effect */}
                        <CardParticleEffect isHovered={hoveredCard === index} />

                        {/* Scanning line effect on hover */}
                        {hoveredCard === index && (
                          <motion.div
                            className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"
                            initial={{ top: 0, opacity: 0 }}
                            animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            style={{
                              boxShadow: '0 0 10px rgba(0, 255, 0, 0.8)',
                            }}
                          />
                        )}

                        {/* Corner brackets */}
                        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-green-500" />
                        <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-green-500" />
                        <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-green-500" />
                        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-green-500" />

                        {/* Company name and location */}
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-green-300 font-mono mb-1"
                            style={{
                              textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                            }}
                          >
                            {exp.company}
                          </h3>
                          <p className="text-green-400/80 font-mono text-sm">{exp.location}</p>
                        </div>

                        {/* Description bullets */}
                        <ul className="list-none text-green-300 space-y-3 font-mono text-sm">
                          {exp.description.map((desc, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1 flex-shrink-0">▸</span>
                              <span className="leading-relaxed">{desc}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </div>

                  {/* Mobile layout - stacked vertically */}
                  <motion.div
                    className="md:hidden"
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    whileHover={{
                      boxShadow: '0 0 40px rgba(0, 255, 0, 0.25), inset 0 0 40px rgba(0, 255, 0, 0.08)',
                    }}
                    style={{
                      transition: 'box-shadow 0s'
                    }}
                  >
                    <div
                      className="relative p-4 border-2 border-green-500/40 rounded-lg bg-black/70 backdrop-blur-sm overflow-hidden"
                      style={{
                        boxShadow: '0 0 30px rgba(0, 255, 0, 0.2), inset 0 0 30px rgba(0, 255, 0, 0.05)',
                      }}
                    >
                      {/* Particle gathering effect */}
                      <CardParticleEffect isHovered={hoveredCard === index} />

                      {/* Scanning line effect on hover */}
                      {hoveredCard === index && (
                        <motion.div
                          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"
                          initial={{ top: 0, opacity: 0 }}
                          animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                          style={{
                            boxShadow: '0 0 10px rgba(0, 255, 0, 0.8)',
                          }}
                          />
                      )}

                      {/* Corner brackets */}
                      <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-green-500" />
                      <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-green-500" />
                      <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-green-500" />
                      <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-green-500" />

                      <div className="flex flex-col gap-2 mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-green-300 font-mono"
                            style={{
                              textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                            }}
                          >
                            {exp.company}
                          </h3>
                          <p className="text-green-400 font-mono text-sm">{exp.role}</p>
                        </div>
                        <div>
                          <p className="text-green-400 font-mono text-sm">{exp.location}</p>
                          <p className="text-sm text-green-500/70 font-mono">{exp.period}</p>
                        </div>
                      </div>

                      <ul className="list-none text-green-300 space-y-3 font-mono text-sm">
                        {exp.description.map((desc, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-green-500 mt-1 flex-shrink-0">▸</span>
                            <span className="leading-relaxed">{desc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                </div>
              </BlurReveal>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
