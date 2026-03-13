import fs from 'fs-extra';
import path from 'path';
import type { Plugin, PluginContext, PluginFile } from '../types/index.js';
import { getGitignoreContent } from '../templates/shared.js';

/**
 * 文件生成器
 */
export class FileGenerator {
  private context: PluginContext;

  constructor(context: PluginContext) {
    this.context = context;
  }

  /**
   * 生成单个文件
   */
  async generateFile(file: PluginFile): Promise<void> {
    const filePath = path.join(this.context.projectPath, file.path);
    const dir = path.dirname(filePath);

    // 确保目录存在
    await fs.ensureDir(dir);

    // 生成文件内容
    const content =
      typeof file.content === 'function'
        ? file.content(this.context)
        : file.content;

    // 写入文件
    await fs.writeFile(filePath, content, 'utf-8');
  }

  /**
   * 批量生成文件
   */
  async generateFiles(files: PluginFile[]): Promise<void> {
    for (const file of files) {
      await this.generateFile(file);
    }
  }

  /**
   * 根据插件生成文件
   */
  async generateFromPlugins(plugins: Plugin[]): Promise<void> {
    for (const plugin of plugins) {
      if (plugin.files && plugin.files.length > 0) {
        await this.generateFiles(plugin.files);
      }
    }
  }
}

/**
 * 创建基础文件（.gitignore 和 README.md）
 */
