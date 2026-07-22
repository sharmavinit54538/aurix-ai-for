import React from "react";
import {
  Calendar,
  Users,
  Clock,
  IndianRupee,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
} from "lucide-react";

interface CurrentCycleHeroCardProps {
  month: string;
  year: number;
  status: string;
  progressPercent: number;
  totalEmployees: number;
  pendingEmployees: number;
  totalCost: number;
  expectedPaymentDate: string;
  approvalStage: string;
}

export const CurrentCycleHeroCard: React.FC<CurrentCycleHeroCardProps> = ({
  month,
  year,
  status,
  progressPercent,
  totalEmployees,
  pendingEmployees,
  totalCost,
  expectedPaymentDate,
  approvalStage,
}) => {
  // Circular progress calculations (r = 40, circumference = 2 * PI * 40 = 251.32)
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className="sp-card sp-card-hover relative overflow-hidden p-6">
      {/* Background Subtle Gradient */}
      <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
        {/* Left: Month Hero Title & Ring */}
        <div className="flex items-center gap-6 lg:col-span-5 border-b border-white/[0.06] pb-6 lg:border-b-0 lg:pb-0 lg:border-r lg:pr-6">
          {/* Animated SVG Progress Ring */}
          <div className="relative flex h-24 w-24 flex-shrink-0 items-center justify-center">
            <svg className="h-24 w-24 -rotate-90 transform">
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r={radius}
                className="sp-ring-circle stroke-indigo-500 transition-all duration-1000"
                strokeWidth="7"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-xl font-extrabold text-white">{progressPercent}%</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400">Done</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="sp-badge-indigo rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                Current Run
              </span>
              <span className="text-xs text-slate-400">Cycle #{month.slice(0, 3).toUpperCase()}-{year}</span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              {month} {year}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <TrendingUp className="h-3.5 w-3.5" />
                {status}
              </span>
              <span>• Stage: <strong className="text-slate-200">{approvalStage}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Key Hero Stats Grid */}
        <div className="grid grid-cols-2 gap-4 lg:col-span-7 sm:grid-cols-4">
          {/* Total Cost */}
          <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span>Payroll Cost</span>
              <IndianRupee className="h-3.5 w-3.5 text-indigo-400" />
            </div>
            <div className="text-lg font-bold text-white tracking-tight">
              ₹{(totalCost / 100000).toFixed(2)}L
            </div>
            <div className="text-[10px] text-slate-500">Gross disbursement</div>
          </div>

          {/* Employees Included */}
          <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span>Included</span>
              <Users className="h-3.5 w-3.5 text-emerald-400" />
            </div>
            <div className="text-lg font-bold text-emerald-400 tracking-tight">
              {totalEmployees}
            </div>
            <div className="text-[10px] text-slate-500">Active workforce</div>
          </div>

          {/* Pending Reviews */}
          <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span>Pending</span>
              <Clock className="h-3.5 w-3.5 text-amber-400" />
            </div>
            <div className="text-lg font-bold text-amber-400 tracking-tight">
              {pendingEmployees}
            </div>
            <div className="text-[10px] text-slate-500">Requires audit</div>
          </div>

          {/* Payment Date */}
          <div className="rounded-xl border border-white/[0.04] bg-white/[0.02] p-3.5 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
              <span>Payout Date</span>
              <Calendar className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <div className="text-sm font-bold text-white tracking-tight truncate">
              {expectedPaymentDate}
            </div>
            <div className="text-[10px] text-slate-500">Scheduled credit</div>
          </div>
        </div>
      </div>
    </div>
  );
};
