import * as LucideIcons from "lucide-react";
import { DEPARTMENT_ICONS, THEME_COLORS } from "../constants";
import type { Department } from "../types";

const DEPARTMENT_NESTED_KEYS = [
  "department",
  "item",
  "department_details",
  "departmentDetails",
  "result",
  "record",
  "attributes",
  "payload",
  "data",
] as const;

function hasDepartmentFields(obj: Record<string, unknown>): boolean {
  return Boolean(
    obj.id != null ||
      obj.department_name ||
      obj.name ||
      obj.department_code ||
      obj.code,
  );
}

export function unwrapDepartmentApiRecord(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};

  let obj = { ...(raw as Record<string, unknown>) };

  for (let depth = 0; depth < 4; depth += 1) {
    if (hasDepartmentFields(obj)) return obj;

    const nestedKey = DEPARTMENT_NESTED_KEYS.find((key) => {
      const value = obj[key];
      return value && typeof value === "object" && !Array.isArray(value);
    });

    if (!nestedKey) break;
    obj = { ...obj, ...(obj[nestedKey] as Record<string, unknown>) };
  }

  return obj;
}

function pickDepartmentValue<T>(incoming: T, existing: T, emptyValues: T[] = []): T {
  if (emptyValues.some((value) => Object.is(value, incoming))) {
    return existing;
  }
  return incoming ?? existing;
}

/** Keep list-row values when detail API returns partial/empty mapped fields. */
export function mergeDepartmentRecord(
  existing: Department | null,
  incoming: Department,
): Department {
  if (!existing || existing.id !== incoming.id) {
    return incoming.id && incoming.name?.trim() ? incoming : existing ?? incoming;
  }

  return {
    ...existing,
    ...incoming,
    name: pickDepartmentValue(incoming.name, existing.name, [""]),
    description: pickDepartmentValue(incoming.description, existing.description, [""]),
    department_code: pickDepartmentValue(incoming.department_code, existing.department_code, [""]),
    cost_center: pickDepartmentValue(incoming.cost_center, existing.cost_center, [""]),
    departmentHeadId: incoming.departmentHeadId ?? existing.departmentHeadId,
    departmentHeadName: pickDepartmentValue(incoming.departmentHeadName, existing.departmentHeadName, [
      "",
      "Unassigned",
    ]),
    reportingManagerId: incoming.reportingManagerId ?? existing.reportingManagerId,
    reportingManagerName: pickDepartmentValue(incoming.reportingManagerName, existing.reportingManagerName, [
      "",
      "None",
    ]),
    office: pickDepartmentValue(incoming.office, existing.office, [""]),
    extensionNumber: pickDepartmentValue(incoming.extensionNumber, existing.extensionNumber, [""]),
    themeColor: pickDepartmentValue(incoming.themeColor, existing.themeColor, [""]),
    iconName: pickDepartmentValue(incoming.iconName, existing.iconName, [""]),
    parentId: incoming.parentId ?? existing.parentId,
    parentName: pickDepartmentValue(incoming.parentName, existing.parentName, ["", "None"]),
    createdDate: pickDepartmentValue(incoming.createdDate, existing.createdDate, [""]),
    budget: incoming.budget || existing.budget,
    employeeCapacity: incoming.employeeCapacity || existing.employeeCapacity,
    currentEmployeeCount: incoming.currentEmployeeCount || existing.currentEmployeeCount,
    employeeIds: incoming.employeeIds.length > 0 ? incoming.employeeIds : existing.employeeIds,
    openPositions: incoming.openPositions ?? existing.openPositions,
    performanceScore: incoming.performanceScore || existing.performanceScore,
    attendanceScore: incoming.attendanceScore || existing.attendanceScore,
    hiringStatus: incoming.hiringStatus ?? existing.hiringStatus,
    recentActivity:
      incoming.recentActivity.length > 0 ? incoming.recentActivity : existing.recentActivity,
    documents: incoming.documents.length > 0 ? incoming.documents : existing.documents,
  };
}

export function normalizeThemeColor(color?: string | null): string {
  const fallback = THEME_COLORS[0]?.hex ?? "#3b82f6";
  if (!color?.trim()) return fallback;

  const normalized = color.trim().toLowerCase();
  const withHash = normalized.startsWith("#") ? normalized : `#${normalized}`;
  const preset = THEME_COLORS.find((tc) => tc.hex.toLowerCase() === withHash);
  return preset?.hex ?? withHash;
}

export function themeColorsMatch(a?: string | null, b?: string | null): boolean {
  if (!a || !b) return false;
  return normalizeThemeColor(a).toLowerCase() === normalizeThemeColor(b).toLowerCase();
}

export function normalizeIconName(name?: string | null): string {
  const fallback = DEPARTMENT_ICONS.find((icon) => icon.name === "Building2")?.name ?? "Building2";
  if (!name?.trim()) return fallback;

  const trimmed = name.trim();
  const fromPreset = DEPARTMENT_ICONS.find(
    (icon) => icon.name.toLowerCase() === trimmed.toLowerCase(),
  );
  if (fromPreset) return fromPreset.name;

  const icons = LucideIcons as Record<string, unknown>;
  if (icons[trimmed]) return trimmed;

  const pascalCase = trimmed
    .split(/[_-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");

  if (icons[pascalCase]) return pascalCase;

  return fallback;
}

export function getDepartmentIconOptions(currentIconName?: string | null) {
  const normalizedCurrent = currentIconName ? normalizeIconName(currentIconName) : null;
  const options = [...DEPARTMENT_ICONS];

  if (
    normalizedCurrent &&
    !options.some((option) => option.name.toLowerCase() === normalizedCurrent.toLowerCase())
  ) {
    options.unshift({ name: normalizedCurrent, label: normalizedCurrent });
  }

  return options;
}
