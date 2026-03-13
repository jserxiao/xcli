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

Webpack 是功能强大的模块打包工具，适合 React/Vue 应用项目。

### 生成的配置（React 项目）

```javascript
// webpack.config.cjs
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

module.exports = {
  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? 'js/[name].[contenthash:8].js' : 'js/[name].js',
    chunkFilename: isProduction ? 'js/[name].[contenthash:8].chunk.js' : 'js/[name].chunk.js',
    clean: true,
    publicPath: '/',
  },
  mode: isProduction ? 'production' : 'development',
  devtool: isProduction ? 'source-map' : 'eval-source-map',
  devServer: {
    port: 3000,
    hot: true,
    open: true,
    historyApiFallback: true,
    static: './public',
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',
        generator: { filename: 'images/[hash][ext][query]' },
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: isProduction ? 'css/[name].[contenthash:8].css' : 'css/[name].css',
      chunkFilename: isProduction ? 'css/[name].[contenthash:8].chunk.css' : 'css/[name].chunk.css',
    }),
    isDevelopment && new ReactRefreshWebpackPlugin(),
    process.env.ANALYZE && new BundleAnalyzerPlugin(),
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
};
```

### 特性

- 🔥 **热模块替换 (HMR)** - 开发时实时更新，无需刷新页面
- 📦 **代码分割** - 自动拆分 vendor 和业务代码
- 🎨 **CSS 提取** - 独立 CSS 文件，优化加载性能
- 📊 **打包分析** - 通过 `ANALYZE=true pnpm build` 分析打包体积
- 🗜️ **资源优化** - 文件名哈希、资源压缩

### 添加的脚本

```json
{
  "scripts": {
    "dev": "webpack serve --mode development",
    "build": "webpack --mode production",
    "build:analyze": "cross-env ANALYZE=true webpack --mode production"
  }
}
```

### 添加的依赖

```json
{
  "devDependencies": {
    "webpack": "^5.x",
    "webpack-cli": "^5.x",
    "webpack-dev-server": "^5.x",
    "html-webpack-plugin": "^5.x",
    "mini-css-extract-plugin": "^2.x",
    "css-loader": "^7.x",
    "style-loader": "^4.x",
    "postcss-loader": "^8.x",
    "babel-loader": "^9.x",
    "@babel/core": "^7.x",
    "@babel/preset-env": "^7.x",
    "@babel/preset-react": "^7.x",
    "@babel/preset-typescript": "^7.x"
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
