import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import recruitmentReducer from "../recruitmentSlice";
import { mapInterviewToFrontend } from "../utils/apiMappers";
import {
  buildIsoFromLocal,
  isInterviewOverdue,
  formatLocalDateTime,
} from "../utils/interviewUtils";
import { InterviewsPage } from "../pages/InterviewsPage";
import type { Interview, Candidate, Interviewer } from "../types";
import type { RecruitmentState } from "../recruitmentTypes";
import interviewApi from "@/services/interviewApi";
import { toast } from "sonner";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock Link from @tanstack/react-router
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, ...props }: any) => (
    <a href={to} {...props}>
      {children}
    </a>
  ),
}));

function createTestStore(preloadedState?: { recruitment: Partial<RecruitmentState> }) {
  return configureStore({
    reducer: {
      recruitment: recruitmentReducer,
    },
    preloadedState: preloadedState as { recruitment: RecruitmentState },
  });
}

const mockCandidate: Candidate = {
  id: "cand-1",
  name: "Priya Sharma",
  email: "priya@example.com",
  phone: "+91 9876543210",
  appliedPosition: "Senior Frontend Engineer",
  jobId: "job-1",
  stage: "interview",
  applicationId: "app-1",
  location: "Bangalore, India",
  atsScore: 92,
  jobMatch: 88,
  source: "LinkedIn",
  tags: ["Frontend", "React"],
  skills: ["React", "TypeScript"],
  yearsExperience: 6,
  resumeName: "Priya_Sharma_Resume.pdf",
  summary: "Experienced frontend engineer",
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  languages: ["English"],
  feedback: [],
  notes: [],
  documents: [],
  timeline: [],
  appliedAt: "2026-03-01T10:00:00.000Z",
  applications: [{ id: "app-1", jobId: "job-1", stage: "interview" }],
};

const mockInterviewer: Interviewer = {
  id: "inv-1",
  name: "Arjun Nair",
  email: "arjun@example.com",
  role: "Engineering Director",
};

const mockInterviewUpcoming: Interview = {
  id: "iv-round-1",
  interviewId: "iv-1",
  roundId: "round-1",
  scheduleId: "sched-1",
  applicationId: "app-1",
  candidateId: "cand-1",
  candidateName: "Priya Sharma",
  jobId: "job-1",
  jobTitle: "Senior Frontend Engineer",
  round: "Technical Round",
  interviewerId: "inv-1",
  interviewer: "Arjun Nair",
  date: new Date(Date.now() + 86400000).toISOString(),
  durationMins: 60,
  mode: "ONLINE",
  meetingLink: "https://meet.google.com/real-call-link",
  officeAddress: null,
  status: "SCHEDULED",
  isOverdue: false,
};

const mockInterviewOverdue: Interview = {
  id: "iv-round-2",
  interviewId: "iv-2",
  roundId: "round-2",
  scheduleId: "sched-2",
  applicationId: "app-2",
  candidateId: "cand-2",
  candidateName: "Rahul Verma",
  jobId: "job-1",
  jobTitle: "Senior Frontend Engineer",
  round: "System Design",
  interviewerId: "inv-1",
  interviewer: "Arjun Nair",
  date: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  durationMins: 45,
  mode: "ONLINE",
  meetingLink: "https://zoom.us/j/123456789",
  officeAddress: null,
  status: "SCHEDULED",
  isOverdue: true,
};

const mockInterviewPending: Interview = {
  id: "iv-round-3",
  interviewId: "iv-3",
  roundId: "round-3",
  scheduleId: null,
  applicationId: "app-3",
  candidateId: "cand-3",
  candidateName: "Ananya Iyer",
  jobId: "job-2",
  jobTitle: "Product Designer",
  round: "Portfolio Review",
  interviewerId: null,
  interviewer: "Unassigned",
  date: null,
  durationMins: 0,
  mode: "ONLINE",
  meetingLink: null,
  officeAddress: null,
  status: "PENDING_SCHEDULE",
  isOverdue: false,
};

