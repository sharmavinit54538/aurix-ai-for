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
  total: 0,
  page: 1,
  limit: 10,
  pages: 0,
  has_next: false,
  has_previous: false,
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
        state.employees = action.payload.items;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.pages = action.payload.pages;
        state.has_next = action.payload.has_next;
        state.has_previous = action.payload.has_previous;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        const err = action.payload;
        state.error = typeof err === "string" ? err : err?.message ?? action.error.message ?? "Something went wrong";
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
