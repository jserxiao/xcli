import type { ProjectType, PluginContext, StyleType, StateManagerType, HttpClientType, BundlerType } from '../types/index.js';
import { createBaseFiles } from '../utils/fileGenerator.js';
import { libraryTemplate } from './library.js';
import { reactTemplate } from './react.js';
import { vueTemplate } from './vue.js';

/**
 * 获取打包工具类型
 */
function getBundlerType(selectedPlugins: string[]): BundlerType {
  if (selectedPlugins.includes('vite')) return 'vite';
  if (selectedPlugins.includes('webpack')) return 'webpack';
  if (selectedPlugins.includes('rollup')) return 'rollup';
  return 'none';
}

/**
 * 所有可用模板
 */
export const templates = [libraryTemplate, reactTemplate, vueTemplate];

/**
 * 模板映射表
 */
export const templateMap = new Map<ProjectType, typeof libraryTemplate>(
  templates.map((t) => [t.type, t])
);

/**
 * 获取模板列表（用于交互式选择）
 */
export function getTemplateChoices() {
  return templates.map((t) => ({
    name: `${t.displayName} - ${t.description}`,
    value: t.type,
  }));
}

/**
 * 获取样式预处理器选项
 */
export function getStyleChoices() {
  return [
    { name: 'CSS - 原生 CSS', value: 'css' },
    { name: 'Less - CSS 预处理器', value: 'less' },
    { name: 'Sass/SCSS - CSS 预处理器', value: 'scss' },
  ];
}

/**
 * 获取状态管理选项
 */
export function getStateManagerChoices(projectType: ProjectType) {
  if (projectType === 'react') {
    return [
      { name: '无 - 不使用状态管理', value: 'none' },
      { name: 'Redux Toolkit - React 官方推荐状态管理', value: 'redux' },
      { name: 'MobX - 简单可扩展的状态管理', value: 'mobx' },
    ];
  }
  if (projectType === 'vue') {
    return [
      { name: 'Pinia - Vue 官方状态管理', value: 'pinia' },
      { name: '无 - 不使用状态管理', value: 'none' },
    ];
  }
  return [{ name: '无', value: 'none' }];
}

/**
 * 根据项目类型获取模板
 */
export function getTemplate(type: ProjectType) {
  return templateMap.get(type);
}

/**
 * 创建项目结构
 */
export async function createProjectStructure(
  projectPath: string,
  projectType: ProjectType,
  context: PluginContext
) {
  const template = getTemplate(projectType);
  if (!template) {
    throw new Error(`Unknown project type: ${projectType}`);
  }

  // 创建项目特定结构
  await template.createStructure(projectPath, context);

  // 创建基础文件（.gitignore 和 README.md）
  await createBaseFiles(projectPath, context.projectName, projectType, {
    styleType: context.styleType,
    stateManager: context.stateManager,
    httpClient: context.httpClient,
  });
}

/**
 * 获取项目的依赖
 */
export function getProjectDependencies(
  projectType: ProjectType,
  styleType: StyleType = 'less',
  stateManager: StateManagerType = 'none',
  httpClient: HttpClientType = 'axios',
  selectedPlugins: string[] = [],
  useTypeScript: boolean = true
) {
  const template = getTemplate(projectType);
  if (!template) {
    return { dependencies: {}, devDependencies: {} };
  }

  const bundler = getBundlerType(selectedPlugins);

  // 如果模板支持样式和状态管理参数
  if (projectType === 'react') {
    return reactTemplate.getDependencies(styleType, stateManager, httpClient, bundler, useTypeScript);
  }
  if (projectType === 'vue') {
    return vueTemplate.getDependencies(styleType, stateManager, httpClient, bundler, useTypeScript);
  }

  return template.getDependencies();
}

/**
 * 获取项目的脚本
 */
export function getProjectScripts(projectType: ProjectType, selectedPlugins: string[] = [], useTypeScript: boolean = true) {
  const template = getTemplate(projectType);
  if (!template) {
    return {};
  }

  const bundler = getBundlerType(selectedPlugins);

  // React/Vue 模板支持打包工具参数
  if (projectType === 'react' || projectType === 'vue') {
    return template.getScripts(bundler, useTypeScript);
  }

  return template.getScripts();
}
