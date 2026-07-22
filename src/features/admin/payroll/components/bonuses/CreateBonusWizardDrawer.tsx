import React, { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  ShieldCheck,
  Save,
  Gift,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { BonusAward, BonusType, CalculationMode } from "./bonusesTypes";
import { BONUS_TYPES_LIST } from "@/services/bonusesApi";
import { VisualFormulaBuilder } from "./VisualFormulaBuilder";

interface CreateBonusWizardDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: Partial<BonusAward>) => Promise<void>;
}

export const CreateBonusWizardDrawer: React.FC<CreateBonusWizardDrawerProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [bonusType, setBonusType] = useState<BonusType>("Performance Bonus");
  const [bonusCycle, setBonusCycle] = useState("Q2 2026 High Performer Award");
  const [effectiveDate, setEffectiveDate] = useState("2026-07-01");
  const [description, setDescription] = useState("Performance bonus award for Q2 target achievements.");

  const [employeeName, setEmployeeName] = useState("Vikramaditya Roy");
  const [employeeCode, setEmployeeCode] = useState("EMP-101");
  const [department, setDepartment] = useState("Engineering");
  const [designation, setDesignation] = useState("Principal Architect");
  const [location, setLocation] = useState("Global / Bangalore");
  const [performanceRating, setPerformanceRating] = useState<number>(4.8);

  const [calculationMode, setCalculationMode] = useState<CalculationMode>("PERCENTAGE_BASIC");
  const [bonusAmount, setBonusAmount] = useState<number>(180000);
  const [formulaExpression, setFormulaExpression] = useState("BASIC * 1.20");

  const steps = [
    { num: 1, title: "1. Type & Cycle" },
    { num: 2, title: "2. Eligibility" },
    { num: 3, title: "3. Calculation" },
    { num: 4, title: "4. Review" },
    { num: 5, title: "5. Approval Submit" },
  ];

  const handleNext = () => {
    if (currentStep === 1 && !bonusCycle.trim()) {
      toast.error("Please enter a valid bonus cycle name.");
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
        bonusType,
        bonusCycle,
        effectiveDate,
        employeeName,
        employeeCode,
        department,
        designation,
        location,
        performanceRating,
        calculationMode,
        bonusAmount,
        formulaExpression,
      });
      toast.success(`Awarded ${bonusType} of ₹${bonusAmount.toLocaleString("en-IN")} to ${employeeName}`);
      onClose();
    } catch {
      toast.error("Failed to submit bonus award.");
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
              <Gift className="w-5 h-5 text-amber-400" />
              Award Employee Bonus & Variable Incentive
            </SheetTitle>
            <p className="text-xs text-slate-400 mt-0.5">5-step enterprise compensation wizard.</p>
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
          {/* STEP 1: Type & Cycle */}
          {currentStep === 1 && (
            <div className="space-y-4 max-w-xl">
              <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Step 1: Bonus Type & Cycle Configuration</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Bonus Category *</label>
                  <Select value={bonusType} onValueChange={(val: any) => setBonusType(val)}>
                    <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                      {BONUS_TYPES_LIST.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Bonus Cycle Name *</label>
                  <Input
                    value={bonusCycle}
                    onChange={(e) => setBonusCycle(e.target.value)}
                    placeholder="e.g. Q2 2026 High Performer Award"
                    className="bg-slate-900 border-white/10 text-xs text-white"
                  />
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

          {/* STEP 2: Eligibility */}
          {currentStep === 2 && (
            <div className="space-y-4 max-w-xl">
              <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Step 2: Employee & Performance Eligibility</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Employee Name</label>
                  <Input
                    value={employeeName}
                    onChange={(e) => setEmployeeName(e.target.value)}
                    className="bg-slate-900 border-white/10 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Employee ID</label>
                  <Input
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    className="bg-slate-900 border-white/10 text-xs text-blue-300 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Department</label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Sales & BD">Sales & BD</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Performance Rating (Out of 5)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={performanceRating}
                    onChange={(e) => setPerformanceRating(Number(e.target.value))}
                    className="bg-slate-900 border-white/10 text-xs text-amber-300 font-mono font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Calculation Engine */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Step 3: Bonus Calculation Engine</h3>

              <div className="grid grid-cols-2 gap-3 max-w-xl">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Calculation Mode</label>
                  <Select value={calculationMode} onValueChange={(val: any) => setCalculationMode(val)}>
                    <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectItem value="FIXED">Fixed Amount (₹)</SelectItem>
                      <SelectItem value="PERCENTAGE_BASIC">Percentage of Basic Pay</SelectItem>
                      <SelectItem value="PERCENTAGE_CTC">Percentage of Total CTC</SelectItem>
                      <SelectItem value="FORMULA">Custom Formula Engine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Calculated Bonus Amount (₹) *</label>
                  <Input
                    type="number"
                    value={bonusAmount}
                    onChange={(e) => setBonusAmount(Number(e.target.value))}
                    className="bg-slate-900 border-white/10 text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Embedded Formula Engine */}
              <VisualFormulaBuilder
                initialFormula={formulaExpression}
                onFormulaChange={setFormulaExpression}
              />
            </div>
          )}

          {/* STEP 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Step 4: Financial Review & Budget Check</h3>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Awarded Bonus Amount</span>
                  <span className="text-lg font-bold font-mono text-white">₹{bonusAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>TDS Withholding (30%):</span>
                  <span className="text-rose-400 font-mono">₹{(bonusAmount * 0.3).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 pt-1 border-t border-white/5">
                  <span>Est. Net Employee Payout:</span>
                  <span className="font-mono text-sm">₹{(bonusAmount * 0.7).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  Budget Allocation Verified
                </div>
                <p className="text-xs text-slate-300">Award is within the Q2 Engineering Bonus Pool limit.</p>
              </div>
            </div>
          )}

          {/* STEP 5: Approval Submit */}
          {currentStep === 5 && (
            <div className="space-y-4 text-center py-6">
              <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 w-12 h-12 mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Ready for Governance Sign-off</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Submitting this award will route it through HR → Compensation Manager → Finance → CFO → CEO → Payroll.
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
              <Button size="sm" onClick={handleNext} className="bg-amber-600 hover:bg-amber-500 text-white text-xs gap-1">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleFormSubmit}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 shadow-lg shadow-emerald-600/25"
              >
                <Save className="w-4 h-4" /> {saving ? "Submitting..." : "Submit for Approval"}
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
