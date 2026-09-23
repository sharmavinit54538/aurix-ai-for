import { useState } from "react";
import {
  Clock, Mail, Check, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

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

const INITIAL_PREBOARDING: PreboardingCandidate[] = [];

export function PreboardingPage() {
  const [candidates, setCandidates] = useState<PreboardingCandidate[]>(INITIAL_PREBOARDING);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("");

  const activeCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0] || null;

  const handleToggleTask = (taskId: string) => {
    if (!activeCandidate) return;
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

  const completedCount = activeCandidate?.tasks.filter((t) => t.completed).length ?? 0;
  const totalTasks = activeCandidate?.tasks.length ?? 0;
  const progressPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">

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
              const pct = c.tasks.length > 0 ? Math.round((comp / c.tasks.length) * 100) : 0;
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedCandidateId(c.id)}
                  className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                    activeCandidate?.id === c.id
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
            {candidates.length === 0 && (
              <div className="text-xs text-muted-foreground text-center py-6">No upcoming joiners in preboarding.</div>
            )}
          </div>
        </div>

        {/* Right 2 Cols: Active Joiner Preboarding Details */}
        <div className="lg:col-span-2 space-y-4">
          {activeCandidate ? (
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
          ) : (
            <div className="rounded-2xl border border-border bg-card/60 p-8 backdrop-blur-xl flex flex-col items-center justify-center text-center min-h-[300px]">
              <Users className="h-10 w-10 text-muted-foreground/40 mb-3" />
              <h3 className="font-semibold text-sm text-foreground">No Preboarding Candidates</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                There are no candidates currently in the preboarding pipeline. Accepted offers will appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
