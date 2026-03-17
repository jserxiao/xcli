import type { ProjectType, PluginContext, StyleType, StateManagerType, HttpClientType, BundlerType, MonitoringType } from '../types/index';
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
  createVueUiPackage,
  getViteEnvDts,
  getGlobalTypeDeclarations,
  createEnvFiles,
  // 状态管理模板
  getPiniaStoreIndex,
  getPiniaCounterStore,
} from './shared';
import { axiosPlugin, fetchPlugin } from '../plugins/http-client';
import { getVueMonitoringContent } from '../plugins/monitoring/templates';
import { getVueViteConfig } from '../plugins/vite';
import {
  BUNDLER_VERSIONS,
  FRAMEWORK_VERSIONS,
  STYLE_VERSIONS,
  STATE_MANAGER_VERSIONS,
  HTTP_CLIENT_VERSIONS,
  MONITORING_VERSIONS,
  TS_VERSIONS,
  BABEL_VERSIONS,
  ENV_VERSIONS,
} from '../constants';

/**
 * 获取文件扩展名（根据是否使用 TypeScript）
 */
function getExt(useTypeScript: boolean): string {
  return useTypeScript ? '.ts' : '.js';
}

/**
 * 创建 Pinia store 文件
 */
async function createPiniaStore(projectPath: string, useTypeScript: boolean = true) {
  const storePath = path.join(projectPath, 'src', 'store');
  await fs.ensureDir(storePath);

  const ext = getExt(useTypeScript);

  // store/index.ts or store/index.js
  await fs.writeFile(
    path.join(storePath, `index${ext}`),
    getPiniaStoreIndex(),
    'utf-8'
  );

  // store/counter.ts or store/counter.js
  await fs.writeFile(
    path.join(storePath, `counter${ext}`),
    getPiniaCounterStore(),
    'utf-8'
  );
}

/**
 * Vue 项目模板 (pnpm monorepo)
 */
