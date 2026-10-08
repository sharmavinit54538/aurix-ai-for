// ── Standard Categories and Suggested Types ──────────────────────────
export const CATEGORY_MAP: Record<string, string[]> = {
  Identity: ["Aadhaar Card", "PAN Card", "Passport", "Voter ID", "Driving License", "National ID"],
  Address: ["Electricity Bill", "Rent Agreement", "Utility Bill", "Bank Statement", "Ration Card"],
  Education: [
    "10th Certificate",
    "12th Certificate",
    "Graduation Degree",
    "Post Graduation",
    "Diploma / Certification",
  ],
  Bank: ["Cancelled Cheque", "Bank Passbook", "Bank Statement"],
  Tax: ["Form 16", "PAN Verification", "Tax Declaration", "ITR Acknowledgement"],
  Employment: [
    "Offer Letter",
    "Appointment Letter",
    "Relieving Letter",
    "Experience Letter",
    "Previous Payslip",
  ],
  Other: [
    "Medical Certificate",
    "Background Verification",
    "NDA",
    "Policy Acknowledgment",
    "Miscellaneous",
  ],
};
