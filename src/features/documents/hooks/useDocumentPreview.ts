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

function getMimeTypeFromFileType(fileType: DocumentItem["fileType"]): string {
  switch (fileType) {
    case "pdf":
      return "application/pdf";
    case "png":
      return "image/png";
    case "jpg":
      return "image/jpeg";
    case "docx":
      return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    case "doc":
      return "application/msword";
    default:
      return "application/octet-stream";
  }
}

export function useDocumentPreview(doc: DocumentItem | null) {
  const [state, setState] = useState<DocumentPreviewState>({
    blobUrl: null,
    mimeType: "",
    isLoading: false,
    error: null,
  });

  const createdUrlRef = useRef<string | null>(null);
  const requestIdRef = useRef<number>(0);

  const loadPreviewBlob = useCallback(async () => {
    const docId = doc?.id;
    const docSource = doc?.source;
    const docFileUrl = doc?.fileUrl;
    const docFileType = doc?.fileType;
    const docTitle = doc?.title || "Document";

    if (!docId || !docSource) {
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

    const currentRequestId = ++requestIdRef.current;

    // If doc already has a local blob: or data: URL
    if (docFileUrl?.startsWith("blob:") || docFileUrl?.startsWith("data:")) {
      setState({
        blobUrl: docFileUrl,
        mimeType: getMimeTypeFromFileType(docFileType),
        isLoading: false,
        error: null,
      });
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const res = await documentsApi.downloadDocument(docId, docSource, docTitle, { log: false });
      const blob = res.blob;
      if (!blob || blob.size === 0) {
        throw new Error("Received empty document file from server.");
      }

      // Stale response guard: ignore if a newer request has started
      if (currentRequestId !== requestIdRef.current) {
        URL.revokeObjectURL(URL.createObjectURL(blob)); // revoke the blob URL we won't use
        return;
      }

      if (createdUrlRef.current) {
        URL.revokeObjectURL(createdUrlRef.current);
      }
      const objectUrl = URL.createObjectURL(blob);
      createdUrlRef.current = objectUrl;

      setState({
        blobUrl: objectUrl,
        mimeType: blob.type || getMimeTypeFromFileType(docFileType),
        isLoading: false,
        error: null,
      });
    } catch (err: unknown) {
      // Stale response guard: ignore if a newer request has started
      if (currentRequestId !== requestIdRef.current) return;

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
  }, [doc?.id, doc?.source, doc?.fileUrl, doc?.fileType, doc?.title]);

  useEffect(() => {
    loadPreviewBlob();

    return () => {
      if (createdUrlRef.current) {
        URL.revokeObjectURL(createdUrlRef.current);
        createdUrlRef.current = null;
      }
    };
  }, [loadPreviewBlob]);

  // Authenticated Download Trigger (logs audit event)
  const download = useCallback(async () => {
    const docId = doc?.id;
    const docSource = doc?.source;
    const docTitle = doc?.title || "Document";
    const docFileName = doc?.fileName;
    const docFileType = doc?.fileType;

    if (!docId || !docSource) {
      toast.error("Document cannot be downloaded: invalid document identifier.");
      return;
    }

    const toastId = toast.loading(`Downloading ${docTitle}...`);
    try {
      const res = await documentsApi.downloadDocument(docId, docSource, docTitle, { log: true });
      const filename = extractFilenameFromHeader(
        res.contentDisposition,
        docFileName || docTitle,
        docFileType
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
      let errorMsg = `Failed to download ${docTitle}.`;
      if (status === 401) errorMsg = "Session expired. Please log in again.";
      else if (status === 403) errorMsg = "Permission denied to download this document.";
      else if (status === 404) errorMsg = "Document file not found on the server.";
      else errorMsg = getErrorMessage(err, errorMsg);

      toast.error(errorMsg, { id: toastId });
    }
  }, [doc?.id, doc?.source, doc?.title, doc?.fileName, doc?.fileType]);

  return {
    ...state,
    retry: loadPreviewBlob,
    download,
  };
}
