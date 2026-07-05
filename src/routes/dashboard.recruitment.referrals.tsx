import { createFileRoute } from "@tanstack/react-router";
import { Award, Gift, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CandidateAvatar } from "@/components/recruitment/Bits";

export const Route = createFileRoute("/dashboard/recruitment/referrals")({
  head: () => ({ meta: [{ title: "Referrals — Recruitment" }] }),
  component: Referrals,
});

const COLORS = ["oklch(0.65 0.22 285)", "oklch(0.7 0.18 200)", "oklch(0.74 0.16 140)", "oklch(0.75 0.18 60)", "oklch(0.68 0.2 25)"];

interface Referral {
  id: string;
  candidate: string;
  job: string;
  referrer: string;
  department: string;
  stage: "submitted" | "interview" | "offer" | "hired" | "rejected";
  bonus: number;
  submittedAt: string;
}

const referrals: Referral[] = [
  { id: "r1", candidate: "Naomi Carter", job: "Staff Engineer", referrer: "Aarav Mehta", department: "Engineering", stage: "hired", bonus: 5000, submittedAt: "2026-04-12" },
  { id: "r2", candidate: "Mateo Silva", job: "Product Designer", referrer: "Lena Park", department: "Design", stage: "offer", bonus: 3000, submittedAt: "2026-05-21" },
  { id: "r3", candidate: "Hanna Voss", job: "AE — DACH", referrer: "Noah Becker", department: "Sales", stage: "interview", bonus: 4000, submittedAt: "2026-06-04" },
  { id: "r4", candidate: "Kenji Watanabe", job: "Data Scientist", referrer: "Priya Sharma", department: "Engineering", stage: "submitted", bonus: 4500, submittedAt: "2026-06-15" },
  { id: "r5", candidate: "Ella Brown", job: "CSM", referrer: "Diego Alvarez", department: "CS", stage: "rejected", bonus: 0, submittedAt: "2026-05-30" },
  { id: "r6", candidate: "Theo Laurent", job: "Frontend Engineer", referrer: "Aarav Mehta", department: "Engineering", stage: "hired", bonus: 5000, submittedAt: "2026-03-02" },
  { id: "r7", candidate: "Aisha Patel", job: "Recruiter", referrer: "Aisha Khan", department: "People", stage: "interview", bonus: 2500, submittedAt: "2026-06-10" },
];

const STAGE_TONE: Record<Referral["stage"], string> = {
  submitted: "bg-sky-500/15 text-sky-600 ring-sky-500/20 dark:text-sky-300",
  interview: "bg-violet-500/15 text-violet-600 ring-violet-500/20 dark:text-violet-300",
  offer: "bg-amber-500/15 text-amber-700 ring-amber-500/20 dark:text-amber-300",
  hired: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
  rejected: "bg-rose-500/15 text-rose-600 ring-rose-500/20 dark:text-rose-300",
};

function Referrals() {
  const totalBonus = referrals.filter((r) => r.stage === "hired").reduce((a, r) => a + r.bonus, 0);
  const conversion = Math.round((referrals.filter((r) => r.stage === "hired").length / referrals.length) * 100);

  const byDept = Object.entries(referrals.reduce<Record<string, number>>((a, r) => ({ ...a, [r.department]: (a[r.department] || 0) + 1 }), {}))
    .map(([name, value]) => ({ name, value }));

  const leaderboard = Object.entries(referrals.reduce<Record<string, { count: number; hired: number }>>((a, r) => {
    const k = r.referrer;
    a[k] = a[k] || { count: 0, hired: 0 };
    a[k].count += 1;
    if (r.stage === "hired") a[k].hired += 1;
    return a;
  }, {})).map(([name, v]) => ({ name, ...v })).sort((a, b) => b.hired - a.hired || b.count - a.count);

  return (
    <>
      <PageHeader
        title="Employee Referrals"
        description="Track referrals, payouts and the people growing your team."
        actions={<Button><Gift className="mr-2 h-4 w-4" />Refer Someone</Button>}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Total Referrals", value: referrals.length, icon: Users },
          { label: "Hired", value: referrals.filter((r) => r.stage === "hired").length, icon: Award },
          { label: "Conversion", value: `${conversion}%`, icon: TrendingUp },
          { label: "Bonuses Paid", value: `$${totalBonus.toLocaleString()}`, icon: Gift },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{k.label}</div>
                  <div className="mt-2 font-display text-2xl font-semibold">{k.value}</div>
                </div>
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-background/60"><Icon className="h-4 w-4" /></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl lg:col-span-2">
          <div className="mb-2 text-sm font-semibold">Referrers Leaderboard</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={leaderboard} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
              <XAxis dataKey="name" className="text-[10px] text-muted-foreground" tickLine={false} axisLine={false} />
              <YAxis className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="count" fill={COLORS[0]} radius={[8, 8, 0, 0]} />
              <Bar dataKey="hired" fill={COLORS[2]} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="mb-2 text-sm font-semibold">Referrals by Department</div>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={byDept} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={45} outerRadius={85} paddingAngle={3}>
                {byDept.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
        <table className="w-full text-sm">
          <thead className="bg-accent/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="p-3">Candidate</th><th className="p-3">Role</th><th className="p-3">Referrer</th>
              <th className="p-3">Stage</th><th className="p-3">Bonus</th><th className="p-3">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {referrals.map((r) => (
              <tr key={r.id} className="border-t border-border">
                <td className="p-3"><div className="flex items-center gap-2"><CandidateAvatar name={r.candidate} size={28} />{r.candidate}</div></td>
                <td className="p-3">{r.job}</td>
                <td className="p-3 text-muted-foreground">{r.referrer}</td>
                <td className="p-3"><span className={`rounded-full px-2 py-0.5 text-[11px] capitalize ring-1 ${STAGE_TONE[r.stage]}`}>{r.stage}</span></td>
                <td className="p-3">{r.bonus ? `$${r.bonus.toLocaleString()}` : <Badge variant="secondary">—</Badge>}</td>
                <td className="p-3 text-muted-foreground">{r.submittedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
