import { createSlice } from "@reduxjs/toolkit";

export interface SettingsState {
  theme: "dark" | "light" | "system";
  notificationsEnabled: boolean;
  twoFactorEnabled: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  theme: "dark",
  notificationsEnabled: true,
  twoFactorEnabled: true,
  loading: false,
  error: null,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme(state, action) {
      state.theme = action.payload;
    },
    toggleNotifications(state) {
      state.notificationsEnabled = !state.notificationsEnabled;
    },
  },
});

export const { setTheme, toggleNotifications } = settingsSlice.actions;
export default settingsSlice.reducer;
