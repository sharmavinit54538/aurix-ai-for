import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { G as SlidersVertical, Jr as Briefcase, Ln as FileText, Z as Server, _ as UserPlus, mi as Activity, p as Users, qr as Building2, si as ArrowUpRight } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { _ as isAuthorizationError, a as KpiNumber, f as formatDateTime, i as InlineNotice, l as SkeletonRows, m as formatRelativeTime, n as EmptyState, p as formatMilliseconds, r as ErrorState, s as Panel, t as AccessDeniedState, u as formatCount, v as shortId } from "./SuperAdminStates-C68AaNca.mjs";
import { d as useSuperAdminStatistics, f as useSuperAdminUsers, n as useOrganizationDirectory, p as useSystemHealth, s as useSuperAdminAuditLogs } from "./hooks-sx1lwuE8.mjs";
import { n as OrganizationStatusBadge, r as RoleBadge, t as AccountStatusBadge } from "./Badges-BovbKWqK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.index-DyTta1NV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var RECENT_ORGANIZATIONS = 5;
var RECENT_USERS_PARAMS = {
	page: 1,
	pageSize: 5
};
var RECENT_ACTIVITY_PARAMS = {
	page: 1,
	pageSize: 6
};
var ROLE_CARDS = [
	{
		key: "hrAdmins",
		label: "HR Admins",
		description: "HR & company administrators",
		tone: "emerald"
	},
	{
		key: "managers",
		label: "Managers",
		description: "Team & department managers",
		tone: "blue"
	},
	{
		key: "employees",
		label: "Employees",
		description: "Workforce members",
		tone: "sky"
	},
	{
		key: "itAdmins",
		label: "IT Admins",
		description: "IT & security administrators",
		tone: "cyan"
	},
	{
		key: "executives",
		label: "Executives",
		description: "Leadership & C-Suite",
		tone: "amber"
	}
];
var TONE_CLASSES = {
	emerald: {
		card: "border-emerald-500/20 bg-emerald-500/5",
		label: "text-emerald-400"
	},
	blue: {
		card: "border-blue-500/20 bg-blue-500/5",
		label: "text-blue-400"
	},
	sky: {
		card: "border-sky-500/20 bg-sky-500/5",
		label: "text-sky-400"
	},
	cyan: {
		card: "border-cyan-500/20 bg-cyan-500/5",
		label: "text-cyan-400"
	},
	amber: {
		card: "border-amber-500/20 bg-amber-500/5",
		label: "text-amber-400"
	}
};
function SuperAdminOverviewPage() {
	const statistics = useSuperAdminStatistics();
	const organizations = useOrganizationDirectory();
	const recentUsers = useSuperAdminUsers(RECENT_USERS_PARAMS);
	const recentActivity = useSuperAdminAuditLogs(RECENT_ACTIVITY_PARAMS);
	const systemHealth = useSystemHealth();
	const organizationNames = (0, import_react.useMemo)(() => new Map((organizations.data ?? []).map((org) => [org.id, org.name])), [organizations.data]);
	if (statistics.isError && isAuthorizationError(statistics.error)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessDeniedState, { error: statistics.error });
	const stats = statistics.data;
	const statsLoading = statistics.isPending;
	const totalOrganizations = stats?.organizations?.total ?? null;
	const totalUsers = stats?.users?.total ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto",
		children: [
			statistics.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				title: "Unable to load Super Admin statistics. Please try again.",
				error: statistics.error,
				onRetry: () => void statistics.refetch(),
				retrying: statistics.isFetching
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(KpiCard, {
						label: "Total Registered Users",
						icon: Users,
						accent: "purple",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-baseline gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiNumber, {
								value: totalUsers,
								loading: statsLoading,
								className: "text-3xl font-extrabold tracking-tight text-foreground"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-muted-foreground",
								children: "registered accounts"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center gap-3 text-xs text-muted-foreground border-t border-border/40 pt-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-emerald-400 font-medium",
									children: [statsLoading ? "…" : formatCount(stats?.users?.active), " Active"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-rose-400 font-medium",
									children: [statsLoading ? "…" : formatCount(stats?.users?.inactive), " Inactive"]
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(KpiCard, {
						label: "Organizations",
						icon: Building2,
						accent: "blue",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-baseline gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiNumber, {
								value: totalOrganizations,
								loading: statsLoading,
								className: "text-3xl font-extrabold tracking-tight text-foreground"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium text-blue-400",
								children: "organizations"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground border-t border-border/40 pt-2.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									title: "Onboarding completed",
									children: ["Onboarded: ", statsLoading ? "…" : formatCount(stats?.organizations?.onboarded)]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Trial: ", statsLoading ? "…" : formatCount(stats?.organizations?.trial)] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Suspended: ", statsLoading ? "…" : formatCount(stats?.organizations?.suspended)] })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(KpiCard, {
						label: "Active Workforce",
						icon: Briefcase,
						accent: "amber",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-baseline gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiNumber, {
								value: stats?.activeWorkforce ?? null,
								loading: statsLoading,
								className: "text-3xl font-extrabold tracking-tight text-foreground"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "employees"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 text-xs text-muted-foreground border-t border-border/40 pt-2.5",
							children: "Active workforce across all organizations"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "System Health",
						icon: Activity,
						accent: "emerald",
						children: systemHealth.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-7 w-24" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-full" })]
						}) : systemHealth.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg font-bold text-rose-400",
								children: "Check failed"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => void systemHealth.refetch(),
								className: "text-purple-400 hover:text-purple-300 underline-offset-2 hover:underline",
								children: "Retry health check"
							})]
						}) : !systemHealth.data || !systemHealth.data.database ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 space-y-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-lg font-bold text-muted-foreground",
								children: "Unavailable"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-muted-foreground",
								children: "Database health telemetry unavailable"
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-baseline gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("text-2xl font-bold tracking-tight capitalize", systemHealth.data.database.status === "online" ? "text-emerald-400" : systemHealth.data.database.status === "degraded" ? "text-amber-400" : "text-muted-foreground"),
								children: systemHealth.data.database.status ?? "Unknown"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-muted-foreground",
								children: "database"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center justify-between text-xs text-muted-foreground border-t border-border/40 pt-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								title: "Measured by the API server (SELECT 1)",
								children: ["DB ping: ", formatMilliseconds(systemHealth.data.database.pingMs)]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								title: "Measured from this browser",
								children: ["API: ", formatMilliseconds(systemHealth.data.apiRoundTripMs)]
							})]
						})] })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-bold text-foreground",
					children: "User Statistics by Role"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Live account counts across all customer organizations"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "ghost",
					size: "sm",
					className: "gap-1.5 text-xs text-purple-400 hover:text-purple-300",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/dashboard/super-admin/users",
						children: ["Inspect user registry", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5",
				children: ROLE_CARDS.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("rounded-xl border p-4", TONE_CLASSES[card.tone].card),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cn("text-xs font-semibold uppercase tracking-wider", TONE_CLASSES[card.tone].label),
							children: card.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-2xl font-extrabold text-foreground mt-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiNumber, {
								value: stats?.users?.[card.key] ?? null,
								loading: statsLoading
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] text-muted-foreground mt-1 truncate",
							title: card.description,
							children: card.description
						})
					]
				}, card.key))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
					icon: Building2,
					iconClass: "text-blue-400",
					title: "Recent Organizations",
					subtitle: "Newest tenant companies on the platform",
					to: "/dashboard/super-admin/organizations",
					linkLabel: "View all",
					linkClass: "text-blue-400 hover:text-blue-300"
				}), organizations.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonRows, { rows: 3 }) : organizations.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
					title: "Unable to load organizations.",
					error: organizations.error,
					onRetry: () => void organizations.refetch(),
					retrying: organizations.isFetching
				}) : organizations.data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: Building2,
					title: "No organizations found",
					description: "No tenant companies have been created on the platform yet."
				}), (totalOrganizations ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(InlineNotice, {
					tone: "warning",
					className: "mt-3",
					children: [
						"Platform statistics report ",
						formatCount(totalOrganizations),
						" organizations, but the organization list came back empty. The server may have failed to load tenant records — try refreshing."
					]
				})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: organizations.data.slice(0, RECENT_ORGANIZATIONS).map((org) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-3 rounded-xl border border-border/40 bg-background/50 p-3.5 hover:border-border transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "font-semibold text-sm text-foreground truncate",
								children: org.name ?? shortId(org.id)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground flex flex-wrap items-center gap-x-2 mt-0.5",
								children: [
									org.domain && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: org.domain
									}),
									org.domain && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										title: formatDateTime(org.createdAt),
										children: ["Created ", formatRelativeTime(org.createdAt)]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex shrink-0 items-center gap-3",
							children: [
								org.plan && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] uppercase font-bold text-blue-400 border-blue-500/30",
									children: org.plan
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xs font-semibold text-foreground",
										children: [formatCount(org.userCount), " users"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-[10px] text-muted-foreground",
										children: [formatCount(org.employeeCount), " employees"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrganizationStatusBadge, { status: org.status })
							]
						})]
					}, org.id))
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
					icon: Activity,
					iconClass: "text-purple-400",
					title: "Platform Activity Feed",
					subtitle: "Latest entries from the platform audit trail",
					to: "/dashboard/super-admin/activity",
					linkLabel: "Full Feed",
					linkClass: "text-purple-400 hover:text-purple-300"
				}), recentActivity.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonRows, { rows: 4 }) : recentActivity.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
					title: "Unable to load platform activity.",
					error: recentActivity.error,
					onRetry: () => void recentActivity.refetch(),
					retrying: recentActivity.isFetching
				}) : recentActivity.data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
					icon: Activity,
					title: "No activity available",
					description: "No audit events have been recorded yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: recentActivity.data.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between gap-3 rounded-xl border border-border/40 bg-background/50 p-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 space-y-0.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-semibold text-foreground font-mono break-all",
									children: event.action ?? "—"
								}),
								event.details && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-muted-foreground line-clamp-2",
									children: event.details
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[11px] text-muted-foreground",
									children: [
										"By ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-foreground font-medium",
											children: event.actorEmail ?? "actor not recorded"
										}),
										" · ",
										event.organizationId ? organizationNames.get(event.organizationId) ?? `Tenant ${shortId(event.organizationId)}` : "Platform-level"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 text-[10px] text-muted-foreground",
							title: formatDateTime(event.timestamp),
							children: formatRelativeTime(event.timestamp)
						})]
					}, event.id))
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, {
				className: "p-0 overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-6 pb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
						icon: UserPlus,
						iconClass: "text-emerald-400",
						title: "Recently Registered Users",
						subtitle: "Newest accounts across all organizations",
						to: "/dashboard/super-admin/users",
						linkLabel: "All users",
						linkClass: "text-emerald-400 hover:text-emerald-300"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-6 pb-6",
					children: recentUsers.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonRows, { rows: 3 }) : recentUsers.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
						title: "Unable to load recent users.",
						error: recentUsers.error,
						onRetry: () => void recentUsers.refetch(),
						retrying: recentUsers.isFetching
					}) : recentUsers.data.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
						icon: Users,
						title: "No users found",
						description: "No accounts have been registered yet."
					}), (totalUsers ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(InlineNotice, {
						tone: "warning",
						className: "mt-3",
						children: [
							"Platform statistics report ",
							formatCount(totalUsers),
							" users, but the user list came back empty. The server may have failed to load user records — try refreshing."
						]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto rounded-xl border border-border/40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b border-border/60 bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-3",
										children: "User"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-3",
										children: "Role"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-3",
										children: "Organization"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-3",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-2.5 px-3",
										children: "Registered"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border/40",
								children: recentUsers.data.map((user) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "hover:bg-muted/30 transition-colors",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											className: "py-2.5 px-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-semibold text-foreground",
												children: user.name ?? "—"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "font-mono text-[11px] text-muted-foreground",
												children: user.email ?? "—"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBadge, { role: user.role })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3 text-foreground",
											children: user.organizationName ?? (user.organizationId ? shortId(user.organizationId) : user.role?.toLowerCase() === "super_admin" ? "Platform" : "No organization")
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountStatusBadge, { isActive: user.isActive })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "py-2.5 px-3 text-muted-foreground",
											title: formatDateTime(user.createdAt),
											children: formatRelativeTime(user.createdAt)
										})
									]
								}, user.id))
							})]
						})
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Panel, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-bold text-foreground mb-1",
					children: "Platform Administration Modules"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mb-4",
					children: "Direct navigation to platform owner controls"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HubLink, {
							to: "/dashboard/super-admin/users",
							icon: Users,
							accent: "purple",
							title: "User Registry",
							description: "Search, filter, activate or deactivate accounts"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HubLink, {
							to: "/dashboard/super-admin/audit-logs",
							icon: FileText,
							accent: "blue",
							title: "Audit Logs",
							description: "Searchable history of recorded platform events"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HubLink, {
							to: "/dashboard/super-admin/settings",
							icon: SlidersVertical,
							accent: "emerald",
							title: "Platform Settings",
							description: "Platform configuration values stored by the API"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HubLink, {
							to: "/dashboard/super-admin/platform-config",
							icon: Server,
							accent: "amber",
							title: "System Diagnostics",
							description: "Live API, database and AI service health checks"
						})
					]
				})
			] })
		]
	});
}
var ACCENT_CLASSES = {
	purple: {
		hover: "hover:border-purple-500/40",
		icon: "bg-purple-500/10 text-purple-400",
		text: "text-purple-400",
		hubHover: "hover:border-purple-500/50"
	},
	blue: {
		hover: "hover:border-blue-500/40",
		icon: "bg-blue-500/10 text-blue-400",
		text: "text-blue-400",
		hubHover: "hover:border-blue-500/50"
	},
	emerald: {
		hover: "hover:border-emerald-500/40",
		icon: "bg-emerald-500/10 text-emerald-400",
		text: "text-emerald-400",
		hubHover: "hover:border-emerald-500/50"
	},
	amber: {
		hover: "hover:border-amber-500/40",
		icon: "bg-amber-500/10 text-amber-400",
		text: "text-amber-400",
		hubHover: "hover:border-amber-500/50"
	}
};
function KpiCard({ label, icon: Icon, accent, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-xl transition-all", ACCENT_CLASSES[accent].hover),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium uppercase tracking-wider",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("rounded-lg p-2", ACCENT_CLASSES[accent].icon),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
			})]
		}), children]
	});
}
function SectionHeader({ icon: Icon, iconClass, title, subtitle, to, linkLabel, linkClass }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between mb-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-5 w-5", iconClass) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-bold text-foreground",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: subtitle
			})] })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "ghost",
			size: "sm",
			className: cn("text-xs gap-1", linkClass),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to,
				children: [
					linkLabel,
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "h-3.5 w-3.5" })
				]
			})
		})]
	});
}
function HubLink({ to, icon: Icon, accent, title, description }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to,
		className: cn("rounded-xl border border-border/50 bg-background/40 p-4 hover:bg-accent/40 transition-all group", ACCENT_CLASSES[accent].hubHover),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-5 w-5 group-hover:scale-110 transition-transform", ACCENT_CLASSES[accent].text) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "font-semibold text-sm text-foreground mt-2",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground mt-0.5",
				children: description
			})
		]
	});
}
var SplitComponent = SuperAdminOverviewPage;
//#endregion
export { SplitComponent as component };
