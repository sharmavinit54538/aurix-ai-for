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
} from "@/services/announcementsApi";
import {
  useCreateAnnouncement,
  useUpdateAnnouncement,
} from "../hooks/useAnnouncements";

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
  const [content, setContent] = useState("");
  const [targetAudience, setTargetAudience] = useState("ALL_TENANTS");
  const [priority, setPriority] = useState<string>("normal");
  const [isPinned, setIsPinned] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();

  const isPending = createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (announcement) {
      setTitle(announcement.title ?? "");
      setContent(announcement.content ?? "");
      setTargetAudience(announcement.targetAudience ?? "ALL_TENANTS");
      setPriority(announcement.priority ?? "normal");
      setIsPinned(announcement.isPinned ?? false);
    } else {
      setTitle("");
      setContent("");
      setTargetAudience("ALL_TENANTS");
      setPriority("normal");
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

    try {
      if (isEditing && announcement) {
        const payload: UpdateAnnouncementInput = {
          title: title.trim(),
          content: content.trim() || undefined,
          target_audience: targetAudience.trim() || undefined,
          priority,
          is_pinned: isPinned,
        };
        await updateMutation.mutateAsync({ id: announcement.id, input: payload });
        toast.success("Announcement updated successfully");
      } else {
        const payload: CreateAnnouncementInput = {
          title: title.trim(),
          content: content.trim() || undefined,
          target_audience: targetAudience.trim() || undefined,
          priority,
          is_pinned: isPinned,
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
      <DialogContent className="sm:max-w-[550px]">
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
              />
              {fieldErrors.title && (
                <p className="text-[11px] text-destructive font-medium">{fieldErrors.title}</p>
              )}
            </div>

            {/* Target Audience & Priority Row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="targetAudience" className="text-xs font-semibold">
                  Target Audience
                </Label>
                <Input
                  id="targetAudience"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. ALL_TENANTS, All Employees"
                  disabled={isPending}
                  className={fieldErrors.target_audience ? "border-destructive" : ""}
                />
                {fieldErrors.target_audience && (
                  <p className="text-[11px] text-destructive font-medium">
                    {fieldErrors.target_audience}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="priority" className="text-xs font-semibold">
                  Priority
                </Label>
                <Select value={priority} onValueChange={setPriority} disabled={isPending}>
                  <SelectTrigger id="priority" className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.priority && (
                  <p className="text-[11px] text-destructive font-medium">
                    {fieldErrors.priority}
                  </p>
                )}
              </div>
            </div>

            {/* Content Body */}
            <div className="space-y-1.5">
              <Label htmlFor="content" className="text-xs font-semibold">
                Announcement Content
              </Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write announcement details (Markdown supported)..."
                rows={5}
                disabled={isPending}
                className={fieldErrors.content ? "border-destructive" : ""}
              />
              {fieldErrors.content && (
                <p className="text-[11px] text-destructive font-medium">{fieldErrors.content}</p>
              )}
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
