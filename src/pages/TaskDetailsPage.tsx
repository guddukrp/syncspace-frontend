import { useState } from 'react';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAssignTask, useTask, useUpdateTaskStatus } from '../hooks/useTasks';
import { TaskStatus } from '../types/task';
import './TaskDetailsPage.css';

const TaskDetailsPage = () => {
  const { id = '' } = useParams();
  const [assigneeId, setAssigneeId] = useState('');

  const taskQuery = useTask(id);
  const updateStatus = useUpdateTaskStatus();
  const assignTask = useAssignTask();

  if (taskQuery.isLoading) {
    return <LoadingSpinner />;
  }

  if (!taskQuery.data) {
    return <p>Task not found.</p>;
  }

  const task = taskQuery.data;

  return (
    <section className="task-details-page">
      <h1>{task.title}</h1>
      <p>{task.description || 'No description'}</p>

      <article className="card">
        <h3>Status</h3>
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

      <article className="card">
        <h3>Assign User</h3>
        <div className="row">
          <input
            value={assigneeId}
            onChange={(event) => setAssigneeId(event.target.value)}
            placeholder="Assignee UUID"
          />
          <button
            onClick={() => assignTask.mutate({ taskId: task.id, payload: { assigneeId } })}
            disabled={assignTask.isPending || !assigneeId}
          >
            {assignTask.isPending ? 'Assigning...' : 'Assign'}
          </button>
        </div>
        {task.assigneeId && <small>Current assignee: {task.assigneeId}</small>}
      </article>
    </section>
  );
};

export default TaskDetailsPage;