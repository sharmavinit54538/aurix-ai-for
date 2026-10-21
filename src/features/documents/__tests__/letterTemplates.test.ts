import { describe, it, expect } from "vitest";
import {
  replaceTemplateVariables,
  checkRequiredFieldsAndPlaceholders,
  getUnresolvedPlaceholders,
  LETTER_TYPES,
} from "../lib/letterTemplates";

describe("letterTemplates placeholder resolution & graceful fallback", () => {
  it("resolves location, manager_name, and company_address from context", () => {
    const template = "Work location: {{location}}, Manager: {{manager_name}}, Office: {{company_address}}";
    const context = {
      location: "Bengaluru Campus",
      manager_name: "Anita Sharma",
      company_address: "Embassy TechVillage, Bellandur, Bengaluru",
    };

    const rendered = replaceTemplateVariables(template, context);
    expect(rendered).toBe(
      "Work location: Bengaluru Campus, Manager: Anita Sharma, Office: Embassy TechVillage, Bellandur, Bengaluru"
    );
  });

  it("resolves square bracket placeholders [location], [manager_name], [company_address]", () => {
    const template = "Location: [location] | Reporting: [manager_name] | Address: [company_address]";
    const context = {
      location: "Mumbai HQ",
      manager_name: "Rajesh Kumar",
      company_address: "BKC, Bandra East, Mumbai",
    };

    const rendered = replaceTemplateVariables(template, context);
    expect(rendered).toBe("Location: Mumbai HQ | Reporting: Rajesh Kumar | Address: BKC, Bandra East, Mumbai");
  });

  it("falls back gracefully when location, manager_name, or company_address are empty or missing", () => {
    const template = "Report to {{manager_name}} at {{location}}. Registered at: {{company_address}}";
    const context = {
      company_name: "Acme Corp",
      // location, manager_name, company_address not provided
    };

    const rendered = replaceTemplateVariables(template, context);
    expect(rendered).toContain("Management");
    expect(rendered).toContain("Corporate Office");
    expect(rendered).not.toContain("[manager_name]");
    expect(rendered).not.toContain("[location]");
    expect(rendered).not.toContain("[company_address]");
  });

  it("does not report unresolved placeholder errors for safe contextual fallbacks", () => {
    const offerLetterType = LETTER_TYPES.find((t) => t.id === "offer_letter")!;
    const fields = {
      ctc: "12,00,000",
      effective_date: "2026-11-01",
    };
    // Content containing standard contextual placeholders
    const content = "Offer for Software Engineer at [location] reporting to [manager_name]. Office: [company_address]";

    const validation = checkRequiredFieldsAndPlaceholders(offerLetterType, fields, content);
    expect(validation.missingFields).toHaveLength(0);
    // Should NOT have unresolved placeholder errors for location, manager_name, or company_address
    expect(validation.placeholderErrors).toHaveLength(0);
  });
});
