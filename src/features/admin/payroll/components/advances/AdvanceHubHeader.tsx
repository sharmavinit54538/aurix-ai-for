import React from "react";
import { PayrollBackButton } from "@/features/admin/payroll/components/PayrollBackButton";
import {
  HandCoins,
  PlusCircle,
  CheckCircle2,
  Download,
  Sparkles,
  ShieldCheck,
  Building2,
  TrendingUp,
  Landmark,
  DollarSign,
  Receipt,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdvancesSummaryKPIs } from "./advancesTypes";

interface AdvanceHubHeaderProps {
  kpis: AdvancesSummaryKPIs;
  onCreateClick: () => void;
  onBulkApproveClick: () => void;
  onExportClick: () => void;
}

export const AdvanceHubHeader: React.FC<AdvanceHubHeaderProps> = ({
  kpis,
  onCreateClick,
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-emerald-950/40 border border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <HandCoins className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">Enterprise Advance & Loan Hub</h1>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] uppercase font-bold tracking-wider">
                  OFC360 Loans v2026
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                Salary Advances, Multi-category Loans, EMI Installments, Payroll Recovery & AI Financial Risk Engine
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            onClick={onBulkApproveClick}
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs gap-1.5 h-9"
          >
            <CheckCircle2 className="w-3.5 h-3.5" /> Bulk Approve Queue
          </Button>

          <Button
            size="sm"
            onClick={onExportClick}
            variant="outline"
            className="border-white/10 bg-slate-900 text-slate-300 hover:text-white text-xs gap-1.5 h-9"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" /> Export Audit File
          </Button>

          <Button
            size="sm"
            onClick={onCreateClick}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 h-9 shadow-lg shadow-emerald-600/25 font-bold"
          >
            <PlusCircle className="w-4 h-4" /> New Advance Request
          </Button>
        </div>
      </div>

      {/* High-Level Metric Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Disbursed Value</span>
            <Landmark className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">{formatCurrency(kpis.disbursed)}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> NEFT Direct Advice Verified
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Outstanding Balance</span>
            <HandCoins className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-cyan-400 font-mono">{formatCurrency(kpis.outstandingBalance)}</p>
          <p className="text-[11px] text-slate-400 font-medium">Active Payroll Recoveries</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Monthly EMI Recovery</span>
            <Receipt className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-purple-400 font-mono">{formatCurrency(kpis.monthlyRecovery)} / mo</p>
          <p className="text-[11px] text-slate-400 font-medium">Auto-deducted from salary</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recovery Rate</span>
            <Scale className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-black text-blue-400 font-mono">{kpis.recoveryRate}%</p>
          <p className="text-[11px] text-blue-300 font-medium">Zero default risk score</p>
        </div>
      </div>
    </div>
  );
};
