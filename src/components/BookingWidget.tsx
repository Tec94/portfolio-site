import React, { useEffect } from 'react';
import { getCalApi } from '@calcom/embed-react';
import { motion } from 'framer-motion';
import Calendar from 'lucide-react/dist/esm/icons/calendar';

// Cal.com username
const CAL_USERNAME = 'jack-cao';

interface BookingWidgetProps {
  selectedPlan?: string;
  serviceName: string;
}

export default function BookingWidget({ selectedPlan, serviceName }: BookingWidgetProps) {
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
    <div className="py-12">
      <div className="text-center mb-8">
        <motion.div
          className="inline-flex items-center gap-3 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
            <Calendar className="h-8 w-8 text-green-400" style={{
              filter: 'drop-shadow(0 0 4px rgba(0, 255, 0, 0.5))'
            }} />
          </div>
          <div className="text-left">
            <h3 className="text-2xl font-bold text-green-300 font-mono"
              style={{
                textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
              }}
            >
              Book a Consultation
            </h3>
            {selectedPlan && (
              <p className="text-green-400 font-mono text-sm">
                {serviceName} - {selectedPlan} Plan
              </p>
            )}
          </div>
        </motion.div>
        <p className="text-green-300/80 font-mono text-sm max-w-2xl mx-auto">
          Schedule a free 30-minute consultation to discuss your project requirements,
          timeline, and get a detailed quote.
        </p>
      </div>

      <motion.div
        className="relative border-2 border-green-500/40 rounded-lg bg-black/70 backdrop-blur-sm p-6 overflow-hidden"
        style={{
          boxShadow: '0 0 30px rgba(0, 255, 0, 0.2), inset 0 0 30px rgba(0, 255, 0, 0.05)',
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {/* Corner brackets */}
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-green-500" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-green-500" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-green-500" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-green-500" />

        {/* Cal.com embed */}
        <button
          data-cal-namespace=""
          data-cal-link={`${CAL_USERNAME}/30min`}
          data-cal-config={JSON.stringify({
            layout: 'month_view',
            theme: 'dark',
            notes: `Interested in: ${serviceName}${selectedPlan ? ` - ${selectedPlan} Plan` : ''}`
          })}
          className="w-full px-8 py-4 border-2 border-green-500/60 rounded-lg bg-green-500/20 text-green-300 font-mono hover:bg-green-500/30 transition-all text-center"
          style={{
            boxShadow: '0 0 15px rgba(0, 255, 0, 0.3)'
          }}
        >
          <span className="text-lg font-bold">{'> '}Schedule Consultation</span>
          {selectedPlan && (
            <span className="block text-sm mt-2 text-green-400/80">
              Discussing: {selectedPlan} Plan
            </span>
          )}
        </button>

        <div className="mt-6 p-4 bg-green-500/5 border border-green-500/20 rounded">
          <p className="text-green-400 font-mono text-xs text-center">
            After booking, you'll receive:
          </p>
          <ul className="mt-3 space-y-2 text-green-300/80 font-mono text-xs">
            <li className="flex items-center gap-2">
              <span className="text-green-500">▸</span>
              Confirmation email with meeting link
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">▸</span>
              Project questionnaire to fill out
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">▸</span>
              Calendar invite with Zoom/Google Meet link
            </li>
          </ul>
        </div>
      </motion.div>

      <div className="mt-6 text-center">
        <p className="text-green-400/60 font-mono text-xs">
          No pressure, no commitment - just a friendly chat about your project
        </p>
      </div>
    </div>
  );
}
