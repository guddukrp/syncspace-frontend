export type UserRole = 'ROLE_ADMIN' | 'ROLE_USER';

export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  displayName: string;
  email: string;
  password: string;
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}
