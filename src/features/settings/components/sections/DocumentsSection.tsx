import React, { useEffect, useState, useCallback } from "react";
import { FileText, Save, RotateCcw, FileCheck, Layers } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  fetchDocumentCategoriesList,
  fetchDocumentSettings,
  updateDocumentSettings,
  isMissingApiError,
} from "../../api";
import type { DocumentSettingsForm, DocumentTypeItem } from "../../types";
import { UnsavedChangesBanner } from "../UnsavedChangesBanner";

interface DocumentsSectionProps {
  canEdit: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

const DEFAULT_DOC_TYPES: DocumentTypeItem[] = [
  {
    id: "pan",
    name: "PAN Card / Tax Identification",
    mandatory: true,
    allowedFormats: ["PDF", "JPG", "PNG"],
    maxSizeMb: 5,
    requiresHrVerification: true,
    hasExpiry: false,
  },
  {
    id: "aadhaar",
    name: "Aadhaar Card / National ID",
    mandatory: true,
    allowedFormats: ["PDF", "JPG", "PNG"],
    maxSizeMb: 5,
    requiresHrVerification: true,
    hasExpiry: false,
  },
  {
    id: "passport",
    name: "Passport / Visa",
    mandatory: false,
    allowedFormats: ["PDF"],
    maxSizeMb: 10,
    requiresHrVerification: true,
    hasExpiry: true,
  },
  {
    id: "education",
    name: "Degree & Educational Certificates",
    mandatory: true,
    allowedFormats: ["PDF"],
    maxSizeMb: 10,
    requiresHrVerification: true,
    hasExpiry: false,
  },
  {
    id: "relieving",
    name: "Previous Employment Relieving Letter",
    mandatory: true,
    allowedFormats: ["PDF"],
    maxSizeMb: 5,
    requiresHrVerification: true,
    hasExpiry: false,
  },
];

export function DocumentsSection({ canEdit, onDirtyChange }: DocumentsSectionProps) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [missingNotice, setMissingNotice] = useState<string | null>(null);

  const [initialData, setInitialData] = useState<DocumentSettingsForm | null>(null);
  const [formData, setFormData] = useState<DocumentSettingsForm>({
    documentTypes: [],
    expiryReminderDays: [30, 15, 7],
    salarySlipWatermark: true,
    salarySlipVisibleToEmployee: true,
    provisionSlipLockedRequired: true,
    provisionSlipVisibleToEmployee: false,
    templatesCount: 4,
  });

  const isDirty = initialData ? JSON.stringify(initialData) !== JSON.stringify(formData) : false;

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setMissingNotice(null);

    // 1. Fetch real categories
    try {
      await fetchDocumentCategoriesList();
    } catch {
      // Ignored
    }

