import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../constants/storage';

interface WorkspaceState {
  selectedWorkspaceId: string | null;
}

const initialState: WorkspaceState = {
  selectedWorkspaceId: localStorage.getItem(STORAGE_KEYS.workspace),
};

const workspaceSlice = createSlice({
  name: 'workspace',
  initialState,
  reducers: {
    setSelectedWorkspaceId: (state, action: PayloadAction<string>) => {
      state.selectedWorkspaceId = action.payload;
    },
    clearSelectedWorkspaceId: (state) => {
      state.selectedWorkspaceId = null;
    },
  },
});

export const { clearSelectedWorkspaceId, setSelectedWorkspaceId } = workspaceSlice.actions;
export default workspaceSlice.reducer;
