import { useMemo, useState, type FormEvent } from "react";
import { RotateCcw, Save, Sliders } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useSuperAdminSettings, useUpdateSuperAdminSettings } from "../hooks";
import {
  AccessDeniedState,
  EmptyState,
  ErrorState,
  Panel,
} from "../components/SuperAdminStates";
import { isAuthorizationError } from "../errors";
import type { PlatformSettingValue, PlatformSettings } from "../types";

type Group = "General" | "Access & security" | "Operations" | "Other";

/** Labels for the keys served by GET /super-admin/settings. Unknown keys are still rendered. */
const SETTING_META: Record<string, { label: string; description: string; group: Group }> = {
  emailSenderName: { label: "Email sender name", description: "Display name used on platform emails.", group: "General" },
  emailSenderAddress: { label: "Email sender address", description: "From-address used on platform emails.", group: "General" },
  securityAlertEmail: { label: "Security alert email", description: "Mailbox that should receive security alerts.", group: "General" },
  allowNewRegistrations: { label: "Allow new registrations", description: "Whether new companies may sign up.", group: "Access & security" },
  enforceMfaGlobally: { label: "Enforce MFA globally", description: "Require multi-factor authentication for every account.", group: "Access & security" },
  sessionTimeoutMinutes: { label: "Session timeout (minutes)", description: "Idle time before a session should expire.", group: "Access & security" },
  defaultTrialDays: { label: "Default trial length (days)", description: "Trial period for newly created tenants.", group: "Access & security" },
  maintenanceMode: { label: "Maintenance mode", description: "Marks the platform as under maintenance for non-Super-Admin users.", group: "Operations" },
  aiTokenRateLimitPerHour: { label: "AI token limit per hour", description: "Hourly AI token budget.", group: "Operations" },
  autoBackupIntervalHours: { label: "Automatic backup interval (hours)", description: "Hours between automatic backups.", group: "Operations" },
};

