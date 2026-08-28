import { useCallback, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSelectedWorkspaceId } from '../store/slices/workspaceSlice';
import { useWorkspaces } from './useWorkspaces';

export const useSelectedWorkspace = () => {
  const dispatch = useAppDispatch();
  const workspacesQuery = useWorkspaces(0, 20);
  const selectedWorkspaceId = useAppSelector((state) => state.workspace.selectedWorkspaceId);

  const workspaces = useMemo(() => workspacesQuery.data?.content ?? [], [workspacesQuery.data?.content]);

  useEffect(() => {
    if (selectedWorkspaceId || workspaces.length === 0) return;

    const firstWorkspaceId = workspaces[0].id;
    dispatch(setSelectedWorkspaceId(firstWorkspaceId));
  }, [dispatch, selectedWorkspaceId, workspaces]);

  const selectedWorkspace = workspaces.find((workspace) => workspace.id === selectedWorkspaceId) ?? workspaces[0];

  const selectWorkspace = useCallback((workspaceId: string) => {
    dispatch(setSelectedWorkspaceId(workspaceId));
  }, [dispatch]);

  return {
    isLoading: workspacesQuery.isLoading,
    selectedWorkspace,
    selectedWorkspaceId: selectedWorkspace?.id ?? '',
    selectWorkspace,
    workspaces,
  };
};
