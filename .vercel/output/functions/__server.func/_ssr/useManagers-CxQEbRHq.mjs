import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { D as clearSelectedManager, G as importManagers, I as fetchManagerById, L as fetchManagers, ct as updateManager, j as deleteManager, k as createManager } from "./departmentsSlice-BOlsHBgC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useManagers-CxQEbRHq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var OFFICES = [
	"San Francisco HQ",
	"Bengaluru Tech Park",
	"London Office",
	"Singapore Hub",
	"New York Branch",
	"Dubai Office",
	"Remote"
];
function useManagers() {
	const dispatch = useAppDispatch();
	const { managers, loading, submitting, error, total, page, limit, totalPages, selectedManager, selectedManagerLoading, selectedManagerError, selectedManagerForm } = useAppSelector((state) => state.managers);
	return {
		managers,
		loading,
		submitting,
		error,
		total,
		page,
		limit,
		totalPages,
		selectedManager,
		selectedManagerLoading,
		selectedManagerError,
		selectedManagerForm,
		fetchManagers: (0, import_react.useCallback)((params) => dispatch(fetchManagers(params)), [dispatch]),
		fetchManagerById: (0, import_react.useCallback)((id) => dispatch(fetchManagerById(id)), [dispatch]),
		createManager: (0, import_react.useCallback)((payload) => dispatch(createManager(payload)), [dispatch]),
		updateManager: (0, import_react.useCallback)((id, payload) => dispatch(updateManager({
			id,
			payload
		})), [dispatch]),
		deleteManager: (0, import_react.useCallback)((id) => dispatch(deleteManager(id)), [dispatch]),
		bulkDelete: async (_ids) => void 0,
		bulkSetStatus: async (_ids, _status) => void 0,
		importManagers: (0, import_react.useCallback)((imported) => dispatch(importManagers(imported)), [dispatch]),
		clearSelectedManager: (0, import_react.useCallback)(() => dispatch(clearSelectedManager()), [dispatch])
	};
}
//#endregion
export { useManagers as n, OFFICES as t };
