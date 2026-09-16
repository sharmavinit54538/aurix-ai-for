import { createFileRoute, Link } from "@tanstack/react-router";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Bell,
  Building2,
  CheckCircle2,
  CreditCard,
  Download,
  Layers,
  Lock,
  Mail,
  MessageSquare,
  Palette,
  RefreshCw,
  Save,
  ScrollText,
  Search,
  Send,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectAuditLogs,
  selectBillingSettings,
  selectBrandingSettings,
  selectIntegrationSettings,
  selectNotificationSettings,
  selectSecuritySettings,
  selectSettingsErrors,
  selectSettingsLoading,
  selectSettingsOperationLoading,
  selectSettingsSubmitting,
  selectSubscriptionPlans,
} from "@/store/settings/settingsSelectors";
import {
  cancelSubscription,
  exportAuditLogs,
  fetchAuditLogs,
  fetchBillingSettings,
  fetchBrandingSettings,
  fetchIntegrationSettings,
  fetchNotificationSettings,
  fetchSecuritySettings,
  fetchSubscriptionPlans,
  testEmailConfiguration,
  testSmsConfiguration,
  updateBillingSettings,
  updateBrandingSettings,
  updateIntegrationSettings,
  updateNotificationSettings,
  updateSecuritySettings,
  upgradeSubscription,
} from "@/store/settings/settingsThunk";
import type { IntegrationItem, SubscriptionPlan } from "@/store/settings/settingsTypes";

export const Route = createFileRoute("/dashboard/settings/")({
  head: () => ({ meta: [{ title: "Settings Hub — OFC360" }] }),
  component: SettingsHubPage,
});

