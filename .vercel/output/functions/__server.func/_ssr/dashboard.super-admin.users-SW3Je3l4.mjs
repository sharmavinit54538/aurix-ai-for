import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, a as X, g as UserX, p as Users, pt as Power, qr as Building2, x as UserCheck } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { _ as isAuthorizationError, a as KpiNumber, c as ROLE_FILTER_GROUPS, d as formatDate, f as formatDateTime, h as formatRoleLabel, i as InlineNotice, l as SkeletonRows, m as formatRelativeTime, n as EmptyState, o as PaginationBar, r as ErrorState, t as AccessDeniedState, u as formatCount, v as shortId } from "./SuperAdminStates-C68AaNca.mjs";
import { a as useSetUserActive, d as useSuperAdminStatistics, f as useSuperAdminUsers } from "./hooks-sx1lwuE8.mjs";
import { r as RoleBadge, t as AccountStatusBadge } from "./Badges-BovbKWqK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.super-admin.users-SW3Je3l4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PAGE_SIZE = 25;
var COUNTERS = [
	{
		key: "total",
		label: "Total",
		card: "border-border/60 bg-card/60",
		text: "text-muted-foreground",
		value: "text-foreground"
	},
	{
		key: "active",
		label: "Active",
		card: "border-emerald-500/20 bg-emerald-500/5",
		text: "text-emerald-400",
		value: "text-emerald-400"
	},
	{
		key: "inactive",
		label: "Inactive",
		card: "border-rose-500/20 bg-rose-500/5",
		text: "text-rose-400",
		value: "text-rose-400"
	},
	{
		key: "hrAdmins",
		label: "HR Admins",
		card: "border-emerald-500/20 bg-card/60",
		text: "text-emerald-400",
		value: "text-foreground"
	},
	{
		key: "managers",
		label: "Managers",
		card: "border-blue-500/20 bg-card/60",
		text: "text-blue-400",
		value: "text-foreground"
	},
	{
		key: "employees",
		label: "Employees",
		card: "border-sky-500/20 bg-card/60",
		text: "text-sky-400",
		value: "text-foreground"
	},
	{
		key: "itAdmins",
		label: "IT Admins",
		card: "border-cyan-500/20 bg-card/60",
		text: "text-cyan-400",
		value: "text-foreground"
	},
	{
		key: "executives",
		label: "Executives",
		card: "border-amber-500/20 bg-card/60",
		text: "text-amber-400",
		value: "text-foreground"
	}
];
function SuperAdminUsersPage() {
	const ws = useAurix();
	const [searchInput, setSearchInput] = (0, import_react.useState)("");
	const [search, setSearch] = (0, import_react.useState)("");
	const [role, setRole] = (0, import_react.useState)("ALL");
	const [status, setStatus] = (0, import_react.useState)("ALL");
	const [page, setPage] = (0, import_react.useState)(1);
	const [selectedUser, setSelectedUser] = (0, import_react.useState)(null);
	const params = {
		page,
		pageSize: PAGE_SIZE,
		search: search || void 0,
		role: role === "ALL" ? void 0 : role,
		status: status === "ALL" ? void 0 : status
	};
	const users = useSuperAdminUsers(params);
	const statistics = useSuperAdminStatistics();
	const setUserActive = useSetUserActive();
	const filtersActive = Boolean(params.search || params.role || params.status);
	(0, import_react.useEffect)(() => {
		const timer = setTimeout(() => {
			setSearch(searchInput.trim());
			setPage(1);
		}, 350);
		return () => clearTimeout(timer);
	}, [searchInput]);
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
	const canChangeStatus = (user) => user.isActive !== null && user.role?.toLowerCase() !== "super_admin" && user.id !== ws.user?.id;
	const confirmStatusChange = async () => {
		if (!selectedUser || selectedUser.isActive === null) return;
		const activate = !selectedUser.isActive;
		try {
			const message = await setUserActive.mutateAsync({
				userId: selectedUser.id,
				active: activate
			});
			toast.success(message ?? `User ${activate ? "activated" : "deactivated"}.`);
			setSelectedUser(null);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Failed to update user status.");
		}
	};
	if (users.isError && isAuthorizationError(users.error)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccessDeniedState, { error: users.error });
	const stats = statistics.data?.users;
	const rows = users.data ?? [];
	const totalUsers = stats?.total ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto",
		children: [
			statistics.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
				title: "Unable to load user statistics.",
				error: statistics.error,
				onRetry: () => void statistics.refetch(),
				retrying: statistics.isFetching
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8",
				children: COUNTERS.map((counter) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("rounded-xl border p-3 shadow-sm text-center", counter.card),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("text-[11px] font-medium uppercase", counter.text),
						children: counter.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("text-xl font-bold mt-0.5", counter.value),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiNumber, {
							value: stats?.[counter.key] ?? null,
							loading: statistics.isPending
						})
					})]
				}, counter.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
					onSubmit: applySearch,
					className: "flex flex-1 items-center max-w-md",
					role: "search",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: searchInput,
								onChange: (event) => setSearchInput(event.target.value),
								placeholder: "Search by name, email or phone…",
								"aria-label": "Search users",
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
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Role:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: role,
							onChange: (event) => {
								setRole(event.target.value);
								setPage(1);
							},
							className: "h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ALL",
								children: "All Roles"
							}), ROLE_FILTER_GROUPS.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
								label: group.label,
								children: group.roles.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value,
									children: formatRoleLabel(value)
								}, value))
							}, group.label))]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Status:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: status,
							onChange: (event) => {
								setStatus(event.target.value);
								setPage(1);
							},
							className: "h-9 rounded-lg border border-border bg-background px-2.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-purple-500 cursor-pointer",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "ALL",
									children: "All Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "active",
									children: "Active"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "inactive",
									children: "Inactive"
								})
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "overflow-hidden rounded-2xl border border-border/60 bg-card/60 shadow-sm backdrop-blur-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border/40 px-4 py-2.5 text-[11px] text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Sorted by registration date, newest first" }), users.isFetching && !users.isPending && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-purple-400",
							children: "Loading…"
						})]
					}),
					users.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonRows, {
						rows: 6,
						className: "p-4"
					}) : users.isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ErrorState, {
						className: "m-4",
						title: "Unable to load users.",
						error: users.error,
						onRetry: () => void users.refetch(),
						retrying: users.isFetching
					}) : rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "p-4 space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {
							icon: Users,
							title: "No users found",
							description: filtersActive ? "No accounts match the current search and filters." : page > 1 ? "There are no more users on this page." : "No accounts have been registered on the platform yet."
						}), !filtersActive && page === 1 && (totalUsers ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(InlineNotice, {
							tone: "warning",
							children: [
								"Platform statistics report ",
								formatCount(totalUsers),
								" users, but the user list came back empty. The server may have failed to load user records — try refreshing."
							]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: cn("overflow-x-auto transition-opacity", users.isPlaceholderData && "opacity-60"),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-left text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "border-b border-border/60 bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4",
										children: "Name"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4",
										children: "Email"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4",
										children: "Organization"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4",
										children: "Role"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4",
										children: "Registered"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4",
										children: "Last Sign-in"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "py-3 px-4 text-right",
										children: "Actions"
									})
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
								className: "divide-y divide-border/40",
								children: rows.map((user) => {
									const editable = canChangeStatus(user);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-muted/30 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4 font-semibold text-foreground",
												children: user.name ?? "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4 text-muted-foreground font-mono",
												children: user.email ?? "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1.5 font-medium text-foreground",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }), user.organizationName ?? (user.organizationId ? shortId(user.organizationId) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-muted-foreground",
														children: user.role?.toLowerCase() === "super_admin" ? "Platform" : "No organization"
													}))]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleBadge, { role: user.role })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AccountStatusBadge, { isActive: user.isActive })
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4 text-muted-foreground",
												title: formatDateTime(user.createdAt),
												children: formatDate(user.createdAt)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4 text-muted-foreground",
												title: formatDateTime(user.lastLoginAt),
												children: user.lastLoginAt ? formatRelativeTime(user.lastLoginAt) : "Never"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "py-3 px-4 text-right",
												children: editable ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													variant: "outline",
													size: "sm",
													onClick: () => setSelectedUser(user),
													className: cn("h-7 px-2.5 text-[11px] font-semibold gap-1", user.isActive ? "text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border-rose-500/30" : "text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 border-emerald-500/30"),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Power, { className: "h-3 w-3" }), user.isActive ? "Deactivate" : "Activate"]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-muted-foreground",
													title: "Status changes are disabled for Super Admin accounts",
													children: "Protected"
												})
											})
										]
									}, user.id);
								})
							})]
						})
					}),
					!users.isPending && !users.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaginationBar, {
						page,
						hasNextPage: rows.length === PAGE_SIZE,
						onPageChange: setPage,
						busy: users.isFetching,
						itemCount: rows.length,
						pageSize: PAGE_SIZE
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: selectedUser !== null,
				onOpenChange: (open) => !open && !setUserActive.isPending && setSelectedUser(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md bg-card border-border/60 backdrop-blur-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [selectedUser?.isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-9 w-9 place-items-center rounded-xl bg-rose-500/20 text-rose-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "h-5 w-5" })
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/20 text-emerald-400",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-base font-bold",
								children: selectedUser?.isActive ? "Deactivate User Account" : "Activate User Account"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground pt-1",
							children: selectedUser?.isActive ? `Deactivate ${selectedUser?.name ?? selectedUser?.email ?? "this user"}? They will lose access to their OFC360 workspace.` : `Activate ${selectedUser?.name ?? selectedUser?.email ?? "this user"}? They will regain access to their organization.`
						})] }),
						selectedUser && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border/50 bg-background/50 p-3 space-y-1.5 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "User:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: selectedUser.name ?? "—"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Email:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-muted-foreground",
										children: selectedUser.email ?? "—"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Organization:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-foreground",
										children: selectedUser.organizationName ?? "No organization"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground",
										children: "Role:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: formatRoleLabel(selectedUser.role)
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => setSelectedUser(null),
								disabled: setUserActive.isPending,
								className: "text-xs h-8",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								onClick: () => void confirmStatusChange(),
								disabled: setUserActive.isPending,
								className: cn("text-xs h-8 text-white", selectedUser?.isActive ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"),
								children: setUserActive.isPending ? "Processing…" : selectedUser?.isActive ? "Confirm Deactivation" : "Confirm Activation"
							})]
						})
					]
				})
			})
		]
	});
}
var SplitComponent = SuperAdminUsersPage;
//#endregion
export { SplitComponent as component };
