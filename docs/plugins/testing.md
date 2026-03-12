# 测试工具插件

测试工具插件帮助你编写和运行单元测试。

## Vitest

Vitest 是 Vite 原生的单元测试框架，速度极快。

### 生成的配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

### 测试示例

```typescript
// src/utils.test.ts
import { describe, it, expect } from 'vitest';
import { hello } from './utils';

describe('utils', () => {
  it('should return hello message', () => {
    expect(hello('World')).toBe('Hello, World!');
  });
});
```

### 添加的脚本

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

### 特性

- ⚡ **极速** - 基于 Vite，冷启动快
- 🔥 **监听模式** - 文件变化自动重新运行
- 📦 **ESM 优先** - 原生支持 ES 模块
- 🎨 **快照测试** - 内置快照测试
- 📊 **代码覆盖率** - 内置覆盖率报告

---

## Jest

Jest 是 Facebook 开发的 JavaScript 测试框架。

### 生成的配置

```javascript
// jest.config.js
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.{test,spec}.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
};
```

### 测试示例

```typescript
// src/utils.test.ts
import { hello } from './utils';

describe('utils', () => {
  it('should return hello message', () => {
    expect(hello('World')).toBe('Hello, World!');
  });
});
```

### 添加的脚本

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 特性

- 🎯 **零配置** - 开箱即用
- 📸 **快照测试** - UI 组件测试
- 🏃 **并行执行** - 测试并行运行
- 📊 **覆盖率报告** - 内置 Istanbul

---

## React 组件测试

### Vitest + React Testing Library

```typescript
// src/components/Button.test.tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

配置：

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

---

## Vue 组件测试

### Vitest + Vue Test Utils

```typescript
// src/components/MyButton.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import MyButton from './MyButton.vue';

describe('MyButton', () => {
  it('renders correctly', () => {
    const wrapper = mount(MyButton, {
      slots: {
        default: 'Click me',
      },
    });
    expect(wrapper.text()).toBe('Click me');
  });
});
```

---

## 选择建议

| 场景 | 推荐工具 |
|------|----------|
| Vite 项目 | Vitest |
| React 组件 | Vitest + Testing Library |
| Vue 组件 | Vitest + Vue Test Utils |
| 传统项目 | Jest |
| 需要 ESM | Vitest |

---

## 运行测试

```bash
# 运行所有测试
pnpm test

# 监听模式
pnpm test:watch

# 运行覆盖率
pnpm test:coverage
```

## CI 集成

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:run
```
