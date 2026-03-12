import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.js',
    format: 'esm',
    sourcemap: true,
  },
  plugins: [
    json(),
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
    }),
  ],
  external: [
    'chalk',
    'commander',
    'ejs',
    'execa',
    'fs-extra',
    'inquirer',
    'ora',
    'fs',
    'path',
    'url',
    'module',
    'os',
    'crypto',
    'stream',
    'events',
    'util',
    'assert',
    'buffer',
    'process',
    'child_process',
  ],
};
