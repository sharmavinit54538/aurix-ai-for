import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  User,
  Mail,
  Phone,
  Lock,
  Camera,
  Save,
  RotateCcw,
  ShieldCheck,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchMyProfile, updateMyProfile, uploadProfileAvatar, changeMyPassword } from "../../api";
import type { MyProfileForm } from "../../types";
import { UnsavedChangesBanner } from "../UnsavedChangesBanner";

interface MyProfileSectionProps {
  canEdit: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

function calculatePasswordStrength(pass: string): { score: number; label: string; color: string } {
  if (!pass) return { score: 0, label: "None", color: "bg-muted" };
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[a-z]/.test(pass)) score++;
  if (/[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  if (score <= 2) return { score, label: "Weak", color: "bg-destructive" };
  if (score === 3 || score === 4) return { score, label: "Moderate", color: "bg-amber-500" };
  return { score: 5, label: "Strong", color: "bg-emerald-500" };
}

export function MyProfileSection({ canEdit = true, onDirtyChange }: MyProfileSectionProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialData, setInitialData] = useState<MyProfileForm | null>(null);
  const [formData, setFormData] = useState<MyProfileForm>({
    name: "",
    email: "",
    phone: "",
    avatarUrl: "",
    designation: "",
    department: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Password Change State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordErrors, setPasswordErrors] = useState<Record<string, string>>({});
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isDirty = initialData
    ? formData.name !== initialData.name ||
      formData.email !== initialData.email ||
      formData.phone !== initialData.phone
    : false;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMyProfile();
      setInitialData(data);
      setFormData(data);
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to load profile details.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const validateProfile = (): boolean => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "Full name is required";
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = "Enter a valid email address";
    }
    if (formData.phone && !/^\+?[0-9\s-]{7,15}$/.test(formData.phone)) {
      errs.phone = "Enter a valid phone number (7-15 digits)";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProfileSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateProfile()) {
      toast.error("Please resolve validation errors before saving.");
      return;
    }

    setSubmitting(true);
    try {
      const updated = await updateMyProfile(formData);
      setInitialData(updated);
      setFormData(updated);
      toast.success("Profile information updated successfully!");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to update profile.";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarUpload = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      toast.error("Avatar image must be under 3MB.");
      return;
    }

    setAvatarUploading(true);
    try {
      const url = await uploadProfileAvatar(file);
      setFormData((prev) => ({ ...prev, avatarUrl: url }));
      if (initialData) {
        setInitialData((prev) => (prev ? { ...prev, avatarUrl: url } : null));
      }
      toast.success("Profile picture updated!");
    } catch (err: unknown) {
      const msg = (err as { message?: string })?.message || "Failed to upload avatar photo.";
      toast.error(msg);
    } finally {
      setAvatarUploading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!passwordData.newPassword) {
      errs.newPassword = "New password is required";
    } else if (passwordData.newPassword.length < 8) {
      errs.newPassword = "Password must be at least 8 characters long";
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    setPasswordErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setChangingPassword(true);
    try {
      const res = await changeMyPassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      });
      toast.success(res.message || "Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message ||
        "Failed to change password. Please verify current password.";
      toast.error(msg);
    } finally {
      setChangingPassword(false);
    }
  };

  const strength = calculatePasswordStrength(passwordData.newPassword);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  const initials = formData.name
    ? formData.name
        .split(" ")
        .filter(Boolean)
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="space-y-6">
      {/* Profile Info Form */}
      <form onSubmit={handleProfileSave} className="space-y-6">
        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
          <div className="mb-5 flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                Personal Information
              </h3>
              <p className="text-xs text-muted-foreground">
                Manage your identity coordinates and avatar.
              </p>
            </div>
            <User className="h-4 w-4 text-primary shrink-0" />
          </div>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            {/* Avatar block */}
            <div className="flex flex-col items-center gap-2 sm:items-start">
              <Label className="text-xs font-medium text-foreground">Profile Picture</Label>
              <div className="relative">
                <Avatar className="h-24 w-24 border-2 border-border shadow-md">
                  <AvatarImage
                    src={formData.avatarUrl}
                    alt={formData.name}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                {avatarUploading && (
                  <div className="absolute inset-0 grid place-items-center rounded-full bg-background/80 text-[10px] font-semibold text-primary">
                    Uploading...
                  </div>
                )}
              </div>

