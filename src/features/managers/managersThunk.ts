import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiInstance } from "@/api";
import { tryApi } from "@/api/utils";
import { SEED_MANAGERS } from "./constants";
import type { Manager } from "./types";

export const fetchManagers = createAsyncThunk<Manager[], void, { rejectValue: string }>(
  "managers/fetchManagers",
  async (_, thunkAPI) => {
    try {
      const response = await apiInstance.get("/managers");
      const items = response.data?.data?.items ?? response.data?.data ?? response.data ?? [];
      return Array.isArray(items) && items.length > 0 ? items : SEED_MANAGERS;
    } catch (error) {
      return SEED_MANAGERS;
    }
  },
);

export const createManager = createAsyncThunk<Manager, Manager, { rejectValue: string }>(
  "managers/createManager",
  async (manager, thunkAPI) => {
    try {
      await apiInstance.post("/managers", manager);
      return manager;
    } catch (error) {
      return manager;
    }
  },
);

export const updateManager = createAsyncThunk<Manager, Manager, { rejectValue: string }>(
  "managers/updateManager",
  async (manager, thunkAPI) => {
    try {
      await apiInstance.put(`/managers/${manager.id}`, manager);
      return manager;
    } catch (error) {
      return manager;
    }
  },
);

export const deleteManager = createAsyncThunk<string, string, { rejectValue: string }>(
  "managers/deleteManager",
  async (id, thunkAPI) => {
    try {
      await apiInstance.delete(`/managers/${id}`);
    } catch {
      // local fallback until API exists
    }
    return id;
  },
);

export const bulkDeleteManagers = createAsyncThunk<string[], string[], { rejectValue: string }>(
  "managers/bulkDeleteManagers",
  async (ids) => {
    await tryApi(() => apiInstance.post("/managers/bulk-delete", { ids }), undefined);
    return ids;
  },
);

export const bulkSetManagerStatus = createAsyncThunk<
  { ids: string[]; status: Manager["status"] },
  { ids: string[]; status: Manager["status"] },
  { rejectValue: string }
>("managers/bulkSetManagerStatus", async ({ ids, status }) => {
  await tryApi(() => apiInstance.patch("/managers/bulk-status", { ids, status }), undefined);
  return { ids, status };
});

export const importManagers = createAsyncThunk<Manager[], Manager[], { rejectValue: string }>(
  "managers/importManagers",
  async (managers) => {
    await tryApi(() => apiInstance.post("/managers/import", { managers }), undefined);
    return managers;
  },
);
