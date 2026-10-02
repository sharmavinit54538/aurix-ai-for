import { t as lucide_react_exports } from "../_libs/lucide-react.mjs";
import { a as createSlice, i as createAsyncThunk } from "../_libs/@reduxjs/toolkit+[...].mjs";
import { t as aurix } from "./aurix-store-BcCbMqU4.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { i as tryApi, r as parseApiError } from "./utils-DQc9Fr86.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/departmentsSlice-BOlsHBgC.js
var STATUS_OPTIONS$1 = [{
	value: "active",
	label: "Active",
	color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
}, {
	value: "inactive",
	label: "Inactive",
	color: "text-slate-500 bg-slate-500/10 border-slate-500/20"
}];
var THEME_COLORS = [
	{
		hex: "#3b82f6",
		label: "Vibrant Blue"
	},
	{
		hex: "#10b981",
		label: "Emerald Green"
	},
	{
		hex: "#ec4899",
		label: "Rose Pink"
	},
	{
		hex: "#8b5cf6",
		label: "Amethyst Violet"
	},
	{
		hex: "#f59e0b",
		label: "Amber Gold"
	},
	{
		hex: "#06b6d4",
		label: "Teal Cyan"
	},
	{
		hex: "#f43f5e",
		label: "Crimson Red"
	},
	{
		hex: "#64748b",
		label: "Slate Gray"
	}
];
var DEPARTMENT_ICONS = [
	{
		name: "Code2",
		label: "Engineering"
	},
	{
		name: "TrendingUp",
		label: "Product"
	},
	{
		name: "Paintbrush",
		label: "Design"
	},
	{
		name: "Briefcase",
		label: "Sales"
	},
	{
		name: "Megaphone",
		label: "Marketing"
	},
	{
		name: "Users",
		label: "HR"
	},
	{
		name: "DollarSign",
		label: "Finance"
	},
	{
		name: "Settings",
		label: "Operations"
	},
	{
		name: "Scale",
		label: "Legal"
	},
	{
		name: "Globe",
		label: "Global Success"
	},
	{
		name: "ShieldCheck",
		label: "Compliance & Security"
	},
	{
		name: "Building2",
		label: "General Admin"
	}
];
var DEFAULT_FILTERS$1 = {
	status: "all",
	office: "all",
	employeeCountRange: "all",
	managerId: "all",
	createdDateFrom: "",
	createdDateTo: ""
};
var EMPLOYEE_COUNT_RANGES = [
	{
		value: "all",
		label: "Any Size"
	},
	{
		value: "0-10",
		label: "Small (0-10)"
	},
	{
		value: "11-30",
		label: "Medium (11-30)"
	},
	{
		value: "31-50",
		label: "Large (31-50)"
	},
	{
		value: "50+",
		label: "Enterprise (50+)"
	}
];
var DEPARTMENT_NESTED_KEYS = [
	"department",
	"item",
	"department_details",
	"departmentDetails",
	"result",
	"record",
	"attributes",
	"payload",
	"data"
];
function hasDepartmentFields(obj) {
	return Boolean(obj.id != null || obj.department_name || obj.name || obj.department_code || obj.code);
}
function unwrapDepartmentApiRecord(raw) {
	if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
	let obj = { ...raw };
	for (let depth = 0; depth < 4; depth += 1) {
		if (hasDepartmentFields(obj)) return obj;
		const nestedKey = DEPARTMENT_NESTED_KEYS.find((key) => {
			const value = obj[key];
			return value && typeof value === "object" && !Array.isArray(value);
		});
		if (!nestedKey) break;
		obj = {
			...obj,
			...obj[nestedKey]
		};
	}
	return obj;
}
function pickDepartmentValue(incoming, existing, emptyValues = []) {
	if (emptyValues.some((value) => Object.is(value, incoming))) return existing;
	return incoming ?? existing;
}
/** Keep list-row values when detail API returns partial/empty mapped fields. */
function mergeDepartmentRecord(existing, incoming) {
	if (!existing || existing.id !== incoming.id) return incoming.id && incoming.name?.trim() ? incoming : existing ?? incoming;
	return {
		...existing,
		...incoming,
		name: pickDepartmentValue(incoming.name, existing.name, [""]),
		description: pickDepartmentValue(incoming.description, existing.description, [""]),
		department_code: pickDepartmentValue(incoming.department_code, existing.department_code, [""]),
		cost_center: pickDepartmentValue(incoming.cost_center, existing.cost_center, [""]),
		departmentHeadId: incoming.departmentHeadId ?? existing.departmentHeadId,
		departmentHeadName: pickDepartmentValue(incoming.departmentHeadName, existing.departmentHeadName, ["", "Unassigned"]),
		reportingManagerId: incoming.reportingManagerId ?? existing.reportingManagerId,
		reportingManagerName: pickDepartmentValue(incoming.reportingManagerName, existing.reportingManagerName, ["", "None"]),
		office: pickDepartmentValue(incoming.office, existing.office, [""]),
		extensionNumber: pickDepartmentValue(incoming.extensionNumber, existing.extensionNumber, [""]),
		themeColor: pickDepartmentValue(incoming.themeColor, existing.themeColor, [""]),
		iconName: pickDepartmentValue(incoming.iconName, existing.iconName, [""]),
		parentId: incoming.parentId ?? existing.parentId,
		parentName: pickDepartmentValue(incoming.parentName, existing.parentName, ["", "None"]),
		createdDate: pickDepartmentValue(incoming.createdDate, existing.createdDate, [""]),
		budget: incoming.budget || existing.budget,
		employeeCapacity: incoming.employeeCapacity !== void 0 ? incoming.employeeCapacity : existing.employeeCapacity,
		currentEmployeeCount: incoming.currentEmployeeCount || existing.currentEmployeeCount,
		employeeIds: incoming.employeeIds.length > 0 ? incoming.employeeIds : existing.employeeIds,
		openPositions: incoming.openPositions ?? existing.openPositions,
		performanceScore: incoming.performanceScore !== void 0 ? incoming.performanceScore : existing.performanceScore,
		attendanceScore: incoming.attendanceScore !== void 0 ? incoming.attendanceScore : existing.attendanceScore,
		hiringStatus: incoming.hiringStatus ?? existing.hiringStatus,
		recentActivity: incoming.recentActivity.length > 0 ? incoming.recentActivity : existing.recentActivity,
		documents: incoming.documents.length > 0 ? incoming.documents : existing.documents
	};
}
function normalizeThemeColor(color) {
	const fallback = THEME_COLORS[0]?.hex ?? "#3b82f6";
	if (!color?.trim()) return fallback;
	const normalized = color.trim().toLowerCase();
	const withHash = normalized.startsWith("#") ? normalized : `#${normalized}`;
	return THEME_COLORS.find((tc) => tc.hex.toLowerCase() === withHash)?.hex ?? withHash;
}
function themeColorsMatch(a, b) {
	if (!a || !b) return false;
	return normalizeThemeColor(a).toLowerCase() === normalizeThemeColor(b).toLowerCase();
}
function normalizeIconName(name) {
	const fallback = DEPARTMENT_ICONS.find((icon) => icon.name === "Building2")?.name ?? "Building2";
	if (!name?.trim()) return fallback;
	const trimmed = name.trim();
	const fromPreset = DEPARTMENT_ICONS.find((icon) => icon.name.toLowerCase() === trimmed.toLowerCase());
	if (fromPreset) return fromPreset.name;
	const icons = lucide_react_exports;
	if (icons[trimmed]) return trimmed;
	const pascalCase = trimmed.split(/[_-\s]+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join("");
	if (icons[pascalCase]) return pascalCase;
	return fallback;
}
function getDepartmentIconOptions(currentIconName) {
	const normalizedCurrent = currentIconName ? normalizeIconName(currentIconName) : null;
	const options = [...DEPARTMENT_ICONS];
	if (normalizedCurrent && !options.some((option) => option.name.toLowerCase() === normalizedCurrent.toLowerCase())) options.unshift({
		name: normalizedCurrent,
		label: normalizedCurrent
	});
	return options;
}
var DEFAULT_PERMISSIONS = {
	canApproveLeave: false,
	canApproveAttendance: false,
	canManageEmployees: false,
	canViewPayroll: false,
	canEditDepartments: false,
	canInviteUsers: false,
	canManageRecruitment: false,
	canManagePerformance: false
};
var DEFAULT_MANAGER_FORM_STATE = {
	first_name: "",
	last_name: "",
	personal_email: "",
	phone: "",
	reporting_to: "",
	department: "",
	designation: "",
	joining_date: "",
	profile_photo_url: "",
	gender: "",
	date_of_birth: "",
	company_email: "",
	alternate_phone: "",
	blood_group: "",
	marital_status: "",
	branch: "",
	work_location: "",
	employment_type: "FULL_TIME",
	employment_status: "PROBATION",
	shift: "General",
	probation_period_months: 0,
	ctc: 0,
	basic_salary: 0,
	hra: 0,
	bonus: 0,
	pf: 0,
	esi: 0,
	professional_tax: 0,
	role: "manager",
	leave_group: "",
	permissions: {
		can_approve_leave: false,
		can_approve_attendance: false,
		can_manage_employees: false,
		can_view_payroll: false,
		can_edit_departments: false,
		can_invite_users: false,
		can_manage_recruitment: false,
		can_manage_performance: false
	},
	addresses: [],
	documents: [],
	education: [],
	experience: [],
	skills: [],
	emergency_contacts: []
};
var DEPARTMENTS = [
	{
		value: "Management",
		label: "Management"
	},
	{
		value: "Engineering",
		label: "Engineering",
		options: [
			"Developer",
			"Tester",
			"Designer"
		]
	},
	{
		value: "Sales&Marketing",
		label: "Sales & Marketing"
	},
	{
		value: "Core",
		label: "Core",
		options: [
			"CEO",
			"CTO",
			"Director",
			"CPO",
			"CMO"
		]
	}
];
var SHIFT_OPTIONS = [
	{
		value: "General",
		label: "General (9 AM – 6 PM)"
	},
	{
		value: "Morning",
		label: "Morning (6 AM – 3 PM)"
	},
	{
		value: "Evening",
		label: "Evening (3 PM – 12 AM)"
	},
	{
		value: "Night",
		label: "Night (12 AM – 9 AM)"
	},
	{
		value: "Flexible",
		label: "Flexible"
	}
];
/** Shift values for API payloads and legacy imports */
var SHIFTS = SHIFT_OPTIONS.map((opt) => opt.value);
var STATUS_OPTIONS = [
	{
		value: "PROBATION",
		label: "Probation"
	},
	{
		value: "CONFIRMED",
		label: "Confirmed"
	},
	{
		value: "NOTICE_PERIOD",
		label: "Notice Period"
	}
];
var EMPLOYMENT_TYPE_OPTIONS = [
	{
		value: "full_time",
		label: "Full Time"
	},
	{
		value: "part_time",
		label: "Part Time"
	},
	{
		value: "contract",
		label: "Contract"
	},
	{
		value: "intern",
		label: "Intern"
	}
];
var GENDER_OPTIONS = [
	{
		value: "male",
		label: "Male"
	},
	{
		value: "female",
		label: "Female"
	},
	{
		value: "other",
		label: "Other"
	},
	{
		value: "prefer_not_to_say",
		label: "Prefer not to say"
	}
];
var MANAGER_FORM_EMPLOYMENT_TYPE_OPTIONS = [
	{
		value: "FULL_TIME",
		label: "Full Time"
	},
	{
		value: "PART_TIME",
		label: "Part Time"
	},
	{
		value: "CONTRACT",
		label: "Contract"
	},
	{
		value: "INTERN",
		label: "Intern"
	}
];
var MANAGER_FORM_WORK_LOCATION_OPTIONS = [
	{
		value: "ON_SITE",
		label: "On Site"
	},
	{
		value: "REMOTE",
		label: "Remote"
	},
	{
		value: "HYBRID",
		label: "Hybrid"
	}
];
var DEFAULT_FILTERS = {
	department: "all",
	status: "all",
	employmentType: "all",
	office: "all",
	teamSize: "all",
	joiningFrom: "",
	joiningTo: ""
};
var DEPARTMENT_GROUPS = [
	{
		value: "Management",
		label: "Management"
	},
	{
		value: "Engineering",
		label: "Engineering",
		options: [
			"Developer",
			"Tester",
			"Designer"
		]
	},
	{
		value: "Sales&Marketing",
		label: "Sales & Marketing"
	},
	{
		value: "Core",
		label: "Core",
		options: [
			"CEO",
			"CTO",
			"Director",
			"CPO",
			"CMO"
		]
	}
];
var DEPARTMENT_VALUES = DEPARTMENT_GROUPS.flatMap((group) => [
	group.value,
	...group.subgroups?.flatMap((sub) => [sub.value, ...sub.options]) ?? [],
	...group.options ?? []
]);
function resolveDepartmentValue(value) {
	if (!value) return void 0;
	const trimmed = value.trim();
	if (!trimmed) return void 0;
	if (DEPARTMENT_VALUES.includes(trimmed)) return trimmed;
	for (const group of DEPARTMENT_GROUPS) {
		if (group.label === trimmed) return group.value;
		for (const subgroup of group.subgroups ?? []) if (subgroup.label === trimmed || subgroup.value === trimmed) return subgroup.value;
	}
	return trimmed;
}
function getExpandedGroupsForValue(value) {
	const resolved = resolveDepartmentValue(value);
	if (!resolved) return [];
	for (const group of DEPARTMENT_GROUPS) {
		if (group.value === resolved) return [];
		if (group.options?.includes(resolved)) return [group.value];
		for (const subgroup of group.subgroups ?? []) if (subgroup.value === resolved || subgroup.options.includes(resolved)) return [group.value];
	}
	return [];
}
function getDepartmentLabel(value) {
	for (const group of DEPARTMENT_GROUPS) {
		if (group.value === value) return group.label;
		for (const subgroup of group.subgroups ?? []) {
			if (subgroup.value === value) return subgroup.label;
			if (subgroup.options.includes(value)) return value;
		}
		if (group.options?.includes(value)) return value;
	}
	return value;
}
function isParentGroupValue(value) {
	const group = DEPARTMENT_GROUPS.find((item) => item.value === value);
	return Boolean(group && ((group.options?.length ?? 0) > 0 || (group.subgroups?.length ?? 0) > 0));
}
function validateEmail(email) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePhone(phone) {
	return phone.trim().length >= 7;
}
function validateManagerForm(form, existingManagers, isEdit, editingId) {
	const errors = {};
	if (!form.first_name?.trim()) errors.first_name = "First name is required";
	if (!form.last_name?.trim()) errors.last_name = "Last name is required";
	if (!form.personal_email?.trim()) errors.personal_email = "Email is required";
	else if (!validateEmail(form.personal_email)) errors.personal_email = "Invalid email address";
	if (!form.phone?.trim()) errors.phone = "Phone is required";
	else if (!validatePhone(form.phone)) errors.phone = "Invalid phone number";
	if (!form.department?.trim()) errors.department = "Department is required";
	if (!form.designation?.trim()) errors.designation = "Designation is required";
	if (!form.date_of_birth?.trim()) errors.date_of_birth = "Date of birth is required";
	if (!form.gender?.trim()) errors.gender = "Gender is required";
	if (!form.branch?.trim()) errors.branch = "Office location is required";
	if (!form.work_location?.trim()) errors.work_location = "Work location is required";
	if (!form.joining_date?.trim()) errors.joining_date = "Joining date is required";
	if (form.personal_email) {
		if (existingManagers.find((m) => m.email.toLowerCase() === form.personal_email.toLowerCase() && (!isEdit || m.id !== editingId))) errors.personal_email = "Email already registered";
	}
	return {
		valid: Object.keys(errors).length === 0,
		errors
	};
}
function resolveShiftValue(shift) {
	return SHIFT_OPTIONS.find((opt) => opt.value === shift || opt.label === shift)?.value ?? shift;
}
/** Normalizes API gender strings (e.g. `"FEMALE"`) to form option values (e.g. `"female"`). */
function resolveGenderValue(gender) {
	if (!gender?.trim()) return "";
	const normalized = gender.trim().toLowerCase().replace(/\s+/g, "_");
	return GENDER_OPTIONS.find((opt) => opt.value === normalized || opt.label.toLowerCase().replace(/\s+/g, "_") === normalized)?.value ?? normalized;
}
/** Normalizes API date strings to `YYYY-MM-DD` for HTML date inputs. */
function toDateInputValue(value) {
	if (!value?.trim()) return "";
	const trimmed = value.trim();
	if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
	const isoDate = trimmed.split("T")[0];
	if (/^\d{4}-\d{2}-\d{2}$/.test(isoDate)) return isoDate;
	const parsed = new Date(trimmed);
	if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().split("T")[0];
	return trimmed;
}
/** Reads a display/id string from API scalars or nested `{ id, name, label, value }` objects. */
function readApiScalar(value) {
	if (value == null) return "";
	if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value).trim();
	if (typeof value === "object" && !Array.isArray(value)) {
		const obj = value;
		return String(obj.name ?? obj.label ?? obj.title ?? obj.value ?? obj.code ?? obj.id ?? obj.user_id ?? obj.employee_id ?? "").trim();
	}
	return "";
}
/** Flattens common nested API envelopes (`employee`, `user`, `manager`, etc.). */
function unwrapManagerApiRecord(raw) {
	const nested = raw.employee ?? raw.user ?? raw.manager ?? raw.profile ?? raw.data;
	if (nested && typeof nested === "object" && !Array.isArray(nested)) return {
		...raw,
		...nested
	};
	return raw;
}
function resolveGenderFromApi(value) {
	return resolveGenderValue(readApiScalar(value));
}
function resolveDepartmentFromApi(raw) {
	const candidate = readApiScalar(raw.department) || readApiScalar(raw.department_name) || readApiScalar(raw.departmentName);
	return resolveDepartmentValue(candidate) ?? candidate;
}
function resolveBranchFromApi(raw) {
	return readApiScalar(raw.branch) || readApiScalar(raw.branch_name) || readApiScalar(raw.office) || readApiScalar(raw.office_location) || readApiScalar(raw.officeLocation) || "";
}
function resolveWorkLocationFormValue(raw) {
	const value = readApiScalar(raw.work_location ?? raw.workLocation);
	if (!value) return "";
	const normalized = value.toLowerCase().replace(/[\s-]+/g, "_");
	const map = {
		on_site: "ON_SITE",
		onsite: "ON_SITE",
		remote: "REMOTE",
		wfh: "REMOTE",
		work_from_home: "REMOTE",
		hybrid: "HYBRID"
	};
	if (map[normalized]) return map[normalized];
	const upper = value.toUpperCase();
	if (upper === "ON_SITE" || upper === "REMOTE" || upper === "HYBRID") return upper;
	return upper;
}
function resolveReportingToId(raw) {
	const reportingTo = raw.reporting_to ?? raw.reportingTo ?? raw.reporting_manager ?? raw.reportingManager;
	if (reportingTo && typeof reportingTo === "object") {
		const obj = reportingTo;
		return String(obj.id ?? obj.user_id ?? obj.employee_id ?? "").trim();
	}
	if (reportingTo != null && reportingTo !== "") return String(reportingTo).trim();
	if (raw.reporting_manager_id != null) return String(raw.reporting_manager_id).trim();
	return "";
}
function mapApiPermissions(raw) {
	if (!raw || typeof raw !== "object") return { ...DEFAULT_MANAGER_FORM_STATE.permissions };
	const p = raw;
	return {
		can_approve_leave: Boolean(p.can_approve_leave ?? p.canApproveLeave),
		can_approve_attendance: Boolean(p.can_approve_attendance ?? p.canApproveAttendance),
		can_manage_employees: Boolean(p.can_manage_employees ?? p.canManageEmployees),
		can_view_payroll: Boolean(p.can_view_payroll ?? p.canViewPayroll),
		can_edit_departments: Boolean(p.can_edit_departments ?? p.canEditDepartments),
		can_invite_users: Boolean(p.can_invite_users ?? p.canInviteUsers),
		can_manage_recruitment: Boolean(p.can_manage_recruitment ?? p.canManageRecruitment),
		can_manage_performance: Boolean(p.can_manage_performance ?? p.canManagePerformance)
	};
}
/** Maps a full `/managers/{id}` API response into edit form state. */
function apiManagerToFormState(raw) {
	const data = unwrapManagerApiRecord(raw);
	return {
		...DEFAULT_MANAGER_FORM_STATE,
		first_name: readApiScalar(data.first_name ?? data.firstName),
		last_name: readApiScalar(data.last_name ?? data.lastName),
		personal_email: readApiScalar(data.personal_email ?? data.personalEmail ?? data.email),
		company_email: readApiScalar(data.company_email ?? data.companyEmail),
		phone: readApiScalar(data.phone),
		alternate_phone: readApiScalar(data.alternate_phone ?? data.alternatePhone),
		reporting_to: resolveReportingToId(data),
		department: resolveDepartmentFromApi(data),
		designation: readApiScalar(data.designation),
		joining_date: toDateInputValue(readApiScalar(data.joining_date ?? data.joiningDate)),
		profile_photo_url: readApiScalar(data.profile_photo_url ?? data.profilePhotoUrl ?? data.profile_image ?? data.profileImage),
		gender: resolveGenderFromApi(data.gender),
		date_of_birth: toDateInputValue(readApiScalar(data.date_of_birth ?? data.dob ?? data.dateOfBirth)),
		blood_group: readApiScalar(data.blood_group ?? data.bloodGroup),
		marital_status: readApiScalar(data.marital_status ?? data.maritalStatus),
		branch: resolveBranchFromApi(data),
		work_location: resolveWorkLocationFormValue(data),
		employment_type: readApiScalar(data.employment_type ?? data.employmentType).toUpperCase() || "FULL_TIME",
		employment_status: readApiScalar(data.employment_status ?? data.status).toUpperCase() || "PROBATION",
		shift: resolveShiftValue(readApiScalar(data.shift) || "General"),
		probation_period_months: Number(data.probation_period_months ?? 0),
		ctc: Number(data.ctc ?? data.salary ?? 0),
		basic_salary: Number(data.basic_salary ?? 0),
		hra: Number(data.hra ?? 0),
		bonus: Number(data.bonus ?? 0),
		pf: Number(data.pf ?? 0),
		esi: Number(data.esi ?? 0),
		professional_tax: Number(data.professional_tax ?? 0),
		role: readApiScalar(data.role) || "manager",
		leave_group: readApiScalar(data.leave_group ?? data.leaveGroup),
		permissions: mapApiPermissions(data.permissions),
		addresses: Array.isArray(data.addresses) ? data.addresses : [],
		documents: Array.isArray(data.documents) ? data.documents : [],
		education: Array.isArray(data.education) ? data.education : [],
		experience: Array.isArray(data.experience) ? data.experience : [],
		skills: Array.isArray(data.skills) ? data.skills : [],
		emergency_contacts: Array.isArray(data.emergency_contacts ?? data.emergencyContacts) ? data.emergency_contacts ?? data.emergencyContacts : []
	};
}
function mapApiFieldErrors(fieldErrors) {
	return { ...fieldErrors };
}
function applyFilters(managers, query, filters) {
	const q = query.toLowerCase().trim();
	return managers.filter((m) => {
		if (q) {
			if (!(m.fullName.toLowerCase().includes(q) || m.managerId.toLowerCase().includes(q) || m.employeeId.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.phone.toLowerCase().includes(q) || m.department.toLowerCase().includes(q))) return false;
		}
		if (filters.department !== "all" && m.department !== filters.department) return false;
		if (filters.status !== "all" && m.status !== filters.status) return false;
		if (filters.employmentType !== "all" && m.employmentType !== filters.employmentType) return false;
		if (filters.office !== "all" && m.office !== filters.office) return false;
		if (filters.teamSize !== "all") {
			const ts = m.teamSize;
			if (filters.teamSize === "1-5" && !(ts >= 1 && ts <= 5)) return false;
			if (filters.teamSize === "6-10" && !(ts >= 6 && ts <= 10)) return false;
			if (filters.teamSize === "11-20" && !(ts >= 11 && ts <= 20)) return false;
			if (filters.teamSize === "20+" && ts <= 20) return false;
		}
		if (filters.joiningFrom && m.joiningDate < filters.joiningFrom) return false;
		if (filters.joiningTo && m.joiningDate > filters.joiningTo) return false;
		return true;
	});
}
function applySorting(managers, field, dir) {
	return [...managers].sort((a, b) => {
		let va;
		let vb;
		switch (field) {
			case "fullName":
				va = a.fullName;
				vb = b.fullName;
				break;
			case "department":
				va = a.department;
				vb = b.department;
				break;
			case "teamSize":
				va = a.teamSize;
				vb = b.teamSize;
				break;
			case "joiningDate":
				va = a.joiningDate;
				vb = b.joiningDate;
				break;
			case "lastActive":
				va = a.lastActive;
				vb = b.lastActive;
				break;
			case "status":
				va = a.status;
				vb = b.status;
				break;
			default:
				va = a.fullName;
				vb = b.fullName;
		}
		if (typeof va === "number" && typeof vb === "number") return dir === "asc" ? va - vb : vb - va;
		const cmp = String(va).localeCompare(String(vb));
		return dir === "asc" ? cmp : -cmp;
	});
}
function getVisiblePages(currentPage, totalPages) {
	if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
	const pages = /* @__PURE__ */ new Set([
		1,
		totalPages,
		currentPage
	]);
	if (currentPage > 1) pages.add(currentPage - 1);
	if (currentPage < totalPages) pages.add(currentPage + 1);
	return Array.from(pages).sort((a, b) => a - b);
}
function buildCSV(managers) {
	const headers = [
		"Employee ID",
		"Full Name",
		"Email",
		"Phone",
		"Department",
		"Designation",
		"Role",
		"Status",
		"Employment Type",
		"Office",
		"Work Location",
		"Team Size",
		"Joining Date",
		"Last Active"
	];
	const rows = managers.map((m) => [
		m.employeeId,
		m.fullName,
		m.email,
		m.phone,
		m.department,
		m.designation,
		m.managerRole,
		m.status,
		m.employmentType,
		m.office,
		m.workLocation,
		m.teamSize,
		m.joiningDate,
		m.lastActive
	].map((v) => `"${String(v ?? "").replace(/"/g, "\"\"")}"`).join(","));
	return [headers.join(","), ...rows].join("\n");
}
function avatarHue(name) {
	const safe = name ?? "";
	return Array.from(safe).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
}
function labelFor(value, options) {
	return options.find((o) => o.value === value)?.label ?? value;
}
function fmtDate(iso) {
	if (!iso) return "—";
	const [y, m, d] = iso.split("T")[0].split("-");
	return `${[
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	][parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
}
function fmtRelative(iso) {
	if (!iso) return "—";
	const then = new Date(iso);
	const diffMs = (/* @__PURE__ */ new Date("2026-06-25T18:00:00")).getTime() - then.getTime();
	const diffMins = Math.floor(diffMs / 6e4);
	if (diffMins < 60) return `${diffMins}m ago`;
	const diffHours = Math.floor(diffMins / 60);
	if (diffHours < 24) return `${diffHours}h ago`;
	const diffDays = Math.floor(diffHours / 24);
	if (diffDays < 30) return `${diffDays}d ago`;
	return fmtDate(iso);
}
function fromApiGender(value) {
	const resolved = resolveGenderValue(readApiScalar(value));
	if (GENDER_OPTIONS.some((opt) => opt.value === resolved)) return resolved;
	return "prefer_not_to_say";
}
function fromApiEmploymentType(value) {
	return {
		FULL_TIME: "full_time",
		PART_TIME: "part_time",
		CONTRACT: "contract",
		INTERN: "intern"
	}[String(value ?? "FULL_TIME").toUpperCase()] ?? "full_time";
}
function fromApiEmploymentStatus(value) {
	return {
		PROBATION: "PROBATION",
		CONFIRMED: "CONFIRMED",
		NOTICE_PERIOD: "NOTICE_PERIOD"
	}[String(value ?? "PROBATION").toUpperCase()] ?? "PROBATION";
}
function fromApiWorkLocation(value) {
	const normalized = readApiScalar(value).toLowerCase().replace(/[\s-]+/g, "_");
	if (normalized === "remote" || normalized === "wfh" || normalized === "work_from_home") return "remote";
	if (normalized === "hybrid") return "hybrid";
	if (normalized === "on_site" || normalized === "onsite") return "on_site";
	return "on_site";
}
function resolveReportingManager(raw) {
	const data = unwrapManagerApiRecord(raw);
	const reportingTo = data.reporting_to ?? data.reportingTo ?? data.reporting_manager ?? data.reportingManager;
	let id = null;
	let name = readApiScalar(data.reporting_manager_name ?? data.reportingManagerName);
	if (reportingTo && typeof reportingTo === "object") {
		const obj = reportingTo;
		const firstName = readApiScalar(obj.first_name ?? obj.firstName);
		const lastName = readApiScalar(obj.last_name ?? obj.lastName);
		name = readApiScalar(obj.full_name ?? obj.fullName ?? obj.name) || `${firstName} ${lastName}`.trim() || name;
		const idRaw = obj.id ?? obj.user_id ?? obj.employee_id;
		id = idRaw != null ? String(idRaw) : null;
	} else if (reportingTo != null && reportingTo !== "") id = String(reportingTo);
	else if (data.reporting_manager_id != null) id = String(data.reporting_manager_id);
	return {
		id,
		code: readApiScalar(data.reportingManagerId),
		name
	};
}
function mapPermissions(raw) {
	if (!raw || typeof raw !== "object") return DEFAULT_PERMISSIONS;
	const p = raw;
	return {
		canApproveLeave: Boolean(p.can_approve_leave ?? p.canApproveLeave),
		canApproveAttendance: Boolean(p.can_approve_attendance ?? p.canApproveAttendance),
		canManageEmployees: Boolean(p.can_manage_employees ?? p.canManageEmployees),
		canViewPayroll: Boolean(p.can_view_payroll ?? p.canViewPayroll),
		canEditDepartments: Boolean(p.can_edit_departments ?? p.canEditDepartments),
		canInviteUsers: Boolean(p.can_invite_users ?? p.canInviteUsers),
		canManageRecruitment: Boolean(p.can_manage_recruitment ?? p.canManageRecruitment),
		canManagePerformance: Boolean(p.can_manage_performance ?? p.canManagePerformance)
	};
}
function mapManager(raw) {
	const data = unwrapManagerApiRecord(raw);
	const firstName = readApiScalar(data.first_name ?? data.firstName);
	const lastName = readApiScalar(data.last_name ?? data.lastName);
	const fullName = readApiScalar(data.full_name ?? data.fullName ?? data.name) || `${firstName} ${lastName}`.trim() || "Unknown Manager";
	const reportingManager = resolveReportingManager(data);
	const permissions = mapPermissions(data.permissions);
	const attendance = data.attendance_summary ?? data.attendanceSummary;
	const leaveBalance = data.leave_balance ?? data.leaveBalance;
	const recentActivity = data.recent_activity ?? data.recentActivity;
	return {
		id: readApiScalar(data.id),
		managerId: readApiScalar(data.manager_id ?? data.managerId),
		employeeId: readApiScalar(data.employee_id ?? data.employeeId) || readApiScalar(data.manager_id ?? data.managerId) || readApiScalar(data.id),
		firstName: firstName || fullName.split(" ")[0] || "Manager",
		lastName: lastName || fullName.split(" ").slice(1).join(" "),
		fullName,
		email: readApiScalar(data.personal_email ?? data.company_email ?? data.email),
		phone: readApiScalar(data.phone),
		dob: readApiScalar(data.dob ?? data.date_of_birth),
		gender: fromApiGender(data.gender),
		profileImage: readApiScalar(data.profile_photo_url ?? data.profile_image ?? data.profileImage) || void 0,
		department: readApiScalar(data.department ?? data.department_name ?? data.departmentName),
		designation: readApiScalar(data.designation),
		managerRole: readApiScalar(data.manager_role ?? data.managerRole) || "team_lead",
		reportingManagerId: reportingManager.id,
		reportingManagerCode: reportingManager.code,
		reportingManagerName: reportingManager.name,
		office: readApiScalar(data.branch ?? data.office ?? data.office_location),
		workLocation: fromApiWorkLocation(data.work_location ?? data.workLocation),
		joiningDate: readApiScalar(data.joining_date ?? data.joiningDate),
		employmentType: fromApiEmploymentType(data.employment_type ?? data.employmentType),
		shift: readApiScalar(data.shift) || "General",
		salary: data.ctc != null ? Number(data.ctc) : data.salary != null ? Number(data.salary) : void 0,
		status: fromApiEmploymentStatus(data.employment_status ?? data.status),
		teamSize: Number(data.team_size ?? data.teamSize ?? 0),
		teamIds: Array.isArray(data.team_ids) ? data.team_ids.map(String) : Array.isArray(data.teamIds) ? data.teamIds.map(String) : [],
		permissions,
		lastActive: readApiScalar(data.last_active ?? data.lastActive) || (/* @__PURE__ */ new Date()).toISOString(),
		attendanceSummary: {
			present: Number(attendance?.present ?? 0),
			absent: Number(attendance?.absent ?? 0),
			late: Number(attendance?.late ?? 0),
			leave: Number(attendance?.leave ?? 0)
		},
		leaveBalance: {
			annual: Number(leaveBalance?.annual ?? 0),
			sick: Number(leaveBalance?.sick ?? 0),
			casual: Number(leaveBalance?.casual ?? 0)
		},
		bloodGroup: readApiScalar(data.blood_group ?? data.bloodGroup),
		maritalStatus: readApiScalar(data.marital_status ?? data.maritalStatus),
		performanceScore: Number(data.performance_score ?? data.performanceScore ?? 0),
		recentActivity: Array.isArray(recentActivity) ? recentActivity : []
	};
}
var fetchManagerById = createAsyncThunk("managers/fetchManagerById", async (id, thunkAPI) => {
	try {
		const response = await apiInstance.get(`/managers/${id}`);
		const raw = unwrapManagerApiRecord(response.data?.data ?? response.data);
		return {
			manager: mapManager(raw),
			formState: apiManagerToFormState(raw)
		};
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to load manager details").message);
	}
});
var fetchManagers = createAsyncThunk("managers/fetchManagers", async (params, thunkAPI) => {
	try {
		const page = params?.page ?? 1;
		const limit = params?.limit ?? 20;
		const searchParams = new URLSearchParams();
		searchParams.set("page", String(page));
		searchParams.set("limit", String(limit));
		if (params?.search?.trim()) searchParams.set("search", params.search.trim());
		const response = await apiInstance.get(`/managers?${searchParams.toString()}`);
		const payload = response.data?.data ?? response.data ?? {};
		const items = payload.items ?? payload.managers ?? payload.results ?? (Array.isArray(payload) ? payload : []);
		const mapped = Array.isArray(items) ? items.map((item) => mapManager(item)) : [];
		const total = Number(payload.total ?? payload.total_count ?? payload.count ?? mapped.length);
		const resolvedLimit = Number(payload.limit ?? limit);
		return {
			items: mapped,
			total,
			page: Number(payload.page ?? page),
			limit: resolvedLimit,
			totalPages: Math.max(1, Number(payload.total_pages ?? payload.totalPages ?? payload.pages ?? Math.ceil(total / Math.max(resolvedLimit, 1))))
		};
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to load managers").message);
	}
});
var createManager = createAsyncThunk("managers/createManager", async (payload, thunkAPI) => {
	try {
		const response = await apiInstance.post("/managers", payload);
		return mapManager(response.data?.data ?? response.data);
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to create manager"));
	}
});
var updateManager = createAsyncThunk("managers/updateManager", async ({ id, payload }, thunkAPI) => {
	try {
		const response = await apiInstance.put(`/managers/${id}`, payload);
		return mapManager(response.data?.data ?? response.data);
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to update manager"));
	}
});
var deleteManager = createAsyncThunk("managers/deleteManager", async (id, thunkAPI) => {
	try {
		await apiInstance.delete(`/managers/${id}`);
		return id;
	} catch (error) {
		return thunkAPI.rejectWithValue(parseApiError(error, "Failed to delete manager"));
	}
});
var importManagers = createAsyncThunk("managers/importManagers", async (managers) => {
	await tryApi(() => apiInstance.post("/managers/import", { managers }), void 0);
	return managers;
});
var managersSlice = createSlice({
	name: "managers",
	initialState: {
		managers: [],
		loading: true,
		submitting: false,
		error: null,
		total: 0,
		page: 1,
		limit: 20,
		totalPages: 1,
		managerForm: DEFAULT_MANAGER_FORM_STATE,
		selectedManager: null,
		selectedManagerForm: null,
		selectedManagerLoading: false,
		selectedManagerError: null
	},
	reducers: {
		clearManagers(state) {
			state.managers = [];
			state.error = null;
		},
		setManagerForm(state, action) {
			state.managerForm = {
				...state.managerForm,
				...action.payload
			};
		},
		resetManagerForm(state) {
			state.managerForm = { ...DEFAULT_MANAGER_FORM_STATE };
		},
		initManagerForm(state, action) {
			state.managerForm = action.payload;
		},
		clearSelectedManager(state) {
			state.selectedManager = null;
			state.selectedManagerForm = null;
			state.selectedManagerLoading = false;
			state.selectedManagerError = null;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchManagers.pending, (state, action) => {
			if (!action.meta.arg?.silent) {
				state.loading = true;
				state.error = null;
			}
		}).addCase(fetchManagers.fulfilled, (state, action) => {
			state.loading = false;
			state.managers = action.payload.items;
			state.total = action.payload.total;
			state.page = action.payload.page;
			state.limit = action.payload.limit;
			state.totalPages = action.payload.totalPages;
		}).addCase(fetchManagers.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload ?? "Failed to load managers";
		}).addCase(createManager.pending, (state) => {
			state.submitting = true;
		}).addCase(createManager.fulfilled, (state) => {
			state.submitting = false;
		}).addCase(createManager.rejected, (state) => {
			state.submitting = false;
		}).addCase(updateManager.pending, (state) => {
			state.submitting = true;
		}).addCase(updateManager.fulfilled, (state, action) => {
			state.submitting = false;
			state.managers = state.managers.map((m) => m.id === action.payload.id ? action.payload : m);
		}).addCase(updateManager.rejected, (state) => {
			state.submitting = false;
		}).addCase(deleteManager.pending, (state) => {
			state.submitting = true;
		}).addCase(deleteManager.fulfilled, (state, action) => {
			state.submitting = false;
			state.managers = state.managers.filter((m) => m.id !== action.payload);
		}).addCase(deleteManager.rejected, (state) => {
			state.submitting = false;
		}).addCase(importManagers.pending, (state) => {
			state.submitting = true;
		}).addCase(importManagers.fulfilled, (state, action) => {
			state.submitting = false;
			state.managers = [...action.payload, ...state.managers];
		}).addCase(importManagers.rejected, (state) => {
			state.submitting = false;
		}).addCase(fetchManagerById.pending, (state) => {
			state.selectedManagerLoading = true;
			state.selectedManagerError = null;
			state.selectedManager = null;
			state.selectedManagerForm = null;
		}).addCase(fetchManagerById.fulfilled, (state, action) => {
			state.selectedManagerLoading = false;
			state.selectedManager = action.payload.manager;
			state.selectedManagerForm = action.payload.formState;
		}).addCase(fetchManagerById.rejected, (state, action) => {
			state.selectedManagerLoading = false;
			state.selectedManagerError = action.payload ?? "Failed to load manager details";
		});
	}
});
var { clearManagers, setManagerForm, resetManagerForm, initManagerForm, clearSelectedManager } = managersSlice.actions;
var managersSlice_default = managersSlice.reducer;
function readScalar(value) {
	if (value == null) return "";
	if (typeof value === "string") return value;
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	return "";
}
function getErrorMessage(error, fallback) {
	const err = error;
	return err.response?.data?.message || err.message || fallback;
}
function mapBackendToFrontend(d) {
	const data = unwrapDepartmentApiRecord(d);
	const manager = data.manager_details ?? data.manager ?? data.department_head;
	let departmentHeadId = data.manager_id != null ? String(data.manager_id) : data.departmentHeadId != null ? String(data.departmentHeadId) : null;
	let departmentHeadName = readScalar(data.manager_name ?? data.departmentHeadName) || readScalar(manager?.name) || readScalar(manager?.full_name) || "Unassigned";
	if (manager && typeof manager === "object") {
		const mgr = manager;
		if (mgr.id != null) departmentHeadId = String(mgr.id);
		const mgrName = readScalar(mgr.full_name ?? mgr.fullName ?? mgr.name);
		if (mgrName) departmentHeadName = mgrName;
	}
	const rawPositions = data.open_positions ?? data.openPositions ?? data.open_positions_count;
	const openPositions = rawPositions != null && rawPositions !== "" && !isNaN(Number(rawPositions)) ? Number(rawPositions) : 0;
	const rawHiring = String(data.hiring_status ?? data.hiringStatus ?? "").toLowerCase();
	const hiringStatus = [
		"open",
		"paused",
		"closed"
	].includes(rawHiring) ? rawHiring : openPositions > 0 ? "open" : "closed";
	const rawStatus = String(data.status ?? "active").trim().toLowerCase();
	const rawPerformance = data.performance_score ?? data.performanceScore;
	const performanceScore = rawPerformance != null && rawPerformance !== "" && !isNaN(Number(rawPerformance)) ? Number(rawPerformance) : null;
	const rawAttendance = data.attendance_score ?? data.attendanceScore;
	const attendanceScore = rawAttendance != null && rawAttendance !== "" && !isNaN(Number(rawAttendance)) ? Number(rawAttendance) : null;
	const rawCapacity = data.employee_capacity ?? data.employeeCapacity;
	const employeeCapacity = rawCapacity != null && rawCapacity !== "" && !isNaN(Number(rawCapacity)) ? Number(rawCapacity) : null;
	const rawEmpCount = data.employee_count ?? data.currentEmployeeCount;
	const currentEmployeeCount = rawEmpCount != null && rawEmpCount !== "" && !isNaN(Number(rawEmpCount)) ? Number(rawEmpCount) : 0;
	const rawEmpIds = data.employee_ids ?? data.employeeIds;
	const employeeIds = Array.isArray(rawEmpIds) ? rawEmpIds.map(String) : [];
	return {
		id: String(data.id ?? ""),
		name: readScalar(data.department_name ?? data.dept_name ?? data.title ?? data.name),
		description: readScalar(data.description),
		department_code: readScalar(data.department_code ?? data.code),
		cost_center: readScalar(data.cost_center ?? data.costCenter),
		departmentHeadId,
		departmentHeadName,
		reportingManagerId: data.reporting_manager_id != null ? String(data.reporting_manager_id) : data.reportingManagerId != null ? String(data.reportingManagerId) : null,
		reportingManagerName: readScalar(data.reporting_manager_name ?? data.reportingManagerName) || "None",
		office: readScalar(data.location ?? data.office),
		budget: Number(data.budget ?? 0),
		employeeCapacity,
		currentEmployeeCount,
		extensionNumber: readScalar(data.extension_number ?? data.extensionNumber),
		status: rawStatus === "inactive" ? "inactive" : "active",
		themeColor: normalizeThemeColor(readScalar(data.theme_color ?? data.themeColor) || void 0),
		iconName: normalizeIconName(readScalar(data.icon_name ?? data.iconName) || void 0),
		parentId: data.parent_department_id != null ? String(data.parent_department_id) : data.parentId != null ? String(data.parentId) : null,
		parentName: readScalar(data.parent_department_name ?? data.parentName) || "None",
		createdDate: data.created_at ? String(data.created_at).split("T")[0] : readScalar(data.createdDate),
		employeeIds,
		openPositions,
		performanceScore,
		attendanceScore,
		hiringStatus,
		recentActivity: Array.isArray(data.recent_activity ?? data.recentActivity) ? data.recent_activity ?? data.recentActivity : [],
		documents: Array.isArray(data.documents) ? data.documents : []
	};
}
function mapFrontendToBackend(department) {
	const payload = {};
	if (department.name != null) payload.department_name = department.name;
	if (department.description != null) payload.description = department.description;
	if (department.department_code != null) payload.department_code = department.department_code;
	if (department.cost_center != null) payload.cost_center = department.cost_center;
	if (department.departmentHeadId != null) payload.manager_id = department.departmentHeadId;
	if (department.reportingManagerId != null) payload.reporting_manager_id = department.reportingManagerId;
	if (department.office != null) payload.location = department.office;
	if (department.budget != null) payload.budget = department.budget;
	if (department.employeeCapacity != null) payload.employee_capacity = department.employeeCapacity;
	if (department.extensionNumber != null) payload.extension_number = department.extensionNumber;
	if (department.status != null) payload.status = department.status.toUpperCase();
	if (department.themeColor != null) payload.theme_color = department.themeColor;
	if (department.iconName != null) payload.icon_name = department.iconName;
	if (department.parentId != null) payload.parent_department_id = department.parentId;
	return payload;
}
var fetchDepartments = createAsyncThunk("departments/fetchDepartments", async (params, { rejectWithValue }) => {
	try {
		const queryParams = {};
		if (params) {
			if (params.search) queryParams.search = params.search;
			if (params.status && params.status !== "all") queryParams.status = params.status.toUpperCase();
			if (params.page) queryParams.page = params.page;
			if (params.limit) queryParams.limit = params.limit;
		}
		const data = (await apiInstance.get("/departments", { params: queryParams })).data?.data;
		if (!data) throw new Error("No data received from backend");
		let mappedItems = (Array.isArray(data.items) ? data.items : []).map((item) => mapBackendToFrontend(item));
		const total = Number(data.total ?? mappedItems.length);
		const page = Number(data.page ?? 1);
		const limit = Number(data.limit ?? 20);
		const pages = Number(data.pages ?? (limit > 0 ? Math.ceil(total / limit) : 1));
		if (total > mappedItems.length && pages > 1 && (!params || params.limit && params.limit >= 500)) {
			const pagePromises = [];
			for (let p = 2; p <= pages; p++) pagePromises.push(apiInstance.get("/departments", { params: {
				...queryParams,
				page: p,
				limit
			} }));
			const extraResponses = await Promise.all(pagePromises);
			for (const resp of extraResponses) {
				const extraItems = resp.data?.data?.items;
				if (Array.isArray(extraItems)) mappedItems = mappedItems.concat(extraItems.map((item) => mapBackendToFrontend(item)));
			}
		}
		return {
			items: mappedItems,
			total,
			page,
			limit,
			pages
		};
	} catch (error) {
		return rejectWithValue(getErrorMessage(error, "Failed to load departments"));
	}
});
var fetchDepartmentsSummary = createAsyncThunk("departments/fetchDepartmentsSummary", async (_, { rejectWithValue }) => {
	try {
		const response = await apiInstance.get("/departments/summary");
		const data = response.data?.data ?? response.data;
		if (!data || typeof data !== "object") throw new Error("No summary data received from backend");
		return {
			totalDepartments: Number(data.total_departments ?? data.totalDepartments ?? 0),
			activeDepartments: Number(data.active_departments ?? data.activeDepartments ?? 0),
			inactiveDepartments: Number(data.inactive_departments ?? data.inactiveDepartments ?? 0),
			totalEmployees: Number(data.total_employees ?? data.totalEmployees ?? 0),
			totalManagers: Number(data.total_managers ?? data.totalManagers ?? data.assigned_managers ?? data.assignedManagers ?? 0),
			avgTeamSize: Number(data.avg_team_size ?? data.avgTeamSize ?? 0),
			openPositions: Number(data.open_positions ?? data.openPositions ?? 0),
			hiringDepartments: Number(data.hiring_departments ?? data.hiringDepartments ?? 0)
		};
	} catch (error) {
		return rejectWithValue(getErrorMessage(error, "Failed to load departments summary"));
	}
});
var fetchDepartmentById = createAsyncThunk("departments/fetchDepartmentById", async (id, { rejectWithValue }) => {
	try {
		const response = await apiInstance.get(`/departments/${id}`);
		return mapBackendToFrontend(unwrapDepartmentApiRecord(response.data?.data ?? response.data));
	} catch (error) {
		return rejectWithValue(getErrorMessage(error, "Failed to load department details"));
	}
});
var createDepartment = createAsyncThunk("departments/createDepartment", async (department, { rejectWithValue }) => {
	try {
		const payload = mapFrontendToBackend(department);
		const data = (await apiInstance.post("/departments", payload)).data?.data;
		const mapped = mapBackendToFrontend(data);
		return {
			...mapped,
			themeColor: normalizeThemeColor(department.themeColor ?? mapped.themeColor),
			iconName: normalizeIconName(department.iconName ?? mapped.iconName)
		};
	} catch (error) {
		return rejectWithValue(getErrorMessage(error, "Failed to create department"));
	}
});
var updateDepartment = createAsyncThunk("departments/updateDepartment", async (department, { rejectWithValue }) => {
	try {
		const payload = mapFrontendToBackend(department);
		const data = (await apiInstance.put(`/departments/${department.id}`, payload)).data?.data;
		const mapped = mapBackendToFrontend(data);
		return {
			...mapped,
			themeColor: normalizeThemeColor(department.themeColor ?? mapped.themeColor),
			iconName: normalizeIconName(department.iconName ?? mapped.iconName)
		};
	} catch (error) {
		return rejectWithValue(getErrorMessage(error, "Failed to update department"));
	}
});
var deleteDepartment = createAsyncThunk("departments/deleteDepartment", async (id) => {
	await tryApi(() => apiInstance.delete(`/departments/${id}`), void 0);
	return id;
});
var bulkDeleteDepartments = createAsyncThunk("departments/bulkDeleteDepartments", async (ids) => {
	await tryApi(() => apiInstance.post("/departments/bulk-delete", { ids }), void 0);
	return ids;
});
var bulkSetDepartmentStatus = createAsyncThunk("departments/bulkSetDepartmentStatus", async ({ ids, status }) => {
	await tryApi(() => apiInstance.patch("/departments/bulk-status", {
		ids,
		status
	}), void 0);
	return {
		ids,
		status
	};
});
var bulkAssignDepartmentManager = createAsyncThunk("departments/bulkAssignDepartmentManager", async (payload) => {
	await tryApi(() => apiInstance.patch("/departments/bulk-assign-manager", payload), void 0);
	return payload;
});
var importDepartments = createAsyncThunk("departments/importDepartments", async (departments) => {
	await tryApi(() => apiInstance.post("/departments/import", { departments }), void 0);
	return departments;
});
var addEmployeeToDepartment = createAsyncThunk("departments/addEmployeeToDepartment", async ({ deptId, employeeId }, { getState }) => {
	const workspace = aurix.get();
	const dept = getState().departments.departments.find((d) => d.id === deptId);
	if (workspace.employees.find((e) => e.id === employeeId) && dept) {
		const updatedEmployees = workspace.employees.map((e) => e.id === employeeId ? {
			...e,
			department: dept.name,
			managerName: dept.departmentHeadName
		} : e);
		aurix.set({ employees: updatedEmployees });
	}
	await tryApi(() => apiInstance.post(`/departments/${deptId}/employees`, { employeeId }), void 0);
	return {
		deptId,
		employeeId
	};
});
var removeEmployeeFromDepartment = createAsyncThunk("departments/removeEmployeeFromDepartment", async ({ deptId, employeeId }) => {
	const workspace = aurix.get();
	if (workspace.employees.find((e) => e.id === employeeId)) {
		const updatedEmployees = workspace.employees.map((e) => e.id === employeeId ? {
			...e,
			department: "",
			managerName: ""
		} : e);
		aurix.set({ employees: updatedEmployees });
	}
	await tryApi(() => apiInstance.delete(`/departments/${deptId}/employees/${employeeId}`), void 0);
	return {
		deptId,
		employeeId
	};
});
var transferDepartmentEmployees = createAsyncThunk("departments/transferDepartmentEmployees", async ({ fromDeptId, toDeptId }, { getState }) => {
	const state = getState();
	const fromDept = state.departments.departments.find((d) => d.id === fromDeptId);
	const toDept = state.departments.departments.find((d) => d.id === toDeptId);
	if (fromDept && toDept) {
		const idsToTransfer = fromDept.employeeIds;
		const updatedEmployees = aurix.get().employees.map((e) => idsToTransfer.includes(e.id) ? {
			...e,
			department: toDept.name,
			managerName: toDept.departmentHeadName
		} : e);
		aurix.set({ employees: updatedEmployees });
	}
	await tryApi(() => apiInstance.post("/departments/transfer-employees", {
		fromDeptId,
		toDeptId
	}), void 0);
	return {
		fromDeptId,
		toDeptId
	};
});
var promoteDepartmentEmployee = createAsyncThunk("departments/promoteDepartmentEmployee", async ({ employeeId, newDesignation }) => {
	const workspace = aurix.get();
	if (workspace.employees.find((e) => e.id === employeeId)) {
		const updatedEmployees = workspace.employees.map((e) => e.id === employeeId ? {
			...e,
			designation: newDesignation
		} : e);
		aurix.set({ employees: updatedEmployees });
	}
	await tryApi(() => apiInstance.patch(`/employees/${employeeId}/promote`, { designation: newDesignation }), void 0);
	return {
		employeeId,
		newDesignation
	};
});
var initialState = {
	departments: [],
	loading: false,
	error: null,
	total: 0,
	page: 1,
	limit: 20,
	pages: 1,
	summary: null,
	summaryLoading: false,
	summaryError: null,
	selectedDepartment: null,
	selectedDepartmentLoading: false,
	selectedDepartmentError: null
};
function updateEmployeeIds(departments, deptId, updater) {
	return departments.map((d) => {
		if (d.id !== deptId) return d;
		const employeeIds = updater(d.employeeIds);
		return {
			...d,
			employeeIds,
			currentEmployeeCount: employeeIds.length
		};
	});
}
var departmentsSlice = createSlice({
	name: "departments",
	initialState,
	reducers: {
		clearDepartments(state) {
			state.departments = [];
			state.error = null;
		},
		clearSelectedDepartment(state) {
			state.selectedDepartment = null;
			state.selectedDepartmentLoading = false;
			state.selectedDepartmentError = null;
		},
		setSelectedDepartment(state, action) {
			state.selectedDepartment = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder.addCase(fetchDepartments.pending, (state) => {
			state.loading = true;
			state.error = null;
		}).addCase(fetchDepartments.fulfilled, (state, action) => {
			state.loading = false;
			state.departments = action.payload.items;
			state.total = action.payload.total;
			state.page = action.payload.page;
			state.limit = action.payload.limit;
			state.pages = action.payload.pages;
		}).addCase(fetchDepartments.rejected, (state, action) => {
			state.loading = false;
			state.error = action.payload ?? "Failed to load departments";
		}).addCase(fetchDepartmentsSummary.pending, (state) => {
			state.summaryLoading = true;
			state.summaryError = null;
		}).addCase(fetchDepartmentsSummary.fulfilled, (state, action) => {
			state.summaryLoading = false;
			state.summary = action.payload;
		}).addCase(fetchDepartmentsSummary.rejected, (state, action) => {
			state.summaryLoading = false;
			state.summaryError = action.payload ?? "Failed to load departments summary";
		}).addCase(fetchDepartmentById.pending, (state) => {
			state.selectedDepartmentLoading = true;
			state.selectedDepartmentError = null;
		}).addCase(fetchDepartmentById.fulfilled, (state, action) => {
			state.selectedDepartmentLoading = false;
			state.selectedDepartment = mergeDepartmentRecord(state.selectedDepartment, action.payload);
		}).addCase(fetchDepartmentById.rejected, (state, action) => {
			state.selectedDepartmentLoading = false;
			state.selectedDepartmentError = action.payload ?? "Failed to load department details";
		}).addCase(createDepartment.fulfilled, (state, action) => {
			state.departments = [action.payload, ...state.departments];
		}).addCase(updateDepartment.fulfilled, (state, action) => {
			state.departments = state.departments.map((d) => d.id === action.payload.id ? action.payload : d);
			if (state.selectedDepartment?.id === action.payload.id) state.selectedDepartment = action.payload;
		}).addCase(deleteDepartment.fulfilled, (state, action) => {
			state.departments = state.departments.filter((d) => d.id !== action.payload);
		}).addCase(bulkDeleteDepartments.fulfilled, (state, action) => {
			state.departments = state.departments.filter((d) => !action.payload.includes(d.id));
		}).addCase(bulkSetDepartmentStatus.fulfilled, (state, action) => {
			const { ids, status } = action.payload;
			state.departments = state.departments.map((d) => ids.includes(d.id) ? {
				...d,
				status
			} : d);
		}).addCase(bulkAssignDepartmentManager.fulfilled, (state, action) => {
			const { ids, managerId, managerName } = action.payload;
			state.departments = state.departments.map((d) => ids.includes(d.id) ? {
				...d,
				departmentHeadId: managerId,
				departmentHeadName: managerName
			} : d);
		}).addCase(importDepartments.fulfilled, (state, action) => {
			state.departments = [...action.payload, ...state.departments];
		}).addCase(addEmployeeToDepartment.fulfilled, (state, action) => {
			const { deptId, employeeId } = action.payload;
			state.departments = state.departments.map((d) => {
				if (d.id === deptId) {
					const ids = d.employeeIds.includes(employeeId) ? d.employeeIds : [...d.employeeIds, employeeId];
					return {
						...d,
						employeeIds: ids,
						currentEmployeeCount: ids.length
					};
				}
				if (d.id !== deptId && d.employeeIds.includes(employeeId)) {
					const ids = d.employeeIds.filter((id) => id !== employeeId);
					return {
						...d,
						employeeIds: ids,
						currentEmployeeCount: ids.length
					};
				}
				return d;
			});
		}).addCase(removeEmployeeFromDepartment.fulfilled, (state, action) => {
			const { deptId, employeeId } = action.payload;
			state.departments = updateEmployeeIds(state.departments, deptId, (ids) => ids.filter((id) => id !== employeeId));
		}).addCase(transferDepartmentEmployees.fulfilled, (state, action) => {
			const { fromDeptId, toDeptId } = action.payload;
			const fromDept = state.departments.find((d) => d.id === fromDeptId);
			if (!fromDept) return;
			const idsToTransfer = fromDept.employeeIds;
			state.departments = state.departments.map((d) => {
				if (d.id === fromDeptId) return {
					...d,
					employeeIds: [],
					currentEmployeeCount: 0
				};
				if (d.id === toDeptId) {
					const newIds = [.../* @__PURE__ */ new Set([...d.employeeIds, ...idsToTransfer])];
					return {
						...d,
						employeeIds: newIds,
						currentEmployeeCount: newIds.length
					};
				}
				return d;
			});
		});
	}
});
var { clearDepartments, clearSelectedDepartment, setSelectedDepartment } = departmentsSlice.actions;
var departmentsSlice_default = departmentsSlice.reducer;
//#endregion
export { promoteDepartmentEmployee as $, deleteDepartment as A, getDepartmentIconOptions as B, bulkAssignDepartmentManager as C, clearSelectedManager as D, clearSelectedDepartment as E, fetchDepartmentsSummary as F, importManagers as G, getExpandedGroupsForValue as H, fetchManagerById as I, labelFor as J, initManagerForm as K, fetchManagers as L, departmentsSlice_default as M, fetchDepartmentById as N, createDepartment as O, fetchDepartments as P, normalizeThemeColor as Q, fmtDate as R, buildCSV as S, bulkSetDepartmentStatus as T, getVisiblePages as U, getDepartmentLabel as V, importDepartments as W, mapApiFieldErrors as X, managersSlice_default as Y, normalizeIconName as Z, THEME_COLORS as _, DEPARTMENT_GROUPS as a, themeColorsMatch as at, applySorting as b, EMPLOYEE_COUNT_RANGES as c, updateManager as ct, MANAGER_FORM_EMPLOYMENT_TYPE_OPTIONS as d, validatePhone as dt, removeEmployeeFromDepartment as et, MANAGER_FORM_WORK_LOCATION_OPTIONS as f, STATUS_OPTIONS$1 as g, STATUS_OPTIONS as h, DEPARTMENTS as i, setSelectedDepartment as it, deleteManager as j, createManager as k, EMPLOYMENT_TYPE_OPTIONS as l, validateEmail as lt, SHIFT_OPTIONS as m, DEFAULT_FILTERS$1 as n, resolveDepartmentValue as nt, DEPARTMENT_ICONS as o, transferDepartmentEmployees as ot, SHIFTS as p, isParentGroupValue as q, DEFAULT_PERMISSIONS as r, setManagerForm as rt, DEPARTMENT_VALUES as s, updateDepartment as st, DEFAULT_FILTERS as t, resetManagerForm as tt, GENDER_OPTIONS as u, validateManagerForm as ut, addEmployeeToDepartment as v, bulkDeleteDepartments as w, avatarHue as x, applyFilters as y, fmtRelative as z };
