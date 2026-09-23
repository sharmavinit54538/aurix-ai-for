import { api, apiInstance } from "@/api";
import { aurix } from "@/lib/aurix-store";
import { profileApi } from "@/services/profileApi";
import { settingsApi } from "@/services/settingsApi";
import { attendanceApi } from "@/services/attendanceApi";
import type {
  AttendanceSettingsForm,
  CompanySettingsForm,
  DepartmentItem,
  DesignationItem,
  DocumentSettingsForm,
  EmployeeSettingsForm,
  LeaveSettingsForm,
  MyProfileForm,
  NotificationSettingsForm,
  PayrollSettingsForm,
  AssetSettingsForm,
} from "./types";

export interface MissingApiErrorDetails {
  isMissingApi: true;
  endpoint: string;
  method: string;
  section: string;
  message: string;
}

export function isMissingApiError(err: unknown): err is MissingApiErrorDetails {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as Record<string, unknown>).isMissingApi === true
  );
}

function createMissingApiError(
  method: string,
  endpoint: string,
  section: string,
): MissingApiErrorDetails {
  return {
    isMissingApi: true,
    endpoint,
    method,
    section,
    message: `This setting is not available because the required backend API (${method} ${endpoint}) has not been implemented yet.`,
  };
}

function extractPayload<T>(res: unknown, fallback: T): T {
  if (res == null) return fallback;
  const r = res as Record<string, unknown>;
  const body = r.data !== undefined ? r.data : res;
  if (body == null) return fallback;
  if (typeof body === "object" && body !== null) {
    const b = body as Record<string, unknown>;
    if (b.data !== undefined) return b.data as T;
    if (b.result !== undefined) return b.result as T;
  }
  return body as T;
}

function getErrorStatus(err: unknown): number | undefined {
  if (typeof err === "object" && err !== null && "response" in err) {
    const resp = (err as { response?: { status?: number } }).response;
    return resp?.status;
  }
  return undefined;
}

// ─────────────────────────────────────────────────────────────
// 1. Company API
// ─────────────────────────────────────────────────────────────

export async function fetchCompanySettings(): Promise<CompanySettingsForm> {
  const ws = aurix.get();
  try {
    const res = await apiInstance.get("/settings/company");
    const data = extractPayload<Record<string, unknown>>(res, {});
    return {
      name: String(data.name || ws.company?.name || ""),
      logoUrl: String(data.logoUrl || data.logo_url || data.logo || ""),
      logoDataUrl: String(data.logoDataUrl || ws.company?.logoDataUrl || ""),
      address: String(data.address || ws.company?.address || ""),
      city: String(data.city || ws.company?.city || ""),
      state: String(data.state || ws.company?.state || ""),
      country: String(data.country || ws.company?.country || "India"),
      postalCode: String(data.postalCode || data.postal_code || data.zip || ""),
      contactEmail: String(data.email || data.contactEmail || ws.company?.email || ""),
      contactPhone: String(data.phone || data.contactPhone || ws.company?.phone || ""),
      website: String(data.website || ws.company?.website || ""),
      timezone: String(data.timezone || ws.company?.timezone || "Asia/Kolkata (IST)"),
      currency: String(data.currency || "INR (₹)"),
      financialYearStart: String(data.fiscalYearStart || data.financialYearStart || "April"),
      financialYearEnd: String(data.fiscalYearEnd || data.financialYearEnd || "March"),
    };
  } catch (err: unknown) {
    if (ws.company) {
      return {
        name: ws.company.name || "",
        logoUrl: "",
        logoDataUrl: ws.company.logoDataUrl || "",
        address: ws.company.address || "",
        city: ws.company.city || "",
        state: ws.company.state || "",
        country: ws.company.country || "India",
        postalCode: "",
        contactEmail: ws.company.email || "",
        contactPhone: ws.company.phone || "",
        website: ws.company.website || "",
        timezone: ws.company.timezone || "Asia/Kolkata (IST)",
        currency: "INR (₹)",
        financialYearStart: "April",
        financialYearEnd: "March",
      };
    }
    throw err;
  }
}

