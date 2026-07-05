import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, LogOut, Save, Shield, User } from "lucide-react";
import { PageHeader } from "@/components/aurix/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { aurix, useAurix } from "@/lib/aurix-store";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({ meta: [{ title: "Settings — Aurix" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  const ws = useAurix();
  const navigate = useNavigate();
  const [tab, setTab] = useState<"company" | "profile" | "security">("company");
  const [company, setCompany] = useState(ws.company ?? { id: "", name: "" });
  const [user, setUser] = useState(ws.user);

  function saveCompany() { aurix.set({ company }); toast.success("Company updated"); }
  function saveProfile() { if (user) { aurix.set({ user }); toast.success("Profile updated"); } }
  function reset() { aurix.reset(); navigate({ to: "/login" }); }

  const tabs = [
    { id: "company", label: "Company", icon: Building2 },
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ] as const;

  return (
    <>
      <PageHeader title="Settings" description="Manage your workspace, profile, and access." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr]">
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <F label="Full name"><Input value={user.fullName} onChange={(e) => setUser({ ...user, fullName: e.target.value })} /></F>
              <F label="Email"><Input value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} /></F>
              <F label="Phone"><Input value={user.phone} onChange={(e) => setUser({ ...user, phone: e.target.value })} /></F>
              <F label="Role"><Input value={user.role} disabled /></F>
              <div className="sm:col-span-2 flex justify-end"><Button onClick={saveProfile}><Save className="mr-2 h-4 w-4" />Save profile</Button></div>
            </div>
          ) : null}

          {tab === "security" ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-medium">Password</h3>
                <p className="text-xs text-muted-foreground">Use a strong unique password to keep your workspace secure.</p>
                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <Input type="password" placeholder="Current password" />
                  <Input type="password" placeholder="New password" />
                  <Input type="password" placeholder="Confirm new password" />
                </div>
                <Button className="mt-3" onClick={() => toast.success("Password updated")}>Update password</Button>
              </div>
              <div className="border-t border-border pt-6">
                <h3 className="font-medium text-destructive">Danger zone</h3>
                <p className="text-xs text-muted-foreground">Sign out of this workspace and clear local session data.</p>
                <Button variant="destructive" className="mt-3" onClick={reset}><LogOut className="mr-2 h-4 w-4" />Sign out and reset workspace</Button>
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
