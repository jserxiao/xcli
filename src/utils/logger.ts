import chalk from 'chalk';
import gradient from 'gradient-string';

/**
 * CLI Banner - 显示 XIAO Logo
 */
export function showBanner(): void {
  const xcliGradient = gradient(['#00d4ff', '#7c3aed', '#f472b6']);
  
  const banner = `
  ╔═══════════════════════════════════════════════════════════╗
  ║                                                           ║
  ║   ██╗  ██╗██╗ ███████╗ ██████╗  ██████╗ ███████╗         ║
  ║   ╚██╗██╔╝██║ ██╔════╝██╔═══██╗██╔═══██╗██╔════╝         ║
  ║    ╚███╔╝ ██║ █████╗  ██║   ██║██║   ██║███████╗         ║
  ║    ██╔██╗ ██║ ██╔══╝  ██║   ██║██║   ██║╚════██║         ║
  ║   ██╔╝ ██╗██║██║     ╚██████╔╝╚██████╔╝███████║         ║
  ║   ╚═╝  ╚═╝╚═╝╚═╝      ╚═════╝  ╚═════╝ ╚══════╝         ║
  ║                                                           ║
  ║       🔧 可插拔的 TypeScript 项目脚手架工具               ║
  ║                                                           ║
  ╚═══════════════════════════════════════════════════════════╝
`;
  
  console.log(xcliGradient(banner));
  console.log();
}

/**
 * 简洁版 Banner (用于 --help)
 */
export function showMiniBanner(): void {
  const xcliGradient = gradient(['#00d4ff', '#7c3aed', '#f472b6']);
  
  console.log();
  console.log(xcliGradient('   ██╗  ██╗██╗ ███████╗ ██████╗  ██████╗ ███████╗'));
  console.log(xcliGradient('   ╚██╗██╔╝██║ ██╔════╝██╔═══██╗██╔═══██╗██╔════╝'));
  console.log(xcliGradient('    ╚███╔╝ ██║ █████╗  ██║   ██║██║   ██║███████╗'));
  console.log(xcliGradient('    ██╔██╗ ██║ ██╔══╝  ██║   ██║██║   ██║╚════██║'));
  console.log(xcliGradient('   ██╔╝ ██╗██║██║     ╚██████╔╝╚██████╔╝███████║'));
  console.log(xcliGradient('   ╚═╝  ╚═╝╚═╝╚═╝      ╚═════╝  ╚═════╝ ╚══════╝'));
  console.log();
  console.log(chalk.gray('   🔧 可插拔的 TypeScript 项目脚手架工具'));
  console.log();
}

/**
 * 成功完成提示
 */
export function showSuccessMessage(projectName: string): void {
  console.log();
  const boxWidth = 60;
  const lines = [
    `项目 ${projectName} 创建成功!`,
    '',
    '快速开始:',
    `  cd ${projectName}`,
    '  pnpm run dev',
    '',
    '可用脚本:',
    '  pnpm run dev      启动开发服务器',
    '  pnpm run build    构建生产版本',
    '  pnpm run preview  预览生产构建',
  ];
  
  console.log(chalk.green('┌' + '─'.repeat(boxWidth - 2) + '┐'));
  
  for (const line of lines) {
    const padding = boxWidth - 4 - getDisplayWidth(line);
    const rightPadding = padding > 0 ? ' '.repeat(padding) : '';
    console.log(chalk.green('│') + ' ' + line + rightPadding + ' ' + chalk.green('│'));
  }
  
  console.log(chalk.green('└' + '─'.repeat(boxWidth - 2) + '┘'));
  console.log();
}

/**
 * 计算字符串显示宽度（中文字符算2个宽度）
 */
function getDisplayWidth(str: string): number {
  let width = 0;
  for (const char of str) {
    // 判断是否为中文字符
    if (/[\u4e00-\u9fa5]/.test(char)) {
      width += 2;
    } else {
      width += 1;
    }
  }
  return width;
}

/**
 * 日志工具
 */
export const logger = {
  info: (message: string) => {
    console.log(chalk.blue('ℹ'), message);
  },

  success: (message: string) => {
    console.log(chalk.green('✓'), message);
  },

  warning: (message: string) => {
    console.log(chalk.yellow('⚠'), message);
  },

  error: (message: string) => {
    console.log(chalk.red('✗'), message);
  },

  title: (message: string) => {
    console.log();
    console.log(chalk.bold.cyan(message));
    console.log();
  },

  newline: () => {
    console.log();
  },

  step: (step: number, total: number, message: string) => {
    const prefix = chalk.gray(`[${step}/${total}]`);
    console.log(prefix, message);
  },
};
