import { createSlice } from "@reduxjs/toolkit";
import type { EmployeesState } from "./employeesTypes";
import {
  activateEmployee,
  createEmployee,
  deactivateEmployee,
  deleteEmployee,
  fetchEmployees,
  resendEmployeeInvite,
  resetEmployeePassword,
  updateEmployee,
} from "./employeesThunk";

const initialState: EmployeesState = {
  employees: [],
  loading: false,
  submitting: false,
  error: null,
};

const mutationThunks = [
  createEmployee,
  updateEmployee,
  resendEmployeeInvite,
  deactivateEmployee,
  activateEmployee,
  resetEmployeePassword,
];

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    clearEmployees(state) {
      state.employees = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = action.payload;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error.message ?? "Something went wrong";
      })
        .addCase(deleteEmployee.pending, (state) => {
        state.submitting = true;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.submitting = false;
        state.employees = state.employees.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteEmployee.rejected, (state) => {
        state.submitting = false;
      });

    mutationThunks.forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.submitting = true;
        })
        .addCase(thunk.fulfilled, (state) => {
          state.submitting = false;
        })
        .addCase(thunk.rejected, (state) => {
          state.submitting = false;
        });
    });
  },
});

export const { clearEmployees } = employeesSlice.actions;
export default employeesSlice.reducer;
