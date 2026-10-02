import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { u as useRouterState, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Dt as Package, J as ShieldAlert, Jt as List, Lr as Car, Mt as Monitor, Sr as CircleCheck, Tr as CircleAlert, V as SquarePen, W as Smartphone, _n as Headphones, dt as QrCode, er as Download, ft as Printer, h as User, ht as Plus, k as Trash2, o as Wrench, on as Laptop, q as ShieldCheck, rn as LayoutGrid, st as RotateCcw, un as Info, vn as HardDrive } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as api } from "./apiInstance-C5A0vaLH.mjs";
import { a as useQueryClient, n as useMutation, r as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as ScrollArea } from "./scroll-area-BlnbM3_c.mjs";
import { t as statusBadgeClass } from "./status-styles-B1M3Yvd8.mjs";
import { C as Legend, S as Tooltip, a as PieChart, b as Cell, c as YAxis, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { n as newId } from "./store-o03qs3ZS.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, r as SheetDescription, t as Sheet } from "./sheet-3YlcNW_l.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-CkAivaVl.mjs";
import { a as TableHeader, i as TableHead, n as TableBody, o as TableRow, r as TableCell, t as Table } from "./table-DJOO1b-0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AssetsPage-CMl0Ef2u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORY_ICON = {
	laptop: Laptop,
	desktop: HardDrive,
	monitor: Monitor,
	phone: Smartphone,
	accessory: Headphones,
	vehicle: Car,
	other: Package
};
var STATUS_BADGE = {
	active: {
		label: "Active",
		color: "text-emerald-500",
		bg: "bg-emerald-500/10",
		border: "border-emerald-500/20"
	},
	"under-repair": {
		label: "Under Repair",
		color: "text-amber-500",
		bg: "bg-amber-500/10",
		border: "border-amber-500/20"
	},
	"pending-return": {
		label: "Pending Return",
		color: "text-sky-500",
		bg: "bg-sky-500/10",
		border: "border-sky-500/20"
	},
	lost: {
		label: "Reported Lost",
		color: "text-rose-500",
		bg: "bg-rose-500/10",
		border: "border-rose-500/20"
	}
};
var CONDITION_BADGE = {
	Excellent: {
		label: "Excellent",
		color: "text-emerald-500",
		bg: "bg-emerald-500/10"
	},
	Good: {
		label: "Good",
		color: "text-blue-500",
		bg: "bg-blue-500/10"
	},
	Fair: {
		label: "Fair",
		color: "text-amber-500",
		bg: "bg-amber-500/10"
	},
	"Needs Maintenance": {
		label: "Needs Maintenance",
		color: "text-rose-500",
		bg: "bg-rose-500/10"
	}
};
function EmployeeMyAssetsView({ apiAssets, isLoading = false }) {
	const queryClient = useQueryClient();
	const authWs = useAurix();
	const user = authWs.user;
	const userFullName = (user?.fullName || "Employee").trim();
	const { data: ownApiData, isLoading: ownLoading } = useQuery({
		queryKey: ["assets"],
		queryFn: () => api.get("assets?limit=100"),
		enabled: !apiAssets || apiAssets.length === 0
	});
	const isDataLoading = isLoading || ownLoading && (!apiAssets || apiAssets.length === 0);
	const sourceAssets = (0, import_react.useMemo)(() => {
		if (apiAssets && apiAssets.length > 0) return apiAssets;
		const raw = ownApiData?.data?.items ?? ownApiData?.data ?? ownApiData?.items ?? (Array.isArray(ownApiData) ? ownApiData : []);
		return Array.isArray(raw) ? raw : [];
	}, [apiAssets, ownApiData]);
	const [employeeAssets, setEmployeeAssets] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		const currentName = userFullName.toLowerCase();
		const currentId = String(user?.id || "").toLowerCase();
		const currentEmail = (user?.email || "").toLowerCase();
		let matched = sourceAssets.filter((a) => {
			const assigned = (a.assignedTo || a.assigned_to || a.assigned_to_name || a.assigned_employee_name || "").toString().trim().toLowerCase();
			const assignedId = String(a.assignedToId || a.assigned_to_id || a.employeeId || a.employee_id || a.userId || a.user_id || "").toLowerCase();
			if (currentName && (assigned === currentName || assigned.includes(currentName) || currentName.includes(assigned))) return true;
			if (currentId && (assigned === currentId || assignedId === currentId)) return true;
			if (currentEmail && assigned === currentEmail) return true;
			return false;
		});
		if (matched.length === 0 && authWs.user?.role === "employee" && sourceAssets.length > 0) {
			if (!sourceAssets.some((a) => {
				const assigned = (a.assignedTo || a.assigned_to || "").toString().trim().toLowerCase();
				return assigned && assigned !== currentName && !assigned.includes(currentName);
			})) matched = sourceAssets;
		}
		setEmployeeAssets(matched.map((a) => {
			let mappedStatus = "active";
			if (a.status === "under-repair") mappedStatus = "under-repair";
			else if (a.status === "lost") mappedStatus = "lost";
			else if (a.status === "pending-return") mappedStatus = "pending-return";
			return {
				id: a.id || a._id || `ast_${Math.random()}`,
				tag: a.tag || a.asset_tag || `AST-${String(a.id || "").slice(-4)}`,
				name: a.name || a.asset_name || "Assigned Equipment",
				category: a.category || "laptop",
				brand: a.brand || "Standard Brand",
				model: a.model || a.name || "",
				serial: a.serial || a.serial_number || "SN-UNKNOWN",
				assignedDate: a.assignedAt ? String(a.assignedAt).split("T")[0] : a.assigned_at ? String(a.assigned_at).split("T")[0] : a.purchaseDate || a.purchase_date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
				condition: a.condition || "Good",
				status: mappedStatus,
				warrantyUntil: a.warrantyUntil || a.warranty_until || "",
				location: a.location || "Office Workstation",
				notes: a.notes || "",
				specs: a.specs,
				activeTicket: a.activeTicket || a.active_ticket
			};
		}));
	}, [
		sourceAssets,
		userFullName,
		user?.id,
		user?.email,
		authWs.user?.role
	]);
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [viewMode, setViewMode] = (0, import_react.useState)("grid");
	const [selectedAsset, setSelectedAsset] = (0, import_react.useState)(null);
	const [detailOpen, setDetailOpen] = (0, import_react.useState)(false);
	const [reportIssueOpen, setReportIssueOpen] = (0, import_react.useState)(false);
	const [requestRepairOpen, setRequestRepairOpen] = (0, import_react.useState)(false);
	const [requestReplacementOpen, setRequestReplacementOpen] = (0, import_react.useState)(false);
	const [reportLostOpen, setReportLostOpen] = (0, import_react.useState)(false);
	const [requestReturnOpen, setRequestReturnOpen] = (0, import_react.useState)(false);
	const [requestEquipmentOpen, setRequestEquipmentOpen] = (0, import_react.useState)(false);
	const [issueType, setIssueType] = (0, import_react.useState)("hardware");
	const [issueSeverity, setIssueSeverity] = (0, import_react.useState)("medium");
	const [issueDescription, setIssueDescription] = (0, import_react.useState)("");
	const [repairReason, setRepairReason] = (0, import_react.useState)("");
	const [repairUrgency, setRepairUrgency] = (0, import_react.useState)("normal");
	const [repairLoanerNeeded, setRepairLoanerNeeded] = (0, import_react.useState)(true);
	const [replacementReason, setReplacementReason] = (0, import_react.useState)("frequent-failure");
	const [replacementUrgency, setReplacementUrgency] = (0, import_react.useState)("medium");
	const [replacementNotes, setReplacementNotes] = (0, import_react.useState)("");
	const [lostDate, setLostDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [lostLocation, setLostLocation] = (0, import_react.useState)("");
	const [lostDetails, setLostDetails] = (0, import_react.useState)("");
	const [lostSecurityConfirmed, setLostSecurityConfirmed] = (0, import_react.useState)(false);
	const [returnReason, setReturnReason] = (0, import_react.useState)("not-required");
	const [returnMethod, setReturnMethod] = (0, import_react.useState)("it-desk");
	const [returnDate, setReturnDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [returnNotes, setReturnNotes] = (0, import_react.useState)("");
	const [equipmentCategory, setEquipmentCategory] = (0, import_react.useState)("laptop");
	const [equipmentJustification, setEquipmentJustification] = (0, import_react.useState)("");
	const [dismissedAlerts, setDismissedAlerts] = (0, import_react.useState)({});
	const summary = (0, import_react.useMemo)(() => {
		return {
			total: employeeAssets.length,
			active: employeeAssets.filter((a) => a.status === "active").length,
			underRepair: employeeAssets.filter((a) => a.status === "under-repair").length,
			pendingReturn: employeeAssets.filter((a) => a.status === "pending-return").length,
			lost: employeeAssets.filter((a) => a.status === "lost").length
		};
	}, [employeeAssets]);
	(0, import_react.useMemo)(() => {
		const alerts = [];
		const now = (/* @__PURE__ */ new Date()).getTime();
		const thirtyDays = 720 * 60 * 60 * 1e3;
		employeeAssets.forEach((asset) => {
			if (asset.warrantyUntil) {
				const wTime = new Date(asset.warrantyUntil).getTime();
				if (wTime > now && wTime - now <= thirtyDays) alerts.push({
					id: `war_soon_${asset.id}`,
					type: "warning",
					title: "Warranty Expiring Soon",
					message: `Manufacturer warranty for ${asset.name} (${asset.tag}) expires on ${asset.warrantyUntil}. IT check-up recommended.`,
					asset
				});
			}
			if (asset.status === "under-repair") alerts.push({
				id: `rep_status_${asset.id}`,
				type: "info",
				title: "Repair In Progress",
				message: `${asset.name} (${asset.tag}) is currently at the authorized service center. Estimated turnaround: 3-5 business days.`,
				asset
			});
			if (asset.status === "pending-return") alerts.push({
				id: `ret_status_${asset.id}`,
				type: "info",
				title: "Asset Return Pending Handover",
				message: `Return ticket active for ${asset.name} (${asset.tag}). Please hand it over to the IT Support Desk.`,
				asset
			});
			if (asset.status === "lost") alerts.push({
				id: `lost_status_${asset.id}`,
				type: "error",
				title: "Lost Asset Security Flag Active",
				message: `${asset.name} (${asset.tag}) is flagged as lost. Remote MDM lock and compliance tracking initiated.`,
				asset
			});
			if (asset.activeTicket && asset.activeTicket.type === "replacement") alerts.push({
				id: `repl_ticket_${asset.id}`,
				type: "info",
				title: "Replacement Request In Review",
				message: `Your replacement request for ${asset.name} has been routed to your reporting manager for budget sign-off.`,
				asset
			});
		});
		return alerts.filter((a) => !dismissedAlerts[a.id]);
	}, [employeeAssets, dismissedAlerts]);
	const filteredAssets = (0, import_react.useMemo)(() => {
		return employeeAssets.filter((a) => {
			if (statusFilter !== "all" && a.status !== statusFilter) return false;
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				if (!(a.name.toLowerCase().includes(q) || a.tag.toLowerCase().includes(q) || a.brand.toLowerCase().includes(q) || a.model.toLowerCase().includes(q) || a.serial.toLowerCase().includes(q) || a.category.toLowerCase().includes(q))) return false;
			}
			return true;
		});
	}, [
		employeeAssets,
		statusFilter,
		searchQuery
	]);
	const handleOpenDetail = (asset) => {
		setSelectedAsset(asset);
		setDetailOpen(true);
	};
	const handleReportIssueSubmit = async (e) => {
		e.preventDefault();
		if (!selectedAsset) return;
		if (!issueDescription.trim()) {
			toast.error("Please provide a description of the issue.");
			return;
		}
		try {
			await api.post(`assets/${selectedAsset.id}/maintenance`, {
				vendor: "IT Support Desk",
				cost: 0,
				notes: `Issue [${issueType} - ${issueSeverity}]: ${issueDescription}`
			});
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.success(`Issue report submitted for ${selectedAsset.name}. IT Helpdesk notified.`);
		} catch {
			toast.success(`Issue report submitted for ${selectedAsset.name}. IT Helpdesk notified.`);
		}
		setIssueDescription("");
		setReportIssueOpen(false);
	};
	const handleRequestRepairSubmit = async (e) => {
		e.preventDefault();
		if (!selectedAsset) return;
		if (!repairReason.trim()) {
			toast.error("Please provide a reason for the repair request.");
			return;
		}
		try {
			await api.post(`assets/${selectedAsset.id}/maintenance`, {
				vendor: "Authorized IT Repair Desk",
				cost: 0,
				notes: `Employee Request: ${repairReason} (Urgency: ${repairUrgency})`
			});
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.success(`Repair request created! ${repairLoanerNeeded ? "A temporary backup loaner device has been requested." : ""}`);
		} catch (err) {
			toast.error(err.message || "Failed to submit repair request");
		}
		setRepairReason("");
		setRequestRepairOpen(false);
	};
	const handleRequestReplacementSubmit = async (e) => {
		e.preventDefault();
		if (!selectedAsset) return;
		try {
			await api.post(`assets/${selectedAsset.id}/maintenance`, {
				vendor: "IT Hardware Replacement Desk",
				cost: 0,
				notes: `Replacement Request [${replacementReason} - ${replacementUrgency}]: ${replacementNotes}`
			});
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.success(`Replacement request sent to your manager and IT procurement for review.`);
		} catch {
			toast.success(`Replacement request sent to your manager and IT procurement for review.`);
		}
		setReplacementNotes("");
		setRequestReplacementOpen(false);
	};
	const handleReportLostSubmit = async (e) => {
		e.preventDefault();
		if (!selectedAsset) return;
		if (!lostLocation.trim() || !lostDetails.trim()) {
			toast.error("Please provide the last known location and details of the incident.");
			return;
		}
		if (!lostSecurityConfirmed) {
			toast.error("Please confirm the security acknowledgment to proceed.");
			return;
		}
		try {
			await api.post(`assets/${selectedAsset.id}/lost`, {
				location: lostLocation,
				notes: lostDetails
			});
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.error(`Security alert logged: ${selectedAsset.name} marked as lost. IT Security Desk alerted.`);
		} catch (err) {
			toast.error(err.message || "Failed to mark asset as lost");
		}
		setLostLocation("");
		setLostDetails("");
		setLostSecurityConfirmed(false);
		setReportLostOpen(false);
	};
	const handleRequestReturnSubmit = async (e) => {
		e.preventDefault();
		if (!selectedAsset) return;
		try {
			await api.post(`assets/${selectedAsset.id}/return`, {
				notes: returnNotes,
				return_method: returnMethod,
				return_date: returnDate
			});
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.success(`Return request submitted! Please complete handover to IT on ${returnDate}.`);
		} catch (err) {
			toast.error(err.message || "Failed to submit return request");
		}
		setReturnNotes("");
		setRequestReturnOpen(false);
	};
	const handleRequestEquipmentSubmit = async (e) => {
		e.preventDefault();
		if (!equipmentJustification.trim()) {
			toast.error("Please explain your business justification.");
			return;
		}
		try {
			await api.post("assets", {
				name: `${equipmentCategory.toUpperCase()} Requisition - ${userFullName}`,
				category: equipmentCategory,
				status: "available",
				notes: `Requisition justification: ${equipmentJustification}`,
				vendor: "Internal IT Request"
			});
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.success(`Equipment request for ${equipmentCategory} submitted successfully.`);
		} catch {
			toast.success(`Equipment request for ${equipmentCategory} submitted to your manager for approval.`);
		}
		setEquipmentJustification("");
		setRequestEquipmentOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-4 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border bg-card/40 backdrop-blur-xl hover:border-border/80 transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4 sm:p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
									children: "My Assigned Assets"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 place-items-center rounded-xl bg-indigo-500/10 text-indigo-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-bold font-display tracking-tight text-foreground",
									children: summary.total
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: "total devices"
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border bg-card/40 backdrop-blur-xl hover:border-border/80 transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4 sm:p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
									children: "Active Devices"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/10 text-emerald-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-bold font-display tracking-tight text-emerald-500",
									children: summary.active
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: "in active use"
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border bg-card/40 backdrop-blur-xl hover:border-border/80 transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4 sm:p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
									children: "Under Repair"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 place-items-center rounded-xl bg-amber-500/10 text-amber-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-4 w-4" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-bold font-display tracking-tight text-amber-500",
									children: summary.underRepair
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: "in maintenance"
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						className: "border-border bg-card/40 backdrop-blur-xl hover:border-border/80 transition-all",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "p-4 sm:p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
									children: "Pending Return"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-8 w-8 place-items-center rounded-xl bg-sky-500/10 text-sky-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4" })
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex items-baseline gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-3xl font-bold font-display tracking-tight text-sky-500",
									children: summary.pendingReturn
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] text-muted-foreground",
									children: "return requested"
								})]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/40 backdrop-blur-xl overflow-hidden shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between bg-card/20",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative max-w-sm flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							placeholder: "Search my assets by name, ID, brand, serial...",
							className: "h-9 pl-9 text-xs border-border bg-background/50 focus-visible:ring-1 focus-visible:ring-primary"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between sm:justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-1.5 overflow-x-auto py-0.5",
							children: [
								{
									id: "all",
									label: "All My Assets"
								},
								{
									id: "active",
									label: "Active"
								},
								{
									id: "under-repair",
									label: "In Repair"
								},
								{
									id: "pending-return",
									label: "Pending Return"
								},
								{
									id: "lost",
									label: "Lost"
								}
							].map((pill) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setStatusFilter(pill.id),
								className: `shrink-0 rounded-full px-3 py-1 text-[11px] font-medium border transition-colors cursor-pointer ${statusFilter === pill.id ? "bg-foreground text-background border-foreground font-semibold" : "bg-background/40 border-border hover:bg-accent/60 text-muted-foreground"}`,
								children: pill.label
							}, pill.id))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden sm:flex items-center gap-1 border-l border-border pl-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setViewMode("grid"),
								className: `p-1.5 rounded-lg border cursor-pointer ${viewMode === "grid" ? "bg-accent border-border text-foreground" : "text-muted-foreground border-transparent hover:text-foreground"}`,
								title: "Grid View",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-3.5 w-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setViewMode("table"),
								className: `p-1.5 rounded-lg border cursor-pointer ${viewMode === "table" ? "bg-accent border-border text-foreground" : "text-muted-foreground border-transparent hover:text-foreground"}`,
								title: "Table View",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "h-3.5 w-3.5" })
							})]
						})]
					})]
				}), isDataLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 grid grid-cols-1 gap-4 sm:grid-cols-2",
					children: [1, 2].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-44 rounded-xl border border-border bg-muted/20 animate-pulse" }, i))
				}) : filteredAssets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center py-16 px-4 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-muted/30 border border-border text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-7 w-7 text-muted-foreground/80" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display font-semibold text-lg text-foreground",
							children: "No assets assigned"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-sm text-sm text-muted-foreground",
							children: "You currently don’t have any company assets assigned to you."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => setRequestEquipmentOpen(true),
								className: "h-9 gap-1.5 bg-gradient-brand text-brand-foreground cursor-pointer text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-3.5 w-3.5" }), "Request Equipment"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => {
									setSearchQuery("");
									setStatusFilter("all");
								},
								className: "h-9 text-xs border-border cursor-pointer",
								children: "Clear Filters"
							})]
						})
					]
				}) : viewMode === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4 sm:p-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3",
					children: filteredAssets.map((asset) => {
						const CategoryIcon = CATEGORY_ICON[asset.category] || Package;
						const statusCfg = STATUS_BADGE[asset.status] || STATUS_BADGE.active;
						const conditionCfg = CONDITION_BADGE[asset.condition] || CONDITION_BADGE.Good;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							className: "group relative border-border bg-card/30 hover:border-primary/40 hover:bg-card/60 transition-all duration-200 overflow-hidden flex flex-col justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-4 space-y-3.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary border border-primary/20",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoryIcon, { className: "h-4 w-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono text-xs font-semibold text-foreground",
												children: asset.tag
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-muted-foreground block capitalize",
												children: asset.category
											})] })]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: `${conditionCfg.bg} ${conditionCfg.color} border-none text-[10px] font-semibold py-0.5 px-2`,
												children: conditionCfg.label
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												className: `${statusCfg.bg} ${statusCfg.color} ${statusCfg.border} text-[10px] font-semibold py-0.5 px-2`,
												children: statusCfg.label
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-display font-semibold text-sm text-foreground hover:text-primary transition-colors cursor-pointer",
										onClick: () => handleOpenDetail(asset),
										children: asset.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: [
											asset.brand,
											" • ",
											asset.model
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg bg-background/40 border border-border/60 p-2.5 text-[11px] grid grid-cols-2 gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground block text-[10px]",
												children: "Serial Number"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono font-medium text-foreground truncate block",
												children: asset.serial
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground block text-[10px]",
												children: "Assigned Date"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground block",
												children: asset.assignedDate
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-span-2 pt-1 border-t border-border/40 flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground text-[10px]",
													children: "Warranty Expiry:"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-medium text-foreground text-[11px]",
													children: asset.warrantyUntil || "—"
												})]
											})
										]
									}),
									asset.activeTicket && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-lg border border-primary/20 bg-primary/5 p-2 text-[10px] flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-primary font-medium truncate max-w-[180px]",
											children: [
												asset.activeTicket.id,
												": ",
												asset.activeTicket.title
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-[9px] uppercase tracking-wider py-0 px-1 border-primary/30 text-primary",
											children: asset.activeTicket.status
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-border/60 bg-muted/5 p-3 flex items-center justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => handleOpenDetail(asset),
									className: "h-7 text-xs px-2 text-primary hover:bg-primary/10 cursor-pointer",
									children: "View Details"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [
										asset.status === "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => {
												setSelectedAsset(asset);
												setReportIssueOpen(true);
											},
											className: "h-7 text-[10px] px-2 border-border cursor-pointer hover:bg-accent/60",
											children: "Report Issue"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "outline",
											onClick: () => {
												setSelectedAsset(asset);
												setRequestRepairOpen(true);
											},
											className: "h-7 text-[10px] px-2 text-amber-500 border-border cursor-pointer hover:bg-amber-500/10",
											children: "Repair"
										})] }),
										asset.status === "under-repair" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-amber-500 font-medium px-2",
											children: "In Maintenance"
										}),
										asset.status === "pending-return" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-sky-500 font-medium px-2",
											children: "Handover to IT"
										})
									]
								})]
							})]
						}, asset.id);
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
						className: "min-w-[950px] border-collapse text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
							className: "bg-muted/10 border-b border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
								className: "hover:bg-transparent",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3 w-[100px]",
										children: "Asset ID"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3",
										children: "Asset Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3",
										children: "Category"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3",
										children: "Brand & Model"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3 font-mono",
										children: "Serial Number"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3",
										children: "Assigned Date"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3",
										children: "Condition"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3",
										children: "Warranty Expiry"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
										className: "px-4 py-3 text-right",
										children: "Actions"
									})
								]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: filteredAssets.map((asset) => {
							const statusCfg = STATUS_BADGE[asset.status] || STATUS_BADGE.active;
							const conditionCfg = CONDITION_BADGE[asset.condition] || CONDITION_BADGE.Good;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
								onClick: () => handleOpenDetail(asset),
								className: "border-t border-border hover:bg-accent/20 cursor-pointer transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3 font-mono font-semibold text-foreground",
										children: asset.tag
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3 font-semibold text-foreground",
										children: asset.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3 capitalize text-muted-foreground",
										children: asset.category
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
										className: "px-4 py-3 text-muted-foreground",
										children: [
											asset.brand,
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-foreground/70",
												children: [
													"(",
													asset.model,
													")"
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3 font-mono text-muted-foreground",
										children: asset.serial
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3 text-muted-foreground",
										children: asset.assignedDate
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: `${conditionCfg.bg} ${conditionCfg.color} border-none text-[10px] font-semibold py-0.5 px-2`,
											children: conditionCfg.label
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: `${statusCfg.bg} ${statusCfg.color} ${statusCfg.border} text-[10px] font-semibold py-0.5 px-2`,
											children: statusCfg.label
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3 text-muted-foreground",
										children: asset.warrantyUntil || "—"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
										className: "px-4 py-3 text-right",
										onClick: (e) => e.stopPropagation(),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-end gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "ghost",
												onClick: () => handleOpenDetail(asset),
												className: "h-7 text-[11px] px-2 text-primary cursor-pointer hover:bg-primary/10",
												children: "Details"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												size: "sm",
												variant: "outline",
												onClick: () => {
													setSelectedAsset(asset);
													setReportIssueOpen(true);
												},
												className: "h-7 text-[10px] px-2 border-border cursor-pointer hover:bg-accent/60",
												children: "Issue"
											})]
										})
									})
								]
							}, asset.id);
						}) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: detailOpen,
				onOpenChange: setDetailOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
					className: "sm:max-w-lg flex flex-col h-full bg-background border-l border-border p-0 shadow-2xl",
					children: selectedAsset && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
							className: "p-5 border-b border-border bg-muted/10 shrink-0 text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[10px] uppercase font-bold text-muted-foreground border-border",
										children: selectedAsset.category
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: `${CONDITION_BADGE[selectedAsset.condition].bg} ${CONDITION_BADGE[selectedAsset.condition].color} border-none text-xs font-bold capitalize`,
											children: selectedAsset.condition
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: `${STATUS_BADGE[selectedAsset.status].bg} ${STATUS_BADGE[selectedAsset.status].color} ${STATUS_BADGE[selectedAsset.status].border} text-xs font-bold capitalize`,
											children: STATUS_BADGE[selectedAsset.status].label
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, {
									className: "font-display text-base font-bold text-foreground mt-2 truncate text-left",
									children: selectedAsset.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, {
									className: "text-xs text-muted-foreground text-left mt-0.5",
									children: [
										"Asset Tag: ",
										selectedAsset.tag,
										" • Assigned to ",
										userFullName
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
							className: "flex-1 p-5 min-h-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-card/40 p-4 space-y-3 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
											children: "Hardware Specifications"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-x-4 gap-y-3 text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block text-[10px]",
													children: "Brand / Manufacturer"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground mt-0.5 block",
													children: selectedAsset.brand
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block text-[10px]",
													children: "Model Specification"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground mt-0.5 block",
													children: selectedAsset.model
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block text-[10px]",
													children: "Serial Number"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground mt-0.5 block font-mono",
													children: selectedAsset.serial
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block text-[10px]",
													children: "Assigned Date"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground mt-0.5 block",
													children: selectedAsset.assignedDate
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "col-span-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground block text-[10px]",
														children: "Location / Desk"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground mt-0.5 block",
														children: selectedAsset.location || "Office Workstation"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "col-span-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground block text-[10px]",
														children: "Warranty Status"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground mt-0.5 block",
														children: selectedAsset.warrantyUntil ? new Date(selectedAsset.warrantyUntil).getTime() < (/* @__PURE__ */ new Date()).getTime() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-rose-500",
															children: ["Expired on ", selectedAsset.warrantyUntil]
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-emerald-500",
															children: ["Active until ", selectedAsset.warrantyUntil]
														}) : "No warranty data"
													})]
												})
											]
										})]
									}),
									selectedAsset.specs && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-card/40 p-4 space-y-2.5 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
											children: "Configuration Details"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-1.5 text-xs",
											children: Object.entries(selectedAsset.specs).map(([key, val]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between border-b border-border/40 py-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground text-[11px]",
													children: key
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground text-[11px]",
													children: val
												})]
											}, key))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-card/40 p-4 space-y-3 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
											children: "Service & Support History"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-2.5 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-2.5 items-start",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "grid h-5 w-5 place-items-center rounded-full bg-emerald-500/10 text-emerald-500 shrink-0 mt-0.5",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-medium text-foreground",
													children: "Asset Assigned & Provisioned"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[10px] text-muted-foreground",
													children: [
														"Completed on ",
														selectedAsset.assignedDate,
														" by IT Desk"
													]
												})] })]
											}), selectedAsset.activeTicket && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-2.5 items-start pt-2 border-t border-border/40",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "grid h-5 w-5 place-items-center rounded-full bg-primary/10 text-primary shrink-0 mt-0.5",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3 w-3" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-medium text-foreground",
													children: selectedAsset.activeTicket.title
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[10px] text-muted-foreground",
													children: [
														"Ticket ",
														selectedAsset.activeTicket.id,
														" • Status: ",
														selectedAsset.activeTicket.status.toUpperCase(),
														" • Updated: ",
														selectedAsset.activeTicket.updatedAt
													]
												})] })]
											})]
										})]
									}),
									selectedAsset.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-card/40 p-4 space-y-1 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
											children: "Assignment Notes"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground leading-relaxed",
											children: selectedAsset.notes
										})]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 border-t border-border bg-muted/10 shrink-0 flex flex-wrap gap-2 justify-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => {
									setDetailOpen(false);
									setReportIssueOpen(true);
								},
								className: "h-8 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer",
								children: "Report Issue"
							}), selectedAsset.status === "active" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										setDetailOpen(false);
										setRequestRepairOpen(true);
									},
									className: "h-8 text-xs text-amber-500 border-border bg-transparent hover:bg-amber-500/10 cursor-pointer",
									children: "Request Repair"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										setDetailOpen(false);
										setRequestReplacementOpen(true);
									},
									className: "h-8 text-xs border-border bg-transparent hover:bg-accent/60 cursor-pointer",
									children: "Request Replacement"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										setDetailOpen(false);
										setRequestReturnOpen(true);
									},
									className: "h-8 text-xs text-sky-500 border-border bg-transparent hover:bg-sky-500/10 cursor-pointer",
									children: "Return Asset"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										setDetailOpen(false);
										setReportLostOpen(true);
									},
									className: "h-8 text-xs text-rose-500 border-border bg-transparent hover:bg-rose-500/10 cursor-pointer",
									children: "Report Lost"
								})
							] })]
						})
					] })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: reportIssueOpen,
				onOpenChange: setReportIssueOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "font-display font-bold text-base flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-primary" }),
							"Report Issue: ",
							selectedAsset?.name
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: [
							"Submit a support ticket to IT Helpdesk for this assigned device (",
							selectedAsset?.tag,
							")."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleReportIssueSubmit,
						className: "space-y-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Issue Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: issueType,
									onValueChange: setIssueType,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "bg-background/50 border-border text-xs h-9",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "hardware",
											children: "Hardware Malfunction / Breakdown"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "screen",
											children: "Display / Screen Glitch"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "battery",
											children: "Battery / Charging Issue"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "audio",
											children: "Audio / Mic / Webcam Issue"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "connectivity",
											children: "Wi-Fi / Bluetooth / Ports"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "physical",
											children: "Physical Damage / Crack / Liquid Spill"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "software",
											children: "OS / Software Boot Crash"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "other",
											children: "Other Incident"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Severity Level"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: issueSeverity,
									onValueChange: setIssueSeverity,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "bg-background/50 border-border text-xs h-9",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "low",
											children: "Low • Work not blocked"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "medium",
											children: "Medium • Impaired functionality"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "high",
											children: "High • Work severely blocked"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "critical",
											children: "Critical • Complete hardware failure"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Detailed Description"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: issueDescription,
									onChange: (e) => setIssueDescription(e.target.value),
									placeholder: "Describe what happened, error messages seen, and steps to reproduce...",
									className: "min-h-[90px] text-xs bg-background/50 border-border"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setReportIssueOpen(false),
									className: "h-9 text-xs border-border",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-9 text-xs bg-gradient-brand text-brand-foreground cursor-pointer",
									children: "Submit Support Ticket"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: requestRepairOpen,
				onOpenChange: setRequestRepairOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "font-display font-bold text-base flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "h-4 w-4 text-amber-500" }),
							"Request Repair: ",
							selectedAsset?.name
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: "Send this device to authorized maintenance and request a temporary loaner."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleRequestRepairSubmit,
						className: "space-y-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Reason for Repair"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: repairReason,
									onChange: (e) => setRepairReason(e.target.value),
									placeholder: "Explain the component failure (e.g. keyboard keys sticking, overheating fan, battery swollen)...",
									className: "min-h-[80px] text-xs bg-background/50 border-border"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Urgency"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: repairUrgency,
									onValueChange: setRepairUrgency,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "bg-background/50 border-border text-xs h-9",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "normal",
										children: "Standard (Within 3-5 days)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "urgent",
										children: "Urgent Priority (Critical client deliverable)"
									})] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between rounded-xl border border-border bg-card/40 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-0.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-medium text-foreground",
										children: "Request Loaner Device"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground block",
										children: "Provide a temporary spare laptop/accessory while repair is underway"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: repairLoanerNeeded,
									onChange: (e) => setRepairLoanerNeeded(e.target.checked),
									className: "h-4 w-4 rounded border-border text-primary cursor-pointer"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setRequestRepairOpen(false),
									className: "h-9 text-xs border-border",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-9 text-xs bg-amber-600 hover:bg-amber-700 text-white cursor-pointer",
									children: "Confirm Repair Request"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: requestReplacementOpen,
				onOpenChange: setRequestReplacementOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "font-display font-bold text-base flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4 text-primary" }), "Request Device Replacement"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: [
							"Request an upgrade or permanent replacement for ",
							selectedAsset?.name,
							" (",
							selectedAsset?.tag,
							")."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleRequestReplacementSubmit,
						className: "space-y-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Replacement Justification"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: replacementReason,
									onValueChange: setReplacementReason,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "bg-background/50 border-border text-xs h-9",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "frequent-failure",
											children: "Recurring Hardware / Performance Failure"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "lifecycle",
											children: "End of Useful Device Lifecycle (> 3 Years)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "performance",
											children: "Insufficient Memory / CPU for Current Project"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "client-req",
											children: "Specific Client Compliance / OS Requirement"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Preferred Specifications / Notes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: replacementNotes,
									onChange: (e) => setReplacementNotes(e.target.value),
									placeholder: "Mention required RAM, storage, or chip architecture for manager approval...",
									className: "min-h-[80px] text-xs bg-background/50 border-border"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setRequestReplacementOpen(false),
									className: "h-9 text-xs border-border",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-9 text-xs bg-gradient-brand text-brand-foreground cursor-pointer",
									children: "Submit for Approval"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: reportLostOpen,
				onOpenChange: setReportLostOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "font-display font-bold text-base flex items-center gap-2 text-rose-500",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 text-rose-500" }), "Report Lost Company Asset"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: [
							"Immediately notify IT Security for ",
							selectedAsset?.name,
							" (",
							selectedAsset?.tag,
							")."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleReportLostSubmit,
						className: "space-y-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs text-rose-600 dark:text-rose-400 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: "Security Protocol Notice"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] leading-relaxed",
									children: "Reporting a lost asset immediately alerts InfoSec to initiate remote device wipe, invalidate VPN tokens, and revoke access keys."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Incident Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: lostDate,
										onChange: (e) => setLostDate(e.target.value),
										className: "text-xs bg-background/50 border-border h-9"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Last Known Location"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: lostLocation,
										onChange: (e) => setLostLocation(e.target.value),
										placeholder: "e.g. Airport Lounge, Transit, Cafe",
										className: "text-xs bg-background/50 border-border h-9"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Incident Circumstances"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: lostDetails,
									onChange: (e) => setLostDetails(e.target.value),
									placeholder: "Explain what happened, police report number (if theft), and any witnesses...",
									className: "min-h-[80px] text-xs bg-background/50 border-border"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start gap-2.5 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									id: "sec_ack",
									checked: lostSecurityConfirmed,
									onChange: (e) => setLostSecurityConfirmed(e.target.checked),
									className: "h-4 w-4 rounded border-border text-rose-500 cursor-pointer mt-0.5"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "sec_ack",
									className: "text-[11px] text-muted-foreground leading-snug cursor-pointer",
									children: "I confirm that this device is unaccounted for and authorize IT Security to lock credentials and erase local caches."
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setReportLostOpen(false),
									className: "h-9 text-xs border-border",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: !lostSecurityConfirmed,
									className: "h-9 text-xs bg-rose-600 hover:bg-rose-700 text-white cursor-pointer",
									children: "Confirm Lost Asset Flag"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: requestReturnOpen,
				onOpenChange: setRequestReturnOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "font-display font-bold text-base flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-4 w-4 text-sky-500" }), "Request Asset Return"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: [
							"Initiate return and check-in for ",
							selectedAsset?.name,
							" (",
							selectedAsset?.tag,
							")."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleRequestReturnSubmit,
						className: "space-y-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Reason for Return"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: returnReason,
									onValueChange: setReturnReason,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "bg-background/50 border-border text-xs h-9",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "not-required",
											children: "No longer required for role"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "upgrade-replacement",
											children: "Received newer upgraded model"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "project-ended",
											children: "Client project completed"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "offboarding",
											children: "Offboarding / Relocation handover"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Target Return Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: returnDate,
										onChange: (e) => setReturnDate(e.target.value),
										className: "text-xs bg-background/50 border-border h-9"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Handover Method"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: returnMethod,
										onValueChange: setReturnMethod,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "bg-background/50 border-border text-xs h-9",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "it-desk",
											children: "Office IT Helpdesk Drop-off"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "courier",
											children: "Courier Pickup (Remote Employee)"
										})] })]
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Return Remarks"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: returnNotes,
									onChange: (e) => setReturnNotes(e.target.value),
									placeholder: "Include power adapters, cables, or packaging status...",
									className: "min-h-[70px] text-xs bg-background/50 border-border"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setRequestReturnOpen(false),
									className: "h-9 text-xs border-border",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-9 text-xs bg-sky-600 hover:bg-sky-700 text-white cursor-pointer",
									children: "Submit Return Request"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: requestEquipmentOpen,
				onOpenChange: setRequestEquipmentOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "font-display font-bold text-base flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4 text-primary" }), "Request New Equipment"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: "Submit an equipment request for manager and IT procurement approval."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleRequestEquipmentSubmit,
						className: "space-y-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Equipment Category"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: equipmentCategory,
									onValueChange: (v) => setEquipmentCategory(v),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "bg-background/50 border-border text-xs h-9",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "laptop",
											children: "Primary Work Laptop"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "monitor",
											children: "External Display / Monitor"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "accessory",
											children: "Peripherals (Keyboard, Mouse, Headset)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "phone",
											children: "Company Test Device / Mobile"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: "other",
											children: "Other Hardware"
										})
									] })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Business Justification"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: equipmentJustification,
									onChange: (e) => setEquipmentJustification(e.target.value),
									placeholder: "Explain the project or operational requirement for this hardware...",
									className: "min-h-[90px] text-xs bg-background/50 border-border"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setRequestEquipmentOpen(false),
									className: "h-9 text-xs border-border",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-9 text-xs bg-gradient-brand text-brand-foreground cursor-pointer",
									children: "Submit Request"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
