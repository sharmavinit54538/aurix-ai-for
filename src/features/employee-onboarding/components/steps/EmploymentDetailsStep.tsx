import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { employeeOnboardingApi } from "@/services/employeeOnboardingApi";

interface EmploymentDetailsStepProps {
  initialData: any;
  onNext: () => void;
  onPrev: () => void;
}

export function EmploymentDetailsStep({ initialData, onNext, onPrev }: EmploymentDetailsStepProps) {
  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      employee_id: initialData?.employment?.employee_id || "",
      department: initialData?.employment?.department || "",
      designation: initialData?.employment?.designation || "",
      employment_type: initialData?.employment?.employment_type || "FULL_TIME",
      work_location: initialData?.employment?.work_location || "",
      joining_date: initialData?.employment?.joining_date || "",
      probation_period_months: initialData?.employment?.probation_period_months || 3,
      shift: initialData?.employment?.shift || "",
      work_mode: initialData?.employment?.work_mode || "ONSITE",
      office_location: initialData?.employment?.office_location || "",
      business_unit: initialData?.employment?.business_unit || "",
      cost_center_id: initialData?.employment?.cost_center_id || "",
      employee_category: initialData?.employment?.employee_category || "",
    }
  });

  const onSubmit = async (data: any) => {
    try {
      const response = await employeeOnboardingApi.saveStep3(data);
      if (response.success) {
        toast.success("Employment details updated.");
        onNext();
      } else {
        toast.error(response.message || "Failed to update employment details.");
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="rounded-lg bg-amber-500/10 p-4 border border-amber-500/20 text-sm text-amber-700 dark:text-amber-300">
        <strong>Note:</strong> Most employment contract details are locked and pre-configured by the HR Admin. If you notice any discrepancy, please complete the onboarding and request corrections through the HR helpdesk.
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Employee ID</Label>
          <Input {...register("employee_id")} disabled className="bg-muted" />
        </div>
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Department</Label>
          <Input {...register("department")} disabled className="bg-muted" />
        </div>
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Designation</Label>
          <Input {...register("designation")} disabled className="bg-muted" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Employment Type</Label>
          <Input {...register("employment_type")} disabled className="bg-muted" />
        </div>
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Joining Date</Label>
          <Input type="date" {...register("joining_date")} disabled className="bg-muted" />
        </div>
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Shift Timings</Label>
          <Input {...register("shift")} disabled className="bg-muted" placeholder="Default Shift" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Work Mode *</Label>
          <Select defaultValue={watch("work_mode")} onValueChange={(val) => setValue("work_mode", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select Work Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ONSITE">Onsite (Office)</SelectItem>
              <SelectItem value="REMOTE">Remote (Work from Home)</SelectItem>
              <SelectItem value="HYBRID">Hybrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Probation Period (Months) *</Label>
          <Input type="number" {...register("probation_period_months")} />
        </div>
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Office Location</Label>
          <Input {...register("office_location")} disabled className="bg-muted" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Business Unit *</Label>
          <Input {...register("business_unit")} placeholder="e.g. Engineering, Sales" />
        </div>
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Cost Center ID</Label>
          <Input {...register("cost_center_id")} placeholder="Cost Center ID" />
        </div>
        <div className="space-y-1">
          <Label className="font-bold text-foreground">Employee Category *</Label>
          <Input {...register("employee_category")} placeholder="e.g. Permanent, Contractual" />
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
