import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchPolicyAssistantDashboard = createAsyncThunk(
  "policyAssistant/fetchDashboard",
  async () => {
    return {
      messages: [
        { id: "1", sender: "assistant", text: "Hello! How can I assist you with company policies, leave rules, or benefits today?" },
      ],
      summary: { totalQueriesResolved: 154, topTopic: "Remote Work & Expenses" },
      loading: false,
      asking: false,
      error: null,
    };
  }
);

export const askPolicyQuestion = createAsyncThunk(
  "policyAssistant/askQuestion",
  async (question: string) => {
    return {
      id: `msg-${Date.now()}`,
      sender: "assistant" as const,
      text: `Regarding your query "${question}": According to Section 4.2 of our handbook, standard work hours are 9am to 5pm with flexible core hours. Remote work expenses up to $50/mo are eligible for reimbursement.`,
    };
  }
);
