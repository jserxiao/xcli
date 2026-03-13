import type { ProjectType, PluginContext, StyleType, StateManagerType, HttpClientType, BundlerType } from '../types/index.js';
import path from 'path';
import fs from 'fs-extra';
import {
  getStyleExt,
  getBaseStyles,
  getAppStyles,
  getPageStyles,
  createRootConfigFiles,
  createSrcDirectories,
  createSharedPackage,
  createReactUiPackage,
  getViteEnvDts,
  // 状态管理模板
  getReduxStoreIndex,
  getReduxCounterSlice,
  getReduxApiSlice,
  getReduxLoggerMiddleware,
  getMobXCounterStore,
  getMobXStoreIndex,
} from './shared.js';
import { axiosPlugin, fetchPlugin } from '../plugins/http-client/index.js';

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
 * 创建 Redux store 文件
 */
async function createReduxStore(projectPath: string, bundler: BundlerType = 'vite') {
  const storePath = path.join(projectPath, 'src', 'store');
  await fs.ensureDir(storePath);
  await fs.ensureDir(path.join(storePath, 'middleware'));

  // store/index.ts
  await fs.writeFile(
    path.join(storePath, 'index.ts'),
    getReduxStoreIndex(bundler),
    'utf-8'
  );

  // store/counterSlice.ts
  await fs.writeFile(
    path.join(storePath, 'counterSlice.ts'),
    getReduxCounterSlice(),
    'utf-8'
  );

  // store/apiSlice.ts
  await fs.writeFile(
    path.join(storePath, 'apiSlice.ts'),
    getReduxApiSlice(),
    'utf-8'
  );

  // store/middleware/logger.ts
  await fs.writeFile(
    path.join(storePath, 'middleware', 'logger.ts'),
    getReduxLoggerMiddleware(bundler),
    'utf-8'
  );
}

/**
 * 创建 MobX store 文件
 */
async function createMobXStore(projectPath: string) {
  const storePath = path.join(projectPath, 'src', 'store');
  await fs.ensureDir(storePath);

  // store/CounterStore.ts
  await fs.writeFile(
    path.join(storePath, 'CounterStore.ts'),
    getMobXCounterStore(),
    'utf-8'
  );

  // store/index.ts
  await fs.writeFile(
    path.join(storePath, 'index.ts'),
    getMobXStoreIndex(),
    'utf-8'
  );
}

/**
 * React 项目模板 (pnpm monorepo)
 */
