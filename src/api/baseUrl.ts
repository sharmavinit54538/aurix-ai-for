/**
 * Normalizes the API base origin, ensuring https:// protocol and no trailing slashes.
 * e.g., "https://api.ofc360.com"
 */
export function getApiBaseUrl(): string {
  let url = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (!url) {
    return "https://api.ofc360.com";
  }
  // Remove any accidental leading slashes
  url = url.replace(/^\/+/, "");
  // Prepend https:// if protocol is omitted
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = `https://${url}`;
  }
  // Normalize www.api.ofc360.com -> api.ofc360.com (www subdomain has no DNS entry)
  url = url.replace(/www\.api\.ofc360\.com/g, "api.ofc360.com");
  // Remove trailing slashes
  url = url.replace(/\/+$/, "");
  // Strip trailing /api/v1 or /api to get purely the origin base
  url = url.replace(/\/api(\/v1)?$/, "");
  return url;
}

export const API_BASE_URL = getApiBaseUrl();
export const BASE_URL = `${API_BASE_URL}/api/v1`;
