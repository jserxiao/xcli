# 我花了两周时间，把团队项目初始化时间从2小时压缩到3分钟

> 一个真实的前端工程化实践：从复制粘贴到一键生成，xcli 解决了什么问题，又是如何设计的。

## 前言：一个重复了 N 次的痛苦

作为团队的前端负责人，我每个月至少要开 2-3 个新项目。

每次新项目启动，流程都惊人的相似：

1. 打开之前的某个项目
2. 复制 `.eslintrc`、`.prettierrc`、`tsconfig.json` ...
3. 改改改，适配新项目
4. 跑起来，报错
5. 查文档、改配置、再跑
6. 循环 3-5 步若干次
7. 终于能跑了，一看时间：2小时过去了

更可怕的是，半年后发现：

- A 项目的 ESLint 还是 8.x 的旧格式
- B 项目的 browserslist 配的是 `> 1%`，C 项目配的是 `last 2 versions`
- D 项目的 Webpack 是从某博客复制的，E 项目的 Vite 是从另一篇博客复制的
- 每个项目的目录结构都不一样，新人入职一脸懵

**配置碎片化，成了团队最大的技术债。**

于是，我决定写一个工具，彻底解决这个问题。

---

## 先看一下效果

### 以前：2小时的痛苦

```bash
# 第1步：创建目录
mkdir my-project && cd my-project

# 第2步：初始化 package.json
npm init -y

# 第3步：安装 TypeScript
npm install -D typescript
npx tsc --init
# 然后手动改 tsconfig.json ...

# 第4步：安装 ESLint
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
# 然后创建 .eslintrc.json，配置规则 ...

# 第5步：安装 Prettier
npm install -D prettier eslint-config-prettier
# 然后创建 .prettierrc ...

# 第6步：安装 Vite
npm install -D vite @vitejs/plugin-react
# 然后创建 vite.config.ts ...

# 第7步：配置 browserslist
# 创建 .browserslistrc，写兼容配置 ...

# 第8步：配置 PostCSS
npm install -D postcss autoprefixer
# 创建 postcss.config.js ...

# ... 此处省略 20 步

# 第 N 步：终于跑起来了
npm run dev
```

**耗时：约 2 小时**

### 现在：3分钟的优雅

```bash
npx @jserxiao/xcli init my-project -t react -d
cd my-project
pnpm dev
```

**耗时：约 3 分钟**

---

## xcli 是什么？

**xcli** 是一个可插拔的 TypeScript 项目脚手架 CLI 工具。

它的核心理念：**配置标准化、可复用、开箱即用**。

```bash
# 全局安装
npm install -g @jserxiao/xcli

# 或者直接用 npx
npx @jserxiao/xcli init my-project
```

---

## 核心功能详解

### 1. 三种项目模板

根据实际业务场景，我设计了三种模板：

#### 📦 Library 模板

适合开发 npm 包、工具函数库。

```
my-lib/
├── src/
│   └── index.ts          # 入口文件
├── dist/                 # 编译输出
├── package.json
├── tsconfig.json
└── README.md
```

**特性**：
- TypeScript 5 严格模式
- 同时输出 ESM + CJS 格式
- 自动生成类型声明

#### ⚛️ React 模板

基于 **pnpm monorepo** 的企业级前端项目。

```
my-app/
├── src/                    # 主应用源码
│   ├── main.tsx
│   ├── App.tsx
│   ├── pages/              # 页面
│   ├── components/         # 组件
│   ├── router/             # 路由
│   ├── api/                # HTTP 请求
│   │   └── request.ts      # Axios/Fetch 封装
│   └── store/              # 状态管理
│       ├── index.ts
│       ├── counterSlice.ts
│       └── middleware/
├── packages/               # pnpm workspace
│   ├── shared/             # 共享工具库
│   └── ui/                 # UI 组件库
├── vite.config.ts          # Vite 配置
├── eslint.config.js        # ESLint Flat Config
├── tsconfig.json
├── postcss.config.js
├── .browserslistrc         # 浏览器兼容
└── pnpm-workspace.yaml
```

