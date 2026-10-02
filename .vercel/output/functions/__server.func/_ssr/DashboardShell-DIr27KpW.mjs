import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, p as Outlet, u as useRouterState, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, A as Timer, Br as Calendar, Dt as Package, E as TrendingUp, Fr as ChartLine, Gt as Lock, H as Sparkles, I as Sun, Ir as ChartColumn, J as ShieldAlert, Jr as Briefcase, Ln as FileText, Lt as Menu, Mn as Folder, P as Target, Sr as CircleCheck, T as TriangleAlert, Tr as CircleAlert, Tt as PanelLeft, Ur as CalendarDays, Ut as LogOut, Vn as FilePenLine, Wr as CalendarClock, X as Settings, Xn as ExternalLink, Yr as Brain, a as X, dn as IndianRupee, fn as Inbox, h as User, in as LayoutDashboard, jr as CheckCheck, jt as Moon, mi as Activity, ni as Bell, o as Wrench, on as Laptop, p as Users, pn as House, pr as Clock, q as ShieldCheck, qr as Building2, ri as Banknote, ut as Receipt, x as UserCheck, yn as HandCoins } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { a as normalizeRole, c as useAurix, l as useCurrentRole } from "./aurix-store-BcCbMqU4.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { n as useTheme } from "./ThemeProvider-2CHrEfXV.mjs";
import { $ as toggleSectionExpand, F as fetchSidebarPermissions, H as logout, V as hasValidAccessToken, X as setSectionExpand, nt as useAuthReady, r as PageSkeleton, z as getDefaultDashboardPath } from "./auth-bootstrap-CR9kF6gO.mjs";
import { n as DialogContent, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as ScrollArea } from "./scroll-area-BlnbM3_c.mjs";
import { a as DropdownMenuSeparator, i as DropdownMenuLabel, n as DropdownMenuContent, o as DropdownMenuTrigger, r as DropdownMenuItem, t as DropdownMenu } from "./dropdown-menu-DXMm4jWj.mjs";
import { t as BackButton } from "./BackButton-CCFK3RCS.mjs";
import { n as PopoverContent, r as PopoverTrigger, t as Popover } from "./popover-C4q8I-xJ.mjs";
import { a as useMarkAllRead, c as useNotifications, i as useArchive, l as useUnreadCount, n as formatUnreadBadge, o as useMarkRead, r as isInternalSafeLink, t as formatRelativeTime } from "./notification-utils-1y-FPLpt.mjs";
import { t as GeminiIcon } from "./GeminiIcon-7yNPSnS8.mjs";
import { t as AuthLoadingScreen } from "./AuthLoadingScreen-B5FD3SMB.mjs";
import { n as selectExpandedSections, r as selectUserPermissions, t as filterNavTree } from "./sidebarSelectors-Crjhx3nM.mjs";
import { t as _e } from "../_libs/cmdk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DashboardShell-DIr27KpW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ROLE_LABELS = {
	super_admin: "Super Admin",
	hr_admin: "HR Admin",
	employee: "Employee",
	manager: "Manager",
	it_admin: "IT Admin",
	executive: "Executive",
	recruiter: "Recruiter"
};
function UserProfileMenu({ collapsed = false, variant = "topbar", className = "" }) {
	const ws = useAurix();
	const [open, setOpen] = (0, import_react.useState)(false);
	if (!ws.user) return null;
	const currentNormRole = normalizeRole(ws.user.role);
	const formattedRole = currentNormRole && ROLE_LABELS[currentNormRole] || "Employee";
	const initials = ws.user.fullName?.split(" ").filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase() || "U";
	const handleLogout = (e) => {
		e.stopPropagation();
		setOpen(false);
		logout();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
			asChild: true,
			children: variant === "topbar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				id: "topbar-user-menu-trigger",
				className: `flex items-center gap-2 rounded-full p-0.5 hover:ring-2 hover:ring-border/60 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`,
				"aria-label": `User menu for ${ws.user.fullName || "User"}`,
				title: `${ws.user.fullName || "User"} (${formattedRole})`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground text-xs font-semibold text-background shadow-sm",
					children: initials
				})
			}) : collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				id: "sidebar-user-menu-trigger-collapsed",
				className: `flex w-full items-center justify-center rounded-lg p-1.5 hover:bg-accent/60 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`,
				"aria-label": `User menu for ${ws.user.fullName || "User"}`,
				title: `${ws.user.fullName || "User"} (${formattedRole})`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground text-xs font-semibold text-background shadow-sm",
					children: initials
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				id: "sidebar-user-menu-trigger",
				className: `group flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left hover:bg-accent/60 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`,
				"aria-label": `User menu for ${ws.user.fullName || "User"}`,
				title: `${ws.user.fullName || "User"} (${formattedRole})`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid h-8 w-8 shrink-0 place-items-center rounded-full bg-foreground text-xs font-semibold text-background shadow-sm",
					children: initials
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-xs font-medium text-foreground",
						children: ws.user.fullName || "User"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "truncate text-[11px] capitalize text-muted-foreground",
						children: formattedRole
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
			id: "user-profile-dropdown-content",
			side: variant === "topbar" ? "bottom" : collapsed ? "right" : "top",
			align: variant === "topbar" ? "end" : "start",
			sideOffset: 8,
			className: "w-64 p-2 rounded-xl border border-border bg-popover/95 backdrop-blur-xl shadow-xl z-50 animate-in fade-in-0 zoom-in-95",
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
					className: "p-2 font-normal",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-10 w-10 shrink-0 place-items-center rounded-full bg-foreground text-sm font-semibold text-background shadow-sm",
							children: initials
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 space-y-0.5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									id: "user-profile-name",
									className: "truncate text-sm font-semibold text-foreground",
									title: ws.user.fullName,
									children: ws.user.fullName || "User"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										id: "user-profile-role",
										className: "inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary border border-primary/20 capitalize",
										children: formattedRole
									})
								}),
								ws.user.email ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									id: "user-profile-email",
									className: "truncate text-[11px] text-muted-foreground",
									title: ws.user.email,
									children: ws.user.email
								}) : null
							]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, { className: "my-1.5 bg-border" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
					id: "user-profile-logout-button",
					onClick: handleLogout,
					className: "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 dark:text-rose-400 dark:hover:text-rose-300 dark:hover:bg-rose-950/40 focus:bg-rose-500/10 focus:text-rose-500 dark:focus:bg-rose-950/40 dark:focus:text-rose-300 cursor-pointer transition-colors",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 shrink-0 text-rose-500 dark:text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Logout" })]
				})
			]
		})]
	});
}
function getCategoryIcon(category, priority) {
	if (priority === "critical") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-destructive" });
	switch (category) {
		case "recruitment": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4 text-primary" });
		case "payroll": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "h-4 w-4 text-primary" });
		case "leave": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-4 w-4 text-primary" });
		case "attendance": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-primary" });
		case "documents": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" });
		case "assets": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Laptop, { className: "h-4 w-4 text-primary" });
		case "onboarding_exit": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4 text-primary" });
		case "approvals": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary" });
		case "security": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "h-4 w-4 text-destructive" });
		case "system": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-muted-foreground" });
		case "ai_insights": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" });
		default: return priority === "high" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-destructive" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4 text-muted-foreground" });
	}
}
function getCategoryBg(category, priority) {
	if (priority === "critical" || category === "security" || priority === "high") return "bg-destructive/10 border-destructive/20";
	return "bg-primary/10 border-primary/20";
}
function NotificationDropdown() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [tab, setTab] = (0, import_react.useState)("all");
	const [, setTick] = (0, import_react.useState)(0);
	const navigate = useNavigate();
	(0, import_react.useEffect)(() => {
		const timer = setInterval(() => {
			setTick((t) => t + 1);
		}, 3e4);
		return () => clearInterval(timer);
	}, []);
	const { unreadCount } = useUnreadCount();
	const { items, isLoading, isError, refetch } = useNotifications({ limit: 10 });
	const markReadMutation = useMarkRead();
	const markAllReadMutation = useMarkAllRead();
	const archiveMutation = useArchive();
	const badgeText = formatUnreadBadge(unreadCount);
	const filteredItems = items.filter((n) => {
		if (tab === "unread") return !n.readAt;
		if (tab === "alerts") return n.priority === "high" || n.priority === "critical";
		return true;
	});
	const handleItemClick = (item) => {
		if (!item.readAt) markReadMutation.mutate(item.id);
		if (isInternalSafeLink(item.link)) {
			setOpen(false);
			navigate({ to: item.link });
		}
	};
	const handleKeyDown = (e, item) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			handleItemClick(item);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
		open,
		onOpenChange: setOpen,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				className: "relative rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary",
				"aria-label": unreadCount > 0 ? `Notifications (${unreadCount} unread)` : "Notifications",
				"aria-expanded": open,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" }), badgeText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					id: "notification-badge",
					className: "absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground shadow-xs",
					children: badgeText
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
			align: "end",
			sideOffset: 8,
			className: "w-[360px] sm:w-[400px] p-0 rounded-2xl bg-card border border-border shadow-2xl overflow-hidden z-50 text-left",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-4 py-3 bg-muted/30",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-sm text-foreground",
							children: "Notifications"
						}), badgeText ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "destructive",
							className: "h-5 px-1.5 text-[10px] font-bold",
							children: [badgeText, " new"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							className: "h-5 px-1.5 text-[10px] text-muted-foreground",
							children: "All caught up"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-1",
						children: unreadCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: () => markAllReadMutation.mutate(void 0),
							disabled: markAllReadMutation.isPending,
							className: "h-7 text-xs px-2 text-muted-foreground hover:text-foreground cursor-pointer",
							title: "Mark all notifications as read",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "h-3.5 w-3.5 mr-1 text-primary" }), "Read all"]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1 px-3 py-1.5 border-b border-border/60 bg-muted/15 text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTab("all"),
							className: `px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${tab === "all" ? "bg-accent text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`,
							children: [
								"All (",
								items.length,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTab("unread"),
							className: `px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${tab === "unread" ? "bg-accent text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`,
							children: [
								"Unread (",
								unreadCount,
								")"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setTab("alerts"),
							className: `px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${tab === "alerts" ? "bg-accent text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"}`,
							children: "Alerts"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
					className: "max-h-[380px] overflow-y-auto",
					children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-3 space-y-3",
						children: Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start gap-3 p-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-8 rounded-lg shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3.5 w-3/4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-full" })]
							})]
						}, i))
					}) : isError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center py-10 px-4 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 place-items-center rounded-xl bg-destructive/10 text-destructive mb-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-foreground",
								children: "Failed to load notifications"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-0.5",
								children: "Could not retrieve latest updates."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => refetch(),
								className: "mt-3 text-xs h-7",
								children: "Retry"
							})
						]
					}) : filteredItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center py-10 px-4 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20 mb-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "h-5 w-5" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold text-foreground",
								children: "No notifications"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted-foreground mt-0.5 max-w-[240px]",
								children: tab === "unread" ? "You have read all pending notifications." : tab === "alerts" ? "No high priority alerts or escalations active." : "Everything is quiet. No notifications found."
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "divide-y divide-border/60",
						children: filteredItems.map((notif) => {
							const isUnread = !notif.readAt;
							const hasSafeLink = isInternalSafeLink(notif.link);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								role: "button",
								tabIndex: 0,
								onClick: () => handleItemClick(notif),
								onKeyDown: (e) => handleKeyDown(e, notif),
								className: `group relative flex items-start gap-3 p-3 transition-colors hover:bg-muted/40 cursor-pointer focus:outline-hidden focus-visible:bg-muted/40 ${isUnread ? "bg-muted/50" : ""}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `grid h-8 w-8 shrink-0 place-items-center rounded-lg border mt-0.5 ${getCategoryBg(notif.category, notif.priority)}`,
										children: getCategoryIcon(notif.category, notif.priority)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1 pr-6",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: `text-xs truncate block ${isUnread ? "font-semibold text-foreground" : "font-medium text-foreground/85"}`,
													children: notif.title
												}), isUnread && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 shrink-0 rounded-full bg-primary" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[11px] text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed",
												children: notif.body
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-1.5 flex items-center gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground/75 font-mono",
													children: formatRelativeTime(notif.createdAt)
												}), hasSafeLink && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-2.5 w-2.5" })]
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: (e) => {
											e.stopPropagation();
											archiveMutation.mutate(notif.id);
										},
										className: "absolute top-2.5 right-2.5 h-6 w-6 grid place-items-center rounded-md text-muted-foreground/60 opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-accent transition-all cursor-pointer focus:opacity-100",
										"aria-label": "Archive notification",
										title: "Archive",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
									})
								]
							}, notif.id);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-t border-border px-3 py-2 bg-muted/20 flex items-center justify-between text-[11px] text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "OFC360 Pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard/notifications",
						onClick: () => setOpen(false),
						className: "font-medium text-primary hover:underline cursor-pointer",
						children: "View all notifications →"
					})]
				})
			]
		})]
	});
}
var Command$1 = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e, {
	ref,
	className: cn("flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground", className),
	...props
}));
Command$1.displayName = _e.displayName;
var CommandDialog = ({ children, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogContent, {
			className: "overflow-hidden p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Command$1, {
				className: "[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5",
				children
			})
		})
	});
};
var CommandInput = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "flex items-center border-b px-3",
	"cmdk-input-wrapper": "",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "mr-2 h-4 w-4 shrink-0 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Input, {
		ref,
		className: cn("flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50", className),
		...props
	})]
}));
CommandInput.displayName = _e.Input.displayName;
var CommandList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.List, {
	ref,
	className: cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className),
	...props
}));
CommandList.displayName = _e.List.displayName;
var CommandEmpty = import_react.forwardRef((props, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Empty, {
	ref,
	className: "py-6 text-center text-sm",
	...props
}));
CommandEmpty.displayName = _e.Empty.displayName;
var CommandGroup = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Group, {
	ref,
	className: cn("overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground", className),
	...props
}));
CommandGroup.displayName = _e.Group.displayName;
var CommandSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Separator, {
	ref,
	className: cn("-mx-1 h-px bg-border", className),
	...props
}));
CommandSeparator.displayName = _e.Separator.displayName;
var CommandItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(_e.Item, {
	ref,
	className: cn("relative flex cursor-default gap-2 select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", className),
	...props
}));
CommandItem.displayName = _e.Item.displayName;
var CommandShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest text-muted-foreground", className),
		...props
	});
};
CommandShortcut.displayName = "CommandShortcut";
var isParent = (i) => "children" in i;
var BADGE_STYLES = {
	New: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
	AI: "bg-violet-500/20 text-violet-400 border border-violet-500/30",
	Beta: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
	Hot: "bg-rose-500/20 text-rose-400 border border-rose-500/30",
	Live: "bg-red-500/20 text-red-400 border border-red-500/30"
};
function NavBadge({ kind }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `ml-auto shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${BADGE_STYLES[kind]}`,
		children: kind
	});
}
function NavCount({ count }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "ml-auto shrink-0 min-w-[18px] rounded-full bg-destructive/80 px-1.5 py-0.5 text-center text-[9px] font-bold text-white",
		children: count > 99 ? "99+" : count
	});
}
var NAV_SECTIONS = [{ items: [
	{
		to: "/dashboard",
		label: "Overview",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/dashboard/workforce",
		label: "Workforce",
		icon: Users
	},
	{
		to: "/dashboard/talent",
		label: "Talent Management",
		icon: Briefcase,
		roles: [
			"superadmin",
			"hr_admin",
			"manager"
		]
	},
	{
		to: "/dashboard/hr-operations",
		label: "HR Operations",
		icon: Activity,
		roles: ["superadmin", "hr_admin"]
	},
	{
		to: "/dashboard/resources",
		label: "Resources",
		icon: Folder
	},
	{
		to: "/dashboard/payroll",
		label: "Payroll",
		icon: Banknote,
		roles: ["superadmin", "hr_admin"]
	},
	{
		to: "/dashboard/analytics",
		label: "Analytics",
		icon: ChartColumn,
		roles: [
			"superadmin",
			"super_admin",
			"hr_admin",
			"executive",
			"manager"
		]
	},
	{
		to: "/dashboard/ai-hub",
		label: "AI Hub",
		icon: GeminiIcon
	},
	{
		to: "/dashboard/settings",
		label: "Settings",
		icon: Settings
	}
] }];
var EMPLOYEE_NAV_SECTIONS = [{ items: [
	{
		to: "/dashboard/employee",
		label: "My Portal",
		icon: User,
		exact: true
	},
	{
		to: "/dashboard/timesheets",
		label: "Timesheets",
		icon: Timer
	},
	{
		to: "/dashboard/expenses",
		label: "Expense Claims",
		icon: Receipt
	},
	{
		to: "/dashboard/documents",
		label: "My Documents",
		icon: FileText
	},
	{
		to: "/dashboard/assets",
		label: "My Assets",
		icon: Package
	},
	{
		to: "/dashboard/performance",
		label: "Performance",
		icon: Target
	},
	{
		to: "/dashboard/settings/profile",
		label: "My Settings",
		icon: Settings
	}
] }];
var MANAGER_NAV_SECTIONS = [{ items: [
	{
		to: "/dashboard/manager",
		label: "Manager Portal",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/dashboard/workforce",
		label: "My Team",
		icon: Users
	},
	{
		to: "/dashboard/timesheets",
		label: "Timesheets",
		icon: Timer
	},
	{
		to: "/dashboard/expenses",
		label: "Expense Claims",
		icon: Receipt
	},
	{
		to: "/dashboard/recruitment/hiring-manager",
		label: "Hiring Manager Hub",
		icon: UserCheck,
		badge: "Hot"
	},
	{
		to: "/dashboard/recruitment/requisitions",
		label: "Team Requisitions",
		icon: FilePenLine
	},
	{
		to: "/dashboard/recruitment/interviews",
		label: "Interviews",
		icon: CalendarClock
	},
	{
		to: "/dashboard/performance",
		label: "Performance",
		icon: Target
	},
	{
		to: "/dashboard/reports",
		label: "Reports",
		icon: ChartColumn
	},
	{
		to: "/dashboard/ai-hub",
		label: "AI Assistant",
		icon: Brain
	},
	{
		to: "/dashboard/settings",
		label: "Settings",
		icon: Settings
	}
] }];
var SUPER_ADMIN_NAV_SECTIONS = [{
	roles: ["super_admin"],
	items: [
		{
			to: "/dashboard/super-admin",
			label: "Overview",
			icon: LayoutDashboard,
			exact: true,
			permission: "platform.overview",
			roles: ["super_admin"]
		},
		{
			to: "/dashboard/super-admin/users",
			label: "Users",
			icon: Users,
			permission: "platform.users",
			roles: ["super_admin"]
		},
		{
			to: "/dashboard/super-admin/organizations",
			label: "Organizations",
			icon: Building2,
			permission: "platform.organizations",
			roles: ["super_admin"]
		},
		{
			to: "/dashboard/super-admin/analytics",
			label: "Usage & Analytics",
			icon: ChartColumn,
			permission: "platform.analytics",
			roles: ["super_admin"]
		},
		{
			to: "/dashboard/super-admin/activity",
			label: "System Activity",
			icon: Activity,
			permission: "platform.activity",
			roles: ["super_admin"]
		},
		{
			to: "/dashboard/super-admin/audit-logs",
			label: "Audit Logs",
			icon: FileText,
			permission: "platform.audit_logs",
			roles: ["super_admin"]
		},
		{
			to: "/dashboard/super-admin/settings",
			label: "System Settings",
			icon: Settings,
			permission: "platform.settings",
			roles: ["super_admin"]
		},
		{
			to: "/dashboard/super-admin/platform-config",
			label: "Platform Configuration",
			icon: ShieldCheck,
			permission: "platform.config",
			roles: ["super_admin"]
		}
	]
}];
var EXECUTIVE_NAV_SECTIONS = [{
	title: "EXECUTIVE DASHBOARD",
	items: [
		{
			to: "/dashboard/executive",
			label: "Overview",
			icon: House,
			exact: true
		},
		{
			to: "/dashboard/executive/ceo/business",
			label: "Business",
			icon: TrendingUp
		},
		{
			to: "/dashboard/executive/ceo/finance",
			label: "Finance",
			icon: HandCoins
		},
		{
			to: "/dashboard/executive/ceo/organization",
			label: "Organization",
			icon: Users
		},
		{
			to: "/dashboard/executive/ceo/reports",
			label: "Reports",
			icon: ChartLine
		},
		{
			to: "/dashboard/executive/cio/it-operations",
			label: "Technology Operations",
			icon: Laptop
		},
		{
			to: "/dashboard/executive/cto/engineering",
			label: "Engineering",
			icon: Wrench
		},
		{
			to: "/dashboard/executive/cto/security",
			label: "Security",
			icon: Lock
		},
		{
			to: "/dashboard/analytics",
			label: "Analytics",
			icon: ChartColumn
		}
	]
}];
var IT_ADMIN_NAV_SECTIONS = [{
	title: "IT ADMINISTRATION",
	items: [
		{
			to: "/dashboard",
			label: "System Overview",
			icon: LayoutDashboard,
			exact: true
		},
		{
			to: "/dashboard/admin",
			label: "System Controls",
			icon: ShieldCheck
		},
		{
			to: "/dashboard/assets",
			label: "Assets",
			icon: Package
		},
		{
			to: "/dashboard/settings",
			label: "Settings",
			icon: Settings
		}
	]
}];
var RECRUITER_NAV_SECTIONS = [{ items: [
	{
		to: "/dashboard/recruitment",
		label: "Recruitment Hub",
		icon: Briefcase,
		exact: true
	},
	{
		to: "/dashboard/recruitment/jobs",
		label: "Jobs & Requisitions",
		icon: Briefcase
	},
	{
		to: "/dashboard/recruitment/candidates",
		label: "Candidates",
		icon: Users
	},
	{
		to: "/dashboard/recruitment/pipeline",
		label: "Pipeline",
		icon: LayoutDashboard
	},
	{
		to: "/dashboard/recruitment/interviews",
		label: "Interviews",
		icon: CalendarClock
	},
	{
		to: "/dashboard/recruitment/talent-pool",
		label: "Talent Pool",
		icon: UserCheck
	},
	{
		to: "/dashboard/recruitment/reports",
		label: "Reports",
		icon: ChartColumn
	},
	{
		to: "/dashboard/ai-hub",
		label: "AI Assistant",
		icon: GeminiIcon
	},
	{
		to: "/dashboard/settings/profile",
		label: "My Settings",
		icon: Settings
	}
] }];
function DashboardShell() {
	const ws = useAurix();
	const currentRole = useCurrentRole();
	const navigate = useNavigate();
	const authReady = useAuthReady();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const dispatch = useAppDispatch();
	const userPermissions = useAppSelector(selectUserPermissions);
	const { theme, toggle: toggleTheme } = useTheme();
	const [collapsed, setCollapsed] = (0, import_react.useState)(false);
	const [mobileOpen, setMobileOpen] = (0, import_react.useState)(false);
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (authReady && ws.user) dispatch(fetchSidebarPermissions(currentRole));
	}, [
		dispatch,
		authReady,
		ws.user,
		currentRole
	]);
	(0, import_react.useEffect)(() => {
		if (!authReady || ws.isRestoring) return;
		if (!ws.user) {
			if (!hasValidAccessToken()) navigate({
				to: "/login",
				replace: true
			});
			return;
		}
		if (pathname === "/dashboard/employee" && currentRole !== "employee") {
			if (currentRole === "manager") {
				navigate({ to: "/dashboard/manager" });
				return;
			}
			navigate({ to: getDefaultDashboardPath(ws.user) });
			return;
		}
		if (pathname === "/onboarding") {
			if (currentRole === "employee") {
				navigate({ to: "/dashboard/employee" });
				return;
			}
		}
		if ((currentRole === "hr_admin" || ws.user.role === "hr_admin") && ws.user.onboardingComplete === false) {
			if (pathname.startsWith("/dashboard")) {
				navigate({
					to: "/onboarding",
					replace: true
				});
				return;
			}
		}
	}, [
		authReady,
		ws.isRestoring,
		ws.user,
		pathname,
		currentRole,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		setMobileOpen(false);
	}, [pathname]);
	const visibleNav = (0, import_react.useMemo)(() => {
		const isSuperAdminPortalPath = pathname === "/dashboard/super-admin" || pathname.startsWith("/dashboard/super-admin/");
		const isEmployeePortalPath = pathname === "/dashboard/employee" || pathname.startsWith("/dashboard/employee/");
		const isManagerPortalPath = pathname === "/dashboard/manager" || pathname.startsWith("/dashboard/manager/");
		const isExecutivePortalPath = pathname === "/dashboard/executive" || pathname.startsWith("/dashboard/executive/");
		const isRecruiterPortalPath = pathname === "/dashboard/recruitment" || pathname.startsWith("/dashboard/recruitment/");
		if (currentRole === "super_admin" || isSuperAdminPortalPath) return filterNavTree(SUPER_ADMIN_NAV_SECTIONS, currentRole || void 0, userPermissions);
		if (currentRole === "executive" || isExecutivePortalPath) return filterNavTree(EXECUTIVE_NAV_SECTIONS, currentRole || void 0, userPermissions);
		if (currentRole === "it_admin") return filterNavTree(IT_ADMIN_NAV_SECTIONS, currentRole || void 0, userPermissions);
		if (currentRole === "employee" || isEmployeePortalPath) return filterNavTree(EMPLOYEE_NAV_SECTIONS, currentRole || void 0, userPermissions);
		if (currentRole === "manager" || isManagerPortalPath) return filterNavTree(MANAGER_NAV_SECTIONS, currentRole || void 0, userPermissions);
		if (currentRole === "recruiter" || isRecruiterPortalPath) return filterNavTree(RECRUITER_NAV_SECTIONS, currentRole || void 0, userPermissions);
		const computed = filterNavTree(NAV_SECTIONS, currentRole || void 0, userPermissions);
		return computed && computed.length > 0 ? computed : NAV_SECTIONS;
	}, [
		currentRole,
		pathname,
		userPermissions
	]);
	if (!authReady || ws.isRestoring) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthLoadingScreen, {});
	if (!ws.user) return null;
	const homeLink = getDefaultDashboardPath(ws.user);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex min-w-0 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: `fixed left-0 z-40 flex flex-col border-r border-border bg-card/60 backdrop-blur-xl transition-[width,transform] duration-200 inset-y-0 ${collapsed ? "w-[60px]" : "w-[200px]"} ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `flex h-16 shrink-0 items-center border-b border-border px-2.5 ${collapsed ? "justify-center" : "justify-between"}`,
						children: !collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: homeLink,
							className: "flex items-center gap-2 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "grid h-7 w-7 shrink-0 place-items-center rounded-lg text-brand-foreground shadow-glow",
								style: { background: "var(--gradient-brand)" },
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-base font-semibold tracking-tight truncate",
								children: "OFC360"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-0.5 shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSearchOpen(true),
								className: "rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors",
								"aria-label": "Search",
								title: "Search (Ctrl+K)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setCollapsed(true),
								className: "hidden rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:inline-flex cursor-pointer transition-colors",
								"aria-label": "Collapse sidebar",
								title: "Collapse sidebar",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeft, { className: "h-3.5 w-3.5" })
							})]
						})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setCollapsed(false),
							className: "rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-colors",
							"aria-label": "Expand sidebar",
							title: "Expand sidebar",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeft, { className: "h-4 w-4" })
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 space-y-1.5 overflow-y-auto overflow-x-hidden p-2",
						children: (visibleNav.length > 0 ? visibleNav : NAV_SECTIONS).map((section, sIdx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-0.5",
							children: [
								section.title && !collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "px-2 pb-1 pt-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 truncate",
									children: section.title
								}) : null,
								section.title && collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-2 my-2 border-t border-border" }) : null,
								section.items.map((item) => {
									if (isParent(item)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavGroup, {
										item,
										pathname,
										collapsed
									}, item.id);
									const active = item.exact ? pathname === item.to : pathname === item.to || pathname.startsWith(item.to + "/");
									const Icon = item.icon;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: item.to,
										title: collapsed ? item.label : void 0,
										className: `group relative flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors ${active ? "bg-accent text-foreground font-semibold" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"} ${collapsed ? "justify-center px-0" : ""}`,
										children: [
											active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-foreground" }) : null,
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" }),
											!collapsed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "flex-1 truncate whitespace-nowrap text-[13px]",
													children: item.label
												}),
												item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBadge, { kind: item.badge }),
												item.count !== void 0 && !item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavCount, { count: item.count })
											] }) : null
										]
									}, item.to);
								})
							]
						}, section.id || sIdx))
					})]
				}),
				mobileOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					onClick: () => setMobileOpen(false),
					className: "fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden transition-[margin] duration-200 ${collapsed ? "lg:ml-[60px]" : "lg:ml-[200px]"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
						className: "sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/70 px-4 backdrop-blur-xl sm:px-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setMobileOpen(true),
								className: "rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden cursor-pointer",
								"aria-label": "Open menu",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-5 w-5" })
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setSearchOpen(true),
									className: "flex items-center gap-2 rounded-lg border border-border/80 bg-card/60 px-3 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer transition-all shadow-sm",
									title: "Search (Ctrl+K)",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-3.5 w-3.5" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "hidden sm:inline",
											children: "Search..."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
											className: "hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground sm:inline-block",
											children: "⌘K"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: toggleTheme,
									className: "rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer",
									"aria-label": "Toggle theme",
									children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotificationDropdown, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden items-center gap-2 rounded-md border border-border bg-card/40 px-3 py-1.5 text-xs sm:flex",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3.5 w-3.5 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: ws.company?.name || "Workspace"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserProfileMenu, { variant: "topbar" })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
						className: "min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BackButton, { className: "mb-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.Suspense, {
							fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageSkeleton, {}),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
						})]
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandDialog, {
			open: searchOpen,
			onOpenChange: setSearchOpen,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandInput, { placeholder: "Search employees, departments, requests, pages..." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandList, {
				className: "max-h-[350px] overflow-y-auto p-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CommandEmpty, { children: "No results found." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandGroup, {
					heading: "Quick Navigation",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							onSelect: () => {
								navigate({ to: "/dashboard" });
								setSearchOpen(false);
							},
							className: "cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutDashboard, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Overview" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							onSelect: () => {
								navigate({ to: "/dashboard/people" });
								setSearchOpen(false);
							},
							className: "cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Workforce & Employees" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							onSelect: () => {
								navigate({ to: "/dashboard/leaves" });
								setSearchOpen(false);
							},
							className: "cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Leaves & Attendance" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							onSelect: () => {
								navigate({ to: "/dashboard/payroll" });
								setSearchOpen(false);
							},
							className: "cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Banknote, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Payroll Dashboard" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							onSelect: () => {
								navigate({ to: "/dashboard/payroll/periods" });
								setSearchOpen(false);
							},
							className: "cursor-pointer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "mr-2 h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Payroll Periods" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CommandItem, {
							value: "AI Hub Gemini Assistant Artificial Intelligence",
							onSelect: () => {
								navigate({ to: "/dashboard/ai-hub" });
								setSearchOpen(false);
							},
							className: "cursor-pointer group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GeminiIcon, {
								gradient: true,
								className: "mr-2 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI Hub" })]
						})
					]
				})]
			})]
		})]
	});
}
var NavGroup = (0, import_react.memo)(function NavGroup({ item, pathname, collapsed }) {
	const dispatch = useAppDispatch();
	const expandedSections = useAppSelector(selectExpandedSections);
	const isExpanded = Boolean(expandedSections[item.id]);
	const isActive = pathname === item.basePath || pathname.startsWith(item.basePath + "/");
	(0, import_react.useEffect)(() => {
		if (isActive && !isExpanded) dispatch(setSectionExpand({
			sectionKey: item.id,
			expanded: true
		}));
	}, [
		isActive,
		item.id,
		isExpanded,
		dispatch
	]);
	const Icon = item.icon;
	if (collapsed) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: item.basePath,
		className: `group relative flex items-center justify-center rounded-lg py-1.5 text-sm font-medium transition-colors ${isActive ? "bg-accent text-foreground font-semibold" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`,
		title: item.label,
		"aria-label": item.label,
		children: [isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-foreground" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `group relative flex w-full items-center rounded-lg text-sm font-medium transition-colors ${isActive ? "bg-accent text-foreground font-semibold" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`,
		children: [isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-r bg-foreground" }) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: item.basePath,
			onClick: () => {
				dispatch(toggleSectionExpand(item.id));
			},
			className: "flex flex-1 items-center gap-2.5 rounded-lg px-2.5 py-1.5 min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 shrink-0" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex-1 text-left truncate whitespace-nowrap text-[13px]",
					children: item.label
				}),
				item.badge && !item.count && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBadge, { kind: item.badge }),
				item.count !== void 0 && !item.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavCount, { count: item.count })
			]
		})]
	}), isExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "ml-3 mt-0.5 space-y-0.5 border-l border-border pl-2 transition-all duration-200",
		children: item.children.map((child) => {
			const childActive = child.exact ? pathname === child.to : pathname === child.to || pathname.startsWith(child.to + "/");
			const ChildIcon = child.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: child.to,
				className: `flex items-center gap-2 rounded-md px-2 py-1.5 text-xs transition-colors min-w-0 ${childActive ? "bg-accent text-foreground font-medium" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChildIcon, { className: "h-3.5 w-3.5 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 truncate whitespace-nowrap",
						children: child.label
					}),
					child.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBadge, { kind: child.badge }),
					child.count !== void 0 && !child.badge && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavCount, { count: child.count })
				]
			}, child.to);
		})
	}) : null] });
});
function PageHeader({ title, description, actions, showBack: _showBack, backLink: _backLink, backText: _backText, onBack: _onBack }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-6 flex flex-col min-w-0 gap-2 text-left",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-wrap items-end justify-between gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-2xl font-semibold tracking-tight",
					children: title
				}), description ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: description
				}) : null]
			}), actions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex shrink-0 flex-wrap gap-2",
				children: actions
			}) : null]
		})
	});
}
function ComingSoon({ title, description, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl text-brand-foreground shadow-glow",
				style: { background: "var(--gradient-brand)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-lg font-semibold tracking-tight",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-2 max-w-md text-sm text-muted-foreground",
				children: description
			})
		]
	});
}
//#endregion
export { DashboardShell as n, PageHeader as r, ComingSoon as t };
