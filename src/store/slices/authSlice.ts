import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../constants/storage';
import { AuthUser } from '../../types/auth';

interface AuthState {
  token: string | null;
  user: AuthUser | null;
}

const loadLegacyUser = () => {
  const savedUser = localStorage.getItem(STORAGE_KEYS.user);
  if (!savedUser) return null;

  try {
    return JSON.parse(savedUser) as AuthUser;
  } catch {
    localStorage.removeItem(STORAGE_KEYS.user);
    return null;
  }
};

const initialState: AuthState = {
  token: localStorage.getItem(STORAGE_KEYS.token),
  user: loadLegacyUser(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
    },
    clearCredentials: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { clearCredentials, setCredentials } = authSlice.actions;
export default authSlice.reducer;
