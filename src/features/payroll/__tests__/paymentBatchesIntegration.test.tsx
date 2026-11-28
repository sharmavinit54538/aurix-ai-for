import type { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { aurix, type Role } from "@/lib/aurix-store";
import { settingsApi } from "@/redux/settingsApi";
import sidebarReducer from "@/store/sidebar/sidebarSlice";
import {
  normalizeDashboardSummary,
  normalizePaymentBatch,
  normalizePaymentBatchItem,
  normalizeReconciliation,
} from "../api/paymentApi";
import { resolvePaymentBatchActions } from "../utils/paymentBatchActions";
import PaymentBatchListPage from "../pages/PaymentBatchListPage";
import PaymentBatchDetailPage from "../pages/PaymentBatchDetailPage";

const navigateMock = vi.hoisted(() => vi.fn());
const mockParams = vi.hoisted(() => ({ current: { batchId: "79d4f6cb-ab86-45a5-b067-9079d5397513" } }));

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@tanstack/react-router")>();
  return {
    ...actual,
    Link: ({ children, to }: { children?: ReactNode; to?: string }) => <a href={to}>{children}</a>,
    useNavigate: () => navigateMock,
    useParams: () => mockParams.current,
  };
});

vi.mock("sonner", () => ({
  toast: { success: vi.fn(), error: vi.fn(), info: vi.fn(), warning: vi.fn() },
}));

function createTestStore(role: Role = "hr_admin", permissions: string[] = ["*"]) {
  return configureStore({
    reducer: {
      sidebar: sidebarReducer,
      [settingsApi.reducerPath]: settingsApi.reducer,
    },
    preloadedState: {
      sidebar: {
        userPermissions: permissions,
        userRole: role,
        sidebarOpen: true,
        expandedSections: {},
        loading: false,
        error: null,
      },
    },
    middleware: (getDefault) => getDefault().concat(settingsApi.middleware),
  });
}

function setSignedInUser(role: Role = "hr_admin", id = "user-checker") {
  aurix.set({
    user: {
      id,
      fullName: "Payroll Reviewer",
      email: "finance@testcorp.in",
      phone: "",
      role,
      companyId: "comp-1",
      emailVerified: true,
      onboardingComplete: true,
      createdAt: "2026-01-01T00:00:00Z",
    },
  });
}

function makeBatchFixture(overrides: Partial<ReturnType<typeof normalizePaymentBatch>> = {}) {
  return {
    ...normalizePaymentBatch({
      id: "batch-1",
      batch_number: "PB-202611-001",
      run_id: "run-1",
      period_id: "period-1",
      period_name: "November 2026",
      payment_mode: "NEFT",
      status: "DRAFT",
      employee_count: 10,
      held_count: 1,
      failed_count: 0,
      payable_amount_paise: 50000000,
      payable_amount_formatted: "₹5,00,000.00",
      created_by: { id: "user-maker", name: "Maker", email: "maker@test.com" },
      created_at: "2026-11-25T10:00:00Z",
    }),
    ...overrides,
  };
}

