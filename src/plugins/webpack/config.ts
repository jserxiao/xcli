import type { StyleType } from '../../types/index.js';

// ============================================================
// 工具函数
// ============================================================

/**
 * CSS Modules localIdentName 配置
 */
function getCssModulesLocalIdentName(): string {
  return '[local]_[hash:base64:5]';
}

// ============================================================
// 基础配置函数
// ============================================================

/**
 * 公共 devServer 配置
 */
function getDevServerConfig(): string {
  return `devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
    open: true,
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },`;
}

/**
 * 公共 output 配置
 */
function getOutputConfig(): string {
  return `output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
    chunkFilename: isProduction ? '[name].[contenthash:8].chunk.js' : '[name].chunk.js',
    clean: true,
    publicPath: '/',
  },`;
}

/**
 * 公共 performance 配置
 */
function getPerformanceConfig(): string {
  return `performance: {
    hints: isProduction ? 'warning' : false,
    maxEntrypointSize: 512 * 1024,
    maxAssetSize: 512 * 1024,
  },`;
}

/**
 * 公共 cache 配置
 */
function getCacheConfig(): string {
  return `cache: isDevelopment ? {
    type: 'memory',
  } : false,`;
}

/**
 * 公共 devtool 配置
 */
function getDevtoolConfig(): string {
  return `devtool: isProduction ? 'source-map' : 'eval-source-map',`;
}

/**
 * 公共 optimization 基础配置
 */
function getOptimizationBase(): string {
  return `minimize: isProduction,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\\\/]node_modules[\\\\/]/,
            name: 'vendors',
            chunks: 'all',
          },`;
}

// ============================================================
// 资源规则配置函数
// ============================================================

/**
 * 图片处理规则
 * 注意：图片压缩已移至 image-minimizer-webpack-plugin 插件处理
 */
function getImageRules(): string {
  return `{
      test: /\\.(png|jpg|jpeg|gif|webp)$/,
      type: 'asset',
      parser: {
        dataUrlCondition: {
          maxSize: 10 * 1024, // 10kb
        },
      },
      generator: {
        filename: 'images/[name].[hash:8][ext]',
      },
    },`;
}

/**
 * ImageMinimizerPlugin 配置（图片压缩）
 * 使用 sharp 进行图片压缩，比已弃用的 image-webpack-loader 更现代
 */
function getImageMinimizerPlugin(): string {
  return `isProduction && new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.sharpMinify,
        options: {
          mozjpeg: { quality: 65, progressive: true },
          png: { compressionLevel: 9 },
          webp: { quality: 75 },
          gif: { optimizationLevel: 3 },
        },
      },
      generator: [
        {
          preset: 'webp',
          implementation: ImageMinimizerPlugin.sharpGenerate,
          options: {
            webp: { quality: 75 },
          },
        },
      ],
    }),`;
}

/**
 * SVG 处理规则 - React 版本（支持作为组件）
 * 使用 ?react 后缀导入 SVG 作为组件: import Logo from './logo.svg?react'
 */
function getReactSvgRules(): string {
  return `{
      test: /\\.svg$/,
      issuer: /\\.[jt]sx?$/,
      resourceQuery: /react/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
            replaceAttrValues: { '#000': 'currentColor' },
            svgo: true,
            svgoConfig: {
              plugins: [
                { name: 'preset-default', params: { overrides: { removeViewBox: false } } },
              ],
            },
          },
        },
      ],
    },
    {
      test: /\\.svg$/,
      resourceQuery: { not: [/react/] },
      type: 'asset/resource',
      generator: {
        filename: 'images/[name].[hash:8][ext]',
      },
    },`;
}

/**
 * SVG 处理规则 - Vue 版本（仅作为资源）
 */
function getVueSvgRules(): string {
  return `{
      test: /\\.svg$/,
      type: 'asset/resource',
      generator: {
        filename: 'images/[name].[hash:8][ext]',
      },
    },`;
}

/**
 * 字体处理规则
 */
function getFontRules(): string {
  return `{
      test: /\\.(woff|woff2|eot|ttf|otf)$/,
      type: 'asset/resource',
      generator: {
        filename: 'fonts/[name].[hash:8][ext]',
      },
    },`;
}

/**
 * 获取 React 项目资源规则
 */
function getReactAssetRules(): string {
  return `${getImageRules()}
    ${getReactSvgRules()}
    ${getFontRules()}`;
}

/**
 * 获取 Vue 项目资源规则
 */
function getVueAssetRules(): string {
  return `${getImageRules()}
    ${getVueSvgRules()}
    ${getFontRules()}`;
}

// ============================================================
// 插件配置函数
// ============================================================

/**
 * HtmlWebpackPlugin 配置
 */
