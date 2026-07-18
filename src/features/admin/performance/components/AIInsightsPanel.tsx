import React, { useMemo } from "react";
import type { PerformanceReview, Goal } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  Trophy,
  AlertTriangle,
  UserCheck,
  GraduationCap,
  Building,
  Activity,
  Flame,
} from "lucide-react";

interface AIInsightsPanelProps {
  reviews: PerformanceReview[];
  goals: Goal[];
}

export function AIInsightsPanel({ reviews, goals }: AIInsightsPanelProps) {
  // AI calculations
  const insights = useMemo(() => {
    if (reviews.length === 0) return null;

    // 1. Top Performer
    const sortedPerformers = [...reviews].sort((a, b) => {
      if (b.overallRating !== a.overallRating) {
        return b.overallRating - a.overallRating;
      }
      return b.kpiScore - a.kpiScore;
    });
    const topPerformer = sortedPerformers[0];

    // 2. Employees at Risk (rating <= 2.5 OR goals completion < 40%)
    const atRisk = reviews.filter((r) => {
      const g = goals.filter((gl) => gl.employeeId === r.employeeId);
      const avgGoalProgress =
        g.length > 0 ? g.reduce((acc, gl) => acc + gl.progress, 0) / g.length : r.goalProgress;
      return r.overallRating <= 2.5 || avgGoalProgress < 40;
    });

    // 3. Recommended Promotions (promotionEligible is true AND rating >= 4)
    const promotions = reviews.filter((r) => r.promotionEligible && r.overallRating >= 4);

    // 4. Suggested Training Courses based on weak scores
    const trainingSuggestions = reviews
      .map((r) => {
        const gaps: string[] = [];
        if (r.technicalSkills <= 3) gaps.push("Technical Skills");
        if (r.communication <= 3) gaps.push("Communication Skillsets");
        if (r.leadership <= 3) gaps.push("Systems Leadership");
        if (r.productivity <= 3) gaps.push("Task Productivity Velocity");
        if (r.teamwork <= 3) gaps.push("Cross-functional Teamwork");

        if (gaps.length > 0) {
          // Map to course
          const course =
            gaps[0] === "Technical Skills"
              ? "Advanced React & Scale Architectures"
              : gaps[0] === "Communication Skillsets"
                ? "Corporate Communications & Conflict Sync"
                : gaps[0] === "Systems Leadership"
                  ? "Executive Presence & Team Management"
                  : "Agile Scopes & Velocity Frameworks";
          return { name: r.employeeName, course, gap: gaps[0] };
        }
        return null;
      })
      .filter((x) => x !== null) as { name: string; course: string; gap: string }[];

    // 5. Department Performance Summary
    const deptGroups: Record<string, { total: number; count: number }> = {};
    reviews.forEach((r) => {
      if (!deptGroups[r.department]) {
        deptGroups[r.department] = { total: 0, count: 0 };
      }
      deptGroups[r.department].total += r.overallRating;
      deptGroups[r.department].count += 1;
    });
    const deptSummary = Object.entries(deptGroups).map(([name, val]) => ({
      name,
      avgRating: (val.total / val.count).toFixed(1),
    }));

    // 6. Attrition Risk Prediction (based on Low rating + Delayed goals)
    const attritionRisk = reviews.filter((r) => {
      const delayedGoals = goals.filter(
        (g) => g.employeeId === r.employeeId && g.status === "delayed",
      ).length;
      return r.overallRating <= 3 && delayedGoals > 0;
    });

    return {
      topPerformer,
      atRisk,
      promotions,
      trainingSuggestions,
      deptSummary,
      attritionRisk,
    };
  }, [reviews, goals]);

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl border border-border/80 bg-card/40 p-5 shadow-sm space-y-4 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-brand/10 text-brand flex items-center justify-center flex-shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              AI Talent Performance Insights
            </h3>
            <p className="text-xs text-muted-foreground">
              Continuous machine learning analytics of company OKRs & rating indices.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Sparkles className="h-8 w-8 text-brand opacity-50 mb-2 animate-pulse" />
          <p className="text-sm font-medium text-foreground mb-1">
            No AI Talent Insights generated yet
          </p>
          <p className="text-xs text-muted-foreground max-w-md">
            Once employee evaluations are completed and reviews are saved, the AI engine will
            dynamically map top performers, promotion raises, and learning course recommendations
            here.
          </p>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div className="rounded-2xl border border-border/80 bg-card/40 p-5 shadow-sm space-y-4 backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 animate-pulse">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            AI Talent Performance Insights
          </h3>
          <p className="text-xs text-muted-foreground">
            Continuous machine learning analytics of company OKRs & rating indices.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Top Performer of Month */}
        <Card className="rounded-xl border border-border bg-card/30 hover:border-brand/40 transition-colors">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Trophy className="h-4 w-4 text-amber-500" /> Performer of the Month
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {insights.topPerformer ? (
              <div className="space-y-1.5 pt-2">
                <p className="text-sm font-bold text-foreground">
                  {insights.topPerformer.employeeName}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {insights.topPerformer.designation} • {insights.topPerformer.department}
                </p>
                <div className="flex gap-1.5 mt-2">
                  <Badge
                    variant="outline"
                    className="text-[9px] font-bold border-emerald-500/25 bg-emerald-500/5 text-emerald-500"
                  >
                    {insights.topPerformer.overallRating} ★ Rating
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-[9px] font-bold border-brand/25 bg-brand/5 text-brand"
                  >
                    {insights.topPerformer.kpiScore}% KPIs
                  </Badge>
                </div>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic">No evaluations completed</span>
            )}
          </CardContent>
        </Card>

        {/* Card 2: Recommended Promotions */}
        <Card className="rounded-xl border border-border bg-card/30">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-emerald-500" /> Promotion Candidates
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {insights.promotions.length > 0 ? (
              <div className="space-y-2 pt-2">
                {insights.promotions.slice(0, 2).map((p) => (
                  <div key={p.id} className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-foreground truncate max-w-[130px]">
                      {p.employeeName}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[9px] font-bold bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/10 border-none"
                    >
                      +{p.salaryIncrement}% raise recommended
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic pt-2 block">
                No promotion candidates flagged
              </span>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Training Recommendations */}
        <Card className="rounded-xl border border-border bg-card/30">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-blue-500" /> Recommended Training Gaps
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {insights.trainingSuggestions.length > 0 ? (
              <div className="space-y-2 pt-2">
                {insights.trainingSuggestions.slice(0, 2).map((t, idx) => (
                  <div key={idx} className="text-xs min-w-0">
                    <p className="font-semibold text-foreground truncate">{t.name}</p>
                    <p className="text-[9px] text-muted-foreground truncate">
                      Suggest: {t.course} ({t.gap})
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic pt-2 block">
                No skill gaps identified recently
              </span>
            )}
          </CardContent>
        </Card>

        {/* Card 4: Employees at Attrition Risk */}
        <Card className="rounded-xl border border-border bg-card/30">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-rose-500" /> Attrition Risk Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {insights.attritionRisk.length > 0 ? (
              <div className="space-y-2 pt-2">
                {insights.attritionRisk.slice(0, 2).map((a) => (
                  <div key={a.id} className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-foreground truncate max-w-[120px]">
                      {a.employeeName}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[9px] font-bold bg-rose-500/10 text-rose-500 border-none"
                    >
                      High attrition risk
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic pt-2 block">
                No attrition flags triggered
              </span>
            )}
          </CardContent>
        </Card>

        {/* Card 5: Employees needing Improvement / PIP */}
        <Card className="rounded-xl border border-border bg-card/30">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <AlertTriangle className="h-4 w-4 text-orange-500" /> Attention Needed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {insights.atRisk.length > 0 ? (
              <div className="space-y-2 pt-2">
                {insights.atRisk.slice(0, 2).map((r) => (
                  <div key={r.id} className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-foreground truncate max-w-[130px]">
                      {r.employeeName}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[9px] font-bold bg-orange-500/10 text-orange-500 border-none"
                    >
                      Rating {r.overallRating} ★
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic pt-2 block">
                All employees meeting indices baseline
              </span>
            )}
          </CardContent>
        </Card>

        {/* Card 6: Department Performance Summary */}
        <Card className="rounded-xl border border-border bg-card/30">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Building className="h-4 w-4 text-purple-500" /> Dept Ratings Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {insights.deptSummary.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 pt-2">
                {insights.deptSummary.slice(0, 4).map((d, idx) => (
                  <div
                    key={idx}
                    className="text-xs flex items-center justify-between border border-border/40 p-1.5 rounded-lg bg-muted/10"
                  >
                    <span className="font-semibold text-muted-foreground truncate max-w-[70px]">
                      {d.name}
                    </span>
                    <span className="font-bold text-foreground font-mono">{d.avgRating}★</span>
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground italic pt-2 block">
                No summaries generated
              </span>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
