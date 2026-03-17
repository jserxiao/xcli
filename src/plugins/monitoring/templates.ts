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

interface XStatOptions {
  appId: string;
  env: string;
  version: string;
}
` : '';

  const envAppId = bundler === 'vite'
    ? "import.meta.env.VITE_APP_ID || 'your-app-id'"
    : "process.env.APP_ID || 'your-app-id'";
  const envMode = bundler === 'vite'
    ? 'import.meta.env.MODE'
    : 'process.env.NODE_ENV';
  const envVersion = bundler === 'vite'
    ? "import.meta.env.VITE_APP_VERSION || '1.0.0'"
    : "process.env.APP_VERSION || '1.0.0'";
  const devCheck = bundler === 'vite'
    ? 'import.meta.env.DEV'
    : "process.env.NODE_ENV === 'development'";

  return `import React, { Component, type ReactNode } from 'react';
import XStat from '@jserxiao/xstat';
${interfaceDef}
// XStat 实例
let xstat${useTypeScript ? ': XStat | null' : ''} = null;

/**
 * 初始化 XStat 监控
 */
export function initXStat(options${useTypeScript ? ': XStatOptions' : ''}) {
  xstat = new XStat({
    appId: options.appId,
    env: options.env,
    version: options.version,
    // 性能监控配置
    performance: {
      enable: true,
      sampleRate: 1.0,
    },
    // 错误监控配置
    error: {
      enable: true,
      captureJsError: true,
      capturePromiseError: true,
      captureResourceError: true,
    },
    // 请求监控配置
    request: {
      enable: true,
      captureFetch: true,
      captureXHR: true,
    },
    // 行为监控配置
    behavior: {
      enable: true,
      captureClick: true,
      captureRoute: true,
    },
  });

  // 上报应用启动
  xstat.report('app_start', {
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
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
  appId: ${envAppId},
  env: ${envMode},
  version: ${envVersion},
};
`;
}

/**
 * 获取 Vue 监控文件完整内容
 */
export function getVueMonitoringContent(useTypeScript: boolean, bundler: 'vite' | 'webpack' | 'rollup'): string {
  const interfaceDef = useTypeScript ? `
interface XStatOptions {
  appId: string;
  env: string;
  version: string;
}
` : '';

  const envAppId = bundler === 'vite'
    ? "import.meta.env.VITE_APP_ID || 'your-app-id'"
    : "process.env.APP_ID || 'your-app-id'";
  const envMode = bundler === 'vite'
    ? 'import.meta.env.MODE'
    : 'process.env.NODE_ENV';
  const envVersion = bundler === 'vite'
    ? "import.meta.env.VITE_APP_VERSION || '1.0.0'"
    : "process.env.APP_VERSION || '1.0.0'";
  const devCheck = bundler === 'vite'
    ? 'import.meta.env.DEV'
    : "process.env.NODE_ENV === 'development'";

  return `import XStat from '@jserxiao/xstat';
${interfaceDef}
// XStat 实例
let xstat${useTypeScript ? ': XStat | null' : ''} = null;

/**
 * 初始化 XStat 监控
 */
export function initXStat(options${useTypeScript ? ': XStatOptions' : ''}) {
  xstat = new XStat({
    appId: options.appId,
    env: options.env,
    version: options.version,
    // 性能监控配置
    performance: {
      enable: true,
      sampleRate: 1.0,
    },
    // 错误监控配置
    error: {
      enable: true,
      captureJsError: true,
      capturePromiseError: true,
      captureResourceError: true,
    },
    // 请求监控配置
    request: {
      enable: true,
      captureFetch: true,
      captureXHR: true,
    },
    // 行为监控配置
    behavior: {
      enable: true,
      captureClick: true,
      captureRoute: true,
    },
  });

  // 上报应用启动
  xstat.report('app_start', {
    timestamp: Date.now(),
    userAgent: navigator.userAgent,
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
  appId: ${envAppId},
  env: ${envMode},
  version: ${envVersion},
};
`;
}
