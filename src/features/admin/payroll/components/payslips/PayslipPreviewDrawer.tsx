import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PayslipPreviewPayload } from "@/services/payslipsApi";
import {
  Download,
  Printer,
  Mail,
  X,
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
      <SheetContent className="w-full sm:max-w-3xl overflow-y-auto p-0 bg-background border-l border-border">
        <SheetHeader className="p-4 border-b border-border/40 bg-muted/20 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand" />
            <SheetTitle className="text-sm font-bold text-foreground">
              Official Payslip Preview — {previewData?.payslip_number || "PAYSLIP"}
            </SheetTitle>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onDownloadPdf} className="h-8 text-xs gap-1.5">
              <Download className="h-3.5 w-3.5" /> PDF
            </Button>            <Button variant="outline" size="sm" onClick={onPrint} className="h-8 text-xs gap-1.5">
              <Printer className="h-3.5 w-3.5" /> Print
            </Button>
            <Button variant="outline" size="sm" onClick={onEmail} className="h-8 text-xs gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Email
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </SheetHeader>

        {isLoading ? (
          <div className="p-12 text-center text-muted-foreground animate-pulse">
            <div className="h-8 w-48 bg-muted rounded mx-auto mb-4" />
            <div className="h-32 w-full bg-muted/40 rounded mb-4" />
            <div className="h-64 w-full bg-muted/40 rounded" />
          </div>
        ) : !previewData ? (
          <div className="p-12 text-center text-muted-foreground">
            No preview data available.
          </div>
        ) : (
          <div className="p-6 space-y-6 text-xs text-foreground font-sans">
            {/* Document Header / Company Brand */}
            <div className="border border-border/60 rounded-xl p-5 bg-card/60 backdrop-blur-sm shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand to-brand/80 flex items-center justify-center text-brand-foreground font-bold text-lg shadow-sm">
                    A
                  </div>
                  <div>
                    <h2 className="text-base font-bold tracking-tight text-foreground font-display">
                      {previewData.company.name}
                    </h2>
                    <p className="text-[11px] text-muted-foreground">{previewData.company.address}</p>
                    <p className="text-[10px] text-muted-foreground/80 font-mono mt-0.5">{previewData.company.tax_id}</p>
                  </div>
                </div>

                <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0">
                  <Badge variant="outline" className="bg-brand/10 text-brand border-brand/20 font-semibold mb-1 text-[11px]">
                    PAYSLIP SUMMARY
                  </Badge>
                  <p className="text-sm font-bold font-display">{previewData.period}</p>
                  <p className="text-[10px] font-mono text-muted-foreground">Ref: {previewData.payslip_number}</p>
                </div>
              </div>

              {/* Employee & Bank Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Employee Details */}
                <div className="flex items-start gap-3 bg-muted/20 p-3 rounded-lg border border-border/30">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={previewData.employee.photo_url} />
                    <AvatarFallback className="bg-brand/10 text-brand font-bold">
                      {previewData.employee.name.slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="space-y-1">
                    <p className="font-bold text-foreground text-sm">{previewData.employee.name}</p>
                    <p className="text-muted-foreground">{previewData.employee.designation} · {previewData.employee.department}</p>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground font-mono">
                      <span>ID: {previewData.employee.code}</span>
                      <span>•</span>
                      <span>Location: {previewData.employee.location}</span>
                    </div>
                  </div>
                </div>

                {/* Bank & Tax Identifiers */}
                <div className="bg-muted/20 p-3 rounded-lg border border-border/30 space-y-1.5 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bank Account:</span>
                    <span className="font-medium text-foreground">{previewData.employee.bank_name} ({previewData.employee.bank_account})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PAN Identifier:</span>
                    <span className="font-medium text-foreground">{previewData.employee.pan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PF Universal No:</span>
                    <span className="font-medium text-foreground">{previewData.employee.pf_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ESI Registration:</span>
                    <span className="font-medium text-foreground">{previewData.employee.esi_number}</span>
                  </div>
                </div>
              </div>

              {/* Attendance Bar */}
              <div className="flex items-center justify-around bg-muted/40 p-2.5 rounded-lg text-center text-[11px]">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Total Days</span>
                  <span className="font-bold text-foreground">{previewData.attendance.total_days}</span>
                </div>
                <div className="h-6 w-px bg-border/40" />
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Paid Days</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{previewData.attendance.paid_days}</span>
                </div>
                <div className="h-6 w-px bg-border/40" />
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">LOP Days</span>
                  <span className="font-bold text-rose-500">{previewData.attendance.lop_days}</span>
                </div>
              </div>
            </div>

            {/* Financial Grid: Earnings vs Deductions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Earnings Table */}
              <div className="border border-border/60 rounded-xl overflow-hidden bg-card/60 backdrop-blur-sm">
                <div className="bg-emerald-500/10 border-b border-emerald-500/20 px-3.5 py-2 flex items-center justify-between">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5" /> Earnings & Allowances
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-emerald-600 dark:text-emerald-400">Amount (₹)</span>
                </div>
                <div className="divide-y divide-border/30 p-1">
                  {previewData.earnings.map((item, idx) => (
                    <div key={idx} className="flex justify-between px-3 py-2 text-xs">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-mono font-semibold text-foreground">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-muted/30 border-t border-border/40 px-3.5 py-2.5 flex justify-between font-bold text-xs">
                  <span>Gross Earnings</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(previewData.totals.gross_salary)}
                  </span>
                </div>
              </div>

              {/* Deductions Table */}
              <div className="border border-border/60 rounded-xl overflow-hidden bg-card/60 backdrop-blur-sm">
                <div className="bg-rose-500/10 border-b border-rose-500/20 px-3.5 py-2 flex items-center justify-between">
                  <span className="font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <FileCheck className="h-3.5 w-3.5" /> Deductions & Taxes
                  </span>
                  <span className="text-[10px] font-mono font-semibold text-rose-600 dark:text-rose-400">Amount (₹)</span>
                </div>
                <div className="divide-y divide-border/30 p-1">
                  {previewData.deductions.map((item, idx) => (
                    <div key={idx} className="flex justify-between px-3 py-2 text-xs">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span className="font-mono font-semibold text-rose-500/90">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-muted/30 border-t border-border/40 px-3.5 py-2.5 flex justify-between font-bold text-xs">
                  <span>Total Deductions</span>
                  <span className="font-mono text-rose-600 dark:text-rose-400">
                    {formatCurrency(previewData.totals.total_deductions)}
                  </span>
                </div>
              </div>
            </div>

            {/* Employer Contributions Box */}
            <div className="border border-border/40 rounded-xl p-3.5 bg-muted/20 space-y-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Employer Contributions (Informational CTC Part)
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                {previewData.employer_contributions.map((c, idx) => (
                  <div key={idx} className="flex justify-between bg-background/50 p-2 rounded border border-border/30">
                    <span className="text-muted-foreground">{c.label}:</span>
                    <span className="font-semibold text-foreground">{formatCurrency(c.amount)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Net Salary Summary Box */}
            <div className="border-2 border-emerald-500/30 rounded-xl p-5 bg-gradient-to-r from-emerald-500/10 via-card to-emerald-500/5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Net Payable Amount
                </span>
                <p className="text-2xl font-bold font-display text-emerald-600 dark:text-emerald-400 tracking-tight mt-0.5">
                  {formatCurrency(previewData.totals.net_salary)}
                </p>
                <p className="text-[11px] text-muted-foreground font-medium mt-1">
                  Amount in words: <span className="italic font-serif font-semibold text-foreground">{previewData.totals.net_pay_words}</span>
                </p>
              </div>

              <div className="text-center sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-border/40">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                  <ShieldCheck className="h-4 w-4" /> VERIFIED PAYOUT
                </div>
              </div>
            </div>

            {/* Security Verification & Signature Footer */}
            <div className="border border-border/40 rounded-xl p-4 bg-card/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-lg bg-foreground/5 border border-border/60 flex items-center justify-center font-mono text-[9px] font-bold text-center leading-tight">
                  QR SEAL
                </div>
                <div>
                  <p className="font-semibold text-foreground">Token: {previewData.security.qr_code_token}</p>
                  <p className="text-[10px]">Digital Audit Signature: {previewData.security.digital_signature_id}</p>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <p className="font-semibold text-foreground">{previewData.security.issued_by}</p>
                <p className="text-[10px] text-muted-foreground">Computer-generated document. No manual ink signature required.</p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};
