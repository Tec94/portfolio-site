import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getCalApi } from '@calcom/embed-react';
import Cal from '@calcom/embed-react';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Mail from 'lucide-react/dist/esm/icons/mail';
import Phone from 'lucide-react/dist/esm/icons/phone';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Github from 'lucide-react/dist/esm/icons/github';
import Linkedin from 'lucide-react/dist/esm/icons/linkedin';
import TerminalTyping from './TerminalTyping';
import BlurReveal from './BlurReveal';

// Cal.com username - same as in CalendarProgram
const CAL_USERNAME = 'jack-cao';

export default function Contact() {
  const [showBooking, setShowBooking] = useState(false);

  React.useEffect(() => {
    (async function () {
      const cal = await getCalApi({});
      cal("ui", {
        "theme": "dark",
        "styles": {
          "branding": {
            "brandColor": "#00ff00"
          }
        },
        "hideEventTypeDetails": false,
        "layout": "month_view"
      });
    })();
  }, []);

  return (
    <section id="contact" className="py-20 relative overflow-hidden">
      {/* Circuit pattern background */}
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
        <div className="text-center mb-12 flex flex-col items-center">
          <TerminalTyping text="Get in Touch" className="mb-4" />
          <p className="text-green-300 max-w-2xl mx-auto font-mono mt-4">
            <span className="text-green-500">{'> '}</span>
            Let's connect and discuss opportunities or collaborations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {/* Contact Info Card */}
          <BlurReveal delay={0.1}>
            <motion.div
              className="border-2 border-green-500/40 rounded-lg p-6 bg-black/70 backdrop-blur-sm"
              style={{
                boxShadow: '0 0 30px rgba(0, 255, 0, 0.2), inset 0 0 30px rgba(0, 255, 0, 0.05)',
              }}
              whileHover={{
                boxShadow: '0 0 40px rgba(0, 255, 0, 0.3), inset 0 0 40px rgba(0, 255, 0, 0.08)',
              }}
              transition={{ duration: 0.2 }}
            >
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-green-500" />
              <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-green-500" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-green-500" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-green-500" />

              <h3 className="text-2xl font-bold text-green-300 font-mono mb-6"
                style={{
                  textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                }}
              >
                Contact Information
              </h3>

              <div className="space-y-4">
                <motion.a
                  href="mailto:jack.cao@utdallas.edu"
                  className="flex items-center gap-3 p-3 border border-green-500/30 rounded hover:border-green-400 hover:bg-green-500/10 transition-all group"
                  whileHover={{ x: 5 }}
                >
                  <Mail className="h-5 w-5 text-green-400" />
                  <div className="flex-1">
                    <div className="text-xs text-green-500 font-mono">Email</div>
                    <div className="text-green-300 font-mono text-sm">jack.cao@utdallas.edu</div>
                  </div>
                  <motion.span
                    className="opacity-0 group-hover:opacity-100 text-green-400"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                  >
                    →
                  </motion.span>
                </motion.a>

                <motion.a
                  href="tel:737-895-5742"
                  className="flex items-center gap-3 p-3 border border-green-500/30 rounded hover:border-green-400 hover:bg-green-500/10 transition-all group"
                  whileHover={{ x: 5 }}
                >
                  <Phone className="h-5 w-5 text-green-400" />
                  <div className="flex-1">
                    <div className="text-xs text-green-500 font-mono">Phone</div>
                    <div className="text-green-300 font-mono text-sm">737-895-5742</div>
                  </div>
                  <motion.span
                    className="opacity-0 group-hover:opacity-100 text-green-400"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                  >
                    →
                  </motion.span>
                </motion.a>

                <motion.div
                  className="flex items-center gap-3 p-3 border border-green-500/30 rounded"
                >
                  <MapPin className="h-5 w-5 text-green-400" />
                  <div className="flex-1">
                    <div className="text-xs text-green-500 font-mono">Location</div>
                    <div className="text-green-300 font-mono text-sm">Dallas, TX</div>
                  </div>
                </motion.div>
              </div>

              {/* Social Links */}
              <div className="mt-6 pt-6 border-t border-green-500/20">
                <div className="text-xs text-green-500 font-mono mb-3">Connect with me</div>
                <div className="flex gap-3">
                  <motion.a
                    href="https://github.com/Tec94"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-green-500/40 rounded hover:border-green-400 hover:bg-green-500/20 transition-all"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Github className="h-5 w-5 text-green-400" />
                  </motion.a>
                  <motion.a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-green-500/40 rounded hover:border-green-400 hover:bg-green-500/20 transition-all"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Linkedin className="h-5 w-5 text-green-400" />
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </BlurReveal>

          {/* Booking Call-to-Action */}
          <BlurReveal delay={0.2}>
            <motion.div
              className="border-2 border-green-500/40 rounded-lg p-6 bg-black/70 backdrop-blur-sm flex flex-col justify-center items-center text-center"
              style={{
                boxShadow: '0 0 30px rgba(0, 255, 0, 0.2), inset 0 0 30px rgba(0, 255, 0, 0.05)',
              }}
              whileHover={{
                boxShadow: '0 0 40px rgba(0, 255, 0, 0.3), inset 0 0 40px rgba(0, 255, 0, 0.08)',
              }}
              transition={{ duration: 0.2 }}
            >
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-green-500" />
              <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-green-500" />
              <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-green-500" />
              <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-green-500" />

              <motion.div
                className="mb-6"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <Calendar className="h-16 w-16 text-green-400 mx-auto"
                  style={{
                    filter: 'drop-shadow(0 0 20px rgba(0, 255, 0, 0.6))',
                  }}
                />
              </motion.div>

              <h3 className="text-2xl font-bold text-green-300 font-mono mb-3"
                style={{
                  textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                }}
              >
                Schedule a Consultation
              </h3>

              <p className="text-green-400 font-mono text-sm mb-6 max-w-sm">
                Book a 30-minute call to discuss projects, opportunities, or technical collaboration
              </p>

              <motion.button
                onClick={() => setShowBooking(!showBooking)}
                className="px-6 py-3 bg-green-500/20 border-2 border-green-400 rounded-lg text-green-300 font-mono font-bold hover:bg-green-500/30 transition-all flex items-center gap-2"
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 0 30px rgba(0, 255, 0, 0.6), inset 0 0 20px rgba(0, 255, 0, 0.2)',
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                <Calendar className="h-5 w-5" />
                <span>{showBooking ? 'HIDE CALENDAR' : 'BOOK NOW'}</span>
              </motion.button>

              <div className="mt-4 text-xs text-green-500/70 font-mono">
                Free • 30 Minutes • Video Call
              </div>
            </motion.div>
          </BlurReveal>
        </div>

        {/* Booking Calendar Embed */}
        {showBooking && (
          <BlurReveal delay={0.1}>
            <motion.div
              className="border-2 border-green-500/40 rounded-lg overflow-hidden bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                boxShadow: '0 0 40px rgba(0, 255, 0, 0.3), inset 0 0 40px rgba(0, 255, 0, 0.05)',
              }}
            >
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-green-500 pointer-events-none z-10" />
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-green-500 pointer-events-none z-10" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-green-500 pointer-events-none z-10" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-green-500 pointer-events-none z-10" />

              <div className="p-6">
                <div className="mb-4 text-center">
                  <h4 className="text-xl font-bold text-green-300 font-mono mb-2"
                    style={{
                      textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
                    }}
                  >
                    Select Your Time
                  </h4>
                  <p className="text-green-400 font-mono text-sm">
                    Choose a date and time that works best for you
                  </p>
                </div>

                <div className="min-h-[500px] md:min-h-[600px] overflow-hidden">
                  <Cal
                    calLink={`${CAL_USERNAME}/30min`}
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "500px",
                      overflow: "hidden"
                    }}
                    config={{
                      layout: 'month_view',
                      theme: 'dark'
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </BlurReveal>
        )}
      </div>
    </section>
  );
}
