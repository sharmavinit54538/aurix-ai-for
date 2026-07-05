import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight, Briefcase, CalendarClock, CheckCircle2, Clock, FileCheck2, Plus,
  Sparkles, Target, TrendingUp, UserCheck, UserPlus, Users, XCircle,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { useRecruitment } from "@/lib/recruitment/store";
import { STAGES, STAGE_LABEL, type Stage } from "@/lib/recruitment/types";
import { CandidateAvatar, fmtDate } from "@/components/recruitment/Bits";

export const Route = createFileRoute("/dashboard/recruitment/")({
  head: () => ({ meta: [{ title: "Recruitment Dashboard — Aurix" }] }),
  component: RecruitmentDashboard,
});

const CHART_COLORS = ["oklch(0.65 0.22 285)", "oklch(0.7 0.18 200)", "oklch(0.74 0.16 140)", "oklch(0.75 0.18 60)", "oklch(0.68 0.2 25)", "oklch(0.62 0.18 320)"];

function RecruitmentDashboard() {
  const { jobs, candidates, interviews, offers } = useRecruitment((s) => s);

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter((j) => j.status === "active").length;
  const draftJobs = jobs.filter((j) => j.status === "draft").length;
  const closedJobs = jobs.filter((j) => j.status === "closed").length;
  const totalCandidates = candidates.length;
  const shortlisted = candidates.filter((c) => ["assessment", "interview", "technical", "hr"].includes(c.stage)).length;
  const interviewScheduled = interviews.filter((i) => i.status === "scheduled").length;
  const selected = candidates.filter((c) => c.stage === "hired").length;
  const rejected = candidates.filter((c) => c.stage === "rejected").length;
  const offersSent = offers.length;
  const offersAccepted = offers.filter((o) => o.status === "accepted").length;
  const timeToHire = 24;

  const kpis = [
    { label: "Total Jobs", value: totalJobs, change: "+8", icon: Briefcase, accent: "from-violet-500/20 to-fuchsia-500/10" },
    { label: "Active Jobs", value: activeJobs, change: "+3", icon: TrendingUp, accent: "from-emerald-500/20 to-teal-500/10" },
    { label: "Draft Jobs", value: draftJobs, change: "—", icon: FileCheck2, accent: "from-sky-500/20 to-cyan-500/10" },
    { label: "Closed Jobs", value: closedJobs, change: "-1", icon: XCircle, accent: "from-rose-500/15 to-red-500/10" },
    { label: "Candidates", value: totalCandidates, change: "+42", icon: Users, accent: "from-indigo-500/20 to-violet-500/10" },
    { label: "Shortlisted", value: shortlisted, change: "+12", icon: UserCheck, accent: "from-amber-500/20 to-orange-500/10" },
    { label: "Interviews", value: interviewScheduled, change: "+5", icon: CalendarClock, accent: "from-cyan-500/20 to-sky-500/10" },
    { label: "Selected", value: selected, change: "+2", icon: CheckCircle2, accent: "from-emerald-500/20 to-green-500/10" },
    { label: "Rejected", value: rejected, change: "+6", icon: XCircle, accent: "from-rose-500/15 to-pink-500/10" },
    { label: "Offers Sent", value: offersSent, change: "+3", icon: FileCheck2, accent: "from-fuchsia-500/20 to-purple-500/10" },
    { label: "Offers Accepted", value: offersAccepted, change: "+1", icon: UserPlus, accent: "from-emerald-500/20 to-teal-500/10" },
    { label: "Time to Hire", value: `${timeToHire}d`, change: "-3d", icon: Clock, accent: "from-amber-500/20 to-yellow-500/10" },
  ];

  // deterministic fallback: hash stage name to avoid Math.random() during SSR
  const funnel = STAGES.filter((s) => s !== "rejected").map((s) => {
    const fallback = s.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) % 6 + 1;
    return {
      stage: STAGE_LABEL[s],
      count: candidates.filter((c) => c.stage === s).length || fallback,
    };
  });

  // department hiring
  const byDept = Object.entries(
    jobs.reduce<Record<string, number>>((a, j) => ({ ...a, [j.department]: (a[j.department] || 0) + j.applicants }), {}),
  ).map(([name, value]) => ({ name, value }));

  const monthlyHires = [
    { m: "Jan", hires: 4, offers: 6 }, { m: "Feb", hires: 7, offers: 9 }, { m: "Mar", hires: 5, offers: 8 },
    { m: "Apr", hires: 11, offers: 14 }, { m: "May", hires: 9, offers: 12 }, { m: "Jun", hires: 14, offers: 16 },
  ];

  const recent = candidates
    .flatMap((c) => c.timeline.map((t) => ({ ...t, who: c.name, jobTitle: c.appliedPosition })))
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 8);

  return (
    <>
      <PageHeader
        title="Recruitment"
        description="Open roles, pipeline health, and hiring velocity at a glance."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link to="/dashboard/recruitment/analytics"><TrendingUp className="mr-2 h-4 w-4" />Analytics</Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard/recruitment/jobs/new"><Plus className="mr-2 h-4 w-4" />Post a role</Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
        {kpis.map((k, i) => {
          const Icon = k.icon;
          return (
            <div
              key={k.label}
              style={{ animation: `fade-in 400ms ease-out ${i * 30}ms both` }}
              className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${k.accent} p-4 backdrop-blur-xl shadow-sm`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{k.label}</div>
                  <div className="mt-2 font-display text-2xl font-semibold tracking-tight">{k.value}</div>
                  <div className="mt-1 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                    <ArrowUpRight className="h-3 w-3" />{k.change}
                  </div>
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-background/60 shadow-sm">
                  <Icon className="h-4 w-4" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Hiring Funnel" subtitle="Candidates per stage" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={funnel} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
              <XAxis dataKey="stage" stroke="currentColor" className="text-[10px] text-muted-foreground" tickLine={false} axisLine={false} />
              <YAxis stroke="currentColor" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {funnel.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Department Hiring" subtitle="Applicants by department">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={byDept} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                {byDept.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ChartCard title="Hiring Trend" subtitle="Hires vs offers, last 6 months" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={monthlyHires} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gh" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[0]} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={CHART_COLORS[0]} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="go" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_COLORS[2]} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={CHART_COLORS[2]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
              <XAxis dataKey="m" stroke="currentColor" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
              <YAxis stroke="currentColor" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="offers" stroke={CHART_COLORS[2]} strokeWidth={2} fill="url(#go)" />
              <Area type="monotone" dataKey="hires" stroke={CHART_COLORS[0]} strokeWidth={2} fill="url(#gh)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="font-display text-sm font-semibold">Recent Activity</div>
              <div className="text-xs text-muted-foreground">Latest pipeline events</div>
            </div>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </div>
          <ul className="space-y-3">
            {recent.map((r) => (
              <li key={r.id} className="flex items-start gap-3">
                <CandidateAvatar name={r.who} size={28} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm"><span className="font-medium">{r.who}</span> — {r.title}</div>
                  <div className="truncate text-[11px] text-muted-foreground">{r.jobTitle} · {fmtDate(r.at)}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function ChartCard({ title, subtitle, children, className = "" }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl ${className}`}>
      <div className="mb-2 flex items-end justify-between">
        <div>
          <div className="font-display text-sm font-semibold">{title}</div>
          {subtitle ? <div className="text-xs text-muted-foreground">{subtitle}</div> : null}
        </div>
      </div>
      {children}
    </div>
  );
}
