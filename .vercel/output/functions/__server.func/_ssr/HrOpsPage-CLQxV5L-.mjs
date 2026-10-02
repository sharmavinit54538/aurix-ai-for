import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Dt as Package, Ut as LogOut, _t as Plane, mi as Activity, p as Users, pi as Archive, ut as Receipt, x as UserCheck } from "../_libs/lucide-react.mjs";
import { S as Tooltip, a as PieChart, b as Cell, c as YAxis, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { l as StatCard, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { r as useHrms } from "./store-o03qs3ZS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/HrOpsPage-CLQxV5L-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var QUICK_LINKS = [
	{
		to: "/dashboard/hr-operations/onboarding",
		label: "Onboarding",
		icon: UserCheck
	},
	{
		to: "/dashboard/hr-operations/timeline",
		label: "Timeline",
		icon: Activity
	},
	{
		to: "/dashboard/hr-operations/visitor-management",
		label: "Visitors",
		icon: Users
	},
	{
		to: "/dashboard/resources/assets",
		label: "Assets",
		icon: Package
	},
	{
		to: "/dashboard/expenses",
		label: "Expenses",
		icon: Receipt
	},
	{
		to: "/dashboard/travel",
		label: "Travel",
		icon: Plane
	},
	{
		to: "/dashboard/hr-operations/offboarding",
		label: "Offboarding",
		icon: Archive
	},
	{
		to: "/dashboard/hr-operations/exit-management",
		label: "Exit",
		icon: LogOut
	}
];
var COLORS = [
	"#6366f1",
	"#10b981",
	"#f59e0b",
	"#ef4444",
	"#06b6d4",
	"#8b5cf6"
];
function HrOpsPage() {
	const s = useHrms((x) => x);
	const expenseStatus = (0, import_react.useMemo)(() => {
		const counts = {};
		s.expenses.forEach((e) => {
			counts[e.status] = (counts[e.status] ?? 0) + 1;
		});
		return Object.entries(counts).map(([name, value]) => ({
			name,
			value
		}));
	}, [s.expenses]);
	const assetStatus = (0, import_react.useMemo)(() => {
		const counts = {};
		s.assets.forEach((a) => {
			counts[a.status] = (counts[a.status] ?? 0) + 1;
		});
		return Object.entries(counts).map(([name, value]) => ({
			name,
			value
		}));
	}, [s.assets]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Timeline events",
					value: s.timeline.length,
					icon: Activity
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Assets tracked",
					value: s.assets.length,
					icon: Package,
					accent: "brand"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Visitors today",
					value: s.visitors.filter((v) => new Date(v.createdAt).toDateString() === (/* @__PURE__ */ new Date()).toDateString()).length,
					icon: Users,
					accent: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Expense claims",
					value: s.expenses.length,
					icon: Receipt,
					accent: "warning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Travel requests",
					value: s.travel.length,
					icon: Plane
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Onboardings",
					value: s.onboarding.length,
					icon: UserCheck,
					accent: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Offboardings",
					value: s.offboarding.length,
					icon: Archive,
					accent: "warning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Exits in progress",
					value: s.exits.filter((e) => e.stage !== "settled").length,
					icon: LogOut,
					accent: "danger"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: QUICK_LINKS.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: l.to,
				className: "group rounded-2xl border border-border bg-card/40 p-4 transition-colors hover:bg-accent/60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 place-items-center rounded-xl text-brand-foreground shadow-glow",
						style: { background: "var(--gradient-brand)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(l.icon, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: l.label
					})]
				})
			}, l.to))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 font-medium",
					children: "Expense pipeline"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: expenseStatus,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								opacity: .2
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								fontSize: 12
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								allowDecimals: false,
								fontSize: 12
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "value",
								radius: [
									6,
									6,
									0,
									0
								],
								fill: "#6366f1"
							})
						]
					}) })
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 font-medium",
					children: "Asset status"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-64",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
						data: assetStatus,
						dataKey: "value",
						nameKey: "name",
						outerRadius: 90,
						label: true,
						children: assetStatus.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {})] }) })
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
					className: "lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 font-medium",
						children: "Recent timeline events"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "divide-y divide-border",
						children: s.timeline.slice(0, 8).map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-center justify-between py-2 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-medium",
								children: t.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground",
								children: [
									t.employeeName,
									" · ",
									new Date(t.date).toLocaleDateString()
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs uppercase text-muted-foreground",
								children: t.kind.replace(/-/g, " ")
							})]
						}, t.id))
					})]
				})
			]
		})
	] });
}
//#endregion
export { HrOpsPage, HrOpsPage as default };
