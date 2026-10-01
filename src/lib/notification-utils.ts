/**
 * Utility helpers for notification links, unread badge formatting, and timestamps.
 */

/**
 * Validates that a link is strictly internal (starts with '/' but NOT '//')
 * Prevents protocol-relative URL phishing and external open redirects.
 */
export function isInternalSafeLink(link?: string | null): boolean {
  if (typeof link !== "string") return false;
  const trimmed = link.trim();
  return trimmed.startsWith("/") && !trimmed.startsWith("//") && !trimmed.startsWith("/\\");
}

/**
 * Returns formatted unread badge text with 99+ cap.
 * Returns null if count <= 0.
 */
export function formatUnreadBadge(count: number): string | null {
  if (!count || count <= 0) return null;
  if (count > 99) return "99+";
  return String(count);
}

/**
 * Formats a timestamp into human-readable relative time (e.g. "5m ago", "2h ago", "yesterday").
 */
export function formatRelativeTime(dateInput: string | number | Date): string {
  try {
    const timestamp = typeof dateInput === "number" ? dateInput : new Date(dateInput).getTime();
    if (isNaN(timestamp)) return "";

    const now = Date.now();
    const diffMs = Math.max(0, now - timestamp);
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay === 1) return "yesterday";
    if (diffDay < 7) return `${diffDay}d ago`;

    return new Date(timestamp).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
