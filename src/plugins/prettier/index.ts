import type { Plugin } from '../../types';
import { LINTER_VERSIONS } from '../../constants';

export const prettierPlugin: Plugin = {
  name: 'prettier',
  displayName: 'Prettier',
  description: '添加 Prettier 代码格式化配置',
  category: 'formatter',
  defaultEnabled: true,
  devDependencies: {
    prettier: LINTER_VERSIONS.prettier,
    'eslint-config-prettier': LINTER_VERSIONS['eslint-config-prettier'],
  },
  scripts: {
    format: 'prettier --write "src/**/*.{ts,tsx,js,jsx,json,md}"',
    'format:check': 'prettier --check "src/**/*.{ts,tsx,js,jsx,json,md}"',
  },
  files: [
    {
      path: '.prettierrc',
      content: JSON.stringify(
        {
          semi: true,
          singleQuote: true,
          tabWidth: 2,
          trailingComma: 'es5',
          printWidth: 100,
          bracketSpacing: true,
          arrowParens: 'avoid',
        },
        null,
        2
      ),
    },
    {
      path: '.prettierignore',
      content: 'node_modules\ndist\ncoverage\n*.min.js\n',
    },
  ],
};
