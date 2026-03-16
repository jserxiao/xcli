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
  getGlobalTypeDeclarations,
  createEnvFiles,
  // 状态管理模板
  getReduxStoreIndex,
  getReduxCounterSlice,
  getReduxApiSlice,
  getReduxLoggerMiddleware,
  getMobXCounterStore,
  getMobXStoreIndex,
} from './shared.js';
import { axiosPlugin, fetchPlugin } from '../plugins/http-client/index.js';
import { getReactViteConfig } from '../plugins/vite/index.js';
import {
  BUNDLER_VERSIONS,
  FRAMEWORK_VERSIONS,
  STYLE_VERSIONS,
  STATE_MANAGER_VERSIONS,
  HTTP_CLIENT_VERSIONS,
  TS_VERSIONS,
  BABEL_VERSIONS,
  ENV_VERSIONS,
} from '../constants/index.js';

/**
 * 获取文件扩展名（根据是否使用 TypeScript）
 */
function getExt(useTypeScript: boolean, isJsx: boolean = true): string {
  if (useTypeScript) {
    return isJsx ? '.tsx' : '.ts';
  }
  return isJsx ? '.jsx' : '.js';
}

/**
 * 创建 Redux store 文件
 */
async function createReduxStore(projectPath: string, bundler: BundlerType = 'vite', useTypeScript: boolean = true) {
  const storePath = path.join(projectPath, 'src', 'store');
  await fs.ensureDir(storePath);
  await fs.ensureDir(path.join(storePath, 'middleware'));

  const ext = getExt(useTypeScript, false);

  // store/index.ts or store/index.js
  await fs.writeFile(
    path.join(storePath, `index${ext}`),
    getReduxStoreIndex(bundler, useTypeScript),
    'utf-8'
  );

  // store/counterSlice.ts or store/counterSlice.js
  await fs.writeFile(
    path.join(storePath, `counterSlice${ext}`),
    getReduxCounterSlice(useTypeScript),
    'utf-8'
  );

  // store/apiSlice.ts or store/apiSlice.js
  await fs.writeFile(
    path.join(storePath, `apiSlice${ext}`),
    getReduxApiSlice(useTypeScript),
    'utf-8'
  );

  // store/middleware/logger.ts or store/middleware/logger.js
  await fs.writeFile(
    path.join(storePath, 'middleware', `logger${ext}`),
    getReduxLoggerMiddleware(bundler, useTypeScript),
    'utf-8'
  );
}

/**
 * 创建 MobX store 文件
 */