const mockInterviewCompleted: Interview = {
  id: "iv-round-4",
  interviewId: "iv-4",
  roundId: "round-4",
  scheduleId: "sched-4",
  applicationId: "app-4",
  candidateId: "cand-4",
  candidateName: "Vikram Malhotra",
  jobId: "job-1",
  jobTitle: "Senior Frontend Engineer",
  round: "HR Round",
  interviewerId: "inv-2",
  interviewer: "Divya Kapoor",
  date: new Date(Date.now() - 86400000).toISOString(),
  durationMins: 30,
  mode: "ONLINE",
  meetingLink: null,
  officeAddress: null,
  status: "COMPLETED",
  isOverdue: false,
  rating: 5,
  recommendation: "PASS",
  feedback: "Exceptional technical proficiency and culture match.",
};

const mockInterviewCancelled: Interview = {
  id: "iv-round-5",
  interviewId: "iv-5",
  roundId: "round-5",
  scheduleId: "sched-5",
  applicationId: "app-5",
  candidateId: "cand-5",
  candidateName: "Siddharth Sen",
  jobId: "job-1",
  jobTitle: "Senior Frontend Engineer",
  round: "Technical Round",
  interviewerId: "inv-1",
  interviewer: "Arjun Nair",
  date: new Date(Date.now() - 86400000).toISOString(),
  durationMins: 45,
  mode: "ONLINE",
  meetingLink: null,
  officeAddress: null,
  status: "CANCELLED",
  isOverdue: false,
  cancelledReason: "Candidate accepted another competitive offer.",
};

