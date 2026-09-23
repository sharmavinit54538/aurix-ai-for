import { useState, useEffect, useMemo } from "react";
import {
  Video, Mic, Camera, Play, CheckCircle2, AlertTriangle,
  Sparkles, ShieldCheck, Clock, Award, ChevronRight, ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRecruitment } from "../hooks/useRecruitment";

interface InterviewQuestion {
  id: number;
  question: string;
  category: string;
  expectedKeypoints: string[];
  timeLimitSec: number;
}

export function AIInterviewSimulatorPage() {
  const { candidates, jobs } = useRecruitment();

  // Session state
  const [sessionState, setSessionState] = useState<"setup" | "in-progress" | "completed">("setup");
  const [interviewType, setInterviewType] = useState<"Technical" | "Behavioral">("Technical");
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  // Timer & response
  const [timeLeft, setTimeLeft] = useState(0);
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [answers, setAnswers] = useState<Record<number, string>>({});

  // Integrity Signals
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [multiplePersonsDetected, setMultiplePersonsDetected] = useState(false);
  const [integrityScore, setIntegrityScore] = useState(100);
  const [flaggedMoments, setFlaggedMoments] = useState<string[]>([]);

  // Human Review
  const [humanReviewerNotes, setHumanReviewerNotes] = useState("");
  const [humanOverrideRating, setHumanOverrideRating] = useState("");

  // User-managed question banks (stored in localStorage)
  const [questionBanks, setQuestionBanks] = useState<Record<string, InterviewQuestion[]>>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("aurix:ai_interview_questions");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === "object") return parsed;
        }
      } catch { /* ignore */ }
    }
    return { Technical: [], Behavioral: [] };
  });

  // New question form
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [newTimeLimit, setNewTimeLimit] = useState(90);

  // Auto-sync candidate selection
  useMemo(() => {
    if (
      (!selectedCandidateId || !candidates.some((c) => c.id === selectedCandidateId)) &&
      candidates.length > 0
    ) {
      setSelectedCandidateId(candidates[0].id);
    }
  }, [candidates, selectedCandidateId]);

  const candidate = candidates.find((c) => c.id === selectedCandidateId) || null;
  const questions = questionBanks[interviewType] || [];
  const currentQ = questions[currentQuestionIdx] || null;

  // Timer effect during active interview
  useEffect(() => {
    let timer: any;
    if (sessionState === "in-progress" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionState, timeLeft]);

  const saveQuestionBanks = (updated: Record<string, InterviewQuestion[]>) => {
    setQuestionBanks(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("aurix:ai_interview_questions", JSON.stringify(updated));
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) {
      toast.error("Please enter a question.");
      return;
    }
    const bank = [...(questionBanks[interviewType] || [])];
    bank.push({
      id: Date.now(),
      question: newQuestion.trim(),
      category: newCategory.trim() || interviewType,
      expectedKeypoints: [],
      timeLimitSec: newTimeLimit,
    });
    const updated = { ...questionBanks, [interviewType]: bank };
    saveQuestionBanks(updated);
    setNewQuestion("");
    setNewCategory("");
    setNewTimeLimit(90);
    setShowAddQuestion(false);
    toast.success("Question added to bank.");
  };

  const handleStartInterview = () => {
    if (!candidate) {
      toast.error("Please select a candidate first.");
      return;
    }
    if (questions.length === 0) {
      toast.error("Please add at least one question to the question bank first.");
      return;
    }
    setSessionState("in-progress");
    setCurrentQuestionIdx(0);
    setTimeLeft(questions[0].timeLimitSec);
    setCandidateAnswer("");
    setAnswers({});
    setTabSwitchCount(0);
    setMultiplePersonsDetected(false);
    setIntegrityScore(100);
    setFlaggedMoments([]);
    toast.success(`AI Interview session initialized for ${candidate.name}!`);
  };

  const handleNextQuestion = () => {
    // Save current answer
    const updatedAnswers = { ...answers, [currentQuestionIdx]: candidateAnswer };
    setAnswers(updatedAnswers);

    if (currentQuestionIdx < questions.length - 1) {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      setTimeLeft(questions[nextIdx].timeLimitSec);
      setCandidateAnswer(updatedAnswers[nextIdx] || "");
    } else {
      setSessionState("completed");
      toast.success("AI Interview session completed!");
    }
  };

  const triggerSimulatedTabSwitch = () => {
    setTabSwitchCount((p) => p + 1);
    setIntegrityScore((p) => Math.max(50, p - 8));
    const moment = `[${new Date().toLocaleTimeString()}] Tab switched: Browser lost focus`;
    setFlaggedMoments((prev) => [moment, ...prev]);
    toast.warning("Integrity Flag: Tab switch detected during session.");
  };

  const triggerSimulatedMultiplePersons = () => {
    setMultiplePersonsDetected(true);
    setIntegrityScore((p) => Math.max(40, p - 15));
    const moment = `[${new Date().toLocaleTimeString()}] Visual Anomaly: Second face detected in viewport`;
    setFlaggedMoments((prev) => [moment, ...prev]);
    toast.error("Integrity Flag: Multiple individuals detected on camera.");
  };

  const totalAnswered = Object.keys(answers).length + (sessionState === "completed" ? 0 : 0);

  return (
    <div className="space-y-6">

      {/* VIEW 1: INTERVIEW SETUP */}
      {sessionState === "setup" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2 font-display text-lg font-bold">
              <Sparkles className="h-5 w-5 text-indigo-500" />
              Configure AI Interview Session
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <Label className="text-xs">Candidate to Interview</Label>
                {candidates.length === 0 ? (
                  <div className="mt-1 p-2 rounded-lg border border-dashed border-border text-xs text-muted-foreground bg-muted/20">
                    No candidates available in pipeline
                  </div>
                ) : (
                  <Select value={selectedCandidateId} onValueChange={setSelectedCandidateId}>
                    <SelectTrigger className="mt-1 h-9 text-xs">
                      <SelectValue placeholder="Select a candidate" />
                    </SelectTrigger>
                    <SelectContent>
                      {candidates.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name || "Unnamed"}{c.appliedPosition ? ` — ${c.appliedPosition}` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div>
                <Label className="text-xs">Interview Type & Question Bank</Label>
                <Select value={interviewType} onValueChange={(v: any) => setInterviewType(v)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical & System Design</SelectItem>
                    <SelectItem value="Behavioral">Behavioral & Culture Alignment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Question bank summary */}
              <div className="p-3 bg-muted/40 rounded-xl space-y-2 border border-border/70">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">
                    Question Bank: {interviewType}
                  </span>
                  <Badge variant="outline" className="text-[10px]">
                    {questions.length} questions
                  </Badge>
                </div>
                {questions.length === 0 ? (
                  <p className="text-muted-foreground text-[11px]">
                    No questions added yet. Add questions to start an interview session.
                  </p>
                ) : (
                  <ul className="list-disc pl-4 space-y-1 text-muted-foreground text-[11px]">
                    {questions.map((q) => (
                      <li key={q.id} className="line-clamp-1">{q.question}</li>
                    ))}
                  </ul>
                )}

                {!showAddQuestion ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px] w-full mt-1"
                    onClick={() => setShowAddQuestion(true)}
                  >
                    + Add Question
                  </Button>
                ) : (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <Textarea
                      className="text-xs"
                      rows={2}
                      placeholder="Enter interview question..."
                      value={newQuestion}
                      onChange={(e) => setNewQuestion(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <input
                        className="flex-1 h-7 rounded-md border border-border bg-background px-2 text-xs"
                        placeholder="Category (optional)"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                      />
                      <input
                        className="w-20 h-7 rounded-md border border-border bg-background px-2 text-xs"
                        type="number"
                        placeholder="Secs"
                        value={newTimeLimit}
                        onChange={(e) => setNewTimeLimit(Number(e.target.value) || 90)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="h-7 text-[11px] flex-1" onClick={handleAddQuestion}>
                        Save Question
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-[11px]"
                        onClick={() => { setShowAddQuestion(false); setNewQuestion(""); }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <Button
                onClick={handleStartInterview}
                disabled={!candidate || questions.length === 0}
                className="w-full mt-3 bg-gradient-brand text-brand-foreground shadow-glow gap-2 disabled:opacity-50"
              >
                <Play className="h-4 w-4 fill-current" />
                Launch AI Interview Room
              </Button>
            </div>
          </div>

          {/* Candidate Snapshot */}
          <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4 flex flex-col justify-between">
            {candidate ? (
              <>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase text-muted-foreground tracking-wider font-semibold">Candidate Brief</span>
                    {candidate.appliedPosition && (
                      <Badge variant="secondary">{candidate.appliedPosition}</Badge>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mt-2">{candidate.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {[candidate.location, candidate.yearsExperience ? `${candidate.yearsExperience} yrs experience` : "", candidate.source ? `Source: ${candidate.source}` : ""]
                      .filter(Boolean)
                      .join(" • ")}
                  </p>

                  {candidate.summary && (
                    <div className="mt-4 p-3 rounded-lg border border-border bg-background/50 text-xs text-foreground leading-relaxed">
                      {candidate.summary}
                    </div>
                  )}

                  {candidate.skills.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {candidate.skills.map((s) => (
                        <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="text-xs text-muted-foreground border-t border-border pt-3">
                  Results available immediately upon completion.
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <Video className="h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-sm font-medium text-muted-foreground">Select a candidate</p>
                <p className="text-xs text-muted-foreground/60 mt-1">Choose a candidate from the left panel to view their brief.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: IN-PROGRESS INTERVIEW SESSION */}
      {sessionState === "in-progress" && candidate && currentQ && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Simulated Video & Transcript View */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative aspect-video rounded-2xl border border-border bg-zinc-950 overflow-hidden flex flex-col justify-between p-4 shadow-xl">
              {/* Top Video Overlay */}
              <div className="flex items-center justify-between z-10">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>AI Interviewer Active</span>
                </div>

                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-mono">
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  <span>{timeLeft}s remaining</span>
                </div>
              </div>

              {/* Center Simulated Video Avatar */}
              <div className="flex flex-col items-center justify-center my-auto z-10 text-center">
                <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-brand text-white shadow-glow mb-3">
                  <span className="text-2xl font-bold">
                    {candidate.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <div className="text-white font-semibold text-sm">{candidate.name}</div>
                {candidate.appliedPosition && (
                  <div className="text-zinc-400 text-xs">{candidate.appliedPosition}</div>
                )}
              </div>

              {/* Bottom Video Controls */}
              <div className="flex items-center justify-between z-10 pt-2 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
                    <Camera className="h-4 w-4" />
                  </button>
                  <button className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20">
                    <Mic className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-[11px] text-zinc-300 bg-black/40 px-2.5 py-1 rounded">
                  Question {currentQuestionIdx + 1} of {questions.length}
                </div>
              </div>
            </div>

            {/* Current Question & Answer */}
            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{currentQ.category}</Badge>
                <span className="text-xs text-muted-foreground">Response Area</span>
              </div>

              <h3 className="font-semibold text-base text-foreground leading-snug">
                "{currentQ.question}"
              </h3>

              <div>
                <Label className="text-xs text-muted-foreground">Candidate Response</Label>
                <Textarea
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  className="mt-1 text-xs font-mono"
                  rows={3}
                  placeholder="Enter or record candidate's response..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={handleNextQuestion}
                  className="bg-gradient-brand text-brand-foreground shadow-glow gap-1.5 text-xs"
                >
                  {currentQuestionIdx < questions.length - 1 ? "Submit & Next Question" : "Complete & Generate Report"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Integrity Signals */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Integrity & Fraud Signals
                </h4>
                <span className="text-xs font-bold text-foreground">
                  Score: <span className={integrityScore > 80 ? "text-emerald-500" : "text-amber-500"}>{integrityScore}%</span>
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center p-2 rounded-lg bg-muted/40">
                  <span>Tab-Switching Events:</span>
                  <span className={`font-semibold ${tabSwitchCount > 0 ? "text-rose-500" : "text-foreground"}`}>
                    {tabSwitchCount} detected
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-muted/40">
                  <span>Multiple Persons Signal:</span>
                  <span className={`font-semibold ${multiplePersonsDetected ? "text-rose-500" : "text-emerald-500"}`}>
                    {multiplePersonsDetected ? "Flagged" : "Normal"}
                  </span>
                </div>
              </div>

              {/* Simulation triggers */}
              <div className="pt-2 border-t border-border space-y-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Test Integrity Signals:</span>
                <div className="flex flex-col gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px] justify-start text-amber-600 border-amber-500/30"
                    onClick={triggerSimulatedTabSwitch}
                  >
                    Simulate Tab Switch Event
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[11px] justify-start text-rose-600 border-rose-500/30"
                    onClick={triggerSimulatedMultiplePersons}
                  >
                    Simulate Multiple Person Detected
                  </Button>
                </div>
              </div>

              {flaggedMoments.length > 0 && (
                <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-700 dark:text-rose-300 space-y-1">
                  <div className="font-semibold flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Flagged Incidents:
                  </div>
                  {flaggedMoments.map((m, i) => (
                    <div key={i} className="font-mono text-[10px]">• {m}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: COMPLETED EVALUATION REPORT & HUMAN REVIEW */}
      {sessionState === "completed" && candidate && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500 text-white">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">Interview Completed: {candidate.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {questions.length} questions answered • Integrity Score: {integrityScore}%
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSessionState("setup");
                setHumanReviewerNotes("");
                setHumanOverrideRating("");
              }}
              className="text-xs"
            >
              Start Another Interview
            </Button>
          </div>

          {/* Metric Breakdown Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="text-xs text-muted-foreground">Questions Answered</div>
              <div className="mt-2 font-display text-2xl font-bold text-foreground">
                {Object.keys(answers).length} / {questions.length}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">All questions completed</div>
            </div>

            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="text-xs text-muted-foreground">Integrity & Proctoring</div>
              <div className={`mt-2 font-display text-2xl font-bold ${integrityScore > 80 ? "text-emerald-500" : "text-amber-500"}`}>
                {integrityScore}%
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {integrityScore > 80 ? "High Trust" : "Review Required"} • {tabSwitchCount} tab switches
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="text-xs text-muted-foreground">Flagged Incidents</div>
              <div className={`mt-2 font-display text-2xl font-bold ${flaggedMoments.length === 0 ? "text-emerald-500" : "text-rose-500"}`}>
                {flaggedMoments.length}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {flaggedMoments.length === 0 ? "Clean session" : "Requires manual review"}
              </div>
            </div>
          </div>

          {/* Candidate Responses Summary */}
          {Object.keys(answers).length > 0 && (
            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3">
              <h4 className="font-semibold text-sm text-foreground">Candidate Responses</h4>
              <div className="space-y-2">
                {questions.map((q, idx) => (
                  <div key={q.id} className="p-3 rounded-xl border border-border bg-card/40 text-xs">
                    <div className="font-semibold text-foreground mb-1">
                      Q{idx + 1}: {q.question}
                    </div>
                    <div className="text-muted-foreground whitespace-pre-line">
                      {answers[idx] || "No response recorded"}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Human Review & Decision Override Form */}
          <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Award className="h-4 w-4 text-indigo-500" />
              Human Reviewer Sign-off
            </h4>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-xs">
              <div>
                <Label className="text-xs">Reviewer Recommendation</Label>
                <Select value={humanOverrideRating} onValueChange={setHumanOverrideRating}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue placeholder="Select a decision" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Strong Hire">Strong Hire (Advance to Offer)</SelectItem>
                    <SelectItem value="Hire">Hire (Standard)</SelectItem>
                    <SelectItem value="Hold">Hold / Review Next Round</SelectItem>
                    <SelectItem value="Reject">Reject</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Next Hiring Action</Label>
                <div className="mt-1 flex items-center gap-2">
                  <Button
                    size="sm"
                    disabled={!humanOverrideRating}
                    className="h-9 text-xs bg-gradient-brand text-brand-foreground shadow-glow gap-1.5 disabled:opacity-50"
                    onClick={() => {
                      if (candidate) {
                        toast.success(`Decision "${humanOverrideRating}" recorded for ${candidate.name}!`);
                      }
                    }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Submit Decision
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs">Interviewer Notes & Commentary</Label>
              <Textarea
                className="mt-1 text-xs"
                rows={3}
                placeholder="Add your observations, notes, and recommendations..."
                value={humanReviewerNotes}
                onChange={(e) => setHumanReviewerNotes(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
