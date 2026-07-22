import React, { useState } from "react";
import {
  X,
  User,
  Building,
  MapPin,
  Calendar,
  CreditCard,
  FileCheck,
  ShieldCheck,
  Download,
  CheckCircle,
  XCircle,
  Sparkles,
  TrendingDown,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmployeeTaxProfileResponse } from "@/services/taxApi";

interface EmployeeTaxProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profileData?: EmployeeTaxProfileResponse | null;
  isLoading: boolean;
  onApprove: (declarationId: string) => void;
  onReject: (declarationId: string) => void;
}

export const EmployeeTaxProfileDrawer: React.FC<EmployeeTaxProfileDrawerProps> = ({
  isOpen,
  onClose,
  profileData,
  isLoading,
  onApprove,
  onReject,
}) => {
  if (!isOpen) return null;

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  const emp = profileData?.employee;
  const sal = profileData?.salary_summary;
  const ded = profileData?.deductions;
  const comp = profileData?.tax_computation;
  const regimeComp = profileData?.regime_comparison;
  const proofs = profileData?.proof_documents || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-background/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="w-full max-w-4xl bg-card border-l border-border/60 shadow-2xl h-full flex flex-col overflow-hidden relative animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/20 relative">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-amber-500/30 shadow-md">
              <AvatarImage src={emp?.avatar || undefined} />
              <AvatarFallback className="bg-amber-500/20 text-amber-300 font-bold text-lg">
                {emp?.name
                  ? emp.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight text-foreground">{emp?.name || "Employee Tax Profile"}</h2>
                <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                  {emp?.employee_code}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {emp?.designation} • {emp?.department} • {emp?.location}
              </p>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-24 bg-muted/40 rounded-xl" />
              <div className="h-48 bg-muted/40 rounded-xl" />
              <div className="h-48 bg-muted/40 rounded-xl" />
            </div>
          ) : !profileData ? (
            <div className="py-12 text-center text-muted-foreground">
              <User className="h-10 w-10 mx-auto mb-2 opacity-40" />
              <p>Unable to load employee tax profile.</p>
            </div>
          ) : (
            <>
              {/* Employee Details Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-muted/30 border border-border/50 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">PAN Number</span>
                  <span className="font-mono font-semibold text-amber-400">{emp?.pan_number}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">PF Number</span>
                  <span className="font-mono font-medium">{emp?.pf_number}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Financial Year</span>
                  <span className="font-semibold text-foreground">{profileData.financial_year}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Selected Tax Regime</span>
                  <Badge className="bg-purple-500/15 text-purple-300 border-purple-500/30">
                    {profileData.selected_regime} Tax Regime
                  </Badge>
                </div>
              </div>

              {/* Side-by-side Old vs New Tax Regime Comparison Box */}
              {regimeComp && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-900/20 via-card to-indigo-900/20 border border-purple-500/30 shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-400 animate-pulse" />
                      <h3 className="text-sm font-bold text-foreground">
                        Tax Regime Optimizer (Old vs. New)
                      </h3>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs py-1 px-3 gap-1">
                      <TrendingDown className="h-3.5 w-3.5" />
                      Recommended: {regimeComp.recommended_regime} Regime (Save {formatCurrency(regimeComp.estimated_savings)})
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    {/* Old Regime */}
                    <div
                      className={`p-4 rounded-xl border transition-all ${
                        profileData.selected_regime === "OLD"
                          ? "bg-purple-500/10 border-purple-500/40 ring-1 ring-purple-500/30"
                          : "bg-background/40 border-border/50"
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-border/40">
                        <span className="text-xs font-bold text-purple-300">OLD TAX REGIME</span>
                        {profileData.selected_regime === "OLD" && (
                          <Badge className="bg-purple-500/20 text-purple-300 text-[10px]">Active</Badge>
                        )}
                      </div>
                      <div className="space-y-1.5 pt-3 text-xs">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Gross Annual Salary:</span>
                          <span>{formatCurrency(regimeComp.old_regime.gross_annual)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Total Exemptions & Deductions:</span>
                          <span className="text-emerald-400">-{formatCurrency(regimeComp.old_regime.other_deductions + 50000)}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-1 border-t border-border/30">
                          <span>Taxable Income:</span>
                          <span>{formatCurrency(regimeComp.old_regime.taxable_income)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-amber-400 pt-1 text-sm">
                          <span>Annual Net Tax:</span>
                          <span>{formatCurrency(regimeComp.old_regime.net_tax)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground text-[11px]">
                          <span>Monthly TDS:</span>
                          <span>{formatCurrency(regimeComp.old_regime.monthly_tds)} / mo</span>
                        </div>
                      </div>
                    </div>

                    {/* New Regime */}
                    <div
                      className={`p-4 rounded-xl border transition-all ${
                        profileData.selected_regime === "NEW"
                          ? "bg-indigo-500/10 border-indigo-500/40 ring-1 ring-indigo-500/30"
                          : "bg-background/40 border-border/50"
                      }`}
                    >
                      <div className="flex items-center justify-between pb-2 border-b border-border/40">
                        <span className="text-xs font-bold text-indigo-300">NEW TAX REGIME</span>
                        {profileData.selected_regime === "NEW" && (
                          <Badge className="bg-indigo-500/20 text-indigo-300 text-[10px]">Active</Badge>
                        )}
                      </div>
                      <div className="space-y-1.5 pt-3 text-xs">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Gross Annual Salary:</span>
                          <span>{formatCurrency(regimeComp.new_regime.gross_annual)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Standard Deduction:</span>
                          <span className="text-emerald-400">-{formatCurrency(75000)}</span>
                        </div>
                        <div className="flex justify-between font-semibold pt-1 border-t border-border/30">
                          <span>Taxable Income:</span>
                          <span>{formatCurrency(regimeComp.new_regime.taxable_income)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-amber-400 pt-1 text-sm">
                          <span>Annual Net Tax:</span>
                          <span>{formatCurrency(regimeComp.new_regime.net_tax)}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground text-[11px]">
                          <span>Monthly TDS:</span>
                          <span>{formatCurrency(regimeComp.new_regime.monthly_tds)} / mo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs: Deductions Breakdown vs Uploaded Proofs */}
              <Tabs defaultValue="deductions" className="w-full">
                <TabsList className="grid grid-cols-2 w-full bg-muted/40">
                  <TabsTrigger value="deductions" className="text-xs">
                    Exemptions & Deductions Breakdown
                  </TabsTrigger>
                  <TabsTrigger value="proofs" className="text-xs">
                    Investment Proof Documents ({proofs.length})
                  </TabsTrigger>
                </TabsList>

                {/* Deductions Tab */}
                <TabsContent value="deductions" className="pt-4 space-y-4">
                  <div className="p-4 rounded-xl border border-border/50 bg-card/40 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b border-border/40 pb-2">
                      Chapter VI-A & Statutory Deductions
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="flex justify-between p-2 rounded bg-muted/20">
                        <span>Section 80C (EPF/PPF/LIC):</span>
                        <span className="font-semibold text-emerald-400">{formatCurrency(ded?.section_80c || 0)}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-muted/20">
                        <span>Section 80D (Health Insurance):</span>
                        <span className="font-semibold text-emerald-400">{formatCurrency(ded?.section_80d || 0)}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-muted/20">
                        <span>Section 80CCD(1B) NPS:</span>
                        <span className="font-semibold text-emerald-400">{formatCurrency(ded?.section_80ccd1b_nps || 0)}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-muted/20">
                        <span>Section 24(b) Home Loan Interest:</span>
                        <span className="font-semibold text-emerald-400">{formatCurrency(ded?.home_loan_24b || 0)}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-muted/20">
                        <span>House Rent Allowance (HRA):</span>
                        <span className="font-semibold text-emerald-400">{formatCurrency(ded?.hra_claimed || 0)}</span>
                      </div>
                      <div className="flex justify-between p-2 rounded bg-muted/20">
                        <span>Professional Tax (Annual):</span>
                        <span className="font-semibold text-emerald-400">{formatCurrency(ded?.professional_tax || 0)}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Proofs Tab */}
                <TabsContent value="proofs" className="pt-4 space-y-3">
                  {proofs.length === 0 ? (
                    <div className="py-8 text-center text-xs text-muted-foreground border border-dashed rounded-xl">
                      No investment proof documents uploaded yet.
                    </div>
                  ) : (
                    proofs.map((proof) => (
                      <div
                        key={proof.id}
                        className="p-3 rounded-xl border border-border/50 bg-card/40 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="h-5 w-5 text-amber-400" />
                          <div>
                            <div className="font-semibold text-foreground">{proof.document_name}</div>
                            <div className="text-[10px] text-muted-foreground">
                              Section: <strong>{proof.section}</strong> • Claimed: {formatCurrency(proof.amount_claimed)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {proof.verified_by_hr ? (
                            <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30 text-[10px]">
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px]">
                              Pending HR Review
                            </Badge>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(proof.document_url, "_blank")}
                            className="h-7 px-2 text-[11px]"
                          >
                            View Document
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 bg-muted/20">
          <Button variant="outline" size="sm" onClick={onClose} className="h-9 px-4 text-xs">
            Close
          </Button>

          <div className="flex items-center gap-2">
            {profileData?.declaration_status !== "APPROVED" && (
              <Button
                variant="default"
                size="sm"
                onClick={() => onApprove(profileData?.declaration_status || "")}
                className="h-9 px-4 text-xs bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5"
              >
                <CheckCircle className="h-3.5 w-3.5" />
                Approve Declaration
              </Button>
            )}

            {profileData?.declaration_status !== "REJECTED" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onReject(profileData?.declaration_status || "")}
                className="h-9 px-4 text-xs bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/30 gap-1.5"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