export async function updateCompanySettings(
  data: CompanySettingsForm,
): Promise<CompanySettingsForm> {
  const payload = {
    name: data.name,
    email: data.contactEmail,
    phone: data.contactPhone,
    website: data.website,
    address: data.address,
    city: data.city,
    state: data.state,
    country: data.country,
    postalCode: data.postalCode,
    timezone: data.timezone,
    currency: data.currency,
    financialYearStart: data.financialYearStart,
    financialYearEnd: data.financialYearEnd,
    logoUrl: data.logoUrl,
  };

  const res = await apiInstance.put("/settings/company", payload);
  const updated = extractPayload<Record<string, unknown>>(res, payload);

  if (updated?.name) {
    const currentWs = aurix.get();
    aurix.set({
      company: {
        id: String(updated.id || currentWs.company?.id || "default"),
        name: String(updated.name),
        email: updated.email ? String(updated.email) : undefined,
        phone: updated.phone ? String(updated.phone) : undefined,
        address: updated.address ? String(updated.address) : undefined,
        city: updated.city ? String(updated.city) : undefined,
        state: updated.state ? String(updated.state) : undefined,
        country: updated.country ? String(updated.country) : undefined,
        website: updated.website ? String(updated.website) : undefined,
        timezone: updated.timezone ? String(updated.timezone) : undefined,
      },
    });
  }

  return {
    ...data,
    name: String(updated.name || data.name),
  };
}

