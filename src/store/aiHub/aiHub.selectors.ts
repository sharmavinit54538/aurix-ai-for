import type { RootState } from "@/redux/store";

export const selectAIHubMessages = (state: RootState) => state.aiHub?.messages ?? [];
export const selectAIHubLoading = (state: RootState) => state.aiHub?.loading ?? false;
export const selectAIHubError = (state: RootState) => state.aiHub?.error ?? null;
export const selectAIHubOperationLoading = (state: RootState) => state.aiHub?.operationLoading ?? false;
export const selectAIHubOperationError = (state: RootState) => state.aiHub?.operationError ?? null;
export const selectWorkforcePlanningData = (state: RootState) => state.aiHub?.workforcePlanning ?? null;

export const selectChatAssistant = (state: RootState) => ({
  conversations: state.aiHub?.conversations ?? [],
  activeConversationId: state.aiHub?.activeConversationId ?? null,
  messages: state.aiHub?.messages ?? [],
  loading: state.aiHub?.loading ?? false,
  error: state.aiHub?.error ?? null,
});
