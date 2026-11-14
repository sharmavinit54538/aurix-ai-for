import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { AuthLoadingScreen } from "@/features/auth/components/AuthLoadingScreen";
import { syncVerifiedStatusToStore } from "@/hooks/useDocumentVerification";
import { useAurix } from "@/lib/aurix-store";
import { useAuthReady } from "@/lib/auth-bootstrap";
import { useCurrentRole } from "@/lib/use-current-role";
import {
  documentVerificationApi,
  isDigiLockerVerificationEnabled,
} from "@/services/documentVerificationApi";

interface DocumentVerificationGuardProps {
  children: ReactNode;
}

/**
 * Reusable route protection wrapper for employee document verification.
 *
 * Behaviour:
 * - Non-employee roles (hr_admin, manager, super_admin, executive, it_admin, recruiter)
 *   pass through immediately without any check.
 * - If VITE_ENABLE_DIGILOCKER_VERIFICATION is disabled, passes through immediately.
 * - If the employee is already marked VERIFIED in memory, renders children immediately.
 * - Otherwise queries GET /employee/document-verification/status and redirects unverified
 *   employees to /verify-documents without hanging on the loading screen.
 */
export function DocumentVerificationGuard({ children }: DocumentVerificationGuardProps) {
  const ws = useAurix();
  const authReady = useAuthReady();
  const currentRole = useCurrentRole();
  const navigate = useNavigate();
  const location = useRouterState({ select: (s) => s.location });

  const featureEnabled = isDigiLockerVerificationEnabled();
  const isEmployeeRole = currentRole === "employee" || ws.user?.role === "employee";
  const isAlreadyVerified =
    ws.user?.documentVerificationStatus === "VERIFIED" || ws.user?.documentsVerified === true;

  const [checking, setChecking] = useState<boolean>(
    Boolean(featureEnabled && isEmployeeRole && !isAlreadyVerified),
  );

  useEffect(() => {
    if (!authReady || ws.isRestoring) return;

    if (!featureEnabled || !ws.user || !isEmployeeRole || isAlreadyVerified) {
      setChecking(false);
      return;
    }

    const redirectTarget = `${location.pathname}${location.searchStr || ""}`;

    // If status was already checked in memory and is not VERIFIED, redirect immediately
    if (
      ws.user.documentVerificationStatus &&
      ws.user.documentVerificationStatus !== "VERIFIED"
    ) {
      setChecking(false);
      navigate({
        to: "/verify-documents" as any,
        search: (redirectTarget && !redirectTarget.startsWith("/verify-documents")
          ? { redirect: redirectTarget }
          : undefined) as any,
        replace: true,
      });
      return;
    }

    let cancelled = false;
    setChecking(true);

    (async () => {
      try {
        const res = await documentVerificationApi.getStatus();
        if (cancelled) return;
        syncVerifiedStatusToStore(res.status, res.verifiedAt);

        if (res.status === "VERIFIED") {
          setChecking(false);
          return;
        }

        setChecking(false);
        navigate({
          to: "/verify-documents" as any,
          search: (redirectTarget && !redirectTarget.startsWith("/verify-documents")
            ? { redirect: redirectTarget }
            : undefined) as any,
          replace: true,
        });
      } catch {
        if (cancelled) return;
        syncVerifiedStatusToStore("NOT_STARTED");
        setChecking(false);
        navigate({
          to: "/verify-documents" as any,
          search: (redirectTarget && !redirectTarget.startsWith("/verify-documents")
            ? { redirect: redirectTarget }
            : undefined) as any,
          replace: true,
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    authReady,
    ws.isRestoring,
    ws.user,
    featureEnabled,
    isEmployeeRole,
    isAlreadyVerified,
    location.pathname,
    location.searchStr,
    navigate,
  ]);

  if (!featureEnabled || !isEmployeeRole || isAlreadyVerified) {
    return <>{children}</>;
  }

  if (checking) {
    return <AuthLoadingScreen />;
  }

  return null;
}
