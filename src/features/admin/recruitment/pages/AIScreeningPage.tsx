import { statusBadgeClass } from "@/lib/status-styles";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  Sparkles,
  GitCompare,
  Check,
  X,
  Eye,
  AlertTriangle,
  RotateCw,
  Loader2,
  UserCheck,
  HelpCircle,
  TrendingUp,
  AlertOctagon,
  CheckCircle,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRecruitment } from "../hooks/useRecruitment";
import type { Candidate, ScreeningStatus } from "../types";

export interface CandidateScreeningView {
  id: string;
  candidateId: string;
  applicationId: string;
  name: string;
  appliedPosition: string;
  currentCompany?: string;
  yearsExperience?: number;
  education?: Candidate["education"];
  noticeDays?: number;
  expectedSalary?: number;
  skills: string[];
  summary?: string;
  stage?: string;
  isScreened: boolean;
  status: ScreeningStatus | "NOT_SCREENED";
  error?: string | null;
  decision: "SHORTLIST" | "REVIEW" | "REJECT" | null;
  confidence: number;
  matchScore: number | null;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  redFlags: string[];
  greenFlags: string[];
  hiringRecommendation: string;
  hrNotes: string;
  questionsToAsk: string[];
  modelUsed: string;
  screenedAt: string | null;
  humanDecision: "SHORTLIST" | "REJECT" | "KEEP_REVIEW" | null;
  humanDecisionBy: string | null;
  humanDecisionReason: string | null;
  screeningId?: string;
  effectiveDecision: "SHORTLIST" | "REVIEW" | "REJECT" | null;
}

