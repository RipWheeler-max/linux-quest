export interface User {
  uid: string;
  email: string;
  displayName?: string;
}

export interface LevelStep {
  instruction: string;
  command: string;
  explanation: string;
}

export interface Level {
  id: number;
  title: string;
  category: 'basic' | 'permission' | 'text' | 'script' | 'process' | 'network' | 'system';
  description: string;
  missionBriefing: string;
  whatYouLearn: string[];
  steps: LevelStep[];
  lesson: string;
  tasks: Task[];
  hints: string[];
  order: number;
}

export interface Task {
  id: string;
  instruction: string;
  command: string;
  validator: (state: TerminalState) => boolean;
  hint: string;
  completed?: boolean;
}

export interface TerminalState {
  currentDir: string;
  fileSystem: FileSystemNode;
  commandHistory: string[];
  output: TerminalLine[];
}

export interface FileSystemNode {
  [key: string]: FileSystemNode | string;
}

export interface TerminalLine {
  type: 'command' | 'output' | 'error' | 'success' | 'info';
  content: string;
}

export interface UserProgress {
  userId: string;
  completedLevels: number[];
  currentLevel: number;
  totalPlayTime: number;
  hintsUsed: { [levelId: number]: number };
  achievements: string[];
  lastLoginAt: Date;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: (progress: UserProgress) => boolean;
}
