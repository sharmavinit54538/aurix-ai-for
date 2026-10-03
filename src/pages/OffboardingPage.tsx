import { useState, useEffect, useCallback } from "react";
import { LogOut, Archive, FileText, Download, RefreshCw, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { GlassCard, Progress, StatCard } from "@/components/hrms/Shared";
import { offboardingApi } from "@/services/offboardingApi";
import type { OffboardingCase } from "@/lib/hrms/types";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function downloadBundle(employee: string, docs: { name: string }[]) {
  const content = docs
    .map(
      (d) =>
        `--- ${d.name} ---\nIssued for ${employee} on ${new Date().toLocaleDateString()}\n`,
    )
    .join("\n");
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${employee.replace(/\s+/g, "_")}_exit_bundle.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export function OffboardingPage() {
  const [cases, setCases] = useState<OffboardingCase[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOffboardings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await offboardingApi.getOffboardings();
      setCases(res.items);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to load offboardings";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOffboardings();
  }, [loadOffboardings]);

  const total = cases.length;
  const done = cases.filter((c) => c.status === "completed").length;

  async function handleToggleTask(caseId: string, taskKey: string, currentDone: boolean) {
    try {
      const updated = await offboardingApi.toggleExitTask(caseId, taskKey, !currentDone);
      setCases((prev) => prev.map((c) => (c.id === caseId ? updated : c)));
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update offboarding task");
    }
  }

  async function handleGenerateDoc(caseId: string, docName: string) {
    try {
      const updated = await offboardingApi.generateExitDocument(caseId, docName);
      setCases((prev) => prev.map((c) => (c.id === caseId ? updated : c)));
      toast.success(`${docName} generated successfully`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to generate document");
    }
  }

  async function handleComplete(caseId: string) {
    try {
      const updated = await offboardingApi.completeExit(caseId);
      setCases((prev) => prev.map((c) => (c.id === caseId ? updated : c)));
      toast.success("Employee offboarding completed and archived");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to complete offboarding");
    }
  }

  if (error && cases.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <AlertCircle className="h-10 w-10 text-rose-500 mb-3" />
        <h3 className="text-lg font-semibold mb-1">Failed to load offboarding records</h3>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button onClick={loadOffboardings} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <StatCard label="Active offboardings" value={total - done} icon={LogOut} accent="warning" />
        <StatCard label="Completed" value={done} icon={Archive} accent="success" />
        <StatCard
          label="Documents ready"
          value={cases.reduce((s, c) => s + c.documents.filter((d) => d.ready).length, 0)}
          icon={FileText}
          accent="brand"
        />
      </div>

      {loading ? (
        <div className="p-8 text-center text-muted-foreground flex items-center justify-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" /> Loading offboardings...
        </div>
      ) : cases.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground">
          No offboarding cases found.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {cases.map((c) => {
            const taskDone = c.tasks.filter((t) => t.done).length;
            const pct = c.tasks.length ? Math.round((taskDone / c.tasks.length) * 100) : 0;
            const allDocs = c.documents.length > 0 && c.documents.every((d) => d.ready);
            return (
              <GlassCard key={c.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-medium">{c.employee}</h3>
                    <div className="mt-1 text-xs text-muted-foreground">
                      LWD {new Date(c.lastWorkingDay).toLocaleDateString()} · {c.status}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground">Automation</div>
                    <div className="font-display text-lg font-semibold">{pct}%</div>
                  </div>
                </div>
                <div className="mt-3">
                  <Progress value={pct} />
                </div>

                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {c.tasks.map((t) => (
                    <label
                      key={t.key}
                      className="flex items-center gap-2 rounded-lg border border-border bg-card/40 px-3 py-2 text-sm cursor-pointer hover:bg-card/70 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={t.done}
                        onChange={() => handleToggleTask(c.id, t.key, t.done)}
                      />
                      <span className={t.done ? "line-through text-muted-foreground" : ""}>
                        {t.label}
                      </span>
                      <span className="ml-auto text-[10px] uppercase text-muted-foreground">
                        {t.owner}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-4 border-t border-border pt-3">
                  <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Documents
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {c.documents.map((d) => (
                      <Button
                        key={d.name}
                        variant={d.ready ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleGenerateDoc(c.id, d.name)}
                        className="gap-1"
                      >
                        <FileText className="h-3.5 w-3.5" />{" "}
                        {d.ready ? `${d.name} ✓` : `Generate ${d.name}`}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button
                    size="sm"
                    disabled={!allDocs}
                    onClick={() => downloadBundle(c.employee, c.documents)}
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" /> Download ZIP bundle
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleComplete(c.id)}
                    disabled={c.status === "completed"}
                    className="gap-2"
                  >
                    <Archive className="h-4 w-4" /> Archive employee
                  </Button>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </>
  );
}

export default OffboardingPage;
