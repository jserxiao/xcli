import type { StyleType } from '../../../types/index.js';

/**
 * 获取基础样式内容
 */
export function getBaseStyles(): string {
  return `:root {
  /* 主色调 */
  --primary-color: #6366f1;
  --primary-hover: #4f46e5;
  --primary-light: rgba(99, 102, 241, 0.1);
  
  /* 渐变色 */
  --gradient-start: #6366f1;
  --gradient-end: #a855f7;
  
  /* 文字颜色 */
  --text-primary: #1f2937;
  --text-secondary: #6b7280;
  --text-muted: #9ca3af;
  
  /* 背景色 */
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --bg-card: #ffffff;
  
  /* 边框 */
  --border-color: #e5e7eb;
  --border-radius: 12px;
  
  /* 阴影 */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* 字体 */
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  font-weight: 400;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 暗色主题 */
@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #f9fafb;
    --text-secondary: #d1d5db;
    --text-muted: #9ca3af;
    --bg-primary: #111827;
    --bg-secondary: #1f2937;
    --bg-card: #1f2937;
    --border-color: #374151;
  }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  min-width: 320px;
  min-height: 100vh;
  background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
}

a {
  font-weight: 500;
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

a:hover {
  color: var(--primary-hover);
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
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;

  a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    color: var(--text-secondary);
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      color: var(--primary-color);
      background: var(--primary-light);
    }

    &.${activeClass} {
      color: var(--primary-color);
      background: var(--primary-light);
    }
  }
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}`;
  }

  return `.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: var(--bg-card);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  color: var(--text-secondary);
  font-weight: 500;
  transition: all 0.2s ease;
}

.nav a:hover {
  color: var(--primary-color);
  background: var(--primary-light);
}

.nav a.${activeClass} {
  color: var(--primary-color);
  background: var(--primary-light);
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}`;
}

/**
 * 获取页面样式
 */
export function getPageStyles(styleType: StyleType): string {
  if (styleType === 'scss' || styleType === 'less') {
    return `.page {
  width: 100%;
  padding: 2rem 0;

  .hero {
    text-align: center;
    padding: 4rem 0;
    
    .logo {
      width: 120px;
      height: 120px;
      margin-bottom: 2rem;
      background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
      border-radius: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: auto;
      margin-right: auto;
      font-size: 3rem;
      box-shadow: var(--shadow-lg);
    }

    h1 {
      font-size: 3rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 1rem;
    }

    .subtitle {
      font-size: 1.25rem;
      color: var(--text-secondary);
      margin-bottom: 2rem;
    }

    .actions {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
  }

  .card {
    background: var(--bg-card);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    padding: 2rem;
    margin-top: 2rem;
    box-shadow: var(--shadow-md);
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }

    h2 {
      color: var(--text-primary);
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    p {
      color: var(--text-secondary);
    }
  }

  .counter-demo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin: 1.5rem 0;

    button {
      width: 48px;
      height: 48px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
      color: white;
      font-size: 1.5rem;
      font-weight: bold;
      cursor: pointer;
      transition: transform 0.2s ease, box-shadow 0.2s ease;

      &:hover {
        transform: scale(1.1);
        box-shadow: var(--shadow-lg);
      }

      &:active {
        transform: scale(0.95);
      }
    }

    .count {
      font-size: 2rem;
      font-weight: 700;
      min-width: 4rem;
      text-align: center;
      color: var(--text-primary);
    }
  }
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;

  &.primary {
    background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
    color: white;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg);
    }
  }

  &.secondary {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);

    &:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
  }
}`;
  }

  return `.page {
  width: 100%;
  padding: 2rem 0;
}

.hero {
  text-align: center;
  padding: 4rem 0;
}

.hero .logo {
  width: 120px;
  height: 120px;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  margin-right: auto;
  font-size: 3rem;
  box-shadow: var(--shadow-lg);
}

.hero h1 {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.hero .subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.hero .actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: 2rem;
  margin-top: 2rem;
  box-shadow: var(--shadow-md);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card h2 {
  color: var(--text-primary);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card p {
  color: var(--text-secondary);
}

.counter-demo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.counter-demo button {
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.counter-demo button:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-lg);
}

.counter-demo button:active {
  transform: scale(0.95);
}

.counter-demo .count {
  font-size: 2rem;
  font-weight: 700;
  min-width: 4rem;
  text-align: center;
  color: var(--text-primary);
}

/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  text-decoration: none;
}

.btn.primary {
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  color: white;
}

.btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn.secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn.secondary:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}`;
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
