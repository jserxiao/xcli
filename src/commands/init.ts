import path from 'path';
import fs from 'fs-extra';
import inquirer, { DistinctQuestion } from 'inquirer';
import ora from 'ora';
import {
  plugins,
  pluginMap,
  getPluginChoices,
} from '../plugins/index.js';
import type { ProjectConfig, CLIOptions, PluginContext, ProjectType, StyleType, StateManagerType, HttpClientType, BundlerType } from '../types/index.js';
import {
  generatePackageJson,
  installDependencies,
  initGitRepo,
  logger,
  FileGenerator,
  showBanner,
  showSuccessMessage,
} from '../utils/index.js';
import {
  getTemplateChoices,
  getStyleChoices,
  getStateManagerChoices,
  createProjectStructure,
  getProjectDependencies,
  getProjectScripts,
} from '../templates/index.js';
import { getHttpClientChoices } from '../plugins/http-client/index.js';
import { createVscodeConfig } from '../templates/shared.js';

/**
 * 获取用户输入的项目配置
 */
async function getProjectConfig(
  options: CLIOptions,
  currentDir: string,
  projectName?: string
): Promise<ProjectConfig> {
  // 如果使用了 --default 参数，使用默认配置
  if (options.default) {
    const projectType = (options.template as ProjectType) || 'library';
    const styleType = (options.style as StyleType) || 'less';
    const defaultPlugins = plugins.filter((p) => p.defaultEnabled).map((p) => p.name);

    // React/Vue 项目根据 --bundler 选项添加打包工具插件
    if (projectType === 'react' || projectType === 'vue') {
      const bundler = options.bundler || 'vite';
      // 移除其他打包工具插件
      const bundlerPlugins = ['vite', 'webpack', 'rollup'];
      for (const bp of bundlerPlugins) {
        const index = defaultPlugins.indexOf(bp);
        if (index > -1) {
          defaultPlugins.splice(index, 1);
        }
      }
      // 添加指定的打包工具插件
      if (bundler !== 'none' && !defaultPlugins.includes(bundler)) {
        defaultPlugins.push(bundler);
      }
    }

    // 状态管理：命令行指定 > 默认值（Vue 用 pinia，React 用 redux）
    const stateManager: StateManagerType = (options.stateManager as StateManagerType) ||
      (projectType === 'vue' ? 'pinia' : 'redux');

    // HTTP 请求库：命令行指定 > 默认值（axios）
    const httpClient: HttpClientType = (options.httpClient as HttpClientType) || 'axios';

    return {
      projectName: projectName || options.projectName || path.basename(currentDir),
      projectType,
      styleType,
      stateManager,
      httpClient,
      bundler: (projectType === 'react' || projectType === 'vue') ? (options.bundler || 'vite') as BundlerType : 'none',
      useTypeScript: true,
      plugins: defaultPlugins,
      packageManager: options.packageManager || 'pnpm',
      initGit: !options.skipGit,
      installDeps: !options.skipInstall,
      createVscodeConfig: true, // 默认创建 VSCode 配置
    };
  }

  // 交互式询问
  const questions: DistinctQuestion[] = [
    {
      type: 'input',
      name: 'projectName',
      message: '项目名称:',
      default: options.projectName || path.basename(currentDir),
      when: !options.projectName,
    },
    {
      type: 'input',
      name: 'description',
      message: '项目描述:',
      default: '',
    },
    {
      type: 'input',
      name: 'author',
      message: '作者:',
      default: '',
    },
    {
      type: 'list',
      name: 'projectType',
      message: '选择项目类型:',
      choices: getTemplateChoices(),
      default: 'library',
    },
  ];

  // 基础信息
  const basicAnswers = await inquirer.prompt(questions);
  const projectType = basicAnswers.projectType as ProjectType;

  // 样式预处理器选择（仅 React/Vue 项目）
  let styleType: StyleType = 'less';
  if (projectType === 'react' || projectType === 'vue') {
    const styleAnswer = await inquirer.prompt({
      type: 'list',
      name: 'styleType',
      message: '选择样式预处理器:',
      choices: getStyleChoices(),
      default: options.style || 'less',
    });
    styleType = styleAnswer.styleType as StyleType;
  }

  // 状态管理选择（仅 React/Vue 项目）
  let stateManager: StateManagerType = 'redux';
  if (projectType === 'react' || projectType === 'vue') {
    const stateAnswer = await inquirer.prompt({
      type: 'list',
      name: 'stateManager',
      message: '选择状态管理:',
      choices: getStateManagerChoices(projectType),
      default: projectType === 'vue' ? 'pinia' : 'redux',
    });
    stateManager = stateAnswer.stateManager as StateManagerType;
  }

  // HTTP 请求库选择（仅 React/Vue 项目）
  let httpClient: HttpClientType = 'axios';
  if (projectType === 'react' || projectType === 'vue') {
    const httpAnswer = await inquirer.prompt({
      type: 'list',
      name: 'httpClient',
      message: '选择 HTTP 请求库:',
      choices: getHttpClientChoices(),
      default: options.httpClient || 'axios',
    });
    httpClient = httpAnswer.httpClient as HttpClientType;
  }

  // 打包工具选择（仅 React/Vue 项目）
  let bundler: BundlerType = 'vite';
  if (projectType === 'react' || projectType === 'vue') {
    const bundlerAnswer = await inquirer.prompt({
      type: 'list',
      name: 'bundler',
      message: '选择打包工具:',
      choices: [
        { name: 'Vite (推荐)', value: 'vite' },
        { name: 'Webpack', value: 'webpack' },
        { name: 'Rollup', value: 'rollup' },
        { name: '无打包工具', value: 'none' },
      ],
      default: options.bundler || 'vite',
    });
    bundler = bundlerAnswer.bundler as BundlerType;
  }

  // TypeScript 选择
  const tsAnswer = await inquirer.prompt({
    type: 'confirm',
    name: 'useTypeScript',
    message: '使用 TypeScript?',
    default: true,
  });
  const useTypeScript = tsAnswer.useTypeScript as boolean;

  // 包管理器选择
  const packageManagerAnswer = await inquirer.prompt({
    type: 'list',
    name: 'packageManager',
    message: '选择包管理器:',
    choices: [
      { name: 'pnpm', value: 'pnpm' },
      { name: 'npm', value: 'npm' },
      { name: 'yarn', value: 'yarn' },
    ],
    default: options.packageManager || 'pnpm',
  });

  // 插件选择（按类别分组）
  // 注意：React/Vue 项目已单独选择打包工具，不需要再选择 bundler 类别插件
  // TypeScript 也是单独选择，不需要在插件列表中显示
  const pluginQuestions: DistinctQuestion[] = [];
  const pluginChoices = getPluginChoices();

  // 排除已经单独选择的插件
  const excludedPlugins: string[] = ['typescript']; // TypeScript 已单独选择
  
  // React/Vue 项目打包工具已单独选择，排除 bundler 类别
  const excludeBundlerCategory = projectType === 'react' || projectType === 'vue';

  for (const { name, plugins: categoryPlugins } of pluginChoices) {
    // 跳过 bundler 类别（React/Vue 项目已单独选择打包工具）
    if (name === '构建打包' && excludeBundlerCategory) {
      continue;
    }
    
    // 过滤掉排除的插件
    const filteredPlugins = categoryPlugins.filter(p => !excludedPlugins.includes(p.value));
    
    if (filteredPlugins.length > 0) {
      // 获取默认选中的插件值
      const defaultSelected = filteredPlugins
        .filter(p => p.checked)
        .map(p => p.value);
      
      pluginQuestions.push({
        type: 'checkbox',
        name: `plugins_${name}`,
        message: `选择 ${name} 插件 (空格选择，回车确认):`,
        choices: filteredPlugins,
        default: defaultSelected,
        loop: false,
      });
    }
  }

  const pluginAnswers = await inquirer.prompt(pluginQuestions);

  // 合并所有选择的插件
  let selectedPlugins = Object.values(pluginAnswers).flat() as string[];
  
  // 如果使用了 TypeScript，自动添加 typescript 插件
  if (useTypeScript) {
    selectedPlugins = ['typescript', ...selectedPlugins];
  }
  
  // React/Vue 项目，根据选择的打包工具自动添加对应插件
  if ((projectType === 'react' || projectType === 'vue') && bundler !== 'none') {
    selectedPlugins = [bundler, ...selectedPlugins];
  }

  // 其他配置
  const otherQuestions: DistinctQuestion[] = [
    {
      type: 'confirm',
      name: 'initGit',
      message: '初始化 Git 仓库?',
      default: true,
      when: !options.skipGit,
    },
    {
      type: 'confirm',
      name: 'installDeps',
      message: '立即安装依赖?',
      default: true,
      when: !options.skipInstall,
    },
    {
      type: 'confirm',
      name: 'createVscodeConfig',
      message: '创建 VSCode 配置?',
      default: true,
    },
  ];

  const otherAnswers = await inquirer.prompt(otherQuestions);

  return {
    projectName: projectName || options.projectName || (basicAnswers.projectName as string),
    description: basicAnswers.description as string,
    author: basicAnswers.author as string,
    projectType,
    styleType,
    stateManager,
    httpClient,
    bundler,
    useTypeScript,
    plugins: selectedPlugins,
    packageManager: packageManagerAnswer.packageManager as 'npm' | 'yarn' | 'pnpm',
    initGit: otherAnswers.initGit as boolean,
    installDeps: otherAnswers.installDeps as boolean,
    createVscodeConfig: otherAnswers.createVscodeConfig as boolean,
  };
}

