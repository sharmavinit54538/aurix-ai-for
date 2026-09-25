/**
 * In-memory Token Manager
 *
 * Security:
 * - Both access and refresh tokens are stored exclusively in module-scoped memory variables.
 * - Refresh token is kept in memory so it can be sent in the refresh request body,
 *   supporting backends that don't use (or fail to deliver) HttpOnly cookies.
 * - Neither token is persisted in localStorage, sessionStorage, or any other
 *   JavaScript-readable persistent storage.
 * - Legacy localStorage keys ("aurix:tokens") are cleaned up to mitigate XSS risks.
 */

import { safeStorage } from "@/lib/safe-storage";

const LEGACY_TOKENS_KEY = "aurix:tokens";

let inMemoryAccessToken: string | null = null;
let inMemoryRefreshToken: string | null = null;

// Initial migration: Purge legacy tokens from localStorage if present in browser
if (typeof window !== "undefined") {
  safeStorage.removeItem(LEGACY_TOKENS_KEY);
}

export interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

export function getTokens(): Tokens | null {
  if (!inMemoryAccessToken) return null;
  return {
    accessToken: inMemoryAccessToken,
    refreshToken: inMemoryRefreshToken || "",
  };
}

export function setTokens(tokens: { accessToken?: string; refreshToken?: string } | null) {
  inMemoryAccessToken = tokens?.accessToken || null;
  // Preserve existing refresh token if new value is not provided
  if (tokens && tokens.refreshToken !== undefined) {
    inMemoryRefreshToken = tokens.refreshToken || null;
  }
  // When clearing all tokens (null), also clear refresh
  if (!tokens) {
    inMemoryRefreshToken = null;
  }
  safeStorage.removeItem(LEGACY_TOKENS_KEY);
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

export function setAccessToken(token: string | null) {
  inMemoryAccessToken = token;
}

export function getRefreshToken(): string | null {
  return inMemoryRefreshToken;
}

export function clearTokens() {
  inMemoryAccessToken = null;
  inMemoryRefreshToken = null;
  safeStorage.removeItem(LEGACY_TOKENS_KEY);
}