export function AIScreeningPage() {
  const {
    candidates,
    jobs,
    screeningThresholds,
    screeningRun,
    screeningResults,
    screeningLoading,
    screeningSubmitting,
    clearScreeningState,
    runScreening,
    fetchScreeningResults,
    submitDecision,
  } = useRecruitment();

  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || "");
  const [activeTab, setActiveTab] = useState<"all" | "shortlisted" | "review" | "rejected">("all");

  // Comparison State
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Detail Modal State
  const [inspectCandidate, setInspectCandidate] = useState<CandidateScreeningView | null>(null);

  // Decision Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    type: "SHORTLIST" | "REJECT";
    candidate: CandidateScreeningView;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectReasonError, setRejectReasonError] = useState("");

  // Re-screen all confirmation dialog
  const [showRescreenConfirm, setShowRescreenConfirm] = useState(false);

  // Network / Polling Error & Timeout States
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [pollingTimedOut, setPollingTimedOut] = useState(false);

  // Auto-sync selectedJobId if current selection is invalid
  useEffect(() => {
    if ((!selectedJobId || !jobs.some((j) => j.id === selectedJobId)) && jobs.length > 0) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  const selectedJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId) || null,
    [jobs, selectedJobId],
  );

  // Multi-application candidates: candidate may apply to multiple jobs
  // Pick the application that matches selectedJobId
  const jobCandidates = useMemo(() => {
    if (!selectedJobId) return [];
    return candidates
      .map((c) => {
        const matchingApp = c.applications?.find((a) => a.jobId === selectedJobId);
        if (matchingApp) {
          return {
            ...c,
            jobId: matchingApp.jobId,
            applicationId: matchingApp.id,
            stage: matchingApp.stage,
            appliedPosition: matchingApp.appliedPosition || c.appliedPosition || "Candidate",
          };
        }
        if (c.jobId === selectedJobId) {
          return c;
        }
        return null;
      })
      .filter((c): c is Candidate => c !== null);
  }, [candidates, selectedJobId]);

  // Load screening results
  const loadScreening = useCallback(
    async (jobId: string) => {
      if (!jobId) return;
      setFetchError(null);
      try {
        await fetchScreeningResults(jobId);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to load screening results";
        setFetchError(msg);
      }
    },
    [fetchScreeningResults],
  );

  // Job switching: dispatch clearScreeningState immediately, reset timers, and fetch new job
  useEffect(() => {
    if (!selectedJobId) return;
    clearScreeningState();
    setPollingTimedOut(false);
    setFetchError(null);
    loadScreening(selectedJobId);
  }, [selectedJobId, clearScreeningState, loadScreening]);

  // Polling lifecycle: self-scheduling timeout (3s -> 10s back-off), stop after 10 min, stop on COMPLETED/FAILED/unmount/3 errors
  useEffect(() => {
    if (!selectedJobId || !screeningRun) return;
    const status = screeningRun.status?.toUpperCase();
    const shouldPoll = status === "PENDING" || status === "RUNNING";
    if (!shouldPoll) return;

    let delay = 3000;
    let consecutiveErrors = 0;
    let isMounted = true;
    let timerId: NodeJS.Timeout | null = null;
    const startTime = Date.now();
    const MAX_DURATION = 10 * 60 * 1000; // 10 minutes

    const scheduleNext = () => {
      if (!isMounted) return;
      if (Date.now() - startTime >= MAX_DURATION) {
        setPollingTimedOut(true);
        toast.warning("Screening is taking longer than expected. Please refresh manually.");
        return;
      }
      if (consecutiveErrors >= 3) {
        setFetchError("Polling stopped after 3 consecutive errors. Please retry manually.");
        return;
      }

      timerId = setTimeout(async () => {
        if (!isMounted) return;
        try {
          await fetchScreeningResults(selectedJobId);
          consecutiveErrors = 0;
          delay = Math.min(10000, Math.round(delay * 1.5));
          scheduleNext();
        } catch (err) {
          consecutiveErrors += 1;
          const msg = err instanceof Error ? err.message : "Failed to refresh screening status";
          if (consecutiveErrors >= 3) {
            setFetchError(msg);
          } else {
            delay = Math.min(10000, delay * 2);
            scheduleNext();
          }
        }
      }, delay);
    };

    scheduleNext();

    return () => {
      isMounted = false;
      if (timerId) clearTimeout(timerId);
    };
  }, [selectedJobId, screeningRun?.status, fetchScreeningResults]);

  // Merge job candidates with backend AI screening results
  // Match candidate ONLY by application_id (fallback candidate_id). NEVER by name!
  // Do NOT invent candidates from screeningResults: show only applications of selected job!
  const mergedCandidates = useMemo<CandidateScreeningView[]>(() => {
    return jobCandidates.map((c) => {
      const res = screeningResults.find(
        (r) =>
          (c.applicationId && r.applicationId === c.applicationId) ||
          r.candidateId === c.id,
      );

      if (res) {
        const effDecision =
          res.humanDecision === "SHORTLIST"
            ? "SHORTLIST"
            : res.humanDecision === "REJECT"
              ? "REJECT"
              : res.humanDecision === "KEEP_REVIEW"
                ? "REVIEW"
                : res.decision;

        const isCompleted = res.status === "COMPLETED";

        return {
          id: c.id,
          candidateId: c.id,
          applicationId: c.applicationId || res.applicationId || c.id,
          name: c.name,
          appliedPosition: c.appliedPosition || selectedJob?.title || "Candidate",
          currentCompany: c.currentCompany,
          yearsExperience: c.yearsExperience,
          education: c.education,
          noticeDays: c.noticeDays,
          expectedSalary: c.expectedSalary,
          skills: c.skills || [], // Never fallback to res.missingSkills!
          summary: c.summary,
          stage: c.stage,
          isScreened: isCompleted || res.status === "FAILED",
          status: res.status,
          error: res.error,
          decision: res.decision,
          confidence: Math.round(res.confidence || 0),
          matchScore:
            res.matchScore !== null && res.matchScore !== undefined
              ? Math.round(res.matchScore)
              : null,
          strengths: res.strengths || [],
          weaknesses: res.weaknesses || [],
          missingSkills: res.missingSkills || [],
          redFlags: res.redFlags || [],
          greenFlags: res.greenFlags || [],
          hiringRecommendation: res.hiringRecommendation,
          hrNotes: res.hrNotes,
          questionsToAsk: res.questionsToAsk || [],
          modelUsed: res.modelUsed,
          screenedAt: res.screenedAt,
          humanDecision: res.humanDecision,
          humanDecisionBy: res.humanDecisionBy,
          humanDecisionReason: res.humanDecisionReason,
          screeningId: res.screeningId, // strictly screeningId only!
          effectiveDecision: effDecision,
        };
      }

      return {
        id: c.id,
        candidateId: c.id,
        applicationId: c.applicationId || c.id,
        name: c.name,
        appliedPosition: c.appliedPosition || selectedJob?.title || "Candidate",
        currentCompany: c.currentCompany,
        yearsExperience: c.yearsExperience,
        education: c.education,
        noticeDays: c.noticeDays,
        expectedSalary: c.expectedSalary,
        skills: c.skills || [],
        summary: c.summary,
        stage: c.stage,
        isScreened: false,
        status: "NOT_SCREENED",
        error: null,
        decision: null,
        confidence: 0,
        matchScore: null,
        strengths: [],
        weaknesses: [],
        missingSkills: [],
        redFlags: [],
        greenFlags: [],
        hiringRecommendation: "",
        hrNotes: "",
        questionsToAsk: [],
        modelUsed: "",
        screenedAt: null,
        humanDecision: null,
        humanDecisionBy: null,
        humanDecisionReason: null,
        screeningId: undefined,
        effectiveDecision: null,
      };
    });
  }, [jobCandidates, screeningResults, selectedJob]);

  // Tab Filtering: All / Shortlisted / Review / Rejected
  const filteredCandidates = useMemo(() => {
    if (activeTab === "all") return mergedCandidates;
    if (activeTab === "shortlisted") {
      return mergedCandidates.filter((c) => c.effectiveDecision === "SHORTLIST");
    }
    if (activeTab === "review") {
      return mergedCandidates.filter((c) => c.effectiveDecision === "REVIEW");
    }
    if (activeTab === "rejected") {
      return mergedCandidates.filter((c) => c.effectiveDecision === "REJECT");
    }
    return mergedCandidates;
  }, [mergedCandidates, activeTab]);

  // Candidate comparison selection
  const handleToggleCompare = (id: string) => {
    if (compareIds.includes(id)) {
      setCompareIds(compareIds.filter((x) => x !== id));
    } else {
      if (compareIds.length >= 3) {
        toast.error("You can compare at most 3 candidates simultaneously.");
        return;
      }
      setCompareIds([...compareIds, id]);
    }
  };

  const compareList = useMemo(
    () => mergedCandidates.filter((c) => compareIds.includes(c.id)),
    [mergedCandidates, compareIds],
  );

  // Trigger Run AI Screening for selected job (default: unscreened only)
  const handleRunScreening = async (force = false) => {
    if (!selectedJobId) {
      toast.error("Please select a job first.");
      return;
    }
    try {
      if (force) {
        await runScreening({ jobId: selectedJobId, force: true });
        toast.success("AI Re-screening started for all candidates. Processing resumes...");
        setShowRescreenConfirm(false);
      } else {
        const unscreenedAppIds = mergedCandidates
          .filter((c) => !c.isScreened || c.status === "FAILED")
          .map((c) => c.applicationId)
          .filter(Boolean);

        await runScreening({
          jobId: selectedJobId,
          applicationIds: unscreenedAppIds.length > 0 ? unscreenedAppIds : undefined,
        });
        toast.success("AI Screening job started. Processing unscreened resumes...");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to run AI screening";
      toast.error(msg);
    }
  };

  // Retry individual candidate screening (sends application_ids: [candidate.applicationId])
  const handleRetryCandidate = async (candidate: CandidateScreeningView) => {
    if (!selectedJobId) return;
    try {
      await runScreening({
        jobId: selectedJobId,
        applicationIds: candidate.applicationId ? [candidate.applicationId] : undefined,
      });
      toast.info(`Retrying screening for ${candidate.name}...`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to retry screening";
      toast.error(msg);
    }
  };

  // Open confirmation dialog for shortlist or reject (guarded strictly by screeningId and COMPLETED status)
  const openConfirmDialog = (
    candidate: CandidateScreeningView,
    type: "SHORTLIST" | "REJECT",
  ) => {
    if (!candidate.screeningId || candidate.status !== "COMPLETED") {
      toast.error("Candidate must complete AI screening before a human decision can be recorded.");
      return;
    }
    setConfirmDialog({ type, candidate });
    setRejectReason("");
    setRejectReasonError("");
  };

  // Submit human decision with validation (Reject reason >= 10 chars, uses ONLY screeningId)
  const handleConfirmDecision = async () => {
    if (!confirmDialog) return;
    const { type, candidate } = confirmDialog;

    if (type === "REJECT") {
      const trimmed = rejectReason.trim();
      if (trimmed.length < 10) {
        setRejectReasonError("Rejection reason must be at least 10 characters long.");
        return;
      }
    }

    const screeningId = candidate.screeningId;
    if (!screeningId) {
      toast.error("Candidate has not been screened yet.");
      return;
    }

    try {
      await submitDecision({
        screeningId,
        action: type,
        reason: type === "REJECT" ? rejectReason.trim() : rejectReason.trim() || undefined,
        jobId: selectedJobId,
      });

      toast.success(
        type === "SHORTLIST"
          ? `Successfully shortlisted ${candidate.name}`
          : `Successfully rejected ${candidate.name}`,
      );

      // Close dialogs
      setConfirmDialog(null);
      if (inspectCandidate?.id === candidate.id) {
        setInspectCandidate(null);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to submit decision";
      toast.error(msg);
    }
  };

  const isRunning =
    screeningRun?.status?.toUpperCase() === "RUNNING" ||
    screeningRun?.status?.toUpperCase() === "PENDING";

  return (
    <div className="space-y-6">
      {/* Comparison Drawer Trigger */}
      {compareIds.length >= 2 && (
        <div className="flex justify-end">
          <Button onClick={() => setShowCompareModal(true)} className="gap-1.5">
            <GitCompare className="h-4 w-4" />
            Compare ({compareIds.length}) Candidates
          </Button>
        </div>
      )}

      {/* Target Job Selector & Criteria Card */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Requisition Card */}
        <div className="rounded-2xl border border-border bg-card p-4 lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Active Requisition</span>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>

          {jobs.length === 0 ? (
            <div className="p-3 rounded-xl border border-dashed border-border text-xs text-muted-foreground bg-muted/20">
              No jobs available. Create a job requisition first.
            </div>
          ) : (
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger className="h-9 text-xs" aria-label="Select Job Requisition">
                <SelectValue placeholder="Select a job" />
              </SelectTrigger>
              <SelectContent>
                {jobs.map((j) => (
                  <SelectItem key={j.id} value={j.id}>
                    {j.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {selectedJob && (
            <div className="text-xs space-y-2 pt-2 border-t border-border">
              {selectedJob.department && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Department:</span>
                  <span className="font-medium text-foreground">{selectedJob.department}</span>
                </div>
              )}
              {selectedJob.experience && (
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Target Experience:</span>
                  <span className="font-medium text-foreground">{selectedJob.experience}</span>
                </div>
              )}
              {selectedJob.skills?.length > 0 && (
                <>
                  <div className="text-muted-foreground">Key Required Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedJob.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="text-[10px]">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Run AI Screening Actions */}
          <div className="pt-2 border-t border-border space-y-2">
            <Button
              className="w-full text-xs h-9 gap-1.5"
              onClick={() => handleRunScreening(false)}
              disabled={isRunning || !selectedJobId || screeningSubmitting}
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Screening in Progress...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Run AI Screening
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full text-[11px] h-7 gap-1 text-muted-foreground hover:text-foreground"
              onClick={() => setShowRescreenConfirm(true)}
              disabled={
                isRunning ||
                !selectedJobId ||
                screeningSubmitting ||
                mergedCandidates.length === 0
              }
            >
              <RotateCw className="h-3 w-3" />
              Re-screen all (uses more AI credits)
            </Button>

            {/* Run Progress Display with aria-live */}
            {screeningRun && (
              <div className="space-y-1.5 pt-1 text-xs" role="status" aria-live="polite">
                <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>
                    Progress: {screeningRun.completed} / {screeningRun.total} screened
                  </span>
                  <span className="capitalize font-medium text-foreground">
                    {screeningRun.status.toLowerCase()}
                  </span>
                </div>
                <Progress
                  value={
                    screeningRun.total > 0
                      ? Math.round((screeningRun.completed / screeningRun.total) * 100)
                      : 0
                  }
                  className="h-1.5"
                />
              </div>
            )}
          </div>
        </div>

        {/* Read-Only Criteria & Philosophy Card (Replaced dead weight sliders) */}
        <div className="rounded-2xl border border-border bg-card p-4 lg:col-span-2 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-primary" />
                Screening Thresholds &amp; Criteria
              </h3>
              <Badge variant="outline" className="text-[10px] bg-muted/40">
                Automated Evaluation
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Candidate resumes are objectively scored against job requirements, tech stack
              relevance, and professional experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
              <span className="text-[11px] text-muted-foreground font-medium">Shortlist Threshold</span>
              <div className="text-lg font-bold text-foreground">
                {screeningThresholds ? `≥ ${screeningThresholds.shortlist}%` : "—"}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Recommended for expedited interview rounds.
              </p>
            </div>
            <div className="p-3 rounded-xl border border-border bg-muted/20 space-y-1">
              <span className="text-[11px] text-muted-foreground font-medium">Reject Threshold</span>
              <div className="text-lg font-bold text-destructive">
                {screeningThresholds ? `< ${screeningThresholds.reject}%` : "—"}
              </div>
              <p className="text-[10px] text-muted-foreground">
                Flagged for missing critical mandatory requirements.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldAlert className="h-4 w-4 text-primary shrink-0" />
            <span className="font-medium text-foreground">
              AI recommends, a human decides.
            </span>
            <span className="text-muted-foreground">
              All shortlist and reject actions require explicit reviewer sign-off.
            </span>
          </div>
        </div>
      </div>

      {/* Network / Polling Error Banner with Retry */}
      {fetchError && (
        <div
          role="alert"
          className="p-3 rounded-2xl border border-destructive/30 bg-destructive/10 text-xs text-destructive flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <AlertOctagon className="h-4 w-4 shrink-0" />
            <span>{fetchError}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs border-destructive/40 text-destructive hover:bg-destructive/20"
            onClick={() => loadScreening(selectedJobId)}
          >
            <RotateCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        </div>
      )}

      {/* Polling Timeout Banner */}
      {pollingTimedOut && (
        <div className="p-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>Screening is processing in background. Refresh to check latest results.</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs border-amber-500/40 hover:bg-amber-500/20"
            onClick={() => {
              setPollingTimedOut(false);
              loadScreening(selectedJobId);
            }}
          >
            <RotateCw className="h-3 w-3 mr-1" />
            Refresh
          </Button>
        </div>
      )}

      {/* Decision Tabs */}
      <div className="flex items-center justify-between border-b border-border pb-2">
        <div className="flex items-center gap-2">
          {(["all", "shortlisted", "review", "rejected"] as const).map((tab) => {
            const count =
              tab === "all"
                ? mergedCandidates.length
                : tab === "shortlisted"
                  ? mergedCandidates.filter((c) => c.effectiveDecision === "SHORTLIST").length
                  : tab === "review"
                    ? mergedCandidates.filter((c) => c.effectiveDecision === "REVIEW").length
                    : mergedCandidates.filter((c) => c.effectiveDecision === "REJECT").length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`capitalize px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {tab === "all" ? "All" : tab} ({count})
              </button>
            );
          })}
        </div>

        <div className="text-xs text-muted-foreground">
          {compareIds.length} candidate(s) selected for comparison
        </div>
      </div>

      {/* Candidates Screening Grid / Empty States */}
      {screeningLoading && mergedCandidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
          <p className="text-sm font-medium text-foreground">Loading screening results...</p>
        </div>
      ) : jobCandidates.length === 0 && mergedCandidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card">
          <Sparkles className="h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-sm font-medium text-muted-foreground">
            No candidates found for this job requisition
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1 max-w-sm">
            Add or assign applicants to this specific job requisition to start AI screening.
          </p>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card">
          <Sparkles className="h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-sm font-medium text-muted-foreground">No candidates in this tab</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            No candidates match the &quot;{activeTab}&quot; filter criteria for this requisition.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCandidates.map((cand) => {
            const isDecisionAllowed =
              cand.status === "COMPLETED" &&
              Boolean(cand.screeningId) &&
              !cand.humanDecision;

            const decisionTooltip = cand.humanDecision
              ? "Decision already recorded"
              : cand.status !== "COMPLETED" || !cand.screeningId
                ? "Run AI screening first"
                : undefined;

            return (
              <div
                key={cand.id}
                className={`rounded-2xl border bg-card p-4 transition-all duration-200 flex flex-col justify-between ${
                  compareIds.includes(cand.id)
                    ? "border-primary ring-1 ring-primary/30"
                    : "border-border"
                }`}
              >
                <div>
                  {/* Header: Name, Position & Match Score */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-sm text-foreground">{cand.name}</h4>
                      <div className="text-xs text-muted-foreground">{cand.appliedPosition}</div>
                    </div>

                    <div className="text-right flex flex-col items-end gap-1">
                      {cand.isScreened && cand.matchScore !== null ? (
                        <>
                          <div className="font-display text-lg font-bold text-foreground">
                            {cand.matchScore}%
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-[9px] uppercase tracking-wider font-bold ${
                              cand.effectiveDecision === "SHORTLIST"
                                ? statusBadgeClass("approved")
                                : cand.effectiveDecision === "REJECT"
                                  ? statusBadgeClass("critical")
                                  : statusBadgeClass("warning")
                            }`}
                          >
                            {cand.effectiveDecision || "Review"}
                          </Badge>
                        </>
                      ) : (
                        <Badge
                          variant="outline"
                          className={`text-[9px] uppercase tracking-wider font-bold ${statusBadgeClass("pending")}`}
                        >
                          Not screened yet
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Status Chips: Pending / Running / Failed with Error & Retry */}
                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    {cand.status === "RUNNING" ? (
                      <Badge
                        variant="outline"
                        className={`text-[10px] flex items-center gap-1 ${statusBadgeClass("info")}`}
                      >
                        <Loader2 className="h-2.5 w-2.5 animate-spin" />
                        Running
                      </Badge>
                    ) : cand.status === "PENDING" ? (
                      <Badge
                        variant="outline"
                        className="border-border text-muted-foreground text-[10px]"
                      >
                        Pending
                      </Badge>
                    ) : cand.status === "FAILED" ? (
                      <div className="flex items-center gap-1.5">
                        <Badge
                          variant="outline"
                          className={`text-[10px] ${statusBadgeClass("critical")}`}
                        >
                          Failed
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-5 px-1.5 text-[10px] text-primary hover:text-primary/80"
                          onClick={() => handleRetryCandidate(cand)}
                        >
                          <RotateCw className="h-2.5 w-2.5 mr-1" />
                          Retry
                        </Button>
                      </div>
                    ) : cand.confidence > 0 ? (
                      <span className="text-[10px] text-muted-foreground">
                        Confidence: {cand.confidence}%
                      </span>
                    ) : null}

                    {cand.modelUsed && (
                      <span className="text-[10px] text-muted-foreground/60">
                        {cand.modelUsed}
                      </span>
                    )}
                  </div>

                  {/* Error Message if Failed */}
                  {cand.status === "FAILED" && cand.error && (
                    <p className="mt-2 text-[11px] text-destructive italic bg-destructive/10 p-2 rounded-lg border border-destructive/20">
                      {cand.error}
                    </p>
                  )}

                  {/* AI Rationale & Hiring Recommendation */}
                  {cand.isScreened && (cand.hiringRecommendation || cand.hrNotes) ? (
                    <div className="mt-3 rounded-xl bg-muted/40 p-2.5 text-[11px] text-muted-foreground leading-relaxed border border-border/60">
                      <span className="font-semibold text-foreground flex items-center gap-1 mb-1">
                        <Sparkles className="h-3 w-3 text-primary" />
                        AI Rationale:
                      </span>
                      <p className="line-clamp-2">
                        {cand.hiringRecommendation || cand.hrNotes || "Assessment complete."}
                      </p>
                    </div>
                  ) : (
                    <div className="mt-3 rounded-xl bg-muted/20 p-2.5 text-[11px] text-muted-foreground/70 border border-border/40">
                      Candidate has not been analyzed yet. Run AI screening to generate evaluation.
                    </div>
                  )}

                  {/* Strengths & Missing Skills */}
                  {cand.strengths.length > 0 && (
                    <div className="mt-2.5 space-y-1">
                      <div className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                        <CheckCircle className="h-3 w-3 text-primary" />
                        Top Strengths:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cand.strengths.slice(0, 2).map((s) => (
                          <Badge
                            key={s}
                            variant="secondary"
                            className="text-[9px] bg-primary/10 text-primary border border-primary/20"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {cand.missingSkills.length > 0 && (
                    <div className="mt-2 space-y-1">
                      <div className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-muted-foreground" />
                        Missing Skills:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {cand.missingSkills.slice(0, 2).map((s) => (
                          <Badge
                            key={s}
                            variant="secondary"
                            className="text-[9px] bg-muted text-muted-foreground border border-border"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Human Decision Info if exists */}
                  {cand.humanDecision && (
                    <div className="mt-3 rounded-lg border border-border/80 bg-accent/30 p-2 text-xs">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="flex items-center gap-1 text-[11px] text-foreground">
                          <UserCheck className="h-3.5 w-3.5 text-primary" />
                          Human: {cand.humanDecision}
                        </span>
                        {cand.humanDecisionBy && (
                          <span className="text-[10px] text-muted-foreground">
                            by {cand.humanDecisionBy}
                          </span>
                        )}
                      </div>
                      {cand.humanDecisionReason && (
                        <p className="mt-1 text-[10px] text-muted-foreground italic line-clamp-1">
                          &quot;{cand.humanDecisionReason}&quot;
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions: Compare Checkbox, Inspect, Shortlist, Reject */}
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                  <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground hover:text-foreground">
                    <input
                      type="checkbox"
                      checked={compareIds.includes(cand.id)}
                      onChange={() => handleToggleCompare(cand.id)}
                      className="rounded border-border text-primary"
                      aria-label={`Compare ${cand.name}`}
                    />
                    Compare
                  </label>

                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs px-2"
                      onClick={() => setInspectCandidate(cand)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Inspect
                    </Button>

                    {/* Shortlist Button (enabled ONLY when COMPLETED && screeningId && !humanDecision) */}
                    <span title={decisionTooltip}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs px-2 text-emerald-600 dark:text-emerald-400 border-border hover:bg-muted/50 disabled:opacity-40"
                        disabled={!isDecisionAllowed}
                        onClick={() => openConfirmDialog(cand, "SHORTLIST")}
                        aria-label={`Shortlist ${cand.name}`}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    </span>

                    {/* Reject Button (enabled ONLY when COMPLETED && screeningId && !humanDecision) */}
                    <span title={decisionTooltip}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs px-2 text-destructive border-destructive/30 hover:bg-destructive/10 disabled:opacity-40"
                        disabled={!isDecisionAllowed}
                        onClick={() => openConfirmDialog(cand, "REJECT")}
                        aria-label={`Reject ${cand.name}`}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Candidate Inspect Dialog */}
      {inspectCandidate && (
        <Dialog open={Boolean(inspectCandidate)} onOpenChange={() => setInspectCandidate(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="capitalize">
                  {inspectCandidate.stage || "Screening"}
                </Badge>
                {inspectCandidate.matchScore !== null ? (
                  <span className="font-display text-lg font-bold text-foreground">
                    {inspectCandidate.matchScore}% Match
                  </span>
                ) : (
                  <Badge variant="outline" className={statusBadgeClass("pending")}>
                    Not screened yet
                  </Badge>
                )}
              </div>
              <DialogTitle className="text-xl font-bold">{inspectCandidate.name}</DialogTitle>
              <DialogDescription>
                {[
                  inspectCandidate.appliedPosition
                    ? `Applied for ${inspectCandidate.appliedPosition}`
                    : "",
                  inspectCandidate.yearsExperience
                    ? `${inspectCandidate.yearsExperience} yrs experience`
                    : "",
                  inspectCandidate.currentCompany
                    ? `at ${inspectCandidate.currentCompany}`
                    : "",
                ]
                  .filter(Boolean)
                  .join(" • ")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              {/* Hiring Recommendation & Notes */}
              {inspectCandidate.hiringRecommendation && (
                <div>
                  <Label className="font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-primary" />
                    AI Hiring Recommendation
                  </Label>
                  <p className="mt-1 p-3 rounded-xl border border-border bg-card leading-relaxed text-foreground">
                    {inspectCandidate.hiringRecommendation}
                  </p>
                </div>
              )}

              {inspectCandidate.hrNotes && (
                <div>
                  <Label className="font-semibold text-muted-foreground">
                    HR Notes &amp; Observations
                  </Label>
                  <p className="mt-1 p-3 rounded-xl border border-border bg-muted/30 text-foreground">
                    {inspectCandidate.hrNotes}
                  </p>
                </div>
              )}

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="font-semibold text-foreground flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-primary" />
                    Key Strengths ({inspectCandidate.strengths.length})
                  </Label>
                  <div className="mt-1.5 space-y-1">
                    {inspectCandidate.strengths.length > 0 ? (
                      inspectCandidate.strengths.map((s) => (
                        <div
                          key={s}
                          className="p-2 rounded-lg bg-primary/10 border border-primary/20 text-primary text-[11px]"
                        >
                          {s}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic text-[11px]">
                        No specific strengths identified
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="font-semibold text-foreground flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-muted-foreground" />
                    Identified Weaknesses ({inspectCandidate.weaknesses.length})
                  </Label>
                  <div className="mt-1.5 space-y-1">
                    {inspectCandidate.weaknesses.length > 0 ? (
                      inspectCandidate.weaknesses.map((w) => (
                        <div
                          key={w}
                          className="p-2 rounded-lg bg-muted border border-border text-foreground text-[11px]"
                        >
                          {w}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic text-[11px]">
                        No weaknesses noted
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Missing Skills */}
              {inspectCandidate.missingSkills.length > 0 && (
                <div>
                  <Label className="font-semibold text-muted-foreground">
                    Missing Required Skills
                  </Label>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {inspectCandidate.missingSkills.map((ms) => (
                      <Badge
                        key={ms}
                        variant="outline"
                        className="border-border text-muted-foreground text-[10px]"
                      >
                        {ms}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Green Flags & Red Flags */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {inspectCandidate.greenFlags.length > 0 && (
                  <div>
                    <Label className="font-semibold text-foreground flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" />
                      Green Flags
                    </Label>
                    <ul className="mt-1 space-y-1 list-disc list-inside text-muted-foreground text-[11px]">
                      {inspectCandidate.greenFlags.map((gf) => (
                        <li key={gf}>{gf}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {inspectCandidate.redFlags.length > 0 && (
                  <div>
                    <Label className="font-semibold text-destructive flex items-center gap-1">
                      <AlertOctagon className="h-3.5 w-3.5 text-destructive" />
                      Red Flags
                    </Label>
                    <ul className="mt-1 space-y-1 list-disc list-inside text-destructive text-[11px]">
                      {inspectCandidate.redFlags.map((rf) => (
                        <li key={rf}>{rf}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Suggested Interview Questions */}
              {inspectCandidate.questionsToAsk.length > 0 && (
                <div>
                  <Label className="font-semibold text-foreground flex items-center gap-1.5">
                    <HelpCircle className="h-3.5 w-3.5 text-primary" />
                    Suggested Interview Questions
                  </Label>
                  <ol className="mt-1.5 space-y-1.5 list-decimal list-inside p-3 rounded-xl border border-border bg-card text-foreground text-[11px]">
                    {inspectCandidate.questionsToAsk.map((q) => (
                      <li key={q} className="leading-relaxed">
                        {q}
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Human Decision info if already made */}
              {inspectCandidate.humanDecision && (
                <div className="p-3 rounded-xl border border-border bg-accent/20">
                  <div className="font-semibold text-foreground flex items-center gap-1.5">
                    <UserCheck className="h-4 w-4 text-primary" />
                    Recorded Human Decision: {inspectCandidate.humanDecision}
                  </div>
                  {inspectCandidate.humanDecisionBy && (
                    <div className="text-muted-foreground text-[11px] mt-0.5">
                      Decided by {inspectCandidate.humanDecisionBy}
                    </div>
                  )}
                  {inspectCandidate.humanDecisionReason && (
                    <p className="mt-1 text-muted-foreground italic text-[11px]">
                      &quot;{inspectCandidate.humanDecisionReason}&quot;
                    </p>
                  )}
                </div>
              )}

              {/* Modal Footer Actions */}
              <div className="flex justify-between items-center pt-3 border-t border-border">
                <Button variant="outline" onClick={() => setInspectCandidate(null)}>
                  Close
                </Button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="text-destructive border-destructive/30 hover:bg-destructive/10 disabled:opacity-40"
                    disabled={
                      inspectCandidate.status !== "COMPLETED" ||
                      !inspectCandidate.screeningId ||
                      Boolean(inspectCandidate.humanDecision)
                    }
                    onClick={() => openConfirmDialog(inspectCandidate, "REJECT")}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Reject Candidate
                  </Button>
                  <Button
                    className="disabled:opacity-40"
                    disabled={
                      inspectCandidate.status !== "COMPLETED" ||
                      !inspectCandidate.screeningId ||
                      Boolean(inspectCandidate.humanDecision)
                    }
                    onClick={() => openConfirmDialog(inspectCandidate, "SHORTLIST")}
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Shortlist Candidate
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Candidate Side-by-Side Comparison Modal */}
      <Dialog open={showCompareModal} onOpenChange={setShowCompareModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-primary" />
              Side-by-Side Candidate Comparison
            </DialogTitle>
            <DialogDescription>
              Comparing {compareList.length} candidates
              {selectedJob ? ` for ${selectedJob.title}` : ""}
            </DialogDescription>
          </DialogHeader>

          <div className="py-3 overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2.5 w-1/4 font-semibold text-muted-foreground">
                    Evaluation Vector
                  </th>
                  {compareList.map((c) => (
                    <th key={c.id} className="p-2.5 w-1/4">
                      <div className="font-bold text-sm text-foreground">{c.name}</div>
                      {c.currentCompany && (
                        <div className="text-[11px] text-muted-foreground">
                          {c.currentCompany}
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-2.5 font-medium text-muted-foreground">ATS Match Score</td>
                  {compareList.map((c) => (
                    <td key={c.id} className="p-2.5 font-bold text-sm text-foreground">
                      {c.matchScore !== null ? `${c.matchScore}%` : "Not Screened"} (
                      {c.effectiveDecision || "Review"})
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-muted-foreground">AI Recommendation</td>
                  {compareList.map((c) => (
                    <td
                      key={c.id}
                      className="p-2.5 text-[11px] text-muted-foreground leading-normal"
                    >
                      {c.hiringRecommendation || "No recommendation generated"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-muted-foreground">Key Strengths</td>
                  {compareList.map((c) => (
                    <td key={c.id} className="p-2.5">
                      {c.strengths.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {c.strengths.map((s) => (
                            <Badge
                              key={s}
                              variant="secondary"
                              className="text-[9px] bg-primary/10 text-primary"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-muted-foreground">Missing Skills</td>
                  {compareList.map((c) => (
                    <td key={c.id} className="p-2.5">
                      {c.missingSkills.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {c.missingSkills.map((s) => (
                            <Badge
                              key={s}
                              variant="outline"
                              className="text-[9px] border-border text-muted-foreground"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground italic">None noted</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-muted-foreground">
                    Green &amp; Red Flags
                  </td>
                  {compareList.map((c) => (
                    <td key={c.id} className="p-2.5 text-[11px] space-y-1">
                      {c.greenFlags.map((gf) => (
                        <div key={gf} className="text-foreground flex items-center gap-1">
                          <Check className="h-3 w-3 shrink-0" /> {gf}
                        </div>
                      ))}
                      {c.redFlags.map((rf) => (
                        <div key={rf} className="text-destructive flex items-center gap-1">
                          <AlertOctagon className="h-3 w-3 shrink-0" /> {rf}
                        </div>
                      ))}
                      {c.greenFlags.length === 0 && c.redFlags.length === 0 && (
                        <span className="text-muted-foreground italic">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-muted-foreground">HR Notes</td>
                  {compareList.map((c) => (
                    <td key={c.id} className="p-2.5 text-[11px] text-muted-foreground">
                      {c.hrNotes || "No notes"}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-muted-foreground">Questions to Ask</td>
                  {compareList.map((c) => (
                    <td key={c.id} className="p-2.5 text-[11px] text-muted-foreground">
                      {c.questionsToAsk.length > 0 ? (
                        <ul className="list-disc list-inside space-y-0.5">
                          {c.questionsToAsk.slice(0, 2).map((q) => (
                            <li key={q}>{q}</li>
                          ))}
                        </ul>
                      ) : (
                        <span className="italic">—</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-muted-foreground">Human Decision</td>
                  {compareList.map((c) => (
                    <td key={c.id} className="p-2.5">
                      {c.humanDecision ? (
                        <Badge variant="outline" className="text-xs">
                          {c.humanDecision}
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          className="w-full h-8 text-xs"
                          disabled={
                            c.status !== "COMPLETED" ||
                            !c.screeningId ||
                            Boolean(c.humanDecision)
                          }
                          onClick={() => {
                            setShowCompareModal(false);
                            openConfirmDialog(c, "SHORTLIST");
                          }}
                        >
                          Shortlist
                        </Button>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>

      {/* Re-screen All Confirmation Dialog */}
      {showRescreenConfirm && (
        <Dialog open={showRescreenConfirm} onOpenChange={setShowRescreenConfirm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                Confirm Complete Re-Screening
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to re-screen all {mergedCandidates.length} candidate(s) for{" "}
                {selectedJob?.title || "this job"}? This will overwrite previous analysis and
                consume additional AI credits.
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button variant="outline" onClick={() => setShowRescreenConfirm(false)}>
                Cancel
              </Button>
              <Button
                variant="default"
                disabled={screeningSubmitting}
                onClick={() => handleRunScreening(true)}
              >
                {screeningSubmitting ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    Starting...
                  </>
                ) : (
                  "Confirm Re-Screen All"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Shortlist / Reject Confirmation Dialog (Reject requires >= 10 chars) */}
      {confirmDialog && (
        <Dialog open={Boolean(confirmDialog)} onOpenChange={() => setConfirmDialog(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {confirmDialog.type === "SHORTLIST" ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-primary" />
                    Confirm Shortlist Decision
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Confirm Rejection Decision
                  </>
                )}
              </DialogTitle>
              <DialogDescription>
                {confirmDialog.type === "SHORTLIST"
                  ? `Are you sure you want to shortlist ${confirmDialog.candidate.name} for the ${selectedJob?.title || "selected"} position?`
                  : `Please provide a documented rejection reason for ${confirmDialog.candidate.name}. A minimum 10-character explanation is required.`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              {confirmDialog.type === "REJECT" && (
                <div className="space-y-1.5">
                  <Label htmlFor="reject-reason" className="font-semibold text-foreground">
                    Rejection Reason <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="reject-reason"
                    value={rejectReason}
                    onChange={(e) => {
                      setRejectReason(e.target.value);
                      if (rejectReasonError && e.target.value.trim().length >= 10) {
                        setRejectReasonError("");
                      }
                    }}
                    placeholder="Provide a compliant, constructive reason (e.g. Lacks required 3+ years experience with Kubernetes)..."
                    rows={4}
                    className="text-xs"
                    aria-describedby="reject-reason-help"
                  />
                  <div
                    id="reject-reason-help"
                    className="flex justify-between items-center text-[11px] text-muted-foreground pt-1"
                  >
                    <span>{rejectReason.trim().length} / 10 minimum characters</span>
                    {rejectReason.trim().length >= 10 && (
                      <span className="text-foreground font-medium">Valid</span>
                    )}
                  </div>
                  {rejectReasonError && (
                    <p className="text-destructive text-[11px] font-medium" role="alert">
                      {rejectReasonError}
                    </p>
                  )}
                </div>
              )}

              {confirmDialog.type === "SHORTLIST" && (
                <div className="space-y-1.5">
                  <Label htmlFor="shortlist-reason" className="font-semibold text-foreground">
                    Optional Review Note
                  </Label>
                  <Textarea
                    id="shortlist-reason"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Optional notes for the hiring team or interviewer..."
                    rows={3}
                    className="text-xs"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <Button variant="outline" onClick={() => setConfirmDialog(null)}>
                  Cancel
                </Button>
                <Button
                  variant={confirmDialog.type === "REJECT" ? "destructive" : "default"}
                  disabled={
                    screeningSubmitting ||
                    (confirmDialog.type === "REJECT" && rejectReason.trim().length < 10)
                  }
                  onClick={handleConfirmDecision}
                >
                  {screeningSubmitting ? (
                    <>
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      Saving...
                    </>
                  ) : confirmDialog.type === "SHORTLIST" ? (
                    "Confirm Shortlist"
                  ) : (
                    "Confirm Rejection"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default AIScreeningPage;
