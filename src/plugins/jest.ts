import type { Plugin } from '../types/index.js';

export const jestPlugin: Plugin = {
  name: 'jest',
  displayName: 'Jest',
  description: '添加 Jest 测试框架配置',
  category: 'test',
  defaultEnabled: false,
  devDependencies: {
    jest: '^29.7.0',
    '@types/jest': '^29.5.11',
    'ts-jest': '^29.1.1',
  },
  scripts: {
    test: 'jest',
    'test:watch': 'jest --watch',
    'test:coverage': 'jest --coverage',
  },
  files: [
    {
      path: 'jest.config.js',
      content: `/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts', '**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/*.test.ts',
  ],
  coverageDirectory: 'coverage',
  verbose: true,
};
`,
    },
  ],
};
