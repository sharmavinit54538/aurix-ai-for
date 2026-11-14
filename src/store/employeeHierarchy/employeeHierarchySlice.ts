import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchEmployeeHierarchy, fetchOrganizationalGraph } from "./employeeHierarchyThunk";

const initialState = {
  data: null as any,
  trees: [] as any[],
  flatList: [] as any[],
  analytics: {
    totalEmployees: 42,
    totalDepartments: 6,
    totalManagers: 8,
    maxDepth: 4,
    avgSpanOfControl: 5.2,
    vacantPositions: 3,
    departmentDistribution: [
      { department: "Engineering", count: 18 },
      { department: "Product", count: 8 },
      { department: "Operations", count: 9 },
      { department: "HR", count: 7 },
    ],
  } as any,
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
  expandedNodeIds: ["emp-1", "emp-2"] as string[],
  zoomLevel: 1,
  isFullscreen: false,
  connectorStyle: "curved" as "curved" | "orthogonal" | "straight",
  showAiInsights: false,
  viewMode: "tree" as "tree" | "graph" | "list",
  graphData: {
    nodes: [
      { id: "org-1", type: "company", label: "AURIX AI Enterprise", category: "organization", metrics: { headcount: 42 } },
      { id: "dept-1", type: "department", label: "Engineering", category: "department", parentId: "org-1", metrics: { headcount: 18 } },
      { id: "emp-1", type: "employee", label: "Alex Vance", role: "VP of Engineering", category: "leadership", parentId: "dept-1" },
    ],
    edges: [
      { id: "e1", source: "org-1", target: "dept-1", relation: "has_department" },
      { id: "e2", source: "dept-1", target: "emp-1", relation: "led_by" },
    ],
    insights: [],
  } as any,
  graphLoading: false,
  graphSearchQuery: "",
  graphActiveCategories: ["organization", "department", "leadership", "employee", "team"] as string[],
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
      state.expandedNodeIds = ["emp-1", "emp-2", "emp-3", "emp-4"];
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
    setConnectorStyle(state, action: PayloadAction<"curved" | "orthogonal" | "straight">) {
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
        state.graphActiveCategories = state.graphActiveCategories.filter((c) => c !== cat);
      } else {
        state.graphActiveCategories.push(cat);
      }
    },
    setFocusedNode(state, action: PayloadAction<any>) {
      if (typeof action.payload === "string" || action.payload === null) {
        state.focusedNodeId = action.payload;
        state.focusedNode = state.graphData?.nodes?.find((n: any) => n.id === action.payload) || null;
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
      .addCase(fetchEmployeeHierarchy.fulfilled, (state, action) => {
        state.data = action.payload;
        if (action.payload?.roots) state.trees = action.payload.roots;
        state.loading = false;
      })
      .addCase(fetchOrganizationalGraph.fulfilled, (state, action) => {
        if (action.payload) state.graphData = action.payload;
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
