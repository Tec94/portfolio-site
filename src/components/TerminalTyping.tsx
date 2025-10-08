import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TerminalTypingProps {
  text: string;
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export default function TerminalTyping({
  text,
  className = '',
  typingSpeed = 80,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: TerminalTypingProps) {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      // Typing phase
      if (displayText.length < text.length) {
        timeout = setTimeout(() => {
          setDisplayText(text.slice(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        // Pause before deleting
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, pauseDuration);
      }
    } else {
      // Deleting phase
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deletingSpeed);
      } else {
        // Pause before typing again
        timeout = setTimeout(() => {
          setIsTyping(true);
        }, 500);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, text, typingSpeed, deletingSpeed, pauseDuration]);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Terminal window header */}
      <motion.div
        className="inline-flex flex-col items-start"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {/* Terminal header bar */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 text-xs text-green-500/70 font-mono">terminal</span>
        </div>

        {/* Terminal content */}
        <div
          className="relative px-6 py-4 border-2 border-green-500/40 rounded-lg bg-black/80 backdrop-blur-sm overflow-hidden min-w-[300px]"
          style={{
            boxShadow: '0 0 30px rgba(0, 255, 0, 0.2), inset 0 0 30px rgba(0, 255, 0, 0.05)',
          }}
        >
          {/* Scanline effect */}
          <motion.div
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(0, 255, 0, 0.05), rgba(0, 255, 0, 0.05) 1px, transparent 1px, transparent 2px)',
            }}
          />

          {/* Terminal prompt */}
          <div className="relative z-10 font-mono">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-500">$</span>
              <span className="text-green-400 text-sm">echo</span>
              <motion.span
                className="inline-block w-1 h-1 rounded-full bg-green-400"
                animate={{
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              />
            </div>

            {/* Typing text */}
            <div className="flex items-center min-h-[60px]">
              <motion.span
                className="text-3xl md:text-5xl font-bold text-green-300 mr-1"
                style={{
                  textShadow: '0 0 20px rgba(0, 255, 0, 0.6)',
                }}
              >
                {displayText}
              </motion.span>

              {/* Blinking cursor */}
              <motion.span
                className="inline-block w-3 h-10 md:h-14 bg-green-400"
                animate={{
                  opacity: showCursor ? 1 : 0,
                }}
                transition={{
                  duration: 0,
                }}
                style={{
                  boxShadow: '0 0 10px rgba(0, 255, 0, 0.8)',
                }}
              />
            </div>
          </div>

          {/* Corner brackets */}
          <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-green-500" />
          <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-green-500" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-green-500" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-green-500" />

          {/* Glowing particle effect */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-green-400"
              style={{
                left: `${20 + i * 30}%`,
                top: `${20 + i * 20}%`,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1.5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.7,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
