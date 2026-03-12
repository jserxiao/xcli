# plugin 命令

`plugin` 命令用于管理项目中的插件。

## 基本用法

```bash
xcli plugin <subcommand> [options]
# 或使用简写
xcli p <subcommand> [options]
```

## 子命令

### plugin add

添加插件到当前项目。

```bash
xcli plugin add [plugins...]
xcli plugin add eslint prettier
# 简写
xcli p a eslint prettier
```

### plugin remove

从当前项目移除插件。

```bash
xcli plugin remove [plugins...]
xcli plugin remove eslint
# 简写
xcli p r eslint
```

### plugin list

列出所有可用插件。

```bash
xcli plugin list
# 简写
xcli p ls
```

## 可用插件

使用 `xcli plugin list` 查看所有可用插件：

```
代码规范:
  ○ typescript   TypeScript 支持
  ○ eslint       ESLint 代码检查
  ○ prettier     Prettier 代码格式化

构建工具:
  ○ vite         Vite 构建工具
  ○ rollup       Rollup 打包工具
  ○ webpack      Webpack 打包工具

测试工具:
  ○ jest         Jest 测试框架
  ○ vitest       Vitest 测试框架

Git 工具:
  ○ husky        Git Hooks 工具
  ○ commitlint   Git 提交信息规范
```

## 使用示例

### 添加插件

```bash
# 添加单个插件
xcli plugin add eslint

# 添加多个插件
xcli plugin add eslint prettier husky
```

### 移除插件

```bash
# 移除单个插件
xcli plugin remove eslint

# 移除多个插件
xcli plugin remove eslint prettier
```

### 查看可用插件

```bash
xcli plugin list
```

## 注意事项

1. **在项目根目录执行** - plugin 命令需要在项目根目录下执行
2. **依赖安装** - 添加插件后会自动安装相关依赖
3. **配置文件** - 插件会自动生成对应的配置文件

## 生成的配置文件

| 插件 | 配置文件 |
|------|----------|
| typescript | `tsconfig.json` |
| eslint | `.eslintrc.json` |
| prettier | `.prettierrc` |
| vite | `vite.config.ts` |
| jest | `jest.config.js` |
| vitest | `vitest.config.ts` |
| husky | `.husky/` |
| commitlint | `.commitlintrc.json` |
