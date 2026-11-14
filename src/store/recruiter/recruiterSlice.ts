import { createSlice } from "@reduxjs/toolkit";
import { fetchRecruiterDashboard } from "./recruiterThunk";

export interface RecruiterState {
  loading: boolean;
  error: string | null;
  data: any;
}

const initialState: RecruiterState = {
  loading: false,
  error: null,
  data: null,
};

export const recruiterSlice = createSlice({
  name: "aiRecruiter",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecruiterDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecruiterDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRecruiterDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || "Failed to fetch recruiter dashboard";
      });
  },
});

export default recruiterSlice.reducer;
