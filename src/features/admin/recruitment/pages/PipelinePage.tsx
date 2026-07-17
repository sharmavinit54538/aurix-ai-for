
import { useState, useMemo } from "react";
import { LayoutGrid, Filter, Search } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { KanbanCard } from "@/features/admin/recruitment/components/Bits";
import { useRecruitment } from "@/features/admin/recruitment/hooks/useRecruitment";
import { STAGES, STAGE_LABEL, type Stage } from "@/features/admin/recruitment/types";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function PipelinePage() {
  const { candidates, jobs, moveStage } = useRecruitment();
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<Stage | null>(null);

  const [selectedJobId, setSelectedJobId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCandidates = useMemo(() => {
    return candidates.filter((c) => {
      if (selectedJobId !== "all" && c.jobId !== selectedJobId) return false;
      if (searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [candidates, selectedJobId, searchQuery]);

  function onDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData("text/plain", id);
    setDragging(id);
  }

  function onDrop(e: React.DragEvent, stage: Stage) {
    const id = e.dataTransfer.getData("text/plain");
    if (id) {
      const cand = candidates.find((c) => c.id === id);
      const name = cand ? cand.name : "Candidate";
      moveStage(id, stage);
      toast.success(`Moved ${name} to ${STAGE_LABEL[stage]}`);
    }
    setDragging(null);
    setOver(null);
  }

  return (
    <>
      <PageHeader
        title="Recruitment Pipeline"
        description="Drag candidates between stages to update their progress."
        actions={
          <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <LayoutGrid className="h-4 w-4" />Kanban view
          </div>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidates by name..."
            className="h-9 pl-9 bg-card/40"
          />
        </div>
        
        <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-3 py-1">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Job Requisition:</span>
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="bg-transparent text-xs outline-none text-foreground cursor-pointer font-medium"
          >
            <option value="all" className="bg-background">All Jobs</option>
            {jobs.map((j) => (
              <option key={j.id} value={j.id} className="bg-background">
                {j.title} ({j.department})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3" style={{ minWidth: STAGES.length * 280 }}>
          {STAGES.map((s) => {
            const inStage = filteredCandidates.filter((c) => c.stage === s);
            const isOver = over === s;
            return (
              <div
                key={s}
                onDragOver={(e) => { e.preventDefault(); setOver(s); }}
                onDragLeave={() => setOver((cur) => (cur === s ? null : cur))}
                onDrop={(e) => onDrop(e, s)}
                className={`flex w-[280px] shrink-0 flex-col rounded-2xl border bg-card/40 p-3 backdrop-blur-xl transition-colors ${
                  isOver ? "border-foreground/40 bg-accent/40" : "border-border"
                }`}
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: stageColor(s) }} />
                    <span className="font-display text-sm font-semibold">{STAGE_LABEL[s]}</span>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{inStage.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {inStage.map((c) => (
                    <KanbanCard key={c.id} c={c} onDragStart={onDragStart} />
                  ))}
                  {inStage.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border/70 p-6 text-center text-[11px] text-muted-foreground">
                      Drop candidates here
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function stageColor(s: Stage) {
  return {
    applied: "oklch(0.7 0.04 260)",
    screening: "oklch(0.7 0.18 220)",
    assessment: "oklch(0.65 0.2 270)",
    interview: "oklch(0.65 0.22 290)",
    technical: "oklch(0.66 0.22 320)",
    hr: "oklch(0.75 0.18 80)",
    offer: "oklch(0.72 0.2 50)",
    hired: "oklch(0.72 0.18 150)",
    rejected: "oklch(0.7 0.2 20)",
  }[s];
}

