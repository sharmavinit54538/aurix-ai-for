import { usePayrollValidationCore } from "./usePayrollValidationCore";
import { usePayrollValidationFilters } from "./usePayrollValidationFilters";
import { usePayrollValidationActions } from "./usePayrollValidationActions";

export function usePayrollValidation() {
  // Core data fetching
  const core = usePayrollValidationCore();

  // Filter state (includes modal states and issue detail)
  const filterHook = usePayrollValidationFilters();

  // Actions
  const actions = usePayrollValidationActions(
    core.runId,
    core.validationData,
    core.fetchValidationData,
    filterHook.setRevalidateModalOpen,
    filterHook.setIsValidating,
    filterHook.setRecalculateModalOpen,
    filterHook.setIsRecalculating
  );

  // ── Dynamic Options for Filters ─────────────────────────────────────
  const availableCategories: string[] = core.validationData?.issues
    ? Array.from(new Set(core.validationData.issues.map((iss) => iss.category).filter((c): c is string => Boolean(c)))).sort()
    : [];
  const availableDepartments: string[] = core.validationData?.issues
    ? Array.from(new Set(core.validationData.issues.map((iss) => iss.department).filter((d): d is string => Boolean(d)))).sort()
    : [];
  const hasBlockingInfoFlag = core.validationData?.issues?.some((iss) => iss.blocking !== undefined) ?? false;
  const hasStatusInfoFlag = core.validationData?.issues?.some((iss) => iss.status || iss.resolved !== undefined) ?? false;

  // ── Client-Side Filtered & Searched Issues ───────────────────────────
  const filteredIssues = core.validationData?.issues
    ? core.validationData.issues.filter((iss) => {
        // Search query
        if (filterHook.filters.searchQuery.trim()) {
          const q = filterHook.filters.searchQuery.toLowerCase().trim();
          const matchEmpName = iss.employeeName?.toLowerCase().includes(q);
          const matchEmpId = iss.employeeId?.toLowerCase().includes(q);
          const matchMsg = iss.message?.toLowerCase().includes(q);
          const matchCat = iss.category?.toLowerCase().includes(q);
          const matchComp = iss.component?.toLowerCase().includes(q);
          const matchCode = iss.code?.toLowerCase().includes(q);
          const matchDept = iss.department?.toLowerCase().includes(q);
          if (
            !matchEmpName &&
            !matchEmpId &&
            !matchMsg &&
            !matchCat &&
            !matchComp &&
            !matchCode &&
            !matchDept
          ) {
            return false;
          }
        }

        // Severity filter
        if (filterHook.filters.selectedSeverity !== "all") {
          const s = (iss.severity || "warning").toLowerCase();
          if (filterHook.filters.selectedSeverity === "error") {
            if (s !== "error" && s !== "critical" && s !== "fatal") return false;
          } else if (filterHook.filters.selectedSeverity === "warning") {
            if (s !== "warning" && s !== "advisory") return false;
          } else if (filterHook.filters.selectedSeverity === "info") {
            if (s !== "info") return false;
          }
        }

        // Category filter
        if (filterHook.filters.selectedCategory !== "all") {
          if (iss.category !== filterHook.filters.selectedCategory) {
            return false;
          }
        }

        // Department filter
        if (filterHook.filters.selectedDepartment !== "all") {
          if (iss.department !== filterHook.filters.selectedDepartment) {
            return false;
          }
        }

        // Status filter
        if (filterHook.filters.selectedStatus !== "all") {
          const isResolved = Boolean(iss.resolved || iss.status === "resolved");
          if (filterHook.filters.selectedStatus === "resolved" && !isResolved) return false;
          if (filterHook.filters.selectedStatus === "open" && isResolved) return false;
        }

        // Blocking filter
        if (hasBlockingInfoFlag && filterHook.filters.selectedBlocking !== "all") {
          const isBlocking = Boolean(iss.blocking);
          if (filterHook.filters.selectedBlocking === "blocking" && !isBlocking) return false;
          if (filterHook.filters.selectedBlocking === "non_blocking" && isBlocking) return false;
        }

        return true;
      }) || []
    : [];

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredIssues.length / filterHook.filters.pageSize));
  const paginatedIssues = filteredIssues.slice(
    (filterHook.filters.currentPage - 1) * filterHook.filters.pageSize,
    filterHook.filters.currentPage * filterHook.filters.pageSize
  );

  return {
    // Run context
    runId: core.runId,
    navigate: core.navigate,
    ws: core.ws,
    canViewPayroll: core.canViewPayroll,
    canRunPayroll: core.canRunPayroll,
    isHr: core.isHr,

    // Validation data
    validationData: core.validationData,

    // Issues
    issues: core.validationData?.issues || [],
    filteredIssues,
    paginatedIssues,
    totalPages: Math.max(1, Math.ceil(filteredIssues.length / filterHook.filters.pageSize)),
    availableCategories,
    availableDepartments,
    hasBlockingInfo: core.validationData?.issues?.some((iss) => iss.blocking !== undefined) ?? false,
    hasStatusInfo: core.validationData?.issues?.some((iss) => iss.status || iss.resolved !== undefined) ?? false,

    // Filters & pagination
    filters: filterHook.filters,

    // UI State
    isLoading: core.isLoading,
    isRefreshing: core.isRefreshing,
    apiError: core.apiError,
    isUnavailable: core.isUnavailable,
    revalidateModalOpen: filterHook.revalidateModalOpen,
    isValidating: filterHook.isValidating,
    recalculateModalOpen: filterHook.recalculateModalOpen,
    isRecalculating: filterHook.isRecalculating,
    selectedIssue: filterHook.selectedIssue,
    issueSheetOpen: filterHook.issueSheetOpen,

    // Actions
    fetchValidationData: core.fetchValidationData,
    handleRefresh: core.handleRefresh,
    handleTriggerRevalidation: actions.handleTriggerRevalidation,
    handleTriggerRecalculate: actions.handleTriggerRecalculate,
    setRevalidateModalOpen: filterHook.setRevalidateModalOpen,
    setRecalculateModalOpen: filterHook.setRecalculateModalOpen,
    setSelectedIssue: filterHook.setSelectedIssue,
    setIssueSheetOpen: filterHook.setIssueSheetOpen,
    setSearchQuery: filterHook.setSearchQuery,
    setSelectedSeverity: filterHook.setSelectedSeverity,
    setSelectedCategory: filterHook.setSelectedCategory,
    setSelectedDepartment: filterHook.setSelectedDepartment,
    setSelectedStatus: filterHook.setSelectedStatus,
    setSelectedBlocking: filterHook.setSelectedBlocking,
    setCurrentPage: filterHook.setCurrentPage,
    setPageSize: filterHook.setPageSize,
    clearSearch: filterHook.clearSearch,
    clearAllFilters: filterHook.clearAllFilters,
  };
}

// Re-export sub-hooks
export { usePayrollValidationCore } from "./usePayrollValidationCore";
export { usePayrollValidationFilters } from "./usePayrollValidationFilters";
export { usePayrollValidationActions } from "./usePayrollValidationActions";