# 介绍

**xcli** 是一个可插拔的 TypeScript 项目脚手架 CLI 工具，帮助你快速搭建现代化前端项目。

## ✨ 特性

- 🚀 **多种项目模板** - 支持 React、Vue、Library 项目模板，内置 Router 和 pnpm monorepo 结构
- 🎨 **样式预处理器** - 支持 CSS、Less、Sass，自动配置 PostCSS 和 Autoprefixer
- 🔌 **可插拔插件** - 灵活的插件系统，按需启用所需功能
- 📦 **构建工具集成** - 内置 Vite、Rollup、Webpack 构建配置
- 🔧 **Git 工作流** - 集成 Husky、Commitlint，规范代码提交
- 🧪 **测试框架** - 支持 Jest 和 Vitest 测试框架
- 🌐 **浏览器兼容** - 自动配置 legacy 插件，支持老旧浏览器

## 📦 安装

```bash
# 全局安装
npm install -g xcli

# 或使用 npx
npx xcli init my-project
```

## 🚀 快速开始

### 创建新项目

```bash
# 交互式创建
xcli init my-project

# 使用缩写
xcli i my-project

# 使用默认配置快速创建
xcli i my-project -d

# 指定模板和样式预处理器
xcli i my-project -t react -s scss -d
```

### 项目模板

| 模板 | 说明 |
|------|------|
| `library` | TypeScript 库项目 |
| `react` | React + Vite + Router + pnpm monorepo |
| `vue` | Vue 3 + Vite + Router + pnpm monorepo |

## 📖 文档导航

- [快速开始](/guide/getting-started) - 了解如何使用 xcli 创建项目
- [项目模板](/guide/templates) - 了解各模板的项目结构
- [命令参考](/commands/init) - 查看所有可用命令
- [插件系统](/plugins/overview) - 了解可用的插件

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

[MIT](https://opensource.org/licenses/MIT)
