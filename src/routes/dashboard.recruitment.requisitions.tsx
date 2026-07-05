import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCircle2, Clock, FileSignature, Plus, XCircle } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/dashboard/recruitment/requisitions")({
  head: () => ({ meta: [{ title: "Requisitions — Recruitment" }] }),
  component: Requisitions,
});

type ReqStatus = "draft" | "pending" | "approved" | "rejected";

interface Requisition {
  id: string;
  title: string;
  department: string;
  raisedBy: string;
  budget: string;
  headcount: number;
  priority: "High" | "Medium" | "Low";
  status: ReqStatus;
  approvers: { name: string; role: string; status: "pending" | "approved" | "rejected" }[];
  raisedAt: string;
  reason: string;
}

const seed: Requisition[] = [];

const STATUS_TONE: Record<ReqStatus, string> = {
  draft: "bg-muted text-muted-foreground ring-border",
  pending: "bg-amber-500/15 text-amber-700 ring-amber-500/20 dark:text-amber-300",
  approved: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
  rejected: "bg-rose-500/15 text-rose-600 ring-rose-500/20 dark:text-rose-300",
};

function Requisitions() {
  const [items, setItems] = useState<Requisition[]>(seed);
  const [filter, setFilter] = useState<ReqStatus | "all">("all");

  const filtered = items.filter((i) => filter === "all" || i.status === filter);
  const counts = {
    all: items.length,
    draft: items.filter((i) => i.status === "draft").length,
    pending: items.filter((i) => i.status === "pending").length,
    approved: items.filter((i) => i.status === "approved").length,
    rejected: items.filter((i) => i.status === "rejected").length,
  };

  const decide = (id: string, status: "approved" | "rejected") =>
    setItems((arr) => arr.map((r) => (r.id === id ? { ...r, status } : r)));

  function createRequisition() {
    const newId = `req-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq: Requisition = {
      id: newId,
      title: "Senior Product Designer",
      department: "Design",
      raisedBy: "Company Admin",
      budget: "$120k–$150k",
      headcount: 1,
      priority: "Medium",
      status: "pending",
      raisedAt: new Date().toISOString().split("T")[0],
      reason: "Hiring for product scaling",
      approvers: [
        { name: "Finance Manager", role: "Finance", status: "pending" }
      ]
    };
    setItems((arr) => [newReq, ...arr]);
  }

  return (
    <>
      <PageHeader
        title="Hiring Requisitions"
        description="Multi-level approval workflow for new open positions."
        actions={<Button onClick={createRequisition}><Plus className="mr-2 h-4 w-4" />New Requisition</Button>}
      />

      <div className="mb-3 flex flex-wrap gap-2">
        {(["all", "draft", "pending", "approved", "rejected"] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ring-1 transition-colors ${filter === s ? "bg-foreground text-background ring-foreground" : "ring-border hover:bg-accent/40"}`}>
            {s} <span className="ml-1 opacity-70">{counts[s]}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40">
          <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground">
            <FileSignature className="h-5 w-5" />
          </div>
          <p className="font-medium">No hiring requisitions available</p>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Raise a hiring requisition to initiate the headcount approval process.
          </p>
          <Button onClick={createRequisition} className="mt-4">
            <Plus className="mr-2 h-4 w-4" /> Create Requisition
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileSignature className="h-4 w-4 text-muted-foreground" />
                    <div className="font-display font-semibold">{r.title}</div>
                    <span className={`rounded-full px-2 py-0.5 text-[11px] capitalize ring-1 ${STATUS_TONE[r.status]}`}>{r.status}</span>
                    <Badge variant="outline" className="text-[10px]">{r.priority}</Badge>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {r.id} · {r.department} · {r.headcount} headcount · {r.budget} · raised by {r.raisedBy} on {r.raisedAt}
                  </div>
                  <div className="mt-2 max-w-2xl text-sm">{r.reason}</div>
                </div>
                {r.status === "pending" && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => decide(r.id, "rejected")}><XCircle className="mr-1 h-3.5 w-3.5" />Reject</Button>
                    <Button size="sm" onClick={() => decide(r.id, "approved")}><CheckCircle2 className="mr-1 h-3.5 w-3.5" />Approve</Button>
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-2 border-t border-border pt-3">
                {r.approvers.map((a, i) => {
                  const Icon = a.status === "approved" ? CheckCircle2 : a.status === "rejected" ? XCircle : Clock;
                  const tone = a.status === "approved" ? "text-emerald-600" : a.status === "rejected" ? "text-rose-600" : "text-amber-600";
                  return (
                    <div key={i} className="flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2 py-1 text-xs">
                      <Icon className={`h-3.5 w-3.5 ${tone}`} />
                      <span className="font-medium">{a.name}</span>
                      <span className="text-muted-foreground">· {a.role}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
