export function getMainTs(styleExt: string, stateManager: string): string {
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

  return mainTs;
}
