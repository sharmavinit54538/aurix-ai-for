import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Check, Dt as Package, Gn as FileCheck, Gt as Lock, Jn as Eye, Jr as Briefcase, Kr as Building, Ln as FileText, Q as Send, Rr as Camera, S as Upload, T as TriangleAlert, Tr as CircleAlert, Ur as CalendarDays, Vt as Mail, Yn as EyeOff, an as Layers, at as Save, h as User, ht as Plus, k as Trash2, ni as Bell, p as Users, pr as Clock, q as ShieldCheck, qr as Building2, ri as Banknote, rt as ScanFace, st as RotateCcw, vt as Phone, xn as Globe, z as Stamp } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix, t as aurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { t as authService } from "./auth-BRJn5RkQ.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { G as profileApi, H as logout, W as persistAuthSession, Z as settingsApi$1 } from "./auth-bootstrap-CR9kF6gO.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { t as attendanceApi } from "./attendanceApi-CqMkuZD6.mjs";
import { t as Switch } from "./switch-C_mzcXif.mjs";
import { n as TimezoneSelect, r as getDefaultTimezoneForCountry, t as CountrySelect } from "./CountrySelect-Bg7_a-Z_.mjs";
import { a as resolveRbacRole, i as getRbacRoleLabel, n as canAccessSection, r as canEditSection, t as AccessDeniedView } from "./AccessDeniedView-ZOkMszu2.mjs";
import { n as parseLoginResponse } from "./parseLoginResponse-KUjZ0IxY.mjs";
import { n as AvatarFallback$1, r as AvatarImage$1, t as Avatar$1 } from "../_libs/radix-ui__react-avatar.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SettingsLayout-CtnalRxw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function isMissingApiError(err) {
	return typeof err === "object" && err !== null && err.isMissingApi === true;
}
function createMissingApiError(method, endpoint, section) {
	return {
		isMissingApi: true,
		endpoint,
		method,
		section,
		message: `This setting is not available because the required backend API (${method} ${endpoint}) has not been implemented yet.`
	};
}
function extractPayload(res, fallback) {
	if (res == null) return fallback;
	const r = res;
	const body = r.data !== void 0 ? r.data : res;
	if (body == null) return fallback;
	if (typeof body === "object" && body !== null) {
		const b = body;
		if (b.data !== void 0) return b.data;
		if (b.result !== void 0) return b.result;
	}
	return body;
}
function getErrorStatus(err) {
	if (typeof err === "object" && err !== null && "response" in err) return err.response?.status;
}
async function fetchCompanySettings() {
	const ws = aurix.get();
	try {
		const data = extractPayload(await apiInstance.get("/settings/company"), {});
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
			financialYearEnd: String(data.fiscalYearEnd || data.financialYearEnd || "March")
		};
	} catch (err) {
		if (ws.company) return {
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
			financialYearEnd: "March"
		};
		throw err;
	}
}
async function updateCompanySettings(data) {
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
		logoUrl: data.logoUrl
	};
	const updated = extractPayload(await apiInstance.put("/settings/company", payload), payload);
	if (updated?.name) {
		const currentWs = aurix.get();
		aurix.set({ company: {
			id: String(updated.id || currentWs.company?.id || "default"),
			name: String(updated.name),
			email: updated.email ? String(updated.email) : void 0,
			phone: updated.phone ? String(updated.phone) : void 0,
			address: updated.address ? String(updated.address) : void 0,
			city: updated.city ? String(updated.city) : void 0,
			state: updated.state ? String(updated.state) : void 0,
			country: updated.country ? String(updated.country) : void 0,
			website: updated.website ? String(updated.website) : void 0,
			timezone: updated.timezone ? String(updated.timezone) : void 0
		} });
	}
	return {
		...data,
		name: String(updated.name || data.name)
	};
}
async function uploadCompanyLogo(file) {
	const formData = new FormData();
	formData.append("logo", file);
	formData.append("file", file);
	try {
		const data = extractPayload(await apiInstance.post("/settings/company/logo", formData), {});
		return { logoUrl: String(data.logo || data.logoUrl || data.url || data.logo_url || "") };
	} catch (err) {
		if (getErrorStatus(err) === 404) throw createMissingApiError("POST", "/api/v1/settings/company/logo", "Company Logo Upload");
		throw err;
	}
}
async function fetchMyProfile() {
	try {
		const data = extractPayload(await apiInstance.get("/settings/profile"), {});
		if (data && (data.fullName || data.name || data.email)) return {
			name: String(data.fullName || data.name || ""),
			email: String(data.email || ""),
			phone: String(data.phone || ""),
			avatarUrl: String(data.avatarUrl || data.avatar_url || ""),
			designation: String(data.designation || ""),
			department: String(data.department || "")
		};
	} catch {}
	const user = await profileApi.getCurrentUser();
	return {
		name: user.fullName || user.name || "",
		email: user.email || "",
		phone: user.phone || "",
		avatarUrl: user.avatarUrl || "",
		designation: user.designation || "",
		department: user.department || ""
	};
}
async function updateMyProfile(form) {
	const payload = {};
	if (form.name?.trim()) payload.fullName = form.name.trim();
	if (form.email?.trim()) payload.email = form.email.trim();
	if (form.phone !== void 0 && form.phone !== null) payload.phone = form.phone.trim();
	if (form.designation?.trim()) payload.designation = form.designation.trim();
	if (form.department?.trim()) payload.department = form.department.trim();
	const updated = await profileApi.updateCurrentUser(payload);
	const ws = aurix.get();
	if (ws.user) aurix.set({ user: {
		...ws.user,
		fullName: updated.fullName || form.name,
		email: updated.email || form.email,
		phone: updated.phone || form.phone
	} });
	return {
		...form,
		name: updated.fullName || form.name,
		email: updated.email || form.email,
		phone: updated.phone || form.phone,
		avatarUrl: updated.avatarUrl || form.avatarUrl,
		designation: updated.designation || form.designation,
		department: updated.department || form.department
	};
}
async function uploadProfileAvatar(file) {
	return (await profileApi.uploadAvatar(file)).avatarUrl;
}
async function changeMyPassword(payload) {
	return await profileApi.changePassword({
		currentPassword: payload.currentPassword || "",
		newPassword: payload.newPassword,
		confirmPassword: payload.confirmPassword
	});
}
async function fetchDepartmentsList() {
	try {
		const data = extractPayload(await apiInstance.get("/departments", { params: { limit: 100 } }), {});
		let items = [];
		if (Array.isArray(data)) items = data;
		else if (Array.isArray(data?.items)) items = data.items;
		else if (Array.isArray(data?.departments)) items = data.departments;
		return items.map((d) => {
			const mgr = d.manager_details;
			return {
				id: String(d.id || ""),
				name: String(d.department_name || d.name || d.title || ""),
				code: d.department_code ? String(d.department_code) : d.code ? String(d.code) : "",
				description: d.description ? String(d.description) : "",
				managerName: String(mgr?.name || d.manager_name || d.departmentHeadName || "Unassigned"),
				employeeCount: Number(d.employee_count ?? d.employees_count ?? 0)
			};
		});
	} catch (err) {
		console.error("Failed to load departments:", err);
		return [];
	}
}
async function createDepartmentApi(payload) {
	await apiInstance.post("/departments", {
		department_name: payload.name,
		department_code: payload.code || payload.name.slice(0, 3).toUpperCase(),
		description: payload.description || ""
	});
}
async function deleteDepartmentApi(id) {
	await apiInstance.delete(`/departments/${id}`);
}
async function fetchDesignationsList() {
	try {
		const data = extractPayload(await apiInstance.get("/designations"), {});
		let items = [];
		if (Array.isArray(data)) items = data;
		else if (Array.isArray(data?.items)) items = data.items;
		return items.map((item) => ({
			id: String(item.id || item.name),
			name: String(item.name || item.title || item),
			department: item.department ? String(item.department) : "",
			level: item.level ? String(item.level) : ""
		}));
	} catch {
		return [];
	}
}
async function fetchEmployeeSettings() {
	try {
		const data = extractPayload(await apiInstance.get("/settings/employees"), {});
		return {
			idPrefix: String(data.idPrefix || "EMP-"),
			idNumberLength: Number(data.idNumberLength || 4),
			idSuffix: String(data.idSuffix || ""),
			probationDays: Number(data.probationDays || 90),
			noticePeriodDays: Number(data.noticePeriodDays || 30),
			allowPastJoiningDate: Boolean(data.allowPastJoiningDate ?? true),
			maxPastJoiningDays: Number(data.maxPastJoiningDays || 60),
			statuses: Array.isArray(data.statuses) ? data.statuses : [
				"Active",
				"Probation",
				"Notice Period",
				"Terminated"
			],
			employmentTypes: Array.isArray(data.employmentTypes) ? data.employmentTypes : [
				"Full-Time",
				"Part-Time",
				"Contract",
				"Intern"
			]
		};
	} catch (err) {
		if (getErrorStatus(err) === 404) throw createMissingApiError("GET", "/api/v1/settings/employees", "Employee Rules & Formats");
		throw err;
	}
}
async function updateEmployeeSettings(form) {
	try {
		await apiInstance.put("/settings/employees", form);
	} catch (err) {
		if (getErrorStatus(err) === 404) throw createMissingApiError("PUT", "/api/v1/settings/employees", "Employee Rules & Formats");
		throw err;
	}
}
async function fetchFaceBiometricSupport() {
	try {
		return {
			supported: true,
			enrolled: (await attendanceApi.getFaceStatus()).is_enrolled
		};
	} catch {
		return {
			supported: false,
			enrolled: false
		};
	}
}
async function fetchAttendanceSettings() {
	try {
		const data = extractPayload(await apiInstance.get("/attendance/settings"), {});
		return {
			attendanceMethod: data.attendanceMethod || "web",
			faceVerificationEnabled: Boolean(data.faceVerificationEnabled ?? false),
			faceConfidenceThreshold: Number(data.faceConfidenceThreshold || 85),
			workStartTime: String(data.workStartTime || "09:30"),
			workEndTime: String(data.workEndTime || "18:30"),
			fullDayMinHours: Number(data.fullDayMinHours || 8),
			halfDayMinHours: Number(data.halfDayMinHours || 4),
			gracePeriodMinutes: Number(data.gracePeriodMinutes || 15),
			maxLateMarksPerMonth: Number(data.maxLateMarksPerMonth || 3),
			lateMarkPenaltyType: data.lateMarkPenaltyType || "half_day",
			earlyLeaveThresholdMinutes: Number(data.earlyLeaveThresholdMinutes || 30),
			overtimeEligible: Boolean(data.overtimeEligible ?? true),
			minOvertimeMinutes: Number(data.minOvertimeMinutes || 60),
			overtimeRateMultiplier: Number(data.overtimeRateMultiplier || 1.5),
			notifyOnLateCheckIn: Boolean(data.notifyOnLateCheckIn ?? true),
			notifyOnMissedCheckOut: Boolean(data.notifyOnMissedCheckOut ?? true)
		};
	} catch (err) {
		if (getErrorStatus(err) === 404) throw createMissingApiError("GET", "/api/v1/attendance/settings", "Attendance Configuration");
		throw err;
	}
}
async function updateAttendanceSettings(form) {
	try {
		await apiInstance.put("/attendance/settings", form);
	} catch (err) {
		if (getErrorStatus(err) === 404) throw createMissingApiError("PUT", "/api/v1/attendance/settings", "Attendance Configuration");
		throw err;
	}
}
async function fetchLeaveSettings() {
	try {
		const data = extractPayload(await apiInstance.get("/settings/leaves"), {});
		return {
			leaveTypes: Array.isArray(data.leaveTypes) ? data.leaveTypes : [],
			approvalWorkflow: data.approvalWorkflow || "single_manager",
			autoApproveDaysAfterPending: Number(data.autoApproveDaysAfterPending || 7),
			allowNegativeBalance: Boolean(data.allowNegativeBalance ?? false),
			notifyOnLeaveRequest: Boolean(data.notifyOnLeaveRequest ?? true),
			notifyOnApprovalDecision: Boolean(data.notifyOnApprovalDecision ?? true)
		};
	} catch (err) {
		if (getErrorStatus(err) === 404) throw createMissingApiError("GET", "/api/v1/settings/leaves", "Leave Policy & Allowances");
		throw err;
	}
}
async function updateLeaveSettings(form) {
	try {
		await apiInstance.put("/settings/leaves", form);
	} catch (err) {
		if (getErrorStatus(err) === 404) throw createMissingApiError("PUT", "/api/v1/settings/leaves", "Leave Policy & Allowances");
		throw err;
	}
}
async function fetchPayrollSettings() {
	try {
		const data = extractPayload(await apiInstance.get("/settings/payroll"), {});
		return {
			payFrequency: data.payFrequency || "monthly",
			currency: "INR (₹)",
			salaryStructureName: String(data.salaryStructureName || "Standard Indian CTC"),
			components: Array.isArray(data.components) ? data.components : [],
			pfEnabled: Boolean(data.pfEnabled ?? true),
			pfEmployeePercent: Number(data.pfEmployeePercent || 12),
			pfEmployerPercent: Number(data.pfEmployerPercent || 12),
			pfWageCeiling: Number(data.pfWageCeiling || 15e3),
			esiEnabled: Boolean(data.esiEnabled ?? true),
			esiEmployeePercent: Number(data.esiEmployeePercent || .75),
			esiEmployerPercent: Number(data.esiEmployerPercent || 3.25),
			esiWageCeiling: Number(data.esiWageCeiling || 21e3),
			ptEnabled: Boolean(data.ptEnabled ?? true),
			ptState: String(data.ptState || "Maharashtra"),
			tdsWindowOpen: Boolean(data.tdsWindowOpen ?? true),
			tdsDefaultRegime: data.tdsDefaultRegime || "new",
			payslipGenerationDay: Number(data.payslipGenerationDay || 1),
			passwordProtectedPayslips: Boolean(data.passwordProtectedPayslips ?? true),
			showLeaveBalanceOnPayslip: Boolean(data.showLeaveBalanceOnPayslip ?? true)
		};
	} catch (err) {
		if (getErrorStatus(err) === 404) throw createMissingApiError("GET", "/api/v1/settings/payroll", "Statutory Payroll & Structures");
		throw err;
	}
}
async function updatePayrollSettings(form) {
	try {
		await apiInstance.put("/settings/payroll", form);
	} catch (err) {
		if (getErrorStatus(err) === 404) throw createMissingApiError("PUT", "/api/v1/settings/payroll", "Statutory Payroll & Structures");
		throw err;
	}
}
async function fetchDocumentCategoriesList() {
	try {
		const data = extractPayload(await apiInstance.get("/documents/categories"), []);
		if (Array.isArray(data)) return data.map((d) => ({
			id: String(d.id || ""),
			name: String(d.name || "")
		}));
		return [];
	} catch {
		return [];
	}
}
async function fetchDocumentSettings() {
	try {
		const data = extractPayload(await apiInstance.get("/settings/documents"), {});
		return {
			documentTypes: Array.isArray(data.documentTypes) ? data.documentTypes : [],
			expiryReminderDays: Array.isArray(data.expiryReminderDays) ? data.expiryReminderDays : [
				30,
				15,
				7
			],
			salarySlipWatermark: Boolean(data.salarySlipWatermark ?? true),
			salarySlipVisibleToEmployee: Boolean(data.salarySlipVisibleToEmployee ?? true),
			provisionSlipLockedRequired: Boolean(data.provisionSlipLockedRequired ?? true),
			provisionSlipVisibleToEmployee: Boolean(data.provisionSlipVisibleToEmployee ?? false),
			templatesCount: Number(data.templatesCount || 0)
		};
	} catch (err) {
		if (getErrorStatus(err) === 404) throw createMissingApiError("GET", "/api/v1/settings/documents", "Document & Slip Policies");
		throw err;
	}
}
async function updateDocumentSettings(form) {
	try {
		await apiInstance.put("/settings/documents", form);
	} catch (err) {
		if (getErrorStatus(err) === 404) throw createMissingApiError("PUT", "/api/v1/settings/documents", "Document & Slip Policies");
		throw err;
	}
}
async function fetchAssetSettings() {
	try {
		const data = extractPayload(await apiInstance.get("/settings/assets"), {});
		return {
			categories: Array.isArray(data.categories) ? data.categories : [],
			requireEmployeeAcknowledgment: Boolean(data.requireEmployeeAcknowledgment ?? true),
			mandatoryClearanceOnExit: Boolean(data.mandatoryClearanceOnExit ?? true),
			notifyWarrantyExpiryDays: Number(data.notifyWarrantyExpiryDays || 30),
			notifyAssetReturnDays: Number(data.notifyAssetReturnDays || 7)
		};
	} catch (err) {
		if (getErrorStatus(err) === 404) throw createMissingApiError("GET", "/api/v1/settings/assets", "Asset Allocation & Return Policies");
		throw err;
	}
}
async function updateAssetSettings(form) {
	try {
		await apiInstance.put("/settings/assets", form);
	} catch (err) {
		if (getErrorStatus(err) === 404) throw createMissingApiError("PUT", "/api/v1/settings/assets", "Asset Allocation & Return Policies");
		throw err;
	}
}
async function fetchNotificationSettings() {
	const data = await settingsApi$1.getNotificationSettings();
	return {
		emailNotifications: Boolean(data?.emailNotifications ?? true),
		inAppAlerts: Boolean(data?.inAppAlerts ?? true),
		slackAlerts: Boolean(data?.slackAlerts ?? false),
		weeklyDigest: Boolean(data?.weeklyDigest ?? false),
		securityAlerts: Boolean(data?.securityAlerts ?? true)
	};
}
async function updateNotificationSettings(form) {
	await settingsApi$1.updateNotificationSettings({
		emailNotifications: form.emailNotifications,
		inAppAlerts: form.inAppAlerts,
		slackAlerts: form.slackAlerts,
		weeklyDigest: form.weeklyDigest,
		securityAlerts: form.securityAlerts
	});
}
async function sendTestNotificationEmail(email) {
	return await settingsApi$1.testEmail({ email });
}
function UnsavedChangesBanner({ isDirty, submitting, onReset, onSave, className = "" }) {
	if (!isDirty) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `sticky bottom-4 z-30 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-card/95 p-3.5 shadow-xl backdrop-blur-md transition-all animate-in slide-in-from-bottom-2 ${className}`,
		role: "region",
		"aria-label": "Unsaved changes warning",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-7 w-7 place-items-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold text-foreground",
				children: "You have unsaved changes"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground",
				children: "Remember to save before navigating to another section."
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				variant: "outline",
				size: "sm",
				onClick: onReset,
				disabled: submitting,
				className: "h-8 gap-1.5 text-xs cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), "Discard"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				size: "sm",
				onClick: onSave,
				disabled: submitting,
				className: "h-8 gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), submitting ? "Saving..." : "Save Changes"]
			})]
		})]
	});
}
var CURRENCIES = [
	"INR (₹) - Indian Rupee",
	"USD ($) - US Dollar",
	"EUR (€) - Euro",
	"GBP (£) - British Pound",
	"AED (AED) - UAE Dirham"
];
var MONTHS = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
function CompanySection({ canEdit, onDirtyChange }) {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [initialData, setInitialData] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		name: "",
		logoUrl: "",
		logoDataUrl: "",
		stampUrl: "",
		stampDataUrl: "",
		address: "",
		city: "",
		state: "",
		country: "India",
		postalCode: "",
		contactEmail: "",
		contactPhone: "",
		website: "",
		timezone: "Asia/Kolkata (IST - UTC+05:30)",
		currency: "INR (₹) - Indian Rupee",
		financialYearStart: "April",
		financialYearEnd: "March"
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [logoUploading, setLogoUploading] = (0, import_react.useState)(false);
	const [logoUploadProgress, setLogoUploadProgress] = (0, import_react.useState)(0);
	const [logoApiNotice, setLogoApiNotice] = (0, import_react.useState)(null);
	const fileInputRef = (0, import_react.useRef)(null);
	const stampInputRef = (0, import_react.useRef)(null);
	const handleStampUpload = (file) => {
		if (!file) return;
		if (file.size > 2 * 1024 * 1024) {
			toast.error("Stamp file size must be less than 2MB.");
			return;
		}
		const reader = new FileReader();
		reader.onload = () => {
			setFormData((prev) => ({
				...prev,
				stampDataUrl: reader.result
			}));
			toast.success("Company stamp uploaded successfully!");
		};
		reader.readAsDataURL(file);
	};
	const isDirty = initialData ? JSON.stringify(initialData) !== JSON.stringify(formData) : false;
	(0, import_react.useEffect)(() => {
		onDirtyChange?.(isDirty);
	}, [isDirty, onDirtyChange]);
	const loadData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setErrors({});
		try {
			const data = await fetchCompanySettings();
			setInitialData(data);
			setFormData(data);
		} catch (err) {
			const msg = err?.message || "Failed to load company settings.";
			toast.error(msg);
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		loadData();
	}, [loadData]);
	const validate = () => {
		const errs = {};
		if (!formData.name.trim()) errs.name = "Company name is required";
		if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) errs.contactEmail = "Enter a valid email address";
		if (formData.contactPhone && !/^\+?[0-9\s-]{7,15}$/.test(formData.contactPhone)) errs.contactPhone = "Enter a valid phone number (7-15 digits)";
		if (formData.website && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.website)) errs.website = "Enter a valid website URL";
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};
	const handleSave = async (e) => {
		if (e) e.preventDefault();
		if (!canEdit) return;
		if (!validate()) {
			toast.error("Please resolve validation errors before saving.");
			return;
		}
		setSubmitting(true);
		try {
			const saved = await updateCompanySettings(formData);
			setInitialData(saved);
			setFormData(saved);
			toast.success("Company settings updated successfully!");
		} catch (err) {
			const msg = err?.message || "Failed to save company settings.";
			toast.error(msg);
		} finally {
			setSubmitting(false);
		}
	};
	const handleLogoUpload = async (file) => {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Please upload a valid image file (PNG, JPG, SVG, WebP).");
			return;
		}
		if (file.size > 2 * 1024 * 1024) {
			toast.error("Logo file size must be less than 2MB.");
			return;
		}
		setLogoUploading(true);
		setLogoUploadProgress(30);
		setLogoApiNotice(null);
		const reader = new FileReader();
		reader.onload = () => {
			setFormData((prev) => ({
				...prev,
				logoDataUrl: reader.result
			}));
		};
		reader.readAsDataURL(file);
		try {
			setLogoUploadProgress(70);
			const res = await uploadCompanyLogo(file);
			setLogoUploadProgress(100);
			if (res.logoUrl) setFormData((prev) => ({
				...prev,
				logoUrl: res.logoUrl
			}));
			toast.success("Company logo uploaded successfully!");
		} catch (err) {
			if (isMissingApiError(err)) {
				setLogoApiNotice(err.message);
				toast.info("Logo preview updated locally. Dedicated logo upload endpoint is not implemented on backend.");
			} else {
				const msg = err?.message || "Failed to upload logo to server.";
				toast.error(msg);
			}
		} finally {
			setLogoUploading(false);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-64 rounded-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
			children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 rounded-xl" }, i))
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSave,
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex items-center justify-between border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Organization Identity"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Legal name, public brand, and corporate logo."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4 text-primary shrink-0" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-6 sm:flex-row sm:items-start",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-2 sm:items-start",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-foreground",
									children: "Company Logo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative grid h-24 w-24 place-items-center rounded-2xl border-2 border-dashed border-border bg-muted/40 overflow-hidden shadow-inner",
									children: [formData.logoDataUrl || formData.logoUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: formData.logoDataUrl || formData.logoUrl,
										alt: "Company Logo",
										className: "h-full w-full object-contain p-2"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-8 w-8 text-muted-foreground/60" }), logoUploading && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "absolute inset-0 grid place-items-center bg-background/80 text-xs font-semibold text-primary",
										children: [logoUploadProgress, "%"]
									})]
								}),
								canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										ref: fileInputRef,
										accept: "image/*",
										className: "hidden",
										onChange: (e) => handleLogoUpload(e.target.files?.[0] || null)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "outline",
										size: "sm",
										onClick: () => fileInputRef.current?.click(),
										disabled: logoUploading,
										className: "mt-1 h-8 gap-1.5 text-xs cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), formData.logoDataUrl || formData.logoUrl ? "Change Logo" : "Upload Logo"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground",
										children: "PNG, JPG, or SVG under 2MB"
									})
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-2 sm:items-start",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-foreground",
									children: "Company Stamp / Seal"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "relative grid h-24 w-24 place-items-center rounded-2xl border-2 border-dashed border-border bg-muted/40 overflow-hidden shadow-inner",
									children: formData.stampDataUrl || formData.stampUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: formData.stampDataUrl || formData.stampUrl,
										alt: "Company Stamp",
										className: "h-full w-full object-contain p-2"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { className: "h-8 w-8 text-muted-foreground/60" })
								}),
								canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										ref: stampInputRef,
										accept: "image/*",
										className: "hidden",
										onChange: (e) => handleStampUpload(e.target.files?.[0] || null)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "outline",
										size: "sm",
										onClick: () => stampInputRef.current?.click(),
										className: "mt-1 h-8 gap-1.5 text-xs cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), formData.stampDataUrl || formData.stampUrl ? "Change Stamp" : "Upload Stamp"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground",
										children: "Official seal under 2MB"
									})
								] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 sm:col-span-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "company-name",
											className: "text-xs font-medium",
											children: "Company Legal Name *"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "company-name",
											value: formData.name,
											onChange: (e) => setFormData({
												...formData,
												name: e.target.value
											}),
											disabled: !canEdit,
											placeholder: "e.g. Acme Technologies India Private Limited",
											className: errors.name ? "border-destructive" : ""
										}),
										errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-destructive",
											children: errors.name
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "company-website",
											className: "text-xs font-medium",
											children: "Corporate Website"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "company-website",
												value: formData.website,
												onChange: (e) => setFormData({
													...formData,
													website: e.target.value
												}),
												disabled: !canEdit,
												placeholder: "https://example.com",
												className: `pl-9 ${errors.website ? "border-destructive" : ""}`
											})]
										}),
										errors.website && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-destructive",
											children: errors.website
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "company-email",
											className: "text-xs font-medium",
											children: "Contact Email"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "company-email",
												type: "email",
												value: formData.contactEmail,
												onChange: (e) => setFormData({
													...formData,
													contactEmail: e.target.value
												}),
												disabled: !canEdit,
												placeholder: "hr@example.com",
												className: `pl-9 ${errors.contactEmail ? "border-destructive" : ""}`
											})]
										}),
										errors.contactEmail && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-destructive",
											children: errors.contactEmail
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 sm:col-span-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "company-phone",
											className: "text-xs font-medium",
											children: "Contact Phone"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "company-phone",
												value: formData.contactPhone,
												onChange: (e) => setFormData({
													...formData,
													contactPhone: e.target.value
												}),
												disabled: !canEdit,
												placeholder: "+91 98765 43210",
												className: `pl-9 ${errors.contactPhone ? "border-destructive" : ""}`
											})]
										}),
										errors.contactPhone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-destructive",
											children: errors.contactPhone
										})
									]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Headquarters & Address"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Physical office location used on official correspondence and payslips."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "company-address",
								className: "text-xs font-medium",
								children: "Street Address"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "company-address",
								value: formData.address,
								onChange: (e) => setFormData({
									...formData,
									address: e.target.value
								}),
								disabled: !canEdit,
								placeholder: "Suite 400, Innovation Park, MG Road"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "company-city",
								className: "text-xs font-medium",
								children: "City"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "company-city",
								value: formData.city,
								onChange: (e) => setFormData({
									...formData,
									city: e.target.value
								}),
								disabled: !canEdit,
								placeholder: "Bengaluru"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "company-state",
								className: "text-xs font-medium",
								children: "State / Province"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "company-state",
								value: formData.state,
								onChange: (e) => setFormData({
									...formData,
									state: e.target.value
								}),
								disabled: !canEdit,
								placeholder: "Karnataka"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "company-country",
								className: "text-xs font-medium",
								children: "Country"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountrySelect, {
								id: "company-country",
								value: formData.country,
								disabled: !canEdit,
								onChange: (countryName, countryOpt) => {
									const targetTz = countryOpt?.primaryTimezone || getDefaultTimezoneForCountry(countryName).id;
									setFormData({
										...formData,
										country: countryName,
										timezone: targetTz || formData.timezone
									});
								}
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "company-postal",
								className: "text-xs font-medium",
								children: "Postal / PIN Code"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "company-postal",
								value: formData.postalCode,
								onChange: (e) => setFormData({
									...formData,
									postalCode: e.target.value
								}),
								disabled: !canEdit,
								placeholder: "560001"
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Fiscal & Localization Preferences"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Standard timezone, reporting currency, and financial year cycle."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-medium",
								children: "Operating Timezone"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TimezoneSelect, {
								id: "company-timezone",
								value: formData.timezone,
								country: formData.country,
								disabled: !canEdit,
								onChange: (v) => setFormData({
									...formData,
									timezone: v
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-medium",
								children: "Default Currency"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: formData.currency,
								onValueChange: (v) => setFormData({
									...formData,
									currency: v
								}),
								disabled: !canEdit,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "company-currency",
									className: "w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select currency" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CURRENCIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: c,
									children: c
								}, c)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-medium",
								children: "Financial Year Begins"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: formData.financialYearStart,
								onValueChange: (v) => setFormData({
									...formData,
									financialYearStart: v
								}),
								disabled: !canEdit,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "company-fy-start",
									className: "w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select month" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: MONTHS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: m,
									children: m
								}, m)) })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-medium",
								children: "Financial Year Ends"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: formData.financialYearEnd,
								onValueChange: (v) => setFormData({
									...formData,
									financialYearEnd: v
								}),
								disabled: !canEdit,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "company-fy-end",
									className: "w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select month" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: MONTHS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: m,
									children: m
								}, m)) })]
							})]
						})
					]
				})]
			}),
			canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-3 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: () => initialData && setFormData(initialData),
					disabled: !isDirty || submitting,
					className: "gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), "Discard Changes"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					size: "sm",
					disabled: !isDirty || submitting,
					className: "gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), submitting ? "Saving..." : "Save Company Settings"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnsavedChangesBanner, {
				isDirty,
				submitting,
				onReset: () => initialData && setFormData(initialData),
				onSave: () => handleSave()
			})
		]
	});
}
var Avatar = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Avatar$1, {
	ref,
	className: cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className),
	...props
}));
Avatar.displayName = Avatar$1.displayName;
var AvatarImage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage$1, {
	ref,
	className: cn("aspect-square h-full w-full", className),
	...props
}));
AvatarImage.displayName = AvatarImage$1.displayName;
var AvatarFallback = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback$1, {
	ref,
	className: cn("flex h-full w-full items-center justify-center rounded-full bg-muted", className),
	...props
}));
AvatarFallback.displayName = AvatarFallback$1.displayName;
function calculatePasswordStrength(pass) {
	if (!pass) return {
		score: 0,
		label: "None",
		color: "bg-muted"
	};
	let score = 0;
	if (pass.length >= 8) score++;
	if (/[A-Z]/.test(pass)) score++;
	if (/[a-z]/.test(pass)) score++;
	if (/[0-9]/.test(pass)) score++;
	if (/[^A-Za-z0-9]/.test(pass)) score++;
	if (score <= 2) return {
		score,
		label: "Weak",
		color: "bg-destructive"
	};
	if (score === 3 || score === 4) return {
		score,
		label: "Moderate",
		color: "bg-amber-500"
	};
	return {
		score: 5,
		label: "Strong",
		color: "bg-emerald-500"
	};
}
function MyProfileSection({ canEdit = true, onDirtyChange }) {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [initialData, setInitialData] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		name: "",
		email: "",
		phone: "",
		avatarUrl: "",
		designation: "",
		department: ""
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const [avatarUploading, setAvatarUploading] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const [passwordData, setPasswordData] = (0, import_react.useState)({
		currentPassword: "",
		newPassword: "",
		confirmPassword: ""
	});
	const [passwordErrors, setPasswordErrors] = (0, import_react.useState)({});
	const [changingPassword, setChangingPassword] = (0, import_react.useState)(false);
	const [showCurrentPassword, setShowCurrentPassword] = (0, import_react.useState)(false);
	const [showNewPassword, setShowNewPassword] = (0, import_react.useState)(false);
	const [showConfirmPassword, setShowConfirmPassword] = (0, import_react.useState)(false);
	const isDirty = initialData ? formData.name !== initialData.name || formData.email !== initialData.email || formData.phone !== initialData.phone : false;
	(0, import_react.useEffect)(() => {
		onDirtyChange?.(isDirty);
	}, [isDirty, onDirtyChange]);
	const loadProfile = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			const data = await fetchMyProfile();
			setInitialData(data);
			setFormData(data);
		} catch (err) {
			const msg = err?.message || "Failed to load profile details.";
			toast.error(msg);
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		loadProfile();
	}, [loadProfile]);
	const validateProfile = () => {
		const errs = {};
		if (!formData.name.trim()) errs.name = "Full name is required";
		if (!formData.email.trim()) errs.email = "Email is required";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "Enter a valid email address";
		if (formData.phone && !/^\+?[0-9\s-]{7,15}$/.test(formData.phone)) errs.phone = "Enter a valid phone number (7-15 digits)";
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};
	const handleProfileSave = async (e) => {
		if (e) e.preventDefault();
		if (!validateProfile()) {
			toast.error("Please resolve validation errors before saving.");
			return;
		}
		setSubmitting(true);
		try {
			const updated = await updateMyProfile(formData);
			setInitialData(updated);
			setFormData(updated);
			toast.success("Profile information updated successfully!");
		} catch (err) {
			const msg = err?.message || "Failed to update profile.";
			toast.error(msg);
		} finally {
			setSubmitting(false);
		}
	};
	const handleAvatarUpload = async (file) => {
		if (!file) return;
		if (!file.type.startsWith("image/")) {
			toast.error("Please select a valid image file.");
			return;
		}
		if (file.size > 3 * 1024 * 1024) {
			toast.error("Avatar image must be under 3MB.");
			return;
		}
		setAvatarUploading(true);
		try {
			const url = await uploadProfileAvatar(file);
			setFormData((prev) => ({
				...prev,
				avatarUrl: url
			}));
			if (initialData) setInitialData((prev) => prev ? {
				...prev,
				avatarUrl: url
			} : null);
			toast.success("Profile picture updated!");
		} catch (err) {
			const msg = err?.message || "Failed to upload avatar photo.";
			toast.error(msg);
		} finally {
			setAvatarUploading(false);
		}
	};
	const handlePasswordSubmit = async (e) => {
		e.preventDefault();
		const errs = {};
		if (!passwordData.currentPassword) errs.currentPassword = "Current password is required";
		if (!passwordData.newPassword) errs.newPassword = "New password is required";
		else if (passwordData.newPassword.length < 8) errs.newPassword = "Password must be at least 8 characters long";
		if (passwordData.newPassword !== passwordData.confirmPassword) errs.confirmPassword = "Passwords do not match";
		if (passwordData.currentPassword && passwordData.newPassword && passwordData.currentPassword === passwordData.newPassword) errs.newPassword = "New password must be different from current password";
		setPasswordErrors(errs);
		if (Object.keys(errs).length > 0) return;
		setChangingPassword(true);
		try {
			const res = await changeMyPassword({
				currentPassword: passwordData.currentPassword,
				newPassword: passwordData.newPassword,
				confirmPassword: passwordData.confirmPassword
			});
			const userEmail = formData.email || aurix.get().user?.email;
			let sessionRefreshed = false;
			if (userEmail) try {
				const loginData = parseLoginResponse(await authService.login({
					identifier: userEmail,
					password: passwordData.newPassword
				}));
				if (loginData?.accessToken) {
					persistAuthSession(loginData.user, {
						accessToken: loginData.accessToken,
						refreshToken: loginData.refreshToken
					});
					sessionRefreshed = true;
				}
			} catch {
				sessionRefreshed = false;
			}
			setPasswordData({
				currentPassword: "",
				newPassword: "",
				confirmPassword: ""
			});
			if (sessionRefreshed) toast.success(res.message || "Password changed successfully! Session renewed.");
			else {
				toast.success("Password changed successfully. Please log in with your new password.");
				setTimeout(() => {
					logout({ redirect: true });
				}, 1500);
			}
		} catch (err) {
			const apiErr = err;
			const msg = apiErr?.message || "Failed to change password. Please verify current password.";
			if (apiErr?.status === 401) setPasswordErrors({ currentPassword: "Incorrect current password" });
			else if (apiErr?.status === 400 && msg.toLowerCase().includes("different")) setPasswordErrors({ newPassword: "New password must be different from current password" });
			else if (apiErr?.data && typeof apiErr.data === "object") {
				const fieldMap = {};
				if (apiErr.data.current_password) fieldMap.currentPassword = apiErr.data.current_password;
				if (apiErr.data.new_password) fieldMap.newPassword = apiErr.data.new_password;
				if (apiErr.data.confirm_password) fieldMap.confirmPassword = apiErr.data.confirm_password;
				if (Object.keys(fieldMap).length > 0) setPasswordErrors(fieldMap);
			}
			toast.error(msg);
		} finally {
			setChangingPassword(false);
		}
	};
	const strength = calculatePasswordStrength(passwordData.newPassword);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-48 rounded-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 rounded-xl" }, i))
		})]
	});
	const initials = formData.name ? formData.name.split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase() : "U";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleProfileSave,
			className: "space-y-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-5 flex items-center justify-between border-b border-border/60 pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold tracking-tight text-foreground",
							children: "Personal Information"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Manage your identity coordinates and avatar."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-primary shrink-0" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-6 sm:flex-row sm:items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-2 sm:items-start",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-foreground",
									children: "Profile Picture"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Avatar, {
										className: "h-24 w-24 border-2 border-border shadow-md",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarImage, {
											src: formData.avatarUrl,
											alt: formData.name,
											className: "object-cover"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AvatarFallback, {
											className: "bg-primary/10 text-primary font-bold text-lg",
											children: initials
										})]
									}), avatarUploading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute inset-0 grid place-items-center rounded-full bg-background/80 text-[10px] font-semibold text-primary",
										children: "Uploading..."
									})]
								}),
								canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										ref: fileInputRef,
										accept: "image/*",
										className: "hidden",
										onChange: (e) => handleAvatarUpload(e.target.files?.[0] || null)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "outline",
										size: "sm",
										onClick: () => fileInputRef.current?.click(),
										disabled: avatarUploading,
										className: "mt-1 h-8 gap-1.5 text-xs cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-3.5 w-3.5" }), "Change Photo"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground",
										children: "PNG, JPG, or WebP under 3MB"
									})
								] })
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 sm:col-span-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "profile-name",
											className: "text-xs font-medium",
											children: "Full Name *"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "profile-name",
											value: formData.name,
											onChange: (e) => setFormData({
												...formData,
												name: e.target.value
											}),
											disabled: !canEdit,
											placeholder: "Your Full Name",
											className: errors.name ? "border-destructive" : ""
										}),
										errors.name && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-destructive",
											children: errors.name
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "profile-email",
											className: "text-xs font-medium",
											children: "Email Address *"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "profile-email",
												type: "email",
												value: formData.email,
												onChange: (e) => setFormData({
													...formData,
													email: e.target.value
												}),
												disabled: !canEdit,
												placeholder: "you@company.com",
												className: `pl-9 ${errors.email ? "border-destructive" : ""}`
											})]
										}),
										errors.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-destructive",
											children: errors.email
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "profile-phone",
											className: "text-xs font-medium",
											children: "Phone Number"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "profile-phone",
												value: formData.phone,
												onChange: (e) => setFormData({
													...formData,
													phone: e.target.value
												}),
												disabled: !canEdit,
												placeholder: "+91 98765 43210",
												className: `pl-9 ${errors.phone ? "border-destructive" : ""}`
											})]
										}),
										errors.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-destructive",
											children: errors.phone
										})
									]
								}),
								formData.designation && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-medium text-muted-foreground",
										children: "Designation"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formData.designation,
										disabled: true,
										className: "bg-muted/30 text-muted-foreground"
									})]
								}),
								formData.department && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-medium text-muted-foreground",
										children: "Department"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formData.department,
										disabled: true,
										className: "bg-muted/30 text-muted-foreground"
									})]
								})
							]
						})]
					}),
					canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex justify-end gap-2 border-t border-border/60 pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "button",
							variant: "outline",
							size: "sm",
							onClick: () => initialData && setFormData(initialData),
							disabled: !isDirty || submitting,
							className: "gap-1.5 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), "Discard"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							size: "sm",
							disabled: !isDirty || submitting,
							className: "gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), submitting ? "Saving..." : "Save Profile"]
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnsavedChangesBanner, {
				isDirty,
				submitting,
				onReset: () => initialData && setFormData(initialData),
				onSave: () => handleProfileSave()
			})]
		}), canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handlePasswordSubmit,
			className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex items-center justify-between border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Change Password"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Update your account login password with strong entropy validation."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4 text-primary shrink-0" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 md:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "current-password",
									className: "text-xs font-medium",
									children: "Current Password"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "current-password",
										type: showCurrentPassword ? "text" : "password",
										value: passwordData.currentPassword,
										onChange: (e) => setPasswordData({
											...passwordData,
											currentPassword: e.target.value
										}),
										placeholder: "Enter current password",
										autoComplete: "current-password",
										className: `pr-10 ${passwordErrors.currentPassword ? "border-destructive" : ""}`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowCurrentPassword(!showCurrentPassword),
										className: "absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer",
										"aria-label": "Toggle password visibility",
										children: showCurrentPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
									})]
								}),
								passwordErrors.currentPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-destructive",
									children: passwordErrors.currentPassword
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "new-password",
									className: "text-xs font-medium",
									children: "New Password"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "new-password",
										type: showNewPassword ? "text" : "password",
										value: passwordData.newPassword,
										onChange: (e) => setPasswordData({
											...passwordData,
											newPassword: e.target.value
										}),
										placeholder: "Minimum 8 characters",
										autoComplete: "new-password",
										className: `pr-10 ${passwordErrors.newPassword ? "border-destructive" : ""}`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowNewPassword(!showNewPassword),
										className: "absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer",
										"aria-label": "Toggle new password visibility",
										children: showNewPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
									})]
								}),
								passwordErrors.newPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-destructive",
									children: passwordErrors.newPassword
								}),
								passwordData.newPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-[11px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground",
											children: "Strength:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-medium text-foreground",
											children: strength.label
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1.5 w-full rounded-full bg-muted overflow-hidden flex gap-0.5",
										children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-full flex-1 transition-colors ${i < strength.score ? strength.color : "bg-muted"}` }, i))
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "confirm-password",
									className: "text-xs font-medium",
									children: "Confirm New Password"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "confirm-password",
										type: showConfirmPassword ? "text" : "password",
										value: passwordData.confirmPassword,
										onChange: (e) => setPasswordData({
											...passwordData,
											confirmPassword: e.target.value
										}),
										placeholder: "Re-enter new password",
										autoComplete: "new-password",
										className: `pr-10 ${passwordErrors.confirmPassword ? "border-destructive" : ""}`
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => setShowConfirmPassword(!showConfirmPassword),
										className: "absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer",
										"aria-label": "Toggle confirm password visibility",
										children: showConfirmPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
									})]
								}),
								passwordErrors.confirmPassword && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-destructive",
									children: passwordErrors.confirmPassword
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 pt-1",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						size: "sm",
						disabled: changingPassword || !passwordData.newPassword,
						className: "gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), changingPassword ? "Updating..." : "Update Password"]
					})
				})
			]
		})]
	});
}
function EmployeesSection({ canEdit, onDirtyChange }) {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [departments, setDepartments] = (0, import_react.useState)([]);
	const [designations, setDesignations] = (0, import_react.useState)([]);
	const [addDeptOpen, setAddDeptOpen] = (0, import_react.useState)(false);
	const [newDept, setNewDept] = (0, import_react.useState)({
		name: "",
		code: "",
		description: ""
	});
	const [creatingDept, setCreatingDept] = (0, import_react.useState)(false);
	const [initialRules, setInitialRules] = (0, import_react.useState)(null);
	const [rules, setRules] = (0, import_react.useState)({
		idPrefix: "EMP-",
		idNumberLength: 4,
		idSuffix: "",
		probationDays: 90,
		noticePeriodDays: 30,
		allowPastJoiningDate: true,
		maxPastJoiningDays: 60,
		statuses: [
			"Active",
			"Probation",
			"Notice Period",
			"Terminated",
			"Suspended"
		],
		employmentTypes: [
			"Full-Time",
			"Part-Time",
			"Contract",
			"Intern"
		]
	});
	const isDirty = initialRules ? JSON.stringify(initialRules) !== JSON.stringify(rules) : false;
	(0, import_react.useEffect)(() => {
		onDirtyChange?.(isDirty);
	}, [isDirty, onDirtyChange]);
	const loadData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			setDepartments(await fetchDepartmentsList());
		} catch (e) {
			console.error("Error loading departments", e);
		}
		try {
			setDesignations(await fetchDesignationsList());
		} catch (e) {
			console.error("Error loading designations", e);
		}
		try {
			const form = await fetchEmployeeSettings();
			setInitialRules(form);
			setRules(form);
		} catch (err) {
			if (!isMissingApiError(err)) console.warn("Could not load employee settings rules:", err);
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		loadData();
	}, [loadData]);
	const handleCreateDepartment = async (e) => {
		e.preventDefault();
		if (!newDept.name.trim()) {
			toast.error("Department name is required.");
			return;
		}
		setCreatingDept(true);
		try {
			await createDepartmentApi(newDept);
			toast.success(`Department "${newDept.name}" created successfully!`);
			setAddDeptOpen(false);
			setNewDept({
				name: "",
				code: "",
				description: ""
			});
			setDepartments(await fetchDepartmentsList());
		} catch (err) {
			const msg = err?.message || "Failed to create department.";
			toast.error(msg);
		} finally {
			setCreatingDept(false);
		}
	};
	const handleDeleteDepartment = async (id, name) => {
		if (!confirm(`Are you sure you want to delete department "${name}"?`)) return;
		try {
			await deleteDepartmentApi(id);
			toast.success(`Department "${name}" deleted.`);
			setDepartments((prev) => prev.filter((d) => d.id !== id));
		} catch (err) {
			const msg = err?.message || "Failed to delete department.";
			toast.error(msg);
		}
	};
	const handleSaveRules = async (e) => {
		if (e) e.preventDefault();
		if (!canEdit) return;
		setSubmitting(true);
		try {
			await updateEmployeeSettings(rules);
			setInitialRules(rules);
			toast.success("Employee settings saved successfully!");
		} catch (err) {
			if (isMissingApiError(err)) toast.error("Employee configuration rules API is not implemented on the backend.");
			else {
				const msg = err?.message || "Failed to update employee configuration.";
				toast.error(msg);
			}
		} finally {
			setSubmitting(false);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-56 rounded-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i))
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Departments"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Active organizational units in your company."
					})] }), canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => setAddDeptOpen(true),
						className: "gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), "Add Department"]
					})]
				}), departments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-8 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "mx-auto h-8 w-8 text-muted-foreground/50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "No departments configured yet."
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: departments.map((dept) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border bg-card/80 p-3.5 shadow-2xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-xs font-semibold text-foreground",
									children: dept.name
								}), dept.code && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "text-[9px] px-1 py-0",
									children: dept.code
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate text-[11px] text-muted-foreground",
								children: ["Head: ", dept.managerName || "Unassigned"]
							})]
						}), canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => handleDeleteDepartment(dept.id, dept.name),
							className: "h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer",
							"aria-label": `Delete ${dept.name}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
						})]
					}, dept.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Designations & Job Roles"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Standard job titles configured for team members."
					})]
				}), designations.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "py-6 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "mx-auto h-7 w-7 text-muted-foreground/50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "Designations are synced through employee onboarding records."
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: designations.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "inline-flex items-center rounded-lg border border-border bg-muted/30 px-3 py-1 text-xs font-medium text-foreground",
						children: d.name
					}, d.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSaveRules,
				className: "space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-5 border-b border-border/60 pb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-sm font-semibold tracking-tight text-foreground",
								children: "Employee ID & Joining Rules"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Conventions for auto-generating employee IDs and probation timelines."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "id-prefix",
										className: "text-xs font-medium",
										children: "ID Prefix"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "id-prefix",
										value: rules.idPrefix,
										onChange: (e) => setRules({
											...rules,
											idPrefix: e.target.value
										}),
										disabled: !canEdit,
										placeholder: "e.g. OFC-"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "id-digits",
										className: "text-xs font-medium",
										children: "Sequence Digits"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "id-digits",
										type: "number",
										min: 2,
										max: 8,
										value: rules.idNumberLength,
										onChange: (e) => setRules({
											...rules,
											idNumberLength: Number(e.target.value)
										}),
										disabled: !canEdit
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "id-suffix",
										className: "text-xs font-medium",
										children: "ID Suffix (Optional)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "id-suffix",
										value: rules.idSuffix,
										onChange: (e) => setRules({
											...rules,
											idSuffix: e.target.value
										}),
										disabled: !canEdit,
										placeholder: "e.g. -IN"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "probation-days",
										className: "text-xs font-medium",
										children: "Standard Probation Period (Days)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "probation-days",
										type: "number",
										min: 0,
										value: rules.probationDays,
										onChange: (e) => setRules({
											...rules,
											probationDays: Number(e.target.value)
										}),
										disabled: !canEdit
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "notice-days",
										className: "text-xs font-medium",
										children: "Standard Notice Period (Days)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "notice-days",
										type: "number",
										min: 0,
										value: rules.noticePeriodDays,
										onChange: (e) => setRules({
											...rules,
											noticePeriodDays: Number(e.target.value)
										}),
										disabled: !canEdit
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "past-joining-days",
										className: "text-xs font-medium",
										children: "Max Backdated Joining (Days)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "past-joining-days",
										type: "number",
										min: 0,
										value: rules.maxPastJoiningDays,
										onChange: (e) => setRules({
											...rules,
											maxPastJoiningDays: Number(e.target.value)
										}),
										disabled: !canEdit
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 rounded-xl border border-border/80 bg-muted/20 p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: [
									"Generated Sample ID:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-foreground",
										children: [
											rules.idPrefix,
											"0".repeat(Math.max(0, rules.idNumberLength - 1)),
											"1",
											rules.idSuffix
										]
									})
								]
							})
						}),
						canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex justify-end gap-2 border-t border-border/60 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => initialRules && setRules(initialRules),
								disabled: !isDirty || submitting,
								className: "gap-1.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), "Discard"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								size: "sm",
								disabled: !isDirty || submitting,
								className: "gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), submitting ? "Saving..." : "Save Employee Rules"]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnsavedChangesBanner, {
					isDirty,
					submitting,
					onReset: () => initialRules && setRules(initialRules),
					onSave: () => handleSaveRules()
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: addDeptOpen,
				onOpenChange: setAddDeptOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
					className: "sm:max-w-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateDepartment,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-base font-semibold",
								children: "Add New Department"
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4 py-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "new-dept-name",
											className: "text-xs font-medium",
											children: "Department Name *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "new-dept-name",
											value: newDept.name,
											onChange: (e) => setNewDept({
												...newDept,
												name: e.target.value
											}),
											placeholder: "e.g. Engineering, Sales, Finance",
											autoFocus: true
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "new-dept-code",
											className: "text-xs font-medium",
											children: "Department Code"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "new-dept-code",
											value: newDept.code,
											onChange: (e) => setNewDept({
												...newDept,
												code: e.target.value
											}),
											placeholder: "e.g. ENG, SLS, FIN"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "new-dept-desc",
											className: "text-xs font-medium",
											children: "Description"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "new-dept-desc",
											value: newDept.description,
											onChange: (e) => setNewDept({
												...newDept,
												description: e.target.value
											}),
											placeholder: "Optional unit description"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => setAddDeptOpen(false),
								disabled: creatingDept,
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								size: "sm",
								disabled: creatingDept || !newDept.name.trim(),
								className: "bg-primary text-primary-foreground hover:bg-primary/90",
								children: creatingDept ? "Creating..." : "Create Department"
							})] })
						]
					})
				})
			})
		]
	});
}
function AttendanceSection({ canEdit, onDirtyChange }) {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [faceSupported, setFaceSupported] = (0, import_react.useState)(false);
	const [initialData, setInitialData] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		attendanceMethod: "web",
		faceVerificationEnabled: false,
		faceConfidenceThreshold: 85,
		workStartTime: "09:30",
		workEndTime: "18:30",
		fullDayMinHours: 8,
		halfDayMinHours: 4,
		gracePeriodMinutes: 15,
		maxLateMarksPerMonth: 3,
		lateMarkPenaltyType: "half_day",
		earlyLeaveThresholdMinutes: 30,
		overtimeEligible: true,
		minOvertimeMinutes: 60,
		overtimeRateMultiplier: 1.5,
		notifyOnLateCheckIn: true,
		notifyOnMissedCheckOut: true
	});
	const [errors, setErrors] = (0, import_react.useState)({});
	const isDirty = initialData ? JSON.stringify(initialData) !== JSON.stringify(formData) : false;
	(0, import_react.useEffect)(() => {
		onDirtyChange?.(isDirty);
	}, [isDirty, onDirtyChange]);
	const loadData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			setFaceSupported((await fetchFaceBiometricSupport()).supported);
		} catch {
			setFaceSupported(false);
		}
		try {
			const data = await fetchAttendanceSettings();
			setInitialData(data);
			setFormData(data);
		} catch (err) {
			if (!isMissingApiError(err)) {
				const msg = err?.message || "Failed to load attendance configuration.";
				toast.error(msg);
			}
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		loadData();
	}, [loadData]);
	const validate = () => {
		const errs = {};
		if (formData.fullDayMinHours <= 0 || formData.fullDayMinHours > 24) errs.fullDayMinHours = "Must be between 1 and 24 hours";
		if (formData.halfDayMinHours <= 0 || formData.halfDayMinHours >= formData.fullDayMinHours) errs.halfDayMinHours = "Must be positive and less than full day hours";
		if (formData.gracePeriodMinutes < 0) errs.gracePeriodMinutes = "Grace period cannot be negative";
		if (formData.overtimeRateMultiplier < 1) errs.overtimeRateMultiplier = "Multiplier must be at least 1.0x";
		setErrors(errs);
		return Object.keys(errs).length === 0;
	};
	const handleSave = async (e) => {
		if (e) e.preventDefault();
		if (!canEdit) return;
		if (!validate()) {
			toast.error("Please correct invalid attendance rules before saving.");
			return;
		}
		setSubmitting(true);
		try {
			await updateAttendanceSettings(formData);
			setInitialData(formData);
			toast.success("Attendance policies updated successfully!");
		} catch (err) {
			if (isMissingApiError(err)) toast.error("Attendance settings API is not implemented on backend.");
			else {
				const msg = err?.message || "Failed to update attendance configuration.";
				toast.error(msg);
			}
		} finally {
			setSubmitting(false);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-56 rounded-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-xl" }, i))
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSave,
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex items-center justify-between border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Attendance Verification Mode"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Select authorized check-in mechanisms and face verification status."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanFace, { className: "h-4 w-4 text-primary shrink-0" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-5 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-medium",
							children: "Primary Attendance Method"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: formData.attendanceMethod,
							onValueChange: (v) => setFormData({
								...formData,
								attendanceMethod: v
							}),
							disabled: !canEdit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								id: "attendance-method",
								className: "w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select method" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "web",
									children: "Web Browser Portal"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "mobile_geofence",
									children: "Mobile App with Geofencing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
									value: "face_biometric",
									disabled: !faceSupported,
									children: ["Biometric Face Recognition ", !faceSupported && "(Backend Unsupported)"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "hybrid",
									children: "Hybrid (Web + Mobile + Geofence)"
								})
							] })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-medium text-foreground",
								children: "AI Face Verification"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: faceSupported ? "Live backend support active. Enforces facial recognition at check-in." : "Unavailable: Face recognition module is not enabled by backend attendance service."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: formData.faceVerificationEnabled && faceSupported,
							onCheckedChange: (checked) => setFormData({
								...formData,
								faceVerificationEnabled: checked
							}),
							disabled: !canEdit || !faceSupported
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Work Hours & Shift Boundaries"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Default office hours and minimum required working duration."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "start-time",
								className: "text-xs font-medium",
								children: "Shift Start Time"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "start-time",
								type: "time",
								value: formData.workStartTime,
								onChange: (e) => setFormData({
									...formData,
									workStartTime: e.target.value
								}),
								disabled: !canEdit
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "end-time",
								className: "text-xs font-medium",
								children: "Shift End Time"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "end-time",
								type: "time",
								value: formData.workEndTime,
								onChange: (e) => setFormData({
									...formData,
									workEndTime: e.target.value
								}),
								disabled: !canEdit
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "fullday-hours",
									className: "text-xs font-medium",
									children: "Full-Day Hours"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "fullday-hours",
									type: "number",
									step: "0.5",
									min: "1",
									max: "24",
									value: formData.fullDayMinHours,
									onChange: (e) => setFormData({
										...formData,
										fullDayMinHours: Number(e.target.value)
									}),
									disabled: !canEdit,
									className: errors.fullDayMinHours ? "border-destructive" : ""
								}),
								errors.fullDayMinHours && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-destructive",
									children: errors.fullDayMinHours
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "halfday-hours",
									className: "text-xs font-medium",
									children: "Half-Day Hours"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "halfday-hours",
									type: "number",
									step: "0.5",
									min: "1",
									max: "12",
									value: formData.halfDayMinHours,
									onChange: (e) => setFormData({
										...formData,
										halfDayMinHours: Number(e.target.value)
									}),
									disabled: !canEdit,
									className: errors.halfDayMinHours ? "border-destructive" : ""
								}),
								errors.halfDayMinHours && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-destructive",
									children: errors.halfDayMinHours
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Late Marks, Grace Period & Early Exit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Tolerance window and automatic deduction triggers."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "grace-period",
									className: "text-xs font-medium",
									children: "Grace Period (Minutes)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "grace-period",
									type: "number",
									min: "0",
									value: formData.gracePeriodMinutes,
									onChange: (e) => setFormData({
										...formData,
										gracePeriodMinutes: Number(e.target.value)
									}),
									disabled: !canEdit,
									className: errors.gracePeriodMinutes ? "border-destructive" : ""
								}),
								errors.gracePeriodMinutes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-destructive",
									children: errors.gracePeriodMinutes
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "max-late-marks",
								className: "text-xs font-medium",
								children: "Max Monthly Late Marks"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "max-late-marks",
								type: "number",
								min: "0",
								value: formData.maxLateMarksPerMonth,
								onChange: (e) => setFormData({
									...formData,
									maxLateMarksPerMonth: Number(e.target.value)
								}),
								disabled: !canEdit
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-medium",
								children: "Late Mark Consequence"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: formData.lateMarkPenaltyType,
								onValueChange: (v) => setFormData({
									...formData,
									lateMarkPenaltyType: v
								}),
								disabled: !canEdit,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "late-penalty",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select consequence" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "half_day",
										children: "Deduct Half-Day Leave"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "lop",
										children: "Deduct 1 Day Salary (LOP)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "warning",
										children: "Official Warning Only"
									})
								] })]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Overtime & Alert Preferences"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Extra working hours remuneration and system notifications."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "min-ot-minutes",
								className: "text-xs font-medium",
								children: "Minimum Extra Time for OT (Minutes)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "min-ot-minutes",
								type: "number",
								min: "0",
								value: formData.minOvertimeMinutes,
								onChange: (e) => setFormData({
									...formData,
									minOvertimeMinutes: Number(e.target.value)
								}),
								disabled: !canEdit
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "ot-multiplier",
									className: "text-xs font-medium",
									children: "Overtime Rate Multiplier"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "ot-multiplier",
									type: "number",
									step: "0.1",
									min: "1.0",
									value: formData.overtimeRateMultiplier,
									onChange: (e) => setFormData({
										...formData,
										overtimeRateMultiplier: Number(e.target.value)
									}),
									disabled: !canEdit,
									className: errors.overtimeRateMultiplier ? "border-destructive" : ""
								}),
								errors.overtimeRateMultiplier && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-destructive",
									children: errors.overtimeRateMultiplier
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3 sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-foreground",
									children: "Late Check-in Email Alert"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Notify employee and manager when clock-in exceeds grace period."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: formData.notifyOnLateCheckIn,
								onCheckedChange: (checked) => setFormData({
									...formData,
									notifyOnLateCheckIn: checked
								}),
								disabled: !canEdit
							})]
						})
					]
				})]
			}),
			canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-3 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: () => initialData && setFormData(initialData),
					disabled: !isDirty || submitting,
					className: "gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), "Discard Changes"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					size: "sm",
					disabled: !isDirty || submitting,
					className: "gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), submitting ? "Saving..." : "Save Attendance Settings"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnsavedChangesBanner, {
				isDirty,
				submitting,
				onReset: () => initialData && setFormData(initialData),
				onSave: () => handleSave()
			})
		]
	});
}
function LeaveSection({ canEdit, onDirtyChange }) {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [missingNotice, setMissingNotice] = (0, import_react.useState)(null);
	const [initialData, setInitialData] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		leaveTypes: [],
		approvalWorkflow: "manager_then_hr",
		autoApproveDaysAfterPending: 7,
		allowNegativeBalance: false,
		notifyOnLeaveRequest: true,
		notifyOnApprovalDecision: true
	});
	const isDirty = initialData ? JSON.stringify(initialData) !== JSON.stringify(formData) : false;
	(0, import_react.useEffect)(() => {
		onDirtyChange?.(isDirty);
	}, [isDirty, onDirtyChange]);
	const loadData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setMissingNotice(null);
		try {
			const data = await fetchLeaveSettings();
			const combined = {
				...data,
				leaveTypes: data.leaveTypes || []
			};
			setInitialData(combined);
			setFormData(combined);
		} catch (err) {
			if (isMissingApiError(err)) {
				setMissingNotice(err.message);
				setInitialData(formData);
			} else {
				const msg = err?.message || "Failed to load leave settings.";
				toast.error(msg);
			}
		} finally {
			setLoading(false);
		}
	}, [formData]);
	(0, import_react.useEffect)(() => {
		loadData();
	}, [loadData]);
	const handleUpdateType = (index, key, val) => {
		const updated = [...formData.leaveTypes];
		updated[index] = {
			...updated[index],
			[key]: val
		};
		setFormData({
			...formData,
			leaveTypes: updated
		});
	};
	const handleAddType = () => {
		const newType = {
			id: `leave_${Date.now()}`,
			name: "New Leave Category",
			annualQuota: 10,
			carryForwardAllowed: false,
			maxCarryForwardDays: 0,
			requiresAttachment: false,
			paid: true
		};
		setFormData({
			...formData,
			leaveTypes: [...formData.leaveTypes, newType]
		});
	};
	const handleDeleteType = (index) => {
		const updated = formData.leaveTypes.filter((_, i) => i !== index);
		setFormData({
			...formData,
			leaveTypes: updated
		});
	};
	const handleSave = async (e) => {
		if (e) e.preventDefault();
		if (!canEdit) return;
		for (const lt of formData.leaveTypes) {
			if (lt.annualQuota < 0) {
				toast.error(`Quota for ${lt.name} cannot be negative.`);
				return;
			}
			if (lt.maxCarryForwardDays < 0) {
				toast.error(`Carry forward days for ${lt.name} cannot be negative.`);
				return;
			}
		}
		setSubmitting(true);
		try {
			await updateLeaveSettings(formData);
			setInitialData(formData);
			toast.success("Leave policies updated successfully!");
		} catch (err) {
			if (isMissingApiError(err)) {
				setMissingNotice(err.message);
				toast.error("Leave configuration API is not implemented on backend.");
			} else {
				const msg = err?.message || "Failed to update leave settings.";
				toast.error(msg);
			}
		} finally {
			setSubmitting(false);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-56 rounded-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16 rounded-xl" }, i))
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSave,
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Leave Categories & Annual Quotas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Define statutory leave allowances and rollover rules."
					})] }), canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						onClick: handleAddType,
						className: "gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), "Add Leave Type"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: formData.leaveTypes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl",
						children: "No leave categories defined. Click \"Add Leave Type\" to create one."
					}) : formData.leaveTypes.map((type, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-3 rounded-xl border border-border bg-card/80 p-3.5 sm:grid-cols-12 sm:items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 sm:col-span-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-[11px] font-medium text-muted-foreground",
									children: "Category Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: type.name,
									onChange: (e) => handleUpdateType(idx, "name", e.target.value),
									disabled: !canEdit,
									className: "h-8 text-xs font-medium"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-[11px] font-medium text-muted-foreground",
									children: "Annual Days"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									value: type.annualQuota,
									onChange: (e) => handleUpdateType(idx, "annualQuota", Number(e.target.value)),
									disabled: !canEdit,
									className: "h-8 text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 sm:col-span-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[11px] font-medium text-muted-foreground",
										children: "Carry Forward"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: type.carryForwardAllowed,
										onCheckedChange: (c) => handleUpdateType(idx, "carryForwardAllowed", c),
										disabled: !canEdit
									})]
								}), type.carryForwardAllowed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									value: type.maxCarryForwardDays,
									onChange: (e) => handleUpdateType(idx, "maxCarryForwardDays", Number(e.target.value)),
									disabled: !canEdit,
									placeholder: "Max days",
									className: "h-8 text-xs"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] text-muted-foreground italic",
									children: "No carry-forward"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center justify-between sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[11px] font-medium text-muted-foreground",
										children: "Paid"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: type.paid,
										onCheckedChange: (c) => handleUpdateType(idx, "paid", c),
										disabled: !canEdit
									}) })]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end sm:col-span-1",
								children: canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									onClick: () => handleDeleteType(idx),
									className: "h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
								})
							})
						]
					}, type.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Approval Routing & Restrictions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Multi-tier hierarchy and balance deficit safeguards."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-5 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-medium",
								children: "Leave Approval Hierarchy"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: formData.approvalWorkflow,
								onValueChange: (v) => setFormData({
									...formData,
									approvalWorkflow: v
								}),
								disabled: !canEdit,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "leave-workflow",
									className: "w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select workflow" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "single_manager",
										children: "Reporting Manager Only"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "manager_then_hr",
										children: "Reporting Manager then HR Admin"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "hr_only",
										children: "HR Operations Only"
									})
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "auto-approve-days",
								className: "text-xs font-medium",
								children: "Auto-Escalate / Approve (Days)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "auto-approve-days",
								type: "number",
								min: 1,
								value: formData.autoApproveDaysAfterPending,
								onChange: (e) => setFormData({
									...formData,
									autoApproveDaysAfterPending: Number(e.target.value)
								}),
								disabled: !canEdit
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4 sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-foreground",
									children: "Prevent Negative Leave Balances"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "When enabled, employees cannot apply for leave beyond their earned/allocated balance."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: !formData.allowNegativeBalance,
								onCheckedChange: (checked) => setFormData({
									...formData,
									allowNegativeBalance: !checked
								}),
								disabled: !canEdit
							})]
						})
					]
				})]
			}),
			canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-3 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: () => initialData && setFormData(initialData),
					disabled: !isDirty || submitting,
					className: "gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), "Discard Changes"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					size: "sm",
					disabled: !isDirty || submitting,
					className: "gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), submitting ? "Saving..." : "Save Leave Settings"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnsavedChangesBanner, {
				isDirty,
				submitting,
				onReset: () => initialData && setFormData(initialData),
				onSave: () => handleSave()
			})
		]
	});
}
function PayrollSection({ canEdit, onDirtyChange }) {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [initialData, setInitialData] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		payFrequency: "monthly",
		currency: "INR (₹)",
		salaryStructureName: "Standard CTC Breakup",
		components: [],
		pfEnabled: true,
		pfEmployeePercent: 12,
		pfEmployerPercent: 12,
		pfWageCeiling: 15e3,
		esiEnabled: true,
		esiEmployeePercent: .75,
		esiEmployerPercent: 3.25,
		esiWageCeiling: 21e3,
		ptEnabled: true,
		ptState: "Maharashtra",
		tdsWindowOpen: true,
		tdsDefaultRegime: "new",
		payslipGenerationDay: 1,
		passwordProtectedPayslips: true,
		showLeaveBalanceOnPayslip: true
	});
	const isDirty = initialData ? JSON.stringify(initialData) !== JSON.stringify(formData) : false;
	(0, import_react.useEffect)(() => {
		onDirtyChange?.(isDirty);
	}, [isDirty, onDirtyChange]);
	const loadData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		try {
			const data = await fetchPayrollSettings();
			const combined = {
				...data,
				components: data.components || []
			};
			setInitialData(combined);
			setFormData(combined);
		} catch (err) {
			if (!isMissingApiError(err)) {
				const msg = err?.message || "Failed to load payroll configuration.";
				toast.error(msg);
			}
		} finally {
			setLoading(false);
		}
	}, [formData]);
	(0, import_react.useEffect)(() => {
		loadData();
	}, [loadData]);
	const handleSave = async (e) => {
		if (e) e.preventDefault();
		if (!canEdit) return;
		setSubmitting(true);
		try {
			await updatePayrollSettings(formData);
			setInitialData(formData);
			toast.success("Payroll configuration updated successfully!");
		} catch (err) {
			if (isMissingApiError(err)) toast.error("Statutory payroll configuration API is not implemented on backend.");
			else {
				const msg = err?.message || "Failed to update payroll settings.";
				toast.error(msg);
			}
		} finally {
			setSubmitting(false);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-56 rounded-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-xl" }, i))
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSave,
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-5 flex items-center justify-between border-b border-border/60 pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold tracking-tight text-foreground",
							children: "Salary Structure & Cycles"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "CTC apportionment and scheduled disbursal frequency."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "h-4 w-4 text-primary shrink-0" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "payroll-cycle",
									className: "text-xs font-medium",
									children: "Disbursal Frequency"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: formData.payFrequency,
									onValueChange: (v) => setFormData({
										...formData,
										payFrequency: v
									}),
									disabled: !canEdit,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										id: "payroll-cycle",
										className: "w-full",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select cycle" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "monthly",
										children: "Monthly Cycle (End of Month)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "biweekly",
										children: "Bi-Weekly Cycle"
									})] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "payroll-currency",
									className: "text-xs font-medium",
									children: "Payroll Currency"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "payroll-currency",
									value: formData.currency,
									disabled: true,
									className: "bg-muted/30"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "structure-name",
									className: "text-xs font-medium",
									children: "Structure Profile"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "structure-name",
									value: formData.salaryStructureName,
									onChange: (e) => setFormData({
										...formData,
										salaryStructureName: e.target.value
									}),
									disabled: !canEdit
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold text-foreground",
							children: "Standard CTC Earnings & Deductions"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "divide-y divide-border/60 rounded-xl border border-border bg-card/80 overflow-hidden",
							children: formData.components.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-4 text-center text-xs text-muted-foreground",
								children: "No salary components configured."
							}) : formData.components.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between p-3 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: c.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ml-2 text-[10px] text-muted-foreground uppercase tracking-wider",
										children: c.taxExempt ? "Tax Exempt" : "Taxable"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-muted-foreground",
									children: c.percentageOfCtc ? `${c.percentageOfCtc}% of CTC` : `₹${c.fixedMonthly}/mo fixed`
								})]
							}, i))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Statutory Contributions (PF & ESI)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Mandatory Indian labor compliance rates and wage ceilings."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-5 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-muted/20 p-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-foreground",
									children: "Employees' Provident Fund (EPF)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Applicable under EPF & MP Act, 1952."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: formData.pfEnabled,
								onCheckedChange: (c) => setFormData({
									...formData,
									pfEnabled: c
								}),
								disabled: !canEdit
							})]
						}), formData.pfEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2 pt-2 border-t border-border/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[10px] text-muted-foreground",
										children: "Employee %"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: formData.pfEmployeePercent,
										onChange: (e) => setFormData({
											...formData,
											pfEmployeePercent: Number(e.target.value)
										}),
										disabled: !canEdit,
										className: "h-8 text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[10px] text-muted-foreground",
										children: "Employer %"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: formData.pfEmployerPercent,
										onChange: (e) => setFormData({
											...formData,
											pfEmployerPercent: Number(e.target.value)
										}),
										disabled: !canEdit,
										className: "h-8 text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[10px] text-muted-foreground",
										children: "Ceiling (₹)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: formData.pfWageCeiling,
										onChange: (e) => setFormData({
											...formData,
											pfWageCeiling: Number(e.target.value)
										}),
										disabled: !canEdit,
										className: "h-8 text-xs"
									})]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-muted/20 p-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-foreground",
									children: "Employee State Insurance (ESI)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Medical and disability insurance for eligible wages."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: formData.esiEnabled,
								onCheckedChange: (c) => setFormData({
									...formData,
									esiEnabled: c
								}),
								disabled: !canEdit
							})]
						}), formData.esiEnabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2 pt-2 border-t border-border/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[10px] text-muted-foreground",
										children: "Employee %"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										step: "0.05",
										value: formData.esiEmployeePercent,
										onChange: (e) => setFormData({
											...formData,
											esiEmployeePercent: Number(e.target.value)
										}),
										disabled: !canEdit,
										className: "h-8 text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[10px] text-muted-foreground",
										children: "Employer %"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										step: "0.05",
										value: formData.esiEmployerPercent,
										onChange: (e) => setFormData({
											...formData,
											esiEmployerPercent: Number(e.target.value)
										}),
										disabled: !canEdit,
										className: "h-8 text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[10px] text-muted-foreground",
										children: "Ceiling (₹)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: formData.esiWageCeiling,
										onChange: (e) => setFormData({
											...formData,
											esiWageCeiling: Number(e.target.value)
										}),
										disabled: !canEdit,
										className: "h-8 text-xs"
									})]
								})
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Professional Tax & Income Tax (TDS)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "State taxation slabs and default income tax withholding regime."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-medium",
								children: "Professional Tax State Slab"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: formData.ptState,
								onValueChange: (v) => setFormData({
									...formData,
									ptState: v
								}),
								disabled: !canEdit || !formData.ptEnabled,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "pt-state",
									className: "w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select state" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Maharashtra",
										children: "Maharashtra (Max ₹2,500/yr)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Karnataka",
										children: "Karnataka (Max ₹2,400/yr)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Tamil Nadu",
										children: "Tamil Nadu (Semi-annual slabs)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "Telangana",
										children: "Telangana (Max ₹2,500/yr)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "West Bengal",
										children: "West Bengal"
									})
								] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-medium",
								children: "Default TDS Regime"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: formData.tdsDefaultRegime,
								onValueChange: (v) => setFormData({
									...formData,
									tdsDefaultRegime: v
								}),
								disabled: !canEdit,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									id: "tds-regime",
									className: "w-full",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select regime" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "new",
									children: "New Tax Regime (Section 115BAC)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "old",
									children: "Old Tax Regime (With Exemptions)"
								})] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-foreground",
									children: "Tax Declarations"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: "Allow employee 80C/80D investment proofs."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: formData.tdsWindowOpen,
								onCheckedChange: (c) => setFormData({
									...formData,
									tdsWindowOpen: c
								}),
								disabled: !canEdit
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Payslip Generation & Security"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Standardized pay document issuance rules."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "payslip-day",
								className: "text-xs font-medium",
								children: "Monthly Generation Day"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "payslip-day",
								type: "number",
								min: 1,
								max: 31,
								value: formData.payslipGenerationDay,
								onChange: (e) => setFormData({
									...formData,
									payslipGenerationDay: Number(e.target.value)
								}),
								disabled: !canEdit
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-foreground",
									children: "Password Protected PDF"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: "Secured with employee PAN / DOB."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: formData.passwordProtectedPayslips,
								onCheckedChange: (c) => setFormData({
									...formData,
									passwordProtectedPayslips: c
								}),
								disabled: !canEdit
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-foreground",
									children: "Show Leave Balances"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground",
									children: "Include remaining CL/SL/EL summary on slips."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: formData.showLeaveBalanceOnPayslip,
								onCheckedChange: (c) => setFormData({
									...formData,
									showLeaveBalanceOnPayslip: c
								}),
								disabled: !canEdit
							})]
						})
					]
				})]
			}),
			canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-3 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: () => initialData && setFormData(initialData),
					disabled: !isDirty || submitting,
					className: "gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), "Discard Changes"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					size: "sm",
					disabled: !isDirty || submitting,
					className: "gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), submitting ? "Saving..." : "Save Payroll Settings"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnsavedChangesBanner, {
				isDirty,
				submitting,
				onReset: () => initialData && setFormData(initialData),
				onSave: () => handleSave()
			})
		]
	});
}
function DocumentsSection({ canEdit, onDirtyChange }) {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [missingNotice, setMissingNotice] = (0, import_react.useState)(null);
	const [initialData, setInitialData] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		documentTypes: [],
		expiryReminderDays: [
			30,
			15,
			7
		],
		salarySlipWatermark: true,
		salarySlipVisibleToEmployee: true,
		provisionSlipLockedRequired: true,
		provisionSlipVisibleToEmployee: false,
		templatesCount: 4
	});
	const isDirty = initialData ? JSON.stringify(initialData) !== JSON.stringify(formData) : false;
	(0, import_react.useEffect)(() => {
		onDirtyChange?.(isDirty);
	}, [isDirty, onDirtyChange]);
	const loadData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setMissingNotice(null);
		try {
			await fetchDocumentCategoriesList();
		} catch {}
		try {
			const data = await fetchDocumentSettings();
			const combined = {
				...data,
				documentTypes: data.documentTypes || []
			};
			setInitialData(combined);
			setFormData(combined);
		} catch (err) {
			if (isMissingApiError(err)) {
				setMissingNotice(err.message);
				setInitialData(formData);
			} else {
				const msg = err?.message || "Failed to load document settings.";
				toast.error(msg);
			}
		} finally {
			setLoading(false);
		}
	}, [formData]);
	(0, import_react.useEffect)(() => {
		loadData();
	}, [loadData]);
	const handleSave = async (e) => {
		if (e) e.preventDefault();
		if (!canEdit) return;
		setSubmitting(true);
		try {
			await updateDocumentSettings(formData);
			setInitialData(formData);
			toast.success("Document policies updated successfully!");
		} catch (err) {
			if (isMissingApiError(err)) {
				setMissingNotice(err.message);
				toast.error("Document policies API is not implemented on backend.");
			} else {
				const msg = err?.message || "Failed to update document settings.";
				toast.error(msg);
			}
		} finally {
			setSubmitting(false);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-56 rounded-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28 rounded-xl" }, i))
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSave,
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex items-center justify-between border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Employee Document Types & Rules"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Mandatory onboarding proofs and HR verification prerequisites."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "h-4 w-4 text-primary shrink-0" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: formData.documentTypes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl",
						children: "No document rules or required types configured."
					}) : formData.documentTypes.map((doc, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 rounded-xl border border-border bg-card/80 p-3.5 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-foreground",
										children: doc.name
									}),
									doc.mandatory && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: "text-[9px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20",
										children: "Mandatory"
									}),
									doc.hasExpiry && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[9px] px-1.5 py-0 text-amber-500 border-amber-500/30",
										children: "Tracks Expiry"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-[11px] text-muted-foreground",
								children: [
									"Allowed: ",
									doc.allowedFormats.join(", "),
									" • Max ",
									doc.maxSizeMb,
									"MB"
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-[11px] font-medium text-muted-foreground",
									children: "HR Verification"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: doc.requiresHrVerification,
									onCheckedChange: (c) => {
										const updated = [...formData.documentTypes];
										updated[idx] = {
											...updated[idx],
											requiresHrVerification: c
										};
										setFormData({
											...formData,
											documentTypes: updated
										});
									},
									disabled: !canEdit
								})]
							})
						})]
					}, doc.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex items-center justify-between border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Salary Slip Issuance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Finalized official pay slips generated after payroll settlement."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-emerald-500 shrink-0" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-medium text-foreground",
								children: "Employee Portal Visibility"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Employees can view and download their finalized salary slips."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: formData.salarySlipVisibleToEmployee,
							onCheckedChange: (c) => setFormData({
								...formData,
								salarySlipVisibleToEmployee: c
							}),
							disabled: !canEdit
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-medium text-foreground",
								children: "Digital Security Watermark"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Embed organizational security watermark and verification hash on PDF."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: formData.salarySlipWatermark,
							onCheckedChange: (c) => setFormData({
								...formData,
								salarySlipWatermark: c
							}),
							disabled: !canEdit
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex items-center justify-between border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Provision Slip Policies"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Internal estimated calculations during pre-finalization review. Strictly separated from official salary slips."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-amber-500 shrink-0" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-medium text-foreground",
								children: "Lock Before Disbursal"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Require CFO/HR approval lock before provisional slips convert to finalized salary slips."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: formData.provisionSlipLockedRequired,
							onCheckedChange: (c) => setFormData({
								...formData,
								provisionSlipLockedRequired: c
							}),
							disabled: !canEdit
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-medium text-foreground",
								children: "Staff Visibility During Review"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground",
								children: "Default: Disabled. Provision slips remain confidential to HR until approved."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: formData.provisionSlipVisibleToEmployee,
							onCheckedChange: (c) => setFormData({
								...formData,
								provisionSlipVisibleToEmployee: c
							}),
							disabled: !canEdit
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Document Expiry Reminders"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Automated notification schedule before passports, visas, or contracts expire."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-medium text-muted-foreground",
						children: "Alert intervals (days prior):"
					}), formData.expiryReminderDays.map((days) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "secondary",
						className: "text-xs font-mono",
						children: [days, " Days Before"]
					}, days))]
				})]
			}),
			canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-3 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: () => initialData && setFormData(initialData),
					disabled: !isDirty || submitting,
					className: "gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), "Discard Changes"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					size: "sm",
					disabled: !isDirty || submitting,
					className: "gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), submitting ? "Saving..." : "Save Document Settings"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnsavedChangesBanner, {
				isDirty,
				submitting,
				onReset: () => initialData && setFormData(initialData),
				onSave: () => handleSave()
			})
		]
	});
}
function AssetsSection({ canEdit, onDirtyChange }) {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [missingNotice, setMissingNotice] = (0, import_react.useState)(null);
	const [initialData, setInitialData] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		categories: [],
		requireEmployeeAcknowledgment: true,
		mandatoryClearanceOnExit: true,
		notifyWarrantyExpiryDays: 30,
		notifyAssetReturnDays: 7
	});
	const isDirty = initialData ? JSON.stringify(initialData) !== JSON.stringify(formData) : false;
	(0, import_react.useEffect)(() => {
		onDirtyChange?.(isDirty);
	}, [isDirty, onDirtyChange]);
	const loadData = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setMissingNotice(null);
		try {
			const data = await fetchAssetSettings();
			const combined = {
				...data,
				categories: data.categories || []
			};
			setInitialData(combined);
			setFormData(combined);
		} catch (err) {
			if (isMissingApiError(err)) {
				setMissingNotice(err.message);
				setInitialData(formData);
			} else {
				const msg = err?.message || "Failed to load asset settings.";
				toast.error(msg);
			}
		} finally {
			setLoading(false);
		}
	}, [formData]);
	(0, import_react.useEffect)(() => {
		loadData();
	}, [loadData]);
	const handleAddCategory = () => {
		const newCat = {
			id: `cat_${Date.now()}`,
			name: "New Equipment Category",
			description: "Company hardware inventory",
			requiresSerialNumber: true,
			requiresWarrantyTracking: false
		};
		setFormData({
			...formData,
			categories: [...formData.categories, newCat]
		});
	};
	const handleUpdateCategory = (index, key, val) => {
		const updated = [...formData.categories];
		updated[index] = {
			...updated[index],
			[key]: val
		};
		setFormData({
			...formData,
			categories: updated
		});
	};
	const handleDeleteCategory = (index) => {
		const updated = formData.categories.filter((_, i) => i !== index);
		setFormData({
			...formData,
			categories: updated
		});
	};
	const handleSave = async (e) => {
		if (e) e.preventDefault();
		if (!canEdit) return;
		setSubmitting(true);
		try {
			await updateAssetSettings(formData);
			setInitialData(formData);
			toast.success("Asset configuration saved successfully!");
		} catch (err) {
			if (isMissingApiError(err)) {
				setMissingNotice(err.message);
				toast.error("Asset configuration API is not implemented on backend.");
			} else {
				const msg = err?.message || "Failed to update asset settings.";
				toast.error(msg);
			}
		} finally {
			setSubmitting(false);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-56 rounded-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 rounded-xl" }, i))
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSave,
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Asset Categories"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Classification schema for company-owned hardware and inventory."
					})] }), canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						onClick: handleAddCategory,
						className: "gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), "Add Category"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: formData.categories.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl",
						children: "No asset categories configured. Click \"Add Category\" to create one."
					}) : formData.categories.map((cat, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 gap-3 rounded-xl border border-border bg-card/80 p-3.5 sm:grid-cols-12 sm:items-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 sm:col-span-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-[11px] font-medium text-muted-foreground",
									children: "Category Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: cat.name,
									onChange: (e) => handleUpdateCategory(idx, "name", e.target.value),
									disabled: !canEdit,
									className: "h-8 text-xs font-semibold"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1 sm:col-span-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-[11px] font-medium text-muted-foreground",
									children: "Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: cat.description || "",
									onChange: (e) => handleUpdateCategory(idx, "description", e.target.value),
									disabled: !canEdit,
									placeholder: "Category purpose",
									className: "h-8 text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2 sm:col-span-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-[10px] font-medium text-muted-foreground",
										children: "Require Serial"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: cat.requiresSerialNumber,
										onCheckedChange: (c) => handleUpdateCategory(idx, "requiresSerialNumber", c),
										disabled: !canEdit
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end sm:col-span-1",
								children: canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "ghost",
									size: "sm",
									onClick: () => handleDeleteCategory(idx),
									className: "h-7 w-7 p-0 text-muted-foreground hover:text-destructive cursor-pointer",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
								})
							})
						]
					}, cat.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Allocation & Return Governance"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Compliance policies for device custody and exit clearance."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-foreground",
									children: "Employee Custody Acknowledgment"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Require digital signature/consent when hardware is assigned."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: formData.requireEmployeeAcknowledgment,
								onCheckedChange: (c) => setFormData({
									...formData,
									requireEmployeeAcknowledgment: c
								}),
								disabled: !canEdit
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-0.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-medium text-foreground",
									children: "Mandatory Exit Handover Clearance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted-foreground",
									children: "Block final settlement until all company assets are returned."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: formData.mandatoryClearanceOnExit,
								onCheckedChange: (c) => setFormData({
									...formData,
									mandatoryClearanceOnExit: c
								}),
								disabled: !canEdit
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "warranty-alert-days",
								className: "text-xs font-medium",
								children: "Warranty Expiry Alert (Days Prior)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "warranty-alert-days",
								type: "number",
								min: 1,
								value: formData.notifyWarrantyExpiryDays,
								onChange: (e) => setFormData({
									...formData,
									notifyWarrantyExpiryDays: Number(e.target.value)
								}),
								disabled: !canEdit
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "return-reminder-days",
								className: "text-xs font-medium",
								children: "Return Reminder Notice (Days Prior to Exit)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "return-reminder-days",
								type: "number",
								min: 1,
								value: formData.notifyAssetReturnDays,
								onChange: (e) => setFormData({
									...formData,
									notifyAssetReturnDays: Number(e.target.value)
								}),
								disabled: !canEdit
							})]
						})
					]
				})]
			}),
			canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-3 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: () => initialData && setFormData(initialData),
					disabled: !isDirty || submitting,
					className: "gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), "Discard Changes"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					size: "sm",
					disabled: !isDirty || submitting,
					className: "gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), submitting ? "Saving..." : "Save Asset Settings"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnsavedChangesBanner, {
				isDirty,
				submitting,
				onReset: () => initialData && setFormData(initialData),
				onSave: () => handleSave()
			})
		]
	});
}
function NotificationsSection({ canEdit, onDirtyChange }) {
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [sendingTest, setSendingTest] = (0, import_react.useState)(false);
	const [testEmail, setTestEmail] = (0, import_react.useState)("");
	const [initialData, setInitialData] = (0, import_react.useState)(null);
	const [formData, setFormData] = (0, import_react.useState)({
		emailNotifications: true,
		inAppAlerts: true,
		slackAlerts: false,
		weeklyDigest: false,
		securityAlerts: true
	});
	const isDirty = initialData ? JSON.stringify(initialData) !== JSON.stringify(formData) : false;
	(0, import_react.useEffect)(() => {
		onDirtyChange?.(isDirty);
	}, [isDirty, onDirtyChange]);
	const loadData = async () => {
		setLoading(true);
		try {
			const data = await fetchNotificationSettings();
			setInitialData(data);
			setFormData(data);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to load notification settings.";
			toast.error(message);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	const handleSave = async (e) => {
		if (e) e.preventDefault();
		if (!canEdit) return;
		setSubmitting(true);
		try {
			await updateNotificationSettings(formData);
			setInitialData(formData);
			toast.success("Notification preferences updated successfully!");
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to update notification settings.";
			toast.error(message);
		} finally {
			setSubmitting(false);
		}
	};
	const handleSendTestEmail = async () => {
		if (!testEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(testEmail)) {
			toast.error("Please enter a valid email address for testing.");
			return;
		}
		setSendingTest(true);
		try {
			const res = await sendTestNotificationEmail(testEmail);
			toast.success(res.message || `Test email dispatched to ${testEmail}!`);
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to send test email. Verify SMTP/email configuration.";
			toast.error(message);
		} finally {
			setSendingTest(false);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-56 rounded-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
			children: Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 rounded-xl" }, i))
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSave,
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 flex items-center justify-between border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Global Email Delivery"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Master switch for organizational outgoing transactional emails."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-primary shrink-0" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between rounded-xl border border-border bg-muted/20 p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-semibold text-foreground",
							children: "Enable Email Notifications"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground",
							children: "Delivers automated transactional alerts to company employees and management."
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						checked: formData.emailNotifications,
						onCheckedChange: (checked) => setFormData({
							...formData,
							emailNotifications: checked
						}),
						disabled: !canEdit
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 border-b border-border/60 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Notification Channels & Delivery"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Configure system-wide alert destinations and cadence."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-border bg-card/80 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-blue-500/10 text-blue-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-medium text-foreground",
										children: "In-App Alerts"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Real-time notification bell alerts and unread counters in the dashboard."
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: formData.inAppAlerts,
								onCheckedChange: (c) => setFormData({
									...formData,
									inAppAlerts: c
								}),
								disabled: !canEdit
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-border bg-card/80 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-purple-500/10 text-purple-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-medium text-foreground",
										children: "Slack Alerts"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Forward key organizational events and system notices to Slack channels."
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: formData.slackAlerts,
								onCheckedChange: (c) => setFormData({
									...formData,
									slackAlerts: c
								}),
								disabled: !canEdit
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-border bg-card/80 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-emerald-500/10 text-emerald-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-medium text-foreground",
										children: "Weekly Digest"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Send a weekly activity summary and pending review digest to users."
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: formData.weeklyDigest,
								onCheckedChange: (c) => setFormData({
									...formData,
									weeklyDigest: c
								}),
								disabled: !canEdit
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-border bg-card/80 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-rose-500/10 text-rose-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-medium text-foreground",
										children: "Security Alerts"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-muted-foreground",
										children: "Immediate alerts for logins, permission escalations, and MFA changes."
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
								checked: formData.securityAlerts,
								onCheckedChange: (c) => setFormData({
									...formData,
									securityAlerts: c
								}),
								disabled: !canEdit
							})]
						})
					]
				})]
			}),
			canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 border-b border-border/60 pb-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold tracking-tight text-foreground",
						children: "Test Email Delivery"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Verify SMTP configuration by sending a test alert message."
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 sm:flex-row sm:items-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "email",
							placeholder: "test.recipient@example.com",
							value: testEmail,
							onChange: (e) => setTestEmail(e.target.value),
							className: "text-xs"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: handleSendTestEmail,
						disabled: sendingTest || !testEmail,
						className: "gap-1.5 text-xs cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), sendingTest ? "Dispatching..." : "Send Test Email"]
					})]
				})]
			}),
			canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-3 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "outline",
					size: "sm",
					onClick: () => initialData && setFormData(initialData),
					disabled: !isDirty || submitting,
					className: "gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), "Discard Changes"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					size: "sm",
					disabled: !isDirty || submitting,
					className: "gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-3.5 w-3.5" }), submitting ? "Saving..." : "Save Notification Preferences"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnsavedChangesBanner, {
				isDirty,
				submitting,
				onReset: () => initialData && setFormData(initialData),
				onSave: () => handleSave()
			})
		]
	});
}
var SETTINGS_CARDS = [
	{
		id: "company",
		label: "Company",
		description: "Manage organization identity, brand logo, legal address, contact details, and default operating currency.",
		icon: Building2,
		color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30"
	},
	{
		id: "profile",
		label: "My Profile",
		description: "View and update personal details, profile avatar, account email, phone number, and password security.",
		icon: User,
		color: "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30"
	},
	{
		id: "employees",
		label: "Employees",
		description: "Structure departments, organizational designations, employee ID generation, notice period & probation.",
		icon: Users,
		color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30"
	},
	{
		id: "attendance",
		label: "Attendance",
		description: "Work hours, shift timing rules, grace periods, late-mark penalties, and live biometric face verification.",
		icon: Clock,
		color: "from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-500/30"
	},
	{
		id: "leave",
		label: "Leave",
		description: "Annual statutory leave quotas, negative balance prevention, carry-forward rules, and approval workflows.",
		icon: CalendarDays,
		color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30"
	},
	{
		id: "payroll",
		label: "Payroll",
		description: "Indian statutory deductions (PF, ESI, Professional Tax, TDS), CTC components, and pay disbursement cadence.",
		icon: Banknote,
		color: "from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30"
	},
	{
		id: "documents",
		label: "Documents",
		description: "Salary slips vs provision slips separation, mandatory onboarding documents, compliance rules & expiry alerts.",
		icon: FileText,
		color: "from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30"
	},
	{
		id: "assets",
		label: "Assets",
		description: "Company equipment inventory, hardware allocation acknowledgment, serial logs, and return protocols.",
		icon: Package,
		color: "from-blue-600/20 to-cyan-500/20 text-blue-300 border-blue-500/30"
	},
	{
		id: "notifications",
		label: "Notifications",
		description: "HR transactional email alerts (leave, attendance, payroll, docs) with live SMTP test email dispatch.",
		icon: Bell,
		color: "from-fuchsia-500/20 to-purple-500/20 text-fuchsia-400 border-fuchsia-500/30"
	}
];
function SettingsLayout({ initialSection, onSectionChange }) {
	const userRole = resolveRbacRole(useAurix().user?.role);
	const [activeSection, setActiveSection] = (0, import_react.useState)(() => {
		if (initialSection && canAccessSection(userRole, initialSection)) return initialSection;
		return null;
	});
	const [isCurrentFormDirty, setIsCurrentFormDirty] = (0, import_react.useState)(false);
	const [pendingSectionSwitch, setPendingSectionSwitch] = (0, import_react.useState)(null);
	const [confirmSwitchOpen, setConfirmSwitchOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (initialSection) {
			if (canAccessSection(userRole, initialSection)) setActiveSection(initialSection);
		} else setActiveSection(null);
	}, [initialSection, userRole]);
	const handleSelectSection = (key) => {
		if (key === activeSection) return;
		if (isCurrentFormDirty) {
			setPendingSectionSwitch(key);
			setConfirmSwitchOpen(true);
			return;
		}
		setActiveSection(key);
		setIsCurrentFormDirty(false);
		onSectionChange?.(key);
	};
	const handleConfirmSwitch = () => {
		setActiveSection(pendingSectionSwitch);
		setIsCurrentFormDirty(false);
		onSectionChange?.(pendingSectionSwitch);
		setPendingSectionSwitch(null);
		setConfirmSwitchOpen(false);
	};
	const currentCardMeta = activeSection ? SETTINGS_CARDS.find((c) => c.id === activeSection) || SETTINGS_CARDS[0] : null;
	const isAccessible = activeSection ? canAccessSection(userRole, activeSection) : true;
	const canEdit = activeSection ? canEditSection(userRole, activeSection) : false;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [!activeSection ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: SETTINGS_CARDS.map((card) => {
					const Icon = card.icon;
					const accessible = canAccessSection(userRole, card.id);
					const editable = canEditSection(userRole, card.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => handleSelectSection(card.id),
						className: "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-xl hover:bg-accent/40 text-left cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br border ${card.color} transition-transform duration-200 group-hover:scale-105`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-6 w-6" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary",
										children: card.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center gap-1.5",
										children: !accessible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] font-normal border-destructive/30 text-destructive bg-destructive/5",
											children: "Restricted"
										}) : !editable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[10px] font-normal border-border text-muted-foreground bg-muted/40",
											children: "View Only"
										}) : null
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2",
									children: card.description
								})]
							})]
						})
					}, card.id);
				})
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-6",
			children: !isAccessible ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessDeniedView, {
				title: `${currentCardMeta?.label} Settings Restricted`,
				message: `Your role (${getRbacRoleLabel(userRole)}) does not have permission to access ${currentCardMeta?.label} settings. Only authorized administrators may modify this module.`,
				currentRole: getRbacRoleLabel(userRole)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				activeSection === "company" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanySection, {
					canEdit,
					onDirtyChange: setIsCurrentFormDirty
				}),
				activeSection === "profile" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MyProfileSection, {
					canEdit,
					onDirtyChange: setIsCurrentFormDirty
				}),
				activeSection === "employees" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeesSection, {
					canEdit,
					onDirtyChange: setIsCurrentFormDirty
				}),
				activeSection === "attendance" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttendanceSection, {
					canEdit,
					onDirtyChange: setIsCurrentFormDirty
				}),
				activeSection === "leave" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeaveSection, {
					canEdit,
					onDirtyChange: setIsCurrentFormDirty
				}),
				activeSection === "payroll" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PayrollSection, {
					canEdit,
					onDirtyChange: setIsCurrentFormDirty
				}),
				activeSection === "documents" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentsSection, {
					canEdit,
					onDirtyChange: setIsCurrentFormDirty
				}),
				activeSection === "assets" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetsSection, {
					canEdit,
					onDirtyChange: setIsCurrentFormDirty
				}),
				activeSection === "notifications" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationsSection, {
					canEdit,
					onDirtyChange: setIsCurrentFormDirty
				})
			] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: confirmSwitchOpen,
			onOpenChange: setConfirmSwitchOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-amber-500",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-base font-semibold text-foreground",
						children: "Unsaved Changes"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "text-xs text-muted-foreground pt-2",
					children: "You have unsaved changes in the current section. Leaving now will discard your modifications. Do you want to proceed?"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2 sm:gap-0 pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						size: "sm",
						onClick: () => {
							setConfirmSwitchOpen(false);
							setPendingSectionSwitch(null);
						},
						children: "Stay on Page"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "destructive",
						size: "sm",
						onClick: handleConfirmSwitch,
						children: "Discard & Switch"
					})]
				})]
			})
		})]
	});
}
//#endregion
export { SettingsLayout as t };
