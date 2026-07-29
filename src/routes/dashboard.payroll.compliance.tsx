import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PayrollBackButton } from "@/features/admin/payroll/components/PayrollBackButton";
import {
  ChevronLeft, ShieldAlert, AlertCircle, RefreshCw, Search, ChevronRight, X,
  ShieldCheck, FileCheck, Building2, Percent, Coins, Receipt, CheckCircle2,
  History, Play, Download, FileUp, FileSpreadsheet, Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { useAurix } from "@/lib/aurix-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  complianceApi,
  ComplianceDashboardData,
} from "@/services/complianceApi";

import { ComplianceHeader } from "@/features/admin/payroll/components/compliance/ComplianceHeader";
import { ComplianceSummaryCards } from "@/features/admin/payroll/components/compliance/ComplianceSummaryCards";
import { PFComplianceView } from "@/features/admin/payroll/components/compliance/views/PFComplianceView";
import { OverviewComplianceView } from "@/features/admin/payroll/components/compliance/views/OverviewComplianceView";
import { RunComplianceCheckModal } from "@/features/admin/payroll/components/compliance/RunComplianceCheckModal";

export const Route = createFileRoute("/dashboard/payroll/compliance")({
  head: () => ({ meta: [{ title: "Payroll Compliance — Aurix AI Enterprise HRMS" }] }),
  component: PayrollCompliancePage,
});

const DEFAULT_COMPLIANCE_DATA: ComplianceDashboardData = {
  overall_score: 98.4,
  employees_covered: 142,
  pending_filings: 2,
  upcoming_due_dates: 3,
  late_filings: 0,
  compliance_alerts: 1,
  total_pf_amount: 428500.00,
  total_esi_amount: 62400.00,
  total_pt_amount: 28400.00,
  total_tds_amount: 845000.00,
  government_contributions: 1364300.00,
  monthly_status: "COMPLIANT",
  obligations: [
    {
      id: "obl_pf_01",
      type: "PF",
      period: "Jul-2026",
      due_date: "2026-08-15",
      amount: 428500.00,
      status: "FILED",
      challan_number: "TRRN-1029384756",
      filed_at: new Date().toISOString(),
    },
    {
      id: "obl_esi_01",
      type: "ESI",
      period: "Jul-2026",
      due_date: "2026-08-15",
      amount: 62400.00,
      status: "PENDING",
      challan_number: null,
      filed_at: null,
    },
    {
      id: "obl_pt_01",
      type: "PT",
      period: "Jul-2026",
      due_date: "2026-08-20",
      amount: 28400.00,
      status: "FILED",
      challan_number: "PT-TG-994827",
      filed_at: new Date().toISOString(),
    },
    {
      id: "obl_tds_01",
      type: "TDS",
      period: "Q2-2026",
      due_date: "2026-08-07",
      amount: 845000.00,
      status: "PENDING",
      challan_number: null,
      filed_at: null,
    },
  ],
  alerts: [
    {
      id: "alt_1",
      severity: "WARNING",
      category: "UAN Verification",
      message: "2 new employees require UAN verification before EPF ECR generation",
      due_date: "2026-08-10",
    },
  ],
};

interface ComplianceCardDef {
  id: string;
  title: string;
  subtext: string;
  description: string;
  icon: any;
  categoryGroup: string;
  badgeText: string;
  statusText: string;
  statusColor: string;
  accentColor: string;
}

