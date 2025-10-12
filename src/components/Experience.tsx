import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BlurReveal from './BlurReveal';
import TerminalTyping from './TerminalTyping';
import CardParticleEffect from './CardParticleEffect';

// Timeline dot component
const TimelineDot = ({ isFirst }: { isFirst: boolean }) => (
  <div className="absolute left-[-48px] top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center">
    <motion.div
      className={`rounded-full border-2 border-green-400 bg-black ${
        isFirst ? 'w-4 h-4' : 'w-3 h-3'
      }`}
      style={{
        boxShadow: isFirst
          ? '0 0 15px rgba(0, 255, 0, 0.8), inset 0 0 5px rgba(0, 255, 0, 0.5)'
          : '0 0 10px rgba(0, 255, 0, 0.6)'
      }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.3, type: 'spring' }}
    />
  </div>
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

  const itemVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="experience" className="py-20 relative">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 flex flex-col items-center">
          <TerminalTyping text="Experience" className="mb-4" />
          <p className="text-green-300 max-w-2xl mx-auto font-mono mt-4">
            <span className="text-green-500">{'> '}</span>
            Professional journey and technical contributions
          </p>
        </div>
        <motion.div
          className="space-y-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {experiences.map((exp, index) => (
            <BlurReveal key={index} delay={index * 0.1}>
              <div className="relative md:ml-16">
                {/* Vertical line connecting dots (except for last item) */}
                {index < experiences.length - 1 && (
                  <div
                    className="absolute left-[-48px] top-1/2 w-0.5 bg-green-500/30 hidden md:block"
                    style={{
                      height: 'calc(100% + 3rem)',
                      boxShadow: '0 0 5px rgba(0, 255, 0, 0.3)'
                    }}
                  />
                )}

                <motion.div
                  className="mb-8 relative"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  whileHover={{
                    boxShadow: '0 0 40px rgba(0, 255, 0, 0.25), inset 0 0 40px rgba(0, 255, 0, 0.08)',
                  }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Timeline dot */}
                  <TimelineDot isFirst={index === 0} />
                  <div
                    className="relative p-6 border-2 border-green-500/40 rounded-lg bg-black/70 backdrop-blur-sm overflow-hidden"
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

                  <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
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
                    <div className="md:text-right">
                      <p className="text-green-400 font-mono text-sm">{exp.location}</p>
                      <p className="text-xs text-green-500/70 font-mono">{exp.period}</p>
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
    </section>
  );
}