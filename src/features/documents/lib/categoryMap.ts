import type { BackendCategory, CategoryGroup } from "./types";
import { CATEGORY_GROUPS } from "./types";

export interface StandardDocumentType {
  id: string;
  name: string;
  group: CategoryGroup;
  code: string;
  isCompany?: boolean;
  requiresExpiry?: boolean;
  requiresDocNumber?: boolean;
}

export const STANDARD_DOCUMENT_TYPES: StandardDocumentType[] = [
  // ── Employee Documents / Identity & Statutory Proof ──
  { id: "aadhaar", name: "Aadhaar / Identity Proof", group: "Employee Documents", code: "AADHAAR", requiresDocNumber: true },
  { id: "pan", name: "PAN Card", group: "Employee Documents", code: "PAN", requiresDocNumber: true },
  { id: "passport", name: "Passport", group: "Employee Documents", code: "PASSPORT", requiresExpiry: true, requiresDocNumber: true },
  { id: "driving_license", name: "Driving License", group: "Employee Documents", code: "DL", requiresExpiry: true, requiresDocNumber: true },
  { id: "voter_id", name: "Voter ID", group: "Employee Documents", code: "VOTER_ID", requiresDocNumber: true },
  { id: "address_proof", name: "Address Proof", group: "Employee Documents", code: "ADDRESS_PROOF" },
  { id: "bank_cheque", name: "Bank Details / Cancelled Cheque", group: "Employee Documents", code: "BANK_CHEQUE", requiresDocNumber: true },
  { id: "medical_cert", name: "Medical Certificate", group: "Employee Documents", code: "MED_CERT" },
  { id: "insurance_docs", name: "Insurance Documents", group: "Employee Documents", code: "INSURANCE", requiresExpiry: true },
  { id: "pf_docs", name: "PF Documents", group: "Employee Documents", code: "PF_DOCS", requiresDocNumber: true },
  { id: "esi_docs", name: "ESI Documents", group: "Employee Documents", code: "ESI_DOCS", requiresDocNumber: true },
  { id: "tax_docs", name: "Tax Documents", group: "Employee Documents", code: "TAX_DOCS" },
  { id: "nda_agreement", name: "NDA", group: "Employee Documents", code: "NDA" },
  { id: "confidentiality_agree", name: "Confidentiality Agreement", group: "Employee Documents", code: "CONFIDENTIALITY" },

  // ── Education ──
  { id: "edu_certificates", name: "Educational Certificates", group: "Education", code: "EDU_CERT" },
  { id: "degree_diploma", name: "Degree / Diploma", group: "Education", code: "DEGREE" },

  // ── Employment ──
  { id: "prev_employment", name: "Previous Employment Documents", group: "Employment", code: "PREV_EMP" },
  { id: "experience_cert", name: "Experience Certificate", group: "Employment", code: "EXP_CERT" },
  { id: "relieving_letter", name: "Relieving Letter", group: "Employment", code: "RELIEVING" },
  { id: "resume_cv", name: "Resume / CV", group: "Employment", code: "RESUME" },
  { id: "other_docs", name: "Other Documents", group: "Employee Documents", code: "OTHER" },

  // ── Company Documents ──
  { id: "comp_policy", name: "Company Policies & Guidelines", group: "Company Documents", code: "POLICY", isCompany: true },
  { id: "comp_handbook", name: "Employee Handbook", group: "Company Documents", code: "HANDBOOK", isCompany: true },
  { id: "comp_compliance", name: "Compliance Documents", group: "Company Documents", code: "COMPLIANCE", isCompany: true },
  { id: "comp_sop", name: "Standard Operating Procedures (SOPs)", group: "Company Documents", code: "SOP", isCompany: true },
  { id: "comp_legal_nda", name: "Legal Agreements & Corporate NDAs", group: "Company Documents", code: "LEGAL_NDA", isCompany: true },
  { id: "comp_benefits", name: "Benefits & Insurance Plans", group: "Company Documents", code: "BENEFITS", isCompany: true },
  { id: "comp_notices", name: "Notices & Circulars", group: "Company Documents", code: "NOTICES", isCompany: true },
];

/**
 * Normalizes any category group string from backend to one of the canonical groups.
 */
export function normalizeCategoryGroup(
  rawGroup?: string | null,
  isCompany?: boolean
): CategoryGroup {
  if (isCompany) {
    return "Company Documents";
  }

  if (!rawGroup) {
    return "Employee Documents";
  }

  const normalized = rawGroup.trim();

  for (const group of CATEGORY_GROUPS) {
    if (group.toLowerCase() === normalized.toLowerCase()) {
      return group;
    }
  }

  const lower = normalized.toLowerCase();
  if (lower.includes("company") || lower.includes("policy") || lower.includes("handbook") || lower.includes("sop")) {
    return "Company Documents";
  }
  if (lower.includes("education") || lower.includes("academic") || lower.includes("degree") || lower.includes("diploma")) {
    return "Education";
  }
  if (lower.includes("employment") || lower.includes("experience") || lower.includes("offer") || lower.includes("relieving")) {
    return "Employment";
  }
  if (lower.includes("letter")) {
    return "HR Letters";
  }
  if (lower.includes("card") || lower.includes("id card")) {
    return "Employee ID Cards";
  }

  return "Employee Documents";
}

/**
 * Groups an array of backend categories into canonical category groups.
 */
export function groupCategories(
  categories: BackendCategory[]
): Record<CategoryGroup, BackendCategory[]> {
  const result: Record<CategoryGroup, BackendCategory[]> = {
    "Employee Documents": [],
    Education: [],
    Employment: [],
    "Company Documents": [],
    "HR Letters": [],
    "Employee ID Cards": [],
  };

  for (const cat of categories) {
    const group = normalizeCategoryGroup(cat.group, cat.is_company);
    if (result[group]) {
      result[group].push(cat);
    } else {
      result["Employee Documents"].push(cat);
    }
  }

  return result;
}

export function findCategoryById(
  categories: BackendCategory[],
  id: string
): BackendCategory | undefined {
  if (!id) return undefined;
  return categories.find((c) => c.id === id);
}

/**
 * Merges backend categories with standard required categories to guarantee full
 * compliance with all production document types without gaps.
 */
export function getMergedStandardCategories(backendCategories: BackendCategory[]): BackendCategory[] {
  const existingNames = new Set(backendCategories.map((c) => c.name.toLowerCase()));
  const existingIds = new Set(backendCategories.map((c) => c.id));

  const standardItems: BackendCategory[] = STANDARD_DOCUMENT_TYPES.filter(
    (std) => !existingNames.has(std.name.toLowerCase()) && !existingIds.has(std.id)
  ).map((std) => ({
    id: std.id,
    name: std.name,
    code: std.code,
    group: std.group,
    is_company: Boolean(std.isCompany),
  }));

  return [...backendCategories, ...standardItems];
}
