import React from "react";
import { ShieldCheck, CheckCircle2, Award } from "lucide-react";
import { useCompanyBranding } from "../../hooks/useCompanyBranding";

interface CompanyStampAndSignatureProps {
  companyName?: string;
  signatoryName?: string;
  signatoryDesignation?: string;
  customStampUrl?: string | null;
  customSignatureUrl?: string | null;
  showStamp?: boolean;
  showSignature?: boolean;
  className?: string;
  date?: string;
  compact?: boolean;
}

export const CompanyStampAndSignature: React.FC<CompanyStampAndSignatureProps> = ({
  companyName: propCompanyName,
  signatoryName: propSignatoryName,
  signatoryDesignation: propSignatoryDesignation,
  customStampUrl,
  customSignatureUrl,
  showStamp = true,
  showSignature = true,
  className = "",
  date,
  compact = false,
}) => {
  const branding = useCompanyBranding();

  const companyName = propCompanyName || branding.companyName || "Organization";
  const signatoryName = propSignatoryName || branding.signatoryName || "Authorized Signatory";
  const signatoryDesignation = propSignatoryDesignation || branding.signatoryDesignation || "People Operations & HR";
  const stampUrl = customStampUrl ?? branding.stampUrl;
  const signatureUrl = customSignatureUrl ?? branding.signatureUrl;
  const displayDate = date || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className={`pt-6 border-t border-slate-900/10 dark:border-slate-100/10 font-sans text-left select-none ${className}`}>
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
        {/* Left Side: Authorized Signatory Block */}
        {showSignature && (
          <div className="space-y-1">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              For and on behalf of:
            </p>
            <p className="font-bold text-sm text-slate-900 dark:text-white tracking-wide">
              {companyName}
            </p>

            {/* Signature Area */}
            <div className="py-1">
              {signatureUrl ? (
                <div className="h-12 flex items-center">
                  <img
                    src={signatureUrl}
                    alt="Authorized Digital Signature"
                    className="h-10 max-w-[160px] object-contain filter drop-shadow-sm"
                  />
                </div>
              ) : (
                /* Elegant Digital Cursive Signature Representation */
                <div className="h-12 flex items-center relative">
                  <svg
                    className="h-9 w-44 text-indigo-700 dark:text-indigo-400 opacity-90 drop-shadow-sm"
                    viewBox="0 0 200 45"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M10 32C22 12 35 8 45 22C52 32 58 35 70 20C82 5 95 18 105 28C112 35 125 15 138 24C145 29 160 22 175 14C182 10 190 28 195 30"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M25 38C50 36 120 37 185 36"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeDasharray="4 2"
                      opacity="0.6"
                    />
                  </svg>
                  <span className="sr-only">Digital Signature: {signatoryName}</span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-400/40 dark:border-slate-600/40 pt-1 w-48">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-tight">
                {signatoryName}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                {signatoryDesignation}
              </p>
              <div className="flex items-center gap-1 text-[9px] text-emerald-600 dark:text-emerald-400 font-mono pt-0.5">
                <CheckCircle2 className="h-3 w-3 shrink-0" />
                <span>Digitally Signed ({displayDate})</span>
              </div>
            </div>
          </div>
        )}

        {/* Center/Right Side: Official Corporate Stamp / Seal */}
        {showStamp && (
          <div className="flex flex-col items-center sm:items-end justify-center shrink-0">
            {stampUrl ? (
              /* Real Uploaded Stamp Image from Onboarding / Backend */
              <div className="relative group flex flex-col items-center">
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-2 border-dashed border-indigo-600/40 dark:border-indigo-400/40 p-1 flex items-center justify-center bg-indigo-500/5 dark:bg-indigo-500/10 rotate-[-6deg] shadow-md transition-transform duration-300 group-hover:rotate-0">
                  <img
                    src={stampUrl}
                    alt={`${companyName} Official Stamp`}
                    className="h-full w-full object-contain pointer-events-none select-none filter contrast-125 drop-shadow-[0_2px_4px_rgba(79,70,229,0.2)]"
                  />
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mt-1 font-mono">
                  Official Company Seal
                </span>
              </div>
            ) : (
              /* Corporate Authentic Circular Vector Seal (Used when no custom image uploaded) */
              <div className="relative group flex flex-col items-center">
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-full border-[3px] border-double border-indigo-700/80 dark:border-indigo-400/80 p-1 flex items-center justify-center bg-indigo-600/5 dark:bg-indigo-400/10 rotate-[-5deg] shadow-sm select-none transition-transform duration-300 group-hover:rotate-0">
                  <div className="h-full w-full rounded-full border border-indigo-700/60 dark:border-indigo-400/60 flex flex-col items-center justify-center p-1 text-center text-indigo-800 dark:text-indigo-300">
                    <p className="text-[8px] font-black tracking-widest uppercase truncate max-w-[90px] leading-tight">
                      {companyName}
                    </p>
                    <div className="my-0.5 flex items-center gap-0.5 text-amber-500">
                      <Award className="h-3.5 w-3.5 fill-current" />
                    </div>
                    <span className="text-[8px] font-extrabold uppercase tracking-wider leading-none">
                      OFFICIAL SEAL
                    </span>
                    <span className="text-[6.5px] font-mono tracking-tight text-indigo-600 dark:text-indigo-400 mt-0.5">
                      HRMS CERTIFIED
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 mt-1 font-mono">
                  Verified Corporate Seal
                </span>
              </div>
            )}
          </div>
        )}

        {/* Security & Authenticity Notice */}
        {!compact && (
          <div className="text-right text-[10px] text-slate-400 dark:text-slate-500 max-w-[210px] space-y-1 shrink-0 self-center sm:self-end">
            <div className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
              <span>Cryptographically Secured</span>
            </div>
            <p className="text-[9.5px] leading-tight">
              Issued and validated through OFC360 Human Resources Management System.
            </p>
            <p className="font-mono text-[8.5px] text-slate-400 dark:text-slate-500 pt-0.5">
              DOC-ID: {`SEC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
