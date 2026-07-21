import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, RefreshCw, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import apiInstance from "@/api/apiInstance";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";



const COLORS = ["oklch(0.6 0.2 285)", "oklch(0.7 0.18 320)", "oklch(0.65 0.16 200)", "oklch(0.75 0.15 90)", "oklch(0.55 0.18 25)"];

export function ReportsPage() {
  const [headcount, setHeadcount] = useState<{ m: string; n: number }[]>([]);
  const [byDept, setByDept] = useState<{ name: string; value: number }[]>([]);
  const [tenure, setTenure] = useState<{ range: string; n: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReportsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [hcRes, deptRes, tenRes] = await Promise.allSettled([
        apiInstance.get("/reports/analytics/headcount"),
        apiInstance.get("/reports/analytics/department"),
        apiInstance.get("/reports/analytics/tenure"),
      ]);

      if (hcRes.status === "fulfilled") {
        setHeadcount(hcRes.value.data?.data || []);
      }
      if (deptRes.status === "fulfilled") {
        setByDept(deptRes.value.data?.data || []);
      }
      if (tenRes.status === "fulfilled") {
        setTenure(tenRes.value.data?.data || []);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to load reports data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-20 w-full rounded-2xl" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Skeleton className="h-72 lg:col-span-2 rounded-2xl" />
          <Skeleton className="h-72 rounded-2xl" />
          <Skeleton className="h-72 lg:col-span-3 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Reports"
        description="Live PostgreSQL cross-cut insights about your workforce."
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchReportsData} className="gap-1.5">
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
            <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export PDF</Button>
          </div>
        }
      />

      {error ? (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-xs text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="outline" onClick={fetchReportsData} className="gap-1.5">
            Retry
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Headcount over time" className="lg:col-span-2">
          {headcount.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={headcount} margin={{ top: 10, right: 10, left: -10 }}>
                <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
                <XAxis dataKey="m" stroke="currentColor" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Line type="monotone" dataKey="n" stroke="oklch(0.6 0.2 285)" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : <Empty />}
        </Card>

        <Card title="By department">
          {byDept.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={byDept} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={3}>
                  {byDept.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <Empty />}
        </Card>

        <Card title="Tenure distribution" className="lg:col-span-3">
          {tenure.length ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={tenure} margin={{ top: 10, right: 10, left: -20 }}>
                <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
                <XAxis dataKey="range" stroke="currentColor" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
                <YAxis stroke="currentColor" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
                <Bar dataKey="n" radius={[6, 6, 0, 0]} fill="oklch(0.7 0.18 320)" />
              </BarChart>
            </ResponsiveContainer>
          ) : <Empty />}
        </Card>
      </div>
    </>
  );
}

function Card({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl ${className}`}>
      <h3 className="mb-4 font-medium">{title}</h3>
      {children}
    </div>
  );
}
function Empty() { return <div className="grid h-[260px] place-items-center text-sm text-muted-foreground">Not enough data yet</div>; }

export default ReportsPage;
