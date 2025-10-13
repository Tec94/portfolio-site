import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Terminal from 'lucide-react/dist/esm/icons/terminal';
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right';
import TerminalTyping from './TerminalTyping';
import BlurReveal from './BlurReveal';

interface TechTerminalProps {
  skills: {
    title: string;
    skills: string[];
  }[];
}

export default function TechTerminal({ skills }: TechTerminalProps) {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [typingText, setTypingText] = useState('');
  const [showCursor, setShowCursor] = useState(true);

  // Typing animation for selected category
  useEffect(() => {
    const categoryTitle = skills[selectedCategory].title;
    let index = 0;
    setTypingText('');

    const typingInterval = setInterval(() => {
      if (index <= categoryTitle.length) {
        setTypingText(categoryTitle.slice(0, index));
        index++;
      } else {
        clearInterval(typingInterval);
      }
    }, 80);

    return () => clearInterval(typingInterval);
  }, [selectedCategory, skills]);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <section id="skills" className="py-20 relative overflow-hidden">

      {/* Terminal scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="h-px w-full bg-green-500/30"
          animate={{
            y: [0, 800],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 flex flex-col items-center">
          <TerminalTyping text="Tech Stack" className="mb-4" />
          <p className="text-green-300 max-w-2xl mx-auto font-mono mt-4">
            <span className="text-green-500">{'> '}</span>
            Terminal-based skill explorer — navigate through my tech arsenal
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Terminal Window */}
          <motion.div
            className="border-2 border-green-500/40 rounded-lg overflow-hidden bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              boxShadow: '0 0 40px rgba(0, 255, 0, 0.3), inset 0 0 40px rgba(0, 255, 0, 0.05)',
            }}
          >
            {/* Terminal Header */}
            <div className="bg-green-900/20 border-b border-green-500/30 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                <Terminal className="h-4 w-4" />
                <span>jack@skillz:~$</span>
              </div>
              <div className="w-20" /> {/* Spacer for centering */}
            </div>

            {/* Terminal Content */}
            <div className="p-6">
              {/* Command Prompt */}
              <div className="mb-6 font-mono text-green-400 text-sm">
                <div className="mb-2">
                  <span className="text-green-500">jack@portfolio</span>
                  <span className="text-green-300">:</span>
                  <span className="text-blue-400">~</span>
                  <span className="text-green-300">$ </span>
                  <span>ls -la /skills</span>
                </div>
                <div className="text-green-400/70 mb-4">
                  Listing directory contents...
                </div>
              </div>

              {/* Category Selection (Terminal Style) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                {skills.map((category, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setSelectedCategory(index)}
                    className={`
                      relative px-4 py-3 font-mono text-sm text-left rounded border transition-all
                      ${
                        selectedCategory === index
                          ? 'border-green-400 bg-green-500/20 text-green-300'
                          : 'border-green-500/30 bg-black/40 text-green-400 hover:border-green-400/60 hover:bg-green-500/10'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      boxShadow:
                        selectedCategory === index
                          ? '0 0 20px rgba(0, 255, 0, 0.4), inset 0 0 10px rgba(0, 255, 0, 0.2)'
                          : '0 0 5px rgba(0, 255, 0, 0.1)',
                    }}
                  >
                    {selectedCategory === index && (
                      <ChevronRight className="inline h-3 w-3 mr-1 animate-pulse" />
                    )}
                    {category.title}

                    {/* Selection indicator */}
                    {selectedCategory === index && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400"
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: 1, scaleX: 1 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        style={{
                          boxShadow: '0 0 10px rgba(0, 255, 0, 0.8)',
                        }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Terminal Output - Selected Category Skills */}
              <div className="border border-green-500/30 rounded p-4 bg-black/60 min-h-[250px]">
                <div className="font-mono text-sm mb-4">
                  <span className="text-green-500">$ </span>
                  <span className="text-green-300">cat skills/</span>
                  <span className="text-green-400">{typingText}</span>
                  {showCursor && <span className="text-green-400">|</span>}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCategory}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-3 gap-3"
                  >
                    {skills[selectedCategory].skills.map((skill, idx) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center gap-2 font-mono text-sm text-green-300 group"
                      >
                        <motion.span
                          className="text-green-500"
                          animate={{
                            opacity: [0.5, 1, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: idx * 0.1,
                          }}
                        >
                          ▸
                        </motion.span>
                        <span className="group-hover:text-green-200 transition-colors">
                          {skill}
                        </span>
                        <motion.span
                          className="ml-auto text-green-600 text-xs opacity-0 group-hover:opacity-100"
                          transition={{ duration: 0.2 }}
                        >
                          [OK]
                        </motion.span>
                      </motion.div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Terminal footer stats */}
                <div className="mt-6 pt-4 border-t border-green-500/20 flex justify-between text-xs font-mono text-green-500/70">
                  <span>
                    Total: {skills[selectedCategory].skills.length} items
                  </span>
                  <span>Category: {selectedCategory + 1}/{skills.length}</span>
                </div>
              </div>
            </div>

            {/* Terminal Footer Status Bar */}
            <div className="bg-green-900/10 border-t border-green-500/30 px-4 py-2 flex items-center justify-between text-xs font-mono text-green-400">
              <span>READY</span>
              <span className="flex items-center gap-4">
                <span>UTF-8</span>
                <span>BASH</span>
                <motion.span
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  ●
                </motion.span>
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
