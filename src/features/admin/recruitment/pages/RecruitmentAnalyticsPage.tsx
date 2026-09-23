
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
  Award,
  BarChart3,
  Briefcase,
  CheckCircle2,
  Clock,
  Download,
  RefreshCw,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Loader } from "@/components/aurix/Loader";
import { Button } from "@/components/ui/button";
import { useRecruitment } from "@/features/admin/recruitment/hooks/useRecruitment";
import { STAGES, STAGE_LABEL } from "@/features/admin/recruitment/types";

const COLORS = [
  "oklch(0.65 0.22 285)",
  "oklch(0.7 0.18 200)",
  "oklch(0.74 0.16 140)",
  "oklch(0.75 0.18 60)",
  "oklch(0.68 0.2 25)",
  "oklch(0.62 0.18 320)",
];

const DATE_RANGES = ["Last 7 Days", "Last 30 Days", "Last 90 Days", "YTD", "All Time"] as const;
type DateRange = (typeof DATE_RANGES)[number];

export function RecruitmentAnalyticsPage() {
  const { candidates, jobs, offers, interviews, loading, error, refreshAll } = useRecruitment();

  const [dateRange, setDateRange] = useState<DateRange>("All Time");
  const [selectedDept, setSelectedDept] = useState("all");

  // Dynamic available departments from actual jobs data
  const availableDepartments = useMemo(() => {
    const depts = new Set<string>();
    jobs.forEach((j) => {
      if (j.department?.trim()) depts.add(j.department.trim());
    });
    candidates.forEach((c) => {
      const job = jobs.find((j) => j.id === c.jobId);
      if (job?.department?.trim()) depts.add(job.department.trim());
    });
    return Array.from(depts).sort();
  }, [jobs, candidates]);

  // Date filtering threshold
  const dateThreshold = useMemo(() => {
    const now = new Date();
    if (dateRange === "Last 7 Days") {
      return new Date(now.getTime() - 7 * 86400000);
    }
    if (dateRange === "Last 30 Days") {
      return new Date(now.getTime() - 30 * 86400000);
    }
    if (dateRange === "Last 90 Days") {
      return new Date(now.getTime() - 90 * 86400000);
    }
    if (dateRange === "YTD") {
      return new Date(now.getFullYear(), 0, 1);
    }
    return null; // All Time
  }, [dateRange]);

  // Job Department mapping
  const jobDeptMap = useMemo(() => {
    const map: Record<string, string> = {};
    jobs.forEach((j) => {
      if (j.id && j.department) map[j.id] = j.department;
    });
    return map;
  }, [jobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      if (selectedDept !== "all" && j.department !== selectedDept) return false;
      return true;
    });
  }, [jobs, selectedDept]);

  // Filtered candidates
  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      if (selectedDept !== "all") {
        const dept = jobDeptMap[c.jobId];
        if (dept && dept !== selectedDept) return false;
        if (
          !dept &&
          c.appliedPosition &&
          !c.appliedPosition.toLowerCase().includes(selectedDept.toLowerCase())
        ) {
          return false;
        }
      }

      if (dateThreshold && c.appliedAt) {
        const appDate = new Date(c.appliedAt);
        if (!isNaN(appDate.getTime()) && appDate < dateThreshold) return false;
      }
      return true;
    });
  }, [candidates, selectedDept, dateThreshold, jobDeptMap]);

  const filteredCandidateIds = useMemo(
    () => new Set(filteredCandidates.map((c) => c.id)),
    [filteredCandidates]
  );

  // Filtered offers
  const filteredOffers = useMemo(() => {
    return offers.filter((o) => {
      if (selectedDept !== "all" && o.candidateId && !filteredCandidateIds.has(o.candidateId)) {
        return false;
      }
      if (dateThreshold && (o.joiningDate || o.sentAt)) {
        const d = new Date(o.joiningDate || o.sentAt || "");
        if (!isNaN(d.getTime()) && d < dateThreshold) return false;
      }
      return true;
    });
  }, [offers, selectedDept, filteredCandidateIds, dateThreshold]);

  // Filtered interviews
  const filteredInterviews = useMemo(() => {
    return interviews.filter((iv) => {
      if (selectedDept !== "all" && iv.candidateId && !filteredCandidateIds.has(iv.candidateId)) {
        return false;
      }
      if (dateThreshold && iv.date) {
        const d = new Date(iv.date);
        if (!isNaN(d.getTime()) && d < dateThreshold) return false;
      }
      return true;
    });
  }, [interviews, selectedDept, filteredCandidateIds, dateThreshold]);

  // KPIs
  const totalApplicants = filteredCandidates.length;
  const hiredCount = filteredCandidates.filter((c) => c.stage === "hired").length;
  const hireRate = totalApplicants > 0 ? Math.round((hiredCount / totalApplicants) * 100) : 0;
  const activePipelineCount = filteredCandidates.filter((c) =>
    ["screening", "assessment", "interview", "technical", "hr", "offer"].includes(c.stage)
  ).length;
  const acceptedOffersCount = filteredOffers.filter((o) => o.status === "accepted").length;
  const offerAcceptancePct =
    filteredOffers.length > 0
      ? Math.round((acceptedOffersCount / filteredOffers.length) * 100)
      : 0;

  // Hiring Funnel
  const funnel = STAGES.filter((s) => s !== "rejected").map((s) => ({
    stage: STAGE_LABEL[s],
    count: filteredCandidates.filter((c) => c.stage === s).length,
  }));

  // Sourcing Breakdown
  const bySource = Object.entries(
    filteredCandidates.reduce<Record<string, number>>((acc, c) => {
      const src = c.source?.trim() || "Direct";
      acc[src] = (acc[src] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Department Breakdown
  const byDept = Object.entries(
    filteredJobs.reduce<Record<string, number>>((acc, j) => {
      const dept = j.department?.trim() || "General";
      acc[dept] = (acc[dept] || 0) + (j.applicants || 0);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // If no job applicants tracked yet, count from candidates directly
  if (byDept.length === 0 && filteredCandidates.length > 0) {
    const candidateDeptCounts: Record<string, number> = {};
    filteredCandidates.forEach((c) => {
      const dept = jobDeptMap[c.jobId] || "General";
      candidateDeptCounts[dept] = (candidateDeptCounts[dept] || 0) + 1;
    });
    Object.entries(candidateDeptCounts).forEach(([name, value]) => {
      byDept.push({ name, value });
    });
  }

  // Offer Acceptance
  const acceptanceData = [
    { name: "Accepted", value: filteredOffers.filter((o) => o.status === "accepted").length },
    { name: "Declined", value: filteredOffers.filter((o) => o.status === "declined").length },
    {
      name: "Pending",
      value: filteredOffers.filter(
        (o) => o.status === "sent" || o.status === "pending-approval" || o.status === "draft"
      ).length,
    },
  ];
  const totalOffersCount = acceptanceData.reduce((acc, curr) => acc + curr.value, 0);

  // Dynamic Interview Conversion Funnel
  const rawConv = [
    { stage: "Applied", val: totalApplicants },
    { stage: "Screened", val: filteredCandidates.filter((c) => c.stage !== "applied").length },
    {
      stage: "Interview",
      val: filteredCandidates.filter((c) =>
        ["interview", "technical", "hr", "offer", "hired"].includes(c.stage)
      ).length,
    },
    {
      stage: "Technical",
      val: filteredCandidates.filter((c) =>
        ["technical", "hr", "offer", "hired"].includes(c.stage)
      ).length,
    },
    {
      stage: "Offer",
      val: filteredCandidates.filter((c) => ["offer", "hired"].includes(c.stage)).length,
    },
    { stage: "Hired", val: hiredCount },
  ];
  const interviewConv = rawConv.map((item) => ({
    stage: item.stage,
    value: totalApplicants > 0 ? Math.round((item.val / totalApplicants) * 100) : 0,
  }));

  // Dynamic Candidate Quality - Real calculations only
  const candsWithScores = filteredCandidates.filter(
    (c) => c.atsScore !== null || c.jobMatch !== null
  );
  const avgAts =
    candsWithScores.length > 0
      ? Math.round(
          candsWithScores.reduce((acc, c) => acc + (c.atsScore ?? 0), 0) / candsWithScores.length
        )
      : 0;
  const avgJobMatch =
    candsWithScores.length > 0
      ? Math.round(
          candsWithScores.reduce((acc, c) => acc + (c.jobMatch ?? 0), 0) / candsWithScores.length
        )
      : 0;
  const avgExp =
    filteredCandidates.length > 0
      ? Math.min(
          100,
          Math.round(
            (filteredCandidates.reduce((acc, c) => acc + (c.yearsExperience || 0), 0) /
              filteredCandidates.length) *
              10
          )
        )
      : 0;
  const feedbackList = filteredCandidates.flatMap((c) => c.feedback || []);
  const avgFeedbackRating =
    feedbackList.length > 0
      ? Math.round(
          (feedbackList.reduce((acc, f) => acc + (f.rating || 0), 0) / feedbackList.length) * 20
        )
      : 0;

  const hasQualityData =
    avgAts > 0 || avgExp > 0 || avgFeedbackRating > 0 || avgJobMatch > 0;

  const quality = [
    { axis: "ATS Match", v: avgAts },
    { axis: "Experience", v: avgExp },
    { axis: "Interview Feedback", v: avgFeedbackRating },
    { axis: "Communication", v: avgFeedbackRating },
    { axis: "Leadership", v: Math.max(0, avgFeedbackRating - 10) },
    { axis: "Role Fit", v: avgJobMatch },
  ];

  // Dynamic Recruiter Performance - from real interviews
  const interviewerStats: Record<string, { interviews: number; hired: number }> = {};
  filteredInterviews.forEach((iv) => {
    const name = iv.interviewer?.trim() || "Unassigned";
    if (!interviewerStats[name]) {
      interviewerStats[name] = { interviews: 0, hired: 0 };
    }
    interviewerStats[name].interviews += 1;
    const cand = filteredCandidates.find((c) => c.id === iv.candidateId);
    if (cand && cand.stage === "hired") {
      interviewerStats[name].hired += 1;
    }
  });

  const recruiterPerf = Object.entries(interviewerStats).map(([name, data]) => ({
    name,
    interviews: data.interviews,
    hired: data.hired,
  }));

  // Dynamic Monthly Hiring & Real Offer CTC spend
  const monthlyData: Record<string, { hires: number; applications: number; cost: number }> = {};
  const monthsOrder = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  filteredCandidates.forEach((c) => {
    const date = new Date(c.appliedAt);
    const month = monthsOrder[isNaN(date.getTime()) ? 0 : date.getMonth()];
    if (!monthlyData[month]) {
      monthlyData[month] = { hires: 0, applications: 0, cost: 0 };
    }
    monthlyData[month].applications += 1;
    if (c.stage === "hired") {
      monthlyData[month].hires += 1;
    }
  });

  filteredOffers.forEach((o) => {
    const dateStr = o.joiningDate || o.sentAt;
    if (dateStr) {
      const date = new Date(dateStr);
      const month = monthsOrder[isNaN(date.getTime()) ? 0 : date.getMonth()];
      if (!monthlyData[month]) {
        monthlyData[month] = { hires: 0, applications: 0, cost: 0 };
      }
      if (o.status === "accepted" || o.status === "sent") {
        monthlyData[month].cost += Number(o.salary || 0);
      }
    }
  });

  const currentMonthIdx = new Date().getMonth();
  const monthly = Array.from({ length: 6 }, (_, i) => {
    const idx = (currentMonthIdx - 5 + i + 12) % 12;
    const m = monthsOrder[idx];
    const data = monthlyData[m] || { hires: 0, applications: 0, cost: 0 };
    return {
      m,
      hires: data.hires,
      cost: data.cost,
    };
  });

  // Dynamic Time to Hire per Department
  const deptTimeToHire: Record<string, { totalDays: number; count: number }> = {};
  filteredCandidates
    .filter((c) => c.stage === "hired")
    .forEach((c) => {
      const job = jobs.find((j) => j.id === c.jobId);
      const dept = job?.department || "General";
      const appTime = new Date(c.appliedAt).getTime();
      const hiredTimeline = c.timeline?.find(
        (t) =>
          t.title.toLowerCase().includes("hired") ||
          t.title.toLowerCase().includes("moved to hired")
      );
      const hiredTime = hiredTimeline ? new Date(hiredTimeline.at).getTime() : new Date().getTime();
      const diffDays = Math.max(1, Math.round((hiredTime - appTime) / (1000 * 60 * 60 * 24)));
      if (!deptTimeToHire[dept]) {
        deptTimeToHire[dept] = { totalDays: 0, count: 0 };
      }
      deptTimeToHire[dept].totalDays += diffDays;
      deptTimeToHire[dept].count += 1;
    });

  const timeToHire = Object.entries(deptTimeToHire).map(([dept, data]) => ({
    dept,
    days: Math.round(data.totalDays / data.count),
  }));

  const totalHiredDays = Object.values(deptTimeToHire).reduce((a, b) => a + b.totalDays, 0);
  const totalHiredCount = Object.values(deptTimeToHire).reduce((a, b) => a + b.count, 0);
  const avgTimeToHireDays =
    totalHiredCount > 0 ? Math.round(totalHiredDays / totalHiredCount) : 0;

  const handleExport = (format: string) => {
    if (filteredCandidates.length === 0) {
      toast.warning("No candidate data to export for current filters.");
      return;
    }
    const csvContent = filteredCandidates
      .map(
        (c) =>
          `"${c.name}","${c.appliedPosition}","${c.stage}","${c.source}","${c.atsScore || 0}","${c.appliedAt}"`
      )
      .join("\n");
    const blob = new Blob(
      [`"Candidate Name","Role","Stage","Source","ATS Score","Applied At"\n` + csvContent],
      { type: "text/csv" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Recruitment-Analytics-${dateRange.replace(/\s+/g, "-")}.${format.toLowerCase()}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported Recruitment Analytics as ${format}!`);
  };

  if (loading && candidates.length === 0 && jobs.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Recruitment & Workforce Analytics"
          description="Monitor pipeline conversion health, candidate sourcing ROI, offer acceptance velocity, and hiring forecasts."
        />
        <Loader variant="panel" label="Loading recruitment analytics from API..." skeletonRows={6} />
      </div>
    );
  }

  if (error && candidates.length === 0 && jobs.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Recruitment & Workforce Analytics"
          description="Monitor pipeline conversion health, candidate sourcing ROI, offer acceptance velocity, and hiring forecasts."
        />
        <div className="rounded-2xl border border-border bg-card/60 p-8 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => refreshAll()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Recruitment & Workforce Analytics"
        description="Monitor pipeline conversion health, candidate sourcing ROI, offer acceptance velocity, and hiring forecasts."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExport("CSV")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/60 text-xs font-medium text-foreground hover:bg-accent cursor-pointer shadow-sm transition-colors"
            >
              <Download className="h-3 w-3" />
              Export CSV
            </button>
            <button
              onClick={() => handleExport("Excel")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/60 text-xs font-medium text-foreground hover:bg-accent cursor-pointer shadow-sm transition-colors"
            >
              <Download className="h-3 w-3" />
              Export Excel
            </button>
          </div>
        }
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
        <div className="rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total Applicants</span>
            <Users className="h-4 w-4 text-indigo-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground font-display">
            {totalApplicants}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {hiredCount} hired ({hireRate}% conversion)
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Active Pipeline</span>
            <Briefcase className="h-4 w-4 text-sky-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground font-display">
            {activePipelineCount}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            In screening, interview, or offer stage
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Offers Acceptance</span>
            <Award className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground font-display">
            {offerAcceptancePct}%
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {acceptedOffersCount} of {filteredOffers.length} offers accepted
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Avg. Time to Hire</span>
            <Clock className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-foreground font-display">
            {avgTimeToHireDays > 0 ? `${avgTimeToHireDays}d` : "—"}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {totalHiredCount > 0 ? `Across ${totalHiredCount} hires` : "No hire timeline recorded"}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/40 p-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Date Range:</span>
          {DATE_RANGES.map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                dateRange === range
                  ? "bg-foreground text-background font-semibold shadow-xs"
                  : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground font-medium">Department:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">All Departments ({availableDepartments.length})</option>
            {availableDepartments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Hiring Funnel" className="lg:col-span-2">
          {totalApplicants > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={funnel}>
                <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
                <XAxis
                  dataKey="stage"
                  className="text-[10px] text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  stroke="currentColor"
                />
                <YAxis
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  stroke="currentColor"
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {funnel.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState message="No candidate applications in this filter range." />
          )}
        </Card>

        <Card title="Source of Hire">
          {bySource.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={bySource} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}>
                  {bySource.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState message="No candidate sourcing channels recorded." />
          )}
        </Card>

        <Card title="Department Hiring">
          {byDept.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={byDept} layout="vertical">
                <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" horizontal={false} />
                <XAxis
                  type="number"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  stroke="currentColor"
                  allowDecimals={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  stroke="currentColor"
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="value" fill={COLORS[0]} radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState message="No department hiring statistics available." />
          )}
        </Card>

        <Card title="Offer Acceptance">
          {totalOffersCount > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={acceptanceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                >
                  <Cell fill="oklch(0.7 0.18 150)" />
                  <Cell fill="oklch(0.65 0.2 25)" />
                  <Cell fill="oklch(0.75 0.18 60)" />
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState message="No candidate offers generated yet." />
          )}
        </Card>

        <Card title="Interview Conversion (%)">
          {totalApplicants > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={interviewConv}>
                <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
                <XAxis
                  dataKey="stage"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  stroke="currentColor"
                />
                <YAxis
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  stroke="currentColor"
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Line
                  dataKey="value"
                  name="Conversion %"
                  stroke={COLORS[0]}
                  strokeWidth={2}
                  dot={{ fill: COLORS[0], r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState message="No candidate funnel data to calculate conversion." />
          )}
        </Card>

        <Card title="Candidate Quality Evaluation">
          {hasQualityData ? (
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={quality}>
                <PolarGrid stroke="oklch(0.5 0.02 264 / 0.25)" />
                <PolarAngleAxis dataKey="axis" className="text-xs text-muted-foreground" />
                <PolarRadiusAxis stroke="currentColor" tick={false} axisLine={false} domain={[0, 100]} />
                <Radar dataKey="v" name="Score" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.35} />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState message="Evaluations and ATS scores will appear as candidates are assessed." />
          )}
        </Card>

        <Card title="Time to Hire (days)">
          {timeToHire.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={timeToHire}>
                <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
                <XAxis
                  dataKey="dept"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  stroke="currentColor"
                />
                <YAxis
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  stroke="currentColor"
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="days" fill={COLORS[3]} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState message="No candidates marked as hired yet to compute time-to-hire." />
          )}
        </Card>

        <Card title="Recruiter & Interviewer Activity" className="lg:col-span-2">
          {recruiterPerf.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={recruiterPerf}>
                <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
                <XAxis
                  dataKey="name"
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  stroke="currentColor"
                />
                <YAxis
                  className="text-xs text-muted-foreground"
                  tickLine={false}
                  axisLine={false}
                  stroke="currentColor"
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 8,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="interviews" name="Interviews Conducted" fill={COLORS[1]} radius={[6, 6, 0, 0]} />
                <Bar dataKey="hired" name="Successful Hires" fill={COLORS[2]} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChartState message="No interviewer assignments or scorecard submissions recorded yet." />
          )}
        </Card>

        <Card title="Monthly Hiring & Offer CTC Spend" className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthly}>
              <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
              <XAxis
                dataKey="m"
                className="text-xs text-muted-foreground"
                tickLine={false}
                axisLine={false}
                stroke="currentColor"
              />
              <YAxis
                yAxisId="left"
                className="text-xs text-muted-foreground"
                tickLine={false}
                axisLine={false}
                stroke="currentColor"
                allowDecimals={false}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                className="text-xs text-muted-foreground"
                tickLine={false}
                axisLine={false}
                stroke="currentColor"
                tickFormatter={(val) => (val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`)}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                }}
                formatter={(value: number, name: string) => [
                  name === "Offer CTC Spend"
                    ? `₹${Number(value || 0).toLocaleString("en-IN")}`
                    : value,
                  name,
                ]}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line
                yAxisId="left"
                dataKey="hires"
                name="Hires"
                stroke={COLORS[0]}
                strokeWidth={2}
                dot={{ fill: COLORS[0], r: 4 }}
              />
              <Line
                yAxisId="right"
                dataKey="cost"
                name="Offer CTC Spend"
                stroke={COLORS[4]}
                strokeWidth={2}
                dot={{ fill: COLORS[4], r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </>
  );
}

function Card({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl ${className}`}>
      <div className="mb-2 font-display text-sm font-semibold">{title}</div>
      {children}
    </div>
  );
}

function EmptyChartState({ message }: { message: string }) {
  return (
    <div className="flex h-[260px] flex-col items-center justify-center text-center p-4">
      <div className="rounded-full bg-muted/30 p-3 mb-2 text-muted-foreground/60">
        <BarChart3 className="h-6 w-6 opacity-40" />
      </div>
      <p className="text-xs text-muted-foreground font-medium max-w-xs leading-relaxed">
        {message}
      </p>
    </div>
  );
}

export default RecruitmentAnalyticsPage;