describe("Payroll Payments API Normalizers & Three-Dot Menu Integration", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    setSignedInUser("hr_admin", "user-checker");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("API Response Normalization", () => {
    it("maps snake_case backend batch & summary payloads accurately without fabricating missing counts", () => {
      const batch = normalizePaymentBatch({
        id: "79d4f6cb-ab86-45a5-b067-9079d5397513",
        batch_number: "PB-202611-70ECA7",
        run_id: "run-11",
        period_id: "period-11",
        payroll_period: "November 2026",
        payment_mode: "NEFT",
        status: "SUBMITTED",
        employee_count: 6,
        gross_amount_paise: 80644384,
        held_amount_paise: 4680000,
        total_amount_paise: 75964384,
        payable_amount_formatted: "₹7,59,643.84",
        created_at: "2026-11-25T10:30:00Z",
      });

      expect(batch.batchNumber).toBe("PB-202611-70ECA7");
      expect(batch.periodName).toBe("November 2026");
      expect(batch.paymentMode).toBe("NEFT");
      expect(batch.status).toBe("submitted");
      expect(batch.employeeCount).toBe(6);
      expect(batch.payableAmountFormatted).toBe("₹7,59,643.84");

      const unknownCountBatch = normalizePaymentBatch({
        id: "b-unknown",
        batch_number: "PB-00",
        status: "DRAFT",
        total_amount_paise: 0,
      });
      expect(unknownCountBatch.employeeCount).toBeNull();

      const summary = normalizeDashboardSummary({
        total_batches: 5,
        awaiting_approval_batches: 0,
        in_banking_processing_batches: 1,
        submitted_to_bank_batches: 1,
        reconciled_batches: 4,
        reconciliation_percentage: 80.0,
        total_payable_amount_paise: 398414359,
      });
      expect(summary.totalBatches).toBe(5);
      expect(summary.inBankingProcessingBatches).toBe(1);
      expect(summary.reconciledBatches).toBe(4);
      expect(summary.reconciliationPercentage).toBe(80);
    });

    it("strips ciphertext bank prefixes and normalizes SUCCESS items to paid", () => {
      const item = normalizePaymentBatchItem({
        id: "item-1",
        batch_id: "b-1",
        employee_id: "emp-1",
        employee_code: "EMP-101",
        employee_name: "Ananya Verma",
        bank_name: "HDFC Bank",
        account_number_masked: "ofc360:v1:encryptedpayload",
        ifsc_code: "HDFC0000512",
        amount_paise: 5000000,
        status: "SUCCESS",
        utr_number: "UTR123456",
      });
      expect(item.status).toBe("paid");
      expect(item.accountNumberMasked).toBe("—");
      expect(item.utr).toBe("UTR123456");

      const recon = normalizeReconciliation({
        batch_id: "b-1",
        run_id: "r-1",
        expected_paise: 80644384,
        paid_paise: 73972584,
        failed_paise: 0,
        held_paise: 4680000,
        processing_paise: 1991800,
        unmatched_paise: 0,
        mismatch_paise: 0,
        is_reconciled: false,
        summary_text: "1 employee payout awaiting confirmation",
      });
      expect(recon.mismatchPaise).toBe(0);
      expect(recon.paidPaise).toBe(73972584);
      expect(recon.processingPaise).toBe(1991800);
    });
  });

  describe("Status, Permission & Maker-Checker Action Matrix", () => {
    it("resolves exact allowed actions across every batch status and enforces role/maker-checker restrictions", () => {
      const adminCtx = { role: "hr_admin" as const, permissions: ["*"], currentUserId: "user-checker" };

      const draftIds = resolvePaymentBatchActions(makeBatchFixture({ status: "draft" }), adminCtx).map((a) => a.id);
      expect(draftIds).toEqual(["view_details", "edit_batch", "view_employees", "validate_batch", "delete_draft"]);

      const validatedIds = resolvePaymentBatchActions(makeBatchFixture({ status: "validated" }), adminCtx).map((a) => a.id);
      expect(validatedIds).toEqual([
        "view_details",
        "manage_batch",
        "view_employees",
        "submit_for_approval",
        "export_report",
        "cancel_batch",
      ]);

      // Maker viewing pending_approval has Approve disabled due to maker-checker segregation
      const creatorActions = resolvePaymentBatchActions(makeBatchFixture({ status: "pending_approval" }), {
        role: "hr_admin",
        permissions: ["*"],
        currentUserId: "user-maker",
      });
      const creatorApprove = creatorActions.find((a) => a.id === "approve_batch");
      expect(creatorApprove?.disabled).toBe(true);
      expect(creatorApprove?.disabledReason).toContain("creator cannot approve");

      // Reconciled batches never expose edit, cancel, delete, or submit
      const reconciledIds = resolvePaymentBatchActions(makeBatchFixture({ status: "reconciled" }), adminCtx).map(
        (a) => a.id
      );
      expect(reconciledIds).not.toContain("edit_batch");
      expect(reconciledIds).not.toContain("cancel_batch");
      expect(reconciledIds).not.toContain("delete_draft");
      expect(reconciledIds).not.toContain("submit_to_bank");
      expect(reconciledIds).toContain("download_reconciliation_report");

      // Super Admin receives zero actions
      expect(
        resolvePaymentBatchActions(makeBatchFixture({ status: "draft" }), {
          role: "super_admin",
          permissions: ["*"],
          currentUserId: "sa-1",
        })
      ).toEqual([]);

      // Standard OFC360 backend /sidebar/permissions response renders full menu for Executive/HR Admin
      const liveSidebarPerms = ["dashboard:read", "payroll:read", "reports:read", "exports:read"];
      const execSubmitted = resolvePaymentBatchActions(makeBatchFixture({ status: "submitted" }), {
        role: "executive",
        permissions: liveSidebarPerms,
        currentUserId: "exec-1",
      }).map((a) => a.id);
      expect(execSubmitted).toContain("view_details");
      expect(execSubmitted).toContain("track_status");
      expect(execSubmitted).toContain("reconcile_payment");
      expect(execSubmitted).toContain("download_bank_file");

      // Granular read-only permission strictly hides write/destructive actions
      const viewOnlyDraft = resolvePaymentBatchActions(makeBatchFixture({ status: "draft" }), {
        role: "hr_admin",
        permissions: ["payroll.payments.view"],
        currentUserId: "hr-1",
      }).map((a) => a.id);
      expect(viewOnlyDraft).toEqual(["view_details", "view_employees"]);
    });
  });

  describe("PaymentBatchListPage & Three-Dot Action Menu", () => {
    it("renders summary cards, table data, three-dot dropdown actions, confirmation dialog, and details drawer", async () => {
      let deletedBatchId: string | null = null;

      server.use(
        http.get("*/api/v2/payroll/payment-batches/summary", () =>
          HttpResponse.json({
            success: true,
            data: {
              total_batches: 5,
              pending_approval_batches: 0,
              awaiting_approval_batches: 0,
              submitted_to_bank_batches: 1,
              in_banking_processing_batches: 1,
              reconciled_batches: 4,
              reconciliation_percentage: 80,
              total_payable_amount_paise: 398414359,
              total_payable_amount_formatted: "₹39,84,143.59",
              total_paid_amount_paise: 396422559,
              total_paid_amount_formatted: "₹39,64,225.59",
              currency: "INR",
            },
          })
        ),
        http.get("*/api/v2/payroll/payment-batches", () =>
          HttpResponse.json({
            success: true,
            data: {
              items: [
                {
                  id: "79d4f6cb-ab86-45a5-b067-9079d5397513",
                  batch_number: "PB-202611-70ECA7",
                  run_id: "run-11",
                  run_number: "PR-202611-CCE9",
                  period_id: "p-11",
                  period_name: "November 2026",
                  payment_mode: "NEFT",
                  employee_count: 6,
                  held_count: 1,
                  paid_count: 5,
                  payable_amount_paise: 75964384,
                  payable_amount_formatted: "₹7,59,643.84",
                  paid_amount_formatted: "₹7,39,725.84",
                  outstanding_amount_formatted: "₹19,918.00",
                  status: "SUBMITTED",
                  created_at: "2026-11-25T10:30:00Z",
                },
                {
                  id: "draft-batch-2",
                  batch_number: "PB-202611-DRAFT2",
                  run_id: "run-12",
                  period_id: "p-11",
                  period_name: "November 2026",
                  payment_mode: "NEFT",
                  employee_count: 4,
                  payable_amount_paise: 20000000,
                  payable_amount_formatted: "₹2,00,000.00",
                  status: "DRAFT",
                  created_at: "2026-11-26T10:30:00Z",
                },
              ].filter((b) => b.id !== deletedBatchId),
              total: deletedBatchId ? 4 : 5,
              page: 1,
              limit: 20,
              total_pages: 1,
            },
          })
        ),
        http.get("*/api/v2/payroll/payment-batches/79d4f6cb-ab86-45a5-b067-9079d5397513", () =>
          HttpResponse.json({
            success: true,
            data: {
              batch: {
                id: "79d4f6cb-ab86-45a5-b067-9079d5397513",
                batch_number: "PB-202611-70ECA7",
                run_id: "run-11",
                run_number: "PR-202611-CCE9",
                period_id: "p-11",
                period_name: "November 2026",
                payment_mode: "NEFT",
                status: "SUBMITTED",
                employee_count: 6,
                held_count: 1,
                paid_count: 5,
                total_items_count: 7,
                payable_amount_paise: 75964384,
                payable_amount_formatted: "₹7,59,643.84",
                paid_amount_formatted: "₹7,39,725.84",
                outstanding_amount_formatted: "₹19,918.00",
                bank_reference_number: "HDFC-ACK-101",
                created_at: "2026-11-25T10:30:00Z",
              },
              items: { items: [], total: 7, page: 1, limit: 1 },
            },
          })
        ),
        http.get("*/api/v2/payroll/payment-batches/:id/reconciliation", () =>
          HttpResponse.json({
            success: true,
            data: {
              batch_id: "79d4f6cb-ab86-45a5-b067-9079d5397513",
              run_id: "run-11",
              paid_count: 5,
              failed_count: 0,
              pending_count: 1,
              held_count: 1,
              expected_paise: 80644384,
              paid_paise: 73972584,
              failed_paise: 0,
              held_paise: 4680000,
              processing_paise: 1991800,
              mismatch_paise: 0,
              is_reconciled: false,
            },
          })
        ),
        http.delete("*/api/v2/payroll/payment-batches/:batchId", ({ params }) => {
          deletedBatchId = String(params.batchId);
          return HttpResponse.json({
            success: true,
            data: { id: deletedBatchId, batch_number: "PB-202611-DRAFT2", deleted: true },
          });
        })
      );

      render(
        <Provider
          store={createTestStore("hr_admin", [
            "dashboard:read",
            "payroll:read",
            "reports:read",
            "exports:read",
          ])}
        >
          <PaymentBatchListPage />
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByText("PB-202611-70ECA7")).toBeInTheDocument();
      });

      expect(screen.queryByText(/Total Disbursed:/i)).not.toBeInTheDocument();
      expect(screen.getByText("80% reconciled")).toBeInTheDocument();

      // Open three-dot dropdown on SUBMITTED batch (does NOT trigger row click)
      const submittedTrigger = screen.getByTestId("batch-actions-trigger-79d4f6cb-ab86-45a5-b067-9079d5397513");
      fireEvent.pointerDown(submittedTrigger, { button: 0, ctrlKey: false });
      await waitFor(() => {
        expect(screen.getByText("Track Payment Status")).toBeInTheDocument();
        expect(screen.getByText("Reconcile Payment")).toBeInTheDocument();
      });
      expect(navigateMock).not.toHaveBeenCalled();

      // Click View Batch Details -> opens side drawer with real backend details
      fireEvent.click(screen.getByText("View Batch Details"));
      await waitFor(() => {
        expect(screen.getByText("HDFC-ACK-101")).toBeInTheDocument();
      });

      // Close drawer cleanly, then open three-dot menu on DRAFT batch and confirm Delete Draft
      fireEvent.keyDown(document, { key: "Escape" });
      const draftTrigger = screen.getByTestId("batch-actions-trigger-draft-batch-2");
      fireEvent.pointerDown(draftTrigger, { button: 0, ctrlKey: false });
      await waitFor(() => {
        expect(screen.getByText("Delete Draft Batch")).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText("Delete Draft Batch"));

      await waitFor(() => {
        expect(screen.getByText("Confirm Delete Draft Batch")).toBeInTheDocument();
      });
      fireEvent.click(screen.getByRole("button", { name: /^Delete Draft Batch$/i }));

      await waitFor(() => {
        expect(deletedBatchId).toBe("draft-batch-2");
      });
    });

    it("blocks Super Admin from viewing tenant payroll disbursement lists", () => {
      setSignedInUser("super_admin", "sa-1");
      render(
        <Provider store={createTestStore("super_admin")}>
          <PaymentBatchListPage />
        </Provider>
      );
      expect(screen.getByText("Tenant Payroll Access Restricted")).toBeInTheDocument();
    });
  });

  describe("PaymentBatchDetailPage", () => {
    it("loads read-only validation, backend reconciliation, items, and audit logs without mutating POST /validate", async () => {
      let postValidateCalled = false;

      server.use(
        http.get("*/api/v2/payroll/payment-batches/:batchId", () =>
          HttpResponse.json({
            success: true,
            data: {
              batch: {
                id: "79d4f6cb-ab86-45a5-b067-9079d5397513",
                company_name: "Test Corp",
                batch_number: "PB-202611-70ECA7",
                run_id: "run-11",
                run_number: "PR-202611-CCE9",
                period_id: "p-11",
                period_name: "November 2026",
                source_account_id: "src-1",
                source_account: {
                  id: "src-1",
                  company_id: "comp-1",
                  bank_name: "HDFC Bank",
                  account_holder_name: "Test Corp Pvt Ltd",
                  account_number_masked: "••••••••1740",
                  account_type: "current",
                  ifsc_code: "HDFC0000512",
                  supported_payment_modes: ["NEFT", "RTGS", "IMPS"],
                },
                payment_mode: "NEFT",
                status: "SUBMITTED",
                employee_count: 6,
                held_count: 1,
                paid_count: 5,
                pending_count: 1,
                failed_count: 0,
                gross_amount_paise: 80644384,
                held_amount_paise: 4680000,
                payable_amount_paise: 75964384,
                paid_amount_paise: 73972584,
                pending_amount_paise: 1991800,
                gross_amount_formatted: "₹8,06,443.84",
                held_amount_formatted: "₹46,800.00",
                payable_amount_formatted: "₹7,59,643.84",
                paid_amount_formatted: "₹7,39,725.84",
                pending_amount_formatted: "₹19,918.00",
                created_by: { id: "user-maker", name: "Payroll Maker", email: "maker@testcorp.in" },
                created_at: "2026-11-25T10:30:00Z",
              },
              items: {
                items: [
                  {
                    id: "item-1",
                    batch_id: "79d4f6cb-ab86-45a5-b067-9079d5397513",
                    employee_id: "emp-1",
                    employee_code: "EMP-101",
                    employee_name: "Ananya Verma",
                    department: "Engineering",
                    bank_name: "HDFC Bank",
                    account_number_masked: "••••5678",
                    ifsc_code: "HDFC0000512",
                    amount_paise: 13000000,
                    payable_amount_paise: 13000000,
                    status: "PAID",
                    utr_number: "UTR-991100",
                  },
                ],
                total: 1,
                page: 1,
                limit: 25,
              },
              validationSummary: { totalIssues: 0, errors: 0, warnings: 0, blockingCount: 0 },
            },
          })
        ),
        http.get("*/api/v2/payroll/payment-batches/:batchId/validation", () =>
          HttpResponse.json({
            success: true,
            data: { batch_id: "79d4f6cb-ab86-45a5-b067-9079d5397513", status: "validated", issues: [] },
          })
        ),
        http.post("*/api/v2/payroll/payment-batches/:batchId/validate", () => {
          postValidateCalled = true;
          return HttpResponse.json({ success: true, data: { issues: [] } });
        }),
        http.get("*/api/v2/payroll/payment-batches/:batchId/reconciliation", () =>
          HttpResponse.json({
            success: true,
            data: {
              batch_id: "79d4f6cb-ab86-45a5-b067-9079d5397513",
              run_id: "run-11",
              expected_paise: 80644384,
              paid_paise: 73972584,
              failed_paise: 0,
              held_paise: 4680000,
              processing_paise: 1991800,
              unmatched_paise: 0,
              mismatch_paise: 0,
              reconciliation_percentage: 97.38,
              can_reconcile: false,
              is_reconciled: false,
              summary_text: "1 employee payout awaiting confirmation.",
            },
          })
        ),
        http.get("*/api/v2/payroll/payment-batches/:batchId/bank-file", () =>
          HttpResponse.json({ success: true, data: { latest: null, files: [] } })
        ),
        http.get("*/api/v2/payroll/payment-batches/:batchId/audit-logs", () =>
          HttpResponse.json({
            success: true,
            data: [
              {
                id: "log-1",
                action: "SUBMIT",
                actor_name: "Payroll Maker",
                actor_role: "hr_admin",
                old_status: "APPROVED",
                new_status: "SUBMITTED",
                reason: "Submitted to HDFC",
                created_at: "2026-11-26T09:00:00Z",
              },
            ],
          })
        )
      );

      render(
        <Provider store={createTestStore("hr_admin")}>
          <PaymentBatchDetailPage />
        </Provider>
      );

      await waitFor(() => {
        expect(screen.getByText("Ananya Verma")).toBeInTheDocument();
      });

      expect(postValidateCalled).toBe(false);
      expect(screen.getByText("Test Corp")).toBeInTheDocument();
      expect(screen.getAllByText("PR-202611-CCE9").length).toBeGreaterThanOrEqual(1);
      expect(screen.getByText("UTR-991100")).toBeInTheDocument();
      expect(screen.getByText("••••5678 • HDFC0000512")).toBeInTheDocument();
      expect(screen.getByText("History & Audit (1)")).toBeInTheDocument();
    });
  });
});
