import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { RefreshCw, Save, User } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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

const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  designation: z.string().optional(),
  department: z.string().optional(),
  bio: z.string().max(500, "Bio is too long").optional(),
});

type FormValues = z.infer<typeof schema>;

function ProfileSettingsPage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector(selectProfileSettings);
  const loading = useAppSelector(selectSettingsLoading);
  const submitting = useAppSelector(selectSettingsSubmitting);

  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      designation: "",
      department: "",
      bio: "",
    }
  });

  useEffect(() => {
    dispatch(fetchProfileSettings());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      reset({
        fullName: profile.fullName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        designation: profile.designation || "",
        department: profile.department || "",
        bio: profile.bio || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: FormValues) => {
    try {
      await dispatch(updateProfileSettings(data)).unwrap();
      toast.success("User profile saved successfully!");
      reset(data);
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
    <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl relative overflow-hidden">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold tracking-tight">Personal Profile Settings</h2>
          <p className="text-xs text-muted-foreground">Update your personal account information, professional title, and bio.</p>
        </div>
        <User className="h-5 w-5 text-muted-foreground" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Full Name</Label>
            <Input
              {...register("fullName")}
              placeholder="Aarav Sharma"
              aria-invalid={!!errors.fullName}
            />
            {errors.fullName && <p className="text-[10px] text-destructive">{errors.fullName.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Email Address</Label>
            <Input
              type="email"
              {...register("email")}
              placeholder="aarav@aurix.ai"
              aria-invalid={!!errors.email}
            />
            {errors.email && <p className="text-[10px] text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Phone Number</Label>
            <Input
              {...register("phone")}
              placeholder="+91 98765 01234"
              aria-invalid={!!errors.phone}
            />
            {errors.phone && <p className="text-[10px] text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Designation / Title</Label>
            <Input
              {...register("designation")}
              placeholder="HR Lead / Administrator"
              aria-invalid={!!errors.designation}
            />
            {errors.designation && <p className="text-[10px] text-destructive">{errors.designation.message}</p>}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-medium">Department</Label>
            <Input
              {...register("department")}
              placeholder="Human Resources"
              aria-invalid={!!errors.department}
            />
            {errors.department && <p className="text-[10px] text-destructive">{errors.department.message}</p>}
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-medium">Bio / About</Label>
            <Textarea
              rows={3}
              {...register("bio")}
              placeholder="Brief professional summary..."
              aria-invalid={!!errors.bio}
            />
            {errors.bio && <p className="text-[10px] text-destructive">{errors.bio.message}</p>}
          </div>
        </div>

        {isDirty && (
          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={() => reset()}>Cancel</Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <RefreshCw className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Profile
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