function getHtmlWebpackPlugin(): string {
  return `new HtmlWebpackPlugin({
      template: './index.html',
      inject: true,
      minify: isProduction,
    }),`;
}

/**
 * MiniCssExtractPlugin 配置
 */
function getMiniCssExtractPlugin(): string {
  return `isProduction && new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].chunk.css',
    }),`;
}

/**
 * BundleAnalyzerPlugin 配置
 */
function getBundleAnalyzerPlugin(): string {
  return `isAnalyze && new BundleAnalyzerPlugin(),`;
}

/**
 * DefinePlugin 配置（环境变量注入）
 */
function getDefinePlugin(projectType: 'react' | 'vue' = 'react'): string {
  if (projectType === 'react') {
    return `new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      'process.env.REACT_APP_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
    }),`;
  }
  return '';
}

/**
 * CssMinimizerPlugin 配置
 */
function getCssMinimizerPlugin(): string {
  return `new CssMinimizerPlugin(),`;
}

/**
 * CompressionPlugin 配置（Gzip 压缩）
 */
function getCompressionPlugin(): string {
  return `isProduction && new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\\.(js|css|html|svg)$/,
      threshold: 10240, // 10kb
      minRatio: 0.8,
    }),`;
}

/**
 * ReactRefreshWebpackPlugin 配置
 */
function getReactRefreshPlugin(): string {
  return `isDevelopment && new ReactRefreshWebpackPlugin(),`;
}

/**
 * VueLoaderPlugin 配置
 */
function getVueLoaderPlugin(): string {
  return `new VueLoaderPlugin(),`;
}

/**
 * Vue DefinePlugin 配置
 */
function getVueDefinePlugin(): string {
  return `new DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: isDevelopment,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
      }),`;
}

// ============================================================
// 样式规则配置函数
// ============================================================

/**
 * 获取 CSS Modules 配置选项
 */
function getCssModulesOptions(): string {
  const localIdentName = getCssModulesLocalIdentName();
  return `modules: {
              localIdentName: isProduction ? '${localIdentName}' : '[local]_[hash:base64:5]',
              exportLocalsConvention: 'asIs',
              namedExport: true,
            }`;
}

/**
 * 获取基础 CSS 规则（非 Modules）
 */
function getBaseCssRule(baseLoader: string, postcssLoader: string): string {
  return `{
          test: /\\.css$/,
          exclude: /\\.module\\.css$/,
          use: [${baseLoader}, 'css-loader', ${postcssLoader}],
        },`;
}

/**
 * 获取 CSS Modules 规则
 */
function getCssModulesRule(baseLoader: string, postcssLoader: string): string {
  const cssModulesOptions = getCssModulesOptions();
  return `{
          test: /\\.module\\.css$/,
          use: [${baseLoader}, {
            loader: 'css-loader',
            options: {
              ${cssModulesOptions},
            },
          }, ${postcssLoader}],
        },`;
}

/**
 * 获取 Less 规则（非 Modules）
 */
function getLessRule(baseLoader: string, postcssLoader: string): string {
  return `{
          test: /\\.less$/,
          exclude: /\\.module\\.less$/,
          use: [${baseLoader}, 'css-loader', ${postcssLoader}, 'less-loader'],
        },`;
}

/**
 * 获取 Less Modules 规则
 */
function getLessModulesRule(baseLoader: string, postcssLoader: string): string {
  const cssModulesOptions = getCssModulesOptions();
  return `{
          test: /\\.module\\.less$/,
          use: [${baseLoader}, {
            loader: 'css-loader',
            options: {
              ${cssModulesOptions},
            },
          }, ${postcssLoader}, 'less-loader'],
        },`;
}

/**
 * 获取 SCSS 规则（非 Modules）
 */
function getScssRule(baseLoader: string, postcssLoader: string): string {
  return `{
          test: /\\.scss$/,
          exclude: /\\.module\\.scss$/,
          use: [${baseLoader}, 'css-loader', ${postcssLoader}, 'sass-loader'],
        },`;
}

/**
 * 获取 SCSS Modules 规则
 */
function getScssModulesRule(baseLoader: string, postcssLoader: string): string {
  const cssModulesOptions = getCssModulesOptions();
  return `{
          test: /\\.module\\.scss$/,
          use: [${baseLoader}, {
            loader: 'css-loader',
            options: {
              ${cssModulesOptions},
            },
          }, ${postcssLoader}, 'sass-loader'],
        },`;
}

/**
 * 获取 Sass 规则（缩进语法）
 */
function getSassRule(baseLoader: string, postcssLoader: string): string {
  return `{
          test: /\\.sass$/,
          exclude: /\\.module\\.sass$/,
          use: [${baseLoader}, 'css-loader', ${postcssLoader}, {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                indentedSyntax: true,
              },
            },
          }],
        },`;
}

