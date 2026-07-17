import { useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchRecruitmentData } from "../recruitmentThunk";
import {
  buildDepartmentHiringData,
  buildFunnelData,
  buildHiringTrendData,
  buildRecentActivity,
  computeDashboardStats,
  type DepartmentHiringPoint,
  type FunnelPoint,
  type HiringTrendPoint,
  type RecentActivityItem,
  type RecruitmentDashboardStats,
} from "../utils/dashboard";

const EMPTY_STATS: RecruitmentDashboardStats = {
  totalJobs: 0,
  activeJobs: 0,
  draftJobs: 0,
  closedJobs: 0,
  totalCandidates: 0,
  shortlisted: 0,
  interviewScheduled: 0,
  selected: 0,
  rejected: 0,
  offersSent: 0,
  offersAccepted: 0,
  timeToHireDays: 0,
};

export function useRecruitmentDashboard() {
  const dispatch = useAppDispatch();
  const { jobs, candidates, interviews, offers, loading, error } = useAppSelector(
    (state) => state.recruitment,
  );

  useEffect(() => {
    dispatch(fetchRecruitmentData());
  }, [dispatch]);

  const refetch = useCallback(() => {
    dispatch(fetchRecruitmentData());
  }, [dispatch]);

  const dashboard = useMemo(() => {
    if (loading && jobs.length === 0 && candidates.length === 0) {
      return {
        stats: EMPTY_STATS,
        funnel: [] as FunnelPoint[],
        byDept: [] as DepartmentHiringPoint[],
        monthlyHires: [] as HiringTrendPoint[],
        recent: [] as RecentActivityItem[],
      };
    }

    return {
      stats: computeDashboardStats(jobs, candidates, interviews, offers),
      funnel: buildFunnelData(candidates),
      byDept: buildDepartmentHiringData(jobs),
      monthlyHires: buildHiringTrendData(candidates, offers),
      recent: buildRecentActivity(candidates),
    };
  }, [jobs, candidates, interviews, offers, loading]);

  return {
    ...dashboard,
    isLoading: loading,
    isError: !!error,
    error,
    refetch,
  };
}
