import { createAsyncThunk } from "@reduxjs/toolkit";
import { recruiterApi } from "@/services/recruiterApi";

export const fetchRecruiterDashboard = createAsyncThunk(
  "aiRecruiter/fetchDashboard",
  async () => {
    const res = await recruiterApi.getDashboard();
    const d = (res as any)?.data ?? res ?? {};
    return {
      kpis: Array.isArray(d.kpis) ? d.kpis : [],
      summary: d.summary ?? { activeJobs: 0, pipelineCandidates: 0 },
      candidates: Array.isArray(d.candidates) ? d.candidates : [],
      lastUpdated: d.lastUpdated || new Date().toISOString(),
    };
  },
);
