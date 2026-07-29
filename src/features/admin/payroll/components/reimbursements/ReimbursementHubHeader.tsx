import React from "react";
import { PayrollBackButton } from "@/features/admin/payroll/components/PayrollBackButton";
import {
  Receipt,
  PlusCircle,
  Scan,
  CheckCircle2,
  Download,
  Sparkles,
  ShieldCheck,
  Building2,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReimbursementsSummaryKPIs } from "./reimbursementsTypes";

interface ReimbursementHubHeaderProps {
  kpis: ReimbursementsSummaryKPIs;
  onCreateClick: () => void;
  onOcrClick: () => void;
  onBulkApproveClick: () => void;
  onExportClick: () => void;
}

export const ReimbursementHubHeader: React.FC<ReimbursementHubHeaderProps> = ({
  kpis,
  onCreateClick,
  onOcrClick,
  onBulkApproveClick,
  onExportClick,
}) => {
  const formatCurrency = (val: number = 0) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  return (
    <div className="space-y-4">
      <PayrollBackButton to="/dashboard/payroll" label="Back to Payroll Hub" />

      {/* Top Title & Primary Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-blue-950/40 border border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">Enterprise Reimbursement Hub</h1>
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[10px] uppercase font-bold tracking-wider">
                  Aurix Expense v2026
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                Unified Expense Management, Policy Engine, OCR Receipt Scanner, Fraud AI & Payroll Settlement
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={onCreateClick}
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold gap-1.5 shadow-lg shadow-blue-600/25 h-9"
          >
            <PlusCircle className="w-4 h-4" /> Create Expense Claim
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onOcrClick}
            className="border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 text-xs font-semibold gap-1.5 h-9"
          >
            <Scan className="w-4 h-4" /> OCR Receipt Scanner
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onBulkApproveClick}
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold gap-1.5 h-9"
          >
            <CheckCircle2 className="w-4 h-4" /> Bulk Approve
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={onExportClick}
            className="border-white/10 bg-slate-800/60 text-slate-300 hover:bg-slate-800 text-xs font-semibold gap-1.5 h-9"
          >
            <Download className="w-4 h-4" /> Export Reports
          </Button>
        </div>
      </div>

      {/* High Level Metrics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Claims Filed</span>
            <p className="text-xl font-bold text-white font-mono mt-0.5">{kpis.totalClaims} Claims</p>
          </div>
          <Building2 className="w-8 h-8 text-blue-400 opacity-60" />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Pending Approvals</span>
            <p className="text-xl font-bold text-amber-400 font-mono mt-0.5">{kpis.pendingApproval} Queue</p>
          </div>
          <Sparkles className="w-8 h-8 text-amber-400 opacity-60" />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Total Claim Volume</span>
            <p className="text-xl font-bold text-emerald-400 font-mono mt-0.5">{formatCurrency(kpis.totalAmount)}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-emerald-400 opacity-60" />
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Policy Compliance</span>
            <p className="text-xl font-bold text-purple-400 font-mono mt-0.5">98.4% Compliant</p>
          </div>
          <ShieldCheck className="w-8 h-8 text-purple-400 opacity-60" />
        </div>
      </div>
    </div>
  );
};
