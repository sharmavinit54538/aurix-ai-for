import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { gr as ClipboardCheck, ht as Plus, x as UserCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { a as Progress, l as StatCard, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { n as newId, r as useHrms, t as hrms } from "./store-o03qs3ZS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/OnboardingChecklistPage-BmeuX0V_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEFAULT_TASKS = [
	{
		key: "offer",
		label: "Offer accepted",
		owner: "HR"
	},
	{
		key: "docs",
		label: "Documents submitted",
		owner: "Employee"
	},
	{
		key: "bgv",
		label: "Background verification",
		owner: "HR"
	},
	{
		key: "laptop",
		label: "Laptop assigned",
		owner: "IT"
	},
	{
		key: "email",
		label: "Email created",
		owner: "IT"
	},
	{
		key: "slack",
		label: "Slack created",
		owner: "IT"
	},
	{
		key: "github",
		label: "GitHub access",
		owner: "IT"
	},
	{
		key: "training",
		label: "Training assigned",
		owner: "Manager"
	},
	{
		key: "policy",
		label: "Policies read",
		owner: "Employee"
	},
	{
		key: "intro",
		label: "Manager introduction",
		owner: "Manager"
	},
	{
		key: "id",
		label: "ID card generated",
		owner: "HR"
	},
	{
		key: "probation",
		label: "Probation started",
		owner: "HR"
	}
];
function newCase() {
	return {
		id: newId("ob"),
		employee: "",
		role: "",
		manager: "",
		joinDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		tasks: DEFAULT_TASKS.map((t) => ({
			...t,
			done: false
		}))
	};
}
function OnboardingChecklistPage() {
	const cases = useHrms((s) => s.onboarding);
	const [open, setOpen] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(newCase());
	const totalTasks = cases.reduce((s, c) => s + c.tasks.length, 0);
	const doneTasks = cases.reduce((s, c) => s + c.tasks.filter((t) => t.done).length, 0);
	const avgPct = totalTasks ? Math.round(doneTasks / totalTasks * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 flex items-center justify-end",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				onClick: () => {
					setDraft(newCase());
					setOpen(true);
				},
				className: "gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New onboarding"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Active onboardings",
					value: cases.length,
					icon: UserCheck
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Tasks completed",
					value: `${doneTasks}/${totalTasks}`,
					icon: ClipboardCheck,
					accent: "success"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
					label: "Average completion",
					value: `${avgPct}%`,
					accent: "brand"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: cases.map((c) => {
				const done = c.tasks.filter((t) => t.done).length;
				const pct = Math.round(done / c.tasks.length * 100);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-medium",
							children: c.employee
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								c.role,
								" · Joins ",
								new Date(c.joinDate).toLocaleDateString(),
								" · Manager",
								" ",
								c.manager
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground",
								children: "Progress"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "font-display text-lg font-semibold",
								children: [pct, "%"]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: pct })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid gap-2 sm:grid-cols-2",
						children: c.tasks.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 rounded-lg border border-border bg-card/40 px-3 py-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: t.done,
									onChange: () => hrms.toggleOnboardingTask(c.id, t.key)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: t.done ? "line-through text-muted-foreground" : "",
									children: t.label
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ml-auto text-[10px] uppercase text-muted-foreground",
									children: t.owner
								})
							]
						}, t.key))
					})
				] }, c.id);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New onboarding" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Employee" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.employee,
							onChange: (e) => setDraft({
								...draft,
								employee: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Role" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.role,
							onChange: (e) => setDraft({
								...draft,
								role: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Manager" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: draft.manager,
							onChange: (e) => setDraft({
								...draft,
								manager: e.target.value
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Join date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: draft.joinDate.slice(0, 10),
							onChange: (e) => setDraft({
								...draft,
								joinDate: e.target.value
							})
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setOpen(false),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => {
						if (!draft.employee) return;
						hrms.addOnboarding(draft);
						setOpen(false);
						setDraft(newCase());
					},
					children: "Start onboarding"
				})] })
			] })
		})
	] });
}
//#endregion
export { OnboardingChecklistPage as default };
