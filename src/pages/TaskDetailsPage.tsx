import { useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAssignTask, useTask, useUpdateTaskStatus } from '../hooks/useTasks';
import { useWorkspaceMembers } from '../hooks/useWorkspaceMembers';
import { TaskStatus } from '../types/task';
import { getErrorMessage } from '../utils/error';
import './TaskDetailsPage.css';

const TaskDetailsPage = () => {
  const { id = '' } = useParams();
  const [assigneeId, setAssigneeId] = useState('');

  const taskQuery = useTask(id);
  const membersQuery = useWorkspaceMembers(taskQuery.data?.workspaceId ?? '');
  const updateStatus = useUpdateTaskStatus();
  const assignTask = useAssignTask();

  if (taskQuery.isLoading || membersQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (!taskQuery.data) {
    return <p>Task not found.</p>;
  }

  const task = taskQuery.data;

  return (
    <section className="task-details-page page-shell">
      <header className="page-heading">
        <div>
          <h1>{task.title}</h1>
          <p>{task.description || 'No description'}</p>
        </div>
        <span className={`status-badge status-${task.status.toLowerCase()}`}>{task.status}</span>
      </header>

      <article className="surface-card card">
        <div className="panel-title">
          <h3>Status</h3>
        </div>
        <div className="row">
          {(['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'] as TaskStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => updateStatus.mutate({ taskId: task.id, payload: { status } })}
              disabled={updateStatus.isPending}
              className={status === task.status ? 'active' : ''}
            >
              {status}
            </button>
          ))}
        </div>
      </article>

      <article className="surface-card card">
        <div className="panel-title">
          <h3>Assign User</h3>
        </div>
        {(membersQuery.error || assignTask.error) && (
          <p className="error">{getErrorMessage(membersQuery.error || assignTask.error)}</p>
        )}
        <div className="row">
          <select
            className="select-field"
            value={assigneeId}
            onChange={(event) => setAssigneeId(event.target.value)}
          >
            <option value="">Select member</option>
            {membersQuery.data?.map((member) => (
              <option key={member.id} value={member.userId}>
                {member.displayName || member.email || member.userId}
              </option>
            ))}
          </select>
          <button
            className="primary-button"
            onClick={() => assignTask.mutate({ taskId: task.id, payload: { assigneeId } })}
            disabled={assignTask.isPending || !assigneeId}
          >
            {assignTask.isPending ? 'Assigning...' : 'Assign'}
          </button>
        </div>
        {task.assigneeId && <small className="muted-note">Current assignee selected</small>}
      </article>
    </section>
  );
};

export default TaskDetailsPage;
