import { FiBell, FiHelpCircle, FiLogOut, FiSearch } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <label className="header-search">
        <FiSearch />
        <span>Search</span>
        <input type="search" placeholder="Search anything..." />
      </label>
      <div className="header-right">
        <button className="header-icon" aria-label="Notifications">
          <FiBell />
        </button>
        <button className="header-icon" aria-label="Help">
          <FiHelpCircle />
        </button>
        <div className="profile-chip">
          <span>{user?.displayName?.charAt(0).toUpperCase() || 'U'}</span>
          <div>
            <strong>{user?.displayName || 'User'}</strong>
            <small>{user?.email || 'Signed in'}</small>
          </div>
        </div>
        <button className="ghost-button logout-button" onClick={logout}>
          <FiLogOut />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
