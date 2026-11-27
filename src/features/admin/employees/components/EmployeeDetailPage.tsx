"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
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
  Sparkles,
  Laptop,
  History,
  Plane,
  Wallet,
  Layers,
  HeartPulse,
  Receipt,
  IdCard,
  CheckCircle,
  ArrowLeft,
  Bell,
  Building2,
  Users,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import apiInstance from "@/api/apiInstance";
import expensesApi from "@/services/expensesApi";
import type { Employee } from "../employeesTypes";
import { getEmployeeStatusDetails } from "../utils/employeeStatus";
import { EmployeeAvatar } from "./EmployeeAvatar";

interface EmployeeDetailPageProps {
  employee: Employee;
  onBack?: () => void;
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

interface LeaveBalanceItem {
  leave_type: string;
  total_days: number;
  used_days: number;
  remaining_days: number;
}

interface AssetItem {
  id: string;
  tag?: string;
  name?: string;
  category?: string;
  model?: string;
  status?: string;
  assignedAt?: string;
}

interface ExpenseItem {
  id: string;
  category: string;
  amount: number;
  currency: string;
  date: string;
  status: string;
  description?: string;
}

interface AttendanceMetrics {
  presentDays: number;
  absentDays: number;
  lateDays: number;
  punctuality?: string;
}

type SectionErrorKey =
  | "profile"
  | "onboarding"
  | "documents"
  | "hierarchy"
  | "compensation"
  | "leaves"
  | "assets"
  | "expenses"
  | "attendance";

function formatApiError(reason: unknown, fallback: string): string {
  const err = reason as any;
  const statusCode = err?.response?.status ?? err?.status;
  const serverMsg =
    err?.response?.data?.message ||
    err?.response?.data?.detail ||
    (Array.isArray(err?.response?.data?.errors) && err.response.data.errors[0]?.message) ||
    err?.message;
  const msg = serverMsg ? String(serverMsg) : fallback;
  return statusCode ? `HTTP ${statusCode}: ${msg}` : msg;
}

function formatDocumentSize(rawSize: unknown): string {
  if (rawSize === undefined || rawSize === null || rawSize === "") return "—";
  if (typeof rawSize === "string" && /[a-zA-Z]/.test(rawSize)) return rawSize;
  const bytes = Number(rawSize);
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalanceItem[]>([]);
  const [assignedAssets, setAssignedAssets] = useState<AssetItem[]>([]);
  const [employeeExpenses, setEmployeeExpenses] = useState<ExpenseItem[]>([]);
  const [expensesTotal, setExpensesTotal] = useState<number>(0);
  const [attendanceMetrics, setAttendanceMetrics] = useState<AttendanceMetrics | null>(null);
  const [apiErrors, setApiErrors] = useState<Partial<Record<SectionErrorKey, string>>>({});
  const [isSyncing, setIsSyncing] = useState<boolean>(true);

  useEffect(() => {
    let isCurrent = true;
    setIsSyncing(true);
    setCompleteData({ ...employee });
    setDocuments([]);
    setReportingChain([]);
    setDirectReportsCount(0);
    setLeaveBalances([]);
    setAssignedAssets([]);
    setEmployeeExpenses([]);
    setExpensesTotal(0);
    setAttendanceMetrics(null);
    setApiErrors({});

    const empId = employee.id;
    const empCode = employee.employeeId;

    async function fetchFullProfile() {
      try {
        const results = await Promise.allSettled([
          apiInstance.get(`/employees/${empId}`),
          apiInstance.get(`/admin/employee-onboarding/${empId}`),
          apiInstance.get("/documents/employees", {
            params: { employee_id: empId || empCode, limit: 50 },
          }),
          apiInstance.get(`/hierarchy/${empId}`),
          apiInstance.get(`/api/v2/payroll/employees/${empId}/compensation`, {
            headers: { "Cache-Control": "no-store" },
          }),
          apiInstance.get(`/leaves/balances/${empId}`),
          apiInstance.get("/api/v1/assets", {
            params: { limit: 30 },
          }),
          expensesApi.getEmployeeExpenses(empId, { page: 1, limit: 30 }),
          apiInstance.get("/attendance/records", {
            params: { employee_id: empId || empCode, limit: 1 },
          }),
        ]);

        if (!isCurrent) return;

        const nextErrors: Partial<Record<SectionErrorKey, string>> = {};
        if (results[0].status === "rejected") {
          nextErrors.profile = formatApiError(results[0].reason, "Failed to load employee profile.");
        }
        if (results[1].status === "rejected") {
          nextErrors.onboarding = formatApiError(results[1].reason, "Failed to load onboarding profile.");
        }
        if (results[3].status === "rejected") {
          nextErrors.hierarchy = formatApiError(results[3].reason, "Failed to load reporting hierarchy.");
        }
        if (results[4].status === "rejected") {
          nextErrors.compensation = formatApiError(results[4].reason, "Failed to load payroll compensation.");
        }

        setCompleteData((prev) => {
          const merged: Employee = { ...prev };

          const empRes = results[0];
          if (empRes.status === "fulfilled" && empRes.value?.data) {
            const raw = (empRes.value.data.data ?? empRes.value.data) as Record<string, unknown>;
            if (raw && typeof raw === "object") {
              if (raw.first_name) merged.firstName = String(raw.first_name);
              if (raw.last_name) merged.lastName = String(raw.last_name);
              if (raw.personal_email) merged.personalEmail = String(raw.personal_email);
              if (raw.company_email) merged.companyEmail = String(raw.company_email);
              if (raw.employment_type) merged.employmentType = String(raw.employment_type);
              if (raw.employment_status) merged.employmentStatus = String(raw.employment_status);
              if (raw.work_location || raw.branch || raw.city || raw.location) {
                merged.workLocation = String(raw.work_location || raw.branch || raw.city || raw.location);
              }
              if (raw.work_mode) merged.workMode = String(raw.work_mode);
              if (raw.gender) merged.gender = String(raw.gender);
              if (raw.date_of_birth || raw.dob) merged.dateOfBirth = String(raw.date_of_birth || raw.dob).split("T")[0];
              if (raw.blood_group) merged.bloodGroup = String(raw.blood_group);
              if (raw.marital_status) merged.maritalStatus = String(raw.marital_status);
              if (raw.nationality) merged.nationality = String(raw.nationality);
              if (raw.current_address_line1) {
                merged.currentAddress = [raw.current_address_line1, raw.current_address_line2, raw.current_city, raw.current_state, raw.current_pincode].filter(Boolean).join(", ");
              } else if (raw.address) {
                merged.currentAddress = String(raw.address);
              }
              if (raw.permanent_address_line1) {
                merged.permanentAddress = [raw.permanent_address_line1, raw.permanent_address_line2, raw.permanent_city, raw.permanent_state, raw.permanent_pincode].filter(Boolean).join(", ");
              }
              if (raw.emergency_contact_name) merged.emergencyContactName = String(raw.emergency_contact_name);
              if (raw.emergency_contact_relation) merged.emergencyContactRelation = String(raw.emergency_contact_relation);
              if (raw.emergency_contact_phone) merged.emergencyContactPhone = String(raw.emergency_contact_phone);
              if (raw.pan_number) merged.panNumber = String(raw.pan_number);
              if (raw.aadhaar_number) merged.aadhaarNumber = String(raw.aadhaar_number);
              if (raw.bank_name) merged.bankName = String(raw.bank_name);
              if (raw.bank_account_number || raw.account_number) merged.bankAccountNumber = String(raw.bank_account_number || raw.account_number);
              if (raw.ifsc_code) merged.ifscCode = String(raw.ifsc_code);
              if (raw.salary) merged.salary = Number(raw.salary);
              if (raw.ctc || raw.ctc_annual) merged.ctc = Number(raw.ctc || raw.ctc_annual);
              if (raw.profile_photo_url || raw.avatar_url || raw.avatar) {
                merged.profilePhotoUrl = String(raw.profile_photo_url || raw.avatar_url || raw.avatar);
              }
              if (raw.about_me || raw.bio || raw.notes) {
                merged.aboutMe = String(raw.about_me || raw.bio || raw.notes);
              }
              if (raw.linkedin_url) merged.linkedinUrl = String(raw.linkedin_url);
              if (raw.twitter_url) merged.twitterUrl = String(raw.twitter_url);
              if (raw.facebook_url) merged.facebookUrl = String(raw.facebook_url);
            }
          }

          const onbRes = results[1];
          if (onbRes.status === "fulfilled" && onbRes.value?.data) {
            const onb = (onbRes.value.data.data ?? onbRes.value.data) as Record<string, unknown>;
            if (onb && typeof onb === "object") {
              const personal = (onb.personal_information as Record<string, unknown>) || {};
              const identity = (onb.identity_details as Record<string, unknown>) || {};
              const bank = (onb.bank_details as Record<string, unknown>) || {};
              const employment = (onb.employment_details as Record<string, unknown>) || {};

              if (personal.gender) merged.gender = String(personal.gender);
              if (personal.date_of_birth) merged.dateOfBirth = String(personal.date_of_birth).split("T")[0];
              if (personal.blood_group) merged.bloodGroup = String(personal.blood_group);
              if (personal.marital_status) merged.maritalStatus = String(personal.marital_status);
              if (personal.nationality) merged.nationality = String(personal.nationality);
              if (personal.preferred_language) merged.preferredLanguage = String(personal.preferred_language);
              if (personal.emergency_contact_name) merged.emergencyContactName = String(personal.emergency_contact_name);
              if (personal.emergency_contact_relation) merged.emergencyContactRelation = String(personal.emergency_contact_relation);
              if (personal.emergency_contact_phone) merged.emergencyContactPhone = String(personal.emergency_contact_phone);

              if (personal.current_address_line1 && !merged.currentAddress) {
                merged.currentAddress = [personal.current_address_line1, personal.current_address_line2, personal.current_city, personal.current_state, personal.current_pincode].filter(Boolean).join(", ");
              }
              if (personal.permanent_address_line1 && !merged.permanentAddress) {
                merged.permanentAddress = [personal.permanent_address_line1, personal.permanent_address_line2, personal.permanent_city, personal.permanent_state, personal.permanent_pincode].filter(Boolean).join(", ");
              }

              if (identity.pan_number) merged.panNumber = String(identity.pan_number);
              if (identity.aadhaar_number) merged.aadhaarNumber = String(identity.aadhaar_number);

              if (bank.bank_name) merged.bankName = String(bank.bank_name);
              if (bank.account_number || bank.bank_account_number) merged.bankAccountNumber = String(bank.account_number || bank.bank_account_number);
              if (bank.ifsc_code) merged.ifscCode = String(bank.ifsc_code);

              if (employment.work_mode) merged.workMode = String(employment.work_mode);
              if (employment.work_location || employment.office_location) {
                merged.workLocation = String(employment.work_location || employment.office_location);
              }
              if (employment.probation_period_months) {
                merged.probationPeriodMonths = Number(employment.probation_period_months);
              }
            }
          }

          const compRes = results[4];
          if (compRes.status === "fulfilled" && compRes.value?.data) {
            const comp = (compRes.value.data.data ?? compRes.value.data) as Record<string, unknown>;
            if (comp && typeof comp === "object") {
              const annualPaise = comp.ctcAnnualPaise ?? comp.ctc_annual_paise;
              if (comp.ctcAnnualFormatted) merged.ctc = Number(comp.ctcAnnualFormatted);
              else if (annualPaise !== undefined && annualPaise !== null) {
                merged.ctc = Math.round(Number(annualPaise) / 100);
              }

              const monthlyFormatted = comp.ctcMonthlyFormatted ?? comp.ctc_monthly_formatted;
              const monthlyPaiseSum =
                (Number(comp.basic_monthly_paise ?? comp.basicMonthlyPaise ?? 0) || 0) +
                (Number(comp.hra_monthly_paise ?? comp.hraMonthlyPaise ?? 0) || 0) +
                (Number(comp.special_allowance_monthly_paise ?? comp.specialAllowanceMonthlyPaise ?? 0) || 0);
              if (monthlyFormatted) {
                merged.salary = Number(monthlyFormatted);
              } else if (monthlyPaiseSum > 0) {
                merged.salary = Math.round(monthlyPaiseSum / 100);
              } else if (merged.ctc) {
                merged.salary = Math.round(Number(merged.ctc) / 12);
              }
            }
          }

          return merged;
        });

        const docRes = results[2];
        if (docRes.status === "fulfilled" && docRes.value?.data) {
          const docPayload = docRes.value.data?.data ?? docRes.value.data;
          const rawDocs = Array.isArray(docPayload) ? docPayload : docPayload?.items ?? [];
          if (Array.isArray(rawDocs) && rawDocs.length > 0) {
            const parsedDocs: EmployeeDocument[] = rawDocs.map((d: any) => ({
              id: String(d.id || Math.random()),
              name: String(d.title || d.name || d.document_name || d.file_name || "Document.pdf"),
              type: d.category_name || d.document_type || d.type || "Official Document",
              size: formatDocumentSize(d.size ?? d.file_size),
              date: d.created_at || d.upload_date || d.date ? String(d.created_at || d.upload_date || d.date).split("T")[0] : undefined,
              url: d.file_url || d.url || d.download_url,
              verificationStatus: d.verification_status || d.status || "VERIFIED",
            }));
            setDocuments(parsedDocs);
          } else {
            setDocuments([]);
          }
        } else {
          setDocuments([]);
          if (docRes.status === "rejected") {
            nextErrors.documents = formatApiError(docRes.reason, "Failed to load employee documents.");
          }
        }

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

        const leaveRes = results[5];
        if (leaveRes.status === "fulfilled" && leaveRes.value?.data) {
          const rawLeaves = leaveRes.value.data.data ?? leaveRes.value.data;
          if (Array.isArray(rawLeaves)) {
            setLeaveBalances(
              rawLeaves.map((b: any) => ({
                leave_type: String(b.leave_type || b.type || b.name || "Leave"),
                total_days: Number(b.total_days ?? b.total ?? 0),
                used_days: Number(b.used_days ?? b.used ?? 0),
                remaining_days: Number(b.remaining_days ?? b.remaining ?? b.balance ?? 0),
              })),
            );
          } else {
            setLeaveBalances([]);
          }
        } else {
          setLeaveBalances([]);
          if (leaveRes.status === "rejected") {
            nextErrors.leaves = formatApiError(leaveRes.reason, "Failed to load leave balances.");
          }
        }

        const assetsRes = results[6];
        if (assetsRes.status === "fulfilled" && assetsRes.value?.data) {
          const rawAssets = assetsRes.value.data.data?.items ?? assetsRes.value.data?.items ?? assetsRes.value.data ?? [];
          if (Array.isArray(rawAssets)) {
            const empName = (employee.fullName || "").toLowerCase();
            const empCodeId = (employee.employeeId || "").toLowerCase();
            const matched = rawAssets.filter((a: any) => {
              const assigned = String(a.assigned_to || a.assignedTo || a.assigned_to_name || "").toLowerCase();
              return (
                (empName && assigned.includes(empName)) ||
                (empCodeId && assigned.includes(empCodeId)) ||
                a.assigned_to === employee.id
              );
            });
            setAssignedAssets(
              matched.map((a: any) => ({
                id: String(a.id || Math.random()),
                tag: a.tag || a.asset_tag,
                name: a.name || a.asset_name,
                category: a.category,
                model: a.model || a.brand,
                status: a.status,
                assignedAt: a.assigned_at || a.assignedAt,
              })),
            );
          } else {
            setAssignedAssets([]);
          }
        } else {
          setAssignedAssets([]);
          if (assetsRes.status === "rejected") {
            nextErrors.assets = formatApiError(assetsRes.reason, "Failed to load assigned assets.");
          }
        }

        const expRes = results[7];
        if (expRes.status === "fulfilled" && expRes.value) {
          const items = Array.isArray(expRes.value.items) ? expRes.value.items : [];
          setEmployeeExpenses(
            items.map((x) => ({
              id: String(x.id),
              category: x.category || "other",
              amount: Number(x.amount || 0),
              currency: x.currency || "INR",
              date: x.date ? String(x.date).split("T")[0] : "",
              status: x.status || "pending",
              description: x.description,
            })),
          );
          setExpensesTotal(typeof expRes.value.total === "number" ? expRes.value.total : items.length);
        } else {
          setEmployeeExpenses([]);
          setExpensesTotal(0);
          if (expRes.status === "rejected") {
            nextErrors.expenses = formatApiError(expRes.reason, "Failed to load employee expenses.");
          }
        }

        const attRes = results[8];
        if (attRes.status === "fulfilled" && attRes.value?.data) {
          const rawAtt = attRes.value.data.data ?? attRes.value.data;
          if (rawAtt && (rawAtt.present_days !== undefined || rawAtt.presentDays !== undefined)) {
            setAttendanceMetrics({
              presentDays: Number(rawAtt.present_days ?? rawAtt.presentDays ?? 0),
              absentDays: Number(rawAtt.absent_days ?? rawAtt.absentDays ?? 0),
              lateDays: Number(rawAtt.late_days ?? rawAtt.lateDays ?? 0),
              punctuality: rawAtt.punctuality ? String(rawAtt.punctuality) : undefined,
            });
          } else {
            setAttendanceMetrics(null);
          }
        } else {
          setAttendanceMetrics(null);
          if (attRes.status === "rejected") {
            nextErrors.attendance = formatApiError(attRes.reason, "Failed to load attendance metrics.");
          }
        }

        setApiErrors(nextErrors);
      } catch (err) {
        if (isCurrent) {
          setApiErrors({ profile: formatApiError(err, "Failed to load employee details.") });
        }
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

  const roleSubtitle = [
    activeEmployee.designation,
    activeEmployee.department && !activeEmployee.designation?.toLowerCase().includes(activeEmployee.department.toLowerCase())
      ? activeEmployee.department
      : null,
    activeEmployee.workLocation,
  ]
    .filter(Boolean)
    .join(" · ");

  const subtitleItems = [
    activeEmployee.companyEmail || activeEmployee.personalEmail || activeEmployee.email,
    activeEmployee.phone,
    roleSubtitle || activeEmployee.designation || activeEmployee.department || undefined,
  ].filter(Boolean);

  const tenure = calculateTenure(activeEmployee.joiningDate);

  const navItems = [
    { id: "overview", label: "Overview", icon: Users },
    { id: "profile", label: "Profile data", icon: User },
    { id: "attendance", label: "Attendance", icon: Clock },
    { id: "timeoff", label: "Time off", icon: Plane },
    { id: "payroll", label: "Payroll", icon: Wallet },
    { id: "expenses", label: "Expenses", icon: Receipt },
    { id: "assets", label: "Assets", icon: Laptop },
    { id: "access", label: "Access cards", icon: IdCard },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "history", label: "Change history", icon: History },
    { id: "account", label: "Account", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25";
      case "PENDING":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25";
      case "DISABLED":
        return "bg-destructive/15 text-destructive border-destructive/25";
      case "INVITED":
        return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25";
      case "EXPIRED":
        return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300 min-w-0">
      {/* ── Employee Profile Header ─────────────────────────────── */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 min-w-0">
        {/* Left: Avatar + Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 min-w-0 flex-1">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <EmployeeAvatar
              src={activeEmployee.profilePhotoUrl || activeEmployee.avatarUrl}
              name={activeEmployee.fullName || "Employee"}
              className="h-20 w-20 rounded-full object-cover ring-4 ring-card border-2 border-border/60 shadow-xl bg-muted"
              fallbackClassName="flex h-20 w-20 items-center justify-center rounded-full font-bold text-white shadow-xl text-2xl flex-shrink-0 ring-4 ring-card bg-neutral-700"
            />
          </div>

          {/* Name, Status, Metadata */}
          <div className="space-y-2 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground truncate">
                {activeEmployee.fullName}
              </h1>

              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${getStatusBadgeClass(statusDetails.text)}`}
              >
                <CheckCircle className="h-3.5 w-3.5" />
                <span>{statusDetails.text}</span>
              </span>

              {isSyncing && (
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground animate-pulse">
                  <Sparkles className="h-3 w-3 text-primary" /> Live Syncing
                </span>
              )}
            </div>

            {/* Designation, Department, Location */}
            {roleSubtitle && (
              <p className="text-sm text-muted-foreground truncate">{roleSubtitle}</p>
            )}

            {/* Employee Metadata: ID, Role, Employment Type */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {activeEmployee.employeeId && (
                <button
                  type="button"
                  onClick={() => copyToClipboard(activeEmployee.employeeId!, "id", "Employee ID")}
                  className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/60 hover:bg-muted text-xs font-mono font-medium text-foreground border border-border transition-colors"
                  title="Click to copy ID"
                >
                  <span className="text-muted-foreground/60">ID:</span>
                  <span>{activeEmployee.employeeId}</span>
                  {copiedKey === "id" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </button>
              )}
              {activeEmployee.role && (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground font-medium capitalize">
                  <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{activeEmployee.role}</span>
                </span>
              )}
              {activeEmployee.employmentType && (
                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground font-medium capitalize">
                  <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{activeEmployee.employmentType}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 lg:flex-none">
          {isInvited && onResendInvite && (
            <Button
              variant="outline"
              size="sm"
              className="h-10 gap-2 text-sm font-medium px-4 rounded-lg"
              onClick={() => onResendInvite(activeEmployee.id)}
            >
              <Send className="h-4 w-4" />
              Resend Invite
            </Button>
          )}

          <Button
            size="sm"
            onClick={() => onEdit(activeEmployee)}
            className="h-10 gap-2 text-sm font-medium px-4 rounded-lg shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Edit3 className="h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* ── Main Two-Column Layout (Sidebar + Content) ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[224px_1fr] gap-6 items-start">
        {/* Left Navigation Sidebar */}
        <div className="hidden lg:block sticky top-24 h-[calc(100vh-8rem)] overflow-y-auto space-y-1 border border-border rounded-2xl bg-card p-2">
          {navItems.map((item) => {
            const isSelected = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                  isSelected
                    ? "bg-neutral-800 text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <span className={isSelected ? "text-foreground" : "text-muted-foreground"}>
                  <Icon className="h-4 w-4" />
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mobile Tab Bar */}
        <div className="lg:hidden border border-border rounded-2xl bg-card p-2 mb-4 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {navItems.map((item) => {
              const isSelected = activeTab === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                    isSelected
                      ? "bg-neutral-800 text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Detail Content View */}
        <div className="min-w-0 space-y-6">
          {/* Overview Heading */}
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground capitalize">
              {navItems.find((n) => n.id === activeTab)?.label || "Overview"}
            </h2>
          </div>

          {/* 1. OVERVIEW VIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {Object.keys(apiErrors).length > 0 && (
                <div
                  role="alert"
                  className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive space-y-1.5"
                >
                  <div className="flex items-center gap-2 font-semibold">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>Some employee details could not be loaded</span>
                  </div>
                  <ul className="list-disc pl-5 text-xs space-y-0.5">
                    {Object.entries(apiErrors).map(([section, msg]) => (
                      <li key={section}>
                        <span className="font-medium capitalize">{section}:</span> {msg}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Card 1 — About employee */}
              <Card className="rounded-2xl border-border bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground">About employee</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-sm">
                  {activeEmployee.aboutMe || activeEmployee.bio || activeEmployee.notes ? (
                    <p className="text-muted-foreground leading-relaxed">
                      {activeEmployee.aboutMe || activeEmployee.bio || activeEmployee.notes}
                    </p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No professional summary has been added yet.
                    </p>
                  )}

                  <div className="pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-3">
                      CONTACT
                    </span>
                    <div className="flex flex-col gap-3">
                      {activeEmployee.companyEmail || activeEmployee.personalEmail || activeEmployee.email ? (
                        <div className="flex items-center gap-3">
                          <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs font-medium text-muted-foreground">Email</span>
                            <p className="text-sm text-foreground truncate block">
                              {activeEmployee.companyEmail || activeEmployee.personalEmail || activeEmployee.email}
                            </p>
                          </div>
                        </div>
                      ) : null}
                      {activeEmployee.phone && (
                        <div className="flex items-center gap-3">
                          <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <div className="min-w-0">
                            <span className="text-xs font-medium text-muted-foreground">Phone</span>
                            <p className="text-sm text-foreground truncate block">{activeEmployee.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2 — Employment details */}
              <Card className="rounded-2xl border-border bg-card shadow-sm">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" /> Employment details
                  </CardTitle>
                  {activeEmployee.employmentType && (
                    <Badge variant="outline" className="text-xs">
                      {activeEmployee.employmentType}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                    <DetailField label="Employee ID" value={activeEmployee.employeeId || "—"} mono />
                    <DetailField label="Department" value={activeEmployee.department || "—"} />
                    <DetailField label="Employment type" value={activeEmployee.employmentType || "—"} />
                    <DetailField label="Designation" value={activeEmployee.designation || "—"} />
                    <DetailField label="Work location" value={activeEmployee.workLocation || "—"} />
                    <DetailField label="Work mode" value={activeEmployee.workMode || "—"} />
                  </div>
                </CardContent>
              </Card>

              {/* Card 3 — Reporting & hierarchy */}
              <Card className="rounded-2xl border-border bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" /> Reporting & hierarchy
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <DetailField
                      label="Reporting Manager"
                      value={activeEmployee.reportingManagerName || activeEmployee.managerName || "Not assigned"}
                    />
                    <DetailField
                      label="Direct reports"
                      value={directReportsCount > 0 ? `${directReportsCount} Direct Reports` : "None"}
                    />
                  </div>

                  {reportingChain.length > 0 ? (
                    <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
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
                  ) : (
                    <p className="text-muted-foreground italic text-sm">No reporting hierarchy chain configured.</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* 2. PROFILE DATA VIEW */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <Card className="rounded-2xl border-border bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" /> Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                    <DetailField label="Full Legal Name" value={activeEmployee.fullName || "—"} />
                    <DetailField label="Date of Birth" value={activeEmployee.dateOfBirth || "—"} />
                    <DetailField label="Gender" value={activeEmployee.gender || "—"} />
                    <DetailField label="Marital Status" value={activeEmployee.maritalStatus || "—"} />
                    <DetailField label="Blood Group" value={activeEmployee.bloodGroup || "—"} />
                    <DetailField label="Nationality" value={activeEmployee.nationality || "—"} />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" /> Contact Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <DetailField
                      label="Personal Email"
                      value={activeEmployee.personalEmail || "—"}
                      copyable={Boolean(activeEmployee.personalEmail)}
                      onCopy={() => copyToClipboard(activeEmployee.personalEmail || "", "pe", "Personal Email")}
                      copied={copiedKey === "pe"}
                    />
                    <DetailField
                      label="Company / Work Email"
                      value={activeEmployee.companyEmail || activeEmployee.email || "—"}
                      copyable={Boolean(activeEmployee.companyEmail || activeEmployee.email)}
                      onCopy={() => copyToClipboard(activeEmployee.companyEmail || activeEmployee.email, "ce", "Work Email")}
                      copied={copiedKey === "ce"}
                    />
                    <DetailField
                      label="Primary Mobile Phone"
                      value={activeEmployee.phone || "—"}
                      copyable={Boolean(activeEmployee.phone)}
                      onCopy={() => copyToClipboard(activeEmployee.phone || "", "ph", "Phone Number")}
                      copied={copiedKey === "ph"}
                    />
                    <DetailField
                      label="Emergency Contact Phone"
                      value={activeEmployee.emergencyContactPhone || "—"}
                      mono
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" /> Residential Addresses
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                      Current Residential Address
                    </span>
                    <p className="text-foreground font-medium">
                      {activeEmployee.currentAddress || "Not provided"}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/30 border border-border/40">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                      Permanent Address
                    </span>
                    <p className="text-foreground font-medium">
                      {activeEmployee.permanentAddress || "Not provided"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <HeartPulse className="h-4 w-4 text-rose-500" /> Emergency Contact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                    <DetailField label="Contact Person" value={activeEmployee.emergencyContactName || "—"} />
                    <DetailField label="Relationship" value={activeEmployee.emergencyContactRelation || "—"} />
                    <DetailField label="Emergency Phone" value={activeEmployee.emergencyContactPhone || "—"} mono />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 3. ATTENDANCE VIEW */}
          {activeTab === "attendance" && (
            <div className="space-y-6">
              {apiErrors.attendance ? (
                <Card role="alert" className="rounded-2xl border-destructive/30 bg-destructive/10 p-6 text-destructive shadow-sm">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-base">Unable to Load Attendance</h3>
                      <p className="text-xs mt-1">{apiErrors.attendance}</p>
                    </div>
                  </div>
                </Card>
              ) : attendanceMetrics ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 text-center">
                    <span className="block text-2xl font-bold text-emerald-500">{attendanceMetrics.presentDays}</span>
                    <span className="text-xs uppercase font-medium text-muted-foreground">Days Present</span>
                  </div>
                  <div className="p-4 rounded-2xl border border-rose-500/20 bg-rose-500/5 text-center">
                    <span className="block text-2xl font-bold text-rose-500">{attendanceMetrics.absentDays}</span>
                    <span className="text-xs uppercase font-medium text-muted-foreground">Days Absent</span>
                  </div>
                  <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-center">
                    <span className="block text-2xl font-bold text-amber-500">{attendanceMetrics.lateDays}</span>
                    <span className="text-xs uppercase font-medium text-muted-foreground">Late Arrivals</span>
                  </div>
                  <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/5 text-center">
                    <span className="block text-2xl font-bold text-blue-500">{attendanceMetrics.punctuality || "—"}</span>
                    <span className="text-xs uppercase font-medium text-muted-foreground">Punctuality</span>
                  </div>
                </div>
              ) : (
                <Card className="rounded-2xl border-border bg-card p-8 shadow-sm text-center">
                  <Clock className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <h3 className="font-semibold text-base text-foreground">No Attendance Records Logged</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Daily check-in logs and punctuality records will appear here once registered.
                  </p>
                </Card>
              )}

              <Card className="rounded-2xl border-border bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" /> Shift Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
                    <DetailField label="Assigned Shift" value={activeEmployee.shift || "Not assigned"} />
                    <DetailField
                      label="Shift Timings"
                      value={activeEmployee.shift ? "Standard organization schedule" : "—"}
                    />
                    <DetailField
                      label="Grace Window"
                      value={activeEmployee.shift ? "Configured per company policy" : "—"}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 4. TIME OFF (LEAVES) VIEW */}
          {activeTab === "timeoff" && (
            <div className="space-y-6">
              {apiErrors.leaves ? (
                <Card role="alert" className="rounded-2xl border-destructive/30 bg-destructive/10 p-6 text-destructive shadow-sm">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-base">Unable to Load Leave Balances</h3>
                      <p className="text-xs mt-1">{apiErrors.leaves}</p>
                    </div>
                  </div>
                </Card>
              ) : leaveBalances.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {leaveBalances.map((bal, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-border bg-card shadow-sm">
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {bal.leave_type}
                      </span>
                      <h3 className="text-2xl font-bold text-foreground mt-1">{bal.remaining_days} Days</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        Available out of {bal.total_days} (Used: {bal.used_days})
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="rounded-2xl border-border bg-card p-8 shadow-sm text-center">
                  <Plane className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <h3 className="font-semibold text-base text-foreground">No Leave Balances Assigned</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Leave quotas and entitlement policies have not been allocated to this employee yet.
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* 5. PAYROLL & COMPENSATION VIEW */}
          {activeTab === "payroll" && (
            <div className="space-y-6">
              {apiErrors.compensation ? (
                <Card role="alert" className="rounded-2xl border-destructive/30 bg-destructive/10 p-6 text-destructive shadow-sm">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-base">Unable to Load Payroll Compensation</h3>
                      <p className="text-xs mt-1">{apiErrors.compensation}</p>
                    </div>
                  </div>
                </Card>
              ) : activeEmployee.ctc || activeEmployee.salary ? (
                <div className="p-6 rounded-2xl border border-border bg-card shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Total Annual Compensation (CTC)
                      </span>
                      <h2 className="text-3xl font-extrabold font-mono text-emerald-500 mt-1">
                        {formatCurrency(activeEmployee.ctc)}
                      </h2>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500 font-semibold px-3 py-1">
                      Structured Salary
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-border/50 text-sm">
                    <DetailField
                      label="Monthly Base / Gross"
                      value={formatCurrency(activeEmployee.salary || (activeEmployee.ctc ? Number(activeEmployee.ctc) / 12 : undefined))}
                      mono
                    />
                    <DetailField label="Salary Cycle" value="Monthly (Disbursed at month end)" />
                    <DetailField
                      label="Payment Method"
                      value={activeEmployee.bankAccountNumber ? "Direct Bank Account Transfer" : "Not specified"}
                    />
                  </div>
                </div>
              ) : (
                <Card className="rounded-2xl border-border bg-card p-8 shadow-sm text-center">
                  <Wallet className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <h3 className="font-semibold text-base text-foreground">Compensation Not Configured</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Annual CTC and monthly salary structure have not been assigned to this employee.
                  </p>
                </Card>
              )}

              <Card className="rounded-2xl border-border bg-card shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-primary" /> Bank Account for Disbursal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                    <DetailField label="Bank Name" value={activeEmployee.bankName || "Not provided"} />
                    <DetailField label="Branch" value={activeEmployee.branch || activeEmployee.workLocation || "—"} />
                    <DetailField
                      label="Account Number"
                      value={
                        activeEmployee.bankAccountNumber
                          ? `•••• •••• ${activeEmployee.bankAccountNumber.slice(-4)}`
                          : "Not provided"
                      }
                      mono
                      copyable={Boolean(activeEmployee.bankAccountNumber)}
                      onCopy={() => copyToClipboard(activeEmployee.bankAccountNumber || "", "acc", "Account Number")}
                      copied={copiedKey === "acc"}
                    />
                    <DetailField
                      label="IFSC Code"
                      value={activeEmployee.ifscCode || "Not provided"}
                      mono
                      copyable={Boolean(activeEmployee.ifscCode)}
                      onCopy={() => copyToClipboard(activeEmployee.ifscCode || "", "ifsc", "IFSC Code")}
                      copied={copiedKey === "ifsc"}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 6. EXPENSES VIEW */}
          {activeTab === "expenses" && (
            <div className="space-y-4">
              {apiErrors.expenses ? (
                <Card role="alert" className="rounded-2xl border-destructive/30 bg-destructive/10 p-6 text-destructive shadow-sm">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-base">Unable to Load Expenses</h3>
                      <p className="text-xs mt-1">{apiErrors.expenses}</p>
                    </div>
                  </div>
                </Card>
              ) : employeeExpenses.length > 0 ? (
                <div className="space-y-3">
                  {expensesTotal > employeeExpenses.length && (
                    <p className="text-xs text-muted-foreground">
                      Showing {employeeExpenses.length} of {expensesTotal} expense claims
                    </p>
                  )}
                  {employeeExpenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border bg-card text-sm shadow-sm"
                    >
                      <div>
                        <p className="font-semibold text-foreground">{exp.category}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          {exp.date} {exp.description ? `• ${exp.description}` : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-foreground">
                          ₹ {exp.amount.toLocaleString("en-IN")}
                        </span>
                        <Badge variant="outline" className="block mt-1 text-[10px] capitalize">
                          {exp.status.toLowerCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="rounded-2xl border-border bg-card p-8 shadow-sm text-center">
                  <Receipt className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <h3 className="font-semibold text-base text-foreground">No Expense Claims</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Reimbursement requests for travel, meals, and office supplies will appear here once submitted.
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* 7. ASSETS VIEW */}
          {activeTab === "assets" && (
            <div className="space-y-4">
              {apiErrors.assets ? (
                <Card role="alert" className="rounded-2xl border-destructive/30 bg-destructive/10 p-6 text-destructive shadow-sm">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-base">Unable to Load Assets</h3>
                      <p className="text-xs mt-1">{apiErrors.assets}</p>
                    </div>
                  </div>
                </Card>
              ) : assignedAssets.length > 0 ? (
                <Card className="rounded-2xl border-border bg-card shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                      <Laptop className="h-4 w-4 text-primary" /> Allocated Company Assets
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {assignedAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/30 text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <Laptop className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-semibold text-foreground">{asset.name || asset.model || "Hardware Asset"}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {asset.tag ? `Tag: ${asset.tag}` : ""} {asset.category ? `• ${asset.category}` : ""}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-emerald-500 bg-emerald-500/10 border-emerald-500/20 text-[10px]">
                          {asset.status || "Assigned"}
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ) : (
                <Card className="rounded-2xl border-border bg-card p-8 shadow-sm text-center">
                  <Laptop className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <h3 className="font-semibold text-base text-foreground">No Company Assets Allocated</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Hardware, laptops, and IT equipment assigned to this employee will appear here.
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* 8. ACCESS CARDS VIEW */}
          {activeTab === "access" && (
            <Card className="rounded-2xl border-border bg-card p-8 shadow-sm text-center">
              <IdCard className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="font-semibold text-base text-foreground">No Access Badges Issued</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Smart RFID badges and physical building access cards will be registered here once issued.
              </p>
            </Card>
          )}

          {/* 9. DOCUMENTS VIEW */}
          {activeTab === "documents" && (
            <Card className="rounded-2xl border-border bg-card shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" /> Verified Documents & Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                {apiErrors.documents ? (
                  <div
                    role="alert"
                    className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive flex items-start gap-3"
                  >
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Unable to Load Documents</p>
                      <p className="text-xs mt-1">{apiErrors.documents}</p>
                    </div>
                  </div>
                ) : documents.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-sm space-y-2">
                    <FileText className="h-9 w-9 text-muted-foreground/40 mx-auto" />
                    <p className="font-medium text-foreground">No Documents Uploaded</p>
                    <p className="text-muted-foreground text-xs max-w-xs mx-auto">
                      Official verified identification, degrees, and employment agreements will appear here.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                            <FileText className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{doc.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {doc.type} {doc.size !== "—" ? `• ${doc.size}` : ""} {doc.date ? `• ${doc.date}` : ""}
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

          {/* 10. CHANGE HISTORY VIEW */}
          {activeTab === "history" && (
            <Card className="rounded-2xl border-border bg-card p-6 shadow-sm space-y-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <History className="h-4 w-4 text-primary" /> Profile Audit Trail
              </CardTitle>
              {activeEmployee.updatedAt || activeEmployee.createdAt || activeEmployee.joiningDate ? (
                <div className="space-y-3 text-sm">
                  {activeEmployee.updatedAt && (
                    <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">Record Modified</span>
                        <span className="text-[10px] text-muted-foreground">{activeEmployee.updatedAt}</span>
                      </div>
                      <p className="text-muted-foreground mt-0.5">Employee profile updated in system.</p>
                    </div>
                  )}
                  {(activeEmployee.createdAt || activeEmployee.joiningDate) && (
                    <div className="p-3 rounded-xl bg-muted/30 border border-border/40">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">Account Created</span>
                        <span className="text-[10px] text-muted-foreground">
                          {activeEmployee.createdAt || activeEmployee.joiningDate}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-0.5">Employee record initialized in OFC360 system.</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic">No change history records logged yet.</p>
              )}
            </Card>
          )}

          {/* 11. ACCOUNT VIEW */}
          {activeTab === "account" && (
            <Card className="rounded-2xl border-border bg-card p-6 shadow-sm space-y-6">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> System Account & Credentials
              </CardTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <DetailField label="User Account Status" value={statusDetails.text} />
                <DetailField label="Role Permission" value={activeEmployee.role || "employee"} />
                <DetailField label="PAN Number" value={activeEmployee.panNumber || "Not provided"} mono />
                <DetailField
                  label="Aadhaar ID"
                  value={
                    activeEmployee.aadhaarNumber
                      ? `•••• •••• ${activeEmployee.aadhaarNumber.slice(-4)}`
                      : "Not provided"
                  }
                  mono
                />
              </div>
            </Card>
          )}

          {/* 12. NOTIFICATIONS VIEW */}
          {activeTab === "notifications" && (
            <Card className="rounded-2xl border-border bg-card p-6 shadow-sm space-y-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" /> Notification Preferences
              </CardTitle>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/30">
                  <div>
                    <p className="font-semibold text-foreground">Email Notifications</p>
                    <p className="text-muted-foreground text-xs">
                      Destination: {activeEmployee.companyEmail || activeEmployee.email || "—"}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-emerald-500 bg-emerald-500/10 border-emerald-500/20 text-[10px]">
                    Active
                  </Badge>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailField({
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
    <div className="flex flex-col gap-1.5 min-w-0">
      <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/70">
        {label}
      </span>
      <div className="flex items-center justify-between min-w-0">
        <div className={`text-sm font-medium text-foreground truncate ${mono ? "font-mono" : ""}`} title={String(value)}>
          {value}
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
    </div>
  );
}

function calculateTenure(joiningDateStr?: string): string | null {
  if (!joiningDateStr) return null;
  try {
    const start = new Date(joiningDateStr);
    if (isNaN(start.getTime())) return null;
    const now = new Date();
    const monthsTotal = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
    if (monthsTotal < 0) return "Future start date";
    if (monthsTotal < 1) return "Joined this month";
    const years = Math.floor(monthsTotal / 12);
    const months = monthsTotal % 12;
    if (years === 0) return `${months} month${months > 1 ? "s" : ""}`;
    if (months === 0) return `${years} year${years > 1 ? "s" : ""}`;
    return `${years} yr ${months} mo`;
  } catch {
    return null;
  }
}

function formatCurrency(val?: string | number): string {
  if (val === undefined || val === null || val === "" || val === 0 || val === "0") return "—";
  const num = typeof val === "number" ? val : parseFloat(String(val).replace(/[^0-9.-]+/g, ""));
  if (isNaN(num) || num <= 0) return "—";
  return `₹ ${num.toLocaleString("en-IN")}`;
}