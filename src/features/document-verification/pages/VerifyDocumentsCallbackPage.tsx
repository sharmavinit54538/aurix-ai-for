import { useNavigate, useSearch } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileWarning,
  HelpCircle,
  Loader2,
  LogOut,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { hasValidAccessToken } from "@/api";
import { Stepper } from "@/components/aurix/Stepper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DIGILOCKER_DOCUMENTS_CONFIG,
  DIGILOCKER_STEPS,
  DIGILOCKER_SUPPORT_CONTACT,
} from "@/features/document-verification/config";
import { useDocumentVerification } from "@/hooks/useDocumentVerification";
import { useAurix } from "@/lib/aurix-store";
import { logout, useAuthReady } from "@/lib/auth-bootstrap";
import { getSafeRedirectUrl } from "@/lib/role-routing";
import type {
  DocumentItemVerificationStatus,
  VerifiedDocumentStatusItem,
} from "@/services/documentVerificationApi";

type CallbackOutcome =
  | "verifying"
  | "success"
  | "partial_or_failed"
  | "cancelled"
  | "expired_or_invalid"
  | "network_error";

interface TransientCallbackParams {
  code: string | null;
  state: string | null;
  error: string | null;
  errorDescription: string | null;
}

function formatItemStatusLabel(status: DocumentItemVerificationStatus): string {
  switch (status) {
    case "VERIFIED":
      return "Verified";
    case "FAILED":
      return "Failed";
    case "NOT_AVAILABLE":
      return "Not available";
    default:
      return "Pending";
  }
}

