import { createFileRoute } from "@tanstack/react-router";
import { Check, FileText, X } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAurix } from "@/lib/aurix-store";

export const Route = createFileRoute("/dashboard/leaves")({
  head: () => ({ meta: [{ title: "Leaves — Aurix" }] }),
  component: LeavesPage,
});

function LeavesPage() {
  const ws = useAurix();
  const sample = ws.employees.slice(0, 6).map((e, i) => ({
    id: e.id,
    name: e.fullName,
    type: ["Vacation", "Sick", "Personal", "Vacation", "Sick", "Bereavement"][i % 6],
    from: "Jul 0" + ((i % 8) + 1),
    to: "Jul 1" + ((i % 5) + 0),
    days: (i % 5) + 1,
    status: (["pending", "approved", "pending", "rejected", "approved", "pending"] as const)[i % 6],
  }));

  return (
    <>
      <PageHeader title="Leaves" description="Approve, decline, and track time off."
        actions={<Button variant="outline">Leave policies</Button>} />

      {sample.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
          <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground"><FileText className="h-5 w-5" /></div>
          <p className="font-medium">No leave requests</p>
          <p className="mt-1 text-sm text-muted-foreground">When employees request time off, they'll appear here.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr><th className="px-4 py-3">Employee</th><th className="px-4 py-3">Type</th><th className="px-4 py-3">Period</th><th className="px-4 py-3">Days</th><th className="px-4 py-3">Status</th><th></th></tr>
            </thead>
            <tbody>
              {sample.map((r) => (
                <tr key={r.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{r.name}</td>
                  <td className="px-4 py-3">{r.type}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.from} – {r.to}</td>
                  <td className="px-4 py-3">{r.days}</td>
                  <td className="px-4 py-3">
                    <Badge variant={r.status === "approved" ? "secondary" : r.status === "rejected" ? "destructive" : "outline"} className="capitalize">{r.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {r.status === "pending" ? (
                      <div className="flex justify-end gap-1">
                        <button className="rounded p-1.5 text-emerald-600 hover:bg-emerald-500/10"><Check className="h-4 w-4" /></button>
                        <button className="rounded p-1.5 text-destructive hover:bg-destructive/10"><X className="h-4 w-4" /></button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
