import { skipToken } from '@reduxjs/toolkit/query';
import {
  useAddWorkspaceMemberMutation,
  useListWorkspaceMembersQuery,
  useRemoveWorkspaceMemberMutation,
  useUpdateWorkspaceMemberRoleMutation,
} from '../store/api/apiSlice';
import { AddWorkspaceMemberPayload, UpdateWorkspaceMemberRolePayload } from '../types/workspace';

export const useWorkspaceMembers = (workspaceId: string) => {
  return useListWorkspaceMembersQuery(workspaceId || skipToken);
};

export const useAddWorkspaceMember = (workspaceId: string) => {
  const [addWorkspaceMember, result] = useAddWorkspaceMemberMutation();

  return {
    ...result,
    isPending: result.isLoading,
    mutate: (payload: AddWorkspaceMemberPayload) => {
      void addWorkspaceMember({ workspaceId, payload });
    },
    mutateAsync: (payload: AddWorkspaceMemberPayload) =>
      addWorkspaceMember({ workspaceId, payload }).unwrap(),
  };
};

export const useUpdateWorkspaceMemberRole = (workspaceId: string) => {
  const [updateWorkspaceMemberRole, result] = useUpdateWorkspaceMemberRoleMutation();

  return {
    ...result,
    isPending: result.isLoading,
    mutate: ({
      memberId,
      payload,
    }: {
      memberId: string;
      payload: UpdateWorkspaceMemberRolePayload;
    }) => {
      void updateWorkspaceMemberRole({ workspaceId, memberId, payload });
    },
    mutateAsync: ({
      memberId,
      payload,
    }: {
      memberId: string;
      payload: UpdateWorkspaceMemberRolePayload;
    }) => updateWorkspaceMemberRole({ workspaceId, memberId, payload }).unwrap(),
  };
};

export const useRemoveWorkspaceMember = (workspaceId: string) => {
  const [removeWorkspaceMember, result] = useRemoveWorkspaceMemberMutation();

  return {
    ...result,
    isPending: result.isLoading,
    mutate: (memberId: string) => {
      void removeWorkspaceMember({ workspaceId, memberId });
    },
    mutateAsync: (memberId: string) => removeWorkspaceMember({ workspaceId, memberId }).unwrap(),
  };
};
