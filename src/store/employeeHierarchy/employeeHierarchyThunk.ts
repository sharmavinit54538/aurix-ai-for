import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchEmployeeHierarchyApi, fetchEmployeeReportingDetailsApi } from "@/services/employeeHierarchyApi";
import type { BackendHierarchyNode, ReportingChainDetails } from "./employeeHierarchyTypes";

export const fetchEmployeeHierarchy = createAsyncThunk<
  BackendHierarchyNode[],
  void,
  { rejectValue: string }
>("employeeHierarchy/fetchHierarchy", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchEmployeeHierarchyApi();
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || err?.message || "Failed to load employee hierarchy from backend."
    );
  }
});

export const fetchEmployeeReportingDetails = createAsyncThunk<
  ReportingChainDetails,
  string,
  { rejectValue: string }
>("employeeHierarchy/fetchReportingDetails", async (employeeId, { rejectWithValue }) => {
  try {
    const data = await fetchEmployeeReportingDetailsApi(employeeId);
    return data;
  } catch (err: any) {
    return rejectWithValue(
      err?.response?.data?.message || err?.message || "Failed to load employee reporting details."
    );
  }
});
