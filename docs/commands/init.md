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
- Vite 构建工具
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
- Vite 构建工具
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

## 创建后操作

```bash
cd my-project

# React / Vue 项目
pnpm dev        # 启动开发服务器
pnpm build      # 构建生产版本

# Library 项目
pnpm build      # 构建库
```
