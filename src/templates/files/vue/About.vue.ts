import type { StyleType } from '../../../types';
import { getPageStyles } from './styles';

export function getAboutVue(styleType: StyleType, projectName: string): string {
  const styleExt = styleType === 'css' ? '' : ` lang="${styleType}"`;

  return `<script setup lang="ts">
import { ref, onMounted } from 'vue';
// 引用 shared 包中的工具函数
import { formatDate, sleep } from 'shared';
// 引用 ui 包中的组件
import { MyButton } from 'ui';

const date = ref<string>('');

onMounted(() => {
  // 使用 shared 包中的工具函数
  date.value = formatDate(new Date());

  // 示例：使用 sleep 函数
  sleep(1000).then(() => {
    console.log('Welcome to ${projectName}!');
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
      <MyButton variant="primary" @click="() => alert('Primary clicked!')">
        Primary Button
      </MyButton>
      <MyButton variant="secondary" @click="() => alert('Secondary clicked!')">
        Secondary Button
      </MyButton>
    </div>
  </div>
</template>

<style scoped${styleExt}>
${getPageStyles(styleType)}

.button-demo {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}
</style>
`;
}
