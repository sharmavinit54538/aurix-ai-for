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
  const { candidates, jobs, offers } = useRecruitment((s) => s);

  const funnel = STAGES.filter((s) => s !== "rejected").map((s, i) => ({ name: STAGE_LABEL[s], value: Math.max(1, candidates.filter((c) => c.stage === s).length + (8 - i) * 6), fill: COLORS[i % COLORS.length] }));
  const tth = [{ d: "Eng", v: 28 }, { d: "Design", v: 22 }, { d: "Sales", v: 19 }, { d: "Mkt", v: 31 }, { d: "Data", v: 35 }, { d: "Ops", v: 24 }];
  const monthly = [{ m: "Jan", h: 4 }, { m: "Feb", h: 7 }, { m: "Mar", h: 5 }, { m: "Apr", h: 11 }, { m: "May", h: 9 }, { m: "Jun", h: 14 }];
  const sources = [{ s: "LinkedIn", a: 312, h: 18 }, { s: "Referrals", a: 92, h: 14 }, { s: "Indeed", a: 188, h: 9 }, { s: "Career Site", a: 142, h: 11 }, { s: "Agency", a: 64, h: 5 }];
  const recruiters = [
    { name: "Sara Iqbal", hired: 11, interviews: 51, offers: 14, accept: 92 },
    { name: "Marcus Lee", hired: 8, interviews: 42, offers: 11, accept: 81 },
    { name: "Ana Volkov", hired: 9, interviews: 36, offers: 12, accept: 75 },
    { name: "Daniel Okafor", hired: 6, interviews: 28, offers: 8, accept: 88 },
  ];
  const stats = [
    { k: "Time to Hire", v: "26d", d: "-3d vs last Q" },
    { k: "Time to Fill", v: "38d", d: "-5d" },
    { k: "Cost per Hire", v: "$4,210", d: "-8%" },
    { k: "Offer Acceptance", v: `${Math.round((offers.filter((o) => o.status === "accepted").length / Math.max(1, offers.length)) * 100) || 84}%`, d: "+4pt" },
    { k: "Interview Pass Rate", v: "37%", d: "+2pt" },
    { k: "Active Jobs", v: jobs.filter((j) => j.status === "active").length, d: `${jobs.length} total` },
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
