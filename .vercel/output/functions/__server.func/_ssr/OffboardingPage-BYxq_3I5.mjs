import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ln as FileText, Ut as LogOut, er as Download, pi as Archive } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { a as Progress, l as StatCard, r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { r as useHrms, t as hrms } from "./store-o03qs3ZS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/OffboardingPage-BYxq_3I5.js
var import_jsx_runtime = require_jsx_runtime();
function downloadBundle(employee, docs) {
	const content = docs.map((d) => `--- ${d.name} ---\nIssued for ${employee} on ${(/* @__PURE__ */ new Date()).toLocaleDateString()}\n`).join("\n");
	const blob = new Blob([content], { type: "text/plain" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `${employee.replace(/\s+/g, "_")}_exit_bundle.txt`;
	a.click();
	URL.revokeObjectURL(url);
}
function OffboardingPage() {
	const cases = useHrms((s) => s.offboarding);
	const total = cases.length;
	const done = cases.filter((c) => c.status === "completed").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 grid gap-3 sm:grid-cols-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Active offboardings",
				value: total - done,
				icon: LogOut,
				accent: "warning"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Completed",
				value: done,
				icon: Archive,
				accent: "success"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
				label: "Documents ready",
				value: cases.reduce((s, c) => s + c.documents.filter((d) => d.ready).length, 0),
				icon: FileText,
				accent: "brand"
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 lg:grid-cols-2",
		children: cases.map((c) => {
			const taskDone = c.tasks.filter((t) => t.done).length;
			const pct = Math.round(taskDone / c.tasks.length * 100);
			const allDocs = c.documents.every((d) => d.ready);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(GlassCard, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-medium",
						children: c.employee
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-xs text-muted-foreground",
						children: [
							"LWD ",
							new Date(c.lastWorkingDay).toLocaleDateString(),
							" · ",
							c.status
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: "Automation"
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
								onChange: () => hrms.toggleOffboardingTask(c.id, t.key)
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
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 border-t border-border pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: "Documents"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: c.documents.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: d.ready ? "default" : "outline",
							size: "sm",
							onClick: () => hrms.markOffboardingDoc(c.id, d.name),
							className: "gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5" }),
								" ",
								d.ready ? `${d.name} ✓` : `Generate ${d.name}`
							]
						}, d.name))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						disabled: !allDocs,
						onClick: () => downloadBundle(c.employee, c.documents),
						className: "gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Download ZIP bundle"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => hrms.completeOffboarding(c.id),
						disabled: c.status === "completed",
						className: "gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-4 w-4" }), " Archive employee"]
					})]
				})
			] }, c.id);
		})
	})] });
}
//#endregion
export { OffboardingPage, OffboardingPage as default };
