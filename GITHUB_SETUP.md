# 🚀 GitHub 部署指南

## 第一步：创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `linux-quest`
   - **Description**: `🐧 交互式 Linux 命令行学习平台`
   - **Visibility**: Public（GitHub Pages 需要）
   - **不要**勾选 "Add a README file"（我们已经有了）
3. 点击 "Create repository"

## 第二步：推送代码到 GitHub

在终端中运行以下命令（在 linux-quest 目录下）：

```bash
# 添加远程仓库（替换 YOUR_USERNAME 为你的 GitHub 用户名）
git remote add origin https://github.com/rogue/linux-quest.git

# 推送代码
git push -u origin main
```

## 第三步：配置 GitHub Pages

1. 访问你的仓库：https://github.com/rogue/linux-quest
2. 点击 **Settings** 选项卡
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 部分：
   - 选择 **Deploy from a branch**
   - **Branch**: 选择 `main`
   - **Folder**: 选择 `/ (root)`
   - 点击 **Save**

## 第四步：等待部署

- GitHub Pages 会自动构建和部署你的站点
- 通常需要 2-5 分钟
- 部署完成后，你的站点将在以下地址可用：

```
https://rogue.github.io/linux-quest/
```

## 第五步：验证部署

1. 访问 https://rogue.github.io/linux-quest/
2. 你应该能看到 Linux Quest 的介绍页面
3. 点击链接可以访问应用

## 🎯 快速命令汇总

```bash
# 1. 添加远程仓库
git remote add origin https://github.com/rogue/linux-quest.git

# 2. 推送代码
git push -u origin main

# 3. 后续更新
git add -A
git commit -m "Your commit message"
git push
```

## 📝 注意事项

### 1. Firebase 配置
你的应用使用了 Firebase，需要在 Firebase Console 中：
- 添加你的 GitHub Pages 域名到授权域名
- 路径：Firebase Console → Authentication → Settings → Authorized domains
- 添加：`rogue.github.io`

### 2. 环境变量（可选）
如果你想隐藏 Firebase 配置，可以：
1. 创建 `.env` 文件（已在 .gitignore 中）
2. 使用环境变量替换硬编码的配置
3. 在 GitHub Settings → Secrets 中添加 secrets

### 3. 自定义域名（可选）
如果你想使用自己的域名：
1. 在 GitHub Pages 设置中添加自定义域名
2. 配置 DNS 记录
3. 启用 HTTPS

## 🔧 常见问题

### Q: 推送时提示权限错误？
A: 确保你有仓库的写入权限，或者使用 SSH：
```bash
git remote set-url origin git@github.com:rogue/linux-quest.git
```

### Q: GitHub Pages 显示 404？
A: 检查以下：
- 仓库是否为 Public
- GitHub Pages 是否启用
- 是否等待了足够的时间（2-5 分钟）

### Q: 页面样式丢失？
A: 可能是路径问题，检查 `vite.config.ts` 中的 `base` 配置。

### Q: Firebase 认证失败？
A: 确保在 Firebase Console 中添加了 GitHub Pages 域名。

## 🎉 完成！

部署成功后，你可以：
- 分享链接给朋友：https://rogue.github.io/linux-quest/
- 在简历中添加项目链接
- 继续开发新功能

---

如有问题，欢迎提 Issue 或联系作者！
