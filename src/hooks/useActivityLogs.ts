import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '../constant';
import { activityLogService } from '../services/activityLogService';

export const useWorkspaceActivityLogs = (workspaceId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.activityLogs, 'workspace', workspaceId],
    queryFn: () => activityLogService.listByWorkspace(workspaceId),
    enabled: Boolean(workspaceId),
  });
};

export const useProjectActivityLogs = (projectId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.activityLogs, 'project', projectId],
    queryFn: () => activityLogService.listByProject(projectId),
    enabled: Boolean(projectId),
  });
};