import type { Plugin } from '../types/index.js';
import { typescriptPlugin } from './typescript.js';
import { eslintPlugin } from './eslint.js';
import { prettierPlugin } from './prettier.js';
import { jestPlugin } from './jest.js';
import { vitestPlugin } from './vitest.js';
import { huskyPlugin } from './husky.js';
import { commitlintPlugin } from './commitlint.js';
import { vitePlugin } from './vite.js';
import { webpackPlugin } from './webpack.js';
import { rollupPlugin } from './rollup.js';

/**
 * 所有可用的插件列表
 */
export const plugins: Plugin[] = [
  typescriptPlugin,
  eslintPlugin,
  prettierPlugin,
  jestPlugin,
  vitestPlugin,
  huskyPlugin,
  commitlintPlugin,
  vitePlugin,
  webpackPlugin,
  rollupPlugin,
];

/**
 * 插件映射表（按名称索引）
 */
export const pluginMap = new Map<string, Plugin>(
  plugins.map((plugin) => [plugin.name, plugin])
);

/**
 * 按类别获取插件
 */
export function getPluginsByCategory(category: Plugin['category']): Plugin[] {
  return plugins.filter((plugin) => plugin.category === category);
}

/**
 * 获取默认启用的插件
 */
export function getDefaultPlugins(): Plugin[] {
  return plugins.filter((plugin) => plugin.defaultEnabled);
}

/**
 * 获取插件列表（用于交互式选择）
 */
export function getPluginChoices() {
  const categories = {
    linter: '代码检查',
    formatter: '代码格式化',
    test: '测试框架',
    git: 'Git 工具',
    bundler: '构建打包',
    other: '其他',
  };

  return Object.entries(categories).map(([category, categoryName]) => ({
    name: categoryName,
    plugins: plugins
      .filter((p) => p.category === category)
      .map((p) => ({
        name: p.name,
        value: p.name,
        checked: p.defaultEnabled,
      })),
  }));
}
