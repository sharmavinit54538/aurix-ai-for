import React, { useEffect, useState } from "react";
import { Sliders, ShieldCheck, Lock, Save, AlertCircle, RefreshCw, KeyRound, Server } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { superAdminApi } from "../superAdminApi";
import { getSingleSuperAdmin } from "@/lib/platform-owner";
import { toast } from "sonner";
import type { PlatformSettings } from "../types";

export function SuperAdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const owner = getSingleSuperAdmin();

  useEffect(() => {
    void superAdminApi.getSettings().then((s) => {
      setSettings(s);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      const updated = await superAdminApi.updateSettings(settings);
      setSettings(updated);
      toast.success("Platform settings successfully saved.");
    } catch {
      toast.error("Failed to update platform settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-purple-400" />
        Loading platform settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            System &amp; Platform Settings
          </h1>
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">
            Global Config
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          System-level settings, security policies, and single platform owner credentials.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Platform Owner Identity (Requirement 1 & 5: Single Instance restriction) */}
        <div className="rounded-2xl border border-purple-500/30 bg-purple-950/10 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-foreground">
                  Platform Owner (Single Instance)
                </h3>
                <p className="text-xs text-muted-foreground">
                  OFC360 enforces a single platform owner account constraint.
                </p>
              </div>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
              Verified 1 of 1
            </Badge>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-purple-500/20">
            <div>
              <Label className="text-xs text-muted-foreground">Owner Email</Label>
              <Input
                value={owner.email}
                disabled
                className="mt-1 h-9 bg-muted/60 font-mono text-xs text-foreground cursor-not-allowed"
              />
              <p className="text-[11px] text-muted-foreground mt-1">
                Configured via INITIAL_SUPER_ADMIN_EMAIL. Secondary creation is disabled.
              </p>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Owner Name</Label>
              <Input
                value={owner.name}
                disabled
                className="mt-1 h-9 bg-muted/60 text-xs text-foreground cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Platform Configuration Card */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-xl space-y-4">
          <h3 className="font-bold text-base text-foreground">General Platform Configuration</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="platformName" className="text-xs">Platform Display Name</Label>
              <Input
                id="platformName"
                value={settings.platformName}
                onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="supportEmail" className="text-xs">Platform Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="sessionTimeout" className="text-xs">Session Timeout (Minutes)</Label>
              <Input
                id="sessionTimeout"
                type="number"
                value={settings.sessionTimeoutMinutes}
                onChange={(e) => setSettings({ ...settings, sessionTimeoutMinutes: Number(e.target.value) })}
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="maxOrgs" className="text-xs">Max Organizations Allowed</Label>
              <Input
                id="maxOrgs"
                type="number"
                value={settings.maxOrganizations}
                onChange={(e) => setSettings({ ...settings, maxOrganizations: Number(e.target.value) })}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Security & Access Policies */}
        <div className="rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-xl space-y-4">
          <h3 className="font-bold text-base text-foreground">Security &amp; Operational Switches</h3>

          <div className="space-y-4 divide-y divide-border/40">
            <div className="flex items-center justify-between pt-2">
              <div className="space-y-0.5">
                <div className="font-semibold text-sm text-foreground">Maintenance Mode</div>
                <div className="text-xs text-muted-foreground">
                  When enabled, non-super-admin users will see a scheduled maintenance notice.
                </div>
              </div>
              <Switch
                checked={settings.maintenanceMode}
                onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div className="space-y-0.5">
                <div className="font-semibold text-sm text-foreground">Enforce MFA for Administrators</div>
                <div className="text-xs text-muted-foreground">
                  Require multi-factor authentication for HR_ADMIN and IT_ADMIN accounts.
                </div>
              </div>
              <Switch
                checked={settings.requireMfaForAdmins}
                onCheckedChange={(checked) => setSettings({ ...settings, requireMfaForAdmins: checked })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="submit" disabled={saving} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white">
            <Save className="h-4 w-4" />
            {saving ? "Saving Changes..." : "Save Platform Settings"}
          </Button>
        </div>
      </form>
    </div>
  );
}
