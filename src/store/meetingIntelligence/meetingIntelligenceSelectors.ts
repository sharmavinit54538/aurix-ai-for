import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export const selectMeetingIntelligenceState = (state: RootState) => state.meetingIntelligence;

export const selectMeetingIntelligenceLoading = createSelector(
  [selectMeetingIntelligenceState],
  (state) => state?.loading ?? false,
);

export const selectMeetingIntelligenceError = createSelector(
  [selectMeetingIntelligenceState],
  (state) => state?.error ?? null,
);

export const selectMeetingIntelligenceLastUpdated = createSelector(
  [selectMeetingIntelligenceState],
  (state) => state?.lastUpdated ?? null,
);

export const selectMeetingIntelligenceSummary = createSelector(
  [selectMeetingIntelligenceState],
  (state) => state?.summary ?? null,
);

export const selectMeetingIntelligenceKPIs = createSelector(
  [selectMeetingIntelligenceState],
  (state) => (Array.isArray(state?.kpi) ? state.kpi : []),
);

export const selectMeetingIntelligenceActionItems = createSelector(
  [selectMeetingIntelligenceState],
  (state) => (Array.isArray(state?.actionItems) ? state.actionItems : []),
);

export const selectMeetingIntelligenceCharts = createSelector(
  [selectMeetingIntelligenceState],
  (state) => state?.charts ?? null,
);

export const selectMeetingIntelligenceActionItemsByWeek = createSelector(
  [selectMeetingIntelligenceCharts],
  (charts) => (Array.isArray(charts?.actionItemsByWeek) ? charts.actionItemsByWeek : []),
);

export const selectMeetingIntelligenceVolume = createSelector(
  [selectMeetingIntelligenceCharts],
  (charts) => (Array.isArray(charts?.meetingVolume) ? charts.meetingVolume : []),
);
