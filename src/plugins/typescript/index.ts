import type { Plugin } from '../../types/index.js';
import { TS_VERSIONS } from '../../constants/index.js';
import { getTsConfig } from './config.js';

export const typescriptPlugin: Plugin = {
  name: 'typescript',
  displayName: 'TypeScript',
  description: '添加 TypeScript 支持和配置',
  category: 'other',
  defaultEnabled: true,
  devDependencies: {
    typescript: TS_VERSIONS.typescript,
    '@types/node': TS_VERSIONS['@types/node'],
  },
  scripts: {
    'type-check': 'tsc --noEmit',
  },
  files: [
    {
      path: 'tsconfig.json',
      content: (context) => JSON.stringify(getTsConfig(context), null, 2),
    },
  ],
};
