import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  CalendarDays, Check, Clock, X, RefreshCw, Fingerprint, ScrollText, Palmtree
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAurix } from "@/lib/aurix-store";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/attendance/")({
  head: () => ({ meta: [{ title: "Attendance — Aurix" }] }),
  component: AttendancePage,
});

export interface AttendanceModuleDef {
  id: string;
  title: string;
  description: string;
  icon: any;
  to: string;
  color: string;
}

export const ATTENDANCE_MODULES_LIST: AttendanceModuleDef[] = [
  {
    id: "checkin",
    title: "Check In / Check Out",
    description: "Punch daily shift entries, view real-time break counters, and verify geofenced zones.",
    icon: Fingerprint,
    to: "/dashboard/attendance/checkin",
    color: "from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "shifts",
    title: "Shifts",
    description: "Manage core timing schedules, night shift premiums, and grace-period rules.",
    icon: Clock,
    to: "/dashboard/attendance/shifts",
    color: "from-indigo-500/20 to-purple-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "rosters",
    title: "Rosters",
    description: "Schedule dynamic rotational team rosters and assign backup resources.",
    icon: ScrollText,
    to: "/dashboard/attendance/rosters",
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "holidays",
    title: "Holidays",
    description: "Setup the corporate holiday calendar, regional leaves, and optional off days.",
    icon: Palmtree,
    to: "/dashboard/attendance/holidays",
    color: "from-amber-500/20 to-yellow-500/20 text-amber-400 border-amber-500/30",
  },
];

type ViewMode = "modules" | "analytics";

function AttendancePage() {
  const [viewMode, setViewMode] = useState<ViewMode>("modules");
  const ws = useAurix();
  const today = "Thursday, June 25, 2026";

  function statusFor(id: string): "present" | "late" | "absent" | "leave" {
    const x = id.split("").reduce((s, c) => s + c.charCodeAt(0), 0) % 10;
    if (x < 7) return "present";
    if (x < 8) return "late";
    if (x < 9) return "leave";
    return "absent";
  }

  const stats = ws.employees.reduce(
    (acc, e) => {
      acc[statusFor(e.id)]++;
      return acc;
    },
    { present: 0, late: 0, absent: 0, leave: 0 }
  );

  const cards = [
    { key: "present", label: "Present", color: "text-emerald-500", icon: Check },
    { key: "late", label: "Late", color: "text-amber-500", icon: Clock },
    { key: "leave", label: "On leave", color: "text-blue-500", icon: CalendarDays },
    { key: "absent", label: "Absent", color: "text-destructive", icon: X },
  ] as const;

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-glow">
              <CalendarDays className="h-5 w-5" />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Attendance Hub</h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground text-left">
            {today}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-card/65 border border-border/80 p-0.5 rounded-lg">
            <Button
              variant={viewMode === "modules" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("modules")}
              className="text-xs h-7 px-3 font-semibold rounded-md cursor-pointer"
            >
              Attendance Hub
            </Button>
            <Button
              variant={viewMode === "analytics" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("analytics")}
              className="text-xs h-7 px-3 font-semibold rounded-md cursor-pointer"
            >
              Attendance Dashboard
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Attendance data refreshed")}
            className="h-8 gap-1.5 cursor-pointer text-xs"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {viewMode === "modules" ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ATTENDANCE_MODULES_LIST.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.id}
                  to={module.to as any}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-card/75 hover:shadow-lg hover:shadow-indigo-500/5 text-left cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${module.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-indigo-400">
                        {module.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-normal">
                        {module.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cards.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.key} className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{c.label}</span>
                    <Icon className={`h-4 w-4 ${c.color}`} />
                  </div>
                  <div className="mt-3 font-display text-3xl font-semibold tracking-tight">{stats[c.key]}</div>
                </div>
              );
            })}
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
            <div className="border-b border-border px-4 py-3 text-left">
              <h3 className="font-medium">Today's attendance</h3>
            </div>
            {ws.employees.length === 0 ? (
              <div className="p-12 text-center text-sm text-muted-foreground">No employees to display.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Employee</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Check-in</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
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
        </div>
      )}
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl text-left">
      <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-2xl font-semibold tracking-tight">{value}</div>
    </div>
  );
}
