import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import React from "react";
import { UploadDocumentDialog } from "../components/UploadDocumentDialog";
import { RejectDialog } from "../components/RejectDialog";
import { ReuploadDialog } from "../components/ReuploadDialog";
import type { BackendCategory, DocumentItem } from "../lib/types";

describe("Document Dialogs Components", () => {
  const mockCategories: BackendCategory[] = [
    { id: "cat-uuid-1", name: "Aadhaar Card", group: "Employee Documents" },
    { id: "cat-uuid-2", name: "PAN Card", group: "Employee Documents" },
    { id: "cat-uuid-3", name: "HR Policy", group: "Company Documents", is_company: true },
  ];

  const groupedCategories = {
    "Employee Documents": [mockCategories[0], mockCategories[1]],
    Education: [],
    Employment: [],
    "Company Documents": [mockCategories[2]],
    "HR Letters": [],
    "Employee ID Cards": [],
  };

  it("handles Change File behavior in UploadDocumentDialog", async () => {
    const handleUploadEmployee = vi.fn();
    const handleUploadCompany = vi.fn();

    render(
      <UploadDocumentDialog
        open={true}
        onOpenChange={vi.fn()}
        categories={mockCategories}
        groupedCategories={groupedCategories}
        currentEmployeeProfileId="emp-uuid-123"
        isEmployeeRole={true}
        onUploadEmployee={handleUploadEmployee}
        onUploadCompany={handleUploadCompany}
        isUploading={false}
      />
    );

    // Initial state: browse button is present
    expect(screen.getByText(/Click to browse or drag & drop a file here/i)).toBeInTheDocument();

    // Simulate file selection
    const file = new File(["test-content"], "sample_aadhaar.pdf", { type: "application/pdf" });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { files: [file] } });

    // File name should now be shown along with "Change File" button
    await waitFor(() => {
      expect(screen.getByText("sample_aadhaar.pdf")).toBeInTheDocument();
      expect(screen.getByText("Change File")).toBeInTheDocument();
    });

    // Clicking "Change File" should clear the selected file and restore the browse area
    fireEvent.click(screen.getByText("Change File"));

    await waitFor(() => {
      expect(screen.queryByText("sample_aadhaar.pdf")).not.toBeInTheDocument();
      expect(screen.getByText(/Click to browse or drag & drop a file here/i)).toBeInTheDocument();
      expect(input.value).toBe("");
    });
  });

  it("validates required comments in RejectDialog", async () => {
    const handleReject = vi.fn().mockResolvedValue(undefined);
    const mockDoc: DocumentItem = {
      id: "doc-123",
      source: "employee",
      title: "PAN Card",
      fileName: "pan.pdf",
      categoryName: "PAN Card",
      categoryGroup: "Employee Documents",
      uploadedByName: "John Doe",
      uploadedAt: "2026-09-01",
      isExpired: false,
      status: "PENDING",
      isVerified: false,
      fileSize: "200 KB",
      fileType: "pdf",
    };

    render(
      <RejectDialog
        open={true}
        onOpenChange={vi.fn()}
        targetDoc={mockDoc}
        onConfirmReject={handleReject}
        isRejecting={false}
      />
    );

    // Confirm button should be disabled when comments are empty
    const confirmButton = screen.getByText("Confirm Rejection");
    expect(confirmButton).toBeDisabled();

    // Type rejection comment
    const textarea = screen.getByPlaceholderText(/Document image is blurred/i);
    await waitFor(() => {
      fireEvent.change(textarea, { target: { value: "Document is expired and blurry" } });
    });

    expect(confirmButton).not.toBeDisabled();

    // Submit
    await waitFor(() => {
      fireEvent.click(confirmButton);
    });
    expect(handleReject).toHaveBeenCalledWith("doc-123", "Document is expired and blurry");
  });

  it("submits ReuploadDialog with required comments", async () => {
    const handleReupload = vi.fn().mockResolvedValue(undefined);
    const mockDoc: DocumentItem = {
      id: "doc-456",
      source: "employee",
      title: "Passport",
      fileName: "passport.pdf",
      categoryName: "Passport",
      categoryGroup: "Employee Documents",
      uploadedByName: "Jane Doe",
      uploadedAt: "2026-09-01",
      isExpired: false,
      status: "PENDING",
      isVerified: false,
      fileSize: "300 KB",
      fileType: "pdf",
    };

    render(
      <ReuploadDialog
        open={true}
        onOpenChange={vi.fn()}
        targetDoc={mockDoc}
        onConfirmReupload={handleReupload}
        isRequesting={false}
      />
    );

    const submitBtn = screen.getByText("Send Re-upload Request");
    expect(submitBtn).not.toBeDisabled();

    fireEvent.click(submitBtn);
    expect(handleReupload).toHaveBeenCalledWith(
      "doc-456",
      "Re-upload requested. Please supply a clear copy."
    );
  });
});
