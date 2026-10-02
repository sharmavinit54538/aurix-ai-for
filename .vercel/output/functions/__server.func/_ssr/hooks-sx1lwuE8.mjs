import { o as __toESM } from "../_runtime.mjs";
import { o as require_react } from "../_libs/@ai-sdk/react+[...].mjs";
import { n as useAppSelector, t as useAppDispatch } from "./hooks-BpVIWXzj.mjs";
import { r as ApiError } from "./apiInstance-C5A0vaLH.mjs";
import { I as fetchSuperAdminStatistics, L as fetchSystemHealth, M as fetchPlatformUsers, Q as superAdminApi, U as normalizeStatistics, b as fetchActiveSessions, f as collectAllPages, g as deactivatePlatformUser, j as fetchPlatformSettings, k as fetchOrganizations, o as activatePlatformUser, tt as updatePlatformSettings, x as fetchAuditLogs } from "./auth-bootstrap-CR9kF6gO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hooks-sx1lwuE8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
/**
* Super Admin Redux-Powered Hooks.
*
* Connects the Super Admin UI components directly to the Redux store:
* - Dispatches Redux Toolkit `createAsyncThunk` actions
* - Subscribes to `state.superAdmin` slices
* - Manages lifecycle, loading, error, and refresh states
* - Zero mock data, zero hardcoded values
*/
var ANALYTICS_MAX_USERS = 5e3;
var ANALYTICS_MAX_ORGANIZATIONS = 2e3;
function useSuperAdminStatistics() {
	const dispatch = useAppDispatch();
	const statistics = useAppSelector((state) => state.superAdmin.statistics);
	(0, import_react.useEffect)(() => {
		if (!statistics.data && !statistics.loading && !statistics.error) dispatch(fetchSuperAdminStatistics());
	}, [
		dispatch,
		statistics.data,
		statistics.loading,
		statistics.error
	]);
	const normalized = (0, import_react.useMemo)(() => {
		if (!statistics.data) return null;
		return normalizeStatistics(statistics.data);
	}, [statistics.data]);
	const refetch = (0, import_react.useCallback)(() => {
		return dispatch(fetchSuperAdminStatistics()).unwrap();
	}, [dispatch]);
	const errorObj = (0, import_react.useMemo)(() => {
		return statistics.error ? new ApiError(statistics.error, 500, null) : null;
	}, [statistics.error]);
	return {
		data: normalized,
		raw: statistics.data,
		isPending: statistics.loading && !statistics.data,
		isLoading: statistics.loading && !statistics.data,
		isFetching: statistics.loading,
		isError: Boolean(statistics.error),
		error: errorObj,
		refetch
	};
}
function useSuperAdminUsers(params) {
	const dispatch = useAppDispatch();
	const users = useAppSelector((state) => state.superAdmin.users);
	(0, import_react.useEffect)(() => {
		dispatch(fetchPlatformUsers(params));
	}, [dispatch, JSON.stringify(params)]);
	const refetch = (0, import_react.useCallback)(() => {
		return dispatch(fetchPlatformUsers(params)).unwrap();
	}, [dispatch, params]);
	const errorObj = (0, import_react.useMemo)(() => {
		return users.error ? new ApiError(users.error, 500, null) : null;
	}, [users.error]);
	return {
		data: users.items,
		isPending: users.loading && users.items.length === 0,
		isLoading: users.loading && users.items.length === 0,
		isFetching: users.loading,
		isPlaceholderData: false,
		isError: Boolean(users.error),
		error: errorObj,
		refetch
	};
}
function useSuperAdminOrganizations(params) {
	const dispatch = useAppDispatch();
	const organizations = useAppSelector((state) => state.superAdmin.organizations);
	(0, import_react.useEffect)(() => {
		dispatch(fetchOrganizations(params));
	}, [dispatch, JSON.stringify(params)]);
	const refetch = (0, import_react.useCallback)(() => {
		return dispatch(fetchOrganizations(params)).unwrap();
	}, [dispatch, params]);
	const errorObj = (0, import_react.useMemo)(() => {
		return organizations.error ? new ApiError(organizations.error, 500, null) : null;
	}, [organizations.error]);
	return {
		data: organizations.items,
		isPending: organizations.loading && organizations.items.length === 0,
		isLoading: organizations.loading && organizations.items.length === 0,
		isFetching: organizations.loading,
		isPlaceholderData: false,
		isError: Boolean(organizations.error),
		error: errorObj,
		refetch
	};
}
function useOrganizationDirectory() {
	return useSuperAdminOrganizations((0, import_react.useMemo)(() => ({
		page: 1,
		pageSize: 200
	}), []));
}
function useSuperAdminAuditLogs(params) {
	const dispatch = useAppDispatch();
	const auditLogs = useAppSelector((state) => state.superAdmin.auditLogs);
	(0, import_react.useEffect)(() => {
		dispatch(fetchAuditLogs(params));
	}, [dispatch, JSON.stringify(params)]);
	const refetch = (0, import_react.useCallback)(() => {
		return dispatch(fetchAuditLogs(params)).unwrap();
	}, [dispatch, params]);
	const errorObj = (0, import_react.useMemo)(() => {
		return auditLogs.error ? new ApiError(auditLogs.error, 500, null) : null;
	}, [auditLogs.error]);
	return {
		data: auditLogs.items,
		isPending: auditLogs.loading && auditLogs.items.length === 0,
		isLoading: auditLogs.loading && auditLogs.items.length === 0,
		isFetching: auditLogs.loading,
		isPlaceholderData: false,
		isError: Boolean(auditLogs.error),
		error: errorObj,
		refetch
	};
}
function useSuperAdminAuditFeed(pageSize, refetchIntervalMs = false) {
	useAppDispatch();
	const auditLogs = useAppSelector((state) => state.superAdmin.auditLogs);
	const [page, setPage] = (0, import_react.useState)(1);
	const [pages, setPages] = (0, import_react.useState)([]);
	const loadFeed = (0, import_react.useCallback)(async (p) => {
		try {
			const items = await superAdminApi.listAuditEvents({
				page: p,
				pageSize
			});
			setPages((prev) => {
				const next = [...prev];
				next[p - 1] = items;
				return next;
			});
		} catch (err) {}
	}, [pageSize]);
	(0, import_react.useEffect)(() => {
		loadFeed(1);
	}, [loadFeed]);
	(0, import_react.useEffect)(() => {
		if (typeof refetchIntervalMs === "number" && refetchIntervalMs > 0) {
			const timer = setInterval(() => {
				loadFeed(1);
			}, refetchIntervalMs);
			return () => clearInterval(timer);
		}
	}, [loadFeed, refetchIntervalMs]);
	const fetchNextPage = (0, import_react.useCallback)(async () => {
		const nextPage = page + 1;
		setPage(nextPage);
		await loadFeed(nextPage);
	}, [page, loadFeed]);
	const lastPage = pages[pages.length - 1];
	const hasNextPage = Boolean(lastPage && lastPage.length === pageSize);
	const errorObj = (0, import_react.useMemo)(() => {
		return auditLogs.error ? new ApiError(auditLogs.error, 500, null) : null;
	}, [auditLogs.error]);
	return {
		data: { pages },
		isPending: pages.length === 0,
		isLoading: pages.length === 0,
		isFetching: false,
		isFetchingNextPage: false,
		hasNextPage,
		fetchNextPage,
		isError: Boolean(auditLogs.error),
		error: errorObj,
		refetch: () => loadFeed(1)
	};
}
function useSuperAdminSessions(refetchIntervalMs = false) {
	const dispatch = useAppDispatch();
	const sessions = useAppSelector((state) => state.superAdmin.security.sessions);
	const loading = useAppSelector((state) => state.superAdmin.security.loading);
	const error = useAppSelector((state) => state.superAdmin.security.error);
	(0, import_react.useEffect)(() => {
		dispatch(fetchActiveSessions());
	}, [dispatch]);
	(0, import_react.useEffect)(() => {
		if (typeof refetchIntervalMs === "number" && refetchIntervalMs > 0) {
			const timer = setInterval(() => {
				dispatch(fetchActiveSessions());
			}, refetchIntervalMs);
			return () => clearInterval(timer);
		}
	}, [dispatch, refetchIntervalMs]);
	const refetch = (0, import_react.useCallback)(() => {
		return dispatch(fetchActiveSessions()).unwrap();
	}, [dispatch]);
	const errorObj = (0, import_react.useMemo)(() => {
		return error ? new ApiError(error, 500, null) : null;
	}, [error]);
	return {
		data: sessions,
		isPending: loading && sessions.length === 0,
		isLoading: loading && sessions.length === 0,
		isFetching: loading,
		isError: Boolean(error),
		error: errorObj,
		refetch
	};
}
function useSystemHealth() {
	const dispatch = useAppDispatch();
	const systemHealth = useAppSelector((state) => state.superAdmin.systemHealth);
	const [snapshot, setSnapshot] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError(null);
		try {
			setSnapshot(await superAdminApi.getSystemHealth());
			dispatch(fetchSystemHealth());
		} catch (err) {
			setError(err instanceof ApiError ? err : new ApiError(getErrorMessage(err), 500, null));
		} finally {
			setLoading(false);
		}
	}, [dispatch]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	return {
		data: snapshot,
		raw: systemHealth.data,
		isPending: loading && !snapshot,
		isLoading: loading && !snapshot,
		isFetching: loading,
		isError: Boolean(error),
		error,
		refetch: load
	};
}
function usePublicHealth() {
	const [data, setData] = (0, import_react.useState)(null);
	const [isPending, setIsPending] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(async () => {
		setIsPending(true);
		setError(null);
		try {
			setData(await superAdminApi.getPublicHealth());
		} catch (err) {
			setError(err instanceof ApiError ? err : new ApiError(getErrorMessage(err), 500, null));
		} finally {
			setIsPending(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	return {
		data,
		isPending,
		isLoading: isPending,
		isFetching: isPending,
		isError: Boolean(error),
		error,
		refetch: load
	};
}
function useReadiness() {
	const [data, setData] = (0, import_react.useState)(null);
	const [isPending, setIsPending] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(async () => {
		setIsPending(true);
		setError(null);
		try {
			setData(await superAdminApi.getReadiness());
		} catch (err) {
			setError(err instanceof ApiError ? err : new ApiError(getErrorMessage(err), 500, null));
		} finally {
			setIsPending(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	return {
		data,
		isPending,
		isLoading: isPending,
		isFetching: isPending,
		isError: Boolean(error),
		error,
		refetch: load
	};
}
function useSuperAdminSettings() {
	const dispatch = useAppDispatch();
	const settings = useAppSelector((state) => state.superAdmin.settings);
	(0, import_react.useEffect)(() => {
		if (!settings.data && !settings.loading) dispatch(fetchPlatformSettings());
	}, [
		dispatch,
		settings.data,
		settings.loading
	]);
	const refetch = (0, import_react.useCallback)(() => {
		return dispatch(fetchPlatformSettings()).unwrap();
	}, [dispatch]);
	const errorObj = (0, import_react.useMemo)(() => {
		return settings.error ? new ApiError(settings.error, 500, null) : null;
	}, [settings.error]);
	return {
		data: settings.data ?? {},
		isPending: settings.loading && !settings.data,
		isLoading: settings.loading && !settings.data,
		isFetching: settings.loading,
		isError: Boolean(settings.error),
		error: errorObj,
		refetch
	};
}
function useAnalyticsDataset() {
	const [data, setData] = (0, import_react.useState)(null);
	const [isPending, setIsPending] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(async () => {
		setIsPending(true);
		setError(null);
		try {
			const [users, organizations] = await Promise.all([collectAllPages((page, pageSize) => superAdminApi.listUsers({
				page,
				pageSize
			}), ANALYTICS_MAX_USERS), collectAllPages((page, pageSize) => superAdminApi.listOrganizations({
				page,
				pageSize
			}), ANALYTICS_MAX_ORGANIZATIONS)]);
			setData({
				users,
				organizations,
				collectedAt: (/* @__PURE__ */ new Date()).toISOString()
			});
		} catch (err) {
			setError(err instanceof ApiError ? err : new ApiError(getErrorMessage(err), 500, null));
		} finally {
			setIsPending(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	return {
		data,
		isPending,
		isLoading: isPending,
		isFetching: isPending,
		isError: Boolean(error),
		error,
		refetch: load
	};
}
function useSetUserActive() {
	const dispatch = useAppDispatch();
	const [isPending, setIsPending] = (0, import_react.useState)(false);
	return {
		mutateAsync: (0, import_react.useCallback)(async ({ userId, active }) => {
			setIsPending(true);
			try {
				const res = await dispatch(active ? activatePlatformUser(userId) : deactivatePlatformUser(userId)).unwrap();
				dispatch(fetchSuperAdminStatistics());
				return res.message;
			} finally {
				setIsPending(false);
			}
		}, [dispatch]),
		isPending
	};
}
function useUpdateSuperAdminSettings() {
	const dispatch = useAppDispatch();
	const [isPending, setIsPending] = (0, import_react.useState)(false);
	return {
		mutateAsync: (0, import_react.useCallback)(async (changes) => {
			setIsPending(true);
			try {
				const res = await dispatch(updatePlatformSettings(changes)).unwrap();
				dispatch(fetchAuditLogs());
				return res;
			} finally {
				setIsPending(false);
			}
		}, [dispatch]),
		isPending
	};
}
function getErrorMessage(err, defaultMessage = "Operation failed") {
	if (err && typeof err === "object" && "message" in err && typeof err.message === "string") return err.message;
	if (typeof err === "string") return err;
	return defaultMessage;
}
//#endregion
export { useSetUserActive as a, useSuperAdminOrganizations as c, useSuperAdminStatistics as d, useSuperAdminUsers as f, useReadiness as i, useSuperAdminSessions as l, useUpdateSuperAdminSettings as m, useOrganizationDirectory as n, useSuperAdminAuditFeed as o, useSystemHealth as p, usePublicHealth as r, useSuperAdminAuditLogs as s, useAnalyticsDataset as t, useSuperAdminSettings as u };
