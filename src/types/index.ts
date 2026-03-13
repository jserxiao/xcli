/**
 * 插件定义
 */
export interface Plugin {
  /** 插件名称 */
  name: string;
  /** 插件显示名称 */
  displayName: string;
  /** 插件描述 */
  description: string;
  /** 插件类别 */
  category: 'linter' | 'formatter' | 'test' | 'git' | 'bundler' | 'other';
  /** 是否默认启用 */
  defaultEnabled?: boolean;
  /** 依赖包 */
  dependencies?: Record<string, string>;
  /** 开发依赖包 */
  devDependencies?: Record<string, string>;
  /** 需要生成的文件 */
  files?: PluginFile[];
  /** 需要添加的 npm scripts */
  scripts?: Record<string, string>;
  /** 安装后的回调 */
  postInstall?: (context: PluginContext) => Promise<void>;
}

/**
 * 插件文件定义
 */
export interface PluginFile {
  /** 文件路径（相对于项目根目录） */
  path: string;
  /** 文件内容（可以是字符串或模板路径） */
  content: string | ((context: PluginContext) => string);
  /** 是否是模板文件 */
  isTemplate?: boolean;
}

/**
 * 插件上下文
 */
export interface PluginContext {
  /** 项目名称 */
  projectName: string;
  /** 项目路径 */
  projectPath: string;
  /** 项目类型 */
  projectType: ProjectType;
  /** 样式预处理器 */
  styleType: StyleType;
  /** 状态管理 */
  stateManager: StateManagerType;
  /** HTTP 请求库 */
  httpClient: HttpClientType;
  /** 打包工具 */
  bundler: BundlerType;
  /** 用户选择的插件列表 */
  selectedPlugins: string[];
  /** 是否使用 TypeScript */
  useTypeScript: boolean;
  /** 包管理器 */
  packageManager: 'npm' | 'yarn' | 'pnpm';
  /** 其他配置选项 */
  options: Record<string, any>;
}

/**
 * 项目类型
 */
export type ProjectType = 'library' | 'react' | 'vue';

/**
 * 样式预处理器类型
 */
export type StyleType = 'css' | 'less' | 'scss';

/**
 * 状态管理类型
 */
export type StateManagerType = 'none' | 'redux' | 'mobx' | 'pinia';

/**
 * HTTP 请求库类型
 */
export type HttpClientType = 'axios' | 'fetch' | 'none';

/**
 * 打包工具类型
 */
export type BundlerType = 'vite' | 'webpack' | 'rollup' | 'none';

/**
 * 项目配置
 */
export interface ProjectConfig {
  /** 项目名称 */
  projectName: string;
  /** 项目描述 */
  description?: string;
  /** 作者 */
  author?: string;
  /** 项目类型 */
  projectType: ProjectType;
  /** 样式预处理器 */
  styleType: StyleType;
  /** 状态管理 */
  stateManager: StateManagerType;
  /** HTTP 请求库 */
  httpClient: HttpClientType;
  /** 打包工具 */
  bundler: BundlerType;
  /** 是否使用 TypeScript */
  useTypeScript: boolean;
  /** 选择的插件 */
  plugins: string[];
  /** 包管理器 */
  packageManager: 'npm' | 'yarn' | 'pnpm';
  /** 是否初始化 Git */
  initGit: boolean;
  /** 是否立即安装依赖 */
  installDeps: boolean;
  /** 是否创建 VSCode 配置 */
  createVscodeConfig: boolean;
}

/**
 * CLI 选项
 */
export interface CLIOptions {
  /** 项目名称（命令行指定） */
  projectName?: string;
  /** 模板名称 */
  template?: string;
  /** 样式预处理器 */
  style?: 'css' | 'less' | 'scss';
  /** 状态管理 */
  stateManager?: 'none' | 'redux' | 'mobx' | 'pinia';
  /** HTTP 请求库 */
  httpClient?: HttpClientType;
  /** 打包工具 */
  bundler?: BundlerType;
  /** 跳过安装依赖 */
  skipInstall?: boolean;
  /** 跳过 Git 初始化 */
  skipGit?: boolean;
  /** 使用默认配置 */
  default?: boolean;
  /** 包管理器 */
  packageManager?: 'npm' | 'yarn' | 'pnpm';
}
