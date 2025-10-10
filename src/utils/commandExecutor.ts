import { FileSystem } from './fileSystem';

export interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'system';
  content: string;
  timestamp?: number;
}

export interface CommandResult {
  lines: TerminalLine[];
  exitCode: number;
}

export type ProgramLauncher = (args: string[]) => void;

export interface CommandExecutorOptions {
  onProgramLaunch?: ProgramLauncher;
  onThemeChange?: (theme: string) => void;
  onGlitchChange?: (intensity: number) => void;
}

export class CommandExecutor {
  private fs: FileSystem;
  private options: CommandExecutorOptions;

  constructor(fs: FileSystem, options: CommandExecutorOptions = {}) {
    this.fs = fs;
    this.options = options;
  }

  execute(input: string): CommandResult {
    const trimmed = input.trim();
    if (!trimmed) {
      return { lines: [], exitCode: 0 };
    }

    const parts = this.parseCommand(trimmed);
    const command = parts[0];
    const args = parts.slice(1);

    switch (command) {
      case 'help':
        return this.help();
      case 'ls':
        return this.ls(args);
      case 'cd':
        return this.cd(args);
      case 'pwd':
        return this.pwd();
      case 'cat':
        return this.cat(args);
      case 'tree':
        return this.tree();
      case 'clear':
        return this.clear();
      case 'whoami':
        return this.whoami();
      case 'network':
        return this.launchProgram('network', args);
      case 'scanner':
        return this.launchProgram('scanner', args);
      case 'breach':
        return this.launchProgram('breach', args);
      case 'calendar':
      case 'book':
        return this.launchProgram('calendar', args);
      case 'theme':
        return this.theme(args);
      case 'glitch':
        return this.glitch(args);
      case 'gui':
        return this.gui(args);
      case 'exit':
        return this.exit();
      default:
        return this.commandNotFound(command);
    }
  }

  private parseCommand(input: string): string[] {
    const parts: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === ' ' && !inQuotes) {
        if (current) {
          parts.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current) {
      parts.push(current);
    }

    return parts;
  }

  private help(): CommandResult {
    return {
      lines: [
        { type: 'output', content: 'Available commands:' },
        { type: 'output', content: '' },
        { type: 'output', content: 'Navigation & File System:' },
        { type: 'output', content: '  ls [path]       - List directory contents' },
        { type: 'output', content: '  cd [directory]  - Change directory' },
        { type: 'output', content: '  pwd             - Print working directory' },
        { type: 'output', content: '  cat [file]      - Display file contents' },
        { type: 'output', content: '  tree            - Display directory tree' },
        { type: 'output', content: '' },
        { type: 'output', content: 'Programs:' },
        { type: 'output', content: '  network         - Launch Neural Network Map' },
        { type: 'output', content: '  scanner         - Launch AR Scanner' },
        { type: 'output', content: '  breach          - Launch Breach Protocol' },
        { type: 'output', content: '  calendar/book   - Schedule a consultation' },
        { type: 'output', content: '' },
        { type: 'output', content: 'System:' },
        { type: 'output', content: '  theme [name]    - Change theme (dark, cyberpunk)' },
        { type: 'output', content: '  glitch [0-100]  - Set glitch intensity' },
        { type: 'output', content: '  gui [show/hide] - Toggle GUI overlay' },
        { type: 'output', content: '  clear           - Clear terminal' },
        { type: 'output', content: '  whoami          - Display user info' },
        { type: 'output', content: '  help            - Show this help message' },
        { type: 'output', content: '  exit            - Exit terminal mode' },
        { type: 'output', content: '' },
        { type: 'output', content: 'Tip: Use Tab for autocomplete, ↑/↓ for command history' },
      ],
      exitCode: 0,
    };
  }

  private ls(args: string[]): CommandResult {
    const path = args[0] || '.';
    const entries = this.fs.listDirectory(path);

    if (entries === null) {
      return {
        lines: [
          { type: 'error', content: `ls: cannot access '${path}': No such file or directory` }
        ],
        exitCode: 1,
      };
    }

    const lines: TerminalLine[] = [];

    entries.forEach(entry => {
      let prefix = '';
      let suffix = '';

      if (entry.type === 'directory') {
        prefix = '📁 ';
        suffix = '/';
      } else if (entry.executable) {
        prefix = '⚙️  ';
        suffix = '*';
      } else {
        prefix = '📄 ';
      }

      lines.push({
        type: 'output',
        content: `${prefix}${entry.name}${suffix}`
      });
    });

    return { lines, exitCode: 0 };
  }

  private cd(args: string[]): CommandResult {
    if (args.length === 0) {
      // Go to home directory
      this.fs.setCurrentPath('/home/jack');
      return { lines: [], exitCode: 0 };
    }

    const path = args[0];
    const success = this.fs.changeDirectory(path);

    if (!success) {
      return {
        lines: [
          { type: 'error', content: `cd: ${path}: No such file or directory` }
        ],
        exitCode: 1,
      };
    }

    return { lines: [], exitCode: 0 };
  }

  private pwd(): CommandResult {
    return {
      lines: [
        { type: 'output', content: this.fs.getCurrentPath() }
      ],
      exitCode: 0,
    };
  }

  private cat(args: string[]): CommandResult {
    if (args.length === 0) {
      return {
        lines: [
          { type: 'error', content: 'cat: missing file operand' }
        ],
        exitCode: 1,
      };
    }

    const path = args[0];
    const content = this.fs.readFile(path);

    if (content === null) {
      return {
        lines: [
          { type: 'error', content: `cat: ${path}: No such file or directory` }
        ],
        exitCode: 1,
      };
    }

    const lines = content.split('\n').map(line => ({
      type: 'output' as const,
      content: line
    }));

    return { lines, exitCode: 0 };
  }

