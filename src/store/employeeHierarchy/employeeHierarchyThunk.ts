import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchEmployeeHierarchyApi, fetchEmployeeReportingDetailsApi } from "@/services/employeeHierarchyApi";
import { fetchOrganizationalGraphApi } from "@/services/organizationalGraphApi";
import type { BackendHierarchyNode, ReportingChainDetails } from "./employeeHierarchyTypes";
import type { OrganizationalGraphData } from "./organizationalGraphTypes";

export const fetchEmployeeHierarchy = createAsyncThunk<
  BackendHierarchyNode[],
  void,
  { rejectValue: string }
>("employeeHierarchy/fetchHierarchy", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchEmployeeHierarchyApi();
    return data;
  } catch (err: unknown) {
    const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
    return rejectWithValue(
      errorObj?.response?.data?.message || errorObj?.message || "Failed to load employee hierarchy from backend."
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
  } catch (err: unknown) {
    const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
    return rejectWithValue(
      errorObj?.response?.data?.message || errorObj?.message || "Failed to load employee reporting details."
    );
  }
});

export const fetchOrganizationalGraph = createAsyncThunk<
  OrganizationalGraphData,
  void,
  { rejectValue: string }
>("employeeHierarchy/fetchOrganizationalGraph", async (_, { rejectWithValue }) => {
  try {
    const data = await fetchOrganizationalGraphApi();
    return data;
  } catch (err: unknown) {
    const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
    return rejectWithValue(
      errorObj?.response?.data?.message || errorObj?.message || "Failed to load organizational graph data."
    );
  }
});

