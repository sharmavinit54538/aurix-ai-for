import React, { useEffect, useState, useRef, useCallback } from "react";
import { Building2, Globe, Mail, Phone, Upload, Save, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  fetchCompanySettings,
  updateCompanySettings,
  uploadCompanyLogo,
  isMissingApiError,
} from "../../api";
import type { CompanySettingsForm } from "../../types";
import { UnsavedChangesBanner } from "../UnsavedChangesBanner";

interface CompanySectionProps {
  canEdit: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

const TIMEZONES = [
  "Asia/Kolkata (IST - UTC+05:30)",
  "UTC (UTC+00:00)",
  "America/New_York (EST - UTC-05:00)",
  "Europe/London (GMT - UTC+00:00)",
  "Asia/Dubai (GST - UTC+04:00)",
  "Asia/Singapore (SGT - UTC+08:00)",
];

const CURRENCIES = [
  "INR (₹) - Indian Rupee",
  "USD ($) - US Dollar",
  "EUR (€) - Euro",
  "GBP (£) - British Pound",
  "AED (AED) - UAE Dirham",
];

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function CompanySection({ canEdit, onDirtyChange }: CompanySectionProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<CompanySettingsForm | null>(null);
  const [formData, setFormData] = useState<CompanySettingsForm>({
    name: "",
    logoUrl: "",
    logoDataUrl: "",
    address: "",
    city: "",
    state: "",
    country: "India",
    postalCode: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
    timezone: "Asia/Kolkata (IST - UTC+05:30)",
    currency: "INR (₹) - Indian Rupee",
    financialYearStart: "April",
    financialYearEnd: "March",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoUploadProgress, setLogoUploadProgress] = useState(0);
  const [logoApiNotice, setLogoApiNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDirty = initialData ? JSON.stringify(initialData) !== JSON.stringify(formData) : false;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setErrors({});
    try {
      const data = await fetchCompanySettings();
      setInitialData(data);
      setFormData(data);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to load company settings.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) {
      errs.name = "Company name is required";
    }
    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      errs.contactEmail = "Enter a valid email address";
    }
    if (formData.contactPhone && !/^\+?[0-9\s-]{7,15}$/.test(formData.contactPhone)) {
      errs.contactPhone = "Enter a valid phone number (7-15 digits)";
    }
    if (
      formData.website &&
      !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.website)
    ) {
      errs.website = "Enter a valid website URL";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canEdit) return;
    if (!validate()) {
      toast.error("Please resolve validation errors before saving.");
      return;
    }

    setSubmitting(true);
    try {
      const saved = await updateCompanySettings(formData);
      setInitialData(saved);
      setFormData(saved);
      toast.success("Company settings updated successfully!");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to save company settings.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogoUpload = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file (PNG, JPG, SVG, WebP).");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo file size must be less than 2MB.");
      return;
    }

