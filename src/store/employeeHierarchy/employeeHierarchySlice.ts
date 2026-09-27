import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  EmployeeHierarchyState,
  HierarchyFilterState,
  BackendHierarchyNode,
  HierarchyLayoutType,
  ConnectorStyleType,
} from "./employeeHierarchyTypes";
import type {
  OrgGraphFilterCategory,
  OrgRelationshipType,
  OrgGraphNodeDetails,
  OrgGraphSearchResult,
  OrgHealthMetrics,
} from "./organizationalGraphTypes";
import { fetchEmployeeHierarchy, fetchEmployeeReportingDetails, fetchOrganizationalGraph } from "./employeeHierarchyThunk";
import { calculateHealthMetrics } from "@/services/organizationalGraphApi";

const initialFilters: HierarchyFilterState = {
  department: "all",
  designation: "all",
  location: "all",
  employmentType: "all",
  reportingManagerId: "all",
  workLocationType: "all",
};

const initialGraphFilters = {
  activeCategories: ["people", "teams"] as OrgGraphFilterCategory[],
  activeRelationshipTypes: [
    "REPORTS_TO",
    "MANAGES",
    "MEMBER_OF",
    "BELONGS_TO",
  ] as OrgRelationshipType[],
  searchQuery: "",
  focusedNodeId: null as string | null,
  department: "all",
  designation: "all",
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
  layout: "vertical",
  connectorStyle: "curved",
  showAiInsights: false,
  showAnalyticsPanel: true,

  // ── Graph state ────────────────────────────────
  viewMode: "hierarchy",
  graphData: null,
  graphLoading: false,
  graphError: null,
  graphFilters: initialGraphFilters,
  selectedGraphNode: null,
  graphDetailPanelOpen: false,
  graphAiPanelOpen: false,
  graphAiMessages: [],
  graphAiProcessing: false,
  healthMetrics: null,
  explorerActive: false,
  highlightedPath: [],
  graphSearchResults: [],
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
      if (action.payload && action.payload.trim().length > 0 && state.hierarchy) {
        const allIds = getAllNodeIds(state.hierarchy);
        allIds.forEach((id) => {
          state.expandedNodes[id] = true;
        });
      }
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
      state.zoomLevel = Math.max(40, Math.min(200, action.payload));
    },
    zoomIn(state) {
      state.zoomLevel = Math.min(200, state.zoomLevel + 15);
    },
    zoomOut(state) {
      state.zoomLevel = Math.max(40, state.zoomLevel - 15);
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
    setLayout(state, action: PayloadAction<HierarchyLayoutType>) {
      state.layout = action.payload;
    },
    setConnectorStyle(state, action: PayloadAction<ConnectorStyleType>) {
      state.connectorStyle = action.payload;
    },
    toggleAiInsights(state) {
      state.showAiInsights = !state.showAiInsights;
    },
    toggleAnalyticsPanel(state) {
      state.showAnalyticsPanel = !state.showAnalyticsPanel;
    },

    // ── Graph reducers ────────────────────────────
    setViewMode(state, action: PayloadAction<"graph" | "hierarchy">) {
      state.viewMode = action.payload;
    },
    setGraphSearchQuery(state, action: PayloadAction<string>) {
      const query = action.payload.toLowerCase().trim();
      state.graphFilters.searchQuery = action.payload;

      // Update search results from current graph data
      if (state.graphData && query.length > 0) {
        state.graphSearchResults = state.graphData.nodes
          .filter((n) => {
            return (
              n.label.toLowerCase().includes(query) ||
              (n.subtitle && n.subtitle.toLowerCase().includes(query)) ||
              (n.description && n.description.toLowerCase().includes(query)) ||
              n.type.toLowerCase().includes(query) ||
              (n.metadata?.employeeId && String(n.metadata.employeeId).toLowerCase().includes(query))
            );
          })
          .slice(0, 20)
          .map((n) => ({
            nodeId: n.id,
            type: n.type,
            label: n.label,
            subtitle: n.subtitle,
          }));
      } else {
        state.graphSearchResults = [];
      }
    },
    toggleGraphFilterCategory(state, action: PayloadAction<OrgGraphFilterCategory>) {
      const cat = action.payload;
      const idx = state.graphFilters.activeCategories.indexOf(cat);
      if (idx >= 0) {
        state.graphFilters.activeCategories.splice(idx, 1);
      } else {
        state.graphFilters.activeCategories.push(cat);
      }
    },
    setGraphFilterCategories(state, action: PayloadAction<OrgGraphFilterCategory[]>) {
      state.graphFilters.activeCategories = action.payload;
    },
    toggleRelationshipTypeFilter(state, action: PayloadAction<OrgRelationshipType>) {
      const rType = action.payload;
      const idx = state.graphFilters.activeRelationshipTypes.indexOf(rType);
      if (idx >= 0) {
        state.graphFilters.activeRelationshipTypes.splice(idx, 1);
      } else {
        state.graphFilters.activeRelationshipTypes.push(rType);
      }
    },
    setFocusedNode(state, action: PayloadAction<string | null>) {
      state.graphFilters.focusedNodeId = action.payload;
      if (action.payload && state.graphData) {
        // Build node details
        const node = state.graphData.nodes.find((n) => n.id === action.payload);
        if (node) {
          const directRels = state.graphData.relationships.filter(
            (r) => r.sourceNodeId === action.payload || r.targetNodeId === action.payload
          );
          const connectedIds = new Set(
            directRels.map((r) =>
              r.sourceNodeId === action.payload ? r.targetNodeId : r.sourceNodeId
            )
          );
          const connectedNodes = state.graphData.nodes.filter((n) => connectedIds.has(n.id));

          state.selectedGraphNode = {
            node,
            directConnections: directRels,
            connectedNodes,
          };
          state.graphDetailPanelOpen = true;
          state.highlightedPath = [action.payload, ...Array.from(connectedIds)];
        }
      } else {
        state.selectedGraphNode = null;
        state.graphDetailPanelOpen = false;
        state.highlightedPath = [];
      }
    },
    closeGraphDetailPanel(state) {
      state.graphDetailPanelOpen = false;
      state.selectedGraphNode = null;
      state.graphFilters.focusedNodeId = null;
      state.highlightedPath = [];
      state.explorerActive = false;
    },
    toggleGraphAiPanel(state) {
      state.graphAiPanelOpen = !state.graphAiPanelOpen;
    },
    addGraphAiMessage(state, action: PayloadAction<{ role: "user" | "assistant"; content: string }>) {
      state.graphAiMessages.push({
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    setGraphAiProcessing(state, action: PayloadAction<boolean>) {
      state.graphAiProcessing = action.payload;
    },
    toggleExplorer(state) {
      state.explorerActive = !state.explorerActive;
    },
    setHighlightedPath(state, action: PayloadAction<string[]>) {
      state.highlightedPath = action.payload;
    },
    resetGraphFilters(state) {
      state.graphFilters = initialGraphFilters;
      state.graphSearchResults = [];
      state.highlightedPath = [];
      state.explorerActive = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Hierarchy thunks ──────────────────────
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
      })
      // ── Graph thunk ───────────────────────────
      .addCase(fetchOrganizationalGraph.pending, (state) => {
        state.graphLoading = true;
        state.graphError = null;
      })
      .addCase(fetchOrganizationalGraph.fulfilled, (state, action) => {
        state.graphLoading = false;
        state.graphData = action.payload;

        // Calculate health metrics from graph data
        if (action.payload.nodes.length > 0) {
          state.healthMetrics = calculateHealthMetrics(
            action.payload.nodes,
            action.payload.relationships
          );
        } else {
          state.healthMetrics = {
            totalWorkforce: 0,
            totalManagers: 0,
            hierarchyDepth: 0,
            avgSpanOfControl: 0,
            unassignedReportingManagers: 0,
            teamsWithoutManagers: 0,
            employeesWithoutDepartment: 0,
            orphanedRelationships: 0,
            projectsWithoutEmployees: 0,
            goalsWithoutOwners: 0,
            workflowsWithoutResponsible: 0,
            sufficientData: false,
          };
        }
      })
      .addCase(fetchOrganizationalGraph.rejected, (state, action) => {
        state.graphLoading = false;
        state.graphError = action.payload ?? "Failed to load organizational graph data.";
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
  setLayout,
  setConnectorStyle,
  toggleAiInsights,
  toggleAnalyticsPanel,
  // ── Graph actions ──────────────────
  setViewMode,
  setGraphSearchQuery,
  toggleGraphFilterCategory,
  setGraphFilterCategories,
  toggleRelationshipTypeFilter,
  setFocusedNode,
  closeGraphDetailPanel,
  toggleGraphAiPanel,
  addGraphAiMessage,
  setGraphAiProcessing,
  toggleExplorer,
  setHighlightedPath,
  resetGraphFilters,
} = employeeHierarchySlice.actions;

export default employeeHierarchySlice.reducer;
