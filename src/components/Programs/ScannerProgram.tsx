import React, { useEffect, useRef, useState } from 'react';
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
  position: { x: number; y: number };
  type: 'profile' | 'skill' | 'project' | 'contact';
}

export default function ScannerProgram({ onExit, onNavigate }: ScannerProgramProps) {
  const isMobile = useIsMobile();
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [hoveredTarget, setHoveredTarget] = useState<string | null>(null);
  const [lockedTarget, setLockedTarget] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const scanIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Scannable targets
  const targets: ScanTarget[] = [
    {
      id: 'about',
      label: 'PROFILE.DAT',
      description: 'Personal information and biography',
      section: 'about',
      position: { x: 20, y: 30 },
      type: 'profile'
    },
    {
      id: 'skills',
      label: 'SKILLS.SYS',
      description: 'Technical capabilities and expertise',
      section: 'skills',
      position: { x: 75, y: 25 },
      type: 'skill'
    },
    {
      id: 'projects',
      label: 'PROJECTS.DB',
      description: 'Portfolio of completed work',
      section: 'projects',
      position: { x: 45, y: 60 },
      type: 'project'
    },
    {
      id: 'experience',
      label: 'EXPERIENCE.LOG',
      description: 'Professional work history',
      section: 'experience',
      position: { x: 25, y: 75 },
      type: 'skill'
    },
    {
      id: 'contact',
      label: 'CONTACT.EXE',
      description: 'Communication channels',
      section: 'contact',
      position: { x: 70, y: 70 },
      type: 'contact'
    }
  ];

  // Handle escape key and q key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'q') {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

  // Track cursor position
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  // Handle scanning progress
  useEffect(() => {
    if (hoveredTarget && !lockedTarget) {
      // Start scanning
      setScanProgress(0);
      scanIntervalRef.current = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            if (scanIntervalRef.current) {
              clearInterval(scanIntervalRef.current);
            }
            return 100;
          }
          return prev + 2;
        });
      }, 20);
    } else {
      // Reset scanning
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
      setScanProgress(0);
    }

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [hoveredTarget, lockedTarget]);

  const handleTargetClick = (target: ScanTarget) => {
    if (scanProgress >= 100) {
      setLockedTarget(target.id);
      setShowDetails(true);
    }
  };

  const handleUnlock = () => {
    setLockedTarget(null);
    setShowDetails(false);
    setScanProgress(0);
  };

  const handleNavigate = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    }
  };

  const getTargetColor = (type: string) => {
    switch (type) {
      case 'profile':
        return '#00ffff'; // Cyan
      case 'skill':
        return '#00ff00'; // Green
      case 'project':
        return '#ffff00'; // Yellow
      case 'contact':
        return '#ff00ff'; // Magenta
      default:
        return '#00ff00';
    }
  };

  const lockedTargetData = targets.find(t => t.id === lockedTarget);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden"
    >
      {/* Custom Cursor (Desktop only) */}
      {!isMobile && (
        <motion.div
          className="fixed pointer-events-none z-[100] mix-blend-screen"
          style={{
            left: cursorPosition.x,
            top: cursorPosition.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Crosshair */}
          <svg width="60" height="60" className="animate-spin-slow">
            {/* Outer ring */}
            <circle
              cx="30"
              cy="30"
              r="25"
              fill="none"
              stroke="#00ff00"
              strokeWidth="1"
              opacity="0.6"
            />
            {/* Inner ring */}
            <circle
              cx="30"
              cy="30"
              r="15"
              fill="none"
              stroke="#00ff00"
              strokeWidth="1"
              opacity="0.4"
            />
            {/* Crosshair lines */}
            <line x1="30" y1="0" x2="30" y2="10" stroke="#00ff00" strokeWidth="2" />
            <line x1="30" y1="50" x2="30" y2="60" stroke="#00ff00" strokeWidth="2" />
            <line x1="0" y1="30" x2="10" y2="30" stroke="#00ff00" strokeWidth="2" />
            <line x1="50" y1="30" x2="60" y2="30" stroke="#00ff00" strokeWidth="2" />
            {/* Corner brackets */}
            <path d="M5,5 L5,15 M5,5 L15,5" stroke="#00ff00" strokeWidth="2" fill="none" />
            <path d="M55,5 L55,15 M55,5 L45,5" stroke="#00ff00" strokeWidth="2" fill="none" />
            <path d="M5,55 L5,45 M5,55 L15,55" stroke="#00ff00" strokeWidth="2" fill="none" />
            <path d="M55,55 L55,45 M55,55 L45,55" stroke="#00ff00" strokeWidth="2" fill="none" />
          </svg>

          {/* Scanning indicator */}
          {hoveredTarget && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-16 left-1/2 -translate-x-1/2 whitespace-nowrap"
            >
              <div className="bg-green-500/20 border border-green-500 px-3 py-1 rounded">
                <div className="text-green-400 font-mono text-xs">
                  SCANNING... {Math.floor(scanProgress)}%
                </div>
                <div className="w-32 h-1 bg-green-900/50 mt-1 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-green-400"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Header */}
      <div className="bg-cyan-500/10 border-b border-cyan-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <span className="text-cyan-400 font-mono text-sm">AR SCANNER v2.3.1</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-cyan-400/60 font-mono text-xs">
            TARGETS: {targets.length} | LOCKED: {lockedTarget ? '1' : '0'}
          </span>
          <button
            onClick={onExit}
            className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 font-mono text-xs hover:bg-red-500/30 transition-colors"
          >
            EXIT [ESC]
          </button>
        </div>
      </div>

      {/* Scanner View */}
      <div className="flex-1 relative overflow-hidden cursor-none">
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 255, 255, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 255, 255, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Scan line effect */}
        <motion.div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50"
          animate={{
            top: ['0%', '100%'],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Scannable Targets */}
        {targets.map((target, index) => {
          const isHovered = hoveredTarget === target.id;
          const isLocked = lockedTarget === target.id;
          const color = getTargetColor(target.type);

          return (
            <motion.div
              key={target.id}
              className="absolute"
              style={{
                left: `${target.position.x}%`,
                top: `${target.position.y}%`,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => !lockedTarget && setHoveredTarget(target.id)}
              onMouseLeave={() => !lockedTarget && setHoveredTarget(null)}
              onClick={() => handleTargetClick(target)}
            >
              {/* Target marker */}
              <div className="relative">
                {/* Pulsing outer ring */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: color }}
                  animate={isHovered || isLocked ? {
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 0, 0.5],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />

                {/* Main target circle */}
                <motion.div
                  className="w-16 h-16 rounded-full border-2 flex items-center justify-center cursor-pointer"
                  style={{
                    borderColor: color,
                    backgroundColor: isLocked ? `${color}40` : `${color}20`,
                  }}
                  animate={isHovered || isLocked ? { scale: 1.2 } : { scale: 1 }}
                  whileHover={{ scale: 1.3 }}
                >
                  {/* Icon based on type */}
                  <span className="text-2xl">
                    {target.type === 'profile' && '👤'}
                    {target.type === 'skill' && '⚡'}
                    {target.type === 'project' && '💼'}
                    {target.type === 'contact' && '📡'}
                  </span>
                </motion.div>

                {/* Label */}
                <motion.div
                  className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div
                    className="font-mono text-xs px-2 py-1 rounded border"
                    style={{
                      color: color,
                      borderColor: color,
                      backgroundColor: `${color}20`,
                    }}
                  >
                    {target.label}
                  </div>
                </motion.div>

                {/* Scan progress ring */}
                {isHovered && scanProgress > 0 && (
                  <svg
                    className="absolute inset-0 w-16 h-16 -rotate-90"
                    style={{ left: 0, top: 0 }}
                  >
                    <circle
                      cx="32"
                      cy="32"
                      r="30"
                      fill="none"
                      stroke={color}
                      strokeWidth="3"
                      strokeDasharray={`${(scanProgress / 100) * 188.4} 188.4`}
                      opacity="0.8"
                    />
                  </svg>
                )}

                {/* Lock indicator */}
                {isLocked && (
                  <motion.div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center"
                    style={{
                      borderColor: color,
                      backgroundColor: color,
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <span className="text-black text-xs">🔒</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}

        {/* Corner UI elements */}
        <div className="absolute top-4 left-4 text-cyan-400 font-mono text-xs space-y-1 opacity-60">
          <div>SCAN MODE: ACTIVE</div>
          <div>FPS: 60</div>
          <div>RESOLUTION: {isMobile ? 'MOBILE' : 'DESKTOP'}</div>
        </div>

        <div className="absolute top-4 right-4 text-cyan-400 font-mono text-xs text-right space-y-1 opacity-60">
          <div>SENSITIVITY: 100%</div>
          <div>INTERFERENCE: NONE</div>
          <div>STATUS: NOMINAL</div>
        </div>
      </div>

      {/* Details Panel */}
      <AnimatePresence>
        {showDetails && lockedTargetData && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25 }}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-cyan-950/50 to-transparent border-t border-cyan-500/30 p-6"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div
                    className="font-mono text-2xl font-bold mb-2"
                    style={{ color: getTargetColor(lockedTargetData.type) }}
                  >
                    {lockedTargetData.label}
                  </div>
                  <div className="text-cyan-400/80 font-mono text-sm">
                    {lockedTargetData.description}
                  </div>
                </div>
                <button
                  onClick={handleUnlock}
                  className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/50 rounded text-cyan-400 font-mono text-xs hover:bg-cyan-500/30 transition-colors"
                >
                  UNLOCK
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded p-3">
                  <div className="text-cyan-400/60 font-mono text-xs mb-1">TYPE</div>
                  <div className="text-cyan-400 font-mono text-sm uppercase">
                    {lockedTargetData.type}
                  </div>
                </div>
                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded p-3">
                  <div className="text-cyan-400/60 font-mono text-xs mb-1">SECTION</div>
                  <div className="text-cyan-400 font-mono text-sm uppercase">
                    {lockedTargetData.section}
                  </div>
                </div>
                <div className="bg-cyan-500/5 border border-cyan-500/20 rounded p-3">
                  <div className="text-cyan-400/60 font-mono text-xs mb-1">ACCESS</div>
                  <div className="text-green-400 font-mono text-sm">GRANTED</div>
                </div>
              </div>

              <button
                onClick={() => handleNavigate(lockedTargetData.section)}
                className="w-full px-4 py-3 bg-cyan-500/20 border border-cyan-500/50 rounded text-cyan-400 font-mono text-sm hover:bg-cyan-500/30 transition-colors"
              >
                ACCESS DATA → {lockedTargetData.section.toUpperCase()}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      {!lockedTarget && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-cyan-400/60 font-mono text-xs text-center">
          {isMobile ? 'TAP TARGETS TO SCAN AND LOCK' : 'HOVER TO SCAN • CLICK TO LOCK • ESC TO EXIT'}
        </div>
      )}

      {/* Add custom cursor hide for desktop */}
      <style>{`
        .cursor-none {
          cursor: none !important;
        }
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </motion.div>
  );
}
