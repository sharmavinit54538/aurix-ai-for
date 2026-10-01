import { describe, it, expect } from "vitest";
import {
  canDo,
  canAccessDocumentsRoute,
  canEmployeeReupload,
} from "../lib/permissions";
import type { DocumentItem } from "../lib/types";

describe("permissions matrix", () => {
  it("allows super_admin and hr_admin full access to all document actions", () => {
    const roles = ["super_admin", "hr_admin"];
    const actions = [
      "view",
      "upload",
      "verify",
      "reject",
      "requestReupload",
      "delete",
      "generate",
      "download",
    ] as const;

    for (const role of roles) {
      for (const action of actions) {
        expect(canDo(role, action)).toBe(true);
      }
    }
  });

  it("limits executive to read-only access", () => {
    expect(canDo("executive", "view")).toBe(true);
    expect(canDo("executive", "download")).toBe(true);
    expect(canDo("executive", "upload")).toBe(false);
    expect(canDo("executive", "verify")).toBe(false);
    expect(canDo("executive", "reject")).toBe(false);
    expect(canDo("executive", "requestReupload")).toBe(false);
    expect(canDo("executive", "delete")).toBe(false);
    expect(canDo("executive", "generate")).toBe(false);
  });

  it("limits manager to view and download", () => {
    expect(canDo("manager", "view")).toBe(true);
    expect(canDo("manager", "download")).toBe(true);
    expect(canDo("manager", "verify")).toBe(false);
    expect(canDo("manager", "reject")).toBe(false);
    expect(canDo("manager", "delete")).toBe(false);
  });

  it("enforces employee role restrictions", () => {
    // Can view and upload own documents
    expect(canDo("employee", "view")).toBe(true);
    expect(canDo("employee", "download")).toBe(true);
    expect(canDo("employee", "upload")).toBe(true);

    // Cannot verify, reject, or request re-upload
    expect(canDo("employee", "verify")).toBe(false);
    expect(canDo("employee", "reject")).toBe(false);
    expect(canDo("employee", "requestReupload")).toBe(false);
    expect(canDo("employee", "generate")).toBe(false);

    // Delete: employee can delete own unverified documents only
    expect(
      canDo("employee", "delete", {
        isOwnDocument: true,
        isVerified: false,
        source: "employee",
      })
    ).toBe(true);

    // Cannot delete verified documents
    expect(
      canDo("employee", "delete", {
        isOwnDocument: true,
        isVerified: true,
        source: "employee",
      })
    ).toBe(false);

    // Cannot delete others' documents
    expect(
      canDo("employee", "delete", {
        isOwnDocument: false,
        isVerified: false,
        source: "employee",
      })
    ).toBe(false);

    // Cannot delete company documents
    expect(
      canDo("employee", "delete", {
        isOwnDocument: true,
        isVerified: false,
        source: "company",
      })
    ).toBe(false);
  });

  it("blocks it_admin and recruiter from employee documents page", () => {
    expect(canDo("it_admin", "view")).toBe(false);
    expect(canDo("it_admin", "upload")).toBe(false);
    expect(canDo("recruiter", "view")).toBe(false);
    expect(canDo("recruiter", "verify")).toBe(false);

    expect(canAccessDocumentsRoute("it_admin")).toBe(false);
    expect(canAccessDocumentsRoute("recruiter")).toBe(false);
    expect(canAccessDocumentsRoute("hr_admin")).toBe(true);
    expect(canAccessDocumentsRoute("employee")).toBe(true);
  });

  it("checks whether an employee can reupload a document", () => {
    const rejectedDoc: DocumentItem = {
      id: "doc-1",
      source: "employee",
      title: "Pass",
      fileName: "pass.pdf",
      categoryName: "Pass",
      categoryGroup: "Employee Documents",
      uploadedByName: "Emp",
      uploadedAt: "2026-09-01",
      isExpired: false,
      status: "REJECTED",
      isVerified: false,
      fileSize: "100 KB",
      fileType: "pdf",
      rejectionReason: "Photo blurry",
    };
    expect(canEmployeeReupload(rejectedDoc)).toBe(true);

    const verifiedDoc: DocumentItem = {
      ...rejectedDoc,
      status: "VERIFIED",
      isVerified: true,
      rejectionReason: undefined,
    };
    expect(canEmployeeReupload(verifiedDoc)).toBe(false);

    const companyDoc: DocumentItem = {
      ...rejectedDoc,
      source: "company",
    };
    expect(canEmployeeReupload(companyDoc)).toBe(false);
  });
});
