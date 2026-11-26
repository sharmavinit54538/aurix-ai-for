import React, { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  Crown,
  Code2,
  DollarSign,
  Server,
  Workflow,
  Megaphone,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { useAurix } from "@/lib/aurix-store";
import type { ExecutiveRole } from "../types/executiveTypes";

const EXECUTIVE_CARDS: {
  role: ExecutiveRole;
  title: string;
  focus: string;
  icon: any;
  badge: string;
}[] = [
  {
    role: "ceo",
    title: "CEO Command Center",
    focus: "Company Overview, Revenue, ARR, Headcount & Corporate OKRs",
    icon: Crown,
    badge: "Enterprise Strategy",
  },
  {
    role: "cto",
    title: "CTO Command Center",
    focus: "Engineering Velocity, SLA Uptime, P99 Latency & AI Microservices",
    icon: Code2,
    badge: "Tech Architecture",
  },
  {
    role: "cfo",
    title: "CFO Command Center",
    focus: "Financial Runway, Cash Inflow, Operating Margin & Tax Filings",
    icon: DollarSign,
    badge: "Finance & Tax",
  },
  {
    role: "cio",
    title: "CIO Command Center",
    focus: "IT Asset MDM, ISO 27001 Security, SaaS Licenses & Helpdesk SLA",
    icon: Server,
    badge: "InfoSec & IT Ops",
  },
  {
    role: "coo",
    title: "COO Command Center",
    focus: "Operational Efficiency, Process SLAs, Capacity & Attendance",
    icon: Workflow,
    badge: "Workforce Ops",
  },
  {
    role: "cmo",
    title: "CMO Command Center",
    focus: "Lead Generation, CAC, Campaign ROI & Organic Search Funnel",
    icon: Megaphone,
    badge: "Growth & Brand",
  },
];

export function ExecutiveHubPage() {
  const navigate = useNavigate();
  const ws = useAurix();
  const rawRole = (ws.user?.role || "").toLowerCase();

  // Auto-route specific executive roles to their designated dashboard
  useEffect(() => {
    const validExecRoles = ["ceo", "cto", "cfo", "cio", "coo", "cmo"];
    if (validExecRoles.includes(rawRole)) {
      navigate({ to: `/dashboard/executive/${rawRole}` as any, replace: true });
    }
  }, [rawRole, navigate]);

  return (
    <div className="space-y-6 text-left">
      <PageHeader
        title="Executive Command Center"
        description="Role-specific operational views across strategy, finance, engineering, and workforce."
      />

      {/* 6 Executive Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EXECUTIVE_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.role}
              to={`/dashboard/executive/${card.role}` as any}
              className="group flex flex-col justify-between h-full rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-primary/40 hover:bg-accent/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>

                  <Badge variant="outline" className="text-xs font-medium border-border bg-muted/40 text-muted-foreground">
                    {card.badge}
                  </Badge>
                </div>

                <h2 className="font-display text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary flex items-center justify-between gap-2">
                  <span>{card.title}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary" />
                </h2>

                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {card.focus}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Live role view
                </span>
                <span className="text-[13px] text-primary font-medium group-hover:underline">
                  Open Dashboard &rarr;
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default ExecutiveHubPage;
