import { createFileRoute } from "@tanstack/react-router";
import { Bar, BarChart, CartesianGrid, Cell, Funnel, FunnelChart, LabelList, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { useRecruitment } from "@/lib/recruitment/store";
import { STAGES, STAGE_LABEL } from "@/lib/recruitment/types";

export const Route = createFileRoute("/dashboard/recruitment/reports")({
  head: () => ({ meta: [{ title: "Hiring Reports — Recruitment" }] }),
  component: Reports,
});

const COLORS = ["oklch(0.65 0.22 285)", "oklch(0.7 0.18 200)", "oklch(0.74 0.16 140)", "oklch(0.75 0.18 60)", "oklch(0.68 0.2 25)", "oklch(0.62 0.18 320)"];

function Reports() {
  const { candidates, jobs, offers, interviews } = useRecruitment((s) => s);

  function getDaysDiff(endStr: string | undefined, startStr: string | undefined): number {
    if (!startStr) return 0;
    const start = new Date(startStr);
    const end = endStr ? new Date(endStr) : new Date();
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // 1. Hiring Funnel
  const funnel = STAGES.filter((s) => s !== "rejected").map((s, i) => ({
    name: STAGE_LABEL[s],
    value: candidates.filter((c) => c.stage === s).length,
    fill: COLORS[i % COLORS.length]
  }));

  // 2. Time to Hire by Dept
  const deptTthMap: Record<string, { totalDays: number; count: number }> = {};
  const hiredCandidates = candidates.filter((c) => c.stage === "hired");
  hiredCandidates.forEach((c) => {
    const job = jobs.find((j) => j.id === c.jobId);
    const dept = job?.department || "General";
    const offer = offers.find((o) => o.candidateId === c.id);
    const days = getDaysDiff(offer?.respondedAt || offer?.joiningDate || c.appliedAt, c.appliedAt) || 15;
    
    if (!deptTthMap[dept]) {
      deptTthMap[dept] = { totalDays: 0, count: 0 };
    }
    deptTthMap[dept].totalDays += days;
    deptTthMap[dept].count += 1;
  });
  
  const tth = Object.entries(deptTthMap).map(([d, data]) => ({
    d,
    v: Math.round(data.totalDays / data.count)
  }));
  
  if (tth.length === 0) {
    const departments = Array.from(new Set(jobs.map((j) => j.department).filter(Boolean)));
    if (departments.length > 0) {
      departments.forEach((d) => tth.push({ d, v: 0 }));
    } else {
      tth.push({ d: "No Data", v: 0 });
    }
  }

  // 3. Monthly Hiring Trends
  const monthlyMap: Record<string, number> = {
    Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0,
    Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0
  };
  candidates.forEach((c) => {
    if (c.stage === "hired") {
      const dateStr = c.appliedAt || c.timeline?.find((t) => t.title.toLowerCase().includes("hired"))?.at;
      if (dateStr) {
        const monthName = new Date(dateStr).toLocaleString("en-US", { month: "short" });
        if (monthName in monthlyMap) {
          monthlyMap[monthName] += 1;
        }
      }
    }
  });
  const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const currentMonthIdx = new Date().getMonth();
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const idx = (currentMonthIdx - i + 12) % 12;
    const m = monthsOrder[idx];
    last6Months.push({ m, h: monthlyMap[m] || 0 });
  }
  const monthly = last6Months;

  // 4. Source ROI
  const sourceMap: Record<string, { a: number; h: number }> = {};
  candidates.forEach((c) => {
    const src = c.source || "DIRECT";
    if (!sourceMap[src]) {
      sourceMap[src] = { a: 0, h: 0 };
    }
    sourceMap[src].a += 1;
    if (c.stage === "hired") {
      sourceMap[src].h += 1;
    }
  });
  const sources = Object.entries(sourceMap).map(([s, val]) => ({
    s,
    a: val.a,
    h: val.h
  }));
  if (sources.length === 0) {
    sources.push({ s: "No Data", a: 0, h: 0 });
  }

  // 5. Recruiter Leaderboard
  const recruiterMap: Record<string, { hired: number; interviews: number; offers: number; accept: number }> = {};
  candidates.forEach((c) => {
    const job = jobs.find((j) => j.id === c.jobId);
    const recruiterName = job?.recruiter || "General Recruiter";
    if (!recruiterMap[recruiterName]) {
      recruiterMap[recruiterName] = { hired: 0, interviews: 0, offers: 0, accept: 0 };
    }
    if (c.stage === "hired") {
      recruiterMap[recruiterName].hired += 1;
    }
    const offer = offers.find((o) => o.candidateId === c.id);
    if (offer) {
      recruiterMap[recruiterName].offers += 1;
      if (offer.status === "accepted") {
        recruiterMap[recruiterName].accept += 1;
      }
    }
  });
  interviews.forEach((iv) => {
    const matchingJob = jobs.find((j) => j.title === iv.jobTitle);
    const recruiterName = matchingJob?.recruiter || "General Recruiter";
    if (!recruiterMap[recruiterName]) {
      recruiterMap[recruiterName] = { hired: 0, interviews: 0, offers: 0, accept: 0 };
    }
    recruiterMap[recruiterName].interviews += 1;
  });
  const recruiters = Object.entries(recruiterMap).map(([name, val]) => ({
    name,
    hired: val.hired,
    interviews: val.interviews,
    offers: val.offers,
    accept: val.offers > 0 ? Math.round((val.accept / val.offers) * 100) : 0
  }));
  if (recruiters.length === 0) {
    recruiters.push({ name: "No Recruiter Data", hired: 0, interviews: 0, offers: 0, accept: 0 });
  }

  // 6. Stats Cards
  let totalHiredDays = 0;
  hiredCandidates.forEach((c) => {
    const offer = offers.find((o) => o.candidateId === c.id);
    totalHiredDays += getDaysDiff(offer?.respondedAt || offer?.joiningDate || c.appliedAt, c.appliedAt) || 15;
  });
  const avgTimeToHire = hiredCandidates.length > 0 ? Math.round(totalHiredDays / hiredCandidates.length) : 0;
  const timeToHireStr = avgTimeToHire > 0 ? `${avgTimeToHire}d` : "—";

  let totalFillDays = 0;
  let fillCount = 0;
  jobs.forEach((j) => {
    if (j.status === "closed" || j.applicants > 0) {
      const days = getDaysDiff(j.closingAt || new Date().toISOString(), j.publishedAt);
      totalFillDays += days;
      fillCount += 1;
    }
  });
  const avgTimeToFill = fillCount > 0 ? Math.round(totalFillDays / fillCount) : 0;
  const timeToFillStr = avgTimeToFill > 0 ? `${avgTimeToFill}d` : "—";

  const hiredSalaries = hiredCandidates.map((c) => c.expectedSalary).filter(Boolean) as number[];
  const avgHiredSalary = hiredSalaries.length > 0 ? Math.round(hiredSalaries.reduce((a, b) => a + b, 0) / hiredSalaries.length) : 0;
  const costPerHireStr = avgHiredSalary > 0 ? `₹${(avgHiredSalary / 1000).toFixed(0)}k` : "—";

  const offerAcceptanceVal = Math.round((offers.filter((o) => o.status === "accepted").length / Math.max(1, offers.length)) * 100) || 0;
  const offerAcceptanceStr = offers.length > 0 ? `${offerAcceptanceVal}%` : "—";

  const completedInterviews = interviews.filter((iv) => iv.status === "completed");
  const positiveFeedback = completedInterviews.filter((iv) => (iv.rating || 0) >= 3.5);
  const passRateVal = Math.round((positiveFeedback.length / Math.max(1, completedInterviews.length)) * 100) || 0;
  const passRateStr = completedInterviews.length > 0 ? `${passRateVal}%` : "—";

  const stats = [
    { k: "Time to Hire", v: timeToHireStr, d: hiredCandidates.length > 0 ? "Average hired days" : "No hired leads" },
    { k: "Time to Fill", v: timeToFillStr, d: fillCount > 0 ? "Average job duration" : "No active fill data" },
    { k: "Avg Sourcing CTC", v: costPerHireStr, d: hiredSalaries.length > 0 ? "Average profile package" : "No CTC stats" },
    { k: "Offer Acceptance", v: offerAcceptanceStr, d: `${offers.length} offers total` },
    { k: "Interview Success Rate", v: passRateStr, d: `${completedInterviews.length} feedback logs` },
    { k: "Active Jobs", v: jobs.filter((j) => j.status === "active").length, d: `${jobs.length} total jobs` },
  ];

  return (
    <>
      <PageHeader title="Hiring Reports" description="Funnel, time-to-hire, source ROI, recruiter leaderboard, and trends." />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
        {stats.map((s) => (
          <div key={s.k} className="rounded-2xl border border-border bg-card/60 p-3 backdrop-blur-xl">
            <div className="text-[11px] text-muted-foreground">{s.k}</div>
            <div className="mt-1 font-display text-xl font-semibold">{s.v}</div>
            <div className="text-[10px] text-emerald-600">{s.d}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="mb-2 font-display text-base font-semibold">Hiring Funnel</div>
          <ResponsiveContainer width="100%" height={260}>
            <FunnelChart><Tooltip />
              <Funnel dataKey="value" data={funnel} isAnimationActive><LabelList position="right" dataKey="name" className="fill-foreground" /></Funnel>
            </FunnelChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="mb-2 font-display text-base font-semibold">Time to Hire by Dept</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={tth}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="d" className="text-xs" /><YAxis className="text-xs" unit="d" /><Tooltip />
              <Bar dataKey="v" radius={[6, 6, 0, 0]}>{tth.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="mb-2 font-display text-base font-semibold">Monthly Hiring Trends</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthly}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="m" className="text-xs" /><YAxis className="text-xs" /><Tooltip />
              <Line type="monotone" dataKey="h" stroke="oklch(0.65 0.22 285)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="mb-2 font-display text-base font-semibold">Source Performance</div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-xs text-muted-foreground"><th className="py-2">Source</th><th>Applicants</th><th>Hires</th><th>Conv.</th></tr></thead>
            <tbody>
              {sources.map((s) => (
                <tr key={s.s} className="border-b border-border/60">
                  <td className="py-2 font-medium">{s.s}</td><td>{s.a}</td><td>{s.h}</td>
                  <td><Badge variant="secondary" className="text-[10px]">{Math.round((s.h / s.a) * 100)}%</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="mb-2 font-display text-base font-semibold">Recruiter Leaderboard</div>
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-xs text-muted-foreground"><th className="py-2">Recruiter</th><th>Hired</th><th>Interviews</th><th>Accept %</th></tr></thead>
            <tbody>
              {recruiters.sort((a, b) => b.hired - a.hired).map((r, i) => (
                <tr key={r.name} className="border-b border-border/60">
                  <td className="py-2 font-medium">{i + 1}. {r.name}</td><td>{r.hired}</td><td>{r.interviews}</td>
                  <td><Badge variant="secondary" className="text-[10px]">{r.accept}%</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
