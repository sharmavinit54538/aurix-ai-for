import { n as safeStorage } from "./safe-storage-DInQCreU.mjs";
import { t as aurix } from "./aurix-store-BcCbMqU4.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as axios } from "../_libs/axios+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/apiInstance-C5A0vaLH.js
/**
* Token Manager
*
* Security:
* - Access token is kept in-memory for active API authorizations.
* - Refresh token is kept in memory and persisted in safeStorage to allow
*   session continuity and token refresh 4 minutes after login or on page reloads.
*/
var REFRESH_TOKEN_KEY = "aurix:refresh_token";
var LEGACY_TOKENS_KEY = "aurix:tokens";
var inMemoryAccessToken = null;
var inMemoryRefreshToken = null;
if (typeof window !== "undefined") {
	safeStorage.removeItem(LEGACY_TOKENS_KEY);
	const storedRefresh = safeStorage.getItem(REFRESH_TOKEN_KEY);
	if (storedRefresh) inMemoryRefreshToken = storedRefresh;
}
function getTokens() {
	if (!inMemoryAccessToken) return null;
	const refreshToken = getRefreshToken() || void 0;
	return {
		accessToken: inMemoryAccessToken,
		refreshToken
	};
}
function setTokens(tokens) {
	inMemoryAccessToken = tokens?.accessToken || null;
	if (tokens && tokens.refreshToken !== void 0) {
		inMemoryRefreshToken = tokens.refreshToken || null;
		if (tokens.refreshToken) safeStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
		else safeStorage.removeItem(REFRESH_TOKEN_KEY);
	}
	if (!tokens) {
		inMemoryRefreshToken = null;
		safeStorage.removeItem(REFRESH_TOKEN_KEY);
	}
	safeStorage.removeItem(LEGACY_TOKENS_KEY);
}
function getRefreshToken() {
	if (inMemoryRefreshToken) return inMemoryRefreshToken;
	const stored = safeStorage.getItem(REFRESH_TOKEN_KEY);
	if (stored) {
		inMemoryRefreshToken = stored;
		return stored;
	}
	return null;
}
/**
* Centralized endpoint definitions for OFC360 backend API.
* All backend API routes exist under /api/v1/ on the remote backend https://api.ofc360.com.
*/
var AUTH_ENDPOINTS = {
	login: "/api/v1/auth/login",
	refresh: "/api/v1/auth/refresh",
	logout: "/api/v1/auth/logout",
	me: "/api/v1/auth/me",
	register: "/api/v1/auth/register",
	verifyEmail: "/api/v1/auth/verify-email",
	resendOtp: "/api/v1/auth/resend-otp",
	forgotPassword: "/api/v1/auth/forgot-password",
	verifyResetOtp: "/api/v1/auth/verify-reset-otp",
	resetPassword: "/api/v1/auth/reset-password",
	google: "/api/v1/auth/google",
	changePassword: "/api/v1/auth/change-password"
};
var ApiError = class extends Error {
	status;
	data;
	constructor(message, status, data) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.data = data;
	}
};
function normalizeApiPath(path) {
	let clean = path.trim();
	if (clean.startsWith("http://") || clean.startsWith("https://")) try {
		const parsed = new URL(clean);
		if (parsed.hostname.includes("ofc360.com") || parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") clean = parsed.pathname + parsed.search;
		else return clean;
	} catch {
		return clean;
	}
	clean = clean.replace(/^(?:https?:\/\/[^/]+)?(?:\/)?(?:www\.)?api\.ofc360\.com(?:\/)?/, "/");
	clean = clean.replace(/^\/?(?:http:\/\/localhost:\d+\/)?/, "/");
	if (!clean.startsWith("/")) clean = `/${clean}`;
	clean = clean.replace(/^(\/api\/v1)+/g, "/api/v1");
	clean = clean.replace(/^(\/api)+/g, "/api");
	if (!clean.startsWith("/api/")) clean = `/api/v1${clean}`;
	clean = clean.replace(/^\/api\/v1\/api\/v1/g, "/api/v1");
	clean = clean.replace(/^\/api\/v1\/api/g, "/api/v1");
	return clean;
}
function toApiError(error) {
	if (error instanceof ApiError) return error;
	if (axios.isAxiosError(error)) {
		const data = error.response?.data;
		return new ApiError(data && typeof data === "object" && "message" in data && typeof data.message === "string" ? data.message : error.message || `Request failed with status ${error.response?.status ?? 500}`, error.response?.status ?? 500, data ?? null);
	}
	if (error instanceof Error) return new ApiError(error.message, 500, null);
	return new ApiError("Network error", 500, null);
}
async function apiRequest(path, options = {}) {
	try {
		return (await apiInstance.request({
			method: options.method ?? "GET",
			url: normalizeApiPath(path),
			data: options.data,
			headers: options.headers,
			timeout: options.timeout
		})).data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.message === "Failed to refresh session") throw new ApiError("Session expired. Please log in again.", 401, null);
		throw toApiError(error);
	}
}
/** Convenience methods — returns response body directly (same as legacy api-client). */
var api = {
	get: (path, options) => apiRequest(path, {
		...options,
		method: "GET"
	}),
	post: (path, data, options) => apiRequest(path, {
		...options,
		method: "POST",
		data
	}),
	put: (path, data, options) => apiRequest(path, {
		...options,
		method: "PUT",
		data
	}),
	patch: (path, data, options) => apiRequest(path, {
		...options,
		method: "PATCH",
		data
	}),
	delete: (path, options) => apiRequest(path, {
		...options,
		method: "DELETE"
	})
};
var isSessionExpiredHandled = false;
function handleSessionExpired() {
	setTokens(null);
	aurix.set({
		isRestoring: false,
		user: null,
		company: null
	});
	safeStorage.removeItem("aurix:workspace:v1");
	safeStorage.removeItem("aurix:tokens");
	safeStorage.removeItem("aurix:refresh_token");
	if (!isSessionExpiredHandled) {
		isSessionExpiredHandled = true;
		toast.error("Session expired. Please sign in again.");
		if (typeof window !== "undefined" && !window.location.pathname.includes("/login")) window.location.replace("/login");
		setTimeout(() => {
			isSessionExpiredHandled = false;
		}, 5e3);
	}
}
/**
* Normalizes the API base origin, ensuring https:// protocol and no trailing slashes.
* e.g., "https://api.ofc360.com"
*/
function getApiBaseUrl() {
	let url = "https://api.ofc360.com".trim();
	if (!url) return "https://api.ofc360.com";
	url = url.replace(/^\/+/, "");
	if (!url.startsWith("http://") && !url.startsWith("https://")) url = `https://${url}`;
	url = url.replace(/www\.api\.ofc360\.com/g, "api.ofc360.com");
	url = url.replace(/\/+$/, "");
	url = url.replace(/\/api(\/v1)?$/, "");
	return url;
}
var API_BASE_URL = getApiBaseUrl();
var BASE_URL = `${API_BASE_URL}/api/v1`;
var apiInstance = axios.create({
	baseURL: API_BASE_URL,
	timeout: 12e4,
	withCredentials: true,
	headers: { "Content-Type": "application/json" }
});
var refreshPromise = null;
async function refreshAccessToken() {
	if (refreshPromise) return refreshPromise;
	refreshPromise = (async () => {
		try {
			const currentRefreshToken = getRefreshToken();
			const body = {};
			if (currentRefreshToken) {
				body.refresh_token = currentRefreshToken;
				body.refreshToken = currentRefreshToken;
			}
			const refreshUrl = `${API_BASE_URL}${AUTH_ENDPOINTS.refresh}`;
			let res;
			try {
				res = await axios.post(refreshUrl, body, {
					withCredentials: true,
					headers: { "Content-Type": "application/json" }
				});
			} catch (postErr) {
				const status = postErr?.response?.status;
				if (status === 404) throw new Error(`Refresh route configuration error: ${refreshUrl} returned 404`);
				if (status === 401) {
					handleSessionExpired();
					throw new Error("Failed to refresh session");
				}
				throw postErr;
			}
			const tokenData = res.data?.data ?? res.data;
			const accessToken = tokenData?.access_token || tokenData?.accessToken || tokenData?.token;
			if (!accessToken) {
				handleSessionExpired();
				throw new Error("Invalid session refresh response: missing access token");
			}
			setTokens({
				accessToken,
				refreshToken: tokenData?.refresh_token || tokenData?.refreshToken || currentRefreshToken || void 0
			});
			return accessToken;
		} finally {
			refreshPromise = null;
		}
	})();
	return refreshPromise;
}
apiInstance.interceptors.request.use((config) => {
	const tokens = getTokens();
	if (tokens?.accessToken) config.headers.Authorization = `Bearer ${tokens.accessToken}`;
	if (config.url) config.url = normalizeApiPath(config.url);
	return config;
});
apiInstance.interceptors.response.use((response) => {
	return response;
}, async (error) => {
	const originalRequest = error.config;
	if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || originalRequest.url?.includes("/auth/refresh") || originalRequest.url?.includes("/auth/login") || originalRequest.url?.includes("/auth/change-password")) return Promise.reject(error);
	const currentRefreshToken = getRefreshToken();
	if (!getTokens()?.accessToken && !currentRefreshToken) {
		handleSessionExpired();
		return Promise.reject(error);
	}
	originalRequest._retry = true;
	try {
		const newAccessToken = await refreshAccessToken();
		originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
		return apiInstance(originalRequest);
	} catch (refreshError) {
		if ((refreshError?.response?.status ?? refreshError?.status) === 401 || refreshError?.message === "Failed to refresh session") handleSessionExpired();
		return Promise.reject(refreshError);
	}
});
var responseCache = /* @__PURE__ */ new Map();
var inFlightRequests = /* @__PURE__ */ new Map();
var DEFAULT_CACHE_TTL_MS = 3e4;
function clearApiCache(urlPattern) {
	if (!urlPattern) {
		responseCache.clear();
		return;
	}
	for (const key of responseCache.keys()) if (key.includes(urlPattern)) responseCache.delete(key);
}
function cloneResponseData(data) {
	if (data == null || typeof data !== "object") return data;
	if (Array.isArray(data)) return [...data];
	const copy = { ...data };
	if (Array.isArray(copy.items)) copy.items = [...copy.items];
	if (Array.isArray(copy.results)) copy.results = [...copy.results];
	if (Array.isArray(copy.data)) copy.data = [...copy.data];
	return copy;
}
function getRequestKey(config) {
	const method = (config.method || "get").toLowerCase();
	const url = normalizeApiPath(config.url || "");
	let paramsStr = "";
	if (config.params) try {
		paramsStr = typeof config.params === "string" ? config.params : JSON.stringify(config.params);
	} catch {
		paramsStr = String(config.params);
	}
	return `${method}:${url}:${paramsStr}`;
}
var rawRequest = apiInstance.request.bind(apiInstance);
apiInstance.request = async function(config) {
	const method = (config?.method || "get").toLowerCase();
	if (method === "post" || method === "put" || method === "patch" || method === "delete") {
		clearApiCache();
		return rawRequest(config);
	}
	if (method === "get") {
		const skipCache = config.headers?.["x-skip-cache"] === "true" || config.headers?.["Cache-Control"] === "no-cache" || config.skipCache;
		const key = getRequestKey(config);
		if (!skipCache) {
			const cached = responseCache.get(key);
			if (cached && Date.now() < cached.expiresAt) return Promise.resolve({
				...cached.response,
				data: cloneResponseData(cached.response.data)
			});
			if (inFlightRequests.has(key)) return inFlightRequests.get(key);
		}
		const promise = rawRequest(config).then((response) => {
			if (!skipCache && response && response.status >= 200 && response.status < 300) responseCache.set(key, {
				response,
				expiresAt: Date.now() + DEFAULT_CACHE_TTL_MS
			});
			return response;
		}).finally(() => {
			inFlightRequests.delete(key);
		});
		if (!skipCache) inFlightRequests.set(key, promise);
		return promise;
	}
	return rawRequest(config);
};
//#endregion
export { api as a, getRefreshToken as c, setTokens as d, BASE_URL as i, getTokens as l, AUTH_ENDPOINTS as n, apiInstance as o, ApiError as r, clearApiCache as s, API_BASE_URL as t, refreshAccessToken as u };
