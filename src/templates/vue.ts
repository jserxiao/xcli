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
  createVueUiPackage,
  getViteEnvDts,
  // 状态管理模板
  getPiniaStoreIndex,
  getPiniaCounterStore,
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
 * 创建 Pinia store 文件
 */
async function createPiniaStore(projectPath: string) {
  const storePath = path.join(projectPath, 'src', 'store');
  await fs.ensureDir(storePath);

  // store/index.ts
  await fs.writeFile(
    path.join(storePath, 'index.ts'),
    getPiniaStoreIndex(),
    'utf-8'
  );

  // store/counter.ts
  await fs.writeFile(
    path.join(storePath, 'counter.ts'),
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
    const { styleType = 'css', stateManager = 'pinia', httpClient = 'axios', bundler = 'vite', selectedPlugins = [] } = context;
    const styleExt = getStyleExt(styleType);
    const styleLang = styleType === 'css' ? '' : ` lang="${styleExt}"`;

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
        build: 'vue-tsc && vite build',
        preview: 'vite preview',
        lint: 'eslint src --ext .ts,.vue',
        'lint:fix': 'eslint src --ext .ts,.vue --fix',
        format: 'prettier --write "src/**/*.{ts,vue,css,scss,less}"',
        clean: 'rm -rf dist node_modules',
      };
      basePackageJson.devDependencies = {
        '@vitejs/plugin-legacy': '^5.3.0',
        '@vitejs/plugin-vue': '^5.0.3',
        autoprefixer: '^10.4.17',
        'vue-tsc': '^2.0.0',
      };
    } else if (bundler === 'webpack') {
      basePackageJson.scripts = {
        dev: 'webpack serve --mode development',
        build: 'webpack --mode production',
        lint: 'eslint src --ext .ts,.vue',
        'lint:fix': 'eslint src --ext .ts,.vue --fix',
        format: 'prettier --write "src/**/*.{ts,vue,css,scss,less}"',
        clean: 'rm -rf dist node_modules',
      };
      basePackageJson.devDependencies = {
        webpack: '^5.98.0',
        'webpack-cli': '^6.0.1',
        'webpack-dev-server': '^5.2.3',
        'html-webpack-plugin': '^5.6.0',
        'ts-loader': '^9.5.1',
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
        build: 'vue-tsc && vite build',
        preview: 'vite preview',
        lint: 'eslint src --ext .ts,.vue',
        'lint:fix': 'eslint src --ext .ts,.vue --fix',
        format: 'prettier --write "src/**/*.{ts,vue,css,scss,less}"',
        clean: 'rm -rf dist node_modules',
      };
      basePackageJson.devDependencies = {
        '@vitejs/plugin-legacy': '^5.3.0',
        '@vitejs/plugin-vue': '^5.0.3',
        autoprefixer: '^10.4.17',
        'vue-tsc': '^2.0.0',
      };
    }

    // 创建根目录 package.json
    await fs.writeFile(
      path.join(projectPath, 'package.json'),
      JSON.stringify(basePackageJson, null, 2),
      'utf-8'
    );

    // 创建通用配置文件
    await createRootConfigFiles(projectPath, 'vue', bundler);

    // ============ src 目录 (主应用源代码) ============
    await createSrcDirectories(projectPath);
    await fs.ensureDir(path.join(projectPath, 'public'));

    // 创建 Pinia store 文件
    if (stateManager === 'pinia') {
      await createPiniaStore(projectPath);
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
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`,
      'utf-8'
    );

    // src/main.ts (根据状态管理生成不同内容)
    let mainTs = `import { createApp } from 'vue';
import './style.${styleExt}';
import App from './App.vue';
import router from './router';
`;

    if (stateManager === 'pinia') {
      mainTs += `import { pinia } from './store';
`;
    }

    mainTs += `
const app = createApp(App);
app.use(router);
`;

    if (stateManager === 'pinia') {
      mainTs += `app.use(pinia);
`;
    }

    mainTs += `app.mount('#app');
`;

    await fs.writeFile(path.join(projectPath, 'src', 'main.ts'), mainTs, 'utf-8');

    // src/router/index.ts
    await fs.writeFile(
      path.join(projectPath, 'src', 'router', 'index.ts'),
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
      `<script setup lang="ts">
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

    // src/pages/Home.vue (根据状态管理生成不同内容)
    let homeVue = '';
    if (stateManager === 'pinia') {
      homeVue = `<script setup lang="ts">
import { useCounterStore } from '../store/counter';
import { storeToRefs } from 'pinia';

const counterStore = useCounterStore();
const { count, doubleCount } = storeToRefs(counterStore);
</script>

<template>
  <div class="page">
    <h1>首页</h1>
    <p>欢迎使用 ${context.projectName}</p>
    <div class="card">
      <button type="button" @click="counterStore.decrement()">-</button>
      <span style="margin: 0 1rem">count is {{ count }}</span>
      <button type="button" @click="counterStore.increment()">+</button>
    </div>
    <p>Double: {{ doubleCount }}</p>
  </div>
</template>

<style scoped${styleLang}>
${getPageStyles(styleType)}
</style>
`;
    } else {
      homeVue = `<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <div class="page">
    <h1>首页</h1>
    <p>欢迎使用 ${context.projectName}</p>
    <div class="card">
      <button type="button" @click="count--">-</button>
      <span style="margin: 0 1rem">count is {{ count }}</span>
      <button type="button" @click="count++">+</button>
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
    await fs.writeFile(
      path.join(projectPath, 'src', 'pages', 'About.vue'),
      `<script setup lang="ts">
import { ref, onMounted } from 'vue';
// 引用 shared 包中的工具函数
import { formatDate, sleep } from 'shared';
// 引用 ui 包中的组件
import { MyButton } from 'ui';

const date = ref<string>('');

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
      // src/vite-env.d.ts
      await fs.writeFile(
        path.join(projectPath, 'src', 'vite-env.d.ts'),
        getViteEnvDts('vue'),
        'utf-8'
      );

      // vite.config.ts
      await fs.writeFile(
        path.join(projectPath, 'vite.config.ts'),
        `import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
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
    await createSharedPackage(projectPath);

    // 创建 ui 包 (Vue 版本)
    await createVueUiPackage(projectPath);
  },

  getDependencies: (styleType: StyleType = 'css', stateManager: StateManagerType = 'pinia', httpClient: HttpClientType = 'axios', bundler: BundlerType = 'vite') => {
    const deps: {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    } = {
      dependencies: {
        vue: '^3.4.15',
        'vue-router': '^4.3.0',
        // Monorepo workspace 包引用
        shared: 'workspace:*',
        ui: 'workspace:*',
      },
      devDependencies: {
        typescript: '^5.3.3',
      },
    };

    // 打包工具相关依赖
    if (bundler === 'vite') {
      deps.devDependencies['vite'] = '^5.0.0';
      deps.devDependencies['@vitejs/plugin-vue'] = '^5.0.3';
      deps.devDependencies['@vitejs/plugin-legacy'] = '^5.3.0';
      deps.devDependencies['vue-tsc'] = '^2.0.0';
      deps.devDependencies['autoprefixer'] = '^10.4.17';
    } else if (bundler === 'webpack') {
      deps.devDependencies['webpack'] = '^5.98.0';
      deps.devDependencies['webpack-cli'] = '^6.0.1';
      deps.devDependencies['webpack-dev-server'] = '^5.2.3';
      deps.devDependencies['html-webpack-plugin'] = '^5.6.0';
      deps.devDependencies['ts-loader'] = '^9.5.1';
      deps.devDependencies['vue-loader'] = '^17.4.2';
      deps.devDependencies['@vue/compiler-sfc'] = '^3.4.0';
      deps.devDependencies['css-loader'] = '^7.1.2';
      deps.devDependencies['style-loader'] = '^4.0.0';
      deps.devDependencies['mini-css-extract-plugin'] = '^2.9.2';
      deps.devDependencies['autoprefixer'] = '^10.4.21';
      deps.devDependencies['postcss-loader'] = '^8.1.1';
    }

    // Pinia 状态管理
    if (stateManager === 'pinia') {
      deps.dependencies['pinia'] = '^2.1.7';
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
        typecheck: 'vue-tsc --noEmit',
      };
    }
    return {
      dev: 'vite',
      build: 'vue-tsc && vite build',
      preview: 'vite preview',
    };
  },
};
