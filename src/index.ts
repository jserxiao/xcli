#!/usr/bin/env node

import { Command } from 'commander';
import { init } from './commands/init';
import { addPlugin, removePlugin, listPlugins } from './commands/plugin';
import { upgrade, showVersion, CURRENT_VERSION } from './commands/upgrade';
import { logger, showMiniBanner } from './utils/logger';

const program = new Command();

// 检查是否是 --help 或 -h 且没有子命令
const args = process.argv.slice(2);
const isHelpRequest = args.includes('--help') || args.includes('-h') || args.length === 0;

// 如果是 --help 或无参数，先显示 Banner
if (isHelpRequest) {
  showMiniBanner();
}

program
  .name('xcli')
  .description('一个可插拔的 TypeScript 项目脚手架 CLI 工具')
  .version(CURRENT_VERSION);

// init 命令
program
  .command('init [projectName]')
  .alias('i')
  .description('初始化一个新的 TypeScript 项目')
  .option('-t, --template <name>', '项目类型 (library/react/vue)')
  .option('-s, --style <type>', '样式预处理器 (css/less/scss)')
  .option('-m, --state-manager <type>', '状态管理 (none/redux/mobx/pinia)')
  .option('-h, --http-client <type>', 'HTTP 请求库 (axios/fetch/none)')
  .option('-M, --monitoring <type>', '前端监控 SDK (none/xstat)')
  .option('-b, --bundler <type>', '打包工具 (vite/webpack/rollup/none)')
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

// upgrade 命令
program
  .command('upgrade')
  .alias('up')
  .description('升级 xcli 到最新版本')
  .option('-c, --check', '仅检查是否有更新，不执行升级')
  .option('-t, --tag <tag>', '指定升级到的标签 (latest/next/beta等)')
  .action(async (options) => {
    try {
      await upgrade(options);
    } catch (error) {
      logger.error(`升级失败: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// version 命令（显示详细信息）
program
  .command('version')
  .alias('v')
  .description('显示 xcli 版本信息')
  .action(async () => {
    try {
      await showVersion();
    } catch (error) {
      logger.error(`获取版本信息失败: ${(error as Error).message}`);
      process.exit(1);
    }
  });

// 解析命令行参数
program.parse();
