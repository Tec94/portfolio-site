import React from 'react';
import { motion } from 'framer-motion';
import MagneticCard from './MagneticCard';
import BlurReveal from './BlurReveal';
import CircuitBoard from './CircuitBoard';
import TerminalTyping from './TerminalTyping';

export default function Experience() {
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
    <section id="experience" className="py-20 relative overflow-hidden">
      {/* Animated Circuit Board Background */}
      <CircuitBoard />

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
              <MagneticCard className="mb-8" strength={0.2}>
                <div className="relative p-6 border-2 border-green-500/40 rounded-lg bg-black/70 backdrop-blur-sm overflow-hidden"
                  style={{
                    boxShadow: '0 0 30px rgba(0, 255, 0, 0.2), inset 0 0 30px rgba(0, 255, 0, 0.05)',
                  }}
                >
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
              </MagneticCard>
            </BlurReveal>
          ))}
        </motion.div>
      </div>
    </section>
  );
}