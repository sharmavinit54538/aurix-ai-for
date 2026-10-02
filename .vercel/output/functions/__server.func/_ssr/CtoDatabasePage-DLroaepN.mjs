import "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { cr as Coins } from "../_libs/lucide-react.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function CtoDatabasePage() {
	const dbs = [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-12 text-left",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-950 p-6 shadow-xl backdrop-blur-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-8 w-8 place-items-center rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coins, { className: "h-4 w-4" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold uppercase",
								children: "Database Management Hub"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-bold tracking-tight text-white sm:text-3xl",
							children: "Database Clusters & Slow Query Monitor"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-amber-200/70 max-w-2xl",
							children: "PostgreSQL replication, Redis Sentinel cache, Qdrant vector database, connection pool health, automated backups, and index optimization."
						})
					]
				})
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
							children: "Database Instance"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "Engine Version"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "Active Connections"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "Data Size"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "Health Status"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
					className: "divide-y divide-border/40",
					children: dbs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 5,
						className: "p-8 text-center text-xs text-muted-foreground",
						children: "No database clusters connected or monitored."
					}) }) : dbs.map((d, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "hover:bg-accent/20 transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-bold text-foreground",
								children: d.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-muted-foreground",
								children: d.engine
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-mono text-indigo-400",
								children: d.conn
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-mono text-amber-400",
								children: d.size
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "text-[10px] bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
									children: d.status
								})
							})
						]
					}, idx))
				})]
			})
		})]
	});
}
//#endregion
export { CtoDatabasePage, CtoDatabasePage as default };
