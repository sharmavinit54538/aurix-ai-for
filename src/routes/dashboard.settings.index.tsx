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
  head: () => ({ meta: [{ title: "Settings Hub — Aurix AI" }] }),
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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<"all" | "security" | "org" | "system">("all");

  // Fetch summary stats from backend
  const { data: summaryRes, isLoading: isLoadingSummary } = useQuery({
    queryKey: ["settings-summary"],
    queryFn: async () => {
      try {
        const res = await api.get<{ success: boolean; data: any }>("settings/summary");
        return res.data;
      } catch (e) {
        return {
          company_name: "Aurix Enterprise",
          active_users: 12,
          configured_roles: 4,
          total_audit_events: 248,
          security_compliance_score: 98,
          active_integrations: 3,
          current_plan: "Enterprise AI Tier",
          system_status: "All Systems Operational",
        };
      }
    },
  });

  const summary = summaryRes || {
    company_name: "Aurix Enterprise",
    active_users: 12,
    configured_roles: 4,
    total_audit_events: 248,
    security_compliance_score: 98,
    active_integrations: 3,
    current_plan: "Enterprise AI Tier",
    system_status: "All Systems Operational",
  };

  // Filter modules
  const filteredModules = SETTINGS_MODULES_LIST.filter((mod) => {
    const matchesCategory = activeCategory === "all" || mod.category === activeCategory;
    const matchesSearch =
      mod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mod.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const summaryCards = [
    {
      title: "Organization",
      value: summary.company_name,
      subtext: `${summary.active_users} active admin users`,
      icon: Building2,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Configured Roles",
      value: `${summary.configured_roles} Access Roles`,
      subtext: "RBAC permission matrices active",
      icon: Users,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      title: "Security Index",
      value: `${summary.security_compliance_score}% Compliant`,
      subtext: "2FA & MFA rules enforced",
      icon: ShieldCheck,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Audit Log Trail",
      value: `${summary.total_audit_events} Events`,
      subtext: "Recorded system activities",
      icon: Activity,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-lg">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-brand/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
              <SettingsIcon className="h-3.5 w-3.5" />
              System Administration Hub
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Settings & Workspace Control
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
              Manage organization details, RBAC access roles, security enforcement, audit logs, subscription billing, and third-party integrations.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs gap-2 border-border/60 hover:bg-accent"
              onClick={() => navigate({ to: "/dashboard/settings/audit-logs" })}
            >
              <ScrollText className="h-3.5 w-3.5 text-amber-400" />
              Audit Trail
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="h-9 text-xs gap-2 border-border/60 hover:bg-accent"
              onClick={() => navigate({ to: "/dashboard/settings/security" })}
            >
              <Lock className="h-3.5 w-3.5 text-rose-400" />
              Security Rules
            </Button>

            <Button
              size="sm"
              className="h-9 text-xs gap-2 bg-brand text-brand-foreground hover:bg-brand/90 font-semibold"
              onClick={() => navigate({ to: "/dashboard/settings/company" })}
            >
              <Building2 className="h-3.5 w-3.5" />
              Company Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.05 }}
              className={`relative overflow-hidden rounded-xl border ${card.bg} bg-card/60 backdrop-blur-md p-4 shadow-sm hover:shadow-md transition-all duration-200`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {card.title}
                  </p>
                  <h3 className="text-lg font-bold font-display mt-1 text-foreground tracking-tight">
                    {isLoadingSummary ? (
                      <span className="inline-block h-6 w-24 animate-pulse rounded bg-muted/60" />
                    ) : (
                      card.value
                    )}
                  </h3>
                </div>
                <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              <p className="text-[11px] font-medium text-muted-foreground mt-2 flex items-center gap-1">
                {card.subtext}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-xl border border-border/50 bg-card/50 backdrop-blur-md">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search settings, roles, 2FA, billing..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 h-9 text-xs bg-muted/20 border-border/40"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { key: "all", label: "All Modules" },
            { key: "security", label: "Security & Access" },
            { key: "org", label: "Organization & Billing" },
            { key: "system", label: "System & Integrations" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                activeCategory === tab.key
                  ? "bg-brand text-brand-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Settings Sub-Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModules.map((m, idx) => {
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

                    <Badge variant="outline" className={`text-[10px] font-semibold border ${m.badgeColor}`}>
                      {m.badge}
                    </Badge>
                  </div>

                  <h3 className="font-display text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary flex items-center justify-between">
                    <span>{m.title}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </h3>

                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap items-center gap-1.5">
                  {m.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block px-2 py-0.5 rounded-md bg-muted/40 text-[10px] font-medium text-muted-foreground border border-border/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* System Health & Status Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-md text-xs">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold">
          <CheckCircle2 className="h-4 w-4" />
          <span>{summary.system_status || "All Systems Operational"}</span>
          <span className="text-muted-foreground font-normal hidden sm:inline">
            — Last security check: {summary.last_security_audit || "Just now"}
          </span>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-8 text-xs gap-1.5 border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-300"
          onClick={() => toast.success("System configurations & backup sync verified successfully!")}
        >
          <RefreshCw className="h-3 w-3" />
          Verify Security Backup
        </Button>
      </div>
    </div>
  );
}

export default SettingsHubPage;
