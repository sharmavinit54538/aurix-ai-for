import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { employeeOnboardingApi } from "@/services/employeeOnboardingApi";
import { DocumentUploadCard } from "../DocumentUploadCard";

interface IdentityVerificationStepProps {
  initialData: any;
  onNext: () => void;
  onPrev: () => void;
  refetchData: () => void;
}

export function IdentityVerificationStep({
  initialData,
  onNext,
  onPrev,
  refetchData,
}: IdentityVerificationStepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      aadhaar_number: initialData?.identity?.aadhaar_number || "",
      pan_number: initialData?.identity?.pan_number || "",
      passport_number: initialData?.identity?.passport_number || "",
      driving_license: initialData?.identity?.driving_license || "",
      voter_id: initialData?.identity?.voter_id || "",
    }
  });

  const getDocByType = (type: string) => {
    return initialData?.documents?.find((d: any) => d.document_type === type) || null;
  };

  const onSubmit = async (data: any) => {
    try {
      const response = await employeeOnboardingApi.saveStep2(data);
      if (response.success) {
        toast.success("Identity details saved.");
        onNext();
      } else {
        toast.error(response.message || "Failed to save identity data.");
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
            <Label className="font-bold text-foreground">Aadhaar Number (12 digits) *</Label>
            <Input
              {...register("aadhaar_number", {
                required: true,
                pattern: /^\d{12}$/,
              })}
              placeholder="e.g. 123456789012"
            />
            {errors.aadhaar_number && (
              <span className="text-xs text-destructive">Must be a valid 12-digit number.</span>
            )}
          </div>
          <div className="space-y-1">
            <Label className="font-bold text-foreground">PAN Card Number *</Label>
            <Input
              {...register("pan_number", {
                required: true,
                pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
              })}
              placeholder="e.g. ABCDE1234F"
            />
            {errors.pan_number && (
              <span className="text-xs text-destructive">Must be a valid PAN format (ABCDE1234F).</span>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-1">
            <Label className="font-bold text-foreground">Passport Number</Label>
            <Input {...register("passport_number")} placeholder="Passport Number" />
          </div>
          <div className="space-y-1">
            <Label className="font-bold text-foreground">Driving License</Label>
            <Input {...register("driving_license")} placeholder="Driving License No" />
          </div>
          <div className="space-y-1">
            <Label className="font-bold text-foreground">Voter ID</Label>
            <Input {...register("voter_id")} placeholder="Voter ID No" />
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit">
            Save Verification Numbers
          </Button>
        </div>
      </form>

      <hr className="border-border/40" />

      <div>
        <h3 className="text-lg font-bold text-foreground mb-4">Upload Verification Documents</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <DocumentUploadCard
            title="Aadhaar Card Front"
            documentType="AADHAAR_FRONT"
            required={true}
            existingDoc={getDocByType("AADHAAR_FRONT")}
            onUploadSuccess={refetchData}
            onDeleteSuccess={refetchData}
          />
          <DocumentUploadCard
            title="Aadhaar Card Back"
            documentType="AADHAAR_BACK"
            required={true}
            existingDoc={getDocByType("AADHAAR_BACK")}
            onUploadSuccess={refetchData}
            onDeleteSuccess={refetchData}
          />
          <DocumentUploadCard
            title="PAN Card"
            documentType="PAN"
            required={true}
            existingDoc={getDocByType("PAN")}
            onUploadSuccess={refetchData}
            onDeleteSuccess={refetchData}
          />
          <DocumentUploadCard
            title="Passport (Optional)"
            documentType="PASSPORT"
            existingDoc={getDocByType("PASSPORT")}
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
            const hasAadhaarFront = getDocByType("AADHAAR_FRONT");
            const hasAadhaarBack = getDocByType("AADHAAR_BACK");
            const hasPan = getDocByType("PAN");
            if (!hasAadhaarFront || !hasAadhaarBack || !hasPan) {
              toast.error("Please upload Aadhaar Front, Aadhaar Back, and PAN Card to continue.");
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
