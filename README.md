# 🐧 Linux Quest

> 一个交互式的 Linux 命令行学习平台，通过游戏化的方式帮助初学者掌握 Linux 基础命令。

![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite)
![Firebase](https://img.shields.io/badge/Firebase-12.14-FFCA28?style=flat-square&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.3-06B6D4?style=flat-square&logo=tailwindcss)

## ✨ 功能特性

### 🎯 游戏化学习体验
- **关卡制学习**：从基础命令到高级技巧，循序渐进
- **实时终端模拟**：内置虚拟终端，无需真实 Linux 环境
- **即时反馈**：输入命令后立即获得结果和提示
- **进度追踪**：记录学习进度，随时回顾

### 📚 丰富的课程内容

#### 基础篇
| 关卡 | 命令 | 学习内容 |
|:---:|:---:|:---|
| 1 | `pwd` | 查看当前工作目录 |
| 2 | `ls` | 列出目录内容，掌握 `-l`、`-a` 选项 |
| 3 | `cd` | 目录导航，理解相对/绝对路径 |
| 4 | `mkdir` | 创建目录 |
| 5 | `touch` | 创建空文件 |
| 6 | `cp` | 复制文件和目录 |
| 7 | `mv` | 移动/重命名文件 |
| 8 | `rm` | 删除文件和目录 |
| 9 | `cat` | 查看文件内容 |
| 10 | `echo` | 输出文本和重定向 |

#### 进阶篇
- 文件权限管理
- 进程管理
- 管道和重定向
- 文本处理工具

### 🔐 用户系统
- 邮箱注册/登录
- Firebase 认证保障安全
- 学习进度云端同步

### 💡 智能提示系统
- 每个关卡提供 3 个渐进式提示
- 详细的命令解释和示例
- 常见错误分析

## 🚀 快速开始

### 环境要求
- Node.js >= 18
- npm >= 9

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/YOUR_USERNAME/linux-quest.git
   cd linux-quest
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置 Firebase**
   - 在 [Firebase Console](https://console.firebase.google.com/) 创建项目
   - 启用 Authentication（邮箱/密码登录）
   - 复制配置到 `src/services/firebase.ts`

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **构建生产版本**
   ```bash
   npm run build
   ```

## 🛠️ 技术栈

| 技术 | 用途 |
|:---|:---|
| **React 19** | UI 框架 |
| **TypeScript** | 类型安全 |
| **Vite** | 构建工具 |
| **React Router** | 路由管理 |
| **Tailwind CSS** | 样式系统 |
| **Firebase** | 认证和数据存储 |

## 📁 项目结构

```
linux-quest/
├── public/              # 静态资源
├── src/
│   ├── components/      # React 组件
│   │   ├── Auth/        # 登录/注册组件
│   │   ├── Dashboard/   # 仪表盘
│   │   ├── Hint/        # 提示系统
│   │   ├── Lesson/      # 课程视图
│   │   ├── Terminal/    # 终端模拟器
│   │   └── UI/          # 通用 UI 组件
│   ├── context/         # React Context
│   ├── data/            # 课程数据
│   │   ├── levels.ts    # 关卡配置
│   │   └── hints.ts     # 提示内容
│   ├── services/        # Firebase 服务
│   ├── types/           # TypeScript 类型
│   ├── App.tsx          # 主应用组件
│   └── main.tsx         # 入口文件
├── index.html           # HTML 模板
├── package.json         # 项目配置
├── vite.config.ts       # Vite 配置
└── tsconfig.json        # TypeScript 配置
```

## 🎮 使用指南

### 1. 注册账号
首次使用需要注册一个账号，用于保存学习进度。

### 2. 选择关卡
在仪表盘中选择想要学习的关卡，每个关卡都有明确的学习目标。

### 3. 完成任务
- 阅读任务说明
- 在终端中输入正确的命令
- 获得即时反馈
- 完成所有任务解锁下一关

### 4. 使用提示
如果遇到困难，可以点击"查看提示"获取帮助。每个关卡有 3 个渐进式提示。

## 🤝 贡献指南

欢迎贡献代码、报告问题或提出建议！

1. Fork 本项目
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📝 开源协议

本项目采用 MIT 协议 - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- [React](https://react.dev/) - 用于构建用户界面的 JavaScript 库
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Tailwind CSS](https://tailwindcss.com/) - 实用优先的 CSS 框架
- [Firebase](https://firebase.google.com/) - Google 应用开发平台

## 📧 联系方式

如有任何问题或建议，欢迎联系：

- GitHub: https://github.com/RipWheeler-max
- Email: roguesky029@gmail.com

---

<div align="center">
  <sub>Built with ❤️ for Linux learners</sub>
</div>
