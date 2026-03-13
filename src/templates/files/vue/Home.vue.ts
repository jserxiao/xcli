import type { StyleType } from '../../../types/index.js';
import { getPageStyles } from './styles.js';

export function getHomeVue(styleType: StyleType, stateManager: string, projectName: string): string {
  const styleExt = styleType === 'css' ? '' : ` lang="${styleType}"`;

  if (stateManager === 'pinia') {
    return `<script setup lang="ts">
import { useCounterStore } from '../store/counter';
import { storeToRefs } from 'pinia';

const counterStore = useCounterStore();
const { count, doubleCount } = storeToRefs(counterStore);
</script>

<template>
  <div class="page">
    <h1>首页</h1>
    <p>欢迎使用 ${projectName}</p>
    <div class="card">
      <button type="button" @click="counterStore.decrement()">-</button>
      <span style="margin: 0 1rem">count is {{ count }}</span>
      <button type="button" @click="counterStore.increment()">+</button>
    </div>
    <p>Double: {{ doubleCount }}</p>
  </div>
</template>

<style scoped${styleExt}>
${getPageStyles(styleType)}
</style>
`;
  }

  return `<script setup lang="ts">
import { ref } from 'vue';

const count = ref(0);
</script>

<template>
  <div class="page">
    <h1>首页</h1>
    <p>欢迎使用 ${projectName}</p>
    <div class="card">
      <button type="button" @click="count--">-</button>
      <span style="margin: 0 1rem">count is {{ count }}</span>
      <button type="button" @click="count++">+</button>
    </div>
  </div>
</template>

<style scoped${styleExt}>
${getPageStyles(styleType)}
</style>
`;
}
