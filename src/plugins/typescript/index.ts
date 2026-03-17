import type { Plugin } from '../../types';
import { TS_VERSIONS } from '../../constants';
import { getTsConfig } from './config';

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