export async function uploadCompanyLogo(file: File): Promise<{ logoUrl: string }> {
  const formData = new FormData();
  formData.append("logo", file);
  formData.append("file", file);

  try {
    const res = await apiInstance.post("/settings/company/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const data = extractPayload<Record<string, unknown>>(res, {});
    const logoUrl = String(data.logoUrl || data.url || data.logo_url || "");
    return { logoUrl };
  } catch (err: unknown) {
    if (getErrorStatus(err) === 404) {
      throw createMissingApiError("POST", "/api/v1/settings/company/logo", "Company Logo Upload");
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// 2. My Profile API
// ─────────────────────────────────────────────────────────────

export async function fetchMyProfile(): Promise<MyProfileForm> {
  try {
    const res = await apiInstance.get("/settings/profile");
    const data = extractPayload<Record<string, unknown>>(res, {});
    if (data && (data.fullName || data.name || data.email)) {
      return {
        name: String(data.fullName || data.name || ""),
        email: String(data.email || ""),
        phone: String(data.phone || ""),
        avatarUrl: String(data.avatarUrl || data.avatar_url || ""),
        designation: String(data.designation || ""),
        department: String(data.department || ""),
      };
    }
  } catch {
    // Fallback to user session endpoint
  }

  const user = await profileApi.getCurrentUser();
  return {
    name: user.fullName || user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    avatarUrl: user.avatarUrl || "",
    designation: user.designation || "",
    department: user.department || "",
  };
}

export async function updateMyProfile(form: MyProfileForm): Promise<MyProfileForm> {
  const updated = await profileApi.updateCurrentUser({
    fullName: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone?.trim(),
    designation: form.designation?.trim(),
    department: form.department?.trim(),
  });

  const ws = aurix.get();
  if (ws.user) {
    aurix.set({
      user: {
        ...ws.user,
        fullName: updated.fullName || form.name,
        email: updated.email || form.email,
        phone: updated.phone || form.phone,
      },
    });
  }

  return {
    name: updated.fullName || form.name,
    email: updated.email || form.email,
    phone: updated.phone || form.phone,
    avatarUrl: updated.avatarUrl || form.avatarUrl,
    designation: updated.designation || form.designation,
    department: updated.department || form.department,
  };
}

export async function uploadProfileAvatar(file: File): Promise<string> {
  const res = await profileApi.uploadAvatar(file);
  return res.avatarUrl;
}

export async function changeMyPassword(payload: {
  currentPassword?: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<{ success: boolean; message: string }> {
  return await profileApi.changePassword({
    currentPassword: payload.currentPassword || "",
    newPassword: payload.newPassword,
    confirmPassword: payload.confirmPassword,
  });
}

// ─────────────────────────────────────────────────────────────
// 3. Employees API
// ─────────────────────────────────────────────────────────────

export async function fetchDepartmentsList(): Promise<DepartmentItem[]> {
  try {
    const res = await apiInstance.get("/departments", { params: { limit: 100 } });
    const data = extractPayload<Record<string, unknown>>(res, {});
    let items: Record<string, unknown>[] = [];
    if (Array.isArray(data)) items = data;
    else if (Array.isArray(data?.items)) items = data.items;
    else if (Array.isArray(data?.departments)) items = data.departments;

    return items.map((d) => {
      const mgr = d.manager_details as Record<string, unknown> | undefined;
      return {
        id: String(d.id || ""),
        name: String(d.department_name || d.name || d.title || ""),
        code: d.department_code ? String(d.department_code) : d.code ? String(d.code) : "",
        description: d.description ? String(d.description) : "",
        managerName: String(mgr?.name || d.manager_name || d.departmentHeadName || "Unassigned"),
        employeeCount: Number(d.employee_count ?? d.employees_count ?? 0),
      };
    });
  } catch (err) {
    console.error("Failed to load departments:", err);
    return [];
  }
}

export async function createDepartmentApi(payload: {
  name: string;
  code?: string;
  description?: string;
}): Promise<void> {
  await apiInstance.post("/departments", {
    department_name: payload.name,
    department_code: payload.code || payload.name.slice(0, 3).toUpperCase(),
    description: payload.description || "",
  });
}

export async function deleteDepartmentApi(id: string): Promise<void> {
  await apiInstance.delete(`/departments/${id}`);
}

export async function fetchDesignationsList(): Promise<DesignationItem[]> {
  try {
    const res = await apiInstance.get("/designations");
    const data = extractPayload<Record<string, unknown>>(res, {});
    let items: Record<string, unknown>[] = [];
    if (Array.isArray(data)) items = data;
    else if (Array.isArray(data?.items)) items = data.items;
    return items.map((item) => ({
      id: String(item.id || item.name),
      name: String(item.name || item.title || item),
      department: item.department ? String(item.department) : "",
      level: item.level ? String(item.level) : "",
    }));
  } catch {
    return [];
  }
}

export async function fetchEmployeeSettings(): Promise<EmployeeSettingsForm> {
  try {
    const res = await apiInstance.get("/settings/employees");
    const data = extractPayload<Record<string, unknown>>(res, {});
    return {
      idPrefix: String(data.idPrefix || "EMP-"),
      idNumberLength: Number(data.idNumberLength || 4),
      idSuffix: String(data.idSuffix || ""),
      probationDays: Number(data.probationDays || 90),
      noticePeriodDays: Number(data.noticePeriodDays || 30),
      allowPastJoiningDate: Boolean(data.allowPastJoiningDate ?? true),
      maxPastJoiningDays: Number(data.maxPastJoiningDays || 60),
      statuses: Array.isArray(data.statuses)
        ? (data.statuses as string[])
        : ["Active", "Probation", "Notice Period", "Terminated"],
      employmentTypes: Array.isArray(data.employmentTypes)
        ? (data.employmentTypes as string[])
        : ["Full-Time", "Part-Time", "Contract", "Intern"],
    };
  } catch (err: unknown) {
    if (getErrorStatus(err) === 404) {
      throw createMissingApiError("GET", "/api/v1/settings/employees", "Employee Rules & Formats");
    }
    throw err;
  }
}

export async function updateEmployeeSettings(form: EmployeeSettingsForm): Promise<void> {
  try {
    await apiInstance.put("/settings/employees", form);
  } catch (err: unknown) {
    if (getErrorStatus(err) === 404) {
      throw createMissingApiError("PUT", "/api/v1/settings/employees", "Employee Rules & Formats");
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// 4. Attendance Settings API
// ─────────────────────────────────────────────────────────────

export async function fetchFaceBiometricSupport(): Promise<{
  supported: boolean;
  enrolled: boolean;
}> {
  try {
    const res = await attendanceApi.getFaceStatus();
    return {
      supported: true,
      enrolled: res.is_enrolled,
    };
  } catch {
    return { supported: false, enrolled: false };
  }
}

export async function fetchAttendanceSettings(): Promise<AttendanceSettingsForm> {
  try {
    const res = await apiInstance.get("/attendance/settings");
    const data = extractPayload<Record<string, unknown>>(res, {});
    return {
      attendanceMethod:
        (data.attendanceMethod as AttendanceSettingsForm["attendanceMethod"]) || "web",
      faceVerificationEnabled: Boolean(data.faceVerificationEnabled ?? false),
      faceConfidenceThreshold: Number(data.faceConfidenceThreshold || 85),
      workStartTime: String(data.workStartTime || "09:30"),
      workEndTime: String(data.workEndTime || "18:30"),
      fullDayMinHours: Number(data.fullDayMinHours || 8),
      halfDayMinHours: Number(data.halfDayMinHours || 4),
      gracePeriodMinutes: Number(data.gracePeriodMinutes || 15),
      maxLateMarksPerMonth: Number(data.maxLateMarksPerMonth || 3),
      lateMarkPenaltyType:
        (data.lateMarkPenaltyType as AttendanceSettingsForm["lateMarkPenaltyType"]) || "half_day",
      earlyLeaveThresholdMinutes: Number(data.earlyLeaveThresholdMinutes || 30),
      overtimeEligible: Boolean(data.overtimeEligible ?? true),
      minOvertimeMinutes: Number(data.minOvertimeMinutes || 60),
      overtimeRateMultiplier: Number(data.overtimeRateMultiplier || 1.5),
      notifyOnLateCheckIn: Boolean(data.notifyOnLateCheckIn ?? true),
      notifyOnMissedCheckOut: Boolean(data.notifyOnMissedCheckOut ?? true),
    };
  } catch (err: unknown) {
    if (getErrorStatus(err) === 404) {
      throw createMissingApiError("GET", "/api/v1/attendance/settings", "Attendance Configuration");
    }
    throw err;
  }
}

export async function updateAttendanceSettings(form: AttendanceSettingsForm): Promise<void> {
  try {
    await apiInstance.put("/attendance/settings", form);
  } catch (err: unknown) {
    if (getErrorStatus(err) === 404) {
      throw createMissingApiError("PUT", "/api/v1/attendance/settings", "Attendance Configuration");
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// 5. Leave Settings API
// ─────────────────────────────────────────────────────────────

export async function fetchLeaveSettings(): Promise<LeaveSettingsForm> {
  try {
    const res = await apiInstance.get("/settings/leaves");
    const data = extractPayload<Record<string, unknown>>(res, {});
    return {
      leaveTypes: Array.isArray(data.leaveTypes)
        ? (data.leaveTypes as LeaveSettingsForm["leaveTypes"])
        : [],
      approvalWorkflow:
        (data.approvalWorkflow as LeaveSettingsForm["approvalWorkflow"]) || "single_manager",
      autoApproveDaysAfterPending: Number(data.autoApproveDaysAfterPending || 7),
      allowNegativeBalance: Boolean(data.allowNegativeBalance ?? false),
      notifyOnLeaveRequest: Boolean(data.notifyOnLeaveRequest ?? true),
      notifyOnApprovalDecision: Boolean(data.notifyOnApprovalDecision ?? true),
    };
  } catch (err: unknown) {
    if (getErrorStatus(err) === 404) {
      throw createMissingApiError("GET", "/api/v1/settings/leaves", "Leave Policy & Allowances");
    }
    throw err;
  }
}

export async function updateLeaveSettings(form: LeaveSettingsForm): Promise<void> {
  try {
    await apiInstance.put("/settings/leaves", form);
  } catch (err: unknown) {
    if (getErrorStatus(err) === 404) {
      throw createMissingApiError("PUT", "/api/v1/settings/leaves", "Leave Policy & Allowances");
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// 6. Payroll Settings API
// ─────────────────────────────────────────────────────────────

export async function fetchPayrollSettings(): Promise<PayrollSettingsForm> {
  try {
    const res = await apiInstance.get("/settings/payroll");
    const data = extractPayload<Record<string, unknown>>(res, {});
    return {
      payFrequency: (data.payFrequency as PayrollSettingsForm["payFrequency"]) || "monthly",
      currency: "INR (₹)",
      salaryStructureName: String(data.salaryStructureName || "Standard Indian CTC"),
      components: Array.isArray(data.components)
        ? (data.components as PayrollSettingsForm["components"])
        : [],
      pfEnabled: Boolean(data.pfEnabled ?? true),
      pfEmployeePercent: Number(data.pfEmployeePercent || 12),
      pfEmployerPercent: Number(data.pfEmployerPercent || 12),
      pfWageCeiling: Number(data.pfWageCeiling || 15000),
      esiEnabled: Boolean(data.esiEnabled ?? true),
      esiEmployeePercent: Number(data.esiEmployeePercent || 0.75),
      esiEmployerPercent: Number(data.esiEmployerPercent || 3.25),
      esiWageCeiling: Number(data.esiWageCeiling || 21000),
      ptEnabled: Boolean(data.ptEnabled ?? true),
      ptState: String(data.ptState || "Maharashtra"),
      tdsWindowOpen: Boolean(data.tdsWindowOpen ?? true),
      tdsDefaultRegime: (data.tdsDefaultRegime as PayrollSettingsForm["tdsDefaultRegime"]) || "new",
      payslipGenerationDay: Number(data.payslipGenerationDay || 1),
      passwordProtectedPayslips: Boolean(data.passwordProtectedPayslips ?? true),
      showLeaveBalanceOnPayslip: Boolean(data.showLeaveBalanceOnPayslip ?? true),
    };
  } catch (err: unknown) {
    if (getErrorStatus(err) === 404) {
      throw createMissingApiError(
        "GET",
        "/api/v1/settings/payroll",
        "Statutory Payroll & Structures",
      );
    }
    throw err;
  }
}

export async function updatePayrollSettings(form: PayrollSettingsForm): Promise<void> {
  try {
    await apiInstance.put("/settings/payroll", form);
  } catch (err: unknown) {
    if (getErrorStatus(err) === 404) {
      throw createMissingApiError(
        "PUT",
        "/api/v1/settings/payroll",
        "Statutory Payroll & Structures",
      );
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// 7. Documents Settings API
// ─────────────────────────────────────────────────────────────

export async function fetchDocumentCategoriesList(): Promise<{ id: string; name: string }[]> {
  try {
    const res = await apiInstance.get("/documents/categories");
    const data = extractPayload<Record<string, unknown>[]>(res, []);
    if (Array.isArray(data)) {
      return data.map((d) => ({
        id: String(d.id || ""),
        name: String(d.name || ""),
      }));
    }
    return [];
  } catch {
    return [];
  }
}

export async function fetchDocumentSettings(): Promise<DocumentSettingsForm> {
  try {
    const res = await apiInstance.get("/settings/documents");
    const data = extractPayload<Record<string, unknown>>(res, {});
    return {
      documentTypes: Array.isArray(data.documentTypes)
        ? (data.documentTypes as DocumentSettingsForm["documentTypes"])
        : [],
      expiryReminderDays: Array.isArray(data.expiryReminderDays)
        ? (data.expiryReminderDays as number[])
        : [30, 15, 7],
      salarySlipWatermark: Boolean(data.salarySlipWatermark ?? true),
      salarySlipVisibleToEmployee: Boolean(data.salarySlipVisibleToEmployee ?? true),
      provisionSlipLockedRequired: Boolean(data.provisionSlipLockedRequired ?? true),
      provisionSlipVisibleToEmployee: Boolean(data.provisionSlipVisibleToEmployee ?? false),
      templatesCount: Number(data.templatesCount || 0),
    };
  } catch (err: unknown) {
    if (getErrorStatus(err) === 404) {
      throw createMissingApiError("GET", "/api/v1/settings/documents", "Document & Slip Policies");
    }
    throw err;
  }
}

export async function updateDocumentSettings(form: DocumentSettingsForm): Promise<void> {
  try {
    await apiInstance.put("/settings/documents", form);
  } catch (err: unknown) {
    if (getErrorStatus(err) === 404) {
      throw createMissingApiError("PUT", "/api/v1/settings/documents", "Document & Slip Policies");
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// 8. Assets Settings API
// ─────────────────────────────────────────────────────────────

export async function fetchAssetSettings(): Promise<AssetSettingsForm> {
  try {
    const res = await apiInstance.get("/settings/assets");
    const data = extractPayload<Record<string, unknown>>(res, {});
    return {
      categories: Array.isArray(data.categories)
        ? (data.categories as AssetSettingsForm["categories"])
        : [],
      requireEmployeeAcknowledgment: Boolean(data.requireEmployeeAcknowledgment ?? true),
      mandatoryClearanceOnExit: Boolean(data.mandatoryClearanceOnExit ?? true),
      notifyWarrantyExpiryDays: Number(data.notifyWarrantyExpiryDays || 30),
      notifyAssetReturnDays: Number(data.notifyAssetReturnDays || 7),
    };
  } catch (err: unknown) {
    if (getErrorStatus(err) === 404) {
      throw createMissingApiError(
        "GET",
        "/api/v1/settings/assets",
        "Asset Allocation & Return Policies",
      );
    }
    throw err;
  }
}

export async function updateAssetSettings(form: AssetSettingsForm): Promise<void> {
  try {
    await apiInstance.put("/settings/assets", form);
  } catch (err: unknown) {
    if (getErrorStatus(err) === 404) {
      throw createMissingApiError(
        "PUT",
        "/api/v1/settings/assets",
        "Asset Allocation & Return Policies",
      );
    }
    throw err;
  }
}

// ─────────────────────────────────────────────────────────────
// 9. Notifications Settings API
// ─────────────────────────────────────────────────────────────

export async function fetchNotificationSettings(): Promise<NotificationSettingsForm> {
  const data = await settingsApi.getNotificationSettings();
  return {
    emailNotifications: Boolean(data?.emailNotifications ?? true),
    attendanceAlerts: Boolean(data?.inAppAlerts ?? true),
    leaveAlerts: Boolean(data?.slackAlerts ?? true),
    payrollAlerts: Boolean(data?.weeklyDigest ?? true),
    documentExpiryAlerts: Boolean(data?.securityAlerts ?? true),
    weeklyDigest: Boolean(data?.weeklyDigest ?? true),
  };
}

export async function updateNotificationSettings(form: NotificationSettingsForm): Promise<void> {
  await settingsApi.updateNotificationSettings({
    emailNotifications: form.emailNotifications,
    inAppAlerts: form.attendanceAlerts,
    slackAlerts: form.leaveAlerts,
    weeklyDigest: form.payrollAlerts,
    securityAlerts: form.documentExpiryAlerts,
  });
}

export async function sendTestNotificationEmail(
  email: string,
): Promise<{ success: boolean; message: string }> {
  return await settingsApi.testEmail({ email });
}
