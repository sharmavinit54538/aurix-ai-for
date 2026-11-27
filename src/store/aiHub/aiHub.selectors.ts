import type { RootState } from "@/redux/store";

export const selectChatAssistant = (state: RootState) => {
  const aiHub = state.aiHub;
  return {
    conversations: aiHub?.conversations ?? [],
    activeConversationId: aiHub?.activeConversationId ?? null,
    messages: aiHub?.messages ?? {},
    data: {
      conversations: aiHub?.conversations ?? [],
      activeConversationId: aiHub?.activeConversationId ?? null,
      messages: aiHub?.messages ?? {},
    },
    loading: Boolean(aiHub?.operationLoading?.fetchChatConversations),
    error: aiHub?.operationError?.fetchChatConversations ?? null,
  };
};

export const selectAIHubOperationLoading = (state: RootState): boolean =>
  Boolean(
    state.aiHub?.operationLoading?.sendChatMessage ||
      state.aiHub?.operationLoading?.createChatConversation,
  );

export const selectAIHubOperationError = (state: RootState): string | null =>
  state.aiHub?.operationError?.sendChatMessage ??
  state.aiHub?.operationError?.createChatConversation ??
  null;
