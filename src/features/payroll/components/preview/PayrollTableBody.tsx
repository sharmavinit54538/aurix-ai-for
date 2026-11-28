import { Eye, FileSpreadsheet, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
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
  const displayName = employee.name && employee.name !== "Employee" ? employee.name : "Employee unavailable";
  const displayCode = employee.employeeCode || "Not available";
  const displayDepartment = employee.department || "Not assigned";
  const displayDesignation = employee.designation || "—";
  const displayGrossEarnings = employee.grossEarnings !== null && employee.grossEarnings !== undefined
    ? formatINR(employee.grossEarnings)
    : "—";
  const displayTotalDeductions = employee.totalDeductions !== null && employee.totalDeductions !== undefined
    ? formatINR(employee.totalDeductions)
    : "—";
  const displayNetPay = employee.netPay !== null && employee.netPay !== undefined
    ? formatINR(employee.netPay)
    : "—";

  return (
    <TableRow className="text-sm">
      <TableCell className="font-medium text-foreground">
        <div className="min-w-0">
          <div className="truncate max-w-[180px] sm:max-w-none">{displayName}</div>
          <div className="text-xs text-muted-foreground">
            {displayDesignation !== "—" ? displayDesignation : displayDepartment}
          </div>
        </div>
      </TableCell>
      <TableCell className="hidden lg:table-cell font-mono text-xs text-muted-foreground">
        {displayCode}
      </TableCell>
      <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
        {displayDepartment}
      </TableCell>
      <TableCell className="hidden md:table-cell text-right font-mono text-xs">
        {displayGrossEarnings}
      </TableCell>
      <TableCell className="hidden lg:table-cell text-right font-mono text-xs text-rose-700 dark:text-rose-300">
        {displayTotalDeductions}
      </TableCell>
      <TableCell className="text-right font-mono text-sm font-semibold text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
        {displayNetPay}
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={`text-xs font-medium ${vBadge.className}`}
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
          className="h-8 text-[13px] text-primary hover:text-primary gap-1"
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