# upgrade 命令

`upgrade` 命令用于检测并升级 xcli 到最新版本。

## 基本用法

```bash
xcli upgrade [options]
# 或使用简写
xcli up [options]
```

## 选项

| 选项 | 简写 | 说明 |
|------|------|------|
| `--check` | `-c` | 仅检查是否有更新，不执行升级 |
| `--tag <tag>` | `-t` | 指定升级到的标签 (latest/next/beta等) |
| `--help` | `-h` | 显示帮助信息 |

## 使用示例

### 检查更新

检查是否有新版本可用，但不执行升级：

```bash
xcli upgrade --check
# 或
xcli up -c
```

输出示例：

```
📦 xcli 版本信息
──────────────────────────────
  当前版本: v1.0.13
  最新版本: v1.0.14

🎉 发现新版本!

运行 `xcli upgrade` 来升级到最新版本
```

### 升级到最新版本

```bash
xcli upgrade
# 或
xcli up
```

输出示例：

```
📦 xcli 版本信息
──────────────────────────────
  当前版本: v1.0.13
  最新版本: v1.0.14

🎉 发现新版本!

开始升级...
正在升级 @jserxiao/xcli@latest...
✓ 升级成功: @jserxiao/xcli@latest

查看更新日志:
  https://github.com/jserxiao/xcli/releases
```

### 升级到特定标签版本

如果你想要升级到 beta 或 next 等预发布版本：

```bash
# 升级到 beta 版本
xcli upgrade --tag beta

# 升级到 next 版本
xcli upgrade -t next
```

## version 命令

查看当前安装的 xcli 版本信息：

```bash
xcli version
# 或
xcli v
```

输出示例：

```
📦 xcli 版本信息
──────────────────────────────
  版本:     v1.0.13
  包名:     @jserxiao/xcli
```

## 工作原理

1. **版本检测**: 通过 `npm view` 命令获取 npm 上最新版本号
2. **版本比较**: 比较当前版本和最新版本，判断是否需要更新
3. **执行升级**: 使用 `npm install -g` 全局安装最新版本

## 注意事项

1. **全局安装**: `upgrade` 命令适用于全局安装的 xcli
2. **网络要求**: 需要 npm 能够正常访问网络
3. **权限问题**: 在某些系统上可能需要管理员权限执行全局安装
4. **npx 用户**: 如果使用 npx 运行 xcli，每次都会自动使用最新版本，无需手动升级

## 相关链接

- [更新日志](https://github.com/jserxiao/xcli/releases)
- [npm 包页面](https://www.npmjs.com/package/@jserxiao/xcli)
