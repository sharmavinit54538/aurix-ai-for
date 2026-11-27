import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchEmployeeHierarchy, fetchEmployeeReportingDetails, fetchOrganizationalGraph } from "./employeeHierarchyThunk";
import type { ConnectorStyleType, EmployeeHierarchyState, HierarchyFilters, HierarchyLayoutType } from "./employeeHierarchyTypes";
import type { OrgGraphFilterCategory } from "./organizationalGraphTypes";
import { flattenHierarchy } from "./hierarchyNormalization";
import { calculateHealthMetrics } from "@/services/organizationalGraphApi";

const initialState: EmployeeHierarchyState = {
  data: null, trees: [], flatList: [], loading: false, error: null,
  searchKeyword: "",
  filters: { department: "all", designation: "all", location: "all", status: "all", employmentType: "all", reportingManagerId: "all" },
  selectedEmployeeId: null, selectedEmployeeDetails: null, loadingDetails: false, detailsError: null, detailsRequestId: null,
  expandedNodes: {}, zoomLevel: 100, isFullscreen: false, layout: "vertical", connectorStyle: "curved",
  showAiInsights: false, showAnalyticsPanel: true, viewMode: "hierarchy",
  graphData: null, graphLoading: false, graphError: null,
  graphFilters: { activeCategories: ["people", "teams", "projects", "skills", "goals", "policies", "workflows"], searchQuery: "", focusedNodeId: null },
  selectedGraphNode: null, graphDetailPanelOpen: false, graphAiPanelOpen: false, graphAiMessages: [], graphAiProcessing: false,
  healthMetrics: null, explorerActive: false, highlightedPath: [], graphSearchResults: [],
};

