import { useMemo, useState } from "react";
import { AlertCircle, RefreshCw, Search } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { KanbanCard } from "@/features/admin/recruitment/components/Bits";
import { useRecruitment } from "@/features/admin/recruitment/hooks/useRecruitment";
import { STAGES, STAGE_LABEL, type Stage } from "@/features/admin/recruitment/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/api/utils";
import { toast } from "sonner";

export function PipelinePage() {
  const { candidates, jobs, loading, error, moveStage, refreshAll } = useRecruitment();
  const [over, setOver] = useState<Stage | null>(null);
  const [q, setQ] = useState("");
  const [jobId, setJobId] = useState("all");
  const [movingId, setMovingId] = useState<string | null>(null);

  const filteredCandidates = useMemo(() => {
    const query = q.trim().toLowerCase();
    return candidates.filter((c) => {
      if (jobId !== "all" && c.jobId !== jobId) return false;
      if (!query) return true;
      return `${c.name} ${c.appliedPosition} ${c.skills.join(" ")}`.toLowerCase().includes(query);
    });
  }, [candidates, jobId, q]);

  function onDragStart(e: React.DragEvent, candidateId: string, applicationId?: string) {
    e.dataTransfer.setData("text/candidate-id", candidateId);
    e.dataTransfer.setData("text/application-id", applicationId || "");
  }

  async function onDrop(e: React.DragEvent, stage: Stage) {
    e.preventDefault();
    setOver(null);
    const applicationId = e.dataTransfer.getData("text/application-id");
    const candidateId = e.dataTransfer.getData("text/candidate-id");

    const cand = candidates.find(
      (c) => (applicationId && c.applicationId === applicationId) || c.id === candidateId,
    );
    const targetAppId = applicationId || cand?.applicationId;

    if (!targetAppId) {
      toast.error("Cannot move candidate: missing backend application ID.");
      return;
    }
    if (cand && cand.stage === stage) return;

    setMovingId(targetAppId);
    try {
      await moveStage(targetAppId, stage);
      toast.success(`Moved ${cand?.name || "Candidate"} to ${STAGE_LABEL[stage]}.`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to update pipeline stage."));
    } finally {
      setMovingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <PageHeader
        title="Hiring Pipeline"
        description="Drag candidates between stages to update application status on the backend."
        actions={
          <Button variant="outline" size="sm" onClick={refreshAll} disabled={loading || Boolean(movingId)}>
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        }
      />

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="outline" onClick={refreshAll}>
            Retry
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter candidates by name, role, skills..."
            className="h-9 pl-9"
          />
        </div>
        <select
          aria-label="Filter pipeline by job"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          className="h-9 rounded-md border border-border bg-background px-2.5 text-xs"
        >
          <option value="all">All Roles</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3" style={{ minWidth: STAGES.length * 280 }}>
          {STAGES.map((s) => {
            const inStage = filteredCandidates.filter((c) => c.stage === s);
            const isOver = over === s;
            return (
              <div
                key={s}
                onDragOver={(e) => {
                  e.preventDefault();
                  setOver(s);
                }}
                onDragLeave={() => setOver(null)}
                onDrop={(e) => void onDrop(e, s)}
                className={`flex w-[270px] shrink-0 flex-col rounded-2xl border p-3 transition-colors ${
                  isOver ? "border-primary bg-primary/5" : "border-border bg-card/50"
                }`}
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: stageColor(s) }} />
                    <span className="font-display text-sm font-semibold">{STAGE_LABEL[s]}</span>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {inStage.length}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {inStage.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-muted-foreground">
                      Drop candidate here
                    </div>
                  ) : (
                    inStage.map((c) => (
                      <div key={`${c.id}-${c.applicationId || "noapp"}`}>
                        <KanbanCard c={c} onDragStart={onDragStart} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function stageColor(s: Stage) {
  switch (s) {
    case "applied":
      return "#64748b";
    case "screening":
      return "#0ea5e9";
    case "assessment":
      return "#6366f1";
    case "interview":
      return "#8b5cf6";
    case "technical":
      return "#d946ef";
    case "hr":
      return "#f59e0b";
    case "offer":
      return "#f97316";
    case "hired":
      return "#10b981";
    case "rejected":
      return "#f43f5e";
  }
}
