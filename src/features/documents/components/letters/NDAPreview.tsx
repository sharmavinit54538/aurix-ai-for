import React from "react";
import type { Company } from "@/lib/aurix-store";
import { CompanyStampAndSignature } from "./CompanyStampAndSignature";

interface NDAPreviewProps {
  company: Company | null;
  employee: { fullName?: string } | null;
  fields: Record<string, string>;
  isOfficial?: boolean;
}

export const NDAPreview: React.FC<NDAPreviewProps> = ({
  company,
  employee,
  fields,
  isOfficial = false,
}) => {
  const companyName = company?.name || "OFC360 Organization";
  const address = company?.address || company?.city ? `${company?.address || ""}, ${company?.city || ""}`.trim() : "Corporate Headquarters";
  const recipient = employee?.fullName || fields["Recipient Name"] || "Recipient Party";
  const witness = fields["Witness Name"] || "Legal Department Representative";
  const duration = fields["Duration (Years)"] || "—";

  return (
    <div className="bg-white text-slate-900 shadow-xl border border-slate-200 rounded-xl p-6 sm:p-8 relative overflow-hidden font-sans text-left space-y-5 select-none">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-30deg] select-none">
        <span className="text-5xl font-extrabold uppercase tracking-widest text-slate-900">
          {isOfficial ? "CONFIDENTIAL NDA" : "DRAFT PREVIEW"}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-4 gap-4">
        <div className="space-y-1">
          <h2 className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-900 uppercase">
            {companyName}
          </h2>
          <p className="text-[9px] text-slate-600">Address: {address}</p>
        </div>
        <div className="text-right space-y-1 shrink-0">
          <span className="inline-block bg-indigo-950 text-white text-[9px] font-bold px-2.5 py-1 rounded tracking-wider uppercase">
            NON-DISCLOSURE AGREEMENT
          </span>
          <p className="text-[9px] text-slate-500 pt-0.5">
            Date: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
          <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
            isOfficial
              ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
              : "text-amber-700 bg-amber-50 border border-amber-200"
          }`}>
            {isOfficial ? "OFFICIAL" : "DRAFT PREVIEW (NOT AN OFFICIAL DOCUMENT)"}
          </span>
        </div>
      </div>

      <div className="space-y-3 text-[11px] leading-relaxed text-slate-800">
        <p>
          This Confidentiality and Non-Disclosure Agreement is entered into between{" "}
          <strong>{companyName}</strong> and <strong>{recipient}</strong>.
        </p>
        <p>
          The parties agree that all confidential, proprietary, technical, and business information
          disclosed under this agreement shall remain protected for a period of{" "}
          <strong>{duration} years</strong> from the effective date.
        </p>
        <p>
          Witnessed by: <strong>{witness}</strong>.
        </p>
      </div>

      <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-[10px]">
        <div>
          <CompanyStampAndSignature companyName={companyName} compact={true} className="pt-0 border-t-0" />
        </div>
        <div className="space-y-2 border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6">
          <p className="font-bold text-slate-900 text-xs">Signed by Recipient / Counterparty:</p>
          <div className="h-12 flex items-center border-b border-dashed border-slate-400 w-48">
            <span className="font-serif italic text-sm text-slate-600">{recipient}</span>
          </div>
          <p className="text-xs font-semibold text-slate-800">{recipient}</p>
          <p className="text-[10px] text-slate-500">Authorized Recipient Signatory</p>
        </div>
      </div>
    </div>
  );
};
