import { n as STAGE_LABEL, t as STAGES } from "./types-CxbMeuye.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-Z73MyXDx.js
var CHART_COLORS = [
	"oklch(0.65 0.22 285)",
	"oklch(0.7 0.18 200)",
	"oklch(0.74 0.16 140)",
	"oklch(0.75 0.18 60)",
	"oklch(0.68 0.2 25)",
	"oklch(0.62 0.18 320)"
];
var SHORTLISTED_STAGES = [
	"assessment",
	"interview",
	"technical",
	"hr"
];
var MONTH_LABELS = [
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
var CHART_TOOLTIP_STYLE = {
	background: "var(--card)",
	border: "1px solid var(--border)",
	borderRadius: 8
};
function isHiredTimelineEvent(title) {
	const normalized = title.toLowerCase();
	return normalized.includes("hired") || normalized.includes("moved to hired");
}
function findHiredTimestamp(timeline) {
	const hiredEvent = timeline.find((t) => isHiredTimelineEvent(t.title));
	return hiredEvent ? new Date(hiredEvent.at).getTime() : null;
}
function computeAverageTimeToHire(candidates) {
	const hiredCandidates = candidates.filter((c) => c.stage === "hired");
	if (hiredCandidates.length === 0) return 0;
	const totalDays = hiredCandidates.reduce((acc, candidate) => {
		const appliedAt = new Date(candidate.appliedAt).getTime();
		const hiredAt = findHiredTimestamp(candidate.timeline) ?? Date.now();
		return acc + Math.max(1, Math.round((hiredAt - appliedAt) / (1e3 * 60 * 60 * 24)));
	}, 0);
	return Math.round(totalDays / hiredCandidates.length);
}
function computeDashboardStats(jobs, candidates, interviews, offers) {
	return {
		totalJobs: jobs.length,
		activeJobs: jobs.filter((j) => j.status === "active").length,
		draftJobs: jobs.filter((j) => j.status === "draft").length,
		closedJobs: jobs.filter((j) => j.status === "closed").length,
		totalCandidates: candidates.length,
		shortlisted: candidates.filter((c) => SHORTLISTED_STAGES.includes(c.stage)).length,
		interviewScheduled: interviews.filter((i) => i.status === "scheduled").length,
		selected: candidates.filter((c) => c.stage === "hired").length,
		rejected: candidates.filter((c) => c.stage === "rejected").length,
		offersSent: offers.length,
		offersAccepted: offers.filter((o) => o.status === "accepted").length,
		timeToHireDays: computeAverageTimeToHire(candidates)
	};
}
function buildFunnelData(candidates) {
	return STAGES.filter((stage) => stage !== "rejected").map((stage) => ({
		stage: STAGE_LABEL[stage],
		count: candidates.filter((c) => c.stage === stage).length
	}));
}
function buildDepartmentHiringData(jobs) {
	const totals = jobs.reduce((acc, job) => {
		acc[job.department] = (acc[job.department] || 0) + job.applicants;
		return acc;
	}, {});
	return Object.entries(totals).map(([name, value]) => ({
		name,
		value
	}));
}
function buildHiringTrendData(candidates, offers, monthsBack = 6) {
	const data = [];
	for (let i = monthsBack - 1; i >= 0; i--) {
		const date = /* @__PURE__ */ new Date();
		date.setMonth(date.getMonth() - i);
		const monthIndex = date.getMonth();
		const year = date.getFullYear();
		const monthLabel = MONTH_LABELS[monthIndex];
		const hires = candidates.filter((candidate) => {
			if (candidate.stage !== "hired") return false;
			const applied = new Date(candidate.appliedAt);
			return applied.getMonth() === monthIndex && applied.getFullYear() === year;
		}).length;
		const offerCount = offers.filter((offer) => {
			const offerDate = new Date(offer.sentAt || offer.joiningDate);
			return offerDate.getMonth() === monthIndex && offerDate.getFullYear() === year;
		}).length;
		data.push({
			m: monthLabel,
			hires,
			offers: offerCount
		});
	}
	return data;
}
function buildRecentActivity(candidates, limit = 8) {
	return candidates.flatMap((candidate) => candidate.timeline.map((event) => ({
		...event,
		who: candidate.name,
		jobTitle: candidate.appliedPosition
	}))).sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, limit);
}
//#endregion
export { buildHiringTrendData as a, computeDashboardStats as c, buildFunnelData as i, CHART_TOOLTIP_STYLE as n, buildRecentActivity as o, buildDepartmentHiringData as r, computeAverageTimeToHire as s, CHART_COLORS as t };
