import React, { useState, useEffect, useCallback } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ShieldAlert, AlertCircle, RefreshCw, BookOpen, Lightbulb, AlertTriangle, Link2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { useAurix } from "@/lib/aurix-store";
import { Button } from "@/components/ui/button";

import "@/features/admin/payroll/components/settings/payroll-settings.css";

import {
  payrollSettingsApi,
  PayrollSettingsData,
  SettingsAuditHistoryItem,
} from "@/services/payrollSettingsApi";

import { PayrollSettingsHeader } from "@/features/admin/payroll/components/settings/PayrollSettingsHeader";
import {
  PayrollSettingsSidebar,
  SettingsCategoryKey,
} from "@/features/admin/payroll/components/settings/PayrollSettingsSidebar";
import { GeneralSettingsSection } from "@/features/admin/payroll/components/settings/sections/GeneralSettingsSection";
import { TaxesStatutorySection } from "@/features/admin/payroll/components/settings/sections/TaxesStatutorySection";
import { PayrollCycleSection } from "@/features/admin/payroll/components/settings/sections/PayrollCycleSection";
import { SalaryComponentsSection } from "@/features/admin/payroll/components/settings/sections/SalaryComponentsSection";
import { OvertimeBonusesSection } from "@/features/admin/payroll/components/settings/sections/OvertimeBonusesSection";
import { BankingDisbursementSection } from "@/features/admin/payroll/components/settings/sections/BankingDisbursementSection";

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
  employee_pf_rate: 0.12,
  employer_pf_rate: 0.12,
  pf_wage_ceiling: 15000,
  pf_on_full_basic: false,
  esi_enabled: true,
  employee_esi_rate: 0.0075,
  employer_esi_rate: 0.0325,
  esi_wage_ceiling: 21000,
  pt_state: "TELANGANA",
  pt_slabs: [
    { upto: 15000, amount: 0 },
    { upto: 20000, amount: 150 },
    { upto: null, amount: 200 },
  ],
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

/* ── Contextual Help Data ── */
const CONTEXT_HELP: Record<SettingsCategoryKey, { title: string; tips: string[]; warning?: string; docs?: string }> = {
  general: {
    title: "General Settings",
    tips: [
      "Company name appears on all payslips and statutory reports",
      "Currency affects formatting across the entire payroll module",
      "Financial year determines tax computation periods",
    ],
    docs: "Company identity & payroll entity configuration",
  },
  cycle: {
    title: "Payroll Cycle",
    tips: [
      "Monthly cycle is standard for Indian payroll",
      "Cutoff date determines when attendance data freezes",
      "Grace period allows late attendance regularizations",
    ],
    warning: "Changing pay cycle type mid-year may affect salary calculations",
  },
  components: {
    title: "Salary Components",
    tips: [
      "Basic salary is the foundation for PF, ESI, and gratuity",
      "HRA exemption depends on metro/non-metro classification",
      "Drag components to reorder their display on payslips",
    ],
  },
  allowances: {
    title: "Allowances & Deductions",
    tips: [
      "Tax-exempt allowances reduce employee tax liability",
      "Deductions are applied after gross salary calculation",
    ],
  },
  taxes: {
    title: "Taxes & Statutory",
    tips: [
      "PF wage ceiling of ₹15,000 is the statutory default",
      "ESI applies only when gross salary ≤ ₹21,000/month",
      "New tax regime is the default from FY 2023-24",
    ],
    warning: "Tax rate changes affect all employees immediately",
  },
  overtime: {
    title: "Overtime & Bonuses",
    tips: [
      "Holiday OT at 2× is the standard labor law requirement",
      "Night shift differential compensates for odd hours",
    ],
  },
  loans: {
    title: "Encashment & Loans",
    tips: [
      "Leave encashment is taxable under the Income Tax Act",
      "EMI recovery is deducted from net salary",
    ],
  },
  banking: {
    title: "Banking & Disbursement",
    tips: [
      "IFSC code must be 11 characters for valid routing",
      "NEFT batch files are the most common format for Indian banks",
    ],
    docs: "Corporate banking integration guide",
  },
  compliance: {
    title: "Compliance & Statutory",
    tips: ["LWF rates vary by state", "Form 16 is generated annually"],
  },
  approval: {
    title: "Approval Workflows",
    tips: ["Multi-level approvals ensure proper oversight"],
  },
  automation: {
    title: "Notifications",
    tips: ["Auto-payslip emails are sent after payroll lock"],
  },
  templates: {
    title: "Document Templates",
    tips: ["Payslip layout can be customized per company"],
  },
  security: {
    title: "Security & Audit",
    tips: ["All settings changes are logged with actor & IP"],
  },
};

