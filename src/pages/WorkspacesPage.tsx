import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';
import { APP_ROUTES } from '../constants/routes';
import { useCreateWorkspace, useDeleteWorkspace, useWorkspaces } from '../hooks/useWorkspaces';
import { getErrorMessage } from '../utils/error';
import { sanitizePage } from '../utils/pagination';
import { workspaceSchema } from '../utils/validators';
import './WorkspacesPage.css';

type WorkspaceFormValues = z.infer<typeof workspaceSchema>;

const WorkspacesPage = () => {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [isModalOpen, setModalOpen] = useState(false);

  const workspacesQuery = useWorkspaces(page, size);
  const createWorkspace = useCreateWorkspace();
  const deleteWorkspace = useDeleteWorkspace();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WorkspaceFormValues>({
    resolver: zodResolver(workspaceSchema),
  });

  const submitWorkspace = async (values: WorkspaceFormValues) => {
    await createWorkspace.mutateAsync(values);
    reset();
    setModalOpen(false);
  };

  const errorText = useMemo(() => {
    if (workspacesQuery.error) return getErrorMessage(workspacesQuery.error);
    if (createWorkspace.error) return getErrorMessage(createWorkspace.error);
    if (deleteWorkspace.error) return getErrorMessage(deleteWorkspace.error);
    return '';
  }, [workspacesQuery.error, createWorkspace.error, deleteWorkspace.error]);

  if (workspacesQuery.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="workspaces-page page-shell">
      <header className="page-heading">
        <div>
          <h1>Workspaces</h1>
          <p>Create team spaces, invite members, and organize projects.</p>
        </div>
        <button className="primary-button" onClick={() => setModalOpen(true)}>
          New Workspace
        </button>
      </header>

      {errorText && <p className="error">{errorText}</p>}

      <div className="workspace-toolbar">
        <input className="field" type="search" placeholder="Search workspaces..." />
      </div>

      <ul className="workspace-list">
        {workspacesQuery.data?.content.map((workspace) => (
          <li className="surface-card" key={workspace.id}>
            <div>
              <span className="workspace-avatar">{workspace.name.charAt(0).toUpperCase()}</span>
              <Link to={APP_ROUTES.workspaceDetails(workspace.id)}>
                <h3>{workspace.name}</h3>
              </Link>
              <p>{workspace.description || 'Updated recently'}</p>
            </div>
            <button
              className="danger-button"
              onClick={() => deleteWorkspace.mutate(workspace.id)}
              disabled={deleteWorkspace.isPending}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <Pagination
        page={page}
        totalPages={workspacesQuery.data?.totalPages ?? 0}
        onPrevious={() => setPage((prev) => sanitizePage(prev - 1))}
        onNext={() => setPage((prev) => prev + 1)}
      />

      <Modal title="Create Workspace" open={isModalOpen} onClose={() => setModalOpen(false)}>
        <form className="create-form" onSubmit={handleSubmit(submitWorkspace)}>
          <label>
            Name
            <input className="field" {...register('name')} />
            {errors.name && <small className="error">{errors.name.message}</small>}
          </label>
          <label>
            Description
            <textarea className="textarea-field" rows={3} {...register('description')} />
            {errors.description && <small className="error">{errors.description.message}</small>}
          </label>
          <button className="primary-button" type="submit" disabled={createWorkspace.isPending}>
            {createWorkspace.isPending ? 'Creating...' : 'Create'}
          </button>
        </form>
      </Modal>
    </section>
  );
};

export default WorkspacesPage;
