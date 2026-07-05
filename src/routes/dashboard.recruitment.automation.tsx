import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, Clock, Mail, Plus, Power, Trash2, UserCheck, Workflow, Zap } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/dashboard/recruitment/automation")({
  head: () => ({ meta: [{ title: "Automation — Recruitment" }] }),
  component: Automation,
});

interface Rule { id: string; name: string; trigger: string; action: string; enabled: boolean; runs: number; icon: any }

const seed: Rule[] = [];

function Automation() {
  const [rules, setRules] = useState<Rule[]>(seed);
  const [name, setName] = useState("");

  function createRule() {
    if (!name.trim()) return;
    setRules((a) => [
      { id: `r-${Date.now()}`, name, trigger: "Candidate applies", action: "Assign recruiter based on job dept", enabled: true, runs: 0, icon: Zap },
      ...a
    ]);
    setName("");
  }

  return (
    <>
      <PageHeader title="Workflow Automation" description="Trigger-based rules, SLA alerts, and AI-powered auto-actions." />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[
          { k: "Active Rules", v: rules.filter((r) => r.enabled).length },
          { k: "Total Runs (30d)", v: rules.reduce((a, r) => a + r.runs, 0).toLocaleString() },
          { k: "Time Saved", v: "0h" },
          { k: "SLA Breaches", v: 0 },
        ].map((s) => (
          <div key={s.k} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="text-xs text-muted-foreground">{s.k}</div>
            <div className="mt-2 font-display text-2xl font-semibold">{s.v}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl lg:col-span-2">
          <div className="mb-3 flex items-center gap-2">
            <Input placeholder="New rule name (e.g. Auto-tag senior candidates)" value={name} onChange={(e) => setName(e.target.value)} />
            <Button onClick={createRule}>
              <Plus className="mr-1 h-4 w-4" />Add Rule
            </Button>
          </div>
          
          {rules.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40">
              <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
                <Bot className="h-5 w-5" />
              </div>
              <p className="font-medium">No active automation rules</p>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Create a workflow rule to automate notifications, candidate updates, and assessments.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {rules.map((r) => {
                const I = r.icon;
                return (
                  <div key={r.id} className="flex items-center gap-3 rounded-xl border border-border bg-card/40 p-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-accent"><I className="h-4 w-4" /></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2"><span className="text-sm font-medium">{r.name}</span>{r.enabled ? <Badge variant="secondary" className="text-[9px]">Active</Badge> : <Badge variant="outline" className="text-[9px]">Paused</Badge>}</div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">When <span className="font-medium text-foreground">{r.trigger}</span> → <span className="font-medium text-foreground">{r.action}</span></div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground">{r.runs} runs · last 30 days</div>
                    </div>
                    <Switch checked={r.enabled} onCheckedChange={(v) => setRules((a) => a.map((x) => x.id === r.id ? { ...x, enabled: v } : x))} />
                    <Button size="sm" variant="ghost" onClick={() => setRules((a) => a.filter((x) => x.id !== r.id))}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="mb-2 inline-flex items-center gap-2 text-sm font-semibold"><Power className="h-4 w-4" /> SLA Targets</div>
            {[
              { k: "Response to candidate", v: "24h", current: 0 },
              { k: "Stage move after screening", v: "3d", current: 0 },
              { k: "Interview feedback", v: "48h", current: 0 },
              { k: "Offer decision", v: "5d", current: 0 },
            ].map((s) => (
              <div key={s.k} className="flex items-center justify-between border-b border-border py-1.5 text-xs last:border-0">
                <span className="text-muted-foreground">{s.k}</span>
                <span className="font-medium">{s.current} / {s.v}</span>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="mb-2 text-sm font-semibold">Recipe Library</div>
            <div className="space-y-1.5 text-xs">
              {["Stale candidate nudge", "Offer reminder cadence", "Interviewer reminder 1h before", "Reject after 14d inactive", "Auto-tag remote-first candidates"].map((t) => (
                <button key={t} className="flex w-full items-center gap-2 rounded-md border border-border p-2 text-left hover:bg-accent/50"><Zap className="h-3 w-3 text-muted-foreground" />{t}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
