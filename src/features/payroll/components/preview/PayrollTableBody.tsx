import { Eye, FileSpreadsheet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/hrms/Shared";
import type { PayrollPreviewEmployee } from "@/services/payrollApi";
import { formatINR, getValidationBadge } from "../../utils/payrollPreview.utils";

interface PayrollTableBodyProps {
  employees: PayrollPreviewEmployee[];
  loadingEmployees: boolean;
  employeesError: string | null;
  searchQuery: string;
  selectedDept: string;
  selectedValidation: string;
  pageSize: number;
  onViewDetail: (emp: PayrollPreviewEmployee) => void;
  onRetry: () => void;
}

export function PayrollTableBody({
  employees,
  loadingEmployees,
  employeesError,
  searchQuery,
  selectedDept,
  selectedValidation,
  pageSize,
  onViewDetail,
  onRetry,
}: PayrollTableBodyProps) {
  return (
    <TableBody>
      {loadingEmployees ? (
        Array.from({ length: pageSize }).map((_, i) => (
          <TableRow key={i}>
            <TableCell colSpan={8} className="py-3">
              <Skeleton className="h-5 w-full" />
            </TableCell>
          </TableRow>
        ))
      ) : employees.length > 0 ? (
        employees.map((emp) => (
          <EmployeeTableRow key={emp.id || emp.employeeId} employee={emp} onViewDetail={onViewDetail} />
        ))
      ) : employeesError ? (
        <TableRow>
          <TableCell colSpan={8} className="py-12 text-center">
            <PayrollErrorState error={employeesError} onRetry={onRetry} />
          </TableCell>
        </TableRow>
      ) : (
        <TableRow>
          <TableCell colSpan={8} className="py-12 text-center">
            <PayrollEmptyState
              searchQuery={searchQuery}
              selectedDept={selectedDept}
              selectedValidation={selectedValidation}
            />
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  );
}

function EmployeeTableRow({
  employee,
  onViewDetail,
}: {
  employee: PayrollPreviewEmployee;
  onViewDetail: (emp: PayrollPreviewEmployee) => void;
}) {
  const vBadge = getValidationBadge(employee.validationStatus);
  return (
    <TableRow className="text-xs">
      <TableCell className="font-medium text-foreground">
        <div>
          <div>{employee.name}</div>
          {employee.designation ? (
            <div className="text-[10px] text-muted-foreground">
              {employee.designation}
            </div>
          ) : null}
        </div>
      </TableCell>
      <TableCell className="font-mono text-muted-foreground">
        {employee.employeeId}
      </TableCell>
      <TableCell className="text-muted-foreground">
        {employee.department || "—"}
      </TableCell>
      <TableCell className="text-right font-mono">
        {formatINR(employee.grossEarnings)}
      </TableCell>
      <TableCell className="text-right font-mono text-rose-600 dark:text-rose-400">
        {formatINR(employee.totalDeductions)}
      </TableCell>
      <TableCell className="text-right font-mono font-semibold text-emerald-600 dark:text-emerald-400">
        {formatINR(employee.netPay)}
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={`text-[10px] font-medium ${vBadge.className}`}
        >
          {vBadge.label}
          {employee.issuesCount && employee.issuesCount > 0 ? ` (${employee.issuesCount})` : ""}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onViewDetail(employee)}
          className="h-7 text-xs text-primary hover:text-primary gap-1"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>View</span>
        </Button>
      </TableCell>
    </TableRow>
  );
}

function PayrollErrorState({
  error,
  onRetry,
}: {
  error: string;
  onRetry: () => void;
}) {
  return (
    <div className="mx-auto max-w-sm space-y-3">
      <FileSpreadsheet className="mx-auto h-8 w-8 text-destructive" />
      <div className="font-display text-sm font-semibold text-destructive">
        Failed to load employee records
      </div>
      <p className="text-xs text-muted-foreground">{error}</p>
      <Button
        size="sm"
        variant="outline"
        onClick={onRetry}
        className="h-8 text-xs rounded-xl"
      >
        <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
        Retry
      </Button>
    </div>
  );
}

function PayrollEmptyState({
  searchQuery,
  selectedDept,
  selectedValidation,
}: {
  searchQuery: string;
  selectedDept: string;
  selectedValidation: string;
}) {
  return (
    <div className="mx-auto max-w-sm">
      <FileSpreadsheet className="mx-auto h-8 w-8 text-muted-foreground/60" />
      <div className="mt-2 font-display text-sm font-semibold text-foreground">
        No payroll results available
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {searchQuery || selectedDept !== "all" || selectedValidation !== "all"
          ? "No employee records matched your filter criteria."
          : "Payroll results have not been generated for this run."}
      </p>
    </div>
  );
}