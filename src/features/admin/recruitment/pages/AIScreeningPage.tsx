import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import {
  Sparkles,
  Sliders,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
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
    runScreening,
    fetchScreeningResults,
    submitDecision,
  } = useRecruitment();

  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || "");
  const [activeTab, setActiveTab] = useState<"all" | "shortlisted" | "review" | "rejected">("all");

  // Normalized Screening Criteria Weights (sum always = 100%)
  const [weights, setWeights] = useState({
    skill: 40,
    exp: 30,
    edu: 20,
    cert: 10,
  });

  // Candidate Comparison State (up to 3 candidates)
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Detail Modal State
  const [inspectCandidate, setInspectCandidate] = useState<CandidateScreeningView | null>(null);

  // Confirmation Decision Dialog State
  const [confirmDialog, setConfirmDialog] = useState<{
    type: "SHORTLIST" | "REJECT";
    candidate: CandidateScreeningView;
  } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectReasonError, setRejectReasonError] = useState("");

  // Fix render side effect: use useEffect instead of useMemo to sync selectedJobId
  useEffect(() => {
    if ((!selectedJobId || !jobs.some((j) => j.id === selectedJobId)) && jobs.length > 0) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  const selectedJob = useMemo(
    () => jobs.find((j) => j.id === selectedJobId) || null,
    [jobs, selectedJobId],
  );

  // Fix candidate bug: NEVER fallback to all candidates when selected job has zero candidates
  const jobCandidates = useMemo(() => {
    if (!selectedJobId) return [];
    return candidates.filter((c) => c.jobId === selectedJobId);
  }, [candidates, selectedJobId]);

  // Initial fetch of screening results for the selected job (guarded against double mount)
  const lastFetchedJobIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (!selectedJobId || lastFetchedJobIdRef.current === selectedJobId) return;
    lastFetchedJobIdRef.current = selectedJobId;
    fetchScreeningResults(selectedJobId).catch(() => {});
  }, [selectedJobId, fetchScreeningResults]);

  // Polling: ONLY while run is RUNNING; stop on completed/failed/unmount/404
  useEffect(() => {
    if (!selectedJobId || !screeningRun) return;
    const isRunning = screeningRun.status?.toUpperCase() === "RUNNING";

    if (!isRunning) return;

    const timer = setInterval(() => {
      fetchScreeningResults(selectedJobId).catch(() => {});
    }, 3000);

    return () => {
      clearInterval(timer);
    };
  }, [selectedJobId, screeningRun?.status, fetchScreeningResults]);

  // Auto-normalize weight sliders to ensure sum equals exactly 100%
  const handleWeightChange = useCallback(
    (key: "skill" | "exp" | "edu" | "cert", newVal: number) => {
      const clampedVal = Math.max(5, Math.min(70, newVal));
      const remainingTarget = 100 - clampedVal;
      const otherKeys = (["skill", "exp", "edu", "cert"] as const).filter((k) => k !== key);
      const currentOtherSum = otherKeys.reduce((acc, k) => acc + weights[k], 0);

      const nextWeights = { ...weights, [key]: clampedVal };

      if (currentOtherSum > 0) {
        let distributedSum = 0;
        otherKeys.forEach((k, idx) => {
          if (idx === otherKeys.length - 1) {
            nextWeights[k] = Math.max(5, remainingTarget - distributedSum);
          } else {
            const scaled = Math.max(
              5,
              Math.round((weights[k] / currentOtherSum) * remainingTarget),
            );
            nextWeights[k] = scaled;
            distributedSum += scaled;
          }
        });
      } else {
        const share = Math.floor(remainingTarget / otherKeys.length);
        otherKeys.forEach((k, idx) => {
          nextWeights[k] =
            idx === otherKeys.length - 1 ? remainingTarget - share * (otherKeys.length - 1) : share;
        });
      }

      setWeights(nextWeights);
    },
    [weights],
  );

  const totalWeight = weights.skill + weights.exp + weights.edu + weights.cert;

  // Merge job candidates with backend AI screening results
  const mergedCandidates = useMemo<CandidateScreeningView[]>(() => {
    const list: CandidateScreeningView[] = jobCandidates.map((c) => {
      const res = screeningResults.find(
        (r) =>
          r.candidateId === c.id ||
          (c.applicationId && r.applicationId === c.applicationId) ||
          r.candidateName.toLowerCase() === c.name.toLowerCase(),
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
          skills: c.skills?.length ? c.skills : res.missingSkills,
          summary: c.summary,
          stage: c.stage,
          isScreened: true,
          status: res.status,
          decision: res.decision,
          confidence: res.confidence,
          matchScore: res.matchScore,
          strengths: res.strengths,
          weaknesses: res.weaknesses,
          missingSkills: res.missingSkills,
          redFlags: res.redFlags,
          greenFlags: res.greenFlags,
          hiringRecommendation: res.hiringRecommendation,
          hrNotes: res.hrNotes,
          questionsToAsk: res.questionsToAsk,
          modelUsed: res.modelUsed,
          screenedAt: res.screenedAt,
          humanDecision: res.humanDecision,
          humanDecisionBy: res.humanDecisionBy,
          humanDecisionReason: res.humanDecisionReason,
          screeningId: res.screeningId || res.id,
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

    // Also include candidates returned in backend screeningResults if not present in client pipeline
    screeningResults.forEach((res) => {
      const alreadyIncluded = list.some(
        (c) =>
          c.candidateId === res.candidateId ||
          (res.applicationId && c.applicationId === res.applicationId) ||
          c.name.toLowerCase() === res.candidateName.toLowerCase(),
      );

      if (!alreadyIncluded) {
        const effDecision =
          res.humanDecision === "SHORTLIST"
            ? "SHORTLIST"
            : res.humanDecision === "REJECT"
              ? "REJECT"
              : res.humanDecision === "KEEP_REVIEW"
                ? "REVIEW"
                : res.decision;

        list.push({
          id: res.candidateId || res.id,
          candidateId: res.candidateId || res.id,
          applicationId: res.applicationId || res.id,
          name: res.candidateName,
          appliedPosition: selectedJob?.title || "Candidate",
          skills: [],
          isScreened: true,
          status: res.status,
          decision: res.decision,
          confidence: res.confidence,
          matchScore: res.matchScore,
          strengths: res.strengths,
          weaknesses: res.weaknesses,
          missingSkills: res.missingSkills,
          redFlags: res.redFlags,
          greenFlags: res.greenFlags,
          hiringRecommendation: res.hiringRecommendation,
          hrNotes: res.hrNotes,
          questionsToAsk: res.questionsToAsk,
          modelUsed: res.modelUsed,
          screenedAt: res.screenedAt,
          humanDecision: res.humanDecision,
          humanDecisionBy: res.humanDecisionBy,
          humanDecisionReason: res.humanDecisionReason,
          screeningId: res.screeningId || res.id,
          effectiveDecision: effDecision,
        });
      }
    });

    return list;
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

  // Trigger Run AI Screening for selected job
  const handleRunScreening = async () => {
    if (!selectedJobId) {
      toast.error("Please select a job first.");
      return;
    }
    try {
      await runScreening({ jobId: selectedJobId });
      toast.success("AI Screening job started. Processing resumes...");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to run AI screening";
      toast.error(msg);
    }
  };

  // Retry individual candidate screening
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

  // Open confirmation dialog for shortlist or reject
  const openConfirmDialog = (
    candidate: CandidateScreeningView,
    type: "SHORTLIST" | "REJECT",
  ) => {
    setConfirmDialog({ type, candidate });
    setRejectReason("");
    setRejectReasonError("");
  };

  // Submit human decision with validation
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

    const screeningId = candidate.screeningId || candidate.applicationId || candidate.id;
    if (!screeningId) {
      toast.error("No valid screening ID found for this candidate.");
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
          <Button
            onClick={() => setShowCompareModal(true)}
            className="gap-1.5 bg-gradient-brand text-brand-foreground shadow-glow"
          >
            <GitCompare className="h-4 w-4" />
            Compare ({compareIds.length}) Candidates
          </Button>
        </div>
      )}

      {/* Target Job Selector & Screening Weights Configuration */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Requisition Card */}
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl lg:col-span-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">Active Requisition</span>
            <Sparkles className="h-4 w-4 text-indigo-500" />
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
              {selectedJob.skills.length > 0 && (
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

          {/* Run AI Screening Button & Progress */}
          <div className="pt-2 border-t border-border space-y-2">
            <Button
              className="w-full text-xs h-9 bg-gradient-brand text-brand-foreground shadow-glow gap-1.5"
              onClick={handleRunScreening}
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

            {/* Run Progress Display with aria-live */}
            {screeningRun && (
              <div
                className="space-y-1.5 pt-1 text-xs"
                role="status"
                aria-live="polite"
              >
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

        {/* 8. Weight Sliders: Auto-Normalized & Renamed Education */}
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-sm flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-indigo-500" />
                Screening Criteria Weightings
              </h3>
              <p className="text-xs text-muted-foreground">
                Weights dynamically auto-balance to enforce a strict total of 100%.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className={`text-xs font-semibold ${
                  totalWeight === 100
                    ? "border-emerald-500/40 text-emerald-500 bg-emerald-500/10"
                    : "border-amber-500/40 text-amber-500"
                }`}
              >
                Total: {totalWeight}%
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => {
                  setWeights({ skill: 40, exp: 30, edu: 20, cert: 10 });
                  toast.info("Reset weights to balanced defaults");
                }}
              >
                Reset Default
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span>Skills & Tech Stack ({weights.skill}%)</span>
                <span className="text-muted-foreground">{weights.skill}%</span>
              </div>
              <Slider
                value={[weights.skill]}
                min={5}
                max={70}
                step={5}
                onValueChange={(v) => handleWeightChange("skill", v[0])}
                aria-label="Skills & Tech Stack Weight"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span>Years of Experience ({weights.exp}%)</span>
                <span className="text-muted-foreground">{weights.exp}%</span>
              </div>
              <Slider
                value={[weights.exp]}
                min={5}
                max={70}
                step={5}
                onValueChange={(v) => handleWeightChange("exp", v[0])}
                aria-label="Years of Experience Weight"
              />
            </div>

            {/* Renamed "Education & Pedigree" to "Education" */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span>Education ({weights.edu}%)</span>
                <span className="text-muted-foreground">{weights.edu}%</span>
              </div>
              <Slider
                value={[weights.edu]}
                min={5}
                max={70}
                step={5}
                onValueChange={(v) => handleWeightChange("edu", v[0])}
                aria-label="Education Weight"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between font-medium">
                <span>Certifications & Projects ({weights.cert}%)</span>
                <span className="text-muted-foreground">{weights.cert}%</span>
              </div>
              <Slider
                value={[weights.cert]}
                min={5}
                max={70}
                step={5}
                onValueChange={(v) => handleWeightChange("cert", v[0])}
                aria-label="Certifications & Projects Weight"
              />
            </div>
          </div>

          {/* Backend Thresholds Display */}
          <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-indigo-400" />
              <span>Backend AI Thresholds:</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-emerald-500 font-medium">
                Shortlist: ≥ {screeningThresholds.shortlist}%
              </span>
              <span className="text-rose-500 font-medium">
                Reject: &lt; {screeningThresholds.reject}%
              </span>
            </div>
          </div>
        </div>
      </div>

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
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card/20">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-2" />
          <p className="text-sm font-medium text-foreground">Loading screening results...</p>
        </div>
      ) : jobCandidates.length === 0 && mergedCandidates.length === 0 ? (
        // 5. Zero Candidates Empty State for Selected Job (NEVER fall back to other jobs)
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card/20">
          <Sparkles className="h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-sm font-medium text-muted-foreground">
            No candidates found for this job requisition
          </p>
          <p className="text-xs text-muted-foreground/60 mt-1 max-w-sm">
            Add or assign applicants to this specific job requisition to start AI screening.
          </p>
        </div>
      ) : filteredCandidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-border bg-card/20">
          <Sparkles className="h-8 w-8 text-muted-foreground/30 mb-2" />
          <p className="text-sm font-medium text-muted-foreground">No candidates in this tab</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            No candidates match the &quot;{activeTab}&quot; filter criteria for this requisition.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCandidates.map((cand) => (
            <div
              key={cand.id}
              className={`rounded-2xl border bg-card/60 p-4 backdrop-blur-xl transition-all duration-200 flex flex-col justify-between ${
                compareIds.includes(cand.id)
                  ? "border-indigo-500 ring-1 ring-indigo-500/30"
                  : "border-border"
              }`}
            >
              <div>
                {/* Header: Name, Position, Status Chip & Match Score */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{cand.name}</h4>
                    <div className="text-xs text-muted-foreground">{cand.appliedPosition}</div>
                  </div>

                  <div className="text-right flex flex-col items-end gap-1">
                    {/* 9. Not Screened Yet vs Backend Score */}
                    {cand.isScreened && cand.matchScore !== null ? (
                      <>
                        <div className="font-display text-lg font-bold text-foreground">
                          {cand.matchScore}%
                        </div>
                        <Badge
                          variant="outline"
                          className={`text-[9px] uppercase tracking-wider font-bold ${
                            cand.effectiveDecision === "SHORTLIST"
                              ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/30"
                              : cand.effectiveDecision === "REJECT"
                                ? "bg-rose-500/15 text-rose-600 border-rose-500/30"
                                : "bg-amber-500/15 text-amber-600 border-amber-500/30"
                          }`}
                        >
                          {cand.effectiveDecision || "Review"}
                        </Badge>
                      </>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[9px] uppercase tracking-wider font-bold border-amber-500/40 text-amber-500 bg-amber-500/10"
                      >
                        Not screened yet
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Status Chips: Pending / Running / Failed with Retry */}
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  {cand.status === "RUNNING" ? (
                    <Badge
                      variant="outline"
                      className="border-indigo-500/40 text-indigo-400 bg-indigo-500/10 text-[10px] flex items-center gap-1"
                    >
                      <Loader2 className="h-2.5 w-2.5 animate-spin" />
                      Running
                    </Badge>
                  ) : cand.status === "PENDING" ? (
                    <Badge variant="outline" className="border-border text-muted-foreground text-[10px]">
                      Pending
                    </Badge>
                  ) : cand.status === "FAILED" ? (
                    <div className="flex items-center gap-1.5">
                      <Badge
                        variant="outline"
                        className="border-rose-500/40 text-rose-500 bg-rose-500/10 text-[10px]"
                      >
                        Failed
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-5 px-1.5 text-[10px] text-indigo-400 hover:text-indigo-300"
                        onClick={() => handleRetryCandidate(cand)}
                      >
                        <RotateCw className="h-2.5 w-2.5 mr-1" />
                        Retry
                      </Button>
                    </div>
                  ) : cand.confidence > 0 ? (
                    <span className="text-[10px] text-muted-foreground">
                      Confidence: {Math.round(cand.confidence * (cand.confidence <= 1 ? 100 : 1))}%
                    </span>
                  ) : null}

                  {cand.modelUsed && (
                    <span className="text-[10px] text-muted-foreground/60">{cand.modelUsed}</span>
                  )}
                </div>

                {/* 4. AI Rationale & Hiring Recommendation */}
                {cand.isScreened && (cand.hiringRecommendation || cand.hrNotes) ? (
                  <div className="mt-3 rounded-xl bg-muted/40 p-2.5 text-[11px] text-muted-foreground leading-relaxed border border-border/60">
                    <span className="font-semibold text-foreground flex items-center gap-1 mb-1">
                      <Sparkles className="h-3 w-3 text-indigo-400" />
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

                {/* Strengths & Missing Skills Chips */}
                {cand.strengths.length > 0 && (
                  <div className="mt-2.5 space-y-1">
                    <div className="text-[10px] text-muted-foreground font-medium flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-emerald-500" />
                      Top Strengths:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {cand.strengths.slice(0, 2).map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="text-[9px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
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
                      <AlertTriangle className="h-3 w-3 text-amber-500" />
                      Missing Skills:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {cand.missingSkills.slice(0, 2).map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="text-[9px] bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. Show Human Decision Info if exists */}
                {cand.humanDecision && (
                  <div className="mt-3 rounded-lg border border-border/80 bg-accent/30 p-2 text-xs">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="flex items-center gap-1 text-[11px] text-foreground">
                        <UserCheck className="h-3.5 w-3.5 text-indigo-500" />
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
                    className="rounded border-border text-indigo-600"
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

                  {/* 7. Shortlist Button (disabled if already decided) */}
                  <Button
                    size="sm"
                    className="h-7 text-xs px-2 bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40"
                    disabled={Boolean(cand.humanDecision)}
                    onClick={() => openConfirmDialog(cand, "SHORTLIST")}
                    title={cand.humanDecision ? "Decision already recorded" : "Shortlist Candidate"}
                    aria-label={`Shortlist ${cand.name}`}
                  >
                    <Check className="h-3 w-3" />
                  </Button>

                  {/* 7. Reject Button (disabled if already decided) */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs px-2 text-rose-600 border-rose-500/30 hover:bg-rose-500/10 disabled:opacity-40"
                    disabled={Boolean(cand.humanDecision)}
                    onClick={() => openConfirmDialog(cand, "REJECT")}
                    title={cand.humanDecision ? "Decision already recorded" : "Reject Candidate"}
                    aria-label={`Reject ${cand.name}`}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. Candidate Inspect Dialog */}
      {inspectCandidate && (
        <Dialog open={Boolean(inspectCandidate)} onOpenChange={() => setInspectCandidate(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="capitalize">
                  {inspectCandidate.stage || "Screening"}
                </Badge>
                {inspectCandidate.matchScore !== null ? (
                  <span className="font-display text-lg font-bold text-indigo-500">
                    {inspectCandidate.matchScore}% Match
                  </span>
                ) : (
                  <Badge variant="outline" className="border-amber-500/40 text-amber-500">
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
                  inspectCandidate.currentCompany ? `at ${inspectCandidate.currentCompany}` : "",
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
                    <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                    AI Hiring Recommendation
                  </Label>
                  <p className="mt-1 p-3 rounded-xl border border-border bg-card/60 leading-relaxed text-foreground">
                    {inspectCandidate.hiringRecommendation}
                  </p>
                </div>
              )}

              {inspectCandidate.hrNotes && (
                <div>
                  <Label className="font-semibold text-muted-foreground">HR Notes & Observations</Label>
                  <p className="mt-1 p-3 rounded-xl border border-border bg-muted/30 text-foreground">
                    {inspectCandidate.hrNotes}
                  </p>
                </div>
              )}

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="font-semibold text-emerald-600 flex items-center gap-1">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                    Key Strengths ({inspectCandidate.strengths.length})
                  </Label>
                  <div className="mt-1.5 space-y-1">
                    {inspectCandidate.strengths.length > 0 ? (
                      inspectCandidate.strengths.map((s) => (
                        <div
                          key={s}
                          className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-[11px]"
                        >
                          {s}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic text-[11px]">No specific strengths identified</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label className="font-semibold text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                    Identified Weaknesses ({inspectCandidate.weaknesses.length})
                  </Label>
                  <div className="mt-1.5 space-y-1">
                    {inspectCandidate.weaknesses.length > 0 ? (
                      inspectCandidate.weaknesses.map((w) => (
                        <div
                          key={w}
                          className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-[11px]"
                        >
                          {w}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground italic text-[11px]">No weaknesses noted</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Missing Skills */}
              {inspectCandidate.missingSkills.length > 0 && (
                <div>
                  <Label className="font-semibold text-muted-foreground">Missing Required Skills</Label>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {inspectCandidate.missingSkills.map((ms) => (
                      <Badge key={ms} variant="outline" className="border-amber-500/40 text-amber-500 text-[10px]">
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
                    <Label className="font-semibold text-emerald-600 flex items-center gap-1">
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
                    <Label className="font-semibold text-rose-600 flex items-center gap-1">
                      <AlertOctagon className="h-3.5 w-3.5 text-rose-500" />
                      Red Flags
                    </Label>
                    <ul className="mt-1 space-y-1 list-disc list-inside text-rose-500/80 text-[11px]">
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
                    <HelpCircle className="h-3.5 w-3.5 text-indigo-500" />
                    Suggested Interview Questions
                  </Label>
                  <ol className="mt-1.5 space-y-1.5 list-decimal list-inside p-3 rounded-xl border border-border bg-card/60 text-foreground text-[11px]">
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
                    <UserCheck className="h-4 w-4 text-indigo-500" />
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
                    className="text-rose-600 border-rose-500/30 hover:bg-rose-500/10 disabled:opacity-40"
                    disabled={Boolean(inspectCandidate.humanDecision)}
                    onClick={() => openConfirmDialog(inspectCandidate, "REJECT")}
                  >
                    <X className="h-3 w-3 mr-1" />
                    Reject Candidate
                  </Button>
                  <Button
                    className="bg-gradient-brand text-brand-foreground shadow-glow disabled:opacity-40"
                    disabled={Boolean(inspectCandidate.humanDecision)}
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

      {/* 4. Candidate Side-by-Side Comparison Modal */}
      <Dialog open={showCompareModal} onOpenChange={setShowCompareModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <GitCompare className="h-5 w-5 text-indigo-500" />
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
                  <th className="p-2.5 w-1/4 font-semibold text-muted-foreground">Evaluation Vector</th>
                  {compareList.map((c) => (
                    <th key={c.id} className="p-2.5 w-1/4">
                      <div className="font-bold text-sm text-foreground">{c.name}</div>
                      {c.currentCompany && (
                        <div className="text-[11px] text-muted-foreground">{c.currentCompany}</div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-2.5 font-medium text-muted-foreground">ATS Match Score</td>
                  {compareList.map((c) => (
                    <td key={c.id} className="p-2.5 font-bold text-sm text-indigo-500">
                      {c.matchScore !== null ? `${c.matchScore}%` : "Not Screened"} (
                      {c.effectiveDecision || "Review"})
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-2.5 font-medium text-muted-foreground">AI Recommendation</td>
                  {compareList.map((c) => (
                    <td key={c.id} className="p-2.5 text-[11px] text-muted-foreground leading-normal">
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
                              className="text-[9px] bg-emerald-500/10 text-emerald-600"
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
                              className="text-[9px] border-amber-500/30 text-amber-600"
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
                  <td className="p-2.5 font-medium text-muted-foreground">Green &amp; Red Flags</td>
                  {compareList.map((c) => (
                    <td key={c.id} className="p-2.5 text-[11px] space-y-1">
                      {c.greenFlags.map((gf) => (
                        <div key={gf} className="text-emerald-600 flex items-center gap-1">
                          <Check className="h-3 w-3 shrink-0" /> {gf}
                        </div>
                      ))}
                      {c.redFlags.map((rf) => (
                        <div key={rf} className="text-rose-600 flex items-center gap-1">
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
                          className="w-full h-8 text-xs bg-gradient-brand text-brand-foreground shadow-glow"
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

      {/* 7. Shortlist / Reject Confirmation Dialog (Reject requires >= 10 chars) */}
      {confirmDialog && (
        <Dialog open={Boolean(confirmDialog)} onOpenChange={() => setConfirmDialog(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {confirmDialog.type === "SHORTLIST" ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    Confirm Shortlist Decision
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-rose-500" />
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
                    Rejection Reason <span className="text-rose-500">*</span>
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
                    <span>
                      {rejectReason.trim().length} / 10 minimum characters
                    </span>
                    {rejectReason.trim().length >= 10 && (
                      <span className="text-emerald-500 font-medium">Valid</span>
                    )}
                  </div>
                  {rejectReasonError && (
                    <p className="text-rose-500 text-[11px] font-medium" role="alert">
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
                  className={
                    confirmDialog.type === "SHORTLIST"
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-rose-600 hover:bg-rose-700 text-white"
                  }
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
