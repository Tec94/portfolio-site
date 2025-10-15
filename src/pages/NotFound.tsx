import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Terminal from 'lucide-react/dist/esm/icons/terminal';
import Home from 'lucide-react/dist/esm/icons/home';

export default function NotFound() {
  useEffect(() => {
    // Track 404 errors if analytics is set up
    console.warn('404 Page Not Found:', window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated circuit lines */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px bg-green-500"
            style={{
              top: `${i * 20}%`,
              left: 0,
              right: 0,
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 1,
            }}
          />
        ))}
      </div>

      <motion.div
        className="max-w-2xl w-full border-2 border-green-500/40 rounded-lg bg-black/80 backdrop-blur-sm p-8 relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: '0 0 30px rgba(0, 255, 0, 0.3), inset 0 0 30px rgba(0, 255, 0, 0.05)',
        }}
      >
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-green-500" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-green-500" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-green-500" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-green-500" />

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <Terminal className="h-8 w-8 text-green-400" />
          </div>
          <div>
            <h1 className="text-5xl font-bold text-green-300 font-mono"
              style={{ textShadow: '0 0 10px rgba(0, 255, 0, 0.5)' }}
            >
              404
            </h1>
            <p className="text-green-400/80 font-mono text-sm">
              ERROR: PAGE_NOT_FOUND
            </p>
          </div>
        </div>

        <div className="mb-6 p-4 bg-green-500/5 border border-green-500/20 rounded font-mono text-sm">
          <p className="text-green-300 mb-2">
            <span className="text-green-500">{'> '}</span>
            The page you're looking for doesn't exist in the system.
          </p>
          <p className="text-green-400/80 text-xs mt-3">
            <span className="text-green-500">{'$ '}</span>
            Requested path: <code className="text-cyan-400">{window.location.pathname}</code>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/" className="flex-1">
            <motion.button
              className="w-full px-6 py-3 border-2 border-green-500/60 rounded-lg bg-green-500/20 text-green-300 font-mono hover:bg-green-500/30 transition-all text-center font-bold flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 255, 0, 0.4)' }}
              whileTap={{ scale: 0.98 }}
            >
              <Home className="h-5 w-5" />
              {'> '}Return Home
            </motion.button>
          </Link>
          <Link to="/#contact" className="flex-1">
            <motion.button
              className="w-full px-6 py-3 border-2 border-cyan-500/40 rounded-lg bg-cyan-500/10 text-cyan-300 font-mono hover:bg-cyan-500/20 transition-all text-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact Support
            </motion.button>
          </Link>
        </div>

        <div className="mt-8 p-4 bg-green-500/5 border border-green-500/20 rounded">
          <p className="text-green-400/80 font-mono text-xs mb-2">Suggested pages:</p>
          <ul className="space-y-1">
            {[
              { name: 'Services', path: '/#services' },
              { name: 'Projects', path: '/#projects' },
              { name: 'Contact', path: '/#contact' }
            ].map((link, idx) => (
              <li key={idx}>
                <Link
                  to={link.path}
                  className="text-cyan-400 font-mono text-sm hover:text-cyan-300 transition-colors flex items-center gap-2"
                >
                  <span className="text-green-500">▸</span>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
