import type { Plugin } from '../types/index.js';

export const rollupPlugin: Plugin = {
  name: 'rollup',
  displayName: 'Rollup',
  description: '添加 Rollup 构建工具配置',
  category: 'bundler',
  defaultEnabled: false,
  devDependencies: {
    rollup: '^4.9.6',
    '@rollup/plugin-typescript': '^11.1.6',
    '@rollup/plugin-node-resolve': '^15.2.3',
    '@rollup/plugin-commonjs': '^25.0.7',
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
