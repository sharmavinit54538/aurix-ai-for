import { createSlice } from "@reduxjs/toolkit";

export interface AnalyticsState {
  data: any;
  loading: boolean;
  error: string | null;
}

const initialState: AnalyticsState = {
  data: {},
  loading: false,
  error: null,
};

export const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
});

export default analyticsSlice.reducer;