export async function createBaseFiles(
  projectPath: string,
  projectName: string,
  projectType: string,
  context?: { styleType?: string; stateManager?: string; httpClient?: string }
): Promise<void> {
  // 使用共享的 gitignore 内容（但保留 library 项目的简化版）
  const isLibrary = projectType === 'library';

  if (isLibrary) {
    // library 项目使用简化版的 gitignore
    await fs.writeFile(
      path.join(projectPath, '.gitignore'),
      `# Dependencies
node_modules/

# Build output
dist/

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Coverage
coverage/

# Environment
.env
.env.local
.env.*.local
`,
      'utf-8'
    );
  } else {
    // React/Vue 项目使用完整的 gitignore
    await fs.writeFile(
      path.join(projectPath, '.gitignore'),
      getGitignoreContent(),
      'utf-8'
    );
  }

  // 根据 projectType 生成不同的 README
  let readmeContent = `# ${projectName}\n\n`;

  if (projectType === 'react') {
    const styleExt = context?.styleType === 'scss' ? 'scss' : context?.styleType === 'less' ? 'less' : 'css';
    const stateManagerName = context?.stateManager === 'redux' ? 'Redux Toolkit' : 
                             context?.stateManager === 'mobx' ? 'MobX' : null;
    const httpClientName = context?.httpClient === 'axios' ? 'Axios' : 
                           context?.httpClient === 'fetch' ? 'Fetch' : null;
    
    readmeContent += `一个基于 React 18 + TypeScript + Vite 构建的现代化前端项目。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18 |
| 语言 | TypeScript 5 |
| 构建 | Vite 5 |
| 路由 | React Router 6 |
| 样式 | ${styleExt.toUpperCase()}${styleExt !== 'css' ? ' (CSS 预处理器)' : ''} |
| 代码规范 | ESLint 9 + Prettier |
| 包管理 | pnpm (Monorepo) |${stateManagerName ? `\n| 状态管理 | ${stateManagerName} |` : ''}${httpClientName ? `\n| HTTP 请求 | ${httpClientName} |` : ''}

## 目录结构

\`\`\`
${projectName}/
├── src/                    # 主应用源码
│   ├── api/                # API 请求${httpClientName ? `
│   │   └── request.ts      # HTTP 请求封装` : ''}
│   ├── components/         # 通用组件
│   │   └── Layout/         # 布局组件
│   ├── pages/              # 页面组件
│   │   ├── Home.tsx        # 首页
│   │   └── About.tsx       # 关于页
│   ├── hooks/              # 自定义 Hooks
│   ├── store/              # Redux 状态管理${context?.stateManager === 'redux' ? `
│   │   ├── index.ts        # Store 配置
│   │   ├── counterSlice.ts # 示例 Slice
│   │   ├── apiSlice.ts     # RTK Query API
│   │   └── middleware/     # 中间件` : ''}
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript 类型定义
│   ├── App.tsx             # 根组件
│   ├── main.tsx            # 入口文件
│   └── vite-env.d.ts       # Vite 类型声明
├── packages/               # Monorepo 子包
│   ├── shared/             # 共享工具库
│   │   └── src/
│   │       └── index.ts    # 工具函数导出
│   └── ui/                 # UI 组件库
│       └── src/
│           ├── index.ts    # 组件导出
│           └── components/ # UI 组件
├── public/                 # 静态资源
├── index.html              # HTML 模板
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── eslint.config.js        # ESLint 配置 (Flat Config)
├── pnpm-workspace.yaml     # pnpm 工作区配置
└── package.json
\`\`\`${context?.httpClient && context.httpClient !== 'none' ? `

## HTTP 请求

项目封装了 HTTP 请求，位于 \`src/api/request.ts\`。

### 使用示例

\`\`\`typescript
import { http } from './api/request';

// GET 请求
const data = await http.get<UserInfo>('/user/info');

// POST 请求
const result = await http.post<Response>('/user/login', { username, password });

// PUT 请求
await http.put('/user/profile', { name: 'John' });

// DELETE 请求
await http.delete('/user/123');
\`\`\`
` : ''}${context?.stateManager === 'redux' ? `

## Redux Toolkit 使用

本项目使用 Redux Toolkit 进行状态管理，内置以下功能：

### 类型安全的 Hooks

\`\`\`typescript
import { useAppDispatch, useAppSelector } from './store';

// 使用 dispatch
const dispatch = useAppDispatch();

// 使用 selector（自动类型推断）
const count = useAppSelector((state) => state.counter.value);
\`\`\`

### 异步 Action (Thunk)

\`\`\`typescript
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchData = createAsyncThunk(
  'data/fetch',
  async (id: string) => {
    const response = await fetch(\`/api/data/\${id}\`);
    return response.json();
  }
);
\`\`\`

### RTK Query 数据请求

\`\`\`typescript
import { useGetUsersQuery, useCreateUserMutation } from './store/apiSlice';

function UserList() {
  const { data, isLoading, error } = useGetUsersQuery();
  const [createUser] = useCreateUserMutation();
  
  // 自动缓存、去重、刷新
}
\`\`\`
` : ''}

## 快速开始

### 安装依赖

\`\`\`bash
pnpm install
\`\`\`

### 开发

\`\`\`bash
pnpm dev
\`\`\`

访问 http://localhost:3000 查看应用。

### 构建

\`\`\`bash
pnpm build
\`\`\`

### 预览构建结果

\`\`\`bash
pnpm preview
\`\`\`

### 代码检查

\`\`\`bash
# 检查代码规范
pnpm lint

# 自动修复
pnpm lint:fix
\`\`\`

## Monorepo 使用

本项目采用 pnpm workspace 管理 monorepo 结构。

### 引用内部包

\`\`\`typescript
// 使用 shared 包的工具函数
import { formatDate, sleep } from 'shared';

// 使用 ui 包的组件
import { Button } from 'ui';
\`\`\`

### 添加新包

1. 在 \`packages/\` 目录下创建新包
2. 在根目录 \`pnpm-workspace.yaml\` 已配置自动识别
3. 在主应用 \`package.json\` 中添加依赖：\`"包名": "workspace:*"\`

## 扩展命令

| 命令 | 说明 |
|------|------|
| \`pnpm dev\` | 启动开发服务器 |
| \`pnpm build\` | 构建生产版本 |
| \`pnpm preview\` | 预览构建结果 |
| \`pnpm lint\` | 代码检查 |
| \`pnpm lint:fix\` | 自动修复代码问题 |
| \`pnpm format\` | 格式化代码 |
| \`pnpm type-check\` | TypeScript 类型检查 |
`;
  } else if (projectType === 'vue') {
    const styleExt = context?.styleType === 'scss' ? 'scss' : context?.styleType === 'less' ? 'less' : 'css';
    const hasPinia = context?.stateManager !== 'none';
    const httpClientName = context?.httpClient === 'axios' ? 'Axios' : 
                           context?.httpClient === 'fetch' ? 'Fetch' : null;
    
    readmeContent += `一个基于 Vue 3 + TypeScript + Vite 构建的现代化前端项目。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 |
| 语言 | TypeScript 5 |
| 构建 | Vite 5 |
| 路由 | Vue Router 4 |
| 样式 | ${styleExt.toUpperCase()}${styleExt !== 'css' ? ' (CSS 预处理器)' : ''} |
| 代码规范 | ESLint 9 + Prettier |
| 包管理 | pnpm (Monorepo) |${hasPinia ? `\n| 状态管理 | Pinia |` : ''}${httpClientName ? `\n| HTTP 请求 | ${httpClientName} |` : ''}

## 目录结构

\`\`\`
${projectName}/
├── src/                    # 主应用源码
│   ├── api/                # API 请求${httpClientName ? `
│   │   └── request.ts      # HTTP 请求封装` : ''}
│   ├── components/         # 通用组件
│   │   └── Layout/         # 布局组件
│   ├── pages/              # 页面组件
│   │   ├── Home.vue        # 首页
│   │   └── About.vue       # 关于页
│   ├── router/             # 路由配置
│   │   └── index.ts        # 路由定义
│   ├── stores/             # Pinia 状态管理
│   │   └── counter.ts      # 示例 Store
│   ├── utils/              # 工具函数
│   ├── types/              # TypeScript 类型定义
│   ├── App.vue             # 根组件
│   ├── main.ts             # 入口文件
│   └── vite-env.d.ts       # Vite 类型声明
├── packages/               # Monorepo 子包
│   ├── shared/             # 共享工具库
│   │   └── src/
│   │       └── index.ts    # 工具函数导出
│   └── ui/                 # UI 组件库
│       └── src/
│           ├── index.ts    # 组件导出
│           └── components/ # Vue 组件
├── public/                 # 静态资源
├── index.html              # HTML 模板
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── eslint.config.js        # ESLint 配置 (Flat Config)
├── pnpm-workspace.yaml     # pnpm 工作区配置
└── package.json
\`\`\`${context?.httpClient && context.httpClient !== 'none' ? `

## HTTP 请求

项目封装了 HTTP 请求，位于 \`src/api/request.ts\`。

### 使用示例

\`\`\`typescript
import { http } from './api/request';

// GET 请求
const data = await http.get<UserInfo>('/user/info');

// POST 请求
const result = await http.post<Response>('/user/login', { username, password });

// PUT 请求
await http.put('/user/profile', { name: 'John' });

// DELETE 请求
await http.delete('/user/123');
\`\`\`
` : ''}

