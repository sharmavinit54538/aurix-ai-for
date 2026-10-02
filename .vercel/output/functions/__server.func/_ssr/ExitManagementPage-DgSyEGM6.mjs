import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Ar as Check, Jn as Eye, Ln as FileText, R as Star, Sr as CircleCheck, Ut as LogOut, Vt as Mail, er as Download, ht as Plus, mt as PowerOff, pi as Archive, q as ShieldCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as ScrollArea } from "./scroll-area-BlnbM3_c.mjs";
import { t as statusBadgeClass } from "./status-styles-B1M3Yvd8.mjs";
import { C as Legend, S as Tooltip, a as PieChart, b as Cell, c as YAxis, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { n as newId, r as useHrms, t as hrms } from "./store-o03qs3ZS.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, r as SheetDescription, t as Sheet } from "./sheet-3YlcNW_l.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CkAivaVl.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJOO1b-0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ExitManagementPage-DgSyEGM6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STAGE_FILTERS = [
	{
		id: "all",
		label: "All Requests"
	},
	{
		id: "requested",
		label: "Requested"
	},
	{
		id: "under-review",
		label: "Under Review"
	},
	{
		id: "approved",
		label: "Approved"
	},
	{
		id: "notice",
		label: "Notice Period"
	},
	{
		id: "clearance",
		label: "Clearance Pending"
	},
	{
		id: "settlement",
		label: "Settlement Pending"
	},
	{
		id: "completed",
		label: "Completed"
	},
	{
		id: "cancelled",
		label: "Cancelled"
	}
];
var STAGE_BADGES = {
	requested: { label: "Requested" },
	"under-review": { label: "Under Review" },
	approved: { label: "Approved" },
	notice: { label: "Notice Period" },
	clearance: { label: "Clearance" },
	settlement: { label: "Settlement" },
	completed: { label: "Completed" },
	cancelled: { label: "Cancelled" },
	resignation: { label: "Resignation" },
	interview: { label: "Interview Scheduled" },
	assets: { label: "Assets Verification" },
	hr: { label: "HR Clearance" },
	manager: { label: "Manager Clearance" },
	it: { label: "IT Clearance" },
	finance: { label: "Finance Clearance" },
	settled: { label: "Settled" }
};
var getExitBadge = (stage) => {
	switch (stage) {
		case "completed":
		case "settled":
		case "approved": return statusBadgeClass("approved");
		case "under-review":
		case "notice":
		case "clearance":
		case "settlement":
		case "interview":
		case "assets":
		case "hr":
		case "manager":
		case "it":
		case "finance": return statusBadgeClass("warning");
		case "cancelled":
		case "rejected": return statusBadgeClass("critical");
		default: return statusBadgeClass("info");
	}
};
var STATS_CARDS = [
	{
		key: "total",
		title: "Total Requests"
	},
	{
		key: "approvals",
		title: "Pending Approvals"
	},
	{
		key: "notice",
		title: "Notice Period"
	},
	{
		key: "clearance",
		title: "Clearance Pending"
	},
	{
		key: "settlement",
		title: "Settlement Pending"
	},
	{
		key: "completed",
		title: "Completed Exits"
	}
];
var COLORS = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)"
];
function ExitManagementPage() {
	const exits = useHrms((s) => s.exits);
	const authWs = useAurix();
	const [allAssets, setAllAssets] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		apiInstance.get("/assets", { params: { limit: 100 } }).then((res) => {
			setAllAssets(res.data?.data?.items || res.data?.items || []);
		}).catch(() => {
			setAllAssets([]);
		});
	}, []);
	const [q, setQ] = (0, import_react.useState)("");
	const [activeFilter, setActiveFilter] = (0, import_react.useState)("all");
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const itemsPerPage = 6;
	const [detailCase, setDetailCase] = (0, import_react.useState)(null);
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [rejectOpen, setRejectOpen] = (0, import_react.useState)(false);
	const [deactivateOpen, setDeactivateOpen] = (0, import_react.useState)(false);
	const [previewDocText, setPreviewDocText] = (0, import_react.useState)(null);
	const [targetCase, setTargetCase] = (0, import_react.useState)(null);
	const [rejectionReason, setRejectionReason] = (0, import_react.useState)("");
	const [empName, setEmpName] = (0, import_react.useState)("");
	const [noticeDays, setNoticeDays] = (0, import_react.useState)(30);
	const [resignDate, setResignDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [resignReason, setResignReason] = (0, import_react.useState)("");
	const [settleSalary, setSettleSalary] = (0, import_react.useState)("0");
	const [settleLeave, setSettleLeave] = (0, import_react.useState)("0");
	const [settleBonus, setSettleBonus] = (0, import_react.useState)("0");
	const [settleIncentive, setSettleIncentive] = (0, import_react.useState)("0");
	const [settleDeduction, setSettleDeduction] = (0, import_react.useState)("0");
	const [settleRecovery, setSettleRecovery] = (0, import_react.useState)("0");
	const [intRating, setIntRating] = (0, import_react.useState)(4);
	const [intReason, setIntReason] = (0, import_react.useState)("");
	const [intMgrFeedback, setIntMgrFeedback] = (0, import_react.useState)("");
	const [intCompFeedback, setIntCompFeedback] = (0, import_react.useState)("");
	const [intSuggestions, setIntSuggestions] = (0, import_react.useState)("");
	const handleCreateSubmit = (e) => {
		e.preventDefault();
		if (!empName) {
			toast.error("Please select an employee.");
			return;
		}
		const selectedEmp = authWs.employees.find((x) => x.fullName === empName) || {
			id: newId("emp"),
			fullName: empName,
			employeeId: `AUR-${Math.floor(1e3 + Math.random() * 9e3)}`,
			department: "Platform Operations",
			designation: "Associate Member",
			joiningDate: (/* @__PURE__ */ new Date(Date.now() - 365 * 24 * 60 * 60 * 1e3)).toISOString().split("T")[0],
			managerName: ""
		};
		const lwd = new Date(new Date(resignDate).getTime() + noticeDays * 24 * 60 * 60 * 1e3).toISOString().split("T")[0];
		const newCase = {
			id: newId("ex"),
			employee: selectedEmp.fullName,
			role: selectedEmp.designation,
			resignedAt: resignDate,
			noticeDays,
			lastWorkingDay: lwd,
			reason: resignReason,
			stage: "requested",
			checklist: [
				{
					key: "assets",
					label: "Asset return checklist",
					done: false
				},
				{
					key: "kt",
					label: "Knowledge transfer",
					done: false
				},
				{
					key: "manager",
					label: "Manager approval",
					done: false
				},
				{
					key: "hr",
					label: "HR approval",
					done: false
				},
				{
					key: "it",
					label: "IT clearance",
					done: false
				},
				{
					key: "finance",
					label: "Finance clearance",
					done: false
				}
			],
			documents: [
				{
					name: "Experience Letter",
					issued: false
				},
				{
					name: "Relieving Letter",
					issued: false
				},
				{
					name: "Final Settlement Letter",
					issued: false
				},
				{
					name: "No Dues Certificate",
					issued: false
				}
			],
			employeeId: selectedEmp.employeeId,
			department: selectedEmp.department,
			designation: selectedEmp.designation,
			joiningDate: selectedEmp.joiningDate,
			managerName: selectedEmp.managerName || "",
			remainingDays: noticeDays,
			managerApprovalStatus: "pending",
			hrApprovalStatus: "pending",
			assignedAssets: allAssets.filter((a) => a.assignedTo && a.assignedTo.toLowerCase() === selectedEmp.fullName.toLowerCase() || a.employeeId && a.employeeId === selectedEmp.employeeId || a.employee_id && a.employee_id === selectedEmp.id).map((a) => ({
				id: newId("ret"),
				assetId: String(a.id || a.asset_id || a.tag),
				assetName: a.name || a.asset_name || "Assigned Equipment",
				category: a.category || "laptop",
				serial: a.serial || a.tag || a.serial_number || "N/A",
				status: "pending"
			})),
			clearanceWorkflow: [
				{
					department: "HR",
					status: "pending"
				},
				{
					department: "IT",
					status: "pending"
				},
				{
					department: "Finance",
					status: "pending"
				},
				{
					department: "Admin",
					status: "pending"
				},
				{
					department: "Manager",
					status: "pending"
				}
			],
			settlementDetails: {
				pendingSalary: 35e3,
				leaveEncashment: 8e3,
				bonus: 0,
				incentives: 0,
				deductions: 0,
				assetRecovery: 0,
				totalAmount: 43e3,
				status: "pending"
			},
			timeline: [{
				id: newId("tl"),
				event: "Exit Requested",
				performedBy: selectedEmp.fullName,
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				notes: "Submitted resignation request."
			}]
		};
		hrms.upsertExit(newCase);
		toast.success("Exit Request created successfully. Sent to Manager for approval.");
		setCreateOpen(false);
		setResignReason("");
	};
	const handleApproval = (exit, stageType) => {
		let updated = { ...exit };
		const author = authWs.user?.fullName || "HR Admin";
		if (stageType === "manager") {
			updated.managerApprovalStatus = "approved";
			updated.managerComments = "KT plan discussed. Transition approved.";
		} else {
			updated.hrApprovalStatus = "approved";
			updated.hrComments = "Notice period parameters approved.";
		}
		if ((updated.managerApprovalStatus === "approved" || updated.managerComments) && (updated.hrApprovalStatus === "approved" || updated.hrComments)) updated.stage = "notice";
		else updated.stage = "under-review";
		const newTimeline = {
			id: newId("tl"),
			event: stageType === "manager" ? "Manager Approved" : "HR Approved",
			performedBy: author,
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			notes: stageType === "manager" ? "Manager signed off resignation approval." : "HR approved compliance check."
		};
		updated.timeline = [...updated.timeline || [], newTimeline];
		updated.checklist = updated.checklist.map((chk) => {
			if (chk.key === stageType) return {
				...chk,
				done: true,
				doneAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			return chk;
		});
		updated.clearanceWorkflow = updated.clearanceWorkflow?.map((c) => {
			if (c.department.toLowerCase() === stageType) return {
				...c,
				status: "approved",
				approvedBy: author,
				approvedAt: (/* @__PURE__ */ new Date()).toISOString(),
				comments: "Approved resignation."
			};
			return c;
		});
		hrms.upsertExit(updated);
		toast.success(`Approved exit request for: ${exit.employee}`);
		if (detailCase?.id === exit.id) setDetailCase(updated);
	};
	const handleRejectPrompt = (exit) => {
		setTargetCase(exit);
		setRejectionReason("");
		setRejectOpen(true);
	};
	const handleRejectSubmit = () => {
		if (!targetCase || !rejectionReason.trim()) {
			toast.error("Please supply a rejection reason.");
			return;
		}
		const author = authWs.user?.fullName || "HR Admin";
		const updated = {
			...targetCase,
			stage: "cancelled",
			rejectionReason,
			managerApprovalStatus: "rejected",
			hrApprovalStatus: "rejected",
			timeline: [...targetCase.timeline || [], {
				id: newId("tl"),
				event: "Rejected",
				performedBy: author,
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				notes: `Resignation request cancelled: ${rejectionReason}`
			}]
		};
		hrms.upsertExit(updated);
		toast.error(`Resignation request rejected for ${targetCase.employee}`);
		setRejectOpen(false);
		setTargetCase(null);
		if (detailCase?.id === targetCase.id) setDetailCase(updated);
	};
	const handleStartClearance = (exit) => {
		const updated = {
			...exit,
			stage: "clearance",
			timeline: [...exit.timeline || [], {
				id: newId("tl"),
				event: "Notice Started",
				performedBy: authWs.user?.fullName || "HR Admin",
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				notes: "Initiated department clearances checklist."
			}]
		};
		hrms.upsertExit(updated);
		toast.info("Clearance process started.");
		if (detailCase?.id === exit.id) setDetailCase(updated);
	};
	const handleAssetReturnStatus = (exit, recordId, status, remarks) => {
		const updatedAssets = (exit.assignedAssets || []).map((ast) => {
			if (ast.id === recordId) return {
				...ast,
				status,
				remarks,
				returnDate: status === "returned" ? (/* @__PURE__ */ new Date()).toISOString().split("T")[0] : void 0
			};
			return ast;
		});
		const allReturned = updatedAssets.every((a) => a.status === "returned");
		let updatedChecklist = exit.checklist.map((c) => {
			if (c.key === "assets") return {
				...c,
				done: allReturned,
				doneAt: allReturned ? (/* @__PURE__ */ new Date()).toISOString() : void 0
			};
			return c;
		});
		let updatedTimeline = exit.timeline || [];
		if (allReturned && !exit.checklist.find((c) => c.key === "assets")?.done) updatedTimeline = [...updatedTimeline, {
			id: newId("tl"),
			event: "Asset Returned",
			performedBy: authWs.user?.fullName || "IT Admin",
			timestamp: (/* @__PURE__ */ new Date()).toISOString(),
			notes: "All 3 assigned hardware devices returned to vault."
		}];
		let updatedClearance = exit.clearanceWorkflow || [];
		if (allReturned) {
			updatedClearance = updatedClearance.map((c) => {
				if (c.department === "IT") return {
					...c,
					status: "approved",
					approvedBy: "IT Support",
					approvedAt: (/* @__PURE__ */ new Date()).toISOString(),
					comments: "Assets returned clean."
				};
				return c;
			});
			updatedChecklist = updatedChecklist.map((chk) => {
				if (chk.key === "it") return {
					...chk,
					done: true,
					doneAt: (/* @__PURE__ */ new Date()).toISOString()
				};
				return chk;
			});
		}
		const updated = {
			...exit,
			assignedAssets: updatedAssets,
			checklist: updatedChecklist,
			clearanceWorkflow: updatedClearance,
			timeline: updatedTimeline
		};
		hrms.upsertExit(updated);
		toast.success(`Asset status updated: ${status}`);
		if (detailCase?.id === exit.id) setDetailCase(updated);
	};
	const handleDeptClearanceStatus = (exit, dept, status, comments) => {
		const updatedClearance = (exit.clearanceWorkflow || []).map((c) => {
			if (c.department === dept) return {
				...c,
				status,
				approvedBy: authWs.user?.fullName || "HR Admin",
				approvedAt: (/* @__PURE__ */ new Date()).toISOString(),
				comments
			};
			return c;
		});
		const chkKey = dept.toLowerCase();
		const updatedChecklist = exit.checklist.map((c) => {
			if (c.key === chkKey) return {
				...c,
				done: status === "approved",
				doneAt: status === "approved" ? (/* @__PURE__ */ new Date()).toISOString() : void 0
			};
			return c;
		});
		const allApproved = updatedClearance.every((c) => c.status === "approved");
		let updatedTimeline = exit.timeline || [];
		let nextStage = exit.stage;
		if (allApproved && exit.stage === "clearance") {
			nextStage = "settlement";
			updatedTimeline = [...updatedTimeline, {
				id: newId("tl"),
				event: "Clearance Completed",
				performedBy: authWs.user?.fullName || "HR Admin",
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				notes: "All 5 departments signed off clearance certifications."
			}];
		}
		const updated = {
			...exit,
			stage: nextStage,
			clearanceWorkflow: updatedClearance,
			checklist: updatedChecklist,
			timeline: updatedTimeline
		};
		hrms.upsertExit(updated);
		toast.success(`${dept} Clearance status set to: ${status}`);
		if (detailCase?.id === exit.id) setDetailCase(updated);
	};
	const handleUpdateSettlement = (exit) => {
		const salaryVal = parseFloat(settleSalary) || 0;
		const leaveVal = parseFloat(settleLeave) || 0;
		const bonusVal = parseFloat(settleBonus) || 0;
		const incentiveVal = parseFloat(settleIncentive) || 0;
		const deductionVal = parseFloat(settleDeduction) || 0;
		const recoveryVal = parseFloat(settleRecovery) || 0;
		const total = salaryVal + leaveVal + bonusVal + incentiveVal - deductionVal - recoveryVal;
		const settlement = {
			pendingSalary: salaryVal,
			leaveEncashment: leaveVal,
			bonus: bonusVal,
			incentives: incentiveVal,
			deductions: deductionVal,
			assetRecovery: recoveryVal,
			totalAmount: total,
			status: "approved"
		};
		const updatedChecklist = exit.checklist.map((c) => {
			if (c.key === "finance") return {
				...c,
				done: true,
				doneAt: (/* @__PURE__ */ new Date()).toISOString()
			};
			return c;
		});
		const updated = {
			...exit,
			settlementDetails: settlement,
			checklist: updatedChecklist,
			timeline: [...exit.timeline || [], {
				id: newId("tl"),
				event: "Settlement Completed",
				performedBy: authWs.user?.fullName || "Finance Ops",
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				notes: `Settlement values audited: total $${total} calculated.`
			}]
		};
		hrms.upsertExit(updated);
		toast.success("Final settlement calculations saved.");
		if (detailCase?.id === exit.id) setDetailCase(updated);
	};
	const handlePaySettlement = (exit) => {
		if (!exit.settlementDetails) return;
		const updatedSettlement = {
			...exit.settlementDetails,
			status: "paid"
		};
		const updated = {
			...exit,
			settlementDetails: updatedSettlement,
			timeline: [...exit.timeline || [], {
				id: newId("tl"),
				event: "Settlement Completed",
				performedBy: authWs.user?.fullName || "Finance Partner",
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				notes: "Wire transfer processed. Final dues paid."
			}]
		};
		hrms.upsertExit(updated);
		toast.success("Final settlement paid out to employee's bank account.");
		if (detailCase?.id === exit.id) setDetailCase(updated);
	};
	const handleGenerateDoc = (exit, docName) => {
		const updatedDocs = exit.documents.map((d) => {
			if (d.name === docName) return {
				...d,
				issued: true
			};
			return d;
		});
		const updated = {
			...exit,
			documents: updatedDocs,
			timeline: [...exit.timeline || [], {
				id: newId("tl"),
				event: "Documents Generated",
				performedBy: authWs.user?.fullName || "HR Partner",
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				notes: `Generated document: ${docName}`
			}]
		};
		hrms.upsertExit(updated);
		toast.success(`Generated official document: ${docName}`);
		if (detailCase?.id === exit.id) setDetailCase(updated);
	};
	const handlePreviewLetter = (exit, docName) => {
		let text = `OFC360
To whom it may concern,

This is to certify that ${exit.employee} (Employee ID: ${exit.employeeId || "—"})
was employed with OFC360 from ${exit.joiningDate || "—"} to ${exit.lastWorkingDay || "—"}.
During their tenure, they held the designation of ${exit.designation || exit.role || "Employee"} under ${exit.department || "General"} department.

We verify that all clearances have been successfully compiled.

Sincerely,
People Operations
Corporate HR`;
		if (docName.includes("Settlement")) text = `OFC360 — FINAL SETTLEMENT SHEET
Employee: ${exit.employee}
Designation: ${exit.designation}

Pending Salary: $${exit.settlementDetails?.pendingSalary || 0}
Leave Encashment: $${exit.settlementDetails?.leaveEncashment || 0}
Bonus & Incentives: $${(exit.settlementDetails?.bonus || 0) + (exit.settlementDetails?.incentives || 0)}
Deductions: -$${(exit.settlementDetails?.deductions || 0) + (exit.settlementDetails?.assetRecovery || 0)}

Final Settlement Wire Payout: $${exit.settlementDetails?.totalAmount || 0}
Status: ${exit.settlementDetails?.status || "Pending"}

Signed,
Finance Operations Partner`;
		setPreviewDocText(text);
	};
	const handleDeactivatePrompt = (exit) => {
		setTargetCase(exit);
		setDeactivateOpen(true);
	};
	const handleDeactivateConfirm = () => {
		if (!targetCase) return;
		const updated = {
			...targetCase,
			stage: "completed",
			remainingDays: 0,
			timeline: [...targetCase.timeline || [], {
				id: newId("tl"),
				event: "Employee Deactivated",
				performedBy: authWs.user?.fullName || "HR Admin",
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				notes: "Revoked SSO login, de-activated credentials, archived profile."
			}]
		};
		hrms.upsertExit(updated);
		toast.success("Employee de-activated. Login credentials revoked and profile archived.");
		setDeactivateOpen(false);
		setTargetCase(null);
		if (detailCase?.id === targetCase.id) setDetailCase(updated);
	};
	const handleSaveInterview = (exit) => {
		const interview = {
			reason: intReason || exit.reason,
			rating: intRating,
			managerFeedback: intMgrFeedback,
			companyFeedback: intCompFeedback,
			suggestions: intSuggestions
		};
		const updated = {
			...exit,
			interviewDetails: interview,
			timeline: [...exit.timeline || [], {
				id: newId("tl"),
				event: "Notice Started",
				performedBy: authWs.user?.fullName || "HR Partner",
				timestamp: (/* @__PURE__ */ new Date()).toISOString(),
				notes: "Recorded exit interview questionnaire responses."
			}]
		};
		hrms.upsertExit(updated);
		toast.success("Exit interview answers saved.");
		if (detailCase?.id === exit.id) setDetailCase(updated);
	};
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: exits.length,
			approvals: exits.filter((e) => e.stage === "requested" || e.stage === "under-review").length,
			notice: exits.filter((e) => e.stage === "notice" || e.stage === "clearance").length,
			clearance: exits.filter((e) => {
				if (e.stage !== "clearance") return false;
				return !e.checklist.every((c) => c.done);
			}).length,
			settlement: exits.filter((e) => {
				return e.stage === "settlement" || e.settlementDetails && e.settlementDetails.status !== "paid";
			}).length,
			completed: exits.filter((e) => e.stage === "completed" || e.stage === "settled").length
		};
	}, [exits]);
	(0, import_react.useMemo)(() => {
		const alerts = [];
		exits.forEach((e) => {
			if (e.stage === "requested") alerts.push({
				id: `app_${e.id}`,
				type: "warning",
				message: `Approval required: ${e.employee} submitted resignation request.`,
				exitCase: e
			});
			if (e.stage === "clearance") {
				const missingAssets = (e.assignedAssets || []).filter((a) => a.status === "pending").length;
				if (missingAssets > 0) alerts.push({
					id: `ast_${e.id}`,
					type: "error",
					message: `Asset return pending: ${e.employee} has ${missingAssets} hardware devices un-returned.`,
					exitCase: e
				});
			}
			if (e.stage === "notice" && e.remainingDays && e.remainingDays <= 15) alerts.push({
				id: `not_${e.id}`,
				type: "warning",
				message: `Notice period ending soon for ${e.employee} (${e.remainingDays} days left).`,
				exitCase: e
			});
		});
		return alerts;
	}, [exits]);
	const filteredExits = (0, import_react.useMemo)(() => {
		return exits.filter((e) => {
			const matchQ = !q || e.employee.toLowerCase().includes(q.toLowerCase()) || e.employeeId && e.employeeId.toLowerCase().includes(q.toLowerCase()) || e.role.toLowerCase().includes(q.toLowerCase()) || e.department && e.department.toLowerCase().includes(q.toLowerCase());
			let matchStage = true;
			if (activeFilter !== "all") {
				if (activeFilter === "requested") matchStage = e.stage === "requested";
				else if (activeFilter === "under-review") matchStage = e.stage === "under-review" || e.stage === "manager" || e.stage === "hr";
				else if (activeFilter === "approved") matchStage = e.stage === "approved";
				else if (activeFilter === "notice") matchStage = e.stage === "notice";
				else if (activeFilter === "clearance") matchStage = e.stage === "clearance" || e.stage === "assets" || e.stage === "it";
				else if (activeFilter === "settlement") matchStage = e.stage === "settlement" || e.stage === "finance";
				else if (activeFilter === "completed") matchStage = e.stage === "completed" || e.stage === "settled";
				else if (activeFilter === "cancelled") matchStage = e.stage === "cancelled";
			}
			return matchQ && matchStage;
		});
	}, [
		exits,
		q,
		activeFilter
	]);
	const paginatedExits = (0, import_react.useMemo)(() => {
		const startIdx = (currentPage - 1) * itemsPerPage;
		return filteredExits.slice(startIdx, startIdx + itemsPerPage);
	}, [filteredExits, currentPage]);
	const totalPages = Math.ceil(filteredExits.length / itemsPerPage);
	const attritionChartData = (0, import_react.useMemo)(() => {
		const counts = {};
		exits.forEach((e) => {
			const dept = e.department || "Operations";
			counts[dept] = (counts[dept] || 0) + 1;
		});
		return Object.keys(counts).map((k) => ({
			department: k,
			"Exit Count": counts[k]
		}));
	}, [exits]);
	const monthlyExitTrends = (0, import_react.useMemo)(() => {
		if (exits.length === 0) return [];
		const counts = {};
		exits.forEach((e) => {
			const dateStr = e.resignedAt || e.lastWorkingDay;
			if (!dateStr) return;
			const d = new Date(dateStr);
			if (isNaN(d.getTime())) return;
			const key = d.toLocaleDateString("en-IN", {
				month: "short",
				year: "numeric"
			});
			counts[key] = (counts[key] || 0) + 1;
		});
		return Object.entries(counts).map(([name, value]) => ({
			name,
			value
		}));
	}, [exits]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-end gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => {
						const headers = [
							"Employee ID",
							"Employee Name",
							"Department",
							"Role",
							"Resignation Date",
							"Last Working Day",
							"Exit Stage"
						];
						const rows = exits.map((e) => [
							e.employeeId || "",
							e.employee,
							e.department || "",
							e.role,
							e.resignedAt,
							e.lastWorkingDay,
							e.stage
						].map((v) => `"${v.replace(/"/g, "\"\"")}"`).join(","));
						const csv = [headers.join(","), ...rows].join("\n");
						const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
						const link = document.createElement("a");
						link.href = url;
						link.download = "HR_Exit_Management_Report.csv";
						link.click();
						URL.revokeObjectURL(url);
						toast.success("Exit report exported as CSV");
					},
					className: "h-8 gap-1.5 text-xs cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" }), "Export"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					onClick: () => setCreateOpen(true),
					className: "h-8 gap-1.5 text-xs cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), "Create Exit Request"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6",
				children: STATS_CARDS.map((card) => {
					const count = stats[card.key];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border bg-card",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold text-muted-foreground truncate leading-none",
									children: card.title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2.5 flex items-baseline gap-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-2xl font-semibold font-display tracking-tight leading-none text-foreground",
									children: count
								})
							})]
						})
					}, card.key);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "requests",
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-muted border border-border p-1 rounded-xl h-10 w-fit shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "requests",
							className: "text-xs h-8 px-4 font-medium rounded-lg cursor-pointer",
							children: "Exit Requests Pipeline"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "analytics",
							className: "text-xs h-8 px-4 font-medium rounded-lg cursor-pointer",
							children: "Attrition Analytics"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "requests",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-card",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col gap-4 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative max-w-sm flex-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: q,
												onChange: (e) => {
													setQ(e.target.value);
													setCurrentPage(1);
												},
												placeholder: "Search employee, ID, designation...",
												className: "h-9 pl-9 border-border bg-background/50 focus-visible:ring-1 focus-visible:ring-ring"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-2 overflow-x-auto py-1 scrollbar-none",
											children: STAGE_FILTERS.map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => {
													setActiveFilter(tab.id);
													setCurrentPage(1);
												},
												className: `shrink-0 rounded-full px-3 py-1 text-xs font-semibold border transition-colors cursor-pointer ${activeFilter === tab.id ? "bg-foreground text-background border-foreground" : "bg-background/40 border-border hover:bg-accent/60 text-muted-foreground"}`,
												children: tab.label
											}, tab.id))
										})]
									}),
									paginatedExits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col items-center justify-center py-16 text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-muted/50 border border-border text-muted-foreground",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-6 w-6" })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-foreground",
												children: "No exits found"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 max-w-sm text-sm text-muted-foreground",
												children: "Adjust your filters or submit a resignation exit request."
											})
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "overflow-x-auto",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
											className: "min-w-[1000px] border-collapse",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
												className: "bg-muted/10 text-xs font-medium uppercase tracking-wider border-b border-border",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
													className: "hover:bg-transparent",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-4 py-3",
															children: "Employee"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-4 py-3",
															children: "Employee ID"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-4 py-3",
															children: "Department"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-4 py-3",
															children: "Reporting Manager"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-4 py-3",
															children: "Resignation Date"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-4 py-3",
															children: "Last Working Day"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-4 py-3 text-center",
															children: "Notice Days"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-4 py-3 text-center",
															children: "Remaining Days"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-4 py-3 text-center",
															children: "Status"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "px-4 py-3 text-right" })
													]
												})
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: paginatedExits.map((exit) => {
												const badge = STAGE_BADGES[exit.stage] || {
													label: exit.stage,
													color: "text-muted-foreground",
													bg: "bg-muted"
												};
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
													className: "group border-t border-border transition-colors hover:bg-accent/20 cursor-pointer",
													onClick: () => {
														setDetailCase(exit);
														setSettleSalary(exit.settlementDetails?.pendingSalary?.toString() || "35000");
														setSettleLeave(exit.settlementDetails?.leaveEncashment?.toString() || "8000");
														setSettleBonus(exit.settlementDetails?.bonus?.toString() || "0");
														setSettleIncentive(exit.settlementDetails?.incentives?.toString() || "0");
														setSettleDeduction(exit.settlementDetails?.deductions?.toString() || "0");
														setSettleRecovery(exit.settlementDetails?.assetRecovery?.toString() || "0");
														setIntRating(exit.interviewDetails?.rating || 4);
														setIntReason(exit.interviewDetails?.reason || exit.reason || "");
														setIntMgrFeedback(exit.interviewDetails?.managerFeedback || "");
														setIntCompFeedback(exit.interviewDetails?.companyFeedback || "");
														setIntSuggestions(exit.interviewDetails?.suggestions || "");
													},
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-3",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex items-center gap-2.5",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-foreground font-bold text-xs",
																	children: exit.employee.split(" ").map((n) => n[0]).slice(0, 2).join("")
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "font-semibold text-foreground truncate max-w-[150px]",
																	children: exit.employee
																})]
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-3 font-mono text-xs text-foreground/80",
															children: exit.employeeId || "—"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-3 text-xs text-muted-foreground",
															children: exit.department || "Operations"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-3 text-xs text-foreground/80",
															children: exit.managerName || "—"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-3 text-xs text-muted-foreground",
															children: exit.resignedAt
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-3 text-xs font-semibold text-foreground/95",
															children: exit.lastWorkingDay
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-3 text-center text-xs text-muted-foreground",
															children: exit.noticeDays
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-3 text-center text-xs font-semibold",
															children: exit.remainingDays !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: exit.remainingDays <= 15 && exit.remainingDays > 0 ? "text-foreground font-bold" : "text-foreground",
																children: [exit.remainingDays, " days"]
															}) : "—"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-3 text-center",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																className: `${getExitBadge(exit.stage)} border shadow-none text-[11px] font-semibold`,
																children: badge.label
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-3 text-right",
															onClick: (e) => e.stopPropagation(),
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex justify-end gap-1 opacity-80 group-hover:opacity-100",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																		size: "sm",
																		variant: "outline",
																		onClick: () => setDetailCase(exit),
																		className: "h-7 text-[10px] border-border cursor-pointer hover:bg-accent/65",
																		children: "View"
																	}),
																	exit.stage === "requested" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																		size: "sm",
																		variant: "outline",
																		onClick: () => handleApproval(exit, "hr"),
																		className: "h-7 text-[10px] text-emerald-600 dark:text-emerald-400 border-border cursor-pointer",
																		children: "Approve"
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																		size: "sm",
																		variant: "outline",
																		onClick: () => handleRejectPrompt(exit),
																		className: "h-7 text-[10px] text-destructive border-destructive/30 cursor-pointer",
																		children: "Reject"
																	})] }),
																	exit.stage === "notice" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																		size: "sm",
																		variant: "outline",
																		onClick: () => handleStartClearance(exit),
																		className: "h-7 text-[10px] text-emerald-600 dark:text-emerald-400 border-border cursor-pointer",
																		children: "Clearance"
																	}),
																	exit.stage === "settlement" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																		size: "sm",
																		variant: "outline",
																		onClick: () => handleDeactivatePrompt(exit),
																		className: "h-7 text-[10px] text-destructive border-destructive/30 cursor-pointer",
																		title: "Mark Completed & Archive",
																		children: "Archive"
																	})
																]
															})
														})
													]
												}, exit.id);
											}) })]
										})
									}),
									totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between border-t border-border px-4 py-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-muted-foreground",
											children: [
												"Showing Page",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "font-semibold text-foreground",
													children: currentPage
												}),
												" of",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "font-semibold text-foreground",
													children: totalPages
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "sm",
												disabled: currentPage === 1,
												onClick: () => setCurrentPage((c) => Math.max(1, c - 1)),
												className: "h-8 border-border hover:bg-accent/60 cursor-pointer",
												children: "Previous"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "sm",
												disabled: currentPage === totalPages,
												onClick: () => setCurrentPage((c) => Math.min(totalPages, c + 1)),
												className: "h-8 border-border hover:bg-accent/60 cursor-pointer",
												children: "Next"
											})]
										})]
									})
								]
							})
						}) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "analytics",
						className: "space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "border-border bg-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-sm font-bold",
									children: "Department-wise Exits"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
									className: "text-xs",
									children: "Count of offboardings logged per department"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
									className: "h-[250px]",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
										width: "100%",
										height: "100%",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
											data: attritionChartData,
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
													strokeDasharray: "3 3",
													opacity: .1
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
													dataKey: "department",
													style: { fontSize: 9 }
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { style: { fontSize: 9 } }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: { fontSize: 11 } }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
													dataKey: "Exit Count",
													fill: "var(--chart-1)",
													radius: [
														4,
														4,
														0,
														0
													]
												})
											]
										})
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
								className: "border-border bg-card",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
									className: "text-sm font-bold",
									children: "Monthly Exit Trends"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
									className: "text-xs",
									children: "Timeline attrition count from real exit records"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
									className: "h-[250px] flex items-center justify-center",
									children: monthlyExitTrends.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center text-xs text-muted-foreground p-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground/40" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No historical exit trends to display" })]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
										width: "100%",
										height: "100%",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
												data: monthlyExitTrends,
												cx: "50%",
												cy: "50%",
												innerRadius: 60,
												outerRadius: 80,
												paddingAngle: 4,
												dataKey: "value",
												children: monthlyExitTrends.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: { fontSize: 11 } }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } })
										] })
									})
								})]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: createOpen,
				onOpenChange: setCreateOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display font-bold text-lg",
						children: "Submit Resignation Request"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleCreateSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Select Employee"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: empName,
									onValueChange: setEmpName,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-full bg-background/50 border-border text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: authWs.employees.map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: emp.fullName,
										children: [
											emp.fullName,
											" (",
											emp.employeeId,
											")"
										]
									}, emp.id)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Resignation Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: resignDate,
										onChange: (e) => setResignDate(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Notice Period (Days)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: noticeDays,
										onChange: (e) => setNoticeDays(parseInt(e.target.value) || 30),
										className: "bg-background/50 border-border text-xs"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Reason for Leaving"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: resignReason,
									onChange: (e) => setResignReason(e.target.value),
									placeholder: "State resignation reasons...",
									className: "min-h-[100px] bg-background/50 border-border text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setCreateOpen(false),
									className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-9 bg-primary text-brand-foreground hover:opacity-90 cursor-pointer",
									children: "Create Request"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: rejectOpen,
				onOpenChange: setRejectOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-background border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-display font-bold text-destructive",
							children: "Cancel/Reject Resignation"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Please state the reason for rejecting or cancelling this exit request."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: rejectionReason,
								onChange: (e) => setRejectionReason(e.target.value),
								placeholder: "e.g. Agreement signed, key personnel retention, resignation withdrawn...",
								className: "min-h-[100px] border-border text-xs"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setRejectOpen(false),
							className: "h-9 border-border bg-transparent cursor-pointer",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleRejectSubmit,
							className: "h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer",
							children: "Confirm Rejection"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: deactivateOpen,
				onOpenChange: setDeactivateOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-background border-border text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "font-display font-bold text-destructive flex items-center justify-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PowerOff, { className: "h-5 w-5 animate-pulse" }), "Revoke Employee SSO Credentials"]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "py-3 space-y-2 text-xs text-muted-foreground text-left",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Confirming final offboarding completion for ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: targetCase?.employee }),
								" ",
								"will automatically trigger:"
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
								className: "list-disc pl-5 space-y-1 bg-muted/30 p-2.5 rounded-lg border border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Revoking SSO credentials & workspace account access." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Revoking GitHub/Figma repository permissions." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Closing active sessions." }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Deactivating employee profile and archiving data history." })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setDeactivateOpen(false),
								className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: handleDeactivateConfirm,
								className: "h-9 bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-4 w-4" }), "Deactivate & Archive"]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!previewDocText,
				onOpenChange: (open) => !open && setPreviewDocText(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg bg-background border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "font-display font-bold flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-5 w-5 text-primary" }), "Official Documentation Preview"]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-muted/30 rounded-xl border border-border p-5 text-foreground font-mono text-[11px] leading-relaxed whitespace-pre-wrap select-none min-h-[300px]",
							children: previewDocText
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setPreviewDocText(null),
							className: "h-9 border-border bg-transparent cursor-pointer",
							children: "Close Preview"
						}) })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: !!detailCase,
				onOpenChange: (open) => !open && setDetailCase(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
					className: "sm:max-w-xl flex flex-col h-full bg-background border-l border-border p-0 shadow-2xl",
					children: detailCase && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
						className: "p-5 border-b border-border bg-muted/10 shrink-0 text-left",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] uppercase font-bold text-muted-foreground border-border",
									children: detailCase.department || "Operations"
								}), (() => {
									const badge = STAGE_BADGES[detailCase.stage] || {
										label: detailCase.stage,
										color: "text-muted",
										bg: "bg-muted"
									};
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										className: `${getExitBadge(detailCase.stage)} border shadow-none text-xs font-bold`,
										children: badge.label
									});
								})()]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, {
								className: "font-display text-base font-bold text-foreground mt-2 truncate text-left",
								title: detailCase.employee,
								children: [
									detailCase.employee,
									" (",
									detailCase.employeeId,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, {
								className: "text-xs text-muted-foreground text-left mt-0.5",
								children: [
									"Resigned Date: ",
									detailCase.resignedAt,
									" • LWD: ",
									detailCase.lastWorkingDay
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						defaultValue: "overview",
						className: "flex-1 flex flex-col min-h-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-5 border-b border-border bg-muted/5 shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
									className: "bg-transparent border-none p-0 flex gap-2 h-10",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "overview",
											className: "text-xs h-9 font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent shadow-none cursor-pointer",
											children: "Overview"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "clearance",
											className: "text-xs h-9 font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent shadow-none cursor-pointer",
											children: "Clearance"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "settlement",
											className: "text-xs h-9 font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent shadow-none cursor-pointer",
											children: "Settlement"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
											value: "interview",
											className: "text-xs h-9 font-semibold rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent shadow-none cursor-pointer",
											children: "Interview"
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ScrollArea, {
								className: "flex-1 p-5 min-h-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
										value: "overview",
										className: "space-y-5 mt-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-border bg-card p-4 space-y-3 text-left",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-between items-center text-xs font-semibold",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Notice Period Progress" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [detailCase.remainingDays || 0, " days remaining"] })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
														className: "h-2 w-full overflow-hidden rounded-full bg-muted",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
															className: "h-full rounded-full transition-all bg-primary",
															style: { width: `${Math.max(0, Math.min(100, (detailCase.noticeDays - (detailCase.remainingDays || 0)) / detailCase.noticeDays * 100))}%` }
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex justify-between text-[10px] text-muted-foreground",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Start: ", detailCase.resignedAt] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["End: ", detailCase.lastWorkingDay] })]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-border bg-card p-4 space-y-3 text-left",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
													children: "Employee Profile"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-2 gap-x-4 gap-y-3 text-xs",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted-foreground block text-[10px]",
															children: "Joining Date"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
															className: "text-foreground mt-0.5 block",
															children: detailCase.joiningDate || "—"
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted-foreground block text-[10px]",
															children: "Designation Designation"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
															className: "text-foreground mt-0.5 block",
															children: detailCase.designation || detailCase.role
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted-foreground block text-[10px]",
															children: "Reporting Manager"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
															className: "text-foreground mt-0.5 block",
															children: detailCase.managerName || "—"
														})] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "col-span-2",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-muted-foreground block text-[10px]",
																children: "Statement Reason for leaving"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "text-foreground mt-0.5 leading-relaxed italic",
																children: [
																	"\"",
																	detailCase.reason || "No reason specified.",
																	"\""
																]
															})]
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2 text-left",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs font-semibold text-muted-foreground",
													children: "Resignation timeline logs"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "rounded-xl border border-border bg-card p-4 space-y-3.5",
													children: (detailCase.timeline || []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted-foreground italic",
														children: "No timelines logged for this exit."
													}) : (detailCase.timeline || []).map((tl, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: `flex gap-3 text-xs relative ${idx < (detailCase.timeline || []).length - 1 ? "before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3" : ""}`,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "grid h-4 w-4 place-items-center rounded-full bg-primary/10 text-primary shrink-0",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-2 w-2" })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "text-left",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "font-bold text-foreground capitalize",
																	children: tl.event
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																	className: "text-[10px] text-muted-foreground mt-0.5",
																	children: [
																		"By ",
																		tl.performedBy,
																		" on ",
																		new Date(tl.timestamp).toLocaleString()
																	]
																}),
																tl.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "text-[10px] text-foreground/80 mt-1",
																	children: tl.notes
																})
															]
														})]
													}, tl.id))
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
										value: "clearance",
										className: "space-y-6 mt-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-xl border border-border bg-card p-4 space-y-3 text-left",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
													children: "Resignation Signoff Approvals"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-2 gap-3 text-xs pt-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "rounded-lg border border-border p-3 space-y-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-muted-foreground block text-[10px]",
																children: "Reporting Manager"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																className: "text-foreground block",
																children: detailCase.managerName || "—"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "pt-2 flex items-center justify-between",
																children: [detailCase.managerApprovalStatus === "approved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																	variant: "outline",
																	className: `text-[10px] ${statusBadgeClass("approved")}`,
																	children: "Approved"
																}) : detailCase.managerApprovalStatus === "rejected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																	className: "bg-destructive/10 text-destructive border-destructive/20 text-[10px]",
																	children: "Rejected"
																}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																	variant: "outline",
																	className: `text-[10px] ${statusBadgeClass("warning")}`,
																	children: "Pending Approval"
																}), detailCase.managerApprovalStatus === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																	size: "sm",
																	variant: "outline",
																	onClick: () => handleApproval(detailCase, "manager"),
																	className: "h-6 text-[10px] px-2 cursor-pointer",
																	children: "Approve"
																})]
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "rounded-lg border border-border p-3 space-y-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-muted-foreground block text-[10px]",
																children: "HR Business Partner"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																className: "text-foreground block",
																children: detailCase.hrApproverName || "HR Business Partner"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "pt-2 flex items-center justify-between",
																children: [detailCase.hrApprovalStatus === "approved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																	variant: "outline",
																	className: `text-[10px] ${statusBadgeClass("approved")}`,
																	children: "Approved"
																}) : detailCase.hrApprovalStatus === "rejected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																	className: "bg-destructive/10 text-destructive border-destructive/20 text-[10px]",
																	children: "Rejected"
																}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																	variant: "outline",
																	className: `text-[10px] ${statusBadgeClass("warning")}`,
																	children: "Pending Approval"
																}), detailCase.hrApprovalStatus === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																	size: "sm",
																	variant: "outline",
																	onClick: () => handleApproval(detailCase, "hr"),
																	className: "h-6 text-[10px] px-2 cursor-pointer",
																	children: "Approve"
																})]
															})
														]
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2 text-left",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between items-center",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
														className: "text-xs font-semibold text-muted-foreground",
														children: "Assigned hardware inventory clearance"
													}), (detailCase.assignedAssets || []).every((a) => a.status === "returned") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[11px] font-bold text-foreground flex items-center gap-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3.5 w-3.5" }), " Asset Clearance Completed"]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "rounded-xl border border-border bg-card p-0 overflow-hidden",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
														className: "text-xs border-collapse",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
															className: "bg-muted/10 border-b border-border",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																	className: "px-3 py-2 w-[160px]",
																	children: "Hardware Asset"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																	className: "px-3 py-2",
																	children: "Serial"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																	className: "px-3 py-2 text-center",
																	children: "Status"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "px-3 py-2 text-right" })
															] })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: (detailCase.assignedAssets || []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															colSpan: 4,
															className: "text-center py-4 text-muted-foreground italic",
															children: "No assets registered under checkout."
														}) }) : (detailCase.assignedAssets || []).map((ast) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
															className: "border-t border-border",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
																	className: "px-3 py-2",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																		className: "font-semibold",
																		children: ast.assetName
																	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "text-[10px] text-muted-foreground capitalize",
																		children: ast.category
																	})]
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																	className: "px-3 py-2 font-mono text-[11px] text-muted-foreground",
																	children: ast.serial
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																	className: "px-3 py-2 text-center",
																	children: ast.status === "returned" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																		variant: "outline",
																		className: `text-[10px] font-semibold ${statusBadgeClass("approved")}`,
																		children: "Returned"
																	}) : ast.status === "damaged" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																		className: "bg-destructive/10 text-destructive border-destructive/20 font-semibold text-[10px]",
																		children: "Damaged"
																	}) : ast.status === "missing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																		className: "bg-destructive/10 text-destructive border-destructive/20 font-semibold text-[10px]",
																		children: "Missing"
																	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																		variant: "outline",
																		className: `text-[10px] font-semibold ${statusBadgeClass("warning")}`,
																		children: "Pending Return"
																	})
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																	className: "px-3 py-2 text-right",
																	children: ast.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "flex justify-end gap-1",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																			size: "sm",
																			variant: "outline",
																			onClick: () => handleAssetReturnStatus(detailCase, ast.id, "returned", "Good condition."),
																			className: "h-6 text-[9px] px-1.5 border-border cursor-pointer hover:bg-muted",
																			children: "Return"
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																			size: "sm",
																			variant: "outline",
																			onClick: () => handleAssetReturnStatus(detailCase, ast.id, "damaged", "Screen scratch"),
																			className: "h-6 text-[9px] px-1.5 border-border cursor-pointer hover:bg-destructive/10 text-destructive",
																			children: "Damage"
																		})]
																	})
																})
															]
														}, ast.id)) })]
													})
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2 text-left",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs font-semibold text-muted-foreground",
													children: "Department-wise clearance sign-offs"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "rounded-xl border border-border bg-card p-0 overflow-hidden",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
														className: "text-xs border-collapse",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
															className: "bg-muted/10 border-b border-border",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																	className: "px-3 py-2 w-[120px]",
																	children: "Department"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																	className: "px-3 py-2",
																	children: "Clearance Status"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																	className: "px-3 py-2",
																	children: "Approver Comments"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "px-3 py-2 text-right" })
															] })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: (detailCase.clearanceWorkflow || []).map((clear) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
															className: "border-t border-border",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																	className: "px-3 py-2 font-bold",
																	children: clear.department
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																	className: "px-3 py-2",
																	children: clear.status === "approved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																		variant: "outline",
																		className: `text-[10px] font-semibold ${statusBadgeClass("approved")}`,
																		children: "Cleared"
																	}) : clear.status === "rejected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																		className: "bg-destructive/10 text-destructive border-destructive/20 font-semibold text-[10px]",
																		children: "Flagged"
																	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																		variant: "outline",
																		className: `text-[10px] font-semibold ${statusBadgeClass("warning")}`,
																		children: "Clearance Pending"
																	})
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																	className: "px-3 py-2 text-muted-foreground text-[11px] truncate max-w-[150px]",
																	title: clear.comments,
																	children: clear.comments || "—"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																	className: "px-3 py-2 text-right",
																	children: clear.status === "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																		size: "sm",
																		variant: "outline",
																		onClick: () => handleDeptClearanceStatus(detailCase, clear.department, "approved", "Dues checks compiled."),
																		className: "h-6 text-[9px] px-1.5 border-border cursor-pointer hover:bg-muted",
																		children: "Approve"
																	})
																})
															]
														}, clear.department)) })]
													})
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
										value: "settlement",
										className: "space-y-6 mt-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border bg-card p-4 space-y-4 text-left",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between items-center",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
													className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
													children: "Final Settlement Calculations"
												}), detailCase.settlementDetails?.status === "paid" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: `font-bold ${statusBadgeClass("approved")}`,
													children: "PAID OUT"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-3 text-xs",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
															className: "text-[10px] text-muted-foreground",
															children: "Pending Salary ($)"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															type: "number",
															value: settleSalary,
															onChange: (e) => setSettleSalary(e.target.value),
															className: "h-8 bg-background border-border text-xs"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
															className: "text-[10px] text-muted-foreground",
															children: "Leave Encashment ($)"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															type: "number",
															value: settleLeave,
															onChange: (e) => setSettleLeave(e.target.value),
															className: "h-8 bg-background border-border text-xs"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
															className: "text-[10px] text-muted-foreground",
															children: "Bonus ($)"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															type: "number",
															value: settleBonus,
															onChange: (e) => setSettleBonus(e.target.value),
															className: "h-8 bg-background border-border text-xs"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
															className: "text-[10px] text-muted-foreground",
															children: "Incentives ($)"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															type: "number",
															value: settleIncentive,
															onChange: (e) => setSettleIncentive(e.target.value),
															className: "h-8 bg-background border-border text-xs"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
															className: "text-[10px] text-muted-foreground",
															children: "Deductions ($)"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															type: "number",
															value: settleDeduction,
															onChange: (e) => setSettleDeduction(e.target.value),
															className: "h-8 bg-background border-border text-xs"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
															className: "text-[10px] text-muted-foreground",
															children: "Asset Recovery Charges ($)"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															type: "number",
															value: settleRecovery,
															onChange: (e) => setSettleRecovery(e.target.value),
															className: "h-8 bg-background border-border text-xs"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "col-span-2 pt-2 border-t border-border flex justify-between items-center text-xs",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-muted-foreground text-[10px] block",
															children: "Calculated Settlement Payout"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
															className: "text-lg text-foreground font-display font-semibold",
															children: ["$", detailCase.settlementDetails?.totalAmount || 0]
														})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex gap-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																type: "button",
																variant: "outline",
																onClick: () => handleUpdateSettlement(detailCase),
																className: "h-8 text-xs border-border bg-transparent cursor-pointer",
																children: "Update calculations"
															}), detailCase.settlementDetails && detailCase.settlementDetails.status === "approved" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																type: "button",
																onClick: () => handlePaySettlement(detailCase),
																className: "h-8 text-xs cursor-pointer",
																children: "Pay Out Wire"
															})]
														})]
													})
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2 text-left",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-xs font-semibold text-muted-foreground",
												children: "Auto-generated offboarding certificates"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "rounded-xl border border-border bg-card p-0 overflow-hidden",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
													className: "text-xs border-collapse",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
														className: "bg-muted/10 border-b border-border",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-3 py-2 w-[220px]",
																children: "Certificate Title"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-3 py-2",
																children: "Generation Status"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "px-3 py-2 text-right" })
														] })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: detailCase.documents.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
														className: "border-t border-border",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-3 py-2 font-bold",
																children: doc.name
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-3 py-2",
																children: doc.issued ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																	variant: "outline",
																	className: `text-[10px] font-semibold ${statusBadgeClass("approved")}`,
																	children: "Issued & Signed"
																}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																	variant: "outline",
																	className: `text-[10px] font-semibold ${statusBadgeClass("warning")}`,
																	children: "Not Generated"
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-3 py-2 text-right",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "flex justify-end gap-1",
																	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																		size: "icon",
																		variant: "ghost",
																		onClick: () => handlePreviewLetter(detailCase, doc.name),
																		className: "h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer",
																		title: "Preview template text",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
																	}), !doc.issued ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																		size: "sm",
																		variant: "outline",
																		onClick: () => handleGenerateDoc(detailCase, doc.name),
																		className: "h-6 text-[9px] px-1.5 border-border cursor-pointer hover:bg-muted",
																		children: "Generate"
																	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																		size: "icon",
																		variant: "ghost",
																		onClick: () => {
																			toast.success(`Sent PDF document to ${detailCase.employee}'s personal email.`);
																		},
																		className: "h-6 w-6 text-primary hover:bg-primary/10 cursor-pointer",
																		title: "Email PDF to employee",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" })
																	})]
																})
															})
														]
													}, doc.name)) })]
												})
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
										value: "interview",
										className: "space-y-4 mt-0 text-left",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
												className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
												children: "Exit Interview Feedback Report"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs text-muted-foreground",
													children: "Reason for departure"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: intReason,
													onChange: (e) => setIntReason(e.target.value),
													className: "bg-background/50 border-border text-xs h-8"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs text-muted-foreground",
													children: "Work Experience Rating (1-5)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex gap-1.5 items-center",
													children: [
														1,
														2,
														3,
														4,
														5
													].map((star) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setIntRating(star),
														className: "cursor-pointer",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-5 w-5 ${star <= intRating ? "text-primary fill-primary" : "text-muted-foreground"}` })
													}, star))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs text-muted-foreground",
													children: "Reporting Manager Feedback"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
													value: intMgrFeedback,
													onChange: (e) => setIntMgrFeedback(e.target.value),
													placeholder: "Review management and transitions...",
													className: "min-h-[50px] bg-background/50 border-border text-xs"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs text-muted-foreground",
													children: "Company Work Environment Feedback"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
													value: intCompFeedback,
													onChange: (e) => setIntCompFeedback(e.target.value),
													placeholder: "Review culture, growth opportunities...",
													className: "min-h-[50px] bg-background/50 border-border text-xs"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													className: "text-xs text-muted-foreground",
													children: "Suggestions for Improvement"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
													value: intSuggestions,
													onChange: (e) => setIntSuggestions(e.target.value),
													placeholder: "How can OFC360 retain talent better?",
													className: "min-h-[50px] bg-background/50 border-border text-xs"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "pt-2 flex justify-end",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													type: "button",
													onClick: () => handleSaveInterview(detailCase),
													className: "h-8 text-xs cursor-pointer",
													children: "Save Interview Responses"
												})
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 border-t border-border bg-muted/10 shrink-0 flex gap-2 justify-end",
								children: [detailCase.stage !== "completed" && detailCase.stage !== "cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => handleDeactivatePrompt(detailCase),
									className: "h-9 text-xs border-border bg-transparent hover:bg-destructive/10 hover:text-destructive cursor-pointer gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PowerOff, { className: "h-3.5 w-3.5" }), "Deactivate Login"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => {
										toast.success("Exit report exported as PDF.");
									},
									className: "h-9 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5" }), "Print PDF Summary"]
								})]
							})
						]
					})] })
				})
			})
		]
	});
}
//#endregion
export { ExitManagementPage, ExitManagementPage as default };
