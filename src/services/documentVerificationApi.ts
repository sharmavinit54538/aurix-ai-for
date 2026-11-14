/**
 * Employee DigiLocker Document Verification API Service (Frontend Only).
 *
 * Suggested API Contract (to be confirmed with backend):
 * - GET  /employee/document-verification/status
 *   -> { status: "NOT_STARTED" | "IN_PROGRESS" | "VERIFIED" | "FAILED", documents: [{ id, status, failureReason? }], verifiedAt? }
 * - POST /employee/document-verification/digilocker/initiate
 *   -> { authorizationUrl }
 * - POST /employee/document-verification/digilocker/callback  (body: { code, state })
 *   -> { status, documents: [{ id, status, failureReason? }] }
 */
import axios from "axios";
import { apiInstance, getAccessToken, handleSessionExpired } from "@/api";

/**
 * Endpoint paths (to be confirmed with backend).
 */
export const DOCUMENT_VERIFICATION_ENDPOINTS = {
  status: "/employee/document-verification/status",
  initiate: "/employee/document-verification/digilocker/initiate",
  callback: "/employee/document-verification/digilocker/callback",
} as const;

export type DocumentVerificationOverallStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "VERIFIED"
  | "FAILED";

export type DocumentItemVerificationStatus =
  | "VERIFIED"
  | "FAILED"
  | "NOT_AVAILABLE"
  | "PENDING";

export interface VerifiedDocumentStatusItem {
  id: string;
  status: DocumentItemVerificationStatus;
  failureReason?: string;
}

export interface DocumentVerificationStatusResponse {
  status: DocumentVerificationOverallStatus;
  documents: VerifiedDocumentStatusItem[];
  verifiedAt?: string;
}

export interface DigiLockerInitiateResponse {
  authorizationUrl: string;
}

export interface DigiLockerCallbackPayload {
  code: string;
  state: string;
}

export interface DigiLockerCallbackResponse {
  status: DocumentVerificationOverallStatus;
  documents: VerifiedDocumentStatusItem[];
  verifiedAt?: string;
}

const VALID_OVERALL_STATUSES = new Set<DocumentVerificationOverallStatus>([
  "NOT_STARTED",
  "IN_PROGRESS",
  "VERIFIED",
  "FAILED",
]);

/**
 * Feature flag controlling the one-time DigiLocker document verification gate.
 * Set `VITE_ENABLE_DIGILOCKER_VERIFICATION=false` in `.env` to disable the gate
 * while backend endpoints are pending.
 */
export function isDigiLockerVerificationEnabled(): boolean {
  const raw = import.meta.env.VITE_ENABLE_DIGILOCKER_VERIFICATION;
  if (raw === undefined || raw === "") {
    return true;
  }
  const normalized = String(raw).trim().toLowerCase();
  return normalized !== "false" && normalized !== "0" && normalized !== "off";
}

function buildAuthHeaders(): Record<string, string> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

function normalizeError(err: unknown, fallbackMessage: string): Error {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status;
    if (status === 401) {
      handleSessionExpired();
      return new Error("Your session has expired. Please sign in again.");
    }
    const apiMessage =
      (err.response?.data as { message?: string; detail?: string } | undefined)?.message ||
      (err.response?.data as { message?: string; detail?: string } | undefined)?.detail;
    if (apiMessage && typeof apiMessage === "string") {
      return new Error(apiMessage);
    }
  }
  if (err instanceof Error && err.message) {
    return err;
  }
  return new Error(fallbackMessage);
}

function unwrapPayload<T>(raw: unknown): T {
  if (raw && typeof raw === "object" && "data" in raw) {
    const inner = (raw as { data?: unknown }).data;
    if (inner && typeof inner === "object") {
      return inner as T;
    }
  }
  return raw as T;
}

function normalizeDocumentItem(raw: unknown): VerifiedDocumentStatusItem | null {
  if (!raw || typeof raw !== "object") return null;
  const record = raw as Record<string, unknown>;
  const id = typeof record.id === "string" ? record.id.trim() : "";
  if (!id) return null;

  const rawStatus = typeof record.status === "string" ? record.status.toUpperCase() : "NOT_AVAILABLE";
  let status: DocumentItemVerificationStatus = "NOT_AVAILABLE";
  if (rawStatus === "VERIFIED") status = "VERIFIED";
  else if (rawStatus === "FAILED") status = "FAILED";
  else if (rawStatus === "PENDING") status = "PENDING";
  else status = "NOT_AVAILABLE";

  const failureReason =
    typeof record.failureReason === "string"
      ? record.failureReason
      : typeof record.failure_reason === "string"
        ? record.failure_reason
        : undefined;

  return {
    id,
    status,
    ...(failureReason ? { failureReason } : {}),
  };
}

