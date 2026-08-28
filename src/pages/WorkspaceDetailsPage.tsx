import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { z } from 'zod';
import ActivityLogPanel from '../components/common/ActivityLogPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';
import { APP_ROUTES } from '../constants/routes';
import { useWorkspaceActivityLogs } from '../hooks/useActivityLogs';
import { useCreateProject, useProjects } from '../hooks/useProjects';
import {
  useAddWorkspaceMember,
  useRemoveWorkspaceMember,
  useUpdateWorkspaceMemberRole,
  useWorkspaceMembers,
} from '../hooks/useWorkspaceMembers';
import { useWorkspace } from '../hooks/useWorkspaces';
import { useSelectedWorkspace } from '../hooks/useSelectedWorkspace';
import { sanitizePage } from '../utils/pagination';
import { getErrorMessage } from '../utils/error';
import { addWorkspaceMemberSchema, projectSchema } from '../utils/validators';
import './WorkspaceDetailsPage.css';

type ProjectFormValues = z.infer<typeof projectSchema>;
type MemberFormValues = z.infer<typeof addWorkspaceMemberSchema>;
type WorkspaceTab = 'projects' | 'members' | 'activity' | 'settings';
const workspaceTabs: WorkspaceTab[] = ['projects', 'members', 'activity', 'settings'];

