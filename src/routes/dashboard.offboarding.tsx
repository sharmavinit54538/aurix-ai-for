import { createFileRoute } from "@tanstack/react-router";
import { LogOut, Archive, FileText, Download } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { GlassCard, Progress, StatCard } from "@/components/hrms/Shared";
import { hrms, useHrms } from "@/lib/hrms/store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/offboarding")({
  head: () => ({ meta: [{ title: "Offboarding Automation — Aurix" }] }),
  component: OffboardingPage,
});

function downloadBundle(employee: string, docs: { name: string }[]) {
  const content = docs.map((d) => `--- ${d.name} ---\nIssued for ${employee} on ${new Date().toLocaleDateString()}\n`).join("\n");
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${employee.replace(/\s+/g, "_")}_exit_bundle.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function OffboardingPage() {
  const cases = useHrms((s) => s.offboarding);
  const total = cases.length;
  const done = cases.filter((c) => c.status === "completed").length;

  return (
    <>
      <PageHeader title="Offboarding Automation" description="Auto-generated exit workflows, clearances, and document bundles." />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <StatCard label="Active offboardings" value={total - done} icon={LogOut} accent="warning" />
        <StatCard label="Completed" value={done} icon={Archive} accent="success" />
        <StatCard label="Documents ready" value={cases.reduce((s, c) => s + c.documents.filter((d) => d.ready).length, 0)} icon={FileText} accent="brand" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {cases.map((c) => {
          const taskDone = c.tasks.filter((t) => t.done).length;
          const pct = Math.round((taskDone / c.tasks.length) * 100);
          const allDocs = c.documents.every((d) => d.ready);
          return (
            <GlassCard key={c.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-medium">{c.employee}</h3>
                  <div className="mt-1 text-xs text-muted-foreground">LWD {new Date(c.lastWorkingDay).toLocaleDateString()} · {c.status}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Automation</div>
                  <div className="font-display text-lg font-semibold">{pct}%</div>
                </div>
              </div>
              <div className="mt-3"><Progress value={pct} /></div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {c.tasks.map((t) => (
                  <label key={t.key} className="flex items-center gap-2 rounded-lg border border-border bg-card/40 px-3 py-2 text-sm">
                    <input type="checkbox" checked={t.done} onChange={() => hrms.toggleOffboardingTask(c.id, t.key)} />
                    <span className={t.done ? "line-through text-muted-foreground" : ""}>{t.label}</span>
                    <span className="ml-auto text-[10px] uppercase text-muted-foreground">{t.owner}</span>
                  </label>
                ))}
              </div>

              <div className="mt-4 border-t border-border pt-3">
                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Documents</div>
                <div className="flex flex-wrap gap-2">
                  {c.documents.map((d) => (
                    <Button key={d.name} variant={d.ready ? "default" : "outline"} size="sm" onClick={() => hrms.markOffboardingDoc(c.id, d.name)} className="gap-1">
                      <FileText className="h-3.5 w-3.5" /> {d.ready ? `${d.name} ✓` : `Generate ${d.name}`}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Button size="sm" disabled={!allDocs} onClick={() => downloadBundle(c.employee, c.documents)} className="gap-2">
                  <Download className="h-4 w-4" /> Download ZIP bundle
                </Button>
                <Button size="sm" variant="outline" onClick={() => hrms.completeOffboarding(c.id)} disabled={c.status === "completed"} className="gap-2">
                  <Archive className="h-4 w-4" /> Archive employee
                </Button>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </>
  );
}
