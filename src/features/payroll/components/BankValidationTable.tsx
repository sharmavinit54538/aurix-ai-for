import React, { useState } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BankValidationIssue } from "../types/payment";

export interface BankValidationTableProps {
  issues: BankValidationIssue[];
  isValidating?: boolean;
  onRevalidate?: () => void;
  className?: string;
}

export function BankValidationTable({
  issues,
  isValidating = false,
  onRevalidate,
  className,
}: BankValidationTableProps) {
  const [filterSeverity, setFilterSeverity] = useState<"all" | "error" | "warning">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIssues = issues.filter((iss) => {
    if (filterSeverity !== "all" && iss.severity !== filterSeverity) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        iss.employeeName.toLowerCase().includes(q) ||
        iss.employeeCode.toLowerCase().includes(q) ||
        iss.code.toLowerCase().includes(q) ||
        iss.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const blockingCount = issues.filter((i) => i.blocking).length;

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-background/80 backdrop-blur-xl shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Header with stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border/70 p-4 gap-4">
        <div>
          <h3 className="text-base font-semibold tracking-tight">Bank Details & IFSC Validation</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Authoritative RBI master validation and disbursement sanity checks
          </p>
        </div>

        <div className="flex items-center gap-2">
          {blockingCount > 0 ? (
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500/15 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-300 ring-1 ring-rose-500/30">
              <AlertCircle className="h-4 w-4" />
              <span>{blockingCount} Blocking Issue{blockingCount > 1 ? "s" : ""}</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-300 ring-1 ring-emerald-500/30">
              <CheckCircle2 className="h-4 w-4" />
              <span>Zero Blocking Errors</span>
            </div>
          )}

          {onRevalidate && (
            <Button
              variant="outline"
              size="sm"
              disabled={isValidating}
              onClick={onRevalidate}
              className="rounded-xl text-xs"
            >
              {isValidating ? "Validating..." : "Revalidate"}
            </Button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-border/60 bg-muted/20 p-3 gap-3">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <Button
            size="sm"
            variant={filterSeverity === "all" ? "default" : "ghost"}
            onClick={() => setFilterSeverity("all")}
            className="rounded-lg text-xs h-8"
          >
            All ({issues.length})
          </Button>
          <Button
            size="sm"
            variant={filterSeverity === "error" ? "destructive" : "ghost"}
            onClick={() => setFilterSeverity("error")}
            className="rounded-lg text-xs h-8"
          >
            Errors ({errorCount})
          </Button>
          <Button
            size="sm"
            variant={filterSeverity === "warning" ? "secondary" : "ghost"}
            onClick={() => setFilterSeverity("warning")}
            className="rounded-lg text-xs h-8"
          >
            Warnings ({warningCount})
          </Button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            id="bank-validation-search"
            type="search"
            placeholder="Search employee or error..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-8 rounded-lg text-xs"
          />
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/40 text-muted-foreground border-b border-border/60 uppercase tracking-wider text-[11px] font-semibold">
            <tr>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Target Field</th>
              <th className="px-4 py-3">Issue Code</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Action Required</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {filteredIssues.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500/80 mb-2" />
                    <p className="font-medium text-foreground">No bank validation issues found</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      All employee account numbers and IFSC codes adhere to banking standards.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredIssues.map((iss) => (
                <tr
                  key={iss.id}
                  className={cn(
                    "hover:bg-muted/40 transition-colors",
                    iss.blocking && "bg-rose-500/5 dark:bg-rose-500/10"
                  )}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    {iss.severity === "error" ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/15 px-2 py-0.5 font-medium text-rose-600 dark:text-rose-400">
                        <AlertCircle className="h-3 w-3" />
                        Error {iss.blocking && "• Blocking"}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 font-medium text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="h-3 w-3" />
                        Warning
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{iss.employeeName}</div>
                    <div className="text-[11px] text-muted-foreground">{iss.employeeCode}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-[11px]">{iss.field}</td>
                  <td className="px-4 py-3 font-mono text-[11px] text-muted-foreground">
                    {iss.code}
                  </td>
                  <td className="px-4 py-3 text-foreground/90 max-w-xs">{iss.message}</td>
                  <td className="px-4 py-3 text-muted-foreground text-[11px]">
                    {iss.suggestedAction || "Review employee profile"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
