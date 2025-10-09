import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  position: { angle: number; distance: number }; // FIXED polar coordinates
  type: 'profile' | 'skill' | 'project' | 'contact' | 'experience';
  lastDetected: number; // Timestamp of last detection for phosphor fade
}

export default function ScannerProgram({ onExit, onNavigate }: ScannerProgramProps) {
  const isMobile = useIsMobile();
  const [radarAngle, setRadarAngle] = useState(0);
  const [targets, setTargets] = useState<ScanTarget[]>([
    {
      id: 'about',
      label: 'PROFILE.DAT',
      description: 'Personal information and biography',
      section: 'about',
      position: { angle: 45, distance: 60 }, // FIXED position
      type: 'profile',
      lastDetected: 0
    },
    {
      id: 'skills',
      label: 'SKILLS.SYS',
      description: 'Technical capabilities and expertise',
      section: 'skills',
      position: { angle: 120, distance: 75 },
      type: 'skill',
      lastDetected: 0
    },
    {
      id: 'projects',
      label: 'PROJECTS.DB',
      description: 'Portfolio of completed work',
      section: 'projects',
      position: { angle: 200, distance: 65 },
      type: 'project',
      lastDetected: 0
    },
    {
      id: 'experience',
      label: 'EXPERIENCE.LOG',
      description: 'Professional work history',
      section: 'experience',
      position: { angle: 290, distance: 70 },
      type: 'experience',
      lastDetected: 0
    },
    {
      id: 'contact',
      label: 'CONTACT.EXE',
      description: 'Communication channels',
      section: 'contact',
      position: { angle: 340, distance: 55 },
      type: 'contact',
      lastDetected: 0
    }
  ]);
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'q') {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  // Radar sweep animation
  useEffect(() => {
    const interval = setInterval(() => {
      setRadarAngle(prev => {
        const newAngle = (prev + 2) % 360;

        // Check if beam is passing over any targets
        setTargets(prevTargets =>
          prevTargets.map(target => {
            // Calculate if radar beam is passing over this target
            // Handle wrap-around at 360/0 degrees
            const angleDiff = Math.abs(newAngle - target.position.angle);
            const normalizedDiff = Math.min(angleDiff, 360 - angleDiff);
            const isInBeam = normalizedDiff <= 12; // 12 degree detection arc

            if (isInBeam) {
              // Target detected! Update last detection time
              return { ...target, lastDetected: Date.now() };
            }

            return target;
          })
        );

        return newAngle;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const getTargetColor = (type: string) => {
    switch (type) {
      case 'profile':
        return '#00ffff';
      case 'skill':
        return '#00ff00';
      case 'project':
        return '#ffff00';
      case 'experience':
        return '#ff8800';
      case 'contact':
        return '#ff00ff';
      default:
        return '#00ff00';
    }
  };

  const handleTargetClick = (target: ScanTarget) => {
    setSelectedTarget(target.id);
  };

  const handleUnlock = () => {
    setSelectedTarget(null);
  };

  const handleNavigate = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    }
  };

  // Convert polar to cartesian coordinates
  const polarToCartesian = (angle: number, distance: number) => {
    const radians = (angle - 90) * (Math.PI / 180);
    return {
      x: 50 + distance * Math.cos(radians) * 0.35, // Reduced from 0.85 to 0.35
      y: 50 + distance * Math.sin(radians) * 0.35
    };
  };

  // Calculate phosphor fade based on time since last detection
  const getPhosphorIntensity = (lastDetected: number) => {
    if (lastDetected === 0) return 0;
    const timeSinceDetection = Date.now() - lastDetected;
    const fadeTime = 2000; // 2 seconds to fade completely
    return Math.max(0, 1 - timeSinceDetection / fadeTime);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="bg-cyan-500/10 border-b border-cyan-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-cyan-400 font-mono text-sm">RADAR SCANNER v3.0.1</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-cyan-400/60 font-mono text-xs">
            BEARING: {Math.floor(radarAngle)}° | SWEEP: 2.4 RPM
          </span>
          <button
            onClick={onExit}
            className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 font-mono text-xs hover:bg-red-500/30 transition-colors"
          >
            EXIT [ESC]
          </button>
        </div>
      </div>

      {/* Radar Display Container */}
      <div className="flex-1 relative overflow-hidden flex items-center justify-center p-8"
        style={{
          background: 'radial-gradient(circle at center, #001a1a 0%, #000000 100%)'
        }}
      >
        {/* Circular Radar Display */}
        <div className="relative w-full max-w-[700px] aspect-square">
          {/* Radar screen with CRT effect */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at center, rgba(0, 30, 30, 0.8) 0%, rgba(0, 15, 15, 0.95) 70%, black 100%)',
              boxShadow: `
                0 0 80px rgba(0, 255, 255, 0.3),
                inset 0 0 100px rgba(0, 255, 255, 0.05),
                inset 0 0 30px rgba(0, 0, 0, 0.8)
              `,
              border: '3px solid rgba(0, 255, 255, 0.3)',
            }}
          />

          {/* Scanline overlay for CRT effect */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none opacity-20"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                rgba(0, 0, 0, 0.1) 0px,
                rgba(0, 0, 0, 0.1) 1px,
                transparent 1px,
                transparent 2px
              )`
            }}
          />

          {/* Concentric range rings */}
          {[20, 40, 60, 80].map((radius, i) => (
            <div
              key={`circle-${i}`}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border"
              style={{
                width: `${radius}%`,
                height: `${radius}%`,
                borderColor: `rgba(0, 255, 255, ${0.15 - i * 0.02})`,
                boxShadow: i === 3 ? `0 0 10px rgba(0, 255, 255, 0.2)` : 'none'
              }}
            />
          ))}

          {/* Cardinal direction lines */}
          <div className="absolute inset-0">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <div
                key={`line-${angle}`}
                className="absolute top-1/2 left-1/2 origin-left"
                style={{
                  width: '50%',
                  height: '1px',
                  background: `linear-gradient(90deg, rgba(0, 255, 255, 0.25) 0%, rgba(0, 255, 255, 0.1) 50%, transparent 100%)`,
                  transform: `rotate(${angle}deg)`,
                }}
              />
            ))}
          </div>

          {/* Direction labels */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 text-cyan-400/80 font-mono text-sm font-bold">0°</div>
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-cyan-400/60 font-mono text-xs">180°</div>
          <div className="absolute top-1/2 right-3 -translate-y-1/2 text-cyan-400/60 font-mono text-xs">90°</div>
          <div className="absolute top-1/2 left-3 -translate-y-1/2 text-cyan-400/60 font-mono text-xs">270°</div>

          {/* Radar sweep beam with proper fade */}
          <div
            className="absolute top-1/2 left-1/2 w-1/2 origin-left pointer-events-none"
            style={{
              height: '2px',
              background: 'linear-gradient(90deg, rgba(0, 255, 255, 0.9) 0%, rgba(0, 255, 255, 0.6) 30%, rgba(0, 255, 255, 0.3) 60%, transparent 100%)',
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.8), 0 0 30px rgba(0, 255, 255, 0.4)',
              transform: `rotate(${radarAngle - 90}deg)`,
            }}
          />

          {/* Sweep fade trail (conic gradient) */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: `conic-gradient(
                from ${radarAngle - 60}deg at 50% 50%,
                transparent 0deg,
                rgba(0, 255, 255, 0.03) 15deg,
                rgba(0, 255, 255, 0.06) 30deg,
                rgba(0, 255, 255, 0.12) 45deg,
                rgba(0, 255, 255, 0.2) 60deg,
                transparent 60.1deg
              )`,
            }}
          />

          {/* Radar targets - FIXED positions with phosphor persistence */}
          {targets.map((target, index) => {
            const pos = polarToCartesian(target.position.angle, target.position.distance);
            const color = getTargetColor(target.type);
            const isSelected = selectedTarget === target.id;
            const phosphorIntensity = getPhosphorIntensity(target.lastDetected);
            const isJustDetected = phosphorIntensity > 0.8;

            // Don't render if not detected and not selected
            if (phosphorIntensity === 0 && !isSelected) return null;

            return (
              <motion.div
                key={target.id}
                className="absolute"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Larger clickable area */}
                <div
                  className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 left-0 top-0 cursor-pointer"
                  onClick={() => handleTargetClick(target)}
                />
                {/* Detection flash when beam hits */}
                {isJustDetected && (
                  <motion.div
                    className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 left-0 top-0"
                    style={{
                      backgroundColor: color,
                      width: '50px',
                      height: '50px',
                      filter: 'blur(8px)',
                    }}
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                )}

                {/* Phosphor glow (fades over time) */}
                <motion.div
                  className="absolute rounded-full -translate-x-1/2 -translate-y-1/2 left-0 top-0"
                  style={{
                    backgroundColor: color,
                    width: '20px',
                    height: '20px',
                    filter: 'blur(6px)',
                    opacity: phosphorIntensity * 0.6,
                  }}
                />

                {/* Target blip (core dot) */}
                <motion.div
                  className="absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 left-0 top-0"
                  style={{
                    backgroundColor: color,
                    boxShadow: `0 0 8px ${color}`,
                    opacity: Math.max(phosphorIntensity, isSelected ? 1 : 0),
                  }}
                  animate={isSelected ? {
                    scale: [1, 1.5, 1],
                  } : {}}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                />

                {/* Selection ring */}
                {isSelected && (
                  <motion.div
                    className="absolute rounded-full border-2 -translate-x-1/2 -translate-y-1/2 left-0 top-0"
                    style={{
                      width: '30px',
                      height: '30px',
                      borderColor: color,
                    }}
                    animate={{
                      scale: [1, 1.6, 1],
                      opacity: [0.8, 0.4, 0.8],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                  />
                )}

                {/* Target label - only show when detected or selected */}
                {(phosphorIntensity > 0.3 || isSelected) && !isSelected && (
                  <motion.div
                    className="absolute top-4 left-0 -translate-x-1/2 whitespace-nowrap pointer-events-none"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{
                      opacity: phosphorIntensity * 0.9,
                      y: 0
                    }}
                  >
                    <div
                      className="font-mono text-[10px] px-2 py-0.5 rounded border backdrop-blur-sm"
                      style={{
                        color: color,
                        borderColor: color,
                        backgroundColor: `rgba(0, 0, 0, 0.7)`,
                        boxShadow: isJustDetected ? `0 0 12px ${color}` : `0 0 6px ${color}40`,
                      }}
                    >
                      {target.label}
                    </div>
                  </motion.div>
                )}

                {/* Callout popup - appears to the side when selected */}
                {isSelected && (
                  <>
                    {/* Connecting line */}
                    <motion.div
                      className="absolute pointer-events-none"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      exit={{ opacity: 0, scaleX: 0 }}
                      style={{
                        left: '0',
                        top: '0',
                        width: '80px',
                        height: '1px',
                        backgroundColor: color,
                        transformOrigin: 'left',
                        boxShadow: `0 0 8px ${color}`,
                      }}
                    />

                    {/* Callout popup card */}
                    <motion.div
                      className="absolute left-20 top-1/2 -translate-y-1/2 pointer-events-auto z-20"
                      initial={{ opacity: 0, x: -20, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: -20, scale: 0.8 }}
                      transition={{ type: 'spring', damping: 20 }}
                    >
                      <div
                        className="w-64 p-4 rounded-lg border backdrop-blur-md"
                        style={{
                          backgroundColor: 'rgba(0, 0, 0, 0.75)',
                          borderColor: color,
                          boxShadow: `0 0 20px ${color}40, inset 0 0 20px rgba(0, 0, 0, 0.5)`,
                        }}
                      >
                        {/* Close button */}
                        <button
                          onClick={handleUnlock}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold hover:scale-110 transition-transform"
                          style={{
                            backgroundColor: color,
                            color: '#000',
                          }}
                        >
                          ×
                        </button>

                        {/* Title */}
                        <div
                          className="font-mono text-sm font-bold mb-2"
                          style={{ color }}
                        >
                          {target.label}
                        </div>

                        {/* Description */}
                        <div className="text-cyan-400/80 font-mono text-xs mb-3">
                          {target.description}
                        </div>

                        {/* Stats */}
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

                        {/* Access button */}
                        <button
                          onClick={() => handleNavigate(target.section)}
                          className="w-full py-2 rounded font-mono text-xs font-bold transition-all"
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
          })}

          {/* Center origin point */}
          <div
            className="absolute top-1/2 left-1/2 w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400"
            style={{
              boxShadow: '0 0 15px rgba(0, 255, 255, 0.9), 0 0 30px rgba(0, 255, 255, 0.5)',
            }}
          />
        </div>

        {/* Status displays */}
        <div className="absolute top-20 left-4 text-cyan-400/70 font-mono text-xs space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>SYSTEM ACTIVE</span>
          </div>
          <div>RANGE: 100 km</div>
          <div>REFRESH: 30 Hz</div>
          <div>TARGETS: {targets.filter(t => getPhosphorIntensity(t.lastDetected) > 0).length}/{targets.length}</div>
        </div>

        <div className="absolute top-20 right-4 text-cyan-400/70 font-mono text-xs text-right space-y-1.5">
          <div>MODE: SURVEILLANCE</div>
          <div>GAIN: AUTO</div>
          <div>CLUTTER: FILTERED</div>
          <div>WEATHER: CLEAR</div>
        </div>
      </div>

      {/* Instructions */}
      {!selectedTarget && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-cyan-400/60 font-mono text-xs text-center">
          {isMobile ? 'TAP DETECTED TARGETS TO LOCK' : 'CLICK DETECTED TARGET TO LOCK • ESC TO EXIT'}
        </div>
      )}
    </motion.div>
  );
}
