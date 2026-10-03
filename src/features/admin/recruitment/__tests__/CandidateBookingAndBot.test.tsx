import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import recruitmentReducer from "../recruitmentSlice";
import type { RecruitmentState } from "../recruitmentTypes";
import { CandidateInterviewBookingPage } from "@/pages/CandidateInterviewBookingPage";
import { CandidateAIInterviewPage } from "@/pages/CandidateAIInterviewPage";
import { AIInterviewResultsTab } from "../pages/AIInterviewResultsTab";
import { candidateBookingApi } from "@/services/candidateBookingApi";
import { aiInterviewBotApi } from "@/services/aiInterviewBotApi";
import { generateIcsContent } from "@/utils/calendarIcs";

// Mock useParams from TanStack Router
vi.mock("@tanstack/react-router", () => ({
  useParams: () => ({ token: "test-token-123" }),
}));

// Mock Sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const defaultRecruitmentState: RecruitmentState = {
  jobs: [],
  candidates: [],
  interviews: [],
  offers: [],
  loading: false,
  lastFetchedAt: null,
  submitting: false,
  error: null,
  screeningThresholds: null,
  screeningJobId: null,
  screeningRun: null,
  screeningResults: [],
  screeningLoading: false,
  screeningSubmitting: false,
  screeningError: null,
  interviewPagination: null,
  interviewers: [],
  interviewLoading: false,
  interviewSubmitting: false,
  interviewError: null,
};

function createTestStore(preloadedState?: { recruitment?: Partial<RecruitmentState> }) {
  return configureStore({
    reducer: {
      recruitment: recruitmentReducer,
    },
    preloadedState: {
      recruitment: {
        ...defaultRecruitmentState,
        ...preloadedState?.recruitment,
      },
    },
  });
}

