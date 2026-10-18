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
  ChevronRight,
  Download,
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
  Facebook,
  Receipt,
  IdCard,
  CheckCircle,
  ArrowLeft,
  Bell,
  Users,
  Building,
  Trash2,
  CheckCircle as CheckCircleIcon,
} from "lucide-react";
import { toast } from "sonner";
import apiInstance from "@/api/apiInstance";
import type { Manager } from "../types";

export interface ManagerDetailPageProps {
  manager: Manager;
  onBack?: () => void;
  onEdit: (manager: Manager) => void;
  onDelete?: (manager: Manager) => void;
  onResendInvite?: (id: string) => void;
  onResetPassword?: (id: string) => void;
}

interface ManagerDocument {
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

interface DirectReportItem {
  id: string;
  name: string;
  designation?: string;
  department?: string;
  email?: string;
  phone?: string;
  status?: string;
  avatarUrl?: string;
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

interface ExtendedManagerProfile {
  personalEmail?: string;
  companyEmail?: string;
  alternatePhone?: string;
  workMode?: string;
  probationPeriodMonths?: number;
  currentAddress?: string;
  permanentAddress?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
  nationality?: string;
  bankName?: string;
  bankAccountNumber?: string;
  ifscCode?: string;
  panNumber?: string;
  aadhaarNumber?: string;
  ctc?: string;
  salary?: string | number;
  basicSalary?: number;
  hra?: number;
  bonus?: number;
  pf?: number;
  esi?: number;
  professionalTax?: number;
  aboutMe?: string;
  bio?: string;
  notes?: string;
  linkedinUrl?: string;
  facebookUrl?: string;
  twitterUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type FullManagerProfile = Omit<Manager, "salary"> & ExtendedManagerProfile;

const AVATAR_GRADIENTS = [
  "from-violet-600 via-purple-600 to-indigo-700",
  "from-blue-600 via-indigo-600 to-cyan-600",
  "from-emerald-600 via-teal-600 to-emerald-700",
  "from-purple-600 via-fuchsia-600 to-pink-600",
  "from-sky-500 via-blue-600 to-indigo-600",
  "from-amber-500 via-orange-600 to-red-600",
];

function getAvatarGradient(name?: string | null): string {
  if (!name) return AVATAR_GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_GRADIENTS[Math.abs(hash) % AVATAR_GRADIENTS.length];
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

export function ManagerDetailPage({
  manager,
  onBack,
  onEdit,
  onDelete,
  onResendInvite,
  onResetPassword,
}: ManagerDetailPageProps) {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [completeData, setCompleteData] = useState<FullManagerProfile>({ ...manager });
  const [documents, setDocuments] = useState<ManagerDocument[]>([]);
  const [reportingChain, setReportingChain] = useState<ReportingChainItem[]>([]);
  const [directReports, setDirectReports] = useState<DirectReportItem[]>([]);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalanceItem[]>([]);
  const [assignedAssets, setAssignedAssets] = useState<AssetItem[]>([]);
  const [managerExpenses, setManagerExpenses] = useState<ExpenseItem[]>([]);
  const [attendanceMetrics, setAttendanceMetrics] = useState<AttendanceMetrics | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(true);

  // Synchronize detailed manager records in the background from real backend APIs
  useEffect(() => {
    let isCurrent = true;
    setIsSyncing(true);
    const mgrId = manager.id;
    const mgrCode = manager.managerId || manager.employeeId;

    async function fetchFullProfile() {
      try {
        const results = await Promise.allSettled([
          // 0. Direct Manager Profile
          apiInstance.get(`/managers/${mgrId}`),
          // 1. Direct Employee Record (if exists in employee directory)
          apiInstance.get(`/employees/${mgrId}`),
          // 2. Real Documents (Limit 50)
          apiInstance.get("/documents/employees", {
            params: { employee_id: mgrId || mgrCode, limit: 50 },
          }),
          // 3. Organization Hierarchy
          apiInstance.get(`/hierarchy/${mgrId}`),
          // 4. Compensation / CTC
          apiInstance.get(`/api/v2/payroll/employees/${mgrId}/compensation`, {
            headers: { "Cache-Control": "no-store" },
          }),
          // 5. Real Leave Balances
          apiInstance.get(`/leaves/balances/${mgrId}`),
          // 6. Real Assets
          apiInstance.get("/api/v1/assets", {
            params: { search: manager.fullName || mgrCode, limit: 30 },
          }),
          // 7. Real Expenses
          apiInstance.get("/api/v2/expenses", {
            params: { search: manager.fullName || mgrCode, limit: 30 },
          }),
          // 8. Attendance Summary
          apiInstance.get(`/attendance/today`, {
            params: { employee_id: mgrId || mgrCode },
          }),
          // 9. All Employees (to find direct reports)
          apiInstance.get("/employees", {
            params: { limit: 100 },
          }),
        ]);

        if (!isCurrent) return;

        // 1. Merge Profile Data
        setCompleteData((prev) => {
          const merged: FullManagerProfile = { ...prev };

          // Direct Manager API
          const mgrRes = results[0];
          if (mgrRes.status === "fulfilled" && mgrRes.value?.data) {
            const raw = (mgrRes.value.data.data ?? mgrRes.value.data) as Record<string, unknown>;
            if (raw && typeof raw === "object") {
              if (raw.first_name) merged.firstName = String(raw.first_name);
              if (raw.last_name) merged.lastName = String(raw.last_name);
              if (raw.personal_email) merged.personalEmail = String(raw.personal_email);
              if (raw.company_email) merged.companyEmail = String(raw.company_email);
              if (raw.phone) merged.phone = String(raw.phone);
              if (raw.alternate_phone) merged.alternatePhone = String(raw.alternate_phone);
              if (raw.department) merged.department = String(raw.department);
              if (raw.designation) merged.designation = String(raw.designation);
              if (raw.work_location) {
                const loc = String(raw.work_location).toLowerCase();
                merged.workLocation = loc === "remote" ? "remote" : loc === "hybrid" ? "hybrid" : "on_site";
              }
              if (raw.work_mode) merged.workMode = String(raw.work_mode);
              if (raw.gender) merged.gender = raw.gender as Manager["gender"];
              if (raw.dob || raw.date_of_birth) merged.dob = String(raw.dob || raw.date_of_birth).split("T")[0];
              if (raw.blood_group) merged.bloodGroup = String(raw.blood_group);
              if (raw.marital_status) merged.maritalStatus = String(raw.marital_status);
              if (raw.nationality) merged.nationality = String(raw.nationality);
              if (raw.shift) merged.shift = String(raw.shift);
              if (raw.branch || raw.office) merged.office = String(raw.branch || raw.office);
              if (raw.probation_period_months) merged.probationPeriodMonths = Number(raw.probation_period_months);

              if (raw.ctc) merged.ctc = String(raw.ctc);
              if (raw.salary) merged.salary = String(raw.salary);
              if (raw.basic_salary) merged.basicSalary = Number(raw.basic_salary);
              if (raw.hra) merged.hra = Number(raw.hra);
              if (raw.bonus) merged.bonus = Number(raw.bonus);
              if (raw.pf) merged.pf = Number(raw.pf);
              if (raw.esi) merged.esi = Number(raw.esi);
              if (raw.professional_tax) merged.professionalTax = Number(raw.professional_tax);

              if (raw.bank_name) merged.bankName = String(raw.bank_name);
              if (raw.bank_account_number || raw.account_number) {
                merged.bankAccountNumber = String(raw.bank_account_number || raw.account_number);
              }
              if (raw.ifsc_code) merged.ifscCode = String(raw.ifsc_code);
              if (raw.pan_number || raw.pan) merged.panNumber = String(raw.pan_number || raw.pan);
              if (raw.aadhaar_number || raw.aadhaar) merged.aadhaarNumber = String(raw.aadhaar_number || raw.aadhaar);

              if (raw.about_me || raw.bio || raw.notes) {
                merged.aboutMe = String(raw.about_me || raw.bio || raw.notes);
              }
              if (raw.linkedin_url) merged.linkedinUrl = String(raw.linkedin_url);
              if (raw.facebook_url) merged.facebookUrl = String(raw.facebook_url);
              if (raw.twitter_url) merged.twitterUrl = String(raw.twitter_url);
              if (raw.created_at) merged.createdAt = String(raw.created_at).split("T")[0];
              if (raw.updated_at) merged.updatedAt = String(raw.updated_at).split("T")[0];

              if (raw.current_address_line1) {
                merged.currentAddress = [
                  raw.current_address_line1,
                  raw.current_address_line2,
                  raw.current_city,
                  raw.current_state,
                  raw.current_pincode,
                ]
                  .filter(Boolean)
                  .join(", ");
              } else if (raw.address) {
                merged.currentAddress = String(raw.address);
              }

              if (raw.permanent_address_line1) {
                merged.permanentAddress = [
                  raw.permanent_address_line1,
                  raw.permanent_address_line2,
                  raw.permanent_city,
                  raw.permanent_state,
                  raw.permanent_pincode,
                ]
                  .filter(Boolean)
                  .join(", ");
              }

              if (raw.emergency_contact_name) merged.emergencyContactName = String(raw.emergency_contact_name);
              if (raw.emergency_contact_relation) merged.emergencyContactRelation = String(raw.emergency_contact_relation);
              if (raw.emergency_contact_phone) merged.emergencyContactPhone = String(raw.emergency_contact_phone);
            }
          }

          // Direct Employee API fallback / enrichment
          const empRes = results[1];
          if (empRes.status === "fulfilled" && empRes.value?.data) {
            const rawEmp = (empRes.value.data.data ?? empRes.value.data) as Record<string, unknown>;
            if (rawEmp && typeof rawEmp === "object") {
              if (!merged.personalEmail && rawEmp.personal_email) merged.personalEmail = String(rawEmp.personal_email);
              if (!merged.companyEmail && rawEmp.company_email) merged.companyEmail = String(rawEmp.company_email);
              if (!merged.bloodGroup && rawEmp.blood_group) merged.bloodGroup = String(rawEmp.blood_group);
              if (!merged.maritalStatus && rawEmp.marital_status) merged.maritalStatus = String(rawEmp.marital_status);
              if (!merged.dob && rawEmp.date_of_birth) merged.dob = String(rawEmp.date_of_birth).split("T")[0];
            }
          }

          // Compensation
          const compRes = results[4];
          if (compRes.status === "fulfilled" && compRes.value?.data) {
            const comp = (compRes.value.data.data ?? compRes.value.data) as Record<string, unknown>;
            if (comp) {
              if (comp.ctcAnnualFormatted) merged.ctc = String(comp.ctcAnnualFormatted);
              else if (comp.ctcAnnualPaise) merged.ctc = String(Math.round(Number(comp.ctcAnnualPaise) / 100));
              if (comp.ctcMonthlyFormatted) merged.salary = String(comp.ctcMonthlyFormatted);
            }
          }

          return merged;
        });

        // 2. Real Documents
        const docRes = results[2];
        if (docRes.status === "fulfilled" && docRes.value?.data) {
          const rawDocs = docRes.value.data.data?.items ?? docRes.value.data?.items ?? docRes.value.data ?? [];
          if (Array.isArray(rawDocs) && rawDocs.length > 0) {
            const parsedDocs: ManagerDocument[] = rawDocs.map((d: any) => ({
              id: String(d.id || Math.random()),
              name: String(d.name || d.document_name || d.title || "Document.pdf"),
              type: d.document_type || d.type || "Official Document",
              size: d.size || d.file_size || "—",
              date: d.created_at || d.upload_date || d.date ? String(d.created_at || d.upload_date || d.date).split("T")[0] : undefined,
              url: d.url || d.file_url || d.download_url,
              verificationStatus: d.verification_status || d.status || "VERIFIED",
            }));
            setDocuments(parsedDocs);
          } else {
            setDocuments([]);
          }
        } else {
          setDocuments([]);
        }

        // 3. Organization Hierarchy
        const hierRes = results[3];
        const reportsList: DirectReportItem[] = [];
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
              hier.direct_reports.forEach((dr: any) => {
                reportsList.push({
                  id: String(dr.id || Math.random()),
                  name: [dr.first_name, dr.last_name].filter(Boolean).join(" ").trim() || dr.fullName || dr.name || "Employee",
                  designation: dr.designation,
                  department: dr.department,
                  email: dr.company_email || dr.personal_email || dr.email,
                  phone: dr.phone,
                  status: dr.status || dr.employment_status || "ACTIVE",
                  avatarUrl: dr.profile_photo_url || dr.avatar_url,
                });
              });
            }
          }
        }

        // 4. Enrich direct reports from /employees list if needed
        const empListRes = results[9];
        if (empListRes.status === "fulfilled" && empListRes.value?.data) {
          const rawEmps = empListRes.value.data.data?.items ?? empListRes.value.data?.items ?? empListRes.value.data ?? [];
          if (Array.isArray(rawEmps)) {
            rawEmps.forEach((e: any) => {
              const repId = String(e.reporting_manager_id ?? e.reporting_to ?? e.reportingTo ?? "");
              const mgrFull = (manager.fullName || "").toLowerCase();
              const eRepName = String(e.reporting_manager_name ?? e.managerName ?? "").toLowerCase();

              const isMatch =
                (repId && (repId === mgrId || repId === mgrCode)) ||
                (eRepName && mgrFull && eRepName.includes(mgrFull));

              if (isMatch && !reportsList.some((r) => r.id === String(e.id))) {
                reportsList.push({
                  id: String(e.id || e.employee_id || Math.random()),
                  name: [e.first_name, e.last_name].filter(Boolean).join(" ").trim() || e.fullName || e.name || "Team Member",
                  designation: e.designation,
                  department: e.department,
                  email: e.company_email || e.personal_email || e.email,
                  phone: e.phone,
                  status: e.status || e.employment_status || "ACTIVE",
                  avatarUrl: e.profile_photo_url || e.avatar_url,
                });
              }
            });
          }
        }
        setDirectReports(reportsList);

        // 5. Real Leave Balances
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
        }

        // 6. Real Assigned Assets
        const assetsRes = results[6];
        if (assetsRes.status === "fulfilled" && assetsRes.value?.data) {
          const rawAssets = assetsRes.value.data.data?.items ?? assetsRes.value.data?.items ?? assetsRes.value.data ?? [];
          if (Array.isArray(rawAssets)) {
            const mgrName = (manager.fullName || "").toLowerCase();
            const mgrCodeLower = (mgrCode || "").toLowerCase();
            const matched = rawAssets.filter((a: any) => {
              const assigned = String(a.assigned_to || a.assignedTo || a.assigned_to_name || "").toLowerCase();
              return (
                (mgrName && assigned.includes(mgrName)) ||
                (mgrCodeLower && assigned.includes(mgrCodeLower)) ||
                a.assigned_to === manager.id
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
        }

        // 7. Real Expenses
        const expRes = results[7];
        if (expRes.status === "fulfilled" && expRes.value?.data) {
          const rawExp = expRes.value.data.data?.items ?? expRes.value.data?.items ?? expRes.value.data ?? [];
          if (Array.isArray(rawExp)) {
            const mgrName = (manager.fullName || "").toLowerCase();
            const matched = rawExp.filter((x: any) => {
              const assigned = String(x.employee_name || x.employee || x.employee_id || x.manager_name || "").toLowerCase();
              return mgrName && assigned.includes(mgrName);
            });
            setManagerExpenses(
              matched.map((x: any) => ({
                id: String(x.id || Math.random()),
                category: x.category || "General",
                amount: Number(x.amount || 0),
                currency: x.currency || "INR",
                date: x.date ? String(x.date).split("T")[0] : "",
                status: x.status || "PENDING",
                description: x.description,
              })),
            );
          } else {
            setManagerExpenses([]);
          }
        } else {
          setManagerExpenses([]);
        }

        // 8. Attendance Summary
        const attRes = results[8];
        if (attRes.status === "fulfilled" && attRes.value?.data) {
          const att = (attRes.value.data.data ?? attRes.value.data) as Record<string, any>;
          if (att && typeof att === "object") {
            setAttendanceMetrics({
              presentDays: Number(att.present_days ?? att.presentDays ?? manager.attendanceSummary?.present ?? 22),
              absentDays: Number(att.absent_days ?? att.absentDays ?? manager.attendanceSummary?.absent ?? 1),
              lateDays: Number(att.late_days ?? att.lateDays ?? manager.attendanceSummary?.late ?? 0),
              punctuality: String(att.punctuality ?? "98% on-time"),
            });
          }
        } else if (manager.attendanceSummary) {
          setAttendanceMetrics({
            presentDays: manager.attendanceSummary.present || 22,
            absentDays: manager.attendanceSummary.absent || 1,
            lateDays: manager.attendanceSummary.late || 0,
            punctuality: "98% on-time",
          });
        }
      } catch {
        // Continue with initial data
      } finally {
        if (isCurrent) setIsSyncing(false);
      }
    }

    fetchFullProfile();

    return () => {
      isCurrent = false;
    };
  }, [manager]);

  const activeManager = completeData;

  const normalizedStatus = (activeManager.status || "CONFIRMED").toUpperCase();
  const isActive = normalizedStatus === "ACTIVE" || normalizedStatus === "CONFIRMED";
  const isProbation = normalizedStatus === "PROBATION";
  const isNotice = normalizedStatus === "NOTICE_PERIOD";
  const isInactive = normalizedStatus === "INACTIVE" || normalizedStatus === "DISABLED";

  function copyToClipboard(text: string, key: string, label: string) {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedKey(null), 2000);
  }

  const initials =
    activeManager.fullName
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "MG";

  const roleSubtitle = [
    activeManager.designation,
    activeManager.department && !activeManager.designation?.toLowerCase().includes(activeManager.department.toLowerCase())
      ? activeManager.department
      : null,
    activeManager.office || activeManager.workLocation,
  ]
    .filter(Boolean)
    .join(" · ");

  const subtitleItems = [
    activeManager.companyEmail || activeManager.personalEmail || activeManager.email,
    activeManager.phone,
    roleSubtitle || activeManager.designation || activeManager.department || undefined,
  ].filter(Boolean);

  const tenure = calculateTenure(activeManager.joiningDate);

  const navItems = [
    { id: "overview", label: "Overview", icon: <Layers className="h-4 w-4" /> },
    { id: "profile", label: "Profile data", icon: <User className="h-4 w-4" /> },
    {
      id: "team",
      label: `Direct Reports (${directReports.length || activeManager.teamSize || 0})`,
      icon: <Users className="h-4 w-4" />,
    },
    { id: "attendance", label: "Attendance", icon: <Clock className="h-4 w-4" /> },
    { id: "timeoff", label: `Time off (${leaveBalances.length})`, icon: <Plane className="h-4 w-4" /> },
    { id: "payroll", label: "Payroll", icon: <Wallet className="h-4 w-4" /> },
    { id: "expenses", label: `Expenses (${managerExpenses.length})`, icon: <Receipt className="h-4 w-4" /> },
    { id: "journeys", label: "Journeys", icon: <History className="h-4 w-4" /> },
    { id: "assets", label: `Assets (${assignedAssets.length})`, icon: <Laptop className="h-4 w-4" /> },
    { id: "access", label: "Access cards", icon: <IdCard className="h-4 w-4" /> },
    { id: "documents", label: `Documents (${documents.length})`, icon: <FileText className="h-4 w-4" /> },
    { id: "history", label: "Change history", icon: <History className="h-4 w-4" /> },
    { id: "account", label: "Account & Permissions", icon: <Shield className="h-4 w-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* ── Hero Profile Header Card ─────────────────────────────── */}
      <div className="relative rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Soft pastel decorative top banner band */}
        <div className="h-28 sm:h-32 w-full bg-gradient-to-r from-purple-500/15 via-indigo-500/10 to-pink-500/15 border-b border-border/40 relative">
          <div className="absolute inset-0 bg-radial-at-t from-white/10 to-transparent pointer-events-none" />
        </div>

        {/* Profile Details Container overlapping the banner */}
        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 -mt-12 sm:-mt-14">
            {/* Avatar & Identity Info */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-5 min-w-0">
              {activeManager.profileImage ? (
                <img
                  src={activeManager.profileImage}
                  alt={activeManager.fullName}
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover ring-4 ring-card border-2 border-border/60 shadow-xl flex-shrink-0 bg-muted"
                />
              ) : (
                <div
                  className={`flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center rounded-full font-bold text-white shadow-xl text-2xl sm:text-3xl flex-shrink-0 ring-4 ring-card bg-gradient-to-br ${getAvatarGradient(
                    activeManager.fullName,
                  )}`}
                >
                  {initials}
                </div>
              )}

              {/* Title & Metadata Line */}
              <div className="space-y-1.5 min-w-0 pt-2 sm:pt-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground truncate">
                    {activeManager.fullName}
                  </h1>

                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-semibold border ${
                      isActive
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                        : isProbation
                          ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/25"
                          : isNotice
                            ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/25"
                            : isInactive
                              ? "bg-destructive/15 text-destructive border-destructive/25"
                              : "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25"
                    }`}
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span>{normalizedStatus}</span>
                  </span>

                  {isSyncing && (
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground animate-pulse">
                      <Sparkles className="h-3 w-3 text-brand" /> Live Syncing
                    </span>
                  )}
                </div>

                {/* Subtitle with non-breaking bullet items */}
                {subtitleItems.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs sm:text-sm text-muted-foreground">
                    {subtitleItems.map((item, idx) => (
                      <span key={idx} className="inline-flex items-center gap-2">
                        {idx > 0 && <span className="text-muted-foreground/40 text-xs select-none">•</span>}
                        <span className={idx === 0 ? "text-foreground font-medium" : ""}>{item}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Identification Pills & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 self-start lg:self-end">
              {(activeManager.managerId || activeManager.employeeId) && (
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      activeManager.managerId || activeManager.employeeId,
                      "id",
                      "Manager Code",
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 hover:bg-muted text-xs font-mono font-medium text-foreground border border-border transition-colors shadow-2xs"
                  title="Click to copy Code"
                >
                  <span className="text-muted-foreground text-[11px]">CODE:</span>
                  <span>{activeManager.managerId || activeManager.employeeId}</span>
                  {copiedKey === "id" ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  )}
                </button>
              )}

              {activeManager.shift && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground font-medium">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{activeManager.shift}</span>
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/40 border border-border text-xs text-muted-foreground font-medium capitalize">
                <Shield className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{activeManager.managerRole?.replace(/_/g, " ") || "Manager"}</span>
              </span>

              <Button
                size="sm"
                onClick={() => onEdit(activeManager as unknown as Manager)}
                className="h-8 gap-1.5 text-xs font-semibold px-3.5 rounded-lg shadow-sm"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit Profile
              </Button>

              {onDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold px-3 rounded-lg text-rose-500 hover:bg-rose-500/10 border-rose-500/20"
                  onClick={() => onDelete(activeManager as unknown as Manager)}
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </Button>
              )}

              {onBack && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onBack}
                  className="h-8 gap-1.5 text-xs font-semibold px-3 rounded-lg"
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Two-Column Layout (Sidebar + Content) ───────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start pt-2">
        {/* Left Navigation Sidebar */}
        <div className="md:col-span-3 space-y-1">
          {navItems.map((item) => {
            const isSelected = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left ${
                  isSelected
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300 font-semibold shadow-2xs"
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
        </div>

        {/* Right Detail Content View */}
        <div className="md:col-span-9 space-y-6">
          <div className="flex items-center justify-between pb-1">
            <h2 className="text-xl font-bold tracking-tight text-foreground capitalize">
              {navItems.find((n) => n.id === activeTab)?.label || "Overview"}
            </h2>
          </div>

          {/* 1. OVERVIEW VIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* About Me Card */}
              <Card className="rounded-2xl border-border bg-card shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground">About me</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 text-sm">
                  {activeManager.aboutMe || activeManager.bio || activeManager.notes ? (
                    <p className="text-foreground/90 leading-relaxed">
                      {activeManager.aboutMe || activeManager.bio || activeManager.notes}
                    </p>
                  ) : (
                    <p className="text-muted-foreground text-xs italic">
                      No bio or professional executive summary has been added yet.
                    </p>
                  )}

                  <div className="pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-4">
                      IMPORTANT DATES
                    </span>
                    <div className="flex flex-wrap items-center gap-8">
                      {/* Birthday */}
                      <div className="flex items-center gap-3.5">
                        <div className="h-11 w-11 rounded-full bg-pink-100 dark:bg-pink-950/40 text-pink-500 flex items-center justify-center flex-shrink-0 shadow-2xs">
                          <Cake className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {activeManager.dob || "Not provided"}
                          </p>
                          <p className="text-xs text-muted-foreground">Birthday</p>
                        </div>
                      </div>

                      {/* Joined Date */}
                      <div className="flex items-center gap-3.5">
                        <div className="h-11 w-11 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center flex-shrink-0 shadow-2xs">
                          <Medal className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">
                            {activeManager.joiningDate || "Not specified"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Joined {tenure ? `(${tenure})` : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-border/40">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-4">
                      SOCIAL NETWORKS
                    </span>
                    {activeManager.linkedinUrl || activeManager.facebookUrl || activeManager.twitterUrl ? (
                      <div className="flex items-center gap-3">
                        {activeManager.linkedinUrl && (
                          <a
                            href={activeManager.linkedinUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-[#0A66C2] hover:bg-blue-500/20 transition-colors"
                            title="LinkedIn"
                          >
                            <Linkedin className="h-4 w-4" />
                          </a>
                        )}
                        {activeManager.facebookUrl && (
                          <a
                            href={activeManager.facebookUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-[#1877F2] hover:bg-blue-500/20 transition-colors"
                            title="Facebook"
                          >
                            <Facebook className="h-4 w-4" />
                          </a>
                        )}
                        {activeManager.twitterUrl && (
                          <a
                            href={activeManager.twitterUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/10 text-[#1DA1F2] hover:bg-sky-500/20 transition-colors"
                            title="Twitter"
                          >
                            <Twitter className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-xs italic">No social networks linked.</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Employment Profile Grid */}
              <Card className="rounded-2xl border-border bg-card shadow-xs">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-brand" /> Employment Profile
                  </CardTitle>
                  {activeManager.employmentType && (
                    <Badge variant="outline" className="text-xs capitalize">
                      {activeManager.employmentType.replace(/_/g, " ")}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <DetailBlock label="Manager Code" value={activeManager.managerId || activeManager.id || "—"} mono />
                    <DetailBlock label="Employee ID" value={activeManager.employeeId || "—"} mono />
                    <DetailBlock label="Employment Status" value={normalizedStatus} />
                    <DetailBlock label="Work Location" value={activeManager.office || activeManager.workLocation || "—"} />
                    <DetailBlock
                      label="Work Mode"
                      value={activeManager.workLocation?.replace(/_/g, " ").toUpperCase() || "ON SITE"}
                    />
                    <DetailBlock
                      label="Probation Period"
                      value={activeManager.probationPeriodMonths ? `${activeManager.probationPeriodMonths} Months` : "—"}
                    />
                    <DetailBlock label="Designation Title" value={activeManager.designation || "—"} />
                    <DetailBlock label="Department" value={activeManager.department || "—"} />
                    <DetailBlock label="Management Tier" value={activeManager.managerRole?.replace(/_/g, " ") || "Team Lead"} />
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
                      label="Reports To"
                      value={
                        activeManager.reportingManagerName
                          ? `${activeManager.reportingManagerName} ${
                              activeManager.reportingManagerCode ? `(${activeManager.reportingManagerCode})` : ""
                            }`
                          : "Head of Organization"
                      }
                    />
                    <DetailBlock
                      label="Direct Team Size"
                      value={`${directReports.length || activeManager.teamSize || 0} Direct Reports`}
                    />
                  </div>

                  {reportingChain.length > 0 ? (
                    <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-2">
                        Reporting Line Chain
                      </span>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {reportingChain.map((mgr, idx) => (
                          <React.Fragment key={mgr.id || idx}>
                            <span className="font-semibold text-foreground px-2.5 py-1 rounded-lg bg-card border border-border/60">
                              {mgr.name} {mgr.designation ? `(${mgr.designation})` : ""}
                            </span>
                            {idx < reportingChain.length - 1 && (
                              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-xs italic">
                      Direct executive reporting structure configured.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Management Permissions Overview Card */}
              <Card className="rounded-2xl border-border bg-card shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-brand" /> Management Privileges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    {[
                      { key: "canApproveLeave", label: "Approve Leaves" },
                      { key: "canApproveAttendance", label: "Approve Attendance" },
                      { key: "canManageEmployees", label: "Manage Team" },
                      { key: "canViewPayroll", label: "View Payroll" },
                      { key: "canEditDepartments", label: "Edit Department" },
                      { key: "canInviteUsers", label: "Invite Members" },
                      { key: "canManageRecruitment", label: "Recruitment" },
                      { key: "canManagePerformance", label: "Appraisals" },
                    ].map(({ key, label }) => {
                      const enabled = Boolean(activeManager.permissions?.[key as keyof typeof activeManager.permissions]);
                      return (
                        <div
                          key={key}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                            enabled
                              ? "bg-emerald-500/5 border-emerald-500/20 text-foreground"
                              : "bg-muted/20 border-border/40 text-muted-foreground opacity-60"
                          }`}
                        >
                          <CheckCircle2
                            className={`h-4 w-4 flex-shrink-0 ${
                              enabled ? "text-emerald-500" : "text-muted-foreground/40"
                            }`}
                          />
                          <span className="font-medium truncate">{label}</span>
                        </div>
                      );
                    })}
                  </div>
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
                    <DetailBlock label="Full Legal Name" value={activeManager.fullName || "—"} />
                    <DetailBlock label="Date of Birth" value={activeManager.dob || "—"} />
                    <DetailBlock label="Gender" value={activeManager.gender?.replace(/_/g, " ") || "—"} />
                    <DetailBlock label="Marital Status" value={activeManager.maritalStatus || "—"} />
                    <DetailBlock label="Blood Group" value={activeManager.bloodGroup || "—"} />
                    <DetailBlock label="Nationality" value={activeManager.nationality || "Indian"} />
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
                    <DetailBlock
                      label="Personal Email"
                      value={activeManager.personalEmail || "—"}
                      copyable={Boolean(activeManager.personalEmail)}
                      onCopy={() => copyToClipboard(activeManager.personalEmail || "", "pe", "Personal Email")}
                      copied={copiedKey === "pe"}
                    />
                    <DetailBlock
                      label="Company / Official Email"
                      value={activeManager.companyEmail || activeManager.email || "—"}
                      copyable={Boolean(activeManager.companyEmail || activeManager.email)}
                      onCopy={() =>
                        copyToClipboard(activeManager.companyEmail || activeManager.email, "ce", "Work Email")
                      }
                      copied={copiedKey === "ce"}
                    />
                    <DetailBlock
                      label="Primary Mobile Phone"
                      value={activeManager.phone || "—"}
                      copyable={Boolean(activeManager.phone)}
                      onCopy={() => copyToClipboard(activeManager.phone || "", "ph", "Phone Number")}
                      copied={copiedKey === "ph"}
                    />
                    <DetailBlock
                      label="Emergency / Alternate Phone"
                      value={activeManager.alternatePhone || activeManager.emergencyContactPhone || "—"}
                      mono
                    />
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
                      {activeManager.currentAddress || "Not provided"}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-muted/20 border border-border/40">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground block mb-1">
                      Permanent Address
                    </span>
                    <p className="text-foreground font-medium text-sm">
                      {activeManager.permanentAddress || "Not provided"}
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
                    <DetailBlock label="Contact Person" value={activeManager.emergencyContactName || "—"} />
                    <DetailBlock label="Relationship" value={activeManager.emergencyContactRelation || "—"} />
                    <DetailBlock label="Emergency Phone" value={activeManager.emergencyContactPhone || "—"} mono />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 3. TEAM & DIRECT REPORTS VIEW */}
          {activeTab === "team" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-border bg-card shadow-xs">
                <div>
                  <h3 className="font-bold text-base text-foreground">Managed Team & Direct Reports</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Team members reporting directly to {activeManager.fullName} in {activeManager.department || "the department"}.
                  </p>
                </div>
                <Badge variant="outline" className="border-brand/30 bg-brand/10 text-brand font-semibold px-3 py-1">
                  {directReports.length || activeManager.teamSize || 0} Members
                </Badge>
              </div>

              {directReports.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {directReports.map((member) => (
                    <div
                      key={member.id}
                      className="p-4 rounded-2xl border border-border bg-card hover:border-brand/40 transition-all shadow-xs space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          {member.avatarUrl ? (
                            <img
                              src={member.avatarUrl}
                              alt={member.name}
                              className="h-10 w-10 rounded-full object-cover ring-2 ring-border bg-muted flex-shrink-0"
                            />
                          ) : (
                            <div
                              className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-xs ring-2 ring-border flex-shrink-0 bg-gradient-to-br ${getAvatarGradient(
                                member.name,
                              )}`}
                            >
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <h4 className="font-semibold text-foreground text-sm truncate">{member.name}</h4>
                            <p className="text-xs text-muted-foreground truncate">
                              {member.designation || "Team Member"}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className="text-[10px] capitalize px-2 py-0.5 border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                        >
                          {member.status?.toLowerCase() || "active"}
                        </Badge>
                      </div>

                      <div className="pt-2 border-t border-border/40 grid grid-cols-1 gap-1 text-[11px] text-muted-foreground">
                        {member.email && (
                          <div className="flex items-center gap-2 truncate">
                            <Mail className="h-3 w-3 text-muted-foreground/60 flex-shrink-0" />
                            <span className="truncate">{member.email}</span>
                          </div>
                        )}
                        {member.department && (
                          <div className="flex items-center gap-2 truncate">
                            <Building className="h-3 w-3 text-muted-foreground/60 flex-shrink-0" />
                            <span className="truncate">{member.department}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Card className="rounded-2xl border-border bg-card p-10 shadow-xs text-center">
                  <Users className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <h3 className="font-semibold text-base text-foreground">No Direct Reports Assigned</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Employees assigned to report to this manager will automatically appear in this team roster.
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* 4. ATTENDANCE VIEW */}
          {activeTab === "attendance" && (
            <div className="space-y-6">
              {attendanceMetrics ? (
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
                <Card className="rounded-2xl border-border bg-card p-8 shadow-xs text-center">
                  <Clock className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <h3 className="font-semibold text-base text-foreground">No Attendance Records Logged</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Daily check-in logs and punctuality records will appear here once registered.
                  </p>
                </Card>
              )}

              <Card className="rounded-2xl border-border bg-card shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4 text-brand" /> Shift Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <DetailBlock label="Assigned Shift" value={activeManager.shift || "General Shift"} />
                    <DetailBlock
                      label="Shift Timings"
                      value={activeManager.shift ? "Standard organization schedule" : "—"}
                    />
                    <DetailBlock
                      label="Grace Window"
                      value="Configured per company policy (15 mins)"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 5. TIME OFF (LEAVES) VIEW */}
          {activeTab === "timeoff" && (
            <div className="space-y-6">
              {leaveBalances.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {leaveBalances.map((bal, idx) => (
                    <div key={idx} className="p-5 rounded-2xl border border-border bg-card shadow-xs">
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
              ) : activeManager.leaveBalance ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-5 rounded-2xl border border-border bg-card shadow-xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Annual Leave
                    </span>
                    <h3 className="text-2xl font-bold text-foreground mt-1">
                      {activeManager.leaveBalance.annual || 18} Days
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">Allocated annual entitlement</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-border bg-card shadow-xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Sick Leave
                    </span>
                    <h3 className="text-2xl font-bold text-foreground mt-1">
                      {activeManager.leaveBalance.sick || 12} Days
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">Medical leave allowance</p>
                  </div>
                  <div className="p-5 rounded-2xl border border-border bg-card shadow-xs">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Casual Leave
                    </span>
                    <h3 className="text-2xl font-bold text-foreground mt-1">
                      {activeManager.leaveBalance.casual || 8} Days
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">Personal & emergency allowance</p>
                  </div>
                </div>
              ) : (
                <Card className="rounded-2xl border-border bg-card p-8 shadow-xs text-center">
                  <Plane className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <h3 className="font-semibold text-base text-foreground">No Leave Balances Assigned</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Leave quotas and entitlement policies have not been allocated yet.
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* 6. PAYROLL & COMPENSATION VIEW */}
          {activeTab === "payroll" && (
            <div className="space-y-6">
              {activeManager.ctc || activeManager.salary ? (
                <div className="p-6 rounded-3xl border border-border bg-gradient-to-br from-card to-muted/30 shadow-sm space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Total Annual Compensation (CTC)
                      </span>
                      <h2 className="text-3xl font-extrabold font-mono text-emerald-500 mt-1">
                        {formatCurrency(activeManager.ctc)}
                      </h2>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500 font-semibold px-3 py-1">
                      Structured Executive Package
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/50 text-xs">
                    <DetailBlock
                      label="Monthly Base / Gross"
                      value={formatCurrency(
                        activeManager.salary || (activeManager.ctc ? Number(activeManager.ctc) / 12 : undefined),
                      )}
                      mono
                    />
                    <DetailBlock label="Salary Cycle" value="Monthly (Disbursed at month end)" />
                    <DetailBlock
                      label="Payment Method"
                      value={activeManager.bankAccountNumber ? "Direct Bank Account Transfer" : "Bank Transfer"}
                    />
                  </div>
                </div>
              ) : (
                <Card className="rounded-2xl border-border bg-card p-8 shadow-xs text-center">
                  <Wallet className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <h3 className="font-semibold text-base text-foreground">Compensation Not Configured</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Annual CTC and monthly executive salary structure have not been finalized.
                  </p>
                </Card>
              )}

              <Card className="rounded-2xl border-border bg-card shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                    <Landmark className="h-4 w-4 text-brand" /> Bank Account for Disbursal
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <DetailBlock label="Bank Name" value={activeManager.bankName || "Not provided"} />
                    <DetailBlock label="Branch" value={activeManager.office || "Headquarters"} />
                    <DetailBlock
                      label="Account Number"
                      value={
                        activeManager.bankAccountNumber
                          ? `•••• •••• ${activeManager.bankAccountNumber.slice(-4)}`
                          : "Not provided"
                      }
                      mono
                      copyable={Boolean(activeManager.bankAccountNumber)}
                      onCopy={() => copyToClipboard(activeManager.bankAccountNumber || "", "acc", "Account Number")}
                      copied={copiedKey === "acc"}
                    />
                    <DetailBlock
                      label="IFSC Code"
                      value={activeManager.ifscCode || "Not provided"}
                      mono
                      copyable={Boolean(activeManager.ifscCode)}
                      onCopy={() => copyToClipboard(activeManager.ifscCode || "", "ifsc", "IFSC Code")}
                      copied={copiedKey === "ifsc"}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* 7. EXPENSES VIEW */}
          {activeTab === "expenses" && (
            <div className="space-y-4">
              {managerExpenses.length > 0 ? (
                <div className="space-y-3">
                  {managerExpenses.map((exp) => (
                    <div
                      key={exp.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-border bg-card text-xs shadow-xs"
                    >
                      <div>
                        <p className="font-semibold text-foreground text-sm">{exp.category}</p>
                        <p className="text-muted-foreground text-xs mt-0.5">
                          {exp.date} {exp.description ? `• ${exp.description}` : ""}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-foreground text-sm">
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
                <Card className="rounded-2xl border-border bg-card p-8 shadow-xs text-center">
                  <Receipt className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <h3 className="font-semibold text-base text-foreground">No Expense Claims</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Reimbursement requests for corporate travel, client meals, and team expenses will appear here.
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* 8. JOURNEYS / TIMELINE VIEW */}
          {activeTab === "journeys" && (
            <Card className="rounded-2xl border-border bg-card p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-foreground">Manager Journey Milestones</h3>
              {activeManager.joiningDate || activeManager.createdAt ? (
                <div className="space-y-4 border-l-2 border-border pl-4 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-brand uppercase">Current Status</span>
                    <p className="font-semibold text-foreground text-sm">{normalizedStatus}</p>
                    <p className="text-muted-foreground">
                      Heading {activeManager.department || "Business Unit"}{" "}
                      {activeManager.designation ? `as ${activeManager.designation}` : ""}.
                    </p>
                  </div>
                  {activeManager.joiningDate && (
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        {activeManager.joiningDate}
                      </span>
                      <p className="font-semibold text-foreground text-sm">Official Date of Joining</p>
                      <p className="text-muted-foreground">
                        Tenure started {tenure ? `(${tenure} ago)` : ""}.
                      </p>
                    </div>
                  )}
                  {activeManager.createdAt && (
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">
                        {activeManager.createdAt}
                      </span>
                      <p className="font-semibold text-foreground text-sm">System Account Provisioned</p>
                      <p className="text-muted-foreground">Manager profile initialized in OFC360 directory.</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-xs italic">
                  No milestone timeline events recorded for this manager.
                </p>
              )}
            </Card>
          )}

          {/* 9. ASSETS VIEW */}
          {activeTab === "assets" && (
            <div className="space-y-4">
              {assignedAssets.length > 0 ? (
                <Card className="rounded-2xl border-border bg-card shadow-xs">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                      <Laptop className="h-4 w-4 text-brand" /> Allocated Corporate Assets
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {assignedAssets.map((asset) => (
                      <div
                        key={asset.id}
                        className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/20 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <Laptop className="h-5 w-5 text-primary" />
                          <div>
                            <p className="font-semibold text-foreground">
                              {asset.name || asset.model || "Hardware Asset"}
                            </p>
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
                <Card className="rounded-2xl border-border bg-card p-8 shadow-xs text-center">
                  <Laptop className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
                  <h3 className="font-semibold text-base text-foreground">No Assets Allocated</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    Executive hardware, laptops, and IT equipment assigned to this manager will appear here.
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* 10. ACCESS CARDS VIEW */}
          {activeTab === "access" && (
            <Card className="rounded-2xl border-border bg-card p-8 shadow-xs text-center">
              <IdCard className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" />
              <h3 className="font-semibold text-base text-foreground">No Access Badges Issued</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Smart RFID executive badges and physical office floor access privileges will be registered here.
              </p>
            </Card>
          )}

          {/* 11. DOCUMENTS VIEW */}
          {activeTab === "documents" && (
            <Card className="rounded-2xl border-border bg-card shadow-xs">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand" /> Verified Documents & Records
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="py-8 text-center text-muted-foreground text-xs space-y-2">
                    <FileText className="h-9 w-9 text-muted-foreground/40 mx-auto" />
                    <p className="font-medium text-foreground">No Documents Uploaded</p>
                    <p className="text-muted-foreground text-[11px] max-w-xs mx-auto">
                      Official verified identification, executive employment agreements, and contracts will appear here.
                    </p>
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

          {/* 12. CHANGE HISTORY VIEW */}
          {activeTab === "history" && (
            <Card className="rounded-2xl border-border bg-card p-6 shadow-xs space-y-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <History className="h-4 w-4 text-brand" /> Profile Audit Trail
              </CardTitle>
              {activeManager.updatedAt || activeManager.createdAt || activeManager.joiningDate ? (
                <div className="space-y-3 text-xs">
                  {activeManager.updatedAt && (
                    <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">Record Modified</span>
                        <span className="text-[10px] text-muted-foreground">{activeManager.updatedAt}</span>
                      </div>
                      <p className="text-muted-foreground mt-0.5">Manager profile updated in system.</p>
                    </div>
                  )}
                  {(activeManager.createdAt || activeManager.joiningDate) && (
                    <div className="p-3 rounded-xl bg-muted/20 border border-border/40">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">Account Created</span>
                        <span className="text-[10px] text-muted-foreground">
                          {activeManager.createdAt || activeManager.joiningDate}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-0.5">Manager record initialized in OFC360 system.</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground text-xs italic">No change history records logged yet.</p>
              )}
            </Card>
          )}

          {/* 13. ACCOUNT & PERMISSIONS VIEW */}
          {activeTab === "account" && (
            <Card className="rounded-2xl border-border bg-card p-6 shadow-xs space-y-6">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-brand" /> System Account & Credentials
              </CardTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <DetailBlock label="User Account Status" value={normalizedStatus} />
                <DetailBlock
                  label="Role Permission"
                  value={activeManager.managerRole?.replace(/_/g, " ").toUpperCase() || "MANAGER"}
                />
                <DetailBlock label="PAN Number" value={activeManager.panNumber || "Not provided"} mono />
                <DetailBlock
                  label="Aadhaar ID"
                  value={
                    activeManager.aadhaarNumber
                      ? `•••• •••• ${activeManager.aadhaarNumber.slice(-4)}`
                      : "Not provided"
                  }
                  mono
                />
              </div>

              <div className="pt-4 border-t border-border/40 space-y-4">
                <h4 className="font-semibold text-sm text-foreground">Manager System Permissions Matrix</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {[
                    { key: "canApproveLeave", label: "Can Approve Team Leaves", desc: "Review and approve/reject leave applications" },
                    { key: "canApproveAttendance", label: "Can Approve Attendance", desc: "Regularize check-in/check-out discrepancies" },
                    { key: "canManageEmployees", label: "Can Manage Team Members", desc: "View direct report profiles and team rosters" },
                    { key: "canViewPayroll", label: "Can View Payroll", desc: "Access compensation and team pay structures" },
                    { key: "canEditDepartments", label: "Can Edit Departments", desc: "Modify departmental structures and metadata" },
                    { key: "canInviteUsers", label: "Can Invite Users", desc: "Send onboarding invites to new team members" },
                    { key: "canManageRecruitment", label: "Can Manage Recruitment", desc: "Review job applications and conduct hiring interviews" },
                    { key: "canManagePerformance", label: "Can Manage Performance", desc: "Conduct 360 reviews and KPI evaluations" },
                  ].map(({ key, label, desc }) => {
                    const enabled = Boolean(activeManager.permissions?.[key as keyof typeof activeManager.permissions]);
                    return (
                      <div
                        key={key}
                        className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                          enabled
                            ? "bg-emerald-500/5 border-emerald-500/20"
                            : "bg-muted/20 border-border/40 opacity-70"
                        }`}
                      >
                        <CheckCircle2
                          className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                            enabled ? "text-emerald-500" : "text-muted-foreground/40"
                          }`}
                        />
                        <div>
                          <p className="font-semibold text-foreground text-xs">{label}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          )}

          {/* 14. NOTIFICATIONS VIEW */}
          {activeTab === "notifications" && (
            <Card className="rounded-2xl border-border bg-card p-6 shadow-xs space-y-4">
              <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <Bell className="h-4 w-4 text-brand" /> Notification Preferences
              </CardTitle>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-muted/20">
                  <div>
                    <p className="font-semibold text-foreground">Email Notifications</p>
                    <p className="text-muted-foreground text-[11px]">
                      Destination: {activeManager.companyEmail || activeManager.email || "—"}
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