    setLogoUploading(true);
    setLogoUploadProgress(30);
    setLogoApiNotice(null);

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, logoDataUrl: reader.result as string }));
    };
    reader.readAsDataURL(file);

    try {
      setLogoUploadProgress(70);
      const res = await uploadCompanyLogo(file);
      setLogoUploadProgress(100);
      if (res.logoUrl) {
        setFormData((prev) => ({ ...prev, logoUrl: res.logoUrl }));
      }
      toast.success("Company logo uploaded successfully!");
    } catch (err: unknown) {
      if (isMissingApiError(err)) {
        setLogoApiNotice(err.message);
        toast.info(
          "Logo preview updated locally. Dedicated logo upload endpoint is not implemented on backend.",
        );
      } else {
        const msg = (err as { message?: string })?.message || "Failed to upload logo to server.";
        toast.error(msg);
      }
    } finally {
      setLogoUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64 rounded-lg" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Brand & Identity Card */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Organization Identity
            </h3>
            <p className="text-xs text-muted-foreground">
              Legal name, public brand, and corporate logo.
            </p>
          </div>
          <Building2 className="h-4 w-4 text-primary shrink-0" />
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Logo container */}
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <Label className="text-xs font-medium text-foreground">Company Logo</Label>
            <div className="relative grid h-24 w-24 place-items-center rounded-2xl border-2 border-dashed border-border bg-muted/40 overflow-hidden shadow-inner">
              {formData.logoDataUrl || formData.logoUrl ? (
                <img
                  src={formData.logoDataUrl || formData.logoUrl}
                  alt="Company Logo"
                  className="h-full w-full object-contain p-2"
                />
              ) : (
                <Building2 className="h-8 w-8 text-muted-foreground/60" />
              )}
              {logoUploading && (
                <div className="absolute inset-0 grid place-items-center bg-background/80 text-xs font-semibold text-primary">
                  {logoUploadProgress}%
                </div>
              )}
            </div>

            {canEdit && (
              <>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleLogoUpload(e.target.files?.[0] || null)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={logoUploading}
                  className="mt-1 h-8 gap-1.5 text-xs cursor-pointer"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {formData.logoDataUrl || formData.logoUrl ? "Change Logo" : "Upload Logo"}
                </Button>
                <p className="text-[10px] text-muted-foreground">PNG, JPG, or SVG under 2MB</p>
              </>
            )}
          </div>

          {/* Core Info */}
          <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="company-name" className="text-xs font-medium">
                Company Legal Name *
              </Label>
              <Input
                id="company-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={!canEdit}
                placeholder="e.g. Acme Technologies India Private Limited"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-[11px] text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company-website" className="text-xs font-medium">
                Corporate Website
              </Label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company-website"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  disabled={!canEdit}
                  placeholder="https://example.com"
                  className={`pl-9 ${errors.website ? "border-destructive" : ""}`}
                />
              </div>
              {errors.website && <p className="text-[11px] text-destructive">{errors.website}</p>}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="company-email" className="text-xs font-medium">
                Contact Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company-email"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  disabled={!canEdit}
                  placeholder="hr@example.com"
                  className={`pl-9 ${errors.contactEmail ? "border-destructive" : ""}`}
                />
              </div>
              {errors.contactEmail && (
                <p className="text-[11px] text-destructive">{errors.contactEmail}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="company-phone" className="text-xs font-medium">
                Contact Phone
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="company-phone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  disabled={!canEdit}
                  placeholder="+91 98765 43210"
                  className={`pl-9 ${errors.contactPhone ? "border-destructive" : ""}`}
                />
              </div>
              {errors.contactPhone && (
                <p className="text-[11px] text-destructive">{errors.contactPhone}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Address & Headquarters Card */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 border-b border-border/60 pb-4">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Headquarters & Address
          </h3>
          <p className="text-xs text-muted-foreground">
            Physical office location used on official correspondence and payslips.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="company-address" className="text-xs font-medium">
              Street Address
            </Label>
            <Input
              id="company-address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              disabled={!canEdit}
              placeholder="Suite 400, Innovation Park, MG Road"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-city" className="text-xs font-medium">
              City
            </Label>
            <Input
              id="company-city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              disabled={!canEdit}
              placeholder="Bengaluru"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-state" className="text-xs font-medium">
              State / Province
            </Label>
            <Input
              id="company-state"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              disabled={!canEdit}
              placeholder="Karnataka"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-country" className="text-xs font-medium">
              Country
            </Label>
            <Input
              id="company-country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              disabled={!canEdit}
              placeholder="India"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company-postal" className="text-xs font-medium">
              Postal / PIN Code
            </Label>
            <Input
              id="company-postal"
              value={formData.postalCode}
              onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
              disabled={!canEdit}
              placeholder="560001"
            />
          </div>
        </div>
      </div>

      {/* Regional & Financial Preferences Card */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 border-b border-border/60 pb-4">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Fiscal & Localization Preferences
          </h3>
          <p className="text-xs text-muted-foreground">
            Standard timezone, reporting currency, and financial year cycle.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Operating Timezone</Label>
            <Select
              value={formData.timezone}
              onValueChange={(v) => setFormData({ ...formData, timezone: v })}
              disabled={!canEdit}
            >
              <SelectTrigger id="company-timezone" className="w-full">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz} value={tz}>
                    {tz}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Default Currency</Label>
            <Select
              value={formData.currency}
              onValueChange={(v) => setFormData({ ...formData, currency: v })}
              disabled={!canEdit}
            >
              <SelectTrigger id="company-currency" className="w-full">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Financial Year Begins</Label>
            <Select
              value={formData.financialYearStart}
              onValueChange={(v) => setFormData({ ...formData, financialYearStart: v })}
              disabled={!canEdit}
            >
              <SelectTrigger id="company-fy-start" className="w-full">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Financial Year Ends</Label>
            <Select
              value={formData.financialYearEnd}
              onValueChange={(v) => setFormData({ ...formData, financialYearEnd: v })}
              disabled={!canEdit}
            >
              <SelectTrigger id="company-fy-end" className="w-full">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      {canEdit && (
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => initialData && setFormData(initialData)}
            disabled={!isDirty || submitting}
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Discard Changes
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!isDirty || submitting}
            className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="h-3.5 w-3.5" />
            {submitting ? "Saving..." : "Save Company Settings"}
          </Button>
        </div>
      )}

      <UnsavedChangesBanner
        isDirty={isDirty}
        submitting={submitting}
        onReset={() => initialData && setFormData(initialData)}
        onSave={() => handleSave()}
      />
    </form>
  );
}
