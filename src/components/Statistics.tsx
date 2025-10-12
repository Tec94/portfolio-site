import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import BlurReveal from './BlurReveal';
import Award from 'lucide-react/dist/esm/icons/award';
import Users from 'lucide-react/dist/esm/icons/users';
import Code2 from 'lucide-react/dist/esm/icons/code-2';
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up';

export default function Statistics() {
  const stats = [
    {
      icon: Code2,
      value: 15,
      suffix: "+",
      label: "Projects Completed",
      color: "green"
    },
    {
      icon: Users,
      value: 3,
      suffix: "",
      label: "Companies Worked With",
      color: "green"
    },
    {
      icon: Award,
      value: 98,
      suffix: "%",
      label: "Code Quality Score",
      color: "green"
    },
    {
      icon: TrendingUp,
      value: 70,
      suffix: "%",
      label: "Avg. Performance Gain",
      color: "green"
    }
  ];

  return (
    <section className="py-16 relative">
      {/* Data stream background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, rgba(0, 255, 0, 0.1) 0px, transparent 2px, transparent 10px),
              repeating-linear-gradient(90deg, rgba(0, 255, 0, 0.1) 0px, transparent 2px, transparent 10px)
            `,
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface StatCardProps {
  stat: {
    icon: React.ComponentType<{ className?: string }>;
    value: number;
    suffix: string;
    label: string;
    color: string;
  };
  index: number;
}

function StatCard({ stat, index }: StatCardProps) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
      const duration = 2000; // 2 seconds
      const steps = 60;
      const increment = stat.value / steps;
      const stepDuration = duration / steps;

      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          setCount(stat.value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(current));
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [isInView, stat.value, hasAnimated]);

  return (
    <BlurReveal delay={index * 0.1}>
      <motion.div
        ref={ref}
        className="relative p-4 sm:p-6 border-2 border-green-500/40 rounded-lg bg-black/70 backdrop-blur-sm overflow-hidden group"
        style={{
          boxShadow: '0 0 20px rgba(0, 255, 0, 0.15), inset 0 0 20px rgba(0, 255, 0, 0.05)',
        }}
        whileHover={{
          y: -4,
          borderColor: 'rgba(0, 255, 0, 0.6)',
          boxShadow: '0 0 30px rgba(0, 255, 0, 0.3), inset 0 0 30px rgba(0, 255, 0, 0.08)',
        }}
        transition={{ duration: 0.15 }}
      >
        {/* Corner brackets */}
        <div className="absolute top-1 left-1 w-2 h-2 border-l-2 border-t-2 border-green-500" />
        <div className="absolute top-1 right-1 w-2 h-2 border-r-2 border-t-2 border-green-500" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-l-2 border-b-2 border-green-500" />
        <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-green-500" />

        {/* Icon */}
        <div className="flex justify-center mb-3">
          <motion.div
            className="p-2 bg-green-500/10 border border-green-500/30 rounded-lg"
            whileHover={{
              scale: 1.1,
              borderColor: 'rgba(0, 255, 0, 0.6)',
              boxShadow: '0 0 15px rgba(0, 255, 0, 0.4)'
            }}
          >
            <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-green-400" style={{
              filter: 'drop-shadow(0 0 4px rgba(0, 255, 0, 0.5))'
            }} />
          </motion.div>
        </div>

        {/* Value */}
        <div className="text-center mb-2">
          <motion.span
            className="text-3xl sm:text-4xl font-bold text-green-300 font-mono"
            style={{
              textShadow: '0 0 15px rgba(0, 255, 0, 0.6)',
            }}
          >
            {count}{stat.suffix}
          </motion.span>
        </div>

        {/* Label */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-green-400/80 font-mono">
            {stat.label}
          </p>
        </div>

        {/* Scanning line effect on hover */}
        <motion.div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-100"
          initial={{ top: 0 }}
          animate={{ top: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          style={{
            boxShadow: '0 0 10px rgba(0, 255, 0, 0.8)',
          }}
        />

        {/* Pulsing background effect */}
        <motion.div
          className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100"
          animate={{
            opacity: [0, 0.1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
    </BlurReveal>
  );
}
