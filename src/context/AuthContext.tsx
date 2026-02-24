import { useEffect, useMemo, useState } from 'react';
import { AuthUser } from '../types/auth';
import { STORAGE_KEYS } from '../constant';
import { authService } from '../services/authService';
import { AuthContext } from './authContextInstance';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem(STORAGE_KEYS.token);
    const savedUser = localStorage.getItem(STORAGE_KEYS.user);

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(STORAGE_KEYS.user);
      }
    }
  }, []);

  const login = async (email: string, password: string) => {
    const result = await authService.login({ email, password });
    localStorage.setItem(STORAGE_KEYS.token, result.token);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};