import { usePayrollPreview } from "@/features/payroll/hooks/usePayrollPreview";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard, Skeleton } from "@/components/hrms/Shared";
import {
  PayrollSubNavigation,
  PayrollPageHeader,
  ProvisionalPayrollNotice,
  PayrollSummaryCards,
} from "@/features/payroll/components/preview";
import { PayrollValidationPanel } from "@/features/payroll/components/preview/PayrollValidationPanel";
import { WorkflowActionNotice } from "@/features/payroll/components/preview/WorkflowActionNotice";
import { PayrollEmployeeTable } from "@/features/payroll/components/preview/PayrollEmployeeTable";
import { EmployeeDetailSheet } from "@/features/payroll/components/preview/EmployeeDetailSheet";
import { RecalculateDialog } from "@/features/payroll/components/preview/RecalculateDialog";

export function PayrollPreviewPage() {
  const {
    runId,
    navigate,
    ws,
    canViewPayroll,
    canRunPayroll,
    previewData,
    statusTone,
    employees,
    totalEmployees,
    totalPages,
    availableDepartments,
    filters,
    loadingPreview,
    loadingEmployees,
    isRefreshing,
    apiError,
    employeesError,
    isUnavailable,
    selectedEmployee,
    detailSheetOpen,
    loadingDetail,
    recalculateModalOpen,
    isRecalculating,
    handleRefresh,
    handleViewEmployeeDetail,
    handleConfirmRecalculate,
    handleSort,
    setSearchQuery,
    setSelectedDept,
    setSelectedValidation,
    setCurrentPage,
    setPageSize,
    setDetailSheetOpen,
    setRecalculateModalOpen,
    onRetry,
  } = usePayrollPreview();

  // Permission Guard
  if (ws.isRestoring) {
    return (
      <div className="space-y-6 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-64 rounded-xl bg-muted" />
          <div className="h-32 w-full rounded-2xl bg-muted" />
          <div className="h-64 w-full rounded-2xl bg-muted" />
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
            You do not have permission to view Payroll Preview. Please contact your system administrator for access.
          </p>
<Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: "/dashboard/payroll" as any })}
              className="gap-1.5 text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
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
          <h2 className="font-display text-xl font-bold text-foreground mb-2">Invalid Payroll Run Identifier</h2>
          <p className="text-muted-foreground mb-6">
            No payroll run ID was provided in the route parameters. Please start a payroll run from the dashboard or select an existing run.
          </p>
          <div className="flex justify-center gap-3">
            <Button
              onClick={() => navigate({ to: "/dashboard/payroll" as any })}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90"
            >
              <ArrowLeft className="h-4 w-4" />
              Go to Payroll Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <PayrollSubNavigation runId={runId} />

      <PayrollPageHeader
        runId={runId}
        previewData={previewData}
        statusTone={statusTone}
        canRunPayroll={canRunPayroll}
        onNavigateToValidation={() => navigate({ to: `/dashboard/payroll/runs/${runId}/validation` as any })}
        onNavigateToApproval={() => navigate({ to: `/dashboard/payroll/runs/${runId}/approval` as any })}
        onRecalculate={() => setRecalculateModalOpen(true)}
      />

      <ProvisionalPayrollNotice />

      {loadingPreview ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full rounded-2xl" />
          ))}
        </div>
      ) : isUnavailable || apiError ? (
        <GlassCard className="p-6 border-destructive/30 bg-destructive/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              <div>
                <h2 className="font-display text-sm font-semibold text-foreground">
                  Unable to Load Payroll Preview
                </h2>
                <p className="text-xs text-muted-foreground mt-1">
                  {apiError || "Payroll preview data is currently unavailable."}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gap-1.5 shrink-0"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
              <span>Retry</span>
            </Button>
          </div>
        </GlassCard>
      ) : (
        <>
          {previewData ? <PayrollSummaryCards previewData={previewData} /> : null}
          <PayrollValidationPanel
            previewData={previewData}
            runId={runId}
            onNavigateToValidation={() => navigate({ to: `/dashboard/payroll/runs/${runId}/validation` as any })}
          />
        </>
      )}

      <PayrollEmployeeTable
        employees={employees}
        totalEmployees={totalEmployees}
        totalPages={totalPages}
        currentPage={filters.currentPage}
        pageSize={filters.pageSize}
        loadingEmployees={loadingEmployees}
        employeesError={employeesError}
        searchQuery={filters.searchQuery}
        selectedDept={filters.selectedDept}
        selectedValidation={filters.selectedValidation}
        sortBy={filters.sortBy}
        sortDir={filters.sortDir}
        availableDepartments={availableDepartments}
        onSearchChange={setSearchQuery}
        onDeptChange={setSelectedDept}
        onValidationChange={setSelectedValidation}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onSort={handleSort}
        onViewDetail={handleViewEmployeeDetail}
        onRetry={onRetry}
      />

      <WorkflowActionNotice runId={runId} />

      <EmployeeDetailSheet
        employee={selectedEmployee}
        open={detailSheetOpen}
        onClose={() => setDetailSheetOpen(false)}
        loading={loadingDetail}
        runId={runId}
        onOpenFullDetail={(emp) => {
          setDetailSheetOpen(false);
          navigate({ to: `/dashboard/payroll/runs/${runId}/employees/${emp.employeeId || emp.id}` as any });
        }}
      />

      <RecalculateDialog
        open={recalculateModalOpen}
        onClose={() => setRecalculateModalOpen(false)}
        runId={runId}
        previewData={previewData}
        isRecalculating={isRecalculating}
        onConfirm={handleConfirmRecalculate}
      />
    </div>
  );
}

export default PayrollPreviewPage;