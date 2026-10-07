import { usePayrollPreviewCore } from "./usePayrollPreviewCore";
import { usePayrollEmployees } from "./usePayrollEmployees";
import { usePayrollPreviewFilters } from "./usePayrollPreviewFilters";
import { usePayrollPreviewActions } from "./usePayrollPreviewActions";

export function usePayrollPreview() {
  // Core data fetching
  const core = usePayrollPreviewCore();

  // Filter state
  const filterHook = usePayrollPreviewFilters();

  // Employee data fetching
  const employeesHook = usePayrollEmployees(
    core.runId,
    core.isUnavailable,
    filterHook.filters,
    filterHook.setFilters
  );

  // Actions
  const actions = usePayrollPreviewActions(
    core.runId,
    core.previewData,
    employeesHook.setSelectedEmployee,
    employeesHook.setDetailSheetOpen,
    employeesHook.setLoadingDetail,
    employeesHook.setRecalculateModalOpen,
    employeesHook.setIsRecalculating
  );

  // Combine all state and actions
  return {
    // Run context
    runId: core.runId,
    navigate: core.navigate,
    ws: core.ws,
    canViewPayroll: core.canViewPayroll,
    canRunPayroll: core.canRunPayroll,
    isHr: core.isHr,

    // Preview data
    previewData: core.previewData,
    statusTone: core.statusTone,

    // Employees
    employees: employeesHook.employees,
    totalEmployees: employeesHook.totalEmployees,
    totalPages: employeesHook.totalPages,
    availableDepartments: employeesHook.availableDepartments,

    // Filters & pagination
    filters: filterHook.filters,

    // UI State
    loadingPreview: core.loadingPreview,
    loadingEmployees: employeesHook.loadingEmployees,
    isRefreshing: core.isRefreshing,
    apiError: core.apiError,
    employeesError: employeesHook.employeesError,
    isUnavailable: core.isUnavailable,
    selectedEmployee: employeesHook.selectedEmployee,
    detailSheetOpen: employeesHook.detailSheetOpen,
    loadingDetail: employeesHook.loadingDetail,
    recalculateModalOpen: employeesHook.recalculateModalOpen,
    isRecalculating: employeesHook.isRecalculating,

    // Actions
    fetchPreviewSummary: core.fetchPreviewSummary,
    fetchEmployeesList: employeesHook.fetchEmployeesList,
    handleRefresh: core.handleRefresh,
    handleViewEmployeeDetail: actions.handleViewEmployeeDetail,
    handleConfirmRecalculate: actions.handleConfirmRecalculate,
    handleSort: filterHook.handleSort,
    setSearchQuery: filterHook.setSearchQuery,
    setSelectedDept: filterHook.setSelectedDept,
    setSelectedValidation: filterHook.setSelectedValidation,
    setCurrentPage: filterHook.setCurrentPage,
    setPageSize: filterHook.setPageSize,
    clearSearch: filterHook.clearSearch,
    setDetailSheetOpen: employeesHook.setDetailSheetOpen,
    setRecalculateModalOpen: employeesHook.setRecalculateModalOpen,
    onRetry: employeesHook.fetchEmployeesList,
  };
}

// Re-export the sub-hooks for direct use if needed
export { usePayrollPreviewCore } from "./usePayrollPreviewCore";
export { usePayrollEmployees } from "./usePayrollEmployees";
export { usePayrollPreviewFilters } from "./usePayrollPreviewFilters";
export { usePayrollPreviewActions } from "./usePayrollPreviewActions";