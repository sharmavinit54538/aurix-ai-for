import { AlertTriangle, Clock, Eye, FileCheck, Info, Layers, RefreshCw, RotateCcw, Search, ShieldAlert, ShieldCheck, UserCheck, Users, X, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatDate, renderSeverityBadge } from "../../utils/payrollValidation.utils";
import type { PayrollValidationIssue } from "@/services/payrollApi";

interface ValidationIssueSheetProps {
  issue: any | null;
  open: boolean;
  onClose: () => void;
  runId: string;
  onOpenEmployeePayroll: (employeeId: string) => void;
}

export function ValidationIssueSheet({
  issue,
  open,
  onClose,
  runId,
  onOpenEmployeePayroll,
}: ValidationIssueSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto p-6 space-y-6">
        <SheetHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-base font-bold text-foreground">
              Validation Issue Detail
            </SheetTitle>
            {issue ? (
              <Badge
                variant={renderSeverityBadge(issue.severity).variant as any}
                className={renderSeverityBadge(issue.severity).className}
              >
                {renderSeverityBadge(issue.severity).label}
              </Badge>
            ) : null}
          </div>
          <SheetDescription className="text-xs text-muted-foreground">
            Detailed breakdown of the validation finding reported by the payroll engine.
          </SheetDescription>
        </SheetHeader>

        {issue ? (
          <div className="space-y-4 text-xs">
            {/* Message Banner */}
            <div
              className={`rounded-xl border p-3.5 ${
                issue.severity === "error" || issue.severity === "critical"
                  ? "border-rose-500/30 bg-rose-500/10 text-rose-900 dark:text-rose-200"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-900 dark:text-amber-200"
              }`}
            >
              <div className="font-semibold mb-1 flex items-center gap-1.5">
                {issue.severity === "error" || issue.severity === "critical" ? (
                  <XCircle className="h-4 w-4 text-rose-500" />
                ) : (
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                )}
                <span>Finding Statement</span>
              </div>
              <div className="leading-relaxed">{issue.message}</div>
            </div>

            {/* Attributes Grid */}
            <div className="rounded-xl border border-border bg-card/60 p-3.5 space-y-2.5">
              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Category:</span>
                <span className="font-medium text-foreground">
                  {issue.category || "General"}
                </span>
              </div>

              {issue.component ? (
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Affected Component:</span>
                  <span className="font-medium text-foreground">{issue.component}</span>
                </div>
              ) : null}

              {issue.code ? (
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Rule Code:</span>
                  <span className="font-mono text-foreground">{issue.code}</span>
                </div>
              ) : null}

              <div className="flex justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground">Blocking Status:</span>
                <span className="font-semibold text-foreground">
                  {issue.blocking !== undefined
                    ? issue.blocking
                      ? "Yes — Prevents finalization"
                      : "No — Advisory warning"
                    : "Not specified by backend"}
                </span>
              </div>

              {issue.status || issue.resolved !== undefined ? (
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Issue Status:</span>
                  <span className="font-medium text-foreground capitalize">
                    {issue.status || (issue.resolved ? "Resolved" : "Open")}
                  </span>
                </div>
              ) : null}

              {issue.source ? (
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Reference / Source:</span>
                  <span className="font-mono text-[11px] text-foreground">
                    {issue.source}
                  </span>
                </div>
              ) : null}

              {issue.resolution ? (
                <div className="flex flex-col gap-1 py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Resolution Notes:</span>
                  <span className="text-foreground leading-relaxed">
                    {issue.resolution}
                  </span>
                </div>
              ) : null}

              {issue.detectedAt ? (
                <div className="flex justify-between py-1 border-b border-border/40">
                  <span className="text-muted-foreground">Detected At:</span>
                  <span className="text-foreground">{formatDate(issue.detectedAt)}</span>
                </div>
              ) : null}

              {issue.employeeName || issue.employeeId ? (
                <>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Employee Name:</span>
                    <span className="font-medium text-foreground">
                      {issue.employeeName || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-border/40">
                    <span className="text-muted-foreground">Employee ID:</span>
                    <span className="font-mono text-foreground">
                      {issue.employeeId || "—"}
                    </span>
                  </div>
                  {issue.department ? (
                    <div className="flex justify-between py-1">
                      <span className="text-muted-foreground">Department:</span>
                      <span className="text-foreground">{issue.department}</span>
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>

            {/* Navigation Action */}
            {issue.employeeId ? (
              <div className="pt-2">
                <Button
                  size="sm"
                  onClick={() => {
                    onClose();
                    onOpenEmployeePayroll(issue.employeeId);
                  }}
                  className="w-full gap-1.5 text-xs"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>View Employee Payroll Detail (Step 5)</span>
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
