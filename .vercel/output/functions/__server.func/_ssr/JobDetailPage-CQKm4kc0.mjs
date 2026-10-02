import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, x as useParams, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Ar as Check, Br as Calendar, Bt as MapPin, Ct as Pause, E as TrendingUp, H as Sparkles, It as MessageSquare, Jr as Briefcase, K as Shield, Kr as Building, O as TreePalm, On as Gift, P as Target, R as Star, Sr as CircleCheck, Tr as CircleAlert, Wn as FileCode, Wr as CalendarClock, Xn as ExternalLink, _ as UserPlus, a as X, an as Layers, at as Save, bn as GraduationCap, bt as Pencil, dt as QrCode, ei as BookOpen, er as Download, ft as Printer, gn as HeartPulse, gt as Play, hn as Heart, i as Zap, k as Trash2, kn as Gem, li as ArrowRight, lt as RefreshCw, oi as Award, or as Copy, p as Users, pi as Archive, pn as House, ti as BookOpenCheck, tr as DollarSign, tt as Scan, xn as Globe } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { c as useAurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as api, i as BASE_URL, l as getTokens } from "./apiInstance-C5A0vaLH.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { C as Legend, S as Tooltip, a as PieChart, b as Cell, c as YAxis, f as CartesianGrid, h as Pie, l as XAxis, r as AreaChart, u as Area, x as ResponsiveContainer } from "../_libs/recharts+[...].mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { t as require_lib } from "../_libs/qrcode.mjs";
import { t as normalizeJobDescription } from "./normalizeJobDescription-104opOLx.mjs";
import { c as fmtMoney, s as fmtDate, t as CandidateAvatar } from "./Bits-BEiUi0-S.mjs";
import { t as Switch } from "./switch-C_mzcXif.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/JobDetailPage-CQKm4kc0.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_lib = /* @__PURE__ */ __toESM(require_lib());
function JDSection({ title, icon: Icon, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
			className: "mb-4 flex items-center gap-2 font-display text-sm font-semibold text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-primary/70" }), title]
		}), children]
	});
}
function BulletList({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2.5 text-xs leading-relaxed text-muted-foreground",
		children: items.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex gap-2.5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
		}, i))
	});
}
function SkillChips({ skills, variant = "default" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-wrap gap-2",
		children: skills.map((skill, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant,
			className: `text-[11px] font-medium px-2.5 py-1 transition-colors ${variant === "default" ? "bg-primary/10 text-primary hover:bg-primary/20 border-primary/20" : "border-border bg-background/50 text-muted-foreground hover:bg-accent/40"}`,
			children: skill
		}, i))
	});
}
var BENEFIT_ICON_MAP = [
	{
		keyword: "compensation",
		icon: DollarSign,
		color: "text-emerald-500 bg-emerald-500/15"
	},
	{
		keyword: "salary",
		icon: DollarSign,
		color: "text-emerald-500 bg-emerald-500/15"
	},
	{
		keyword: "bonus",
		icon: DollarSign,
		color: "text-emerald-500 bg-emerald-500/15"
	},
	{
		keyword: "health",
		icon: HeartPulse,
		color: "text-rose-500 bg-rose-500/15"
	},
	{
		keyword: "medical",
		icon: HeartPulse,
		color: "text-rose-500 bg-rose-500/15"
	},
	{
		keyword: "wellness",
		icon: HeartPulse,
		color: "text-rose-500 bg-rose-500/15"
	},
	{
		keyword: "remote",
		icon: House,
		color: "text-sky-500 bg-sky-500/15"
	},
	{
		keyword: "flexible",
		icon: House,
		color: "text-sky-500 bg-sky-500/15"
	},
	{
		keyword: "hybrid",
		icon: House,
		color: "text-sky-500 bg-sky-500/15"
	},
	{
		keyword: "learning",
		icon: BookOpenCheck,
		color: "text-violet-500 bg-violet-500/15"
	},
	{
		keyword: "growth",
		icon: BookOpenCheck,
		color: "text-violet-500 bg-violet-500/15"
	},
	{
		keyword: "professional",
		icon: BookOpenCheck,
		color: "text-violet-500 bg-violet-500/15"
	},
	{
		keyword: "insurance",
		icon: Shield,
		color: "text-amber-500 bg-amber-500/15"
	},
	{
		keyword: "vacation",
		icon: TreePalm,
		color: "text-teal-500 bg-teal-500/15"
	},
	{
		keyword: "leave",
		icon: TreePalm,
		color: "text-teal-500 bg-teal-500/15"
	},
	{
		keyword: "retirement",
		icon: Gem,
		color: "text-indigo-500 bg-indigo-500/15"
	},
	{
		keyword: "stock",
		icon: TrendingUp,
		color: "text-cyan-500 bg-cyan-500/15"
	},
	{
		keyword: "equity",
		icon: TrendingUp,
		color: "text-cyan-500 bg-cyan-500/15"
	}
];
function getBenefitIcon(text) {
	const lower = text.toLowerCase();
	for (const entry of BENEFIT_ICON_MAP) if (lower.includes(entry.keyword)) return {
		Icon: entry.icon,
		color: entry.color
	};
	return {
		Icon: Gift,
		color: "text-primary bg-primary/15"
	};
}
function BenefitsList({ benefits }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 sm:grid-cols-2",
		children: benefits.map((benefit, i) => {
			const { Icon, color } = getBenefitIcon(benefit);
			const [iconColor, bgColor] = color.split(" ");
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3 rounded-xl border border-border/60 bg-background/40 p-3.5 transition-colors hover:bg-accent/20",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `grid h-8 w-8 shrink-0 place-items-center rounded-lg ${bgColor}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${iconColor}` })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs leading-relaxed text-muted-foreground pt-1.5",
					children: benefit
				})]
			}, i);
		})
	});
}
function JobDetailsGrid({ jd }) {
	const details = [
		{
			label: "Location",
			value: jd.location,
			icon: MapPin
		},
		{
			label: "Work Mode",
			value: jd.workMode,
			icon: Building
		},
		{
			label: "Employment Type",
			value: jd.employmentType,
			icon: Calendar
		},
		{
			label: "Department",
			value: jd.department,
			icon: Layers
		},
		{
			label: "Seniority",
			value: jd.seniorityLevel,
			icon: TrendingUp
		},
		{
			label: "Experience",
			value: jd.experience?.text ?? (jd.experience?.minYears != null && jd.experience?.maxYears != null ? `${jd.experience.minYears}–${jd.experience.maxYears} years` : void 0),
			icon: Award
		}
	].filter((d) => d.value);
	if (details.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDSection, {
		title: "Job Details",
		icon: Briefcase,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: details.map((d) => {
				const I = d.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-xl border border-border/50 bg-background/40 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { className: "h-4 w-4 text-primary/70" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-[10px] uppercase tracking-wider text-muted-foreground",
						children: d.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-semibold text-foreground",
						children: d.value
					})] })]
				}, d.label);
			})
		})
	});
}
function HiringTimeline({ steps }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative flex flex-col gap-0",
		children: steps.map((step, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative flex items-start gap-4 pb-6 last:pb-0",
			children: [
				i < steps.length - 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute left-[15px] top-[32px] h-[calc(100%-20px)] w-px bg-gradient-to-b from-primary/40 to-primary/10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary ring-2 ring-primary/20",
					children: String(i + 1).padStart(2, "0")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "min-h-[32px] flex items-center pt-1.5",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs leading-relaxed text-muted-foreground",
						children: step
					})
				})
			]
		}, i))
	});
}
function SalaryDisplay({ salary }) {
	const label = salary.text ?? (salary.min != null && salary.max != null ? `${salary.currency || "₹"}${salary.min.toLocaleString()} – ${salary.currency || "₹"}${salary.max.toLocaleString()}` : salary.min ? `From ${salary.currency || "₹"}${salary.min.toLocaleString()}` : salary.max ? `Up to ${salary.currency || "₹"}${salary.max.toLocaleString()}` : null);
	if (!label) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border/60 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 p-4 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-[10px] uppercase tracking-wider text-muted-foreground mb-1",
			children: "Salary Range"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-lg font-bold text-foreground",
			children: label
		})]
	});
}
function JobDescriptionView({ description, fallback }) {
	const jd = (0, import_react.useMemo)(() => normalizeJobDescription(description), [description]);
	if (!jd.isStructured) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			jd.plainText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDSection, {
				title: "Job Description",
				icon: Briefcase,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs leading-relaxed text-muted-foreground whitespace-pre-line",
					children: jd.plainText
				})
			}),
			fallback?.responsibilities && fallback.responsibilities.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDSection, {
				title: "Key Responsibilities",
				icon: Target,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulletList, { items: fallback.responsibilities })
			}),
			fallback?.requirements && fallback.requirements.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDSection, {
				title: "Qualifications & Requirements",
				icon: BookOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulletList, { items: fallback.requirements })
			}),
			fallback?.skills && fallback.skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDSection, {
				title: "Required Skills",
				icon: Zap,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillChips, { skills: fallback.skills })
			}),
			fallback?.benefits && fallback.benefits.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDSection, {
				title: "Benefits",
				icon: Heart,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitsList, { benefits: fallback.benefits })
			})
		]
	});
	const responsibilities = jd.responsibilities ?? fallback?.responsibilities;
	const requiredSkills = jd.requiredSkills ?? fallback?.skills;
	const benefits = jd.benefits ?? fallback?.benefits;
	const qualifications = jd.qualifications ?? fallback?.requirements;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			jd.summary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDSection, {
				title: "Job Summary",
				icon: Briefcase,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs leading-relaxed text-muted-foreground",
					children: jd.summary
				})
			}),
			jd.aboutRole && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDSection, {
				title: "About the Role",
				icon: Star,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs leading-relaxed text-muted-foreground",
					children: jd.aboutRole
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobDetailsGrid, { jd: {
				...jd,
				location: jd.location ?? fallback?.location,
				workMode: jd.workMode ?? fallback?.workMode,
				employmentType: jd.employmentType ?? fallback?.employmentType,
				department: jd.department ?? fallback?.department,
				experience: jd.experience ?? (fallback?.experience ? { text: fallback.experience } : void 0)
			} }),
			responsibilities && responsibilities.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDSection, {
				title: "Key Responsibilities",
				icon: Target,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulletList, { items: responsibilities })
			}),
			requiredSkills && requiredSkills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDSection, {
				title: "Required Skills",
				icon: Zap,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillChips, { skills: requiredSkills })
			}),
			jd.preferredSkills && jd.preferredSkills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDSection, {
				title: "Preferred Skills",
				icon: Sparkles,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillChips, {
					skills: jd.preferredSkills,
					variant: "outline"
				})
			}),
			jd.experience && (jd.experience.text || jd.experience.minYears != null) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDSection, {
				title: "Experience",
				icon: Award,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border/50 bg-background/40 p-4 text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-lg font-bold text-foreground",
						children: jd.experience.text ?? `${jd.experience.minYears ?? 0}–${jd.experience.maxYears ?? "?"} Years`
					})
				})
			}),
			jd.education && jd.education.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDSection, {
				title: "Education",
				icon: GraduationCap,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulletList, { items: jd.education })
			}),
			qualifications && qualifications.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDSection, {
				title: "Qualifications",
				icon: BookOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulletList, { items: qualifications })
			}),
			jd.niceToHave && jd.niceToHave.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDSection, {
				title: "Nice to Have",
				icon: Sparkles,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BulletList, { items: jd.niceToHave })
			}),
			benefits && benefits.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDSection, {
				title: "Benefits",
				icon: Heart,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BenefitsList, { benefits })
			}),
			jd.salaryRange && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SalaryDisplay, { salary: jd.salaryRange }),
			jd.atsKeywords && jd.atsKeywords.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDSection, {
				title: "ATS Keywords",
				icon: Target,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkillChips, {
					skills: jd.atsKeywords,
					variant: "outline"
				})
			}),
			jd.hiringProcess && jd.hiringProcess.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JDSection, {
				title: "Hiring Process",
				icon: TrendingUp,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HiringTimeline, { steps: jd.hiringProcess })
			})
		]
	});
}
/**
* Centralized utility for constructing public-facing frontend URLs.
*
* In production, uses `VITE_PUBLIC_APP_URL` env variable.
* In the browser (dev or prod), falls back to `window.location.origin`.
* In SSR / non-browser contexts, falls back to the env variable or empty string.
*
* IMPORTANT: This returns the FRONTEND origin, NOT the API origin.
* - Frontend: https://www.ofc360.com  (or whatever the public domain is)
* - API:      https://api.ofc360.com  (separate — do NOT use for public URLs)
*/
/**
* Returns the public application origin (no trailing slash).
*
* Resolution order:
*  1. `VITE_PUBLIC_APP_URL` environment variable
*  2. `window.location.origin` (browser only)
*  3. Empty string (SSR fallback — relative URLs still work)
*/
function getPublicAppUrl() {
	return "https://www.ofc360.com".trim().replace(/\/+$/, "");
}
/**
* Generates the public Job Application URL for a given job.
* @param jobId - The job ID or unique key
* @returns Full URL like `https://www.ofc360.com/jobs/apply/abc123`
*/
function getJobApplicationUrl(jobId) {
	return `${getPublicAppUrl()}/jobs/apply/${jobId}`;
}
/**
* Generates a public job detail URL (for career site / board listings).
* @param jobId - The job ID
* @returns Full URL like `https://www.ofc360.com/jobs/abc123`
*/
function getPublicJobUrl(jobId) {
	return `${getPublicAppUrl()}/jobs/${jobId}`;
}
/**
* Generates an employee referral portal URL for a specific job.
* @param jobId - The job ID
* @returns Full URL like `https://www.ofc360.com/referrals?job=abc123`
*/
function getReferralUrl(jobId) {
	return `${getPublicAppUrl()}/referrals?job=${jobId}`;
}
/**
* Sanitizes a URL that may have been generated by the backend with localhost.
* Replaces any localhost / 127.0.0.1 origin with the correct public app URL.
*
* This is used as a safety net for URLs returned by backend APIs that may
* incorrectly use the server's local origin instead of the public frontend URL.
*/
function sanitizePublicUrl(url) {
	if (!url) return url;
	const localhostPattern = /^https?:\/\/(?:localhost|127\.0\.0\.1|0\.0\.0\.0)(?::\d+)?/i;
	if (localhostPattern.test(url)) return url.replace(localhostPattern, getPublicAppUrl());
	return url;
}
function JobQrModal({ open, onOpenChange, jobId, jobTitle = "Job Opening" }) {
	const { company } = useAurix();
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [pngDataUrl, setPngDataUrl] = (0, import_react.useState)("");
	const [svgString, setSvgString] = (0, import_react.useState)("");
	const [copied, setCopied] = (0, import_react.useState)(false);
	const applyUrl = getJobApplicationUrl(jobId);
	const safeSlug = (jobTitle || "job").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
	const pngFilename = `${safeSlug || "job"}-${jobId}-qr.png`;
	const svgFilename = `${safeSlug || "job"}-${jobId}-qr.svg`;
	const generateQr = (0, import_react.useCallback)(async () => {
		if (!jobId) return;
		setLoading(true);
		setError(null);
		try {
			const pngUrl = await import_lib.toDataURL(applyUrl, {
				width: 600,
				margin: 2,
				errorCorrectionLevel: "H",
				color: {
					dark: "#090d16",
					light: "#ffffff"
				}
			});
			const svg = await import_lib.toString(applyUrl, {
				type: "svg",
				margin: 2,
				errorCorrectionLevel: "H",
				color: {
					dark: "#090d16",
					light: "#ffffff"
				}
			});
			setPngDataUrl(pngUrl);
			setSvgString(svg);
		} catch (err) {
			setError("Unable to generate QR code. Please try again.");
		} finally {
			setLoading(false);
		}
	}, [applyUrl, jobId]);
	(0, import_react.useEffect)(() => {
		if (open) {
			setCopied(false);
			generateQr();
		}
	}, [open, generateQr]);
	const handleCopyLink = async () => {
		try {
			if (typeof navigator !== "undefined" && navigator.clipboard) await navigator.clipboard.writeText(applyUrl);
			else {
				const textarea = document.createElement("textarea");
				textarea.value = applyUrl;
				textarea.style.position = "fixed";
				textarea.style.opacity = "0";
				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand("copy");
				document.body.removeChild(textarea);
			}
			setCopied(true);
			toast.success("Job application link copied to clipboard!");
			setTimeout(() => setCopied(false), 2500);
		} catch {
			toast.error("Failed to copy link. Please copy it manually.");
		}
	};
	const handleDownloadPng = () => {
		if (!pngDataUrl || typeof window === "undefined") return;
		try {
			const link = document.createElement("a");
			link.href = pngDataUrl;
			link.download = pngFilename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			toast.success("QR code downloaded as PNG!");
		} catch {
			toast.error("Failed to download PNG.");
		}
	};
	const handleDownloadSvg = () => {
		if (!svgString || typeof window === "undefined") return;
		try {
			const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = svgFilename;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			URL.revokeObjectURL(url);
			toast.success("QR code downloaded as SVG!");
		} catch {
			toast.error("Failed to download SVG.");
		}
	};
	const handlePrint = () => {
		if (!pngDataUrl || typeof window === "undefined") return;
		const printWindow = window.open("", "_blank");
		if (!printWindow) {
			toast.error("Pop-up blocked. Please allow pop-ups to print the QR code.");
			return;
		}
		const companyLogo = company?.logoDataUrl;
		const companyName = company?.name || "Careers";
		printWindow.document.write(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Job QR Code - ${jobTitle}</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 20mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #0f172a;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 30px 20px;
      text-align: center;
    }
    .print-card {
      border: 2px solid #e2e8f0;
      border-radius: 24px;
      padding: 48px 40px;
      max-width: 440px;
      width: 100%;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
    }
    .company-logo {
      max-height: 48px;
      max-width: 180px;
      object-fit: contain;
      margin-bottom: 16px;
    }
    .company-name {
      font-size: 13px;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 8px;
    }
    .job-title {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.3;
      margin-bottom: 24px;
    }
    .qr-frame {
      background: #ffffff;
      padding: 16px;
      border-radius: 20px;
      border: 1.5px solid #cbd5e1;
      display: inline-block;
      margin-bottom: 20px;
    }
    .qr-frame img {
      display: block;
      width: 240px;
      height: 240px;
    }
    .scan-badge {
      font-size: 15px;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .apply-url {
      font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
      font-size: 11px;
      color: #475569;
      word-break: break-all;
      background: #f8fafc;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
      width: 100%;
    }
    @media print {
      body {
        min-height: auto;
        padding: 0;
      }
      .print-card {
        border: none;
        box-shadow: none;
        padding: 10px 0;
      }
    }
  </style>
</head>
<body>
  <div class="print-card">
    ${companyLogo ? `<img src="${companyLogo}" alt="${companyName} Logo" class="company-logo" />` : `<div class="company-name">${companyName}</div>`}
    <h1 class="job-title">${jobTitle}</h1>
    <div class="qr-frame">
      <img src="${pngDataUrl}" alt="QR code for ${jobTitle} application" />
    </div>
    <div class="scan-badge">Scan to apply</div>
    <div class="apply-url">${applyUrl}</div>
  </div>
  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
        window.close();
      }, 350);
    };
  <\/script>
