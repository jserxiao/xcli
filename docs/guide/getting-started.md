# 快速开始

## 安装

### 全局安装

```bash
npm install -g xcli
```

### 使用 npx（无需安装）

```bash
npx xcli init my-project
```

## 创建项目

### 交互式创建

运行以下命令，按照提示选择配置：

```bash
xcli init my-project
# 或使用缩写
xcli i my-project
```

交互式流程会询问：

1. **项目名称** - 你的项目名称
2. **项目描述** - 项目简介
3. **作者** - 作者名称
4. **项目类型** - 选择 library / react / vue
5. **样式预处理器** - 选择 css / less / scss（仅 React/Vue）
6. **状态管理** - 选择状态管理方案（仅 React/Vue）
7. **HTTP 请求库** - 选择 axios / fetch / none（仅 React/Vue）
8. **包管理器** - 选择 pnpm / npm / yarn
9. **插件选择** - 选择需要的插件
10. **VSCode 配置** - 是否创建 .vscode 配置
11. **Git 初始化** - 是否初始化 Git 仓库
12. **依赖安装** - 是否立即安装依赖

### 使用默认配置

跳过交互式询问，使用默认配置快速创建：

```bash
xcli i my-project -d
```

### 指定选项

```bash
# 指定项目类型
xcli i my-project -t react

# 指定样式预处理器
xcli i my-project -s scss

# 指定状态管理
xcli i my-project -m redux

# 指定包管理器
xcli i my-project -p npm

# 组合使用
xcli i my-project -t react -s scss -m redux -p pnpm -d
```

## 命令行选项

| 选项 | 简写 | 说明 |
|------|------|------|
| `--template <name>` | `-t` | 项目类型：`library` / `react` / `vue` |
| `--style <type>` | `-s` | 样式预处理器：`css` / `less` / `scss` |
| `--state-manager <type>` | `-m` | 状态管理：`none` / `redux` / `mobx` / `pinia` |
| `--http-client <type>` | `-h` | HTTP 请求库：`axios` / `fetch` / `none` |
| `--package-manager <name>` | `-p` | 包管理器：`pnpm` / `npm` / `yarn` |
| `--skip-install` | `-si` | 跳过依赖安装 |
| `--skip-git` | `-sg` | 跳过 Git 初始化 |
| `--default` | `-d` | 使用默认配置 |

## 状态管理

React/Vue 项目可选择状态管理方案：

### React 项目

| 选项 | 说明 |
|------|------|
| `redux` | Redux Toolkit - React 官方推荐，类型安全（默认） |
| `mobx` | MobX - 简单可扩展的状态管理 |
| `none` | 不使用状态管理 |

**Redux Toolkit 特性**：
- 开箱即用的最佳实践配置
- 内置 Immer 不可变状态处理
- 支持 `createAsyncThunk` 异步 action
- 类型安全的 hooks (`useAppDispatch`, `useAppSelector`)
- 开发环境 Redux DevTools 支持

**MobX 特性**：
- 响应式编程，自动追踪依赖
- 简单直观的 API，学习成本低
- 使用 `mobx-react-lite` 轻量级集成
- 支持 `observer` 自动响应状态变化

```bash
# React + Redux Toolkit（默认）
xcli i my-app -t react -d

# React + MobX
xcli i my-app -t react -m mobx -d

# React 无状态管理
xcli i my-app -t react -m none -d
```

### Vue 项目

| 选项 | 说明 |
|------|------|
| `pinia` | Pinia - Vue 官方状态管理（默认） |
| `none` | 不使用状态管理 |

**Pinia 特性**：
- Vue 3 官方推荐，完整的 TypeScript 支持
- Composition API 风格，与 Vue 3 完美契合
- 支持 DevTools 调试
- 轻量级，无 mutations，只有 state、getters、actions

```bash
# Vue + Pinia（默认）
xcli i my-app -t vue -d

# Vue 无状态管理
xcli i my-app -t vue -m none -d
```

## HTTP 请求库

React/Vue 项目可选择 HTTP 请求库：

| 选项 | 说明 |
|------|------|
| `axios` | 功能丰富的 HTTP 客户端，支持拦截器、取消请求等（默认） |
| `fetch` | 原生 API 封装，轻量无依赖 |
| `none` | 不使用 HTTP 请求库 |

```bash
# 使用 Axios（默认）
xcli i my-app -t react -d

# 使用 Fetch
xcli i my-app -t react -h fetch -d

# 不使用 HTTP 请求库
xcli i my-app -t react -h none -d
```

生成的封装文件位于 `src/api/request.ts`，提供统一的请求接口。

## 项目启动

创建项目后，进入项目目录并启动开发服务器：

### React / Vue 项目

```bash
cd my-project
pnpm dev        # 启动开发服务器
pnpm build      # 构建生产版本
pnpm preview    # 预览生产版本
```

### Library 项目

```bash
cd my-project
pnpm build      # 构建库
```

## 下一步

- 了解 [项目模板](/guide/templates) 的详细结构
- 查看 [命令参考](/commands/init)
- 了解 [插件系统](/plugins/overview)
