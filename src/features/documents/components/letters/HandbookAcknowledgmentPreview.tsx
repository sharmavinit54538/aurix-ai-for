import React from "react";
import type { Company } from "@/lib/aurix-store";

interface HandbookAcknowledgmentPreviewProps {
  company: Company | null;
  employee: { fullName?: string; employeeId?: string; designation?: string } | null;
  fields: Record<string, string>;
  isOfficial?: boolean;
}

export const HandbookAcknowledgmentPreview: React.FC<HandbookAcknowledgmentPreviewProps> = ({
  company,
  employee,
  fields,
  isOfficial = false,
}) => {
  const companyName = company?.name || "OFC360 Organization";
  const employeeName = employee?.fullName || "Employee Name";
  const designation = fields["Signee Designation"] || employee?.designation || "Employee";
  const versionDate = fields["Version Date"] || new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white text-slate-900 shadow-xl border border-slate-200 rounded-xl p-6 sm:p-8 relative overflow-hidden font-sans text-left space-y-5 select-none">
      <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
        <div>
          <h2 className="text-xs sm:text-sm font-extrabold uppercase">{companyName}</h2>
          <p className="text-[10px] text-slate-500">Corporate Governance & Compliance Policy</p>
        </div>
        <span className={`text-[8px] font-bold px-2 py-0.5 rounded uppercase ${
          isOfficial ? "text-emerald-700 bg-emerald-50" : "text-amber-700 bg-amber-50"
        }`}>
          {isOfficial ? "OFFICIAL ACKNOWLEDGMENT" : "DRAFT PREVIEW (NOT AN OFFICIAL DOCUMENT)"}
        </span>
      </div>

      <div className="space-y-3 text-[11px] leading-relaxed text-slate-800">
        <p className="font-bold text-slate-900">
          COMPANY HANDBOOK & CODE OF CONDUCT ACKNOWLEDGMENT
        </p>
        <p>
          I, <strong>{employeeName}</strong>, holding the position of <strong>{designation}</strong>,
          hereby acknowledge that I have received access to, reviewed, and agreed to adhere to the
          standards, policies, and ethics described in the {companyName} Corporate Handbook.
        </p>
        <p>
          Handbook Version Date: <strong>{versionDate}</strong>
        </p>
      </div>

      <div className="pt-6 border-t border-slate-200 text-[10px] space-y-1">
        <p className="font-bold text-slate-900">Electronically Acknowledged</p>
        <p className="text-slate-500">Employee Signature: {employeeName}</p>
        <p className="text-slate-400">Date: {new Date().toLocaleDateString("en-IN")}</p>
      </div>
    </div>
  );
};
