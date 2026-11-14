import type { RootState } from "@/redux/store";

export const selectPolicyAssistantAsking = (state: RootState) => state.policyAssistant?.asking ?? false;
export const selectPolicyAssistantLoading = (state: RootState) => state.policyAssistant?.loading ?? false;
export const selectPolicyAssistantError = (state: RootState) => state.policyAssistant?.error ?? null;
export const selectPolicyAssistantMessages = (state: RootState) => state.policyAssistant?.messages ?? [];
export const selectPolicyAssistantSummary = (state: RootState) => state.policyAssistant?.summary ?? {};
