import type { IdCardTheme, IdCardStatus, EmployeeIdCardData } from "./types";

export interface IdCardThemeConfig {
  id: IdCardTheme;
  name: string;
  frontBg: string;
  frontAccent: string;
  backBg: string;
  textColor: string;
  badgeBg: string;
}

export const ID_CARD_THEMES: Record<IdCardTheme, IdCardThemeConfig> = {
  navy: {
    id: "navy",
    name: "Corporate Navy",
    frontBg: "bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950",
    frontAccent: "border-blue-500/30 text-blue-400",
    backBg: "bg-gradient-to-br from-slate-900 to-slate-950",
    textColor: "text-slate-100",
    badgeBg: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  },
  slate: {
    id: "slate",
    name: "Modern Slate",
    frontBg: "bg-gradient-to-br from-neutral-900 via-stone-900 to-zinc-950",
    frontAccent: "border-stone-500/30 text-stone-300",
    backBg: "bg-gradient-to-br from-neutral-900 to-neutral-950",
    textColor: "text-neutral-100",
    badgeBg: "bg-neutral-500/20 text-neutral-300 border-neutral-500/30",
  },
  emerald: {
    id: "emerald",
    name: "Emerald Green",
    frontBg: "bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950",
    frontAccent: "border-emerald-500/30 text-emerald-400",
    backBg: "bg-gradient-to-br from-emerald-950 to-slate-950",
    textColor: "text-emerald-50",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  },
  purple: {
    id: "purple",
    name: "Royal Purple",
    frontBg: "bg-gradient-to-br from-purple-950 via-violet-950 to-slate-950",
    frontAccent: "border-purple-500/30 text-purple-400",
    backBg: "bg-gradient-to-br from-purple-950 to-slate-950",
    textColor: "text-purple-50",
    badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
};

export const STANDARD_ID_CARD_TERMS = `1. This identity card is property of OFC360 Enterprise Systems and is strictly non-transferable.
2. The card must be visibly worn at all times within organizational premises and client project locations.
3. If lost, mutilated, or stolen, report immediately to People Operations & HR Security Desk.
4. If found, please return to the designated Corporate Headquarters address stated above.`;

/**
 * Builds the verification payload encoded into the dynamic QR code on the back of the card.
 */
export function buildIdCardQrPayload(card: {
  employeeId: string;
  employeeCode: string;
  employeeName: string;
  companyName: string;
  cardVersion?: number;
}): string {
  const verifyHost = typeof window !== "undefined" ? window.location.origin : "https://www.ofc360.com";
  return `${verifyHost}/verify/id-card?emp=${encodeURIComponent(card.employeeCode || card.employeeId)}&name=${encodeURIComponent(card.employeeName)}&co=${encodeURIComponent(card.companyName)}&v=${card.cardVersion || 1}`;
}
