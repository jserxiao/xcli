import type { Plugin } from '../../types/index.js';
import { LINTER_VERSIONS } from '../../constants/index.js';
import { getEslintConfig } from './config.js';

export const eslintPlugin: Plugin = {
  name: 'eslint',
  displayName: 'ESLint',
  description: '添加 ESLint 代码检查配置',
  category: 'linter',
  defaultEnabled: true,
  devDependencies: {
    eslint: LINTER_VERSIONS.eslint,
    'typescript-eslint': LINTER_VERSIONS['typescript-eslint'],
    '@eslint/js': LINTER_VERSIONS['@eslint/js'],
    'eslint-config-prettier': LINTER_VERSIONS['eslint-config-prettier'],
  },
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
