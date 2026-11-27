import apiInstance from "@/api/apiInstance";
import { RECRUITMENT_ENDPOINTS } from "@/api/endpoints";
import { extractItems } from "@/features/admin/recruitment/utils/apiMappers";
import type {
  InterviewMode,
  InterviewRecommendation,
  InterviewStatus,
  Interviewer,
} from "@/features/admin/recruitment/types";

export interface InterviewListParams {
  page?: number;
  limit?: number;
  status?: InterviewStatus | "ALL";
  date?: string;
  search?: string;
  job_id?: string;
}

export interface ScheduleInterviewPayload {
  interviewer_id: string;
  scheduled_at: string;
  duration_minutes: number;
  mode: InterviewMode;
  meeting_url?: string;
  location?: string;
  round_name?: string;
  notes?: string;
}

export interface RescheduleInterviewPayload {
  scheduled_at: string;
  duration_minutes?: number;
  mode?: InterviewMode;
  meeting_url?: string;
  location?: string;
  interviewer_id?: string;
  reason?: string;
}

export interface CancelInterviewPayload {
  reason: string;
}

export interface RoundFeedbackPayload {
  recommendation: InterviewRecommendation;
  rating: number;
  feedback: string;
}

function createUnsupportedInterviewError(actionLabel: string): Error & {
  status: number;
  isBackendBlocker: boolean;
} {
  const err = new Error(
    `${actionLabel} is unavailable because the backend OpenAPI specification does not expose this endpoint.`,
  ) as Error & { status: number; isBackendBlocker: boolean };
  err.status = 501;
  err.isBackendBlocker = true;
  return err;
}

export const interviewApi = {
  getInterviews: async (params?: InterviewListParams) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.INTERVIEWS, { params });
    const raw = res.data?.data ?? res.data;
    if (raw && !Array.isArray(raw) && Array.isArray(raw.items)) {
      return raw;
    }
    return {
      items: Array.isArray(raw) ? raw : extractItems(raw),
      total: Array.isArray(raw) ? raw.length : 0,
      page: params?.page || 1,
      limit: params?.limit || 50,
    };
  },

  getInterviewById: async (id: string) => {
    const res = await apiInstance.get(RECRUITMENT_ENDPOINTS.INTERVIEW_BY_ID(id));
    return res.data?.data ?? res.data;
  },

  /**
   * Loads active company employees as selectable interviewers via `/api/v1/employees`
   * (`/interviews/interviewers` is absent from OpenAPI).
   */
  getInterviewers: async (): Promise<Interviewer[]> => {
    const res = await apiInstance.get("/employees", { params: { limit: 100 } });
    const rawItems = extractItems(res.data);
    return rawItems
      .map((emp): Interviewer | null => {
        const id = String(emp.id ?? emp.user_id ?? "");
        const fullName =
          `${emp.first_name ?? ""} ${emp.last_name ?? ""}`.trim() ||
          String(emp.full_name ?? emp.name ?? emp.email ?? "").trim();
        if (!id || !fullName) return null;
        return {
          id,
          name: fullName,
          email: emp.email ? String(emp.email) : undefined,
          role: emp.designation ? String(emp.designation) : emp.role ? String(emp.role) : undefined,
          department: emp.department ? String(emp.department) : undefined,
        };
      })
      .filter((item): item is Interviewer => item !== null);
  },

  /**
   * Schedule interview slot (`POST /api/v1/interviews/{id}/schedule`).
   */
  scheduleRound: async (
    interviewId: string,
    roundId: string,
    payload: ScheduleInterviewPayload,
  ) => {
    const res = await apiInstance.post(
      RECRUITMENT_ENDPOINTS.INTERVIEW_SCHEDULE(interviewId),
      {
        round_id: roundId,
        ...payload,
      },
    );
    return res.data?.data ?? res.data;
  },

  rescheduleSchedule: async (
    _scheduleId: string,
    _payload: RescheduleInterviewPayload,
  ) => {
    throw createUnsupportedInterviewError("Rescheduling interview slot");
  },

  cancelSchedule: async (_scheduleId: string, _payload: CancelInterviewPayload) => {
    throw createUnsupportedInterviewError("Cancelling interview schedule");
  },

  sendReminder: async (_scheduleId: string) => {
    throw createUnsupportedInterviewError("Sending interview reminder");
  },

  markNoShow: async (_scheduleId: string) => {
    throw createUnsupportedInterviewError("Marking interview as no-show");
  },

  /**
   * Submit round outcome (`PATCH /api/v1/interviews/rounds/{round_id}/pass|reject|hold`).
   */
  submitRoundFeedback: async (
    roundId: string,
    action: "PASS" | "REJECT" | "HOLD",
    payload: RoundFeedbackPayload,
  ) => {
    const endpoint =
      action === "PASS"
        ? RECRUITMENT_ENDPOINTS.INTERVIEW_ROUND_PASS(roundId)
        : action === "REJECT"
          ? RECRUITMENT_ENDPOINTS.INTERVIEW_ROUND_REJECT(roundId)
          : RECRUITMENT_ENDPOINTS.INTERVIEW_ROUND_HOLD(roundId);
    const res = await apiInstance.patch(endpoint, payload);
    return res.data?.data ?? res.data;
  },

  /**
   * Send interview scheduling/invite notification (`POST /api/v1/applications/{id}/send-interview`).
   */
  sendInterviewInvite: async (applicationId: string, roundNames?: string) => {
    const res = await apiInstance.post(
      RECRUITMENT_ENDPOINTS.APPLICATION_SEND_INTERVIEW(applicationId),
      {
        application_id: applicationId,
        round_names: roundNames || "Technical Screening",
      },
    );
    return res.data?.data ?? res.data;
  },

  submitScorecard: async (interviewId: string, scorecard: Record<string, unknown>) => {
    const res = await apiInstance.post(RECRUITMENT_ENDPOINTS.SCORECARD_SUBMISSIONS, {
      interview_id: interviewId,
      ...scorecard,
    });
    return res.data?.data ?? res.data;
  },
};

export default interviewApi;
