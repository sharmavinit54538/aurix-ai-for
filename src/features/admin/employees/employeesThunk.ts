import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiInstance } from "@/api";
import { parseApiError, type ParsedError } from "@/api/utils";
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
    email: String(emp.personal_email ?? emp.company_email ?? ""),
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
  {
    items: Employee[];
    total: number;
    page: number;
    limit: number;
    pages: number;
    total_pages: number;
    has_next: boolean;
    has_previous: boolean;
  },
  FetchEmployeesParams | void,
  { rejectValue: ParsedError }
>("employees/fetchEmployees", async (params, thunkAPI) => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set("search", params.search);
    if (params?.department && params.department !== "all") {
      searchParams.set("department", params.department);
    }
    if (params?.designation && params.designation !== "all") {
      searchParams.set("designation", params.designation);
    }
    if (params?.shift && params.shift !== "all") {
      searchParams.set("shift", params.shift);
    }
    if (params?.status && params.status !== "all") {
      searchParams.set("status", params.status);
    }
    if (params?.sort) {
      searchParams.set("sort", params.sort);
    }
    if (params?.order) {
      searchParams.set("order", params.order);
    }
    if (params?.page) {
      searchParams.set("page", String(params.page));
    }
    if (params?.limit) {
      searchParams.set("limit", String(params.limit));
    }

    const response = await apiInstance.get(`/employees?${searchParams.toString()}`);
    const data = response.data?.data ?? {};
    const items = data.items ?? [];
    return {
      items: items.map((item: Record<string, unknown>) => mapEmployee(item)),
      total: Number(data.total ?? 0),
      page: Number(data.page ?? 1),
      limit: Number(data.limit ?? 10),
      pages: Number(data.pages ?? 0),
      total_pages: Number(data.total_pages ?? data.pages ?? 0),
      has_next: Boolean(data.has_next ?? false),
      has_previous: Boolean(data.has_previous ?? false),
    };
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to fetch employees"));
  }
});

export const createEmployee = createAsyncThunk<
  void,
  CreateEmployeePayload,
  { rejectValue: ParsedError }
>("employees/createEmployee", async (payload, thunkAPI) => {
  try {
    console.log(payload);
    await apiInstance.post("/employees", payload);
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to add employee"));
  }
});

export const updateEmployee = createAsyncThunk<
  void,
  { id: string; payload: UpdateEmployeePayload },
  { rejectValue: ParsedError }
>("employees/updateEmployee", async ({ id, payload }, thunkAPI) => {
  try {
    await apiInstance.put(`/employees/${id}`, payload);
  } catch (error) {
    return thunkAPI.rejectWithValue(parseApiError(error, "Failed to update employee"));
  }
});

export const deleteEmployee = createAsyncThunk<string, string, { rejectValue: ParsedError }>(
  "employees/deleteEmployee",
  async (id, thunkAPI) => {
    try {
      await apiInstance.delete(`/employees/${id}`);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Failed to remove employee"));
    }
  },
);

export const resendEmployeeInvite = createAsyncThunk<void, string, { rejectValue: ParsedError }>(
  "employees/resendEmployeeInvite",
  async (id, thunkAPI) => {
    try {
      await apiInstance.post(`/employees/${id}/send-invite`);
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Failed to resend invitation"));
    }
  },
);

export const deactivateEmployee = createAsyncThunk<void, string, { rejectValue: ParsedError }>(
  "employees/deactivateEmployee",
  async (id, thunkAPI) => {
    try {
      await apiInstance.post(`/employees/${id}/deactivate`);
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Failed to deactivate employee"));
    }
  },
);

export const activateEmployee = createAsyncThunk<void, string, { rejectValue: ParsedError }>(
  "employees/activateEmployee",
  async (id, thunkAPI) => {
    try {
      await apiInstance.post(`/employees/${id}/activate-by-admin`);
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Failed to activate employee"));
    }
  },
);

export const resetEmployeePassword = createAsyncThunk<void, string, { rejectValue: ParsedError }>(
  "employees/resetEmployeePassword",
  async (id, thunkAPI) => {
    try {
      await apiInstance.post(`/employees/${id}/reset-password`);
    } catch (error) {
      return thunkAPI.rejectWithValue(parseApiError(error, "Failed to reset password"));
    }
  },
);
