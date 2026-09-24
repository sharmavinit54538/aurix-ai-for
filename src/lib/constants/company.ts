export const OFFICES = [
  "San Francisco HQ",
  "Bengaluru Tech Park",
  "London Office",
  "Singapore Hub",
  "New York Branch",
  "Dubai Office",
  "Remote",
] as const;

export type OfficeLocation = (typeof OFFICES)[number];
