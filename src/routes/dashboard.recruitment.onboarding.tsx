import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, FileText, Laptop, Plus, UserCheck, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { CandidateAvatar } from "@/components/recruitment/Bits";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRecruitment } from "@/lib/recruitment/store";

export const Route = createFileRoute("/dashboard/recruitment/onboarding")({
  head: () => ({ meta: [{ title: "Onboarding — Recruitment" }] }),
  component: Onboarding,
});

interface Task { id: string; label: string; group: "Docs" | "IT" | "Equipment" | "Welcome"; done: boolean }
const TEMPLATE: Omit<Task, "id" | "done">[] = [
  { label: "Offer letter signed", group: "Docs" },
  { label: "NDA signed", group: "Docs" },
  { label: "Tax forms (W-4 / equivalent)", group: "Docs" },
  { label: "ID & address verification", group: "Docs" },
  { label: "Laptop provisioned", group: "Equipment" },
  { label: "Monitor / accessories shipped", group: "Equipment" },
  { label: "Email & SSO account", group: "IT" },
  { label: "Slack / Teams workspace", group: "IT" },
  { label: "Access to repos / tools", group: "IT" },
  { label: "Welcome kit shipped", group: "Welcome" },
  { label: "Buddy assigned", group: "Welcome" },
  { label: "Day-1 calendar set up", group: "Welcome" },
];

const GROUP_ICON = { Docs: FileText, IT: Laptop, Equipment: Laptop, Welcome: UserCheck };

function Onboarding() {
  const candidates = useRecruitment((s) => s.candidates);
  const hired = useMemo(() => candidates.filter((c) => c.stage === "hired" || c.stage === "offer"), [candidates]);
  const [tasks, setTasks] = useState<Record<string, Task[]>>(() => Object.fromEntries(hired.map((c) => [c.id, TEMPLATE.map((t, i) => ({ id: `${c.id}-${i}`, done: i % 3 !== 0, ...t }))])));
  const [activeId, setActiveId] = useState(hired[0]?.id ?? "");

  const active = hired.find((c) => c.id === activeId);
  const list = active ? tasks[active.id] ?? [] : [];
  function toggle(id: string) {
    if (!active) return;
    setTasks((m) => ({ ...m, [active.id]: list.map((t) => t.id === id ? { ...t, done: !t.done } : t) }));
  }
  const pct = (arr: Task[]) => arr.length ? Math.round((arr.filter((t) => t.done).length / arr.length) * 100) : 0;

  return (
    <>
      <PageHeader title="Employee Onboarding" description="Bridge from offer accepted to day-one productivity."
        actions={<Button><Plus className="mr-2 h-4 w-4" />New Onboarding</Button>} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { k: "In Onboarding", v: hired.length, icon: UserPlus },
          { k: "Completed (30d)", v: 12, icon: CheckCircle2 },
          { k: "Avg Time to Productive", v: "14d", icon: UserCheck },
          { k: "Pending Tasks", v: Object.values(tasks).flat().filter((t) => !t.done).length, icon: FileText },
        ].map((s) => { const I = s.icon; return (
          <div key={s.k} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="flex items-center justify-between text-xs text-muted-foreground"><span>{s.k}</span><I className="h-4 w-4" /></div>
            <div className="mt-2 font-display text-2xl font-semibold">{s.v}</div>
          </div>
        );})}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[300px_1fr]">
        <aside className="space-y-1.5 rounded-2xl border border-border bg-card/60 p-2 backdrop-blur-xl">
          {hired.map((c) => {
            const p = pct(tasks[c.id] ?? []);
            return (
              <button key={c.id} onClick={() => setActiveId(c.id)} className={`w-full rounded-lg p-2 text-left transition-colors ${activeId === c.id ? "bg-accent" : "hover:bg-accent/50"}`}>
                <div className="flex items-center gap-2"><CandidateAvatar name={c.name} size={28} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{c.name}</div>
                    <div className="truncate text-[10px] text-muted-foreground">{c.appliedPosition}</div>
                  </div>
                  <span className="text-[10px] font-semibold">{p}%</span>
                </div>
                <Progress value={p} className="mt-1.5 h-1" />
              </button>
            );
          })}
          {hired.length === 0 ? <div className="p-6 text-center text-xs text-muted-foreground">No hires yet.</div> : null}
        </aside>

        <section className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          {active ? (
            <>
              <div className="mb-4 flex items-center gap-3">
                <CandidateAvatar name={active.name} size={48} />
                <div className="flex-1">
                  <div className="font-display text-lg font-semibold">{active.name}</div>
                  <div className="text-xs text-muted-foreground">{active.appliedPosition} · joining soon</div>
                </div>
                <Badge variant="secondary">Buddy: Sara Iqbal</Badge>
              </div>

              <div className="mb-3"><Progress value={pct(list)} className="h-2" /><div className="mt-1 text-xs text-muted-foreground">{pct(list)}% complete</div></div>

              {(["Docs", "Equipment", "IT", "Welcome"] as const).map((g) => {
                const I = GROUP_ICON[g];
                return (
                  <div key={g} className="mb-3">
                    <div className="mb-1.5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><I className="h-3.5 w-3.5" /> {g}</div>
                    <div className="space-y-1">
                      {list.filter((t) => t.group === g).map((t) => (
                        <label key={t.id} className="flex items-center gap-2 rounded-md border border-border bg-card/40 px-3 py-2 text-sm">
                          <input type="checkbox" checked={t.done} onChange={() => toggle(t.id)} />
                          <span className={t.done ? "line-through opacity-60" : ""}>{t.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </>
          ) : <div className="p-8 text-center text-sm text-muted-foreground">Select a new hire to manage onboarding.</div>}
        </section>
      </div>
    </>
  );
}
