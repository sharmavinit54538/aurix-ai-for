import { logger } from "./logger";

export const safeStorage = {
  getItem: (key: string, storage: Storage = localStorage): string | null => {
    if (typeof window === "undefined") return null;
    try {
      return storage.getItem(key);
    } catch (err) {
      logger.debug(`[safeStorage] Failed to getItem '${key}':`, err);
      return null;
    }
  },

  setItem: (key: string, value: string, storage: Storage = localStorage): boolean => {
    if (typeof window === "undefined") return false;
    try {
      storage.setItem(key, value);
      return true;
    } catch (err) {
      logger.debug(`[safeStorage] Failed to setItem '${key}':`, err);
      return false;
    }
  },

  removeItem: (key: string, storage: Storage = localStorage): boolean => {
    if (typeof window === "undefined") return false;
    try {
      storage.removeItem(key);
      return true;
    } catch (err) {
      logger.debug(`[safeStorage] Failed to removeItem '${key}':`, err);
      return false;
    }
  },

  clear: (storage: Storage = localStorage): boolean => {
    if (typeof window === "undefined") return false;
    try {
      storage.clear();
      return true;
    } catch (err) {
      logger.debug("[safeStorage] Failed to clear storage:", err);
      return false;
    }
  },
};

export default safeStorage;
