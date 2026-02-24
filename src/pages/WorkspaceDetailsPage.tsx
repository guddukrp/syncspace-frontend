import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { z } from 'zod';
import ActivityLogPanel from '../components/common/ActivityLogPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import { APP_ROUTES } from '../constant';
import { useWorkspaceActivityLogs } from '../hooks/useActivityLogs';
import { useCreateProject, useProjects } from '../hooks/useProjects';
import { useWorkspace } from '../hooks/useWorkspaces';
import { sanitizePage } from '../utils/pagination';
import { projectSchema } from '../utils/validators';
import './WorkspaceDetailsPage.css';

type ProjectFormValues = z.infer<typeof projectSchema>;

const WorkspaceDetailsPage = () => {
  const { id = '' } = useParams();
  const [page, setPage] = useState(0);

  const workspaceQuery = useWorkspace(id);
  const projectQuery = useProjects(id, page, 10);
  const createProject = useCreateProject(id);
  const activityLogs = useWorkspaceActivityLogs(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = async (values: ProjectFormValues) => {
    await createProject.mutateAsync(values);
    reset();
  };

  if (workspaceQuery.isLoading || projectQuery.isLoading || activityLogs.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="workspace-details-page">
      <header>
        <h1>{workspaceQuery.data?.name || 'Workspace'}</h1>
        <p>{workspaceQuery.data?.description || 'No description available.'}</p>
      </header>

      <article className="card">
        <h3>Create Project</h3>
        <form className="inline-form" onSubmit={handleSubmit(onSubmit)}>
          <input placeholder="Project name" {...register('name')} />
          <input placeholder="Description" {...register('description')} />
          <button type="submit" disabled={createProject.isPending}>
            {createProject.isPending ? 'Creating...' : 'Create'}
          </button>
        </form>
        {(errors.name || errors.description) && <p className="error">Please fix form errors.</p>}
      </article>

      <article className="card">
        <h3>Projects</h3>
        <ul className="item-list">
          {projectQuery.data?.content.map((project) => (
            <li key={project.id}>
              <Link to={APP_ROUTES.projectDetails(project.id)}>{project.name}</Link>
              <span>{project.description || 'No description'}</span>
            </li>
          ))}
        </ul>
        <Pagination
          page={page}
          totalPages={projectQuery.data?.totalPages ?? 0}
          onPrevious={() => setPage((prev) => sanitizePage(prev - 1))}
          onNext={() => setPage((prev) => prev + 1)}
        />
      </article>

      <ActivityLogPanel title="Activity Log" logs={activityLogs.data} />
    </section>
  );
};

export default WorkspaceDetailsPage;