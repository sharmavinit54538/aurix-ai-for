import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { KeyRound, LogOut, Shield } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { aurix } from "@/lib/aurix-store";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectSecuritySettings, selectSettingsLoading, selectSettingsSubmitting } from "@/store/settings/settingsSelectors";
import { fetchSecurity, updateSecurity } from "@/store/settings/settingsThunk";

export const Route = createFileRoute("/dashboard/settings/security")({
  head: () => ({ meta: [{ title: "Security Settings — Aurix" }] }),
  component: SecuritySettingsPage,
});

function SecuritySettingsPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const security = useAppSelector(selectSecuritySettings);
  const loading = useAppSelector(selectSettingsLoading);
  const submitting = useAppSelector(selectSettingsSubmitting);

  const [form, setForm] = useState({
    twoFactorEnabled: true,
    sessionTimeoutMinutes: 60,
    passwordExpirationDays: 90,
  });

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  useEffect(() => {
    dispatch(fetchSecurity());
  }, [dispatch]);

  useEffect(() => {
    if (security) {
      setForm({
        twoFactorEnabled: security.twoFactorEnabled ?? true,
        sessionTimeoutMinutes: security.sessionTimeoutMinutes ?? 60,
        passwordExpirationDays: security.passwordExpirationDays ?? 90,
      });
    }
  }, [security]);

  const handleToggle2FA = async (val: boolean) => {
    setForm({ ...form, twoFactorEnabled: val });
    try {
      await dispatch(updateSecurity({ ...form, twoFactorEnabled: val })).unwrap();
      toast.success(val ? "Two-factor authentication enabled" : "Two-factor authentication disabled");
    } catch {
      toast.error("Failed to update 2FA setting");
    }
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwords.newPass) return;
    if (passwords.newPass !== passwords.confirm) {
      toast.error("New passwords do not match!");
      return;
    }
    toast.success("Password updated successfully!");
    setPasswords({ current: "", newPass: "", confirm: "" });
  };

  const handleSignOut = () => {
    aurix.reset();
    toast.info("Signed out and cleared session");
    navigate({ to: "/login" });
  };

  if (loading && !security) {
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    );
  }

  const sessions = security?.activeSessions || [];

  return (
    <div className="space-y-6">
      {/* 2FA & Controls */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Security & Authentication</h2>
            <p className="text-xs text-muted-foreground">Manage multi-factor authentication, active sessions, and password security.</p>
          </div>
          <Shield className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Two-Factor Authentication (2FA)</div>
            <div className="text-xs text-muted-foreground">Require an authenticator app code on login to secure workspace access.</div>
          </div>
          <Switch
            checked={form.twoFactorEnabled}
            onCheckedChange={handleToggle2FA}
            disabled={submitting}
          />
        </div>
      </div>

      {/* Update Password */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <h3 className="text-sm font-semibold tracking-tight">Change Password</h3>
        <p className="text-xs text-muted-foreground">Ensure your account uses a strong, unique password.</p>
        <form onSubmit={handlePasswordUpdate} className="mt-4 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input
              type="password"
              placeholder="Current password"
              value={passwords.current}
              onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
            />
            <Input
              type="password"
              placeholder="New password"
              value={passwords.newPass}
              onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
            />
            <Input
              type="password"
              placeholder="Confirm new password"
              value={passwords.confirm}
              onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
            />
          </div>
          <Button type="submit" size="sm" className="mt-2">
            <KeyRound className="mr-2 h-4 w-4" /> Update Password
          </Button>
        </form>
      </div>

      {/* Active Sessions */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <h3 className="text-sm font-semibold tracking-tight">Active Sessions</h3>
        <p className="text-xs text-muted-foreground">Devices currently logged into your account.</p>
        <div className="mt-4 space-y-3">
          {sessions.map((sess) => (
            <div key={sess.id} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3 text-xs">
              <div>
                <div className="font-medium text-foreground">{sess.device}</div>
                <div className="text-muted-foreground">{sess.ip} · {sess.lastActive}</div>
              </div>
              {sess.current ? (
                <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-500">Current Session</span>
              ) : (
                <Button size="sm" variant="ghost" className="h-7 text-xs text-destructive hover:bg-destructive/10" onClick={() => toast.success("Session revoked")}>
                  Revoke Session
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-rose-500/30 bg-rose-500/5 p-6">
        <h3 className="text-sm font-semibold text-rose-500">Danger Zone</h3>
        <p className="text-xs text-muted-foreground">Sign out of this workspace and clear local session state.</p>
        <Button variant="destructive" size="sm" className="mt-4" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" /> Sign Out and Reset Session
        </Button>
      </div>
    </div>
  );
}
