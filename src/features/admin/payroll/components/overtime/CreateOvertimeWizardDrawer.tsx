import React, { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  ShieldCheck,
  Save,
  Timer,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { OvertimeRecord, OvertimeCategory, ShiftName } from "./overtimeTypes";
import { OVERTIME_CATEGORIES_LIST } from "@/services/overtimeApi";

interface CreateOvertimeWizardDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: Partial<OvertimeRecord>) => Promise<void>;
}

export const CreateOvertimeWizardDrawer: React.FC<CreateOvertimeWizardDrawerProps> = ({
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
  const [shift, setShift] = useState<ShiftName>("Morning Shift");
  const [date, setDate] = useState("2026-07-21");

  const [workedHours, setWorkedHours] = useState<number>(11.5);
  const [scheduledHours, setScheduledHours] = useState<number>(8.0);
  const [overtimeHours, setOvertimeHours] = useState<number>(3.5);
  const [category, setCategory] = useState<OvertimeCategory>("Regular Overtime");

  const [hourlyRate, setHourlyRate] = useState<number>(500);
  const [multiplier, setMultiplier] = useState<number>(1.5);

  const steps = [
    { num: 1, title: "1. Employee & Shift" },
    { num: 2, title: "2. Worked Hours" },
    { num: 3, title: "3. Multiplier Engine" },
    { num: 4, title: "4. Review & Submit" },
  ];

  const calculatedAmount = Math.round(overtimeHours * hourlyRate * multiplier);

  const handleNext = () => {
    if (currentStep === 2 && overtimeHours <= 0) {
      toast.error("Please enter valid overtime hours.");
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
        shift,
        date,
        workedHours,
        scheduledHours,
        overtimeHours,
        category,
        hourlyRate,
        multiplier,
        overtimeAmount: calculatedAmount,
      });
      toast.success(`Created overtime record of ${overtimeHours} hrs (₹${calculatedAmount.toLocaleString("en-IN")}) for ${employeeName}`);
      onClose();
    } catch {
      toast.error("Failed to create overtime record.");
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
              <Timer className="w-5 h-5 text-blue-400" />
              Log Employee Overtime Claim
            </SheetTitle>
            <p className="text-xs text-slate-400 mt-0.5">4-step workforce time & multiplier configuration wizard.</p>
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
          {/* STEP 1: Employee & Shift */}
          {currentStep === 1 && (
            <div className="space-y-4 max-w-xl">
              <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Step 1: Employee & Shift Details</h3>

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
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Assigned Shift</label>
                  <Select value={shift} onValueChange={(val: any) => setShift(val)}>
                    <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectItem value="Morning Shift">Morning Shift (09:00 - 18:00)</SelectItem>
                      <SelectItem value="Evening Shift">Evening Shift (14:00 - 23:00)</SelectItem>
                      <SelectItem value="Night Shift">Night Shift (22:00 - 07:00)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Overtime Date</label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="bg-slate-900 border-white/10 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Worked Hours */}
          {currentStep === 2 && (
            <div className="space-y-4 max-w-xl">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Step 2: Biometric Clock Hours & Category</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Total Worked Hours</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={workedHours}
                    onChange={(e) => {
                      const w = Number(e.target.value);
                      setWorkedHours(w);
                      setOvertimeHours(Math.max(0, w - scheduledHours));
                    }}
                    className="bg-slate-900 border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Calculated OT Hours *</label>
                  <Input
                    type="number"
                    step="0.5"
                    value={overtimeHours}
                    onChange={(e) => setOvertimeHours(Number(e.target.value))}
                    className="bg-slate-900 border-white/10 text-xs text-amber-300 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5 col-span-2">
                  <label className="text-xs text-slate-300 font-medium">Overtime Category</label>
                  <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                    <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                      {OVERTIME_CATEGORIES_LIST.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Multiplier Engine */}
          {currentStep === 3 && (
            <div className="space-y-4 max-w-xl">
              <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider">Step 3: Multiplier Rate Engine</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Base Hourly Rate (₹/hr)</label>
                  <Input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(Number(e.target.value))}
                    className="bg-slate-900 border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Multiplier Rate</label>
                  <Select value={String(multiplier)} onValueChange={(val) => setMultiplier(Number(val))}>
                    <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectItem value="1.5">1.5x Standard Overtime</SelectItem>
                      <SelectItem value="2.0">2.0x Double Pay (Weekend)</SelectItem>
                      <SelectItem value="3.0">3.0x Triple Pay (Holiday)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-white/10 col-span-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Total Calculated Overtime Payout:</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">
                    ₹{calculatedAmount.toLocaleString("en-IN")}
                  </span>
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
              <h3 className="text-base font-bold text-white">Biometric & Shift Policy Verified</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Ready to submit overtime claim of {overtimeHours} hrs (₹{calculatedAmount.toLocaleString("en-IN")}) for {employeeName}.
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
              <Button size="sm" onClick={handleNext} className="bg-blue-600 hover:bg-blue-500 text-white text-xs gap-1">
                Next <ChevronRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleFormSubmit}
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 shadow-lg shadow-emerald-600/25"
              >
                <Save className="w-4 h-4" /> {saving ? "Submitting..." : "Submit Overtime Record"}
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
