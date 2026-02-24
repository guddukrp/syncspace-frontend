import { useAuth } from '../../hooks/useAuth';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div>
        <h2>Syncspace</h2>
        <small>Team productivity workspace</small>
      </div>
      <div className="header-right">
        <span>{user?.email || 'Unknown user'}</span>
        <span className="role">{user?.role}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  );
};

export default Header;