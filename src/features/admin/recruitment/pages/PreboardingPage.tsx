import { useState } from "react";
import {
  CalendarDays, CheckCircle2, Clock, FileCheck, Gift,
  HeartHandshake, Laptop, ShieldCheck, UserCheck, AlertCircle,
  Video, Mail, ChevronRight, Check
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useRecruitment } from "../hooks/useRecruitment";

interface PreboardingCandidate {
  id: string;
  name: string;
  role: string;
  joiningDate: string;
  daysToJoin: number;
  assignedBuddy: string;
  welcomePackStatus: "Dispatched" | "Delivered" | "Preparing";
  tasks: { id: string; title: string; owner: "Candidate" | "HR" | "IT"; completed: boolean }[];
}

const INITIAL_PREBOARDING: PreboardingCandidate[] = [
  {
    id: "pb-1",
    name: "Meera Kulkarni",
    role: "Senior People Operations Partner",
    joiningDate: "2026-04-01",
    daysToJoin: 16,
    assignedBuddy: "Neha Kapoor (Lead Recruiter)",
    welcomePackStatus: "Dispatched",
    tasks: [
      { id: "t1", title: "Signed Formal Offer Letter", owner: "Candidate", completed: true },
      { id: "t2", title: "Identity & Academic Documents Uploaded", owner: "Candidate", completed: true },
      { id: "t3", title: "Company NDA & Code of Conduct Sign-off", owner: "Candidate", completed: true },
      { id: "t4", title: "Emergency Contact & Address Details Submitted", owner: "Candidate", completed: true },
      { id: "t5", title: "Laptop Spec & Peripherals Selection", owner: "IT", completed: true },
      { id: "t6", title: "Day-One Schedule & Welcome Call", owner: "HR", completed: false },
    ],
  },
  {
    id: "pb-2",
    name: "Aditya Roy",
    role: "Lead Product Designer (UI/UX)",
    joiningDate: "2026-04-01",
    daysToJoin: 16,
    assignedBuddy: "Pooja Sharma (Design Head)",
    welcomePackStatus: "Preparing",
    tasks: [
      { id: "t11", title: "Signed Formal Offer Letter", owner: "Candidate", completed: true },
      { id: "t12", title: "Identity & Academic Documents Uploaded", owner: "Candidate", completed: true },
      { id: "t13", title: "Company NDA & Code of Conduct Sign-off", owner: "Candidate", completed: false },
      { id: "t14", title: "MacBook Pro M3 Max Provisioning", owner: "IT", completed: false },
      { id: "t15", title: "Welcome Swag Kit Dispatch", owner: "HR", completed: false },
    ],
  },
];

export function PreboardingPage() {
  const [candidates, setCandidates] = useState<PreboardingCandidate[]>(INITIAL_PREBOARDING);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("pb-1");

  const activeCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  const handleToggleTask = (taskId: string) => {
    const updated = candidates.map((c) => {
      if (c.id !== activeCandidate.id) return c;
      return {
        ...c,
        tasks: c.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
      };
    });
    setCandidates(updated);
    toast.success("Preboarding checklist item updated!");
  };

  const completedCount = activeCandidate.tasks.filter((t) => t.completed).length;
  const progressPct = Math.round((completedCount / activeCandidate.tasks.length) * 100);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Candidate Preboarding & Day-One Readiness Hub"
        description="Nurture future joiners between offer acceptance and Day 1. Coordinate document collection, equipment deliveries, and welcome communication."
      />

      {/* Main Preboarding Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Col: Upcoming Joiners Selector */}
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3">
          <div className="flex items-center justify-between font-semibold text-sm">
            <span>Upcoming Joiners</span>
            <Badge variant="outline" className="text-xs">{candidates.length} In Preboarding</Badge>
          </div>

          <div className="space-y-2">
            {candidates.map((c) => {
              const comp = c.tasks.filter((t) => t.completed).length;
              const pct = Math.round((comp / c.tasks.length) * 100);
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCandidateId(c.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activeCandidate.id === c.id
                      ? "border-indigo-500 bg-accent/60 shadow-sm"
                      : "border-border bg-card/40 hover:bg-accent/30"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foreground">{c.name}</span>
                    <Badge variant="secondary" className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                      Joins in {c.daysToJoin}d
                    </Badge>
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.role}</div>
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-[10px] text-muted-foreground">
                      <span>Preboarding Readiness:</span>
                      <span className="font-semibold text-foreground">{pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Active Joiner Preboarding Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
              <div>
                <h3 className="font-bold text-lg text-foreground">{activeCandidate.name}</h3>
                <p className="text-xs text-muted-foreground">
                  Target Role: <strong className="text-foreground">{activeCandidate.role}</strong> • Target Start: <strong>{activeCandidate.joiningDate}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs gap-1.5"
                  onClick={() => toast.success(`Welcome nudge sent to ${activeCandidate.name}!`)}
                >
                  <Mail className="h-3.5 w-3.5" /> Send Reminder Nudge
                </Button>
              </div>
            </div>

            {/* Preboarding Progress Banner */}
            <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  Countdown to Day 1: {activeCandidate.daysToJoin} Days Remaining
                </span>
                <span className="font-bold text-xs text-indigo-500">{progressPct}% Completed</span>
              </div>
              <Progress value={progressPct} className="h-2" />
              <div className="flex justify-between text-[11px] text-muted-foreground pt-1">
                <span>Buddy Assigned: <strong>{activeCandidate.assignedBuddy}</strong></span>
                <span>Swag Kit: <strong>{activeCandidate.welcomePackStatus}</strong></span>
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-2">
              <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                Preboarding Action Items ({completedCount}/{activeCandidate.tasks.length})
              </h4>

              {activeCandidate.tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs cursor-pointer transition-colors ${
                    task.completed ? "border-emerald-500/30 bg-emerald-500/5" : "border-border bg-card/40 hover:bg-accent/30"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`grid h-5 w-5 place-items-center rounded-full border ${
                        task.completed ? "bg-emerald-500 text-white border-emerald-500" : "border-border"
                      }`}
                    >
                      {task.completed && <Check className="h-3 w-3" />}
                    </div>
                    <span className={task.completed ? "line-through text-muted-foreground" : "font-medium text-foreground"}>
                      {task.title}
                    </span>
                  </div>

                  <Badge variant="outline" className="text-[10px]">
                    Owner: {task.owner}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
