import type { Plugin, PluginContext } from '../../types';
import { MONITORING_VERSIONS } from '../../constants';
import {
  getReactMonitoringContent,
  getVueMonitoringContent,
} from './templates';

/**
 * XStat 监控插件
 */
export const xstatPlugin: Plugin = {
  name: 'xstat',
  displayName: 'XStat',
  description: '添加 @jserxiao/xstat 前端监控 SDK',
  category: 'other',
  defaultEnabled: false,
  dependencies: {
    '@jserxiao/xstat': MONITORING_VERSIONS['@jserxiao/xstat'],
  },
  files: [
    {
      path: (context: PluginContext) => {
        // React 项目使用 .tsx/.jsx 扩展名（包含 JSX），Vue 项目使用 .ts/.js
        const ext = context.projectType === 'react'
          ? (context.useTypeScript ? '.tsx' : '.jsx')
          : (context.useTypeScript ? '.ts' : '.js');
        return `src/utils/monitoring${ext}`;
      },
      content: (context: PluginContext) => {
        const bundler = context.bundler === 'none' ? 'vite' : context.bundler;
        if (context.projectType === 'react') {
          return getReactMonitoringContent(context.useTypeScript ?? true, bundler);
        }
        if (context.projectType === 'vue') {
          return getVueMonitoringContent(context.useTypeScript ?? true, bundler);
        }
        return '';
      },
    },
  ],
};

/**
 * 获取监控 SDK 选项列表
 */
export function getMonitoringChoices(projectType: string) {
  if (projectType === 'react' || projectType === 'vue') {
    return [
      { name: '无 - 不集成监控', value: 'none' },
      { name: '@jserxiao/xstat - 前端性能监控 SDK', value: 'xstat' },
    ];
  }
  return [{ name: '无', value: 'none' }];
}
