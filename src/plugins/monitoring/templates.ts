/**
 * 前端监控 SDK 模板
 * 提供 React 和 Vue 模板复用的监控代码
 */

/**
 * 获取 React 监控文件完整内容
 */
export function getReactMonitoringContent(useTypeScript: boolean, bundler: 'vite' | 'webpack' | 'rollup'): string {
  const typeAnnotation = useTypeScript ? ': ErrorInfo' : '';
  const interfaceDef = useTypeScript ? `
interface ErrorInfo {
  componentStack: string;
}

interface XStatConfig {
  server: string;
  appKey: string;
  appVersion: string;
  env: 'development' | 'test' | 'production';
}
` : '';

  const envAppKey = bundler === 'vite'
    ? "import.meta.env.VITE_APP_KEY || 'your-app-key'"
    : "process.env.REACT_APP_APP_KEY || 'your-app-key'";
  const envServer = bundler === 'vite'
    ? "import.meta.env.VITE_MONITOR_SERVER || 'https://your-server.com/api/log'"
    : "process.env.REACT_APP_MONITOR_SERVER || 'https://your-server.com/api/log'";
  const envMode = bundler === 'vite'
    ? 'import.meta.env.MODE'
    : 'process.env.NODE_ENV';
  const envVersion = bundler === 'vite'
    ? "import.meta.env.VITE_APP_VERSION || '1.0.0'"
    : "process.env.REACT_APP_VERSION || '1.0.0'";
  const devCheck = bundler === 'vite'
    ? 'import.meta.env.DEV'
    : "process.env.NODE_ENV === 'development'";

  const reactImport = useTypeScript
    ? "import React, { Component, type ReactNode } from 'react';"
    : "import React, { Component } from 'react';";

  return `${reactImport}
import XStat from '@jserxiao/xstat';
${interfaceDef}
// XStat 实例
let xstat${useTypeScript ? ': XStat | null' : ''} = null;

/**
 * 初始化 XStat 监控
 */
export function initXStat(config${useTypeScript ? ': Partial<XStatConfig>' : ''} = {}) {
  xstat = new XStat();

  xstat.init({
    server: config.server || ${envServer},
    appKey: config.appKey || ${envAppKey},
    appVersion: config.appVersion || ${envVersion},
    env: config.env || ${envMode},
    // 插件配置 - 自动注册
    plugins: {
      error: { react: React },  // React 错误监控
      performance: true,        // 性能监控
      behavior: true,           // 行为监控
      http: true,               // HTTP 请求监控
    },
    // 延迟批量上报
    delay: {
      max: 100,
      time: 3000,
      timeout: 10000,
    },
    // 发送方式
    sendType: 'xhr',
    // 采样率配置
    sampling: {
      error: 1,
      performance: 0.5,
      behavior: 0.3,
      pv: 1,
    },
    // 调试模式
    debug: ${devCheck},
  });

  return xstat;
}

/**
 * 获取 XStat 实例
 */
export function getXStat() {
  return xstat;
}

/**
 * 手动上报错误（React 组件错误捕获）
 */
export function reportError(error${useTypeScript ? ': Error' : ''}, errorInfo${typeAnnotation}) {
  if (xstat) {
    xstat.report('react_error', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      timestamp: Date.now(),
    });
  }
  // 开发环境输出到控制台
  if (${devCheck}) {
    console.error('React Error:', error);
    console.error('Component Stack:', errorInfo?.componentStack);
  }
}

/**
 * 手动上报自定义事件
 */
export function reportEvent(eventName${useTypeScript ? ': string' : ''}, data${useTypeScript ? ': Record<string, any>' : ''} = {}) {
  if (xstat) {
    xstat.report(eventName, {
      ...data,
      timestamp: Date.now(),
    });
  }
}

/**
 * 获取 React 错误边界组件
 * 使用 xstat 内置的 ReactErrorPlugin
 */
export function getErrorBoundary() {
  if (!xstat) {
    return null;
  }
  const plugin = xstat.getPlugin('ReactErrorPlugin');
  return plugin?.createErrorBoundary(React);
}

// React 错误边界组件属性
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error${useTypeScript ? '?: Error' : ''};
}

/**
 * React 错误边界组件
 * 用于捕获子组件的渲染错误并上报
 */
export class ReactErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props${useTypeScript ? ': ErrorBoundaryProps' : ''}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error${useTypeScript ? ': Error' : ''}) {
    return { hasError: true, error };
  }

  componentDidCatch(error${useTypeScript ? ': Error' : ''}, errorInfo${typeAnnotation}) {
    reportError(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>出错了</h2>
          <p>应用遇到了一些问题，请刷新页面重试</p>
          <button onClick={() => window.location.reload()}>刷新页面</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// 默认导出配置（用于自动初始化）
export const defaultXStatConfig = {
  server: ${envServer},
  appKey: ${envAppKey},
  appVersion: ${envVersion},
  env: ${envMode},
};
`;
}

