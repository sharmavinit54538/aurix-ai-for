import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LayoutGrid } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { KanbanCard } from "@/components/recruitment/Bits";
import { recruitment, useRecruitment } from "@/lib/recruitment/store";
import { STAGES, STAGE_LABEL, type Stage } from "@/lib/recruitment/types";

export const Route = createFileRoute("/dashboard/recruitment/pipeline")({
  head: () => ({ meta: [{ title: "Pipeline — Recruitment" }] }),
  component: Pipeline,
});

function Pipeline() {
  const candidates = useRecruitment((s) => s.candidates);
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<Stage | null>(null);

  function onDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData("text/plain", id);
    setDragging(id);
  }
  function onDrop(e: React.DragEvent, stage: Stage) {
    const id = e.dataTransfer.getData("text/plain");
    if (id) recruitment.moveStage(id, stage);
    setDragging(null);
    setOver(null);
  }

  return (
    <>
      <PageHeader
        title="Recruitment Pipeline"
        description="Drag candidates between stages to update their progress."
        actions={<div className="inline-flex items-center gap-2 text-xs text-muted-foreground"><LayoutGrid className="h-4 w-4" />Kanban view</div>}
      />

      <div className="overflow-x-auto pb-4">
        <div className="flex gap-3" style={{ minWidth: STAGES.length * 280 }}>
          {STAGES.map((s) => {
            const inStage = candidates.filter((c) => c.stage === s);
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
