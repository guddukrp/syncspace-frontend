import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';
import { APP_ROUTES } from '../constant';
import { useAuth } from '../hooks/useAuth';
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

  const { user } = useAuth();

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
    await createWorkspace.mutateAsync({
      ...values,
      ownerId: user?.id || '',
    });
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
    <section className="workspaces-page">
      <header>
        <h1>Workspaces</h1>
        <button onClick={() => setModalOpen(true)}>Create Workspace</button>
      </header>

      {errorText && <p className="error">{errorText}</p>}

      <ul className="workspace-list">
        {workspacesQuery.data?.content.map((workspace) => (
          <li key={workspace.id}>
            <div>
              <Link to={APP_ROUTES.workspaceDetails(workspace.id)}>
                <h3>{workspace.name}</h3>
              </Link>
              <p>{workspace.description || 'No description'}</p>
            </div>
            <button
              className="delete-btn"
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
            <input {...register('name')} />
            {errors.name && <small className="error">{errors.name.message}</small>}
          </label>
          <label>
            Description
            <textarea rows={3} {...register('description')} />
            {errors.description && <small className="error">{errors.description.message}</small>}
          </label>
          <button type="submit" disabled={createWorkspace.isPending}>
            {createWorkspace.isPending ? 'Creating...' : 'Create'}
          </button>
        </form>
      </Modal>
    </section>
  );
};

export default WorkspacesPage;