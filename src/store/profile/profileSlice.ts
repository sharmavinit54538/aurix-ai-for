import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProfileState, UserProfile } from "./profileTypes";

const initialState: ProfileState = {
  profile: null,
  loading: false,
  error: null,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfile(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
    },
    updateProfile(state, action: PayloadAction<Partial<UserProfile>>) {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
  },
});

export const { setProfile, updateProfile } = profileSlice.actions;
export default profileSlice.reducer;