  private tree(): CommandResult {
    const currentPath = this.fs.getCurrentPath();
    const pathParts = currentPath.split('/').filter(Boolean);
    const dirName = pathParts[pathParts.length - 1] || 'root';

    const lines: TerminalLine[] = [
      { type: 'output', content: `📁 ${dirName}` },
      ...this.fs.getDirectoryTree('.').map(line => ({
        type: 'output' as const,
        content: line
      }))
    ];

    return { lines, exitCode: 0 };
  }

  private clear(): CommandResult {
    return {
      lines: [{ type: 'system', content: '__CLEAR__' }],
      exitCode: 0,
    };
  }

  private whoami(): CommandResult {
    return {
      lines: [
        { type: 'output', content: '' },
        { type: 'output', content: '     ██╗ █████╗  ██████╗██╗  ██╗' },
        { type: 'output', content: '     ██║██╔══██╗██╔════╝██║ ██╔╝' },
        { type: 'output', content: '     ██║███████║██║     █████╔╝ ' },
        { type: 'output', content: '██   ██║██╔══██║██║     ██╔═██╗ ' },
        { type: 'output', content: '╚█████╔╝██║  ██║╚██████╗██║  ██╗' },
        { type: 'output', content: ' ╚════╝ ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝' },
        { type: 'output', content: '' },
        { type: 'output', content: 'jack-cao' },
        { type: 'output', content: 'Full-Stack Developer | Computer Science Student' },
        { type: 'output', content: 'UT Dallas Class of 2025' },
        { type: 'output', content: '' },
        { type: 'output', content: '"In a world of 1s and 0s, I strive to be a 2."' },
        { type: 'output', content: '' },
      ],
      exitCode: 0,
    };
  }

  private launchProgram(program: string, args: string[]): CommandResult {
    if (this.options.onProgramLaunch) {
      this.options.onProgramLaunch([program, ...args]);
      return {
        lines: [
          { type: 'success', content: `Launching ${program}...` },
          { type: 'output', content: "Press ESC or type 'exit' to return to terminal" }
        ],
        exitCode: 0,
      };
    }

    return {
      lines: [
        { type: 'error', content: `Program ${program} is not available in this environment` }
      ],
      exitCode: 1,
    };
  }

  private theme(args: string[]): CommandResult {
    if (args.length === 0) {
      return {
        lines: [
          { type: 'error', content: 'Usage: theme [--dark | --light | --cyberpunk]' }
        ],
        exitCode: 1,
      };
    }

    const themeMap: Record<string, string> = {
      '--dark': 'dark',
      '--light': 'light',
      '--cyberpunk': 'cyberpunk'
    };

    const theme = themeMap[args[0]];

    if (!theme) {
      return {
        lines: [
          { type: 'error', content: `Unknown theme: ${args[0]}` },
          { type: 'output', content: 'Available themes: --dark, --light, --cyberpunk' }
        ],
        exitCode: 1,
      };
    }

    if (this.options.onThemeChange) {
      this.options.onThemeChange(theme);
    }

    return {
      lines: [
        { type: 'success', content: `✓ Theme changed to ${theme}` }
      ],
      exitCode: 0,
    };
  }

  private glitch(args: string[]): CommandResult {
    if (args.length === 0) {
      return {
        lines: [
          { type: 'error', content: 'Usage: glitch [0-100]' }
        ],
        exitCode: 1,
      };
    }

    const intensity = parseInt(args[0]);

    if (isNaN(intensity) || intensity < 0 || intensity > 100) {
      return {
        lines: [
          { type: 'error', content: 'Glitch intensity must be between 0 and 100' }
        ],
        exitCode: 1,
      };
    }

    if (this.options.onGlitchChange) {
      this.options.onGlitchChange(intensity);
    }

    return {
      lines: [
        { type: 'success', content: `✓ Glitch intensity set to ${intensity}%` }
      ],
      exitCode: 0,
    };
  }

  private gui(args: string[]): CommandResult {
    const mode = args[0];

    if (!mode || !['--show', '--hide', '--toggle'].includes(mode)) {
      return {
        lines: [
          { type: 'error', content: 'Usage: gui [--show | --hide | --toggle]' }
        ],
        exitCode: 1,
      };
    }

    return {
      lines: [
        { type: 'success', content: `✓ GUI overlay ${mode.slice(2)}` }
      ],
      exitCode: 0,
    };
  }

  private exit(): CommandResult {
    return {
      lines: [
        { type: 'output', content: 'Exiting terminal mode...' },
        { type: 'output', content: 'Switching to GUI mode' }
      ],
      exitCode: 0,
    };
  }

  private commandNotFound(command: string): CommandResult {
    return {
      lines: [
        { type: 'error', content: `${command}: command not found` },
        { type: 'output', content: "Type 'help' for available commands" }
      ],
      exitCode: 127,
    };
  }

  getAutocompleteOptions(partial: string): string[] {
    const commands = [
      'help', 'ls', 'cd', 'pwd', 'cat', 'tree', 'clear',
      'whoami', 'network', 'scanner', 'breach', 'calendar', 'book', 'theme',
      'glitch', 'gui', 'exit'
    ];

    const parts = partial.trim().split(' ');

    if (parts.length === 1) {
      // Autocomplete command
      return commands.filter(cmd => cmd.startsWith(partial));
    }

    // Autocomplete file paths
    const command = parts[0];
    const pathPartial = parts[parts.length - 1];

    if (['cd', 'ls', 'cat'].includes(command)) {
      const entries = this.fs.listDirectory('.');
      if (!entries) return [];

      return entries
        .map(e => e.name + (e.type === 'directory' ? '/' : ''))
        .filter(name => name.startsWith(pathPartial));
    }

    return [];
  }
}
