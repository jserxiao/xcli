import type { ProjectType, PluginContext, StyleType, StateManagerType, HttpClientType, BundlerType } from '../types/index.js';
import path from 'path';
import fs from 'fs-extra';

/**
 * 模板生成器接口
 */
export interface TemplateGenerator {
  type: ProjectType;
  displayName: string;
  description: string;
  createStructure: (projectPath: string, context: PluginContext) => Promise<void>;
  getDependencies: (
    styleType?: StyleType,
    stateManager?: StateManagerType,
    httpClient?: HttpClientType,
    bundler?: BundlerType,
    useTypeScript?: boolean
  ) => { dependencies: Record<string, string>; devDependencies: Record<string, string> };
  getScripts: (bundler?: BundlerType, useTypeScript?: boolean) => Record<string, string>;
}

/**
 * 获取文件扩展名（根据是否使用 TypeScript）
 */
function getExt(useTypeScript: boolean): string {
  return useTypeScript ? '.ts' : '.js';
}

/**
 * Library 项目模板
 */
export const libraryTemplate: TemplateGenerator = {
  type: 'library',
  displayName: 'Library',
  description: 'TypeScript/JavaScript 库项目',

  createStructure: async (projectPath: string, context: PluginContext) => {
    const { useTypeScript = true } = context;
    const ext = getExt(useTypeScript);

    // 创建目录
    await fs.ensureDir(path.join(projectPath, 'src'));
    await fs.ensureDir(path.join(projectPath, 'dist'));

    // 创建入口文件
    if (useTypeScript) {
      await fs.writeFile(
        path.join(projectPath, 'src', 'index.ts'),
        `/**
 * ${context.projectName}
 */

export function hello(name: string): string {
  return \`Hello, \${name}!\`;
}

export default {
  hello,
};
`,
        'utf-8'
      );

      // 创建 tsconfig.json
      await fs.writeFile(
        path.join(projectPath, 'tsconfig.json'),
        JSON.stringify({
          compilerOptions: {
            target: 'ES2022',
            module: 'ESNext',
            moduleResolution: 'Node',
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
          },
          include: ['src/**/*'],
          exclude: ['node_modules', 'dist'],
        }, null, 2),
        'utf-8'
      );
    } else {
      await fs.writeFile(
        path.join(projectPath, 'src', 'index.js'),
        `/**
 * ${context.projectName}
 */

export function hello(name) {
  return \`Hello, \${name}!\`;
}

export default {
  hello,
};
`,
        'utf-8'
      );
    }
  },

  getDependencies: (_styleType?: StyleType, _stateManager?: StateManagerType, _httpClient?: HttpClientType, _bundler?: BundlerType, useTypeScript: boolean = true) => {
    const deps: { dependencies: Record<string, string>; devDependencies: Record<string, string> } = {
      dependencies: {},
      devDependencies: {},
    };

    if (useTypeScript) {
      deps.devDependencies['typescript'] = '^5.3.3';
    }

    return deps;
  },

  getScripts: (_bundler?: BundlerType, useTypeScript: boolean = true) => {
    if (useTypeScript) {
      return {
        build: 'tsc',
        start: 'node dist/index.js',
      };
    }
    return {
      build: 'echo "No build step needed for JS"',
      start: 'node src/index.js',
    };
  },
};
