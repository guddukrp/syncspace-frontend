import { skipToken } from '@reduxjs/toolkit/query';
import {
  useAssignTaskMutation,
  useCreateTaskMutation,
  useGetTaskQuery,
  useListTasksQuery,
  useUpdateTaskStatusMutation,
} from '../store/api/apiSlice';
import { AssignTaskPayload, CreateTaskPayload, TaskStatus, UpdateTaskStatusPayload } from '../types/task';

export const useTasks = (page: number, size: number, status?: TaskStatus) => {
  return useListTasksQuery({ page, size, status });
};

export const useTask = (id: string) => {
  return useGetTaskQuery(id || skipToken);
};

export const useCreateTask = (projectId: string) => {
  const [createTask, result] = useCreateTaskMutation();

  return {
    ...result,
    isPending: result.isLoading,
    mutate: (payload: CreateTaskPayload) => {
      void createTask({ projectId, payload });
    },
    mutateAsync: (payload: CreateTaskPayload) => createTask({ projectId, payload }).unwrap(),
  };
};

export const useUpdateTaskStatus = () => {
  const [updateTaskStatus, result] = useUpdateTaskStatusMutation();

  return {
    ...result,
    isPending: result.isLoading,
    mutate: (variables: { taskId: string; payload: UpdateTaskStatusPayload }) => {
      void updateTaskStatus(variables);
    },
    mutateAsync: (variables: { taskId: string; payload: UpdateTaskStatusPayload }) =>
      updateTaskStatus(variables).unwrap(),
  };
};

export const useAssignTask = () => {
  const [assignTask, result] = useAssignTaskMutation();

  return {
    ...result,
    isPending: result.isLoading,
    mutate: (variables: { taskId: string; payload: AssignTaskPayload }) => {
      void assignTask(variables);
    },
    mutateAsync: (variables: { taskId: string; payload: AssignTaskPayload }) => assignTask(variables).unwrap(),
  };
};