async function createMobXStore(projectPath: string, useTypeScript: boolean = true) {
  const storePath = path.join(projectPath, 'src', 'store');
  await fs.ensureDir(storePath);

  const ext = getExt(useTypeScript, false);

  // store/CounterStore.ts or store/CounterStore.js
  await fs.writeFile(
    path.join(storePath, `CounterStore${ext}`),
    getMobXCounterStore(useTypeScript),
    'utf-8'
  );

  // store/index.ts or store/index.js
  await fs.writeFile(
    path.join(storePath, `index${ext}`),
    getMobXStoreIndex(useTypeScript),
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
    const { styleType = 'css', stateManager = 'none', httpClient = 'axios', bundler = 'vite', selectedPlugins = [], useTypeScript = true } = context;
    const styleExt = getStyleExt(styleType);
    const ext = getExt(useTypeScript, false);
    const jsxExt = getExt(useTypeScript, true);

    // ============ 根目录文件 ============

    // 根据打包工具和 TypeScript 设置生成不同的 package.json
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
        build: useTypeScript ? 'tsc && vite build' : 'vite build',
        preview: 'vite preview',
        lint: `eslint src --ext ${useTypeScript ? '.ts,.tsx' : '.js,.jsx'}`,
        'lint:fix': `eslint src --ext ${useTypeScript ? '.ts,.tsx' : '.js,.jsx'} --fix`,
        format: `prettier --write "src/**/*{${useTypeScript ? '.ts,.tsx' : '.js,.jsx'},css,scss,less}"`,
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
        lint: `eslint src --ext ${useTypeScript ? '.ts,.tsx' : '.js,.jsx'}`,
        'lint:fix': `eslint src --ext ${useTypeScript ? '.ts,.tsx' : '.js,.jsx'} --fix`,
        format: `prettier --write "src/**/*{${useTypeScript ? '.ts,.tsx' : '.js,.jsx'},css,scss,less}"`,
        clean: 'rm -rf dist node_modules',
      };
      basePackageJson.devDependencies = {
        webpack: '^5.98.0',
        'webpack-cli': '^6.0.1',
        'webpack-dev-server': '^5.2.3',
        'html-webpack-plugin': '^5.6.0',
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
        build: useTypeScript ? 'tsc && vite build' : 'vite build',
        preview: 'vite preview',
        lint: `eslint src --ext ${useTypeScript ? '.ts,.tsx' : '.js,.jsx'}`,
        'lint:fix': `eslint src --ext ${useTypeScript ? '.ts,.tsx' : '.js,.jsx'} --fix`,
        format: `prettier --write "src/**/*{${useTypeScript ? '.ts,.tsx' : '.js,.jsx'},css,scss,less}"`,
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
    await createRootConfigFiles(projectPath, 'react', bundler, useTypeScript);

    // 创建环境变量配置文件
    await createEnvFiles(projectPath, 'react', bundler);

    // ============ src 目录 (主应用源代码) ============
    await createSrcDirectories(projectPath);
    await fs.ensureDir(path.join(projectPath, 'public'));

    // 创建状态管理相关文件
    if (stateManager === 'redux') {
      await createReduxStore(projectPath, bundler, useTypeScript);
    } else if (stateManager === 'mobx') {
      await createMobXStore(projectPath, useTypeScript);
    }

    // 创建 HTTP 请求相关文件
    if (httpClient === 'axios') {
      await fs.ensureDir(path.join(projectPath, 'src', 'api'));
      const content = axiosPlugin.files![0].content;
      await fs.writeFile(
        path.join(projectPath, 'src', 'api', `request${ext}`),
        typeof content === 'function' ? content(context) : content,
        'utf-8'
      );
    } else if (httpClient === 'fetch') {
      await fs.ensureDir(path.join(projectPath, 'src', 'api'));
      const content = fetchPlugin.files![0].content;
      await fs.writeFile(
        path.join(projectPath, 'src', 'api', `request${ext}`),
        typeof content === 'function' ? content(context) : content,
        'utf-8'
      );
    }

    // index.html
    const mainFile = useTypeScript ? '/src/main.tsx' : '/src/main.jsx';
    await fs.writeFile(
      path.join(projectPath, 'index.html'),
      `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${context.projectName} - 由 xcli 生成的现代化 React 项目" />
    <meta name="theme-color" content="#6366f1" />
    <title>${context.projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="${mainFile}"></script>
  </body>
</html>
`,
      'utf-8'
    );

    // src/main.tsx or src/main.jsx
    let mainContent = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.${styleExt}';
`;

    if (stateManager === 'redux') {
      mainContent += `import { store } from './store';
import { Provider } from 'react-redux';
`;
      mainContent += `
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
);
`;
    } else {
      mainContent += `
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;
    }

    await fs.writeFile(path.join(projectPath, 'src', `main${jsxExt}`), mainContent, 'utf-8');

    // src/router/index.tsx or src/router/index.jsx
    await fs.writeFile(
      path.join(projectPath, 'src', 'router', `index${jsxExt}`),
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

    // src/components/Layout.tsx or Layout.jsx
    await fs.writeFile(
      path.join(projectPath, 'src', 'components', `Layout${jsxExt}`),
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

    // src/App.tsx or App.jsx
    await fs.writeFile(
      path.join(projectPath, 'src', `App${jsxExt}`),
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

    // src/pages/Home.tsx or Home.jsx
    let homeContent = '';
    if (stateManager === 'redux') {
      homeContent = `import { useAppDispatch, useAppSelector } from '../store';
import { decrement, increment } from '../store/counterSlice';
import './Home.${styleExt}';

function Home() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="page">
      <div className="hero">
        <div className="logo">⚡</div>
        <h1>${context.projectName}</h1>
        <p className="subtitle">由 xcli 生成的现代化 React 项目</p>
        <div className="actions">
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="btn primary">
            📚 React 文档
          </a>
          <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer" className="btn secondary">
            ⚡ Vite 文档
          </a>
        </div>
      </div>
      <div className="card">
        <h2>🧮 状态管理演示</h2>
        <p>使用 Redux 进行全局状态管理</p>
        <div className="counter-demo">
          <button onClick={() => dispatch(decrement())}>-</button>
          <span className="count">{count}</span>
          <button onClick={() => dispatch(increment())}>+</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
`;
    } else if (stateManager === 'mobx') {
      homeContent = `import { observer } from 'mobx-react-lite';
import { counterStore } from '../store';
import './Home.${styleExt}';

const Home = observer(() => {
  return (
    <div className="page">
      <div className="hero">
        <div className="logo">⚡</div>
        <h1>${context.projectName}</h1>
        <p className="subtitle">由 xcli 生成的现代化 React 项目</p>
        <div className="actions">
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="btn primary">
            📚 React 文档
          </a>
          <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer" className="btn secondary">
            ⚡ Vite 文档
          </a>
        </div>
      </div>
      <div className="card">
        <h2>🧮 状态管理演示</h2>
        <p>使用 MobX 进行响应式状态管理</p>
        <div className="counter-demo">
          <button onClick={() => counterStore.decrement()}>-</button>
          <span className="count">{counterStore.count}</span>
          <button onClick={() => counterStore.increment()}>+</button>
        </div>
      </div>
    </div>
  );
});

export default Home;
`;
    } else {
      homeContent = `import { useState } from 'react';
import './Home.${styleExt}';

function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="page">
      <div className="hero">
        <div className="logo">⚡</div>
        <h1>${context.projectName}</h1>
        <p className="subtitle">由 xcli 生成的现代化 React 项目</p>
        <div className="actions">
          <a href="https://react.dev" target="_blank" rel="noopener noreferrer" className="btn primary">
            📚 React 文档
          </a>
          <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer" className="btn secondary">
            ⚡ Vite 文档
          </a>
        </div>
      </div>
      <div className="card">
        <h2>🧮 计数器演示</h2>
        <p>使用 React useState 进行状态管理</p>
        <div className="counter-demo">
          <button onClick={() => setCount((count) => count - 1)}>-</button>
          <span className="count">{count}</span>
          <button onClick={() => setCount((count) => count + 1)}>+</button>
        </div>
      </div>
    </div>
  );
}

export default Home;
`;
    }
    await fs.writeFile(path.join(projectPath, 'src', 'pages', `Home${jsxExt}`), homeContent, 'utf-8');

    // src/pages/Home.xxx
    await fs.writeFile(
      path.join(projectPath, 'src', 'pages', `Home.${styleExt}`),
      getPageStyles(styleType),
      'utf-8'
    );

    // src/pages/About.tsx or About.jsx
    await fs.writeFile(
      path.join(projectPath, 'src', 'pages', `About${jsxExt}`),
      `import { formatDate, sleep } from 'shared';
import { Button } from 'ui';
import { useState, useEffect } from 'react';
import './About.${styleExt}';

function About() {
  const [date, setDate] = useState${useTypeScript ? '<string>' : ''}('');

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
      // vite.config.ts or vite.config.js
      await fs.writeFile(
        path.join(projectPath, `vite.config.${useTypeScript ? 'ts' : 'js'}`),
        getReactViteConfig(),
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
    await createSharedPackage(projectPath, useTypeScript);

    // 创建 ui 包 (React 版本)
    await createReactUiPackage(projectPath, useTypeScript);

    // 类型声明文件（TypeScript 项目需要）
    if (useTypeScript) {
      if (bundler === 'vite') {
        // Vite 项目使用 vite-env.d.ts（包含 Vite 特有的类型引用）
        await fs.writeFile(
          path.join(projectPath, 'src', 'vite-env.d.ts'),
          getViteEnvDts('react'),
          'utf-8'
        );
      } else {
        // 非 Vite 项目使用 global.d.ts（通用类型声明）
        await fs.writeFile(
          path.join(projectPath, 'src', 'global.d.ts'),
          getGlobalTypeDeclarations('react'),
          'utf-8'
        );
      }
    }
  },

  getDependencies: (styleType: StyleType = 'css', stateManager: StateManagerType = 'none', httpClient: HttpClientType = 'axios', bundler: BundlerType = 'vite', useTypeScript: boolean = true) => {
    const deps: {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    } = {
      dependencies: {
        react: FRAMEWORK_VERSIONS.react,
        'react-dom': FRAMEWORK_VERSIONS['react-dom'],
        'react-router-dom': FRAMEWORK_VERSIONS['react-router-dom'],
        // Monorepo workspace 包引用
        shared: 'workspace:*',
        ui: 'workspace:*',
      },
      devDependencies: {},
    };

    // TypeScript 相关依赖
    if (useTypeScript) {
      deps.devDependencies['@types/react'] = FRAMEWORK_VERSIONS['@types/react'];
      deps.devDependencies['@types/react-dom'] = FRAMEWORK_VERSIONS['@types/react-dom'];
      deps.devDependencies['typescript'] = TS_VERSIONS.typescript;
    }

    // 打包工具相关依赖
    if (bundler === 'vite') {
      deps.devDependencies['vite'] = BUNDLER_VERSIONS.vite;
      deps.devDependencies['@vitejs/plugin-react'] = BUNDLER_VERSIONS['@vitejs/plugin-react'];
      deps.devDependencies['@vitejs/plugin-legacy'] = BUNDLER_VERSIONS['@vitejs/plugin-legacy'];
      deps.devDependencies['autoprefixer'] = STYLE_VERSIONS.autoprefixer;
    } else if (bundler === 'webpack') {
      deps.devDependencies['webpack'] = BUNDLER_VERSIONS.webpack;
      deps.devDependencies['webpack-cli'] = BUNDLER_VERSIONS['webpack-cli'];
      deps.devDependencies['webpack-dev-server'] = BUNDLER_VERSIONS['webpack-dev-server'];
      deps.devDependencies['html-webpack-plugin'] = BUNDLER_VERSIONS['html-webpack-plugin'];
      deps.devDependencies['css-loader'] = BUNDLER_VERSIONS['css-loader'];
      deps.devDependencies['style-loader'] = BUNDLER_VERSIONS['style-loader'];
      deps.devDependencies['mini-css-extract-plugin'] = BUNDLER_VERSIONS['mini-css-extract-plugin'];
      deps.devDependencies['css-minimizer-webpack-plugin'] = BUNDLER_VERSIONS['css-minimizer-webpack-plugin'];
      deps.devDependencies['autoprefixer'] = STYLE_VERSIONS.autoprefixer;
      deps.devDependencies['postcss-loader'] = STYLE_VERSIONS['postcss-loader'];
      // SVG as Component
      deps.devDependencies['@svgr/webpack'] = BUNDLER_VERSIONS['@svgr/webpack'];
      // 图片压缩
      deps.devDependencies['image-minimizer-webpack-plugin'] = BUNDLER_VERSIONS['image-minimizer-webpack-plugin'];
      // Gzip 压缩
      deps.devDependencies['compression-webpack-plugin'] = BUNDLER_VERSIONS['compression-webpack-plugin'];
      // 环境变量
      deps.devDependencies['dotenv'] = ENV_VERSIONS.dotenv;
      // Babel
      deps.devDependencies['@babel/core'] = BABEL_VERSIONS['@babel/core'];
      deps.devDependencies['babel-loader'] = BABEL_VERSIONS['babel-loader'];
      deps.devDependencies['@babel/preset-env'] = BABEL_VERSIONS['@babel/preset-env'];
      deps.devDependencies['@babel/preset-react'] = BABEL_VERSIONS['@babel/preset-react'];
      deps.devDependencies['@babel/plugin-proposal-decorators'] = BABEL_VERSIONS['@babel/plugin-proposal-decorators'];
      deps.devDependencies['@babel/plugin-transform-class-properties'] = BABEL_VERSIONS['@babel/plugin-transform-class-properties'];
      deps.devDependencies['@babel/plugin-transform-runtime'] = BABEL_VERSIONS['@babel/plugin-transform-runtime'];
      deps.devDependencies['@babel/runtime'] = BABEL_VERSIONS['@babel/runtime'];
      // Polyfill（用于 useBuiltIns: 'usage'）
      deps.dependencies['core-js'] = BABEL_VERSIONS['core-js'];
      // React 热更新
      deps.devDependencies['@pmmmwh/react-refresh-webpack-plugin'] = FRAMEWORK_VERSIONS['@pmmmwh/react-refresh-webpack-plugin'];
      deps.devDependencies['react-refresh'] = FRAMEWORK_VERSIONS['react-refresh'];
      // TypeScript preset（仅 TS 项目）
      if (useTypeScript) {
        deps.devDependencies['@babel/preset-typescript'] = BABEL_VERSIONS['@babel/preset-typescript'];
      }
    }

    // 状态管理依赖
    if (stateManager === 'redux') {
      deps.dependencies['@reduxjs/toolkit'] = STATE_MANAGER_VERSIONS['@reduxjs/toolkit'];
      deps.dependencies['react-redux'] = STATE_MANAGER_VERSIONS['react-redux'];
    } else if (stateManager === 'mobx') {
      deps.dependencies['mobx'] = STATE_MANAGER_VERSIONS.mobx;
      deps.dependencies['mobx-react-lite'] = STATE_MANAGER_VERSIONS['mobx-react-lite'];
    }

    // HTTP 请求库依赖
    if (httpClient === 'axios') {
      deps.dependencies['axios'] = HTTP_CLIENT_VERSIONS.axios;
    }

    if (styleType === 'less') {
      deps.devDependencies['less'] = STYLE_VERSIONS.less;
      if (bundler === 'webpack') {
        deps.devDependencies['less-loader'] = STYLE_VERSIONS['less-loader'];
      }
    } else if (styleType === 'scss') {
      deps.devDependencies['sass'] = STYLE_VERSIONS.sass;
      if (bundler === 'webpack') {
        deps.devDependencies['sass-loader'] = STYLE_VERSIONS['sass-loader'];
      }
    }

    return deps;
  },

  getScripts: (bundler: BundlerType = 'vite', useTypeScript: boolean = true): Record<string, string> => {
    if (bundler === 'webpack') {
      const scripts: Record<string, string> = {
        dev: 'webpack serve --mode development',
        build: 'webpack --mode production',
      };
      if (useTypeScript) {
        scripts['typecheck'] = 'tsc --noEmit';
      }
      return scripts;
    }
    return {
      dev: 'vite',
      build: useTypeScript ? 'tsc --noEmit && vite build' : 'vite build',
      preview: 'vite preview',
    };
  },
};
