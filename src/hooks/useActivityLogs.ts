import { skipToken } from '@reduxjs/toolkit/query';
import {
  useListProjectActivityLogsQuery,
  useListWorkspaceActivityLogsQuery,
} from '../store/api/apiSlice';

export const useWorkspaceActivityLogs = (workspaceId: string) => {
  return useListWorkspaceActivityLogsQuery(workspaceId || skipToken);
};

export const useProjectActivityLogs = (projectId: string) => {
  return useListProjectActivityLogsQuery(projectId || skipToken);
};
