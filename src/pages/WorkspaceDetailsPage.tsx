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
import {
  useAddWorkspaceMember,
  useRemoveWorkspaceMember,
  useUpdateWorkspaceMemberRole,
  useWorkspaceMembers,
} from '../hooks/useWorkspaceMembers';
import { useWorkspace } from '../hooks/useWorkspaces';
import { sanitizePage } from '../utils/pagination';
import { getErrorMessage } from '../utils/error';
import { addWorkspaceMemberSchema, projectSchema } from '../utils/validators';
import './WorkspaceDetailsPage.css';

type ProjectFormValues = z.infer<typeof projectSchema>;
type MemberFormValues = z.infer<typeof addWorkspaceMemberSchema>;

const WorkspaceDetailsPage = () => {
  const { id = '' } = useParams();
  const [page, setPage] = useState(0);

  const workspaceQuery = useWorkspace(id);
  const projectQuery = useProjects(id, page, 10);
  const createProject = useCreateProject(id);
  const activityLogs = useWorkspaceActivityLogs(id);
  const membersQuery = useWorkspaceMembers(id);
  const addMember = useAddWorkspaceMember(id);
  const updateMemberRole = useUpdateWorkspaceMemberRole(id);
  const removeMember = useRemoveWorkspaceMember(id);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
  });
  const {
    register: registerMember,
    handleSubmit: handleMemberSubmit,
    reset: resetMember,
    formState: { errors: memberErrors },
  } = useForm<MemberFormValues>({
    resolver: zodResolver(addWorkspaceMemberSchema),
    defaultValues: {
      role: 'MEMBER',
    },
  });

  const onSubmit = async (values: ProjectFormValues) => {
    await createProject.mutateAsync(values);
    reset();
  };
  const onMemberSubmit = async (values: MemberFormValues) => {
    await addMember.mutateAsync(values);
    resetMember({ email: '', role: 'MEMBER' });
  };

  if (workspaceQuery.isLoading || projectQuery.isLoading || activityLogs.isLoading || membersQuery.isLoading) {
    return <LoadingSpinner />;
  }

  const memberError = addMember.error || updateMemberRole.error || removeMember.error || membersQuery.error;

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

      <article className="card">
        <h3>Members</h3>
        {memberError && <p className="error">{getErrorMessage(memberError)}</p>}
        <form className="inline-form member-form" onSubmit={handleMemberSubmit(onMemberSubmit)}>
          <input placeholder="User email" type="email" {...registerMember('email')} />
          <select {...registerMember('role')}>
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button type="submit" disabled={addMember.isPending}>
            {addMember.isPending ? 'Adding...' : 'Add'}
          </button>
        </form>
        {(memberErrors.email || memberErrors.role) && <p className="error">Enter a valid email and role.</p>}
        <ul className="member-list">
          {membersQuery.data?.map((member) => (
            <li key={member.id}>
              <div>
                <strong>{member.displayName || member.email || member.userId}</strong>
                <span>{member.email || member.userId}</span>
              </div>
              <div className="member-actions">
                {member.role === 'OWNER' ? (
                  <span className="role-pill">Owner</span>
                ) : (
                  <select
                    value={member.role}
                    onChange={(event) =>
                      updateMemberRole.mutate({
                        memberId: member.id,
                        payload: { role: event.target.value as 'ADMIN' | 'MEMBER' },
                      })
                    }
                    disabled={updateMemberRole.isPending}
                  >
                    <option value="MEMBER">Member</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                )}
                {member.role !== 'OWNER' && (
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => removeMember.mutate(member.id)}
                    disabled={removeMember.isPending}
                  >
                    Remove
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </article>

      <ActivityLogPanel title="Activity Log" logs={activityLogs.data} />
    </section>
  );
};

export default WorkspaceDetailsPage;
