# 告别重复配置！我写了一个脚手架工具，3秒搞定企业级前端项目

> 每次新项目都要配 ESLint、Prettier、Webpack...？这个工具让你一键生成开箱即用的现代化项目。

## 缘起：被配置支配的恐惧

不知道你有没有这样的经历：

新项目启动，满怀信心准备大干一场。结果第一周全在配环境——

```
.eslintrc 要配吧？.prettierrc 要配吧？
tsconfig.json 怎么配？webpack 还是 vite？
React 项目要不要 Redux？Vue 项目怎么配 Pinia？
.browserslistrc 写什么？Chrome 兼容到多少？
```

配置完一看，一周过去了。而且每次配完都有种"这次应该没问题"的虚幻感，结果跑起来全是坑。

更痛苦的是，不同项目的配置还不统一。A 项目用 ESLint 8 的旧格式，B 项目用 Flat Config；C 项目的 browserslist 和 D 项目不一样；E 项目的 Webpack 配置是从某博客复制的，F 项目的 Vite 配置是从另一篇博客复制的...

于是，**xcli** 诞生了。

## xcli 是什么？

一句话：**一个可插拔的 TypeScript 项目脚手架 CLI 工具**。

它解决的核心问题很简单——**让配置标准化、可复用、开箱即用**。

```bash
# 三秒钟，一个完整的项目
npx @jserxiao/xcli init my-app -t react -d
```

就这么简单。

## 它能做什么？

### 🎯 三种项目模板

| 模板 | 说明 | 适用场景 |
|------|------|----------|
| **Library** | TypeScript 工具库 | 开发 npm 包、工具函数库 |
| **React** | React 18 + pnpm monorepo | 中大型前端应用 |
| **Vue** | Vue 3 + pnpm monorepo | 中大型前端应用 |

### 🔌 丰富的插件生态

```
插件系统
├── 代码规范
│   ├── ESLint (Flat Config) ← ESLint 9+ 新格式
│   ├── Prettier
│   └── Stylelint
├── 构建工具
│   ├── Vite ← 默认推荐
│   ├── Webpack
│   └── Rollup
├── 测试工具
│   ├── Vitest
│   └── Jest
└── Git 工具
    ├── Husky
    └── Commitlint
```

### 🌐 统一的浏览器兼容配置

这是我特别想强调的一点。

以前做项目，CSS 前缀配一个地方，JS Polyfill 配一个地方，两边还对不上。

xcli 把所有浏览器兼容配置统一到 `.browserslistrc`：

```ini
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

然后：

- **Autoprefixer** 自动读取 → CSS 前缀
- **Babel preset-env** 自动读取 → JS Polyfill
- **Vite Legacy 插件** 自动读取 → 旧浏览器兼容

**一处配置，处处生效**。再也不用担心 CSS 和 JS 兼容性对不上了。

## 快速上手

### 交互式创建

如果你喜欢点点点的体验：

```bash
npx @jserxiao/xcli init my-project
```

然后根据提示选择：

```
? 请选择项目类型:
  ❯ React - React 前端项目 (pnpm monorepo)
    Vue - Vue 3 前端项目 (pnpm monorepo)
    Library - TypeScript 工具库

? 请选择样式预处理器:
  ❯ Less - CSS 预处理器
    CSS - 原生 CSS
    SCSS - Sass/SCSS 预处理器

? 请选择状态管理:
  ❯ Redux Toolkit - React 官方推荐状态管理
    MobX - 简单可扩展的状态管理
    无 - 不使用状态管理
```

### 命令行快速创建

如果你是熟练工，直接一把梭：

```bash
# React + Vite + Redux + SCSS
npx @jserxiao/xcli init my-app -t react -m redux -s scss -d

# Vue + Webpack + Pinia + Less
npx @jserxiao/xcli init my-app -t vue -b webpack -d

# Library 项目
npx @jserxiao/xcli init my-lib -t library -d
```

## 生成的项目长什么样？

以 React 项目为例：

```
my-app/
├── src/
│   ├── main.tsx           # 入口
│   ├── App.tsx            # 根组件
│   ├── pages/             # 页面
│   ├── components/        # 组件
│   ├── router/            # 路由
│   ├── api/               # HTTP 请求封装
│   │   └── request.ts     # Axios/Fetch 封装
│   └── store/             # 状态管理
├── packages/              # pnpm monorepo
│   ├── shared/            # 共享工具
│   └── ui/                # UI 组件库
├── vite.config.ts         # Vite 配置
├── eslint.config.js       # ESLint 9 Flat Config
├── tsconfig.json          # TypeScript 配置
├── postcss.config.js      # PostCSS 配置
├── .browserslistrc        # 浏览器兼容配置
└── pnpm-workspace.yaml    # pnpm workspace
```

**开箱即用，直接 `pnpm dev` 跑起来**。

## 一些设计理念

### 1. 配置要"活"而不是"死"

很多脚手架生成的配置是死的——复制出来什么样就什么样，想改都不行。

xcli 生成的配置都是标准的、可修改的：

```javascript
// eslint.config.js - 标准的 Flat Config 格式
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // 想加规则？直接加
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
  prettierConfig,
);
```

### 2. 跟上时代的步伐

- **ESLint 9+ Flat Config**：不是过时的 `.eslintrc.json`
- **Vite 5**：不是 Webpack 时代的配置
- **pnpm monorepo**：现代化的包管理方式
- **TypeScript 5**：最新类型系统

### 3. 约定优于配置，但不强制

默认配置覆盖 80% 的场景，剩下的 20% 你可以自己改。

不想用默认的？没问题：

```bash
# 不用 Redux？用 MobX
xcli init my-app -t react -m mobx -d

# 不用 Vite？用 Webpack
xcli init my-app -t react -b webpack -d

# 不装依赖？跳过
xcli init my-app -t react --skip-install
```

## 一个真实的例子

上周我要开一个新项目，传统的做法：

1. 找之前的项目复制配置文件
2. 改 package.json 的名字和版本
3. 改 tsconfig.json 的路径
4. 发现 ESLint 报错，改配置
5. 发现 Prettier 格式不对，改配置
6. 发现 Vite 编译报错，改配置
7. 改了半天终于能跑了
8. 总耗时：约 2 小时

用 xcli：

```bash
xcli init new-project -t react -m redux -s scss -d
cd new-project
pnpm dev
```

**总耗时：约 3 分钟**。

## 插件管理

项目建好了，后来想加插件怎么办？

```bash
# 查看可用插件
xcli plugin list

# 添加插件
xcli plugin add vitest

# 移除插件
xcli plugin remove jest
```

## 写在最后

这个工具解决的问题很小——就是帮你省去配置的时间。

但它解决的问题又很大——**让你的项目配置标准化、可维护、不踩坑**。

如果你也受够了每次新项目都要从头配置，不妨试试：

```bash
npx @jserxiao/xcli init my-project
```

如果觉得好用，欢迎 Star ⭐️

如果有问题或建议，欢迎 Issue 💬

---

**项目地址**：[GitHub](https://github.com/your-username/xcli)

**npm 包**：`@jserxiao/xcli`

**文档**：`xcli --help` 或查看项目 README
