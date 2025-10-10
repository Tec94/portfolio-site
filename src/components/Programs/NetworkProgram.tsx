import React, { useEffect, useRef, useState, useCallback, useMemo, memo } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { useIsMobile } from '../../hooks/useMediaQuery';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface NetworkProgramProps {
  onExit: () => void;
  onNavigate?: (section: string) => void;
}

interface Node {
  id: string;
  label: string;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  section: string;
  connections: string[];
}

// Move static data outside component to prevent recreation
const NETWORK_NODES: Node[] = [
  {
    id: 'about',
    label: 'ABOUT',
    position: new THREE.Vector3(0, 50, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    section: 'about',
    connections: ['skills', 'contact']
  },
  {
    id: 'projects',
    label: 'PROJECTS',
    position: new THREE.Vector3(100, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    section: 'projects',
    connections: ['skills', 'about']
  },
  {
    id: 'skills',
    label: 'SKILLS',
    position: new THREE.Vector3(0, -50, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    section: 'skills',
    connections: ['about', 'projects', 'experience']
  },
  {
    id: 'experience',
    label: 'EXPERIENCE',
    position: new THREE.Vector3(-100, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    section: 'experience',
    connections: ['skills', 'contact']
  },
  {
    id: 'contact',
    label: 'CONTACT',
    position: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    section: 'contact',
    connections: ['about', 'experience']
  }
];

export default function NetworkProgram({ onExit, onNavigate }: NetworkProgramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const nodesRef = useRef<Node[]>(NETWORK_NODES);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Memoize handleKeyDown to prevent recreation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' || e.key.toLowerCase() === 'q') {
      onExit();
    }
  }, [onExit]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleNodeClick = useCallback((nodeId: string) => {
    setSelectedNode(nodeId);
    const node = NETWORK_NODES.find(n => n.id === nodeId);
    if (node && onNavigate) {
      onNavigate(node.section);
    }
  }, [onNavigate]);

  // Calculate total connections count
  const totalConnections = useMemo(() =>
    NETWORK_NODES.reduce((sum, n) => sum + n.connections.length, 0),
    []
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      {/* Header */}
      <div className="bg-green-500/10 border-b border-green-500/30 px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-400 font-mono text-xs sm:text-sm">NETWORK MAP v1.0</span>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          {!isMobile && (
            <span className="text-green-400/60 font-mono text-xs">
              {selectedNode ? `SELECTED: ${selectedNode.toUpperCase()}` : 'HOVER TO SELECT'}
            </span>
          )}
          <button
            onClick={onExit}
            className="px-2 sm:px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 font-mono text-[10px] sm:text-xs hover:bg-red-500/30 transition-colors"
          >
            EXIT {!isMobile && '[ESC]'}
          </button>
        </div>
      </div>

      {/* Network Visualization Canvas */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <svg className="w-full h-full">
          {/* Draw connections */}
          <g>
            {NETWORK_NODES.map(node =>
              node.connections.map(connId => {
                const targetNode = NETWORK_NODES.find(n => n.id === connId);
                if (!targetNode) return null;

                const isActive = selectedNode === node.id || selectedNode === connId;

                return (
                  <motion.line
                    key={`${node.id}-${connId}`}
                    x1={`${((node.position.x + 200) / 400) * 100}%`}
                    y1={`${((node.position.y + 200) / 400) * 100}%`}
                    x2={`${((targetNode.position.x + 200) / 400) * 100}%`}
                    y2={`${((targetNode.position.y + 200) / 400) * 100}%`}
                    stroke={isActive ? '#00ff00' : '#00ff0040'}
                    strokeWidth={isActive ? 2 : 1}
                    initial={{ pathLength: 0 }}
                    animate={{
                      pathLength: 1,
                      opacity: isActive ? 1 : 0.3
                    }}
                    transition={{ duration: 0.5 }}
                  />
                );
              })
            )}
          </g>

          {/* Draw nodes */}
          <g>
            {NETWORK_NODES.map((node, index) => {
              const isSelected = selectedNode === node.id;
              const x = ((node.position.x + 200) / 400) * 100;
              const y = ((node.position.y + 200) / 400) * 100;

              return (
                <g
                  key={node.id}
                  onMouseEnter={() => setSelectedNode(node.id)}
                  onMouseLeave={() => !isDragging && setSelectedNode(null)}
                  onClick={() => handleNodeClick(node.id)}
                  className="cursor-pointer"
                >
                  {/* Multiple pulsing rings */}
                  {[60, 50, 40].map((r, i) => (
                    <motion.circle
                      key={`ring-${i}`}
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r={r}
                      fill="none"
                      stroke="#00ff00"
                      strokeWidth="1"
                      opacity="0"
                      animate={isSelected ? {
                        scale: [0.5, 1.5, 0.5],
                        opacity: [0.6, 0, 0.6]
                      } : {}}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.3
                      }}
                    />
                  ))}

                  {/* Outer hexagon */}
                  <motion.path
                    d={`M ${x},${y - 35} L ${x + 30},${y - 17.5} L ${x + 30},${y + 17.5} L ${x},${y + 35} L ${x - 30},${y + 17.5} L ${x - 30},${y - 17.5} Z`}
                    fill="none"
                    stroke="#00ff00"
                    strokeWidth={isSelected ? "2" : "1"}
                    opacity={isSelected ? 0.8 : 0.3}
                    initial={{ rotate: 0 }}
                    animate={{
                      rotate: 360,
                      opacity: isSelected ? [0.8, 0.4, 0.8] : 0.3
                    }}
                    transition={{
                      rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                      opacity: { duration: 2, repeat: Infinity }
                    }}
                    style={{
                      transformOrigin: `${x}% ${y}%`,
                      filter: isSelected ? 'drop-shadow(0 0 8px #00ff00)' : 'none'
                    }}
                  />

                  {/* Inner rotating ring with data points */}
                  {isSelected && (
                    <>
                      {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                        const radians = (angle * Math.PI) / 180;
                        const px = x + Math.cos(radians) * 25;
                        const py = y + Math.sin(radians) * 25;
                        return (
                          <motion.circle
                            key={`data-point-${i}`}
                            cx={px}
                            cy={py}
                            r="2"
                            fill="#00ff00"
                            initial={{ opacity: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0.5, 1.2, 0.5]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                            style={{
                              filter: 'drop-shadow(0 0 4px #00ff00)'
                            }}
                          />
                        );
                      })}
                    </>
                  )}

                  {/* Core node with layered effects */}
                  <motion.circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r={isSelected ? "32" : "28"}
                    fill="url(#nodeGradient)"
                    stroke="#00ff00"
                    strokeWidth={isSelected ? 3 : 2}
                    initial={{ scale: 0 }}
                    animate={{
                      scale: 1,
                      boxShadow: isSelected
                        ? ['0 0 20px #00ff00', '0 0 40px #00ff00', '0 0 20px #00ff00']
                        : '0 0 10px #00ff00'
                    }}
                    transition={{
                      scale: { delay: index * 0.1 },
                      boxShadow: { duration: 2, repeat: Infinity }
                    }}
                    whileHover={{ scale: 1.2 }}
                    style={{
                      filter: isSelected
                        ? 'drop-shadow(0 0 12px #00ff00) drop-shadow(0 0 20px #00ff00aa)'
                        : 'drop-shadow(0 0 6px #00ff00)'
                    }}
                  />

                  {/* Inner glow circle */}
                  <motion.circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r={isSelected ? "18" : "15"}
                    fill={isSelected ? '#00ff0060' : '#00ff0030'}
                    animate={isSelected ? {
                      opacity: [0.6, 0.3, 0.6],
                      scale: [0.95, 1.05, 0.95]
                    } : {}}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity
                    }}
                    style={{
                      filter: 'blur(2px)'
                    }}
                  />

                  {/* Label with enhanced styling */}
                  <text
                    x={`${x}%`}
                    y={`${y}%`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-green-400 font-mono font-bold select-none pointer-events-none"
                    style={{
                      fontSize: isSelected ? '14px' : '12px',
                      filter: isSelected ? 'drop-shadow(0 0 6px #00ff00)' : 'drop-shadow(0 0 3px #00ff00)'
                    }}
                  >
                    {node.label}
                  </text>

                  {/* Info badge with animation */}
                  {isSelected && (
                    <motion.text
                      x={`${x}%`}
                      y={`${y + 10}%`}
                      textAnchor="middle"
                      className="fill-green-400/80 font-mono text-[10px] select-none pointer-events-none"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{
                        opacity: [0.8, 1, 0.8],
                        y: [0, -2, 0]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity
                      }}
                      style={{
                        filter: 'drop-shadow(0 0 4px #00ff00)'
                      }}
                    >
                      ▸ CLICK TO NAVIGATE ◂
                    </motion.text>
                  )}

                  {/* Status indicator */}
                  <motion.circle
                    cx={`${x + 20}%`}
                    cy={`${y - 20}%`}
                    r="3"
                    fill="#00ff00"
                    animate={{
                      opacity: [1, 0.3, 1],
                      scale: [1, 1.3, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: index * 0.2
                    }}
                    style={{
                      filter: 'drop-shadow(0 0 6px #00ff00)'
                    }}
                  />
                </g>
              );
            })}
          </g>

          {/* Define gradient for nodes */}
          <defs>
            <radialGradient id="nodeGradient">
              <stop offset="0%" stopColor="#00ff0040" />
              <stop offset="50%" stopColor="#00ff0020" />
              <stop offset="100%" stopColor="#00ff0010" />
            </radialGradient>
          </defs>
        </svg>

        {/* Data packets animation */}
        {!prefersReducedMotion && NETWORK_NODES.map(node =>
          node.connections.map((connId, idx) => {
            const targetNode = NETWORK_NODES.find(n => n.id === connId);
            if (!targetNode) return null;

            const x1 = ((node.position.x + 200) / 400) * 100;
            const y1 = ((node.position.y + 200) / 400) * 100;
            const x2 = ((targetNode.position.x + 200) / 400) * 100;
            const y2 = ((targetNode.position.y + 200) / 400) * 100;

            return (
              <motion.div
                key={`packet-${node.id}-${connId}`}
                className="absolute w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_#00ff00]"
                style={{
                  left: `${x1}%`,
                  top: `${y1}%`,
                }}
                animate={{
                  left: [`${x1}%`, `${x2}%`, `${x1}%`],
                  top: [`${y1}%`, `${y2}%`, `${y1}%`],
                }}
                transition={{
                  duration: 3 + idx,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: idx * 0.5
                }}
              />
            );
          })
        )}
      </div>

      {/* Info Panel */}
      <div className="bg-green-500/5 border-t border-green-500/20 p-2 sm:p-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 font-mono text-[10px] sm:text-xs">
            <div>
              <div className="text-green-400/60">STATUS</div>
              <div className="text-green-400">ONLINE - {NETWORK_NODES.length} NODES</div>
            </div>
            <div>
              <div className="text-green-400/60">CONNECTIONS</div>
              <div className="text-green-400">{totalConnections} ACTIVE</div>
            </div>
            {!isMobile && (
              <div>
                <div className="text-green-400/60">LATENCY</div>
                <div className="text-green-400">12ms AVG</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
