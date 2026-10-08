import React from "react";
import { Building2, Printer, Download, Send, BookmarkCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAurix } from "@/lib/aurix-store";
import { CompanyStampAndSignature } from "./CompanyStampAndSignature";

interface LetterPreviewProps {
  title: string;
  category: string;
  content: string;
  recipientName: string;
  recipientDesignation?: string;
  recipientDepartment?: string;
  effectiveDate?: string;
  onDownload: () => void;
  onPrint: () => void;
  onSend?: () => void;
  onSaveToDocs?: () => void;
  isSaving?: boolean;
}

export const LetterPreview: React.FC<LetterPreviewProps> = ({
  title,
  category,
  content,
  recipientName,
  recipientDesignation,
  recipientDepartment,
  effectiveDate,
  onDownload,
  onPrint,
  onSend,
  onSaveToDocs,
  isSaving = false,
}) => {
  const ws = useAurix();
  const company = ws.company;

  return (
    <div className="space-y-4">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-card/80 border border-border">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-semibold border-primary/30 text-primary">
            {category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Recipient: <strong className="text-foreground">{recipientName}</strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {onSaveToDocs && (
            <Button
              variant="outline"
              size="sm"
              disabled={isSaving}
              onClick={onSaveToDocs}
              className="h-8 text-xs gap-1.5 cursor-pointer border-border hover:bg-accent/60"
            >
              <BookmarkCheck className="h-3.5 w-3.5 text-indigo-500" />
              {isSaving ? "Saving..." : "Save to Employee Docs"}
            </Button>
          )}

          {onSend && (
            <Button
              variant="outline"
              size="sm"
              onClick={onSend}
              className="h-8 text-xs gap-1.5 cursor-pointer border-border hover:bg-accent/60"
            >
              <Send className="h-3.5 w-3.5 text-blue-500" />
              Send to Employee
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onPrint}
            className="h-8 text-xs gap-1.5 cursor-pointer border-border hover:bg-accent/60"
          >
            <Printer className="h-3.5 w-3.5" />
            Print
          </Button>

          <Button
            size="sm"
            onClick={onDownload}
            className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
        </div>
      </div>

      {/* Printable Sheet Card */}
      <Card className="border-border/80 bg-white dark:bg-card shadow-lg p-8 sm:p-12 max-w-4xl mx-auto font-serif text-slate-800 dark:text-slate-100 relative overflow-hidden print:p-0 print:border-none print:shadow-none">
        {/* Subtle Watermark */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.04] pointer-events-none select-none"
          aria-hidden="true"
        >
          <p className="text-[120px] font-black tracking-widest uppercase rotate-[-25deg]">
            OFC360
          </p>
        </div>

        {/* Company Header */}
        <div className="border-b-2 border-slate-900/10 dark:border-slate-100/10 pb-6 mb-8 flex items-start justify-between gap-4 font-sans">
          <div className="flex items-center gap-3">
            {company?.logoDataUrl ? (
              <img
                src={company.logoDataUrl}
                alt={company.name || "Company Logo"}
                className="h-12 w-auto object-contain"
              />
            ) : (
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
                <Building2 className="h-6 w-6" />
              </div>
            )}
            <div>
              <h1 className="font-bold text-lg text-slate-900 dark:text-white leading-tight">
                {company?.name || "Company"}
              </h1>
              {company?.address && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {[company.address, company.city, company.state].filter(Boolean).join(", ")}
                </p>
              )}
              {(company?.website || company?.email || company?.phone) && (
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  {[company.website, company.email, company.phone].filter(Boolean).join(" • ")}
                </p>
              )}
            </div>
          </div>

          <div className="text-right text-xs text-slate-500 dark:text-slate-400 shrink-0">
            <Badge variant="outline" className="text-[10px] font-sans font-medium mb-1">
              Official Document
            </Badge>
            <p>Date: {effectiveDate || new Date().toISOString().split("T")[0]}</p>
          </div>
        </div>

        {/* Document Title Header */}
        <div className="text-center my-6">
          <h2 className="text-xl font-bold tracking-wide uppercase underline decoration-2 underline-offset-4 text-slate-900 dark:text-white">
            {title}
          </h2>
        </div>

        {/* Letter Body Text */}
        <div className="text-sm leading-relaxed whitespace-pre-wrap space-y-4 my-8 text-slate-700 dark:text-slate-200 font-sans">
          {content}
        </div>

        {/* Official Signatory Footer with Signature and Company Stamp */}
        <CompanyStampAndSignature
          companyName={company?.name}
          date={effectiveDate}
          className="mt-12"
        />
      </Card>
    </div>
  );
};
