---
layout: home

hero:
  name: "xcli"
  text: "TypeScript 项目脚手架"
  tagline: 可插拔、可配置、开箱即用
  image:
    src: /logo.svg
    alt: xcli
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/getting-started
    - theme: alt
      text: 查看命令
      link: /commands/init
    - theme: alt
      text: GitHub
      link: https://github.com

features:
  - icon: 🚀
    title: 多种项目模板
    details: 支持 React、Vue、Library 等多种项目类型，内置 Router 和 pnpm monorepo 结构
  - icon: 🗃️
    title: 状态管理
    details: React 可选 Redux Toolkit 或 MobX，Vue 默认集成 Pinia 状态管理
  - icon: 🎨
    title: 样式预处理器
    details: 支持 CSS、Less、Sass 三种样式预处理器，自动配置 PostCSS 和 Autoprefixer
  - icon: 🔌
    title: 可插拔插件
    details: 灵活的插件系统，按需启用 TypeScript、ESLint、Prettier、Vitest 等
  - icon: 📦
    title: 构建工具集成
    details: 内置 Vite、Rollup、Webpack 构建配置，支持老旧浏览器兼容
  - icon: 🔧
    title: Git 工作流
    details: 集成 Husky、Commitlint，规范 Git 提交信息和工作流
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #646cff 30%, #535bf2);
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #646cff50 50%, #535bf250 50%);
  --vp-home-hero-image-filter: blur(44px);
}
</style>
