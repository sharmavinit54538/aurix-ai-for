import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Briefcase, Users, CalendarClock, Clock, Award, CheckCircle2,
  XCircle, Filter, ArrowUpRight, Check, X, Eye, AlertCircle, TrendingUp
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRecruitment } from "../hooks/useRecruitment";

export function HiringManagerRecruitmentPage() {
  const { jobs, candidates, interviews, offers, moveStage } = useRecruitment();
  const [selectedJobId, setSelectedJobId] = useState<string>("all");

  const myJobs = useMemo(() => {
    return jobs.filter((j) => selectedJobId === "all" || j.id === selectedJobId);
  }, [jobs, selectedJobId]);

  const activeCandidates = useMemo(() => {
    return candidates.filter((c) => selectedJobId === "all" || c.jobId === selectedJobId);
  }, [candidates, selectedJobId]);

  // Candidates requiring review by Hiring Manager
  const pendingReviews = activeCandidates.filter((c) =>
    ["screening", "technical", "interview"].includes(c.stage)
  );

  const handleDecision = (candId: string, decision: "advance" | "reject") => {
    const cand = candidates.find((c) => c.id === candId);
    if (!cand || !cand.applicationId) return;

    if (decision === "advance") {
      moveStage(cand.applicationId, "offer");
      toast.success(`${cand.name} approved and advanced to Offer Stage!`);
    } else {
      moveStage(cand.applicationId, "rejected");
      toast.info(`${cand.name} marked as Rejected with feedback.`);
    }
  };

  const scheduledInterviews = interviews.filter((i) => i.status === "scheduled");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hiring Manager Recruitment Dashboard"
        description="Review assigned open requisitions, candidate pipeline funnels, scheduled interviews, and pending candidate approvals."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Open Positions</span>
            <Briefcase className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">{myJobs.length} Active</div>
          <div className="mt-1 text-[11px] text-muted-foreground">Assigned to your engineering unit</div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Pending Reviews</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-amber-600 dark:text-amber-400">
            {pendingReviews.length} Candidates
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">Awaiting manager score evaluation</div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Interviews Scheduled</span>
            <CalendarClock className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-foreground">
            {scheduledInterviews.length} Sessions
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">This week across panel members</div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Avg Time-to-Hire</span>
            <Clock className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">18 Days</div>
          <div className="mt-1 text-[11px] text-emerald-500 font-medium">↓ 4 days faster than company SLA</div>
        </div>
      </div>

      {/* Main Content: Pending Reviews Action Feed & Active Jobs List */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Actionable Review Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-sm text-foreground">Pending Candidate Approvals</h3>
                <p className="text-xs text-muted-foreground">Candidates requiring your hire / no-hire decision.</p>
              </div>
              <Badge variant="outline" className="text-xs">{pendingReviews.length} in Queue</Badge>
            </div>

            <div className="space-y-2.5">
              {pendingReviews.map((cand) => (
                <div
                  key={cand.id}
                  className="rounded-xl border border-border bg-card/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-accent/20 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">{cand.name}</span>
                      <Badge variant="secondary" className="text-[10px] capitalize">{cand.stage}</Badge>
                      <span className="text-xs font-semibold text-indigo-500">{cand.atsScore || 92}% Match</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Role: <strong className="text-foreground">{cand.appliedPosition}</strong> • {cand.yearsExperience} yrs exp • {cand.location}
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                      {cand.summary}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs text-rose-600 border-rose-500/30 hover:bg-rose-500/10 gap-1"
                      onClick={() => handleDecision(cand.id, "reject")}
                    >
                      <X className="h-3.5 w-3.5" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 text-xs bg-gradient-brand text-brand-foreground shadow-glow gap-1"
                      onClick={() => handleDecision(cand.id, "advance")}
                    >
                      <Check className="h-3.5 w-3.5" /> Advance to Offer
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Open Requisitions & Upcoming Panel Sessions */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Your Active Open Roles</h4>
            <div className="space-y-2">
              {myJobs.slice(0, 4).map((j) => (
                <div key={j.id} className="p-2.5 rounded-xl border border-border bg-card/40 text-xs">
                  <div className="font-semibold text-foreground flex items-center justify-between">
                    <span>{j.title}</span>
                    <Badge variant="outline" className="text-[9px]">{j.vacancies} open</Badge>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1 flex justify-between">
                    <span>{j.applicants} Applicants</span>
                    <Link
                      to="/dashboard/recruitment/jobs/$jobId"
                      params={{ jobId: j.id }}
                      className="text-indigo-500 hover:underline inline-flex items-center"
                    >
                      Details <ArrowUpRight className="h-3 w-3 ml-0.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Upcoming Interview Schedule</h4>
            <div className="space-y-2">
              {scheduledInterviews.slice(0, 3).map((iv) => (
                <div key={iv.id} className="p-2.5 rounded-xl border border-border bg-card/40 text-xs">
                  <div className="font-medium text-foreground">{iv.candidateName}</div>
                  <div className="text-[11px] text-muted-foreground">{iv.round}</div>
                  <div className="text-[10px] text-indigo-500 mt-1 font-mono">
                    {new Date(iv.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