function validateStatusPayload(raw: unknown): DocumentVerificationStatusResponse {
  const unwrapped = unwrapPayload<Record<string, unknown>>(raw);
  if (!unwrapped || typeof unwrapped !== "object") {
    throw new Error("Unable to verify document status from the server. Please try again.");
  }

  const rawStatus = typeof unwrapped.status === "string" ? unwrapped.status.toUpperCase() : "";
  if (!VALID_OVERALL_STATUSES.has(rawStatus as DocumentVerificationOverallStatus)) {
    throw new Error(
      "Document verification service is not yet available from the backend. Please try again or contact HR support.",
    );
  }

  const rawDocs = Array.isArray(unwrapped.documents) ? unwrapped.documents : [];
  const documents = rawDocs
    .map(normalizeDocumentItem)
    .filter((item): item is VerifiedDocumentStatusItem => item !== null);

  const verifiedAt =
    typeof unwrapped.verifiedAt === "string"
      ? unwrapped.verifiedAt
      : typeof unwrapped.verified_at === "string"
        ? unwrapped.verified_at
        : undefined;

  return {
    status: rawStatus as DocumentVerificationOverallStatus,
    documents,
    ...(verifiedAt ? { verifiedAt } : {}),
  };
}

export const documentVerificationApi = {
  /**
   * Fetches the authenticated employee's current document verification status.
   * Contract (to be confirmed with backend):
   * GET /employee/document-verification/status
   */
  async getStatus(): Promise<DocumentVerificationStatusResponse> {
    try {
      const response = await apiInstance.get(DOCUMENT_VERIFICATION_ENDPOINTS.status, {
        headers: buildAuthHeaders(),
      });
      return validateStatusPayload(response.data);
    } catch (err: unknown) {
      throw normalizeError(
        err,
        "Could not fetch your document verification status. Please check your connection and try again.",
      );
    }
  },

  /**
   * Initiates the DigiLocker OAuth / consent session and returns the hosted
   * DigiLocker authorization URL to redirect the browser to.
   * Contract (to be confirmed with backend):
   * POST /employee/document-verification/digilocker/initiate
   */
  async initiateDigiLocker(): Promise<DigiLockerInitiateResponse> {
    try {
      const response = await apiInstance.post(
        DOCUMENT_VERIFICATION_ENDPOINTS.initiate,
        {},
        {
          headers: buildAuthHeaders(),
        },
      );
      const unwrapped = unwrapPayload<Record<string, unknown>>(response.data);
      const authorizationUrl =
        typeof unwrapped?.authorizationUrl === "string"
          ? unwrapped.authorizationUrl.trim()
          : typeof unwrapped?.authorization_url === "string"
            ? unwrapped.authorization_url.trim()
            : "";

      if (!authorizationUrl) {
        throw new Error(
          "DigiLocker authorization service is not yet connected on the backend. Please try again later or contact HR support.",
        );
      }

      return { authorizationUrl };
    } catch (err: unknown) {
      throw normalizeError(
        err,
        "Unable to connect to DigiLocker right now. Please try again in a moment.",
      );
    }
  },

  /**
   * Forwards the authorization `code` and `state` returned by DigiLocker to the backend
   * to complete document verification. The frontend never exchanges tokens or holds secrets.
   * Contract (to be confirmed with backend):
   * POST /employee/document-verification/digilocker/callback
   */
  async completeDigiLockerCallback(
    payload: DigiLockerCallbackPayload,
  ): Promise<DigiLockerCallbackResponse> {
    if (!payload.code?.trim() || !payload.state?.trim()) {
      throw new Error("Missing authorization parameters from DigiLocker.");
    }
    try {
      const response = await apiInstance.post(
        DOCUMENT_VERIFICATION_ENDPOINTS.callback,
        {
          code: payload.code.trim(),
          state: payload.state.trim(),
        },
        {
          headers: buildAuthHeaders(),
        },
      );
      return validateStatusPayload(response.data);
    } catch (err: unknown) {
      throw normalizeError(
        err,
        "We could not complete your DigiLocker document verification. Please try again.",
      );
    }
  },
};

export default documentVerificationApi;