**状态管理可选**：
- Redux Toolkit（推荐）
- MobX
- 无

**HTTP 请求可选**：
- Axios（带完整封装）
- Fetch（原生 API 封装）
- 无

#### 💚 Vue 模板

同样是 pnpm monorepo 结构，默认集成 Pinia。

```
my-vue-app/
├── src/
│   ├── main.ts
│   ├── App.vue
│   ├── pages/
│   ├── components/
│   ├── router/
│   ├── api/
│   └── store/              # Pinia 状态管理
├── packages/
│   ├── shared/
│   └── ui/
└── ...配置文件
```

---

### 2. 丰富的插件系统

```
插件系统
├── 代码规范
│   ├── ESLint 9 (Flat Config) ⭐ 最新格式
│   ├── Prettier
│   └── Stylelint (支持 CSS/Less/SCSS)
│
├── 构建工具
│   ├── Vite 5 ⭐ 默认推荐
│   ├── Webpack 5
│   └── Rollup
│
├── 测试工具
│   ├── Vitest ⭐ Vite 原生
│   └── Jest
│
└── Git 工具
    ├── Husky (Git Hooks)
    └── Commitlint (提交规范)
```

每个插件都是**独立、可插拔**的。你可以选择需要的，跳过不需要的。

---

### 3. 浏览器兼容性：一处配置，处处生效

这是我最想重点介绍的功能。

#### 以前的问题

CSS 前缀和 JS Polyfill 分开配置，经常对不上：

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ['last 2 versions']  // 这里
    }
  }
}

// babel.config.js
module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: { browsers: ['> 1%'] }  // 和这里不一致！
    }]
  ]
}
```

**结果**：CSS 兼容 Chrome 70，JS 兼容 Chrome 60，乱套了。

#### xcli 的解决方案

统一使用 `.browserslistrc`：

```ini
# .browserslistrc
[production]
> 0.5%
last 2 versions
not dead
not IE 11
Chrome >= 86    # 明确指定 Chrome 86+

[development]
last 1 chrome version
last 1 firefox version
last 1 safari version
```

然后所有工具自动读取：

| 工具 | 作用 | 配置方式 |
|------|------|----------|
| **Autoprefixer** | 添加 CSS 前缀 | 自动读取 `.browserslistrc` |
| **Babel preset-env** | JS Polyfill | 自动读取 `.browserslistrc` |
| **Vite Legacy** | 旧浏览器兼容 | 自动读取 `.browserslistrc` |

**一处配置，处处生效**。再也不用操心兼容性问题。

---

### 4. ESLint 9 Flat Config

很多脚手架还在用 ESLint 8 的 `.eslintrc.json` 格式，xcli 直接上了 **ESLint 9+ Flat Config**。

#### 旧格式（ESLint 8）

```json
// .eslintrc.json
{
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "env": {
    "node": true
  }
}
```

问题：
- 多个配置文件（`.eslintrc` + `.eslintignore`）
- 配置格式不统一
- 插件加载顺序容易出问题

#### 新格式（ESLint 9 Flat Config）

```javascript
// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  prettierConfig,
);
```

优势：
- ✅ 单一配置文件
- ✅ JavaScript 原生数组操作，可扩展性更强
- ✅ 显式导入，没有隐式依赖
- ✅ 性能更好

---

## 实战演示

### 场景 1：快速启动一个 React 项目

```bash
# 交互式创建
npx @jserxiao/xcli init my-react-app

# 然后根据提示选择：
# ? 项目类型: React
# ? 样式预处理器: Less
# ? 状态管理: Redux Toolkit
# ? HTTP 请求库: Axios
# ? 打包工具: Vite
# ? 创建 VSCode 配置: Yes
```

或者直接命令行一把梭：

```bash
npx @jserxiao/xcli init my-react-app \
  -t react \
  -s less \
  -m redux \
  -h axios \
  -b vite \
  -d
