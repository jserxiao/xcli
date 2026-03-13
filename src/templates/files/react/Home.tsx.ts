export function getHomeTsx(styleExt: string, stateManager: string, projectName: string): string {
  if (stateManager === 'redux') {
    return `import { useAppDispatch, useAppSelector } from '../store';
import { decrement, increment } from '../store/counterSlice';
import './Home.${styleExt}';

function Home() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="page">
      <h1>首页</h1>
      <p>欢迎使用 ${projectName}</p>
      <div className="card">
        <button onClick={() => dispatch(decrement())}>-</button>
        <span style={{ margin: '0 1rem' }}>count is {count}</span>
        <button onClick={() => dispatch(increment())}>+</button>
      </div>
    </div>
  );
}

export default Home;
`;
  } else if (stateManager === 'mobx') {
    return `import { observer } from 'mobx-react-lite';
import { counterStore } from '../store';
import './Home.${styleExt}';

const Home = observer(() => {
  return (
    <div className="page">
      <h1>首页</h1>
      <p>欢迎使用 ${projectName}</p>
      <div className="card">
        <button onClick={() => counterStore.decrement()}>-</button>
        <span style={{ margin: '0 1rem' }}>count is {counterStore.count}</span>
        <button onClick={() => counterStore.increment()}>+</button>
      </div>
    </div>
  );
});

export default Home;
`;
  }

  // 默认无状态管理
  return `import { useState } from 'react';
import './Home.${styleExt}';

function Home() {
  const [count, setCount] = useState(0);

  return (
    <div className="page">
      <h1>首页</h1>
      <p>欢迎使用 ${projectName}</p>
      <div className="card">
        <button onClick={() => setCount((count) => count - 1)}>-</button>
        <span style={{ margin: '0 1rem' }}>count is {count}</span>
        <button onClick={() => setCount((count) => count + 1)}>+</button>
      </div>
    </div>
  );
}

export default Home;
`;
}
