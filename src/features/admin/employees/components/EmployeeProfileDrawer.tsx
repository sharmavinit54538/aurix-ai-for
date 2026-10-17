"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Building,
  MapPin,
  Briefcase,
  Clock,
  Shield,
  CreditCard,
  Landmark,
  FileText,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Edit3,
  Key,
  UserMinus,
  UserCheck,
  Send,
  ChevronRight,
  DollarSign,
  Download,
  Link2,
  Sparkles,
  Layers,
  HeartPulse,
} from "lucide-react";
import { toast } from "sonner";
import apiInstance from "@/api/apiInstance";
import type { Employee } from "../employeesTypes";
import { getEmployeeStatusDetails } from "../utils/employeeStatus";

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

interface CompleteEmployeeData extends Employee {
  reportingChain?: ReportingChainItem[];
  directReportsCount?: number;
  orgLevel?: number;
}

interface EmployeeProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onEdit?: (employee: Employee) => void;
  onResendInvite?: (id: string) => void;
  onResetPassword?: (id: string) => void;
  onDeactivate?: (id: string) => void;
  onActivate?: (id: string) => void;
  onDelete?: (id: string) => void;
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
  if (!joiningDateStr) return "—";
  try {
    const start = new Date(joiningDateStr);
    if (isNaN(start.getTime())) return "—";
    const now = new Date();
    const monthsTotal = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    if (monthsTotal < 1) return "Just joined";
    const years = Math.floor(monthsTotal / 12);
    const months = monthsTotal % 12;
    if (years === 0) return `${months} month${months > 1 ? "s" : ""}`;
    if (months === 0) return `${years} year${years > 1 ? "s" : ""}`;
    return `${years} yr ${months} mo`;
  } catch {
    return "—";
  }
}

function formatCurrency(val?: string | number): string {
  if (val === undefined || val === null || val === "") return "—";
  const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.-]+/g, ""));
  if (isNaN(num)) return String(val);
  return `₹ ${num.toLocaleString("en-IN")}`;
}

