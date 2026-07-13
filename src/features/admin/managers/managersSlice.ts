import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ManagerFormState, ManagersState } from "./managersTypes";
import {
  createManager,
  deleteManager,
  fetchManagerById,
  fetchManagers,
  importManagers,
  updateManager,
} from "./managersThunk";
import { DEFAULT_MANAGER_FORM_STATE } from "./constants";

const initialState: ManagersState = {
  managers: [],
  loading: true,
  submitting: false,
  error: null,
  total: 0,
  page: 1,
  limit: 20,
  totalPages: 1,
  managerForm: DEFAULT_MANAGER_FORM_STATE,
  selectedManager: null,
  selectedManagerForm: null,
  selectedManagerLoading: false,
  selectedManagerError: null,
};

const managersSlice = createSlice({
  name: "managers",
  initialState,
  reducers: {
    clearManagers(state) {
      state.managers = [];
      state.error = null;
    },
    setManagerForm(state, action: PayloadAction<Partial<ManagerFormState>>) {
      state.managerForm = { ...state.managerForm, ...action.payload };
    },
    resetManagerForm(state) {
      state.managerForm = { ...DEFAULT_MANAGER_FORM_STATE };
    },
    initManagerForm(state, action: PayloadAction<ManagerFormState>) {
      state.managerForm = action.payload;
    },
    clearSelectedManager(state) {
      state.selectedManager = null;
      state.selectedManagerForm = null;
      state.selectedManagerLoading = false;
      state.selectedManagerError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchManagers.pending, (state, action) => {
        if (!action.meta.arg?.silent) {
          state.loading = true;
          state.error = null;
        }
      })
      .addCase(fetchManagers.fulfilled, (state, action) => {
        state.loading = false;
        state.managers = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchManagers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to load managers";
      })
      .addCase(createManager.pending, (state) => {
        state.submitting = true;
      })
      .addCase(createManager.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(createManager.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(updateManager.pending, (state) => {
        state.submitting = true;
      })
      .addCase(updateManager.fulfilled, (state, action) => {
        state.submitting = false;
        state.managers = state.managers.map((m) =>
          m.id === action.payload.id ? action.payload : m,
        );
      })
      .addCase(updateManager.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(deleteManager.pending, (state) => {
        state.submitting = true;
      })
      .addCase(deleteManager.fulfilled, (state, action) => {
        state.submitting = false;
        state.managers = state.managers.filter((m) => m.id !== action.payload);
      })
      .addCase(deleteManager.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(importManagers.pending, (state) => {
        state.submitting = true;
      })
      .addCase(importManagers.fulfilled, (state, action) => {
        state.submitting = false;
        state.managers = [...action.payload, ...state.managers];
      })
      .addCase(importManagers.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(fetchManagerById.pending, (state) => {
        state.selectedManagerLoading = true;
        state.selectedManagerError = null;
        state.selectedManager = null;
        state.selectedManagerForm = null;
      })
      .addCase(fetchManagerById.fulfilled, (state, action) => {
        state.selectedManagerLoading = false;
        state.selectedManager = action.payload.manager;
        state.selectedManagerForm = action.payload.formState;
      })
      .addCase(fetchManagerById.rejected, (state, action) => {
        state.selectedManagerLoading = false;
        state.selectedManagerError = action.payload ?? "Failed to load manager details";
      });
  },
});

export const { clearManagers, setManagerForm, resetManagerForm, initManagerForm, clearSelectedManager } =
  managersSlice.actions;
export default managersSlice.reducer;
