import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchRecruiterDashboard = createAsyncThunk(
  "aiRecruiter/fetchDashboard",
  async () => {
    return {
      kpis: [
        { label: "Screened Resumes", value: 142, trend: "up" },
        { label: "Avg Match Score", value: "89%", trend: "up" },
        { label: "Time-to-Shortlist", value: "1.4 days", trend: "down" },
      ],
      summary: { activeJobs: 8, pipelineCandidates: 64 },
      candidates: [
        { id: "c1", name: "David Kim", role: "AI Research Scientist", score: "97%" },
        { id: "c2", name: "Amara Oke", role: "Frontend Lead", score: "94%" },
      ],
      lastUpdated: new Date().toISOString(),
    };
  }
);
