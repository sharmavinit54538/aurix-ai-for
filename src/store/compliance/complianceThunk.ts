import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/api";

export const fetchComplianceReport = createAsyncThunk(
  "compliance/fetchComplianceReport",
  async (payload?: any) => {
    try {
      const response = await api.post("compliance/report", payload || {});
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
);

export const detectPolicyViolations = createAsyncThunk(
  "compliance/detectPolicyViolations",
  async (payload?: any) => {
    try {
      const response = await api.post("compliance/violations", payload || {});
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
);

export const queryPolicyAssistant = createAsyncThunk(
  "compliance/queryPolicyAssistant",
  async (payload: { query: string }) => {
    try {
      const response = await api.post("compliance/policy-assistant", payload);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
);
