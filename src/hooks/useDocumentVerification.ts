import { useCallback, useRef, useState } from "react";
import { aurix } from "@/lib/aurix-store";
import {
  documentVerificationApi,
  type DigiLockerCallbackPayload,
  type DocumentVerificationOverallStatus,
  type DocumentVerificationStatusResponse,
  type VerifiedDocumentStatusItem,
} from "@/services/documentVerificationApi";

export function syncVerifiedStatusToStore(
  status: DocumentVerificationOverallStatus,
  verifiedAt?: string,
): void {
  const current = aurix.get().user;
  if (!current) return;
  aurix.set({
    user: {
      ...current,
      documentVerificationStatus: status,
      documentsVerified: status === "VERIFIED",
      ...(verifiedAt ? { documentsVerifiedAt: verifiedAt } : {}),
    },
  });
}

export interface UseDocumentVerificationResult {
  status: DocumentVerificationOverallStatus | null;
  documents: VerifiedDocumentStatusItem[];
  verifiedAt?: string;
  isLoading: boolean;
  isInitiating: boolean;
  isCompleting: boolean;
  error: string | null;
  fetchStatus: () => Promise<DocumentVerificationStatusResponse | null>;
  initiateVerification: () => Promise<string | null>;
  completeVerification: (
    payload: DigiLockerCallbackPayload,
  ) => Promise<DocumentVerificationStatusResponse | null>;
  clearError: () => void;
}

export function useDocumentVerification(): UseDocumentVerificationResult {
  const currentUser = aurix.get().user;
  const initialStatus: DocumentVerificationOverallStatus | null =
    currentUser?.documentVerificationStatus ??
    (currentUser?.documentsVerified ? "VERIFIED" : null);

  const [status, setStatus] = useState<DocumentVerificationOverallStatus | null>(initialStatus);
  const [documents, setDocuments] = useState<VerifiedDocumentStatusItem[]>([]);
  const [verifiedAt, setVerifiedAt] = useState<string | undefined>(
    currentUser?.documentsVerifiedAt,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isInitiating, setIsInitiating] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initiatingLockRef = useRef(false);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const fetchStatus = useCallback(async (): Promise<DocumentVerificationStatusResponse | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await documentVerificationApi.getStatus();
      setStatus(result.status);
      setDocuments(result.documents);
      setVerifiedAt(result.verifiedAt);
      syncVerifiedStatusToStore(result.status, result.verifiedAt);
      return result;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to check document verification status. Please try again.";
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initiateVerification = useCallback(async (): Promise<string | null> => {
    if (initiatingLockRef.current) return null;
    initiatingLockRef.current = true;
    setIsInitiating(true);
    setError(null);
    try {
      const result = await documentVerificationApi.initiateDigiLocker();
      return result.authorizationUrl;
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to initiate DigiLocker verification. Please try again.";
      setError(message);
      return null;
    } finally {
      initiatingLockRef.current = false;
      setIsInitiating(false);
    }
  }, []);

  const completeVerification = useCallback(
    async (
      payload: DigiLockerCallbackPayload,
    ): Promise<DocumentVerificationStatusResponse | null> => {
      setIsCompleting(true);
      setError(null);
      try {
        const result = await documentVerificationApi.completeDigiLockerCallback(payload);
        setStatus(result.status);
        setDocuments(result.documents);
        setVerifiedAt(result.verifiedAt);
        syncVerifiedStatusToStore(result.status, result.verifiedAt);
        return result;
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to complete document verification. Please try again.";
        setError(message);
        return null;
      } finally {
        setIsCompleting(false);
      }
    },
    [],
  );

  return {
    status,
    documents,
    verifiedAt,
    isLoading,
    isInitiating,
    isCompleting,
    error,
    fetchStatus,
    initiateVerification,
    completeVerification,
    clearError,
  };
}
