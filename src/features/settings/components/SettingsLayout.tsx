import React, { useState, useEffect } from "react";
import {
  Building2,
  User,
  Users,
  Clock,
  CalendarDays,
  Banknote,
  FileText,
  Package,
  Bell,
  AlertTriangle,
} from "lucide-react";
import { useAurix } from "@/lib/aurix-store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  resolveRbacRole,
  canAccessSection,
  canEditSection,
  type SettingsSectionKey,
  type RbacRole,
} from "../types";
import { AccessDeniedView } from "./AccessDeniedView";
import { CompanySection } from "./sections/CompanySection";
import { MyProfileSection } from "./sections/MyProfileSection";
import { EmployeesSection } from "./sections/EmployeesSection";
import { AttendanceSection } from "./sections/AttendanceSection";
import { LeaveSection } from "./sections/LeaveSection";
import { PayrollSection } from "./sections/PayrollSection";
import { DocumentsSection } from "./sections/DocumentsSection";
import { AssetsSection } from "./sections/AssetsSection";
import { NotificationsSection } from "./sections/NotificationsSection";

interface SettingsCardMeta {
  id: SettingsSectionKey;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const SETTINGS_CARDS: SettingsCardMeta[] = [
  {
    id: "company",
    label: "Company",
    description:
      "Manage organization identity, brand logo, legal address, contact details, and default operating currency.",
    icon: Building2,
    color: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30",
  },
  {
    id: "profile",
    label: "My Profile",
    description:
      "View and update personal details, profile avatar, account email, phone number, and password security.",
    icon: User,
    color: "from-indigo-500/20 to-violet-500/20 text-indigo-400 border-indigo-500/30",
  },
  {
    id: "employees",
    label: "Employees",
    description:
      "Structure departments, organizational designations, employee ID generation, notice period & probation.",
    icon: Users,
    color: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: "attendance",
    label: "Attendance",
    description:
      "Work hours, shift timing rules, grace periods, late-mark penalties, and live biometric face verification.",
    icon: Clock,
    color: "from-cyan-500/20 to-teal-500/20 text-cyan-400 border-cyan-500/30",
  },
  {
    id: "leave",
    label: "Leave",
    description:
      "Annual statutory leave quotas, negative balance prevention, carry-forward rules, and approval workflows.",
    icon: CalendarDays,
    color: "from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30",
  },
  {
    id: "payroll",
    label: "Payroll",
    description:
      "Indian statutory deductions (PF, ESI, Professional Tax, TDS), CTC components, and pay disbursement cadence.",
    icon: Banknote,
    color: "from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: "documents",
    label: "Documents",
    description:
      "Salary slips vs provision slips separation, mandatory onboarding documents, compliance rules & expiry alerts.",
    icon: FileText,
    color: "from-rose-500/20 to-pink-500/20 text-rose-400 border-rose-500/30",
  },
  {
    id: "assets",
    label: "Assets",
    description:
      "Company equipment inventory, hardware allocation acknowledgment, serial logs, and return protocols.",
    icon: Package,
    color: "from-blue-600/20 to-cyan-500/20 text-blue-300 border-blue-500/30",
  },
  {
    id: "notifications",
    label: "Notifications",
    description:
      "HR transactional email alerts (leave, attendance, payroll, docs) with live SMTP test email dispatch.",
    icon: Bell,
    color: "from-fuchsia-500/20 to-purple-500/20 text-fuchsia-400 border-fuchsia-500/30",
  },
];

interface SettingsLayoutProps {
  initialSection?: SettingsSectionKey | null;
  onSectionChange?: (section?: SettingsSectionKey | null) => void;
}

export function SettingsLayout({ initialSection, onSectionChange }: SettingsLayoutProps) {
  const ws = useAurix();
  const userRole: RbacRole = resolveRbacRole(ws.user?.role);

  const [activeSection, setActiveSection] = useState<SettingsSectionKey | null>(() => {
    if (initialSection && canAccessSection(userRole, initialSection)) {
      return initialSection;
    }
    return null;
  });

  // Unsaved changes state
  const [isCurrentFormDirty, setIsCurrentFormDirty] = useState(false);
  const [pendingSectionSwitch, setPendingSectionSwitch] = useState<SettingsSectionKey | null>(null);
  const [confirmSwitchOpen, setConfirmSwitchOpen] = useState(false);

  useEffect(() => {
    if (initialSection) {
      if (canAccessSection(userRole, initialSection)) {
        setActiveSection(initialSection);
      }
    } else {
      setActiveSection(null);
    }
  }, [initialSection, userRole]);

  const handleSelectSection = (key: SettingsSectionKey | null) => {
    if (key === activeSection) return;

    if (isCurrentFormDirty) {
      setPendingSectionSwitch(key);
      setConfirmSwitchOpen(true);
      return;
    }

    setActiveSection(key);
    setIsCurrentFormDirty(false);
    onSectionChange?.(key);
  };

  const handleConfirmSwitch = () => {
    setActiveSection(pendingSectionSwitch);
    setIsCurrentFormDirty(false);
    onSectionChange?.(pendingSectionSwitch);
    setPendingSectionSwitch(null);
    setConfirmSwitchOpen(false);
  };

  const currentCardMeta = activeSection
    ? SETTINGS_CARDS.find((c) => c.id === activeSection) || SETTINGS_CARDS[0]
    : null;
  const isAccessible = activeSection ? canAccessSection(userRole, activeSection) : true;
  const canEdit = activeSection ? canEditSection(userRole, activeSection) : false;

  return (
    <div className="space-y-6">
      {/* ── 1. SETTINGS HUB VIEW (WORKFORCE STYLE) ───────────────────── */}
      {!activeSection ? (
        <div className="space-y-6">

          {/* Grid of Module Cards (Workforce Style) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SETTINGS_CARDS.map((card) => {
              const Icon = card.icon;
              const accessible = canAccessSection(userRole, card.id);
              const editable = canEditSection(userRole, card.id);

              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSelectSection(card.id)}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-xl transition-all duration-200 hover:-translate-y-1 hover:border-foreground/30 hover:shadow-xl hover:bg-accent/40 text-left cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br border ${card.color} transition-transform duration-200 group-hover:scale-105`}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-display text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-primary">
                          {card.label}
                        </h3>
                        <div className="flex items-center gap-1.5">
                          {!accessible ? (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-normal border-destructive/30 text-destructive bg-destructive/5"
                            >
                              Restricted
                            </Badge>
                          ) : !editable ? (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-normal border-border text-muted-foreground bg-muted/40"
                            >
                              View Only
                            </Badge>
                          ) : null}
                        </div>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>


        </div>
      ) : (
        /* ── 2. ACTIVE SECTION VIEW ──────────────────────────────────── */
        <div className="space-y-6">
          {/* Active Section Content */}
          {!isAccessible ? (
            <AccessDeniedView
              title={`${currentCardMeta?.label} Settings Restricted`}
              message={`Your role (${userRole}) does not have permission to access ${currentCardMeta?.label} settings. Only authorized administrators may modify this module.`}
              currentRole={userRole}
            />
          ) : (
            <div>
              {activeSection === "company" && (
                <CompanySection canEdit={canEdit} onDirtyChange={setIsCurrentFormDirty} />
              )}
              {activeSection === "profile" && (
                <MyProfileSection canEdit={canEdit} onDirtyChange={setIsCurrentFormDirty} />
              )}
              {activeSection === "employees" && (
                <EmployeesSection canEdit={canEdit} onDirtyChange={setIsCurrentFormDirty} />
              )}
              {activeSection === "attendance" && (
                <AttendanceSection canEdit={canEdit} onDirtyChange={setIsCurrentFormDirty} />
              )}
              {activeSection === "leave" && (
                <LeaveSection canEdit={canEdit} onDirtyChange={setIsCurrentFormDirty} />
              )}
              {activeSection === "payroll" && (
                <PayrollSection canEdit={canEdit} onDirtyChange={setIsCurrentFormDirty} />
              )}
              {activeSection === "documents" && (
                <DocumentsSection canEdit={canEdit} onDirtyChange={setIsCurrentFormDirty} />
              )}
              {activeSection === "assets" && (
                <AssetsSection canEdit={canEdit} onDirtyChange={setIsCurrentFormDirty} />
              )}
              {activeSection === "notifications" && (
                <NotificationsSection canEdit={canEdit} onDirtyChange={setIsCurrentFormDirty} />
              )}
            </div>
          )}
        </div>
      )}

      {/* Unsaved Changes Confirmation Dialog */}
      <Dialog open={confirmSwitchOpen} onOpenChange={setConfirmSwitchOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2 text-amber-500">
              <AlertTriangle className="h-5 w-5" />
              <DialogTitle className="text-base font-semibold text-foreground">
                Unsaved Changes
              </DialogTitle>
            </div>
            <DialogDescription className="text-xs text-muted-foreground pt-2">
              You have unsaved changes in the current section. Leaving now will discard your
              modifications. Do you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setConfirmSwitchOpen(false);
                setPendingSectionSwitch(null);
              }}
            >
              Stay on Page
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={handleConfirmSwitch}>
              Discard & Switch
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
