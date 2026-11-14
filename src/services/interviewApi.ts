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

let interviewsState: Record<string, any>[] = [
  {
    id: "int-1",
    interview_id: "int-1",
    round_id: "rnd-1",
    schedule_id: "sch-1",
    application_id: "app-1",
    candidate_id: "cand-1",
    candidate: {
      id: "cand-1",
      first_name: "Aarav",
      last_name: "Sharma",
      name: "Aarav Sharma",
      email: "aarav.sharma@gmail.com",
    },
    job_id: "job-1",
    job: {
      id: "job-1",
      title: "Senior Staff AI Engineer",
    },
    round_name: "System Architecture & LLM Round",
    interviewer: {
      id: "emp-3",
      name: "Marcus Sterling",
      email: "marcus.s@aurix.ai",
    },
    scheduled_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 60,
    timezone: "Asia/Kolkata",
    mode: "ONLINE",
    meeting_url: "https://meet.ofc360.com/int-aarav-sharma",
    status: "SCHEDULED",
    is_overdue: false,
    rating: 4.8,
    recommendation: "PASS",
    feedback: "Strong understanding of distributed inference and tensor parallelism.",
  },
  {
    id: "int-2",
    interview_id: "int-2",
    round_id: "rnd-2",
    schedule_id: "sch-2",
    application_id: "app-3",
    candidate_id: "cand-3",
    candidate: {
      id: "cand-3",
      first_name: "Rohan",
      last_name: "Deshmukh",
      name: "Rohan Deshmukh",
      email: "rohan.design@gmail.com",
    },
    job_id: "job-3",
    job: {
      id: "job-3",
      title: "Senior Product Designer",
    },
    round_name: "Portfolio & Design Systems Critique",
    interviewer: {
      id: "emp-2",
      name: "Sarah Chen",
      email: "sarah.chen@aurix.ai",
    },
    scheduled_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    duration_minutes: 45,
    timezone: "Asia/Kolkata",
    mode: "ONLINE",
    meeting_url: "https://meet.ofc360.com/int-rohan-deshmukh",
    status: "SCHEDULED",
    is_overdue: false,
    rating: null,
    recommendation: null,
    feedback: null,
  },
];

const INITIAL_INTERVIEWERS: Interviewer[] = [
  { id: "emp-1", name: "Alex Vance", email: "alex.vance@aurix.ai", role: "VP of Engineering" },
  { id: "emp-2", name: "Sarah Chen", email: "sarah.chen@aurix.ai", role: "Head of Product" },
  { id: "emp-3", name: "Marcus Sterling", email: "marcus.s@aurix.ai", role: "Principal AI Scientist" },
  { id: "emp-4", name: "Elena Rostova", email: "elena.r@aurix.ai", role: "People Operations Lead" },
];

export const interviewApi = {
  getInterviews: async (params?: InterviewListParams) => {
    return {
      items: interviewsState,
      total: interviewsState.length,
      page: params?.page || 1,
      limit: params?.limit || 50,
    };
  },

  getInterviewers: async (): Promise<Interviewer[]> => {
    return INITIAL_INTERVIEWERS;
  },

  scheduleRound: async (
    interviewId: string,
    roundId: string,
    payload: ScheduleInterviewPayload,
  ) => {
    const interviewer =
      INITIAL_INTERVIEWERS.find((i) => i.id === payload.interviewer_id) ||
      INITIAL_INTERVIEWERS[0];

    let found = false;
    interviewsState = interviewsState.map((iv) => {
      if (iv.interview_id === interviewId || iv.round_id === roundId || iv.id === interviewId) {
        found = true;
        return {
          ...iv,
          schedule_id: iv.schedule_id || `sch-${Date.now()}`,
          interviewer,
          scheduled_at: payload.scheduled_at,
          duration_minutes: payload.duration_minutes,
          timezone: payload.timezone || "Asia/Kolkata",
          mode: payload.mode,
          meeting_url: payload.meeting_url || "https://meet.ofc360.com/interview-room",
          office_address: payload.office_address || null,
          status: "SCHEDULED",
          notes: payload.notes || iv.notes,
        };
      }
      return iv;
    });

    if (!found) {
      const created = {
        id: interviewId || `int-${Date.now()}`,
        interview_id: interviewId || `int-${Date.now()}`,
        round_id: roundId || `rnd-${Date.now()}`,
        schedule_id: `sch-${Date.now()}`,
        application_id: "app-1",
        candidate_id: "cand-1",
        candidate: {
          id: "cand-1",
          name: "Aarav Sharma",
          email: "aarav.sharma@gmail.com",
        },
        job_id: "job-1",
        job: { id: "job-1", title: "Senior Staff AI Engineer" },
        round_name: "Technical Round",
        interviewer,
        scheduled_at: payload.scheduled_at,
        duration_minutes: payload.duration_minutes,
        timezone: payload.timezone || "Asia/Kolkata",
        mode: payload.mode,
        meeting_url: payload.meeting_url || "https://meet.ofc360.com/interview-room",
        office_address: payload.office_address || null,
        status: "SCHEDULED",
      };
      interviewsState = [created, ...interviewsState];
    }

    return { success: true };
  },

  rescheduleSchedule: async (scheduleId: string, payload: RescheduleInterviewPayload) => {
    interviewsState = interviewsState.map((iv) =>
      iv.schedule_id === scheduleId || iv.id === scheduleId
        ? {
            ...iv,
            scheduled_at: payload.scheduled_at,
            duration_minutes: payload.duration_minutes ?? iv.duration_minutes,
            mode: payload.mode ?? iv.mode,
            meeting_url: payload.meeting_url ?? iv.meeting_url,
            office_address: payload.office_address ?? iv.office_address,
            status: "SCHEDULED",
          }
        : iv,
    );
    return { success: true };
  },

  cancelSchedule: async (scheduleId: string, payload: CancelInterviewPayload) => {
    interviewsState = interviewsState.map((iv) =>
      iv.schedule_id === scheduleId || iv.id === scheduleId
        ? {
            ...iv,
            status: "CANCELLED",
            cancelled_reason: payload.reason,
          }
        : iv,
    );
    return { success: true };
  },

  sendReminder: async (_scheduleId: string) => {
    return { success: true, message: "Reminder sent successfully" };
  },

  markNoShow: async (scheduleId: string) => {
    interviewsState = interviewsState.map((iv) =>
      iv.schedule_id === scheduleId || iv.id === scheduleId
        ? { ...iv, status: "NO_SHOW" }
        : iv,
    );
    return { success: true };
  },

  submitRoundFeedback: async (
    roundId: string,
    action: string,
    payload: RoundFeedbackPayload,
  ) => {
    const rec = action.toUpperCase();
    interviewsState = interviewsState.map((iv) =>
      iv.round_id === roundId || iv.id === roundId
        ? {
            ...iv,
            status: "COMPLETED",
            rating: payload.rating ?? iv.rating ?? 4.5,
            recommendation:
              rec === "PASS" || rec === "REJECT" || rec === "HOLD"
                ? rec
                : payload.recommendation || "PASS",
            feedback: payload.feedback || payload.notes || iv.feedback,
          }
        : iv,
    );
    return { success: true };
  },

  sendInterviewInvite: async (_applicationId: string, _roundNames?: string) => {
    return { success: true, message: "Interview invitation dispatched" };
  },

  submitScorecard: async (_interviewId: string, _scorecard: any) => {
    return { success: true };
  },
};

export default interviewApi;
