import type { StyleType } from '../../../types/index.js';

/**
 * 获取基础样式内容
 */
export function getBaseStyles(): string {
  return `:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}

a:hover {
  color: #535bf2;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
}
`;
}

/**
 * 获取 App 组件样式
 * @param styleType 样式类型
 * @param framework 框架类型，用于生成不同的 active class 名
 */
export function getAppStyles(styleType: StyleType, framework: 'react' | 'vue' = 'react'): string {
  const activeClass = framework === 'react' ? 'active' : 'router-link-active';

  if (styleType === 'scss' || styleType === 'less') {
    return `.app {
  .nav {
    display: flex;
    gap: 1rem;
    padding: 1rem 0;
    border-bottom: 1px solid #333;
    margin-bottom: 2rem;

    a {
      color: #646cff;
      text-decoration: none;

      &:hover {
        color: #535bf2;
      }

      &.${activeClass} {
        color: #535bf2;
        font-weight: bold;
      }
    }
  }

  .main-content {
    max-width: 1280px;
    margin: 0 auto;
    padding: 2rem;
    text-align: center;
  }
}`;
  }

  return `.app {
  text-align: center;
}

.nav {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #333;
  margin-bottom: 2rem;
}

.nav a {
  color: #646cff;
  text-decoration: none;
}

.nav a:hover {
  color: #535bf2;
}

.nav a.${activeClass} {
  color: #535bf2;
  font-weight: bold;
}

.main-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}`;
}

/**
 * 获取页面样式
 */
export function getPageStyles(styleType: StyleType): string {
  if (styleType === 'scss' || styleType === 'less') {
    return `.page {
  padding: 2rem;

  h1 {
    margin-bottom: 1rem;
  }

  p {
    color: #888;
  }
}`;
  }

  return `.page {
  padding: 2rem;
}

.page h1 {
  margin-bottom: 1rem;
}

.page p {
  color: #888;
}
`;
}

/**
 * 获取样式文件扩展名
 */
export function getStyleExt(styleType: StyleType): string {
  switch (styleType) {
    case 'less':
      return 'less';
    case 'scss':
      return 'scss';
    default:
      return 'css';
  }
}
