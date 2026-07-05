import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calendar as CalIcon, ChevronLeft, ChevronRight, Plus, Video } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRecruitment, recruitment } from "@/lib/recruitment/store";
import type { Interview } from "@/lib/recruitment/types";

export const Route = createFileRoute("/dashboard/recruitment/calendar")({
  head: () => ({ meta: [{ title: "Interview Calendar — Recruitment" }] }),
  component: CalendarView,
});

function startOfWeek(d: Date) { const x = new Date(d); x.setDate(x.getDate() - x.getDay()); x.setHours(0, 0, 0, 0); return x; }

function CalendarView() {
  const interviews = useRecruitment((s) => s.interviews);
  const [anchor, setAnchor] = useState(new Date());
  const week = startOfWeek(anchor);
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(week); d.setDate(week.getDate() + i); return d; });

  const byDay = useMemo(() => {
    const m: Record<string, Interview[]> = {};
    interviews.forEach((iv) => { const key = new Date(iv.date).toDateString(); (m[key] ||= []).push(iv); });
    return m;
  }, [interviews]);

  function onDrop(e: React.DragEvent, day: Date) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/iv");
    const iv = interviews.find((x) => x.id === id); if (!iv) return;
    const next = new Date(iv.date); next.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
    recruitment.upsertInterview({ ...iv, date: next.toISOString() });
  }

  return (
    <>
      <PageHeader title="Interview Calendar" description="Drag-and-drop scheduling. Connect Google Calendar, Outlook, Zoom, Google Meet."
        actions={<>
          <Button variant="outline"><Video className="mr-2 h-4 w-4" />Connect Zoom</Button>
          <Button variant="outline"><CalIcon className="mr-2 h-4 w-4" />Sync Google</Button>
          <Button><Plus className="mr-2 h-4 w-4" />Schedule</Button>
        </>} />

      <div className="mb-3 flex items-center justify-between">
        <div className="inline-flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setAnchor((d) => { const n = new Date(d); n.setDate(n.getDate() - 7); return n; })}><ChevronLeft className="h-4 w-4" /></Button>
          <div className="font-display text-lg font-semibold">{days[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })} – {days[6].toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
          <Button size="sm" variant="outline" onClick={() => setAnchor((d) => { const n = new Date(d); n.setDate(n.getDate() + 7); return n; })}><ChevronRight className="h-4 w-4" /></Button>
          <Button size="sm" variant="outline" onClick={() => setAnchor(new Date())}>Today</Button>
        </div>
        <Badge variant="secondary">{interviews.length} interviews</Badge>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const list = byDay[d.toDateString()] ?? [];
          const today = d.toDateString() === new Date().toDateString();
          return (
            <div key={d.toISOString()} onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, d)}
              className={`min-h-[340px] rounded-xl border ${today ? "border-foreground/40" : "border-border"} bg-card/60 p-2 backdrop-blur-xl`}>
              <div className="mb-2 flex items-baseline justify-between px-1">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
                <div className={`text-base font-semibold ${today ? "text-foreground" : ""}`}>{d.getDate()}</div>
              </div>
              <div className="space-y-1.5">
                {list.sort((a, b) => +new Date(a.date) - +new Date(b.date)).map((iv) => (
                  <div key={iv.id} draggable onDragStart={(e) => e.dataTransfer.setData("text/iv", iv.id)}
                    className="cursor-grab rounded-md border border-border bg-background/60 p-1.5 text-[11px] shadow-sm transition-all hover:-translate-y-0.5 hover:shadow active:cursor-grabbing">
                    <div className="font-medium leading-tight">{new Date(iv.date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</div>
                    <div className="truncate font-medium">{iv.candidateName}</div>
                    <div className="truncate text-muted-foreground">{iv.round}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
