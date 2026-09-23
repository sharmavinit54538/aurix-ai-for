import { createSlice } from "@reduxjs/toolkit";
import type { ProfileState } from "./profileTypes";
import {
  changeCurrentUserPassword,
  deleteProfileAvatar,
  fetchCurrentUser,
  fetchUserPreferences,
  fetchUserSessions,
  revokeUserSession,
  updateCurrentUser,
  updateUserPreferences,
  uploadProfileAvatar,
} from "./profileThunk";

const initialState: ProfileState = {
  currentUser: null,
  sessions: [],
  preferences: null,
  loading: false,
  submitting: false,
  error: null,

  operationLoading: {},
  operationErrors: {},
  operationSuccess: {},
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileError(state) {
      state.error = null;
      state.operationErrors = {};
    },
    clearProfileOperation(state, action: { payload: string }) {
      delete state.operationErrors[action.payload];
      delete state.operationLoading[action.payload];
      delete state.operationSuccess[action.payload];
    },
    resetProfileState() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // ── Current User Profile ───────────────────────────────────────
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.operationLoading.currentUser = true;
        state.operationErrors.currentUser = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.operationLoading.currentUser = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.operationLoading.currentUser = false;
        const msg = action.payload ?? "Failed to fetch user profile";
        state.error = msg;
        state.operationErrors.currentUser = msg;
      })
      .addCase(updateCurrentUser.pending, (state) => {
        state.submitting = true;
        state.operationLoading.updateUser = true;
        state.operationErrors.updateUser = null;
        state.operationSuccess.updateUser = false;
      })
      .addCase(updateCurrentUser.fulfilled, (state, action) => {
        state.submitting = false;
        state.operationLoading.updateUser = false;
        state.currentUser = state.currentUser
          ? { ...state.currentUser, ...action.payload }
          : action.payload;
        state.operationSuccess.updateUser = true;
      })
      .addCase(updateCurrentUser.rejected, (state, action) => {
        state.submitting = false;
        state.operationLoading.updateUser = false;
        const msg = action.payload ?? "Failed to update profile";
        state.error = msg;
        state.operationErrors.updateUser = msg;
      });

    // ── Avatar Management ──────────────────────────────────────────
    builder
      .addCase(uploadProfileAvatar.pending, (state) => {
        state.operationLoading.avatar = true;
        state.operationErrors.avatar = null;
        state.operationSuccess.avatar = false;
      })
      .addCase(uploadProfileAvatar.fulfilled, (state, action) => {
        state.operationLoading.avatar = false;
        state.operationSuccess.avatar = true;
        if (state.currentUser && action.payload.avatarUrl) {
          state.currentUser.avatarUrl = action.payload.avatarUrl;
        }
      })
      .addCase(uploadProfileAvatar.rejected, (state, action) => {
        state.operationLoading.avatar = false;
        const msg = action.payload ?? "Failed to upload avatar";
        state.operationErrors.avatar = msg;
      })
      .addCase(deleteProfileAvatar.pending, (state) => {
        state.operationLoading.avatar = true;
        state.operationErrors.avatar = null;
        state.operationSuccess.avatar = false;
      })
      .addCase(deleteProfileAvatar.fulfilled, (state) => {
        state.operationLoading.avatar = false;
        state.operationSuccess.avatar = true;
        if (state.currentUser) {
          state.currentUser.avatarUrl = "";
        }
      })
      .addCase(deleteProfileAvatar.rejected, (state, action) => {
        state.operationLoading.avatar = false;
        const msg = action.payload ?? "Failed to delete avatar";
        state.operationErrors.avatar = msg;
      });

    // ── Password Management ────────────────────────────────────────
    builder
      .addCase(changeCurrentUserPassword.pending, (state) => {
        state.submitting = true;
        state.operationLoading.password = true;
        state.operationErrors.password = null;
        state.operationSuccess.password = false;
      })
      .addCase(changeCurrentUserPassword.fulfilled, (state) => {
        state.submitting = false;
        state.operationLoading.password = false;
        state.operationSuccess.password = true;
      })
      .addCase(changeCurrentUserPassword.rejected, (state, action) => {
        state.submitting = false;
        state.operationLoading.password = false;
        const msg = action.payload ?? "Failed to update password";
        state.error = msg;
        state.operationErrors.password = msg;
      });

    // ── Active Sessions ────────────────────────────────────────────
    builder
      .addCase(fetchUserSessions.pending, (state) => {
        state.operationLoading.sessions = true;
        state.operationErrors.sessions = null;
      })
      .addCase(fetchUserSessions.fulfilled, (state, action) => {
        state.operationLoading.sessions = false;
        state.sessions = action.payload;
      })
      .addCase(fetchUserSessions.rejected, (state, action) => {
        state.operationLoading.sessions = false;
        const msg = action.payload ?? "Failed to fetch active sessions";
        state.operationErrors.sessions = msg;
      })
      .addCase(revokeUserSession.pending, (state) => {
        state.operationLoading.revokeSession = true;
        state.operationErrors.revokeSession = null;
      })
      .addCase(revokeUserSession.fulfilled, (state, action) => {
        state.operationLoading.revokeSession = false;
        state.operationSuccess.revokeSession = true;
        if (action.payload.sessionId) {
          state.sessions = state.sessions.filter((s) => s.id !== action.payload.sessionId);
        }
      })
      .addCase(revokeUserSession.rejected, (state, action) => {
        state.operationLoading.revokeSession = false;
        const msg = action.payload ?? "Failed to revoke session";
        state.operationErrors.revokeSession = msg;
      });

    // ── User Preferences ───────────────────────────────────────────
    builder
      .addCase(fetchUserPreferences.pending, (state) => {
        state.operationLoading.preferences = true;
        state.operationErrors.preferences = null;
      })
      .addCase(fetchUserPreferences.fulfilled, (state, action) => {
        state.operationLoading.preferences = false;
        state.preferences = action.payload;
      })
      .addCase(fetchUserPreferences.rejected, (state, action) => {
        state.operationLoading.preferences = false;
        const msg = action.payload ?? "Failed to fetch preferences";
        state.operationErrors.preferences = msg;
      })
      .addCase(updateUserPreferences.pending, (state) => {
        state.operationLoading.updatePreferences = true;
        state.operationErrors.updatePreferences = null;
        state.operationSuccess.updatePreferences = false;
      })
      .addCase(updateUserPreferences.fulfilled, (state, action) => {
        state.operationLoading.updatePreferences = false;
        state.operationSuccess.updatePreferences = true;
        state.preferences = action.payload;
      })
      .addCase(updateUserPreferences.rejected, (state, action) => {
        state.operationLoading.updatePreferences = false;
        const msg = action.payload ?? "Failed to update preferences";
        state.operationErrors.updatePreferences = msg;
      });
  },
});

export const { clearProfileError, clearProfileOperation, resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
