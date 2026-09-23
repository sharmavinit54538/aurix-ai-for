import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/redux/store";

export const selectPolicyAssistantState = (state: RootState) => state.policyAssistant;

export const selectPolicyAssistantLoading = createSelector(
  [selectPolicyAssistantState],
  (state) => state?.loading ?? false,
);

export const selectPolicyAssistantAsking = createSelector(
  [selectPolicyAssistantState],
  (state) => state?.asking ?? false,
);

export const selectPolicyAssistantError = createSelector(
  [selectPolicyAssistantState],
  (state) => state?.error ?? null,
);

export const selectPolicyAssistantMessages = createSelector(
  [selectPolicyAssistantState],
  (state) => (Array.isArray(state?.messages) ? state.messages : []),
);

export const selectPolicyAssistantSummary = createSelector(
  [selectPolicyAssistantState],
  (state) => state?.summary ?? null,
);
