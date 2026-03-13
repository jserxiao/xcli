# 插件系统概览

xcli 采用可插拔的插件架构，你可以根据项目需求选择启用不同的插件。

## 插件分类

```
插件系统
├── 代码规范
│   ├── TypeScript   - TypeScript 语言支持
│   ├── ESLint       - 代码质量检查
│   ├── Prettier     - 代码格式化
│   └── Stylelint    - 样式代码检查
│
├── 构建工具
│   ├── Vite         - 下一代前端构建工具
│   ├── Rollup       - JavaScript 模块打包器
│   └── Webpack      - 功能强大的打包工具
│
├── 测试工具
│   ├── Jest         - JavaScript 测试框架
│   └── Vitest       - Vite 原生测试框架
│
└── Git 工具
    ├── Husky        - Git Hooks 工具
    └── Commitlint   - 提交信息规范检查
```

## 默认启用的插件

使用 `--default` 参数时，默认启用以下插件：

| 插件 | 说明 |
|------|------|
| TypeScript | TypeScript 支持（强制启用） |
| ESLint | 代码检查 |
| Prettier | 代码格式化 |
| Stylelint | 样式代码检查 |
| Vite | React/Vue 项目自动启用 |

## 插件列表

### 代码规范

| 插件 | 名称 | 说明 |
|------|------|------|
| `typescript` | TypeScript | TypeScript 语言支持，生成 `tsconfig.json` |
| `eslint` | ESLint | 代码质量检查，支持 React/Vue 规则 |
| `prettier` | Prettier | 代码格式化，与 ESLint 集成 |
| `stylelint` | Stylelint | 样式代码检查，支持 Less/SCSS/CSS |

### 构建工具

| 插件 | 名称 | 说明 |
|------|------|------|
| `vite` | Vite | 下一代前端构建工具，内置 legacy 和 autoprefixer |
| `rollup` | Rollup | JavaScript 模块打包器，适合库开发 |
| `webpack` | Webpack | 功能强大的打包工具 |

### 测试工具

| 插件 | 名称 | 说明 |
|------|------|------|
| `jest` | Jest | Facebook 开发的测试框架 |
| `vitest` | Vitest | Vite 原生测试框架，速度更快 |

### Git 工具

| 插件 | 名称 | 说明 |
|------|------|------|
| `husky` | Husky | Git Hooks 工具，自动化代码检查 |
| `commitlint` | Commitlint | Git 提交信息规范检查 |

## 选择建议

### React 项目推荐

```bash
xcli init my-app -t react --default
# 包含: TypeScript, ESLint, Prettier, Stylelint, Vite
```

可选添加：
- `vitest` - 单元测试
- `husky` + `commitlint` - Git 工作流

### Vue 项目推荐

```bash
xcli init my-app -t vue --default
# 包含: TypeScript, ESLint, Prettier, Stylelint, Vite
```

### Library 项目推荐

```bash
xcli init my-lib -t library --default
# 包含: TypeScript, ESLint, Prettier
```

可选添加：
- `rollup` 或 `vite` - 构建打包
- `vitest` - 单元测试

## 插件配置

每个插件生成的配置文件：

```
my-project/
├── tsconfig.json        # TypeScript
├── .eslintrc.json       # ESLint
├── .prettierrc          # Prettier
├── .stylelintrc.json    # Stylelint
├── .stylelintignore     # Stylelint 忽略文件
├── vite.config.ts       # Vite
├── vitest.config.ts     # Vitest
├── jest.config.js       # Jest
├── .husky/              # Husky
│   ├── pre-commit
│   └── commit-msg
└── .commitlintrc.json   # Commitlint
```

## 下一步

- [代码规范插件](/plugins/linting) - TypeScript、ESLint、Prettier、Stylelint
- [构建工具插件](/plugins/bundler) - Vite、Rollup、Webpack
- [测试工具插件](/plugins/testing) - Jest、Vitest
- [Git 工具插件](/plugins/git) - Husky、Commitlint
