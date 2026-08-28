import { skipToken } from '@reduxjs/toolkit/query';
import {
  useCreateProjectMutation,
  useListProjectsQuery,
  useListWorkspaceProjectsQuery,
} from '../store/api/apiSlice';
import { CreateProjectPayload } from '../types/project';

export const useAllProjects = (page: number, size: number) => {
  return useListProjectsQuery({ page, size });
};

export const useProjects = (workspaceId: string, page: number, size: number) => {
  return useListWorkspaceProjectsQuery(workspaceId ? { workspaceId, params: { page, size } } : skipToken);
};

export const useCreateProject = (workspaceId: string) => {
  const [createProject, result] = useCreateProjectMutation();

  return {
    ...result,
    isPending: result.isLoading,
    mutate: (payload: CreateProjectPayload) => {
      void createProject({ workspaceId, payload });
    },
    mutateAsync: (payload: CreateProjectPayload) => createProject({ workspaceId, payload }).unwrap(),
  };
};
