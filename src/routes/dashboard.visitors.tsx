import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { UserPlus, LogIn, LogOut as LogOutIcon, CheckCircle2, XCircle, QrCode } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { GlassCard, QrTile, SearchBox, StatCard, StatusBadge } from "@/components/hrms/Shared";
import { hrms, newId, useHrms } from "@/lib/hrms/store";
import type { Visitor, VisitorStatus } from "@/lib/hrms/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

export const Route = createFileRoute("/dashboard/visitors")({
  head: () => ({ meta: [{ title: "Visitor Management — Aurix" }] }),
  component: VisitorsPage,
});

const STATUS_TONE: Record<VisitorStatus, "info" | "success" | "warning" | "danger" | "muted"> = {
  pending: "warning",
  approved: "info",
  "checked-in": "success",
  "checked-out": "muted",
  rejected: "danger",
};

function emptyVisitor(): Visitor {
  return {
    id: newId("v"),
    name: "",
    company: "",
    hostEmployee: "",
    purpose: "",
    expectedDurationMins: 30,
    status: "pending",
    passCode: `VIS-${Math.floor(Math.random() * 9000 + 1000)}`,
    createdAt: new Date().toISOString(),
  };
}

export function VisitorsPage() {
  const visitors = useHrms((s) => s.visitors);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<VisitorStatus | "all">("all");
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Visitor>(emptyVisitor());
  const [pass, setPass] = useState<Visitor | null>(null);

  const stats = useMemo(() => ({
    total: visitors.length,
    checkedIn: visitors.filter((v) => v.status === "checked-in").length,
    pending: visitors.filter((v) => v.status === "pending").length,
    today: visitors.filter((v) => new Date(v.createdAt).toDateString() === new Date().toDateString()).length,
  }), [visitors]);

  const filtered = useMemo(() => visitors
    .filter((v) => (filter === "all" ? true : v.status === filter))
    .filter((v) => query.trim() === "" ? true : `${v.name} ${v.company ?? ""} ${v.hostEmployee} ${v.purpose}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)),
  [visitors, filter, query]);

  const hourly = useMemo(() => {
    const buckets = Array.from({ length: 12 }, (_, i) => ({ hour: `${i + 8}:00`, visitors: 0 }));
    visitors.forEach((v) => {
      const d = v.checkInAt ? new Date(v.checkInAt) : new Date(v.createdAt);
      const h = d.getHours() - 8;
      if (h >= 0 && h < 12) buckets[h].visitors += 1;
    });
    return buckets;
  }, [visitors]);

  function save() {
    if (!draft.name || !draft.hostEmployee) return;
    hrms.upsertVisitor(draft);
    setOpen(false);
    setPass(draft);
    setDraft(emptyVisitor());
  }

  return (
    <>
      <PageHeader
        title="Visitor Management"
        description="Check in, approve, and track on-site visitors."
        actions={
          <Button size="sm" onClick={() => { setDraft(emptyVisitor()); setOpen(true); }} className="gap-2">
            <UserPlus className="h-4 w-4" /> New visitor
          </Button>
        }
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Visitors today" value={stats.today} icon={UserPlus} />
        <StatCard label="Checked-in" value={stats.checkedIn} icon={LogIn} accent="success" />
        <StatCard label="Pending approval" value={stats.pending} icon={CheckCircle2} accent="warning" />
        <StatCard label="All-time" value={stats.total} icon={UserPlus} accent="muted" />
      </div>

      <GlassCard className="mb-6">
        <div className="mb-2 font-medium">Today's check-ins by hour</div>
        <div className="h-56">
          <ResponsiveContainer>
            <AreaChart data={hourly}>
              <defs>
                <linearGradient id="vg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="hour" fontSize={12} />
              <YAxis allowDecimals={false} fontSize={12} />
              <Tooltip />
              <Area dataKey="visitors" stroke="#8b5cf6" fill="url(#vg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchBox value={query} onChange={setQuery} placeholder="Search visitors…" />
        <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="h-9 rounded-md border border-border bg-background px-3 text-sm">
          <option value="all">All</option>
          {(["pending", "approved", "checked-in", "checked-out", "rejected"] as VisitorStatus[]).map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        {filtered.map((v) => (
          <GlassCard key={v.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{v.name}</h3>
                  <StatusBadge status={v.status} tone={STATUS_TONE[v.status]} />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {v.company ? `${v.company} · ` : ""}Host: {v.hostEmployee}
                </div>
                <div className="mt-2 text-sm">{v.purpose}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  Duration: {v.expectedDurationMins} min
                  {v.checkInAt ? ` · In ${new Date(v.checkInAt).toLocaleTimeString()}` : ""}
                  {v.checkOutAt ? ` · Out ${new Date(v.checkOutAt).toLocaleTimeString()}` : ""}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Button variant="ghost" size="icon" onClick={() => setPass(v)} aria-label="Show pass"><QrCode className="h-4 w-4" /></Button>
                {v.status === "pending" ? (
                  <div className="flex gap-1">
                    <Button size="sm" onClick={() => hrms.setVisitorStatus(v.id, "approved")}>Approve</Button>
                    <Button variant="outline" size="sm" onClick={() => hrms.setVisitorStatus(v.id, "rejected")}>Reject</Button>
                  </div>
                ) : v.status === "approved" ? (
                  <Button size="sm" onClick={() => hrms.checkInVisitor(v.id)} className="gap-1"><LogIn className="h-3.5 w-3.5" /> Check in</Button>
                ) : v.status === "checked-in" ? (
                  <Button size="sm" variant="outline" onClick={() => hrms.checkOutVisitor(v.id)} className="gap-1"><LogOutIcon className="h-3.5 w-3.5" /> Check out</Button>
                ) : (
                  <span className="text-xs text-muted-foreground">{v.status === "rejected" ? <XCircle className="h-4 w-4 text-rose-500" /> : "Done"}</span>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>New visitor</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Label>Visitor name</Label><Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></div>
            <div><Label>Company</Label><Input value={draft.company} onChange={(e) => setDraft({ ...draft, company: e.target.value })} /></div>
            <div><Label>Phone</Label><Input value={draft.phone ?? ""} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></div>
            <div><Label>Email</Label><Input value={draft.email ?? ""} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /></div>
            <div><Label>Host employee</Label><Input value={draft.hostEmployee} onChange={(e) => setDraft({ ...draft, hostEmployee: e.target.value })} /></div>
            <div className="col-span-2"><Label>Purpose</Label><Input value={draft.purpose} onChange={(e) => setDraft({ ...draft, purpose: e.target.value })} /></div>
            <div><Label>Duration (mins)</Label><Input type="number" value={draft.expectedDurationMins} onChange={(e) => setDraft({ ...draft, expectedDurationMins: Number(e.target.value) })} /></div>
            <div><Label>Photo URL</Label><Input value={draft.photoUrl ?? ""} onChange={(e) => setDraft({ ...draft, photoUrl: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Create pass</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!pass} onOpenChange={(o) => !o && setPass(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Visitor Pass</DialogTitle></DialogHeader>
          {pass ? (
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="text-lg font-semibold">{pass.name}</div>
              <div className="text-xs text-muted-foreground">Host: {pass.hostEmployee}</div>
              <QrTile value={`AURIX-VISITOR:${pass.passCode}`} label={pass.passCode} size={170} />
              <Button variant="outline" size="sm" onClick={() => window.print()}>Print pass</Button>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
