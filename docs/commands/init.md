# init 命令

`init` 命令用于初始化一个新的 TypeScript 项目。

## 基本用法

```bash
xcli init [projectName] [options]
# 或使用缩写
xcli i [projectName] [options]
```

## 参数

| 参数 | 必填 | 说明 |
|------|------|------|
| `projectName` | 否 | 项目名称，不提供则在当前目录初始化 |

## 选项

| 选项 | 简写 | 默认值 | 说明 |
|------|------|--------|------|
| `--template <name>` | `-t` | `library` | 项目类型 |
| `--style <type>` | `-s` | `less` | 样式预处理器 |
| `--state-manager <type>` | `-m` | - | 状态管理方案 |
| `--http-client <type>` | `-h` | `axios` | HTTP 请求库 |
| `--monitoring <type>` | `-M` | `none` | 前端监控 SDK（仅 React/Vue） |
| `--bundler <type>` | `-b` | `vite` | 打包工具（仅 React/Vue） |
| `--package-manager <name>` | `-p` | `pnpm` | 包管理器 |
| `--skip-install` | `-si` | `false` | 跳过依赖安装 |
| `--skip-git` | `-sg` | `false` | 跳过 Git 初始化 |
| `--default` | `-d` | `false` | 使用默认配置 |

## 使用示例

### 交互式创建

```bash
# 交互式创建项目
xcli init my-project

# 在当前目录初始化
xcli init

# 使用缩写
xcli i my-project
```

### 快速创建

```bash
# 使用默认配置
xcli init my-project --default
xcli i my-project -d

# 指定 React 模板
xcli i my-project -t react -d

# 指定 Vue 模板 + Sass
xcli i my-project -t vue -s scss -d
```

### 状态管理

```bash
# React + Redux Toolkit
xcli i my-app -t react -m redux -d

# React + MobX
xcli i my-app -t react -m mobx -d

# Vue + Pinia（默认）
xcli i my-app -t vue -d
```

### 完整选项

```bash
xcli i my-project \
  -t react \
  -s scss \
  -m redux \
  -b webpack \
  -p pnpm \
  -sg \
  -si
```

## 执行流程

```
1. 获取项目配置
   ├── -d/--default: 使用默认配置
   └── 交互式: 询问用户选择

2. 检查目录
   └── 目录存在时询问是否覆盖

3. 创建项目结构
   └── 根据模板生成文件

4. 生成配置文件
   └── 根据选择的插件生成配置

5. 生成 package.json
   └── 合并依赖和脚本

6. 安装依赖
   └── 使用选定的包管理器

7. 初始化 Git
   └── git init + git add + git commit
```

## 项目类型

### library

创建一个 TypeScript 库项目。

```bash
xcli i my-lib -t library -d
```

适合开发：
- 工具库
- UI 组件库
- SDK

### react

创建一个 React 前端项目（pnpm monorepo）。

```bash
xcli i my-app -t react -s scss -d
```

包含：
- React 18 + TypeScript
- React Router 6
- Vite 或 Webpack 构建工具（可选）
- pnpm monorepo 结构
- 可选状态管理（Redux / MobX）

### vue

创建一个 Vue 3 前端项目（pnpm monorepo）。

```bash
xcli i my-app -t vue -s less -d
```

包含：
- Vue 3 + TypeScript
- Vue Router 4
- Vite 或 Webpack 构建工具（可选）
- pnpm monorepo 结构
- Pinia 状态管理（默认集成）

## 状态管理

### React 项目

| 选项 | 说明 |
|------|------|
| `redux` | Redux Toolkit - 官方推荐，类型安全（默认） |
| `mobx` | MobX - 简单直观，响应式编程 |
| `none` | 不使用状态管理 |

**Redux Toolkit 特性**：
- 开箱即用的最佳实践配置
- 内置 Immer 不可变状态处理
- 支持 `createAsyncThunk` 异步 action
- 开发环境 Redux DevTools 支持
- 类型安全的 hooks (`useAppDispatch`, `useAppSelector`)