## 快速开始

### 安装依赖

\`\`\`bash
pnpm install
\`\`\`

### 开发

\`\`\`bash
pnpm dev
\`\`\`

访问 http://localhost:3000 查看应用。

### 构建

\`\`\`bash
pnpm build
\`\`\`

### 预览构建结果

\`\`\`bash
pnpm preview
\`\`\`

### 代码检查

\`\`\`bash
# 检查代码规范
pnpm lint

# 自动修复
pnpm lint:fix
\`\`\`

## Monorepo 使用

本项目采用 pnpm workspace 管理 monorepo 结构。

### 引用内部包

\`\`\`typescript
// 使用 shared 包的工具函数
import { formatDate, sleep } from 'shared';

// 使用 ui 包的组件
import { MyButton } from 'ui';
\`\`\`

### 添加新包

1. 在 \`packages/\` 目录下创建新包
2. 在根目录 \`pnpm-workspace.yaml\` 已配置自动识别
3. 在主应用 \`package.json\` 中添加依赖：\`"包名": "workspace:*"\`

## 扩展命令

| 命令 | 说明 |
|------|------|
| \`pnpm dev\` | 启动开发服务器 |
| \`pnpm build\` | 构建生产版本 |
| \`pnpm preview\` | 预览构建结果 |
| \`pnpm lint\` | 代码检查 |
| \`pnpm lint:fix\` | 自动修复代码问题 |
| \`pnpm format\` | 格式化代码 |
| \`pnpm type-check\` | TypeScript 类型检查 |
`;
  } else {
    // Library 项目
    readmeContent += `一个 TypeScript 库项目。

## 技术栈

| 类别 | 技术 |
|------|------|
| 语言 | TypeScript 5 |
| 构建 | TypeScript Compiler |
| 代码规范 | ESLint 9 + Prettier |
| 测试 | Jest |

## 目录结构

\`\`\`
${projectName}/
├── src/                    # 源码目录
│   ├── index.ts            # 入口文件
│   └── utils/              # 工具函数
├── dist/                   # 构建输出
│   ├── index.js            # JavaScript 输出
│   └── index.d.ts          # 类型声明
├── tests/                  # 测试文件
├── tsconfig.json           # TypeScript 配置
├── eslint.config.js        # ESLint 配置 (Flat Config)
└── package.json
\`\`\`

## 安装

\`\`\`bash
npm install ${projectName}
# 或
pnpm add ${projectName}
\`\`\`

## 使用

\`\`\`typescript
import { hello } from '${projectName}';

console.log(hello('World'));
\`\`\`

## 开发

\`\`\`bash
# 安装依赖
pnpm install

# 构建
pnpm build

# 开发模式 (监听文件变化)
pnpm dev

# 运行测试
pnpm test

# 代码检查
pnpm lint
\`\`\`

## 发布

1. 更新版本号：\`npm version patch|minor|major\`
2. 构建：\`pnpm build\`
3. 发布：\`npm publish\`

## 扩展命令

| 命令 | 说明 |
|------|------|
| \`pnpm build\` | 构建库 |
| \`pnpm dev\` | 开发模式 (监听) |
| \`pnpm test\` | 运行测试 |
| \`pnpm lint\` | 代码检查 |
| \`pnpm lint:fix\` | 自动修复代码问题 |
| \`pnpm format\` | 格式化代码 |
`;
  }

  readmeContent += `\n## License\n\nMIT`;

  await fs.writeFile(path.join(projectPath, 'README.md'), readmeContent, 'utf-8');
}
