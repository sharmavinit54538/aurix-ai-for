import { createAsyncThunk } from "@reduxjs/toolkit";
import sidebarApi from "@/services/sidebarApi";
import type { SidebarPermissionsResponse } from "./sidebarTypes";

export const fetchSidebarPermissions = createAsyncThunk<
  SidebarPermissionsResponse,
  string | undefined,
  { rejectValue: string }
>("sidebar/fetchPermissions", async (userRole, { rejectWithValue }) => {
  try {
    const data = await sidebarApi.getPermissions(userRole);
    return data;
  } catch (err: any) {
    return rejectWithValue(err?.message || "Failed to fetch sidebar permissions");
  }
});
