# xcli

一个可插拔的 TypeScript 项目脚手架 CLI 工具，让你快速搭建现代化的 TypeScript 项目。

## 特性

- 🚀 **快速初始化** - 一键创建完整的 TypeScript 项目结构
- 🔌 **可插拔配置** - 自由选择需要的工具和配置
- 📦 **丰富的插件** - 内置多种常用开发工具配置
- 🎯 **开箱即用** - 生成的项目可直接投入开发

## 安装

```bash
# 全局安装
npm install -g xcli

# 或使用 npx
npx xcli init my-project
```

## 使用

### 初始化项目

```bash
# 交互式创建项目
xcli init my-project

# 使用默认配置创建项目
xcli init my-project --default

# 指定包管理器
xcli init my-project -p pnpm

# 跳过依赖安装
xcli init my-project --skip-install

# 跳过 Git 初始化
xcli init my-project --skip-git
```

### 管理插件

```bash
# 查看所有可用插件
xcli plugin list

# 添加插件
xcli plugin add eslint prettier

# 移除插件
xcli plugin remove eslint
```

### 升级 CLI

```bash
# 检查是否有更新
xcli upgrade --check

# 升级到最新版本
xcli upgrade

# 查看当前版本
xcli version
```

## 可用插件

### 代码检查
- **ESLint** - JavaScript/TypeScript 代码检查工具

### 代码格式化
- **Prettier** - 代码格式化工具

### 测试框架
- **Jest** - JavaScript 测试框架
- **Vitest** - 下一代测试框架（更快、兼容 Vite）

### Git 工具
- **Husky + lint-staged** - Git Hooks 和代码提交前自动检查
- **Commitlint** - Git 提交信息规范检查

### 构建打包
- **Vite** - 下一代前端构建工具
- **Webpack** - 模块打包工具
- **Rollup** - JavaScript 模块打包器

### 其他
- **TypeScript** - TypeScript 编译配置（默认启用）

## 项目结构

使用 xcli 创建的项目结构：

```
my-project/
├── src/
│   └── index.ts          # 入口文件
├── dist/                  # 编译输出
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

根据选择的插件，还会生成相应的配置文件：

```
my-project/
├── .eslintrc.json        # ESLint 配置
├── .prettierrc           # Prettier 配置
├── jest.config.js        # Jest 配置
├── vitest.config.ts      # Vitest 配置
├── vite.config.ts        # Vite 配置
├── webpack.config.js     # Webpack 配置
├── rollup.config.mjs     # Rollup 配置
├── .husky/               # Git Hooks
│   └── pre-commit
├── .commitlintrc.json    # Commitlint 配置
└── ...
```

## 开发

```bash
# 克隆仓库
git clone https://github.com/your-username/xcli.git

# 安装依赖
npm install

# 编译
npm run build

# 运行
node dist/index.js init test-project
```

## License

MIT