export const vueTemplate = {
  type: 'vue' as ProjectType,
  displayName: 'Vue',
  description: 'Vue 3 前端项目 (pnpm monorepo)',

  createStructure: async (projectPath: string, context: PluginContext) => {
    const { styleType = 'css', stateManager = 'pinia', httpClient = 'axios', monitoring = 'none', bundler = 'vite', selectedPlugins = [], useTypeScript = true } = context;
    const styleExt = getStyleExt(styleType);
    const styleLang = styleType === 'css' ? '' : ` lang="${styleExt}"`;
    const ext = getExt(useTypeScript);
    const scriptLang = useTypeScript ? ' lang="ts"' : '';

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
        build: useTypeScript ? 'vue-tsc && vite build' : 'vite build',
        preview: 'vite preview',
        lint: `eslint src --ext ${useTypeScript ? '.ts,' : ''}.vue`,
        'lint:fix': `eslint src --ext ${useTypeScript ? '.ts,' : ''}.vue --fix`,
        format: `prettier --write "src/**/*{${useTypeScript ? '.ts,' : ''}.vue,css,scss,less}"`,
        clean: 'rm -rf dist node_modules',
      };
      basePackageJson.devDependencies = {
        '@vitejs/plugin-legacy': '^5.3.0',
        '@vitejs/plugin-vue': '^5.0.3',
        autoprefixer: '^10.4.17',
      };
      if (useTypeScript) {
        basePackageJson.devDependencies['vue-tsc'] = '^2.0.0';
      }
    } else if (bundler === 'webpack') {
      basePackageJson.scripts = {
        dev: 'webpack serve --mode development',
        build: 'webpack --mode production',
        lint: `eslint src --ext ${useTypeScript ? '.ts,' : ''}.vue`,
        'lint:fix': `eslint src --ext ${useTypeScript ? '.ts,' : ''}.vue --fix`,
        format: `prettier --write "src/**/*{${useTypeScript ? '.ts,' : ''}.vue,css,scss,less}"`,
        clean: 'rm -rf dist node_modules',
      };
      basePackageJson.devDependencies = {
        webpack: '^5.98.0',
        'webpack-cli': '^6.0.1',
        'webpack-dev-server': '^5.2.3',
        'html-webpack-plugin': '^5.6.0',
        'vue-loader': '^17.4.2',
        '@vue/compiler-sfc': '^3.4.0',
        'css-loader': '^7.1.2',
        'style-loader': '^4.0.0',
        'mini-css-extract-plugin': '^2.9.2',
        autoprefixer: '^10.4.21',
        'postcss-loader': '^8.1.1',
      };
    } else {
      // 默认使用 vite
      basePackageJson.scripts = {
        dev: 'vite',
        build: useTypeScript ? 'vue-tsc && vite build' : 'vite build',
        preview: 'vite preview',
        lint: `eslint src --ext ${useTypeScript ? '.ts,' : ''}.vue`,
        'lint:fix': `eslint src --ext ${useTypeScript ? '.ts,' : ''}.vue --fix`,
        format: `prettier --write "src/**/*{${useTypeScript ? '.ts,' : ''}.vue,css,scss,less}"`,
        clean: 'rm -rf dist node_modules',
      };
      basePackageJson.devDependencies = {
        '@vitejs/plugin-legacy': '^5.3.0',
        '@vitejs/plugin-vue': '^5.0.3',
        autoprefixer: '^10.4.17',
      };
      if (useTypeScript) {
        basePackageJson.devDependencies['vue-tsc'] = '^2.0.0';
      }
    }

    // 创建根目录 package.json
    await fs.writeFile(
      path.join(projectPath, 'package.json'),
      JSON.stringify(basePackageJson, null, 2),
      'utf-8'
    );

    // 创建通用配置文件
    await createRootConfigFiles(projectPath, 'vue', bundler, useTypeScript);

    // 创建环境变量配置文件
    await createEnvFiles(projectPath, 'vue', bundler);

    // ============ src 目录 (主应用源代码) ============
    await createSrcDirectories(projectPath);
    await fs.ensureDir(path.join(projectPath, 'public'));

    // 创建 Pinia store 文件
    if (stateManager === 'pinia') {
      await createPiniaStore(projectPath, useTypeScript);
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

    // 创建监控工具文件
    if (monitoring === 'xstat') {
      await fs.ensureDir(path.join(projectPath, 'src', 'utils'));
      await fs.writeFile(
        path.join(projectPath, 'src', 'utils', `monitoring${ext}`),
        getVueMonitoringContent(useTypeScript, bundler === 'none' ? 'vite' : bundler),
        'utf-8'
      );
    }

    // index.html
    const mainFile = useTypeScript ? '/src/main.ts' : '/src/main.js';
    await fs.writeFile(
      path.join(projectPath, 'index.html'),
      `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>⚡</text></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${context.projectName} - 由 xcli 生成的现代化 Vue 项目" />
    <meta name="theme-color" content="#6366f1" />
    <title>${context.projectName}</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="${mainFile}"></script>
  </body>
</html>
`,
      'utf-8'
    );

    // src/main.ts or src/main.js
    let mainContent = `import { createApp } from 'vue';
import './style.${styleExt}';
import App from './App.vue';
import router from './router';
`;

    // 添加监控 SDK 导入
    if (monitoring === 'xstat') {
      mainContent += `import { initXStat, vueErrorHandler } from './utils/monitoring';

// 初始化前端监控
initXStat({
  appId: import.meta.env.VITE_APP_ID || 'your-app-id',
  env: import.meta.env.MODE,
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
});
`;
    }

    if (stateManager === 'pinia') {
      mainContent += `import { pinia } from './store';
`;
    }

    mainContent += `
const app = createApp(App);
`;

    // Vue 错误处理
    if (monitoring === 'xstat') {
      mainContent += `// 配置 Vue 错误处理
app.config.errorHandler = vueErrorHandler;

app.use(router);
`;
    } else {
      mainContent += `app.use(router);
`;
    }

    if (stateManager === 'pinia') {
      mainContent += `app.use(pinia);
`;
    }

    mainContent += `app.mount('#app');
`;

    await fs.writeFile(path.join(projectPath, 'src', `main${ext}`), mainContent, 'utf-8');

    // src/router/index.ts or src/router/index.js
    await fs.writeFile(
      path.join(projectPath, 'src', 'router', `index${ext}`),
      `import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import About from '../pages/About.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
`,
      'utf-8'
    );

    // src/App.vue
    await fs.writeFile(
      path.join(projectPath, 'src', 'App.vue'),
      `<script setup${scriptLang}>
</script>

<template>
  <div class="app">
    <nav class="nav">
      <router-link to="/">首页</router-link>
      <router-link to="/about">关于</router-link>
    </nav>
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped${styleLang}>
${getAppStyles(styleType, 'vue')}
</style>
`,
      'utf-8'
    );

    // src/style.xxx
    await fs.writeFile(
      path.join(projectPath, 'src', `style.${styleExt}`),
      getBaseStyles(),
      'utf-8'
    );

    // src/pages/Home.vue
    let homeVue = '';
    if (stateManager === 'pinia') {
      homeVue = `<script setup${scriptLang}>
import { useCounterStore } from '../store/counter';
import { storeToRefs } from 'pinia';

const counterStore = useCounterStore();
const { count, doubleCount } = storeToRefs(counterStore);
</script>

<template>
  <div class="page">
    <div class="hero">
      <div class="logo">⚡</div>
      <h1>${context.projectName}</h1>
      <p class="subtitle">由 xcli 生成的现代化 Vue 项目</p>
      <div class="actions">
        <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer" class="btn primary">
          📚 Vue 文档
        </a>
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer" class="btn secondary">
          ⚡ Vite 文档
        </a>
      </div>
    </div>
    <div class="card">
      <h2>🧮 状态管理演示</h2>
      <p>使用 Pinia 进行全局状态管理</p>
      <div class="counter-demo">
        <button type="button" @click="counterStore.decrement()">-</button>
        <span class="count">{{ count }}</span>
        <button type="button" @click="counterStore.increment()">+</button>
      </div>
      <p>双倍值: {{ doubleCount }}</p>
    </div>
  </div>
</template>

<style scoped${styleLang}>
${getPageStyles(styleType)}
</style>
`;
    } else {
      homeVue = `<script setup${scriptLang}>
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <div class="page">
    <div class="hero">
      <div class="logo">⚡</div>
      <h1>${context.projectName}</h1>
      <p class="subtitle">由 xcli 生成的现代化 Vue 项目</p>
      <div class="actions">
        <a href="https://vuejs.org" target="_blank" rel="noopener noreferrer" class="btn primary">
          📚 Vue 文档
        </a>
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer" class="btn secondary">
          ⚡ Vite 文档
        </a>
      </div>
    </div>
    <div class="card">
      <h2>🧮 计数器演示</h2>
      <p>使用 Vue ref 进行响应式状态管理</p>
      <div class="counter-demo">
        <button type="button" @click="count--">-</button>
        <span class="count">{{ count }}</span>
        <button type="button" @click="count++">+</button>
      </div>
    </div>
  </div>
</template>

<style scoped${styleLang}>
${getPageStyles(styleType)}
</style>
`;
    }
    await fs.writeFile(path.join(projectPath, 'src', 'pages', 'Home.vue'), homeVue, 'utf-8');

    // src/pages/About.vue
    const aboutTypeAnnotation = useTypeScript ? '<string>' : '';
    await fs.writeFile(
      path.join(projectPath, 'src', 'pages', 'About.vue'),
      `<script setup${scriptLang}>
import { ref, onMounted } from 'vue';
// 引用 shared 包中的工具函数
import { formatDate, sleep } from 'shared';
// 引用 ui 包中的组件
import { MyButton } from 'ui';

const date = ref${aboutTypeAnnotation}('');

// 按钮点击处理函数
const handlePrimaryClick = () => {
  alert('Primary clicked!');
};

const handleSecondaryClick = () => {
  alert('Secondary clicked!');
};

onMounted(() => {
  // 使用 shared 包中的工具函数
  date.value = formatDate(new Date());

  // 示例：使用 sleep 函数
  sleep(1000).then(() => {
    console.log('Welcome to ${context.projectName}!');
  });
});
</script>

<template>
  <div class="page">
    <h1>关于</h1>
    <p>这是一个使用 Vue 3 + Vite + Vue Router 构建的 monorepo 项目。</p>
    <p>当前日期: {{ date }}</p>
    <div class="button-demo">
      <p>UI 组件库示例:</p>
      <MyButton variant="primary" @click="handlePrimaryClick">
        Primary Button
      </MyButton>
      <MyButton variant="secondary" @click="handleSecondaryClick">
        Secondary Button
      </MyButton>
    </div>
  </div>
</template>

<style scoped${styleLang}>
${getPageStyles(styleType)}

.button-demo {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}
</style>
`,
      'utf-8'
    );

    // 根据打包工具生成配置文件
    if (bundler === 'vite') {
      // vite.config.ts or vite.config.js
      await fs.writeFile(
        path.join(projectPath, `vite.config.${useTypeScript ? 'ts' : 'js'}`),
        getVueViteConfig(),
        'utf-8'
      );
    } else if (bundler === 'webpack') {
      // webpack.config.cjs for Vue
      const { createWebpackPlugin } = await import('../plugins/webpack/index.js');
      const webpackPluginInstance = createWebpackPlugin('vue', styleType);
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

    // 创建 ui 包 (Vue 版本)
    await createVueUiPackage(projectPath, useTypeScript);

    // 类型声明文件（TypeScript 项目需要）
    if (useTypeScript) {
      if (bundler === 'vite') {
        // Vite 项目使用 vite-env.d.ts（包含 Vite 特有的类型引用）
        await fs.writeFile(
          path.join(projectPath, 'src', 'vite-env.d.ts'),
          getViteEnvDts('vue'),
          'utf-8'
        );
      } else {
        // 非 Vite 项目使用 global.d.ts（通用类型声明）
        await fs.writeFile(
          path.join(projectPath, 'src', 'global.d.ts'),
          getGlobalTypeDeclarations('vue'),
          'utf-8'
        );
      }
    }
  },

  getDependencies: (styleType: StyleType = 'css', stateManager: StateManagerType = 'pinia', httpClient: HttpClientType = 'axios', monitoring: MonitoringType = 'none', bundler: BundlerType = 'vite', useTypeScript: boolean = true) => {
    const deps: {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    } = {
      dependencies: {
        vue: FRAMEWORK_VERSIONS.vue,
        'vue-router': FRAMEWORK_VERSIONS['vue-router'],
        // Monorepo workspace 包引用
        shared: 'workspace:*',
        ui: 'workspace:*',
      },
      devDependencies: {},
    };

    // TypeScript 相关依赖
    if (useTypeScript) {
      deps.devDependencies['typescript'] = TS_VERSIONS.typescript;
    }

    // 打包工具相关依赖
    if (bundler === 'vite') {
      deps.devDependencies['vite'] = BUNDLER_VERSIONS.vite;
      deps.devDependencies['@vitejs/plugin-vue'] = BUNDLER_VERSIONS['@vitejs/plugin-vue'];
      deps.devDependencies['@vitejs/plugin-legacy'] = BUNDLER_VERSIONS['@vitejs/plugin-legacy'];
      deps.devDependencies['autoprefixer'] = STYLE_VERSIONS.autoprefixer;
      if (useTypeScript) {
        deps.devDependencies['vue-tsc'] = FRAMEWORK_VERSIONS['vue-tsc'];
      }
    } else if (bundler === 'webpack') {
      deps.devDependencies['webpack'] = BUNDLER_VERSIONS.webpack;
      deps.devDependencies['webpack-cli'] = BUNDLER_VERSIONS['webpack-cli'];
      deps.devDependencies['webpack-dev-server'] = BUNDLER_VERSIONS['webpack-dev-server'];
      deps.devDependencies['html-webpack-plugin'] = BUNDLER_VERSIONS['html-webpack-plugin'];
      deps.devDependencies['vue-loader'] = FRAMEWORK_VERSIONS['vue-loader'];
      deps.devDependencies['@vue/compiler-sfc'] = FRAMEWORK_VERSIONS['@vue/compiler-sfc'];
      deps.devDependencies['css-loader'] = BUNDLER_VERSIONS['css-loader'];
      deps.devDependencies['style-loader'] = BUNDLER_VERSIONS['style-loader'];
      deps.devDependencies['mini-css-extract-plugin'] = BUNDLER_VERSIONS['mini-css-extract-plugin'];
      deps.devDependencies['css-minimizer-webpack-plugin'] = BUNDLER_VERSIONS['css-minimizer-webpack-plugin'];
      deps.devDependencies['autoprefixer'] = STYLE_VERSIONS.autoprefixer;
      deps.devDependencies['postcss-loader'] = STYLE_VERSIONS['postcss-loader'];
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
      deps.devDependencies['@babel/plugin-proposal-decorators'] = BABEL_VERSIONS['@babel/plugin-proposal-decorators'];
      deps.devDependencies['@babel/plugin-transform-class-properties'] = BABEL_VERSIONS['@babel/plugin-transform-class-properties'];
      deps.devDependencies['@babel/plugin-transform-runtime'] = BABEL_VERSIONS['@babel/plugin-transform-runtime'];
      deps.devDependencies['@babel/runtime'] = BABEL_VERSIONS['@babel/runtime'];
      // Polyfill（用于 useBuiltIns: 'usage'）
      deps.dependencies['core-js'] = BABEL_VERSIONS['core-js'];
      // TypeScript preset（仅 TS 项目）
      if (useTypeScript) {
        deps.devDependencies['@babel/preset-typescript'] = BABEL_VERSIONS['@babel/preset-typescript'];
      }
    }

    // Pinia 状态管理
    if (stateManager === 'pinia') {
      deps.dependencies['pinia'] = STATE_MANAGER_VERSIONS.pinia;
    }

    // HTTP 请求库依赖
    if (httpClient === 'axios') {
      deps.dependencies['axios'] = HTTP_CLIENT_VERSIONS.axios;
    }

    // 前端监控 SDK 依赖
    if (monitoring === 'xstat') {
      deps.dependencies['@jserxiao/xstat'] = MONITORING_VERSIONS['@jserxiao/xstat'];
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
        scripts['typecheck'] = 'vue-tsc --noEmit';
      }
      return scripts;
    }
    return {
      dev: 'vite',
      build: useTypeScript ? 'vue-tsc --noEmit && vite build' : 'vite build',
      preview: 'vite preview',
    };
  },
};