    // 2. Fetch document policies
    try {
      const data = await fetchDocumentSettings();
      const combined = {
        ...data,
        documentTypes: data.documentTypes || [],
      };
      setInitialData(combined);
      setFormData(combined);
    } catch (err: unknown) {
      if (isMissingApiError(err)) {
        setMissingNotice(err.message);
        setInitialData(formData);
      } else {
        const msg = (err as { message?: string })?.message || "Failed to load document settings.";
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [formData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canEdit) return;

    setSubmitting(true);
    try {
      await updateDocumentSettings(formData);
      setInitialData(formData);
      toast.success("Document policies updated successfully!");
    } catch (err: unknown) {
      if (isMissingApiError(err)) {
        setMissingNotice(err.message);
        toast.error("Document policies API is not implemented on backend.");
      } else {
        const msg = (err as { message?: string })?.message || "Failed to update document settings.";
        toast.error(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56 rounded-lg" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Verification & Compliance Rules */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Employee Document Types & Rules
            </h3>
            <p className="text-xs text-muted-foreground">
              Mandatory onboarding proofs and HR verification prerequisites.
            </p>
          </div>
          <FileCheck className="h-4 w-4 text-primary shrink-0" />
        </div>

        <div className="space-y-3">
          {formData.documentTypes.length === 0 ? (
            <div className="p-6 text-center text-xs text-muted-foreground border border-dashed border-border rounded-xl">
              No document rules or required types configured.
            </div>
          ) : (
            formData.documentTypes.map((doc, idx) => (
              <div
                key={doc.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card/80 p-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-foreground">{doc.name}</span>
                    {doc.mandatory && (
                      <Badge
                        variant="secondary"
                        className="text-[9px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20"
                      >
                        Mandatory
                      </Badge>
                    )}
                    {doc.hasExpiry && (
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1.5 py-0 text-amber-500 border-amber-500/30"
                      >
                        Tracks Expiry
                      </Badge>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Allowed: {doc.allowedFormats.join(", ")} • Max {doc.maxSizeMb}MB
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Label className="text-[11px] font-medium text-muted-foreground">
                      HR Verification
                    </Label>
                    <Switch
                      checked={doc.requiresHrVerification}
                      onCheckedChange={(c) => {
                        const updated = [...formData.documentTypes];
                        updated[idx] = { ...updated[idx], requiresHrVerification: c };
                        setFormData({ ...formData, documentTypes: updated });
                      }}
                      disabled={!canEdit}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Salary Slip Settings */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Salary Slip Issuance
            </h3>
            <p className="text-xs text-muted-foreground">
              Finalized official pay slips generated after payroll settlement.
            </p>
          </div>
          <FileText className="h-4 w-4 text-emerald-500 shrink-0" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3.5">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium text-foreground">
                Employee Portal Visibility
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Employees can view and download their finalized salary slips.
              </p>
            </div>
            <Switch
              checked={formData.salarySlipVisibleToEmployee}
              onCheckedChange={(c) => setFormData({ ...formData, salarySlipVisibleToEmployee: c })}
              disabled={!canEdit}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3.5">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium text-foreground">
                Digital Security Watermark
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Embed organizational security watermark and verification hash on PDF.
              </p>
            </div>
            <Switch
              checked={formData.salarySlipWatermark}
              onCheckedChange={(c) => setFormData({ ...formData, salarySlipWatermark: c })}
              disabled={!canEdit}
            />
          </div>
        </div>
      </div>

      {/* Provision Slip Settings (Strictly Separated) */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 flex items-center justify-between border-b border-border/60 pb-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-foreground">
              Provision Slip Policies
            </h3>
            <p className="text-xs text-muted-foreground">
              Internal estimated calculations during pre-finalization review. Strictly separated
              from official salary slips.
            </p>
          </div>
          <Layers className="h-4 w-4 text-amber-500 shrink-0" />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3.5">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium text-foreground">Lock Before Disbursal</Label>
              <p className="text-[11px] text-muted-foreground">
                Require CFO/HR approval lock before provisional slips convert to finalized salary
                slips.
              </p>
            </div>
            <Switch
              checked={formData.provisionSlipLockedRequired}
              onCheckedChange={(c) => setFormData({ ...formData, provisionSlipLockedRequired: c })}
              disabled={!canEdit}
            />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/20 p-3.5">
            <div className="space-y-0.5">
              <Label className="text-xs font-medium text-foreground">
                Staff Visibility During Review
              </Label>
              <p className="text-[11px] text-muted-foreground">
                Default: Disabled. Provision slips remain confidential to HR until approved.
              </p>
            </div>
            <Switch
              checked={formData.provisionSlipVisibleToEmployee}
              onCheckedChange={(c) =>
                setFormData({ ...formData, provisionSlipVisibleToEmployee: c })
              }
              disabled={!canEdit}
            />
          </div>
        </div>
      </div>

      {/* Expiry Reminders Card */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs">
        <div className="mb-5 border-b border-border/60 pb-4">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">
            Document Expiry Reminders
          </h3>
          <p className="text-xs text-muted-foreground">
            Automated notification schedule before passports, visas, or contracts expire.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-muted-foreground">
            Alert intervals (days prior):
          </span>
          {formData.expiryReminderDays.map((days) => (
            <Badge key={days} variant="secondary" className="text-xs font-mono">
              {days} Days Before
            </Badge>
          ))}
        </div>
      </div>

      {canEdit && (
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => initialData && setFormData(initialData)}
            disabled={!isDirty || submitting}
            className="gap-1.5 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Discard Changes
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={!isDirty || submitting}
            className="gap-1.5 text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Save className="h-3.5 w-3.5" />
            {submitting ? "Saving..." : "Save Document Settings"}
          </Button>
        </div>
      )}

      <UnsavedChangesBanner
        isDirty={isDirty}
        submitting={submitting}
        onReset={() => initialData && setFormData(initialData)}
        onSave={() => handleSave()}
      />
    </form>
  );
}
