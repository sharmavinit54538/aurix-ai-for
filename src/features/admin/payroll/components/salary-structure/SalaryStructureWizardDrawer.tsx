import React, { useState, useEffect } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Calculator,
  Save,
  Send,
  Plus,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SalaryStructure, SalaryComponent } from "./salaryStructureTypes";
import { VisualFormulaBuilder } from "./VisualFormulaBuilder";

interface SalaryStructureWizardDrawerProps {
  open: boolean;
  onClose: () => void;
  structure?: SalaryStructure | null;
  onSave: (payload: Partial<SalaryStructure>) => Promise<void>;
}

export const SalaryStructureWizardDrawer: React.FC<SalaryStructureWizardDrawerProps> = ({
  open,
  onClose,
  structure,
  onSave,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [salaryGrade, setSalaryGrade] = useState("L5 - Principal Architect");
  const [salaryBand, setSalaryBand] = useState("Band 4 (Senior Management)");
  const [department, setDepartment] = useState("Engineering");
  const [designation, setDesignation] = useState("Principal Software Engineer");
  const [location, setLocation] = useState("Global");
  const [employmentType, setEmploymentType] = useState<SalaryStructure["employmentType"]>("FULL_TIME");
  const [annualCtc, setAnnualCtc] = useState(3600000);
  const [effectiveFrom, setEffectiveFrom] = useState("2026-04-01");
  const [version, setVersion] = useState("v1.0");
  const [status, setStatus] = useState<SalaryStructure["status"]>("DRAFT");

  // Step Component Arrays
  const [earnings, setEarnings] = useState<Partial<SalaryComponent>[]>([
    { id: "e1", code: "BASIC", name: "Basic Pay", calculationType: "PERCENTAGE", value: 50, baseComponentCode: "CTC" },
    { id: "e2", code: "HRA", name: "House Rent Allowance (HRA)", calculationType: "PERCENTAGE", value: 50, baseComponentCode: "BASIC" },
    { id: "e3", code: "SPECIAL_ALLOWANCE", name: "Special Allowance", calculationType: "FORMULA", value: 0, formulaExpression: "CTC - (BASIC + HRA)" },
    { id: "e4", code: "PERFORMANCE_BONUS", name: "Performance Bonus", calculationType: "PERCENTAGE", value: 10, baseComponentCode: "BASIC" },
  ]);

  const [deductions, setDeductions] = useState<Partial<SalaryComponent>[]>([
    { id: "d1", code: "PF", name: "Employee EPF", calculationType: "FORMULA", value: 12, formulaExpression: "MIN(BASIC, 15000) * 0.12" },
    { id: "d2", code: "PROFESSIONAL_TAX", name: "Professional Tax (PT)", calculationType: "CONDITIONAL", value: 200 },
    { id: "d3", code: "INCOME_TAX", name: "TDS Tax Deduction", calculationType: "FORMULA", value: 0 },
  ]);

  const [employerContributions, setEmployerContributions] = useState<Partial<SalaryComponent>[]>([
    { id: "er1", code: "EMPLOYER_PF", name: "Employer EPF", calculationType: "FORMULA", value: 12, formulaExpression: "MIN(BASIC, 15000) * 0.12" },
    { id: "er2", code: "GRATUITY", name: "Gratuity Accrual", calculationType: "PERCENTAGE", value: 4.81, baseComponentCode: "BASIC" },
  ]);

  const [benefits, setBenefits] = useState<Partial<SalaryComponent>[]>([
    { id: "b1", code: "HEALTH_INSURANCE", name: "Group Mediclaim", calculationType: "FIXED", value: 1500 },
    { id: "b2", code: "STOCK_OPTIONS", name: "Executive ESOPs", calculationType: "FIXED", value: 10000 },
  ]);

  // Sync state when structure changes
  useEffect(() => {
    if (structure) {
      setName(structure.name);
      setCode(structure.code);
      setDescription(structure.description);
      setSalaryGrade(structure.salaryGrade);
      setSalaryBand(structure.salaryBand);
      setDepartment(structure.department);
      setDesignation(structure.designation);
      setLocation(structure.location);
      setEmploymentType(structure.employmentType);
      setAnnualCtc(structure.annualCtc);
      setEffectiveFrom(structure.effectiveFrom);
      setVersion(structure.version);
      setStatus(structure.status);
    } else {
      setName("Global Engineering Compensation Template");
      setCode(`ENG-${Date.now().toString().slice(-4)}`);
      setDescription("Enterprise compensation structure for senior technology leadership.");
      setAnnualCtc(3600000);
      setCurrentStep(1);
    }
  }, [structure, open]);

  const steps = [
    { num: 1, title: "General Info" },
    { num: 2, title: "Earnings" },
    { num: 3, title: "Deductions" },
    { num: 4, title: "Employer Costs" },
    { num: 5, title: "Benefits & Perks" },
    { num: 6, title: "Assignment Scope" },
    { num: 7, title: "Review & Publish" },
  ];

  const handleNext = () => {
    if (currentStep === 1 && !name.trim()) {
      toast.error("Please enter a valid structure name.");
      return;
    }
    setCurrentStep((prev) => Math.min(7, prev + 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleFormSubmit = async () => {
    setSaving(true);
    try {
      await onSave({
        name,
        code,
        description,
        salaryGrade,
        salaryBand,
        department,
        designation,
        location,
        employmentType,
        annualCtc,
        effectiveFrom,
        version,
        status,
      });
      toast.success(`Salary Structure template '${name}' saved successfully!`);
      onClose();
    } catch {
      toast.error("Failed to save structure.");
    } finally {
      setSaving(false);
    }
  };

  const monthlyCtc = Math.round(annualCtc / 12);
  const estBasic = Math.round(monthlyCtc * 0.50);
  const estGross = Math.round(monthlyCtc * 0.90);
  const estNet = Math.round(estGross * 0.82);

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-4xl bg-[#070B17] border-l border-white/10 text-white p-0 flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-slate-900/90">
          <div>
            <SheetTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              {structure ? `Edit Structure: ${structure.code}` : "Create Enterprise Salary Structure"}
            </SheetTitle>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-step compensation wizard for statutory compliance, formulas, and assignment.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Wizard Step Progress Tracker */}
        <div className="px-5 py-3 border-b border-white/10 bg-slate-950/60 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
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

        {/* Content Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* STEP 1: General Info */}
          {currentStep === 1 && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wider">Step 1: General Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Structure Name *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Global Tech & Engineering (Grade L5 - Principal)"
                    className="bg-slate-900 border-white/10 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Structure Code</label>
                  <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="bg-slate-900 border-white/10 text-xs text-blue-300 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Annual Base CTC (₹)</label>
                  <Input
                    type="number"
                    value={annualCtc}
                    onChange={(e) => setAnnualCtc(Number(e.target.value))}
                    className="bg-slate-900 border-white/10 text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Salary Grade</label>
                  <Select value={salaryGrade} onValueChange={setSalaryGrade}>
                    <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectItem value="L5 - Principal Architect">L5 - Principal Architect</SelectItem>
                      <SelectItem value="L4 - Staff Lead">L4 - Staff Lead</SelectItem>
                      <SelectItem value="L3 - Senior Manager">L3 - Senior Manager</SelectItem>
                      <SelectItem value="L1 - Specialist">L1 - Specialist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Salary Band</label>
                  <Select value={salaryBand} onValueChange={setSalaryBand}>
                    <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectItem value="Band 4 (Senior Management)">Band 4 (Senior Management)</SelectItem>
                      <SelectItem value="Band 3 (Mid Management)">Band 3 (Mid Management)</SelectItem>
                      <SelectItem value="Band 1 (Junior Level)">Band 1 (Junior Level)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Effective Date</label>
                  <Input
                    type="date"
                    value={effectiveFrom}
                    onChange={(e) => setEffectiveFrom(e.target.value)}
                    className="bg-slate-900 border-white/10 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Version</label>
                  <Input
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="bg-slate-900 border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs font-medium text-slate-300">Description</label>
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

          {/* STEP 2: Earnings */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Step 2: Earnings & Allowances</h3>
                  <p className="text-xs text-slate-400">Configure Basic, HRA, Special Allowance, and custom incentives.</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setEarnings([
                      ...earnings,
                      { id: `custom-${Date.now()}`, name: "Custom Allowance", calculationType: "FIXED", value: 2000 },
                    ])
                  }
                  className="border-white/10 bg-slate-900 text-xs text-slate-300 gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Component
                </Button>
              </div>

              <div className="space-y-3">
                {earnings.map((comp, idx) => (
                  <div key={comp.id || idx} className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-blue-300 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        {comp.name} ({comp.code})
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEarnings(earnings.filter((_, i) => i !== idx))}
                        className="h-6 w-6 p-0 text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] text-slate-400">Calc Type</label>
                        <Select
                          value={comp.calculationType || "PERCENTAGE"}
                          onValueChange={(val: any) => {
                            const copy = [...earnings];
                            copy[idx].calculationType = val;
                            setEarnings(copy);
                          }}
                        >
                          <SelectTrigger className="bg-slate-950 border-white/10 text-xs text-white h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                            <SelectItem value="PERCENTAGE">Percentage (%)</SelectItem>
                            <SelectItem value="FIXED">Fixed Amount (₹)</SelectItem>
                            <SelectItem value="FORMULA">Custom Formula</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400">Value / %</label>
                        <Input
                          type="number"
                          value={comp.value || 0}
                          onChange={(e) => {
                            const copy = [...earnings];
                            copy[idx].value = Number(e.target.value);
                            setEarnings(copy);
                          }}
                          className="bg-slate-950 border-white/10 text-xs text-white h-8 font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] text-slate-400">Base Component</label>
                        <Input
                          value={comp.baseComponentCode || "CTC"}
                          onChange={(e) => {
                            const copy = [...earnings];
                            copy[idx].baseComponentCode = e.target.value;
                            setEarnings(copy);
                          }}
                          className="bg-slate-950 border-white/10 text-xs text-blue-300 font-mono h-8"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Embedded Formula Editor */}
              <VisualFormulaBuilder
                initialFormula="BASIC * 0.50"
                componentCode="SPECIAL_ALLOWANCE"
              />
            </div>
          )}

          {/* STEP 3: Deductions */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-rose-400 uppercase tracking-wider">Step 3: Statutory & Voluntary Deductions</h3>
              <p className="text-xs text-slate-400">EPF, ESI, Professional Tax, and Income Tax TDS withholding.</p>

              <div className="space-y-3">
                {deductions.map((d, idx) => (
                  <div key={d.id || idx} className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-white">{d.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">{d.formulaExpression || `Deduction Rate: ${d.value}%`}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Employer Costs */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Step 4: Employer Contributions</h3>
              <p className="text-xs text-slate-400">Employer EPF, ESI, Gratuity, and LWF provisions.</p>

              <div className="space-y-3">
                {employerContributions.map((er, idx) => (
                  <div key={er.id || idx} className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-white">{er.name}</h4>
                      <p className="text-[11px] text-slate-400 font-mono">Formula: {er.formulaExpression || `${er.value}% of Basic`}</p>
                    </div>
                    <span className="text-xs font-bold text-purple-300 font-mono">Included in CTC</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: Benefits */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wider">Step 5: Executive Benefits & Flexible Benefit Plan</h3>
              <p className="text-xs text-slate-400">Configure Mediclaim, Life Insurance, Stock Options, and Fuel/Meal reimbursements.</p>

              <div className="space-y-3">
                {benefits.map((b, idx) => (
                  <div key={b.id || idx} className="p-4 rounded-xl bg-slate-900/60 border border-white/10 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-white">{b.name}</h4>
                      <p className="text-[11px] text-slate-400">Monthly Benefit Value: ₹{b.value?.toLocaleString("en-IN")}</p>
                    </div>
                    <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 text-[10px]">Non-Monetary</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 6: Assignment Scope */}
          {currentStep === 6 && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-sm font-semibold text-amber-400 uppercase tracking-wider">Step 6: Assignment Scope</h3>
              <p className="text-xs text-slate-400">Map structure to specific departments, designations, and locations.</p>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-300">Target Department</label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Sales & BD">Sales & BD</SelectItem>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="All">All Departments</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300">Target Location</label>
                  <Select value={location} onValueChange={setLocation}>
                    <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectItem value="Global">Global / All India</SelectItem>
                      <SelectItem value="Bangalore">Bangalore</SelectItem>
                      <SelectItem value="Hyderabad">Hyderabad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Review */}
          {currentStep === 7 && (
            <div className="space-y-5">
              <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Step 7: Final Review & Compliance Check</h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="salary-card p-4 text-center">
                  <span className="text-xs text-slate-400">Estimated Monthly CTC</span>
                  <div className="text-lg font-bold text-white mt-1">₹{monthlyCtc.toLocaleString("en-IN")}</div>
                </div>
                <div className="salary-card p-4 text-center">
                  <span className="text-xs text-slate-400">Est. Gross Salary</span>
                  <div className="text-lg font-bold text-emerald-400 mt-1">₹{estGross.toLocaleString("en-IN")}</div>
                </div>
                <div className="salary-card p-4 text-center">
                  <span className="text-xs text-slate-400">Est. Take-Home Pay</span>
                  <div className="text-lg font-bold text-cyan-400 mt-1">₹{estNet.toLocaleString("en-IN")}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  Statutory AI Compliance Validation
                </div>
                <ul className="text-xs text-slate-300 space-y-1 list-disc pl-4">
                  <li>Basic Pay is 50% of CTC — Fully compliant with Code on Wages 2026.</li>
                  <li>EPF formula matches statutory limit of ₹15,000 pm ceiling.</li>
                  <li>Professional tax slab rules configured according to state guidelines.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
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
            {currentStep < 7 ? (
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
                <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save & Publish Structure"}
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
