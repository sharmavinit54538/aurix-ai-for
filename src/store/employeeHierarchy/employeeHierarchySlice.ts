import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { EmployeeHierarchyState, HierarchyFilterState, BackendHierarchyNode } from "./employeeHierarchyTypes";
import { fetchEmployeeHierarchy, fetchEmployeeReportingDetails } from "./employeeHierarchyThunk";

const initialFilters: HierarchyFilterState = {
  department: "all",
  designation: "all",
  location: "all",
  employmentType: "all",
  reportingManagerId: "all",
};

const initialState: EmployeeHierarchyState = {
  loading: false,
  error: null,
  hierarchy: null,
  selectedEmployeeId: null,
  selectedEmployeeDetails: null,
  loadingDetails: false,
  detailsError: null,
  expandedNodes: {},
  searchKeyword: "",
  filters: initialFilters,
  zoomLevel: 100,
  isFullscreen: false,
};

function getAllNodeIds(nodes: BackendHierarchyNode[]): string[] {
  const ids: string[] = [];
  nodes.forEach((n) => {
    ids.push(n.id);
    if (n.children && n.children.length > 0) {
      ids.push(...getAllNodeIds(n.children));
    }
  });
  return ids;
}

export const employeeHierarchySlice = createSlice({
  name: "employeeHierarchy",
  initialState,
  reducers: {
    setSearchKeyword(state, action: PayloadAction<string>) {
      state.searchKeyword = action.payload;
    },
    setFilters(state, action: PayloadAction<Partial<HierarchyFilterState>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.filters = initialFilters;
      state.searchKeyword = "";
    },
    setSelectedEmployee(state, action: PayloadAction<string | null>) {
      state.selectedEmployeeId = action.payload;
      if (!action.payload) {
        state.selectedEmployeeDetails = null;
        state.detailsError = null;
      }
    },
    toggleNodeExpanded(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.expandedNodes[id] = state.expandedNodes[id] === undefined ? false : !state.expandedNodes[id];
    },
    setNodeExpanded(state, action: PayloadAction<{ id: string; expanded: boolean }>) {
      state.expandedNodes[action.payload.id] = action.payload.expanded;
    },
    expandAllNodes(state) {
      if (state.hierarchy) {
        const allIds = getAllNodeIds(state.hierarchy);
        allIds.forEach((id) => {
          state.expandedNodes[id] = true;
        });
      }
    },
    collapseAllNodes(state) {
      if (state.hierarchy) {
        const allIds = getAllNodeIds(state.hierarchy);
        const rootIds = new Set(state.hierarchy.map((n) => n.id));
        allIds.forEach((id) => {
          if (!rootIds.has(id)) {
            state.expandedNodes[id] = false;
          }
        });
      }
    },
    setZoomLevel(state, action: PayloadAction<number>) {
      state.zoomLevel = Math.max(50, Math.min(180, action.payload));
    },
    zoomIn(state) {
      state.zoomLevel = Math.min(180, state.zoomLevel + 15);
    },
    zoomOut(state) {
      state.zoomLevel = Math.max(50, state.zoomLevel - 15);
    },
    resetZoom(state) {
      state.zoomLevel = 100;
    },
    toggleFullscreen(state) {
      state.isFullscreen = !state.isFullscreen;
    },
    setIsFullscreen(state, action: PayloadAction<boolean>) {
      state.isFullscreen = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeHierarchy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeHierarchy.fulfilled, (state, action) => {
        state.loading = false;
        state.hierarchy = action.payload;
        if (action.payload && action.payload.length > 0) {
          const allIds = getAllNodeIds(action.payload);
          const defaultExpanded: Record<string, boolean> = {};
          allIds.forEach((id) => {
            defaultExpanded[id] = true;
          });
          state.expandedNodes = defaultExpanded;
        }
      })
      .addCase(fetchEmployeeHierarchy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch hierarchy from backend";
      })
      .addCase(fetchEmployeeReportingDetails.pending, (state) => {
        state.loadingDetails = true;
        state.detailsError = null;
      })
      .addCase(fetchEmployeeReportingDetails.fulfilled, (state, action) => {
        state.loadingDetails = false;
        state.selectedEmployeeDetails = action.payload;
      })
      .addCase(fetchEmployeeReportingDetails.rejected, (state, action) => {
        state.loadingDetails = false;
        state.detailsError = action.payload ?? "Failed to fetch employee details";
      });
  },
});

export const {
  setSearchKeyword,
  setFilters,
  resetFilters,
  setSelectedEmployee,
  toggleNodeExpanded,
  setNodeExpanded,
  expandAllNodes,
  collapseAllNodes,
  setZoomLevel,
  zoomIn,
  zoomOut,
  resetZoom,
  toggleFullscreen,
  setIsFullscreen,
} = employeeHierarchySlice.actions;

export default employeeHierarchySlice.reducer;
