import React from 'react';
import { motion } from 'framer-motion';
import BlurReveal from './BlurReveal';
import TerminalTyping from './TerminalTyping';
import Trophy from 'lucide-react/dist/esm/icons/trophy';
import Award from 'lucide-react/dist/esm/icons/award';
import Star from 'lucide-react/dist/esm/icons/star';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';
import NotebookPen from 'lucide-react/dist/esm/icons/notebook-pen';

export default function Recognition() {
  const achievements = [
    {
      icon: Trophy,
      title: "HackUTA 2024",
      subtitle: "Participant",
      description: "Built Credify - AI-powered credit card optimization platform with Plaid API integration and Google Gemini AI",
      metric: "15+ credit cards analyzed"
    },
    {
      icon: Award,
      title: "HackRice 2024",
      subtitle: "Best Use of Auth0",
      description: "Developed CitizenVoice with Auth0, PostgreSQL, and React-Leaflet for community proposals and voting",
      metric: "3 core features shipped"
    },
    {
      icon: TrendingUp,
      title: "$Munky Token Launch",
      subtitle: "Web3 Project Success",
      description: "Led frontend development for crypto token website that reached $2M peak trading volume",
      metric: "$2M peak volume, 8.5K holders"
    },
    {
      icon: NotebookPen,
      title: "Academic Excellence",
      subtitle: "UT Dallas Computer Science",
      description: "Pursuing B.S. in Computer Science with focus on full-stack development and data engineering",
      metric: "3+ internships"
    }
  ];

  return (
    <section id="recognition" className="py-16 md:py-20 relative">
      {/* Radial pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, rgba(0, 255, 0, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(0, 255, 0, 0.15) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 flex flex-col items-center">
          <TerminalTyping text="Recognition & Achievements" className="mb-4" />
          <p className="text-green-300 max-w-2xl mx-auto font-mono mt-4">
            <span className="text-green-500">{'> '}</span>
            Hackathon wins, project successes, and technical milestones
          </p>
        </div>

        <BlurReveal delay={0.2}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <motion.div
                  key={index}
                  className="relative p-6 border-2 border-green-500/40 rounded-lg bg-black/70 backdrop-blur-sm overflow-hidden h-full flex flex-col"
                  style={{
                    boxShadow: '0 0 30px rgba(0, 255, 0, 0.2), inset 0 0 30px rgba(0, 255, 0, 0.05)',
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    y: -4,
                    boxShadow: '0 0 40px rgba(0, 255, 0, 0.3), inset 0 0 40px rgba(0, 255, 0, 0.08)',
                  }}
                >
                  {/* Corner brackets */}
                  <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-green-500" />
                  <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-green-500" />
                  <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-green-500" />
                  <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-green-500" />

                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex-shrink-0">
                      <Icon className="h-6 w-6 text-green-400" style={{
                        filter: 'drop-shadow(0 0 4px rgba(0, 255, 0, 0.5))'
                      }} />
                    </div>

                    <div className="flex-1 flex flex-col">
                      <h3 className="text-lg font-bold text-green-300 font-mono mb-1"
                        style={{
                          textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                        }}
                      >
                        {achievement.title}
                      </h3>
                      <p className="text-green-400 font-mono text-sm mb-3">
                        {achievement.subtitle}
                      </p>
                      <p className="text-green-300/80 font-mono text-sm leading-relaxed mb-3 flex-1">
                        {achievement.description}
                      </p>
                      <div className="inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded text-cyan-300 font-mono text-xs self-start">
                        {achievement.metric}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </BlurReveal>

        {/* Call to action */}
        <BlurReveal delay={0.6}>
          <div className="mt-12 text-center">
            <p className="text-green-300 font-mono text-sm mb-4">
              Ready to build something amazing together?
            </p>
            <motion.a
              href="#contact"
              className="inline-block px-8 py-3 border-2 border-green-500/50 rounded-lg bg-green-500/10 text-green-300 font-mono hover:bg-green-500/20 transition-all"
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(0, 255, 0, 0.8)',
                boxShadow: '0 0 30px rgba(0, 255, 0, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              {'> '}Start Your Project
            </motion.a>
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}