export const reactTemplate = {
  type: 'react' as ProjectType,
  displayName: 'React',
  description: 'React 前端项目 (pnpm monorepo)',

  createStructure: async (projectPath: string, context: PluginContext) => {
    const { styleType = 'css', stateManager = 'none', httpClient = 'axios', bundler = 'vite', selectedPlugins = [] } = context;
    const styleExt = getStyleExt(styleType);

    // ============ 根目录文件 ============

    // 根据打包工具生成不同的 package.json
    const basePackageJson: Record<string, any> = {
      name: context.projectName,
      version: '1.0.0',
      private: true,
      description: context.options.description || '',
      author: context.options.author || '',
      license: 'MIT',
      type: 'module',
      dependencies: {
        shared: 'workspace:*',
        ui: 'workspace:*',
      },
    };

    // 根据打包工具设置不同的 scripts 和 devDependencies
    if (bundler === 'vite') {
      basePackageJson.scripts = {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
        lint: 'eslint src --ext .ts,.tsx',
        'lint:fix': 'eslint src --ext .ts,.tsx --fix',
        format: 'prettier --write "src/**/*.{ts,tsx,css,scss,less}"',
        clean: 'rm -rf dist node_modules',
      };
      basePackageJson.devDependencies = {
        '@vitejs/plugin-legacy': '^5.3.0',
        '@vitejs/plugin-react': '^4.2.1',
        autoprefixer: '^10.4.17',
      };
    } else if (bundler === 'webpack') {
      basePackageJson.scripts = {
        dev: 'webpack serve --mode development',
        build: 'webpack --mode production',
        lint: 'eslint src --ext .ts,.tsx',
        'lint:fix': 'eslint src --ext .ts,.tsx --fix',
        format: 'prettier --write "src/**/*.{ts,tsx,css,scss,less}"',
        clean: 'rm -rf dist node_modules',
      };
      basePackageJson.devDependencies = {
        webpack: '^5.98.0',
        'webpack-cli': '^6.0.1',
        'webpack-dev-server': '^5.2.3',
        'html-webpack-plugin': '^5.6.0',
        'ts-loader': '^9.5.1',
        'css-loader': '^7.1.2',
        'style-loader': '^4.0.0',
        'mini-css-extract-plugin': '^2.9.2',
        autoprefixer: '^10.4.21',
        'postcss-loader': '^8.1.1',
        // React 热更新
        '@pmmmwh/react-refresh-webpack-plugin': '^0.5.15',
        'react-refresh': '^0.17.0',
      };
    } else {
      // 默认使用 vite 或无打包工具
      basePackageJson.scripts = {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
        lint: 'eslint src --ext .ts,.tsx',
        'lint:fix': 'eslint src --ext .ts,.tsx --fix',
        format: 'prettier --write "src/**/*.{ts,tsx,css,scss,less}"',
        clean: 'rm -rf dist node_modules',
      };
      basePackageJson.devDependencies = {
        '@vitejs/plugin-legacy': '^5.3.0',
        '@vitejs/plugin-react': '^4.2.1',
        autoprefixer: '^10.4.17',
      };
    }

    // 创建根目录 package.json
    await fs.writeFile(
      path.join(projectPath, 'package.json'),
      JSON.stringify(basePackageJson, null, 2),
      'utf-8'
    );

    // 创建通用配置文件
    await createRootConfigFiles(projectPath, 'react', bundler);

    // ============ src 目录 (主应用源代码) ============
    await createSrcDirectories(projectPath);
    await fs.ensureDir(path.join(projectPath, 'public'));

    // 创建状态管理相关文件
    if (stateManager === 'redux') {
      await createReduxStore(projectPath, bundler);
    } else if (stateManager === 'mobx') {
      await createMobXStore(projectPath);
    }

    // 创建 HTTP 请求相关文件
    if (httpClient === 'axios') {
      await fs.ensureDir(path.join(projectPath, 'src', 'api'));
      const content = axiosPlugin.files![0].content;
      await fs.writeFile(
        path.join(projectPath, 'src', 'api', 'request.ts'),
        typeof content === 'function' ? content(context) : content,
        'utf-8'
      );
    } else if (httpClient === 'fetch') {
      await fs.ensureDir(path.join(projectPath, 'src', 'api'));
      const content = fetchPlugin.files![0].content;
      await fs.writeFile(
        path.join(projectPath, 'src', 'api', 'request.ts'),
        typeof content === 'function' ? content(context) : content,
        'utf-8'
      );
    }

    // index.html
    await fs.writeFile(
      path.join(projectPath, 'index.html'),
      `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${context.projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
      'utf-8'
    );

    // src/main.tsx (根据状态管理生成不同内容)
    let mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.${styleExt}';
`;

    if (stateManager === 'redux') {
      mainTsx += `import { store } from './store';
import { Provider } from 'react-redux';
`;
      mainTsx += `
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
`;
    } else {
      mainTsx += `
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;
    }

    await fs.writeFile(path.join(projectPath, 'src', 'main.tsx'), mainTsx, 'utf-8');

    // src/router/index.tsx
    await fs.writeFile(
      path.join(projectPath, 'src', 'router', 'index.tsx'),
      `import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import About from '../pages/About';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'about',
        element: <About />,
      },
    ],
  },
]);

export default router;
`,
      'utf-8'
    );

    // src/components/Layout.tsx
    await fs.writeFile(
      path.join(projectPath, 'src', 'components', 'Layout.tsx'),
      `import { NavLink, Outlet } from 'react-router-dom';
import './Layout.${styleExt}';

