import { apiClient } from '../api/axiosInstance';
import { ApiResponse } from '../types/api';
import {
  AddWorkspaceMemberPayload,
  UpdateWorkspaceMemberRolePayload,
  WorkspaceMember,
} from '../types/workspace';

export const workspaceMemberService = {
  async list(workspaceId: string): Promise<WorkspaceMember[]> {
    const response = await apiClient.get<ApiResponse<WorkspaceMember[]>>(
      `/workspaces/${workspaceId}/members`,
    );
    return response.data.data;
  },

  async add(workspaceId: string, payload: AddWorkspaceMemberPayload): Promise<WorkspaceMember> {
    const response = await apiClient.post<ApiResponse<WorkspaceMember>>(
      `/workspaces/${workspaceId}/members`,
      payload,
    );
    return response.data.data;
  },

  async updateRole(
    workspaceId: string,
    memberId: string,
    payload: UpdateWorkspaceMemberRolePayload,
  ): Promise<WorkspaceMember> {
    const response = await apiClient.patch<ApiResponse<WorkspaceMember>>(
      `/workspaces/${workspaceId}/members/${memberId}/role`,
      payload,
    );
    return response.data.data;
  },

  async remove(workspaceId: string, memberId: string): Promise<void> {
    await apiClient.delete(`/workspaces/${workspaceId}/members/${memberId}`);
  },
};
