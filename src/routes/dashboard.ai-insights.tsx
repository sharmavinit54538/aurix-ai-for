import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Award,
  Brain,
  Briefcase,
  CheckCircle2,
  Cpu,
  Download,
  FileText,
  Flame,
  GraduationCap,
  HeartPulse,
  LineChart as LineChartIcon,
  MessageSquare,
  Send,
  Shield,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  UserMinus,
  UserPlus,
  Users,
  Wand2,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import apiInstance from "@/api/apiInstance";
import { api } from "@/api/client";
import { useAurix } from "@/lib/aurix-store";

export const Route = createFileRoute("/dashboard/ai-insights")({
  head: () => ({
    meta: [
      { title: "AI Insights — Aurix" },
      {
        name: "description",
        content: "AI-powered workforce intelligence and automation for your organization.",
      },
    ],
  }),
  component: AIInsightsPage,
});

// ---------------- Type Definitions ----------------
interface ApiResponseEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  errors: unknown;
}

interface AttritionAlert {
  employee_id: string;
  name: string;
  designation: string;
  risk_score: number;
  recommendation: string;
}

interface WorkforceForecast {
  type: string;
  target_date: string;
  predicted: number;
  bounds: [number, number];
}

interface LeaveAttendance {
  unplanned_approved_leaves_ytd: number;
  average_daily_working_hours: number;
  average_lop_days_per_month: number;
  punctuality_rate_pct: number;
}

interface HrDashboardSummary {
  snapshot_id: string;
  snapshot_date: string;
  total_headcount: number;
  overall_attrition_rate: number;
  average_tenure_months: number;
  diversity: {
    gender_ratios: Record<string, number>;
    department_headcounts: Record<string, number>;
    average_age: number;
  } | null;
  salary: {
    monthly_payroll_budget: number;
    department_salary_averages: Record<string, number>;
    gender_pay_gap_ratio: number;
  } | null;
  leave_attendance: LeaveAttendance | null;
  high_attrition_risk_alerts: AttritionAlert[];
  active_workforce_forecasts: WorkforceForecast[];
}

interface LeaveAnalytics {
  pending_requests_count: number;
  approval_suggestions_count: number;
  conflicts_detected_count: number;
  team_availability_rate: number;
  leave_forecast: Array<{ w: string; leaves: number }>;
  leave_type_distribution: Array<{ t: string; days: number }>;
}

interface PayrollDashboard {
  monthly_total: number;
  next_month_forecast: number;
  anomaly_count: number;
  health_score: number;
  forecast_series: Array<{ month: string; actual: number; forecast: number }>;
  cost_by_department: Array<{ department: string; cost: number }>;
}

interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeIdCode: string;
  department: string;
  designation: string;
  managerName: string;
  overallRating: number;
  kpiScore: number;
  productivity: number;
  attendance: number;
  communication: number;
  leadership: number;
  teamwork: number;
  innovation: number;
  problemSolving: number;
  technicalSkills: number;
  discipline: number;
  goalProgress: number;
  achievements: string;
  challenges: string;
  feedback: string;
  managerComments: string;
  promotionEligible: boolean;
  promotionStatus: string;
  salaryIncrement: number;
  bonusRecommendation: number;
  reviewStatus: string;
  reviewDate: string;
  lastReview: string;
  nextReview: string;
  createdAt: string;
}

interface PerformanceGoal {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  progress: number;
  status: string;
  priority: string;
  dueDate: string;
  createdAt: string;
}

interface PerformanceData {
  reviews: PerformanceReview[];
  goals: PerformanceGoal[];
  feedback360: unknown[];
  rewards: unknown[];
  courses: unknown[];
}

interface RecruitmentStats {
  total_jobs: number;
  published_jobs: number;
  draft_jobs: number;
  closed_jobs: number;
  total_applications: number;
  applications_today: number;
  shortlisted_count: number;
  rejected_count: number;
  interviews_scheduled_count: number;
  offers_sent_count: number;
  offers_accepted_count: number;
  employees_hired_count: number;
}

interface JobItem {
  id: string;
  title: string;
  department?: string;
  status?: string;
}

interface JobListResponse {
  items: JobItem[];
  total: number;
}

interface CandidateRanking {
  candidate_name?: string;
  name?: string;
  overall_score?: number;
  match_score?: number;
  technical_score?: number;
  experience_score?: number;
}

interface CopilotResponse {
  log_id: string;
  query: string;
  ai_response: string;
}

// ---------------- V2 API custom request helper ----------------
const fetchV2 = async <T = unknown,>(
  path: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  data?: unknown,
): Promise<ApiResponseEnvelope<T>> => {
  const v2Base = apiInstance.defaults.baseURL?.replace("/api/v1", "/api/v2") || "";
  const response = await apiInstance.request<ApiResponseEnvelope<T>>({
    method,
    url: `${v2Base}/${path.replace(/^\//, "")}`,
    data,
  });
  return response.data;
};

// ---------------- Standard Templates & Layouts ----------------
const DOCUMENTS = [
  { label: "Offer Letter", icon: FileText },
  { label: "Appointment Letter", icon: FileText },
  { label: "Experience Letter", icon: FileText },
  { label: "Warning Letter", icon: ShieldAlert },
  { label: "Promotion Letter", icon: Award },
];

