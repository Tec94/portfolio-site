import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCalApi } from '@calcom/embed-react';
import Cal from '@calcom/embed-react';
import Calendar from 'lucide-react/dist/esm/icons/calendar';
import Clock from 'lucide-react/dist/esm/icons/clock';
import X from 'lucide-react/dist/esm/icons/x';
import { useIsMobile } from '../../hooks/useMediaQuery';

interface CalendarProgramProps {
  onExit: () => void;
  onNavigate?: (section: string) => void;
}

// TODO: Replace with your Cal.com username
// You can find this in your Cal.com dashboard URL: https://cal.com/YOUR_USERNAME
const CAL_USERNAME = 'jack-cao'; // Replace with your Cal.com username

export default function CalendarProgram({ onExit }: CalendarProgramProps) {
  const isMobile = useIsMobile();

  useEffect(() => {
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

  // Handle ESC key to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'q') {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="h-full flex flex-col">
        {/* Program Header */}
        <div className="bg-green-500/10 border-b border-green-500/30 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
              style={{
                boxShadow: '0 0 10px rgba(0, 255, 0, 0.8)',
              }}
            />
            <Calendar className="h-5 w-5 text-green-400" />
            <span className="text-green-400 font-mono text-sm sm:text-base">
              BOOKING SYSTEM v1.0 - SCHEDULE CONSULTATION
            </span>
          </div>
          <button
            onClick={onExit}
            className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 font-mono text-xs hover:bg-red-500/30 transition-colors flex items-center gap-2"
          >
            <X className="h-3 w-3" />
            {!isMobile && 'EXIT [ESC]'}
          </button>
        </div>

        {/* Status Bar */}
        <div className="bg-black/60 border-b border-green-500/20 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2 text-green-400">
              <Clock className="h-3 w-3" />
              <span>30 MIN SESSION</span>
            </div>
            <div className="text-green-500/70">
              STATUS: <span className="text-green-400">READY</span>
            </div>
          </div>
          {!isMobile && (
            <div className="text-green-500/50 text-xs font-mono">
              Select date & time to book a consultation
            </div>
          )}
        </div>

        {/* Calendar Container */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-5xl mx-auto">
            {/* Info Card */}
            <motion.div
              className="mb-6 p-4 border border-green-500/30 rounded-lg bg-green-500/5"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                boxShadow: '0 0 20px rgba(0, 255, 0, 0.1), inset 0 0 20px rgba(0, 255, 0, 0.05)',
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-1 h-full bg-green-500 rounded" />
                <div className="flex-1">
                  <h3 className="text-green-300 font-mono text-sm sm:text-base font-bold mb-2">
                    📅 BOOK A CONSULTATION
                  </h3>
                  <p className="text-green-400/80 font-mono text-xs sm:text-sm leading-relaxed">
                    Schedule a 30-minute session to discuss projects, opportunities, or technical collaboration.
                    Available for freelance work, technical consulting, and partnerships.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Cal.com Embed Container */}
            <motion.div
              className="border-2 border-green-500/40 rounded-lg overflow-hidden bg-black/60 backdrop-blur-sm min-h-[600px]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                boxShadow: '0 0 40px rgba(0, 255, 0, 0.2), inset 0 0 40px rgba(0, 255, 0, 0.05)',
              }}
            >
              {/* Corner brackets */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-green-500 pointer-events-none" />
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-green-500 pointer-events-none" />
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-green-500 pointer-events-none" />
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-green-500 pointer-events-none" />

              {/* Cal.com Embed */}
              <div className="relative w-full h-full">
                <Cal
                  calLink={`${CAL_USERNAME}/30min`}
                  style={{
                    width: "100%",
                    height: "100%",
                    minHeight: "600px",
                    overflow: "scroll"
                  }}
                  config={{
                    layout: 'month_view',
                    theme: 'dark'
                  }}
                />
              </div>
            </motion.div>

            {/* Footer Info */}
            <motion.div
              className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="p-3 border border-green-500/20 rounded bg-black/40">
                <div className="text-green-400 font-mono text-xs mb-1">DURATION</div>
                <div className="text-green-300 font-mono text-sm font-bold">30 Minutes</div>
              </div>
              <div className="p-3 border border-green-500/20 rounded bg-black/40">
                <div className="text-green-400 font-mono text-xs mb-1">FORMAT</div>
                <div className="text-green-300 font-mono text-sm font-bold">Video Call</div>
              </div>
              <div className="p-3 border border-green-500/20 rounded bg-black/40">
                <div className="text-green-400 font-mono text-xs mb-1">RESPONSE TIME</div>
                <div className="text-green-300 font-mono text-sm font-bold">Within 24h</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Status Bar */}
        <div className="bg-green-900/10 border-t border-green-500/30 px-4 py-2 flex items-center justify-between text-xs font-mono text-green-400">
          <span>BOOKING_SYS v1.0.0</span>
          <span className="flex items-center gap-4">
            <span>SECURE</span>
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ●
            </motion.span>
          </span>
        </div>
      </div>
    </motion.div>
  );
}
