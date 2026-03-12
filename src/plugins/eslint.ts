import type { Plugin, PluginContext } from '../types/index.js';

/**
 * 根据项目类型获取 ESLint 配置
 */
function getEslintConfig(context: PluginContext) {
  const { projectType } = context;

  const baseConfig = {
    env: {
      es2022: true,
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  };

  if (projectType === 'react') {
    return {
      ...baseConfig,
      env: {
        ...baseConfig.env,
        browser: true,
      },
      extends: [
        ...baseConfig.extends,
      ],
      parserOptions: {
        ...baseConfig.parserOptions,
        ecmaFeatures: {
          jsx: true,
        },
      },
    };
  }

  if (projectType === 'vue') {
    return {
      ...baseConfig,
      env: {
        ...baseConfig.env,
        browser: true,
      },
    };
  }

  // Library 模式
  return {
    ...baseConfig,
    env: {
      ...baseConfig.env,
      node: true,
    },
  };
}

export const eslintPlugin: Plugin = {
  name: 'eslint',
  displayName: 'ESLint',
  description: '添加 ESLint 代码检查配置',
  category: 'linter',
  defaultEnabled: true,
  devDependencies: {
    eslint: '^8.56.0',
    '@typescript-eslint/eslint-plugin': '^6.19.0',
    '@typescript-eslint/parser': '^6.19.0',
  },
  scripts: {
    lint: 'eslint src --ext .ts,.tsx,.vue',
    'lint:fix': 'eslint src --ext .ts,.tsx,.vue --fix',
  },
  files: [
    {
      path: '.eslintrc.json',
      content: (context: PluginContext) => JSON.stringify(getEslintConfig(context), null, 2),
    },
    {
      path: '.eslintignore',
      content: 'node_modules\ndist\n*.config.js\n',
    },
  ],
};
