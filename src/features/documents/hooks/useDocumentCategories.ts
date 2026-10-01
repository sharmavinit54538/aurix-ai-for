import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { documentsApi } from "../api/documentsApi";
import { groupCategories } from "../lib/categoryMap";
import type { BackendCategory } from "../lib/types";

export const CATEGORIES_QUERY_KEY = ["documents", "categories"] as const;

export function useDocumentCategories() {
  const query = useQuery<BackendCategory[], Error>({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: () => documentsApi.getCategories(),
    staleTime: 15 * 60 * 1000, // 15 mins cache
    gcTime: 60 * 60 * 1000,
    retry: 2,
  });

  const categories = useMemo(() => query.data ?? [], [query.data]);

  const categoriesMap = useMemo(() => {
    const map = new Map<string, BackendCategory>();
    for (const cat of categories) {
      map.set(cat.id, cat);
    }
    return map;
  }, [categories]);

  const groupedCategories = useMemo(() => {
    return groupCategories(categories);
  }, [categories]);

  return {
    categories,
    categoriesMap,
    groupedCategories,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
