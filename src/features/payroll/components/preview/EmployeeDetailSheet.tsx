import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Skeleton } from "@/components/hrms/Shared";
import { formatINR, getValidationBadge, formatDate } from "../../utils/payrollPreview.utils";
import type { PayrollPreviewEmployee } from "@/services/payrollApi";
import { EmployeeNetPayCard } from "./EmployeeNetPayCard";
import { EmployeeAttendanceCard } from "./EmployeeAttendanceCard";
import { EmployeeEarningsCard } from "./EmployeeEarningsCard";
import { EmployeeDeductionsCard } from "./EmployeeDeductionsCard";
import { EmployeeIssuesCard } from "./EmployeeIssuesCard";

export function EmployeeDetailSheet({
  employee,
  open,
  onClose,
  loading,
  runId,
  onOpenFullDetail,
}: {
  employee: PayrollPreviewEmployee | null;
  open: boolean;
  onClose: () => void;
  loading: boolean;
  runId: string;
  onOpenFullDetail: (employee: PayrollPreviewEmployee) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-6">
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="font-display text-lg font-bold text-foreground">
                {employee?.name || "Employee Payroll Detail"}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                ID: <span className="font-mono">{employee?.employeeId}</span>
                {employee?.department ? ` • ${employee.department}` : ""}
                {employee?.designation ? ` • ${employee.designation}` : ""}
              </SheetDescription>
            </div>
            {employee?.validationStatus ? (
              <Badge
                variant="outline"
                className={`text-xs ${getValidationBadge(employee.validationStatus).className}`}
              >
                {getValidationBadge(employee.validationStatus).label}
              </Badge>
            ) : null}
          </div>
        </SheetHeader>

        {employee ? (
          <div className="mt-4">
            <Button
              size="sm"
              onClick={() => {
                onClose();
                onOpenFullDetail(employee);
              }}
              className="w-full gap-1.5 text-xs shadow-sm"
              style={{ background: "var(--gradient-brand)" }}
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Open Dedicated Employee Payroll Page</span>
            </Button>
          </div>
        ) : null}

        {loading ? (
          <div className="space-y-4 py-6">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : employee ? (
          <div className="mt-6 space-y-6 text-xs">
            <EmployeeNetPayCard employee={employee} />
            {employee.attendance && <EmployeeAttendanceCard attendance={employee.attendance} />}
            {employee.earnings && <EmployeeEarningsCard earnings={employee.earnings} grossEarnings={employee.grossEarnings} />}
            {employee.deductions && <EmployeeDeductionsCard deductions={employee.deductions} totalDeductions={employee.totalDeductions} />}
            {employee.issues && employee.issues.length > 0 && <EmployeeIssuesCard issues={employee.issues} />}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}