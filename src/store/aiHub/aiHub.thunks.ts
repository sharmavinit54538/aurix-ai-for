import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api/client";
import type { ChatConversation, ChatMessage } from "./aiHub.types";

export const fetchChatConversations = createAsyncThunk<
  ChatConversation[],
  void
>("aiHub/fetchConversations", async () => {
  const res = await api.get<any>("/ai-hub/conversations");
  const d = res?.data ?? res;
  return Array.isArray(d) ? d : Array.isArray(d?.items) ? d.items : [];
});

export const fetchChatConversation = createAsyncThunk<
  ChatConversation,
  string
>("aiHub/fetchConversation", async (id) => {
  const res = await api.get<any>(
    `/ai-hub/conversations/${encodeURIComponent(id)}`,
  );
  const d = res?.data ?? res ?? {};
  return {
    id: String(d.id || id),
    title: String(d.title || "Conversation"),
    createdAt: String(d.createdAt || new Date().toISOString()),
    updatedAt: String(d.updatedAt || new Date().toISOString()),
    messages: Array.isArray(d.messages) ? d.messages : [],
  };
});

export const createChatConversation = createAsyncThunk<
  ChatConversation,
  { title?: string } | void
>("aiHub/createConversation", async (payload) => {
  const res = await api.post<any>("/ai-hub/conversations", {
    title: payload?.title || "New Chat",
  });
  const d = res?.data ?? res ?? {};
  return {
    id: String(d.id || `conv-${Date.now()}`),
    title: String(d.title || payload?.title || "New Chat"),
    createdAt: String(d.createdAt || new Date().toISOString()),
    updatedAt: String(d.updatedAt || new Date().toISOString()),
    messages: Array.isArray(d.messages) ? d.messages : [],
  };
});

export const sendChatMessage = createAsyncThunk<
  ChatMessage,
  { conversationId?: string; message: string } | string
>("aiHub/sendMessage", async (input) => {
  const text = typeof input === "string" ? input : input.message;
  const conversationId =
    typeof input === "string" ? undefined : input.conversationId;
  const res = await api.post<any>("/ai-hub/query", {
    prompt: text,
    message: text,
    conversationId,
  });
  const d = res?.data ?? res ?? {};
  return {
    id: String(d.id || `msg-${Date.now()}`),
    role: "assistant",
    content: String(d.content || d.text || d.reply || ""),
    timestamp: String(d.timestamp || new Date().toISOString()),
  };
});

export const deleteChatConversation = createAsyncThunk<string, string>(
  "aiHub/deleteConversation",
  async (id) => {
    await api.delete(`/ai-hub/conversations/${encodeURIComponent(id)}`);
    return id;
  },
);
