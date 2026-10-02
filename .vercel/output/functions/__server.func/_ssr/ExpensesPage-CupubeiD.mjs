import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { S as Upload, Sr as CircleCheck, d as Wallet, ht as Plus, pr as Clock, ut as Receipt, vr as CircleX } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { S as Tooltip, c as YAxis, f as CartesianGrid, l as XAxis, o as BarChart, p as Bar, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { l as StatCard, r as GlassCard, s as SearchBox, t as CsvButton, u as StatusBadge } from "./Shared-C_skH1kb.mjs";
import { n as newId, r as useHrms, t as hrms } from "./store-o03qs3ZS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ExpensesPage-CupubeiD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CATEGORIES = [
	"travel",
	"meals",
	"lodging",
	"supplies",
	"training",
	"client",
	"other"
];
var STATUS_TONE = {
	pending: "warning",
	approved: "info",
	"changes-requested": "warning",
	rejected: "danger",
	paid: "success"
};
function emptyExpense() {
	return {
		id: newId("x"),
		employee: "",
		category: "travel",
		amount: 0,
		currency: "INR",
		date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		description: "",
		status: "pending",
		submittedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function ExpensesPage() {
	const expenses = useHrms((s) => s.expenses);
	const [query, setQuery] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(emptyExpense());
	const stats = (0, import_react.useMemo)(() => {
		const by = (s) => expenses.filter((e) => e.status === s);
		return {
			pending: by("pending").length,
			approved: by("approved").length,
			rejected: by("rejected").length,
			paid: by("paid").length,
			paidAmount: by("paid").reduce((s, e) => s + e.amount, 0)
		};
	}, [expenses]);
	const monthly = (0, import_react.useMemo)(() => {
		const m = /* @__PURE__ */ new Map();
		expenses.forEach((e) => {
			const key = new Date(e.date).toLocaleString(void 0, { month: "short" });
			m.set(key, (m.get(key) ?? 0) + e.amount);
		});
		return Array.from(m, ([month, amount]) => ({
			month,
			amount
		}));
	}, [expenses]);
	const filtered = (0, import_react.useMemo)(() => expenses.filter((e) => filter === "all" ? true : e.status === filter).filter((e) => query.trim() === "" ? true : `${e.employee} ${e.description} ${e.category}`.toLowerCase().includes(query.toLowerCase())), [
		expenses,
		filter,
		query
	]);
	function submit() {
		if (!draft.employee || draft.amount <= 0) return;
		hrms.upsertExpense({
			...draft,
			submittedAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		setOpen(false);
		setDraft(emptyExpense());
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-end gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CsvButton, {
				rows: expenses,
				filename: "expenses.csv"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => {
					setDraft(emptyExpense());
					setOpen(true);
				},
				className: "gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Submit claim"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Pending",
					value: stats.pending,
					icon: Clock,
					accent: "warning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Approved",
					value: stats.approved,
					icon: CircleCheck,
					accent: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Rejected",
					value: stats.rejected,
					icon: CircleX,
					accent: "danger"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Paid",
					value: `₹${stats.paidAmount.toLocaleString()}`,
					hint: `${stats.paid} claims`,
					icon: Wallet,
					accent: "brand"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 font-medium",
				children: "Monthly expense volume"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
					data: monthly,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							opacity: .2
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "month",
							fontSize: 12
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { fontSize: 12 }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => `₹${Number(v).toLocaleString()}` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
							dataKey: "amount",
							radius: [
								6,
								6,
								0,
								0
							],
							fill: "#06b6d4"
						})
					]
				}) })
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchBox, {
				value: query,
				onChange: setQuery,
				placeholder: "Search claims…"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				value: filter,
				onChange: (e) => setFilter(e.target.value),
				className: "h-9 rounded-md border border-border bg-background px-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "all",
					children: "All"
				}), [
					"pending",
					"approved",
					"changes-requested",
					"rejected",
					"paid"
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
			className: "overflow-x-auto p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Employee"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Category"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Description"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Amount"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Actions"
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border/60 last:border-0 align-top",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 font-medium",
							children: e.employee
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 capitalize",
							children: e.category
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: e.description }),
								e.managerNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-xs text-muted-foreground",
									children: ["Note: ", e.managerNote]
								}) : null,
								e.receiptName ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 inline-flex items-center gap-1 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Receipt, { className: "h-3 w-3" }), e.receiptName]
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "px-4 py-3",
							children: ["₹", e.amount.toLocaleString()]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: new Date(e.date).toLocaleDateString()
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
								status: e.status,
								tone: STATUS_TONE[e.status]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end gap-1",
								children: e.status === "pending" || e.status === "changes-requested" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										onClick: () => hrms.setExpenseStatus(e.id, "approved"),
										children: "Approve"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => {
											const note = window.prompt("Request changes — note:");
											if (note != null) hrms.setExpenseStatus(e.id, "changes-requested", note);
										},
										children: "Changes"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "sm",
										onClick: () => hrms.setExpenseStatus(e.id, "rejected"),
										children: "Reject"
									})
								] }) : e.status === "approved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									size: "sm",
									onClick: () => hrms.setExpenseStatus(e.id, "paid"),
									children: "Mark paid"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "—"
								})
							})
						})
					]
				}, e.id)) })]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Submit expense claim" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Employee" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.employee,
								onChange: (e) => setDraft({
									...draft,
									employee: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Category" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: draft.category,
							onChange: (e) => setDraft({
								...draft,
								category: e.target.value
							}),
							className: "h-9 w-full rounded-md border border-border bg-background px-3 text-sm",
							children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: draft.date.slice(0, 10),
							onChange: (e) => setDraft({
								...draft,
								date: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: draft.amount,
							onChange: (e) => setDraft({
								...draft,
								amount: Number(e.target.value)
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Receipt" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card/40 text-xs text-muted-foreground hover:bg-card",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: draft.receiptName ?? "Upload file" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									className: "hidden",
									onChange: (e) => setDraft({
										...draft,
										receiptName: e.target.files?.[0]?.name
									})
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Description" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: draft.description,
								onChange: (e) => setDraft({
									...draft,
									description: e.target.value
								})
							})]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: submit,
					children: "Submit"
				})] })
			] })
		})
	] });
}
//#endregion
export { ExpensesPage, ExpensesPage as default };
