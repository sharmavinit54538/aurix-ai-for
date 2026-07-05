import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Clock, FileCheck2, Send, X } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRecruitment } from "@/lib/recruitment/store";
import { CandidateAvatar, fmtDate, fmtMoney } from "@/components/recruitment/Bits";
import type { Offer } from "@/lib/recruitment/types";

export const Route = createFileRoute("/dashboard/recruitment/offers")({
  head: () => ({ meta: [{ title: "Offers — Recruitment" }] }),
  component: Offers,
});

function Offers() {
  const offers = useRecruitment((s) => s.offers);
  const [selected, setSelected] = useState<string | null>(offers[0]?.id ?? null);
  const active = offers.find((o) => o.id === selected) ?? offers[0];

  return (
    <>
      <PageHeader
        title="Offers"
        description={`${offers.length} offers in progress`}
        actions={<Button><Send className="mr-2 h-4 w-4" />New Offer</Button>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-2 lg:col-span-1">
          {offers.map((o) => (
            <button
              key={o.id}
              onClick={() => setSelected(o.id)}
              className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                active?.id === o.id ? "border-foreground/40 bg-accent/40" : "border-border bg-card/60 hover:bg-accent/30"
              } backdrop-blur-xl`}
            >
              <CandidateAvatar name={o.candidateName} size={36} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{o.candidateName}</div>
                <div className="truncate text-xs text-muted-foreground">{o.jobTitle}</div>
              </div>
              <StatusPill status={o.status} />
            </button>
          ))}
        </div>

        {active ? (
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-border bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-6 backdrop-blur-xl">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Offer</div>
                  <h2 className="font-display text-xl font-semibold">{active.candidateName}</h2>
                  <Link to="/dashboard/recruitment/candidates/$candidateId" params={{ candidateId: active.candidateId }} className="text-xs text-muted-foreground hover:underline">{active.jobTitle}</Link>
                </div>
                <StatusPill status={active.status} />
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <Stat label="Base Salary" value={fmtMoney(active.salary, active.currency)} />
                <Stat label="Joining Date" value={fmtDate(active.joiningDate)} />
                <Stat label="Sent" value={active.sentAt ? fmtDate(active.sentAt) : "—"} />
              </div>
              <div className="mt-6">
                <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground">Benefits</div>
                <div className="flex flex-wrap gap-1.5">{active.benefits.map((b) => <Badge key={b} variant="outline">{b}</Badge>)}</div>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
              <h3 className="mb-3 font-display text-sm font-semibold">Approval Timeline</h3>
              <ol className="relative space-y-4 border-l border-border pl-5">
                {active.approvals.map((a, i) => (
                  <li key={i} className="relative">
                    <span className={`absolute -left-[27px] top-1 grid h-4 w-4 place-items-center rounded-full ${
                      a.status === "approved" ? "bg-emerald-500 text-white" : a.status === "rejected" ? "bg-rose-500 text-white" : "bg-muted text-muted-foreground"
                    }`}>
                      {a.status === "approved" ? <Check className="h-2.5 w-2.5" /> : a.status === "rejected" ? <X className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
                    </span>
                    <div className="text-sm font-medium">{a.stage}</div>
                    <div className="text-xs text-muted-foreground">{a.by} · {fmtDate(a.at)} · <span className="capitalize">{a.status}</span></div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 p-3">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 font-display text-base font-semibold">{value}</div>
    </div>
  );
}

function StatusPill({ status }: { status: Offer["status"] }) {
  const cls = {
    "accepted": "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20",
    "declined": "bg-rose-500/15 text-rose-600 ring-rose-500/20",
    "expired": "bg-muted text-muted-foreground ring-border",
    "sent": "bg-sky-500/15 text-sky-600 ring-sky-500/20",
    "draft": "bg-muted text-muted-foreground ring-border",
    "pending-approval": "bg-amber-500/15 text-amber-700 ring-amber-500/20",
  }[status];
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ${cls}`}>{status.replace("-", " ")}</span>;
}
