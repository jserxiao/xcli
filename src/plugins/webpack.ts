import type { Plugin } from '../types/index.js';

export const webpackPlugin: Plugin = {
  name: 'webpack',
  displayName: 'Webpack',
  description: '添加 Webpack 构建工具配置',
  category: 'bundler',
  defaultEnabled: false,
  devDependencies: {
    webpack: '^5.89.0',
    'webpack-cli': '^5.1.4',
    'ts-loader': '^9.5.1',
  },
  scripts: {
    build: 'webpack --mode production',
    'build:dev': 'webpack --mode development',
    watch: 'webpack --watch',
  },
  files: [
    {
      path: 'webpack.config.js',
      content: `const path = require('path');

module.exports = {
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
    library: {
      type: 'commonjs2',
    },
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  target: 'node',
  devtool: 'source-map',
};
`,
    },
  ],
};