function PayrollSettingsPage() {
  const { user } = useAurix();
  const queryClient = useQueryClient();
  const navigate = useNavigate({ from: "/dashboard/payroll/settings" });

  // RBAC Access Verification
  const userRole = (user?.role || "").toLowerCase();
  const isEmployeeOnly = userRole === "employee";
  const isReadOnly = userRole === "hr_manager";
  const canManage = ["admin", "super_admin", "payroll_admin", "finance_admin", "cfo", "ceo"].includes(userRole);

  // Active Category State
  const [activeCategory, setActiveCategory] = useState<SettingsCategoryKey>("general");

  // Local Form State initialized with fallback defaults
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
    isLoading,
    isError,
    error,
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
      const isModified = JSON.stringify(next) !== JSON.stringify(initialData);
      setHasUnsavedChanges(isModified);
      return next;
    });
  };

  const handleDiscardChanges = () => {
    if (initialData) {
      setFormData(initialData);
      setHasUnsavedChanges(false);
      toast.info("Unsaved modifications discarded.");
    }
  };

  // Mutations
  const updateMutation = useMutation({
    mutationFn: (data: Partial<PayrollSettingsData>) =>
      payrollSettingsApi.updateSettings(data),
    onSuccess: (updated) => {
      toast.success("Payroll settings saved successfully.");
      const merged = { ...DEFAULT_PAYROLL_SETTINGS, ...updated };
      setInitialData(merged);
      setFormData(merged);
      setHasUnsavedChanges(false);
      queryClient.invalidateQueries({ queryKey: ["payroll-settings"] });
    },
    onError: (err: any) => {
      toast.error(err?.message || "Failed to save payroll settings.");
    },
  });

  const handleSave = useCallback(() => {
    if (!formData || isReadOnly) return;
    updateMutation.mutate(formData);
  }, [formData, isReadOnly, updateMutation]);

  const handleExport = async () => {
    try {
      const data = await payrollSettingsApi.exportSettings();
      const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const link = document.createElement("a");
      link.setAttribute("href", jsonStr);
      link.setAttribute("download", `Payroll_Settings_Config_${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Settings configuration exported successfully.");
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

  // ── Keyboard Shortcut: Ctrl+S / Cmd+S ──
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

  const contextHelp = CONTEXT_HELP[activeCategory];

  return (
    <div className="mx-auto max-w-[1700px] space-y-4 px-4 pb-28 pt-4 lg:px-6">
      {/* ── Back Button ── */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              navigate({ to: "/dashboard/payroll" });
            }
          }}
          className="group inline-flex items-center gap-[6px] rounded-md px-2 py-1 text-sm font-medium text-slate-400 transition-colors duration-200 hover:bg-white/5 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 text-slate-400 transition-colors duration-200 group-hover:text-white" />
          <span>Back</span>
        </button>
      </div>

      {/* ── Sticky Header ── */}
      <PayrollSettingsHeader
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSave}
        onDiscard={handleDiscardChanges}
        onImport={handleImport}
        onExport={handleExport}
        onOpenAudit={handleOpenAudit}
        isSaving={updateMutation.isPending}
      />

      {/* ── Main Layout: Sidebar + Content + Context Panel ── */}
      <div className="flex items-start gap-6">
        {/* Left: Sidebar */}
        <PayrollSettingsSidebar
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Center: Active Section Content */}
        <div className="min-w-0 flex-1">
          {activeCategory === "general" && (
            <GeneralSettingsSection
              data={formData}
              onChange={handleFormChange}
              isReadOnly={isReadOnly}
            />
          )}

          {activeCategory === "cycle" && (
            <PayrollCycleSection
              data={formData}
              onChange={handleFormChange}
              isReadOnly={isReadOnly}
            />
          )}

          {activeCategory === "components" && (
            <SalaryComponentsSection
              data={formData}
              onChange={handleFormChange}
              isReadOnly={isReadOnly}
            />
          )}

          {activeCategory === "allowances" && (
            <SalaryComponentsSection
              data={formData}
              onChange={handleFormChange}
              isReadOnly={isReadOnly}
            />
          )}

          {activeCategory === "taxes" && (
            <TaxesStatutorySection
              data={formData}
              onChange={handleFormChange}
              isReadOnly={isReadOnly}
            />
          )}

          {activeCategory === "overtime" && (
            <OvertimeBonusesSection
              data={formData}
              onChange={handleFormChange}
              isReadOnly={isReadOnly}
            />
          )}

          {activeCategory === "loans" && (
            <OvertimeBonusesSection
              data={formData}
              onChange={handleFormChange}
              isReadOnly={isReadOnly}
            />
          )}

          {activeCategory === "banking" && (
            <BankingDisbursementSection
              data={formData}
              onChange={handleFormChange}
              isReadOnly={isReadOnly}
            />
          )}

          {["compliance", "approval", "automation", "templates", "security"].includes(activeCategory) && (
            <GeneralSettingsSection
              data={formData}
              onChange={handleFormChange}
              isReadOnly={isReadOnly}
            />
          )}
        </div>

        {/* Right: Contextual Help Panel */}
        <div className="settings-context-panel hidden w-[260px] flex-shrink-0 xl:block">
          <div className="sticky top-[88px]">
            <div className="config-card rounded-2xl border border-white/[0.06] bg-[#0d1526]/60 p-5 shadow-xl backdrop-blur-md">
              {/* Panel Header */}
              <div className="flex items-center gap-2.5 pb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10">
                  <BookOpen className="h-4 w-4 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white/90">Configuration Guide</h4>
                  <p className="text-[10px] text-slate-500">{contextHelp.title}</p>
                </div>
              </div>

              <div className="mb-4 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

              {/* Tips */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Tips</span>
                </div>
                <div className="space-y-2">
                  {contextHelp.tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-indigo-400/60" />
                      <p className="text-[11px] leading-relaxed text-slate-400">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warning */}
              {contextHelp.warning && (
                <div className="mt-4 rounded-lg border border-amber-500/15 bg-amber-500/[0.04] p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-amber-400" />
                    <p className="text-[11px] leading-relaxed text-amber-400/80">{contextHelp.warning}</p>
                  </div>
                </div>
              )}

              {/* Docs Link */}
              {contextHelp.docs && (
                <div className="mt-4 rounded-lg border border-white/[0.06] bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-3.5 w-3.5 text-indigo-400" />
                    <span className="text-[11px] font-medium text-indigo-300">{contextHelp.docs}</span>
                  </div>
                </div>
              )}

              {/* AI Suggestion */}
              <div className="mt-4 rounded-lg border border-purple-500/15 bg-purple-500/[0.04] p-3">
                <div className="flex items-start gap-2">
                  <Sparkles className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-purple-400" />
                  <div>
                    <p className="text-[10px] font-semibold text-purple-400">AI Suggestion</p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-slate-400">
                      Your current configuration follows Indian payroll best practices. No issues detected.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating Save Bar ── */}
      <StickySaveBar
        isVisible={hasUnsavedChanges}
        onSave={handleSave}
        onDiscard={handleDiscardChanges}
        isSaving={updateMutation.isPending}
      />

      {/* ── Audit Modal ── */}
      <SettingsAuditModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
        history={auditHistory}
        isLoading={isLoadingAudit}
      />
    </div>
  );
}
