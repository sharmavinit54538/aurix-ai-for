import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RefreshCw, Save, User } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectProfileSettings, selectSettingsLoading, selectSettingsSubmitting } from "@/store/settings/settingsSelectors";
import { fetchProfileSettings, updateProfileSettings } from "@/store/settings/settingsThunk";

export const Route = createFileRoute("/dashboard/settings/profile")({
  head: () => ({ meta: [{ title: "User Profile — Aurix" }] }),
  component: ProfileSettingsPage,
});

function ProfileSettingsPage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfileSettings);
  const loading = useAppSelector(selectSettingsLoading);
  const submitting = useAppSelector(selectSettingsSubmitting);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    bio: "",
  });

  useEffect(() => {
    dispatch(fetchProfileSettings());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        designation: profile.designation || "",
        department: profile.department || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateProfileSettings(form)).unwrap();
      toast.success("User profile saved successfully!");
    } catch {
      toast.error("Failed to update user profile");
    }
  };

  if (loading && !profile) {
    return (
      <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Personal Profile Settings</h2>
          <p className="text-xs text-muted-foreground">Update your personal account information, professional title, and bio.</p>
        </div>
        <User className="h-5 w-5 text-muted-foreground" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Full Name</Label>
            <Input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              placeholder="Aarav Sharma"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Email Address</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="aarav@aurix.ai"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Phone Number</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91 98765 01234"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Designation / Title</Label>
            <Input
              value={form.designation}
              onChange={(e) => setForm({ ...form, designation: e.target.value })}
              placeholder="HR Lead / Administrator"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-medium">Department</Label>
            <Input
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              placeholder="Human Resources"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-medium">Bio / About</Label>
            <Textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Brief professional summary..."
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={submitting}>
            {submitting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