/**
 * 执行 init 命令
 */
export async function init(projectName: string | undefined, options: CLIOptions): Promise<void> {
  // 显示 CLI Banner
  showBanner();

  const currentDir = process.cwd();
  const projectPath = projectName
    ? path.join(currentDir, projectName)
    : currentDir;

  // 获取项目配置
  const config = await getProjectConfig(options, currentDir, projectName);

  // 检查目录是否存在
  if (projectName && (await fs.pathExists(projectPath))) {
    const { overwrite } = await inquirer.prompt({
      type: 'confirm',
      name: 'overwrite',
      message: `目录 ${projectName} 已存在，是否覆盖?`,
      default: false,
    });

    if (!overwrite) {
      logger.error('操作已取消');
      process.exit(0);
    }

    await fs.emptyDir(projectPath);
  }

  // 创建项目目录
  if (projectName) {
    await fs.ensureDir(projectPath);
  }

  // 获取选中的插件
  let selectedPlugins = config.plugins
    .map((name) => pluginMap.get(name))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  // 如果选择了 stylelint，根据样式类型动态修改依赖
  const hasStylelint = selectedPlugins.some(p => p.name === 'stylelint');
  if (hasStylelint) {
    const { createStylelintPlugin } = await import('../plugins/stylelint/index.js');
    const stylelintPluginInstance = createStylelintPlugin(config.styleType);
    // 替换原有的 stylelint 插件
    selectedPlugins = selectedPlugins.map(p => 
      p.name === 'stylelint' ? stylelintPluginInstance : p
    );
  }

  logger.info(`创建项目: ${config.projectName}`);
  logger.info(`项目类型: ${config.projectType}`);
  if (config.projectType === 'react' || config.projectType === 'vue') {
    logger.info(`样式预处理器: ${config.styleType}`);
    logger.info(`状态管理: ${config.stateManager === 'none' ? '无' : config.stateManager}`);
    logger.info(`HTTP 请求库: ${config.httpClient === 'none' ? '无' : config.httpClient}`);
  }
  logger.info(`选择的插件: ${selectedPlugins.map((p) => p.displayName).join(', ') || '无'}`);

  // 创建项目结构
  const spinner = ora('创建项目结构...').start();
  try {
    const context: PluginContext = {
      projectName: config.projectName,
      projectPath,
      projectType: config.projectType,
      styleType: config.styleType,
      stateManager: config.stateManager,
      httpClient: config.httpClient,
      bundler: config.bundler,
      selectedPlugins: config.plugins,
      useTypeScript: config.useTypeScript,
      packageManager: config.packageManager,
      options: {
        description: config.description,
        author: config.author,
      },
    };

    await createProjectStructure(projectPath, config.projectType, context);
    spinner.succeed('项目结构创建完成');
  } catch (error) {
    spinner.fail('创建项目结构失败');
    throw error;
  }

  // 生成配置文件
  const context: PluginContext = {
    projectName: config.projectName,
    projectPath,
    projectType: config.projectType,
    styleType: config.styleType,
    stateManager: config.stateManager,
    httpClient: config.httpClient,
    bundler: config.bundler,
    selectedPlugins: config.plugins,
    useTypeScript: config.useTypeScript,
    packageManager: config.packageManager,
    options: {
      description: config.description,
      author: config.author,
    },
  };

  // 生成插件文件
  spinner.start('生成配置文件...');
  try {
    const generator = new FileGenerator(context);
    // 对于 React/Vue 项目，打包工具配置已在模板中生成，需要过滤掉
    const bundlerFiles = ['webpack.config.cjs', 'vite.config.ts', 'vite.config.js', 'rollup.config.js'];
    const filteredPlugins = selectedPlugins.map((plugin) => {
      if ((config.projectType === 'react' || config.projectType === 'vue') &&
          (plugin.name === 'webpack' || plugin.name === 'vite' || plugin.name === 'rollup')) {
        // 返回一个不包含配置文件的插件版本（只保留依赖和脚本）
        return {
          ...plugin,
          files: plugin.files?.filter((f) => !bundlerFiles.includes(f.path)) || [],
        };
      }
      return plugin;
    });
    await generator.generateFromPlugins(filteredPlugins);
    spinner.succeed('配置文件生成完成');
  } catch (error) {
    spinner.fail('生成配置文件失败');
    throw error;
  }

  // 生成 package.json
  spinner.start('生成 package.json...');
  try {
    // 合并项目模板的依赖和脚本
    const templateDeps = getProjectDependencies(config.projectType, config.styleType, config.stateManager, config.httpClient, config.plugins, config.useTypeScript);
    const templateScripts = getProjectScripts(config.projectType, config.plugins, config.useTypeScript);

    await generatePackageJson(
      projectPath,
      config,
      selectedPlugins,
      templateDeps,
      templateScripts,
      context
    );
    spinner.succeed('package.json 生成完成');
  } catch (error) {
    spinner.fail('生成 package.json 失败');
    throw error;
  }

  // 创建 VSCode 配置
  if (config.createVscodeConfig) {
    spinner.start('创建 VSCode 配置...');
    try {
      await createVscodeConfig(projectPath, {
        projectType: config.projectType,
        styleType: config.styleType,
        hasStylelint: config.plugins.includes('stylelint'),
        hasPrettier: config.plugins.includes('prettier'),
        hasEslint: config.plugins.includes('eslint'),
      });
      spinner.succeed('VSCode 配置创建完成');
    } catch (error) {
      spinner.fail('创建 VSCode 配置失败');
      throw error;
    }
  }

  // 执行插件安装后回调
  for (const plugin of selectedPlugins) {
    if (plugin.postInstall) {
      spinner.start(`执行 ${plugin.displayName} 安装后操作...`);
      try {
        await plugin.postInstall(context);
        spinner.succeed(`${plugin.displayName} 安装后操作完成`);
      } catch (error) {
        spinner.fail(`${plugin.displayName} 安装后操作失败`);
        throw error;
      }
    }
  }

  // 安装依赖
  if (config.installDeps) {
    spinner.start('安装依赖...');
    try {
      await installDependencies(projectPath, config.packageManager);
      spinner.succeed('依赖安装完成');
    } catch (error) {
      spinner.fail('依赖安装失败');
      throw error;
    }
  }

  // 初始化 Git
  if (config.initGit) {
    spinner.start('初始化 Git 仓库...');
    try {
      await initGitRepo(projectPath);
      spinner.succeed('Git 仓库初始化完成');
    } catch (error) {
      spinner.fail('Git 仓库初始化失败');
      // Git 初始化失败不中断流程
      logger.warning('请确保已安装 Git');
    }
  }

  // 完成
  showSuccessMessage(config.projectName);
}
