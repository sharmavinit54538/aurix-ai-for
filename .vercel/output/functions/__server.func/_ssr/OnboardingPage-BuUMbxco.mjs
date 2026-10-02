import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { $ as Search, Jn as Eye, Ln as FileText, Sr as CircleCheck, Tr as CircleAlert, _ as UserPlus, er as Download, lt as RefreshCw, qt as LoaderCircle, vr as CircleX, x as UserCheck } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { t as Progress } from "./progress-ZynOkOPX.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as apiInstance } from "./apiInstance-C5A0vaLH.mjs";
import { t as getErrorMessage } from "./utils-DQc9Fr86.mjs";
import { t as Skeleton } from "./skeleton-D9W9wFsj.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { t as Label } from "./label-BPuF5-mq.mjs";
import { t as Textarea } from "./textarea-1llmCJsE.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-DCMcI36W.mjs";
import { t as CandidateAvatar } from "./Bits-BEiUi0-S.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/OnboardingPage-BuUMbxco.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function humanizeFieldKey(key) {
	return key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}
function isAttachmentUrlField(key) {
	return key.endsWith("_url");
}
function formatFieldValue(value) {
	if (value === null || value === void 0 || value === "") return "—";
	if (typeof value === "boolean") return value ? "Yes" : "No";
	if (Array.isArray(value)) {
		if (value.length === 0) return "—";
		return value.map((item) => formatFieldValue(item)).join(", ");
	}
	if (typeof value === "object") return Object.entries(value).map(([k, v]) => `${humanizeFieldKey(k)}: ${formatFieldValue(v)}`).join(" · ");
	return String(value);
}
function formatDateTime(value) {
	if (!value) return "—";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	return date.toLocaleString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit"
	});
}
var STATUS_TONE = {
	PENDING: "bg-amber-500/15 text-amber-700 ring-amber-500/20 dark:text-amber-300",
	IN_PROGRESS: "bg-sky-500/15 text-sky-600 ring-sky-500/20 dark:text-sky-300",
	COMPLETED: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300",
	REJECTED: "bg-rose-500/15 text-rose-600 ring-rose-500/20 dark:text-rose-300",
	VERIFIED: "bg-emerald-500/15 text-emerald-600 ring-emerald-500/20 dark:text-emerald-300"
};
function statusBadgeClass(status) {
	return STATUS_TONE[normalizeScalarString(status).toUpperCase()] ?? "bg-muted text-muted-foreground ring-border";
}
function normalizeScalarString(value, fallback = "") {
	if (value === null || value === void 0) return fallback;
	if (typeof value === "string") {
		const trimmed = value.trim();
		return trimmed && trimmed !== "[object Object]" ? trimmed : fallback;
	}
	if (typeof value === "number" || typeof value === "boolean") return String(value);
	if (typeof value === "object") {
		const obj = value;
		for (const key of [
			"label",
			"name",
			"value",
			"status",
			"code",
			"state",
			"type"
		]) {
			const nested = obj[key];
			if (typeof nested === "string" && nested.trim()) return nested.trim();
		}
	}
	return fallback;
}
function formatStatusLabel(status) {
	const text = normalizeScalarString(status);
	if (!text) return "—";
	return text.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
function formatCurrentStep(value) {
	if (value === null || value === void 0 || value === "") return "—";
	const text = String(value).trim();
	if (!text || text === "—") return "—";
	if (/^\d+$/.test(text)) return `Step ${text}`;
	return text;
}
function resolveMediaUrl(url) {
	if (!url?.trim()) return null;
	const trimmed = url.trim();
	if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
	let apiOrigin = "https://api.ofc360.com".trim().replace(/\/$/, "");
	if (!apiOrigin.startsWith("http://") && !apiOrigin.startsWith("https://")) apiOrigin = `https://${apiOrigin}`;
	apiOrigin = apiOrigin.replace(/www\.api\.ofc360\.com/g, "api.ofc360.com");
	if (trimmed.startsWith("/")) return `${apiOrigin}${trimmed}`;
	return `${apiOrigin}/${trimmed}`;
}
function isImageUrl(url) {
	if (!url) return false;
	return /\.(png|jpe?g|gif|webp|bmp|svg)(\?.*)?$/i.test(url);
}
function getDocumentUrl(doc) {
	return resolveMediaUrl(doc.file_url ?? doc.download_url ?? doc.document_url ?? null);
}
var detailsPanelClass = "rounded-2xl border border-border bg-card/60 backdrop-blur-xl lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto";
var HIDDEN_PERSONAL_FIELDS = /* @__PURE__ */ new Set(["profile_photo_url"]);
function ProfileAvatar({ name, photoUrl, size = 48 }) {
	const resolved = resolveMediaUrl(photoUrl);
	if (resolved && isImageUrl(resolved)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: resolved,
		alt: name,
		className: "shrink-0 rounded-full object-cover ring-2 ring-border",
		style: {
			width: size,
			height: size
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
		name,
		size
	});
}
function DetailSection({ title, data, photoFieldKey }) {
	const photoUrl = photoFieldKey && data ? data[photoFieldKey] : void 0;
	const entries = (0, import_react.useMemo)(() => {
		if (!data || Object.keys(data).length === 0) return [];
		return Object.entries(data).filter(([key, value]) => {
			if (photoFieldKey && key === photoFieldKey) return false;
			if (HIDDEN_PERSONAL_FIELDS.has(key)) return false;
			return value !== null && value !== void 0 && value !== "";
		});
	}, [data, photoFieldKey]);
	if (entries.length === 0 && !photoUrl) return null;
	const resolvedPhoto = resolveMediaUrl(photoUrl);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card/40 p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
				children: title
			}),
			resolvedPhoto && isImageUrl(resolvedPhoto) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: resolvedPhoto,
					alt: "Profile photo",
					className: "h-24 w-24 rounded-xl object-cover ring-2 ring-border"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Profile photo"
				})]
			}) : null,
			entries.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
				className: "grid grid-cols-1 gap-3 sm:grid-cols-2",
				children: entries.map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
					className: "text-[11px] text-muted-foreground",
					children: humanizeFieldKey(key)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
					className: "mt-0.5 text-sm",
					children: formatFieldValue(value)
				})] }, key))
			}) : null
		]
	});
}
function AttachmentFieldActions({ value }) {
	const url = resolveMediaUrl(typeof value === "string" ? value : null);
	if (!url) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "sm:col-span-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
			className: "flex flex-wrap items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "button",
				size: "sm",
				variant: "outline",
				onClick: () => window.open(url, "_blank", "noopener,noreferrer"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-1.5 h-3.5 w-3.5" }), "Preview Document"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				size: "sm",
				variant: "outline",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: url,
					download: true,
					target: "_blank",
					rel: "noopener noreferrer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-3.5 w-3.5" }), "Download"]
				})
			})]
		})
	});
}
function RecordListSection({ title, items }) {
	if (!items?.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card/40 p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: items.map((item, index) => {
				const attachmentEntries = Object.entries(item).filter(([key, value]) => isAttachmentUrlField(key) && value !== null && value !== void 0 && value !== "");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-lg border border-border/70 bg-background/40 p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "grid grid-cols-1 gap-2 sm:grid-cols-2",
						children: [Object.entries(item).filter(([key, value]) => !isAttachmentUrlField(key) && value !== null && value !== void 0 && value !== "").map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-[11px] text-muted-foreground",
							children: humanizeFieldKey(key)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-0.5 text-sm",
							children: formatFieldValue(value)
						})] }, key)), attachmentEntries.map(([key, value]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AttachmentFieldActions, { value }, key))]
					})
				}, index);
			})
		})]
	});
}
function DocumentRow({ document, busy, onVerify, onReject }) {
	const url = getDocumentUrl(document);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg border border-border bg-background/40 p-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: document.name
							}),
							document.document_type ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								className: "text-[10px]",
								children: document.document_type
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${statusBadgeClass(document.verification_status)}`,
								children: formatStatusLabel(document.verification_status)
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 text-[11px] text-muted-foreground",
						children: ["Last updated: ", formatDateTime(document.updated_at ?? document.uploaded_at)]
					}),
					document.rejection_comment ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 rounded-md bg-rose-500/10 px-2 py-1 text-xs text-rose-700 dark:text-rose-300",
						children: ["Rejection note: ", document.rejection_comment]
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					url ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						variant: "outline",
						onClick: () => window.open(url, "_blank", "noopener,noreferrer"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "mr-1.5 h-3.5 w-3.5" }), "Preview"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						size: "sm",
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: url,
							download: true,
							target: "_blank",
							rel: "noopener noreferrer",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-1.5 h-3.5 w-3.5" }), "Download"]
						})
					})] }) : null,
					document.verification_status !== "VERIFIED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						disabled: busy,
						onClick: onVerify,
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mr-1.5 h-3.5 w-3.5" }), "Verify"]
					}) : null,
					document.verification_status !== "REJECTED" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						size: "sm",
						variant: "destructive",
						disabled: busy,
						onClick: onReject,
						children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-1.5 h-3.5 w-3.5 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleX, { className: "mr-1.5 h-3.5 w-3.5" }), "Reject"]
					}) : null
				]
			})]
		})
	});
}
function OnboardingDetailsPanel({ employee, details, loading, error, actionDocumentId, onRetry, onVerifyDocument }) {
	const [rejectDoc, setRejectDoc] = (0, import_react.useState)(null);
	const [rejectComment, setRejectComment] = (0, import_react.useState)("");
	const [rejectSubmitting, setRejectSubmitting] = (0, import_react.useState)(false);
	if (!employee) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: `p-8 text-center ${detailsPanelClass}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Select an employee to view onboarding details."
		})
	});
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `space-y-4 p-4 ${detailsPanelClass}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 text-xs text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), "Loading onboarding details..."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-full rounded-xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full rounded-xl" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full rounded-xl" })
		]
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `flex flex-col items-center justify-center p-8 text-center ${detailsPanelClass}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mb-3 h-8 w-8 text-destructive" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-destructive",
				children: "Failed to load onboarding details"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: onRetry,
				variant: "outline",
				size: "sm",
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-2 h-3.5 w-3.5" }), "Retry"]
			})
		]
	});
	if (!details) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: `p-8 text-center ${detailsPanelClass}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "No onboarding details available."
		})
	});
	const completion = details.completion_percentage ?? employee.completion_percentage ?? 0;
	const profilePhotoUrl = details.personal_information?.profile_photo_url;
	async function handleRejectConfirm() {
		if (!rejectDoc) return;
		if (!rejectComment.trim()) return;
		setRejectSubmitting(true);
		const ok = await onVerifyDocument(rejectDoc.id, "REJECTED", rejectComment.trim());
		setRejectSubmitting(false);
		if (ok) {
			setRejectDoc(null);
			setRejectComment("");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: `space-y-4 p-4 ${detailsPanelClass}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileAvatar, {
					name: details.name || employee.name,
					photoUrl: profilePhotoUrl,
					size: 48
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-semibold",
								children: details.name || employee.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${statusBadgeClass(details.status)}`,
								children: formatStatusLabel(details.status)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								details.employment_details?.department ?? employee.department,
								" ·",
								" ",
								details.employment_details?.designation ?? employee.designation
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: ["Current step: ", formatCurrentStep(details.current_step || employee.current_step)]
						}),
						details.verification_status ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: ["Verification: ", formatStatusLabel(details.verification_status)]
						}) : null
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
				value: completion,
				className: "h-2"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 text-xs text-muted-foreground",
				children: [completion, "% complete"]
			})] }),
			employee.missing_documents?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-amber-500/30 bg-amber-500/10 p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold text-amber-700 dark:text-amber-300",
					children: "Pending documents"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-2 flex flex-wrap gap-1.5",
					children: employee.missing_documents.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-[10px]",
						children: doc
					}, doc))
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailSection, {
				title: "Personal Information",
				data: details.personal_information,
				photoFieldKey: "profile_photo_url"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailSection, {
				title: "Identity Verification",
				data: details.identity_details
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailSection, {
				title: "Employment Details",
				data: details.employment_details
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordListSection, {
				title: "Education",
				items: details.education
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RecordListSection, {
				title: "Experience",
				items: details.experience
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailSection, {
				title: "Bank Information",
				data: details.bank_details
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailSection, {
				title: "Tax & Payroll",
				data: details.tax_payroll
			}),
			details.documents?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card/40 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Uploaded Documents"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: details.documents.map((document) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DocumentRow, {
						document,
						busy: actionDocumentId === document.id,
						onVerify: () => void onVerifyDocument(document.id, "VERIFIED", "Looks good"),
						onReject: () => {
							setRejectDoc(document);
							setRejectComment("");
						}
					}, document.id))
				})]
			}) : null,
			details.policy_acceptances?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card/40 p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
					children: "Agreements & Policies"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: details.policy_acceptances.map((policy, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between rounded-lg border border-border/70 bg-background/40 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: policy.policy_name ?? policy.name ?? "Policy"
						}), policy.version ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[11px] text-muted-foreground",
							children: ["Version ", policy.version]
						}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: policy.accepted ? "default" : "outline",
								children: policy.accepted ? "Accepted" : "Pending"
							}), policy.accepted_at ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[10px] text-muted-foreground",
								children: formatDateTime(policy.accepted_at)
							}) : null]
						})]
					}, policy.id ?? `${policy.policy_name ?? policy.name}-${index}`))
				})]
			}) : null
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: Boolean(rejectDoc),
		onOpenChange: (open) => {
			if (!open) {
				setRejectDoc(null);
				setRejectComment("");
			}
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "rounded-2xl border-border bg-card sm:max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Reject document" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "reject-comment",
						className: "text-xs",
						children: "Rejection comment"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "reject-comment",
						value: rejectComment,
						onChange: (event) => setRejectComment(event.target.value),
						placeholder: "Please upload a clearer copy.",
						rows: 4
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => setRejectDoc(null),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "button",
					variant: "destructive",
					disabled: !rejectComment.trim() || rejectSubmitting,
					onClick: () => void handleRejectConfirm(),
					children: [rejectSubmitting ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }) : null, "Reject document"]
				})] })
			]
		})
	})] });
}
var listAsideClass = "rounded-2xl border border-border bg-card/60 backdrop-blur-xl lg:sticky lg:top-4 lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto";
function OnboardingEmployeeList({ employees, loading, error, selectedEmployeeId, onSelect, onRetry }) {
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: `space-y-2 p-3 ${listAsideClass}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 px-1 text-xs text-muted-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), "Loading employees..."]
		}), [
			1,
			2,
			3,
			4
		].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-full rounded-lg" }, item))]
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: `flex flex-col items-center justify-center p-6 text-center ${listAsideClass}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "mb-3 h-8 w-8 text-destructive" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-destructive",
				children: "Failed to load employees"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: onRetry,
				variant: "outline",
				size: "sm",
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "mr-2 h-3.5 w-3.5" }), "Retry"]
			})
		]
	});
	if (employees.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: `flex flex-col items-center justify-center p-8 text-center ${listAsideClass}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-3 grid h-10 w-10 place-items-center rounded-xl bg-muted text-muted-foreground",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "h-5 w-5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium",
				children: "No onboarding records found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: "Adjust filters or check back when employees begin onboarding."
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
		className: `space-y-1.5 p-2 ${listAsideClass}`,
		children: employees.map((employee) => {
			const isActive = employee.employee_id === selectedEmployeeId;
			const missingCount = employee.missing_documents?.length ?? 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => onSelect(employee.employee_id),
				className: `w-full rounded-lg p-2 text-left transition-colors ${isActive ? "bg-accent" : "hover:bg-accent/50"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CandidateAvatar, {
							name: employee.name,
							size: 32
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "truncate text-sm font-medium",
										children: employee.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `inline-flex shrink-0 items-center rounded-full px-1.5 py-0.5 text-[9px] font-medium ring-1 ${statusBadgeClass(employee.status)}`,
										children: formatStatusLabel(employee.status)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "truncate text-[10px] text-muted-foreground",
									children: [
										employee.department,
										" · ",
										employee.designation
									]
								}),
								employee.employee_code ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "truncate text-[10px] text-muted-foreground",
									children: employee.employee_code
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 truncate text-[10px] text-muted-foreground",
									children: formatCurrentStep(employee.current_step)
								}),
								missingCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-1 text-[10px] text-amber-600 dark:text-amber-400",
									children: [
										missingCount,
										" pending document",
										missingCount === 1 ? "" : "s"
									]
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-[10px] font-semibold",
							children: [employee.completion_percentage ?? 0, "%"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: employee.completion_percentage ?? 0,
					className: "mt-2 h-1"
				})]
			}, employee.employee_id);
		})
	});
}
function OnboardingFiltersBar({ filters, departments, currentSteps, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid grid-cols-1 gap-3 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl md:grid-cols-2 xl:grid-cols-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative xl:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: filters.search,
					onChange: (event) => onChange({
						...filters,
						search: event.target.value
					}),
					placeholder: "Search employees...",
					className: "pl-9"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: filters.status,
				onValueChange: (status) => onChange({
					...filters,
					status
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Status" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "all",
						children: "All statuses"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "PENDING",
						children: "Pending"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "IN_PROGRESS",
						children: "In progress"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "COMPLETED",
						children: "Completed"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
						value: "REJECTED",
						children: "Rejected"
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: filters.department,
				onValueChange: (department) => onChange({
					...filters,
					department
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Department" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "all",
					children: "All departments"
				}), departments.map((department) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: department,
					children: department
				}, department))] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
				value: filters.currentStep,
				onValueChange: (currentStep) => onChange({
					...filters,
					currentStep
				}),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Current step" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: "all",
					children: "All steps"
				}), currentSteps.map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
					value: step,
					children: step
				}, step))] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				type: "number",
				min: 0,
				max: 100,
				value: filters.minCompletion,
				onChange: (event) => onChange({
					...filters,
					minCompletion: event.target.value
				}),
				placeholder: "Min completion %",
				className: "xl:col-span-1"
			})
		]
	});
}
function asRecord(value) {
	if (value && typeof value === "object" && !Array.isArray(value)) return value;
	return null;
}
function asArray(value) {
	return Array.isArray(value) ? value : [];
}
function readName(raw) {
	if (typeof raw.name === "string" && raw.name.trim()) return raw.name.trim();
	if (typeof raw.full_name === "string" && raw.full_name.trim()) return raw.full_name.trim();
	const personal = asRecord(raw.personal_info);
	return `${String(personal?.first_name ?? raw.first_name ?? "").trim()} ${String(personal?.last_name ?? raw.last_name ?? "").trim()}`.trim() || "Unknown";
}
function readStatusBlock(raw) {
	const status = asRecord(raw.status);
	if (status && ("current_step" in status || "onboarding_completed" in status || "completion_percentage" in status || "steps_completed" in status)) return status;
	return asRecord(raw.onboarding_status) ?? asRecord(raw.onboarding);
}
function readEmployment(raw) {
	return asRecord(raw.employment) ?? asRecord(raw.employment_info) ?? asRecord(raw.employment_details) ?? null;
}
function readOnboardingCompleted(raw) {
	if (readStatusBlock(raw)?.onboarding_completed === true) return true;
	return raw.onboarding_completed === true;
}
function readCompletionPercentage(raw) {
	const value = readStatusBlock(raw)?.completion_percentage ?? raw.completion_percentage ?? raw.completionPercentage;
	return Number(value ?? 0);
}
function readStatus(raw) {
	if (typeof raw.status === "string" && raw.status.trim()) return raw.status.trim();
	const block = readStatusBlock(raw);
	if (block) {
		if (block.onboarding_completed === true) return "COMPLETED";
		const step = block.current_step;
		if (step !== null && step !== void 0 && Number(step) > 0) return "IN_PROGRESS";
		return "PENDING";
	}
	const direct = normalizeScalarString(raw.status);
	if (direct) return direct;
	if (readOnboardingCompleted(raw)) return "COMPLETED";
	const step = readCurrentStep(raw);
	if (step && Number(step) > 0) return "IN_PROGRESS";
	return "PENDING";
}
function readCurrentStep(raw) {
	const block = readStatusBlock(raw);
	const value = raw.current_step ?? raw.currentStep ?? raw.step ?? block?.current_step ?? block?.currentStep;
	if (value === null || value === void 0 || value === "") return "";
	return String(value);
}
function readMissingDocuments(raw) {
	const docs = asArray(raw.missing_documents).map((item) => {
		if (typeof item === "string") return item;
		if (item && typeof item === "object") {
			const doc = item;
			return String(doc.name ?? doc.document_type ?? doc.type ?? "Document");
		}
		return String(item);
	}).filter(Boolean);
	if (docs.length > 0) return docs;
	const steps = asRecord(readStatusBlock(raw)?.steps_completed);
	if (!steps) return [];
	return Object.entries(steps).filter(([, done]) => done === false).map(([key]) => key.replace(/_/g, " "));
}
function mapDocument(raw) {
	const doc = asRecord(raw);
	if (!doc) return null;
	const id = String(doc.id ?? doc.doc_id ?? doc.document_id ?? "");
	if (!id) return null;
	return {
		id,
		name: String(doc.title ?? doc.name ?? doc.document_name ?? doc.file_name ?? "Document"),
		document_type: doc.document_type ? String(doc.document_type) : doc.type ? String(doc.type) : void 0,
		file_url: doc.file_url ? String(doc.file_url) : doc.document_url ? String(doc.document_url) : doc.url ? String(doc.url) : void 0,
		download_url: doc.download_url ? String(doc.download_url) : void 0,
		document_url: doc.document_url ? String(doc.document_url) : void 0,
		verification_status: normalizeScalarString(doc.verification_status ?? doc.status, "PENDING"),
		rejection_comment: typeof doc.rejection_comment === "string" ? doc.rejection_comment : typeof doc.comments === "string" ? doc.comments : null,
		updated_at: doc.updated_at ? String(doc.updated_at) : doc.created_at ? String(doc.created_at) : void 0,
		uploaded_at: doc.uploaded_at ? String(doc.uploaded_at) : doc.created_at ? String(doc.created_at) : void 0
	};
}
function mapProgressListItem(raw) {
	const personal = asRecord(raw.personal_info);
	const employment = readEmployment(raw);
	return {
		employee_id: String(raw.employee_id ?? raw.id ?? ""),
		employee_code: raw.employee_code ? String(raw.employee_code) : void 0,
		name: readName(raw),
		department: String(raw.department ?? employment?.department ?? personal?.department ?? ""),
		designation: String(raw.designation ?? raw.designation_name ?? employment?.designation ?? ""),
		joining_date: raw.joining_date ? String(raw.joining_date) : void 0,
		work_location: raw.work_location ? String(raw.work_location) : void 0,
		status: readStatus(raw),
		current_step: readCurrentStep(raw),
		completion_percentage: readCompletionPercentage(raw),
		missing_documents: readMissingDocuments(raw)
	};
}
function mapOnboardingDetails(envelope) {
	const root = asRecord(envelope) ?? {};
	const payload = asRecord(root.data) ?? root;
	const personal = asRecord(payload.personal_info);
	const employment = readEmployment(payload);
	const statusSource = {
		...payload,
		...root
	};
	const documents = asArray(payload.documents ?? payload.uploaded_documents).map(mapDocument).filter((doc) => doc !== null);
	const policyAcceptances = asArray(payload.policies ?? payload.policy_acceptances).map((item) => {
		const policy = asRecord(item) ?? {};
		return {
			id: policy.id ? String(policy.id) : void 0,
			policy_name: policy.policy_name ? String(policy.policy_name) : void 0,
			name: policy.name ? String(policy.name) : void 0,
			accepted: typeof policy.accepted === "boolean" ? policy.accepted : Boolean(policy.accepted_at),
			accepted_at: policy.accepted_at ? String(policy.accepted_at) : void 0,
			version: policy.policy_version ? String(policy.policy_version) : policy.version ? String(policy.version) : void 0
		};
	});
	return {
		employee_id: String(root.employee_id ?? payload.employee_id ?? employment?.employee_id ?? ""),
		name: readName(payload),
		status: readStatus(statusSource),
		current_step: readCurrentStep(statusSource),
		completion_percentage: readCompletionPercentage(statusSource),
		onboarding_completed: readOnboardingCompleted(statusSource),
		verification_status: normalizeScalarString(payload.verification_status) || void 0,
		personal_information: personal ?? void 0,
		identity_details: asRecord(payload.identity) ?? asRecord(payload.identity_info) ?? asRecord(payload.identity_verification) ?? asRecord(payload.identity_details) ?? void 0,
		employment_details: employment ?? void 0,
		education: asArray(payload.education).map((item) => asRecord(item)).filter((item) => item !== null),
		experience: asArray(payload.experience).map((item) => asRecord(item)).filter((item) => item !== null),
		bank_details: asRecord(payload.bank) ?? asRecord(payload.bank_details) ?? asRecord(payload.bank_info) ?? void 0,
		tax_payroll: asRecord(payload.tax_payroll) ?? asRecord(payload.tax_and_payroll) ?? asRecord(payload.payroll_details) ?? void 0,
		documents,
		policy_acceptances: policyAcceptances
	};
}
function buildListQuery(params) {
	const searchParams = new URLSearchParams();
	if (params?.status && params.status !== "all") searchParams.set("status", params.status);
	if (params?.department && params.department !== "all") searchParams.set("department", params.department);
	if (params?.location && params.location !== "all") searchParams.set("location", params.location);
	if (params?.search?.trim()) searchParams.set("search", params.search.trim());
	const qs = searchParams.toString();
	return qs ? `?${qs}` : "";
}
var adminOnboardingApi = {
	/** Admin list: GET /admin/employee-onboarding */
	async listProgress(params) {
		const body = (await apiInstance.get(`/admin/employee-onboarding${buildListQuery(params)}`)).data;
		return asArray(body?.data).map((item) => asRecord(item)).filter((item) => item !== null).map(mapProgressListItem).filter((item) => item.employee_id);
	},
	/** Admin details: GET /admin/employee-onboarding/{employee_id} */
	async getDetails(employeeId) {
		return mapOnboardingDetails((await apiInstance.get(`/admin/employee-onboarding/${employeeId}`)).data);
	},
	/** Admin verify: PUT /admin/employee-onboarding/{employee_id}/document/{doc_id}/verify */
	async verifyDocument(employeeId, documentId, status, comment) {
		await apiInstance.put(`/admin/employee-onboarding/${employeeId}/document/${documentId}/verify`, {
			status,
			comments: comment ?? null
		});
	}
};
var DEFAULT_ONBOARDING_FILTERS = {
	status: "all",
	department: "all",
	search: "",
	currentStep: "all",
	minCompletion: ""
};
function toListParams(filters) {
	const params = {};
	if (filters.status !== "all") params.status = filters.status;
	if (filters.department !== "all") params.department = filters.department;
	if (filters.search.trim()) params.search = filters.search.trim();
	return params;
}
function applyClientFilters(items, filters) {
	return items.filter((item) => {
		if (filters.currentStep !== "all" && item.current_step !== filters.currentStep) return false;
		if (filters.minCompletion.trim()) {
			const min = Number(filters.minCompletion);
			if (!Number.isNaN(min) && item.completion_percentage < min) return false;
		}
		return true;
	});
}
function useAdminOnboarding() {
	const [filters, setFilters] = (0, import_react.useState)(DEFAULT_ONBOARDING_FILTERS);
	const [debouncedSearch, setDebouncedSearch] = (0, import_react.useState)("");
	const [rawEmployees, setRawEmployees] = (0, import_react.useState)([]);
	const [listLoading, setListLoading] = (0, import_react.useState)(true);
	const [listError, setListError] = (0, import_react.useState)(null);
	const [selectedEmployeeId, setSelectedEmployeeId] = (0, import_react.useState)(null);
	const [details, setDetails] = (0, import_react.useState)(null);
	const [detailsLoading, setDetailsLoading] = (0, import_react.useState)(false);
	const [detailsError, setDetailsError] = (0, import_react.useState)(null);
	const [actionDocumentId, setActionDocumentId] = (0, import_react.useState)(null);
	const fetchList = (0, import_react.useCallback)(async (nextFilters, silent = false) => {
		if (!silent) setListLoading(true);
		setListError(null);
		try {
			const items = await adminOnboardingApi.listProgress(toListParams(nextFilters));
			setRawEmployees(items);
			return items;
		} catch (error) {
			const message = getErrorMessage(error, "Failed to load onboarding progress");
			setListError(message);
			toast.error(message);
			return [];
		} finally {
			if (!silent) setListLoading(false);
		}
	}, []);
	const fetchDetails = (0, import_react.useCallback)(async (employeeId, silent = false) => {
		setDetailsLoading(true);
		setDetailsError(null);
		try {
			const data = await adminOnboardingApi.getDetails(employeeId);
			setDetails(data);
			return data;
		} catch (error) {
			const message = getErrorMessage(error, "Failed to load onboarding details");
			setDetailsError(message);
			if (!silent) toast.error(message);
			return null;
		} finally {
			setDetailsLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		const timer = window.setTimeout(() => {
			setDebouncedSearch(filters.search.trim());
		}, 300);
		return () => window.clearTimeout(timer);
	}, [filters.search]);
	const queryFilters = (0, import_react.useMemo)(() => ({
		...filters,
		search: debouncedSearch
	}), [filters, debouncedSearch]);
	const employees = (0, import_react.useMemo)(() => applyClientFilters(rawEmployees, queryFilters), [rawEmployees, queryFilters]);
	(0, import_react.useEffect)(() => {
		fetchList(queryFilters);
	}, [fetchList, queryFilters]);
	(0, import_react.useEffect)(() => {
		if (!selectedEmployeeId) {
			setDetails(null);
			setDetailsError(null);
			return;
		}
		fetchDetails(selectedEmployeeId);
	}, [fetchDetails, selectedEmployeeId]);
	(0, import_react.useEffect)(() => {
		if (employees.length === 0) {
			setSelectedEmployeeId(null);
			return;
		}
		if (!selectedEmployeeId || !employees.some((item) => item.employee_id === selectedEmployeeId)) setSelectedEmployeeId(employees[0].employee_id);
	}, [employees, selectedEmployeeId]);
	const departments = (0, import_react.useMemo)(() => Array.from(new Set(rawEmployees.map((item) => item.department).filter(Boolean))).sort(), [rawEmployees]);
	const currentSteps = (0, import_react.useMemo)(() => Array.from(new Set(rawEmployees.map((item) => item.current_step).filter(Boolean))).sort(), [rawEmployees]);
	return {
		filters,
		setFilters,
		employees,
		listLoading,
		listError,
		selectedEmployeeId,
		setSelectedEmployeeId,
		selectedEmployee: (0, import_react.useMemo)(() => employees.find((item) => item.employee_id === selectedEmployeeId) ?? null, [employees, selectedEmployeeId]),
		details,
		detailsLoading,
		detailsError,
		actionDocumentId,
		departments,
		currentSteps,
		stats: (0, import_react.useMemo)(() => {
			const pendingDocs = employees.reduce((total, item) => total + (item.missing_documents?.length ?? 0), 0);
			const completed = employees.filter((item) => item.status === "COMPLETED").length;
			const inProgress = employees.filter((item) => item.status === "IN_PROGRESS").length;
			const avgCompletion = employees.length ? Math.round(employees.reduce((sum, item) => sum + (item.completion_percentage ?? 0), 0) / employees.length) : 0;
			return {
				total: employees.length,
				completed,
				inProgress,
				pendingDocs,
				avgCompletion
			};
		}, [employees]),
		retryList: (0, import_react.useCallback)(async () => {
			setListLoading(true);
			setListError(null);
			try {
				setRawEmployees(await adminOnboardingApi.listProgress(toListParams(queryFilters)));
				toast.success("Onboarding data loaded successfully");
			} catch (error) {
				const message = getErrorMessage(error, "Failed to load onboarding progress");
				setListError(message);
				toast.error(message);
			} finally {
				setListLoading(false);
			}
		}, [queryFilters]),
		retryDetails: (0, import_react.useCallback)(() => {
			if (!selectedEmployeeId) return;
			fetchDetails(selectedEmployeeId);
		}, [fetchDetails, selectedEmployeeId]),
		verifyDocument: (0, import_react.useCallback)(async (documentId, status, comment) => {
			if (!selectedEmployeeId) return false;
			setActionDocumentId(documentId);
			try {
				await adminOnboardingApi.verifyDocument(selectedEmployeeId, documentId, status, comment);
				toast.success(status === "VERIFIED" ? "Document verified successfully" : "Document rejected");
				await Promise.all([fetchDetails(selectedEmployeeId, true), fetchList(queryFilters, true)]);
				return true;
			} catch (error) {
				toast.error(getErrorMessage(error, "Failed to update document status"));
				return false;
			} finally {
				setActionDocumentId(null);
			}
		}, [
			fetchDetails,
			fetchList,
			queryFilters,
			selectedEmployeeId
		])
	};
}
function OnboardingPage() {
	const { filters, setFilters, employees, listLoading, listError, selectedEmployeeId, setSelectedEmployeeId, selectedEmployee, details, detailsLoading, detailsError, actionDocumentId, departments, currentSteps, stats, retryList, retryDetails, verifyDocument } = useAdminOnboarding();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 gap-4 md:grid-cols-4",
			children: [
				{
					k: "In Onboarding",
					v: stats.total,
					icon: UserPlus
				},
				{
					k: "Completed",
					v: stats.completed,
					icon: CircleCheck
				},
				{
					k: "Avg Completion",
					v: `${stats.avgCompletion}%`,
					icon: UserCheck
				},
				{
					k: "Pending Documents",
					v: stats.pendingDocs,
					icon: FileText
				}
			].map((stat) => {
				const Icon = stat.icon;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: stat.k }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 font-display text-2xl font-semibold",
						children: stat.v
					})]
				}, stat.k);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingFiltersBar, {
				filters,
				departments,
				currentSteps,
				onChange: setFilters
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 grid grid-cols-1 items-start gap-4 lg:grid-cols-[320px_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingEmployeeList, {
				employees,
				loading: listLoading,
				error: listError,
				selectedEmployeeId,
				onSelect: setSelectedEmployeeId,
				onRetry: () => void retryList()
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OnboardingDetailsPanel, {
				employee: selectedEmployee,
				details,
				loading: detailsLoading,
				error: detailsError,
				actionDocumentId,
				onRetry: retryDetails,
				onVerifyDocument: verifyDocument
			})]
		})
	] });
}
//#endregion
export { OnboardingPage };
