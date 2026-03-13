import type { Plugin, PluginContext, ProjectType, StyleType } from '../../types/index.js';
import { BUNDLER_VERSIONS, STYLE_VERSIONS, FRAMEWORK_VERSIONS } from '../../constants/index.js';
import { getLibraryWebpackConfig, getReactWebpackConfig, getVueWebpackConfig } from './config.js';

/**
 * 获取 Webpack 依赖
 */
function getWebpackDevDependencies(projectType: ProjectType, styleType: StyleType = 'css'): Record<string, string> {
  const baseDeps: Record<string, string> = {
    webpack: BUNDLER_VERSIONS.webpack,
    'webpack-cli': BUNDLER_VERSIONS['webpack-cli'],
    'webpack-bundle-analyzer': BUNDLER_VERSIONS['webpack-bundle-analyzer'],
    'webpack-dev-server': BUNDLER_VERSIONS['webpack-dev-server'],
  };

  if (projectType === 'library') {
    return {
      ...baseDeps,
      'ts-loader': BUNDLER_VERSIONS['ts-loader'],
    };
  }

  const webDeps: Record<string, string> = {
    ...baseDeps,
    'html-webpack-plugin': BUNDLER_VERSIONS['html-webpack-plugin'],
    'ts-loader': BUNDLER_VERSIONS['ts-loader'],
    'css-loader': BUNDLER_VERSIONS['css-loader'],
    'style-loader': BUNDLER_VERSIONS['style-loader'],
    'mini-css-extract-plugin': BUNDLER_VERSIONS['mini-css-extract-plugin'],
    'postcss-loader': STYLE_VERSIONS['postcss-loader'],
    autoprefixer: STYLE_VERSIONS.autoprefixer,
  };

  if (projectType === 'react') {
    webDeps['@pmmmwh/react-refresh-webpack-plugin'] = FRAMEWORK_VERSIONS['@pmmmwh/react-refresh-webpack-plugin'];
    webDeps['react-refresh'] = FRAMEWORK_VERSIONS['react-refresh'];
  }

  if (projectType === 'vue') {
    webDeps['vue-loader'] = FRAMEWORK_VERSIONS['vue-loader'];
    webDeps['@vue/compiler-sfc'] = FRAMEWORK_VERSIONS['@vue/compiler-sfc'];
  }

  if (styleType === 'less') {
    webDeps['less'] = STYLE_VERSIONS.less;
    webDeps['less-loader'] = STYLE_VERSIONS['less-loader'];
  } else if (styleType === 'scss') {
    webDeps['sass'] = STYLE_VERSIONS.sass;
    webDeps['sass-loader'] = STYLE_VERSIONS['sass-loader'];
  }

  return webDeps;
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
    switch (projectType) {
      case 'react':
        return getReactWebpackConfig(styleType);
      case 'vue':
        return getVueWebpackConfig(styleType);
      case 'library':
      default:
        return getLibraryWebpackConfig();
    }
  };

  return {
    name: 'webpack',
    displayName: 'Webpack',
    description: '添加 Webpack 构建工具配置',
    category: 'bundler',
    defaultEnabled: false,
    devDependencies: getWebpackDevDependencies(projectType, styleType),
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
  devDependencies: getWebpackDevDependencies('library'),
  scripts: getWebpackScripts('library'),
  files: [
    {
      path: 'webpack.config.cjs',
      content: getLibraryWebpackConfig(),
    },
  ],
};
