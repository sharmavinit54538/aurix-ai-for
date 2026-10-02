import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Rn as FileSpreadsheet, Tr as CircleAlert, an as Layers, ht as Plus, lt as RefreshCw } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-OuFjfcpS.mjs";
import { t as Input } from "./input-C33ZT5Xm.mjs";
import { t as Badge } from "./badge-D1Dupn2y.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-sii-Xwus.mjs";
import { r as GlassCard } from "./Shared-C_skH1kb.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-BgKcOzjx.mjs";
import { n as AlertDescription, r as AlertTitle, t as Alert } from "./alert-B82KXmg0.mjs";
import { n as formatDate } from "./format-8CvzIoFt.mjs";
import { t as compensationApi } from "./compensationApi-B-vb0VVg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SalaryStructurePage-D9wwtADG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SalaryStructurePage() {
	const [activeTab, setActiveTab] = (0, import_react.useState)("components");
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [backendUnavailable, setBackendUnavailable] = (0, import_react.useState)(false);
	const [components, setComponents] = (0, import_react.useState)([]);
	const [structures, setStructures] = (0, import_react.useState)([]);
	const [componentModalOpen, setComponentModalOpen] = (0, import_react.useState)(false);
	const [code, setCode] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [compType, setCompType] = (0, import_react.useState)("earning");
	const [calcMethod, setCalcMethod] = (0, import_react.useState)("flat");
	const [isTaxable, setIsTaxable] = (0, import_react.useState)(true);
	const [isStatutory, setIsStatutory] = (0, import_react.useState)(false);
	const [creatingComponent, setCreatingComponent] = (0, import_react.useState)(false);
	const loadData = async () => {
		setLoading(true);
		setBackendUnavailable(false);
		try {
			const [compRes, structRes] = await Promise.all([compensationApi.getPayComponents().catch((err) => {
				if (err?.response?.status === 404 || err?.response?.status === 501) setBackendUnavailable(true);
				return [];
			}), compensationApi.getSalaryStructures().catch((err) => {
				if (err?.response?.status === 404 || err?.response?.status === 501) setBackendUnavailable(true);
				return [];
			})]);
			setComponents(compRes);
			setStructures(structRes);
		} catch {
			toast.error("Failed to load salary structure details");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadData();
	}, []);
	const handleCreateComponent = async () => {
		if (!code.trim() || !name.trim()) {
			toast.error("Component code and name are required.");
			return;
		}
		setCreatingComponent(true);
		try {
			await compensationApi.createPayComponent({
				code: code.trim().toUpperCase(),
				name: name.trim(),
				type: compType,
				calculationMethod: calcMethod,
				taxable: isTaxable,
				statutory: isStatutory,
				effectiveDate: (/* @__PURE__ */ new Date()).toISOString()
			});
			toast.success(`Pay component ${code} created.`);
			setComponentModalOpen(false);
			setCode("");
			setName("");
			loadData();
		} catch (err) {
			toast.error(err?.response?.data?.message || "Failed to create pay component");
		} finally {
			setCreatingComponent(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/70 pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-2xl font-bold tracking-tight text-foreground",
						children: "Salary Structures & Component Master"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						className: "text-xs font-semibold border-primary/30 bg-primary/10 text-primary",
						children: "Compensation Architecture"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: "Configure pay components, define statutory eligibility formulas, and maintain corporate CTC templates."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						size: "sm",
						onClick: loadData,
						disabled: loading,
						className: "h-8 gap-1.5 text-xs rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: loading ? "h-3.5 w-3.5 animate-spin" : "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Refresh" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "sm",
						onClick: () => setComponentModalOpen(true),
						className: "h-8 gap-1.5 text-xs rounded-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "New Pay Component" })]
					})]
				})]
			}),
			backendUnavailable && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Alert, {
				className: "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertTitle, {
						className: "font-semibold text-sm",
						children: "Feature unavailable — backend pending"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AlertDescription, {
						className: "text-xs mt-1 space-y-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The Pay Component Master and Salary Structure API endpoints are awaiting backend deployment. Component schemas and calculation method definitions are operational." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "font-mono text-[11px] opacity-80",
							children: [
								"Contract reference: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "docs/PAYROLL_BACKEND_CONTRACT.md" }),
								" • Requirements: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "docs/PAYROLL_BACKEND_TODO.md" })
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: activeTab,
				onValueChange: (val) => setActiveTab(val),
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "bg-muted/50 p-1 rounded-2xl border border-border/60",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "components",
							className: "rounded-xl text-xs",
							children: [
								"Pay Component Master (",
								components.length,
								")"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsTrigger, {
							value: "structures",
							className: "rounded-xl text-xs",
							children: [
								"Salary Structure Templates (",
								structures.length,
								")"
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "components",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
							className: "overflow-hidden p-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Code"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Component Name"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Type"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Calculation Method"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Taxable"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Statutory"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Status"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Effective Date"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-border/60",
										children: components.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											colSpan: 8,
											className: "px-4 py-12 text-center text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground/60" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-foreground text-sm",
													children: "No Pay Components Found"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground mt-0.5",
													children: backendUnavailable ? "Component master API pending backend deployment." : "Click 'New Pay Component' to create your first earning or deduction."
												})
											]
										}) }) : components.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-muted/40 transition-colors",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono font-semibold text-foreground",
													children: c.code
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-medium text-foreground",
													children: c.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 capitalize",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "outline",
														className: "text-[10px]",
														children: c.type.replace(/_/g, " ")
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono text-[11px]",
													children: c.calculationMethod.replace(/_/g, " ")
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: c.taxable ? "Yes" : "Exempt"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: c.statutory ? "Statutory" : "Standard"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: c.isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
														children: "Active"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "secondary",
														children: "Inactive"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 text-muted-foreground",
													children: formatDate(c.effectiveDate)
												})
											]
										}, c.id))
									})]
								})
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "structures",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlassCard, {
							className: "overflow-hidden p-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-left text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-muted/40 text-muted-foreground border-b border-border/70 uppercase tracking-wider text-[11px] font-semibold",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Template Code"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Structure Name"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Components Configured"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Assigned Employees"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Status"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Created Date"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-border/60",
										children: structures.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
											colSpan: 6,
											className: "px-4 py-12 text-center text-muted-foreground",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-8 w-8 mx-auto mb-2 text-muted-foreground/60" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-foreground text-sm",
													children: "No Salary Structures Defined"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground mt-0.5",
													children: backendUnavailable ? "Salary structures API pending backend deployment." : "Define salary structure templates to assign standard compensation packages to employees."
												})
											]
										}) }) : structures.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-muted/40 transition-colors",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono font-semibold text-foreground",
													children: s.code
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-medium text-foreground",
													children: s.name
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono",
													children: s.components?.length || 0
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 font-mono",
													children: s.assignedEmployeesCount || 0
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3",
													children: s.isActive ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														className: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30",
														children: "Active"
													}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
														variant: "secondary",
														children: "Draft"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3 text-muted-foreground",
													children: formatDate(s.createdAt)
												})
											]
										}, s.id))
									})]
								})
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: componentModalOpen,
				onOpenChange: setComponentModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-base font-semibold",
							children: "Create Pay Component"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground",
							children: "Define a new earning, deduction, or statutory contribution component for salary structures."
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-foreground",
									children: "Component Code *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "comp-code-input",
									placeholder: "e.g. BASIC, HRA, SPECIAL_ALLOW",
									value: code,
									onChange: (e) => setCode(e.target.value.toUpperCase()),
									className: "mt-1 h-8 rounded-lg text-xs font-mono"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-foreground",
									children: "Component Name *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "comp-name-input",
									placeholder: "e.g. Basic Salary",
									value: name,
									onChange: (e) => setName(e.target.value),
									className: "mt-1 h-8 rounded-lg text-xs"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-foreground",
									children: "Component Type"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: compType,
									onChange: (e) => setCompType(e.target.value),
									className: "mt-1 w-full rounded-lg border border-input bg-background/80 px-2 py-1.5 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "earning",
											children: "Earning"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "deduction",
											children: "Deduction"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "employer_contribution",
											children: "Employer Contribution"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-semibold text-foreground",
									children: "Calculation Method"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: calcMethod,
									onChange: (e) => setCalcMethod(e.target.value),
									className: "mt-1 w-full rounded-lg border border-input bg-background/80 px-2 py-1.5 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "flat",
											children: "Flat Fixed Amount"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "percentage_of_basic",
											children: "% of Basic"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "percentage_of_ctc",
											children: "% of CTC"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "formula",
											children: "Custom Rule Formula"
										})
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-4 pt-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-1.5 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: isTaxable,
											onChange: (e) => setIsTaxable(e.target.checked),
											className: "rounded border-input"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Taxable Income" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "flex items-center gap-1.5 cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: isStatutory,
											onChange: (e) => setIsStatutory(e.target.checked),
											className: "rounded border-input"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Statutory Component" })]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => setComponentModalOpen(false),
								className: "rounded-xl text-xs",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								disabled: creatingComponent,
								onClick: handleCreateComponent,
								className: "rounded-xl text-xs",
								children: creatingComponent ? "Creating..." : "Save Component"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { SalaryStructurePage as default };
