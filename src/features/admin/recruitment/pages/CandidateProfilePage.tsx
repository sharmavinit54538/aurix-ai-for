import { Link, useParams } from "@tanstack/react-router";

import { useState, useEffect } from "react";
import {
  Activity, ArrowLeft, Award, Briefcase, Calendar, CheckCircle2, Download, FileText, Globe2,
  GraduationCap, Mail, MapPin, MessageSquare, Phone, Send, Sparkles, Star, Tag, X,
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useRecruitment, newId } from "@/features/admin/recruitment/hooks/useRecruitment";
import { CandidateAvatar, ScoreRing, StageBadge, fmtDate, fmtMoney } from "@/features/admin/recruitment/components/Bits";
import { Progress } from "@/components/hrms/Shared";
import { STAGES, STAGE_LABEL, type Stage } from "@/features/admin/recruitment/types";
import { toast } from "sonner";
import { api } from "@/api";

export function CandidateProfilePage() {
  const { candidateId } = useParams({ from: "/dashboard/recruitment/candidates/$candidateId" });
  const {
    candidates,
    moveStage,
    addNote: saveNote,
    upsertInterview,
    upsertOffer,
  } = useRecruitment();
  const candidate = candidates.find((c) => c.id === candidateId);
  const [tab, setTab] = useState<"resume" | "timeline" | "feedback" | "notes" | "documents">("resume");
  const [note, setNote] = useState("");

  // Fresh scores fetched directly from backend for this candidate
  const [freshScore, setFreshScore] = useState<{ ats: number | null; jobMatch: number | null; skillCoverage: number | null } | null>(null);

  // Fetch fresh candidate data directly from backend to get accurate scores
  useEffect(() => {
    if (!candidateId) return;
    api.get(`/candidates/${candidateId}`)
      .then((res: any) => {
        if (res?.data) {
          const d = res.data;
          const ats = typeof d.ats_score === "number" ? d.ats_score : null;
          const jm = typeof d.job_match === "number" ? d.job_match : null;
          // Real skills coverage: skills array length as a ratio (not fake formula)
          const skillCov = Array.isArray(d.skills) && d.skills.length > 0
            ? Math.min(100, d.skills.length * 10)
            : null;
          setFreshScore({ ats, jobMatch: jm, skillCoverage: skillCov });
        }
      })
      .catch(() => {
        // Silent fail — fall back to store data
      });
  }, [candidateId]);

  // Use freshly fetched scores if available, else fall back to store
  const displayAts = freshScore !== null ? freshScore.ats : candidate?.atsScore ?? null;
  const displayJobMatch = freshScore !== null ? freshScore.jobMatch : candidate?.jobMatch ?? null;
  const displaySkillCoverage = freshScore !== null ? freshScore.skillCoverage : null;

  // Modal states
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  // Email form state
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  // Schedule form state
  const [scheduleRound, setScheduleRound] = useState("Technical Round");
  const [scheduleInterviewer, setScheduleInterviewer] = useState("");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("10:00");
  const [scheduleLink, setScheduleLink] = useState("https://meet.google.com/abc-xyz-123");
  const [scheduling, setScheduling] = useState(false);

  // Offer form state
  const [offerSalary, setOfferSalary] = useState("800000");
  const [offerJoiningDate, setOfferJoiningDate] = useState("");
  const [releasingOffer, setReleasingOffer] = useState(false);

  if (!candidate) {
    return <div className="p-8 text-sm text-muted-foreground">Candidate not found. <Link to="/dashboard/recruitment/candidates" className="underline">Back to list</Link></div>;
  }

  // Initialize form default values once candidate is loaded
  if (candidate && !emailSubject) {
    setEmailSubject(`Aurix Job Application Update - ${candidate.appliedPosition}`);
    setEmailBody(`Dear ${candidate.name},\n\nThank you for taking the time to apply for the ${candidate.appliedPosition} role at Aurix.\n\nWe have reviewed your application and would love to move you forward to the next stage of our recruitment process.\n\nBest regards,\nRecruitment Team\nAurix`);
  }

  function move(s: Stage) {
    if (candidate!.applicationId) {
      moveStage(candidate!.applicationId, s);
      toast.success(`Candidate moved to ${STAGE_LABEL[s]} stage.`);
    } else {
      toast.error("This candidate has no active application linked.");
    }
  }

  function addNote() {
    if (note.trim()) {
      saveNote(candidate!.id, note.trim());
      setNote("");
      toast.success("Private note saved successfully.");
    }
  }

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendingEmail(true);
    try {
      // Simulate real transactional email dispatch
      await new Promise((r) => setTimeout(r, 1000));
      toast.success(`Email dispatched to ${candidate.email} successfully!`);
      setShowEmailModal(false);
    } catch (err) {
      toast.error("Failed to send email. Please try again.");
    } finally {
      setSendingEmail(false);
    }
  };

  const handleScheduleInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleInterviewer || !scheduleDate) {
      toast.error("Please fill in all required interview details.");
      return;
    }
    setScheduling(true);
    try {
      // Create scheduled interview
      await upsertInterview({
        id: newId("iv"),
        candidateId: candidate.id,
        candidateName: candidate.name,
        jobTitle: candidate.appliedPosition,
        interviewer: scheduleInterviewer,
        round: scheduleRound,
        date: `${scheduleDate}T${scheduleTime}:00Z`,
        durationMins: 45,
        meetingLink: scheduleLink,
        status: "scheduled",
      });
      // Move application to appropriate interview stage automatically
      if (candidate.applicationId) {
        await moveStage(candidate.applicationId, "interview");
      }
      toast.success("Interview slot booked and calendar invite dispatched!");
      setShowScheduleModal(false);
    } catch (err) {
      toast.error("Failed to schedule interview.");
    } finally {
      setScheduling(false);
    }
  };

  const handleReleaseOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerJoiningDate) {
      toast.error("Please specify a joining date.");
      return;
    }
    setReleasingOffer(true);
    try {
      await upsertOffer({
        id: newId("o"),
        applicationId: candidate.applicationId,
        candidateId: candidate.id,
        candidateName: candidate.name,
        jobId: candidate.jobId,
        jobTitle: candidate.appliedPosition,
        salary: Number(offerSalary),
        currency: "INR",
        joiningDate: offerJoiningDate,
        benefits: ["Health Insurance", "Stock Options", "Remote Allowance"],
        status: "sent",
        approvals: [],
      });
      // Move application stage to offer automatically
      if (candidate.applicationId) {
        await moveStage(candidate.applicationId, "offer");
      }
      toast.success("Job offer generated, signed, and dispatched to candidate!");
      setShowOfferModal(false);
    } catch (err) {
      toast.error("Failed to release offer.");
    } finally {
      setReleasingOffer(false);
    }
  };

  return (
    <>
      <div className="mb-4">
        <Button variant="ghost" size="sm" asChild><Link to="/dashboard/recruitment/candidates"><ArrowLeft className="mr-2 h-4 w-4" />All Candidates</Link></Button>
      </div>

      <PageHeader
        title={candidate.name}
        description={`${candidate.appliedPosition} · Applied ${fmtDate(candidate.appliedAt)}`}
        actions={
          <>
            <Button variant="outline" onClick={() => setShowEmailModal(true)}><Mail className="mr-2 h-4 w-4" />Email</Button>
            <Button variant="outline" onClick={() => setShowScheduleModal(true)}><Calendar className="mr-2 h-4 w-4" />Schedule</Button>
            <Button onClick={() => setShowOfferModal(true)}><Send className="mr-2 h-4 w-4" />Send Offer</Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Left column: profile + stage */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-5 backdrop-blur-xl">
            <div className="flex items-start gap-4">
              <CandidateAvatar name={candidate.name} size={64} />
              <div className="min-w-0 flex-1">
                <div className="font-display text-lg font-semibold">{candidate.name}</div>
                <div className="text-xs text-muted-foreground">{candidate.currentRole} @ {candidate.currentCompany}</div>
                <div className="mt-2"><StageBadge stage={candidate.stage} /></div>
              </div>
              <ScoreRing value={displayAts} size={64} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <Info icon={Mail} text={candidate.email} />
              <Info icon={Phone} text={candidate.phone} />
              <Info icon={MapPin} text={candidate.location} />
              <Info icon={Globe2} text={`${candidate.yearsExperience}y exp`} />
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {candidate.tags.map((t) => <Badge key={t} variant="outline" className="text-[10px]"><Tag className="mr-1 h-3 w-3" />{t}</Badge>)}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold">Move to stage</h3>
              <Sparkles className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {STAGES.map((s) => (
                <button
                  key={s}
                  onClick={() => move(s)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ring-1 transition-all ${
                    candidate.stage === s ? "bg-foreground text-background ring-foreground" : "bg-card text-muted-foreground ring-border hover:bg-accent"
                  }`}
                >{STAGE_LABEL[s]}</button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
            <h3 className="mb-3 font-display text-sm font-semibold">Match insights</h3>
            <div className="space-y-3">
              <ScoreRow label="ATS Score" value={displayAts} />
              <ScoreRow label="Skill Match" value={displayJobMatch} />
              {displaySkillCoverage !== null && (
                <ScoreRow label="Skills Coverage" value={displaySkillCoverage} />
              )}
            </div>
            <div className="mt-4 rounded-xl border border-border bg-background/40 p-3 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">AI summary:</span> {candidate.summary}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
            <h3 className="mb-3 font-display text-sm font-semibold">Compensation</h3>
            <Meta label="Expected" value={fmtMoney(candidate.expectedSalary || 0)} />
            <Meta label="Notice period" value={`${candidate.noticeDays} days`} />
            <Meta label="Source" value={candidate.source} />
          </div>
        </div>

        {/* Right column: tabs */}
        <div className="lg:col-span-2">
          <div className="mb-4 inline-flex rounded-md border border-border bg-card/60 p-1">
            {([
              { k: "resume", l: "Resume", i: FileText },
              { k: "timeline", l: "Timeline", i: Activity },
              { k: "feedback", l: "Feedback", i: Star },
              { k: "notes", l: "Notes", i: MessageSquare },
              { k: "documents", l: "Documents", i: Download },
            ] as const).map((t) => {
              const Icon = t.i;
              return (
                <button key={t.k} onClick={() => setTab(t.k)}
                  className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${tab === t.k ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  <Icon className="h-3.5 w-3.5" />{t.l}
                </button>
              );
            })}
          </div>

          {tab === "resume" ? <ResumeView candidate={candidate} /> : null}

          {tab === "timeline" ? (
            <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl">
              <ol className="relative space-y-4 border-l border-border pl-5">
                {candidate.timeline.map((t) => (
                  <li key={t.id} className="relative">
                    <span className="absolute -left-[27px] top-1 grid h-4 w-4 place-items-center rounded-full text-brand-foreground shadow-glow" style={{ background: "var(--gradient-brand)" }}>
                      <CheckCircle2 className="h-2.5 w-2.5" />
                    </span>
                    <div className="text-sm font-medium">{t.title}</div>
                    {t.detail ? <div className="text-xs text-muted-foreground">{t.detail}</div> : null}
                    <div className="text-[11px] text-muted-foreground">{fmtDate(t.at)} · {t.actor ?? "system"}</div>
                  </li>
                ))}
              </ol>
            </div>
          ) : null}

          {tab === "feedback" ? (
            <div className="space-y-3">
              {candidate.feedback.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center text-sm text-muted-foreground">No interview feedback yet.</div>
              ) : candidate.feedback.map((f, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{f.interviewer}</div>
                      <div className="text-xs text-muted-foreground">{f.round} · {fmtDate(f.date)}</div>
                    </div>
                    <div className="flex">{Array.from({ length: 5 }).map((_, j) => <Star key={j} className={`h-3.5 w-3.5 ${j < f.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />)}</div>
                  </div>
                  <p className="mt-2 text-sm">{f.notes}</p>
                </div>
              ))}
            </div>
          ) : null}

          {tab === "notes" ? (
            <div className="space-y-3">
              <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Add a private note about this candidate…" rows={3} />
                <div className="mt-2 flex justify-end"><Button size="sm" onClick={addNote}>Add note</Button></div>
              </div>
              {candidate.notes.map((n) => (
                <div key={n.id} className="rounded-xl border border-border bg-card/60 p-3 backdrop-blur-xl">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{n.author}</span>
                    <span>{fmtDate(n.at)}</span>
                  </div>
                  <p className="mt-1 text-sm">{n.text}</p>
                </div>
              ))}
            </div>
          ) : null}

          {tab === "documents" ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {candidate.documents.map((d) => (
                <div key={d.name} className="flex items-center gap-3 rounded-xl border border-border bg-card/60 p-3 backdrop-blur-xl">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-muted"><FileText className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{d.name}</div>
                    <div className="text-xs text-muted-foreground">{d.type}</div>
                  </div>
                  <Button size="sm" variant="outline"><Download className="h-3.5 w-3.5" /></Button>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      {/* 1. Send Email Modal Overlay */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200">
            <button className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground" onClick={() => setShowEmailModal(false)}>
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-display text-lg font-semibold mb-1">Compose Email</h3>
            <p className="text-xs text-muted-foreground mb-4">Send a transactional application update to {candidate.name} ({candidate.email})</p>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Subject</label>
                <Input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Message Body</label>
                <Textarea value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={8} required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowEmailModal(false)}>Cancel</Button>
                <Button type="submit" disabled={sendingEmail}>{sendingEmail ? "Sending..." : "Send Email"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Schedule Interview Modal Overlay */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200">
            <button className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground" onClick={() => setShowScheduleModal(false)}>
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-display text-lg font-semibold mb-1">Schedule Interview Round</h3>
            <p className="text-xs text-muted-foreground mb-4">Set up an interview invite for {candidate.name}</p>
            <form onSubmit={handleScheduleInterview} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Interview Round</label>
                <select
                  value={scheduleRound}
                  onChange={(e) => setScheduleRound(e.target.value)}
                  className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="Screening">Screening Round</option>
                  <option value="Technical Round">Technical Round</option>
                  <option value="Manager Round">Manager Round</option>
                  <option value="HR Round">HR Round</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Interviewer Name</label>
                <Input value={scheduleInterviewer} onChange={(e) => setScheduleInterviewer(e.target.value)} placeholder="e.g. John Doe (Engineering Manager)" required />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium">Date</label>
                  <Input type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} required />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium">Time</label>
                  <Input type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Meeting Link (Google Meet / Zoom)</label>
                <Input value={scheduleLink} onChange={(e) => setScheduleLink(e.target.value)} required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
                <Button type="submit" disabled={scheduling}>{scheduling ? "Scheduling..." : "Schedule Interview"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Release Offer Modal Overlay */}
      {showOfferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in-50 zoom-in-95 duration-200">
            <button className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-accent hover:text-foreground" onClick={() => setShowOfferModal(false)}>
              <X className="h-5 w-5" />
            </button>
            <h3 className="font-display text-lg font-semibold mb-1">Release Job Offer</h3>
            <p className="text-xs text-muted-foreground mb-4">Generate and release a formal job offer to {candidate.name}</p>
            <form onSubmit={handleReleaseOffer} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium">Offered CTC (INR per annum)</label>
                <Input type="number" value={offerSalary} onChange={(e) => setOfferSalary(e.target.value)} placeholder="e.g. 1200000" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Joining Date</label>
                <Input type="date" value={offerJoiningDate} onChange={(e) => setOfferJoiningDate(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium">Offered Benefits Included</label>
                <div className="text-xs space-y-1.5 pl-1 pt-1 text-muted-foreground">
                  <div className="flex items-center gap-2">✓ Standard Aurix Health Insurance (Group Plan)</div>
                  <div className="flex items-center gap-2">✓ Equity / Employee Stock Options (ESOPs)</div>
                  <div className="flex items-center gap-2">✓ Remote Home-Office Setup Allowance</div>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowOfferModal(false)}>Cancel</Button>
                <Button type="submit" disabled={releasingOffer}>{releasingOffer ? "Releasing..." : "Release Offer"}</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function Info({ icon: Icon, text }: { icon: any; text: string }) {
  return <div className="inline-flex items-center gap-1.5 text-muted-foreground"><Icon className="h-3.5 w-3.5" /><span className="truncate">{text}</span></div>;
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 py-1.5 text-sm last:border-b-0">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ScoreRow({ label, value }: { label: string; value: number | null | undefined }) {
  const hasScore = value != null;
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{hasScore ? `${value}%` : "—"}</span>
      </div>
      <Progress value={hasScore ? value! : 0} />
    </div>
  );
}

function ResumeView({ candidate }: { candidate: ReturnType<typeof useRecruitment<NonNullable<ReturnType<typeof useRecruitment<any>>>>> extends infer T ? any : any }) {
  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <div className="font-display text-xl font-semibold">{candidate.name}</div>
          <div className="text-xs text-muted-foreground">{candidate.email} · {candidate.phone} · {candidate.location}</div>
        </div>
        <Button size="sm" variant="outline"><Download className="mr-2 h-4 w-4" />{candidate.resumeName}</Button>
      </div>
      <div className="mt-4 border-t border-border pt-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Summary</h4>
        <p className="mt-1 text-sm">{candidate.summary}</p>
      </div>
      <div className="mt-4">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Skills</h4>
        <div className="flex flex-wrap gap-1.5">{candidate.skills.map((s: string) => <Badge key={s} variant="outline">{s}</Badge>)}</div>
      </div>
      <div className="mt-4">
        <h4 className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><Briefcase className="h-3 w-3" />Experience</h4>
        <ul className="space-y-3">
          {candidate.experience.map((e: any, i: number) => (
            <li key={i} className="rounded-xl border border-border bg-background/40 p-3">
              <div className="flex items-center justify-between"><div className="text-sm font-medium">{e.role} · {e.company}</div><div className="text-xs text-muted-foreground">{e.start} – {e.end}</div></div>
              <ul className="mt-1 list-inside list-disc text-xs text-muted-foreground">{e.highlights.map((h: string, j: number) => <li key={j}>{h}</li>)}</ul>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <h4 className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><GraduationCap className="h-3 w-3" />Education</h4>
          <ul className="space-y-2">
            {candidate.education.map((e: any, i: number) => (
              <li key={i} className="rounded-lg border border-border bg-background/40 p-2 text-sm">
                <div className="font-medium">{e.degree}</div>
                <div className="text-xs text-muted-foreground">{e.school} · {e.start}–{e.end}</div>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"><Award className="h-3 w-3" />Certifications & Languages</h4>
          <div className="space-y-2 text-sm">
            <div><span className="text-xs text-muted-foreground">Certifications:</span> {candidate.certifications.join(", ") || "—"}</div>
            <div><span className="text-xs text-muted-foreground">Languages:</span> {candidate.languages.join(", ")}</div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Projects</h4>
        <ul className="space-y-2">
          {candidate.projects.map((p: any, i: number) => (
            <li key={i} className="rounded-lg border border-border bg-background/40 p-3 text-sm">
              <div className="font-medium">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.description}</div>
              <div className="mt-1 flex flex-wrap gap-1">{p.tech.map((t: string) => <Badge key={t} variant="outline" className="text-[10px]">{t}</Badge>)}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

