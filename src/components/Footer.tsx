import React from 'react';
import Github from 'lucide-react/dist/esm/icons/github';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Phone from 'lucide-react/dist/esm/icons/phone';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Services', href: '#services' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' }
  ];

  return (
    <footer className="relative bg-black border-t-2 border-green-500/40 py-12 overflow-hidden"
      style={{
        boxShadow: 'inset 0 2px 20px rgba(0, 255, 0, 0.1)',
      }}
    >
      {/* Footer circuit pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(0deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 0, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Contact Information Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Contact Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-green-300 font-mono font-bold mb-4"
              style={{
                textShadow: '0 0 8px rgba(0, 255, 0, 0.4)',
              }}
            >
              Contact
            </h3>
            <div className="space-y-2">
              <a
                href="mailto:jack.cao@utdallas.edu"
                className="block text-green-400 font-mono text-sm hover:text-green-300 transition-colors group"
              >
                <Mail className="inline h-4 w-4 mr-2" />
                <span className="group-hover:translate-x-1 inline-block transition-transform">
                  jack.cao@utdallas.edu
                </span>
              </a>
              <a
                href="tel:737-895-5742"
                className="block text-green-400 font-mono text-sm hover:text-green-300 transition-colors group"
              >
                <Phone className="inline h-4 w-4 mr-2" />
                <span className="group-hover:translate-x-1 inline-block transition-transform">
                  737-895-5742
                </span>
              </a>
              <p className="text-green-400 font-mono text-sm">
                <MapPin className="inline h-4 w-4 mr-2" />
                Dallas, TX
              </p>
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-green-300 font-mono font-bold mb-4"
              style={{
                textShadow: '0 0 8px rgba(0, 255, 0, 0.4)',
              }}
            >
              Connect
            </h3>
            <div className="space-y-2">
              <a
                href="https://github.com/Tec94"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-green-400 font-mono text-sm hover:text-green-300 transition-colors group"
              >
                <Github className="inline h-4 w-4 mr-2" />
                <span className="group-hover:translate-x-1 inline-block transition-transform">
                  GitHub
                </span>
              </a>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-green-300 font-mono font-bold mb-4"
              style={{
                textShadow: '0 0 8px rgba(0, 255, 0, 0.4)',
              }}
            >
              Quick Links
            </h3>
            <div className="space-y-2">
              {quickLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="block text-green-400 font-mono text-sm hover:text-green-300 transition-colors group"
                >
                  <span className="group-hover:translate-x-1 inline-block transition-transform">
                    {link.name}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="h-px bg-green-500/30 mb-6"
          style={{
            boxShadow: '0 0 5px rgba(0, 255, 0, 0.3)',
          }}
        />

        {/* Copyright */}
        <div className="text-center">
          <p className="text-green-400/60 font-mono text-sm">
            © {currentYear} Jack Cao. Built with React & TypeScript.
          </p>
        </div>
      </div>
    </footer>
  );
}
