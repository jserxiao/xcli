import type { Plugin, PluginContext, ProjectType, StyleType } from '../../types/index.js';
import { BUNDLER_VERSIONS, STYLE_VERSIONS, FRAMEWORK_VERSIONS, BABEL_VERSIONS } from '../../constants/index.js';
import { getLibraryWebpackConfig, getReactWebpackConfig, getVueWebpackConfig } from './config.js';

/**
 * 获取 Webpack 依赖（React 项目）
 */
function getReactWebpackDevDependencies(styleType: StyleType = 'css', useTypeScript: boolean = true): Record<string, string> {
  const deps: Record<string, string> = {
    // Webpack 核心
    webpack: BUNDLER_VERSIONS.webpack,
    'webpack-cli': BUNDLER_VERSIONS['webpack-cli'],
    'webpack-dev-server': BUNDLER_VERSIONS['webpack-dev-server'],
    'webpack-bundle-analyzer': BUNDLER_VERSIONS['webpack-bundle-analyzer'],
    // HTML
    'html-webpack-plugin': BUNDLER_VERSIONS['html-webpack-plugin'],
    // CSS
    'css-loader': BUNDLER_VERSIONS['css-loader'],
    'style-loader': BUNDLER_VERSIONS['style-loader'],
    'mini-css-extract-plugin': BUNDLER_VERSIONS['mini-css-extract-plugin'],
    'css-minimizer-webpack-plugin': BUNDLER_VERSIONS['css-minimizer-webpack-plugin'],
    'postcss-loader': STYLE_VERSIONS['postcss-loader'],
    autoprefixer: STYLE_VERSIONS.autoprefixer,
    // SVG
    '@svgr/webpack': BUNDLER_VERSIONS['@svgr/webpack'],
    // 图片压缩（使用 image-minimizer-webpack-plugin 替代已弃用的 image-webpack-loader）
    'image-minimizer-webpack-plugin': BUNDLER_VERSIONS['image-minimizer-webpack-plugin'],
    // Gzip 压缩
    'compression-webpack-plugin': BUNDLER_VERSIONS['compression-webpack-plugin'],
    // Babel
    '@babel/core': BABEL_VERSIONS['@babel/core'],
    'babel-loader': BABEL_VERSIONS['babel-loader'],
    '@babel/preset-env': BABEL_VERSIONS['@babel/preset-env'],
    '@babel/preset-react': BABEL_VERSIONS['@babel/preset-react'],
    '@babel/plugin-proposal-decorators': BABEL_VERSIONS['@babel/plugin-proposal-decorators'],
    '@babel/plugin-transform-class-properties': BABEL_VERSIONS['@babel/plugin-transform-class-properties'],
    '@babel/plugin-transform-runtime': BABEL_VERSIONS['@babel/plugin-transform-runtime'],
    '@babel/runtime': BABEL_VERSIONS['@babel/runtime'],
    // React 热更新
    '@pmmmwh/react-refresh-webpack-plugin': FRAMEWORK_VERSIONS['@pmmmwh/react-refresh-webpack-plugin'],
    'react-refresh': FRAMEWORK_VERSIONS['react-refresh'],
  };

  // 只有在使用 TypeScript 时才添加 TypeScript 相关的 Babel preset
  if (useTypeScript) {
    deps['@babel/preset-typescript'] = BABEL_VERSIONS['@babel/preset-typescript'];
  }

  if (styleType === 'less') {
    deps['less'] = STYLE_VERSIONS.less;
    deps['less-loader'] = STYLE_VERSIONS['less-loader'];
  } else if (styleType === 'scss') {
    deps['sass'] = STYLE_VERSIONS.sass;
    deps['sass-loader'] = STYLE_VERSIONS['sass-loader'];
  }

  return deps;
}

/**
 * 获取 Webpack 依赖（Vue 项目）
 */
