import React, { useEffect, useState, useCallback } from "react";
import { Banknote, Save, RotateCcw, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fetchPayrollSettings, updatePayrollSettings, isMissingApiError } from "../../api";
import { statutoryApi } from "@/features/payroll/api/statutoryApi";
import type { PayrollSettingsForm, SalaryComponentItem } from "../../types";
import { UnsavedChangesBanner } from "../UnsavedChangesBanner";

interface PayrollSectionProps {
  canEdit: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

/**
 * Suggested template components for standard Indian CTC breakup.
 * Never auto-applied — explicitly labeled as optional suggested template.
 */
export const SUGGESTED_TEMPLATE_COMPONENTS: SalaryComponentItem[] = [
  { name: "Basic Salary", percentageOfCtc: 40, taxExempt: false, type: "earning" },
  { name: "House Rent Allowance (HRA)", percentageOfCtc: 20, taxExempt: true, type: "earning" },
  { name: "Special Allowance", percentageOfCtc: 30, taxExempt: false, type: "earning" },
  { name: "Conveyance Allowance", fixedMonthly: 1600, taxExempt: true, type: "earning" },
  { name: "Provident Fund (Employee)", percentageOfCtc: 12, taxExempt: true, type: "deduction" },
];

const INITIAL_NEUTRAL_STATE: PayrollSettingsForm = {
  payFrequency: "monthly",
  currency: "INR (₹)",
  salaryStructureName: "",
  components: [],
  pfEnabled: false,
  pfEmployeePercent: 0,
  pfEmployerPercent: 0,
  pfWageCeiling: 0,
  esiEnabled: false,
  esiEmployeePercent: 0,
  esiEmployerPercent: 0,
  esiWageCeiling: 0,
  ptEnabled: false,
  ptState: "",
  tdsWindowOpen: false,
  tdsDefaultRegime: "new",
  payslipGenerationDay: 1,
  passwordProtectedPayslips: false,
  showLeaveBalanceOnPayslip: false,
};

export function PayrollSection({ canEdit, onDirtyChange }: PayrollSectionProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [initialData, setInitialData] = useState<PayrollSettingsForm | null>(null);
  const [formData, setFormData] = useState<PayrollSettingsForm>(INITIAL_NEUTRAL_STATE);

  const isDirty = initialData ? JSON.stringify(initialData) !== JSON.stringify(formData) : false;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [settingsData, statConfig] = await Promise.all([
        fetchPayrollSettings().catch((err: unknown) => {
          if (isMissingApiError(err)) return null;
          throw err;
        }),
        statutoryApi.getStatutoryConfig().catch(() => null),
      ]);

      const base = settingsData || INITIAL_NEUTRAL_STATE;

      // Populate statutory compliance rates from statutory config (/api/v2/payroll/statutory/config)
      const resolvedForm: PayrollSettingsForm = {
        ...base,
        components: base.components || [],
        pfEmployeePercent:
          base.pfEmployeePercent ||
          (statConfig ? Math.round(statConfig.pf.employeeContributionRate * 100 * 100) / 100 : 0),
        pfEmployerPercent:
          base.pfEmployerPercent ||
          (statConfig
            ? Math.round((statConfig.pf.employerEpfrate + statConfig.pf.employerEpsRate) * 100 * 100) / 100
            : 0),
        pfWageCeiling:
          base.pfWageCeiling ||
          (statConfig ? Math.round(statConfig.pf.wageCeilingPaise / 100) : 0),
        esiEmployeePercent:
          base.esiEmployeePercent ||
          (statConfig ? Math.round(statConfig.esi.employeeContributionRate * 100 * 100) / 100 : 0),
        esiEmployerPercent:
          base.esiEmployerPercent ||
          (statConfig ? Math.round(statConfig.esi.employerContributionRate * 100 * 100) / 100 : 0),
        esiWageCeiling:
          base.esiWageCeiling ||
          (statConfig ? Math.round(statConfig.esi.grossWageCeilingPaise / 100) : 0),
        pfEnabled: base.pfEnabled ?? Boolean(statConfig?.pf),
        esiEnabled: base.esiEnabled ?? Boolean(statConfig?.esi),
      };

      setInitialData(resolvedForm);
      setFormData(resolvedForm);
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message || "Failed to load payroll configuration from backend.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canEdit) return;

    setSubmitting(true);
    try {
      await updatePayrollSettings(formData);
      setInitialData(formData);
      toast.success("Payroll configuration updated successfully!");
    } catch (err: unknown) {
      if (isMissingApiError(err)) {
        toast.error("Statutory payroll configuration API is not implemented on backend.");
      } else {
        const msg = (err as { message?: string })?.message || "Failed to update payroll settings.";
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56 rounded-lg" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="rounded-2xl">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-sm font-semibold">Failed to load payroll configuration</AlertTitle>
        <AlertDescription className="text-xs flex items-center justify-between mt-2">
          <span>{error}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => void loadData()}
            className="h-8 text-xs cursor-pointer"
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Salary Structure & Frequency Card */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Salary Structure & Cycles
            </h3>
            <p className="text-xs text-muted-foreground">
              CTC apportionment and scheduled disbursal frequency.
            </p>
          </div>
          <Banknote className="h-4 w-4 text-primary shrink-0" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="payroll-cycle" className="text-xs font-medium">
              Disbursal Frequency
            </Label>
            <Select
              value={formData.payFrequency}
              onValueChange={(v: PayrollSettingsForm["payFrequency"]) =>
                setFormData({ ...formData, payFrequency: v })
              }
              disabled={!canEdit}
            >
              <SelectTrigger id="payroll-cycle" className="w-full">
                <SelectValue placeholder="Select cycle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly">Monthly Cycle (End of Month)</SelectItem>
                <SelectItem value="biweekly">Bi-Weekly Cycle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="payroll-currency" className="text-xs font-medium">
              Payroll Currency
            </Label>
            <Input
              id="payroll-currency"
              value={formData.currency}
              disabled
              className="bg-muted/30"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="structure-name" className="text-xs font-medium">
              Structure Profile
            </Label>
            <Input
              id="structure-name"
              value={formData.salaryStructureName}
              onChange={(e) => setFormData({ ...formData, salaryStructureName: e.target.value })}
              disabled={!canEdit}
            />
          </div>
        </div>

        {/* Components Overview */}
        <div className="mt-5 space-y-2">
          <Label className="text-xs font-semibold text-foreground">
            Standard CTC Earnings & Deductions
          </Label>
          <div className="divide-y divide-border/60 rounded-xl border border-border bg-card/80 overflow-hidden">
            {formData.components.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground space-y-2">
                <div>No salary components configured in backend.</div>
                {canEdit && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFormData({ ...formData, components: SUGGESTED_TEMPLATE_COMPONENTS })
                    }
                    className="h-7 text-xs cursor-pointer"
                  >
                    Load Suggested Template (Optional)
                  </Button>
                )}
              </div>
            ) : (
              formData.components.map((c, i) => (
                <div key={i} className="flex items-center justify-between p-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-medium text-foreground">{c.name}</span>
                    <span className="ml-2 text-[10px] text-muted-foreground uppercase tracking-wider">
                      {c.taxExempt ? "Tax Exempt" : "Taxable"}
                    </span>
                  </div>
                  <div className="font-mono text-muted-foreground">
                    {c.percentageOfCtc
                      ? `${c.percentageOfCtc}% of CTC`
                      : `₹${c.fixedMonthly}/mo fixed`}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Statutory Contributions (PF & ESI) */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 border-b border-border/60 pb-4">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Statutory Contributions (PF & ESI)
          </h3>
          <p className="text-xs text-muted-foreground">
            Mandatory Indian labor compliance rates and wage ceilings.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {/* Provident Fund */}
          <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-foreground">
                  Employees' Provident Fund (EPF)
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Applicable under EPF & MP Act, 1952.
                </p>
              </div>
              <Switch
                checked={formData.pfEnabled}
                onCheckedChange={(c) => setFormData({ ...formData, pfEnabled: c })}
                disabled={!canEdit}
              />
            </div>
            {formData.pfEnabled && (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60">
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Employee %</Label>
                  <Input
                    type="number"
                    value={formData.pfEmployeePercent}
                    onChange={(e) =>
                      setFormData({ ...formData, pfEmployeePercent: Number(e.target.value) })
                    }
                    disabled={!canEdit}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Employer %</Label>
                  <Input
                    type="number"
                    value={formData.pfEmployerPercent}
                    onChange={(e) =>
                      setFormData({ ...formData, pfEmployerPercent: Number(e.target.value) })
                    }
                    disabled={!canEdit}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Ceiling (₹)</Label>
                  <Input
                    type="number"
                    value={formData.pfWageCeiling}
                    onChange={(e) =>
                      setFormData({ ...formData, pfWageCeiling: Number(e.target.value) })
                    }
                    disabled={!canEdit}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* ESI */}
          <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-xs font-semibold text-foreground">
                  Employee State Insurance (ESI)
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Medical and disability insurance for eligible wages.
                </p>
              </div>
              <Switch
                checked={formData.esiEnabled}
                onCheckedChange={(c) => setFormData({ ...formData, esiEnabled: c })}
                disabled={!canEdit}
              />
            </div>
            {formData.esiEnabled && (
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/60">
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Employee %</Label>
                  <Input
                    type="number"
                    step="0.05"
                    value={formData.esiEmployeePercent}
                    onChange={(e) =>
                      setFormData({ ...formData, esiEmployeePercent: Number(e.target.value) })
                    }
                    disabled={!canEdit}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Employer %</Label>
                  <Input
                    type="number"
                    step="0.05"
                    value={formData.esiEmployerPercent}
                    onChange={(e) =>
                      setFormData({ ...formData, esiEmployerPercent: Number(e.target.value) })
                    }
                    disabled={!canEdit}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground">Ceiling (₹)</Label>
                  <Input
                    type="number"
                    value={formData.esiWageCeiling}
                    onChange={(e) =>
                      setFormData({ ...formData, esiWageCeiling: Number(e.target.value) })
                    }
                    disabled={!canEdit}
                    className="h-8 text-xs"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Tax & TDS Tax Settings */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 border-b border-border/60 pb-4">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Professional Tax & Income Tax (TDS)
          </h3>
          <p className="text-xs text-muted-foreground">
            State taxation slabs and default income tax withholding regime.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Professional Tax State Slab</Label>
            <Select
              value={formData.ptState}
              onValueChange={(v) => setFormData({ ...formData, ptState: v })}
              disabled={!canEdit || !formData.ptEnabled}
            >
              <SelectTrigger id="pt-state" className="w-full">
                <SelectValue placeholder="Select state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Maharashtra">Maharashtra (Max ₹2,500/yr)</SelectItem>
                <SelectItem value="Karnataka">Karnataka (Max ₹2,400/yr)</SelectItem>
                <SelectItem value="Tamil Nadu">Tamil Nadu (Semi-annual slabs)</SelectItem>
                <SelectItem value="Telangana">Telangana (Max ₹2,500/yr)</SelectItem>
                <SelectItem value="West Bengal">West Bengal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Default TDS Regime</Label>
            <Select
              value={formData.tdsDefaultRegime}
              onValueChange={(v: PayrollSettingsForm["tdsDefaultRegime"]) =>
                setFormData({ ...formData, tdsDefaultRegime: v })
              }
              disabled={!canEdit}
            >
              <SelectTrigger id="tds-regime" className="w-full">
                <SelectValue placeholder="Select regime" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New Tax Regime (Section 115BAC)</SelectItem>
                <SelectItem value="old">Old Tax Regime (With Exemptions)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium text-foreground">Tax Declarations</Label>
              <p className="text-[10px] text-muted-foreground">
                Allow employee 80C/80D investment proofs.
              </p>
            </div>
            <Switch
              checked={formData.tdsWindowOpen}
              onCheckedChange={(c) => setFormData({ ...formData, tdsWindowOpen: c })}
              disabled={!canEdit}
            />
          </div>
        </div>
      </div>

      {/* Payslip Distribution Settings */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 border-b border-border/60 pb-4">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Payslip Generation & Security
          </h3>
          <p className="text-xs text-muted-foreground">Standardized pay document issuance rules.</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1.5">
            <Label htmlFor="payslip-day" className="text-xs font-medium">
              Monthly Generation Day
            </Label>
            <Input
              id="payslip-day"
              type="number"
              min={1}
              max={31}
              value={formData.payslipGenerationDay}
              onChange={(e) =>
                setFormData({ ...formData, payslipGenerationDay: Number(e.target.value) })
              }
              disabled={!canEdit}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium text-foreground">Password Protected PDF</Label>
              <p className="text-[10px] text-muted-foreground">Secured with employee PAN / DOB.</p>
            </div>
            <Switch
              checked={formData.passwordProtectedPayslips}
              onCheckedChange={(c) => setFormData({ ...formData, passwordProtectedPayslips: c })}
              disabled={!canEdit}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium text-foreground">Show Leave Balances</Label>
              <p className="text-[10px] text-muted-foreground">
                Include remaining CL/SL/EL summary on slips.
              </p>
            </div>
            <Switch
              checked={formData.showLeaveBalanceOnPayslip}
              onCheckedChange={(c) => setFormData({ ...formData, showLeaveBalanceOnPayslip: c })}
              disabled={!canEdit}
            />
          </div>
        </div>
      </div>

      {canEdit && (
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => initialData && setFormData(initialData)}
            disabled={!isDirty || submitting}
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Discard Changes
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!isDirty || submitting}
            className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="h-3.5 w-3.5" />
            {submitting ? "Saving..." : "Save Payroll Settings"}
          </Button>
        </div>
      )}

      <UnsavedChangesBanner
        isDirty={isDirty}
        submitting={submitting}
        onReset={() => initialData && setFormData(initialData)}
        onSave={() => handleSave()}
      />
    </form>
  );
}
