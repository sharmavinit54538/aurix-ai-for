import React, { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Crown,
  Code2,
  DollarSign,
  Server,
  Workflow,
  Megaphone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAurix } from "@/lib/aurix-store";
import { EXECUTIVE_DATASETS } from "../data/executiveData";
import type { ExecutiveRole } from "../types/executiveTypes";

const EXECUTIVE_CARDS: {
  role: ExecutiveRole;
  title: string;
  focus: string;
  icon: any;
  color: string;
  badge: string;
  badgeColor: string;
}[] = [
  {
    role: "ceo",
    title: "CEO Command Center",
    focus: "Company Overview, Revenue, ARR, Headcount & Corporate OKRs",
    icon: Crown,
    color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
    badge: "Enterprise Strategy",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  {
    role: "cto",
    title: "CTO Command Center",
    focus: "Engineering Velocity, SLA Uptime, P99 Latency & AI Microservices",
    icon: Code2,
    color: "from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30",
    badge: "Tech Architecture",
    badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  {
    role: "cfo",
    title: "CFO Command Center",
    focus: "Financial Runway, Cash Inflow, Operating Margin & Tax Filings",
    icon: DollarSign,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
    badge: "Finance & Tax",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  {
    role: "cio",
    title: "CIO Command Center",
    focus: "IT Asset MDM, ISO 27001 Security, SaaS Licenses & Helpdesk SLA",
    icon: Server,
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
    badge: "InfoSec & IT Ops",
    badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    role: "coo",
    title: "COO Command Center",
    focus: "Operational Efficiency, Process SLAs, Capacity & Attendance",
    icon: Workflow,
    color: "from-sky-500/20 to-cyan-500/20 text-sky-400 border-sky-500/30",
    badge: "Workforce Ops",
    badgeColor: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  },
  {
    role: "cmo",
    title: "CMO Command Center",
    focus: "Lead Generation, CAC, Campaign ROI & Organic Search Funnel",
    icon: Megaphone,
    color: "from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30",
    badge: "Growth & Brand",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
];

export function ExecutiveHubPage() {
  const navigate = useNavigate();
  const ws = useAurix();
  const rawRole = (ws.user?.role || localStorage.getItem("user_role") || "").toLowerCase();

  // Auto-route specific executive roles to their designated dashboard
  useEffect(() => {
    const validExecRoles = ["ceo", "cto", "cfo", "cio", "coo", "cmo"];
    if (validExecRoles.includes(rawRole)) {
      navigate({ to: `/dashboard/executive/${rawRole}` as any, replace: true });
    }
  }, [rawRole, navigate]);

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-lg">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-64 w-64 rounded-full bg-brand/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400">
              <Crown className="h-3.5 w-3.5 text-amber-400" />
              Role-Based Executive Control Center
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">
              Executive Role-Based Dashboards
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground leading-relaxed">
              Separate, isolated command centers tailored for CEO, CTO, CFO, CIO, COO, and CMO leadership roles with role-based access, real-time analytics, AI insights, and OKR tracking.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Executive Health Score: 95.5%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Executive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {EXECUTIVE_CARDS.map((card, idx) => {
          const Icon = card.icon;
          const dataset = EXECUTIVE_DATASETS[card.role];
          return (
            <motion.div
              key={card.role}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: idx * 0.05 }}
            >
              <Link
                to={`/dashboard/executive/${card.role}` as any}
                className="group relative flex flex-col justify-between h-full overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:bg-accent/30"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br border ${card.color} transition-transform duration-200 group-hover:scale-105 shadow-sm`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <Badge variant="outline" className={`text-[10px] font-semibold border ${card.badgeColor}`}>
                      {card.badge}
                    </Badge>
                  </div>

                  <h3 className="font-display text-base font-bold tracking-tight text-foreground transition-colors group-hover:text-primary flex items-center justify-between">
                    <span>{card.title}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </h3>

                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {card.focus}
                  </p>
                </div>

                {/* Key KPIs Preview Footer */}
                <div className="mt-4 pt-3 border-t border-border/40 space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-left">
                    {dataset.kpis.slice(0, 2).map((kpi) => (
                      <div key={kpi.id} className="bg-accent/20 rounded-lg p-2 border border-border/30">
                        <span className="text-[9px] uppercase font-semibold text-muted-foreground/70 block truncate">
                          {kpi.title}
                        </span>
                        <span className="font-display text-xs font-bold text-foreground truncate block">
                          {kpi.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1 font-semibold text-emerald-400">
                      <ShieldCheck className="h-3 w-3" /> Score: {dataset.healthScore}%
                    </span>
                    <span className="text-primary font-semibold group-hover:underline">Open Dashboard &rarr;</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default ExecutiveHubPage;
