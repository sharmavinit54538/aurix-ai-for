import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, RefreshCw, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectNotificationSettings, selectSettingsLoading, selectSettingsSubmitting } from "@/store/settings/settingsSelectors";
import { fetchNotifications, updateNotifications } from "@/store/settings/settingsThunk";

export const Route = createFileRoute("/dashboard/settings/notifications")({
  head: () => ({ meta: [{ title: "Notification Settings — Aurix" }] }),
  component: NotificationSettingsPage,
});

function NotificationSettingsPage() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectNotificationSettings);
  const loading = useAppSelector(selectSettingsLoading);
  const submitting = useAppSelector(selectSettingsSubmitting);

  const [form, setForm] = useState({
    emailNotifications: true,
    inAppAlerts: true,
    slackAlerts: false,
    weeklyDigest: true,
  });

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (settings) {
      setForm({
        emailNotifications: settings.emailNotifications ?? true,
        inAppAlerts: settings.inAppAlerts ?? true,
        slackAlerts: settings.slackAlerts ?? false,
        weeklyDigest: settings.weeklyDigest ?? true,
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateNotifications(form)).unwrap();
      toast.success("Notification preferences saved successfully!");
    } catch {
      toast.error("Failed to save notification preferences");
    }
  };

  if (loading && !settings) {
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Notification & Digest Preferences</h2>
          <p className="text-xs text-muted-foreground">Manage how and when you receive automated alerts, email updates, and AI digests.</p>
        </div>
        <Bell className="h-5 w-5 text-muted-foreground" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4 divide-y divide-border/60">
          <div className="flex items-center justify-between pt-2">
            <div>
              <div className="text-sm font-medium">Email Notifications</div>
              <div className="text-xs text-muted-foreground">Receive critical workforce alerts and approval requests via email.</div>
            </div>
            <Switch
              checked={form.emailNotifications}
              onCheckedChange={(val) => setForm({ ...form, emailNotifications: val })}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="text-sm font-medium">In-App Notification Center</div>
              <div className="text-xs text-muted-foreground">Show real-time toast alerts and badges inside the Aurix dashboard header.</div>
            </div>
            <Switch
              checked={form.inAppAlerts}
              onCheckedChange={(val) => setForm({ ...form, inAppAlerts: val })}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="text-sm font-medium">Slack Channel Broadcasts</div>
              <div className="text-xs text-muted-foreground">Send high-priority alerts and hiring updates directly to your connected Slack channel.</div>
            </div>
            <Switch
              checked={form.slackAlerts}
              onCheckedChange={(val) => setForm({ ...form, slackAlerts: val })}
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <div>
              <div className="text-sm font-medium">Weekly Executive Digest</div>
              <div className="text-xs text-muted-foreground">Receive a weekly AI summary report on workforce metrics, attrition, and payroll.</div>
            </div>
            <Switch
              checked={form.weeklyDigest}
              onCheckedChange={(val) => setForm({ ...form, weeklyDigest: val })}
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Notification Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
