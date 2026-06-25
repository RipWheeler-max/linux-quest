# 🚀 快速部署指南

## 三步完成部署

### 第 1 步：创建 GitHub 仓库

访问 https://github.com/new：
- Repository name: `linux-quest`
- Description: `🐧 交互式 Linux 命令行学习平台`
- Visibility: **Public**
- **不要**勾选 "Add a README file"

点击 **Create repository**

### 第 2 步：推送代码

```bash
cd /Users/liujingjing/Desktop/ClaudeCodeProject/linux-quest

# 添加远程仓库
git remote add origin https://github.com/rogue/linux-quest.git

# 推送代码
git push -u origin main
```

### 第 3 步：配置 GitHub Pages

1. 访问 https://github.com/rogue/linux-quest/settings/pages
2. 在 **Source** 部分选择：
   - **Deploy from a branch**
   - **Branch**: `main`
   - **Folder**: `/docs`
3. 点击 **Save**

等待 2-5 分钟，你的站点将在以下地址可用：

```
https://rogue.github.io/linux-quest/
```

## 🎉 完成！

部署成功后，你可以：

1. **访问项目介绍页**：
   https://rogue.github.io/linux-quest/

2. **查看 GitHub 仓库**：
   https://github.com/rogue/linux-quest

3. **分享给朋友**：
   复制链接发送给他们！

## 📝 后续更新

```bash
# 修改代码后
git add -A
git commit -m "描述你的更改"
git push

# GitHub Pages 会自动重新部署
```

## 🔧 需要帮助？

查看详细指南：[GITHUB_SETUP.md](./GITHUB_SETUP.md)

---

**提示**：记得在 Firebase Console 中添加 `rogue.github.io` 到授权域名，否则登录功能会失败。
