import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/api/utils";
import policyAssistantApi from "@/services/policyAssistantApi";
import type {
  PolicyAnswerResponse,
  PolicyAssistantDashboardData,
} from "./policyAssistantTypes";

export const fetchPolicyAssistantDashboard = createAsyncThunk<
  PolicyAssistantDashboardData,
  void,
  { rejectValue: string }
>("policyAssistant/fetchDashboard", async (_, thunkAPI) => {
  try {
    return await policyAssistantApi.getDashboard();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load policy assistant data"),
    );
  }
});

export const askPolicyQuestion = createAsyncThunk<
  PolicyAnswerResponse,
  string,
  { rejectValue: string }
>("policyAssistant/askQuestion", async (question, thunkAPI) => {
  try {
    return await policyAssistantApi.askQuestion(question);
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Unable to get an answer from Policy Assistant. Please try again."),
    );
  }
});