/**
 * 获取样式处理规则（含 CSS Modules 支持）
 */
export function getStyleRules(styleType: StyleType): string {
  const baseLoader = `isProduction ? MiniCssExtractPlugin.loader : 'style-loader'`;
  const postcssLoader = `'postcss-loader'`;

  const baseCssRule = getBaseCssRule(baseLoader, postcssLoader);
  const cssModulesRule = getCssModulesRule(baseLoader, postcssLoader);

  if (styleType === 'less') {
    const lessRule = getLessRule(baseLoader, postcssLoader);
    const lessModulesRule = getLessModulesRule(baseLoader, postcssLoader);
    return `${baseCssRule}
        ${cssModulesRule}
        ${lessRule}
        ${lessModulesRule}`;
  } else if (styleType === 'scss') {
    const scssRule = getScssRule(baseLoader, postcssLoader);
    const scssModulesRule = getScssModulesRule(baseLoader, postcssLoader);
    const sassRule = getSassRule(baseLoader, postcssLoader);
    return `${baseCssRule}
        ${cssModulesRule}
        ${scssRule}
        ${scssModulesRule}
        ${sassRule}`;
  }

  return `${baseCssRule}
        ${cssModulesRule}`;
}

// ============================================================
// Babel 规则配置函数
// ============================================================

/**
 * 获取 React 项目的 Babel 规则
 */
function getReactBabelRule(useTypeScript: boolean = true): string {
  const testPattern = useTypeScript ? '/\\.tsx?$/' : '/\\.jsx?$/';
  const presets = useTypeScript
    ? `[
            ['@babel/preset-env', {
              targets: { browsers: ['last 2 versions', '> 1%'] },
              modules: false,
            }],
            ['@babel/preset-react', { runtime: 'automatic' }],
            '@babel/preset-typescript',
          ]`
    : `[
            ['@babel/preset-env', {
              targets: { browsers: ['last 2 versions', '> 1%'] },
              modules: false,
            }],
            ['@babel/preset-react', { runtime: 'automatic' }],
          ]`;

  return `{
      test: ${testPattern},
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ${presets},
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-transform-class-properties', { loose: true }],
            ['@babel/plugin-transform-runtime', { regenerator: true }],
            isDevelopment && 'react-refresh/babel',
          ].filter(Boolean),
        },
      },
    },`;
}

/**
 * 获取 Vue 项目的 Babel 规则
 */
function getVueBabelRule(useTypeScript: boolean = true): string {
  const testPattern = useTypeScript ? '/\\.ts$/' : '/\\.js$/';
  const presets = useTypeScript
    ? `[
            ['@babel/preset-env', {
              targets: { browsers: ['last 2 versions', '> 1%'] },
              modules: false,
            }],
            '@babel/preset-typescript',
          ]`
    : `[
            ['@babel/preset-env', {
              targets: { browsers: ['last 2 versions', '> 1%'] },
              modules: false,
            }],
          ]`;

  return `{
      test: ${testPattern},
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ${presets},
          plugins: [
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-transform-class-properties', { loose: true }],
            ['@babel/plugin-transform-runtime', { regenerator: true }],
          ],
        },
      },
    },`;
}

// ============================================================
// 完整配置生成函数
// ============================================================

/**
 * 获取 Library 项目的 Webpack 配置
 */
export function getLibraryWebpackConfig(useTypeScript: boolean = true): string {
  const entryFile = useTypeScript ? './src/index.ts' : './src/index.js';
  const extensions = useTypeScript
    ? "['.ts', '.js', '.json']"
    : "['.js', '.json']";
  const babelRule = useTypeScript
    ? `{
          test: /\\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },`
    : `{
          test: /\\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: { node: 'current' },
                  modules: false,
                }],
              ],
            },
          },
        },`;

  return `const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isAnalyze = env && env.analyze;

  return {
    entry: '${entryFile}',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
      library: {
        type: 'commonjs2',
      },
      clean: true,
    },
    resolve: {
      extensions: ${extensions},
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    module: {
      rules: [
        ${babelRule}
      ],
    },
    target: 'node',
    ${getDevtoolConfig()}
    optimization: {
      minimize: isProduction,
    },
    plugins: [
      ${getBundleAnalyzerPlugin()}
    ].filter(Boolean),
    externals: {
      // 排除 peerDependencies
    },
  };
};
`;
}

/**
 * 获取 React 项目的 Webpack 配置
 */
