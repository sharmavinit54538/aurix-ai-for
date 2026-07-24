import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api";

// Assuming we have some data shapes according to the prompt
export const fetchWorkforceInsights = createAsyncThunk(
  "aiBrain/fetchWorkforceInsights",
  async (payload?: any) => {
    try {
      const response = await api.post("ai-brain/workforce-insights", payload || {});
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
);

export const fetchMeetingIntelligence = createAsyncThunk(
  "aiBrain/fetchMeetingIntelligence",
  async (payload: any) => {
    try {
      const response = await api.post("ai-brain/meeting-intelligence", payload);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
);

export const fetchEmployeeHealthSentiment = createAsyncThunk(
  "aiBrain/fetchEmployeeHealthSentiment",
  async (payload?: any) => {
    try {
      const response = await api.post("ai-brain/employee-health", payload || {});
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
);
