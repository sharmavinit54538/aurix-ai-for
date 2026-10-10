import React from "react";
import { statusBadgeClass } from "@/lib/status-styles";
import type { Company } from "@/lib/aurix-store";
import { CompanyStampAndSignature } from "./CompanyStampAndSignature";
import { formatINR, calculateSalaryBreakup, parseINR } from "../../lib/salaryConfig";

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
  const candidateName = employee?.fullName || fields["Candidate Name"] || fields["candidate_name"] || "Candidate Name";
  const role = fields["Role"] || fields["designation"] || employee?.designation || "—";
  const rawSalary = fields["annual_ctc"] || fields["ctc"] || fields["Salary (Annual CTC)"] || fields["Salary (LPA)"] || fields["Salary"] || "";
  const startDate = fields["Start Date"] || fields["joining_date"] || fields["effective_date"] || "—";

  const breakup = calculateSalaryBreakup(rawSalary);
  const formattedCtc = breakup ? `₹${formatINR(breakup.annualCtc)} per annum` : rawSalary ? `INR ${rawSalary}` : "—";

  return (
    <div className="bg-card text-card-foreground shadow-sm border border-border rounded-xl p-6 sm:p-8 relative overflow-hidden font-sans text-left space-y-5 select-none">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-30deg] select-none">
        <span className="text-5xl font-extrabold uppercase tracking-widest text-foreground">
          {isOfficial ? "OFFICIAL OFFER LETTER" : "DRAFT PREVIEW"}
        </span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-border pb-4 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              {companyName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-extrabold tracking-wider text-foreground uppercase">
                {companyName}
              </h2>
              <p className="text-[9px] text-muted-foreground font-semibold uppercase tracking-wider">
                Talent Acquisition & People Operations
              </p>
            </div>
          </div>
          <div className="text-[9px] text-muted-foreground leading-relaxed pt-1 space-y-0.5">
            <p><strong>Registered Address:</strong> {address}</p>
            {contact && <p>{contact}</p>}
          </div>
        </div>
        <div className="text-right space-y-1 shrink-0">
          <span className="inline-block bg-primary text-primary-foreground text-[9px] font-bold px-2.5 py-1 rounded tracking-wider uppercase">
            EMPLOYMENT OFFER
          </span>
          <p className="text-[9px] text-muted-foreground pt-0.5">
            Date: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
          <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded uppercase border ${statusBadgeClass(isOfficial ? "approved" : "draft")}`}>
            {isOfficial ? "OFFICIAL & VERIFIED" : "DRAFT PREVIEW (NOT AN OFFICIAL DOCUMENT)"}
          </span>
        </div>
      </div>

      {/* Offer Summary Grid */}
      <div className="rounded-xl border border-border bg-muted/50 p-3.5 space-y-2">
        <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-1">
          EMPLOYMENT OFFER SUMMARY
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-[11px]">
          <div>
            <span className="text-[9px] text-muted-foreground block">Candidate Name</span>
            <strong className="text-foreground font-bold">{candidateName}</strong>
          </div>
          <div>
            <span className="text-[9px] text-muted-foreground block">Offered Position</span>
            <strong className="text-foreground font-bold">{role}</strong>
          </div>
          <div>
            <span className="text-[9px] text-muted-foreground block">Annual Compensation</span>
            <strong className="text-foreground font-bold">{formattedCtc}</strong>
          </div>
          <div>
            <span className="text-[9px] text-muted-foreground block">Start Date</span>
            <strong className="text-foreground font-bold">{startDate}</strong>
          </div>
          <div>
            <span className="text-[9px] text-muted-foreground block">Work Location</span>
            <strong className="text-foreground font-bold">{employee?.location || "Corporate Headquarters"}</strong>
          </div>
          <div>
            <span className="text-[9px] text-muted-foreground block">Department</span>
            <strong className="text-foreground font-bold">{employee?.department || "General"}</strong>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-2.5 text-[11px] leading-relaxed text-foreground">
        <p className="font-bold text-foreground">Dear {candidateName.split(" ")[0]},</p>
        <p>
          We are pleased to extend an offer of employment for the position of <strong>{role}</strong> at{" "}
          <strong>{companyName}</strong>. We were very impressed with your skills and background and believe
          you will make significant contributions to our team.
        </p>
        <p>
          Your starting annualized compensation will be <strong>{formattedCtc}</strong>, subject to statutory
          deductions. Your anticipated start date will be <strong>{startDate}</strong>.
        </p>
        <p>
          This offer is contingent upon successful completion of background checks, reference verifications,
          and receipt of required educational and identification documentation.
        </p>
      </div>

      {/* Salary Breakup Annexure */}
      {breakup && (
        <div className="rounded-xl border border-border bg-card p-3.5 space-y-2 text-[11px]">
          <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-1">
            ANNEXURE A — ITEMISED SALARY BREAKUP
          </h3>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-[10px] text-muted-foreground">
                <th className="py-1">Salary Component</th>
                <th className="py-1 text-right">Monthly (₹)</th>
                <th className="py-1 text-right">Annual (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50 text-[11px]">
              <tr>
                <td className="py-1 font-medium">Basic Salary (40%)</td>
                <td className="py-1 text-right font-mono">₹{formatINR(breakup.basicMonthly)}</td>
                <td className="py-1 text-right font-mono">₹{formatINR(breakup.basicAnnual)}</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">House Rent Allowance (HRA - 50% of Basic)</td>
                <td className="py-1 text-right font-mono">₹{formatINR(breakup.hraMonthly)}</td>
                <td className="py-1 text-right font-mono">₹{formatINR(breakup.hraAnnual)}</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Special Allowance</td>
                <td className="py-1 text-right font-mono">₹{formatINR(breakup.specialAllowanceMonthly)}</td>
                <td className="py-1 text-right font-mono">₹{formatINR(breakup.specialAllowanceAnnual)}</td>
              </tr>
              <tr className="bg-muted/30 font-semibold">
                <td className="py-1">Gross Compensation (A)</td>
                <td className="py-1 text-right font-mono">₹{formatINR(breakup.grossMonthly)}</td>
                <td className="py-1 text-right font-mono">₹{formatINR(breakup.grossAnnual)}</td>
              </tr>
              <tr>
                <td className="py-1 font-medium">Employer Provident Fund (PF - 12% of Basic) (B)</td>
                <td className="py-1 text-right font-mono">₹{formatINR(breakup.employerPfMonthly)}</td>
                <td className="py-1 text-right font-mono">₹{formatINR(breakup.employerPfAnnual)}</td>
              </tr>
              <tr className="border-t-2 border-border bg-primary/5 font-bold text-foreground">
                <td className="py-1.5">Total Cost to Company (CTC = A + B)</td>
                <td className="py-1.5 text-right font-mono text-primary">₹{formatINR(breakup.monthlyCtc)}</td>
                <td className="py-1.5 text-right font-mono text-primary">₹{formatINR(breakup.annualCtc)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Official Signatory & Company Stamp */}
      <CompanyStampAndSignature
        companyName={companyName}
        date={startDate !== "—" ? startDate : undefined}
        className="mt-6"
      />
    </div>
  );
};