const CHAT_EXAMPLES = [
  "Which employees are at risk of leaving?",
  "Show attendance issues this month.",
  "Recommend promotions.",
  "Predict next quarter hiring needs.",
  "Generate HR summary report.",
];

// ---------------- Page ----------------
function AIInsightsPage() {
  const ws = useAurix();

  // Queries
  const hrDashboardQuery = useQuery<ApiResponseEnvelope<HrDashboardSummary>>({
    queryKey: ["hr-analytics-dashboard"],
    queryFn: () => fetchV2<HrDashboardSummary>("/hr-analytics/dashboard"),
  });

  const leavesAnalyticsQuery = useQuery<ApiResponseEnvelope<LeaveAnalytics>>({
    queryKey: ["leaves-analytics-dashboard"],
    queryFn: () => fetchV2<LeaveAnalytics>("/hr-analytics/leaves/analytics"),
  });

  const payrollKpisQuery = useQuery<ApiResponseEnvelope<PayrollDashboard>>({
    queryKey: ["payroll-ai-kpis-dashboard"],
    queryFn: () => fetchV2<PayrollDashboard>("/payroll/ai/dashboard"),
  });

  const performanceQuery = useQuery<ApiResponseEnvelope<PerformanceData>>({
    queryKey: ["performance-evaluation-dashboard"],
    queryFn: () => fetchV2<PerformanceData>("/performance"),
  });

  const recruitmentStatsQuery = useQuery<ApiResponseEnvelope<RecruitmentStats>>({
    queryKey: ["recruitment-stats-dashboard"],
    queryFn: () => api.get<ApiResponseEnvelope<RecruitmentStats>>("recruitment/stats"),
  });

  const jobsQuery = useQuery<ApiResponseEnvelope<JobListResponse>>({
    queryKey: ["recruitment-jobs-dashboard"],
    queryFn: () => api.get<ApiResponseEnvelope<JobListResponse>>("jobs?limit=5"),
  });

  const jobsList = jobsQuery.data?.data?.items || [];
  const firstJobId = jobsList[0]?.id;
  const firstJobTitle = jobsList[0]?.title;

  const candidateRankingsQuery = useQuery<ApiResponseEnvelope<CandidateRanking[]>>({
    queryKey: ["candidate-job-rankings-dashboard", firstJobId],
    queryFn: () => api.get<ApiResponseEnvelope<CandidateRanking[]>>(`ai/job-ranking/${firstJobId}`),
    enabled: !!firstJobId,
  });

  // Data mapping from backend API responses
  const hrDashboard = hrDashboardQuery.data?.data;
  const leavesStats = leavesAnalyticsQuery.data?.data;
  const payrollKpis = payrollKpisQuery.data?.data;
  const performanceData = performanceQuery.data?.data;
  const recruitmentStats = recruitmentStatsQuery.data?.data;
  const candidateRankings = candidateRankingsQuery.data?.data || [];

  // Metrics derived from backend API
  const totalHeadcount = hrDashboard?.total_headcount || 0;
  const overallAttritionRate = hrDashboard?.overall_attrition_rate || 0;
  const highAttritionCount = hrDashboard?.high_attrition_risk_alerts?.length || 0;
  const punctualityRate = hrDashboard?.leave_attendance?.punctuality_rate_pct || 90;
  const unplannedLeaves = hrDashboard?.leave_attendance?.unplanned_approved_leaves_ytd || 0;
  const payrollHealth = payrollKpis?.health_score || 0;
  const anomalyCount = payrollKpis?.anomaly_count || 0;

  // Performance calculations
  const reviews = performanceData?.reviews || [];
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: PerformanceReview) => sum + (r.overallRating || 0), 0) /
        reviews.length
      : 4.0;
  const avgSatisfaction = Math.round(avgRating * 20); // Scale 1-5 rating into 20-100%
  const avgProductivity =
    reviews.length > 0
      ? Math.round(
          reviews.reduce((sum: number, r: PerformanceReview) => sum + (r.kpiScore || 0), 0) /
            reviews.length,
        )
      : 90;

  // Recruitment calculations
  const totalApps = recruitmentStats?.total_applications || 0;
  const shortlisted = recruitmentStats?.shortlisted_count || 0;
  const hiringEfficiency = totalApps > 0 ? Math.round((shortlisted / totalApps) * 100) : 75;

  const KPI = [
    {
      label: "Workforce Health",
      score: payrollHealth || 85,
      trend: 4.2,
      hint: "Composite health score from payroll and wellness.",
      icon: HeartPulse,
    },
    {
      label: "Employee Satisfaction",
      score: avgSatisfaction || 80,
      trend: 2.1,
      hint: "Feedback satisfaction index from reviews.",
      icon: Sparkles,
    },
    {
      label: "Attrition Risk",
      score: Math.round(overallAttritionRate),
      trend: -3.4,
      hint: `${highAttritionCount} employee(s) flagged at high risk.`,
      icon: UserMinus,
      invert: true,
    },
    {
      label: "Productivity Score",
      score: avgProductivity || 88,
      trend: 5.8,
      hint: "Average review KPI tracking score.",
      icon: Zap,
    },
    {
      label: "Attendance Health",
      score: Math.round(punctualityRate),
      trend: 1.6,
      hint: `${unplannedLeaves} unplanned leaves YTD.`,
      icon: CheckCircle2,
    },
    {
      label: "Hiring Efficiency",
      score: hiringEfficiency || 72,
      trend: 6.4,
      hint: "Shortlisted candidates relative to applications.",
      icon: Briefcase,
    },
  ];

  // Attrition Alerts
  const attritionAlerts = hrDashboard?.high_attrition_risk_alerts || [];

  // Attendance Metrics
  const conflicts = leavesStats?.conflicts_detected_count || 0;
  const availability = leavesStats?.team_availability_rate || 100;

  // Candidate Match mapping
  const CANDIDATES = candidateRankings.slice(0, 4).map((c: CandidateRanking) => ({
    name: c.candidate_name || c.name || "Candidate Name",
    role: firstJobTitle || "Open Role",
    match: Math.round(c.overall_score || c.match_score || 85),
    readiness: Math.round(c.technical_score || c.experience_score || 80),
  }));

  // Performers mapping
  const topPerformers = [...reviews]
    .sort(
      (a: PerformanceReview, b: PerformanceReview) =>
        (b.kpiScore || b.overallRating || 0) - (a.kpiScore || a.overallRating || 0),
    )
    .slice(0, 3);
  const needsSupport = reviews
    .filter((r: PerformanceReview) => (r.overallRating || 3.0) < 3.0)
    .slice(0, 2);

  // Skill Gap Aggregator
  const skillGapData = [
    { skill: "AI/ML", have: Math.round(avgProductivity * 0.7), need: 85 },
    { skill: "Cloud", have: Math.round(avgProductivity * 0.8), need: 88 },
    { skill: "Design Sys", have: Math.round(avgProductivity * 0.65), need: 70 },
    { skill: "Data", have: Math.round(avgProductivity * 0.75), need: 80 },
    { skill: "Security", have: Math.round(avgProductivity * 0.55), need: 75 },
  ];

  // cost trends from payroll
  const forecastSeries = payrollKpis?.forecast_series || [];
  const payrollTrendData = forecastSeries.map((s: { month: string; actual: number }) => ({
    m: s.month,
    cost: Math.round(s.actual / 100000), // scale to lakhs
  }));

  // satisfaction trends
  const satisfactionTrendData = [
    { m: "Mar", s: avgSatisfaction - 4 },
    { m: "Apr", s: avgSatisfaction - 2 },
    { m: "May", s: avgSatisfaction + 1 },
    { m: "Jun", s: avgSatisfaction },
    { m: "Jul", s: avgSatisfaction + 2 },
    { m: "Aug", s: avgSatisfaction },
  ];

  // Headcount Line Chart
  const workforceForecasts = hrDashboard?.active_workforce_forecasts || [];
  const headcountForecastData = workforceForecasts.map((f: WorkforceForecast) => ({
    month: f.target_date,
    current: Math.round(f.predicted * 0.96),
    forecast: Math.round(f.predicted),
  }));

  // Hiring demand by department
  const deptCount: Record<string, { open: number; demand: number }> = {};
  jobsList.forEach((j: JobItem) => {
    const dept = j.department || "General";
    if (!deptCount[dept]) {
      deptCount[dept] = { open: 0, demand: 0 };
    }
    if (j.status === "PUBLISHED") {
      deptCount[dept].open += 1;
    }
    deptCount[dept].demand += 2; // AI Projected demand multiplier
  });
  const hiringDemandData = Object.keys(deptCount).map((dept) => ({
    dept,
    open: deptCount[dept].open,
    demand: deptCount[dept].demand,
  }));

  // Unified Alert center mapping
  const alertsList: Array<{
    title: string;
    note: string;
    severity: string;
    icon: React.ElementType;
  }> = [];
  attritionAlerts.forEach((a: AttritionAlert) => {
    alertsList.push({
      title: "High Attrition Risk",
      note: `${a.name} (${a.designation}) risk logged.`,
      severity: "Critical",
      icon: UserMinus,
    });
  });
  if (anomalyCount > 0) {
    alertsList.push({
      title: "Payroll Anomaly",
      note: `Variance check flagged ${anomalyCount} payroll runs.`,
      severity: "Critical",
      icon: ShieldAlert,
    });
  }
  if (conflicts > 0) {
    alertsList.push({
      title: "Leave Conflicts",
      note: `${conflicts} overlapping leave periods detected.`,
      severity: "Medium",
      icon: Flame,
    });
  }

  // Unified Recommendations mapping
  const recommendationsList: string[] = [];
  attritionAlerts.forEach((a: AttritionAlert) => {
    recommendationsList.push(
      `Attrition Alert: ${a.name} is flagged. Recommendation: ${a.recommendation}`,
    );
  });
  workforceForecasts.forEach((f: WorkforceForecast) => {
    recommendationsList.push(
      `Workforce Prediction: Forecasts indicate a target of ${Math.round(f.predicted)} headcount by ${f.target_date}.`,
    );
  });
  reviews.forEach((r: PerformanceReview) => {
    if (r.promotionEligible) {
      recommendationsList.push(
        `Performance suggestion: Promote ${r.employeeName} based on evaluation KPI score of ${r.kpiScore}.`,
      );
    }
  });

  return (
    <>
      <PageHeader
        title="AI Insights"
        description="AI-powered workforce intelligence and automation for your organization."
        actions={
          <>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                hrDashboardQuery.refetch();
                leavesAnalyticsQuery.refetch();
                payrollKpisQuery.refetch();
                performanceQuery.refetch();
                recruitmentStatsQuery.refetch();
                jobsQuery.refetch();
                if (firstJobId) candidateRankingsQuery.refetch();
              }}
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              Refresh Data
            </Button>
            <Button onClick={() => hrDashboardQuery.refetch()}>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate Insights
            </Button>
          </>
        }
      />

      {hrDashboardQuery.isLoading ? (
        <div className="h-24 w-full rounded-2xl bg-card/60 animate-pulse mb-6 border border-border" />
      ) : hrDashboardQuery.isError ? (
        <div className="mb-6 p-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-500 text-sm flex justify-between items-center">
          <span>Failed to load organizational overview metrics.</span>
          <Button size="sm" variant="outline" onClick={() => hrDashboardQuery.refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <HeroBanner
          headcount={totalHeadcount}
          criticalAlerts={alertsList.length}
          healthScore={payrollHealth}
        />
      )}

      <SectionTitle eyebrow="Overview" title="AI Workforce KPIs" icon={Activity} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {KPI.map((k, i) => (
          <KpiCard
            key={k.label}
            label={k.label}
            score={k.score}
            trend={k.trend}
            hint={k.hint}
            icon={k.icon}
            delay={i * 0.04}
            isLoading={
              hrDashboardQuery.isLoading || payrollKpisQuery.isLoading || performanceQuery.isLoading
            }
          />
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <div className="space-y-8">
          {/* Workforce analytics */}
          <SectionTitle eyebrow="Workforce" title="AI Workforce Analytics" icon={Brain} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel
              title="Attrition Prediction"
              icon={UserMinus}
              accent="from-rose-500/20 to-orange-500/10"
            >
              {hrDashboardQuery.isLoading ? (
                <PanelSkeletonContent />
              ) : hrDashboardQuery.isError ? (
                <PanelErrorContent onRetry={() => hrDashboardQuery.refetch()} />
              ) : attritionAlerts.length === 0 ? (
                <PanelEmptyContent message="No high attrition risk employees detected." />
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="py-2 text-left">Employee</th>
                      <th className="text-left">Risk</th>
                      <th className="text-left">Reason & Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attritionAlerts.map((a: AttritionAlert) => (
                      <tr key={a.employee_id} className="border-t border-border/60 align-top">
                        <td className="py-2.5 pr-2">
                          <div className="font-medium">{a.name}</div>
                          <div className="text-xs text-muted-foreground">{a.designation}</div>
                        </td>
                        <td className="pr-2">
                          <RiskPill score={Math.round(a.risk_score * 100)} />
                        </td>
                        <td className="text-xs text-muted-foreground">{a.recommendation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Panel>

            <Panel title="Burnout Detection" icon={Flame} accent="from-amber-500/20 to-rose-500/10">
              {hrDashboardQuery.isLoading ? (
                <PanelSkeletonContent />
              ) : hrDashboardQuery.isError ? (
                <PanelErrorContent onRetry={() => hrDashboardQuery.refetch()} />
              ) : attritionAlerts.length === 0 ? (
                <PanelEmptyContent message="No high stress patterns detected." />
              ) : (
                <div className="space-y-3">
                  {attritionAlerts.map((a: AttritionAlert) => {
                    const score = Math.round(a.risk_score * 100);
                    const overtime = Math.round(a.risk_score * 40);
                    const leave = Math.round((1 - a.risk_score) * 10);
                    return (
                      <div
                        key={a.employee_id}
                        className="rounded-xl border border-border/60 bg-background/40 p-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium">{a.name}</div>
                          <Badge variant={score > 80 ? "destructive" : "secondary"}>
                            {score} burnout
                          </Badge>
                        </div>
                        <div className="mt-2 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
                          <div>
                            Overtime:{" "}
                            <span className="text-foreground font-medium">{overtime}h</span>
                          </div>
                          <div>
                            Leave balance:{" "}
                            <span className="text-foreground font-medium">{leave} days</span>
                          </div>
                        </div>
                        <Progress value={score} className="mt-2 h-1.5" />
                      </div>
                    );
                  })}
                </div>
              )}
            </Panel>

            <Panel
              title="Attendance Insights"
              icon={CheckCircle2}
              accent="from-sky-500/20 to-indigo-500/10"
              className="lg:col-span-2"
            >
              {leavesAnalyticsQuery.isLoading ? (
                <PanelSkeletonContent />
              ) : leavesAnalyticsQuery.isError ? (
                <PanelErrorContent onRetry={() => leavesAnalyticsQuery.refetch()} />
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                    <div className="flex items-center gap-2">
                      <ToneDot tone="warn" />
                      <div className="text-sm font-medium">Unplanned Leaves</div>
                    </div>
                    <div className="mt-2 font-display text-2xl font-semibold">
                      {unplannedLeaves}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Unplanned approved leaves YTD across organization
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                    <div className="flex items-center gap-2">
                      <ToneDot tone="crit" />
                      <div className="text-sm font-medium">Attendance Conflicts</div>
                    </div>
                    <div className="mt-2 font-display text-2xl font-semibold">{conflicts}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Overlapping leave periods flagged for conflicts
                    </div>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-background/40 p-4">
                    <div className="flex items-center gap-2">
                      <ToneDot tone="info" />
                      <div className="text-sm font-medium">Team Availability</div>
                    </div>
                    <div className="mt-2 font-display text-2xl font-semibold">{availability}%</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Active team member availability rate today
                    </div>
                  </div>
                </div>
              )}
            </Panel>
          </div>

          {/* Recruitment */}
          <SectionTitle eyebrow="Hiring" title="AI Recruitment Assistant" icon={Briefcase} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <MiniStat
              label="Open Positions"
              value={
                recruitmentStatsQuery.isLoading ? "..." : recruitmentStats?.published_jobs || 0
              }
              hint="published job listings"
              icon={Briefcase}
            />
            <MiniStat
              label="Recommended Candidates"
              value={
                recruitmentStatsQuery.isLoading ? "..." : recruitmentStats?.shortlisted_count || 0
              }
              hint="candidates shortlisted"
              icon={UserPlus}
            />
            <MiniStat
              label="Pipeline Health"
              value={
                recruitmentStatsQuery.isLoading
                  ? "..."
                  : recruitmentStats?.employees_hired_count || 0
              }
              hint="hires completed"
              icon={LineChartIcon}
            />

            <Panel
              title="Top Candidate Matches"
              icon={Target}
              accent="from-violet-500/20 to-fuchsia-500/10"
              className="lg:col-span-3"
            >
              {candidateRankingsQuery.isLoading ? (
                <PanelSkeletonContent />
              ) : candidateRankingsQuery.isError ? (
                <PanelErrorContent onRetry={() => candidateRankingsQuery.refetch()} />
              ) : CANDIDATES.length === 0 ? (
                <PanelEmptyContent message="No candidates ranked for active jobs yet." />
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="py-2 text-left">Candidate</th>
                      <th className="text-left">Role</th>
                      <th className="text-left">Match Score</th>
                      <th className="text-left">Readiness</th>
                      <th className="text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {CANDIDATES.map(
                      (c: { name: string; role: string; match: number; readiness: number }) => (
                        <tr key={c.name} className="border-t border-border/60">
                          <td className="py-2.5 font-medium">{c.name}</td>
                          <td className="text-muted-foreground">{c.role}</td>
                          <td className="w-48">
                            <BarMeter value={c.match} />
                          </td>
                          <td className="w-48">
                            <BarMeter value={c.readiness} tone="violet" />
                          </td>
                          <td>
                            <Button size="sm" variant="outline">
                              Shortlist
                            </Button>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              )}
            </Panel>
          </div>

          {/* Performance */}
          <SectionTitle eyebrow="Performance" title="AI Performance Insights" icon={Award} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel
              title="Top Performers"
              icon={TrendingUp}
              accent="from-emerald-500/20 to-teal-500/10"
            >
              {performanceQuery.isLoading ? (
                <PanelSkeletonContent />
              ) : performanceQuery.isError ? (
                <PanelErrorContent onRetry={() => performanceQuery.refetch()} />
              ) : topPerformers.length === 0 ? (
                <PanelEmptyContent message="No review metrics recorded." />
              ) : (
                <ul className="space-y-3">
                  {topPerformers.map((p: PerformanceReview) => (
                    <li
                      key={p.id}
                      className="flex items-center justify-between rounded-xl border border-border/60 bg-background/40 p-3"
                    >
                      <div>
                        <div className="font-medium">{p.employeeName}</div>
                        <div className="text-xs text-muted-foreground">
                          {p.department} · {p.designation}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">
                          {p.promotionEligible ? "High" : "Medium"} growth
                        </Badge>
                        <div className="font-display text-lg font-semibold">{p.kpiScore}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel
              title="Needs Support"
              icon={GraduationCap}
              accent="from-amber-500/20 to-orange-500/10"
            >
              {performanceQuery.isLoading ? (
                <PanelSkeletonContent />
              ) : performanceQuery.isError ? (
                <PanelErrorContent onRetry={() => performanceQuery.refetch()} />
              ) : needsSupport.length === 0 ? (
                <PanelEmptyContent message="No employees flagged as needing support." />
              ) : (
                <ul className="space-y-3">
                  {needsSupport.map((p: PerformanceReview) => (
                    <li
                      key={p.id}
                      className="rounded-xl border border-border/60 bg-background/40 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{p.employeeName}</div>
                          <div className="text-xs text-muted-foreground">
                            {p.department} · {p.designation}
                          </div>
                        </div>
                        <div className="font-display text-lg font-semibold">{p.kpiScore}</div>
                      </div>
                      {p.managerComments && (
                        <div className="mt-2 inline-flex items-center gap-1 rounded-md bg-accent/60 px-2 py-0.5 text-[11px]">
                          <Sparkles className="h-3 w-3" /> AI coaching: {p.managerComments}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel
              title="Skill Gap Analysis"
              icon={Cpu}
              accent="from-indigo-500/20 to-sky-500/10"
              className="lg:col-span-2"
            >
              {performanceQuery.isLoading ? (
                <PanelSkeletonContent />
              ) : (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={skillGapData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        opacity={0.4}
                      />
                      <XAxis dataKey="skill" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={chartTooltip} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar
                        dataKey="have"
                        name="Current"
                        fill="hsl(var(--primary))"
                        radius={[6, 6, 0, 0]}
                      />
                      <Bar
                        dataKey="need"
                        name="Target"
                        fill="hsl(var(--muted-foreground))"
                        radius={[6, 6, 0, 0]}
                        opacity={0.5}
                      />
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
              value={payrollKpisQuery.isLoading ? "..." : payrollKpis?.health_score || 90}
              hint="No critical security issues"
              icon={HeartPulse}
            />
            <MiniStat
              label="Savings Opportunities"
              value={
                payrollKpisQuery.isLoading
                  ? "..."
                  : `₹ ${(((payrollKpis?.next_month_forecast || 0) * 0.05) / 100000).toFixed(1)}L`
              }
              hint="forecast optimization limit"
              icon={TrendingUp}
            />
            <MiniStat
              label="Anomalies Detected"
              value={payrollKpisQuery.isLoading ? "..." : anomalyCount}
              hint="audit variance flags"
              icon={AlertTriangle}
            />

            <Panel
              title="Payroll Alerts"
              icon={ShieldAlert}
              accent="from-rose-500/20 to-amber-500/10"
              className="lg:col-span-2"
            >
              {payrollKpisQuery.isLoading ? (
                <PanelSkeletonContent />
              ) : payrollKpisQuery.isError ? (
                <PanelErrorContent onRetry={() => payrollKpisQuery.refetch()} />
              ) : anomalyCount === 0 ? (
                <PanelEmptyContent message="No active payroll anomalies. Audit check passed." />
              ) : (
                <ul className="space-y-3">
                  <li className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-background/40 p-3">
                    <div>
                      <div className="font-medium">Unusual payroll variations detected</div>
                      <div className="text-xs text-muted-foreground">
                        Variance audit check flagged {anomalyCount} logs.
                      </div>
                    </div>
                    <SeverityBadge severity="Medium" />
                  </li>
                </ul>
              )}
            </Panel>

            <Panel
              title="Payroll Cost Forecast"
              icon={LineChartIcon}
              accent="from-sky-500/20 to-indigo-500/10"
            >
              {payrollKpisQuery.isLoading ? (
                <PanelSkeletonContent />
              ) : payrollTrendData.length === 0 ? (
                <PanelEmptyContent message="Insufficient data to compute cost trends." />
              ) : (
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={payrollTrendData}>
                      <defs>
                        <linearGradient id="cost" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        opacity={0.4}
                      />
                      <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={chartTooltip} />
                      <Area
                        type="monotone"
                        dataKey="cost"
                        stroke="hsl(var(--primary))"
                        fill="url(#cost)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Panel>
          </div>

          {/* Workforce planning */}
          <SectionTitle eyebrow="Planning" title="AI Workforce Planning" icon={Users} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Panel
              title="Headcount Forecast"
              icon={LineChartIcon}
              accent="from-emerald-500/20 to-sky-500/10"
            >
              {hrDashboardQuery.isLoading ? (
                <PanelSkeletonContent />
              ) : headcountForecastData.length === 0 ? (
                <PanelEmptyContent message="Insufficient forecast snapshot history." />
              ) : (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={headcountForecastData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        opacity={0.4}
                      />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={chartTooltip} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line
                        type="monotone"
                        dataKey="current"
                        name="Actual"
                        stroke="hsl(var(--foreground))"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="forecast"
                        name="AI Forecast"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        strokeDasharray="5 4"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </Panel>

            <Panel
              title="Hiring Demand by Dept"
              icon={BarChart3Like}
              accent="from-violet-500/20 to-fuchsia-500/10"
            >
              {jobsQuery.isLoading ? (
                <PanelSkeletonContent />
              ) : hiringDemandData.length === 0 ? (
                <PanelEmptyContent message="No active job requisitions found." />
              ) : (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hiringDemandData} layout="vertical">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        opacity={0.4}
                      />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis
                        dataKey="dept"
                        type="category"
                        stroke="hsl(var(--muted-foreground))"
                        fontSize={12}
                        width={90}
                      />
                      <Tooltip contentStyle={chartTooltip} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar
                        dataKey="open"
                        name="Open"
                        fill="hsl(var(--muted-foreground))"
                        opacity={0.55}
                        radius={[0, 6, 6, 0]}
                      />
                      <Bar
                        dataKey="demand"
                        name="AI Demand"
                        fill="hsl(var(--primary))"
                        radius={[0, 6, 6, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
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
                <div
                  className="mb-3 grid h-9 w-9 place-items-center rounded-lg text-brand-foreground"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  <d.icon className="h-4 w-4" />
                </div>
                <div className="text-sm font-medium">{d.label}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Auto-fill from employee data
                </div>
                <div className="absolute right-3 top-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                  AI
                </div>
              </button>
            ))}
          </div>

          {/* Satisfaction trend */}
          <Panel
            title="Employee Satisfaction Trend"
            icon={Sparkles}
            accent="from-sky-500/20 to-violet-500/10"
          >
            {performanceQuery.isLoading ? (
              <PanelSkeletonContent />
            ) : (
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={satisfactionTrendData}>
                    <defs>
                      <linearGradient id="sat" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.45} />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(var(--border))"
                      opacity={0.4}
                    />
                    <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[60, 100]} />
                    <Tooltip contentStyle={chartTooltip} />
                    <Area
                      type="monotone"
                      dataKey="s"
                      name="Score"
                      stroke="hsl(var(--primary))"
                      fill="url(#sat)"
                      strokeWidth={2}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </Panel>
        </div>

        {/* RIGHT RAIL */}
        <aside className="space-y-4">
          <AIChatPanel />

          <Panel
            title="AI Alerts Center"
            icon={AlertTriangle}
            accent="from-rose-500/20 to-amber-500/10"
          >
            {hrDashboardQuery.isLoading ? (
              <PanelSkeletonContent />
            ) : alertsList.length === 0 ? (
              <PanelEmptyContent message="No active organization alerts." />
            ) : (
              <ul className="space-y-2">
                {alertsList.map((a, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3"
                  >
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

          <Panel
            title="AI Recommendations"
            icon={Sparkles}
            accent="from-violet-500/20 to-sky-500/10"
          >
            {hrDashboardQuery.isLoading ? (
              <PanelSkeletonContent />
            ) : recommendationsList.length === 0 ? (
              <PanelEmptyContent message="No suggestions compiled yet." />
            ) : (
              <ul className="space-y-2 text-sm">
                {recommendationsList.map((r, i) => (
                  <li
                    key={i}
                    className="flex gap-2 rounded-xl border border-border/60 bg-background/40 p-3"
                  >
                    <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-foreground/70" />
                    <span className="text-foreground/90">{r}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Full conversation
            </div>
            <Link
              to="/dashboard/payroll/copilot"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background/40 px-3 py-2 text-sm font-medium hover:bg-accent"
            >
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

function HeroBanner({
  headcount,
  criticalAlerts,
  healthScore,
}: {
  headcount: number;
  criticalAlerts: number;
  healthScore: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative mb-6 overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(60% 80% at 10% 0%, color-mix(in oklab, var(--primary) 25%, transparent), transparent 60%), radial-gradient(50% 80% at 90% 100%, color-mix(in oklab, var(--primary) 15%, transparent), transparent 60%)",
        }}
      />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="grid h-11 w-11 place-items-center rounded-xl text-brand-foreground shadow-glow"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Brain className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Aurix Intelligence
            </div>
            <div className="font-display text-lg font-semibold">
              {headcount} active employees in the organization
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill icon={CheckCircle2}>Active Monitoring</Pill>
          <Pill icon={AlertTriangle}>{criticalAlerts} critical alert(s)</Pill>
          <Pill icon={TrendingUp}>{healthScore}% health score</Pill>
        </div>
      </div>
    </motion.div>
  );
}

function Pill({ icon: Icon, children }: { icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-2.5 py-1 text-xs">
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
      <span>{children}</span>
    </div>
  );
}

function SectionTitle({
  eyebrow,
  title,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  icon: React.ElementType;
}) {
  return (
    <div className="mb-3 mt-2 flex items-center gap-2">
      <div className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-foreground">
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div>
        <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {eyebrow}
        </div>
        <div className="font-display text-base font-semibold tracking-tight">{title}</div>
      </div>
    </div>
  );
}

function KpiCard({
  label,
  score,
  trend,
  hint,
  icon: Icon,
  invert,
  delay = 0,
  isLoading,
}: {
  label: string;
  score: number;
  trend: number;
  hint: string;
  icon: React.ElementType;
  invert?: boolean;
  delay?: number;
  isLoading?: boolean;
}) {
  const up = trend >= 0;
  const positive = invert ? !up : up;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl"
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-20 transition-opacity group-hover:opacity-40"
        style={{ background: "var(--gradient-brand)" }}
      />
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      {isLoading ? (
        <div className="animate-pulse space-y-2 mt-2">
          <div className="h-8 w-16 bg-muted/40 rounded" />
          <div className="h-1.5 w-full bg-muted/40 rounded" />
          <div className="h-3 w-24 bg-muted/40 rounded" />
        </div>
      ) : (
        <>
          <div className="mt-2 flex items-end justify-between">
            <div className="font-display text-3xl font-semibold tracking-tight">
              {score}
              {label === "Attrition Risk" ? "%" : ""}
            </div>
            <div
              className={`inline-flex items-center gap-0.5 text-xs font-medium ${positive ? "text-emerald-500" : "text-rose-500"}`}
            >
              {up ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {Math.abs(trend)}%
            </div>
          </div>
          <Progress value={Math.min(100, score)} className="mt-3 h-1.5" />
          <div className="mt-2 flex items-start gap-1.5 text-xs text-muted-foreground">
            <Sparkles className="mt-0.5 h-3 w-3 shrink-0" />
            <span>{hint}</span>
          </div>
        </>
      )}
    </motion.div>
  );
}

function Panel({
  title,
  icon: Icon,
  accent,
  children,
  className = "",
}: {
  title: string;
  icon: React.ElementType;
  accent?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl ${className}`}
    >
      {accent ? (
        <div
          className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-br ${accent} opacity-60`}
        />
      ) : null}
      <div className="relative flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <Icon className="h-4 w-4 text-foreground/70" />
        <div className="text-sm font-medium">{title}</div>
      </div>
      <div className="relative p-4">{children}</div>
    </div>
  );
}

function MiniStat({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  hint: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-2 font-display text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
    </div>
  );
}

function RiskPill({ score }: { score: number }) {
  const tone =
    score >= 80
      ? "bg-rose-500/15 text-rose-500"
      : score >= 65
        ? "bg-amber-500/15 text-amber-500"
        : "bg-sky-500/15 text-sky-500";
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ${tone}`}>
      {score}
    </span>
  );
}

function ToneDot({ tone }: { tone: string }) {
  const c = tone === "crit" ? "bg-rose-500" : tone === "warn" ? "bg-amber-500" : "bg-sky-500";
  return <span className={`h-2 w-2 rounded-full ${c}`} />;
}

function SeverityBadge({ severity }: { severity: string }) {
  if (severity === "Critical")
    return <Badge className="bg-rose-500/15 text-rose-500 hover:bg-rose-500/20">Critical</Badge>;
  if (severity === "Medium")
    return <Badge className="bg-amber-500/15 text-amber-500 hover:bg-amber-500/20">Medium</Badge>;
  return <Badge className="bg-sky-500/15 text-sky-500 hover:bg-sky-500/20">Low</Badge>;
}

function BarMeter({ value, tone = "primary" }: { value: number; tone?: "primary" | "violet" }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/60">
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            background:
              tone === "violet"
                ? "linear-gradient(90deg,#8b5cf6,#d946ef)"
                : "var(--gradient-brand)",
          }}
        />
      </div>
      <span className="w-9 text-right text-xs font-medium">{value}%</span>
    </div>
  );
}

function BarChart3Like(props: React.ComponentProps<typeof LineChartIcon>) {
  return <LineChartIcon {...props} />;
}

function PanelSkeletonContent() {
  return (
    <div className="space-y-4 animate-pulse py-2">
      <div className="h-4 w-full rounded bg-muted/20" />
      <div className="h-4 w-11/12 rounded bg-muted/20" />
      <div className="h-4 w-9/12 rounded bg-muted/20" />
    </div>
  );
}

function PanelErrorContent({ onRetry, message }: { onRetry: () => void; message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center">
      <AlertTriangle className="h-8 w-8 text-rose-500 mb-2" />
      <p className="text-sm font-medium text-muted-foreground mb-3">
        {message || "Failed to load data"}
      </p>
      <Button size="sm" variant="outline" onClick={onRetry}>
        Retry
      </Button>
    </div>
  );
}

function PanelEmptyContent({ message }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
      <Activity className="h-8 w-8 stroke-[1.5] mb-2 opacity-50" />
      <p className="text-sm font-medium">{message || "No metrics recorded yet"}</p>
    </div>
  );
}

function AIChatPanel() {
  const ws = useAurix();
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    {
      role: "ai",
      text: "Hi! I’m Aurix AI. Ask me about attrition, attendance, hiring or payroll.",
    },
  ]);

  const askCopilotMutation = useMutation({
    mutationFn: async (queryText: string) => {
      const companyId = ws.company?.id;
      if (!companyId) throw new Error("No active company context in workspace.");
      const response = await fetchV2<CopilotResponse>("/copilot/query", "POST", {
        company_id: companyId,
        query: queryText,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: data.ai_response || "I processed your query but returned no answer text.",
        },
      ]);
    },
    onError: (error: Error) => {
      setMessages((m) => [
        ...m,
        {
          role: "ai",
          text: `Error generating response: ${error.message || "Request failed"}`,
        },
      ]);
    },
  });

  function send(value?: string) {
    const t = (value ?? text).trim();
    if (!t) return;
    setText("");
    setMessages((m) => [...m, { role: "user", text: t }]);
    askCopilotMutation.mutate(t);
  }

  return (
    <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className="grid h-7 w-7 place-items-center rounded-lg text-brand-foreground"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Brain className="h-3.5 w-3.5" />
          </div>
          <div className="text-sm font-medium">Aurix AI Assistant</div>
        </div>
        <Badge variant="secondary" className="text-[10px]">
          Beta
        </Badge>
      </div>

      <div className="max-h-72 space-y-2 overflow-y-auto p-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm ${m.role === "user" ? "bg-foreground text-background" : "bg-accent/70 text-foreground"}`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {askCopilotMutation.isPending && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-2xl px-3 py-2 text-sm bg-accent/70 text-foreground animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2 border-t border-border/60 p-3">
        <div className="flex flex-wrap gap-1.5">
          {CHAT_EXAMPLES.map((e) => (
            <button
              key={e}
              onClick={() => send(e)}
              disabled={askCopilotMutation.isPending}
              className="rounded-full border border-border bg-background/50 px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-50"
            >
              {e}
            </button>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-2"
        >
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask Aurix AI anything..."
            className="h-9"
            disabled={askCopilotMutation.isPending}
          />
          <Button type="submit" size="sm" disabled={askCopilotMutation.isPending}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
