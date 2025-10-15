import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowUp from 'lucide-react/dist/esm/icons/arrow-up';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button when user scrolls down 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          className="p-3 bg-green-500/20 border-2 border-green-500/60 rounded-lg hover:bg-green-500/30 transition-all group touch-manipulation"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{
            scale: 1.05,
            boxShadow: '0 0 20px rgba(0, 255, 0, 0.5)'
          }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            bottom: '6rem',
            right: '1.5rem',
            zIndex: 40,
            boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)',
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform'
          }}
          aria-label="Back to top"
        >
          <ArrowUp className="h-5 w-5 text-green-400 group-hover:text-green-300" />

          {/* Pulse indicator */}
          <motion.div
            className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-400 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.5, 1]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
            style={{
              boxShadow: '0 0 8px rgba(0, 255, 0, 0.8)'
            }}
            aria-hidden="true"
          />

          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-green-500/90 border border-green-400 rounded text-xs font-mono text-black whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Back to Top
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
