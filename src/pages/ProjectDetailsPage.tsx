import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import { z } from 'zod';
import ActivityLogPanel from '../components/common/ActivityLogPanel';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Modal from '../components/common/Modal';
import Pagination from '../components/common/Pagination';
import { APP_ROUTES } from '../constants/routes';
import { useProjectActivityLogs } from '../hooks/useActivityLogs';
import { useCreateTask, useTasks, useUpdateTaskStatus } from '../hooks/useTasks';
import { Task, TaskStatus } from '../types/task';
import { sanitizePage } from '../utils/pagination';
import { taskSchema } from '../utils/validators';
import './ProjectDetailsPage.css';

type TaskFormValues = z.infer<typeof taskSchema>;

const columns: { status: TaskStatus; label: string }[] = [
  { status: 'TODO', label: 'Todo' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'BLOCKED', label: 'Blocked' },
  { status: 'DONE', label: 'Done' },
];

interface BoardColumnProps {
  status: TaskStatus;
  label: string;
  tasks: Task[];
}

const BoardColumn = ({ status, label, tasks }: BoardColumnProps) => {
  const { isOver, setNodeRef } = useDroppable({ id: status });

  return (
    <section className={`board-column column-${status.toLowerCase()} ${isOver ? 'is-over' : ''}`} ref={setNodeRef}>
      <header>
        <h3>{label}</h3>
        <span>{tasks.length}</span>
      </header>
      <div className="task-list">
        {tasks.map((task) => (
          <DraggableTaskCard key={task.id} task={task} />
        ))}
        {tasks.length === 0 && <p className="empty-column">Drop tasks here</p>}
      </div>
    </section>
  );
};

const DraggableTaskCard = ({ task }: { task: Task }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: { status: task.status },
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Link
      className={`task-card surface-card ${isDragging ? 'is-dragging' : ''}`}
      ref={setNodeRef}
      style={style}
      to={APP_ROUTES.taskDetails(task.id)}
      {...listeners}
      {...attributes}
    >
      <strong>{task.title}</strong>
      <p>{task.description || 'No description'}</p>
      <div>
        <small>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</small>
        <em className={`status-badge status-${task.status.toLowerCase()}`}>{task.status}</em>
      </div>
    </Link>
  );
};

const ProjectDetailsPage = () => {
  const { id = '' } = useParams();
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<TaskStatus | ''>('');
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);

  const taskQuery = useTasks(page, 10, status || undefined);
  const activityLogs = useProjectActivityLogs(id);
  const createTask = useCreateTask(id);
  const updateTaskStatus = useUpdateTaskStatus();

  const filteredTasks = useMemo(
    () => taskQuery.data?.content.filter((task) => task.projectId === id) ?? [],
    [taskQuery.data?.content, id],
  );
  const tasksByStatus = useMemo(
    () =>
      columns.reduce<Record<TaskStatus, Task[]>>(
        (groups, column) => ({
          ...groups,
          [column.status]: filteredTasks.filter((task) => task.status === column.status),
        }),
        {
          TODO: [],
          IN_PROGRESS: [],
          BLOCKED: [],
          DONE: [],
        },
      ),
    [filteredTasks],
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
    setTaskModalOpen(false);
  };

  const onDragEnd = (event: DragEndEvent) => {
    const taskId = String(event.active.id);
    const nextStatus = event.over?.id as TaskStatus | undefined;
    const currentStatus = event.active.data.current?.status as TaskStatus | undefined;

    if (!nextStatus || !currentStatus || nextStatus === currentStatus) {
      return;
    }

    updateTaskStatus.mutate({
      taskId,
      payload: { status: nextStatus },
    });
  };

  if (taskQuery.isLoading || activityLogs.isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="project-details-page page-shell">
      <header className="page-heading">
        <div>
          <h1>Project Board</h1>
          <p>Move work from idea to done with a focused task board.</p>
        </div>
        <div className="board-actions">
          <select
            className="select-field status-filter"
            value={status}
            onChange={(event) => setStatus(event.target.value as TaskStatus | '')}
          >
            <option value="">All Statuses</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
            <option value="BLOCKED">BLOCKED</option>
          </select>
          <button className="primary-button" onClick={() => setTaskModalOpen(true)}>
            New Task
          </button>
        </div>
      </header>

      <DndContext onDragEnd={onDragEnd}>
        <article className="board-shell">
          {columns.map((column) => (
            <BoardColumn
              key={column.status}
              label={column.label}
              status={column.status}
              tasks={tasksByStatus[column.status]}
            />
          ))}
        </article>
      </DndContext>

      <Pagination
        page={page}
        totalPages={taskQuery.data?.totalPages ?? 0}
        onPrevious={() => setPage((prev) => sanitizePage(prev - 1))}
        onNext={() => setPage((prev) => prev + 1)}
      />

      <ActivityLogPanel title="Activity Log" logs={activityLogs.data} />

      <Modal title="Create Task" open={isTaskModalOpen} onClose={() => setTaskModalOpen(false)}>
        <form className="task-form" onSubmit={handleSubmit(onSubmit)}>
          <input className="field" placeholder="Title" {...register('title')} />
          <input className="field" placeholder="Description" {...register('description')} />
          <input className="field" type="datetime-local" {...register('dueDate')} />
          <button className="primary-button" type="submit" disabled={createTask.isPending}>
            {createTask.isPending ? 'Creating...' : 'Create'}
          </button>
        </form>
        {(errors.title || errors.description || errors.dueDate) && (
          <p className="error">Please correct task form values.</p>
        )}
      </Modal>
    </section>
  );
};

export default ProjectDetailsPage;
