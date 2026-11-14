import { createSlice } from "@reduxjs/toolkit";
import {
  askPolicyQuestion,
  fetchPolicyAssistantDashboard,
} from "./policyAssistantThunk";

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
  messages: [],
  summary: null,
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
        state.error = null;
      })
      .addCase(fetchPolicyAssistantDashboard.fulfilled, (state, action) => {
        state.loading = false;
        if (Array.isArray(action.payload?.messages)) {
          state.messages = action.payload.messages;
        }
        state.summary = action.payload?.summary ?? null;
      })
      .addCase(fetchPolicyAssistantDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to load policy assistant";
      })
      .addCase(askPolicyQuestion.pending, (state) => {
        state.asking = true;
      })
      .addCase(askPolicyQuestion.fulfilled, (state, action) => {
        state.asking = false;
        if (action.payload) {
          state.messages.push(action.payload);
        }
      })
      .addCase(askPolicyQuestion.rejected, (state) => {
        state.asking = false;
      });
  },
});

export const { addMessage } = policyAssistantSlice.actions;
export default policyAssistantSlice.reducer;
