import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { y as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { Dr as ChevronRight, kr as ChevronDown } from "../_libs/lucide-react.mjs";
import { H as getExpandedGroupsForValue, V as getDepartmentLabel, a as DEPARTMENT_GROUPS, nt as resolveDepartmentValue, q as isParentGroupValue, s as DEPARTMENT_VALUES } from "./departmentsSlice-BOlsHBgC.mjs";
import { n as SelectContent, r as SelectItem } from "./select-DCMcI36W.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/DepartmentSelectContent-BboI2aL5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function DepartmentSelectContent({ includeAllOption = false, extraValues = [], selectedValue }) {
	const resolvedSelectedValue = resolveDepartmentValue(selectedValue);
	const [expandedGroups, setExpandedGroups] = (0, import_react.useState)(() => getExpandedGroupsForValue(selectedValue));
	(0, import_react.useEffect)(() => {
		const groupsToExpand = getExpandedGroupsForValue(selectedValue);
		if (groupsToExpand.length === 0) return;
		setExpandedGroups((prev) => [.../* @__PURE__ */ new Set([...prev, ...groupsToExpand])]);
	}, [selectedValue]);
	const toggleGroup = (value) => {
		setExpandedGroups((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
	};
	const customValues = extraValues.map((value) => resolveDepartmentValue(value) ?? value).filter((value) => value && !DEPARTMENT_VALUES.includes(value));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
		includeAllOption && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: "all",
			children: "All departments"
		}),
		resolvedSelectedValue && isParentGroupValue(resolvedSelectedValue) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value: resolvedSelectedValue,
			children: getDepartmentLabel(resolvedSelectedValue)
		}),
		customValues.map((value) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
			value,
			children: value
		}, value)),
		DEPARTMENT_GROUPS.map((group) => {
			const hasChildren = (group.subgroups?.length ?? 0) > 0 || (group.options?.length ?? 0) > 0;
			const isExpanded = expandedGroups.includes(group.value) || group.options?.includes(resolvedSelectedValue ?? "") || group.subgroups?.some((subgroup) => subgroup.value === resolvedSelectedValue || subgroup.options.includes(resolvedSelectedValue ?? ""));
			if (!hasChildren) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
				value: group.value,
				className: "font-medium",
				children: group.label
			}, group.value);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex cursor-pointer items-center justify-between px-2 py-2 text-sm font-medium",
				onClick: (e) => {
					e.preventDefault();
					e.stopPropagation();
					toggleGroup(group.value);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: group.label }), isExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })]
			}), isExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [group.subgroups?.map((subgroup) => subgroup.options?.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-4 py-1.5 text-xs font-medium text-muted-foreground",
				children: subgroup.label
			}), subgroup.options.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
				value: option,
				className: "pl-6",
				children: option
			}, option))] }, subgroup.value) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
				value: subgroup.value,
				className: "pl-6",
				children: subgroup.label
			}, subgroup.value)), group.options?.map((option) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
				value: option,
				className: "pl-6",
				children: option
			}, option))] })] }, group.value);
		})
	] });
}
//#endregion
export { DepartmentSelectContent as t };
