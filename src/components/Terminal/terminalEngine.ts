import type { FileSystemNode, TerminalState, TerminalLine } from '../../types';

// 初始文件系统结构
const createInitialFileSystem = (): FileSystemNode => ({
  '~': {
    'Documents': {
      'readme.txt': 'Welcome to Linux Quest!\nThis is a sample text file.',
      'notes.txt': 'Remember to practice daily.'
    },
    'Downloads': {},
    'Pictures': {},
    'Desktop': {
      'todo.txt': '1. Learn ls command\n2. Practice cd command\n3. Master pwd'
    },
    '.bashrc': '# ~/.bashrc\nexport PATH=$PATH:/usr/local/bin\nalias ll="ls -la"',
    '.profile': '# ~/.profile\n# User specific environment and startup programs'
  }
});

export class TerminalEngine {
  private state: TerminalState;
  private onStateChange?: (state: TerminalState) => void;

  constructor(onStateChange?: (state: TerminalState) => void) {
    this.onStateChange = onStateChange;
    this.state = {
      currentDir: '~',
      fileSystem: createInitialFileSystem(),
      commandHistory: [],
      output: [
        { type: 'info', content: '欢迎来到 Linux Quest 终端！' },
        { type: 'info', content: '输入 "help" 查看可用命令列表' },
        { type: 'info', content: '' }
      ]
    };
  }

  getState(): TerminalState {
    return { ...this.state };
  }

  executeCommand(input: string): TerminalLine[] {
    const trimmed = input.trim();
    if (!trimmed) return [];

    this.state.commandHistory.push(trimmed);
    const newOutput: TerminalLine[] = [
      { type: 'command', content: `${this.state.currentDir} $ ${trimmed}` }
    ];

    const parts = trimmed.split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    try {
      const result = this.processCommand(command, args);
      newOutput.push(...result);
    } catch (error: any) {
      newOutput.push({ type: 'error', content: error.message || 'Unknown error occurred' });
    }

    newOutput.push({ type: 'output', content: '' });
    this.state.output = [...this.state.output, ...newOutput];
    this.onStateChange?.(this.state);
    return newOutput;
  }

  private processCommand(command: string, args: string[]): TerminalLine[] {
    const cmd = command.toLowerCase();
    switch (cmd) {
      case 'help':
        return this.cmdHelp();
      case 'ls':
        return this.cmdLs(args);
      case 'cd':
        return this.cmdCd(args);
      case 'pwd':
        return this.cmdPwd();
      case 'mkdir':
        return this.cmdMkdir(args);
      case 'touch':
        return this.cmdTouch(args);
      case 'cat':
        return this.cmdCat(args);
      case 'rm':
        return this.cmdRm(args);
      case 'cp':
        return this.cmdCp(args);
      case 'mv':
        return this.cmdMv(args);
      case 'echo':
        return this.cmdEcho(args);
      case 'clear':
        return this.cmdClear();
      case 'whoami':
        return this.cmdWhoami();
      case 'date':
        return this.cmdDate();
      case 'history':
        return this.cmdHistory();
      case 'man':
        return this.cmdMan(args);
      default:
        return [{ type: 'error', content: `${command}: 命令未找到` }];
    }
  }

  private cmdHelp(): TerminalLine[] {
    return [
      { type: 'info', content: '可用命令列表：' },
      { type: 'output', content: '  ls [路径]      - 列出目录内容' },
      { type: 'output', content: '  cd [路径]      - 切换目录' },
      { type: 'output', content: '  pwd            - 显示当前工作目录' },
      { type: 'output', content: '  mkdir <名称>   - 创建新目录' },
      { type: 'output', content: '  touch <名称>   - 创建空文件' },
      { type: 'output', content: '  cat <文件>     - 显示文件内容' },
      { type: 'output', content: '  rm <名称>      - 删除文件或目录' },
      { type: 'output', content: '  cp <源> <目标> - 复制文件' },
      { type: 'output', content: '  mv <源> <目标> - 移动/重命名文件' },
      { type: 'output', content: '  echo <文本>    - 输出文本' },
      { type: 'output', content: '  clear          - 清屏' },
      { type: 'output', content: '  whoami         - 显示当前用户' },
      { type: 'output', content: '  date           - 显示当前日期' },
      { type: 'output', content: '  history        - 显示命令历史' },
      { type: 'output', content: '  man <命令>     - 显示命令手册' }
    ];
  }

