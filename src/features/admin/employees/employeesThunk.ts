import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiInstance } from "@/api";
import { getErrorMessage } from "@/api/utils";
import type {
  CreateEmployeePayload,
  Employee,
  FetchEmployeesParams,
  UpdateEmployeePayload,
} from "./employeesTypes";

function mapEmployee(emp: Record<string, unknown>): Employee {
  return {
    id: String(emp.id ?? ""),
    employeeId: String(emp.employee_id ?? ""),
    fullName: `${emp.first_name ?? ""} ${emp.last_name ?? ""}`.trim(),
    email: String(emp.company_email ?? emp.personal_email ?? ""),
    phone: String(emp.phone ?? ""),
    department: String(emp.department ?? ""),
    designation: String(emp.designation ?? ""),
    joiningDate: String(emp.joining_date ?? ""),
    managerName: "",
    shift: String(emp.shift ?? "General"),
    status: String(emp.status ?? "INVITED"),
    activationToken: emp.activation_token as string | undefined,
    activationTokenExpiresAt: emp.activation_token_expires_at as string | undefined,
  };
}

export const fetchEmployees = createAsyncThunk<
  Employee[],
  FetchEmployeesParams | void,
  { rejectValue: string }
>("employees/fetchEmployees", async (params, thunkAPI) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.department && params.department !== "all") {
      searchParams.set("department", params.department);
    }
    searchParams.set("limit", String(params?.limit ?? 100));

    const response = await apiInstance.get(`/employees?${searchParams.toString()}`);
    const items = response.data?.data?.items ?? [];
    return items.map((item: Record<string, unknown>) => mapEmployee(item));
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to fetch employees"));
  }
});

export const createEmployee = createAsyncThunk<
  void,
  CreateEmployeePayload,
  { rejectValue: string }
>("employees/createEmployee", async (payload, thunkAPI) => {
  try {
    console.log(payload);
    await apiInstance.post("/employees", payload);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to add employee"));
  }
});

export const updateEmployee = createAsyncThunk<
  void,
  { id: string; payload: UpdateEmployeePayload },
  { rejectValue: string }
>("employees/updateEmployee", async ({ id, payload }, thunkAPI) => {
  try {
    await apiInstance.put(`/employees/${id}`, payload);
  } catch (error) {
    return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to update employee"));
  }
});

export const deleteEmployee = createAsyncThunk<string, string, { rejectValue: string }>(
  "employees/deleteEmployee",
  async (id, thunkAPI) => {
    try {
      await apiInstance.delete(`/employees/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to remove employee"));
    }
  },
);

export const resendEmployeeInvite = createAsyncThunk<void, string, { rejectValue: string }>(
  "employees/resendEmployeeInvite",
  async (id, thunkAPI) => {
    try {
      await apiInstance.post(`/employees/${id}/send-invite`);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to resend invitation"));
    }
  },
);

export const deactivateEmployee = createAsyncThunk<void, string, { rejectValue: string }>(
  "employees/deactivateEmployee",
  async (id, thunkAPI) => {
    try {
      await apiInstance.post(`/employees/${id}/deactivate`);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to deactivate employee"));
    }
  },
);

export const activateEmployee = createAsyncThunk<void, string, { rejectValue: string }>(
  "employees/activateEmployee",
  async (id, thunkAPI) => {
    try {
      await apiInstance.post(`/employees/${id}/activate-by-admin`);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to activate employee"));
    }
  },
);

export const resetEmployeePassword = createAsyncThunk<void, string, { rejectValue: string }>(
  "employees/resetEmployeePassword",
  async (id, thunkAPI) => {
    try {
      await apiInstance.post(`/employees/${id}/reset-password`);
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to reset password"));
    }
  },
);
