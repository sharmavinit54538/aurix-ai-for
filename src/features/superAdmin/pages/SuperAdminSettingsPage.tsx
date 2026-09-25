import React, { useEffect, useState } from "react";
import { Sliders, Lock, Save, AlertCircle, RefreshCw, KeyRound, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { superAdminApi } from "../superAdminApi";
import { toast } from "sonner";
import type { PlatformSettings } from "../types";

export function SuperAdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
      <form onSubmit={handleSave} className="space-y-6">

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
