import { usePayrollValidation } from "@/features/payroll/hooks/usePayrollValidation";
import {
  ValidationSubNavigation,
  ValidationPageHeader,
  ProvisionalValidationNotice,
  ValidationSummaryCards,
} from "@/features/payroll/components/validation/ValidationHeader";
import { ValidationFilters } from "@/features/payroll/components/validation/ValidationFilters";
import { ValidationIssueTable } from "@/features/payroll/components/validation/ValidationIssueTable";
import { ValidationIssueSheet } from "@/features/payroll/components/validation/ValidationIssueSheet";
import { RevalidateDialog } from "@/features/payroll/components/validation/RevalidateDialog";
import { RecalculateDialog } from "@/features/payroll/components/validation/RecalculateDialog";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getValidationStatusBadge } from "@/features/payroll/utils/payrollValidation.utils";

export function PayrollValidationPage() {
  const {
    runId,
    navigate,
    ws,
    canViewPayroll,
    canRunPayroll,
    isHr,
    validationData,
    issues,
    filteredIssues,
    paginatedIssues,
    totalPages,
    availableCategories,
    availableDepartments,
    hasBlockingInfo,
    hasStatusInfo,
    filters,
    isLoading,
    isRefreshing,
    apiError,
    isUnavailable,
    revalidateModalOpen,
    isValidating,
    recalculateModalOpen,
    isRecalculating,
    selectedIssue,
    issueSheetOpen,
    handleRefresh,
    handleTriggerRevalidation,
    handleTriggerRecalculate,
    setRevalidateModalOpen,
    setRecalculateModalOpen,
    setSelectedIssue,
    setIssueSheetOpen,
    setSearchQuery,
    setSelectedSeverity,
    setSelectedCategory,
    setSelectedDepartment,
    setSelectedStatus,
    setSelectedBlocking,
    setCurrentPage,
    setPageSize,
    clearSearch,
    clearAllFilters,
  } = usePayrollValidation();

  const statusBadge = getValidationStatusBadge(validationData?.status);

  // Permission Guard
  if (ws.isRestoring) {
    return (
      <div className="space-y-6 py-6 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-64 rounded-xl bg-muted" />
          <div className="h-32 w-full rounded-2xl bg-muted" />
          <div className="h-96 w-full rounded-2xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!canViewPayroll) {
    return (
      <div className="mx-auto max-w-4xl py-12">
        <div className="text-center">
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Access Restricted</h2>
          <p className="text-muted-foreground mb-6">
            You do not have permission to view payroll validation findings. Please contact your system administrator.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate({ to: "/dashboard/payroll" as any })}
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Back to Payroll Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!runId) {
    return (
      <div className="mx-auto max-w-2xl py-12">
        <div className="text-center">
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Missing Payroll Run Identifier</h2>
          <p className="text-muted-foreground mb-6">
            No payroll run ID was provided in the route parameters. Please select a payroll run.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: "/dashboard/payroll" as any })}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-16">
      <ValidationSubNavigation runId={runId} />

      <ValidationPageHeader
        runId={runId}
        validationData={validationData}
        statusBadge={statusBadge}
        canRunPayroll={canRunPayroll}
        onNavigateToPreview={() => navigate({ to: `/dashboard/payroll/runs/${runId}/preview` as any })}
        onNavigateToApproval={() => navigate({ to: `/dashboard/payroll/runs/${runId}/approval` as any })}
        onRecalculate={() => setRecalculateModalOpen(true)}
        onRevalidate={() => setRevalidateModalOpen(true)}
      />

      <ProvisionalValidationNotice />

      <ValidationSummaryCards
        validationData={validationData}
        statusBadge={statusBadge}
      />

      <ValidationFilters
        searchQuery={filters.searchQuery}
        selectedSeverity={filters.selectedSeverity}
        selectedCategory={filters.selectedCategory}
        selectedDepartment={filters.selectedDepartment}
        selectedStatus={filters.selectedStatus}
        selectedBlocking={filters.selectedBlocking}
        pageSize={filters.pageSize}
        availableCategories={availableCategories}
        availableDepartments={availableDepartments}
        hasStatusInfo={hasStatusInfo}
        hasBlockingInfo={hasBlockingInfo}
        onSearchChange={setSearchQuery}
        onSeverityChange={setSelectedSeverity as any}
        onCategoryChange={setSelectedCategory}
        onDepartmentChange={setSelectedDepartment}
        onStatusChange={setSelectedStatus as any}
        onBlockingChange={setSelectedBlocking as any}
        onPageSizeChange={setPageSize}
        onClearSearch={clearSearch}
      />

      <ValidationIssueTable
        paginatedIssues={paginatedIssues}
        totalPages={totalPages}
        currentPage={filters.currentPage}
        pageSize={filters.pageSize}
        filteredIssuesCount={filteredIssues.length}
        runId={runId}
        loadingEmployees={isLoading}
        employeesError={apiError}
        onPageChange={setCurrentPage}
        onViewIssue={setSelectedIssue}
        onViewPayroll={(employeeId) => {
          setIssueSheetOpen(false);
          navigate({ to: `/dashboard/payroll/runs/${runId}/employees/${employeeId}` as any });
        }}
        onRetry={handleRefresh}
        onReturnToPreview={() => navigate({ to: `/dashboard/payroll/runs/${runId}/preview` as any })}
        onClearFilters={clearAllFilters}
      />

      <ValidationIssueSheet
        issue={selectedIssue}
        open={issueSheetOpen}
        onClose={() => setIssueSheetOpen(false)}
        runId={runId}
        onOpenEmployeePayroll={(employeeId) => {
          setIssueSheetOpen(false);
          navigate({ to: `/dashboard/payroll/runs/${runId}/employees/${employeeId}` as any });
        }}
      />

      <RevalidateDialog
        open={revalidateModalOpen}
        onClose={() => setRevalidateModalOpen(false)}
        runId={runId}
        isValidating={isValidating}
        onConfirm={handleTriggerRevalidation}
      />

      <RecalculateDialog
        open={recalculateModalOpen}
        onClose={() => setRecalculateModalOpen(false)}
        runId={runId}
        isRecalculating={isRecalculating}
        onConfirm={handleTriggerRecalculate}
      />
    </div>
  );
}