import { describe, it, expect } from "vitest";
import {
  validateDocumentFile,
  validateDocumentDates,
  validateTitle,
  validateComments,
  extractFilenameFromHeader,
} from "../lib/validation";

describe("validation and filename extraction", () => {
  it("validates file presence, size limit, and supported extensions", () => {
    // Null/undefined file
    expect(validateDocumentFile(null).valid).toBe(false);

    // Empty file (0 bytes)
    const emptyFile = new File([], "test.pdf", { type: "application/pdf" });
    expect(validateDocumentFile(emptyFile).valid).toBe(false);

    // File > 10MB
    const largeBlob = new Blob([new Uint8Array(11 * 1024 * 1024)]);
    const largeFile = new File([largeBlob], "large.pdf", { type: "application/pdf" });
    const largeResult = validateDocumentFile(largeFile);
    expect(largeResult.valid).toBe(false);
    expect(largeResult.error).toContain("10 MB limit");

    // Invalid extension
    const exeFile = new File(["content"], "malware.exe", { type: "application/x-msdownload" });
    const exeResult = validateDocumentFile(exeFile);
    expect(exeResult.valid).toBe(false);
    expect(exeResult.error).toContain("not supported");

    // Valid files
    const validPdf = new File(["%PDF-1.4 content"], "offer.pdf", { type: "application/pdf" });
    expect(validateDocumentFile(validPdf).valid).toBe(true);

    const validPng = new File(["image-bytes"], "photo.png", { type: "image/png" });
    expect(validateDocumentFile(validPng).valid).toBe(true);

    const validDocx = new File(["docx-bytes"], "policy.docx", {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });
    expect(validateDocumentFile(validDocx).valid).toBe(true);
  });

  it("validates issue date vs expiry date", () => {
    // Expiry after issue is valid
    expect(validateDocumentDates("2026-01-01", "2026-12-31").valid).toBe(true);

    // Same date is valid
    expect(validateDocumentDates("2026-06-01", "2026-06-01").valid).toBe(true);

    // No expiry is valid
    expect(validateDocumentDates("2026-01-01", null).valid).toBe(true);
    expect(validateDocumentDates("2026-01-01", "").valid).toBe(true);

    // Expiry earlier than issue is invalid
    const invalidResult = validateDocumentDates("2026-08-01", "2026-05-01");
    expect(invalidResult.valid).toBe(false);
    expect(invalidResult.error).toContain("earlier than the issue date");
  });

  it("validates document title", () => {
    expect(validateTitle("").valid).toBe(false);
    expect(validateTitle("   ").valid).toBe(false);
    expect(validateTitle("Aadhaar Card").valid).toBe(true);
    expect(validateTitle("a".repeat(256)).valid).toBe(false);
  });

  it("validates comments length (min 1, max 1000 characters)", () => {
    expect(validateComments("").valid).toBe(false);
    expect(validateComments("   ").valid).toBe(false);
    expect(validateComments("Document scan is blurry.").valid).toBe(true);
    expect(validateComments("a".repeat(1001)).valid).toBe(false);
    expect(validateComments("a".repeat(1000)).valid).toBe(true);
  });

  it("extracts download filename from Content-Disposition header", () => {
    // Standard attachment; filename="document.pdf"
    expect(
      extractFilenameFromHeader('attachment; filename="passport_rahul.pdf"', "fallback")
    ).toBe("passport_rahul.pdf");

    // Without quotes
    expect(
      extractFilenameFromHeader("attachment; filename=policy_2026.docx", "fallback")
    ).toBe("policy_2026.docx");

    // RFC 5987 UTF-8 encoded
    expect(
      extractFilenameFromHeader("attachment; filename*=UTF-8''my%20contract.pdf", "fallback")
    ).toBe("my contract.pdf");

    // Fallback when header is missing or empty
    expect(extractFilenameFromHeader(null, "salary_slip", "pdf")).toBe("salary_slip.pdf");
    expect(extractFilenameFromHeader(undefined, "id_card", "png")).toBe("id_card.png");
    expect(extractFilenameFromHeader(undefined, "already_has.pdf")).toBe("already_has.pdf");
  });
});
