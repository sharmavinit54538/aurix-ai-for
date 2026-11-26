import { createSlice } from "@reduxjs/toolkit";
import type { EmployeesState } from "./employeesTypes";
import {
  activateEmployee,
  activateEmployeeByToken,
  createEmployee,
  deactivateEmployee,
  deleteEmployee,
  fetchEmployeeById,
  fetchEmployees,
  fetchEmployeeOnboardingStatus,
  fetchEmployeeStatistics,
  resendEmployeeInvite,
  resetEmployeePassword,
  updateEmployee,
  validateEmployeeInvitation,
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
  selectedEmployee: null,
  employeeDetailLoading: false,
  statistics: null,
  statisticsLoading: false,
  onboardingStatus: null,
  onboardingStatusLoading: false,
};

const mutationThunks = [
  createEmployee,
  updateEmployee,
];

const employeesSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    clearEmployees(state) {
      state.employees = [];
      state.error = null;
    },
    clearSelectedEmployee(state) {
      state.selectedEmployee = null;
    },
    setSelectedEmployee(state, action) {
      state.selectedEmployee = action.payload;
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
      .addCase(fetchEmployeeById.pending, (state) => {
        state.employeeDetailLoading = true;
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        state.employeeDetailLoading = false;
        state.selectedEmployee = action.payload;
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        state.employeeDetailLoading = false;
        const err = action.payload;
        state.error = typeof err === "string" ? err : err?.message ?? action.error.message ?? "Failed to fetch employee";
      })
      .addCase(fetchEmployeeStatistics.pending, (state) => {
        state.statisticsLoading = true;
      })
      .addCase(fetchEmployeeStatistics.fulfilled, (state, action) => {
        state.statisticsLoading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchEmployeeStatistics.rejected, (state, action) => {
        state.statisticsLoading = false;
        const err = action.payload;
        state.error = typeof err === "string" ? err : err?.message ?? action.error.message ?? "Failed to fetch statistics";
      })
      .addCase(fetchEmployeeOnboardingStatus.pending, (state) => {
        state.onboardingStatusLoading = true;
      })
      .addCase(fetchEmployeeOnboardingStatus.fulfilled, (state, action) => {
        state.onboardingStatusLoading = false;
        state.onboardingStatus = action.payload;
      })
      .addCase(fetchEmployeeOnboardingStatus.rejected, (state, action) => {
        state.onboardingStatusLoading = false;
        const err = action.payload;
        state.error = typeof err === "string" ? err : err?.message ?? action.error.message ?? "Failed to fetch onboarding status";
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

    builder
      .addCase(activateEmployee.pending, (state) => {
        state.submitting = true;
      })
      .addCase(activateEmployee.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(activateEmployee.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(activateEmployeeByToken.pending, (state) => {
        state.submitting = true;
      })
      .addCase(activateEmployeeByToken.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(activateEmployeeByToken.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(resendEmployeeInvite.pending, (state) => {
        state.submitting = true;
      })
      .addCase(resendEmployeeInvite.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(resendEmployeeInvite.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(deactivateEmployee.pending, (state) => {
        state.submitting = true;
      })
      .addCase(deactivateEmployee.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(deactivateEmployee.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(resetEmployeePassword.pending, (state) => {
        state.submitting = true;
      })
      .addCase(resetEmployeePassword.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(resetEmployeePassword.rejected, (state) => {
        state.submitting = false;
      })
      .addCase(validateEmployeeInvitation.pending, (state) => {
        state.submitting = true;
      })
      .addCase(validateEmployeeInvitation.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(validateEmployeeInvitation.rejected, (state) => {
        state.submitting = false;
      });
  },
});

export const {
  clearEmployees,
  clearSelectedEmployee,
  setSelectedEmployee,
} = employeesSlice.actions;
export default employeesSlice.reducer;