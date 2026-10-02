import { a as normalizeRole } from "./aurix-store-BcCbMqU4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/parseLoginResponse-KUjZ0IxY.js
function asRecord(value) {
	return value && typeof value === "object" ? value : null;
}
function parseJwtRole(token) {
	try {
		const parts = token.split(".");
		if (parts.length !== 3) return null;
		const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
		const payload = JSON.parse(atob(base64));
		if (payload && typeof payload === "object") return payload.role || payload.user_role || payload.userRole || payload.role_name || null;
		return null;
	} catch {
		return null;
	}
}
function normalizeUser(raw, tokenRole) {
	const user = asRecord(raw);
	if (!user || typeof user.email !== "string") return null;
	const combinedName = [typeof user.first_name === "string" ? user.first_name : "", typeof user.last_name === "string" ? user.last_name : ""].filter(Boolean).join(" ");
	const rawRole = (typeof user.role === "string" ? user.role : null) ?? (typeof user.userRole === "string" ? user.userRole : null) ?? (typeof user.role_name === "string" ? user.role_name : null) ?? tokenRole ?? null;
	return {
		id: typeof user.id === "string" || typeof user.id === "number" ? user.id : "",
		name: String(user.name ?? user.full_name ?? user.fullName ?? combinedName ?? ""),
		email: user.email,
		phone: typeof user.phone === "string" ? user.phone : void 0,
		role: normalizeRole(rawRole) ?? "employee",
		is_verified: Boolean(user.is_verified ?? user.isVerified ?? user.email_verified),
		onboarding_completed: Boolean(user.onboarding_completed ?? user.onboardingCompleted ?? false),
		created_at: typeof user.created_at === "string" ? user.created_at : void 0,
		company_id: typeof user.company_id === "string" || typeof user.company_id === "number" ? user.company_id : typeof user.companyId === "string" || typeof user.companyId === "number" ? user.companyId : void 0,
		company_name: typeof user.company_name === "string" ? user.company_name : typeof user.companyName === "string" ? user.companyName : void 0
	};
}
function parseLoginResponse(res) {
	const body = asRecord(res);
	if (!body) return null;
	const nested = asRecord(body.data);
	const tokenSources = [
		asRecord(nested?.tokens),
		nested,
		body
	].filter(Boolean);
	let accessToken;
	let refreshToken;
	for (const source of tokenSources) {
		accessToken ??= source.access_token ?? source.accessToken ?? source.token;
		refreshToken ??= source.refresh_token ?? source.refreshToken;
	}
	const user = normalizeUser(nested?.user ?? body.user ?? (nested && typeof nested.email === "string" && accessToken !== nested.access_token && accessToken !== nested.accessToken ? nested : null), typeof accessToken === "string" ? parseJwtRole(accessToken) : null);
	if (typeof accessToken !== "string" || typeof refreshToken !== "string" || !user) return null;
	return {
		accessToken,
		refreshToken,
		user
	};
}
function getApiResponseMessage(res, fallback = "Server error") {
	const body = asRecord(res);
	if (!body) return fallback;
	return typeof body.message === "string" && body.message ? body.message : fallback;
}
//#endregion
export { parseLoginResponse as n, getApiResponseMessage as t };
