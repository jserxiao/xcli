import type { Plugin, PluginContext } from '../types/index.js';

/**
 * 根据项目类型获取 tsconfig
 */
function getTsConfig(context: PluginContext) {
  const { projectType } = context;

  const baseConfig = {
    compilerOptions: {
      target: 'ES2022',
      useDefineForClassFields: true,
      module: 'ESNext',
      lib: ['ES2022'],
      skipLibCheck: true,
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      // Monorepo workspace 包路径映射
      paths: {
        'shared': ['./packages/shared/src/index.ts'],
        'ui': ['./packages/ui/src/index.ts'],
      },
      baseUrl: '.',
    },
    include: ['src', 'packages/*/src'],
    exclude: ['node_modules'],
  };

  if (projectType === 'react') {
    return {
      ...baseConfig,
      compilerOptions: {
        ...baseConfig.compilerOptions,
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        jsx: 'react-jsx',
      },
    };
  }

  if (projectType === 'vue') {
    return {
      ...baseConfig,
      compilerOptions: {
        ...baseConfig.compilerOptions,
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
      },
    };
  }

  // Library 模式
  return {
    compilerOptions: {
      target: 'ES2022',
      module: 'NodeNext',
      moduleResolution: 'NodeNext',
      lib: ['ES2022'],
      outDir: './dist',
      rootDir: './src',
      strict: true,
      esModuleInterop: true,
      skipLibCheck: true,
      forceConsistentCasingInFileNames: true,
      declaration: true,
      declarationMap: true,
      sourceMap: true,
      resolveJsonModule: true,
    },
    include: ['src/**/*'],
    exclude: ['node_modules', 'dist'],
  };
}

export const typescriptPlugin: Plugin = {
  name: 'typescript',
  displayName: 'TypeScript',
  description: '添加 TypeScript 支持和配置',
  category: 'other',
  defaultEnabled: true,
  devDependencies: {
    typescript: '^5.3.3',
    '@types/node': '^20.11.0',
  },
  scripts: {
    'type-check': 'tsc --noEmit',
  },
  files: [
    {
      path: 'tsconfig.json',
      content: (context: PluginContext) => JSON.stringify(getTsConfig(context), null, 2),
    },
  ],
};
