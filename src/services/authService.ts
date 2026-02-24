import { apiClient } from '../api/axiosInstance';
import { ApiResponse } from '../types/api';
import { AuthUser, LoginPayload, RegisterPayload } from '../types/auth';

interface AuthResult {
  token: string;
  user: AuthUser;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResult> {
    const response = await apiClient.post<ApiResponse<AuthResult>>('/auth/register', payload);
    return response.data.data;
  },

  async login(payload: LoginPayload): Promise<AuthResult> {
    const response = await apiClient.post<ApiResponse<AuthResult>>('/auth/login', payload);
    return response.data.data;
  },
};