import type { StyleType } from '../../types/index.js';

/**
 * 获取 Library 项目的 Webpack 配置
 */
export function getLibraryWebpackConfig(): string {
  return `const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isAnalyze = env && env.analyze;

  return {
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
      extensions: ['.ts', '.js', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
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
    target: 'node',
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    optimization: {
      minimize: isProduction,
    },
    plugins: [
      isAnalyze && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
    externals: {
      // 排除 peerDependencies
    },
  };
};
`;
}

/**
 * 获取样式处理规则
 */
export function getStyleRules(styleType: StyleType): string {
  const baseLoader = `isProduction ? MiniCssExtractPlugin.loader : 'style-loader'`;
  const postcssLoader = `'postcss-loader'`;

  if (styleType === 'less') {
    return `{
          test: /\.css$/,
          use: [${baseLoader}, 'css-loader', ${postcssLoader}],
        },
        {
          test: /\.less$/,
          use: [${baseLoader}, 'css-loader', ${postcssLoader}, 'less-loader'],
        },`;
  } else if (styleType === 'scss') {
    return `{
          test: /\.css$/,
          use: [${baseLoader}, 'css-loader', ${postcssLoader}],
        },
        {
          test: /\.scss$/,
          use: [${baseLoader}, 'css-loader', ${postcssLoader}, 'sass-loader'],
        },
        {
          test: /\.sass$/,
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

  return `{
          test: /\.css$/,
          use: [${baseLoader}, 'css-loader', ${postcssLoader}],
        },`;
}

/**
 * 获取 React 项目的 Webpack 配置
 */
export function getReactWebpackConfig(styleType: StyleType = 'less'): string {
  const styleRules = getStyleRules(styleType);

  return `const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;
  const isAnalyze = env && env.analyze;

  return {
    entry: './src/main.tsx',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      chunkFilename: isProduction ? '[name].[contenthash].chunk.js' : '[name].chunk.js',
      clean: true,
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        // Monorepo workspace 包路径映射
        shared: path.resolve(__dirname, 'packages/shared/src/index.ts'),
        ui: path.resolve(__dirname, 'packages/ui/src/index.tsx'),
      },
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              // 始终使用 transpileOnly 以避免 TS 内部错误，类型检查通过 tsc --noEmit 单独执行
              transpileOnly: true,
            },
          },
          exclude: /node_modules/,
        },
        ${styleRules}
        {
          test: /\.(png|jpg|jpeg|gif|svg|webp)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024, // 10kb
            },
          },
          generator: {
            filename: 'images/[name].[hash][ext]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash][ext]',
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './index.html',
        inject: true,
        minify: isProduction,
      }),
      isProduction && new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[name].[contenthash].chunk.css',
      }),
      isDevelopment && new ReactRefreshWebpackPlugin(),
      isAnalyze && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
    devServer: {
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
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    optimization: {
      minimize: isProduction,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\\\/]node_modules[\\\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          react: {
            test: /[\\\\/]node_modules[\\\\/](react|react-dom|react-router-dom)[\\\\/]/,
            name: 'react',
            chunks: 'all',
          },
        },
      },
    },
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512 * 1024,
      maxAssetSize: 512 * 1024,
    },
    cache: isDevelopment ? {
      type: 'memory',
    } : false,
  };
};
`;
}

/**
 * 获取 Vue 项目的 Webpack 配置
 */
export function getVueWebpackConfig(styleType: StyleType = 'less'): string {
  const styleRules = getStyleRules(styleType);

  return `const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { DefinePlugin } = require('webpack');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;
  const isAnalyze = env && env.analyze;

  return {
    entry: './src/main.ts',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      chunkFilename: isProduction ? '[name].[contenthash].chunk.js' : '[name].chunk.js',
      clean: true,
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.js', '.vue', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        vue: 'vue/dist/vue.esm-bundler.js',
        // Monorepo workspace 包路径映射
        shared: path.resolve(__dirname, 'packages/shared/src/index.ts'),
        ui: path.resolve(__dirname, 'packages/ui/src/index.ts'),
      },
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
        },
        {
          test: /\.ts$/,
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
            // 始终使用 transpileOnly 以避免 TS 内部错误，类型检查通过 vue-tsc --noEmit 单独执行
            transpileOnly: true,
          },
          exclude: /node_modules/,
        },
        ${styleRules}
        {
          test: /\.(png|jpg|jpeg|gif|svg|webp)$/,
          type: 'asset',
          parser: {
            dataUrlCondition: {
              maxSize: 10 * 1024, // 10kb
            },
          },
          generator: {
            filename: 'images/[name].[hash][ext]',
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash][ext]',
          },
        },
      ],
    },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        template: './index.html',
        inject: true,
        minify: isProduction,
      }),
      new DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: isDevelopment,
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
      }),
      isProduction && new MiniCssExtractPlugin({
        filename: '[name].[contenthash].css',
        chunkFilename: '[name].[contenthash].chunk.css',
      }),
      isAnalyze && new BundleAnalyzerPlugin(),
    ].filter(Boolean),
    devServer: {
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
    },
    devtool: isProduction ? 'source-map' : 'eval-source-map',
    optimization: {
      minimize: isProduction,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\\\/]node_modules[\\\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          vue: {
            test: /[\\\\/]node_modules[\\\\/](vue|vue-router|pinia)[\\\\/]/,
            name: 'vue',
            chunks: 'all',
          },
        },
      },
    },
    performance: {
      hints: isProduction ? 'warning' : false,
      maxEntrypointSize: 512 * 1024,
      maxAssetSize: 512 * 1024,
    },
    cache: isDevelopment ? {
      type: 'memory',
    } : false,
  };
};
`;
}
