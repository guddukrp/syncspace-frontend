export interface Workspace {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWorkspacePayload {
  name: string;
  description?: string;
}

export type WorkspaceMemberRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  displayName?: string;
  email?: string;
  role: WorkspaceMemberRole;
  joinedAt: string;
}

export interface AddWorkspaceMemberPayload {
  email: string;
  role: Exclude<WorkspaceMemberRole, 'OWNER'>;
}

export interface UpdateWorkspaceMemberRolePayload {
  role: Exclude<WorkspaceMemberRole, 'OWNER'>;
}