export function EmployeeProfileDrawer({
  open,
  onOpenChange,
  employee,
  onEdit,
  onResendInvite,
  onResetPassword,
  onDeactivate,
  onActivate,
}: EmployeeProfileDrawerProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [completeData, setCompleteData] = useState<CompleteEmployeeData | null>(null);
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  // Initialize and synchronize full profile data
  useEffect(() => {
    if (!employee || !open) {
      setCompleteData(null);
      setDocuments([]);
      return;
    }

    setCompleteData({ ...employee });
    let isCurrent = true;
    setIsSyncing(true);

    const empId = employee.id;
    const empCode = employee.employeeId;

    async function fetchFullProfile() {
      try {
        const results = await Promise.allSettled([
          // 1. Direct Employee Record
          apiInstance.get(`/employees/${empId}`),
          // 2. Onboarding Details
          apiInstance.get(`/admin/employee-onboarding/${empId}`),
          // 3. Documents
          apiInstance.get("/documents/employees", {
            params: { employee_id: empId || empCode, limit: 20 },
          }),
          // 4. Hierarchy Information
          apiInstance.get(`/hierarchy/${empId}`),
          // 5. Compensation
          apiInstance.get(`/api/v2/payroll/employees/${empId}/compensation`, {
            headers: { "Cache-Control": "no-store" },
          }),
        ]);

        if (!isCurrent) return;

        setCompleteData((prev) => {
          if (!prev) return prev;
          const merged: CompleteEmployeeData = { ...prev };

          // Parse Employee Direct Record
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
              merged.avatarUrl = merged.avatarUrl || (raw.avatar_url || raw.profile_photo_url ? String(raw.avatar_url || raw.profile_photo_url) : undefined);
            }
          }

          // Parse Onboarding Details
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

          // Parse Hierarchy Information
          const hierRes = results[3];
          if (hierRes.status === "fulfilled" && hierRes.value?.data) {
            const hier = (hierRes.value.data.data ?? hierRes.value.data) as Record<string, any>;
            if (hier && typeof hier === "object") {
              if (hier.manager) {
                const mName = [hier.manager.first_name, hier.manager.last_name].filter(Boolean).join(" ").trim() || hier.manager.name;
                merged.reportingManagerName = mName || merged.reportingManagerName || merged.managerName;
              }
              if (Array.isArray(hier.reporting_chain) && hier.reporting_chain.length > 0) {
                merged.reportingChain = hier.reporting_chain.map((c: any) => ({
                  id: c.id,
                  name: [c.first_name, c.last_name].filter(Boolean).join(" ").trim() || c.name || "Manager",
                  designation: c.designation,
                  department: c.department,
                }));
              }
              if (hier.organization_level !== undefined) {
                merged.orgLevel = Number(hier.organization_level);
              }
              if (Array.isArray(hier.direct_reports)) {
                merged.directReportsCount = hier.direct_reports.length;
              }
            }
          }

          // Parse Compensation
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

        // Parse Documents
        const docRes = results[2];
        if (docRes.status === "fulfilled" && docRes.value?.data) {
          const rawDocs = docRes.value.data.data?.items ?? docRes.value.data?.items ?? docRes.value.data ?? [];
          if (Array.isArray(rawDocs)) {
            const parsedDocs: EmployeeDocument[] = rawDocs.map((d: any) => ({
              id: String(d.id || Math.random()),
              name: String(d.name || d.document_name || d.title || "Employee Document"),
              type: d.document_type || d.type || "Document",
              size: d.size || d.file_size || "1.2 MB",
              date: (d.created_at || d.upload_date || d.date ? String(d.created_at || d.upload_date || d.date).split("T")[0] : undefined),
              url: d.url || d.file_url || d.download_url,
              verificationStatus: d.verification_status || d.status || "VERIFIED",
            }));
            setDocuments(parsedDocs);
          }
        }
      } catch {
        // Safe fallback - keep existing employee data
      } finally {
        if (isCurrent) setIsSyncing(false);
      }
    }

    fetchFullProfile();

    return () => {
      isCurrent = false;
    };
  }, [employee, open]);

  const activeEmployee = completeData || employee;
  const statusDetails = useMemo(() => {
    return activeEmployee ? getEmployeeStatusDetails(activeEmployee) : null;
  }, [activeEmployee]);

  if (!open || !activeEmployee) return null;

  function copyToClipboard(text: string, key: string, label: string) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  function copyInviteLink() {
    if (!activeEmployee) return;
    const link = `${window.location.origin}/onboarding?token=${activeEmployee.activationToken || ""}`;
    navigator.clipboard.writeText(link);
    toast.success("Invitation link copied to clipboard");
  }

  const hue = avatarHue(activeEmployee.fullName);
  const initials = activeEmployee.fullName
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase() || "EM";

  const isInvited = statusDetails?.text === "INVITED" || statusDetails?.text === "EXPIRED";
  const isActive = statusDetails?.text === "ACTIVE";
  const isDisabled = statusDetails?.text === "DISABLED";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl border-l border-border bg-card/95 backdrop-blur-2xl p-0 shadow-2xl flex flex-col h-full">
        {/* Header Section */}
        <SheetHeader className="p-6 border-b border-border/60 bg-muted/10">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
              {activeEmployee.profilePhotoUrl || activeEmployee.avatarUrl ? (
                <img
                  src={activeEmployee.profilePhotoUrl || activeEmployee.avatarUrl}
                  alt={activeEmployee.fullName}
                  className="h-16 w-16 rounded-2xl object-cover border border-border shadow-md ring-2 ring-primary/20"
                />
              ) : (
                <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl font-bold text-white shadow-md text-xl flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, hsl(${hue}, 75%, 55%), hsl(${(hue + 45) % 360}, 80%, 45%))`,
                  }}
                >
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <SheetTitle className="text-xl font-bold truncate text-foreground flex items-center gap-2">
                  <span>{activeEmployee.fullName}</span>
                  {isSyncing && (
                    <span className="flex items-center gap-1 text-[10px] font-normal text-muted-foreground animate-pulse">
                      <Sparkles className="h-3 w-3 text-brand" /> Syncing
                    </span>
                  )}
                </SheetTitle>
                <p className="text-sm font-medium text-muted-foreground truncate">
                  {activeEmployee.designation || "Employee"} · {activeEmployee.department || "General"}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {statusDetails && (
                    <Badge
                      variant={statusDetails.variant}
                      className={
                        statusDetails.text === "ACTIVE"
                          ? "border-transparent bg-emerald-500/15 text-emerald-500 font-semibold"
                          : statusDetails.text === "PENDING"
                            ? "border-transparent bg-amber-500/15 text-amber-500 font-semibold"
                            : statusDetails.text === "DISABLED"
                              ? "border-transparent bg-destructive/15 text-destructive font-semibold"
                              : "border-transparent bg-blue-500/15 text-blue-500 font-semibold"
                      }
                    >
                      {statusDetails.text}
                    </Badge>
                  )}

                  {activeEmployee.employeeId && (
                    <button
                      onClick={() => copyToClipboard(activeEmployee.employeeId, "empId", "Employee ID")}
                      className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-mono font-medium text-muted-foreground hover:bg-muted/80 transition-colors"
                      title="Click to copy ID"
                    >
                      <span>{activeEmployee.employeeId}</span>
                      {copiedKey === "empId" ? (
                        <Check className="h-3 w-3 text-emerald-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  )}

                  {activeEmployee.shift && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="mr-1 h-3 w-3 text-muted-foreground" /> {activeEmployee.shift}
                    </Badge>
                  )}

                  {activeEmployee.role && (
                    <Badge variant="secondary" className="capitalize text-xs">
                      <Shield className="mr-1 h-3 w-3 text-muted-foreground" /> {activeEmployee.role}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Edit Action Button in Header */}
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(activeEmployee);
                }}
                className="gap-1.5 shadow-sm hover:bg-primary hover:text-primary-foreground flex-shrink-0"
              >
                <Edit3 className="h-3.5 w-3.5" />
                <span>Edit</span>
              </Button>
            )}
          </div>

          {/* Quick Lifecycle Actions Bar */}
          <div className="flex flex-wrap items-center gap-2 pt-3 mt-3 border-t border-border/40">
            {isInvited && (
              <>
                {onResendInvite && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => onResendInvite(activeEmployee.id)}
                  >
                    <Send className="h-3 w-3" /> Resend Invite
                  </Button>
                )}
                {activeEmployee.activationToken && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={copyInviteLink}
                  >
                    <Link2 className="h-3 w-3" /> Copy Link
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
                    className="h-7 text-xs gap-1"
                    onClick={() => onResetPassword(activeEmployee.id)}
                  >
                    <Key className="h-3 w-3" /> Reset Password
                  </Button>
                )}
                {onDeactivate && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      onOpenChange(false);
                      onDeactivate(activeEmployee.id);
                    }}
                  >
                    <UserMinus className="h-3 w-3" /> Deactivate
                  </Button>
                )}
              </>
            )}

            {isDisabled && onActivate && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs gap-1 text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-500"
                onClick={() => {
                  onOpenChange(false);
                  onActivate(activeEmployee.id);
                }}
              >
                <UserCheck className="h-3 w-3" /> Activate Account
              </Button>
            )}
          </div>
        </SheetHeader>

        {/* Tabbed Content Area */}
        <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
          <div className="px-6 pt-3 border-b border-border/40 bg-card">
            <TabsList className="grid grid-cols-5 w-full bg-muted/40 p-1 rounded-xl">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="personal" className="text-xs">Personal</TabsTrigger>
              <TabsTrigger value="identity" className="text-xs">Identity & Bank</TabsTrigger>
              <TabsTrigger value="compensation" className="text-xs">Salary</TabsTrigger>
              <TabsTrigger value="documents" className="text-xs">Docs ({documents.length})</TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="flex-1 p-6">
            <div className="space-y-6 pb-8">
              {/* TAB 1: OVERVIEW & EMPLOYMENT */}
              <TabsContent value="overview" className="mt-0 space-y-5">
                {/* Primary Quick Info Grid */}
                <div className="grid grid-cols-2 gap-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
                  <InfoItem
                    icon={<Mail className="h-4 w-4" />}
                    label="Primary Email"
                    value={activeEmployee.email}
                    copyable
                    onCopy={() => copyToClipboard(activeEmployee.email, "email", "Email")}
                    copied={copiedKey === "email"}
                  />
                  <InfoItem
                    icon={<Phone className="h-4 w-4" />}
                    label="Phone Number"
                    value={activeEmployee.phone || "—"}
                    copyable={Boolean(activeEmployee.phone)}
                    onCopy={() => copyToClipboard(activeEmployee.phone, "phone", "Phone")}
                    copied={copiedKey === "phone"}
                  />
                  <InfoItem
                    icon={<Building className="h-4 w-4" />}
                    label="Department"
                    value={activeEmployee.department || "—"}
                  />
                  <InfoItem
                    icon={<Briefcase className="h-4 w-4" />}
                    label="Designation"
                    value={activeEmployee.designation || "—"}
                  />
                  <InfoItem
                    icon={<Calendar className="h-4 w-4" />}
                    label="Joining Date"
                    value={
                      activeEmployee.joiningDate
                        ? `${activeEmployee.joiningDate} (${calculateTenure(activeEmployee.joiningDate)})`
                        : "—"
                    }
                  />
                  <InfoItem
                    icon={<Clock className="h-4 w-4" />}
                    label="Shift Schedule"
                    value={activeEmployee.shift || "General (Standard Hours)"}
                  />
                </div>

                {/* Job & Organization Card */}
                <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-brand" /> Employment Profile
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <DetailBlock label="Employee Code" value={activeEmployee.employeeId || "—"} mono />
                    <DetailBlock label="Employment Type" value={activeEmployee.employmentType || "Full-Time (Permanent)"} />
                    <DetailBlock label="Employment Status" value={activeEmployee.employmentStatus || statusDetails?.text || "Confirmed"} />
                    <DetailBlock label="Work Location" value={activeEmployee.workLocation || "Main Office"} />
                    <DetailBlock label="Work Mode" value={activeEmployee.workMode || "On-site"} />
                    <DetailBlock
                      label="Probation Period"
                      value={activeEmployee.probationPeriodMonths ? `${activeEmployee.probationPeriodMonths} Months` : "Completed"}
                    />
                  </div>
                </div>

                {/* Reporting & Hierarchy Card */}
                <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-brand" /> Reporting & Hierarchy
                  </h4>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <DetailBlock
                      label="Reporting Manager"
                      value={activeEmployee.reportingManagerName || activeEmployee.managerName || "Direct Leadership"}
                    />
                    <DetailBlock
                      label="Organization Level"
                      value={activeEmployee.orgLevel !== undefined ? `Level ${activeEmployee.orgLevel}` : "Level 1"}
                    />
                    {activeEmployee.directReportsCount !== undefined && activeEmployee.directReportsCount > 0 && (
                      <DetailBlock
                        label="Direct Reports"
                        value={`${activeEmployee.directReportsCount} Employee${activeEmployee.directReportsCount > 1 ? "s" : ""}`}
                      />
                    )}
                  </div>

                  {activeEmployee.reportingChain && activeEmployee.reportingChain.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-border/40">
                      <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
                        Reporting Chain Path
                      </span>
                      <div className="flex flex-wrap items-center gap-1.5 text-xs">
                        {activeEmployee.reportingChain.map((ancestor, idx) => (
                          <React.Fragment key={ancestor.id || idx}>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted/60 font-medium text-foreground">
                              {ancestor.name} {ancestor.designation ? `(${ancestor.designation})` : ""}
                            </span>
                            {idx < activeEmployee.reportingChain!.length - 1 && (
                              <ChevronRight className="h-3 w-3 text-muted-foreground" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* TAB 2: PERSONAL & CONTACT */}
              <TabsContent value="personal" className="mt-0 space-y-5">
                <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-brand" /> Personal Information
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <DetailBlock label="First Name" value={activeEmployee.firstName || activeEmployee.fullName.split(" ")[0]} />
                    <DetailBlock label="Last Name" value={activeEmployee.lastName || activeEmployee.fullName.split(" ").slice(1).join(" ") || "—"} />
                    <DetailBlock label="Date of Birth" value={activeEmployee.dateOfBirth || "—"} />
                    <DetailBlock label="Gender" value={activeEmployee.gender || "—"} />
                    <DetailBlock label="Marital Status" value={activeEmployee.maritalStatus || "—"} />
                    <DetailBlock
                      label="Blood Group"
                      value={
                        activeEmployee.bloodGroup ? (
                          <Badge variant="outline" className="text-xs font-bold text-rose-500 bg-rose-500/10 border-rose-500/20">
                            {activeEmployee.bloodGroup}
                          </Badge>
                        ) : "—"
                      }
                    />
                    <DetailBlock label="Nationality" value={activeEmployee.nationality || "Indian"} />
                    <DetailBlock label="Preferred Language" value={activeEmployee.preferredLanguage || "English"} />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-brand" /> Contact & Communication
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <InfoItem
                      icon={<Mail className="h-4 w-4" />}
                      label="Personal Email"
                      value={activeEmployee.personalEmail || activeEmployee.email}
                      copyable
                      onCopy={() => copyToClipboard(activeEmployee.personalEmail || activeEmployee.email, "pmail", "Personal email")}
                      copied={copiedKey === "pmail"}
                    />
                    <InfoItem
                      icon={<Building className="h-4 w-4" />}
                      label="Work / Company Email"
                      value={activeEmployee.companyEmail || activeEmployee.email}
                      copyable
                      onCopy={() => copyToClipboard(activeEmployee.companyEmail || activeEmployee.email, "cmail", "Company email")}
                      copied={copiedKey === "cmail"}
                    />
                    <InfoItem
                      icon={<Phone className="h-4 w-4" />}
                      label="Phone / Mobile"
                      value={activeEmployee.phone || "—"}
                      copyable={Boolean(activeEmployee.phone)}
                      onCopy={() => copyToClipboard(activeEmployee.phone, "phone2", "Phone")}
                      copied={copiedKey === "phone2"}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-brand" /> Address Details
                  </h4>
                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
                      <span className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">
                        Current Residential Address
                      </span>
                      <p className="text-foreground">{activeEmployee.currentAddress || "Not provided during intake"}</p>
                    </div>
                    {activeEmployee.permanentAddress && (
                      <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
                        <span className="text-[10px] font-semibold uppercase text-muted-foreground block mb-1">
                          Permanent Address
                        </span>
                        <p className="text-foreground">{activeEmployee.permanentAddress}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <HeartPulse className="h-3.5 w-3.5 text-rose-500" /> Emergency Contact
                  </h4>
                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <DetailBlock label="Contact Person" value={activeEmployee.emergencyContactName || "—"} />
                    <DetailBlock label="Relationship" value={activeEmployee.emergencyContactRelation || "—"} />
                    <DetailBlock label="Emergency Phone" value={activeEmployee.emergencyContactPhone || "—"} mono />
                  </div>
                </div>
              </TabsContent>

              {/* TAB 3: IDENTITY & BANK */}
              <TabsContent value="identity" className="mt-0 space-y-5">
                <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-brand" /> Statutory & Government Identity
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <InfoItem
                      icon={<CreditCard className="h-4 w-4" />}
                      label="PAN Card Number"
                      value={activeEmployee.panNumber || "—"}
                      mono
                      copyable={Boolean(activeEmployee.panNumber)}
                      onCopy={() => copyToClipboard(activeEmployee.panNumber || "", "pan", "PAN")}
                      copied={copiedKey === "pan"}
                    />
                    <InfoItem
                      icon={<CreditCard className="h-4 w-4" />}
                      label="Aadhaar Card Number"
                      value={activeEmployee.aadhaarNumber ? `•••• •••• ${activeEmployee.aadhaarNumber.slice(-4)}` : "—"}
                      mono
                      copyable={Boolean(activeEmployee.aadhaarNumber)}
                      onCopy={() => copyToClipboard(activeEmployee.aadhaarNumber || "", "aadhaar", "Aadhaar")}
                      copied={copiedKey === "aadhaar"}
                    />
                    <InfoItem
                      icon={<Shield className="h-4 w-4" />}
                      label="Universal Account Number (UAN)"
                      value={activeEmployee.uanNumber || "—"}
                      mono
                    />
                    <InfoItem
                      icon={<Shield className="h-4 w-4" />}
                      label="ESI Insurance Number"
                      value={activeEmployee.esiNumber || "—"}
                      mono
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Landmark className="h-3.5 w-3.5 text-brand" /> Banking & Salary Disbursal
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <InfoItem
                      icon={<Landmark className="h-4 w-4" />}
                      label="Bank Name"
                      value={activeEmployee.bankName || "HDFC Bank Ltd."}
                    />
                    <InfoItem
                      icon={<Building className="h-4 w-4" />}
                      label="Branch"
                      value={activeEmployee.branch || activeEmployee.workLocation || "Main Branch"}
                    />
                    <InfoItem
                      icon={<CreditCard className="h-4 w-4" />}
                      label="Account Number"
                      value={activeEmployee.bankAccountNumber || "—"}
                      mono
                      copyable={Boolean(activeEmployee.bankAccountNumber)}
                      onCopy={() => copyToClipboard(activeEmployee.bankAccountNumber || "", "bankAcc", "Account number")}
                      copied={copiedKey === "bankAcc"}
                    />
                    <InfoItem
                      icon={<CreditCard className="h-4 w-4" />}
                      label="IFSC Code"
                      value={activeEmployee.ifscCode || "—"}
                      mono
                      copyable={Boolean(activeEmployee.ifscCode)}
                      onCopy={() => copyToClipboard(activeEmployee.ifscCode || "", "ifsc", "IFSC Code")}
                      copied={copiedKey === "ifsc"}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* TAB 4: COMPENSATION */}
              <TabsContent value="compensation" className="mt-0 space-y-5">
                <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-card to-muted/20 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        Annual Compensation (CTC)
                      </span>
                      <h3 className="text-2xl font-bold font-mono text-emerald-500 mt-1">
                        {formatCurrency(activeEmployee.ctc || 600000)}
                      </h3>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                      Active Structure
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-border/50 text-xs">
                    <DetailBlock
                      label="Monthly Base / Gross"
                      value={formatCurrency(activeEmployee.salary || (activeEmployee.ctc ? Number(activeEmployee.ctc) / 12 : 50000))}
                      mono
                    />
                    <DetailBlock label="Pay Cycle" value="Monthly (End of Month)" />
                    <DetailBlock label="Disbursal Mode" value="Direct Bank Transfer" />
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card p-4 space-y-2 text-xs">
                  <h4 className="font-semibold text-foreground">Tax & Statutory Deductions</h4>
                  <p className="text-muted-foreground">
                    Tax calculations (TDS, EPF Employee Contribution, Professional Tax) are processed dynamically during
                    payroll runs according to statutory compliance declarations.
                  </p>
                </div>
              </TabsContent>

              {/* TAB 5: DOCUMENTS */}
              <TabsContent value="documents" className="mt-0 space-y-4">
                {documents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center rounded-2xl border border-dashed border-border p-6">
                    <FileText className="h-10 w-10 text-muted-foreground/40 mb-3" />
                    <p className="text-sm font-semibold text-foreground">No documents uploaded yet</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                      When onboarding forms or employee verification papers are submitted, they will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-border/60 bg-card hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{doc.name}</p>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
                              <span>{doc.size}</span>
                              {doc.date && <span>• {doc.date}</span>}
                              {doc.verificationStatus && (
                                <Badge
                                  variant="outline"
                                  className={`text-[9px] py-0 px-1.5 ${
                                    doc.verificationStatus === "VERIFIED"
                                      ? "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
                                      : "text-amber-500 border-amber-500/20 bg-amber-500/5"
                                  }`}
                                >
                                  {doc.verificationStatus}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {doc.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => window.open(doc.url, "_blank")}
                            title="Download document"
                          >
                            <Download className="h-4 w-4 text-muted-foreground" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function DetailBlock({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="p-2.5 rounded-xl bg-muted/20 border border-border/40">
      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70 block mb-1">
        {label}
      </span>
      <div className={`text-xs font-medium text-foreground truncate ${mono ? "font-mono" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
  mono,
  copyable,
  copied,
  onCopy,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
  copyable?: boolean;
  copied?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div className="flex items-center gap-2.5 min-w-0 p-2.5 rounded-xl bg-card border border-border/50">
      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">{label}</p>
        <p className={`text-xs font-medium truncate text-foreground ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
      {copyable && onCopy && (
        <button
          onClick={onCopy}
          className="p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors flex-shrink-0"
          title="Copy"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
}
