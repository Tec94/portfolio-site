import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileSystem } from '../../utils/fileSystem';
import { CommandExecutor, TerminalLine } from '../../utils/commandExecutor';
import { useIsMobile } from '../../hooks/useMediaQuery';

interface TerminalShellProps {
  onProgramLaunch?: (program: string[]) => void;
  onThemeChange?: (theme: string) => void;
  onGlitchChange?: (intensity: number) => void;
}

export default function TerminalShell({
  onProgramLaunch,
  onThemeChange,
  onGlitchChange
}: TerminalShellProps) {
  const isMobile = useIsMobile();
  const [output, setOutput] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);
  const [showingAutocomplete, setShowingAutocomplete] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const fsRef = useRef(new FileSystem());
  const executorRef = useRef(new CommandExecutor(fsRef.current, {
    onProgramLaunch,
    onThemeChange,
    onGlitchChange
  }));

  const [currentPath, setCurrentPath] = useState(fsRef.current.getCurrentPath());

  // Initialize terminal with welcome message and help on load
  useEffect(() => {
    const welcomeLines: TerminalLine[] = [
      { type: 'system', content: 'JACK.SYS Terminal OS v2.1.0' },
      { type: 'system', content: 'Last login: ' + new Date().toLocaleString() },
      { type: 'system', content: '' },
    ];

    // Execute help command automatically
    const helpResult = executorRef.current.execute('help');
    setOutput([...welcomeLines, ...helpResult.lines, { type: 'output', content: '' }]);
  }, []);

  // Auto-scroll to bottom when output changes
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  // Focus input on mount and when clicked (desktop only)
  useEffect(() => {
    if (!isMobile) {
      inputRef.current?.focus();
    }
  }, [isMobile]);

  const executeCommand = (command: string) => {
    if (!command.trim()) return;

    // Add to history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);

    // Add command to output
    const prompt = `jack@portfolio:${currentPath}$`;
    setOutput(prev => [...prev, {
      type: 'input',
      content: `${prompt} ${command}`
    }]);

    // Execute command
    const result = executorRef.current.execute(command);

    // Handle clear command
    if (result.lines.some(line => line.content === '__CLEAR__')) {
      setOutput([]);
      setInput('');
      return;
    }

    // Add result to output
    setOutput(prev => [...prev, ...result.lines]);

    // Update current path
    setCurrentPath(fsRef.current.getCurrentPath());

    // Clear input
    setInput('');
    setShowingAutocomplete(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Enter - execute command
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(input);
      return;
    }

    // Tab - autocomplete
    if (e.key === 'Tab') {
      e.preventDefault();
      const options = executorRef.current.getAutocompleteOptions(input);

      if (options.length === 1) {
        // Single match - auto-complete
        const parts = input.split(' ');
        parts[parts.length - 1] = options[0];
        setInput(parts.join(' '));
        setShowingAutocomplete(false);
      } else if (options.length > 1) {
        // Multiple matches - show options
        setAutocompleteOptions(options);
        setShowingAutocomplete(true);
      }
      return;
    }

    // Up arrow - previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;

      const newIndex = historyIndex === -1
        ? commandHistory.length - 1
        : Math.max(0, historyIndex - 1);

      setHistoryIndex(newIndex);
      setInput(commandHistory[newIndex]);
      setShowingAutocomplete(false);
      return;
    }

    // Down arrow - next command
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex === -1) return;

      const newIndex = historyIndex + 1;

      if (newIndex >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }

      setShowingAutocomplete(false);
      return;
    }

    // Escape - clear autocomplete
    if (e.key === 'Escape') {
      setShowingAutocomplete(false);
      return;
    }

    // Any other key - hide autocomplete
    setShowingAutocomplete(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const getPrompt = () => {
    const pathParts = currentPath.split('/').filter(Boolean);
    const shortPath = pathParts.length > 2
      ? `.../${pathParts.slice(-2).join('/')}`
      : currentPath;

    return `jack@portfolio:${shortPath}$`;
  };

  const renderLine = (line: TerminalLine, index: number) => {
    const getLineClass = () => {
      switch (line.type) {
        case 'error':
          return 'text-red-400';
        case 'success':
          return 'text-green-400';
        case 'system':
          return 'text-cyan-400';
        case 'input':
          return 'text-green-300';
        default:
          return 'text-green-200';
      }
    };

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.1 }}
        className={`font-mono text-sm ${getLineClass()} whitespace-pre-wrap`}
      >
        {line.content}
      </motion.div>
    );
  };

  // Mobile navigation shortcuts
  const mobileNavButtons = [
    { label: 'About', command: 'cd about && cat bio.txt' },
    { label: 'Projects', command: 'cd projects && ls' },
    { label: 'Skills', command: 'cd skills && cat languages.json' },
    { label: 'Contact', command: 'cd contact && cat email.txt' },
  ];

  const handleMobileNav = (command: string) => {
    executeCommand(command);
  };

  return (
    <div
      className="h-screen bg-black flex flex-col overflow-hidden"
      onClick={() => !isMobile && inputRef.current?.focus()}
    >
      {/* Terminal Header */}
      <div className="bg-green-500/10 border-b border-green-500/30 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <span className="text-green-400 font-mono text-sm ml-2">
            JACK.SYS Terminal
          </span>
        </div>
        <div className="text-green-400 font-mono text-xs">
          {new Date().toLocaleTimeString()}
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={outputRef}
        className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-black"
      >
        {output.map((line, index) => renderLine(line, index))}

        {/* Current Input Line - Hidden on mobile */}
        {!isMobile && (
          <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
            <span className="text-green-500">{getPrompt()}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent outline-none caret-green-400"
              spellCheck={false}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
            />
          </div>
        )}

        {/* Autocomplete Suggestions */}
        <AnimatePresence>
          {showingAutocomplete && autocompleteOptions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="ml-4 mt-2 p-2 bg-green-900/20 border border-green-500/30 rounded"
            >
              <div className="text-green-400 font-mono text-xs mb-1">
                Suggestions:
              </div>
              <div className="flex flex-wrap gap-2">
                {autocompleteOptions.map((option, index) => (
                  <div
                    key={index}
                    className="text-green-300 font-mono text-sm px-2 py-1 bg-green-500/10 rounded cursor-pointer hover:bg-green-500/20"
                    onClick={() => {
                      const parts = input.split(' ');
                      parts[parts.length - 1] = option;
                      setInput(parts.join(' '));
                      setShowingAutocomplete(false);
                      inputRef.current?.focus();
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Navigation Buttons */}
      {isMobile && (
        <div className="bg-green-500/5 border-t border-green-500/30 p-3">
          <div className="grid grid-cols-2 gap-2">
            {mobileNavButtons.map((btn, index) => (
              <motion.button
                key={index}
                onClick={() => handleMobileNav(btn.command)}
                className="px-4 py-3 bg-green-500/10 border border-green-500/30 rounded text-green-400 font-mono text-sm hover:bg-green-500/20 active:bg-green-500/30 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                {btn.label}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Terminal Footer - Hints (Desktop only) */}
      {!isMobile && (
        <div className="bg-green-500/5 border-t border-green-500/20 px-4 py-1 text-green-400/60 font-mono text-xs flex items-center justify-between">
          <span>Tab: autocomplete | ↑↓: history | Esc: cancel</span>
          <span>{currentPath}</span>
        </div>
      )}
    </div>
  );
}
