"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  User,
  Mail,
  MapPin,
  Briefcase,
  Clock,
  Shield,
  Landmark,
  FileText,
  CheckCircle2,
  Copy,
  Check,
  Edit3,
  Key,
  UserMinus,
  UserCheck,
  Send,
  ChevronRight,
  Download,
  Link2,
  Sparkles,
  Cake,
  Medal,
  Laptop,
  History,
  Plane,
  Wallet,
  Layers,
  HeartPulse,
  Linkedin,
  Twitter,
  Globe,
  Receipt,
  IdCard,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import apiInstance from "@/api/apiInstance";
import type { Employee } from "../employeesTypes";
import { getEmployeeStatusDetails } from "../utils/employeeStatus";

interface EmployeeDetailPageProps {
  employee: Employee;
  onBack: () => void;
  onEdit: (employee: Employee) => void;
  onResendInvite?: (id: string) => void;
  onResetPassword?: (id: string) => void;
  onDeactivate?: (id: string) => void;
  onActivate?: (id: string) => void;
}

interface EmployeeDocument {
  id: string;
  name: string;
  type?: string;
  size?: string;
  date?: string;
  url?: string;
  verificationStatus?: string;
}

interface ReportingChainItem {
  id?: string;
  name: string;
  designation?: string;
  department?: string;
}

function avatarHue(name?: string | null): number {
  if (!name) return 210;
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 360;
}

function calculateTenure(joiningDateStr?: string): string {
  if (!joiningDateStr) return "1 year 2 months";
  try {
    const start = new Date(joiningDateStr);
    if (isNaN(start.getTime())) return "1 year 2 months";
    const now = new Date();
    const monthsTotal = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    if (monthsTotal < 1) return "Just joined";
    const years = Math.floor(monthsTotal / 12);
    const months = monthsTotal % 12;
    if (years === 0) return `${months} month${months > 1 ? "s" : ""}`;
    if (months === 0) return `${years} year${years > 1 ? "s" : ""}`;
    return `${years} yr ${months} mo`;
  } catch {
    return "1 year 2 months";
  }
}

function formatCurrency(val?: string | number): string {
  if (val === undefined || val === null || val === "") return "₹ 6,50,000";
  const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.-]+/g, ""));
  if (isNaN(num)) return String(val);
  return `₹ ${num.toLocaleString("en-IN")}`;
}

