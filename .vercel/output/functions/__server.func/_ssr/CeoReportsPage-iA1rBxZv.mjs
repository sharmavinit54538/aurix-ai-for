import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Fr as ChartLine, Ln as FileText, Rn as FileSpreadsheet, er as Download } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function CeoReportsPage() {
	const reports = [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative overflow-hidden rounded-2xl border border-purple-500/30 bg-gradient-to-r from-slate-900 via-purple-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-8 w-8 place-items-center rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartLine, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold uppercase",
								children: "Executive Reports & Exports"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
							children: "Board Reports & Financial Statements"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-purple-200/70 max-w-2xl",
							children: "Downloadable executive board decks, financial statements, HR workforce audits, sales pipelines, and SOC2 compliance reports."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => toast.info("No report packages ready for export yet."),
						className: "bg-purple-600 hover:bg-purple-500 text-white text-xs cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "mr-1.5 h-3.5 w-3.5" }), "Export PDF Deck"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => toast.info("No master ledger ready for export yet."),
						className: "border-border text-foreground text-xs cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "mr-1.5 h-3.5 w-3.5" }), "Export Excel"]
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-xl border border-border/80 bg-card/60 overflow-hidden",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-muted/50 text-muted-foreground uppercase text-[10px] border-b border-border/60",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "Report Title"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "Category"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "Date Generated"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "File Size"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3 text-right",
							children: "Download"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-border/40",
					children: reports.length > 0 ? reports.map((r, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-accent/20 transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-bold text-foreground",
								children: r.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-purple-400 font-mono",
								children: r.cat
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-muted-foreground",
								children: r.date
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-mono text-muted-foreground",
								children: r.size
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-right",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									size: "sm",
									variant: "ghost",
									onClick: () => toast.success(`Downloaded ${r.title}`),
									className: "h-7 text-xs text-purple-400 hover:bg-purple-500/20 cursor-pointer",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1 h-3.5 w-3.5" }), " PDF"]
								})
							})
						]
					}, idx)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 5,
						className: "p-8 text-center text-xs text-muted-foreground",
						children: "No executive reports generated yet. Reports will appear here once compiled."
					}) })
				})]
			})
		})]
	});
}
//#endregion
export { CeoReportsPage, CeoReportsPage as default };