</body>
</html>`);
		printWindow.document.close();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			overlayClassName: "backdrop-blur-md bg-black/85",
			className: "w-[calc(100vw-1.5rem)] max-w-[360px] max-h-[90vh] overflow-y-auto overflow-x-hidden p-3.5 sm:p-4 gap-0 space-y-2.5 sm:space-y-3 rounded-2xl bg-card border border-border shadow-2xl text-left box-border [&>button]:top-3 [&>button]:right-3 [&>button]:h-6 [&>button]:w-6 [&>button_svg]:h-4 [&>button_svg]:w-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, {
					className: "space-y-0 text-left w-full min-w-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5 pr-6 w-full min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary border border-primary/20",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "h-4 w-4 sm:h-[18px] sm:w-[18px]" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
								className: "text-sm sm:text-base font-semibold text-foreground leading-tight tracking-tight truncate block",
								children: "Generate Job QR Code"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
								className: "text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-normal truncate block",
								children: "Share or print this QR code for instant mobile job application."
							})]
						})]
					})
				}),
				jobTitle && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full min-w-0 flex items-center justify-between rounded-xl bg-muted/60 border border-border px-2.5 py-1.5 gap-2 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1 overflow-hidden",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[9px] uppercase font-semibold tracking-wider text-muted-foreground/80 block leading-tight",
							children: "Target Role"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs sm:text-sm font-semibold text-foreground truncate block leading-tight",
							children: jobTitle
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/25 whitespace-nowrap",
						children: "Public Link"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "w-full min-w-0 pt-0.5 pb-0 flex flex-col items-center",
					children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center py-6 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-muted-foreground",
							children: "Generating QR code..."
						})]
					}) : error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center py-5 space-y-2 text-center w-full min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-8 w-8 place-items-center rounded-full bg-destructive/10 text-destructive",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground max-w-xs",
								children: error
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								onClick: generateQr,
								className: "text-xs gap-1.5 h-8",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3.5 w-3.5" }), " Try Again"]
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center w-full min-w-0",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-xl bg-white shadow-md border border-slate-200/80 inline-flex items-center justify-center aspect-square p-2.5 sm:p-3 w-36 h-36 sm:w-40 sm:h-40",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: pngDataUrl,
								alt: `QR code for ${jobTitle} job application`,
								"aria-label": `QR code for ${jobTitle} job application`,
								className: "w-full h-full object-contain block"
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-foreground/90",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scan, { className: "h-3.5 w-3.5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Scan with phone camera to apply" })]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full min-w-0 flex items-center gap-1.5 sm:gap-2 rounded-xl border border-border bg-muted/60 px-2.5 py-1.5 transition-colors focus-within:border-primary/50 overflow-hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 min-w-0 font-mono text-[10px] sm:text-[11px] text-muted-foreground select-all truncate block overflow-hidden",
						title: applyUrl,
						children: applyUrl
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: copied ? "default" : "secondary",
						className: `h-6 sm:h-7 px-2 sm:px-2.5 text-[11px] sm:text-xs shrink-0 font-medium transition-all ${copied ? "bg-emerald-600 hover:bg-emerald-600 text-white" : "hover:bg-accent"}`,
						onClick: handleCopyLink,
						"aria-label": copied ? "Link copied" : "Copy job application link",
						children: copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" }), "Copied"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-1 h-3 w-3 sm:h-3.5 sm:w-3.5" }), "Copy"] })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-1.5 sm:gap-2 w-full min-w-0 pt-0.5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "h-8 sm:h-9 py-1 px-1 sm:px-2 text-[11px] sm:text-xs font-medium gap-1 sm:gap-1.5 min-w-0 cursor-pointer overflow-hidden",
							onClick: handleDownloadPng,
							disabled: loading || !!error,
							"aria-label": "Download QR code as PNG image",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "PNG"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "outline",
							className: "h-8 sm:h-9 py-1 px-1 sm:px-2 text-[11px] sm:text-xs font-medium gap-1 sm:gap-1.5 min-w-0 cursor-pointer overflow-hidden",
							onClick: handleDownloadSvg,
							disabled: loading || !!error,
							"aria-label": "Download QR code as SVG vector",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCode, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "SVG"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "sm",
							variant: "default",
							className: "h-8 sm:h-9 py-1 px-1 sm:px-2 text-[11px] sm:text-xs font-semibold gap-1 sm:gap-1.5 min-w-0 cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 overflow-hidden",
							onClick: handlePrint,
							disabled: loading || !!error,
							"aria-label": "Print QR code poster",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: "Print"
							})]
						})
					]
				})
			]
		})
	});
}
var CHART_COLORS = [
	"oklch(0.65 0.22 285)",
	"oklch(0.7 0.18 200)",
	"oklch(0.74 0.16 140)",
	"oklch(0.75 0.18 60)",
	"oklch(0.68 0.2 25)"
];
var INITIAL_DISTRIBUTION = [
	{
		key: "linkedin",
		label: "LinkedIn Jobs",
		desc: "Reach active professionals worldwide",
		status: "Connected",
		sync: "2 hours ago",
		active: true,
		url: "https://www.linkedin.com/jobs"
	},
	{
		key: "indeed",
		label: "Indeed",
		desc: "The world's #1 job site",
		status: "Connected",
		sync: "4 hours ago",
		active: true,
		url: "https://www.indeed.com"
	},
	{
		key: "naukri",
		label: "Naukri",
		desc: "India's largest employment platform",
		status: "Not Connected",
		sync: "Never",
		active: false,
		url: "https://www.naukri.com"
	},
	{
		key: "foundit",
		label: "Foundit",
		desc: "Monster India newly upgraded board",
		status: "Not Connected",
		sync: "Never",
		active: false,
		url: "https://www.foundit.in"
	},
	{
		key: "glassdoor",
		label: "Glassdoor",
		desc: "Employer branding & job distribution",
		status: "Connected",
		sync: "1 day ago",
		active: true,
		url: "https://www.glassdoor.com"
	},
	{
		key: "wellfound",
		label: "Wellfound",
		desc: "Reach top startup talent",
		status: "Not Connected",
		sync: "Never",
		active: false,
		url: "https://wellfound.com"
	},
	{
		key: "monster",
		label: "Monster Jobs",
		desc: "Global premium candidate database",
		status: "Not Connected",
		sync: "Never",
		active: false,
		url: "https://www.monster.com"
	},
	{
		key: "ziprecruiter",
		label: "ZipRecruiter",
		desc: "Direct distribution to 100+ job boards",
		status: "Not Connected",
		sync: "Never",
		active: false,
		url: "https://www.ziprecruiter.com"
	},
	{
		key: "google",
		label: "Google Jobs",
		desc: "Index directly in Google Search index",
		status: "Connected",
		sync: "1 hour ago",
		active: true,
		url: "https://google.com/search?q=jobs"
	},
	{
		key: "shine",
		label: "Shine",
		desc: "India's premium resume database search",
		status: "Not Connected",
		sync: "Never",
		active: false,
		url: "https://www.shine.com"
	},
	{
		key: "career_page",
		label: "Company Career Page",
		desc: "Host on your custom career website",
		status: "Connected",
		sync: "Real-time",
		active: true,
		url: "/careers"
	},
	{
		key: "referral",
		label: "Employee Referral Portal",
		desc: "Internal employee sourcing portal",
		status: "Connected",
		sync: "Real-time",
		active: true,
		url: "/referrals"
	}
];
function JobDetailPage() {
	const { jobId } = useParams({ from: "/dashboard/recruitment/jobs/$jobId" });
	const navigate = useNavigate();
	const [job, setJob] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const { candidates: allCandidates, getJob, upsertJob } = useRecruitment();
	const applicants = (0, import_react.useMemo)(() => allCandidates.filter((c) => c.jobId === jobId), [allCandidates, jobId]);
	const [activeTab, setActiveTab] = (0, import_react.useState)("overview");
	const [editing, setEditing] = (0, import_react.useState)(false);
	const [draft, setDraft] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("all");
	const [selectedCandidates, setSelectedCandidates] = (0, import_react.useState)([]);
	const [copiedLink, setCopiedLink] = (0, import_react.useState)(null);
	const [showQr, setShowQr] = (0, import_react.useState)(false);
	const [commentText, setCommentText] = (0, import_react.useState)("");
	const [notesList, setNotesList] = (0, import_react.useState)([{
		author: "Hiring Manager",
		at: "2026-06-29T10:00:00Z",
		text: "Approved budget allocation for hiring this quarter."
	}, {
		author: "HR Recruiter",
		at: "2026-06-29T14:30:00Z",
		text: "Synced job posting details across LinkedIn and Glassdoor."
	}]);
	const [channels, setChannels] = (0, import_react.useState)(INITIAL_DISTRIBUTION);
	const userRole = useAurix().user?.role || "employee";
	const [showPublishModal, setShowPublishModal] = (0, import_react.useState)(false);
	const [showQrModal, setShowQrModal] = (0, import_react.useState)(false);
	const [showExportModal, setShowExportModal] = (0, import_react.useState)(false);
	const [showDuplicateModal, setShowDuplicateModal] = (0, import_react.useState)(false);
	const [showCloseDialog, setShowCloseDialog] = (0, import_react.useState)(false);
	const [publishChannels, setPublishChannels] = (0, import_react.useState)([]);
	const [loadingChannels, setLoadingChannels] = (0, import_react.useState)(false);
	const [exportFormat, setExportFormat] = (0, import_react.useState)("csv");
	const [exportFilter, setExportFilter] = (0, import_react.useState)("all");
	const [exporting, setExporting] = (0, import_react.useState)(false);
	const [dupTitle, setDupTitle] = (0, import_react.useState)("");
	const [dupLocation, setDupLocation] = (0, import_react.useState)("");
	const [dupVacancies, setDupVacancies] = (0, import_react.useState)(1);
	const [dupMinSalary, setDupMinSalary] = (0, import_react.useState)("0");
	const [dupMaxSalary, setDupMaxSalary] = (0, import_react.useState)("0");
	const [duplicating, setDuplicating] = (0, import_react.useState)(false);
	const [closing, setClosing] = (0, import_react.useState)(false);
	const [isCopyingLink, setIsCopyingLink] = (0, import_react.useState)(false);
	const fetchPublishChannels = async () => {
		setLoadingChannels(true);
		try {
			const res = await api.get(`/jobs/${jobId}/publish`);
			if (res.success && res.data) setPublishChannels(res.data);
		} catch (err) {
			toast.error(err.message || "Failed to load publish channels.");
		} finally {
			setLoadingChannels(false);
		}
	};
	(0, import_react.useEffect)(() => {
		if (showPublishModal) fetchPublishChannels();
	}, [showPublishModal]);
	(0, import_react.useEffect)(() => {
		if (showDuplicateModal && job) {
			setDupTitle(job.title + " (Copy)");
			setDupLocation(job.location);
			setDupVacancies(job.vacancies || 1);
			setDupMinSalary(job.salaryMin ? String(job.salaryMin) : "0");
			setDupMaxSalary(job.salaryMax ? String(job.salaryMax) : "0");
		}
	}, [showDuplicateModal, job]);
	(0, import_react.useEffect)(() => {
		let active = true;
		async function fetchJob() {
			setLoading(true);
			setError(null);
			try {
				const data = await getJob(jobId);
				if (active) setJob(data);
			} catch (err) {
				if (active) setError(err.message || "Failed to load job details.");
			} finally {
				if (active) setLoading(false);
			}
		}
		fetchJob();
		return () => {
			active = false;
		};
	}, [jobId]);
	const filteredApplicants = (0, import_react.useMemo)(() => {
		return applicants.filter((c) => {
			const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
			const matchStatus = statusFilter === "all" || c.stage.toLowerCase() === statusFilter.toLowerCase();
			return matchSearch && matchStatus;
		});
	}, [
		applicants,
		search,
		statusFilter
	]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[400px] flex-col items-center justify-center text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted-foreground",
			children: "Loading job details..."
		})]
	});
	if (error || !job) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[400px] flex-col items-center justify-center text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mb-4 h-12 w-12 text-destructive" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-semibold",
				children: "Job Posting Not Found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground mt-1",
				children: error || "The requested job posting could not be found."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard/recruitment/jobs",
					children: "Back to Jobs List"
				})
			})
		]
	});
	function startEdit() {
		setDraft({ ...job });
		setEditing(true);
	}
	function cancelEdit() {
		setDraft(null);
		setEditing(false);
	}
	async function save() {
		if (draft) try {
			await upsertJob(draft);
			setJob(draft);
			setEditing(false);
		} catch (err) {
			alert("Failed to save job changes: " + (err.message || err));
		}
	}
	const handleToggleChannel = async (channelName, currentStatus) => {
		try {
			const newStatus = !currentStatus;
			const res = await api.post(`/jobs/${jobId}/publish`, {
				channel_name: channelName,
				is_active: newStatus
			});
			if (res.success && res.data) {
				setPublishChannels((prev) => {
					const updated = prev.map((c) => c.channel_name === channelName ? res.data : c);
					const anyActive = updated.some((c) => c.is_active);
					if (job) setJob({
						...job,
						status: anyActive ? "published" : "draft"
					});
					return updated;
				});
				toast.success(`${channelName.replace("_", " ").toUpperCase()} ${newStatus ? "published" : "unpublished"} successfully!`);
			}
		} catch (err) {
			toast.error(err.message || "Failed to update channel status.");
		}
	};
	const handleCopySourcingLink = async () => {
		setIsCopyingLink(true);
		try {
			let applyUrl = "";
			try {
				const res = await api.get(`/jobs/${jobId}/sourcing-link`);
				const serverUrl = res.data?.url || res?.url;
				if (serverUrl) applyUrl = sanitizePublicUrl(serverUrl);
			} catch {
				applyUrl = getJobApplicationUrl(jobId);
			}
			if (!applyUrl) applyUrl = getJobApplicationUrl(jobId);
			if (typeof navigator !== "undefined" && navigator.clipboard) await navigator.clipboard.writeText(applyUrl);
			toast.success("Job application link copied to clipboard!");
		} catch (err) {
			toast.error(err?.message || "Failed to copy sourcing link.");
		} finally {
			setIsCopyingLink(false);
		}
	};
	const handleExportApplicants = async () => {
		setExporting(true);
		try {
			const token = getTokens()?.accessToken || "";
			const url = `${BASE_URL}/jobs/${jobId}/applicants/export?format=${exportFormat}&filter=${exportFilter}`;
			const response = await fetch(url, { headers: { "Authorization": `Bearer ${token}` } });
			if (!response.ok) throw new Error("Export failed.");
			const blob = await response.blob();
			const downloadUrl = window.URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = downloadUrl;
			const ext = exportFormat === "excel" ? "xlsx" : exportFormat;
			link.setAttribute("download", `job_${jobId}_applicants_${exportFilter}.${ext}`);
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
			window.URL.revokeObjectURL(downloadUrl);
			toast.success("Applicants exported successfully!");
			setShowExportModal(false);
		} catch (err) {
			toast.error(err.message || "Failed to export applicants.");
		} finally {
			setExporting(false);
		}
	};
	const handleCreateDuplicate = async () => {
		setDuplicating(true);
		try {
			const res = await api.post(`/jobs/${jobId}/duplicate`, {
				title: dupTitle,
				location: dupLocation,
				vacancies: dupVacancies,
				min_salary: parseFloat(dupMinSalary) || 0,
				max_salary: parseFloat(dupMaxSalary) || 0
			});
			if (res.success && res.data) {
				toast.success("Job duplicated successfully!");
				setShowDuplicateModal(false);
				navigate({ to: `/dashboard/recruitment/jobs/${res.data.id}` });
			} else throw new Error(res.message || "Duplication failed.");
		} catch (err) {
			toast.error(err.message || "Failed to duplicate job.");
		} finally {
			setDuplicating(false);
		}
	};
	const handleSync = (key) => {
		setChannels((prev) => prev.map((c) => c.key === key ? {
			...c,
			sync: "Just now"
		} : c));
	};
	const handleTogglePlatform = (key) => {
		setChannels((prev) => prev.map((c) => c.key === key ? {
			...c,
			active: !c.active,
			status: c.active ? "Not Connected" : "Connected",
			sync: c.active ? "Never" : "Just now"
		} : c));
	};
	const handleConfirmCloseJob = async () => {
		setClosing(true);
		try {
			const res = await api.post(`/jobs/${jobId}/close`);
			if (res.success) {
				setJob((prev) => prev ? {
					...prev,
					status: "closed"
				} : null);
				toast.success("Job closed successfully!");
				setShowCloseDialog(false);
			} else throw new Error(res.message || "Failed to close job.");
		} catch (err) {
			toast.error(err.message || "Failed to close job.");
		} finally {
			setClosing(false);
		}
	};
	const togglePause = async () => {
		if (!job) return;
		const isPublished = job.status.toLowerCase() === "published";
		try {
			if (isPublished) {
				const res = await api.post(`/jobs/${jobId}/draft`);
				if (res.success && res.data) {
					setJob(res.data);
					toast.success("Job paused and set to Draft.");
				}
			} else if ((await api.post(`/jobs/${jobId}/publish`, {
				channel_name: "career_site",
				is_active: true
			})).success) {
				setJob(await getJob(jobId));
				toast.success("Job published on Career Site.");
			}
		} catch (err) {
			toast.error(err.message || "Failed to update job status.");
		}
	};
	const remove = async () => {
		if (!job) return;
		if (confirm("Delete this job? This cannot be undone.")) try {
			const res = await api.delete(`/jobs/${jobId}`);
			if (res.success) {
				toast.success("Job deleted successfully!");
				navigate({ to: "/dashboard/recruitment/jobs" });
			} else throw new Error(res.message || "Delete failed.");
		} catch (err) {
			toast.error(err.message || "Failed to delete job.");
		}
	};
	function copyToClipboard(txt, label) {
		navigator.clipboard.writeText(txt);
		setCopiedLink(label);
		setTimeout(() => setCopiedLink(null), 2e3);
	}
	function handleAddNote() {
		if (!commentText.trim()) return;
		setNotesList([{
			author: "You",
			at: (/* @__PURE__ */ new Date()).toISOString(),
			text: commentText.trim()
		}, ...notesList]);
		setCommentText("");
	}
	const totalViews = 384;
	const shortlistedCount = applicants.filter((c) => [
		"assessment",
		"interview",
		"technical",
		"hr"
	].includes(c.stage)).length;
	const interviewedCount = applicants.filter((c) => ["interview", "technical"].includes(c.stage)).length;
	const offersSent = 2;
	const hiredCount = applicants.filter((c) => c.stage === "hired").length;
	applicants.filter((c) => c.stage === "rejected").length;
	const conversionRate = applicants.length ? (hiredCount / applicants.length * 100).toFixed(0) : "0";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "relative mb-6 rounded-2xl border border-border bg-card/40 p-6 backdrop-blur-xl",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-6 md:flex-row md:items-start md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-display text-2xl font-bold tracking-tight text-foreground",
								children: editing ? "Editing Details" : job.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: `capitalize font-semibold border ${job.status === "active" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : job.status === "draft" ? "border-sky-500/30 bg-sky-500/10 text-sky-500" : "border-muted bg-muted/40 text-muted-foreground"}`,
								children: job.status
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building, { className: "mr-1.5 h-3.5 w-3.5" }), job.department]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "mr-1.5 h-3.5 w-3.5" }),
										job.location,
										" (",
										job.workMode,
										")"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "mr-1.5 h-3.5 w-3.5" }), job.employmentType]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "mr-1.5 h-3.5 w-3.5" }),
										fmtMoney(job.salaryMin, "INR"),
										" – ",
										fmtMoney(job.salaryMax, "INR")
									]
								})
							]
						}),
						!editing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4 pt-2 md:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-background/50 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block uppercase",
										children: "Hiring Manager"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-foreground",
										children: job.hiringManager || "HM Team"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-background/50 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block uppercase",
										children: "Recruiter"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-foreground",
										children: job.recruiter || "Talent Team"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-background/50 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block uppercase",
										children: "Open Positions"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-foreground",
										children: job.vacancies
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-lg bg-background/50 p-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground block uppercase",
										children: "Total Applicants"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold text-foreground",
										children: applicants.length
									})]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2 md:self-start",
					children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: cancelEdit,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "mr-1.5 h-4 w-4" }), "Cancel"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: save,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "mr-1.5 h-4 w-4" }), "Save Details"]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: startEdit,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "mr-1.5 h-4 w-4" }), "Edit"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setShowDuplicateModal(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-1.5 h-4 w-4" }), "Duplicate"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: togglePause,
							children: [job.status.toLowerCase() === "published" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "mr-1.5 h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "mr-1.5 h-4 w-4" }), job.status.toLowerCase() === "published" ? "Pause" : "Activate"]
						}),
						job.status.toLowerCase() !== "closed" && userRole !== "recruiter" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: () => setShowCloseDialog(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "mr-1.5 h-4 w-4" }), "Close Job"]
						}),
						userRole === "admin" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							size: "sm",
							onClick: remove,
							className: "text-destructive hover:bg-destructive/10 hover:text-destructive",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "mr-1.5 h-4 w-4" }), "Delete"]
						})
					] })
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 flex border-b border-border",
			children: [
				{
					key: "overview",
					label: "Overview"
				},
				{
					key: "applicants",
					label: `Applicants (${applicants.length})`
				},
				{
					key: "publish",
					label: "Publish Channels"
				},
				{
					key: "links",
					label: "Job Links"
				},
				{
					key: "analytics",
					label: "Analytics"
				},
				{
					key: "activity",
					label: "Activity Logs"
				}
			].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setActiveTab(t.key),
				className: `px-4 py-3 text-sm font-semibold border-b-2 transition-all ${activeTab === t.key ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`,
				children: t.label
			}, t.key))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					activeTab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-6",
						children: editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
										label: "Title",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: draft.title,
											onChange: (e) => setDraft({
												...draft,
												title: e.target.value
											})
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
										label: "Department",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: draft.department,
											onChange: (e) => setDraft({
												...draft,
												department: e.target.value
											})
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
									label: "Description",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										rows: 6,
										value: draft.description,
										onChange: (e) => setDraft({
											...draft,
											description: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
											label: "Min Salary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: draft.salaryMin,
												onChange: (e) => setDraft({
													...draft,
													salaryMin: Number(e.target.value)
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
											label: "Max Salary",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: draft.salaryMax,
												onChange: (e) => setDraft({
													...draft,
													salaryMax: Number(e.target.value)
												})
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldRow, {
											label: "Vacancies",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: draft.vacancies,
												onChange: (e) => setDraft({
													...draft,
													vacancies: Number(e.target.value)
												})
											})
										})
									]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
								title: "Company Info",
								icon: Building,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground leading-relaxed",
									children: "OFC360 Inc. is a high-growth HR Technology platforms enterprise. This job role resides in our main operations product division."
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
								title: "Expectations & Joining",
								icon: Calendar,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Joining Date:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: "Immediate / Within 30 days"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Required Docs:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold",
											children: "Resume, Portfolio, Degree Certificate"
										})]
									})]
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobDescriptionView, {
							description: job.description,
							fallback: {
								responsibilities: job.responsibilities,
								requirements: job.requirements,
								benefits: job.benefits,
								location: job.location,
								workMode: job.workMode,
								employmentType: job.employmentType,
								department: job.department,
								experience: job.experience,
								skills: job.skills
							}
						})] })
					}),
					activeTab === "applicants" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card/25 p-3 backdrop-blur-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-1 items-center gap-2 max-w-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: search,
									onChange: (e) => setSearch(e.target.value),
									placeholder: "Search candidate by name or email...",
									className: "h-8 border-border text-xs"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: statusFilter,
									onChange: (e) => setStatusFilter(e.target.value),
									className: "h-8 rounded-lg border border-border bg-background px-2.5 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "all",
											children: "All Stages"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "applied",
											children: "Applied"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "screening",
											children: "Screening"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "assessment",
											children: "Assessment"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "interview",
											children: "Interview"
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
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									size: "sm",
									onClick: () => {
										setExportFormat("csv");
										setShowExportModal(true);
									},
									className: "h-8 text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-3.5 w-3.5" }), "Export CSV"]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-xl",
							children: filteredApplicants.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center p-12 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "mb-4 h-12 w-12 text-muted-foreground/30 animate-pulse" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-semibold text-sm",
										children: "No Applicants Found"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground max-w-xs mt-1",
										children: "No applications match the active filters or search criteria."
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left border-collapse text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-border bg-background/50 text-[10px] uppercase tracking-wider text-muted-foreground",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3 w-8",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: selectedCandidates.length === filteredApplicants.length,
													onChange: (e) => {
														if (e.target.checked) setSelectedCandidates(filteredApplicants.map((c) => c.id));
														else setSelectedCandidates([]);
													},
													className: "rounded border-border"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3",
												children: "Candidate"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3",
												children: "Contact"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3",
												children: "Experience"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3",
												children: "Current Company"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3",
												children: "Applied"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3",
												children: "Stage"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-3 text-right",
												children: "Actions"
											})
										]
									}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredApplicants.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-b border-border/60 hover:bg-accent/20",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "checkbox",
													checked: selectedCandidates.includes(c.id),
													onChange: (e) => {
														if (e.target.checked) setSelectedCandidates([...selectedCandidates, c.id]);
														else setSelectedCandidates(selectedCandidates.filter((id) => id !== c.id));
													},
													className: "rounded border-border"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
														name: c.name,
														size: 30
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
														to: "/dashboard/recruitment/candidates/$candidateId",
														params: { candidateId: c.id },
														className: "font-semibold text-foreground hover:underline",
														children: c.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-[10px] text-muted-foreground block mt-0.5",
														children: [
															"ATS: ",
															c.atsScore,
															"/100"
														]
													})] })]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "p-3 space-y-0.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block",
													children: c.email
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted-foreground block",
													children: c.phone
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "p-3",
												children: [c.yearsExperience, " yrs"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: c.currentCompany || "—"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: fmtDate(c.appliedAt)
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
													variant: "outline",
													className: "capitalize text-[10px]",
													children: c.stage
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-3 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex items-center justify-end gap-1.5",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
														variant: "ghost",
														size: "icon",
														className: "h-7 w-7",
														asChild: true,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
															to: "/dashboard/recruitment/candidates/$candidateId",
															params: { candidateId: c.id },
															title: "View Profile",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })
														})
													})
												})
											})
										]
									}, c.id)) })]
								})
							})
						})]
					}),
					activeTab === "publish" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-sm font-semibold",
							children: "Job Distribution Center"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Distribute and synchronize this role across international boards."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-4 md:grid-cols-2",
							children: channels.map((chan) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col justify-between rounded-xl border border-border bg-card/50 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: chan.url,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "font-semibold text-sm hover:text-primary transition-colors inline-flex items-center gap-1",
										children: [chan.label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3 opacity-60 hover:opacity-100 transition-opacity" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "outline",
										className: `text-[10px] ${chan.active ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500" : "border-border text-muted-foreground"}`,
										children: chan.status
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground leading-relaxed",
									children: chan.desc
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-t border-border/60 pt-3 mt-4 text-[10px] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Sync: ", chan.sync] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex gap-2",
										children: chan.active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "sm",
												asChild: true,
												className: "h-7 px-2 text-[10px]",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
													href: chan.url,
													target: "_blank",
													rel: "noopener noreferrer",
													className: "inline-flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" }), " Visit"]
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "outline",
												size: "sm",
												onClick: () => handleSync(chan.key),
												className: "h-7 px-2 text-[10px]",
												children: "Sync"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "sm",
												onClick: () => handleTogglePlatform(chan.key),
												className: "h-7 px-2 text-[10px] text-destructive hover:bg-destructive/10",
												children: "Disconnect"
											})
										] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											asChild: true,
											className: "h-7 px-3 text-[10px]",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/dashboard/recruitment/jobs/$jobId/publish",
												params: { jobId: job.id },
												children: "Publish Channel"
											})
										})
									})]
								})]
							}, chan.key))
						})]
					}),
					activeTab === "links" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-sm font-semibold",
							children: "Promotional & Sourcing Links"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Copy pre-configured referral, outreach, or public board URLs."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [[
								{
									label: "Public Job Application URL",
									url: getJobApplicationUrl(jobId)
								},
								{
									label: "Public Career Site URL",
									url: getPublicJobUrl(jobId)
								},
								{
									label: "Internal Employee Referral Link",
									url: getReferralUrl(jobId)
								}
							].map((linkItem) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card/40 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold block mb-2",
									children: linkItem.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: linkItem.url,
										readOnly: true,
										className: "h-9 text-xs bg-background/50 border-border"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-9 px-3 shrink-0",
										onClick: () => copyToClipboard(linkItem.url, linkItem.label),
										children: copiedLink === linkItem.label ? "Copied!" : "Copy"
									})]
								})]
							}, linkItem.label)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-border bg-card/40 p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold block",
										children: "QR Code Sourcing Asset"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground mt-0.5",
										children: "Generate printable and shareable QR codes linking directly to the job apply page."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: () => setShowQrModal(true),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "mr-1.5 h-4 w-4" }), "Generate Job QR Code"]
									})]
								})
							})]
						})]
					}),
					activeTab === "analytics" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-4 md:grid-cols-4",
							children: [
								{
									label: "Job Views",
									value: totalViews,
									suffix: "",
									icon: Globe
								},
								{
									label: "Applications",
									value: applicants.length,
									suffix: "",
									icon: Users
								},
								{
									label: "Interviewed",
									value: interviewedCount,
									suffix: "",
									icon: CalendarClock
								},
								{
									label: "Hired Rate",
									value: conversionRate,
									suffix: "%",
									icon: UserPlus
								}
							].map((k) => {
								const I = k.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-card/60 p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between mb-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] uppercase tracking-wider text-muted-foreground",
											children: k.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { className: "h-4 w-4 text-muted-foreground/50" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-xl font-bold text-foreground",
										children: [k.value, k.suffix]
									})]
								}, k.label);
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 gap-4 md:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card/60 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold block mb-4",
									children: "Daily Application Flow"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
										width: "100%",
										height: "100%",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
											data: [
												{
													name: "Mon",
													apps: 3
												},
												{
													name: "Tue",
													apps: 7
												},
												{
													name: "Wed",
													apps: 5
												},
												{
													name: "Thu",
													apps: applicants.length
												},
												{
													name: "Fri",
													apps: 4
												},
												{
													name: "Sat",
													apps: 2
												},
												{
													name: "Sun",
													apps: 1
												}
											],
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
													id: "colorApps",
													x1: "0",
													y1: "0",
													x2: "0",
													y2: "1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
														offset: "5%",
														stopColor: "var(--color-primary, oklch(0.65 0.22 285))",
														stopOpacity: .4
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
														offset: "95%",
														stopColor: "var(--color-primary, oklch(0.65 0.22 285))",
														stopOpacity: 0
													})]
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
													strokeDasharray: "3 3",
													stroke: "oklch(0.2 0.05 240 / 0.3)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
													dataKey: "name",
													stroke: "oklch(0.5 0.05 240)",
													fontSize: 10
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
													stroke: "oklch(0.5 0.05 240)",
													fontSize: 10
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
													type: "monotone",
													dataKey: "apps",
													stroke: "var(--color-primary, oklch(0.65 0.22 285))",
													fillOpacity: 1,
													fill: "url(#colorApps)"
												})
											]
										})
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-card/60 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold block mb-4",
									children: "Sourcing Channels Breakdown"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-60",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
										width: "100%",
										height: "100%",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
												data: [
													{
														name: "LinkedIn",
														value: 45
													},
													{
														name: "Indeed",
														value: 30
													},
													{
														name: "Glassdoor",
														value: 15
													},
													{
														name: "Direct Referral",
														value: 10
													}
												],
												cx: "50%",
												cy: "50%",
												innerRadius: 60,
												outerRadius: 80,
												paddingAngle: 5,
												dataKey: "value",
												children: CHART_COLORS.map((color, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: color }, `cell-${index}`))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
												verticalAlign: "bottom",
												height: 36,
												iconSize: 10,
												fontSize: 10
											})
										] })
									})
								})]
							})]
						})]
					}),
					activeTab === "activity" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card/60 p-4 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold block",
									children: "Add Notes / Comments"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: commentText,
									onChange: (e) => setCommentText(e.target.value),
									placeholder: "Type an internal update, tag recruiter...",
									rows: 3,
									className: "text-xs bg-background/50 border-border"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										onClick: handleAddNote,
										className: "h-8 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "mr-1.5 h-3.5 w-3.5" }), "Submit Comment"]
									})
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: notesList.map((n, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-3 rounded-xl border border-border bg-card/40 p-4 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 font-bold text-primary",
									children: n.author.charAt(0)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-foreground",
											children: n.author
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] text-muted-foreground",
											children: fmtDate(n.at)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground leading-relaxed",
										children: n.text
									})]
								})]
							}, idx))
						})]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "space-y-4 lg:sticky lg:top-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold block",
						children: "Quick Actions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "w-full text-xs justify-start",
								onClick: () => setShowPublishModal(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "mr-2 h-4 w-4" }), "Publish Channels"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "w-full text-xs justify-start",
								onClick: handleCopySourcingLink,
								disabled: isCopyingLink,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-2 h-4 w-4" }), isCopyingLink ? "Fetching..." : "Copy Sourcing Link"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "w-full text-xs justify-start",
								onClick: () => setShowQrModal(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QrCode, { className: "mr-2 h-4 w-4" }), "Generate Job QR Code"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "w-full text-xs justify-start",
								onClick: () => setShowExportModal(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), "Export Applicants"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "w-full text-xs justify-start",
								onClick: () => setShowDuplicateModal(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "mr-2 h-4 w-4" }), "Duplicate Role"]
							}),
							userRole !== "recruiter" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "sm",
								variant: "outline",
								className: "w-full text-xs justify-start text-destructive hover:bg-destructive/15",
								onClick: () => setShowCloseDialog(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "mr-2 h-4 w-4" }), "Close Position"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold block mb-3",
						children: "Pipeline Health"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shortlisted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: shortlistedCount
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Interviewed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: interviewedCount
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Offers Sent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: offersSent
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Hires Count" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: hiredCount
								})]
							})
						]
					})]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showPublishModal,
			onOpenChange: setShowPublishModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md bg-card/90 backdrop-blur-xl border border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-5 w-5 text-primary animate-pulse" }), "Publish Channels"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Control where your job posting is active. Generating a channel automatically registers a unique applicant-facing link." })] }),
					loadingChannels ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center p-8 space-y-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Fetching publish channels..."
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4 py-2",
						children: [
							"career_site",
							"public_link",
							"internal_portal"
						].map((chanName) => {
							const chanObj = publishChannels.find((c) => c.channel_name === chanName) || {
								channel_name: chanName,
								is_active: false,
								published_at: null,
								last_updated: null,
								url: ""
							};
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-xl border border-border bg-background/50 p-4 space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-semibold text-foreground block",
										children: chanName === "career_site" ? "Company Career Site" : chanName === "public_link" ? "Public Apply Link" : "Internal Hiring Portal"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground block",
										children: chanName === "career_site" ? "Publish to public careers directory." : chanName === "public_link" ? "Create a shareable url for job boards." : "Internal portal for employee referrals."
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: chanObj.is_active,
										onCheckedChange: () => handleToggleChannel(chanName, chanObj.is_active)
									})]
								}), chanObj.is_active && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-2 border-t border-border/50 flex flex-col gap-1.5 text-xs text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Status:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold text-emerald-500 flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" }), "Active"]
											})]
										}),
										chanObj.published_at && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Published At:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: new Date(chanObj.published_at).toLocaleDateString() })]
										}),
										chanObj.url && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between gap-2 mt-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "truncate max-w-[200px] text-primary underline text-[10px]",
												children: sanitizePublicUrl(chanObj.url)
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "icon",
													variant: "ghost",
													className: "h-6 w-6 text-muted-foreground",
													onClick: () => {
														navigator.clipboard.writeText(sanitizePublicUrl(chanObj.url));
														toast.success("Link copied!");
													},
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3 w-3" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													size: "sm",
													variant: "outline",
													className: "h-6 text-[10px] px-2",
													asChild: true,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														href: sanitizePublicUrl(chanObj.url),
														target: "_blank",
														rel: "noreferrer",
														children: "Visit"
													})
												})]
											})]
										})
									]
								})]
							}, chanName);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => setShowPublishModal(false),
						children: "Close"
					}) })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JobQrModal, {
			open: showQrModal,
			onOpenChange: setShowQrModal,
			jobId,
			jobTitle: job?.title
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showExportModal,
			onOpenChange: setShowExportModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-sm bg-card/90 backdrop-blur-xl border border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-5 w-5 text-primary" }), "Export Applicants"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Export candidate applications. Select your desired format and filtering criteria." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold",
								children: "Format"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: exportFormat,
								onValueChange: (val) => setExportFormat(val),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full bg-background/50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select format" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "csv",
										children: "CSV Spreadsheet (.csv)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "excel",
										children: "Excel Document (.xlsx)"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "pdf",
										children: "PDF Document (.pdf)"
									})
								] })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold",
								children: "Pipeline Stage Filter"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
								value: exportFilter,
								onValueChange: (val) => setExportFilter(val),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
									className: "w-full bg-background/50",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select stage" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "all",
										children: "All Applicants"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "shortlisted",
										children: "Shortlisted Candidates"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "interviewed",
										children: "Interviewed Candidates"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "rejected",
										children: "Rejected Candidates"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
										value: "selected",
										children: "Selected/Hired Candidates"
									})
								] })]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setShowExportModal(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: handleExportApplicants,
						disabled: exporting,
						children: exporting ? "Exporting..." : "Download Export"
					})] })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showDuplicateModal,
			onOpenChange: setShowDuplicateModal,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-md bg-card/90 backdrop-blur-xl border border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-5 w-5 text-primary" }), "Duplicate Role"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Copy settings and fields of this role to a new job posting. Edit fields to customize." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold",
									children: "Job Title"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: dupTitle,
									onChange: (e) => setDupTitle(e.target.value),
									placeholder: "e.g. Frontend Developer"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									className: "text-xs font-semibold",
									children: "Location"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: dupLocation,
									onChange: (e) => setDupLocation(e.target.value),
									placeholder: "e.g. Bangalore, Jaipur, Remote"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-3 gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-1 space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Openings"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											min: 1,
											value: dupVacancies,
											onChange: (e) => setDupVacancies(parseInt(e.target.value) || 1)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-1 space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Min Salary"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: dupMinSalary,
											onChange: (e) => setDupMinSalary(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "col-span-1 space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											className: "text-xs font-semibold",
											children: "Max Salary"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "number",
											value: dupMaxSalary,
											onChange: (e) => setDupMaxSalary(e.target.value)
										})]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setShowDuplicateModal(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: handleCreateDuplicate,
						disabled: duplicating,
						children: duplicating ? "Duplicating..." : "Create Duplicate"
					})] })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: showCloseDialog,
			onOpenChange: setShowCloseDialog,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-sm bg-card/90 backdrop-blur-xl border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2 text-destructive",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-5 w-5" }), "Close Position?"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Are you sure you want to close this position? This will deactivate all active publish channels and prevent any new applications." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => setShowCloseDialog(false),
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "destructive",
						onClick: handleConfirmCloseJob,
						disabled: closing,
						children: closing ? "Closing..." : "Close Position"
					})]
				})]
			})
		})
	] });
}
function Section({ title, children, icon: Icon }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
			className: "mb-3 font-display text-sm font-semibold flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4 text-muted-foreground" }), title]
		}), children]
	});
}
function FieldRow({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		className: "mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground",
		children: label
	}), children] });
}
//#endregion
export { JobDetailPage };
