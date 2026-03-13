import type { Plugin, PluginContext } from '../types/index.js';

/**
 * 获取 Axios 封装配置
 */
function getAxiosConfig(context: PluginContext) {
  return `import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

/**
 * 创建 Axios 实例
 */
const createAxiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
    ...config,
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config) => {
      // 可在此添加 token
      // const token = localStorage.getItem('token');
      // if (token) config.headers.Authorization = \`Bearer \${token}\`;
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    (error: AxiosError) => {
      // 统一错误处理
      if (error.response?.status === 401) {
        // 未授权，跳转登录
        // window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// 默认实例
const request = createAxiosInstance();

// 通用请求方法
export const http = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    request.get(url, config),

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    request.post(url, data, config),

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    request.put(url, data, config),

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> =>
    request.delete(url, config),

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> =>
    request.patch(url, data, config),
};

export { axios, createAxiosInstance };
export default request;
`;
}

/**
 * 获取 Fetch 封装配置
 */
function getFetchConfig(context: PluginContext) {
  return `/**
 * Fetch 请求封装
 */

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number>;
  timeout?: number;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * 创建带超时的 fetch
 */
const fetchWithTimeout = async (url: string, config: RequestConfig = {}): Promise<Response> => {
  const { timeout = 10000, ...fetchConfig } = config;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchConfig,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * 通用请求方法
 */
const request = async <T = any>(
  url: string,
  config: RequestConfig = {}
): Promise<T> => {
  const { params, ...fetchConfig } = config;
  
  // 构建完整 URL
  let fullUrl = \`\${BASE_URL}\${url}\`;
  if (params) {
    const searchParams = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    );
    fullUrl += \`?\${searchParams.toString()}\`;
  }

  // 添加默认 headers
  const headers = new Headers(fetchConfig.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetchWithTimeout(fullUrl, {
    ...fetchConfig,
    headers,
  });

  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }

  return response.json();
};

/**
 * HTTP 方法封装
 */
export const http = {
  get: <T = any>(url: string, params?: Record<string, string | number>): Promise<T> =>
    request<T>(url, { method: 'GET', params }),

  post: <T = any>(url: string, data?: any): Promise<T> =>
    request<T>(url, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  put: <T = any>(url: string, data?: any): Promise<T> =>
    request<T>(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  delete: <T = any>(url: string): Promise<T> =>
    request<T>(url, { method: 'DELETE' }),

  patch: <T = any>(url: string, data?: any): Promise<T> =>
    request<T>(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
};

export default request;
`;
}

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
    axios: '^1.6.0',
  },
  files: [
    {
      path: 'src/api/request.ts',
      content: (context: PluginContext) => getAxiosConfig(context),
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
      content: (context: PluginContext) => getFetchConfig(context),
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
