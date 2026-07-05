import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Phone, Pencil, Plus, Trash2, UserCog } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { aurix, uid, useAurix, type HR } from "@/lib/aurix-store";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/hr")({
  head: () => ({ meta: [{ title: "HR Management — Aurix" }] }),
  component: HRPage,
});

function HRPage() {
  const ws = useAurix();
  const [open, setOpen] = useState(false);
  const [d, setD] = useState<HR | null>(null);

  function openNew() { setD({ id: uid("hr"), fullName: "", email: "", phone: "", department: "", designation: "" }); setOpen(true); }
  function save() {
    if (!d) return;
    if (!d.fullName || !d.email) return toast.error("Name and email required");
    const exists = ws.hrs.some((h) => h.id === d.id);
    aurix.set({ hrs: exists ? ws.hrs.map((h) => h.id === d.id ? d : h) : [...ws.hrs, d] });
    toast.success(exists ? "HR updated" : "HR added"); setOpen(false);
  }
  function remove(id: string) { aurix.set({ hrs: ws.hrs.filter((h) => h.id !== id) }); }

  return (
    <>
      <PageHeader title="HR Management" description="People who keep the company running."
        actions={<Button onClick={openNew}><Plus className="mr-2 h-4 w-4" />Invite HR</Button>} />

      {ws.hrs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground"><UserCog className="h-5 w-5" /></div>
          <p className="font-medium">No HRs yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Invite your first HR to start managing the workforce.</p>
          <Button onClick={openNew} className="mt-4"><Plus className="mr-2 h-4 w-4" />Invite HR</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ws.hrs.map((h) => (
            <div key={h.id} className="group rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl transition-shadow hover:shadow-elegant">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-foreground text-sm font-semibold text-background">
                    {h.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <div className="font-medium">{h.fullName}</div>
                    <div className="text-xs text-muted-foreground">{h.designation || h.department || "HR"}</div>
                  </div>
                </div>
                <div className="opacity-0 transition-opacity group-hover:opacity-100">
                  <button onClick={() => { setD(h); setOpen(true); }} className="rounded p-1.5 text-muted-foreground hover:bg-accent"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => remove(h.id)} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5" />{h.email}</div>
                {h.phone ? <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{h.phone}</div> : null}
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{d && ws.hrs.some((h) => h.id === d.id) ? "Edit HR" : "Invite HR"}</DialogTitle></DialogHeader>
          {d ? (
            <div className="space-y-3">
              <Field label="Full name"><Input value={d.fullName} onChange={(e) => setD({ ...d, fullName: e.target.value })} /></Field>
              <Field label="Email"><Input type="email" value={d.email} onChange={(e) => setD({ ...d, email: e.target.value })} /></Field>
              <Field label="Phone"><Input value={d.phone} onChange={(e) => setD({ ...d, phone: e.target.value })} /></Field>
              <Field label="Department"><Input value={d.department} onChange={(e) => setD({ ...d, department: e.target.value })} /></Field>
              <Field label="Designation"><Input value={d.designation} onChange={(e) => setD({ ...d, designation: e.target.value })} /></Field>
            </div>
          ) : null}
          <DialogFooter><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button onClick={save}>Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (<div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>);
}
