import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '../../hooks/useMediaQuery';

interface BreachProgramProps {
  onExit: () => void;
  onNavigate?: (section: string) => void;
}

type CellType = string;

interface SequenceTarget {
  name: string;
  sequence: string[];
  reward: string;
  section: string;
}

export default function BreachProgram({ onExit, onNavigate }: BreachProgramProps) {
  const isMobile = useIsMobile();
  const MATRIX_SIZE = isMobile ? 4 : 6;
  const BUFFER_SIZE = isMobile ? 4 : 6;
  const TIME_LIMIT = 30; // seconds

  // Generate code sequences
  const CODE_POOL = ['1C', '55', 'E9', 'BD', '7A', 'FF', '2E', '4B', 'A3', 'D6', '0C', '8F'];

  const [matrix, setMatrix] = useState<CellType[][]>([]);
  const [buffer, setBuffer] = useState<string[]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectionMode, setSelectionMode] = useState<'row' | 'col'>('row');
  const [highlightedCells, setHighlightedCells] = useState<Set<string>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState(TIME_LIMIT);
  const [gameState, setGameState] = useState<'playing' | 'success' | 'failed'>('playing');
  const [completedSequences, setCompletedSequences] = useState<Set<string>>(new Set());

  // Target sequences
  const sequences: SequenceTarget[] = [
    {
      name: 'ABOUT.DAT',
      sequence: isMobile ? ['1C', '55'] : ['1C', '55', 'E9'],
      reward: 'Access to personal profile',
      section: 'about'
    },
    {
      name: 'PROJECTS.DB',
      sequence: isMobile ? ['BD', '7A'] : ['BD', '7A', 'FF'],
      reward: 'Access to project portfolio',
      section: 'projects'
    },
    {
      name: 'SKILLS.SYS',
      sequence: isMobile ? ['2E', '4B'] : ['2E', '4B', 'A3'],
      reward: 'Access to skills database',
      section: 'skills'
    }
  ];

  // Initialize matrix
  useEffect(() => {
    const newMatrix: CellType[][] = [];

    for (let i = 0; i < MATRIX_SIZE; i++) {
      const row: CellType[] = [];
      for (let j = 0; j < MATRIX_SIZE; j++) {
        row.push(CODE_POOL[Math.floor(Math.random() * CODE_POOL.length)]);
      }
      newMatrix.push(row);
    }

    // Ensure at least one sequence is solvable by planting it
    const plantSequence = sequences[0].sequence;
    const startRow = Math.floor(Math.random() * (MATRIX_SIZE - 1));
    const startCol = Math.floor(Math.random() * (MATRIX_SIZE - 1));

    let currentRow = startRow;
    let currentCol = startCol;

    plantSequence.forEach((code, index) => {
      newMatrix[currentRow][currentCol] = code;
      if (index < plantSequence.length - 1) {
        // Alternate between row and column movement
        if (index % 2 === 0) {
          // Move in column (different row, same col)
          currentRow = (currentRow + 1) % MATRIX_SIZE;
        } else {
          // Move in row (same row, different col)
          currentCol = (currentCol + 1) % MATRIX_SIZE;
        }
      }
    });

    setMatrix(newMatrix);
  }, [MATRIX_SIZE]);

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setGameState('failed');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState]);

  // Check for sequence completion
  useEffect(() => {
    if (buffer.length === 0) return;

    sequences.forEach(seq => {
      if (completedSequences.has(seq.name)) return;

      // Check if buffer contains the sequence
      const bufferStr = buffer.join(',');
      const seqStr = seq.sequence.join(',');

      if (bufferStr.includes(seqStr)) {
        setCompletedSequences(prev => new Set([...prev, seq.name]));

        // Check if all sequences are completed
        if (completedSequences.size + 1 === sequences.length) {
          setGameState('success');
        }
      }
    });
  }, [buffer, completedSequences, sequences]);

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

  // Highlight available cells
  useEffect(() => {
    if (!selectedCell || buffer.length >= BUFFER_SIZE) return;

    const highlighted = new Set<string>();

    if (selectionMode === 'row') {
      // Highlight all cells in the row
      for (let col = 0; col < MATRIX_SIZE; col++) {
        highlighted.add(`${selectedCell.row},${col}`);
      }
    } else {
      // Highlight all cells in the column
      for (let row = 0; row < MATRIX_SIZE; row++) {
        highlighted.add(`${row},${selectedCell.col}`);
      }
    }

    setHighlightedCells(highlighted);
  }, [selectedCell, selectionMode, MATRIX_SIZE, buffer.length, BUFFER_SIZE]);

  const handleCellClick = (row: number, col: number) => {
    if (gameState !== 'playing') return;
    if (buffer.length >= BUFFER_SIZE) return;

    // First selection
    if (selectedCell === null) {
      setSelectedCell({ row, col });
      setBuffer([matrix[row][col]]);
      setSelectionMode('col'); // Next must be from same column, different row
      return;
    }

    // Check if selection is valid
    const isValidSelection =
      (selectionMode === 'row' && row === selectedCell.row) ||
      (selectionMode === 'col' && col === selectedCell.col);

    if (!isValidSelection) return;

    // Add to buffer
    setBuffer(prev => [...prev, matrix[row][col]]);
    setSelectedCell({ row, col });

    // Toggle selection mode
    setSelectionMode(selectionMode === 'row' ? 'col' : 'row');
  };

  const handleReset = () => {
    setBuffer([]);
    setSelectedCell(null);
    setSelectionMode('row');
    setHighlightedCells(new Set());
    setTimeRemaining(TIME_LIMIT);
    setGameState('playing');
    setCompletedSequences(new Set());

    // Regenerate matrix
    const newMatrix: CellType[][] = [];
    for (let i = 0; i < MATRIX_SIZE; i++) {
      const row: CellType[] = [];
      for (let j = 0; j < MATRIX_SIZE; j++) {
        row.push(CODE_POOL[Math.floor(Math.random() * CODE_POOL.length)]);
      }
      newMatrix.push(row);
    }
    setMatrix(newMatrix);
  };

  const handleClearBuffer = () => {
    setBuffer([]);
    setSelectedCell(null);
    setSelectionMode('row');
    setHighlightedCells(new Set());
  };

  const handleNavigateToSection = (section: string) => {
    if (onNavigate) {
      onNavigate(section);
    }
  };

  const getCellKey = (row: number, col: number) => `${row},${col}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex flex-col"
    >
      {/* Header */}
      <div className="bg-red-500/10 border-b border-red-500/30 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-400 font-mono text-sm">BREACH PROTOCOL v3.7.2</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-yellow-400 font-mono text-xs">
            TIME: {String(Math.floor(timeRemaining / 60)).padStart(2, '0')}:{String(timeRemaining % 60).padStart(2, '0')}
          </div>
          <button
            onClick={onExit}
            className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 font-mono text-xs hover:bg-red-500/30 transition-colors"
          >
            EXIT [ESC]
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className={`max-w-7xl mx-auto grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-8'}`}>
          {/* Left Side - Matrix */}
          <div>
            <div className="mb-4">
              <div className="text-red-400 font-mono text-sm mb-2">CODE MATRIX</div>
              <div className="text-red-400/60 font-mono text-xs">
                {selectionMode === 'row' ? 'SELECT FROM HIGHLIGHTED ROW' : 'SELECT FROM HIGHLIGHTED COLUMN'}
              </div>
            </div>

            {/* Matrix Grid */}
            <div
              className="grid gap-2 mb-4"
              style={{
                gridTemplateColumns: `repeat(${MATRIX_SIZE}, minmax(0, 1fr))`,
              }}
            >
              {matrix.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                  const key = getCellKey(rowIndex, colIndex);
                  const isHighlighted = highlightedCells.has(key);
                  const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                  const isInBuffer = buffer.some((_, idx) => {
                    // Check if this cell was selected at position idx
                    return false; // Simplified for now
                  });

                  return (
                    <motion.button
                      key={key}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      disabled={gameState !== 'playing' || buffer.length >= BUFFER_SIZE}
                      className={`
                        aspect-square p-2 md:p-4 rounded font-mono text-sm md:text-lg font-bold
                        border-2 transition-all duration-200
                        ${isSelected
                          ? 'bg-red-500/40 border-red-400 text-red-100 scale-110'
                          : isHighlighted && gameState === 'playing'
                            ? 'bg-red-500/20 border-red-400/50 text-red-300 hover:bg-red-500/30 hover:scale-105'
                            : 'bg-red-500/5 border-red-500/20 text-red-400/60'
                        }
                        ${gameState !== 'playing' ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                      `}
                      whileHover={gameState === 'playing' && isHighlighted ? { scale: 1.05 } : {}}
                      whileTap={gameState === 'playing' && isHighlighted ? { scale: 0.95 } : {}}
                    >
                      {cell}
                    </motion.button>
                  );
                })
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-2">
              <button
                onClick={handleClearBuffer}
                disabled={buffer.length === 0 || gameState !== 'playing'}
                className="flex-1 px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 rounded text-yellow-400 font-mono text-xs hover:bg-yellow-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                CLEAR BUFFER
              </button>
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded text-red-400 font-mono text-xs hover:bg-red-500/30 transition-colors"
              >
                RESET
              </button>
            </div>
          </div>

          {/* Right Side - Info Panel */}
          <div className="space-y-4">
            {/* Buffer */}
            <div>
              <div className="text-red-400 font-mono text-sm mb-2">
                BUFFER ({buffer.length}/{BUFFER_SIZE})
              </div>
              <div
                className="grid gap-2 mb-2"
                style={{
                  gridTemplateColumns: `repeat(${BUFFER_SIZE}, minmax(0, 1fr))`,
                }}
              >
                {Array.from({ length: BUFFER_SIZE }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`
                      aspect-square flex items-center justify-center rounded border-2 font-mono text-lg font-bold
                      ${buffer[idx]
                        ? 'bg-red-500/30 border-red-400 text-red-100'
                        : 'bg-red-500/5 border-red-500/20 text-red-500/30'
                      }
                    `}
                  >
                    {buffer[idx] || '--'}
                  </div>
                ))}
              </div>
            </div>

            {/* Target Sequences */}
            <div>
              <div className="text-red-400 font-mono text-sm mb-2">
                TARGET SEQUENCES ({completedSequences.size}/{sequences.length})
              </div>
              <div className="space-y-2">
                {sequences.map((seq, idx) => {
                  const isCompleted = completedSequences.has(seq.name);
                  return (
                    <motion.div
                      key={idx}
                      className={`
                        p-3 rounded border
                        ${isCompleted
                          ? 'bg-green-500/20 border-green-500/50'
                          : 'bg-red-500/10 border-red-500/30'
                        }
                      `}
                      animate={isCompleted ? {
                        boxShadow: [
                          '0 0 0px rgba(34, 197, 94, 0)',
                          '0 0 20px rgba(34, 197, 94, 0.5)',
                          '0 0 0px rgba(34, 197, 94, 0)',
                        ]
                      } : {}}
                      transition={{ duration: 1, repeat: isCompleted ? Infinity : 0 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`font-mono text-xs ${isCompleted ? 'text-green-400' : 'text-red-400'}`}>
                          {seq.name}
                        </span>
                        {isCompleted && (
                          <span className="text-green-400 text-xs">✓ COMPLETED</span>
                        )}
                      </div>
                      <div className="flex gap-1 mb-2">
                        {seq.sequence.map((code, codeIdx) => (
                          <div
                            key={codeIdx}
                            className={`
                              px-2 py-1 rounded font-mono text-xs
                              ${isCompleted
                                ? 'bg-green-500/30 text-green-300'
                                : 'bg-red-500/20 text-red-300'
                              }
                            `}
                          >
                            {code}
                          </div>
                        ))}
                      </div>
                      <div className={`font-mono text-xs ${isCompleted ? 'text-green-400/80' : 'text-red-400/60'}`}>
                        {seq.reward}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-red-500/5 border border-red-500/20 rounded p-3">
              <div className="text-red-400 font-mono text-xs mb-2">INSTRUCTIONS</div>
              <ul className="text-red-400/60 font-mono text-xs space-y-1">
                <li>• Select codes alternating between rows and columns</li>
                <li>• Match target sequences before time runs out</li>
                <li>• Buffer fills left to right</li>
                <li>• Sequences can appear anywhere in buffer</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Game Over Overlay */}
      <AnimatePresence>
        {gameState !== 'playing' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/90 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="max-w-md mx-4 p-8 bg-gradient-to-b from-red-950/80 to-black border-2 border-red-500/50 rounded-lg"
            >
              <div className={`text-4xl font-mono font-bold mb-4 text-center ${
                gameState === 'success' ? 'text-green-400' : 'text-red-400'
              }`}>
                {gameState === 'success' ? 'BREACH SUCCESSFUL' : 'BREACH FAILED'}
              </div>

              <div className="text-center mb-6">
                <div className={`font-mono text-sm ${
                  gameState === 'success' ? 'text-green-400/80' : 'text-red-400/60'
                }`}>
                  {gameState === 'success'
                    ? `All sequences uploaded. Access granted to ${completedSequences.size} sections.`
                    : 'Time expired. Daemon detected intrusion. Connection terminated.'
                  }
                </div>
              </div>

              {gameState === 'success' && (
                <div className="space-y-2 mb-6">
                  {sequences.filter(seq => completedSequences.has(seq.name)).map((seq, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleNavigateToSection(seq.section)}
                      className="w-full px-4 py-3 bg-green-500/20 border border-green-500/50 rounded text-green-400 font-mono text-sm hover:bg-green-500/30 transition-colors"
                    >
                      ACCESS {seq.section.toUpperCase()} →
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-3 bg-red-500/20 border border-red-500/50 rounded text-red-400 font-mono text-sm hover:bg-red-500/30 transition-colors"
                >
                  {gameState === 'success' ? 'PLAY AGAIN' : 'RETRY'}
                </button>
                <button
                  onClick={onExit}
                  className="flex-1 px-4 py-3 bg-gray-500/20 border border-gray-500/50 rounded text-gray-400 font-mono text-sm hover:bg-gray-500/30 transition-colors"
                >
                  EXIT
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
