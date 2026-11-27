import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  FileCheck2,
  HelpCircle,
  Loader2,
  Lock,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { hasValidAccessToken } from "@/api";
import { Stepper } from "@/components/aurix/Stepper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  DIGILOCKER_CONSENT_NOTICE,
  DIGILOCKER_DOCUMENTS_CONFIG,
  DIGILOCKER_STEPS,
  DIGILOCKER_SUPPORT_CONTACT,
} from "@/features/document-verification/config";
import { useDocumentVerification } from "@/hooks/useDocumentVerification";
import { useAurix } from "@/lib/aurix-store";
import { logout, useAuthReady, isLogoutInProgress } from "@/lib/auth-bootstrap";
import { getDefaultDashboardPath, getSafeRedirectUrl } from "@/lib/role-routing";
import { normalizeRole } from "@/lib/roles";
import {
  isDigiLockerVerificationEnabled,
  type DocumentItemVerificationStatus,
} from "@/services/documentVerificationApi";

function getDocBadgeProps(status?: DocumentItemVerificationStatus): {
  label: string;
  className: string;
} | null {
  if (!status) return null;
  if (status === "VERIFIED") {
    return {
      label: "Verified",
      className:
        "border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    };
  }
  if (status === "FAILED") {
    return {
      label: "Verification failed",
      className: "border-rose-500/30 bg-rose-500/15 text-rose-600 dark:text-rose-400",
    };
  }
  if (status === "NOT_AVAILABLE") {
    return {
      label: "Not available",
      className: "border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400",
    };
  }
  return {
    label: "Pending",
    className: "border-border bg-muted text-muted-foreground",
  };
}

export function VerifyDocumentsPage() {
  const navigate = useNavigate();
  const ws = useAurix();
  const authReady = useAuthReady();
  const searchParams = useSearch({ strict: false }) as { redirect?: string };

  const {
    status,
    documents,
    isLoading,
    isInitiating,
    error,
    fetchStatus,
    initiateVerification,
  } = useDocumentVerification();

  const [consentChecked, setConsentChecked] = useState(true);
  const [consentError, setConsentError] = useState<string | null>(null);
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  const featureEnabled = isDigiLockerVerificationEnabled();
  const userRole = normalizeRole(ws.user?.role);
  const isVerifiedInStore =
    ws.user?.documentVerificationStatus === "VERIFIED" ||
    ws.user?.documentsVerified === true ||
    status === "VERIFIED";

  const destinationPath = useMemo(
    () => getSafeRedirectUrl(searchParams?.redirect, ws.user),
    [searchParams?.redirect, ws.user],
  );

  // 1. Auth & role checks + redirect if already verified
  useEffect(() => {
    if (!authReady || ws.isRestoring) return;

    if (!ws.user) {
      if (!hasValidAccessToken()) {
        navigate({ to: "/login" as any, replace: true });
      }
      return;
    }

    // Feature flag disabled or non-employee role -> go straight to dashboard
    if (!featureEnabled || userRole !== "employee") {
      navigate({ to: getDefaultDashboardPath(ws.user) as any, replace: true });
      return;
    }

    // Already verified employee visiting /verify-documents manually -> redirect to dashboard
    if (isVerifiedInStore) {
      navigate({ to: destinationPath as any, replace: true });
      return;
    }

    if (!initialCheckDone) {
      setInitialCheckDone(true);
      void fetchStatus().then((res) => {
        if (res?.status === "VERIFIED") {
          navigate({ to: destinationPath as any, replace: true });
        }
      });
    }
  }, [
    authReady,
    ws.isRestoring,
    ws.user,
    featureEnabled,
    userRole,
    isVerifiedInStore,
    initialCheckDone,
    fetchStatus,
    navigate,
    destinationPath,
  ]);

  const docStatusMap = useMemo(() => {
    const map = new Map<
      string,
      { status: DocumentItemVerificationStatus; failureReason?: string }
    >();
    documents.forEach((doc) => {
      map.set(doc.id.toLowerCase(), {
        status: doc.status,
        failureReason: doc.failureReason,
      });
    });
    return map;
  }, [documents]);

  async function handleStartDigiLocker() {
    if (isInitiating) return;
    if (!consentChecked) {
      setConsentError("Please tick the consent checkbox above to continue with DigiLocker verification.");
      return;
    }
    setConsentError(null);

    // Persist optional post-verification redirect path (non-sensitive route path only)
    if (searchParams?.redirect && typeof window !== "undefined") {
      try {
        window.sessionStorage?.setItem(
          "ofc360_post_verification_redirect",
          searchParams.redirect,
        );
      } catch {
        /* ignore */
      }
    }

    const authorizationUrl = await initiateVerification();
    if (authorizationUrl && typeof window !== "undefined") {
      if (authorizationUrl.startsWith("/")) {
        const [pathPart, queryPart] = authorizationUrl.split("?");
        const queryObj = queryPart
          ? Object.fromEntries(new URLSearchParams(queryPart))
          : undefined;
        navigate({
          to: pathPart as any,
          search: queryObj as any,
        });
      } else {
        window.location.assign(authorizationUrl);
      }
    }
  }

  if (!ws.user) {
    return null;
  }

  const employeeName = ws.user.fullName || ws.user.email || "Employee";
  const currentStepperIndex = status === "IN_PROGRESS" ? 1 : 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 -z-10 h-96 w-96 rounded-full opacity-25 blur-3xl"
        style={{ background: "var(--gradient-brand)" }}
      />

      {/* Top Header */}
      <header className="flex items-center justify-between border-b border-border/60 bg-background/70 px-6 py-4 backdrop-blur-xl sm:px-10">
        <div className="inline-flex items-center gap-2.5">
          <span
            className="grid h-8 w-8 place-items-center rounded-lg text-brand-foreground shadow-glow"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">OFC360</span>
          <Badge variant="outline" className="ml-1 hidden sm:inline-flex text-[11px]">
            Employee Verification
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Signed in as <strong className="font-medium text-foreground">{employeeName}</strong>
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => void logout({ redirect: true })}
            disabled={isLogoutInProgress()}
            className={`gap-1.5 text-xs ${isLogoutInProgress() ? "text-muted-foreground/50 hover:text-muted-foreground/50 cursor-not-allowed" : "text-muted-foreground hover:text-foreground"}`}
          >
            {isLogoutInProgress() ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <LogOut className="h-3.5 w-3.5" />
            )}
            {isLogoutInProgress() ? "Signing out…" : "Sign out"}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        {/* 3-Step Progress Indicator */}
        <div className="mb-8 flex justify-center" aria-label="Verification progress">
          <Stepper steps={DIGILOCKER_STEPS} current={currentStepperIndex} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="rounded-2xl border bg-card/75 p-6 shadow-elegant backdrop-blur-xl sm:p-8"
          style={{ borderColor: "var(--glass-border)" }}
        >
          {/* Card Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div
              className="grid h-12 w-12 shrink-0 place-items-center rounded-xl text-brand-foreground shadow-glow"
              style={{ background: "var(--gradient-brand)" }}
            >
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <p className="text-xs font-medium uppercase tracking-wider text-primary">
                Welcome, {employeeName}
              </p>
              <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                Complete your one-time document verification
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                This is a mandatory one-time step to activate full workspace access. Verification is
                completed securely through{" "}
                <strong className="font-medium text-foreground">DigiLocker</strong>, an official
                Government of India digital document wallet service.
              </p>
            </div>
          </div>

          {/* Live Status / API Error Alert */}
          <div aria-live="polite" className="mt-6">
            {error ? (
              <div
                role="alert"
                className="flex flex-col gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                  <div>
                    <p className="font-medium text-foreground">
                      Unable to reach verification service
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{error}</p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isLoading || isInitiating}
                  onClick={() => void fetchStatus()}
                  className="shrink-0 gap-1.5 self-start sm:self-center"
                >
                  {isLoading ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  Retry
                </Button>
              </div>
            ) : null}
          </div>

          {/* Documents Checklist Driven by Config Constant */}
          <section className="mt-6 space-y-3" aria-labelledby="documents-heading">
            <div className="flex items-center justify-between">
              <h2
                id="documents-heading"
                className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Documents to be verified
              </h2>
              <span className="text-xs text-muted-foreground">
                {DIGILOCKER_DOCUMENTS_CONFIG.filter((d) => d.required).length} required ·{" "}
                {DIGILOCKER_DOCUMENTS_CONFIG.filter((d) => !d.required).length} optional
              </span>
            </div>

            <div className="divide-y divide-border rounded-xl border border-border bg-background/50">
              {DIGILOCKER_DOCUMENTS_CONFIG.map((doc) => {
                const existing = docStatusMap.get(doc.id.toLowerCase());
                const badgeProps = getDocBadgeProps(existing?.status);

                return (
                  <div
                    key={doc.id}
                    className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded-lg border border-border bg-card p-2 text-muted-foreground">
                        {existing?.status === "VERIFIED" ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : existing?.status === "FAILED" ? (
                          <XCircle className="h-4 w-4 text-rose-500" />
                        ) : (
                          <FileCheck2 className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{doc.label}</span>
                          <Badge
                            variant={doc.required ? "secondary" : "outline"}
                            className="text-[10px] font-medium"
                          >
                            {doc.required ? "Required" : "Optional"}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{doc.description}</p>
                        {existing?.failureReason ? (
                          <p className="mt-1 text-xs text-rose-600 dark:text-rose-400">
                            Reason: {existing.failureReason}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {badgeProps ? (
                      <span
                        className={`inline-flex shrink-0 self-start rounded-full border px-2.5 py-0.5 text-[11px] font-medium sm:self-center ${badgeProps.className}`}
                      >
                        {badgeProps.label}
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Security & Privacy Assurance */}
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-border/80 bg-muted/30 p-3.5 text-xs text-muted-foreground">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <span className="font-medium text-foreground">Zero-credential handling:</span> You
              will sign in and grant consent directly on the official DigiLocker portal. OFC360
              never sees or stores your DigiLocker PIN, OTP, or unmasked Aadhaar number.
            </div>
          </div>

          {/* Mandatory Consent Checkbox */}
          <div
            className={`mt-6 rounded-xl border p-4 transition-colors ${
              consentError
                ? "border-destructive/60 bg-destructive/5"
                : "border-border bg-card/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                id="digilocker-consent"
                checked={consentChecked}
                onCheckedChange={(checked) => {
                  const isChecked = checked === true;
                  setConsentChecked(isChecked);
                  if (isChecked) setConsentError(null);
                }}
                className="mt-0.5"
              />
              <Label
                htmlFor="digilocker-consent"
                className="cursor-pointer select-none text-xs leading-relaxed text-muted-foreground"
              >
                {DIGILOCKER_CONSENT_NOTICE}
              </Label>
            </div>
            {consentError ? (
              <p className="mt-2 text-xs font-medium text-destructive">{consentError}</p>
            ) : null}
          </div>

          {/* Primary Action Footer */}
          <div className="mt-6 flex flex-col-reverse items-stretch justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <HelpCircle className="h-3.5 w-3.5 shrink-0" />
              <span>Need help?</span>
              <a
                href={`mailto:${DIGILOCKER_SUPPORT_CONTACT.email}?subject=DigiLocker%20Document%20Verification%20Support`}
                className="font-medium text-foreground underline-offset-4 hover:underline"
              >
                {DIGILOCKER_SUPPORT_CONTACT.label}
              </a>
            </div>

            <Button
              type="button"
              onClick={() => void handleStartDigiLocker()}
              disabled={isInitiating}
              className="gap-2 sm:w-auto cursor-pointer"
            >
              {isInitiating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Connecting to DigiLocker...
                </>
              ) : (
                <>
                  Verify with DigiLocker
                  <ExternalLink className="h-4 w-4" />
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </motion.div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Having trouble accessing DigiLocker? Reach out to{" "}
          <a
            href={`mailto:${DIGILOCKER_SUPPORT_CONTACT.email}`}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            {DIGILOCKER_SUPPORT_CONTACT.email}
          </a>{" "}
          or{" "}
          <Link
            to="/login"
            onClick={() => void logout({ redirect: true })}
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            sign in with a different account
          </Link>
          .
        </p>
      </main>
    </div>
  );
}

export default VerifyDocumentsPage;
