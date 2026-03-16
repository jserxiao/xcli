/**
 * 共享模板工具函数和配置
 * 从独立文件中重新导出，便于查阅和修改
 */

// 从独立模板文件中导出样式相关函数
export {
  getStyleExt,
  getBaseStyles,
  getAppStyles,
  getPageStyles,
} from './files/shared/styles.js';

// 从独立模板文件中导出配置
export {
  getAxiosConfig,
  getFetchConfig,
} from './files/shared/http-client.js';

// 从独立模板文件中导出状态管理模板
export {
  getReduxStoreIndex,
  getReduxCounterSlice,
  getReduxApiSlice,
  getReduxLoggerMiddleware,
  getMobXCounterStore,
  getMobXStoreIndex,
  getPiniaStoreIndex,
  getPiniaCounterStore,
} from './files/shared/store.js';

// 从独立模板文件中导出包生成器
export {
  createSharedPackage,
  createReactUiPackage,
  createVueUiPackage,
} from './files/shared/packages.js';

// ============ 配置文件模板（保留在 shared.ts 中，因为它们较为简短） ============

import type { StyleType, BundlerType } from '../types/index.js';
import path from 'path';
import fs from 'fs-extra';

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
 * 支持 Chrome 86+ 及现代浏览器
 */
export function getBrowserslistContent(): string {
  return `[production]
> 0.5%
last 2 versions
not dead
not IE 11
Chrome >= 86

[development]
last 1 chrome version
last 1 firefox version
last 1 safari version
`;
}

/**
 * 获取 postcss.config.js 内容
 * autoprefixer 会自动读取 .browserslistrc 配置
 */
