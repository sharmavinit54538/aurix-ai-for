import { createFileRoute, Link } from "@tanstack/react-router";
import { memo, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity, AlertCircle, AlertTriangle, ArrowDownRight, ArrowUpRight, Award, Brain,
  Briefcase, CheckCircle2, Cpu, Download, FileText, Flame, GraduationCap,
  HeartPulse, Inbox, LineChart as LineChartIcon, MessageSquare, RefreshCw, Send, Shield,
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
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchAIInsightsDashboard } from "@/store/aiInsights/aiInsightsThunk";
import {
  selectAIInsightsAlerts,
  selectAIInsightsAttendance,
  selectAIInsightsAttrition,
  selectAIInsightsBurnout,
  selectAIInsightsCandidates,
  selectAIInsightsDocuments,
  selectAIInsightsError,
  selectAIInsightsHeadcountForecast,
  selectAIInsightsHiringDemand,
  selectAIInsightsKPIs,
  selectAIInsightsLoading,
  selectAIInsightsPayroll,
  selectAIInsightsPayrollAlerts,
  selectAIInsightsPayrollTrend,
  selectAIInsightsRecruitment,
  selectAIInsightsRecommendations,
  selectAIInsightsSatisfactionTrend,
  selectAIInsightsSkillGap,
  selectAIInsightsSummary,
  selectAIInsightsSupportPerformers,
  selectAIInsightsTopPerformers,
} from "@/store/aiInsights/aiInsightsSelectors";
import type {
  AlertItem,
  AttendanceInsightItem,
  AttritionItem,
  BurnoutItem,
  CandidateMatchItem,
  DocumentItem,
  KpiItem,
  PayrollAlertItem,
  SummaryData,
  SupportPerformerItem,
  TopPerformerItem,
} from "@/store/aiInsights/aiInsightsTypes";

export const Route = createFileRoute("/dashboard/ai-insights")({
  head: () => ({
    meta: [
      { title: "AI Insights — Aurix" },
      { name: "description", content: "AI-powered workforce intelligence and automation for your organization." },
    ],
  }),
  component: AIInsightsPage,
});

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  HeartPulse,
  Sparkles,
  UserMinus,
  Zap,
  CheckCircle2,
  Briefcase,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Shield,
  TrendingUp,
  Target,
  GraduationCap,
  Cpu,
  Users,
  LineChart: LineChartIcon,
};

function getIconComponent(name?: string, fallback: React.ComponentType<{ className?: string }> = Brain) {
  if (!name) return fallback;
  return ICON_MAP[name] ?? fallback;
}

