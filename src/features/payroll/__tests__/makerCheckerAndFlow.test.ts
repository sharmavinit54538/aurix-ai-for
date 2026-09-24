import { describe, it, expect, vi } from "vitest";
import { http, HttpResponse } from "msw";
import { server } from "@/test/setup";
import { paymentApi } from "../api/paymentApi";
import { IfscCodeSchema } from "../types/payment";

describe("Payment Flow, Maker-Checker & Resilience Tests", () => {
  describe("IFSC Format Validation", () => {
    it("accepts valid RBI format IFSC codes (4 letters, 0, 6 alphanumeric)", () => {
      expect(IfscCodeSchema.safeParse("HDFC0000060").success).toBe(true);
      expect(IfscCodeSchema.safeParse("SBIN0001234").success).toBe(true);
      expect(IfscCodeSchema.safeParse("ICIC0000102").success).toBe(true);
      expect(IfscCodeSchema.safeParse("UTIB0000456").success).toBe(true);
    });

    it("rejects invalid IFSC formats", () => {
      // 5th character not 0
      expect(IfscCodeSchema.safeParse("HDFC1000060").success).toBe(false);
      // Too short
      expect(IfscCodeSchema.safeParse("HDFC0123").success).toBe(false);
      // Too long
      expect(IfscCodeSchema.safeParse("HDFC0000060123").success).toBe(false);
      // Lowercase
      expect(IfscCodeSchema.safeParse("hdfc0000060").success).toBe(false);
    });
  });

  describe("API Client Error Handling (MSW Mocks)", () => {
    const runId = "test-run-123";
    const batchId = "test-batch-456";

    it("handles 400 Bad Request", async () => {
      server.use(
        http.post("*/api/v2/payroll/runs/:runId/payment-batches", () => {
          return HttpResponse.json(
            { success: false, message: "Mandatory hold reason missing" },
            { status: 400 }
          );
        })
      );

      await expect(
        paymentApi.createPaymentBatch(runId, {
          sourceAccountId: "acc-1",
          paymentMode: "NEFT",
        })
      ).rejects.toThrow();
    });

    it("handles 401 Unauthorized", async () => {
      server.use(
        http.get("*/api/v2/payroll/payment-batches/:batchId", () => {
          return new HttpResponse(null, { status: 401 });
        })
      );

      await expect(paymentApi.getPaymentBatch(batchId)).rejects.toThrow();
    });

    it("handles 403 Maker-Checker Violation", async () => {
      server.use(
        http.post("*/api/v2/payroll/payment-batches/:batchId/approve", () => {
          return HttpResponse.json(
            { success: false, message: "The batch creator cannot approve this batch." },
            { status: 403 }
          );
        })
      );

      try {
        await paymentApi.approvePaymentBatch(batchId, { remarks: "Self approve attempt" });
        expect.unreachable("Should have thrown 403 error");
      } catch (err: any) {
        expect(err.response.status).toBe(403);
        expect(err.response.data.message).toBe("The batch creator cannot approve this batch.");
      }
    });

    it("handles 404 Service Unavailable / Route Missing", async () => {
      server.use(
        http.get("*/api/v2/payroll/payment-batches", () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      await expect(paymentApi.getPaymentBatches()).rejects.toThrow();
    });

    it("handles 409 Conflict (e.g. Run not finalized or batch already reconciled)", async () => {
      server.use(
        http.post("*/api/v2/payroll/payment-batches/:batchId/reconcile", () => {
          return HttpResponse.json(
            { success: false, message: "Paise mismatch detected. Run cannot be reconciled." },
            { status: 409 }
          );
        })
      );

      try {
        await paymentApi.reconcilePaymentBatch(batchId);
        expect.unreachable("Should have thrown 409");
      } catch (err: any) {
        expect(err.response.status).toBe(409);
        expect(err.response.data.message).toContain("Paise mismatch");
      }
    });

    it("handles 422 Unprocessable Entity", async () => {
      server.use(
        http.post("*/api/v2/payroll/payment-batches/:batchId/validate", () => {
          return HttpResponse.json(
            { success: false, message: "Unprocessable line items" },
            { status: 422 }
          );
        })
      );

      await expect(paymentApi.validatePaymentBatch(batchId)).rejects.toThrow();
    });

    it("handles 500 Internal Server Error", async () => {
      server.use(
        http.post("*/api/v2/payroll/payment-batches/:batchId/bank-file", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(
        paymentApi.generateBankFile(batchId, { format: "HDFC_CSV" })
      ).rejects.toThrow();
    });

    it("handles 501 Not Implemented (Backend Pending)", async () => {
      server.use(
        http.get("*/api/v2/payroll/runs/:runId/payment-batches", () => {
          return new HttpResponse(null, { status: 501 });
        })
      );

      try {
        await paymentApi.getPaymentBatchesForRun(runId);
        expect.unreachable("Should have thrown 501");
      } catch (err: any) {
        expect(err.response.status).toBe(501);
      }
    });

    it("handles Network Errors gracefully", async () => {
      server.use(
        http.post("*/api/v2/payroll/payment-batches/:batchId/submit", () => {
          return HttpResponse.error();
        })
      );

      await expect(
        paymentApi.submitPaymentBatch(batchId, {
          bankReferenceNumber: "HDFC-1234",
          submissionDate: new Date().toISOString(),
        })
      ).rejects.toThrow();
    });
  });

  describe("Idempotency Enforcement in API Calls", () => {
    it("attaches Idempotency-Key header on state-changing mutations", async () => {
      let capturedIdempotencyHeader: string | null = null;

      server.use(
        http.post("*/api/v2/payroll/runs/:runId/payment-batches", ({ request }) => {
          capturedIdempotencyHeader = request.headers.get("Idempotency-Key");
          return HttpResponse.json({
            success: true,
            data: {
              id: "batch-1",
              batchNumber: "PAY-2026-B1",
              runId: "run-1",
              periodId: "p-1",
              periodName: "Sep 2026",
              sourceAccountId: "acc-1",
              paymentMode: "NEFT",
              status: "draft",
              employeeCount: 10,
              grossAmountPaise: 10000000,
              netAmountPaise: 9000000,
              heldAmountPaise: 0,
              payableAmountPaise: 9000000,
              grossAmountFormatted: "₹1,00,000.00",
              netAmountFormatted: "₹90,000.00",
              heldAmountFormatted: "₹0.00",
              payableAmountFormatted: "₹90,000.00",
              createdBy: { id: "u-1", name: "User 1", email: "u1@test.com" },
              createdAt: new Date().toISOString(),
            },
          });
        })
      );

      await paymentApi.createPaymentBatch("run-1", {
        sourceAccountId: "acc-1",
        paymentMode: "NEFT",
      });

      expect(capturedIdempotencyHeader).toBeDefined();
      expect(capturedIdempotencyHeader).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });
  });
});