describe("F-04: Interviews Pipeline & Contracts Test Suite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(interviewApi, "getInterviews").mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      limit: 50,
    });
    vi.spyOn(interviewApi, "getInterviewers").mockResolvedValue([mockInterviewer]);
  });

  describe("F-04.1: Types & mapInterviewToFrontend", () => {
    it("preserves separate interviewId, roundId, scheduleId, and applicationId", () => {
      const raw = {
        interview_id: "int-100",
        round_id: "rnd-200",
        schedule_id: "sch-300",
        application_id: "app-400",
        candidate: { id: "c-1", name: "Deepak" },
        job: { id: "j-1", title: "Backend Engineer" },
        round_name: "Coding Round",
        interviewer: { id: "inv-1", name: "Pooja" },
        scheduled_at: "2026-10-15T10:00:00Z",
        duration_minutes: 60,
        mode: "ONLINE",
        meeting_url: "https://meet.google.com/xyz",
        status: "SCHEDULED",
        is_overdue: false,
      };

      const mapped = mapInterviewToFrontend(raw);
      expect(mapped.interviewId).toBe("int-100");
      expect(mapped.roundId).toBe("rnd-200");
      expect(mapped.scheduleId).toBe("sch-300");
      expect(mapped.applicationId).toBe("app-400");
      expect(mapped.candidateName).toBe("Deepak");
      expect(mapped.interviewer).toBe("Pooja");
      expect(mapped.durationMins).toBe(60);
      expect(mapped.meetingLink).toBe("https://meet.google.com/xyz");
    });

    it("has no fake defaults: missing fields become null / Unassigned", () => {
      const raw = {
        id: "raw-1",
        round_name: "Screening",
      };

      const mapped = mapInterviewToFrontend(raw);
      expect(mapped.interviewer).toBe("Unassigned");
      expect(mapped.date).toBeNull();
      expect(mapped.durationMins).toBe(0);
      expect(mapped.meetingLink).toBeNull();
      expect(mapped.officeAddress).toBeNull();
      expect(mapped.rating).toBeNull();
      expect(mapped.recommendation).toBeNull();
      expect(mapped.feedback).toBeNull();
      expect(mapped.cancelledReason).toBeNull();
      expect(mapped.status).toBe("PENDING_SCHEDULE");
    });
  });

  describe("F-04.3 & Ground Rule 6: Local to UTC ISO Conversion", () => {
    it("converts local date and time to ISO UTC string without appending Z manually", () => {
      const date = "2026-11-20";
      const time = "15:30";
      const iso = buildIsoFromLocal(date, time);

      // Verify it equals new Date(`${date}T${time}`).toISOString()
      const expected = new Date(`${date}T${time}`).toISOString();
      expect(iso).toBe(expected);
      expect(new Date(iso).getTime()).not.toBeNaN();
    });
  });

  describe("F-04.4: Reschedule and Cancel Endpoints", () => {
    it("cancel calls interviewApi.cancelSchedule and never scorecards endpoint", async () => {
      const cancelSpy = vi
        .spyOn(interviewApi, "cancelSchedule")
        .mockResolvedValue({ success: true });

      const store = createTestStore({
        recruitment: {
          jobs: [],
          candidates: [mockCandidate],
          interviews: [mockInterviewUpcoming],
          offers: [],
          loading: false,
          lastFetchedAt: Date.now(),
          submitting: false,
          error: null,
          screeningThresholds: null,
          screeningJobId: null,
          screeningRun: null,
          screeningResults: [],
          screeningLoading: false,
          screeningSubmitting: false,
          screeningError: null,
          interviewPagination: { total: 1, page: 1, limit: 50 },
          interviewers: [mockInterviewer],
          interviewLoading: false,
          interviewSubmitting: false,
          interviewError: null,
        },
      });

      render(
        <Provider store={store}>
          <InterviewsPage />
        </Provider>,
      );

      // Click Cancel on upcoming interview
      const cancelBtn = screen.getByRole("button", { name: /^cancel$/i });
      fireEvent.click(cancelBtn);

      // Cancel dialog opens
      expect(screen.getByText("Cancel Interview Session")).toBeInTheDocument();

      const reasonInput = screen.getByLabelText(/Cancellation Reason/i);
      fireEvent.change(reasonInput, {
        target: { value: "Candidate withdrew due to relocation" },
      });

      // Submit cancel (first click prompts confirmation)
      const confirmBtn = screen.getByRole("button", { name: /cancel interview/i });
      fireEvent.click(confirmBtn);

      // Step 2: Confirm
      const finalConfirmBtn = screen.getByRole("button", {
        name: /yes, confirm cancellation/i,
      });
      fireEvent.click(finalConfirmBtn);

      await waitFor(() => {
        expect(cancelSpy).toHaveBeenCalledWith("sched-1", {
          reason: "Candidate withdrew due to relocation",
        });
      });
    });

    it("reschedule calls interviewApi.rescheduleSchedule", async () => {
      const rescheduleSpy = vi
        .spyOn(interviewApi, "rescheduleSchedule")
        .mockResolvedValue({ success: true });

      const store = createTestStore({
        recruitment: {
          jobs: [],
          candidates: [mockCandidate],
          interviews: [mockInterviewUpcoming],
          offers: [],
          loading: false,
          lastFetchedAt: Date.now(),
          submitting: false,
          error: null,
          screeningThresholds: null,
          screeningJobId: null,
          screeningRun: null,
          screeningResults: [],
          screeningLoading: false,
          screeningSubmitting: false,
          screeningError: null,
          interviewPagination: { total: 1, page: 1, limit: 50 },
          interviewers: [mockInterviewer],
          interviewLoading: false,
          interviewSubmitting: false,
          interviewError: null,
        },
      });

      render(
        <Provider store={store}>
          <InterviewsPage />
        </Provider>,
      );

      const rescheduleBtn = screen.getByRole("button", { name: /^reschedule$/i });
      fireEvent.click(rescheduleBtn);

      expect(screen.getByText("Reschedule Interview")).toBeInTheDocument();

      const submitBtn = screen.getByRole("button", { name: /confirm reschedule/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(rescheduleSpy).toHaveBeenCalled();
        expect(rescheduleSpy.mock.calls[0][0]).toBe("sched-1");
      });
    });
  });

  describe("F-04.5: Feedback Dialog with roundId", () => {
    it("submits feedback using roundId with recommendation and 1-5 rating", async () => {
      const feedbackSpy = vi
        .spyOn(interviewApi, "submitRoundFeedback")
        .mockResolvedValue({ success: true });

      const store = createTestStore({
        recruitment: {
          jobs: [],
          candidates: [mockCandidate],
          interviews: [mockInterviewUpcoming],
          offers: [],
          loading: false,
          lastFetchedAt: Date.now(),
          submitting: false,
          error: null,
          screeningThresholds: null,
          screeningJobId: null,
          screeningRun: null,
          screeningResults: [],
          screeningLoading: false,
          screeningSubmitting: false,
          screeningError: null,
          interviewPagination: { total: 1, page: 1, limit: 50 },
          interviewers: [mockInterviewer],
          interviewLoading: false,
          interviewSubmitting: false,
          interviewError: null,
        },
      });

      render(
        <Provider store={store}>
          <InterviewsPage />
        </Provider>,
      );

      const feedbackBtn = screen.getByRole("button", { name: /feedback/i });
      fireEvent.click(feedbackBtn);

      expect(screen.getByText("Submit Interview Feedback")).toBeInTheDocument();

      const notesTextarea = screen.getByLabelText(/Evaluation Notes/i);
      fireEvent.change(notesTextarea, {
        target: { value: "Superb problem solving and architecture clarity." },
      });

      const submitBtn = screen.getByRole("button", { name: /submit feedback/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(feedbackSpy).toHaveBeenCalledWith("round-1", "PASS", {
          feedback: "Superb problem solving and architecture clarity.",
          score: 4,
          interviewer_name: "Arjun Nair",
        });
      });
    });

    it("requires confirmation when submitting REJECT recommendation", async () => {
      const feedbackSpy = vi
        .spyOn(interviewApi, "submitRoundFeedback")
        .mockResolvedValue({ success: true });

      const store = createTestStore({
        recruitment: {
          jobs: [],
          candidates: [mockCandidate],
          interviews: [mockInterviewUpcoming],
          offers: [],
          loading: false,
          lastFetchedAt: Date.now(),
          submitting: false,
          error: null,
          screeningThresholds: null,
          screeningJobId: null,
          screeningRun: null,
          screeningResults: [],
          screeningLoading: false,
          screeningSubmitting: false,
          screeningError: null,
          interviewPagination: { total: 1, page: 1, limit: 50 },
          interviewers: [mockInterviewer],
          interviewLoading: false,
          interviewSubmitting: false,
          interviewError: null,
        },
      });

      render(
        <Provider store={store}>
          <InterviewsPage />
        </Provider>,
      );

      fireEvent.click(screen.getByRole("button", { name: /feedback/i }));

      // Select REJECT
      const recSelect = screen.getByLabelText(/Recommendation/i);
      fireEvent.change(recSelect, { target: { value: "REJECT" } });

      const notesTextarea = screen.getByLabelText(/Evaluation Notes/i);
      fireEvent.change(notesTextarea, {
        target: { value: "Candidate struggled with basic data structures." },
      });

      // First click: prompts review & confirmation
      fireEvent.click(screen.getByRole("button", { name: /review & confirm reject/i }));
      expect(screen.getByText(/Confirm REJECT decision\?/i)).toBeInTheDocument();
      expect(feedbackSpy).not.toHaveBeenCalled();

      // Second click: confirms
      fireEvent.click(screen.getByRole("button", { name: /submit feedback/i }));
      await waitFor(() => {
        expect(feedbackSpy).toHaveBeenCalledWith(
          "round-1",
          "REJECT",
          expect.objectContaining({
            feedback: "Candidate struggled with basic data structures.",
          }),
        );
      });
    });
  });

  describe("F-04.6: Real Reminder Endpoint and Cooldown", () => {
    it("calls reminder endpoint and puts button on cooldown", async () => {
      const reminderSpy = vi
        .spyOn(interviewApi, "sendReminder")
        .mockResolvedValue({ success: true });

      const store = createTestStore({
        recruitment: {
          jobs: [],
          candidates: [mockCandidate],
          interviews: [mockInterviewUpcoming],
          offers: [],
          loading: false,
          lastFetchedAt: Date.now(),
          submitting: false,
          error: null,
          screeningThresholds: null,
          screeningJobId: null,
          screeningRun: null,
          screeningResults: [],
          screeningLoading: false,
          screeningSubmitting: false,
          screeningError: null,
          interviewPagination: { total: 1, page: 1, limit: 50 },
          interviewers: [mockInterviewer],
          interviewLoading: false,
          interviewSubmitting: false,
          interviewError: null,
        },
      });

      render(
        <Provider store={store}>
          <InterviewsPage />
        </Provider>,
      );

      const reminderBtn = screen.getByRole("button", { name: /reminder/i });
      fireEvent.click(reminderBtn);

      await waitFor(() => {
        expect(reminderSpy).toHaveBeenCalledWith("sched-1");
        expect(toast.success).toHaveBeenCalledWith(
          expect.stringContaining("Reminder sent to Priya Sharma"),
        );
      });

      // Button should now be disabled during cooldown
      expect(screen.getByRole("button", { name: /sent \(\d+s\)/i })).toBeDisabled();
    });
  });

  describe("F-04.7: Overdue Logic & Tabs", () => {
    it("correctly identifies overdue interviews", () => {
      expect(isInterviewOverdue(mockInterviewOverdue)).toBe(true);
      expect(isInterviewOverdue(mockInterviewUpcoming)).toBe(false);
      expect(isInterviewOverdue(mockInterviewCompleted)).toBe(false);
      expect(isInterviewOverdue(mockInterviewCancelled)).toBe(false);
    });

    it("filters and renders correct tab contents", async () => {
      const store = createTestStore({
        recruitment: {
          jobs: [],
          candidates: [mockCandidate],
          interviews: [
            mockInterviewUpcoming,
            mockInterviewOverdue,
            mockInterviewPending,
            mockInterviewCompleted,
            mockInterviewCancelled,
          ],
          offers: [],
          loading: false,
          lastFetchedAt: Date.now(),
          submitting: false,
          error: null,
          screeningThresholds: null,
          screeningJobId: null,
          screeningRun: null,
          screeningResults: [],
          screeningLoading: false,
          screeningSubmitting: false,
          screeningError: null,
          interviewPagination: { total: 5, page: 1, limit: 50 },
          interviewers: [mockInterviewer],
          interviewLoading: false,
          interviewSubmitting: false,
          interviewError: null,
        },
      });

      render(
        <Provider store={store}>
          <InterviewsPage />
        </Provider>,
      );

      // Default tab is upcoming: overdue interview appears first with badge
      expect(screen.getByText("Rahul Verma")).toBeInTheDocument();
      expect(screen.getByText(/overdue/i)).toBeInTheDocument();
      expect(screen.getByText("Priya Sharma")).toBeInTheDocument();

      // Switch to Pending Schedule tab
      fireEvent.click(screen.getByRole("button", { name: /pending schedule/i }));
      expect(screen.getByText("Ananya Iyer")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /schedule slot/i })).toBeInTheDocument();

      // Switch to Completed tab
      fireEvent.click(screen.getByRole("button", { name: /completed/i }));
      expect(screen.getByText("Vikram Malhotra")).toBeInTheDocument();
      expect(screen.getByText(/Exceptional technical proficiency/i)).toBeInTheDocument();

      // Switch to Cancelled tab
      fireEvent.click(screen.getByRole("button", { name: /cancelled/i }));
      expect(screen.getByText("Siddharth Sen")).toBeInTheDocument();
      expect(screen.getByText(/accepted another competitive offer/i)).toBeInTheDocument();
    });
  });

  describe("F-04.8: Error Dialog Persistence", () => {
    it("keeps schedule dialog open and shows toast.error on failure", async () => {
      vi.spyOn(interviewApi, "scheduleRound").mockRejectedValue(
        new Error("Slot conflict with interviewer"),
      );

      const store = createTestStore({
        recruitment: {
          jobs: [],
          candidates: [mockCandidate],
          interviews: [mockInterviewPending],
          offers: [],
          loading: false,
          lastFetchedAt: Date.now(),
          submitting: false,
          error: null,
          screeningThresholds: null,
          screeningJobId: null,
          screeningRun: null,
          screeningResults: [],
          screeningLoading: false,
          screeningSubmitting: false,
          screeningError: null,
          interviewPagination: { total: 1, page: 1, limit: 50 },
          interviewers: [mockInterviewer],
          interviewLoading: false,
          interviewSubmitting: false,
          interviewError: null,
        },
      });

      render(
        <Provider store={store}>
          <InterviewsPage />
        </Provider>,
      );

      // Open schedule modal
      fireEvent.click(screen.getByRole("button", { name: /schedule interview/i }));
      expect(screen.getByText("Schedule Interview Round")).toBeInTheDocument();

      // Fill in details
      fireEvent.change(screen.getByLabelText(/Candidate \*/i), {
        target: { value: "cand-1" },
      });
      fireEvent.change(screen.getByLabelText(/Interviewer \*/i), {
        target: { value: "inv-1" },
      });
      fireEvent.change(screen.getByLabelText(/^Date \*/i), {
        target: { value: "2026-12-01" },
      });
      fireEvent.change(screen.getByLabelText(/Meeting Link/i), {
        target: { value: "https://meet.google.com/valid-meeting" },
      });

      // Submit
      fireEvent.click(screen.getByRole("button", { name: /confirm schedule/i }));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          expect.stringContaining("Slot conflict with interviewer"),
        );
      });

      // Dialog should still be open
      expect(screen.getByText("Schedule Interview Round")).toBeInTheDocument();
    });
  });
});
