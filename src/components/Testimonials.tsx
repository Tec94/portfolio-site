import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlurReveal from './BlurReveal';
import TerminalTyping from './TerminalTyping';
import CardParticleEffect from './CardParticleEffect';
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import Quote from 'lucide-react/dist/esm/icons/quote';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // REPLACE WITH REAL TESTIMONIALS
  // Get testimonials from:
  // 1. Internship supervisors (QT-Data Group, Portlogics JSC, Hotel Link Solutions)
  // 2. UT Dallas professors
  // 3. Hackathon teammates/judges
  // 4. LinkedIn recommendations

  const testimonials = [
    {
      name: "Supervisor Name",
      role: "Engineering Manager",
      company: "QT-Data Group",
      content: "Replace with real feedback from your internship supervisor. Ask them for a LinkedIn recommendation or email testimonial highlighting your Python skills, automation work, and professionalism.",
      rating: 5
    },
    {
      name: "Professor Name",
      role: "Professor of Computer Science",
      company: "UT Dallas",
      content: "Ask a professor who knows your work for a brief testimonial about your technical skills, project quality, and work ethic. Focus on specific projects or assignments.",
      rating: 5
    },
    {
      name: "Project Teammate",
      role: "Co-developer",
      company: "HackUTA Team",
      content: "Reach out to teammates from Credify, CitizenVoice, or other projects. Ask them to describe working with you - collaboration, technical skills, problem-solving.",
      rating: 5
    }
  ];

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <section id="testimonials" className="py-20 relative">
      {/* Wave pattern background */}
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 flex flex-col items-center">
          <TerminalTyping text="Testimonials" className="mb-4" />
          <p className="text-green-300 max-w-2xl mx-auto font-mono mt-4">
            <span className="text-green-500">{'> '}</span>
            What clients and mentors say about working with me
          </p>
        </div>

        <BlurReveal delay={0.2}>
          <div className="relative">
            {/* Main testimonial card */}
            <div className="relative min-h-[450px] sm:min-h-[380px] md:min-h-[350px] flex items-center mb-8 md:mb-0">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  className="absolute inset-0"
                >
                  <div
                    className="relative p-8 sm:p-10 border-2 border-green-500/40 rounded-lg bg-black/70 backdrop-blur-sm overflow-hidden"
                    style={{
                      boxShadow: '0 0 40px rgba(0, 255, 0, 0.25), inset 0 0 40px rgba(0, 255, 0, 0.08)',
                    }}
                  >
                    {/* Particle effect */}
                    <CardParticleEffect isHovered={true} />

                    {/* Corner brackets */}
                    <div className="absolute top-3 left-3 w-4 h-4 border-l-2 border-t-2 border-green-500" />
                    <div className="absolute top-3 right-3 w-4 h-4 border-r-2 border-t-2 border-green-500" />
                    <div className="absolute bottom-3 left-3 w-4 h-4 border-l-2 border-b-2 border-green-500" />
                    <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-green-500" />

                    {/* Quote icon */}
                    <div className="flex justify-center mb-6">
                      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                        <Quote className="h-8 w-8 text-green-400" style={{
                          filter: 'drop-shadow(0 0 4px rgba(0, 255, 0, 0.5))'
                        }} />
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-green-300 font-mono text-sm sm:text-base leading-relaxed text-center mb-8 px-4">
                      "{testimonials[currentIndex].content}"
                    </p>

                    {/* Author info */}
                    <div className="text-center">
                      <div className="inline-block px-6 py-3 border border-green-500/30 rounded-lg bg-green-500/5">
                        <h4 className="text-green-300 font-mono font-bold mb-1"
                          style={{
                            textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                          }}
                        >
                          {testimonials[currentIndex].name}
                        </h4>
                        <p className="text-green-400 font-mono text-sm">
                          {testimonials[currentIndex].role}
                        </p>
                        <p className="text-green-500/70 font-mono text-xs mt-1">
                          {testimonials[currentIndex].company}
                        </p>
                      </div>
                    </div>

                    {/* Rating stars */}
                    <div className="flex justify-center gap-1 mt-6">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <motion.span
                          key={i}
                          className="text-green-400 text-xl"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          style={{
                            filter: 'drop-shadow(0 0 2px rgba(0, 255, 0, 0.5))'
                          }}
                        >
                          ★
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-center items-center gap-4 mt-8 md:mt-20 relative z-20">
              <motion.button
                onClick={prevTestimonial}
                className="p-3 border-2 border-green-500/40 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors relative z-20"
                whileHover={{
                  scale: 1.1,
                  borderColor: 'rgba(0, 255, 0, 0.6)',
                  boxShadow: '0 0 20px rgba(0, 255, 0, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0 }}
              >
                <ChevronLeft className="h-6 w-6" />
              </motion.button>

              {/* Dots indicator */}
              <div className="flex gap-2 relative z-20">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setDirection(index > currentIndex ? 1 : -1);
                      setCurrentIndex(index);
                    }}
                    className="group relative z-20"
                  >
                    <motion.div
                      className={`w-2 h-2 rounded-full border border-green-500 transition-colors ${
                        index === currentIndex ? 'bg-green-400' : 'bg-transparent'
                      }`}
                      whileHover={{
                        scale: 1.3,
                        backgroundColor: 'rgba(0, 255, 0, 0.6)',
                        boxShadow: '0 0 10px rgba(0, 255, 0, 0.6)'
                      }}
                      transition={{ duration: 0 }}
                      style={{
                        boxShadow: index === currentIndex ? '0 0 8px rgba(0, 255, 0, 0.8)' : 'none'
                      }}
                    />
                  </button>
                ))}
              </div>

              <motion.button
                onClick={nextTestimonial}
                className="p-3 border-2 border-green-500/40 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors relative z-20"
                whileHover={{
                  scale: 1.1,
                  borderColor: 'rgba(0, 255, 0, 0.6)',
                  boxShadow: '0 0 20px rgba(0, 255, 0, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0 }}
              >
                <ChevronRight className="h-6 w-6" />
              </motion.button>
            </div>
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}
