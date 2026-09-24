import { logger } from "./logger";

function getStorage(customStorage?: Storage): Storage | null {
  if (customStorage) return customStorage;
  if (typeof window !== "undefined") {
    try {
      return window.localStorage;
    } catch {
      return null;
    }
  }
  return null;
}

export const safeStorage = {
  getItem: (key: string, storage?: Storage): string | null => {
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

  setItem: (key: string, value: string, storage?: Storage): boolean => {
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

  removeItem: (key: string, storage?: Storage): boolean => {
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

  clear: (storage?: Storage): boolean => {
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
  },
};

export default safeStorage;
