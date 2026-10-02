import React from "react";
import { statusBadgeClass } from "@/lib/status-styles";
import type { Company } from "@/lib/aurix-store";

interface SelectedEmployeeData {
  id?: string;
  fullName?: string;
  employeeId?: string;
  department?: string;
  designation?: string;
  location?: string;
  joiningDate?: string;
  reportingManager?: string;
}

interface RelievingLetterPreviewProps {
  company: Company | null;
  employee: SelectedEmployeeData | null;
  fields: Record<string, string>;
  isOfficial?: boolean;
}

export const RelievingLetterPreview: React.FC<RelievingLetterPreviewProps> = ({
  company,
  employee,
  fields,
  isOfficial = false,
}) => {
  const companyName = company?.name || "OFC360 Organization";
  const address = company?.address || company?.city ? `${company?.address || ""}, ${company?.city || ""}`.trim() : "Corporate Headquarters";
  const contact = [company?.website, company?.email, company?.phone].filter(Boolean).join(" • ");
  const empName = employee?.fullName || "Employee";
  const empId = employee?.employeeId || "—";
  const role = fields["Role"] || employee?.designation || "—";
  const department = employee?.department || "—";
  const lastWorkingDay = fields["Last Working Day"] || "—";
  const reason = fields["Reason for Leaving"] || "Voluntary Resignation";

  return (
    <div className="bg-card text-card-foreground shadow-sm border border-border rounded-xl p-6 sm:p-8 relative overflow-hidden font-sans text-left space-y-5 select-none">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-30deg] select-none">
        <span className="text-5xl font-extrabold uppercase tracking-widest text-foreground">
          {isOfficial ? "OFFICIAL RELIEVING CERTIFICATE" : "DRAFT PREVIEW"}
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
                Human Resources Department
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
            RELIEVING LETTER
          </span>
          <p className="text-[9px] text-muted-foreground pt-0.5">
            Issue Date: {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
          </p>
          <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded uppercase border ${statusBadgeClass(isOfficial ? "approved" : "draft")}`}>
            {isOfficial ? "OFFICIAL & VERIFIED" : "DRAFT PREVIEW (NOT AN OFFICIAL DOCUMENT)"}
          </span>
        </div>
      </div>

      {/* Separation Record */}
      <div className="rounded-xl border border-border bg-muted/50 p-3.5 space-y-2">
        <h3 className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest border-b border-border pb-1">
          EMPLOYEE SEPARATION RECORD
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
          <div>
            <span className="text-[9px] text-muted-foreground block">Employee Name</span>
            <strong className="text-foreground font-bold">{empName}</strong>
          </div>
          <div>
            <span className="text-[9px] text-muted-foreground block">Employee ID</span>
            <strong className="text-foreground font-mono font-bold">{empId}</strong>
          </div>
          <div>
            <span className="text-[9px] text-muted-foreground block">Designation</span>
            <strong className="text-foreground font-bold">{role}</strong>
          </div>
          <div>
            <span className="text-[9px] text-muted-foreground block">Department</span>
            <strong className="text-foreground font-bold">{department}</strong>
          </div>
          <div>
            <span className="text-[9px] text-muted-foreground block">Office Location</span>
            <strong className="text-foreground font-bold">{employee?.location || "Corporate Office"}</strong>
          </div>
          <div>
            <span className="text-[9px] text-muted-foreground block">Date of Joining</span>
            <strong className="text-foreground font-bold">{employee?.joiningDate || "—"}</strong>
          </div>
          <div>
            <span className="text-[9px] text-muted-foreground block">Last Working Day</span>
            <strong className="text-foreground font-bold">{lastWorkingDay}</strong>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-2.5 text-[11px] leading-relaxed text-foreground">
        <p className="font-bold text-foreground">Dear {empName.split(" ")[0]},</p>
        <p>
          This is to certify that you were employed with <strong>{companyName}</strong> as a{" "}
          <strong>{role}</strong> in the <strong>{department}</strong> department from{" "}
          <strong>{employee?.joiningDate || "—"}</strong> to <strong>{lastWorkingDay}</strong>.
        </p>
        <p>
          During your tenure, you successfully fulfilled your assigned responsibilities and contributed with professionalism, competence, and dedication.
        </p>
        <p>
          Separation reason recorded: <em>{reason}</em>. Accordingly, you are hereby formally relieved from your duties and services effective from the close of business hours on{" "}
          <strong>{lastWorkingDay}</strong>.
        </p>
        <p>
          We sincerely appreciate your contributions and extend our best wishes for your future endeavors.
        </p>
      </div>

      {/* Signatory */}
      <div className="pt-4 border-t border-border flex justify-between items-end text-[10px]">
        <div>
          <p className="font-bold text-foreground">Authorized Signatory</p>
          <p className="text-muted-foreground">People Operations & Human Resources</p>
          <p className="font-semibold text-foreground">{companyName}</p>
        </div>
      </div>
    </div>
  );
};
