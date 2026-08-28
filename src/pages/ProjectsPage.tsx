import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import { APP_ROUTES } from '../constants/routes';
import { useAllProjects } from '../hooks/useProjects';
import { getErrorMessage } from '../utils/error';
import { sanitizePage } from '../utils/pagination';
import './ProjectsPage.css';

const ProjectsPage = () => {
  const [page, setPage] = useState(0);
  const [size] = useState(12);
  const projectsQuery = useAllProjects(page, size);

  const errorText = useMemo(() => {
    if (projectsQuery.error) return getErrorMessage(projectsQuery.error);
    return '';
  }, [projectsQuery.error]);

  if (projectsQuery.isLoading) {
    return <LoadingSpinner />;
  }

  const projects = projectsQuery.data?.content ?? [];

  return (
    <section className="projects-page page-shell">
      <header className="page-heading">
        <div>
          <h1>Projects</h1>
          <p>Open your active project boards directly from here.</p>
        </div>
        <Link className="secondary-button" to={APP_ROUTES.workspaces}>
          Manage Workspaces
        </Link>
      </header>

      {errorText && <p className="error">{errorText}</p>}

      <div className="projects-toolbar">
        <input className="field" type="search" placeholder="Search projects..." />
      </div>

      <ul className="project-list">
        {projects.map((project) => (
          <li className="surface-card project-card" key={project.id}>
            <div>
              <span className="project-avatar">{project.name.charAt(0).toUpperCase()}</span>
              <Link to={APP_ROUTES.projectDetails(project.id)}>
                <h3>{project.name}</h3>
              </Link>
              <p>{project.description || 'No description added yet.'}</p>
            </div>
            <Link className="text-link" to={APP_ROUTES.workspaceDetails(project.workspaceId)}>
              Workspace
            </Link>
          </li>
        ))}
      </ul>

      {projects.length === 0 && (
        <div className="surface-card empty-projects">
          <h2>No projects yet</h2>
          <p>Create a workspace first, then add your first project inside it.</p>
          <Link className="primary-button" to={APP_ROUTES.workspaces}>
            Go to Workspaces
          </Link>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={projectsQuery.data?.totalPages ?? 0}
        onPrevious={() => setPage((prev) => sanitizePage(prev - 1))}
        onNext={() => setPage((prev) => prev + 1)}
      />
    </section>
  );
};

export default ProjectsPage;