// ---------------- Page Component ----------------
export function AIInsightsPage() {
  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectAIInsightsLoading);
  const error = useAppSelector(selectAIInsightsError);
  const summary = useAppSelector(selectAIInsightsSummary);
  const kpis = useAppSelector(selectAIInsightsKPIs);
  const attrition = useAppSelector(selectAIInsightsAttrition);
  const burnout = useAppSelector(selectAIInsightsBurnout);
  const attendance = useAppSelector(selectAIInsightsAttendance);
  const recruitment = useAppSelector(selectAIInsightsRecruitment);
  const candidates = useAppSelector(selectAIInsightsCandidates);
  const topPerformers = useAppSelector(selectAIInsightsTopPerformers);
  const supportPerformers = useAppSelector(selectAIInsightsSupportPerformers);
  const skillGap = useAppSelector(selectAIInsightsSkillGap);
  const payroll = useAppSelector(selectAIInsightsPayroll);
  const payrollAlerts = useAppSelector(selectAIInsightsPayrollAlerts);
  const payrollTrend = useAppSelector(selectAIInsightsPayrollTrend);
  const headcountForecast = useAppSelector(selectAIInsightsHeadcountForecast);
  const hiringDemand = useAppSelector(selectAIInsightsHiringDemand);
  const satisfactionTrend = useAppSelector(selectAIInsightsSatisfactionTrend);
  const alerts = useAppSelector(selectAIInsightsAlerts);
  const recommendations = useAppSelector(selectAIInsightsRecommendations);
  const documents = useAppSelector(selectAIInsightsDocuments);

  useEffect(() => {
    dispatch(fetchAIInsightsDashboard());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchAIInsightsDashboard());
  };

  const hasData = useMemo(() => {
    return Boolean(
      (Array.isArray(kpis) && kpis.length > 0) ||
      (Array.isArray(attrition) && attrition.length > 0) ||
      (Array.isArray(burnout) && burnout.length > 0) ||
      (Array.isArray(attendance) && attendance.length > 0) ||
      (Array.isArray(candidates) && candidates.length > 0) ||
      (Array.isArray(topPerformers) && topPerformers.length > 0) ||
      (Array.isArray(recommendations) && recommendations.length > 0) ||
      (Array.isArray(alerts) && alerts.length > 0) ||
      summary !== null
    );
  }, [kpis, attrition, burnout, attendance, candidates, topPerformers, recommendations, alerts, summary]);

  return (
    <>
      <PageHeader
        title="AI Insights"
        description="AI-powered workforce intelligence and automation for your organization."
        actions={
          <>
            <Button variant="outline" onClick={handleRetry} disabled={loading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export Report</Button>
            <Button variant="outline"><MessageSquare className="mr-2 h-4 w-4" />Ask AI</Button>
            <Button onClick={handleRetry} disabled={loading}>
              <Wand2 className="mr-2 h-4 w-4" />Generate Insights
            </Button>
          </>
        }
      />

      {error ? (
        <ErrorBanner message={error} onRetry={handleRetry} />
      ) : null}

      {loading && !hasData ? (
        <LoadingSkeletonView />
      ) : (
        <>
          <HeroBanner summary={summary} />

          <SectionTitle eyebrow="Overview" title="AI Workforce KPIs" icon={Activity} />
          {kpis.length === 0 ? (
            <EmptySection message="No KPI metrics currently available." />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {kpis.map((k, i) => (
                <KpiCard key={k.label} kpi={k} delay={i * 0.04} />
              ))}
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
            <div className="space-y-8">
              {/* Workforce analytics */}
              <SectionTitle eyebrow="Workforce" title="AI Workforce Analytics" icon={Brain} />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Panel title="Attrition Prediction" icon={UserMinus} accent="from-rose-500/20 to-orange-500/10">
                  {attrition.length === 0 ? (
                    <EmptySection message="No attrition risk predictions found." />
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                          <th className="py-2 text-left">Employee</th>
                          <th className="text-left">Risk</th>
                          <th className="text-left">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {attrition.map((a) => (
                          <tr key={a.name} className="border-t border-border/60 align-top">
                            <td className="py-2.5 pr-2">
                              <div className="font-medium">{a.name}</div>
                              <div className="text-xs text-muted-foreground">{a.dept}</div>
                            </td>
                            <td className="pr-2"><RiskPill score={a.risk} /></td>
                            <td className="text-xs text-muted-foreground">
                              {a.reason}
                              {a.action ? (
                                <div className="mt-1 inline-flex items-center gap-1 rounded-md bg-accent/60 px-2 py-0.5 text-[11px] text-foreground">
                                  <Sparkles className="h-3 w-3" /> {a.action}
                                </div>
                              ) : null}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </Panel>

                <Panel title="Burnout Detection" icon={Flame} accent="from-amber-500/20 to-rose-500/10">
                  {burnout.length === 0 ? (
                    <EmptySection message="No burnout warnings detected." />
                  ) : (
                    <div className="space-y-3">
                      {burnout.map((b) => (
                        <div key={b.name} className="rounded-xl border border-border/60 bg-background/40 p-3">
                          <div className="flex items-center justify-between">
                            <div className="font-medium">{b.name}</div>
                            <Badge variant={b.score > 80 ? "destructive" : "secondary"}>{b.score} burnout</Badge>
                          </div>
                          <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                            <div>Overtime: <span className="font-medium text-foreground">{b.overtime}h</span></div>
                            <div>Leave balance: <span className="font-medium text-foreground">{b.leave} days</span></div>
                          </div>
                          <Progress value={b.score} className="mt-2 h-1.5" />
                        </div>
                      ))}
                    </div>
                  )}
                </Panel>

                <Panel title="Attendance Insights" icon={CheckCircle2} accent="from-sky-500/20 to-indigo-500/10" className="lg:col-span-2">
                  {attendance.length === 0 ? (
                    <EmptySection message="No attendance insight alerts recorded." />
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {attendance.map((a) => (
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
                  )}
                </Panel>
              </div>

              {/* Recruitment */}
              <SectionTitle eyebrow="Hiring" title="AI Recruitment Assistant" icon={Briefcase} />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <MiniStat
                  label="Open Positions"
                  value={recruitment?.openPositions != null ? String(recruitment.openPositions) : "—"}
                  hint="across active departments"
                  icon={Briefcase}
                />
                <MiniStat
                  label="Recommended Candidates"
                  value={recruitment?.recommendedCandidatesCount != null ? String(recruitment.recommendedCandidatesCount) : "—"}
                  hint="match score > 80%"
                  icon={UserPlus}
                />
                <MiniStat
                  label="Pipeline Health"
                  value={recruitment?.pipelineHealth ?? "N/A"}
                  hint="active hiring pipeline"
                  icon={LineChartIcon}
                />

                <Panel title="Top Candidate Matches" icon={Target} accent="from-violet-500/20 to-fuchsia-500/10" className="lg:col-span-3">
                  {candidates.length === 0 ? (
                    <EmptySection message="No recommended candidate matches available." />
                  ) : (
                    <table className="w-full text-sm">
                      <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                        <tr>
                          <th className="py-2 text-left">Candidate</th>
                          <th className="text-left">Role</th>
                          <th className="text-left">Resume Match</th>
                          <th className="text-left">Interview Readiness</th>
                          <th className="text-left"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {candidates.map((c) => (
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
                  {topPerformers.length === 0 ? (
                    <EmptySection message="No top performers listed." />
                  ) : (
                    <ul className="space-y-3">
                      {topPerformers.map((p) => (
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
                  {supportPerformers.length === 0 ? (
                    <EmptySection message="No performers requiring support flagged." />
                  ) : (
                    <ul className="space-y-3">
                      {supportPerformers.map((p) => (
                        <li key={p.name} className="rounded-xl border border-border/60 bg-background/40 p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{p.name}</div>
                              <div className="text-xs text-muted-foreground">{p.dept}</div>
                            </div>
                            <div className="font-display text-lg font-semibold">{p.score}</div>
                          </div>
                          {p.coach ? (
                            <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-accent/60 px-2 py-0.5 text-[11px]">
                              <Sparkles className="h-3 w-3" /> AI coaching: {p.coach}
                            </div>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </Panel>

                <Panel title="Skill Gap Analysis" icon={Cpu} accent="from-indigo-500/20 to-sky-500/10" className="lg:col-span-2">
                  {skillGap.length === 0 ? (
                    <EmptySection message="No skill gap data available." />
                  ) : (
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={skillGap}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                          <XAxis dataKey="skill" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip contentStyle={chartTooltip} />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Bar dataKey="have" name="Current" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                          <Bar dataKey="need" name="Target" fill="hsl(var(--muted-foreground))" radius={[6, 6, 0, 0]} opacity={0.5} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </Panel>
              </div>

              {/* Payroll insights */}
              <SectionTitle eyebrow="Payroll" title="AI Payroll Insights" icon={ShieldAlert} />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <MiniStat
                  label="Payroll Health"
                  value={payroll?.payrollHealth != null ? String(payroll.payrollHealth) : "—"}
                  hint="payroll score"
                  icon={HeartPulse}
                />
                <MiniStat
                  label="Savings Opportunities"
                  value={payroll?.savingsOpportunities ?? "—"}
                  hint="vendor + reimb optimization"
                  icon={TrendingUp}
                />
                <MiniStat
                  label="Anomalies Detected"
                  value={payroll?.anomaliesDetected != null ? String(payroll.anomaliesDetected) : "—"}
                  hint="flagged anomalies"
                  icon={AlertTriangle}
                />

                <Panel title="Payroll Alerts" icon={ShieldAlert} accent="from-rose-500/20 to-amber-500/10" className="lg:col-span-2">
                  {payrollAlerts.length === 0 ? (
                    <EmptySection message="No active payroll alerts." />
                  ) : (
                    <ul className="space-y-3">
                      {payrollAlerts.map((p) => (
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
                  {payrollTrend.length === 0 ? (
                    <EmptySection message="No payroll forecast trend data." />
                  ) : (
                    <div className="h-44">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={payrollTrend}>
                          <defs>
                            <linearGradient id="cost" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                          <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip contentStyle={chartTooltip} />
                          <Area type="monotone" dataKey="cost" stroke="hsl(var(--primary))" fill="url(#cost)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </Panel>
              </div>

              {/* Workforce planning */}
              <SectionTitle eyebrow="Planning" title="AI Workforce Planning" icon={Users} />
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Panel title="Headcount Forecast" icon={LineChartIcon} accent="from-emerald-500/20 to-sky-500/10">
                  {headcountForecast.length === 0 ? (
                    <EmptySection message="No headcount forecast available." />
                  ) : (
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={headcountForecast}>
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <Tooltip contentStyle={chartTooltip} />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Line type="monotone" dataKey="current" name="Actual" stroke="hsl(var(--foreground))" strokeWidth={2} dot={false} />
                          <Line type="monotone" dataKey="forecast" name="AI Forecast" stroke="hsl(var(--primary))" strokeWidth={2} strokeDasharray="5 4" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </Panel>

                <Panel title="Hiring Demand by Dept" icon={Briefcase} accent="from-violet-500/20 to-fuchsia-500/10">
                  {hiringDemand.length === 0 ? (
                    <EmptySection message="No department hiring demand data." />
                  ) : (
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={hiringDemand} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                          <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                          <YAxis dataKey="dept" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={90} />
                          <Tooltip contentStyle={chartTooltip} />
                          <Legend wrapperStyle={{ fontSize: 12 }} />
                          <Bar dataKey="open" name="Open" fill="hsl(var(--muted-foreground))" opacity={0.55} radius={[0, 6, 6, 0]} />
                          <Bar dataKey="demand" name="AI Demand" fill="hsl(var(--primary))" radius={[0, 6, 6, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </Panel>
              </div>

              {/* Document generator */}
              <SectionTitle eyebrow="Generate" title="AI Document Generator" icon={FileText} />
              {documents.length === 0 ? (
                <EmptySection message="No AI document templates configured." />
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {documents.map((d) => (
                    <DocumentCard key={d.label} document={d} />
                  ))}
                </div>
              )}

              {/* Satisfaction trend */}
              <Panel title="Employee Satisfaction Trend" icon={Sparkles} accent="from-sky-500/20 to-violet-500/10">
                {satisfactionTrend.length === 0 ? (
                  <EmptySection message="No satisfaction trend points available." />
                ) : (
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={satisfactionTrend}>
                        <defs>
                          <linearGradient id="sat" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                        <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
                        <Tooltip contentStyle={chartTooltip} />
                        <Area type="monotone" dataKey="s" name="Score" stroke="hsl(var(--primary))" fill="url(#sat)" strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Panel>
            </div>

            {/* RIGHT RAIL */}
            <aside className="space-y-4">
              <AIChatPanel recommendations={recommendations} />

              <Panel title="AI Alerts Center" icon={AlertTriangle} accent="from-rose-500/20 to-amber-500/10">
                {alerts.length === 0 ? (
                  <EmptySection message="No active AI alerts." />
                ) : (
                  <ul className="space-y-2">
                    {alerts.map((a) => {
                      const IconComp = getIconComponent(a.icon, AlertTriangle);
                      return (
                        <li key={a.title} className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
                          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-accent">
                            <IconComp className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <div className="truncate text-sm font-medium">{a.title}</div>
                              <SeverityBadge severity={a.severity} />
                            </div>
                            <div className="text-xs text-muted-foreground">{a.note}</div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Panel>

              <Panel title="AI Recommendations" icon={Sparkles} accent="from-violet-500/20 to-sky-500/10">
                {recommendations.length === 0 ? (
                  <EmptySection message="No recommendations available." />
                ) : (
                  <ul className="space-y-2 text-sm">
                    {recommendations.map((r, i) => (
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
      )}
    </>
  );
}

// ---------------- Sub Components ----------------
const chartTooltip = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: 10,
  fontSize: 12,
};

const ErrorBanner = memo(function ErrorBanner({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="mb-6 flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-500">
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5 shrink-0" />
        <div>
          <div className="font-semibold">Failed to load AI Insights</div>
          <div className="text-xs opacity-90">{message}</div>
        </div>
      </div>
      <Button variant="outline" size="sm" onClick={onRetry} className="border-rose-500/30 hover:bg-rose-500/20">
        <RefreshCw className="mr-2 h-3.5 w-3.5" /> Retry
      </Button>
    </div>
  );
});

const EmptySection = memo(function EmptySection({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 p-6 text-center text-muted-foreground">
      <Inbox className="mb-2 h-6 w-6 stroke-1 text-muted-foreground/60" />
      <div className="text-xs font-medium">{message}</div>
    </div>
  );
});

const HeroBanner = memo(function HeroBanner({ summary }: { summary: SummaryData | null }) {
  const total = summary?.totalInsights ?? 0;
  const actioned = summary?.actionedCount ?? 0;
  const critical = summary?.criticalAlertsCount ?? 0;
  const delta = summary?.healthScoreDelta ?? 0;

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
            <div className="font-display text-lg font-semibold">{total} new insights generated</div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill icon={CheckCircle2}>{actioned} actioned</Pill>
          <Pill icon={AlertTriangle}>{critical} critical alerts</Pill>
          <Pill icon={TrendingUp}>{delta >= 0 ? `+${delta}` : delta} health score</Pill>
        </div>
      </div>
    </motion.div>
  );
});

function Pill({ icon: Icon, children }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span>{children}</span>
    </div>
  );
}

const SectionTitle = memo(function SectionTitle({ eyebrow, title, icon: Icon }: { eyebrow: string; title: string; icon: React.ComponentType<{ className?: string }> }) {
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
});

const KpiCard = memo(function KpiCard({ kpi, delay = 0 }: { kpi: KpiItem; delay?: number }) {
  const Icon = getIconComponent(kpi.icon, HeartPulse);
  const up = kpi.trend >= 0;
  const positive = kpi.invert ? !up : up;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 transition-opacity group-hover:opacity-40" style={{ background: "var(--gradient-brand)" }} />
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{kpi.label}</div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 flex items-end justify-between">
        <div className="font-display text-3xl font-semibold tracking-tight">{kpi.score}{kpi.label?.toLowerCase().includes("risk") ? "%" : ""}</div>
        <div className={`inline-flex items-center gap-0.5 text-xs font-medium ${positive ? "text-emerald-500" : "text-rose-500"}`}>
          {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
          {Math.abs(kpi.trend)}%
        </div>
      </div>
      <Progress value={Math.min(100, Math.max(0, kpi.score))} className="mt-3 h-1.5" />
      <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
        <Sparkles className="mt-0.5 h-3 w-3 shrink-0" />
        <span>{kpi.hint}</span>
      </div>
    </motion.div>
  );
});

const Panel = memo(function Panel({ title, icon: Icon, accent, children, className = "" }: { title: string; icon: React.ComponentType<{ className?: string }>; accent?: string; children: React.ReactNode; className?: string }) {
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
});

const MiniStat = memo(function MiniStat({ label, value, hint, icon: Icon }: { label: string; value: string; hint: string; icon: React.ComponentType<{ className?: string }> }) {
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
});

const DocumentCard = memo(function DocumentCard({ document }: { document: DocumentItem }) {
  const Icon = getIconComponent(document.type, FileText);
  return (
    <button
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-4 text-left backdrop-blur-xl transition-all hover:border-foreground/20 hover:shadow-glow"
    >
      <div className="mb-3 grid h-9 w-9 place-items-center rounded-lg text-brand-foreground" style={{ background: "var(--gradient-brand)" }}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-sm font-medium">{document.label}</div>
      <div className="mt-1 text-xs text-muted-foreground">Auto-fill from employee data</div>
      <div className="absolute right-3 top-3 text-[10px] uppercase tracking-wider text-muted-foreground">AI</div>
    </button>
  );
});

const RiskPill = memo(function RiskPill({ score }: { score: number }) {
  const tone = score >= 80 ? "bg-rose-500/15 text-rose-500" : score >= 65 ? "bg-amber-500/15 text-amber-500" : "bg-sky-500/15 text-sky-500";
  return <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${tone}`}>{score}</span>;
});

const ToneDot = memo(function ToneDot({ tone }: { tone: string }) {
  const c = tone === "crit" ? "bg-rose-500" : tone === "warn" ? "bg-amber-500" : "bg-sky-500";
  return <span className={`h-2 w-2 rounded-full ${c}`} />;
});

const SeverityBadge = memo(function SeverityBadge({ severity }: { severity: string }) {
  if (severity === "Critical") return <Badge className="bg-rose-500/15 text-rose-500 hover:bg-rose-500/20">Critical</Badge>;
  if (severity === "Medium") return <Badge className="bg-amber-500/15 text-amber-500 hover:bg-amber-500/20">Medium</Badge>;
  return <Badge className="bg-sky-500/15 text-sky-500 hover:bg-sky-500/20">Low</Badge>;
});

const BarMeter = memo(function BarMeter({ value, tone = "primary" }: { value: number; tone?: "primary" | "violet" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/60">
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, value))}%`, background: tone === "violet" ? "linear-gradient(90deg,#8b5cf6,#d946ef)" : "var(--gradient-brand)" }} />
      </div>
      <span className="w-9 text-right text-xs font-medium">{value}%</span>
    </div>
  );
});

const AIChatPanel = memo(function AIChatPanel({ recommendations }: { recommendations: string[] }) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hi! I’m Aurix AI. Ask me about workforce metrics, attrition, burnout, or hiring forecasts." },
  ]);

  const examples = useMemo(() => {
    if (Array.isArray(recommendations) && recommendations.length > 0) {
      return recommendations.slice(0, 4);
    }
    return [];
  }, [recommendations]);

  function send(value?: string) {
    const t = (value ?? text).trim();
    if (!t) return;
    setText("");
    setMessages((m) => [...m, { role: "user", text: t }]);
    setMessages((m) => [...m, { role: "ai", text: `Querying workforce intelligence backend for: "${t}"...` }]);
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
        <Badge variant="secondary" className="text-[10px]">Live</Badge>
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
          {examples.map((e, idx) => (
            <button key={idx} onClick={() => send(e)} className="truncate max-w-[280px] rounded-full border border-border bg-background/50 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground">
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
});

// ---------------- Loading Skeletons ----------------
function LoadingSkeletonView() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl lg:col-span-2" />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-28 rounded-2xl" />
            <Skeleton className="h-64 rounded-2xl lg:col-span-3" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
