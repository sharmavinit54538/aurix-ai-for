import { Link } from "@tanstack/react-router";
import { Briefcase, ChevronLeft, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Loader } from "@/components/aurix/Loader";
import { Button } from "@/components/ui/button";
import {
  RecruitmentDashboardCharts,
  RecruitmentHiringTrendChart,
} from "../components/RecruitmentDashboardCharts";
import { RecruitmentDashboardKpis } from "../components/RecruitmentDashboardKpis";
import { RecruitmentRecentActivity } from "../components/RecruitmentRecentActivity";
import { RECRUITMENT_MODULES_LIST } from "../constants/modules";
import { useRecruitmentDashboard } from "../hooks/useRecruitmentDashboard";

type ViewMode = "modules" | "analytics";

export function RecruitmentDashboardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("modules");
  const { stats, funnel, byDept, monthlyHires, recent, isLoading, isError, refetch } =
    useRecruitmentDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <RecruitmentHubHeader viewMode={viewMode} onViewModeChange={setViewMode} />
        <Loader variant="panel" label="Loading recruitment dashboard..." skeletonRows={6} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6">
        <RecruitmentHubHeader viewMode={viewMode} onViewModeChange={setViewMode} />
        <div className="rounded-2xl border border-border bg-card/60 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Could not load dashboard data from the API. Please try again.
          </p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RecruitmentHubHeader
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onRefresh={refetch}
      />

      {viewMode === "modules" ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {RECRUITMENT_MODULES_LIST.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.id}
                  to={module.to as "/dashboard/recruitment/jobs"}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/45 backdrop-blur-md p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-500/40 hover:bg-card/75 hover:shadow-lg hover:shadow-indigo-500/5 text-left cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${module.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-display text-sm font-semibold tracking-tight text-foreground transition-colors group-hover:text-indigo-400">
                        {module.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-normal">
                        {module.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in duration-300 text-left">
          <RecruitmentDashboardKpis stats={stats} />
          <RecruitmentDashboardCharts funnel={funnel} byDept={byDept} />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <RecruitmentHiringTrendChart monthlyHires={monthlyHires} className="lg:col-span-2" />
            <RecruitmentRecentActivity items={recent} />
          </div>
        </div>
      )}
    </div>
  );
}

function RecruitmentHubHeader({
  viewMode,
  onViewModeChange,
  onRefresh,
}: {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onRefresh?: () => void;
}) {
  return (
    <>
      <Link
        to="/dashboard/talent"
        className="group/back inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card/60 hover:bg-accent/80 hover:border-primary/40 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground shadow-xs backdrop-blur-md transition-all duration-200 hover:shadow-md hover:shadow-primary/5 cursor-pointer mb-2"
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-background/80 border border-border/50 group-hover/back:border-primary/40 group-hover/back:bg-primary/10 text-muted-foreground group-hover/back:text-primary transition-all duration-200">
          <ChevronLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover/back:-translate-x-0.5" />
        </span>
        <span>Back to Talent Hub</span>
      </Link>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-glow">
              <Briefcase className="h-5 w-5" />
            </span>
            <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Recruitment Hub</h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground text-left">
            Manage your hiring pipelines, coordinate schedules, raise requisitions, and review metrics.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-card/65 border border-border/80 p-0.5 rounded-lg">
            <Button
              variant={viewMode === "modules" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("modules")}
              className="text-xs h-7 px-3 font-semibold rounded-md cursor-pointer"
            >
              Recruitment Hub
            </Button>
            <Button
              variant={viewMode === "analytics" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => onViewModeChange("analytics")}
              className="text-xs h-7 px-3 font-semibold rounded-md cursor-pointer"
            >
              Hiring Metrics
            </Button>
          </div>
          {onRefresh ? (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          ) : null}
        </div>
      </div>
    </>
  );
}
