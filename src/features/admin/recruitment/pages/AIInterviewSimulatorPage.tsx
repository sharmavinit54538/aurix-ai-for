import { useState, useEffect } from "react";
import {
  Video, Mic, MicOff, Camera, Play, CheckCircle2, AlertTriangle,
  Sparkles, ShieldCheck, Clock, Award, Users, RefreshCw,
  ChevronRight, Volume2, ShieldAlert, Eye, MessageSquare, Star
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  category: "Technical Architecture" | "Problem Solving" | "System Design" | "Behavioral";
  expectedKeypoints: string[];
  suggestedAnswer: string;
  timeLimitSec: number;
}

const SAMPLE_QUESTIONS: Record<string, InterviewQuestion[]> = {
  Technical: [
    {
      id: 1,
      question: "Explain how you optimize large-scale React applications to prevent unnecessary component re-renders.",
      category: "Technical Architecture",
      expectedKeypoints: ["React.memo", "useMemo & useCallback", "State colocation", "Virtualization"],
      suggestedAnswer: "Candidate highlighted state colocation, virtualization with TanStack Virtual, and memoized selectors.",
      timeLimitSec: 90,
    },
    {
      id: 2,
      question: "How would you design a fault-tolerant asynchronous event-processing pipeline with guaranteed at-least-once delivery?",
      category: "System Design",
      expectedKeypoints: ["Idempotency keys", "Dead letter queues", "Message acknowledgements", "Partitioning"],
      suggestedAnswer: "Walked through Kafka partitioned topics with Redis deduplication keys and transactional outbox pattern.",
      timeLimitSec: 120,
    },
    {
      id: 3,
      question: "Describe a production incident where database queries degraded API response times and how you diagnosed and resolved it.",
      category: "Problem Solving",
      expectedKeypoints: ["Query EXPLAIN plans", "Index tuning", "Connection pooling", "Replica reads"],
      suggestedAnswer: "Explained N+1 query issue identified via Datadog APM and fixed by adding composite B-tree index.",
      timeLimitSec: 90,
    },
  ],
  Behavioral: [
    {
      id: 1,
      question: "Tell me about a time you had a significant technical disagreement with a colleague. How did you resolve it?",
      category: "Behavioral",
      expectedKeypoints: ["Active listening", "Objective benchmarking", "Consensus building", "Blameless post-mortem"],
      suggestedAnswer: "Constructed benchmark POC to evaluate both GraphQL and REST approaches objectively.",
      timeLimitSec: 90,
    },
    {
      id: 2,
      question: "How do you manage tight product deadlines when dealing with unexpected technical debt?",
      category: "Behavioral",
      expectedKeypoints: ["Scope prioritization", "Stakeholder communication", "Pragmatic tradeoffs"],
      suggestedAnswer: "Transparently renegotiated non-critical scope while preserving security and core UX.",
      timeLimitSec: 90,
    },
  ],
};

