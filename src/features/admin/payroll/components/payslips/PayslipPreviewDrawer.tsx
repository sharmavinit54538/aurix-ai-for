import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PayslipPreviewPayload } from "@/services/payslipsApi";
import {
  Download,
  Printer,
  Mail,
  ShieldCheck,
  Building2,
  Calendar,
  CreditCard,
  FileCheck,
  Sparkles,
} from "lucide-react";

interface PayslipPreviewDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewData: PayslipPreviewPayload | null;
  isLoading?: boolean;
  onDownloadPdf: () => void;
  onPrint: () => void;
  onEmail: () => void;
}

export const PayslipPreviewDrawer: React.FC<PayslipPreviewDrawerProps> = ({
  open,
  onOpenChange,
  previewData,
  isLoading = false,
  onDownloadPdf,
  onPrint,
  onEmail,
}) => {
  const formatCurrency = (val: number = 0) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto border-l border-border bg-background p-0 sm:max-w-3xl">
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border/40 bg-muted/20 p-4 pr-14">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <SheetTitle className="text-sm font-bold text-foreground">
              Official Payslip Preview — {previewData?.payslip_number || "PAYSLIP"}
            </SheetTitle>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onDownloadPdf}
              className="h-8 gap-1.5 border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-300 shadow-sm hover:bg-indigo-500/20 hover:text-indigo-200"
            >
              <Download className="h-3.5 w-3.5 text-indigo-400" /> PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onPrint}
              className="h-8 gap-1.5 border-slate-500/30 bg-slate-500/10 text-xs font-semibold text-slate-300 shadow-sm hover:bg-slate-500/20 hover:text-white"
            >
              <Printer className="h-3.5 w-3.5 text-slate-400" /> Print
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onEmail}
              className="h-8 gap-1.5 border-purple-500/30 bg-purple-500/10 text-xs font-semibold text-purple-300 shadow-sm hover:bg-purple-500/20 hover:text-purple-200"
            >
              <Mail className="h-3.5 w-3.5 text-purple-400" /> Email
            </Button>
          </div>
        </SheetHeader>

        {isLoading ? (
          <div className="animate-pulse p-12 text-center text-muted-foreground">
            <div className="mx-auto mb-4 h-8 w-48 rounded bg-muted" />
            <div className="mb-4 h-32 w-full rounded bg-muted/40" />
            <div className="h-64 w-full rounded bg-muted/40" />
          </div>
        ) : !previewData ? (
          <div className="p-12 text-center text-muted-foreground">
            No preview data available.
          </div>
        ) : (
          <div className="space-y-6 p-6 font-sans text-xs text-foreground">
            {/* Document Header / Company Brand */}
            <div className="space-y-4 rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-border/40 pb-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-brand to-brand/80 font-bold text-lg text-brand-foreground shadow-sm">
                    A
                  </div>
                  <div>
                    <h2 className="font-display text-base font-bold tracking-tight text-foreground">
                      {previewData.company.name}
                    </h2>
                    <p className="text-[11px] text-muted-foreground">{previewData.company.address}</p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/80">{previewData.company.tax_id}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right">
                  <Badge variant="outline" className="mb-1 border-indigo-500/30 bg-indigo-500/10 font-mono text-indigo-400">
                    CONFIDENTIAL PAYSLIP
                  </Badge>
                  <p className="font-mono text-sm font-bold text-foreground">{previewData.payslip_number}</p>
                  <p className="text-[11px] text-muted-foreground">Pay Period: <span className="font-semibold text-foreground">{previewData.period}</span></p>
                </div>
              </div>

              {/* Employee & Bank Info Grid */}
              <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2 md:grid-cols-3">
                <div className="space-y-1">
                  <p className="text-[10px] font-medium uppercase text-muted-foreground">Employee Name</p>
                  <p className="font-semibold text-foreground">{previewData.employee.name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{previewData.employee.code}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-medium uppercase text-muted-foreground">Department / Role</p>
                  <p className="font-semibold text-foreground">{previewData.employee.department}</p>
                  <p className="text-[11px] text-muted-foreground">{previewData.employee.designation}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-medium uppercase text-muted-foreground">Bank & Account</p>
                  <p className="font-semibold text-foreground">{previewData.employee.bank_name}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{previewData.employee.bank_account}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-medium uppercase text-muted-foreground">PAN / PF / ESI</p>
                  <p className="font-mono text-[11px] text-foreground">PAN: {previewData.employee.pan}</p>
                  <p className="font-mono text-[10px] text-muted-foreground">PF: {previewData.employee.pf_number}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-medium uppercase text-muted-foreground">Work Location</p>
                  <p className="font-semibold text-foreground">{previewData.employee.location}</p>
                  <p className="text-[11px] text-muted-foreground">DOJ: {previewData.employee.joining_date}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-medium uppercase text-muted-foreground">Attendance Summary</p>
                  <p className="font-semibold text-foreground">{previewData.attendance.paid_days} / {previewData.attendance.total_days} Days Paid</p>
                  <p className="text-[11px] text-rose-400">LOP Days: {previewData.attendance.lop_days}</p>
                </div>
              </div>
            </div>

            {/* Earnings & Deductions Tables Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Earnings Table */}
              <div className="rounded-xl border border-border/60 bg-card/40 p-4 shadow-sm">
                <h3 className="mb-3 font-semibold text-emerald-400">Earnings (+)</h3>
                <div className="space-y-2">
                  {previewData.earnings.map((item, idx) => (
                    <div key={idx} className="flex justify-between border-b border-border/20 pb-1.5 text-xs">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-mono font-medium text-foreground">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 font-bold text-emerald-400">
                    <span>Gross Earnings</span>
                    <span className="font-mono">{formatCurrency(previewData.totals.gross_salary)}</span>
                  </div>
                </div>
              </div>

              {/* Deductions Table */}
              <div className="rounded-xl border border-border/60 bg-card/40 p-4 shadow-sm">
                <h3 className="mb-3 font-semibold text-rose-400">Deductions (-)</h3>
                <div className="space-y-2">
                  {previewData.deductions.map((item, idx) => (
                    <div key={idx} className="flex justify-between border-b border-border/20 pb-1.5 text-xs">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-mono font-medium text-foreground">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-2 font-bold text-rose-400">
                    <span>Total Deductions</span>
                    <span className="font-mono">{formatCurrency(previewData.totals.total_deductions)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Net Pay Banner */}
            <div className="flex flex-col items-center justify-between gap-3 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 p-5 shadow-lg sm:flex-row">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Net Salary Payable</p>
                <p className="font-mono text-2xl font-black text-white">{formatCurrency(previewData.totals.net_salary)}</p>
              </div>
              {previewData.totals.net_pay_words ? (
                <p className="text-right text-[11px] italic text-slate-300">
                  "{previewData.totals.net_pay_words}"
                </p>
              ) : null}
            </div>

            {/* Security & Verification Footer */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-border/40 bg-muted/20 p-4 text-[10px] text-muted-foreground sm:flex-row">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Digitally Signed Document & System Generated Statement</span>
              </div>
              <div className="font-mono text-[10px] opacity-75">
                Token: {previewData.security.qr_code_token || "AURIX-VERIFIED-PAYSLIP"}
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
