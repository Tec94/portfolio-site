import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import Code from 'lucide-react/dist/esm/icons/code';
import Zap from 'lucide-react/dist/esm/icons/zap';
import Award from 'lucide-react/dist/esm/icons/award';
import TerminalTyping from './TerminalTyping';
import BlurReveal from './BlurReveal';
import { useFlags } from '../hooks/useFlags';

export default function Achievements() {
  const { trackSectionView } = useFlags();

  useEffect(() => {
    trackSectionView('achievements');
  }, [trackSectionView]);

  const achievements = [
    {
      icon: Trophy,
      category: 'Hackathon Wins',
      title: 'HackUTA 2024 - Best Use of AI',
      description: 'Built AI-powered project management tool with real-time collaboration features',
      metric: '1st Place',
      color: 'cyan'
    },
    {
      icon: Code,
      category: 'This Portfolio Site',
      title: 'Performance & Accessibility',
      description: 'Built with React, TypeScript, Framer Motion. Optimized for speed and a11y',
      metric: '95+ Lighthouse',
      color: 'green'
    },
    {
      icon: TrendingUp,
      category: 'Project Impact',
      title: 'Open Source Contributions',
      description: 'Active contributor to React and TypeScript ecosystems',
      metric: '500+ GitHub Stars',
      color: 'cyan'
    },
    {
      icon: Award,
      category: 'Academic Excellence',
      title: 'Computer Science - UT Dallas',
      description: 'Dean\'s List, Advanced coursework in algorithms, ML, and systems design',
      metric: '3.8 GPA',
      color: 'green'
    },
    {
      icon: Zap,
      category: 'Development Speed',
      title: 'Rapid Prototyping',
      description: 'Full-stack applications from concept to deployment in under 48 hours',
      metric: '< 2 Days',
      color: 'cyan'
    }
  ];

  return (
    <section id="achievements" className="py-20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px),
              linear-gradient(0deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 flex flex-col items-center">
          <TerminalTyping text="Achievements & Impact" className="mb-4" />
          <p className="text-green-300 max-w-2xl mx-auto font-mono mt-4">
            <span className="text-green-500">{'> '}</span>
            Measurable results and recognized accomplishments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement, index) => (
            <BlurReveal key={index} delay={index * 0.1}>
              <motion.div
                className="h-full p-6 border-2 border-green-500/40 rounded-lg bg-black/70 backdrop-blur-sm relative overflow-hidden group"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                style={{
                  boxShadow: '0 0 20px rgba(0, 255, 0, 0.15)',
                }}
              >
                {/* Corner brackets */}
                <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-green-500" />
                <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-green-500" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-green-500" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-green-500" />

                {/* Hover glow effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    achievement.color === 'cyan'
                      ? 'from-cyan-500/10 to-transparent'
                      : 'from-green-500/10 to-transparent'
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                />

                {/* Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 ${
                      achievement.color === 'cyan'
                        ? 'bg-cyan-500/10 border-cyan-500/30'
                        : 'bg-green-500/10 border-green-500/30'
                    } border rounded-lg relative z-10`}
                  >
                    <achievement.icon
                      className={`h-6 w-6 ${
                        achievement.color === 'cyan' ? 'text-cyan-400' : 'text-green-400'
                      }`}
                    />
                  </div>

                  {/* Metric badge */}
                  <div
                    className={`px-3 py-1 ${
                      achievement.color === 'cyan'
                        ? 'bg-cyan-500/20 border-cyan-400/40'
                        : 'bg-green-500/20 border-green-400/40'
                    } border rounded-full relative z-10`}
                    style={{
                      boxShadow: achievement.color === 'cyan'
                        ? '0 0 10px rgba(34, 211, 238, 0.3)'
                        : '0 0 10px rgba(0, 255, 0, 0.3)',
                    }}
                  >
                    <span
                      className={`font-mono text-xs font-bold ${
                        achievement.color === 'cyan' ? 'text-cyan-300' : 'text-green-300'
                      }`}
                    >
                      {achievement.metric}
                    </span>
                  </div>
                </div>

                {/* Category */}
                <p
                  className={`text-xs font-mono mb-2 ${
                    achievement.color === 'cyan' ? 'text-cyan-400/80' : 'text-green-400/80'
                  }`}
                >
                  {achievement.category}
                </p>

                {/* Title */}
                <h3 className="text-lg font-bold text-green-300 font-mono mb-3 leading-tight">
                  {achievement.title}
                </h3>

                {/* Description */}
                <p className="text-green-400/90 font-mono text-sm leading-relaxed">
                  {achievement.description}
                </p>

                {/* Bottom accent line */}
                <motion.div
                  className={`absolute bottom-0 left-0 right-0 h-1 ${
                    achievement.color === 'cyan'
                      ? 'bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent'
                      : 'bg-gradient-to-r from-transparent via-green-400/50 to-transparent'
                  } opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  style={{
                    boxShadow: achievement.color === 'cyan'
                      ? '0 0 10px rgba(34, 211, 238, 0.5)'
                      : '0 0 10px rgba(0, 255, 0, 0.5)',
                  }}
                />
              </motion.div>
            </BlurReveal>
          ))}
        </div>

        {/* Call to action */}
        <BlurReveal delay={0.5}>
          <div className="mt-12 text-center">
            <p className="text-green-300/80 font-mono text-sm">
              <span className="text-green-500">{'> '}</span>
              Want to see how I can deliver results for your project?
            </p>
            <motion.a
              href="#contact"
              className="inline-block mt-4 px-8 py-3 border-2 border-cyan-500/60 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono hover:bg-cyan-500/30 transition-all"
              whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(34, 211, 238, 0.4)' }}
              whileTap={{ scale: 0.95 }}
            >
              {'> '}Let's Talk
            </motion.a>
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}