### Vue 项目

| 选项 | 说明 |
|------|------|
| `pinia` | Pinia - Vue 官方状态管理（默认） |
| `none` | 不使用状态管理 |

## HTTP 请求库

React/Vue 项目可选择 HTTP 请求库：

| 选项 | 说明 |
|------|------|
| `axios` | 功能丰富的 HTTP 客户端，支持拦截器、取消请求等（默认） |
| `fetch` | 原生 API 封装，轻量无依赖 |
| `none` | 不使用 HTTP 请求库 |

**Axios 特性**：
- 请求/响应拦截器
- 自动转换 JSON
- 取消请求支持
- 客户端防护（XSRF）
- 统一错误处理
- 封装文件位于 `src/api/request.ts`

**Fetch 特性**：
- 原生浏览器 API，无额外依赖
- 超时控制
- 统一请求接口封装
- 轻量级方案
- 封装文件位于 `src/api/request.ts`

```bash
# 使用 Axios（默认）
xcli i my-app -t react -d

# 使用 Fetch
xcli i my-app -t react --http-client fetch -d

# 不使用 HTTP 请求库
xcli i my-app -t react -h none -d
```

## 前端监控 SDK

React/Vue 项目可选择集成前端监控 SDK：

| 选项 | 说明 |
|------|------|
| `none` | 不集成监控（默认） |
| `xstat` | @jserxiao/xstat - 前端性能监控 SDK |

### XStat 监控特性

集成 `@jserxiao/xstat` SDK，提供全方位的前端监控能力：

- 📊 **性能监控** - 页面加载性能、资源加载时间、FP/FCP 等核心指标
- 🐛 **错误监控** - JavaScript 错误、Promise 错误、资源加载错误
- 🌐 **请求监控** - Fetch/XHR 请求拦截，自动上报请求耗时和错误
- 🖱️ **行为监控** - 用户点击、路由切换等行为追踪

### 打包工具兼容性

监控 SDK 自动适配不同的打包工具：

| 打包工具 | 环境变量访问方式 | 说明 |
|---------|-----------------|------|
| **Vite** | `import.meta.env.*` | 现代 ES 模块方式 |
| **Webpack** | `process.env.*` | 传统 Node.js 方式 |
| **Rollup** | `import.meta.env.*` | 与 Vite 一致 |

### React 项目集成

React 项目使用 **Error Boundary** 捕获组件错误：

```tsx
// src/main.tsx
import { initXStat, ReactErrorBoundary } from './utils/monitoring';

// 初始化监控
initXStat({
  appId: import.meta.env.VITE_APP_ID || 'your-app-id',  // Vite 使用 import.meta.env
  // appId: process.env.APP_ID || 'your-app-id',        // Webpack 使用 process.env
  env: import.meta.env.MODE,
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReactErrorBoundary>
      <App />
    </ReactErrorBoundary>
  </React.StrictMode>,
);
```

**React 错误处理特点**：
- 使用 `ReactErrorBoundary` 类组件包裹应用
- 捕获渲染错误、生命周期错误
- 自动上报错误信息和组件栈
- 提供降级 UI 展示

### Vue 项目集成

Vue 项目使用 **全局错误处理器** 捕获错误：

```ts
// src/main.ts
import { initXStat, vueErrorHandler } from './utils/monitoring';

// 初始化监控
initXStat({
  appId: import.meta.env.VITE_APP_ID || 'your-app-id',  // Vite 使用 import.meta.env
  // appId: process.env.APP_ID || 'your-app-id',        // Webpack 使用 process.env
  env: import.meta.env.MODE,
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
});

const app = createApp(App);

// 配置 Vue 错误处理
app.config.errorHandler = vueErrorHandler;

app.use(router);
app.mount('#app');
```

**Vue 错误处理特点**：
- 使用 `app.config.errorHandler` 全局捕获
- 捕获组件渲染错误、事件处理器错误
- 自动获取组件名称和错误信息
- 支持异步错误追踪

