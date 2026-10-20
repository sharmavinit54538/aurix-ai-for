import { describe, it, expect } from "vitest";
import {
  detectJobDomain,
  getDepartmentSkills,
  generateSmartJobDescription,
} from "@/features/admin/recruitment/utils/generateSmartJobDescription";
import { normalizeJobDescription } from "@/features/admin/recruitment/utils/normalizeJobDescription";

describe("generateSmartJobDescription multi-industry support", () => {
  it("detects HR domain and generates HR-specific content", () => {
    const domain = detectJobDomain("Talent Acquisition Specialist", "Human Resources");
    expect(domain).toBe("hr");

    const result = generateSmartJobDescription({
      title: "Talent Acquisition Specialist",
      department: "Human Resources",
      experience: "2-4 yrs",
    });

    expect(result.summary.toLowerCase()).toContain("human resources");
    expect(result.responsibilities.some((r) => r.toLowerCase().includes("recruitment"))).toBe(true);
    expect(result.suggestedSkills).toContain("Talent Acquisition");
    expect(result.markdownDescription).toContain("### Key Responsibilities");
    // Ensure no tech words are inappropriately present
    expect(result.responsibilities.some((r) => r.toLowerCase().includes("microservice"))).toBe(false);
  });

  it("detects Sales domain and generates Sales-specific content", () => {
    const domain = detectJobDomain("Account Executive", "Sales & Business Dev");
    expect(domain).toBe("sales");

    const result = generateSmartJobDescription({
      title: "Account Executive",
      department: "Sales & Business Dev",
      experience: "3-5 yrs",
    });

    expect(result.summary.toLowerCase()).toContain("sales");
    expect(result.responsibilities.some((r) => r.toLowerCase().includes("sales pipeline"))).toBe(true);
    expect(result.suggestedSkills).toContain("B2B Sales");
  });

  it("detects Finance domain and generates Finance-specific content", () => {
    const domain = detectJobDomain("Financial Analyst", "Finance & Accounting");
    expect(domain).toBe("finance");

    const result = generateSmartJobDescription({
      title: "Financial Analyst",
      department: "Finance & Accounting",
    });

    expect(result.summary.toLowerCase()).toContain("financial");
    expect(result.responsibilities.some((r) => r.toLowerCase().includes("accounting") || r.toLowerCase().includes("ledger"))).toBe(true);
    expect(result.suggestedSkills).toContain("Financial Analysis");
  });

  it("detects Marketing domain and generates Marketing-specific content", () => {
    const domain = detectJobDomain("Growth Marketing Manager", "Marketing & Growth");
    expect(domain).toBe("marketing");

    const result = generateSmartJobDescription({
      title: "Growth Marketing Manager",
      department: "Marketing & Growth",
    });

    expect(result.summary.toLowerCase()).toContain("marketing");
    expect(result.responsibilities.some((r) => r.toLowerCase().includes("campaign"))).toBe(true);
    expect(result.suggestedSkills).toContain("Digital Marketing");
  });

  it("detects Healthcare domain and generates clinical content", () => {
    const domain = detectJobDomain("Staff Nurse", "Healthcare");
    expect(domain).toBe("healthcare");

    const result = generateSmartJobDescription({
      title: "Staff Nurse",
      department: "Healthcare",
    });

    expect(result.summary.toLowerCase()).toContain("healthcare");
    expect(result.responsibilities.some((r) => r.toLowerCase().includes("patient care"))).toBe(true);
  });

  it("detects Design domain and generates creative UI/UX content", () => {
    const domain = detectJobDomain("Product Designer", "Design & Creative");
    expect(domain).toBe("design");

    const result = generateSmartJobDescription({
      title: "Product Designer",
      department: "Design & Creative",
    });

    expect(result.responsibilities.some((r) => r.toLowerCase().includes("figma") || r.toLowerCase().includes("user research"))).toBe(true);
    expect(result.suggestedSkills).toContain("UI/UX Design");
  });

  it("returns dynamic department skills for various fields", () => {
    expect(getDepartmentSkills("Human Resources")).toContain("Talent Acquisition");
    expect(getDepartmentSkills("Sales & Business Dev")).toContain("Lead Generation");
    expect(getDepartmentSkills("Finance & Accounting")).toContain("Budgeting & Forecasting");
    expect(getDepartmentSkills("Engineering")).toContain("React");
    expect(getDepartmentSkills("Operations")).toContain("Process Optimization");
  });
});

describe("normalizeJobDescription markdown parsing", () => {
  it("parses markdown headings into structured arrays", () => {
    const md = `
### About The Role
We are seeking an HR Manager to lead our People Operations.

### Key Responsibilities
- Manage recruitment cycle
- Oversee compliance and policies
- Drive employee engagement

### Qualifications & Requirements
- 5+ years of HR experience
- Bachelor's degree in HR or relevant field

### What We Offer & Benefits
- Health insurance
- Flexible work hours
    `;

    const normalized = normalizeJobDescription(md);
    expect(normalized.isStructured).toBe(true);
    expect(normalized.summary).toContain("We are seeking an HR Manager");
    expect(normalized.responsibilities?.length).toBe(3);
    expect(normalized.responsibilities?.[0]).toBe("Manage recruitment cycle");
    expect(normalized.qualifications?.length).toBe(2);
    expect(normalized.benefits?.length).toBe(2);
  });
});