function Layout() {
  return (
    <div className="app">
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          首页
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
          关于
        </NavLink>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
`,
      'utf-8'
    );

    // src/components/Layout.xxx
    await fs.writeFile(
      path.join(projectPath, 'src', 'components', `Layout.${styleExt}`),
      getAppStyles(styleType, 'react'),
      'utf-8'
    );

    // src/App.tsx
    await fs.writeFile(
      path.join(projectPath, 'src', 'App.tsx'),
      `import { RouterProvider } from 'react-router-dom';
import router from './router';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
`,
      'utf-8'
    );

    // src/index.xxx
    await fs.writeFile(
      path.join(projectPath, 'src', `index.${styleExt}`),
      getBaseStyles(),
      'utf-8'
    );

    // src/pages/Home.tsx (根据状态管理生成不同内容)
    let homeTsx = '';
    if (stateManager === 'redux') {
      homeTsx = `import { useAppDispatch, useAppSelector } from '../store';
import { decrement, increment } from '../store/counterSlice';
import './Home.${styleExt}';

function Home() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="page">
      <h1>首页</h1>
      <p>欢迎使用 ${context.projectName}</p>
      <div className="card">
        <button onClick={() => dispatch(decrement())}>-</button>
        <span style={{ margin: '0 1rem' }}>count is {count}</span>
        <button onClick={() => dispatch(increment())}>+</button>
      </div>
    </div>
  );
}

export default Home;
`;
    } else if (stateManager === 'mobx') {
      homeTsx = `import { observer } from 'mobx-react-lite';
import { counterStore } from '../store';
import './Home.${styleExt}';

const Home = observer(() => {
  return (
    <div className="page">
      <h1>首页</h1>
      <p>欢迎使用 ${context.projectName}</p>
      <div className="card">
        <button onClick={() => counterStore.decrement()}>-</button>
        <span style={{ margin: '0 1rem' }}>count is {counterStore.count}</span>
        <button onClick={() => counterStore.increment()}>+</button>
      </div>
    </div>
  );
});

export default Home;
`;
    } else {
      homeTsx = `import { useState } from 'react';
import './Home.${styleExt}';

function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="page">
      <h1>首页</h1>
      <p>欢迎使用 ${context.projectName}</p>
      <div className="card">
        <button onClick={() => setCount((count) => count - 1)}>-</button>
        <span style={{ margin: '0 1rem' }}>count is {count}</span>
        <button onClick={() => setCount((count) => count + 1)}>+</button>
      </div>
    </div>
  );
}

export default Home;
`;
    }
    await fs.writeFile(path.join(projectPath, 'src', 'pages', 'Home.tsx'), homeTsx, 'utf-8');

    // src/pages/Home.xxx
    await fs.writeFile(
      path.join(projectPath, 'src', 'pages', `Home.${styleExt}`),
      getPageStyles(styleType),
      'utf-8'
    );

    // src/pages/About.tsx
    await fs.writeFile(
      path.join(projectPath, 'src', 'pages', 'About.tsx'),
      `import { formatDate, sleep } from 'shared';
import { Button } from 'ui';
import { useState, useEffect } from 'react';
import './About.${styleExt}';

function About() {
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    // 使用 shared 包中的工具函数
    setDate(formatDate(new Date()));

    // 示例：使用 sleep 函数
    sleep(1000).then(() => {
      console.log('Welcome to ${context.projectName}!');
    });
  }, []);

  return (
    <div className="page">
      <h1>关于</h1>
      <p>这是一个使用 React + Vite + React Router 构建的 monorepo 项目。</p>
      <p>当前日期: {date}</p>
      <div className="button-demo">
        <p>UI 组件库示例:</p>
        <Button variant="primary" onClick={() => alert('Primary clicked!')}>
          Primary Button
        </Button>
        <Button variant="secondary" onClick={() => alert('Secondary clicked!')}>
          Secondary Button
        </Button>
      </div>
    </div>
  );
}