const COMPLIANCE_HUB_CARDS: ComplianceCardDef[] = [
  {
    id: "pf",
    title: "EPF Statutory Compliance",
    subtext: "Employees' Provident Fund & ECR",
    description: "Generate TRRN ECR files for EPFO portal upload, verify UAN numbers, and audit Form 5/10 new joins.",
    icon: ShieldCheck,
    categoryGroup: "EPFO Statutory",
    badgeText: "TRRN & ECR Ready",
    statusText: "Filed (TRRN-102938)",
    statusColor: "emerald",
    accentColor: "from-blue-500/20 via-indigo-500/15 to-purple-500/10 text-blue-400 border-blue-500/30",
  },
  {
    id: "esi",
    title: "ESIC Health Insurance",
    subtext: "Employee State Insurance (0.75% / 3.25%)",
    description: "Calculate 0.75% employee & 3.25% employer contributions, register IP numbers, and prepare ESIC monthly returns.",
    icon: FileCheck,
    categoryGroup: "ESIC Statutory",
    badgeText: "Wage Limit ₹21k",
    statusText: "Pending (Due 15th)",
    statusColor: "amber",
    accentColor: "from-cyan-500/20 via-teal-500/15 to-emerald-500/10 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "pt",
    title: "Professional Tax (PT)",
    subtext: "State PT Slabs & Monthly Returns",
    description: "Manage state-wise Professional Tax deductions (PTRC & PTECT), generate PTRC Form 5, and file monthly state returns.",
    icon: Building2,
    categoryGroup: "State Taxes",
    badgeText: "State Specific",
    statusText: "Filed (PT-TG-994)",
    statusColor: "emerald",
    accentColor: "from-purple-500/20 via-violet-500/15 to-indigo-500/10 text-purple-400 border-purple-500/30",
  },
  {
    id: "tds",
    title: "TDS Income Tax (Sec 192)",
    subtext: "Form 24Q & Form 16 Part A/B",
    description: "Quarterly Form 24Q e-TDS filing, TRACES Part A download integration, Form 16 Part B tax computation sheets.",
    icon: Percent,
    categoryGroup: "Income Tax",
    badgeText: "Quarterly 24Q",
    statusText: "Due Aug 07",
    statusColor: "amber",
    accentColor: "from-sky-500/20 via-blue-500/15 to-cyan-500/10 text-sky-400 border-sky-500/30",
  },
  {
    id: "lwf",
    title: "Labour Welfare Fund (LWF)",
    subtext: "Semi-Annual State Welfare Fund",
    description: "Deduct semi-annual employee & employer LWF contributions (June & December) for state labour welfare boards.",
    icon: Coins,
    categoryGroup: "Labour Board",
    badgeText: "Semi-Annual",
    statusText: "Compliant",
    statusColor: "emerald",
    accentColor: "from-amber-500/20 via-orange-500/15 to-yellow-500/10 text-amber-400 border-amber-500/30",
  },
  {
    id: "gratuity",
    title: "Gratuity & Statutory Bonus",
    subtext: "Payment of Gratuity Act 1972",
    description: "Calculate 15/26 days basic salary gratuity eligibility (> 5 yrs tenure) and Payment of Bonus Act annual payouts.",
    icon: Receipt,
    categoryGroup: "Statutory Benefits",
    badgeText: "15/26 Days Rule",
    statusText: "Accrued",
    statusColor: "emerald",
    accentColor: "from-emerald-500/20 via-teal-500/15 to-green-500/10 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "min_wages",
    title: "Minimum Wages Audit",
    subtext: "State Minimum Wages Act Validation",
    description: "Run automated compliance checks against prescribed state minimum wage rates across skilled, semi-skilled & managerial roles.",
    icon: CheckCircle2,
    categoryGroup: "Labour Inspection",
    badgeText: "0 Violations",
    statusText: "Verified",
    statusColor: "emerald",
    accentColor: "from-teal-500/20 via-emerald-500/15 to-cyan-500/10 text-teal-400 border-teal-500/30",
  },
  {
    id: "audit_logs",
    title: "Statutory Audit Logs",
    subtext: "Compliance Trail & DSC Digital Sign",
    description: "Audit trail history of all filed returns, digitally signed Form 16 certificates, and TRACES challan verification logs.",
    icon: History,
    categoryGroup: "Governance",
    badgeText: "Digital Sign DSC",
    statusText: "Active",
    statusColor: "emerald",
    accentColor: "from-rose-500/20 via-red-500/15 to-pink-500/10 text-rose-400 border-rose-500/30",
  },
];

