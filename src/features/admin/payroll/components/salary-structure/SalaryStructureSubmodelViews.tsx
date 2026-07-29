import React from "react";
import {
  SalaryStructure,
  SalaryComponent,
  SidebarTabId,
  SalaryStructureAuditLog,
} from "./salaryStructureTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Coins,
  MinusCircle,
  Building,
  HeartHandshake,
  Receipt,
  ShieldCheck,
  History,
  Users,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface SalaryStructureSubmodelViewsProps {
  activeTab: SidebarTabId;
  structures: SalaryStructure[];
  selectedStructure: SalaryStructure | null;
  auditLogs: SalaryStructureAuditLog[];
  onSelectStructure: (st: SalaryStructure) => void;
  onEditStructure: (st: SalaryStructure) => void;
  onAssignStructure: (st: SalaryStructure) => void;
  onCloneStructure: (st: SalaryStructure) => void;
  onRollbackVersion: (structureId: string, versionId: string) => void;
  onApproveDecision: (id: string, role: string, decision: "APPROVE" | "REJECT") => void;
}

export const SalaryStructureSubmodelViews: React.FC<SalaryStructureSubmodelViewsProps> = ({
  activeTab,
  structures,
  selectedStructure,
  auditLogs,
  onSelectStructure,
  onEditStructure,
  onAssignStructure,
  onCloneStructure,
  onRollbackVersion,
  onApproveDecision,
}) => {
  const currentSt = selectedStructure || structures[0] || null;

  // Extract all components across structures
  const allComponents = structures.flatMap((s) => s.components || []);

  const formatCurrency = (val: number = 0) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  switch (activeTab) {
    case "templates":
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-400" /> Active Salary Structure Templates ({structures.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {structures.map((st) => (
              <div
                key={st.id}
                className="salary-card p-5 space-y-4 border border-slate-800 hover:border-blue-500/40 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="border-blue-500/30 text-blue-400 bg-blue-500/10 mb-1">
                      {st.code}
                    </Badge>
                    <h4 className="font-bold text-white text-base">{st.name}</h4>
                    <p className="text-xs text-slate-400 mt-1">{st.description}</p>
                  </div>
                  <Badge
                    className={
                      st.status === "ACTIVE"
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }
                  >
                    {st.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Annual CTC</span>
                    <span className="font-mono font-bold text-emerald-400">{formatCurrency(st.annualCtc)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Assigned Staff</span>
                    <span className="font-bold text-slate-200">{st.employeesAssigned} Employees</span>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase block">Components</span>
                    <span className="font-bold text-slate-200">{st.components.length} Items</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectStructure(st)}
                    className="h-8 text-xs border-slate-700 hover:bg-slate-800 text-slate-200 flex-1"
                  >
                    View Breakdown
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAssignStructure(st)}
                    className="h-8 text-xs border-blue-500/30 bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 flex-1"
                  >
                    Assign
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onCloneStructure(st)}
                    className="h-8 text-xs text-slate-400 hover:text-white"
                  >
                    Clone
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "earnings":
      const earnings = allComponents.filter((c) => c.type === "EARNING");
      return (
        <div className="salary-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" /> Earnings & Base Pay Components ({earnings.length})
            </h3>
            <span className="text-xs text-slate-400">Includes Basic Pay, HRA, Allowances & Variable Bonuses</span>
          </div>

          <div className="salary-table-wrapper">
            <table className="salary-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Component Name</th>
                  <th>Category</th>
                  <th>Calculation Rule</th>
                  <th>Taxability</th>
                  <th>Frequency</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map((c, idx) => (
                  <tr key={`${c.code}-${idx}`}>
                    <td className="font-mono text-blue-400 font-bold">{c.code}</td>
                    <td className="font-semibold text-white">{c.name}</td>
                    <td>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-300">
                        {c.category}
                      </span>
                    </td>
                    <td className="font-mono text-slate-300">
                      {c.calculationType === "PERCENTAGE" ? `${c.value}% of ${c.baseComponentCode || "CTC"}` : formatCurrency(c.value)}
                    </td>
                    <td>
                      {c.isTaxable ? (
                        <span className="text-[10px] text-amber-400 font-semibold">Taxable</span>
                      ) : (
                        <span className="text-[10px] text-emerald-400 font-semibold">Tax Exempt</span>
                      )}
                    </td>
                    <td className="text-slate-400 text-xs">{c.frequency}</td>
                    <td className="text-slate-400 text-xs">{c.description || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "allowances":
      const allowances = allComponents.filter(
        (c) => c.type === "EARNING" && c.category !== "BASIC",
      );
      return (
        <div className="salary-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Coins className="h-4 w-4 text-amber-400" /> Allowances & Special Pay Elements ({allowances.length})
            </h3>
            <span className="text-xs text-slate-400">Housing, Travel, Medical, and Flexible Benefits</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {allowances.map((c, idx) => (
              <div key={`${c.code}-${idx}`} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-400">{c.code}</span>
                  <Badge variant="outline" className="text-[10px] border-slate-700 text-slate-300">
                    {c.category}
                  </Badge>
                </div>
                <h4 className="font-bold text-white text-sm">{c.name}</h4>
                <p className="text-xs text-slate-400">{c.description || "Special allowance element."}</p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs font-mono">
                  <span className="text-slate-500">Value Rule:</span>
                  <span className="text-emerald-400 font-bold">
                    {c.calculationType === "PERCENTAGE" ? `${c.value}% of ${c.baseComponentCode || "BASIC"}` : formatCurrency(c.value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "deductions":
      const deductions = allComponents.filter((c) => c.type === "DEDUCTION");
      return (
        <div className="salary-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MinusCircle className="h-4 w-4 text-rose-400" /> Statutory & Custom Deductions ({deductions.length})
            </h3>
            <span className="text-xs text-slate-400">EPF Employee, Professional Tax, Income Tax (TDS), ESI</span>
          </div>

          <div className="salary-table-wrapper">
            <table className="salary-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Deduction Name</th>
                  <th>Statutory Type</th>
                  <th>Calculation Rule</th>
                  <th>Frequency</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {deductions.map((c, idx) => (
                  <tr key={`${c.code}-${idx}`}>
                    <td className="font-mono text-rose-400 font-bold">{c.code}</td>
                    <td className="font-semibold text-white">{c.name}</td>
                    <td>
                      {c.isStatutory ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/30 font-bold">
                          Statutory Rule
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400">Custom</span>
                      )}
                    </td>
                    <td className="font-mono text-slate-300">
                      {c.calculationType === "PERCENTAGE" ? `${c.value}% of ${c.baseComponentCode || "GROSS"}` : formatCurrency(c.value)}
                    </td>
                    <td className="text-slate-400 text-xs">{c.frequency}</td>
                    <td className="text-slate-400 text-xs">{c.description || "Standard statutory deduction."}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    case "employer_contributions":
      return (
        <div className="salary-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="h-4 w-4 text-indigo-400" /> Employer Contributions & Overhead Costs
            </h3>
            <span className="text-xs text-slate-400">Statutory Employer EPF, ESI, Gratuity Accrual & EDLI</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 block">Employer EPF Match</span>
              <p className="font-mono text-lg font-bold text-white">12.00%</p>
              <p className="text-xs text-slate-400">12% of Basic Pay (capped at Rs. 1,800/month or full wage match).</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 block">Employer ESI Match</span>
              <p className="font-mono text-lg font-bold text-white">3.25%</p>
              <p className="text-xs text-slate-400">Applicable for gross salaries up to Rs. 21,000/month limit.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Gratuity Accrual Rate</span>
              <p className="font-mono text-lg font-bold text-white">4.81%</p>
              <p className="text-xs text-slate-400">Calculated as (Basic Pay × 15 / 26) per tenure year.</p>
            </div>
          </div>
        </div>
      );

    case "benefits":
      return (
        <div className="salary-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-pink-400" /> Employee Benefits & Executive Perks
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white text-sm">Group Health Insurance</h4>
                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Active</Badge>
              </div>
              <p className="text-xs text-slate-400">Comprehensive Rs. 5 Lakhs health cover for employee and dependents.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white text-sm">Executive Corporate Cab Pass</h4>
                <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30">L7 / Executive</Badge>
              </div>
              <p className="text-xs text-slate-400">Unlimited corporate cab transport pass for executive leadership staff.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white text-sm">Meal Coupons & Food Pass</h4>
                <Badge className="bg-amber-500/20 text-amber-400 border border-amber-500/30">Tax Exempt</Badge>
              </div>
              <p className="text-xs text-slate-400">Tax-free monthly Sodexo / Pluxee meal card coupons up to Rs. 3,000.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white text-sm">Annual Wellness Reimbursement</h4>
                <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30">Flexible</Badge>
              </div>
              <p className="text-xs text-slate-400">Gym, sports membership, and preventive health checkup claims.</p>
            </div>
          </div>
        </div>
      );

    case "tax_components":
      return (
        <div className="salary-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Receipt className="h-4 w-4 text-cyan-400" /> Income Tax Components & Deduction Rules (FY 2026-27)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="font-bold text-cyan-400 text-sm">New Tax Regime Slabs (Default)</h4>
              <ul className="text-xs space-y-1.5 font-mono text-slate-300">
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Up to Rs. 3,00,000</span>
                  <span className="text-emerald-400 font-bold">NIL (0%)</span>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Rs. 3,00,001 - Rs. 7,00,000</span>
                  <span className="text-amber-400 font-bold">5%</span>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Rs. 7,00,001 - Rs. 10,00,000</span>
                  <span className="text-amber-400 font-bold">10%</span>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Rs. 10,00,001 - Rs. 12,00,000</span>
                  <span className="text-amber-400 font-bold">15%</span>
                </li>
                <li className="flex justify-between border-b border-slate-800 pb-1">
                  <span>Rs. 12,00,001 - Rs. 15,00,000</span>
                  <span className="text-rose-400 font-bold">20%</span>
                </li>
                <li className="flex justify-between">
                  <span>Above Rs. 15,00,000</span>
                  <span className="text-rose-400 font-bold">30%</span>
                </li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
              <h4 className="font-bold text-emerald-400 text-sm">Standard Deduction & Exemptions</h4>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  <span className="font-bold text-emerald-400 block">Rs. 75,000 Standard Deduction</span>
                  Auto-applied to salaried employees under New Tax Regime.
                </div>
                <div className="p-2.5 rounded bg-blue-500/10 border border-blue-500/20">
                  <span className="font-bold text-blue-400 block">Section 87A Rebate</span>
                  Full tax rebate for taxable income up to Rs. 7,00,000.
                </div>
              </div>
            </div>
          </div>
        </div>
      );

    case "compliance_rules":
      return (
        <div className="salary-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Statutory Compliance Matrix & Wage Code 2026
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="h-4 w-4" /> Code on Wages 2026
              </div>
              <p className="text-xs text-slate-300">Basic Pay + DA must constitute minimum 50% of total employee CTC.</p>
              <span className="text-[10px] font-mono text-emerald-400 block">Status: 100% Compliant</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-blue-500/30 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-bold text-sm">
                <Building className="h-4 w-4" /> EPF Statutory Ceiling
              </div>
              <p className="text-xs text-slate-300">Rs. 15,000/month standard statutory cap for employee & employer PF calculation.</p>
              <span className="text-[10px] font-mono text-blue-400 block">Capped at Rs. 1,800/mo</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/60 border border-purple-500/30 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <ShieldCheck className="h-4 w-4" /> ESI Statutory Threshold
              </div>
              <p className="text-xs text-slate-300">ESI applicable for gross monthly wages under Rs. 21,000 ceiling.</p>
              <span className="text-[10px] font-mono text-purple-400 block">Employee: 0.75% | Employer: 3.25%</span>
            </div>
          </div>
        </div>
      );

    case "version_history":
      return (
        <div className="salary-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <History className="h-4 w-4 text-purple-400" /> Structure Revision & Version Timeline ({currentSt?.versions.length || 0})
            </h3>
            {currentSt && <span className="text-xs font-mono text-blue-400">{currentSt.name}</span>}
          </div>

          {!currentSt || currentSt.versions.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">No version history recorded.</div>
          ) : (
            <div className="space-y-3">
              {currentSt.versions.map((ver) => (
                <div
                  key={ver.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/30 font-mono">
                        {ver.version}
                      </Badge>
                      <span className="text-xs font-bold text-white">{ver.changeSummary}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Effective From: <span className="font-mono text-slate-200">{ver.effectiveFrom}</span> • Author: {ver.createdBy}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={ver.status === "ACTIVE" ? "border-emerald-500/30 text-emerald-400" : "border-slate-700 text-slate-400"}>
                      {ver.status}
                    </Badge>
                    {ver.status !== "ACTIVE" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onRollbackVersion(currentSt.id, ver.id)}
                        className="h-7 text-xs border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                      >
                        Rollback to {ver.version}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );

    case "assignments":
      return (
        <div className="salary-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" /> Employee Assignment Matrix
            </h3>
            <span className="text-xs text-slate-400">Total Assigned Workforce Across Templates</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {structures.map((st) => (
              <div key={st.id} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-sm">{st.name}</h4>
                  <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/30 font-mono">
                    {st.employeesAssigned} Employees
                  </Badge>
                </div>
                <p className="text-xs text-slate-400">Department: {st.department} • Grade: {st.salaryGrade}</p>
                <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                  <span className="font-mono text-xs text-emerald-400 font-bold">{formatCurrency(st.annualCtc)} CTC</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAssignStructure(st)}
                    className="h-7 text-xs border-blue-500/30 text-blue-300 hover:bg-blue-500/20"
                  >
                    Re-assign Staff
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "audit_logs":
      return (
        <div className="salary-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4 text-cyan-400" /> Enterprise Salary Structure Audit Trail
            </h3>
          </div>

          <div className="salary-table-wrapper">
            <table className="salary-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Structure</th>
                  <th>Action</th>
                  <th>Actor</th>
                  <th>Details</th>
                  <th>IP Address</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No audit logs recorded.
                    </td>
                  </tr>
                ) : (
                  auditLogs.map((log) => (
                    <tr key={log.id}>
                      <td className="font-mono text-slate-400 text-xs">{log.timestamp}</td>
                      <td className="font-semibold text-blue-300">{log.structureName}</td>
                      <td>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          {log.action}
                        </span>
                      </td>
                      <td>
                        {log.actorName} ({log.actorRole})
                      </td>
                      <td className="text-slate-300 text-xs">{log.details}</td>
                      <td className="font-mono text-slate-500 text-xs">{log.ipAddress}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      );

    default:
      return null;
  }
};
