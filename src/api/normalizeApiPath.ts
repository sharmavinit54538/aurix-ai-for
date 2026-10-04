export function normalizeApiPath(path: string): string {
  let clean = path.trim();

  // If full external URL with scheme
  if (clean.startsWith("http://") || clean.startsWith("https://")) {
    try {
      const parsed = new URL(clean);
      if (
        parsed.hostname.includes("ofc360.com") ||
        parsed.hostname === "localhost" ||
        parsed.hostname === "127.0.0.1"
      ) {
        clean = parsed.pathname + parsed.search;
      } else {
        return clean;
      }
    } catch {
      return clean;
    }
  }

  // Strip accidental domain / origin prefix
  clean = clean.replace(/^(?:https?:\/\/[^/]+)?(?:\/)?(?:www\.)?api\.ofc360\.com(?:\/)?/, "/");
  clean = clean.replace(/^\/?(?:http:\/\/localhost:\d+\/)?/, "/");

  // Ensure leading slash
  if (!clean.startsWith("/")) {
    clean = `/${clean}`;
  }

  // Deduplicate repeated /api/v1 or /api segments
  clean = clean.replace(/^(\/api\/v1)+/g, "/api/v1");
  clean = clean.replace(/^(\/api)+/g, "/api");

  // If the path doesn't start with /api/, route under /api/v1
  if (!clean.startsWith("/api/")) {
    clean = `/api/v1${clean}`;
  }

  // Deduplicate /api/v1/api/v1 or /api/v1/api
  clean = clean.replace(/^\/api\/v1\/api\/v1/g, "/api/v1");
  clean = clean.replace(/^\/api\/v1\/api/g, "/api/v1");

  return clean;
}
