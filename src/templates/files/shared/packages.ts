import path from 'path';
import fs from 'fs-extra';

/**
 * 创建 shared 包
 */
export async function createSharedPackage(projectPath: string) {
  const sharedPath = path.join(projectPath, 'packages', 'shared');
  await fs.ensureDir(sharedPath);
  await fs.ensureDir(path.join(sharedPath, 'src'));

  // package.json
  await fs.writeFile(
    path.join(sharedPath, 'package.json'),
    JSON.stringify(
      {
        name: 'shared',
        version: '1.0.0',
        private: true,
        type: 'module',
        main: './src/index.ts',
        types: './src/index.ts',
        exports: {
          '.': {
            import: './src/index.ts',
            types: './src/index.ts',
          },
        },
      },
      null,
      2
    ),
    'utf-8'
  );

  // src/index.ts
  await fs.writeFile(
    path.join(sharedPath, 'src', 'index.ts'),
    `/**
 * 格式化日期
 */
export function formatDate(date: Date, format = 'YYYY-MM-DD'): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day);
}

/**
 * 延迟函数
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
`,
    'utf-8'
  );
}

/**
 * 创建 React UI 包
 */
export async function createReactUiPackage(projectPath: string) {
  const uiPath = path.join(projectPath, 'packages', 'ui');
  await fs.ensureDir(uiPath);
  await fs.ensureDir(path.join(uiPath, 'src'));

  // package.json
  await fs.writeFile(
    path.join(uiPath, 'package.json'),
    JSON.stringify(
      {
        name: 'ui',
        version: '1.0.0',
        private: true,
        type: 'module',
        main: './src/index.tsx',
        types: './src/index.tsx',
        exports: {
          '.': {
            import: './src/index.tsx',
            types: './src/index.tsx',
          },
        },
        peerDependencies: {
          react: '^18.0.0',
        },
      },
      null,
      2
    ),
    'utf-8'
  );

  // src/index.tsx
  await fs.writeFile(
    path.join(uiPath, 'src', 'index.tsx'),
    `import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  children: React.ReactNode;
}

export function Button({ variant = 'primary', onClick, children }: ButtonProps) {
  const baseStyle: React.CSSProperties = {
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.2s ease',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      ...baseStyle,
      backgroundColor: '#646cff',
      color: 'white',
    },
    secondary: {
      ...baseStyle,
      backgroundColor: '#f0f0f0',
      color: '#333',
    },
  };

  return (
    <button style={variantStyles[variant]} onClick={onClick}>
      {children}
    </button>
  );
}
`,
    'utf-8'
  );
}

/**
 * 创建 Vue UI 包
 */
export async function createVueUiPackage(projectPath: string) {
  const uiPath = path.join(projectPath, 'packages', 'ui');
  await fs.ensureDir(uiPath);
  await fs.ensureDir(path.join(uiPath, 'src'));

  // package.json
  await fs.writeFile(
    path.join(uiPath, 'package.json'),
    JSON.stringify(
      {
        name: 'ui',
        version: '1.0.0',
        private: true,
        type: 'module',
        main: './src/index.ts',
        types: './src/index.ts',
        exports: {
          '.': {
            import: './src/index.ts',
            types: './src/index.ts',
          },
        },
        peerDependencies: {
          vue: '^3.0.0',
        },
      },
      null,
      2
    ),
    'utf-8'
  );

  // src/MyButton.vue
  await fs.writeFile(
    path.join(uiPath, 'src', 'MyButton.vue'),
    `<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary';
}>();

const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    :class="['my-button', variant]"
    @click="emit('click')"
  >
    <slot />
  </button>
</template>

<style scoped>
.my-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.my-button.primary {
  background-color: #646cff;
  color: white;
}

.my-button.secondary {
  background-color: #f0f0f0;
  color: #333;
}
</style>
`,
    'utf-8'
  );

  // src/index.ts
  await fs.writeFile(
    path.join(uiPath, 'src', 'index.ts'),
    `export { default as MyButton } from './MyButton.vue';
`,
    'utf-8'
  );
}
