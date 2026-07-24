import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { RefreshCw, Save, Sliders } from "lucide-react";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectGeneralSettings, selectSettingsError, selectSettingsLoading, selectSettingsSubmitting } from "@/store/settings/settingsSelectors";
import { fetchGeneralSettings, updateGeneralSettings } from "@/store/settings/settingsThunk";

export const Route = createFileRoute("/dashboard/settings/general")({
  head: () => ({ meta: [{ title: "General Settings — Aurix" }] }),
  component: GeneralSettingsPage,
});

const schema = z.object({
  appName: z.string().min(1, "Application name is required"),
  language: z.string().min(1, "Language is required"),
  timezone: z.string().min(1, "Time zone is required"),
  dateFormat: z.string().min(1, "Date format is required"),
  currency: z.string().min(1, "Currency is required"),
  fiscalYearStart: z.string().min(1, "Fiscal year is required"),
});

type FormValues = z.infer<typeof schema>;

function GeneralSettingsPage() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectGeneralSettings);
  const loading = useAppSelector(selectSettingsLoading);
  const submitting = useAppSelector(selectSettingsSubmitting);
  const error = useAppSelector(selectSettingsError);

  const { register, handleSubmit, control, reset, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      appName: "Aurix HRMS",
      language: "en",
      timezone: "UTC+05:30 (IST)",
      dateFormat: "DD/MM/YYYY",
      currency: "INR (₹)",
      fiscalYearStart: "April",
    }
  });

  useEffect(() => {
    dispatch(fetchGeneralSettings());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      reset({
        appName: settings.appName || "Aurix HRMS",
        language: settings.language || "en",
        timezone: settings.timezone || "UTC+05:30 (IST)",
        dateFormat: settings.dateFormat || "DD/MM/YYYY",
        currency: settings.currency || "INR (₹)",
        fiscalYearStart: settings.fiscalYearStart || "April",
      });
    }
  }, [settings, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      await dispatch(updateGeneralSettings(data)).unwrap();
      toast.success("General settings saved successfully!");
      reset(data);
    } catch {
      toast.error("Failed to save general settings");
    }
  };

  if (loading && !settings) {
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
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
          <h2 className="text-lg font-semibold tracking-tight">General System Settings</h2>
          <p className="text-xs text-muted-foreground">Configure global application defaults, localization, and work schedule.</p>
        </div>
        <Sliders className="h-5 w-5 text-muted-foreground" />
      </div>

      {error ? (
        <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-500">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Application Name</Label>
            <Input
              {...register("appName")}
              placeholder="Aurix HRMS"
              aria-invalid={!!errors.appName}
            />
            {errors.appName && <p className="text-[10px] text-destructive">{errors.appName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">System Language</Label>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English (US)</SelectItem>
                    <SelectItem value="en-gb">English (UK)</SelectItem>
                    <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                    <SelectItem value="es">Spanish (Español)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.language && <p className="text-[10px] text-destructive">{errors.language.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Time Zone</Label>
            <Controller
              name="timezone"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC+05:30 (IST)">UTC+05:30 (Asia/Kolkata - IST)</SelectItem>
                    <SelectItem value="UTC+00:00 (GMT)">UTC+00:00 (London - GMT)</SelectItem>
                    <SelectItem value="UTC-05:00 (EST)">UTC-05:00 (New York - EST)</SelectItem>
                    <SelectItem value="UTC-08:00 (PST)">UTC-08:00 (San Francisco - PST)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.timezone && <p className="text-[10px] text-destructive">{errors.timezone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Date Format</Label>
            <Controller
              name="dateFormat"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.dateFormat && <p className="text-[10px] text-destructive">{errors.dateFormat.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Primary Currency</Label>
            <Controller
              name="currency"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INR (₹)">INR (₹)</SelectItem>
                    <SelectItem value="USD ($)">USD ($)</SelectItem>
                    <SelectItem value="EUR (€)">EUR (€)</SelectItem>
                    <SelectItem value="GBP (£)">GBP (£)</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.currency && <p className="text-[10px] text-destructive">{errors.currency.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Fiscal Year Start</Label>
            <Controller
              name="fiscalYearStart"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="January">January</SelectItem>
                    <SelectItem value="April">April</SelectItem>
                    <SelectItem value="October">October</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.fiscalYearStart && <p className="text-[10px] text-destructive">{errors.fiscalYearStart.message}</p>}
          </div>
        </div>

        {isDirty && (
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save General Settings
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
