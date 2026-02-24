import { apiClient } from '../api/axiosInstance';
import { ApiResponse } from '../types/api';
import { ActivityLog } from '../types/activityLog';

export const activityLogService = {
  async listByWorkspace(workspaceId: string): Promise<ActivityLog[]> {
    const response = await apiClient.get<ApiResponse<ActivityLog[]>>(
      `/workspaces/${workspaceId}/activity-logs`,
    );
    return response.data.data;
  },

  async listByProject(projectId: string): Promise<ActivityLog[]> {
    const response = await apiClient.get<ApiResponse<ActivityLog[]>>(`/projects/${projectId}/activity-logs`);
    return response.data.data;
  },
};