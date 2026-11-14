import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/client";

export const fetchPolicyAssistantDashboard = createAsyncThunk(
  "policyAssistant/fetchDashboard",
  async () => {
    const res = await api.get<any>("/ai/policy-assistant");
    const d = res?.data ?? res ?? {};
    return {
      messages: Array.isArray(d.messages) ? d.messages : [],
      summary: d.summary ?? null,
      loading: false,
      asking: false,
      error: null,
    };
  },
);

export const askPolicyQuestion = createAsyncThunk(
  "policyAssistant/askQuestion",
  async (question: string) => {
    const res = await api.post<any>("/ai/policy-assistant/ask", { question });
    const d = res?.data ?? res ?? {};
    return {
      id: String(d.id || `msg-${Date.now()}`),
      sender: "assistant" as const,
      text: String(d.text || d.answer || d.reply || ""),
    };
  },
);
