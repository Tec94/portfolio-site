import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlurReveal from './BlurReveal';
import TerminalTyping from './TerminalTyping';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is your typical project timeline?",
      answer: "Project timelines vary based on complexity. A simple landing page typically takes 1-2 weeks, while a full-stack web application might take 4-8 weeks. I provide a detailed timeline during our initial consultation and keep you updated throughout development."
    },
    {
      question: "Do you offer ongoing support and maintenance?",
      answer: "Yes! I offer post-launch support packages including bug fixes, feature updates, performance monitoring, and technical consultations. Most projects include 30 days of free support after deployment."
    },
    {
      question: "What technologies do you work with?",
      answer: "I specialize in React, TypeScript, Node.js, Python, and modern frameworks like Next.js and Express. For databases, I work with PostgreSQL, MongoDB, and Firebase. I'm also experienced with AWS, Vercel, and other cloud platforms."
    },
    {
      question: "Can you help with an existing project?",
      answer: "Absolutely! I can audit your current codebase, optimize performance, fix bugs, add new features, or refactor legacy code. I've worked on projects ranging from small fixes to complete architectural overhauls."
    },
    {
      question: "What is your pricing structure?",
      answer: "I offer both hourly rates and fixed-price project quotes. Pricing depends on project scope, timeline, and complexity. Contact me for a free consultation and custom quote tailored to your specific needs and budget."
    },
    {
      question: "Do you work with international clients?",
      answer: "Yes! I've worked with clients across multiple time zones. I'm flexible with communication schedules and use tools like Slack, Zoom, and project management platforms to ensure smooth collaboration regardless of location."
    },
    {
      question: "What information do you need to get started?",
      answer: "To provide an accurate quote, I'll need: project goals, target audience, key features/functionality, design preferences (or existing designs), timeline expectations, and budget range. We'll discuss all details in our initial consultation."
    },
    {
      question: "Can you help with deployment and hosting?",
      answer: "Yes! I can handle the entire deployment process, including domain setup, hosting configuration (Vercel, AWS, Netlify, etc.), SSL certificates, CI/CD pipelines, and monitoring. I'll ensure your application is production-ready and optimized."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-20 relative">
      {/* Hex pattern background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, rgba(0, 255, 0, 0.1) 0px, rgba(0, 255, 0, 0.1) 1px, transparent 1px, transparent 20px),
              repeating-linear-gradient(60deg, rgba(0, 255, 0, 0.1) 0px, rgba(0, 255, 0, 0.1) 1px, transparent 1px, transparent 20px),
              repeating-linear-gradient(120deg, rgba(0, 255, 0, 0.1) 0px, rgba(0, 255, 0, 0.1) 1px, transparent 1px, transparent 20px)
            `,
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 flex flex-col items-center">
          <TerminalTyping text="FAQ" className="mb-4" />
          <p className="text-green-300 max-w-2xl mx-auto font-mono mt-4">
            <span className="text-green-500">{'> '}</span>
            Frequently asked questions about my services
          </p>
        </div>

        <BlurReveal delay={0.2}>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                className="border-2 border-green-500/40 rounded-lg bg-black/70 backdrop-blur-sm overflow-hidden"
                style={{
                  boxShadow: openIndex === index
                    ? '0 0 30px rgba(0, 255, 0, 0.3), inset 0 0 30px rgba(0, 255, 0, 0.08)'
                    : '0 0 20px rgba(0, 255, 0, 0.15), inset 0 0 20px rgba(0, 255, 0, 0.05)',
                }}
                whileHover={{
                  borderColor: 'rgba(0, 255, 0, 0.6)',
                }}
                transition={{ duration: 0.15 }}
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left group"
                >
                  <span className="text-green-300 font-mono text-sm sm:text-base pr-4"
                    style={{
                      textShadow: openIndex === index ? '0 0 10px rgba(0, 255, 0, 0.5)' : 'none',
                    }}
                  >
                    <span className="text-green-500 mr-2">{'>'}</span>
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown
                      className="h-5 w-5 text-green-400 group-hover:text-green-300 transition-colors"
                      style={{
                        filter: 'drop-shadow(0 0 4px rgba(0, 255, 0, 0.5))'
                      }}
                    />
                  </motion.div>
                </button>

                {/* Answer */}
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-4 border-t border-green-500/30">
                        {/* Scanning line effect */}
                        <motion.div
                          className="h-px bg-gradient-to-r from-transparent via-green-400 to-transparent mb-4"
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: [0, 1, 0], scaleX: [0, 1, 1] }}
                          transition={{ duration: 0.8 }}
                          style={{
                            boxShadow: '0 0 10px rgba(0, 255, 0, 0.8)',
                          }}
                        />
                        <motion.p
                          initial={{ y: -10 }}
                          animate={{ y: 0 }}
                          className="text-green-400/90 font-mono text-sm leading-relaxed"
                        >
                          {faq.answer}
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Corner accents - more visible when open */}
                <div className={`absolute top-2 left-2 w-2 h-2 border-l-2 border-t-2 border-green-500 transition-opacity ${openIndex === index ? 'opacity-100' : 'opacity-50'}`} />
                <div className={`absolute top-2 right-2 w-2 h-2 border-r-2 border-t-2 border-green-500 transition-opacity ${openIndex === index ? 'opacity-100' : 'opacity-50'}`} />
              </motion.div>
            ))}
          </div>
        </BlurReveal>

        {/* Contact CTA */}
        <BlurReveal delay={0.4}>
          <div className="mt-12 text-center">
            <p className="text-green-300 font-mono text-sm mb-4">
              Still have questions?
            </p>
            <motion.a
              href="#contact"
              className="inline-block px-8 py-3 border-2 border-green-500/50 rounded-lg bg-green-500/10 text-green-300 font-mono hover:bg-green-500/20 transition-all"
              whileHover={{
                scale: 1.05,
                borderColor: 'rgba(0, 255, 0, 0.8)',
                boxShadow: '0 0 30px rgba(0, 255, 0, 0.4)'
              }}
              whileTap={{ scale: 0.95 }}
            >
              {'> '}Get in Touch
            </motion.a>
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}
