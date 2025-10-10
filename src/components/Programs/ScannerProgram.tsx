import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import { useIsMobile } from '../../hooks/useMediaQuery';

interface ScannerProgramProps {
  onExit: () => void;
  onNavigate?: (section: string) => void;
}

interface ScanTarget {
  id: string;
  label: string;
  description: string;
  section: string;
  position: { angle: number; distance: number };
  type: 'profile' | 'skill' | 'project' | 'contact' | 'experience';
  lastDetected: number;
}

// Move static data outside component to prevent recreation
const INITIAL_TARGETS: Omit<ScanTarget, 'lastDetected'>[] = [
  {
    id: 'about',
    label: 'PROFILE.DAT',
    description: 'Personal information and biography',
    section: 'about',
    position: { angle: 45, distance: 60 },
    type: 'profile',
  },
  {
    id: 'skills',
    label: 'SKILLS.SYS',
    description: 'Technical capabilities and expertise',
    section: 'skills',
    position: { angle: 120, distance: 75 },
    type: 'skill',
  },
  {
    id: 'projects',
    label: 'PROJECTS.DB',
    description: 'Portfolio of completed work',
    section: 'projects',
    position: { angle: 200, distance: 65 },
    type: 'project',
  },
  {
    id: 'experience',
    label: 'EXPERIENCE.LOG',
    description: 'Professional work history',
    section: 'experience',
    position: { angle: 290, distance: 70 },
    type: 'experience',
  },
  {
    id: 'contact',
    label: 'CONTACT.EXE',
    description: 'Communication channels',
    section: 'contact',
    position: { angle: 340, distance: 55 },
    type: 'contact',
  }
];

const TARGET_COLORS = {
  profile: '#00ffff',
  skill: '#00ff00',
  project: '#ffff00',
  experience: '#ff8800',
  contact: '#ff00ff',
} as const;

// Memoized target component for performance
const RadarTarget = memo(({
  target,
  isSelected,
  phosphorIntensity,
  onSelect,
  onNavigate,
  isMobile
}: {
  target: ScanTarget;
  isSelected: boolean;
  phosphorIntensity: number;
  onSelect: () => void;
  onNavigate: (section: string) => void;
  isMobile: boolean;
}) => {
  const polarToCartesian = useCallback((angle: number, distance: number) => {
    const radians = (angle - 90) * (Math.PI / 180);
    return {
      x: 50 + distance * Math.cos(radians) * 0.35,
      y: 50 + distance * Math.sin(radians) * 0.35
    };
  }, []);

  const pos = useMemo(() =>
    polarToCartesian(target.position.angle, target.position.distance),
    [target.position.angle, target.position.distance, polarToCartesian]
  );

  const color = TARGET_COLORS[target.type];
  const isJustDetected = phosphorIntensity > 0.8;

  if (phosphorIntensity === 0 && !isSelected) return null;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${pos.x}%`,
        top: `${pos.y}%`,
        willChange: 'transform',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <div
        className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 left-0 top-0 cursor-pointer"
        onClick={onSelect}
      />

      {isJustDetected && (
        <motion.div
          className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 left-0 top-0 pointer-events-none"
          style={{
            backgroundColor: color,
            width: '50px',
            height: '50px',
            filter: 'blur(8px)',
            willChange: 'transform, opacity',
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      )}

      <div
        className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 left-0 top-0 pointer-events-none"
        style={{
          backgroundColor: color,
          width: '20px',
          height: '20px',
          filter: 'blur(6px)',
          opacity: phosphorIntensity * 0.6,
        }}
      />

      <motion.div
        className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 left-0 top-0 pointer-events-none"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}`,
          opacity: Math.max(phosphorIntensity, isSelected ? 1 : 0),
          willChange: isSelected ? 'transform' : 'auto',
        }}
        animate={isSelected ? { scale: [1, 1.5, 1] } : {}}
        transition={{ duration: 1, repeat: Infinity }}
      />

      {isSelected && (
        <motion.div
          className="absolute rounded-full border-2 -translate-x-1/2 -translate-y-1/2 left-0 top-0 pointer-events-none"
          style={{
            width: '30px',
            height: '30px',
            borderColor: color,
            willChange: 'transform, opacity',
          }}
          animate={{
            scale: [1, 1.6, 1],
            opacity: [0.8, 0.4, 0.8],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}

      {(phosphorIntensity > 0.3 || isSelected) && !isSelected && (
        <motion.div
          className="absolute top-4 left-0 -translate-x-1/2 whitespace-nowrap pointer-events-none"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: phosphorIntensity * 0.9, y: 0 }}
        >
          <div
            className="font-mono text-[10px] px-2 py-0.5 rounded border backdrop-blur-sm"
            style={{
              color: color,
              borderColor: color,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              boxShadow: isJustDetected ? `0 0 12px ${color}` : `0 0 6px ${color}40`,
            }}
          >
            {target.label}
          </div>
        </motion.div>
      )}

      {isSelected && (
        <>
          <motion.div
            className="absolute pointer-events-none"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            style={{
              left: '0',
              top: '0',
              width: isMobile ? '60px' : '80px',
              height: '1px',
              backgroundColor: color,
              transformOrigin: 'left',
              boxShadow: `0 0 8px ${color}`,
            }}
          />

          <motion.div
            className={`absolute ${isMobile ? 'left-16' : 'left-20'} top-1/2 -translate-y-1/2 pointer-events-auto z-20`}
            initial={{ opacity: 0, x: -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
          >
            <div
              className={`${isMobile ? 'w-56' : 'w-64'} p-3 sm:p-4 rounded-lg border backdrop-blur-md`}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                borderColor: color,
                boxShadow: `0 0 20px ${color}40, inset 0 0 20px rgba(0, 0, 0, 0.5)`,
              }}
            >
              <button
                onClick={() => onSelect()}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform"
                style={{
                  backgroundColor: color,
                  color: '#000',
                }}
                aria-label="Close"
              >
                ×
              </button>

              <div className="font-mono text-xs sm:text-sm font-bold mb-2" style={{ color }}>
                {target.label}
              </div>

              <div className="text-cyan-400/80 font-mono text-[10px] sm:text-xs mb-3">
                {target.description}
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div
                  className="p-2 rounded border"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderColor: `${color}40`,
                  }}
                >
                  <div className="text-cyan-400/60 font-mono text-[9px]">BEARING</div>
                  <div className="text-cyan-400 font-mono text-xs font-bold">
                    {Math.floor(target.position.angle)}°
                  </div>
                </div>
                <div
                  className="p-2 rounded border"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    borderColor: `${color}40`,
                  }}
                >
                  <div className="text-cyan-400/60 font-mono text-[9px]">RANGE</div>
                  <div className="text-cyan-400 font-mono text-xs font-bold">
                    {Math.floor(target.position.distance)} km
                  </div>
                </div>
              </div>

              <button
                onClick={() => onNavigate(target.section)}
                className="w-full py-2 rounded font-mono text-xs font-bold transition-all active:scale-95"
                style={{
                  backgroundColor: `${color}20`,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                  borderColor: color,
                  color: color,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${color}40`;
                  e.currentTarget.style.boxShadow = `0 0 15px ${color}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = `${color}20`;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                ACCESS DATA →
              </button>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
});

