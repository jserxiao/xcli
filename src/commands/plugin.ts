import path from 'path';
import fs from 'fs-extra';
import inquirer from 'inquirer';
import ora from 'ora';
import { pluginMap, plugins } from '../plugins/index.js';
import { logger } from '../utils/logger.js';
import { FileGenerator } from '../utils/fileGenerator.js';
import type { PluginContext } from '../types/index.js';

/**
 * 添加插件
 */
export async function addPlugin(pluginNames: string[]): Promise<void> {
  const currentDir = process.cwd();
  const packageJsonPath = path.join(currentDir, 'package.json');

  // 检查是否在项目目录
  if (!(await fs.pathExists(packageJsonPath))) {
    logger.error('请在项目根目录下执行此命令');
    process.exit(1);
  }

  // 如果没有指定插件名，让用户选择
  let selectedPlugins: string[] = pluginNames;
  if (pluginNames.length === 0) {
    const { plugins: chosen } = await inquirer.prompt({
      type: 'checkbox',
      name: 'plugins',
      message: '选择要添加的插件:',
      choices: plugins.map((p) => ({
        name: `${p.displayName} - ${p.description}`,
        value: p.name,
      })),
    });
    selectedPlugins = chosen;
  }

  if (selectedPlugins.length === 0) {
    logger.warning('未选择任何插件');
    return;
  }

  // 获取插件实例
  const pluginsToAdd = selectedPlugins
    .map((name) => pluginMap.get(name))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  // 读取 package.json
  const packageJson = await fs.readJson(packageJsonPath);

  // 构建上下文
  const context: PluginContext = {
    projectName: packageJson.name,
    projectPath: currentDir,
    projectType: 'library', // 插件管理默认使用 library 类型
    styleType: 'css', // 插件管理默认使用 css
    stateManager: 'none', // 插件管理默认不使用状态管理
    httpClient: 'none', // 插件管理默认不使用 HTTP 请求库
    selectedPlugins: selectedPlugins,
    useTypeScript: true,
    packageManager: 'npm',
    options: {},
  };

  // 安装每个插件
  const spinner = ora();
  for (const plugin of pluginsToAdd) {
    spinner.start(`安装 ${plugin.displayName}...`);

    try {
      // 添加依赖
      if (plugin.dependencies) {
        Object.assign(packageJson.dependencies || {}, plugin.dependencies);
      }
      if (plugin.devDependencies) {
        Object.assign(packageJson.devDependencies || {}, plugin.devDependencies);
      }

      // 添加脚本
      if (plugin.scripts) {
        Object.assign(packageJson.scripts || {}, plugin.scripts);
      }

      // 生成配置文件
      if (plugin.files) {
        const generator = new FileGenerator(context);
        await generator.generateFiles(plugin.files);
      }

      // 执行安装后回调
      if (plugin.postInstall) {
        await plugin.postInstall(context);
      }

      spinner.succeed(`${plugin.displayName} 安装完成`);
    } catch (error) {
      spinner.fail(`${plugin.displayName} 安装失败`);
      throw error;
    }
  }

  // 更新 package.json
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  logger.newline();
  logger.success('插件安装完成!');
  logger.info('请运行 npm install 安装新依赖');
}

/**
 * 移除插件
 */
export async function removePlugin(pluginNames: string[]): Promise<void> {
  const currentDir = process.cwd();
  const packageJsonPath = path.join(currentDir, 'package.json');

  // 检查是否在项目目录
  if (!(await fs.pathExists(packageJsonPath))) {
    logger.error('请在项目根目录下执行此命令');
    process.exit(1);
  }

  // 如果没有指定插件名，让用户选择
  let selectedPlugins: string[] = pluginNames;
  if (pluginNames.length === 0) {
    const { plugins: chosen } = await inquirer.prompt({
      type: 'checkbox',
      name: 'plugins',
      message: '选择要移除的插件:',
      choices: plugins.map((p) => ({
        name: `${p.displayName} - ${p.description}`,
        value: p.name,
      })),
    });
    selectedPlugins = chosen;
  }

  if (selectedPlugins.length === 0) {
    logger.warning('未选择任何插件');
    return;
  }

  // 获取插件实例
  const pluginsToRemove = selectedPlugins
    .map((name) => pluginMap.get(name))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  // 读取 package.json
  const packageJson = await fs.readJson(packageJsonPath);

  const spinner = ora();
  for (const plugin of pluginsToRemove) {
    spinner.start(`移除 ${plugin.displayName}...`);

    try {
      // 移除依赖
      if (plugin.dependencies) {
        for (const dep of Object.keys(plugin.dependencies)) {
          delete packageJson.dependencies?.[dep];
        }
      }
      if (plugin.devDependencies) {
        for (const dep of Object.keys(plugin.devDependencies)) {
          delete packageJson.devDependencies?.[dep];
        }
      }

      // 移除脚本
      if (plugin.scripts) {
        for (const script of Object.keys(plugin.scripts)) {
          delete packageJson.scripts?.[script];
        }
      }

      // 移除配置文件
      if (plugin.files) {
        for (const file of plugin.files) {
          const filePath = path.join(currentDir, file.path);
          await fs.remove(filePath);
        }
      }

      spinner.succeed(`${plugin.displayName} 移除完成`);
    } catch (error) {
      spinner.fail(`${plugin.displayName} 移除失败`);
      throw error;
    }
  }

  // 更新 package.json
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  logger.newline();
  logger.success('插件移除完成!');
  logger.info('请运行 npm install 更新依赖');
}

/**
 * 列出所有可用插件
 */
export async function listPlugins(): Promise<void> {
  logger.title('可用插件列表');

  const categories: Record<string, typeof plugins> = {};

  for (const plugin of plugins) {
    if (!categories[plugin.category]) {
      categories[plugin.category] = [];
    }
    categories[plugin.category].push(plugin);
  }

  const categoryNames: Record<string, string> = {
    linter: '代码检查',
    formatter: '代码格式化',
    test: '测试框架',
    git: 'Git 工具',
    bundler: '构建打包',
    other: '其他',
  };

  for (const [category, categoryPlugins] of Object.entries(categories)) {
    console.log(`\n${categoryNames[category] || category}:`);
    for (const plugin of categoryPlugins) {
      const defaultTag = plugin.defaultEnabled ? ' (默认)' : '';
      console.log(`  - ${plugin.displayName}${defaultTag}: ${plugin.description}`);
    }
  }
}
