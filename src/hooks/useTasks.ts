import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constant';
import { taskService } from '../services/taskService';
import { AssignTaskPayload, CreateTaskPayload, TaskStatus, UpdateTaskStatusPayload } from '../types/task';

export const useTasks = (page: number, size: number, status?: TaskStatus) => {
  return useQuery({
    queryKey: [QUERY_KEYS.tasks, page, size, status],
    queryFn: () => taskService.list({ page, size, status }),
  });
};

export const useTask = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.task, id],
    queryFn: () => taskService.getById(id),
    enabled: Boolean(id),
  });
};

export const useCreateTask = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) => taskService.create(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tasks] });
    },
  });
};

export const useUpdateTaskStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: UpdateTaskStatusPayload }) =>
      taskService.updateStatus(taskId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.task, variables.taskId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tasks] });
    },
  });
};

export const useAssignTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, payload }: { taskId: string; payload: AssignTaskPayload }) =>
      taskService.assign(taskId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.task, variables.taskId] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.tasks] });
    },
  });
};