export function AIInterviewSimulatorPage() {
  const { candidates, jobs } = useRecruitment();

  // Mode: setup | in-progress | completed
  const [sessionState, setSessionState] = useState<"setup" | "in-progress" | "completed">("setup");
  const [interviewType, setInterviewType] = useState<"Technical" | "Behavioral">("Technical");
  const [selectedCandidateId, setSelectedCandidateId] = useState(candidates[0]?.id || "cand-201");
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);

  // Simulation timer & response
  const [timeLeft, setTimeLeft] = useState(90);
  const [candidateAnswer, setCandidateAnswer] = useState("");
  const [isRecording, setIsRecording] = useState(true);

  // Simulated Integrity Signals
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [multiplePersonsDetected, setMultiplePersonsDetected] = useState(false);
  const [integrityScore, setIntegrityScore] = useState(96);
  const [flaggedMoments, setFlaggedMoments] = useState<string[]>([]);

  // Human Review notes
  const [humanReviewerNotes, setHumanReviewerNotes] = useState(
    "Candidate showed exemplary command over modern distributed systems. Recommend advancing to final round with VP Engineering."
  );
  const [humanOverrideRating, setHumanOverrideRating] = useState("Strong Hire");

  const candidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];
  const questions = SAMPLE_QUESTIONS[interviewType] || SAMPLE_QUESTIONS.Technical;
  const currentQ = questions[currentQuestionIdx];

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

  const handleStartInterview = () => {
    setSessionState("in-progress");
    setCurrentQuestionIdx(0);
    setTimeLeft(questions[0].timeLimitSec);
    setCandidateAnswer(questions[0].suggestedAnswer);
    setTabSwitchCount(0);
    setMultiplePersonsDetected(false);
    setIntegrityScore(96);
    setFlaggedMoments([]);
    toast.success(`AI Interview session initialized for ${candidate.name}!`);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIdx < questions.length - 1) {
      const nextIdx = currentQuestionIdx + 1;
      setCurrentQuestionIdx(nextIdx);
      setTimeLeft(questions[nextIdx].timeLimitSec);
      setCandidateAnswer(questions[nextIdx].suggestedAnswer);
    } else {
      setSessionState("completed");
      toast.success("AI Interview session completed! Evaluated scorecards generated.");
    }
  };

  const triggerSimulatedTabSwitch = () => {
    setTabSwitchCount((p) => p + 1);
    setIntegrityScore((p) => Math.max(50, p - 8));
    const moment = `[${new Date().toLocaleTimeString()}] Tab switched: Browser lost focus for 4.2 seconds`;
    setFlaggedMoments((prev) => [moment, ...prev]);
    toast.warning("Simulated Fraud Flag: Tab switch detected during answer recording.");
  };

  const triggerSimulatedMultiplePersons = () => {
    setMultiplePersonsDetected(true);
    setIntegrityScore((p) => Math.max(40, p - 15));
    const moment = `[${new Date().toLocaleTimeString()}] Visual Anomaly: Second face detected in camera viewport`;
    setFlaggedMoments((prev) => [moment, ...prev]);
    toast.error("Simulated Fraud Flag: Multiple individuals detected on camera.");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Interview Session & Integrity Intelligence"
        description="Conduct automated AI-evaluated video interviews with simulated candidate responses, real-time fraud monitoring, and automated scorecards."
      />

      {/* Demo Warning Banner */}
      <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 p-3 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          <span>
            <strong className="font-semibold">Simulated Demo Interface:</strong> Audio, video streams, Speech-to-Text transcriptions, and fraud signals are rendered dynamically via local state.
          </span>
        </div>
        <Badge variant="outline" className="text-[10px] uppercase border-indigo-500/40 text-indigo-500">
          Demo Sandbox
        </Badge>
      </div>

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
                <Select value={selectedCandidateId} onValueChange={setSelectedCandidateId}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {candidates.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} — {c.appliedPosition}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Interview Type & Question Bank</Label>
                <Select value={interviewType} onValueChange={(v: any) => setInterviewType(v)}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technical">Technical & System Design (3 Questions)</SelectItem>
                    <SelectItem value="Behavioral">Behavioral & Culture Alignment (2 Questions)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-3 bg-muted/40 rounded-xl space-y-2 border border-border/70">
                <span className="font-semibold text-foreground">AI Evaluation Criteria:</span>
                <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                  <li>Communication Clarity & Articulation (0-100)</li>
                  <li>Technical Depth & Architectural Reasoning (0-100)</li>
                  <li>Behavioral Alignment & Collaboration (0-100)</li>
                  <li>Real-time Fraud & Proctored Integrity Monitoring</li>
                </ul>
              </div>

              <Button
                onClick={handleStartInterview}
                className="w-full mt-3 bg-gradient-brand text-brand-foreground shadow-glow gap-2"
              >
                <Play className="h-4 w-4 fill-current" />
                Launch AI Interview Room
              </Button>
            </div>
          </div>

          {/* Candidate Snapshot */}
          <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase text-muted-foreground tracking-wider font-semibold">Candidate Brief</span>
                <Badge variant="secondary">{candidate.appliedPosition}</Badge>
              </div>
              <h3 className="text-xl font-bold mt-2">{candidate.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {candidate.location} • {candidate.yearsExperience} yrs experience • Source: {candidate.source}
              </p>

              <div className="mt-4 p-3 rounded-lg border border-border bg-background/50 text-xs text-foreground leading-relaxed">
                {candidate.summary}
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {candidate.skills.map((s) => (
                  <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                ))}
              </div>
            </div>

            <div className="text-xs text-muted-foreground border-t border-border pt-3">
              Session duration approximately 10-15 minutes. Results available immediately upon completion.
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: IN-PROGRESS INTERVIEW SESSION */}
      {sessionState === "in-progress" && (
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
                    {candidate.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div className="text-white font-semibold text-sm">{candidate.name}</div>
                <div className="text-zinc-400 text-xs">{candidate.appliedPosition}</div>
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

            {/* Current Question & Simulated Speech-to-Text Answer */}
            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline">{currentQ.category}</Badge>
                <span className="text-xs text-muted-foreground">AI Speech-to-Text Live Transcript</span>
              </div>

              <h3 className="font-semibold text-base text-foreground leading-snug">
                "{currentQ.question}"
              </h3>

              <div>
                <Label className="text-xs text-muted-foreground">Candidate Live Response (Simulated)</Label>
                <Textarea
                  value={candidateAnswer}
                  onChange={(e) => setCandidateAnswer(e.target.value)}
                  className="mt-1 text-xs font-mono"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  onClick={handleNextQuestion}
                  className="bg-gradient-brand text-brand-foreground shadow-glow gap-1.5 text-xs"
                >
                  {currentQuestionIdx < questions.length - 1 ? "Submit & Next Question" : "Complete & Generate AI Report"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Simulated Fraud & Proctored Integrity Signals */}
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
                  <span>Identity Verification:</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-500/10 border-emerald-500/20">
                    Verified (99% Facial Match)
                  </Badge>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-muted/40">
                  <span>Tab-Switching Events:</span>
                  <span className={`font-semibold ${tabSwitchCount > 0 ? "text-rose-500" : "text-foreground"}`}>
                    {tabSwitchCount} detected
                  </span>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg bg-muted/40">
                  <span>Multiple Persons Signal:</span>
                  <span className={`font-semibold ${multiplePersonsDetected ? "text-rose-500" : "text-emerald-500"}`}>
                    {multiplePersonsDetected ? "Flagged" : "Single Person (Normal)"}
                  </span>
                </div>
              </div>

              {/* Simulation triggers to demonstrate fraud flags */}
              <div className="pt-2 border-t border-border space-y-2">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Test Fraud Signals (Demo Trigger):</span>
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
                    Flagged Incidents Timeline:
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
      {sessionState === "completed" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-500 text-white">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-foreground">AI Assessment Summary: {candidate.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Session evaluated by OFC360 People AI Agent • Recommended Decision: <strong className="text-emerald-600 dark:text-emerald-400">STRONG HIRE (91/100)</strong>
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSessionState("setup")}
              className="text-xs"
            >
              Start Another Interview
            </Button>
          </div>

          {/* Metric Breakdown Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="text-xs text-muted-foreground">Communication Clarity</div>
              <div className="mt-2 font-display text-2xl font-bold text-foreground">94/100</div>
              <div className="mt-1 text-[11px] text-muted-foreground">Clear diction, structured reasoning</div>
            </div>

            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="text-xs text-muted-foreground">Technical Competence</div>
              <div className="mt-2 font-display text-2xl font-bold text-indigo-500">92/100</div>
              <div className="mt-1 text-[11px] text-muted-foreground">Comprehensive system architecture knowledge</div>
            </div>

            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="text-xs text-muted-foreground">Behavioral Fit</div>
              <div className="mt-2 font-display text-2xl font-bold text-foreground">88/100</div>
              <div className="mt-1 text-[11px] text-muted-foreground">Blameless mindset & pragmatic tradeoffs</div>
            </div>

            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
              <div className="text-xs text-muted-foreground">Integrity & Proctoring</div>
              <div className="mt-2 font-display text-2xl font-bold text-emerald-500">{integrityScore}%</div>
              <div className="mt-1 text-[11px] text-muted-foreground">
                {integrityScore > 80 ? "High Trust Verified" : "Review Required"}
              </div>
            </div>
          </div>

          {/* Detailed Strengths & Concerns */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-2">
              <h4 className="font-semibold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" />
                Key Demonstrated Strengths
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Articulated transactional outbox pattern and Kafka partition keys with extreme precision.</li>
                <li>Proactively discussed testing strategies, load benchmarking, and SLA telemetry.</li>
                <li>Calm, structured communication demeanor under time-constrained problem solving.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-2">
              <h4 className="font-semibold text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4" />
                Areas to Probe Further
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4 leading-relaxed">
                <li>Limited hands-on discussion regarding multi-region cross-cloud disaster recovery.</li>
                <li>Verify notice period constraints during final offer structuring.</li>
              </ul>
            </div>
          </div>

          {/* Human Review & Decision Override Form */}
          <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Award className="h-4 w-4 text-indigo-500" />
              Human Reviewer Final Sign-off
            </h4>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 text-xs">
              <div>
                <Label className="text-xs">Reviewer Recommendation Decision</Label>
                <Select value={humanOverrideRating} onValueChange={setHumanOverrideRating}>
                  <SelectTrigger className="mt-1 h-9 text-xs">
                    <SelectValue />
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
                    className="h-9 text-xs bg-gradient-brand text-brand-foreground shadow-glow gap-1.5"
                    onClick={() => {
                      toast.success(`Candidate ${candidate.name} approved for Offer Stage!`);
                    }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Approve for Offer Generation
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs">Human Interviewer Notes & Commentary</Label>
              <Textarea
                className="mt-1 text-xs"
                rows={3}
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
