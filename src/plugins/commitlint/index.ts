import type { Plugin } from '../../types/index.js';
import { GIT_VERSIONS } from '../../constants/index.js';

export const commitlintPlugin: Plugin = {
  name: 'commitlint',
  displayName: 'Commitlint',
  description: '添加 Git 提交信息规范检查',
  category: 'git',
  defaultEnabled: false,
  devDependencies: {
    '@commitlint/cli': GIT_VERSIONS['@commitlint/cli'],
    '@commitlint/config-conventional': GIT_VERSIONS['@commitlint/config-conventional'],
  },
  files: [
    {
      path: '.commitlintrc.json',
      content: JSON.stringify(
        {
          extends: ['@commitlint/config-conventional'],
          rules: {
            'type-enum': [
              2,
              'always',
              [
                'feat',
                'fix',
                'docs',
                'style',
                'refactor',
                'perf',
                'test',
                'build',
                'ci',
                'chore',
                'revert',
              ],
            ],
          },
        },
        null,
        2
      ),
    },
  ],
};
