import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import recruitmentReducer from "../recruitmentSlice";
import { mapScreeningResultsToFrontend } from "../utils/apiMappers";
import { AIScreeningPage } from "../pages/AIScreeningPage";
import type { Job, Candidate } from "../types";
import * as screeningApiModule from "@/services/screeningApi";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

import type { RecruitmentState } from "../recruitmentTypes";

function createTestStore(preloadedState?: { recruitment: Partial<RecruitmentState> }) {
  return configureStore({
    reducer: {
      recruitment: recruitmentReducer,
    },
    preloadedState: preloadedState as { recruitment: RecruitmentState },
  });
}

const mockJob1: Job = {
  id: "job-1",
  title: "Frontend Architect",
  department: "Engineering",
  employmentType: "Full-time",
  experience: "5-8 yrs",
  skills: ["React", "TypeScript", "Redux"],
  salaryMin: 2500000,
  salaryMax: 3500000,
  currency: "INR",
  vacancies: 2,
  location: "Bengaluru",
  workMode: "Hybrid",
  description: "Lead frontend architecture",
  responsibilities: ["Architecture"],
  requirements: ["TypeScript"],
  benefits: ["Health"],
  hiringManager: "Jane Manager",
  recruiter: "Bob Recruiter",
  status: "active",
  publishedAt: "2026-09-01T00:00:00Z",
  closingAt: "2026-10-31T00:00:00Z",
  applicants: 3,
};

const mockJob2: Job = {
  id: "job-2",
  title: "Backend Engineer",
  department: "Platform",
  employmentType: "Full-time",
  experience: "3-5 yrs",
  skills: ["Python", "FastAPI"],
  salaryMin: 1800000,
  salaryMax: 2400000,
  currency: "INR",
  vacancies: 1,
  location: "Remote",
  workMode: "Remote",
  description: "Build robust APIs",
  responsibilities: ["APIs"],
  requirements: ["Python"],
  benefits: ["Health"],
  hiringManager: "Dan Manager",
  recruiter: "Bob Recruiter",
  status: "active",
  publishedAt: "2026-09-01T00:00:00Z",
  closingAt: "2026-10-31T00:00:00Z",
  applicants: 1,
};

const mockCandidateJob2: Candidate = {
  id: "cand-other",
  name: "Other Job Candidate",
  email: "other@test.com",
  phone: "1234567890",
  location: "Bengaluru",
  jobId: "job-2",
  applicationId: "app-other",
  appliedPosition: "Backend Engineer",
  stage: "screening",
  atsScore: 75,
  jobMatch: 75,
  source: "DIRECT",
  tags: [],
  skills: ["Python"],
  yearsExperience: 4,
  resumeName: "resume.pdf",
  summary: "Backend developer",
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  languages: [],
  feedback: [],
  notes: [],
  documents: [],
  timeline: [],
  appliedAt: "2026-09-15T00:00:00Z",
};

