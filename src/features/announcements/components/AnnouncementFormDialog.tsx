import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  extractValidationErrors,
  type Announcement,
  type CreateAnnouncementInput,
  type UpdateAnnouncementInput,
  type AnnouncementPriority,
  type AnnouncementVisibility,
} from "@/services/announcementsApi";
import {
  useCreateAnnouncement,
  useUpdateAnnouncement,
} from "../hooks/useAnnouncements";
import { departmentsApi } from "@/services/departmentsApi";
import { branchesApi } from "@/services/branchesApi";

interface AnnouncementFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  announcement?: Announcement | null;
}

export function AnnouncementFormDialog({
  open,
  onOpenChange,
  announcement,
}: AnnouncementFormDialogProps) {
  const isEditing = Boolean(announcement);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [visibility, setVisibility] = useState<AnnouncementVisibility>("ALL_EMPLOYEES");
  const [priority, setPriority] = useState<AnnouncementPriority>("MEDIUM");
  const [department, setDepartment] = useState<string | null>(null);
  const [branch, setBranch] = useState<string | null>(null);
  const [publishDate, setPublishDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [departments, setDepartments] = useState<Array<{ id: string; name: string }>>([]);
  const [branches, setBranches] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoadingDeps, setIsLoadingDeps] = useState(false);

  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();

  const isPending = createMutation.isPending || updateMutation.isPending;

  // Fetch departments and branches on mount
  useEffect(() => {
    const fetchMetadata = async () => {
      setIsLoadingDeps(true);
      try {
        const [depsRes, branchesRes] = await Promise.all([
          departmentsApi.getDepartments({ limit: 100 }),
          branchesApi.getBranches({ limit: 100 }),
        ]);
        setDepartments(depsRes.items?.map((d: any) => ({ id: String(d.id), name: d.name })) ?? []);
        setBranches(branchesRes.items?.map((b: any) => ({ id: String(b.id), name: b.name })) ?? []);
      } catch {
        // Ignore errors, fields will be empty
      } finally {
        setIsLoadingDeps(false);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title ?? "");
      setDescription(announcement.description ?? "");
      setCategory(announcement.category ?? "");
      setVisibility(announcement.visibility ?? "ALL_EMPLOYEES");
      setPriority(announcement.priority ?? "MEDIUM");
      setDepartment(announcement.department ?? null);
      setBranch(announcement.branch ?? null);
      setPublishDate(announcement.publish_date ? announcement.publish_date.split("T")[0] : "");
      setExpiryDate(announcement.expiry_date ? announcement.expiry_date.split("T")[0] : "");
      setIsPinned(announcement.is_pinned ?? false);
    } else {
      setTitle("");
      setDescription("");
      setCategory("");
      setVisibility("ALL_EMPLOYEES");
      setPriority("MEDIUM");
      setDepartment(null);
      setBranch(null);
      setPublishDate(new Date().toISOString().split("T")[0]);
      setExpiryDate("");
      setIsPinned(false);
    }
    setFieldErrors({});
  }, [announcement, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    if (!title.trim()) {
      setFieldErrors({ title: "Title is required" });
      return;
    }

    if (!description.trim()) {
      setFieldErrors({ description: "Description is required" });
      return;
    }

    if (!publishDate) {
      setFieldErrors({ publish_date: "Publish date is required" });
      return;
    }

    if (expiryDate && new Date(expiryDate) < new Date(publishDate)) {
      setFieldErrors({ expiry_date: "Expiry date cannot be before publish date" });
      return;
    }

    try {
      if (isEditing && announcement) {
        const payload: UpdateAnnouncementInput = {
          title: title.trim(),
          description: description.trim(),
          category: category.trim() || undefined,
          visibility: visibility || undefined,
          priority: priority || undefined,
          department: department || undefined,
          branch: branch || undefined,
          publish_date: publishDate,
          expiry_date: expiryDate || undefined,
          is_pinned: isPinned,
        };
        await updateMutation.mutateAsync({ id: announcement.id, input: payload });
        toast.success("Announcement updated successfully");
      } else {
        const payload: CreateAnnouncementInput = {
          title: title.trim(),
          description: description.trim(),
          category: category.trim() || undefined,
          visibility: visibility || "ALL_EMPLOYEES",
          priority: priority || "MEDIUM",
          department: department || null,
          branch: branch || null,
          publish_date: publishDate,
          expiry_date: expiryDate || null,
          is_pinned: isPinned,
          status: "DRAFT",
        };
        await createMutation.mutateAsync(payload);
        toast.success("Announcement created successfully");
      }
      onOpenChange(false);
    } catch (err: unknown) {
      const errors = extractValidationErrors(err);
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        toast.error("Please fix the validation errors below.");
      } else {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to save announcement. Please check backend response.";
        toast.error(message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Announcement" : "Create New Announcement"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update announcement details. Changes will reflect across the organization."
                : "Broadcast a company-wide announcement or target specific departments."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Title */}
            <div className="space-y-1.5">
              <Label htmlFor="title" className="text-xs font-semibold">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Annual Company Offsite 2026 Announcement"
                disabled={isPending}
                className={fieldErrors.title ? "border-destructive focus-visible:ring-destructive" : ""}
                maxLength={150}
              />
              {fieldErrors.title && (
                <p className="text-[11px] text-destructive font-medium">{fieldErrors.title}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description" className="text-xs font-semibold">
                Description <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Announcement description shown in feeds and notifications"
                disabled={isPending}
                rows={3}
                className={fieldErrors.description ? "border-destructive focus-visible:ring-destructive" : ""}
              />
              {fieldErrors.description && (
                <p className="text-[11px] text-destructive font-medium">{fieldErrors.description}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs font-semibold">
                Category
              </Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. General, Events, Policy, Holiday"
                disabled={isPending}
                maxLength={50}
              />
              {fieldErrors.category && (
                <p className="text-[11px] text-destructive font-medium">{fieldErrors.category}</p>
              )}
            </div>

            {/* Visibility, Priority, Department, Branch Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="visibility" className="text-xs font-semibold">
                  Visibility
                </Label>
                <Select value={visibility} onValueChange={(v: string) => setVisibility(v as AnnouncementVisibility)} disabled={isPending}>
                  <SelectTrigger id="visibility" className="w-full">
                    <SelectValue placeholder="Select visibility" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL_EMPLOYEES">All Employees</SelectItem>
                    <SelectItem value="DEPARTMENT">Department</SelectItem>
                    <SelectItem value="BRANCH">Branch</SelectItem>
                    <SelectItem value="ROLE">Role</SelectItem>
                    <SelectItem value="CUSTOM">Custom</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.visibility && (
                  <p className="text-[11px] text-destructive font-medium">{fieldErrors.visibility}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="priority" className="text-xs font-semibold">
                  Priority
                </Label>
                <Select value={priority} onValueChange={(v: string) => setPriority(v as AnnouncementPriority)} disabled={isPending}>
                  <SelectTrigger id="priority" className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                    <SelectItem value="URGENT">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.priority && (
                  <p className="text-[11px] text-destructive font-medium">{fieldErrors.priority}</p>
                )}
              </div>
            </div>

            {/* Department and Branch Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="department" className="text-xs font-semibold">
                  Department
                </Label>
                <Select value={department ?? ""} onValueChange={(v) => setDepartment(v || null)} disabled={isPending || isLoadingDeps}>
                  <SelectTrigger id="department" className="w-full">
                    <SelectValue placeholder="Select department (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">— None —</SelectItem>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.id}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="branch" className="text-xs font-semibold">
                  Branch
                </Label>
                <Select value={branch ?? ""} onValueChange={(v) => setBranch(v || null)} disabled={isPending || isLoadingDeps}>
                  <SelectTrigger id="branch" className="w-full">
                    <SelectValue placeholder="Select branch (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">— None —</SelectItem>
                    {branches.map((b) => (
                      <SelectItem key={b.id} value={b.id}>
                        {b.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Date Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="publishDate" className="text-xs font-semibold">
                  Publish Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="publishDate"
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  disabled={isPending}
                  className={fieldErrors.publish_date ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {fieldErrors.publish_date && (
                  <p className="text-[11px] text-destructive font-medium">{fieldErrors.publish_date}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="expiryDate" className="text-xs font-semibold">
                  Expiry Date (Optional)
                </Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  disabled={isPending}
                  className={fieldErrors.expiry_date ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {fieldErrors.expiry_date && (
                  <p className="text-[11px] text-destructive font-medium">{fieldErrors.expiry_date}</p>
                )}
              </div>
            </div>

            {/* Pin to top */}
            <div className="flex items-center justify-between rounded-lg border p-3 shadow-xs">
              <div className="space-y-0.5">
                <Label htmlFor="isPinned" className="text-xs font-medium cursor-pointer">
                  Pin to Top
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Pinned announcements stay at the top of employee feeds.
                </p>
              </div>
              <Switch
                id="isPinned"
                checked={isPinned}
                onCheckedChange={setIsPinned}
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create Announcement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}