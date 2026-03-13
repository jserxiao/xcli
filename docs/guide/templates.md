# 项目模板

xcli 提供三种项目模板，每种模板都有不同的结构和用途。

## React 模板

React 模板是一个基于 **pnpm monorepo** 结构的前端项目。

### 项目结构

```
my-project/
├── index.html              # HTML 入口
├── vite.config.ts          # Vite 配置
├── postcss.config.js       # PostCSS 配置
├── tsconfig.json           # TypeScript 配置
├── pnpm-workspace.yaml     # pnpm workspace 配置
├── package.json            # 项目配置
├── public/                 # 静态资源
│   └── vite.svg
├── src/                    # 主应用源代码
│   ├── main.tsx            # 入口文件
│   ├── App.tsx             # 根组件
│   ├── index.css           # 全局样式
│   ├── pages/              # 页面组件
│   │   ├── Home.tsx
│   │   └── About.tsx
│   ├── components/         # 通用组件
│   │   └── Layout.tsx
│   ├── router/             # 路由配置
│   │   └── index.tsx
│   ├── api/                # API 请求封装
│   │   └── request.ts      # HTTP 请求封装
│   ├── store/              # 状态管理 (可选)
│   │   └── ...
│   └── assets/             # 静态资源
└── packages/               # monorepo 其他包
    ├── shared/             # 共享工具库
    └── ui/                 # UI 组件库
```

### 特性

- ⚛️ **React 18** - 最新 React 版本
- 🎯 **React Router 6** - 内置路由配置
- 📦 **Vite** - 快速开发构建
- 🎨 **样式预处理器** - CSS / Less / Sass
- 🌐 **浏览器兼容** - Autoprefixer + Legacy 插件
- 📁 **Monorepo** - pnpm workspace 多包管理
- 🗃️ **状态管理** - 可选 Redux Toolkit / MobX
- 🌐 **HTTP 请求** - 可选 Axios / Fetch 封装

### 状态管理选项

#### Redux Toolkit

```bash
xcli i my-app -t react -m redux -d
```

生成的文件结构：

```
src/store/
├── index.ts          # Store 配置
├── counterSlice.ts   # Slice 示例
└── hooks.ts          # 类型安全的 hooks
```

使用示例：

```tsx
import { useAppDispatch, useAppSelector } from './store/hooks';
import { increment, decrement } from './store/counterSlice';

function Counter() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  
  return (
    <div>
      <button onClick={() => dispatch(decrement())}>-</button>
      <span>{count}</span>
      <button onClick={() => dispatch(increment())}>+</button>
    </div>
  );
}
```

#### MobX

```bash
xcli i my-app -t react -m mobx -d
```

生成的文件结构：

```
src/store/
├── index.ts           # 导出
└── CounterStore.ts    # Store 示例
```

使用示例：

```tsx
import { observer } from 'mobx-react-lite';
import { counterStore } from './store';

const Counter = observer(() => (
  <div>
    <button onClick={() => counterStore.decrement()}>-</button>
    <span>{counterStore.count}</span>
    <button onClick={() => counterStore.increment()}>+</button>
  </div>
));
```

---

## Vue 模板

Vue 模板同样是基于 **pnpm monorepo** 结构的前端项目。

### 项目结构

```
my-project/
├── index.html              # HTML 入口
├── vite.config.ts          # Vite 配置
├── postcss.config.js       # PostCSS 配置
├── tsconfig.json           # TypeScript 配置
├── pnpm-workspace.yaml     # pnpm workspace 配置
├── package.json            # 项目配置
├── public/                 # 静态资源
│   └── vite.svg
├── src/                    # 主应用源代码
│   ├── main.ts             # 入口文件
│   ├── App.vue             # 根组件
│   ├── style.css           # 全局样式
│   ├── pages/              # 页面组件
│   │   ├── Home.vue
│   │   └── About.vue
│   ├── components/         # 通用组件
│   ├── router/             # 路由配置
│   │   └── index.ts
│   ├── api/                # API 请求封装
│   │   └── request.ts      # HTTP 请求封装
│   ├── store/              # Pinia 状态管理
│   │   └── ...
│   └── assets/             # 静态资源
└── packages/               # monorepo 其他包
    ├── shared/             # 共享工具库
    └── ui/                 # UI 组件库
```

### 特性

- 💚 **Vue 3** - Composition API
- 🎯 **Vue Router 4** - 内置路由配置
- 📦 **Vite** - 快速开发构建
- 🎨 **样式预处理器** - CSS / Less / Sass
- 📁 **Monorepo** - pnpm workspace 多包管理
- 🗃️ **Pinia** - Vue 官方状态管理（默认集成）
- 🌐 **HTTP 请求** - 可选 Axios / Fetch 封装

### Pinia 状态管理

Vue 模板默认集成 Pinia，生成的文件结构：

```
src/store/
├── index.ts      # Pinia 实例
└── counter.ts    # Counter Store 示例
```

使用示例：

```vue
<script setup lang="ts">
import { useCounterStore } from '../store/counter';
import { storeToRefs } from 'pinia';

const counterStore = useCounterStore();
const { count, doubleCount } = storeToRefs(counterStore);
</script>

<template>
  <div>
    <button @click="counterStore.decrement()">-</button>
    <span>{{ count }}</span>
    <button @click="counterStore.increment()">+</button>
    <p>Double: {{ doubleCount }}</p>
  </div>
</template>
```

---

## Library 模板

Library 模板用于创建 TypeScript 工具库。

### 项目结构

```
my-library/
├── src/
│   └── index.ts      # 库入口文件
├── dist/             # 构建输出目录
├── package.json
└── tsconfig.json
```

### 特性

- 📘 **TypeScript** - 类型安全
- 📦 **多格式输出** - ESM / CJS
- 🔧 **可配置构建** - 支持 Rollup / Vite 构建

---

## 样式预处理器

React 和 Vue 模板支持三种样式预处理器：

| 预处理器 | 文件扩展名 | 说明 |
|----------|------------|------|
| CSS | `.css` | 原生 CSS |
| Less | `.less` | Less 预处理器 |
| Sass | `.scss` | Sass/SCSS 预处理器 |

### 自动配置

创建项目时会自动配置：

- **PostCSS** - CSS 后处理器
- **Autoprefixer** - 自动添加浏览器前缀
- **Legacy 插件** - 支持老旧浏览器

---

## Monorepo 结构优势

### 清晰的代码组织

- `src/` - 主应用代码，开发焦点集中
- `packages/` - 共享模块，便于复用

### 代码共享

```typescript
// src 中使用 shared 包
import { formatDate } from 'shared';

// src 中使用 ui 包
import { Button } from 'ui';
```

### 统一管理

```bash
# 主应用开发
pnpm dev

# 构建所有包
pnpm -r build

# 针对特定包运行
pnpm -F shared build
```
