import type { Plugin } from '../../types';
import { TEST_VERSIONS } from '../../constants';

export const jestPlugin: Plugin = {
  name: 'jest',
  displayName: 'Jest',
  description: '添加 Jest 测试框架配置',
  category: 'test',
  defaultEnabled: false,
  devDependencies: {
    jest: TEST_VERSIONS.jest,
    '@types/jest': TEST_VERSIONS['@types/jest'],
    'ts-jest': TEST_VERSIONS['ts-jest'],
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