### 手动上报

在业务代码中可以手动上报自定义事件或错误：

```ts
import { reportEvent, reportError } from './utils/monitoring';

// 上报自定义事件
reportEvent('user_action', {
  action: 'click_buy_button',
  productId: '12345',
});

// 手动上报错误
try {
  riskyOperation();
} catch (error) {
  reportError(error, { extra: 'context' });
}
```

### 使用示例

```bash
# 集成监控 SDK
xcli i my-app -t react --monitoring xstat -d

# 不集成监控（默认）
xcli i my-app -t react -d
```

## 打包工具

React/Vue 项目可选择打包工具：

| 选项 | 说明 |
|------|------|
| `vite` | 下一代前端构建工具，极速开发体验（默认） |
| `webpack` | 功能强大的模块打包工具 |

### Vite 特性

- ⚡ **极速冷启动** - 利用原生 ES 模块，无需打包
- 🔥 **即时热更新** - 模块热替换 (HMR)
- 📦 **优化的构建** - 基于 Rollup 的生产构建
- 🌐 **浏览器兼容** - Legacy 插件支持老旧浏览器

### Webpack 特性

- 🔥 **热模块替换 (HMR)** - 开发时实时更新
- 📦 **代码分割** - 自动拆分代码优化加载
- 🎨 **CSS 提取** - 独立 CSS 文件，优化加载
- 📊 **打包分析** - 支持 Bundle Analyzer

```bash
# 使用 Vite（默认）
xcli i my-app -t react -d

# 使用 Webpack
xcli i my-app -t react -b webpack -d
```

---

## 样式预处理器

| 类型 | 适用场景 |
|------|----------|
| `less` | Less 预处理器，简洁语法（默认） |
| `css` | 原生 CSS，无需编译 |
| `scss` | Sass/SCSS，功能强大 |

## 包管理器

| 管理器 | 说明 |
|--------|------|
| `pnpm` | 高效磁盘利用，推荐用于 monorepo（默认） |
| `npm` | Node.js 默认包管理器 |
| `yarn` | Facebook 开发，快速稳定 |

## VSCode 配置

初始化时会询问是否创建 VSCode 配置，选择「是」会生成 `.vscode` 目录，包含：

### 生成的文件

| 文件 | 说明 |
|------|------|
| `settings.json` | 编辑器设置（格式化、ESLint、TypeScript 等） |
| `extensions.json` | 推荐扩展列表 |
| `launch.json` | 调试配置 |

### settings.json 配置内容

根据项目类型和选择的插件，会自动配置：

- **编辑器设置**：保存时格式化、Tab 大小、换行符等
- **ESLint**：保存时自动修复、文件类型验证
- **Prettier**：使用项目配置、EditorConfig 集成
- **Stylelint**：样式文件验证（如果选择了 Stylelint）
- **TypeScript**：使用工作区 TypeScript 版本
- **项目特定**：React (Emmet)、Vue (Volar) 相关配置

### 推荐扩展

打开项目时，VSCode 会提示安装推荐扩展：

| 扩展 | 说明 |
|------|------|
| ESLint | 代码检查 |
| Prettier | 代码格式化 |
| EditorConfig | 编辑器配置同步 |
| Error Lens | 行内错误显示 |
| Code Spell Checker | 拼写检查 |
| TypeScript Nightly | 最新 TypeScript 支持 |

**React 项目额外推荐**：
- ES7+ React/Redux/React-Native snippets

**Vue 项目额外推荐**：
- Vue - Official (Volar)
- Vue Snippets

### 调试配置

- **React/Vue 项目**：Chrome 调试配置（连接 localhost:5173）
- **Library 项目**：Node.js 调试当前文件

## 创建后操作

```bash
cd my-project

# React / Vue 项目
pnpm dev        # 启动开发服务器
pnpm build      # 构建生产版本

# Library 项目
pnpm build      # 构建库
```