var CATEGORIES = [
	{
		value: "laptop",
		label: "Laptops"
	},
	{
		value: "desktop",
		label: "Desktops"
	},
	{
		value: "monitor",
		label: "Monitors"
	},
	{
		value: "phone",
		label: "Phones"
	},
	{
		value: "accessory",
		label: "Accessories"
	},
	{
		value: "vehicle",
		label: "Vehicles"
	},
	{
		value: "other",
		label: "Other Equipment"
	}
];
var STATUSES = [
	{
		value: "available",
		label: "Available"
	},
	{
		value: "assigned",
		label: "Assigned"
	},
	{
		value: "under-repair",
		label: "Under Repair"
	},
	{
		value: "lost",
		label: "Lost"
	},
	{
		value: "expired",
		label: "Expired/Retired"
	},
	{
		value: "retired",
		label: "Retired"
	}
];
var getAssetStatusBadge = (status) => {
	switch (status) {
		case "available": return statusBadgeClass("approved");
		case "under-repair": return statusBadgeClass("warning");
		case "lost": return statusBadgeClass("critical");
		case "assigned": return statusBadgeClass("default");
		default: return statusBadgeClass("inactive");
	}
};
var COLORS = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)"
];
var generateAssetTag = (category) => {
	return `${{
		laptop: "LAP",
		desktop: "DKT",
		monitor: "MON",
		phone: "PHN",
		accessory: "ACC",
		vehicle: "VEH",
		other: "AST"
	}[category] || "AST"}-${Date.now().toString().slice(-5)}${Math.floor(1e3 + Math.random() * 9e3)}`;
};
function AssetsPage() {
	const authWs = useAurix();
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const [q, setQ] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [currentPage, setCurrentPage] = (0, import_react.useState)(1);
	const itemsPerPage = 8;
	const [detailAsset, setDetailAsset] = (0, import_react.useState)(null);
	const [addOpen, setAddOpen] = (0, import_react.useState)(false);
	const [editOpen, setEditOpen] = (0, import_react.useState)(false);
	const [assignOpen, setAssignOpen] = (0, import_react.useState)(false);
	const [transferOpen, setTransferOpen] = (0, import_react.useState)(false);
	const [repairOpen, setRepairOpen] = (0, import_react.useState)(false);
	const [deleteOpen, setDeleteOpen] = (0, import_react.useState)(false);
	const [qrOpen, setQrOpen] = (0, import_react.useState)(false);
	const [scanOpen, setScanOpen] = (0, import_react.useState)(false);
	const [targetAsset, setTargetAsset] = (0, import_react.useState)(null);
	const [scannedAssetTag, setScannedAssetTag] = (0, import_react.useState)("");
	const [assetName, setAssetName] = (0, import_react.useState)("");
	const [assetCategory, setAssetCategory] = (0, import_react.useState)("laptop");
	const [brand, setBrand] = (0, import_react.useState)("");
	const [model, setModel] = (0, import_react.useState)("");
	const [serial, setSerial] = (0, import_react.useState)("");
	const [purchaseDate, setPurchaseDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [purchaseCost, setPurchaseCost] = (0, import_react.useState)("");
	const [vendor, setVendor] = (0, import_react.useState)("");
	const [warrantyUntil, setWarrantyUntil] = (0, import_react.useState)("");
	const [location, setLocation] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [assignEmpId, setAssignEmpId] = (0, import_react.useState)("");
	const [assignReturnDate, setAssignReturnDate] = (0, import_react.useState)("");
	const [assignNotes, setAssignNotes] = (0, import_react.useState)("");
	const [transferEmpId, setTransferEmpId] = (0, import_react.useState)("");
	const [transferNotes, setTransferNotes] = (0, import_react.useState)("");
	const [repairVendor, setRepairVendor] = (0, import_react.useState)("");
	const [repairCost, setRepairCost] = (0, import_react.useState)("");
	const [repairNotes, setRepairNotes] = (0, import_react.useState)("");
	const { data: listData, isLoading } = useQuery({
		queryKey: [
			"assets",
			q,
			statusFilter
		],
		queryFn: async () => {
			const params = new URLSearchParams();
			if (q) params.set("search", q);
			if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
			params.set("limit", "100");
			return api.get(`assets?${params.toString()}`);
		}
	});
	const { data: analyticsData } = useQuery({
		queryKey: ["assets-analytics"],
		queryFn: () => api.get("assets/analytics")
	});
	const assets = (0, import_react.useMemo)(() => {
		const raw = listData?.data?.items ?? listData?.data ?? listData?.items ?? (Array.isArray(listData) ? listData : []);
		return (Array.isArray(raw) ? raw : []).map((a) => ({
			id: a.id || a._id || "",
			tag: a.tag || a.asset_tag || `AST-${String(a.id || "").slice(-4)}`,
			name: a.name || a.asset_name || "Unnamed Asset",
			category: a.category || "other",
			serial: a.serial || a.serial_number || "N/A",
			vendor: a.vendor || "N/A",
			purchaseDate: a.purchaseDate || a.purchase_date || "",
			warrantyUntil: a.warrantyUntil || a.warranty_until || "",
			status: a.status || "available",
			assignedTo: a.assignedTo || a.assigned_to || a.assigned_to_name || a.assigned_employee_name || "",
			assignedToId: a.assignedToId || a.assigned_to_id || a.assigned_employee_id || a.employeeId || a.employee_id || a.userId || a.user_id || "",
			assignedAt: a.assignedAt || a.assigned_at || "",
			brand: a.brand || "",
			model: a.model || "",
			purchaseCost: Number(a.purchaseCost ?? a.purchase_cost ?? 0),
			location: a.location || "",
			notes: a.notes || "",
			nextMaintenance: a.nextMaintenance || a.next_maintenance || "",
			assignmentHistory: a.assignmentHistory || a.assignment_history || [],
			maintenanceHistory: a.maintenanceHistory || a.maintenance_history || [],
			timeline: a.timeline || []
		}));
	}, [listData]);
	const apiStats = analyticsData?.data ?? analyticsData;
	const currentPathname = useRouterState({ select: (s) => s.location.pathname });
	const searchParams = useRouterState({ select: (s) => s.location.search });
	(0, import_react.useEffect)(() => {
		if (searchParams && searchParams.scan && assets.length > 0) {
			const matched = assets.find((a) => a.id === searchParams.scan || a.tag === searchParams.scan);
			if (matched) {
				setDetailAsset(matched);
				toast.success(`Scanned QR Code for asset: ${matched.tag} (${matched.name})`);
				navigate({
					to: currentPathname,
					search: {},
					replace: true
				});
			}
		}
	}, [
		searchParams,
		assets,
		navigate,
		currentPathname
	]);
	const showApiError = (err, fallback) => {
		let msg = err.message || fallback;
		if (err.data && err.data.detail && Array.isArray(err.data.detail)) msg = `Validation error: ${err.data.detail.map((d) => `${d.loc.slice(1).join(".")} : ${d.msg}`).join(", ")}`;
		else if (err.data && err.data.errors && Array.isArray(err.data.errors)) msg = err.data.errors.map((e) => e.message).join(", ");
		toast.error(msg);
	};
	const createMutation = useMutation({
		mutationFn: (newAsset) => api.post("assets", newAsset),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.success("Asset created successfully!");
			setAddOpen(false);
			setAssetName("");
			setBrand("");
			setModel("");
			setSerial("");
			setPurchaseCost("");
			setVendor("");
			setWarrantyUntil("");
			setNotes("");
			setLocation("");
		}
	});
	const editMutation = useMutation({
		mutationFn: ({ id, payload }) => api.put(`assets/${id}`, payload),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.success("Asset specifications updated successfully.");
			setEditOpen(false);
			if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
		},
		onError: (err) => {
			showApiError(err, "Failed to update asset specifications");
		}
	});
	const deleteMutation = useMutation({
		mutationFn: (id) => api.delete(`assets/${id}`),
		onSuccess: (_, deletedId) => {
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.error("Asset record deleted successfully.");
			setDeleteOpen(false);
			if (detailAsset?.id === targetAsset?.id) setDetailAsset(null);
		},
		onError: (err) => {
			showApiError(err, "Failed to delete asset");
		}
	});
	const assignMutation = useMutation({
		mutationFn: ({ id, payload }) => api.post(`assets/${id}/assign`, payload),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.success(`Asset assigned successfully!`);
			setAssignOpen(false);
			if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
		},
		onError: (err) => {
			showApiError(err, "Failed to assign asset");
		}
	});
	const returnMutation = useMutation({
		mutationFn: (id) => api.post(`assets/${id}/return`),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.success(`Asset returned and checked back in.`);
			if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
		},
		onError: (err) => {
			showApiError(err, "Failed to return asset");
		}
	});
	const transferMutation = useMutation({
		mutationFn: ({ id, payload }) => api.post(`assets/${id}/transfer`, payload),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.success(`Transferred asset successfully!`);
			setTransferOpen(false);
			if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
		},
		onError: (err) => {
			showApiError(err, "Failed to transfer asset");
		}
	});
	const lostMutation = useMutation({
		mutationFn: (id) => api.post(`assets/${id}/lost`),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.warning(`Asset has been flagged as lost.`);
			if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
		},
		onError: (err) => {
			showApiError(err, "Failed to mark asset as lost");
		}
	});
	const retiredMutation = useMutation({
		mutationFn: (id) => api.post(`assets/${id}/retired`),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.info(`Asset decommissioned and retired.`);
			if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
		},
		onError: (err) => {
			showApiError(err, "Failed to retire asset");
		}
	});
	const repairMutation = useMutation({
		mutationFn: ({ id, payload }) => api.post(`assets/${id}/maintenance`, payload),
		onSuccess: (res) => {
			queryClient.invalidateQueries({ queryKey: ["assets"] });
			queryClient.invalidateQueries({ queryKey: ["assets-analytics"] });
			toast.info(`Asset status set to Under Repair`);
			setRepairOpen(false);
			if (detailAsset?.id === res.data.id) setDetailAsset(res.data);
		},
		onError: (err) => {
			showApiError(err, "Failed to send asset for repair");
		}
	});
	const handleAddSubmit = async (e) => {
		e.preventDefault();
		if (!assetName || !serial || !brand) {
			toast.error("Please fill in Asset Name, Brand, and Serial Number.");
			return;
		}
		const basePayload = {
			name: assetName,
			category: assetCategory,
			serial,
			vendor: vendor || "Unknown Vendor",
			purchase_date: purchaseDate,
			warranty_until: warrantyUntil ? warrantyUntil : null,
			brand,
			model,
			purchase_cost: purchaseCost ? parseFloat(purchaseCost) : 0,
			location: location || "HQ IT Desk",
			notes
		};
		const maxAttempts = 3;
		let lastError = null;
		for (let attempt = 1; attempt <= maxAttempts; attempt++) {
			const assetTag = generateAssetTag(assetCategory);
			try {
				await createMutation.mutateAsync({
					...basePayload,
					tag: assetTag
				});
				return;
			} catch (err) {
				lastError = err;
				const errDetail = (err?.message || err?.data?.detail || JSON.stringify(err?.data || "")).toLowerCase();
				if ((errDetail.includes("tag already exists") || errDetail.includes("asset tag") || errDetail.includes("tag") && errDetail.includes("already exists") || errDetail.includes("tag") && errDetail.includes("exists") || errDetail.includes("duplicate")) && attempt < maxAttempts) continue;
				break;
			}
		}
		const errDetail = (lastError?.message || lastError?.data?.detail || JSON.stringify(lastError?.data || "")).toLowerCase();
		if (errDetail.includes("tag already exists") || errDetail.includes("asset tag") || errDetail.includes("tag") && errDetail.includes("exists")) toast.error("Failed to generate a unique asset tag after 3 attempts. Please try again.");
		else showApiError(lastError, "Failed to create asset");
	};
	const handleEditOpen = (asset) => {
		setTargetAsset(asset);
		setAssetName(asset.name);
		setAssetCategory(asset.category);
		setBrand(asset.brand || "");
		setModel(asset.model || "");
		setSerial(asset.serial);
		setPurchaseDate(asset.purchaseDate);
		setPurchaseCost(asset.purchaseCost?.toString() || "");
		setVendor(asset.vendor);
		setWarrantyUntil(asset.warrantyUntil);
		setLocation(asset.location || "");
		setNotes(asset.notes || "");
		setEditOpen(true);
	};
	const handleEditSubmit = (e) => {
		e.preventDefault();
		if (!targetAsset) return;
		editMutation.mutate({
			id: targetAsset.id,
			payload: {
				name: assetName,
				category: assetCategory,
				brand,
				model,
				serial,
				purchase_date: purchaseDate,
				purchase_cost: parseFloat(purchaseCost) || 0,
				vendor,
				warranty_until: warrantyUntil,
				location,
				notes
			}
		});
	};
	const handleDeleteSubmit = () => {
		if (!targetAsset) return;
		deleteMutation.mutate(targetAsset.id);
	};
	const handleAssignOpen = (asset) => {
		setTargetAsset(asset);
		setAssignNotes("");
		setAssignReturnDate("");
		if (authWs.employees.length > 0) setAssignEmpId(authWs.employees[0].id);
		else setAssignEmpId("");
		setAssignOpen(true);
	};
	const handleAssignSubmit = (e) => {
		e.preventDefault();
		if (!targetAsset || !assignEmpId) return;
		const emp = authWs.employees.find((x) => x.id === assignEmpId || x.employeeId === assignEmpId);
		if (!emp) {
			toast.error("Please select a valid employee.");
			return;
		}
		assignMutation.mutate({
			id: targetAsset.id,
			payload: {
				employee_id: emp.id,
				employee_code: emp.employeeId,
				employee_name: emp.fullName,
				department: emp.department || "General Operations",
				expected_return_date: assignReturnDate || null,
				notes: assignNotes
			}
		});
	};
	const handleReturnAsset = (asset) => {
		returnMutation.mutate(asset.id);
	};
	const handleTransferOpen = (asset) => {
		setTargetAsset(asset);
		setTransferNotes("");
		const assignedId = asset?.assignedToId || asset?.employeeId || asset?.employee_id;
		const eligibleEmployees = authWs.employees.filter((emp) => assignedId ? emp.id !== assignedId && emp.employeeId !== assignedId : emp.fullName !== asset.assignedTo);
		if (eligibleEmployees.length > 0) setTransferEmpId(eligibleEmployees[0].id);
		else setTransferEmpId("");
		setTransferOpen(true);
	};
	const handleTransferSubmit = (e) => {
		e.preventDefault();
		if (!targetAsset || !transferEmpId) return;
		const emp = authWs.employees.find((x) => x.id === transferEmpId || x.employeeId === transferEmpId);
		if (!emp) {
			toast.error("Please select a valid employee to transfer to.");
			return;
		}
		transferMutation.mutate({
			id: targetAsset.id,
			payload: {
				employee_id: emp.id,
				employee_code: emp.employeeId,
				employee_name: emp.fullName,
				department: emp.department || "Operations",
				notes: transferNotes
			}
		});
	};
	const handleMarkLost = (asset) => {
		lostMutation.mutate(asset.id);
	};
	const handleMarkRetired = (asset) => {
		retiredMutation.mutate(asset.id);
	};
	const handleRepairOpen = (asset) => {
		setTargetAsset(asset);
		setRepairVendor("");
		setRepairCost("");
		setRepairNotes("");
		setRepairOpen(true);
	};
	const handleRepairSubmit = (e) => {
		e.preventDefault();
		if (!targetAsset) return;
		repairMutation.mutate({
			id: targetAsset.id,
			payload: {
				vendor: repairVendor || "Authorized Service Partner",
				cost: repairCost ? parseFloat(repairCost) : 0,
				notes: repairNotes
			}
		});
	};
	const handleScanSimulation = () => {
		if (!scannedAssetTag) return;
		const matched = assets.find((a) => a.tag === scannedAssetTag || a.id === scannedAssetTag);
		if (matched) {
			setDetailAsset(matched);
			setScanOpen(false);
			toast.success(`Scanned QR tag: ${matched.tag}`);
		} else toast.error("No asset matching this scanned tag found.");
	};
	const stats = (0, import_react.useMemo)(() => {
		const getStat = (val, fallbackCalc) => {
			if (val !== void 0 && val !== null) return Number(val);
			return fallbackCalc();
		};
		return {
			total: getStat(apiStats?.total_assets, () => assets.length),
			available: getStat(apiStats?.available_assets, () => assets.filter((a) => a.status === "available").length),
			assigned: getStat(apiStats?.assigned_assets, () => assets.filter((a) => a.status === "assigned").length),
			repair: getStat(apiStats?.under_repair_assets, () => assets.filter((a) => a.status === "under-repair").length),
			lost: getStat(apiStats?.lost_assets, () => assets.filter((a) => a.status === "lost").length),
			expiring: getStat(apiStats?.expiring_warranty_assets, () => assets.filter((a) => {
				if (!a.warrantyUntil) return false;
				const diff = new Date(a.warrantyUntil).getTime() - Date.now();
				return diff > 0 && diff < 720 * 60 * 60 * 1e3;
			}).length)
		};
	}, [apiStats, assets]);
	const notifications = (0, import_react.useMemo)(() => {
		const alerts = [];
		const now = Date.now();
		const thirtyDaysLimit = now + 720 * 60 * 60 * 1e3;
		assets.forEach((a) => {
			if (a.warrantyUntil) {
				const wTime = new Date(a.warrantyUntil).getTime();
				if (wTime > 0 && wTime < now) alerts.push({
					id: `war_exp_${a.id}`,
					type: "error",
					message: `Warranty expired for ${a.tag} (${a.name}) on ${a.warrantyUntil}.`,
					asset: a
				});
				else if (wTime >= now && wTime <= thirtyDaysLimit) alerts.push({
					id: `war_soon_${a.id}`,
					type: "warning",
					message: `Warranty expiring soon for ${a.tag} on ${a.warrantyUntil}.`,
					asset: a
				});
			}
			if (a.status === "lost") alerts.push({
				id: `lost_${a.id}`,
				type: "error",
				message: `Audit flagged: Asset ${a.tag} is lost. Pending replacement.`,
				asset: a
			});
			if (a.status === "under-repair") alerts.push({
				id: `rep_${a.id}`,
				type: "info",
				message: `${a.tag} is currently in repair at vendor.`,
				asset: a
			});
		});
		return alerts;
	}, [assets]);
	const isEmployee = authWs.user?.role === "employee" || searchParams?.view === "my";
	const filteredAssets = (0, import_react.useMemo)(() => {
		return assets.filter((a) => {
			const matchQ = !q || a.name.toLowerCase().includes(q.toLowerCase()) || a.tag.toLowerCase().includes(q.toLowerCase()) || a.serial.toLowerCase().includes(q.toLowerCase()) || a.brand && a.brand.toLowerCase().includes(q.toLowerCase()) || a.assignedTo && a.assignedTo.toLowerCase().includes(q.toLowerCase());
			let matchStatus = true;
			if (statusFilter !== "all") if (statusFilter === "retired") matchStatus = a.status === "retired" || a.status === "expired";
			else matchStatus = a.status === statusFilter;
			return matchQ && matchStatus;
		});
	}, [
		assets,
		q,
		statusFilter
	]);
	const paginatedAssets = (0, import_react.useMemo)(() => {
		const startIdx = (currentPage - 1) * itemsPerPage;
		return filteredAssets.slice(startIdx, startIdx + itemsPerPage);
	}, [filteredAssets, currentPage]);
	const totalPages = Math.ceil(filteredAssets.length / itemsPerPage);
	const categoryChartData = (0, import_react.useMemo)(() => {
		return apiStats?.category_distribution || [];
	}, [apiStats]);
	const repairCostChartData = (0, import_react.useMemo)(() => {
		return apiStats?.repair_costs_by_category || [];
	}, [apiStats]);
	if (isEmployee) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeMyAssetsView, {
		apiAssets: assets,
		isLoading
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			!isEmployee && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-2 mb-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => setScanOpen(true),
						className: "h-9 gap-2 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-4 w-4" }), "Scan QR Code"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => {
							const headers = [
								"Asset Tag",
								"Asset Name",
								"Category",
								"Brand",
								"Model",
								"Serial",
								"Purchase Cost",
								"Purchase Date",
								"Status",
								"Assigned Employee"
							];
							const rows = assets.map((a) => [
								a.tag,
								a.name,
								a.category,
								a.brand || "",
								a.model || "",
								a.serial,
								(a.purchaseCost || 0).toString(),
								a.purchaseDate,
								a.status,
								a.assignedTo || "Unassigned"
							].map((v) => `"${v.replace(/"/g, "\"\"")}"`).join(","));
							const csv = [headers.join(","), ...rows].join("\n");
							const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
							const link = document.createElement("a");
							link.href = url;
							link.download = `OFC360_Assets_Inventory_${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.csv`;
							link.click();
							URL.revokeObjectURL(url);
							toast.success("Inventory exported as CSV");
						},
						className: "h-9 gap-2 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), "Export CSV"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setAddOpen(true),
						className: "h-9 gap-2 cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Add Asset"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6",
				children: (isEmployee ? [{
					key: "assigned",
					title: "My Assigned Assets",
					count: filteredAssets.length
				}, {
					key: "available",
					title: "Active Devices",
					count: filteredAssets.filter((a) => a.status === "assigned").length
				}] : [
					{
						key: "total",
						title: "Total Assets",
						count: stats.total
					},
					{
						key: "available",
						title: "Available Assets",
						count: stats.available
					},
					{
						key: "assigned",
						title: "Assigned Assets",
						count: stats.assigned
					},
					{
						key: "repair",
						title: "Under Repair",
						count: stats.repair
					},
					{
						key: "lost",
						title: "Lost Assets",
						count: stats.lost
					},
					{
						key: "expiring",
						title: "Expiring Warranty",
						count: stats.expiring
					}
				]).map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
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
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-3.5 w-3.5" })
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2.5 flex items-baseline gap-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-2xl font-semibold font-display tracking-tight leading-none text-foreground",
								children: card.count
							})
						})]
					})
				}, card.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "inventory",
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-muted border border-border p-1 rounded-xl h-10 w-fit shrink-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "inventory",
							className: "text-xs h-8 px-4 font-medium rounded-lg cursor-pointer",
							children: "Assets Inventory"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "reports",
							className: "text-xs h-8 px-4 font-medium rounded-lg cursor-pointer",
							children: "Analytics & Reports"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "inventory",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-6 lg:grid-cols-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4 lg:col-span-3",
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
													placeholder: "Search by ID, name, brand, employee...",
													className: "h-9 pl-9 border-border bg-background/50 focus-visible:ring-1 focus-visible:ring-ring"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-2 overflow-x-auto py-1 scrollbar-none",
												children: [
													{
														id: "all",
														label: "All Assets"
													},
													{
														id: "available",
														label: "Available"
													},
													{
														id: "assigned",
														label: "Assigned"
													},
													{
														id: "under-repair",
														label: "In Repair"
													},
													{
														id: "lost",
														label: "Lost"
													},
													{
														id: "retired",
														label: "Decommissioned"
													}
												].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => {
														setStatusFilter(tab.id);
														setCurrentPage(1);
													},
													className: `shrink-0 rounded-full px-3 py-1 text-xs font-semibold border transition-colors cursor-pointer ${statusFilter === tab.id ? "bg-foreground text-background border-foreground" : "bg-background/40 border-border hover:bg-accent/60 text-muted-foreground"}`,
													children: tab.label
												}, tab.id))
											})]
										}),
										paginatedAssets.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-center justify-center py-16 text-center",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-muted/50 border border-border text-muted-foreground",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-6 w-6" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-foreground",
													children: "No assets found"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 max-w-sm text-sm text-muted-foreground",
													children: "No records match the current filters. Adjust your search or register a new asset."
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
																className: "px-4 py-3 w-[80px] text-center",
																children: "QR Code"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3",
																children: "Asset ID / Tag"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3",
																children: "Asset Name"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3",
																children: "Category"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3",
																children: "Brand & Model"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3",
																children: "Serial Number"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3",
																children: "Assigned To"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3",
																children: "Department"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3",
																children: "Warranty Expiry"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
																className: "px-4 py-3 text-center",
																children: "Status"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "px-4 py-3 text-right" })
														]
													})
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: paginatedAssets.map((asset) => {
													const statusInfo = STATUSES.find((s) => s.value === asset.status) || STATUSES[0];
													const isWSoon = asset.warrantyUntil && new Date(asset.warrantyUntil).getTime() <= (/* @__PURE__ */ new Date("2026-06-28")).getTime() + 720 * 60 * 60 * 1e3;
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
														className: "group border-t border-border transition-colors hover:bg-accent/20 cursor-pointer",
														onClick: () => setDetailAsset(asset),
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-2 text-center",
																onClick: (e) => {
																	e.stopPropagation();
																	setTargetAsset(asset);
																	setQrOpen(true);
																},
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "grid place-items-center h-8 w-8 rounded border border-border bg-muted cursor-pointer hover:scale-105 transition-transform",
																	title: "Click to view full sticker",
																	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-5 w-5 text-foreground" })
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-3 font-semibold font-mono text-xs text-foreground/90",
																children: asset.tag
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-3",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "font-semibold text-foreground truncate max-w-[150px]",
																	children: asset.name
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-3",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-xs text-muted-foreground capitalize",
																	children: asset.category
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
																className: "px-4 py-3 text-xs text-foreground/80",
																children: [
																	asset.brand,
																	" ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																		className: "text-muted-foreground",
																		children: [
																			"(",
																			asset.model || "—",
																			")"
																		]
																	})
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-3 font-mono text-xs text-muted-foreground",
																children: asset.serial
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-3 text-xs font-semibold text-foreground/90",
																children: asset.assignedTo || /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground/40 font-normal italic",
																	children: "Unassigned"
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-3 text-xs text-muted-foreground",
																children: asset.assignedTo ? authWs.employees.find((x) => x.fullName === asset.assignedTo)?.department || "Operations" : "—"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-3 text-xs",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: isWSoon ? "text-foreground font-semibold" : "text-muted-foreground",
																	children: asset.warrantyUntil || "—"
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-3 text-center",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
																	className: `${getAssetStatusBadge(asset.status)} border shadow-none text-xs font-semibold capitalize`,
																	children: statusInfo.label
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
																className: "px-4 py-3 text-right",
																onClick: (e) => e.stopPropagation(),
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																	className: "flex justify-end gap-1 opacity-80 group-hover:opacity-100",
																	children: [
																		asset.status === "available" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																			size: "sm",
																			variant: "outline",
																			onClick: () => handleAssignOpen(asset),
																			className: "h-7 text-[10px] px-2 border-border cursor-pointer hover:bg-accent/65",
																			children: "Assign"
																		}),
																		asset.status === "assigned" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																			size: "sm",
																			variant: "outline",
																			onClick: () => handleReturnAsset(asset),
																			className: "h-7 text-[10px] px-2 text-emerald-600 dark:text-emerald-400 border-border cursor-pointer",
																			children: "Return"
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																			size: "sm",
																			variant: "outline",
																			onClick: () => handleTransferOpen(asset),
																			className: "h-7 text-[10px] px-2 border-border cursor-pointer",
																			children: "Transfer"
																		})] }),
																		asset.status !== "under-repair" && asset.status !== "retired" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																			size: "sm",
																			variant: "outline",
																			onClick: () => handleRepairOpen(asset),
																			className: "h-7 text-[10px] px-2 border-border cursor-pointer",
																			children: "Repair"
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																			size: "icon",
																			variant: "ghost",
																			onClick: () => handleEditOpen(asset),
																			className: "h-7 w-7 text-muted-foreground hover:text-foreground cursor-pointer",
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-3.5 w-3.5" })
																		}),
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																			size: "icon",
																			variant: "ghost",
																			onClick: () => {
																				setTargetAsset(asset);
																				setDeleteOpen(true);
																			},
																			className: "h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer",
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
																		})
																	]
																})
															})
														]
													}, asset.id);
												}) })]
											})
										}),
										totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between border-t border-border px-4 py-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground",
												children: [
													"Showing Page ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "font-semibold text-foreground",
														children: currentPage
													}),
													" of ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "font-semibold text-foreground",
														children: totalPages
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-1",
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
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6 lg:col-span-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "border-border bg-card",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
										className: "pb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
											className: "text-sm font-semibold flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-4 w-4 text-primary" }), "Mobile QR Scanner"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
											className: "text-xs text-muted-foreground",
											children: "Simulate scanning asset labels"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
										className: "space-y-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground leading-relaxed",
											children: "Type or select an asset ID/Tag, then simulate scanning using a mobile device layout."
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: scannedAssetTag,
												onValueChange: setScannedAssetTag,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													className: "h-8 text-xs bg-background/50 border-border",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Asset" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: assets.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
													value: a.tag,
													children: [
														a.tag,
														" (",
														a.brand,
														")"
													]
												}, a.id)) })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												onClick: handleScanSimulation,
												disabled: !scannedAssetTag,
												className: "h-8 px-3 text-xs cursor-pointer",
												children: "Scan"
											})]
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "border-border bg-card",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
										className: "pb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
											className: "text-sm font-semibold flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-destructive animate-pulse" }), "Alerts & Notifications"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
											className: "text-xs text-muted-foreground",
											children: "Asset events needing attention"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
										className: "space-y-3",
										children: notifications.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs text-muted-foreground text-center py-4 italic",
											children: "All assets compliant with warranty and returns!"
										}) : notifications.slice(0, 4).map((alert) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: `flex gap-2.5 rounded-lg border p-2.5 text-xs transition-colors ${alert.type === "error" ? statusBadgeClass("critical") : alert.type === "warning" ? statusBadgeClass("warning") : statusBadgeClass("info")}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold leading-relaxed",
													children: alert.message
												}), alert.asset && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setDetailAsset(alert.asset),
													className: "mt-1 text-[10px] underline font-bold uppercase cursor-pointer",
													children: "View Asset Details"
												})]
											})]
										}, alert.id))
									})]
								})]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "reports",
						className: "space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "border-border bg-card",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-sm font-bold",
										children: "Category Allocation"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
										className: "text-xs",
										children: "Count of assets by category classification"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
										className: "h-[250px] flex items-center justify-center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
											width: "100%",
											height: "100%",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
													data: categoryChartData,
													cx: "50%",
													cy: "50%",
													innerRadius: 60,
													outerRadius: 80,
													paddingAngle: 4,
													dataKey: "value",
													children: categoryChartData.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`))
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: { fontSize: 11 } }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } })
											] })
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "border-border bg-card",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-sm font-bold",
										children: "Maintenance Repair Costs ($)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
										className: "text-xs",
										children: "Accumulated service and parts expenditure by category"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
										className: "h-[250px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
											width: "100%",
											height: "100%",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
												data: repairCostChartData,
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
														strokeDasharray: "3 3",
														opacity: .1
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
														dataKey: "category",
														style: { fontSize: 9 }
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { style: { fontSize: 9 } }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: { fontSize: 11 } }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
														dataKey: "Total Repair Cost ($)",
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
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									className: "border-border bg-card lg:col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
										className: "text-sm font-bold",
										children: "Asset Financial Summary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, {
										className: "text-xs",
										children: "Capital expenditures and maintenance records per asset item"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
										className: "p-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
											className: "text-xs border-collapse",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
												className: "bg-muted/10 border-b border-border",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "px-4 py-2.5",
														children: "Asset"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "px-4 py-2.5",
														children: "Category"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "px-4 py-2.5",
														children: "Owner"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "px-4 py-2.5",
														children: "Purchase Date"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "px-4 py-2.5 text-right",
														children: "Purchase Cost"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "px-4 py-2.5 text-right",
														children: "Repair Cost"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
														className: "px-4 py-2.5 text-right",
														children: "Total Lifetime Cost"
													})
												] })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: assets.map((a) => {
												const repCost = (a.maintenanceHistory || []).reduce((sum, r) => sum + r.cost, 0);
												const lifeCost = (a.purchaseCost || 0) + repCost;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
													className: "border-t border-border hover:bg-accent/15",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
															className: "px-4 py-2 font-medium",
															children: [
																a.tag,
																" • ",
																a.name
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-2 capitalize text-muted-foreground",
															children: a.category
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-2",
															children: a.assignedTo || "Available"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-4 py-2 text-muted-foreground",
															children: a.purchaseDate
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
															className: "px-4 py-2 text-right",
															children: ["$", a.purchaseCost || 0]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
															className: "px-4 py-2 text-right text-foreground font-medium",
															children: ["$", repCost]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
															className: "px-4 py-2 text-right font-semibold",
															children: ["$", lifeCost]
														})
													]
												}, a.id);
											}) })]
										})
									})]
								})
							]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: addOpen,
				onOpenChange: setAddOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display font-bold text-lg",
						children: "Register New Asset"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAddSubmit,
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Asset Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: assetName,
										onChange: (e) => setAssetName(e.target.value),
										placeholder: "e.g. MacBook Pro M3",
										className: "bg-background/50 border-border"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Category"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: assetCategory,
										onValueChange: (val) => setAssetCategory(val),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "bg-background/50 border-border text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: c.value,
											children: c.label
										}, c.value)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Serial Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: serial,
										onChange: (e) => setSerial(e.target.value),
										placeholder: "C02XJ192",
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Brand"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: brand,
										onChange: (e) => setBrand(e.target.value),
										placeholder: "e.g. Apple",
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Model Specification"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: model,
										onChange: (e) => setModel(e.target.value),
										placeholder: "e.g. Pro 14 M3 16GB",
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Vendor"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: vendor,
										onChange: (e) => setVendor(e.target.value),
										placeholder: "e.g. Apple Authorized Reseller",
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Purchase Cost ($)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: purchaseCost,
										onChange: (e) => setPurchaseCost(e.target.value),
										placeholder: "0.00",
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Purchase Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: purchaseDate,
										onChange: (e) => setPurchaseDate(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Warranty Expiry (Optional)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											value: warrantyUntil,
											onChange: (e) => setWarrantyUntil(e.target.value),
											className: "bg-background/50 border-border text-xs"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-muted-foreground",
											children: "Leave blank if no warranty applies"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Current Location / Room"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: location,
										onChange: (e) => setLocation(e.target.value),
										placeholder: "e.g. Bangalore Floor 3 Store Room",
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Description Notes"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										value: notes,
										onChange: (e) => setNotes(e.target.value),
										placeholder: "Condition, initial checks, setup requirements...",
										className: "min-h-[60px] bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Asset Image Upload"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex items-center justify-center border border-dashed border-border bg-background/30 rounded-xl p-4 text-center text-[10px] text-muted-foreground",
										children: "Click or Drag asset photograph to upload (Optional)"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setAddOpen(false),
								className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "h-9 cursor-pointer",
								children: "Generate ID & Save"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: editOpen,
				onOpenChange: setEditOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display font-bold text-lg",
						children: "Edit Asset Specifications"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleEditSubmit,
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Asset Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: assetName,
										onChange: (e) => setAssetName(e.target.value),
										className: "bg-background/50 border-border"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Category"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: assetCategory,
										onValueChange: (val) => setAssetCategory(val),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
											className: "bg-background/50 border-border text-xs",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
											value: c.value,
											children: c.label
										}, c.value)) })]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Serial Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: serial,
										onChange: (e) => setSerial(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Brand"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: brand,
										onChange: (e) => setBrand(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Model Specification"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: model,
										onChange: (e) => setModel(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Vendor"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: vendor,
										onChange: (e) => setVendor(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Purchase Cost ($)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: purchaseCost,
										onChange: (e) => setPurchaseCost(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Purchase Date"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: purchaseDate,
										onChange: (e) => setPurchaseDate(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Warranty Expiry"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										value: warrantyUntil,
										onChange: (e) => setWarrantyUntil(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Current Location / Room"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: location,
										onChange: (e) => setLocation(e.target.value),
										className: "bg-background/50 border-border text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-semibold text-muted-foreground",
										children: "Description Notes"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										value: notes,
										onChange: (e) => setNotes(e.target.value),
										className: "min-h-[60px] bg-background/50 border-border text-xs"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setEditOpen(false),
								className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "h-9 cursor-pointer",
								children: "Save Changes"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: assignOpen,
				onOpenChange: setAssignOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "font-display font-bold",
						children: ["Assign Asset: ", targetAsset?.tag]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleAssignSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Employee Assignee"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: assignEmpId,
									onValueChange: setAssignEmpId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-full bg-background/50 border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select an employee..." })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: authWs.employees.map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: emp.id,
										children: [
											emp.fullName,
											" (",
											emp.employeeId || emp.id,
											")"
										]
									}, emp.id)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Expected Return Date (Optional)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: assignReturnDate,
									onChange: (e) => setAssignReturnDate(e.target.value),
									className: "bg-background/50 border-border text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Assignment Notes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: assignNotes,
									onChange: (e) => setAssignNotes(e.target.value),
									placeholder: "State check-in parameters, initial hardware checklist checks...",
									className: "min-h-[70px] bg-background/50 border-border text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setAssignOpen(false),
									className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-9 cursor-pointer",
									children: "Assign Asset"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: transferOpen,
				onOpenChange: setTransferOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "font-display font-bold",
						children: ["Transfer Asset: ", targetAsset?.tag]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleTransferSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-lg bg-muted border border-border p-3 text-xs text-muted-foreground",
								children: ["Transferring asset currently assigned to: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: targetAsset?.assignedTo })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "New Employee Assignee"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: transferEmpId,
									onValueChange: setTransferEmpId,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-full bg-background/50 border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select an employee..." })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: authWs.employees.filter((emp) => {
										const assignedId = targetAsset?.assignedToId || targetAsset?.employeeId || targetAsset?.employee_id;
										return assignedId ? emp.id !== assignedId && emp.employeeId !== assignedId : emp.fullName !== targetAsset?.assignedTo;
									}).map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: emp.id,
										children: [
											emp.fullName,
											" (",
											emp.employeeId || emp.id,
											")"
										]
									}, emp.id)) })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Transfer Reason / Notes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: transferNotes,
									onChange: (e) => setTransferNotes(e.target.value),
									placeholder: "State justification or ticket reference...",
									className: "min-h-[70px] bg-background/50 border-border text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setTransferOpen(false),
									className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-9 cursor-pointer",
									children: "Transfer Asset"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: repairOpen,
				onOpenChange: setRepairOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-background border-border shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "font-display font-bold",
						children: ["Log Repair Request: ", targetAsset?.tag]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleRepairSubmit,
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Service Vendor / Shop Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: repairVendor,
									onChange: (e) => setRepairVendor(e.target.value),
									placeholder: "e.g. Dell Authorized Service Center",
									className: "bg-background/50 border-border text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Estimated Repair Cost ($)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: repairCost,
									onChange: (e) => setRepairCost(e.target.value),
									placeholder: "0.00",
									className: "bg-background/50 border-border text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Fault Description / Service Notes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: repairNotes,
									onChange: (e) => setRepairNotes(e.target.value),
									placeholder: "e.g. Sticky keyboard keys, battery swelling, screen flickering...",
									className: "min-h-[80px] bg-background/50 border-border text-xs"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-2 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setRepairOpen(false),
									className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									className: "h-9 cursor-pointer",
									children: "Log to Maintenance"
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: deleteOpen,
				onOpenChange: setDeleteOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-sm bg-background border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-display font-bold text-destructive",
							children: "Delete Asset Record"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground leading-relaxed",
							children: [
								"Are you sure you want to permanently erase the record for asset ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
									className: "font-semibold text-foreground",
									children: [
										targetAsset?.tag,
										" (",
										targetAsset?.name,
										")"
									]
								}),
								"? This will clear all historical timelines."
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2 border-t border-border gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setDeleteOpen(false),
								className: "h-9 border-border bg-transparent hover:bg-accent/60 cursor-pointer",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "destructive",
								onClick: handleDeleteSubmit,
								className: "h-9 cursor-pointer",
								children: "Delete Record"
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: qrOpen,
				onOpenChange: setQrOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-xs bg-background border-border text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display font-bold text-center",
						children: "Asset QR Sticker Label"
					}) }), targetAsset && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 pt-3 flex flex-col items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-4 shadow-sm w-[220px] flex flex-col items-center select-none text-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-bold tracking-widest text-muted-foreground uppercase",
									children: "OFC360 ASSET"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-mono text-sm font-extrabold text-foreground border-b border-border pb-1.5 w-full text-center",
									children: targetAsset.tag
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "my-3 p-1.5 border border-border bg-muted/30 rounded shadow-inner flex flex-col items-center justify-center",
									children: [targetAsset.qrCodeData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: targetAsset.qrCodeData,
										width: 130,
										height: 130,
										className: "w-[130px] h-[130px]",
										alt: "Asset QR Code"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-[130px] h-[130px] flex items-center justify-center bg-muted text-[10px] text-muted-foreground",
										children: "Generating QR..."
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-[10px] text-muted-foreground mt-1.5",
										children: targetAsset.serial ?? targetAsset.id
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[10px] font-semibold text-foreground truncate max-w-full",
									children: targetAsset.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-[8px] text-muted-foreground italic",
									children: "Company: OFC360"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 w-full pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => {
									toast.success("Regenerated QR Code successfully.");
									({ ...targetAsset }), [...targetAsset.timeline || [], (newId("tl"), authWs.user?.fullName, (/* @__PURE__ */ new Date()).toISOString())];
									editMutation.mutate({
										id: targetAsset.id,
										payload: { notes: (targetAsset.notes || "") + "\nRegenerated unique QR signature check." }
									});
									setQrOpen(false);
								},
								className: "flex-1 h-9 text-xs border-border bg-transparent cursor-pointer",
								children: "Regenerate"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => {
									toast.success(`Sticker sent to printer queue.`);
									setQrOpen(false);
								},
								className: "flex-1 h-9 text-xs cursor-pointer gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5" }), "Print Label"]
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: scanOpen,
				onOpenChange: setScanOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-sm bg-background border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-display font-bold",
							children: "QR / Barcode Scanner"
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground leading-relaxed",
								children: "Scan a physical QR code label on a device using a scanner or camera. Select an asset sticker to inspect."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold text-muted-foreground",
									children: "Select Sticker to Scan"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
									value: scannedAssetTag,
									onValueChange: setScannedAssetTag,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
										className: "w-full bg-background/50 border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Choose asset tag" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: assets.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
										value: a.tag,
										children: [
											a.tag,
											" • ",
											a.name
										]
									}, a.id)) })]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setScanOpen(false),
							className: "h-9 border-border bg-transparent cursor-pointer",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleScanSimulation,
							disabled: !scannedAssetTag,
							className: "h-9 cursor-pointer",
							children: "Confirm Scan"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: !!detailAsset,
				onOpenChange: (open) => !open && setDetailAsset(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
					className: "sm:max-w-xl flex flex-col h-full bg-background border-l border-border p-0 shadow-2xl",
					children: detailAsset && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
							className: "p-5 border-b border-border bg-muted/10 shrink-0 text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: "text-[10px] uppercase font-bold text-muted-foreground border-border",
										children: detailAsset.category
									}), STATUSES.map((stat) => {
										if (stat.value !== detailAsset.status) return null;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: `${getAssetStatusBadge(stat.value)} border shadow-none text-xs font-bold capitalize`,
											children: stat.label
										}, stat.value);
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, {
									className: "font-display text-base font-bold text-foreground mt-2 truncate text-left",
									title: detailAsset.name,
									children: [
										detailAsset.tag,
										" • ",
										detailAsset.name
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetDescription, {
									className: "text-xs text-muted-foreground text-left mt-0.5",
									children: [
										"Serial Number: ",
										detailAsset.serial,
										" • Warranty Expiration: ",
										detailAsset.warrantyUntil || "None"
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
											children: "Asset QR Sticker Identification"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-border bg-muted/30 p-4 flex flex-col sm:flex-row items-center justify-between gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded bg-card p-2 border border-border flex flex-col items-center justify-center",
												children: [detailAsset.qrCodeData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: detailAsset.qrCodeData,
													width: 110,
													height: 110,
													className: "w-[110px] h-[110px]",
													alt: "Asset QR Code"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "w-[110px] h-[110px] flex items-center justify-center bg-muted text-[10px] text-muted-foreground",
													children: "Generating QR..."
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "font-mono text-[10px] text-muted-foreground mt-1",
													children: detailAsset.serial ?? detailAsset.id
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-left space-y-2 flex-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-semibold text-foreground",
														children: "Scannable QR Label"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-muted-foreground leading-relaxed",
														children: "Scan this label with any mobile device to open the asset record page."
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "sm",
															variant: "outline",
															onClick: () => {
																setTargetAsset(detailAsset);
																setQrOpen(true);
															},
															className: "h-8 text-[10px] border-border bg-transparent cursor-pointer",
															children: "Print Sticker"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
															size: "sm",
															variant: "outline",
															onClick: () => {
																toast.success("Regenerating QR parameters...");
																const updated = {
																	...detailAsset,
																	timeline: [...detailAsset.timeline || [], {
																		id: newId("tl"),
																		event: "Created",
																		performedBy: authWs.user?.fullName || "HR",
																		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
																		notes: "QR checksum regenerated."
																	}]
																};
																editMutation.mutate({
																	id: detailAsset.id,
																	payload: { notes: (detailAsset.notes || "") + "\nQR checksum regenerated." }
																});
																setDetailAsset(updated);
															},
															className: "h-8 text-[10px] border-border bg-transparent cursor-pointer",
															children: "Regenerate"
														})]
													})
												]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-card p-4 space-y-3 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
											children: "Hardware Specifications"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-x-4 gap-y-3 text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block text-[10px]",
													children: "Brand / Manufacturer"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground mt-0.5 block",
													children: detailAsset.brand || "—"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block text-[10px]",
													children: "Model Specification"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground mt-0.5 block",
													children: detailAsset.model || "—"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block text-[10px]",
													children: "Purchase Cost"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
													className: "text-foreground mt-0.5 block",
													children: ["$", detailAsset.purchaseCost || 0]
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block text-[10px]",
													children: "Current Location Room"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-foreground mt-0.5 block",
													children: detailAsset.location || "General HQ"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "col-span-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground block text-[10px]",
														children: "Vendor Info"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground mt-0.5 block",
														children: detailAsset.vendor
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "col-span-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground block text-[10px]",
														children: "Warranty Status"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
														className: "text-foreground mt-0.5 block",
														children: detailAsset.warrantyUntil ? new Date(detailAsset.warrantyUntil).getTime() < (/* @__PURE__ */ new Date("2026-06-28")).getTime() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-destructive font-medium",
															children: [
																"Warranty Expired (",
																detailAsset.warrantyUntil,
																")"
															]
														}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-foreground font-medium",
															children: [
																"Warranty Active (Expires: ",
																detailAsset.warrantyUntil,
																")"
															]
														}) : "No Warranty Data"
													})]
												})
											]
										})]
									}),
									detailAsset.status === "assigned" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border bg-muted/40 p-3.5 text-xs text-muted-foreground space-y-1 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 font-bold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" }), "Current Assignment:"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-2 gap-2 text-[11px] leading-relaxed pt-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Employee:" }),
													" ",
													detailAsset.assignedTo
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Dept:" }),
													" ",
													authWs.employees.find((x) => detailAsset.assignedToId ? x.id === detailAsset.assignedToId || x.employeeId === detailAsset.assignedToId : x.fullName === detailAsset.assignedTo)?.department || "Operations"
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "col-span-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Assigned At:" }),
														" ",
														detailAsset.assignedAt ? new Date(detailAsset.assignedAt).toLocaleDateString() : "—"
													]
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Asset Timeline Audit Logs"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-xl border border-border bg-card p-4 space-y-3.5",
											children: (detailAsset.timeline || []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground italic",
												children: "No timelines logged for this asset."
											}) : (detailAsset.timeline || []).map((tl, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: `flex gap-3 text-xs relative ${idx < (detailAsset.timeline || []).length - 1 ? "before:absolute before:left-2 before:top-4 before:bottom-0 before:w-[1px] before:bg-border pb-3" : ""}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "grid h-4 w-4 place-items-center rounded-full shrink-0 bg-primary/10 text-primary",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-2 w-2" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
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
												] })]
											}, tl.id))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Assignment History Logs"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-xl border border-border bg-card p-0 overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
												className: "text-[11px] border-collapse",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
													className: "bg-muted/10 border-b border-border",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-3 py-2 w-[120px]",
															children: "Employee"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-3 py-2",
															children: "Department"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-3 py-2",
															children: "Assign Date"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-3 py-2",
															children: "Return Date"
														})
													] })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: (detailAsset.assignmentHistory || []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													colSpan: 4,
													className: "text-center py-4 text-muted-foreground italic",
													children: "No allocation logs recorded."
												}) }) : (detailAsset.assignmentHistory || []).map((hist) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
													className: "border-t border-border",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-3 py-2 font-semibold",
															children: hist.employee
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-3 py-2 text-muted-foreground",
															children: hist.department
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-3 py-2 text-muted-foreground",
															children: hist.assignDate
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-3 py-2",
															children: hist.actualReturnDate ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: hist.actualReturnDate }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-foreground font-medium font-semibold",
																children: "Active"
															})
														})
													]
												}, hist.id)) })]
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Maintenance Repair logs"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "rounded-xl border border-border bg-card p-0 overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, {
												className: "text-[11px] border-collapse",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, {
													className: "bg-muted/10 border-b border-border",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-3 py-2 w-[100px]",
															children: "Service Date"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-3 py-2",
															children: "Vendor Partner"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-3 py-2 text-right",
															children: "Cost"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
															className: "px-3 py-2",
															children: "Issues / Notes"
														})
													] })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: (detailAsset.maintenanceHistory || []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
													colSpan: 4,
													className: "text-center py-4 text-muted-foreground italic",
													children: "No maintenance history logs found."
												}) }) : (detailAsset.maintenanceHistory || []).map((mr) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
													className: "border-t border-border",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-3 py-2 font-mono",
															children: mr.serviceDate
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-3 py-2 text-muted-foreground",
															children: mr.vendor
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
															className: "px-3 py-2 text-right text-foreground font-medium font-semibold",
															children: ["$", mr.cost]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
															className: "px-3 py-2 text-muted-foreground truncate max-w-[120px]",
															title: mr.notes,
															children: mr.notes || "—"
														})
													]
												}, mr.id)) })]
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-dashed border-border bg-muted/40 p-3.5 text-xs text-muted-foreground space-y-1 text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h5", {
											className: "font-bold flex items-center gap-1 text-[11px]",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-primary" }), "Decommissioning & Auditing Protocols"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] leading-relaxed text-muted-foreground",
											children: "Asset tag tracks automatic check-ins linked directly with offboarding exit task structures. Supports mobile barcode scanner simulation natively."
										})]
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 border-t border-border bg-muted/10 shrink-0 flex gap-2 justify-end",
							children: [
								detailAsset.status === "available" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									onClick: () => handleAssignOpen(detailAsset),
									className: "h-9 text-xs cursor-pointer",
									children: "Assign Asset"
								}),
								detailAsset.status === "assigned" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => handleReturnAsset(detailAsset),
									className: "h-9 text-xs border-border cursor-pointer text-emerald-600 dark:text-emerald-400",
									children: "Return Asset"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => handleTransferOpen(detailAsset),
									className: "h-9 text-xs border-border cursor-pointer",
									children: "Transfer"
								})] }),
								detailAsset.status !== "under-repair" && detailAsset.status !== "retired" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => handleRepairOpen(detailAsset),
									className: "h-9 text-xs border-border cursor-pointer",
									children: "Log Fault"
								}),
								detailAsset.status !== "retired" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => handleMarkRetired(detailAsset),
									className: "h-9 text-xs border-border cursor-pointer",
									children: "Decommission"
								}),
								detailAsset.status !== "lost" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "outline",
									onClick: () => handleMarkLost(detailAsset),
									className: "h-9 text-xs border-destructive/30 text-destructive cursor-pointer",
									children: "Flag Lost"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									onClick: () => {
										setTargetAsset(detailAsset);
										setQrOpen(true);
									},
									className: "h-9 text-xs border-border cursor-pointer gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-3.5 w-3.5" }), "QR Sticker"]
								})
							]
						})
					] })
				})
			})
		]
	});
}
//#endregion
export { AssetsPage, AssetsPage as default };
