import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BlurReveal from './BlurReveal';
import TerminalTyping from './TerminalTyping';
import CardParticleEffect from './CardParticleEffect';
import { servicesData } from '../data/servicesData';
import { useFlags } from '../hooks/useFlags';

export default function Services() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const services = servicesData;
  const { trackSectionView, trackSectionClick, trackCTAClick } = useFlags();

  useEffect(() => {
    trackSectionView('services');
  }, [trackSectionView]);

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
    <section id="services" className="py-16 md:py-20 relative">
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
          <div className="mt-6 p-4 border border-green-500/30 rounded-lg bg-green-500/5 max-w-3xl">
            <p className="text-green-400 font-mono text-xs">
              <span className="text-green-300 font-bold">Note:</span> Web development includes basic design, APIs, and performance optimization.
              For comprehensive design systems, dedicated API platforms, or deep performance audits, those specialized services are available separately and can be combined.
            </p>
          </div>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {services.map((service, index) => (
            <BlurReveal key={index} delay={index * 0.1}>
              <Link
                to={`/services/${service.slug}`}
                onClick={() => trackSectionClick('services', `service-card-${service.slug}`)}
              >
                <motion.div
                  className="h-full cursor-pointer"
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  whileHover={{
                    y: -8,
                    boxShadow: '0 0 15px rgba(0, 255, 0, 0.2)',
                  }}
                  whileTap={{
                    scale: 0.98,
                    boxShadow: '0 0 25px rgba(0, 255, 0, 0.4)',
                  }}
                  transition={{ duration: 0.2, type: "tween" }}
                >
                  <div
                    className="relative h-full p-6 border-2 border-green-500/40 rounded-lg bg-black/70 backdrop-blur-sm overflow-hidden flex flex-col"
                    style={{
                      boxShadow: '0 0 10px rgba(0, 255, 0, 0.15)',
                    }}
                  >
                    {/* Particle effect */}
                    <CardParticleEffect isHovered={hoveredCard === index} />

                    {/* Corner brackets */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-green-500" aria-hidden="true" />
                    <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-green-500" aria-hidden="true" />
                    <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-green-500" aria-hidden="true" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-green-500" aria-hidden="true" />

                    {/* Icon */}
                    <div className="relative mb-4">
                      <motion.div
                        className="inline-block p-3 bg-green-500/10 border border-green-500/30 rounded-lg"
                        whileHover={{
                          scale: 1.1,
                          borderColor: 'rgba(0, 255, 0, 0.6)',
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <service.icon className="h-8 w-8 text-green-400" />
                      </motion.div>
                    </div>

                    {/* Title - Fixed height for alignment */}
                    <h3 className="text-xl font-bold text-green-300 font-mono mb-3 min-h-[3.5rem] flex items-start">
                      {service.title}
                    </h3>

                    {/* Starting Price Badge - Fixed positioning */}
                    <div className="mb-4">
                      <span className="inline-block px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded text-cyan-300 font-mono text-sm font-bold">
                        Starting at {service.startingPrice}
                      </span>
                    </div>

                    {/* Description - Fixed height to ensure alignment */}
                    <p className="text-green-400 font-mono text-sm mb-4 leading-relaxed min-h-[4.5rem]">
                      {service.shortDescription}
                    </p>

                    {/* Spacer to push features to bottom */}
                    <div className="flex-grow"></div>

                    {/* Key Highlights - Always at bottom of card */}
                    <div className="space-y-2 mt-auto">
                      {service.features.slice(0, 4).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-green-500 text-xs">✓</span>
                          <span className="text-green-300/80 font-mono text-xs">{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Get Custom Quote CTA */}
                    <motion.div
                      className="mt-4 pt-4 border-t border-green-500/20"
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-between text-cyan-400 font-mono text-sm">
                        <span className="font-bold">Get Custom Quote</span>
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7l5 5m0 0l-5 5m5-5H6"
                          />
                        </svg>
                      </div>
                      <p className="text-xs text-green-500/70 mt-1">
                        View details & book consultation
                      </p>
                    </motion.div>
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
              onClick={() => trackCTAClick('start-project', 'services')}
              className="inline-block px-8 py-3 border-2 border-cyan-500/50 rounded-lg bg-cyan-500/10 text-cyan-300 font-mono hover:bg-cyan-500/20 transition-all"
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(34, 211, 238, 0.8)',
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {'> '}Start a Project
            </motion.a>
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}
