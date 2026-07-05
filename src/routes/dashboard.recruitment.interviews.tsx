import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calendar, CheckCircle2, Clock, ExternalLink, Star, Video } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRecruitment } from "@/lib/recruitment/store";
import { CandidateAvatar, fmtDate } from "@/components/recruitment/Bits";

export const Route = createFileRoute("/dashboard/recruitment/interviews")({
  head: () => ({ meta: [{ title: "Interviews — Recruitment" }] }),
  component: Interviews,
});

function Interviews() {
  const interviews = useRecruitment((s) => s.interviews);
  const [tab, setTab] = useState<"upcoming" | "completed" | "calendar">("upcoming");

  const upcoming = useMemo(() => interviews.filter((i) => i.status === "scheduled").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [interviews]);
  const completed = useMemo(() => interviews.filter((i) => i.status === "completed"), [interviews]);

  // simple calendar: next 14 days
  const days = useMemo(() => {
    const arr: { date: Date; items: typeof interviews }[] = [];
    for (let i = 0; i < 14; i++) {
      const d = new Date(); d.setDate(d.getDate() + i); d.setHours(0, 0, 0, 0);
      const items = interviews.filter((iv) => {
        const id = new Date(iv.date); id.setHours(0, 0, 0, 0);
        return id.getTime() === d.getTime();
      });
      arr.push({ date: d, items });
    }
    return arr;
  }, [interviews]);

  return (
    <>
      <PageHeader
        title="Interviews"
        description="Schedule, review, and track every interview round."
        actions={<Button><Calendar className="mr-2 h-4 w-4" />Schedule</Button>}
      />

      <div className="mb-4 inline-flex rounded-md border border-border bg-card/60 p-1">
        {([
          { k: "upcoming", l: "Upcoming", c: upcoming.length },
          { k: "completed", l: "Completed", c: completed.length },
          { k: "calendar", l: "Calendar", c: interviews.length },
        ] as const).map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium ${tab === t.k ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t.l}<span className="rounded-full bg-muted px-1.5 text-[10px]">{t.c}</span>
          </button>
        ))}
      </div>

      {tab !== "calendar" ? (
        <div className="space-y-2">
          {(tab === "upcoming" ? upcoming : completed).map((iv) => (
            <div key={iv.id} className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <CandidateAvatar name={iv.candidateName} size={40} />
              <div className="min-w-0 flex-1">
                <Link to="/dashboard/recruitment/candidates/$candidateId" params={{ candidateId: iv.candidateId }} className="text-sm font-medium hover:underline">{iv.candidateName}</Link>
                <div className="truncate text-xs text-muted-foreground">{iv.jobTitle} · {iv.round}</div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="h-3.5 w-3.5" />{new Date(iv.date).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">·{iv.durationMins}m</span>
                <span className="text-muted-foreground">{iv.interviewer}</span>
              </div>
              {iv.status === "completed" && iv.rating ? (
                <div className="flex">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className={`h-3.5 w-3.5 ${j < (iv.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />)}</div>
              ) : null}
              <Badge variant="outline" className="capitalize">{iv.status}</Badge>
              <Button size="sm" variant="outline" asChild>
                <a href={iv.meetingLink} target="_blank" rel="noreferrer"><Video className="mr-2 h-3.5 w-3.5" />Join</a>
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-7">
          {days.map((d, i) => (
            <div key={i} className={`min-h-[140px] rounded-xl border border-border bg-card/60 p-3 backdrop-blur-xl ${d.items.length ? "ring-1 ring-foreground/10" : ""}`}>
              <div className="mb-2 flex items-center justify-between">
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{d.date.toLocaleDateString([], { weekday: "short" })}</div>
                <div className="font-display text-sm font-semibold">{d.date.getDate()}</div>
              </div>
              <div className="space-y-1.5">
                {d.items.map((iv) => (
                  <Link key={iv.id} to="/dashboard/recruitment/candidates/$candidateId" params={{ candidateId: iv.candidateId }}
                    className="block rounded-md bg-accent/60 px-2 py-1 text-[10px] hover:bg-accent">
                    <div className="font-medium">{new Date(iv.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                    <div className="truncate">{iv.candidateName}</div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