function SettingsHubPage() {
  const dispatch = useAppDispatch();

  // Redux Selectors
  const security = useAppSelector(selectSecuritySettings);
  const notifications = useAppSelector(selectNotificationSettings);
  const branding = useAppSelector(selectBrandingSettings);
  const integrations = useAppSelector(selectIntegrationSettings);
  const billing = useAppSelector(selectBillingSettings);
  const subscriptionPlans = useAppSelector(selectSubscriptionPlans);
  const auditData = useAppSelector(selectAuditLogs);

  const globalLoading = useAppSelector(selectSettingsLoading);
  const submitting = useAppSelector(selectSettingsSubmitting);
  const errors = useAppSelector(selectSettingsErrors);
  const opLoading = useAppSelector(selectSettingsOperationLoading);

  // Active Tab state
  const [activeTab, setActiveTab] = useState("overview");

  // Local Form States
  const [securityForm, setSecurityForm] = useState({
    twoFactorEnabled: false,
    sessionTimeoutMinutes: 60,
    passwordExpirationDays: 90,
  });

  const [notificationForm, setNotificationForm] = useState({
    emailNotifications: true,
    inAppAlerts: true,
    slackAlerts: false,
    weeklyDigest: true,
  });

  const [brandingForm, setBrandingForm] = useState({
    companyName: "",
    portalTitle: "",
    primaryColor: "#4f46e5",
    accentColor: "#06b6d4",
    logoUrl: "",
    customCss: "",
  });

  const [emailTestTarget, setEmailTestTarget] = useState("");
  const [smsTestTarget, setSmsTestTarget] = useState("");

  // Audit Log Filters
  const [auditPage, setAuditPage] = useState(1);
  const [auditSearch, setAuditSearch] = useState("");
  const [auditModule, setAuditModule] = useState("all");

  // Fetch all required settings on page load
  useEffect(() => {
    dispatch(fetchSecuritySettings());
    dispatch(fetchNotificationSettings());
    dispatch(fetchBrandingSettings());
    dispatch(fetchIntegrationSettings());
    dispatch(fetchBillingSettings());
    dispatch(fetchSubscriptionPlans());
    dispatch(fetchAuditLogs({ page: 1, limit: 10 }));
  }, [dispatch]);

  // Sync security
  useEffect(() => {
    if (security) {
      setSecurityForm({
        twoFactorEnabled: Boolean(security.twoFactorEnabled),
        sessionTimeoutMinutes: security.sessionTimeoutMinutes ?? 60,
        passwordExpirationDays: security.passwordExpirationDays ?? 90,
      });
    }
  }, [security]);

  // Sync notifications
  useEffect(() => {
    if (notifications) {
      setNotificationForm({
        emailNotifications: Boolean(notifications.emailNotifications),
        inAppAlerts: Boolean(notifications.inAppAlerts),
        slackAlerts: Boolean(notifications.slackAlerts),
        weeklyDigest: Boolean(notifications.weeklyDigest),
      });
    }
  }, [notifications]);

  // Sync branding
  useEffect(() => {
    if (branding) {
      setBrandingForm({
        companyName: branding.companyName || "",
        portalTitle: branding.portalTitle || "",
        primaryColor: branding.primaryColor || "#4f46e5",
        accentColor: branding.accentColor || "#06b6d4",
        logoUrl: branding.logoUrl || "",
        customCss: branding.customCss || "",
      });
    }
  }, [branding]);

  // Audit logs query effect
  useEffect(() => {
    dispatch(fetchAuditLogs({ page: auditPage, limit: 10, search: auditSearch, module: auditModule }));
  }, [dispatch, auditPage, auditSearch, auditModule]);

  // ── Save Handlers ────────────────────────────────────────────
  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateSecuritySettings(securityForm)).unwrap();
      toast.success("Security settings updated successfully!");
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Failed to update security settings");
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateNotificationSettings(notificationForm)).unwrap();
      toast.success("Notification preferences saved successfully!");
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Failed to update notification settings");
    }
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateBrandingSettings(brandingForm)).unwrap();
      toast.success("Branding settings saved successfully!");
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Failed to update branding");
    }
  };

  const handleToggleIntegration = async (item: IntegrationItem) => {
    try {
      await dispatch(
        updateIntegrationSettings({
          id: item.id,
          connected: !item.connected,
        }),
      ).unwrap();
      toast.success(`${item.name} ${!item.connected ? "connected" : "disconnected"} successfully!`);
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : `Failed to update ${item.name}`);
    }
  };

  // ── Email & SMS Tests ────────────────────────────────────────
  const handleTestEmail = async () => {
    try {
      const res = await dispatch(
        testEmailConfiguration(emailTestTarget ? { email: emailTestTarget } : undefined),
      ).unwrap();
      toast.success(res.message || "Test email sent successfully!");
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Failed to send test email");
    }
  };

  const handleTestSms = async () => {
    try {
      const res = await dispatch(
        testSmsConfiguration(smsTestTarget ? { phone: smsTestTarget } : undefined),
      ).unwrap();
      toast.success(res.message || "Test SMS sent successfully!");
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Failed to send test SMS");
    }
  };

  // ── Subscription Actions ─────────────────────────────────────
  const handleUpgradePlan = async (plan: SubscriptionPlan) => {
    try {
      await dispatch(upgradeSubscription({ planId: plan.id })).unwrap();
      toast.success(`Upgraded to ${plan.name} plan successfully!`);
      dispatch(fetchBillingSettings());
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Failed to upgrade subscription");
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm("Are you sure you want to cancel your current subscription?")) return;
    try {
      await dispatch(cancelSubscription({ reason: "User initiated cancellation" })).unwrap();
      toast.info("Subscription cancelled successfully.");
      dispatch(fetchBillingSettings());
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Failed to cancel subscription");
    }
  };

  // ── Export Audit Logs ────────────────────────────────────────
  const handleExportAuditLogs = async () => {
    try {
      await dispatch(
        exportAuditLogs({
          search: auditSearch,
          module: auditModule,
          format: "csv",
        }),
      ).unwrap();
      toast.success("Audit logs CSV downloaded successfully!");
    } catch (err: any) {
      toast.error(typeof err === "string" ? err : "Failed to export audit logs");
    }
  };

  const auditLogsList = auditData?.items || [];
  const auditTotal = auditData?.total || 0;
  const auditPages = auditData?.pages || 1;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              OFC360 Settings Hub
            </h1>
            <Badge variant="outline" className="text-xs">
              Live APIs Connected
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Configure enterprise security policies, automated notifications, workspace branding, toolchain integrations, billing tiers, and audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              dispatch(fetchSecuritySettings());
              dispatch(fetchNotificationSettings());
              dispatch(fetchBrandingSettings());
              dispatch(fetchIntegrationSettings());
              dispatch(fetchBillingSettings());
              dispatch(fetchSubscriptionPlans());
              dispatch(fetchAuditLogs({ page: auditPage, limit: 10 }));
              toast.info("Refreshed all settings from server");
            }}
            disabled={globalLoading}
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${globalLoading ? "animate-spin" : ""}`} />
            Refresh Hub
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="h-auto flex-wrap gap-1 bg-muted/60 p-1.5 rounded-xl border border-border/60">
          <TabsTrigger value="overview" className="text-xs py-2 px-3.5">
            <Sliders className="mr-1.5 h-3.5 w-3.5" /> Overview
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs py-2 px-3.5">
            <Shield className="mr-1.5 h-3.5 w-3.5" /> Security & 2FA
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs py-2 px-3.5">
            <Bell className="mr-1.5 h-3.5 w-3.5" /> Notifications & Tests
          </TabsTrigger>
          <TabsTrigger value="branding" className="text-xs py-2 px-3.5">
            <Palette className="mr-1.5 h-3.5 w-3.5" /> Branding
          </TabsTrigger>
          <TabsTrigger value="integrations" className="text-xs py-2 px-3.5">
            <Layers className="mr-1.5 h-3.5 w-3.5" /> Integrations
          </TabsTrigger>
          <TabsTrigger value="billing" className="text-xs py-2 px-3.5">
            <CreditCard className="mr-1.5 h-3.5 w-3.5" /> Billing & Plans
          </TabsTrigger>
          <TabsTrigger value="audit" className="text-xs py-2 px-3.5">
            <ScrollText className="mr-1.5 h-3.5 w-3.5" /> Audit Trail
          </TabsTrigger>
        </TabsList>

        {/* ── TAB 1: OVERVIEW ────────────────────────────────────────── */}
        <TabsContent value="overview" className="space-y-6 m-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              onClick={() => setActiveTab("security")}
              className="cursor-pointer group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
            >
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mb-3 group-hover:scale-105 transition-transform">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-bold tracking-tight text-foreground flex items-center justify-between">
                  <span>Security & MFA Rules</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Two-factor authentication, session timeouts, and enterprise password rules.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Status:</span>
                <Badge variant={security?.twoFactorEnabled ? "default" : "secondary"} className="text-[10px]">
                  {security?.twoFactorEnabled ? "2FA Enabled" : "2FA Optional"}
                </Badge>
              </div>
            </div>

            <div
              onClick={() => setActiveTab("notifications")}
              className="cursor-pointer group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
            >
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 mb-3 group-hover:scale-105 transition-transform">
                  <Bell className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-bold tracking-tight text-foreground flex items-center justify-between">
                  <span>Notifications & Email/SMS</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Email digest, Slack webhook triggers, live dispatch tests for Email & SMS.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Channels:</span>
                <Badge variant="outline" className="text-[10px]">
                  Email, Slack, SMS
                </Badge>
              </div>
            </div>

            <div
              onClick={() => setActiveTab("branding")}
              className="cursor-pointer group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
            >
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-3 group-hover:scale-105 transition-transform">
                  <Palette className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-bold tracking-tight text-foreground flex items-center justify-between">
                  <span>Branding & Themes</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Customize organization logos, brand colors, portal titles, and styling.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Company:</span>
                <span className="font-medium text-foreground">{branding?.companyName || "Default Brand"}</span>
              </div>
            </div>

            <div
              onClick={() => setActiveTab("integrations")}
              className="cursor-pointer group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
            >
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400 mb-3 group-hover:scale-105 transition-transform">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-bold tracking-tight text-foreground flex items-center justify-between">
                  <span>Integrations Hub</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Sync with Slack, Google Workspace, webhooks, and communication providers.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Connected Services:</span>
                <Badge variant="secondary" className="text-[10px]">
                  {integrations.filter((i) => i.connected).length} of {integrations.length}
                </Badge>
              </div>
            </div>

            <div
              onClick={() => setActiveTab("billing")}
              className="cursor-pointer group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
            >
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-bold tracking-tight text-foreground flex items-center justify-between">
                  <span>Billing & Subscription Plans</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Manage enterprise tiers, seat allocations, plan upgrades, and invoice records.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Plan:</span>
                <span className="font-semibold text-emerald-400">{billing?.currentPlan || "Enterprise Tier"}</span>
              </div>
            </div>

            <div
              onClick={() => setActiveTab("audit")}
              className="cursor-pointer group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl"
            >
              <div>
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3 group-hover:scale-105 transition-transform">
                  <ScrollText className="h-6 w-6" />
                </div>
                <h3 className="font-display text-base font-bold tracking-tight text-foreground flex items-center justify-between">
                  <span>Audit Logs & Compliance</span>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  Real-time activity audit trail, admin operations, security events, and CSV export.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px]">
                <span className="text-muted-foreground">Total Logs:</span>
                <span className="font-mono font-medium text-foreground">{auditTotal} records</span>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ── TAB 2: SECURITY ────────────────────────────────────────── */}
        <TabsContent value="security" className="space-y-6 m-0">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-foreground">Security & 2FA Configuration</h2>
                <p className="text-xs text-muted-foreground">
                  Manage authentication security policies, session timeout windows, and password expiration rules.
                </p>
              </div>
              {errors.security && (
                <Button size="sm" variant="outline" onClick={() => dispatch(fetchSecuritySettings())}>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry
                </Button>
              )}
            </div>

            {errors.security && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errors.security}</span>
              </div>
            )}

            <form onSubmit={handleSaveSecurity} className="space-y-6">
              <div className="space-y-4 divide-y divide-border/60">
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-sm font-medium text-foreground">Two-Factor Authentication (2FA)</div>
                    <div className="text-xs text-muted-foreground">
                      Require an authenticator code or SMS OTP for workspace sign-in.
                    </div>
                  </div>
                  <Switch
                    checked={securityForm.twoFactorEnabled}
                    onCheckedChange={(val) => setSecurityForm({ ...securityForm, twoFactorEnabled: val })}
                    disabled={opLoading.updateSecurity}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Session Inactivity Timeout (Minutes)</Label>
                    <Input
                      type="number"
                      min={5}
                      max={1440}
                      value={securityForm.sessionTimeoutMinutes}
                      onChange={(e) =>
                        setSecurityForm({ ...securityForm, sessionTimeoutMinutes: Number(e.target.value) || 60 })
                      }
                      disabled={opLoading.updateSecurity}
                    />
                    <p className="text-[11px] text-muted-foreground">Automatic sign-out when idle.</p>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium">Password Expiration (Days)</Label>
                    <Input
                      type="number"
                      min={0}
                      max={365}
                      value={securityForm.passwordExpirationDays}
                      onChange={(e) =>
                        setSecurityForm({ ...securityForm, passwordExpirationDays: Number(e.target.value) || 90 })
                      }
                      disabled={opLoading.updateSecurity}
                    />
                    <p className="text-[11px] text-muted-foreground">Set to 0 to disable mandatory password rotation.</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={opLoading.updateSecurity}>
                  {opLoading.updateSecurity ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Security Settings
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        {/* ── TAB 3: NOTIFICATIONS & TESTS ───────────────────────────── */}
        <TabsContent value="notifications" className="space-y-6 m-0">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-foreground">Notification Preferences</h2>
                <p className="text-xs text-muted-foreground">
                  Control how alerts, approvals, weekly executive digests, and Slack notifications are broadcasted.
                </p>
              </div>
              {errors.notifications && (
                <Button size="sm" variant="outline" onClick={() => dispatch(fetchNotificationSettings())}>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry
                </Button>
              )}
            </div>

            {errors.notifications && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errors.notifications}</span>
              </div>
            )}

            <form onSubmit={handleSaveNotifications} className="space-y-6">
              <div className="space-y-3 divide-y divide-border/60">
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-sm font-medium text-foreground">Email Notifications</div>
                    <div className="text-xs text-muted-foreground">Send workflow approvals and shift notices via email.</div>
                  </div>
                  <Switch
                    checked={notificationForm.emailNotifications}
                    onCheckedChange={(val) => setNotificationForm({ ...notificationForm, emailNotifications: val })}
                    disabled={opLoading.updateNotifications}
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">In-App Notification Center</div>
                    <div className="text-xs text-muted-foreground">Real-time alerts, bell badges, and live banners.</div>
                  </div>
                  <Switch
                    checked={notificationForm.inAppAlerts}
                    onCheckedChange={(val) => setNotificationForm({ ...notificationForm, inAppAlerts: val })}
                    disabled={opLoading.updateNotifications}
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">Slack Broadcasts</div>
                    <div className="text-xs text-muted-foreground">Deliver priority payroll alerts to the connected Slack channel.</div>
                  </div>
                  <Switch
                    checked={notificationForm.slackAlerts}
                    onCheckedChange={(val) => setNotificationForm({ ...notificationForm, slackAlerts: val })}
                    disabled={opLoading.updateNotifications}
                  />
                </div>

                <div className="flex items-center justify-between pt-3">
                  <div>
                    <div className="text-sm font-medium text-foreground">Weekly Executive Digest</div>
                    <div className="text-xs text-muted-foreground">Automated AI summary report of metrics and workforce trends.</div>
                  </div>
                  <Switch
                    checked={notificationForm.weeklyDigest}
                    onCheckedChange={(val) => setNotificationForm({ ...notificationForm, weeklyDigest: val })}
                    disabled={opLoading.updateNotifications}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={opLoading.updateNotifications}>
                  {opLoading.updateNotifications ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Notification Rules
                </Button>
              </div>
            </form>
          </div>

          {/* Test Configuration Cards (Email & SMS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Email Test */}
            <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Test Email Gateway</h3>
                  <p className="text-xs text-muted-foreground">Dispatch a test message through configured SMTP server.</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Recipient Email (Optional)</Label>
                <Input
                  type="email"
                  value={emailTestTarget}
                  onChange={(e) => setEmailTestTarget(e.target.value)}
                  placeholder="admin@ofc360.ai"
                  disabled={opLoading.testEmail}
                />
              </div>

              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={handleTestEmail}
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

            {/* SMS Test */}
            <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Test SMS Gateway</h3>
                  <p className="text-xs text-muted-foreground">Verify carrier delivery and SMS provider balance.</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Recipient Phone (Optional)</Label>
                <Input
                  type="tel"
                  value={smsTestTarget}
                  onChange={(e) => setSmsTestTarget(e.target.value)}
                  placeholder="+91 98765 43210"
                  disabled={opLoading.testSms}
                />
              </div>

              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={handleTestSms}
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
        </TabsContent>

        {/* ── TAB 4: BRANDING ────────────────────────────────────────── */}
        <TabsContent value="branding" className="space-y-6 m-0">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-foreground">Branding & Workspace Customization</h2>
                <p className="text-xs text-muted-foreground">
                  Set organization legal brand name, custom portal logo, and brand color palette.
                </p>
              </div>
              {errors.branding && (
                <Button size="sm" variant="outline" onClick={() => dispatch(fetchBrandingSettings())}>
                  <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry
                </Button>
              )}
            </div>

            {errors.branding && (
              <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errors.branding}</span>
              </div>
            )}

            <form onSubmit={handleSaveBranding} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Organization Legal Name</Label>
                  <Input
                    value={brandingForm.companyName}
                    onChange={(e) => setBrandingForm({ ...brandingForm, companyName: e.target.value })}
                    placeholder="OFC360 Technologies Pvt Ltd"
                    disabled={opLoading.updateBranding}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Portal Custom Header Title</Label>
                  <Input
                    value={brandingForm.portalTitle}
                    onChange={(e) => setBrandingForm({ ...brandingForm, portalTitle: e.target.value })}
                    placeholder="OFC360 Workspace"
                    disabled={opLoading.updateBranding}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Primary Brand Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandingForm.primaryColor}
                      onChange={(e) => setBrandingForm({ ...brandingForm, primaryColor: e.target.value })}
                      className="h-9 w-12 rounded cursor-pointer border border-border/60 bg-transparent p-1"
                      disabled={opLoading.updateBranding}
                    />
                    <Input
                      value={brandingForm.primaryColor}
                      onChange={(e) => setBrandingForm({ ...brandingForm, primaryColor: e.target.value })}
                      className="font-mono text-xs"
                      disabled={opLoading.updateBranding}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Accent Brand Color</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={brandingForm.accentColor}
                      onChange={(e) => setBrandingForm({ ...brandingForm, accentColor: e.target.value })}
                      className="h-9 w-12 rounded cursor-pointer border border-border/60 bg-transparent p-1"
                      disabled={opLoading.updateBranding}
                    />
                    <Input
                      value={brandingForm.accentColor}
                      onChange={(e) => setBrandingForm({ ...brandingForm, accentColor: e.target.value })}
                      className="font-mono text-xs"
                      disabled={opLoading.updateBranding}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <Label className="text-xs font-medium">Logo URL</Label>
                  <Input
                    value={brandingForm.logoUrl}
                    onChange={(e) => setBrandingForm({ ...brandingForm, logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    disabled={opLoading.updateBranding}
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={opLoading.updateBranding}>
                  {opLoading.updateBranding ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Branding
                </Button>
              </div>
            </form>
          </div>
        </TabsContent>

        {/* ── TAB 5: INTEGRATIONS ────────────────────────────────────── */}
        <TabsContent value="integrations" className="space-y-6 m-0">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-foreground">Third-Party Ecosystem Integrations</h2>
                <p className="text-xs text-muted-foreground">
                  Connect workspace services for single sign-on, Slack broadcasts, video calls, and webhooks.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => dispatch(fetchIntegrationSettings())}
                disabled={opLoading.integrations}
              >
                <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${opLoading.integrations ? "animate-spin" : ""}`} /> Retry
              </Button>
            </div>

            {integrations.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                <Layers className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50 stroke-1" />
                No integrations found.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {integrations.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col justify-between rounded-2xl border border-border/60 bg-background/40 p-5 backdrop-blur-xl"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-xs text-foreground">{item.name}</div>
                        <Badge variant="outline" className="text-[10px] mt-1">
                          {item.category}
                        </Badge>
                      </div>
                      <Badge
                        variant={item.connected ? "default" : "secondary"}
                        className={item.connected ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/20" : ""}
                      >
                        {item.connected ? "Connected" : "Disconnected"}
                      </Badge>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-3">
                      <span className="text-[11px] text-muted-foreground">
                        {item.connected ? "Active real-time synchronization" : "Not connected"}
                      </span>
                      <Button
                        size="sm"
                        variant={item.connected ? "outline" : "default"}
                        className="h-7 text-xs"
                        onClick={() => handleToggleIntegration(item)}
                        disabled={opLoading.updateIntegration}
                      >
                        {item.connected ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* ── TAB 6: BILLING & PLANS ─────────────────────────────────── */}
        <TabsContent value="billing" className="space-y-6 m-0">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-foreground">Current Subscription & Seat Capacity</h2>
                <p className="text-xs text-muted-foreground">
                  Overview of current plan tier, seat allocations, billing cycle, and invoice history.
                </p>
              </div>
              <Badge variant="secondary" className="px-3 py-1 text-xs">
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
                Active Subscription
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 rounded-xl border border-border/60 bg-background/40 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-muted-foreground">Current Plan</span>
                    <div className="font-display text-2xl font-bold text-foreground">
                      {billing?.currentPlan || "Enterprise Plan"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-xl font-bold text-foreground">
                      {billing?.amount || "₹ 49,999"}
                    </div>
                    <div className="text-xs text-muted-foreground">Billed {billing?.billingCycle || "Annual"}</div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-medium text-foreground">
                    <span>Employee Seat Allocation</span>
                    <span>
                      {billing?.usedSeats ?? 0} / {billing?.seats ?? 100} Seats Used
                    </span>
                  </div>
                  <Progress
                    value={
                      billing?.seats
                        ? Math.min(100, Math.round(((billing.usedSeats || 0) / billing.seats) * 100))
                        : 50
                    }
                    className="h-2"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                  <div>
                    Next Renewal Date:{" "}
                    <span className="font-medium text-foreground">{billing?.nextBillingDate || "N/A"}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs text-destructive hover:bg-destructive/10 h-7"
                    onClick={handleCancelSubscription}
                    disabled={opLoading.cancelSubscription}
                  >
                    Cancel Subscription
                  </Button>
                </div>
              </div>

              <div className="rounded-xl border border-border/60 bg-background/40 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    <CreditCard className="h-4 w-4" /> Payment Method
                  </div>
                  <div className="mt-4 font-medium text-foreground text-sm">
                    {billing?.paymentMethod || "Active Card on File"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Auto-debit enabled for scheduled subscription renewals.
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 w-full"
                  onClick={() => toast.info("Payment method gateway opened")}
                >
                  Update Payment Method
                </Button>
              </div>
            </div>

            {/* Available Subscription Plans */}
            <div className="pt-4 space-y-4">
              <h3 className="text-sm font-semibold tracking-tight text-foreground">Available Subscription Plans</h3>
              {subscriptionPlans.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground border border-dashed border-border/60 rounded-xl">
                  No subscription plans available from API.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {subscriptionPlans.map((plan) => (
                    <div
                      key={plan.id}
                      className={`relative flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                        plan.current
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border/60 bg-background/40 hover:border-primary/40"
                      }`}
                    >
                      {plan.isPopular && (
                        <span className="absolute -top-2.5 right-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                          Popular
                        </span>
                      )}
                      <div>
                        <div className="font-semibold text-sm text-foreground">{plan.name}</div>
                        <div className="mt-2 font-display text-2xl font-bold text-foreground">
                          {typeof plan.price === "number" ? `₹ ${plan.price.toLocaleString()}` : plan.price}
                          <span className="text-xs font-normal text-muted-foreground">/{plan.billingCycle || "mo"}</span>
                        </div>
                        {plan.seats && (
                          <div className="text-xs text-muted-foreground mt-1">Up to {plan.seats} employee seats</div>
                        )}

                        <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
                          {plan.features?.map((f, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6 pt-3 border-t border-border/60">
                        {plan.current ? (
                          <Button size="sm" variant="secondary" className="w-full" disabled>
                            Current Active Plan
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => handleUpgradePlan(plan)}
                            disabled={opLoading.upgradeSubscription}
                          >
                            <Zap className="mr-1.5 h-3.5 w-3.5" /> Upgrade to {plan.name}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ── TAB 7: AUDIT TRAIL ─────────────────────────────────────── */}
        <TabsContent value="audit" className="space-y-6 m-0">
          <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-foreground">System Audit Logs</h2>
                <p className="text-xs text-muted-foreground">
                  Tamper-evident activity trail tracing administrative and security operations.
                </p>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleExportAuditLogs}
                disabled={opLoading.exportAuditLogs}
              >
                {opLoading.exportAuditLogs ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Export CSV
              </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={auditSearch}
                  onChange={(e) => {
                    setAuditSearch(e.target.value);
                    setAuditPage(1);
                  }}
                  placeholder="Search user, action, IP, or details..."
                  className="pl-9 h-9 text-xs"
                />
              </div>

              <Select
                value={auditModule}
                onValueChange={(val) => {
                  setAuditModule(val);
                  setAuditPage(1);
                }}
              >
                <SelectTrigger className="w-[180px] h-9 text-xs">
                  <SelectValue placeholder="All Modules" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Modules</SelectItem>
                  <SelectItem value="Settings">Settings</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Employees">Employees</SelectItem>
                  <SelectItem value="Payroll">Payroll</SelectItem>
                  <SelectItem value="Billing">Billing</SelectItem>
                </SelectContent>
              </Select>

              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  dispatch(fetchAuditLogs({ page: auditPage, limit: 10, search: auditSearch, module: auditModule }))
                }
                disabled={opLoading.auditLogs}
              >
                <RefreshCw className={`h-4 w-4 ${opLoading.auditLogs ? "animate-spin" : ""}`} />
              </Button>
            </div>

            {/* Audit Table */}
            {opLoading.auditLogs && auditLogsList.length === 0 ? (
              <div className="space-y-2 py-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-xl" />
                ))}
              </div>
            ) : auditLogsList.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground">
                <ScrollText className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50 stroke-1" />
                No audit log records found matching your filters.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b border-border/60 uppercase tracking-wider text-muted-foreground">
                    <tr>
                      <th className="py-2.5 text-left">Timestamp</th>
                      <th className="text-left">Actor / User</th>
                      <th className="text-left">Action</th>
                      <th className="text-left">Module</th>
                      <th className="text-left">IP Address</th>
                      <th className="text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {auditLogsList.map((log) => (
                      <tr key={log.id} className="hover:bg-accent/40 transition-colors">
                        <td className="py-3 font-mono text-muted-foreground whitespace-nowrap">{log.timestamp}</td>
                        <td>
                          <div className="font-medium text-foreground">{log.user}</div>
                          <div className="text-[10px] text-muted-foreground">{log.role}</div>
                        </td>
                        <td>
                          <Badge variant="outline" className="font-mono text-[10px]">
                            {log.action}
                          </Badge>
                        </td>
                        <td>
                          <span className="rounded-md bg-accent/60 px-2 py-0.5 text-[10px]">{log.module}</span>
                        </td>
                        <td className="font-mono text-muted-foreground">{log.ip}</td>
                        <td className="max-w-xs truncate text-muted-foreground">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
              <div>
                Showing <span className="font-medium text-foreground">{auditLogsList.length}</span> of{" "}
                <span className="font-medium text-foreground">{auditTotal}</span> records
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={auditPage <= 1 || opLoading.auditLogs}
                  onClick={() => setAuditPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span>
                  Page {auditPage} of {auditPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={auditPage >= auditPages || opLoading.auditLogs}
                  onClick={() => setAuditPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
