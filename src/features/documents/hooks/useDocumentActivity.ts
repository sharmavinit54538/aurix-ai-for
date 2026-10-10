import { useQuery } from "@tanstack/react-query";
import { documentsApi } from "../api/documentsApi";
import type { DocumentActivityItem } from "../lib/types";

export const DOCUMENTS_ACTIVITY_QUERY_KEY = ["documents", "activity"] as const;

export function useDocumentActivity(page = 1, limit = 6) {
  const query = useQuery<{ items: DocumentActivityItem[]; total: number; isLocalFallback?: boolean; serverUnavailable?: boolean }, Error>({
    queryKey: [...DOCUMENTS_ACTIVITY_QUERY_KEY, { page, limit }],
    queryFn: () => documentsApi.getDocumentActivity(page, limit),
    staleTime: 60 * 1000,
  });

  return {
    activities: query.data?.items ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isError: query.isError,
    isLocalFallback: query.data?.isLocalFallback ?? false,
    serverUnavailable: query.data?.serverUnavailable ?? false,
    refetch: query.refetch,
  };
}
