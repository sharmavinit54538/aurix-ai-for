import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Jr as Briefcase, a as X, b as UserCog, p as Users, qr as Building2 } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { _ as isAuthorizationError, a as KpiNumber, d as formatDate, f as formatDateTime, i as InlineNotice, l as SkeletonRows, n as EmptyState, o as PaginationBar, r as ErrorState, t as AccessDeniedState, u as formatCount, v as shortId } from "./SuperAdminStates-C68AaNca.mjs";
import { c as useSuperAdminOrganizations, d as useSuperAdminStatistics } from "./hooks-sx1lwuE8.mjs";
import { n as OrganizationStatusBadge } from "./Badges-BovbKWqK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.organizations-BKZI6Wt9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAGE_SIZE = 24;
var COUNTERS = [
	{
		key: "total",
		label: "Total",
		tone: "text-foreground"
	},
	{
		key: "onboarded",
		label: "Onboarded",
		tone: "text-emerald-400"
	},
	{
		key: "trial",
		label: "Trial",
		tone: "text-amber-400"
	},
	{
		key: "suspended",
		label: "Suspended",
		tone: "text-rose-400"
	},
	{
		key: "paid",
		label: "Paid",
		tone: "text-blue-400"
	},
	{
		key: "complimentary",
		label: "Complimentary",
		tone: "text-purple-400"
	},
	{
		key: "withoutSubscription",
		label: "No subscription",
		tone: "text-muted-foreground"
	}
];
function SuperAdminOrganizationsPage() {
	const [searchInput, setSearchInput] = (0, import_react.useState)("");
	const [search, setSearch] = (0, import_react.useState)("");
	const [onboarding, setOnboarding] = (0, import_react.useState)("ALL");
	const [page, setPage] = (0, import_react.useState)(1);
	const organizations = useSuperAdminOrganizations({
		page,
		pageSize: PAGE_SIZE,
		search: search || void 0,
		onboarding: onboarding === "ALL" ? void 0 : onboarding
	});
	const statistics = useSuperAdminStatistics();
	const filtersActive = Boolean(search) || onboarding !== "ALL";
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
	if (organizations.isError && isAuthorizationError(organizations.error)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessDeniedState, { error: organizations.error });
	const counts = statistics.data?.organizations;
	const rows = organizations.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto",
		children: [
			statistics.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				title: "Unable to load organization statistics.",
				error: statistics.error,
				onRetry: () => void statistics.refetch(),
				retrying: statistics.isFetching
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7",
				children: COUNTERS.map((counter) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border/60 bg-card/60 p-3 text-center shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-medium uppercase text-muted-foreground",
						children: counter.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("mt-0.5 text-xl font-bold", counter.tone),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiNumber, {
							value: counts?.[counter.key] ?? null,
							loading: statistics.isPending
						})
					})]
				}, counter.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 md:flex-row md:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: applySearch,
					className: "flex flex-1 items-center gap-2",
					role: "search",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: searchInput,
								onChange: (event) => setSearchInput(event.target.value),
								placeholder: "Search by company name, domain, or HR admin name/email…",
								"aria-label": "Search organizations",
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
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-1 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted-foreground",
						children: "Onboarding:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						value: onboarding,
						onChange: (event) => {
							setOnboarding(event.target.value);
							setPage(1);
						},
						className: "h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ALL",
								children: "All"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "complete",
								children: "Completed"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "pending",
								children: "Not completed"
							})
						]
					})]
				})]
			}),
			organizations.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonRows, { rows: 4 }) : organizations.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				title: "Unable to load organizations.",
				error: organizations.error,
				onRetry: () => void organizations.refetch(),
				retrying: organizations.isFetching
			}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: Building2,
					title: "No organizations found",
					description: filtersActive ? "No organizations match the current search and filters." : page > 1 ? "There are no more organizations on this page." : "No tenant companies have been created on the platform yet."
				}), !filtersActive && page === 1 && (counts?.total ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(InlineNotice, {
					tone: "warning",
					children: [
						"Platform statistics report ",
						formatCount(counts?.total),
						" organizations, but the organization list came back empty. The server may have failed to load tenant records — try refreshing."
					]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 transition-opacity", organizations.isPlaceholderData && "opacity-60"),
				children: rows.map((org) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-xl hover:border-blue-500/40 transition-all flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: cn("text-[10px] font-bold uppercase tracking-wider", org.plan ? "text-blue-400 border-blue-500/30" : "text-muted-foreground border-border"),
								children: org.plan ?? "No plan"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-bold text-base text-foreground break-words",
								children: org.name ?? shortId(org.id)
							}), org.domain && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xs text-muted-foreground font-mono mt-0.5",
								children: org.domain
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-2 gap-2 text-xs border-y border-border/40 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-muted-foreground text-[11px] flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3" }), " User accounts"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-foreground mt-0.5",
									children: formatCount(org.userCount)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-muted-foreground text-[11px] flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-3 w-3" }), " Active employees"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-bold text-emerald-400 mt-0.5",
									children: formatCount(org.employeeCount)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-muted-foreground text-[11px] flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "h-3 w-3" }), " Primary HR admin"]
									}), org.primaryHrAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-0.5 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "font-medium text-foreground truncate",
											children: org.primaryHrAdmin.name ?? "Unnamed"
										}), org.primaryHrAdmin.email && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-[10px] font-mono text-muted-foreground truncate",
											children: org.primaryHrAdmin.email
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-medium text-muted-foreground mt-0.5",
										children: "Not assigned"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-muted-foreground text-[11px]",
										children: "Tenant status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-1",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrganizationStatusBadge, { status: org.status })
									})]
								})
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 pt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							title: formatDateTime(org.createdAt),
							children: ["Created: ", formatDate(org.createdAt)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[11px] text-blue-400 font-medium font-mono",
							title: org.id,
							children: ["ID ", shortId(org.id)]
						})]
					})]
				}, org.id))
			}),
			!organizations.isPending && !organizations.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-2xl border border-border/60 bg-card/60",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaginationBar, {
					page,
					hasNextPage: rows.length === PAGE_SIZE,
					onPageChange: setPage,
					busy: organizations.isFetching,
					itemCount: rows.length,
					pageSize: PAGE_SIZE
				})
			})
		]
	});
}
var SplitComponent = SuperAdminOrganizationsPage;
//#endregion
export { SplitComponent as component };
