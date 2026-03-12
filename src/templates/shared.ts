import type { StyleType } from '../types/index.js';
import path from 'path';
import fs from 'fs-extra';

// ============ 样式相关 ============

/**
 * 获取样式文件扩展名
 */
export function getStyleExt(styleType: StyleType): string {
  switch (styleType) {
    case 'less':
      return 'less';
    case 'scss':
      return 'scss';
    default:
      return 'css';
  }
}

/**
 * 获取基础样式内容
 */
export function getBaseStyles(): string {
  return `:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
}
`;
}

/**
 * 获取 App 组件样式
 * @param styleType 样式类型
 * @param framework 框架类型，用于生成不同的 active class 名
 */
export function getAppStyles(styleType: StyleType, framework: 'react' | 'vue' = 'react'): string {
  const activeClass = framework === 'react' ? 'active' : 'router-link-active';

  if (styleType === 'scss' || styleType === 'less') {
    return `.app {
  .nav {
    display: flex;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid #333;
    margin-bottom: 2rem;

    a {
      color: #646cff;
      text-decoration: none;

      &:hover {
        color: #535bf2;
      }

      &.${activeClass} {
        color: #535bf2;
        font-weight: bold;
      }
    }
  }

  .main-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }
}`;
  }

  return `.app {
  text-align: center;
}

.nav {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #333;
  margin-bottom: 2rem;
}

.nav a {
  color: #646cff;
  text-decoration: none;
}

.nav a:hover {
  color: #535bf2;
}

.nav a.${activeClass} {
  color: #535bf2;
  font-weight: bold;
}

.main-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}`;
}

/**
 * 获取页面样式
 */
export function getPageStyles(styleType: StyleType): string {
  if (styleType === 'scss' || styleType === 'less') {
    return `.page {
  padding: 2rem;

  h1 {
    margin-bottom: 1rem;
  }

  p {
    color: #888;
  }
}`;
  }

  return `.page {
  padding: 2rem;
}

.page h1 {
  margin-bottom: 1rem;
}

.page p {
  color: #888;
}
`;
}

// ============ 配置文件模板 ============

/**
 * 获取 .gitignore 内容
 */
export function getGitignoreContent(): string {
  return `# Dependencies
node_modules
.pnpm-store

# Build outputs
dist
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
!.vscode/settings.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# OS files
.DS_Store
Thumbs.db

# Test coverage
coverage

# Environment files
.env
.env.local
.env.*.local
`;
}

/**
 * 获取 .browserslistrc 内容
 */
export function getBrowserslistContent(): string {
  return `[production]
> 0.5%
last 2 versions
not dead
not IE 11

[development]
last 1 chrome version
last 1 firefox version
last 1 safari version
`;
}

/**
 * 获取 postcss.config.js 内容
 */
export function getPostcssConfig(): string {
  return `export default {
  plugins: {
    autoprefixer: {},
  },
};
`;
}

/**
 * 获取 Vite SVG 图标
 */
export function getViteSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="31.88" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 257"><defs><linearGradient id="IconifyId1813088fe1fbc01fb466" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%"><stop offset="0%" stop-color="#41D1FF"></stop><stop offset="100%" stop-color="#BD34FE"></stop></linearGradient><linearGradient id="IconifyId1813088fe1fbc01fb467" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%"><stop offset="0%" stop-color="#FFBD4F"></stop><stop offset="100%" stop-color="#FF980E"></stop></linearGradient></defs><path fill="url(#IconifyId1813088fe1fbc01fb466)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"></path><path fill="url(#IconifyId1813088fe1fbc01fb467)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"></path></svg>`;
}

/**
 * 获取 pnpm-workspace.yaml 内容
 */
export function getPnpmWorkspaceYaml(): string {
  return `packages:
  - 'packages/*'
`;
}

/**
 * 获取 vite-env.d.ts 内容
 * @param framework 框架类型
 */
export function getViteEnvDts(framework: 'react' | 'vue'): string {
  const base = `/// <reference types="vite/client" />
`;

  if (framework === 'vue') {
    return base + `
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
`;
  }

  return base;
}

