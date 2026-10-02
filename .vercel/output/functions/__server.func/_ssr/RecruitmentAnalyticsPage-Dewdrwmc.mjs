import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ir as ChartColumn, Jr as Briefcase, er as Download, lt as RefreshCw, oi as Award, p as Users, pr as Clock } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Legend, S as Tooltip, _ as PolarRadiusAxis, a as PieChart, b as Cell, c as YAxis, d as Line, f as CartesianGrid, g as PolarAngleAxis, h as Pie, i as RadarChart, l as XAxis, m as Radar, o as BarChart, p as Bar, s as LineChart, v as PolarGrid, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { n as STAGE_LABEL, t as STAGES } from "./types-CxbMeuye.mjs";
import { t as Loader } from "./Loader-Cc5dgb_b.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RecruitmentAnalyticsPage-Dewdrwmc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"oklch(0.65 0.22 285)",
	"oklch(0.7 0.18 200)",
	"oklch(0.74 0.16 140)",
	"oklch(0.75 0.18 60)",
	"oklch(0.68 0.2 25)",
	"oklch(0.62 0.18 320)"
];
var DATE_RANGES = [
	"Last 7 Days",
	"Last 30 Days",
	"Last 90 Days",
	"YTD",
	"All Time"
];
function RecruitmentAnalyticsPage() {
	const { candidates, jobs, offers, interviews, loading, error, refreshAll } = useRecruitment();
	const [dateRange, setDateRange] = (0, import_react.useState)("All Time");
	const [selectedDept, setSelectedDept] = (0, import_react.useState)("all");
	const availableDepartments = (0, import_react.useMemo)(() => {
		const depts = /* @__PURE__ */ new Set();
		jobs.forEach((j) => {
			if (j.department?.trim()) depts.add(j.department.trim());
		});
		candidates.forEach((c) => {
			const job = jobs.find((j) => j.id === c.jobId);
			if (job?.department?.trim()) depts.add(job.department.trim());
		});
		return Array.from(depts).sort();
	}, [jobs, candidates]);
	const dateThreshold = (0, import_react.useMemo)(() => {
		const now = /* @__PURE__ */ new Date();
		if (dateRange === "Last 7 Days") return /* @__PURE__ */ new Date(now.getTime() - 7 * 864e5);
		if (dateRange === "Last 30 Days") return /* @__PURE__ */ new Date(now.getTime() - 30 * 864e5);
		if (dateRange === "Last 90 Days") return /* @__PURE__ */ new Date(now.getTime() - 90 * 864e5);
		if (dateRange === "YTD") return new Date(now.getFullYear(), 0, 1);
		return null;
	}, [dateRange]);
	const jobDeptMap = (0, import_react.useMemo)(() => {
		const map = {};
		jobs.forEach((j) => {
			if (j.id && j.department) map[j.id] = j.department;
		});
		return map;
	}, [jobs]);
	const filteredJobs = (0, import_react.useMemo)(() => {
		return jobs.filter((j) => {
			if (selectedDept !== "all" && j.department !== selectedDept) return false;
			return true;
		});
	}, [jobs, selectedDept]);
	const filteredCandidates = (0, import_react.useMemo)(() => {
		return candidates.filter((c) => {
			if (selectedDept !== "all") {
				const dept = jobDeptMap[c.jobId];
				if (dept && dept !== selectedDept) return false;
				if (!dept && c.appliedPosition && !c.appliedPosition.toLowerCase().includes(selectedDept.toLowerCase())) return false;
			}
			if (dateThreshold && c.appliedAt) {
				const appDate = new Date(c.appliedAt);
				if (!isNaN(appDate.getTime()) && appDate < dateThreshold) return false;
			}
			return true;
		});
	}, [
		candidates,
		selectedDept,
		dateThreshold,
		jobDeptMap
	]);
	const filteredCandidateIds = (0, import_react.useMemo)(() => new Set(filteredCandidates.map((c) => c.id)), [filteredCandidates]);
	const filteredOffers = (0, import_react.useMemo)(() => {
		return offers.filter((o) => {
			if (selectedDept !== "all" && o.candidateId && !filteredCandidateIds.has(o.candidateId)) return false;
			if (dateThreshold && (o.joiningDate || o.sentAt)) {
				const d = new Date(o.joiningDate || o.sentAt || "");
				if (!isNaN(d.getTime()) && d < dateThreshold) return false;
			}
			return true;
		});
	}, [
		offers,
		selectedDept,
		filteredCandidateIds,
		dateThreshold
	]);
	const filteredInterviews = (0, import_react.useMemo)(() => {
		return interviews.filter((iv) => {
			if (selectedDept !== "all" && iv.candidateId && !filteredCandidateIds.has(iv.candidateId)) return false;
			if (dateThreshold && iv.date) {
				const d = new Date(iv.date);
				if (!isNaN(d.getTime()) && d < dateThreshold) return false;
			}
			return true;
		});
	}, [
		interviews,
		selectedDept,
		filteredCandidateIds,
		dateThreshold
	]);
	const totalApplicants = filteredCandidates.length;
	const hiredCount = filteredCandidates.filter((c) => c.stage === "hired").length;
	const hireRate = totalApplicants > 0 ? Math.round(hiredCount / totalApplicants * 100) : 0;
	const activePipelineCount = filteredCandidates.filter((c) => [
		"screening",
		"assessment",
		"interview",
		"technical",
		"hr",
		"offer"
	].includes(c.stage)).length;
	const acceptedOffersCount = filteredOffers.filter((o) => o.status === "accepted").length;
	const offerAcceptancePct = filteredOffers.length > 0 ? Math.round(acceptedOffersCount / filteredOffers.length * 100) : 0;
	const funnel = STAGES.filter((s) => s !== "rejected").map((s) => ({
		stage: STAGE_LABEL[s],
		count: filteredCandidates.filter((c) => c.stage === s).length
	}));
	const bySource = Object.entries(filteredCandidates.reduce((acc, c) => {
		const src = c.source?.trim() || "Direct";
		acc[src] = (acc[src] || 0) + 1;
		return acc;
	}, {})).map(([name, value]) => ({
		name,
		value
	}));
	const byDept = Object.entries(filteredJobs.reduce((acc, j) => {
		const dept = j.department?.trim() || "General";
		acc[dept] = (acc[dept] || 0) + (j.applicants || 0);
		return acc;
	}, {})).map(([name, value]) => ({
		name,
		value
	}));
	if (byDept.length === 0 && filteredCandidates.length > 0) {
		const candidateDeptCounts = {};
		filteredCandidates.forEach((c) => {
			const dept = jobDeptMap[c.jobId] || "General";
			candidateDeptCounts[dept] = (candidateDeptCounts[dept] || 0) + 1;
		});
		Object.entries(candidateDeptCounts).forEach(([name, value]) => {
			byDept.push({
				name,
				value
			});
		});
	}
	const acceptanceData = [
		{
			name: "Accepted",
			value: filteredOffers.filter((o) => o.status === "accepted").length
		},
		{
			name: "Declined",
			value: filteredOffers.filter((o) => o.status === "declined").length
		},
		{
			name: "Pending",
			value: filteredOffers.filter((o) => o.status === "sent" || o.status === "pending-approval" || o.status === "draft").length
		}
	];
	const totalOffersCount = acceptanceData.reduce((acc, curr) => acc + curr.value, 0);
	const interviewConv = [
		{
			stage: "Applied",
			val: totalApplicants
		},
		{
			stage: "Screened",
			val: filteredCandidates.filter((c) => c.stage !== "applied").length
		},
		{
			stage: "Interview",
			val: filteredCandidates.filter((c) => [
				"interview",
				"technical",
				"hr",
				"offer",
				"hired"
			].includes(c.stage)).length
		},
		{
			stage: "Technical",
			val: filteredCandidates.filter((c) => [
				"technical",
				"hr",
				"offer",
				"hired"
			].includes(c.stage)).length
		},
		{
			stage: "Offer",
			val: filteredCandidates.filter((c) => ["offer", "hired"].includes(c.stage)).length
		},
		{
			stage: "Hired",
			val: hiredCount
		}
	].map((item) => ({
		stage: item.stage,
		value: totalApplicants > 0 ? Math.round(item.val / totalApplicants * 100) : 0
	}));
	const candsWithScores = filteredCandidates.filter((c) => c.atsScore !== null || c.jobMatch !== null);
	const avgAts = candsWithScores.length > 0 ? Math.round(candsWithScores.reduce((acc, c) => acc + (c.atsScore ?? 0), 0) / candsWithScores.length) : 0;
	const avgJobMatch = candsWithScores.length > 0 ? Math.round(candsWithScores.reduce((acc, c) => acc + (c.jobMatch ?? 0), 0) / candsWithScores.length) : 0;
	const avgExp = filteredCandidates.length > 0 ? Math.min(100, Math.round(filteredCandidates.reduce((acc, c) => acc + (c.yearsExperience || 0), 0) / filteredCandidates.length * 10)) : 0;
	const feedbackList = filteredCandidates.flatMap((c) => c.feedback || []);
	const avgFeedbackRating = feedbackList.length > 0 ? Math.round(feedbackList.reduce((acc, f) => acc + (f.rating || 0), 0) / feedbackList.length * 20) : 0;
	const hasQualityData = avgAts > 0 || avgExp > 0 || avgFeedbackRating > 0 || avgJobMatch > 0;
	const quality = [
		{
			axis: "ATS Match",
			v: avgAts
		},
		{
			axis: "Experience",
			v: avgExp
		},
		{
			axis: "Interview Feedback",
			v: avgFeedbackRating
		},
		{
			axis: "Communication",
			v: avgFeedbackRating
		},
		{
			axis: "Leadership",
			v: Math.max(0, avgFeedbackRating - 10)
		},
		{
			axis: "Role Fit",
			v: avgJobMatch
		}
	];
	const interviewerStats = {};
	filteredInterviews.forEach((iv) => {
		const name = iv.interviewer?.trim() || "Unassigned";
		if (!interviewerStats[name]) interviewerStats[name] = {
			interviews: 0,
			hired: 0
		};
		interviewerStats[name].interviews += 1;
		const cand = filteredCandidates.find((c) => c.id === iv.candidateId);
		if (cand && cand.stage === "hired") interviewerStats[name].hired += 1;
	});
	const recruiterPerf = Object.entries(interviewerStats).map(([name, data]) => ({
		name,
		interviews: data.interviews,
		hired: data.hired
	}));
	const monthlyData = {};
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
	filteredCandidates.forEach((c) => {
		const date = new Date(c.appliedAt);
		const month = monthsOrder[isNaN(date.getTime()) ? 0 : date.getMonth()];
		if (!monthlyData[month]) monthlyData[month] = {
			hires: 0,
			applications: 0,
			cost: 0
		};
		monthlyData[month].applications += 1;
		if (c.stage === "hired") monthlyData[month].hires += 1;
	});
	filteredOffers.forEach((o) => {
		const dateStr = o.joiningDate || o.sentAt;
		if (dateStr) {
			const date = new Date(dateStr);
			const month = monthsOrder[isNaN(date.getTime()) ? 0 : date.getMonth()];
			if (!monthlyData[month]) monthlyData[month] = {
				hires: 0,
				applications: 0,
				cost: 0
			};
			if (o.status === "accepted" || o.status === "sent") monthlyData[month].cost += Number(o.salary || 0);
		}
	});
	const currentMonthIdx = (/* @__PURE__ */ new Date()).getMonth();
	const monthly = Array.from({ length: 6 }, (_, i) => {
		const m = monthsOrder[(currentMonthIdx - 5 + i + 12) % 12];
		const data = monthlyData[m] || {
			hires: 0,
			applications: 0,
			cost: 0
		};
		return {
			m,
			hires: data.hires,
			cost: data.cost
		};
	});
	const deptTimeToHire = {};
	filteredCandidates.filter((c) => c.stage === "hired").forEach((c) => {
		const dept = jobs.find((j) => j.id === c.jobId)?.department || "General";
		const appTime = new Date(c.appliedAt).getTime();
		const hiredTimeline = c.timeline?.find((t) => t.title.toLowerCase().includes("hired") || t.title.toLowerCase().includes("moved to hired"));
		const hiredTime = hiredTimeline ? new Date(hiredTimeline.at).getTime() : (/* @__PURE__ */ new Date()).getTime();
		const diffDays = Math.max(1, Math.round((hiredTime - appTime) / (1e3 * 60 * 60 * 24)));
		if (!deptTimeToHire[dept]) deptTimeToHire[dept] = {
			totalDays: 0,
			count: 0
		};
		deptTimeToHire[dept].totalDays += diffDays;
		deptTimeToHire[dept].count += 1;
	});
	const timeToHire = Object.entries(deptTimeToHire).map(([dept, data]) => ({
		dept,
		days: Math.round(data.totalDays / data.count)
	}));
	const totalHiredDays = Object.values(deptTimeToHire).reduce((a, b) => a + b.totalDays, 0);
	const totalHiredCount = Object.values(deptTimeToHire).reduce((a, b) => a + b.count, 0);
	const avgTimeToHireDays = totalHiredCount > 0 ? Math.round(totalHiredDays / totalHiredCount) : 0;
	const handleExport = (format) => {
		if (filteredCandidates.length === 0) {
			toast.warning("No candidate data to export for current filters.");
			return;
		}
		const csvContent = filteredCandidates.map((c) => `"${c.name}","${c.appliedPosition}","${c.stage}","${c.source}","${c.atsScore || 0}","${c.appliedAt}"`).join("\n");
		const blob = new Blob([`"Candidate Name","Role","Stage","Source","ATS Score","Applied At"\n` + csvContent], { type: "text/csv" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `Recruitment-Analytics-${dateRange.replace(/\s+/g, "-")}.${format.toLowerCase()}`;
		a.click();
		URL.revokeObjectURL(url);
		toast.success(`Exported Recruitment Analytics as ${format}!`);
	};
	if (loading && candidates.length === 0 && jobs.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Loader, {
			variant: "panel",
			label: "Loading recruitment analytics from API...",
			skeletonRows: 6
		})
	});
	if (error && candidates.length === 0 && jobs.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-2xl border border-border bg-card/60 p-8 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-destructive",
				children: error
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				className: "mt-4",
				onClick: () => refreshAll(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-2 h-4 w-4" }), "Retry"]
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-center justify-end gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => handleExport("CSV"),
				className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/60 text-xs font-medium text-foreground hover:bg-accent cursor-pointer shadow-sm transition-colors",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3 w-3" }), "Export CSV"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => handleExport("Excel"),
				className: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card/60 text-xs font-medium text-foreground hover:bg-accent cursor-pointer shadow-sm transition-colors",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3 w-3" }), "Export Excel"]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium",
								children: "Total Applicants"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-indigo-400" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-2xl font-bold tracking-tight text-foreground font-display",
							children: totalApplicants
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-[11px] text-muted-foreground",
							children: [
								hiredCount,
								" hired (",
								hireRate,
								"% conversion)"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium",
								children: "Active Pipeline"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4 text-sky-400" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-2xl font-bold tracking-tight text-foreground font-display",
							children: activePipelineCount
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-[11px] text-muted-foreground",
							children: "In screening, interview, or offer stage"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium",
								children: "Offers Acceptance"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 text-emerald-400" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 text-2xl font-bold tracking-tight text-foreground font-display",
							children: [offerAcceptancePct, "%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 text-[11px] text-muted-foreground",
							children: [
								acceptedOffersCount,
								" of ",
								filteredOffers.length,
								" offers accepted"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/50 p-4 backdrop-blur-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-medium",
								children: "Avg. Time to Hire"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4 text-amber-400" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 text-2xl font-bold tracking-tight text-foreground font-display",
							children: avgTimeToHireDays > 0 ? `${avgTimeToHireDays}d` : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-1 text-[11px] text-muted-foreground",
							children: totalHiredCount > 0 ? `Across ${totalHiredCount} hires` : "No hire timeline recorded"
						})
					]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/40 p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground font-medium",
					children: "Date Range:"
				}), DATE_RANGES.map((range) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setDateRange(range),
					className: `px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${dateRange === range ? "bg-foreground text-background font-semibold shadow-xs" : "text-muted-foreground hover:bg-accent"}`,
					children: range
				}, range))]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground font-medium",
					children: "Department:"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: selectedDept,
					onChange: (e) => setSelectedDept(e.target.value),
					className: "rounded-md border border-border bg-background px-2.5 py-1 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-ring",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: "all",
						children: [
							"All Departments (",
							availableDepartments.length,
							")"
						]
					}), availableDepartments.map((dept) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: dept,
						children: dept
					}, dept))]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 lg:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Hiring Funnel",
					className: "lg:col-span-2",
					children: totalApplicants > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 260,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: funnel,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(0.5 0.02 264 / 0.15)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "stage",
									className: "text-[10px] text-muted-foreground",
									tickLine: false,
									axisLine: false,
									stroke: "currentColor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									className: "text-xs text-muted-foreground",
									tickLine: false,
									axisLine: false,
									stroke: "currentColor",
									allowDecimals: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 8
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "count",
									radius: [
										8,
										8,
										0,
										0
									],
									children: funnel.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
								})
							]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyChartState, { message: "No candidate applications in this filter range." })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Source of Hire",
					children: bySource.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 260,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: bySource,
								dataKey: "value",
								nameKey: "name",
								cx: "50%",
								cy: "50%",
								outerRadius: 90,
								children: bySource.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderRadius: 8
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } })
						] })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyChartState, { message: "No candidate sourcing channels recorded." })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Department Hiring",
					children: byDept.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 260,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: byDept,
							layout: "vertical",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(0.5 0.02 264 / 0.15)",
									horizontal: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									type: "number",
									className: "text-xs text-muted-foreground",
									tickLine: false,
									axisLine: false,
									stroke: "currentColor",
									allowDecimals: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									dataKey: "name",
									type: "category",
									className: "text-xs text-muted-foreground",
									tickLine: false,
									axisLine: false,
									stroke: "currentColor",
									width: 90
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 8
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "value",
									fill: COLORS[0],
									radius: [
										0,
										6,
										6,
										0
									]
								})
							]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyChartState, { message: "No department hiring statistics available." })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Offer Acceptance",
					children: totalOffersCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 260,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pie, {
								data: acceptanceData,
								dataKey: "value",
								nameKey: "name",
								cx: "50%",
								cy: "50%",
								innerRadius: 50,
								outerRadius: 90,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: "oklch(0.7 0.18 150)" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: "oklch(0.65 0.2 25)" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: "oklch(0.75 0.18 60)" })
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "var(--card)",
								border: "1px solid var(--border)",
								borderRadius: 8
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } })
						] })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyChartState, { message: "No candidate offers generated yet." })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Interview Conversion (%)",
					children: totalApplicants > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 260,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: interviewConv,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(0.5 0.02 264 / 0.15)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "stage",
									className: "text-xs text-muted-foreground",
									tickLine: false,
									axisLine: false,
									stroke: "currentColor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									className: "text-xs text-muted-foreground",
									tickLine: false,
									axisLine: false,
									stroke: "currentColor",
									domain: [0, 100]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 8
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									dataKey: "value",
									name: "Conversion %",
									stroke: COLORS[0],
									strokeWidth: 2,
									dot: {
										fill: COLORS[0],
										r: 4
									}
								})
							]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyChartState, { message: "No candidate funnel data to calculate conversion." })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Candidate Quality Evaluation",
					children: hasQualityData ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 260,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadarChart, {
							data: quality,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarGrid, { stroke: "oklch(0.5 0.02 264 / 0.25)" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarAngleAxis, {
									dataKey: "axis",
									className: "text-xs text-muted-foreground"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PolarRadiusAxis, {
									stroke: "currentColor",
									tick: false,
									axisLine: false,
									domain: [0, 100]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Radar, {
									dataKey: "v",
									name: "Score",
									stroke: COLORS[0],
									fill: COLORS[0],
									fillOpacity: .35
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 8
								} })
							]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyChartState, { message: "Evaluations and ATS scores will appear as candidates are assessed." })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Time to Hire (days)",
					children: timeToHire.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 260,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: timeToHire,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(0.5 0.02 264 / 0.15)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "dept",
									className: "text-xs text-muted-foreground",
									tickLine: false,
									axisLine: false,
									stroke: "currentColor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									className: "text-xs text-muted-foreground",
									tickLine: false,
									axisLine: false,
									stroke: "currentColor",
									allowDecimals: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 8
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "days",
									fill: COLORS[3],
									radius: [
										8,
										8,
										0,
										0
									]
								})
							]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyChartState, { message: "No candidates marked as hired yet to compute time-to-hire." })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Recruiter & Interviewer Activity",
					className: "lg:col-span-2",
					children: recruiterPerf.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 260,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: recruiterPerf,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(0.5 0.02 264 / 0.15)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "name",
									className: "text-xs text-muted-foreground",
									tickLine: false,
									axisLine: false,
									stroke: "currentColor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									className: "text-xs text-muted-foreground",
									tickLine: false,
									axisLine: false,
									stroke: "currentColor",
									allowDecimals: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
									background: "var(--card)",
									border: "1px solid var(--border)",
									borderRadius: 8
								} }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "interviews",
									name: "Interviews Conducted",
									fill: COLORS[1],
									radius: [
										6,
										6,
										0,
										0
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "hired",
									name: "Successful Hires",
									fill: COLORS[2],
									radius: [
										6,
										6,
										0,
										0
									]
								})
							]
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyChartState, { message: "No interviewer assignments or scorecard submissions recorded yet." })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "Monthly Hiring & Offer CTC Spend",
					className: "lg:col-span-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: 260,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: monthly,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									stroke: "oklch(0.5 0.02 264 / 0.15)",
									vertical: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "m",
									className: "text-xs text-muted-foreground",
									tickLine: false,
									axisLine: false,
									stroke: "currentColor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									yAxisId: "left",
									className: "text-xs text-muted-foreground",
									tickLine: false,
									axisLine: false,
									stroke: "currentColor",
									allowDecimals: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									yAxisId: "right",
									orientation: "right",
									className: "text-xs text-muted-foreground",
									tickLine: false,
									axisLine: false,
									stroke: "currentColor",
									tickFormatter: (val) => val >= 1e3 ? `₹${(val / 1e3).toFixed(0)}k` : `₹${val}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										background: "var(--card)",
										border: "1px solid var(--border)",
										borderRadius: 8
									},
									formatter: (value, name) => [name === "Offer CTC Spend" ? `₹${Number(value || 0).toLocaleString("en-IN")}` : value, name]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { wrapperStyle: { fontSize: 11 } }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									yAxisId: "left",
									dataKey: "hires",
									name: "Hires",
									stroke: COLORS[0],
									strokeWidth: 2,
									dot: {
										fill: COLORS[0],
										r: 4
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									yAxisId: "right",
									dataKey: "cost",
									name: "Offer CTC Spend",
									stroke: COLORS[4],
									strokeWidth: 2,
									dot: {
										fill: COLORS[4],
										r: 4
									}
								})
							]
						})
					})
				})
			]
		})
	] });
}
function Card({ title, children, className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-2 font-display text-sm font-semibold",
			children: title
		}), children]
	});
}
function EmptyChartState({ message }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-[260px] flex-col items-center justify-center text-center p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-full bg-muted/30 p-3 mb-2 text-muted-foreground/60",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartColumn, { className: "h-6 w-6 opacity-40" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground font-medium max-w-xs leading-relaxed",
			children: message
		})]
	});
}
//#endregion
export { RecruitmentAnalyticsPage, RecruitmentAnalyticsPage as default };
