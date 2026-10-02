import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Jn as Eye, Kn as FileCheckCorner, Ln as FileText, S as Upload, Sr as CircleCheck, Tr as CircleAlert, Wr as CalendarClock, er as Download, k as Trash2, lt as RefreshCw, mr as Clock3, qt as LoaderCircle, vr as CircleX } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { n as CardContent, t as Card } from "./card-CkAivaVl.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJOO1b-0.mjs";
import { t as useDebounce } from "./useDebounce-Duf9-Nss.mjs";
import { t as payrollApi } from "./payrollApi-Q5rJ9by9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmployeeMyDocumentsPage-DKa9rmw8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function isRecord(value) {
	return typeof value === "object" && value !== null;
}
function unwrapData(value) {
	if (!isRecord(value)) return value;
	if ("data" in value && value.data !== void 0) return unwrapData(value.data);
	if ("result" in value && value.result !== void 0) return unwrapData(value.result);
	return value;
}
function asList(value) {
	const data = unwrapData(value);
	if (Array.isArray(data)) return data.filter(isRecord);
	if (!isRecord(data)) return [];
	for (const key of [
		"items",
		"records",
		"results"
	]) if (Array.isArray(data[key])) return data[key].filter(isRecord);
	return [];
}
function asString(value) {
	if (value === null || value === void 0 || value === "") return null;
	return String(value);
}
function asNumber(value) {
	if (value === null || value === void 0 || value === "") return null;
	const result = Number(value);
	return Number.isFinite(result) ? result : null;
}
function tagValue(tags, key) {
	if (!tags) return null;
	return tags.match(new RegExp(`(?:^|[,;\\s])${key}:([^,;\\s]+)`, "i"))?.[1]?.replace(/[-_]/g, " ") ?? null;
}
function mapEmployeeDocument(data) {
	const tags = asString(data.tags);
	const categoryValue = isRecord(data.category) ? data.category.name : data.category_name;
	const typeValue = data.document_type ?? data.type ?? tagValue(tags, "type");
	const fileUrl = asString(data.document_url ?? data.file_path ?? data.file_url ?? data.download_url);
	return {
		id: String(data.id ?? ""),
		employeeId: String(data.employee_id ?? data.employeeId ?? ""),
		categoryId: asString(data.category_id ?? data.categoryId),
		category: asString(categoryValue ?? tagValue(tags, "category")),
		title: asString(data.title ?? data.name),
		type: asString(typeValue),
		description: asString(data.description),
		fileName: asString(data.file_name ?? data.fileName),
		fileSize: asNumber(data.file_size ?? data.fileSize),
		expiryDate: asString(data.expiry_date ?? data.expiryDate),
		uploadedAt: asString(data.created_at ?? data.uploaded_at ?? data.uploadedAt),
		status: String(data.status ?? data.status_field ?? "").toUpperCase(),
		rejectionReason: asString(data.rejection_reason ?? data.rejectionReason ?? data.review_comment ?? data.comments),
		tags,
		fileUrl
	};
}
function mapProvisionSlip(data) {
	return {
		id: String(data.id ?? data.provision_slip_id ?? ""),
		slipNumber: asString(data.provision_slip_number ?? data.slip_number ?? data.reference_number),
		periodName: asString(data.period_name ?? data.periodName ?? data.pay_period),
		employeeName: asString(data.employee_name ?? data.employeeName),
		provisionedAmount: asNumber(data.provisioned_amount ?? data.provisionAmount ?? data.amount),
		generatedAt: asString(data.generated_at ?? data.generatedAt ?? data.created_at),
		status: asString(data.status),
		downloadUrl: asString(data.download_url ?? data.downloadUrl ?? data.document_url)
	};
}
var myDocumentsApi = {
	/**
	* Uses the authenticated request token and scopes the query to the signed-in employee.
	* The API must also enforce employee ownership server-side.
	*/
	async listMyDocuments(employeeId, search) {
		return asList((await apiInstance.get("/documents/employees", {
			params: {
				employee_id: employeeId,
				search: search?.trim() || void 0,
				page: 1,
				limit: 100
			},
			headers: { "Cache-Control": "no-cache" },
			skipCache: true
		})).data).map(mapEmployeeDocument).filter((document) => document.id && document.employeeId === employeeId);
	},
	async listCategories() {
		return asList((await apiInstance.get("/documents/categories", {
			headers: { "Cache-Control": "no-cache" },
			skipCache: true
		})).data).map((cat) => ({
			id: String(cat.id ?? cat.category_id ?? ""),
			name: String(cat.name ?? cat.title ?? "")
		})).filter((cat) => cat.id && cat.name);
	},
	async uploadMyDocument(payload) {
		const form = new FormData();
		form.append("file", payload.file);
		form.append("employee_id", payload.employeeId);
		form.append("category_id", payload.categoryId);
		form.append("title", payload.name);
		form.append("description", payload.description ?? "");
		form.append("expiry_date", payload.expiryDate ?? "");
		form.append("visibility", "PRIVATE");
		form.append("status_field", "PENDING");
		form.append("tags", `employee-self-service,type:${payload.type},category:${payload.categoryId}`);
		await apiInstance.post("/documents/employees", form, { headers: { "Content-Type": "multipart/form-data" } });
	},
	async reuploadMyDocument(documentId, payload) {
		const form = new FormData();
		form.append("file", payload.file);
		form.append("title", payload.name);
		form.append("description", payload.description ?? "");
		form.append("expiry_date", payload.expiryDate ?? "");
		form.append("status_field", "PENDING");
		form.append("tags", `employee-self-service,type:${payload.type}`);
		await apiInstance.put(`/documents/employees/${documentId}`, form, { headers: { "Content-Type": "multipart/form-data" } });
	},
	async deleteMyDocument(documentId) {
		await apiInstance.delete(`/documents/employees/${documentId}`);
	},
	async downloadMyDocument(documentId) {
		return (await apiInstance.get(`/documents/employees/${documentId}/download`, {
			responseType: "blob",
			headers: { Accept: "application/octet-stream" }
		})).data;
	},
	/** Reuses the authenticated payroll history endpoint; never synthesizes a salary-slip row. */
	async listMySalarySlips() {
		return (await payrollApi.getMyPayslips({ limit: 100 })).items.map((item) => ({
			id: item.id,
			runId: item.runId ?? null,
			employeeId: item.employeeId ?? null,
			employeeName: item.employeeName ?? null,
			periodName: item.periodName ?? null,
			payslipNumber: item.payslipNumber ?? null,
			grossSalary: item.grossEarnings ?? null,
			deductions: item.totalDeductions ?? null,
			netSalary: item.netPay ?? null,
			generatedDate: item.finalizedAt ?? null,
			status: item.status ?? "",
			hasDocument: item.hasDocument === true
		}));
	},
	async downloadMySalarySlip(runId, employeeId) {
		return payrollApi.downloadPayslip(runId, employeeId);
	},
	/** The payroll service scopes this resource from the authenticated session. */
	async listMyProvisionSlips(_employeeId) {
		return asList((await apiInstance.get("/api/v2/payroll/my-provision-slips", {
			headers: { "Cache-Control": "no-cache" },
			skipCache: true
		})).data).map(mapProvisionSlip).filter((slip) => slip.id);
	},
	async downloadMyProvisionSlip(slip) {
		if (slip.downloadUrl) return (await apiInstance.get(slip.downloadUrl, { responseType: "blob" })).data;
		return (await apiInstance.get(`/api/v2/payroll/provision-slips/${slip.id}/pdf`, { responseType: "blob" })).data;
	}
};
var CATEGORY_OPTIONS = [
	"Identity",
	"Address",
	"Education",
	"Bank",
	"Tax",
	"Employment",
	"Other"
];
var TABS = [
	{
		id: "all",
		label: "All My Documents"
	},
	{
		id: "employment",
		label: "Employment"
	},
	{
		id: "salary-slips",
		label: "Salary Slips"
	},
	{
		id: "provision-slips",
		label: "Provision Slips"
	},
	{
		id: "pending",
		label: "Pending"
	},
	{
		id: "verified",
		label: "Verified"
	},
	{
		id: "rejected",
		label: "Rejected"
	}
];
function formatDate(value) {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
function formatCurrency(value) {
	if (value === null || value === void 0 || !Number.isFinite(value)) return "—";
	return new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0
	}).format(value);
}
function errorMessage(error, fallback) {
	const source = error;
	if (source.response?.status === 403) return "Permission denied. You can only access your own documents.";
	return source.response?.data?.message || source.message || fallback;
}
function isExpiringSoon(expiryDate) {
	if (!expiryDate) return false;
	const end = new Date(expiryDate);
	if (Number.isNaN(end.getTime())) return false;
	const remainingDays = (end.getTime() - Date.now()) / (1e3 * 60 * 60 * 24);
	return remainingDays >= 0 && remainingDays <= 30;
}
function statusClass(status) {
	const normalized = status.toLowerCase();
	if (normalized.includes("verified") || normalized.includes("approved")) return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300";
	if (normalized.includes("rejected")) return "bg-rose-500/15 text-rose-700 dark:text-rose-300";
	return "bg-amber-500/15 text-amber-700 dark:text-amber-300";
}
function statusLabel(status) {
	return status ? status.replace(/[_-]/g, " ") : "Not available";
}
function categoryMatches(categoryName, requested) {
	const category = categoryName.toLowerCase();
	return {
		Identity: [
			"identity",
			"employee document",
			"personal"
		],
		Address: ["address", "residence"],
		Education: ["education", "academic"],
		Bank: ["bank", "financial"],
		Tax: ["tax", "pan"],
		Employment: [
			"employment",
			"offer",
			"experience"
		],
		Other: ["other", "general"]
	}[requested].some((term) => category.includes(term));
}
function documentCategory(document, categories) {
	return categories.find((category) => category.id === document.categoryId)?.name || document.category || "Uncategorised";
}
function downloadBlob(blob, filename, openInNewTab = false) {
	const url = URL.createObjectURL(blob);
	if (openInNewTab) {
		const anchor = window.document.createElement("a");
		anchor.href = url;
		anchor.target = "_blank";
		anchor.rel = "noopener noreferrer";
		window.document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
	} else {
		const anchor = window.document.createElement("a");
		anchor.href = url;
		anchor.download = filename;
		window.document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
	}
	window.setTimeout(() => URL.revokeObjectURL(url), 6e4);
}
function EmployeeMyDocumentsPage() {
	const workspace = useAurix();
	const employeeId = String(workspace.user?.employeeId || workspace.user?.id || "");
	const [documents, setDocuments] = (0, import_react.useState)([]);
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [payslips, setPayslips] = (0, import_react.useState)([]);
	const [provisionSlips, setProvisionSlips] = (0, import_react.useState)([]);
	const [activeTab, setActiveTab] = (0, import_react.useState)("all");
	const [search, setSearch] = (0, import_react.useState)("");
	const searchQuery = useDebounce(search, 300);
	const [isLoadingDocuments, setIsLoadingDocuments] = (0, import_react.useState)(true);
	const [isLoadingPayroll, setIsLoadingPayroll] = (0, import_react.useState)(true);
	const [isLoadingProvision, setIsLoadingProvision] = (0, import_react.useState)(true);
	const [documentsError, setDocumentsError] = (0, import_react.useState)(null);
	const [payslipsError, setPayslipsError] = (0, import_react.useState)(null);
	const [provisionError, setProvisionError] = (0, import_react.useState)(null);
	const [uploadOpen, setUploadOpen] = (0, import_react.useState)(false);
	const [reuploadTarget, setReuploadTarget] = (0, import_react.useState)(null);
	const [isSaving, setIsSaving] = (0, import_react.useState)(false);
	const [busyDocumentId, setBusyDocumentId] = (0, import_react.useState)(null);
	const [busyPayslipId, setBusyPayslipId] = (0, import_react.useState)(null);
	const [busyProvisionId, setBusyProvisionId] = (0, import_react.useState)(null);
	const loadDocuments = (0, import_react.useCallback)(async () => {
		if (!employeeId) {
			setDocuments([]);
			setDocumentsError("Unable to identify the authenticated employee.");
			setIsLoadingDocuments(false);
			return;
		}
		setIsLoadingDocuments(true);
		setDocumentsError(null);
		try {
			setDocuments(await myDocumentsApi.listMyDocuments(employeeId, searchQuery));
		} catch (error) {
			setDocuments([]);
			setDocumentsError(errorMessage(error, "Unable to load your documents. Please try again."));
		} finally {
			setIsLoadingDocuments(false);
		}
	}, [employeeId, searchQuery]);
	const loadCategories = (0, import_react.useCallback)(async () => {
		try {
			setCategories(await myDocumentsApi.listCategories());
		} catch (error) {
			setCategories([]);
			console.error("Unable to load document categories", error);
		}
	}, []);
	const loadPayrollDocuments = (0, import_react.useCallback)(async () => {
		setIsLoadingPayroll(true);
		setPayslipsError(null);
		try {
			setPayslips((await payrollApi.getMyPayslips({ limit: 100 })).items);
		} catch (error) {
			setPayslips([]);
			setPayslipsError(errorMessage(error, "Unable to load your salary slips. Please try again."));
		} finally {
			setIsLoadingPayroll(false);
		}
	}, []);
	const loadProvisionSlips = (0, import_react.useCallback)(async () => {
		setIsLoadingProvision(true);
		setProvisionError(null);
		try {
			setProvisionSlips(await myDocumentsApi.listMyProvisionSlips());
		} catch (error) {
			setProvisionSlips([]);
			setProvisionError(errorMessage(error, "Unable to load your provision slips. Please try again."));
		} finally {
			setIsLoadingProvision(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		loadDocuments();
	}, [loadDocuments]);
	(0, import_react.useEffect)(() => {
		loadCategories();
		loadPayrollDocuments();
		loadProvisionSlips();
	}, [
		loadCategories,
		loadPayrollDocuments,
		loadProvisionSlips
	]);
	const stats = (0, import_react.useMemo)(() => ({
		total: documents.length,
		verified: documents.filter((document) => document.status === "VERIFIED").length,
		pending: documents.filter((document) => document.status === "PENDING").length,
		rejected: documents.filter((document) => document.status === "REJECTED").length,
		expiring: documents.filter((document) => isExpiringSoon(document.expiryDate)).length
	}), [documents]);
	const visibleDocuments = (0, import_react.useMemo)(() => {
		return documents.filter((document) => {
			const category = documentCategory(document, categories);
			const normalisedStatus = document.status.toLowerCase();
			if (activeTab === "employment" && !category.toLowerCase().includes("employment")) return false;
			if (activeTab === "pending" && !normalisedStatus.includes("pending")) return false;
			if (activeTab === "verified" && !normalisedStatus.includes("verified")) return false;
			if (activeTab === "rejected" && !normalisedStatus.includes("rejected")) return false;
			const query = search.trim().toLowerCase();
			return !query || [
				document.title,
				category,
				document.type
			].some((value) => value?.toLowerCase().includes(query));
		});
	}, [
		activeTab,
		categories,
		documents,
		search
	]);
	const availableCategoryId = (category) => {
		return categories.find((entry) => categoryMatches(entry.name, category))?.id || "";
	};
	const handleDocumentFile = async (document, action) => {
		setBusyDocumentId(document.id);
		try {
			downloadBlob(await myDocumentsApi.downloadMyDocument(document.id), document.fileName || document.title || "document", action === "view");
		} catch (error) {
			toast.error(errorMessage(error, `Unable to ${action} this document. Please try again.`));
		} finally {
			setBusyDocumentId(null);
		}
	};
	const handleDelete = async (document) => {
		if (!window.confirm(`Delete “${document.title || document.fileName || "this document"}”?`)) return;
		setBusyDocumentId(document.id);
		try {
			await myDocumentsApi.deleteMyDocument(document.id);
			toast.success("Document deleted.");
			await loadDocuments();
		} catch (error) {
			toast.error(errorMessage(error, "You do not have permission to delete this document."));
		} finally {
			setBusyDocumentId(null);
		}
	};
	const handlePayslipFile = async (payslip, action) => {
		setBusyPayslipId(payslip.id);
		try {
			downloadBlob((await apiInstance.get(`/api/v2/payroll/payslips/${payslip.id}/pdf`, { responseType: "blob" })).data, `payslip_${payslip.payslipNumber || payslip.id}.pdf`, action === "view");
		} catch (error) {
			toast.error(errorMessage(error, `Unable to ${action} this salary slip. Please try again.`));
		} finally {
			setBusyPayslipId(null);
		}
	};
	const handleProvisionFile = async (slip, action) => {
		setBusyProvisionId(slip.id);
		try {
			downloadBlob(await myDocumentsApi.downloadMyProvisionSlip(slip), `provision-slip_${slip.slipNumber || slip.id}.pdf`, action === "view");
		} catch (error) {
			toast.error(errorMessage(error, `Unable to ${action} this provision slip. Please try again.`));
		} finally {
			setBusyProvisionId(null);
		}
	};
	const handleUpload = async (values, isReupload) => {
		if (!employeeId) {
			toast.error("Unable to identify the authenticated employee.");
			return;
		}
		if (!values.file) {
			toast.error("Choose a file to upload.");
			return;
		}
		const categoryId = availableCategoryId(values.category) || values.category.toLowerCase();
		setIsSaving(true);
		try {
			if (isReupload && reuploadTarget) {
				await myDocumentsApi.reuploadMyDocument(reuploadTarget.id, {
					name: values.name,
					type: values.type,
					description: values.description,
					expiryDate: values.expiryDate,
					file: values.file
				});
				toast.success("Document re-uploaded for verification.");
				setReuploadTarget(null);
			} else {
				await myDocumentsApi.uploadMyDocument({
					employeeId,
					categoryId,
					name: values.name,
					type: values.type,
					description: values.description,
					expiryDate: values.expiryDate,
					file: values.file
				});
				toast.success("Document uploaded and sent for verification.");
				setUploadOpen(false);
			}
			await loadDocuments();
		} catch (error) {
			toast.error(errorMessage(error, "Unable to upload your document. Please try again."));
		} finally {
			setIsSaving(false);
		}
	};
	const isDocumentTab = activeTab !== "salary-slips" && activeTab !== "provision-slips";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-7xl space-y-6 py-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => setUploadOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-4 w-4" }), " Upload Document"]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-2 xl:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Total Documents",
						value: stats.total,
						icon: FileText,
						tone: "blue"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Verified Documents",
						value: stats.verified,
						icon: CircleCheck,
						tone: "emerald"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Pending Verification",
						value: stats.pending,
						icon: Clock3,
						tone: "amber"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Rejected Documents",
						value: stats.rejected,
						icon: CircleX,
						tone: "rose"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SummaryCard, {
						label: "Expiring Soon",
						value: stats.expiring,
						icon: CalendarClock,
						tone: "violet"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto border-b border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-w-max gap-1",
					children: TABS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setActiveTab(tab.id),
						className: `border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${activeTab === tab.id ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
						children: tab.label
					}, tab.id))
				})
			}),
			isDocumentTab ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: search,
					onChange: (event) => setSearch(event.target.value),
					placeholder: "Search by document name, category, or type",
					className: "pl-9"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentsTable, {
				documents: visibleDocuments,
				categories,
				isLoading: isLoadingDocuments,
				error: documentsError,
				filtered: activeTab !== "all" || Boolean(search.trim()),
				busyDocumentId,
				onRetry: () => void loadDocuments(),
				onView: (document) => void handleDocumentFile(document, "view"),
				onDownload: (document) => void handleDocumentFile(document, "download"),
				onReupload: setReuploadTarget,
				onDelete: (document) => void handleDelete(document)
			})] }) : null,
			activeTab === "salary-slips" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SalarySlipsTable, {
				items: payslips,
				isLoading: isLoadingPayroll,
				error: payslipsError,
				busyId: busyPayslipId,
				onRetry: () => void loadPayrollDocuments(),
				onFile: handlePayslipFile
			}) : null,
			activeTab === "provision-slips" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProvisionSlipsTable, {
				items: provisionSlips,
				isLoading: isLoadingProvision,
				error: provisionError,
				busyId: busyProvisionId,
				onRetry: () => void loadProvisionSlips(),
				onFile: handleProvisionFile
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UploadDocumentDialog, {
				open: uploadOpen || Boolean(reuploadTarget),
				onOpenChange: (open) => {
					if (!open) {
						setUploadOpen(false);
						setReuploadTarget(null);
					}
				},
				categories,
				reuploadTarget,
				saving: isSaving,
				onSubmit: handleUpload
			})
		]
	});
}
function SummaryCard({ label, value, icon: Icon, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		className: "bg-card/70",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "flex items-start justify-between p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium uppercase tracking-wide text-muted-foreground",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-2xl font-semibold tracking-tight",
				children: value
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `rounded-xl p-2.5 ${{
					blue: "bg-sky-500/10 text-sky-600 dark:text-sky-300",
					emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
					amber: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
					rose: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
					violet: "bg-violet-500/10 text-violet-700 dark:text-violet-300"
				}[tone]}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
			})]
		})
	});
}
function DocumentsTable({ documents, categories, isLoading, error, filtered, busyDocumentId, onRetry, onView, onDownload, onReupload, onDelete }) {
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		message: error,
		onRetry
	});
	if (!documents.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: filtered ? "No documents found" : "No documents yet",
		description: filtered ? "No documents match this filter." : "Upload your employment documents to keep your records up to date."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-xl border border-border bg-card/60",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Document" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Category" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Type" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Uploaded Date" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Actions"
			})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: documents.map((document) => {
			const isRejected = document.status.toLowerCase().includes("rejected");
			const isBusy = busyDocumentId === document.id;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
					className: "min-w-48",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: document.title || document.fileName || "Untitled document"
					}), document.expiryDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `mt-1 text-xs ${isExpiringSoon(document.expiryDate) ? "text-amber-600 dark:text-amber-300" : "text-muted-foreground"}`,
						children: [
							"Expires: ",
							formatDate(document.expiryDate),
							isExpiringSoon(document.expiryDate) ? " · Expiring soon" : ""
						]
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: documentCategory(document, categories) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: document.type || "—" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(document.uploadedAt) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusClass(document.status)}`,
					children: statusLabel(document.status)
				}), isRejected && document.rejectionReason ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 max-w-56 text-xs text-rose-700 dark:text-rose-300",
					children: ["Reason: ", document.rejectionReason]
				}) : null] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							title: "View",
							disabled: isBusy,
							onClick: () => onView(document),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							title: "Download",
							disabled: isBusy,
							onClick: () => onDownload(document),
							children: isBusy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" })
						}),
						isRejected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							disabled: isBusy,
							onClick: () => onReupload(document),
							children: "Re-upload"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon",
							variant: "ghost",
							title: "Delete (subject to your document policy)",
							disabled: isBusy,
							onClick: () => onDelete(document),
							className: "text-muted-foreground hover:text-destructive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})
					]
				}) })
			] }, document.id);
		}) })] })
	});
}
function SalarySlipsTable({ items, isLoading, error, busyId, onRetry, onFile }) {
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		message: error,
		onRetry
	});
	if (!items.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No Salary Slips Available",
		description: "Your salary slips will appear here once they are generated."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-xl border border-border bg-card/60",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Pay Period / Month" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Payslip Number" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Gross Salary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Deductions" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Net Salary" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Generated Date" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Actions"
			})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "font-medium",
				children: item.periodName || "—"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: item.payslipNumber || "—" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatCurrency(item.grossEarnings) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatCurrency(item.totalDeductions) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "font-medium",
				children: formatCurrency(item.netPay)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(item.finalizedAt) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusClass(item.status || "")}`,
				children: statusLabel(item.status || "")
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					title: "View",
					disabled: busyId === item.id,
					onClick: () => onFile(item, "view"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					title: "Download",
					disabled: busyId === item.id,
					onClick: () => onFile(item, "download"),
					children: busyId === item.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" })
				})]
			}) })
		] }, item.id)) })] })
	});
}
function ProvisionSlipsTable({ items, isLoading, error, busyId, onRetry, onFile }) {
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadingState, {});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
		message: error,
		onRetry
	});
	if (!items.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
		title: "No Provision Slips Available",
		description: "Your provision slips will appear here once they are generated."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-hidden rounded-xl border border-border bg-card/60",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Provision Slip Number" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Pay Period / Month" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Employee Name" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Provisioned Amount" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Generated Date" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { children: "Status" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
				className: "text-right",
				children: "Actions"
			})
		] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
				className: "font-medium",
				children: item.slipNumber || "—"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: item.periodName || "—" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: item.employeeName || "—" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatCurrency(item.provisionedAmount) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: formatDate(item.generatedAt) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusClass(item.status || "")}`,
				children: statusLabel(item.status || "")
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					title: "View",
					disabled: busyId === item.id,
					onClick: () => onFile(item, "view"),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "icon",
					variant: "ghost",
					title: "Download",
					disabled: busyId === item.id,
					onClick: () => onFile(item, "download"),
					children: busyId === item.id ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" })
				})]
			}) })
		] }, item.id)) })] })
	});
}
function UploadDocumentDialog({ open, onOpenChange, categories, reuploadTarget, saving, onSubmit }) {
	const [values, setValues] = (0, import_react.useState)({
		name: "",
		category: "Identity",
		type: "",
		description: "",
		expiryDate: "",
		file: null
	});
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const targetCategory = reuploadTarget ? documentCategory(reuploadTarget, categories) : "Identity";
		const selectedCategory = CATEGORY_OPTIONS.find((category) => categoryMatches(targetCategory, category)) || "Identity";
		setValues({
			name: reuploadTarget?.title || reuploadTarget?.fileName || "",
			category: selectedCategory,
			type: reuploadTarget?.type || "",
			description: reuploadTarget?.description || "",
			expiryDate: reuploadTarget?.expiryDate || "",
			file: null
		});
	}, [
		open,
		reuploadTarget,
		categories
	]);
	const reupload = Boolean(reuploadTarget);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-h-[90vh] overflow-y-auto sm:max-w-xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: reupload ? "Re-upload Document" : "Upload Document" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: reupload ? "Replace the rejected file. It will be sent for verification again." : "Upload a personal employment document for verification." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-4",
				onSubmit: (event) => {
					event.preventDefault();
					onSubmit(values, reupload);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "document-name",
								children: "Document Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "document-name",
								value: values.name,
								required: true,
								onChange: (event) => setValues({
									...values,
									name: event.target.value
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "document-type",
								children: "Document Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "document-type",
								value: values.type,
								required: true,
								placeholder: "e.g. Passport",
								onChange: (event) => setValues({
									...values,
									type: event.target.value
								})
							})]
						})]
					}),
					!reupload ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Document Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: values.category,
							onValueChange: (category) => setValues({
								...values,
								category
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATEGORY_OPTIONS.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: category,
								children: category
							}, category)) })]
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "document-file",
								children: "File Upload"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "document-file",
								type: "file",
								required: true,
								onChange: (event) => setValues({
									...values,
									file: event.target.files?.[0] || null
								})
							}),
							values.file ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted-foreground",
								children: ["Selected: ", values.file.name]
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							htmlFor: "document-description",
							children: ["Description ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "(optional)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							id: "document-description",
							value: values.description,
							onChange: (event) => setValues({
								...values,
								description: event.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
							htmlFor: "expiry-date",
							children: ["Expiry Date ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: "(where applicable)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "expiry-date",
							type: "date",
							value: values.expiryDate,
							onChange: (event) => setValues({
								...values,
								expiryDate: event.target.value
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => onOpenChange(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: saving,
						children: [saving ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mr-2 h-4 w-4" }), reupload ? "Re-upload" : "Upload Document"]
					})] })
				]
			})]
		})
	});
}
function LoadingState() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-52 items-center justify-center rounded-xl border border-border bg-card/60 text-sm text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }), " Loading your documents…"]
	});
}
function ErrorState({ message, onRetry }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-destructive/30 bg-destructive/5 p-8 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mx-auto h-8 w-8 text-destructive" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 font-semibold",
				children: "Unable to load your documents"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-1 max-w-lg text-sm text-muted-foreground",
				children: message
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-4",
				variant: "outline",
				size: "sm",
				onClick: onRetry,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-2 h-4 w-4" }), "Try again"]
			})
		]
	});
}
function EmptyState({ title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-dashed border-border bg-card/40 p-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheckCorner, { className: "mx-auto h-9 w-9 text-muted-foreground" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-3 font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-1 max-w-md text-sm text-muted-foreground",
				children: description
			})
		]
	});
}
//#endregion
export { EmployeeMyDocumentsPage, EmployeeMyDocumentsPage as default };