const employeeHierarchySlice = createSlice({
  name: "employeeHierarchy", initialState,
  reducers: {
    setSearchKeyword(state, action: PayloadAction<string>) { state.searchKeyword = action.payload; },
    setFilters(state, action: PayloadAction<Partial<HierarchyFilters>>) { Object.assign(state.filters, action.payload); },
    resetFilters(state) { state.searchKeyword = ""; state.filters = { ...initialState.filters }; },
    setSelectedEmployee(state, action: PayloadAction<string | null>) {
      state.selectedEmployeeId = action.payload; state.selectedEmployeeDetails = null; state.detailsError = null;
      state.loadingDetails = false; state.detailsRequestId = null;
    },
    toggleNodeExpanded(state, action: PayloadAction<string>) { state.expandedNodes[action.payload] = state.expandedNodes[action.payload] === false; },
    expandAllNodes(state) { state.expandedNodes = {}; },
    collapseAllNodes(state) { state.expandedNodes = Object.fromEntries(state.flatList.map(node => [node.id, false])); },
    zoomIn(state) { state.zoomLevel = Math.min(200, state.zoomLevel + 10); },
    zoomOut(state) { state.zoomLevel = Math.max(40, state.zoomLevel - 10); },
    resetZoom(state) { state.zoomLevel = 100; },
    toggleFullscreen(state) { state.isFullscreen = !state.isFullscreen; },
    setLayout(state, action: PayloadAction<HierarchyLayoutType>) { state.layout = action.payload; },
    setConnectorStyle(state, action: PayloadAction<ConnectorStyleType>) { state.connectorStyle = action.payload; },
    toggleAiInsights(state) { state.showAiInsights = !state.showAiInsights; },
    setViewMode(state, action: PayloadAction<"hierarchy" | "graph">) { state.viewMode = action.payload; },
    setGraphSearchQuery(state, action: PayloadAction<string>) {
      state.graphFilters.searchQuery = action.payload;
      const query = action.payload.trim().toLowerCase();
      state.graphSearchResults = query ? (state.graphData?.nodes ?? [])
        .filter(node => [node.label, node.subtitle, node.description].some(value => value?.toLowerCase().includes(query)))
        .map(node => ({ nodeId: node.id, label: node.label, subtitle: node.subtitle, type: node.type })) : [];
    },
    toggleGraphFilterCategory(state, action: PayloadAction<OrgGraphFilterCategory>) {
      if (!state.graphFilters) {
        state.graphFilters = {
          ...initialState.graphFilters,
          activeCategories: [...initialState.graphFilters.activeCategories],
        };
      }
      const categories = Array.isArray(state.graphFilters.activeCategories)
        ? state.graphFilters.activeCategories
        : [...initialState.graphFilters.activeCategories];
      state.graphFilters.activeCategories = categories.includes(action.payload)
        ? categories.filter((category) => category !== action.payload)
        : [...categories, action.payload];
    },
    setFocusedNode(state, action: PayloadAction<string | null>) {
      const node = state.graphData?.nodes.find(item => item.id === action.payload);
      state.graphFilters.focusedNodeId = node?.id ?? null;
      if (!node || !state.graphData) { state.selectedGraphNode = null; state.graphDetailPanelOpen = false; return; }
      const directConnections = state.graphData.relationships.filter(rel => rel.sourceNodeId === node.id || rel.targetNodeId === node.id);
      const connectedIds = new Set(directConnections.flatMap(rel => [rel.sourceNodeId, rel.targetNodeId]));
      state.selectedGraphNode = { node, directConnections, connectedNodes: state.graphData.nodes.filter(item => item.id !== node.id && connectedIds.has(item.id)) };
      state.graphDetailPanelOpen = true;
    },
    closeGraphDetailPanel(state) { state.graphDetailPanelOpen = false; state.selectedGraphNode = null; state.graphFilters.focusedNodeId = null; state.highlightedPath = []; },
    toggleGraphAiPanel(state) { state.graphAiPanelOpen = !state.graphAiPanelOpen; },
    addGraphAiMessage: {
      reducer(state, action: PayloadAction<EmployeeHierarchyState["graphAiMessages"][number]>) { state.graphAiMessages.push(action.payload); },
      prepare(message: { role: "user" | "assistant"; content: string }) { return { payload: { ...message, timestamp: new Date().toISOString() } }; },
    },
    setGraphAiProcessing(state, action: PayloadAction<boolean>) { state.graphAiProcessing = action.payload; },
    toggleExplorer(state) {
      state.explorerActive = !state.explorerActive;
      state.highlightedPath = state.explorerActive && state.selectedGraphNode ? [state.selectedGraphNode.node.id, ...state.selectedGraphNode.connectedNodes.map(node => node.id)] : [];
    },
    resetGraphFilters(state) { state.graphFilters = { ...initialState.graphFilters, activeCategories: [...initialState.graphFilters.activeCategories] }; state.graphSearchResults = []; },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchEmployeeHierarchy.pending, state => { state.loading = true; state.error = null; })
      .addCase(fetchEmployeeHierarchy.fulfilled, (state, action) => {
        state.data = action.payload; state.trees = action.payload; state.flatList = flattenHierarchy(action.payload); state.loading = false;
      })
      .addCase(fetchEmployeeHierarchy.rejected, (state, action) => { state.loading = false; state.error = action.payload ?? "Unable to load the employee hierarchy. Please retry."; })
      .addCase(fetchEmployeeReportingDetails.pending, (state, action) => {
        state.loadingDetails = true; state.detailsError = null; state.selectedEmployeeDetails = null; state.detailsRequestId = action.meta.requestId;
      })
      .addCase(fetchEmployeeReportingDetails.fulfilled, (state, action) => {
        if (state.detailsRequestId !== action.meta.requestId || state.selectedEmployeeId !== action.meta.arg) return;
        state.selectedEmployeeDetails = action.payload; state.loadingDetails = false; state.detailsRequestId = null;
      })
      .addCase(fetchEmployeeReportingDetails.rejected, (state, action) => {
        if (state.detailsRequestId !== action.meta.requestId || state.selectedEmployeeId !== action.meta.arg) return;
        state.loadingDetails = false; state.detailsRequestId = null; state.detailsError = action.payload ?? "Unable to load reporting details. Please retry.";
      })
      .addCase(fetchOrganizationalGraph.pending, state => { state.graphLoading = true; state.graphError = null; })
      .addCase(fetchOrganizationalGraph.fulfilled, (state, action) => {
        state.graphData = action.payload; state.graphLoading = false;
        state.healthMetrics = calculateHealthMetrics(action.payload.nodes, action.payload.relationships);
        state.selectedGraphNode = null; state.graphDetailPanelOpen = false; state.graphFilters.focusedNodeId = null;
      })
      .addCase(fetchOrganizationalGraph.rejected, (state, action) => { state.graphLoading = false; state.graphError = action.payload ?? "Unable to load the organizational graph. Please retry."; });
  },
});

export const { setSearchKeyword, setFilters, resetFilters, setSelectedEmployee, toggleNodeExpanded, expandAllNodes, collapseAllNodes, zoomIn, zoomOut, resetZoom, toggleFullscreen, setLayout, setConnectorStyle, toggleAiInsights, setViewMode, setGraphSearchQuery, toggleGraphFilterCategory, setFocusedNode, closeGraphDetailPanel, toggleGraphAiPanel, addGraphAiMessage, setGraphAiProcessing, toggleExplorer, resetGraphFilters } = employeeHierarchySlice.actions;
export default employeeHierarchySlice.reducer;
