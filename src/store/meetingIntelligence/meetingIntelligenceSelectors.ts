import type { RootState } from "@/redux/store";

export const selectMeetingIntelligenceLoading = (state: RootState) => state.meetingIntelligence?.loading ?? false;
export const selectMeetingIntelligenceError = (state: RootState) => state.meetingIntelligence?.error ?? null;
export const selectMeetingIntelligenceKPIs = (state: RootState) => state.meetingIntelligence?.data?.kpis ?? [];
export const selectMeetingIntelligenceSummary = (state: RootState) => state.meetingIntelligence?.data?.summary ?? {};
export const selectMeetingIntelligenceActionItemsByWeek = (state: RootState) => state.meetingIntelligence?.data?.actionItemsByWeek ?? [];
export const selectMeetingIntelligenceVolume = (state: RootState) => state.meetingIntelligence?.data?.volume ?? [];
export const selectMeetingIntelligenceLastUpdated = (state: RootState) => state.meetingIntelligence?.data?.lastUpdated ?? null;
