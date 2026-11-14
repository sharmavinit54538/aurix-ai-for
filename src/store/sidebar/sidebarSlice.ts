import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import type { SidebarState } from "./sidebarTypes";
import { sidebarApi } from "@/services/sidebarApi";

export const fetchSidebarPermissions = createAsyncThunk(
  "sidebar/fetchPermissions",
  async (userRole?: string) => {
    const data = await sidebarApi.getPermissions(userRole);
    return data;
  }
);

const initialState: SidebarState = {
  userPermissions: ["*"],
  userRole: "super_admin",
  sidebarOpen: true,
  expandedSections: {},
  loading: false,
  error: null,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setUserPermissions(state, action: PayloadAction<string[]>) {
      state.userPermissions = action.payload;
    },
    setUserRole(state, action: PayloadAction<string | null>) {
      state.userRole = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSectionExpand(state, action: PayloadAction<{ sectionTitle: string; expanded: boolean }>) {
      state.expandedSections[action.payload.sectionTitle] = action.payload.expanded;
    },
    toggleSectionExpand(state, action: PayloadAction<string>) {
      state.expandedSections[action.payload] = !state.expandedSections[action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSidebarPermissions.fulfilled, (state, action) => {
        state.userPermissions = action.payload.permissions;
        if (action.payload.role) {
          state.userRole = action.payload.role;
        }
      });
  },
});

export const {
  setUserPermissions,
  setUserRole,
  toggleSidebar,
  setSectionExpand,
  toggleSectionExpand,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
