/**
 * Token Manager
 *
 * Security:
 * - Access token is kept in-memory for active API authorizations.
 * - Refresh token is kept strictly in-memory (and forwarded via HttpOnly cookie).
 * - Refresh token is NEVER persisted in localStorage or sessionStorage.
 * - A non-sensitive session hint `ofc_session_hint=1` is stored in localStorage
 *   to avoid pre-login 401s on app boot.
 */

import { safeStorage } from "@/lib/safe-storage";

export const SESSION_HINT_KEY = "ofc_session_hint";
export const REFRESH_TOKEN_KEY = "aurix:refresh_token";
const LEGACY_TOKENS_KEY = "aurix:tokens";

let inMemoryAccessToken: string | null = null;
let inMemoryRefreshToken: string | null = null;

// Initial migration: Clean up any legacy persisted tokens from previous versions
if (typeof window !== "undefined") {
  safeStorage.removeItem(LEGACY_TOKENS_KEY);
  safeStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function hasSessionHint(): boolean {
  if (typeof window === "undefined") return false;
  return safeStorage.getItem(SESSION_HINT_KEY) === "1";
}

export function setSessionHint(): void {
  if (typeof window === "undefined") return;
  safeStorage.setItem(SESSION_HINT_KEY, "1");
}

export function clearSessionHint(): void {
  if (typeof window === "undefined") return;
  safeStorage.removeItem(SESSION_HINT_KEY);
}

export interface Tokens {
  accessToken: string;
  refreshToken?: string;
}

export function getTokens(): Tokens | null {
  if (!inMemoryAccessToken) return null;
  return {
    accessToken: inMemoryAccessToken,
    refreshToken: inMemoryRefreshToken || undefined,
  };
}

export function setTokens(tokens: { accessToken?: string; refreshToken?: string } | null) {
  inMemoryAccessToken = tokens?.accessToken || null;
  inMemoryRefreshToken = tokens?.refreshToken || null;

  if (tokens?.accessToken) {
    setSessionHint();
  }

  // When clearing all tokens (null)
  if (!tokens) {
    inMemoryAccessToken = null;
    inMemoryRefreshToken = null;
    clearSessionHint();
  }

  // Ensure no residual tokens exist in storage
  if (typeof window !== "undefined") {
    safeStorage.removeItem(REFRESH_TOKEN_KEY);
    safeStorage.removeItem(LEGACY_TOKENS_KEY);
  }
}

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

export function setAccessToken(token: string | null) {
  inMemoryAccessToken = token;
  if (token) {
    setSessionHint();
  }
}

export function getRefreshToken(): string | null {
  return inMemoryRefreshToken;
}

export function setRefreshToken(token: string | null) {
  inMemoryRefreshToken = token;
}

export function clearTokens() {
  inMemoryAccessToken = null;
  inMemoryRefreshToken = null;
  clearSessionHint();
  if (typeof window !== "undefined") {
    safeStorage.removeItem(REFRESH_TOKEN_KEY);
    safeStorage.removeItem(LEGACY_TOKENS_KEY);
  }
}

