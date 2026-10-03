/**
 * Client-side iCalendar (.ics) generation utility according to RFC 5545.
 * Strictly formats UTC timestamps without manual string appending.
 */

export interface CalendarEventPayload {
  title: string;
  description?: string;
  location?: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  organizerName?: string;
  organizerEmail?: string;
}

/**
 * Format a Date to RFC 5545 UTC timestamp: YYYYMMDDTHHMMSSZ
 */
export function formatIcsUtcDate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const year = date.getUTCFullYear();
  const month = pad(date.getUTCMonth() + 1);
  const day = pad(date.getUTCDate());
  const hours = pad(date.getUTCHours());
  const minutes = pad(date.getUTCMinutes());
  const seconds = pad(date.getUTCSeconds());
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

/**
 * Escape text for iCalendar fields
 */
function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Generate .ics file content
 */
export function generateIcsContent(event: CalendarEventPayload): string {
  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);
  const now = new Date();

  const dtStamp = formatIcsUtcDate(now);
  const dtStart = formatIcsUtcDate(startDate);
  const dtEnd = formatIcsUtcDate(endDate);
  const uid = `interview-${startDate.getTime()}-${Math.random().toString(36).substring(2, 9)}@ofc360.com`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//OFC360//Recruitment Interview Scheduler//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
  ];

  if (event.description) {
    lines.push(`DESCRIPTION:${escapeIcsText(event.description)}`);
  }

  if (event.location) {
    lines.push(`LOCATION:${escapeIcsText(event.location)}`);
  }

  if (event.organizerName && event.organizerEmail) {
    lines.push(`ORGANIZER;CN=${escapeIcsText(event.organizerName)}:mailto:${event.organizerEmail}`);
  }

  lines.push("STATUS:CONFIRMED", "END:VEVENT", "END:VCALENDAR");

  return lines.join("\r\n");
}

/**
 * Trigger client-side download of the .ics file
 */
export function downloadIcsFile(event: CalendarEventPayload, filename?: string): void {
  const icsString = generateIcsContent(event);
  const blob = new Blob([icsString], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename || `interview-${event.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}.ics`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}
