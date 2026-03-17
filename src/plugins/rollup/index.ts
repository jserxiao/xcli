import type { Plugin } from '../../types';
import { BUNDLER_VERSIONS } from '../../constants';

export const rollupPlugin: Plugin = {
  name: 'rollup',
  displayName: 'Rollup',
  description: '添加 Rollup 构建工具配置',
  category: 'bundler',
  defaultEnabled: false,
  devDependencies: {
    rollup: BUNDLER_VERSIONS.rollup,
    '@rollup/plugin-typescript': BUNDLER_VERSIONS['@rollup/plugin-typescript'],
    '@rollup/plugin-node-resolve': BUNDLER_VERSIONS['@rollup/plugin-node-resolve'],
    '@rollup/plugin-commonjs': BUNDLER_VERSIONS['@rollup/plugin-commonjs'],
    tslib: '^2.6.2',
  },
  scripts: {
    build: 'rollup -c',
    'build:watch': 'rollup -c -w',
  },
  files: [
    {
      path: 'rollup.config.mjs',
      content: `import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
  ],
  external: [],
};
`,
    },
  ],
};
