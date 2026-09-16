import { createAsyncThunk } from "@reduxjs/toolkit";
import { parseApiError } from "@/api/utils";
import profileApi from "@/services/profileApi";
import type {
  ChangePasswordPayload,
  UpdateCurrentUserPayload,
  UserPreferences,
  UserProfile,
  UserSession,
} from "./profileTypes";

export function getProfileThunkErrorMessage(err: unknown, fallbackMessage: string): string {
  const parsed = parseApiError(err, fallbackMessage);
  let msg = parsed.message;

  if (!msg || msg === "An error occurred" || msg === "Network error" || msg === fallbackMessage) {
    switch (parsed.status) {
      case 400:
        return "Invalid request. Please check the provided information.";
      case 401:
        return "Authentication required. Please log in again.";
      case 403:
        return "Access denied. You do not have permission to modify this profile.";
      case 404:
        return "Profile record or session not found.";
      case 409:
        return "Profile update conflict. The resource might have been modified.";
      case 422:
        return "Validation failed. Please verify your details.";
      case 429:
        return "Too many requests. Please wait a moment before trying again.";
      case 500:
      default:
        return fallbackMessage || "Internal server error. Please try again later.";
    }
  }

  return msg;
}

// ── Current User Profile Thunks ─────────────────────────────────
export const fetchCurrentUser = createAsyncThunk<UserProfile, void, { rejectValue: string }>(
  "profile/fetchCurrentUser",
  async (_, thunkAPI) => {
    try {
      return await profileApi.getCurrentUser();
    } catch (err) {
      return thunkAPI.rejectWithValue(getProfileThunkErrorMessage(err, "Failed to load user profile"));
    }
  },
);

export const updateCurrentUser = createAsyncThunk<UserProfile, UpdateCurrentUserPayload, { rejectValue: string }>(
  "profile/updateCurrentUser",
  async (payload, thunkAPI) => {
    try {
      return await profileApi.updateCurrentUser(payload);
    } catch (err) {
      return thunkAPI.rejectWithValue(getProfileThunkErrorMessage(err, "Failed to update profile information"));
    }
  },
);

// ── Avatar Thunks ───────────────────────────────────────────────
export const uploadProfileAvatar = createAsyncThunk<
  { avatarUrl: string; user?: UserProfile },
  File | FormData,
  { rejectValue: string }
>("profile/uploadProfileAvatar", async (file, thunkAPI) => {
  try {
    return await profileApi.uploadAvatar(file);
  } catch (err) {
    return thunkAPI.rejectWithValue(getProfileThunkErrorMessage(err, "Failed to upload avatar image"));
  }
});

export const deleteProfileAvatar = createAsyncThunk<{ success: boolean; avatarUrl?: string }, void, { rejectValue: string }>(
  "profile/deleteProfileAvatar",
  async (_, thunkAPI) => {
    try {
      return await profileApi.deleteAvatar();
    } catch (err) {
      return thunkAPI.rejectWithValue(getProfileThunkErrorMessage(err, "Failed to delete avatar"));
    }
  },
);

// ── Password Management Thunk ───────────────────────────────────
export const changeCurrentUserPassword = createAsyncThunk<
  { success: boolean; message: string },
  ChangePasswordPayload,
  { rejectValue: string }
>("profile/changeCurrentUserPassword", async (payload, thunkAPI) => {
  try {
    // Passwords are sent securely without logging
    return await profileApi.changePassword(payload);
  } catch (err) {
    return thunkAPI.rejectWithValue(getProfileThunkErrorMessage(err, "Failed to change password"));
  }
});

// ── Active Sessions Thunks ──────────────────────────────────────
export const fetchUserSessions = createAsyncThunk<UserSession[], void, { rejectValue: string }>(
  "profile/fetchUserSessions",
  async (_, thunkAPI) => {
    try {
      return await profileApi.getSessions();
    } catch (err) {
      return thunkAPI.rejectWithValue(getProfileThunkErrorMessage(err, "Failed to fetch active sessions"));
    }
  },
);

export const revokeUserSession = createAsyncThunk<
  { success: boolean; sessionId?: string },
  string | undefined,
  { rejectValue: string }
>("profile/revokeUserSession", async (sessionId, thunkAPI) => {
  try {
    return await profileApi.revokeSession(sessionId);
  } catch (err) {
    return thunkAPI.rejectWithValue(getProfileThunkErrorMessage(err, "Failed to revoke session"));
  }
});

// ── User Preferences Thunks ─────────────────────────────────────
export const fetchUserPreferences = createAsyncThunk<UserPreferences, void, { rejectValue: string }>(
  "profile/fetchUserPreferences",
  async (_, thunkAPI) => {
    try {
      return await profileApi.getPreferences();
    } catch (err) {
      return thunkAPI.rejectWithValue(getProfileThunkErrorMessage(err, "Failed to fetch user preferences"));
    }
  },
);

export const updateUserPreferences = createAsyncThunk<
  UserPreferences,
  Partial<UserPreferences>,
  { rejectValue: string }
>("profile/updateUserPreferences", async (payload, thunkAPI) => {
  try {
    return await profileApi.updatePreferences(payload);
  } catch (err) {
    return thunkAPI.rejectWithValue(getProfileThunkErrorMessage(err, "Failed to update preferences"));
  }
});
