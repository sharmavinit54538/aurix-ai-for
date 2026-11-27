import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  AIHubSliceState,
  ChatConversation,
  ChatMessage,
  MessageDeliveryStatus,
} from "./aiHub.types";
import {
  createChatConversation,
  deleteChatConversation,
  fetchChatConversation,
  fetchChatConversations,
  sendChatMessage,
} from "./aiHub.thunks";

const initialState: AIHubSliceState = {
  conversations: [],
  activeConversationId: null,
  messages: {},
  operationLoading: {},
  operationError: {},
};

function mergeMessages(existing: ChatMessage[], incoming: ChatMessage[]): ChatMessage[] {
  const result = [...existing];
  for (const msg of incoming) {
    const idx = result.findIndex(
      (m) =>
        m.id === msg.id ||
        (Boolean(msg.clientMessageId) &&
          m.clientMessageId === msg.clientMessageId &&
          m.sender === msg.sender),
    );
    if (idx !== -1) {
      result[idx] = { ...result[idx], ...msg };
    } else {
      result.push(msg);
    }
  }
  return result;
}

const aiHubSlice = createSlice({
  name: "aiHub",
  initialState,
  reducers: {
    setActiveConversation(state, action: PayloadAction<string | null>) {
      state.activeConversationId = action.payload;
    },
    clearOperationStatus(state, action: PayloadAction<string>) {
      state.operationLoading[action.payload] = false;
      state.operationError[action.payload] = null;
    },
    upsertConversationSummary(state, action: PayloadAction<ChatConversation>) {
      const conv = action.payload;
      const idx = state.conversations.findIndex((c) => c.id === conv.id);
      if (idx !== -1) {
        state.conversations[idx] = { ...state.conversations[idx], ...conv };
      } else {
        state.conversations.unshift(conv);
      }
    },
    migrateConversationMessages(
      state,
      action: PayloadAction<{ fromId: string; toId: string; title?: string }>,
    ) {
      const { fromId, toId, title } = action.payload;
      if (!fromId || !toId || fromId === toId) return;
      const sourceMsgs = state.messages[fromId] || [];
      const targetMsgs = state.messages[toId] || [];
      state.messages[toId] = mergeMessages(
        targetMsgs,
        sourceMsgs.map((m) => ({ ...m, conversationId: toId })),
      );
      delete state.messages[fromId];
      if (state.activeConversationId === fromId) {
        state.activeConversationId = toId;
      }
      const existsIdx = state.conversations.findIndex((c) => c.id === toId);
      const fromIdx = state.conversations.findIndex((c) => c.id === fromId);
      const nowIso = new Date().toISOString();
      if (existsIdx === -1) {
        const prev = fromIdx !== -1 ? state.conversations[fromIdx] : null;
        state.conversations.unshift({
          id: toId,
          title: title || prev?.title || "New Conversation",
          agentId: prev?.agentId || "general-copilot",
          messages: [],
          lastMessage: state.messages[toId]?.[state.messages[toId].length - 1]?.content,
          messageCount: state.messages[toId]?.length || 0,
          createdAt: prev?.createdAt || nowIso,
          updatedAt: nowIso,
        });
      }
      if (fromIdx !== -1) {
        state.conversations.splice(
          state.conversations.findIndex((c) => c.id === fromId),
          1,
        );
      }
    },
    addLocalMessage(state, action: PayloadAction<{ conversationId: string; message: ChatMessage }>) {
      const { conversationId, message } = action.payload;
      state.messages[conversationId] = mergeMessages(state.messages[conversationId] ?? [], [message]);
    },
    clearMessages(state, action: PayloadAction<string | undefined>) {
      if (action.payload) {
        delete state.messages[action.payload];
      } else {
        state.messages = {};
      }
    },
    updateMessageStatus(
      state,
      action: PayloadAction<{
        conversationId: string;
        messageId?: string;
        clientMessageId?: string;
        status: MessageDeliveryStatus;
        errorMessage?: string;
        errorCode?: string;
        retryable?: boolean;
        failed?: boolean;
      }>,
    ) {
      const { conversationId, messageId, clientMessageId, status, errorMessage, errorCode, retryable, failed } =
        action.payload;
      const list = state.messages[conversationId];
      if (!list) return;
      for (const msg of list) {
        const matchesId = messageId && msg.id === messageId;
        const matchesCmid = clientMessageId && msg.clientMessageId === clientMessageId;
        if (matchesId || matchesCmid) {
          msg.status = status;
          if (failed !== undefined) msg.failed = failed;
          else msg.failed = status === "failed";
          if (errorMessage !== undefined) msg.errorMessage = errorMessage;
          if (errorCode !== undefined) msg.errorCode = errorCode;
          if (retryable !== undefined) msg.retryable = retryable;
        }
      }
    },
    appendStreamChunk(
      state,
      action: PayloadAction<{
        conversationId: string;
        assistantMessageId: string;
        clientMessageId: string;
        content: string;
        model?: string;
        provider?: string;
      }>,
    ) {
      const { conversationId, assistantMessageId, clientMessageId, content, model, provider } =
        action.payload;
      const list = state.messages[conversationId];
      if (!list) return;
      const msg = list.find(
        (m) => m.id === assistantMessageId || (m.sender === "ai" && m.clientMessageId === clientMessageId),
      );
      if (msg) {
        msg.content = content;
        msg.status = "streaming";
        msg.failed = false;
        if (model) msg.model = model;
        if (provider) msg.provider = provider;
      }
    },
    finalizeStreamMessage(
      state,
      action: PayloadAction<{
        conversationId: string;
        assistantMessageId: string;
        clientMessageId: string;
        completed: ChatMessage;
      }>,
    ) {
      const { conversationId, assistantMessageId, clientMessageId, completed } = action.payload;
      const list = state.messages[conversationId] ?? [];
      const idx = list.findIndex(
        (m) => m.id === assistantMessageId || (m.sender === "ai" && m.clientMessageId === clientMessageId),
      );
      const finalMsg: ChatMessage = {
        ...completed,
        conversationId,
        clientMessageId,
        status: completed.status || "completed",
        failed: false,
      };
      if (idx !== -1) {
        list[idx] = finalMsg;
      } else {
        list.push(finalMsg);
      }
      state.messages[conversationId] = list;

      const userMsg = list.find((m) => m.sender === "user" && m.clientMessageId === clientMessageId);
      if (userMsg) {
        userMsg.status = "completed";
        userMsg.failed = false;
      }

      const convIdx = state.conversations.findIndex((c) => c.id === conversationId);
      if (convIdx !== -1) {
        state.conversations[convIdx].lastMessage = finalMsg.content.slice(0, 120);
        state.conversations[convIdx].updatedAt = new Date().toISOString();
      }
    },
    interruptStreamMessage(
      state,
      action: PayloadAction<{
        conversationId: string;
        assistantMessageId: string;
        clientMessageId: string;
        status: "failed" | "cancelled" | "interrupted";
        partialContent?: string;
        errorMessage?: string;
        errorCode?: string;
        retryable?: boolean;
      }>,
    ) {
      const {
        conversationId,
        assistantMessageId,
        clientMessageId,
        status,
        partialContent,
        errorMessage,
        errorCode,
        retryable,
      } = action.payload;
      const list = state.messages[conversationId];
      if (!list) return;
      const aiIdx = list.findIndex(
        (m) => m.id === assistantMessageId || (m.sender === "ai" && m.clientMessageId === clientMessageId),
      );
      if (aiIdx !== -1) {
        const current = list[aiIdx];
        const kept = (partialContent ?? current.content ?? "").trim();
        if (!kept && status === "failed") {
          // Remove blank placeholder bubble and mark user message failed for inline Retry UI
          list.splice(aiIdx, 1);
        } else {
          list[aiIdx] = {
            ...current,
            content: kept || (status === "cancelled" ? "Generation stopped." : current.content),
            status,
            isPartial: Boolean(kept) || status === "interrupted" || status === "cancelled",
            failed: status === "failed" || status === "interrupted",
            errorMessage,
            errorCode,
            retryable: retryable ?? status !== "cancelled",
          };
        }
      }
      const userMsg = list.find((m) => m.sender === "user" && m.clientMessageId === clientMessageId);
      if (userMsg) {
        userMsg.status = status;
        userMsg.failed = status === "failed" || status === "interrupted";
        userMsg.errorMessage = errorMessage;
        userMsg.errorCode = errorCode;
        userMsg.retryable = retryable ?? status !== "cancelled";
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatConversations.pending, (state) => {
        state.operationLoading.fetchChatConversations = true;
        state.operationError.fetchChatConversations = null;
      })
      .addCase(fetchChatConversations.fulfilled, (state, action) => {
        state.operationLoading.fetchChatConversations = false;
        state.conversations = action.payload;
      })
      .addCase(fetchChatConversations.rejected, (state, action) => {
        state.operationLoading.fetchChatConversations = false;
        state.operationError.fetchChatConversations =
          action.payload || action.error.message || "Unable to load chat history.";
      })
      .addCase(fetchChatConversation.pending, (state) => {
        state.operationLoading.fetchChatConversation = true;
        state.operationError.fetchChatConversation = null;
      })
      .addCase(fetchChatConversation.fulfilled, (state, action) => {
        state.operationLoading.fetchChatConversation = false;
        const conv = action.payload;
        if (conv?.id) {
          state.activeConversationId = conv.id;
          if (conv.messages?.length) {
            state.messages[conv.id] = mergeMessages(state.messages[conv.id] ?? [], conv.messages);
          } else if (!state.messages[conv.id]) {
            state.messages[conv.id] = [];
          }
          const idx = state.conversations.findIndex((c) => c.id === conv.id);
          if (idx !== -1) {
            state.conversations[idx] = { ...state.conversations[idx], ...conv };
          }
        }
      })
      .addCase(fetchChatConversation.rejected, (state, action) => {
        state.operationLoading.fetchChatConversation = false;
        state.operationError.fetchChatConversation =
          action.payload || action.error.message || "Unable to load conversation.";
      })
      .addCase(createChatConversation.pending, (state) => {
        state.operationLoading.createChatConversation = true;
        state.operationError.createChatConversation = null;
      })
      .addCase(createChatConversation.fulfilled, (state, action) => {
        state.operationLoading.createChatConversation = false;
        const conv = action.payload;
        if (conv?.id) {
          if (!state.conversations.some((c) => c.id === conv.id)) {
            state.conversations.unshift(conv);
          }
          state.activeConversationId = conv.id;
          if (conv.messages?.length) {
            state.messages[conv.id] = conv.messages;
          } else if (!state.messages[conv.id]) {
            state.messages[conv.id] = [];
          }
        }
      })
      .addCase(createChatConversation.rejected, (state, action) => {
        state.operationLoading.createChatConversation = false;
        state.operationError.createChatConversation =
          action.payload || action.error.message || "Unable to create conversation.";
      })
      .addCase(sendChatMessage.pending, (state) => {
        state.operationLoading.sendChatMessage = true;
        state.operationError.sendChatMessage = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.operationLoading.sendChatMessage = false;
        const convId = action.payload.conversationId || state.activeConversationId;
        if (convId) {
          state.activeConversationId = convId;
          state.messages[convId] = mergeMessages(state.messages[convId] ?? [], [action.payload]);
        }
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.operationLoading.sendChatMessage = false;
        state.operationError.sendChatMessage =
          action.payload || action.error.message || "Unable to generate a response. Please try again.";
      })
      .addCase(deleteChatConversation.pending, (state) => {
        state.operationLoading.deleteChatConversation = true;
        state.operationError.deleteChatConversation = null;
      })
      .addCase(deleteChatConversation.fulfilled, (state, action) => {
        state.operationLoading.deleteChatConversation = false;
        state.conversations = state.conversations.filter((c) => c.id !== action.payload);
        delete state.messages[action.payload];
        if (state.activeConversationId === action.payload) {
          state.activeConversationId = null;
        }
      })
      .addCase(deleteChatConversation.rejected, (state, action) => {
        state.operationLoading.deleteChatConversation = false;
        state.operationError.deleteChatConversation =
          action.payload || action.error.message || "Unable to delete conversation.";
      });
  },
});

export const {
  setActiveConversation,
  clearOperationStatus,
  upsertConversationSummary,
  migrateConversationMessages,
  addLocalMessage,
  clearMessages,
  updateMessageStatus,
  appendStreamChunk,
  finalizeStreamMessage,
  interruptStreamMessage,
} = aiHubSlice.actions;

export const addMessage = addLocalMessage;
export { aiHubSlice };

export default aiHubSlice.reducer;
