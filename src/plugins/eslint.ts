import type { Plugin, PluginContext } from '../types/index.js';

/**
 * 根据项目类型获取 ESLint flat config
 */
function getEslintConfig(context: PluginContext) {
  const { projectType } = context;

  const baseConfig = `import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', '*.config.js', '*.config.ts'],
  }`;

  if (projectType === 'react') {
    return baseConfig + `,
  {
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
      },
    },
  }
);
`;
  }

  if (projectType === 'vue') {
    return baseConfig + `,
  {
    languageOptions: {
      globals: {
        console: 'readonly',
        window: 'readonly',
        document: 'readonly',
      },
    },
  }
);
`;
  }

  // Library 模式
  return baseConfig + `,
  {
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
  }
);
`;
}

export const eslintPlugin: Plugin = {
  name: 'eslint',
  displayName: 'ESLint',
  description: '添加 ESLint 代码检查配置',
  category: 'linter',
  defaultEnabled: true,
  devDependencies: {
    eslint: '^9.18.0',
    'typescript-eslint': '^8.20.0',
    '@eslint/js': '^9.18.0',
    'eslint-config-prettier': '^10.0.1',
  },
  scripts: {
    lint: 'eslint src',
    'lint:fix': 'eslint src --fix',
  },
  files: [
    {
      path: 'eslint.config.js',
      content: (context: PluginContext) => getEslintConfig(context),
    },
  ],
};
