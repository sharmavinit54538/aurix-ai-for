import { describe, it, expect } from "vitest";
import {
  formatFileSize,
  detectFileType,
  isDocumentExpired,
  mapDocumentStatus,
  mapBackendDocument,
} from "../lib/mappers";
import type { BackendDocumentItem } from "../lib/types";

describe("mappers and status mapping", () => {
  it("formats file sizes accurately", () => {
    expect(formatFileSize(null)).toBe("—");
    expect(formatFileSize(undefined)).toBe("—");
    expect(formatFileSize(0)).toBe("—");
    expect(formatFileSize(500)).toBe("500 B");
    expect(formatFileSize(1024 * 150)).toBe("150 KB");
    expect(formatFileSize(1024 * 1024 * 2.5)).toBe("2.5 MB");
  });

  it("detects file types correctly from filename, url, or mimeType", () => {
    expect(detectFileType("passport.pdf")).toBe("pdf");
    expect(detectFileType("photo.png")).toBe("png");
    expect(detectFileType("avatar.jpg")).toBe("jpg");
    expect(detectFileType("avatar.jpeg")).toBe("jpg");
    expect(detectFileType("contract.docx")).toBe("docx");
    expect(detectFileType("letter.doc")).toBe("doc");
    expect(detectFileType("archive.zip")).toBe("other");
  });

  it("determines document expiry based on date", () => {
    expect(isDocumentExpired(null)).toBe(false);
    expect(isDocumentExpired(undefined)).toBe(false);
    expect(isDocumentExpired("invalid-date")).toBe(false);

    // Yesterday is expired
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    expect(isDocumentExpired(yesterday)).toBe(true);

    // 10 days in future is not expired
    const future = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    expect(isDocumentExpired(future)).toBe(false);
  });

  it("maps company documents to Published status", () => {
    const doc: BackendDocumentItem = { id: "doc-1", title: "HR Policy" };
    expect(mapDocumentStatus(doc, "company")).toBe("Published");
  });

  it("maps employee document statuses correctly", () => {
    const verifiedDoc: BackendDocumentItem = {
      id: "doc-1",
      is_verified: true,
      status: "VERIFIED",
    };
    expect(mapDocumentStatus(verifiedDoc, "employee")).toBe("VERIFIED");

    const pendingDoc: BackendDocumentItem = {
      id: "doc-2",
      is_verified: false,
      status: "PENDING",
    };
    expect(mapDocumentStatus(pendingDoc, "employee")).toBe("PENDING");

    const rejectedDoc: BackendDocumentItem = {
      id: "doc-3",
      is_verified: false,
      status: "REJECTED",
    };
    expect(mapDocumentStatus(rejectedDoc, "employee")).toBe("REJECTED");

    // Past expiry overrides pending or verified
    const expiredDoc: BackendDocumentItem = {
      id: "doc-4",
      is_verified: true,
      status: "VERIFIED",
      expiry_date: "2020-01-01",
    };
    expect(mapDocumentStatus(expiredDoc, "employee")).toBe("Expired");
  });

  it("maps raw backend document fields into normalized DocumentItem", () => {
    const raw: BackendDocumentItem = {
      id: "doc-uuid-123",
      employee_id: "emp-uuid-456",
      employee_name: "Rahul Sharma",
      title: "PAN Card",
      category_name: "Tax Documents",
      category_group: "Employee Documents",
      uploaded_by_name: "Priya Singh",
      created_at: "2026-09-15T10:30:00Z",
      expiry_date: "2030-12-31",
      file_size: 204800,
      file_name: "pan_card.pdf",
      is_verified: false,
      status: "PENDING",
    };

    const item = mapBackendDocument(raw, "employee");
    expect(item.id).toBe("doc-uuid-123");
    expect(item.source).toBe("employee");
    expect(item.title).toBe("PAN Card");
    expect(item.employeeName).toBe("Rahul Sharma");
    expect(item.uploadedByName).toBe("Priya Singh");
    expect(item.uploadedAt).toBe("2026-09-15");
    expect(item.fileSize).toBe("200 KB");
    expect(item.fileType).toBe("pdf");
    expect(item.status).toBe("PENDING");
    expect(item.isExpired).toBe(false);
  });
});
