import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plane, Plus, MapPin, Building2, Wallet, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { GlassCard, SearchBox, StatCard, StatusBadge } from "@/components/hrms/Shared";
import { hrms, newId, useHrms } from "@/lib/hrms/store";
import type { TravelRequest, TravelStatus } from "@/lib/hrms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/dashboard/travel")({
  head: () => ({ meta: [{ title: "Travel Requests — Aurix" }] }),
  component: TravelPage,
});

const STAGES: TravelStatus[] = ["draft", "manager-review", "hr-review", "finance-review", "approved", "rejected"];

const STAGE_TONE: Record<TravelStatus, "muted" | "warning" | "info" | "success" | "danger"> = {
  draft: "muted",
  "manager-review": "warning",
  "hr-review": "warning",
  "finance-review": "info",
  approved: "success",
  rejected: "danger",
};

const NEXT_STAGE: Record<TravelStatus, TravelStatus | null> = {
  draft: "manager-review",
  "manager-review": "hr-review",
  "hr-review": "finance-review",
  "finance-review": "approved",
  approved: null,
  rejected: null,
};

function emptyTravel(): TravelRequest {
  return {
    id: newId("tr"), employee: "", type: "domestic", purpose: "", destination: "",
    travelDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 10),
    returnDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 10).toISOString().slice(0, 10),
    budget: 0, currency: "INR", status: "draft", history: [{ stage: "draft", at: new Date().toISOString() }],
    createdAt: new Date().toISOString(),
  };
}

function TravelPage() {
  const travel = useHrms((s) => s.travel);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<TravelStatus | "all">("all");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<TravelRequest>(emptyTravel());

  const stats = useMemo(() => ({
    total: travel.length,
    pending: travel.filter((t) => !["approved", "rejected"].includes(t.status)).length,
    approved: travel.filter((t) => t.status === "approved").length,
    budget: travel.reduce((s, t) => s + t.budget, 0),
  }), [travel]);

  const filtered = useMemo(() => travel
    .filter((t) => (filter === "all" ? true : t.status === filter))
    .filter((t) => query.trim() === "" ? true : `${t.employee} ${t.destination} ${t.purpose}`.toLowerCase().includes(query.toLowerCase())),
  [travel, filter, query]);

  function submit() {
    if (!draft.employee || !draft.destination) return;
    hrms.upsertTravel({ ...draft, status: "manager-review", history: [...draft.history, { stage: "manager-review", at: new Date().toISOString() }] });
    setOpen(false);
    setDraft(emptyTravel());
  }

  return (
    <>
      <PageHeader
        title="Travel Requests"
        description="Domestic and international travel approvals."
        actions={
          <Button size="sm" onClick={() => { setDraft(emptyTravel()); setOpen(true); }} className="gap-2">
            <Plus className="h-4 w-4" /> New request
          </Button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total" value={stats.total} icon={Plane} />
        <StatCard label="In review" value={stats.pending} icon={Building2} accent="warning" />
        <StatCard label="Approved" value={stats.approved} icon={CheckCircle2} accent="success" />
        <StatCard label="Budgeted" value={`₹${stats.budget.toLocaleString()}`} icon={Wallet} accent="brand" />
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchBox value={query} onChange={setQuery} placeholder="Search by employee, destination…" />
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="h-9 rounded-md border border-border bg-background px-3 text-sm">
          <option value="all">All</option>
          {STAGES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((t) => {
          const next = NEXT_STAGE[t.status];
          return (
            <GlassCard key={t.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{t.employee}</h3>
                    <StatusBadge status={t.type} tone="muted" />
                    <StatusBadge status={t.status} tone={STAGE_TONE[t.status]} />
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {t.destination}
                  </div>
                  <p className="mt-2 text-sm">{t.purpose}</p>
                  <div className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-3">
                    <div>Travel: {new Date(t.travelDate).toLocaleDateString()}</div>
                    <div>Return: {new Date(t.returnDate).toLocaleDateString()}</div>
                    <div>Budget: ₹{t.budget.toLocaleString()}</div>
                    {t.hotel ? <div>Hotel: {t.hotel}</div> : null}
                    {t.transportation ? <div>Transport: {t.transportation}</div> : null}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {next ? (
                    <>
                      <Button size="sm" onClick={() => hrms.advanceTravel(t.id, next)}>Advance → {next.replace(/-/g, " ")}</Button>
                      <Button variant="ghost" size="sm" onClick={() => hrms.advanceTravel(t.id, "rejected", "Rejected at " + t.status)}>Reject</Button>
                    </>
                  ) : <span className="text-xs text-muted-foreground">Final</span>}
                </div>
              </div>

              <div className="mt-4 border-t border-border pt-3">
                <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Approval timeline</div>
                <ol className="flex flex-wrap gap-2 text-xs">
                  {t.history.map((h, i) => (
                    <li key={i} className="inline-flex items-center gap-1 rounded-full border border-border bg-card/40 px-2 py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--gradient-brand)" }} />
                      <span className="capitalize">{h.stage.replace(/-/g, " ")}</span>
                      <span className="text-muted-foreground">· {new Date(h.at).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>New travel request</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Employee</Label><Input value={draft.employee} onChange={(e) => setDraft({ ...draft, employee: e.target.value })} /></div>
            <div>
              <Label>Type</Label>
              <select value={draft.type} onChange={(e) => setDraft({ ...draft, type: e.target.value as any })} className="h-9 w-full rounded-md border border-border bg-background px-3 text-sm">
                <option value="domestic">Domestic</option>
                <option value="international">International</option>
              </select>
            </div>
            <div className="col-span-2"><Label>Purpose</Label><Textarea value={draft.purpose} onChange={(e) => setDraft({ ...draft, purpose: e.target.value })} /></div>
            <div className="col-span-2"><Label>Destination</Label><Input value={draft.destination} onChange={(e) => setDraft({ ...draft, destination: e.target.value })} /></div>
            <div><Label>Travel date</Label><Input type="date" value={draft.travelDate.slice(0, 10)} onChange={(e) => setDraft({ ...draft, travelDate: e.target.value })} /></div>
            <div><Label>Return date</Label><Input type="date" value={draft.returnDate.slice(0, 10)} onChange={(e) => setDraft({ ...draft, returnDate: e.target.value })} /></div>
            <div><Label>Hotel</Label><Input value={draft.hotel ?? ""} onChange={(e) => setDraft({ ...draft, hotel: e.target.value })} /></div>
            <div><Label>Transportation</Label><Input value={draft.transportation ?? ""} onChange={(e) => setDraft({ ...draft, transportation: e.target.value })} /></div>
            <div className="col-span-2"><Label>Budget (₹)</Label><Input type="number" value={draft.budget} onChange={(e) => setDraft({ ...draft, budget: Number(e.target.value) })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={submit}>Submit for approval</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
