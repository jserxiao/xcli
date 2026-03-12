import type { Plugin, PluginContext } from '../types/index.js';

/**
 * 生成 Vite 配置文件内容
 */
function getViteConfig(context: PluginContext): string {
  const { projectType, stateManager } = context;

  // React 项目的 monorepo 配置
  if (projectType === 'react') {
    return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  resolve: {
    alias: {
      shared: resolve(__dirname, 'packages/shared/src'),
      ui: resolve(__dirname, 'packages/ui/src'),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom'],
  },
  optimizeDeps: {
    include: ['shared', 'ui'],
  },
  css: {
    postcss: {
      plugins: [autoprefixer()],
    },
  },
  server: {
    port: 3000,
    open: true,
    watch: {
      ignored: ['!**/node_modules/**', '!**/packages/**'],
    },
  },
  build: {
    sourcemap: true,
  },
});
`;
  }

  // Vue 项目的 monorepo 配置
  if (projectType === 'vue') {
    const dedupeList = stateManager === 'pinia' 
      ? "'vue', 'vue-router', 'pinia'" 
      : "'vue', 'vue-router'";
    
    return `import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
  resolve: {
    alias: {
      shared: resolve(__dirname, 'packages/shared/src'),
      ui: resolve(__dirname, 'packages/ui/src'),
    },
    dedupe: [${dedupeList}],
  },
  optimizeDeps: {
    include: ['shared', 'ui'],
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer({
          grid: true,
          flexbox: true,
          overrideBrowserslist: ['defaults', 'ie >= 10']
        })
      ],
    },
  },
  server: {
    port: 3000,
    open: true,
    watch: {
      ignored: ['!**/node_modules/**', '!**/packages/**'],
    },
  },
  build: {
    sourcemap: true,
  },
});
`;
  }

  // Library 模式的默认配置
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
      plugins: [
        autoprefixer({
          grid: true,
          flexbox: true,
          overrideBrowserslist: ['defaults', 'ie >= 10']
        })
      ],
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

export const vitePlugin: Plugin = {
  name: 'vite',
  displayName: 'Vite',
  description: '添加 Vite 构建工具配置（含 autoprefixer 和 legacy 浏览器兼容）',
  category: 'bundler',
  defaultEnabled: false,
  devDependencies: {
    vite: '^5.0.12',
    '@vitejs/plugin-legacy': '^5.3.0',
    autoprefixer: '^10.4.17',
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
