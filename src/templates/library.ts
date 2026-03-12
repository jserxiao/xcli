import type { ProjectType, PluginContext } from '../types/index.js';
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
  getDependencies: () => { dependencies: Record<string, string>; devDependencies: Record<string, string> };
  getScripts: () => Record<string, string>;
}

/**
 * Library 项目模板
 */
export const libraryTemplate: TemplateGenerator = {
  type: 'library',
  displayName: 'Library',
  description: 'TypeScript 库项目',

  createStructure: async (projectPath: string, context: PluginContext) => {
    // 创建目录
    await fs.ensureDir(path.join(projectPath, 'src'));
    await fs.ensureDir(path.join(projectPath, 'dist'));

    // 创建入口文件
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
  },

  getDependencies: () => ({
    dependencies: {},
    devDependencies: {},
  }),

  getScripts: () => ({
    build: 'tsc',
    start: 'node dist/index.js',
  }),
};
