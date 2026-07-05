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
  const { candidates, jobs, offers } = useRecruitment((s) => s);

  const funnel = STAGES.filter((s) => s !== "rejected").map((s) => ({ stage: STAGE_LABEL[s], count: candidates.filter((c) => c.stage === s).length }));
  const bySource = Object.entries(candidates.reduce<Record<string, number>>((a, c) => ({ ...a, [c.source]: (a[c.source] || 0) + 1 }), {})).map(([name, value]) => ({ name, value }));
  const byDept = Object.entries(jobs.reduce<Record<string, number>>((a, j) => ({ ...a, [j.department]: (a[j.department] || 0) + j.applicants }), {})).map(([name, value]) => ({ name, value }));
  const acceptanceData = [
    { name: "Accepted", value: offers.filter((o) => o.status === "accepted").length },
    { name: "Declined", value: offers.filter((o) => o.status === "declined").length },
    { name: "Pending", value: offers.filter((o) => o.status === "sent" || o.status === "pending-approval").length },
  ];
  const interviewConv = [
    { stage: "Screened", value: 100 }, { stage: "Interview", value: 62 }, { stage: "Technical", value: 38 }, { stage: "Offer", value: 18 }, { stage: "Hired", value: 12 },
  ];
  const quality = [
    { axis: "Skills", v: 88 }, { axis: "Experience", v: 76 }, { axis: "Culture Fit", v: 82 },
    { axis: "Comm.", v: 71 }, { axis: "Leadership", v: 65 }, { axis: "Domain", v: 79 },
  ];
  const recruiterPerf = [
    { name: "Marcus Lee", hired: 8, interviews: 42 },
    { name: "Sara Iqbal", hired: 11, interviews: 51 },
    { name: "Daniel Okafor", hired: 6, interviews: 28 },
    { name: "Ana Volkov", hired: 9, interviews: 36 },
  ];
  const monthly = [
    { m: "Jan", hires: 4, cost: 32 }, { m: "Feb", hires: 7, cost: 52 }, { m: "Mar", hires: 5, cost: 38 },
    { m: "Apr", hires: 11, cost: 71 }, { m: "May", hires: 9, cost: 64 }, { m: "Jun", hires: 14, cost: 88 },
  ];
  const timeToHire = [
    { dept: "Eng", days: 28 }, { dept: "Design", days: 22 }, { dept: "Customer", days: 18 }, { dept: "Marketing", days: 31 }, { dept: "Data", days: 35 },
  ];

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
