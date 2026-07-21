import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { employeeOnboardingApi } from "@/services/employeeOnboardingApi";

interface TaxPayrollStepProps {
  initialData: any;
  onNext: () => void;
  onPrev: () => void;
}

export function TaxPayrollStep({ initialData, onNext, onPrev }: TaxPayrollStepProps) {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      tax_regime: initialData?.tax_payroll?.tax_regime || "NEW",
      uan_number: initialData?.tax_payroll?.uan_number || "",
      pf_number: initialData?.tax_payroll?.pf_number || "",
      esic_number: initialData?.tax_payroll?.esic_number || "",
      professional_tax: initialData?.tax_payroll?.professional_tax || 0,
      
      // Nominee details
      nominee_name: initialData?.tax_payroll?.nominee_name || "",
      nominee_relation: initialData?.tax_payroll?.nominee_relation || "",
      nominee_aadhaar: initialData?.tax_payroll?.nominee_aadhaar || "",
      nominee_dob: initialData?.tax_payroll?.nominee_dob || "",
    }
  });

  const selectedRegime = watch("tax_regime");

  const onSubmit = async (data: any) => {
    try {
      const response = await employeeOnboardingApi.saveStep7(data);
      if (response.success) {
        toast.success("Tax & Payroll details saved.");
        onNext();
      } else {
        toast.error(response.message || "Failed to save details.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Tax Regime Selector */}
      <div className="rounded-xl border border-border/40 bg-card/40 p-6 backdrop-blur-md space-y-4">
        <h3 className="text-md font-bold text-foreground">Select Income Tax Regime *</h3>
        <p className="text-xs text-muted-foreground">
          You can select either Old or New Tax Regime for salary calculations. Choice cannot be changed until next financial year declaration window.
        </p>
        <RadioGroup
          value={selectedRegime}
          onValueChange={(val) => setValue("tax_regime", val)}
          className="flex flex-col sm:flex-row gap-4 pt-2"
        >
          <div className="flex items-center space-x-3 rounded-lg border border-border/60 p-4 flex-1 cursor-pointer hover:bg-muted/10">
            <RadioGroupItem value="NEW" id="r_new" />
            <div className="grid gap-1">
              <Label htmlFor="r_new" className="font-bold cursor-pointer">New Tax Regime</Label>
              <span className="text-xs text-muted-foreground">Lower tax slab rates, no general deductions (e.g. 80C, HRA) allowed.</span>
            </div>
          </div>
          <div className="flex items-center space-x-3 rounded-lg border border-border/60 p-4 flex-1 cursor-pointer hover:bg-muted/10">
            <RadioGroupItem value="OLD" id="r_old" />
            <div className="grid gap-1">
              <Label htmlFor="r_old" className="font-bold cursor-pointer">Old Tax Regime</Label>
              <span className="text-xs text-muted-foreground">Higher standard slabs, standard deductions & exemptions (80C, HRA, Medical) are allowed.</span>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* Statutory Numbers */}
      <div className="space-y-4">
        <h3 className="text-md font-bold text-foreground">Statutory Registrations</h3>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-1">
            <Label className="font-bold text-foreground">Universal Account Number (UAN)</Label>
            <Input {...register("uan_number")} placeholder="e.g. 100123456789 (12 digits)" />
          </div>
          <div className="space-y-1">
            <Label className="font-bold text-foreground">Provident Fund (PF) Number</Label>
            <Input {...register("pf_number")} placeholder="e.g. DL/CPM/0012345/000/0000123" />
          </div>
          <div className="space-y-1">
            <Label className="font-bold text-foreground">ESIC Number</Label>
            <Input {...register("esic_number")} placeholder="e.g. 11-12-345678-001-0001" />
          </div>
        </div>
      </div>

      {/* Nominee details */}
      <div className="space-y-4">
        <h3 className="text-md font-bold text-foreground">Nominee Information *</h3>
        <p className="text-xs text-muted-foreground">
          Declare a nominee for PF, Gratuity, and Group Term Insurance benefits.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <Label className="font-bold text-foreground">Nominee Name *</Label>
            <Input {...register("nominee_name", { required: true })} placeholder="Nominee's Full Name" />
          </div>
          <div className="space-y-1">
            <Label className="font-bold text-foreground">Relation *</Label>
            <Input {...register("nominee_relation", { required: true })} placeholder="e.g. Spouse, Mother, Child" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-1">
            <Label className="font-bold text-foreground">Nominee Aadhaar</Label>
            <Input {...register("nominee_aadhaar")} placeholder="Nominee's 12-digit Aadhaar Card No" />
          </div>
          <div className="space-y-1">
            <Label className="font-bold text-foreground">Nominee Date of Birth</Label>
            <Input type="date" {...register("nominee_dob")} />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onPrev}>
          Previous
        </Button>
        <Button type="submit">
          Save & Continue
        </Button>
      </div>
    </form>
  );
}