// ============ TypeScript 配置 ============

/**
 * 获取基础 tsconfig 配置
 */
export function getBaseTsConfig(framework: 'react' | 'vue'): Record<string, unknown> {
  return {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'Node',
      lib: ['ES2022', 'DOM'],
      jsx: framework === 'react' ? 'react-jsx' : 'preserve',
      outDir: './dist',
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };
}

/**
 * 获取 packages/shared 的 tsconfig 配置
 */
export function getSharedTsConfig(): Record<string, unknown> {
  return {
    compilerOptions: {
      target: 'ES2022',
      module: 'ESNext',
      moduleResolution: 'Node',
      lib: ['ES2022'],
      outDir: './dist',
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };
}

// ============ Monorepo Packages 生成器 ============

/**
 * 创建 packages/shared 包
 */
export async function createSharedPackage(projectPath: string): Promise<void> {
  const sharedPath = path.join(projectPath, 'packages', 'shared');
  await fs.ensureDir(path.join(sharedPath, 'src'));

  // package.json
  await fs.writeFile(
    path.join(sharedPath, 'package.json'),
    JSON.stringify({
      name: 'shared',
      version: '1.0.0',
      private: true,
      type: 'module',
      main: './dist/index.js',
      types: './dist/index.d.ts',
      exports: {
        '.': {
          types: './dist/index.d.ts',
          import: './dist/index.js',
        },
      },
      scripts: {
        build: 'tsc',
        dev: 'tsc --watch',
        clean: 'rm -rf dist node_modules',
      },
    }, null, 2),
    'utf-8'
  );

  // tsconfig.json
  await fs.writeFile(
    path.join(sharedPath, 'tsconfig.json'),
    JSON.stringify(getSharedTsConfig(), null, 2),
    'utf-8'
  );

  // src/index.ts
  await fs.writeFile(
    path.join(sharedPath, 'src', 'index.ts'),
    `/**
 * 共享工具函数
 */

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
`,
    'utf-8'
  );
}

/**
 * 创建 packages/ui 包 (React 版本)
 */
export async function createReactUiPackage(projectPath: string): Promise<void> {
  const uiPath = path.join(projectPath, 'packages', 'ui');
  await fs.ensureDir(path.join(uiPath, 'src'));

  // package.json
  await fs.writeFile(
    path.join(uiPath, 'package.json'),
    JSON.stringify({
      name: 'ui',
      version: '1.0.0',
      private: true,
      type: 'module',
      main: './dist/index.js',
      types: './dist/index.d.ts',
      exports: {
        '.': {
          types: './dist/index.d.ts',
          import: './dist/index.js',
        },
      },
      scripts: {
        build: 'tsc',
        dev: 'tsc --watch',
        clean: 'rm -rf dist node_modules',
      },
      peerDependencies: {
        react: '^18.0.0',
        'react-dom': '^18.0.0',
      },
    }, null, 2),
    'utf-8'
  );

  // tsconfig.json
  await fs.writeFile(
    path.join(uiPath, 'tsconfig.json'),
    JSON.stringify({
      compilerOptions: {
        target: 'ES2022',
        module: 'ESNext',
        moduleResolution: 'Node',
        lib: ['ES2022', 'DOM'],
        jsx: 'react-jsx',
        outDir: './dist',
        rootDir: './src',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        declaration: true,
        declarationMap: true,
        sourceMap: true,
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist'],
    }, null, 2),
    'utf-8'
  );

  // src/index.ts
  await fs.writeFile(
    path.join(uiPath, 'src', 'index.ts'),
    `export { Button } from './Button';

`,
    'utf-8'
  );

  // src/Button.tsx
  await fs.writeFile(
    path.join(uiPath, 'src', 'Button.tsx'),
    `import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', children, style, ...props }: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    padding: '0.6em 1.2em',
    fontSize: '1em',
    fontWeight: 500,
    fontFamily: 'inherit',
    borderRadius: '8px',
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: 'border-color 0.25s',
    ...(variant === 'primary'
      ? { backgroundColor: '#646cff', color: '#ffffff' }
      : { backgroundColor: '#1a1a1a', color: '#ffffff' }),
    ...style,
  };

  return (
    <button style={baseStyle} {...props}>
      {children}
    </button>
  );
}
`,
    'utf-8'
  );
}

/**
 * 创建 packages/ui 包 (Vue 版本)
 */
export async function createVueUiPackage(projectPath: string): Promise<void> {
  const uiPath = path.join(projectPath, 'packages', 'ui');
  await fs.ensureDir(path.join(uiPath, 'src', 'components'));

  // package.json
  await fs.writeFile(
    path.join(uiPath, 'package.json'),
    JSON.stringify({
      name: 'ui',
      version: '1.0.0',
      private: true,
      type: 'module',
      main: './dist/index.js',
      types: './dist/index.d.ts',
      exports: {
        '.': {
          types: './dist/index.d.ts',
          import: './dist/index.js',
        },
      },
      scripts: {
        build: 'vue-tsc && vite build',
        dev: 'vite build --watch',
        clean: 'rm -rf dist node_modules',
      },
      peerDependencies: {
        vue: '^3.0.0',
      },
    }, null, 2),
    'utf-8'
  );

  // src/index.ts
  await fs.writeFile(
    path.join(uiPath, 'src', 'index.ts'),
    `export { MyButton } from './components/MyButton.vue';

`,
    'utf-8'
  );

  // src/components/MyButton.vue
  await fs.writeFile(
    path.join(uiPath, 'src', 'components', 'MyButton.vue'),
    `<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary';
}>();
</script>

<template>
  <button
    class="my-button"
    :class="variant || 'primary'"
  >
    <slot />
  </button>
</template>

<style scoped>
.my-button {
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  border-radius: 8px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: border-color 0.25s;
}

.my-button.primary {
  background-color: #646cff;
  color: #ffffff;
}

.my-button.secondary {
  background-color: #1a1a1a;
  color: #ffffff;
}
</style>
`,
    'utf-8'
  );

  // vite.config.ts
  await fs.writeFile(
    path.join(uiPath, 'vite.config.ts'),
    `import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UI',
      fileName: 'index',
    },
    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
});
`,
    'utf-8'
  );
}

// ============ 项目根目录配置文件生成器 ============

/**
 * 创建根目录通用配置文件
 */
export async function createRootConfigFiles(
  projectPath: string,
  framework: 'react' | 'vue'
): Promise<void> {
  // .gitignore
  await fs.writeFile(
    path.join(projectPath, '.gitignore'),
    getGitignoreContent(),
    'utf-8'
  );

  // .browserslistrc
  await fs.writeFile(
    path.join(projectPath, '.browserslistrc'),
    getBrowserslistContent(),
    'utf-8'
  );

  // postcss.config.js
  await fs.writeFile(
    path.join(projectPath, 'postcss.config.js'),
    getPostcssConfig(),
    'utf-8'
  );

  // tsconfig.json
  await fs.writeFile(
    path.join(projectPath, 'tsconfig.json'),
    JSON.stringify(getBaseTsConfig(framework), null, 2),
    'utf-8'
  );

  // public/vite.svg
  await fs.ensureDir(path.join(projectPath, 'public'));
  await fs.writeFile(
    path.join(projectPath, 'public', 'vite.svg'),
    getViteSvg(),
    'utf-8'
  );

  // pnpm-workspace.yaml
  await fs.writeFile(
    path.join(projectPath, 'pnpm-workspace.yaml'),
    getPnpmWorkspaceYaml(),
    'utf-8'
  );
}

/**
 * 创建主应用目录结构
 */
export async function createSrcDirectories(projectPath: string): Promise<void> {
  await fs.ensureDir(path.join(projectPath, 'src'));
  await fs.ensureDir(path.join(projectPath, 'src', 'pages'));
  await fs.ensureDir(path.join(projectPath, 'src', 'components'));
  await fs.ensureDir(path.join(projectPath, 'src', 'router'));
  await fs.ensureDir(path.join(projectPath, 'src', 'assets'));
}
