import fs from 'fs-extra';
import path from 'path';
import type { Plugin, ProjectConfig } from '../types/index.js';

/**
 * package.json 模板
 */
interface PackageJson {
  name: string;
  version: string;
  description?: string;
  author?: string;
  license: string;
  type: string;
  main?: string;
  types?: string;
  scripts: Record<string, string>;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  keywords?: string[];
  files?: string[];
  repository?: {
    type: string;
    url: string;
  };
}

/**
 * 模板依赖类型
 */
interface TemplateDependencies {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

/**
 * 生成 package.json
 */
export async function generatePackageJson(
  projectPath: string,
  config: ProjectConfig,
  plugins: Plugin[],
  templateDeps?: TemplateDependencies,
  templateScripts?: Record<string, string>
): Promise<void> {
  // 合并所有依赖
  const dependencies: Record<string, string> = {};
  const devDependencies: Record<string, string> = {};

  // 首先添加模板依赖
  if (templateDeps) {
    Object.assign(dependencies, templateDeps.dependencies);
    Object.assign(devDependencies, templateDeps.devDependencies);
  }

  // 收集所有插件的依赖和脚本
  for (const plugin of plugins) {
    // 合并运行时依赖
    if (plugin.dependencies) {
      Object.assign(dependencies, plugin.dependencies);
    }

    // 合并开发依赖
    if (plugin.devDependencies) {
      Object.assign(devDependencies, plugin.devDependencies);
    }
  }

  // 合并脚本：优先使用模板脚本，然后是插件脚本
  const scripts: Record<string, string> = {
    ...templateScripts,
  };

  for (const plugin of plugins) {
    if (plugin.scripts) {
      Object.assign(scripts, plugin.scripts);
    }
  }

  // 确保 prepare 脚本在最后执行（用于 husky）
  if (scripts.prepare) {
    const prepare = scripts.prepare;
    delete scripts.prepare;
    scripts.prepare = prepare;
  }

  // 根据项目类型设置不同的 package.json 结构
  const isLibrary = config.projectType === 'library';

  const packageJson: PackageJson = {
    name: config.projectName,
    version: '1.0.0',
    description: config.description || '',
    author: config.author || '',
    license: 'MIT',
    type: 'module',
    scripts,
    dependencies,
    devDependencies,
    keywords: [],
  };

  // 只有 library 类型才需要 main 和 types
  if (isLibrary) {
    packageJson.main = 'dist/index.js';
    packageJson.types = 'dist/index.d.ts';
    packageJson.files = ['dist'];
  }

  // 写入 package.json
  await fs.writeFile(
    path.join(projectPath, 'package.json'),
    JSON.stringify(packageJson, null, 2),
    'utf-8'
  );
}

/**
 * 安装依赖
 */
export async function installDependencies(
  projectPath: string,
  packageManager: 'npm' | 'yarn' | 'pnpm'
): Promise<void> {
  const commands = {
    npm: 'npm install',
    yarn: 'yarn install',
    pnpm: 'pnpm install',
  };

  const { execa } = await import('execa');

  await execa(commands[packageManager], {
    cwd: projectPath,
    stdio: 'inherit',
  });
}

/**
 * 初始化 Git 仓库
 */
export async function initGitRepo(projectPath: string): Promise<void> {
  const { execa } = await import('execa');

  await execa('git', ['init'], { cwd: projectPath });
  await execa('git', ['add', '.'], { cwd: projectPath });
  await execa('git', ['commit', '-m', 'chore: initial commit'], {
    cwd: projectPath,
  });
}
