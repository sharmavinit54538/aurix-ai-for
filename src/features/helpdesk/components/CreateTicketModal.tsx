import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Paperclip, X, FileText } from "lucide-react";
import { helpdeskApi, getHelpdeskErrorMessage } from "../helpdeskApi";
import type { HelpdeskCategory, HelpdeskPriority, HelpdeskTicket } from "../types";

export const HELPDESK_CATEGORIES: Array<{
  value: HelpdeskCategory;
  label: string;
  department: "IT" | "HR" | "Operations";
  description: string;
}> = [
  { value: "it_hardware", label: "IT Hardware", department: "IT", description: "Laptops, monitors, MDM, peripherals, devices" },
  { value: "it_software", label: "IT Software", department: "IT", description: "SaaS access, licenses, VPN, credentials, email" },
  { value: "hr_policy", label: "HR Policies & Benefits", department: "HR", description: "Leaves, policies, documents, employee lifecycle" },
  { value: "payroll", label: "Payroll & Compensation", department: "HR", description: "Salary slips, tax declarations, discrepancies" },
  { value: "facilities", label: "Facilities & Office", department: "Operations", description: "Desk allocation, badges, office maintenance" },
  { value: "other", label: "General Support / Other", department: "Operations", description: "General inquiries and miscellaneous requests" },
];

interface CreateTicketModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (ticket: HelpdeskTicket) => void;
  defaultCategory?: HelpdeskCategory;
}

export function CreateTicketModal({
  open,
  onOpenChange,
  onSuccess,
  defaultCategory = "it_hardware",
}: CreateTicketModalProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<HelpdeskCategory>(defaultCategory);
  const [priority, setPriority] = useState<HelpdeskPriority>("medium");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = "Subject is required";
    } else if (title.trim().length < 5) {
      newErrors.title = "Subject must be at least 5 characters long";
    } else if (title.trim().length > 150) {
      newErrors.title = "Subject cannot exceed 150 characters";
    }

    if (!description.trim()) {
      newErrors.description = "Description is required";
    } else if (description.trim().length < 10) {
      newErrors.description = "Please provide more details (at least 10 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 15 * 1024 * 1024) {
        toast.error("File size exceeds 15MB limit");
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const attachmentUrls: string[] = [];

      // If user attached a file, upload to real upload endpoint first
      if (selectedFile) {
        try {
          const uploadRes = await helpdeskApi.uploadAttachment(selectedFile);
          if (uploadRes.url) {
            attachmentUrls.push(uploadRes.url);
          }
        } catch (uploadErr) {
          console.error("Attachment upload error:", uploadErr);
          toast.error("Failed to upload attachment. Ticket will be submitted without it.");
        }
      }

      const newTicket = await helpdeskApi.createTicket({
        title: title.trim(),
        description: description.trim(),
        category,
        priority,
        attachment_urls: attachmentUrls.length > 0 ? attachmentUrls : undefined,
      });

      toast.success("Support ticket created successfully", {
        description: `Ticket #${newTicket.ticket_number || newTicket.id.slice(0, 8)} has been routed for triage.`,
      });

      // Reset form
      setTitle("");
      setDescription("");
      setSelectedFile(null);
      setErrors({});
      onOpenChange(false);

      if (onSuccess) {
        onSuccess(newTicket);
      }
    } catch (err) {
      const msg = getHelpdeskErrorMessage(err, "Failed to create support ticket. Please try again.");
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[580px] p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create Support Ticket</DialogTitle>
          <DialogDescription>
            Submit an official support request to IT, HR, or Facilities. All updates will follow SLA guidelines.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          {/* Subject */}
          <div className="space-y-1.5">
            <Label htmlFor="ticket-title" className="text-sm font-medium">
              Subject <span className="text-destructive">*</span>
            </Label>
            <Input
              id="ticket-title"
              placeholder="e.g. Laptop display flickering, VPN configuration issue..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
              }}
              disabled={isSubmitting}
              className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
          </div>

          {/* Category & Priority Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="ticket-category" className="text-sm font-medium">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as HelpdeskCategory)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="ticket-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {HELPDESK_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      <span className="font-medium">{cat.label}</span>
                      <span className="ml-2 text-xs text-muted-foreground">({cat.department})</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ticket-priority" className="text-sm font-medium">
                Priority <span className="text-destructive">*</span>
              </Label>
              <Select
                value={priority}
                onValueChange={(val) => setPriority(val as HelpdeskPriority)}
                disabled={isSubmitting}
              >
                <SelectTrigger id="ticket-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Standard response)</SelectItem>
                  <SelectItem value="medium">Medium (Regular business impact)</SelectItem>
                  <SelectItem value="high">High (Affects ongoing work)</SelectItem>
                  <SelectItem value="urgent">Urgent (Work completely blocked)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="ticket-description" className="text-sm font-medium">
              Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="ticket-description"
              placeholder="Provide complete details, steps taken, error messages, and urgency..."
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
              }}
              disabled={isSubmitting}
              className={errors.description ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>

          {/* Attachment */}
          <div className="space-y-1.5">
            <Label className="text-sm font-medium">Attachment (Optional)</Label>
            {selectedFile ? (
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/40">
                <div className="flex items-center gap-2 text-sm truncate">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <span className="truncate font-medium">{selectedFile.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-destructive"
                  onClick={removeFile}
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label
                htmlFor="ticket-file"
                className="flex items-center justify-center gap-2 p-3 rounded-lg border border-dashed border-border hover:bg-muted/50 cursor-pointer transition-colors text-sm text-muted-foreground"
              >
                <Paperclip className="h-4 w-4 text-muted-foreground" />
                <span>Upload screenshot or document (max 15MB)</span>
                <input
                  id="ticket-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={isSubmitting}
                  accept=".png,.jpg,.jpeg,.pdf,.docx,.txt,.zip"
                />
              </label>
            )}
          </div>

          <DialogFooter className="pt-2 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {isSubmitting ? "Creating Ticket..." : "Submit Ticket"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
