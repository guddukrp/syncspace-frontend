import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { z } from 'zod';
import ActivityLogPanel from '../components/common/ActivityLogPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import { APP_ROUTES } from '../constant';
import { useProjectActivityLogs } from '../hooks/useActivityLogs';
import { useCreateTask, useTasks } from '../hooks/useTasks';
import { TaskStatus } from '../types/task';
import { sanitizePage } from '../utils/pagination';
import { taskSchema } from '../utils/validators';
import './ProjectDetailsPage.css';

type TaskFormValues = z.infer<typeof taskSchema>;

const ProjectDetailsPage = () => {
  const { id = '' } = useParams();
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<TaskStatus | ''>('');

  const taskQuery = useTasks(page, 10, status || undefined);
  const activityLogs = useProjectActivityLogs(id);
  const createTask = useCreateTask(id);

  const filteredTasks = useMemo(
    () => taskQuery.data?.content.filter((task) => task.projectId === id) ?? [],
    [taskQuery.data?.content, id],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
  });

  const onSubmit = async (values: TaskFormValues) => {
    await createTask.mutateAsync({
      ...values,
      dueDate: values.dueDate || undefined,
    });
    reset();
  };

  if (taskQuery.isLoading || activityLogs.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="project-details-page">
      <header>
        <h1>Project Tasks</h1>
        <select value={status} onChange={(event) => setStatus(event.target.value as TaskStatus | '')}>
          <option value="">All Statuses</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="DONE">DONE</option>
          <option value="BLOCKED">BLOCKED</option>
        </select>
      </header>

      <article className="card">
        <h3>Create Task</h3>
        <form className="task-form" onSubmit={handleSubmit(onSubmit)}>
          <input placeholder="Title" {...register('title')} />
          <input placeholder="Description" {...register('description')} />
          <input type="datetime-local" {...register('dueDate')} />
          <button type="submit" disabled={createTask.isPending}>
            {createTask.isPending ? 'Creating...' : 'Create'}
          </button>
        </form>
        {(errors.title || errors.description || errors.dueDate) && (
          <p className="error">Please correct task form values.</p>
        )}
      </article>

      <article className="card">
        <h3>Tasks</h3>
        <ul className="task-list">
          {filteredTasks.map((task) => (
            <li key={task.id}>
              <Link to={APP_ROUTES.taskDetails(task.id)}>{task.title}</Link>
              <span>{task.status}</span>
            </li>
          ))}
        </ul>
        <Pagination
          page={page}
          totalPages={taskQuery.data?.totalPages ?? 0}
          onPrevious={() => setPage((prev) => sanitizePage(prev - 1))}
          onNext={() => setPage((prev) => prev + 1)}
        />
      </article>

      <ActivityLogPanel title="Activity Log" logs={activityLogs.data} />
    </section>
  );
};

export default ProjectDetailsPage;