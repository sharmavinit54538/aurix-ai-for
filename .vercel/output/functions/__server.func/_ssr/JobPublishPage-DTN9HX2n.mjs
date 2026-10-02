import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link, x as useParams, y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Dr as ChevronRight, Sr as CircleCheck, Tr as CircleAlert, xn as Globe } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/JobPublishPage-DTN9HX2n.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PLATFORMS = [
	{
		key: "linkedin",
		label: "LinkedIn Jobs",
		desc: "Reach active professionals worldwide",
		icon: "in"
	},
	{
		key: "indeed",
		label: "Indeed",
		desc: "The world's #1 job site",
		icon: "id"
	},
	{
		key: "naukri",
		label: "Naukri",
		desc: "India's largest employment platform",
		icon: "nk"
	},
	{
		key: "foundit",
		label: "Foundit",
		desc: "Monster India's newly upgraded job board",
		icon: "fi"
	},
	{
		key: "glassdoor",
		label: "Glassdoor",
		desc: "Employer branding & job distribution",
		icon: "gd"
	},
	{
		key: "wellfound",
		label: "Wellfound (AngelList)",
		desc: "Reach top startup talent",
		icon: "wf"
	}
];
function JobPublishPage() {
	const { jobId } = useParams({ from: "/dashboard/recruitment/jobs/$jobId/publish" });
	useNavigate();
	const job = useRecruitment((s) => s.jobs.find((j) => j.id === jobId));
	const [step, setStep] = (0, import_react.useState)(1);
	const [platform, setPlatform] = (0, import_react.useState)("linkedin");
	const [salaryVisible, setSalaryVisible] = (0, import_react.useState)(true);
	const [remoteOption, setRemoteOption] = (0, import_react.useState)("Hybrid");
	const [empType, setEmpType] = (0, import_react.useState)("Full-time");
	const [skills, setSkills] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("Software Engineering");
	const [appMethod, setAppMethod] = (0, import_react.useState)("Easy Apply");
	const [expiryDate, setExpiryDate] = (0, import_react.useState)("");
	const [publishing, setPublishing] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (job) {
			setRemoteOption(job.workMode || "Hybrid");
			setEmpType(job.employmentType || "Full-time");
			setSkills(job.skills?.join(", ") || "");
		}
	}, [job]);
	if (!job) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[400px] flex-col items-center justify-center text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mb-4 h-12 w-12 text-destructive" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-lg font-semibold",
				children: "Job Posting Not Found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "The requested job could not be retrieved."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-4",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/dashboard/recruitment/jobs",
					children: "Back to Jobs"
				})
			})
		]
	});
	function handlePublish() {
		setPublishing(true);
		setTimeout(() => {
			setStep(4);
			setPublishing(false);
		}, 2e3);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: `Publish: ${job.title}`,
			description: "Configure and distribute this job posting across recruiting channels."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-8 flex items-center justify-center gap-4",
			children: [
				{
					num: 1,
					label: "Platform"
				},
				{
					num: 2,
					label: "Review Info"
				},
				{
					num: 3,
					label: "Settings"
				},
				{
					num: 4,
					label: "Finish"
				}
			].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: `grid h-8 w-8 place-items-center rounded-full text-xs font-semibold transition-all ${step === s.num ? "bg-primary text-primary-foreground shadow-glow" : step > s.num ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground border border-border"}`,
						children: step > s.num ? "✓" : s.num
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `text-sm font-medium ${step === s.num ? "text-foreground" : "text-muted-foreground"}`,
						children: s.label
					}),
					s.num < 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4 text-muted-foreground/40" })
				]
			}, s.num))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl rounded-2xl border border-border bg-card/60 p-6 shadow-xl backdrop-blur-xl",
			children: [
				step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-base font-semibold",
							children: "Choose Target Platform"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Select the board where you want to publish this role."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-1 gap-3 md:grid-cols-2",
							children: PLATFORMS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setPlatform(p.key),
								className: `flex flex-col items-start rounded-xl border p-4 text-left transition-all ${platform === p.key ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border hover:bg-accent/40"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-bold uppercase tracking-wider text-muted-foreground",
										children: p.icon
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold text-sm",
										children: p.label
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground mt-0.5",
										children: p.desc
									})
								]
							}, p.key))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => setStep(2),
								children: ["Next Step", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-2 h-4 w-4" })]
							})
						})
					]
				}),
				step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-base font-semibold",
							children: "Review Job Information"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Verify job description and details before publishing."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 rounded-xl border border-border bg-background/50 p-4 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground block",
										children: "Title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: job.title
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground block",
										children: "Department"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground",
										children: job.department
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground block",
										children: "Location"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-foreground",
										children: [
											job.location,
											" (",
											job.workMode,
											")"
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground block",
										children: "Salary Range"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "font-medium text-foreground",
										children: [
											job.currency,
											" ",
											job.salaryMin.toLocaleString(),
											" - ",
											job.salaryMax.toLocaleString()
										]
									})] })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-t border-border/60 pt-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted-foreground block",
									children: "Description Summary"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground mt-1 line-clamp-3 leading-relaxed",
									children: job.description
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setStep(1),
								children: "Back"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => setStep(3),
								children: ["Configure Settings", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-2 h-4 w-4" })]
							})]
						})
					]
				}),
				step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-base font-semibold",
							children: "Configure Platform Settings"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Adjust attributes specifically for ",
								PLATFORMS.find((p) => p.key === platform)?.label,
								"."
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-xl border border-border p-3 bg-background/30",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-medium block",
										children: "Salary Visibility"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[10px] text-muted-foreground",
										children: "Display compensation details on the public board"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: salaryVisible,
										onChange: (e) => setSalaryVisible(e.target.checked),
										className: "h-4 w-4 rounded border-border text-primary focus:ring-primary"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 md:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "remote",
											children: "Remote Option"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											id: "remote",
											value: remoteOption,
											onChange: (e) => setRemoteOption(e.target.value),
											className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Remote",
													children: "Remote"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Hybrid",
													children: "Hybrid"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Onsite",
													children: "Onsite"
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "empType",
											children: "Employment Type"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											id: "empType",
											value: empType,
											onChange: (e) => setEmpType(e.target.value),
											className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Full-time",
													children: "Full-time"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Part-time",
													children: "Part-time"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Contract",
													children: "Contract"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Internship",
													children: "Internship"
												})
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "category",
										children: "Category"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										id: "category",
										value: category,
										onChange: (e) => setCategory(e.target.value),
										className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Software Engineering",
												children: "Software Engineering"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Product Management",
												children: "Product Management"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Design & Creative",
												children: "Design & Creative"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Marketing & Sales",
												children: "Marketing & Sales"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Human Resources",
												children: "Human Resources"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-4 md:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "appMethod",
											children: "Application Method"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											id: "appMethod",
											value: appMethod,
											onChange: (e) => setAppMethod(e.target.value),
											className: "w-full rounded-md border border-border bg-background px-3 py-2 text-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Easy Apply",
													children: "Easy Apply (Direct)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "External URL",
													children: "External Career Page"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Email",
													children: "Email Resume"
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "expiry",
											children: "Expiry Date (Optional)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											type: "date",
											id: "expiry",
											value: expiryDate,
											onChange: (e) => setExpiryDate(e.target.value)
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "skills",
										children: "Skills Tags (Comma separated)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "skills",
										value: skills,
										onChange: (e) => setSkills(e.target.value),
										placeholder: "e.g. React, TypeScript, Node.js"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setStep(2),
								children: "Back"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: handlePublish,
								disabled: publishing,
								children: publishing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									className: "mr-2 h-4 w-4 animate-spin text-current",
									fill: "none",
									viewBox: "0 0 24 24",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
										className: "opacity-25",
										cx: "12",
										cy: "12",
										r: "10",
										stroke: "currentColor",
										strokeWidth: "4"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
										className: "opacity-75",
										fill: "currentColor",
										d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
									})]
								}), "Publishing..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: ["Publish Role", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "ml-2 h-4 w-4" })] })
							})]
						})
					]
				}),
				step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center py-6 text-center space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 animate-ping rounded-full bg-emerald-500/20" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-16 w-16 text-emerald-500 relative" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-xl font-bold text-foreground",
							children: "Job Published Successfully!"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground mt-1 max-w-sm",
							children: [
								"Your role is now live on ",
								PLATFORMS.find((p) => p.key === platform)?.label,
								" and will begin receiving candidates soon."
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard/recruitment/jobs/$jobId",
									params: { jobId },
									children: "View Details Page"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard/recruitment/jobs",
									children: "Back to Jobs list"
								})
							})]
						})
					]
				})
			]
		})
	] });
}
//#endregion
export { JobPublishPage };
