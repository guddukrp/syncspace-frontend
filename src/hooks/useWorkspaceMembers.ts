import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constant';
import { workspaceMemberService } from '../services/workspaceMemberService';
import { AddWorkspaceMemberPayload, UpdateWorkspaceMemberRolePayload } from '../types/workspace';

export const useWorkspaceMembers = (workspaceId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.workspaceMembers, workspaceId],
    queryFn: () => workspaceMemberService.list(workspaceId),
    enabled: Boolean(workspaceId),
  });
};

export const useAddWorkspaceMember = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddWorkspaceMemberPayload) =>
      workspaceMemberService.add(workspaceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.workspaceMembers, workspaceId] });
    },
  });
};

export const useUpdateWorkspaceMemberRole = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      payload,
    }: {
      memberId: string;
      payload: UpdateWorkspaceMemberRolePayload;
    }) => workspaceMemberService.updateRole(workspaceId, memberId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.workspaceMembers, workspaceId] });
    },
  });
};

export const useRemoveWorkspaceMember = (workspaceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (memberId: string) => workspaceMemberService.remove(workspaceId, memberId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.workspaceMembers, workspaceId] });
    },
  });
};
