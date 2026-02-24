import { NavLink } from 'react-router-dom';
import { APP_ROUTES } from '../../constant';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <h1>SYNCSPACE</h1>
      <nav>
        <NavLink to={APP_ROUTES.dashboard}>Dashboard</NavLink>
        <NavLink to={APP_ROUTES.workspaces}>Workspaces</NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;