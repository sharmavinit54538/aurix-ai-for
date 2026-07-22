import React from "react";
import { Download, FileText, CheckCircle2, Award, Printer } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BonusAward } from "./bonusesTypes";
import { toast } from "sonner";

interface BonusLetterModalProps {
  open: boolean;
  onClose: () => void;
  bonus: BonusAward | null;
}

export const BonusLetterModal: React.FC<BonusLetterModalProps> = ({ open, onClose, bonus }) => {
  if (!bonus) return null;

  const handleDownloadPdf = () => {
    toast.success(`Downloaded Award Letter PDF for ${bonus.employeeName}`);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl bg-[#070B17] border-white/10 text-white p-6">
        <DialogHeader className="pb-3 border-b border-white/10">
          <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Branded Bonus Award Letter: <span className="font-mono text-blue-300">{bonus.employeeName}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Printable Branded Letter Paper Preview */}
        <div className="bonus-letter-preview my-2 space-y-4 text-xs font-serif text-slate-900 bg-white p-8 rounded-lg shadow-2xl">
          {/* Header Branding */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900 uppercase">AURIX AI ENTERPRISE CORP</h2>
              <p className="text-[11px] text-slate-500 font-sans">Human Capital & Compensation Governance Office</p>
            </div>
            <div className="text-right text-[11px] font-sans text-slate-500">
              <span>Date: {bonus.createdOn}</span>
              <p className="font-mono text-slate-800 font-bold">Ref: {bonus.bonusCode}</p>
            </div>
          </div>

          {/* Letter Body */}
          <div className="space-y-3 font-sans leading-relaxed text-slate-800">
            <p className="font-semibold text-slate-900">Dear {bonus.employeeName},</p>

            <p>
              We are pleased to inform you that in recognition of your outstanding performance during{" "}
              <strong className="text-slate-900">{bonus.bonusCycle}</strong> (Performance Rating:{" "}
              <strong className="text-slate-900">{bonus.performanceRating} / 5.0</strong>), the Executive Compensation Committee
              has awarded you a <strong className="text-slate-900">{bonus.bonusType}</strong>.
            </p>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center my-3">
              <span className="text-xs text-slate-500 uppercase tracking-wider block">Awarded Bonus Amount</span>
              <span className="text-2xl font-bold font-mono text-slate-900">
                ₹{bonus.bonusAmount.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] text-slate-500 block mt-0.5">
                (Subject to TDS tax withholding u/s 192 of the Income Tax Act)
              </span>
            </div>

            <p>
              This reward reflects your commitment to excellence, innovation, and strategic contributions to the{" "}
              <strong>{bonus.department}</strong> organization. The amount will be disbursed via your upcoming salary run for cycle{" "}
              <strong>{bonus.payrollCycle || "July 2026"}</strong>.
            </p>

            <p className="pt-2">We thank you for your leadership and look forward to your continued success with Aurix AI.</p>
          </div>

          {/* Digital Signature Footer */}
          <div className="pt-6 border-t border-slate-200 flex items-end justify-between font-sans text-xs">
            <div>
              <div className="font-serif italic text-base text-slate-900 font-bold">Ananya Roy</div>
              <p className="text-[11px] text-slate-600 font-medium">Chief Financial Officer & Chair, Compensation Committee</p>
              <span className="text-[9px] text-emerald-700 font-mono flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Digitally Signed & Authenticated
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400">Aurix HRMS Seal #99012</span>
            </div>
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
          <Button variant="outline" size="sm" onClick={onClose} className="border-white/10 bg-slate-900 text-xs">
            Close
          </Button>
          <Button
            size="sm"
            onClick={handleDownloadPdf}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs gap-1.5 shadow-lg shadow-emerald-600/25"
          >
            <Download className="w-4 h-4" /> Download Award Letter PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