export function getReactWebpackConfig(styleType: StyleType = 'less', useTypeScript: boolean = true): string {
  const styleRules = getStyleRules(styleType);
  const babelRule = getReactBabelRule(useTypeScript);

  // 根据是否使用 TypeScript 设置入口文件和扩展名
  const entryFile = useTypeScript ? './src/main.tsx' : './src/main.jsx';
  const extensions = useTypeScript
    ? "['.ts', '.tsx', '.js', '.jsx', '.json']"
    : "['.js', '.jsx', '.json']";

  // 根据是否使用 TypeScript 设置别名
  const sharedAlias = useTypeScript
    ? "shared: path.resolve(__dirname, 'packages/shared/src/index.ts'),"
    : "shared: path.resolve(__dirname, 'packages/shared/src/index.js'),";
  const uiAlias = useTypeScript
    ? "ui: path.resolve(__dirname, 'packages/ui/src/index.tsx'),"
    : "ui: path.resolve(__dirname, 'packages/ui/src/index.jsx'),";

  return `const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { DefinePlugin } = require('webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;
  const isAnalyze = env && env.analyze;

  return {
    entry: '${entryFile}',
    ${getOutputConfig()}
    resolve: {
      extensions: ${extensions},
      alias: {
        '@': path.resolve(__dirname, 'src'),
        ${sharedAlias}
        ${uiAlias}
      },
    },
    module: {
      rules: [
        ${babelRule}
        ${styleRules}
        ${getReactAssetRules()}
      ],
    },
    plugins: [
      ${getHtmlWebpackPlugin()}
      ${getMiniCssExtractPlugin()}
      ${getDefinePlugin('react')}
      ${getCompressionPlugin()}
      ${getReactRefreshPlugin()}
      ${getImageMinimizerPlugin()}
      ${getBundleAnalyzerPlugin()}
    ].filter(Boolean),
    ${getDevServerConfig()}
    ${getDevtoolConfig()}
    optimization: {
      ${getOptimizationBase()}
          react: {
            test: /[\\\\/]node_modules[\\\\/](react|react-dom|react-router-dom)[\\\\/]/,
            name: 'react',
            chunks: 'all',
          },
        },
      },
      minimizer: [
        ${getCssMinimizerPlugin()}
      ],
    },
    ${getPerformanceConfig()}
    ${getCacheConfig()}
  };
};
`;
}

/**
 * 获取 Vue 项目的 Webpack 配置
 */
export function getVueWebpackConfig(styleType: StyleType = 'less', useTypeScript: boolean = true): string {
  const styleRules = getStyleRules(styleType);
  const babelRule = getVueBabelRule(useTypeScript);

  // 根据是否使用 TypeScript 设置入口文件和扩展名
  const entryFile = useTypeScript ? './src/main.ts' : './src/main.js';
  const extensions = useTypeScript
    ? "['.ts', '.js', '.vue', '.json']"
    : "['.js', '.vue', '.json']";

  // 根据是否使用 TypeScript 设置别名
  const sharedAlias = useTypeScript
    ? "shared: path.resolve(__dirname, 'packages/shared/src/index.ts'),"
    : "shared: path.resolve(__dirname, 'packages/shared/src/index.js'),";
  const uiAlias = useTypeScript
    ? "ui: path.resolve(__dirname, 'packages/ui/src/index.ts'),"
    : "ui: path.resolve(__dirname, 'packages/ui/src/index.js'),";

  return `const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { DefinePlugin } = require('webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;
  const isAnalyze = env && env.analyze;

  return {
    entry: '${entryFile}',
    ${getOutputConfig()}
    resolve: {
      extensions: ${extensions},
      alias: {
        '@': path.resolve(__dirname, 'src'),
        vue: 'vue/dist/vue.esm-bundler.js',
        ${sharedAlias}
        ${uiAlias}
      },
    },
    module: {
      rules: [
        {
          test: /\\.vue$/,
          loader: 'vue-loader',
        },
        ${babelRule}
        ${styleRules}
        ${getVueAssetRules()}
      ],
    },
    plugins: [
      ${getVueLoaderPlugin()}
      ${getHtmlWebpackPlugin()}
      ${getVueDefinePlugin()}
      ${getMiniCssExtractPlugin()}
      ${getCompressionPlugin()}
      ${getImageMinimizerPlugin()}
      ${getBundleAnalyzerPlugin()}
    ].filter(Boolean),
    ${getDevServerConfig()}
    ${getDevtoolConfig()}
    optimization: {
      ${getOptimizationBase()}
          vue: {
            test: /[\\\\/]node_modules[\\\\/](vue|vue-router|pinia)[\\\\/]/,
            name: 'vue',
            chunks: 'all',
          },
        },
      },
      minimizer: [
        ${getCssMinimizerPlugin()}
      ],
    },
    ${getPerformanceConfig()}
    ${getCacheConfig()}
  };
};
`;
}
