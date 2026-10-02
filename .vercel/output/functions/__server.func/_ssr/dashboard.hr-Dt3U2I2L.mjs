import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Vt as Mail, b as UserCog, bt as Pencil, ht as Plus, k as Trash2, vt as Phone } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { c as useAurix, s as uid, t as aurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.hr-Dt3U2I2L.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HRPage() {
	const ws = useAurix();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [d, setD] = (0, import_react.useState)(null);
	function openNew() {
		setD({
			id: uid("hr"),
			fullName: "",
			email: "",
			phone: "",
			department: "",
			designation: ""
		});
		setOpen(true);
	}
	function save() {
		if (!d) return;
		if (!d.fullName || !d.email) return toast.error("Name and email required");
		const exists = ws.hrs.some((h) => h.id === d.id);
		aurix.set({ hrs: exists ? ws.hrs.map((h) => h.id === d.id ? d : h) : [...ws.hrs, d] });
		toast.success(exists ? "HR updated" : "HR added");
		setOpen(false);
	}
	function remove(id) {
		aurix.set({ hrs: ws.hrs.filter((h) => h.id !== id) });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "HR Management",
			description: "People who keep the company running.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: openNew,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "Invite HR"]
			})
		}),
		ws.hrs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: "No HRs yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Invite your first HR to start managing the workforce."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: openNew,
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), "Invite HR"]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
			children: ws.hrs.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "group rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl transition-shadow hover:shadow-elegant",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-11 w-11 place-items-center rounded-full bg-foreground text-sm font-semibold text-background",
							children: h.fullName.split(" ").map((n) => n[0]).slice(0, 2).join("")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-medium",
							children: h.fullName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-xs text-muted-foreground",
							children: h.designation || h.department || "HR"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "opacity-0 transition-opacity group-hover:opacity-100",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setD(h);
								setOpen(true);
							},
							className: "rounded p-1.5 text-muted-foreground hover:bg-accent",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => remove(h.id),
							className: "rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-1.5 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" }), h.email]
					}), h.phone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5" }), h.phone]
					}) : null]
				})]
			}, h.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-md",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: d && ws.hrs.some((h) => h.id === d.id) ? "Edit HR" : "Invite HR" }) }),
					d ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Full name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: d.fullName,
									onChange: (e) => setD({
										...d,
										fullName: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "email",
									value: d.email,
									onChange: (e) => setD({
										...d,
										email: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Phone",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: d.phone,
									onChange: (e) => setD({
										...d,
										phone: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Department",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: d.department,
									onChange: (e) => setD({
										...d,
										department: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Designation",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: d.designation,
									onChange: (e) => setD({
										...d,
										designation: e.target.value
									})
								})
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setOpen(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: save,
						children: "Save"
					})] })
				]
			})
		})
	] });
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			className: "text-xs",
			children: label
		}), children]
	});
}
//#endregion
export { HRPage as component };
