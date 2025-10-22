import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PricingPlan } from '../data/servicesData';
import Check from 'lucide-react/dist/esm/icons/check';
import Star from 'lucide-react/dist/esm/icons/star';
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down';
import ChevronUp from 'lucide-react/dist/esm/icons/chevron-up';

interface PricingTableProps {
  plans: PricingPlan[];
  onSelectPlan: (planName: string) => void;
}

export default function PricingTable({ plans, onSelectPlan }: PricingTableProps) {
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null);
  const [expandedPlans, setExpandedPlans] = useState<{ [key: string]: boolean }>({});

  const toggleExpanded = (planName: string) => {
    setExpandedPlans(prev => ({
      ...prev,
      [planName]: !prev[planName]
    }));
  };

  const INITIAL_VISIBLE_COUNT = 7; // Same for all plans to ensure consistent height

  const getVisibleFeatures = (plan: PricingPlan) => {
    const isExpanded = expandedPlans[plan.name];

    // Show all features if expanded or if it's a Basic plan (which should have fewer features)
    if (isExpanded || plan.name === 'Basic') {
      return plan.features;
    }

    // Show only first 7 features for Business/Premium when collapsed
    return plan.features.slice(0, INITIAL_VISIBLE_COUNT);
  };

  const shouldShowViewMore = (plan: PricingPlan) => {
    // Only show "View More" for Business and Premium plans if they have more than INITIAL_VISIBLE_COUNT features
    return plan.features.length > INITIAL_VISIBLE_COUNT && plan.name !== 'Basic';
  };

  return (
    <div className="py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            className={`relative p-6 border-2 rounded-lg bg-black/70 backdrop-blur-sm flex flex-col ${
              plan.recommended
                ? 'border-green-400 shadow-lg shadow-green-500/20'
                : 'border-green-500/40'
            }`}
            onMouseEnter={() => setHoveredPlan(plan.name)}
            onMouseLeave={() => setHoveredPlan(null)}
            whileHover={{
              y: -4,
              boxShadow: plan.recommended
                ? '0 0 50px rgba(0, 255, 0, 0.4), inset 0 0 50px rgba(0, 255, 0, 0.1)'
                : '0 0 40px rgba(0, 255, 0, 0.3), inset 0 0 40px rgba(0, 255, 0, 0.08)',
            }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileInView="visible"
            style={{
              transitionDelay: `${index * 0.1}s`
            }}
          >
            {/* Recommended badge */}
            {plan.recommended && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-green-400 text-black text-xs font-mono font-bold rounded-full flex items-center gap-1 shadow-lg">
                <Star className="h-3 w-3" />
                RECOMMENDED
              </div>
            )}

            {/* Corner brackets */}
            <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-green-500" />
            <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-green-500" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-green-500" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-green-500" />

            {/* Plan name */}
            <h3 className="text-2xl font-bold text-green-300 font-mono mb-2 text-center"
              style={{
                textShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
              }}
            >
              {plan.name}
            </h3>

            {/* Price */}
            <div className="text-center mb-4 h-16 flex items-center justify-center">
              <p className="text-3xl font-bold text-green-400 font-mono">
                {plan.price}
              </p>
            </div>

            {/* Description */}
            <p className="text-green-300/80 font-mono text-sm text-center mb-6 h-12 flex items-center justify-center">
              {plan.description}
            </p>

            {/* Divider */}
            <div className="h-px bg-green-500/30 mb-6" />

            {/* Features */}
            <div className="space-y-3 mb-4">
              <p className="text-green-400 font-mono text-xs uppercase tracking-wider mb-2">Features:</p>
              <div className={`${!expandedPlans[plan.name] ? 'min-h-[280px]' : ''}`}>
                <AnimatePresence initial={false}>
                  {getVisibleFeatures(plan).map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-2 mb-3"
                    >
                      <Check className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-green-300/90 font-mono text-sm leading-relaxed">{feature}</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* View More Button - Fixed height area */}
            <div className="h-12 mb-4 flex items-center">
              {shouldShowViewMore(plan) && (
                <button
                  onClick={() => toggleExpanded(plan.name)}
                  className="w-full py-2 text-green-400 hover:text-green-300 font-mono text-xs flex items-center justify-center gap-1 border border-green-500/30 rounded hover:border-green-500/50 transition-all hover:bg-green-500/5"
                >
                  {expandedPlans[plan.name] ? (
                    <>
                      <ChevronUp className="h-3 w-3" />
                      View Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-3 w-3" />
                      View More ({plan.features.length - INITIAL_VISIBLE_COUNT} more)
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6 p-4 bg-green-500/5 border border-green-500/20 rounded min-h-[220px]">
              <div className="space-y-1">
                <span className="text-green-400/80 font-mono text-xs uppercase tracking-wider">Revisions:</span>
                <p className="text-green-300 font-mono text-sm font-bold">{plan.revisions}</p>
              </div>
              <div className="h-px bg-green-500/20" />
              <div className="space-y-1">
                <span className="text-green-400/80 font-mono text-xs uppercase tracking-wider">Meetings:</span>
                <p className="text-green-300 font-mono text-sm font-bold">{plan.meetings}</p>
              </div>
              <div className="h-px bg-green-500/20" />
              <div className="space-y-1">
                <span className="text-green-400/80 font-mono text-xs uppercase tracking-wider">Timeline:</span>
                <p className="text-green-300 font-mono text-sm font-bold">{plan.timeline}</p>
              </div>
              <div className="h-px bg-green-500/20" />
              <div className="space-y-1">
                <span className="text-green-400/80 font-mono text-xs uppercase tracking-wider">Support:</span>
                <p className="text-green-300 font-mono text-sm font-bold break-words">{plan.support}</p>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              onClick={() => onSelectPlan(plan.name)}
              className={`w-full px-6 py-3 rounded-lg font-mono font-bold transition-all ${
                plan.recommended
                  ? 'bg-green-400 text-black hover:bg-green-300 border-2 border-green-400'
                  : 'bg-green-500/20 text-green-300 hover:bg-green-500/30 border-2 border-green-500/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              {'> '}Select {plan.name}
            </motion.button>

            {/* Scanning line effect on hover */}
            {hoveredPlan === plan.name && (
              <motion.div
                className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent"
                initial={{ top: 0, opacity: 0 }}
                animate={{ top: '100%', opacity: [0, 1, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{
                  boxShadow: '0 0 10px rgba(0, 255, 0, 0.8)',
                }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
