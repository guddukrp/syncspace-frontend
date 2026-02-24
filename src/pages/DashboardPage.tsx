import { useWorkspaces } from '../hooks/useWorkspaces';
import { useTasks } from '../hooks/useTasks';
import LoadingSpinner from '../components/common/LoadingSpinner';
import './DashboardPage.css';

const DashboardPage = () => {
  const workspaceQuery = useWorkspaces(0, 5);
  const taskQuery = useTasks(0, 5);

  if (workspaceQuery.isLoading || taskQuery.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="dashboard-page">
      <h1>Dashboard</h1>
      <div className="stats-grid">
        <article>
          <h3>Total Workspaces</h3>
          <p>{workspaceQuery.data?.totalElements ?? 0}</p>
        </article>
        <article>
          <h3>Total Tasks</h3>
          <p>{taskQuery.data?.totalElements ?? 0}</p>
        </article>
      </div>
    </section>
  );
};

export default DashboardPage;