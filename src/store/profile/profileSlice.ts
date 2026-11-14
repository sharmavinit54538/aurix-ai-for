import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { ProfileState, UserProfile } from "./profileTypes";

const initialState: ProfileState = {
  profile: {
    id: "usr-1",
    name: "Alex Vance",
    email: "alex.vance@aurix.ai",
    role: "super_admin",
    department: "Executive",
    avatar: "https://picsum.photos/seed/alex/200/200",
  },
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
