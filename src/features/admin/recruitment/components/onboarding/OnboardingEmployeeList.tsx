import { AlertCircle, Loader2, RefreshCw, UserPlus } from "lucide-react";
import { CandidateAvatar } from "@/features/admin/recruitment/components/Bits";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { OnboardingProgressItem } from "@/services/employeeOnboardingApi";
import { formatCurrentStep, formatStatusLabel, statusBadgeClass } from "../../utils/onboardingDisplay";

interface OnboardingEmployeeListProps {
  employees: OnboardingProgressItem[];
  loading: boolean;
  error: string | null;
  selectedEmployeeId: string | null;
  onSelect: (employeeId: string) => void;
  onRetry: () => void;
}

const listAsideClass =
  "rounded-2xl border border-border bg-card/60 backdrop-blur-xl lg:sticky lg:top-4 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto";

export function OnboardingEmployeeList({
  employees,
  loading,
  error,
  selectedEmployeeId,
  onSelect,
  onRetry,
}: OnboardingEmployeeListProps) {
  if (loading) {
    return (
      <aside className={`space-y-2 p-3 ${listAsideClass}`}>
        <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading employees...
        </div>
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className="h-20 w-full rounded-lg" />
        ))}
      </aside>
    );
  }

  if (error) {
    return (
      <aside className={`flex flex-col items-center justify-center p-6 text-center ${listAsideClass}`}>
        <AlertCircle className="mb-3 h-8 w-8 text-destructive" />
        <p className="text-sm font-medium text-destructive">Failed to load employees</p>
        <p className="mt-1 text-xs text-muted-foreground">{error}</p>
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-4">
          <RefreshCw className="mr-2 h-3.5 w-3.5" />
          Retry
        </Button>
      </aside>
    );
  }

  if (employees.length === 0) {
    return (
      <aside className={`flex flex-col items-center justify-center p-8 text-center ${listAsideClass}`}>
        <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-muted text-muted-foreground">
          <UserPlus className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium">No onboarding records found</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Adjust filters or check back when employees begin onboarding.
        </p>
      </aside>
    );
  }

  return (
    <aside className={`space-y-1.5 p-2 ${listAsideClass}`}>
      {employees.map((employee) => {
        const isActive = employee.employee_id === selectedEmployeeId;
        const missingCount = employee.missing_documents?.length ?? 0;
        return (
          <button
            key={employee.employee_id}
            type="button"
            onClick={() => onSelect(employee.employee_id)}
            className={`w-full rounded-lg p-2 text-left transition-colors ${
              isActive ? "bg-accent" : "hover:bg-accent/50"
            }`}
          >
            <div className="flex items-start gap-2">
              <CandidateAvatar name={employee.name} size={32} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div className="truncate text-sm font-medium">{employee.name}</div>
                  <span
                    className={`inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium ring-1 ${statusBadgeClass(employee.status)}`}
                  >
                    {formatStatusLabel(employee.status)}
                  </span>
                </div>
                <div className="truncate text-[10px] text-muted-foreground">
                  {employee.department} · {employee.designation}
                </div>
                {employee.employee_code ? (
                  <div className="truncate text-[10px] text-muted-foreground">
                    {employee.employee_code}
                  </div>
                ) : null}
                <div className="mt-1 truncate text-[10px] text-muted-foreground">
                  {formatCurrentStep(employee.current_step)}
                </div>
                {missingCount > 0 ? (
                  <div className="mt-1 text-[10px] text-amber-600 dark:text-amber-400">
                    {missingCount} pending document{missingCount === 1 ? "" : "s"}
                  </div>
                ) : null}
              </div>
              <span className="text-[10px] font-semibold">
                {employee.completion_percentage ?? 0}%
              </span>
            </div>
            <Progress value={employee.completion_percentage ?? 0} className="mt-2 h-1" />
          </button>
        );
      })}
    </aside>
  );
}
