export const hints: { [levelId: number]: string[] } = {
  1: [
    'pwd 是 "print working directory" 的缩写',
    '只需要在终端中输入 pwd 即可',
    'pwd 命令不需要任何参数'
  ],
  2: [
    'ls 命令可以带选项，比如 -l, -a, -la',
    '-l 选项显示详细信息',
    '-a 选项显示隐藏文件（以.开头的文件）'
  ],
  3: [
    'cd 是 "change directory" 的缩写',
    '.. 表示上级目录',
    '~ 表示你的主目录'
  ],
  4: [
    'mkdir 是 "make directory" 的缩写',
    '直接输入 mkdir 加上目录名',
    '创建后用 ls 验证是否成功'
  ],
  5: [
    'touch 命令可以创建空文件',
    '如果文件已存在，touch 会更新其时间戳',
    '文件名应该包含扩展名，如 .txt'
  ],
  6: [
    'cat 是 "concatenate" 的缩写',
    '-n 选项可以显示行号',
    'cat 适合查看小文件'
  ],
  7: [
    'rm 是 "remove" 的缩写',
    '删除目录需要 -r 选项',
    '使用 -f 选项可以强制删除不提示'
  ],
  8: [
    'cp 用于复制，mv 用于移动或重命名',
    '复制目录需要 -r 选项',
    'mv 命令不会保留原文件'
  ],
  9: [
    'echo 用于输出文本到终端',
    '可以使用双引号或单引号包围文本',
    '$变量名 可以显示环境变量的值'
  ],
  10: [
    '按顺序执行每个命令',
    '如果不确定当前位置，使用 pwd',
    '使用 ls 查看目录内容'
  ]
};

export const getHintsForLevel = (levelId: number): string[] => {
  return hints[levelId] || [];
};
