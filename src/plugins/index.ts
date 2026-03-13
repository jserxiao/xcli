import type { Plugin } from '../types/index.js';
import { typescriptPlugin } from './typescript/index.js';
import { eslintPlugin } from './eslint/index.js';
import { prettierPlugin } from './prettier/index.js';
import { stylelintPlugin } from './stylelint/index.js';
import { jestPlugin } from './jest/index.js';
import { vitestPlugin } from './vitest/index.js';
import { huskyPlugin } from './husky/index.js';
import { commitlintPlugin } from './commitlint/index.js';
import { vitePlugin } from './vite/index.js';
import { webpackPlugin } from './webpack/index.js';
import { rollupPlugin } from './rollup/index.js';

// 导出所有插件
export { typescriptPlugin } from './typescript/index.js';
export { eslintPlugin } from './eslint/index.js';
export { prettierPlugin } from './prettier/index.js';
export { stylelintPlugin } from './stylelint/index.js';
export { jestPlugin } from './jest/index.js';
export { vitestPlugin } from './vitest/index.js';
export { huskyPlugin } from './husky/index.js';
export { commitlintPlugin } from './commitlint/index.js';
export { vitePlugin } from './vite/index.js';
export { webpackPlugin, createWebpackPlugin } from './webpack/index.js';
export { rollupPlugin } from './rollup/index.js';
export { axiosPlugin, fetchPlugin, getHttpClientChoices } from './http-client/index.js';

/**
 * 所有可用的插件列表
 */
export const plugins: Plugin[] = [
  typescriptPlugin,
  eslintPlugin,
  prettierPlugin,
  stylelintPlugin,
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
