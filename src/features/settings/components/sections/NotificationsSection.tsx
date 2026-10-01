import React, { useEffect, useState } from "react";
import {
  Bell,
  Mail,
  Clock,
  CalendarDays,
  Banknote,
  FileCheck,
  Send,
  Check,
  AlertCircle,
  Save,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  fetchNotificationSettings,
  updateNotificationSettings,
  sendTestNotificationEmail,
} from "../../api";
import type { NotificationSettingsForm } from "../../types";
import { UnsavedChangesBanner } from "../UnsavedChangesBanner";

interface NotificationsSectionProps {
  canEdit: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

export function NotificationsSection({ canEdit, onDirtyChange }: NotificationsSectionProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [testEmail, setTestEmail] = useState("");

  const [initialData, setInitialData] = useState<NotificationSettingsForm | null>(null);
  const [formData, setFormData] = useState<NotificationSettingsForm>({
    emailNotifications: true,
    inAppAlerts: true,
    slackAlerts: false,
    weeklyDigest: false,
    securityAlerts: true,
  });

  const isDirty = initialData ? JSON.stringify(initialData) !== JSON.stringify(formData) : false;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchNotificationSettings();
      setInitialData(data);
      setFormData(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to load notification settings.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canEdit) return;

    setSubmitting(true);
    try {
      await updateNotificationSettings(formData);
      setInitialData(formData);
      toast.success("Notification preferences updated successfully!");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update notification settings.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
      toast.error("Please enter a valid email address for testing.");
      return;
    }

    setSendingTest(true);
    try {
      const res = await sendTestNotificationEmail(testEmail);
      toast.success(res.message || `Test email dispatched to ${testEmail}!`);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to send test email. Verify SMTP/email configuration.";
      toast.error(message);
    } finally {
      setSendingTest(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56 rounded-lg" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Email Master Toggle */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Global Email Delivery
            </h3>
            <p className="text-xs text-muted-foreground">
              Master switch for organizational outgoing transactional emails.
            </p>
          </div>
          <Mail className="h-4 w-4 text-primary shrink-0" />
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4">
          <div className="space-y-0.5">
            <Label className="text-xs font-semibold text-foreground">
              Enable Email Notifications
            </Label>
            <p className="text-[11px] text-muted-foreground">
              Delivers automated transactional alerts to company employees and management.
            </p>
          </div>
          <Switch
            checked={formData.emailNotifications}
            onCheckedChange={(checked) => setFormData({ ...formData, emailNotifications: checked })}
            disabled={!canEdit}
          />
        </div>
      </div>

      {/* Organization Channels & Delivery Settings */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 border-b border-border/60 pb-4">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">Notification Channels & Delivery</h3>
          <p className="text-xs text-muted-foreground">
            Configure system-wide alert destinations and cadence.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* In-App Alerts */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card/80 p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-500/10 text-blue-500">
                <Bell className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <Label className="text-xs font-medium text-foreground">In-App Alerts</Label>
                <p className="text-[11px] text-muted-foreground">
                  Real-time notification bell alerts and unread counters in the dashboard.
                </p>
              </div>
            </div>
            <Switch
              checked={formData.inAppAlerts}
              onCheckedChange={(c) => setFormData({ ...formData, inAppAlerts: c })}
              disabled={!canEdit}
            />
          </div>

          {/* Slack Alerts */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card/80 p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-purple-500/10 text-purple-500">
                <AlertCircle className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <Label className="text-xs font-medium text-foreground">Slack Alerts</Label>
                <p className="text-[11px] text-muted-foreground">
                  Forward key organizational events and system notices to Slack channels.
                </p>
              </div>
            </div>
            <Switch
              checked={formData.slackAlerts}
              onCheckedChange={(c) => setFormData({ ...formData, slackAlerts: c })}
              disabled={!canEdit}
            />
          </div>

          {/* Weekly Digest */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card/80 p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <CalendarDays className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <Label className="text-xs font-medium text-foreground">Weekly Digest</Label>
                <p className="text-[11px] text-muted-foreground">
                  Send a weekly activity summary and pending review digest to users.
                </p>
              </div>
            </div>
            <Switch
              checked={formData.weeklyDigest}
              onCheckedChange={(c) => setFormData({ ...formData, weeklyDigest: c })}
              disabled={!canEdit}
            />
          </div>

          {/* Security Alerts */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-card/80 p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-rose-500/10 text-rose-500">
                <Check className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <Label className="text-xs font-medium text-foreground">
                  Security Alerts
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Immediate alerts for logins, permission escalations, and MFA changes.
                </p>
              </div>
            </div>
            <Switch
              checked={formData.securityAlerts}
              onCheckedChange={(c) => setFormData({ ...formData, securityAlerts: c })}
              disabled={!canEdit}
            />
          </div>
        </div>
      </div>

      {/* Test Email Dispatch Card */}
      {canEdit && (
        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
          <div className="mb-4 border-b border-border/60 pb-3">
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Test Email Delivery
            </h3>
            <p className="text-xs text-muted-foreground">
              Verify SMTP configuration by sending a test alert message.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                type="email"
                placeholder="test.recipient@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                className="text-xs"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleSendTestEmail}
              disabled={sendingTest || !testEmail}
              className="gap-1.5 text-xs cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              {sendingTest ? "Dispatching..." : "Send Test Email"}
            </Button>
          </div>
        </div>
      )}

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
            {submitting ? "Saving..." : "Save Notification Preferences"}
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
