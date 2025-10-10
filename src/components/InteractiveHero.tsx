import React, { useState, useRef, useEffect } from 'react';
import Github from 'lucide-react/dist/esm/icons/github';
import Mail from 'lucide-react/dist/esm/icons/mail';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Phone from 'lucide-react/dist/esm/icons/phone';
import Code2 from 'lucide-react/dist/esm/icons/code-2';
import Database from 'lucide-react/dist/esm/icons/database';
import Rocket from 'lucide-react/dist/esm/icons/rocket';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import TerminalTyping from './TerminalTyping';
import BlurReveal from './BlurReveal';

export default function InteractiveHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);

  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15, 15]), springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = (e.clientX - centerX) / (rect.width / 2);
        const y = (e.clientY - centerY) / (rect.height / 2);

        setMousePosition({ x: e.clientX, y: e.clientY });
        mouseX.set(x);
        mouseY.set(y);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Floating particles
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  // Skill badges
  const skills = [
    { icon: Code2, text: 'React', color: 'from-cyan-500 to-blue-500' },
    { icon: Database, text: 'TypeScript', color: 'from-blue-500 to-purple-500' },
    { icon: Rocket, text: 'Python', color: 'from-green-500 to-emerald-500' },
  ];

  return (
    <section
      ref={heroRef}
      id="about"
      className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden"
    >
      {/* Floating Interactive Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-green-400/30 blur-sm"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              x: useTransform(
                mouseX,
                [-1, 1],
                [-50 * (particle.id % 3), 50 * (particle.id % 3)]
              ),
              y: useTransform(
                mouseY,
                [-1, 1],
                [-30 * (particle.id % 3), 30 * (particle.id % 3)]
              ),
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Terminal Header Bar */}
      <div className="absolute top-20 left-0 right-0 h-8 bg-green-500/10 border-y border-green-500/30 flex items-center px-2 sm:px-4 z-20">
        <div className="flex gap-2">
          <motion.div
            className="w-3 h-3 rounded-full bg-red-500 cursor-pointer"
            whileHover={{ scale: 1.2, boxShadow: '0 0 10px rgba(255, 0, 0, 0.8)' }}
            whileTap={{ scale: 0.9 }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-yellow-500 cursor-pointer"
            whileHover={{ scale: 1.2, boxShadow: '0 0 10px rgba(255, 255, 0, 0.8)' }}
            whileTap={{ scale: 0.9 }}
          />
          <motion.div
            className="w-3 h-3 rounded-full bg-green-500 cursor-pointer"
            whileHover={{ scale: 1.2, boxShadow: '0 0 10px rgba(0, 255, 0, 0.8)' }}
            whileTap={{ scale: 0.9 }}
          />
        </div>
        <span className="ml-2 sm:ml-4 text-xs text-green-400 font-mono hidden sm:inline">jack@portfolio:~$</span>
      </div>

      {/* Main Content - 3D Tilt Effect */}
      <motion.div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-20 flex flex-col items-center perspective-1000"
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Name with Enhanced Typography */}
        <TerminalTyping
          text="Jack Cao"
          className="mb-6"
          typingSpeed={100}
          deletingSpeed={60}
          pauseDuration={3000}
        />

        {/* Subtitle */}
        <BlurReveal delay={0.2}>
          <motion.h2
            className="text-2xl text-green-300 mb-8 font-mono relative"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-green-500">$</span> Computer Science Student | Full-Stack Developer
            <motion.span
              className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-green-500 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            />
          </motion.h2>
        </BlurReveal>

        {/* Interactive Skill Badges */}
        <BlurReveal delay={0.3}>
          <div className="flex gap-4 mb-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.text}
                className={`relative px-4 py-2 rounded-lg bg-gradient-to-r ${skill.color} bg-opacity-20 backdrop-blur-sm border border-green-500/30 cursor-pointer`}
                initial={{ opacity: 0, y: 20, rotateX: -90 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                whileHover={{
                  scale: 1.1,
                  rotateY: 10,
                  boxShadow: '0 10px 30px rgba(0, 255, 0, 0.3)',
                }}
                whileTap={{ scale: 0.95 }}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="flex items-center gap-2 text-green-300">
                  <skill.icon className="w-5 h-5" />
                  <span className="font-mono text-sm">{skill.text}</span>
                </div>
                <motion.div
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-green-400/0 via-green-400/20 to-green-400/0"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: index * 0.5,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </BlurReveal>

        {/* Contact Info with 3D Cards */}
        <BlurReveal delay={0.4}>
          <div className="flex items-center justify-center flex-wrap gap-3 sm:gap-6 text-green-400 mb-12 font-mono text-xs sm:text-sm">
            <motion.span
              className="relative flex items-center border border-green-500/30 px-2 sm:px-3 py-1 rounded overflow-hidden group cursor-pointer"
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(0, 255, 0, 0.8)',
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 10px rgba(0, 255, 0, 0.1)',
                rotateX: 5,
                rotateY: -5,
              }}
              style={{ transformStyle: 'preserve-3d' }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <MapPin className="h-4 w-4 mr-2 relative z-10" />
              <span className="relative z-10">Dallas, TX</span>
              <div className="absolute inset-0 border-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" style={{ clipPath: 'inset(0 0 50% 0)' }} />
            </motion.span>

            <motion.a
              href="tel:737-895-5742"
              className="relative flex items-center border border-green-500/30 px-2 sm:px-3 py-1 rounded hover:text-green-300 transition-colors duration-200 overflow-hidden group"
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(0, 255, 0, 0.8)',
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 10px rgba(0, 255, 0, 0.1)',
                rotateX: 5,
                rotateY: 5,
              }}
              style={{ transformStyle: 'preserve-3d' }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <Phone className="h-4 w-4 mr-2 relative z-10" />
              <span className="relative z-10">737-895-5742</span>
              <div className="absolute inset-0 border-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" style={{ clipPath: 'inset(0 0 50% 0)' }} />
            </motion.a>

            <motion.a
              href="mailto:jack.cao@utdallas.edu"
              className="relative flex items-center border border-green-500/30 px-2 sm:px-3 py-1 rounded hover:text-green-300 transition-colors duration-200 overflow-hidden group"
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(0, 255, 0, 0.8)',
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 10px rgba(0, 255, 0, 0.1)',
                rotateX: -5,
                rotateY: 5,
              }}
              style={{ transformStyle: 'preserve-3d' }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <Mail className="h-4 w-4 mr-2 relative z-10" />
              <span className="relative z-10">jack.cao@utdallas.edu</span>
              <div className="absolute inset-0 border-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" style={{ clipPath: 'inset(0 0 50% 0)' }} />
            </motion.a>

            <motion.a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center border border-green-500/30 px-2 sm:px-3 py-1 rounded hover:text-green-300 transition-colors duration-200 overflow-hidden group"
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(0, 255, 0, 0.8)',
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 10px rgba(0, 255, 0, 0.1)',
                rotateX: -5,
                rotateY: -5,
              }}
              style={{ transformStyle: 'preserve-3d' }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <Github className="h-4 w-4 mr-2 relative z-10" />
              <span className="relative z-10">GitHub</span>
              <div className="absolute inset-0 border-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" style={{ clipPath: 'inset(0 0 50% 0)' }} />
            </motion.a>
          </div>
        </BlurReveal>

        {/* Description with Parallax */}
        <BlurReveal delay={0.6}>
          <motion.div
            className="relative"
            style={{
              x: useTransform(mouseX, [-1, 1], [-10, 10]),
            }}
          >
            <p className="text-sm sm:text-lg text-green-300 max-w-2xl mx-auto font-mono leading-relaxed px-4 relative z-10">
              <span className="text-green-500">{'> '}</span>Full-stack developer specializing in React, TypeScript, and Python. Experience in building scalable
              web applications, data pipelines, and automation solutions. Currently pursuing B.S. in Computer Science at UT Dallas.
            </p>

            {/* Animated Border */}
            <motion.div
              className="absolute -inset-2 border border-green-500/20 rounded-lg -z-10"
              animate={{
                borderColor: ['rgba(0, 255, 0, 0.1)', 'rgba(0, 255, 0, 0.3)', 'rgba(0, 255, 0, 0.1)'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        </BlurReveal>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div
            className="w-6 h-10 border-2 border-green-500/50 rounded-full flex justify-center pt-2"
            animate={{ borderColor: ['rgba(0, 255, 0, 0.3)', 'rgba(0, 255, 0, 0.8)', 'rgba(0, 255, 0, 0.3)'] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              className="w-1.5 h-1.5 bg-green-500 rounded-full"
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
