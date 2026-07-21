import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { employeeOnboardingApi } from "@/services/employeeOnboardingApi";
import { DocumentUploadCard } from "../DocumentUploadCard";

interface DocumentsUploadStepProps {
  initialData: any;
  onNext: () => void;
  onPrev: () => void;
  refetchData: () => void;
}

export function DocumentsUploadStep({
  initialData,
  onNext,
  onPrev,
  refetchData,
}: DocumentsUploadStepProps) {
  const getDocByType = (type: string) => {
    return initialData?.documents?.find((d: any) => d.document_type === type) || null;
  };

  const handleContinue = async () => {
    // Validate required documents
    const mandatoryDocs = [
      { type: "RESUME", label: "Resume / CV" },
      { type: "PHOTO", label: "Passport Photo" },
      { type: "PAN", label: "PAN Card" },
      { type: "AADHAAR_FRONT", label: "Aadhaar Card Front" },
      { type: "AADHAAR_BACK", label: "Aadhaar Card Back" },
      { type: "DEGREE", label: "Degree Certificate" },
    ];

    const missing = mandatoryDocs.filter((d) => !getDocByType(d.type));
    const hasBankDoc = getDocByType("CANCELLED_CHEQUE") || getDocByType("PASSBOOK");
    if (!hasBankDoc) {
      missing.push({ type: "CANCELLED_CHEQUE", label: "Cancelled Cheque / Bank Passbook" });
    }

    if (missing.length > 0) {
      toast.error(`Please upload the following mandatory documents: ${missing.map(m => m.label).join(", ")}`);
      return;
    }

    try {
      const response = await employeeOnboardingApi.saveStep8();
      if (response.success) {
        toast.success("Documents step completed.");
        onNext();
      } else {
        toast.error(response.message || "Failed to finalize documents step.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-foreground">Mandatory Documents</h3>
        <p className="text-xs text-muted-foreground mt-0.5 mb-4">
          Please upload clear scans. Missing documents will delay your payroll setup and joining verification.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <DocumentUploadCard
            title="Resume / CV *"
            documentType="RESUME"
            required={true}
            existingDoc={getDocByType("RESUME")}
            onUploadSuccess={refetchData}
            onDeleteSuccess={refetchData}
          />
          <DocumentUploadCard
            title="Passport Size Photo *"
            documentType="PHOTO"
            required={true}
            existingDoc={getDocByType("PHOTO")}
            onUploadSuccess={refetchData}
            onDeleteSuccess={refetchData}
          />
          <DocumentUploadCard
            title="Degree Certificate / Diploma *"
            documentType="DEGREE"
            required={true}
            existingDoc={getDocByType("DEGREE")}
            onUploadSuccess={refetchData}
            onDeleteSuccess={refetchData}
          />
          <DocumentUploadCard
            title="Cancelled Cheque / Bank Passbook *"
            documentType="CANCELLED_CHEQUE"
            required={true}
            existingDoc={getDocByType("CANCELLED_CHEQUE") || getDocByType("PASSBOOK")}
            onUploadSuccess={refetchData}
            onDeleteSuccess={refetchData}
          />
          <DocumentUploadCard
            title="10th Standard Marksheet *"
            documentType="10TH_MARKSHEET"
            required={true}
            existingDoc={getDocByType("10TH_MARKSHEET")}
            onUploadSuccess={refetchData}
            onDeleteSuccess={refetchData}
          />
          <DocumentUploadCard
            title="12th Standard / Diploma Marksheet *"
            documentType="12TH_MARKSHEET"
            required={true}
            existingDoc={getDocByType("12TH_MARKSHEET")}
            onUploadSuccess={refetchData}
            onDeleteSuccess={refetchData}
          />
          <DocumentUploadCard
            title="Offer Letter (Signed Copy) *"
            documentType="OFFER_LETTER"
            required={true}
            existingDoc={getDocByType("OFFER_LETTER")}
            onUploadSuccess={refetchData}
            onDeleteSuccess={refetchData}
          />
        </div>
      </div>


      <hr className="border-border/40" />

      <div>
        <h3 className="text-lg font-bold text-foreground">Previous Employment Documents</h3>
        <p className="text-xs text-muted-foreground mt-0.5 mb-4">
          Upload documents from your last employer.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <DocumentUploadCard
            title="Experience Letter"
            documentType="EXP_LETTER"
            existingDoc={getDocByType("EXP_LETTER")}
            onUploadSuccess={refetchData}
            onDeleteSuccess={refetchData}
          />
          <DocumentUploadCard
            title="Relieving Letter"
            documentType="RELIEVING_LETTER"
            existingDoc={getDocByType("RELIEVING_LETTER")}
            onUploadSuccess={refetchData}
            onDeleteSuccess={refetchData}
          />
          <DocumentUploadCard
            title="Salary Slips (Last 3 Months Combined)"
            documentType="SALARY_SLIPS"
            existingDoc={getDocByType("SALARY_SLIPS")}
            onUploadSuccess={refetchData}
            onDeleteSuccess={refetchData}
          />
        </div>
      </div>

      <hr className="border-border/40" />

      <div>
        <h3 className="text-lg font-bold text-foreground">Other Verifications</h3>
        <p className="text-xs text-muted-foreground mt-0.5 mb-4">
          Statutory verification proofs.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <DocumentUploadCard
            title="Medical Fitness Certificate"
            documentType="MEDICAL_CERT"
            existingDoc={getDocByType("MEDICAL_CERT")}
            onUploadSuccess={refetchData}
            onDeleteSuccess={refetchData}
          />
          <DocumentUploadCard
            title="Police Verification (Optional)"
            documentType="POLICE_VERIFICATION"
            existingDoc={getDocByType("POLICE_VERIFICATION")}
            onUploadSuccess={refetchData}
            onDeleteSuccess={refetchData}
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button type="button" onClick={handleContinue}>
          Save & Continue
        </Button>
      </div>
    </div>
  );
}