  private cmdLs(args: string[]): TerminalLine[] {
    const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
    const showLong = args.includes('-l') || args.includes('-la') || args.includes('-al');
    const path = args.filter(a => !a.startsWith('-'))[0] || '';

    const targetNode = this.getNode(path);
    if (!targetNode) {
      return [{ type: 'error', content: `ls: 无法访问 '${path}': 没有这个文件或目录` }];
    }

    if (typeof targetNode === 'string') {
      return [{ type: 'output', content: path }];
    }

    let entries = Object.keys(targetNode);
    if (!showAll) {
      entries = entries.filter(e => !e.startsWith('.'));
    }
    entries.sort();

    if (showLong) {
      return entries.map(entry => {
        const isDir = typeof targetNode[entry] === 'object';
        const permissions = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
        const size = isDir ? '4096' : String(String(targetNode[entry]).length);
        const date = 'Jun 11 10:00';
        return { type: 'output' as const, content: `${permissions}  1 user user  ${size.padStart(6)}  ${date}  ${entry}${isDir ? '/' : ''}` };
      });
    }

    const display = entries.map(e => {
      const isDir = typeof targetNode[e] === 'object';
      return isDir ? `${e}/` : e;
    }).join('  ');

    return [{ type: 'output', content: display }];
  }

  private cmdCd(args: string[]): TerminalLine[] {
    const path = args[0] || '~';

    if (path === '~' || path === '') {
      this.state.currentDir = '~';
      return [];
    }

    if (path === '..') {
      const parts = this.state.currentDir.split('/');
      if (parts.length > 1) {
        parts.pop();
        this.state.currentDir = parts.join('/') || '~';
      }
      return [];
    }

    if (path === '.') {
      return [];
    }

    const targetNode = this.getNode(path);
    if (!targetNode) {
      return [{ type: 'error', content: `cd: ${path}: 没有这个文件或目录` }];
    }

    if (typeof targetNode === 'string') {
      return [{ type: 'error', content: `cd: ${path}: 不是目录` }];
    }

    if (path.startsWith('~')) {
      this.state.currentDir = path;
    } else if (path.startsWith('/')) {
      this.state.currentDir = path;
    } else {
      this.state.currentDir = this.state.currentDir === '~'
        ? `~/${path}`
        : `${this.state.currentDir}/${path}`;
    }

    return [];
  }

  private cmdPwd(): TerminalLine[] {
    const displayPath = this.state.currentDir.replace('~', '/home/user');
    return [{ type: 'output', content: displayPath }];
  }

  private cmdMkdir(args: string[]): TerminalLine[] {
    if (args.length === 0) {
      return [{ type: 'error', content: 'mkdir: 缺少操作数' }];
    }

    const dirName = args[0];
    const current = this.getCurrentNode();

    if (typeof current === 'string') {
      return [{ type: 'error', content: 'mkdir: 无法创建目录' }];
    }

    if (current[dirName]) {
      return [{ type: 'error', content: `mkdir: 无法创建目录 '${dirName}': 文件已存在` }];
    }

    current[dirName] = {};
    return [];
  }

  private cmdTouch(args: string[]): TerminalLine[] {
    if (args.length === 0) {
      return [{ type: 'error', content: 'touch: 缺少文件操作数' }];
    }

    const fileName = args[0];
    const current = this.getCurrentNode();

    if (typeof current === 'string') {
      return [{ type: 'error', content: 'touch: 无法创建文件' }];
    }

    if (!current[fileName]) {
      current[fileName] = '';
    }
    return [];
  }

  private cmdCat(args: string[]): TerminalLine[] {
    if (args.length === 0) {
      return [{ type: 'error', content: 'cat: 缺少文件操作数' }];
    }

    const fileName = args[0];
    const node = this.getNode(fileName);

    if (!node) {
      return [{ type: 'error', content: `cat: ${fileName}: 没有这个文件或目录` }];
    }

    if (typeof node === 'object') {
      return [{ type: 'error', content: `cat: ${fileName}: 是一个目录` }];
    }

    return node.split('\n').map(line => ({ type: 'output' as const, content: line }));
  }

  private cmdRm(args: string[]): TerminalLine[] {
    if (args.length === 0) {
      return [{ type: 'error', content: 'rm: 缺少操作数' }];
    }

    const target = args[args.length - 1];
    const recursive = args.includes('-r') || args.includes('-rf') || args.includes('-fr');

    const current = this.getCurrentNode();

    if (typeof current === 'string') {
      return [{ type: 'error', content: 'rm: 无法删除' }];
    }

    if (!current[target]) {
      return [{ type: 'error', content: `rm: 无法删除 '${target}': 没有这个文件或目录` }];
    }

    const isDir = typeof current[target] === 'object';
    if (isDir && !recursive) {
      return [{ type: 'error', content: `rm: 无法删除 '${target}': 是一个目录` }];
    }

    delete current[target];
    return [];
  }

