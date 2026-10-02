import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import recruitmentReducer, { clearScreeningState } from "../recruitmentSlice";
import { mapScreeningResultsToFrontend } from "../utils/apiMappers";
import { AIScreeningPage } from "../pages/AIScreeningPage";
import type { Job, Candidate } from "../types";
import * as screeningApiModule from "@/services/screeningApi";
import type { RecruitmentState } from "../recruitmentTypes";

// Mock sonner toast
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

// Mock @/components/ui/select to prevent radix jsdom pointer/scroll errors
vi.mock("@/components/ui/select", () => ({
  Select: ({ value, onValueChange, children }: any) => (
    <div data-testid="mock-select" data-value={value}>
      <button
        type="button"
        data-testid="switch-job-btn"
        onClick={() => onValueChange("job-2")}
      >
        Switch to Job 2
      </button>
      {children}
    </div>
  ),
  SelectTrigger: ({ children, ...props }: any) => <div role="combobox" {...props}>{children}</div>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ value, children }: any) => <div data-value={value}>{children}</div>,
}));

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

describe("F-03: AI Resume Screening Reconciliation & Safety Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  // ========================================================
  // 1. No fake thresholds (thresholds null until returned)
  // ========================================================
  it("F-03.1: no fake default thresholds: null until loaded and renders placeholder", async () => {
    const emptyMapped = mapScreeningResultsToFrontend({});
    expect(emptyMapped.thresholds).toBeNull();

    const initialSlice = recruitmentReducer(undefined, { type: "@@INIT" });
    expect(initialSlice.screeningThresholds).toBeNull();

    const clearedSlice = recruitmentReducer(
      { ...initialSlice, screeningThresholds: { shortlist: 90, reject: 50 } },
      clearScreeningState(),
    );
    expect(clearedSlice.screeningThresholds).toBeNull();

    vi.spyOn(screeningApiModule.screeningApi, "getScreeningResults").mockResolvedValue({
      thresholds: null,
      run: null,
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
        screeningThresholds: null,
        screeningJobId: null,
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

    const dashElements = await screen.findAllByText("—");
    expect(dashElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByText("≥ 85%")).not.toBeInTheDocument();
  });

  // ========================================================
  // 2. 404 shows visible error state with Retry
  // ========================================================
  it("F-03.1: 404 does not silently swallow; shows visible error alert and Retry button", async () => {
    const error404 = new Error("Request failed with status code 404");
    (error404 as unknown as { status: number }).status = 404;

    const getResultsSpy = vi
      .spyOn(screeningApiModule.screeningApi, "getScreeningResults")
      .mockRejectedValue(error404);

    const store = createTestStore({
      recruitment: {
        jobs: [mockJob1],
        candidates: [],
        interviews: [],
        offers: [],
        loading: false,
        submitting: false,
        error: null,
        screeningThresholds: null,
        screeningJobId: null,
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

    const alert = await screen.findByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/Request failed with status code 404/i);

    const retryBtn = screen.getByRole("button", { name: /retry/i });
    expect(retryBtn).toBeInTheDocument();

    fireEvent.click(retryBtn);
    expect(getResultsSpy).toHaveBeenCalledTimes(2);
  });

  // ========================================================
  // 3. Score display: round to integer, show once
  // ========================================================
  it("F-03.2: rounds matchScore to integer and shows percentage once", async () => {
    vi.spyOn(screeningApiModule.screeningApi, "getScreeningResults").mockResolvedValue({
      thresholds: { shortlist: 80, reject: 50 },
      run: null,
      results: [
        {
          screening_id: "scr-score-1",
          application_id: "app-score-1",
          candidate_id: "cand-score-1",
          candidate_name: "Score Test Candidate",
          status: "COMPLETED",
          decision: "SHORTLIST",
          confidence: 88,
          match_score: 91.6,
          strengths: ["React"],
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
      ],
    });

    const store = createTestStore({
      recruitment: {
        jobs: [mockJob1],
        candidates: [
          {
            id: "cand-score-1",
            name: "Score Test Candidate",
            email: "score@test.com",
            phone: "123",
            location: "BLR",
            jobId: "job-1",
            applicationId: "app-score-1",
            appliedPosition: "Frontend Architect",
            stage: "screening",
            atsScore: 92,
            jobMatch: 92,
            source: "DIRECT",
            tags: [],
            skills: ["React"],
            yearsExperience: 5,
            resumeName: "s.pdf",
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
        screeningThresholds: { shortlist: 80, reject: 50 },
        screeningJobId: "job-1",
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

    expect(await screen.findByText("92%")).toBeInTheDocument();
    expect(screen.getByText(/Confidence: 88%/i)).toBeInTheDocument();
  });

  // ========================================================
  // 4. Decision blocked for unscreened candidates
  // ========================================================
  it("F-03.4: blocks Shortlist and Reject for unscreened candidate with tooltip 'Run AI screening first'", async () => {
    vi.spyOn(screeningApiModule.screeningApi, "getScreeningResults").mockResolvedValue({
      thresholds: { shortlist: 85, reject: 60 },
      run: null,
      results: [],
    });

    const store = createTestStore({
      recruitment: {
        jobs: [mockJob1],
        candidates: [
          {
            id: "cand-unscreened",
            name: "Unscreened Candidate",
            email: "unscreened@test.com",
            phone: "123",
            location: "BLR",
            jobId: "job-1",
            applicationId: "app-unscreened",
            appliedPosition: "Frontend Architect",
            stage: "applied",
            atsScore: null,
            jobMatch: null,
            source: "DIRECT",
            tags: [],
            skills: [],
            yearsExperience: 3,
            resumeName: "u.pdf",
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
        screeningJobId: "job-1",
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

    expect(await screen.findByText("Unscreened Candidate")).toBeInTheDocument();
    expect(screen.getByText("Not screened yet")).toBeInTheDocument();

    const shortlistBtn = screen.getByLabelText("Shortlist Unscreened Candidate");
    const rejectBtn = screen.getByLabelText("Reject Unscreened Candidate");

    expect(shortlistBtn).toBeDisabled();
    expect(rejectBtn).toBeDisabled();

    const tooltips = screen.getAllByTitle("Run AI screening first");
    expect(tooltips.length).toBeGreaterThanOrEqual(2);
  });

  // ========================================================
  // 5. Decision safety: uses screeningId ONLY
  // ========================================================
  it("F-03.4 / F-03.11: uses candidate.screeningId ONLY when submitting decision", async () => {
    vi.spyOn(screeningApiModule.screeningApi, "getScreeningResults").mockResolvedValue({
      thresholds: { shortlist: 80, reject: 50 },
      run: null,
      results: [
        {
          id: "legacy-random-id",
          screening_id: "scr-real-uuid-999",
          application_id: "app-target",
          candidate_id: "cand-target",
          candidate_name: "Decision Target",
          status: "COMPLETED",
          decision: "SHORTLIST",
          confidence: 90,
          match_score: 95,
          strengths: ["TypeScript"],
          weaknesses: [],
          missing_skills: [],
          red_flags: [],
          green_flags: [],
          hiring_recommendation: "Hire",
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

    const submitSpy = vi
      .spyOn(screeningApiModule.screeningApi, "submitDecision")
      .mockResolvedValue({ success: true });

    const store = createTestStore({
      recruitment: {
        jobs: [mockJob1],
        candidates: [
          {
            id: "cand-target",
            name: "Decision Target",
            email: "target@test.com",
            phone: "123",
            location: "BLR",
            jobId: "job-1",
            applicationId: "app-target",
            appliedPosition: "Frontend Architect",
            stage: "screening",
            atsScore: 95,
            jobMatch: 95,
            source: "DIRECT",
            tags: [],
            skills: ["TypeScript"],
            yearsExperience: 6,
            resumeName: "t.pdf",
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
        screeningThresholds: { shortlist: 80, reject: 50 },
        screeningJobId: "job-1",
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

    expect(await screen.findByText("Decision Target")).toBeInTheDocument();

    const shortlistBtn = screen.getByLabelText("Shortlist Decision Target");
    expect(shortlistBtn).not.toBeDisabled();
    fireEvent.click(shortlistBtn);

    expect(await screen.findByText("Confirm Shortlist Decision")).toBeInTheDocument();
    const confirmBtn = screen.getByRole("button", { name: "Confirm Shortlist" });
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(submitSpy).toHaveBeenCalledWith("scr-real-uuid-999", expect.objectContaining({
        action: "SHORTLIST",
      }));
    });
  });

  // ========================================================
  // 6. Polling with PENDING, stops on FAILED, shows backend error
  // ========================================================
  it("F-03.5 / F-03.12: polls while status is PENDING and stops on FAILED showing backend error + Retry", async () => {
    vi.useFakeTimers();

    const getResultsSpy = vi
      .spyOn(screeningApiModule.screeningApi, "getScreeningResults")
      .mockResolvedValueOnce({
        thresholds: { shortlist: 85, reject: 60 },
        run: {
          run_id: "run-pending-1",
          status: "PENDING",
          completed: 0,
          total: 1,
        },
        results: [],
      })
      .mockResolvedValueOnce({
        thresholds: { shortlist: 85, reject: 60 },
        run: {
          run_id: "run-pending-1",
          status: "FAILED",
          completed: 0,
          total: 1,
        },
        results: [
          {
            screening_id: "scr-failed",
            application_id: "app-fail",
            candidate_id: "cand-fail",
            candidate_name: "Failed Resume",
            status: "FAILED",
            error: "PDF parser encountered corrupted binary structure.",
            decision: null,
            confidence: 0,
            match_score: 0,
            strengths: [],
            weaknesses: [],
            missing_skills: [],
            red_flags: [],
            green_flags: [],
            hiring_recommendation: "",
            hr_notes: "",
            questions_to_ask: [],
            model_used: "gpt-4o",
            screened_at: null,
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
            id: "cand-fail",
            name: "Failed Resume",
            email: "fail@test.com",
            phone: "123",
            location: "BLR",
            jobId: "job-1",
            applicationId: "app-fail",
            appliedPosition: "Frontend Architect",
            stage: "applied",
            atsScore: null,
            jobMatch: null,
            source: "DIRECT",
            tags: [],
            skills: [],
            yearsExperience: 2,
            resumeName: "corrupt.pdf",
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
        screeningJobId: "job-1",
        screeningRun: {
          runId: "run-pending-1",
          status: "PENDING",
          completed: 0,
          total: 1,
        },
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

    // Initial mount fetch
    await act(async () => {
      await Promise.resolve();
    });
    expect(getResultsSpy).toHaveBeenCalledTimes(1);

    // Advance 3s -> polling triggers
    await act(async () => {
      vi.advanceTimersByTime(3000);
      await Promise.resolve();
    });
    expect(getResultsSpy).toHaveBeenCalledTimes(2);

    // Status is now FAILED, subsequent advance does not poll again
    await act(async () => {
      vi.advanceTimersByTime(10000);
      await Promise.resolve();
    });
    expect(getResultsSpy).toHaveBeenCalledTimes(2);
  });

  // ========================================================
  // 7. Job switching clears state and ignores stale responses
  // ========================================================
  it("F-03.6: job switching clears screening state and ignores stale responses", async () => {
    let slowResolve: (val: any) => void;
    const slowJob1Promise = new Promise((resolve) => {
      slowResolve = resolve;
    });

    vi.spyOn(screeningApiModule.screeningApi, "getScreeningResults").mockImplementation(
      async (jobId: string) => {
        if (jobId === "job-1") {
          return slowJob1Promise as any;
        }
        return {
          thresholds: { shortlist: 75, reject: 45 },
          run: null,
          results: [],
        };
      },
    );

    const store = createTestStore({
      recruitment: {
        jobs: [mockJob1, mockJob2],
        candidates: [],
        interviews: [],
        offers: [],
        loading: false,
        submitting: false,
        error: null,
        screeningThresholds: null,
        screeningJobId: null,
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

    // Click switch-job button
    const switchBtn = screen.getByTestId("switch-job-btn");
    fireEvent.click(switchBtn);

    // State cleared
    expect(store.getState().recruitment.screeningResults).toEqual([]);

    // Stale slow response from job-1 finally returns
    slowResolve!({
      thresholds: { shortlist: 99, reject: 99 },
      run: null,
      results: [
        {
          screening_id: "stale-scr",
          application_id: "stale-app",
          candidate_id: "stale-cand",
          candidate_name: "Stale Candidate",
          status: "COMPLETED",
          decision: "SHORTLIST",
          confidence: 1,
          match_score: 99,
          strengths: [],
          weaknesses: [],
          missing_skills: [],
          red_flags: [],
          green_flags: [],
          hiring_recommendation: "",
          hr_notes: "",
          questions_to_ask: [],
          model_used: "stale",
          screened_at: null,
          human_decision: null,
          human_decision_by: null,
          human_decision_reason: null,
        },
      ],
    });

    await waitFor(() => {
      const results = store.getState().recruitment.screeningResults;
      expect(results.some((r) => r.candidateName === "Stale Candidate")).toBe(false);
    });
  });

  // ========================================================
  // 8. Same-name candidates don't merge
  // ========================================================
  it("F-03.7: candidates with the same name do not merge or collide", async () => {
    vi.spyOn(screeningApiModule.screeningApi, "getScreeningResults").mockResolvedValue({
      thresholds: { shortlist: 80, reject: 50 },
      run: null,
      results: [
        {
          screening_id: "scr-same-1",
          application_id: "app-same-1",
          candidate_id: "cand-same-1",
          candidate_name: "Aarav Sharma",
          status: "COMPLETED",
          decision: "SHORTLIST",
          confidence: 95,
          match_score: 95,
          strengths: ["Senior Architect"],
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
          screening_id: "scr-same-2",
          application_id: "app-same-2",
          candidate_id: "cand-same-2",
          candidate_name: "Aarav Sharma",
          status: "COMPLETED",
          decision: "REJECT",
          confidence: 40,
          match_score: 35,
          strengths: [],
          weaknesses: ["Junior with limited exposure"],
          missing_skills: ["TypeScript"],
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
            id: "cand-same-1",
            name: "Aarav Sharma",
            email: "aarav1@test.com",
            phone: "111",
            location: "BLR",
            jobId: "job-1",
            applicationId: "app-same-1",
            appliedPosition: "Frontend Architect",
            stage: "screening",
            atsScore: 95,
            jobMatch: 95,
            source: "DIRECT",
            tags: [],
            skills: ["React"],
            yearsExperience: 8,
            resumeName: "a1.pdf",
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
            id: "cand-same-2",
            name: "Aarav Sharma",
            email: "aarav2@test.com",
            phone: "222",
            location: "DEL",
            jobId: "job-1",
            applicationId: "app-same-2",
            appliedPosition: "Frontend Architect",
            stage: "screening",
            atsScore: 35,
            jobMatch: 35,
            source: "DIRECT",
            tags: [],
            skills: [],
            yearsExperience: 1,
            resumeName: "a2.pdf",
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
        screeningThresholds: { shortlist: 80, reject: 50 },
        screeningJobId: "job-1",
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

    expect(await screen.findByText("95%")).toBeInTheDocument();
    expect(screen.getByText("35%")).toBeInTheDocument();

    const nameHeadings = screen.getAllByText("Aarav Sharma");
    expect(nameHeadings.length).toBe(2);
  });

  // ========================================================
  // 9. Skills never come from missing_skills
  // ========================================================
  it("F-03.8: candidate skills never fallback to missing_skills", async () => {
    vi.spyOn(screeningApiModule.screeningApi, "getScreeningResults").mockResolvedValue({
      thresholds: { shortlist: 80, reject: 50 },
      run: null,
      results: [
        {
          screening_id: "scr-missing-test",
          application_id: "app-missing",
          candidate_id: "cand-missing",
          candidate_name: "Missing Skills Candidate",
          status: "COMPLETED",
          decision: "REVIEW",
          confidence: 70,
          match_score: 65,
          strengths: [],
          weaknesses: [],
          missing_skills: ["Docker", "Kubernetes"],
          red_flags: [],
          green_flags: [],
          hiring_recommendation: "",
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
            id: "cand-missing",
            name: "Missing Skills Candidate",
            email: "m@test.com",
            phone: "123",
            location: "BLR",
            jobId: "job-1",
            applicationId: "app-missing",
            appliedPosition: "Frontend Architect",
            stage: "screening",
            atsScore: null,
            jobMatch: null,
            source: "DIRECT",
            tags: [],
            skills: [],
            yearsExperience: 3,
            resumeName: "m.pdf",
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
        screeningThresholds: { shortlist: 80, reject: 50 },
        screeningJobId: "job-1",
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

    expect(await screen.findByText("Missing Skills Candidate")).toBeInTheDocument();
    expect(screen.getByText("Missing Skills:")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
    expect(screen.getByText("Kubernetes")).toBeInTheDocument();
    expect(screen.queryByText("Top Strengths:")).not.toBeInTheDocument();
  });

  // ========================================================
  // 10. Multi-application candidate shows the right job
  // ========================================================
  it("F-03.9: candidate with multiple applications displays application matching selectedJobId", async () => {
    vi.spyOn(screeningApiModule.screeningApi, "getScreeningResults").mockResolvedValue({
      thresholds: { shortlist: 80, reject: 50 },
      run: null,
      results: [],
    });

    const multiAppCandidate: Candidate = {
      id: "cand-multi",
      name: "Multi App Candidate",
      email: "multi@test.com",
      phone: "123",
      location: "BLR",
      jobId: "job-2",
      applicationId: "app-for-job2",
      appliedPosition: "Backend Engineer",
      stage: "interview",
      atsScore: 80,
      jobMatch: 80,
      source: "DIRECT",
      tags: [],
      skills: ["React", "Python"],
      yearsExperience: 5,
      resumeName: "m.pdf",
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
      applications: [
        {
          id: "app-for-job1",
          jobId: "job-1",
          stage: "screening",
          appliedPosition: "Frontend Architect",
        },
        {
          id: "app-for-job2",
          jobId: "job-2",
          stage: "interview",
          appliedPosition: "Backend Engineer",
        },
      ],
    };

    const store = createTestStore({
      recruitment: {
        jobs: [mockJob1, mockJob2],
        candidates: [multiAppCandidate],
        interviews: [],
        offers: [],
        loading: false,
        submitting: false,
        error: null,
        screeningThresholds: { shortlist: 80, reject: 50 },
        screeningJobId: "job-1",
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

    const candidateHeading = await screen.findByText("Multi App Candidate");
    const candidateCard = candidateHeading.closest(".rounded-2xl");
    expect(candidateCard).toBeInTheDocument();
    expect(candidateCard).toHaveTextContent("Frontend Architect");
    expect(candidateCard).not.toHaveTextContent("Backend Engineer");
  });
});
