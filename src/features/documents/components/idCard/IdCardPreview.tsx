import React from "react";
import { Building2, RotateCw, Printer, Download, QrCode, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ID_CARD_THEMES } from "../../lib/idCardTemplates";
import type { EmployeeIdCardData, IdCardTheme } from "../../lib/types";

interface IdCardPreviewProps {
  card: EmployeeIdCardData;
  isFlipped?: boolean;
  onFlip?: () => void;
  onPrint?: () => void;
  onDownload?: () => void;
  theme?: string;
}

export const IdCardPreview: React.FC<IdCardPreviewProps> = ({
  card,
  isFlipped: controlledFlipped,
  onFlip: controlledOnFlip,
  onPrint,
  onDownload,
  theme,
}) => {
  const [internalFlipped, setInternalFlipped] = React.useState(false);
  const isFlipped = controlledFlipped !== undefined ? controlledFlipped : internalFlipped;
  const onFlip = controlledOnFlip || (() => setInternalFlipped((prev) => !prev));
  const activeTheme = (theme || card.theme || "navy") as IdCardTheme;
  const themeConfig = ID_CARD_THEMES[activeTheme] || ID_CARD_THEMES.navy;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Controls Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant="outline"
          size="sm"
          onClick={onFlip}
          className="h-8 text-xs gap-1.5 border-border bg-card hover:bg-accent/60 cursor-pointer"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Flip to {isFlipped ? "Front" : "Back"} Side
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onPrint}
          className="h-8 text-xs gap-1.5 border-border bg-card hover:bg-accent/60 cursor-pointer"
        >
          <Printer className="h-3.5 w-3.5" />
          Print ID Card
        </Button>

        <Button
          size="sm"
          onClick={onDownload}
          className="h-8 text-xs gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
        >
          <Download className="h-3.5 w-3.5" />
          Download Badge PDF
        </Button>
      </div>

      {/* Card Container (Standard CR80 dimensions: 320px x 490px vertical ID badge) */}
      <div className="perspective-1000 w-[320px] h-[490px]">
        <div
          className={`relative w-full h-full transition-transform duration-500 transform-style-3d cursor-pointer shadow-2xl rounded-2xl ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          onClick={onFlip}
          title="Click to flip card"
        >
          {/* ═══════════════════ FRONT SIDE ═══════════════════ */}
          <div
            className={`absolute inset-0 w-full h-full backface-hidden rounded-2xl p-6 flex flex-col justify-between border border-white/10 ${themeConfig.frontBg} ${themeConfig.textColor} shadow-xl overflow-hidden`}
          >
            {/* Background design accents */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

            {/* Header: Company Name & Logo */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                  <Building2 className="h-4 w-4 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-xs tracking-wider uppercase leading-none">
                    {card.companyName}
                  </h3>
                  <span className="text-[9px] opacity-70 tracking-widest uppercase">
                    Identity Pass
                  </span>
                </div>
              </div>

              <Badge className={`text-[9px] font-semibold border ${themeConfig.badgeBg}`}>
                {card.status}
              </Badge>
            </div>

            {/* Employee Photo & Identification */}
            <div className="relative z-10 flex flex-col items-center text-center my-auto py-2">
              <div className="relative mb-3">
                <div className="h-28 w-28 rounded-2xl overflow-hidden border-2 border-white/40 shadow-lg bg-slate-800 flex items-center justify-center">
                  {card.photoUrl ? (
                    <img
                      src={card.photoUrl}
                      alt={card.employeeName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-14 w-14 text-white/50" />
                  )}
                </div>
                {card.bloodGroup && (
                  <span className="absolute -bottom-2 -right-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow border border-white/40">
                    {card.bloodGroup}
                  </span>
                )}
              </div>

              <h2 className="font-bold text-lg text-white tracking-tight leading-snug">
                {card.employeeName}
              </h2>
              <p className="text-xs font-semibold opacity-90 text-primary-foreground/90 mt-0.5">
                {card.designation}
              </p>
              <p className="text-[11px] opacity-70">{card.department}</p>

              <div className="mt-3 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-mono tracking-wider">
                ID: {card.employeeCode}
              </div>
            </div>

            {/* Front Footer: Joining Date & Barcode hint */}
            <div className="relative z-10 border-t border-white/10 pt-3 flex items-center justify-between text-[10px] opacity-80">
              <div>
                <span className="opacity-60 block text-[9px] uppercase tracking-wider">Joined</span>
                <span className="font-semibold">{card.joiningDate}</span>
              </div>
              <div className="text-right">
                <span className="opacity-60 block text-[9px] uppercase tracking-wider">Expires</span>
                <span className="font-semibold">{card.expiryDate || "Indefinite"}</span>
              </div>
            </div>
          </div>

          {/* ═══════════════════ BACK SIDE ═══════════════════ */}
          <div
            className={`absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-2xl p-6 flex flex-col justify-between border border-white/10 ${themeConfig.backBg} ${themeConfig.textColor} shadow-xl overflow-hidden text-left`}
          >
            {/* Header */}
            <div className="border-b border-white/10 pb-2 flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-wider uppercase opacity-90">
                Security & Contact Details
              </span>
              <ShieldCheck className="h-4 w-4 opacity-70" />
            </div>

            {/* Back Details & Dynamic QR Code */}
            <div className="space-y-3 text-[11px] my-auto">
              <div>
                <span className="opacity-60 text-[9px] uppercase block tracking-wider">Company HQ</span>
                <p className="font-medium leading-tight opacity-90 text-[10px]">{card.companyAddress}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="opacity-60 text-[9px] uppercase block tracking-wider">Emergency Contact</span>
                  <p className="font-mono font-semibold">{card.emergencyContact}</p>
                </div>
                <div>
                  <span className="opacity-60 text-[9px] uppercase block tracking-wider">Employee Phone</span>
                  <p className="font-mono">{card.employeeContact}</p>
                </div>
              </div>

              <div>
                <span className="opacity-60 text-[9px] uppercase block tracking-wider">Official Email</span>
                <p className="font-mono text-[10px] truncate">{card.email}</p>
              </div>

              {/* Dynamic QR Code */}
              <div className="flex items-center gap-3 p-2 rounded-xl bg-white/5 border border-white/10">
                {card.qrPayload ? (
                  <img
                    src={card.qrPayload}
                    alt="Scan for digital verification"
                    className="h-16 w-16 rounded-lg bg-white p-1 shrink-0"
                  />
                ) : (
                  <div className="h-16 w-16 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <QrCode className="h-8 w-8 text-white/50" />
                  </div>
                )}
                <div className="text-[9px] opacity-80 leading-tight">
                  <p className="font-semibold text-white">Digital Verification</p>
                  <p className="opacity-70 mt-0.5">Scan QR code to verify active employment credential.</p>
                </div>
              </div>
            </div>

            {/* Terms & Authorized Signature */}
            <div className="border-t border-white/10 pt-2 text-[8px] opacity-70 leading-tight space-y-1">
              <p>
                {card.companyName
                  ? `Property of ${card.companyName}. If found, please return to HQ address above.`
                  : "If found, please return to company headquarters."}
              </p>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono">VER: 2026.01</span>
                <span className="font-serif italic text-[10px] opacity-90">
                  {card.authorizedSignatoryName || "Authorized Signatory"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
        <RotateCw className="h-3 w-3" /> Click badge or button above to inspect front/back
      </p>
    </div>
  );
};
