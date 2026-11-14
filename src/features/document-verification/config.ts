/**
 * Editable configuration constants for the one-time employee DigiLocker
 * document verification flow.
 *
 * NOTE: The final document list and consent wording will be confirmed with HR.
 */

export interface DigiLockerDocumentConfigItem {
  id: string;
  label: string;
  description: string;
  required: boolean;
}

export const DIGILOCKER_STEPS: string[] = [
  "Connect DigiLocker",
  "Authorise documents",
  "Verification result",
];

export const DIGILOCKER_DOCUMENTS_CONFIG: readonly DigiLockerDocumentConfigItem[] = [
  {
    id: "aadhaar",
    label: "Aadhaar Card",
    description: "Government-issued identity and address proof verified via UIDAI / DigiLocker.",
    required: true,
  },
  {
    id: "pan",
    label: "PAN Card",
    description: "Permanent Account Number verification record issued by the Income Tax Department.",
    required: true,
  },
  {
    id: "driving_licence",
    label: "Driving Licence",
    description: "Official driving licence issued by the Ministry of Road Transport & Highways.",
    required: false,
  },
  {
    id: "education_certificate",
    label: "Education Certificates",
    description: "Academic marksheets or degree certificates available via National Academic Depository (NAD).",
    required: false,
  },
] as const;

export const DIGILOCKER_CONSENT_NOTICE =
  "I hereby provide my voluntary consent to OFC360 to request and verify my official identity and employment documents through DigiLocker (Ministry of Electronics & Information Technology, Government of India) solely for one-time employee onboarding and statutory compliance.";

export const DIGILOCKER_SUPPORT_CONTACT = {
  email: "hr-support@ofc360.com",
  helpdeskPath: "/dashboard/helpdesk",
  label: "Contact HR Support",
} as const;

/**
 * Masks any sensitive document identifier so only the last 4 characters are visible
 * (e.g. "XXXX XXXX 1234"). Never returns an unmasked identifier.
 */
export function maskIdentifier(raw?: string | null): string {
  if (!raw || typeof raw !== "string") return "";
  const cleaned = raw.replace(/\s+/g, "").trim();
  if (!cleaned) return "";
  const lastFour = cleaned.slice(-4);
  return `XXXX XXXX ${lastFour}`;
}
