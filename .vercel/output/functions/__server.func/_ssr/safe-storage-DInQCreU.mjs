//#region node_modules/.nitro/vite/services/ssr/assets/safe-storage-DInQCreU.js
var isDev = Boolean(false);
var logger = {
	debug: (...args) => {
		if (isDev) console.debug(...args);
	},
	info: (...args) => {
		if (isDev) console.info(...args);
	},
	warn: (...args) => {
		console.warn(...args);
	},
	error: (...args) => {
		console.error(...args);
	}
};
function getStorage(customStorage) {
	if (customStorage) return customStorage;
	if (typeof window !== "undefined") try {
		return window.localStorage;
	} catch {
		return null;
	}
	return null;
}
var safeStorage = {
	getItem: (key, storage) => {
		if (typeof window === "undefined") return null;
		const target = getStorage(storage);
		if (!target) return null;
		try {
			return target.getItem(key);
		} catch (err) {
			logger.debug(`[safeStorage] Failed to getItem '${key}':`, err);
			return null;
		}
	},
	setItem: (key, value, storage) => {
		if (typeof window === "undefined") return false;
		const target = getStorage(storage);
		if (!target) return false;
		try {
			target.setItem(key, value);
			return true;
		} catch (err) {
			logger.debug(`[safeStorage] Failed to setItem '${key}':`, err);
			return false;
		}
	},
	removeItem: (key, storage) => {
		if (typeof window === "undefined") return false;
		const target = getStorage(storage);
		if (!target) return false;
		try {
			target.removeItem(key);
			return true;
		} catch (err) {
			logger.debug(`[safeStorage] Failed to removeItem '${key}':`, err);
			return false;
		}
	},
	clear: (storage) => {
		if (typeof window === "undefined") return false;
		const target = getStorage(storage);
		if (!target) return false;
		try {
			target.clear();
			return true;
		} catch (err) {
			logger.debug("[safeStorage] Failed to clear storage:", err);
			return false;
		}
	}
};
//#endregion
export { safeStorage as n, logger as t };
