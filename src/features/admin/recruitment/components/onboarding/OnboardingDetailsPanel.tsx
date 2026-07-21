import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Loader2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { CandidateAvatar } from "@/features/admin/recruitment/components/Bits";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import type {
  OnboardingDetails,
  OnboardingDocument,
  OnboardingProgressItem,
} from "@/services/employeeOnboardingApi";
import {
  formatCurrentStep,
  formatDateTime,
  formatFieldValue,
  formatStatusLabel,
  getDocumentUrl,
  humanizeFieldKey,
  isImageUrl,
  resolveMediaUrl,
  statusBadgeClass,
} from "../../utils/onboardingDisplay";

interface OnboardingDetailsPanelProps {
  employee: OnboardingProgressItem | null;
  details: OnboardingDetails | null;
  loading: boolean;
  error: string | null;
  actionDocumentId: string | null;
  onRetry: () => void;
  onVerifyDocument: (
    documentId: string,
    status: "VERIFIED" | "REJECTED",
    comment?: string,
  ) => Promise<boolean>;
}

const detailsPanelClass =
  "rounded-2xl border border-border bg-card/60 backdrop-blur-xl lg:max-h-[calc(100vh-12rem)] lg:overflow-y-auto";

const HIDDEN_PERSONAL_FIELDS = new Set(["profile_photo_url"]);

function ProfileAvatar({
  name,
  photoUrl,
  size = 48,
}: {
  name: string;
  photoUrl?: string | null;
  size?: number;
}) {
  const resolved = resolveMediaUrl(photoUrl);
  if (resolved && isImageUrl(resolved)) {
    return (
      <img
        src={resolved}
        alt={name}
        className="shrink-0 rounded-full object-cover ring-2 ring-border"
        style={{ width: size, height: size }}
      />
    );
  }
  return <CandidateAvatar name={name} size={size} />;
}