  private cmdCp(args: string[]): TerminalLine[] {
    if (args.length < 2) {
      return [{ type: 'error', content: 'cp: 缺少目标操作数' }];
    }

    const [src, dst] = args;
    const srcNode = this.getNode(src);

    if (!srcNode) {
      return [{ type: 'error', content: `cp: 无法获取 '${src}' 的状态: 没有这个文件或目录` }];
    }

    if (typeof srcNode === 'object') {
      return [{ type: 'error', content: `cp: 未指定 -r 选项，跳过目录 '${src}'` }];
    }

    const current = this.getCurrentNode();
    if (typeof current === 'string') {
      return [{ type: 'error', content: 'cp: 无法创建文件' }];
    }

    current[dst] = srcNode;
    return [];
  }

  private cmdMv(args: string[]): TerminalLine[] {
    if (args.length < 2) {
      return [{ type: 'error', content: 'mv: 缺少目标操作数' }];
    }

    const [src, dst] = args;
    const current = this.getCurrentNode();

    if (typeof current === 'string') {
      return [{ type: 'error', content: 'mv: 无法移动' }];
    }

    if (!current[src]) {
      return [{ type: 'error', content: `mv: 无法获取 '${src}' 的状态: 没有这个文件或目录` }];
    }

    current[dst] = current[src];
    delete current[src];
    return [];
  }

  private cmdEcho(args: string[]): TerminalLine[] {
    const text = args.join(' ').replace(/^["']|["']$/g, '');
    return [{ type: 'output', content: text }];
  }

  private cmdClear(): TerminalLine[] {
    this.state.output = [];
    return [];
  }

  private cmdWhoami(): TerminalLine[] {
    return [{ type: 'output', content: 'user' }];
  }

  private cmdDate(): TerminalLine[] {
    return [{ type: 'output', content: new Date().toString() }];
  }

  private cmdHistory(): TerminalLine[] {
    return this.state.commandHistory.map((cmd, i) => ({
      type: 'output' as const,
      content: `  ${String(i + 1).padStart(4)}  ${cmd}`
    }));
  }

  private cmdMan(args: string[]): TerminalLine[] {
    if (args.length === 0) {
      return [{ type: 'error', content: 'What manual page do you want?' }];
    }

    const manPages: { [key: string]: string[] } = {
      ls: [
        'LS(1)                    User Commands                    LS(1)',
        '',
        'NAME',
        '       ls - list directory contents',
        '',
        'SYNOPSIS',
        '       ls [OPTION]... [FILE]...',
        '',
        'DESCRIPTION',
        '       List information about the FILEs.',
        '',
        '       -a, --all',
        '              do not ignore entries starting with .',
        '',
        '       -l     use a long listing format'
      ],
      cd: [
        'CD(1)                    User Commands                    CD(1)',
        '',
        'NAME',
        '       cd - change the working directory',
        '',
        'SYNOPSIS',
        '       cd [dir]',
        '',
        'DESCRIPTION',
        '       Change the current directory to dir.',
        '       The default dir is the home directory.'
      ]
    };

    const page = manPages[args[0]];
    if (!page) {
      return [{ type: 'output', content: `No manual entry for ${args[0]}` }];
    }

    return page.map(line => ({ type: 'output' as const, content: line }));
  }

  private getCurrentNode(): FileSystemNode | string {
    return this.getNode(this.state.currentDir) || {};
  }

  private getNode(path: string): FileSystemNode | string | null {
    if (!path || path === '~') {
      return this.state.fileSystem['~'] as FileSystemNode;
    }

    const parts = path.replace('~/', '').split('/').filter(Boolean);
    let current: FileSystemNode | string = this.state.fileSystem['~'] as FileSystemNode;

    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        // 简化处理
        continue;
      }

      if (typeof current === 'string') {
        return null;
      }

      if (!current[part]) {
        return null;
      }

      current = current[part];
    }

    return current;
  }

  getFileSystem(): FileSystemNode {
    return this.state.fileSystem;
  }

  getCurrentDir(): string {
    return this.state.currentDir;
  }
}
