import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { SidebarState } from "./sidebarTypes";
import { fetchSidebarPermissions } from "./sidebarActions";

const STORAGE_KEY = "AURIX_SIDEBAR_EXPANDED";

function loadExpandedState(): Record<string, boolean> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // Ignore storage parse errors
  }
  // Default expanded sections
  return {
    workforce: true,
    talent: true,
    payroll: true,
    hrops: true,
    resources: true,
    analytics: true,
    aihub: true,
    settings: true,
  };
}

function saveExpandedState(expandedState: Record<string, boolean>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expandedState));
  } catch {
    // Ignore storage errors
  }
}

const initialState: SidebarState = {
  expandedSections: loadExpandedState(),
  selectedMenu: null,
  activeRoute: "/dashboard",
  userPermissions: [],
  permissionsLoading: false,
  permissionsError: null,
  userRole: null,
};

export const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSectionExpand(state, action: PayloadAction<string>) {
      const key = action.payload;
      state.expandedSections[key] = !state.expandedSections[key];
      saveExpandedState(state.expandedSections);
    },
    setSectionExpand(
      state,
      action: PayloadAction<{ sectionKey: string; expanded: boolean }>
    ) {
      const { sectionKey, expanded } = action.payload;
      state.expandedSections[sectionKey] = expanded;
      saveExpandedState(state.expandedSections);
    },
    setSelectedMenu(state, action: PayloadAction<string | null>) {
      state.selectedMenu = action.payload;
    },
    setActiveRoute(state, action: PayloadAction<string>) {
      state.activeRoute = action.payload;
    },
    setUserPermissions(state, action: PayloadAction<string[]>) {
      state.userPermissions = action.payload;
    },
    setUserRole(state, action: PayloadAction<string | null>) {
      state.userRole = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSidebarPermissions.pending, (state) => {
        state.permissionsLoading = true;
        state.permissionsError = null;
      })
      .addCase(fetchSidebarPermissions.fulfilled, (state, action) => {
        state.permissionsLoading = false;
        state.userPermissions = action.payload.permissions;
        if (action.payload.role) {
          state.userRole = action.payload.role;
        }
      })
      .addCase(fetchSidebarPermissions.rejected, (state, action) => {
        state.permissionsLoading = false;
        state.permissionsError = action.payload ?? "Failed to fetch permissions";
      });
  },
});

export const {
  toggleSectionExpand,
  setSectionExpand,
  setSelectedMenu,
  setActiveRoute,
  setUserPermissions,
  setUserRole,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
