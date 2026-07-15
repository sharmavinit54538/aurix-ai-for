import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, Filter, Plus, Search, Users } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CandidateRow } from "@/components/recruitment/Bits";
import { useRecruitment } from "@/lib/recruitment/store";
import { EmptyState } from "@/components/hrms/Shared";
import { STAGES, STAGE_LABEL, type Stage } from "@/lib/recruitment/types";

export const Route = createFileRoute("/dashboard/recruitment/candidates/")({
  head: () => ({ meta: [{ title: "Candidates — Recruitment" }] }),
  component: Candidates,
});

function Candidates() {
  const candidates = useRecruitment((s) => s.candidates);
  const [q, setQ] = useState("");
  const [stage, setStage] = useState<"all" | Stage>("all");
  const [minScore, setMinScore] = useState(0);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (stage !== "all" && c.stage !== stage) return false;
      if ((c.atsScore ?? 0) < minScore) return false;
      if (q && !`${c.name} ${c.appliedPosition} ${c.skills.join(" ")} ${c.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [candidates, q, stage, minScore]);

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  }

  return (
    <>
      <PageHeader
        title="Candidates"
        description={`${filtered.length} of ${candidates.length} candidates`}
        actions={
          <>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
            <Button><Plus className="mr-2 h-4 w-4" />Add Candidate</Button>
          </>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, role, skill, tag…" className="h-9 pl-9" />
        </div>
        <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-2 py-1">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Stage:</span>
          <select value={stage} onChange={(e) => setStage(e.target.value as any)} className="bg-transparent text-xs capitalize outline-none">
            <option value="all" className="bg-background">All</option>
            {STAGES.map((s) => <option key={s} value={s} className="bg-background">{STAGE_LABEL[s]}</option>)}
          </select>
        </div>
        <div className="inline-flex items-center gap-2 rounded-md border border-border bg-card/60 px-3 py-1">
          <span className="text-xs text-muted-foreground">Min ATS:</span>
          <input type="range" min={0} max={100} value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className="w-24 accent-foreground" />
          <span className="w-8 text-xs font-medium">{minScore}</span>
        </div>
      </div>

      {selected.size > 0 ? (
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-border bg-card/80 p-2 backdrop-blur-xl">
          <Badge>{selected.size} selected</Badge>
          <Button size="sm" variant="outline">Move to stage</Button>
          <Button size="sm" variant="outline">Tag</Button>
          <Button size="sm" variant="outline">Email</Button>
          <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
        </div>
      ) : null}

      {filtered.length === 0 ? (
        <EmptyState title="No candidates match" description="Adjust filters or add a candidate." icon={Users} />
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => (
            <div key={c.id} className="flex items-center gap-2">
              <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} className="h-4 w-4 accent-foreground" />
              <div className="flex-1"><CandidateRow c={c} /></div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
