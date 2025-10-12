import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BlurReveal from './BlurReveal';
import TerminalTyping from './TerminalTyping';
import CardParticleEffect from './CardParticleEffect';
import { servicesData } from '../data/servicesData';

export default function Services() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const services = servicesData;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  return (
    <section id="services" className="py-20 relative">
      {/* Circuit pattern background */}
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 flex flex-col items-center">
          <TerminalTyping text="Services" className="mb-4" />
          <p className="text-green-300 max-w-2xl mx-auto font-mono mt-4">
            <span className="text-green-500">{'> '}</span>
            Professional freelance development services tailored to your needs
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service, index) => (
            <BlurReveal key={index} delay={index * 0.1}>
              <Link to={`/services/${service.slug}`}>
                <motion.div
                  className="h-full cursor-pointer"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  whileHover={{
                    y: -8,
                    boxShadow: '0 0 40px rgba(0, 255, 0, 0.3), inset 0 0 40px rgba(0, 255, 0, 0.08)',
                  }}
                  transition={{ duration: 0.15 }}
                >
                  <div
                    className="relative h-full p-6 border-2 border-green-500/40 rounded-lg bg-black/70 backdrop-blur-sm overflow-hidden flex flex-col"
                    style={{
                      boxShadow: '0 0 30px rgba(0, 255, 0, 0.2), inset 0 0 30px rgba(0, 255, 0, 0.05)',
                    }}
                  >
                    {/* Particle effect */}
                    <CardParticleEffect isHovered={hoveredCard === index} />

                    {/* Corner brackets */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-green-500" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-green-500" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-green-500" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-green-500" />

                    {/* Icon */}
                    <div className="relative mb-4">
                      <motion.div
                        className="inline-block p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                        whileHover={{
                          scale: 1.1,
                          borderColor: 'rgba(0, 255, 0, 0.6)',
                          boxShadow: '0 0 20px rgba(0, 255, 0, 0.4)'
                        }}
                      >
                        <service.icon className="h-8 w-8 text-green-400" style={{
                          filter: 'drop-shadow(0 0 4px rgba(0, 255, 0, 0.5))'
                        }} />
                      </motion.div>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-green-300 font-mono mb-3"
                      style={{
                        textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                      }}
                    >
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-green-400 font-mono text-sm mb-4 leading-relaxed flex-grow">
                      {service.shortDescription}
                    </p>

                    {/* Features */}
                    <div className="space-y-2">
                      {service.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-green-500 text-xs">▸</span>
                          <span className="text-green-300/80 font-mono text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Scanning line effect on hover */}
                    {hoveredCard === index && (
                      <motion.div
                        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"
                        initial={{ top: 0, opacity: 0 }}
                        animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        style={{
                          boxShadow: '0 0 10px rgba(0, 255, 0, 0.8)',
                        }}
                      />
                    )}
                  </div>
                </motion.div>
              </Link>
            </BlurReveal>
          ))}
        </motion.div>

        {/* CTA at bottom */}
        <BlurReveal delay={0.5}>
          <div className="mt-12 text-center">
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
              {'> '}Start a Project
            </motion.a>
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}
