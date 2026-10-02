import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Ln as FileText, a as X } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { _ as isAuthorizationError, f as formatDateTime, l as SkeletonRows, n as EmptyState, o as PaginationBar, r as ErrorState, t as AccessDeniedState, v as shortId } from "./SuperAdminStates-C68AaNca.mjs";
import { n as useOrganizationDirectory, s as useSuperAdminAuditLogs } from "./hooks-sx1lwuE8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.audit-logs-CDe8ZVBD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAGE_SIZE = 50;
function SuperAdminAuditLogsPage() {
	const [searchInput, setSearchInput] = (0, import_react.useState)("");
	const [search, setSearch] = (0, import_react.useState)("");
	const [page, setPage] = (0, import_react.useState)(1);
	const logs = useSuperAdminAuditLogs({
		page,
		pageSize: PAGE_SIZE,
		search: search || void 0
	});
	const directory = useOrganizationDirectory();
	const organizationNames = (0, import_react.useMemo)(() => new Map((directory.data ?? []).map((org) => [org.id, org.name])), [directory.data]);
	const applySearch = (event) => {
		event.preventDefault();
		setSearch(searchInput.trim());
		setPage(1);
	};
	const clearSearch = () => {
		setSearchInput("");
		setSearch("");
		setPage(1);
	};
	if (logs.isError && isAuthorizationError(logs.error)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessDeniedState, { error: logs.error });
	const rows = logs.data ?? [];
	const organizationLabel = (organizationId) => {
		if (!organizationId) return "Platform-level";
		return organizationNames.get(organizationId) ?? `Tenant ${shortId(organizationId)}`;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: applySearch,
			className: "flex items-center gap-2",
			role: "search",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: searchInput,
						onChange: (event) => setSearchInput(event.target.value),
						placeholder: "Search by action, actor email, or details…",
						"aria-label": "Search audit logs",
						className: "pl-9 pr-8 h-9 text-xs"
					}),
					searchInput && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: clearSearch,
						className: "absolute right-2 top-1/2 -translate-y-1/2 rounded p-0.5 text-muted-foreground hover:text-foreground",
						"aria-label": "Clear search",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "submit",
				size: "sm",
				variant: "outline",
				className: "h-9 text-xs",
				children: "Search"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-xl",
			children: [logs.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonRows, {
				rows: 6,
				className: "p-4"
			}) : logs.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				className: "m-4",
				title: "Unable to load audit logs.",
				error: logs.error,
				onRetry: () => void logs.refetch(),
				retrying: logs.isFetching
			}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: FileText,
					title: search ? "No matching audit events" : "No activity available",
					description: search ? "No audit events match the current search." : page > 1 ? "There are no more audit events on this page." : "No audit events have been recorded yet."
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("overflow-x-auto transition-opacity", logs.isPlaceholderData && "opacity-60"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b border-border/60 bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Timestamp"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Actor"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Action"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Organization"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-3 px-4",
								children: "Details"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y divide-border/40",
						children: rows.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/30 transition-colors align-top",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 px-4 text-muted-foreground font-mono whitespace-nowrap",
									children: formatDateTime(log.timestamp)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 px-4 font-medium text-foreground",
									children: log.actorEmail ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground italic",
										children: "Not recorded"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 px-4 font-mono font-semibold text-purple-400 break-all",
									children: log.action ?? "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 px-4 text-muted-foreground",
									title: log.organizationId ?? void 0,
									children: organizationLabel(log.organizationId)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 px-4 text-muted-foreground max-w-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "line-clamp-2",
										title: log.details ?? void 0,
										children: log.details ?? "—"
									})
								})
							]
						}, log.id))
					})]
				})
			}), !logs.isPending && !logs.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaginationBar, {
				page,
				hasNextPage: rows.length === PAGE_SIZE,
				onPageChange: setPage,
				busy: logs.isFetching,
				itemCount: rows.length,
				pageSize: PAGE_SIZE
			})]
		})]
	});
}
var SplitComponent = SuperAdminAuditLogsPage;
//#endregion
export { SplitComponent as component };
