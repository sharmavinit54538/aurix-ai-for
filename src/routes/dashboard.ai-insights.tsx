import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Award, Brain,
  Briefcase, CheckCircle2, Cpu, Download, FileText, Flame, GraduationCap,
  HeartPulse, LineChart as LineChartIcon, MessageSquare, Send, Shield,
  ShieldAlert, Sparkles, Target, TrendingUp, UserMinus, UserPlus, Users, Wand2, Zap,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/dashboard/ai-insights")({
  head: () => ({
    meta: [
      { title: "AI Insights — Aurix" },
      { name: "description", content: "AI-powered workforce intelligence and automation for your organization." },
    ],
  }),
  component: AIInsightsPage,
});

// ---------------- Mock data ----------------
const KPI = [
  { label: "Workforce Health", score: 0, trend: 0, hint: "Awaiting onboarding completions.", icon: HeartPulse },
  { label: "Employee Satisfaction", score: 0, trend: 0, hint: "Awaiting first pulse survey.", icon: Sparkles },
  { label: "Attrition Risk", score: 0, trend: 0, hint: "No active risk signals detected.", icon: UserMinus, invert: true },
  { label: "Productivity Score", score: 0, trend: 0, hint: "Awaiting work logs.", icon: Zap },
  { label: "Attendance Health", score: 0, trend: 0, hint: "Awaiting punch logs.", icon: CheckCircle2 },
  { label: "Hiring Efficiency", score: 0, trend: 0, hint: "Awaiting job requisitions.", icon: Briefcase },
];

const ATTRITION: any[] = [];
const BURNOUT: any[] = [];

const ATTENDANCE_INSIGHTS = [
  { title: "Frequent Late Arrivals", count: 0, tone: "info", note: "No late arrival patterns detected" },
  { title: "Absence Patterns", count: 0, tone: "info", note: "No recurring absences detected" },
  { title: "Attendance Risks", count: 0, tone: "crit", note: "No unapproved absences detected" },
];

const CANDIDATES: any[] = [];
const PERFORMERS_TOP: any[] = [];
const PERFORMERS_SUPPORT: any[] = [];
const PAYROLL_ALERTS: any[] = [];
const HEADCOUNT_FORECAST: any[] = [];
const HIRING_DEMAND: any[] = [];
const PAYROLL_TREND: any[] = [];
const SATISFACTION_TREND: any[] = [];

const DOCUMENTS = [
  { label: "Offer Letter", icon: FileText },
  { label: "Appointment Letter", icon: FileText },
  { label: "Experience Letter", icon: FileText },
  { label: "Warning Letter", icon: ShieldAlert },
  { label: "Promotion Letter", icon: Award },
];

const ALERTS: any[] = [];

const RECOMMENDATIONS: string[] = [];

const CHAT_EXAMPLES = [
  "Which employees are at risk of leaving?",
  "Show attendance issues this month.",
  "Recommend promotions.",
  "Predict next quarter hiring needs.",
  "Generate HR summary report.",
];

