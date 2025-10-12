import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCalApi } from '@calcom/embed-react';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import TerminalTyping from './TerminalTyping';
import BlurReveal from './BlurReveal';

// Cal.com username - same as in CalendarProgram
const CAL_USERNAME = 'jack-cao';

export default function Contact() {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal('ui', {
        styles: { branding: { brandColor: '#00ff00' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
    })();
  }, []);

  return (
    <section id="contact" className="py-20 relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, rgba(0, 255, 0, 0.1) 0px, transparent 2px, transparent 20px),
              repeating-linear-gradient(90deg, rgba(0, 255, 0, 0.1) 0px, transparent 2px, transparent 20px)
            `,
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <TerminalTyping text="Get in Touch" className="mb-4" />
          <p className="text-green-300 font-mono mt-4">
            <span className="text-green-500">{'> '}</span>
            Let's discuss your project and bring your ideas to life
          </p>
        </div>

        <BlurReveal delay={0.2}>
          <div className="relative border-2 border-green-500/40 rounded-lg bg-black/70 backdrop-blur-sm p-8">
            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-green-500" />
            <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-green-500" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-green-500" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-green-500" />

            {/* Calendar icon without pulsing */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <Calendar className="h-10 w-10 text-green-400" style={{
                  filter: 'drop-shadow(0 0 6px rgba(0, 255, 0, 0.5))'
                }} />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-green-300 font-mono text-center mb-4"
              style={{
                textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
              }}
            >
              Schedule a Conversation
            </h3>

            <p className="text-green-400 font-mono text-sm text-center mb-6">
              Book a free 30-minute consultation to discuss your project
            </p>

            {/* Cal.com booking button */}
            <button
              data-cal-namespace=""
              data-cal-link={`${CAL_USERNAME}/30min`}
              data-cal-config={JSON.stringify({
                layout: 'month_view',
                theme: 'dark'
              })}
              className="w-full px-8 py-4 border-2 border-green-500/60 rounded-lg bg-green-500/20 text-green-300 font-mono hover:bg-green-500/30 transition-all text-center font-bold text-lg"
              style={{
                boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)'
              }}
            >
              {'> '}Book Consultation
            </button>
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}
