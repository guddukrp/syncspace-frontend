import { apiClient } from '../api/axiosInstance';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types/api';
import { CreateWorkspacePayload, Workspace } from '../types/workspace';

export const workspaceService = {
  async list(params: PaginationParams): Promise<PaginatedResponse<Workspace>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Workspace>>>('/workspaces', {
      params,
    });
    return response.data.data;
  },

  async getById(id: string): Promise<Workspace> {
    const response = await apiClient.get<ApiResponse<Workspace>>(`/workspaces/${id}`);
    return response.data.data;
  },

  async create(payload: CreateWorkspacePayload): Promise<Workspace> {
    const response = await apiClient.post<ApiResponse<Workspace>>('/workspaces', payload);
    return response.data.data;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/workspaces/${id}`);
  },
};