//#region node_modules/.nitro/vite/services/ssr/assets/utils-DQc9Fr86.js
function parseApiError(error, fallbackMessage = "An error occurred") {
	let message = fallbackMessage;
	let fieldErrors = {};
	let status = 500;
	if (error && typeof error === "object") {
		const statusVal = error.status || error.response?.status;
		if (statusVal) status = statusVal;
		const data = error.data || error.response?.data;
		if (data && typeof data === "object") {
			if (typeof data.message === "string" && data.message) message = data.message;
			else if (data.detail) {
				if (typeof data.detail === "string") message = data.detail;
				else if (Array.isArray(data.detail)) {
					const firstErr = data.detail[0];
					if (firstErr && typeof firstErr === "object") message = firstErr.msg || fallbackMessage;
					else if (firstErr) message = String(firstErr);
					data.detail.forEach((item) => {
						if (item && typeof item === "object" && Array.isArray(item.loc) && item.loc.length > 1) {
							const fieldName = item.loc[1];
							fieldErrors[fieldName] = String(item.msg || "Invalid value");
						}
					});
				}
			}
			if (data.errors) {
				if (typeof data.errors === "string") message = data.errors;
				else if (Array.isArray(data.errors)) {
					data.errors.forEach((err) => {
						if (err && typeof err === "object") {
							const fieldName = err.field || (Array.isArray(err.loc) ? err.loc[1] : null) || "unknown";
							const fieldMsg = err.message || err.msg || "Invalid value";
							fieldErrors[fieldName] = String(fieldMsg);
						}
					});
					const firstErr = data.errors[0];
					if (firstErr && typeof firstErr === "object") {
						const firstMsg = firstErr.message || firstErr.msg;
						if (firstMsg) message = String(firstMsg);
					}
				} else if (typeof data.errors === "object") {
					Object.entries(data.errors).forEach(([k, v]) => {
						if (v && typeof v === "object") {
							const obj = v;
							fieldErrors[k] = String(obj.message || obj.msg || JSON.stringify(v));
						} else fieldErrors[k] = String(v);
					});
					const firstErrorKey = Object.keys(data.errors)[0];
					if (firstErrorKey) {
						const firstVal = data.errors[firstErrorKey];
						if (firstVal && typeof firstVal === "object") message = String(firstVal.message || firstVal.msg || JSON.stringify(firstVal));
						else if (firstVal) message = String(firstVal);
					}
				}
			}
		} else if (error.message) message = error.message;
	} else if (error instanceof Error) message = error.message;
	if (message && typeof message === "object") {
		const obj = message;
		message = String(obj.message || obj.msg || JSON.stringify(message));
	} else message = String(message || fallbackMessage);
	return {
		message,
		fieldErrors,
		status
	};
}
function getErrorMessage(error, fallback) {
	return parseApiError(error, fallback).message;
}
function getRejectMessage(payload, fallback) {
	if (payload && typeof payload === "object" && "message" in payload) {
		const message = payload.message;
		if (typeof message === "string" && message.trim()) return message;
	}
	if (typeof payload === "string" && payload.trim()) return payload;
	return fallback;
}
async function tryApi(call, fallback) {
	try {
		return await call();
	} catch {
		return fallback;
	}
}
//#endregion
export { tryApi as i, getRejectMessage as n, parseApiError as r, getErrorMessage as t };
