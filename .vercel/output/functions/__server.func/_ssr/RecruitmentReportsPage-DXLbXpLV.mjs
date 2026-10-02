import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { S as Tooltip, b as Cell, c as YAxis, d as Line, f as CartesianGrid, l as XAxis, n as Funnel, o as BarChart, p as Bar, s as LineChart, t as FunnelChart, x as ResponsiveContainer, y as LabelList } from "../_libs/recharts+[...].mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { n as STAGE_LABEL, t as STAGES } from "./types-CxbMeuye.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RecruitmentReportsPage-DXLbXpLV.js
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"oklch(0.65 0.22 285)",
	"oklch(0.7 0.18 200)",
	"oklch(0.74 0.16 140)",
	"oklch(0.75 0.18 60)",
	"oklch(0.68 0.2 25)",
	"oklch(0.62 0.18 320)"
];
function RecruitmentReportsPage() {
	const { candidates, jobs, offers, interviews } = useRecruitment((s) => s);
	function getDaysDiff(endStr, startStr) {
		if (!startStr) return 0;
		const start = new Date(startStr);
		const end = endStr ? new Date(endStr) : /* @__PURE__ */ new Date();
		const diffTime = Math.abs(end.getTime() - start.getTime());
		return Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
	}
	const funnel = STAGES.filter((s) => s !== "rejected").map((s, i) => ({
		name: STAGE_LABEL[s],
		value: candidates.filter((c) => c.stage === s).length,
		fill: COLORS[i % COLORS.length]
	}));
	const deptTthMap = {};
	const hiredCandidates = candidates.filter((c) => c.stage === "hired");
	hiredCandidates.forEach((c) => {
		const dept = jobs.find((j) => j.id === c.jobId)?.department || "General";
		const offer = offers.find((o) => o.candidateId === c.id);
		const days = getDaysDiff(offer?.respondedAt || offer?.joiningDate || c.appliedAt, c.appliedAt) || 15;
		if (!deptTthMap[dept]) deptTthMap[dept] = {
			totalDays: 0,
			count: 0
		};
		deptTthMap[dept].totalDays += days;
		deptTthMap[dept].count += 1;
	});
	const tth = Object.entries(deptTthMap).map(([d, data]) => ({
		d,
		v: Math.round(data.totalDays / data.count)
	}));
	if (tth.length === 0) {
		const departments = Array.from(new Set(jobs.map((j) => j.department).filter(Boolean)));
		if (departments.length > 0) departments.forEach((d) => tth.push({
			d,
			v: 0
		}));
		else tth.push({
			d: "No Data",
			v: 0
		});
	}
	const monthlyMap = {
		Jan: 0,
		Feb: 0,
		Mar: 0,
		Apr: 0,
		May: 0,
		Jun: 0,
		Jul: 0,
		Aug: 0,
		Sep: 0,
		Oct: 0,
		Nov: 0,
		Dec: 0
	};
	candidates.forEach((c) => {
		if (c.stage === "hired") {
			const dateStr = c.appliedAt || c.timeline?.find((t) => t.title.toLowerCase().includes("hired"))?.at;
			if (dateStr) {
				const monthName = new Date(dateStr).toLocaleString("en-US", { month: "short" });
				if (monthName in monthlyMap) monthlyMap[monthName] += 1;
			}
		}
	});
	const monthsOrder = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	];
	const currentMonthIdx = (/* @__PURE__ */ new Date()).getMonth();
	const last6Months = [];
	for (let i = 5; i >= 0; i--) {
		const m = monthsOrder[(currentMonthIdx - i + 12) % 12];
		last6Months.push({
			m,
			h: monthlyMap[m] || 0
		});
	}
	const monthly = last6Months;
	const sourceMap = {};
	candidates.forEach((c) => {
		const src = c.source || "DIRECT";
		if (!sourceMap[src]) sourceMap[src] = {
			a: 0,
			h: 0
		};
		sourceMap[src].a += 1;
		if (c.stage === "hired") sourceMap[src].h += 1;
	});
	const sources = Object.entries(sourceMap).map(([s, val]) => ({
		s,
		a: val.a,
		h: val.h
	}));
	if (sources.length === 0) sources.push({
		s: "No Data",
		a: 0,
		h: 0
	});
	const recruiterMap = {};
	candidates.forEach((c) => {
		const recruiterName = jobs.find((j) => j.id === c.jobId)?.recruiter || "General Recruiter";
		if (!recruiterMap[recruiterName]) recruiterMap[recruiterName] = {
			hired: 0,
			interviews: 0,
			offers: 0,
			accept: 0
		};
		if (c.stage === "hired") recruiterMap[recruiterName].hired += 1;
		const offer = offers.find((o) => o.candidateId === c.id);
		if (offer) {
			recruiterMap[recruiterName].offers += 1;
			if (offer.status === "accepted") recruiterMap[recruiterName].accept += 1;
		}
	});
	interviews.forEach((iv) => {
		const recruiterName = jobs.find((j) => j.title === iv.jobTitle)?.recruiter || "General Recruiter";
		if (!recruiterMap[recruiterName]) recruiterMap[recruiterName] = {
			hired: 0,
			interviews: 0,
			offers: 0,
			accept: 0
		};
		recruiterMap[recruiterName].interviews += 1;
	});
	const recruiters = Object.entries(recruiterMap).map(([name, val]) => ({
		name,
		hired: val.hired,
		interviews: val.interviews,
		offers: val.offers,
		accept: val.offers > 0 ? Math.round(val.accept / val.offers * 100) : 0
	}));
	if (recruiters.length === 0) recruiters.push({
		name: "No Recruiter Data",
		hired: 0,
		interviews: 0,
		offers: 0,
		accept: 0
	});
	let totalHiredDays = 0;
	hiredCandidates.forEach((c) => {
		const offer = offers.find((o) => o.candidateId === c.id);
		totalHiredDays += getDaysDiff(offer?.respondedAt || offer?.joiningDate || c.appliedAt, c.appliedAt) || 15;
	});
	const avgTimeToHire = hiredCandidates.length > 0 ? Math.round(totalHiredDays / hiredCandidates.length) : 0;
	const timeToHireStr = avgTimeToHire > 0 ? `${avgTimeToHire}d` : "—";
	let totalFillDays = 0;
	let fillCount = 0;
	jobs.forEach((j) => {
		if (j.status === "closed" || j.applicants > 0) {
			const days = getDaysDiff(j.closingAt || (/* @__PURE__ */ new Date()).toISOString(), j.publishedAt);
			totalFillDays += days;
			fillCount += 1;
		}
	});
	const avgTimeToFill = fillCount > 0 ? Math.round(totalFillDays / fillCount) : 0;
	const timeToFillStr = avgTimeToFill > 0 ? `${avgTimeToFill}d` : "—";
	const hiredSalaries = hiredCandidates.map((c) => c.expectedSalary).filter(Boolean);
	const avgHiredSalary = hiredSalaries.length > 0 ? Math.round(hiredSalaries.reduce((a, b) => a + b, 0) / hiredSalaries.length) : 0;
	const costPerHireStr = avgHiredSalary > 0 ? `₹${(avgHiredSalary / 1e3).toFixed(0)}k` : "—";
	const offerAcceptanceVal = Math.round(offers.filter((o) => o.status === "accepted").length / Math.max(1, offers.length) * 100) || 0;
	const offerAcceptanceStr = offers.length > 0 ? `${offerAcceptanceVal}%` : "—";
	const completedInterviews = interviews.filter((iv) => iv.status === "completed");
	const positiveFeedback = completedInterviews.filter((iv) => (iv.rating || 0) >= 3.5);
	const passRateVal = Math.round(positiveFeedback.length / Math.max(1, completedInterviews.length) * 100) || 0;
	const passRateStr = completedInterviews.length > 0 ? `${passRateVal}%` : "—";
	const stats = [
		{
			k: "Time to Hire",
			v: timeToHireStr,
			d: hiredCandidates.length > 0 ? "Average hired days" : "No hired leads"
		},
		{
			k: "Time to Fill",
			v: timeToFillStr,
			d: fillCount > 0 ? "Average job duration" : "No active fill data"
		},
		{
			k: "Avg Sourcing CTC",
			v: costPerHireStr,
			d: hiredSalaries.length > 0 ? "Average profile package" : "No CTC stats"
		},
		{
			k: "Offer Acceptance",
			v: offerAcceptanceStr,
			d: `${offers.length} offers total`
		},
		{
			k: "Interview Success Rate",
			v: passRateStr,
			d: `${completedInterviews.length} feedback logs`
		},
		{
			k: "Active Jobs",
			v: jobs.filter((j) => j.status === "active").length,
			d: `${jobs.length} total jobs`
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Hiring Reports",
			description: "Funnel, time-to-hire, source ROI, recruiter leaderboard, and trends."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-3 md:grid-cols-6",
			children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-3 backdrop-blur-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground",
						children: s.k
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 font-display text-xl font-semibold",
						children: s.v
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] text-emerald-600",
						children: s.d
					})
				]
			}, s.k))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 font-display text-base font-semibold",
						children: "Hiring Funnel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 260,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(FunnelChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, {
							dataKey: "value",
							data: funnel,
							isAnimationActive: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LabelList, {
								position: "right",
								dataKey: "name",
								className: "fill-foreground"
							})
						})] })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 font-display text-base font-semibold",
						children: "Time to Hire by Dept"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 260,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: tth,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									className: "stroke-border"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "d",
									className: "text-xs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									className: "text-xs",
									unit: "d"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "v",
									radius: [
										6,
										6,
										0,
										0
									],
									children: tth.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-2 font-display text-base font-semibold",
						children: "Monthly Hiring Trends"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 260,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: monthly,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									className: "stroke-border"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "m",
									className: "text-xs"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { className: "text-xs" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "h",
									stroke: "oklch(0.65 0.22 285)",
									strokeWidth: 2
								})
							]
						})
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 font-display text-base font-semibold",
					children: "Source Performance"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border text-left text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2",
								children: "Source"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Applicants" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Hires" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Conv." })
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 font-medium",
								children: s.s
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.a }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.h }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								className: "text-[10px]",
								children: [Math.round(s.h / s.a * 100), "%"]
							}) })
						]
					}, s.s)) })]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 font-display text-base font-semibold",
					children: "Recruiter Leaderboard"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border text-left text-xs text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2",
								children: "Recruiter"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Hired" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Interviews" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Accept %" })
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: recruiters.sort((a, b) => b.hired - a.hired).map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border/60",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "py-2 font-medium",
								children: [
									i + 1,
									". ",
									r.name
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: r.hired }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: r.interviews }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "secondary",
								className: "text-[10px]",
								children: [r.accept, "%"]
							}) })
						]
					}, r.name)) })]
				})]
			})]
		})
	] });
}
//#endregion
export { RecruitmentReportsPage };
