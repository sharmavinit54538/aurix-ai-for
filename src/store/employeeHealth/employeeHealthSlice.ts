import { createSlice } from "@reduxjs/toolkit";
import { fetchEmployeeHealthDashboard } from "./employeeHealthThunk";

export interface EmployeeHealthState {
  loading: boolean;
  error: string | null;
  data: any;
}

const initialState: EmployeeHealthState = {
  loading: false,
  error: null,
  data: null,
};

export const employeeHealthSlice = createSlice({
  name: "employeeHealth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployeeHealthDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployeeHealthDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEmployeeHealthDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch employee health metrics";
      });
  },
});

export default employeeHealthSlice.reducer;
