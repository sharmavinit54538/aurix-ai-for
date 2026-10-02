import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, x as useParams } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $t as Linkedin, Ar as Check, Bt as MapPin, Dr as ChevronRight, Gn as FileCheck, H as Sparkles, Jr as Briefcase, Ln as FileText, Q as Send, Sr as CircleCheck, Tr as CircleAlert, Vt as Mail, dn as IndianRupee, fr as CloudUpload, k as Trash2, lt as RefreshCw, oi as Award, pr as Clock, q as ShieldCheck, qr as Building2, tr as DollarSign, vt as Phone, xn as Globe } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as axios } from "../_libs/axios+[...].mjs";
import { t as statusBadgeClass } from "./status-styles-B1M3Yvd8.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, o as SheetTrigger, r as SheetDescription, t as Sheet } from "./sheet-3YlcNW_l.mjs";
import { t as Checkbox } from "./checkbox-BhwBotB1.mjs";
import { t as normalizeJobDescription } from "./normalizeJobDescription-104opOLx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CandidateJobApplicationPage-C7trujhU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COUNTRY_CODES = [
	{
		code: "+91",
		label: "+91 (India)",
		flag: "🇮🇳"
	},
	{
		code: "+1",
		label: "+1 (US/Canada)",
		flag: "🇺🇸"
	},
	{
		code: "+44",
		label: "+44 (UK)",
		flag: "🇬🇧"
	},
	{
		code: "+65",
		label: "+65 (Singapore)",
		flag: "🇸🇬"
	},
	{
		code: "+971",
		label: "+971 (UAE)",
		flag: "🇦🇪"
	},
	{
		code: "+49",
		label: "+49 (Germany)",
		flag: "🇩🇪"
	},
	{
		code: "+61",
		label: "+61 (Australia)",
		flag: "🇦🇺"
	}
];
var QUALIFICATION_OPTIONS = [
	"B.Tech / B.E. (Computer Science / IT)",
	"B.Sc / BCA / Information Technology",
	"M.Tech / M.S. (Computer Science / Data Science)",
	"MCA / Master of Computer Applications",
	"Bachelor's Degree (Any Discipline)",
	"Master's Degree / MBA",
	"Doctorate / Ph.D.",
	"Diploma / Associate Degree",
	"Self-Taught / Bootcamp Graduate"
];
var NOTICE_PERIOD_OPTIONS = [
	"Immediate (Serving Notice / Ready to Join)",
	"15 Days or Less",
	"30 Days (1 Month)",
	"45 Days",
	"60 Days (2 Months)",
	"90 Days (3 Months)"
];
var getPublicCareersApiUrl = () => {
	let rawApiUrl = "https://api.ofc360.com".trim().replace(/\/$/, "");
	if (!rawApiUrl.startsWith("http://") && !rawApiUrl.startsWith("https://")) rawApiUrl = `https://${rawApiUrl}`;
	rawApiUrl = rawApiUrl.replace(/www\.api\.ofc360\.com/g, "api.ofc360.com");
	return `${rawApiUrl}/api/public/careers`;
};
var PUBLIC_API_URL = getPublicCareersApiUrl();
function JobApplyPage() {
	const { ukey } = useParams({ strict: false });
	const [job, setJob] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [applyMode, setApplyMode] = (0, import_react.useState)("job");
	const [firstName, setFirstName] = (0, import_react.useState)("");
	const [lastName, setLastName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [countryCode, setCountryCode] = (0, import_react.useState)("+91");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [city, setCity] = (0, import_react.useState)("");
	const [state, setState] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)("India");
	const [experienceYears, setExperienceYears] = (0, import_react.useState)("");
	const [highestQualification, setHighestQualification] = (0, import_react.useState)("");
	const [currentCompany, setCurrentCompany] = (0, import_react.useState)("");
	const [currentDesignation, setCurrentDesignation] = (0, import_react.useState)("");
	const [currentCtc, setCurrentCtc] = (0, import_react.useState)("");
	const [expectedCtc, setExpectedCtc] = (0, import_react.useState)("");
	const [noticePeriod, setNoticePeriod] = (0, import_react.useState)("");
	const [linkedinUrl, setLinkedinUrl] = (0, import_react.useState)("");
	const [portfolioUrl, setPortfolioUrl] = (0, import_react.useState)("");
	const [coverLetter, setCoverLetter] = (0, import_react.useState)("");
	const [resumeFile, setResumeFile] = (0, import_react.useState)(null);
	const [isDragging, setIsDragging] = (0, import_react.useState)(false);
	const [declarationChecked, setDeclarationChecked] = (0, import_react.useState)(false);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	const [success, setSuccess] = (0, import_react.useState)(false);
	const [errors, setErrors] = (0, import_react.useState)({});
	const [touched, setTouched] = (0, import_react.useState)({});
	const fileInputRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let active = true;
		async function fetchJobDetails() {
			if (!ukey) {
				setError("Invalid job application link.");
				setLoading(false);
				return;
			}
			try {
				setLoading(true);
				setError(null);
				let apiData = null;
				let mode = "job";
				try {
					const res = await axios.get(`${PUBLIC_API_URL}/${ukey}`);
					if (res.data && res.data.success && res.data.data) {
						apiData = res.data.data;
						mode = "job";
					}
				} catch {}
				if (!apiData) try {
					const res = await axios.get(`${PUBLIC_API_URL}/apply/${ukey}`);
					if (res.data && res.data.success && res.data.data) {
						apiData = res.data.data;
						mode = "channel";
					} else {
						if (active) {
							setError(res.data?.message || "Job position not found or no longer active.");
							setJob(null);
						}
						return;
					}
				} catch (chanErr) {
					if (active) {
						setError(chanErr.response?.data?.message || "Job position not found or unavailable.");
						setJob(null);
					}
					return;
				}
				if (!active) return;
				if (apiData) {
					setApplyMode(mode);
					const normalizedJd = normalizeJobDescription(apiData.job_description || apiData.jobDescription);
					let resolvedSkills = [];
					if (Array.isArray(apiData.skills) && apiData.skills.length > 0) resolvedSkills = apiData.skills.map((s) => typeof s === "string" ? { skill_name: s } : {
						...s,
						skill_name: s?.skill_name || String(s)
					});
					else if (normalizedJd.requiredSkills?.length) resolvedSkills = normalizedJd.requiredSkills.map((name) => ({ skill_name: name }));
					let resolvedResp = apiData.responsibilities;
					if (!resolvedResp || Array.isArray(resolvedResp) && resolvedResp.length === 0) resolvedResp = normalizedJd.responsibilities || [];
					let resolvedReq = apiData.requirements;
					if (!resolvedReq || Array.isArray(resolvedReq) && resolvedReq.length === 0) resolvedReq = normalizedJd.qualifications || [];
					let resolvedBen = apiData.benefits;
					if (!resolvedBen || Array.isArray(resolvedBen) && resolvedBen.length === 0) resolvedBen = normalizedJd.benefits || [];
					const resolvedDesc = normalizedJd.summary || normalizedJd.aboutRole || normalizedJd.plainText || (typeof apiData.job_description === "string" && !apiData.job_description.trim().startsWith("{") ? apiData.job_description : apiData.jobDescription || "");
					setJob({
						...apiData,
						title: apiData.title || normalizedJd.title || "Open Position",
						location: apiData.location || normalizedJd.location || "Remote",
						employmentType: apiData.employment_type || apiData.employmentType || normalizedJd.employmentType || "Full-time",
						experienceRequired: apiData.experience_required || apiData.experienceRequired || normalizedJd.experience?.text || (apiData.min_experience ? `${apiData.min_experience}-${apiData.max_experience || 0} yrs` : ""),
						salaryMin: apiData.min_salary ?? apiData.salaryMin ?? normalizedJd.salaryRange?.min,
						salaryMax: apiData.max_salary ?? apiData.salaryMax ?? normalizedJd.salaryRange?.max,
						jobDescription: resolvedDesc,
						skills: resolvedSkills,
						responsibilities: resolvedResp,
						requirements: resolvedReq,
						benefits: resolvedBen,
						aboutCompany: apiData.about_company || apiData.aboutCompany || ""
					});
				}
			} catch (err) {
				if (active) {
					setError(err.response?.data?.message || "Job position not found or unavailable.");
					setJob(null);
				}
			} finally {
				if (active) setLoading(false);
			}
		}
		fetchJobDetails();
		return () => {
			active = false;
		};
	}, [ukey]);
	const formattedSalary = (0, import_react.useMemo)(() => {
		const min = typeof job?.salaryMin === "number" ? job.salaryMin : Number(job?.salaryMin) || 0;
		const max = typeof job?.salaryMax === "number" ? job.salaryMax : Number(job?.salaryMax) || 0;
		if (!min && !max) return null;
		const formatAmount = (num) => {
			if (!num) return "";
			if (num >= 1e5) return `${(num / 1e5).toFixed(1)}L`;
			if (num >= 1e3) return `${(num / 1e3).toFixed(0)}K`;
			return `${num}L`;
		};
		if (min && max) return `₹${formatAmount(min)} - ₹${formatAmount(max)} CTC`;
		if (min) return `₹${formatAmount(min)}+ CTC`;
		return null;
	}, [job?.salaryMin, job?.salaryMax]);
	const responsibilitiesList = (0, import_react.useMemo)(() => {
		if (Array.isArray(job?.responsibilities)) return job.responsibilities;
		if (typeof job?.responsibilities === "string") return job.responsibilities.split("\n").filter((s) => s.trim().length > 0);
		return [];
	}, [job?.responsibilities]);
	const requirementsList = (0, import_react.useMemo)(() => {
		if (Array.isArray(job?.requirements)) return job.requirements;
		if (typeof job?.requirements === "string") return job.requirements.split("\n").filter((s) => s.trim().length > 0);
		return [];
	}, [job?.requirements]);
	const benefitsList = (0, import_react.useMemo)(() => {
		if (Array.isArray(job?.benefits)) return job.benefits;
		if (typeof job?.benefits === "string") return job.benefits.split("\n").filter((s) => s.trim().length > 0);
		return [];
	}, [job?.benefits]);
	const validateFile = (file) => {
		const ext = file.name.split(".").pop()?.toLowerCase();
		if (ext !== "pdf" && ext !== "doc" && ext !== "docx") {
			toast.error("Invalid file format. Only PDF, DOC, or DOCX are permitted.");
			return false;
		}
		if (file.size > 5 * 1024 * 1024) {
			toast.error("File size exceeds 5MB limit.");
			return false;
		}
		return true;
	};
	const handleFileChange = (e) => {
		if (e.target.files && e.target.files.length > 0) {
			const file = e.target.files[0];
			if (validateFile(file)) {
				setResumeFile(file);
				setErrors((prev) => {
					const next = { ...prev };
					delete next.resume;
					return next;
				});
				toast.success(`Resume attached: ${file.name}`);
			}
		}
	};
	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};
	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};
	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
		if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
			const file = e.dataTransfer.files[0];
			if (validateFile(file)) {
				setResumeFile(file);
				setErrors((prev) => {
					const next = { ...prev };
					delete next.resume;
					return next;
				});
				toast.success(`Resume uploaded: ${file.name}`);
			}
		}
	};
	const removeResumeFile = () => {
		setResumeFile(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
		toast.info("Resume removed. Please upload an updated file.");
	};
	const handleBlur = (field) => {
		setTouched((prev) => ({
			...prev,
			[field]: true
		}));
		validateForm();
	};
	const validateForm = () => {
		const newErrors = {};
		if (!resumeFile) newErrors.resume = "Resume is required (PDF, DOC, DOCX up to 5MB)";
		if (!firstName.trim()) newErrors.firstName = "First name is required";
		if (!lastName.trim()) newErrors.lastName = "Last name is required";
		if (!email.trim()) newErrors.email = "Email address is required";
		else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) newErrors.email = "Please enter a valid email address";
		if (!phone.trim()) newErrors.phone = "Phone number is required";
		else if (phone.replace(/\D/g, "").length < 7) newErrors.phone = "Please enter a valid phone number (minimum 7 digits)";
		if (!city.trim()) newErrors.city = "City is required";
		if (!state.trim()) newErrors.state = "State is required";
		if (!country.trim()) newErrors.country = "Country is required";
		if (!experienceYears.trim()) newErrors.experienceYears = "Experience is required";
		if (!highestQualification.trim()) newErrors.highestQualification = "Please select highest qualification";
		if (!declarationChecked) newErrors.declaration = "You must accept the candidate declaration to submit";
		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setTouched({
			firstName: true,
			lastName: true,
			email: true,
			phone: true,
			city: true,
			state: true,
			country: true,
			experienceYears: true,
			highestQualification: true,
			declaration: true,
			resume: true
		});
		if (!validateForm()) {
			toast.error("Please fill out all mandatory fields marked with an asterisk (*).");
			return;
		}
		setSubmitting(true);
		try {
			const fullPhone = `${countryCode} ${phone}`.trim();
			const formData = new FormData();
			if (resumeFile) formData.append("resume_file", resumeFile);
			formData.append("first_name", firstName);
			formData.append("last_name", lastName);
			formData.append("email", email);
			formData.append("phone", fullPhone);
			formData.append("city", city);
			formData.append("state", state);
			formData.append("country", country);
			formData.append("experience_years", experienceYears || "0");
			formData.append("declaration_checked", String(declarationChecked));
			if (highestQualification) formData.append("highest_qualification", highestQualification);
			if (currentCompany) formData.append("current_company", currentCompany);
			if (currentDesignation) formData.append("current_designation", currentDesignation);
			if (currentCtc) formData.append("current_ctc", currentCtc);
			if (expectedCtc) formData.append("expected_ctc", expectedCtc);
			if (noticePeriod) formData.append("notice_period", noticePeriod);
			if (linkedinUrl) formData.append("linkedin_url", linkedinUrl);
			if (portfolioUrl) formData.append("portfolio_url", portfolioUrl);
			if (coverLetter) formData.append("cover_letter", coverLetter);
			const candidateKey = job?.id || job?.slug || ukey;
			const targetEndpoints = applyMode === "channel" ? [`${PUBLIC_API_URL}/apply/${ukey}`, `${PUBLIC_API_URL}/${candidateKey}/apply`] : [`${PUBLIC_API_URL}/${candidateKey}/apply`, `${PUBLIC_API_URL}/apply/${ukey}`];
			let res = null;
			let lastErr = null;
			for (const endpoint of targetEndpoints) try {
				res = await axios.post(endpoint, formData, { headers: { "Content-Type": "multipart/form-data" } });
				if (res?.data?.success) break;
			} catch (err) {
				lastErr = err;
				if (err.response?.status !== 404 && err.response?.status !== 405) throw err;
			}
			if (!res && lastErr) throw lastErr;
			if (res?.data?.success) {
				setSuccess(true);
				toast.success("Application submitted successfully!");
			} else toast.error(res?.data?.message || "Failed to submit application. Please review your details.");
		} catch (err) {
			toast.error(err.response?.data?.message || "An error occurred while submitting your application.");
		} finally {
			setSubmitting(false);
		}
	};
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative flex min-h-screen flex-col items-center justify-center bg-background py-12 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 flex flex-col items-center gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative h-14 w-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full border-4 border-border" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-center space-y-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-semibold text-foreground tracking-wide",
					children: "Loading position details..."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Fetching opportunities from OFC360 Talent Network"
				})]
			})]
		})
	});
	if (error || !job) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative flex min-h-screen flex-col items-center justify-center bg-background py-12 px-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 max-w-md w-full bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-destructive w-fit",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-10 w-10" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-5 text-xl sm:text-2xl font-bold tracking-tight text-foreground font-display",
					children: "Position Not Available"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-muted-foreground leading-relaxed",
					children: error || "This job opening does not exist or is no longer accepting applications."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 flex justify-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "rounded-xl h-10 px-5 text-xs font-semibold cursor-pointer",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard",
							children: "Return to Dashboard"
						})
					})
				})
			]
		})
	});
	if (success) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "relative flex min-h-screen flex-col items-center justify-center bg-background py-12 px-4 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative z-10 max-w-lg w-full bg-card border border-border rounded-3xl p-8 sm:p-10 shadow-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `mx-auto rounded-2xl p-4 w-fit border ${statusBadgeClass("approved")}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-12 w-12" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-6 text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground font-display",
					children: "Application Submitted!"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted-foreground leading-relaxed",
					children: [
						"Thank you for applying for the ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-foreground",
							children: job?.title
						}),
						" role at OFC360. Your profile is now with our hiring committee."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 p-5 rounded-2xl bg-muted/40 border border-border text-left w-full space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-b border-border pb-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] font-bold text-muted-foreground uppercase tracking-wider",
							children: "Submission Receipt"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `text-[10px] px-2 py-0.5 rounded-full font-semibold border ${statusBadgeClass("active")}`,
							children: "Active Review"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center py-1 border-b border-border/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Candidate Name:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-foreground",
									children: [
										firstName,
										" ",
										lastName
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center py-1 border-b border-border/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Email:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: email
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center py-1 border-b border-border/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Role:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold text-foreground",
									children: job?.title
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between items-center py-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Resume Attached:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-semibold text-foreground truncate max-w-[200px] flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "h-3.5 w-3.5 shrink-0 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "truncate",
										children: resumeFile?.name
									})]
								})]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-col sm:flex-row gap-3 justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => window.location.reload(),
						variant: "outline",
						className: "rounded-xl h-11 px-6 text-xs font-semibold",
						children: "Submit Another Application"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "rounded-xl h-11 px-6 text-xs font-bold",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard",
							children: "Go to Platform Dashboard"
						})
					})]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground relative overflow-x-hidden pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 to-transparent pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "border-b border-border bg-background sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/dashboard",
						className: "flex items-center hover:opacity-90 transition-opacity",
						title: "OFC360",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/favicon.svg",
							alt: "OFC360",
							className: "h-8 w-8 object-contain "
						})
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
				side: "left",
				className: "w-full sm:max-w-xl bg-card border-r border-border text-foreground p-0 flex flex-col z-50 overflow-hidden shadow-2xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-5 sm:p-6 border-b border-border bg-muted/30",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
						className: "text-left space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, {
							className: "text-lg font-bold text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5 text-primary" }), job?.title || "Role Details & Requirements"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, {
							className: "text-xs text-muted-foreground",
							children: "Detailed role description, responsibilities, requirements, and benefits at OFC360."
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-5 sm:p-6 space-y-4 overflow-y-auto flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-card border border-border rounded-2xl p-5 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" }), " About the Role"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-foreground text-sm leading-relaxed whitespace-pre-line font-normal",
								children: job?.jobDescription || "No detailed description provided for this position."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-card border border-border rounded-2xl p-5 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border pb-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-primary" }), " Core Skillsets Needed"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border",
									children: [(job?.skills || []).length, " Skills"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2 pt-1",
								children: (job?.skills || []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground italic",
									children: "No specific skill requirements listed."
								}) : (job?.skills || []).map((skill, idx) => {
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "secondary",
										className: "bg-muted text-muted-foreground border border-border py-1.5 px-3 text-xs font-semibold rounded-lg",
										children: typeof skill === "string" ? skill : skill.skill_name || `Skill ${idx + 1}`
									}, idx);
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-card border border-border rounded-2xl p-5 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border pb-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary" }), " Key Responsibilities"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border",
									children: [responsibilitiesList.length, " Items"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2.5 pt-1",
								children: responsibilitiesList.map((resp, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2.5 text-sm text-foreground leading-relaxed",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary mt-0.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: resp })]
								}, idx))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-card border border-border rounded-2xl p-5 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border pb-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 text-primary" }), " Role Requirements"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border",
									children: [requirementsList.length, " Items"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2.5 pt-1",
								children: requirementsList.map((req, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2.5 text-sm text-foreground leading-relaxed",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary mt-0.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: req })]
								}, idx))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-card border border-border rounded-2xl p-5 space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border pb-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4 text-primary" }), " Perquisites & Benefits"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border",
									children: [benefitsList.length, " Perks"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-2.5 pt-1",
								children: benefitsList.map((benefit, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start gap-2.5 text-sm text-foreground leading-relaxed",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-primary mt-0.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3 w-3" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: benefit })]
								}, idx))
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "max-w-3xl mx-auto px-4 sm:px-6 mt-6 sm:mt-10 relative z-10 space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					"aria-label": "Job Overview",
					className: "rounded-3xl border border-border bg-card p-6 sm:p-7 shadow-sm relative overflow-hidden",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col sm:flex-row sm:items-center justify-between gap-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 flex-1 min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "text-2xl sm:text-3xl font-bold text-foreground tracking-tight leading-snug",
								children: job?.title || "Senior Full Stack Cloud Engineer"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 border border-border text-foreground shadow-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: job?.location || "Bangalore, India (Hybrid)" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 border border-border text-foreground shadow-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-3.5 w-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: job?.employmentType || "Full-time" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 border border-border text-foreground shadow-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: job?.experienceRequired || "4 - 8 Years" })]
									}),
									formattedSalary && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary font-semibold shadow-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "h-3.5 w-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formattedSalary })]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								type: "button",
								className: "text-xs font-semibold gap-2 rounded-xl shrink-0 cursor-pointer",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Full Details" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground" })
								]
							})
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: "apply-form",
					className: "w-full rounded-3xl border border-border bg-card p-6 sm:p-9 shadow-sm relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 pb-5 border-b border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-bold text-foreground tracking-tight font-display flex items-center gap-2",
							children: "Candidate Application Form"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-1",
							children: [
								"Please complete the form below. Fields marked with ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-destructive font-bold",
									children: "*"
								}),
								" are required for committee review."
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSubmit,
						noValidate: true,
						className: "space-y-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											htmlFor: "resume",
											className: "text-xs font-semibold text-muted-foreground flex items-center gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Upload Resume / Curriculum Vitae" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-destructive font-bold",
													children: "*"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground",
											children: "PDF, DOC, DOCX (Max 5MB)"
										})]
									}),
									resumeFile ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-2xl border border-border bg-muted/40 p-4 sm:p-5 flex items-center justify-between gap-4 transition-all shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3.5 min-w-0",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 border border-primary/20 text-primary",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileCheck, { className: "h-6 w-6" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "min-w-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-bold text-foreground truncate max-w-[220px] sm:max-w-md",
													children: resumeFile.name
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2 mt-0.5 text-xs text-muted-foreground",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [(resumeFile.size / (1024 * 1024)).toFixed(2), " MB"] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1 w-1 rounded-full bg-muted-foreground" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-primary font-medium",
															children: "Ready for parsing"
														})
													]
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-2 shrink-0",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													htmlFor: "resume-change",
													className: "cursor-pointer text-xs font-semibold text-foreground hover:bg-muted bg-background px-3 py-1.5 rounded-xl transition-all inline-flex items-center gap-1.5 border border-border",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "h-3 w-3" }), " Change"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "file",
													id: "resume-change",
													onChange: handleFileChange,
													accept: ".pdf,.doc,.docx",
													className: "hidden"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: removeResumeFile,
													className: "cursor-pointer text-muted-foreground hover:text-destructive hover:bg-destructive/10 p-2 rounded-xl transition-colors",
													title: "Remove resume",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
												})
											]
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										onDragOver: handleDragOver,
										onDragLeave: handleDragLeave,
										onDrop: handleDrop,
										onClick: () => fileInputRef.current?.click(),
										className: `relative border-2 border-dashed rounded-2xl p-6 sm:p-8 transition-all text-center flex flex-col items-center justify-center min-h-[140px] group cursor-pointer ${isDragging ? "border-primary bg-primary/10" : errors.resume && touched.resume ? "border-destructive bg-destructive/5" : "border-border bg-muted/50 hover:bg-muted"}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											ref: fileInputRef,
											type: "file",
											id: "resume",
											onChange: handleFileChange,
											accept: ".pdf,.doc,.docx",
											className: "hidden"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col items-center gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 border border-primary/20 text-primary transition-all group-hover:scale-105",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CloudUpload, { className: "h-6 w-6" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm font-semibold text-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-primary underline underline-offset-4 ",
													children: "Click to upload"
												}), " or drag and drop your resume"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground mt-1",
												children: "Supported formats: PDF, DOC, DOCX up to 5MB"
											})] })]
										})]
									}),
									errors.resume && touched.resume && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-destructive flex items-center gap-1.5 mt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.resume })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4 pt-4 border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-5 w-5 place-items-center rounded-full bg-primary/10 text-primary text-[11px] font-bold",
											children: "1"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-xs font-bold text-foreground uppercase tracking-wider",
											children: "Personal Information"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													htmlFor: "firstName",
													className: "block text-xs font-medium text-foreground",
													children: ["First Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-destructive font-bold",
														children: "*"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "relative",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "firstName",
														type: "text",
														required: true,
														value: firstName,
														placeholder: "e.g. Vikram",
														onChange: (e) => {
															setFirstName(e.target.value);
															if (errors.firstName) setErrors((p) => {
																const n = { ...p };
																delete n.firstName;
																return n;
															});
														},
														onBlur: () => handleBlur("firstName"),
														className: `h-11 rounded-xl text-sm px-4 ${errors.firstName && touched.firstName ? "border-destructive" : ""}`
													})
												}),
												errors.firstName && touched.firstName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-destructive flex items-center gap-1 mt-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.firstName })]
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													htmlFor: "lastName",
													className: "block text-xs font-medium text-foreground",
													children: ["Last Name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-destructive font-bold",
														children: "*"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "relative",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "lastName",
														type: "text",
														required: true,
														value: lastName,
														placeholder: "e.g. Malhotra",
														onChange: (e) => {
															setLastName(e.target.value);
															if (errors.lastName) setErrors((p) => {
																const n = { ...p };
																delete n.lastName;
																return n;
															});
														},
														onBlur: () => handleBlur("lastName"),
														className: `h-11 rounded-xl text-sm px-4 ${errors.lastName && touched.lastName ? "border-destructive" : ""}`
													})
												}),
												errors.lastName && touched.lastName && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-destructive flex items-center gap-1 mt-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.lastName })]
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												htmlFor: "email",
												className: "block text-xs font-medium text-foreground",
												children: ["Email Address ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-destructive font-bold",
													children: "*"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "email",
													type: "email",
													required: true,
													value: email,
													placeholder: "vikram.malhotra@example.com",
													onChange: (e) => {
														setEmail(e.target.value);
														if (errors.email) setErrors((p) => {
															const n = { ...p };
															delete n.email;
															return n;
														});
													},
													onBlur: () => handleBlur("email"),
													className: `pl-10 h-11 rounded-xl text-sm ${errors.email && touched.email ? "border-destructive" : ""}`
												})]
											}),
											errors.email && touched.email && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-destructive flex items-center gap-1 mt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.email })]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												htmlFor: "phone",
												className: "block text-xs font-medium text-foreground",
												children: ["Phone Number ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-destructive font-bold",
													children: "*"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex gap-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: countryCode,
													onValueChange: setCountryCode,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
														className: "w-[125px] shrink-0 text-xs h-11 rounded-xl px-3",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
														className: "bg-popover border-border text-popover-foreground text-xs rounded-xl shadow-lg",
														children: COUNTRY_CODES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem, {
															value: c.code,
															children: [
																c.flag,
																" ",
																c.code
															]
														}, c.code))
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative flex-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														id: "phone",
														type: "tel",
														required: true,
														value: phone,
														placeholder: "98765 43210",
														onChange: (e) => {
															setPhone(e.target.value);
															if (errors.phone) setErrors((p) => {
																const n = { ...p };
																delete n.phone;
																return n;
															});
														},
														onBlur: () => handleBlur("phone"),
														className: `pl-10 h-11 rounded-xl text-sm ${errors.phone && touched.phone ? "border-destructive" : ""}`
													})]
												})]
											}),
											errors.phone && touched.phone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-destructive flex items-center gap-1 mt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.phone })]
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4 pt-4 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "grid h-5 w-5 place-items-center rounded-full bg-primary/10 text-primary text-[11px] font-bold",
										children: "2"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-xs font-bold text-foreground uppercase tracking-wider",
										children: "Current Location"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-3.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													htmlFor: "city",
													className: "block text-xs font-medium text-foreground",
													children: ["City ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-destructive font-bold",
														children: "*"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "city",
													type: "text",
													required: true,
													value: city,
													placeholder: "e.g. Bangalore",
													onChange: (e) => {
														setCity(e.target.value);
														if (errors.city) setErrors((p) => {
															const n = { ...p };
															delete n.city;
															return n;
														});
													},
													onBlur: () => handleBlur("city"),
													className: `h-11 rounded-xl text-sm px-4 ${errors.city && touched.city ? "border-destructive" : ""}`
												}),
												errors.city && touched.city && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-destructive flex items-center gap-1 mt-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.city })]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													htmlFor: "state",
													className: "block text-xs font-medium text-foreground",
													children: ["State / Province ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-destructive font-bold",
														children: "*"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "state",
													type: "text",
													required: true,
													value: state,
													placeholder: "e.g. Karnataka",
													onChange: (e) => {
														setState(e.target.value);
														if (errors.state) setErrors((p) => {
															const n = { ...p };
															delete n.state;
															return n;
														});
													},
													onBlur: () => handleBlur("state"),
													className: `h-11 rounded-xl text-sm px-4 ${errors.state && touched.state ? "border-destructive" : ""}`
												}),
												errors.state && touched.state && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-destructive flex items-center gap-1 mt-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.state })]
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													htmlFor: "country",
													className: "block text-xs font-medium text-foreground",
													children: ["Country ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-destructive font-bold",
														children: "*"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "country",
													type: "text",
													required: true,
													value: country,
													placeholder: "e.g. India",
													onChange: (e) => {
														setCountry(e.target.value);
														if (errors.country) setErrors((p) => {
															const n = { ...p };
															delete n.country;
															return n;
														});
													},
													onBlur: () => handleBlur("country"),
													className: `h-11 rounded-xl text-sm px-4 ${errors.country && touched.country ? "border-destructive" : ""}`
												}),
												errors.country && touched.country && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-destructive flex items-center gap-1 mt-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.country })]
												})
											]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4 pt-4 border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-5 w-5 place-items-center rounded-full bg-primary/10 text-primary text-[11px] font-bold",
											children: "3"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-xs font-bold text-foreground uppercase tracking-wider",
											children: "Professional Details"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													htmlFor: "exp",
													className: "block text-xs font-medium text-foreground",
													children: ["Total Experience (Years) ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-destructive font-bold",
														children: "*"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "exp",
													type: "number",
													min: "0",
													step: "0.5",
													required: true,
													value: experienceYears,
													placeholder: "e.g. 5.5",
													onChange: (e) => {
														setExperienceYears(e.target.value);
														if (errors.experienceYears) setErrors((p) => {
															const n = { ...p };
															delete n.experienceYears;
															return n;
														});
													},
													onBlur: () => handleBlur("experienceYears"),
													className: `h-11 rounded-xl text-sm px-4 ${errors.experienceYears && touched.experienceYears ? "border-destructive" : ""}`
												}),
												errors.experienceYears && touched.experienceYears && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-destructive flex items-center gap-1 mt-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.experienceYears })]
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "block text-xs font-medium text-foreground",
													children: ["Highest Qualification ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-destructive font-bold",
														children: "*"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: highestQualification,
													onValueChange: (val) => {
														setHighestQualification(val);
														if (errors.highestQualification) setErrors((p) => {
															const n = { ...p };
															delete n.highestQualification;
															return n;
														});
													},
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
														className: `w-full text-sm h-11 rounded-xl px-4 ${errors.highestQualification && touched.highestQualification ? "border-destructive" : ""}`,
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select degree / qualification" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
														className: "bg-popover border-border text-popover-foreground text-xs max-h-60 rounded-xl shadow-lg",
														children: QUALIFICATION_OPTIONS.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
															value: q,
															children: q
														}, q))
													})]
												}),
												errors.highestQualification && touched.highestQualification && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-destructive flex items-center gap-1 mt-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.highestQualification })]
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												htmlFor: "company",
												className: "block text-xs font-medium text-foreground",
												children: "Current / Most Recent Company"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "company",
													placeholder: "e.g. Razorpay / Microsoft",
													value: currentCompany,
													onChange: (e) => setCurrentCompany(e.target.value),
													className: "pl-10 h-11 rounded-xl text-sm"
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												htmlFor: "designation",
												className: "block text-xs font-medium text-foreground",
												children: "Current Designation / Job Title"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "designation",
													placeholder: "e.g. Senior Software Engineer",
													value: currentDesignation,
													onChange: (e) => setCurrentDesignation(e.target.value),
													className: "pl-10 h-11 rounded-xl text-sm"
												})]
											})]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4 pt-4 border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-5 w-5 place-items-center rounded-full bg-primary/10 text-primary text-[11px] font-bold",
											children: "4"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-xs font-bold text-foreground uppercase tracking-wider",
											children: "Compensation & Availability"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												htmlFor: "currentCtc",
												className: "block text-xs font-medium text-foreground",
												children: "Current CTC (Annual INR)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "currentCtc",
													type: "number",
													placeholder: "e.g. 2400000",
													value: currentCtc,
													onChange: (e) => setCurrentCtc(e.target.value),
													className: "pl-10 h-11 rounded-xl text-sm"
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												htmlFor: "expectedCtc",
												className: "block text-xs font-medium text-foreground",
												children: "Expected CTC (Annual INR)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "expectedCtc",
													type: "number",
													placeholder: "e.g. 3200000",
													value: expectedCtc,
													onChange: (e) => setExpectedCtc(e.target.value),
													className: "pl-10 h-11 rounded-xl text-sm"
												})]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-xs font-medium text-foreground",
											children: "Notice Period / Joining Availability"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
											value: noticePeriod,
											onValueChange: setNoticePeriod,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
												className: "w-full text-sm h-11 rounded-xl px-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select current notice period" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, {
												className: "bg-popover border-border text-popover-foreground text-xs rounded-xl shadow-lg",
												children: NOTICE_PERIOD_OPTIONS.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: opt,
													children: opt
												}, opt))
											})]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4 pt-4 border-t border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "grid h-5 w-5 place-items-center rounded-full bg-primary/10 text-primary text-[11px] font-bold",
											children: "5"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-xs font-bold text-foreground uppercase tracking-wider",
											children: "Online Profiles & Note"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												htmlFor: "linkedin",
												className: "block text-xs font-medium text-foreground",
												children: "LinkedIn Profile URL"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, { className: "absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "linkedin",
													placeholder: "https://linkedin.com/in/username",
													type: "url",
													value: linkedinUrl,
													onChange: (e) => setLinkedinUrl(e.target.value),
													className: "pl-10 h-11 rounded-xl text-sm"
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												htmlFor: "portfolio",
												className: "block text-xs font-medium text-foreground",
												children: "GitHub / Portfolio URL"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "portfolio",
													placeholder: "https://github.com/username",
													type: "url",
													value: portfolioUrl,
													onChange: (e) => setPortfolioUrl(e.target.value),
													className: "pl-10 h-11 rounded-xl text-sm"
												})]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											htmlFor: "coverLetter",
											className: "block text-xs font-medium text-foreground",
											children: ["Cover Letter or Introduction ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted-foreground font-normal",
												children: "(Optional)"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											id: "coverLetter",
											rows: 3,
											placeholder: "Tell us about relevant projects, architecture experience, or what excites you about building at OFC360...",
											value: coverLetter,
											onChange: (e) => setCoverLetter(e.target.value),
											className: "rounded-xl text-sm p-3.5 leading-relaxed resize-none"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									htmlFor: "declaration",
									className: `flex items-start gap-3.5 p-4 rounded-2xl border transition-all cursor-pointer select-none ${errors.declaration && touched.declaration ? "border-destructive bg-destructive/5" : declarationChecked ? "border-primary/40 bg-primary/5" : "border-border bg-card hover:bg-muted/50"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
										id: "declaration",
										checked: declarationChecked,
										onCheckedChange: (checked) => {
											setDeclarationChecked(!!checked);
											if (errors.declaration) setErrors((p) => {
												const n = { ...p };
												delete n.declaration;
												return n;
											});
										},
										className: "mt-0.5"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5 text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-foreground font-medium leading-relaxed block",
											children: ["I certify that all details provided in this application are accurate and complete to the best of my knowledge. ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-destructive font-bold",
												children: "*"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[11px] text-muted-foreground leading-normal block",
											children: "By submitting, you agree to our candidate privacy policy and processing of your application for talent evaluation."
										})]
									})]
								}), errors.declaration && touched.declaration && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-destructive flex items-center gap-1.5 mt-1.5 ml-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3.5 w-3.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: errors.declaration })]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "pt-2 flex justify-end",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									disabled: submitting,
									className: "w-auto h-10 px-6 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm tracking-wide",
									children: submitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Submitting..." })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Submit Application" })] })
								})
							})
						]
					})]
				})]
			})
		]
	}) });
}
//#endregion
export { JobApplyPage as default };
