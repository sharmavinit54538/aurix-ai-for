import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCheck,
  Info,
  Layers,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/hrms/Shared";
import { renderSeverityBadge, formatDate } from "../../utils/payrollValidation.utils";
import type { PayrollValidationIssue } from "@/services/payrollApi";

interface ValidationIssueTableProps {
  paginatedIssues: any[];
  totalPages: number;
  currentPage: number;
  pageSize: number;
  filteredIssuesCount: number;
  runId: string;
  onPageChange: (page: number) => void;
  onViewIssue: (issue: any) => void;
  onViewPayroll: (employeeId: string) => void;
}

export function ValidationIssueTable({
  paginatedIssues,
  totalPages,
  currentPage,
  pageSize,
  filteredIssuesCount,
  runId,
  onPageChange,
  onViewIssue,
  onViewPayroll,
}: ValidationIssueTableProps) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40 text-xs">
            <TableHead className="w-24">Severity</TableHead>
            <TableHead>Employee</TableHead>
            <TableHead>Issue Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Component</TableHead>
            <TableHead>Blocking</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedIssues.length > 0 ? (
            paginatedIssues.map((iss) => {
              return (
                <TableRow
                  key={iss.id}
                  className="text-xs hover:bg-muted/30 cursor-pointer"
                  onClick={() => onViewIssue(iss)}
                >
                  <TableCell>{renderSeverityBadge(iss.severity)}</TableCell>

                  <TableCell className="font-medium text-foreground">
                    {iss.employeeName || iss.employeeId ? (
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span>{iss.employeeName || "—"}</span>
                          {iss.department ? (
                            <Badge
                              variant="outline"
                              className="text-[9px] bg-muted/40 font-normal px-1.5 py-0"
                            >
                              {iss.department}
                            </Badge>
                          ) : null}
                        </div>
                        {iss.employeeId ? (
                          <div className="font-mono text-[10px] text-muted-foreground">
                            {iss.employeeId}
                          </div>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic">Run-Level Check</span>
                    )}
                  </TableCell>

                  <TableCell className="max-w-md">
                    <div className="line-clamp-2 text-foreground font-normal leading-relaxed">
                      {iss.message}
                    </div>
                    {iss.code ? (
                      <div className="font-mono text-[9px] text-muted-foreground mt-0.5">
                        Rule: {iss.code}
                      </div>
                    ) : null}
                  </TableCell>

                  <TableCell>
                    <Badge
                      variant="outline"
                      className="text-[10px] bg-muted/40 font-normal"
                    >
                      {iss.category || "General"}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-muted-foreground">
                    {iss.component || "—"}
                  </TableCell>

                  <TableCell>
                    {iss.blocking !== undefined ? (
                      iss.blocking ? (
                        <Badge
                          variant="outline"
                          className="text-[9px] border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-semibold"
                        >
                          Blocking
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-[9px] border-border bg-muted/40 text-muted-foreground"
                        >
                          Non-blocking
                        </Badge>
                      )
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    {iss.employeeId ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          onViewPayroll(iss.employeeId)
                        }
                        className="h-7 text-xs text-primary hover:text-primary gap-1"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>View Payroll</span>
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Issue detail is opened by row click
                        }}
                        className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
                      >
                        <Info className="h-3.5 w-3.5" />
                        <span>Details</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="py-14 text-center">
                <div className="mx-auto max-w-sm space-y-3">
                  <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-foreground">
                      All Payroll Validations Passed
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      Zero validation issues were detected by the backend payroll engine for
                      this run. All salary, statutory, and attendance checks conform to
                      policy rules.
                    </p>
                  </div>
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Navigate handled by parent
                      }}
                      className="text-xs"
                    >
                      Return to Payroll Preview
                    </Button>
                  </div>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {totalPages > 1 ? (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-3 text-xs text-muted-foreground">
          <div>
            Page <strong className="text-foreground">{currentPage}</strong> of{" "}
            <strong className="text-foreground">{totalPages}</strong> ({filteredIssuesCount}{" "}
            total issues)
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="h-8 px-2 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="h-8 px-2 text-xs"
            >
              <span>Next</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
