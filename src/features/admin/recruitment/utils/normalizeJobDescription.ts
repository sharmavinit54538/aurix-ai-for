/**
 * Normalizes a raw job description (which may be a JSON string, JSON object,
 * or plain text) into a structured, UI-friendly shape.
 *
 * The backend may return `job_description` as:
 *   - A plain string (markdown / text)
 *   - A JSON-stringified object with structured fields
 *   - An already-parsed object
 *
 * This utility safely handles all three cases and extracts every known field.
 * Missing / null / empty fields are returned as `undefined` so the UI can
 * conditionally hide the corresponding section.
 */

export interface NormalizedJobDescription {
  title?: string;
  summary?: string;
  aboutRole?: string;
  responsibilities?: string[];
  requiredSkills?: string[];
  preferredSkills?: string[];
  experience?: {
    minYears?: number;
    maxYears?: number;
    text?: string;
  };
  education?: string[];
  qualifications?: string[];
  niceToHave?: string[];
  benefits?: string[];
  location?: string;
  workMode?: string;
  employmentType?: string;
  department?: string;
  seniorityLevel?: string;
  atsKeywords?: string[];
  salaryRange?: {
    min?: number;
    max?: number;
    currency?: string;
    text?: string;
  };
  hiringProcess?: string[];
  /** true when the description was a structured JSON object */
  isStructured: boolean;
  /** Fallback plain-text description when the JD is not structured */
  plainText?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isNonEmpty(val: unknown): val is string {
  return typeof val === "string" && val.trim().length > 0;
}

function toStringArray(val: unknown): string[] | undefined {
  if (Array.isArray(val)) {
    const mapped = val
      .map((v) => (typeof v === "string" ? v.trim() : typeof v === "object" && v ? JSON.stringify(v) : String(v)))
      .filter(Boolean);
    return mapped.length > 0 ? mapped : undefined;
  }
  if (typeof val === "string" && val.trim()) {
    return val
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return undefined;
}

function toNumber(val: unknown): number | undefined {
  if (typeof val === "number" && !Number.isNaN(val)) return val;
  if (typeof val === "string") {
    const n = Number(val);
    if (!Number.isNaN(n)) return n;
  }
  return undefined;
}

function tryParseJSON(raw: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Not JSON
  }
  return null;
}

// ---------------------------------------------------------------------------
// Main normalizer
// ---------------------------------------------------------------------------

export function normalizeJobDescription(
  raw: unknown,
): NormalizedJobDescription {
  // Attempt to obtain a plain object from the input
  let obj: Record<string, unknown> | null = null;

  if (typeof raw === "string") {
    obj = tryParseJSON(raw);
    if (!obj) {
      // It's just plain text – not structured
      return {
        isStructured: false,
        plainText: raw,
      };
    }
  } else if (raw && typeof raw === "object" && !Array.isArray(raw)) {
    obj = raw as Record<string, unknown>;
  }

  if (!obj) {
    return {
      isStructured: false,
      plainText: raw != null ? String(raw) : undefined,
    };
  }

  // At this point `obj` is a structured JD object ─ extract fields safely.

  const experience: NormalizedJobDescription["experience"] = (() => {
    const exp = obj.experience;
    if (exp && typeof exp === "object" && !Array.isArray(exp)) {
      const e = exp as Record<string, unknown>;
      return {
        minYears: toNumber(e.min_years),
        maxYears: toNumber(e.max_years),
        text: isNonEmpty(e.text) ? e.text : undefined,
      };
    }
    if (isNonEmpty(exp)) return { text: exp as string };
    return undefined;
  })();

  const salaryRange: NormalizedJobDescription["salaryRange"] = (() => {
    const s = obj.suggested_salary_range ?? obj.salary_range ?? obj.salary;
    if (s == null) return undefined;
    if (typeof s === "object" && !Array.isArray(s)) {
      const sr = s as Record<string, unknown>;
      const min = toNumber(sr.min ?? sr.min_salary);
      const max = toNumber(sr.max ?? sr.max_salary);
      const currency = isNonEmpty(sr.currency) ? sr.currency : undefined;
      const text = isNonEmpty(sr.text) ? sr.text : undefined;
      if (min || max || text) return { min, max, currency, text };
    }
    if (isNonEmpty(s)) return { text: s as string };
    return undefined;
  })();

  const hiringProcess = toStringArray(
    obj.hiring_process_steps ?? obj.hiring_process ?? obj.hiringProcess,
  );

  return {
    isStructured: true,
    title: isNonEmpty(obj.title) ? (obj.title as string) : undefined,
    summary: isNonEmpty(obj.summary) ? (obj.summary as string) : undefined,
    aboutRole: isNonEmpty(obj.about_role ?? obj.aboutRole)
      ? String(obj.about_role ?? obj.aboutRole)
      : undefined,
    responsibilities: toStringArray(obj.responsibilities),
    requiredSkills: toStringArray(obj.required_skills ?? obj.requiredSkills),
    preferredSkills: toStringArray(obj.preferred_skills ?? obj.preferredSkills),
    experience,
    education: toStringArray(obj.education),
    qualifications: toStringArray(obj.qualifications),
    niceToHave: toStringArray(obj.nice_to_have ?? obj.niceToHave),
    benefits: toStringArray(obj.benefits),
    location: isNonEmpty(obj.location) ? (obj.location as string) : undefined,
    workMode: isNonEmpty(obj.work_mode ?? obj.workMode)
      ? String(obj.work_mode ?? obj.workMode)
      : undefined,
    employmentType: isNonEmpty(obj.employment_type ?? obj.employmentType)
      ? String(obj.employment_type ?? obj.employmentType)
      : undefined,
    department: isNonEmpty(obj.department) ? (obj.department as string) : undefined,
    seniorityLevel: isNonEmpty(obj.seniority_level ?? obj.seniorityLevel)
      ? String(obj.seniority_level ?? obj.seniorityLevel)
      : undefined,
    atsKeywords: toStringArray(obj.ats_keywords ?? obj.atsKeywords),
    salaryRange,
    hiringProcess,
  };
}
