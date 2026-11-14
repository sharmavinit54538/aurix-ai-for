import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  fetchEmployeeHierarchy,
  fetchOrganizationalGraph,
} from "./employeeHierarchyThunk";

const initialState = {
  data: null as any,
  trees: [] as any[],
  flatList: [] as any[],
  analytics: null as any,
  loading: false,
  error: null as string | null,
  searchKeyword: "",
  filters: {
    department: "all",
    designation: "all",
    location: "all",
    status: "all",
    employmentType: "all",
    managerId: "all",
  },
  selectedEmployee: null as any,
  expandedNodeIds: [] as string[],
  zoomLevel: 1,
  isFullscreen: false,
  connectorStyle: "curved" as "curved" | "orthogonal" | "straight",
  showAiInsights: false,
  viewMode: "tree" as "tree" | "graph" | "list",
  graphData: {
    nodes: [],
    edges: [],
    insights: [],
  } as any,
  graphLoading: false,
  graphSearchQuery: "",
  graphActiveCategories: [
    "organization",
    "department",
    "leadership",
    "employee",
    "team",
  ] as string[],
  focusedNodeId: null as string | null,
  focusedNode: null as any,
  isGraphDetailOpen: false,
  isGraphAiOpen: false,
  graphAiMessages: [] as any[],
  isGraphAiProcessing: false,
  isExplorerOpen: true,
};

const employeeHierarchySlice = createSlice({
  name: "employeeHierarchy",
  initialState,
  reducers: {
    setSearchKeyword(state, action: PayloadAction<string>) {
      state.searchKeyword = action.payload;
    },
    setFilters(state, action: PayloadAction<Record<string, any>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters(state) {
      state.searchKeyword = "";
      state.filters = initialState.filters;
    },
    setSelectedEmployee(state, action: PayloadAction<any>) {
      state.selectedEmployee = action.payload;
    },
    toggleNodeExpanded(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.expandedNodeIds.includes(id)) {
        state.expandedNodeIds = state.expandedNodeIds.filter((x) => x !== id);
      } else {
        state.expandedNodeIds.push(id);
      }
    },
    expandAllNodes(state) {
      state.expandedNodeIds = state.flatList
        .map((n: any) => String(n.id || ""))
        .filter(Boolean);
    },
    collapseAllNodes(state) {
      state.expandedNodeIds = [];
    },
    zoomIn(state) {
      state.zoomLevel = Math.min(2, +(state.zoomLevel + 0.1).toFixed(2));
    },
    zoomOut(state) {
      state.zoomLevel = Math.max(0.4, +(state.zoomLevel - 0.1).toFixed(2));
    },
    resetZoom(state) {
      state.zoomLevel = 1;
    },
    toggleFullscreen(state) {
      state.isFullscreen = !state.isFullscreen;
    },
    setLayout(state, action: PayloadAction<string>) {
      (state as any).layout = action.payload;
    },
    setConnectorStyle(
      state,
      action: PayloadAction<"curved" | "orthogonal" | "straight">,
    ) {
      state.connectorStyle = action.payload;
    },
    toggleAiInsights(state) {
      state.showAiInsights = !state.showAiInsights;
    },
    setViewMode(state, action: PayloadAction<"tree" | "graph" | "list">) {
      state.viewMode = action.payload;
    },
    setGraphSearchQuery(state, action: PayloadAction<string>) {
      state.graphSearchQuery = action.payload;
    },
    toggleGraphFilterCategory(state, action: PayloadAction<string>) {
      const cat = action.payload;
      if (state.graphActiveCategories.includes(cat)) {
        state.graphActiveCategories = state.graphActiveCategories.filter(
          (c) => c !== cat,
        );
      } else {
        state.graphActiveCategories.push(cat);
      }
    },
    setFocusedNode(state, action: PayloadAction<any>) {
      if (typeof action.payload === "string" || action.payload === null) {
        state.focusedNodeId = action.payload;
        state.focusedNode =
          state.graphData?.nodes?.find((n: any) => n.id === action.payload) ||
          null;
      } else {
        state.focusedNode = action.payload;
        state.focusedNodeId = action.payload?.id || null;
      }
      state.isGraphDetailOpen = Boolean(action.payload);
    },
    closeGraphDetailPanel(state) {
      state.isGraphDetailOpen = false;
      state.focusedNode = null;
      state.focusedNodeId = null;
    },
    toggleGraphAiPanel(state) {
      state.isGraphAiOpen = !state.isGraphAiOpen;
    },
    addGraphAiMessage(state, action: PayloadAction<any>) {
      state.graphAiMessages.push(action.payload);
    },
    setGraphAiProcessing(state, action: PayloadAction<boolean>) {
      state.isGraphAiProcessing = action.payload;
    },
    toggleExplorer(state) {
      state.isExplorerOpen = !state.isExplorerOpen;
    },
    resetGraphFilters(state) {
      state.graphSearchQuery = "";
      state.graphActiveCategories = initialState.graphActiveCategories;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeHierarchy.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeHierarchy.fulfilled, (state, action) => {
        const payload = action.payload as any;
        state.data = payload;
        if (Array.isArray(payload)) {
          state.trees = payload;
        } else if (Array.isArray(payload?.roots)) {
          state.trees = payload.roots;
        } else {
          state.trees = [];
        }
        if (Array.isArray(payload?.flatList)) {
          state.flatList = payload.flatList;
        }
        if (payload?.analytics) {
          state.analytics = payload.analytics;
        }
        state.loading = false;
      })
      .addCase(fetchEmployeeHierarchy.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to load hierarchy";
      })
      .addCase(fetchOrganizationalGraph.pending, (state) => {
        state.graphLoading = true;
      })
      .addCase(fetchOrganizationalGraph.fulfilled, (state, action) => {
        if (action.payload) state.graphData = action.payload;
        state.graphLoading = false;
      })
      .addCase(fetchOrganizationalGraph.rejected, (state) => {
        state.graphLoading = false;
      });
  },
});

export const {
  setSearchKeyword,
  setFilters,
  resetFilters,
  setSelectedEmployee,
  toggleNodeExpanded,
  expandAllNodes,
  collapseAllNodes,
  zoomIn,
  zoomOut,
  resetZoom,
  toggleFullscreen,
  setLayout,
  setConnectorStyle,
  toggleAiInsights,
  setViewMode,
  setGraphSearchQuery,
  toggleGraphFilterCategory,
  setFocusedNode,
  closeGraphDetailPanel,
  toggleGraphAiPanel,
  addGraphAiMessage,
  setGraphAiProcessing,
  toggleExplorer,
  resetGraphFilters,
} = employeeHierarchySlice.actions;

export default employeeHierarchySlice.reducer;
