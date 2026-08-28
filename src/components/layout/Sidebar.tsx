import { useState } from 'react';
import {
  FiActivity,
  FiBriefcase,
  FiChevronDown,
  FiGrid,
  FiKey,
  FiPlus,
  FiSettings,
  FiTrash2,
  FiUsers,
} from 'react-icons/fi';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { APP_ROUTES } from '../../constants/routes';
import { useSelectedWorkspace } from '../../hooks/useSelectedWorkspace';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isWorkspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const { isLoading, selectedWorkspace, selectedWorkspaceId, selectWorkspace, workspaces } = useSelectedWorkspace();
  const currentRoute = `${location.pathname}${location.search}`;

  const workspaceNav = selectedWorkspaceId
    ? [
        { to: APP_ROUTES.workspaceSection(selectedWorkspaceId, 'projects'), label: 'Projects', Icon: FiBriefcase },
        { to: APP_ROUTES.workspaceSection(selectedWorkspaceId, 'members'), label: 'Members', Icon: FiUsers },
        { to: APP_ROUTES.workspaceSection(selectedWorkspaceId, 'activity'), label: 'Activity', Icon: FiActivity },
        { to: APP_ROUTES.workspaceSection(selectedWorkspaceId, 'settings'), label: 'Settings', Icon: FiSettings },
      ]
    : [];

  const handleWorkspaceChange = (workspaceId: string) => {
    selectWorkspace(workspaceId);
    setWorkspaceMenuOpen(false);
    navigate(APP_ROUTES.workspaceSection(workspaceId, 'projects'));
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <img src="/sync-space.svg" alt="" />
        <strong>SyncSpace</strong>
      </div>

      <nav className="sidebar-nav">
        <NavLink to={APP_ROUTES.dashboard}>
          <span>
            <FiGrid />
          </span>
          Dashboard
        </NavLink>

        <p>Workspace</p>
        {workspaceNav.map(({ Icon, ...item }) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={() => (currentRoute === item.to ? 'active' : '')}
          >
            <span>
              <Icon />
            </span>
            {item.label}
          </NavLink>
        ))}

        <p>Tools</p>
        <a aria-disabled="true">
          <span>
            <FiKey />
          </span>
          API Tokens
        </a>
        <a aria-disabled="true">
          <span>
            <FiTrash2 />
          </span>
          Trash
        </a>
      </nav>

      <div className="workspace-switcher">
        <button
          type="button"
          className="workspace-card"
          onClick={() => setWorkspaceMenuOpen((isOpen) => !isOpen)}
          disabled={isLoading}
          aria-expanded={isWorkspaceMenuOpen}
        >
          <span>{selectedWorkspace?.name.charAt(0).toUpperCase() || 'W'}</span>
          <div>
            <strong>{selectedWorkspace?.name || 'No workspace'}</strong>
            <small>Current workspace</small>
          </div>
          <FiChevronDown className="workspace-chevron" />
        </button>

        {isWorkspaceMenuOpen && (
          <div className="workspace-menu">
            {workspaces.length === 0 && <p>No workspaces yet</p>}
            {workspaces.map((workspace) => (
              <button
                key={workspace.id}
                type="button"
                className={workspace.id === selectedWorkspaceId ? 'active' : ''}
                onClick={() => handleWorkspaceChange(workspace.id)}
              >
                <span>{workspace.name.charAt(0).toUpperCase()}</span>
                {workspace.name}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setWorkspaceMenuOpen(false);
                navigate(APP_ROUTES.workspaces);
              }}
            >
              <span>
                <FiPlus />
              </span>
              Manage workspaces
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
