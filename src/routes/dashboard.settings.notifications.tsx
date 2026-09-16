import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Bell, Mail, MessageSquare, RefreshCw, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectNotificationSettings,
  selectSettingsErrors,
  selectSettingsLoading,
  selectSettingsOperationLoading,
  selectSettingsSubmitting,
} from "@/store/settings/settingsSelectors";
import {
  fetchNotificationSettings,
  testEmailConfiguration,
  testSmsConfiguration,
  updateNotificationSettings,
} from "@/store/settings/settingsThunk";

export const Route = createFileRoute("/dashboard/settings/notifications")({
  head: () => ({ meta: [{ title: "Notification Settings — OFC360" }] }),
  component: NotificationSettingsPage,
});

function NotificationSettingsPage() {
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectNotificationSettings);
  const loading = useAppSelector(selectSettingsLoading);
  const submitting = useAppSelector(selectSettingsSubmitting);
  const errors = useAppSelector(selectSettingsErrors);
  const opLoading = useAppSelector(selectSettingsOperationLoading);

  const [form, setForm] = useState({
    emailNotifications: true,
    inAppAlerts: true,
    slackAlerts: false,
    weeklyDigest: true,
  });

  const [testEmail, setTestEmail] = useState("");
  const [testPhone, setTestPhone] = useState("");

  useEffect(() => {
    dispatch(fetchNotificationSettings());
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
      await dispatch(updateNotificationSettings(form)).unwrap();
      toast.success("Notification preferences saved successfully!");
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to save notification preferences");
    }
  };

  const handleSendTestEmail = async () => {
    try {
      const res = await dispatch(
        testEmailConfiguration(testEmail ? { email: testEmail } : undefined),
      ).unwrap();
      toast.success(res.message || "Test email dispatched successfully!");
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to send test email");
    }
  };

  const handleSendTestSms = async () => {
    try {
      const res = await dispatch(
        testSmsConfiguration(testPhone ? { phone: testPhone } : undefined),
      ).unwrap();
      toast.success(res.message || "Test SMS dispatched successfully!");
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to send test SMS");
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
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              Notification & Digest Preferences
            </h2>
            <p className="text-xs text-muted-foreground">
              Manage how and when you receive automated alerts, email updates, and AI digests.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {errors.notifications && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => dispatch(fetchNotificationSettings())}
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry
              </Button>
            )}
            <Bell className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4 divide-y divide-border/60">
            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="text-sm font-medium">Email Notifications</div>
                <div className="text-xs text-muted-foreground">
                  Receive critical workforce alerts and approval requests via email.
                </div>
              </div>
              <Switch
                checked={form.emailNotifications}
                onCheckedChange={(val) => setForm({ ...form, emailNotifications: val })}
                disabled={submitting}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <div className="text-sm font-medium">In-App Notification Center</div>
                <div className="text-xs text-muted-foreground">
                  Show real-time toast alerts and badges inside the OFC360 dashboard header.
                </div>
              </div>
              <Switch
                checked={form.inAppAlerts}
                onCheckedChange={(val) => setForm({ ...form, inAppAlerts: val })}
                disabled={submitting}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <div className="text-sm font-medium">Slack Channel Broadcasts</div>
                <div className="text-xs text-muted-foreground">
                  Send high-priority alerts and hiring updates directly to your connected Slack
                  channel.
                </div>
              </div>
              <Switch
                checked={form.slackAlerts}
                onCheckedChange={(val) => setForm({ ...form, slackAlerts: val })}
                disabled={submitting}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <div>
                <div className="text-sm font-medium">Weekly Executive Digest</div>
                <div className="text-xs text-muted-foreground">
                  Receive a weekly AI summary report on workforce metrics, attrition, and payroll.
                </div>
              </div>
              <Switch
                checked={form.weeklyDigest}
                onCheckedChange={(val) => setForm({ ...form, weeklyDigest: val })}
                disabled={submitting}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Notification Settings
            </Button>
          </div>
        </form>
      </div>

      {/* Gateway Testing Suite */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-semibold">Test Email Gateway</h3>
              <p className="text-xs text-muted-foreground">
                Dispatch test verification to ensure SMTP delivery.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Test Recipient Email</Label>
            <Input
              type="email"
              placeholder="user@ofc360.ai"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              disabled={opLoading.testEmail}
            />
          </div>

          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={handleSendTestEmail}
            disabled={opLoading.testEmail}
          >
            {opLoading.testEmail ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Send Test Email
          </Button>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-semibold">Test SMS Gateway</h3>
              <p className="text-xs text-muted-foreground">
                Verify SMS gateway credentials and gateway routing.
              </p>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Test Recipient Phone</Label>
            <Input
              type="tel"
              placeholder="+91 98765 01234"
              value={testPhone}
              onChange={(e) => setTestPhone(e.target.value)}
              disabled={opLoading.testSms}
            />
          </div>

          <Button
            size="sm"
            variant="outline"
            className="w-full"
            onClick={handleSendTestSms}
            disabled={opLoading.testSms}
          >
            {opLoading.testSms ? (
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Send className="mr-2 h-4 w-4" />
            )}
            Send Test SMS
          </Button>
        </div>
      </div>
    </div>
  );
}
