import { createFileRoute } from "@tanstack/react-router";
import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { useRecruitment } from "@/lib/recruitment/store";
import { STAGES, STAGE_LABEL } from "@/lib/recruitment/types";

export const Route = createFileRoute("/dashboard/recruitment/analytics")({
  head: () => ({ meta: [{ title: "Recruitment Analytics — Aurix" }] }),
  component: Analytics,
});

const COLORS = ["oklch(0.65 0.22 285)", "oklch(0.7 0.18 200)", "oklch(0.74 0.16 140)", "oklch(0.75 0.18 60)", "oklch(0.68 0.2 25)", "oklch(0.62 0.18 320)"];

function Analytics() {
  const { candidates, jobs, offers, interviews } = useRecruitment((s) => s);

  const funnel = STAGES.filter((s) => s !== "rejected").map((s) => ({ stage: STAGE_LABEL[s], count: candidates.filter((c) => c.stage === s).length }));
  const bySource = Object.entries(candidates.reduce<Record<string, number>>((a, c) => ({ ...a, [c.source]: (a[c.source] || 0) + 1 }), {})).map(([name, value]) => ({ name, value }));
  const byDept = Object.entries(jobs.reduce<Record<string, number>>((a, j) => ({ ...a, [j.department]: (a[j.department] || 0) + j.applicants }), {})).map(([name, value]) => ({ name, value }));
  const acceptanceData = [
    { name: "Accepted", value: offers.filter((o) => o.status === "accepted").length },
    { name: "Declined", value: offers.filter((o) => o.status === "declined").length },
    { name: "Pending", value: offers.filter((o) => o.status === "sent" || o.status === "pending-approval").length },
  ];

  // Dynamic Interview Conversion Funnel
  const totalC = candidates.length;
  const rawConv = [
    { stage: "Screened", val: candidates.filter(c => c.stage !== "applied").length },
    { stage: "Interview", val: candidates.filter(c => ["interview", "technical", "hr", "offer", "hired"].includes(c.stage)).length },
    { stage: "Technical", val: candidates.filter(c => ["technical", "hr", "offer", "hired"].includes(c.stage)).length },
    { stage: "Offer", val: candidates.filter(c => ["offer", "hired"].includes(c.stage)).length },
    { stage: "Hired", val: candidates.filter(c => c.stage === "hired").length },
  ];
  const interviewConv = rawConv.map(item => ({
    stage: item.stage,
    value: totalC > 0 ? Math.round((item.val / totalC) * 100) : 0
  }));

  // Dynamic Candidate Quality
  const candsWithScores = candidates.filter((c) => c.atsScore !== null || c.jobMatch !== null);
  const avgAts = candsWithScores.length > 0
    ? Math.round(candsWithScores.reduce((acc, c) => acc + (c.atsScore ?? 0), 0) / candsWithScores.length)
    : 0;
  const avgJobMatch = candsWithScores.length > 0
    ? Math.round(candsWithScores.reduce((acc, c) => acc + (c.jobMatch ?? 0), 0) / candsWithScores.length)
    : 0;
  const avgExp = candidates.length > 0
    ? Math.min(100, Math.round((candidates.reduce((acc, c) => acc + (c.yearsExperience || 0), 0) / candidates.length) * 10))
    : 0;
  const feedbackList = candidates.flatMap((c) => c.feedback || []);
  const avgFeedbackRating = feedbackList.length > 0
    ? Math.round((feedbackList.reduce((acc, f) => acc + (f.rating || 0), 0) / feedbackList.length) * 20)
    : 0;

  const quality = [
    { axis: "Skills", v: avgAts || 80 },
    { axis: "Experience", v: avgExp || 70 },
    { axis: "Culture Fit", v: avgFeedbackRating || 85 },
    { axis: "Comm.", v: avgFeedbackRating || 75 },
    { axis: "Leadership", v: Math.max(0, avgFeedbackRating - 10) || 65 },
    { axis: "Domain", v: avgJobMatch || 80 },
  ];

  // Dynamic Recruiter Performance
  const interviewerStats: Record<string, { interviews: number; hired: number }> = {};
  interviews.forEach((iv) => {
    const name = iv.interviewer || "Unknown";
    if (!interviewerStats[name]) {
      interviewerStats[name] = { interviews: 0, hired: 0 };
    }
    interviewerStats[name].interviews += 1;
    const cand = candidates.find((c) => c.id === iv.candidateId);
    if (cand && cand.stage === "hired") {
      interviewerStats[name].hired += 1;
    }
  });
  const recruiterPerf = Object.entries(interviewerStats).map(([name, data]) => ({
    name,
    interviews: data.interviews,
    hired: data.hired,
  }));
  if (recruiterPerf.length === 0) {
    recruiterPerf.push(
      { name: "Marcus Lee", hired: 0, interviews: 0 },
      { name: "Sara Iqbal", hired: 0, interviews: 0 },
      { name: "Daniel Okafor", hired: 0, interviews: 0 }
    );
  }

  // Dynamic Monthly Hiring & Cost Trend
  const monthlyData: Record<string, { hires: number; applications: number }> = {};
  const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  candidates.forEach((c) => {
    const date = new Date(c.appliedAt);
    const month = monthsOrder[isNaN(date.getTime()) ? 0 : date.getMonth()];
    if (!monthlyData[month]) {
      monthlyData[month] = { hires: 0, applications: 0 };
    }
    monthlyData[month].applications += 1;
    if (c.stage === "hired") {
      monthlyData[month].hires += 1;
    }
  });
  const currentMonthIdx = new Date().getMonth();
  const monthly = Array.from({ length: 6 }, (_, i) => {
    const idx = (currentMonthIdx - 5 + i + 12) % 12;
    const m = monthsOrder[idx];
    const data = monthlyData[m] || { hires: 0, applications: 0 };
    return {
      m,
      hires: data.hires,
      cost: data.applications * 1500, // estimated cost based on applications
    };
  });

  // Dynamic Time to Hire per Department
  const deptTimeToHire: Record<string, { totalDays: number; count: number }> = {};
  candidates.filter((c) => c.stage === "hired").forEach((c) => {
    const job = jobs.find((j) => j.id === c.jobId);
    const dept = job?.department || "General";
    const appTime = new Date(c.appliedAt).getTime();
    const hiredTimeline = c.timeline.find((t) => t.title.toLowerCase().includes("hired") || t.title.toLowerCase().includes("moved to hired"));
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
  if (timeToHire.length === 0) {
    timeToHire.push(
      { dept: "Eng", days: 0 },
      { dept: "Design", days: 0 },
      { dept: "Marketing", days: 0 }
    );
  }

  return (
    <>
      <PageHeader title="Recruitment Analytics" description="Hiring health, performance, and forecasts." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Hiring Funnel" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={funnel}><CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
              <XAxis dataKey="stage" className="text-[10px] text-muted-foreground" tickLine={false} axisLine={false} stroke="currentColor" />
              <YAxis className="text-xs text-muted-foreground" tickLine={false} axisLine={false} stroke="currentColor" />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>{funnel.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Source of Hire">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={bySource} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90}>
                {bySource.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Department Hiring">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byDept} layout="vertical"><CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" horizontal={false} />
              <XAxis type="number" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} stroke="currentColor" />
              <YAxis dataKey="name" type="category" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} stroke="currentColor" width={80} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="value" fill={COLORS[0]} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Offer Acceptance">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={acceptanceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={90}>
                <Cell fill="oklch(0.7 0.18 150)" /><Cell fill="oklch(0.65 0.2 25)" /><Cell fill="oklch(0.75 0.18 60)" />
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Interview Conversion">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={interviewConv}>
              <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
              <XAxis dataKey="stage" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} stroke="currentColor" />
              <YAxis className="text-xs text-muted-foreground" tickLine={false} axisLine={false} stroke="currentColor" />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Line dataKey="value" stroke={COLORS[0]} strokeWidth={2} dot={{ fill: COLORS[0], r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Candidate Quality">
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={quality}>
              <PolarGrid stroke="oklch(0.5 0.02 264 / 0.25)" />
              <PolarAngleAxis dataKey="axis" className="text-xs text-muted-foreground" />
              <PolarRadiusAxis stroke="currentColor" tick={false} axisLine={false} />
              <Radar dataKey="v" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.35} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Time to Hire (days)">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={timeToHire}>
              <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
              <XAxis dataKey="dept" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} stroke="currentColor" />
              <YAxis className="text-xs text-muted-foreground" tickLine={false} axisLine={false} stroke="currentColor" />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="days" fill={COLORS[3]} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Recruiter Performance" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={recruiterPerf}>
              <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
              <XAxis dataKey="name" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} stroke="currentColor" />
              <YAxis className="text-xs text-muted-foreground" tickLine={false} axisLine={false} stroke="currentColor" />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="interviews" fill={COLORS[1]} radius={[6, 6, 0, 0]} />
              <Bar dataKey="hired" fill={COLORS[2]} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Monthly Hiring & Cost" className="lg:col-span-3">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthly}>
              <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
              <XAxis dataKey="m" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} stroke="currentColor" />
              <YAxis className="text-xs text-muted-foreground" tickLine={false} axisLine={false} stroke="currentColor" />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line dataKey="hires" stroke={COLORS[0]} strokeWidth={2} dot={{ fill: COLORS[0], r: 4 }} />
              <Line dataKey="cost" stroke={COLORS[4]} strokeWidth={2} dot={{ fill: COLORS[4], r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </>
  );
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl ${className}`}>
      <div className="mb-2 font-display text-sm font-semibold">{title}</div>
      {children}
    </div>
  );
}
