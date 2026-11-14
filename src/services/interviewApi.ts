import apiInstance from "@/api/apiInstance";
import type { Interviewer } from "@/features/admin/recruitment/types";

export interface InterviewListParams {
  page?: number;
  limit?: number;
  status?: string;
  job_id?: string;
  search?: string;
}

export interface ScheduleInterviewPayload {
  interviewer_id?: string | null;
  scheduled_at: string;
  duration_minutes: number;
  timezone?: string;
  mode: "ONLINE" | "OFFLINE";
  meeting_url?: string | null;
  office_address?: string | null;
  notes?: string;
}

export interface RescheduleInterviewPayload {
  scheduled_at: string;
  duration_minutes?: number;
  timezone?: string;
  mode?: "ONLINE" | "OFFLINE";
  meeting_url?: string | null;
  office_address?: string | null;
  reason?: string;
}

export interface CancelInterviewPayload {
  reason: string;
}

export interface RoundFeedbackPayload {
  rating?: number;
  recommendation?: "PASS" | "REJECT" | "HOLD" | string;
  feedback?: string;
  notes?: string;
}

export const interviewApi = {
  getInterviews: async (params?: InterviewListParams) => {
    const res = await apiInstance.get("/interviews", { params });
    const payload = res.data?.data ?? res.data;
    const items = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.items)
        ? payload.items
        : [];
    return {
      items,
      total: Number(payload?.total ?? items.length),
      page: Number(payload?.page ?? params?.page ?? 1),
      limit: Number(payload?.limit ?? params?.limit ?? 50),
    };
  },

  getInterviewers: async (): Promise<Interviewer[]> => {
    const res = await apiInstance.get("/interviews/interviewers");
    const payload = res.data?.data ?? res.data;
    return Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.items)
        ? payload.items
        : [];
  },

  scheduleRound: async (
    interviewId: string,
    roundId: string,
    payload: ScheduleInterviewPayload,
  ) => {
    const res = await apiInstance.post(
      `/interviews/${interviewId}/rounds/${roundId}/schedule`,
      payload,
    );
    return res.data?.data ?? res.data ?? { success: true };
  },

  rescheduleSchedule: async (
    scheduleId: string,
    payload: RescheduleInterviewPayload,
  ) => {
    const res = await apiInstance.put(
      `/interviews/schedules/${scheduleId}/reschedule`,
      payload,
    );
    return res.data?.data ?? res.data ?? { success: true };
  },

  cancelSchedule: async (
    scheduleId: string,
    payload: CancelInterviewPayload,
  ) => {
    const res = await apiInstance.post(
      `/interviews/schedules/${scheduleId}/cancel`,
      payload,
    );
    return res.data?.data ?? res.data ?? { success: true };
  },

  sendReminder: async (scheduleId: string) => {
    const res = await apiInstance.post(
      `/interviews/schedules/${scheduleId}/reminder`,
      {},
    );
    return res.data?.data ?? res.data ?? { success: true };
  },

  markNoShow: async (scheduleId: string) => {
    const res = await apiInstance.post(
      `/interviews/schedules/${scheduleId}/no-show`,
      {},
    );
    return res.data?.data ?? res.data ?? { success: true };
  },

  submitRoundFeedback: async (
    roundId: string,
    action: string,
    payload: RoundFeedbackPayload,
  ) => {
    const res = await apiInstance.post(
      `/interviews/rounds/${roundId}/feedback`,
      { ...payload, action },
    );
    return res.data?.data ?? res.data ?? { success: true };
  },

  sendInterviewInvite: async (applicationId: string, roundNames?: string) => {
    const res = await apiInstance.post("/interviews/invite", {
      application_id: applicationId,
      round_names: roundNames,
    });
    return res.data?.data ?? res.data ?? { success: true };
  },

  submitScorecard: async (interviewId: string, scorecard: any) => {
    const res = await apiInstance.post(
      `/interviews/${interviewId}/scorecard`,
      scorecard,
    );
    return res.data?.data ?? res.data ?? { success: true };
  },
};

export default interviewApi;
