import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { n as useRecruitment, t as newId } from "./useRecruitment-Cuznx8sx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AddCandidateDialog-D_6Agw5O.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var EMPTY_CANDIDATE_FORM = {
	name: "",
	email: "",
	phone: "",
	location: "",
	jobId: "",
	currentCompany: "",
	currentRole: "",
	yearsExperience: "0",
	expectedSalary: "0",
	noticeDays: "0",
	skills: "",
	tags: "",
	summary: ""
};
function parseCommaList(value) {
	return value.split(",").map((item) => item.trim()).filter(Boolean);
}
function buildCandidateFromForm(form, options) {
	const appliedPosition = options.job?.title ?? (form.currentRole || options.appliedPositionFallback || "Open Application");
	return {
		id: options.id,
		name: form.name,
		email: form.email,
		phone: form.phone,
		location: form.location,
		jobId: form.jobId,
		applicationId: "",
		appliedPosition,
		stage: options.stage,
		atsScore: null,
		jobMatch: null,
		source: "DIRECT",
		tags: parseCommaList(form.tags),
		skills: parseCommaList(form.skills),
		yearsExperience: Number(form.yearsExperience) || 0,
		currentCompany: form.currentCompany,
		currentRole: form.currentRole,
		expectedSalary: Number(form.expectedSalary) || 0,
		noticeDays: Number(form.noticeDays) || 0,
		resumeName: "resume.pdf",
		summary: form.summary,
		experience: [],
		education: [],
		projects: [],
		certifications: [],
		languages: [],
		feedback: [],
		notes: [],
		documents: [],
		timeline: [],
		appliedAt: (/* @__PURE__ */ new Date()).toISOString()
	};
}
function AddCandidateDialog({ open, onOpenChange, title = "Add Candidate", description = "Create a new candidate profile and add them to the pipeline.", successMessage = "Candidate added successfully.", stage = "applied", jobs, appliedPositionFallback }) {
	const { upsertCandidate } = useRecruitment();
	const [formData, setFormData] = (0, import_react.useState)(EMPTY_CANDIDATE_FORM);
	const [submitting, setSubmitting] = (0, import_react.useState)(false);
	function updateField(key, value) {
		setFormData((prev) => ({
			...prev,
			[key]: value
		}));
	}
	function handleClose(nextOpen) {
		if (!nextOpen && !submitting) setFormData(EMPTY_CANDIDATE_FORM);
		onOpenChange(nextOpen);
	}
	async function handleSubmit(e) {
		e.preventDefault();
		if (!formData.name || !formData.email) {
			toast.error("Name and email are required.");
			return;
		}
		const job = jobs?.find((item) => item.id === formData.jobId) ?? null;
		setSubmitting(true);
		try {
			await upsertCandidate(buildCandidateFromForm(formData, {
				id: newId("cand"),
				stage,
				job,
				appliedPositionFallback
			}));
			toast.success(successMessage);
			setFormData(EMPTY_CANDIDATE_FORM);
			onOpenChange(false);
		} catch {
			toast.error("Failed to add candidate.");
		} finally {
			setSubmitting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: handleClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-xl max-h-[80vh] overflow-y-auto",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: description })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddCandidateFormFields, {
					formData,
					onChange: updateField,
					jobs
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
					className: "pt-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => handleClose(false),
						disabled: submitting,
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: submitting,
						children: submitting ? "Adding…" : "Add Candidate"
					})]
				})]
			})]
		})
	});
}
function AddCandidateFormFields({ formData, onChange, jobs }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
				label: "Full Name *",
				htmlFor: "cand-name",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "cand-name",
					placeholder: "e.g. Rahul Sharma",
					value: formData.name,
					onChange: (e) => onChange("name", e.target.value),
					required: true
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
				label: "Email Address *",
				htmlFor: "cand-email",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "cand-email",
					type: "email",
					placeholder: "e.g. rahul@example.com",
					value: formData.email,
					onChange: (e) => onChange("email", e.target.value),
					required: true
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
				label: "Phone Number",
				htmlFor: "cand-phone",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "cand-phone",
					placeholder: "e.g. +91 98765 43210",
					value: formData.phone,
					onChange: (e) => onChange("phone", e.target.value)
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
				label: "Location",
				htmlFor: "cand-location",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "cand-location",
					placeholder: "e.g. Bengaluru, India",
					value: formData.location,
					onChange: (e) => onChange("location", e.target.value)
				})
			})]
		}),
		jobs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
			label: "Applied Job",
			htmlFor: "cand-job",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				id: "cand-job",
				value: formData.jobId,
				onChange: (e) => onChange("jobId", e.target.value),
				className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "Open application (no specific job)"
				}), jobs.map((job) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
					value: job.id,
					children: [
						job.title,
						" — ",
						job.department
					]
				}, job.id))]
			})
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-2 gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
				label: "Current Company",
				htmlFor: "cand-company",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "cand-company",
					placeholder: "e.g. Acme Corp",
					value: formData.currentCompany,
					onChange: (e) => onChange("currentCompany", e.target.value)
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
				label: "Current Role",
				htmlFor: "cand-role",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "cand-role",
					placeholder: "e.g. Senior Frontend Engineer",
					value: formData.currentRole,
					onChange: (e) => onChange("currentRole", e.target.value)
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-3 gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: "Experience (Years)",
					htmlFor: "cand-exp",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "cand-exp",
						type: "number",
						min: "0",
						value: formData.yearsExperience,
						onChange: (e) => onChange("yearsExperience", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: "Expected CTC (INR)",
					htmlFor: "cand-salary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "cand-salary",
						type: "number",
						min: "0",
						value: formData.expectedSalary,
						onChange: (e) => onChange("expectedSalary", e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
					label: "Notice Period (Days)",
					htmlFor: "cand-notice",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "cand-notice",
						type: "number",
						min: "0",
						value: formData.noticeDays,
						onChange: (e) => onChange("noticeDays", e.target.value)
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
			label: "Skills (comma-separated)",
			htmlFor: "cand-skills",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "cand-skills",
				placeholder: "e.g. React, TypeScript, Node.js",
				value: formData.skills,
				onChange: (e) => onChange("skills", e.target.value)
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
			label: "Tags (comma-separated)",
			htmlFor: "cand-tags",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id: "cand-tags",
				placeholder: "e.g. Remote, Immediate Joiner, Referral",
				value: formData.tags,
				onChange: (e) => onChange("tags", e.target.value)
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormField, {
			label: "Candidate Summary",
			htmlFor: "cand-summary",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
				id: "cand-summary",
				placeholder: "Brief summary of the candidate's profile and background…",
				rows: 3,
				value: formData.summary,
				onChange: (e) => onChange("summary", e.target.value)
			})
		})
	] });
}
function FormField({ label, htmlFor, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor,
			children: label
		}), children]
	});
}
//#endregion
export { AddCandidateDialog as t };
