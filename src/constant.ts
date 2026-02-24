export const APP_ROUTES = {
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  workspaces: '/workspaces',
  workspaceDetails: (id: string) => `/workspaces/${id}`,
  projectDetails: (id: string) => `/projects/${id}`,
  taskDetails: (id: string) => `/tasks/${id}`,
};

export const STORAGE_KEYS = {
  token: 'syncspace_token',
  user: 'syncspace_user',
};

export const QUERY_KEYS = {
  workspaces: 'workspaces',
  workspace: 'workspace',
  projects: 'projects',
  project: 'project',
  tasks: 'tasks',
  task: 'task',
  activityLogs: 'activityLogs',
};