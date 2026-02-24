import { apiClient } from '../api/axiosInstance';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types/api';
import {
  AssignTaskPayload,
  CreateTaskPayload,
  Task,
  TaskStatus,
  UpdateTaskStatusPayload,
} from '../types/task';

export const taskService = {
  async list(params: PaginationParams & { status?: TaskStatus }): Promise<PaginatedResponse<Task>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Task>>>('/tasks', {
      params,
    });
    return response.data.data;
  },

  async getById(id: string): Promise<Task> {
    const response = await apiClient.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data.data;
  },

  async create(projectId: string, payload: CreateTaskPayload): Promise<Task> {
    const response = await apiClient.post<ApiResponse<Task>>(`/projects/${projectId}/tasks`, payload);
    return response.data.data;
  },

  async updateStatus(taskId: string, payload: UpdateTaskStatusPayload): Promise<Task> {
    const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}/status`, payload);
    return response.data.data;
  },

  async assign(taskId: string, payload: AssignTaskPayload): Promise<Task> {
    const response = await apiClient.patch<ApiResponse<Task>>(`/tasks/${taskId}/assignee`, payload);
    return response.data.data;
  },
};