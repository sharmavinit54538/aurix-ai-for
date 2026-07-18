import React from "react";
import {
  Users,
  Clock,
  Award,
  AlertTriangle,
  TrendingUp,
  CheckCircle,
  UserCheck,
  TrendingDown,
} from "lucide-react";
import type { PerformanceReview, Goal } from "../types";
import { Card, CardContent } from "@/components/ui/card";

interface PerformanceStatsCardsProps {
  reviews: PerformanceReview[];
  goals: Goal[];
}

export function PerformanceStatsCards({ reviews, goals }: PerformanceStatsCardsProps) {
  const totalReviewed = reviews.length;

  // Pending reviews: draft + in_review
  const pendingReviews = reviews.filter(
    (r) => r.reviewStatus === "draft" || r.reviewStatus === "in_review",
  ).length;

  // High Performers: rating >= 4.5 (which is 5 in integer ratings)
  const highPerformers = reviews.filter((r) => r.overallRating >= 4.5).length;

  // Needing improvement: rating <= 2.5 (e.g. <= 2)
  const needingImprovement = reviews.filter((r) => r.overallRating <= 2.5).length;

  // Average Performance Score
  const totalScore = reviews.reduce((acc, r) => acc + r.overallRating, 0);
  const avgScore = totalReviewed > 0 ? (totalScore / totalReviewed).toFixed(1) : "0.0";

  // Goals Completed %
  const totalGoals = goals.length;
  const completedGoals = goals.filter((g) => g.status === "completed").length;
  const goalsCompletedPct = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  // Promotion Eligible
  const promotionEligible = reviews.filter((r) => r.promotionEligible).length;

  const stats = [
    {
      label: "Employees Reviewed",
      value: totalReviewed,
      icon: Users,
      trend: totalReviewed > 0 ? "Active" : "0",
      isPositive: totalReviewed > 0,
      desc: "Total active reviews",
      color: "from-blue-500/20 to-indigo-500/20 text-blue-500 border-blue-500/20",
    },
    {
      label: "Pending Reviews",
      value: pendingReviews,
      icon: Clock,
      trend: pendingReviews > 0 ? "Pending" : "None",
      isPositive: pendingReviews === 0,
      desc: "Awaiting cycle completion",
      color: "from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/20",
    },
    {
      label: "High Performers",
      value: highPerformers,
      icon: Award,
      trend: totalReviewed > 0 ? `${Math.round((highPerformers / totalReviewed) * 100)}%` : "0%",
      isPositive: highPerformers > 0,
      desc: "Raters with score >= 4.5",
      color: "from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/20",
    },
    {
      label: "Needing Improvement",
      value: needingImprovement,
      icon: AlertTriangle,
      trend:
        totalReviewed > 0 ? `${Math.round((needingImprovement / totalReviewed) * 100)}%` : "0%",
      isPositive: needingImprovement === 0,
      desc: "Raters with score <= 2.5",
      color: "from-rose-500/20 to-red-500/20 text-rose-500 border-rose-500/20",
    },
    {
      label: "Avg. Performance Score",
      value: `${avgScore} / 5`,
      icon: TrendingUp,
      trend: Number(avgScore) >= 3.5 ? "High" : Number(avgScore) > 0 ? "Medium" : "0.0",
      isPositive: Number(avgScore) >= 3.0,
      desc: "Weighted company average",
      color: "from-purple-500/20 to-pink-500/20 text-purple-500 border-purple-500/20",
    },
    {
      label: "Goals Completed %",
      value: `${goalsCompletedPct}%`,
      icon: CheckCircle,
      trend: `${completedGoals} / ${totalGoals}`,
      isPositive: goalsCompletedPct > 50,
      desc: "OKR targets achieved",
      color: "from-cyan-500/20 to-sky-500/20 text-cyan-500 border-cyan-500/20",
    },
    {
      label: "Promotion Eligible",
      value: promotionEligible,
      icon: UserCheck,
      trend: totalReviewed > 0 ? `${Math.round((promotionEligible / totalReviewed) * 100)}%` : "0%",
      isPositive: promotionEligible > 0,
      desc: "Of total active reviews",
      color: "from-teal-500/20 to-emerald-500/20 text-teal-500 border-teal-500/20",
    },
    {
      label: "Performance Trend",
      value:
        Number(avgScore) >= 4.5
          ? "Excellent"
          : Number(avgScore) >= 3.5
            ? "Good"
            : Number(avgScore) > 0
              ? "Average"
              : "N/A",
      icon: TrendingUp,
      trend: Number(avgScore) > 0 ? `${Math.round(Number(avgScore) * 20)}%` : "0%",
      isPositive: Number(avgScore) >= 3.0,
      desc: "Company index rating",
      color: "from-slate-500/20 to-gray-500/20 text-slate-500 border-slate-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card
            key={i}
            className="group relative overflow-hidden rounded-2xl border border-border/80 bg-card/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-border hover:shadow-md hover:bg-card/60"
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 -z-10" />
            <CardContent className="p-3.5 flex flex-col justify-between h-full min-h-[125px]">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground line-clamp-1">
                  {stat.label}
                </span>
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br border ${stat.color}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
              </div>
              <div className="mt-2">
                <div className="text-xl font-bold tracking-tight text-foreground truncate">
                  {stat.value}
                </div>
                <div className="flex items-center gap-0.5 mt-1">
                  {stat.isPositive ? (
                    <TrendingUp className="h-2.5 w-2.5 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-2.5 w-2.5 text-rose-500" />
                  )}
                  <span
                    className={`text-[9px] font-bold ${stat.isPositive ? "text-emerald-500" : "text-rose-500"}`}
                  >
                    {stat.trend}
                  </span>
                  <span className="text-[8px] text-muted-foreground truncate max-w-[50px] ml-0.5">
                    {stat.desc}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
