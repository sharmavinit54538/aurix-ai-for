import { createSlice } from "@reduxjs/toolkit";
import { fetchPolicyAssistantDashboard } from "./policyAssistantThunk";

export interface PolicyAssistantState {
  asking: boolean;
  loading: boolean;
  error: string | null;
  messages: Array<{ id: string; sender: "user" | "assistant"; text: string }>;
  summary: any;
}

const initialState: PolicyAssistantState = {
  asking: false,
  loading: false,
  error: null,
  messages: [
    { id: "1", sender: "assistant", text: "Hello! How can I assist you with company policies, leave rules, or benefits today?" },
  ],
  summary: { totalQueriesResolved: 154, topTopic: "Remote Work & Expenses" },
};

export const policyAssistantSlice = createSlice({
  name: "policyAssistant",
  initialState,
  reducers: {
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolicyAssistantDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPolicyAssistantDashboard.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload.messages) {
          state.messages = action.payload.messages;
        }
        state.summary = action.payload.summary;
      })
      .addCase(fetchPolicyAssistantDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load policy assistant";
      });
  },
});

export const { addMessage } = policyAssistantSlice.actions;
export default policyAssistantSlice.reducer;
