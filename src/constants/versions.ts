/**
 * 依赖版本统一管理
 * 所有插件和模板中使用的依赖版本都在此统一维护
 */

// ============ 核心依赖 ============
export const CORE_VERSIONS = {
  node: '>=18.0.0',
  typescript: '^5.3.3',
} as const;

// ============ 打包工具 ============
export const BUNDLER_VERSIONS = {
  // Vite
  vite: '^5.0.12',
  '@vitejs/plugin-react': '^4.2.1',
  '@vitejs/plugin-vue': '^5.0.3',
  '@vitejs/plugin-legacy': '^5.3.0',
  'vite-plugin-dts': '^3.7.1',

  // Webpack
  webpack: '^5.98.0',
  'webpack-cli': '^6.0.1',
  'webpack-dev-server': '^5.2.3',
  'html-webpack-plugin': '^5.6.0',
  'ts-loader': '^9.5.1',
  'css-loader': '^7.1.2',
  'style-loader': '^4.0.0',
  'mini-css-extract-plugin': '^2.9.2',
  'webpack-bundle-analyzer': '^4.10.2',
  'css-minimizer-webpack-plugin': '^7.0.0',

  // Webpack - SVG as Component
  '@svgr/webpack': '^8.1.0',

  // Webpack - 图片压缩 (使用 image-minimizer-webpack-plugin 替代已弃用的 image-webpack-loader)
  'image-minimizer-webpack-plugin': '^5.0.0',

  // Webpack - Gzip/Brotli 压缩
  'compression-webpack-plugin': '^11.1.0',

  // Rollup
  rollup: '^4.9.0',
  '@rollup/plugin-typescript': '^11.1.6',
  '@rollup/plugin-node-resolve': '^15.2.3',
  '@rollup/plugin-commonjs': '^25.0.7',
  '@rollup/plugin-terser': '^0.4.4',
  'rollup-plugin-dts': '^6.1.0',
} as const;

// ============ 前端框架 ============
export const FRAMEWORK_VERSIONS = {
  // React
  react: '^18.2.0',
  'react-dom': '^18.2.0',
  'react-router-dom': '^6.22.0',
  '@types/react': '^18.2.48',
  '@types/react-dom': '^18.2.18',

  // React 热更新
  '@pmmmwh/react-refresh-webpack-plugin': '^0.5.15',
  'react-refresh': '^0.17.0',

  // Vue
  vue: '^3.4.15',
  'vue-router': '^4.3.0',
  'vue-tsc': '^1.8.27',
  'vue-loader': '^17.4.2',
  '@vue/compiler-sfc': '^3.4.0',
} as const;

// ============ 状态管理 ============
export const STATE_MANAGER_VERSIONS = {
  // Redux
  '@reduxjs/toolkit': '^2.2.0',
  'react-redux': '^9.1.0',

  // MobX
  mobx: '^6.12.0',
  'mobx-react-lite': '^4.0.5',

  // Pinia
  pinia: '^2.1.7',
} as const;

// ============ HTTP 请求库 ============
export const HTTP_CLIENT_VERSIONS = {
  axios: '^1.6.0',
} as const;

// ============ 样式处理 ============
export const STYLE_VERSIONS = {
  autoprefixer: '^10.4.17',
  'postcss-loader': '^8.1.1',
  less: '^4.2.0',
  'less-loader': '^12.2.0',
  sass: '^1.70.0',
  'sass-loader': '^14.1.0',
} as const;

// ============ 代码规范工具 ============
export const LINTER_VERSIONS = {
  // ESLint
  eslint: '^9.18.0',
  'typescript-eslint': '^8.20.0',
  '@eslint/js': '^9.18.0',
  'eslint-config-prettier': '^10.0.1',

  // React ESLint 插件
  'eslint-plugin-react-hooks': '^7.0.1',
  'eslint-plugin-react-refresh': '^0.4.14',
  globals: '^15.11.0',

  // Stylelint
  stylelint: '^16.2.0',
  'stylelint-config-standard': '^38.0.0',
  'stylelint-config-standard-scss': '^15.0.0',
  'stylelint-order': '^8.1.1',
  'stylelint-prettier': '^5.0.0',
  'postcss-less': '^6.0.0',

  // Prettier
  prettier: '^3.2.4',
} as const;

// ============ Git 工具 ============
export const GIT_VERSIONS = {
  husky: '^9.0.0',
  'lint-staged': '^15.5.0',
  '@commitlint/cli': '^19.8.1',
  '@commitlint/config-conventional': '^19.8.1',
} as const;

// ============ 测试工具 ============
export const TEST_VERSIONS = {
  // Jest
  jest: '^29.7.0',
  '@types/jest': '^29.5.11',
  'ts-jest': '^29.1.1',
  '@testing-library/react': '^14.1.2',
  '@testing-library/jest-dom': '^6.2.0',
  'jest-environment-jsdom': '^29.7.0',

  // Vitest
  vitest: '^1.2.0',
  '@vitest/coverage-v8': '^1.2.0',
  '@vue/test-utils': '^2.4.4',
  'happy-dom': '^13.3.8',
} as const;

// ============ TypeScript 相关 ============
export const TS_VERSIONS = {
  typescript: '^5.3.3',
  '@types/node': '^20.11.0',
} as const;

// ============ Babel 相关 ============
export const BABEL_VERSIONS = {
  '@babel/core': '^7.24.0',
  '@babel/preset-env': '^7.24.0',
  '@babel/preset-react': '^7.24.0',
  '@babel/preset-typescript': '^7.24.0',
  'babel-loader': '^9.1.3',
  '@babel/plugin-proposal-decorators': '^7.24.0',
  '@babel/plugin-transform-class-properties': '^7.24.0',
  '@babel/plugin-transform-runtime': '^7.24.0',
  '@babel/runtime': '^7.24.0',
  // Polyfill 相关（用于 useBuiltIns: 'usage'）
  'core-js': '^3.36.0',
} as const;

// ============ 环境变量工具 ============
export const ENV_VERSIONS = {
  dotenv: '^16.4.5',
} as const;
