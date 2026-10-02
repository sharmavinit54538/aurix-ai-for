import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { H as Sparkles, It as MessageSquare, P as Target, li as ArrowRight, tn as Lightbulb, u as WandSparkles, zn as FileSearch } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { r as PageHeader } from "./DashboardShell-DIr27KpW.mjs";
import { n as useRecruitment } from "./useRecruitment-Cuznx8sx.mjs";
import { a as Progress } from "./Shared-C_skH1kb.mjs";
import { a as ScoreRing, t as CandidateAvatar } from "./Bits-BEiUi0-S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/RecruitmentAIPage-Cp3Idc6U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RecruitmentAIPage() {
	const candidates = useRecruitment((s) => s.candidates);
	const jobs = useRecruitment((s) => s.jobs);
	const [jobId, setJobId] = (0, import_react.useState)(jobs[0]?.id ?? "");
	const ranked = (0, import_react.useMemo)(() => {
		const job = jobs.find((j) => j.id === jobId);
		if (!job) return [];
		const skillSet = new Set(job.skills.map((s) => s.toLowerCase()));
		return candidates.map((c) => {
			const overlap = c.skills.filter((s) => skillSet.has(s.toLowerCase())).length;
			const hasDbScore = c.jobId === jobId && c.atsScore != null;
			const atsMatch = hasDbScore ? c.atsScore : job.skills.length > 0 ? Math.round(overlap / job.skills.length * 100) : 0;
			return {
				c,
				overlap,
				match: hasDbScore && c.jobMatch != null ? c.jobMatch : job.skills.length > 0 ? Math.round(overlap / job.skills.length * 100) : 0,
				atsMatch
			};
		}).sort((a, b) => b.atsMatch - a.atsMatch).slice(0, 8);
	}, [
		jobs,
		jobId,
		candidates
	]);
	const aiQuestions = (0, import_react.useMemo)(() => {
		const job = jobs.find((j) => j.id === jobId);
		if (!job) return [];
		return [
			`Design a system or workflow that addresses key challenges in ${job.title}.`,
			`How do you keep your skills up to date with technologies like ${job.skills.slice(0, 3).join(", ") || "modern industry frameworks"}?`,
			`Describe a complex scenario where you successfully applied ${job.skills[0] || "problem solving"} to resolve a block.`,
			`How do you collaborate with managers and team members to ship high-quality results?`
		];
	}, [jobs, jobId]);
	const recs = (0, import_react.useMemo)(() => {
		return ranked.map(({ c, match }) => {
			let reason = "";
			if (match >= 75) reason = `Excellent fit (${match}% Match). Strong match in core skills: ${c.skills.slice(0, 3).join(", ")}. Highly recommended for fast-track to technical interview.`;
			else if (match >= 50) reason = `Good potential (${match}% Match). Key skills present: ${c.skills.slice(0, 2).join(", ")}. Recommended for initial screening.`;
			else reason = `Moderate match (${match}% Match). Review candidate's background on ${c.skills.slice(0, 2).join(", ") || "experience"} before proceeding.`;
			return {
				c,
				reason
			};
		}).slice(0, 3);
	}, [ranked]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Recruitment AI",
			description: "AI-powered screening, ranking, and hiring recommendations.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
				variant: "outline",
				className: "gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3" }), "Beta"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-4 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AICard, {
					icon: FileSearch,
					title: "Resume Screening",
					desc: "Score & summarize incoming resumes against any job spec.",
					cta: "Screen now"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AICard, {
					icon: Target,
					title: "Skill Matching",
					desc: "Find latent skill overlap beyond keyword matches.",
					cta: "Match candidates"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AICard, {
					icon: MessageSquare,
					title: "Interview Questions",
					desc: "Generate role-specific question banks calibrated to seniority.",
					cta: "Generate set"
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-base font-semibold",
						children: "Candidate Ranking"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "AI-ranked shortlist for the selected role."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: jobId,
						onChange: (e) => setJobId(e.target.value),
						className: "h-9 rounded-md border border-input bg-background px-3 text-sm",
						children: jobs.map((j) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: j.id,
							children: [
								j.title,
								" ",
								j.skills.length > 0 ? `(${j.skills.length} skills)` : "(no skills)"
							]
						}, j.id))
					})]
				}),
				jobs.find((j) => j.id === jobId)?.skills.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-xs text-amber-600 dark:text-amber-400",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-base",
						children: "⚠️"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						"This job has ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "no skills defined" }),
						". Scores will be 0% for all candidates. Edit the job to add required skills for accurate AI ranking."
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "space-y-2",
					children: ranked.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center gap-4 rounded-xl border border-border bg-background/40 p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-7 w-7 place-items-center rounded-full bg-foreground text-xs font-semibold text-background",
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, { name: r.c.name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/dashboard/recruitment/candidates/$candidateId",
									params: { candidateId: r.c.id },
									className: "text-sm font-medium hover:underline",
									children: r.c.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										r.c.currentRole,
										" · ",
										r.overlap,
										" matching skills"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden w-40 sm:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-1 flex items-center justify-between text-[10px] text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Job Match" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [r.match, "%"] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: r.match })]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScoreRing, {
								value: r.atsMatch,
								label: "ATS"
							})
						]
					}, r.c.id))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 p-5 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 place-items-center rounded-lg text-brand-foreground shadow-glow",
						style: { background: "var(--gradient-brand)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-sm font-semibold",
						children: "AI Interview Questions"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Calibrated to the selected role."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: aiQuestions.map((q, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-3 rounded-xl border border-border bg-background/50 p-3 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [i + 1, "."]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: q })]
					}, i))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-gradient-to-br from-emerald-500/10 to-teal-500/5 p-5 backdrop-blur-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid h-9 w-9 place-items-center rounded-lg text-brand-foreground shadow-glow",
						style: { background: "var(--gradient-brand)" },
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbulb, { className: "h-4 w-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-display text-sm font-semibold",
						children: "Hiring Recommendations"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Suggested next actions for this role."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: recs.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-start gap-3 rounded-xl border border-border bg-background/50 p-3 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
								name: r.c.name,
								size: 28
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-medium",
									children: r.c.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: r.reason
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/dashboard/recruitment/candidates/$candidateId",
									params: { candidateId: r.c.id },
									children: ["Open", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-1 h-3 w-3" })]
								})
							})
						]
					}, i))
				})]
			})]
		})
	] });
}
function AICard({ icon: Icon, title, desc, cta }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-elegant",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-2xl transition-opacity group-hover:opacity-50",
				style: { background: "var(--gradient-brand)" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid h-10 w-10 place-items-center rounded-xl text-brand-foreground shadow-glow",
				style: { background: "var(--gradient-brand)" },
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-3 font-display text-base font-semibold",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: desc
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				className: "mt-4",
				children: [cta, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "ml-2 h-3 w-3" })]
			})
		]
	});
}
//#endregion
export { RecruitmentAIPage };
