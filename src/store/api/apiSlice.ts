import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { STORAGE_KEYS } from '../../constants/storage';
import { ActivityLog } from '../../types/activityLog';
import { ApiResponse, PaginatedResponse, PaginationParams } from '../../types/api';
import { AuthResult, LoginPayload, RegisterPayload } from '../../types/auth';
import { CreateProjectPayload, Project } from '../../types/project';
import {
  AssignTaskPayload,
  CreateTaskPayload,
  Task,
  TaskStatus,
  UpdateTaskStatusPayload,
} from '../../types/task';
import {
  AddWorkspaceMemberPayload,
  CreateWorkspacePayload,
  UpdateWorkspaceMemberRolePayload,
  Workspace,
  WorkspaceMember,
} from '../../types/workspace';
import { clearCredentials } from '../slices/authSlice';
import type { RootState } from '../store';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: async (args, api, extraOptions) => {
    const rawBaseQuery = fetchBaseQuery({
      baseUrl,
      prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;

        headers.set('Content-Type', 'application/json');
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }

        return headers;
      },
    });

    const result = await rawBaseQuery(args, api, extraOptions);
    if (result.error?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.token);
      localStorage.removeItem(STORAGE_KEYS.user);
      api.dispatch(clearCredentials());
    }

    return result;
  },
  tagTypes: ['ActivityLog', 'Project', 'Task', 'Workspace', 'WorkspaceMember'],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResult, LoginPayload>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      transformResponse: (response: ApiResponse<AuthResult>) => response.data,
    }),
    register: builder.mutation<AuthResult, RegisterPayload>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
      transformResponse: (response: ApiResponse<AuthResult>) => response.data,
    }),
    listWorkspaces: builder.query<PaginatedResponse<Workspace>, PaginationParams>({
      query: (params) => ({ url: '/workspaces', params }),
      transformResponse: (response: ApiResponse<PaginatedResponse<Workspace>>) => response.data,
      providesTags: ['Workspace'],
    }),
    getWorkspace: builder.query<Workspace, string>({
      query: (id) => `/workspaces/${id}`,
      transformResponse: (response: ApiResponse<Workspace>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Workspace', id }],
    }),
    createWorkspace: builder.mutation<Workspace, CreateWorkspacePayload>({
      query: (body) => ({ url: '/workspaces', method: 'POST', body }),
      transformResponse: (response: ApiResponse<Workspace>) => response.data,
      invalidatesTags: ['Workspace'],
    }),
    deleteWorkspace: builder.mutation<void, string>({
      query: (id) => ({ url: `/workspaces/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Workspace', 'Project', 'Task', 'WorkspaceMember', 'ActivityLog'],
    }),
    listProjects: builder.query<PaginatedResponse<Project>, PaginationParams>({
      query: (params) => ({ url: '/projects', params }),
      transformResponse: (response: ApiResponse<PaginatedResponse<Project>>) => response.data,
      providesTags: ['Project'],
    }),
    listWorkspaceProjects: builder.query<
      PaginatedResponse<Project>,
      { workspaceId: string; params: PaginationParams }
    >({
      query: ({ workspaceId, params }) => ({ url: `/workspaces/${workspaceId}/projects`, params }),
      transformResponse: (response: ApiResponse<PaginatedResponse<Project>>) => response.data,
      providesTags: (_result, _error, arg) => [{ type: 'Project', id: arg.workspaceId }],
    }),
    createProject: builder.mutation<Project, { workspaceId: string; payload: CreateProjectPayload }>({
      query: ({ workspaceId, payload }) => ({
        url: `/workspaces/${workspaceId}/projects`,
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: ApiResponse<Project>) => response.data,
      invalidatesTags: (_result, _error, arg) => ['Project', { type: 'Project', id: arg.workspaceId }],
    }),
    listTasks: builder.query<PaginatedResponse<Task>, PaginationParams & { status?: TaskStatus }>({
      query: (params) => ({ url: '/tasks', params }),
      transformResponse: (response: ApiResponse<PaginatedResponse<Task>>) => response.data,
      providesTags: ['Task'],
    }),
    getTask: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      transformResponse: (response: ApiResponse<Task>) => response.data,
      providesTags: (_result, _error, id) => [{ type: 'Task', id }],
    }),
    createTask: builder.mutation<Task, { projectId: string; payload: CreateTaskPayload }>({
      query: ({ projectId, payload }) => ({
        url: `/projects/${projectId}/tasks`,
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: ApiResponse<Task>) => response.data,
      invalidatesTags: ['Task', 'ActivityLog'],
    }),
    updateTaskStatus: builder.mutation<Task, { taskId: string; payload: UpdateTaskStatusPayload }>({
      query: ({ taskId, payload }) => ({ url: `/tasks/${taskId}/status`, method: 'PATCH', body: payload }),
      transformResponse: (response: ApiResponse<Task>) => response.data,
      invalidatesTags: (_result, _error, arg) => ['Task', { type: 'Task', id: arg.taskId }, 'ActivityLog'],
    }),
    assignTask: builder.mutation<Task, { taskId: string; payload: AssignTaskPayload }>({
      query: ({ taskId, payload }) => ({ url: `/tasks/${taskId}/assignee`, method: 'PATCH', body: payload }),
      transformResponse: (response: ApiResponse<Task>) => response.data,
      invalidatesTags: (_result, _error, arg) => ['Task', { type: 'Task', id: arg.taskId }, 'ActivityLog'],
    }),
    listWorkspaceMembers: builder.query<WorkspaceMember[], string>({
      query: (workspaceId) => `/workspaces/${workspaceId}/members`,
      transformResponse: (response: ApiResponse<WorkspaceMember[]>) => response.data,
      providesTags: (_result, _error, workspaceId) => [{ type: 'WorkspaceMember', id: workspaceId }],
    }),
    addWorkspaceMember: builder.mutation<
      WorkspaceMember,
      { workspaceId: string; payload: AddWorkspaceMemberPayload }
    >({
      query: ({ workspaceId, payload }) => ({
        url: `/workspaces/${workspaceId}/members`,
        method: 'POST',
        body: payload,
      }),
      transformResponse: (response: ApiResponse<WorkspaceMember>) => response.data,
      invalidatesTags: (_result, _error, arg) => [{ type: 'WorkspaceMember', id: arg.workspaceId }],
    }),
    updateWorkspaceMemberRole: builder.mutation<
      WorkspaceMember,
      { workspaceId: string; memberId: string; payload: UpdateWorkspaceMemberRolePayload }
    >({
      query: ({ workspaceId, memberId, payload }) => ({
        url: `/workspaces/${workspaceId}/members/${memberId}/role`,
        method: 'PATCH',
        body: payload,
      }),
      transformResponse: (response: ApiResponse<WorkspaceMember>) => response.data,
      invalidatesTags: (_result, _error, arg) => [{ type: 'WorkspaceMember', id: arg.workspaceId }],
    }),
    removeWorkspaceMember: builder.mutation<void, { workspaceId: string; memberId: string }>({
      query: ({ workspaceId, memberId }) => ({
        url: `/workspaces/${workspaceId}/members/${memberId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: 'WorkspaceMember', id: arg.workspaceId }],
    }),
    listWorkspaceActivityLogs: builder.query<ActivityLog[], string>({
      query: (workspaceId) => `/workspaces/${workspaceId}/activity-logs`,
      transformResponse: (response: ApiResponse<ActivityLog[]>) => response.data,
      providesTags: ['ActivityLog'],
    }),
    listProjectActivityLogs: builder.query<ActivityLog[], string>({
      query: (projectId) => `/projects/${projectId}/activity-logs`,
      transformResponse: (response: ApiResponse<ActivityLog[]>) => response.data,
      providesTags: ['ActivityLog'],
    }),
  }),
});

export const {
  useAddWorkspaceMemberMutation,
  useAssignTaskMutation,
  useCreateProjectMutation,
  useCreateTaskMutation,
  useCreateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useGetTaskQuery,
  useGetWorkspaceQuery,
  useLoginMutation,
  useListProjectActivityLogsQuery,
  useListProjectsQuery,
  useListTasksQuery,
  useListWorkspaceActivityLogsQuery,
  useListWorkspaceMembersQuery,
  useListWorkspaceProjectsQuery,
  useListWorkspacesQuery,
  useRegisterMutation,
  useRemoveWorkspaceMemberMutation,
  useUpdateTaskStatusMutation,
  useUpdateWorkspaceMemberRoleMutation,
} = apiSlice;