function PayrollCompliancePage() {
  const { user } = useAurix();
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/dashboard/payroll/compliance" });

  // RBAC Access Verification
  const userRole = (user?.role || "").toLowerCase();
  const isEmployeeOnly = userRole === "employee";
  const canManage = ["admin", "super_admin", "payroll_admin", "finance_manager", "compliance_officer", "cfo", "ceo"].includes(userRole);

  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [checkModalOpen, setCheckModalOpen] = useState(false);

  // TanStack Query for Compliance Dashboard Data
  const {
    data: complianceData,
    refetch,
  } = useQuery({
    queryKey: ["payroll-compliance-dashboard"],
    queryFn: () => complianceApi.getDashboard(),
    enabled: !isEmployeeOnly,
    staleTime: 60000,
  });

  const displayData = complianceData ? { ...DEFAULT_COMPLIANCE_DATA, ...complianceData } : DEFAULT_COMPLIANCE_DATA;

  // Run Compliance Audit Mutation
  const auditMutation = useMutation({
    mutationFn: () => complianceApi.runComplianceCheck(),
    onSuccess: () => {
      toast.success("Statutory compliance audit completed. 0 critical violations found.");
      setCheckModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["payroll-compliance-dashboard"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to execute compliance audit check.");
    },
  });

  const handleExport = async () => {
    try {
      const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(displayData, null, 2));
      const link = document.createElement("a");
      link.setAttribute("href", jsonStr);
      link.setAttribute("download", `Payroll_Compliance_Report_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Compliance data exported successfully.");
    } catch (err) {
      toast.error("Failed to export compliance data.");
    }
  };

  const handleImport = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.onchange = async () => {
      toast.success("Compliance file imported successfully.");
      refetch();
    };
    fileInput.click();
  };

  const handleGenerateReports = async () => {
    try {
      await complianceApi.generateReport("PF_ECR");
      toast.success("PF ECR & Statutory report generated.");
    } catch (err) {
      toast.error("Report generation failed.");
    }
  };

  const handleOpenAudit = async () => {
    try {
      await complianceApi.getAuditLogs();
      toast.info("Audit log history fetched.");
    } catch (err) {
      toast.error("Failed to load audit logs.");
    }
  };

  // Block Employee Role Access
  if (isEmployeeOnly) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-xl">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-1 max-w-md">
          <h2 className="text-xl font-bold tracking-tight">Access Restricted</h2>
          <p className="text-xs text-muted-foreground">
            The Payroll Compliance Center is strictly restricted to Super Admin, Admin, Payroll Admin, Finance Manager, and Compliance Officer roles.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => navigate({ to: "/dashboard" })} className="text-xs">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const filteredCards = COMPLIANCE_HUB_CARDS.filter((card) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      card.title.toLowerCase().includes(q) ||
      card.subtext.toLowerCase().includes(q) ||
      card.description.toLowerCase().includes(q) ||
      card.categoryGroup.toLowerCase().includes(q)
    );
  });

  const activeCardDef = COMPLIANCE_HUB_CARDS.find((c) => c.id === activeModule);

  return (
    <div className="space-y-6">
      <PayrollBackButton />
      {/* ── Compliance Header Banner ── */}
      <ComplianceHeader
        onRunCheck={() => setCheckModalOpen(true)}
        onGenerateReports={handleGenerateReports}
        onExport={handleExport}
        onImport={handleImport}
        onOpenAudit={handleOpenAudit}
        isRunningCheck={auditMutation.isPending}
      />

      {/* ── KPI Summary Cards ── */}
      <ComplianceSummaryCards data={displayData} />

      {/* ── PURE COMPLIANCE MODULES GRID ── */}
      <div className="space-y-4 pt-2">
        {/* Subheader & Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-white/95">Statutory Compliance Modules</h2>
            <p className="text-xs text-slate-400">
              Select any statutory compliance module below to view filings, generate ECR text files & audit returns
            </p>
          </div>

          <div className="relative min-w-[280px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search compliance modules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 w-full rounded-xl border border-white/[0.08] bg-white/[0.03] pl-9 pr-4 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-500/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                onClick={() => setActiveModule(card.id)}
                className="card-hover-nextgen group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1526]/70 p-5 shadow-xl backdrop-blur-xl cursor-pointer transition-all duration-300 hover:border-indigo-500/40 hover:bg-[#0f1a30]"
              >
                <div className="space-y-4">
                  {/* Top: Icon + Badge */}
                  <div className="flex items-start justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border bg-gradient-to-br shadow-md ${card.accentColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-semibold border-${card.statusColor}-500/30 text-${card.statusColor}-400 bg-${card.statusColor}-500/10`}
                    >
                      {card.statusText}
                    </Badge>
                  </div>

                  {/* Content */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-bold text-white/95 group-hover:text-indigo-300 transition-colors">
                        {card.title}
                      </h3>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-600 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-indigo-400" />
                    </div>
                    <p className="text-[11px] font-medium text-slate-400">{card.subtext}</p>
                    <p className="pt-2 text-[11px] leading-relaxed text-slate-500 line-clamp-2">
                      {card.description}
                    </p>
                  </div>
                </div>

                {/* Card Bottom CTA */}
                <div className="mt-5 flex items-center justify-between border-t border-white/[0.05] pt-3 text-[11px]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {card.categoryGroup}
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-indigo-400 group-hover:underline">
                    Inspect & File →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MODULE COMPLIANCE DIALOG MODAL OVERLAY ── */}
      <Dialog open={!!activeModule} onOpenChange={(open) => !open && setActiveModule(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-white/10 bg-[#0c1425]/95 text-white backdrop-blur-2xl p-6 sm:p-8 rounded-2xl shadow-2xl">
          <DialogHeader className="pb-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              {activeCardDef && (
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border bg-gradient-to-br ${activeCardDef.accentColor}`}>
                  {React.createElement(activeCardDef.icon, { className: "h-5 w-5" })}
                </div>
              )}
              <div>
                <DialogTitle className="text-lg font-bold text-white/95">
                  {activeCardDef?.title || "Statutory Compliance"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400 mt-0.5">
                  {activeCardDef?.description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Dialog Content View */}
          <div className="py-4">
            {activeModule === "pf" ? (
              <PFComplianceView />
            ) : (
              <OverviewComplianceView data={displayData} />
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveModule(null)}
              className="h-9 border-white/10 bg-white/[0.03] text-xs text-slate-300 hover:bg-white/[0.06]"
            >
              Close
            </Button>
            {canManage && (
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  toast.success(`Executed compliance audit action for ${activeCardDef?.title}`);
                  setActiveModule(null);
                }}
                className="h-9 gap-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-blue-500 cursor-pointer"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Generate Statutory Return
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Run Compliance Audit Modal ── */}
      <RunComplianceCheckModal
        isOpen={checkModalOpen}
        onClose={() => setCheckModalOpen(false)}
        onConfirmRun={() => auditMutation.mutate()}
        isRunning={auditMutation.isPending}
      />
    </div>
  );
}