function getItemStatusStyle(status: DocumentItemVerificationStatus): string {
  switch (status) {
    case "VERIFIED":
      return "border-emerald-500/30 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400";
    case "FAILED":
      return "border-rose-500/30 bg-rose-500/15 text-rose-600 dark:text-rose-400";
    case "NOT_AVAILABLE":
      return "border-amber-500/30 bg-amber-500/15 text-amber-600 dark:text-amber-400";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

function getPlainLanguageReason(
  status: DocumentItemVerificationStatus,
  failureReason?: string,
  required?: boolean,
): string {
  if (failureReason && failureReason.trim()) {
    return failureReason.trim();
  }
  if (status === "VERIFIED") {
    return "Authentic digital record verified via DigiLocker.";
  }
  if (status === "NOT_AVAILABLE") {
    return required
      ? "This required document was not found or shared in your DigiLocker account."
      : "Optional document was not provided during this session.";
  }
  if (status === "FAILED") {
    return "Document details could not be validated or did not match your employee profile.";
  }
  return "Verification pending.";
}

export function VerifyDocumentsCallbackPage() {
  const navigate = useNavigate();
  const routerSearch = useSearch({ strict: false }) as Record<string, string | undefined>;
  const ws = useAurix();
  const authReady = useAuthReady();
  const { completeVerification, documents, error: apiError } = useDocumentVerification();

  const [outcome, setOutcome] = useState<CallbackOutcome>("verifying");
  const [outcomeMessage, setOutcomeMessage] = useState<string>("");
  const [resultDocuments, setResultDocuments] = useState<VerifiedDocumentStatusItem[]>([]);

  // Hold code/state strictly in component memory for same-mount retry only; never persist.
  const transientParamsRef = useRef<TransientCallbackParams | null>(null);
  const processedRef = useRef(false);

  const destinationPath = useMemo(() => {
    let savedRedirect: string | null = null;
    if (typeof window !== "undefined") {
      try {
        savedRedirect = window.sessionStorage?.getItem("ofc360_post_verification_redirect");
      } catch {
        savedRedirect = null;
      }
    }
    return getSafeRedirectUrl(savedRedirect, ws.user);
  }, [ws.user]);

  const executeCallbackExchange = useCallback(
    async (code: string, state: string) => {
      setOutcome("verifying");
      setOutcomeMessage("");

      const result = await completeVerification({ code, state });
      if (!result) {
        setOutcome("network_error");
        return;
      }

      setResultDocuments(result.documents || []);

      if (result.status === "VERIFIED") {
        // Clear transient code/state from memory once verified
        transientParamsRef.current = null;
        if (typeof window !== "undefined") {
          try {
            window.sessionStorage?.removeItem("ofc360_post_verification_redirect");
          } catch {
            /* ignore */
          }
        }
        setOutcome("success");
        return;
      }

      setOutcome("partial_or_failed");
    },
    [completeVerification],
  );

  useEffect(() => {
    if (!authReady || ws.isRestoring) return;

    if (!ws.user && !hasValidAccessToken()) {
      navigate({ to: "/login" as any, replace: true });
      return;
    }

    if (processedRef.current) return;
    processedRef.current = true;

    if (typeof window === "undefined") return;

    const rawSearch = window.location.search;
    const params = new URLSearchParams(rawSearch);
    const code = params.get("code") || routerSearch?.code || null;
    const state = params.get("state") || routerSearch?.state || null;
    const oauthError = params.get("error") || routerSearch?.error || null;
    const errorDescription =
      params.get("error_description") || routerSearch?.error_description || null;

    // SECURITY: Immediately remove callback query parameters from the browser URL bar
    if (rawSearch || routerSearch?.code || routerSearch?.state || routerSearch?.error) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    transientParamsRef.current = {
      code,
      state,
      error: oauthError,
      errorDescription,
    };

    // 1. Handle user cancellation or OAuth errors from DigiLocker
    if (oauthError) {
      const normalizedErr = oauthError.toLowerCase();
      if (
        normalizedErr === "access_denied" ||
        normalizedErr === "user_cancelled" ||
        normalizedErr === "consent_denied"
      ) {
        setOutcome("cancelled");
        setOutcomeMessage(
          errorDescription ||
            "You cancelled the DigiLocker authorisation before sharing your documents.",
        );
        return;
      }

      if (
        normalizedErr === "invalid_state" ||
        normalizedErr === "expired_state" ||
        normalizedErr === "invalid_grant"
      ) {
        setOutcome("expired_or_invalid");
        setOutcomeMessage(
          errorDescription ||
            "Your DigiLocker verification session expired or the state token was invalid. Please start a fresh session.",
        );
        return;
      }

      setOutcome("expired_or_invalid");
      setOutcomeMessage(
        errorDescription || "DigiLocker returned an authorisation error. Please try again.",
      );
      return;
    }

    // 2. Handle page refresh or missing parameters (idempotent)
    if (!code || !state) {
      if (
        ws.user?.documentVerificationStatus === "VERIFIED" ||
        ws.user?.documentsVerified === true
      ) {
        setOutcome("success");
        return;
      }
      navigate({ to: "/verify-documents" as any, replace: true });
      return;
    }

    // 3. Complete verification via backend
    void executeCallbackExchange(code, state);
  }, [authReady, ws.isRestoring, ws.user, navigate, executeCallbackExchange]);

  const mergedDocumentRows = useMemo(() => {
    const sourceDocs = resultDocuments.length > 0 ? resultDocuments : documents;
    const byId = new Map<string, VerifiedDocumentStatusItem>();
    sourceDocs.forEach((d) => byId.set(d.id.toLowerCase(), d));

    return DIGILOCKER_DOCUMENTS_CONFIG.map((cfg) => {
      const matched = byId.get(cfg.id.toLowerCase());
      const itemStatus: DocumentItemVerificationStatus = matched?.status ?? "NOT_AVAILABLE";
      return {
        id: cfg.id,
        label: cfg.label,
        required: cfg.required,
        status: itemStatus,
        reason: getPlainLanguageReason(itemStatus, matched?.failureReason, cfg.required),
      };
    });
  }, [resultDocuments, documents]);

  const employeeName = ws.user?.fullName || ws.user?.email || "Employee";
  const stepperIndex = outcome === "verifying" ? 1 : 2;

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{ background: "var(--gradient-hero)" }}
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
            onClick={() => void logout()}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
        {/* 3-Step Progress Indicator */}
        <div className="mb-8 flex justify-center" aria-label="Verification progress">
          <Stepper steps={DIGILOCKER_STEPS} current={stepperIndex} />
        </div>

        <motion.div
          key={outcome}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="rounded-2xl border bg-card/75 p-6 shadow-elegant backdrop-blur-xl sm:p-8"
          style={{ borderColor: "var(--glass-border)" }}
          aria-live="polite"
        >
          {/* STATE 1: Verifying in progress */}
          {outcome === "verifying" ? (
            <div className="py-10 text-center space-y-4">
              <div
                className="mx-auto grid h-14 w-14 place-items-center rounded-2xl text-brand-foreground shadow-glow"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Loader2 className="h-7 w-7 animate-spin" />
              </div>
              <h1 className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                Verifying your documents...
              </h1>
              <p className="mx-auto max-w-md text-sm text-muted-foreground">
                Please wait while we securely validate your DigiLocker records. Do not close or
                refresh this tab.
              </p>
            </div>
          ) : null}

          {/* STATE 2: Full Success */}
          {outcome === "success" ? (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified via DigiLocker
                </div>
                <h1 className="font-display text-2xl font-semibold tracking-tight">
                  Your documents are verified
                </h1>
                <p className="mx-auto max-w-md text-sm text-muted-foreground">
                  Thank you, {employeeName}. Your one-time statutory document verification is
                  complete and your employee profile is now active.
                </p>
              </div>

              {resultDocuments.length > 0 ? (
                <div className="divide-y divide-border rounded-xl border border-border bg-background/50">
                  {mergedDocumentRows.map((row) => (
                    <div
                      key={row.id}
                      className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
                    >
                      <div>
                        <span className="font-medium text-foreground">{row.label}</span>
                        <p className="text-xs text-muted-foreground">{row.reason}</p>
                      </div>
                      <span
                        className={`inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium ${getItemStatusStyle(row.status)}`}
                      >
                        {formatItemStatusLabel(row.status)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}

              <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
                <SupportContactFooter />
                <Button
                  type="button"
                  onClick={() => navigate({ to: destinationPath as any, replace: true })}
                  className="gap-2"
                >
                  Continue to dashboard
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}

          {/* STATE 3: Partial or Full Document Failure */}
          {outcome === "partial_or_failed" ? (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-500">
                  <FileWarning className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="font-display text-xl font-semibold tracking-tight">
                    Some required documents could not be verified
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Review the status of each document below. Ensure all required documents are
                    linked in your DigiLocker account and try again.
                  </p>
                </div>
              </div>

              <div className="divide-y divide-border rounded-xl border border-border bg-background/50">
                {mergedDocumentRows.map((row) => (
                  <div
                    key={row.id}
                    className="flex flex-col gap-2 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground">{row.label}</span>
                        <Badge
                          variant={row.required ? "secondary" : "outline"}
                          className="text-[10px]"
                        >
                          {row.required ? "Required" : "Optional"}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{row.reason}</p>
                    </div>
                    <span
                      className={`inline-flex shrink-0 self-start rounded-full border px-2.5 py-0.5 text-xs font-medium sm:self-center ${getItemStatusStyle(row.status)}`}
                    >
                      {formatItemStatusLabel(row.status)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
                <SupportContactFooter />
                <Button
                  type="button"
                  onClick={() => navigate({ to: "/verify-documents" as any, replace: true })}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try again
                </Button>
              </div>
            </div>
          ) : null}

          {/* STATE 4: User Cancelled / Access Denied */}
          {outcome === "cancelled" ? (
            <div className="space-y-6">
              <div className="text-center space-y-3 py-2">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-amber-500/30 bg-amber-500/15 text-amber-500">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h1 className="font-display text-xl font-semibold tracking-tight">
                  DigiLocker authorisation was cancelled
                </h1>
                <p className="mx-auto max-w-md text-sm text-muted-foreground">
                  {outcomeMessage ||
                    "No documents were shared. Whenever you are ready, click Try again to complete your one-time document verification."}
                </p>
              </div>

              <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
                <SupportContactFooter />
                <Button
                  type="button"
                  onClick={() => navigate({ to: "/verify-documents" as any, replace: true })}
                  className="gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Try again
                </Button>
              </div>
            </div>
          ) : null}

          {/* STATE 5: Expired / Invalid State or Network / Server Error */}
          {outcome === "expired_or_invalid" || outcome === "network_error" ? (
            <div className="space-y-6">
              <div className="text-center space-y-3 py-2">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-500">
                  <XCircle className="h-6 w-6" />
                </div>
                <h1 className="font-display text-xl font-semibold tracking-tight">
                  {outcome === "expired_or_invalid"
                    ? "Verification session expired or invalid"
                    : "Could not complete document verification"}
                </h1>
                <p className="mx-auto max-w-md text-sm text-muted-foreground">
                  {outcomeMessage ||
                    apiError ||
                    "We encountered an error communicating with the verification service. Please retry or start a fresh DigiLocker session."}
                </p>
              </div>

              <div className="flex flex-col-reverse items-stretch justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
                <SupportContactFooter />
                <div className="flex flex-wrap items-center justify-end gap-2">
                  {outcome === "network_error" &&
                  transientParamsRef.current?.code &&
                  transientParamsRef.current?.state ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const params = transientParamsRef.current;
                        if (params?.code && params?.state) {
                          void executeCallbackExchange(params.code, params.state);
                        }
                      }}
                      className="gap-1.5"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Retry
                    </Button>
                  ) : null}
                  <Button
                    type="button"
                    onClick={() => navigate({ to: "/verify-documents" as any, replace: true })}
                    className="gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Try again
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </main>
    </div>
  );
}

function SupportContactFooter() {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <HelpCircle className="h-3.5 w-3.5 shrink-0" />
      <span>Need help?</span>
      <a
        href={`mailto:${DIGILOCKER_SUPPORT_CONTACT.email}?subject=DigiLocker%20Verification%20Assistance`}
        className="font-medium text-foreground underline-offset-4 hover:underline"
      >
        {DIGILOCKER_SUPPORT_CONTACT.label}
      </a>
    </div>
  );
}

export default VerifyDocumentsCallbackPage;