```

生成的项目结构：

```
my-react-app/
├── src/
│   ├── main.tsx              # React 18 入口
│   ├── App.tsx               # 根组件
│   ├── pages/
│   │   ├── Home.tsx          # 首页（带 Redux 示例）
│   │   └── About.tsx         # 关于页
│   ├── components/
│   │   └── Layout.tsx        # 布局组件
│   ├── router/
│   │   └── index.tsx         # React Router 6
│   ├── api/
│   │   └── request.ts        # Axios 封装（含拦截器）
│   ├── store/
│   │   ├── index.ts          # Store 配置
│   │   ├── counterSlice.ts   # Counter 示例
│   │   ├── apiSlice.ts       # RTK Query
│   │   └── middleware/
│   │       └── logger.ts     # 日志中间件
│   └── assets/
├── packages/
│   ├── shared/               # 共享工具函数
│   │   └── src/
│   │       └── index.ts
│   └── ui/                   # UI 组件库
│       └── src/
│           └── index.ts
├── public/
├── vite.config.ts            # Vite 5 配置
├── eslint.config.js          # ESLint 9 Flat Config
├── tsconfig.json             # TypeScript 5
├── postcss.config.js         # PostCSS + Autoprefixer
├── .browserslistrc           # 浏览器兼容
├── .prettierrc
├── pnpm-workspace.yaml
└── package.json
```

直接运行：

```bash
cd my-react-app
pnpm install
pnpm dev
```

打开浏览器，一个完整的 React 项目已经跑起来了：

- ✅ React 18 + TypeScript 5
- ✅ React Router 6
- ✅ Redux Toolkit（含 RTK Query）
- ✅ Axios 封装
- ✅ Vite 5 + HMR
- ✅ ESLint 9 + Prettier
- ✅ pnpm monorepo

**总耗时：3 分钟**

---

### 场景 2：企业级 Vue 项目

```bash
npx @jserxiao/xcli init my-vue-app \
  -t vue \
  -s scss \
  -b webpack \
  -d
```

注意这里用了 **Webpack** 而不是 Vite。

为什么？因为有些企业项目需要：
- 更细粒度的构建控制
- 复杂的 loader 配置
- 特定的优化策略

xcli 的 Webpack 配置包含：

```javascript
// webpack.config.cjs 节选
module.exports = (env, argv) => {
  return {
    // ...
    module: {
      rules: [
        // Babel：自动读取 .browserslistrc
        {
          test: /\.[jt]sx?$/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  useBuiltIns: 'usage',  // 按需 Polyfill
                  corejs: 3,
                }],
                '@babel/preset-typescript',
              ],
            },
          },
        },
        // CSS + PostCSS
        {
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',  // Autoprefixer
          ],
        },
      ],
    },
    // 代码分割
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
          },
        },
      },
    },
  };
};
```

---

### 场景 3：开发一个 npm 工具库

```bash
npx @jserxiao/xcli init my-utils -t library -d
```

生成的 Library 项目：

```
my-utils/
├── src/
│   └── index.ts          # 入口文件
├── dist/                 # ESM + CJS 输出
├── package.json
├── tsconfig.json
├── rollup.config.ts      # Rollup 配置
└── README.md
```

`package.json` 自动配置：

```json
{
  "name": "my-utils",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.cjs",
  "module": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w"
  }
}
```

直接发布到 npm：

```bash
pnpm build
npm publish
```

---

## 技术细节：xcli 是如何设计的？

### 插件架构

每个插件都是一个独立的对象：

```typescript
export const vitePlugin: Plugin = {
  name: 'vite',
  displayName: 'Vite',
  description: '下一代前端构建工具',
  category: 'bundler',
  defaultEnabled: true,
  devDependencies: {
    vite: '^5.0.0',
    '@vitejs/plugin-react': '^4.0.0',
    '@vitejs/plugin-legacy': '^5.0.0',
  },
  scripts: {
    dev: 'vite',
    build: 'vite build',
    preview: 'vite preview',
  },
  files: [
    {
      path: 'vite.config.ts',
      content: (context) => getViteConfig(context),
    },
  ],
};
```

**好处**：
- 插件之间完全解耦
- 可以独立更新某个插件
- 社区可以自定义插件

### 模板系统

模板负责生成项目结构：

```typescript
export const reactTemplate = {
  type: 'react',
  displayName: 'React',
  description: 'React 前端项目 (pnpm monorepo)',

  createStructure: async (projectPath, context) => {
    // 1. 创建目录结构
    // 2. 生成配置文件
    // 3. 生成源代码
    // 4. 根据选项调整（Redux/MobX、Axios/Fetch、Vite/Webpack）
  },

  getDependencies: (styleType, stateManager, httpClient, bundler) => {
    // 根据选择返回对应的依赖
    return {
      dependencies: { ... },
      devDependencies: { ... },
    };
  },
};
```

### 版本管理

所有依赖版本统一在 `versions.ts` 中管理：

```typescript
export const BUNDLER_VERSIONS = {
  vite: '^5.0.12',
  webpack: '^5.98.0',
  // ...
};