/**
 * 获取 Vue 监控文件完整内容
 */
export function getVueMonitoringContent(useTypeScript: boolean, bundler: 'vite' | 'webpack' | 'rollup'): string {
  const interfaceDef = useTypeScript ? `
interface XStatConfig {
  server: string;
  appKey: string;
  appVersion: string;
  env: 'development' | 'test' | 'production';
}
` : '';

  const envAppKey = bundler === 'vite'
    ? "import.meta.env.VITE_APP_KEY || 'your-app-key'"
    : "process.env.VUE_APP_KEY || 'your-app-key'";
  const envServer = bundler === 'vite'
    ? "import.meta.env.VITE_MONITOR_SERVER || 'https://your-server.com/api/log'"
    : "process.env.VUE_MONITOR_SERVER || 'https://your-server.com/api/log'";
  const envMode = bundler === 'vite'
    ? 'import.meta.env.MODE'
    : 'process.env.NODE_ENV';
  const envVersion = bundler === 'vite'
    ? "import.meta.env.VITE_APP_VERSION || '1.0.0'"
    : "process.env.VUE_APP_VERSION || '1.0.0'";
  const devCheck = bundler === 'vite'
    ? 'import.meta.env.DEV'
    : "process.env.NODE_ENV === 'development'";

  return `import XStat from '@jserxiao/xstat';
${interfaceDef}
// XStat 实例
let xstat${useTypeScript ? ': XStat | null' : ''} = null;

/**
 * 初始化 XStat 监控
 * @param app - Vue 应用实例（用于 Vue 错误监控）
 */
export function initXStat(app${useTypeScript ? ': any' : ''}, config${useTypeScript ? ': Partial<XStatConfig>' : ''} = {}) {
  xstat = new XStat();

  xstat.init({
    server: config.server || ${envServer},
    appKey: config.appKey || ${envAppKey},
    appVersion: config.appVersion || ${envVersion},
    env: config.env || ${envMode},
    // 插件配置 - 自动注册
    plugins: {
      error: app ? { vue: app } : true,  // Vue 错误监控
      performance: true,                  // 性能监控
      behavior: true,                     // 行为监控
      http: true,                         // HTTP 请求监控
    },
    // 延迟批量上报
    delay: {
      max: 100,
      time: 3000,
      timeout: 10000,
    },
    // 发送方式
    sendType: 'xhr',
    // 采样率配置
    sampling: {
      error: 1,
      performance: 0.5,
      behavior: 0.3,
      pv: 1,
    },
    // 调试模式
    debug: ${devCheck},
  });

  return xstat;
}

/**
 * 获取 XStat 实例
 */
export function getXStat() {
  return xstat;
}

/**
 * Vue 错误处理器
 * 用于捕获 Vue 组件的渲染错误并上报
 */
export function vueErrorHandler(err${useTypeScript ? ': unknown' : ''}, instance${useTypeScript ? ': any' : ''}, info${useTypeScript ? ': string' : ''}) {
  // 获取组件名称
  const componentName = instance?.$options?.name || instance?.__name || 'AnonymousComponent';

  // 构造错误信息
  const errorInfo = {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    component: componentName,
    info,
    timestamp: Date.now(),
  };

  // 上报错误
  if (xstat) {
    xstat.report('vue_error', errorInfo);
  }

  // 开发环境输出到控制台
  if (${devCheck}) {
    console.error('Vue Error:', err);
    console.error('Component:', componentName);
    console.error('Info:', info);
  }
}

/**
 * 手动上报错误
 */
export function reportError(error${useTypeScript ? ': Error' : ''}, extra${useTypeScript ? '?: Record<string, any>' : ''} = {}) {
  if (xstat) {
    xstat.report('custom_error', {
      error: error.message,
      stack: error.stack,
      ...extra,
      timestamp: Date.now(),
    });
  }
}

/**
 * 手动上报自定义事件
 */
export function reportEvent(eventName${useTypeScript ? ': string' : ''}, data${useTypeScript ? ': Record<string, any>' : ''} = {}) {
  if (xstat) {
    xstat.report(eventName, {
      ...data,
      timestamp: Date.now(),
    });
  }
}

// 默认导出配置（用于自动初始化）
export const defaultXStatConfig = {
  server: ${envServer},
  appKey: ${envAppKey},
  appVersion: ${envVersion},
  env: ${envMode},
};
`;
}
