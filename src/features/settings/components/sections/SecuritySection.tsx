import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import QRCode from "qrcode";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Lock,
  QrCode,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
} from "lucide-react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useAurix } from "@/lib/aurix-store";
import { useCurrentRole } from "@/lib/use-current-role";
import {
  formatSecurityApiError,
  pickBoolean,
  pickNumber,
  pickString,
  pickStringArray,
  unwrapApiPayload,
} from "@/lib/security-errors";
import {
  useDisableMfaMutation,
  useEnableMfaMutation,
  useGetMfaStatusQuery,
  useVerifyMfaMutation,
} from "@/redux";
import type { MfaDisablePayload, MfaVerifyPayload } from "@/redux";

interface SecuritySectionProps {
  canEdit: boolean;
  onDirtyChange?: (isDirty: boolean) => void;
}

interface NormalizedMfaStatus {
  enabled: boolean;
  method?: string;
  phoneMasked?: string;
  backupCodesRemaining?: number;
  requiresPasswordOnDisable?: boolean;
  requiresCodeOnDisable?: boolean;
}

interface NormalizedMfaSetup {
  qrCodeUrl?: string;
  otpauthUrl?: string;
  secret?: string;
  backupCodes?: string[];
  instructions?: string;
}

function normalizeMfaStatus(rawResponse: unknown): NormalizedMfaStatus {
  const payload = unwrapApiPayload<Record<string, unknown>>(rawResponse);
  if (!payload) return { enabled: false };

  return {
    enabled:
      pickBoolean(
        payload,
        "enabled",
        "mfa_enabled",
        "mfaEnabled",
        "is_enabled",
        "isEnabled",
        "twoFactorEnabled",
        "two_factor_enabled",
      ) ?? false,
    method: pickString(payload, "method", "mfa_method", "mfaMethod", "type"),
    phoneMasked: pickString(payload, "phoneMasked", "phone_masked"),
    backupCodesRemaining: pickNumber(
      payload,
      "backupCodesRemaining",
      "backup_codes_remaining",
      "recoveryCodesRemaining",
      "recovery_codes_remaining",
    ),
    requiresPasswordOnDisable: pickBoolean(
      payload,
      "requiresPasswordOnDisable",
      "requires_password_on_disable",
      "requiresPassword",
      "requires_password",
    ),
    requiresCodeOnDisable: pickBoolean(
      payload,
      "requiresCodeOnDisable",
      "requires_code_on_disable",
      "requiresCode",
      "requires_code",
      "requiresOtp",
      "requires_otp",
    ),
  };
}

function normalizeMfaSetup(rawResponse: unknown): NormalizedMfaSetup {
  const payload = unwrapApiPayload<Record<string, unknown>>(rawResponse);
  if (!payload) return {};

  const rawQr = pickString(
    payload,
    "qrCodeUrl",
    "qr_code_url",
    "qrCode",
    "qr_code",
    "qrImageUrl",
    "qr_image_url",
  );
  const rawOtpauth = pickString(
    payload,
    "otpauthUrl",
    "otpauth_url",
    "provisioningUri",
    "provisioning_uri",
    "totpUri",
    "totp_uri",
    "uri",
  );

  // Some backends place an otpauth:// URI inside qrCodeUrl directly
  const otpauthUrl =
    rawOtpauth ?? (rawQr && rawQr.startsWith("otpauth://") ? rawQr : undefined);
  const qrCodeUrl = rawQr && !rawQr.startsWith("otpauth://") ? rawQr : undefined;

  return {
    qrCodeUrl,
    otpauthUrl,
    secret: pickString(
      payload,
      "secret",
      "manualSetupKey",
      "manual_setup_key",
      "manualKey",
      "manual_key",
      "secretKey",
      "secret_key",
      "totpSecret",
      "totp_secret",
    ),
    backupCodes: pickStringArray(
      payload,
      "backupCodes",
      "backup_codes",
      "recoveryCodes",
      "recovery_codes",
    ),
    instructions: pickString(
      payload,
      "instructions",
      "setupInstructions",
      "setup_instructions",
      "message",
    ),
  };
}