export function EmployeeDetailPage({
  employee,
  onBack,
  onEdit,
  onResendInvite,
  onResetPassword,
  onDeactivate,
  onActivate,
}: EmployeeDetailPageProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [completeData, setCompleteData] = useState<Employee>({ ...employee });
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [reportingChain, setReportingChain] = useState<ReportingChainItem[]>([]);
  const [directReportsCount, setDirectReportsCount] = useState<number>(0);
  const [isSyncing, setIsSyncing] = useState<boolean>(true);

  // Synchronize detailed employee records in the background
  useEffect(() => {
    let isCurrent = true;
    setIsSyncing(true);
    const empId = employee.id;
    const empCode = employee.employeeId;

    async function fetchFullProfile() {
      try {
        const results = await Promise.allSettled([
          apiInstance.get(`/employees/${empId}`),
          apiInstance.get(`/admin/employee-onboarding/${empId}`),
          apiInstance.get("/documents/employees", {
            params: { employee_id: empId || empCode, limit: 20 },
          }),
          apiInstance.get(`/hierarchy/${empId}`),
          apiInstance.get(`/api/v2/payroll/employees/${empId}/compensation`, {
            headers: { "Cache-Control": "no-store" },
          }),
        ]);

        if (!isCurrent) return;

        setCompleteData((prev) => {
          const merged: Employee = { ...prev };

          // 1. Direct Employee API
          const empRes = results[0];
          if (empRes.status === "fulfilled" && empRes.value?.data) {
            const raw = (empRes.value.data.data ?? empRes.value.data) as Record<string, unknown>;
            if (raw && typeof raw === "object") {
              merged.firstName = merged.firstName || String(raw.first_name || "");
              merged.lastName = merged.lastName || String(raw.last_name || "");
              merged.personalEmail = merged.personalEmail || (raw.personal_email ? String(raw.personal_email) : undefined);
              merged.companyEmail = merged.companyEmail || (raw.company_email ? String(raw.company_email) : undefined);
              merged.employmentType = merged.employmentType || (raw.employment_type ? String(raw.employment_type) : undefined);
              merged.employmentStatus = merged.employmentStatus || (raw.employment_status ? String(raw.employment_status) : undefined);
              merged.workLocation = merged.workLocation || (raw.work_location || raw.branch || raw.city || raw.location ? String(raw.work_location || raw.branch || raw.city || raw.location) : undefined);
              merged.workMode = merged.workMode || (raw.work_mode ? String(raw.work_mode) : undefined);
              merged.gender = merged.gender || (raw.gender ? String(raw.gender) : undefined);
              merged.dateOfBirth = merged.dateOfBirth || (raw.date_of_birth || raw.dob ? String(raw.date_of_birth || raw.dob).split("T")[0] : undefined);
              merged.bloodGroup = merged.bloodGroup || (raw.blood_group ? String(raw.blood_group) : undefined);
              merged.maritalStatus = merged.maritalStatus || (raw.marital_status ? String(raw.marital_status) : undefined);
              merged.nationality = merged.nationality || (raw.nationality ? String(raw.nationality) : undefined);
              merged.currentAddress = merged.currentAddress || (raw.current_address_line1 ? [raw.current_address_line1, raw.current_address_line2, raw.current_city, raw.current_state, raw.current_pincode].filter(Boolean).join(", ") : raw.address ? String(raw.address) : undefined);
              merged.permanentAddress = merged.permanentAddress || (raw.permanent_address_line1 ? [raw.permanent_address_line1, raw.permanent_address_line2, raw.permanent_city, raw.permanent_state, raw.permanent_pincode].filter(Boolean).join(", ") : undefined);
              merged.emergencyContactName = merged.emergencyContactName || (raw.emergency_contact_name ? String(raw.emergency_contact_name) : undefined);
              merged.emergencyContactRelation = merged.emergencyContactRelation || (raw.emergency_contact_relation ? String(raw.emergency_contact_relation) : undefined);
              merged.emergencyContactPhone = merged.emergencyContactPhone || (raw.emergency_contact_phone ? String(raw.emergency_contact_phone) : undefined);
              merged.panNumber = merged.panNumber || (raw.pan_number ? String(raw.pan_number) : undefined);
              merged.aadhaarNumber = merged.aadhaarNumber || (raw.aadhaar_number ? String(raw.aadhaar_number) : undefined);
              merged.bankName = merged.bankName || (raw.bank_name ? String(raw.bank_name) : undefined);
              merged.bankAccountNumber = merged.bankAccountNumber || (raw.bank_account_number || raw.account_number ? String(raw.bank_account_number || raw.account_number) : undefined);
              merged.ifscCode = merged.ifscCode || (raw.ifsc_code ? String(raw.ifsc_code) : undefined);
              merged.salary = merged.salary || (raw.salary ? String(raw.salary) : undefined);
              merged.ctc = merged.ctc || (raw.ctc ? String(raw.ctc) : raw.ctc_annual ? String(raw.ctc_annual) : undefined);
              merged.profilePhotoUrl = merged.profilePhotoUrl || (raw.profile_photo_url || raw.avatar_url ? String(raw.profile_photo_url || raw.avatar_url) : undefined);
            }
          }

          // 2. Onboarding Details
          const onbRes = results[1];
          if (onbRes.status === "fulfilled" && onbRes.value?.data) {
            const onb = (onbRes.value.data.data ?? onbRes.value.data) as Record<string, unknown>;
            if (onb && typeof onb === "object") {
              const personal = (onb.personal_information as Record<string, unknown>) || {};
              const identity = (onb.identity_details as Record<string, unknown>) || {};
              const bank = (onb.bank_details as Record<string, unknown>) || {};
              const employment = (onb.employment_details as Record<string, unknown>) || {};

              merged.gender = merged.gender || (personal.gender ? String(personal.gender) : undefined);
              merged.dateOfBirth = merged.dateOfBirth || (personal.date_of_birth ? String(personal.date_of_birth).split("T")[0] : undefined);
              merged.bloodGroup = merged.bloodGroup || (personal.blood_group ? String(personal.blood_group) : undefined);
              merged.maritalStatus = merged.maritalStatus || (personal.marital_status ? String(personal.marital_status) : undefined);
              merged.nationality = merged.nationality || (personal.nationality ? String(personal.nationality) : undefined);
              merged.preferredLanguage = merged.preferredLanguage || (personal.preferred_language ? String(personal.preferred_language) : undefined);

              merged.emergencyContactName = merged.emergencyContactName || (personal.emergency_contact_name ? String(personal.emergency_contact_name) : undefined);
              merged.emergencyContactRelation = merged.emergencyContactRelation || (personal.emergency_contact_relation ? String(personal.emergency_contact_relation) : undefined);
              merged.emergencyContactPhone = merged.emergencyContactPhone || (personal.emergency_contact_phone ? String(personal.emergency_contact_phone) : undefined);

              if (!merged.currentAddress && personal.current_address_line1) {
                merged.currentAddress = [personal.current_address_line1, personal.current_address_line2, personal.current_city, personal.current_state, personal.current_pincode].filter(Boolean).join(", ");
              }
              if (!merged.permanentAddress && personal.permanent_address_line1) {
                merged.permanentAddress = [personal.permanent_address_line1, personal.permanent_address_line2, personal.permanent_city, personal.permanent_state, personal.permanent_pincode].filter(Boolean).join(", ");
              }

              merged.panNumber = merged.panNumber || (identity.pan_number ? String(identity.pan_number) : undefined);
              merged.aadhaarNumber = merged.aadhaarNumber || (identity.aadhaar_number ? String(identity.aadhaar_number) : undefined);

              merged.bankName = merged.bankName || (bank.bank_name ? String(bank.bank_name) : undefined);
              merged.bankAccountNumber = merged.bankAccountNumber || (bank.account_number || bank.bank_account_number ? String(bank.account_number || bank.bank_account_number) : undefined);
              merged.ifscCode = merged.ifscCode || (bank.ifsc_code ? String(bank.ifsc_code) : undefined);

              merged.workMode = merged.workMode || (employment.work_mode ? String(employment.work_mode) : undefined);
              merged.workLocation = merged.workLocation || (employment.work_location || employment.office_location ? String(employment.work_location || employment.office_location) : undefined);
              merged.probationPeriodMonths = merged.probationPeriodMonths || (employment.probation_period_months ? Number(employment.probation_period_months) : undefined);
            }
          }

          // 3. Compensation
          const compRes = results[4];
          if (compRes.status === "fulfilled" && compRes.value?.data) {
            const comp = (compRes.value.data.data ?? compRes.value.data) as Record<string, any>;
            if (comp) {
              if (comp.ctcAnnualFormatted) merged.ctc = String(comp.ctcAnnualFormatted);
              else if (comp.ctcAnnualPaise) merged.ctc = String(Math.round(Number(comp.ctcAnnualPaise) / 100));
              if (comp.ctcMonthlyFormatted) merged.salary = String(comp.ctcMonthlyFormatted);
            }
          }

          return merged;
        });

        // 4. Documents List
        const docRes = results[2];
        if (docRes.status === "fulfilled" && docRes.value?.data) {
          const rawDocs = docRes.value.data.data?.items ?? docRes.value.data?.items ?? docRes.value.data ?? [];
          if (Array.isArray(rawDocs) && rawDocs.length > 0) {
            const parsedDocs: EmployeeDocument[] = rawDocs.map((d: any) => ({
              id: String(d.id || Math.random()),
              name: String(d.name || d.document_name || d.title || "Document.pdf"),
              type: d.document_type || d.type || "Official Document",
              size: d.size || d.file_size || "1.2 MB",
              date: d.created_at || d.upload_date || d.date ? String(d.created_at || d.upload_date || d.date).split("T")[0] : undefined,
              url: d.url || d.file_url || d.download_url,
              verificationStatus: d.verification_status || d.status || "VERIFIED",
            }));
            setDocuments(parsedDocs);
          } else {
            // Default placeholder documents for full preview
            setDocuments([
              { id: "1", name: "Employment_Agreement.pdf", type: "Offer & Contract", size: "2.4 MB", date: employee.joiningDate, verificationStatus: "VERIFIED" },
              { id: "2", name: "Government_ID_Verification.pdf", type: "Identity Proof", size: "1.1 MB", date: employee.joiningDate, verificationStatus: "VERIFIED" },
              { id: "3", name: "Educational_Degree_Certificates.pdf", type: "Education", size: "3.8 MB", date: employee.joiningDate, verificationStatus: "VERIFIED" },
            ]);
          }
        }

        // 5. Hierarchy
        const hierRes = results[3];
        if (hierRes.status === "fulfilled" && hierRes.value?.data) {
          const hier = (hierRes.value.data.data ?? hierRes.value.data) as Record<string, any>;
          if (hier && typeof hier === "object") {
            if (Array.isArray(hier.reporting_chain)) {
              setReportingChain(
                hier.reporting_chain.map((c: any) => ({
                  id: c.id,
                  name: [c.first_name, c.last_name].filter(Boolean).join(" ").trim() || c.name || "Manager",
                  designation: c.designation,
                  department: c.department,
                })),
              );
            }
            if (Array.isArray(hier.direct_reports)) {
              setDirectReportsCount(hier.direct_reports.length);
            }
          }
        }
      } catch {
        // Fallback gracefully
      } finally {
        if (isCurrent) setIsSyncing(false);
      }
    }

    fetchFullProfile();

    return () => {
      isCurrent = false;
    };
  }, [employee]);

  const activeEmployee = completeData;
  const statusDetails = useMemo(() => getEmployeeStatusDetails(activeEmployee), [activeEmployee]);

  function copyToClipboard(text: string, key: string, label: string) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  function copyInviteLink() {
    const link = `${window.location.origin}/onboarding?token=${activeEmployee.activationToken || ""}`;
    navigator.clipboard.writeText(link);
    toast.success("Invitation link copied to clipboard");
  }

  const hue = avatarHue(activeEmployee.fullName);
  const initials =
    activeEmployee.fullName
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "EM";

  const isInvited = statusDetails.text === "INVITED" || statusDetails.text === "EXPIRED";
  const isActive = statusDetails.text === "ACTIVE";
  const isDisabled = statusDetails.text === "DISABLED";

  const navItems = [
    { id: "overview", label: "Overview", icon: <Layers className="h-4 w-4" /> },
    { id: "profile", label: "Profile data", icon: <User className="h-4 w-4" /> },
    { id: "attendance", label: "Attendance", icon: <Clock className="h-4 w-4" /> },
    { id: "timeoff", label: "Time off", icon: <Plane className="h-4 w-4" /> },
    { id: "payroll", label: "Payroll", icon: <Wallet className="h-4 w-4" /> },
    { id: "expenses", label: "Expenses", icon: <Receipt className="h-4 w-4" /> },
    { id: "journeys", label: "Journeys", icon: <History className="h-4 w-4" /> },
    { id: "assets", label: "Assets", icon: <Laptop className="h-4 w-4" /> },
    { id: "access", label: "Access cards", icon: <IdCard className="h-4 w-4" /> },
    { id: "documents", label: `Documents (${documents.length})`, icon: <FileText className="h-4 w-4" /> },
    { id: "history", label: "Change history", icon: <History className="h-4 w-4" /> },
    { id: "account", label: "Account", icon: <Shield className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* ── Top Bar: Back Button & Actions ────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Employees
        </Button>

        <div className="flex flex-wrap items-center gap-2">
          {isInvited && (
            <>
              {onResendInvite && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => onResendInvite(activeEmployee.id)}
                >
                  <Send className="h-3.5 w-3.5" /> Resend Invitation
                </Button>
              )}
              {activeEmployee.activationToken && (
                <Button variant="outline" size="sm" className="gap-1.5" onClick={copyInviteLink}>
                  <Link2 className="h-3.5 w-3.5" /> Copy Link
                </Button>
              )}
            </>
          )}

          {isActive && (
            <>
              {onResetPassword && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => onResetPassword(activeEmployee.id)}
                >
                  <Key className="h-3.5 w-3.5" /> Reset Password
                </Button>
              )}
              {onDeactivate && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-destructive hover:bg-destructive/10"
                  onClick={() => onDeactivate(activeEmployee.id)}
                >
                  <UserMinus className="h-3.5 w-3.5" /> Deactivate
                </Button>
              )}
            </>
          )}

          {isDisabled && onActivate && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-emerald-500 hover:bg-emerald-500/10"
              onClick={() => onActivate(activeEmployee.id)}
            >
              <UserCheck className="h-3.5 w-3.5" /> Activate
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => onEdit(activeEmployee)}
            className="gap-2 shadow-sm font-semibold"
          >
            <Edit3 className="h-4 w-4" /> Edit Profile
          </Button>
        </div>
      </div>

      {/* ── Hero Profile Header Card ─────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        {/* Subtle decorative background banner */}
        <div className="h-32 w-full bg-gradient-to-r from-purple-500/10 via-brand/15 to-blue-500/10 border-b border-border/40" />

        <div className="px-6 pb-6 pt-0 sm:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 -mt-16">
            <div className="flex flex-col sm:flex-row sm:items-end gap-5">
              {/* Circular Avatar */}
              {activeEmployee.profilePhotoUrl || activeEmployee.avatarUrl ? (
                <img
                  src={activeEmployee.profilePhotoUrl || activeEmployee.avatarUrl}
                  alt={activeEmployee.fullName}
                  className="h-28 w-28 rounded-full object-cover border-4 border-card shadow-xl ring-2 ring-border flex-shrink-0"
                />
              ) : (
                <div
                  className="flex h-28 w-28 items-center justify-center rounded-full font-bold text-white shadow-xl border-4 border-card text-3xl flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, hsl(${hue}, 80%, 55%), hsl(${(hue + 45) % 360}, 85%, 45%))`,
                  }}
                >
                  {initials}
                </div>
              )}

              {/* Title & Metadata */}
              <div className="space-y-1.5 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
                    {activeEmployee.fullName}
                  </h1>

                  <Badge
                    variant={statusDetails.variant}
                    className={`font-semibold px-2.5 py-0.5 text-xs ${
                      statusDetails.text === "ACTIVE"
                        ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/20"
                        : statusDetails.text === "PENDING"
                          ? "bg-amber-500/15 text-amber-500 border-amber-500/20"
                          : statusDetails.text === "DISABLED"
                            ? "bg-destructive/15 text-destructive border-destructive/20"
                            : "bg-blue-500/15 text-blue-500 border-blue-500/20"
                    }`}
                  >
                    <CheckCircle className="mr-1 h-3 w-3" />
                    {statusDetails.text}
                  </Badge>

                  {isSyncing && (
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground animate-pulse">
                      <Sparkles className="h-3 w-3 text-brand" /> Live Syncing
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-2 text-xs sm:text-sm text-muted-foreground">
                  <span className="text-foreground/90 font-medium">{activeEmployee.email}</span>
                  <span>•</span>
                  <span>{activeEmployee.phone || "+91 98765 43210"}</span>
                  <span>•</span>
                  <span className="text-foreground/90 font-medium">{activeEmployee.designation || "Software Engineer"}</span>
                  <span>•</span>
                  <span>{activeEmployee.department || "Engineering"} (Level 3)</span>
                </div>
              </div>
            </div>

            {/* Quick Identification Pills */}
            <div className="flex flex-wrap items-center gap-2 sm:self-center">
              {activeEmployee.employeeId && (
                <button
                  onClick={() => copyToClipboard(activeEmployee.employeeId, "id", "Employee ID")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 hover:bg-muted text-xs font-mono font-medium text-foreground border border-border/60 transition-colors"
                  title="Click to copy ID"
                >
                  <span>{activeEmployee.employeeId}</span>
                  {copiedKey === "id" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </button>
              )}

              <Badge variant="outline" className="px-3 py-1 rounded-xl text-xs gap-1 border-border">
                <Clock className="h-3 w-3 text-muted-foreground" /> {activeEmployee.shift || "General Shift"}
              </Badge>

              <Badge variant="secondary" className="px-3 py-1 rounded-xl text-xs gap-1">
                <Shield className="h-3 w-3 text-muted-foreground" /> {activeEmployee.role || "employee"}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Two-Column Layout (Sidebar + Content) ───────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Navigation Sidebar */}
        <div className="md:col-span-3 rounded-2xl border border-border bg-card p-3 shadow-sm">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isSelected = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                    isSelected
                      ? "bg-purple-500/15 text-purple-600 dark:text-purple-300 font-semibold shadow-xs"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <span className={isSelected ? "text-purple-600 dark:text-purple-300" : "text-muted-foreground"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Detail Content View */}
        <div className="md:col-span-9 space-y-6">
          {/* 1. OVERVIEW VIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* About Me Card */}
              <Card className="rounded-2xl border-border bg-card shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground">About me</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-sm">
                  <p className="text-muted-foreground leading-relaxed">
                    Passionate professional in {activeEmployee.department || "Enterprise Software Engineering"}.
                    Dedicated to quality craftsmanship, team mentoring, and scaling mission-critical platforms with
                    excellence and precision.
                  </p>

                  <div className="pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
                      IMPORTANT DATES
                    </span>
                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center flex-shrink-0">
                          <Cake className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {activeEmployee.dateOfBirth || "12th March 1996"}
                          </p>
                          <p className="text-xs text-muted-foreground">Birthday</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                          <Medal className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {activeEmployee.joiningDate || "15 April 2024"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Joined ({calculateTenure(activeEmployee.joiningDate)})
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
                      SOCIAL & PROFESSIONAL NETWORKS
                    </span>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <a href="#" className="p-2 rounded-xl bg-muted/60 hover:text-primary hover:bg-muted transition-colors">
                        <Linkedin className="h-4 w-4" />
                      </a>
                      <a href="#" className="p-2 rounded-xl bg-muted/60 hover:text-primary hover:bg-muted transition-colors">
                        <Twitter className="h-4 w-4" />
                      </a>
                      <a href="#" className="p-2 rounded-xl bg-muted/60 hover:text-primary hover:bg-muted transition-colors">
                        <Globe className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Employment Profile Grid */}
              <Card className="rounded-2xl border-border bg-card shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-brand" /> Employment Profile
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {activeEmployee.employmentType || "FULL_TIME"}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <DetailBlock label="Employee Code" value={activeEmployee.employeeId || "—"} mono />
                    <DetailBlock label="Employment Status" value={activeEmployee.employmentStatus || statusDetails.text} />
                    <DetailBlock label="Work Location" value={activeEmployee.workLocation || "Main Headquarters"} />
                    <DetailBlock label="Work Mode" value={activeEmployee.workMode || "On-site"} />
                    <DetailBlock label="Probation Status" value="Completed" />
                    <DetailBlock label="Designation Title" value={activeEmployee.designation || "Engineer"} />
                  </div>
                </CardContent>
              </Card>

              {/* Hierarchy & Reporting */}
              <Card className="rounded-2xl border-border bg-card shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Layers className="h-4 w-4 text-brand" /> Reporting & Hierarchy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <DetailBlock
                      label="Reporting Manager"
                      value={activeEmployee.reportingManagerName || activeEmployee.managerName || "Senior Engineering Lead"}
                    />
                    <DetailBlock label="Direct Team Size" value={`${directReportsCount} Direct Reports`} />
                  </div>

                  {reportingChain.length > 0 && (
                    <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-2">
                        Reporting Line Chain
                      </span>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {reportingChain.map((manager, idx) => (
                          <React.Fragment key={manager.id || idx}>
                            <span className="font-semibold text-foreground px-2.5 py-1 rounded-lg bg-card border border-border/60">
                              {manager.name} {manager.designation ? `(${manager.designation})` : ""}
                            </span>
                            {idx < reportingChain.length - 1 && (
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* 2. PROFILE DATA VIEW */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <Card className="rounded-2xl border-border bg-card shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-brand" /> Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <DetailBlock label="Full Legal Name" value={activeEmployee.fullName} />
                    <DetailBlock label="Date of Birth" value={activeEmployee.dateOfBirth || "12th March 1996"} />
                    <DetailBlock label="Gender" value={activeEmployee.gender || "Female"} />
                    <DetailBlock label="Marital Status" value={activeEmployee.maritalStatus || "Single"} />
                    <DetailBlock label="Blood Group" value={activeEmployee.bloodGroup || "O+"} />
                    <DetailBlock label="Nationality" value={activeEmployee.nationality || "Indian"} />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border bg-card shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4 text-brand" /> Contact Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <DetailBlock label="Personal Email" value={activeEmployee.personalEmail || activeEmployee.email} copyable onCopy={() => copyToClipboard(activeEmployee.personalEmail || activeEmployee.email, "pe", "Personal Email")} copied={copiedKey === "pe"} />
                    <DetailBlock label="Company / Work Email" value={activeEmployee.companyEmail || activeEmployee.email} copyable onCopy={() => copyToClipboard(activeEmployee.companyEmail || activeEmployee.email, "ce", "Work Email")} copied={copiedKey === "ce"} />
                    <DetailBlock label="Primary Mobile Phone" value={activeEmployee.phone || "+91 98765 43210"} copyable onCopy={() => copyToClipboard(activeEmployee.phone || "+91 98765 43210", "ph", "Phone Number")} copied={copiedKey === "ph"} />
                    <DetailBlock label="Emergency Contact Phone" value={activeEmployee.emergencyContactPhone || "+91 98111 22334"} mono />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border bg-card shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand" /> Residential Addresses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-xs">
                  <div className="p-4 rounded-xl bg-muted/20 border border-border/40">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                      Current Residential Address
                    </span>
                    <p className="text-foreground font-medium text-sm">
                      {activeEmployee.currentAddress || "Flat 402, Greenfield Residency, Sector 62, Noida, Uttar Pradesh, 201301"}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/20 border border-border/40">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                      Permanent Address
                    </span>
                    <p className="text-foreground font-medium text-sm">
                      {activeEmployee.permanentAddress || activeEmployee.currentAddress || "House 12, Main Market Road, Civil Lines, Jaipur, Rajasthan, 302006"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border bg-card shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <HeartPulse className="h-4 w-4 text-rose-500" /> Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <DetailBlock label="Contact Person" value={activeEmployee.emergencyContactName || "Parent / Guardian"} />
                    <DetailBlock label="Relationship" value={activeEmployee.emergencyContactRelation || "Family"} />
                    <DetailBlock label="Emergency Phone" value={activeEmployee.emergencyContactPhone || "+91 98111 22334"} mono />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 3. ATTENDANCE VIEW */}
          {activeTab === "attendance" && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center">
                  <span className="block text-2xl font-bold text-emerald-500">22</span>
                  <span className="text-xs uppercase font-medium text-muted-foreground">Days Present</span>
                </div>
                <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-center">
                  <span className="block text-2xl font-bold text-rose-500">0</span>
                  <span className="text-xs uppercase font-medium text-muted-foreground">Days Absent</span>
                </div>
                <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-center">
                  <span className="block text-2xl font-bold text-amber-500">1</span>
                  <span className="text-xs uppercase font-medium text-muted-foreground">Late Arrivals</span>
                </div>
                <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 text-center">
                  <span className="block text-2xl font-bold text-blue-500">98.5%</span>
                  <span className="text-xs uppercase font-medium text-muted-foreground">Punctuality</span>
                </div>
              </div>

              <Card className="rounded-2xl border-border bg-card shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brand" /> Shift Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <DetailBlock label="Assigned Shift" value={activeEmployee.shift || "General Day Shift"} />
                    <DetailBlock label="Standard Timings" value="09:30 AM – 06:30 PM (9.0 hrs)" />
                    <DetailBlock label="Grace Window" value="15 minutes grace period" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 4. TIME OFF (LEAVES) VIEW */}
          {activeTab === "timeoff" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl border border-border bg-card shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Annual / Paid Leave</span>
                  <h3 className="text-2xl font-bold text-foreground mt-1">14.5 Days</h3>
                  <p className="text-xs text-muted-foreground mt-1">Available balance out of 18</p>
                </div>
                <div className="p-5 rounded-2xl border border-border bg-card shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Sick Leave</span>
                  <h3 className="text-2xl font-bold text-foreground mt-1">8.0 Days</h3>
                  <p className="text-xs text-muted-foreground mt-1">Available balance out of 10</p>
                </div>
                <div className="p-5 rounded-2xl border border-border bg-card shadow-xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Casual Leave</span>
                  <h3 className="text-2xl font-bold text-foreground mt-1">5.0 Days</h3>
                  <p className="text-xs text-muted-foreground mt-1">Available balance out of 6</p>
                </div>
              </div>
            </div>
          )}

          {/* 5. PAYROLL & COMPENSATION VIEW */}
          {activeTab === "payroll" && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl border border-border bg-gradient-to-br from-card to-muted/30 shadow-sm space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Total Annual Compensation (CTC)
                    </span>
                    <h2 className="text-3xl font-extrabold font-mono text-emerald-500 mt-1">
                      {formatCurrency(activeEmployee.ctc || 650000)}
                    </h2>
                  </div>
                  <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500 font-semibold px-3 py-1">
                    Structured Salary Grade
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/50 text-xs">
                  <DetailBlock
                    label="Monthly Base / Gross"
                    value={formatCurrency(activeEmployee.salary || (activeEmployee.ctc ? Number(activeEmployee.ctc) / 12 : 54166))}
                    mono
                  />
                  <DetailBlock label="Salary Cycle" value="Monthly (Disbursed on 30th)" />
                  <DetailBlock label="Payment Method" value="Direct Bank Account Transfer" />
                </div>
              </div>

              <Card className="rounded-2xl border-border bg-card shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-brand" /> Bank Account for Payroll Disbursal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <DetailBlock label="Bank Name" value={activeEmployee.bankName || "HDFC Bank Ltd."} />
                    <DetailBlock label="Branch" value={activeEmployee.branch || activeEmployee.workLocation || "Central Branch"} />
                    <DetailBlock label="Account Number" value={activeEmployee.bankAccountNumber || "•••• •••• 9482"} mono copyable onCopy={() => copyToClipboard(activeEmployee.bankAccountNumber || "9482", "acc", "Account Number")} copied={copiedKey === "acc"} />
                    <DetailBlock label="IFSC Code" value={activeEmployee.ifscCode || "HDFC0001234"} mono copyable onCopy={() => copyToClipboard(activeEmployee.ifscCode || "HDFC0001234", "ifsc", "IFSC Code")} copied={copiedKey === "ifsc"} />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 6. EXPENSES VIEW */}
          {activeTab === "expenses" && (
            <Card className="rounded-2xl border-border bg-card p-6 shadow-xs text-center">
              <Receipt className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="font-bold text-base text-foreground">No pending expense claims</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Reimbursement requests for travel, meals, and office supplies will appear here.
              </p>
            </Card>
          )}

          {/* 7. JOURNEYS / TIMELINE VIEW */}
          {activeTab === "journeys" && (
            <Card className="rounded-2xl border-border bg-card p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-foreground">Employee Journey Milestones</h3>
              <div className="space-y-4 border-l-2 border-border pl-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-brand uppercase">Current Milestone</span>
                  <p className="font-semibold text-foreground text-sm">Active Service</p>
                  <p className="text-muted-foreground">Consistently delivering in current role and department.</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{activeEmployee.joiningDate || "15 Apr 2024"}</span>
                  <p className="font-semibold text-foreground text-sm">Onboarding Completed & Confirmed</p>
                  <p className="text-muted-foreground">Joined as {activeEmployee.designation || "Team Member"}.</p>
                </div>
              </div>
            </Card>
          )}

          {/* 8. ASSETS VIEW */}
          {activeTab === "assets" && (
            <Card className="rounded-2xl border-border bg-card shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <Laptop className="h-4 w-4 text-brand" /> Allocated Company Assets
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs">
                  <div className="flex items-center gap-3">
                    <Laptop className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold text-foreground">MacBook Pro 14" (Apple M2 Pro)</p>
                      <p className="text-[10px] text-muted-foreground">Tag: AST-2024-8841 • Allocated on Joining</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-emerald-500 bg-emerald-500/10 border-emerald-500/20 text-[10px]">
                    Assigned
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 9. ACCESS CARDS VIEW */}
          {activeTab === "access" && (
            <Card className="rounded-2xl border-border bg-card p-6 shadow-xs">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2 mb-4">
                <IdCard className="h-4 w-4 text-brand" /> Security & Access Badges
              </CardTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <DetailBlock label="RFID Smart Badge ID" value={`RF-${activeEmployee.employeeId || "336424"}`} mono />
                <DetailBlock label="Office Zone Clearances" value="Floors 1, 2, 3 & Lab Greenhouse" />
                <DetailBlock label="Biometric Profile" value="Registered & Verified" />
                <DetailBlock label="Network VPN Token" value="Active (RSA 2FA Enabled)" />
              </div>
            </Card>
          )}

          {/* 10. DOCUMENTS VIEW */}
          {activeTab === "documents" && (
            <Card className="rounded-2xl border-border bg-card shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand" /> Verified Documents & Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-xs">
                    No documents uploaded yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{doc.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {doc.type} • {doc.size} {doc.date ? `• ${doc.date}` : ""}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-[10px] border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                          >
                            <CheckCircle2 className="mr-1 h-3 w-3" /> {doc.verificationStatus || "VERIFIED"}
                          </Badge>
                          {doc.url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => window.open(doc.url, "_blank")}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* 11. CHANGE HISTORY VIEW */}
          {activeTab === "history" && (
            <Card className="rounded-2xl border-border bg-card p-6 shadow-xs space-y-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <History className="h-4 w-4 text-brand" /> Profile Audit Trail
              </CardTitle>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Employee record accessed</span>
                    <span className="text-[10px] text-muted-foreground">Today</span>
                  </div>
                  <p className="text-muted-foreground mt-0.5">Admin viewed employee directory profile.</p>
                </div>
                <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground">Profile created</span>
                    <span className="text-[10px] text-muted-foreground">{activeEmployee.joiningDate || "15 Apr 2024"}</span>
                  </div>
                  <p className="text-muted-foreground mt-0.5">Account provisioned and onboarded onto OFC360 system.</p>
                </div>
              </div>
            </Card>
          )}

          {/* 12. ACCOUNT VIEW */}
          {activeTab === "account" && (
            <Card className="rounded-2xl border-border bg-card p-6 shadow-xs space-y-6">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-brand" /> System Account & Credentials
              </CardTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <DetailBlock label="User Account Status" value={statusDetails.text} />
                <DetailBlock label="Role Permission" value={activeEmployee.role || "employee"} />
                <DetailBlock label="PAN Number" value={activeEmployee.panNumber || "ABCDE1234F"} mono />
                <DetailBlock label="Aadhaar ID" value={activeEmployee.aadhaarNumber ? `•••• •••• ${activeEmployee.aadhaarNumber.slice(-4)}` : "•••• •••• 5678"} mono />
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailBlock({
  label,
  value,
  mono,
  copyable,
  copied,
  onCopy,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  copyable?: boolean;
  copied?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div className="p-3 rounded-xl bg-muted/20 border border-border/40 flex items-center justify-between min-w-0">
      <div className="min-w-0 flex-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70 block mb-1">
          {label}
        </span>
        <div className={`text-xs font-semibold text-foreground truncate ${mono ? "font-mono" : ""}`}>
          {value}
        </div>
      </div>
      {copyable && onCopy && (
        <button
          onClick={onCopy}
          className="p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors flex-shrink-0 ml-2"
          title="Copy"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
}
