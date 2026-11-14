import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AIHubState, ChatMessage } from "./aiHub.types";
import {
  fetchChatConversations,
  createChatConversation,
  sendChatMessage,
  deleteChatConversation,
} from "./aiHub.thunks";

const initialState: AIHubState = {
  messages: [],
  conversations: [],
  activeConversationId: null,
  loading: false,
  error: null,
  operationLoading: false,
  operationError: null,
  workforcePlanning: null as any,
};

export const aiHubSlice = createSlice({
  name: "aiHub",
  initialState,
  reducers: {
    addMessage(state, action: PayloadAction<ChatMessage>) {
      state.messages.push(action.payload);
    },
    setActiveConversation(state, action: PayloadAction<string | null>) {
      state.activeConversationId = action.payload;
    },
    clearOperationStatus(state) {
      state.operationLoading = false;
      state.operationError = null;
    },
    clearMessages(state) {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatConversations.fulfilled, (state, action) => {
        state.conversations = action.payload;
        if (!state.activeConversationId && action.payload.length > 0) {
          state.activeConversationId = action.payload[0].id;
        }
      })
      .addCase(createChatConversation.fulfilled, (state, action) => {
        state.conversations.unshift(action.payload);
        state.activeConversationId = action.payload.id;
        state.messages = action.payload.messages;
      })
      .addCase(sendChatMessage.pending, (state) => {
        state.operationLoading = true;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError =
          action.error.message || "Failed to send message";
      })
      .addCase(deleteChatConversation.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter(
          (c) => c.id !== action.payload,
        );
        if (state.activeConversationId === action.payload) {
          state.activeConversationId = state.conversations[0]?.id || null;
        }
      });
  },
});

export const {
  addMessage,
  setActiveConversation,
  clearOperationStatus,
  clearMessages,
} = aiHubSlice.actions;
export default aiHubSlice.reducer;
