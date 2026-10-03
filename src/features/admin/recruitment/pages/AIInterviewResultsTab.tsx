import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldAlert,
  Send,
  FileText,
  UserCheck,
  UserX,
  Eye,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  aiInterviewBotApi,
  type AIInterviewResult,
  type TranscriptItem,
} from "@/services/aiInterviewBotApi";
import { useRecruitment } from "../hooks/useRecruitment";
import { toast } from "sonner";

export function AIInterviewResultsTab() {
  const { jobs, candidates } = useRecruitment();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<AIInterviewResult[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Invite candidate dialog
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string>("");
  const [inviting, setInviting] = useState(false);

  // Transcript dialog
  const [activeTranscript, setActiveTranscript] = useState<{
    candidateName: string;
    transcript: TranscriptItem[];
  } | null>(null);

  // Decision confirmation dialogs
  const [decisionModal, setDecisionModal] = useState<{
    open: boolean;
    result: AIInterviewResult | null;
    action: "SHORTLIST" | "REJECT" | null;
  }>({
    open: false,
    result: null,
    action: null,
  });
  const [decisionReason, setDecisionReason] = useState("");
  const [submittingDecision, setSubmittingDecision] = useState(false);

  const fetchResults = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const jobId = selectedJobId === "ALL" ? undefined : selectedJobId;
      const res = await aiInterviewBotApi.getResults(jobId);
      setResults(res.items || []);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to load AI interview results.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [selectedJobId]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  // Candidates list eligible for invite
  const candidateOptions = useMemo(() => {
    return candidates.flatMap((c) =>
      (c.applications || []).map((app) => ({
        applicationId: app.id,
        candidateName: c.name,
        candidateEmail: c.email,
        jobTitle: jobs.find((j) => j.id === app.jobId)?.title || "General",
        stage: app.stage,
      }))
    );
  }, [candidates, jobs]);

  const handleInviteSubmit = async () => {
    if (!selectedApplicationId) {
      toast.error("Please select an application to invite.");
      return;
    }
    setInviting(true);
    try {
      const res = await aiInterviewBotApi.inviteCandidate(selectedApplicationId);
      toast.success(
        res.invite_url
          ? `Invitation sent! Link: ${res.invite_url}`
          : "Interview bot invitation sent to candidate successfully!"
      );
      setInviteModalOpen(false);
      setSelectedApplicationId("");
      fetchResults();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to send invite.";
      toast.error(msg);
    } finally {
      setInviting(false);
    }
  };

  const openDecisionModal = (result: AIInterviewResult, action: "SHORTLIST" | "REJECT") => {
    setDecisionReason("");
    setDecisionModal({
      open: true,
      result,
      action,
    });
  };

  const handleDecisionSubmit = async () => {
    if (!decisionModal.result || !decisionModal.action) return;

    if (decisionModal.action === "REJECT" && decisionReason.trim().length < 10) {
      toast.error("Rejection reason must be at least 10 characters long.");
      return;
    }

    setSubmittingDecision(true);
    try {
      const res = await aiInterviewBotApi.submitDecision(decisionModal.result.id, {
        action: decisionModal.action,
        reason: decisionReason.trim() || undefined,
      });

      const updated = res.data;
      setResults((prev) =>
        prev.map((r) =>
          r.id === decisionModal.result?.id
            ? {
                ...r,
                human_decision: updated?.human_decision || decisionModal.action,
                human_decision_by: updated?.human_decision_by || "HR Reviewer",
                human_decision_reason: updated?.human_decision_reason || decisionReason.trim(),
                human_decided_at: updated?.human_decided_at || new Date().toISOString(),
              }
            : r
        )
      );

      toast.success(
        decisionModal.action === "SHORTLIST"
          ? "Candidate shortlisted successfully!"
          : "Candidate rejected."
      );
      setDecisionModal({ open: false, result: null, action: null });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to submit decision.";
      toast.error(msg);
    } finally {
      setSubmittingDecision(false);
    }
  };

  // Filtered results
  const filteredResults = useMemo(() => {
    return results.filter((r) => {
      if (selectedJobId !== "ALL" && r.job_id !== selectedJobId) return false;
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const nameMatch = r.candidate_name.toLowerCase().includes(q);
        const jobMatch = r.job_title?.toLowerCase().includes(q) || false;
        if (!nameMatch && !jobMatch) return false;
      }
      return true;
    });
  }, [results, selectedJobId, statusFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-3">
          {/* Job Filter */}
          <div className="w-56">
            <Select value={selectedJobId} onValueChange={setSelectedJobId}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="All Jobs" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Jobs</SelectItem>
                {jobs.map((j) => (
                  <SelectItem key={j.id} value={j.id}>
                    {j.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="INVITED">Invited</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="EXPIRED">Expired</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Query */}
          <div className="relative w-56">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate..."
              className="h-9 pl-8 text-xs"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchResults}
            disabled={loading}
            className="h-9 gap-1.5 text-xs"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => setInviteModalOpen(true)}
            className="h-9 gap-1.5 text-xs"
          >
            <Send className="h-3.5 w-3.5" /> Invite Candidate
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-24 w-full rounded-xl" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
          <h3 className="font-semibold text-foreground">Failed to Load AI Interview Results</h3>
          <p className="text-xs text-muted-foreground mt-1">{error}</p>
          <Button onClick={fetchResults} variant="outline" size="sm" className="mt-4 gap-1.5 text-xs">
            <RefreshCw className="h-3.5 w-3.5" /> Try Again
          </Button>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-12 text-center">
          <Sparkles className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <h3 className="font-semibold text-foreground">No AI Interview Results Found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            {results.length === 0
              ? "No candidates have been invited to automated AI interviews yet. Click 'Invite Candidate' to get started."
              : "No candidates match the selected filters."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredResults.map((result) => {
            const isCompleted = result.status === "COMPLETED";
            const canDecide = isCompleted && Boolean(result.id) && !result.human_decision;
            const scoreDisplay =
              typeof result.match_score === "number"
                ? `${Math.round(result.match_score)}%`
                : null;

            return (
              <div
                key={result.id || result.application_id}
                className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-4 transition-all hover:border-border/80"
              >
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-foreground text-sm">{result.candidate_name}</h4>
                      <Badge
                        variant={
                          result.status === "COMPLETED"
                            ? "default"
                            : result.status === "IN_PROGRESS"
                            ? "secondary"
                            : result.status === "FAILED"
                            ? "destructive"
                            : "outline"
                        }
                        className="text-[10px]"
                      >
                        {result.status}
                      </Badge>
                      {scoreDisplay && (
                        <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          Match: {scoreDisplay}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {result.job_title || "General Application"}
                    </p>
                  </div>

                  {/* Informational Integrity Signals */}
                  {result.integrity_signals && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                      <Badge variant="outline" className="text-muted-foreground font-normal gap-1">
                        <Info className="h-3 w-3" />
                        {result.integrity_signals.tab_switches ?? 0} tab switches
                      </Badge>
                      {result.integrity_signals.flags?.map((flag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-[10px] text-amber-500">
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Signals / Insights */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  {/* Strengths */}
                  <div className="rounded-lg bg-emerald-500/5 p-3 border border-emerald-500/20">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1.5">
                      Strengths
                    </span>
                    {result.strengths?.length ? (
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {result.strengths.map((s, idx) => (
                          <li key={idx} className="line-clamp-2">
                            {s}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground italic">None noted</span>
                    )}
                  </div>

                  {/* Weaknesses */}
                  <div className="rounded-lg bg-amber-500/5 p-3 border border-amber-500/20">
                    <span className="font-semibold text-amber-600 dark:text-amber-400 block mb-1.5">
                      Weaknesses
                    </span>
                    {result.weaknesses?.length ? (
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {result.weaknesses.map((w, idx) => (
                          <li key={idx} className="line-clamp-2">
                            {w}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground italic">None noted</span>
                    )}
                  </div>

                  {/* Red flags */}
                  <div className="rounded-lg bg-rose-500/5 p-3 border border-rose-500/20">
                    <span className="font-semibold text-rose-600 dark:text-rose-400 block mb-1.5">
                      Red Flags
                    </span>
                    {result.red_flags?.length ? (
                      <ul className="list-disc list-inside space-y-1 text-rose-700 dark:text-rose-300">
                        {result.red_flags.map((rf, idx) => (
                          <li key={idx} className="line-clamp-2">
                            {rf}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-muted-foreground italic">Clean (0 flags)</span>
                    )}
                  </div>
                </div>

                {/* Action footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                  <div>
                    {result.transcript && result.transcript.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setActiveTranscript({
                            candidateName: result.candidate_name,
                            transcript: result.transcript || [],
                          })
                        }
                        className="gap-1.5 text-xs text-muted-foreground hover:text-foreground h-8"
                      >
                        <FileText className="h-3.5 w-3.5" /> View Transcript ({result.transcript.length} Qs)
                      </Button>
                    )}
                  </div>

                  {/* Human Decision Area */}
                  <div className="flex items-center gap-2">
                    {result.human_decision ? (
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Badge
                          variant={result.human_decision === "SHORTLIST" ? "default" : "destructive"}
                          className="text-[10px]"
                        >
                          {result.human_decision}
                        </Badge>
                        <span>by {result.human_decision_by || "HR"}</span>
                        {result.human_decision_reason && (
                          <span className="italic max-w-xs truncate text-[11px]">
                            "{result.human_decision_reason}"
                          </span>
                        )}
                      </div>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={!canDecide}
                                onClick={() => openDecisionModal(result, "SHORTLIST")}
                                className="h-8 gap-1 text-xs text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                              >
                                <UserCheck className="h-3.5 w-3.5" /> Shortlist
                              </Button>
                            </div>
                          </TooltipTrigger>
                          {!canDecide && (
                            <TooltipContent>
                              <span>Interview not completed</span>
                            </TooltipContent>
                          )}
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Button
                                size="sm"
                                variant="outline"
                                disabled={!canDecide}
                                onClick={() => openDecisionModal(result, "REJECT")}
                                className="h-8 gap-1 text-xs text-rose-600 border-rose-500/30 hover:bg-rose-500/10"
                              >
                                <UserX className="h-3.5 w-3.5" /> Reject
                              </Button>
                            </div>
                          </TooltipTrigger>
                          {!canDecide && (
                            <TooltipContent>
                              <span>Interview not completed</span>
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Invite Candidate Modal */}
      <Dialog open={inviteModalOpen} onOpenChange={setInviteModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Candidate to AI Interview</DialogTitle>
            <DialogDescription>
              Select an applicant from your pipeline to generate and send an automated conversational interview session.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1">
                Candidate Application
              </label>
              <Select value={selectedApplicationId} onValueChange={setSelectedApplicationId}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select candidate application" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  {candidateOptions.map((opt) => (
                    <SelectItem key={opt.applicationId} value={opt.applicationId}>
                      {opt.candidateName} — {opt.jobTitle} ({opt.stage})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleInviteSubmit}
              disabled={!selectedApplicationId || inviting}
              className="gap-1.5"
            >
              {inviting ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              Send Invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transcript Modal */}
      <Dialog open={Boolean(activeTranscript)} onOpenChange={(o) => !o && setActiveTranscript(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Interview Transcript: {activeTranscript?.candidateName}</DialogTitle>
            <DialogDescription>Full question and candidate response record</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {activeTranscript?.transcript.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-border p-4 space-y-2 bg-muted/20">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Question {idx + 1}</span>
                  {item.category && <Badge variant="outline" className="text-[10px]">{item.category}</Badge>}
                </div>
                <p className="text-xs font-medium text-foreground">{item.question}</p>
                <div className="rounded bg-background p-3 border border-border/60 text-xs text-foreground/90 whitespace-pre-wrap">
                  {item.answer || <span className="italic text-muted-foreground">No answer provided</span>}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setActiveTranscript(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Human Decision Confirmation Dialog */}
      <Dialog
        open={decisionModal.open}
        onOpenChange={(o) => !o && setDecisionModal({ open: false, result: null, action: null })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Confirm Decision: {decisionModal.action === "SHORTLIST" ? "Shortlist Candidate" : "Reject Candidate"}
            </DialogTitle>
            <DialogDescription>
              Candidate: <strong>{decisionModal.result?.candidate_name}</strong> for{" "}
              {decisionModal.result?.job_title}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            {decisionModal.action === "REJECT" && (
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">
                  Reason for rejection <span className="text-destructive">*</span> (minimum 10 characters)
                </label>
                <Textarea
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder="Explain why the candidate does not meet the requirements..."
                  rows={3}
                  className="text-xs"
                />
                <span className="text-[10px] text-muted-foreground mt-1 block">
                  {decisionReason.trim().length} / 10 characters
                </span>
              </div>
            )}

            {decisionModal.action === "SHORTLIST" && (
              <div>
                <label className="font-semibold text-muted-foreground block mb-1">
                  Optional hiring notes
                </label>
                <Textarea
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder="Notes for hiring manager or next round..."
                  rows={2}
                  className="text-xs"
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDecisionModal({ open: false, result: null, action: null })}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant={decisionModal.action === "SHORTLIST" ? "default" : "destructive"}
              onClick={handleDecisionSubmit}
              disabled={
                submittingDecision ||
                (decisionModal.action === "REJECT" && decisionReason.trim().length < 10)
              }
            >
              {submittingDecision ? "Submitting..." : `Confirm ${decisionModal.action}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AIInterviewResultsTab;
