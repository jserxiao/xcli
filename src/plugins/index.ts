import type { Plugin } from '../types';
import { typescriptPlugin } from './typescript';
import { eslintPlugin } from './eslint';
import { prettierPlugin } from './prettier';
import { stylelintPlugin } from './stylelint';
import { jestPlugin } from './jest';
import { vitestPlugin } from './vitest';
import { huskyPlugin } from './husky';
import { commitlintPlugin } from './commitlint';
import { vitePlugin } from './vite';
import { webpackPlugin } from './webpack';
import { rollupPlugin } from './rollup';

// 导出所有插件
export { typescriptPlugin } from './typescript';
export { eslintPlugin } from './eslint';
export { prettierPlugin } from './prettier';
export { stylelintPlugin } from './stylelint';
export { jestPlugin } from './jest';
export { vitestPlugin } from './vitest';
export { huskyPlugin } from './husky';
export { commitlintPlugin } from './commitlint';
export { vitePlugin } from './vite';
export { webpackPlugin, createWebpackPlugin } from './webpack';
export { rollupPlugin } from './rollup';
export { axiosPlugin, fetchPlugin, getHttpClientChoices } from './http-client';
export { xstatPlugin, getMonitoringChoices } from './monitoring';

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
        name: p.displayName,
        value: p.name,
        checked: p.defaultEnabled,
      })),
  }));
}
