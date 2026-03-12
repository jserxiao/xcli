import type { Plugin } from '../types/index.js';

export const prettierPlugin: Plugin = {
  name: 'prettier',
  displayName: 'Prettier',
  description: '添加 Prettier 代码格式化配置',
  category: 'formatter',
  defaultEnabled: true,
  devDependencies: {
    prettier: '^3.2.4',
    'eslint-config-prettier': '^9.1.0',
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
