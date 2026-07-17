import { Link } from "@tanstack/react-router";

import { useMemo, useState } from "react";
import { Calendar as CalIcon, ChevronLeft, ChevronRight, Plus, Video } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRecruitment, newId } from "@/features/admin/recruitment/hooks/useRecruitment";
import type { Interview } from "@/features/admin/recruitment/types";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { apiInstance } from "@/api";

function startOfWeek(d: Date) { const x = new Date(d); x.setDate(x.getDate() - x.getDay()); x.setHours(0, 0, 0, 0); return x; }

export function RecruitmentCalendarPage() {
  const { interviews, candidates, moveStage, upsertInterview, refreshAll } = useRecruitment();
  const [anchor, setAnchor] = useState(new Date());

  // Modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({
    candidateId: "",
    round: "Technical Round",
    interviewer: "",
    date: "",
    time: "10:00",
    duration: "45",
    meetingLink: "https://meet.google.com/abc-xyz-123",
  });

  const week = startOfWeek(anchor);
  const days = Array.from({ length: 7 }, (_, i) => { const d = new Date(week); d.setDate(week.getDate() + i); return d; });

  const byDay = useMemo(() => {
    const m: Record<string, Interview[]> = {};
    interviews.forEach((iv) => { const key = new Date(iv.date).toDateString(); (m[key] ||= []).push(iv); });
    return m;
  }, [interviews]);

  async function onDrop(e: React.DragEvent, day: Date) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/iv");
    const iv = interviews.find((x) => x.id === id); if (!iv) return;
    const next = new Date(iv.date); next.setFullYear(day.getFullYear(), day.getMonth(), day.getDate());
    
    const updatedIv = { ...iv, date: next.toISOString() };
    
    try {
      await upsertInterview(updatedIv);
      toast.success(`Rescheduled ${iv.candidateName}'s interview to ${day.toLocaleDateString([], { month: "short", day: "numeric" })}`);
    } catch (err) {
      toast.error("Failed to reschedule interview.");
    }
  }

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleForm.candidateId || !scheduleForm.interviewer || !scheduleForm.date) {
      toast.error("Please fill in all required details.");
      return;
    }

    const cand = candidates.find((c) => c.id === scheduleForm.candidateId);
    if (!cand) return;

    const newIvId = newId("iv");
    const newIv: Interview = {
      id: newIvId,
      candidateId: cand.id,
      candidateName: cand.name,
      jobTitle: cand.appliedPosition || "Position",
      interviewer: scheduleForm.interviewer,
      round: scheduleForm.round,
      date: `${scheduleForm.date}T${scheduleForm.time}:00Z`,
      durationMins: Number(scheduleForm.duration),
      meetingLink: scheduleForm.meetingLink,
      status: "scheduled",
    };

    try {
      if (cand.applicationId) {
        await apiInstance.post(`/applications/${cand.applicationId}/send-interview?round_names=${encodeURIComponent(scheduleForm.round)}`);
        moveStage(cand.applicationId, "interview");
      }
      await upsertInterview(newIv);
      toast.success("Interview scheduled successfully!");
      setShowScheduleModal(false);
      await refreshAll();
    } catch (err) {
      await upsertInterview(newIv);
      toast.success("Interview scheduled successfully (saved locally)!");
      setShowScheduleModal(false);
    }
  };

  return (
    <>
      <PageHeader title="Interview Calendar" description="Drag-and-drop scheduling. Connect Google Calendar, Outlook, Zoom, Google Meet."
        actions={<>
          <Button variant="outline" onClick={() => toast.success("Redirecting to Zoom Integration authorization...")}><Video className="mr-2 h-4 w-4" />Connect Zoom</Button>
          <Button variant="outline" onClick={() => toast.success("Syncing Google Calendar with Aurix AI...")}><CalIcon className="mr-2 h-4 w-4" />Sync Google</Button>
          <Button onClick={() => setShowScheduleModal(true)}><Plus className="mr-2 h-4 w-4" />Schedule</Button>
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
              className={`min-h-[340px] rounded-xl border ${today ? "border-foreground/40 bg-card/85 ring-1 ring-foreground/15" : "border-border bg-card/60"} p-2 backdrop-blur-xl transition-colors hover:border-foreground/20`}>
              <div className="mb-2 flex items-baseline justify-between px-1">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{d.toLocaleDateString("en-US", { weekday: "short" })}</div>
                <div className={`text-base font-semibold ${today ? "text-primary font-bold" : ""}`}>{d.getDate()}</div>
              </div>
              <div className="space-y-1.5">
                {list.sort((a, b) => +new Date(a.date) - +new Date(b.date)).map((iv) => (
                  <div key={iv.id} draggable onDragStart={(e) => e.dataTransfer.setData("text/iv", iv.id)}
                    className="cursor-grab rounded-md border border-border bg-background/60 p-1.5 text-[11px] shadow-sm transition-all hover:bg-accent/20 active:cursor-grabbing">
                    <div className="font-medium leading-tight text-primary">{new Date(iv.date).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</div>
                    <Link to="/dashboard/recruitment/candidates/$candidateId" params={{ candidateId: iv.candidateId }}
                      className="truncate font-semibold hover:underline block cursor-pointer text-foreground">
                      {iv.candidateName}
                    </Link>
                    <div className="truncate text-[10px] text-muted-foreground">{iv.round}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Interview Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Interview Round</DialogTitle>
            <DialogDescription>Set up a new interview slot for a candidate.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleScheduleSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="sched-cand">Select Candidate *</Label>
              <select
                id="sched-cand"
                value={scheduleForm.candidateId}
                onChange={(e) => setScheduleForm({ ...scheduleForm, candidateId: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              >
                <option value="">-- Choose Candidate --</option>
                {candidates.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.appliedPosition || "No Position"})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="sched-round">Interview Round</Label>
              <select
                id="sched-round"
                value={scheduleForm.round}
                onChange={(e) => setScheduleForm({ ...scheduleForm, round: e.target.value })}
                className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="Screening Round">Screening Round</option>
                <option value="Technical Round">Technical Round</option>
                <option value="Manager Round">Manager Round</option>
                <option value="HR Round">HR Round</option>
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="sched-interviewer">Interviewer Name *</Label>
              <Input
                id="sched-interviewer"
                placeholder="e.g. John Doe"
                value={scheduleForm.interviewer}
                onChange={(e) => setScheduleForm({ ...scheduleForm, interviewer: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="sched-date">Date *</Label>
                <Input
                  id="sched-date"
                  type="date"
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sched-time">Time *</Label>
                <Input
                  id="sched-time"
                  type="time"
                  value={scheduleForm.time}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="sched-duration">Duration (Minutes)</Label>
                <Input
                  id="sched-duration"
                  type="number"
                  min="15"
                  max="180"
                  value={scheduleForm.duration}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, duration: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="sched-mode">Interview Mode</Label>
                <Input value="ONLINE" disabled />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="sched-link">Meeting Link (Google Meet / Zoom)</Label>
              <Input
                id="sched-link"
                value={scheduleForm.meetingLink}
                onChange={(e) => setScheduleForm({ ...scheduleForm, meetingLink: e.target.value })}
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
              <Button type="submit">Schedule Interview</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

