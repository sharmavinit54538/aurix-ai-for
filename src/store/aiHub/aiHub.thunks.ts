import { createAsyncThunk } from "@reduxjs/toolkit";
import type { ChatConversation, ChatMessage } from "./aiHub.types";

export const fetchChatConversations = createAsyncThunk<ChatConversation[], void>(
  "aiHub/fetchConversations",
  async () => {
    return [
      {
        id: "conv-1",
        title: "Q3 Hiring & Headcount Strategy",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        messages: [
          {
            id: "m-1",
            role: "assistant",
            content: "Welcome! I can help you query workforce metrics, plan hiring pipelines, and automate HR workflows.",
            timestamp: new Date().toISOString(),
          },
        ],
      },
    ];
  }
);

export const fetchChatConversation = createAsyncThunk<ChatConversation, string>(
  "aiHub/fetchConversation",
  async (id) => {
    return {
      id,
      title: "Conversation " + id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    };
  }
);

export const createChatConversation = createAsyncThunk<ChatConversation, { title?: string } | void>(
  "aiHub/createConversation",
  async (payload) => {
    const title = payload?.title || "New Chat";
    return {
      id: `conv-${Date.now()}`,
      title,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `m-${Date.now()}`,
          role: "assistant",
          content: "Hello! How can I assist you with your operations today?",
          timestamp: new Date().toISOString(),
        },
      ],
    };
  }
);

export const sendChatMessage = createAsyncThunk<ChatMessage, { conversationId?: string; message: string } | string>(
  "aiHub/sendMessage",
  async (input) => {
    const text = typeof input === "string" ? input : input.message;
    return {
      id: `msg-${Date.now()}`,
      role: "assistant",
      content: `I've processed your query: "${text}". All relevant data insights have been compiled.`,
      timestamp: new Date().toISOString(),
    };
  }
);

export const deleteChatConversation = createAsyncThunk<string, string>(
  "aiHub/deleteConversation",
  async (id) => {
    return id;
  }
);
