import { STAGES, STAGE_LABEL, type Candidate, type Job, type Offer, type TimelineItem } from "../types";
import {
  HIRING_TREND_MONTHS,
  MONTH_LABELS,
  RECENT_ACTIVITY_LIMIT,
  SHORTLISTED_STAGES,
} from "../constants/dashboard";

export interface RecruitmentDashboardStats {
  totalJobs: number;
  activeJobs: number;
  draftJobs: number;
  closedJobs: number;
  totalCandidates: number;
  shortlisted: number;
  interviewScheduled: number;
  selected: number;
  rejected: number;
  offersSent: number;
  offersAccepted: number;
  timeToHireDays: number;
}

export interface FunnelPoint {
  stage: string;
  count: number;
}

export interface DepartmentHiringPoint {
  name: string;
  value: number;
}

export interface HiringTrendPoint {
  m: string;
  hires: number;
  offers: number;
}

export interface RecentActivityItem extends TimelineItem {
  who: string;
  jobTitle: string;
}

function isHiredTimelineEvent(title: string): boolean {
  const normalized = title.toLowerCase();
  return normalized.includes("hired") || normalized.includes("moved to hired");
}

function findHiredTimestamp(timeline: TimelineItem[]): number | null {
  const hiredEvent = timeline.find((t) => isHiredTimelineEvent(t.title));
  return hiredEvent ? new Date(hiredEvent.at).getTime() : null;
}

export function computeAverageTimeToHire(candidates: Candidate[]): number {
  const hiredCandidates = candidates.filter((c) => c.stage === "hired");
  if (hiredCandidates.length === 0) return 0;

  const totalDays = hiredCandidates.reduce((acc, candidate) => {
    const appliedAt = new Date(candidate.appliedAt).getTime();
    const hiredAt = findHiredTimestamp(candidate.timeline) ?? Date.now();
    const diffDays = Math.max(1, Math.round((hiredAt - appliedAt) / (1000 * 60 * 60 * 24)));
    return acc + diffDays;
  }, 0);

  return Math.round(totalDays / hiredCandidates.length);
}

export function computeDashboardStats(
  jobs: Job[],
  candidates: Candidate[],
  interviews: { status: string }[],
  offers: Offer[],
): RecruitmentDashboardStats {
  return {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((j) => j.status === "active").length,
    draftJobs: jobs.filter((j) => j.status === "draft").length,
    closedJobs: jobs.filter((j) => j.status === "closed").length,
    totalCandidates: candidates.length,
    shortlisted: candidates.filter((c) => SHORTLISTED_STAGES.includes(c.stage)).length,
    interviewScheduled: interviews.filter((i) => i.status === "scheduled").length,
    selected: candidates.filter((c) => c.stage === "hired").length,
    rejected: candidates.filter((c) => c.stage === "rejected").length,
    offersSent: offers.length,
    offersAccepted: offers.filter((o) => o.status === "accepted").length,
    timeToHireDays: computeAverageTimeToHire(candidates),
  };
}

export function buildFunnelData(candidates: Candidate[]): FunnelPoint[] {
  return STAGES.filter((stage) => stage !== "rejected").map((stage) => ({
    stage: STAGE_LABEL[stage],
    count: candidates.filter((c) => c.stage === stage).length,
  }));
}

export function buildDepartmentHiringData(jobs: Job[]): DepartmentHiringPoint[] {
  const totals = jobs.reduce<Record<string, number>>((acc, job) => {
    acc[job.department] = (acc[job.department] || 0) + job.applicants;
    return acc;
  }, {});

  return Object.entries(totals).map(([name, value]) => ({ name, value }));
}

export function buildHiringTrendData(
  candidates: Candidate[],
  offers: Offer[],
  monthsBack = HIRING_TREND_MONTHS,
): HiringTrendPoint[] {
  const data: HiringTrendPoint[] = [];

  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);

    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    const monthLabel = MONTH_LABELS[monthIndex];

    const hires = candidates.filter((candidate) => {
      if (candidate.stage !== "hired") return false;
      const applied = new Date(candidate.appliedAt);
      return applied.getMonth() === monthIndex && applied.getFullYear() === year;
    }).length;

    const offerCount = offers.filter((offer) => {
      const offerDate = new Date(offer.sentAt || offer.joiningDate);
      return offerDate.getMonth() === monthIndex && offerDate.getFullYear() === year;
    }).length;

    data.push({ m: monthLabel, hires, offers: offerCount });
  }

  return data;
}

export function buildRecentActivity(
  candidates: Candidate[],
  limit = RECENT_ACTIVITY_LIMIT,
): RecentActivityItem[] {
  return candidates
    .flatMap((candidate) =>
      candidate.timeline.map((event) => ({
        ...event,
        who: candidate.name,
        jobTitle: candidate.appliedPosition,
      })),
    )
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, limit);
}
