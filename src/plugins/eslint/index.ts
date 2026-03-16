import type { Plugin, PluginContext } from '../../types/index.js';
import { LINTER_VERSIONS } from '../../constants/index.js';
import { getEslintConfig } from './config.js';

/**
 * 根据项目类型获取 ESLint 依赖
 */
function getEslintDependencies(context: PluginContext): Record<string, string> {
  const baseDeps = {
    eslint: LINTER_VERSIONS.eslint,
    'typescript-eslint': LINTER_VERSIONS['typescript-eslint'],
    '@eslint/js': LINTER_VERSIONS['@eslint/js'],
    'eslint-config-prettier': LINTER_VERSIONS['eslint-config-prettier'],
    globals: LINTER_VERSIONS.globals,
  };

  // React 项目添加 react-hooks 和 react-refresh 插件
  if (context.projectType === 'react') {
    return {
      ...baseDeps,
      'eslint-plugin-react-hooks': LINTER_VERSIONS['eslint-plugin-react-hooks'],
      'eslint-plugin-react-refresh': LINTER_VERSIONS['eslint-plugin-react-refresh'],
    };
  }

  return baseDeps;
}

export const eslintPlugin: Plugin = {
  name: 'eslint',
  displayName: 'ESLint',
  description: '添加 ESLint 代码检查配置（React 项目含 react-hooks/react-refresh 规则）',
  category: 'linter',
  defaultEnabled: true,
  devDependencies: (context: PluginContext) => getEslintDependencies(context),
  scripts: {
    lint: 'eslint src',
    'lint:fix': 'eslint src --fix',
  },
  files: [
    {
      path: 'eslint.config.js',
      content: (context) => getEslintConfig(context),
    },
  ],
};
