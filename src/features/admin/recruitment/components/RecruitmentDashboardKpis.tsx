import {
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Clock,
  FileCheck2,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import type { RecruitmentDashboardStats } from "../utils/dashboard";

interface RecruitmentDashboardKpisProps {
  stats: RecruitmentDashboardStats;
}

interface KpiConfig {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent: string;
}

function buildKpiConfigs(stats: RecruitmentDashboardStats): KpiConfig[] {
  return [
    { label: "Total Jobs", value: stats.totalJobs, icon: Briefcase, accent: "from-violet-500/20 to-fuchsia-500/10" },
    { label: "Active Jobs", value: stats.activeJobs, icon: TrendingUp, accent: "from-emerald-500/20 to-teal-500/10" },
    { label: "Draft Jobs", value: stats.draftJobs, icon: FileCheck2, accent: "from-sky-500/20 to-cyan-500/10" },
    { label: "Closed Jobs", value: stats.closedJobs, icon: XCircle, accent: "from-rose-500/15 to-red-500/10" },
    { label: "Candidates", value: stats.totalCandidates, icon: Users, accent: "from-indigo-500/20 to-violet-500/10" },
    { label: "Shortlisted", value: stats.shortlisted, icon: UserCheck, accent: "from-amber-500/20 to-orange-500/10" },
    { label: "Interviews", value: stats.interviewScheduled, icon: CalendarClock, accent: "from-cyan-500/20 to-sky-500/10" },
    { label: "Selected", value: stats.selected, icon: CheckCircle2, accent: "from-emerald-500/20 to-green-500/10" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, accent: "from-rose-500/15 to-pink-500/10" },
    { label: "Offers Sent", value: stats.offersSent, icon: FileCheck2, accent: "from-fuchsia-500/20 to-purple-500/10" },
    { label: "Offers Accepted", value: stats.offersAccepted, icon: UserPlus, accent: "from-emerald-500/20 to-teal-500/10" },
    {
      label: "Time to Hire",
      value: stats.timeToHireDays > 0 ? `${stats.timeToHireDays}d` : "—",
      icon: Clock,
      accent: "from-amber-500/20 to-yellow-500/10",
    },
  ];
}

export function RecruitmentDashboardKpis({ stats }: RecruitmentDashboardKpisProps) {
  const kpis = buildKpiConfigs(stats);

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.label}
            style={{ animation: `fade-in 400ms ease-out ${index * 30}ms both` }}
            className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${kpi.accent} p-4 backdrop-blur-xl shadow-sm`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {kpi.label}
                </div>
                <div className="mt-2 font-display text-2xl font-semibold tracking-tight">{kpi.value}</div>
              </div>
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-background/60 shadow-sm">
                <Icon className="h-4 w-4" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
