import { createFileRoute } from "@tanstack/react-router";
import { lazyFeaturePage } from "./_lib/lazyFeaturePage";
import { useState } from "react";
import {
  Target, CheckCircle2, LineChart, PenLine, MessageSquare, Award,
  TrendingUp, Trophy, GraduationCap, LayoutDashboard, Sparkles,
  Download, Clock, CheckCircle
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAurix } from "@/lib/aurix-store";
import { toast } from "sonner";

const LazyAdminPerformancePage = lazyFeaturePage(
  () => import("@/features/admin/performance/pages/PerformancePage"),
  "PerformancePage",
);

export const Route = createFileRoute("/dashboard/performance")({
  head: () => ({ meta: [{ title: "Performance — Aurix" }] }),
  component: PerformanceRouteComponent,
});

interface PerformanceTab {
  id: string;
  label: string;
  icon: any;
}

import { usePerformance } from "@/features/admin/performance/hooks/usePerformance";

function PerformanceRouteComponent() {
  const ws = useAurix();
  const userRole = (ws.user?.role || "employee") as string;

  if (userRole !== "employee") {
    return <LazyAdminPerformancePage />;
  }

  const { reviews, goals: allGoals, updateGoal } = usePerformance();
  const employeeId = ws.user?.id || "";
  const myGoals = allGoals.filter(g => g.employeeId === employeeId);
  const myReviews = reviews.filter(r => r.employeeId === employeeId || r.employeeName === ws.user?.fullName);

  const [activeTab, setActiveTab] = useState("goals");
  const [selfScore, setSelfScore] = useState("4");
  const [selfComment, setSelfComment] = useState("");

  const employeeTabs: PerformanceTab[] = [
    { id: "goals", label: "My Goals", icon: Target },
    { id: "okrs", label: "OKRs", icon: CheckCircle2 },
    { id: "kpis", label: "KPIs", icon: LineChart },
    { id: "self-review", label: "Self Review", icon: PenLine },
    { id: "feedback", label: "Manager Feedback", icon: MessageSquare },
    { id: "appraisals", label: "Appraisals", icon: Award },
    { id: "promotions", label: "Promotions", icon: TrendingUp },
    { id: "achievements", label: "Achievements", icon: Trophy },
    { id: "skills", label: "Skill Development", icon: GraduationCap },
  ];

  const handleUpdateGoalProgress = (id: string, nextProgress: number) => {
    const targetGoal = myGoals.find(g => g.id === id);
    if (targetGoal) {
      updateGoal({
        ...targetGoal,
        progress: Math.min(100, Math.max(0, nextProgress)),
        status: nextProgress >= 100 ? "completed" : "in_progress"
      });
      toast.success("Goal progress updated!");
    }
  };

  const handleSelfReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selfComment.trim()) {
      toast.error("Please add your self review remarks.");
      return;
    }
    toast.success("Self review submitted successfully to your manager!");
    setSelfComment("");
  };

  return (
    <>
      <PageHeader
        title="Performance & Growth Portal"
        description="Track your performance objectives, OKRs, professional achievements, and goals progress."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-1">
          {employeeTabs.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  active 
                    ? "bg-accent text-foreground" 
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {t.label}
              </button>
            );
          })}
        </aside>

        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
          {activeTab === "goals" && (
            <div className="space-y-6">
              <h3 className="text-base font-semibold border-b pb-2">Your Performance Goals</h3>
              <div className="space-y-4">
                {myGoals.length === 0 ? (
                  <div className="text-center py-8 text-xs text-muted-foreground">No active performance goals assigned.</div>
                ) : (
                  myGoals.map((g) => (
                    <div key={g.id} className="border border-border bg-card/30 rounded-xl p-4 space-y-3 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold text-sm">{g.title}</div>
                          {g.description && <div className="text-muted-foreground mt-1">{g.description}</div>}
                          <div className="text-muted-foreground mt-0.5">Target Completion: {g.dueDate}</div>
                        </div>
                        <Badge>{g.progress}% Done</Badge>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="h-2 flex-1 rounded-full bg-muted overflow-hidden">
                          <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${g.progress}%` }} />
                        </div>
                        <div className="flex gap-1.5">
                          <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => handleUpdateGoalProgress(g.id, g.progress - 10)}>-</Button>
                          <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => handleUpdateGoalProgress(g.id, g.progress + 10)}>+</Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "okrs" && (
            <div className="space-y-6">
              <h3 className="text-base font-semibold border-b pb-2">Objective Key Results (OKRs)</h3>
              <div className="space-y-4 text-xs">
                {myGoals.length === 0 ? (
                  <div className="text-muted-foreground">No OKR Key Results assigned yet.</div>
                ) : (
                  myGoals.map((g) => (
                    <div key={g.id} className="border bg-card/30 rounded-xl p-4 space-y-2">
                      <div className="font-semibold text-sm text-indigo-400">Objective: {g.title}</div>
                      <div className="pl-4 space-y-1.5 border-l-2 border-dashed border-border mt-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Key Result: Accomplish goal metrics</span>
                          <span className="font-bold">{g.progress}%</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "kpis" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b pb-2">Key Performance Indicators</h3>
              <div className="grid gap-3 sm:grid-cols-2 text-xs">
                {myReviews.length === 0 ? (
                  <div className="text-muted-foreground col-span-2">No KPI ratings generated yet. Complete a review cycle to calculate KPIs.</div>
                ) : (
                  myReviews.map((r) => (
                    <div key={r.id} className="border bg-card/30 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm">Overall Review Score</div>
                        <div className="text-muted-foreground mt-0.5">Calculated score for cycle: {r.reviewDate || "latest"}</div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">{r.overallRating} / 5</Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "self-review" && (
            <form onSubmit={handleSelfReviewSubmit} className="space-y-4 max-w-md">
              <h3 className="text-base font-semibold border-b pb-2">Submit Self Appraisal</h3>
              
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Self Rating Score</Label>
                <select
                  value={selfScore}
                  onChange={(e) => setSelfScore(e.target.value)}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                >
                  <option value="5">5 - Outstanding Contribution</option>
                  <option value="4">4 - Exceeds Expectations</option>
                  <option value="3">3 - Meets Expectations</option>
                  <option value="2">2 - Needs Improvement</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-muted-foreground uppercase">Achievements & Review Notes</Label>
                <textarea
                  required
                  value={selfComment}
                  onChange={(e) => setSelfComment(e.target.value)}
                  placeholder="Describe your achievements and contributions during this appraisal cycle..."
                  className="w-full min-h-[120px] bg-background/50 border rounded-lg p-3 text-sm focus:ring-1"
                />
              </div>

              <Button type="submit">Submit Appraisal</Button>
            </form>
          )}

          {activeTab === "feedback" && (
            <div className="space-y-4 max-w-md">
              <h3 className="text-base font-semibold border-b pb-2">Manager Feedback Notes</h3>
              <div className="space-y-3 text-xs">
                {myReviews.filter(r => r.managerComments).length === 0 ? (
                  <div className="text-muted-foreground">No manager feedback notes available.</div>
                ) : (
                  myReviews.filter(r => r.managerComments).map((r) => (
                    <div key={r.id} className="border bg-card/30 rounded-xl p-4 relative">
                      <div className="flex justify-between font-semibold">
                        <span>Review Cycle Comments ({r.reviewDate})</span>
                        <span className="text-muted-foreground">Manager: {r.managerName || "HR Manager"}</span>
                      </div>
                      <p className="text-muted-foreground italic mt-2">"{r.managerComments}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "appraisals" && (
            <div className="space-y-4 max-w-md">
              <h3 className="text-base font-semibold border-b pb-2">Appraisal Records</h3>
              <div className="space-y-3 text-xs">
                {myReviews.length === 0 ? (
                  <div className="text-muted-foreground">No completed appraisal cycles recorded yet.</div>
                ) : (
                  myReviews.map((r) => (
                    <div key={r.id} className="border bg-card/30 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm">Review Cycle - {r.reviewDate}</div>
                        <div className="text-muted-foreground mt-0.5">Rating: {r.overallRating} / 5</div>
                      </div>
                      <Badge variant="outline" className="capitalize">{r.reviewStatus}</Badge>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "promotions" && (
            <div className="space-y-6 max-w-md">
              <h3 className="text-base font-semibold border-b pb-2">Promotion Timeline</h3>
              <div className="relative pl-6 border-l-2 border-dashed border-border space-y-4 text-xs">
                {myReviews.filter(r => r.promotionEligible).length === 0 ? (
                  <div className="text-muted-foreground">No promotion recommendations recorded yet. Keep up the great work!</div>
                ) : (
                  myReviews.filter(r => r.promotionEligible).map((r) => (
                    <div key={r.id} className="relative">
                      <div className="absolute -left-[31px] top-0 h-4 w-4 rounded-full bg-emerald-500 border border-background flex items-center justify-center text-[10px] text-white">✓</div>
                      <div className="font-medium text-foreground">{r.designation} (Recommended for Promotion)</div>
                      <div className="text-[10px] text-muted-foreground">Salary Increment Recommendation: {r.salaryIncrement}%</div>
                      <div className="text-[10px] text-muted-foreground">Date: {r.reviewDate}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="space-y-6">
              <h3 className="text-base font-semibold border-b pb-2">Trophies & Unlocked Badges</h3>
              <div className="text-xs text-muted-foreground">No trophies or badges unlocked yet for this period.</div>
            </div>
          )}

          {activeTab === "skills" && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold border-b pb-2">Skill Certifications & Courses</h3>
              <div className="text-xs text-muted-foreground">No skill certifications registered.</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