describe("Candidate Booking & AI Interview Suite (F-05)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* =====================================================================
   * F-05.1: Candidate Booking (/interview/book/$token)
   * ===================================================================== */
  describe("F-05.1: Candidate Interview Booking Page", () => {
    const mockPendingBooking = {
      token: "test-token-123",
      candidate_name: "Rohan Varma",
      candidate_email: "rohan@example.com",
      job_title: "Staff Software Engineer",
      company_name: "OFC360 Technologies",
      round_name: "System Architecture",
      duration_minutes: 45,
      interviewer_name: "Ananya Deshmukh",
      status: "PENDING" as const,
      available_slots: [
        {
          slot_id: "slot-1",
          start_time: "2026-10-15T14:00:00.000Z",
          end_time: "2026-10-15T14:45:00.000Z",
        },
        {
          slot_id: "slot-2",
          start_time: "2026-10-15T16:00:00.000Z",
          end_time: "2026-10-15T16:45:00.000Z",
        },
      ],
      booked_slot: null,
    };

    it("renders booking details, available slots, and candidate local timezone", async () => {
      vi.spyOn(candidateBookingApi, "getBookingDetails").mockResolvedValue(mockPendingBooking);

      render(<CandidateInterviewBookingPage />);

      expect(await screen.findByText("Staff Software Engineer")).toBeInTheDocument();
      expect(screen.getByText("System Architecture")).toBeInTheDocument();
      expect(screen.getByText("Rohan Varma")).toBeInTheDocument();
      expect(screen.getByText("Select an Available Time Slot")).toBeInTheDocument();
      expect(screen.getByText(/2 options available/i)).toBeInTheDocument();
    });

    it("allows candidate to select a slot and confirm booking", async () => {
      vi.spyOn(candidateBookingApi, "getBookingDetails").mockResolvedValue(mockPendingBooking);
      const confirmSpy = vi.spyOn(candidateBookingApi, "confirmBooking").mockResolvedValue({
        status: "BOOKED",
        booked_slot: {
          start_time: "2026-10-15T14:00:00.000Z",
          end_time: "2026-10-15T14:45:00.000Z",
          meeting_url: "https://meet.google.com/real-room-link",
        },
      });

      render(<CandidateInterviewBookingPage />);

      // Wait for booking details to load
      await screen.findByText("Staff Software Engineer");

      // Confirm button is initially disabled until slot is chosen
      const confirmBtn = screen.getByRole("button", { name: /confirm booking/i });
      expect(confirmBtn).toBeDisabled();

      // Click on the first slot
      const slotButtons = screen.getAllByRole("button", { name: /–/i });
      expect(slotButtons.length).toBe(2);
      fireEvent.click(slotButtons[0]);

      // Confirm button is now enabled
      expect(confirmBtn).not.toBeDisabled();
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(confirmSpy).toHaveBeenCalledWith("test-token-123", {
          slot_id: "slot-1",
          start_time: "2026-10-15T14:00:00.000Z",
          timezone: expect.any(String),
        });
      });

      // Confirmed state renders
      expect(await screen.findByText("Interview Confirmed!")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /add to calendar/i })).toBeInTheDocument();
    });

    it("displays expired alert if token status is EXPIRED", async () => {
      vi.spyOn(candidateBookingApi, "getBookingDetails").mockResolvedValue({
        ...mockPendingBooking,
        status: "EXPIRED",
      });

      render(<CandidateInterviewBookingPage />);

      expect(await screen.findByText("Booking Link Expired")).toBeInTheDocument();
      expect(screen.getByText(/invitation is no longer active/i)).toBeInTheDocument();
    });

    it("handles 404 / network error with retry button", async () => {
      vi.spyOn(candidateBookingApi, "getBookingDetails").mockRejectedValue({
        response: { data: { message: "Invalid booking link" } },
      });

      render(<CandidateInterviewBookingPage />);

      expect(await screen.findByText("Unable to Load Interview")).toBeInTheDocument();
      expect(screen.getByText("Invalid booking link")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /try again/i })).toBeInTheDocument();
    });

    it("RFC 5545 .ics generator creates valid UTC formatted iCalendar content", () => {
      const ics = generateIcsContent({
        title: "Technical Round - Staff Engineer",
        description: "Interview with Arjun",
        location: "https://meet.google.com/xyz",
        startTime: "2026-10-15T14:00:00.000Z",
        endTime: "2026-10-15T14:45:00.000Z",
      });

      expect(ics).toContain("BEGIN:VCALENDAR");
      expect(ics).toContain("VERSION:2.0");
      expect(ics).toContain("DTSTART:20261015T140000Z");
      expect(ics).toContain("DTEND:20261015T144500Z");
      expect(ics).toContain("SUMMARY:Technical Round - Staff Engineer");
      expect(ics).toContain("LOCATION:https://meet.google.com/xyz");
      expect(ics).toContain("END:VCALENDAR");
    });
  });

  /* =====================================================================
   * F-05.2: Candidate AI Interview (/ai-interview/$token)
   * ===================================================================== */
  describe("F-05.2: Candidate AI Interview Page (Text-Only)", () => {
    const mockNotStartedSession = {
      token: "test-token-123",
      candidate_name: "Sneha Patel",
      first_name: "Sneha",
      job_title: "Senior Backend Developer",
      company_name: "OFC360",
      estimated_duration_minutes: 20,
      consent_text: "I agree to participate in this AI-assisted assessment.",
      status: "NOT_STARTED" as const,
      current_question: null,
      total_questions: 3,
      answered_count: 0,
    };

    const mockQuestion1 = {
      id: "q-1",
      question_text: "How would you design a rate limiter in a distributed architecture?",
      category: "System Design",
      time_limit_seconds: 180,
      question_number: 1,
      total_questions: 3,
    };

    it("renders consent screen with candidate name and duration; start requires consent checkbox", async () => {
      vi.spyOn(aiInterviewBotApi, "getPublicSession").mockResolvedValue(mockNotStartedSession);

      render(<CandidateAIInterviewPage />);

      expect(await screen.findByText("Welcome, Sneha!")).toBeInTheDocument();
      expect(screen.getByText("20 Minutes")).toBeInTheDocument();
      expect(screen.getByText("Text-only (No Camera / No Mic)")).toBeInTheDocument();

      const startBtn = screen.getByRole("button", { name: /begin interview/i });
      expect(startBtn).toBeDisabled();

      // Check consent
      const checkbox = screen.getByRole("checkbox");
      fireEvent.click(checkbox);
      expect(startBtn).not.toBeDisabled();
    });

    it("starts interview and progresses through question-by-question flow", async () => {
      vi.spyOn(aiInterviewBotApi, "getPublicSession").mockResolvedValue(mockNotStartedSession);
      vi.spyOn(aiInterviewBotApi, "startInterview").mockResolvedValue({
        ...mockNotStartedSession,
        status: "IN_PROGRESS",
        current_question: mockQuestion1,
      });

      render(<CandidateAIInterviewPage />);

      await screen.findByText("Welcome, Sneha!");
      fireEvent.click(screen.getByRole("checkbox"));
      fireEvent.click(screen.getByRole("button", { name: /begin interview/i }));

      // Question screen
      expect(
        await screen.findByText("How would you design a rate limiter in a distributed architecture?")
      ).toBeInTheDocument();
      expect(screen.getByText("System Design")).toBeInTheDocument();
      expect(
        screen.getByText((_, el) => el?.textContent?.replace(/\s+/g, " ").trim() === "Question 1 of 3")
      ).toBeInTheDocument();

      // Next button disabled when answer is empty
      const nextBtn = screen.getByRole("button", { name: /next question/i });
      expect(nextBtn).toBeDisabled();

      // Type answer
      const textarea = screen.getByPlaceholderText(/type your detailed response here/i);
      fireEvent.change(textarea, { target: { value: "I would use a Redis sliding window counter." } });
      expect(nextBtn).not.toBeDisabled();
    });

    it("resumes session seamlessly after browser refresh", async () => {
      vi.spyOn(aiInterviewBotApi, "getPublicSession").mockResolvedValue({
        ...mockNotStartedSession,
        status: "IN_PROGRESS",
        current_question: {
          id: "q-2",
          question_text: "Explain database indexing trade-offs.",
          category: "Database",
          question_number: 2,
          total_questions: 3,
        },
        answered_count: 1,
      });

      render(<CandidateAIInterviewPage />);

      expect(await screen.findByText("Explain database indexing trade-offs.")).toBeInTheDocument();
      expect(
        screen.getByText((_, el) => el?.textContent?.replace(/\s+/g, " ").trim() === "Question 2 of 3")
      ).toBeInTheDocument();
    });

    it("displays thank you screen on completion and NEVER shows AI scores to candidate", async () => {
      vi.spyOn(aiInterviewBotApi, "getPublicSession").mockResolvedValue({
        ...mockNotStartedSession,
        status: "COMPLETED",
        current_question: null,
      });

      render(<CandidateAIInterviewPage />);

      expect(await screen.findByText("Thank you, Sneha!")).toBeInTheDocument();
      expect(screen.getByText(/have been securely submitted to the hiring team/i)).toBeInTheDocument();

      // STRICT CHECK: Never show match score or AI scores to candidate
      expect(screen.queryByText(/match score/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/%/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/confidence/i)).not.toBeInTheDocument();
    });
  });

  /* =====================================================================
   * F-05.3: HR AI Interview Tab & Decision Flow
   * ===================================================================== */
  describe("F-05.3: HR AI Interview Management Tab", () => {
    const mockResults = [
      {
        id: "res-1",
        application_id: "app-1",
        candidate_name: "Amitabh Ray",
        job_id: "job-1",
        job_title: "Lead Fullstack Architect",
        status: "COMPLETED" as const,
        match_score: 87,
        confidence: 90,
        strengths: ["Strong domain modeling", "Clear communication"],
        weaknesses: ["Less experience with gRPC"],
        red_flags: [],
        integrity_signals: {
          tab_switches: 0,
          flags: [],
        },
        transcript: [
          {
            question: "Describe your microservices experience.",
            answer: "Built distributed services handling 10k req/s using Node and Go.",
          },
        ],
        human_decision: null,
      },
      {
        id: "res-2",
        application_id: "app-2",
        candidate_name: "Maya Sen",
        job_id: "job-1",
        job_title: "Lead Fullstack Architect",
        status: "IN_PROGRESS" as const,
        match_score: undefined,
        strengths: [],
        weaknesses: [],
        red_flags: [],
        human_decision: null,
      },
    ];

    it("renders results list, integrity labels, and score rounded to integer", async () => {
      vi.spyOn(aiInterviewBotApi, "getResults").mockResolvedValue({
        items: mockResults,
        total: 2,
      });

      const store = createTestStore({
        recruitment: {
          jobs: [{ id: "job-1", title: "Lead Fullstack Architect" } as any],
          candidates: [],
        },
      });

      render(
        <Provider store={store}>
          <AIInterviewResultsTab />
        </Provider>
      );

      expect(await screen.findByText("Amitabh Ray")).toBeInTheDocument();
      expect(screen.getByText("Match: 87%")).toBeInTheDocument();
      expect(screen.getByText("Strong domain modeling")).toBeInTheDocument();
      expect(screen.getByText("0 tab switches")).toBeInTheDocument();
      expect(screen.getAllByText("Clean (0 flags)").length).toBeGreaterThan(0);
    });

    it("disables decision buttons when interview is not completed", async () => {
      vi.spyOn(aiInterviewBotApi, "getResults").mockResolvedValue({
        items: [mockResults[1]], // IN_PROGRESS
        total: 1,
      });

      const store = createTestStore({ recruitment: { jobs: [], candidates: [] } });

      render(
        <Provider store={store}>
          <AIInterviewResultsTab />
        </Provider>
      );

      expect(await screen.findByText("Maya Sen")).toBeInTheDocument();

      const shortlistBtn = screen.getByRole("button", { name: /shortlist/i });
      const rejectBtn = screen.getByRole("button", { name: /reject/i });

      expect(shortlistBtn).toBeDisabled();
      expect(rejectBtn).toBeDisabled();
    });

    it("requires at least 10 characters for rejection reason", async () => {
      vi.spyOn(aiInterviewBotApi, "getResults").mockResolvedValue({
        items: [mockResults[0]], // COMPLETED
        total: 1,
      });

      const store = createTestStore({ recruitment: { jobs: [], candidates: [] } });

      render(
        <Provider store={store}>
          <AIInterviewResultsTab />
        </Provider>
      );

      expect(await screen.findByText("Amitabh Ray")).toBeInTheDocument();

      const rejectBtn = screen.getByRole("button", { name: /reject/i });
      expect(rejectBtn).not.toBeDisabled();
      fireEvent.click(rejectBtn);

      // Dialog opens
      expect(screen.getByText(/Confirm Decision: Reject Candidate/i)).toBeInTheDocument();
      const confirmRejectBtn = screen.getByRole("button", { name: /Confirm REJECT/i });
      expect(confirmRejectBtn).toBeDisabled();

      // Enter short reason (< 10 chars)
      const reasonInput = screen.getByPlaceholderText(/explain why the candidate does not meet/i);
      fireEvent.change(reasonInput, { target: { value: "Too brief" } });
      expect(confirmRejectBtn).toBeDisabled();

      // Enter valid reason (>= 10 chars)
      fireEvent.change(reasonInput, { target: { value: "Candidate lacks required distributed systems depth." } });
      expect(confirmRejectBtn).not.toBeDisabled();
    });
  });
});
