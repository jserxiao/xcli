# 构建工具插件

构建工具插件帮助你打包和构建项目。

## Vite

Vite 是下一代前端构建工具，提供极速的开发体验。

### 生成的配置

```typescript
// vite.config.ts (React 项目)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    sourcemap: true,
  },
});
```

```typescript
// vite.config.ts (Vue 项目)
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  // ...
});
```

### 特性

- ⚡ **极速冷启动** - 利用原生 ES 模块，无需打包
- 🔥 **即时热更新** - 模块热替换 (HMR)
- 🛠️ **丰富的插件** - 支持 React、Vue、Svelte 等
- 📦 **优化的构建** - 基于 Rollup 的生产构建
- 🌐 **浏览器兼容** - Legacy 插件支持老旧浏览器

### 添加的脚本

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

---

## Rollup

Rollup 是 JavaScript 模块打包器，适合库开发。

### 生成的配置

```typescript
// rollup.config.ts
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
  ],
  external: [],
};
```

### 添加的脚本

```json
{
  "scripts": {
    "build": "rollup -c",
    "dev": "rollup -c -w"
  }
}
```

---

## Webpack

Webpack 是功能强大的模块打包工具。

### 生成的配置

```typescript
// webpack.config.ts
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      type: 'module',
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  experiments: {
    outputModule: true,
  },
};
```

### 添加的脚本

```json
{
  "scripts": {
    "build": "webpack --mode production",
    "dev": "webpack --mode development --watch"
  }
}
```

---

## 浏览器兼容配置

Vite 项目内置以下兼容配置：

### Autoprefixer

自动添加 CSS 浏览器前缀：

```css
/* 输入 */
.box {
  display: flex;
  user-select: none;
}

/* 输出 */
.box {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```

### Legacy 插件

为老旧浏览器提供 polyfill：

```typescript
legacy({
  targets: ['defaults', 'not IE 11'],
})
```

### Browserslist 配置

```
# .browserslistrc
[production]
> 0.5%
last 2 versions
not dead
not IE 11

[development]
last 1 chrome version
last 1 firefox version
last 1 safari version
```

---

## 选择建议

| 场景 | 推荐工具 |
|------|----------|
| React/Vue 应用 | Vite |
| TypeScript 库 | Rollup 或 Vite Library Mode |
| 复杂企业应用 | Webpack |
| 快速原型开发 | Vite |
