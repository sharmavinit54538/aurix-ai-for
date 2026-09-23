import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  Briefcase, CalendarClock, Clock, CheckCircle2,
  Filter, ArrowUpRight, Check, X, AlertCircle
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useRecruitment } from "../hooks/useRecruitment";
import { computeAverageTimeToHire } from "../utils/dashboard";

export function HiringManagerRecruitmentPage() {
  const { jobs, candidates, interviews, moveStage } = useRecruitment();
  const [selectedJobId, setSelectedJobId] = useState<string>("all");

  const myJobs = useMemo(() => {
    return jobs.filter((j) => selectedJobId === "all" || j.id === selectedJobId);
  }, [jobs, selectedJobId]);

  const activeCandidates = useMemo(() => {
    return candidates.filter((c) => selectedJobId === "all" || c.jobId === selectedJobId);
  }, [candidates, selectedJobId]);

  // Candidates requiring review by Hiring Manager
  const pendingReviews = useMemo(() => {
    return activeCandidates.filter((c) =>
      ["screening", "technical", "interview"].includes(c.stage)
    );
  }, [activeCandidates]);

  const avgTimeToHire = useMemo(() => {
    return computeAverageTimeToHire(activeCandidates);
  }, [activeCandidates]);

  const handleDecision = (candId: string, decision: "advance" | "reject") => {
    const cand = candidates.find((c) => c.id === candId);
    if (!cand) return;
    const targetId = cand.applicationId || cand.id;
    if (!targetId) return;

    if (decision === "advance") {
      moveStage(targetId, "offer");
      toast.success(`${cand.name} approved and advanced to Offer Stage!`);
    } else {
      moveStage(targetId, "rejected");
      toast.info(`${cand.name} marked as Rejected with feedback.`);
    }
  };

  const scheduledInterviews = useMemo(() => {
    return interviews.filter((i) => i.status === "scheduled");
  }, [interviews]);

  const formatInterviewDate = (dateStr?: string) => {
    if (!dateStr) return "Date TBD";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Hiring Manager Recruitment Dashboard"
          description="Review assigned open requisitions, candidate pipeline funnels, scheduled interviews, and pending candidate approvals."
        />
        {jobs.length > 0 && (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
            <select
              value={selectedJobId}
              onChange={(e) => setSelectedJobId(e.target.value)}
              className="h-9 rounded-xl border border-border bg-card/60 px-3 text-xs text-foreground backdrop-blur-xl focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Requisitions ({jobs.length})</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Open Positions</span>
            <Briefcase className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">{myJobs.length} Active</div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {myJobs.length > 0 ? "Assigned to your engineering unit" : "No active open positions"}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Pending Reviews</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-amber-600 dark:text-amber-400">
            {pendingReviews.length} Candidates
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {pendingReviews.length > 0 ? "Awaiting manager score evaluation" : "Queue is fully up to date"}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Interviews Scheduled</span>
            <CalendarClock className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-foreground">
            {scheduledInterviews.length} Sessions
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            {scheduledInterviews.length > 0 ? "Active sessions across panel members" : "No upcoming sessions"}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Avg Time-to-Hire</span>
            <Clock className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 font-display text-2xl font-bold">
            {avgTimeToHire > 0 ? `${avgTimeToHire} Days` : "—"}
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground font-medium">
            {avgTimeToHire > 0 ? "Calculated from hired candidates" : "No hire data yet"}
          </div>
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
              {pendingReviews.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border bg-card/20">
                  <CheckCircle2 className="h-8 w-8 text-muted-foreground/40 mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">No pending candidate reviews</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">All candidates in your pipeline have been reviewed.</p>
                </div>
              ) : (
                pendingReviews.map((cand) => (
                  <div
                    key={cand.id}
                    className="rounded-xl border border-border bg-card/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-accent/20 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">{cand.name}</span>
                        <Badge variant="secondary" className="text-[10px] capitalize">{cand.stage}</Badge>
                        {cand.atsScore != null && (
                          <span className="text-xs font-semibold text-indigo-500">{cand.atsScore}% Match</span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Role: <strong className="text-foreground">{cand.appliedPosition || "General Requisition"}</strong>
                        {cand.yearsExperience ? ` • ${cand.yearsExperience} yrs exp` : ""}
                        {cand.location ? ` • ${cand.location}` : ""}
                      </div>
                      {cand.summary && (
                        <div className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                          {cand.summary}
                        </div>
                      )}
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
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Open Requisitions & Upcoming Panel Sessions */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Your Active Open Roles</h4>
            <div className="space-y-2">
              {myJobs.length === 0 ? (
                <div className="p-4 text-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                  No active open roles found.
                </div>
              ) : (
                myJobs.slice(0, 4).map((j) => (
                  <div key={j.id} className="p-2.5 rounded-xl border border-border bg-card/40 text-xs">
                    <div className="font-semibold text-foreground flex items-center justify-between">
                      <span>{j.title}</span>
                      <Badge variant="outline" className="text-[9px]">{j.vacancies || 0} open</Badge>
                    </div>
                    <div className="text-[11px] text-muted-foreground mt-1 flex justify-between">
                      <span>{j.applicants || 0} Applicants</span>
                      <Link
                        to="/dashboard/recruitment/jobs/$jobId"
                        params={{ jobId: j.id }}
                        className="text-indigo-500 hover:underline inline-flex items-center"
                      >
                        Details <ArrowUpRight className="h-3 w-3 ml-0.5" />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-3">
            <h4 className="font-semibold text-sm text-foreground">Upcoming Interview Schedule</h4>
            <div className="space-y-2">
              {scheduledInterviews.length === 0 ? (
                <div className="p-4 text-center rounded-xl border border-dashed border-border text-xs text-muted-foreground">
                  No upcoming interviews scheduled.
                </div>
              ) : (
                scheduledInterviews.slice(0, 3).map((iv) => (
                  <div key={iv.id} className="p-2.5 rounded-xl border border-border bg-card/40 text-xs">
                    <div className="font-medium text-foreground">{iv.candidateName}</div>
                    <div className="text-[11px] text-muted-foreground">{iv.round}</div>
                    <div className="text-[10px] text-indigo-500 mt-1 font-mono">
                      {formatInterviewDate(iv.date)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
