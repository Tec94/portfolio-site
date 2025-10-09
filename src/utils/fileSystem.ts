import { fileSystem, FileNode, startingDirectory } from '../data/fileSystemData';

export class FileSystem {
  private currentPath: string;

  constructor() {
    this.currentPath = startingDirectory;
  }

  getCurrentPath(): string {
    return this.currentPath;
  }

  setCurrentPath(path: string): void {
    this.currentPath = path;
  }

  resolvePath(path: string): string {
    if (path.startsWith('/')) {
      return path;
    }

    if (path === '~') {
      return startingDirectory;
    }

    if (path.startsWith('~/')) {
      return startingDirectory + path.slice(1);
    }

    if (path === '..') {
      const parts = this.currentPath.split('/').filter(Boolean);
      parts.pop();
      return '/' + parts.join('/');
    }

    if (path.startsWith('../')) {
      const parts = this.currentPath.split('/').filter(Boolean);
      parts.pop();
      const remaining = path.slice(3);
      return '/' + parts.join('/') + '/' + remaining;
    }

    if (path === '.') {
      return this.currentPath;
    }

    return this.currentPath + '/' + path;
  }

  getNode(path: string): FileNode | null {
    const resolvedPath = this.resolvePath(path);
    const parts = resolvedPath.split('/').filter(Boolean);

    let current: FileNode | undefined = fileSystem.home;

    for (const part of parts) {
      if (!current?.children || !current.children[part]) {
        return null;
      }
      current = current.children[part];
    }

    return current || null;
  }

  listDirectory(path: string = '.'): FileNode[] | null {
    const node = this.getNode(path);

    if (!node || node.type !== 'directory' || !node.children) {
      return null;
    }

    return Object.values(node.children).sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'directory' ? -1 : 1;
    });
  }

  readFile(path: string): string | null {
    const node = this.getNode(path);

    if (!node || node.type !== 'file') {
      return null;
    }

    return node.content || '';
  }

  changeDirectory(path: string): boolean {
    const node = this.getNode(path);

    if (!node || node.type !== 'directory') {
      return false;
    }

    this.currentPath = this.resolvePath(path);
    return true;
  }

  exists(path: string): boolean {
    return this.getNode(path) !== null;
  }

  isDirectory(path: string): boolean {
    const node = this.getNode(path);
    return node !== null && node.type === 'directory';
  }

  isFile(path: string): boolean {
    const node = this.getNode(path);
    return node !== null && node.type === 'file';
  }

  isExecutable(path: string): boolean {
    const node = this.getNode(path);
    return node !== null && node.type === 'file' && node.executable === true;
  }

  getDirectoryTree(path: string = '.', prefix: string = '', isLast: boolean = true): string[] {
    const node = this.getNode(path);
    if (!node || node.type !== 'directory' || !node.children) {
      return [];
    }

    const lines: string[] = [];
    const entries = Object.values(node.children).sort((a, b) => {
      if (a.type === b.type) return a.name.localeCompare(b.name);
      return a.type === 'directory' ? -1 : 1;
    });

    entries.forEach((entry, index) => {
      const isLastEntry = index === entries.length - 1;
      const connector = isLastEntry ? '└── ' : '├── ';
      const icon = entry.type === 'directory' ? '📁' : (entry.executable ? '⚙️' : '📄');

      lines.push(`${prefix}${connector}${icon} ${entry.name}`);

      if (entry.type === 'directory' && entry.children) {
        const newPrefix = prefix + (isLastEntry ? '    ' : '│   ');
        const subPath = this.resolvePath(path + '/' + entry.name);
        lines.push(...this.getDirectoryTree(subPath, newPrefix, isLastEntry));
      }
    });

    return lines;
  }
}
