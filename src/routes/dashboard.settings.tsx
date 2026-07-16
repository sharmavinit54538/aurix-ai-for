import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Building2, LogOut, Save, Shield, User, UserCheck, AlertCircle, Landmark, Lock, Bell, Languages, ShieldCheck
} from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { aurix, useAurix } from "@/lib/aurix-store";
import { toast } from "sonner";
import { api } from "@/api";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — Aurix" }] }),
  component: SettingsPage,
});

const SETTINGS_STORAGE_KEY = "aurix.employee.settings.v1";

interface EmployeeSettings {
  gender: string;
  dob: string;
  bloodGroup: string;
  maritalStatus: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  
  primaryContactName: string;
  primaryContactRelation: string;
  primaryContactPhone: string;
  primaryContactEmail: string;
  
  secondaryContactName: string;
  secondaryContactRelation: string;
  secondaryContactPhone: string;
  secondaryContactEmail: string;
  
  bankName: string;
  bankAccountHolder: string;
  bankAccountNumber: string;
  bankIfsc: string;
  bankBranch: string;
  
  emailNotifications: boolean;
  systemNotifications: boolean;
  slaAlerts: boolean;
  weeklySummary: boolean;
  
  language: string;
  timezone: string;
  
  profileVisible: boolean;
  showActivityStatus: boolean;
  shareAchievements: boolean;
}

const defaultEmployeeSettings: EmployeeSettings = {
  gender: "prefer_not_to_say",
  dob: "1995-08-15",
  bloodGroup: "O+",
  maritalStatus: "single",
  address: "123 Main Street",
  city: "San Francisco",
  state: "CA",
  country: "United States",
  zip: "94105",
  
  primaryContactName: "Jane Doe",
  primaryContactRelation: "Spouse",
  primaryContactPhone: "+1 (555) 019-2834",
  primaryContactEmail: "jane.doe@example.com",
  
  secondaryContactName: "John Smith",
  secondaryContactRelation: "Father",
  secondaryContactPhone: "+1 (555) 019-5821",
  secondaryContactEmail: "john.smith@example.com",
  
  bankName: "Chase Bank",
  bankAccountHolder: "Neil Karen",
  bankAccountNumber: "************4821",
  bankIfsc: "CHASUS33",
  bankBranch: "Market St SF",
  
  emailNotifications: true,
  systemNotifications: true,
  slaAlerts: false,
  weeklySummary: true,
  
  language: "en",
  timezone: "PST",
  
  profileVisible: true,
  showActivityStatus: true,
  shareAchievements: true,
};