RadarTarget.displayName = 'RadarTarget';

export default function ScannerProgram({ onExit, onNavigate }: ScannerProgramProps) {
  const isMobile = useIsMobile();
  const [radarAngle, setRadarAngle] = useState(0);
  const [targets, setTargets] = useState<ScanTarget[]>(() =>
    INITIAL_TARGETS.map(t => ({ ...t, lastDetected: 0 }))
  );
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'q') {
        onExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  // Use requestAnimationFrame for smoother animation
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastTime;

      if (deltaTime >= 30) {
        setRadarAngle(prev => {
          const newAngle = (prev + 2) % 360;

          setTargets(prevTargets =>
            prevTargets.map(target => {
              const angleDiff = Math.abs(newAngle - target.position.angle);
              const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);

              if (normalizedDiff <= 12) {
                return { ...target, lastDetected: currentTime };
              }
              return target;
            })
          );

          return newAngle;
        });
        lastTime = currentTime;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const getPhosphorIntensity = useCallback((lastDetected: number) => {
    if (lastDetected === 0) return 0;
    const timeSinceDetection = Date.now() - lastDetected;
    return Math.max(0, 1 - timeSinceDetection / 2000);
  }, []);

  const handleTargetClick = useCallback((targetId: string) => {
    setSelectedTarget(prev => prev === targetId ? null : targetId);
  }, []);

  const handleNavigate = useCallback((section: string) => {
    onNavigate?.(section);
  }, [onNavigate]);

  const visibleTargetCount = useMemo(() =>
    targets.filter(t => getPhosphorIntensity(t.lastDetected) > 0).length,
    [targets, getPhosphorIntensity]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden"
    >
      <div className="bg-cyan-500/10 border-b border-cyan-500/30 px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-cyan-400 font-mono text-xs sm:text-sm">RADAR SCANNER</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <span className="text-cyan-400/60 font-mono text-[10px] sm:text-xs">
            {Math.floor(radarAngle)}°
          </span>
          <button
            onClick={onExit}
            className="px-2 sm:px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 font-mono text-[10px] sm:text-xs hover:bg-red-500/30 transition-colors"
          >
            EXIT
          </button>
        </div>
      </div>

      <div
        className="flex-1 relative overflow-hidden flex items-center justify-center p-4 sm:p-8"
        style={{
          background: 'radial-gradient(circle at center, #001a1a 0%, #000000 100%)'
        }}
      >
        <div className="relative w-full max-w-[700px] aspect-square">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at center, rgba(0, 30, 30, 0.8) 0%, rgba(0, 15, 15, 0.95) 70%, black 100%)',
              boxShadow: '0 0 80px rgba(0, 255, 255, 0.3), inset 0 0 100px rgba(0, 255, 255, 0.05), inset 0 0 30px rgba(0, 0, 0, 0.8)',
              border: '3px solid rgba(0, 255, 255, 0.3)',
            }}
          />

          <div
            className="absolute inset-0 rounded-full pointer-events-none opacity-20"
            style={{
              background: 'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.1) 0px, rgba(0, 0, 0, 0.1) 1px, transparent 1px, transparent 2px)'
            }}
          />

          {[20, 40, 60, 80].map((radius, i) => (
            <div
              key={radius}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border pointer-events-none"
              style={{
                width: `${radius}%`,
                height: `${radius}%`,
                borderColor: `rgba(0, 255, 255, ${0.15 - i * 0.02})`,
                boxShadow: i === 3 ? '0 0 10px rgba(0, 255, 255, 0.2)' : 'none'
              }}
            />
          ))}

          <div className="absolute inset-0 pointer-events-none">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <div
                key={angle}
                className="absolute top-1/2 left-1/2 origin-left"
                style={{
                  width: '50%',
                  height: '1px',
                  background: 'linear-gradient(90deg, rgba(0, 255, 255, 0.25) 0%, rgba(0, 255, 255, 0.1) 50%, transparent 100%)',
                  transform: `rotate(${angle}deg)`,
                }}
              />
            ))}
          </div>

          <div className="absolute top-2 sm:top-3 left-1/2 -translate-x-1/2 text-cyan-400/80 font-mono text-xs sm:text-sm font-bold">0°</div>

          <div
            className="absolute top-1/2 left-1/2 w-1/2 origin-left pointer-events-none"
            style={{
              height: '2px',
              background: 'linear-gradient(90deg, rgba(0, 255, 255, 0.9) 0%, rgba(0, 255, 255, 0.6) 30%, rgba(0, 255, 255, 0.3) 60%, transparent 100%)',
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.4)',
              transform: `rotate(${radarAngle - 90}deg)`,
              willChange: 'transform',
            }}
          />

          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `conic-gradient(from ${radarAngle - 60}deg at 50% 50%, transparent 0deg, rgba(0, 255, 255, 0.03) 15deg, rgba(0, 255, 255, 0.06) 30deg, rgba(0, 255, 255, 0.12) 45deg, rgba(0, 255, 255, 0.2) 60deg, transparent 60.1deg)`,
              willChange: 'background',
            }}
          />

          {targets.map((target) => (
            <RadarTarget
              key={target.id}
              target={target}
              isSelected={selectedTarget === target.id}
              phosphorIntensity={getPhosphorIntensity(target.lastDetected)}
              onSelect={() => handleTargetClick(target.id)}
              onNavigate={handleNavigate}
              isMobile={isMobile}
            />
          ))}

          <div
            className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400 pointer-events-none"
            style={{
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.9), 0 0 30px rgba(0, 255, 255, 0.5)',
            }}
          />
        </div>

        {!isMobile && (
          <>
            <div className="absolute top-20 left-2 sm:left-4 text-cyan-400/70 font-mono text-[10px] sm:text-xs space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span>ACTIVE</span>
              </div>
              <div>TARGETS: {visibleTargetCount}/{targets.length}</div>
            </div>

            <div className="absolute top-20 right-2 sm:right-4 text-cyan-400/70 font-mono text-[10px] sm:text-xs text-right space-y-1">
              <div>SURVEILLANCE</div>
              <div>AUTO GAIN</div>
            </div>
          </>
        )}
      </div>

      {!selectedTarget && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-cyan-400/60 font-mono text-[10px] sm:text-xs text-center px-4">
          {isMobile ? 'TAP TARGETS' : 'CLICK TARGET • ESC TO EXIT'}
        </div>
      )}
    </motion.div>
  );
}
