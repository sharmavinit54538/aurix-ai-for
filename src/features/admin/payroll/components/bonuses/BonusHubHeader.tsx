import React from "react";
import { PayrollBackButton } from "@/features/admin/payroll/components/PayrollBackButton";
import {
  Gift,
  PlusCircle,
  CheckCircle2,
  Download,
  Sparkles,
  ShieldCheck,
  Building2,
  TrendingUp,
  Award,
  DollarSign,
  PieChart,
  Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BonusesSummaryKPIs } from "./bonusesTypes";

interface BonusHubHeaderProps {
  kpis: BonusesSummaryKPIs;
  onCreateClick: () => void;
  onBulkApproveClick: () => void;
  onExportClick: () => void;
}

export const BonusHubHeader: React.FC<BonusHubHeaderProps> = ({
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-purple-950/40 border border-white/10 shadow-2xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-white tracking-tight">Enterprise Bonus & Incentives Hub</h1>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px] uppercase font-bold tracking-wider">
                  OFC360 Bonus v2026
                </Badge>
              </div>
              <p className="text-xs text-slate-400">
                Performance Bonuses, Festive Pools, Sales Commission Engine, Salary Sync & AI Compensation Intelligence
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
            className="bg-purple-600 hover:bg-purple-500 text-white text-xs gap-1.5 h-9 shadow-lg shadow-purple-600/25 font-bold"
          >
            <PlusCircle className="w-4 h-4" /> New Bonus Allocation
          </Button>
        </div>
      </div>

      {/* High-Level Metric Cards Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Allocated Bonus Pool</span>
            <Gift className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-black text-white font-mono">{formatCurrency(kpis.totalBonusAmount)}</p>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <TrendingUp className="w-3 h-3" /> FY26-27 Approved Pool
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Disbursed Payouts</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-black text-emerald-400 font-mono">{formatCurrency(kpis.paidBonusAmount)}</p>
          <p className="text-[11px] text-slate-400 font-medium">Synced into active salary runs</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Sign-offs</span>
            <PieChart className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-black text-amber-400 font-mono">{kpis.pendingApprovals} Claims</p>
          <p className="text-[11px] text-slate-400 font-medium">Awaiting Manager & HR</p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Budget Utilization</span>
            <Scale className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-black text-cyan-400 font-mono">35.4% Used</p>
          <p className="text-[11px] text-cyan-300 font-medium">Remaining: ₹32.6L Pool</p>
        </div>
      </div>
    </div>
  );
};
