export interface IcsEventOptions {
  title: string;
  description?: string;
  location?: string;
  startTime: string;
  endTime: string;
  filename?: string;
}

function formatIcsDate(iso: string): string {
  const d = new Date(iso);
  return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function downloadIcsFile(options: IcsEventOptions): void {
  const {
    title,
    description = "",
    location = "",
    startTime,
    endTime,
    filename = "interview-invite.ics",
  } = options;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//OFC360//Interview Calendar//EN",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@ofc360.local`,
    `DTSTAMP:${formatIcsDate(new Date().toISOString())}`,
    `DTSTART:${formatIcsDate(startTime)}`,
    `DTEND:${formatIcsDate(endTime)}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
    `LOCATION:${location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