function SettingsPage() {
  const ws = useAurix();
  const navigate = useNavigate();
  const role = (ws.user?.role ?? "admin") as string;
  
  const initialTab = useMemo(() => (role === "employee" ? "profile" : "company"), [role]);
  const [tab, setTab] = useState<string>("");

  useEffect(() => {
    if (!tab) {
      setTab(initialTab);
    }
  }, [initialTab, tab]);

  const [company, setCompany] = useState(ws.company ?? { id: "", name: "" });
  const [user, setUser] = useState(ws.user);

  const [tempEmpSettings, setTempEmpSettings] = useState<EmployeeSettings>(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (raw) {
        try {
          return { ...defaultEmployeeSettings, ...JSON.parse(raw) };
        } catch {}
      }
    }
    return defaultEmployeeSettings;
  });

  function saveCompany() { aurix.set({ company }); toast.success("Company updated"); }
  function saveProfile() { if (user) { aurix.set({ user }); toast.success("Profile updated"); } }
  function reset() { aurix.reset(); navigate({ to: "/login" }); }

  function saveAllEmpSettings() {
    if (typeof window !== "undefined") {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(tempEmpSettings));
    }
    toast.success("Settings saved successfully");
  }

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }
    setUpdatingPassword(true);
    try {
      await api.patch<any>("auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      });
      toast.success("Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg = err.message || "Failed to update password.";
      toast.error(msg);
    } finally {
      setUpdatingPassword(false);
    }
  };

  const tabs = useMemo(() => {
    if (role === "employee") {
      return [
        { id: "profile", label: "My Profile", icon: UserCheck },
        { id: "personal", label: "Personal Information", icon: User },
        { id: "emergency", label: "Emergency Contacts", icon: AlertCircle },
        { id: "bank", label: "Bank Details", icon: Landmark },
        { id: "security", label: "Password & Security", icon: Lock },
        { id: "notifications", label: "Notification Settings", icon: Bell },
        { id: "privacy", label: "Privacy Settings", icon: ShieldCheck },
      ] as const;
    }
    return [
      { id: "company", label: "Company", icon: Building2 },
      { id: "profile", label: "Profile", icon: User },
      { id: "security", label: "Security", icon: Shield },
    ] as const;
  }, [role]);

  return (
    <>
      <PageHeader title="Settings" description="Manage your workspace, profile, and access preferences." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr]">
        <aside className="space-y-1">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"}`}>
                <Icon className="h-4 w-4" />{t.label}
              </button>
            );
          })}
        </aside>

        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
          {tab === "company" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <F label="Company name"><Input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} /></F>
              <F label="Email"><Input value={company.email ?? ""} onChange={(e) => setCompany({ ...company, email: e.target.value })} /></F>
              <F label="Phone"><Input value={company.phone ?? ""} onChange={(e) => setCompany({ ...company, phone: e.target.value })} /></F>
              <F label="Website"><Input value={company.website ?? ""} onChange={(e) => setCompany({ ...company, website: e.target.value })} /></F>
              <F label="City"><Input value={company.city ?? ""} onChange={(e) => setCompany({ ...company, city: e.target.value })} /></F>
              <F label="Country"><Input value={company.country ?? ""} onChange={(e) => setCompany({ ...company, country: e.target.value })} /></F>
              <div className="sm:col-span-2 flex justify-end"><Button onClick={saveCompany}><Save className="mr-2 h-4 w-4" />Save changes</Button></div>
            </div>
          ) : null}

          {tab === "profile" && user ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4 border-b border-border pb-6">
                <div className="grid h-16 w-16 place-items-center rounded-full bg-foreground text-xl font-bold text-background">
                  {user.fullName?.split(" ").map((p) => p[0]).slice(0, 2).join("") || "A"}
                </div>
                <div>
                  <h3 className="text-base font-semibold">{user.fullName}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{user.role} · Aurix Member</p>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <F label="Full Name"><Input value={user.fullName} onChange={(e) => setUser({ ...user, fullName: e.target.value })} /></F>
                <F label="Email"><Input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} /></F>
                <F label="Phone"><Input value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} /></F>
                <F label="Role"><Input value={user.role} disabled /></F>
                <div className="sm:col-span-2 flex justify-end"><Button onClick={saveProfile}><Save className="mr-2 h-4 w-4" />Save profile</Button></div>
              </div>
            </div>
          ) : null}

          {tab === "personal" ? (
            <div className="space-y-6">
              <h3 className="text-base font-semibold border-b border-border pb-3">Personal Details</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <F label="Gender">
                  <select value={tempEmpSettings.gender} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, gender: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </F>
                <F label="Date of Birth"><Input type="date" value={tempEmpSettings.dob} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, dob: e.target.value })} /></F>
                <F label="Blood Group">
                  <select value={tempEmpSettings.bloodGroup} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, bloodGroup: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </F>
                <F label="Marital Status">
                  <select value={tempEmpSettings.maritalStatus} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, maritalStatus: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                  </select>
                </F>
                <div className="sm:col-span-2">
                  <F label="Address"><Input value={tempEmpSettings.address} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, address: e.target.value })} /></F>
                </div>
                <F label="City"><Input value={tempEmpSettings.city} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, city: e.target.value })} /></F>
                <F label="State"><Input value={tempEmpSettings.state} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, state: e.target.value })} /></F>
                <F label="Country"><Input value={tempEmpSettings.country} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, country: e.target.value })} /></F>
                <F label="ZIP Code"><Input value={tempEmpSettings.zip} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, zip: e.target.value })} /></F>
                <div className="sm:col-span-2 flex justify-end">
                  <Button onClick={saveAllEmpSettings}>
                    <Save className="mr-2 h-4 w-4" />Save changes
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {tab === "emergency" ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold border-b border-border pb-3">Primary Contact</h3>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <F label="Contact Name"><Input value={tempEmpSettings.primaryContactName} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, primaryContactName: e.target.value })} /></F>
                  <F label="Relationship"><Input value={tempEmpSettings.primaryContactRelation} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, primaryContactRelation: e.target.value })} /></F>
                  <F label="Phone Number"><Input value={tempEmpSettings.primaryContactPhone} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, primaryContactPhone: e.target.value })} /></F>
                  <F label="Email Address"><Input value={tempEmpSettings.primaryContactEmail} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, primaryContactEmail: e.target.value })} /></F>
                </div>
              </div>
              <div className="pt-4 border-t border-border mt-4">
                <h3 className="text-base font-semibold border-b border-border pb-3">Secondary Contact</h3>
                <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <F label="Contact Name"><Input value={tempEmpSettings.secondaryContactName} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, secondaryContactName: e.target.value })} /></F>
                  <F label="Relationship"><Input value={tempEmpSettings.secondaryContactRelation} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, secondaryContactRelation: e.target.value })} /></F>
                  <F label="Phone Number"><Input value={tempEmpSettings.secondaryContactPhone} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, secondaryContactPhone: e.target.value })} /></F>
                  <F label="Email Address"><Input value={tempEmpSettings.secondaryContactEmail} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, secondaryContactEmail: e.target.value })} /></F>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button onClick={saveAllEmpSettings}>
                  <Save className="mr-2 h-4 w-4" />Save changes
                </Button>
              </div>
            </div>
          ) : null}

          {tab === "bank" ? (
            <div className="space-y-6">
              <h3 className="text-base font-semibold border-b border-border pb-3">Salary Deposit Bank Details</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <F label="Bank Name"><Input value={tempEmpSettings.bankName} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, bankName: e.target.value })} /></F>
                <F label="Account Holder Name"><Input value={tempEmpSettings.bankAccountHolder} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, bankAccountHolder: e.target.value })} /></F>
                <F label="Account Number"><Input value={tempEmpSettings.bankAccountNumber} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, bankAccountNumber: e.target.value })} /></F>
                <F label="IFSC Code / Routing Code"><Input value={tempEmpSettings.bankIfsc} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, bankIfsc: e.target.value })} /></F>
                <div className="sm:col-span-2">
                  <F label="Branch Name"><Input value={tempEmpSettings.bankBranch} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, bankBranch: e.target.value })} /></F>
                </div>
                <div className="sm:col-span-2 flex justify-end">
                  <Button onClick={saveAllEmpSettings}>
                    <Save className="mr-2 h-4 w-4" />Save changes
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {tab === "security" ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-xs text-muted-foreground">Use a strong unique password to keep your workspace secure.</p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Input
                    type="password"
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={updatingPassword}
                  />
                  <Input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={updatingPassword}
                  />
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={updatingPassword}
                  />
                </div>
                <Button
                  className="mt-3"
                  onClick={handleUpdatePassword}
                  disabled={updatingPassword}
                >
                  {updatingPassword ? "Updating..." : "Update password"}
                </Button>
              </div>
              <div className="border-t border-border pt-6">
                <h3 className="font-medium text-destructive">Danger zone</h3>
                <p className="text-xs text-muted-foreground">Sign out of this workspace and clear local session data.</p>
                <Button variant="destructive" className="mt-3" onClick={reset}><LogOut className="mr-2 h-4 w-4" />Sign out and reset workspace</Button>
              </div>
            </div>
          ) : null}

          {tab === "notifications" ? (
            <div className="space-y-6">
              <h3 className="text-base font-semibold border-b border-border pb-3">Notification Preferences</h3>
              <div className="space-y-4">
                <label className="flex items-start gap-3 rounded-lg border border-border bg-card/40 p-3 text-sm cursor-pointer">
                  <input type="checkbox" checked={tempEmpSettings.emailNotifications} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, emailNotifications: e.target.checked })} className="mt-1" />
                  <div>
                    <div className="font-medium">Email Notifications</div>
                    <div className="text-xs text-muted-foreground">Receive approval updates, leave status changes, and payslip issues via email.</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 rounded-lg border border-border bg-card/40 p-3 text-sm cursor-pointer">
                  <input type="checkbox" checked={tempEmpSettings.systemNotifications} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, systemNotifications: e.target.checked })} className="mt-1" />
                  <div>
                    <div className="font-medium">System Banner Notifications</div>
                    <div className="text-xs text-muted-foreground">Get instant alerts and banner popups inside the Aurix portal dashboard.</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 rounded-lg border border-border bg-card/40 p-3 text-sm cursor-pointer">
                  <input type="checkbox" checked={tempEmpSettings.slaAlerts} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, slaAlerts: e.target.checked })} className="mt-1" />
                  <div>
                    <div className="font-medium">SLA and Escalation Alerts</div>
                    <div className="text-xs text-muted-foreground">Receive warnings for pending task deadlines or review delays.</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 rounded-lg border border-border bg-card/40 p-3 text-sm cursor-pointer">
                  <input type="checkbox" checked={tempEmpSettings.weeklySummary} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, weeklySummary: e.target.checked })} className="mt-1" />
                  <div>
                    <div className="font-medium">Weekly Insights Summary</div>
                    <div className="text-xs text-muted-foreground">Get a summary email of your working hours, timesheets, and achievements every Friday.</div>
                  </div>
                </label>
                <div className="flex justify-end">
                  <Button onClick={saveAllEmpSettings}>
                    <Save className="mr-2 h-4 w-4" />Save changes
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {tab === "privacy" ? (
            <div className="space-y-6">
              <h3 className="text-base font-semibold border-b border-border pb-3">Privacy Preferences</h3>
              <div className="space-y-4">
                <label className="flex items-start gap-3 rounded-lg border border-border bg-card/40 p-3 text-sm cursor-pointer">
                  <input type="checkbox" checked={tempEmpSettings.profileVisible} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, profileVisible: e.target.checked })} className="mt-1" />
                  <div>
                    <div className="font-medium">Profile Visibility</div>
                    <div className="text-xs text-muted-foreground">Allow colleagues in the workspace directories to view my profile details and role info.</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 rounded-lg border border-border bg-card/40 p-3 text-sm cursor-pointer">
                  <input type="checkbox" checked={tempEmpSettings.showActivityStatus} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, showActivityStatus: e.target.checked })} className="mt-1" />
                  <div>
                    <div className="font-medium">Show Active Status</div>
                    <div className="text-xs text-muted-foreground">Show online/offline indicator based on portal activity.</div>
                  </div>
                </label>
                <label className="flex items-start gap-3 rounded-lg border border-border bg-card/40 p-3 text-sm cursor-pointer">
                  <input type="checkbox" checked={tempEmpSettings.shareAchievements} onChange={(e) => setTempEmpSettings({ ...tempEmpSettings, shareAchievements: e.target.checked })} className="mt-1" />
                  <div>
                    <div className="font-medium">Share Milestones and Achievements</div>
                    <div className="text-xs text-muted-foreground">Automatically post performance awards and work anniversaries to the notice board.</div>
                  </div>
                </label>
                <div className="flex justify-end">
                  <Button onClick={saveAllEmpSettings}>
                    <Save className="mr-2 h-4 w-4" />Save changes
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

function F({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1.5"><Label className="text-xs">{label}</Label>{children}</div>;
}
