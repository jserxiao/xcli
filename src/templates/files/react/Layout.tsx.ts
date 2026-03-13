export function getLayoutTsx(styleExt: string): string {
  return `import { NavLink, Outlet } from 'react-router-dom';
import './Layout.${styleExt}';

function Layout() {
  return (
    <div className="app">
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
          首页
        </NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? 'active' : ''}>
          关于
        </NavLink>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
`;
}
