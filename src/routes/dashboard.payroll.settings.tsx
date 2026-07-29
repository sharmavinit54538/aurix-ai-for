import React, { useState, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PayrollBackButton } from "@/features/admin/payroll/components/PayrollBackButton";
import {
  ChevronLeft, ShieldAlert, Save, X, ChevronRight, Search,
  Building2, Calendar, Sliders, Coins, Percent, Clock, Receipt, Landmark,
  ShieldCheck, GitPullRequest, Bell, FileText, Lock
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

import "@/features/admin/payroll/components/settings/payroll-settings.css";

import {
  payrollSettingsApi,
  PayrollSettingsData,
  SettingsAuditHistoryItem,
} from "@/services/payrollSettingsApi";

import { PayrollSettingsHeader } from "@/features/admin/payroll/components/settings/PayrollSettingsHeader";
import { SettingsCategoryKey } from "@/features/admin/payroll/components/settings/PayrollSettingsSidebar";
import { GeneralSettingsSection } from "@/features/admin/payroll/components/settings/sections/GeneralSettingsSection";
import { TaxesStatutorySection } from "@/features/admin/payroll/components/settings/sections/TaxesStatutorySection";
import { PayrollCycleSection } from "@/features/admin/payroll/components/settings/sections/PayrollCycleSection";
import { SalaryComponentsSection } from "@/features/admin/payroll/components/settings/sections/SalaryComponentsSection";
import { OvertimeBonusesSection } from "@/features/admin/payroll/components/settings/sections/OvertimeBonusesSection";
import { BankingDisbursementSection } from "@/features/admin/payroll/components/settings/sections/BankingDisbursementSection";
import { AllowancesDeductionsSection } from "@/features/admin/payroll/components/settings/sections/AllowancesDeductionsSection";
import { LoansEncashmentSection } from "@/features/admin/payroll/components/settings/sections/LoansEncashmentSection";
import { ComplianceStatutorySection } from "@/features/admin/payroll/components/settings/sections/ComplianceStatutorySection";
import { ApprovalWorkflowsSection } from "@/features/admin/payroll/components/settings/sections/ApprovalWorkflowsSection";
import { AutomationNotificationsSection } from "@/features/admin/payroll/components/settings/sections/AutomationNotificationsSection";
import { DocumentTemplatesSection } from "@/features/admin/payroll/components/settings/sections/DocumentTemplatesSection";
import { SecurityAuditSection } from "@/features/admin/payroll/components/settings/sections/SecurityAuditSection";

import { StickySaveBar } from "@/features/admin/payroll/components/settings/StickySaveBar";
import { SettingsAuditModal } from "@/features/admin/payroll/components/settings/SettingsAuditModal";

export const Route = createFileRoute("/dashboard/payroll/settings")({
  head: () => ({ meta: [{ title: "Payroll Settings — Aurix AI Enterprise HRMS" }] }),
  component: PayrollSettingsPage,
});

const DEFAULT_PAYROLL_SETTINGS: PayrollSettingsData = {
  company_name: "Aurix AI Enterprise",
  currency: "INR",
  country: "India",
  timezone: "Asia/Kolkata",
  financial_year_start: "04-01",
  payroll_start_day: 1,
  payroll_end_day: 30,
  salary_payment_date: 1,
  auto_lock_payroll: true,
  enable_draft_payroll: true,
  enable_retro_payroll: true,
  pay_cycle_type: "MONTHLY",
  grace_period_days: 3,
  cutoff_date: 25,
  preview_days: 5,
  pf_enabled: true,
  employee_pf_rate: 12,
  employer_pf_rate: 12,
  pf_wage_ceiling: 15000,
  pf_on_full_basic: false,
  esi_enabled: true,
  employee_esi_rate: 0.75,
  employer_esi_rate: 3.25,
  esi_wage_ceiling: 21000,
  pt_state: "MH",
  pt_slabs: [],
  default_tax_regime: "NEW",
  lop_basis: "CALENDAR_DAYS",
  overtime_enabled: true,
  overtime_multiplier_holiday: 2.0,
  overtime_multiplier_weekend: 1.5,
  overtime_multiplier_night: 1.25,
  bank_name: "HDFC Bank",
  bank_ifsc: "HDFC0001234",
  salary_transfer_format: "NEFT",
  auto_email_payslips: true,
  auto_backup_payroll: true,
};

interface HubCardDef {
  id: SettingsCategoryKey;
  title: string;
  subtext: string;
  description: string;
  icon: any;
  categoryGroup: string;
  badgeText: string;
  accentColor: string;
}

const SETTINGS_HUB_CARDS: HubCardDef[] = [
  {
    id: "general",
    title: "General Settings",
    subtext: "Company identity & legal entity",
    description: "Configure company entity name, base currency, primary tax jurisdiction, timezone, and fiscal year start date.",
    icon: Building2,
    categoryGroup: "Core Settings",
    badgeText: "Entity & Currency",
    accentColor: "from-blue-500/20 via-indigo-500/15 to-purple-500/10 text-blue-400 border-blue-500/30",
  },
  {
    id: "cycle",
    title: "Payroll Cycle & Cutoff",
    subtext: "Pay frequency & grace periods",
    description: "Define pay frequency (Monthly/Bi-weekly), attendance cutoff day, LOP correction grace period, and draft preview days.",
    icon: Calendar,
    categoryGroup: "Core Settings",
    badgeText: "Frequency & Cutoffs",
    accentColor: "from-cyan-500/20 via-blue-500/15 to-teal-500/10 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "components",
    title: "Salary Components",
    subtext: "Basic, HRA, Special Allowance",
    description: "Manage component formulas, Basic pay % ceiling, HRA tax exemption rules, Dearness Allowance (DA), and statutory components.",
    icon: Sliders,
    categoryGroup: "Core Settings",
    badgeText: "Slab Formulations",
    accentColor: "from-violet-500/20 via-purple-500/15 to-indigo-500/10 text-violet-400 border-violet-500/30",
  },
  {
    id: "allowances",
    title: "Allowances & Deductions",
    subtext: "Taxable & non-taxable rules",
    description: "Configure Medical, LTA, Phone, Food Coupons, Voluntary Provident Fund (VPF), and custom insurance recoveries.",
    icon: Coins,
    categoryGroup: "Core Settings",
    badgeText: "Exemptions & Perks",
    accentColor: "from-amber-500/20 via-orange-500/15 to-yellow-500/10 text-amber-400 border-amber-500/30",
  },
  {
    id: "taxes",
    title: "Taxes & Statutory",
    subtext: "PF, ESI, PT & Tax Regimes",
    description: "Set Income Tax slabs (Old vs New regime), PF statutory wage ceiling (₹15,000), ESI threshold (₹21,000), and Professional Tax.",
    icon: Percent,
    categoryGroup: "Compliance & Tax",
    badgeText: "Income Tax & PF/ESI",
    accentColor: "from-sky-500/20 via-blue-500/15 to-cyan-500/10 text-sky-400 border-sky-500/30",
  },
  {
    id: "overtime",
    title: "Overtime & Bonuses",
    subtext: "Multipliers & spot awards",
    description: "Configure hourly overtime multipliers (1.5x/2.0x), night shift allowances, annual performance bonus pools, and spot awards.",
    icon: Clock,
    categoryGroup: "Compliance & Tax",
    badgeText: "OT Rates & Rewards",
    accentColor: "from-purple-500/20 via-pink-500/15 to-rose-500/10 text-purple-400 border-purple-500/30",
  },
  {
    id: "loans",
    title: "Encashment & Loans",
    subtext: "Leave encashment & advance EMIs",
    description: "Set maximum salary advance limits, EMI repayment tenure options, and annual earned leave encashment tax exemption rules.",
    icon: Receipt,
    categoryGroup: "Compliance & Tax",
    badgeText: "Advances & Encashment",
    accentColor: "from-emerald-500/20 via-teal-500/15 to-green-500/10 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "banking",
    title: "Banking & Disbursement",
    subtext: "IFSC, NEFT/RTGS gateway",
    description: "Manage company payout bank details, salary payment credit day of month, NEFT/RTGS batch file formatting, and email triggers.",
    icon: Landmark,
    categoryGroup: "Compliance & Tax",
    badgeText: "Bank Payout Gateway",
    accentColor: "from-teal-500/20 via-cyan-500/15 to-emerald-500/10 text-teal-400 border-teal-500/30",
  },
  {
    id: "compliance",
    title: "Compliance & Statutory",
    subtext: "LWF, Form 16 & statutory rules",
    description: "Monitor Labour Welfare Fund (LWF), PF ECR text file generator, Form 16 Part A & B automated bundling, and minimum wages check.",
    icon: ShieldCheck,
    categoryGroup: "Advanced Governance",
    badgeText: "ECR & Form 16",
    accentColor: "from-cyan-500/20 via-blue-500/15 to-teal-500/10 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "approval",
    title: "Approval Workflows",
    subtext: "Multi-level sign-off rules",
    description: "Set multi-tier approval chains, threshold amount sign-offs, CFO approval triggers, and dual-control discard locks.",
    icon: GitPullRequest,
    categoryGroup: "Advanced Governance",
    badgeText: "Sign-off Chains",
    accentColor: "from-green-500/20 via-emerald-500/15 to-teal-500/10 text-green-400 border-green-500/30",
  },
  {
    id: "automation",
    title: "Notifications & Automation",
    subtext: "Auto-dispatches & SMS/WhatsApp",
    description: "Configure automated password-protected PDF payslip email triggers, salary credit SMS alerts, WhatsApp advice, and daily backups.",
    icon: Bell,
    categoryGroup: "Advanced Governance",
    badgeText: "Auto Dispatch",
    accentColor: "from-blue-500/20 via-indigo-500/15 to-violet-500/10 text-blue-400 border-blue-500/30",
  },
  {
    id: "templates",
    title: "Document Templates",
    subtext: "PDF payslip layout & branding",
    description: "Select PDF payslip themes (Modern Dark/Minimal White), embed company logo branding header, and customize tax declaration sheets.",
    icon: FileText,
    categoryGroup: "Advanced Governance",
    badgeText: "PDF & Letterhead",
    accentColor: "from-violet-500/20 via-purple-500/15 to-pink-500/10 text-violet-400 border-violet-500/30",
  },
  {
    id: "security",
    title: "Security & Audit Controls",
    subtext: "AES-256 encryption & RBAC logs",
    description: "Enforce AES-256 salary field encryption, granular role-based access controls (RBAC), non-payroll compensation masking, and history logs.",
    icon: Lock,
    categoryGroup: "Advanced Governance",
    badgeText: "Encryption & Logs",
    accentColor: "from-rose-500/20 via-red-500/15 to-pink-500/10 text-rose-400 border-rose-500/30",
  },
];

export function PayrollSettingsPage() {
  const { user } = useAurix();
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/dashboard/payroll/settings" });

  // RBAC Access Verification
  const userRole = (user?.role || "").toLowerCase();
  const isEmployeeOnly = userRole === "employee";
  const isReadOnly = userRole === "hr_manager";

  // Active Category State for Dialog Modal
  const [activeCategory, setActiveCategory] = useState<SettingsCategoryKey | null>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const cat = (params.get("category") || params.get("tab")) as SettingsCategoryKey;
      if (cat && SETTINGS_HUB_CARDS.some((c) => c.id === cat)) {
        return cat;
      }
    }
    return null;
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleOpenModuleModal = (id: SettingsCategoryKey) => {
    setActiveCategory(id);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("category", id);
      window.history.replaceState({}, "", url.toString());
    }
  };

  const handleCloseModuleModal = () => {
    setActiveCategory(null);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("category");
      url.searchParams.delete("tab");
      window.history.replaceState({}, "", url.toString());
    }
  };

  // Local Form State
  const [formData, setFormData] = useState<PayrollSettingsData>(DEFAULT_PAYROLL_SETTINGS);
  const [initialData, setInitialData] = useState<PayrollSettingsData>(DEFAULT_PAYROLL_SETTINGS);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Modals state
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [auditHistory, setAuditHistory] = useState<SettingsAuditHistoryItem[]>([]);
  const [isLoadingAudit, setIsLoadingAudit] = useState(false);

  // TanStack Query for Payroll Settings
  const {
    data: settingsData,
    refetch,
  } = useQuery({
    queryKey: ["payroll-settings"],
    queryFn: () => payrollSettingsApi.getSettings(),
    enabled: !isEmployeeOnly,
    staleTime: 60000,
  });

  // Sync query data with local form state
  useEffect(() => {
    if (settingsData) {
      const merged = { ...DEFAULT_PAYROLL_SETTINGS, ...settingsData };
      setFormData(merged);
      setInitialData(merged);
      setHasUnsavedChanges(false);
    }
  }, [settingsData]);

  // Handle local state edits
  const handleFormChange = (updated: Partial<PayrollSettingsData>) => {
    if (isReadOnly) return;
    setFormData((prev) => {
      const next = { ...prev, ...updated };
      const changed = JSON.stringify(next) !== JSON.stringify(initialData);
      setHasUnsavedChanges(changed);
      return next;
    });
  };

  // Save Mutation
  const updateMutation = useMutation({
    mutationFn: (updated: Partial<PayrollSettingsData>) =>
      payrollSettingsApi.updateSettings(updated),
    onSuccess: (res) => {
      toast.success("Payroll configuration saved successfully.");
      const merged = { ...DEFAULT_PAYROLL_SETTINGS, ...res };
      setFormData(merged);
      setInitialData(merged);
      setHasUnsavedChanges(false);
      queryClient.invalidateQueries({ queryKey: ["payroll-settings"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update payroll configuration.");
    },
  });

  const handleSave = () => {
    if (isReadOnly) {
      toast.error("You have read-only access to payroll configuration.");
      return;
    }
    updateMutation.mutate(formData);
  };

  const handleDiscardChanges = () => {
    setFormData(initialData);
    setHasUnsavedChanges(false);
    toast.info("Unsaved changes discarded.");
  };

  const handleExport = async () => {
    try {
      const data = await payrollSettingsApi.exportSettings();
      const str = typeof data === "string" ? data : JSON.stringify(data, null, 2);
      const blob = new Blob([str], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `payroll-settings-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Configuration exported successfully.");
    } catch (err) {
      toast.error("Failed to export settings.");
    }
  };

  const handleImport = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".json";
    fileInput.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (evt) => {
        try {
          const json = JSON.parse(evt.target?.result as string);
          await payrollSettingsApi.importSettings(json);
          toast.success("Configuration imported successfully.");
          refetch();
        } catch (err) {
          toast.error("Invalid settings JSON file.");
        }
      };
      reader.readAsText(file);
    };
    fileInput.click();
  };

  const handleOpenAudit = async () => {
    setAuditModalOpen(true);
    setIsLoadingAudit(true);
    try {
      const logs = await payrollSettingsApi.getHistory();
      setAuditHistory(logs);
    } catch (err) {
      toast.error("Failed to load audit history.");
    } finally {
      setIsLoadingAudit(false);
    }
  };

  // Keyboard Shortcut: Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        if (hasUnsavedChanges && !isReadOnly) {
          handleSave();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasUnsavedChanges, isReadOnly, handleSave]);

  // Block Employee Role Access
  if (isEmployeeOnly) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-400 shadow-xl shadow-rose-500/5">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="mt-5 max-w-md space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-white/95">Access Restricted</h2>
          <p className="text-sm leading-relaxed text-slate-400">
            The Payroll Configuration Center is restricted to Super Admin, Admin, Payroll Admin, and Finance Admin roles.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate({ to: "/dashboard" })}
          className="mt-6 h-10 border-white/[0.08] bg-white/[0.03] px-6 text-sm text-slate-300 hover:bg-white/[0.06]"
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const filteredCards = SETTINGS_HUB_CARDS.filter((card) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      card.title.toLowerCase().includes(q) ||
      card.subtext.toLowerCase().includes(q) ||
      card.description.toLowerCase().includes(q) ||
      card.categoryGroup.toLowerCase().includes(q)
    );
  });

  const activeCardDef = SETTINGS_HUB_CARDS.find((c) => c.id === activeCategory);

  return (
    <div className="space-y-6">
      <PayrollBackButton />
      {/* ── Header Banner ── */}
      <PayrollSettingsHeader
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSave}
        onDiscard={handleDiscardChanges}
        onImport={handleImport}
        onExport={handleExport}
        onOpenAudit={handleOpenAudit}
        isSaving={updateMutation.isPending}
      />

      {/* ── PURE PAYROLL SETTINGS HUB GRID ── */}
      <div className="space-y-4">
        {/* Subheader & Search */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-bold text-white/95">Payroll Configuration Modules</h2>
            <p className="text-xs text-slate-400">
              Click on any configuration module below to configure its statutory parameters & preferences
            </p>
          </div>

          <div className="relative min-w-[280px]">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search configuration modules..."
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
                onClick={() => handleOpenModuleModal(card.id)}
                className="card-hover-nextgen group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d1526]/70 p-5 shadow-xl backdrop-blur-xl cursor-pointer transition-all duration-300 hover:border-indigo-500/40 hover:bg-[#0f1a30]"
              >
                <div className="space-y-4">
                  {/* Top: Icon + Badge */}
                  <div className="flex items-start justify-between">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl border bg-gradient-to-br shadow-md ${card.accentColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Badge variant="outline" className="border-white/10 bg-white/[0.04] text-[10px] font-semibold text-slate-300">
                      {card.badgeText}
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
                    Configure →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── MODULE CONFIGURATION DIALOG MODAL OVERLAY ── */}
      <Dialog open={!!activeCategory} onOpenChange={(open) => !open && handleCloseModuleModal()}>
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
                  {activeCardDef?.title || "Configure Module"}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400 mt-0.5">
                  {activeCardDef?.description}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {/* Dialog Form Body */}
          <div className="py-4">
            {activeCategory === "general" && (
              <GeneralSettingsSection data={formData} onChange={handleFormChange} isReadOnly={isReadOnly} />
            )}
            {activeCategory === "cycle" && (
              <PayrollCycleSection data={formData} onChange={handleFormChange} isReadOnly={isReadOnly} />
            )}
            {activeCategory === "components" && (
              <SalaryComponentsSection data={formData} onChange={handleFormChange} isReadOnly={isReadOnly} />
            )}
            {activeCategory === "allowances" && (
              <AllowancesDeductionsSection data={formData} onChange={handleFormChange} isReadOnly={isReadOnly} />
            )}
            {activeCategory === "taxes" && (
              <TaxesStatutorySection data={formData} onChange={handleFormChange} isReadOnly={isReadOnly} />
            )}
            {activeCategory === "overtime" && (
              <OvertimeBonusesSection data={formData} onChange={handleFormChange} isReadOnly={isReadOnly} />
            )}
            {activeCategory === "loans" && (
              <LoansEncashmentSection data={formData} onChange={handleFormChange} isReadOnly={isReadOnly} />
            )}
            {activeCategory === "banking" && (
              <BankingDisbursementSection data={formData} onChange={handleFormChange} isReadOnly={isReadOnly} />
            )}
            {activeCategory === "compliance" && (
              <ComplianceStatutorySection data={formData} onChange={handleFormChange} isReadOnly={isReadOnly} />
            )}
            {activeCategory === "approval" && (
              <ApprovalWorkflowsSection data={formData} onChange={handleFormChange} isReadOnly={isReadOnly} />
            )}
            {activeCategory === "automation" && (
              <AutomationNotificationsSection data={formData} onChange={handleFormChange} isReadOnly={isReadOnly} />
            )}
            {activeCategory === "templates" && (
              <DocumentTemplatesSection data={formData} onChange={handleFormChange} isReadOnly={isReadOnly} />
            )}
            {activeCategory === "security" && (
              <SecurityAuditSection data={formData} onChange={handleFormChange} isReadOnly={isReadOnly} />
            )}
          </div>

          {/* Dialog Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.06]">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCloseModuleModal}
              className="h-9 border-white/10 bg-white/[0.03] text-xs text-slate-300 hover:bg-white/[0.06]"
            >
              Close
            </Button>
            {!isReadOnly && (
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  handleSave();
                  handleCloseModuleModal();
                }}
                disabled={updateMutation.isPending}
                className="h-9 gap-1.5 bg-gradient-to-r from-indigo-600 to-blue-600 text-xs font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-blue-500 cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" />
                Save & Apply Settings
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Sticky Save Bar ── */}
      <StickySaveBar
        isVisible={hasUnsavedChanges}
        onSave={handleSave}
        onDiscard={handleDiscardChanges}
        isSaving={updateMutation.isPending}
      />

      {/* ── Audit Logs Modal ── */}
      <SettingsAuditModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        history={auditHistory}
        isLoading={isLoadingAudit}
      />
    </div>
  );
}
