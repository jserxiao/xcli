import type { Plugin } from '../../types';
import { GIT_VERSIONS } from '../../constants';
import path from 'path';
import fs from 'fs-extra';

export const huskyPlugin: Plugin = {
  name: 'husky',
  displayName: 'Husky + lint-staged',
  description: '添加 Git Hooks 和代码提交前自动检查',
  category: 'git',
  defaultEnabled: false,
  devDependencies: {
    husky: GIT_VERSIONS.husky,
    'lint-staged': GIT_VERSIONS['lint-staged'],
  },
  scripts: {
    prepare: 'husky',
  },
  files: [
    {
      path: '.lintstagedrc',
      content: JSON.stringify(
        {
          '*.ts': ['eslint --fix', 'prettier --write'],
          '*.{json,md}': ['prettier --write'],
        },
        null,
        2
      ),
    },
  ],
  postInstall: async (context) => {
    // 创建 .husky 目录和 pre-commit hook
    const huskyDir = path.join(context.projectPath, '.husky');
    await fs.ensureDir(huskyDir);

    // 创建 pre-commit hook
    await fs.writeFile(
      path.join(huskyDir, 'pre-commit'),
      `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
`
    );
  },
};
