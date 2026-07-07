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

    try {
      const result = this.executeLine(trimmed);
      newOutput.push(...result);
    } catch (error: any) {
      newOutput.push({ type: 'error', content: error.message || 'Unknown error occurred' });
    }

    newOutput.push({ type: 'output', content: '' });
    this.state.output = [...this.state.output, ...newOutput];
    this.onStateChange?.(this.state);
    return newOutput;
  }

  // ===== Shell 解析：支持管道和重定向 =====

  private executeLine(line: string): TerminalLine[] {
    // 1. 按管道分割
    const segments = this.splitByPipe(line);
    let currentInput: string[] = [];
    let finalOutput: TerminalLine[] = [];
    let targetFile: string | null = null;
    let appendMode = false;

    for (let i = 0; i < segments.length; i++) {
      let segment = segments[i].trim();
      const isLast = i === segments.length - 1;

      // 2. 最后一段处理重定向
      if (isLast) {
        const redir = this.extractRedirection(segment);
        segment = redir.command;
        targetFile = redir.targetFile;
        appendMode = redir.append;
      }

      // 3. 解析命令和参数
      const parts = this.parseCommandLine(segment);
      if (parts.length === 0) continue;

      const command = parts[0];
      const args = parts.slice(1);

      // 4. 执行命令
      const result = this.processCommand(command, args, currentInput);
      finalOutput = result;

      // 5. 提取输出文本供管道传递
      currentInput = result
        .filter(l => l.type === 'output' || l.type === 'success')
        .map(l => l.content);
    }

    // 6. 重定向到文件
    if (targetFile && currentInput.length > 0) {
      this.writeToFile(targetFile, currentInput.join('\n'), appendMode);
      return []; // 重定向时不显示输出
    }

    return finalOutput;
  }

  // 按管道符分割，尊重引号
  private splitByPipe(line: string): string[] {
    const segments: string[] = [];
    let current = '';
    let inSingle = false;
    let inDouble = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === "'" && !inDouble) {
        inSingle = !inSingle;
        current += ch;
      } else if (ch === '"' && !inSingle) {
        inDouble = !inDouble;
        current += ch;
      } else if (ch === '|' && !inSingle && !inDouble) {
        segments.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    segments.push(current);
    return segments;
  }

  // 提取重定向目标
  private extractRedirection(segment: string): { command: string; targetFile: string | null; append: boolean } {
    let inSingle = false;
    let inDouble = false;

    for (let i = 0; i < segment.length; i++) {
      const ch = segment[i];
      if (ch === "'" && !inDouble) { inSingle = !inSingle; continue; }
      if (ch === '"' && !inSingle) { inDouble = !inDouble; continue; }
      if ((ch === '>' || segment.substring(i, i + 2) === '>>') && !inSingle && !inDouble) {
        const append = segment.substring(i, i + 2) === '>>';
        const rest = segment.substring(append ? i + 2 : i + 1).trim();
        return {
          command: segment.substring(0, i).trim(),
          targetFile: rest || null,
          append
        };
      }
    }
    return { command: segment, targetFile: null, append: false };
  }

  // 解析命令行，处理引号
  private parseCommandLine(line: string): string[] {
    const parts: string[] = [];
    let current = '';
    let inSingle = false;
    let inDouble = false;

    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === "'" && !inDouble) {
        inSingle = !inSingle;
      } else if (ch === '"' && !inSingle) {
        inDouble = !inDouble;
      } else if ((ch === ' ' || ch === '\t') && !inSingle && !inDouble) {
        if (current) { parts.push(current); current = ''; }
      } else {
        current += ch;
      }
    }
    if (current) parts.push(current);
    return parts;
  }

  // ===== 文件系统写入 =====

  private resolveFilePath(path: string): string[] {
    if (path.startsWith('~/')) {
      return ['~', ...path.slice(2).split('/').filter(Boolean)];
    }
    if (path.startsWith('/')) {
      return ['~', ...path.split('/').filter(Boolean)];
    }
    const base = this.state.currentDir === '~' ? ['~'] : this.state.currentDir.split('/');
    return [...base, ...path.split('/').filter(Boolean)];
  }

  private writeToFile(path: string, content: string, append: boolean): void {
    const parts = this.resolveFilePath(path);
    const fileName = parts.pop()!;
    let current: FileSystemNode = this.state.fileSystem as FileSystemNode;

    for (const part of parts) {
      if (typeof current[part] !== 'object') {
        current[part] = {};
      }
      current = current[part] as FileSystemNode;
    }

    if (append && typeof current[fileName] === 'string') {
      current[fileName] = (current[fileName] as string) + '\n' + content;
    } else {
      current[fileName] = content;
    }
  }

  // ===== 命令处理 =====

  private processCommand(command: string, args: string[], stdin: string[] = []): TerminalLine[] {
    const cmd = command.toLowerCase();

    // 处理脚本执行 (./script.sh 或 bash script.sh)
    if (command.startsWith('./') || (cmd === 'bash' && args.length > 0 && !args[0].startsWith('-'))) {
      const scriptPath = command.startsWith('./') ? command : args[0];
      return this.executeScript(scriptPath);
    }

    switch (cmd) {
      case 'help': return this.cmdHelp();
      case 'ls': return this.cmdLs(args);
      case 'cd': return this.cmdCd(args);
      case 'pwd': return this.cmdPwd();
      case 'mkdir': return this.cmdMkdir(args);
      case 'touch': return this.cmdTouch(args);
      case 'cat': return this.cmdCat(args);
      case 'rm': return this.cmdRm(args);
      case 'cp': return this.cmdCp(args);
      case 'mv': return this.cmdMv(args);
      case 'echo': return this.cmdEcho(args);
      case 'clear': return this.cmdClear();
      case 'whoami': return this.cmdWhoami();
      case 'date': return this.cmdDate();
      case 'history': return this.cmdHistory();
      case 'man': return this.cmdMan(args);
      case 'grep': return this.cmdGrep(args, stdin);
      case 'sort': return this.cmdSort(args, stdin);
      case 'uniq': return this.cmdUniq(args, stdin);
      case 'wc': return this.cmdWc(args, stdin);
      case 'head': return this.cmdHead(args, stdin);
      case 'tail': return this.cmdTail(args, stdin);
      case 'cut': return this.cmdCut(args, stdin);
      case 'sed': return this.cmdSed(args, stdin);
      case 'awk': return this.cmdAwk(args, stdin);
      case 'diff': return this.cmdDiff(args);
      case 'ps': return this.cmdPs(args);
      case 'top': return this.cmdTop();
      case 'kill': return this.cmdKill(args);
      case 'jobs': return this.cmdJobs();
      case 'fg': return this.cmdFg();
      case 'bg': return this.cmdBg();
      case 'nice': return this.cmdNice(args);
      case 'renice': return this.cmdRenice(args);
      case 'ping': return this.cmdPing(args);
      case 'curl': return this.cmdCurl(args);
      case 'wget': return this.cmdWget(args);
      case 'ifconfig': return this.cmdIfconfig();
      case 'ip': return this.cmdIp(args);
      case 'netstat': return this.cmdNetstat(args);
      case 'ss': return this.cmdSs(args);
      case 'ssh': return this.cmdSsh(args);
      case 'df': return this.cmdDf(args);
      case 'du': return this.cmdDu(args);
      case 'uname': return this.cmdUname(args);
      case 'hostname': return this.cmdHostname();
      case 'apt': return this.cmdApt(args);
      case 'yum': return this.cmdYum(args);
      case 'systemctl': return this.cmdSystemctl(args);
      case 'journalctl': return this.cmdJournalctl(args);
      case 'sleep': return this.cmdSleep(args);
      case 'chmod': return this.cmdChmod(args);
      case 'chown': return this.cmdChown(args);
      case 'chgrp': return this.cmdChgrp(args);
      case 'umask': return this.cmdUmask();
      case 'uptime': return this.cmdUptime();
      case 'free': return this.cmdFree();
      case 'groups': return this.cmdGroups();
      case 'id': return this.cmdId();
      default:
        return [{ type: 'error', content: `${command}: 命令未找到` }];
    }
  }

  // ===== 脚本执行 =====

  private executeScript(path: string): TerminalLine[] {
    const node = this.getNode(path);
    if (!node || typeof node !== 'string') {
      return [{ type: 'error', content: `bash: ${path}: 没有这个文件或目录` }];
    }

    const lines = node.split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
    const output: TerminalLine[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      try {
        const result = this.executeLine(trimmed);
        output.push(...result);
      } catch (e: any) {
        output.push({ type: 'error', content: e.message });
      }
    }

    return output;
  }

  // ===== 现有命令 =====

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
      { type: 'output', content: '  man <命令>     - 显示命令手册' },
      { type: 'output', content: '  grep/sort/wc/cut/sed/awk - 文本处理' },
      { type: 'output', content: '  ps/top/kill/nice         - 进程管理' },
      { type: 'output', content: '  ping/curl/wget/ssh       - 网络工具' },
      { type: 'output', content: '  df/du/uname/systemctl    - 系统管理' },
      { type: 'info', content: '  支持管道 (|) 和重定向 (>, >>)' }
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
    const text = args.join(' ');
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
      ls: ['LS(1) - list directory contents', 'Usage: ls [OPTION]... [FILE]...', '-a: show hidden files', '-l: long format'],
      cd: ['CD(1) - change directory', 'Usage: cd [dir]', 'cd ~ : go home', 'cd .. : go up'],
      grep: ['GREP(1) - search text', 'Usage: grep [OPTION]... PATTERN [FILE]...', '-i: ignore case', '-n: show line numbers', '-r: recursive'],
      ps: ['PS(1) - process status', 'Usage: ps aux', 'a: all users', 'u: detailed', 'x: include no-tty'],
      chmod: ['CHMOD(1) - change permissions', 'Usage: chmod MODE FILE', '755: rwxr-xr-x', '644: rw-r--r--']
    };

    const page = manPages[args[0]];
    if (!page) {
      return [{ type: 'output', content: `No manual entry for ${args[0]}` }];
    }

    return page.map(line => ({ type: 'output' as const, content: line }));
  }

  // ===== 新增：文本处理命令 =====

  private cmdGrep(args: string[], stdin: string[]): TerminalLine[] {
    const caseInsensitive = args.includes('-i');
    const showLineNum = args.includes('-n');
    const nonFlagArgs = args.filter(a => !a.startsWith('-'));

    if (nonFlagArgs.length === 0) {
      return [{ type: 'error', content: 'grep: 缺少搜索模式' }];
    }

    const pattern = nonFlagArgs[0].replace(/^["']|["']$/g, '');
    const fileName = nonFlagArgs[1];

    let lines: string[];
    if (stdin.length > 0) {
      lines = stdin;
    } else if (fileName) {
      const node = this.getNode(fileName);
      if (!node || typeof node !== 'string') {
        return [{ type: 'error', content: `grep: ${fileName}: 没有这个文件或目录` }];
      }
      lines = node.split('\n');
    } else {
      return [{ type: 'error', content: 'grep: 缺少输入' }];
    }

    const flags = caseInsensitive ? 'i' : '';
    const regex = new RegExp(pattern, flags);
    const results: TerminalLine[] = [];

    lines.forEach((line, idx) => {
      if (regex.test(line)) {
        const prefix = showLineNum ? `${idx + 1}:` : '';
        results.push({ type: 'output', content: `${prefix}${line}` });
      }
    });

    return results.length > 0 ? results : [];
  }

  private cmdSort(args: string[], stdin: string[]): TerminalLine[] {
    const fileName = args.filter(a => !a.startsWith('-'))[0];
    let lines: string[];

    if (stdin.length > 0) {
      lines = stdin;
    } else if (fileName) {
      const node = this.getNode(fileName);
      if (!node || typeof node !== 'string') {
        return [{ type: 'error', content: `sort: ${fileName}: 没有这个文件或目录` }];
      }
      lines = node.split('\n');
    } else {
      return [];
    }

    const numeric = args.includes('-n');
    const reverse = args.includes('-r');
    const unique = args.includes('-u');

    let sorted = [...lines];
    if (numeric) {
      sorted.sort((a, b) => parseFloat(a) - parseFloat(b));
    } else {
      sorted.sort();
    }
    if (reverse) sorted.reverse();
    if (unique) sorted = [...new Set(sorted)];

    return sorted.map(line => ({ type: 'output' as const, content: line }));
  }

  private cmdUniq(args: string[], stdin: string[]): TerminalLine[] {
    const fileName = args.filter(a => !a.startsWith('-'))[0];
    let lines: string[];

    if (stdin.length > 0) {
      lines = stdin;
    } else if (fileName) {
      const node = this.getNode(fileName);
      if (!node || typeof node !== 'string') {
        return [{ type: 'error', content: `uniq: ${fileName}: 没有这个文件或目录` }];
      }
      lines = node.split('\n');
    } else {
      return [];
    }

    const showCount = args.includes('-c');
    const result: TerminalLine[] = [];
    let prev = '';
    let count = 0;

    for (const line of lines) {
      if (line === prev) {
        count++;
      } else {
        if (prev) {
          result.push({ type: 'output', content: showCount ? `${String(count).padStart(7)} ${prev}` : prev });
        }
        prev = line;
        count = 1;
      }
    }
    if (prev) {
      result.push({ type: 'output', content: showCount ? `${String(count).padStart(7)} ${prev}` : prev });
    }

    return result;
  }

  private cmdWc(args: string[], stdin: string[]): TerminalLine[] {
    const showOnly = args.includes('-l') ? 'lines' : args.includes('-w') ? 'words' : args.includes('-c') ? 'chars' : 'all';
    const fileName = args.filter(a => !a.startsWith('-'))[0];
    let lines: string[];

    if (stdin.length > 0) {
      lines = stdin;
    } else if (fileName) {
      const node = this.getNode(fileName);
      if (!node || typeof node !== 'string') {
        return [{ type: 'error', content: `wc: ${fileName}: 没有这个文件或目录` }];
      }
      lines = node.split('\n');
    } else {
      return [];
    }

    const lineCount = lines.length;
    const wordCount = lines.reduce((sum, l) => sum + l.split(/\s+/).filter(Boolean).length, 0);
    const charCount = lines.reduce((sum, l) => sum + l.length, 0);

    switch (showOnly) {
      case 'lines': return [{ type: 'output', content: String(lineCount) }];
      case 'words': return [{ type: 'output', content: String(wordCount) }];
      case 'chars': return [{ type: 'output', content: String(charCount) }];
      default: return [{ type: 'output', content: `  ${lineCount}  ${wordCount}  ${charCount}` }];
    }
  }

  private cmdHead(args: string[], stdin: string[]): TerminalLine[] {
    let n = 10;
    const nIdx = args.indexOf('-n');
    if (nIdx !== -1 && args[nIdx + 1]) n = parseInt(args[nIdx + 1]);
    const fileName = args.filter(a => !a.startsWith('-') && isNaN(Number(a)))[0];

    let lines: string[];
    if (stdin.length > 0) {
      lines = stdin;
    } else if (fileName) {
      const node = this.getNode(fileName);
      if (!node || typeof node !== 'string') {
        return [{ type: 'error', content: `head: ${fileName}: 没有这个文件或目录` }];
      }
      lines = node.split('\n');
    } else {
      return [];
    }

    return lines.slice(0, n).map(l => ({ type: 'output' as const, content: l }));
  }

  private cmdTail(args: string[], stdin: string[]): TerminalLine[] {
    let n = 10;
    const nIdx = args.indexOf('-n');
    if (nIdx !== -1 && args[nIdx + 1]) n = parseInt(args[nIdx + 1]);
    const fileName = args.filter(a => !a.startsWith('-') && isNaN(Number(a)))[0];

    let lines: string[];
    if (stdin.length > 0) {
      lines = stdin;
    } else if (fileName) {
      const node = this.getNode(fileName);
      if (!node || typeof node !== 'string') {
        return [{ type: 'error', content: `tail: ${fileName}: 没有这个文件或目录` }];
      }
      lines = node.split('\n');
    } else {
      return [];
    }

    return lines.slice(-n).map(l => ({ type: 'output' as const, content: l }));
  }

  private cmdCut(args: string[], stdin: string[]): TerminalLine[] {
    const delimIdx = args.indexOf('-d');
    const delim = delimIdx !== -1 ? args[delimIdx + 1]?.replace(/^["']|["']$/g, '') || ':' : ':';
    const fieldIdx = args.indexOf('-f');
    const field = fieldIdx !== -1 ? parseInt(args[fieldIdx + 1]) : 1;
    const fileName = args.filter(a => !a.startsWith('-') && !Number.isFinite(parseInt(a)) && a !== delim)[0];

    let lines: string[];
    if (stdin.length > 0) {
      lines = stdin;
    } else if (fileName) {
      const node = this.getNode(fileName);
      if (!node || typeof node !== 'string') {
        return [{ type: 'error', content: `cut: ${fileName}: 没有这个文件或目录` }];
      }
      lines = node.split('\n');
    } else {
      return [];
    }

    return lines.map(line => {
      const fields = line.split(delim);
      return { type: 'output' as const, content: fields[field - 1] || '' };
    });
  }

  private cmdSed(args: string[], stdin: string[]): TerminalLine[] {
    const pattern = args.find(a => a.startsWith('s/')) || args.find(a => a.startsWith('"s/'))?.replace(/^"|"$/g, '') || '';
    const fileName = args.filter(a => !a.startsWith('-') && !a.startsWith('s/') && !a.startsWith('"s/'))[0];

    let lines: string[];
    if (stdin.length > 0) {
      lines = stdin;
    } else if (fileName) {
      const node = this.getNode(fileName);
      if (!node || typeof node !== 'string') {
        return [{ type: 'error', content: `sed: ${fileName}: 没有这个文件或目录` }];
      }
      lines = node.split('\n');
    } else {
      return [];
    }

    const match = pattern.match(/^s\/(.+?)\/(.+?)\/(g?)$/);
    if (!match) {
      return [{ type: 'error', content: 'sed: 无效的替换模式' }];
    }

    const [, search, replace, global] = match;
    const regex = new RegExp(search, global ? 'g' : '');

    return lines.map(line => ({
      type: 'output' as const,
      content: line.replace(regex, replace)
    }));
  }

  private cmdAwk(args: string[], stdin: string[]): TerminalLine[] {
    const script = args.find(a => a.includes('print') || a.includes('{'))?.replace(/^["']|["']$/g, '') || '';
    const fileName = args.filter(a => !a.startsWith('-') && !a.includes('{') && !a.includes('print'))[0];

    let lines: string[];
    if (stdin.length > 0) {
      lines = stdin;
    } else if (fileName) {
      const node = this.getNode(fileName);
      if (!node || typeof node !== 'string') {
        return [{ type: 'error', content: `awk: ${fileName}: 没有这个文件或目录` }];
      }
      lines = node.split('\n');
    } else {
      return [];
    }

    const results: TerminalLine[] = [];

    for (const line of lines) {
      const fields = line.split(/\s+/);

      if (script.includes('print $1') && script.includes('$3') && !script.includes('sum')) {
        results.push({ type: 'output', content: `${fields[0] || ''} ${fields[2] || ''}` });
      } else if (script.includes('print $1')) {
        results.push({ type: 'output', content: fields[0] || '' });
      } else if (script.includes('sum+=$2') || script.includes('END{print sum}')) {
        // 累加模式：在 END 阶段处理
        continue;
      } else {
        results.push({ type: 'output', content: line });
      }
    }

    // 处理 awk 的 END 块 - 求和
    if (script.includes('sum+=$2') || script.includes('END{print sum}')) {
      let sum = 0;
      for (const line of lines) {
        const fields = line.split(/\s+/);
        const val = parseFloat(fields[1]);
        if (!isNaN(val)) sum += val;
      }
      results.push({ type: 'output', content: String(sum) });
    }

    return results;
  }

  private cmdDiff(args: string[]): TerminalLine[] {
    if (args.length < 2) {
      return [{ type: 'error', content: 'diff: 缺少操作数' }];
    }

    const [file1, file2] = args;
    const node1 = this.getNode(file1);
    const node2 = this.getNode(file2);

    if (!node1 || typeof node1 !== 'string') {
      return [{ type: 'error', content: `diff: ${file1}: 没有这个文件或目录` }];
    }
    if (!node2 || typeof node2 !== 'string') {
      return [{ type: 'error', content: `diff: ${file2}: 没有这个文件或目录` }];
    }

    const lines1 = node1.split('\n');
    const lines2 = node2.split('\n');
    const result: TerminalLine[] = [];
    const maxLen = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLen; i++) {
      const a = lines1[i] || '';
      const b = lines2[i] || '';
      if (a !== b) {
        if (a) result.push({ type: 'output', content: `< ${a}` });
        if (b) result.push({ type: 'output', content: `> ${b}` });
      }
    }

    return result.length > 0 ? result : [{ type: 'output', content: '(文件相同)' }];
  }

  // ===== 新增：进程管理命令 =====

  private cmdPs(args: string[]): TerminalLine[] {
    const processes = [
      { pid: 1, user: 'root', cpu: '0.0', mem: '0.1', cmd: '/sbin/init' },
      { pid: 2, user: 'root', cpu: '0.0', mem: '0.0', cmd: '[kthreadd]' },
      { pid: 100, user: 'user', cpu: '0.0', mem: '0.2', cmd: '-bash' },
      { pid: 101, user: 'user', cpu: '0.1', mem: '0.3', cmd: 'node server.js' },
      { pid: 102, user: 'user', cpu: '0.0', mem: '0.1', cmd: 'ps aux' }
    ];

    if (args.includes('aux') || args.includes('-ef')) {
      return [
        { type: 'output', content: 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND' },
        ...processes.map(p => ({
          type: 'output' as const,
          content: `${p.user.padEnd(10)} ${String(p.pid).padStart(5)} ${p.cpu.padStart(5)} ${p.mem.padStart(5)} 68236  4820 pts/0    Ss   10:00   0:00 ${p.cmd}`
        }))
      ];
    }

    return [
      { type: 'output', content: '  PID TTY          TIME CMD' },
      { type: 'output', content: '  100 pts/0    00:00:00 bash' },
      { type: 'output', content: '  102 pts/0    00:00:00 ps' }
    ];
  }

  private cmdTop(): TerminalLine[] {
    return [
      { type: 'output', content: 'top - 10:00:00 up 30 days,  1:23,  1 user,  load average: 0.00, 0.01, 0.05' },
      { type: 'output', content: 'Tasks:  85 total,   1 running,  84 sleeping,   0 stopped,   0 zombie' },
      { type: 'output', content: '%Cpu(s):  0.3 us,  0.2 sy,  0.0 ni, 99.5 id,  0.0 wa,  0.0 hi,  0.0 si,  0.0 st' },
      { type: 'output', content: 'MiB Mem:   8192.0 total,   6144.0 free,   1024.0 used,   1024.0 buff/cache' },
      { type: 'output', content: '' },
      { type: 'output', content: '  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND' },
      { type: 'output', content: '    1 root      20   0  168236  11820   8420 S   0.0   0.1   1:23.45 systemd' },
      { type: 'output', content: '  101 user      20   0   45632  12340   8900 S   0.1   0.2   0:05.67 node' },
      { type: 'info', content: '(模拟 top 输出，按 q 退出)' }
    ];
  }

  private cmdKill(args: string[]): TerminalLine[] {
    if (args.length === 0) {
      return [{ type: 'error', content: 'kill: 用法: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ... or kill -l [sigspec]' }];
    }
    const target = args[args.length - 1];
    if (target.startsWith('%')) {
      return [{ type: 'output', content: `[${target.substring(1)}]+ Terminated   sleep` }];
    }
    return [{ type: 'output', content: `` }];
  }

  private cmdJobs(): TerminalLine[] {
    return [{ type: 'output', content: '[1]+  Running   sleep 100 &' }];
  }

  private cmdFg(): TerminalLine[] {
    return [{ type: 'output', content: 'sleep 100' }];
  }

  private cmdBg(): TerminalLine[] {
    return [{ type: 'output', content: '[1]+ sleep 100 &' }];
  }

  private cmdNice(args: string[]): TerminalLine[] {
    if (args.length === 0) {
      return [{ type: 'output', content: '0' }];
    }
    return [{ type: 'output', content: '' }];
  }

  private cmdRenice(_args: string[]): TerminalLine[] {
    return [{ type: 'output', content: '' }];
  }

  // ===== 新增：网络命令 =====

  private cmdPing(args: string[]): TerminalLine[] {
    const countIdx = args.indexOf('-c');
    const count = countIdx !== -1 ? parseInt(args[countIdx + 1]) || 3 : 3;
    const target = args.filter(a => !a.startsWith('-') && isNaN(Number(a)))[0] || 'localhost';

    const results: TerminalLine[] = [
      { type: 'output', content: `PING ${target} (${target === 'localhost' ? '127.0.0.1' : target}): 56 data bytes` }
    ];

    for (let i = 0; i < count; i++) {
      results.push({
        type: 'output',
        content: `64 bytes from ${target === 'localhost' ? '127.0.0.1' : target}: icmp_seq=${i} ttl=64 time=${(Math.random() * 2).toFixed(3)} ms`
      });
    }

    results.push(
      { type: 'output', content: `--- ${target} ping statistics ---` },
      { type: 'output', content: `${count} packets transmitted, ${count} packets received, 0.0% packet loss` }
    );

    return results;
  }

  private cmdCurl(args: string[]): TerminalLine[] {
    const url = args.find(a => a.startsWith('http') || a.startsWith('www'));
    if (!url) {
      return [{ type: 'error', content: 'curl: try \'curl --help\' for more information' }];
    }
    return [
      { type: 'output', content: '<!DOCTYPE html><html><head><title>Example</title></head><body><h1>Hello World</h1></body></html>' },
      { type: 'info', content: `(模拟 ${url} 的响应)` }
    ];
  }

  private cmdWget(args: string[]): TerminalLine[] {
    const url = args.find(a => a.startsWith('http') || a.startsWith('www'));
    if (!url) {
      return [{ type: 'error', content: 'wget: missing URL' }];
    }
    return [
      { type: 'output', content: `--${new Date().toISOString()}--  ${url}` },
      { type: 'output', content: 'Resolving host... done.' },
      { type: 'output', content: 'Connecting to host... connected.' },
      { type: 'output', content: 'HTTP request sent, awaiting response... 200 OK' },
      { type: 'output', content: 'Length: 1024 (1.0K) [text/html]' },
      { type: 'output', content: 'Saving to: \'index.html\'' },
      { type: 'output', content: 'index.html          100%[===================>]   1.00K  --.-KB/s    in 0s' },
      { type: 'info', content: `'index.html\' saved [1024/1024]` }
    ];
  }

  private cmdIfconfig(): TerminalLine[] {
    return [
      { type: 'output', content: 'eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500' },
      { type: 'output', content: '        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255' },
      { type: 'output', content: '        inet6 fe80::1  prefixlen 64  scopeid 0x20<link>' },
      { type: 'output', content: '        ether 00:11:22:33:44:55  txqueuelen 1000  (Ethernet)' },
      { type: 'output', content: '' },
      { type: 'output', content: 'lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536' },
      { type: 'output', content: '        inet 127.0.0.1  netmask 255.0.0.0' },
      { type: 'output', content: '        loop  txqueuelen 1000  (Local Loopback)' }
    ];
  }

  private cmdIp(args: string[]): TerminalLine[] {
    if (args[0] === 'addr' || args[0] === 'a') {
      return [
        { type: 'output', content: '1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536' },
        { type: 'output', content: '    inet 127.0.0.1/8 scope host lo' },
        { type: 'output', content: '2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500' },
        { type: 'output', content: '    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0' }
      ];
    }
    if (args[0] === 'route' || args[0] === 'r') {
      return [
        { type: 'output', content: 'default via 192.168.1.1 dev eth0' },
        { type: 'output', content: '192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100' }
      ];
    }
    return [{ type: 'output', content: 'Usage: ip [ addr | link | route ]' }];
  }

  private cmdNetstat(_args: string[]): TerminalLine[] {
    return [
      { type: 'output', content: 'Active Internet connections (only servers)' },
      { type: 'output', content: 'Proto Recv-Q Send-Q Local Address           Foreign Address         State' },
      { type: 'output', content: 'tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN' },
      { type: 'output', content: 'tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN' },
      { type: 'output', content: 'tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN' },
      { type: 'output', content: 'udp        0      0 0.0.0.0:68              0.0.0.0:*' }
    ];
  }

  private cmdSs(_args: string[]): TerminalLine[] {
    return [
      { type: 'output', content: 'Netid  State   Recv-Q  Send-Q   Local Address:Port   Peer Address:Port' },
      { type: 'output', content: 'tcp    LISTEN  0       128      0.0.0.0:22            0.0.0.0:*' },
      { type: 'output', content: 'tcp    LISTEN  0       128      0.0.0.0:80            0.0.0.0:*' },
      { type: 'output', content: 'tcp    LISTEN  0       128      0.0.0.0:443           0.0.0.0:*' }
    ];
  }

  private cmdSsh(args: string[]): TerminalLine[] {
    const target = args.find(a => a.includes('@') || a === 'localhost') || 'localhost';
    return [
      { type: 'output', content: `The authenticity of host '${target}' can't be established.` },
      { type: 'output', content: 'ECDSA key fingerprint is SHA256:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' },
      { type: 'info', content: '(模拟 SSH 连接，需要确认连接)' }
    ];
  }

  // ===== 新增：系统命令 =====

  private cmdDf(_args: string[]): TerminalLine[] {
    return [
      { type: 'output', content: 'Filesystem      Size  Used Avail Use% Mounted on' },
      { type: 'output', content: '/dev/sda1        20G  8.5G   11G  45% /' },
      { type: 'output', content: 'tmpfs           3.9G     0  3.9G   0% /dev/shm' },
      { type: 'output', content: '/dev/sdb1       100G   45G   55G  45% /data' }
    ];
  }

  private cmdDu(args: string[]): TerminalLine[] {
    const target = args.filter(a => !a.startsWith('-'))[0] || '.';
    if (args.includes('-sh') || args.includes('-hs')) {
      return [{ type: 'output', content: `4.0K\t${target}` }];
    }
    return [
      { type: 'output', content: `4.0K\t${target}/Documents` },
      { type: 'output', content: `0\t${target}/Downloads` },
      { type: 'output', content: `4.0K\t${target}` }
    ];
  }

  private cmdUname(args: string[]): TerminalLine[] {
    if (args.includes('-a')) {
      return [{ type: 'output', content: 'Linux linux-quest 5.15.0-generic #1 SMP x86_64 GNU/Linux' }];
    }
    if (args.includes('-r')) {
      return [{ type: 'output', content: '5.15.0-generic' }];
    }
    if (args.includes('-m')) {
      return [{ type: 'output', content: 'x86_64' }];
    }
    return [{ type: 'output', content: 'Linux' }];
  }

  private cmdHostname(): TerminalLine[] {
    return [{ type: 'output', content: 'linux-quest' }];
  }

  private cmdApt(args: string[]): TerminalLine[] {
    if (args.includes('list') && args.includes('--installed')) {
      return [
        { type: 'output', content: 'Listing...' },
        { type: 'output', content: 'bash/focal,now 5.0-6ubuntu1.2 amd64 [installed]' },
        { type: 'output', content: 'coreutils/focal,now 8.30-3ubuntu2 amd64 [installed]' },
        { type: 'output', content: 'curl/focal,now 7.68.0-1ubuntu2.7 amd64 [installed]' },
        { type: 'output', content: 'grep/focal,now 3.4-1 amd64 [installed]' },
        { type: 'output', content: 'sed/focal,now 4.7-1 amd64 [installed]' }
      ];
    }
    if (args[0] === 'install') {
      return [{ type: 'output', content: `正在安装 ${args[1] || 'package'}... (模拟)` }];
    }
    if (args[0] === 'update') {
      return [{ type: 'output', content: 'Hit:1 http://archive.ubuntu.com/ubuntu focal InRelease' }];
    }
    return [{ type: 'output', content: 'Usage: apt [update|upgrade|install|remove|search|list]' }];
  }

  private cmdYum(args: string[]): TerminalLine[] {
    if (args[0] === 'install') {
      return [{ type: 'output', content: `正在安装 ${args[1] || 'package'}... (模拟)` }];
    }
    return [{ type: 'output', content: 'Usage: yum [install|remove|update|search]' }];
  }

  private cmdSystemctl(args: string[]): TerminalLine[] {
    if (args[0] === 'status') {
      return [
        { type: 'output', content: '● linux-quest' },
        { type: 'output', content: '   State: running' },
        { type: 'output', content: '   Jobs: 0 queued' },
        { type: 'output', content: '   Memory: 128.0M' },
        { type: 'output', content: '   CPU: 1.234s' }
      ];
    }
    if (args.includes('list-units') && args.includes('--type=service')) {
      return [
        { type: 'output', content: 'UNIT                               LOAD   ACTIVE SUB     DESCRIPTION' },
        { type: 'output', content: 'nginx.service                      loaded active running Nginx Web Server' },
        { type: 'output', content: 'ssh.service                        loaded active running OpenSSH server' },
        { type: 'output', content: 'systemd-logind.service             loaded active running Login Service' },
        { type: 'output', content: 'cron.service                       loaded active running Regular background program processing daemon' },
        { type: 'output', content: 'dbus.service                       loaded active running D-Bus System Message Bus' }
      ];
    }
    return [{ type: 'output', content: '' }];
  }

  private cmdJournalctl(args: string[]): TerminalLine[] {
    const lines = [
      'Jul 03 10:00:00 linux-quest systemd[1]: Started Linux Quest.',
      'Jul 03 10:00:01 linux-quest sshd[100]: Server listening on 0.0.0.0 port 22.',
      'Jul 03 10:00:02 linux-quest nginx[101]: Starting nginx...',
      'Jul 03 10:00:03 linux-quest kernel: Linux version 5.15.0-generic',
      'Jul 03 10:00:04 linux-quest systemd[1]: Reached target Multi-User System.',
      'Jul 03 10:00:05 linux-quest cron[102]: (CRON) INFO (pidfile fd = 3)',
      'Jul 03 10:00:06 linux-quest kernel: Memory: 8192MB total',
      'Jul 03 10:00:07 linux-quest systemd[1]: Started User Manager for UID 1000.',
      'Jul 03 10:00:08 linux-quest sshd[103]: Accepted publickey for user',
      'Jul 03 10:00:09 linux-quest systemd[1]: Starting Daily apt activities...'
    ];

    let n = 10;
    const nIdx = args.indexOf('-n');
    if (nIdx !== -1 && args[nIdx + 1]) n = parseInt(args[nIdx + 1]);

    return lines.slice(0, n).map(l => ({ type: 'output' as const, content: l }));
  }

  private cmdSleep(_args: string[]): TerminalLine[] {
    return [];
  }

  private cmdChmod(_args: string[]): TerminalLine[] {
    return [];
  }

  private cmdChown(_args: string[]): TerminalLine[] {
    return [];
  }

  private cmdChgrp(_args: string[]): TerminalLine[] {
    return [];
  }

  private cmdUmask(): TerminalLine[] {
    return [{ type: 'output', content: '0022' }];
  }

  private cmdUptime(): TerminalLine[] {
    return [{ type: 'output', content: ` 10:00:00 up 30 days,  1:23,  1 user,  load average: 0.00, 0.01, 0.05` }];
  }

  private cmdFree(): TerminalLine[] {
    return [
      { type: 'output', content: '              total        used        free      shared  buff/cache   available' },
      { type: 'output', content: 'Mem:        8192000     1024000     6144000      128000     1024000     6912000' },
      { type: 'output', content: 'Swap:       2097152           0     2097152' }
    ];
  }

  private cmdGroups(): TerminalLine[] {
    return [{ type: 'output', content: 'user' }];
  }

  private cmdId(): TerminalLine[] {
    return [{ type: 'output', content: 'uid=1000(user) gid=1000(user) groups=1000(user)' }];
  }

  // ===== 文件系统辅助 =====

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
