import React, { useState } from "react";
import { AdminPayslipItem } from "@/services/payslipsApi";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Download,
  Printer,
  Mail,
  RefreshCw,
  FileSearch,
  History,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Columns,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";

interface PayslipsTableProps {
  items: AdminPayslipItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  isLoading?: boolean;
  selectedIds: string[];
  onSelectToggle: (id: string) => void;
  onSelectAllToggle: (allIds: string[]) => void;
  onPageChange: (newPage: number) => void;
  onPreview: (payslip: AdminPayslipItem) => void;
  onDownloadPdf: (payslip: AdminPayslipItem) => void;
  onPrint: (payslip: AdminPayslipItem) => void;
  onEmail: (payslip: AdminPayslipItem) => void;
  onRegenerate: (payslip: AdminPayslipItem) => void;
  onViewAuditLogs: (payslip: AdminPayslipItem) => void;
  onDelete: (payslip: AdminPayslipItem) => void;
  onSortChange: (field: string) => void;
  sortField?: string;
  sortDir?: "asc" | "desc";
  canDelete?: boolean;
}

export const PayslipsTable: React.FC<PayslipsTableProps> = ({
  items,
  total,
  page,
  limit,
  totalPages,
  isLoading = false,
  selectedIds,
  onSelectToggle,
  onSelectAllToggle,
  onPageChange,
  onPreview,
  onDownloadPdf,
  onPrint,
  onEmail,
  onRegenerate,
  onViewAuditLogs,
  onDelete,
  onSortChange,
  sortField,
  sortDir,
  canDelete = true,
}) => {
  const [columnVisibility, setColumnVisibility] = useState({
    employee_id: true,
    department: true,
    designation: true,
    period: true,
    gross: true,
    allowances: true,
    deductions: true,
    tax: true,
    net: true,
    status: true,
    email_status: true,
    download_count: true,
  });

  const allSelected = items.length > 0 && items.every((i) => selectedIds.includes(i.id));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getStatusBadge = (item: AdminPayslipItem) => {
    if (item.status === "GENERATED") {
      return (
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[11px] font-medium gap-1">
          <CheckCircle2 className="h-3 w-3" /> Generated
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[11px] font-medium gap-1">
        <Clock className="h-3 w-3" /> Pending
      </Badge>
    );
  };

  const getEmailBadge = (emailStatus: string) => {
    switch (emailStatus) {
      case "SENT":
      case "DELIVERED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <Mail className="h-3 w-3" /> Sent
          </span>
        );
      case "FAILED":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-500">
            <AlertTriangle className="h-3 w-3" /> Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
            Not Sent
          </span>
        );
    }
  };

  const toggleColumn = (key: keyof typeof columnVisibility) => {
    setColumnVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/70 backdrop-blur-md shadow-sm overflow-hidden mb-6">
      {/* Table Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/20">
        <div className="text-xs font-medium text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{items.length}</span> of{" "}
          <span className="font-semibold text-foreground">{total}</span> payslips
        </div>

        <div className="flex items-center gap-2">
          {/* Column Visibility Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs font-medium gap-1.5">
                <Columns className="h-3.5 w-3.5" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 text-xs">
              <DropdownMenuLabel>Toggle Column Visibility</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(columnVisibility).map(([key, visible]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => toggleColumn(key as keyof typeof columnVisibility)}
                  className="flex items-center justify-between text-xs cursor-pointer"
                >
                  <span className="capitalize">{key.replace("_", " ")}</span>
                  {visible && <CheckCircle2 className="h-3.5 w-3.5 text-brand" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Table View */}
      <div className="relative overflow-x-auto min-h-[350px]">
        <table className="w-full text-left border-collapse text-xs">
          <thead className="sticky top-0 bg-muted/40 backdrop-blur-md border-b border-border/40 text-muted-foreground uppercase tracking-wider font-semibold text-[10px]">
            <tr>
              <th className="p-3.5 w-10 text-center">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={() => onSelectAllToggle(items.map((i) => i.id))}
                />
              </th>
              <th className="p-3.5 cursor-pointer" onClick={() => onSortChange("employee_name")}>
                <div className="flex items-center gap-1">
                  Employee
                  <ArrowUpDown className="h-3 w-3 opacity-60" />
                </div>
              </th>
              {columnVisibility.employee_id && <th className="p-3.5">Employee ID</th>}
              {columnVisibility.department && <th className="p-3.5">Department</th>}
              {columnVisibility.designation && <th className="p-3.5">Designation</th>}
              {columnVisibility.period && <th className="p-3.5">Payroll Month</th>}
              {columnVisibility.gross && <th className="p-3.5 text-right">Gross Salary</th>}
              {columnVisibility.allowances && <th className="p-3.5 text-right">Allowances</th>}
              {columnVisibility.deductions && <th className="p-3.5 text-right">Deductions</th>}
              {columnVisibility.tax && <th className="p-3.5 text-right">TDS Tax</th>}
              {columnVisibility.net && (
                <th className="p-3.5 text-right cursor-pointer" onClick={() => onSortChange("net_pay")}>
                  <div className="flex items-center justify-end gap-1">
                    Net Salary
                    <ArrowUpDown className="h-3 w-3 opacity-60" />
                  </div>
                </th>
              )}
              {columnVisibility.status && <th className="p-3.5">Status</th>}
              {columnVisibility.email_status && <th className="p-3.5">Email Status</th>}
              {columnVisibility.download_count && <th className="p-3.5 text-center">Downloads</th>}
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-border/30 font-medium">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="p-3.5 text-center">
                    <div className="h-4 w-4 bg-muted/60 rounded" />
                  </td>
                  <td className="p-3.5">
                    <div className="h-4 w-32 bg-muted/60 rounded" />
                  </td>
                  <td className="p-3.5">
                    <div className="h-4 w-16 bg-muted/60 rounded" />
                  </td>
                  <td className="p-3.5">
                    <div className="h-4 w-24 bg-muted/60 rounded" />
                  </td>
                  <td className="p-3.5">
                    <div className="h-4 w-20 bg-muted/60 rounded" />
                  </td>
                  <td className="p-3.5">
                    <div className="h-4 w-16 bg-muted/60 rounded" />
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="h-4 w-16 bg-muted/60 rounded ml-auto" />
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="h-4 w-16 bg-muted/60 rounded ml-auto" />
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="h-4 w-16 bg-muted/60 rounded ml-auto" />
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="h-4 w-14 bg-muted/60 rounded ml-auto" />
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="h-4 w-20 bg-muted/60 rounded ml-auto" />
                  </td>
                  <td className="p-3.5">
                    <div className="h-4 w-16 bg-muted/60 rounded" />
                  </td>
                  <td className="p-3.5">
                    <div className="h-4 w-14 bg-muted/60 rounded" />
                  </td>
                  <td className="p-3.5 text-center">
                    <div className="h-4 w-8 bg-muted/60 rounded mx-auto" />
                  </td>
                  <td className="p-3.5 text-right">
                    <div className="h-6 w-8 bg-muted/60 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={15} className="p-12 text-center text-muted-foreground">
                  <FileSearch className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-foreground">No payslips found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try adjusting your filters or click "Generate Payslip" to create new records.
                  </p>
                </td>
              </tr>
            ) : (
              items.map((item) => {
                const isSelected = selectedIds.includes(item.id);
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                const monthStr = monthNames[item.period_month - 1] || item.period_month;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-muted/30 transition-colors ${
                      isSelected ? "bg-brand/5 border-l-2 border-l-brand" : ""
                    }`}
                  >
                    <td className="p-3.5 text-center">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onSelectToggle(item.id)}
                      />
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 border border-border/40">
                          <AvatarFallback className="bg-brand/10 text-brand font-bold text-xs">
                            {item.employee_name ? item.employee_name.slice(0, 2).toUpperCase() : "EM"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-foreground hover:underline cursor-pointer" onClick={() => onPreview(item)}>
                            {item.employee_name}
                          </div>
                          <div className="text-[10px] text-muted-foreground">{item.email}</div>
                        </div>
                      </div>
                    </td>

                    {columnVisibility.employee_id && (
                      <td className="p-3.5 font-mono text-muted-foreground text-[11px]">
                        {item.employee_code}
                      </td>
                    )}

                    {columnVisibility.department && (
                      <td className="p-3.5 text-foreground/80">{item.department}</td>
                    )}

                    {columnVisibility.designation && (
                      <td className="p-3.5 text-muted-foreground">{item.designation}</td>
                    )}

                    {columnVisibility.period && (
                      <td className="p-3.5 font-medium">
                        {monthStr} {item.period_year}
                      </td>
                    )}

                    {columnVisibility.gross && (
                      <td className="p-3.5 text-right font-mono text-foreground">
                        {formatCurrency(item.earnings.gross_earnings)}
                      </td>
                    )}

                    {columnVisibility.allowances && (
                      <td className="p-3.5 text-right font-mono text-muted-foreground">
                        {formatCurrency(item.earnings.hra + item.earnings.conveyance + item.earnings.special_allowance)}
                      </td>
                    )}

                    {columnVisibility.deductions && (
                      <td className="p-3.5 text-right font-mono text-rose-500/90">
                        {formatCurrency(item.deductions.total_deductions)}
                      </td>
                    )}

                    {columnVisibility.tax && (
                      <td className="p-3.5 text-right font-mono text-amber-600/90">
                        {formatCurrency(item.deductions.tds)}
                      </td>
                    )}

                    {columnVisibility.net && (
                      <td className="p-3.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(item.net_pay)}
                      </td>
                    )}

                    {columnVisibility.status && (
                      <td className="p-3.5">{getStatusBadge(item)}</td>
                    )}

                    {columnVisibility.email_status && (
                      <td className="p-3.5">{getEmailBadge(item.email_status)}</td>
                    )}

                    {columnVisibility.download_count && (
                      <td className="p-3.5 text-center font-mono text-muted-foreground text-[11px]">
                        {item.download_count}
                      </td>
                    )}

                    <td className="p-3.5 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 text-xs">
                          <DropdownMenuItem onClick={() => onPreview(item)} className="gap-2 cursor-pointer">
                            <Eye className="h-3.5 w-3.5 text-blue-500" /> Preview Payslip
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => onDownloadPdf(item)} className="gap-2 cursor-pointer">
                            <Download className="h-3.5 w-3.5 text-emerald-500" /> Download PDF
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => onPrint(item)} className="gap-2 cursor-pointer">
                            <Printer className="h-3.5 w-3.5 text-purple-500" /> Print Payslip
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => onEmail(item)} className="gap-2 cursor-pointer">
                            <Mail className="h-3.5 w-3.5 text-cyan-500" /> Send Email
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem onClick={() => onRegenerate(item)} className="gap-2 cursor-pointer">
                            <RefreshCw className="h-3.5 w-3.5 text-amber-500" /> Regenerate
                          </DropdownMenuItem>

                          <DropdownMenuItem onClick={() => onViewAuditLogs(item)} className="gap-2 cursor-pointer">
                            <History className="h-3.5 w-3.5 text-indigo-500" /> Audit Logs
                          </DropdownMenuItem>

                          {canDelete && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => onDelete(item)} className="gap-2 cursor-pointer text-rose-500 focus:text-rose-500">
                                <Trash2 className="h-3.5 w-3.5" /> Delete Record
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-border/40 bg-muted/20 text-xs">
        <div className="text-muted-foreground">
          Page <span className="font-semibold text-foreground">{page}</span> of{" "}
          <span className="font-semibold text-foreground">{totalPages || 1}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1 || isLoading}
            onClick={() => onPageChange(page - 1)}
            className="h-8 px-2.5 text-xs gap-1"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages || isLoading}
            onClick={() => onPageChange(page + 1)}
            className="h-8 px-2.5 text-xs gap-1"
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