export default About;
`,
      'utf-8'
    );

    // src/pages/About.xxx
    await fs.writeFile(
      path.join(projectPath, 'src', 'pages', `About.${styleExt}`),
      getPageStyles(styleType),
      'utf-8'
    );

    // 根据打包工具生成配置文件
    if (bundler === 'vite') {
      // src/vite-env.d.ts
      await fs.writeFile(
        path.join(projectPath, 'src', 'vite-env.d.ts'),
        getViteEnvDts('react'),
        'utf-8'
      );

      // vite.config.ts
      await fs.writeFile(
        path.join(projectPath, 'vite.config.ts'),
        `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    sourcemap: true,
  },
});
`,
        'utf-8'
      );
    } else if (bundler === 'webpack') {
      // webpack.config.cjs for React
      const { createWebpackPlugin } = await import('../plugins/webpack/index.js');
      const webpackPluginInstance = createWebpackPlugin('react', styleType);
      const webpackConfig = webpackPluginInstance.files![0].content;
      await fs.writeFile(
        path.join(projectPath, 'webpack.config.cjs'),
        typeof webpackConfig === 'function' ? webpackConfig(context) : webpackConfig,
        'utf-8'
      );
    }

    // ============ packages 目录 (monorepo 其他包) ============
    await fs.ensureDir(path.join(projectPath, 'packages'));

    // 创建 shared 包
    await createSharedPackage(projectPath);

    // 创建 ui 包 (React 版本)
    await createReactUiPackage(projectPath);
  },

  getDependencies: (styleType: StyleType = 'css', stateManager: StateManagerType = 'none', httpClient: HttpClientType = 'axios', bundler: BundlerType = 'vite') => {
    const deps: {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    } = {
      dependencies: {
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-router-dom': '^6.22.0',
        // Monorepo workspace 包引用
        shared: 'workspace:*',
        ui: 'workspace:*',
      },
      devDependencies: {
        '@types/react': '^18.2.48',
        '@types/react-dom': '^18.2.18',
        typescript: '^5.3.3',
      },
    };

    // 打包工具相关依赖
    if (bundler === 'vite') {
      deps.devDependencies['vite'] = '^5.0.0';
      deps.devDependencies['@vitejs/plugin-react'] = '^4.2.1';
      deps.devDependencies['@vitejs/plugin-legacy'] = '^5.3.0';
      deps.devDependencies['autoprefixer'] = '^10.4.17';
    } else if (bundler === 'webpack') {
      deps.devDependencies['webpack'] = '^5.98.0';
      deps.devDependencies['webpack-cli'] = '^6.0.1';
      deps.devDependencies['webpack-dev-server'] = '^5.2.3';
      deps.devDependencies['html-webpack-plugin'] = '^5.6.0';
      deps.devDependencies['ts-loader'] = '^9.5.1';
      deps.devDependencies['css-loader'] = '^7.1.2';
      deps.devDependencies['style-loader'] = '^4.0.0';
      deps.devDependencies['mini-css-extract-plugin'] = '^2.9.2';
      deps.devDependencies['autoprefixer'] = '^10.4.21';
      deps.devDependencies['postcss-loader'] = '^8.1.1';
      // React 热更新
      deps.devDependencies['@pmmmwh/react-refresh-webpack-plugin'] = '^0.5.15';
      deps.devDependencies['react-refresh'] = '^0.17.0';
    }

    // 状态管理依赖
    if (stateManager === 'redux') {
      deps.dependencies['@reduxjs/toolkit'] = '^2.2.0';
      deps.dependencies['react-redux'] = '^9.1.0';
    } else if (stateManager === 'mobx') {
      deps.dependencies['mobx'] = '^6.12.0';
      deps.dependencies['mobx-react-lite'] = '^4.0.5';
    }

    // HTTP 请求库依赖
    if (httpClient === 'axios') {
      deps.dependencies['axios'] = '^1.6.0';
    }

    if (styleType === 'less') {
      deps.devDependencies['less'] = '^4.2.0';
      if (bundler === 'webpack') {
        deps.devDependencies['less-loader'] = '^12.2.0';
      }
    } else if (styleType === 'scss') {
      deps.devDependencies['sass'] = '^1.70.0';
      if (bundler === 'webpack') {
        deps.devDependencies['sass-loader'] = '^14.1.0';
      }
    }

    return deps;
  },

  getScripts: (bundler: BundlerType = 'vite'): Record<string, string> => {
    if (bundler === 'webpack') {
      return {
        dev: 'webpack serve --mode development',
        build: 'webpack --mode production',
        typecheck: 'tsc --noEmit',
      };
    }
    return {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
    };
  },
};
