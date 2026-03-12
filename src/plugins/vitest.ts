import type { Plugin } from '../types/index.js';

export const vitestPlugin: Plugin = {
  name: 'vitest',
  displayName: 'Vitest',
  description: '添加 Vitest 测试框架配置（更快、兼容 Vite）',
  category: 'test',
  defaultEnabled: false,
  devDependencies: {
    vitest: '^1.2.1',
    '@vitest/coverage-v8': '^1.2.1',
  },
  scripts: {
    test: 'vitest run',
    'test:watch': 'vitest',
    'test:coverage': 'vitest run --coverage',
  },
  files: [
    {
      path: 'vitest.config.ts',
      content: `import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules',
        'src/**/*.d.ts',
      ],
    },
  },
});
`,
    },
  ],
};
