import type { Level, TerminalState } from '../types';

// 辅助函数：不区分大小写的命令检查
const hasCommand = (history: string[], cmd: string): boolean => {
  return history.some(h => h.trim().toLowerCase() === cmd.toLowerCase());
};

const hasCommandContaining = (history: string[], cmd: string): boolean => {
  return history.some(h => h.toLowerCase().includes(cmd.toLowerCase()));
};

export const levels: Level[] = [
  // ===== 基础篇 =====
  {
    id: 1,
    title: '初次见面 - pwd',
    category: 'basic',
    description: '学习如何查看当前所在目录',
    missionBriefing: '欢迎来到 Linux 世界！你刚登录进一台 Linux 服务器，但你完全不知道自己在哪里。在 Linux 中，一切操作都基于"当前位置"，所以第一件事就是搞清楚：我现在在哪个目录？',
    whatYouLearn: ['什么是"工作目录"', 'pwd 命令的作用和用法', 'Linux 路径的基本概念'],
    steps: [{ instruction: '在右边的终端中输入 pwd，然后按回车', command: 'pwd', explanation: 'pwd = Print Working Directory，它会告诉你当前所在的目录路径' }],
    tasks: [{ id: '1-1', instruction: '使用 pwd 命令查看当前目录', command: 'pwd', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'pwd'), hint: '直接输入 pwd 然后按回车' }],
    lesson: `# pwd - 打印工作目录\n\n在Linux中，\`pwd\` 命令用于显示当前所在的工作目录路径。\n\n## 什么是工作目录？\n\n工作目录就是你当前在文件系统中的位置。\n\n## 命令格式\n\n\`\`\`bash\npwd\n\`\`\`\n\n## 示例\n\n\`\`\`bash\n$ pwd\n/home/user\n\`\`\``,
    hints: ['pwd 是 "print working directory" 的缩写', '只需要在终端中输入 pwd 即可', 'pwd 命令不需要任何参数'],
    order: 1
  },
  {
    id: 2,
    title: '探索世界 - ls',
    category: 'basic',
    description: '学习如何查看目录中的内容',
    missionBriefing: '你知道了自己在哪里，但这个目录里有什么？ls 命令就是你的"眼睛"，帮你看到目录里的所有文件和文件夹。',
    whatYouLearn: ['ls 命令的基本用法', '-l 选项：查看文件详细信息', '-a 选项：查看隐藏文件'],
    steps: [
      { instruction: '输入 ls 查看当前目录有什么', command: 'ls', explanation: '列出当前目录下的所有文件和文件夹' },
      { instruction: '输入 ls -l 查看详细信息', command: 'ls -l', explanation: '-l = long format，显示权限、大小、修改时间等详情' },
      { instruction: '输入 ls -a 查看隐藏文件', command: 'ls -a', explanation: '-a = all，显示以 . 开头的隐藏文件' }
    ],
    tasks: [
      { id: '2-1', instruction: '使用 ls 命令查看当前目录内容', command: 'ls', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ls'), hint: '输入 ls 并按回车' },
      { id: '2-2', instruction: '使用 ls -l 查看详细信息', command: 'ls -l', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ls -l'), hint: '输入 ls -l 查看长格式输出' },
      { id: '2-3', instruction: '使用 ls -a 查看隐藏文件', command: 'ls -a', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ls -a'), hint: '输入 ls -a 查看所有文件包括隐藏文件' }
    ],
    lesson: `# ls - 列出目录内容\n\n\`ls\` 是Linux中最常用的命令之一。\n\n## 常用选项\n\n- \`ls -l\` 显示详细信息\n- \`ls -a\` 显示隐藏文件`,
    hints: ['ls 命令可以带选项，比如 -l, -a, -la', '-l 选项显示详细信息', '-a 选项显示隐藏文件'],
    order: 2
  },
  {
    id: 3,
    title: '穿越迷宫 - cd',
    category: 'basic',
    description: '学习如何在目录间切换',
    missionBriefing: '你已经能"看"到目录里的东西了，但你被困在一个地方动不了。cd 命令就是你的"腿"，让你在文件系统中自由移动。',
    whatYouLearn: ['cd 命令的基本用法', 'cd ~ 回到主目录', 'cd .. 返回上一级'],
    steps: [
      { instruction: '输入 cd Documents 进入 Documents 目录', command: 'cd Documents', explanation: 'cd = Change Directory，进入指定的目录' },
      { instruction: '输入 pwd 确认你已经在 Documents 里了', command: 'pwd', explanation: '用 pwd 验证当前位置确实改变了' },
      { instruction: '输入 cd .. 返回上一级目录', command: 'cd ..', explanation: '.. 代表上一级目录，cd .. 就是"往回走一步"' }
    ],
    tasks: [
      { id: '3-1', instruction: '使用 cd Documents 进入 Documents 目录', command: 'cd Documents', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'cd documents'), hint: '输入 cd Documents 然后按回车' },
      { id: '3-2', instruction: '使用 pwd 确认你已进入 Documents 目录', command: 'pwd', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'pwd'), hint: '先进入 Documents，然后用 pwd 确认' },
      { id: '3-3', instruction: '使用 cd .. 返回上一级目录', command: 'cd ..', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'cd ..'), hint: '输入 cd .. 返回上级目录' }
    ],
    lesson: `# cd - 切换目录\n\n\`cd\` 命令用于在文件系统中移动。\n\n## 常用技巧\n\n- \`cd ~\` 回到主目录\n- \`cd ..\` 回到上一级`,
    hints: ['cd 是 "change directory" 的缩写', '.. 表示上级目录', '~ 表示你的主目录'],
    order: 3
  },
  {
    id: 4,
    title: '创建领地 - mkdir',
    category: 'basic',
    description: '学习如何创建新目录',
    missionBriefing: '你已经能在文件系统中自由穿行了，现在是时候创建属于你自己的空间了！mkdir 命令让你能创建新的文件夹。',
    whatYouLearn: ['mkdir 命令的基本用法', '如何创建多层目录'],
    steps: [
      { instruction: '输入 mkdir practice 创建一个新目录', command: 'mkdir practice', explanation: 'mkdir = Make Directory，创建一个新文件夹' },
      { instruction: '输入 ls 确认目录已创建', command: 'ls', explanation: '用 ls 看看新目录是否出现了' }
    ],
    tasks: [
      { id: '4-1', instruction: '使用 mkdir 创建一个名为 "practice" 的目录', command: 'mkdir practice', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'mkdir practice'), hint: '输入 mkdir practice 然后按回车' },
      { id: '4-2', instruction: '使用 ls 确认目录已创建', command: 'ls', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ls'), hint: '使用 ls 查看目录是否创建成功' }
    ],
    lesson: `# mkdir - 创建目录\n\n\`mkdir\` 命令用于创建新的目录。\n\n## 基本用法\n\n\`\`\`bash\nmkdir 目录名\n\`\`\``,
    hints: ['mkdir 是 "make directory" 的缩写', '直接输入 mkdir 加上目录名', '创建后用 ls 验证是否成功'],
    order: 4
  },
  {
    id: 5,
    title: '创建文件 - touch',
    category: 'basic',
    description: '学习如何创建空文件',
    missionBriefing: '有了目录，接下来你需要创建文件。touch 命令是最简单的创建文件的方式。',
    whatYouLearn: ['touch 命令的基本用法', '如何创建空文件'],
    steps: [
      { instruction: '输入 touch hello.txt 创建一个空文件', command: 'touch hello.txt', explanation: 'touch 会创建一个空文件' },
      { instruction: '输入 ls -l 确认文件已创建', command: 'ls -l', explanation: '用 ls -l 查看文件详情' }
    ],
    tasks: [
      { id: '5-1', instruction: '使用 touch 创建一个名为 "hello.txt" 的文件', command: 'touch hello.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'touch hello.txt'), hint: '输入 touch hello.txt 然后按回车' },
      { id: '5-2', instruction: '使用 ls -l 确认文件已创建', command: 'ls -l', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ls -l'), hint: '输入 ls -l 查看文件详情' }
    ],
    lesson: `# touch - 创建文件\n\n\`touch\` 命令用于创建空文件。\n\n## 基本用法\n\n\`\`\`bash\ntouch 文件名\n\`\`\``,
    hints: ['touch 命令可以创建空文件', '如果文件已存在，touch 会更新其时间戳'],
    order: 5
  },
  {
    id: 6,
    title: '阅读文件 - cat',
    category: 'basic',
    description: '学习如何查看文件内容',
    missionBriefing: '你已经会创建文件了，但如果文件里有内容，怎么查看呢？cat 命令就像打开一本书。',
    whatYouLearn: ['cat 命令的基本用法', '-n 选项：显示行号'],
    steps: [
      { instruction: '输入 cat readme.txt 查看文件内容', command: 'cat readme.txt', explanation: 'cat 会把文件内容全部显示在终端上' },
      { instruction: '输入 cat -n readme.txt 查看带行号的内容', command: 'cat -n readme.txt', explanation: '-n 会在每行前面加上行号' }
    ],
    tasks: [
      { id: '6-1', instruction: '使用 cat 查看 readme.txt 的内容', command: 'cat readme.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'cat readme.txt'), hint: '输入 cat readme.txt 然后按回车' },
      { id: '6-2', instruction: '使用 cat -n 查看带行号的内容', command: 'cat -n readme.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'cat -n readme.txt'), hint: '输入 cat -n readme.txt 查看带行号的输出' }
    ],
    lesson: `# cat - 显示文件内容\n\n\`cat\` 命令用于查看文件的全部内容。`,
    hints: ['cat 是 "concatenate" 的缩写', '-n 选项可以显示行号'],
    order: 6
  },
  {
    id: 7,
    title: '删除文件 - rm',
    category: 'basic',
    description: '学习如何删除文件和目录',
    missionBriefing: '有时候你需要清理不需要的文件。rm 命令可以删除文件，但它是个"危险"的命令——删了就没了！',
    whatYouLearn: ['rm 命令的基本用法', '-r 选项：删除目录'],
    steps: [
      { instruction: '输入 touch test.txt 创建一个测试文件', command: 'touch test.txt', explanation: '先创建一个文件用来测试删除' },
      { instruction: '输入 rm test.txt 删除它', command: 'rm test.txt', explanation: 'rm = Remove，删除指定的文件' },
      { instruction: '输入 ls 确认文件已消失', command: 'ls', explanation: '验证文件确实被删除了' }
    ],
    tasks: [
      { id: '7-1', instruction: '先创建一个测试文件：touch test.txt', command: 'touch test.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'touch test.txt'), hint: '输入 touch test.txt 创建测试文件' },
      { id: '7-2', instruction: '使用 rm 删除 test.txt', command: 'rm test.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'rm test.txt'), hint: '输入 rm test.txt 删除文件' },
      { id: '7-3', instruction: '使用 ls 确认文件已被删除', command: 'ls', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ls'), hint: '使用 ls 查看文件是否已删除' }
    ],
    lesson: `# rm - 删除文件\n\n\`rm\` 命令用于删除文件和目录。\n\n## ⚠️ 危险操作\n\n永远不要运行 \`rm -rf /\``,
    hints: ['rm 是 "remove" 的缩写', '删除目录需要 -r 选项'],
    order: 7
  },
  {
    id: 8,
    title: '复制与移动 - cp 和 mv',
    category: 'basic',
    description: '学习如何复制和移动/重命名文件',
    missionBriefing: '在实际工作中，你经常需要备份文件（复制）或者整理文件位置（移动/重命名）。',
    whatYouLearn: ['cp 命令：复制文件', 'mv 命令：移动或重命名文件'],
    steps: [
      { instruction: '输入 touch original.txt 创建文件', command: 'touch original.txt', explanation: '先创建一个文件用来测试' },
      { instruction: '输入 cp original.txt copy.txt 复制文件', command: 'cp original.txt copy.txt', explanation: 'cp = Copy，把文件复制一份' },
      { instruction: '输入 mv copy.txt renamed.txt 重命名文件', command: 'mv copy.txt renamed.txt', explanation: 'mv = Move，可以移动文件，也可以重命名' }
    ],
    tasks: [
      { id: '8-1', instruction: '创建一个文件：touch original.txt', command: 'touch original.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'touch original.txt'), hint: '输入 touch original.txt 创建文件' },
      { id: '8-2', instruction: '使用 cp 复制文件：cp original.txt copy.txt', command: 'cp original.txt copy.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'cp original.txt copy.txt'), hint: '输入 cp original.txt copy.txt 复制文件' },
      { id: '8-3', instruction: '使用 mv 重命名：mv copy.txt renamed.txt', command: 'mv copy.txt renamed.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'mv copy.txt renamed.txt'), hint: '输入 mv copy.txt renamed.txt 重命名文件' }
    ],
    lesson: `# cp 和 mv - 复制与移动\n\n## cp - 复制文件\n\n\`cp file1 file2\`\n\n## mv - 移动/重命名\n\n\`mv old new\``,
    hints: ['cp 用于复制，mv 用于移动或重命名', '复制目录需要 -r 选项'],
    order: 8
  },
  {
    id: 9,
    title: '文字回声 - echo',
    category: 'basic',
    description: '学习使用 echo 输出文本',
    missionBriefing: 'echo 命令就像对着山谷喊话——你说什么，它就"回"什么。',
    whatYouLearn: ['echo 命令的基本用法', '如何输出环境变量'],
    steps: [
      { instruction: '输入 echo "Hello Linux" 输出一段文字', command: 'echo "Hello Linux"', explanation: 'echo 会把你写的内容显示在终端上' },
      { instruction: '输入 echo $HOME 查看你的主目录路径', command: 'echo $HOME', explanation: '$HOME 是一个环境变量' }
    ],
    tasks: [
      { id: '9-1', instruction: '使用 echo 输出 "Hello Linux"', command: 'echo "Hello Linux"', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo') && hasCommandContaining(state.commandHistory, 'hello linux'), hint: '输入 echo "Hello Linux" 或 echo Hello Linux' },
      { id: '9-2', instruction: '使用 echo $HOME 查看主目录', command: 'echo $HOME', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo $home'), hint: '输入 echo $HOME 查看环境变量' }
    ],
    lesson: `# echo - 输出文本\n\n\`echo\` 命令用于在终端显示文本。`,
    hints: ['echo 用于输出文本到终端', '$变量名 可以显示环境变量的值'],
    order: 9
  },
  {
    id: 10,
    title: '基础篇总结',
    category: 'basic',
    description: '回顾基础命令，完成综合练习',
    missionBriefing: '恭喜你走到了基础篇的最后一关！这一关是综合测试。',
    whatYouLearn: ['综合运用 pwd、ls、cd、mkdir、touch 等命令'],
    steps: [
      { instruction: '输入 mkdir project 创建项目目录', command: 'mkdir project', explanation: '创建一个新的项目文件夹' },
      { instruction: '输入 cd project 进入项目目录', command: 'cd project', explanation: '进入刚创建的目录' },
      { instruction: '输入 touch readme.txt 创建文件', command: 'touch readme.txt', explanation: '在项目目录里创建一个文件' },
      { instruction: '输入 pwd 确认你在 project 目录中', command: 'pwd', explanation: '验证当前位置' },
      { instruction: '输入 cd .. 返回上级目录', command: 'cd ..', explanation: '回到之前的目录' }
    ],
    tasks: [
      { id: '10-1', instruction: '创建一个目录：mkdir project', command: 'mkdir project', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'mkdir project'), hint: '输入 mkdir project 创建目录' },
      { id: '10-2', instruction: '进入 project 目录：cd project', command: 'cd project', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'cd project'), hint: '输入 cd project 进入目录' },
      { id: '10-3', instruction: '创建 readme.txt：touch readme.txt', command: 'touch readme.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'touch readme.txt'), hint: '输入 touch readme.txt 创建文件' },
      { id: '10-4', instruction: '使用 pwd 确认你在 project 目录中', command: 'pwd', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'pwd'), hint: '使用 pwd 确认当前位置' },
      { id: '10-5', instruction: '返回上级目录：cd ..', command: 'cd ..', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'cd ..'), hint: '输入 cd .. 返回上级目录' }
    ],
    lesson: `# 基础篇总结\n\n恭喜你完成了基础篇的学习！`,
    hints: ['按顺序执行每个命令', '如果不确定当前位置，使用 pwd'],
    order: 10
  },

  // ===== 权限篇 =====
  {
    id: 11,
    title: '理解权限 - ls -l',
    category: 'permission',
    description: '学习查看和理解文件权限',
    missionBriefing: '在 Linux 中，每个文件都有权限设置，决定了谁能读取、写入和执行它。ls -l 命令可以显示这些权限信息。学会读懂权限是管理系统的第一步。',
    whatYouLearn: ['权限字符串的含义 (rwx)', '文件所有者、所属组、其他人的概念', '如何用 ls -l 查看权限'],
    steps: [
      { instruction: '输入 ls -l 查看文件权限', command: 'ls -l', explanation: 'ls -l 会显示详细的文件信息，包括权限、所有者、大小等' },
      { instruction: '输入 ls -la 查看包含隐藏文件的权限', command: 'ls -la', explanation: '隐藏文件以 . 开头，-a 选项会显示它们' }
    ],
    tasks: [
      { id: '11-1', instruction: '使用 ls -l 查看文件权限', command: 'ls -l', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ls -l'), hint: '输入 ls -l 查看详细权限信息' },
      { id: '11-2', instruction: '使用 ls -la 查看所有文件权限', command: 'ls -la', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ls -la'), hint: '输入 ls -la 包含隐藏文件' }
    ],
    lesson: `# 理解文件权限\n\n## 权限字符串\n\n\`-rw-r--r--\` 这串字符表示文件权限：\n\n- 第1位：文件类型 (- 普通文件, d 目录)\n- 第2-4位：所有者权限 (r=读, w=写, x=执行)\n- 第5-7位：所属组权限\n- 第8-10位：其他人权限\n\n## 示例\n\n\`\`\`bash\n$ ls -l\ntotal 8\n-rw-r--r-- 1 user user  28 Jun 11 10:00 readme.txt\ndrwxr-xr-x 2 user user 4096 Jun 11 10:00 Documents\n\`\`\``,
    hints: ['r=读(4), w=写(2), x=执行(1)', '权限分为三组：所有者、组、其他人', 'd 开头表示目录，- 开头表示文件'],
    order: 11
  },
  {
    id: 12,
    title: '修改权限 - chmod',
    category: 'permission',
    description: '学习使用 chmod 修改文件权限',
    missionBriefing: '有时候你需要修改文件的权限，比如让脚本可以执行，或者保护敏感文件不被其他人读取。chmod 命令就是用来做这件事的。',
    whatYouLearn: ['chmod 的数字模式 (755, 644)', 'chmod 的符号模式 (u+x, go-w)', '如何给文件添加执行权限'],
    steps: [
      { instruction: '输入 touch test.sh 创建一个脚本文件', command: 'touch test.sh', explanation: '先创建一个测试文件' },
      { instruction: '输入 chmod 755 test.sh 设置权限', command: 'chmod 755 test.sh', explanation: '755 = 所有者rwx, 组rx, 其他人rx' },
      { instruction: '输入 ls -l test.sh 查看权限变化', command: 'ls -l test.sh', explanation: '验证权限已修改为 -rwxr-xr-x' }
    ],
    tasks: [
      { id: '12-1', instruction: '创建测试文件：touch test.sh', command: 'touch test.sh', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'touch test.sh'), hint: '输入 touch test.sh 创建文件' },
      { id: '12-2', instruction: '设置权限：chmod 755 test.sh', command: 'chmod 755 test.sh', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'chmod 755 test.sh'), hint: '输入 chmod 755 test.sh' },
      { id: '12-3', instruction: '查看权限：ls -l test.sh', command: 'ls -l test.sh', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ls -l test.sh'), hint: '输入 ls -l test.sh 验证' }
    ],
    lesson: `# chmod - 修改权限\n\n## 数字模式\n\n| 数字 | 权限 | 含义 |\n|------|------|------|\n| 7 | rwx | 读+写+执行 |\n| 6 | rw- | 读+写 |\n| 5 | r-x | 读+执行 |\n| 4 | r-- | 只读 |\n| 0 | --- | 无权限 |\n\n## 常用组合\n\n- \`755\`：所有者全权限，其他人读+执行\n- \`644\`：所有者读写，其他人只读\n- \`700\`：只有所有者有权限`,
    hints: ['数字模式：r=4, w=2, x=1，相加', '755 = rwxr-xr-x', '644 = rw-r--r--'],
    order: 12
  },
  {
    id: 13,
    title: '修改所有者 - chown',
    category: 'permission',
    description: '学习使用 chown 修改文件所有者',
    missionBriefing: '在多用户系统中，你可能需要把文件的所有权转移给其他用户。chown 命令可以修改文件的所有者。',
    whatYouLearn: ['chown 命令的基本用法', '如何同时修改所有者和所属组', 'chown 和 chgrp 的区别'],
    steps: [
      { instruction: '输入 touch myfile.txt 创建文件', command: 'touch myfile.txt', explanation: '创建一个测试文件' },
      { instruction: '输入 ls -l myfile.txt 查看当前所有者', command: 'ls -l myfile.txt', explanation: '查看文件的当前所有者信息' }
    ],
    tasks: [
      { id: '13-1', instruction: '创建文件：touch myfile.txt', command: 'touch myfile.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'touch myfile.txt'), hint: '输入 touch myfile.txt' },
      { id: '13-2', instruction: '查看所有者：ls -l myfile.txt', command: 'ls -l myfile.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ls -l myfile.txt'), hint: '输入 ls -l myfile.txt' }
    ],
    lesson: `# chown - 修改所有者\n\n## 基本用法\n\n\`\`\`bash\nchown 用户名 文件      # 修改所有者\nchown 用户名:组名 文件  # 同时修改所有者和组\nchown :组名 文件       # 只修改组\n\`\`\`\n\n## 示例\n\n\`\`\`bash\n$ chown john file.txt\n$ chown john:developers file.txt\n\`\`\``,
    hints: ['chown 只有 root 或文件所有者能用', 'chown user:group 可以同时改所有者和组', 'chgrp 命令只改组'],
    order: 13
  },
  {
    id: 14,
    title: '修改组 - chgrp',
    category: 'permission',
    description: '学习使用 chgrp 修改文件所属组',
    missionBriefing: 'Linux 中的文件属于一个用户组，组内的用户可以共享文件权限。chgrp 命令用来修改文件的所属组。',
    whatYouLearn: ['chgrp 命令的基本用法', '用户组的概念', '组权限的作用'],
    steps: [
      { instruction: '输入 touch groupfile.txt 创建文件', command: 'touch groupfile.txt', explanation: '创建测试文件' },
      { instruction: '输入 ls -l groupfile.txt 查看当前组', command: 'ls -l groupfile.txt', explanation: '查看文件的所属组' }
    ],
    tasks: [
      { id: '14-1', instruction: '创建文件：touch groupfile.txt', command: 'touch groupfile.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'touch groupfile.txt'), hint: '输入 touch groupfile.txt' },
      { id: '14-2', instruction: '查看组信息：ls -l groupfile.txt', command: 'ls -l groupfile.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ls -l groupfile.txt'), hint: '输入 ls -l groupfile.txt' }
    ],
    lesson: `# chgrp - 修改所属组\n\n## 基本用法\n\n\`\`\`bash\nchgrp 组名 文件\n\`\`\`\n\n## 示例\n\n\`\`\`bash\n$ chgrp developers project.txt\n$ ls -l project.txt\n-rw-r--r-- 1 user developers 0 Jun 11 10:00 project.txt\n\`\`\`\n\n## 用户组的作用\n\n- 同一组的用户可以共享文件\n- 组权限控制组内用户的访问`,
    hints: ['chgrp = change group', '组权限对组内所有用户生效', '可以用 groups 命令查看用户所在的组'],
    order: 14
  },
  {
    id: 15,
    title: '默认权限 - umask',
    category: 'permission',
    description: '学习使用 umask 设置默认权限',
    missionBriefing: '当你创建新文件或目录时，系统会自动设置默认权限。umask 命令可以查看和修改这个默认权限掩码。',
    whatYouLearn: ['umask 的含义', '如何计算默认权限', 'umask 与权限的关系'],
    steps: [
      { instruction: '输入 umask 查看当前默认掩码', command: 'umask', explanation: 'umask 显示当前的权限掩码' },
      { instruction: '输入 touch newfile.txt 创建文件', command: 'touch newfile.txt', explanation: '创建一个新文件' },
      { instruction: '输入 ls -l newfile.txt 查看默认权限', command: 'ls -l newfile.txt', explanation: '查看新文件的默认权限' }
    ],
    tasks: [
      { id: '15-1', instruction: '查看 umask：umask', command: 'umask', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'umask'), hint: '输入 umask 查看掩码' },
      { id: '15-2', instruction: '创建文件：touch newfile.txt', command: 'touch newfile.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'touch newfile.txt'), hint: '输入 touch newfile.txt' },
      { id: '15-3', instruction: '查看权限：ls -l newfile.txt', command: 'ls -l newfile.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ls -l newfile.txt'), hint: '输入 ls -l newfile.txt' }
    ],
    lesson: `# umask - 默认权限\n\n## 什么是 umask？\n\numask 是权限"掩码"，它决定了新文件的默认权限。\n\n## 计算方式\n\n- 文件默认权限 = 666 - umask\n- 目录默认权限 = 777 - umask\n\n## 常见 umask 值\n\n| umask | 文件权限 | 目录权限 |\n|-------|----------|----------|\n| 022 | 644 | 755 |\n| 027 | 640 | 750 |\n| 077 | 600 | 700 |`,
    hints: ['umask 022 是最常见的设置', 'umask 越大，权限越严格', 'umask 只影响新创建的文件'],
    order: 15
  },
  {
    id: 16,
    title: '特殊权限 - SUID',
    category: 'permission',
    description: '学习 SUID 特殊权限位',
    missionBriefing: '除了基本的 rwx 权限，Linux 还有特殊权限位。SUID 让程序以文件所有者的身份运行，这在系统管理中很有用。',
    whatYouLearn: ['SUID 的含义和作用', '如何设置 SUID', 'SUID 的安全注意事项'],
    steps: [
      { instruction: '输入 touch myscript.sh 创建脚本', command: 'touch myscript.sh', explanation: '创建一个脚本文件' },
      { instruction: '输入 chmod u+s myscript.sh 设置 SUID', command: 'chmod u+s myscript.sh', explanation: 'u+s 添加 SUID 位' },
      { instruction: '输入 ls -l myscript.sh 查看 SUID', command: 'ls -l myscript.sh', explanation: 'SUID 显示为 s 或 S' }
    ],
    tasks: [
      { id: '16-1', instruction: '创建脚本：touch myscript.sh', command: 'touch myscript.sh', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'touch myscript.sh'), hint: '输入 touch myscript.sh' },
      { id: '16-2', instruction: '设置 SUID：chmod u+s myscript.sh', command: 'chmod u+s myscript.sh', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'chmod u+s myscript.sh'), hint: '输入 chmod u+s myscript.sh' },
      { id: '16-3', instruction: '查看权限：ls -l myscript.sh', command: 'ls -l myscript.sh', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ls -l myscript.sh'), hint: '输入 ls -l myscript.sh' }
    ],
    lesson: `# SUID 特殊权限\n\n## 什么是 SUID？\n\nSUID (Set User ID) 让程序以文件所有者的身份运行。\n\n## 显示方式\n\n\`\`\`bash\n-rwsr-xr-x  # SUID 位 (s 在所有者执行位)\n-rwSr--r--  # SUID 位但无执行权限 (大写 S)\n\`\`\`\n\n## 典型应用\n\n- \`passwd\` 命令需要 SUID 来修改密码\n- \`sudo\` 命令使用 SUID 提权\n\n## ⚠️ 安全警告\n\nSUID 很危险，不要随意设置！`,
    hints: ['SUID = 4000', 'chmod 4755 file 或 chmod u+s file', '大写 S 表示没有执行权限'],
    order: 16
  },

  // ===== 文本篇 =====
  {
    id: 17,
    title: '搜索文本 - grep',
    category: 'text',
    description: '学习使用 grep 搜索文件内容',
    missionBriefing: '当你需要在大量文本中查找特定内容时，grep 是最强大的工具。它可以在文件中搜索匹配的行，是日志分析和代码搜索的必备技能。',
    whatYouLearn: ['grep 的基本用法', '忽略大小写搜索 (-i)', '显示行号 (-n)'],
    steps: [
      { instruction: '输入 echo "hello world" > test.txt 创建测试文件', command: 'echo "hello world" > test.txt', explanation: '创建一个包含文本的文件' },
      { instruction: '输入 echo "Hello Linux" >> test.txt 追加内容', command: 'echo "Hello Linux" >> test.txt', explanation: '追加更多内容到文件' },
      { instruction: '输入 grep "hello" test.txt 搜索', command: 'grep "hello" test.txt', explanation: '搜索包含 hello 的行' },
      { instruction: '输入 grep -i "hello" test.txt 忽略大小写', command: 'grep -i "hello" test.txt', explanation: '-i 忽略大小写，会匹配 Hello 和 hello' }
    ],
    tasks: [
      { id: '17-1', instruction: '创建测试文件：echo "hello world" > test.txt', command: 'echo "hello world" > test.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'echo "hello world" > test.txt'), hint: '输入 echo "hello world" > test.txt' },
      { id: '17-2', instruction: '追加内容：echo "Hello Linux" >> test.txt', command: 'echo "Hello Linux" >> test.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'echo "Hello Linux" >> test.txt'), hint: '输入 echo "Hello Linux" >> test.txt' },
      { id: '17-3', instruction: '搜索文本：grep "hello" test.txt', command: 'grep "hello" test.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'grep "hello" test.txt'), hint: '输入 grep "hello" test.txt' },
      { id: '17-4', instruction: '忽略大小写：grep -i "hello" test.txt', command: 'grep -i "hello" test.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'grep -i "hello" test.txt'), hint: '输入 grep -i "hello" test.txt' }
    ],
    lesson: `# grep - 搜索文本\n\n## 基本用法\n\n\`\`\`bash\ngrep "关键词" 文件\n\`\`\`\n\n## 常用选项\n\n| 选项 | 含义 |\n|------|------|\n| -i | 忽略大小写 |\n| -n | 显示行号 |\n| -r | 递归搜索目录 |\n| -v | 反向选择（不匹配的行）|\n| -c | 只显示匹配行数 |\n\n## 示例\n\n\`\`\`bash\n$ grep -n "error" log.txt\n42:error: file not found\n\`\`\``,
    hints: ['grep = Global Regular Expression Print', '-i 忽略大小写非常常用', '用 -n 显示行号方便定位'],
    order: 17
  },
  {
    id: 18,
    title: '排序去重 - sort uniq',
    category: 'text',
    description: '学习使用 sort 和 uniq 排序和去重',
    missionBriefing: '处理数据时经常需要排序和去重。sort 命令可以对文本行排序，uniq 可以去除重复行。两者结合使用效果更佳。',
    whatYouLearn: ['sort 的基本用法', 'uniq 去重命令', 'sort 和 uniq 的组合使用'],
    steps: [
      { instruction: '输入 echo -e "banana\\napple\\ncherry\\napple" > fruits.txt 创建文件', command: 'echo -e "banana\\napple\\ncherry\\napple" > fruits.txt', explanation: '创建包含重复项的文件' },
      { instruction: '输入 sort fruits.txt 排序', command: 'sort fruits.txt', explanation: '按字母顺序排序' },
      { instruction: '输入 sort fruits.txt | uniq 排序并去重', command: 'sort fruits.txt | uniq', explanation: '先排序再去重（uniq需要排序后的输入）' }
    ],
    tasks: [
      { id: '18-1', instruction: '创建测试文件：echo -e "banana\\napple\\ncherry\\napple" > fruits.txt', command: 'echo -e "banana\\napple\\ncherry\\napple" > fruits.txt', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo') && hasCommandContaining(state.commandHistory, 'fruits.txt'), hint: '输入 echo -e "banana\\napple\\ncherry\\napple" > fruits.txt' },
      { id: '18-2', instruction: '排序：sort fruits.txt', command: 'sort fruits.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'sort fruits.txt'), hint: '输入 sort fruits.txt' },
      { id: '18-3', instruction: '排序去重：sort fruits.txt | uniq', command: 'sort fruits.txt | uniq', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'sort fruits.txt | uniq'), hint: '输入 sort fruits.txt | uniq' }
    ],
    lesson: `# sort 和 uniq\n\n## sort 命令\n\n\`\`\`bash\nsort 文件     # 按字母排序\nsort -n 文件  # 按数字排序\nsort -r 文件  # 反向排序\nsort -u 文件  # 排序并去重\n\`\`\`\n\n## uniq 命令\n\n\`\`\`bash\nuniq 文件      # 去除相邻重复行\nuniq -c 文件   # 显示重复次数\n\`\`\`\n\n## 组合使用\n\n\`\`\`bash\nsort file | uniq  # 先排序再去重\n\`\`\``,
    hints: ['uniq 只去除相邻的重复行，所以要先排序', 'sort -u 等于 sort | uniq', 'sort -n 按数字排序'],
    order: 18
  },
  {
    id: 19,
    title: '统计行数 - wc',
    category: 'text',
    description: '学习使用 wc 统计文件信息',
    missionBriefing: 'wc (word count) 命令可以统计文件的行数、单词数和字符数。在处理文本文件时非常有用。',
    whatYouLearn: ['wc 的基本用法', '统计行数 (-l)', '统计单词数 (-w) 和字符数 (-c)'],
    steps: [
      { instruction: '输入 echo -e "line one\\nline two\\nline three" > lines.txt 创建文件', command: 'echo -e "line one\\nline two\\nline three" > lines.txt', explanation: '创建多行文件' },
      { instruction: '输入 wc lines.txt 统计全部', command: 'wc lines.txt', explanation: '显示行数、单词数、字符数' },
      { instruction: '输入 wc -l lines.txt 只统计行数', command: 'wc -l lines.txt', explanation: '-l 只显示行数' }
    ],
    tasks: [
      { id: '19-1', instruction: '创建文件：echo -e "line one\\nline two\\nline three" > lines.txt', command: 'echo -e "line one\\nline two\\nline three" > lines.txt', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo') && hasCommandContaining(state.commandHistory, 'lines.txt'), hint: '输入 echo -e "line one\\nline two\\nline three" > lines.txt' },
      { id: '19-2', instruction: '统计全部：wc lines.txt', command: 'wc lines.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'wc lines.txt'), hint: '输入 wc lines.txt' },
      { id: '19-3', instruction: '只统计行数：wc -l lines.txt', command: 'wc -l lines.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'wc -l lines.txt'), hint: '输入 wc -l lines.txt' }
    ],
    lesson: `# wc - 统计\n\n## 基本用法\n\n\`\`\`bash\nwc 文件\n# 输出：行数 单词数 字符数 文件名\n\`\`\`\n\n## 常用选项\n\n| 选项 | 含义 |\n|------|------|\n| -l | 只统计行数 |\n| -w | 只统计单词数 |\n| -c | 只统计字符数 |\n\n## 示例\n\n\`\`\`bash\n$ wc -l /etc/passwd\n35 /etc/passwd\n\`\`\``,
    hints: ['wc = word count', '-l 是最常用的选项', '可以统计多个文件：wc *.txt'],
    order: 19
  },
  {
    id: 20,
    title: '截取字段 - cut',
    category: 'text',
    description: '学习使用 cut 截取文本字段',
    missionBriefing: '当文本有固定格式时（如CSV文件），你需要提取特定的列或字段。cut 命令就是用来做这个的。',
    whatYouLearn: ['cut 按分隔符截取 (-d -f)', 'cut 按字符位置截取 (-c)', '处理CSV等结构化文本'],
    steps: [
      { instruction: '输入 echo "name:age:city" > data.txt 创建文件', command: 'echo "name:age:city" > data.txt', explanation: '创建带分隔符的文件' },
      { instruction: '输入 echo "john:25:nyc" >> data.txt 追加', command: 'echo "john:25:nyc" >> data.txt', explanation: '追加更多数据' },
      { instruction: '输入 cut -d: -f1 data.txt 提取第一列', command: 'cut -d: -f1 data.txt', explanation: '-d: 指定分隔符为冒号，-f1 取第一列' },
      { instruction: '输入 cut -d: -f2 data.txt 提取第二列', command: 'cut -d: -f2 data.txt', explanation: '提取年龄列' }
    ],
    tasks: [
      { id: '20-1', instruction: '创建文件：echo "name:age:city" > data.txt', command: 'echo "name:age:city" > data.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'echo "name:age:city" > data.txt'), hint: '输入 echo "name:age:city" > data.txt' },
      { id: '20-2', instruction: '追加数据：echo "john:25:nyc" >> data.txt', command: 'echo "john:25:nyc" >> data.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'echo "john:25:nyc" >> data.txt'), hint: '输入 echo "john:25:nyc" >> data.txt' },
      { id: '20-3', instruction: '提取第一列：cut -d: -f1 data.txt', command: 'cut -d: -f1 data.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'cut -d: -f1 data.txt'), hint: '输入 cut -d: -f1 data.txt' },
      { id: '20-4', instruction: '提取第二列：cut -d: -f2 data.txt', command: 'cut -d: -f2 data.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'cut -d: -f2 data.txt'), hint: '输入 cut -d: -f2 data.txt' }
    ],
    lesson: `# cut - 截取字段\n\n## 按分隔符截取\n\n\`\`\`bash\ncut -d"分隔符" -f列号 文件\n\`\`\`\n\n## 示例\n\n\`\`\`bash\n$ cut -d: -f1 /etc/passwd\nroot\ndaemon\nbin\n\n$ cut -d, -f2 data.csv\n\`\`\`\n\n## 按字符截取\n\n\`\`\`bash\ncut -c1-5 文件  # 截取前5个字符\n\`\`\``,
    hints: ['-d 指定分隔符，-f 指定列号', '可以指定多列：-f1,3', '-c 按字符位置截取'],
    order: 20
  },
  {
    id: 21,
    title: '流编辑 - sed',
    category: 'text',
    description: '学习使用 sed 进行文本替换',
    missionBriefing: 'sed (stream editor) 是一个强大的流编辑器，可以对文本进行查找替换、删除、插入等操作，特别适合批量处理文件。',
    whatYouLearn: ['sed 的基本替换语法', '全局替换 (g 标志)', '原地编辑 (-i 选项)'],
    steps: [
      { instruction: '输入 echo "hello world hello" > sedtest.txt 创建文件', command: 'echo "hello world hello" > sedtest.txt', explanation: '创建测试文件' },
      { instruction: '输入 sed "s/hello/hi/" sedtest.txt 替换第一个', command: 'sed "s/hello/hi/" sedtest.txt', explanation: 's/旧/新/ 替换第一个匹配' },
      { instruction: '输入 sed "s/hello/hi/g" sedtest.txt 全局替换', command: 'sed "s/hello/hi/g" sedtest.txt', explanation: 'g 标志替换所有匹配' }
    ],
    tasks: [
      { id: '21-1', instruction: '创建文件：echo "hello world hello" > sedtest.txt', command: 'echo "hello world hello" > sedtest.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'echo "hello world hello" > sedtest.txt'), hint: '输入 echo "hello world hello" > sedtest.txt' },
      { id: '21-2', instruction: '替换第一个：sed "s/hello/hi/" sedtest.txt', command: 'sed "s/hello/hi/" sedtest.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'sed "s/hello/hi/" sedtest.txt'), hint: '输入 sed "s/hello/hi/" sedtest.txt' },
      { id: '21-3', instruction: '全局替换：sed "s/hello/hi/g" sedtest.txt', command: 'sed "s/hello/hi/g" sedtest.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'sed "s/hello/hi/g" sedtest.txt'), hint: '输入 sed "s/hello/hi/g" sedtest.txt' }
    ],
    lesson: `# sed - 流编辑器\n\n## 替换语法\n\n\`\`\`bash\nsed "s/查找/替换/" 文件\nsed "s/查找/替换/g" 文件  # 全局替换\n\`\`\`\n\n## 常用选项\n\n| 选项 | 含义 |\n|------|------|\n| -i | 原地修改文件 |\n| -n | 静默模式 |\n| -e | 执行多个命令 |\n\n## 示例\n\n\`\`\`bash\n$ sed -i "s/old/new/g" file.txt  # 原地替换\n$ sed "3d" file.txt              # 删除第3行\n\`\`\``,
    hints: ['s 表示替换，g 表示全局', '-i 会直接修改文件，小心使用', '可以用正则表达式：sed "s/[0-9]//g"'],
    order: 21
  },
  {
    id: 22,
    title: '比较文件 - diff',
    category: 'text',
    description: '学习使用 diff 比较文件差异',
    missionBriefing: '当你需要比较两个文件的不同时，diff 是最常用的工具。它会显示具体的差异行，对于代码审查和配置对比非常有用。',
    whatYouLearn: ['diff 的基本用法', '理解 diff 的输出格式', '并排比较 (-y)'],
    steps: [
      { instruction: '输入 echo -e "line1\\nline2\\nline3" > file1.txt 创建文件1', command: 'echo -e "line1\\nline2\\nline3" > file1.txt', explanation: '创建第一个文件' },
      { instruction: '输入 echo -e "line1\\nline modified\\nline3" > file2.txt 创建文件2', command: 'echo -e "line1\\nline modified\\nline3" > file2.txt', explanation: '创建略有不同的第二个文件' },
      { instruction: '输入 diff file1.txt file2.txt 比较差异', command: 'diff file1.txt file2.txt', explanation: '显示两个文件的不同' }
    ],
    tasks: [
      { id: '22-1', instruction: '创建文件1：echo -e "line1\\nline2\\nline3" > file1.txt', command: 'echo -e "line1\\nline2\\nline3" > file1.txt', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo') && hasCommandContaining(state.commandHistory, 'file1.txt'), hint: '输入 echo -e "line1\\nline2\\nline3" > file1.txt' },
      { id: '22-2', instruction: '创建文件2：echo -e "line1\\nline modified\\nline3" > file2.txt', command: 'echo -e "line1\\nline modified\\nline3" > file2.txt', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo') && hasCommandContaining(state.commandHistory, 'file2.txt'), hint: '输入 echo -e "line1\\nline modified\\nline3" > file2.txt' },
      { id: '22-3', instruction: '比较差异：diff file1.txt file2.txt', command: 'diff file1.txt file2.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'diff file1.txt file2.txt'), hint: '输入 diff file1.txt file2.txt' }
    ],
    lesson: `# diff - 比较文件\n\n## 基本用法\n\n\`\`\`bash\ndiff 文件1 文件2\n\`\`\`\n\n## 输出符号\n\n| 符号 | 含义 |\n|------|------|\n| < | 只在文件1中 |\n| > | 只在文件2中 |\n| --- | 分隔符 |\n\n## 常用选项\n\n\`\`\`bash\ndiff -y file1 file2  # 并排显示\ndiff -u file1 file2  # unified 格式\n\`\`\``,
    hints: ['diff 退出码：0=相同，1=不同，2=错误', '-y 选项可以并排显示差异', '-u 是 unified 格式，更易读'],
    order: 22
  },
  {
    id: 23,
    title: '文本处理 - awk',
    category: 'text',
    description: '学习使用 awk 处理结构化文本',
    missionBriefing: 'awk 是最强大的文本处理工具之一，特别适合处理表格数据。它可以按列提取、计算、格式化输出。',
    whatYouLearn: ['awk 的基本语法', '按列提取 ($1, $2...)', 'awk 的模式匹配'],
    steps: [
      { instruction: '输入 echo "John 25 NYC" > people.txt 创建文件', command: 'echo "John 25 NYC" > people.txt', explanation: '创建测试数据' },
      { instruction: '输入 echo "Jane 30 LA" >> people.txt 追加', command: 'echo "Jane 30 LA" >> people.txt', explanation: '追加更多数据' },
      { instruction: '输入 awk "{print $1}" people.txt 提取第一列', command: 'awk "{print $1}" people.txt', explanation: '$1 表示第一列' },
      { instruction: '输入 awk "{print $1, $3}" people.txt 提取多列', command: 'awk "{print $1, $3}" people.txt', explanation: '提取第1和第3列' }
    ],
    tasks: [
      { id: '23-1', instruction: '创建文件：echo "John 25 NYC" > people.txt', command: 'echo "John 25 NYC" > people.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'echo "John 25 NYC" > people.txt'), hint: '输入 echo "John 25 NYC" > people.txt' },
      { id: '23-2', instruction: '追加数据：echo "Jane 30 LA" >> people.txt', command: 'echo "Jane 30 LA" >> people.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'echo "Jane 30 LA" >> people.txt'), hint: '输入 echo "Jane 30 LA" >> people.txt' },
      { id: '23-3', instruction: '提取第一列：awk "{print $1}" people.txt', command: 'awk "{print $1}" people.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'awk "{print $1}" people.txt'), hint: '输入 awk "{print $1}" people.txt' },
      { id: '23-4', instruction: '提取多列：awk "{print $1, $3}" people.txt', command: 'awk "{print $1, $3}" people.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'awk "{print $1, $3}" people.txt'), hint: '输入 awk "{print $1, $3}" people.txt' }
    ],
    lesson: `# awk - 文本处理\n\n## 基本语法\n\n\`\`\`bash\nawk "{print \$列号}" 文件\n\`\`\`\n\n## 列引用\n\n| 变量 | 含义 |\n|------|------|\n| \$0 | 整行 |\n| \$1 | 第1列 |\n| \$2 | 第2列 |\n| \$NF | 最后一列 |\n\n## 示例\n\n\`\`\`bash\n$ awk "{print \$1, \$3}" data.txt\n$ awk -F: "{print \$1}" /etc/passwd\n\`\`\``,
    hints: ['$1, $2... 表示第几列', '-F 指定分隔符', 'awk 默认按空格分隔'],
    order: 23
  },
  {
    id: 24,
    title: '文本篇总结',
    category: 'text',
    description: '综合运用文本处理命令',
    missionBriefing: '恭喜你完成文本篇的学习！这一关是综合测试，检验你对 grep、sort、wc、cut、sed、awk、diff 的掌握。',
    whatYouLearn: ['综合运用文本处理命令', '管道组合多个命令', '实际场景应用'],
    steps: [
      { instruction: '输入 echo -e "apple 3\\nbanana 2\\napple 5\\ncherry 1" > inventory.txt 创建数据', command: 'echo -e "apple 3\\nbanana 2\\napple 5\\ncherry 1" > inventory.txt', explanation: '创建库存数据' },
      { instruction: '输入 sort inventory.txt 排序', command: 'sort inventory.txt', explanation: '按字母排序' },
      { instruction: '输入 wc -l inventory.txt 统计行数', command: 'wc -l inventory.txt', explanation: '统计总行数' },
      { instruction: '输入 awk "{sum+=$2} END{print sum}" inventory.txt 求和', command: 'awk "{sum+=$2} END{print sum}" inventory.txt', explanation: '计算第二列的总和' }
    ],
    tasks: [
      { id: '24-1', instruction: '创建数据：echo -e "apple 3\\nbanana 2\\napple 5\\ncherry 1" > inventory.txt', command: 'echo -e "apple 3\\nbanana 2\\napple 5\\ncherry 1" > inventory.txt', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo') && hasCommandContaining(state.commandHistory, 'inventory.txt'), hint: '输入 echo -e "apple 3\\nbanana 2\\napple 5\\ncherry 1" > inventory.txt' },
      { id: '24-2', instruction: '排序：sort inventory.txt', command: 'sort inventory.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'sort inventory.txt'), hint: '输入 sort inventory.txt' },
      { id: '24-3', instruction: '统计行数：wc -l inventory.txt', command: 'wc -l inventory.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'wc -l inventory.txt'), hint: '输入 wc -l inventory.txt' },
      { id: '24-4', instruction: '求和：awk "{sum+=$2} END{print sum}" inventory.txt', command: 'awk "{sum+=$2} END{print sum}" inventory.txt', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'awk "{sum+=$2} END{print sum}" inventory.txt'), hint: '输入 awk "{sum+=$2} END{print sum}" inventory.txt' }
    ],
    lesson: `# 文本篇总结\n\n恭喜你完成了文本处理篇！\n\n## 命令回顾\n\n| 命令 | 用途 |\n|------|------|\n| grep | 搜索文本 |\n| sort | 排序 |\n| uniq | 去重 |\n| wc | 统计 |\n| cut | 截取列 |\n| sed | 替换 |\n| awk | 处理表格 |\n| diff | 比较文件 |\n\n## 管道组合\n\n\`\`\`bash\n命令1 | 命令2 | 命令3\n\`\`\`\n\n这是 Linux 的强大之处！`,
    hints: ['管道 | 把前一个命令的输出作为下一个的输入', '组合使用这些命令可以完成复杂任务', '多练习，熟能生巧'],
    order: 24
  },

  // ===== 脚本篇 =====
  {
    id: 25,
    title: '变量基础 - 变量',
    category: 'script',
    description: '学习 Shell 脚本中的变量',
    missionBriefing: 'Shell 脚本是自动化的基础。变量是脚本的核心，它可以存储数据，让你的脚本更灵活、更强大。',
    whatYouLearn: ['如何定义变量', '如何使用变量', '环境变量和局部变量'],
    steps: [
      { instruction: '输入 echo \'#!/bin/bash\' > script.sh 创建脚本', command: 'echo \'#!/bin/bash\' > script.sh', explanation: '#!/bin/bash 是脚本的开头' },
      { instruction: '输入 echo \'NAME="Linux"\' >> script.sh 定义变量', command: 'echo \'NAME="Linux"\' >> script.sh', explanation: '定义一个变量 NAME' },
      { instruction: '输入 echo \'echo "Hello $NAME"\' >> script.sh 使用变量', command: 'echo \'echo "Hello $NAME"\' >> script.sh', explanation: '用 $ 符号使用变量' },
      { instruction: '输入 chmod +x script.sh 添加执行权限', command: 'chmod +x script.sh', explanation: '让脚本可以执行' },
      { instruction: '输入 ./script.sh 运行脚本', command: './script.sh', explanation: '运行脚本查看结果' }
    ],
    tasks: [
      { id: '25-1', instruction: '创建脚本：echo \'#!/bin/bash\' > script.sh', command: 'echo \'#!/bin/bash\' > script.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo') && hasCommandContaining(state.commandHistory, 'script.sh'), hint: '输入 echo \'#!/bin/bash\' > script.sh' },
      { id: '25-2', instruction: '定义变量：echo \'NAME="Linux"\' >> script.sh', command: 'echo \'NAME="Linux"\' >> script.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'NAME="Linux"'), hint: '输入 echo \'NAME="Linux"\' >> script.sh' },
      { id: '25-3', instruction: '使用变量：echo \'echo "Hello $NAME"\' >> script.sh', command: 'echo \'echo "Hello $NAME"\' >> script.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'Hello $NAME'), hint: '输入 echo \'echo "Hello $NAME"\' >> script.sh' },
      { id: '25-4', instruction: '添加执行权限：chmod +x script.sh', command: 'chmod +x script.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'chmod') && hasCommandContaining(state.commandHistory, 'script.sh'), hint: '输入 chmod +x script.sh' },
      { id: '25-5', instruction: '运行脚本：./script.sh', command: './script.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, './script.sh'), hint: '输入 ./script.sh' }
    ],
    lesson: `# Shell 变量\n\n## 定义变量\n\n\`\`\`bash\nNAME="value"  # 等号两边不能有空格！\n\`\`\`\n\n## 使用变量\n\n\`\`\`bash\necho \$NAME\necho \${NAME}\n\`\`\`\n\n## 常用环境变量\n\n| 变量 | 含义 |\n|------|------|\n| \$HOME | 主目录 |\n| \$USER | 当前用户 |\n| \$PWD | 当前目录 |\n| \$PATH | 命令搜索路径 |`,
    hints: ['变量名不能以数字开头', '等号两边不能有空格', '用 $ 符号引用变量'],
    order: 25
  },
  {
    id: 26,
    title: '条件判断 - if',
    category: 'script',
    description: '学习 Shell 脚本中的条件判断',
    missionBriefing: '条件判断让脚本能够根据不同情况执行不同的代码。if 语句是编程中最基本的控制结构。',
    whatYouLearn: ['if 语句的语法', '比较运算符 (-eq, -gt, -lt)', '字符串比较 (=, !=)'],
    steps: [
      { instruction: '输入 echo \'#!/bin/bash\' > check.sh 创建脚本', command: 'echo \'#!/bin/bash\' > check.sh', explanation: '创建新脚本' },
      { instruction: '输入 echo \'NUM=10\' >> check.sh 定义变量', command: 'echo \'NUM=10\' >> check.sh', explanation: '定义数字变量' },
      { instruction: '输入 echo \'if [ $NUM -gt 5 ]; then echo "大于5"; fi\' >> check.sh', command: 'echo \'if [ $NUM -gt 5 ]; then echo "大于5"; fi\' >> check.sh', explanation: 'if 条件判断' },
      { instruction: '输入 chmod +x check.sh 添加执行权限', command: 'chmod +x check.sh', explanation: '添加执行权限' },
      { instruction: '输入 ./check.sh 运行脚本', command: './check.sh', explanation: '执行脚本' }
    ],
    tasks: [
      { id: '26-1', instruction: '创建脚本：echo \'#!/bin/bash\' > check.sh', command: 'echo \'#!/bin/bash\' > check.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo') && hasCommandContaining(state.commandHistory, 'check.sh'), hint: '输入 echo \'#!/bin/bash\' > check.sh' },
      { id: '26-2', instruction: '定义变量：echo \'NUM=10\' >> check.sh', command: 'echo \'NUM=10\' >> check.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'NUM=10'), hint: '输入 echo \'NUM=10\' >> check.sh' },
      { id: '26-3', instruction: 'if条件判断：echo \'if [ $NUM -gt 5 ]; then echo "大于5"; fi\' >> check.sh', command: 'echo \'if [ $NUM -gt 5 ]; then echo "大于5"; fi\' >> check.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, '-gt 5'), hint: '输入 echo \'if [ $NUM -gt 5 ]; then echo "大于5"; fi\' >> check.sh' },
      { id: '26-4', instruction: '添加执行权限：chmod +x check.sh', command: 'chmod +x check.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'chmod') && hasCommandContaining(state.commandHistory, 'check.sh'), hint: '输入 chmod +x check.sh' },
      { id: '26-5', instruction: '运行脚本：./check.sh', command: './check.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, './check.sh'), hint: '输入 ./check.sh' }
    ],
    lesson: `# if 条件判断\n\n## 语法\n\n\`\`\`bash\nif [ 条件 ]; then\n    命令\nelif [ 条件 ]; then\n    命令\nelse\n    命令\nfi\n\`\`\`\n\n## 数字比较\n\n| 运算符 | 含义 |\n|--------|------|\n| -eq | 等于 |\n| -ne | 不等于 |\n| -gt | 大于 |\n| -lt | 小于 |\n| -ge | 大于等于 |\n| -le | 小于等于 |\n\n## 字符串比较\n\n\`\`\`bash\nif [ "$str" = "hello" ]; then\n\`\`\``,
    hints: ['[ ] 两边必须有空格', '变量用双引号包围更安全', '-gt 是 greater than 的缩写'],
    order: 26
  },
  {
    id: 27,
    title: '循环 - for',
    category: 'script',
    description: '学习 Shell 脚本中的循环',
    missionBriefing: '循环让你可以重复执行命令，处理多个文件或数据。for 循环是最常用的循环结构。',
    whatYouLearn: ['for 循环的语法', '遍历列表', 'C 风格的 for 循环'],
    steps: [
      { instruction: '输入 echo \'#!/bin/bash\' > loop.sh 创建脚本', command: 'echo \'#!/bin/bash\' > loop.sh', explanation: '创建新脚本' },
      { instruction: '输入 echo \'for i in 1 2 3; do echo "Number: $i"; done\' >> loop.sh', command: 'echo \'for i in 1 2 3; do echo "Number: $i"; done\' >> loop.sh', explanation: 'for 循环遍历列表' },
      { instruction: '输入 chmod +x loop.sh 添加执行权限', command: 'chmod +x loop.sh', explanation: '添加执行权限' },
      { instruction: '输入 ./loop.sh 运行脚本', command: './loop.sh', explanation: '执行脚本' }
    ],
    tasks: [
      { id: '27-1', instruction: '创建脚本：echo \'#!/bin/bash\' > loop.sh', command: 'echo \'#!/bin/bash\' > loop.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo') && hasCommandContaining(state.commandHistory, 'loop.sh'), hint: '输入 echo \'#!/bin/bash\' > loop.sh' },
      { id: '27-2', instruction: 'for循环遍历列表：echo \'for i in 1 2 3; do echo "Number: $i"; done\' >> loop.sh', command: 'echo \'for i in 1 2 3; do echo "Number: $i"; done\' >> loop.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'for i in 1 2 3'), hint: '输入 echo \'for i in 1 2 3; do echo "Number: $i"; done\' >> loop.sh' },
      { id: '27-3', instruction: '添加执行权限：chmod +x loop.sh', command: 'chmod +x loop.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'chmod') && hasCommandContaining(state.commandHistory, 'loop.sh'), hint: '输入 chmod +x loop.sh' },
      { id: '27-4', instruction: '运行脚本：./loop.sh', command: './loop.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, './loop.sh'), hint: '输入 ./loop.sh' }
    ],
    lesson: `# for 循环\n\n## 列表遍历\n\n\`\`\`bash\nfor i in 1 2 3 4 5\ndo\n    echo $i\ndone\n\`\`\`\n\n## 文件遍历\n\n\`\`\`bash\nfor file in *.txt\ndo\n    echo $file\ndone\n\`\`\`\n\n## C 风格\n\n\`\`\`bash\nfor ((i=0; i<5; i++))\ndo\n    echo $i\ndone\n\`\`\``,
    hints: ['for i in ... 可以遍历任何列表', '*.txt 会匹配所有txt文件', 'do 和 done 是循环体的开始和结束'],
    order: 27
  },
  {
    id: 28,
    title: '循环 - while',
    category: 'script',
    description: '学习 while 循环',
    missionBriefing: 'while 循环在条件为真时重复执行，适合处理不确定次数的循环，比如读取文件每一行。',
    whatYouLearn: ['while 循环的语法', 'until 循环', 'break 和 continue'],
    steps: [
      { instruction: '输入 echo \'#!/bin/bash\' > while.sh 创建脚本', command: 'echo \'#!/bin/bash\' > while.sh', explanation: '创建新脚本' },
      { instruction: '输入 echo \'COUNT=1\' >> while.sh', command: 'echo \'COUNT=1\' >> while.sh', explanation: '定义计数器' },
      { instruction: '输入 echo \'while [ $COUNT -le 3 ]; do echo "Count: $COUNT"; COUNT=$((COUNT+1)); done\' >> while.sh', command: 'echo \'while [ $COUNT -le 3 ]; do echo "Count: $COUNT"; COUNT=$((COUNT+1)); done\' >> while.sh', explanation: 'while 循环' },
      { instruction: '输入 chmod +x while.sh 添加执行权限', command: 'chmod +x while.sh', explanation: '添加执行权限' },
      { instruction: '输入 ./while.sh 运行脚本', command: './while.sh', explanation: '执行脚本' }
    ],
    tasks: [
      { id: '28-1', instruction: '创建脚本：echo \'#!/bin/bash\' > while.sh', command: 'echo \'#!/bin/bash\' > while.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo') && hasCommandContaining(state.commandHistory, 'while.sh'), hint: '输入 echo \'#!/bin/bash\' > while.sh' },
      { id: '28-2', instruction: '定义计数器：echo \'COUNT=1\' >> while.sh', command: 'echo \'COUNT=1\' >> while.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'COUNT=1'), hint: '输入 echo \'COUNT=1\' >> while.sh' },
      { id: '28-3', instruction: 'while循环：echo \'while [ $COUNT -le 3 ]; do echo "Count: $COUNT"; COUNT=$((COUNT+1)); done\' >> while.sh', command: 'echo \'while [ $COUNT -le 3 ]; do echo "Count: $COUNT"; COUNT=$((COUNT+1)); done\' >> while.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'while [ $COUNT -le 3 ]'), hint: '输入 echo \'while [ $COUNT -le 3 ]; do echo "Count: $COUNT"; COUNT=$((COUNT+1)); done\' >> while.sh' },
      { id: '28-4', instruction: '添加执行权限：chmod +x while.sh', command: 'chmod +x while.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'chmod') && hasCommandContaining(state.commandHistory, 'while.sh'), hint: '输入 chmod +x while.sh' },
      { id: '28-5', instruction: '运行脚本：./while.sh', command: './while.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, './while.sh'), hint: '输入 ./while.sh' }
    ],
    lesson: `# while 循环\n\n## 语法\n\n\`\`\`bash\nwhile [ 条件 ]\ndo\n    命令\ndone\n\`\`\`\n\n## until 循环\n\n\`\`\`bash\nuntil [ 条件 ]  # 条件为假时循环\ndo\n    命令\ndone\n\`\`\`\n\n## break 和 continue\n\n\`\`\`bash\nbreak    # 跳出循环\ncontinue # 跳过本次迭代\n\`\`\``,
    hints: ['while 条件为真时循环', 'until 条件为假时循环（相反）', '小心无限循环！'],
    order: 28
  },
  {
    id: 29,
    title: '函数',
    category: 'script',
    description: '学习 Shell 脚本中的函数',
    missionBriefing: '函数让你把代码组织成可重用的模块。定义一次，多次调用，让脚本更清晰、更易维护。',
    whatYouLearn: ['如何定义函数', '函数参数', '函数返回值'],
    steps: [
      { instruction: '输入 echo \'#!/bin/bash\' > func.sh 创建脚本', command: 'echo \'#!/bin/bash\' > func.sh', explanation: '创建新脚本' },
      { instruction: '输入 echo \'greet() { echo "Hello $1!"; }\' >> func.sh 定义函数', command: 'echo \'greet() { echo "Hello $1!"; }\' >> func.sh', explanation: '定义一个问候函数' },
      { instruction: '输入 echo \'greet "World"\' >> func.sh 调用函数', command: 'echo \'greet "World"\' >> func.sh', explanation: '调用函数并传参' },
      { instruction: '输入 chmod +x func.sh 添加执行权限', command: 'chmod +x func.sh', explanation: '添加执行权限' },
      { instruction: '输入 ./func.sh 运行脚本', command: './func.sh', explanation: '执行脚本' }
    ],
    tasks: [
      { id: '29-1', instruction: '创建脚本：echo \'#!/bin/bash\' > func.sh', command: 'echo \'#!/bin/bash\' > func.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo') && hasCommandContaining(state.commandHistory, 'func.sh'), hint: '输入 echo \'#!/bin/bash\' > func.sh' },
      { id: '29-2', instruction: '定义函数：echo \'greet() { echo "Hello $1!"; }\' >> func.sh', command: 'echo \'greet() { echo "Hello $1!"; }\' >> func.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'greet()'), hint: '输入 echo \'greet() { echo "Hello $1!"; }\' >> func.sh' },
      { id: '29-3', instruction: '调用函数：echo \'greet "World"\' >> func.sh', command: 'echo \'greet "World"\' >> func.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'greet "World"'), hint: '输入 echo \'greet "World"\' >> func.sh' },
      { id: '29-4', instruction: '添加执行权限：chmod +x func.sh', command: 'chmod +x func.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'chmod') && hasCommandContaining(state.commandHistory, 'func.sh'), hint: '输入 chmod +x func.sh' },
      { id: '29-5', instruction: '运行脚本：./func.sh', command: './func.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, './func.sh'), hint: '输入 ./func.sh' }
    ],
    lesson: `# Shell 函数\n\n## 定义函数\n\n\`\`\`bash\nfunction_name() {\n    命令\n    return 返回值\n}\n\`\`\`\n\n## 函数参数\n\n\`\`\`bash\ngreet() {\n    echo "Hello \$1"  # \$1 是第一个参数\n    echo "Total args: \$#"\n}\ngreet "World"\n\`\`\`\n\n## 返回值\n\n\`\`\`bash\nadd() {\n    return \$(( \$1 + \$2 ))\n}\nadd 3 5\nresult=\$?  # \$? 获取返回值\n\`\`\``,
    hints: ['$1, $2... 是函数参数', '$# 是参数个数', '$? 是上一个命令的返回值'],
    order: 29
  },
  {
    id: 30,
    title: '脚本篇总结',
    category: 'script',
    description: '综合运用脚本知识',
    missionBriefing: '恭喜你完成脚本篇的学习！这一关是综合测试，检验你对变量、条件、循环、函数的掌握。',
    whatYouLearn: ['综合运用脚本知识', '实际脚本编写', '调试技巧'],
    steps: [
      { instruction: '输入 echo \'#!/bin/bash\' > final.sh 创建脚本', command: 'echo \'#!/bin/bash\' > final.sh', explanation: '创建最终脚本' },
      { instruction: '输入 echo \'echo "脚本测试成功！"\' >> final.sh', command: 'echo \'echo "脚本测试成功！"\' >> final.sh', explanation: '添加输出' },
      { instruction: '输入 chmod +x final.sh 添加执行权限', command: 'chmod +x final.sh', explanation: '添加执行权限' },
      { instruction: '输入 ./final.sh 运行脚本', command: './final.sh', explanation: '执行脚本' }
    ],
    tasks: [
      { id: '30-1', instruction: '创建脚本：echo \'#!/bin/bash\' > final.sh', command: 'echo \'#!/bin/bash\' > final.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo') && hasCommandContaining(state.commandHistory, 'final.sh'), hint: '输入 echo \'#!/bin/bash\' > final.sh' },
      { id: '30-2', instruction: '添加输出：echo \'echo "脚本测试成功！"\' >> final.sh', command: 'echo \'echo "脚本测试成功！"\' >> final.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, '脚本测试成功！'), hint: '输入 echo \'echo "脚本测试成功！"\' >> final.sh' },
      { id: '30-3', instruction: '添加执行权限：chmod +x final.sh', command: 'chmod +x final.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'chmod') && hasCommandContaining(state.commandHistory, 'final.sh'), hint: '输入 chmod +x final.sh' },
      { id: '30-4', instruction: '运行脚本：./final.sh', command: './final.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, './final.sh'), hint: '输入 ./final.sh' }
    ],
    lesson: `# 脚本篇总结\n\n恭喜你完成了脚本篇！\n\n## 知识回顾\n\n| 主题 | 要点 |\n|------|------|\n| 变量 | NAME="value", \$NAME |\n| 条件 | if [ condition ]; then |\n| 循环 | for i in ...; while [ condition ] |\n| 函数 | name() { commands } |\n\n## 脚本调试\n\n\`\`\`bash\nbash -x script.sh  # 调试模式\nset -e             # 出错即停\n\`\`\`\n\n## 最佳实践\n\n1. 第一行加 #!/bin/bash\n2. 变量用双引号\n3. 加注释\n4. 错误处理`,
    hints: ['#!/bin/bash 告诉系统用bash执行', 'bash -x 可以看到每一步执行', '多写多练，脚本是自动化的基础'],
    order: 30
  },

  // ===== 进程篇 =====
  {
    id: 31,
    title: '查看进程 - ps',
    category: 'process',
    description: '学习使用 ps 查看进程',
    missionBriefing: '进程是正在运行的程序。ps 命令可以查看系统中运行的进程，了解系统状态和排查问题。',
    whatYouLearn: ['ps 的基本用法', 'ps aux 的含义', '查看特定进程'],
    steps: [
      { instruction: '输入 ps 查看当前进程', command: 'ps', explanation: '显示当前终端的进程' },
      { instruction: '输入 ps aux 查看所有进程', command: 'ps aux', explanation: 'a=所有用户, u=详细信息, x=包括无终端的' },
      { instruction: '输入 ps aux | grep bash 过滤', command: 'ps aux | grep bash', explanation: '只看 bash 相关进程' }
    ],
    tasks: [
      { id: '31-1', instruction: '查看当前进程：ps', command: 'ps', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ps'), hint: '输入 ps' },
      { id: '31-2', instruction: '查看所有进程：ps aux', command: 'ps aux', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ps aux'), hint: '输入 ps aux' },
      { id: '31-3', instruction: '过滤进程：ps aux | grep bash', command: 'ps aux | grep bash', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ps aux | grep bash'), hint: '输入 ps aux | grep bash' }
    ],
    lesson: `# ps - 查看进程\n\n## 常用选项\n\n\`\`\`bash\nps          # 当前终端进程\nps aux      # 所有进程详细信息\nps -ef      # 所有进程（另一种格式）\n\`\`\`\n\n## 输出字段\n\n| 字段 | 含义 |\n|------|------|\n| PID | 进程ID |\n| USER | 所有者 |\n| %CPU | CPU使用率 |\n| %MEM | 内存使用率 |\n| COMMAND | 命令 |\n\n## 过滤\n\n\`\`\`bash\nps aux | grep nginx\n\`\`\``,
    hints: ['ps aux 是最常用的组合', 'PID 是进程的唯一标识', '用 grep 过滤特定进程'],
    order: 31
  },
  {
    id: 32,
    title: '实时监控 - top',
    category: 'process',
    description: '学习使用 top 监控系统',
    missionBriefing: 'top 命令提供实时的系统监控，包括CPU、内存使用情况和进程排名。它是系统管理员的必备工具。',
    whatYouLearn: ['top 的基本用法', '理解 top 的输出', 'top 中的快捷键'],
    steps: [
      { instruction: '输入 top 查看系统状态', command: 'top', explanation: '启动实时监控（按 q 退出）' }
    ],
    tasks: [
      { id: '32-1', instruction: '启动 top 监控：top', command: 'top', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'top'), hint: '输入 top 启动监控' }
    ],
    lesson: `# top - 实时监控\n\n## 基本用法\n\n\`\`\`bash\ntop\n\`\`\`\n\n## 输出信息\n\n- 第1行：系统运行时间和负载\n- 第2行：任务统计\n- 第3行：CPU 使用率\n- 第4行：内存使用\n- 第5行以后：进程列表\n\n## 常用快捷键\n\n| 快捷键 | 功能 |\n|--------|------|\n| q | 退出 |\n| M | 按内存排序 |\n| P | 按CPU排序 |\n| k | 杀死进程 |\n| 1 | 显示每个CPU |`,
    hints: ['按 q 退出 top', '按 P 按CPU排序，M 按内存排序', 'top 会持续刷新，适合实时监控'],
    order: 32
  },
  {
    id: 33,
    title: '终止进程 - kill',
    category: 'process',
    description: '学习使用 kill 终止进程',
    missionBriefing: '当程序卡死或占用太多资源时，你需要强制终止它。kill 命令可以向进程发送信号。',
    whatYouLearn: ['kill 的基本用法', '信号类型 (SIGTERM, SIGKILL)', 'killall 和 pkill'],
    steps: [
      { instruction: '输入 sleep 100 & 后台运行一个进程', command: 'sleep 100 &', explanation: '& 让命令在后台运行' },
      { instruction: '输入 jobs 查看后台任务', command: 'jobs', explanation: '查看后台运行的任务' },
      { instruction: '输入 kill %1 终止任务', command: 'kill %1', explanation: '终止第一个后台任务' }
    ],
    tasks: [
      { id: '33-1', instruction: '后台运行：sleep 100 &', command: 'sleep 100 &', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'sleep 100 &'), hint: '输入 sleep 100 &' },
      { id: '33-2', instruction: '查看后台任务：jobs', command: 'jobs', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'jobs'), hint: '输入 jobs' },
      { id: '33-3', instruction: '终止任务：kill %1', command: 'kill %1', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'kill %1'), hint: '输入 kill %1' }
    ],
    lesson: `# kill - 终止进程\n\n## 基本用法\n\n\`\`\`bash\nkill PID        # 发送信号\nkill -9 PID     # 强制终止\nkill %job号     # 终止后台任务\n\`\`\`\n\n## 常用信号\n\n| 信号 | 数字 | 含义 |\n|------|------|------|\n| SIGTERM | 15 | 正常终止（默认）|\n| SIGKILL | 9 | 强制终止 |\n| SIGHUP | 1 | 重新加载 |\n\n## 其他命令\n\n\`\`\`bash\nkillall nginx   # 按名称杀\npkill nginx     # 按模式杀\n\`\`\``,
    hints: ['先用 ps 找到进程PID', 'kill -9 是最后手段', 'killall 按进程名杀'],
    order: 33
  },
  {
    id: 34,
    title: '后台运行 - bg fg',
    category: 'process',
    description: '学习管理后台任务',
    missionBriefing: '有些命令需要很长时间运行，你可以把它们放到后台，继续做其他事情。bg 和 fg 命令管理前后台任务。',
    whatYouLearn: ['& 后台运行', 'bg 和 fg 命令', 'jobs 查看任务'],
    steps: [
      { instruction: '输入 sleep 50 & 后台运行', command: 'sleep 50 &', explanation: '& 让命令在后台运行' },
      { instruction: '输入 jobs 查看任务', command: 'jobs', explanation: '查看后台任务列表' },
      { instruction: '输入 fg 调到前台', command: 'fg', explanation: '把后台任务调到前台' }
    ],
    tasks: [
      { id: '34-1', instruction: '后台运行：sleep 50 &', command: 'sleep 50 &', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'sleep 50 &'), hint: '输入 sleep 50 &' },
      { id: '34-2', instruction: '查看任务：jobs', command: 'jobs', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'jobs'), hint: '输入 jobs' },
      { id: '34-3', instruction: '调到前台：fg', command: 'fg', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'fg'), hint: '输入 fg' }
    ],
    lesson: `# bg 和 fg - 后台任务\n\n## 后台运行\n\n\`\`\`bash\ncommand &     # 直接后台运行\nCtrl+Z       # 暂停当前命令\nbg           # 在后台继续运行\n\`\`\`\n\n## 任务管理\n\n\`\`\`bash\njobs         # 查看后台任务\nfg %n        # 调第n个任务到前台\nkill %n      # 终止第n个任务\n\`\`\`\n\n## 示例\n\n\`\`\`bash\n$ sleep 100 &\n[1] 12345\n$ jobs\n[1]+  Running  sleep 100 &\n$ fg %1\n\`\`\``,
    hints: ['& 放在命令最后表示后台运行', 'Ctrl+Z 暂停，bg 继续', 'fg 调回前台'],
    order: 34
  },
  {
    id: 35,
    title: '优先级 - nice',
    category: 'process',
    description: '学习使用 nice 调整进程优先级',
    missionBriefing: 'nice 命令可以调整进程的优先级，让重要的任务获得更多CPU资源，或让后台任务不影响前台。',
    whatYouLearn: ['nice 的含义 (-20 到 19)', 'renice 修改已运行进程', '优先级的实际应用'],
    steps: [
      { instruction: '输入 nice -n 10 sleep 30 & 低优先级运行', command: 'nice -n 10 sleep 30 &', explanation: 'nice值越高，优先级越低' },
      { instruction: '输入 ps -o pid,ni,cmd | grep sleep 查看优先级', command: 'ps -o pid,ni,cmd | grep sleep', explanation: 'ni 列显示 nice 值' }
    ],
    tasks: [
      { id: '35-1', instruction: '低优先级运行：nice -n 10 sleep 30 &', command: 'nice -n 10 sleep 30 &', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'nice -n 10 sleep 30 &'), hint: '输入 nice -n 10 sleep 30 &' },
      { id: '35-2', instruction: '查看优先级：ps -o pid,ni,cmd | grep sleep', command: 'ps -o pid,ni,cmd | grep sleep', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ps -o pid,ni,cmd | grep sleep'), hint: '输入 ps -o pid,ni,cmd | grep sleep' }
    ],
    lesson: `# nice - 调整优先级\n\n## nice 值范围\n\n| 范围 | 含义 |\n|------|------|\n| -20 | 最高优先级 |\n| 0 | 默认 |\n| 19 | 最低优先级 |\n\n## 用法\n\n\`\`\`bash\nnice -n 值 命令       # 以指定优先级运行\nrenice 值 -p PID     # 修改已运行进程\n\`\`\`\n\n## 示例\n\n\`\`\`bash\nnice -n 19 tar czf backup.tar.gz /data  # 低优先级备份\nrenice 10 -p 1234                       # 修改进程优先级\n\`\`\``,
    hints: ['nice值越高，优先级越低', '只有root可以设置负值（更高优先级）', '适合后台备份等不紧急任务'],
    order: 35
  },
  {
    id: 36,
    title: '进程篇总结',
    category: 'process',
    description: '综合运用进程管理命令',
    missionBriefing: '恭喜你完成进程篇的学习！这一关是综合测试，检验你对 ps、top、kill、bg/fg、nice 的掌握。',
    whatYouLearn: ['综合运用进程管理', '实际场景应用', '系统监控技巧'],
    steps: [
      { instruction: '输入 ps aux | head -5 查看前5个进程', command: 'ps aux | head -5', explanation: '查看进程列表的前5行' },
      { instruction: '输入 ps aux | wc -l 统计进程数', command: 'ps aux | wc -l', explanation: '统计系统中有多少进程' }
    ],
    tasks: [
      { id: '36-1', instruction: '查看前5个进程：ps aux | head -5', command: 'ps aux | head -5', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ps aux | head -5'), hint: '输入 ps aux | head -5' },
      { id: '36-2', instruction: '统计进程数：ps aux | wc -l', command: 'ps aux | wc -l', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ps aux | wc -l'), hint: '输入 ps aux | wc -l' }
    ],
    lesson: `# 进程篇总结\n\n恭喜你完成了进程篇！\n\n## 命令回顾\n\n| 命令 | 用途 |\n|------|------|\n| ps | 查看进程 |\n| top | 实时监控 |\n| kill | 终止进程 |\n| bg/fg | 后台/前台 |\n| jobs | 查看任务 |\n| nice | 调整优先级 |\n\n## 排查问题步骤\n\n1. top 看整体负载\n2. ps aux 找具体进程\n3. kill 终止问题进程`,
    hints: ['ps aux 是最常用的进程查看命令', 'top 适合实时监控', 'kill -9 是最后手段'],
    order: 36
  },

  // ===== 网络篇 =====
  {
    id: 37,
    title: '网络测试 - ping',
    category: 'network',
    description: '学习使用 ping 测试网络连通性',
    missionBriefing: '网络是现代系统的基础。ping 命令是最基本的网络诊断工具，用来测试与远程主机的连通性。',
    whatYouLearn: ['ping 的基本用法', '理解 ping 的输出', 'Ctrl+C 停止'],
    steps: [
      { instruction: '输入 ping -c 3 localhost 测试本机', command: 'ping -c 3 localhost', explanation: '-c 3 只发送3个包' },
      { instruction: '输入 ping -c 3 8.8.8.8 测试外网', command: 'ping -c 3 8.8.8.8', explanation: '测试与Google DNS的连通性' }
    ],
    tasks: [
      { id: '37-1', instruction: '测试本机：ping -c 3 localhost', command: 'ping -c 3 localhost', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ping -c 3 localhost'), hint: '输入 ping -c 3 localhost' },
      { id: '37-2', instruction: '测试外网：ping -c 3 8.8.8.8', command: 'ping -c 3 8.8.8.8', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ping -c 3 8.8.8.8'), hint: '输入 ping -c 3 8.8.8.8' }
    ],
    lesson: `# ping - 网络测试\n\n## 基本用法\n\n\`\`\`bash\nping 主机名或IP\nping -c 次数 主机\n\`\`\`\n\n## 输出解读\n\n\`\`\`bash\nPING localhost (127.0.0.1): 56 bytes\n64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.123 ms\n\`\`\`\n\n| 字段 | 含义 |\n|------|------|\n| icmp_seq | 序列号 |\n| ttl | 生存时间 |\n| time | 响应时间 |`,
    hints: ['-c 限制发送次数，否则会一直运行', 'Ctrl+C 停止 ping', 'ping 通了说明网络正常'],
    order: 37
  },
  {
    id: 38,
    title: '下载文件 - curl wget',
    category: 'network',
    description: '学习使用 curl 和 wget 下载文件',
    missionBriefing: 'curl 和 wget 是两个最常用的下载工具。curl 更适合API交互，wget 更适合下载文件。',
    whatYouLearn: ['curl 的基本用法', 'wget 的基本用法', '保存文件 (-O)'],
    steps: [
      { instruction: '输入 curl https://example.com 查看网页', command: 'curl https://example.com', explanation: 'curl 默认输出到屏幕' },
      { instruction: '输入 wget https://example.com/index.html 下载', command: 'wget https://example.com/index.html', explanation: 'wget 默认保存为文件' }
    ],
    tasks: [
      { id: '38-1', instruction: '使用 curl：curl https://example.com', command: 'curl https://example.com', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'curl https://example.com'), hint: '输入 curl https://example.com' },
      { id: '38-2', instruction: '使用 wget：wget https://example.com/index.html', command: 'wget https://example.com/index.html', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'wget https://example.com/index.html'), hint: '输入 wget https://example.com/index.html' }
    ],
    lesson: `# curl 和 wget\n\n## curl\n\n\`\`\`bash\ncurl URL              # 输出到屏幕\ncurl -O URL           # 保存文件\ncurl -o name URL      # 保存为指定名称\n\`\`\`\n\n## wget\n\n\`\`\`bash\nwget URL              # 下载文件\nwget -c URL           # 断点续传\nwget -r URL           # 递归下载\n\`\`\`\n\n## 区别\n\n| 特性 | curl | wget |\n|------|------|------|\n| 输出 | 标准输出 | 文件 |\n| 递归 | 不支持 | 支持 |\n| API | 更好 | 一般 |`,
    hints: ['curl 适合查看内容和API调用', 'wget 适合下载文件', '-O 保存为原文件名'],
    order: 38
  },
  {
    id: 39,
    title: '网络信息 - ifconfig ip',
    category: 'network',
    description: '学习查看网络配置信息',
    missionBriefing: 'ifconfig 和 ip 命令可以查看网络接口的配置信息，包括IP地址、MAC地址等。',
    whatYouLearn: ['ifconfig 的基本用法', 'ip 命令（更现代）', '理解网络接口'],
    steps: [
      { instruction: '输入 ifconfig 查看网络接口', command: 'ifconfig', explanation: '显示所有网络接口信息' },
      { instruction: '输入 ip addr 查看IP地址', command: 'ip addr', explanation: 'ip 是更现代的命令' }
    ],
    tasks: [
      { id: '39-1', instruction: '查看网络接口：ifconfig', command: 'ifconfig', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ifconfig'), hint: '输入 ifconfig' },
      { id: '39-2', instruction: '查看IP地址：ip addr', command: 'ip addr', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ip addr'), hint: '输入 ip addr' }
    ],
    lesson: `# 网络配置\n\n## ifconfig\n\n\`\`\`bash\nifconfig          # 所有接口\nifconfig eth0     # 指定接口\n\`\`\`\n\n## ip 命令（推荐）\n\n\`\`\`bash\nip addr           # 查看IP\nip link           # 查看接口\nip route          # 查看路由\n\`\`\`\n\n## 常见接口\n\n| 接口 | 说明 |\n|------|------|\n| eth0 | 以太网 |\n| wlan0 | 无线网 |\n| lo | 本地回环 |\n| docker0 | Docker网桥 |`,
    hints: ['ip 命令比 ifconfig 更现代', 'lo 是本地回环 127.0.0.1', 'inet 后面是IP地址'],
    order: 39
  },
  {
    id: 40,
    title: '端口查看 - netstat ss',
    category: 'network',
    description: '学习查看网络连接和端口',
    missionBriefing: 'netstat 和 ss 命令可以查看系统的网络连接、监听端口，对于排查网络问题和安全审计很有用。',
    whatYouLearn: ['查看监听端口', '查看网络连接', '常用选项'],
    steps: [
      { instruction: '输入 netstat -tuln 查看监听端口', command: 'netstat -tuln', explanation: '-t TCP, -u UDP, -l 监听, -n 数字显示' },
      { instruction: '输入 ss -tuln 查看监听端口', command: 'ss -tuln', explanation: 'ss 是更现代的替代品' }
    ],
    tasks: [
      { id: '40-1', instruction: '查看监听端口：netstat -tuln', command: 'netstat -tuln', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'netstat -tuln'), hint: '输入 netstat -tuln' },
      { id: '40-2', instruction: '使用 ss：ss -tuln', command: 'ss -tuln', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ss -tuln'), hint: '输入 ss -tuln' }
    ],
    lesson: `# netstat 和 ss\n\n## netstat\n\n\`\`\`bash\nnetstat -tuln    # 监听的TCP/UDP端口\nnetstat -an      # 所有连接\nnetstat -p       # 显示进程\n\`\`\`\n\n## ss（推荐）\n\n\`\`\`bash\nss -tuln         # 监听端口\nss -tp           # 显示进程\n\`\`\`\n\n## 选项含义\n\n| 选项 | 含义 |\n|------|------|\n| -t | TCP |\n| -u | UDP |\n| -l | 监听 |\n| -n | 数字显示 |\n| -p | 显示进程 |`,
    hints: ['ss 比 netstat 更快更现代', '-l 表示 listening（监听）', '80端口是HTTP，443是HTTPS'],
    order: 40
  },
  {
    id: 41,
    title: '远程连接 - ssh',
    category: 'network',
    description: '学习使用 ssh 远程登录',
    missionBriefing: 'SSH (Secure Shell) 是远程管理Linux服务器的标准方式。它加密所有通信，安全可靠。',
    whatYouLearn: ['ssh 的基本用法', 'SSH密钥认证', '常用选项'],
    steps: [
      { instruction: '输入 ssh localhost 测试本机连接', command: 'ssh localhost', explanation: '尝试SSH连接本机' }
    ],
    tasks: [
      { id: '41-1', instruction: '测试SSH：ssh localhost', command: 'ssh localhost', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ssh localhost'), hint: '输入 ssh localhost' }
    ],
    lesson: `# SSH - 远程连接\n\n## 基本用法\n\n\`\`\`bash\nssh user@host\nssh -p 端口 user@host\n\`\`\`\n\n## 密钥认证\n\n\`\`\`bash\nssh-keygen -t rsa     # 生成密钥\nssh-copy-id user@host # 复制公钥\n\`\`\`\n\n## 常用选项\n\n| 选项 | 含义 |\n|------|------|\n| -p | 指定端口 |\n| -i | 指定密钥 |\n| -L | 本地端口转发 |\n| -N | 不执行命令 |`,
    hints: ['默认端口是22', '密钥比密码更安全', 'ssh-copy-id 复制公钥到服务器'],
    order: 41
  },
  {
    id: 42,
    title: '网络篇总结',
    category: 'network',
    description: '综合运用网络命令',
    missionBriefing: '恭喜你完成网络篇的学习！这一关是综合测试，检验你对 ping、curl、wget、ifconfig、netstat、ssh 的掌握。',
    whatYouLearn: ['综合运用网络命令', '网络诊断流程', '实际场景应用'],
    steps: [
      { instruction: '输入 ping -c 2 localhost 测试本机', command: 'ping -c 2 localhost', explanation: '测试网络连通性' },
      { instruction: '输入 netstat -tuln | head -5 查看端口', command: 'netstat -tuln | head -5', explanation: '查看前5个监听端口' }
    ],
    tasks: [
      { id: '42-1', instruction: '测试本机：ping -c 2 localhost', command: 'ping -c 2 localhost', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'ping -c 2 localhost'), hint: '输入 ping -c 2 localhost' },
      { id: '42-2', instruction: '查看端口：netstat -tuln | head -5', command: 'netstat -tuln | head -5', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'netstat -tuln | head -5'), hint: '输入 netstat -tuln | head -5' }
    ],
    lesson: `# 网络篇总结\n\n恭喜你完成了网络篇！\n\n## 命令回顾\n\n| 命令 | 用途 |\n|------|------|\n| ping | 测试连通性 |\n| curl | 下载/查看 |\n| wget | 下载文件 |\n| ifconfig/ip | 查看IP |\n| netstat/ss | 查看端口 |\n| ssh | 远程连接 |\n\n## 网络诊断步骤\n\n1. ping 测试连通性\n2. ifconfig 查看IP配置\n3. netstat 查看端口\n4. curl 测试服务`,
    hints: ['ping 是第一步诊断', 'ss 比 netstat 更现代', 'SSH是远程管理的标准'],
    order: 42
  },

  // ===== 系统篇 =====
  {
    id: 43,
    title: '磁盘空间 - df du',
    category: 'system',
    description: '学习查看磁盘使用情况',
    missionBriefing: '磁盘空间管理是系统运维的重要工作。df 查看磁盘总览，du 查看目录占用。',
    whatYouLearn: ['df 查看磁盘空间', 'du 查看目录大小', '常用选项'],
    steps: [
      { instruction: '输入 df -h 查看磁盘空间', command: 'df -h', explanation: '-h 人类可读格式' },
      { instruction: '输入 du -sh ~ 查看主目录大小', command: 'du -sh ~', explanation: '-s 汇总, -h 人类可读' }
    ],
    tasks: [
      { id: '43-1', instruction: '查看磁盘空间：df -h', command: 'df -h', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'df -h'), hint: '输入 df -h' },
      { id: '43-2', instruction: '查看目录大小：du -sh ~', command: 'du -sh ~', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'du -sh ~'), hint: '输入 du -sh ~' }
    ],
    lesson: `# df 和 du - 磁盘管理\n\n## df - 磁盘总览\n\n\`\`\`bash\ndf -h    # 人类可读格式\n\`\`\`\n\n## du - 目录大小\n\n\`\`\'bash\ndu -sh 目录    # 汇总大小\ndu -h 目录     # 详细\n\`\`\`\n\n## 输出字段\n\n| 字段 | 含义 |\n|------|------|\n| Size | 总大小 |\n| Used | 已使用 |\n| Avail | 可用 |\n| Use% | 使用率 |`,
    hints: ['-h 显示 KB/MB/GB 更易读', 'du -sh 只显示总计', 'df 看整体，du 看细节'],
    order: 43
  },
  {
    id: 44,
    title: '系统信息 - uname hostname',
    category: 'system',
    description: '学习查看系统信息',
    missionBriefing: '了解系统的基本信息（内核版本、主机名等）是系统管理的基础。',
    whatYouLearn: ['uname 查看内核信息', 'hostname 查看主机名', '常用选项'],
    steps: [
      { instruction: '输入 uname -a 查看所有系统信息', command: 'uname -a', explanation: '-a 显示所有信息' },
      { instruction: '输入 hostname 查看主机名', command: 'hostname', explanation: '显示当前主机名' }
    ],
    tasks: [
      { id: '44-1', instruction: '查看系统信息：uname -a', command: 'uname -a', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'uname -a'), hint: '输入 uname -a' },
      { id: '44-2', instruction: '查看主机名：hostname', command: 'hostname', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'hostname'), hint: '输入 hostname' }
    ],
    lesson: `# 系统信息\n\n## uname\n\n\`\`\`bash\nuname -a    # 所有信息\nuname -r    # 内核版本\nuname -m    # 架构\n\`\`\`\n\n## 其他命令\n\n\`\`\`bash\nhostname        # 主机名\ncat /etc/os-release  # 发行版信息\nuptime          # 运行时间\n\`\`\``,
    hints: ['uname -r 只看内核版本', 'cat /etc/os-release 看发行版', 'uptime 看运行了多久'],
    order: 44
  },
  {
    id: 45,
    title: '软件管理 - apt yum',
    category: 'system',
    description: '学习安装和管理软件包',
    missionBriefing: 'Linux 用包管理器安装软件。apt 是 Debian/Ubuntu 系列，yum 是 CentOS/RedHat 系列。',
    whatYouLearn: ['apt 基本用法', 'yum 基本用法', '安装、更新、删除软件'],
    steps: [
      { instruction: '输入 apt list --installed | head -5 查看已安装', command: 'apt list --installed | head -5', explanation: '查看前5个已安装的包' }
    ],
    tasks: [
      { id: '45-1', instruction: '查看已安装：apt list --installed | head -5', command: 'apt list --installed | head -5', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'apt list --installed | head -5'), hint: '输入 apt list --installed | head -5' }
    ],
    lesson: `# 包管理器\n\n## apt (Debian/Ubuntu)\n\n\`\`\`bash\napt update              # 更新列表\napt upgrade             # 升级所有\napt install 包名        # 安装\napt remove 包名         # 删除\napt search 关键词       # 搜索\n\`\`\`\n\n## yum (CentOS/RedHat)\n\n\`\`\'bash\nyum install 包名\nyum remove 包名\nyum update\n\`\`\``,
    hints: ['先 apt update 再 install', 'apt search 搜索软件', 'yum 是另一个系列的包管理器'],
    order: 45
  },
  {
    id: 46,
    title: '服务管理 - systemctl',
    category: 'system',
    description: '学习使用 systemctl 管理服务',
    missionBriefing: 'systemctl 是现代 Linux 管理服务（如 Nginx、MySQL）的标准工具。掌握它是系统管理员的必备技能。',
    whatYouLearn: ['启动停止服务', '查看服务状态', '设置开机启动'],
    steps: [
      { instruction: '输入 systemctl status 查看系统状态', command: 'systemctl status', explanation: '查看系统整体状态' },
      { instruction: '输入 systemctl list-units --type=service | head -5 查看服务', command: 'systemctl list-units --type=service | head -5', explanation: '查看前5个服务' }
    ],
    tasks: [
      { id: '46-1', instruction: '查看系统状态：systemctl status', command: 'systemctl status', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'systemctl status'), hint: '输入 systemctl status' },
      { id: '46-2', instruction: '查看服务列表：systemctl list-units --type=service | head -5', command: 'systemctl list-units --type=service | head -5', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'systemctl list-units --type=service | head -5'), hint: '输入 systemctl list-units --type=service | head -5' }
    ],
    lesson: `# systemctl - 服务管理\n\n## 常用命令\n\n\`\`\'bash\nsystemctl start 服务名    # 启动\nsystemctl stop 服务名     # 停止\nsystemctl restart 服务名  # 重启\nsystemctl status 服务名   # 查看状态\nsystemctl enable 服务名   # 开机启动\nsystemctl disable 服务名  # 禁止开机启动\n\`\`\`\n\n## 示例\n\n\`\`\`bash\nsystemctl start nginx\nsystemctl enable nginx\nsystemctl status nginx\n\`\`\``,
    hints: ['status 查看服务是否运行', 'enable 设置开机启动', 'restart 重启服务'],
    order: 46
  },
  {
    id: 47,
    title: '日志查看 - journalctl',
    category: 'system',
    description: '学习查看系统日志',
    missionBriefing: '日志是排查问题的关键。journalctl 可以查看 systemd 的日志，tail 可以实时看日志文件。',
    whatYouLearn: ['journalctl 查看日志', 'tail 实时查看', 'grep 过滤日志'],
    steps: [
      { instruction: '输入 journalctl -n 10 查看最近10条日志', command: 'journalctl -n 10', explanation: '-n 指定行数' },
      { instruction: '输入 tail -n 5 /var/log/syslog 查看系统日志', command: 'tail -n 5 /var/log/syslog', explanation: '查看系统日志文件的最后5行' }
    ],
    tasks: [
      { id: '47-1', instruction: '查看最近日志：journalctl -n 10', command: 'journalctl -n 10', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'journalctl -n 10'), hint: '输入 journalctl -n 10' },
      { id: '47-2', instruction: '查看系统日志：tail -n 5 /var/log/syslog', command: 'tail -n 5 /var/log/syslog', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'tail -n 5 /var/log/syslog'), hint: '输入 tail -n 5 /var/log/syslog' }
    ],
    lesson: `# 日志查看\n\n## journalctl\n\n\`\`\`bash\njournalctl              # 所有日志\njournalctl -n 20        # 最近20条\njournalctl -u nginx     # 指定服务\njournalctl -f           # 实时跟踪\n\`\`\`\n\n## 日志文件\n\n\`\`\'bash\ntail -f /var/log/syslog    # 实时查看\ntail -n 100 /var/log/syslog  # 最后100行\ngrep ERROR /var/log/syslog  # 搜索错误\n\`\`\``,
    hints: ['-f 实时跟踪日志', '-u 指定服务查看', 'grep 过滤关键信息'],
    order: 47
  },
  {
    id: 48,
    title: '系统篇总结',
    category: 'system',
    description: '综合运用系统管理命令',
    missionBriefing: '恭喜你完成系统篇的学习！这一关是综合测试，检验你对 df、uname、apt、systemctl、journalctl 的掌握。',
    whatYouLearn: ['综合运用系统命令', '系统管理流程', '实际运维场景'],
    steps: [
      { instruction: '输入 df -h | head -5 查看磁盘', command: 'df -h | head -5', explanation: '查看磁盘空间前5行' },
      { instruction: '输入 uname -r 查看内核版本', command: 'uname -r', explanation: '查看内核版本' }
    ],
    tasks: [
      { id: '48-1', instruction: '查看磁盘：df -h | head -5', command: 'df -h | head -5', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'df -h | head -5'), hint: '输入 df -h | head -5' },
      { id: '48-2', instruction: '查看内核：uname -r', command: 'uname -r', validator: (state: TerminalState) => hasCommand(state.commandHistory, 'uname -r'), hint: '输入 uname -r' }
    ],
    lesson: `# 系统篇总结\n\n恭喜你完成了系统篇！\n\n## 命令回顾\n\n| 命令 | 用途 |\n|------|------|\n| df/du | 磁盘空间 |\n| uname | 系统信息 |\n| apt/yum | 软件管理 |\n| systemctl | 服务管理 |\n| journalctl | 查看日志 |\n\n## 运维流程\n\n1. df 检查磁盘\n2. systemctl 检查服务\n3. journalctl 查日志排错`,
    hints: ['磁盘满是最常见问题', 'systemctl 是现代服务管理标准', '日志是排错的关键'],
    order: 48
  }
];

export const getLevelById = (id: number): Level | undefined => {
  return levels.find(level => level.id === id);
};

export const getLevelsByCategory = (category: string): Level[] => {
  return levels.filter(level => level.category === category);
};

export const getCategories = (): string[] => {
  return [...new Set(levels.map(level => level.category))];
};
