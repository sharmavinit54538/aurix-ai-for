import type { BackendCategory, CategoryGroup } from "./types";
import { CATEGORY_GROUPS } from "./types";

/**
 * Normalizes any category group string from backend to one of the 4 canonical groups:
 * "Employee Documents" | "Education" | "Employment" | "Company Documents"
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
  if (lower.includes("company") || lower.includes("policy") || lower.includes("handbook")) {
    return "Company Documents";
  }
  if (lower.includes("education") || lower.includes("academic") || lower.includes("degree")) {
    return "Education";
  }
  if (lower.includes("employment") || lower.includes("experience") || lower.includes("offer")) {
    return "Employment";
  }

  return "Employee Documents";
}

/**
 * Groups an array of backend categories into the 4 canonical category groups.
 */
export function groupCategories(
  categories: BackendCategory[]
): Record<CategoryGroup, BackendCategory[]> {
  const result: Record<CategoryGroup, BackendCategory[]> = {
    "Employee Documents": [],
    Education: [],
    Employment: [],
    "Company Documents": [],
  };

  for (const cat of categories) {
    const group = normalizeCategoryGroup(cat.group, cat.is_company);
    result[group].push(cat);
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
