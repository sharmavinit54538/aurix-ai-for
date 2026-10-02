import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Ar as Check, Br as Calendar, Bt as MapPin, Dr as ChevronRight, F as Tag, H as Sparkles, Jn as Eye, Jr as Briefcase, Pt as Minimize2, Q as Send, Sr as CircleCheck, St as PenLine, Tr as CircleAlert, U as Smile, a as X, an as Layers, di as ArrowLeft, ht as Plus, k as Trash2, or as Copy, p as Users, q as ShieldCheck, qt as LoaderCircle, tr as DollarSign, u as WandSparkles, zt as Maximize2 } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as api } from "./apiInstance-C5A0vaLH.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { t as Markdown } from "../_libs/react-markdown+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/NewJobPage-CoYVJA6a.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DEPARTMENTS = [
	"Engineering",
	"Product Management",
	"Design & Creative",
	"Sales & Business Dev",
	"Marketing & Growth",
	"Human Resources",
	"Finance & Accounting",
	"Operations",
	"Customer Support",
	"Legal & Compliance",
	"Data & AI Analytics",
	"Other"
];
var EMPLOYMENT_TYPES = [
	"Full-time",
	"Part-time",
	"Contract",
	"Internship",
	"Temporary"
];
var WORK_MODES = [
	"Remote",
	"Hybrid",
	"Onsite"
];
var EXPERIENCE_OPTIONS = [
	"0-1 yr (Entry Level)",
	"1-3 yrs (Junior)",
	"3-5 yrs (Mid-Level)",
	"5-8 yrs (Senior)",
	"8+ yrs (Lead / Principal)",
	"10+ yrs (Director / Executive)"
];
var SUGGESTED_SKILLS = [
	"React",
	"TypeScript",
	"Python",
	"FastAPI",
	"PostgreSQL",
	"Docker",
	"AWS",
	"Figma",
	"Node.js",
	"GraphQL",
	"Kubernetes",
	"Leadership",
	"Product Strategy",
	"Machine Learning",
	"Excel"
];
var POPULAR_LOCATIONS = [
	"Remote",
	"Bangalore, India",
	"Hyderabad, India",
	"Pune, India",
	"Mumbai, India",
	"Delhi NCR, India",
	"San Francisco, USA",
	"New York, USA",
	"London, UK"
];
var CURRENCIES = [
	"INR",
	"USD",
	"EUR",
	"GBP"
];
function MarkdownRenderer({ content }) {
	const text = typeof content === "string" ? content : content && typeof content === "object" && "description" in content ? String(content.description) : String(content || "");
	if (!text.trim()) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col items-center justify-center py-12 text-center text-muted-foreground border border-dashed border-border/70 rounded-xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-8 w-8 mb-2 opacity-40" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: "No description written yet."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground/70 mt-1",
				children: "Switch to the \"Write\" tab or use OFC360 to generate one."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-1 text-muted-foreground prose dark:prose-invert max-w-none text-sm leading-relaxed",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Markdown, {
			skipHtml: true,
			components: {
				h1: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-display font-bold text-foreground mt-6 mb-3 border-b border-border/80 pb-1.5",
					children
				}),
				h2: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-xl font-display font-bold text-foreground mt-5 mb-2.5",
					children
				}),
				h3: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-lg font-semibold text-foreground mt-4 mb-2",
					children
				}),
				ul: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "my-2 space-y-1",
					children
				}),
				ol: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "my-2 list-decimal ml-5 space-y-1",
					children
				}),
				li: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "ml-5 list-disc text-sm text-muted-foreground my-1",
					children
				}),
				strong: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
					className: "font-semibold text-foreground",
					children
				}),
				em: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
					className: "italic text-foreground/90",
					children
				}),
				p: ({ children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground leading-relaxed my-2.5",
					children
				})
			},
			children: text
		})
	});
}
function NewJobPage() {
	const navigate = useNavigate();
	const { upsertJob } = useRecruitment();
	const [title, setTitle] = (0, import_react.useState)("");
	const [department, setDepartment] = (0, import_react.useState)("Engineering");
	const [customDepartment, setCustomDepartment] = (0, import_react.useState)("");
	const [location, setLocation] = (0, import_react.useState)("Remote");
	const [locationSearch, setLocationSearch] = (0, import_react.useState)("Remote");
	const [showLocationSuggestions, setShowLocationSuggestions] = (0, import_react.useState)(false);
	const [employmentType, setEmploymentType] = (0, import_react.useState)("Full-time");
	const [workMode, setWorkMode] = (0, import_react.useState)("Remote");
	const [experience, setExperience] = (0, import_react.useState)("3-5 yrs (Mid-Level)");
	const [vacancies, setVacancies] = (0, import_react.useState)(1);
	const [currency, setCurrency] = (0, import_react.useState)("INR");
	const [salaryMin, setSalaryMin] = (0, import_react.useState)("800000");
	const [salaryMax, setSalaryMax] = (0, import_react.useState)("1600000");
	const [closingDate, setClosingDate] = (0, import_react.useState)((0, import_react.useMemo)(() => {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() + 30);
		return d.toISOString().split("T")[0];
	}, []));
	const [jobStatus, setJobStatus] = (0, import_react.useState)("active");
	const [skills, setSkills] = (0, import_react.useState)(["React", "TypeScript"]);
	const [skillInput, setSkillInput] = (0, import_react.useState)("");
	const [responsibilities, setResponsibilities] = (0, import_react.useState)([
		"Architect, build, and maintain efficient, reusable, and reliable frontend code.",
		"Collaborate with product managers and designers to translate requirements into technical designs.",
		"Participate in code reviews, design discussions, and system architecture planning."
	]);
	const [newRespInput, setNewRespInput] = (0, import_react.useState)("");
	const [requirements, setRequirements] = (0, import_react.useState)([
		"Proven experience building production-grade web applications.",
		"Strong proficiency in modern JavaScript, TypeScript, and React frameworks.",
		"Familiarity with REST APIs, state management, and modern CSS tooling."
	]);
	const [newReqInput, setNewReqInput] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("### About The Role\nWe are looking for a dedicated and skilled professional to join our fast-paced enterprise platform team. In this role, you will lead development efforts, contribute to strategic architecture, and build mission-critical solutions.\n\n### What We Offer\n- Competitive compensation and performance bonuses\n- Comprehensive health insurance and wellness benefits\n- Flexible work arrangements and continuous learning opportunities");
	const [editorTab, setEditorTab] = (0, import_react.useState)("preview");
	const [isGeneratingAi, setIsGeneratingAi] = (0, import_react.useState)(false);
	const [isRefiningAi, setIsRefiningAi] = (0, import_react.useState)(false);
	const [aiCustomInstruction, setAiCustomInstruction] = (0, import_react.useState)("");
	const [aiPanelOpen, setAiPanelOpen] = (0, import_react.useState)(false);
	const [formErrors, setFormErrors] = (0, import_react.useState)({});
	const [isSubmitting, setIsSubmitting] = (0, import_react.useState)(false);
	const [submitError, setSubmitError] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const locationRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		function handleClickOutside(event) {
			if (locationRef.current && !locationRef.current.contains(event.target)) setShowLocationSuggestions(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const filteredLocations = (0, import_react.useMemo)(() => {
		if (!locationSearch.trim()) return POPULAR_LOCATIONS;
		return POPULAR_LOCATIONS.filter((loc) => loc.toLowerCase().includes(locationSearch.toLowerCase()));
	}, [locationSearch]);
	const handleAddSkill = (skill) => {
		const trimmed = skill.trim();
		if (trimmed && !skills.includes(trimmed)) {
			setSkills((prev) => [...prev, trimmed]);
			if (formErrors.skills) setFormErrors((prev) => {
				const updated = { ...prev };
				delete updated.skills;
				return updated;
			});
		}
		setSkillInput("");
	};
	const handleRemoveSkill = (skillToRemove) => {
		setSkills((prev) => prev.filter((s) => s !== skillToRemove));
	};
	const handleAddResponsibility = () => {
		if (newRespInput.trim()) {
			setResponsibilities((prev) => [...prev, newRespInput.trim()]);
			setNewRespInput("");
		}
	};
	const handleRemoveResponsibility = (index) => {
		setResponsibilities((prev) => prev.filter((_, i) => i !== index));
	};
	const handleAddRequirement = () => {
		if (newReqInput.trim()) {
			setRequirements((prev) => [...prev, newReqInput.trim()]);
			setNewReqInput("");
		}
	};
	const handleRemoveRequirement = (index) => {
		setRequirements((prev) => prev.filter((_, i) => i !== index));
	};
	const handleCopyJd = () => {
		navigator.clipboard.writeText(description);
		setCopied(true);
		toast.success("Job description copied to clipboard");
		setTimeout(() => setCopied(false), 2e3);
	};
	const handleGenerateJdWithAi = async () => {
		if (!title.trim()) {
			setFormErrors((prev) => ({
				...prev,
				title: "Job Title is required before generating description with AI."
			}));
			toast.error("Please provide a Job Title first.");
			return;
		}
		setIsGeneratingAi(true);
		setSubmitError(null);
		toast.info("OFC360 is drafting job requirements...");
		const effectiveDept = department === "Other" && customDepartment ? customDepartment : department;
		try {
			const response = await api.post("/jobs/generate-description", {
				title: title.trim(),
				department: effectiveDept,
				employment_type: employmentType,
				location: location.trim(),
				skills: skills.length > 0 ? skills : ["Problem Solving", "Collaboration"],
				experience
			}, { timeout: 45e3 });
			let generatedContent = "";
			if (typeof response === "string") generatedContent = response;
			else if (response && typeof response.data === "string") generatedContent = response.data;
			else if (response?.data?.description) generatedContent = response.data.description;
			else if (response?.description) generatedContent = response.description;
			else if (response?.data && typeof response.data === "object") generatedContent = response.data.generated_jd || response.data.content || JSON.stringify(response.data, null, 2);
			if (generatedContent && typeof generatedContent === "string") {
				setDescription(generatedContent);
				setEditorTab("preview");
				toast.success("AI generated job description loaded!");
			} else throw new Error(response?.message || "AI returned empty content");
		} catch (err) {
			console.warn("AI generation offline or unavailable:", err);
			toast.warning("AI service is currently offline or unreachable. You can continue writing manually.");
		} finally {
			setIsGeneratingAi(false);
		}
	};
	const handleModifyJdWithAi = async (action, customPrompt) => {
		if (!description.trim()) {
			toast.error("Please add some description text first.");
			return;
		}
		setIsRefiningAi(true);
		toast.info("OFC360 is refining description...");
		try {
			const response = await api.post("/jobs/modify-description", {
				current_description: description,
				action,
				custom_instruction: customPrompt
			}, { timeout: 45e3 });
			let refinedContent = "";
			if (typeof response === "string") refinedContent = response;
			else if (response && typeof response.data === "string") refinedContent = response.data;
			else if (response?.data?.description) refinedContent = response.data.description;
			else if (response?.description) refinedContent = response.description;
			if (refinedContent) {
				setDescription(refinedContent);
				if (action === "custom") setAiCustomInstruction("");
				toast.success("Job description updated with AI adjustments!");
			} else throw new Error(response?.message || "Failed to refine description");
		} catch (err) {
			console.warn("AI refinement error:", err);
			toast.warning("AI modification unavailable: " + (err.message || "service error"));
		} finally {
			setIsRefiningAi(false);
		}
	};
	const validate = (targetStatus) => {
		const errors = {};
		if (!title.trim()) errors.title = "Job title is required.";
		if (department === "Other" && !customDepartment.trim()) errors.department = "Please specify the custom department name.";
		if (!location.trim()) errors.location = "Job location is required.";
		if (skills.length === 0) errors.skills = "At least one required skill must be added.";
		if (!description.trim()) errors.description = "Job description is required.";
		else if (description.trim().length < 20) errors.description = "Description is too short. Please provide at least 20 characters.";
		const minNum = parseFloat(salaryMin);
		const maxNum = parseFloat(salaryMax);
		if (!isNaN(minNum) && !isNaN(maxNum) && minNum > maxNum) errors.salary = "Minimum salary cannot exceed maximum salary.";
		if (vacancies < 1) errors.vacancies = "Number of openings must be at least 1.";
		if (targetStatus === "active") {
			if (responsibilities.length === 0) errors.responsibilities = "Please add at least one key responsibility.";
			if (requirements.length === 0) errors.requirements = "Please add at least one qualification/requirement.";
		}
		setFormErrors(errors);
		return Object.keys(errors).length === 0;
	};
	const handleSubmitJob = async (statusToSave) => {
		setSubmitError(null);
		if (!validate(statusToSave)) {
			toast.error("Please resolve the highlighted validation errors.");
			return;
		}
		setIsSubmitting(true);
		const effectiveDepartment = department === "Other" && customDepartment.trim() ? customDepartment.trim() : department;
		const minSal = parseFloat(salaryMin) || 0;
		const maxSal = parseFloat(salaryMax) || minSal;
		const nowIso = (/* @__PURE__ */ new Date()).toISOString();
		const closeIso = closingDate ? new Date(closingDate).toISOString() : new Date(Date.now() + 720 * 60 * 60 * 1e3).toISOString();
		const jobPayload = {
			id: "",
			title: title.trim(),
			department: effectiveDepartment,
			employmentType,
			experience,
			skills,
			salaryMin: minSal,
			salaryMax: maxSal,
			currency,
			vacancies: Number(vacancies) || 1,
			location: location.trim(),
			workMode,
			description: description.trim(),
			responsibilities,
			requirements,
			benefits: [
				"Health & Life Insurance",
				"Learning and Conference Budget",
				"Performance Bonus and Equity Options",
				"Flexible Remote Work Options"
			],
			hiringManager: "Department Lead",
			recruiter: "Recruitment Operations",
			status: statusToSave,
			publishedAt: nowIso,
			closingAt: closeIso,
			applicants: 0
		};
		try {
			const response = await upsertJob(jobPayload);
			const createdId = response?.id || response?.data?.id || response?.data?.job?.id || response?.data;
			toast.success(statusToSave === "active" ? "Job posting published successfully!" : "Job draft saved successfully!");
			if (typeof createdId === "string" && createdId.length > 5) navigate({
				to: "/dashboard/recruitment/jobs/$jobId",
				params: { jobId: createdId }
			});
			else navigate({ to: "/dashboard/recruitment/jobs" });
		} catch (err) {
			console.error("Job creation error:", err);
			const message = err.message || "Failed to create job posting. Please try again.";
			setSubmitError(message);
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "pb-28",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex items-center justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/recruitment",
							className: "hover:text-foreground transition-colors",
							children: "Recruitment"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground/50" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/dashboard/recruitment/jobs",
							className: "hover:text-foreground transition-colors",
							children: "Jobs"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3.5 w-3.5 text-muted-foreground/50" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground font-medium",
							children: "New Position"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Create New Job Requisition",
				description: "Specify job requirements, role parameters, compensation, and let OFC360 assist in drafting job descriptions."
			}),
			submitError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5 shrink-0" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: "Creation Error"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-destructive/80 mt-0.5",
							children: submitError
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "ghost",
						onClick: () => setSubmitError(null),
						className: "text-destructive hover:bg-destructive/20 h-7 px-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-8 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card/65 p-6 backdrop-blur-xl shadow-lg space-y-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-border/60 pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-base font-semibold text-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4 text-primary" }), "Basic Role Information"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground",
									children: "* Required fields"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											htmlFor: "title",
											className: "text-sm font-medium text-foreground flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Job Title ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-destructive",
												children: "*"
											})] }), formErrors.title && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-destructive",
												children: formErrors.title
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "title",
											value: title,
											onChange: (e) => {
												setTitle(e.target.value);
												if (formErrors.title) setFormErrors((prev) => {
													const next = { ...prev };
													delete next.title;
													return next;
												});
											},
											placeholder: "e.g. Senior Full-Stack Engineer, Talent Acquisition Manager",
											className: `h-11 rounded-xl bg-background/50 text-sm ${formErrors.title ? "border-destructive focus-visible:ring-destructive" : "border-border/80"}`
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
													htmlFor: "department",
													className: "text-sm font-medium text-foreground flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Department ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-destructive",
														children: "*"
													})] }), formErrors.department && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-destructive",
														children: formErrors.department
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
													value: department,
													onValueChange: setDepartment,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
														id: "department",
														className: "h-11 rounded-xl bg-background/50 border-border/80 text-sm",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Department" })
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DEPARTMENTS.map((dept) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
														value: dept,
														children: dept
													}, dept)) })]
												}),
												department === "Other" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													value: customDepartment,
													onChange: (e) => setCustomDepartment(e.target.value),
													placeholder: "Specify custom department",
													className: "mt-2 h-10 rounded-xl bg-background/50 border-border/80 text-sm"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "experience",
												className: "text-sm font-medium text-foreground",
												children: "Experience Level"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: experience,
												onValueChange: setExperience,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													id: "experience",
													className: "h-11 rounded-xl bg-background/50 border-border/80 text-sm",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Experience Level" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: EXPERIENCE_OPTIONS.map((exp) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: exp,
													children: exp
												}, exp)) })]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												htmlFor: "employmentType",
												className: "text-sm font-medium text-foreground",
												children: ["Employment Type ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-destructive",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: employmentType,
												onValueChange: (val) => setEmploymentType(val),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													id: "employmentType",
													className: "h-11 rounded-xl bg-background/50 border-border/80 text-sm",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Employment Type" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: EMPLOYMENT_TYPES.map((type) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: type,
													children: type
												}, type)) })]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												htmlFor: "workMode",
												className: "text-sm font-medium text-foreground",
												children: ["Work Mode ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-destructive",
													children: "*"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: workMode,
												onValueChange: (val) => setWorkMode(val),
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													id: "workMode",
													className: "h-11 rounded-xl bg-background/50 border-border/80 text-sm",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select Work Mode" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: WORK_MODES.map((mode) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: mode,
													children: mode
												}, mode)) })]
											})]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										ref: locationRef,
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												htmlFor: "location",
												className: "text-sm font-medium text-foreground flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1.5",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-muted-foreground" }),
														"Office Location ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-destructive",
															children: "*"
														})
													]
												}), formErrors.location && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-destructive",
													children: formErrors.location
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "relative",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "location",
													value: locationSearch,
													onChange: (e) => {
														setLocationSearch(e.target.value);
														setLocation(e.target.value);
														setShowLocationSuggestions(true);
														if (formErrors.location) setFormErrors((prev) => {
															const next = { ...prev };
															delete next.location;
															return next;
														});
													},
													onFocus: () => setShowLocationSuggestions(true),
													placeholder: "e.g. Remote, Bangalore, San Francisco",
													className: "h-11 rounded-xl bg-background/50 border-border/80 text-sm"
												}), showLocationSuggestions && filteredLocations.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "absolute left-0 right-0 mt-1.5 bg-popover border border-border shadow-2xl rounded-xl z-50 overflow-hidden max-h-48 overflow-y-auto backdrop-blur-2xl",
													children: filteredLocations.map((loc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
														type: "button",
														onClick: () => {
															setLocation(loc);
															setLocationSearch(loc);
															setShowLocationSuggestions(false);
														},
														className: "w-full text-left px-4 py-2 text-xs hover:bg-accent transition-colors flex items-center gap-2 border-b border-border/30 last:border-b-0",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: loc })]
													}, loc))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex flex-wrap gap-1.5 pt-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[11px] text-muted-foreground self-center mr-1",
													children: "Quick select:"
												}), POPULAR_LOCATIONS.slice(0, 5).map((loc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => {
														setLocation(loc);
														setLocationSearch(loc);
													},
													className: `text-[11px] px-2 py-0.5 rounded-lg border transition-all ${location === loc ? "bg-primary text-primary-foreground border-primary" : "bg-background/40 hover:bg-accent text-muted-foreground border-border/60"}`,
													children: loc
												}, loc))]
											})
										]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card/65 p-6 backdrop-blur-xl shadow-lg space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center justify-between border-b border-border/60 pb-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-base font-semibold text-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DollarSign, { className: "h-4 w-4 text-emerald-500" }), "Compensation, Openings & Timeline"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												htmlFor: "vacancies",
												className: "text-sm font-medium text-foreground flex items-center gap-1.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-3.5 w-3.5 text-muted-foreground" }),
													"Openings ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-destructive",
														children: "*"
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "vacancies",
												type: "number",
												min: 1,
												value: vacancies,
												onChange: (e) => setVacancies(Math.max(1, parseInt(e.target.value) || 1)),
												className: "h-11 rounded-xl bg-background/50 border-border/80 text-sm"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "currency",
												className: "text-sm font-medium text-foreground",
												children: "Currency"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
												value: currency,
												onValueChange: setCurrency,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
													id: "currency",
													className: "h-11 rounded-xl bg-background/50 border-border/80 text-sm",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Currency" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: CURRENCIES.map((curr) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
													value: curr,
													children: curr
												}, curr)) })]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
												htmlFor: "closingDate",
												className: "text-sm font-medium text-foreground flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, { className: "h-3.5 w-3.5 text-muted-foreground" }), "Application Deadline"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "closingDate",
												type: "date",
												value: closingDate,
												onChange: (e) => setClosingDate(e.target.value),
												className: "h-11 rounded-xl bg-background/50 border-border/80 text-sm"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
											className: "text-sm font-medium text-foreground",
											children: [
												"Annual Salary Range (",
												currency,
												")"
											]
										}), formErrors.salary && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-destructive",
											children: formErrors.salary
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground",
												children: "Min"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: salaryMin,
												onChange: (e) => setSalaryMin(e.target.value),
												placeholder: "e.g. 800000",
												className: "h-11 rounded-xl bg-background/50 border-border/80 pl-12 text-sm"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground",
												children: "Max"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: salaryMax,
												onChange: (e) => setSalaryMax(e.target.value),
												placeholder: "e.g. 1500000",
												className: "h-11 rounded-xl bg-background/50 border-border/80 pl-12 text-sm"
											})]
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card/65 p-6 backdrop-blur-xl shadow-lg space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border/60 pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-base font-semibold text-foreground flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4 text-violet-500" }),
											"Required Skills & Competencies ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-destructive",
												children: "*"
											})
										]
									}), formErrors.skills && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-destructive",
										children: formErrors.skills
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: skillInput,
										onChange: (e) => setSkillInput(e.target.value),
										onKeyDown: (e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleAddSkill(skillInput);
											}
										},
										placeholder: "Type a skill (e.g. Next.js, System Design) and press Enter",
										className: "h-11 rounded-xl bg-background/50 border-border/80 text-sm"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "secondary",
										onClick: () => handleAddSkill(skillInput),
										className: "h-11 rounded-xl px-5 border border-border/80",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4 mr-1.5" }), " Add"]
									})]
								}),
								skills.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex flex-wrap gap-2 p-3 bg-background/40 rounded-xl border border-border/60",
									children: skills.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
										variant: "secondary",
										className: "py-1 px-2.5 text-xs rounded-lg flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/25",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: s }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => handleRemoveSkill(s),
											className: "hover:text-destructive focus:outline-none transition-colors",
											title: `Remove ${s}`,
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3 w-3" })
										})]
									}, s))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "Quick add suggested skills:"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1.5",
										children: SUGGESTED_SKILLS.map((s) => {
											const exists = skills.includes(s);
											return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => exists ? handleRemoveSkill(s) : handleAddSkill(s),
												className: `text-xs px-2.5 py-1 rounded-lg border transition-all ${exists ? "bg-primary text-primary-foreground border-primary" : "bg-background/40 hover:bg-accent text-muted-foreground border-border/60"}`,
												children: exists ? `✓ ${s}` : `+ ${s}`
											}, s);
										})
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card/65 p-6 backdrop-blur-xl shadow-lg space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-b border-border/60 pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-base font-semibold text-foreground flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-emerald-500" }), "Responsibilities & Qualifications"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-0.5",
										children: "Outline explicit expectations and prerequisites for applicants."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-sm font-medium text-foreground",
												children: "Key Responsibilities"
											}), formErrors.responsibilities && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-destructive",
												children: formErrors.responsibilities
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: responsibilities.map((resp, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start gap-2.5 p-2.5 bg-background/40 rounded-xl border border-border/60 group",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-muted-foreground flex-1 leading-relaxed",
														children: resp
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => handleRemoveResponsibility(idx),
														className: "text-muted-foreground/50 hover:text-destructive transition-colors p-1",
														title: "Remove responsibility",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
													})
												]
											}, idx))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: newRespInput,
												onChange: (e) => setNewRespInput(e.target.value),
												onKeyDown: (e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														handleAddResponsibility();
													}
												},
												placeholder: "e.g. Design and implement microservices in Go or Python",
												className: "h-10 rounded-xl bg-background/50 border-border/80 text-xs"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												variant: "outline",
												size: "sm",
												onClick: handleAddResponsibility,
												className: "rounded-xl border-border/80 h-10 px-4 text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1" }), " Add"]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-border/50" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												className: "text-sm font-medium text-foreground",
												children: "Qualifications & Requirements"
											}), formErrors.requirements && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-destructive",
												children: formErrors.requirements
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "space-y-2",
											children: requirements.map((req, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-start gap-2.5 p-2.5 bg-background/40 rounded-xl border border-border/60 group",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-xs text-muted-foreground flex-1 leading-relaxed",
														children: req
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => handleRemoveRequirement(idx),
														className: "text-muted-foreground/50 hover:text-destructive transition-colors p-1",
														title: "Remove qualification",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
													})
												]
											}, idx))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: newReqInput,
												onChange: (e) => setNewReqInput(e.target.value),
												onKeyDown: (e) => {
													if (e.key === "Enter") {
														e.preventDefault();
														handleAddRequirement();
													}
												},
												placeholder: "e.g. Bachelor's degree in Computer Science or equivalent experience",
												className: "h-10 rounded-xl bg-background/50 border-border/80 text-xs"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												type: "button",
												variant: "outline",
												size: "sm",
												onClick: handleAddRequirement,
												className: "rounded-xl border-border/80 h-10 px-4 text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5 mr-1" }), " Add"]
											})]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-card/65 p-6 backdrop-blur-xl shadow-lg space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-base font-semibold text-foreground flex items-center gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-4 w-4 text-primary" }),
											"Full Job Description ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-destructive",
												children: "*"
											})
										]
									}), formErrors.description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-destructive block mt-0.5",
										children: formErrors.description
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											size: "sm",
											onClick: handleGenerateJdWithAi,
											disabled: isGeneratingAi || isRefiningAi,
											className: "rounded-xl h-8 px-3 bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 text-xs font-medium",
											children: isGeneratingAi ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 mr-1.5 animate-spin" }), "Drafting..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5 mr-1.5" }), "Generate with AI"] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex rounded-xl bg-background/60 p-0.5 border border-border/80",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setEditorTab("preview"),
												className: `px-3 py-1 rounded-lg text-xs font-medium transition-all ${editorTab === "preview" ? "bg-card text-foreground shadow-sm border border-border/80" : "text-muted-foreground hover:text-foreground"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3 w-3 inline mr-1" }), " Preview"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												type: "button",
												onClick: () => setEditorTab("write"),
												className: `px-3 py-1 rounded-lg text-xs font-medium transition-all ${editorTab === "write" ? "bg-card text-foreground shadow-sm border border-border/80" : "text-muted-foreground hover:text-foreground"}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "h-3 w-3 inline mr-1" }), " Write"]
											})]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "min-h-[380px]",
									children: editorTab === "write" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
										value: description,
										onChange: (e) => {
											setDescription(e.target.value);
											if (formErrors.description) setFormErrors((prev) => {
												const next = { ...prev };
												delete next.description;
												return next;
											});
										},
										rows: 16,
										placeholder: "Write job description in markdown...",
										className: "w-full bg-background/40 border border-border/80 focus:border-primary/50 rounded-xl p-4 font-mono text-xs leading-relaxed resize-y"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-4 bg-background/25 border border-border/60 rounded-xl min-h-[380px] max-h-[500px] overflow-y-auto",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkdownRenderer, { content: description })
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between pt-2 border-t border-border/40 text-xs text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Supports Markdown headings (#, ##), bullets (-), and bold (**text**)." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										type: "button",
										variant: "ghost",
										size: "sm",
										onClick: handleCopyJd,
										className: "h-7 text-xs text-muted-foreground hover:text-foreground",
										children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5 text-emerald-500 mr-1" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "h-3.5 w-3.5 mr-1" }), copied ? "Copied" : "Copy Description"]
									})]
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-4 space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/65 p-5 backdrop-blur-xl shadow-lg relative overflow-hidden space-y-4 before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-violet-500 before:via-primary before:to-fuchsia-500",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "text-sm font-bold text-foreground flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "p-1 rounded-lg bg-primary/10 text-primary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" })
									}), "OFC360 Copilot"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "outline",
									className: "text-[10px] text-primary border-primary/30 bg-primary/5",
									children: "Assisted"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground leading-relaxed",
								children: "Use generative AI to polish wording, reformat structure, or customize requirements based on your team needs."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										className: "text-xs font-medium text-foreground",
										children: "Custom AI Instruction"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
											value: aiCustomInstruction,
											onChange: (e) => setAiCustomInstruction(e.target.value),
											placeholder: "e.g. Add 3 bonus qualifications or emphasize hybrid perks...",
											disabled: isRefiningAi,
											rows: 3,
											className: "text-xs bg-background/50 border-border/80 rounded-xl pr-10 resize-none",
											onKeyDown: (e) => {
												if (e.key === "Enter" && !e.shiftKey) {
													e.preventDefault();
													if (aiCustomInstruction.trim()) handleModifyJdWithAi("custom", aiCustomInstruction);
												}
											}
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											size: "icon",
											variant: "ghost",
											onClick: () => {
												if (aiCustomInstruction.trim()) handleModifyJdWithAi("custom", aiCustomInstruction);
											},
											disabled: isRefiningAi || !aiCustomInstruction.trim(),
											className: "absolute bottom-2 right-2 h-7 w-7 rounded-lg text-primary hover:bg-primary/20",
											title: "Apply instruction",
											children: isRefiningAi ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" })
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex flex-wrap gap-1.5 pt-1",
										children: [
											"Highlight startup perks",
											"Require 4+ yrs experience",
											"Include diversity clause",
											"Focus on cloud engineering"
										].map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											disabled: isRefiningAi,
											onClick: () => setAiCustomInstruction(preset),
											className: "text-[10px] font-medium bg-muted/60 hover:bg-primary/10 hover:text-primary text-muted-foreground px-2 py-0.5 rounded-full border border-border/40 transition-colors",
											children: ["+", preset]
										}, preset))
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-border/50 my-3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-bold text-muted-foreground uppercase tracking-wider block",
									children: "Quick Adjustments"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											onClick: () => handleModifyJdWithAi("improve"),
											disabled: isRefiningAi,
											className: "w-full justify-start rounded-xl h-8 px-3 text-xs border-border/80 hover:bg-primary/5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-3.5 w-3.5 text-indigo-500 mr-2" }), "Format & Polish Markdown"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											onClick: () => handleModifyJdWithAi("expand"),
											disabled: isRefiningAi,
											className: "w-full justify-start rounded-xl h-8 px-3 text-xs border-border/80 hover:bg-primary/5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize2, { className: "h-3.5 w-3.5 text-emerald-500 mr-2" }), "Expand Detail & Expectations"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											onClick: () => handleModifyJdWithAi("shorten"),
											disabled: isRefiningAi,
											className: "w-full justify-start rounded-xl h-8 px-3 text-xs border-border/80 hover:bg-primary/5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize2, { className: "h-3.5 w-3.5 text-rose-500 mr-2" }), "Shorten & Condense"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											onClick: () => handleModifyJdWithAi("professional"),
											disabled: isRefiningAi,
											className: "w-full justify-start rounded-xl h-8 px-3 text-xs border-border/80 hover:bg-primary/5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-3.5 w-3.5 text-blue-500 mr-2" }), "Formal Corporate Tone"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "button",
											variant: "outline",
											size: "sm",
											onClick: () => handleModifyJdWithAi("casual"),
											disabled: isRefiningAi,
											className: "w-full justify-start rounded-xl h-8 px-3 text-xs border-border/80 hover:bg-primary/5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smile, { className: "h-3.5 w-3.5 text-amber-500 mr-2" }), "Casual Startup Tone"]
										})
									]
								})]
							}),
							isRefiningAi && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-center gap-2 py-2 px-3 bg-muted/40 rounded-xl text-xs text-muted-foreground animate-pulse border border-border/50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin text-primary shrink-0" }), "OFC360 is working..."]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card/65 p-5 backdrop-blur-xl shadow-lg space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "text-sm font-bold text-foreground flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-4 w-4 text-primary" }), "Requisition Summary"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2.5 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1 border-b border-border/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Role Title:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground truncate max-w-[170px]",
										children: title || "Untitled Position"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1 border-b border-border/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Department:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: department === "Other" && customDepartment ? customDepartment : department
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1 border-b border-border/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Location:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground truncate max-w-[170px]",
										children: location || "Unspecified"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1 border-b border-border/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Employment:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: employmentType
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1 border-b border-border/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Work Mode:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: workMode
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1 border-b border-border/40",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Openings:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: vacancies
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between py-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Application Deadline:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-foreground",
										children: closingDate || "Open"
									})]
								})
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed bottom-0 left-0 right-0 bg-background/85 backdrop-blur-xl border-t border-border px-6 py-4 z-40 shadow-2xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-7xl mx-auto flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							asChild: true,
							className: "rounded-xl border-border/80 text-xs hover:bg-accent/60",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/dashboard/recruitment/jobs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-3.5 w-3.5 mr-1.5" }), " Cancel"]
							})
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "secondary",
							onClick: () => handleSubmitJob("draft"),
							disabled: isSubmitting,
							className: "rounded-xl font-medium border border-border text-xs h-10 px-5",
							children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 mr-1.5 animate-spin" }), " Saving..."] }) : "Save as Draft"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: () => handleSubmitJob("active"),
							disabled: isSubmitting,
							className: "rounded-xl font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 text-xs h-10 px-6 flex items-center gap-2",
							children: isSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), " Publishing..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Publish Position", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-3.5 w-3.5" })] })
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { NewJobPage, NewJobPage as default };
