# 构建工具插件

构建工具插件帮助你打包和构建项目。

## Vite

Vite 是下一代前端构建工具，提供极速的开发体验。

### 生成的配置

```typescript
// vite.config.ts (React 项目)
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  return {
    plugins: [
      react(),
      legacy({
        // 自动读取 .browserslistrc 配置
      }),
    ],
    css: {
      postcss: {
        plugins: [
          autoprefixer({
            flexbox: 'no-2009',
            grid: true,
          }),
        ],
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    build: {
      sourcemap: true,
      target: 'es2015',
    },
    define: {
      __APP_ENV__: JSON.stringify(env),
    },
  };
});
```

```typescript
// vite.config.ts (Vue 项目)
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  return {
    plugins: [
      vue(),
      legacy({
        // 自动读取 .browserslistrc 配置
      }),
    ],
    css: {
      postcss: {
        plugins: [
          autoprefixer({
            flexbox: 'no-2009',
            grid: true,
          }),
        ],
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    build: {
      sourcemap: true,
      target: 'es2015',
    },
    define: {
      __APP_ENV__: JSON.stringify(env),
    },
  };
});
```

### 特性

- ⚡ **极速冷启动** - 利用原生 ES 模块，无需打包
- 🔥 **即时热更新** - 模块热替换 (HMR)
- 🛠️ **丰富的插件** - 支持 React、Vue、Svelte 等
- 📦 **优化的构建** - 基于 Rollup 的生产构建
- 🌐 **浏览器兼容** - Legacy 插件 + Autoprefixer 自动处理

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

Webpack 是功能强大的模块打包工具，适合 React/Vue 应用项目。

### 生成的配置

Webpack 配置包含完整的开发和生产环境支持：

- **开发服务器** - 热更新、端口配置
- **代码分割** - vendor、react/vue 分离
- **样式处理** - CSS/Less/SCSS + CSS Modules
- **资源优化** - 图片压缩、Gzip 压缩
- **浏览器兼容** - Babel + Autoprefixer + core-js

### Babel 配置

```javascript
// @babel/preset-env 自动读取 .browserslistrc 配置
{
  presets: [
    ['@babel/preset-env', {
      modules: false,
      useBuiltIns: 'usage', // 按需引入 polyfill
      corejs: 3,
    }],
    ['@babel/preset-react', { runtime: 'automatic' }],
    '@babel/preset-typescript',
  ],
}
```

### 特性

- 🔥 **热模块替换 (HMR)** - 开发时实时更新，无需刷新页面
- 📦 **代码分割** - 自动拆分 vendor 和业务代码
- 🎨 **CSS 提取** - 独立 CSS 文件，优化加载性能
- 📊 **打包分析** - 通过 `ANALYZE=true pnpm build` 分析打包体积
- 🗜️ **资源优化** - 文件名哈希、图片压缩、Gzip 压缩
- 🌐 **Polyfill** - 按需注入 core-js polyfill

### 添加的脚本

```json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production"
  }
}
```

### 添加的依赖

```json
{
  "dependencies": {
    "core-js": "^3.36.0"  // Polyfill 支持
  },
  "devDependencies": {
    "webpack": "^5.98.0",
    "webpack-cli": "^6.0.1",
    "webpack-dev-server": "^5.2.3",
    "html-webpack-plugin": "^5.6.0",
    "mini-css-extract-plugin": "^2.9.2",
    "css-loader": "^7.1.2",
    "style-loader": "^4.0.0",
    "postcss-loader": "^8.1.1",
    "autoprefixer": "^10.4.17",
    "babel-loader": "^9.1.3",
    "@babel/core": "^7.24.0",
    "@babel/preset-env": "^7.24.0",
    "@babel/preset-react": "^7.24.0",
    "@babel/preset-typescript": "^7.24.0"
  }
}
```

---

## 浏览器兼容配置

所有项目都统一使用 `.browserslistrc` 配置浏览器兼容性：

### Browserslist 配置

```ini
# .browserslistrc
[production]
> 0.5%
last 2 versions
not dead
not IE 11
Chrome >= 86

[development]
last 1 chrome version
last 1 firefox version
last 1 safari version
```

### PostCSS 配置

```javascript
// postcss.config.js
export default {
  plugins: {
    autoprefixer: {
      // 自动读取 .browserslistrc 配置
      flexbox: 'no-2009', // 只添加最终的 flexbox 规格
      grid: true, // 支持 grid 布局前缀
    },
  },
};
```

### Autoprefixer 效果

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

### Legacy 插件 (Vite)

为老旧浏览器提供 polyfill：

```typescript
legacy({
  // 自动读取 .browserslistrc 配置
})
```

### Babel Polyfill (Webpack)

按需注入 polyfill：

```javascript
// @babel/preset-env 配置
{
  useBuiltIns: 'usage',
  corejs: 3,
  // 自动读取 .browserslistrc 配置
}
```

### 工具协同

| 工具 | 配置读取方式 |
|------|-------------|
| autoprefixer | 自动读取 `.browserslistrc` |
| @babel/preset-env (Webpack) | 自动读取 `.browserslistrc` |
| @vitejs/plugin-legacy (Vite) | 自动读取 `.browserslistrc` |

---

## 选择建议

| 场景 | 推荐工具 |
|------|----------|
| React/Vue 应用 | Vite |
| TypeScript 库 | Rollup 或 Vite Library Mode |
| 复杂企业应用 | Webpack |
| 快速原型开发 | Vite |