// ---------------- Page ----------------
function AIInsightsPage() {
  return (
    <>
      <PageHeader
        title="AI Insights"
        description="AI-powered workforce intelligence and automation for your organization."
        actions={
          <>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export Report</Button>
            <Button variant="outline"><MessageSquare className="mr-2 h-4 w-4" />Ask AI</Button>
            <Button><Wand2 className="mr-2 h-4 w-4" />Generate Insights</Button>
          </>
        }
      />

      <HeroBanner />

      <SectionTitle eyebrow="Overview" title="AI Workforce KPIs" icon={Activity} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {KPI.map((k, i) => <KpiCard key={k.label} {...k} delay={i * 0.04} />)}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* Workforce analytics */}
          <SectionTitle eyebrow="Workforce" title="AI Workforce Analytics" icon={Brain} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel title="Attrition Prediction" icon={UserMinus} accent="from-rose-500/20 to-orange-500/10">
              {ATTRITION.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10 text-muted-foreground text-xs border border-dashed rounded-xl bg-card/10">
                  <UserMinus className="h-6 w-6 mb-2 opacity-50" />
                  <span>No attrition risks detected in the organization.</span>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                    <tr><th className="py-2 text-left">Employee</th><th className="text-left">Risk</th><th className="text-left">Reason</th></tr>
                  </thead>
                  <tbody>
                    {ATTRITION.map((a) => (
                      <tr key={a.name} className="border-t border-border/60 align-top">
                        <td className="py-2.5 pr-2">
                          <div className="font-medium">{a.name}</div>
                          <div className="text-xs text-muted-foreground">{a.dept}</div>
                        </td>
                        <td className="pr-2"><RiskPill score={a.risk} /></td>
                        <td className="text-xs text-muted-foreground">
                          {a.reason}
                          <div className="mt-1 inline-flex items-center gap-1 rounded-md bg-accent/60 px-2 py-0.5 text-[11px] text-foreground">
                            <Sparkles className="h-3 w-3" /> {a.action}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Panel>

            <Panel title="Burnout Detection" icon={Flame} accent="from-amber-500/20 to-rose-500/10">
              {BURNOUT.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10 text-muted-foreground text-xs border border-dashed rounded-xl bg-card/10">
                  <Flame className="h-6 w-6 mb-2 opacity-50" />
                  <span>No burnout warnings. Workloads and overtime balances are healthy.</span>
                </div>
              ) : (
                <div className="space-y-3">
                  {BURNOUT.map((b) => (
                    <div key={b.name} className="rounded-xl border border-border/60 bg-background/40 p-3">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{b.name}</div>
                        <Badge variant={b.score > 80 ? "destructive" : "secondary"}>{b.score} burnout</Badge>
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                        <div>Overtime: <span className="text-foreground font-medium">{b.overtime}h</span></div>
                        <div>Leave balance: <span className="text-foreground font-medium">{b.leave} days</span></div>
                      </div>
                      <Progress value={b.score} className="mt-2 h-1.5" />
                    </div>
                  ))}
                </div>
              )}
            </Panel>

            <Panel title="Attendance Insights" icon={CheckCircle2} accent="from-sky-500/20 to-indigo-500/10" className="lg:col-span-2">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {ATTENDANCE_INSIGHTS.map((a) => (
                  <div key={a.title} className="rounded-xl border border-border/60 bg-background/40 p-4">
                    <div className="flex items-center gap-2">
                      <ToneDot tone={a.tone} />
                      <div className="text-sm font-medium">{a.title}</div>
                    </div>
                    <div className="mt-2 font-display text-2xl font-semibold">{a.count}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{a.note}</div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>

          {/* Recruitment */}
          <SectionTitle eyebrow="Hiring" title="AI Recruitment Assistant" icon={Briefcase} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <MiniStat label="Open Positions" value="0" hint="across all departments" icon={Briefcase} />
            <MiniStat label="Recommended Candidates" value="0" hint="match score > 80%" icon={UserPlus} />
            <MiniStat label="Pipeline Health" value="Neutral" hint="conversion stable MoM" icon={LineChartIcon} />

            <Panel title="Top Candidate Matches" icon={Target} accent="from-violet-500/20 to-fuchsia-500/10" className="lg:col-span-3">
              {CANDIDATES.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12 text-muted-foreground text-sm border border-dashed rounded-xl bg-card/10">
                  <Target className="h-8 w-8 mb-2 opacity-50" />
                  <span>No active candidate matches. Create a job requisition to start matching.</span>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="py-2 text-left">Candidate</th><th className="text-left">Role</th>
                      <th className="text-left">Resume Match</th><th className="text-left">Interview Readiness</th>
                      <th className="text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {CANDIDATES.map((c) => (
                      <tr key={c.name} className="border-t border-border/60">
                        <td className="py-2.5 font-medium">{c.name}</td>
                        <td className="text-muted-foreground">{c.role}</td>
                        <td className="w-48"><BarMeter value={c.match} /></td>
                        <td className="w-48"><BarMeter value={c.readiness} tone="violet" /></td>
                        <td><Button size="sm" variant="outline">Shortlist</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Panel>
          </div>

          {/* Performance */}
          <SectionTitle eyebrow="Performance" title="AI Performance Insights" icon={Award} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel title="Top Performers" icon={TrendingUp} accent="from-emerald-500/20 to-teal-500/10">
              {PERFORMERS_TOP.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10 text-muted-foreground text-xs border border-dashed rounded-xl bg-card/10">
                  <TrendingUp className="h-6 w-6 mb-2 opacity-50" />
                  <span>No performance data recorded for this cycle yet.</span>
                </div>
              ) : (
                <ul className="space-y-3">
                  {PERFORMERS_TOP.map((p) => (
                    <li key={p.name} className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3">
                      <div>
                        <div className="font-medium">{p.name}</div>
                        <div className="text-xs text-muted-foreground">{p.dept}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">{p.growth} growth</Badge>
                        <div className="font-display text-lg font-semibold">{p.score}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Needs Support" icon={GraduationCap} accent="from-amber-500/20 to-orange-500/10">
              {PERFORMERS_SUPPORT.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10 text-muted-foreground text-xs border border-dashed rounded-xl bg-card/10">
                  <GraduationCap className="h-6 w-6 mb-2 opacity-50" />
                  <span>No low performance scores flagged in this cycle.</span>
                </div>
              ) : (
                <ul className="space-y-3">
                  {PERFORMERS_SUPPORT.map((p) => (
                    <li key={p.name} className="rounded-xl border border-border/60 bg-background/40 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.dept}</div>
                        </div>
                        <div className="font-display text-lg font-semibold">{p.score}</div>
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-accent/60 px-2 py-0.5 text-[11px]">
                        <Sparkles className="h-3 w-3" /> AI coaching: {p.coach}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Skill Gap Analysis" icon={Cpu} accent="from-indigo-500/20 to-sky-500/10" className="lg:col-span-2">
              <div className="h-56 flex flex-col items-center justify-center text-muted-foreground text-sm border border-dashed rounded-xl bg-card/10">
                <Cpu className="h-8 w-8 mb-2 opacity-50 animate-pulse" />
                <span>No skill gap data available. Configure core competencies to begin analysis.</span>
              </div>
            </Panel>
          </div>

          {/* Payroll insights */}
          <SectionTitle eyebrow="Payroll" title="AI Payroll Insights" icon={ShieldAlert} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <MiniStat label="Payroll Health" value="100%" hint="No payroll warnings" icon={HeartPulse} />
            <MiniStat label="Savings Opportunities" value="₹ 0" hint="vendor + reimb optimized" icon={TrendingUp} />
            <MiniStat label="Anomalies Detected" value="0" hint="all clear" icon={AlertTriangle} />

            <Panel title="Payroll Alerts" icon={ShieldAlert} accent="from-rose-500/20 to-amber-500/10" className="lg:col-span-2">
              {PAYROLL_ALERTS.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-10 text-muted-foreground text-xs border border-dashed rounded-xl bg-card/10">
                  <Shield className="h-6 w-6 mb-2 opacity-50" />
                  <span>All clear! No payroll anomalies or policy violations detected.</span>
                </div>
              ) : (
                <ul className="space-y-3">
                  {PAYROLL_ALERTS.map((p) => (
                    <li key={p.title} className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
                      <div>
                        <div className="font-medium">{p.title}</div>
                        <div className="text-xs text-muted-foreground">{p.who} · {p.delta}</div>
                      </div>
                      <SeverityBadge severity={p.severity} />
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Payroll Cost Forecast" icon={LineChartIcon} accent="from-sky-500/20 to-indigo-500/10">
              <div className="h-44 flex flex-col items-center justify-center text-muted-foreground text-sm border border-dashed rounded-xl bg-card/10">
                <LineChartIcon className="h-8 w-8 mb-2 opacity-50" />
                <span>Cost forecast will generate as payroll history builds.</span>
              </div>
            </Panel>
          </div>

          {/* Workforce planning */}
          <SectionTitle eyebrow="Planning" title="AI Workforce Planning" icon={Users} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel title="Headcount Forecast" icon={LineChartIcon} accent="from-emerald-500/20 to-sky-500/10">
              <div className="h-56 flex flex-col items-center justify-center text-muted-foreground text-sm border border-dashed rounded-xl bg-card/10">
                <Users className="h-8 w-8 mb-2 opacity-50" />
                <span>No headcount forecast data. Complete employee onboarding to begin.</span>
              </div>
            </Panel>

            <Panel title="Hiring Demand by Dept" icon={BarChart3Like} accent="from-violet-500/20 to-fuchsia-500/10">
              <div className="h-56 flex flex-col items-center justify-center text-muted-foreground text-sm border border-dashed rounded-xl bg-card/10">
                <Briefcase className="h-8 w-8 mb-2 opacity-50" />
                <span>Hiring demand will populate as requisitions are submitted.</span>
              </div>
            </Panel>
          </div>

          {/* Document generator */}
          <SectionTitle eyebrow="Generate" title="AI Document Generator" icon={FileText} />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {DOCUMENTS.map((d) => (
              <button
                key={d.label}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-4 text-left backdrop-blur-xl transition-all hover:border-foreground/20 hover:shadow-glow"
              >
                <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg text-brand-foreground" style={{ background: "var(--gradient-brand)" }}>
                  <d.icon className="h-4 w-4" />
                </div>
                <div className="text-sm font-medium">{d.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">Auto-fill from employee data</div>
                <div className="absolute right-3 top-3 text-[10px] uppercase tracking-wider text-muted-foreground">AI</div>
              </button>
            ))}
          </div>

          {/* Satisfaction trend */}
          <Panel title="Employee Satisfaction Trend" icon={Sparkles} accent="from-sky-500/20 to-violet-500/10">
            <div className="h-48 flex flex-col items-center justify-center text-muted-foreground text-sm border border-dashed rounded-xl bg-card/10">
              <Sparkles className="h-8 w-8 mb-2 opacity-50" />
              <span>Trends will populate as pulse surveys are submitted.</span>
            </div>
          </Panel>
        </div>

        {/* RIGHT RAIL */}
        <aside className="space-y-4">
          <AIChatPanel />

          <Panel title="AI Alerts Center" icon={AlertTriangle} accent="from-rose-500/20 to-amber-500/10">
            {ALERTS.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-8 text-muted-foreground text-xs border border-dashed rounded-xl bg-card/10">
                <AlertTriangle className="h-6 w-6 mb-2 opacity-50" />
                <span>No active alerts or warnings.</span>
              </div>
            ) : (
              <ul className="space-y-2">
                {ALERTS.map((a) => (
                  <li key={a.title} className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent">
                      <a.icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="truncate text-sm font-medium">{a.title}</div>
                        <SeverityBadge severity={a.severity} />
                      </div>
                      <div className="text-xs text-muted-foreground">{a.note}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="AI Recommendations" icon={Sparkles} accent="from-violet-500/20 to-sky-500/10">
            {RECOMMENDATIONS.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-8 text-muted-foreground text-xs border border-dashed rounded-xl bg-card/10">
                <Sparkles className="h-6 w-6 mb-2 opacity-50" />
                <span>No AI recommendations generated yet.</span>
              </div>
            ) : (
              <ul className="space-y-2 text-sm">
                {RECOMMENDATIONS.map((r, i) => (
                  <li key={i} className="flex gap-2 rounded-xl border border-border/60 bg-background/40 p-3">
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-foreground/70" />
                    <span className="text-foreground/90">{r}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Full conversation</div>
            <Link to="/dashboard/payroll/copilot" className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2 text-sm font-medium hover:bg-accent">
              <MessageSquare className="h-4 w-4" /> Open AI Copilot
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}

// ---------------- Sub components ----------------
const chartTooltip = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 10,
  fontSize: 12,
};

function HeroBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="relative mb-6 overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute inset-0 opacity-60" style={{ background: "radial-gradient(60% 80% at 10% 0%, color-mix(in oklab, var(--primary) 25%, transparent), transparent 60%), radial-gradient(50% 80% at 90% 100%, color-mix(in oklab, var(--primary) 15%, transparent), transparent 60%)" }} />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Aurix Intelligence</div>
            <div className="font-display text-lg font-semibold">0 new insights generated this week</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill icon={CheckCircle2}>0 actioned</Pill>
          <Pill icon={AlertTriangle}>0 critical alerts</Pill>
          <Pill icon={TrendingUp}>+0.0 health score</Pill>
        </div>
      </div>
    </motion.div>
  );
}

function Pill({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span>{children}</span>
    </div>
  );
}

function SectionTitle({ eyebrow, title, icon: Icon }: { eyebrow: string; title: string; icon: any }) {
  return (
    <div className="mb-3 mt-2 flex items-center gap-2">
      <div className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-foreground">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{eyebrow}</div>
        <div className="font-display text-base font-semibold tracking-tight">{title}</div>
      </div>
    </div>
  );
}

function KpiCard({ label, score, trend, hint, icon: Icon, invert, delay = 0 }: any) {
  const up = trend >= 0;
  const positive = invert ? !up : up;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 transition-opacity group-hover:opacity-40" style={{ background: "var(--gradient-brand)" }} />
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div className="font-display text-3xl font-semibold tracking-tight">{score}{label === "Attrition Risk" ? "%" : ""}</div>
        <div className={`inline-flex items-center gap-0.5 text-xs font-medium ${positive ? "text-emerald-500" : "text-rose-500"}`}>
          {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(trend)}%
        </div>
      </div>
      <Progress value={Math.min(100, score)} className="mt-3 h-1.5" />
      <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="mt-0.5 h-3 w-3 shrink-0" />
        <span>{hint}</span>
      </div>
    </motion.div>
  );
}

function Panel({ title, icon: Icon, accent, children, className = "" }: { title: string; icon: any; accent?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl ${className}`}>
      {accent ? <div className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${accent} opacity-60`} /> : null}
      <div className="relative flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <Icon className="h-4 w-4 text-foreground/70" />
        <div className="text-sm font-medium">{title}</div>
      </div>
      <div className="relative p-4">{children}</div>
    </div>
  );
}

function MiniStat({ label, value, hint, icon: Icon }: any) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function RiskPill({ score }: { score: number }) {
  const tone = score >= 80 ? "bg-rose-500/15 text-rose-500" : score >= 65 ? "bg-amber-500/15 text-amber-500" : "bg-sky-500/15 text-sky-500";
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${tone}`}>{score}</span>;
}

function ToneDot({ tone }: { tone: string }) {
  const c = tone === "crit" ? "bg-rose-500" : tone === "warn" ? "bg-amber-500" : "bg-sky-500";
  return <span className={`h-2 w-2 rounded-full ${c}`} />;
}

function SeverityBadge({ severity }: { severity: string }) {
  if (severity === "Critical") return <Badge className="bg-rose-500/15 text-rose-500 hover:bg-rose-500/20">Critical</Badge>;
  if (severity === "Medium") return <Badge className="bg-amber-500/15 text-amber-500 hover:bg-amber-500/20">Medium</Badge>;
  return <Badge className="bg-sky-500/15 text-sky-500 hover:bg-sky-500/20">Low</Badge>;
}

function BarMeter({ value, tone = "primary" }: { value: number; tone?: "primary" | "violet" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/60">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: tone === "violet" ? "linear-gradient(90deg,#8b5cf6,#d946ef)" : "var(--gradient-brand)" }} />
      </div>
      <span className="w-9 text-right text-xs font-medium">{value}%</span>
    </div>
  );
}

function BarChart3Like(props: any) {
  // wrapper so import stays tree-shakable; we used LineChartIcon for headcount, this is just a labelled icon
  return <LineChartIcon {...props} />;
}

function AIChatPanel() {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi! I’m Aurix AI. Ask me about attrition, attendance, hiring or payroll." },
  ]);

  function send(value?: string) {
    const t = (value ?? text).trim();
    if (!t) return;
    setText("");
    setMessages((m) => [...m, { role: "user", text: t }]);
    setTimeout(() => {
      setMessages((m) => [...m, { role: "ai", text: mockAnswer(t) }]);
    }, 500);
  }

  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded-lg text-brand-foreground" style={{ background: "var(--gradient-brand)" }}>
            <Brain className="h-3.5 w-3.5" />
          </div>
          <div className="text-sm font-medium">Aurix AI Assistant</div>
        </div>
        <Badge variant="secondary" className="text-[10px]">Beta</Badge>
      </div>

      <div className="max-h-72 space-y-2 overflow-y-auto p-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "bg-foreground text-background" : "bg-accent/70 text-foreground"}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-border/60 p-3">
        <div className="flex flex-wrap gap-1.5">
          {CHAT_EXAMPLES.map((e) => (
            <button key={e} onClick={() => send(e)} className="rounded-full border border-border bg-background/50 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground">
              {e}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(); }} className="flex items-center gap-2">
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask Aurix AI anything..." className="h-9" />
          <Button type="submit" size="sm"><Send className="h-4 w-4" /></Button>
        </form>
      </div>
    </div>
  );
}

function mockAnswer(q: string) {
  const s = q.toLowerCase();
  if (s.includes("leav") || s.includes("attrition")) return "4 employees are flagged at high attrition risk — Aanya Sharma (87), Rohan Mehta (79), Liam Carter (71), Priya Nair (64). Suggested action: schedule retention 1:1s this week.";
  if (s.includes("attendance")) return "This month: 7 frequent late arrivals (mostly Mondays, Engineering) and 4 recurring Friday absences in Support. 2 employees on attendance risk.";
  if (s.includes("promo")) return "Top promotion candidates: Aarav Gupta (96), Lin Wei (94), Noah Bennett (92). All in top quartile for 3 consecutive cycles.";
  if (s.includes("hiring") || s.includes("hire")) return "Forecasted hiring demand next quarter: Engineering +6, Sales +4, Support +3. Recommend opening Staff Engineer and AE roles within 2 weeks.";
  if (s.includes("report") || s.includes("summary")) return "HR Summary: Headcount 335 (+4.7% YoY), Satisfaction 82, Attrition risk 14%, Payroll health 92. 2 critical alerts open.";
  return "Here’s what I found based on your workforce data. Try asking about attrition, attendance, hiring forecast, or payroll anomalies.";
}
