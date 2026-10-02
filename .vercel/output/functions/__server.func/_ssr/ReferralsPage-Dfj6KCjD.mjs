import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { E as TrendingUp, On as Gift, oi as Award, p as Users } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { S as Tooltip, a as PieChart, b as Cell, c as YAxis, f as CartesianGrid, h as Pie, l as XAxis, o as BarChart, p as Bar, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { t as CandidateAvatar } from "./Bits-BEiUi0-S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ReferralsPage-Dfj6KCjD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"oklch(0.65 0.22 285)",
	"oklch(0.7 0.18 200)",
	"oklch(0.74 0.16 140)",
	"oklch(0.75 0.18 60)",
	"oklch(0.68 0.2 25)"
];
function ReferralsPage() {
	const [referralList, setReferralList] = (0, import_react.useState)([]);
	const [employees, setEmployees] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const candidates = useRecruitment((s) => s.candidates);
	const jobs = useRecruitment((s) => s.jobs);
	const [showReferModal, setShowReferModal] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [referForm, setReferForm] = (0, import_react.useState)({
		candidateId: "",
		employeeId: "",
		jobId: "",
		bonus: "3000"
	});
	(0, import_react.useEffect)(() => {
		const fetchData = async () => {
			try {
				setLoading(true);
				const [refRes, empRes] = await Promise.all([apiInstance.get("/referrals?limit=100"), apiInstance.get("/employees?limit=200")]);
				setReferralList(refRes.data?.data?.items || []);
				setEmployees(empRes.data?.data?.items || []);
			} catch (err) {
				toast.error("Failed to load employee referrals.");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);
	const resolvedReferrals = (0, import_react.useMemo)(() => {
		return referralList.map((r) => {
			const cand = candidates.find((c) => c.id === r.candidate_id);
			const job = jobs.find((j) => j.id === r.job_id);
			const emp = employees.find((e) => String(e.id) === String(r.employee_id));
			return {
				id: r.id,
				candidateId: r.candidate_id,
				candidateName: cand ? cand.name : "Candidate",
				jobTitle: job ? job.title : "Requisition",
				referrerName: emp ? `${emp.first_name || ""} ${emp.last_name || ""}`.trim() : "Referrer",
				department: emp ? emp.department || "General" : "General",
				stage: (r.status || "submitted").toLowerCase(),
				bonus: Number(r.reward_amount || 0),
				rewardStatus: r.reward_status || "pending",
				submittedAt: r.created_at ? new Date(r.created_at).toISOString().split("T")[0] : ""
			};
		});
	}, [
		referralList,
		candidates,
		jobs,
		employees
	]);
	const totalBonus = (0, import_react.useMemo)(() => resolvedReferrals.filter((r) => r.stage === "hired").reduce((a, r) => a + r.bonus, 0), [resolvedReferrals]);
	const conversion = (0, import_react.useMemo)(() => resolvedReferrals.length ? Math.round(resolvedReferrals.filter((r) => r.stage === "hired").length / resolvedReferrals.length * 100) : 0, [resolvedReferrals]);
	const byDept = (0, import_react.useMemo)(() => {
		const map = resolvedReferrals.reduce((a, r) => ({
			...a,
			[r.department]: (a[r.department] || 0) + 1
		}), {});
		return Object.entries(map).map(([name, value]) => ({
			name,
			value
		}));
	}, [resolvedReferrals]);
	const leaderboard = (0, import_react.useMemo)(() => {
		const map = resolvedReferrals.reduce((a, r) => {
			const k = r.referrerName;
			a[k] = a[k] || {
				count: 0,
				hired: 0
			};
			a[k].count += 1;
			if (r.stage === "hired") a[k].hired += 1;
			return a;
		}, {});
		return Object.entries(map).map(([name, v]) => ({
			name,
			...v
		})).sort((a, b) => b.hired - a.hired || b.count - a.count);
	}, [resolvedReferrals]);
	const handleUpdateStatus = async (id, newStage) => {
		try {
			const rewardStatus = newStage === "hired" ? "approved" : "pending";
			await apiInstance.put(`/referrals/${id}/status`, {
				status: newStage.toUpperCase(),
				reward_status: rewardStatus.toUpperCase()
			});
			toast.success("Referral status updated successfully!");
			setReferralList((await apiInstance.get("/referrals?limit=100")).data?.data?.items || []);
		} catch (err) {
			toast.error("Failed to update referral status.");
		}
	};
	const handleReferSubmit = async (e) => {
		e.preventDefault();
		if (!referForm.candidateId || !referForm.employeeId) {
			toast.error("Candidate and Referrer Employee are required.");
			return;
		}
		setSubmitting(true);
		try {
			await apiInstance.post("/referrals", {
				candidate_id: referForm.candidateId,
				employee_id: referForm.employeeId,
				job_id: referForm.jobId || null,
				reward_amount: Number(referForm.bonus) || 0
			});
			toast.success("Referral submitted successfully!");
			setShowReferModal(false);
			setReferForm({
				candidateId: "",
				employeeId: "",
				jobId: "",
				bonus: "3000"
			});
			setReferralList((await apiInstance.get("/referrals?limit=100")).data?.data?.items || []);
		} catch (err) {
			toast.error("Failed to submit referral. Make sure the candidate is not already referred.");
		} finally {
			setSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Employee Referrals",
			description: "Track referrals, payouts and the people growing your team.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => setShowReferModal(true),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "mr-2 h-4 w-4" }), "Refer Someone"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 md:grid-cols-4",
			children: [
				{
					label: "Total Referrals",
					value: resolvedReferrals.length,
					icon: Users
				},
				{
					label: "Hired",
					value: resolvedReferrals.filter((r) => r.stage === "hired").length,
					icon: Award
				},
				{
					label: "Conversion",
					value: `${conversion}%`,
					icon: TrendingUp
				},
				{
					label: "Bonuses Paid",
					value: `$${totalBonus.toLocaleString()}`,
					icon: Gift
				}
			].map((k) => {
				const Icon = k.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "text-[11px] font-medium uppercase tracking-wider text-muted-foreground",
							children: k.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 font-display text-2xl font-semibold text-foreground",
							children: k.value
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-9 w-9 place-items-center rounded-xl bg-background/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
						})]
					})
				}, k.label);
			})
		}),
		loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "text-center py-12 text-sm text-muted-foreground",
			children: "Loading employee referrals database..."
		}) : resolvedReferrals.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center py-16 text-center border border-dashed border-border rounded-2xl bg-card/40 mt-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 grid h-12 w-12 place-items-center rounded-xl bg-muted text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium text-foreground",
					children: "No referrals recorded yet"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-sm text-sm text-muted-foreground",
					children: "Submit candidate referrals to start tracking reward payouts."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setShowReferModal(true),
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gift, { className: "mr-2 h-4 w-4" }), " Refer Someone"]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl lg:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-sm font-semibold text-foreground",
					children: "Referrers Leaderboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: 260,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: leaderboard,
						margin: {
							top: 8,
							right: 8,
							left: -10,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								stroke: "oklch(0.5 0.02 264 / 0.15)",
								vertical: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "name",
								className: "text-[10px] text-muted-foreground",
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								className: "text-xs text-muted-foreground",
								tickLine: false,
								axisLine: false
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderRadius: 8
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "count",
								fill: COLORS[0],
								name: "Total Referred",
								radius: [
									8,
									8,
									0,
									0
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "hired",
								fill: COLORS[2],
								name: "Successfully Hired",
								radius: [
									8,
									8,
									0,
									0
								]
							})
						]
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 text-sm font-semibold text-foreground",
					children: "Referrals by Department"
				}), byDept.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid place-items-center h-[260px] text-xs text-muted-foreground",
					children: "No department data."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: 260,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
						data: byDept,
						dataKey: "value",
						nameKey: "name",
						cx: "50%",
						cy: "50%",
						innerRadius: 45,
						outerRadius: 85,
						paddingAngle: 3,
						children: byDept.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
						background: "var(--card)",
						border: "1px solid var(--border)",
						borderRadius: 8
					} })] })
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-accent/30 text-left text-xs uppercase tracking-wider text-muted-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "Candidate"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "Role"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "Referrer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "Stage / Status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "Bonus"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "p-3",
							children: "Submitted"
						})
					] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: resolvedReferrals.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border hover:bg-accent/10 transition-colors",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
									name: r.candidateName,
									size: 28
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard/recruitment/candidates/$candidateId",
									params: { candidateId: r.candidateId },
									className: "hover:underline font-medium text-foreground",
									children: r.candidateName
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-foreground",
							children: r.jobTitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-muted-foreground",
							children: r.referrerName
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: r.stage,
								onChange: (e) => handleUpdateStatus(r.id, e.target.value),
								className: "bg-background text-xs outline-none cursor-pointer border border-border rounded px-2 py-1 text-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "submitted",
										children: "Submitted"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "interview",
										children: "Interview"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "offer",
										children: "Offer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "hired",
										children: "Hired"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "rejected",
										children: "Rejected"
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "p-3 text-foreground",
							children: [r.bonus ? `$${r.bonus.toLocaleString()}` : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: "—"
							}), r.stage === "hired" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] ml-1 text-emerald-500 font-semibold block capitalize",
								children: [
									"(",
									r.rewardStatus,
									")"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-muted-foreground",
							children: r.submittedAt
						})
					]
				}, r.id)) })]
			})
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showReferModal,
			onOpenChange: setShowReferModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Submit Employee Referral" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Refer a candidate for a position and track their application progress." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleReferSubmit,
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ref-cand",
								children: "Candidate *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "ref-cand",
								value: referForm.candidateId,
								onChange: (e) => setReferForm({
									...referForm,
									candidateId: e.target.value
								}),
								className: "w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
								required: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "-- Select Candidate --"
								}), candidates.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.name
								}, c.id))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ref-emp",
								children: "Referrer Employee *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "ref-emp",
								value: referForm.employeeId,
								onChange: (e) => setReferForm({
									...referForm,
									employeeId: e.target.value
								}),
								className: "w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
								required: true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "-- Select Referrer --"
								}), employees.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: e.id,
									children: [
										e.first_name,
										" ",
										e.last_name,
										" (",
										e.department || "General",
										")"
									]
								}, e.id))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ref-job",
								children: "Associated Requisition"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "ref-job",
								value: referForm.jobId,
								onChange: (e) => setReferForm({
									...referForm,
									jobId: e.target.value
								}),
								className: "w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "-- None / General Pool --"
								}), jobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: j.id,
									children: j.title
								}, j.id))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "ref-bonus",
								children: "Bonus Reward Amount (USD) *"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "ref-bonus",
								type: "number",
								min: "0",
								value: referForm.bonus,
								onChange: (e) => setReferForm({
									...referForm,
									bonus: e.target.value
								}),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setShowReferModal(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								disabled: submitting,
								children: submitting ? "Submitting Referral..." : "Submit Referral"
							})]
						})
					]
				})]
			})
		})
	] });
}
//#endregion
export { ReferralsPage };
