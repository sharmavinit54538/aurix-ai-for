import { CheckCircle2, FileText, RefreshCw, UserCheck, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { OnboardingDetailsPanel } from "@/features/admin/recruitment/components/onboarding/OnboardingDetailsPanel";
import { OnboardingEmployeeList } from "@/features/admin/recruitment/components/onboarding/OnboardingEmployeeList";
import { OnboardingFiltersBar } from "@/features/admin/recruitment/components/onboarding/OnboardingFiltersBar";
import { useAdminOnboarding } from "@/features/admin/recruitment/hooks/useAdminOnboarding";

export function OnboardingPage() {
  const {
    filters,
    setFilters,
    employees,
    listLoading,
    listError,
    selectedEmployeeId,
    setSelectedEmployeeId,
    selectedEmployee,
    details,
    detailsLoading,
    detailsError,
    actionDocumentId,
    departments,
    currentSteps,
    stats,
    retryList,
    retryDetails,
    verifyDocument,
  } = useAdminOnboarding();

  return (
    <>
      <PageHeader
        title="Employee Onboarding"
        description="Review onboarding progress, verify documents, and track completion across your workforce."
        actions={
          <Button variant="outline" onClick={() => void retryList()} disabled={listLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${listLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { k: "In Onboarding", v: stats.total, icon: UserPlus },
          { k: "Completed", v: stats.completed, icon: CheckCircle2 },
          { k: "Avg Completion", v: `${stats.avgCompletion}%`, icon: UserCheck },
          { k: "Pending Documents", v: stats.pendingDocs, icon: FileText },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.k}
              className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{stat.k}</span>
                <Icon className="h-4 w-4" />
              </div>
              <div className="mt-2 font-display text-2xl font-semibold">{stat.v}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <OnboardingFiltersBar
          filters={filters}
          departments={departments}
          currentSteps={currentSteps}
          onChange={setFilters}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-[320px_1fr]">
        <OnboardingEmployeeList
          employees={employees}
          loading={listLoading}
          error={listError}
          selectedEmployeeId={selectedEmployeeId}
          onSelect={setSelectedEmployeeId}
          onRetry={() => void retryList()}
        />

        <OnboardingDetailsPanel
          employee={selectedEmployee}
          details={details}
          loading={detailsLoading}
          error={detailsError}
          actionDocumentId={actionDocumentId}
          onRetry={retryDetails}
          onVerifyDocument={verifyDocument}
        />
      </div>
    </>
  );
}
