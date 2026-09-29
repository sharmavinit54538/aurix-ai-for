import React, { useEffect, useCallback, useMemo } from "react";
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  RefreshCw,
  Users,
  MapPin,
  X,
  AlertTriangle,
  Sparkles,
  GitBranch,
  LayoutGrid,
  ListFilter,
  Download,
  ChevronRight,
  ShieldCheck,
  DollarSign,
  Network,
  Brain,
  Building2,
  FolderKanban,
  Lightbulb,
  Target,
  Shield,
  Workflow,
  FileJson,
  FileSpreadsheet,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchEmployeeHierarchy, fetchEmployeeReportingDetails, fetchOrganizationalGraph } from "@/store/employeeHierarchy/employeeHierarchyThunk";
import {
  selectHierarchyState,
  selectFilteredHierarchyTrees,
  selectMatchingNodeIds,
  selectAvailableDepartments,
  selectAvailableDesignations,
  selectAvailableLocations,
  selectAvailableManagers,
} from "@/store/employeeHierarchy/employeeHierarchySelectors";
import {
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
  // Graph actions
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
} from "@/store/employeeHierarchy/employeeHierarchySlice";
import type { BackendHierarchyNode, HierarchyLayoutType } from "@/store/employeeHierarchy/employeeHierarchyTypes";
import type { OrgGraphFilterCategory } from "@/store/employeeHierarchy/organizationalGraphTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { OrgChartCanvas } from "./OrgChartCanvas";
import { OrgChartMobileTree } from "./OrgChartMobileTree";
import { HierarchyAnalyticsPanel } from "./HierarchyAnalyticsPanel";
import { OrganizationalGraphCanvas } from "./OrganizationalGraphView";
import { GraphDetailPanel } from "./GraphDetailPanel";
import { GraphAIPanel } from "./GraphAIPanel";
import { toast } from "sonner";

// ── Filter Category Config ────────────────────────────────────────
const filterCategories: {
  id: OrgGraphFilterCategory;
  label: string;
  icon: React.ElementType;
  color: string;
}[] = [
  { id: "people", label: "People", icon: Users, color: "text-blue-400" },
  { id: "teams", label: "Teams", icon: Building2, color: "text-violet-400" },
  { id: "projects", label: "Projects", icon: FolderKanban, color: "text-emerald-400" },
  { id: "skills", label: "Skills", icon: Lightbulb, color: "text-yellow-400" },
  { id: "goals", label: "Goals", icon: Target, color: "text-rose-400" },
  { id: "policies", label: "Policies", icon: Shield, color: "text-indigo-400" },
  { id: "workflows", label: "Workflows", icon: Workflow, color: "text-teal-400" },
];

