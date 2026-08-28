export const APP_ROUTES = {
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
  projects: '/projects',
  workspaces: '/workspaces',
  workspaceSection: (id: string, tab: string) => `/workspaces/${id}?tab=${tab}`,
  workspaceDetails: (id: string) => `/workspaces/${id}`,
  projectDetails: (id: string) => `/projects/${id}`,
  taskDetails: (id: string) => `/tasks/${id}`,
};