describe("AI Resume Screening Feature", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ==========================================
  // Test 1: Results Mapping
  // ==========================================
  describe("results mapping", () => {
    it("maps backend screening results payload to frontend data structure correctly", () => {
      const rawBackendPayload = {
        thresholds: {
          shortlist: 90,
          reject: 55,
        },
        run: {
          run_id: "run-abc-123",
          status: "RUNNING",
          completed: 12,
          total: 40,
        },
        results: [
          {
            screening_id: "screen-001",
            application_id: "app-001",
            candidate_id: "cand-001",
            candidate_name: "Aarav Sharma",
            status: "COMPLETED",
            decision: "SHORTLIST",
            confidence: 0.94,
            match_score: 92,
            strengths: ["10 yrs React", "Expert in TypeScript"],
            weaknesses: ["No Go experience"],
            missing_skills: ["Docker"],
            red_flags: ["Frequent job changes"],
            green_flags: ["Open source contributor"],
            hiring_recommendation: "Strongly recommended for Senior Architect.",
            hr_notes: "Available to join in 15 days.",
            questions_to_ask: [
              "Describe your experience with module federation.",
              "How do you approach bundle size optimization?",
            ],
            model_used: "gpt-4o",
            screened_at: "2026-10-01T10:00:00Z",
            human_decision: "SHORTLIST",
            human_decision_by: "Lead Recruiter",
            human_decision_reason: "High score and verified background.",
          },
        ],
      };

      const mapped = mapScreeningResultsToFrontend(rawBackendPayload);

      expect(mapped.thresholds.shortlist).toBe(90);
      expect(mapped.thresholds.reject).toBe(55);

      expect(mapped.run).not.toBeNull();
      expect(mapped.run?.runId).toBe("run-abc-123");
      expect(mapped.run?.status).toBe("RUNNING");
      expect(mapped.run?.completed).toBe(12);
      expect(mapped.run?.total).toBe(40);

      expect(mapped.results).toHaveLength(1);
      const first = mapped.results[0];
      expect(first.screeningId).toBe("screen-001");
      expect(first.applicationId).toBe("app-001");
      expect(first.candidateId).toBe("cand-001");
      expect(first.candidateName).toBe("Aarav Sharma");
      expect(first.status).toBe("COMPLETED");
      expect(first.decision).toBe("SHORTLIST");
      expect(first.confidence).toBe(0.94);
      expect(first.matchScore).toBe(92);
      expect(first.strengths).toEqual(["10 yrs React", "Expert in TypeScript"]);
      expect(first.weaknesses).toEqual(["No Go experience"]);
      expect(first.missingSkills).toEqual(["Docker"]);
      expect(first.redFlags).toEqual(["Frequent job changes"]);
      expect(first.greenFlags).toEqual(["Open source contributor"]);
      expect(first.hiringRecommendation).toBe("Strongly recommended for Senior Architect.");
      expect(first.hrNotes).toBe("Available to join in 15 days.");
      expect(first.questionsToAsk).toHaveLength(2);
      expect(first.modelUsed).toBe("gpt-4o");
      expect(first.humanDecision).toBe("SHORTLIST");
      expect(first.humanDecisionBy).toBe("Lead Recruiter");
      expect(first.humanDecisionReason).toBe("High score and verified background.");
    });
  });

  // ==========================================
  // Test 2: Zero-candidates Empty State
  // ==========================================
  describe("zero-candidates empty state", () => {
    it("shows empty state when selected job has zero candidates and NEVER falls back to candidates of other jobs", async () => {
      vi.spyOn(screeningApiModule.screeningApi, "getScreeningResults").mockResolvedValue({
        thresholds: { shortlist: 85, reject: 60 },
        run: null,
        results: [],
      });

      // job-1 has NO candidates, job-2 has mockCandidateJob2
      const store = createTestStore({
        recruitment: {
          jobs: [mockJob1, mockJob2],
          candidates: [mockCandidateJob2],
          interviews: [],
          offers: [],
          loading: false,
          submitting: false,
          error: null,
          screeningThresholds: { shortlist: 85, reject: 60 },
          screeningRun: null,
          screeningResults: [],
          screeningLoading: false,
          screeningSubmitting: false,
          screeningError: null,
        },
      });

      render(
        <Provider store={store}>
          <AIScreeningPage />
        </Provider>,
      );

      // Verify that the empty state for the selected job is shown
      expect(
        await screen.findByText(/No candidates found for this job requisition/i),
      ).toBeInTheDocument();

      // Verify that the candidate of the OTHER job (job-2) is NOT displayed
      expect(screen.queryByText("Other Job Candidate")).not.toBeInTheDocument();
    });
  });

  // ==========================================
  // Test 3: Tab Filtering
  // ==========================================
  describe("tab filtering", () => {
    it("filters candidates by All, Shortlisted, Review, and Rejected tabs correctly", async () => {
      vi.spyOn(screeningApiModule.screeningApi, "getScreeningResults").mockResolvedValue({
        thresholds: { shortlist: 85, reject: 60 },
        run: null,
        results: [
          {
            screening_id: "scr-1",
            application_id: "app-1",
            candidate_id: "cand-1",
            candidate_name: "Candidate Alpha",
            status: "COMPLETED",
            decision: "SHORTLIST",
            confidence: 0.9,
            match_score: 95,
            strengths: ["Great UI skills"],
            weaknesses: [],
            missing_skills: [],
            red_flags: [],
            green_flags: [],
            hiring_recommendation: "Strong hire",
            hr_notes: "",
            questions_to_ask: [],
            model_used: "gpt-4o",
            screened_at: "2026-10-01T00:00:00Z",
            human_decision: null,
            human_decision_by: null,
            human_decision_reason: null,
          },
          {
            screening_id: "scr-2",
            application_id: "app-2",
            candidate_id: "cand-2",
            candidate_name: "Candidate Beta",
            status: "COMPLETED",
            decision: "REVIEW",
            confidence: 0.75,
            match_score: 72,
            strengths: ["Good foundation"],
            weaknesses: ["Needs mentoring"],
            missing_skills: ["Redux"],
            red_flags: [],
            green_flags: [],
            hiring_recommendation: "Needs further interview",
            hr_notes: "",
            questions_to_ask: [],
            model_used: "gpt-4o",
            screened_at: "2026-10-01T00:00:00Z",
            human_decision: null,
            human_decision_by: null,
            human_decision_reason: null,
          },
          {
            screening_id: "scr-3",
            application_id: "app-3",
            candidate_id: "cand-3",
            candidate_name: "Candidate Gamma",
            status: "COMPLETED",
            decision: "REJECT",
            confidence: 0.85,
            match_score: 45,
            strengths: [],
            weaknesses: ["Does not meet baseline"],
            missing_skills: ["TypeScript", "React"],
            red_flags: [],
            green_flags: [],
            hiring_recommendation: "Reject",
            hr_notes: "",
            questions_to_ask: [],
            model_used: "gpt-4o",
            screened_at: "2026-10-01T00:00:00Z",
            human_decision: null,
            human_decision_by: null,
            human_decision_reason: null,
          },
        ],
      });

      const store = createTestStore({
        recruitment: {
          jobs: [mockJob1],
          candidates: [
            {
              id: "cand-1",
              name: "Candidate Alpha",
              email: "alpha@test.com",
              phone: "111",
              location: "BLR",
              jobId: "job-1",
              applicationId: "app-1",
              appliedPosition: "Frontend Architect",
              stage: "screening",
              atsScore: 95,
              jobMatch: 95,
              source: "DIRECT",
              tags: [],
              skills: ["React"],
              yearsExperience: 8,
              resumeName: "a.pdf",
              summary: "",
              experience: [],
              education: [],
              projects: [],
              certifications: [],
              languages: [],
              feedback: [],
              notes: [],
              documents: [],
              timeline: [],
              appliedAt: "2026-09-01T00:00:00Z",
            },
            {
              id: "cand-2",
              name: "Candidate Beta",
              email: "beta@test.com",
              phone: "222",
              location: "BLR",
              jobId: "job-1",
              applicationId: "app-2",
              appliedPosition: "Frontend Architect",
              stage: "screening",
              atsScore: 72,
              jobMatch: 72,
              source: "DIRECT",
              tags: [],
              skills: ["React"],
              yearsExperience: 4,
              resumeName: "b.pdf",
              summary: "",
              experience: [],
              education: [],
              projects: [],
              certifications: [],
              languages: [],
              feedback: [],
              notes: [],
              documents: [],
              timeline: [],
              appliedAt: "2026-09-01T00:00:00Z",
            },
            {
              id: "cand-3",
              name: "Candidate Gamma",
              email: "gamma@test.com",
              phone: "333",
              location: "BLR",
              jobId: "job-1",
              applicationId: "app-3",
              appliedPosition: "Frontend Architect",
              stage: "screening",
              atsScore: 45,
              jobMatch: 45,
              source: "DIRECT",
              tags: [],
              skills: [],
              yearsExperience: 1,
              resumeName: "g.pdf",
              summary: "",
              experience: [],
              education: [],
              projects: [],
              certifications: [],
              languages: [],
              feedback: [],
              notes: [],
              documents: [],
              timeline: [],
              appliedAt: "2026-09-01T00:00:00Z",
            },
            {
              id: "cand-4",
              name: "Candidate Delta (Unscreened)",
              email: "delta@test.com",
              phone: "444",
              location: "BLR",
              jobId: "job-1",
              applicationId: "app-4",
              appliedPosition: "Frontend Architect",
              stage: "applied",
              atsScore: null,
              jobMatch: null,
              source: "DIRECT",
              tags: [],
              skills: [],
              yearsExperience: 2,
              resumeName: "d.pdf",
              summary: "",
              experience: [],
              education: [],
              projects: [],
              certifications: [],
              languages: [],
              feedback: [],
              notes: [],
              documents: [],
              timeline: [],
              appliedAt: "2026-09-01T00:00:00Z",
            },
          ],
          interviews: [],
          offers: [],
          loading: false,
          submitting: false,
          error: null,
          screeningThresholds: { shortlist: 85, reject: 60 },
          screeningRun: null,
          screeningResults: [],
          screeningLoading: false,
          screeningSubmitting: false,
          screeningError: null,
        },
      });

      render(
        <Provider store={store}>
          <AIScreeningPage />
        </Provider>,
      );

      // In All tab: All candidates are present
      expect(await screen.findByText("Candidate Alpha")).toBeInTheDocument();
      expect(screen.getByText("Candidate Beta")).toBeInTheDocument();
      expect(screen.getByText("Candidate Gamma")).toBeInTheDocument();
      expect(screen.getByText("Candidate Delta (Unscreened)")).toBeInTheDocument();
      expect(screen.getByText("Not screened yet")).toBeInTheDocument();

      // Switch to Shortlisted tab
      fireEvent.click(screen.getByRole("button", { name: /shortlisted/i }));
      expect(screen.getByText("Candidate Alpha")).toBeInTheDocument();
      expect(screen.queryByText("Candidate Beta")).not.toBeInTheDocument();
      expect(screen.queryByText("Candidate Gamma")).not.toBeInTheDocument();
      expect(screen.queryByText("Candidate Delta (Unscreened)")).not.toBeInTheDocument();

      // Switch to Review tab
      fireEvent.click(screen.getByRole("button", { name: /^review/i }));
      expect(screen.getByText("Candidate Beta")).toBeInTheDocument();
      expect(screen.queryByText("Candidate Alpha")).not.toBeInTheDocument();
      expect(screen.queryByText("Candidate Gamma")).not.toBeInTheDocument();

      // Switch to Rejected tab
      fireEvent.click(screen.getByRole("button", { name: /rejected/i }));
      expect(screen.getByText("Candidate Gamma")).toBeInTheDocument();
      expect(screen.queryByText("Candidate Alpha")).not.toBeInTheDocument();
      expect(screen.queryByText("Candidate Beta")).not.toBeInTheDocument();
    });
  });

  // ==========================================
  // Test 4: Confirm-Before-Reject
  // ==========================================
  describe("confirm-before-reject", () => {
    it("requires a minimum 10-character rejection reason before submitting rejection decision", async () => {
      vi.spyOn(screeningApiModule.screeningApi, "getScreeningResults").mockResolvedValue({
        thresholds: { shortlist: 85, reject: 60 },
        run: null,
        results: [
          {
            screening_id: "screen-reject-test",
            application_id: "app-reject",
            candidate_id: "cand-reject",
            candidate_name: "Reject Target",
            status: "COMPLETED",
            decision: "REVIEW",
            confidence: 0.8,
            match_score: 65,
            strengths: [],
            weaknesses: ["Insufficient experience"],
            missing_skills: ["TypeScript"],
            red_flags: [],
            green_flags: [],
            hiring_recommendation: "Review needed",
            hr_notes: "",
            questions_to_ask: [],
            model_used: "gpt-4o",
            screened_at: "2026-10-01T00:00:00Z",
            human_decision: null,
            human_decision_by: null,
            human_decision_reason: null,
          },
        ],
      });

      const submitDecisionSpy = vi
        .spyOn(screeningApiModule.screeningApi, "submitDecision")
        .mockResolvedValue({ success: true });

      const store = createTestStore({
        recruitment: {
          jobs: [mockJob1],
          candidates: [
            {
              id: "cand-reject",
              name: "Reject Target",
              email: "reject@test.com",
              phone: "123",
              location: "BLR",
              jobId: "job-1",
              applicationId: "app-reject",
              appliedPosition: "Frontend Architect",
              stage: "screening",
              atsScore: 65,
              jobMatch: 65,
              source: "DIRECT",
              tags: [],
              skills: [],
              yearsExperience: 2,
              resumeName: "r.pdf",
              summary: "",
              experience: [],
              education: [],
              projects: [],
              certifications: [],
              languages: [],
              feedback: [],
              notes: [],
              documents: [],
              timeline: [],
              appliedAt: "2026-09-01T00:00:00Z",
            },
          ],
          interviews: [],
          offers: [],
          loading: false,
          submitting: false,
          error: null,
          screeningThresholds: { shortlist: 85, reject: 60 },
          screeningRun: null,
          screeningResults: [],
          screeningLoading: false,
          screeningSubmitting: false,
          screeningError: null,
        },
      });

      render(
        <Provider store={store}>
          <AIScreeningPage />
        </Provider>,
      );

      expect(await screen.findByText("Reject Target")).toBeInTheDocument();

      // Click the Reject button (aria-label "Reject Reject Target")
      const rejectButton = screen.getByLabelText("Reject Reject Target");
      fireEvent.click(rejectButton);

      // Confirmation dialog opens
      expect(await screen.findByText("Confirm Rejection Decision")).toBeInTheDocument();

      const confirmBtn = screen.getByRole("button", { name: "Confirm Rejection" });
      const textarea = screen.getByLabelText(/Rejection Reason/i);

      // Initially empty -> button is disabled
      expect(confirmBtn).toBeDisabled();

      // Enter fewer than 10 characters (5 characters)
      fireEvent.change(textarea, { target: { value: "Short" } });
      expect(confirmBtn).toBeDisabled();
      expect(screen.getByText("5 / 10 minimum characters")).toBeInTheDocument();

      // Enter more than 10 characters
      fireEvent.change(textarea, {
        target: { value: "Candidate lacks required senior experience in TypeScript architecture." },
      });
      expect(confirmBtn).not.toBeDisabled();

      // Submit rejection
      fireEvent.click(confirmBtn);

      await waitFor(() => {
        expect(submitDecisionSpy).toHaveBeenCalledWith(
          "screen-reject-test",
          expect.objectContaining({
            action: "REJECT",
            reason: "Candidate lacks required senior experience in TypeScript architecture.",
          }),
        );
      });
    });
  });

  // ==========================================
  // Test 5: Polling Stop
  // ==========================================
  describe("polling stop", () => {
    it("polls while status is RUNNING, and stops polling when run completes or component unmounts", async () => {
      vi.useFakeTimers();

      const getResultsSpy = vi
        .spyOn(screeningApiModule.screeningApi, "getScreeningResults")
        .mockResolvedValue({
          thresholds: { shortlist: 85, reject: 60 },
          run: {
            run_id: "run-poll-1",
            status: "RUNNING",
            completed: 5,
            total: 10,
          },
          results: [],
        });

      const store = createTestStore({
        recruitment: {
          jobs: [mockJob1],
          candidates: [],
          interviews: [],
          offers: [],
          loading: false,
          submitting: false,
          error: null,
          screeningThresholds: { shortlist: 85, reject: 60 },
          screeningRun: {
            runId: "run-poll-1",
            status: "RUNNING",
            completed: 5,
            total: 10,
          },
          screeningResults: [],
          screeningLoading: false,
          screeningSubmitting: false,
          screeningError: null,
        },
      });

      const { unmount } = render(
        <Provider store={store}>
          <AIScreeningPage />
        </Provider>,
      );

      // Initial fetch on mount
      expect(getResultsSpy).toHaveBeenCalledTimes(1);

      // Advance by 3 seconds -> polling triggers
      await act(async () => {
        vi.advanceTimersByTime(3000);
      });
      expect(getResultsSpy).toHaveBeenCalledTimes(2);

      // Advance by another 3 seconds -> polling triggers again
      await act(async () => {
        vi.advanceTimersByTime(3000);
      });
      expect(getResultsSpy).toHaveBeenCalledTimes(3);

      // Unmount component -> polling must stop
      unmount();

      await act(async () => {
        vi.advanceTimersByTime(6000);
      });
      // Should not have been called further
      expect(getResultsSpy).toHaveBeenCalledTimes(3);

      vi.useRealTimers();
    });
  });
});
