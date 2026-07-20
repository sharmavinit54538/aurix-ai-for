import React, { useEffect, useCallback } from "react";
import {
  Search, ZoomIn, ZoomOut, Maximize2, Minimize2, RotateCcw,
  RefreshCw, Users, MapPin, X, AlertTriangle, ShieldAlert, Calendar, DollarSign
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchEmployeeHierarchy, fetchEmployeeReportingDetails } from "@/store/employeeHierarchy/employeeHierarchyThunk";
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
} from "@/store/employeeHierarchy/employeeHierarchySlice";
import type { BackendHierarchyNode } from "@/store/employeeHierarchy/employeeHierarchyTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { OrgChartCanvas } from "./OrgChartCanvas";
import { OrgChartMobileTree } from "./OrgChartMobileTree";

export function EmployeeHierarchyView() {
  const dispatch = useAppDispatch();
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
  } = useAppSelector(selectHierarchyState);

  const userRole = useAppSelector((state) => state.sidebar?.userRole) || "admin";
  const filteredTrees = useAppSelector(selectFilteredHierarchyTrees);
  const matchingNodeIds = useAppSelector(selectMatchingNodeIds);
  const availableDepartments = useAppSelector(selectAvailableDepartments);
  const availableDesignations = useAppSelector(selectAvailableDesignations);
  const availableLocations = useAppSelector(selectAvailableLocations);
  const availableManagers = useAppSelector(selectAvailableManagers);

  useEffect(() => {
    dispatch(fetchEmployeeHierarchy());
  }, [dispatch]);

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

  const isEmpDetailsAllowed = userRole === "admin" || userRole === "hr" || userRole === "hr_manager";

  return (
    <div className={`space-y-4 ${isFullscreen ? "fixed inset-0 z-50 overflow-auto bg-background p-6" : ""}`}>
      {/* TOOLBAR & SEARCH SECTION */}
      <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between text-left">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchKeyword}
            onChange={(e) => dispatch(setSearchKeyword(e.target.value))}
            placeholder="Search by Name, Employee ID, Department, or Designation..."
            className="pl-9 pr-8"
          />
          {searchKeyword && (
            <button
              type="button"
              onClick={() => dispatch(setSearchKeyword(""))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center rounded-lg border border-border bg-accent/30 p-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(zoomOut())}
              title="Zoom Out"
              className="h-8 w-8 cursor-pointer"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="px-2 font-mono text-xs font-semibold text-muted-foreground min-w-[42px] text-center">
              {zoomLevel}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(zoomIn())}
              title="Zoom In"
              className="h-8 w-8 cursor-pointer"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => dispatch(resetZoom())}
              title="Reset / Fit to Screen"
              className="h-8 w-8 cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* Node Expand/Collapse All */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(expandAllNodes())}
            className="text-xs h-8 cursor-pointer"
          >
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(collapseAllNodes())}
            className="text-xs h-8 cursor-pointer"
          >
            Collapse All
          </Button>

          {/* Fullscreen Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(toggleFullscreen())}
            className="text-xs h-8 gap-1.5 cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
            {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          </Button>
        </div>
      </div>

      {/* FILTER DROPDOWNS ROW */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 text-left">
        {/* Department Filter */}
        <div>
          <Label className="text-[11px] font-semibold text-muted-foreground">Department</Label>
          <select
            value={filters.department}
            onChange={(e) => dispatch(setFilters({ department: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="all">All Departments</option>
            {availableDepartments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Designation Filter */}
        <div>
          <Label className="text-[11px] font-semibold text-muted-foreground">Designation</Label>
          <select
            value={filters.designation}
            onChange={(e) => dispatch(setFilters({ designation: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="all">All Designations</option>
            {availableDesignations.map((des) => (
              <option key={des} value={des}>
                {des}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <Label className="text-[11px] font-semibold text-muted-foreground">Location / Branch</Label>
          <select
            value={filters.location}
            onChange={(e) => dispatch(setFilters({ location: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="all">All Locations</option>
            {availableLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Employment Type Filter */}
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

        {/* Manager Filter */}
        <div>
          <Label className="text-[11px] font-semibold text-muted-foreground">Reporting Manager</Label>
          <select
            value={filters.reportingManagerId}
            onChange={(e) => dispatch(setFilters({ reportingManagerId: e.target.value }))}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="all">All Managers</option>
            {availableManagers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.designation})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ACTIVE SEARCH RESULT INFO */}
      {matchingNodeIds.size > 0 && (
        <div className="flex items-center justify-between rounded-xl border border-brand-accent/30 bg-brand-accent/10 px-4 py-2 text-xs font-semibold text-brand-foreground">
          <span>Found {matchingNodeIds.size} matching backend node(s)</span>
          <button
            type="button"
            onClick={() => dispatch(resetFilters())}
            className="text-xs text-brand-foreground underline hover:opacity-80 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* SKELETON LOADING STATE */}
      {loading && (
        <div className="rounded-2xl border border-border bg-card/40 p-12 text-center space-y-6">
          <div className="flex justify-center">
            <Skeleton className="h-32 w-64 rounded-2xl" />
          </div>
          <div className="flex justify-center gap-8">
            <Skeleton className="h-32 w-64 rounded-2xl" />
            <Skeleton className="h-32 w-64 rounded-2xl" />
          </div>
        </div>
      )}

      {/* ERROR STATE WITH RETRY */}
      {!loading && error && (
        <div className="rounded-2xl border border-destructive/40 bg-destructive/10 p-8 text-left">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive shrink-0" />
            <div>
              <h3 className="font-display text-base font-semibold text-foreground">Hierarchy API Failure</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{error}</p>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => dispatch(fetchEmployeeHierarchy())}
              className="gap-1.5 text-xs cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Retry Connection
            </Button>
          </div>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && (!filteredTrees || filteredTrees.length === 0) && (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
          <h3 className="font-display text-base font-semibold text-foreground">No Employee Hierarchy Available</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            No active reporting structures or employees match the selected filters in the database.
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

      {/* CANVAS / CHART VIEW */}
      {!loading && !error && filteredTrees && filteredTrees.length > 0 && (
        <>
          {/* Desktop & Tablet Org Chart Canvas */}
          <div className="hidden sm:block">
            <OrgChartCanvas
              trees={filteredTrees}
              expandedNodes={expandedNodes}
              selectedEmployeeId={selectedEmployeeId}
              matchingNodeIds={matchingNodeIds}
              zoomLevel={zoomLevel}
              onToggleExpand={handleToggleExpand}
              onSelectNode={handleSelectNode}
            />
          </div>

          {/* Mobile Collapsible Tree List */}
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

      {/* LAZY-LOADED SIDE DRAWER DETAILS */}
      {selectedEmployeeId && (
        <div className="fixed bottom-6 right-6 z-40 max-w-md w-full rounded-2xl border border-border bg-card/95 p-5 shadow-2xl backdrop-blur-xl text-left animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-border">
            <h3 className="font-display text-sm font-bold text-foreground">Employee Hierarchy Intelligence</h3>
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
              {/* Employee Summary Card */}
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

              {/* Grid Metadata */}
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
                      ${Number(selectedEmployeeDetails.employee.ctc).toLocaleString()} / yr
                    </p>
                  </div>
                )}
              </div>

              {/* Direct Reports List */}
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
    </div>
  );
}
