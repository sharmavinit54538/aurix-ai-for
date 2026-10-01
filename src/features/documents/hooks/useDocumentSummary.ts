import { useQuery } from "@tanstack/react-query";
import { documentsApi } from "../api/documentsApi";
import type { BackendDocumentItem, DocumentSummary } from "../lib/types";

export const DOCUMENTS_SUMMARY_QUERY_KEY = ["documents", "summary"] as const;
export const DOCUMENTS_EXPIRING_QUERY_KEY = ["documents", "expiring"] as const;

export function useDocumentSummary() {
  const summaryQuery = useQuery<DocumentSummary, Error>({
    queryKey: DOCUMENTS_SUMMARY_QUERY_KEY,
    queryFn: () => documentsApi.getDocumentSummary(),
    staleTime: 2 * 60 * 1000,
  });

  const expiringQuery = useQuery<BackendDocumentItem[], Error>({
    queryKey: DOCUMENTS_EXPIRING_QUERY_KEY,
    queryFn: () => documentsApi.getExpiringDocuments(),
    staleTime: 2 * 60 * 1000,
  });

  const summary = summaryQuery.data ?? {
    total: 0,
    verified: 0,
    pending: 0,
    rejected: 0,
    expiring: expiringQuery.data?.length ?? 0,
    expired: 0,
  };

  return {
    summary: {
      ...summary,
      expiring: expiringQuery.data?.length ? expiringQuery.data.length : summary.expiring,
    },
    expiringDocs: expiringQuery.data ?? [],
    isLoading: summaryQuery.isLoading || expiringQuery.isLoading,
    isError: summaryQuery.isError,
    refetch: () => {
      summaryQuery.refetch();
      expiringQuery.refetch();
    },
  };
}