export function getPostcssConfig(): string {
  return `export default {
  plugins: {
    autoprefixer: {
      // autoprefixer 会自动读取 .browserslistrc 或 package.json 中的 browserslist 配置
      // 无需手动指定 overrideBrowserslist
      flexbox: 'no-2009', // 只添加最终的 flexbox 规格，不添加 2009 年的旧语法
      grid: true, // 支持 IE/Edge 的 grid 布局前缀
    },
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
 * 获取 .npmrc 内容（pnpm 配置）
 */
export function getNpmrc(): string {
  return `# pnpm 配置
auto-install-peers=true
strict-peer-dependencies=false

# 仅允许特定包运行 build 脚本（消除 pnpm warning）
# pnpm 10+ 需要显式批准依赖的 postinstall 脚本
# 方式1: 运行 pnpm approve-builds 交互式批准
# 方式2: 使用 ignore-dep-scripts 完全忽略（不推荐生产环境）
ignore-dep-scripts=true
`;
}

/**
 * 获取环境变量前缀
 * @param framework 框架类型
 * @param bundler 打包工具类型
 */
export function getEnvPrefix(framework: 'react' | 'vue', bundler: BundlerType = 'vite'): string {
  // Vite 统一使用 VITE_ 前缀
  if (bundler === 'vite') {
    return 'VITE';
  }
  // Webpack: React 使用 REACT_APP_，Vue 使用 VUE_
  return framework === 'react' ? 'REACT_APP' : 'VUE';
}

/**
 * 获取 .env 环境变量基础模板
 * @param framework 框架类型
 * @param bundler 打包工具类型
 */
export function getEnvBase(framework: 'react' | 'vue', bundler: BundlerType = 'vite'): string {
  const envPrefix = getEnvPrefix(framework, bundler);
  
  return `# 环境变量配置文件
# 此文件应添加到 .gitignore，不要提交到代码仓库

# API 基础地址
${envPrefix}_API_BASE_URL=/api

# 应用标题
${envPrefix}_APP_TITLE=My App

# 应用端口（部分打包工具支持）
PORT=3000
`;
}

/**
 * 获取 .env.development 开发环境变量模板
 * @param framework 框架类型
 * @param bundler 打包工具类型
 */
export function getEnvDevelopment(framework: 'react' | 'vue', bundler: BundlerType = 'vite'): string {
  const envPrefix = getEnvPrefix(framework, bundler);
  
  return `# 开发环境变量配置
# 此文件可以提交到代码仓库

# 环境标识
NODE_ENV=development

# API 基础地址
${envPrefix}_API_BASE_URL=/api

# 应用标题
${envPrefix}_APP_TITLE=My App (Development)

# 是否开启 Mock 数据
${envPrefix}_ENABLE_MOCK=true

# 调试模式
${envPrefix}_DEBUG=true

# 开发服务器端口
PORT=3000
`;
}

/**
 * 获取 .env.production 生产环境变量模板
 * @param framework 框架类型
 * @param bundler 打包工具类型
 */
export function getEnvProduction(framework: 'react' | 'vue', bundler: BundlerType = 'vite'): string {
  const envPrefix = getEnvPrefix(framework, bundler);
  
  return `# 生产环境变量配置
# 此文件可以提交到代码仓库

# 环境标识
NODE_ENV=production

# API 基础地址（生产环境请修改为实际地址）
${envPrefix}_API_BASE_URL=https://api.example.com

# 应用标题
${envPrefix}_APP_TITLE=My App

# 是否开启 Mock 数据
${envPrefix}_ENABLE_MOCK=false

# 调试模式
${envPrefix}_DEBUG=false
`;
}

/**
 * 获取 .env.example 示例环境变量模板
 * @param framework 框架类型
 * @param bundler 打包工具类型
 */
export function getEnvExample(framework: 'react' | 'vue', bundler: BundlerType = 'vite'): string {
  const envPrefix = getEnvPrefix(framework, bundler);
  
  return `# 环境变量示例文件
# 复制此文件为 .env.local 并填入实际值

# API 基础地址
${envPrefix}_API_BASE_URL=/api

# 应用标题
${envPrefix}_APP_TITLE=My App

# 是否开启 Mock 数据
${envPrefix}_ENABLE_MOCK=false

# 调试模式
${envPrefix}_DEBUG=false
`;
}

/**
 * 创建环境变量配置文件
 * @param projectPath 项目路径
 * @param framework 框架类型
 * @param bundler 打包工具类型
 */
export async function createEnvFiles(
  projectPath: string,
  framework: 'react' | 'vue',
  bundler: BundlerType = 'vite'
): Promise<void> {
  // .env - 本地环境变量（不提交）
  await fs.writeFile(
    path.join(projectPath, '.env'),
    getEnvBase(framework, bundler),
    'utf-8'
  );

  // .env.development - 开发环境变量（提交）
  await fs.writeFile(
    path.join(projectPath, '.env.development'),
    getEnvDevelopment(framework, bundler),
    'utf-8'
  );

  // .env.production - 生产环境变量（提交）
  await fs.writeFile(
    path.join(projectPath, '.env.production'),
    getEnvProduction(framework, bundler),
    'utf-8'
  );

  // .env.example - 示例文件（提交）
  await fs.writeFile(
    path.join(projectPath, '.env.example'),
    getEnvExample(framework, bundler),
    'utf-8'
  );
}

/**
 * 获取全局类型声明内容（通用资源类型声明）
 * @param framework 框架类型
 */
export function getGlobalTypeDeclarations(framework: 'react' | 'vue'): string {
  const base = `// 全局类型声明文件
// 资源文件类型声明

// 普通 SVG 资源导入
declare module '*.svg' {
  const content: string;
  export default content;
}

// 图片资源导入
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// CSS 模块声明
declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.less' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}
`;

  if (framework === 'vue') {
    return base + `
// Vue 单文件组件声明
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
`;
  }

  return base;
}

/**
 * 获取 vite-env.d.ts 内容
 * @param framework 框架类型
 */
export function getViteEnvDts(framework: 'react' | 'vue'): string {
  const base = `/// <reference types="vite/client" />

// SVG as Component 类型声明（使用 ?react 后缀）
declare module '*.svg?react' {
  import React from 'react';
  const SVGComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  export default SVGComponent;
}

// 普通 SVG 资源导入
declare module '*.svg' {
  const content: string;
  export default content;
}

// 图片资源导入
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}
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
export function getBaseTsConfig(framework: 'react' | 'vue', bundler: BundlerType = 'vite'): Record<string, unknown> {
  const isVite = bundler === 'vite';

  const compilerOptions: Record<string, unknown> = {
    target: 'ES2022',
    useDefineForClassFields: true,
    module: 'ESNext',
    lib: ['ES2022', 'DOM', 'DOM.Iterable'],
    skipLibCheck: true,
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true,
    moduleResolution: isVite ? 'bundler' : 'Node',
    resolveJsonModule: true,
    isolatedModules: true,
    jsx: framework === 'react' ? 'react-jsx' : 'preserve',
    // Monorepo workspace 包路径映射
    paths: {
      'shared': ['./packages/shared/src/index.ts'],
      'ui': ['./packages/ui/src/index.ts'],
    },
    // 包含 workspace 包的 baseUrl
    baseUrl: '.',
  };

  // Vite 特定配置
  if (isVite) {
    compilerOptions.allowImportingTsExtensions = true;
    compilerOptions.noEmit = true;
  }

  return {
    compilerOptions,
    include: ['src', 'packages/*/src'],
    exclude: ['node_modules'],
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

// ============ 项目根目录配置文件生成器 ============

/**
 * 创建根目录通用配置文件
 */
export async function createRootConfigFiles(
  projectPath: string,
  framework: 'react' | 'vue',
  bundler: BundlerType = 'vite',
  useTypeScript: boolean = true
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

  // tsconfig.json (仅 TypeScript 项目)
  if (useTypeScript) {
    await fs.writeFile(
      path.join(projectPath, 'tsconfig.json'),
      JSON.stringify(getBaseTsConfig(framework, bundler), null, 2),
      'utf-8'
    );
  }

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

  // .npmrc
  await fs.writeFile(
    path.join(projectPath, '.npmrc'),
    getNpmrc(),
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

// ============ VSCode 配置 ============

/**
 * VSCode 配置上下文
 */
export interface VscodeConfigContext {
  projectType: 'library' | 'react' | 'vue';
  styleType: StyleType;
  hasStylelint: boolean;
  hasPrettier: boolean;
  hasEslint: boolean;
}

/**
 * 获取 VSCode settings.json 内容
 */
export function getVscodeSettings(context: VscodeConfigContext): string {
  const { projectType, styleType, hasStylelint, hasPrettier, hasEslint } = context;

  const settings: Record<string, any> = {
    // 编辑器基础设置
    'editor.formatOnSave': true,
    'editor.defaultFormatter': hasPrettier ? 'esbenp.prettier-vscode' : undefined,
    'editor.codeActionsOnSave': {},
    'editor.tabSize': 2,
    'editor.insertSpaces': true,
    'editor.detectIndentation': true,
    'editor.renderWhitespace': 'boundary',
    'editor.minimap.enabled': false,
    'files.eol': '\n',
    'files.insertFinalNewline': true,
    'files.trimTrailingWhitespace': true,
    // TypeScript 设置
    'typescript.tsdk': 'node_modules/typescript/lib',
    'typescript.enablePromptUseWorkspaceTsdk': true,
    'typescript.preferences.importModuleSpecifier': 'relative',
  };

  // ESLint 配置
  if (hasEslint) {
    settings['editor.codeActionsOnSave'] = {
      'source.fixAll.eslint': 'explicit',
    };
    settings['eslint.validate'] = [
      'javascript',
      'javascriptreact',
      'typescript',
      'typescriptreact',
    ];
  }

  // Prettier 配置
  if (hasPrettier) {
    settings['prettier.requireConfig'] = true;
    settings['prettier.useEditorConfig'] = true;
  }

  // Stylelint 配置
  if (hasStylelint) {
    settings['stylelint.validate'] = ['css', 'less', 'scss'];
    settings['css.validate'] = false;
    settings['less.validate'] = false;
    settings['scss.validate'] = false;
  }

  // 样式相关
  if (styleType === 'less') {
    settings['less.lint.unknownAtRules'] = 'ignore';
  } else if (styleType === 'scss') {
    settings['scss.lint.unknownAtRules'] = 'ignore';
  }

  // 项目类型特定配置
  if (projectType === 'react') {
    settings['emmet.includeLanguages'] = {
      javascript: 'javascriptreact',
    };
  } else if (projectType === 'vue') {
    settings['vue.server.hybridMode'] = true;
    settings['vue.inlayHints.missingProps'] = true;
    settings['vue.inlayHints.inlineHandlerLeading'] = true;
  }

  // 过滤掉 undefined 值
  const filteredSettings: Record<string, any> = {};
  for (const [key, value] of Object.entries(settings)) {
    if (value !== undefined) {
      filteredSettings[key] = value;
    }
  }

  return JSON.stringify(filteredSettings, null, 2);
}

/**
 * 获取 VSCode extensions.json 内容
 */
export function getVscodeExtensions(context: VscodeConfigContext): string {
  const { projectType, hasStylelint } = context;

  const extensions: string[] = [
    // 必装扩展
    'dbaeumer.vscode-eslint', // ESLint
    'esbenp.prettier-vscode', // Prettier
    'editorconfig.editorconfig', // EditorConfig
    'usernamehw.errorlens', // Error Lens
    'streetsidesoftware.code-spell-checker', // Code Spell Checker
  ];

  // TypeScript 相关
  extensions.push('ms-vscode.vscode-typescript-next');

  // 项目类型扩展
  if (projectType === 'react') {
    extensions.push('dsznajder.es7-react-js-snippets');
  } else if (projectType === 'vue') {
    extensions.push('Vue.volar');
    extensions.push('hollowtree.vue-snippets');
  }

  // Stylelint 扩展
  if (hasStylelint) {
    extensions.push('stylelint.vscode-stylelint');
  }

  // 其他推荐扩展
  extensions.push('christian-kohler.path-intellisense');
  extensions.push('christian-kohler.npm-intellisense');

  const recommendations = {
    recommendations: [...new Set(extensions)], // 去重
  };

  return JSON.stringify(recommendations, null, 2);
}

/**
 * 获取 VSCode launch.json 内容
 */
export function getVscodeLaunch(projectType: 'library' | 'react' | 'vue'): string {
  if (projectType === 'library') {
    return JSON.stringify({
      version: '0.2.0',
      configurations: [
        {
          type: 'node',
          request: 'launch',
          name: 'Debug Current File',
          skipFiles: ['<node_internals>/**'],
          program: '${file}',
          preLaunchTask: 'tsc: build - tsconfig.json',
          outFiles: ['${workspaceFolder}/dist/**/*.js'],
        },
      ],
    }, null, 2);
  }

  // React/Vue 项目
  return JSON.stringify({
    version: '0.2.0',
    configurations: [
      {
        type: 'chrome',
        request: 'launch',
        name: 'Launch Chrome',
        url: 'http://localhost:5173',
        webRoot: '${workspaceFolder}/src',
      },
    ],
  }, null, 2);
}

/**
 * 创建 .vscode 目录和配置文件
 */
export async function createVscodeConfig(
  projectPath: string,
  context: VscodeConfigContext
): Promise<void> {
  const vscodePath = path.join(projectPath, '.vscode');
  await fs.ensureDir(vscodePath);

  // settings.json
  await fs.writeFile(
    path.join(vscodePath, 'settings.json'),
    getVscodeSettings(context),
    'utf-8'
  );

  // extensions.json
  await fs.writeFile(
    path.join(vscodePath, 'extensions.json'),
    getVscodeExtensions(context),
    'utf-8'
  );

  // launch.json
  await fs.writeFile(
    path.join(vscodePath, 'launch.json'),
    getVscodeLaunch(context.projectType),
    'utf-8'
  );
}
