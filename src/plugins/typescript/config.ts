import type { PluginContext } from '../../types/index.js';

/**
 * React tsconfig 配置
 */
export function getReactTsConfig(bundler: 'vite' | 'webpack' | 'rollup' | 'none' = 'vite'): object {
  const isVite = bundler === 'vite';

  const compilerOptions: Record<string, unknown> = {
    target: 'ES2022',
    useDefineForClassFields: true,
    module: 'ESNext',
    lib: ['ES2022', 'DOM', 'DOM.Iterable'],
    skipLibCheck: true,
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true,
    moduleResolution: isVite ? 'bundler' : 'Node',
    resolveJsonModule: true,
    isolatedModules: true,
    jsx: 'react-jsx',
    paths: {
      shared: ['./packages/shared/src/index.ts'],
      ui: ['./packages/ui/src/index.ts'],
    },
    baseUrl: '.',
  };

  // Vite 特定配置
  if (isVite) {
    compilerOptions.allowImportingTsExtensions = true;
    compilerOptions.noEmit = true;
  }

  return {
    compilerOptions,
    include: ['src', 'packages/*/src'],
    exclude: ['node_modules'],
  };
}

/**
 * Vue tsconfig 配置
 */
export function getVueTsConfig(bundler: 'vite' | 'webpack' | 'rollup' | 'none' = 'vite'): object {
  const isVite = bundler === 'vite';

  const compilerOptions: Record<string, unknown> = {
    target: 'ES2022',
    useDefineForClassFields: true,
    module: 'ESNext',
    lib: ['ES2022', 'DOM', 'DOM.Iterable'],
    skipLibCheck: true,
    strict: true,
    noUnusedLocals: true,
    noUnusedParameters: true,
    noFallthroughCasesInSwitch: true,
    moduleResolution: isVite ? 'bundler' : 'Node',
    resolveJsonModule: true,
    isolatedModules: true,
    paths: {
      shared: ['./packages/shared/src/index.ts'],
      ui: ['./packages/ui/src/index.ts'],
    },
    baseUrl: '.',
  };

  // Vite 特定配置
  if (isVite) {
    compilerOptions.allowImportingTsExtensions = true;
    compilerOptions.noEmit = true;
  }

  return {
    compilerOptions,
    include: ['src', 'packages/*/src'],
    exclude: ['node_modules'],
  };
}

/**
 * Library tsconfig 配置
 */
export function getLibraryTsConfig(): object {
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

/**
 * 根据项目类型获取 tsconfig
 */
export function getTsConfig(context: PluginContext): object {
  const { projectType, bundler } = context;

  switch (projectType) {
    case 'react':
      return getReactTsConfig(bundler);
    case 'vue':
      return getVueTsConfig(bundler);
    default:
      return getLibraryTsConfig();
  }
}
