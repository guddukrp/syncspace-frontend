import { useWorkspaces } from '../hooks/useWorkspaces';
import { useTasks } from '../hooks/useTasks';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';
import './DashboardPage.css';

const DashboardPage = () => {
  const { user } = useAuth();
  const workspaceQuery = useWorkspaces(0, 5);
  const taskQuery = useTasks(0, 5);

  if (workspaceQuery.isLoading || taskQuery.isLoading) {
    return <LoadingSpinner />;
  }

  const tasks = taskQuery.data?.content ?? [];
  const activeTasks = tasks.filter((task) => task.status !== 'DONE');
  const blockedTasks = tasks.filter((task) => task.status === 'BLOCKED');

  return (
    <section className="dashboard-page page-shell">
      <header className="page-heading">
        <div>
          <h1>Good morning, {user?.displayName || 'there'}</h1>
          <p>Here is what is happening across your workspace.</p>
        </div>
      </header>

      <div className="stats-grid">
        <article className="surface-card stat-card">
          <span>Workspaces</span>
          <strong>{workspaceQuery.data?.totalElements ?? 0}</strong>
          <small>Available to you</small>
        </article>
        <article className="surface-card stat-card">
          <span>Tasks</span>
          <strong>{taskQuery.data?.totalElements ?? 0}</strong>
          <small>Across your spaces</small>
        </article>
        <article className="surface-card stat-card">
          <span>Active</span>
          <strong>{activeTasks.length}</strong>
          <small>Needs attention</small>
        </article>
        <article className="surface-card stat-card">
          <span>Blocked</span>
          <strong>{blockedTasks.length}</strong>
          <small>Review soon</small>
        </article>
      </div>

      <div className="dashboard-grid">
        <article className="surface-card dashboard-panel">
          <div className="panel-title">
            <h2>Recent Workspaces</h2>
            <a>View all</a>
          </div>
          <ul className="dashboard-list">
            {workspaceQuery.data?.content.map((workspace) => (
              <li key={workspace.id}>
                <span className="list-icon">{workspace.name.charAt(0).toUpperCase()}</span>
                <div>
                  <strong>{workspace.name}</strong>
                  <small>{workspace.description || 'Workspace'}</small>
                </div>
              </li>
            ))}
            {workspaceQuery.data?.content.length === 0 && <li className="empty-row">No workspaces yet.</li>}
          </ul>
        </article>

        <article className="surface-card dashboard-panel">
          <div className="panel-title">
            <h2>Recent Tasks</h2>
            <a>View all</a>
          </div>
          <ul className="dashboard-list activity-list">
            {tasks.map((task) => (
              <li key={task.id}>
                <span className="list-icon">{task.title.charAt(0).toUpperCase()}</span>
                <div>
                  <strong>{task.title}</strong>
                  <small>{task.description || 'No description'}</small>
                </div>
                <em className={`status-badge status-${task.status.toLowerCase()}`}>{task.status}</em>
              </li>
            ))}
            {tasks.length === 0 && <li className="empty-row">No tasks yet.</li>}
          </ul>
        </article>
      </div>
    </section>
  );
};

export default DashboardPage;
