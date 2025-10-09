import React, { useEffect, useRef, useState } from 'react';
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

export default function NetworkProgram({ onExit, onNavigate }: NetworkProgramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });

  // Node network data
  const networkNodes: Node[] = [
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

  useEffect(() => {
    nodesRef.current = networkNodes;

    // Handle escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key.toLowerCase() === 'q') {
        onExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onExit]);

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

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId);
    const node = networkNodes.find(n => n.id === nodeId);
    if (node && onNavigate) {
      onNavigate(node.section);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      {/* Header */}
      <div className="bg-green-500/10 border-b border-green-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-green-400 font-mono text-sm">NETWORK MAP v1.0</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-green-400/60 font-mono text-xs">
            {selectedNode ? `SELECTED: ${selectedNode.toUpperCase()}` : 'HOVER TO SELECT'}
          </span>
          <button
            onClick={onExit}
            className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 font-mono text-xs hover:bg-red-500/30 transition-colors"
          >
            EXIT [ESC]
          </button>
        </div>
      </div>

      {/* Network Visualization Canvas */}
      <div ref={containerRef} className="flex-1 relative overflow-hidden">
        <svg className="w-full h-full">
          {/* Draw connections */}
          <g>
            {networkNodes.map(node =>
              node.connections.map(connId => {
                const targetNode = networkNodes.find(n => n.id === connId);
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
            {networkNodes.map((node, index) => {
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
                  {/* Glow effect */}
                  {isSelected && (
                    <motion.circle
                      cx={`${x}%`}
                      cy={`${y}%`}
                      r="40"
                      fill="none"
                      stroke="#00ff00"
                      strokeWidth="2"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 0, 0.5]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity
                      }}
                    />
                  )}

                  {/* Node circle */}
                  <motion.circle
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r={isSelected ? "30" : "25"}
                    fill={isSelected ? '#00ff0040' : '#00ff0020'}
                    stroke="#00ff00"
                    strokeWidth={isSelected ? 3 : 2}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.2 }}
                  />

                  {/* Label */}
                  <text
                    x={`${x}%`}
                    y={`${y}%`}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-green-400 font-mono text-xs select-none pointer-events-none"
                    style={{ fontSize: isSelected ? '14px' : '12px' }}
                  >
                    {node.label}
                  </text>

                  {/* Info badge */}
                  {isSelected && (
                    <motion.text
                      x={`${x}%`}
                      y={`${y + 8}%`}
                      textAnchor="middle"
                      className="fill-green-400/60 font-mono text-[10px] select-none pointer-events-none"
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      CLICK TO NAVIGATE
                    </motion.text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Data packets animation */}
        {networkNodes.map(node =>
          node.connections.map((connId, idx) => {
            const targetNode = networkNodes.find(n => n.id === connId);
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
      <div className="bg-green-500/5 border-t border-green-500/20 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            <div>
              <div className="text-green-400/60">NETWORK STATUS</div>
              <div className="text-green-400">ONLINE - {networkNodes.length} NODES</div>
            </div>
            <div>
              <div className="text-green-400/60">CONNECTIONS</div>
              <div className="text-green-400">
                {networkNodes.reduce((sum, n) => sum + n.connections.length, 0)} ACTIVE
              </div>
            </div>
            <div>
              <div className="text-green-400/60">LATENCY</div>
              <div className="text-green-400">12ms AVG</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
