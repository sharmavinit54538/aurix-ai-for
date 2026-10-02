import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Br as Calendar, Cr as CircleCheckBig, Er as ChevronUp, Jn as Eye, Ln as FileText, Mn as Folder, Rn as FileSpreadsheet, S as Upload, T as TriangleAlert, Tr as CircleAlert, a as X, er as Download, h as User, k as Trash2, kr as ChevronDown, lt as RefreshCw, pr as Clock, u as WandSparkles, un as Info, vr as CircleX } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { t as getErrorMessage } from "./utils-DQc9Fr86.mjs";
import { n as canDo } from "./permissions-q3ueyeAm.mjs";
import { a as useQueryClient, n as useMutation, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as ScrollArea } from "./scroll-area-BlnbM3_c.mjs";
import { t as statusBadgeClass } from "./status-styles-B1M3Yvd8.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, r as SheetDescription, t as Sheet } from "./sheet-3YlcNW_l.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CkAivaVl.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJOO1b-0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DocumentsPage-DqQus_dC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function useCurrentEmployeeProfile() {
	const user = useAurix().user;
	const isEmployeeRole = user?.role === "employee";
	const query = useQuery({
		queryKey: [
			"current-employee-profile",
			user?.id,
			user?.email
		],
		queryFn: async () => {
			if (!user) return null;
			const directEmpId = user.employeeId || user.employee_id;
			if (directEmpId && UUID_REGEX.test(directEmpId)) return {
				employeeProfileId: directEmpId,
				employeeName: user.fullName || "Employee"
			};
			try {
				const meRes = await apiInstance.get("/employees/me");
				const meData = meRes.data?.data ?? meRes.data;
				if (meData && meData.id) return {
					employeeProfileId: String(meData.id),
					employeeName: [meData.first_name, meData.last_name].filter(Boolean).join(" ").trim() || meData.full_name || user.fullName,
					employeeCode: meData.employee_id || meData.employee_code,
					department: meData.department,
					designation: meData.designation
				};
			} catch {}
			if (user.email) try {
				const listRes = await apiInstance.get("/employees", { params: {
					search: user.email,
					limit: 10
				} });
				const rawItems = listRes.data?.data?.items ?? listRes.data?.data ?? listRes.data ?? [];
				if (Array.isArray(rawItems)) {
					const match = rawItems.find((e) => e.user_id === user.id || e.company_email === user.email || e.personal_email === user.email || e.email === user.email);
					if (match && match.id) return {
						employeeProfileId: String(match.id),
						employeeName: [match.first_name, match.last_name].filter(Boolean).join(" ").trim() || String(match.full_name || user.fullName),
						employeeCode: String(match.employee_id || match.employee_code || ""),
						department: String(match.department || ""),
						designation: String(match.designation || "")
					};
				}
			} catch {}
			if (user.id && UUID_REGEX.test(user.id)) return {
				employeeProfileId: user.id,
				employeeName: user.fullName || "Employee"
			};
			return null;
		},
		enabled: Boolean(user?.id),
		staleTime: 600 * 1e3,
		gcTime: 1800 * 1e3
	});
	return {
		profile: query.data,
		employeeProfileId: query.data?.employeeProfileId || (UUID_REGEX.test(user?.id || "") ? user?.id : ""),
		isLoading: query.isLoading,
		isEmployeeRole
	};
}
var documentsApi = {
	async getCategories() {
		const res = await apiInstance.get("/documents/categories", {
			headers: { "Cache-Control": "no-cache" },
			skipCache: true
		});
		const raw = res.data?.data ?? res.data ?? [];
		if (!Array.isArray(raw)) return [];
		return raw.map((item) => ({
			id: String(item.id ?? item.category_id ?? ""),
			name: String(item.name ?? item.title ?? ""),
			code: item.code ? String(item.code) : void 0,
			group: String(item.group ?? item.category_group ?? "Employee Documents"),
			is_company: Boolean(item.is_company)
		})).filter((c) => c.id && c.name);
	},
	async getEmployeeDocuments(params) {
		const body = (await apiInstance.get("/documents/employees", {
			params: {
				employee_id: params.employee_id || void 0,
				category_id: params.category_id || void 0,
				status: params.status || void 0,
				search: params.search?.trim() || void 0,
				sort_by: params.sort_by || void 0,
				order: params.order || void 0,
				page: params.page ?? 1,
				limit: Math.min(params.limit ?? 10, 100)
			},
			headers: { "Cache-Control": "no-cache" },
			skipCache: true
		})).data;
		const items = body?.data?.items ?? body?.data ?? body?.items ?? [];
		const meta = body?.meta ?? body?.data?.meta ?? {
			total: Array.isArray(items) ? items.length : 0,
			page: params.page ?? 1,
			limit: params.limit ?? 10,
			has_more: false
		};
		return {
			data: Array.isArray(items) ? items : [],
			meta: {
				total: meta.total ?? (Array.isArray(items) ? items.length : 0),
				page: meta.page ?? params.page ?? 1,
				limit: meta.limit ?? params.limit ?? 10,
				has_more: Boolean(meta.has_more ?? meta.hasMore)
			}
		};
	},
	async getCompanyDocuments(params) {
		const body = (await apiInstance.get("/documents/company", {
			params: {
				category_id: params.category_id || void 0,
				search: params.search?.trim() || void 0,
				sort_by: params.sort_by || void 0,
				order: params.order || void 0,
				page: params.page ?? 1,
				limit: Math.min(params.limit ?? 10, 100)
			},
			headers: { "Cache-Control": "no-cache" },
			skipCache: true
		})).data;
		const items = body?.data?.items ?? body?.data ?? body?.items ?? [];
		const meta = body?.meta ?? body?.data?.meta ?? {
			total: Array.isArray(items) ? items.length : 0,
			page: params.page ?? 1,
			limit: params.limit ?? 10,
			has_more: false
		};
		return {
			data: Array.isArray(items) ? items : [],
			meta: {
				total: meta.total ?? (Array.isArray(items) ? items.length : 0),
				page: meta.page ?? params.page ?? 1,
				limit: meta.limit ?? params.limit ?? 10,
				has_more: Boolean(meta.has_more ?? meta.hasMore)
			}
		};
	},
	async uploadEmployeeDocument(payload) {
		const form = new FormData();
		form.append("file", payload.file);
		form.append("employee_id", payload.employeeId);
		form.append("category_id", payload.categoryId);
		form.append("title", payload.title);
		if (payload.description) form.append("description", payload.description);
		if (payload.issueDate) form.append("issue_date", payload.issueDate);
		if (payload.expiryDate) form.append("expiry_date", payload.expiryDate);
		if (payload.visibility) form.append("visibility", payload.visibility);
		if (payload.statusField) form.append("status_field", payload.statusField);
		if (payload.tags) form.append("tags", payload.tags);
		const res = await apiInstance.post("/documents/employees", form, { headers: { "Content-Type": "multipart/form-data" } });
		return res.data?.data ?? res.data;
	},
	async uploadCompanyDocument(payload) {
		const form = new FormData();
		form.append("file", payload.file);
		form.append("category_id", payload.categoryId);
		form.append("title", payload.title);
		if (payload.description) form.append("description", payload.description);
		if (payload.department) form.append("department", payload.department);
		if (payload.branch) form.append("branch", payload.branch);
		if (payload.visibility) form.append("visibility", payload.visibility);
		const res = await apiInstance.post("/documents/company", form, { headers: { "Content-Type": "multipart/form-data" } });
		return res.data?.data ?? res.data;
	},
	async verifyDocument(id, comments) {
		return {
			success: true,
			message: (await apiInstance.patch(`/documents/${id}/verify`, { comments: comments || "" })).data?.message || "Document verified successfully."
		};
	},
	async rejectDocument(id, comments) {
		return {
			success: true,
			message: (await apiInstance.patch(`/documents/${id}/reject`, { comments })).data?.message || "Document rejected."
		};
	},
	async requestReupload(id, comments) {
		return {
			success: true,
			message: (await apiInstance.patch(`/documents/${id}/request-reupload`, { comments })).data?.message || "Re-upload requested successfully."
		};
	},
	async deleteEmployeeDocument(id) {
		return {
			success: true,
			message: (await apiInstance.delete(`/documents/employees/${id}`)).data?.message || "Document deleted successfully."
		};
	},
	async deleteCompanyDocument(id) {
		return {
			success: true,
			message: (await apiInstance.delete(`/documents/company/${id}`)).data?.message || "Company document deleted successfully."
		};
	},
	async downloadDocument(id, source) {
		const path = source === "company" ? `/documents/company/${id}/download` : `/documents/employees/${id}/download`;
		const res = await apiInstance.get(path, {
			params: { download: true },
			responseType: "blob",
			headers: { Accept: "application/octet-stream, application/pdf, image/*, */*" }
		});
		return {
			blob: res.data,
			contentDisposition: res.headers?.["content-disposition"] || res.headers?.["Content-Disposition"]
		};
	},
	async getDocumentSummary() {
		try {
			const res = await apiInstance.get("/documents/summary", {
				headers: { "Cache-Control": "no-cache" },
				skipCache: true
			});
			const data = res.data?.data ?? res.data ?? {};
			return {
				total: Number(data.total ?? 0),
				verified: Number(data.verified ?? 0),
				pending: Number(data.pending ?? 0),
				rejected: Number(data.rejected ?? 0),
				expiring: Number(data.expiring ?? data.expiring_soon ?? 0),
				expired: Number(data.expired ?? 0)
			};
		} catch {
			return {
				total: 0,
				verified: 0,
				pending: 0,
				rejected: 0,
				expiring: 0,
				expired: 0
			};
		}
	},
	async getExpiringDocuments() {
		try {
			const res = await apiInstance.get("/documents/expiring", {
				headers: { "Cache-Control": "no-cache" },
				skipCache: true
			});
			const items = res.data?.data?.items ?? res.data?.data ?? res.data ?? [];
			return Array.isArray(items) ? items : [];
		} catch {
			return [];
		}
	},
	async getDocumentActivity(page = 1, limit = 10) {
		try {
			const body = (await apiInstance.get("/documents/activity", {
				params: {
					page,
					limit
				},
				headers: { "Cache-Control": "no-cache" },
				skipCache: true
			})).data;
			const rawItems = body?.data?.items ?? body?.data ?? body?.items ?? [];
			if (!Array.isArray(rawItems)) return {
				items: [],
				total: 0
			};
			const items = rawItems.map((item) => ({
				id: String(item.id || Math.random().toString(36).slice(2)),
				documentId: String(item.document_id || item.documentId || ""),
				documentName: String(item.document_name || item.documentName || item.title || "Document"),
				action: String(item.action || "Updated"),
				performedBy: String(item.performed_by || item.performedBy || item.user_name || "System"),
				timestamp: String(item.timestamp || item.created_at || (/* @__PURE__ */ new Date()).toISOString()),
				details: item.details ? String(item.details) : void 0
			}));
			return {
				items,
				total: body?.meta?.total ?? items.length
			};
		} catch {
			return {
				items: [],
				total: 0
			};
		}
	},
	async generateDocument(payload) {
		const res = await apiInstance.post("/documents/generate", payload);
		return res.data?.data ?? res.data;
	}
};
var CATEGORY_GROUPS = [
	"Employee Documents",
	"Education",
	"Employment",
	"Company Documents"
];
/**
* Normalizes any category group string from backend to one of the 4 canonical groups:
* "Employee Documents" | "Education" | "Employment" | "Company Documents"
*/
function normalizeCategoryGroup(rawGroup, isCompany) {
	if (isCompany) return "Company Documents";
	if (!rawGroup) return "Employee Documents";
	const normalized = rawGroup.trim();
	for (const group of CATEGORY_GROUPS) if (group.toLowerCase() === normalized.toLowerCase()) return group;
	const lower = normalized.toLowerCase();
	if (lower.includes("company") || lower.includes("policy") || lower.includes("handbook")) return "Company Documents";
	if (lower.includes("education") || lower.includes("academic") || lower.includes("degree")) return "Education";
	if (lower.includes("employment") || lower.includes("experience") || lower.includes("offer")) return "Employment";
	return "Employee Documents";
}
/**
* Groups an array of backend categories into the 4 canonical category groups.
*/
function groupCategories(categories) {
	const result = {
		"Employee Documents": [],
		Education: [],
		Employment: [],
		"Company Documents": []
	};
	for (const cat of categories) result[normalizeCategoryGroup(cat.group, cat.is_company)].push(cat);
	return result;
}
var CATEGORIES_QUERY_KEY = ["documents", "categories"];
function useDocumentCategories() {
	const query = useQuery({
		queryKey: CATEGORIES_QUERY_KEY,
		queryFn: () => documentsApi.getCategories(),
		staleTime: 900 * 1e3,
		gcTime: 3600 * 1e3,
		retry: 2
	});
	const categories = (0, import_react.useMemo)(() => query.data ?? [], [query.data]);
	return {
		categories,
		categoriesMap: (0, import_react.useMemo)(() => {
			const map = /* @__PURE__ */ new Map();
			for (const cat of categories) map.set(cat.id, cat);
			return map;
		}, [categories]),
		groupedCategories: (0, import_react.useMemo)(() => {
			return groupCategories(categories);
		}, [categories]),
		isLoading: query.isLoading,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch
	};
}
var DOCUMENTS_SUMMARY_QUERY_KEY = ["documents", "summary"];
var DOCUMENTS_EXPIRING_QUERY_KEY = ["documents", "expiring"];
function useDocumentSummary() {
	const summaryQuery = useQuery({
		queryKey: DOCUMENTS_SUMMARY_QUERY_KEY,
		queryFn: () => documentsApi.getDocumentSummary(),
		staleTime: 120 * 1e3
	});
	const expiringQuery = useQuery({
		queryKey: DOCUMENTS_EXPIRING_QUERY_KEY,
		queryFn: () => documentsApi.getExpiringDocuments(),
		staleTime: 120 * 1e3
	});
	const summary = summaryQuery.data ?? {
		total: 0,
		verified: 0,
		pending: 0,
		rejected: 0,
		expiring: expiringQuery.data?.length ?? 0,
		expired: 0
	};
	return {
		summary: {
			...summary,
			expiring: expiringQuery.data?.length ? expiringQuery.data.length : summary.expiring
		},
		expiringDocs: expiringQuery.data ?? [],
		isLoading: summaryQuery.isLoading || expiringQuery.isLoading,
		isError: summaryQuery.isError,
		refetch: () => {
			summaryQuery.refetch();
			expiringQuery.refetch();
		}
	};
}
function formatFileSize(bytes) {
	if (bytes === null || bytes === void 0 || isNaN(bytes) || bytes <= 0) return "—";
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
	return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function detectFileType(fileName, fileUrl, mimeType) {
	const checkStr = `${fileName || ""} ${fileUrl || ""} ${mimeType || ""}`.toLowerCase();
	if (checkStr.includes(".pdf") || checkStr.includes("application/pdf")) return "pdf";
	if (checkStr.includes(".png") || checkStr.includes("image/png")) return "png";
	if (checkStr.includes(".jpg") || checkStr.includes(".jpeg") || checkStr.includes("image/jpeg") || checkStr.includes("image/jpg")) return "jpg";
	if (checkStr.includes(".docx") || checkStr.includes("application/vnd.openxmlformats-officedocument.wordprocessingml")) return "docx";
	if (checkStr.includes(".doc") || checkStr.includes("application/msword")) return "doc";
	return "other";
}
function isDocumentExpired(expiryDate) {
	if (!expiryDate) return false;
	const t = new Date(expiryDate).getTime();
	if (isNaN(t)) return false;
	const endOfDay = new Date(expiryDate);
	endOfDay.setHours(23, 59, 59, 999);
	return endOfDay.getTime() < Date.now();
}
function mapDocumentStatus(backendDoc, source) {
	if (source === "company") return "Published";
	const rawStatus = (backendDoc.status || backendDoc.status_field || "").toUpperCase();
	const isVerified = Boolean(backendDoc.is_verified || rawStatus === "VERIFIED");
	if (isDocumentExpired(backendDoc.expiry_date)) return "Expired";
	if (isVerified) return "VERIFIED";
	if (rawStatus === "REJECTED") return "REJECTED";
	return "PENDING";
}
function mapBackendDocument(d, source, categoriesMap) {
	const categoryId = d.category_id || d.category?.id;
	const matchedCategory = categoryId && categoriesMap ? categoriesMap.get(categoryId) : void 0;
	const categoryName = matchedCategory?.name || d.category_name || d.category?.name || (source === "company" ? "Company Policy" : "General Document");
	const categoryGroup = normalizeCategoryGroup(matchedCategory?.group || d.category_group || d.category?.group, source === "company" || matchedCategory?.is_company);
	const employeeName = d.employee_name || (d.employee ? [d.employee.first_name, d.employee.last_name].filter(Boolean).join(" ").trim() || d.employee.full_name : void 0);
	const title = d.title || d.name || d.document_type || d.type || (source === "company" ? "Company Document" : "Employee Document");
	const fileName = d.file_name || d.name || title;
	const fileUrl = d.file_url || d.download_url || d.document_url || d.url || d.file_path;
	const rawDate = d.created_at || d.updated_at;
	const uploadedAt = rawDate ? rawDate.split("T")[0] : "—";
	const issueDate = d.issue_date ? d.issue_date.split("T")[0] : void 0;
	const expiryDate = d.expiry_date ? d.expiry_date.split("T")[0] : void 0;
	const status = mapDocumentStatus(d, source);
	const isVerified = source === "employee" && (status === "VERIFIED" || Boolean(d.is_verified));
	return {
		id: String(d.id),
		source,
		title,
		fileName,
		employeeId: d.employee_id,
		employeeName: employeeName || (source === "company" ? "Company-wide" : "—"),
		employeeCode: d.employee_code,
		categoryId,
		categoryName,
		categoryGroup,
		uploadedByName: d.uploaded_by_name || d.uploaded_by || "—",
		uploadedAt,
		issueDate,
		expiryDate,
		isExpired: isDocumentExpired(d.expiry_date),
		status,
		isVerified,
		verifiedBy: d.verified_by,
		verifiedAt: d.verified_at,
		fileSize: formatFileSize(d.file_size),
		fileSizeBytes: d.file_size,
		fileType: detectFileType(fileName, fileUrl),
		fileUrl,
		description: d.description,
		rejectionReason: d.rejection_reason || d.rejection_comments || d.comments,
		department: d.department,
		branch: d.branch,
		visibility: d.visibility,
		tags: d.tags,
		lastReview: d.last_review
	};
}
var DOCUMENTS_LIST_QUERY_KEY = ["documents", "list"];
function useDocumentsList({ filters, categoriesMap, currentEmployeeProfileId, isEmployeeRole }) {
	const { tab, search, categoryId, status, sortBy, order, page, limit } = filters;
	const query = useQuery({
		queryKey: [...DOCUMENTS_LIST_QUERY_KEY, {
			tab,
			search: search || "",
			categoryId: categoryId || "",
			status: status || "",
			sortBy: sortBy || "created_at",
			order: order || "desc",
			page,
			limit,
			currentEmployeeProfileId: isEmployeeRole ? currentEmployeeProfileId : ""
		}],
		queryFn: async () => {
			if (tab === "Company Documents") {
				const res = await documentsApi.getCompanyDocuments({
					category_id: categoryId,
					search,
					sort_by: sortBy,
					order,
					page,
					limit
				});
				const items = (res.data || []).map((d) => mapBackendDocument(d, "company", categoriesMap));
				return {
					items,
					meta: {
						total: res.meta?.total ?? items.length,
						page: res.meta?.page ?? page,
						limit: res.meta?.limit ?? limit,
						has_more: Boolean(res.meta?.has_more ?? res.meta?.hasMore)
					}
				};
			}
			if (tab === "Employee Documents" || tab === "Pending" || tab === "Verified" || tab === "Rejected" || tab === "Expired") {
				let apiStatus = void 0;
				if (tab === "Pending") apiStatus = "PENDING";
				else if (tab === "Verified") apiStatus = "VERIFIED";
				else if (tab === "Rejected") apiStatus = "REJECTED";
				const res = await documentsApi.getEmployeeDocuments({
					employee_id: isEmployeeRole ? currentEmployeeProfileId : void 0,
					category_id: categoryId,
					status: apiStatus || status,
					search,
					sort_by: sortBy,
					order,
					page,
					limit
				});
				let items = (res.data || []).map((d) => mapBackendDocument(d, "employee", categoriesMap));
				if (tab === "Expired") items = items.filter((d) => d.isExpired);
				return {
					items,
					meta: {
						total: res.meta?.total ?? items.length,
						page: res.meta?.page ?? page,
						limit: res.meta?.limit ?? limit,
						has_more: Boolean(res.meta?.has_more ?? res.meta?.hasMore)
					}
				};
			}
			const [empRes, compRes] = await Promise.allSettled([documentsApi.getEmployeeDocuments({
				employee_id: isEmployeeRole ? currentEmployeeProfileId : void 0,
				category_id: categoryId,
				status,
				search,
				sort_by: sortBy,
				order,
				page,
				limit
			}), documentsApi.getCompanyDocuments({
				category_id: categoryId,
				search,
				sort_by: sortBy,
				order,
				page,
				limit
			})]);
			const hasPartialError = empRes.status === "rejected" || compRes.status === "rejected";
			if (empRes.status === "rejected" && compRes.status === "rejected") throw new Error("Failed to load documents from server.");
			const allItems = [];
			let totalCount = 0;
			let hasMore = false;
			if (empRes.status === "fulfilled") {
				const empDocs = (empRes.value.data || []).map((d) => mapBackendDocument(d, "employee", categoriesMap));
				allItems.push(...empDocs);
				totalCount += empRes.value.meta?.total ?? empDocs.length;
				if (empRes.value.meta?.has_more) hasMore = true;
			}
			if (compRes.status === "fulfilled") {
				const compDocs = (compRes.value.data || []).map((d) => mapBackendDocument(d, "company", categoriesMap));
				const existingIds = new Set(allItems.map((d) => d.id));
				for (const cd of compDocs) if (!existingIds.has(cd.id)) allItems.push(cd);
				totalCount += compRes.value.meta?.total ?? compDocs.length;
				if (compRes.value.meta?.has_more) hasMore = true;
			}
			return {
				items: allItems,
				meta: {
					total: totalCount,
					page,
					limit,
					has_more: hasMore
				},
				hasPartialError
			};
		},
		staleTime: 60 * 1e3,
		placeholderData: (previousData) => previousData
	});
	return {
		items: query.data?.items ?? [],
		meta: query.data?.meta ?? {
			total: 0,
			page,
			limit,
			has_more: false
		},
		hasPartialError: query.data?.hasPartialError ?? false,
		isLoading: query.isLoading,
		isFetching: query.isFetching,
		isError: query.isError,
		error: query.error,
		refetch: query.refetch
	};
}
var DOCUMENTS_ACTIVITY_QUERY_KEY = ["documents", "activity"];
function useDocumentActivity(page = 1, limit = 6) {
	const query = useQuery({
		queryKey: [...DOCUMENTS_ACTIVITY_QUERY_KEY, {
			page,
			limit
		}],
		queryFn: () => documentsApi.getDocumentActivity(page, limit),
		staleTime: 60 * 1e3
	});
	return {
		activities: query.data?.items ?? [],
		total: query.data?.total ?? 0,
		isLoading: query.isLoading,
		isError: query.isError,
		refetch: query.refetch
	};
}
function useDocumentMutations() {
	const queryClient = useQueryClient();
	const invalidateDocumentQueries = () => {
		queryClient.invalidateQueries({ queryKey: DOCUMENTS_LIST_QUERY_KEY });
		queryClient.invalidateQueries({ queryKey: DOCUMENTS_SUMMARY_QUERY_KEY });
		queryClient.invalidateQueries({ queryKey: DOCUMENTS_EXPIRING_QUERY_KEY });
		queryClient.invalidateQueries({ queryKey: DOCUMENTS_ACTIVITY_QUERY_KEY });
	};
	const verifyMutation = useMutation({
		mutationFn: ({ id, comments }) => documentsApi.verifyDocument(id, comments),
		onSuccess: (res) => {
			toast.success(res.message || "Document verified and approved!");
			invalidateDocumentQueries();
		},
		onError: (err) => {
			toast.error(getErrorMessage(err, "Failed to verify document."));
		}
	});
	const rejectMutation = useMutation({
		mutationFn: ({ id, comments }) => documentsApi.rejectDocument(id, comments),
		onSuccess: (res) => {
			toast.warning(res.message || "Document rejected.");
			invalidateDocumentQueries();
		},
		onError: (err) => {
			toast.error(getErrorMessage(err, "Failed to reject document."));
		}
	});
	const reuploadMutation = useMutation({
		mutationFn: ({ id, comments }) => documentsApi.requestReupload(id, comments),
		onSuccess: (res) => {
			toast.info(res.message || "Re-upload requested successfully.");
			invalidateDocumentQueries();
		},
		onError: (err) => {
			toast.error(getErrorMessage(err, "Failed to request document re-upload."));
		}
	});
	const deleteMutation = useMutation({
		mutationFn: ({ id, source }) => source === "company" ? documentsApi.deleteCompanyDocument(id) : documentsApi.deleteEmployeeDocument(id),
		onSuccess: (res) => {
			toast.success(res.message || "Document deleted successfully.");
			invalidateDocumentQueries();
		},
		onError: (err) => {
			toast.error(getErrorMessage(err, "Failed to delete document."));
		}
	});
	const uploadEmployeeMutation = useMutation({
		mutationFn: (payload) => documentsApi.uploadEmployeeDocument(payload),
		onSuccess: () => {
			toast.success("Employee document uploaded successfully!");
			invalidateDocumentQueries();
		},
		onError: (err) => {
			toast.error(getErrorMessage(err, "Failed to upload document."));
		}
	});
	const uploadCompanyMutation = useMutation({
		mutationFn: (payload) => documentsApi.uploadCompanyDocument(payload),
		onSuccess: () => {
			toast.success("Company document uploaded successfully!");
			invalidateDocumentQueries();
		},
		onError: (err) => {
			toast.error(getErrorMessage(err, "Failed to upload company document."));
		}
	});
	return {
		verifyDocument: verifyMutation.mutateAsync,
		isVerifying: verifyMutation.isPending,
		rejectDocument: rejectMutation.mutateAsync,
		isRejecting: rejectMutation.isPending,
		requestReupload: reuploadMutation.mutateAsync,
		isRequestingReupload: reuploadMutation.isPending,
		deleteDocument: deleteMutation.mutateAsync,
		isDeleting: deleteMutation.isPending,
		uploadEmployeeDocument: uploadEmployeeMutation.mutateAsync,
		isUploadingEmployee: uploadEmployeeMutation.isPending,
		uploadCompanyDocument: uploadCompanyMutation.mutateAsync,
		isUploadingCompany: uploadCompanyMutation.isPending,
		isUploading: uploadEmployeeMutation.isPending || uploadCompanyMutation.isPending
	};
}
var TABS = [
	{
		id: "all",
		label: "All Documents"
	},
	{
		id: "Employee Documents",
		label: "Employee Documents"
	},
	{
		id: "Company Documents",
		label: "Company Documents"
	},
	{
		id: "Pending",
		label: "Pending"
	},
	{
		id: "Verified",
		label: "Verified"
	},
	{
		id: "Rejected",
		label: "Rejected"
	},
	{
		id: "Expired",
		label: "Expired"
	}
];
var DocumentsToolbar = ({ filters, onFilterChange, onOpenUpload, onOpenGenerator, canUpload, canGenerate, categoriesLoaded, pendingCount = 0, expiringDocs = [], isEmployeeRole }) => {
	const [searchInput, setSearchInput] = (0, import_react.useState)(filters.search || "");
	const [showAlertsExpanded, setShowAlertsExpanded] = (0, import_react.useState)(false);
	import_react.useEffect(() => {
		const timer = setTimeout(() => {
			if (searchInput !== (filters.search || "")) onFilterChange({
				search: searchInput,
				page: 1
			});
		}, 300);
		return () => clearTimeout(timer);
	}, [
		searchInput,
		filters.search,
		onFilterChange
	]);
	const alerts = [];
	if (!isEmployeeRole && pendingCount > 0) alerts.push({
		id: "pending_review_alert",
		type: "info",
		message: `You have ${pendingCount} document${pendingCount === 1 ? "" : "s"} awaiting compliance review and verification.`
	});
	for (const doc of expiringDocs) alerts.push({
		id: `exp_${doc.id}`,
		type: "warning",
		message: `${doc.employee_name || "Company"}'s ${doc.title || doc.document_type || "document"} is expiring soon on ${doc.expiry_date}.`
	});
	const displayedAlerts = showAlertsExpanded ? alerts : alerts.slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-2",
				children: [canUpload && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: onOpenUpload,
					disabled: !categoriesLoaded,
					title: !categoriesLoaded ? "Categories loading or failed to load" : void 0,
					className: "h-9 gap-2 border-border bg-card/60 hover:bg-accent/60 cursor-pointer",
					"aria-label": "Upload Document",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), "Upload Document"]
				}), canGenerate && onOpenGenerator && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: onOpenGenerator,
					className: "h-9 gap-2 bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer",
					"aria-label": "AI Document Generator",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-4 w-4" }), "AI Document Generator"]
				})]
			}),
			alerts.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2",
				"aria-live": "polite",
				children: [displayedAlerts.map((alert) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs ${alert.type === "warning" ? "border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400" : alert.type === "error" ? "border-rose-500/20 bg-rose-500/5 text-rose-600 dark:text-rose-400" : "border-blue-500/20 bg-blue-500/5 text-blue-600 dark:text-blue-400"}`,
					children: [alert.type === "warning" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
						className: "h-3.5 w-3.5 shrink-0",
						"aria-hidden": "true"
					}) : alert.type === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, {
						className: "h-3.5 w-3.5 shrink-0",
						"aria-hidden": "true"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
						className: "h-3.5 w-3.5 shrink-0",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1",
						children: alert.message
					})]
				}, alert.id)), alerts.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => setShowAlertsExpanded((prev) => !prev),
						className: "h-6 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer",
						children: showAlertsExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Show less ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-3 w-3 ml-1" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							"View all ",
							alerts.length,
							" alerts ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-3 w-3 ml-1" })
						] })
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-1.5",
					role: "tablist",
					"aria-label": "Document Category Tabs",
					children: TABS.map((tab) => {
						const isActive = filters.tab === tab.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							role: "tab",
							"aria-selected": isActive,
							variant: isActive ? "default" : "outline",
							size: "sm",
							onClick: () => onFilterChange({
								tab: tab.id,
								page: 1
							}),
							className: `h-8 text-xs cursor-pointer ${isActive ? "bg-gradient-brand text-brand-foreground" : "border-border bg-card/60 hover:bg-accent/60"}`,
							children: tab.label
						}, tab.id);
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:w-64",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
						className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
						"aria-hidden": "true"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search documents...",
						value: searchInput,
						onChange: (e) => setSearchInput(e.target.value),
						className: "pl-9 h-9 bg-card/60 border-border text-xs",
						"aria-label": "Search documents"
					})]
				})]
			})
		]
	});
};
var STATS_CONFIG = [
	{
		key: "total",
		title: "Total Documents",
		color: "text-blue-500",
		bg: "bg-blue-500/10"
	},
	{
		key: "verified",
		title: "Verified Documents",
		color: "text-emerald-500",
		bg: "bg-emerald-500/10"
	},
	{
		key: "pending",
		title: "Pending Verification",
		color: "text-amber-500",
		bg: "bg-amber-500/10"
	},
	{
		key: "rejected",
		title: "Rejected Documents",
		color: "text-rose-500",
		bg: "bg-rose-500/10"
	},
	{
		key: "expiring",
		title: "Expiring Soon",
		color: "text-purple-500",
		bg: "bg-purple-500/10"
	}
];
var DocumentsStatsCards = ({ summary, isLoading = false }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid grid-cols-2 md:grid-cols-5 gap-3",
		"aria-label": "Document Statistics",
		children: STATS_CONFIG.map((card) => {
			const value = summary[card.key] ?? 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "border-border bg-card/60 backdrop-blur-sm shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "p-4 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `h-9 w-9 rounded-xl ${card.bg} flex items-center justify-center shrink-0`,
						"aria-hidden": "true",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: `h-4 w-4 ${card.color}` })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-bold text-foreground leading-none",
							children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "inline-block h-5 w-8 rounded bg-muted animate-pulse" }) : value
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground mt-0.5 truncate",
							children: card.title
						})]
					})]
				})
			}, card.key);
		})
	});
};
var DocumentsTable = ({ items, meta, filters, isLoading, isError, hasPartialError, onRetry, onPageChange, onSortChange, onSelectPreview, onSelectDelete, onDownload, userRole, currentEmployeeProfileId }) => {
	const totalPages = Math.max(1, Math.ceil(meta.total / (meta.limit || 10)));
	const currentPage = meta.page;
	const handleRowKeyDown = (e, doc) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			onSelectPreview(doc);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [hasPartialError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-2.5 text-xs text-amber-600 dark:text-amber-400",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Some documents could not be loaded due to a temporary network issue." })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: onRetry,
				className: "h-7 text-xs border-amber-500/30 hover:bg-amber-500/10 cursor-pointer",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3 mr-1" }), " Retry"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "border-border bg-card/60 backdrop-blur-sm shadow-sm overflow-hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
				className: "border-border hover:bg-transparent",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableHead, {
						onClick: () => onSortChange("title"),
						className: "text-xs font-bold text-muted-foreground cursor-pointer hover:text-foreground select-none",
						children: ["Document", filters.sortBy === "title" && (filters.order === "asc" ? " ↑" : " ↓")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableHead, {
						onClick: () => onSortChange("employee_name"),
						className: "text-xs font-bold text-muted-foreground cursor-pointer hover:text-foreground select-none",
						children: ["Employee", filters.sortBy === "employee_name" && (filters.order === "asc" ? " ↑" : " ↓")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-xs font-bold text-muted-foreground",
						children: "Category"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-xs font-bold text-muted-foreground",
						children: "Type"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableHead, {
						onClick: () => onSortChange("created_at"),
						className: "text-xs font-bold text-muted-foreground cursor-pointer hover:text-foreground select-none",
						children: ["Uploaded", filters.sortBy === "created_at" && (filters.order === "asc" ? " ↑" : " ↓")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-xs font-bold text-muted-foreground",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
						className: "text-xs font-bold text-muted-foreground text-right",
						children: "Actions"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: isLoading ? Array.from({ length: 5 }).map((_, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, {
				className: "border-border animate-pulse",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					colSpan: 7,
					className: "py-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 bg-muted/40 rounded w-full" })
				})
			}, `skeleton-${idx}`)) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
				colSpan: 7,
				className: "text-center py-12 text-xs text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-8 w-8 mx-auto mb-2 text-rose-500/70" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-foreground",
						children: "Failed to load documents."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						onClick: onRetry,
						className: "mt-3 h-8 text-xs cursor-pointer",
						children: "Retry Loading"
					})
				]
			}) }) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
				colSpan: 7,
				className: "text-center py-12 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground/40" }), "No documents found matching your filters."]
			}) }) : items.map((doc) => {
				const canDeleteThisDoc = canDo(userRole, "delete", {
					isOwnDocument: currentEmployeeProfileId ? doc.employeeId === currentEmployeeProfileId : false,
					isVerified: doc.isVerified,
					source: doc.source
				});
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
					role: "button",
					tabIndex: 0,
					onKeyDown: (e) => handleRowKeyDown(e, doc),
					onClick: () => onSelectPreview(doc),
					className: "border-border hover:bg-accent/30 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
					"aria-label": `View details for ${doc.title}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs font-medium text-foreground max-w-[200px] truncate",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, {
									className: "h-3.5 w-3.5 text-muted-foreground shrink-0",
									"aria-hidden": "true"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: doc.title
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs text-muted-foreground truncate max-w-[150px]",
							children: doc.employeeName || "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs text-muted-foreground",
							children: doc.categoryName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs text-muted-foreground",
							children: doc.categoryGroup
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-xs text-muted-foreground",
							children: doc.uploadedAt
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							className: `text-[10px] font-medium border-none shadow-none ${doc.status === "VERIFIED" ? "bg-emerald-500/10 text-emerald-500" : doc.status === "PENDING" ? "bg-amber-500/10 text-amber-500" : doc.status === "REJECTED" ? "bg-rose-500/10 text-rose-500" : "bg-neutral-500/10 text-neutral-500"}`,
							children: doc.status
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
							className: "text-right",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-end gap-1",
								onClick: (e) => e.stopPropagation(),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => onSelectPreview(doc),
										className: "h-7 w-7 p-0 cursor-pointer",
										"aria-label": `Preview ${doc.title}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5 text-muted-foreground" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => onDownload(doc),
										className: "h-7 w-7 p-0 cursor-pointer",
										"aria-label": `Download ${doc.title}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-muted-foreground" })
									}),
									canDeleteThisDoc && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => onSelectDelete(doc),
										className: "h-7 w-7 p-0 cursor-pointer",
										"aria-label": `Delete ${doc.title}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5 text-rose-500" })
									})
								]
							})
						})
					]
				}, doc.id);
			}) })] }), meta.total > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-4 py-3 border-t border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[11px] text-muted-foreground",
					children: [
						"Showing ",
						(currentPage - 1) * meta.limit + 1,
						"–",
						Math.min(currentPage * meta.limit, meta.total),
						" of ",
						meta.total
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: currentPage <= 1 || isLoading,
						onClick: () => onPageChange(currentPage - 1),
						className: "h-7 text-xs cursor-pointer",
						"aria-label": "Previous page",
						children: "Prev"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						size: "sm",
						disabled: !meta.has_more && currentPage >= totalPages,
						onClick: () => onPageChange(currentPage + 1),
						className: "h-7 text-xs cursor-pointer",
						"aria-label": "Next page",
						children: "Next"
					})]
				})]
			})]
		})]
	});
};
var ALLOWED_EXTENSIONS = [
	".pdf",
	".png",
	".jpg",
	".jpeg",
	".docx",
	".doc"
];
function validateDocumentFile(file) {
	if (!file) return {
		valid: false,
		error: "Please select or drop a file to upload."
	};
	if (file.size > 10485760) return {
		valid: false,
		error: `File size exceeds the 10 MB limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`
	};
	if (file.size === 0) return {
		valid: false,
		error: "Selected file is empty (0 bytes). Please choose a valid document."
	};
	const fileName = file.name || "";
	const lastDot = fileName.lastIndexOf(".");
	if (lastDot === -1) return {
		valid: false,
		error: "File has no extension. Allowed formats: PDF, PNG, JPG, JPEG, DOCX."
	};
	const ext = fileName.slice(lastDot).toLowerCase();
	if (!ALLOWED_EXTENSIONS.includes(ext)) return {
		valid: false,
		error: `File format "${ext}" is not supported. Allowed: PDF, PNG, JPG, JPEG, DOCX.`
	};
	return { valid: true };
}
function validateDocumentDates(issueDate, expiryDate) {
	if (!expiryDate || !expiryDate.trim()) return { valid: true };
	if (!issueDate || !issueDate.trim()) return { valid: true };
	const issueTime = new Date(issueDate).getTime();
	const expiryTime = new Date(expiryDate).getTime();
	if (Number.isNaN(issueTime) || Number.isNaN(expiryTime)) return { valid: true };
	if (expiryTime < issueTime) return {
		valid: false,
		error: "Expiry date cannot be earlier than the issue date."
	};
	return { valid: true };
}
function validateTitle(title) {
	if (!title || !title.trim()) return {
		valid: false,
		error: "Document title is required."
	};
	if (title.trim().length > 255) return {
		valid: false,
		error: "Title must be 255 characters or fewer."
	};
	return { valid: true };
}
function validateComments(comments, fieldLabel = "Comments") {
	const trimmed = comments?.trim() ?? "";
	if (!trimmed) return {
		valid: false,
		error: `${fieldLabel} are required.`
	};
	if (trimmed.length > 1e3) return {
		valid: false,
		error: `${fieldLabel} must be 1000 characters or fewer.`
	};
	return { valid: true };
}
/**
* Extracts a safe download filename from Content-Disposition header,
* or derives it from fallback name and document type.
*/
function extractFilenameFromHeader(contentDisposition, fallbackName = "document", fallbackType) {
	if (contentDisposition) {
		const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
		if (utf8Match && utf8Match[1]) try {
			return decodeURIComponent(utf8Match[1].replace(/["']/g, ""));
		} catch {}
		const standardMatch = contentDisposition.match(/filename=["']?([^"';]+)["']?/i);
		if (standardMatch && standardMatch[1]) return standardMatch[1].trim();
	}
	let safeName = fallbackName.trim() || "document";
	if (!/\.[a-zA-Z0-9]{2,5}$/.test(safeName)) {
		const ext = fallbackType?.toLowerCase();
		if (ext === "pdf" || ext?.includes("pdf")) safeName = `${safeName}.pdf`;
		else if (ext === "png" || ext?.includes("png")) safeName = `${safeName}.png`;
		else if (ext === "jpg" || ext === "jpeg" || ext?.includes("jpeg")) safeName = `${safeName}.jpg`;
		else if (ext === "docx" || ext?.includes("word")) safeName = `${safeName}.docx`;
	}
	return safeName;
}
function useDocumentPreview(doc) {
	const [state, setState] = (0, import_react.useState)({
		blobUrl: null,
		mimeType: "",
		isLoading: false,
		error: null
	});
	const createdUrlRef = (0, import_react.useRef)(null);
	const loadPreviewBlob = (0, import_react.useCallback)(async () => {
		if (!doc || !doc.id) {
			if (createdUrlRef.current) {
				URL.revokeObjectURL(createdUrlRef.current);
				createdUrlRef.current = null;
			}
			setState({
				blobUrl: null,
				mimeType: "",
				isLoading: false,
				error: null
			});
			return;
		}
		if (doc.fileUrl?.startsWith("blob:") || doc.fileUrl?.startsWith("data:")) {
			setState({
				blobUrl: doc.fileUrl,
				mimeType: doc.fileType === "pdf" ? "application/pdf" : "image/jpeg",
				isLoading: false,
				error: null
			});
			return;
		}
		setState((prev) => ({
			...prev,
			isLoading: true,
			error: null
		}));
		try {
			const blob = (await documentsApi.downloadDocument(doc.id, doc.source)).blob;
			if (!blob || blob.size === 0) throw new Error("Received empty document file from server.");
			if (createdUrlRef.current) URL.revokeObjectURL(createdUrlRef.current);
			const objectUrl = URL.createObjectURL(blob);
			createdUrlRef.current = objectUrl;
			setState({
				blobUrl: objectUrl,
				mimeType: blob.type || "",
				isLoading: false,
				error: null
			});
		} catch (err) {
			const status = err?.response?.status;
			let errorMsg = "Failed to load document preview.";
			if (status === 401) errorMsg = "Authentication required. Please sign in again.";
			else if (status === 403) errorMsg = "You do not have permission to view this document.";
			else if (status === 404) errorMsg = "Document file not found on server.";
			else errorMsg = getErrorMessage(err, "Failed to load document preview.");
			setState({
				blobUrl: null,
				mimeType: "",
				isLoading: false,
				error: errorMsg,
				errorCode: status
			});
		}
	}, [doc]);
	(0, import_react.useEffect)(() => {
		loadPreviewBlob();
		return () => {
			if (createdUrlRef.current) {
				URL.revokeObjectURL(createdUrlRef.current);
				createdUrlRef.current = null;
			}
		};
	}, [loadPreviewBlob]);
	const download = (0, import_react.useCallback)(async () => {
		if (!doc || !doc.id) {
			toast.error("Document cannot be downloaded: invalid document identifier.");
			return;
		}
		const toastId = toast.loading(`Downloading ${doc.title}...`);
		try {
			const res = await documentsApi.downloadDocument(doc.id, doc.source);
			const filename = extractFilenameFromHeader(res.contentDisposition, doc.fileName || doc.title, doc.fileType);
			const url = URL.createObjectURL(res.blob);
			const anchor = document.createElement("a");
			anchor.href = url;
			anchor.download = filename;
			document.body.appendChild(anchor);
			anchor.click();
			anchor.remove();
			setTimeout(() => URL.revokeObjectURL(url), 6e4);
			toast.success(`Downloaded ${filename}`, { id: toastId });
		} catch (err) {
			const status = err?.response?.status;
			let errorMsg = `Failed to download ${doc.title}.`;
			if (status === 401) errorMsg = "Session expired. Please log in again.";
			else if (status === 403) errorMsg = "Permission denied to download this document.";
			else if (status === 404) errorMsg = "Document file not found on the server.";
			else errorMsg = getErrorMessage(err, errorMsg);
			toast.error(errorMsg, { id: toastId });
		}
	}, [doc]);
	return {
		...state,
		retry: loadPreviewBlob,
		download
	};
}
var DocumentPreviewSheet = ({ doc, open, onOpenChange, onVerify, onRejectPrompt, onRequestReuploadPrompt, isVerifying, userRole }) => {
	const { blobUrl, mimeType, isLoading, error, retry, download } = useDocumentPreview(open ? doc : null);
	if (!doc) return null;
	const isCompany = doc.source === "company";
	const canVerify = canDo(userRole, "verify");
	const canReject = canDo(userRole, "reject");
	const canRequestReupload = canDo(userRole, "requestReupload");
	const isImage = mimeType.startsWith("image/") || [
		"jpg",
		"jpeg",
		"png",
		"webp"
	].includes(doc.fileType);
	const isDocx = doc.fileType === "docx" || doc.fileType === "doc";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			className: "w-full sm:max-w-2xl lg:max-w-3xl flex flex-col h-full bg-background border-l border-border p-0 shadow-2xl [&>button.absolute]:hidden",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
					className: "p-5 border-b border-border/80 bg-card/40 backdrop-blur-md shrink-0 text-left space-y-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 flex-wrap",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold tracking-wide rounded-full border-border/80 bg-background/60 text-foreground/85 shadow-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "h-3 w-3 text-indigo-400 shrink-0" }), doc.categoryGroup]
								}), isCompany && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "px-2 py-0.5 text-[10px] text-muted-foreground border-border",
									children: "Company Document"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [
									doc.status === "VERIFIED" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										className: "inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-500 dark:text-emerald-400 border border-emerald-500/30 shadow-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" }), "Verified & Approved"]
									}),
									doc.status === "PENDING" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										className: "inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-semibold rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" }), "Pending Review"]
									}),
									doc.status === "REJECTED" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										className: "inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-semibold rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" }), "Rejected"]
									}),
									doc.status === "Published" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: "inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-semibold rounded-full bg-neutral-500/15 text-neutral-400 border border-neutral-500/30 shadow-xs",
										children: "Published"
									}),
									doc.status === "Expired" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										className: "inline-flex items-center gap-1.5 px-3 py-0.5 text-xs font-semibold rounded-full bg-neutral-500/15 text-neutral-400 border border-neutral-500/30 shadow-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-neutral-400 shrink-0" }), "Expired"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => onOpenChange(false),
										className: "h-7 w-7 rounded-lg border border-border/80 bg-background/60 hover:bg-rose-500/10 hover:border-rose-500/30 hover:text-rose-500 text-muted-foreground inline-flex items-center justify-center cursor-pointer transition-all duration-150 active:scale-95 shadow-xs shrink-0",
										"aria-label": "Close document preview",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, {
							className: "font-display text-lg font-bold text-foreground truncate text-left tracking-tight mt-1 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4.5 w-4.5 text-indigo-400 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: doc.title
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, {
							className: "text-xs text-muted-foreground text-left mt-1 flex flex-wrap items-center gap-x-2 gap-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 font-medium text-foreground/85",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground font-normal",
											children: "Type:"
										}),
										" ",
										doc.categoryName
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-border/80",
									children: "•"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3 w-3 text-muted-foreground/70" }),
										"Uploaded by ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground/80 font-medium",
											children: doc.uploadedByName
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-border/80",
									children: "•"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3 w-3 text-muted-foreground/70" }), doc.uploadedAt]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
					className: "flex-1 p-5 min-h-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Inline Verification View"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-hidden rounded-2xl border border-border bg-card/60 min-h-[440px] relative flex flex-col items-center justify-center p-1",
									children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "w-full h-[440px] flex flex-col items-center justify-center p-6 text-center gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-8 w-8 text-indigo-500 animate-spin" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs font-semibold text-foreground",
												children: "Loading document preview..."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground",
												children: "Fetching file securely with authentication..."
											})
										]
									}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "w-full h-[400px] flex flex-col items-center justify-center p-6 text-center gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-8 w-8 text-rose-500" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-bold text-foreground",
												children: "Preview Unavailable"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground max-w-sm",
												children: error
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												onClick: retry,
												className: "mt-2 h-8 text-xs cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 mr-1" }), " Retry Loading"]
											})
										]
									}) : isDocx ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "w-full h-[400px] flex flex-col items-center justify-center p-6 text-center gap-3 bg-card/90",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-16 w-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-1",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-8 w-8" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-bold text-foreground",
												children: doc.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Inline preview is not available for Word (.docx/.doc) documents. Download the file to view."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												onClick: download,
												className: "h-8 text-xs gap-1.5 mt-2 cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Download to View"]
											})
										]
									}) : blobUrl ? isImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "w-full h-full min-h-[440px] relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-black/40 p-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: blobUrl,
											alt: doc.title,
											className: "w-full max-h-[480px] object-contain rounded-lg shadow-lg"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mt-3 flex items-center gap-2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												onClick: download,
												className: "h-8 text-xs font-medium border-border bg-background/60 hover:bg-accent gap-1.5 cursor-pointer shadow-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-muted-foreground" }), " Download"]
											})
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full h-[520px] relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-background border border-border shadow-inner",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
											src: blobUrl,
											className: "w-full h-full rounded-xl border-0",
											title: doc.title,
											sandbox: "allow-scripts allow-same-origin allow-forms"
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "w-full h-[400px] flex flex-col items-center justify-center p-6 bg-card/90 text-center gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-8 w-8 text-muted-foreground/50" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-bold text-foreground",
												children: doc.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												variant: "outline",
												size: "sm",
												onClick: download,
												className: "h-8 text-xs gap-1.5 cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), " Fetch & Download File"]
											})
										]
									})
								})]
							}),
							doc.status === "REJECTED" && doc.rejectionReason && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs text-rose-600 dark:text-rose-400 space-y-1 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1.5 font-bold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }), "Rejection Compliance Remarks:"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "leading-relaxed bg-rose-500/10 dark:bg-rose-500/20 p-2 rounded border border-rose-500/10 text-left",
									children: [
										"\"",
										doc.rejectionReason,
										"\""
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card/40 p-4 space-y-3 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
									className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
									children: "Document Details"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-x-4 gap-y-3 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground block text-[10px]",
											children: "Employee Owner"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground mt-0.5 block",
											children: doc.employeeName || "Company-wide"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground block text-[10px]",
											children: "Verification Type"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground mt-0.5 block",
											children: doc.categoryName
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground block text-[10px]",
											children: "File Size"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground mt-0.5 block",
											children: doc.fileSize
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-muted-foreground block text-[10px]",
											children: "Expiry Date"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
											className: "text-foreground mt-0.5 block",
											children: doc.expiryDate || "No expiration date"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "col-span-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground block text-[10px]",
												children: "Internal Description"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-foreground mt-0.5 leading-relaxed",
												children: doc.description || "No description provided."
											})]
										})
									]
								})]
							}),
							!isCompany && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Verification Audit Timeline"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card/40 p-4 space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-3 text-xs relative before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-4 w-4 place-items-center rounded-full bg-emerald-500 text-white shrink-0",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-2.5 w-2.5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-foreground",
											children: "Uploaded & Submitted"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-muted-foreground mt-0.5",
											children: [
												"By ",
												doc.uploadedByName,
												" on ",
												doc.uploadedAt
											]
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-3 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `grid h-4 w-4 place-items-center rounded-full shrink-0 ${doc.status === "PENDING" ? "bg-amber-500 text-white" : doc.status === "VERIFIED" ? "bg-emerald-500 text-white" : doc.status === "REJECTED" ? "bg-rose-500 text-white" : "bg-slate-500 text-white"}`,
											children: doc.status === "VERIFIED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-2.5 w-2.5" }) : doc.status === "REJECTED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-2.5 w-2.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-2.5 w-2.5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-bold text-foreground",
											children: doc.status === "VERIFIED" ? "Compliance Verified & Approved" : doc.status === "REJECTED" ? "Compliance Review Rejected" : "Pending Compliance Review"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-muted-foreground mt-0.5",
											children: doc.verifiedBy ? `Reviewed by ${doc.verifiedBy} ${doc.verifiedAt ? `on ${doc.verifiedAt}` : ""}` : doc.status === "PENDING" ? "Awaiting review from Human Resources" : doc.rejectionReason ? `Rejected: ${doc.rejectionReason}` : "Decision pending"
										})] })]
									})]
								})]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-t border-border/80 bg-card/60 backdrop-blur-md shrink-0 flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						variant: "outline",
						onClick: download,
						className: "h-9 px-3.5 text-xs font-medium rounded-xl border border-border/70 bg-card/60 hover:bg-accent/80 hover:border-border text-foreground gap-2 cursor-pointer transition-all duration-150 shadow-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Download" })]
					}), !isCompany && doc.status === "PENDING" && canVerify && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 flex-wrap justify-end",
						children: [
							canRequestReupload && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => onRequestReuploadPrompt(doc),
								className: "h-9 px-3 text-xs font-medium rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 gap-1.5 cursor-pointer shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 text-amber-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Request Re-upload" })]
							}),
							canReject && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => onRejectPrompt(doc),
								className: "h-9 px-3 text-xs font-medium rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 gap-1.5 cursor-pointer shadow-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-3.5 w-3.5 text-rose-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Reject" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								disabled: isVerifying,
								onClick: () => onVerify(doc),
								className: "h-9 px-4 text-xs font-semibold rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white gap-2 cursor-pointer shadow-md shadow-emerald-950/30 border border-emerald-400/20 transition-all duration-150",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: `h-3.5 w-3.5 shrink-0 ${isVerifying ? "animate-spin" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: isVerifying ? "Verifying..." : "Verify & Approve" })]
							})
						]
					})]
				})
			]
		})
	});
};
var UploadDocumentDialog = ({ open, onOpenChange, categories: _categories, groupedCategories, currentEmployeeProfileId, isEmployeeRole, onUploadEmployee, onUploadCompany, isUploading }) => {
	const fileInputRef = (0, import_react.useRef)(null);
	const [selectedGroup, setSelectedGroup] = (0, import_react.useState)(isEmployeeRole ? "Employee Documents" : "Employee Documents");
	const [selectedCategoryId, setSelectedCategoryId] = (0, import_react.useState)("");
	const [title, setTitle] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [issueDate, setIssueDate] = (0, import_react.useState)(() => (/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [expiryDate, setExpiryDate] = (0, import_react.useState)("");
	const [selectedFile, setSelectedFile] = (0, import_react.useState)(null);
	const [fileName, setFileName] = (0, import_react.useState)("");
	const [fileSizeStr, setFileSizeStr] = (0, import_react.useState)("");
	const [targetEmployeeId, setTargetEmployeeId] = (0, import_react.useState)("company");
	const [employeeOptions, setEmployeeOptions] = (0, import_react.useState)([]);
	const [_isSearchingEmployees, setIsSearchingEmployees] = (0, import_react.useState)(false);
	const [employeeSearch] = (0, import_react.useState)("");
	const [visibility] = (0, import_react.useState)(isEmployeeRole ? "PRIVATE" : "COMPANY");
	const [errors, setErrors] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		const availableCategories = groupedCategories[selectedGroup] || [];
		if (availableCategories.length > 0) {
			if (!availableCategories.some((c) => c.id === selectedCategoryId)) setSelectedCategoryId(availableCategories[0].id);
		} else setSelectedCategoryId("");
	}, [
		selectedGroup,
		groupedCategories,
		selectedCategoryId
	]);
	(0, import_react.useEffect)(() => {
		if (open && !isEmployeeRole) {
			let isMounted = true;
			const fetchEmployees = async () => {
				setIsSearchingEmployees(true);
				try {
					const res = await apiInstance.get("/employees", { params: {
						search: employeeSearch.trim() || void 0,
						limit: 20
					} });
					const rawItems = res.data?.data?.items ?? res.data?.data ?? res.data ?? [];
					if (Array.isArray(rawItems) && isMounted) setEmployeeOptions(rawItems.map((e) => ({
						id: String(e.id),
						fullName: [e.first_name, e.last_name].filter(Boolean).join(" ").trim() || String(e.full_name || "Employee"),
						employeeCode: String(e.employee_id || e.employee_code || "")
					})));
				} catch {} finally {
					if (isMounted) setIsSearchingEmployees(false);
				}
			};
			const timer = setTimeout(fetchEmployees, 300);
			return () => {
				isMounted = false;
				clearTimeout(timer);
			};
		}
	}, [
		open,
		isEmployeeRole,
		employeeSearch
	]);
	const handleSelectFile = (file) => {
		const validation = validateDocumentFile(file);
		if (!validation.valid) {
			setErrors((prev) => ({
				...prev,
				file: validation.error || "Invalid file"
			}));
			toast.error(validation.error);
			return;
		}
		setErrors((prev) => {
			const next = { ...prev };
			delete next.file;
			return next;
		});
		setSelectedFile(file);
		setFileName(file.name);
		if (!title.trim()) setTitle(file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " "));
		setFileSizeStr(file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`);
	};
	const handleChangeFile = () => {
		setSelectedFile(null);
		setFileName("");
		setFileSizeStr("");
		if (fileInputRef.current) fileInputRef.current.value = "";
		setErrors((prev) => {
			const next = { ...prev };
			delete next.file;
			return next;
		});
	};
	const handleDrop = (e) => {
		e.preventDefault();
		if (e.dataTransfer.files && e.dataTransfer.files[0]) handleSelectFile(e.dataTransfer.files[0]);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = {};
		const fileVal = validateDocumentFile(selectedFile);
		if (!fileVal.valid) newErrors.file = fileVal.error || "File is required.";
		const titleVal = validateTitle(title);
		if (!titleVal.valid) newErrors.title = titleVal.error || "Title is required.";
		if (!selectedCategoryId) newErrors.category = "Please select a valid document category.";
		const datesVal = validateDocumentDates(issueDate, expiryDate);
		if (!datesVal.valid) newErrors.expiryDate = datesVal.error || "Invalid expiry date.";
		const isCompanyDoc = selectedGroup === "Company Documents" || !isEmployeeRole && targetEmployeeId === "company";
		if (!isCompanyDoc && isEmployeeRole && !currentEmployeeProfileId) newErrors.employee = "Could not resolve your employee profile. Please refresh.";
		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors);
			const firstError = Object.values(newErrors)[0];
			toast.error(firstError);
			return;
		}
		try {
			if (isCompanyDoc) await onUploadCompany({
				file: selectedFile,
				categoryId: selectedCategoryId,
				title: title.trim(),
				description: description.trim() || void 0,
				visibility: isEmployeeRole ? "COMPANY" : visibility
			});
			else await onUploadEmployee({
				file: selectedFile,
				employeeId: isEmployeeRole ? currentEmployeeProfileId : targetEmployeeId,
				categoryId: selectedCategoryId,
				title: title.trim(),
				description: description.trim() || void 0,
				issueDate: issueDate || void 0,
				expiryDate: expiryDate || void 0,
				visibility: isEmployeeRole ? "PRIVATE" : visibility,
				statusField: "PENDING"
			});
			onOpenChange(false);
			handleChangeFile();
			setTitle("");
			setDescription("");
			setExpiryDate("");
			setErrors({});
		} catch (err) {
			const res = err?.response;
			if (res?.status === 409) setErrors((prev) => ({
				...prev,
				file: res.data?.message || "A document with this name or record already exists."
			}));
			else if (res?.status === 422) setErrors((prev) => ({
				...prev,
				general: res.data?.message || res.data?.detail || "Validation failed on the server. Please check the entered fields."
			}));
		}
	};
	const availableCategories = groupedCategories[selectedGroup] || [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-lg bg-background border-border shadow-2xl p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "font-display text-lg font-bold flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5 text-primary" }), "Upload New Document"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "text-xs text-muted-foreground",
					children: isEmployeeRole ? "Upload verification documents, academic proofs, or identity certificates." : "Add employee verification documents, statutory certificates, or company policies."
				})] }),
				errors.general && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.general })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSubmit,
					className: "space-y-4 pt-2",
					children: [
						!isEmployeeRole && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Target Scope / Employee"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: targetEmployeeId,
								onValueChange: setTargetEmployeeId,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full bg-background/50 border-border text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select target" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
									className: "max-h-[220px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "company",
										children: "Company-wide (Company Document)"
									}), employeeOptions.map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: emp.id,
										children: [
											emp.fullName,
											" ",
											emp.employeeCode ? `(${emp.employeeCode})` : ""
										]
									}, emp.id))]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Category Group"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: selectedGroup,
									onValueChange: (val) => setSelectedGroup(val),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "bg-background/50 border-border text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATEGORY_GROUPS.map((grp) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: grp,
										children: grp
									}, grp)) })]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Document Type"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: selectedCategoryId,
										onValueChange: setSelectedCategoryId,
										disabled: availableCategories.length === 0,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "bg-background/50 border-border text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: availableCategories.length === 0 ? "No categories" : "Select type" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
											className: "max-h-[200px]",
											children: availableCategories.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
												value: cat.id,
												children: cat.name
											}, cat.id))
										})]
									}),
									errors.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-rose-500",
										children: errors.category
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: ["Document Title ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-rose-500",
										children: "*"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: title,
									onChange: (e) => {
										setTitle(e.target.value);
										if (errors.title) setErrors((prev) => {
											const next = { ...prev };
											delete next.title;
											return next;
										});
									},
									placeholder: "e.g. Aadhaar Card Front & Back",
									className: "bg-background/50 border-border text-xs"
								}),
								errors.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-rose-500",
									children: errors.title
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Issue Date"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: issueDate,
										onChange: (e) => setIssueDate(e.target.value),
										className: "pl-9 bg-background/50 border-border text-xs"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Expiry Date (Optional)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: expiryDate,
											onChange: (e) => {
												setExpiryDate(e.target.value);
												if (errors.expiryDate) setErrors((prev) => {
													const next = { ...prev };
													delete next.expiryDate;
													return next;
												});
											},
											className: "pl-9 bg-background/50 border-border text-xs"
										})]
									}),
									errors.expiryDate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[11px] text-rose-500",
										children: errors.expiryDate
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground",
								children: "Description / Notes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								placeholder: "Specify compliance notes or additional document details",
								value: description,
								onChange: (e) => setDescription(e.target.value),
								className: "min-h-[50px] bg-background/50 border-border text-xs"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: ["Document File (PDF, PNG, JPG, JPEG, DOCX up to 10MB) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-rose-500",
										children: "*"
									})]
								}),
								fileName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 p-3 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-emerald-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-foreground truncate max-w-[220px]",
												children: fileName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground",
												children: fileSizeStr
											})]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										size: "sm",
										onClick: handleChangeFile,
										className: "h-7 text-muted-foreground hover:text-foreground hover:bg-accent/40 cursor-pointer",
										children: "Change File"
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									onDragOver: (e) => e.preventDefault(),
									onDrop: handleDrop,
									onClick: () => fileInputRef.current?.click(),
									className: "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-background/30 p-6 text-center transition-colors hover:bg-accent/20 cursor-pointer",
									role: "button",
									tabIndex: 0,
									onKeyDown: (e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											fileInputRef.current?.click();
										}
									},
									"aria-label": "Click to browse or drag and drop a file",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											ref: fileInputRef,
											type: "file",
											className: "hidden",
											accept: ".pdf,.png,.jpg,.jpeg,.docx,.doc",
											onChange: (e) => {
												if (e.target.files && e.target.files[0]) handleSelectFile(e.target.files[0]);
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, {
											className: "mb-2 h-6 w-6 text-muted-foreground",
											"aria-hidden": "true"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-medium text-foreground",
											children: "Click to browse or drag & drop a file here"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-0.5 text-[10px] text-muted-foreground",
											children: "Supports PDF, PNG, JPG, DOCX up to 10MB"
										})
									]
								}),
								errors.file && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-rose-500",
									children: errors.file
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => onOpenChange(false),
								className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: isUploading,
								className: "h-9 min-w-[100px] bg-gradient-brand text-brand-foreground hover:opacity-90 cursor-pointer",
								children: isUploading ? "Uploading..." : "Upload Document"
							})]
						})
					]
				})
			]
		})
	});
};
var RejectDialog = ({ open, onOpenChange, targetDoc, onConfirmReject, isRejecting }) => {
	const [comments, setComments] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)(null);
	const charCount = comments.length;
	const maxChars = 1e3;
	const handleSubmit = async () => {
		if (!targetDoc) return;
		const val = validateComments(comments, "Rejection reason");
		if (!val.valid) {
			setError(val.error || "Please enter a reason.");
			return;
		}
		try {
			await onConfirmReject(targetDoc.id, comments.trim());
			onOpenChange(false);
			setComments("");
			setError(null);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md bg-background border-border shadow-2xl p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-display font-bold text-foreground",
					children: "Reject Document"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
					className: "text-xs text-muted-foreground",
					children: [
						"Please provide a specific compliance reason for rejecting",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: targetDoc?.title
						}),
						". The employee will see this feedback."
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: comments,
						onChange: (e) => {
							setComments(e.target.value);
							if (error) setError(null);
						},
						maxLength: maxChars,
						placeholder: "e.g. Document image is blurred, expiration date has passed, or official seal is cut off...",
						className: "min-h-[100px] border-border text-xs",
						"aria-label": "Rejection comments"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center text-[10px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-rose-500",
							children: error
						}) : "Required field (1–1000 characters)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: charCount > maxChars ? "text-rose-500 font-bold" : "",
							children: [
								charCount,
								"/",
								maxChars
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						disabled: isRejecting,
						onClick: () => onOpenChange(false),
						className: "h-9 border-border bg-transparent cursor-pointer",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						disabled: isRejecting || !comments.trim(),
						onClick: handleSubmit,
						className: "h-9 bg-rose-600 text-white hover:bg-rose-700 cursor-pointer",
						children: isRejecting ? "Rejecting..." : "Confirm Rejection"
					})]
				})
			]
		})
	});
};
var ReuploadDialog = ({ open, onOpenChange, targetDoc, onConfirmReupload, isRequesting }) => {
	const [comments, setComments] = (0, import_react.useState)("Re-upload requested. Please supply a clear copy.");
	const [error, setError] = (0, import_react.useState)(null);
	const charCount = comments.length;
	const maxChars = 1e3;
	const handleSubmit = async () => {
		if (!targetDoc) return;
		const val = validateComments(comments, "Re-upload instructions");
		if (!val.valid) {
			setError(val.error || "Please enter re-upload instructions.");
			return;
		}
		try {
			await onConfirmReupload(targetDoc.id, comments.trim());
			onOpenChange(false);
			setError(null);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md bg-background border-border shadow-2xl p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-display font-bold text-foreground",
					children: "Request Document Re-upload"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
					className: "text-xs text-muted-foreground",
					children: [
						"Provide instructions for the employee regarding why a re-upload of",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: targetDoc?.title
						}),
						" is needed."
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: comments,
						onChange: (e) => {
							setComments(e.target.value);
							if (error) setError(null);
						},
						maxLength: maxChars,
						placeholder: "e.g. Please provide a clear color scan showing both sides with all four corners visible.",
						className: "min-h-[100px] border-border text-xs",
						"aria-label": "Re-upload instructions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between items-center text-[10px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-rose-500",
							children: error
						}) : "Required field (1–1000 characters)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: charCount > maxChars ? "text-rose-500 font-bold" : "",
							children: [
								charCount,
								"/",
								maxChars
							]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						disabled: isRequesting,
						onClick: () => onOpenChange(false),
						className: "h-9 border-border bg-transparent cursor-pointer",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						disabled: isRequesting || !comments.trim(),
						onClick: handleSubmit,
						className: "h-9 bg-amber-600 text-white hover:bg-amber-700 cursor-pointer",
						children: isRequesting ? "Submitting..." : "Send Re-upload Request"
					})]
				})
			]
		})
	});
};
var DeleteDialog = ({ open, onOpenChange, targetDoc, onConfirmDelete, isDeleting }) => {
	const handleDelete = async () => {
		if (!targetDoc) return;
		try {
			await onConfirmDelete(targetDoc);
			onOpenChange(false);
		} catch {}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-sm bg-background border-border shadow-2xl p-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "font-display font-bold text-foreground",
				children: "Delete Document"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
				className: "text-xs text-muted-foreground",
				children: [
					"Are you sure you want to permanently delete",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "text-foreground",
						children: targetDoc?.title
					}),
					"? This action cannot be undone."
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
				className: "gap-2 pt-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					disabled: isDeleting,
					onClick: () => onOpenChange(false),
					className: "h-9 border-border bg-transparent cursor-pointer",
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					disabled: isDeleting,
					onClick: handleDelete,
					className: "h-9 bg-rose-600 text-white hover:bg-rose-700 cursor-pointer",
					children: isDeleting ? "Deleting..." : "Delete Permanently"
				})]
			})]
		})
	});
};
var RelievingLetterPreview = ({ company, employee, fields, isOfficial = false }) => {
	const companyName = company?.name || "OFC360 Organization";
	const address = company?.address || company?.city ? `${company?.address || ""}, ${company?.city || ""}`.trim() : "Corporate Headquarters";
	const contact = [
		company?.website,
		company?.email,
		company?.phone
	].filter(Boolean).join(" • ");
	const empName = employee?.fullName || "Employee";
	const empId = employee?.employeeId || "—";
	const role = fields["Role"] || employee?.designation || "—";
	const department = employee?.department || "—";
	const lastWorkingDay = fields["Last Working Day"] || "—";
	const reason = fields["Reason for Leaving"] || "Voluntary Resignation";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card text-card-foreground shadow-sm border border-border rounded-xl p-6 sm:p-8 relative overflow-hidden font-sans text-left space-y-5 select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-30deg] select-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-5xl font-extrabold uppercase tracking-widest text-foreground",
					children: isOfficial ? "OFFICIAL RELIEVING CERTIFICATE" : "DRAFT PREVIEW"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start border-b-2 border-border pb-4 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm",
							children: companyName.charAt(0)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xs sm:text-sm font-extrabold tracking-wider text-foreground uppercase",
							children: companyName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[9px] text-muted-foreground font-semibold uppercase tracking-wider",
							children: "Human Resources Department"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[9px] text-muted-foreground leading-relaxed pt-1 space-y-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Registered Address:" }),
							" ",
							address
						] }), contact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: contact })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right space-y-1 shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-block bg-primary text-primary-foreground text-[9px] font-bold px-2.5 py-1 rounded tracking-wider uppercase",
							children: "RELIEVING LETTER"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[9px] text-muted-foreground pt-0.5",
							children: ["Issue Date: ", (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
								day: "2-digit",
								month: "long",
								year: "numeric"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `inline-block text-[8px] font-bold px-1.5 py-0.5 rounded uppercase border ${statusBadgeClass(isOfficial ? "approved" : "draft")}`,
							children: isOfficial ? "OFFICIAL & VERIFIED" : "DRAFT PREVIEW (NOT AN OFFICIAL DOCUMENT)"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-muted/50 p-3.5 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-[9px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-1",
					children: "EMPLOYEE SEPARATION RECORD"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-muted-foreground block",
							children: "Employee Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground font-bold",
							children: empName
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-muted-foreground block",
							children: "Employee ID"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground font-mono font-bold",
							children: empId
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-muted-foreground block",
							children: "Designation"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground font-bold",
							children: role
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-muted-foreground block",
							children: "Department"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground font-bold",
							children: department
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-muted-foreground block",
							children: "Office Location"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground font-bold",
							children: employee?.location || "Corporate Office"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-muted-foreground block",
							children: "Date of Joining"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground font-bold",
							children: employee?.joiningDate || "—"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-muted-foreground block",
							children: "Last Working Day"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground font-bold",
							children: lastWorkingDay
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2.5 text-[11px] leading-relaxed text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-bold text-foreground",
						children: [
							"Dear ",
							empName.split(" ")[0],
							","
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"This is to certify that you were employed with ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: companyName }),
						" as a",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: role }),
						" in the ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: department }),
						" department from",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: employee?.joiningDate || "—" }),
						" to ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: lastWorkingDay }),
						"."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "During your tenure, you successfully fulfilled your assigned responsibilities and contributed with professionalism, competence, and dedication." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Separation reason recorded: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: reason }),
						". Accordingly, you are hereby formally relieved from your duties and services effective from the close of business hours on",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: lastWorkingDay }),
						"."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We sincerely appreciate your contributions and extend our best wishes for your future endeavors." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-4 border-t border-border flex justify-between items-end text-[10px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold text-foreground",
						children: "Authorized Signatory"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "People Operations & Human Resources"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-foreground",
						children: companyName
					})
				] })
			})
		]
	});
};
var OfferLetterPreview = ({ company, employee, fields, isOfficial = false }) => {
	const companyName = company?.name || "OFC360 Organization";
	const address = company?.address || company?.city ? `${company?.address || ""}, ${company?.city || ""}`.trim() : "Corporate Headquarters";
	const contact = [
		company?.website,
		company?.email,
		company?.phone
	].filter(Boolean).join(" • ");
	const candidateName = employee?.fullName || fields["Candidate Name"] || "Candidate Name";
	const role = fields["Role"] || employee?.designation || "—";
	const salary = fields["Salary (LPA)"] || "—";
	const startDate = fields["Start Date"] || "—";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-card text-card-foreground shadow-sm border border-border rounded-xl p-6 sm:p-8 relative overflow-hidden font-sans text-left space-y-5 select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-30deg] select-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-5xl font-extrabold uppercase tracking-widest text-foreground",
					children: isOfficial ? "OFFICIAL OFFER LETTER" : "DRAFT PREVIEW"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start border-b-2 border-border pb-4 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm",
							children: companyName.charAt(0)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-xs sm:text-sm font-extrabold tracking-wider text-foreground uppercase",
							children: companyName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[9px] text-muted-foreground font-semibold uppercase tracking-wider",
							children: "Talent Acquisition & People Operations"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-[9px] text-muted-foreground leading-relaxed pt-1 space-y-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Registered Address:" }),
							" ",
							address
						] }), contact && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: contact })]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right space-y-1 shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-block bg-primary text-primary-foreground text-[9px] font-bold px-2.5 py-1 rounded tracking-wider uppercase",
							children: "EMPLOYMENT OFFER"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[9px] text-muted-foreground pt-0.5",
							children: ["Date: ", (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
								day: "2-digit",
								month: "long",
								year: "numeric"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `inline-block text-[8px] font-bold px-1.5 py-0.5 rounded uppercase border ${statusBadgeClass(isOfficial ? "approved" : "draft")}`,
							children: isOfficial ? "OFFICIAL & VERIFIED" : "DRAFT PREVIEW (NOT AN OFFICIAL DOCUMENT)"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-muted/50 p-3.5 space-y-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-[9px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-1",
					children: "EMPLOYMENT OFFER SUMMARY"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-muted-foreground block",
							children: "Candidate Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground font-bold",
							children: candidateName
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-muted-foreground block",
							children: "Offered Position"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground font-bold",
							children: role
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-muted-foreground block",
							children: "Annual Compensation"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground font-bold",
							children: salary !== "—" ? `INR ${salary} Lakhs per annum` : "—"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-muted-foreground block",
							children: "Start Date"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground font-bold",
							children: startDate
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-muted-foreground block",
							children: "Work Location"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground font-bold",
							children: employee?.location || "Corporate Headquarters"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] text-muted-foreground block",
							children: "Department"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground font-bold",
							children: employee?.department || "General"
						})] })
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2.5 text-[11px] leading-relaxed text-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-bold text-foreground",
						children: [
							"Dear ",
							candidateName.split(" ")[0],
							","
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"We are pleased to extend an offer of employment for the position of ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: role }),
						" at",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: companyName }),
						". We were very impressed with your skills and background and believe you will make significant contributions to our team."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Your starting annualized compensation will be ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
							"INR ",
							salary,
							" Lakhs"
						] }),
						", subject to statutory deductions. Your anticipated start date will be ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: startDate }),
						"."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This offer is contingent upon successful completion of background checks, reference verifications, and receipt of required educational and identification documentation." })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pt-4 border-t border-border flex justify-between items-end text-[10px]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold text-foreground",
						children: "Authorized Signatory"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: "People Operations Team"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-foreground",
						children: companyName
					})
				] })
			})
		]
	});
};
var NDAPreview = ({ company, employee, fields, isOfficial = false }) => {
	const companyName = company?.name || "OFC360 Organization";
	const address = company?.address || company?.city ? `${company?.address || ""}, ${company?.city || ""}`.trim() : "Corporate Headquarters";
	const recipient = employee?.fullName || fields["Recipient Name"] || "Recipient Party";
	const witness = fields["Witness Name"] || "Legal Department Representative";
	const duration = fields["Duration (Years)"] || "—";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white text-slate-900 shadow-xl border border-slate-200 rounded-xl p-6 sm:p-8 relative overflow-hidden font-sans text-left space-y-5 select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-30deg] select-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-5xl font-extrabold uppercase tracking-widest text-slate-900",
					children: isOfficial ? "CONFIDENTIAL NDA" : "DRAFT PREVIEW"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-4 gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-xs sm:text-sm font-extrabold tracking-wider text-slate-900 uppercase",
						children: companyName
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[9px] text-slate-600",
						children: ["Address: ", address]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right space-y-1 shrink-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "inline-block bg-indigo-950 text-white text-[9px] font-bold px-2.5 py-1 rounded tracking-wider uppercase",
							children: "NON-DISCLOSURE AGREEMENT"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[9px] text-slate-500 pt-0.5",
							children: ["Date: ", (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
								day: "2-digit",
								month: "long",
								year: "numeric"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `inline-block text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${isOfficial ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : "text-amber-700 bg-amber-50 border border-amber-200"}`,
							children: isOfficial ? "OFFICIAL" : "DRAFT PREVIEW (NOT AN OFFICIAL DOCUMENT)"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 text-[11px] leading-relaxed text-slate-800",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"This Confidentiality and Non-Disclosure Agreement is entered into between",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: companyName }),
						" and ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: recipient }),
						"."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"The parties agree that all confidential, proprietary, technical, and business information disclosed under this agreement shall remain protected for a period of",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [duration, " years"] }),
						" from the effective date."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"Witnessed by: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: witness }),
						"."
					] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-6 border-t border-slate-200 grid grid-cols-2 gap-4 text-[10px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-bold text-slate-900",
					children: [
						"Signed on behalf of ",
						companyName,
						":"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-slate-500 mt-4",
					children: "Authorized Corporate Signatory"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-bold text-slate-900",
					children: "Signed by Recipient:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-slate-500 mt-4",
					children: recipient
				})] })]
			})
		]
	});
};
var HandbookAcknowledgmentPreview = ({ company, employee, fields, isOfficial = false }) => {
	const companyName = company?.name || "OFC360 Organization";
	const employeeName = employee?.fullName || "Employee Name";
	const designation = fields["Signee Designation"] || employee?.designation || "Employee";
	const versionDate = fields["Version Date"] || (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white text-slate-900 shadow-xl border border-slate-200 rounded-xl p-6 sm:p-8 relative overflow-hidden font-sans text-left space-y-5 select-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b-2 border-slate-900 pb-3 flex justify-between items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xs sm:text-sm font-extrabold uppercase",
					children: companyName
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-slate-500",
					children: "Corporate Governance & Compliance Policy"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `text-[8px] font-bold px-2 py-0.5 rounded uppercase ${isOfficial ? "text-emerald-700 bg-emerald-50" : "text-amber-700 bg-amber-50"}`,
					children: isOfficial ? "OFFICIAL ACKNOWLEDGMENT" : "DRAFT PREVIEW (NOT AN OFFICIAL DOCUMENT)"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3 text-[11px] leading-relaxed text-slate-800",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold text-slate-900",
						children: "COMPANY HANDBOOK & CODE OF CONDUCT ACKNOWLEDGMENT"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"I, ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: employeeName }),
						", holding the position of ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: designation }),
						", hereby acknowledge that I have received access to, reviewed, and agreed to adhere to the standards, policies, and ethics described in the ",
						companyName,
						" Corporate Handbook."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Handbook Version Date: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: versionDate })] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pt-6 border-t border-slate-200 text-[10px] space-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold text-slate-900",
						children: "Electronically Acknowledged"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-slate-500",
						children: ["Employee Signature: ", employeeName]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-slate-400",
						children: ["Date: ", (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")]
					})
				]
			})
		]
	});
};
var TEMPLATES = [
	{
		id: "offer",
		title: "Offer Letter",
		categoryGroup: "Employment",
		fields: [
			{
				key: "Role",
				label: "Role / Designation",
				placeholder: "e.g. Software Engineer",
				required: true
			},
			{
				key: "Salary (LPA)",
				label: "Salary (LPA)",
				placeholder: "e.g. 12.0",
				required: true
			},
			{
				key: "Start Date",
				label: "Anticipated Start Date",
				placeholder: "YYYY-MM-DD",
				required: true
			}
		]
	},
	{
		id: "relieving",
		title: "Relieving Letter",
		categoryGroup: "Employment",
		fields: [
			{
				key: "Role",
				label: "Separating Designation",
				placeholder: "e.g. Senior Developer",
				required: true
			},
			{
				key: "Last Working Day",
				label: "Last Working Day",
				placeholder: "YYYY-MM-DD",
				required: true
			},
			{
				key: "Reason for Leaving",
				label: "Reason for Leaving",
				placeholder: "e.g. Better Career Prospects",
				required: false
			}
		]
	},
	{
		id: "nda",
		title: "Non-Disclosure Agreement (NDA)",
		categoryGroup: "Company Documents",
		fields: [
			{
				key: "Recipient Name",
				label: "Recipient Name",
				placeholder: "Recipient or Contractor Name",
				required: true
			},
			{
				key: "Witness Name",
				label: "Witness Name",
				placeholder: "e.g. Corporate Legal Counsel",
				required: false
			},
			{
				key: "Duration (Years)",
				label: "Duration (Years)",
				placeholder: "e.g. 2",
				required: true
			}
		]
	},
	{
		id: "handbook",
		title: "Company Handbook Acknowledgment",
		categoryGroup: "Company Documents",
		fields: [{
			key: "Version Date",
			label: "Handbook Version Date",
			placeholder: "YYYY-MM-DD",
			required: true
		}, {
			key: "Signee Designation",
			label: "Signee Designation",
			placeholder: "e.g. Associate",
			required: false
		}]
	}
];
var DocumentGeneratorDialog = ({ open, onOpenChange }) => {
	const company = useAurix().company;
	const [selectedTemplateId, setSelectedTemplateId] = (0, import_react.useState)("offer");
	const [selectedEmployeeId, setSelectedEmployeeId] = (0, import_react.useState)("general");
	const [fields, setFields] = (0, import_react.useState)({});
	const [employees, setEmployees] = (0, import_react.useState)([]);
	const [_isSearchingEmployees, setIsSearchingEmployees] = (0, import_react.useState)(false);
	const [employeeQuery] = (0, import_react.useState)("");
	const [isGenerating, setIsGenerating] = (0, import_react.useState)(false);
	const [generatedResult, setGeneratedResult] = (0, import_react.useState)(null);
	const currentTemplate = TEMPLATES.find((t) => t.id === selectedTemplateId) || TEMPLATES[0];
	(0, import_react.useEffect)(() => {
		if (open) {
			let isMounted = true;
			const fetchEmps = async () => {
				setIsSearchingEmployees(true);
				try {
					const res = await apiInstance.get("/employees", { params: {
						search: employeeQuery.trim() || void 0,
						limit: 20
					} });
					const raw = res.data?.data?.items ?? res.data?.data ?? res.data ?? [];
					if (Array.isArray(raw) && isMounted) setEmployees(raw.map((e) => ({
						id: String(e.id),
						fullName: [e.first_name, e.last_name].filter(Boolean).join(" ").trim() || String(e.full_name || "Employee"),
						employeeId: String(e.employee_id || e.employee_code || ""),
						department: String(e.department || ""),
						designation: String(e.designation || ""),
						location: String(e.work_location || ""),
						joiningDate: String(e.joining_date || "")
					})));
				} catch {} finally {
					if (isMounted) setIsSearchingEmployees(false);
				}
			};
			const timer = setTimeout(fetchEmps, 300);
			return () => {
				isMounted = false;
				clearTimeout(timer);
			};
		}
	}, [open, employeeQuery]);
	const selectedEmployee = selectedEmployeeId === "general" ? null : employees.find((e) => e.id === selectedEmployeeId) || null;
	const handleAutoFill = () => {
		if (!selectedEmployee) return;
		const updated = { ...fields };
		if (selectedEmployee.designation) {
			updated["Role"] = selectedEmployee.designation;
			updated["Signee Designation"] = selectedEmployee.designation;
		}
		if (selectedEmployee.fullName) updated["Recipient Name"] = selectedEmployee.fullName;
		setFields(updated);
	};
	const areRequiredFieldsFilled = currentTemplate.fields.filter((f) => f.required).every((f) => (fields[f.key] || "").trim().length > 0);
	const handleGenerate = async () => {
		if (!areRequiredFieldsFilled) {
			toast.error("Please fill in all required template parameters.");
			return;
		}
		setIsGenerating(true);
		try {
			try {
				await apiInstance.post("/documents/generate", {
					template_id: selectedTemplateId,
					employee_id: selectedEmployeeId === "general" ? void 0 : selectedEmployeeId,
					parameters: fields
				});
				setGeneratedResult({ isOfficial: true });
				toast.success("Document generated successfully!");
			} catch {
				setGeneratedResult({ isOfficial: false });
				toast.info("Draft preview ready (Official generation endpoint pending backend wiring).");
			}
		} finally {
			setIsGenerating(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "sm:max-w-4xl bg-background border-border shadow-2xl p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-5 h-[680px] divide-y md:divide-y-0 md:divide-x divide-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-2 p-5 flex flex-col justify-between h-full bg-card/40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "font-display text-base font-bold flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-4 w-4 text-indigo-500" }), "AI Document Generator"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: "Generate compliant contracts & HR documents."
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Document Template"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: selectedTemplateId,
									onValueChange: (val) => {
										setSelectedTemplateId(val);
										setFields({});
										setGeneratedResult(null);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-8 bg-background border-border text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: TEMPLATES.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: t.id,
										children: t.title
									}, t.id)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "For Employee"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: selectedEmployeeId,
									onValueChange: (val) => {
										setSelectedEmployeeId(val);
										setGeneratedResult(null);
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "h-8 bg-background border-border text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Employee" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, {
										className: "max-h-[200px]",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "general",
											children: "General / Standard Template"
										}), employees.map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
											value: emp.id,
											children: [
												emp.fullName,
												" ",
												emp.employeeId ? `(${emp.employeeId})` : ""
											]
										}, emp.id))]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Parameters"
									}), selectedEmployee && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "button",
										variant: "ghost",
										size: "sm",
										onClick: handleAutoFill,
										className: "h-6 text-[10px] text-indigo-500 hover:text-indigo-600 hover:bg-indigo-500/10 px-2 cursor-pointer",
										children: "✨ Auto-Fill Known"
									})]
								}), currentTemplate.fields.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
										className: "text-[11px] text-foreground/80",
										children: [
											f.label,
											" ",
											f.required && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-rose-500",
												children: "*"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: fields[f.key] || "",
										onChange: (e) => setFields({
											...fields,
											[f.key]: e.target.value
										}),
										placeholder: f.placeholder,
										className: "h-8 bg-background border-border text-xs"
									})]
								}, f.key))]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-3 border-t border-border flex flex-col gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: handleGenerate,
							disabled: isGenerating || !areRequiredFieldsFilled,
							className: "w-full h-9 bg-gradient-brand text-brand-foreground hover:opacity-90 font-medium text-xs gap-1.5 cursor-pointer disabled:opacity-50",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-3.5 w-3.5" }), isGenerating ? "Drafting..." : "Generate Document"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => onOpenChange(false),
							className: "h-8 text-xs text-muted-foreground hover:bg-accent/40 cursor-pointer",
							children: "Close"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "md:col-span-3 p-5 flex flex-col justify-between h-full bg-background overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1 flex flex-col min-h-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pb-3 border-b border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs font-bold text-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 text-primary" }), "Live Document Preview"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: `text-[9px] ${generatedResult?.isOfficial ? "border-emerald-500/30 text-emerald-500 bg-emerald-500/5" : "border-amber-500/30 text-amber-500 bg-amber-500/5"}`,
								children: generatedResult?.isOfficial ? "Official Document" : "Draft Preview (Not Official)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 overflow-auto p-1 mt-3",
							children: [
								selectedTemplateId === "relieving" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RelievingLetterPreview, {
									company,
									employee: selectedEmployee,
									fields,
									isOfficial: generatedResult?.isOfficial
								}),
								selectedTemplateId === "offer" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OfferLetterPreview, {
									company,
									employee: selectedEmployee,
									fields,
									isOfficial: generatedResult?.isOfficial
								}),
								selectedTemplateId === "nda" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NDAPreview, {
									company,
									employee: selectedEmployee,
									fields,
									isOfficial: generatedResult?.isOfficial
								}),
								selectedTemplateId === "handbook" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HandbookAcknowledgmentPreview, {
									company,
									employee: selectedEmployee,
									fields,
									isOfficial: generatedResult?.isOfficial
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5 text-muted-foreground" }), !generatedResult?.isOfficial ? "Save to Vault disabled until backend generator is wired." : "Official document ready."]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							disabled: !generatedResult?.isOfficial,
							title: "Save to Vault disabled until official backend endpoint is wired",
							className: "h-8 text-xs cursor-pointer",
							children: "Save to Vault"
						})]
					})]
				})]
			})
		})
	});
};
var ActivityLog = () => {
	const { activities, isLoading, isError } = useDocumentActivity(1, 6);
	if (isError) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-border bg-card/60 backdrop-blur-sm shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "pb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "font-display text-sm font-bold flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-indigo-500" }), "Recent Document Activity"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
				className: "text-[11px] text-muted-foreground",
				children: "Audit trail of document events."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground text-center py-4",
			children: "Activity audit log is not available."
		}) })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "border-border bg-card/60 backdrop-blur-sm shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "pb-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
				className: "font-display text-sm font-bold flex items-center gap-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-indigo-500" }), "Recent Document Activity"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
				className: "text-[11px] text-muted-foreground",
				children: "Live audit trail of document events across the organization."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3 py-2",
			children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 bg-muted/30 rounded animate-pulse" }, i))
		}) : activities.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground text-center py-4",
			children: "No recent document activity."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2.5",
			children: activities.map((act) => {
				const isUpload = act.action.toLowerCase().includes("upload");
				const isVerify = act.action.toLowerCase().includes("verif");
				const isReject = act.action.toLowerCase().includes("reject");
				const isDownload = act.action.toLowerCase().includes("download");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3 text-xs border-b border-border/40 pb-2.5 last:border-b-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `mt-0.5 grid h-5 w-5 place-items-center rounded-full shrink-0 ${isUpload ? "bg-blue-500/10 text-blue-500" : isVerify ? "bg-emerald-500/10 text-emerald-500" : isReject ? "bg-rose-500/10 text-rose-500" : isDownload ? "bg-purple-500/10 text-purple-500" : "bg-amber-500/10 text-amber-500"}`,
							children: isUpload ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-2.5 w-2.5" }) : isVerify ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-2.5 w-2.5" }) : isReject ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-2.5 w-2.5" }) : isDownload ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-2.5 w-2.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-2.5 w-2.5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-semibold",
										children: act.performedBy
									}),
									" ",
									act.action.toLowerCase(),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "font-semibold truncate",
										children: act.documentName
									})
								]
							}), act.details && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground mt-0.5",
								children: act.details
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] text-muted-foreground shrink-0",
							children: new Date(act.timestamp).toLocaleString("en-IN", {
								day: "2-digit",
								month: "short",
								hour: "2-digit",
								minute: "2-digit"
							})
						})
					]
				}, act.id);
			})
		}) })]
	});
};
function DocumentsPage() {
	const userRole = useAurix().user?.role;
	const { employeeProfileId, isEmployeeRole } = useCurrentEmployeeProfile();
	const { categories, categoriesMap, groupedCategories, isLoading: isLoadingCategories, isError: isCategoriesError, refetch: refetchCategories } = useDocumentCategories();
	const { summary, expiringDocs, isLoading: isLoadingSummary, refetch: refetchSummary } = useDocumentSummary();
	const [filters, setFilters] = (0, import_react.useState)({
		tab: "all",
		search: "",
		page: 1,
		limit: 10,
		sortBy: "created_at",
		order: "desc"
	});
	const handleFilterChange = (0, import_react.useCallback)((partial) => {
		setFilters((prev) => ({
			...prev,
			...partial,
			page: partial.page ?? (partial.tab !== void 0 || partial.search !== void 0 ? 1 : prev.page)
		}));
	}, []);
	const handleSortChange = (0, import_react.useCallback)((sortBy) => {
		setFilters((prev) => {
			if (prev.sortBy === sortBy) return {
				...prev,
				order: prev.order === "asc" ? "desc" : "asc",
				page: 1
			};
			return {
				...prev,
				sortBy,
				order: "desc",
				page: 1
			};
		});
	}, []);
	const { items: docs, meta, isLoading: isLoadingDocs, isError: isDocsError, hasPartialError, refetch: refetchDocs } = useDocumentsList({
		filters,
		categoriesMap,
		currentEmployeeProfileId: employeeProfileId,
		isEmployeeRole
	});
	const { verifyDocument, isVerifying, rejectDocument, isRejecting, requestReupload, isRequestingReupload, deleteDocument, isDeleting, uploadEmployeeDocument, uploadCompanyDocument, isUploading } = useDocumentMutations();
	const [uploadOpen, setUploadOpen] = (0, import_react.useState)(false);
	const [generateOpen, setGenerateOpen] = (0, import_react.useState)(false);
	const [previewDoc, setPreviewDoc] = (0, import_react.useState)(null);
	const [rejectDoc, setRejectDoc] = (0, import_react.useState)(null);
	const [reuploadDoc, setReuploadDoc] = (0, import_react.useState)(null);
	const [deleteDoc, setDeleteDoc] = (0, import_react.useState)(null);
	const canUpload = canDo(userRole, "upload");
	const canGenerate = canDo(userRole, "generate");
	const handleDownloadRow = async (doc) => {
		setPreviewDoc(doc);
	};
	const handleVerify = async (doc) => {
		await verifyDocument({ id: doc.id });
		if (previewDoc?.id === doc.id) setPreviewDoc((prev) => prev ? {
			...prev,
			status: "VERIFIED",
			isVerified: true
		} : null);
	};
	const handleConfirmReject = async (id, comments) => {
		await rejectDocument({
			id,
			comments
		});
		if (previewDoc?.id === id) setPreviewDoc((prev) => prev ? {
			...prev,
			status: "REJECTED",
			rejectionReason: comments
		} : null);
	};
	const handleConfirmReupload = async (id, comments) => {
		await requestReupload({
			id,
			comments
		});
		if (previewDoc?.id === id) setPreviewDoc((prev) => prev ? {
			...prev,
			status: "PENDING",
			rejectionReason: comments
		} : null);
	};
	const handleConfirmDelete = async (doc) => {
		await deleteDocument({
			id: doc.id,
			source: doc.source
		});
		if (previewDoc?.id === doc.id) setPreviewDoc(null);
	};
	const handleRetryAll = () => {
		refetchDocs();
		refetchSummary();
		if (isCategoriesError) refetchCategories();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentsToolbar, {
				filters,
				onFilterChange: handleFilterChange,
				onOpenUpload: () => setUploadOpen(true),
				onOpenGenerator: canGenerate ? () => setGenerateOpen(true) : void 0,
				canUpload,
				canGenerate,
				categoriesLoaded: !isLoadingCategories && !isCategoriesError && categories.length > 0,
				pendingCount: summary.pending,
				expiringDocs,
				isEmployeeRole
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentsStatsCards, {
				summary,
				isLoading: isLoadingSummary
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentsTable, {
				items: docs,
				meta,
				filters,
				isLoading: isLoadingDocs,
				isError: isDocsError,
				hasPartialError,
				onRetry: handleRetryAll,
				onPageChange: (newPage) => handleFilterChange({ page: newPage }),
				onSortChange: handleSortChange,
				onSelectPreview: (doc) => setPreviewDoc(doc),
				onSelectDelete: (doc) => setDeleteDoc(doc),
				onDownload: handleDownloadRow,
				userRole,
				currentEmployeeProfileId: employeeProfileId
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActivityLog, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadDocumentDialog, {
				open: uploadOpen,
				onOpenChange: setUploadOpen,
				categories,
				groupedCategories,
				currentEmployeeProfileId: employeeProfileId,
				isEmployeeRole,
				onUploadEmployee: uploadEmployeeDocument,
				onUploadCompany: uploadCompanyDocument,
				isUploading
			}),
			canGenerate && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentGeneratorDialog, {
				open: generateOpen,
				onOpenChange: setGenerateOpen
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentPreviewSheet, {
				doc: previewDoc,
				open: Boolean(previewDoc),
				onOpenChange: (open) => {
					if (!open) setPreviewDoc(null);
				},
				onVerify: handleVerify,
				onRejectPrompt: (doc) => setRejectDoc(doc),
				onRequestReuploadPrompt: (doc) => setReuploadDoc(doc),
				isVerifying,
				userRole
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RejectDialog, {
				open: Boolean(rejectDoc),
				onOpenChange: (open) => {
					if (!open) setRejectDoc(null);
				},
				targetDoc: rejectDoc,
				onConfirmReject: handleConfirmReject,
				isRejecting
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReuploadDialog, {
				open: Boolean(reuploadDoc),
				onOpenChange: (open) => {
					if (!open) setReuploadDoc(null);
				},
				targetDoc: reuploadDoc,
				onConfirmReupload: handleConfirmReupload,
				isRequesting: isRequestingReupload
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteDialog, {
				open: Boolean(deleteDoc),
				onOpenChange: (open) => {
					if (!open) setDeleteDoc(null);
				},
				targetDoc: deleteDoc,
				onConfirmDelete: handleConfirmDelete,
				isDeleting
			})
		]
	});
}
//#endregion
export { DocumentsPage, DocumentsPage as default };
