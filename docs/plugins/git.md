# Git 工具插件

Git 工具插件帮助你规范 Git 工作流。

## Husky

Husky 是 Git Hooks 工具，在 Git 操作时自动执行脚本。

### 生成的配置

```
.husky/
├── pre-commit      # 提交前执行
└── commit-msg      # 提交信息检查
```

```bash
# .husky/pre-commit
pnpm lint
pnpm format:check
```

```bash
# .husky/commit-msg
npx --no -- commitlint --edit "$1"
```

### 自动化操作

- **提交前** - 运行 lint 和格式检查
- **提交信息** - 检查提交信息格式
- **推送前** - 运行测试（可选）

---

## Commitlint

Commitlint 检查 Git 提交信息是否符合规范。

### 生成的配置

```json
// .commitlintrc.json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "chore",
        "revert"
      ]
    ]
  }
}
```

### 提交信息格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### 提交类型

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式（不影响逻辑） |
| `refactor` | 重构代码 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `build` | 构建相关 |
| `ci` | CI 配置 |
| `chore` | 其他杂项 |
| `revert` | 回滚提交 |

### 提交示例

```bash
# 正确 ✅
git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复登录页面样式问题"
git commit -m "docs: 更新 README 文档"

# 错误 ❌
git commit -m "添加功能"
git commit -m "fix bug"
```

---

## 工作流程

### 1. 开发流程

```bash
# 1. 创建功能分支
git checkout -b feature/login

# 2. 编写代码
# ...

# 3. 提交代码（自动触发 pre-commit）
git add .
git commit -m "feat: 添加登录表单组件"

# 4. 推送代码
git push origin feature/login
```

### 2. 自动检查流程

```
git commit
    │
    ▼
pre-commit hook
    │
    ├── pnpm lint ──────► 失败则中止提交
    │
    └── pnpm format:check ► 失败则中止提交
    │
    ▼
commit-msg hook
    │
    └── commitlint ─────► 格式错误则中止提交
    │
    ▼
提交成功 ✅
```

---

## 配置说明

### 跳过检查

紧急情况下可以跳过检查：

```bash
# 跳过所有 hooks
git commit --no-verify -m "emergency fix"

# 或使用环境变量
HUSKY=0 git commit -m "emergency fix"
```

### 自定义 Hooks

在 `.husky/` 目录下添加新的 hook：

```bash
# 创建 pre-push hook
npx husky add .husky/pre-push "pnpm test"
```

### 常用 Hooks

| Hook | 触发时机 |
|------|----------|
| `pre-commit` | 提交前 |
| `commit-msg` | 提交信息验证 |
| `pre-push` | 推送前 |
| `post-merge` | 合并后 |

---

## 与 CI/CD 配合

### GitHub Actions

```yaml
name: CI

on: [push, pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm lint

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install
      - run: pnpm test
```

---

## 最佳实践

### 1. 提交粒度

- 每次提交只做一件事
- 提交粒度适中，不要太小或太大
- 确保每次提交都能独立运行

### 2. 提交信息

- 使用规范的提交格式
- 信息要清晰描述做了什么
- 复杂改动添加 body 说明

### 3. 分支策略

- `main` - 主分支，稳定版本
- `develop` - 开发分支
- `feature/*` - 功能分支
- `fix/*` - 修复分支
