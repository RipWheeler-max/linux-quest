const fs = require('fs');
let content = fs.readFileSync('src/data/levels.ts', 'utf8');

// Replacements
const replacements = [
  {
    find: /tasks: \[\s*\{\s*id: '25-1'.*?\}\s*\]/s,
    replace: `tasks: [
      { id: '25-1', instruction: '创建脚本：echo \\'#!/bin/bash\\' > script.sh', command: 'echo \\'#!/bin/bash\\' > script.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo') && hasCommandContaining(state.commandHistory, 'script.sh'), hint: '输入 echo \\'#!/bin/bash\\' > script.sh' },
      { id: '25-2', instruction: '定义变量：echo \\'NAME="Linux"\\' >> script.sh', command: 'echo \\'NAME="Linux"\\' >> script.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'NAME="Linux"'), hint: '输入 echo \\'NAME="Linux"\\' >> script.sh' },
      { id: '25-3', instruction: '使用变量：echo \\'echo "Hello $NAME"\\' >> script.sh', command: 'echo \\'echo "Hello $NAME"\\' >> script.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'Hello $NAME'), hint: '输入 echo \\'echo "Hello $NAME"\\' >> script.sh' },
      { id: '25-4', instruction: '添加执行权限：chmod +x script.sh', command: 'chmod +x script.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'chmod') && hasCommandContaining(state.commandHistory, 'script.sh'), hint: '输入 chmod +x script.sh' },
      { id: '25-5', instruction: '运行脚本：./script.sh', command: './script.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, './script.sh'), hint: '输入 ./script.sh' }
    ]`
  },
  {
    find: /tasks: \[\s*\{\s*id: '26-1'.*?\}\s*\]/s,
    replace: `tasks: [
      { id: '26-1', instruction: '创建脚本：echo \\'#!/bin/bash\\' > check.sh', command: 'echo \\'#!/bin/bash\\' > check.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo') && hasCommandContaining(state.commandHistory, 'check.sh'), hint: '输入 echo \\'#!/bin/bash\\' > check.sh' },
      { id: '26-2', instruction: '定义变量：echo \\'NUM=10\\' >> check.sh', command: 'echo \\'NUM=10\\' >> check.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'NUM=10'), hint: '输入 echo \\'NUM=10\\' >> check.sh' },
      { id: '26-3', instruction: 'if条件判断：echo \\'if [ $NUM -gt 5 ]; then echo "大于5"; fi\\' >> check.sh', command: 'echo \\'if [ $NUM -gt 5 ]; then echo "大于5"; fi\\' >> check.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, '-gt 5'), hint: '输入 echo \\'if [ $NUM -gt 5 ]; then echo "大于5"; fi\\' >> check.sh' },
      { id: '26-4', instruction: '添加执行权限：chmod +x check.sh', command: 'chmod +x check.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'chmod') && hasCommandContaining(state.commandHistory, 'check.sh'), hint: '输入 chmod +x check.sh' },
      { id: '26-5', instruction: '运行脚本：./check.sh', command: './check.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, './check.sh'), hint: '输入 ./check.sh' }
    ]`
  },
  {
    find: /tasks: \[\s*\{\s*id: '27-1'.*?\}\s*\]/s,
    replace: `tasks: [
      { id: '27-1', instruction: '创建脚本：echo \\'#!/bin/bash\\' > loop.sh', command: 'echo \\'#!/bin/bash\\' > loop.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo') && hasCommandContaining(state.commandHistory, 'loop.sh'), hint: '输入 echo \\'#!/bin/bash\\' > loop.sh' },
      { id: '27-2', instruction: 'for循环遍历列表：echo \\'for i in 1 2 3; do echo "Number: $i"; done\\' >> loop.sh', command: 'echo \\'for i in 1 2 3; do echo "Number: $i"; done\\' >> loop.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'for i in 1 2 3'), hint: '输入 echo \\'for i in 1 2 3; do echo "Number: $i"; done\\' >> loop.sh' },
      { id: '27-3', instruction: '添加执行权限：chmod +x loop.sh', command: 'chmod +x loop.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'chmod') && hasCommandContaining(state.commandHistory, 'loop.sh'), hint: '输入 chmod +x loop.sh' },
      { id: '27-4', instruction: '运行脚本：./loop.sh', command: './loop.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, './loop.sh'), hint: '输入 ./loop.sh' }
    ]`
  },
  {
    find: /tasks: \[\s*\{\s*id: '28-1'.*?\}\s*\]/s,
    replace: `tasks: [
      { id: '28-1', instruction: '创建脚本：echo \\'#!/bin/bash\\' > while.sh', command: 'echo \\'#!/bin/bash\\' > while.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo') && hasCommandContaining(state.commandHistory, 'while.sh'), hint: '输入 echo \\'#!/bin/bash\\' > while.sh' },
      { id: '28-2', instruction: '定义计数器：echo \\'COUNT=1\\' >> while.sh', command: 'echo \\'COUNT=1\\' >> while.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'COUNT=1'), hint: '输入 echo \\'COUNT=1\\' >> while.sh' },
      { id: '28-3', instruction: 'while循环：echo \\'while [ $COUNT -le 3 ]; do echo "Count: $COUNT"; COUNT=$((COUNT+1)); done\\' >> while.sh', command: 'echo \\'while [ $COUNT -le 3 ]; do echo "Count: $COUNT"; COUNT=$((COUNT+1)); done\\' >> while.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'while [ $COUNT -le 3 ]'), hint: '输入 echo \\'while [ $COUNT -le 3 ]; do echo "Count: $COUNT"; COUNT=$((COUNT+1)); done\\' >> while.sh' },
      { id: '28-4', instruction: '添加执行权限：chmod +x while.sh', command: 'chmod +x while.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'chmod') && hasCommandContaining(state.commandHistory, 'while.sh'), hint: '输入 chmod +x while.sh' },
      { id: '28-5', instruction: '运行脚本：./while.sh', command: './while.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, './while.sh'), hint: '输入 ./while.sh' }
    ]`
  },
  {
    find: /tasks: \[\s*\{\s*id: '29-1'.*?\}\s*\]/s,
    replace: `tasks: [
      { id: '29-1', instruction: '创建脚本：echo \\'#!/bin/bash\\' > func.sh', command: 'echo \\'#!/bin/bash\\' > func.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo') && hasCommandContaining(state.commandHistory, 'func.sh'), hint: '输入 echo \\'#!/bin/bash\\' > func.sh' },
      { id: '29-2', instruction: '定义函数：echo \\'greet() { echo "Hello $1!"; }\\' >> func.sh', command: 'echo \\'greet() { echo "Hello $1!"; }\\' >> func.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'greet()'), hint: '输入 echo \\'greet() { echo "Hello $1!"; }\\' >> func.sh' },
      { id: '29-3', instruction: '调用函数：echo \\'greet "World"\\' >> func.sh', command: 'echo \\'greet "World"\\' >> func.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'greet "World"'), hint: '输入 echo \\'greet "World"\\' >> func.sh' },
      { id: '29-4', instruction: '添加执行权限：chmod +x func.sh', command: 'chmod +x func.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'chmod') && hasCommandContaining(state.commandHistory, 'func.sh'), hint: '输入 chmod +x func.sh' },
      { id: '29-5', instruction: '运行脚本：./func.sh', command: './func.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, './func.sh'), hint: '输入 ./func.sh' }
    ]`
  },
  {
    find: /tasks: \[\s*\{\s*id: '30-1'.*?\}\s*\]/s,
    replace: `tasks: [
      { id: '30-1', instruction: '创建脚本：echo \\'#!/bin/bash\\' > final.sh', command: 'echo \\'#!/bin/bash\\' > final.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'echo') && hasCommandContaining(state.commandHistory, 'final.sh'), hint: '输入 echo \\'#!/bin/bash\\' > final.sh' },
      { id: '30-2', instruction: '添加输出：echo \\'echo "脚本测试成功！"\\' >> final.sh', command: 'echo \\'echo "脚本测试成功！"\\' >> final.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, '脚本测试成功！'), hint: '输入 echo \\'echo "脚本测试成功！"\\' >> final.sh' },
      { id: '30-3', instruction: '添加执行权限：chmod +x final.sh', command: 'chmod +x final.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, 'chmod') && hasCommandContaining(state.commandHistory, 'final.sh'), hint: '输入 chmod +x final.sh' },
      { id: '30-4', instruction: '运行脚本：./final.sh', command: './final.sh', validator: (state: TerminalState) => hasCommandContaining(state.commandHistory, './final.sh'), hint: '输入 ./final.sh' }
    ]`
  }
];

for (const rep of replacements) {
  content = content.replace(rep.find, rep.replace);
}

fs.writeFileSync('src/data/levels.ts', content, 'utf8');
console.log('Fixed levels.ts');
