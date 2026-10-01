import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/utils";
import { documentsApi } from "../api/documentsApi";
import { extractFilenameFromHeader } from "../lib/validation";
import type { DocumentItem } from "../lib/types";

export interface DocumentPreviewState {
  blobUrl: string | null;
  mimeType: string;
  isLoading: boolean;
  error: string | null;
  errorCode?: number;
}

export function useDocumentPreview(doc: DocumentItem | null) {
  const [state, setState] = useState<DocumentPreviewState>({
    blobUrl: null,
    mimeType: "",
    isLoading: false,
    error: null,
  });

  const createdUrlRef = useRef<string | null>(null);

  const loadPreviewBlob = useCallback(async () => {
    if (!doc || !doc.id) {
      if (createdUrlRef.current) {
        URL.revokeObjectURL(createdUrlRef.current);
        createdUrlRef.current = null;
      }
      setState({
        blobUrl: null,
        mimeType: "",
        isLoading: false,
        error: null,
      });
      return;
    }

    // If doc already has a local blob: or data: URL
    if (doc.fileUrl?.startsWith("blob:") || doc.fileUrl?.startsWith("data:")) {
      setState({
        blobUrl: doc.fileUrl,
        mimeType: doc.fileType === "pdf" ? "application/pdf" : "image/jpeg",
        isLoading: false,
        error: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const res = await documentsApi.downloadDocument(doc.id, doc.source);
      const blob = res.blob;
      if (!blob || blob.size === 0) {
        throw new Error("Received empty document file from server.");
      }

      if (createdUrlRef.current) {
        URL.revokeObjectURL(createdUrlRef.current);
      }
      const objectUrl = URL.createObjectURL(blob);
      createdUrlRef.current = objectUrl;

      setState({
        blobUrl: objectUrl,
        mimeType: blob.type || "",
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      let errorMsg = "Failed to load document preview.";
      if (status === 401) {
        errorMsg = "Authentication required. Please sign in again.";
      } else if (status === 403) {
        errorMsg = "You do not have permission to view this document.";
      } else if (status === 404) {
        errorMsg = "Document file not found on server.";
      } else {
        errorMsg = getErrorMessage(err, "Failed to load document preview.");
      }

      setState({
        blobUrl: null,
        mimeType: "",
        isLoading: false,
        error: errorMsg,
        errorCode: status,
      });
    }
  }, [doc]);

  useEffect(() => {
    loadPreviewBlob();

    return () => {
      if (createdUrlRef.current) {
        URL.revokeObjectURL(createdUrlRef.current);
        createdUrlRef.current = null;
      }
    };
  }, [loadPreviewBlob]);

  // Authenticated Download Trigger
  const download = useCallback(async () => {
    if (!doc || !doc.id) {
      toast.error("Document cannot be downloaded: invalid document identifier.");
      return;
    }

    const toastId = toast.loading(`Downloading ${doc.title}...`);
    try {
      const res = await documentsApi.downloadDocument(doc.id, doc.source);
      const filename = extractFilenameFromHeader(
        res.contentDisposition,
        doc.fileName || doc.title,
        doc.fileType
      );

      const url = URL.createObjectURL(res.blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      toast.success(`Downloaded ${filename}`, { id: toastId });
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      let errorMsg = `Failed to download ${doc.title}.`;
      if (status === 401) errorMsg = "Session expired. Please log in again.";
      else if (status === 403) errorMsg = "Permission denied to download this document.";
      else if (status === 404) errorMsg = "Document file not found on the server.";
      else errorMsg = getErrorMessage(err, errorMsg);

      toast.error(errorMsg, { id: toastId });
    }
  }, [doc]);

  return {
    ...state,
    retry: loadPreviewBlob,
    download,
  };
}
