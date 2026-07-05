import { createSlice } from "@reduxjs/toolkit";
import { SEED_MANAGERS } from "./constants";
import type { ManagersState } from "./managersTypes";
import {
  bulkDeleteManagers,
  bulkSetManagerStatus,
  createManager,
  deleteManager,
  fetchManagers,
  importManagers,
  updateManager,
} from "./managersThunk";

const initialState: ManagersState = {
  managers: [...SEED_MANAGERS],
  loading: false,
  error: null,
};

const managersSlice = createSlice({
  name: "managers",
  initialState,
  reducers: {
    clearManagers(state) {
      state.managers = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchManagers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagers.fulfilled, (state, action) => {
        state.loading = false;
        state.managers = action.payload;
      })
      .addCase(fetchManagers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load managers";
      })
      .addCase(createManager.fulfilled, (state, action) => {
        state.managers = [action.payload, ...state.managers];
      })
      .addCase(updateManager.fulfilled, (state, action) => {
        state.managers = state.managers.map((m) =>
          m.id === action.payload.id ? action.payload : m,
        );
      })
      .addCase(deleteManager.fulfilled, (state, action) => {
        state.managers = state.managers.filter((m) => m.id !== action.payload);
      })
      .addCase(bulkDeleteManagers.fulfilled, (state, action) => {
        state.managers = state.managers.filter((m) => !action.payload.includes(m.id));
      })
      .addCase(bulkSetManagerStatus.fulfilled, (state, action) => {
        const { ids, status } = action.payload;
        state.managers = state.managers.map((m) => (ids.includes(m.id) ? { ...m, status } : m));
      })
      .addCase(importManagers.fulfilled, (state, action) => {
        state.managers = [...action.payload, ...state.managers];
      });
  },
});

export const { clearManagers } = managersSlice.actions;
export default managersSlice.reducer;
