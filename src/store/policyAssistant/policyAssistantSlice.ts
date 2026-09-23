import { createSlice } from "@reduxjs/toolkit";
import type { PolicyAssistantState } from "./policyAssistantTypes";
import {
  askPolicyQuestion,
  fetchPolicyAssistantDashboard,
} from "./policyAssistantThunk";

const initialState: PolicyAssistantState = {
  loading: false,
  asking: false,
  error: null,
  lastUpdated: null,
  summary: null,
  messages: [
    {
      role: "ai",
      text: "Hi! I'm your Policy Assistant. Ask me anything about HR, leave, attendance or payroll policies.",
    },
  ],
};

export const policyAssistantSlice = createSlice({
  name: "policyAssistant",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
    resetChat(state) {
      state.messages = initialState.messages;
    },
  },
  extraReducers: (builder) => {
    // Dashboard fetch
    builder
      .addCase(fetchPolicyAssistantDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPolicyAssistantDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.lastUpdated = new Date().toISOString();
        if (action.payload.summary) {
          state.summary = action.payload.summary;
        }
      })
      .addCase(fetchPolicyAssistantDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? action.error.message ?? "Failed to fetch policy assistant status";
      });

    // Asking question
    builder
      .addCase(askPolicyQuestion.pending, (state, action) => {
        state.asking = true;
        state.error = null;
        state.messages.push({
          role: "user",
          text: action.meta.arg,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(askPolicyQuestion.fulfilled, (state, action) => {
        state.asking = false;
        state.messages.push({
          role: "ai",
          text:
            action.payload.answer && action.payload.answer.trim()
              ? action.payload.answer
              : "I found no direct policy clause matching your inquiry. Please consult your HR representative.",
          confidence: action.payload.confidence,
          sources: action.payload.sources,
          timestamp: new Date().toISOString(),
        });
      })
      .addCase(askPolicyQuestion.rejected, (state, action) => {
        state.asking = false;
        state.messages.push({
          role: "ai",
          text:
            action.payload ??
            "Sorry, I encountered an issue querying the company policy knowledge base. Please try again.",
          timestamp: new Date().toISOString(),
        });
      });
  },
});

export const { clearError, resetChat } = policyAssistantSlice.actions;
export default policyAssistantSlice.reducer;
