import React, { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  ShieldCheck,
  Save,
  HandCoins,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { SalaryAdvanceRequest, AdvanceType, RecoveryMethod } from "./advancesTypes";
import { ADVANCE_TYPES_LIST } from "@/services/advancesApi";

interface CreateAdvanceWizardDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: Partial<SalaryAdvanceRequest>) => Promise<void>;
}

export const CreateAdvanceWizardDrawer: React.FC<CreateAdvanceWizardDrawerProps> = ({
  open,
  onClose,
  onSave,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [employeeName, setEmployeeName] = useState("Vikramaditya Roy");
  const [employeeCode, setEmployeeCode] = useState("EMP-101");
  const [department, setDepartment] = useState("Engineering");
  const [advanceType, setAdvanceType] = useState<AdvanceType>("Emergency");
  const [reason, setReason] = useState("Urgent medical hospitalization deposit for family member.");

  const [requestedAmount, setRequestedAmount] = useState<number>(60000);
  const [totalInstallments, setTotalInstallments] = useState<number>(4);
  const [recoveryMethod, setRecoveryMethod] = useState<RecoveryMethod>("MONTHLY_PAYROLL");
  const [startRecoveryDate, setStartRecoveryDate] = useState("2026-08-01");

  const steps = [
    { num: 1, title: "1. Employee & Reason" },
    { num: 2, title: "2. Financial Terms" },
    { num: 3, title: "3. Payroll Integration" },
    { num: 4, title: "4. Review & Submit" },
  ];

  const emiAmount = totalInstallments > 0 ? Math.round(requestedAmount / totalInstallments) : requestedAmount;

  const handleNext = () => {
    if (currentStep === 1 && !reason.trim()) {
      toast.error("Please enter a valid advance reason.");
      return;
    }
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleFormSubmit = async () => {
    setSaving(true);
    try {
      await onSave({
        employeeName,
        employeeCode,
        department,
        advanceType,
        reason,
        requestedAmount,
        approvedAmount: requestedAmount,
        totalInstallments,
        installmentAmount: emiAmount,
        recoveryMethod,
        startRecoveryDate,
      });
      toast.success(`Submitted salary advance request of ₹${requestedAmount.toLocaleString("en-IN")} for ${employeeName}`);
      onClose();
    } catch {
      toast.error("Failed to submit advance request.");
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
              <HandCoins className="w-5 h-5 text-cyan-400" />
              Create Employee Salary Advance Request
            </SheetTitle>
            <p className="text-xs text-slate-400 mt-0.5">4-step financial assistance & recovery configuration wizard.</p>
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
          {/* STEP 1: Employee & Reason */}
          {currentStep === 1 && (
            <div className="space-y-4 max-w-xl">
              <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Step 1: Employee & Advance Classification</h3>

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
                  <label className="text-xs text-slate-300 font-medium">Employee Code</label>
                  <Input
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    className="bg-slate-900 border-white/10 text-xs text-cyan-300 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Advance Category *</label>
                  <Select value={advanceType} onValueChange={(val: any) => setAdvanceType(val)}>
                    <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                      {ADVANCE_TYPES_LIST.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Advance Purpose & Justification *</label>
                  <Textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    rows={3}
                    className="bg-slate-900 border-white/10 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Financial Terms */}
          {currentStep === 2 && (
            <div className="space-y-4 max-w-xl">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Step 2: Financial Amount & Repayment Terms</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Advance Amount (₹) *</label>
                  <Input
                    type="number"
                    value={requestedAmount}
                    onChange={(e) => setRequestedAmount(Number(e.target.value))}
                    className="bg-slate-900 border-white/10 text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Total Installments (Months)</label>
                  <Input
                    type="number"
                    value={totalInstallments}
                    onChange={(e) => setTotalInstallments(Number(e.target.value))}
                    className="bg-slate-900 border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-white/10 col-span-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Monthly Payroll EMI Cut:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">₹{emiAmount.toLocaleString("en-IN")} / month</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Payroll Integration */}
          {currentStep === 3 && (
            <div className="space-y-4 max-w-xl">
              <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Step 3: Payroll Recovery & Repayment Method</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Recovery Method</label>
                  <Select value={recoveryMethod} onValueChange={(val: any) => setRecoveryMethod(val)}>
                    <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectItem value="MONTHLY_PAYROLL">Auto Deduct via Monthly Payroll</SelectItem>
                      <SelectItem value="BI_WEEKLY">Bi-Weekly Pay Run Cut</SelectItem>
                      <SelectItem value="ONE_TIME">One Time Full Recovery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Start Recovery Date</label>
                  <Input
                    type="date"
                    value={startRecoveryDate}
                    onChange={(e) => setStartRecoveryDate(e.target.value)}
                    className="bg-slate-900 border-white/10 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-4 text-center py-6">
              <div className="p-4 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 w-12 h-12 mx-auto flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Eligibility & Risk Score Verified</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Ready to submit advance request of ₹{requestedAmount.toLocaleString("en-IN")} for {employeeName}.
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
            {currentStep < 4 ? (
              <Button size="sm" onClick={handleNext} className="bg-cyan-600 hover:bg-cyan-500 text-white text-xs gap-1">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleFormSubmit}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 shadow-lg shadow-emerald-600/25"
              >
                <Save className="w-4 h-4" /> {saving ? "Submitting..." : "Submit Advance Request"}
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
