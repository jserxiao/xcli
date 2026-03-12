import { defineConfig } from 'vitepress';

export default defineConfig({
  title: 'xcli',
  description: '一个可插拔的 TypeScript 项目脚手架 CLI 工具',
  lang: 'zh-CN',
  
  head: [
    ['link', { rel: 'icon', href: '/logo.svg' }],
  ],
  
  themeConfig: {
    logo: '/logo.svg',
    
    nav: [
      { text: '首页', link: '/' },
      { text: '指南', link: '/guide/introduction' },
      { text: '命令', link: '/commands/init' },
      { text: '插件', link: '/plugins/overview' },
      {
        text: '相关链接',
        items: [
          { text: 'GitHub', link: 'https://github.com' },
        ],
      },
    ],
    
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          items: [
            { text: '介绍', link: '/guide/introduction' },
            { text: '快速开始', link: '/guide/getting-started' },
            { text: '项目模板', link: '/guide/templates' },
          ],
        },
      ],
      '/commands/': [
        {
          text: '命令',
          items: [
            { text: 'init', link: '/commands/init' },
            { text: 'plugin', link: '/commands/plugin' },
          ],
        },
      ],
      '/plugins/': [
        {
          text: '插件系统',
          items: [
            { text: '概览', link: '/plugins/overview' },
            { text: '代码规范', link: '/plugins/linting' },
            { text: '构建工具', link: '/plugins/bundler' },
            { text: '测试工具', link: '/plugins/testing' },
            { text: 'Git 工具', link: '/plugins/git' },
          ],
        },
      ],
    },
    
    socialLinks: [
      { icon: 'github', link: 'https://github.com' },
    ],
    
    footer: {
      message: '基于 MIT 许可发布',
      copyright: 'Copyright © 2024 xcli',
    },
    
    search: {
      provider: 'local',
    },
    
    outline: {
      label: '页面导航',
    },
    
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    
    lastUpdated: {
      text: '最后更新于',
    },
  },
});