const WorkspaceDetailsPage = () => {
  const { id = '' } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectWorkspace } = useSelectedWorkspace();
  const [page, setPage] = useState(0);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isMemberModalOpen, setMemberModalOpen] = useState(false);
  const tabParam = searchParams.get('tab') as WorkspaceTab | null;
  const activeTab = tabParam && workspaceTabs.includes(tabParam) ? tabParam : 'projects';

  const workspaceQuery = useWorkspace(id);
  const projectQuery = useProjects(id, page, 10);
  const createProject = useCreateProject(id);
  const activityLogs = useWorkspaceActivityLogs(id);
  const membersQuery = useWorkspaceMembers(id);
  const addMember = useAddWorkspaceMember(id);
  const updateMemberRole = useUpdateWorkspaceMemberRole(id);
  const removeMember = useRemoveWorkspaceMember(id);

  const setActiveTab = (tab: WorkspaceTab) => {
    setSearchParams({ tab });
  };

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
    setProjectModalOpen(false);
  };
  const onMemberSubmit = async (values: MemberFormValues) => {
    await addMember.mutateAsync(values);
    resetMember({ email: '', role: 'MEMBER' });
    setMemberModalOpen(false);
  };

  useEffect(() => {
    if (id) {
      selectWorkspace(id);
    }
  }, [id, selectWorkspace]);

  if (workspaceQuery.isLoading || projectQuery.isLoading || activityLogs.isLoading || membersQuery.isLoading) {
    return <LoadingSpinner />;
  }

  const memberError = addMember.error || updateMemberRole.error || removeMember.error || membersQuery.error;

  return (
    <section className="workspace-details-page page-shell">
      <header className="page-heading">
        <div>
          <h1>{workspaceQuery.data?.name || 'Workspace'}</h1>
          <p>{workspaceQuery.data?.description || 'Manage projects, members, and permissions.'}</p>
        </div>
        <div className="heading-actions">
          <button className="ghost-button" onClick={() => setMemberModalOpen(true)}>
            Invite Member
          </button>
          <button className="primary-button" onClick={() => setProjectModalOpen(true)}>
            New Project
          </button>
        </div>
      </header>

      <div className="workspace-tabs">
        <button className={activeTab === 'projects' ? 'active' : ''} onClick={() => setActiveTab('projects')}>
          Projects
        </button>
        <button className={activeTab === 'members' ? 'active' : ''} onClick={() => setActiveTab('members')}>
          Members
        </button>
        <button className={activeTab === 'activity' ? 'active' : ''} onClick={() => setActiveTab('activity')}>
          Activity
        </button>
        <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
          Settings
        </button>
      </div>

      {activeTab === 'projects' && (
        <article className="surface-card card">
          <div className="panel-title">
            <h3>Projects</h3>
            <small>{projectQuery.data?.totalElements ?? 0} total</small>
          </div>
          <ul className="item-list">
            {projectQuery.data?.content.map((project) => (
              <li key={project.id}>
                <span className="project-icon">{project.name.charAt(0).toUpperCase()}</span>
                <div>
                  <Link to={APP_ROUTES.projectDetails(project.id)}>{project.name}</Link>
                  <small>{project.description || 'Updated recently'}</small>
                </div>
                <em>Open</em>
              </li>
            ))}
            {projectQuery.data?.content.length === 0 && (
              <li className="empty-state">No projects yet. Create your first project.</li>
            )}
          </ul>
          <Pagination
            page={page}
            totalPages={projectQuery.data?.totalPages ?? 0}
            onPrevious={() => setPage((prev) => sanitizePage(prev - 1))}
            onNext={() => setPage((prev) => prev + 1)}
          />
        </article>
      )}

      {activeTab === 'members' && (
        <article className="surface-card card">
          <div className="panel-title">
            <h3>Members</h3>
            <small>{membersQuery.data?.length ?? 0} active</small>
          </div>
          {memberError && <p className="error">{getErrorMessage(memberError)}</p>}
          <ul className="member-list">
            {membersQuery.data?.map((member) => (
              <li key={member.id}>
                <span className="member-avatar">
                  {(member.displayName || member.email || 'U').charAt(0).toUpperCase()}
                </span>
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
                      className="select-field"
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
                      className="danger-button"
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
      )}

      {activeTab === 'activity' && <ActivityLogPanel title="Activity Log" logs={activityLogs.data} />}

      {activeTab === 'settings' && (
        <article className="surface-card card settings-card">
          <div className="panel-title">
            <h3>Workspace Settings</h3>
            <small>Overview</small>
          </div>
          <dl>
            <div>
              <dt>Workspace name</dt>
              <dd>{workspaceQuery.data?.name || 'Workspace'}</dd>
            </div>
            <div>
              <dt>Description</dt>
              <dd>{workspaceQuery.data?.description || 'No description added.'}</dd>
            </div>
            <div>
              <dt>Projects</dt>
              <dd>{projectQuery.data?.totalElements ?? 0}</dd>
            </div>
            <div>
              <dt>Members</dt>
              <dd>{membersQuery.data?.length ?? 0}</dd>
            </div>
          </dl>
        </article>
      )}

      <Modal title="Create Project" open={isProjectModalOpen} onClose={() => setProjectModalOpen(false)}>
        <form className="member-form" onSubmit={handleSubmit(onSubmit)}>
          <label>
            Project name
            <input className="field" placeholder="Website Redesign" {...register('name')} />
          </label>
          <label>
            Description
            <input className="field" placeholder="Short project summary" {...register('description')} />
          </label>
          {(errors.name || errors.description) && <p className="error">Please fix form errors.</p>}
          <button className="primary-button" type="submit" disabled={createProject.isPending}>
            {createProject.isPending ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      </Modal>

      <Modal title="Invite Member" open={isMemberModalOpen} onClose={() => setMemberModalOpen(false)}>
        <form className="member-form" onSubmit={handleMemberSubmit(onMemberSubmit)}>
          <label>
            Email address
            <input className="field" placeholder="teammate@example.com" type="email" {...registerMember('email')} />
          </label>
          <label>
            Role
            <select className="select-field" {...registerMember('role')}>
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </label>
          {(memberErrors.email || memberErrors.role) && <p className="error">Enter a valid email and role.</p>}
          <button className="primary-button" type="submit" disabled={addMember.isPending}>
            {addMember.isPending ? 'Sending...' : 'Send Invite'}
          </button>
        </form>
      </Modal>
    </section>
  );
};

export default WorkspaceDetailsPage;
