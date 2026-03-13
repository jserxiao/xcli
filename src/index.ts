#!/usr/bin/env node

import { Command } from 'commander';
import { init } from './commands/init.js';
import { addPlugin, removePlugin, listPlugins } from './commands/plugin.js';
import { logger } from './utils/logger.js';

const program = new Command();

program
  .name('xcli')
  .description('一个可插拔的 TypeScript 项目脚手架 CLI 工具')
  .version('1.0.0');

// init 命令
program
  .command('init [projectName]')
  .alias('i')
  .description('初始化一个新的 TypeScript 项目')
  .option('-t, --template <name>', '项目类型 (library/react/vue)')
  .option('-s, --style <type>', '样式预处理器 (css/less/scss)')
  .option('-m, --state-manager <type>', '状态管理 (none/redux/mobx/pinia)')
  .option('-h, --http-client <type>', 'HTTP 请求库 (axios/fetch/none)')
  .option('-p, --package-manager <manager>', '包管理器 (npm/yarn/pnpm)', 'pnpm')
  .option('-si, --skip-install', '跳过依赖安装')
  .option('-sg, --skip-git', '跳过 Git 初始化')
  .option('-d, --default', '使用默认配置')
  .action(async (projectName, options) => {
    try {
      await init(projectName, options);
    } catch (error) {
      logger.error(`初始化失败: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// plugin 命令组
const pluginCommand = program
  .command('plugin')
  .description('管理项目插件')
  .alias('p');

// plugin add 子命令
pluginCommand
  .command('add [plugins...]')
  .description('添加插件到当前项目')
  .alias('a')
  .action(async (plugins) => {
    try {
      await addPlugin(plugins);
    } catch (error) {
      logger.error(`添加插件失败: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// plugin remove 子命令
pluginCommand
  .command('remove [plugins...]')
  .description('从当前项目移除插件')
  .alias('r')
  .action(async (plugins) => {
    try {
      await removePlugin(plugins);
    } catch (error) {
      logger.error(`移除插件失败: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// plugin list 子命令
pluginCommand
  .command('list')
  .description('列出所有可用插件')
  .alias('ls')
  .action(async () => {
    try {
      await listPlugins();
    } catch (error) {
      logger.error(`列出插件失败: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// 解析命令行参数
program.parse();
