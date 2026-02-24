import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import './AppLayout.css';

const AppLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-shell">
        <Header />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;