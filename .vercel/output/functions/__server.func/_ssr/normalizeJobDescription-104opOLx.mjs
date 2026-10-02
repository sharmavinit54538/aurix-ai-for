//#region node_modules/.nitro/vite/services/ssr/assets/normalizeJobDescription-104opOLx.js
function isNonEmpty(val) {
	return typeof val === "string" && val.trim().length > 0;
}
function toStringArray(val) {
	if (Array.isArray(val)) {
		const mapped = val.map((v) => typeof v === "string" ? v.trim() : typeof v === "object" && v ? JSON.stringify(v) : String(v)).filter(Boolean);
		return mapped.length > 0 ? mapped : void 0;
	}
	if (typeof val === "string" && val.trim()) return val.split("\n").map((s) => s.trim()).filter(Boolean);
}
function toNumber(val) {
	if (typeof val === "number" && !Number.isNaN(val)) return val;
	if (typeof val === "string") {
		const n = Number(val);
		if (!Number.isNaN(n)) return n;
	}
}
function tryParseJSON(raw) {
	try {
		const parsed = JSON.parse(raw);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) return parsed;
	} catch {}
	return null;
}
function normalizeJobDescription(raw) {
	let obj = null;
	if (typeof raw === "string") {
		obj = tryParseJSON(raw);
		if (!obj) return {
			isStructured: false,
			plainText: raw
		};
	} else if (raw && typeof raw === "object" && !Array.isArray(raw)) obj = raw;
	if (!obj) return {
		isStructured: false,
		plainText: raw != null ? String(raw) : void 0
	};
	const experience = (() => {
		const exp = obj.experience;
		if (exp && typeof exp === "object" && !Array.isArray(exp)) {
			const e = exp;
			return {
				minYears: toNumber(e.min_years),
				maxYears: toNumber(e.max_years),
				text: isNonEmpty(e.text) ? e.text : void 0
			};
		}
		if (isNonEmpty(exp)) return { text: exp };
	})();
	const salaryRange = (() => {
		const s = obj.suggested_salary_range ?? obj.salary_range ?? obj.salary;
		if (s == null) return void 0;
		if (typeof s === "object" && !Array.isArray(s)) {
			const sr = s;
			const min = toNumber(sr.min ?? sr.min_salary);
			const max = toNumber(sr.max ?? sr.max_salary);
			const currency = isNonEmpty(sr.currency) ? sr.currency : void 0;
			const text = isNonEmpty(sr.text) ? sr.text : void 0;
			if (min || max || text) return {
				min,
				max,
				currency,
				text
			};
		}
		if (isNonEmpty(s)) return { text: s };
	})();
	const hiringProcess = toStringArray(obj.hiring_process_steps ?? obj.hiring_process ?? obj.hiringProcess);
	return {
		isStructured: true,
		title: isNonEmpty(obj.title) ? obj.title : void 0,
		summary: isNonEmpty(obj.summary) ? obj.summary : void 0,
		aboutRole: isNonEmpty(obj.about_role ?? obj.aboutRole) ? String(obj.about_role ?? obj.aboutRole) : void 0,
		responsibilities: toStringArray(obj.responsibilities),
		requiredSkills: toStringArray(obj.required_skills ?? obj.requiredSkills),
		preferredSkills: toStringArray(obj.preferred_skills ?? obj.preferredSkills),
		experience,
		education: toStringArray(obj.education),
		qualifications: toStringArray(obj.qualifications),
		niceToHave: toStringArray(obj.nice_to_have ?? obj.niceToHave),
		benefits: toStringArray(obj.benefits),
		location: isNonEmpty(obj.location) ? obj.location : void 0,
		workMode: isNonEmpty(obj.work_mode ?? obj.workMode) ? String(obj.work_mode ?? obj.workMode) : void 0,
		employmentType: isNonEmpty(obj.employment_type ?? obj.employmentType) ? String(obj.employment_type ?? obj.employmentType) : void 0,
		department: isNonEmpty(obj.department) ? obj.department : void 0,
		seniorityLevel: isNonEmpty(obj.seniority_level ?? obj.seniorityLevel) ? String(obj.seniority_level ?? obj.seniorityLevel) : void 0,
		atsKeywords: toStringArray(obj.ats_keywords ?? obj.atsKeywords),
		salaryRange,
		hiringProcess
	};
}
//#endregion
export { normalizeJobDescription as t };
