import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constant';
import { projectService } from '../services/projectService';
import { CreateProjectPayload } from '../types/project';

export const useProjects = (workspaceId: string, page: number, size: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.projects, workspaceId, page, size],
    queryFn: () => projectService.listByWorkspace(workspaceId, { page, size }),
    enabled: Boolean(workspaceId),
  });
};

export const useCreateProject = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => projectService.create(workspaceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.projects, workspaceId] });
    },
  });
};