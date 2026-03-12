import type { ProjectType, PluginContext, StyleType, StateManagerType } from '../types/index.js';
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
} from './shared.js';

/**
 * 创建 Redux store 文件
 */
async function createReduxStore(projectPath: string) {
  const storePath = path.join(projectPath, 'src', 'store');
  await fs.ensureDir(storePath);

  // store/index.ts
  await fs.writeFile(
    path.join(storePath, 'index.ts'),
    `import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
`,
    'utf-8'
  );

  // store/counterSlice.ts
  await fs.writeFile(
    path.join(storePath, 'counterSlice.ts'),
    `import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;
export default counterSlice.reducer;
`,
    'utf-8'
  );

  // store/hooks.ts
  await fs.writeFile(
    path.join(storePath, 'hooks.ts'),
    `import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
`,
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
    `import { makeAutoObservable } from 'mobx';

class CounterStore {
  count = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increment() {
    this.count += 1;
  }

  decrement() {
    this.count -= 1;
  }

  incrementByAmount(amount: number) {
    this.count += amount;
  }
}

export const counterStore = new CounterStore();
`,
    'utf-8'
  );

  // store/index.ts
  await fs.writeFile(
    path.join(storePath, 'index.ts'),
    `export { counterStore } from './CounterStore';
`,
    'utf-8'
  );
}

/**
 * React + Vite 项目模板 (pnpm monorepo)
 */
export const reactTemplate = {
  type: 'react' as ProjectType,
  displayName: 'React',
  description: 'React + Vite 前端项目 (pnpm monorepo)',

  createStructure: async (projectPath: string, context: PluginContext) => {
    const { styleType = 'css', stateManager = 'none' } = context;
    const styleExt = getStyleExt(styleType);

    // ============ 根目录文件 ============

    // 创建根目录 package.json
    await fs.writeFile(
      path.join(projectPath, 'package.json'),
      JSON.stringify({
        name: context.projectName,
        version: '1.0.0',
        private: true,
        description: context.options.description || '',
        author: context.options.author || '',
        license: 'MIT',
        type: 'module',
        scripts: {
          dev: 'vite',
          build: 'tsc && vite build',
          preview: 'vite preview',
          lint: 'eslint src --ext .ts,.tsx',
          'lint:fix': 'eslint src --ext .ts,.tsx --fix',
          format: 'prettier --write "src/**/*.{ts,tsx,css,scss,less}"',
          clean: 'rm -rf dist node_modules',
        },
        dependencies: {
          shared: 'workspace:*',
          ui: 'workspace:*',
        },
        devDependencies: {
          '@vitejs/plugin-legacy': '^5.3.0',
          '@vitejs/plugin-react': '^4.2.1',
          autoprefixer: '^10.4.17',
        },
      }, null, 2),
      'utf-8'
    );

    // 创建通用配置文件
    await createRootConfigFiles(projectPath, 'react');

    // ============ src 目录 (主应用源代码) ============
    await createSrcDirectories(projectPath);
    await fs.ensureDir(path.join(projectPath, 'public'));

    // 创建状态管理相关文件
    if (stateManager === 'redux') {
      await createReduxStore(projectPath);
    } else if (stateManager === 'mobx') {
      await createMobXStore(projectPath);
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
      homeTsx = `import { useAppDispatch, useAppSelector } from '../store/hooks';
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

    // ============ packages 目录 (monorepo 其他包) ============
    await fs.ensureDir(path.join(projectPath, 'packages'));

    // 创建 shared 包
    await createSharedPackage(projectPath);

    // 创建 ui 包 (React 版本)
    await createReactUiPackage(projectPath);
  },

  getDependencies: (styleType: StyleType = 'css', stateManager: StateManagerType = 'none') => {
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
        // Vite 相关依赖
        vite: '^5.0.0',
        '@vitejs/plugin-react': '^4.2.1',
        '@vitejs/plugin-legacy': '^5.3.0',
        typescript: '^5.3.3',
        autoprefixer: '^10.4.17',
      },
    };

    // 状态管理依赖
    if (stateManager === 'redux') {
      deps.dependencies['@reduxjs/toolkit'] = '^2.2.0';
      deps.dependencies['react-redux'] = '^9.1.0';
    } else if (stateManager === 'mobx') {
      deps.dependencies['mobx'] = '^6.12.0';
      deps.dependencies['mobx-react-lite'] = '^4.0.5';
    }

    if (styleType === 'less') {
      deps.devDependencies['less'] = '^4.2.0';
    } else if (styleType === 'scss') {
      deps.devDependencies['sass'] = '^1.70.0';
    }

    return deps;
  },

  getScripts: () => ({
    dev: 'vite',
    build: 'tsc && vite build',
    preview: 'vite preview',
  }),
};
