import { describe, it, expect } from "vitest";
import {
  normalizeCategoryGroup,
  groupCategories,
  findCategoryById,
} from "../lib/categoryMap";
import type { BackendCategory } from "../lib/types";

describe("categoryMap", () => {
  it("normalizes exact category group names", () => {
    expect(normalizeCategoryGroup("Employee Documents")).toBe("Employee Documents");
    expect(normalizeCategoryGroup("Education")).toBe("Education");
    expect(normalizeCategoryGroup("Employment")).toBe("Employment");
    expect(normalizeCategoryGroup("Company Documents")).toBe("Company Documents");
  });

  it("normalizes case-insensitively and maps is_company flag", () => {
    expect(normalizeCategoryGroup("education")).toBe("Education");
    expect(normalizeCategoryGroup("employment")).toBe("Employment");
    expect(normalizeCategoryGroup("any group", true)).toBe("Company Documents");
  });

  it("maps keywords like policy, handbook, academic to appropriate groups", () => {
    expect(normalizeCategoryGroup("HR Policy Group")).toBe("Company Documents");
    expect(normalizeCategoryGroup("Academic Proofs")).toBe("Education");
    expect(normalizeCategoryGroup("Previous Experience Letters")).toBe("Employment");
  });

  it("defaults unknown or empty group to Employee Documents", () => {
    expect(normalizeCategoryGroup(undefined)).toBe("Employee Documents");
    expect(normalizeCategoryGroup("")).toBe("Employee Documents");
    expect(normalizeCategoryGroup("Misc General")).toBe("Employee Documents");
  });

  it("groups categories correctly by canonical group", () => {
    const sampleCategories: BackendCategory[] = [
      { id: "cat-1", name: "Aadhaar Card", group: "Employee Documents" },
      { id: "cat-2", name: "Degree Certificate", group: "Education" },
      { id: "cat-3", name: "Offer Letter", group: "Employment" },
      { id: "cat-4", name: "Code of Conduct", group: "Company Documents", is_company: true },
    ];

    const grouped = groupCategories(sampleCategories);
    expect(grouped["Employee Documents"]).toHaveLength(1);
    expect(grouped["Employee Documents"][0].name).toBe("Aadhaar Card");
    expect(grouped.Education).toHaveLength(1);
    expect(grouped.Education[0].name).toBe("Degree Certificate");
    expect(grouped.Employment).toHaveLength(1);
    expect(grouped["Company Documents"]).toHaveLength(1);
  });

  it("finds category by id safely", () => {
    const sampleCategories: BackendCategory[] = [
      { id: "cat-1", name: "Passport", group: "Employee Documents" },
    ];
    expect(findCategoryById(sampleCategories, "cat-1")?.name).toBe("Passport");
    expect(findCategoryById(sampleCategories, "cat-999")).toBeUndefined();
    expect(findCategoryById(sampleCategories, "")).toBeUndefined();
  });
});
