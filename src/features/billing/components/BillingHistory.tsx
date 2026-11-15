import React from "react";
import { FileText, Download, Receipt, ExternalLink } from "lucide-react";
import { formatINR } from "../utils/pricingCalculator";
import type {
  BillingInvoiceRecord,
  PaymentHistoryRecord,
} from "../types/billingTypes";

export interface BillingHistoryProps {
  paymentHistory: PaymentHistoryRecord[];
  invoices: BillingInvoiceRecord[];
  isLoading: boolean;
  historyError: string | null;
  invoicesError: string | null;
  onInspectPayment?: (paymentId: string) => void;
}

export const BillingHistory: React.FC<BillingHistoryProps> = ({
  paymentHistory,
  invoices,
  isLoading,
  historyError,
  invoicesError,
  onInspectPayment,
}) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Payment Transactions History (`GET /api/v1/payments/history`) */}
      <section
        aria-labelledby="payment-history-heading"
        data-testid="payment-history-section"
        className="rounded-2xl border border-slate-800/90 bg-[#111520] p-5 sm:p-6 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-indigo-400" aria-hidden="true" />
            <h3
              id="payment-history-heading"
              className="text-base font-bold text-slate-100"
            >
              Payment Transaction History
            </h3>
          </div>
          <span className="text-xs text-slate-400 tabular-nums">
            {paymentHistory.length} records
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-lg bg-slate-900/70"
              />
            ))}
          </div>
        ) : historyError || paymentHistory.length === 0 ? (
          <div
            data-testid="payment-history-empty"
            className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-6 text-center text-xs text-slate-400"
          >
            No payment transactions recorded for this organization yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2.5 font-medium">Payment / Order ID</th>
                  <th className="pb-2.5 font-medium">Plan & Seats</th>
                  <th className="pb-2.5 font-medium">Amount</th>
                  <th className="pb-2.5 font-medium">Status</th>
                  <th className="pb-2.5 text-right font-medium">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {paymentHistory.map((item) => {
                  const paymentId = item.payment_id || item.id;
                  const statusLower = String(item.status || "").toLowerCase();
                  const isSuccess =
                    statusLower === "captured" ||
                    statusLower === "paid" ||
                    statusLower === "verified" ||
                    statusLower === "success";

                  return (
                    <tr key={item.id || paymentId} className="text-slate-200">
                      <td className="py-3 pr-2 font-mono text-[11px]">
                        <div>{paymentId}</div>
                        {item.order_id && (
                          <div className="text-slate-500">{item.order_id}</div>
                        )}
                      </td>
                      <td className="py-3 pr-2">
                        <div className="font-medium">
                          {item.plan_name || "Subscription"}
                        </div>
                        {item.employee_count && (
                          <div className="text-[11px] text-slate-400 tabular-nums">
                            {item.employee_count} employees
                          </div>
                        )}
                      </td>
                      <td className="py-3 pr-2 font-semibold tabular-nums">
                        {formatINR(item.amount)}
                      </td>
                      <td className="py-3 pr-2">
                        <span
                          className={`inline-flex rounded px-2 py-0.5 text-[11px] font-semibold capitalize ${
                            isSuccess
                              ? "bg-emerald-500/15 text-emerald-300"
                              : "bg-amber-500/15 text-amber-300"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {onInspectPayment && paymentId ? (
                          <button
                            type="button"
                            onClick={() => onInspectPayment(paymentId)}
                            className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-900 px-2 py-1 text-[11px] font-medium text-slate-200 hover:bg-slate-800 whitespace-nowrap"
                          >
                            <span>Verify</span>
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        ) : (
                          <span className="text-slate-500">
                            {item.payment_date || item.created_at || "—"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Billing Invoices (`GET /api/v1/billing/invoices`) */}
      <section
        aria-labelledby="billing-invoices-heading"
        data-testid="billing-invoices-section"
        className="rounded-2xl border border-slate-800/90 bg-[#111520] p-5 sm:p-6 shadow-sm space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-indigo-400" aria-hidden="true" />
            <h3
              id="billing-invoices-heading"
              className="text-base font-bold text-slate-100"
            >
              GST & Subscription Invoices
            </h3>
          </div>
          <span className="text-xs text-slate-400 tabular-nums">
            {invoices.length} invoices
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-2.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-12 animate-pulse rounded-lg bg-slate-900/70"
              />
            ))}
          </div>
        ) : invoicesError || invoices.length === 0 ? (
          <div
            data-testid="billing-invoices-empty"
            className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-6 text-center text-xs text-slate-400"
          >
            No billing invoices available yet. Invoices appear automatically once a payment order is verified.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2.5 font-medium">Invoice #</th>
                  <th className="pb-2.5 font-medium">Date</th>
                  <th className="pb-2.5 font-medium">Amount</th>
                  <th className="pb-2.5 font-medium">Status</th>
                  <th className="pb-2.5 text-right font-medium">Document</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {invoices.map((inv) => {
                  const downloadHref = inv.pdf_url || inv.download_url;
                  return (
                    <tr key={inv.id || inv.invoice_number} className="text-slate-200">
                      <td className="py-3 pr-2 font-mono text-[11px] font-semibold">
                        {inv.invoice_number || inv.id}
                      </td>
                      <td className="py-3 pr-2 text-slate-400 tabular-nums">
                        {inv.date || "—"}
                      </td>
                      <td className="py-3 pr-2 font-semibold tabular-nums">
                        {formatINR(inv.amount)}
                      </td>
                      <td className="py-3 pr-2">
                        <span className="inline-flex rounded bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold capitalize text-emerald-300">
                          {inv.status || "Paid"}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {downloadHref ? (
                          <a
                            href={downloadHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-indigo-300 hover:bg-slate-800 whitespace-nowrap"
                          >
                            <Download className="h-3 w-3" />
                            <span>PDF</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-500">
                            Issued by server
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
