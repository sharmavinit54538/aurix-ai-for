import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Building2, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { aurix } from "@/lib/aurix-store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectCompanySettings, selectSettingsLoading, selectSettingsSubmitting } from "@/store/settings/settingsSelectors";
import { fetchCompanySettings, updateCompanySettings } from "@/store/settings/settingsThunk";

export const Route = createFileRoute("/dashboard/settings/company")({
  head: () => ({ meta: [{ title: "Company Settings — Aurix" }] }),
  component: CompanySettingsPage,
});

const schema = z.object({
  name: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  phone: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  city: z.string().optional(),
  country: z.string().optional(),
  taxId: z.string().optional(),
  registrationNumber: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

function CompanySettingsPage() {
  const dispatch = useAppDispatch();
  const company = useAppSelector(selectCompanySettings);
  const loading = useAppSelector(selectSettingsLoading);
  const submitting = useAppSelector(selectSettingsSubmitting);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      website: "",
      city: "",
      country: "",
      taxId: "",
      registrationNumber: "",
    }
  });

  useEffect(() => {
    dispatch(fetchCompanySettings());
  }, [dispatch]);

  useEffect(() => {
    if (company) {
      reset({
        name: company.name || "",
        email: company.email || "",
        phone: company.phone || "",
        website: company.website || "",
        city: company.city || "",
        country: company.country || "",
        taxId: company.taxId || "",
        registrationNumber: company.registrationNumber || "",
      });
    }
  }, [company, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await dispatch(updateCompanySettings(data)).unwrap();
      if (res?.name) {
        const currentWs = aurix.get();
        aurix.set({
          company: {
            id: res.id || currentWs.company?.id || "",
            name: res.name,
          },
        });
      }
      toast.success("Company profile updated successfully!");
      reset(data);
    } catch {
      toast.error("Failed to update company profile");
    }
  };

  if (loading && !company) {
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl relative overflow-hidden">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Company Profile & Details</h2>
          <p className="text-xs text-muted-foreground">Manage your legal entity information, tax identifier, and organization contacts.</p>
        </div>
        <Building2 className="h-5 w-5 text-muted-foreground" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Company Name</Label>
            <Input
              {...register("name")}
              placeholder="Aurix AI Technologies Pvt Ltd"
              aria-invalid={!!errors.name}
            />
            {errors.name && <p className="text-[10px] text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Official Contact Email</Label>
            <Input
              type="email"
              {...register("email")}
              placeholder="contact@aurix.ai"
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-[10px] text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Phone Number</Label>
            <Input
              {...register("phone")}
              placeholder="+91 98765 43210"
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <p className="text-[10px] text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Website</Label>
            <Input
              {...register("website")}
              placeholder="https://aurix.ai"
              aria-invalid={!!errors.website}
            />
            {errors.website && <p className="text-[10px] text-destructive">{errors.website.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">City</Label>
            <Input
              {...register("city")}
              placeholder="Bengaluru"
              aria-invalid={!!errors.city}
            />
            {errors.city && <p className="text-[10px] text-destructive">{errors.city.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Country</Label>
            <Input
              {...register("country")}
              placeholder="India"
              aria-invalid={!!errors.country}
            />
            {errors.country && <p className="text-[10px] text-destructive">{errors.country.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Tax Identification / GSTIN</Label>
            <Input
              {...register("taxId")}
              placeholder="29ABCDE1234F1Z5"
              aria-invalid={!!errors.taxId}
            />
            {errors.taxId && <p className="text-[10px] text-destructive">{errors.taxId.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Company Registration Number / CIN</Label>
            <Input
              {...register("registrationNumber")}
              placeholder="CIN-U72200KA2024PTC123456"
              aria-invalid={!!errors.registrationNumber}
            />
            {errors.registrationNumber && <p className="text-[10px] text-destructive">{errors.registrationNumber.message}</p>}
          </div>
        </div>

        {isDirty && (
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Company Profile
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