              {canEdit && (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleAvatarUpload(e.target.files?.[0] || null)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarUploading}
                    className="mt-1 h-8 gap-1.5 text-xs cursor-pointer"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    Change Photo
                  </Button>
                  <p className="text-[10px] text-muted-foreground">PNG, JPG, or WebP under 3MB</p>
                </>
              )}
            </div>

            {/* Profile fields */}
            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="profile-name" className="text-xs font-medium">
                  Full Name *
                </Label>
                <Input
                  id="profile-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!canEdit}
                  placeholder="Your Full Name"
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && <p className="text-[11px] text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-email" className="text-xs font-medium">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="profile-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!canEdit}
                    placeholder="you@company.com"
                    className={`pl-9 ${errors.email ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.email && <p className="text-[11px] text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="profile-phone" className="text-xs font-medium">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="profile-phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={!canEdit}
                    placeholder="+91 98765 43210"
                    className={`pl-9 ${errors.phone ? "border-destructive" : ""}`}
                  />
                </div>
                {errors.phone && <p className="text-[11px] text-destructive">{errors.phone}</p>}
              </div>

              {formData.designation && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Designation</Label>
                  <Input
                    value={formData.designation}
                    disabled
                    className="bg-muted/30 text-muted-foreground"
                  />
                </div>
              )}

              {formData.department && (
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-muted-foreground">Department</Label>
                  <Input
                    value={formData.department}
                    disabled
                    className="bg-muted/30 text-muted-foreground"
                  />
                </div>
              )}
            </div>
          </div>

          {canEdit && (
            <div className="mt-6 flex justify-end gap-2 border-t border-border/60 pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => initialData && setFormData(initialData)}
                disabled={!isDirty || submitting}
                className="gap-1.5 text-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Discard
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={!isDirty || submitting}
                className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Save className="h-3.5 w-3.5" />
                {submitting ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          )}
        </div>

        <UnsavedChangesBanner
          isDirty={isDirty}
          submitting={submitting}
          onReset={() => initialData && setFormData(initialData)}
          onSave={() => handleProfileSave()}
        />
      </form>

      {/* Password Change Card */}
      {canEdit && (
        <form
          onSubmit={handlePasswordSubmit}
          className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs"
        >
          <div className="mb-5 flex items-center justify-between border-b border-border/60 pb-4">
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-foreground">
                Change Password
              </h3>
              <p className="text-xs text-muted-foreground">
                Update your account login password with strong entropy validation.
              </p>
            </div>
            <Lock className="h-4 w-4 text-primary shrink-0" />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="current-password" className="text-xs font-medium">
                Current Password
              </Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? "text" : "password"}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, currentPassword: e.target.value })
                  }
                  placeholder="Enter current password"
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="new-password" className="text-xs font-medium">
                New Password
              </Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, newPassword: e.target.value })
                  }
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  className={`pr-10 ${passwordErrors.newPassword ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Toggle new password visibility"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordErrors.newPassword && (
                <p className="text-[11px] text-destructive">{passwordErrors.newPassword}</p>
              )}

              {/* Strength Meter */}
              {passwordData.newPassword && (
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground">Strength:</span>
                    <span className="font-medium text-foreground">{strength.label}</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-full flex-1 transition-colors ${
                          i < strength.score ? strength.color : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirm-password" className="text-xs font-medium">
                Confirm New Password
              </Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                  }
                  placeholder="Re-enter new password"
                  autoComplete="new-password"
                  className={`pr-10 ${passwordErrors.confirmPassword ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordErrors.confirmPassword && (
                <p className="text-[11px] text-destructive">{passwordErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="mt-4 pt-1">
            <Button
              type="submit"
              size="sm"
              disabled={changingPassword || !passwordData.newPassword}
              className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              {changingPassword ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
