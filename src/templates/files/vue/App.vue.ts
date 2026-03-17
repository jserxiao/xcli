import type { StyleType } from '../../../types';
import { getAppStyles } from './styles';

export function getAppVue(styleType: StyleType): string {
  const styleExt = styleType === 'css' ? '' : ` lang="${styleType}"`;
  return `<script setup lang="ts">
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

<style scoped${styleExt}>
${getAppStyles(styleType, 'vue')}
</style>
`;
}
