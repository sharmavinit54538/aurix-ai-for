import { useState } from "react";
import { ClipboardCheck, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Competency { name: string; weight: number; }
interface Scorecard {
  id: string;
  name: string;
  role: string;
  round: string;
  competencies: Competency[];
  usedIn: number;
}

const seed: Scorecard[] = [];

export function ScorecardsPage() {
  const [items, setItems] = useState<Scorecard[]>(seed);
  const [active, setActive] = useState("");
  const current = items.find((s) => s.id === active) ?? items[0] ?? null;

  const update = (patch: Partial<Scorecard>) => {
    if (!current) return;
    setItems((arr) => arr.map((s) => (s.id === current.id ? { ...s, ...patch } : s)));
  };

  const setComp = (i: number, patch: Partial<Competency>) => {
    if (!current) return;
    update({ competencies: current.competencies.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) });
  };

  const total = current ? current.competencies.reduce((a, c) => a + c.weight, 0) : 0;

  function addNewScorecard() {
    const newId = `sc_${Date.now()}`;
    const newSc: Scorecard = {
      id: newId,
      name: "New Scorecard Template",
      role: "Engineering",
      round: "Technical",
      usedIn: 0,
      competencies: [
        { name: "Technical Fit", weight: 50 },
        { name: "Cultural Fit", weight: 50 },
      ]
    };
    setItems((arr) => [...arr, newSc]);
    setActive(newId);
  }

  return (
    <>
      <PageHeader
        title="Interview Scorecards"
        description="Structured rubrics ensure consistent, bias-aware interview decisions."
        actions={<Button onClick={addNewScorecard}><Plus className="mr-2 h-4 w-4" />New Scorecard</Button>}
      />

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
            <ClipboardCheck className="h-5 w-5" />
          </div>
          <p className="font-medium">No scorecards available</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Create a custom interview scorecard template to start structural candidate assessments.
          </p>
          <Button onClick={addNewScorecard} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Create Scorecard
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-1">
            {items.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all backdrop-blur-xl ${
                  current && current.id === s.id ? "border-foreground/40 bg-accent/40" : "border-border bg-card/60 hover:bg-accent/30"
                }`}
              >
                <ClipboardCheck className="mt-0.5 h-4 w-4 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{s.name}</div>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Badge variant="secondary" className="text-[10px]">{s.role}</Badge>
                    <span>{s.round}</span>
                    <span>· {s.usedIn} interviews</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {current && (
            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <Input value={current.name} onChange={(e) => update({ name: e.target.value })} className="max-w-md text-base font-semibold" />
                <Badge variant={total === 100 ? "default" : "destructive"}>Weight: {total}%</Badge>
              </div>

              <div className="space-y-2">
                {current.competencies.map((c, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-xl border border-border bg-background/60 p-2">
                    <Input value={c.name} onChange={(e) => setComp(i, { name: e.target.value })} className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0" />
                    <div className="flex items-center gap-2">
                      <input type="range" min={0} max={100} step={5} value={c.weight} onChange={(e) => setComp(i, { weight: Number(e.target.value) })} className="w-32" />
                      <span className="w-10 text-right text-xs tabular-nums">{c.weight}%</span>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => update({ competencies: current.competencies.filter((_, idx) => idx !== i) })}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => update({ competencies: [...current.competencies, { name: "New competency", weight: 10 }] })}>
                  <Plus className="mr-1 h-3.5 w-3.5" />Add competency
                </Button>
              </div>

              <div className="mt-4 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
                Interviewers rate each competency 1–5. Weighted score auto-calculates and rolls up into the candidate's overall rating.
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

