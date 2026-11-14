const INITIAL_SCREENING_RESULTS = [
  {
    id: "scr-1",
    screening_id: "scr-1",
    application_id: "app-1",
    candidate_id: "cand-1",
    candidate_name: "Aarav Sharma",
    status: "COMPLETED",
    decision: "SHORTLIST",
    confidence: 95,
    match_score: 94,
    strengths: [
      "7+ years hands-on PyTorch & LLM distributed inference experience",
      "Strong production track record scaling GPU clusters",
      "IIT Bombay CS background with relevant publications",
    ],
    weaknesses: ["30-day notice period"],
    missing_skills: [],
    red_flags: [],
    green_flags: ["Direct domain match", "High system design depth"],
    hiring_recommendation:
      "Strongly recommend fast-tracking to Technical Architecture Round.",
    hr_notes: "Candidate is actively interviewing; prioritize scheduling.",
    questions_to_ask: [
      "How did you handle KV-cache memory fragmentation under multi-tenant load?",
      "Walk through your fault-tolerance strategy during distributed training.",
    ],
    model_used: "OFC360 Talent Engine v2.4",
    screened_at: "2026-11-05T10:30:00Z",
    human_decision: "SHORTLIST",
    human_decision_by: "Elena Rostova",
    human_decision_reason: "Top match for AI Research team.",
    human_decided_at: "2026-11-05T14:00:00Z",
  },
  {
    id: "scr-2",
    screening_id: "scr-2",
    application_id: "app-3",
    candidate_id: "cand-3",
    candidate_name: "Rohan Deshmukh",
    status: "COMPLETED",
    decision: "SHORTLIST",
    confidence: 89,
    match_score: 88,
    strengths: [
      "Strong B2B SaaS design systems portfolio",
      "5 years interaction design experience from NID",
    ],
    weaknesses: ["Limited prior exposure to payroll compliance domain"],
    missing_skills: [],
    red_flags: [],
    green_flags: ["Clean component architecture in Figma"],
    hiring_recommendation: "Proceed to Portfolio Critique with Sarah Chen.",
    hr_notes: "Strong communication skills during preliminary call.",
    questions_to_ask: [
      "How do you balance information density with clarity in enterprise tables?",
    ],
    model_used: "OFC360 Talent Engine v2.4",
    screened_at: "2026-11-06T09:15:00Z",
    human_decision: null,
    human_decision_by: null,
    human_decision_reason: null,
    human_decided_at: null,
  },
];

let screeningState = [...INITIAL_SCREENING_RESULTS];

export const screeningApi = {
  getScreenings: async () => {
    return screeningState;
  },

  screenCandidate: async (candidateId: string) => {
    return {
      success: true,
      candidateId,
      status: "COMPLETED",
    };
  },

  runScreening: async (
    _jobId: string,
    payload?: { application_ids?: string[]; model?: string; force?: boolean },
  ) => {
    const total = payload?.application_ids?.length || screeningState.length || 2;
    return {
      run_id: `run-${Date.now()}`,
      status: "COMPLETED",
      completed: total,
      total,
    };
  },

  getScreeningResults: async (_jobId: string) => {
    return {
      thresholds: {
        shortlist: 75,
        reject: 45,
      },
      run: {
        run_id: "run-latest",
        status: "COMPLETED",
        completed: screeningState.length,
        total: screeningState.length,
      },
      results: screeningState,
    };
  },

  submitDecision: async (
    screeningId: string,
    payload: { action: "SHORTLIST" | "REJECT" | "KEEP_REVIEW"; reason?: string },
  ) => {
    let updatedItem: Record<string, any> | undefined;
    screeningState = screeningState.map((item) => {
      if (item.id === screeningId || item.screening_id === screeningId) {
        updatedItem = {
          ...item,
          human_decision: payload.action,
          human_decision_by: "Alex Vance",
          human_decision_reason: payload.reason || null,
          human_decided_at: new Date().toISOString(),
        };
        return updatedItem;
      }
      return item;
    });

    return {
      success: true,
      data: updatedItem || {
        id: screeningId,
        screening_id: screeningId,
        status: "COMPLETED",
        human_decision: payload.action,
        human_decision_reason: payload.reason || null,
        human_decided_at: new Date().toISOString(),
      },
    };
  },
};

export default screeningApi;
