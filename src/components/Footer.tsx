import React from 'react';
import Github from 'lucide-react/dist/esm/icons/github';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Linkedin from 'lucide-react/dist/esm/icons/linkedin';
import Twitter from 'lucide-react/dist/esm/icons/twitter';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Mail, href: 'mailto:jack.cao@utdallas.edu', label: 'Email' }
  ];

  const footerLinks = [
    {
      title: 'Navigation',
      links: [
        { name: 'About', href: '#about' },
        { name: 'Experience', href: '#experience' },
        { name: 'Projects', href: '#projects' },
        { name: 'Skills', href: '#skills' },
        { name: 'Awards', href: '#awards' }
      ]
    },
    {
      title: 'Contact',
      links: [
        { name: 'Email', href: 'mailto:jack.cao@utdallas.edu' },
        { name: 'Phone', href: 'tel:737-895-5742' }
      ]
    }
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <motion.h3
              className="text-2xl font-bold text-green-300 font-mono"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
              }}
            >
              Jack Cao
            </motion.h3>
            <p className="text-green-400 text-sm font-mono leading-relaxed">
              Full-Stack Developer specializing in building exceptional digital experiences.
              Currently pursuing Computer Science at UT Dallas.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-green-500/40 rounded bg-green-500/10 hover:border-green-400 hover:bg-green-500/20 transition-colors text-green-400"
                    whileHover={{
                      scale: 1.1,
                      rotate: 5,
                      boxShadow: '0 0 15px rgba(0, 255, 0, 0.4)',
                    }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={social.label}
                  >
                    <IconComponent className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="text-lg font-semibold mb-4 text-green-300 font-mono"
                style={{
                  textShadow: '0 0 8px rgba(0, 255, 0, 0.4)',
                }}
              >
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-green-400 hover:text-green-300 transition-colors text-sm font-mono inline-flex items-center gap-1 group"
                    >
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">▸</span>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-green-500/30 pt-8"
          style={{
            boxShadow: 'inset 0 1px 0 rgba(0, 255, 0, 0.2)',
          }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-green-400 text-sm font-mono">
              <span className="text-green-500">© {currentYear}</span> Jack Cao. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm font-mono">
              <a href="#" className="text-green-400 hover:text-green-300 transition-colors inline-flex items-center gap-1 group">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">▸</span>
                Privacy Policy
              </a>
              <a href="#" className="text-green-400 hover:text-green-300 transition-colors inline-flex items-center gap-1 group">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">▸</span>
                Terms of Use
              </a>
            </div>
          </div>

          {/* Terminal-style footer badge */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-green-500/30 rounded bg-green-500/5 text-xs font-mono text-green-500">
              <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"
                style={{
                  boxShadow: '0 0 5px rgba(0, 255, 0, 0.8)',
                }}
              />
              SYSTEM ONLINE • BUILD v1.0.0 • STATUS: OPERATIONAL
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
