import { createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Check, Clock, X } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { useAurix } from "@/lib/aurix-store";

export const Route = createFileRoute("/dashboard/attendance/")({
  head: () => ({ meta: [{ title: "Attendance — Aurix" }] }),
  component: AttendancePage,
});

function AttendancePage() {
  const ws = useAurix();
  // Static date string — avoids SSR/client hydration mismatch (locale-safe, time-safe)
  const today = "Thursday, June 25, 2026";

  // Generate deterministic mock status from each employee id
  function statusFor(id: string): "present" | "late" | "absent" | "leave" {
    const x = id.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % 10;
    if (x < 7) return "present";
    if (x < 8) return "late";
    if (x < 9) return "leave";
    return "absent";
  }

  const stats = ws.employees.reduce((acc, e) => { acc[statusFor(e.id)]++; return acc; }, { present: 0, late: 0, absent: 0, leave: 0 });
  const cards = [
    { key: "present", label: "Present", color: "text-emerald-500", icon: Check },
    { key: "late", label: "Late", color: "text-amber-500", icon: Clock },
    { key: "leave", label: "On leave", color: "text-blue-500", icon: CalendarDays },
    { key: "absent", label: "Absent", color: "text-destructive", icon: X },
  ] as const;

  return (
    <>
      <PageHeader title="Attendance" description={today} />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.key} className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</span>
                <Icon className={`h-4 w-4 ${c.color}`} />
              </div>
              <div className="mt-3 font-display text-3xl font-semibold tracking-tight">{stats[c.key]}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
        <div className="border-b border-border px-4 py-3"><h3 className="font-medium">Today's attendance</h3></div>
        {ws.employees.length === 0 ? (
          <div className="p-12 text-center text-sm text-muted-foreground">No employees to display.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr><th className="px-4 py-3">Employee</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Check-in</th><th className="px-4 py-3">Status</th></tr>
              </thead>
              <tbody>
                {ws.employees.map((e) => {
                  const s = statusFor(e.id);
                  const checkIn = s === "present" ? "09:0" + (e.id.length % 9) : s === "late" ? "10:1" + (e.id.length % 9) : "—";
                  return (
                    <tr key={e.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{e.fullName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{e.department || "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{checkIn}</td>
                      <td className="px-4 py-3">
                        <Badge variant={s === "present" ? "secondary" : s === "absent" ? "destructive" : "outline"} className="capitalize">{s}</Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
