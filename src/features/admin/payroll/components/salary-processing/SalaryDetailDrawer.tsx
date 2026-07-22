import React from "react";
import {
  X,
  User,
  Calendar,
  Building2,
  TrendingUp,
  FileText,
  IndianRupee,
  ShieldCheck,
  Award,
  Clock,
  ArrowRight,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts";

export interface EmployeeSalaryDetail {
  id: string;
  employeeCode: string;
  name: string;
  designation: string;
  department: string;
  location: string;
  avatarUrl?: string;
  ctc: number;
  grossSalary: number;
  basic: number;
  hra: number;
  specialAllowance: number;
  otherAllowances: number;
  bonus: number;
  overtimePay: number;
  pfDeduction: number;
  esiDeduction: number;
  ptDeduction: number;
  tdsDeduction: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  workingDays: number;
  paidDays: number;
  lopDays: number;
  overtimeHours: number;
  prevMonthNet: number;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  panNumber: string;
  status: "CALCULATED" | "VALIDATED" | "HOLD" | "PENDING";
}

interface SalaryDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  employee: EmployeeSalaryDetail | null;
}

export const SalaryDetailDrawer: React.FC<SalaryDetailDrawerProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  if (!isOpen || !employee) return null;

  const netDiff = employee.netSalary - employee.prevMonthNet;
  const netDiffPercent = ((netDiff / employee.prevMonthNet) * 100).toFixed(1);

  const earningsList = [
    { label: "Basic Salary", amount: employee.basic },
    { label: "House Rent Allowance (HRA)", amount: employee.hra },
    { label: "Special Allowance", amount: employee.specialAllowance },
    { label: "Conveyance & Medical", amount: employee.otherAllowances },
    { label: "Overtime Pay", amount: employee.overtimePay },
    { label: "Performance Bonus", amount: employee.bonus },
  ];

  const deductionsList = [
    { label: "Employee PF (12%)", amount: employee.pfDeduction },
    { label: "Employee ESI (0.75%)", amount: employee.esiDeduction },
    { label: "Professional Tax (PT)", amount: employee.ptDeduction },
    { label: "Income Tax (TDS)", amount: employee.tdsDeduction },
    { label: "Other Recoveries", amount: employee.otherDeductions },
  ];

  const chartData = [
    { name: "Basic", value: employee.basic, color: "#4f7cff" },
    { name: "HRA", value: employee.hra, color: "#a855f7" },
    { name: "Special", value: employee.specialAllowance, color: "#06b6d4" },
    { name: "Bonus/OT", value: employee.bonus + employee.overtimePay, color: "#10b981" },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="sp-drawer-backdrop absolute inset-0 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-2xl transform transition-transform duration-300 bg-[#0d1526] border-l border-white/[0.08] text-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/[0.08] p-5 bg-[#121a2f]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30 text-base">
                {employee.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{employee.name}</h3>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="font-mono text-slate-300">{employee.employeeCode}</span>
                  <span>•</span>
                  <span>{employee.designation}</span>
                  <span>•</span>
                  <span className="text-indigo-400">{employee.department}</span>
                </div>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 text-slate-400 hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Drawer Body Scroll */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 sp-table-scroll">
            {/* Top Net Salary Hero Banner */}
            <div className="rounded-2xl border border-indigo-500/30 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Calculated Net Payable Salary
                </span>
                <span className="sp-badge-emerald rounded-full px-2.5 py-0.5 text-[10px] font-bold">
                  {employee.status}
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white tracking-tight">
                  ₹{employee.netSalary.toLocaleString("en-IN")}
                </span>
                <span className="text-xs text-slate-400">for July 2026</span>
              </div>

              {/* MoM Comparison Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-white/[0.08] text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <span>Prev Month: <strong className="text-slate-200">₹{employee.prevMonthNet.toLocaleString("en-IN")}</strong></span>
                </div>
                <div className={`flex items-center gap-1 font-semibold ${netDiff >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{netDiff >= 0 ? `+₹${netDiff} (${netDiffPercent}%)` : `-₹${Math.abs(netDiff)}`}</span>
                </div>
              </div>
            </div>

            {/* Attendance & Working Days Summary */}
            <div className="sp-card p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Attendance & Leave Summary
              </h4>

              <div className="grid grid-cols-4 gap-3 text-center">
                <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5">
                  <div className="text-[10px] text-slate-400">Working Days</div>
                  <div className="text-base font-bold text-white mt-0.5">{employee.workingDays}</div>
                </div>

                <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5">
                  <div className="text-[10px] text-slate-400">Paid Days</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5">{employee.paidDays}</div>
                </div>

                <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5">
                  <div className="text-[10px] text-slate-400">LOP Days</div>
                  <div className="text-base font-bold text-rose-400 mt-0.5">{employee.lopDays}</div>
                </div>

                <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-2.5">
                  <div className="text-[10px] text-slate-400">OT Hours</div>
                  <div className="text-base font-bold text-indigo-400 mt-0.5">{employee.overtimeHours}h</div>
                </div>
              </div>
            </div>

            {/* Breakdown Grid: Earnings vs Deductions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Earnings */}
              <div className="sp-card p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Gross Earnings
                  </h4>
                  <span className="text-xs font-bold text-emerald-400">
                    ₹{employee.grossSalary.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="space-y-2">
                  {earningsList.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-semibold text-slate-200">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deductions */}
              <div className="sp-card p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">
                    Total Deductions
                  </h4>
                  <span className="text-xs font-bold text-rose-400">
                    ₹{employee.totalDeductions.toLocaleString("en-IN")}
                  </span>
                </div>

                <div className="space-y-2">
                  {deductionsList.map((item) => (
                    <div key={item.label} className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-semibold text-slate-200">
                        ₹{item.amount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recharts Visual Composition */}
            <div className="sp-card p-4 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Salary Component Visual Share
              </h4>

              <div className="flex items-center justify-between">
                <div className="h-32 w-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={chartData} innerRadius={25} outerRadius={45} paddingAngle={4} dataKey="value">
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: "#121a2f", borderColor: "rgba(255,255,255,0.1)", borderRadius: "8px", fontSize: "11px" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs flex-1 pl-4">
                  {chartData.map((c) => (
                    <div key={c.name} className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: c.color }} />
                      <span className="text-slate-400">{c.name}:</span>
                      <span className="font-semibold text-white">₹{c.value.toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Banking & Compliance Details */}
            <div className="sp-card p-4 space-y-2.5 text-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Banking & Tax Identity
              </h4>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <div className="text-slate-500 text-[11px]">Bank Name</div>
                  <div className="font-semibold text-slate-200 mt-0.5">{employee.bankName}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">IFSC Code</div>
                  <div className="font-mono text-indigo-400 mt-0.5">{employee.ifscCode}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">Account Number</div>
                  <div className="font-mono text-slate-300 mt-0.5">•••• {employee.accountNumber.slice(-4)}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-[11px]">PAN Card</div>
                  <div className="font-mono text-slate-300 mt-0.5">{employee.panNumber}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-white/[0.08] bg-[#121a2f] flex items-center justify-between gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 bg-white/[0.03] text-xs text-slate-300 hover:bg-white/[0.08]"
            >
              <Download className="h-3.5 w-3.5 mr-1.5 text-indigo-400" />
              Download Calculation Advice
            </Button>

            <Button
              variant="default"
              size="sm"
              onClick={onClose}
              className="bg-indigo-600 hover:bg-indigo-500 text-xs text-white px-5 font-semibold"
            >
              Close Breakdown
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
