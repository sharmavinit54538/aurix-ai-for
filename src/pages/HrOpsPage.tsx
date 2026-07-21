import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Activity, Package, Users, Receipt, Plane, LogOut, UserCheck, Archive,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { GlassCard, StatCard } from "@/components/hrms/Shared";
import { useHrms } from "@/lib/hrms/store";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";



const QUICK_LINKS = [
  { to: "/dashboard/timeline", label: "Timeline", icon: Activity },
  { to: "/dashboard/assets", label: "Assets", icon: Package },
  { to: "/dashboard/visitors", label: "Visitors", icon: Users },
  { to: "/dashboard/expenses", label: "Expenses", icon: Receipt },
  { to: "/dashboard/travel", label: "Travel", icon: Plane },
  { to: "/dashboard/exit", label: "Exit", icon: LogOut },
  { to: "/dashboard/onboarding-checklist", label: "Onboarding", icon: UserCheck },
  { to: "/dashboard/offboarding", label: "Offboarding", icon: Archive },
];

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];

export function HrOpsPage() {
  const s = useHrms((x) => x);

  const expenseStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    s.expenses.forEach((e) => { counts[e.status] = (counts[e.status] ?? 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [s.expenses]);

  const assetStatus = useMemo(() => {
    const counts: Record<string, number> = {};
    s.assets.forEach((a) => { counts[a.status] = (counts[a.status] ?? 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [s.assets]);

  return (
    <>
      <PageHeader title="HR Operations" description="Real-time view across the people lifecycle." />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Timeline events" value={s.timeline.length} icon={Activity} />
        <StatCard label="Assets tracked" value={s.assets.length} icon={Package} accent="brand" />
        <StatCard label="Visitors today" value={s.visitors.filter((v) => new Date(v.createdAt).toDateString() === new Date().toDateString()).length} icon={Users} accent="success" />
        <StatCard label="Expense claims" value={s.expenses.length} icon={Receipt} accent="warning" />
        <StatCard label="Travel requests" value={s.travel.length} icon={Plane} />
        <StatCard label="Onboardings" value={s.onboarding.length} icon={UserCheck} accent="success" />
        <StatCard label="Offboardings" value={s.offboarding.length} icon={Archive} accent="warning" />
        <StatCard label="Exits in progress" value={s.exits.filter((e) => e.stage !== "settled").length} icon={LogOut} accent="danger" />
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map((l) => (
          <Link key={l.to} to={l.to as any} className="group rounded-2xl border border-border bg-card/40 p-4 transition-colors hover:bg-accent/60">
            <div className="flex items-center gap-3">
              <div className="grid h-9 w-9 place-items-center rounded-xl text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
                <l.icon className="h-4 w-4" />
              </div>
              <div className="font-medium">{l.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-2 font-medium">Expense pipeline</div>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={expenseStatus}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard>
          <div className="mb-2 font-medium">Asset status</div>
          <div className="h-64">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={assetStatus} dataKey="value" nameKey="name" outerRadius={90} label>
                  {assetStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard className="lg:col-span-2">
          <div className="mb-3 font-medium">Recent timeline events</div>
          <ul className="divide-y divide-border">
            {s.timeline.slice(0, 8).map((t) => (
              <li key={t.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <div className="font-medium">{t.title}</div>
                  <div className="text-xs text-muted-foreground">{t.employeeName} · {new Date(t.date).toLocaleDateString()}</div>
                </div>
                <span className="text-xs uppercase text-muted-foreground">{t.kind.replace(/-/g, " ")}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </>
  );
}

export default HrOpsPage;
