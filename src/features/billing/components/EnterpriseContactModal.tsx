import React, { useState } from "react";
import { X, Building2, Mail, Phone, CheckCircle2, Copy, Check } from "lucide-react";
import { validateEnterpriseEnquiry } from "../utils/pricingCalculator";
import type { EnterpriseEnquiryFormInput } from "../types/billingTypes";

/**
 * Verified OFC360 Sales contact details configured in `/src/routes/contact.tsx`.
 * No dedicated backend POST endpoint exists for enterprise sales leads in `/openapi.json`,
 * so we provide a transparent, honest email/contact handoff after full validation.
 */
export const OFC360_SALES_EMAIL = "sales@ofc360.com";
export const OFC360_SALES_PHONE = "+1 (415) 555-0142";

export interface EnterpriseContactModalProps {
  isOpen: boolean;
  initialEmployeeCount: number;
  initialCompanyName?: string;
  initialContactName?: string;
  initialEmail?: string;
  onClose: () => void;
}

export const EnterpriseContactModal: React.FC<EnterpriseContactModalProps> = ({
  isOpen,
  initialEmployeeCount,
  initialCompanyName = "",
  initialContactName = "",
  initialEmail = "",
  onClose,
}) => {
  const [form, setForm] = useState<EnterpriseEnquiryFormInput>({
    contactName: initialContactName,
    businessEmail: initialEmail,
    companyName: initialCompanyName,
    employeeCount: String(Math.max(100, initialEmployeeCount)),
    phoneNumber: "",
    requirements: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof EnterpriseEnquiryFormInput, string>>
  >({});
  const [handoffReady, setHandoffReady] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleFieldChange = (
    field: keyof EnterpriseEnquiryFormInput,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (handoffReady) {
      setHandoffReady(false);
    }
  };

  const buildMailtoHref = (): string => {
    const subject = encodeURIComponent(
      `OFC360 Enterprise Contract Enquiry — ${form.companyName.trim()} (${form.employeeCount.trim()} Employees)`
    );
    const body = encodeURIComponent(
      [
        `Organization: ${form.companyName.trim()}`,
        `Contact Name: ${form.contactName.trim()}`,
        `Business Email: ${form.businessEmail.trim()}`,
        `Phone Number: ${form.phoneNumber.trim()}`,
        `Target Employee Headcount: ${form.employeeCount.trim()}`,
        `Plan Interest: Enterprise (₹9,999+/month Custom Contract)`,
        ``,
        `Requirements & Deployment Notes:`,
        form.requirements.trim(),
      ].join("\n")
    );
    return `mailto:${OFC360_SALES_EMAIL}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateEnterpriseEnquiry(form);
    if (!validation.valid) {
      setErrors(validation.errors);
      setHandoffReady(false);
      return;
    }
    setErrors({});
    setHandoffReady(true);
  };

  const handleCopyBrief = async () => {
    const summaryText = [
      `To: ${OFC360_SALES_EMAIL}`,
      `Company: ${form.companyName.trim()}`,
      `Contact: ${form.contactName.trim()} (${form.businessEmail.trim()}, ${form.phoneNumber.trim()})`,
      `Employees: ${form.employeeCount.trim()}`,
      `Requirements: ${form.requirements.trim()}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="enterprise-modal-title"
      data-testid="enterprise-contact-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-xl rounded-2xl border border-slate-800 bg-[#111520] p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/15 text-indigo-300">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="enterprise-modal-title"
                className="text-lg font-bold text-slate-100"
              >
                Enterprise Contract Enquiry
              </h2>
              <p className="text-xs text-slate-400">
                Starting at ₹9,999+/month · Custom employee limits & SLA contract
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close enterprise enquiry modal"
            className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:text-slate-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="ent-contact-name"
                className="block text-xs font-medium text-slate-300 mb-1"
              >
                Contact Name *
              </label>
              <input
                id="ent-contact-name"
                data-testid="ent-contact-name"
                type="text"
                value={form.contactName}
                onChange={(e) => handleFieldChange("contactName", e.target.value)}
                placeholder="Aarav Sharma"
                className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
              />
              {errors.contactName && (
                <p className="mt-1 text-xs text-rose-400">{errors.contactName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="ent-business-email"
                className="block text-xs font-medium text-slate-300 mb-1"
              >
                Business Email *
              </label>
              <input
                id="ent-business-email"
                data-testid="ent-business-email"
                type="email"
                value={form.businessEmail}
                onChange={(e) => handleFieldChange("businessEmail", e.target.value)}
                placeholder="aarav@company.com"
                className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
              />
              {errors.businessEmail && (
                <p className="mt-1 text-xs text-rose-400">{errors.businessEmail}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="ent-company-name"
                className="block text-xs font-medium text-slate-300 mb-1"
              >
                Company Name *
              </label>
              <input
                id="ent-company-name"
                data-testid="ent-company-name"
                type="text"
                value={form.companyName}
                onChange={(e) => handleFieldChange("companyName", e.target.value)}
                placeholder="Apex Global Pvt Ltd"
                className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
              />
              {errors.companyName && (
                <p className="mt-1 text-xs text-rose-400">{errors.companyName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="ent-employee-count"
                className="block text-xs font-medium text-slate-300 mb-1"
              >
                Employee Count *
              </label>
              <input
                id="ent-employee-count"
                data-testid="ent-employee-count"
                type="text"
                inputMode="numeric"
                value={form.employeeCount}
                onChange={(e) => handleFieldChange("employeeCount", e.target.value)}
                placeholder="250"
                className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-3 py-2 text-sm tabular-nums text-slate-100 outline-none focus:border-indigo-500"
              />
              {errors.employeeCount && (
                <p className="mt-1 text-xs text-rose-400">{errors.employeeCount}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="ent-phone"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              Phone Number *
            </label>
            <input
              id="ent-phone"
              data-testid="ent-phone"
              type="tel"
              value={form.phoneNumber}
              onChange={(e) => handleFieldChange("phoneNumber", e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-xs text-rose-400">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="ent-requirements"
              className="block text-xs font-medium text-slate-300 mb-1"
            >
              Requirements & Custom Contract Scope *
            </label>
            <textarea
              id="ent-requirements"
              data-testid="ent-requirements"
              rows={3}
              value={form.requirements}
              onChange={(e) => handleFieldChange("requirements", e.target.value)}
              placeholder="Describe multi-entity payroll, custom approval workflows, SSO, or dedicated SLA requirements..."
              className="w-full rounded-lg border border-slate-700/80 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-500"
            />
            {errors.requirements && (
              <p className="mt-1 text-xs text-rose-400">{errors.requirements}</p>
            )}
          </div>

          {!handoffReady ? (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                type="submit"
                data-testid="ent-prepare-enquiry-btn"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 whitespace-nowrap"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Prepare Direct Sales Handoff</span>
              </button>
            </div>
          ) : (
            <div
              data-testid="ent-handoff-panel"
              className="rounded-xl border border-indigo-500/40 bg-indigo-950/30 p-4 space-y-3"
            >
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
                <div className="text-xs text-slate-200 space-y-1">
                  <p className="font-semibold text-white">
                    Direct Enterprise Sales Handoff Ready
                  </p>
                  <p className="text-slate-300">
                    Send your validated contract brief directly to the OFC360 Enterprise Desk at{" "}
                    <strong className="text-indigo-300">{OFC360_SALES_EMAIL}</strong> or call{" "}
                    <strong className="text-indigo-300">{OFC360_SALES_PHONE}</strong>.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <a
                  href={buildMailtoHref()}
                  data-testid="ent-mailto-link"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 whitespace-nowrap"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>Open Email to {OFC360_SALES_EMAIL}</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyBrief}
                  data-testid="ent-copy-brief-btn"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-800 whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-400" />
                      <span>Copied Brief</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Enquiry Summary</span>
                    </>
                  )}
                </button>

                <a
                  href={`tel:${OFC360_SALES_PHONE.replace(/[^\d+]/g, "")}`}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white whitespace-nowrap"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>{OFC360_SALES_PHONE}</span>
                </a>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
