export function getMainTsx(styleExt: string, stateManager: string): string {
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

  return mainTsx;
}
