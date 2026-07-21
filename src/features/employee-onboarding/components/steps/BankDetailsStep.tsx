import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { employeeOnboardingApi } from "@/services/employeeOnboardingApi";
import { DocumentUploadCard } from "../DocumentUploadCard";

interface BankDetailsStepProps {
  initialData: any;
  onNext: () => void;
  onPrev: () => void;
  refetchData: () => void;
}

export function BankDetailsStep({ initialData, onNext, onPrev, refetchData }: BankDetailsStepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      bank_name: initialData?.bank?.bank_name || "",
      account_holder_name: initialData?.bank?.account_holder_name || "",
      account_number: initialData?.bank?.account_number || "",
      ifsc_code: initialData?.bank?.ifsc_code || "",
      branch: initialData?.bank?.branch || "",
      upi_id: initialData?.bank?.upi_id || "",
    }
  });

  const getDocByType = (type: string) => {
    return initialData?.documents?.find((d: any) => d.document_type === type) || null;
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await employeeOnboardingApi.saveStep6(data);
      if (response.success) {
        toast.success("Bank details saved.");
        onNext();
      } else {
        toast.error(response.message || "Failed to save bank details.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <Label className="font-bold text-foreground">Bank Name *</Label>
            <Input {...register("bank_name", { required: true })} placeholder="e.g. HDFC Bank, ICICI Bank" />
          </div>
          <div className="space-y-1">
            <Label className="font-bold text-foreground">Account Holder Name *</Label>
            <Input {...register("account_holder_name", { required: true })} placeholder="As printed in bank records" />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <Label className="font-bold text-foreground">Account Number *</Label>
            <Input {...register("account_number", { required: true })} placeholder="Bank Account Number" />
          </div>
          <div className="space-y-1">
            <Label className="font-bold text-foreground">IFSC Code *</Label>
            <Input {...register("ifsc_code", { required: true, pattern: /^[A-Z]{4}0[A-Z0-9]{6}$/ })} placeholder="e.g. HDFC0001234" />
            {errors.ifsc_code && <span className="text-xs text-destructive">Invalid IFSC Code format.</span>}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <Label className="font-bold text-foreground">Branch Location</Label>
            <Input {...register("branch")} placeholder="e.g. Connaught Place Branch" />
          </div>
          <div className="space-y-1">
            <Label className="font-bold text-foreground">UPI ID (Optional)</Label>
            <Input {...register("upi_id")} placeholder="e.g. username@okaxis" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            Save Bank Numbers
          </Button>
        </div>
      </form>

      <hr className="border-border/40" />

      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Upload Bank Verification Documents</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <DocumentUploadCard
            title="Cancelled Cheque Leaf *"
            documentType="CANCELLED_CHEQUE"
            required={true}
            existingDoc={getDocByType("CANCELLED_CHEQUE")}
            onUploadSuccess={refetchData}
            onDeleteSuccess={refetchData}
          />
          <DocumentUploadCard
            title="Passbook First Page (Optional)"
            documentType="PASSBOOK"
            existingDoc={getDocByType("PASSBOOK")}
            onUploadSuccess={refetchData}
            onDeleteSuccess={refetchData}
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button
          type="button"
          onClick={() => {
            const hasCheque = getDocByType("CANCELLED_CHEQUE");
            if (!hasCheque) {
              toast.error("Please upload a Cancelled Cheque Leaf to continue.");
              return;
            }
            onNext();
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
