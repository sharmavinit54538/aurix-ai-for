import React from "react";
import type { Company } from "@/lib/aurix-store";

interface SelectedEmployeeData {
  id?: string;
  fullName?: string;
  employeeId?: string;
  department?: string;
  designation?: string;
  location?: string;
  joiningDate?: string;
}

interface OfferLetterPreviewProps {
  company: Company | null;
  employee: SelectedEmployeeData | null;
  fields: Record<string, string>;
  isOfficial?: boolean;
}

export const OfferLetterPreview: React.FC<OfferLetterPreviewProps> = ({
  company,
  employee,
  fields,
  isOfficial = false,
}) => {
  const companyName = company?.name || "OFC360 Organization";
  const address = company?.address || company?.city ? `${company?.address || ""}, ${company?.city || ""}`.trim() : "Corporate Headquarters";
  const contact = [company?.website, company?.email, company?.phone].filter(Boolean).join(" • ");
  const candidateName = employee?.fullName || fields["Candidate Name"] || "Candidate Name";
  const role = fields["Role"] || employee?.designation || "—";
  const salary = fields["Salary (LPA)"] || "—";
  const startDate = fields["Start Date"] || "—";

  return (
    <div className="bg-white text-slate-900 shadow-xl border border-slate-200 rounded-xl p-6 sm:p-8 relative overflow-hidden font-sans text-left space-y-5 select-none">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-30deg] select-none">
        <span className="text-5xl font-extrabold uppercase tracking-widest text-slate-900">
          {isOfficial ? "OFFICIAL OFFER LETTER" : "DRAFT PREVIEW"}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-slate-900 pb-4 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-950 flex items-center justify-center text-white font-bold text-sm">
              {companyName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-extrabold tracking-wider text-slate-900 uppercase">
                {companyName}
              </h2>
              <p className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">
                Talent Acquisition & People Operations
              </p>
            </div>
          </div>
          <div className="text-[9px] text-slate-600 leading-relaxed pt-1 space-y-0.5">
            <p><strong>Registered Address:</strong> {address}</p>
            {contact && <p>{contact}</p>}
          </div>
        </div>
        <div className="text-right space-y-1 shrink-0">
          <span className="inline-block bg-indigo-950 text-white text-[9px] font-bold px-2.5 py-1 rounded tracking-wider uppercase">
            EMPLOYMENT OFFER
          </span>
          <p className="text-[9px] text-slate-500 pt-0.5">
            Date: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
          <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
            isOfficial
              ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
              : "text-amber-700 bg-amber-50 border border-amber-200"
          }`}>
            {isOfficial ? "OFFICIAL & VERIFIED" : "DRAFT PREVIEW (NOT AN OFFICIAL DOCUMENT)"}
          </span>
        </div>
      </div>

      {/* Offer Summary Grid */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-2">
        <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-1">
          EMPLOYMENT OFFER SUMMARY
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
          <div>
            <span className="text-[9px] text-slate-500 block">Candidate Name</span>
            <strong className="text-slate-900 font-bold">{candidateName}</strong>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block">Offered Position</span>
            <strong className="text-indigo-950 font-bold">{role}</strong>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block">Annual Compensation</span>
            <strong className="text-emerald-700 font-bold">
              {salary !== "—" ? `INR ${salary} Lakhs per annum` : "—"}
            </strong>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block">Start Date</span>
            <strong className="text-slate-900 font-bold">{startDate}</strong>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block">Work Location</span>
            <strong className="text-slate-900 font-bold">{employee?.location || "Corporate Headquarters"}</strong>
          </div>
          <div>
            <span className="text-[9px] text-slate-500 block">Department</span>
            <strong className="text-slate-900 font-bold">{employee?.department || "General"}</strong>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-2.5 text-[11px] leading-relaxed text-slate-800">
        <p className="font-bold text-slate-900">Dear {candidateName.split(" ")[0]},</p>
        <p>
          We are pleased to extend an offer of employment for the position of <strong>{role}</strong> at{" "}
          <strong>{companyName}</strong>. We were very impressed with your skills and background and believe
          you will make significant contributions to our team.
        </p>
        <p>
          Your starting annualized compensation will be <strong>INR {salary} Lakhs</strong>, subject to statutory
          deductions. Your anticipated start date will be <strong>{startDate}</strong>.
        </p>
        <p>
          This offer is contingent upon successful completion of background checks, reference verifications,
          and receipt of required educational and identification documentation.
        </p>
      </div>

      {/* Signatory */}
      <div className="pt-4 border-t border-slate-200 flex justify-between items-end text-[10px]">
        <div>
          <p className="font-bold text-slate-900">Authorized Signatory</p>
          <p className="text-slate-500">People Operations Team</p>
          <p className="font-semibold text-slate-700">{companyName}</p>
        </div>
      </div>
    </div>
  );
};
