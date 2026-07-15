import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Calendar, CheckCircle2, Clock, Star, Video, User } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRecruitment, recruitment, newId, refreshAll } from "@/lib/recruitment/store";
import { CandidateAvatar } from "@/components/recruitment/Bits";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { apiInstance } from "@/api";
import type { Interview } from "@/lib/recruitment/types";

export const Route = createFileRoute("/dashboard/recruitment/interviews")({
  head: () => ({ meta: [{ title: "Interviews — Recruitment" }] }),
  component: Interviews,
});

function Interviews() {
  const interviews = useRecruitment((s) => s.interviews);
  const candidates = useRecruitment((s) => s.candidates);
  const [tab, setTab] = useState<"upcoming" | "completed" | "calendar">("upcoming");

  // Modal States
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedIv, setSelectedIv] = useState<Interview | null>(null);

  // Forms
  const [scheduleForm, setScheduleForm] = useState({
    candidateId: "",
    round: "Technical Round",
    interviewer: "",
    date: "",
    time: "10:00",
    duration: "45",
    meetingLink: "https://meet.google.com/abc-xyz-123",
  });

  const [feedbackForm, setFeedbackForm] = useState({
    recommendation: "PASS", // "PASS", "REJECT", "HOLD"
    rating: "4",
    feedback: "",
    interviewer: "",
  });

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
        // Try backend send-interview endpoint to create/initiate the interview round
        await apiInstance.post(`/applications/${cand.applicationId}/send-interview?round_names=${encodeURIComponent(scheduleForm.round)}`);
        // Move candidate stage to interview
        await recruitment.moveStage(cand.applicationId, "interview");
      }
      
      // Save locally in store as fallback/local record
      await recruitment.upsertInterview(newIv);
      toast.success("Interview scheduled successfully!");
      setShowScheduleModal(false);
      await refreshAll();
    } catch (err) {
      // Fallback: save locally
      await recruitment.upsertInterview(newIv);
      toast.success("Interview scheduled successfully (saved locally)!");
      setShowScheduleModal(false);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.interviewer || !feedbackForm.feedback) {
      toast.error("Interviewer Name and Feedback are required.");
      return;
    }

    const updatedIv: Interview = {
      ...selectedIv!,
      status: "completed",
      interviewer: feedbackForm.interviewer,
      rating: Number(feedbackForm.rating),
      feedback: feedbackForm.feedback,
    };

    try {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(selectedIv!.id);
      if (isUuid) {
        // Call real backend complete round endpoint
        const decision = feedbackForm.recommendation.toLowerCase(); // "pass", "reject", "hold"
        const payload = {
          feedback: feedbackForm.feedback,
          score: `${feedbackForm.rating}/5`,
          interviewer_name: feedbackForm.interviewer,
        };
        await apiInstance.patch(`/interviews/rounds/${selectedIv!.id}/${decision}`, payload);
        toast.success(`Interview marked as completed (${feedbackForm.recommendation})!`);
      } else {
        // Local simulation fallback
        await recruitment.upsertInterview(updatedIv);
        toast.success("Feedback submitted successfully!");
      }
      setShowFeedbackModal(false);
      await refreshAll();
    } catch (err) {
      // Fallback to local store update anyway
      await recruitment.upsertInterview(updatedIv);
      toast.success("Feedback submitted successfully (saved locally)!");
      setShowFeedbackModal(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Interviews"
        description="Schedule, review, and track every interview round."
        actions={<Button onClick={() => setShowScheduleModal(true)}><Calendar className="mr-2 h-4 w-4" />Schedule</Button>}
      />

      <div className="mb-4 inline-flex rounded-md border border-border bg-card/60 p-1">
        {([
          { k: "upcoming", l: "Upcoming", c: upcoming.length },
          { k: "completed", l: "Completed", c: completed.length },
          { k: "calendar", l: "Calendar", c: interviews.length },
        ] as const).map((t) => (
          <button key={t.k} onClick={() => setTab(t.k)}
            className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium cursor-pointer ${tab === t.k ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {t.l}<span className="rounded-full bg-muted px-1.5 text-[10px]">{t.c}</span>
          </button>
        ))}
      </div>

      {tab !== "calendar" ? (
        <div className="space-y-2">
          {(tab === "upcoming" ? upcoming : completed).map((iv) => (
            <div key={iv.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="flex flex-wrap items-center gap-4">
                <CandidateAvatar name={iv.candidateName} size={40} />
                <div className="min-w-0 flex-1">
                  <Link to="/dashboard/recruitment/candidates/$candidateId" params={{ candidateId: iv.candidateId }} className="text-sm font-medium hover:underline">{iv.candidateName}</Link>
                  <div className="truncate text-xs text-muted-foreground">{iv.jobTitle} · {iv.round}</div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className="inline-flex items-center gap-1 text-muted-foreground"><Clock className="h-3.5 w-3.5" />{new Date(iv.date).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">· {iv.durationMins}m</span>
                  <span className="text-muted-foreground flex items-center gap-1"><User className="h-3.5 w-3.5 text-muted-foreground" />{iv.interviewer}</span>
                </div>
                {iv.status === "completed" && iv.rating ? (
                  <div className="flex">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className={`h-3.5 w-3.5 ${j < (iv.rating ?? 0) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />)}</div>
                ) : null}
                <Badge variant="outline" className="capitalize">{iv.status}</Badge>
                
                <div className="flex items-center gap-2">
                  {iv.status === "scheduled" && (
                    <Button size="sm" variant="outline" onClick={() => {
                      setSelectedIv(iv);
                      setFeedbackForm({
                        recommendation: "PASS",
                        rating: "4",
                        feedback: iv.feedback || "",
                        interviewer: iv.interviewer,
                      });
                      setShowFeedbackModal(true);
                    }}>
                      <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />Feedback
                    </Button>
                  )}
                  <Button size="sm" variant="outline" asChild>
                    <a href={iv.meetingLink} target="_blank" rel="noreferrer"><Video className="mr-1.5 h-3.5 w-3.5" />Join</a>
                  </Button>
                </div>
              </div>

              {iv.status === "completed" && iv.feedback && (
                <div className="rounded-xl bg-background/40 p-3 text-xs text-muted-foreground border border-border/40">
                  <span className="font-semibold text-foreground block mb-1">Interviewer Feedback Note:</span>
                  {iv.feedback}
                </div>
              )}
            </div>
          ))}
          {!(tab === "upcoming" ? upcoming : completed).length && (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
              No {tab} interviews found.
            </div>
          )}
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
                  <div key={iv.id} className="block rounded-md bg-accent/60 px-2 py-1 text-[10px] group relative">
                    <div className="font-medium">{new Date(iv.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                    <Link to="/dashboard/recruitment/candidates/$candidateId" params={{ candidateId: iv.candidateId }} className="truncate block font-semibold hover:underline">{iv.candidateName}</Link>
                    <div className="truncate text-muted-foreground">{iv.round}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Interview Modal */}
      <Dialog open={showScheduleModal} onOpenChange={setShowScheduleModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Interview Round</DialogTitle>
            <DialogDescription>Set up a new interview slot for a candidate in the pipeline.</DialogDescription>
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
                placeholder="e.g. John Doe (Tech Lead)"
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

      {/* Submit Feedback Modal */}
      <Dialog open={showFeedbackModal} onOpenChange={setShowFeedbackModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Submit Interview Feedback</DialogTitle>
            <DialogDescription>
              Record the feedback, ratings, and recommendation for {selectedIv?.candidateName}.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitFeedback} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="feed-interviewer">Interviewer Name *</Label>
              <Input
                id="feed-interviewer"
                placeholder="Interviewer's name"
                value={feedbackForm.interviewer}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, interviewer: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="feed-rec">Recommendation *</Label>
                <select
                  id="feed-rec"
                  value={feedbackForm.recommendation}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, recommendation: e.target.value })}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                >
                  <option value="PASS">Pass / Move Forward</option>
                  <option value="REJECT">Reject Candidate</option>
                  <option value="HOLD">Put on Hold</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label htmlFor="feed-rating">Rating (1 to 5 Stars) *</Label>
                <select
                  id="feed-rating"
                  value={feedbackForm.rating}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, rating: e.target.value })}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  required
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Strong Match</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Weak Match</option>
                  <option value="1">1 - Do Not Hire</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="feed-notes">Evaluation Notes *</Label>
              <Textarea
                id="feed-notes"
                placeholder="Detailed notes on key strengths, technical skills, areas of concern, culture fit..."
                rows={5}
                value={feedbackForm.feedback}
                onChange={(e) => setFeedbackForm({ ...feedbackForm, feedback: e.target.value })}
                required
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setShowFeedbackModal(false)}>Cancel</Button>
              <Button type="submit">Submit Feedback</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
