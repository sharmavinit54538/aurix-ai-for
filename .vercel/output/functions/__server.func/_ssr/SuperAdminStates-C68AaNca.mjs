import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Gt as Lock, J as ShieldAlert, T as TriangleAlert, fn as Inbox, l as WifiOff, lt as RefreshCw, un as Info } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { r as ApiError } from "./apiInstance-C5A0vaLH.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { H as logout } from "./auth-bootstrap-CR9kF6gO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SuperAdminStates-C68AaNca.js
var import_jsx_runtime = require_jsx_runtime();
/** Maps an API failure to the UI state that should be shown for it. */
function classifyError(error) {
	const status = error instanceof ApiError ? error.status : 0;
	const message = error instanceof Error ? error.message : "Unknown error";
	if (status === 401) return {
		kind: "unauthenticated",
		status,
		message
	};
	if (status === 403) return {
		kind: "forbidden",
		status,
		message
	};
	if (status === 0) return {
		kind: "network",
		status,
		message
	};
	return {
		kind: "failure",
		status,
		message
	};
}
/** True for 401/403 responses — the page should render the access-denied state. */
function isAuthorizationError(error) {
	const { kind } = classifyError(error);
	return kind === "unauthenticated" || kind === "forbidden";
}
var countFormatter = new Intl.NumberFormat("en-IN");
function formatCount(value) {
	return typeof value === "number" && Number.isFinite(value) ? countFormatter.format(value) : "—";
}
function formatDateTime(iso) {
	if (!iso) return "—";
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleString("en-IN", {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit"
	});
}
function formatDate(iso) {
	if (!iso) return "—";
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleDateString("en-IN", {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
function formatTime(iso) {
	if (!iso) return "—";
	const date = new Date(iso);
	if (Number.isNaN(date.getTime())) return "—";
	return date.toLocaleTimeString("en-IN", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	});
}
var relativeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
var RELATIVE_UNITS = [
	["year", 365 * 24 * 60 * 60 * 1e3],
	["month", 720 * 60 * 60 * 1e3],
	["week", 10080 * 60 * 1e3],
	["day", 1440 * 60 * 1e3],
	["hour", 3600 * 1e3],
	["minute", 60 * 1e3]
];
var DAY_MS = 1440 * 60 * 1e3;
function startOfLocalDay(time) {
	const date = new Date(time);
	return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}
/** Relative time ("5 minutes ago") computed from a real timestamp. */
function formatRelativeTime(iso, now = Date.now()) {
	if (!iso) return "—";
	const time = Date.parse(iso);
	if (Number.isNaN(time)) return "—";
	const diff = time - now;
	if (Math.abs(diff) >= DAY_MS && Math.abs(diff) < 7 * DAY_MS) {
		const calendarDays = Math.round((startOfLocalDay(time) - startOfLocalDay(now)) / DAY_MS);
		return relativeFormatter.format(calendarDays, "day");
	}
	for (const [unit, size] of RELATIVE_UNITS) if (Math.abs(diff) >= size) return relativeFormatter.format(Math.round(diff / size), unit);
	return "just now";
}
function formatMilliseconds(value) {
	if (typeof value !== "number" || !Number.isFinite(value)) return "—";
	return value < 10 ? `${value.toFixed(1)} ms` : `${Math.round(value)} ms`;
}
/** Human labels for the role values defined by the backend `RoleEnum`. */
var ROLE_LABELS = {
	super_admin: "Super Admin",
	hr_admin: "HR Admin",
	admin: "Admin",
	company_admin: "Company Admin",
	hr_manager: "HR Manager",
	manager: "Manager",
	employee: "Employee",
	intern: "Intern",
	it_admin: "IT Admin",
	executive: "Executive",
	ceo: "CEO",
	cto: "CTO",
	cfo: "CFO",
	coo: "COO",
	cmo: "CMO",
	clo: "CLO",
	ciso: "CISO",
	cio: "CIO"
};
function formatRoleLabel(role) {
	if (!role) return "—";
	const key = role.trim().toLowerCase();
	return ROLE_LABELS[key] ?? key.replace(/[_-]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
/** Role filter options — every value accepted by the backend `role` query parameter. */
var ROLE_FILTER_GROUPS = [
	{
		label: "Platform",
		roles: ["super_admin"]
	},
	{
		label: "HR administration",
		roles: [
			"hr_admin",
			"admin",
			"company_admin",
			"hr_manager"
		]
	},
	{
		label: "Leadership",
		roles: [
			"executive",
			"ceo",
			"cto",
			"cfo",
			"coo",
			"cmo",
			"clo",
			"ciso",
			"cio"
		]
	},
	{
		label: "Teams",
		roles: [
			"manager",
			"employee",
			"intern"
		]
	},
	{
		label: "IT",
		roles: ["it_admin"]
	}
];
function shortId(id) {
	if (!id) return "—";
	return id.length > 8 ? `${id.slice(0, 8)}…` : id;
}
/** Glass card container matching the Super Admin visual language. */
function Panel({ children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("rounded-2xl border border-border/60 bg-card/60 p-6 shadow-sm backdrop-blur-xl", className),
		children
	});
}
/** Numeric KPI: skeleton while loading, formatted value when present, em dash when unavailable. */
function KpiNumber({ value, loading, className }) {
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "inline-block h-8 w-16 align-middle" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className,
		title: value == null ? "Not provided by the API" : void 0,
		children: formatCount(value)
	});
}
function SkeletonRows({ rows = 3, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("space-y-3", className),
		"aria-busy": "true",
		"aria-live": "polite",
		children: Array.from({ length: rows }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-14 w-full rounded-xl" }, index))
	});
}
function EmptyState({ icon: Icon = Inbox, title, description, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-background/30 px-6 py-10 text-center", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-10 w-10 place-items-center rounded-xl bg-muted/60 text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 text-sm font-semibold text-foreground",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-sm text-xs text-muted-foreground",
				children: description
			})
		]
	});
}
var ERROR_COPY = {
	unauthenticated: {
		icon: Lock,
		hint: "Your session is no longer valid. Please sign in again."
	},
	forbidden: {
		icon: ShieldAlert,
		hint: "This data is restricted to the platform Super Admin account."
	},
	network: {
		icon: WifiOff,
		hint: "The OFC360 API could not be reached. Check your connection and try again."
	},
	failure: {
		icon: TriangleAlert,
		hint: "The server returned an error. Please try again."
	}
};
function ErrorState({ error, onRetry, title, retrying = false, className }) {
	const { kind, status, message } = classifyError(error);
	const { icon: Icon, hint } = ERROR_COPY[kind];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		role: "alert",
		className: cn("flex flex-col items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/5 px-6 py-8 text-center", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-10 w-10 place-items-center rounded-xl bg-rose-500/15 text-rose-400",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 text-sm font-semibold text-foreground",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-md text-xs text-muted-foreground",
				children: hint
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 max-w-md break-words font-mono text-[11px] text-rose-300/80",
				children: [status ? `HTTP ${status} · ` : "", message]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center gap-2",
				children: [onRetry && kind !== "unauthenticated" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					size: "sm",
					onClick: onRetry,
					disabled: retrying,
					className: "gap-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: cn("h-3.5 w-3.5", retrying && "animate-spin") }), retrying ? "Retrying…" : "Try again"]
				}), kind === "unauthenticated" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					className: "text-xs",
					onClick: () => void logout(),
					children: "Sign in again"
				})]
			})
		]
	});
}
/**
* Full-page denial.
* - Without `error`: the frontend role guard blocked a non-super-admin role → link to their own dashboard.
* - With `error`: the backend rejected the session (401/403) → the only fix is signing in with the
*   designated Super Admin account, so offer sign-out (a dashboard link would loop back here).
*/
function AccessDeniedState({ error }) {
	const failure = error !== void 0 ? classifyError(error) : null;
	const rejectedByApi = failure !== null;
	const unauthenticated = failure?.kind === "unauthenticated";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		role: "alert",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-lg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary",
					children: unauthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-6 w-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-6 w-6" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: unauthenticated ? "Session expired" : "Access denied"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: unauthenticated ? "Your session is no longer valid. Sign in again to continue." : rejectedByApi ? "The platform API rejected this session for Super Admin access. Sign in with the designated platform Super Admin account to continue." : "The Super Admin area is restricted to the platform Super Admin account. HR Admin, Manager, Employee, IT Admin and Executive roles cannot access it."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-col gap-2",
					children: [rejectedByApi ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void logout(),
						className: "inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
						children: unauthenticated ? "Sign in again" : "Sign out"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard",
						className: "inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
						children: "Go to my dashboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Back to Home"
					})]
				})
			]
		})
	});
}
function InlineNotice({ tone = "info", children, className }) {
	const Icon = tone === "warning" ? TriangleAlert : Info;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex items-start gap-2 rounded-xl border px-3 py-2.5 text-xs", tone === "warning" ? "border-amber-500/30 bg-amber-500/5 text-amber-200" : "border-blue-500/25 bg-blue-500/5 text-muted-foreground", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("mt-0.5 h-3.5 w-3.5 shrink-0", tone === "warning" ? "text-amber-400" : "text-blue-400") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children })]
	});
}
function PaginationBar({ page, hasNextPage, onPageChange, busy, itemCount, pageSize }) {
	const from = itemCount === 0 ? 0 : (page - 1) * pageSize + 1;
	const to = (page - 1) * pageSize + itemCount;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-2 border-t border-border/40 px-4 py-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: itemCount === 0 ? `Page ${page}` : `Showing ${formatCount(from)}–${formatCount(to)} · Page ${page}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				className: "h-7 text-xs",
				disabled: busy || page <= 1,
				onClick: () => onPageChange(page - 1),
				children: "Previous"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				size: "sm",
				className: "h-7 text-xs",
				disabled: busy || !hasNextPage,
				onClick: () => onPageChange(page + 1),
				children: "Next"
			})]
		})]
	});
}
//#endregion
export { isAuthorizationError as _, KpiNumber as a, ROLE_FILTER_GROUPS as c, formatDate as d, formatDateTime as f, formatTime as g, formatRoleLabel as h, InlineNotice as i, SkeletonRows as l, formatRelativeTime as m, EmptyState as n, PaginationBar as o, formatMilliseconds as p, ErrorState as r, Panel as s, AccessDeniedState as t, formatCount as u, shortId as v };
