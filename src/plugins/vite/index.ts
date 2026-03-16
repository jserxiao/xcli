import type { Plugin, PluginContext } from '../../types/index.js';
import { BUNDLER_VERSIONS, STYLE_VERSIONS } from '../../constants/index.js';

/**
 * 获取 React Vite 配置
 */
function getReactViteConfig(): string {
  return `import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  return {
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
    // 定义全局常量，将环境变量注入到应用中
    define: {
      __APP_ENV__: JSON.stringify(env),
    },
  };
});
`;
}

/**
 * 获取 Vue Vite 配置
 */
function getVueViteConfig(): string {
  return `import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  return {
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
    // 定义全局常量，将环境变量注入到应用中
    define: {
      __APP_ENV__: JSON.stringify(env),
    },
  };
});
`;
}

/**
 * 获取 Library Vite 配置
 */
function getLibraryViteConfig(): string {
  return `import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [
    dts({
      include: ['src'],
      outDir: 'dist',
    }),
  ],
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MyLib',
      fileName: (format) => \`index.\${format}.js\`,
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: ['node:fs', 'node:path'],
    },
    sourcemap: true,
  },
});
`;
}

/**
 * 根据项目类型获取 Vite 配置
 */
function getViteConfig(context: PluginContext): string {
  const { projectType } = context;

  switch (projectType) {
    case 'react':
      return getReactViteConfig();
    case 'vue':
      return getVueViteConfig();
    default:
      return getLibraryViteConfig();
  }
}

// 导出配置生成函数，供模板使用
export { getReactViteConfig, getVueViteConfig, getLibraryViteConfig };

export const vitePlugin: Plugin = {
  name: 'vite',
  displayName: 'Vite',
  description: '添加 Vite 构建工具配置（含 autoprefixer 和 legacy 浏览器兼容）',
  category: 'bundler',
  defaultEnabled: false,
  devDependencies: {
    vite: BUNDLER_VERSIONS.vite,
    '@vitejs/plugin-legacy': BUNDLER_VERSIONS['@vitejs/plugin-legacy'],
    autoprefixer: STYLE_VERSIONS.autoprefixer,
  },
  scripts: {
    preview: 'vite preview',
  },
  files: [
    {
      path: 'vite.config.ts',
      content: (context: PluginContext) => getViteConfig(context),
    },
  ],
};
