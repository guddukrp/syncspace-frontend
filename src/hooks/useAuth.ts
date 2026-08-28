import { useCallback } from 'react';
import { STORAGE_KEYS } from '../constants/storage';
import { apiSlice, useLoginMutation } from '../store/api/apiSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearCredentials, setCredentials } from '../store/slices/authSlice';
import { clearSelectedWorkspaceId } from '../store/slices/workspaceSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const [loginRequest] = useLoginMutation();
  const { token, user } = useAppSelector((state) => state.auth);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await loginRequest({ email, password }).unwrap();
      dispatch(setCredentials(result));
    },
    [dispatch, loginRequest],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.workspace);
    dispatch(clearCredentials());
    dispatch(clearSelectedWorkspaceId());
    dispatch(apiSlice.util.resetApiState());
  }, [dispatch]);

  return {
    token,
    user,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };
};
