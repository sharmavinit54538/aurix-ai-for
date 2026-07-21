import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { employeeOnboardingApi } from "@/services/employeeOnboardingApi";

interface FinalReviewStepProps {
  initialData: any;
  onJumpToStep: (stepOrder: number) => void;
  onComplete: () => void;
}

export function FinalReviewStep({ initialData, onJumpToStep, onComplete }: FinalReviewStepProps) {
  const [submitting, setSubmitting] = useState(false);

  // Checklists
  const personalInfo = initialData?.personal_info?.first_name && initialData?.personal_info?.phone;
  const identity = initialData?.identity?.aadhaar_number && initialData?.identity?.pan_number;
  const education = initialData?.education?.length > 0;
  const experience = initialData?.experience?.length > 0;
  const bank = initialData?.bank?.bank_name && initialData?.bank?.account_number;
  const tax = initialData?.tax_payroll?.nominee_name;
  
  const getDocByType = (type: string) => {
    return initialData?.documents?.find((d: any) => d.document_type === type) || null;
  };
  const documents =
    getDocByType("RESUME") &&
    getDocByType("PHOTO") &&
    getDocByType("PAN") &&
    getDocByType("AADHAAR_FRONT") &&
    getDocByType("AADHAAR_BACK") &&
    getDocByType("DEGREE") &&
    getDocByType("CANCELLED_CHEQUE");
    
  const policies = initialData?.policies?.length >= 5;

  const checklistItems = [
    { label: "Personal Information", status: personalInfo, step: 1 },
    { label: "Identity Verification Numbers", status: identity, step: 2 },
    { label: "Employment Details Review", status: true, step: 3 }, // read-only mostly
    { label: "Educational Qualification Records", status: education, step: 4 },
    { label: "Professional Experience Records", status: experience, step: 5 },
    { label: "Salary Bank Details", status: bank, step: 6 },
    { label: "Tax Regime & Nominee declarations", status: tax, step: 7 },
    { label: "Verification Documents Upload", status: documents, step: 8 },
    { label: "Statutory Policies Acceptances", status: policies, step: 9 },
  ];

  const handleFinalSubmit = async () => {
    const incomplete = checklistItems.filter(item => !item.status);
    if (incomplete.length > 0) {
      toast.error(`Please complete all sections before finishing. Incomplete: ${incomplete.map(i => i.label).join(", ")}`);
      return;
    }

    setSubmitting(true);
    try {
      const response = await employeeOnboardingApi.complete();
      if (response.success) {
        toast.success("Onboarding completed successfully! Redirecting...");
        onComplete();
      } else {
        toast.error(response.message || "Failed to complete onboarding.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred during final submission.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-foreground">Final Onboarding Review</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Please review the checklist. You can jump back to any step to make corrections before submission.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {checklistItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border border-border/40 bg-card/40 p-4 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              {item.status ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : (
                <XCircle className="h-5 w-5 text-rose-500" />
              )}
              <span className={`text-sm font-semibold ${item.status ? "text-foreground" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              type="button"
              className="text-xs text-primary hover:underline flex items-center gap-1"
              onClick={() => onJumpToStep(item.step)}
            >
              Edit <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>

      {/* Summary disclaimer */}
      <div className="rounded-lg bg-primary/5 p-4 border border-primary/10 text-xs text-muted-foreground">
        By clicking "Complete Onboarding", you certify that all information provided in this flow is accurate, true, and complete. Any misrepresentation of credentials or documents is grounds for disciplinary action up to termination.
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="button"
          size="lg"
          disabled={submitting}
          onClick={handleFinalSubmit}
          className="w-full sm:w-auto bg-gradient-to-r from-primary to-violet-600 text-white font-bold"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4.5 w-4.5 animate-spin mr-2" /> Completing Onboarding...
            </>
          ) : (
            "Complete Onboarding"
          )}
        </Button>
      </div>
    </div>
  );
}
