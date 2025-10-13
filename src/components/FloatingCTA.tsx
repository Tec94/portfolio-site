import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MessageCircle from 'lucide-react/dist/esm/icons/message-circle';
import X from 'lucide-react/dist/esm/icons/x';

export default function FloatingCTA() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling past hero section (roughly 600px)
      const shouldShow = window.scrollY > 600;
      setIsVisible(shouldShow);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial position

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToContact}
          className="fixed bottom-6 right-6 z-50 px-5 py-3 bg-cyan-500/90 hover:bg-cyan-400 border-2 border-cyan-300 rounded-lg shadow-lg transition-all group focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          aria-label="Contact me"
        >
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-black" />
            <span className="hidden sm:inline text-black font-mono font-bold text-sm">
              Get in Touch
            </span>
          </div>

          {/* Pulse animation */}
          <motion.div
            className="absolute inset-0 bg-cyan-400 rounded-lg opacity-0"
            animate={{
              opacity: [0, 0.3, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            aria-hidden="true"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
