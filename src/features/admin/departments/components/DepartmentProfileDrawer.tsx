import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { Department } from "../types";
import {
  Mail,
  Calendar,
  Building,
  User,
  ShieldAlert,
  FileText,
  Clock,
  Award,
  Users,
  DollarSign,
  Plus,
  ArrowRightLeft,
  ArrowUpCircle,
  UserMinus,
  Briefcase,
  MapPin,
  Building2,
  Trash2,
} from "lucide-react";
import { fmtDate, fmtBudget } from "../utils";
import { useAurix } from "@/lib/aurix-store";
import { toast } from "sonner";
import * as LucideIcons from "lucide-react";

interface DepartmentProfileDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
  departments: Department[]; // for transferring
  onAddEmployee: (deptId: string, empId: string) => void;
  onRemoveEmployee: (deptId: string, empId: string) => void;
  onTransferEmployee: (fromDeptId: string, toDeptId: string, empId: string) => void;
  onPromoteEmployee: (empId: string, newDesignation: string) => void;
  onUpdateDepartment: (dept: Department) => void;
}

export function DepartmentProfileDrawer({
  open,
  onOpenChange,
  department,
  departments,
  onAddEmployee,
  onRemoveEmployee,
  onTransferEmployee,
  onPromoteEmployee,
  onUpdateDepartment,
}: DepartmentProfileDrawerProps) {
  const ws = useAurix();
  const [promoteOpen, setPromoteOpen] = useState(false);
  const [empToPromote, setEmpToPromote] = useState<{ id: string; name: string; designation: string } | null>(null);
  const [newDesignation, setNewDesignation] = useState("");

  if (!department) return null;

  const IconComponent = (LucideIcons as any)[department.iconName] || Building2;

  // Filter employees belonging to this department
  const teamMembers = ws.employees.filter(
    (e) =>
      (e.department && e.department.toLowerCase() === department.name.toLowerCase()) ||
      department.employeeIds.includes(e.id)
  );

  // Eligible employees to add (not in this department)
  const addableEmployees = ws.employees.filter(
    (e) =>
      (!e.department || e.department.toLowerCase() !== department.name.toLowerCase()) &&
      !department.employeeIds.includes(e.id)
  );

  // Status badges colors
  const statusColors: Record<Department["status"], string> = {
    active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    inactive: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    hiring: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    growing: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  const statusLabels: Record<Department["status"], string> = {
    active: "Active",
    inactive: "Inactive",
    hiring: "Hiring",
    growing: "Growing",
  };

  const handleHiringStatusChange = (val: Department["hiringStatus"]) => {
    const updated: Department = {
      ...department,
      hiringStatus: val,
      openPositions: val === "open" ? Math.max(1, department.openPositions) : 0,
      recentActivity: [
        {
          id: `act_${Date.now()}`,
          action: `Hiring status updated to ${val.toUpperCase()}`,
          timestamp: new Date().toISOString(),
        },
        ...department.recentActivity,
      ],
    };
    onUpdateDepartment(updated);
    toast.success(`Hiring status set to ${val.toUpperCase()}`);
  };

  const handlePromoteClick = (empId: string, name: string, currentDesg: string) => {
    setEmpToPromote({ id: empId, name, designation: currentDesg });
    setNewDesignation(currentDesg);
    setPromoteOpen(true);
  };

  const handleConfirmPromote = () => {
    if (empToPromote && newDesignation.trim()) {
      onPromoteEmployee(empToPromote.id, newDesignation.trim());
      toast.success(`${empToPromote.name} promoted to ${newDesignation.trim()}`);
      setPromoteOpen(false);
      setEmpToPromote(null);
    }
  };

  const handleAddEmployeeSelect = (empId: string) => {
    if (department.employeeIds.length >= department.employeeCapacity) {
      toast.warning("Department has reached its maximum employee capacity limit!");
      return;
    }
    onAddEmployee(department.id, empId);
    toast.success("Employee assigned to department successfully");
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          className="w-full sm:max-w-md md:max-w-xl border-l border-border bg-card p-0 shadow-2xl flex flex-col h-full"
          overlayClassName="bg-black/30 backdrop-blur-sm"
        >
          <SheetHeader className="p-6 border-b border-border/60">
            <div className="flex items-center gap-4">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-sm flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${department.themeColor}, ${department.themeColor}cc)`,
                }}
              >
                <IconComponent className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <SheetTitle className="text-xl font-bold truncate text-foreground flex items-center gap-2">
                  {department.name}
                </SheetTitle>
                <p className="text-xs font-mono font-medium text-muted-foreground">Code: {department.department_code}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1.5">
                  <Badge variant="outline" className={`px-2 py-0.5 text-xs font-semibold ${statusColors[department.status]}`}>
                    {statusLabels[department.status]}
                  </Badge>
                  <Badge variant="secondary" className="px-2 py-0.5 text-xs font-medium">
                    CC ID: {department.cost_center}
                  </Badge>
                </div>
              </div>
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 p-6 space-y-6">
            <div className="space-y-6 pb-6">
              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</h4>
                <p className="text-xs leading-relaxed text-foreground/80 bg-muted/10 border border-border/40 p-3 rounded-xl">
                  {department.description || "No description provided."}
                </p>
              </div>

              {/* Quick Details Grid */}
              <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/50 bg-muted/20 p-4">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                    <User className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Dept Head</p>
                    <p className="text-xs font-medium truncate text-foreground">{department.departmentHeadName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                    <Building className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Reporting To</p>
                    <p className="text-xs font-medium truncate text-foreground">{department.reportingManagerName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Office Location</p>
                    <p className="text-xs font-medium truncate text-foreground">{department.office}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Annual Budget</p>
                    <p className="text-xs font-medium truncate text-foreground">{fmtBudget(department.budget)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                    <Users className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Capacity limit</p>
                    <p className="text-xs font-medium truncate text-foreground">
                      {teamMembers.length} / {department.employeeCapacity} employees
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground flex-shrink-0">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Created Date</p>
                    <p className="text-xs font-medium truncate text-foreground">{fmtDate(department.createdDate)}</p>
                  </div>
                </div>
              </div>

              {/* Performance & Attendance Progress bars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border/60 bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-brand" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Performance Score</h4>
                    </div>
                    <Badge variant="outline" className="font-bold text-brand bg-brand/5 border-brand/20 text-[10px]">
                      {department.performanceScore}%
                    </Badge>
                  </div>
                  <Progress value={department.performanceScore} className="h-1.5" />
                </div>

                <div className="rounded-2xl border border-border/60 bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-emerald-500" />
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Attendance (Avg)</h4>
                    </div>
                    <Badge variant="outline" className="font-bold text-emerald-500 bg-emerald-500/5 border-emerald-500/10 text-[10px]">
                      {department.attendanceScore}%
                    </Badge>
                  </div>
                  <Progress value={department.attendanceScore} className="h-1.5" />
                </div>
              </div>

              {/* Hiring controls */}
              <div className="rounded-2xl border border-border/50 bg-muted/10 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-amber-500" /> Hiring Status
                    </h4>
                    <p className="text-[10px] text-muted-foreground mt-0.5">Control job position recruitment state</p>
                  </div>
                  <Select value={department.hiringStatus} onValueChange={(val) => handleHiringStatusChange(val as Department["hiringStatus"])}>
                    <SelectTrigger className="h-8 w-[110px] text-xs bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open (Recruit)</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {department.hiringStatus === "open" && (
                  <div className="text-[11px] text-amber-600 bg-amber-500/5 border border-amber-500/10 rounded-lg p-2 flex items-center justify-between">
                    <span>Recruiting for {department.openPositions} active open positions</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const pos = department.openPositions + 1;
                        onUpdateDepartment({ ...department, openPositions: pos });
                        toast.success("Additional open position added");
                      }}
                      className="h-6 text-[10px] bg-background hover:bg-muted text-foreground border border-border/80 px-2 rounded-md"
                    >
                      + Inc Position
                    </Button>
                  </div>
                )}
              </div>

              {/* Employee Management Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Users className="h-4 w-4" /> Team Members ({teamMembers.length})
                  </h4>
                  {/* Add Employee select dropdown */}
                  {addableEmployees.length > 0 && (
                    <Select onValueChange={handleAddEmployeeSelect}>
                      <SelectTrigger className="h-8 w-[160px] text-xs bg-brand text-brand-foreground shadow-glow hover:bg-brand/90 rounded-xl border-none cursor-pointer">
                        <Plus className="h-3.5 w-3.5 mr-1" />
                        Add Employee
                      </SelectTrigger>
                      <SelectContent>
                        {addableEmployees.map((e) => (
                          <SelectItem key={e.id} value={e.id}>
                            {e.fullName} ({e.designation || "No Title"})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {teamMembers.length > 0 ? (
                    teamMembers.map((emp) => {
                      const initials = emp.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("");
                      const hue = Array.from(emp.fullName).reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

                      return (
                        <div
                          key={emp.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-card hover:bg-muted/15 transition-all duration-200"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-bold text-white shadow-inner flex-shrink-0"
                              style={{
                                background: `linear-gradient(135deg, hsl(${hue}, 60%, 55%), hsl(${(hue + 45) % 360}, 65%, 45%))`,
                              }}
                            >
                              {initials}
                            </div>
                            <div className="min-w-0">
                              <p
                                onClick={() => toast.info(`Viewing employee profiles: ${emp.fullName}`)}
                                className="text-xs font-semibold text-foreground truncate cursor-pointer hover:underline"
                              >
                                {emp.fullName}
                              </p>
                              <p className="text-[10px] text-muted-foreground truncate">{emp.designation}</p>
                            </div>
                          </div>

                          {/* Member actions */}
                          <div className="flex items-center gap-1">
                            {/* Promote button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handlePromoteClick(emp.id, emp.fullName, emp.designation)}
                              title="Promote Employee"
                              className="h-7 w-7 rounded-lg hover:bg-muted/50 cursor-pointer text-muted-foreground hover:text-brand"
                            >
                              <ArrowUpCircle className="h-4 w-4" />
                            </Button>

                            {/* Transfer Dropdown */}
                            {departments.length > 1 && (
                              <Select
                                onValueChange={(targetDeptId) => {
                                  onTransferEmployee(department.id, targetDeptId, emp.id);
                                  const targetDept = departments.find((d) => d.id === targetDeptId);
                                  toast.success(`Transferred ${emp.fullName} to ${targetDept?.name}`);
                                }}
                              >
                                <SelectTrigger className="h-7 w-7 p-0 rounded-lg hover:bg-muted/50 border-none bg-transparent hover:text-foreground text-muted-foreground cursor-pointer justify-center flex">
                                  <ArrowRightLeft className="h-4 w-4" />
                                </SelectTrigger>
                                <SelectContent>
                                  {departments
                                    .filter((d) => d.id !== department.id)
                                    .map((d) => (
                                      <SelectItem key={d.id} value={d.id}>
                                        Transfer to {d.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                            )}

                            {/* Remove button */}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                onRemoveEmployee(department.id, emp.id);
                                toast.success(`Removed ${emp.fullName} from ${department.name}`);
                              }}
                              title="Remove Employee"
                              className="h-7 w-7 rounded-lg hover:bg-rose-500/10 text-muted-foreground hover:text-rose-500 cursor-pointer"
                            >
                              <UserMinus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-xs text-muted-foreground italic p-3 text-center border border-dashed border-border rounded-xl">
                      No employees assigned to this department division.
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" /> Recent Activities
                </h4>
                <div className="space-y-4 relative border-l border-border/80 ml-2 pl-4 py-1">
                  {department.recentActivity && department.recentActivity.length > 0 ? (
                    department.recentActivity.map((act) => (
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
                  <FileText className="h-3.5 w-3.5" /> Department Guidelines & Documents
                </h4>
                <div className="space-y-2">
                  {department.documents && department.documents.length > 0 ? (
                    department.documents.map((doc, idx) => (
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
                    ))
                  ) : (
                    <div className="text-xs text-muted-foreground italic p-3 text-center border border-dashed border-border rounded-xl">
                      No documents uploaded yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Promotion Dialog */}
      <Dialog open={promoteOpen} onOpenChange={setPromoteOpen}>
        <DialogContent className="rounded-2xl border-border bg-card p-6 backdrop-blur-xl max-w-md">
          <DialogHeader>
            <DialogTitle className="font-bold text-lg">Promote Employee Designation</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Employee Name</p>
              <p className="text-sm font-semibold text-foreground">{empToPromote?.name}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Current Designation</p>
              <p className="text-xs text-muted-foreground italic">{empToPromote?.designation}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newDesignation">New Corporate Designation</Label>
              <Input
                id="newDesignation"
                value={newDesignation}
                onChange={(e) => setNewDesignation(e.target.value)}
                placeholder="e.g. Lead Frontend Architect"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setPromoteOpen(false)} className="rounded-xl border-border bg-card">
              Cancel
            </Button>
            <Button onClick={handleConfirmPromote} className="rounded-xl bg-brand text-brand-foreground shadow-glow hover:bg-brand/90">
              Promote Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
