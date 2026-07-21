import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Manager } from "../types";
import { STATUS_OPTIONS } from "../constants";
import { getDepartmentLabel } from "@/features/admin/employees/utils/departmentOptions";
import {
  Mail,
  Phone,
  Calendar,
  Building,
  User,
  ShieldAlert,
  FileText,
  Clock,
  Award,
  CircleCheck,
  Plane,
  UserCheck2,
} from "lucide-react";
import { fmtDate, avatarHue } from "../utils";
import { Loader } from "@/components/aurix/Loader";

const STATUS_STYLES: Partial<Record<Manager["status"], string>> = {
  PROBATION: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  CONFIRMED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  NOTICE_PERIOD: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

const WORK_LOCATION_LABELS: Record<Manager["workLocation"], string> = {
  on_site: "On Site",
  remote: "Remote",
  hybrid: "Hybrid",
};

function getStatusLabel(status: Manager["status"]): string {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}

function formatReportingManager(manager: Manager): string {
  if (!manager.reportingManagerName) return "—";
  if (manager.reportingManagerCode) {
    return `${manager.reportingManagerName} (${manager.reportingManagerCode})`;
  }
  return manager.reportingManagerName;
}

interface ManagerProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  manager: Manager | null;
  loading?: boolean;
  error?: string | null;
}

