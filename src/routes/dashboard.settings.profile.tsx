import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useRef, useState } from "react";
import {
  AlertCircle,
  Camera,
  Check,
  Globe,
  KeyRound,
  Laptop,
  Moon,
  RefreshCw,
  Save,
  Shield,
  Smartphone,
  Sun,
  Trash2,
  User,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  selectCurrentUser,
  selectProfileErrors,
  selectProfileLoading,
  selectProfileOperationLoading,
  selectProfileSubmitting,
  selectUserPreferences,
  selectUserSessions,
} from "@/store/profile/profileSelectors";
import {
  changeCurrentUserPassword,
  deleteProfileAvatar,
  fetchCurrentUser,
  fetchUserPreferences,
  fetchUserSessions,
  revokeUserSession,
  updateCurrentUser,
  updateUserPreferences,
  uploadProfileAvatar,
} from "@/store/profile/profileThunk";

export const Route = createFileRoute("/dashboard/settings/profile")({
  head: () => ({ meta: [{ title: "User Profile — OFC360" }] }),
  component: UserProfilePage,
});

function UserProfilePage() {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const sessions = useAppSelector(selectUserSessions);
  const preferences = useAppSelector(selectUserPreferences);
  const loading = useAppSelector(selectProfileLoading);
  const submitting = useAppSelector(selectProfileSubmitting);
  const errors = useAppSelector(selectProfileErrors);
  const opLoading = useAppSelector(selectProfileOperationLoading);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Profile details form state
  const [profileForm, setProfileForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    designation: "",
    department: "",
    bio: "",
  });

  // Password change form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Preferences form state
  const [prefForm, setPrefForm] = useState({
    theme: "system" as "light" | "dark" | "system",
    emailNotifications: true,
    pushNotifications: true,
    soundEnabled: true,
    language: "en",
    timezone: "UTC+05:30 (IST)",
    dateFormat: "DD/MM/YYYY",
  });

  // Fetch initial profile, sessions, and preferences
  useEffect(() => {
    dispatch(fetchCurrentUser());
    dispatch(fetchUserSessions());
    dispatch(fetchUserPreferences());
  }, [dispatch]);

  // Sync profile data to form
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        fullName: currentUser.fullName || currentUser.name || "",
        email: currentUser.email || "",
        phone: currentUser.phone || "",
        designation: currentUser.designation || "",
        department: currentUser.department || "",
        bio: currentUser.bio || "",
      });
    }
  }, [currentUser]);

  // Sync preferences data to form
  useEffect(() => {
    if (preferences) {
      setPrefForm({
        theme: preferences.theme || "system",
        emailNotifications: preferences.emailNotifications ?? true,
        pushNotifications: preferences.pushNotifications ?? true,
        soundEnabled: preferences.soundEnabled ?? true,
        language: preferences.language || "en",
        timezone: preferences.timezone || "UTC+05:30 (IST)",
        dateFormat: preferences.dateFormat || "DD/MM/YYYY",
      });
    }
  }, [preferences]);

  // ── Profile Submit ───────────────────────────────────────────
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileForm.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }
    try {
      await dispatch(updateCurrentUser(profileForm)).unwrap();
      toast.success("Profile updated successfully!");
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to update profile");
    }
  };

  // ── Avatar Upload & Delete ───────────────────────────────────
  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    try {
      await dispatch(uploadProfileAvatar(file)).unwrap();
      toast.success("Avatar image uploaded successfully!");
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to upload avatar");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAvatarDelete = async () => {
    try {
      await dispatch(deleteProfileAvatar()).unwrap();
      toast.success("Profile avatar removed");
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to remove avatar");
    }
  };

  // ── Password Change ──────────────────────────────────────────
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (!passwordForm.currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      const res = await dispatch(
        changeCurrentUserPassword({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword,
        }),
      ).unwrap();
      toast.success(res.message || "Password updated successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      const errorMsg = typeof err === "string" ? err : "Failed to change password";
      setPasswordError(errorMsg);
      toast.error(errorMsg);
    }
  };

  // ── Revoke Session ───────────────────────────────────────────
  const handleRevokeSession = async (sessionId: string) => {
    try {
      await dispatch(revokeUserSession(sessionId)).unwrap();
      toast.success("Session revoked successfully");
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to revoke session");
    }
  };

  // ── Preferences Submit ───────────────────────────────────────
  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(updateUserPreferences(prefForm)).unwrap();
      toast.success("Preferences saved successfully!");
    } catch (err: unknown) {
      toast.error(typeof err === "string" ? err : "Failed to save preferences");
    }
  };

  // ── Retry handler for main load ──────────────────────────────
  const handleRetryLoad = () => {
    dispatch(fetchCurrentUser());
    dispatch(fetchUserSessions());
    dispatch(fetchUserPreferences());
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (loading && !currentUser) {
    return (
      <div className="space-y-6">
        <div className="space-y-4 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl">
          <Skeleton className="h-7 w-56" />
          <Skeleton className="h-4 w-72" />
          <div className="flex items-center gap-4 pt-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 pt-4 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl">
        <div>
          <h1 className="font-display text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            User Profile & Preferences
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Manage your personal identity, contact details, authentication security, active
            sessions, and workspace preferences.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {errors.currentUser && (
            <Button size="sm" variant="outline" onClick={handleRetryLoad}>
              <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry
            </Button>
          )}
          <Badge variant="secondary" className="px-3 py-1 text-xs">
            <User className="mr-1.5 h-3.5 w-3.5 text-primary" />
            {currentUser?.role ? `${currentUser.role.toUpperCase()} Account` : "Profile Active"}
          </Badge>
        </div>
      </div>

      {/* Global error banner if profile load failed */}
      {errors.currentUser && (
        <div className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errors.currentUser}</span>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs border-destructive/30"
            onClick={handleRetryLoad}
          >
            Retry Load
          </Button>
        </div>
      )}

      {/* Profile & Avatar Section */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Avatar className="h-20 w-20 border-2 border-border/80 shadow-md">
                <AvatarImage
                  src={currentUser?.avatarUrl}
                  alt={currentUser?.fullName || "User Avatar"}
                />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-lg font-bold text-primary">
                  {getInitials(currentUser?.fullName || currentUser?.name)}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={opLoading.avatar}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed"
                title="Change Avatar"
              >
                {opLoading.avatar ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileSelect}
              />
            </div>

            <div>
              <h2 className="text-base font-semibold text-foreground">
                {currentUser?.fullName || currentUser?.name || "Your Name"}
              </h2>
              <p className="text-xs text-muted-foreground">
                {currentUser?.email || "user@ofc360.ai"}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={opLoading.avatar}
                >
                  <Camera className="mr-1.5 h-3 w-3" />
                  {opLoading.avatar ? "Uploading..." : "Upload Photo"}
                </Button>
                {currentUser?.avatarUrl && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-destructive hover:bg-destructive/10"
                    onClick={handleAvatarDelete}
                    disabled={opLoading.avatar}
                  >
                    <Trash2 className="mr-1.5 h-3 w-3" /> Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-muted-foreground">User ID:</span>
            <div className="font-mono text-xs font-semibold text-foreground">
              {currentUser?.id || "USR-AUTO"}
            </div>
          </div>
        </div>

        {/* Profile Information Form */}
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Full Name *</Label>
              <Input
                value={profileForm.fullName}
                onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                placeholder="Aarav Sharma"
                disabled={submitting || opLoading.updateUser}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Email Address</Label>
              <Input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                placeholder="aarav@ofc360.ai"
                disabled={submitting || opLoading.updateUser}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Phone Number</Label>
              <Input
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="+91 98765 01234"
                disabled={submitting || opLoading.updateUser}
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Designation / Role Title</Label>
              <Input
                value={profileForm.designation}
                onChange={(e) => setProfileForm({ ...profileForm, designation: e.target.value })}
                placeholder="Head of Operations"
                disabled={submitting || opLoading.updateUser}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium">Department</Label>
              <Input
                value={profileForm.department}
                onChange={(e) => setProfileForm({ ...profileForm, department: e.target.value })}
                placeholder="Executive & Strategy"
                disabled={submitting || opLoading.updateUser}
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs font-medium">Professional Bio</Label>
              <Textarea
                rows={3}
                value={profileForm.bio}
                onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                placeholder="Brief professional background, role responsibilities, and team notes..."
                disabled={submitting || opLoading.updateUser}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={submitting || opLoading.updateUser}>
              {submitting || opLoading.updateUser ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>

      {/* Password Security Card */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Change Password
            </h2>
            <p className="text-xs text-muted-foreground">
              Update your account password. Strong passwords contain at least 8 characters with
              letters, numbers, and symbols.
            </p>
          </div>
          <KeyRound className="h-5 w-5 text-muted-foreground" />
        </div>

        {passwordError && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Current Password</Label>
              <Input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                }
                placeholder="••••••••"
                disabled={opLoading.password}
                autoComplete="current-password"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">New Password</Label>
              <Input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="••••••••"
                disabled={opLoading.password}
                autoComplete="new-password"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Confirm New Password</Label>
              <Input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                placeholder="••••••••"
                disabled={opLoading.password}
                autoComplete="new-password"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="outline" disabled={opLoading.password}>
              {opLoading.password ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <KeyRound className="mr-2 h-4 w-4" />
              )}
              Update Password
            </Button>
          </div>
        </form>
      </div>

      {/* User Preferences Card */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              User Preferences
            </h2>
            <p className="text-xs text-muted-foreground">
              Configure your personal theme, notification preferences, language, and regional
              formats.
            </p>
          </div>
          <Globe className="h-5 w-5 text-muted-foreground" />
        </div>

        <form onSubmit={handlePreferencesSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Interface Theme</Label>
              <Select
                value={prefForm.theme}
                onValueChange={(val: "light" | "dark" | "system") =>
                  setPrefForm({ ...prefForm, theme: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System Default</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                  <SelectItem value="light">Light Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Display Language</Label>
              <Select
                value={prefForm.language}
                onValueChange={(val) => setPrefForm({ ...prefForm, language: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (US)</SelectItem>
                  <SelectItem value="en-gb">English (UK)</SelectItem>
                  <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                  <SelectItem value="es">Spanish (Español)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Timezone</Label>
              <Select
                value={prefForm.timezone}
                onValueChange={(val) => setPrefForm({ ...prefForm, timezone: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UTC+05:30 (IST)">UTC+05:30 (IST - India)</SelectItem>
                  <SelectItem value="UTC+00:00 (GMT)">UTC+00:00 (GMT - London)</SelectItem>
                  <SelectItem value="UTC-05:00 (EST)">UTC-05:00 (EST - New York)</SelectItem>
                  <SelectItem value="UTC-08:00 (PST)">UTC-08:00 (PST - San Francisco)</SelectItem>
                  <SelectItem value="UTC+08:00 (SGT)">UTC+08:00 (SGT - Singapore)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3 divide-y divide-border/60 pt-2">
            <div className="flex items-center justify-between pt-2">
              <div>
                <div className="text-sm font-medium">Email Notifications</div>
                <div className="text-xs text-muted-foreground">
                  Receive daily digests and critical workspace notices.
                </div>
              </div>
              <Switch
                checked={prefForm.emailNotifications}
                onCheckedChange={(val) => setPrefForm({ ...prefForm, emailNotifications: val })}
                disabled={opLoading.updatePreferences}
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <div className="text-sm font-medium">Push & In-App Notifications</div>
                <div className="text-xs text-muted-foreground">
                  Real-time alerts for approvals, chats, and assignments.
                </div>
              </div>
              <Switch
                checked={prefForm.pushNotifications}
                onCheckedChange={(val) => setPrefForm({ ...prefForm, pushNotifications: val })}
                disabled={opLoading.updatePreferences}
              />
            </div>

            <div className="flex items-center justify-between pt-3">
              <div>
                <div className="text-sm font-medium">Sound Effects & Chimes</div>
                <div className="text-xs text-muted-foreground">
                  Play subtle chime sounds on receiving notifications.
                </div>
              </div>
              <Switch
                checked={prefForm.soundEnabled}
                onCheckedChange={(val) => setPrefForm({ ...prefForm, soundEnabled: val })}
                disabled={opLoading.updatePreferences}
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={opLoading.updatePreferences}>
              {opLoading.updatePreferences ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              Save Preferences
            </Button>
          </div>
        </form>
      </div>

      {/* Active Sessions Card */}
      <div className="rounded-2xl border border-border/60 bg-card/60 p-6 backdrop-blur-xl space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Active Sessions
            </h2>
            <p className="text-xs text-muted-foreground">
              Devices currently signed in to your account. Revoke any unrecognized sessions
              immediately.
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => dispatch(fetchUserSessions())}
            disabled={opLoading.sessions}
            title="Refresh active sessions"
          >
            <RefreshCw className={`h-4 w-4 ${opLoading.sessions ? "animate-spin" : ""}`} />
          </Button>
        </div>

        {sessions.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            <Shield className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50 stroke-1" />
            No additional active sessions detected.
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((sess) => {
              const isMobile =
                sess.device.toLowerCase().includes("mobile") ||
                sess.device.toLowerCase().includes("iphone") ||
                sess.device.toLowerCase().includes("android");
              const Icon = isMobile ? Smartphone : Laptop;

              return (
                <div
                  key={sess.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 p-4 transition-colors hover:bg-accent/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-accent text-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-foreground">{sess.device}</span>
                        {sess.current && (
                          <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/20 text-[10px]">
                            Current Session
                          </Badge>
                        )}
                      </div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        {sess.ip} {sess.location ? `· ${sess.location}` : ""} · Last active:{" "}
                        {sess.lastActive}
                      </div>
                    </div>
                  </div>

                  {!sess.current && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs text-destructive hover:bg-destructive/10"
                      onClick={() => handleRevokeSession(sess.id)}
                      disabled={opLoading.revokeSession}
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Revoke
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
