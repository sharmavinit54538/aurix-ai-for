import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Sr as CircleCheck, Ut as LogOut, Wt as LogIn, _ as UserPlus, dt as QrCode, vr as CircleX } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { S as Tooltip, c as YAxis, f as CartesianGrid, l as XAxis, r as AreaChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { l as StatCard, o as QrTile, r as GlassCard, s as SearchBox, u as StatusBadge } from "./Shared-C_skH1kb.mjs";
import { n as newId, r as useHrms, t as hrms } from "./store-o03qs3ZS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/VisitorsPage-QmtW4r6q.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_TONE = {
	pending: "warning",
	approved: "info",
	"checked-in": "success",
	"checked-out": "muted",
	rejected: "danger"
};
function emptyVisitor() {
	return {
		id: newId("v"),
		name: "",
		company: "",
		hostEmployee: "",
		purpose: "",
		expectedDurationMins: 30,
		status: "pending",
		passCode: `VIS-${Math.floor(Math.random() * 9e3 + 1e3)}`,
		createdAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function VisitorsPage() {
	const visitors = useHrms((s) => s.visitors);
	const [query, setQuery] = (0, import_react.useState)("");
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(emptyVisitor());
	const [pass, setPass] = (0, import_react.useState)(null);
	const stats = (0, import_react.useMemo)(() => ({
		total: visitors.length,
		checkedIn: visitors.filter((v) => v.status === "checked-in").length,
		pending: visitors.filter((v) => v.status === "pending").length,
		today: visitors.filter((v) => new Date(v.createdAt).toDateString() === (/* @__PURE__ */ new Date()).toDateString()).length
	}), [visitors]);
	const filtered = (0, import_react.useMemo)(() => visitors.filter((v) => filter === "all" ? true : v.status === filter).filter((v) => query.trim() === "" ? true : `${v.name} ${v.company ?? ""} ${v.hostEmployee} ${v.purpose}`.toLowerCase().includes(query.toLowerCase())).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)), [
		visitors,
		filter,
		query
	]);
	const hourly = (0, import_react.useMemo)(() => {
		const buckets = Array.from({ length: 12 }, (_, i) => ({
			hour: `${i + 8}:00`,
			visitors: 0
		}));
		visitors.forEach((v) => {
			const h = (v.checkInAt ? new Date(v.checkInAt) : new Date(v.createdAt)).getHours() - 8;
			if (h >= 0 && h < 12) buckets[h].visitors += 1;
		});
		return buckets;
	}, [visitors]);
	function save() {
		if (!draft.name || !draft.hostEmployee) return;
		hrms.upsertVisitor(draft);
		setOpen(false);
		setPass(draft);
		setDraft(emptyVisitor());
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 flex items-center justify-end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => {
					setDraft(emptyVisitor());
					setOpen(true);
				},
				className: "gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-4 w-4" }), " New visitor"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Visitors today",
					value: stats.today,
					icon: UserPlus
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Checked-in",
					value: stats.checkedIn,
					icon: LogIn,
					accent: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Pending approval",
					value: stats.pending,
					icon: CircleCheck,
					accent: "warning"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "All-time",
					value: stats.total,
					icon: UserPlus,
					accent: "muted"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, {
			className: "mb-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-2 font-medium",
				children: "Today's check-ins by hour"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
					data: hourly,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: "vg",
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: "#8b5cf6",
								stopOpacity: .6
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: "#8b5cf6",
								stopOpacity: 0
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
							strokeDasharray: "3 3",
							opacity: .2
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "hour",
							fontSize: 12
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							allowDecimals: false,
							fontSize: 12
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							dataKey: "visitors",
							stroke: "#8b5cf6",
							fill: "url(#vg)"
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
				placeholder: "Search visitors…"
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
					"checked-in",
					"checked-out",
					"rejected"
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s }, s))]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 lg:grid-cols-2",
			children: filtered.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-medium",
							children: v.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, {
							status: v.status,
							tone: STATUS_TONE[v.status]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							v.company ? `${v.company} · ` : "",
							"Host: ",
							v.hostEmployee
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 text-sm",
						children: v.purpose
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							"Duration: ",
							v.expectedDurationMins,
							" min",
							v.checkInAt ? ` · In ${new Date(v.checkInAt).toLocaleTimeString()}` : "",
							v.checkOutAt ? ` · Out ${new Date(v.checkOutAt).toLocaleTimeString()}` : ""
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setPass(v),
						"aria-label": "Show pass",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-4 w-4" })
					}), v.status === "pending" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							onClick: () => hrms.setVisitorStatus(v.id, "approved"),
							children: "Approve"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => hrms.setVisitorStatus(v.id, "rejected"),
							children: "Reject"
						})]
					}) : v.status === "approved" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => hrms.checkInVisitor(v.id),
						className: "gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogIn, { className: "h-3.5 w-3.5" }), " Check in"]
					}) : v.status === "checked-in" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => hrms.checkOutVisitor(v.id),
						className: "gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-3.5 w-3.5" }), " Check out"]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: v.status === "rejected" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "h-4 w-4 text-rose-500" }) : "Done"
					})]
				})]
			}) }, v.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New visitor" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Visitor name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.name,
								onChange: (e) => setDraft({
									...draft,
									name: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Company" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.company,
							onChange: (e) => setDraft({
								...draft,
								company: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Phone" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.phone ?? "",
							onChange: (e) => setDraft({
								...draft,
								phone: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Email" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.email ?? "",
							onChange: (e) => setDraft({
								...draft,
								email: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Host employee" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.hostEmployee,
							onChange: (e) => setDraft({
								...draft,
								hostEmployee: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Purpose" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: draft.purpose,
								onChange: (e) => setDraft({
									...draft,
									purpose: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Duration (mins)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "number",
							value: draft.expectedDurationMins,
							onChange: (e) => setDraft({
								...draft,
								expectedDurationMins: Number(e.target.value)
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Photo URL" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.photoUrl ?? "",
							onChange: (e) => setDraft({
								...draft,
								photoUrl: e.target.value
							})
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: save,
					children: "Create pass"
				})] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!pass,
			onOpenChange: (o) => !o && setPass(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Visitor Pass" }) }), pass ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center gap-3 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-lg font-semibold",
							children: pass.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: ["Host: ", pass.hostEmployee]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrTile, {
							value: `OFC360-VISITOR:${pass.passCode}`,
							label: pass.passCode,
							size: 170
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => window.print(),
							children: "Print pass"
						})
					]
				}) : null]
			})
		})
	] });
}
//#endregion
export { VisitorsPage, VisitorsPage as default };
