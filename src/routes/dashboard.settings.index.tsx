import { createFileRoute } from "@tanstack/react-router";
import {
  Sliders, Building2, ShieldCheck, ScrollText, CreditCard,
  Shield, Bell, Layers, User, Settings as SettingsIcon
} from "lucide-react";
import { ModuleHubView, type ModuleItem } from "@/components/aurix/ModuleHubView";

export const Route = createFileRoute("/dashboard/settings/")({
  head: () => ({ meta: [{ title: "Settings — Aurix" }] }),
  component: SettingsHubPage,
});

const SETTINGS_MODULES: ModuleItem[] = [
  {
    id: "general",
    title: "General Settings",
    description: "System preferences, timezone, language, and regional defaults.",
    icon: Sliders,
    to: "/dashboard/settings/general",
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "company",
    title: "Company Settings",
    description: "Organization legal entity, tax numbers, addresses, and branding.",
    icon: Building2,
    to: "/dashboard/settings/company",
    color: "from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "roles-permissions",
    title: "Roles & Permissions",
    description: "Define custom access roles, granular permission matrices, and RBAC control.",
    icon: ShieldCheck,
    to: "/dashboard/settings/roles-permissions",
    color: "from-indigo-500/20 to-cyan-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "audit-logs",
    title: "Audit Logs",
    description: "Security audit history, login activities, record modifications, and export logs.",
    icon: ScrollText,
    to: "/dashboard/settings/audit-logs",
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
  },
  {
    id: "billing",
    title: "Billing & Subscriptions",
    description: "Manage subscription plans, invoices, payment methods, and seat usage.",
    icon: CreditCard,
    to: "/dashboard/settings/billing",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "security",
    title: "Security Settings",
    description: "Two-factor authentication, password policies, active sessions, and IP rules.",
    icon: Shield,
    to: "/dashboard/settings/security",
    color: "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30",
  },
  {
    id: "notifications",
    title: "Notifications & Alerts",
    description: "Configure email digest rules, push notifications, and Slack/Teams webhooks.",
    icon: Bell,
    to: "/dashboard/settings/notifications",
    color: "from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/30",
  },
  {
    id: "integrations",
    title: "Integrations & API",
    description: "Connect third-party services, manage webhooks, OAuth apps, and API keys.",
    icon: Layers,
    to: "/dashboard/settings/integrations",
    color: "from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30",
  },
  {
    id: "profile",
    title: "User Profile",
    description: "Personal account settings, contact email, avatar, and password preferences.",
    icon: User,
    to: "/dashboard/settings/profile",
    color: "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30",
  },
];

function SettingsHubPage() {
  return (
    <ModuleHubView
      eyebrow="System Configuration"
      title="Settings & Administration"
      description="Configure organization details, user access roles, security rules, audit logs, billing subscriptions, and integrations."
      headerIcon={SettingsIcon}
      modules={SETTINGS_MODULES}
    />
  );
}
