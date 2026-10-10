import { Link } from "@tanstack/react-router";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Activity, Package, Users, Receipt, Plane, LogOut, UserCheck, Archive, RefreshCw, AlertCircle,
  Server,
} from "lucide-react";
import { GlassCard, StatCard } from "@/components/hrms/Shared";
import { Button } from "@/components/ui/button";
import {
  Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { toast } from "sonner";
import { hrOpsApi, type HrOpsOverview } from "@/services/hrOpsApi";
import type { TimelineEvent } from "@/lib/hrms/types";

const QUICK_LINKS = [
  { to: "/dashboard/hr-operations/onboarding", label: "Onboarding", icon: UserCheck },
  { to: "/dashboard/hr-operations/timeline", label: "Timeline", icon: Activity },
  { to: "/dashboard/resources/assets", label: "Assets", icon: Package },
  { to: "/dashboard/expenses", label: "Expenses", icon: Receipt },
  { to: "/dashboard/travel", label: "Travel", icon: Plane },
  { to: "/dashboard/hr-operations/offboarding", label: "Offboarding", icon: Archive },
  { to: "/dashboard/hr-operations/exit-management", label: "Exit", icon: LogOut },
];

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6"];

export function HrOpsPage() {
  const [data, setData] = useState<HrOpsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverUnavailable, setServerUnavailable] = useState(false);

  const loadOverview = useCallback(async () => {
    setLoading(true);
    setError(null);
    setServerUnavailable(false);
    try {
      // The /api/v2/hr-ops/overview endpoint is not yet available on the backend.
      // Show "not available yet" state instead of calling the missing endpoint.
      setServerUnavailable(true);
      setData(null);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load HR Operations overview";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const expenseStatus = useMemo(() => {
    if (!data?.expenses?.byStatus) return [];
    return Object.entries(data.expenses.byStatus).map(([name, value]) => ({ name, value }));
  }, [data]);

  const assetStatus = useMemo(() => {
    if (!data?.assets?.byStatus) return [];
    return Object.entries(data.assets.byStatus).map(([name, value]) => ({ name, value }));
  }, [data]);

  if (error && !data) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="h-10 w-10 text-rose-500 mb-3" />
        <h3 className="text-lg font-semibold mb-1">Failed to load HR Operations</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadOverview} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      {serverUnavailable && (
        <div className="mb-6 rounded-2xl border border-dashed border-border bg-card/40 p-6 text-center">
          <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-xl text-amber-500 border border-amber-500/20">
            <Server className="h-5 w-5" />
          </div>
          <h3 className="font-semibold text-foreground mb-1">HR Operations Overview Unavailable</h3>
          <p className="text-sm text-muted-foreground mb-4">
            The HR Operations overview dashboard is not available yet. Backend endpoint is pending implementation.
          </p>
          <p className="text-xs text-muted-foreground">
            Use the quick links below to access individual HR Operations modules.
          </p>
        </div>
      )}

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Timeline events" value={data?.timeline?.length ?? 0} icon={Activity} />
        <StatCard label="Assets tracked" value={data?.assets?.total ?? 0} icon={Package} accent="brand" />
        <StatCard label="Visitors today" value={data?.visitors?.today ?? 0} icon={Users} accent="success" />
        <StatCard label="Expense claims" value={data?.expenses?.total ?? 0} icon={Receipt} accent="warning" />
        <StatCard label="Travel requests" value={data?.travel?.total ?? 0} icon={Plane} />
        <StatCard label="Onboardings" value={data?.onboarding?.active ?? 0} icon={UserCheck} accent="success" />
        <StatCard label="Offboardings" value={data?.offboarding?.active ?? 0} icon={Archive} accent="warning" />
        <StatCard label="Exits in progress" value={data?.exits?.inProgress ?? 0} icon={LogOut} accent="danger" />
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

      {loading ? (
        <div className="p-8 text-center text-muted-foreground flex items-center justify-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" /> Loading overview charts...
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <GlassCard>
            <div className="mb-2 font-medium">Expense pipeline</div>
            <div className="h-64">
              {expenseStatus.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={expenseStatus}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis allowDecimals={false} fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#6366f1" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="grid h-full place-items-center text-xs text-muted-foreground">
                  No expense records logged
                </div>
              )}
            </div>
          </GlassCard>
          <GlassCard>
            <div className="mb-2 font-medium">Asset status</div>
            <div className="h-64">
              {assetStatus.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={assetStatus} dataKey="value" nameKey="name" outerRadius={90} label>
                      {assetStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="grid h-full place-items-center text-xs text-muted-foreground">
                  No asset records categorized
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-2">
            <div className="mb-3 font-medium">Recent timeline events</div>
            {data?.timeline && data.timeline.length > 0 ? (
              <ul className="divide-y divide-border">
                {data.timeline.slice(0, 8).map((t: TimelineEvent) => (
                  <li key={t.id} className="flex items-center justify-between py-2 text-sm">
                    <div>
                      <div className="font-medium">{t.title}</div>
                      <div className="text-xs text-muted-foreground">{t.employeeName} · {new Date(t.date).toLocaleDateString()}</div>
                    </div>
                    <span className="text-xs uppercase text-muted-foreground">{t.kind.replace(/-/g, " ")}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No recent timeline events recorded.
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </>
  );
}

export default HrOpsPage;
