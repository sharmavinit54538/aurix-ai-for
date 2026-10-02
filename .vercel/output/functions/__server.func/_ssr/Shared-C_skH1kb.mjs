import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, er as Download, ft as Printer } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Shared-C_skH1kb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function StatCard({ label, value, hint, icon: Icon, accent = "brand" }) {
	const accentClass = {
		brand: "from-violet-500/15 to-fuchsia-500/10 text-foreground",
		success: "from-emerald-500/15 to-teal-500/10 text-foreground",
		warning: "from-amber-500/15 to-orange-500/10 text-foreground",
		danger: "from-rose-500/15 to-red-500/10 text-foreground",
		muted: "from-muted to-muted/40 text-foreground"
	}[accent];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${accentClass} p-4 backdrop-blur-xl shadow-sm`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
					children: label
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 font-display text-2xl font-semibold tracking-tight",
					children: value
				}),
				hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 text-xs text-muted-foreground",
					children: hint
				}) : null
			] }), Icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-9 w-9 place-items-center rounded-xl bg-background/60 text-foreground/80 shadow-sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
			}) : null]
		})
	});
}
function StatusBadge({ status, tone }) {
	const cls = {
		success: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300 ring-emerald-500/20",
		warning: "bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-amber-500/20",
		danger: "bg-rose-500/15 text-rose-600 dark:text-rose-300 ring-rose-500/20",
		info: "bg-sky-500/15 text-sky-600 dark:text-sky-300 ring-sky-500/20",
		muted: "bg-muted text-muted-foreground ring-border"
	}[tone ?? "muted"];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ring-1 ${cls}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-current opacity-70" }), status.replace(/-/g, " ")]
	});
}
function SearchBox({ value, onChange, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative w-full sm:w-72",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder: placeholder ?? "Search…",
			className: "h-9 pl-9"
		})]
	});
}
function GlassCard({ children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: `rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl shadow-sm ${className}`,
		children
	});
}
function EmptyState({ title, description, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-dashed border-border bg-card/40 p-10 text-center",
		children: [
			Icon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-3 grid h-10 w-10 place-items-center rounded-xl text-brand-foreground shadow-glow",
				style: { background: "var(--gradient-brand)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-base font-semibold",
				children: title
			}),
			description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-1 max-w-md text-sm text-muted-foreground",
				children: description
			}) : null
		]
	});
}
function PrintButton({ label = "Export PDF" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "outline",
		size: "sm",
		onClick: () => window.print(),
		className: "gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-4 w-4" }),
			" ",
			label
		]
	});
}
function CsvButton({ rows, filename, label = "Export CSV" }) {
	function onClick() {
		if (!rows.length) return;
		const headers = Object.keys(rows[0]);
		const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(","))].join("\n");
		const blob = new Blob([csv], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		a.click();
		URL.revokeObjectURL(url);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		variant: "outline",
		size: "sm",
		onClick,
		className: "gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }),
			" ",
			label
		]
	});
}
function QrTile({ value, size = 128, label }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		if (ref.current) import_lib.toCanvas(ref.current, value, {
			width: size,
			margin: 1
		}, () => {});
	}, [value, size]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", { ref }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "font-mono text-[11px] text-muted-foreground",
			children: label ?? value
		})]
	});
}
function Progress({ value, max = 100 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-2 w-full overflow-hidden rounded-full bg-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-full rounded-full transition-all",
			style: {
				width: `${Math.round(value / max * 100)}%`,
				background: "var(--gradient-brand)"
			}
		})
	});
}
function Skeleton({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `animate-pulse rounded-md bg-muted ${className}` });
}
//#endregion
export { Progress as a, Skeleton as c, PrintButton as i, StatCard as l, EmptyState as n, QrTile as o, GlassCard as r, SearchBox as s, CsvButton as t, StatusBadge as u };