export function EmployeeHierarchyView() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectHierarchyState);
  const {
    loading,
    error,
    selectedEmployeeId,
    selectedEmployeeDetails,
    loadingDetails,
    detailsError,
    expandedNodes,
    searchKeyword,
    filters,
    zoomLevel,
    isFullscreen,
    layout,
    connectorStyle,
    showAiInsights,
    showAnalyticsPanel,
    // Graph state
    viewMode,
    graphData,
    graphLoading,
    graphError,
    graphFilters,
    selectedGraphNode,
    graphDetailPanelOpen,
    graphAiPanelOpen,
    graphAiMessages,
    graphAiProcessing,
    healthMetrics,
    explorerActive,
    highlightedPath,
    graphSearchResults,
  } = state;

  const userRole = useAppSelector((s) => s.sidebar?.userRole) || "admin";
  const filteredTrees = useAppSelector(selectFilteredHierarchyTrees);
  const matchingNodeIds = useAppSelector(selectMatchingNodeIds);
  const availableDepartments = useAppSelector(selectAvailableDepartments);
  const availableDesignations = useAppSelector(selectAvailableDesignations);
  const availableLocations = useAppSelector(selectAvailableLocations);
  const availableManagers = useAppSelector(selectAvailableManagers);

  // Load data on mount based on view mode
  useEffect(() => {
    if (viewMode === "hierarchy") {
      dispatch(fetchEmployeeHierarchy());
    } else {
      dispatch(fetchOrganizationalGraph());
    }
  }, [dispatch, viewMode]);

  const handleToggleExpand = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      dispatch(toggleNodeExpanded(id));
    },
    [dispatch]
  );

  const handleSelectNode = useCallback(
    (node: BackendHierarchyNode) => {
      dispatch(setSelectedEmployee(node.id));
      dispatch(fetchEmployeeReportingDetails(node.id));
      const el = document.getElementById(`node-${node.id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
      }
    },
    [dispatch]
  );

  const handleGraphNodeSelect = useCallback(
    (nodeId: string) => {
      dispatch(setFocusedNode(nodeId));
    },
    [dispatch]
  );

  const handleExportCSV = useCallback(() => {
    if (viewMode === "graph" && graphData) {
      // Export filtered graph as CSV
      const rows: string[] = ["Node ID,Type,Label,Subtitle,Description"];
      graphData.nodes.forEach((n) => {
        rows.push(
          `"${n.id}","${n.type}","${n.label}","${n.subtitle || ""}","${n.description || ""}"`
        );
      });
      rows.push("");
      rows.push("Source,Target,Relationship Type,Label");
      graphData.relationships.forEach((r) => {
        rows.push(`"${r.sourceNodeId}","${r.targetNodeId}","${r.type}","${r.label}"`);
      });

      const blob = new Blob([rows.join("\n")], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `org-graph-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Organizational graph exported as CSV");
    } else {
      toast.info("Export available in graph view mode");
    }
  }, [viewMode, graphData]);

  const handleExportJSON = useCallback(() => {
    if (viewMode === "graph" && graphData) {
      const blob = new Blob([JSON.stringify(graphData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `org-graph-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Organizational graph exported as JSON");
    } else {
      toast.info("Export available in graph view mode");
    }
  }, [viewMode, graphData]);

  const handleAiMessage = useCallback(
    (message: string) => {
      if (message.startsWith("__AI_RESPONSE__")) {
        const content = message.replace("__AI_RESPONSE__", "");
        dispatch(addGraphAiMessage({ role: "assistant", content }));
        dispatch(setGraphAiProcessing(false));
      } else {
        dispatch(addGraphAiMessage({ role: "user", content: message }));
        dispatch(setGraphAiProcessing(true));
      }
    },
    [dispatch]
  );

  const isEmpDetailsAllowed = userRole === "admin" || userRole === "hr" || userRole === "hr_manager";

  const isGraphMode = viewMode === "graph";
  const isLoading = isGraphMode ? graphLoading : loading;
  const currentError = isGraphMode ? graphError : error;

  return (
    <div className={`space-y-5 ${isFullscreen ? "fixed inset-0 z-50 overflow-auto bg-background p-6" : ""}`}>
      {/* ═══ TOP HEADER & CONTROLS TOOLBAR ═══ */}
      <div className="flex flex-wrap items-center justify-end gap-2 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl text-left shadow-md">
        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Graph / Hierarchy Toggle */}
          <div className="flex items-center rounded-lg border border-border bg-accent/30 p-0.5">
            <button
              onClick={() => dispatch(setViewMode("hierarchy"))}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                !isGraphMode
                  ? "bg-brand text-brand-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Hierarchy View"
            >
              <GitBranch className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Hierarchy</span>
            </button>
            <button
              onClick={() => dispatch(setViewMode("graph"))}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                isGraphMode
                  ? "bg-brand text-brand-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Organizational Graph View"
            >
              <Network className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Graph</span>
            </button>
          </div>

          {/* Layout Selector (hierarchy mode only) */}
          {!isGraphMode && (
            <div className="flex items-center rounded-lg border border-border bg-accent/30 p-0.5">
              {[
                { id: "vertical", label: "Vertical", icon: GitBranch },
                { id: "horizontal", label: "Horizontal", icon: LayoutGrid },
                { id: "compact", label: "Compact", icon: ListFilter },
              ].map((l) => {
                const Icon = l.icon;
                const active = layout === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => dispatch(setLayout(l.id as HierarchyLayoutType))}
                    className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      active
                        ? "bg-brand text-brand-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                    title={`${l.label} Tree Layout`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{l.label}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Zoom Controls */}
          <div className="flex items-center rounded-lg border border-border bg-accent/30 p-0.5">
            <Button variant="ghost" size="icon" onClick={() => dispatch(zoomOut())} title="Zoom Out" className="h-8 w-8 cursor-pointer">
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="px-2 font-mono text-xs font-semibold text-muted-foreground min-w-[42px] text-center">
              {zoomLevel}%
            </span>
            <Button variant="ghost" size="icon" onClick={() => dispatch(zoomIn())} title="Zoom In" className="h-8 w-8 cursor-pointer">
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => dispatch(resetZoom())} title="Reset View" className="h-8 w-8 cursor-pointer">
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Expand/Collapse All */}
          <Button variant="outline" size="sm" onClick={() => dispatch(expandAllNodes())} className="text-xs h-8 cursor-pointer">
            Expand All
          </Button>
          <Button variant="outline" size="sm" onClick={() => dispatch(collapseAllNodes())} className="text-xs h-8 cursor-pointer">
            Collapse All
          </Button>

          {/* Export */}
          <div className="flex items-center rounded-lg border border-border bg-accent/30 p-0.5">
            <Button variant="ghost" size="sm" onClick={handleExportCSV} className="text-xs h-8 gap-1 cursor-pointer" title="Export CSV">
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">CSV</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleExportJSON} className="text-xs h-8 gap-1 cursor-pointer" title="Export JSON">
              <FileJson className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">JSON</span>
            </Button>
          </div>

          {/* AI Intelligence toggle (graph mode) */}
          {isGraphMode && (
            <Button
              variant={graphAiPanelOpen ? "default" : "outline"}
              size="sm"
              onClick={() => dispatch(toggleGraphAiPanel())}
              className="text-xs h-8 gap-1.5 cursor-pointer"
              title="Organizational Intelligence"
            >
              <Brain className="h-3.5 w-3.5" />
              <span className="hidden lg:inline">AI</span>
            </Button>
          )}

          {/* Fullscreen */}
          <Button variant="outline" size="sm" onClick={() => dispatch(toggleFullscreen())} className="text-xs h-8 gap-1.5 cursor-pointer">
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {/* ═══ GRAPH CATEGORY FILTERS ═══ */}
      {isGraphMode && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border bg-card/40 px-4 py-2.5 backdrop-blur-md">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mr-2">Filters</span>
          {filterCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = graphFilters.activeCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => dispatch(toggleGraphFilterCategory(cat.id))}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  isActive
                    ? `${cat.color} bg-card border-current/20 shadow-sm`
                    : "text-muted-foreground border-transparent hover:text-foreground hover:border-border/50"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      )}

      {/* ═══ GRAPH SEARCH RESULTS DROPDOWN ═══ */}
      {isGraphMode && graphSearchResults.length > 0 && (
        <div className="rounded-xl border border-brand-accent/30 bg-card/80 backdrop-blur-md shadow-lg overflow-hidden">
          <div className="px-4 py-2 border-b border-border/50">
            <span className="text-[11px] font-semibold text-muted-foreground">
              Found {graphSearchResults.length} results
            </span>
          </div>
          <div className="max-h-[200px] overflow-auto">
            {graphSearchResults.map((result) => (
              <button
                key={result.nodeId}
                type="button"
                onClick={() => dispatch(setFocusedNode(result.nodeId))}
                className="flex items-center justify-between w-full px-4 py-2 text-left hover:bg-accent/40 cursor-pointer transition-colors border-b border-border/20 last:border-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-medium text-foreground truncate">{result.label}</span>
                  {result.subtitle && (
                    <span className="text-[10px] text-muted-foreground truncate">— {result.subtitle}</span>
                  )}
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground bg-accent/60 px-1.5 py-0.5 rounded shrink-0 ml-2">
                  {result.type}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ═══ ANALYTICS / HEALTH PANEL ═══ */}
      {!isGraphMode && filteredTrees && filteredTrees.length > 0 && showAnalyticsPanel && (
        <HierarchyAnalyticsPanel trees={filteredTrees} />
      )}

      {isGraphMode && healthMetrics && (
        <HealthMetricsPanel metrics={healthMetrics} />
      )}

      {/* ═══ HIERARCHY MODE FILTERS ═══ */}
      {!isGraphMode && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 text-left">
          <div>
            <Label className="text-[11px] font-semibold text-muted-foreground">Department</Label>
            <select
              value={filters.department}
              onChange={(e) => dispatch(setFilters({ department: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="all">All Departments</option>
              {availableDepartments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-[11px] font-semibold text-muted-foreground">Designation</Label>
            <select
              value={filters.designation}
              onChange={(e) => dispatch(setFilters({ designation: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="all">All Designations</option>
              {availableDesignations.map((des) => (
                <option key={des} value={des}>{des}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-[11px] font-semibold text-muted-foreground">Location / Branch</Label>
            <select
              value={filters.location}
              onChange={(e) => dispatch(setFilters({ location: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="all">All Locations</option>
              {availableLocations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
          <div>
            <Label className="text-[11px] font-semibold text-muted-foreground">Employment Type</Label>
            <select
              value={filters.employmentType}
              onChange={(e) => dispatch(setFilters({ employmentType: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="full_time">Full-Time</option>
              <option value="part_time">Part-Time</option>
              <option value="contractor">Contractor</option>
              <option value="intern">Intern</option>
            </select>
          </div>
          <div>
            <Label className="text-[11px] font-semibold text-muted-foreground">Reporting Manager</Label>
            <select
              value={filters.reportingManagerId}
              onChange={(e) => dispatch(setFilters({ reportingManagerId: e.target.value }))}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="all">All Managers</option>
              {availableManagers.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.designation})</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* ═══ ACTIVE SEARCH RESULT INFO ═══ */}
      {!isGraphMode && matchingNodeIds.size > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-brand-accent/30 bg-brand-accent/10 px-4 py-2 text-xs font-semibold text-brand-foreground">
          <span>Found {matchingNodeIds.size} matching node(s) in organization tree</span>
          <button
            type="button"
            onClick={() => dispatch(resetFilters())}
            className="text-xs text-brand-foreground underline hover:opacity-80 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* ═══ LOADING STATE ═══ */}
      {isLoading && (
        <div className="rounded-2xl border border-border bg-card/40 p-12 text-center space-y-6">
          <div className="flex justify-center">
            <Skeleton className="h-32 w-64 rounded-2xl" />
          </div>
          <div className="flex justify-center gap-8">
            <Skeleton className="h-32 w-64 rounded-2xl" />
            <Skeleton className="h-32 w-64 rounded-2xl" />
          </div>
          <p className="text-xs text-muted-foreground">Loading organizational data from backend...</p>
        </div>
      )}

      {/* ═══ ERROR STATE ═══ */}
      {!isLoading && currentError && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-8 text-left">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive shrink-0" />
            <div>
              <h3 className="font-display text-base font-semibold text-foreground">
                {isGraphMode ? "Graph API Error" : "Hierarchy API Error"}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">{currentError}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                isGraphMode
                  ? dispatch(fetchOrganizationalGraph())
                  : dispatch(fetchEmployeeHierarchy())
              }
              className="gap-1.5 text-xs cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry Connection
            </Button>
          </div>
        </div>
      )}

      {/* ═══ EMPTY STATE ═══ */}
      {!isLoading && !currentError && isGraphMode && graphData && graphData.nodes.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
          <Network className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
          <h3 className="font-display text-base font-semibold text-foreground">No Organizational Data Available</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            No employees found. Add employees and organizational data in the system first.
          </p>
        </div>
      )}

      {!isLoading && !currentError && isGraphMode && graphData && graphData.nodes.length > 0 && (
        <div className="space-y-3">
          {/* Relationship status info */}
          {graphData.metadata.totalProjects === 0 &&
            graphData.metadata.totalGoals === 0 &&
            graphData.metadata.totalPolicies === 0 &&
            graphData.metadata.totalWorkflows === 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2 text-xs">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="text-muted-foreground">
                  Employees found, but project, goal, policy, and workflow relationships are not configured.
                  Only employee hierarchy and department relationships are available.
                </span>
              </div>
            )}

          {/* Graph Canvas */}
          <OrganizationalGraphCanvas
            nodes={graphData.nodes}
            relationships={graphData.relationships}
            activeCategories={graphFilters.activeCategories}
            focusedNodeId={graphFilters.focusedNodeId}
            highlightedPath={highlightedPath}
            zoomLevel={zoomLevel}
            onSelectNode={handleGraphNodeSelect}
          />
        </div>
      )}

      {/* ═══ HIERARCHY VIEW (existing) ═══ */}
      {!isGraphMode && (
        <>
          {!loading && !error && (!filteredTrees || filteredTrees.length === 0) && (
            <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
              <Users className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
              <h3 className="font-display text-base font-semibold text-foreground">No Employee Hierarchy Available</h3>
              <p className="mt-1 text-xs text-muted-foreground">
                No active reporting structures match the selected filters in the database.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => dispatch(resetFilters())}
                className="mt-4 text-xs cursor-pointer"
              >
                Reset Filters
              </Button>
            </div>
          )}

          {!loading && !error && filteredTrees && filteredTrees.length > 0 && (
            <>
              <div className="hidden sm:block">
                <OrgChartCanvas
                  trees={filteredTrees}
                  expandedNodes={expandedNodes}
                  selectedEmployeeId={selectedEmployeeId}
                  matchingNodeIds={matchingNodeIds}
                  zoomLevel={zoomLevel}
                  layout={layout}
                  connectorStyle={connectorStyle}
                  onToggleExpand={handleToggleExpand}
                  onSelectNode={handleSelectNode}
                />
              </div>
              <div className="block sm:hidden">
                <OrgChartMobileTree
                  trees={filteredTrees}
                  expandedNodes={expandedNodes}
                  selectedEmployeeId={selectedEmployeeId}
                  matchingNodeIds={matchingNodeIds}
                  onToggleExpand={handleToggleExpand}
                  onSelectNode={handleSelectNode}
                />
              </div>
            </>
          )}
        </>
      )}

      {/* ═══ HIERARCHY DETAIL PANEL ═══ */}
      {!isGraphMode && selectedEmployeeId && (
        <div className="fixed bottom-6 right-6 z-40 max-w-md w-full rounded-2xl border border-border bg-card/95 p-5 shadow-2xl backdrop-blur-xl text-left animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-border">
            <h3 className="font-display text-sm font-bold text-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-brand" />
              Employee Hierarchy Intelligence
            </h3>
            <button
              type="button"
              onClick={() => dispatch(setSelectedEmployee(null))}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {loadingDetails && (
            <div className="py-6 space-y-3">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          )}

          {!loadingDetails && detailsError && (
            <div className="py-4 text-xs text-destructive flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              <span>{detailsError}</span>
            </div>
          )}

          {!loadingDetails && selectedEmployeeDetails && (
            <div className="mt-3 space-y-4 text-xs">
              <div className="flex items-center gap-3">
                {selectedEmployeeDetails.employee.profile_photo_url ? (
                  <img
                    src={selectedEmployeeDetails.employee.profile_photo_url}
                    alt={selectedEmployeeDetails.employee.first_name}
                    className="h-12 w-12 rounded-xl object-cover ring-2 ring-primary/30"
                  />
                ) : (
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-brand text-sm font-bold text-brand-foreground">
                    {selectedEmployeeDetails.employee.first_name?.[0]}
                    {selectedEmployeeDetails.employee.last_name?.[0]}
                  </div>
                )}
                <div>
                  <h4 className="font-display text-sm font-bold text-foreground">
                    {selectedEmployeeDetails.employee.first_name} {selectedEmployeeDetails.employee.last_name}
                  </h4>
                  <p className="text-xs text-muted-foreground">{selectedEmployeeDetails.employee.designation}</p>
                  <p className="text-[11px] text-muted-foreground/80">{selectedEmployeeDetails.employee.department}</p>
                </div>
              </div>

              {selectedEmployeeDetails.reporting_chain && selectedEmployeeDetails.reporting_chain.length > 0 && (
                <div className="rounded-xl border border-border bg-accent/30 p-2.5 space-y-1">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Reporting Chain Path
                  </span>
                  <div className="flex flex-wrap items-center gap-1 text-[11px]">
                    {selectedEmployeeDetails.reporting_chain.map((ancestor, idx) => (
                      <React.Fragment key={ancestor.id}>
                        <span className="font-medium text-foreground">
                          {ancestor.first_name} {ancestor.last_name}
                        </span>
                        {idx < selectedEmployeeDetails.reporting_chain.length - 1 && (
                          <ChevronRight className="h-3 w-3 text-muted-foreground" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-accent/20 p-3">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 block">Org Level</span>
                  <p className="font-medium text-foreground">Level {selectedEmployeeDetails.organization_level}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 block">Direct Reports</span>
                  <p className="font-medium text-foreground">{selectedEmployeeDetails.direct_reports.length} Employees</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 block">Reporting Manager</span>
                  <p className="font-medium text-foreground">
                    {selectedEmployeeDetails.manager
                      ? `${selectedEmployeeDetails.manager.first_name} ${selectedEmployeeDetails.manager.last_name}`
                      : "Executive Board"}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 block">Location</span>
                  <p className="font-medium text-foreground">{selectedEmployeeDetails.employee.branch || "Headquarters"}</p>
                </div>
                {isEmpDetailsAllowed && selectedEmployeeDetails.employee.ctc && (
                  <div className="col-span-2 pt-2 border-t border-border/50">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground/60 flex items-center gap-1">
                      <DollarSign className="h-3 w-3 text-emerald-400" /> Confidential CTC
                    </span>
                    <p className="font-mono text-xs font-semibold text-emerald-400">
                      ₹ {Number(selectedEmployeeDetails.employee.ctc).toLocaleString()} / yr
                    </p>
                  </div>
                )}
              </div>

              {selectedEmployeeDetails.direct_reports.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground block mb-1.5">
                    Direct Reports ({selectedEmployeeDetails.direct_reports.length})
                  </span>
                  <div className="space-y-1 max-h-32 overflow-auto">
                    {selectedEmployeeDetails.direct_reports.map((dr) => (
                      <div
                        key={dr.id}
                        onClick={() => handleSelectNode(dr as any)}
                        className="flex items-center justify-between rounded-lg border border-border/60 bg-card p-2 hover:border-primary/50 cursor-pointer"
                      >
                        <span className="font-medium text-foreground truncate">
                          {dr.first_name} {dr.last_name}
                        </span>
                        <span className="text-[10px] text-muted-foreground truncate">{dr.designation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ═══ GRAPH DETAIL PANEL ═══ */}
      {isGraphMode && graphDetailPanelOpen && selectedGraphNode && (
        <GraphDetailPanel
          details={selectedGraphNode}
          onClose={() => dispatch(closeGraphDetailPanel())}
          onFocusNode={(nodeId) => dispatch(setFocusedNode(nodeId))}
          onExplore={() => dispatch(toggleExplorer())}
          explorerActive={explorerActive}
        />
      )}

      {/* ═══ AI INTELLIGENCE PANEL ═══ */}
      {isGraphMode && graphAiPanelOpen && (
        <GraphAIPanel
          graphData={graphData}
          messages={graphAiMessages}
          processing={graphAiProcessing}
          onSendMessage={handleAiMessage}
          onClose={() => dispatch(toggleGraphAiPanel())}
        />
      )}
    </div>
  );
}

// ── Health Metrics Panel Component ─────────────────────────────────
function HealthMetricsPanel({ metrics }: { metrics: import("@/store/employeeHierarchy/organizationalGraphTypes").OrgHealthMetrics }) {
  if (!metrics.sufficientData) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-card/40 p-6 text-center">
        <AlertTriangle className="h-6 w-6 mx-auto text-muted-foreground/40 mb-2" />
        <p className="text-xs font-semibold text-muted-foreground">
          Insufficient organizational data for analysis.
        </p>
      </div>
    );
  }

  const kpis = [
    {
      label: "Total Workforce",
      value: metrics.totalWorkforce.toString(),
      sub: "Active Employees",
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      label: "Leadership",
      value: metrics.totalManagers.toString(),
      sub: "Active Managers",
      icon: ShieldCheck,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      label: "Org Depth",
      value: `${metrics.hierarchyDepth} Levels`,
      sub: "Max Hierarchy Depth",
      icon: GitBranch,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      label: "Span of Control",
      value: `${metrics.avgSpanOfControl} Avg`,
      sub: "Reports per Manager",
      icon: Network,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  const issues = [
    metrics.unassignedReportingManagers > 0 && {
      label: `${metrics.unassignedReportingManagers} employee(s) without assigned reporting manager`,
      type: "warning" as const,
    },
    metrics.employeesWithoutDepartment > 0 && {
      label: `${metrics.employeesWithoutDepartment} employee(s) without department assignment`,
      type: "warning" as const,
    },
    metrics.teamsWithoutManagers > 0 && {
      label: `${metrics.teamsWithoutManagers} department(s) without a manager`,
      type: "info" as const,
    },
  ].filter(Boolean) as { label: string; type: "warning" | "info" }[];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className={`rounded-xl border ${kpi.bg} bg-card/60 p-3.5 backdrop-blur-md text-left shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {kpi.label}
                </span>
                <div className={`p-2 rounded-lg ${kpi.bg} ${kpi.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <h3 className="font-display text-xl font-bold mt-1 text-foreground">{kpi.value}</h3>
              <p className="text-[10px] text-muted-foreground mt-0.5">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {issues.length > 0 && (
        <div className="rounded-xl border border-brand/20 bg-brand/5 p-3 backdrop-blur-md space-y-2">
          <div className="flex items-center gap-2 text-[11px] font-semibold text-brand">
            <Sparkles className="h-3.5 w-3.5" />
            Organizational Health Insights
          </div>
          {issues.map((issue, idx) => (
            <div key={idx} className="flex items-start gap-2 text-[11px] text-muted-foreground">
              <AlertTriangle
                className={`h-3 w-3 shrink-0 mt-0.5 ${
                  issue.type === "warning" ? "text-amber-400" : "text-blue-400"
                }`}
              />
              <span>{issue.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EmployeeHierarchyView;
