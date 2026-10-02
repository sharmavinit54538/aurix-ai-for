import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Br as Calendar, Ln as FileText, Rn as FileSpreadsheet, Tr as CircleAlert, er as Download, jn as Funnel, lt as RefreshCw } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { n as AlertDescription, r as AlertTitle, t as Alert } from "./alert-B82KXmg0.mjs";
import { i as formatINR, n as formatDate } from "./format-8CvzIoFt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PayrollReportsPage-DqmcuRyD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Payroll Reports & Exports API Service.
*
* Implements backend-driven reporting and file export pipelines.
* Zero mock data: all rows and figures must come from backend endpoints.
*/
var reportsApi = {
	/**
	* Fetch report data with filters and server-side pagination.
	*/
	async getReportData(reportKey, filters, pagination) {
		return (await apiInstance.get(`/api/v2/payroll/reports/${reportKey}`, {
			params: {
				...filters,
				...pagination
			},
			headers: { "Cache-Control": "no-store" }
		})).data.data;
	},
	/**
	* Request backend generation of report export file (CSV or XLSX).
	*/
	async requestReportExport(reportKey, format, filters) {
		return (await apiInstance.post(`/api/v2/payroll/reports/${reportKey}/export`, {
			format,
			filters
		}, { headers: { "Cache-Control": "no-store" } })).data.data;
	},
	/**
	* Download the generated report export file as Blob.
	*/
	async downloadReportExport(exportId) {
		return (await apiInstance.get(`/api/v2/payroll/reports/exports/${exportId}/download`, {
			responseType: "blob",
			headers: { "Cache-Control": "no-store" }
		})).data;
	},
	/**
	* Fetch Double-Entry Accounting Journal for a payroll run.
	*/
	async getAccountingJournal(periodId) {
		return (await apiInstance.get("/api/v2/payroll/accounting-export", {
			params: { periodId },
			headers: { "Cache-Control": "no-store" }
		})).data.data;
	}
};
var REPORT_REGISTRY = {
	payroll_register: {
		key: "payroll_register",
		title: "Payroll Register",
		description: "Complete employee-level salary calculation ledger for the selected cycle.",
		category: "operational",
		requiredPermission: "payroll.reports",
		allowedFormats: ["csv", "xlsx"],
		supportedFilters: [
			"periodId",
			"department",
			"location",
			"employmentType"
		],
		columns: [
			{
				key: "employeeCode",
				label: "Emp Code"
			},
			{
				key: "employeeName",
				label: "Employee Name"
			},
			{
				key: "department",
				label: "Department"
			},
			{
				key: "basicPay",
				label: "Basic",
				align: "right",
				isCurrency: true
			},
			{
				key: "hra",
				label: "HRA",
				align: "right",
				isCurrency: true
			},
			{
				key: "allowances",
				label: "Allowances",
				align: "right",
				isCurrency: true
			},
			{
				key: "grossEarnings",
				label: "Gross Earnings",
				align: "right",
				isCurrency: true
			},
			{
				key: "pfDeduction",
				label: "PF",
				align: "right",
				isCurrency: true
			},
			{
				key: "esiDeduction",
				label: "ESI",
				align: "right",
				isCurrency: true
			},
			{
				key: "ptDeduction",
				label: "PT",
				align: "right",
				isCurrency: true
			},
			{
				key: "tdsDeduction",
				label: "TDS",
				align: "right",
				isCurrency: true
			},
			{
				key: "totalDeductions",
				label: "Total Deductions",
				align: "right",
				isCurrency: true
			},
			{
				key: "netPay",
				label: "Net Pay",
				align: "right",
				isCurrency: true
			}
		]
	},
	salary_statement: {
		key: "salary_statement",
		title: "Salary Statement",
		description: "Official summary statement of earnings and statutory withholdings.",
		category: "financial",
		requiredPermission: "payroll.reports",
		allowedFormats: ["csv", "xlsx"],
		supportedFilters: [
			"periodId",
			"financialYear",
			"department"
		],
		columns: [
			{
				key: "employeeCode",
				label: "Emp Code"
			},
			{
				key: "employeeName",
				label: "Employee Name"
			},
			{
				key: "designation",
				label: "Designation"
			},
			{
				key: "bankName",
				label: "Bank"
			},
			{
				key: "accountNumberMasked",
				label: "Account No.",
				isSensitive: true
			},
			{
				key: "grossPay",
				label: "Gross Pay",
				align: "right",
				isCurrency: true
			},
			{
				key: "deductions",
				label: "Total Deductions",
				align: "right",
				isCurrency: true
			},
			{
				key: "netPayable",
				label: "Net Payable",
				align: "right",
				isCurrency: true
			}
		]
	},
	department_payroll: {
		key: "department_payroll",
		title: "Department-wise Payroll",
		description: "Aggregated compensation costs and statutory burden grouped by organizational unit.",
		category: "financial",
		requiredPermission: "payroll.reports",
		allowedFormats: ["csv", "xlsx"],
		supportedFilters: ["periodId", "financialYear"],
		columns: [
			{
				key: "departmentName",
				label: "Department"
			},
			{
				key: "headcount",
				label: "Headcount",
				align: "right"
			},
			{
				key: "totalGross",
				label: "Total Gross",
				align: "right",
				isCurrency: true
			},
			{
				key: "totalDeductions",
				label: "Total Deductions",
				align: "right",
				isCurrency: true
			},
			{
				key: "totalNet",
				label: "Total Net",
				align: "right",
				isCurrency: true
			},
			{
				key: "employerCost",
				label: "Total CTC Burden",
				align: "right",
				isCurrency: true
			}
		]
	},
	cost_center_payroll: {
		key: "cost_center_payroll",
		title: "Cost Center-wise Payroll",
		description: "Financial journal allocation breakdown by accounting cost center codes.",
		category: "financial",
		requiredPermission: "payroll.reports",
		allowedFormats: ["csv", "xlsx"],
		supportedFilters: [
			"periodId",
			"costCenter",
			"financialYear"
		],
		columns: [
			{
				key: "costCenterCode",
				label: "Cost Center Code"
			},
			{
				key: "costCenterName",
				label: "Cost Center Name"
			},
			{
				key: "employeeCount",
				label: "Employees",
				align: "right"
			},
			{
				key: "directSalary",
				label: "Direct Salary",
				align: "right",
				isCurrency: true
			},
			{
				key: "benefitsCost",
				label: "Benefits & Perks",
				align: "right",
				isCurrency: true
			},
			{
				key: "allocatedTotal",
				label: "Allocated Total",
				align: "right",
				isCurrency: true
			}
		]
	},
	bank_advice: {
		key: "bank_advice",
		title: "Bank Advice Report",
		description: "Schedule of bank transfers detailing beneficiary accounts, IFSC, and net disbursement.",
		category: "operational",
		requiredPermission: "payroll.disburse",
		allowedFormats: ["csv", "xlsx"],
		supportedFilters: ["periodId", "paymentStatus"],
		columns: [
			{
				key: "employeeCode",
				label: "Emp Code"
			},
			{
				key: "beneficiaryName",
				label: "Beneficiary Name"
			},
			{
				key: "bankName",
				label: "Bank Name"
			},
			{
				key: "accountNumberMasked",
				label: "Account No.",
				isSensitive: true
			},
			{
				key: "ifscCode",
				label: "IFSC Code"
			},
			{
				key: "amount",
				label: "Disbursement Amount",
				align: "right",
				isCurrency: true
			},
			{
				key: "paymentStatus",
				label: "Status"
			},
			{
				key: "utr",
				label: "UTR Number"
			}
		]
	},
	payroll_variance: {
		key: "payroll_variance",
		title: "Payroll Variance Report",
		description: "Comparative delta analysis between current month and prior cycle figures.",
		category: "variance",
		requiredPermission: "payroll.reports",
		allowedFormats: ["csv", "xlsx"],
		supportedFilters: ["periodId", "department"],
		columns: [
			{
				key: "componentName",
				label: "Pay Component"
			},
			{
				key: "previousMonth",
				label: "Previous Cycle",
				align: "right",
				isCurrency: true
			},
			{
				key: "currentMonth",
				label: "Current Cycle",
				align: "right",
				isCurrency: true
			},
			{
				key: "varianceAmount",
				label: "Variance Amount",
				align: "right",
				isCurrency: true
			},
			{
				key: "variancePercentage",
				label: "Variance %",
				align: "right"
			},
			{
				key: "explanation",
				label: "Variance Drivers"
			}
		]
	},
	headcount_report: {
		key: "headcount_report",
		title: "Headcount Report",
		description: "Reconciliation of new joiners, active workforce, exits, and paid employees.",
		category: "operational",
		requiredPermission: "payroll.reports",
		allowedFormats: ["csv", "xlsx"],
		supportedFilters: [
			"periodId",
			"department",
			"location"
		],
		columns: [
			{
				key: "department",
				label: "Department"
			},
			{
				key: "openingCount",
				label: "Opening Count",
				align: "right"
			},
			{
				key: "joinersCount",
				label: "New Joiners",
				align: "right"
			},
			{
				key: "exitsCount",
				label: "Exits",
				align: "right"
			},
			{
				key: "closingCount",
				label: "Closing Count",
				align: "right"
			},
			{
				key: "processedInPayroll",
				label: "Paid Headcount",
				align: "right"
			}
		]
	},
	ytd_payroll: {
		key: "ytd_payroll",
		title: "YTD Payroll Summary",
		description: "Year-to-date cumulative earnings, tax withholdings, and statutory deductions.",
		category: "compliance",
		requiredPermission: "payroll.reports",
		allowedFormats: ["csv", "xlsx"],
		supportedFilters: [
			"financialYear",
			"employeeId",
			"department"
		],
		columns: [
			{
				key: "employeeCode",
				label: "Emp Code"
			},
			{
				key: "employeeName",
				label: "Employee Name"
			},
			{
				key: "ytdGross",
				label: "YTD Gross",
				align: "right",
				isCurrency: true
			},
			{
				key: "ytdPf",
				label: "YTD PF",
				align: "right",
				isCurrency: true
			},
			{
				key: "ytdTds",
				label: "YTD TDS",
				align: "right",
				isCurrency: true
			},
			{
				key: "ytdNet",
				label: "YTD Net Paid",
				align: "right",
				isCurrency: true
			}
		]
	},
	accounting_export: {
		key: "accounting_export",
		title: "Accounting Journal Export",
		description: "General ledger double-entry journal balancing debit and credit allocations.",
		category: "financial",
		requiredPermission: "payroll.reports",
		allowedFormats: ["csv", "xlsx"],
		supportedFilters: ["periodId"],
		columns: [
			{
				key: "accountCode",
				label: "GL Account Code"
			},
			{
				key: "accountName",
				label: "GL Account Name"
			},
			{
				key: "accountType",
				label: "Type"
			},
			{
				key: "costCenter",
				label: "Cost Center"
			},
			{
				key: "debitFormatted",
				label: "Debit (INR)",
				align: "right"
			},
			{
				key: "creditFormatted",
				label: "Credit (INR)",
				align: "right"
			},
			{
				key: "referenceDescription",
				label: "Description"
			}
		]
	}
};
function PayrollReportsPage() {
	const [selectedReportKey, setSelectedReportKey] = (0, import_react.useState)("payroll_register");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [backendUnavailable, setBackendUnavailable] = (0, import_react.useState)(false);
	const [reportData, setReportData] = (0, import_react.useState)(null);
	const [accountingData, setAccountingData] = (0, import_react.useState)(null);
	const [periodId, setPeriodId] = (0, import_react.useState)("");
	const [financialYear, setFinancialYear] = (0, import_react.useState)("2026-2027");
	const [department, setDepartment] = (0, import_react.useState)("");
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const [exportingFormat, setExportingFormat] = (0, import_react.useState)(null);
	const currentReportDef = REPORT_REGISTRY[selectedReportKey];
	const loadReport = async () => {
		setLoading(true);
		setBackendUnavailable(false);
		try {
			if (selectedReportKey === "accounting_export") setAccountingData(await reportsApi.getAccountingJournal(periodId || void 0));
			else {
				const filters = {
					periodId: periodId || void 0,
					financialYear: financialYear || void 0,
					department: department || void 0
				};
				setReportData(await reportsApi.getReportData(selectedReportKey, filters, {
					page,
					limit: 25
				}));
			}
		} catch (err) {
			if (err?.response?.status === 404 || err?.response?.status === 501) setBackendUnavailable(true);
			else toast.error(`Failed to load ${currentReportDef.title}`);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadReport();
	}, [selectedReportKey, page]);
	const handleExport = async (format) => {
		if (exportingFormat) return;
		setExportingFormat(format);
		try {
			const exportMeta = await reportsApi.requestReportExport(selectedReportKey, format, {
				periodId: periodId || void 0,
				financialYear: financialYear || void 0,
				department: department || void 0
			});
			const blob = await reportsApi.downloadReportExport(exportMeta.exportId);
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = exportMeta.fileName || `${selectedReportKey}_${financialYear}.${format}`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
			toast.success(`${currentReportDef.title} exported as ${format.toUpperCase()}`);
		} catch (err) {
			if (err?.response?.status === 404 || err?.response?.status === 501) {
				setBackendUnavailable(true);
				toast.error("Export service unavailable — backend pending");
			} else toast.error("Failed to generate export file");
		} finally {
			setExportingFormat(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold tracking-tight text-foreground",
						children: "Payroll Reports & Exports"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-xs font-semibold border-primary/30 bg-primary/10 text-primary",
						children: "Audited Ledger"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Authoritative financial registers, statutory statements, cost center journals, and bank advice files."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: loadReport,
							disabled: loading,
							className: "h-8 gap-1.5 text-xs rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Refresh" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => handleExport("csv"),
							disabled: Boolean(exportingFormat) || loading,
							className: "h-8 gap-1.5 text-xs rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CSV Export" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => handleExport("xlsx"),
							disabled: Boolean(exportingFormat) || loading,
							className: "h-8 gap-1.5 text-xs rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Excel Export" })]
						})
					]
				})]
			}),
			backendUnavailable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
				className: "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, {
						className: "font-semibold text-sm",
						children: "Feature unavailable — backend pending"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDescription, {
						className: "text-xs mt-1 space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"The Payroll Reporting endpoint (",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("code", { children: ["GET /api/v2/payroll/reports/", selectedReportKey] }),
							") is awaiting backend deployment. Report registry schemas and CSV export sanitation pipelines are operational."
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[11px] opacity-80",
							children: [
								"Contract reference: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "docs/PAYROLL_BACKEND_CONTRACT.md" }),
								" • Requirements: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "docs/PAYROLL_BACKEND_TODO.md" })
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5",
				children: Object.keys(REPORT_REGISTRY).map((key) => {
					const item = REPORT_REGISTRY[key];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							setSelectedReportKey(key);
							setPage(1);
						},
						className: `p-3 rounded-2xl border text-left transition-all ${selectedReportKey === key ? "border-primary bg-primary/10 text-primary ring-1 ring-primary/40 shadow-xs" : "border-border/60 bg-background/60 text-muted-foreground hover:bg-muted/40"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs font-semibold truncate text-foreground",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground capitalize mt-0.5",
							children: item.category
						})]
					}, key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl border border-border/60 bg-muted/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: financialYear,
							onChange: (e) => setFinancialYear(e.target.value),
							className: "rounded-lg border border-input bg-background/80 px-2 py-1 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "2026-2027",
								children: "FY 2026-2027"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "2025-2026",
								children: "FY 2025-2026"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: department,
							onChange: (e) => setDepartment(e.target.value),
							className: "rounded-lg border border-input bg-background/80 px-2 py-1 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "All Departments"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Engineering",
									children: "Engineering"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Product",
									children: "Product"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Sales",
									children: "Sales"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Human Resources",
									children: "Human Resources"
								})
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "secondary",
					onClick: loadReport,
					className: "h-7 text-xs rounded-lg",
					children: "Apply Filters"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
				className: "overflow-hidden p-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-4 border-b border-border/70 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-semibold text-foreground",
						children: currentReportDef.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: currentReportDef.description
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						className: "text-xs",
						children: [
							reportData?.totalRecords ?? 0,
							" Record",
							(reportData?.totalRecords ?? 0) !== 1 ? "s" : ""
						]
					})]
				}), selectedReportKey === "accounting_export" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "GL Account Code"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Account Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Cost Center"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right",
									children: "Debit (INR)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 text-right",
									children: "Credit (INR)"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border/60",
							children: !accountingData || accountingData.entries.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 6,
								className: "px-4 py-12 text-center text-muted-foreground",
								children: "No accounting journal entries found for this cycle. All entries come from authoritative backend GL mapping."
							}) }) : accountingData.entries.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-muted/40 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono font-semibold text-foreground",
										children: entry.accountCode
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 text-foreground",
										children: entry.accountName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 capitalize",
										children: entry.accountType.replace(/_/g, " ")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3",
										children: entry.costCenter || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono text-right",
										children: entry.debitFormatted
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-4 py-3 font-mono text-right",
										children: entry.creditFormatted
									})
								]
							}, entry.id))
						})]
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: currentReportDef.columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: `px-4 py-3 ${col.align === "right" ? "text-right" : "text-left"}`,
								children: col.label
							}, col.key)) })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border/60",
							children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								colSpan: currentReportDef.columns.length,
								className: "px-4 py-12 text-center text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-6 w-6 animate-spin mx-auto mb-2 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Generating report records..." })]
							}) }) : !reportData || reportData.rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								colSpan: currentReportDef.columns.length,
								className: "px-4 py-12 text-center text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground/60" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-foreground text-sm",
										children: "No Report Data Available"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: backendUnavailable ? "Reporting endpoint pending deployment on backend." : "No records found matching the selected period and filters."
									})
								]
							}) }) : reportData.rows.map((row, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
								className: "hover:bg-muted/40 transition-colors",
								children: currentReportDef.columns.map((col) => {
									const val = row[col.key];
									const displayVal = col.isCurrency ? formatINR(val) : col.isDate ? formatDate(val) : val !== null && val !== void 0 ? String(val) : "—";
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: `px-4 py-3 ${col.align === "right" ? "text-right font-mono" : "text-left"} ${col.isCurrency ? "font-semibold" : ""}`,
										children: displayVal
									}, col.key);
								})
							}, idx))
						})]
					})
				})]
			})
		]
	});
}
//#endregion
export { PayrollReportsPage as default };
