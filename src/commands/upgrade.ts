import { execa } from 'execa';
import chalk from 'chalk';
import ora from 'ora';
import { logger } from '../utils/logger.js';

// 直接导入 package.json（通过 rollup plugin-json 处理）
import packageJson from '../../package.json' assert { type: 'json' };

// 从 package.json 读取版本号
const CURRENT_VERSION = packageJson.version;
const PACKAGE_NAME = packageJson.name;

interface NpmDistTag {
  latest: string;
  [key: string]: string;
}

interface NpmViewResult {
  version: string;
  distTags?: NpmDistTag;
}

/**
 * 获取 npm 上最新版本
 */
async function getLatestVersion(packageName: string): Promise<string> {
  try {
    const { stdout } = await execa('npm', ['view', packageName, 'version'], {
      timeout: 30000,
    });
    return stdout.trim();
  } catch (error) {
    throw new Error(`无法获取 ${packageName} 的最新版本: ${(error as Error).message}`);
  }
}

/**
 * 获取所有可用的版本标签
 */
async function getDistTags(packageName: string): Promise<NpmDistTag> {
  try {
    const { stdout } = await execa('npm', ['view', packageName, 'dist-tags', '--json'], {
      timeout: 30000,
    });
    return JSON.parse(stdout);
  } catch {
    // 如果获取失败，返回默认值
    return { latest: CURRENT_VERSION };
  }
}

/**
 * 检查是否已安装全局包
 */
async function isGlobalInstall(packageName: string): Promise<boolean> {
  try {
    const { stdout } = await execa('npm', ['list', '-g', packageName, '--depth=0'], {
      timeout: 10000,
    });
    return stdout.includes(packageName);
  } catch {
    return false;
  }
}

/**
 * 获取全局安装的版本
 */
async function getGlobalVersion(packageName: string): Promise<string | null> {
  try {
    const { stdout } = await execa('npm', ['list', '-g', packageName, '--depth=0', '--json'], {
      timeout: 10000,
    });
    const result = JSON.parse(stdout);
    return result.dependencies?.[packageName]?.version || null;
  } catch {
    return null;
  }
}

/**
 * 比较版本号
 * @returns 1: v1 > v2, -1: v1 < v2, 0: v1 == v2
 */
function compareVersions(v1: string, v2: string): number {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
    const p1 = parts1[i] || 0;
    const p2 = parts2[i] || 0;
    if (p1 > p2) return 1;
    if (p1 < p2) return -1;
  }
  return 0;
}

/**
 * 执行升级
 */
async function upgradePackage(packageName: string, version?: string): Promise<void> {
  const packageSpec = version ? `${packageName}@${version}` : `${packageName}@latest`;
  
  const spinner = ora(`正在升级 ${packageSpec}...`).start();
  
  try {
    await execa('npm', ['install', '-g', packageSpec], {
      timeout: 120000,
    });
    spinner.succeed(`升级成功: ${packageSpec}`);
  } catch (error) {
    spinner.fail(`升级失败: ${(error as Error).message}`);
    throw error;
  }
}

/**
 * 检查版本更新
 */
async function checkForUpdate(): Promise<{ hasUpdate: boolean; current: string; latest: string }> {
  const spinner = ora('正在检查更新...').start();
  
  try {
    const latest = await getLatestVersion(PACKAGE_NAME);
    spinner.stop();
    
    return {
      hasUpdate: compareVersions(CURRENT_VERSION, latest) < 0,
      current: CURRENT_VERSION,
      latest,
    };
  } catch (error) {
    spinner.fail('检查更新失败');
    throw error;
  }
}

/**
 * 显示版本信息
 */
function displayVersionInfo(current: string, latest: string, hasUpdate: boolean): void {
  console.log();
  console.log(chalk.blue('📦 xcli 版本信息'));
  console.log(chalk.gray('─'.repeat(30)));
  console.log(`  当前版本: ${chalk.cyan(`v${current}`)}`);
  console.log(`  最新版本: ${hasUpdate ? chalk.green(`v${latest}`) : chalk.cyan(`v${latest}`)}`);
  
  if (hasUpdate) {
    console.log();
    console.log(chalk.yellow('🎉 发现新版本!'));
  } else {
    console.log();
    console.log(chalk.green('✅ 已是最新版本'));
  }
  console.log();
}

/**
 * upgrade 命令主函数
 */
export async function upgrade(options: { check?: boolean; tag?: string }): Promise<void> {
  try {
    // 如果只是检查更新
    if (options.check) {
      const { current, latest, hasUpdate } = await checkForUpdate();
      displayVersionInfo(current, latest, hasUpdate);
      
      if (hasUpdate) {
        console.log(chalk.gray('运行 `xcli upgrade` 来升级到最新版本'));
      }
      return;
    }

    // 如果指定了标签
    if (options.tag) {
      const tags = await getDistTags(PACKAGE_NAME);
      const targetVersion = tags[options.tag];
      
      if (!targetVersion) {
        logger.error(`未找到标签 "${options.tag}"`);
        logger.info(`可用标签: ${Object.keys(tags).join(', ')}`);
        return;
      }
      
      console.log(chalk.blue(`正在升级到 ${options.tag} 版本 (v${targetVersion})...`));
      await upgradePackage(PACKAGE_NAME, targetVersion);
      return;
    }

    // 正常升级流程
    const { current, latest, hasUpdate } = await checkForUpdate();
    displayVersionInfo(current, latest, hasUpdate);

    if (!hasUpdate) {
      return;
    }

    // 执行升级
    console.log(chalk.cyan('开始升级...'));
    await upgradePackage(PACKAGE_NAME);
    
    // 显示更新日志链接
    console.log();
    console.log(chalk.gray('查看更新日志:'));
    console.log(chalk.blue('  https://github.com/jserxiao/xcli/releases'));
    console.log();
    
  } catch (error) {
    logger.error(`升级失败: ${(error as Error).message}`);
    process.exit(1);
  }
}

/**
 * 显示当前版本信息
 */
export async function showVersion(): Promise<void> {
  console.log();
  console.log(chalk.blue('📦 xcli 版本信息'));
  console.log(chalk.gray('─'.repeat(30)));
  console.log(`  版本:     ${chalk.cyan(`v${CURRENT_VERSION}`)}`);
  console.log(`  包名:     ${chalk.gray(PACKAGE_NAME)}`);
  
  // 检查全局安装情况
  const isGlobal = await isGlobalInstall(PACKAGE_NAME);
  if (isGlobal) {
    const globalVersion = await getGlobalVersion(PACKAGE_NAME);
    console.log(`  全局版本: ${chalk.cyan(`v${globalVersion || 'unknown'}`)}`);
  }
  
  console.log();
}

export { CURRENT_VERSION, PACKAGE_NAME };
