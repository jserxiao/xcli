# 代码规范插件

代码规范插件帮助你保持代码质量和风格一致性。

## TypeScript

TypeScript 提供静态类型检查，提高代码质量和开发效率。

### 生成的配置

```json
// tsconfig.json (Library 项目)
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

```json
// tsconfig.json (React/Vue 项目)
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "jsx": "react-jsx",  // React 项目
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "paths": {
      "shared": ["./packages/shared/src/index.ts"],
      "ui": ["./packages/ui/src/index.ts"]
    },
    "baseUrl": "."
  }
}
```

### 添加的脚本

```json
{
  "scripts": {
    "build": "tsc",
    "type-check": "tsc --noEmit"
  }
}
```

---

## ESLint

ESLint 是 JavaScript/TypeScript 代码检查工具。xcli 使用 **ESLint 9+ Flat Config** 格式。

### 生成的配置

```javascript
// eslint.config.js (Library 项目)
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.node,
        console: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  prettierConfig,
);
```

```javascript
// eslint.config.js (React 项目)
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
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  prettierConfig,
);
```

```javascript
// eslint.config.js (Vue 项目)
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,vue}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  prettierConfig,
);
```

### 添加的依赖

| 项目类型 | 依赖包 |
|----------|--------|
| 通用 | `eslint`, `typescript-eslint`, `@eslint/js`, `eslint-config-prettier`, `globals` |
| React | 额外添加 `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh` |

### 添加的脚本

```json
{
  "scripts": {
    "lint": "eslint src",
    "lint:fix": "eslint src --fix"
  }
}
```

### Flat Config 说明

ESLint 9+ 使用 Flat Config格式，相比传统配置有以下优势：

- 📦 **单一配置文件** - 不再需要 `.eslintrc.*` 和 `.eslintignore`
- 🔧 **更好的可扩展性** - 使用 JavaScript 原生数组展开
- 🚀 **性能优化** - 更快的配置加载
- 🎯 **类型安全** - 更好的 TypeScript 支持

---

## Prettier

Prettier 是代码格式化工具，与 ESLint 配合使用。

### 生成的配置

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### 添加的脚本

```json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{ts,tsx,js,jsx,json,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,js,jsx,json,md}\""
  }
}
```

### 与 ESLint 集成

使用 `eslint-config-prettier` 关闭 ESLint 中与 Prettier 冲突的规则：

```javascript
// eslint.config.js
export default tseslint.config(
  // ... 其他配置
  prettierConfig, // 放在最后
);
```

---

## Stylelint

Stylelint 是强大的 CSS/Less/SCSS 代码检查工具，帮助你保持样式代码质量和一致性。

### 生成的配置

根据选择的样式预处理器，会生成对应的配置：

```json
// .stylelintrc.json (Less 项目)
{
  "extends": ["stylelint-config-standard-less"],
  "rules": {
    "selector-class-pattern": null,
    "no-descending-specificity": null,
    "declaration-block-no-duplicate-properties": true,
    "color-hex-length": "short",
    "color-named": "never",
    "less/at-rule-no-unknown": true
  }
}
```

```json
// .stylelintrc.json (SCSS 项目)
{
  "extends": ["stylelint-config-standard-scss"],
  "rules": {
    "selector-class-pattern": null,
    "no-descending-specificity": null,
    "scss/at-rule-no-unknown": true,
    "scss/dollar-variable-pattern": "^[a-z][a-zA-Z0-9]*$"
  }
}
```

```json
// .stylelintrc.json (CSS 项目)
{
  "extends": ["stylelint-config-standard"],
  "rules": {
    "selector-class-pattern": null,
    "no-descending-specificity": null
  }
}
```

### 添加的依赖

| 样式类型 | 依赖包 |
|----------|--------|
| CSS | `stylelint`, `stylelint-config-standard` |
| Less | `stylelint`, `stylelint-config-standard-less` |
| SCSS | `stylelint`, `stylelint-config-standard-scss` |

### 添加的脚本

```json
{
  "scripts": {
    "lint:style": "stylelint \"src/**/*.{css,less,scss}\"",
    "lint:style:fix": "stylelint \"src/**/*.{css,less,scss}\" --fix"
  }
}
```

### 使用示例

```bash
# 检查样式文件
pnpm lint:style

# 自动修复问题
pnpm lint:style:fix
```

### 编辑器集成

安装 VS Code 插件：`stylelint.vscode-stylelint`

```json
// .vscode/settings.json
{
  "stylelint.validate": ["css", "less", "scss"],
  "css.validate": false,
  "less.validate": false,
  "scss.validate": false
}
```

---

## 使用示例

### 检查代码

```bash
# 运行 ESLint 检查
pnpm lint

# 自动修复问题
pnpm lint:fix
```

### 格式化代码

```bash
# 格式化所有文件
pnpm format

# 检查格式是否符合规范
pnpm format:check
```

### 类型检查

```bash
# 运行 TypeScript 类型检查
pnpm type-check
```

---

## 推荐工作流

### 1. 编辑器集成

安装 VS Code 插件：
- ESLint
- Prettier
- TypeScript

### 2. 保存时自动格式化

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

### 3. Git Hooks 集成

配合 Husky 在提交前自动检查：

```bash
# .husky/pre-commit
pnpm lint
pnpm format:check
```

---

## 配置文件说明

| 文件 | 用途 |
|------|------|
| `tsconfig.json` | TypeScript 编译选项 |
| `eslint.config.js` | ESLint 规则配置 (Flat Config) |
| `.prettierrc` | Prettier 格式化规则 |
| `.prettierignore` | Prettier 忽略文件 |
| `.stylelintrc.json` | Stylelint 样式检查规则 |
| `.stylelintignore` | Stylelint 忽略文件 |