export function SecuritySection({ canEdit, onDirtyChange }: SecuritySectionProps) {
  const ws = useAurix();
  const currentRole = useCurrentRole();

  const {
    data: mfaStatusRaw,
    isLoading: isStatusLoading,
    isFetching: isStatusFetching,
    isError: isStatusError,
    error: statusError,
    refetch: refetchMfaStatus,
  } = useGetMfaStatusQuery();

  const [enableMfa, { isLoading: isEnabling }] = useEnableMfaMutation();
  const [verifyMfa, { isLoading: isVerifying }] = useVerifyMfaMutation();
  const [disableMfa, { isLoading: isDisabling }] = useDisableMfaMutation();

  // Sensitive dialog states — strictly kept in ephemeral component state, never logged or persisted
  const [enableDialogOpen, setEnableDialogOpen] = useState(false);
  const [setupData, setSetupData] = useState<NormalizedMfaSetup | null>(null);
  const [qrImageSrc, setQrImageSrc] = useState<string>("");
  const [qrGenerating, setQrGenerating] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [enableStepError, setEnableStepError] = useState<string | null>(null);
  const [otpFieldError, setOtpFieldError] = useState<string | null>(null);
  const [verifiedRecoveryCodes, setVerifiedRecoveryCodes] = useState<string[] | null>(null);
  const [copiedRecoveryCodes, setCopiedRecoveryCodes] = useState(false);

  // Disable MFA confirmation state
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [showDisablePassword, setShowDisablePassword] = useState(false);
  const [requirePasswordInput, setRequirePasswordInput] = useState(false);
  const [requireCodeInput, setRequireCodeInput] = useState(false);
  const [disableError, setDisableError] = useState<string | null>(null);
  const [disableFieldErrors, setDisableFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    onDirtyChange?.(false);
  }, [onDirtyChange]);

  const mfaStatus = useMemo(() => normalizeMfaStatus(mfaStatusRaw), [mfaStatusRaw]);
  const parsedStatusError = useMemo(
    () => (isStatusError ? formatSecurityApiError(statusError, "Unable to fetch MFA status.") : null),
    [isStatusError, statusError],
  );

  const clearEnableDialogState = useCallback(() => {
    setSetupData(null);
    setQrImageSrc("");
    setQrGenerating(false);
    setShowSecret(false);
    setCopiedSecret(false);
    setVerificationCode("");
    setEnableStepError(null);
    setOtpFieldError(null);
    setVerifiedRecoveryCodes(null);
    setCopiedRecoveryCodes(false);
  }, []);

  const clearDisableDialogState = useCallback(() => {
    setDisablePassword("");
    setDisableCode("");
    setShowDisablePassword(false);
    setRequirePasswordInput(false);
    setRequireCodeInput(false);
    setDisableError(null);
    setDisableFieldErrors({});
  }, []);

  // Ensure sensitive in-memory setup state is purged on unmount
  useEffect(() => {
    return () => {
      clearEnableDialogState();
      clearDisableDialogState();
    };
  }, [clearEnableDialogState, clearDisableDialogState]);

  const renderQrFromSetup = useCallback(async (setup: NormalizedMfaSetup) => {
    if (setup.qrCodeUrl) {
      setQrImageSrc(setup.qrCodeUrl);
      return;
    }
    if (setup.otpauthUrl) {
      setQrGenerating(true);
      try {
        const dataUrl = await QRCode.toDataURL(setup.otpauthUrl, {
          width: 240,
          margin: 2,
          errorCorrectionLevel: "M",
        });
        setQrImageSrc(dataUrl);
      } catch {
        setQrImageSrc("");
      } finally {
        setQrGenerating(false);
      }
      return;
    }
    setQrImageSrc("");
  }, []);

  const initiateEnableMfa = useCallback(async () => {
    if (!canEdit || isEnabling) return;
    setEnableStepError(null);
    setOtpFieldError(null);
    setVerifiedRecoveryCodes(null);

    try {
      const response = await enableMfa().unwrap();
      const normalized = normalizeMfaSetup(response);
      setSetupData(normalized);
      await renderQrFromSetup(normalized);
    } catch (err) {
      const formatted = formatSecurityApiError(err, "Unable to initialize MFA setup.");
      setEnableStepError(formatted.message);
    }
  }, [canEdit, enableMfa, isEnabling, renderQrFromSetup]);

  const handleOpenEnableDialog = () => {
    if (!canEdit || isEnabling) return;
    clearEnableDialogState();
    setEnableDialogOpen(true);
    void initiateEnableMfa();
  };

  const handleEnableDialogOpenChange = (open: boolean) => {
    if (!open && isVerifying) return;
    setEnableDialogOpen(open);
    if (!open) {
      clearEnableDialogState();
    }
  };

  const handleCopyManualKey = async () => {
    if (!setupData?.secret) return;
    try {
      await navigator.clipboard.writeText(setupData.secret);
      setCopiedSecret(true);
      toast.success("Setup key copied to clipboard.");
      setTimeout(() => setCopiedSecret(false), 2000);
    } catch {
      toast.error("Unable to access clipboard. Please copy the key manually.");
    }
  };

  const handleVerifyMfa = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isVerifying) return;

    const cleanCode = verificationCode.replace(/\s+/g, "");
    if (!/^\d{6,8}$/.test(cleanCode)) {
      setOtpFieldError("Enter a valid 6-digit verification code from your authenticator app.");
      return;
    }

    setOtpFieldError(null);
    setEnableStepError(null);

    try {
      const payload: MfaVerifyPayload = {
        code: cleanCode,
        ...(setupData?.secret ? { secret: setupData.secret } : {}),
      };
      const verifyRes = await verifyMfa(payload).unwrap();
      const verifyBody = unwrapApiPayload<Record<string, unknown>>(verifyRes) ?? {};
      const verifyExplicitFalse =
        pickBoolean(verifyBody, "verified", "success") === false;

      if (verifyExplicitFalse) {
        setOtpFieldError(
          pickString(verifyBody, "message") || "Verification failed. Please check the code and retry.",
        );
        return;
      }

      // Never assume MFA is active from verify response alone — refresh authoritative status
      let confirmedEnabled = false;
      try {
        const refreshed = await refetchMfaStatus().unwrap();
        confirmedEnabled = normalizeMfaStatus(refreshed).enabled;
      } catch {
        confirmedEnabled = false;
      }

      const codesFromVerify = pickStringArray(
        verifyBody,
        "backupCodes",
        "backup_codes",
        "recoveryCodes",
        "recovery_codes",
      );
      const recoveryCodes = codesFromVerify ?? setupData?.backupCodes ?? null;

      toast.success(
        confirmedEnabled
          ? "Multi-factor authentication is now enabled."
          : pickString(verifyBody, "message") || "Verification submitted. Confirming MFA status.",
      );

      if (recoveryCodes && recoveryCodes.length > 0) {
        setVerifiedRecoveryCodes(recoveryCodes);
        setSetupData(null);
        setVerificationCode("");
      } else {
        setEnableDialogOpen(false);
        clearEnableDialogState();
      }
    } catch (err) {
      const formatted = formatSecurityApiError(err, "Invalid or expired verification code.");
      const mappedCodeErr =
        formatted.fieldErrors.code ||
        formatted.fieldErrors.otp ||
        formatted.fieldErrors.token;

      if (mappedCodeErr) {
        setOtpFieldError(mappedCodeErr);
      } else if (formatted.status === 400 || formatted.status === 401 || formatted.status === 422) {
        setOtpFieldError(formatted.message);
      } else {
        setEnableStepError(formatted.message);
      }
    }
  };

  const handleCopyRecoveryCodes = async () => {
    if (!verifiedRecoveryCodes?.length) return;
    try {
      await navigator.clipboard.writeText(verifiedRecoveryCodes.join("\n"));
      setCopiedRecoveryCodes(true);
      toast.success("Recovery codes copied to clipboard.");
      setTimeout(() => setCopiedRecoveryCodes(false), 2000);
    } catch {
      toast.error("Unable to copy recovery codes. Please save them manually.");
    }
  };

  const handleDownloadRecoveryCodes = () => {
    if (!verifiedRecoveryCodes?.length || typeof window === "undefined") return;
    const text = [
      "OFC360 MFA Backup Recovery Codes",
      `Account: ${ws.user?.email || "Authenticated User"}`,
      "",
      ...verifiedRecoveryCodes,
      "",
      "Store these single-use recovery codes securely offline.",
    ].join("\n");
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "ofc360-mfa-recovery-codes.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenDisableDialog = () => {
    if (!canEdit || isDisabling) return;
    clearDisableDialogState();
    setRequirePasswordInput(Boolean(mfaStatus.requiresPasswordOnDisable));
    setRequireCodeInput(Boolean(mfaStatus.requiresCodeOnDisable));
    setDisableDialogOpen(true);
  };

  const handleDisableDialogOpenChange = (open: boolean) => {
    if (!open && isDisabling) return;
    setDisableDialogOpen(open);
    if (!open) {
      clearDisableDialogState();
    }
  };

  const handleConfirmDisableMfa = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isDisabling) return;

    const errs: Record<string, string> = {};
    if (requirePasswordInput && !disablePassword.trim()) {
      errs.password = "Current password is required by security policy.";
    }
    if (requireCodeInput && !/^\d{6,8}$/.test(disableCode.trim())) {
      errs.code = "Enter a valid 6-digit verification code.";
    }
    setDisableFieldErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setDisableError(null);

    try {
      const payload: MfaDisablePayload = {};
      if (disablePassword.trim()) payload.password = disablePassword;
      if (disableCode.trim()) payload.code = disableCode.trim();

      const res = await disableMfa(Object.keys(payload).length > 0 ? payload : undefined).unwrap();
      await refetchMfaStatus().unwrap().catch(() => null);

      const resPayload = unwrapApiPayload<Record<string, unknown>>(res);
      const msg = (resPayload && pickString(resPayload, "message")) || "Multi-factor authentication has been disabled.";
      toast.success(msg);
      setDisableDialogOpen(false);
      clearDisableDialogState();
    } catch (err) {
      const formatted = formatSecurityApiError(err, "Failed to disable MFA.");
      const nextFieldErrors: Record<string, string> = {};

      if (formatted.fieldErrors.password) {
        setRequirePasswordInput(true);
        nextFieldErrors.password = formatted.fieldErrors.password;
      } else if (/password/i.test(formatted.message) && (formatted.status === 400 || formatted.status === 422)) {
        setRequirePasswordInput(true);
        nextFieldErrors.password = formatted.message;
      }

      const codeErr = formatted.fieldErrors.code || formatted.fieldErrors.otp;
      if (codeErr) {
        setRequireCodeInput(true);
        nextFieldErrors.code = codeErr;
      } else if (/(code|otp|totp)/i.test(formatted.message) && (formatted.status === 400 || formatted.status === 422)) {
        setRequireCodeInput(true);
        nextFieldErrors.code = formatted.message;
      }

      setDisableFieldErrors(nextFieldErrors);
      setDisableError(formatted.message);
    }
  };

  if (isStatusLoading) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
          <Skeleton className="h-4 w-80" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 pt-2">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert if MFA status retrieval failed */}
      {isStatusError && parsedStatusError && (
        <Alert variant="destructive" className="rounded-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle className="text-sm font-semibold">{parsedStatusError.title}</AlertTitle>
          <AlertDescription className="mt-2 flex flex-col gap-3 text-xs sm:flex-row sm:items-center sm:justify-between">
            <span>{parsedStatusError.message}</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void refetchMfaStatus()}
              disabled={isStatusFetching}
              className="h-8 shrink-0 gap-1.5 text-xs cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isStatusFetching ? "animate-spin" : ""}`} />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Multi-Factor Authentication Status & Controls Card */}
      <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-xl shadow-xs space-y-6">
        <div className="flex flex-col gap-4 border-b border-border/60 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3.5">
            <div
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl border ${
                mfaStatus.enabled
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
              }`}
            >
              {mfaStatus.enabled ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <Shield className="h-5 w-5" />
              )}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-base font-semibold tracking-tight text-foreground">
                  Multi-Factor Authentication (MFA)
                </h3>
                <Badge
                  variant="outline"
                  className={
                    isStatusError
                      ? "border-border text-muted-foreground bg-muted/40"
                      : mfaStatus.enabled
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                        : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                  }
                >
                  <span
                    className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                      isStatusError
                        ? "bg-muted-foreground"
                        : mfaStatus.enabled
                          ? "bg-emerald-500"
                          : "bg-amber-500"
                    }`}
                  />
                  {isStatusError ? "Status Unavailable" : mfaStatus.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Require a time-based one-time verification code (TOTP) in addition to your password when signing in to OFC360.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => void refetchMfaStatus()}
              disabled={isStatusFetching}
              className="h-8 gap-1.5 text-xs cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isStatusFetching ? "animate-spin" : ""}`} />
              Refresh Status
            </Button>
            {canEdit && !isStatusError && (
              mfaStatus.enabled ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={handleOpenDisableDialog}
                  disabled={isDisabling}
                  className="h-8 gap-1.5 text-xs cursor-pointer"
                >
                  <ShieldAlert className="h-3.5 w-3.5" />
                  Disable MFA
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={handleOpenEnableDialog}
                  disabled={isEnabling}
                  className="h-8 gap-1.5 text-xs cursor-pointer"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Enable MFA
                </Button>
              )
            )}
          </div>
        </div>

        {/* Status Details Grid (Strictly backend-provided fields) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-background/40 p-4 space-y-1">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Protection Status
            </div>
            <div className="text-sm font-semibold text-foreground">
              {isStatusError
                ? "Unknown (API Error)"
                : mfaStatus.enabled
                  ? "Two-Step Verification Active"
                  : "Single-Factor Password Only"}
            </div>
            <p className="text-[11px] text-muted-foreground">
              {mfaStatus.enabled
                ? "Verified authenticator protection is active on your account."
                : "Enable MFA to protect against compromised credentials."}
            </p>
          </div>

          <div className="rounded-xl border border-border/60 bg-background/40 p-4 space-y-1">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Verification Method
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Smartphone className="h-4 w-4 text-primary shrink-0" />
              <span className="uppercase">
                {mfaStatus.method || (mfaStatus.enabled ? "Authenticator App" : "Not configured")}
              </span>
            </div>
            {mfaStatus.phoneMasked ? (
              <p className="text-[11px] text-muted-foreground font-mono">{mfaStatus.phoneMasked}</p>
            ) : (
              <p className="text-[11px] text-muted-foreground">
                Supports standard authenticator apps (Google Authenticator, Authy, 1Password).
              </p>
            )}
          </div>

          <div className="rounded-xl border border-border/60 bg-background/40 p-4 space-y-1">
            <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Backup Recovery Codes
            </div>
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <KeyRound className="h-4 w-4 text-primary shrink-0" />
              <span>
                {typeof mfaStatus.backupCodesRemaining === "number"
                  ? `${mfaStatus.backupCodesRemaining} remaining`
                  : mfaStatus.enabled
                    ? "Issued during enrollment"
                    : "Generated upon setup"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Recovery codes let you sign in if you lose access to your authenticator device.
            </p>
          </div>
        </div>

        {/* Setup Guide / Security Information */}
        <div className="rounded-xl border border-border/60 bg-muted/25 p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Lock className="h-3.5 w-3.5 text-primary shrink-0" />
            <span>How Multi-Factor Authentication Works</span>
          </div>
          <ol className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-3">
            <li className="rounded-lg border border-border/40 bg-card/50 p-3">
              <span className="font-semibold text-foreground">1. Link Authenticator App</span>
              <p className="mt-1 text-[11px] leading-relaxed">
                Click Enable MFA to receive your account setup QR code or manual key from the server.
              </p>
            </li>
            <li className="rounded-lg border border-border/40 bg-card/50 p-3">
              <span className="font-semibold text-foreground">2. Confirm with 6-Digit Code</span>
              <p className="mt-1 text-[11px] leading-relaxed">
                Enter the generated OTP code to verify device time sync before MFA becomes active.
              </p>
            </li>
            <li className="rounded-lg border border-border/40 bg-card/50 p-3">
              <span className="font-semibold text-foreground">3. Save Backup Codes</span>
              <p className="mt-1 text-[11px] leading-relaxed">
                If recovery codes are provided during enrollment, store them safely offline.
              </p>
            </li>
          </ol>
        </div>

        {/* Quick Account Security Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
          <div className="text-xs text-muted-foreground">
            Signed in as <span className="font-medium text-foreground">{ws.user?.email || "Current User"}</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
              <Link to="/dashboard/settings/profile">
                Password & Credentials
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            {currentRole === "hr_admin" && (
              <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <Link to="/dashboard/payroll/settings/security">
                  Payroll Active Sessions
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
            {currentRole === "super_admin" && (
              <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                <Link to="/dashboard/super-admin/security">
                  Platform Security Sessions
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Enable MFA Secure Setup Dialog ───────────────────────────────────── */}
      <Dialog open={enableDialogOpen} onOpenChange={handleEnableDialogOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold">
              <ShieldCheck className="h-4 w-4 text-primary" />
              {verifiedRecoveryCodes ? "Save MFA Backup Recovery Codes" : "Set Up Multi-Factor Authentication"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {verifiedRecoveryCodes
                ? "Your authenticator is verified. Store these single-use backup recovery codes in a safe place."
                : "Scan the QR code or enter the manual setup key in your authenticator app, then verify a generated code."}
            </DialogDescription>
          </DialogHeader>

          {verifiedRecoveryCodes ? (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>MFA has been verified and activated on your account.</span>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-semibold text-foreground">
                  Recovery Codes ({verifiedRecoveryCodes.length})
                </Label>
                <div className="grid grid-cols-2 gap-2 rounded-xl border border-border bg-muted/30 p-3 font-mono text-xs">
                  {verifiedRecoveryCodes.map((code, idx) => (
                    <div
                      key={`${code}-${idx}`}
                      className="rounded-md border border-border/60 bg-background px-2.5 py-1.5 text-center text-foreground"
                    >
                      {code}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => void handleCopyRecoveryCodes()}
                  className="h-8 gap-1.5 text-xs cursor-pointer"
                >
                  {copiedRecoveryCodes ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedRecoveryCodes ? "Copied" : "Copy Codes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleDownloadRecoveryCodes}
                  className="h-8 gap-1.5 text-xs cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download .txt
                </Button>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleEnableDialogOpenChange(false)}
                  className="h-8 text-xs cursor-pointer"
                >
                  Done
                </Button>
              </DialogFooter>
            </div>
          ) : (
            <form onSubmit={(e) => void handleVerifyMfa(e)} className="space-y-4 py-1">
              {isEnabling ? (
                <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  <p className="text-xs text-muted-foreground">
                    Generating secure authenticator enrollment credentials…
                  </p>
                </div>
              ) : enableStepError && !setupData ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="text-xs font-semibold">Setup Initialization Failed</AlertTitle>
                  <AlertDescription className="mt-1 space-y-3 text-xs">
                    <p>{enableStepError}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void initiateEnableMfa()}
                      className="h-7 gap-1.5 text-xs cursor-pointer"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Try Again
                    </Button>
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  {setupData?.instructions && (
                    <p className="rounded-xl border border-border/60 bg-muted/30 px-3.5 py-2.5 text-xs text-muted-foreground">
                      {setupData.instructions}
                    </p>
                  )}

                  {/* QR Code Display (if backend provides QR image URL or otpauth:// URI) */}
                  {(qrImageSrc || qrGenerating) && (
                    <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-muted/20 p-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                        <QrCode className="h-3.5 w-3.5 text-primary" />
                        <span>Scan with Authenticator App</span>
                      </div>
                      {qrGenerating ? (
                        <Skeleton className="h-44 w-44 rounded-lg" />
                      ) : (
                        <div className="rounded-lg bg-white p-2.5 shadow-xs">
                          <img
                            src={qrImageSrc}
                            alt="MFA Authenticator QR Code"
                            className="h-40 w-40 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Manual Setup Key (if backend provides secret) */}
                  {setupData?.secret && (
                    <div className="space-y-1.5 rounded-xl border border-border/60 bg-background/50 p-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <Label className="text-xs font-medium text-foreground">Manual Setup Key</Label>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowSecret((prev) => !prev)}
                            className="h-7 px-2 text-xs text-muted-foreground cursor-pointer"
                            aria-label={showSecret ? "Hide setup key" : "Show setup key"}
                          >
                            {showSecret ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => void handleCopyManualKey()}
                            className="h-7 gap-1 px-2 text-xs cursor-pointer"
                          >
                            {copiedSecret ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copiedSecret ? "Copied" : "Copy"}
                          </Button>
                        </div>
                      </div>
                      <div className="break-all rounded-md border border-border/60 bg-muted/40 px-3 py-2 font-mono text-xs text-foreground">
                        {showSecret ? setupData.secret : "•".repeat(Math.min(setupData.secret.length, 24))}
                      </div>
                    </div>
                  )}

                  {/* Pre-verification backup codes if returned early by enable endpoint */}
                  {setupData?.backupCodes && setupData.backupCodes.length > 0 && (
                    <div className="space-y-1.5 rounded-xl border border-border/60 bg-muted/20 p-3">
                      <Label className="text-xs font-medium text-foreground">
                        Recovery Codes (Also shown after verification)
                      </Label>
                      <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] text-muted-foreground">
                        {setupData.backupCodes.map((code, idx) => (
                          <div key={`${code}-${idx}`} className="rounded bg-background/70 px-2 py-1 text-center">
                            {code}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* OTP Verification Input */}
                  <div className="space-y-2 pt-1">
                    <Label htmlFor="mfa-verify-otp" className="text-xs font-medium text-foreground">
                      Verification Code (6 digits)
                    </Label>
                    <div className="flex flex-col items-center gap-2 sm:items-start">
                      <InputOTP
                        id="mfa-verify-otp"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(val) => {
                          setVerificationCode(val.replace(/\D/g, ""));
                          if (otpFieldError) setOtpFieldError(null);
                        }}
                        disabled={isVerifying}
                      >
                        <InputOTPGroup>
                          {[0, 1, 2, 3, 4, 5].map((idx) => (
                            <InputOTPSlot key={idx} index={idx} className="h-10 w-10 text-sm font-mono" />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                      {otpFieldError && (
                        <p role="alert" className="text-[11px] text-destructive">
                          {otpFieldError}
                        </p>
                      )}
                      {enableStepError && (
                        <p role="alert" className="text-[11px] text-destructive">
                          {enableStepError}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}

              <DialogFooter className="gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleEnableDialogOpenChange(false)}
                  disabled={isVerifying}
                  className="h-8 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={
                    isEnabling ||
                    isVerifying ||
                    (Boolean(enableStepError) && !setupData) ||
                    verificationCode.trim().length < 6
                  }
                  className="h-8 gap-1.5 text-xs cursor-pointer"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Verifying…
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Verify & Enable
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Disable MFA Confirmation Dialog ──────────────────────────────────── */}
      <Dialog open={disableDialogOpen} onOpenChange={handleDisableDialogOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Disable Multi-Factor Authentication
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Disabling MFA removes two-step verification from your account and reduces protection against unauthorized sign-ins.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={(e) => void handleConfirmDisableMfa(e)} className="space-y-4 py-1">
            {requirePasswordInput && (
              <div className="space-y-1.5">
                <Label htmlFor="disable-mfa-password" className="text-xs font-medium">
                  Current Password
                </Label>
                <div className="relative">
                  <Input
                    id="disable-mfa-password"
                    type={showDisablePassword ? "text" : "password"}
                    value={disablePassword}
                    onChange={(e) => {
                      setDisablePassword(e.target.value);
                      if (disableFieldErrors.password) {
                        setDisableFieldErrors((prev) => ({ ...prev, password: "" }));
                      }
                    }}
                    autoComplete="current-password"
                    placeholder="Enter your account password"
                    disabled={isDisabling}
                    className={`pr-9 text-xs ${disableFieldErrors.password ? "border-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowDisablePassword((prev) => !prev)}
                    className="absolute right-2.5 top-2 text-muted-foreground hover:text-foreground cursor-pointer"
                    aria-label={showDisablePassword ? "Hide password" : "Show password"}
                  >
                    {showDisablePassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {disableFieldErrors.password && (
                  <p className="text-[11px] text-destructive">{disableFieldErrors.password}</p>
                )}
              </div>
            )}

            {requireCodeInput && (
              <div className="space-y-1.5">
                <Label htmlFor="disable-mfa-code" className="text-xs font-medium">
                  Authenticator Verification Code
                </Label>
                <Input
                  id="disable-mfa-code"
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  value={disableCode}
                  onChange={(e) => {
                    setDisableCode(e.target.value.replace(/\D/g, ""));
                    if (disableFieldErrors.code) {
                      setDisableFieldErrors((prev) => ({ ...prev, code: "" }));
                    }
                  }}
                  placeholder="Enter 6-digit verification code"
                  disabled={isDisabling}
                  className={`font-mono text-xs ${disableFieldErrors.code ? "border-destructive" : ""}`}
                />
                {disableFieldErrors.code && (
                  <p className="text-[11px] text-destructive">{disableFieldErrors.code}</p>
                )}
              </div>
            )}

            {disableError && (
              <Alert variant="destructive" className="py-2.5">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">{disableError}</AlertDescription>
              </Alert>
            )}

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDisableDialogOpenChange(false)}
                disabled={isDisabling}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="destructive"
                size="sm"
                disabled={isDisabling}
                className="h-8 gap-1.5 text-xs cursor-pointer"
              >
                {isDisabling ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Disabling…
                  </>
                ) : (
                  <>
                    <ShieldAlert className="h-3.5 w-3.5" />
                    Confirm Disable MFA
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default SecuritySection;
