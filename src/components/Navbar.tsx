import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'Awards', href: '#awards' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md z-50 border-b-2 border-green-500/40"
      style={{
        boxShadow: '0 0 20px rgba(0, 255, 0, 0.2), inset 0 -2px 10px rgba(0, 255, 0, 0.1)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-16 relative">
          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.href}
                className="relative px-4 py-2 font-mono text-sm text-green-400 hover:text-green-300 transition-colors group overflow-hidden"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">{link.name}</span>

                {/* Hover outline border with animated corners */}
                <motion.div
                  className="absolute inset-0 border border-green-500/0 group-hover:border-green-500/60 rounded bg-green-500/0 group-hover:bg-green-500/10 transition-all duration-150"
                  whileHover={{
                    boxShadow: '0 0 20px rgba(0, 255, 0, 0.4), inset 0 0 10px rgba(0, 255, 0, 0.1)',
                  }}
                />

                {/* Corner brackets that appear on hover */}
                <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />

                {/* Scan line effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/20 to-transparent opacity-0 group-hover:opacity-100"
                  animate={{
                    y: ['-100%', '200%']
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: 'linear'
                  }}
                />
              </motion.a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2 ml-auto">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-green-400 hover:text-green-300 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-black/95 border-t border-green-500/40"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              boxShadow: 'inset 0 2px 10px rgba(0, 255, 0, 0.1)',
            }}
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="relative block text-center py-3 font-mono text-sm text-green-400 hover:text-green-300 border border-green-500/30 hover:border-green-500/60 rounded bg-green-500/5 hover:bg-green-500/15 transition-colors overflow-hidden group"
                  onClick={() => setIsOpen(false)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{
                    boxShadow: '0 0 20px rgba(0, 255, 0, 0.4), inset 0 0 10px rgba(0, 255, 0, 0.1)',
                  }}
                >
                  <span className="relative z-10">{link.name}</span>
                  {/* Corner brackets on hover */}
                  <div className="absolute top-1 left-1 w-2 h-2 border-l border-t border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  <div className="absolute top-1 right-1 w-2 h-2 border-r border-t border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  <div className="absolute bottom-1 left-1 w-2 h-2 border-l border-b border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  <div className="absolute bottom-1 right-1 w-2 h-2 border-r border-b border-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                  {/* Scan line */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/20 to-transparent opacity-0 group-hover:opacity-100"
                    animate={{ y: ['-100%', '200%'] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  />
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}