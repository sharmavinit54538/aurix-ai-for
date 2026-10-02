import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, h as createFileRoute, u as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { h as Slot, y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Ar as Check, Dr as ChevronRight, I as Sun, Q as Send, Sr as CircleCheck, Tr as CircleAlert, Ur as CalendarDays, V as SquarePen, Zn as Ellipsis, _ as UserPlus, ht as Plus, i as Zap, jt as Moon, k as Trash2, lr as Coffee, lt as RefreshCw, mn as History, p as Users, pr as Clock, q as ShieldCheck, qr as Building2, qt as LoaderCircle, un as Info } from "../_libs/lucide-react.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix, l as useCurrentRole } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
import { t as attendanceApi } from "./attendanceApi-CqMkuZD6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ShiftsPage-DwQfEVni.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EmployeeShiftsView({ employeeId }) {
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [activeTab, setActiveTab] = (0, import_react.useState)("today");
	const [detailsOpen, setDetailsOpen] = (0, import_react.useState)(false);
	const [selectedShiftForDetails, setSelectedShiftForDetails] = (0, import_react.useState)(null);
	const [requestModalOpen, setRequestModalOpen] = (0, import_react.useState)(false);
	const [requestedShift, setRequestedShift] = (0, import_react.useState)("Morning Shift");
	const [effectiveDate, setEffectiveDate] = (0, import_react.useState)(() => {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() + 1);
		return d.toISOString().split("T")[0];
	});
	const [changeReason, setChangeReason] = (0, import_react.useState)("");
	const [submittingRequest, setSubmittingRequest] = (0, import_react.useState)(false);
	const loadShiftData = async (showNotice = false) => {
		setLoading(true);
		setError(null);
		try {
			setData(await attendanceApi.getMyShiftSchedule(employeeId));
			if (showNotice) toast.success("Shift schedule refreshed from server");
		} catch (err) {
			console.error("Failed to load shift schedule:", err);
			const msg = err?.message || "Unable to load your schedule. Please try again.";
			setError(msg);
			if (showNotice) toast.error(msg);
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadShiftData();
	}, [employeeId]);
	const handleRequestChangeSubmit = async (e) => {
		e.preventDefault();
		if (!changeReason.trim()) {
			toast.error("Please provide a reason for the shift change request.");
			return;
		}
		setSubmittingRequest(true);
		try {
			const result = await attendanceApi.requestScheduleChange({
				type: "shift",
				requestedShift,
				effectiveDate,
				reason: changeReason.trim()
			});
			toast.success(result.message || "Shift change request submitted successfully.");
			setRequestModalOpen(false);
			setChangeReason("");
		} catch (err) {
			console.error("Shift change request error:", err);
			toast.error(err?.message || "Failed to submit shift change request. Please try again.");
		} finally {
			setSubmittingRequest(false);
		}
	};
	const getShiftTypeBadge = (type) => {
		switch (type) {
			case "Night": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "bg-purple-500/15 text-purple-400 border-purple-500/30 gap-1 font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-3 w-3" }), " Night"]
			});
			case "Flexible": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "bg-amber-500/15 text-amber-400 border-amber-500/30 gap-1 font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-3 w-3" }), " Flexible"]
			});
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				className: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30 gap-1 font-medium",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-3 w-3" }), " Regular"]
			});
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center min-h-[400px] text-center p-8 space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-8 w-8 animate-spin text-indigo-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-base font-semibold text-foreground",
			children: "Loading your shifts..."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground mt-1",
			children: "Retrieving authenticated schedule and shift records from backend."
		})] })]
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center min-h-[400px] text-center p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-full bg-destructive/10 p-4 mb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-8 w-8 text-destructive" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-semibold text-foreground",
				children: "Unable to load your schedule"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-1.5 max-w-md",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: () => loadShiftData(true),
				className: "mt-5 gap-2 border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Retry"]
			})
		]
	});
	if (!data || !data.hasAssignedShift || !data.currentShift) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-tight font-display text-foreground",
				children: "My Shifts"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground mt-0.5",
				children: "View your assigned work timings, shift specifications, and schedule history."
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center flex flex-col items-center justify-center min-h-[350px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl bg-muted/40 p-4 mb-4 border border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-8 w-8 text-muted-foreground" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-semibold text-foreground",
					children: "No Shift Assigned"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-1.5 max-w-md leading-relaxed",
					children: "You currently do not have a working shift assigned to your employee profile. Your assigned schedule will appear here once configured by your manager or HR administrator."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted/30 border border-border/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3.5 w-3.5" }),
							" ",
							data?.branch || "Company Headquarters"
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-muted/30 border border-border/50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5" }), " Employee Self-Service"]
					})]
				})
			]
		})]
	});
	const shift = data.currentShift;
	const today = data.todayShift;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-bold tracking-tight font-display text-foreground",
						children: "My Shifts"
					}), getShiftTypeBadge(shift.shiftType)]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground mt-0.5",
					children: "Your personal assigned schedule, daily work timings, and upcoming work calendar."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => {
								setSelectedShiftForDetails(shift);
								setDetailsOpen(true);
							},
							className: "h-9 gap-1.5 border-border bg-card/60 hover:bg-accent/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden sm:inline",
									children: "Shift"
								}),
								" Details"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							onClick: () => setRequestModalOpen(true),
							className: "h-9 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), "Request Shift Change"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							onClick: () => loadShiftData(true),
							className: "h-9 w-9 border-border bg-card/60 hover:bg-accent/60",
							title: "Refresh shift data",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5 text-muted-foreground" })
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Current Shift"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-indigo-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xl font-bold font-display text-foreground",
									children: shift.shiftName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-1 flex items-center gap-1.5",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										shift.startTime,
										" – ",
										shift.endTime
									] })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium text-foreground",
									children: shift.shiftType
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Working Hours"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "h-4 w-4 text-amber-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xl font-bold font-display text-foreground",
									children: [shift.totalWorkingHours, " Hours / Day"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-1",
									children: shift.workingDays.join(", ")
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Weekly Target"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium text-foreground",
									children: [shift.totalWorkingHours * shift.workingDays.length, "h / week"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Break Window"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coffee, { className: "h-4 w-4 text-emerald-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xl font-bold font-display text-foreground",
									children: shift.breakDuration
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-1 truncate",
									title: shift.breakWindow,
									children: shift.breakWindow
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Grace Period"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium text-foreground",
									children: [shift.gracePeriodMinutes, " mins"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl shadow-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Shift Policy"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4 text-purple-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xl font-bold font-display text-foreground",
									children: shift.nightPremiumPercent > 0 ? `+${shift.nightPremiumPercent}% Premium` : "Standard Policy"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-1",
									children: shift.shiftType === "Night" ? "Night Shift Allowance Applicable" : "Regular Business Hours"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 pt-3 border-t border-border/50 flex items-center justify-between text-[11px]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Status"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-medium text-emerald-400 flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Active"]
								})]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: activeTab,
				onValueChange: setActiveTab,
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-card/60 border border-border p-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "today",
								className: "gap-1.5 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-3.5 w-3.5" }), " Today's Shift"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "upcoming",
								className: "gap-1.5 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-3.5 w-3.5" }),
									" Upcoming Shifts (",
									data.upcomingShifts.length,
									")"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
								value: "history",
								className: "gap-1.5 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(History, { className: "h-3.5 w-3.5" }),
									" Shift History (",
									data.shiftHistory.length,
									")"
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "today",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold uppercase tracking-wider text-indigo-400",
											children: "Schedule for Today"
										}), today?.isOffDay && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: "outline",
											className: "text-amber-400 border-amber-500/30",
											children: "Scheduled Off Day / Holiday"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-2xl font-bold font-display text-foreground mt-1",
										children: [
											today?.day,
											", ",
											today?.date
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: today?.isOffDay ? "No regular work shift scheduled for today." : `Assigned to ${shift.shiftName} (${shift.startTime} – ${shift.endTime}).`
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => {
											setSelectedShiftForDetails(shift);
											setDetailsOpen(true);
										},
										className: "gap-1.5 text-xs border-border",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" }), " View Timing Policy"]
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border/60 bg-muted/20 p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] font-medium text-muted-foreground uppercase tracking-wider",
												children: "Core Shift Timing"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-lg font-bold text-foreground mt-1",
												children: [
													shift.startTime,
													" – ",
													shift.endTime
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-xs text-muted-foreground mt-0.5",
												children: ["Break: ", shift.breakWindow]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border/60 bg-muted/20 p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] font-medium text-muted-foreground uppercase tracking-wider",
												children: "Today's Punch Status"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-lg font-bold text-foreground mt-1 flex items-center gap-1.5",
												children: today?.checkedIn ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-emerald-400 flex items-center gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }),
														" Checked In (",
														today.checkInTime,
														")"
													]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground",
													children: "Not Punched Yet"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground mt-0.5",
												children: today?.checkedOut ? `Checked Out: ${today.checkOutTime}` : "Active working day"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-border/60 bg-muted/20 p-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[11px] font-medium text-muted-foreground uppercase tracking-wider",
												children: "Shift Working Hours"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "text-lg font-bold text-foreground mt-1",
												children: [shift.totalWorkingHours, " Hours"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "text-xs text-muted-foreground mt-0.5",
												children: "Net productive duration"
											})
										]
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "upcoming",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5 border-b border-border/50 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-base font-semibold text-foreground",
									children: "Upcoming Assigned Shifts"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: "Upcoming planned working shifts for the next 14 business days."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "text-xs border-border",
									children: [data.upcomingShifts.length, " Scheduled"]
								})]
							}), data.upcomingShifts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-12 text-center text-xs text-muted-foreground",
								children: "No upcoming shifts found in schedule."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y divide-border/40",
								children: data.upcomingShifts.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/15 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl bg-indigo-500/10 border border-indigo-500/20 p-2.5 text-center min-w-[54px] shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-semibold uppercase text-indigo-400 block",
												children: item.day.slice(0, 3)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-base font-bold text-foreground block leading-tight",
												children: item.date.split("-")[2]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-sm text-foreground",
												children: item.shiftName
											}), getShiftTypeBadge(item.shiftType)]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
														" ",
														item.startTime,
														" – ",
														item.endTime
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "inline-flex items-center gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Coffee, { className: "h-3 w-3" }),
														" Break: ",
														item.breakDuration
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
													"Working Hours: ",
													item.workingHours,
													"h"
												] })
											]
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2 self-end sm:self-center shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-xs",
											children: "Scheduled"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "sm",
											onClick: () => {
												setSelectedShiftForDetails(shift);
												setDetailsOpen(true);
											},
											className: "h-8 text-xs text-muted-foreground hover:text-foreground",
											children: "Details"
										})]
									})]
								}, item.id))
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "history",
						className: "space-y-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5 border-b border-border/50 flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display text-base font-semibold text-foreground",
									children: "Shift Attendance History"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-0.5",
									children: "Logged shifts and verified check-in history from the backend database."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
									variant: "outline",
									className: "text-xs border-border",
									children: [data.shiftHistory.length, " Logged Entries"]
								})]
							}), data.shiftHistory.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "p-12 text-center text-xs text-muted-foreground",
								children: "No past shift logs recorded yet."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "divide-y divide-border/40",
								children: data.shiftHistory.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-muted/15 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl bg-muted/40 border border-border p-2.5 text-center min-w-[54px] shrink-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-semibold uppercase text-muted-foreground block",
												children: item.day.slice(0, 3)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-base font-bold text-foreground block leading-tight",
												children: item.date.split("-")[2]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-semibold text-sm text-foreground",
												children: item.shiftName
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-xs text-muted-foreground",
												children: [
													"(",
													item.date,
													")"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Check-In: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground font-medium",
													children: item.checkInTime || "—"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Check-Out: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground font-medium",
													children: item.checkOutTime || "—"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "•" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Hours: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-foreground font-medium",
													children: item.workingHours ? `${item.workingHours}h` : "—"
												})] })
											]
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "self-end sm:self-center shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											className: item.status === "Present" ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-xs" : "bg-muted/40 text-muted-foreground border-border text-xs",
											children: item.status
										})
									})]
								}, item.id))
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: detailsOpen,
				onOpenChange: setDetailsOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg border-border bg-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-lg font-bold font-display text-foreground",
								children: selectedShiftForDetails?.shiftName || "Shift Details"
							}), selectedShiftForDetails && getShiftTypeBadge(selectedShiftForDetails.shiftType)]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Official shift timing specifications and company scheduling parameters."
						})] }),
						selectedShiftForDetails && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 rounded-xl bg-muted/30 border border-border/50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground block text-[11px]",
												children: "Start Time"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-semibold text-foreground mt-0.5 block",
												children: selectedShiftForDetails.startTime
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 rounded-xl bg-muted/30 border border-border/50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground block text-[11px]",
												children: "End Time"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-semibold text-foreground mt-0.5 block",
												children: selectedShiftForDetails.endTime
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 rounded-xl bg-muted/30 border border-border/50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground block text-[11px]",
												children: "Break Duration"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-sm font-semibold text-foreground mt-0.5 block",
												children: selectedShiftForDetails.breakDuration
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-3 rounded-xl bg-muted/30 border border-border/50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground block text-[11px]",
												children: "Total Working Hours"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-sm font-semibold text-foreground mt-0.5 block",
												children: [selectedShiftForDetails.totalWorkingHours, " Hours"]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "p-3.5 rounded-xl bg-muted/20 border border-border/50 space-y-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Designated Meal Break:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: selectedShiftForDetails.breakWindow
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Grace Period Allowance:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-medium text-foreground",
												children: [selectedShiftForDetails.gracePeriodMinutes, " minutes"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Night Shift Premium:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: selectedShiftForDetails.nightPremiumPercent > 0 ? `${selectedShiftForDetails.nightPremiumPercent}% Differential` : "Standard"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between items-center",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground",
												children: "Active Work Days:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-medium text-foreground",
												children: selectedShiftForDetails.workingDays.join(", ")
											})]
										})
									]
								}),
								selectedShiftForDetails.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "p-3 rounded-xl bg-muted/20 border border-border/40 text-muted-foreground leading-relaxed",
									children: selectedShiftForDetails.description
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
							className: "border-t border-border/50 pt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setDetailsOpen(false),
								className: "text-xs border-border",
								children: "Close"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: requestModalOpen,
				onOpenChange: setRequestModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "text-lg font-bold font-display text-foreground",
						children: "Request Shift Change"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: "Submit a formal request to HR and your manager to modify your assigned work shift."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleRequestChangeSubmit,
						className: "space-y-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs text-muted-foreground",
								children: "Current Shift"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: `${shift.shiftName} (${shift.startTime} – ${shift.endTime})`,
								disabled: true,
								className: "mt-1 bg-muted/40 text-xs border-border"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "requested-shift",
								className: "text-xs text-foreground",
								children: "Desired Shift"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "requested-shift",
								value: requestedShift,
								onChange: (e) => setRequestedShift(e.target.value),
								className: "mt-1 flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Morning Shift",
										children: "Morning Shift (09:00 AM – 06:00 PM)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Evening Shift",
										children: "Evening Shift (02:00 PM – 11:00 PM)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Night Shift",
										children: "Night Shift (10:00 PM – 07:00 AM)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Flexible Shift",
										children: "Flexible Shift (10:00 AM – 07:00 PM)"
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "effective-date",
								className: "text-xs text-foreground",
								children: "Requested Effective Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "effective-date",
								type: "date",
								value: effectiveDate,
								onChange: (e) => setEffectiveDate(e.target.value),
								className: "mt-1 text-xs border-border",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "change-reason",
								className: "text-xs text-foreground",
								children: "Reason / Justification"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "change-reason",
								rows: 3,
								placeholder: "Please state the reason for requesting this shift adjustment...",
								value: changeReason,
								onChange: (e) => setChangeReason(e.target.value),
								className: "mt-1 text-xs border-border",
								required: true
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "border-t border-border/50 pt-3 gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => setRequestModalOpen(false),
									className: "text-xs border-border",
									disabled: submittingRequest,
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									size: "sm",
									className: "text-xs bg-indigo-600 hover:bg-indigo-700 text-white",
									disabled: submittingRequest,
									children: submittingRequest ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin mr-1.5" }), " Submitting..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5 mr-1.5" }), " Submit Request"] })
								})]
							})
						]
					})]
				})
			})
		]
	});
}
var Breadcrumb = import_react.forwardRef(({ ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
	ref,
	"aria-label": "breadcrumb",
	...props
}));
Breadcrumb.displayName = "Breadcrumb";
var BreadcrumbList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
	ref,
	className: cn("flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5", className),
	...props
}));
BreadcrumbList.displayName = "BreadcrumbList";
var BreadcrumbItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
	ref,
	className: cn("inline-flex items-center gap-1.5", className),
	...props
}));
BreadcrumbItem.displayName = "BreadcrumbItem";
var BreadcrumbLink = import_react.forwardRef(({ asChild, className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "a", {
		ref,
		className: cn("transition-colors hover:text-foreground", className),
		...props
	});
});
BreadcrumbLink.displayName = "BreadcrumbLink";
var BreadcrumbPage = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
	ref,
	role: "link",
	"aria-disabled": "true",
	"aria-current": "page",
	className: cn("font-normal text-foreground", className),
	...props
}));
BreadcrumbPage.displayName = "BreadcrumbPage";
var BreadcrumbSeparator = ({ children, className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
	role: "presentation",
	"aria-hidden": "true",
	className: cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className),
	...props,
	children: children ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {})
});
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";
var BreadcrumbEllipsis = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
	role: "presentation",
	"aria-hidden": "true",
	className: cn("flex h-9 w-9 items-center justify-center", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ellipsis, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "sr-only",
		children: "More"
	})]
});
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";
var Route = createFileRoute("/dashboard/attendance/shifts")({
	head: () => ({ meta: [{ title: "Shifts — OFC360" }] }),
	component: ShiftsPage
});
var WEEK_DAYS = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun"
];
function ShiftsPage() {
	useAurix();
	const router = useRouterState();
	const pathname = router.location.pathname;
	const searchParams = router.location.search;
	const viewParam = searchParams?.view;
	const employeeIdParam = searchParams?.employeeId;
	const isEmployee = useCurrentRole() === "employee" || viewParam === "my" || pathname.startsWith("/dashboard/employee");
	const [shifts, setShifts] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [typeFilter, setTypeFilter] = (0, import_react.useState)("all");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [isModalOpen, setIsModalOpen] = (0, import_react.useState)(false);
	const [editingShiftId, setEditingShiftId] = (0, import_react.useState)(null);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [formName, setFormName] = (0, import_react.useState)("");
	const [formCode, setFormCode] = (0, import_react.useState)("");
	const [formStartTime, setFormStartTime] = (0, import_react.useState)("09:00");
	const [formEndTime, setFormEndTime] = (0, import_react.useState)("18:00");
	const [formGrace, setFormGrace] = (0, import_react.useState)(15);
	const [formBreak, setFormBreak] = (0, import_react.useState)(60);
	const [formNightShift, setFormNightShift] = (0, import_react.useState)(false);
	const [formNightPremium, setFormNightPremium] = (0, import_react.useState)(0);
	const [formDays, setFormDays] = (0, import_react.useState)([
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri"
	]);
	const [formDescription, setFormDescription] = (0, import_react.useState)("");
	const [formIsActive, setFormIsActive] = (0, import_react.useState)(true);
	const [isAssignOpen, setIsAssignOpen] = (0, import_react.useState)(false);
	const [selectedShiftForAssign, setSelectedShiftForAssign] = (0, import_react.useState)(null);
	const [employees, setEmployees] = (0, import_react.useState)([]);
	const [employeesLoading, setEmployeesLoading] = (0, import_react.useState)(false);
	const [selectedEmpIds, setSelectedEmpIds] = (0, import_react.useState)([]);
	const [effectiveDate, setEffectiveDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
	const [assignNotes, setAssignNotes] = (0, import_react.useState)("");
	const [assigning, setAssigning] = (0, import_react.useState)(false);
	const [isDeleteOpen, setIsDeleteOpen] = (0, import_react.useState)(false);
	const [shiftToDelete, setShiftToDelete] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const loadShifts = async (showNotice = false) => {
		setLoading(true);
		setError(null);
		try {
			setShifts(await attendanceApi.getShifts());
			if (showNotice) toast.success("Shifts refreshed from backend");
		} catch (err) {
			const msg = err?.message || "Failed to load shifts from server";
			setError(msg);
			if (showNotice) toast.error(msg);
		} finally {
			setLoading(false);
		}
	};
	const loadEmployees = async () => {
		if (employees.length > 0) return;
		setEmployeesLoading(true);
		try {
			const data = (await apiInstance.get("/employees?limit=200")).data?.data;
			setEmployees((Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : []).map((e) => ({
				id: e.id || e.employee_id,
				name: e.full_name || `${e.first_name || ""} ${e.last_name || ""}`.trim() || e.name || "Employee",
				department: e.department || "General",
				designation: e.designation || e.role,
				email: e.email
			})));
		} catch (err) {
			console.warn("Could not load employees from /employees endpoint:", err);
		} finally {
			setEmployeesLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (!isEmployee) loadShifts();
	}, [isEmployee]);
	const filteredShifts = (0, import_react.useMemo)(() => {
		return shifts.filter((s) => {
			if (search && !`${s.name} ${s.code} ${s.description}`.toLowerCase().includes(search.toLowerCase())) return false;
			if (typeFilter === "night" && !s.nightShift) return false;
			if (typeFilter === "day" && s.nightShift) return false;
			if (statusFilter === "active" && !s.isActive) return false;
			if (statusFilter === "inactive" && s.isActive) return false;
			return true;
		});
	}, [
		shifts,
		search,
		typeFilter,
		statusFilter
	]);
	const stats = (0, import_react.useMemo)(() => {
		return {
			total: shifts.length,
			active: shifts.filter((s) => s.isActive).length,
			night: shifts.filter((s) => s.nightShift).length,
			assigned: shifts.reduce((sum, s) => sum + (s.assignedEmployeesCount || 0), 0)
		};
	}, [shifts]);
	if (isEmployee) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeShiftsView, { employeeId: employeeIdParam || void 0 });
	const openCreateDialog = () => {
		setEditingShiftId(null);
		setFormName("");
		setFormCode("");
		setFormStartTime("09:00");
		setFormEndTime("18:00");
		setFormGrace(15);
		setFormBreak(60);
		setFormNightShift(false);
		setFormNightPremium(0);
		setFormDays([
			"Mon",
			"Tue",
			"Wed",
			"Thu",
			"Fri"
		]);
		setFormDescription("");
		setFormIsActive(true);
		setIsModalOpen(true);
	};
	const openEditDialog = (s) => {
		setEditingShiftId(s.id);
		setFormName(s.name);
		setFormCode(s.code);
		setFormStartTime(s.startTime);
		setFormEndTime(s.endTime);
		setFormGrace(s.gracePeriodMinutes);
		setFormBreak(s.breakDurationMinutes);
		setFormNightShift(s.nightShift);
		setFormNightPremium(s.nightPremiumPercent);
		setFormDays(s.workingDays);
		setFormDescription(s.description || "");
		setFormIsActive(s.isActive);
		setIsModalOpen(true);
	};
	const handleSaveShift = async (e) => {
		e.preventDefault();
		if (!formName.trim()) {
			toast.error("Shift name is required");
			return;
		}
		if (!formCode.trim()) {
			toast.error("Shift code is required");
			return;
		}
		setSubmitting(true);
		const payload = {
			name: formName.trim(),
			code: formCode.trim().toUpperCase(),
			startTime: formStartTime,
			endTime: formEndTime,
			gracePeriodMinutes: Number(formGrace),
			breakDurationMinutes: Number(formBreak),
			nightShift: formNightShift,
			nightPremiumPercent: formNightShift ? Number(formNightPremium) : 0,
			workingDays: formDays,
			description: formDescription,
			isActive: formIsActive
		};
		try {
			if (editingShiftId) {
				const updated = await attendanceApi.updateShift(editingShiftId, payload);
				setShifts((prev) => prev.map((item) => item.id === editingShiftId ? updated : item));
				toast.success(`Shift "${updated.name}" updated successfully`);
			} else {
				const created = await attendanceApi.createShift(payload);
				setShifts((prev) => [created, ...prev]);
				toast.success(`Shift "${created.name}" created successfully`);
			}
			setIsModalOpen(false);
		} catch (err) {
			toast.error(err?.message || "Failed to save shift to backend");
		} finally {
			setSubmitting(false);
		}
	};
	const openAssignModal = (s) => {
		setSelectedShiftForAssign(s);
		setSelectedEmpIds([]);
		setEffectiveDate((/* @__PURE__ */ new Date()).toISOString().split("T")[0]);
		setAssignNotes("");
		setIsAssignOpen(true);
		loadEmployees();
	};
	const handleAssignShift = async () => {
		if (!selectedShiftForAssign) return;
		if (selectedEmpIds.length === 0) {
			toast.error("Please select at least one employee");
			return;
		}
		setAssigning(true);
		try {
			const res = await attendanceApi.assignShift(selectedShiftForAssign.id, {
				employeeIds: selectedEmpIds,
				effectiveDate,
				notes: assignNotes || void 0
			});
			setShifts((prev) => prev.map((s) => s.id === selectedShiftForAssign.id ? {
				...s,
				assignedEmployeesCount: (s.assignedEmployeesCount || 0) + res.assignedCount
			} : s));
			toast.success(`Assigned ${res.assignedCount} employees to ${selectedShiftForAssign.name}`);
			setIsAssignOpen(false);
		} catch (err) {
			toast.error(err?.message || "Failed to assign shift");
		} finally {
			setAssigning(false);
		}
	};
	const confirmDelete = async () => {
		if (!shiftToDelete) return;
		setDeleting(true);
		try {
			await attendanceApi.deleteShift(shiftToDelete.id);
			setShifts((prev) => prev.filter((s) => s.id !== shiftToDelete.id));
			toast.success(`Deleted shift "${shiftToDelete.name}"`);
			setIsDeleteOpen(false);
		} catch (err) {
			toast.error(err?.message || "Failed to delete shift from backend");
		} finally {
			setDeleting(false);
		}
	};
	const toggleDay = (d) => {
		setFormDays((prev) => prev.includes(d) ? prev.filter((item) => item !== d) : [...prev, d]);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 pb-20",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumb, {
						className: "mb-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BreadcrumbList, {
							className: "text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbLink, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/dashboard/attendance",
										children: "Attendance"
									})
								}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbSeparator, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbPage, {
									className: "font-medium",
									children: "Shifts"
								}) })
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-xl bg-gradient-brand text-brand-foreground shadow-glow",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-2xl font-bold tracking-tight text-foreground",
							children: "Shift Management"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground text-left",
						children: "Define organizational schedules, grace periods, night differentials, and assign shifts across teams."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-2.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: openCreateDialog,
						className: "h-9 gap-1.5 text-xs bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-600 hover:to-purple-700",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), "Create Shift"]
					})
				})]
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive text-left",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: "Backend Notice:"
						}),
						" ",
						error,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-[11px] text-muted-foreground",
							children: "Shifts API (GET /api/v1/attendance/shifts) requires active backend routes."
						})
					] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					onClick: () => loadShifts(true),
					className: "h-7 text-xs border-destructive/40 hover:bg-destructive/15",
					children: "Retry"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-4 text-left",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
									children: "Total Shifts"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-indigo-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 font-display text-2xl font-bold",
								children: loading ? "..." : stats.total
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground",
								children: "Configured shift profiles"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
									children: "Active Shifts"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 font-display text-2xl font-bold",
								children: loading ? "..." : stats.active
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground",
								children: "Currently in rotation"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
									children: "Night Shifts"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4 text-purple-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 font-display text-2xl font-bold",
								children: loading ? "..." : stats.night
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground",
								children: "With night differential"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium uppercase tracking-wider text-muted-foreground",
									children: "Allocations"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-blue-400" })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-2 font-display text-2xl font-bold",
								children: loading ? "..." : stats.assigned
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[11px] text-muted-foreground",
								children: "Employees mapped"
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-card/50 border border-border/80 p-3 rounded-xl backdrop-blur-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 max-w-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search shift name or code...",
						value: search,
						onChange: (e) => setSearch(e.target.value),
						className: "pl-9 h-9 text-xs"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center bg-muted/40 rounded-lg p-0.5 border border-border/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTypeFilter("all"),
								className: `px-2.5 py-1 rounded-md font-medium transition-colors ${typeFilter === "all" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"}`,
								children: "All Types"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTypeFilter("day"),
								className: `px-2.5 py-1 rounded-md font-medium transition-colors ${typeFilter === "day" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"}`,
								children: "Day"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setTypeFilter("night"),
								className: `px-2.5 py-1 rounded-md font-medium transition-colors ${typeFilter === "night" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"}`,
								children: "Night"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center bg-muted/40 rounded-lg p-0.5 border border-border/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setStatusFilter("all"),
								className: `px-2.5 py-1 rounded-md font-medium transition-colors ${statusFilter === "all" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"}`,
								children: "All Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setStatusFilter("active"),
								className: `px-2.5 py-1 rounded-md font-medium transition-colors ${statusFilter === "active" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"}`,
								children: "Active"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setStatusFilter("inactive"),
								className: `px-2.5 py-1 rounded-md font-medium transition-colors ${statusFilter === "inactive" ? "bg-background shadow-xs text-foreground" : "text-muted-foreground"}`,
								children: "Inactive"
							})
						]
					})]
				})]
			}),
			loading && shifts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center p-16 border border-border rounded-2xl bg-card/30 gap-3 text-muted-foreground text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-6 w-6 animate-spin text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Loading shift templates from backend..." })]
			}) : filteredShifts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col items-center justify-center p-16 border border-dashed border-border rounded-2xl bg-card/20 gap-3 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-10 w-10 text-muted-foreground/50" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold text-sm",
						children: "No Shifts Found"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground max-w-md",
						children: shifts.length === 0 ? "No work shifts have been created yet. Click 'Create Shift' to configure the first company schedule." : "No shifts match your search and filter criteria."
					}),
					shifts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: openCreateDialog,
						className: "mt-2 text-xs gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), " Create First Shift"]
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3",
				children: filteredShifts.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md p-5 transition-all duration-300 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5 text-left",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display font-semibold text-foreground text-base",
									children: s.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "font-mono text-[10px] tracking-wider uppercase",
									children: s.code
								})]
							}), s.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground line-clamp-2",
								children: s.description
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: s.isActive ? "secondary" : "outline",
								className: `text-[10px] ${s.isActive ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : ""}`,
								children: s.isActive ? "Active" : "Inactive"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex items-center justify-between rounded-xl bg-muted/40 border border-border/50 p-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2.5",
								children: [s.nightShift ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-purple-500/15 text-purple-400",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4" })
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "grid h-8 w-8 place-items-center rounded-lg bg-amber-500/15 text-amber-500",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-mono text-sm font-semibold tracking-tight text-foreground",
									children: [
										s.startTime,
										" – ",
										s.endTime
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] text-muted-foreground font-medium",
									children: [s.workHours, "h total shift"]
								})] })]
							}), s.nightShift && s.nightPremiumPercent > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								className: "bg-purple-500/10 text-purple-400 border-purple-500/20 text-[10px]",
								children: [
									"+",
									s.nightPremiumPercent,
									"% Night Diff"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-md bg-background/80 border border-border/60 px-2 py-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3 text-amber-500" }),
										s.gracePeriodMinutes,
										"m grace"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-md bg-background/80 border border-border/60 px-2 py-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3 text-sky-500" }),
										s.breakDurationMinutes,
										"m break"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-md bg-background/80 border border-border/60 px-2 py-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3 w-3 text-emerald-500" }),
										s.assignedEmployeesCount || 0,
										" assigned"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex items-center gap-1",
							children: WEEK_DAYS.map((d) => {
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `grid h-6 w-6 place-items-center rounded text-[9px] font-semibold transition-colors ${s.workingDays.includes(d) ? "bg-indigo-500/20 text-indigo-400 font-bold border border-indigo-500/30" : "bg-muted/30 text-muted-foreground/40"}`,
									children: d[0]
								}, d);
							})
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 pt-3 border-t border-border/60 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => openAssignModal(s),
							className: "h-8 gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 hover:border-indigo-500/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-3.5 w-3.5" }), "Assign Team"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => openEditDialog(s),
								className: "h-8 w-8 p-0 text-muted-foreground hover:text-foreground",
								title: "Edit Shift",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-3.5 w-3.5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => {
									setShiftToDelete(s);
									setIsDeleteOpen(true);
								},
								className: "h-8 w-8 p-0 text-muted-foreground hover:text-destructive",
								title: "Delete Shift",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
							})]
						})]
					})]
				}, s.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isModalOpen,
				onOpenChange: setIsModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editingShiftId ? "Edit Shift Schedule" : "Create New Shift" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Configure timing, grace periods, night differentials, and working days for this shift profile." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveShift,
						className: "space-y-4 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 sm:col-span-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
										children: "Shift Name *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										placeholder: "e.g. Morning Shift",
										value: formName,
										onChange: (e) => setFormName(e.target.value),
										className: "mt-1 h-9 text-xs"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "col-span-2 sm:col-span-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
										children: "Shift Code *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										placeholder: "e.g. MS-01",
										value: formCode,
										onChange: (e) => setFormCode(e.target.value),
										className: "mt-1 h-9 text-xs uppercase"
									})]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
									children: "Start Time *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									type: "time",
									value: formStartTime,
									onChange: (e) => setFormStartTime(e.target.value),
									className: "mt-1 h-9 text-xs"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
									children: "End Time *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									type: "time",
									value: formEndTime,
									onChange: (e) => setFormEndTime(e.target.value),
									className: "mt-1 h-9 text-xs"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
									children: "Grace Period (minutes)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									max: 120,
									value: formGrace,
									onChange: (e) => setFormGrace(Number(e.target.value)),
									className: "mt-1 h-9 text-xs"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
									children: "Break Duration (minutes)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									max: 180,
									value: formBreak,
									onChange: (e) => setFormBreak(Number(e.target.value)),
									className: "mt-1 h-9 text-xs"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border/80 bg-muted/30 p-3 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, { className: "h-4 w-4 text-purple-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "text-xs font-semibold",
											children: "Night Shift Schedule"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] text-muted-foreground",
											children: "Applies night shift policy and differential pay."
										})] })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: formNightShift,
										onChange: (e) => setFormNightShift(e.target.checked),
										className: "h-4 w-4 rounded cursor-pointer"
									})]
								}), formNightShift && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-medium text-muted-foreground",
									children: "Night Shift Differential Premium (%)"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									min: 0,
									max: 100,
									value: formNightPremium,
									onChange: (e) => setFormNightPremium(Number(e.target.value)),
									className: "mt-1 h-8 text-xs w-32"
								})] })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
								children: "Working Days"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5 flex flex-wrap gap-1.5",
								children: WEEK_DAYS.map((d) => {
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => toggleDay(d),
										className: `px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${formDays.includes(d) ? "bg-indigo-600 text-white font-semibold shadow-xs" : "bg-muted text-muted-foreground hover:bg-muted/80"}`,
										children: d
									}, d);
								})
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
								children: "Description / Notes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								placeholder: "Optional notes or eligibility requirements...",
								value: formDescription,
								onChange: (e) => setFormDescription(e.target.value),
								className: "mt-1 resize-none text-xs"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2 pt-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									id: "shift-active",
									type: "checkbox",
									checked: formIsActive,
									onChange: (e) => setFormIsActive(e.target.checked),
									className: "h-4 w-4 rounded cursor-pointer"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "shift-active",
									className: "text-xs font-medium cursor-pointer",
									children: "Active Shift (available for scheduling and roster assignment)"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									onClick: () => setIsModalOpen(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									size: "sm",
									disabled: submitting,
									className: "gap-1.5",
									children: [submitting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), editingShiftId ? "Update Shift" : "Save Shift"]
								})]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isAssignOpen,
				onOpenChange: setIsAssignOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Assign Shift to Employees" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							"Assign ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground",
								children: selectedShiftForAssign?.name
							}),
							" (",
							selectedShiftForAssign?.startTime,
							" – ",
							selectedShiftForAssign?.endTime,
							") to selected team members."
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2 text-left",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
									children: "Effective Start Date *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: effectiveDate,
									onChange: (e) => setEffectiveDate(e.target.value),
									className: "mt-1 h-9 text-xs"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
										children: [
											"Select Team Members (",
											selectedEmpIds.length,
											" selected)"
										]
									}), employees.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											if (selectedEmpIds.length === employees.length) setSelectedEmpIds([]);
											else setSelectedEmpIds(employees.map((e) => e.id));
										},
										className: "text-[11px] font-semibold text-indigo-400 hover:underline cursor-pointer",
										children: selectedEmpIds.length === employees.length ? "Deselect All" : "Select All"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "max-h-56 overflow-y-auto rounded-xl border border-border bg-card/40 p-2 space-y-1",
									children: employeesLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), " Loading employees..."]
									}) : employees.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-6 text-center text-xs text-muted-foreground",
										children: "No employees found from backend directory."
									}) : employees.map((emp) => {
										const checked = selectedEmpIds.includes(emp.id);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: `flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${checked ? "bg-indigo-500/10 border border-indigo-500/30" : "hover:bg-muted/40"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked,
													onChange: (e) => {
														if (e.target.checked) setSelectedEmpIds((prev) => [...prev, emp.id]);
														else setSelectedEmpIds((prev) => prev.filter((id) => id !== emp.id));
													},
													className: "h-3.5 w-3.5 rounded"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-xs font-medium text-foreground",
													children: emp.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "text-[10px] text-muted-foreground",
													children: [
														emp.department,
														" ",
														emp.designation ? `· ${emp.designation}` : ""
													]
												})] })]
											}), checked && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-indigo-400" })]
										}, emp.id);
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
									children: "Assignment Notes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									rows: 2,
									placeholder: "Optional assignment instructions...",
									value: assignNotes,
									onChange: (e) => setAssignNotes(e.target.value),
									className: "mt-1 resize-none text-xs"
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setIsAssignOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							disabled: assigning || selectedEmpIds.length === 0,
							onClick: handleAssignShift,
							className: "gap-1.5",
							children: [assigning && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), "Assign Shift"]
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isDeleteOpen,
				onOpenChange: setIsDeleteOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Delete Shift Profile" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
						"Are you sure you want to delete ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
							className: "text-foreground",
							children: shiftToDelete?.name
						}),
						"? Employees currently assigned will need to be reallocated."
					] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setIsDeleteOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "destructive",
							size: "sm",
							disabled: deleting,
							onClick: confirmDelete,
							className: "gap-1.5",
							children: [deleting && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), "Delete Shift"]
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { Route, ShiftsPage as default };
