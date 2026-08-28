import { skipToken } from '@reduxjs/toolkit/query';
import {
  useCreateWorkspaceMutation,
  useDeleteWorkspaceMutation,
  useGetWorkspaceQuery,
  useListWorkspacesQuery,
} from '../store/api/apiSlice';
import { CreateWorkspacePayload } from '../types/workspace';

export const useWorkspaces = (page: number, size: number) => {
  return useListWorkspacesQuery({ page, size });
};

export const useWorkspace = (id: string) => {
  return useGetWorkspaceQuery(id || skipToken);
};

export const useCreateWorkspace = () => {
  const [createWorkspace, result] = useCreateWorkspaceMutation();

  return {
    ...result,
    isPending: result.isLoading,
    mutate: (payload: CreateWorkspacePayload) => {
      void createWorkspace(payload);
    },
    mutateAsync: (payload: CreateWorkspacePayload) => createWorkspace(payload).unwrap(),
  };
};

export const useDeleteWorkspace = () => {
  const [deleteWorkspace, result] = useDeleteWorkspaceMutation();

  return {
    ...result,
    isPending: result.isLoading,
    mutate: (workspaceId: string) => {
      void deleteWorkspace(workspaceId);
    },
    mutateAsync: (workspaceId: string) => deleteWorkspace(workspaceId).unwrap(),
  };
};