const GROUP_ORDER: Group[] = ["General", "Access & security", "Operations", "Other"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function humanize(key: string): string {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").toLowerCase();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

/** Keys holding an email address end in "Email"/"Address" (e.g. securityAlertEmail), unlike emailSenderName. */
function isEmailKey(key: string): boolean {
  return /(?:email|address)$/i.test(key);
}

type EditValue = string | boolean;

export function SuperAdminSettingsPage() {
  const settings = useSuperAdminSettings();
  const updateSettings = useUpdateSuperAdminSettings();
  const [edits, setEdits] = useState<Record<string, EditValue>>({});

  const server = settings.data;

  const valueFor = (key: string): EditValue => {
    if (key in edits) return edits[key];
    const original = server?.[key];
    return typeof original === "boolean" ? original : original === undefined ? "" : String(original);
  };

  const validationError = (key: string, original: PlatformSettingValue): string | null => {
    const value = valueFor(key);
    if (typeof original === "number") {
      const parsed = Number(value);
      if (value === "" || !Number.isFinite(parsed) || parsed < 0 || !Number.isInteger(parsed)) {
        return "Enter a whole number of 0 or more.";
      }
    }
    if (typeof original === "string" && isEmailKey(key) && typeof value === "string" && value.trim() !== "" && !EMAIL_PATTERN.test(value.trim())) {
      return "Enter a valid email address.";
    }
    return null;
  };

  const changes = useMemo((): PlatformSettings => {
    if (!server) return {};
    const result: PlatformSettings = {};
    for (const [key, value] of Object.entries(edits)) {
      const original = server[key];
      if (original === undefined) continue;
      if (typeof original === "number") {
        // Invalid input is reported by validationError() and blocks saving; it is never sent.
        const parsed = typeof value === "string" && value.trim() !== "" ? Number(value) : Number.NaN;
        if (Number.isFinite(parsed) && parsed !== original) result[key] = parsed;
      } else if (typeof original === "boolean") {
        if (value !== original) result[key] = Boolean(value);
      } else if (typeof value === "string" && value.trim() !== original) {
        result[key] = value.trim();
      }
    }
    return result;
  }, [edits, server]);

  const grouped = useMemo(() => {
    if (!server) return [];
    const groups = new Map<Group, string[]>();
    for (const key of Object.keys(server)) {
      const group = SETTING_META[key]?.group ?? "Other";
      groups.set(group, [...(groups.get(group) ?? []), key]);
    }
    return GROUP_ORDER.filter((group) => groups.has(group)).map((group) => ({ group, keys: groups.get(group) ?? [] }));
  }, [server]);

  if (settings.isError && isAuthorizationError(settings.error)) {
    return <AccessDeniedState error={settings.error} />;
  }

  const changedKeys = Object.keys(changes);
  const hasErrors = server ? Object.keys(server).some((key) => validationError(key, server[key]) !== null) : false;

  const handleSave = async (event: FormEvent) => {
    event.preventDefault();
    if (changedKeys.length === 0 || hasErrors) return;
    try {
      await updateSettings.mutateAsync(changes);
      setEdits({});
      toast.success(`Saved ${changedKeys.length} platform setting${changedKeys.length === 1 ? "" : "s"}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update platform settings.");
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">

      {/* Configuration values */}
      {settings.isPending ? (
        <Panel>
          <div className="space-y-3">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </Panel>
      ) : settings.isError ? (
        <ErrorState
          title="Unable to load platform settings. Please try again."
          error={settings.error}
          onRetry={() => void settings.refetch()}
          retrying={settings.isFetching}
        />
      ) : Object.keys(settings.data).length === 0 ? (
        <EmptyState icon={Sliders} title="No data available" description="The settings endpoint returned no configuration values." />
      ) : (
        <form onSubmit={(event) => void handleSave(event)} className="space-y-6">

          {grouped.map(({ group, keys }) => {
            const booleanKeys = keys.filter((key) => typeof settings.data[key] === "boolean");
            const fieldKeys = keys.filter((key) => typeof settings.data[key] !== "boolean");
            return (
              <Panel key={group} className="space-y-4">
                <h3 className="font-bold text-base text-foreground">{group}</h3>

                {fieldKeys.length > 0 && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {fieldKeys.map((key) => {
                      const original = settings.data[key];
                      const meta = SETTING_META[key];
                      const error = validationError(key, original);
                      const value = valueFor(key);
                      return (
                        <div key={key} className="space-y-1.5">
                          <Label htmlFor={`setting-${key}`} className="text-xs">
                            {meta?.label ?? humanize(key)}
                          </Label>
                          <Input
                            id={`setting-${key}`}
                            type={typeof original === "number" ? "number" : isEmailKey(key) ? "email" : "text"}
                            min={typeof original === "number" ? 0 : undefined}
                            step={typeof original === "number" ? 1 : undefined}
                            value={typeof value === "string" ? value : String(value)}
                            onChange={(event) => setEdits((current) => ({ ...current, [key]: event.target.value }))}
                            aria-invalid={error !== null}
                            className="h-9 text-xs"
                          />
                          {error ? (
                            <p className="text-[11px] text-rose-400">{error}</p>
                          ) : (
                            meta && <p className="text-[11px] text-muted-foreground">{meta.description}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {booleanKeys.length > 0 && (
                  <div className="space-y-4 divide-y divide-border/40">
                    {booleanKeys.map((key, index) => {
                      const meta = SETTING_META[key];
                      return (
                        <div key={key} className={index === 0 ? "flex items-center justify-between gap-4" : "flex items-center justify-between gap-4 pt-4"}>
                          <div className="space-y-0.5">
                            <div className="font-semibold text-sm text-foreground">{meta?.label ?? humanize(key)}</div>
                            {meta && <div className="text-xs text-muted-foreground">{meta.description}</div>}
                          </div>
                          <Switch
                            checked={valueFor(key) === true}
                            onCheckedChange={(checked) => setEdits((current) => ({ ...current, [key]: checked }))}
                            aria-label={meta?.label ?? humanize(key)}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}
              </Panel>
            );
          })}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:items-center sm:justify-end">
            <span className="text-xs text-muted-foreground sm:mr-auto">
              {changedKeys.length === 0 ? "No unsaved changes" : `${changedKeys.length} unsaved change${changedKeys.length === 1 ? "" : "s"}`}
            </span>
            <Button
              type="button"
              variant="outline"
              disabled={Object.keys(edits).length === 0 || updateSettings.isPending}
              onClick={() => setEdits({})}
              className="gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Discard
            </Button>
            <Button
              type="submit"
              disabled={changedKeys.length === 0 || hasErrors || updateSettings.isPending}
              className="gap-2 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Save className="h-4 w-4" />
              {updateSettings.isPending ? "Saving Changes…" : "Save Platform Settings"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}

export default SuperAdminSettingsPage;
