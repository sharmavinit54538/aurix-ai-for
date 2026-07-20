import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Award, Briefcase, CalendarCheck, FileSignature, GraduationCap, LogOut as LogOutIcon,
  PartyPopper, Plane, ShieldAlert, Sparkles, TrendingUp, UserCheck, UserCog, Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { GlassCard, PrintButton, SearchBox, StatusBadge, useDelayedReady, Skeleton } from "@/components/hrms/Shared";
import { useHrms } from "@/lib/hrms/store";
import type { TimelineEvent, TimelineEventKind } from "@/lib/hrms/types";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/timeline")({
  head: () => ({ meta: [{ title: "Employee Timeline — Aurix" }] }),
  component: TimelinePage,
});

const KIND_META: Record<TimelineEventKind, { icon: any; tone: "success" | "warning" | "danger" | "info" | "muted"; label: string }> = {
  joining: { icon: UserCheck, tone: "success", label: "Joining" },
  promotion: { icon: TrendingUp, tone: "success", label: "Promotion" },
  "department-change": { icon: UserCog, tone: "info", label: "Department" },
  "salary-revision": { icon: Wallet, tone: "info", label: "Salary" },
  attendance: { icon: CalendarCheck, tone: "muted", label: "Attendance" },
  leave: { icon: Plane, tone: "warning", label: "Leave" },
  performance: { icon: Sparkles, tone: "info", label: "Performance" },
  training: { icon: GraduationCap, tone: "info", label: "Training" },
  certification: { icon: FileSignature, tone: "success", label: "Certification" },
  award: { icon: Award, tone: "success", label: "Award" },
  warning: { icon: ShieldAlert, tone: "danger", label: "Warning" },
  project: { icon: Briefcase, tone: "info", label: "Project" },
  exit: { icon: LogOutIcon, tone: "danger", label: "Exit" },
};

const ALL_KINDS = Object.keys(KIND_META) as TimelineEventKind[];

export function TimelinePage() {
  const events = useHrms((s) => s.timeline);
  const ready = useDelayedReady(150);
  const [query, setQuery] = useState("");
  const [employee, setEmployee] = useState<string>("all");
  const [active, setActive] = useState<TimelineEventKind[]>(ALL_KINDS);

  const employees = useMemo(() => Array.from(new Set(events.map((e) => e.employeeName))), [events]);

  const filtered = useMemo(() => {
    return events
      .filter((e) => (employee === "all" ? true : e.employeeName === employee))
      .filter((e) => active.includes(e.kind))
      .filter((e) =>
        query.trim() === ""
          ? true
          : `${e.title} ${e.description ?? ""} ${e.employeeName}`.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) => +new Date(b.date) - +new Date(a.date));
  }, [events, employee, active, query]);

  function toggle(k: TimelineEventKind) {
    setActive((p) => (p.includes(k) ? p.filter((x) => x !== k) : [...p, k]));
  }

  return (
    <>
      <PageHeader
        title="Employee Timeline"
        description="Complete activity history across the employee lifecycle."
        actions={<PrintButton />}
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <SearchBox value={query} onChange={setQuery} placeholder="Search events…" />
        <select
          value={employee}
          onChange={(e) => setEmployee(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-3 text-sm"
        >
          <option value="all">All employees</option>
          {employees.map((e) => (
            <option key={e}>{e}</option>
          ))}
        </select>
        <Button variant="outline" size="sm" onClick={() => setActive(ALL_KINDS)} className="justify-self-start sm:justify-self-end">
          Reset filters
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {ALL_KINDS.map((k) => {
          const { icon: Icon, label, tone } = KIND_META[k];
          const on = active.includes(k);
          return (
            <button
              key={k}
              onClick={() => toggle(k)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
                on ? "border-foreground/20 bg-accent text-foreground" : "border-border bg-card/40 text-muted-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              {on ? <StatusBadge status="on" tone={tone} /> : null}
            </button>
          );
        })}
      </div>

      {!ready ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <GlassCard>
          <div className="py-10 text-center text-sm text-muted-foreground">No events match your filters.</div>
        </GlassCard>
      ) : (
        <Timeline events={filtered} />
      )}
    </>
  );
}

function Timeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative ml-3 border-l border-border">
      {events.map((e) => {
        const meta = KIND_META[e.kind];
        const Icon = meta.icon;
        return (
          <li key={e.id} className="mb-6 ml-6">
            <span
              className="absolute -left-3 grid h-6 w-6 place-items-center rounded-full ring-4 ring-background"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Icon className="h-3 w-3 text-brand-foreground" />
            </span>
            <GlassCard>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{e.title}</h3>
                    <StatusBadge status={meta.label} tone={meta.tone} />
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {e.employeeName} · {new Date(e.date).toLocaleDateString("en-US", { dateStyle: "medium" })}
                  </div>
                  {e.description ? <p className="mt-2 text-sm text-muted-foreground">{e.description}</p> : null}
                </div>
              </div>
            </GlassCard>
          </li>
        );
      })}
    </ol>
  );
}
