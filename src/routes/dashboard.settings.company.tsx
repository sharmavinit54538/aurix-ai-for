import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
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

function CompanySettingsPage() {
  const dispatch = useAppDispatch();
  const company = useAppSelector(selectCompanySettings);
  const loading = useAppSelector(selectSettingsLoading);
  const submitting = useAppSelector(selectSettingsSubmitting);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    city: "",
    country: "",
    taxId: "",
    registrationNumber: "",
  });

  useEffect(() => {
    dispatch(fetchCompanySettings());
  }, [dispatch]);

  useEffect(() => {
    if (company) {
      setForm({
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
  }, [company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await dispatch(updateCompanySettings(form)).unwrap();
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
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Company Profile & Details</h2>
          <p className="text-xs text-muted-foreground">Manage your legal entity information, tax identifier, and organization contacts.</p>
        </div>
        <Building2 className="h-5 w-5 text-muted-foreground" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Company Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Aurix AI Technologies Pvt Ltd"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Official Contact Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="contact@aurix.ai"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Phone Number</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Website</Label>
            <Input
              value={form.website}
              onChange={(e) => setForm({ ...form, website: e.target.value })}
              placeholder="https://aurix.ai"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">City</Label>
            <Input
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              placeholder="Bengaluru"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Country</Label>
            <Input
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              placeholder="India"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Tax Identification / GSTIN</Label>
            <Input
              value={form.taxId}
              onChange={(e) => setForm({ ...form, taxId: e.target.value })}
              placeholder="29ABCDE1234F1Z5"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Company Registration Number / CIN</Label>
            <Input
              value={form.registrationNumber}
              onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
              placeholder="CIN-U72200KA2024PTC123456"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Company Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
