import React, { useState } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Check,
  Upload,
  FileText,
  Sparkles,
  ShieldCheck,
  Save,
  Trash2,
} from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ReimbursementClaim, ExpenseCategory, ReceiptDocument } from "./reimbursementsTypes";
import { EXPENSE_CATEGORIES_LIST } from "@/services/reimbursementsApi";

interface CreateClaimWizardDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (payload: Partial<ReimbursementClaim>) => Promise<void>;
}

export const CreateClaimWizardDrawer: React.FC<CreateClaimWizardDrawerProps> = ({
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
  const [designation, setDesignation] = useState("Principal Architect");
  const [expenseCategory, setExpenseCategory] = useState<ExpenseCategory>("Travel");
  const [expenseDate, setExpenseDate] = useState("2026-07-15");
  const [businessPurpose, setBusinessPurpose] = useState("Q3 Enterprise Architecture Client Summit in Bangalore.");

  const [claimAmount, setClaimAmount] = useState<number>(24500);
  const [currency, setCurrency] = useState("INR");
  const [taxAmount, setTaxAmount] = useState<number>(3735);
  const [project, setProject] = useState("PROJ-AURIX-CORE");
  const [costCenter, setCostCenter] = useState("CC-ENG-TECH");
  const [location, setLocation] = useState("Bangalore");

  const [receipts, setReceipts] = useState<ReceiptDocument[]>([
    {
      id: "rec-new-1",
      fileName: "IndiGo_Flight_Invoice.pdf",
      fileUrl: "#",
      fileType: "PDF",
      fileSize: "1.4 MB",
      uploadedAt: "2026-07-15",
      ocrVerified: true,
      extractedAmount: 24500,
      extractedVendor: "IndiGo Airlines",
    },
  ]);

  const steps = [
    { num: 1, title: "1. Employee & Purpose" },
    { num: 2, title: "2. Expense Details" },
    { num: 3, title: "3. Receipts & OCR" },
    { num: 4, title: "4. Review & Submit" },
  ];

  const handleNext = () => {
    if (currentStep === 1 && !businessPurpose.trim()) {
      toast.error("Please enter a valid business purpose.");
      return;
    }
    if (currentStep === 2 && (!claimAmount || claimAmount <= 0)) {
      toast.error("Please enter a valid expense amount.");
      return;
    }
    setCurrentStep((prev) => Math.min(4, prev + 1));
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleUploadSim = () => {
    const newDoc: ReceiptDocument = {
      id: `rec-${Date.now()}`,
      fileName: `Receipt_Document_${receipts.length + 1}.pdf`,
      fileUrl: "#",
      fileType: "PDF",
      fileSize: "980 KB",
      uploadedAt: new Date().toISOString().split("T")[0],
      ocrVerified: true,
      extractedAmount: claimAmount,
      extractedVendor: "Verified Vendor Ltd",
    };
    setReceipts([...receipts, newDoc]);
    toast.success("Uploaded and OCR-verified receipt document.");
  };

  const handleFormSubmit = async () => {
    setSaving(true);
    try {
      await onSave({
        employeeName,
        employeeCode,
        department,
        designation,
        expenseCategory,
        expenseDate,
        businessPurpose,
        claimAmount,
        currency,
        taxAmount,
        project,
        costCenter,
        location,
        receipts,
      });
      toast.success(`Submitted reimbursement claim of ₹${claimAmount.toLocaleString("en-IN")}`);
      onClose();
    } catch {
      toast.error("Failed to submit claim.");
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
              <Sparkles className="w-5 h-5 text-blue-400" />
              Create Employee Reimbursement Claim
            </SheetTitle>
            <p className="text-xs text-slate-400 mt-0.5">Multi-step wizard for claim submission and policy check.</p>
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
          {/* STEP 1: Employee & Purpose */}
          {currentStep === 1 && (
            <div className="space-y-4 max-w-xl">
              <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Step 1: Employee & Purpose</h3>

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
                    className="bg-slate-900 border-white/10 text-xs text-blue-300 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Expense Category</label>
                  <Select value={expenseCategory} onValueChange={(val: any) => setExpenseCategory(val)}>
                    <SelectTrigger className="bg-slate-900 border-white/10 text-xs text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-white/10 text-xs text-white">
                      {EXPENSE_CATEGORIES_LIST.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Expense Date</label>
                  <Input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="bg-slate-900 border-white/10 text-xs text-white"
                  />
                </div>

                <div className="col-span-2 space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Business Purpose & Details *</label>
                  <Textarea
                    value={businessPurpose}
                    onChange={(e) => setBusinessPurpose(e.target.value)}
                    rows={3}
                    className="bg-slate-900 border-white/10 text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Expense Details */}
          {currentStep === 2 && (
            <div className="space-y-4 max-w-xl">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Step 2: Expense Amount & Cost Center</h3>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Claim Amount (₹) *</label>
                  <Input
                    type="number"
                    value={claimAmount}
                    onChange={(e) => setClaimAmount(Number(e.target.value))}
                    className="bg-slate-900 border-white/10 text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">GST Tax Amount (₹)</label>
                  <Input
                    type="number"
                    value={taxAmount}
                    onChange={(e) => setTaxAmount(Number(e.target.value))}
                    className="bg-slate-900 border-white/10 text-xs text-white font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Cost Center</label>
                  <Input
                    value={costCenter}
                    onChange={(e) => setCostCenter(e.target.value)}
                    className="bg-slate-900 border-white/10 text-xs text-blue-300 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-slate-300 font-medium">Project Tag</label>
                  <Input
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                    className="bg-slate-900 border-white/10 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Receipts & OCR */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-purple-400 uppercase tracking-wider">Step 3: Receipt Upload & OCR Scanner</h3>

              <div onClick={handleUploadSim} className="receipt-upload-box">
                <Upload className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h4 className="text-xs font-semibold text-white">Drag & drop receipt PDF or images here</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Supports PDF, PNG, JPEG up to 10MB per file</p>
                <Button size="sm" variant="outline" className="mt-3 border-blue-500/30 text-blue-400 text-xs">
                  Browse Files
                </Button>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-300">Uploaded Documents ({receipts.length})</h4>
                {receipts.map((rec, idx) => (
                  <div key={rec.id} className="p-3 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-blue-400" />
                      <div>
                        <h5 className="text-xs font-semibold text-white">{rec.fileName}</h5>
                        <p className="text-[10px] text-slate-400">{rec.fileSize} • OCR Verified</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setReceipts(receipts.filter((_, i) => i !== idx))}
                      className="h-6 w-6 p-0 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Step 4: Final Claim Review & Policy Check</h3>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Total Claim Amount</span>
                  <span className="text-lg font-bold font-mono text-emerald-400">₹{claimAmount.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Category & Dept:</span>
                  <span className="text-slate-200">{expenseCategory} — {department}</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  Policy Validation Passed
                </div>
                <p className="text-xs text-slate-300">Claim is within quarterly department travel budget limit. Ready for Finance sign-off.</p>
              </div>
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
                <Save className="w-4 h-4" /> {saving ? "Submitting..." : "Submit Claim"}
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