export function ManagerProfileDrawer({
  open,
  onOpenChange,
  manager,
  loading = false,
  error = null,
}: ManagerProfileDrawerProps) {
  if (!open) return null;

  if (loading) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg border-l border-border bg-card/90 backdrop-blur-xl p-0 shadow-2xl flex flex-col h-full">
          <Loader variant="panel" label="Loading manager profile..." className="h-full" />
        </SheetContent>
      </Sheet>
    );
  }

  if (error) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-md md:max-w-lg border-l border-border bg-card/90 backdrop-blur-xl p-0 shadow-2xl flex flex-col h-full">
          <div className="flex h-full items-center justify-center p-6 text-sm text-rose-500">{error}</div>
        </SheetContent>
      </Sheet>
    );
  }

  if (!manager) return null;

  const initials = manager.fullName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");

  const hue = avatarHue(manager.fullName);

  // Mock document list
  const mockDocuments = [
    { name: "Employment_Contract.pdf", size: "2.4 MB", date: "2026-01-15" },
    { name: "NDA_Signed.pdf", size: "1.1 MB", date: "2026-01-16" },
    { name: "Q1_Performance_Review.pdf", size: "850 KB", date: "2026-04-10" },
  ];

  // Permissions list
  const activePermissions = Object.entries(manager.permissions)
    .filter(([_, value]) => value)
    .map(([key]) => {
      // camelCase to spaced sentence
      return key
        .replace(/([A-Z])/g, " $1")
        .replace(/^can /, "Can ");
    });
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md md:max-w-lg border-l border-border bg-card/90 backdrop-blur-xl p-0 shadow-2xl flex flex-col h-full">
        <SheetHeader className="p-6 border-b border-border/60">
          <div className="flex items-center gap-4">
            {manager.profileImage ? (
              <img
                src={manager.profileImage}
                alt={manager.fullName}
                className="h-16 w-16 rounded-2xl object-cover border border-border shadow-sm"
              />
            ) : (
              <div
                className="flex h-16 w-16 items-center justify-center rounded-2xl font-bold text-white shadow-inner text-xl"
                style={{
                  background: `linear-gradient(135deg, hsl(${hue}, 70%, 55%), hsl(${(hue + 40) % 360}, 75%, 45%))`,
                }}
              >
                {initials}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <SheetTitle className="text-xl font-bold truncate text-foreground flex items-center gap-2">
                {manager.fullName}
              </SheetTitle>
              <p className="text-sm font-medium text-muted-foreground truncate">{manager.designation}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <Badge
                  variant="outline"
                  className={`px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[manager.status]}`}
                >
                  {getStatusLabel(manager.status)}
                </Badge>
                {manager.managerId ? (
                  <Badge variant="secondary" className="px-2 py-0.5 text-xs font-medium">
                    {manager.managerId}
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1 p-6 space-y-6">
          <div className="space-y-6 pb-6">
            {/* Quick Contact & Info Grid */}
            <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/50 bg-muted/20 p-4">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Email</p>
                  <p className="text-xs font-medium truncate text-foreground">{manager.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                  <Phone className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Phone</p>
                  <p className="text-xs font-medium truncate text-foreground">{manager.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                  <Building className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Dept & Office</p>
                  <p className="text-xs font-medium truncate text-foreground">
                    {getDepartmentLabel(manager.department)} · {manager.office}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                  <Calendar className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Joined On</p>
                  <p className="text-xs font-medium truncate text-foreground">{fmtDate(manager.joiningDate)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Reporting To</p>
                  <p className="text-xs font-medium truncate text-foreground">{formatReportingManager(manager)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                  <Building className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Work Mode</p>
                  <p className="text-xs font-medium truncate text-foreground">
                    {WORK_LOCATION_LABELS[manager.workLocation]}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                  <UserCheck2 className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Team Size</p>
                  <p className="text-xs font-medium truncate text-foreground">{manager.teamSize} direct reports</p>
                </div>
              </div>
            </div>

            {/* Performance Card */}
            <div className="rounded-2xl border border-border/60 bg-card p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-brand" />
                  <h4 className="text-sm font-semibold text-foreground">Performance Rating</h4>
                </div>
                <Badge variant="outline" className="font-bold text-brand bg-brand/5 border-brand/20">
                  {manager.performanceScore}%
                </Badge>
              </div>
              <Progress value={manager.performanceScore} className="h-2" />
              <p className="text-[11px] text-muted-foreground mt-2">
                Based on peer feedback, quarterly objective completions, and team deliverables.
              </p>
            </div>

            {/* Attendance & Leave Summaries */}
            <div className="grid grid-cols-2 gap-4">
              {/* Attendance */}
              <div className="rounded-2xl border border-border/50 bg-card p-4 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-3">
                  <CircleCheck className="h-3.5 w-3.5 text-emerald-500" />
                  Attendance (Month)
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-emerald-500/5 rounded-lg p-1.5 border border-emerald-500/10">
                    <span className="block text-sm font-bold text-emerald-500">
                      {manager.attendanceSummary.present}
                    </span>
                    <span className="text-[8px] font-medium text-muted-foreground uppercase">Present</span>
                  </div>
                  <div className="bg-rose-500/5 rounded-lg p-1.5 border border-rose-500/10">
                    <span className="block text-sm font-bold text-rose-500">
                      {manager.attendanceSummary.absent}
                    </span>
                    <span className="text-[8px] font-medium text-muted-foreground uppercase">Absent</span>
                  </div>
                  <div className="bg-amber-500/5 rounded-lg p-1.5 border border-amber-500/10">
                    <span className="block text-sm font-bold text-amber-500">
                      {manager.attendanceSummary.late}
                    </span>
                    <span className="text-[8px] font-medium text-muted-foreground uppercase">Late</span>
                  </div>
                  <div className="bg-blue-500/5 rounded-lg p-1.5 border border-blue-500/10">
                    <span className="block text-sm font-bold text-blue-500">
                      {manager.attendanceSummary.leave}
                    </span>
                    <span className="text-[8px] font-medium text-muted-foreground uppercase">Leave</span>
                  </div>
                </div>
              </div>

              {/* Leave Balance */}
              <div className="rounded-2xl border border-border/50 bg-card p-4 flex flex-col justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-3">
                  <Plane className="h-3.5 w-3.5 text-blue-500" />
                  Leave Balances
                </div>
                <div className="grid grid-cols-3 gap-1 text-center">
                  <div className="bg-blue-500/5 rounded-lg p-1.5 border border-blue-500/10">
                    <span className="block text-sm font-bold text-blue-500">{manager.leaveBalance.annual}d</span>
                    <span className="text-[8px] font-medium text-muted-foreground uppercase">Annual</span>
                  </div>
                  <div className="bg-purple-500/5 rounded-lg p-1.5 border border-purple-500/10">
                    <span className="block text-sm font-bold text-purple-500">{manager.leaveBalance.sick}d</span>
                    <span className="text-[8px] font-medium text-muted-foreground uppercase">Sick</span>
                  </div>
                  <div className="bg-cyan-500/5 rounded-lg p-1.5 border border-cyan-500/10">
                    <span className="block text-sm font-bold text-cyan-500">{manager.leaveBalance.casual}d</span>
                    <span className="text-[8px] font-medium text-muted-foreground uppercase">Casual</span>
                  </div>
                </div>
                <p className="text-[9px] text-muted-foreground text-center mt-2">
                  Accrued leave cycles reset annually.
                </p>
              </div>
            </div>

            {/* Permissions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <ShieldAlert className="h-3.5 w-3.5" /> Approved Scope & Permissions
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {activePermissions.length > 0 ? (
                  activePermissions.map((perm, i) => (
                    <Badge key={i} variant="outline" className="bg-muted/30 border-border px-2 py-0.5 text-[10px] font-medium">
                      ✓ {perm}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground italic">No elevated dashboard permissions active</span>
                )}
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Recent Activity
              </h4>
              <div className="space-y-4 relative border-l border-border/80 ml-2 pl-4 py-1">
                {manager.recentActivity && manager.recentActivity.length > 0 ? (
                  manager.recentActivity.map((act) => (
                    <div key={act.id} className="relative">
                      <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border border-card bg-brand" />
                      <p className="text-xs font-semibold text-foreground leading-tight">{act.action}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {fmtDate(act.timestamp)} at {new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-muted-foreground italic pl-1">No activities logged recently</div>
                )}
              </div>
            </div>

            {/* Documents */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" /> Shared & Verified Documents
              </h4>
              <div className="space-y-2">
                {mockDocuments.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-muted/10 hover:bg-muted/20 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{doc.name}</p>
                        <p className="text-[9px] text-muted-foreground">{doc.size} • Uploaded {fmtDate(doc.date)}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0">
                      Download
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
