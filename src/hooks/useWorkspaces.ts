import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constant';
import { workspaceService } from '../services/workspaceService';
import { CreateWorkspacePayload } from '../types/workspace';

export const useWorkspaces = (page: number, size: number) => {
  return useQuery({
    queryKey: [QUERY_KEYS.workspaces, page, size],
    queryFn: () => workspaceService.list({ page, size }),
  });
};

export const useWorkspace = (id: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.workspace, id],
    queryFn: () => workspaceService.getById(id),
    enabled: Boolean(id),
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateWorkspacePayload) => workspaceService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.workspaces] });
    },
  });
};

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (workspaceId: string) => workspaceService.remove(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.workspaces] });
    },
  });
};