import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { newId, useRecruitment } from "../hooks/useRecruitment";
import type { Job, Stage } from "../types";
import {
  buildCandidateFromForm,
  EMPTY_CANDIDATE_FORM,
  type CandidateFormData,
} from "../utils/candidateForm";

interface AddCandidateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  successMessage?: string;
  stage?: Stage;
  jobs?: Job[];
  appliedPositionFallback?: string;
}

export function AddCandidateDialog({
  open,
  onOpenChange,
  title = "Add Candidate",
  description = "Create a new candidate profile and add them to the pipeline.",
  successMessage = "Candidate added successfully.",
  stage = "applied",
  jobs,
  appliedPositionFallback,
}: AddCandidateDialogProps) {
  const { upsertCandidate } = useRecruitment();
  const [formData, setFormData] = useState<CandidateFormData>(EMPTY_CANDIDATE_FORM);
  const [submitting, setSubmitting] = useState(false);

  function updateField<K extends keyof CandidateFormData>(key: K, value: CandidateFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function handleClose(nextOpen: boolean) {
    if (!nextOpen && !submitting) {
      setFormData(EMPTY_CANDIDATE_FORM);
    }
    onOpenChange(nextOpen);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Name and email are required.");
      return;
    }

    const job = jobs?.find((item) => item.id === formData.jobId) ?? null;
    setSubmitting(true);
    try {
      await upsertCandidate(
        buildCandidateFromForm(formData, {
          id: newId("cand"),
          stage,
          job,
          appliedPositionFallback,
        }),
      );
      toast.success(successMessage);
      setFormData(EMPTY_CANDIDATE_FORM);
      onOpenChange(false);
    } catch {
      toast.error("Failed to add candidate.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <AddCandidateFormFields
            formData={formData}
            onChange={updateField}
            jobs={jobs}
          />
          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => handleClose(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Adding…" : "Add Candidate"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface AddCandidateFormFieldsProps {
  formData: CandidateFormData;
  onChange: <K extends keyof CandidateFormData>(key: K, value: CandidateFormData[K]) => void;
  jobs?: Job[];
}

function AddCandidateFormFields({ formData, onChange, jobs }: AddCandidateFormFieldsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Full Name *" htmlFor="cand-name">
          <Input
            id="cand-name"
            placeholder="e.g. Rahul Sharma"
            value={formData.name}
            onChange={(e) => onChange("name", e.target.value)}
            required
          />
        </FormField>
        <FormField label="Email Address *" htmlFor="cand-email">
          <Input
            id="cand-email"
            type="email"
            placeholder="e.g. rahul@example.com"
            value={formData.email}
            onChange={(e) => onChange("email", e.target.value)}
            required
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Phone Number" htmlFor="cand-phone">
          <Input
            id="cand-phone"
            placeholder="e.g. +91 98765 43210"
            value={formData.phone}
            onChange={(e) => onChange("phone", e.target.value)}
          />
        </FormField>
        <FormField label="Location" htmlFor="cand-location">
          <Input
            id="cand-location"
            placeholder="e.g. Bengaluru, India"
            value={formData.location}
            onChange={(e) => onChange("location", e.target.value)}
          />
        </FormField>
      </div>

      {jobs ? (
        <FormField label="Applied Job" htmlFor="cand-job">
          <select
            id="cand-job"
            value={formData.jobId}
            onChange={(e) => onChange("jobId", e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
          >
            <option value="">Open application (no specific job)</option>
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} — {job.department}
              </option>
            ))}
          </select>
        </FormField>
      ) : null}

      <div className="grid grid-cols-2 gap-4">
        <FormField label="Current Company" htmlFor="cand-company">
          <Input
            id="cand-company"
            placeholder="e.g. Acme Corp"
            value={formData.currentCompany}
            onChange={(e) => onChange("currentCompany", e.target.value)}
          />
        </FormField>
        <FormField label="Current Role" htmlFor="cand-role">
          <Input
            id="cand-role"
            placeholder="e.g. Senior Frontend Engineer"
            value={formData.currentRole}
            onChange={(e) => onChange("currentRole", e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FormField label="Experience (Years)" htmlFor="cand-exp">
          <Input
            id="cand-exp"
            type="number"
            min="0"
            value={formData.yearsExperience}
            onChange={(e) => onChange("yearsExperience", e.target.value)}
          />
        </FormField>
        <FormField label="Expected CTC (INR)" htmlFor="cand-salary">
          <Input
            id="cand-salary"
            type="number"
            min="0"
            value={formData.expectedSalary}
            onChange={(e) => onChange("expectedSalary", e.target.value)}
          />
        </FormField>
        <FormField label="Notice Period (Days)" htmlFor="cand-notice">
          <Input
            id="cand-notice"
            type="number"
            min="0"
            value={formData.noticeDays}
            onChange={(e) => onChange("noticeDays", e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Skills (comma-separated)" htmlFor="cand-skills">
        <Input
          id="cand-skills"
          placeholder="e.g. React, TypeScript, Node.js"
          value={formData.skills}
          onChange={(e) => onChange("skills", e.target.value)}
        />
      </FormField>

      <FormField label="Tags (comma-separated)" htmlFor="cand-tags">
        <Input
          id="cand-tags"
          placeholder="e.g. Remote, Immediate Joiner, Referral"
          value={formData.tags}
          onChange={(e) => onChange("tags", e.target.value)}
        />
      </FormField>

      <FormField label="Candidate Summary" htmlFor="cand-summary">
        <Textarea
          id="cand-summary"
          placeholder="Brief summary of the candidate's profile and background…"
          rows={3}
          value={formData.summary}
          onChange={(e) => onChange("summary", e.target.value)}
        />
      </FormField>
    </>
  );
}

function FormField({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
