import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Sliders,
  Building2,
  ShieldCheck,
  ScrollText,
  CreditCard,
  Shield,
  Bell,
  Layers,
  User,
  Settings as SettingsIcon,
  Search,
  CheckCircle2,
  Users,
  Lock,
  Activity,
  ArrowRight,
  RefreshCw,
  Sparkles,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { api } from "@/api";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings/")({
  head: () => ({ meta: [{ title: "Settings Hub — OFC360" }] }),
  component: SettingsHubPage,
});

interface SettingsModuleDef {
  id: string;
  title: string;
  category: "security" | "org" | "system";
  description: string;
  icon: any;
  to: string;
  color: string;
  badge: string;
  badgeColor: string;
  tags: string[];
}

const SETTINGS_MODULES_LIST: SettingsModuleDef[] = [
  {
    id: "company",
    title: "Company & Organization",
    category: "org",
    description: "Manage organization legal entity, tax numbers, branch addresses, and company branding.",
    icon: Building2,
    to: "/dashboard/settings/company",
    color: "from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30",
    badge: "Branding & Legal",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    tags: ["Tax ID", "Address", "CIN", "Branding"],
  },
  {
    id: "roles-permissions",
    title: "Roles & Permissions (RBAC)",
    category: "security",
    description: "Define custom access roles, granular permission matrices, and role-based access control.",
    icon: ShieldCheck,
    to: "/dashboard/settings/roles-permissions",
    color: "from-indigo-500/20 to-cyan-500/20 text-indigo-400 border-indigo-500/30",
    badge: "RBAC Active",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    tags: ["Custom Roles", "Permission Slabs", "Access Matrix"],
  },
  {
    id: "security",
    title: "Security & MFA Rules",
    category: "security",
    description: "Two-factor authentication, password complexity policies, active sessions, and IP whitelisting.",
    icon: Shield,
    to: "/dashboard/settings/security",
    color: "from-rose-500/20 to-red-500/20 text-rose-400 border-rose-500/30",
    badge: "2FA Enforced",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    tags: ["2FA", "Session Timeout", "Password Policy"],
  },
  {
    id: "audit-logs",
    title: "Security Audit Logs",
    category: "security",
    description: "Full security audit history, login activities, record modifications, and exportable system logs.",
    icon: ScrollText,
    to: "/dashboard/settings/audit-logs",
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
    badge: "Live Audit Trail",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    tags: ["User Activity", "IP Trace", "Change Log"],
  },
  {
    id: "billing",
    title: "Billing & Subscriptions",
    category: "org",
    description: "Manage enterprise subscription plans, billing cycles, payment methods, and user seat limits.",
    icon: CreditCard,
    to: "/dashboard/settings/billing",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    badge: "Enterprise Plan",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    tags: ["Invoices", "Payment Cards", "Seats"],
  },
  {
    id: "general",
    title: "General Preferences",
    category: "org",
    description: "System preferences, timezone, regional formats, language, and fiscal year defaults.",
    icon: Sliders,
    to: "/dashboard/settings/general",
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
    badge: "System Defaults",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    tags: ["Timezone", "Fiscal Year", "Currency"],
  },
  {
    id: "integrations",
    title: "Integrations & API Keys",
    category: "system",
    description: "Connect third-party services like Slack, Teams, Google Workspace, webhooks, and API keys.",
    icon: Layers,
    to: "/dashboard/settings/integrations",
    color: "from-sky-500/20 to-blue-500/20 text-sky-400 border-sky-500/30",
    badge: "Webhooks Active",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    tags: ["Slack", "Teams", "OAuth", "API Keys"],
  },
  {
    id: "notifications",
    title: "Notifications & Alerts",
    category: "system",
    description: "Configure automated email digests, in-app notification rules, and webhook alert triggers.",
    icon: Bell,
    to: "/dashboard/settings/notifications",
    color: "from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/30",
    badge: "Alert Rules",
    badgeColor: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    tags: ["Email Digest", "Slack Bot", "In-App"],
  },
  {
    id: "profile",
    title: "Personal User Profile",
    category: "security",
    description: "Manage your account details, profile picture, contact email, and password preferences.",
    icon: User,
    to: "/dashboard/settings/profile",
    color: "from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30",
    badge: "Account Owner",
    badgeColor: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    tags: ["Password", "Avatar", "Contact Info"],
  },
];

function SettingsHubPage() {
  return (
    <div className="space-y-6">
      {/* Settings Sub-Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SETTINGS_MODULES_LIST.map((m, idx) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
            >
              <Link
                to={m.to as any}
                className="group relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:bg-accent/30"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br border ${m.color} transition-transform duration-200 group-hover:scale-105 shadow-sm`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                  </div>

                  <h3 className="font-display text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary flex items-center justify-between">
                    <span>{m.title}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </h3>

                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {m.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default SettingsHubPage;
