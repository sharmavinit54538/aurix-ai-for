import { useEffect, useState, useCallback } from "react";
import { useParams } from "@tanstack/react-router";
import {
  Sparkles,
  Clock,
  Building2,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Send,
  HelpCircle,
  Check,
  ShieldCheck,
  ChevronRight,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  aiInterviewBotApi,
  type BotPublicSession,
  type BotQuestion,
} from "@/services/aiInterviewBotApi";
import { toast } from "sonner";

export function CandidateAIInterviewPage() {
  const params = useParams({ strict: false }) as { token?: string };
  const token = params.token || "";

  // Feature Flag: VITE_AI_INTERVIEW_ENABLED (defaults to enabled unless set to 'false')
  const isFeatureEnabled =
    typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env.VITE_AI_INTERVIEW_ENABLED !== "false"
      : true;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<BotPublicSession | null>(null);

  // Consent Screen State
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [starting, setStarting] = useState(false);

  // In-Interview State
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [submittingAnswer, setSubmittingAnswer] = useState(false);
  const [finishing, setFinishing] = useState(false);

  // Request Human Modal State
  const [humanModalOpen, setHumanModalOpen] = useState(false);
  const [humanReason, setHumanReason] = useState("");
  const [submittingHumanReq, setSubmittingHumanReq] = useState(false);

  const loadSession = useCallback(async () => {
    if (!token) {
      setError("Interview token is missing.");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await aiInterviewBotApi.getPublicSession(token);
      setSession(data);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to load interview session. The link may be invalid or expired.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const handleStart = async () => {
    if (!token || !consentAgreed) return;
    setStarting(true);
    try {
      const updated = await aiInterviewBotApi.startInterview(token);
      setSession(updated);
      toast.success("Interview session started. Good luck!");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not start session. Please try again.";
      toast.error(msg);
    } finally {
      setStarting(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!token || !session?.current_question || !currentAnswer.trim()) return;
    setSubmittingAnswer(true);
    try {
      const updated = await aiInterviewBotApi.submitAnswer(token, {
        question_id: session.current_question.id,
        answer_text: currentAnswer.trim(),
      });
      setCurrentAnswer("");
      setSession(updated);

      // If next question is null or status is completed, finish the interview
      if (!updated.current_question || updated.status === "COMPLETED") {
        await handleFinish();
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to submit answer. Please try again.";
      toast.error(msg);
    } finally {
      setSubmittingAnswer(false);
    }
  };

  const handleFinish = async () => {
    if (!token) return;
    setFinishing(true);
    try {
      await aiInterviewBotApi.finishInterview(token);
      setSession((prev) => (prev ? { ...prev, status: "COMPLETED", current_question: null } : null));
      toast.success("Interview completed! Thank you.");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Failed to finalize interview.";
      toast.error(msg);
    } finally {
      setFinishing(false);
    }
  };

  const handleRequestHuman = async () => {
    if (!token) return;
    setSubmittingHumanReq(true);
    try {
      await aiInterviewBotApi.requestHumanInterviewer(token, humanReason.trim());
      setHumanModalOpen(false);
      toast.success("Your request for a human interviewer has been submitted. The hiring team will be in touch.");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not send human interview request.";
      toast.error(msg);
    } finally {
      setSubmittingHumanReq(false);
    }
  };

  // Header Bar (minimal public layout)
  const headerBar = (
    <header className="border-b border-border bg-card/60 backdrop-blur-md px-6 py-4">
      <div className="mx-auto flex max-w-3xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-none text-foreground">
              {session?.company_name || "OFC360"} AI Interview
            </h1>
            <p className="text-xs text-muted-foreground mt-1">Text-based conversational assessment</p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          Confidential
        </Badge>
      </div>
    </header>
  );

  // If feature flag is off
  if (!isFeatureEnabled) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {headerBar}
        <main className="mx-auto w-full max-w-md flex-1 px-4 py-20">
          <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
            <Info className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h2 className="text-lg font-semibold">AI Interview Service Unavailable</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Automated AI interviews are currently disabled for this tenant. Please contact your hiring coordinator.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {headerBar}
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 space-y-6">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-24 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </main>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {headerBar}
        <main className="mx-auto w-full max-w-md flex-1 px-4 py-20">
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center shadow-sm">
            <AlertCircle className="h-10 w-10 text-destructive mx-auto mb-3" />
            <h2 className="text-lg font-semibold text-foreground">Interview Unavailable</h2>
            <p className="mt-2 text-sm text-muted-foreground">{error || "Could not find session."}</p>
            <div className="mt-6">
              <Button onClick={loadSession} variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" /> Try Again
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // State: COMPLETED (Thank You Screen — NEVER display scores)
  if (session.status === "COMPLETED") {
    const candidateFirstName = session.first_name || session.candidate_name?.split(" ")[0] || "Candidate";
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {headerBar}
        <main className="mx-auto w-full max-w-xl flex-1 px-4 py-16">
          <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm space-y-6">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Thank you, {candidateFirstName}!
              </h2>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Your AI interview responses for the <strong>{session.job_title}</strong> role have been securely submitted to the hiring team at {session.company_name || "OFC360"}.
              </p>
            </div>

            <div className="rounded-lg bg-muted/40 p-4 border border-border/50 text-left text-xs text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground text-sm">What happens next?</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Your answers will be reviewed by the talent acquisition and engineering leads.</li>
                <li>You will receive an update regarding next steps within 2–3 business days.</li>
                <li>You can safely close this browser window at any time.</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // State: NOT STARTED (Consent Screen)
  if (session.status === "NOT_STARTED") {
    const candidateFirstName = session.first_name || session.candidate_name?.split(" ")[0] || "there";
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {headerBar}
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 space-y-6">
          <div className="rounded-xl border border-border bg-card p-8 shadow-sm space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                Written Evaluation
              </Badge>
              <h2 className="text-2xl font-bold text-foreground">
                Welcome, {candidateFirstName}!
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                You are invited to complete an interactive text-based technical assessment for the{" "}
                <span className="font-semibold text-foreground">{session.job_title}</span> position at{" "}
                <span className="font-semibold text-foreground">{session.company_name || "OFC360"}</span>.
              </p>
            </div>

            {/* Assessment Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-border bg-muted/20 p-3.5 flex items-center gap-3">
                <Clock className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <span className="text-muted-foreground block">Estimated Duration</span>
                  <span className="font-semibold text-foreground text-sm">
                    {session.estimated_duration_minutes || 20} Minutes
                  </span>
                </div>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-3.5 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                <div>
                  <span className="text-muted-foreground block">Format</span>
                  <span className="font-semibold text-foreground text-sm">
                    Text-only (No Camera / No Mic)
                  </span>
                </div>
              </div>
            </div>

            {/* Clear privacy & procedure explanation */}
            <div className="rounded-lg border border-border bg-card p-4 space-y-2 text-xs text-muted-foreground">
              <h4 className="font-semibold text-foreground text-sm flex items-center gap-1.5">
                <Info className="h-4 w-4 text-primary" /> How it works
              </h4>
              <p>
                1. You will be presented with questions tailored to the position one by one.
              </p>
              <p>
                2. Take your time to write structured, thoughtful explanations in your own words.
              </p>
              <p>
                3. Your responses are saved automatically as you progress. If your browser closes, you can resume where you left off.
              </p>
            </div>

            {/* Consent Agreement */}
            <div className="rounded-lg border border-border/80 bg-muted/30 p-4 space-y-3">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-foreground">
                <input
                  type="checkbox"
                  checked={consentAgreed}
                  onChange={(e) => setConsentAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <span>
                  {session.consent_text ||
                    "I agree to participate in this automated AI-assisted evaluation. I understand my responses will be processed to assess role qualifications and reviewed by the recruitment team."}
                </span>
              </label>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <button
                type="button"
                onClick={() => setHumanModalOpen(true)}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
              >
                Prefer a human interviewer? Request human
              </button>

              <Button
                onClick={handleStart}
                disabled={!consentAgreed || starting}
                className="w-full sm:w-auto min-w-[160px] gap-2"
              >
                {starting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Starting...
                  </>
                ) : (
                  <>
                    Begin Interview <ChevronRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </main>

        {/* Human Interview Request Modal */}
        <Dialog open={humanModalOpen} onOpenChange={setHumanModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Request a Human Interviewer</DialogTitle>
              <DialogDescription>
                If you require reasonable accommodations or prefer a live conversational interview with a hiring team member, let us know.
              </DialogDescription>
            </DialogHeader>
            <div className="py-2">
              <label className="text-xs text-muted-foreground block mb-2">
                Reason or accommodation request (optional)
              </label>
              <Textarea
                value={humanReason}
                onChange={(e) => setHumanReason(e.target.value)}
                placeholder="E.g., I require accommodation for text accessibility..."
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setHumanModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRequestHuman} disabled={submittingHumanReq}>
                {submittingHumanReq ? "Sending..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // State: IN PROGRESS (Question-by-Question UI)
  const currentQ = session.current_question;
  const questionNumber = currentQ?.question_number || (session.answered_count || 0) + 1;
  const totalQuestions = currentQ?.total_questions || session.total_questions || 5;
  const progressPercent = Math.min(100, Math.round(((questionNumber - 1) / totalQuestions) * 100));

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {headerBar}
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 space-y-6">
        {/* Progress header */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              Question <strong className="text-foreground">{questionNumber}</strong> of{" "}
              <strong className="text-foreground">{totalQuestions}</strong>
            </span>
            <span>{progressPercent}% Completed</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Active Question Box */}
        {currentQ ? (
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-6">
            <div className="space-y-2 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {currentQ.category || "General"}
                </Badge>
                {currentQ.time_limit_seconds && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Recommended ~{Math.round(currentQ.time_limit_seconds / 60)}m
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold text-foreground leading-relaxed pt-1">
                {currentQ.question_text}
              </h3>
            </div>

            {/* Answer Input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-muted-foreground flex items-center justify-between">
                <span>Your Answer</span>
                <span>{currentAnswer.length} characters</span>
              </label>
              <Textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder="Type your detailed response here..."
                rows={8}
                className="resize-y text-sm font-sans focus-visible:ring-primary"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setHumanModalOpen(true)}
                className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                Request human interviewer
              </button>

              <div className="flex items-center gap-2">
                <Button
                  onClick={handleAnswerSubmit}
                  disabled={!currentAnswer.trim() || submittingAnswer}
                  className="gap-2 min-w-[140px]"
                >
                  {submittingAnswer ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : questionNumber >= totalQuestions ? (
                    <>
                      Finish Assessment <Check className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Next Question <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm space-y-4">
            <h3 className="text-lg font-semibold">Ready to submit?</h3>
            <p className="text-sm text-muted-foreground">
              You have answered all available questions. Click below to finalize your assessment.
            </p>
            <Button onClick={handleFinish} disabled={finishing} className="gap-2">
              {finishing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Finalize Interview
            </Button>
          </div>
        )}
      </main>

      {/* Human Interview Request Modal */}
      <Dialog open={humanModalOpen} onOpenChange={setHumanModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a Human Interviewer</DialogTitle>
            <DialogDescription>
              Submit an accommodation request or preference to speak with a human recruiter directly.
            </DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <Textarea
              value={humanReason}
              onChange={(e) => setHumanReason(e.target.value)}
              placeholder="State any notes or reasons..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setHumanModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRequestHuman} disabled={submittingHumanReq}>
              {submittingHumanReq ? "Sending..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CandidateAIInterviewPage;
