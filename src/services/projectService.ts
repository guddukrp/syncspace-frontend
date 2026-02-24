import { apiClient } from '../api/axiosInstance';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../types/api';
import { CreateProjectPayload, Project } from '../types/project';

export const projectService = {
  async listByWorkspace(
    workspaceId: string,
    params: PaginationParams,
  ): Promise<PaginatedResponse<Project>> {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Project>>>(
      `/workspaces/${workspaceId}/projects`,
      { params },
    );
    return response.data.data;
  },

  async create(workspaceId: string, payload: CreateProjectPayload): Promise<Project> {
    const response = await apiClient.post<ApiResponse<Project>>(
      `/workspaces/${workspaceId}/projects`,
      payload,
    );
    return response.data.data;
  },
};