export const FRAMEWORK_VERSIONS = {
  react: '^18.2.0',
  vue: '^3.4.15',
  // ...
};
```

**好处**：
- 版本升级只需改一处
- 确保所有项目使用相同版本
- 避免版本冲突

---

## 对比：xcli vs 其他脚手架

| 特性 | xcli | create-react-app | Vite 官方模板 |
|------|------|------------------|---------------|
| TypeScript | ✅ 原生支持 | ⚠️ 需要 eject | ✅ 支持 |
| Monorepo | ✅ pnpm workspace | ❌ 不支持 | ❌ 不支持 |
| 状态管理 | ✅ 可选 Redux/MobX/Pinia | ❌ 无 | ❌ 无 |
| HTTP 封装 | ✅ 可选 Axios/Fetch | ❌ 无 | ❌ 无 |
| ESLint 9 | ✅ Flat Config | ❌ 旧格式 | ⚠️ 需手动配 |
| 浏览器兼容 | ✅ 统一配置 | ⚠️ 需手动配 | ⚠️ 需手动配 |
| 构建工具 | ✅ Vite/Webpack | ❌ 仅 Webpack | ✅ Vite |
| 插件系统 | ✅ 可插拔 | ❌ 无 | ❌ 无 |

---

## 使用建议

### 个人项目

```bash
# 快速启动，默认配置够用
xcli init my-app -t react -d
```

### 团队项目

```bash
# 明确指定每个选项，确保一致性
xcli init team-project \
  -t react \
  -s scss \
  -m redux \
  -h axios \
  -b vite \
  -d
```

建议团队制定一份 `xcli` 使用规范，确保所有项目配置统一。

### 开源库

```bash
xcli init my-lib -t library -d
```

---

## 写在最后

xcli 解决的是一个"小"问题——省去配置的时间。

但它带来的价值是"大"的：

- **时间节省**：从 2 小时到 3 分钟
- **配置标准化**：团队所有项目配置统一
- **技术债减少**：不再需要维护多份配置
- **新人友好**：降低项目启动门槛

如果你也受够了重复配置，不妨试试：

```bash
npx @jserxiao/xcli init my-project
```

**GitHub**: [github.com/your-username/xcli](https://github.com/your-username/xcli)

**npm**: `@jserxiao/xcli`

**文档**: `xcli --help`

---

## 附录：常用命令速查

```bash
# 创建项目
xcli init my-project
xcli init my-project -t react -d
xcli init my-project -t vue -d
xcli init my-lib -t library -d

# 插件管理
xcli plugin list
xcli plugin add vitest
xcli plugin remove jest

# 升级 CLI
xcli upgrade --check
xcli upgrade

# 查看版本
xcli version
```

---

**如果觉得有用，欢迎 Star ⭐️ 和分享！**

有问题或建议，欢迎在评论区交流 💬
