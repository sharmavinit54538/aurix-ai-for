import { createAsyncThunk } from "@reduxjs/toolkit";
import aiHubApi, { normalizeAIError } from "@/services/aiHub.api";
import type {
  ChatConversation,
  ChatMessage,
  CreateConversationPayload,
  PaginationParams,
  SendChatMessagePayload,
} from "./aiHub.types";

export const fetchChatConversations = createAsyncThunk<
  ChatConversation[],
  PaginationParams | undefined,
  { rejectValue: string }
>("aiHub/fetchChatConversations", async (params, { rejectWithValue }) => {
  try {
    return await aiHubApi.getChatConversations(params);
  } catch (err) {
    return rejectWithValue(normalizeAIError(err).message);
  }
});

export const fetchChatConversation = createAsyncThunk<
  ChatConversation,
  string,
  { rejectValue: string }
>("aiHub/fetchChatConversation", async (id, { rejectWithValue }) => {
  try {
    return await aiHubApi.getChatConversation(id);
  } catch (err) {
    return rejectWithValue(normalizeAIError(err).message);
  }
});

export const createChatConversation = createAsyncThunk<
  ChatConversation,
  CreateConversationPayload | undefined,
  { rejectValue: string }
>("aiHub/createChatConversation", async (payload, { rejectWithValue }) => {
  try {
    return await aiHubApi.createChatConversation(payload);
  } catch (err) {
    return rejectWithValue(normalizeAIError(err).message);
  }
});

export const sendChatMessage = createAsyncThunk<
  ChatMessage,
  SendChatMessagePayload,
  { rejectValue: string }
>("aiHub/sendChatMessage", async (input, { rejectWithValue, signal }) => {
  try {
    const content = (input.content ?? input.message ?? input.query ?? "").trim();
    return await aiHubApi.sendChatMessage(
      {
        ...input,
        content,
        message: content,
      },
      { signal },
    );
  } catch (err) {
    return rejectWithValue(normalizeAIError(err).message);
  }
});

export const deleteChatConversation = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("aiHub/deleteChatConversation", async (id, { rejectWithValue }) => {
  try {
    await aiHubApi.deleteChatConversation(id);
    return id;
  } catch (err) {
    return rejectWithValue(normalizeAIError(err).message);
  }
});
