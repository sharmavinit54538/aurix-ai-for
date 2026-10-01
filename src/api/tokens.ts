/**
 * Token Manager
 *
 * Security:
 * - Access token is kept in-memory for active API authorizations.
 * - Refresh token is kept in memory and persisted in safeStorage to allow
 *   session continuity and token refresh 4 minutes after login or on page reloads.
 */

import { safeStorage } from "@/lib/safe-storage";

export const REFRESH_TOKEN_KEY = "aurix:refresh_token";
const LEGACY_TOKENS_KEY = "aurix:tokens";

let inMemoryAccessToken: string | null = null;
let inMemoryRefreshToken: string | null = null;

// Initial migration: Load stored refresh token if present
if (typeof window !== "undefined") {
  safeStorage.removeItem(LEGACY_TOKENS_KEY);
  const storedRefresh = safeStorage.getItem(REFRESH_TOKEN_KEY);
  if (storedRefresh) {
    inMemoryRefreshToken = storedRefresh;
  }
}

export interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

export function getTokens(): Tokens | null {
  if (!inMemoryAccessToken) return null;
  const refreshToken = getRefreshToken() || undefined;
  return {
    accessToken: inMemoryAccessToken,
    refreshToken,
  };
}

export function setTokens(tokens: { accessToken?: string; refreshToken?: string } | null) {
  inMemoryAccessToken = tokens?.accessToken || null;

  if (tokens && tokens.refreshToken !== undefined) {
    inMemoryRefreshToken = tokens.refreshToken || null;
    if (tokens.refreshToken) {
      safeStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
    } else {
      safeStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  }

  // When clearing all tokens (null), also clear refresh
  if (!tokens) {
    inMemoryRefreshToken = null;
    safeStorage.removeItem(REFRESH_TOKEN_KEY);
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
  if (inMemoryRefreshToken) return inMemoryRefreshToken;
  const stored = safeStorage.getItem(REFRESH_TOKEN_KEY);
  if (stored) {
    inMemoryRefreshToken = stored;
    return stored;
  }
  return null;
}

export function clearTokens() {
  inMemoryAccessToken = null;
  inMemoryRefreshToken = null;
  safeStorage.removeItem(REFRESH_TOKEN_KEY);
  safeStorage.removeItem(LEGACY_TOKENS_KEY);
}
