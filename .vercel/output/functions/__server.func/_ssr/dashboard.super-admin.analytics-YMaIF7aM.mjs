import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ir as ChartColumn, Jr as Briefcase, Mr as ChartPie, _ as UserPlus, ln as KeyRound, p as Users, pr as Clock, qr as Building2 } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as useMounted } from "./aurix-store-BcCbMqU4.mjs";
import { C as Legend, S as Tooltip, a as PieChart, b as Cell, c as YAxis, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { _ as isAuthorizationError, a as KpiNumber, g as formatTime, h as formatRoleLabel, i as InlineNotice, n as EmptyState, r as ErrorState, t as AccessDeniedState, u as formatCount } from "./SuperAdminStates-C68AaNca.mjs";
import { d as useSuperAdminStatistics, t as useAnalyticsDataset } from "./hooks-sx1lwuE8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.analytics-YMaIF7aM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function monthKey(date) {
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}
/** Counts timestamps per calendar month for the `months` most recent months (inclusive of the current one). */
function buildMonthlyCounts(timestamps, months, now = /* @__PURE__ */ new Date()) {
	const buckets = [];
	const index = /* @__PURE__ */ new Map();
	for (let offset = months - 1; offset >= 0; offset -= 1) {
		const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
		const bucket = {
			key: monthKey(date),
			label: date.toLocaleDateString("en-IN", {
				month: "short",
				year: "2-digit"
			}),
			count: 0
		};
		buckets.push(bucket);
		index.set(bucket.key, bucket);
	}
	for (const timestamp of timestamps) {
		if (!timestamp) continue;
		const date = new Date(timestamp);
		if (Number.isNaN(date.getTime())) continue;
		const bucket = index.get(monthKey(date));
		if (bucket) bucket.count += 1;
	}
	return buckets;
}
var SIGN_IN_BUCKETS = [
	"Last 24 hours",
	"1–7 days ago",
	"8–30 days ago",
	"Over 30 days ago",
	"Never signed in"
];
var DAY_MS = 1440 * 60 * 1e3;
/** Mutually exclusive sign-in recency buckets derived from each user's last successful sign-in. */
function bucketSignInRecency(users, now = Date.now()) {
	const counts = new Map(SIGN_IN_BUCKETS.map((label) => [label, 0]));
	for (const user of users) {
		const time = user.lastLoginAt ? Date.parse(user.lastLoginAt) : NaN;
		let label;
		if (Number.isNaN(time)) label = "Never signed in";
		else if (now - time <= DAY_MS) label = "Last 24 hours";
		else if (now - time <= 7 * DAY_MS) label = "1–7 days ago";
		else if (now - time <= 30 * DAY_MS) label = "8–30 days ago";
		else label = "Over 30 days ago";
		counts.set(label, (counts.get(label) ?? 0) + 1);
	}
	return SIGN_IN_BUCKETS.map((label) => ({
		label,
		count: counts.get(label) ?? 0
	}));
}
/** Users whose last successful sign-in happened within the given number of days. */
function countSignedInWithin(users, days, now = Date.now()) {
	return users.filter((user) => {
		if (!user.lastLoginAt) return false;
		const time = Date.parse(user.lastLoginAt);
		return !Number.isNaN(time) && now - time <= days * DAY_MS;
	}).length;
}
/** Exact distribution by stored role value (each user counted once). */
function countUsersByRole(users) {
	const counts = /* @__PURE__ */ new Map();
	for (const user of users) {
		const label = user.role ? formatRoleLabel(user.role) : "Role not set";
		counts.set(label, (counts.get(label) ?? 0) + 1);
	}
	return [...counts.entries()].map(([label, count]) => ({
		label,
		count
	})).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
/** Tenants grouped by the plan stored on their subscription/company profile. */
function countOrganizationsByPlan(organizations) {
	const counts = /* @__PURE__ */ new Map();
	for (const org of organizations) {
		const label = org.plan ?? "No plan recorded";
		counts.set(label, (counts.get(label) ?? 0) + 1);
	}
	return [...counts.entries()].map(([label, count]) => ({
		label,
		count
	})).sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
/** Largest tenants by active employee records (tenants with no reported size are skipped). */
function topOrganizationsByWorkforce(organizations, limit) {
	const sized = [];
	for (const org of organizations) if (typeof org.employeeCount === "number" && org.employeeCount > 0) sized.push({
		id: org.id,
		name: org.name ?? org.id,
		employees: org.employeeCount,
		users: org.userCount
	});
	return sized.sort((a, b) => b.employees - a.employees || a.name.localeCompare(b.name)).slice(0, limit);
}
function sumCounts(items) {
	return items.reduce((total, item) => total + item.count, 0);
}
var TREND_MONTHS = 12;
var TOP_ORGANIZATIONS = 10;
/** One color per sign-in recency bucket (last bucket = never signed in). */
var RECENCY_COLORS = [
	"#10b981",
	"#06b6d4",
	"#3b82f6",
	"#f59e0b",
	"#94a3b8"
];
var PALETTE = [
	"#a855f7",
	"#3b82f6",
	"#10b981",
	"#f59e0b",
	"#06b6d4",
	"#f43f5e",
	"#0ea5e9",
	"#84cc16",
	"#e879f9",
	"#94a3b8"
];
function ChartTooltip({ active, payload, label }) {
	if (!active || !payload || payload.length === 0) return null;
	const title = label ?? payload[0]?.payload?.label ?? payload[0]?.payload?.name ?? payload[0]?.name;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border border-border/60 bg-card/95 px-3 py-2 text-xs shadow-xl backdrop-blur",
		children: [title !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-1 font-semibold text-foreground",
			children: title
		}), payload.map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-muted-foreground",
			children: [
				entry.name,
				": ",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold text-foreground",
					children: formatCount(Number(entry.value))
				})
			]
		}, index))]
	});
}
function ChartCard({ title, subtitle, icon: Icon, iconClass, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-xl", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex items-start gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("mt-0.5 h-4 w-4", iconClass) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-semibold text-foreground",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] text-muted-foreground",
				children: subtitle
			})] })]
		}), children]
	});
}
function ChartArea({ ready, empty, height = 260, children }) {
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "w-full animate-pulse rounded-xl bg-muted/10",
		style: { height }
	});
	if (empty) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: { height },
		className: "flex",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
			icon: ChartColumn,
			title: "No data available",
			className: "flex-1"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		style: { height },
		className: "w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children
		})
	});
}
var axisProps = {
	stroke: "#888888",
	fontSize: 10,
	tickLine: false,
	axisLine: false
};
function SuperAdminAnalyticsPage() {
	const mounted = useMounted();
	const statistics = useSuperAdminStatistics();
	const dataset = useAnalyticsDataset();
	const derived = (0, import_react.useMemo)(() => {
		if (!dataset.data) return null;
		const users = dataset.data.users.items;
		const organizations = dataset.data.organizations.items;
		const now = Date.now();
		return {
			userSignups: buildMonthlyCounts(users.map((user) => user.createdAt), TREND_MONTHS),
			organizationSignups: buildMonthlyCounts(organizations.map((org) => org.createdAt), TREND_MONTHS),
			signInRecency: bucketSignInRecency(users, now),
			signedIn7d: countSignedInWithin(users, 7, now),
			signedIn30d: countSignedInWithin(users, 30, now),
			neverSignedIn: users.filter((user) => !user.lastLoginAt).length,
			usersByRole: countUsersByRole(users),
			organizationsByPlan: countOrganizationsByPlan(organizations),
			largestOrganizations: topOrganizationsByWorkforce(organizations, TOP_ORGANIZATIONS),
			analyzedUsers: users.length
		};
	}, [dataset.data]);
	if (dataset.isError && isAuthorizationError(dataset.error)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessDeniedState, { error: dataset.error });
	const stats = statistics.data;
	const datasetLoading = dataset.isPending;
	const chartsReady = mounted && Boolean(derived);
	const statusData = stats && stats.users.active !== null && stats.users.inactive !== null ? [{
		name: "Active",
		value: stats.users.active,
		color: "#10b981"
	}, {
		name: "Inactive",
		value: stats.users.inactive,
		color: "#f43f5e"
	}] : [];
	const statusTotal = statusData.reduce((total, entry) => total + entry.value, 0);
	const percentOfAnalyzed = (count) => derived && derived.analyzedUsers > 0 ? `${Math.round(count / derived.analyzedUsers * 100)}% of analyzed accounts` : "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto",
		children: [
			dataset.data && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(InlineNotice, {
				tone: dataset.data.users.truncated || dataset.data.organizations.truncated ? "warning" : "info",
				children: [
					"Charts aggregate ",
					formatCount(dataset.data.users.items.length),
					" user records and",
					" ",
					formatCount(dataset.data.organizations.items.length),
					" organization records read from the API at",
					" ",
					formatTime(dataset.data.collectedAt),
					".",
					dataset.data.users.truncated && ` Only the ${formatCount(5e3)} most recently registered users are included; older accounts are not reflected in user charts.`,
					dataset.data.organizations.truncated && ` Only the ${formatCount(2e3)} most recent organizations are included.`
				]
			}),
			statistics.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				title: "Unable to load Super Admin statistics. Please try again.",
				error: statistics.error,
				onRetry: () => void statistics.refetch(),
				retrying: statistics.isFetching
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Highlight, {
						label: "Total users",
						icon: Users,
						iconClass: "text-purple-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiNumber, {
							value: stats?.users.total ?? null,
							loading: statistics.isPending,
							className: "text-3xl font-extrabold text-foreground"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: statistics.isPending ? "…" : `${formatCount(stats?.users.active)} active · ${formatCount(stats?.users.inactive)} inactive`
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Highlight, {
						label: "Signed in · last 30 days",
						icon: KeyRound,
						iconClass: "text-emerald-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiNumber, {
							value: derived?.signedIn30d ?? null,
							loading: datasetLoading,
							className: "text-3xl font-extrabold text-foreground"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: derived ? `${percentOfAnalyzed(derived.signedIn30d)} · ${formatCount(derived.signedIn7d)} in last 7 days` : "…"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Highlight, {
						label: "Never signed in",
						icon: Clock,
						iconClass: "text-amber-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiNumber, {
							value: derived?.neverSignedIn ?? null,
							loading: datasetLoading,
							className: "text-3xl font-extrabold text-foreground"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: derived ? percentOfAnalyzed(derived.neverSignedIn) || "No accounts analyzed" : "…"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Highlight, {
						label: "Organizations",
						icon: Building2,
						iconClass: "text-blue-400",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiNumber, {
							value: stats?.organizations.total ?? null,
							loading: statistics.isPending,
							className: "text-3xl font-extrabold text-foreground"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-xs text-muted-foreground",
							children: statistics.isPending ? "…" : `${formatCount(stats?.activeWorkforce)} active employee records`
						})]
					})
				]
			}),
			dataset.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				title: "Unable to load analytics data. Please try again.",
				error: dataset.error,
				onRetry: () => void dataset.refetch(),
				retrying: dataset.isFetching
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-4 lg:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
						title: "New user accounts",
						subtitle: `Accounts created per month · last ${TREND_MONTHS} months`,
						icon: UserPlus,
						iconClass: "text-purple-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartArea, {
							ready: chartsReady,
							empty: !derived || sumCounts(derived.userSignups) === 0,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: derived?.userSignups ?? [],
								margin: {
									top: 10,
									right: 10,
									left: -20,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										className: "stroke-border/40",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "label",
										...axisProps
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										allowDecimals: false,
										...axisProps
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {}),
										cursor: { fill: "rgba(168,85,247,0.08)" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "count",
										name: "New accounts",
										fill: "#a855f7",
										radius: [
											6,
											6,
											0,
											0
										]
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
						title: "New organizations",
						subtitle: `Tenant companies created per month · last ${TREND_MONTHS} months`,
						icon: Building2,
						iconClass: "text-blue-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartArea, {
							ready: chartsReady,
							empty: !derived || sumCounts(derived.organizationSignups) === 0,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: derived?.organizationSignups ?? [],
								margin: {
									top: 10,
									right: 10,
									left: -20,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										className: "stroke-border/40",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "label",
										...axisProps
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										allowDecimals: false,
										...axisProps
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {}),
										cursor: { fill: "rgba(59,130,246,0.08)" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "count",
										name: "New organizations",
										fill: "#3b82f6",
										radius: [
											6,
											6,
											0,
											0
										]
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
						title: "Sign-in recency",
						subtitle: "Time since each account's last successful sign-in",
						icon: KeyRound,
						iconClass: "text-emerald-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartArea, {
							ready: chartsReady,
							empty: !derived || derived.analyzedUsers === 0,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: derived?.signInRecency ?? [],
								margin: {
									top: 10,
									right: 10,
									left: -20,
									bottom: 0
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										className: "stroke-border/40",
										vertical: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "label",
										...axisProps,
										interval: 0
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										allowDecimals: false,
										...axisProps
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {}),
										cursor: { fill: "rgba(16,185,129,0.08)" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "count",
										name: "Accounts",
										radius: [
											6,
											6,
											0,
											0
										],
										children: (derived?.signInRecency ?? []).map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: RECENCY_COLORS[index % RECENCY_COLORS.length] }, entry.label))
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
						title: "Account status",
						subtitle: "Active vs inactive accounts (platform statistics)",
						icon: ChartPie,
						iconClass: "text-rose-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartArea, {
							ready: mounted && !statistics.isPending,
							empty: statusTotal === 0,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: statusData,
									dataKey: "value",
									nameKey: "name",
									cx: "50%",
									cy: "45%",
									innerRadius: 60,
									outerRadius: 88,
									paddingAngle: 3,
									children: statusData.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: entry.color }, entry.name))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
									verticalAlign: "bottom",
									height: 32,
									iconType: "circle",
									wrapperStyle: { fontSize: "11px" }
								})
							] })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
						title: "Users by role",
						subtitle: "Exact count per stored role value",
						icon: Users,
						iconClass: "text-sky-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartArea, {
							ready: chartsReady,
							empty: !derived || derived.usersByRole.length === 0,
							height: Math.max(220, (derived?.usersByRole.length ?? 0) * 30 + 40),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: derived?.usersByRole ?? [],
								layout: "vertical",
								margin: {
									top: 5,
									right: 20,
									left: 10,
									bottom: 5
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										className: "stroke-border/40",
										horizontal: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										type: "number",
										allowDecimals: false,
										...axisProps
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										type: "category",
										dataKey: "label",
										width: 110,
										...axisProps
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {}),
										cursor: { fill: "rgba(14,165,233,0.08)" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "count",
										name: "Users",
										fill: "#0ea5e9",
										radius: [
											0,
											6,
											6,
											0
										]
									})
								]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
						title: "Organizations by plan",
						subtitle: "Plan recorded on each tenant's subscription or profile",
						icon: ChartPie,
						iconClass: "text-amber-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartArea, {
							ready: chartsReady,
							empty: !derived || derived.organizationsByPlan.length === 0,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
									data: derived?.organizationsByPlan ?? [],
									dataKey: "count",
									nameKey: "label",
									cx: "50%",
									cy: "45%",
									innerRadius: 55,
									outerRadius: 88,
									paddingAngle: 3,
									children: (derived?.organizationsByPlan ?? []).map((entry, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: PALETTE[index % PALETTE.length] }, entry.label))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
									verticalAlign: "bottom",
									height: 32,
									iconType: "circle",
									wrapperStyle: { fontSize: "11px" }
								})
							] })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartCard, {
						title: "Largest organizations by workforce",
						subtitle: `Top ${TOP_ORGANIZATIONS} tenants by active employee records`,
						icon: Briefcase,
						iconClass: "text-emerald-400",
						className: "lg:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartArea, {
							ready: chartsReady,
							empty: !derived || derived.largestOrganizations.length === 0,
							height: Math.max(220, (derived?.largestOrganizations.length ?? 0) * 34 + 40),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: derived?.largestOrganizations ?? [],
								layout: "vertical",
								margin: {
									top: 5,
									right: 20,
									left: 10,
									bottom: 5
								},
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
										strokeDasharray: "3 3",
										className: "stroke-border/40",
										horizontal: false
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										type: "number",
										allowDecimals: false,
										...axisProps
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
										type: "category",
										dataKey: "name",
										width: 160,
										...axisProps
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
										content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartTooltip, {}),
										cursor: { fill: "rgba(16,185,129,0.08)" }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "employees",
										name: "Active employees",
										fill: "#10b981",
										radius: [
											0,
											6,
											6,
											0
										]
									})
								]
							})
						})
					})
				]
			})
		]
	});
}
function Highlight({ label, icon: Icon, iconClass, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border/60 bg-card/60 p-5 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between text-xs font-medium uppercase text-muted-foreground",
			children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: cn("h-4 w-4", iconClass) })]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-2",
			children
		})]
	});
}
var SplitComponent = SuperAdminAnalyticsPage;
//#endregion
export { SplitComponent as component };
