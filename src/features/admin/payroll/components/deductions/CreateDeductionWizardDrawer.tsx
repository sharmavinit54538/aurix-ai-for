import React, { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  ShieldCheck,
  Save,
  MinusCircle,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DeductionRule, DeductionCategoryGroup, CalculationMethod } from "./deductionsTypes";
import { DEDUCTION_CATEGORY_GROUPS } from "@/services/deductionsApi";
import { VisualFormulaBuilder } from "./VisualFormulaBuilder";

interface CreateDeductionWizardDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: Partial<DeductionRule>) => Promise<void>;
}

export const CreateDeductionWizardDrawer: React.FC<CreateDeductionWizardDrawerProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [name, setName] = useState("Custom Asset Recovery Rule");
  const [description, setDescription] = useState("Monthly recovery for company laptops and hardware.");
  const [categoryGroup, setCategoryGroup] = useState<DeductionCategoryGroup>("RECOVERY");
  const [category, setCategory] = useState("Device Recovery");
  const [effectiveDate, setEffectiveDate] = useState("2026-07-01");

  const [calculationMethod, setCalculationMethod] = useState<CalculationMethod>("FIXED");
  const [fixedAmount, setFixedAmount] = useState<number>(2500);
  const [percentage, setPercentage] = useState<number>(0);
  const [maxLimit, setMaxLimit] = useState<number>(5000);
  const [formulaExpression, setFormulaExpression] = useState("2500");

  const [department, setDepartment] = useState("Engineering");
  const [recurrence, setRecurrence] = useState<"Monthly" | "Quarterly" | "One Time" | "Recurring">("Monthly");

  const steps = [
    { num: 1, title: "1. General Info" },
    { num: 2, title: "2. Calculation" },
    { num: 3, title: "3. Applicability" },
    { num: 4, title: "4. Payroll" },
    { num: 5, title: "5. Review & Submit" },
  ];

  const handleNext = () => {
    if (currentStep === 1 && !name.trim()) {
      toast.error("Please enter a valid deduction rule name.");
      return;
    }
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleFormSubmit = async () => {
    setSaving(true);
    try {
      await onSave({
        name,
        description,
        categoryGroup,
        category,
        effectiveDate,
        calculationMethod,
        fixedAmount,
        percentage,
        maxLimit,
        formulaExpression,
        recurrence,
      });
      toast.success(`Created deduction rule '${name}'.`);
      onClose();
    } catch {
      toast.error("Failed to create deduction rule.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl bg-[#070B17] border-l border-white/10 text-white p-0 flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/90">
          <div>
            <SheetTitle className="text-base font-bold text-white flex items-center gap-2">
              <MinusCircle className="w-5 h-5 text-rose-400" />
              Create Payroll Deduction & Recovery Rule
            </SheetTitle>
            <p className="text-xs text-slate-400 mt-0.5">5-step enterprise deduction rule configuration wizard.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Step Progress Tracker */}
        <div className="px-5 py-3 border-b border-white/10 bg-slate-950/60 overflow-x-auto">
          <div className="flex items-center justify-between min-w-max gap-2">
            {steps.map((s) => {
              const isActive = currentStep === s.num;
              const isDone = currentStep > s.num;

              return (
                <div
                  key={s.num}
                  onClick={() => setCurrentStep(s.num)}
                  className={`wizard-step-item cursor-pointer ${isActive ? "active" : isDone ? "completed" : ""}`}
                >
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border">
                    {isDone ? <Check className="w-3 h-3" /> : s.num}
                  </span>
                  <span>{s.title}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: General Info */}
          {currentStep === 1 && (
            <div className="space-y-4 max-w-xl">
              <h3 className="text-xs font-semibold text-rose-400 uppercase tracking-wider">Step 1: General Information & Classification</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Deduction Rule Name *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Device Recovery / Corporate Insurance Copay"
                    className="bg-slate-900 border-white/10 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Category Group *</label>
                  <Select value={categoryGroup} onValueChange={(val: any) => setCategoryGroup(val)}>
                    <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                      {DEDUCTION_CATEGORY_GROUPS.map((grp) => (
                        <SelectItem key={grp} value={grp}>
                          {grp}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Effective Date</label>
                  <Input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="bg-slate-900 border-white/10 text-xs text-white"
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Description</label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="bg-slate-900 border-white/10 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Calculation Engine */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Step 2: Calculation Method & Limits</h3>

              <div className="grid grid-cols-2 gap-3 max-w-xl">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Calculation Method</label>
                  <Select value={calculationMethod} onValueChange={(val: any) => setCalculationMethod(val)}>
                    <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectItem value="FIXED">Fixed Amount (₹)</SelectItem>
                      <SelectItem value="PERCENTAGE">Percentage of Salary</SelectItem>
                      <SelectItem value="FORMULA">Formula Engine</SelectItem>
                      <SelectItem value="CONDITIONAL">Conditional Rule</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Fixed Amount (₹)</label>
                  <Input
                    type="number"
                    value={fixedAmount}
                    onChange={(e) => setFixedAmount(Number(e.target.value))}
                    className="bg-slate-900 border-white/10 text-xs text-rose-400 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Monthly Max Limit (₹)</label>
                  <Input
                    type="number"
                    value={maxLimit}
                    onChange={(e) => setMaxLimit(Number(e.target.value))}
                    className="bg-slate-900 border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>

              {/* Embedded Visual Formula Engine */}
              <VisualFormulaBuilder
                initialFormula={formulaExpression}
                onFormulaChange={setFormulaExpression}
              />
            </div>
          )}

          {/* STEP 3: Applicability */}
          {currentStep === 3 && (
            <div className="space-y-4 max-w-xl">
              <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Step 3: Applicability & Employee Mapping Scope</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Target Department</label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectItem value="All">All Departments (Company-wide)</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Sales & BD">Sales & BD</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Payroll Integration */}
          {currentStep === 4 && (
            <div className="space-y-4 max-w-xl">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Step 4: Recurrence & Payroll Schedule</h3>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-300 font-medium">Recurrence Frequency</label>
                <Select value={recurrence} onValueChange={(val: any) => setRecurrence(val)}>
                  <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                    <SelectItem value="Monthly">Monthly Recurring Pay Run</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="One Time">One Time Deduction</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* STEP 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-4 text-center py-6">
              <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 w-12 h-12 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Rule Configuration Validated</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Ready to submit deduction rule '{name}' for HR → Payroll → Finance → Compliance sign-off.
              </p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/10 bg-slate-900 flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            disabled={currentStep === 1}
            className="border-white/10 bg-slate-950 text-slate-300 text-xs gap-1"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </Button>

          <div className="flex items-center gap-2">
            {currentStep < 5 ? (
              <Button size="sm" onClick={handleNext} className="bg-rose-600 hover:bg-rose-500 text-white text-xs gap-1">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleFormSubmit}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 shadow-lg shadow-emerald-600/25"
              >
                <Save className="w-4 h-4" /> {saving ? "Submitting..." : "Submit Deduction Rule"}
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
