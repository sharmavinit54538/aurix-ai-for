import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "@/api/utils";
import meetingIntelligenceApi from "@/services/meetingIntelligenceApi";
import type {
  ActionItemsByWeekItem,
  MeetingActionItemSummary,
  MeetingIntelligenceDashboardData,
  MeetingIntelligenceKpiItem,
  MeetingVolumeItem,
} from "./meetingIntelligenceTypes";

export const fetchMeetingIntelligenceDashboard = createAsyncThunk<
  MeetingIntelligenceDashboardData,
  void,
  { rejectValue: string }
>("meetingIntelligence/fetchDashboard", async (_, thunkAPI) => {
  try {
    return await meetingIntelligenceApi.getDashboard();
  } catch (err) {
    // If combined dashboard endpoint fails, attempt to fetch individual sections in parallel
    try {
      const [kpiRes, actionItemsRes, volumeRes] = await Promise.allSettled([
        meetingIntelligenceApi.getKpi(),
        meetingIntelligenceApi.getActionItems(),
        meetingIntelligenceApi.getVolume(),
      ]);

      let actionItemsList: MeetingActionItemSummary[] | undefined = undefined;
      let actionItemsByWeek: ActionItemsByWeekItem[] | undefined = undefined;

      if (actionItemsRes.status === "fulfilled" && Array.isArray(actionItemsRes.value)) {
        const first = actionItemsRes.value[0] as any;
        if (first && "w" in first) {
          actionItemsByWeek = actionItemsRes.value as ActionItemsByWeekItem[];
        } else {
          actionItemsList = actionItemsRes.value as MeetingActionItemSummary[];
        }
      }

      const meetingVolume = volumeRes.status === "fulfilled" && Array.isArray(volumeRes.value)
        ? volumeRes.value
        : undefined;

      const dashboardData: MeetingIntelligenceDashboardData = {
        kpi: kpiRes.status === "fulfilled" ? kpiRes.value : undefined,
        actionItems: actionItemsList,
        actionItemsByWeek,
        meetingVolume,
        charts: {
          actionItemsByWeek: actionItemsByWeek ?? [],
          meetingVolume: meetingVolume ?? [],
        },
      };

      const hasData = [kpiRes, actionItemsRes, volumeRes].some((res) => res.status === "fulfilled");

      if (!hasData) {
        return thunkAPI.rejectWithValue(
          getErrorMessage(err, "Failed to load Meeting Intelligence dashboard data"),
        );
      }

      return dashboardData;
    } catch {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to load Meeting Intelligence dashboard data"),
      );
    }
  }
});

export const fetchMeetingIntelligenceKpi = createAsyncThunk<
  MeetingIntelligenceKpiItem[],
  void,
  { rejectValue: string }
>("meetingIntelligence/fetchKpi", async (_, thunkAPI) => {
  try {
    return await meetingIntelligenceApi.getKpi();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load meeting intelligence KPI metrics"),
    );
  }
});

export const fetchMeetingActionItems = createAsyncThunk<
  ActionItemsByWeekItem[] | MeetingActionItemSummary[],
  void,
  { rejectValue: string }
>("meetingIntelligence/fetchActionItems", async (_, thunkAPI) => {
  try {
    return await meetingIntelligenceApi.getActionItems();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load meeting action items"),
    );
  }
});

export const fetchMeetingVolume = createAsyncThunk<
  MeetingVolumeItem[],
  void,
  { rejectValue: string }
>("meetingIntelligence/fetchVolume", async (_, thunkAPI) => {
  try {
    return await meetingIntelligenceApi.getVolume();
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to load meeting volume"),
    );
  }
});
