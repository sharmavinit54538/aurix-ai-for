import { createFileRoute } from "@tanstack/react-router";
import { Download } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { useAurix } from "@/lib/aurix-store";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/dashboard/reports")({
  head: () => ({ meta: [{ title: "Reports — Aurix" }] }),
  component: ReportsPage,
});

const COLORS = ["oklch(0.6 0.2 285)", "oklch(0.7 0.18 320)", "oklch(0.65 0.16 200)", "oklch(0.75 0.15 90)", "oklch(0.55 0.18 25)"];

export function ReportsPage() {
  const ws = useAurix();
  const byDept = Object.entries(
    ws.employees.reduce<Record<string, number>>((acc, e) => { const k = e.department || "Unassigned"; acc[k] = (acc[k] || 0) + 1; return acc; }, {}),
  ).map(([name, value]) => ({ name, value }));

  const tenure = [
    { range: "0–1y", n: 8 }, { range: "1–2y", n: 14 }, { range: "2–3y", n: 9 }, { range: "3–5y", n: 5 }, { range: "5y+", n: 3 },
  ];
  const headcount = [
    { m: "Jan", n: 24 }, { m: "Feb", n: 27 }, { m: "Mar", n: 28 }, { m: "Apr", n: 31 }, { m: "May", n: 34 }, { m: "Jun", n: 38 }, { m: "Jul", n: 41 },
  ];

  return (
    <>
      <PageHeader title="Reports" description="Cross-cut insights about your workforce."
        actions={<Button variant="outline"><Download className="mr-2 h-4 w-4" />Export PDF</Button>} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Headcount over time" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={headcount} margin={{ top: 10, right: 10, left: -10 }}>
              <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
              <XAxis dataKey="m" stroke="currentColor" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
              <YAxis stroke="currentColor" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Line type="monotone" dataKey="n" stroke="oklch(0.6 0.2 285)" strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
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
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={tenure} margin={{ top: 10, right: 10, left: -20 }}>
              <CartesianGrid stroke="oklch(0.5 0.02 264 / 0.15)" vertical={false} />
              <XAxis dataKey="range" stroke="currentColor" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
              <YAxis stroke="currentColor" className="text-xs text-muted-foreground" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8 }} />
              <Bar dataKey="n" radius={[6, 6, 0, 0]} fill="oklch(0.7 0.18 320)" />
            </BarChart>
          </ResponsiveContainer>
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
