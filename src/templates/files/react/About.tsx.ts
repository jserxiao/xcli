export function getAboutTsx(styleExt: string, projectName: string): string {
  return `import { formatDate, sleep } from 'shared';
import { Button } from 'ui';
import { useState, useEffect } from 'react';
import './About.${styleExt}';

function About() {
  const [date, setDate] = useState<string>('');

  useEffect(() => {
    // 使用 shared 包中的工具函数
    setDate(formatDate(new Date()));

    // 示例：使用 sleep 函数
    sleep(1000).then(() => {
      console.log('Welcome to ${projectName}!');
    });
  }, []);

  return (
    <div className="page">
      <h1>关于</h1>
      <p>这是一个使用 React + Vite + React Router 构建的 monorepo 项目。</p>
      <p>当前日期: {date}</p>
      <div className="button-demo">
        <p>UI 组件库示例:</p>
        <Button variant="primary" onClick={() => alert('Primary clicked!')}>
          Primary Button
        </Button>
        <Button variant="secondary" onClick={() => alert('Secondary clicked!')}>
          Secondary Button
        </Button>
      </div>
    </div>
  );
}

export default About;
`;
}