function DetailSection({
  title,
  data,
  photoFieldKey,
}: {
  title: string;
  data?: Record<string, unknown> | null;
  photoFieldKey?: string;
}) {
  const photoUrl = photoFieldKey && data ? (data[photoFieldKey] as string | undefined) : undefined;
  const entries = useMemo(() => {
    if (!data || Object.keys(data).length === 0) return [];
    return Object.entries(data).filter(([key, value]) => {
      if (photoFieldKey && key === photoFieldKey) return false;
      if (HIDDEN_PERSONAL_FIELDS.has(key)) return false;
      return value !== null && value !== undefined && value !== "";
    });
  }, [data, photoFieldKey]);

  if (entries.length === 0 && !photoUrl) return null;

  const resolvedPhoto = resolveMediaUrl(photoUrl);

  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {resolvedPhoto && isImageUrl(resolvedPhoto) ? (
        <div className="mb-4 flex items-center gap-3">
          <img
            src={resolvedPhoto}
            alt="Profile photo"
            className="h-24 w-24 rounded-xl object-cover ring-2 ring-border"
          />
          <p className="text-xs text-muted-foreground">Profile photo</p>
        </div>
      ) : null}
      {entries.length > 0 ? (
        <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {entries.map(([key, value]) => (
            <div key={key}>
              <dt className="text-[11px] text-muted-foreground">{humanizeFieldKey(key)}</dt>
              <dd className="mt-0.5 text-sm">{formatFieldValue(value)}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </div>
  );
}

function RecordListSection({
  title,
  items,
}: {
  title: string;
  items?: Array<Record<string, unknown>>;
}) {
  if (!items?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-card/40 p-4">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="rounded-lg border border-border/70 bg-background/40 p-3">
            <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {Object.entries(item).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-[11px] text-muted-foreground">{humanizeFieldKey(key)}</dt>
                  <dd className="mt-0.5 text-sm">{formatFieldValue(value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentRow({
  document,
  busy,
  onVerify,
  onReject,
}: {
  document: OnboardingDocument;
  busy: boolean;
  onVerify: () => void;
  onReject: () => void;
}) {
  const url = getDocumentUrl(document);

  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{document.name}</span>
            {document.document_type ? (
              <Badge variant="outline" className="text-[10px]">
                {document.document_type}
              </Badge>
            ) : null}
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${statusBadgeClass(document.verification_status)}`}
            >
              {formatStatusLabel(document.verification_status)}
            </span>
          </div>
          <div className="mt-1 text-[11px] text-muted-foreground">
            Last updated: {formatDateTime(document.updated_at ?? document.uploaded_at)}
          </div>
          {document.rejection_comment ? (
            <p className="mt-2 rounded-md bg-rose-500/10 px-2 py-1 text-xs text-rose-700 dark:text-rose-300">
              Rejection note: {document.rejection_comment}
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {url ? (
            <>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
              >
                <Eye className="mr-1.5 h-3.5 w-3.5" />
                Preview
              </Button>
              <Button type="button" size="sm" variant="outline" asChild>
                <a href={url} download target="_blank" rel="noopener noreferrer">
                  <Download className="mr-1.5 h-3.5 w-3.5" />
                  Download
                </a>
              </Button>
            </>
          ) : null}
          {document.verification_status !== "VERIFIED" ? (
            <Button type="button" size="sm" disabled={busy} onClick={onVerify}>
              {busy ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
              )}
              Verify
            </Button>
          ) : null}
          {document.verification_status !== "REJECTED" ? (
            <Button
              type="button"
              size="sm"
              variant="destructive"
              disabled={busy}
              onClick={onReject}
            >
              {busy ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <XCircle className="mr-1.5 h-3.5 w-3.5" />
              )}
              Reject
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function OnboardingDetailsPanel({
  employee,
  details,
  loading,
  error,
  actionDocumentId,
  onRetry,
  onVerifyDocument,
}: OnboardingDetailsPanelProps) {
  const [rejectDoc, setRejectDoc] = useState<OnboardingDocument | null>(null);
  const [rejectComment, setRejectComment] = useState("");
  const [rejectSubmitting, setRejectSubmitting] = useState(false);

  if (!employee) {
    return (
      <section className={`p-8 text-center ${detailsPanelClass}`}>
        <p className="text-sm text-muted-foreground">Select an employee to view onboarding details.</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className={`space-y-4 p-4 ${detailsPanelClass}`}>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          Loading onboarding details...
        </div>
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </section>
    );
  }

  if (error) {
    return (
      <section className={`flex flex-col items-center justify-center p-8 text-center ${detailsPanelClass}`}>
        <AlertCircle className="mb-3 h-8 w-8 text-destructive" />
        <p className="text-sm font-medium text-destructive">Failed to load onboarding details</p>
        <p className="mt-1 text-xs text-muted-foreground">{error}</p>
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-4">
          <RefreshCw className="mr-2 h-3.5 w-3.5" />
          Retry
        </Button>
      </section>
    );
  }

  if (!details) {
    return (
      <section className={`p-8 text-center ${detailsPanelClass}`}>
        <p className="text-sm text-muted-foreground">No onboarding details available.</p>
      </section>
    );
  }

  const completion = details.completion_percentage ?? employee.completion_percentage ?? 0;
  const profilePhotoUrl = details.personal_information?.profile_photo_url as string | undefined;

  async function handleRejectConfirm() {
    if (!rejectDoc) return;
    if (!rejectComment.trim()) return;
    setRejectSubmitting(true);
    const ok = await onVerifyDocument(rejectDoc.id, "REJECTED", rejectComment.trim());
    setRejectSubmitting(false);
    if (ok) {
      setRejectDoc(null);
      setRejectComment("");
    }
  }
  return (
    <>
      <section className={`space-y-4 p-4 ${detailsPanelClass}`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <ProfileAvatar
            name={details.name || employee.name}
            photoUrl={profilePhotoUrl}
            size={48}
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-lg font-semibold">{details.name || employee.name}</h2>
              <span
                className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ring-1 ${statusBadgeClass(details.status)}`}
              >
                {formatStatusLabel(details.status)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {(details.employment_details?.department as string | undefined) ?? employee.department} ·{" "}
              {(details.employment_details?.designation as string | undefined) ?? employee.designation}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Current step: {formatCurrentStep(details.current_step || employee.current_step)}
            </p>
            {details.verification_status ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Verification: {formatStatusLabel(details.verification_status)}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <Progress value={completion} className="h-2" />
          <div className="mt-1 text-xs text-muted-foreground">{completion}% complete</div>
        </div>

        {employee.missing_documents?.length ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">
              Pending documents
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {employee.missing_documents.map((doc) => (
                <Badge key={doc} variant="outline" className="text-[10px]">
                  {doc}
                </Badge>
              ))}
            </div>
          </div>
        ) : null}

        <DetailSection
          title="Personal Information"
          data={details.personal_information}
          photoFieldKey="profile_photo_url"
        />
        <DetailSection title="Identity Verification" data={details.identity_details} />
        <DetailSection title="Employment Details" data={details.employment_details} />
        <RecordListSection title="Education" items={details.education} />
        <RecordListSection title="Experience" items={details.experience} />
        <DetailSection title="Bank Information" data={details.bank_details} />
        <DetailSection title="Tax & Payroll" data={details.tax_payroll} />

        {details.documents?.length ? (
          <div className="rounded-xl border border-border bg-card/40 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Uploaded Documents
            </h3>
            <div className="space-y-3">
              {details.documents.map((document) => (
                <DocumentRow
                  key={document.id}
                  document={document}
                  busy={actionDocumentId === document.id}
                  onVerify={() => void onVerifyDocument(document.id, "VERIFIED", "Looks good")}
                  onReject={() => {
                    setRejectDoc(document);
                    setRejectComment("");
                  }}
                />
              ))}
            </div>
          </div>
        ) : null}

        {details.policy_acceptances?.length ? (
          <div className="rounded-xl border border-border bg-card/40 p-4">
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Agreements & Policies
            </h3>
            <div className="space-y-2">
              {details.policy_acceptances.map((policy, index) => (
                <div
                  key={policy.id ?? `${policy.policy_name ?? policy.name}-${index}`}
                  className="flex items-center justify-between rounded-lg border border-border/70 bg-background/40 px-3 py-2"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {policy.policy_name ?? policy.name ?? "Policy"}
                    </p>
                    {policy.version ? (
                      <p className="text-[11px] text-muted-foreground">Version {policy.version}</p>
                    ) : null}
                  </div>
                  <div className="text-right">
                    <Badge variant={policy.accepted ? "default" : "outline"}>
                      {policy.accepted ? "Accepted" : "Pending"}
                    </Badge>
                    {policy.accepted_at ? (
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        {formatDateTime(policy.accepted_at)}
                      </p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <Dialog
        open={Boolean(rejectDoc)}
        onOpenChange={(open) => {
          if (!open) {
            setRejectDoc(null);
            setRejectComment("");
          }
        }}
      >
        <DialogContent className="rounded-2xl border-border bg-card sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject document</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-comment" className="text-xs">
              Rejection comment
            </Label>
            <Textarea
              id="reject-comment"
              value={rejectComment}
              onChange={(event) => setRejectComment(event.target.value)}
              placeholder="Please upload a clearer copy."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRejectDoc(null)}>
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={!rejectComment.trim() || rejectSubmitting}
              onClick={() => void handleRejectConfirm()}
            >
              {rejectSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Reject document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