function getVueWebpackDevDependencies(styleType: StyleType = 'css', useTypeScript: boolean = true): Record<string, string> {
  const deps: Record<string, string> = {
    // Webpack 核心
    webpack: BUNDLER_VERSIONS.webpack,
    'webpack-cli': BUNDLER_VERSIONS['webpack-cli'],
    'webpack-dev-server': BUNDLER_VERSIONS['webpack-dev-server'],
    'webpack-bundle-analyzer': BUNDLER_VERSIONS['webpack-bundle-analyzer'],
    // HTML
    'html-webpack-plugin': BUNDLER_VERSIONS['html-webpack-plugin'],
    // Vue
    'vue-loader': FRAMEWORK_VERSIONS['vue-loader'],
    '@vue/compiler-sfc': FRAMEWORK_VERSIONS['@vue/compiler-sfc'],
    // CSS
    'css-loader': BUNDLER_VERSIONS['css-loader'],
    'style-loader': BUNDLER_VERSIONS['style-loader'],
    'mini-css-extract-plugin': BUNDLER_VERSIONS['mini-css-extract-plugin'],
    'css-minimizer-webpack-plugin': BUNDLER_VERSIONS['css-minimizer-webpack-plugin'],
    'postcss-loader': STYLE_VERSIONS['postcss-loader'],
    autoprefixer: STYLE_VERSIONS.autoprefixer,
    // 图片压缩（使用 image-minimizer-webpack-plugin 替代已弃用的 image-webpack-loader）
    'image-minimizer-webpack-plugin': BUNDLER_VERSIONS['image-minimizer-webpack-plugin'],
    // Gzip 压缩
    'compression-webpack-plugin': BUNDLER_VERSIONS['compression-webpack-plugin'],
    // Babel
    '@babel/core': BABEL_VERSIONS['@babel/core'],
    'babel-loader': BABEL_VERSIONS['babel-loader'],
    '@babel/preset-env': BABEL_VERSIONS['@babel/preset-env'],
    '@babel/plugin-proposal-decorators': BABEL_VERSIONS['@babel/plugin-proposal-decorators'],
    '@babel/plugin-transform-class-properties': BABEL_VERSIONS['@babel/plugin-transform-class-properties'],
    '@babel/plugin-transform-runtime': BABEL_VERSIONS['@babel/plugin-transform-runtime'],
    '@babel/runtime': BABEL_VERSIONS['@babel/runtime'],
  };

  // 只有在使用 TypeScript 时才添加 TypeScript 相关的 Babel preset
  if (useTypeScript) {
    deps['@babel/preset-typescript'] = BABEL_VERSIONS['@babel/preset-typescript'];
  }

  if (styleType === 'less') {
    deps['less'] = STYLE_VERSIONS.less;
    deps['less-loader'] = STYLE_VERSIONS['less-loader'];
  } else if (styleType === 'scss') {
    deps['sass'] = STYLE_VERSIONS.sass;
    deps['sass-loader'] = STYLE_VERSIONS['sass-loader'];
  }

  return deps;
}

/**
 * 获取 Webpack 依赖（Library 项目）
 */
function getLibraryWebpackDevDependencies(useTypeScript: boolean = true): Record<string, string> {
  const deps: Record<string, string> = {
    webpack: BUNDLER_VERSIONS.webpack,
    'webpack-cli': BUNDLER_VERSIONS['webpack-cli'],
    'webpack-bundle-analyzer': BUNDLER_VERSIONS['webpack-bundle-analyzer'],
  };

  if (useTypeScript) {
    deps['ts-loader'] = BUNDLER_VERSIONS['ts-loader'];
  } else {
    deps['@babel/core'] = BABEL_VERSIONS['@babel/core'];
    deps['babel-loader'] = BABEL_VERSIONS['babel-loader'];
    deps['@babel/preset-env'] = BABEL_VERSIONS['@babel/preset-env'];
  }

  return deps;
}

/**
 * 获取 Webpack 脚本
 */
function getWebpackScripts(projectType: ProjectType): Record<string, string> {
  if (projectType === 'library') {
    return {
      build: 'webpack --mode production',
      'build:dev': 'webpack --mode development',
      watch: 'webpack --watch',
      analyze: 'webpack --mode production --env analyze',
    };
  }

  return {
    dev: 'webpack serve --mode development',
    build: 'webpack --mode production',
    'build:dev': 'webpack --mode development',
    analyze: 'webpack --mode production --env analyze',
  };
}

/**
 * 根据项目类型创建 Webpack 插件
 */
export function createWebpackPlugin(projectType: ProjectType, styleType: StyleType = 'css'): Plugin {
  const getWebpackConfig = (context: PluginContext): string => {
    const useTypeScript = context.useTypeScript ?? true;
    switch (projectType) {
      case 'react':
        return getReactWebpackConfig(styleType, useTypeScript);
      case 'vue':
        return getVueWebpackConfig(styleType, useTypeScript);
      case 'library':
      default:
        return getLibraryWebpackConfig(useTypeScript);
    }
  };

  // 注意：依赖需要通过动态函数获取，因为需要 context
  const getDevDeps = (context: PluginContext): Record<string, string> => {
    const useTypeScript = context.useTypeScript ?? true;
    switch (projectType) {
      case 'react':
        return getReactWebpackDevDependencies(styleType, useTypeScript);
      case 'vue':
        return getVueWebpackDevDependencies(styleType, useTypeScript);
      default:
        return getLibraryWebpackDevDependencies(useTypeScript);
    }
  };

  return {
    name: 'webpack',
    displayName: 'Webpack',
    description: '添加 Webpack 构建工具配置',
    category: 'bundler',
    defaultEnabled: false,
    devDependencies: getDevDeps as any, // 动态依赖函数
    scripts: getWebpackScripts(projectType),
    files: [
      {
        path: 'webpack.config.cjs',
        content: getWebpackConfig as any,
      },
    ],
  };
}

/**
 * 基础 Webpack 插件（Library 项目使用）
 */
export const webpackPlugin: Plugin = {
  name: 'webpack',
  displayName: 'Webpack',
  description: '添加 Webpack 构建工具配置',
  category: 'bundler',
  defaultEnabled: false,
  devDependencies: getLibraryWebpackDevDependencies(),
  scripts: getWebpackScripts('library'),
  files: [
    {
      path: 'webpack.config.cjs',
      content: getLibraryWebpackConfig(),
    },
  ],
};
