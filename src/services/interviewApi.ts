import { apiInstance } from "@/api";
import type { Interview, Interviewer, InterviewMode, InterviewRecommendation } from "@/features/admin/recruitment/types";

export interface InterviewListParams {
  status?: string;
  from?: string;
  to?: string;
  job_id?: string;
  candidate_id?: string;
  interviewer_id?: string;
  page?: number;
  limit?: number;
}

export interface InterviewListResponse {
  items: Record<string, unknown>[];
  total: number;
  page: number;
  limit: number;
}

export interface ScheduleInterviewPayload {
  interviewer_id: string;
  scheduled_at: string;
  duration_minutes: number;
  mode: InterviewMode;
  meeting_url?: string;
  office_address?: string;
  timezone?: string;
}

export interface RescheduleInterviewPayload {
  scheduled_at: string;
  duration_minutes?: number;
  reason?: string;
}

export interface CancelInterviewPayload {
  reason: string;
}

export interface RoundFeedbackPayload {
  feedback: string;
  score: number; // 1-5
  interviewer_name?: string;
}

export const interviewApi = {
  getInterviews: async (params?: InterviewListParams): Promise<InterviewListResponse | Record<string, unknown>[]> => {
    const res = await apiInstance.get("/interviews", { params });
    return res.data;
  },

  getInterviewers: async (): Promise<Interviewer[]> => {
    const res = await apiInstance.get("/interviews/interviewers");
    const data = res.data;
    if (Array.isArray(data)) {
      return data;
    }
    if (data && Array.isArray(data.items)) {
      return data.items;
    }
    return [];
  },

  sendInterviewInvite: async (applicationId: string, roundNames?: string): Promise<unknown> => {
    const res = await apiInstance.post(`/applications/${applicationId}/send-interview`, null, {
      params: roundNames ? { round_names: roundNames } : undefined,
    });
    return res.data;
  },

  scheduleRound: async (
    interviewId: string,
    roundId: string,
    payload: ScheduleInterviewPayload,
  ): Promise<unknown> => {
    const res = await apiInstance.post(`/interviews/${interviewId}/rounds/${roundId}/schedule`, payload);
    return res.data;
  },

  rescheduleSchedule: async (
    scheduleId: string,
    payload: RescheduleInterviewPayload,
  ): Promise<unknown> => {
    const res = await apiInstance.patch(`/interviews/schedules/${scheduleId}/reschedule`, payload);
    return res.data;
  },

  cancelSchedule: async (
    scheduleId: string,
    payload: CancelInterviewPayload,
  ): Promise<unknown> => {
    const res = await apiInstance.post(`/interviews/schedules/${scheduleId}/cancel`, payload);
    return res.data;
  },

  sendReminder: async (scheduleId: string): Promise<unknown> => {
    const res = await apiInstance.post(`/interviews/schedules/${scheduleId}/reminder`);
    return res.data;
  },

  markNoShow: async (scheduleId: string): Promise<unknown> => {
    const res = await apiInstance.patch(`/interviews/schedules/${scheduleId}/no-show`);
    return res.data;
  },

  submitRoundFeedback: async (
    roundId: string,
    action: "pass" | "reject" | "hold" | InterviewRecommendation,
    payload: RoundFeedbackPayload,
  ): Promise<unknown> => {
    const decision = action.toLowerCase();
    const res = await apiInstance.patch(`/interviews/rounds/${roundId}/${decision}`, payload);
    return res.data;
  },
};

export default interviewApi;
