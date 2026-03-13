import type { Plugin, PluginContext } from '../../types/index.js';
import { HTTP_CLIENT_VERSIONS } from '../../constants/index.js';
import { getAxiosConfig, getFetchConfig } from '../../templates/files/shared/http-client.js';

/**
 * Axios 插件
 */
export const axiosPlugin: Plugin = {
  name: 'axios',
  displayName: 'Axios',
  description: '添加 Axios HTTP 请求库封装',
  category: 'other',
  defaultEnabled: false,
  dependencies: {
    axios: HTTP_CLIENT_VERSIONS.axios,
  },
  files: [
    {
      path: 'src/api/request.ts',
      content: (context: PluginContext) => {
        return getAxiosConfig(context.bundler);
      },
    },
  ],
};

/**
 * Fetch 插件（原生 fetch 封装）
 */
export const fetchPlugin: Plugin = {
  name: 'fetch',
  displayName: 'Fetch',
  description: '添加原生 Fetch API 封装（无需额外依赖）',
  category: 'other',
  defaultEnabled: false,
  files: [
    {
      path: 'src/api/request.ts',
      content: (context: PluginContext) => {
        return getFetchConfig(context.bundler);
      },
    },
  ],
};

/**
 * 获取 HTTP 客户端选项列表
 */
export function getHttpClientChoices() {
  return [
    { name: 'Axios - 功能丰富的 HTTP 客户端（推荐）', value: 'axios' },
    { name: 'Fetch - 原生 API 封装（轻量无依赖）', value: 'fetch' },
    { name: '无 - 不使用 HTTP 请求库', value: 'none' },
  ];
}
