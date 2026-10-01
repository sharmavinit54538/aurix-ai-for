import { useQuery } from "@tanstack/react-query";
import { documentsApi } from "../api/documentsApi";
import { mapBackendDocument } from "../lib/mappers";
import type { BackendCategory, DocumentFilters, DocumentItem, PaginationMeta } from "../lib/types";

export const DOCUMENTS_LIST_QUERY_KEY = ["documents", "list"] as const;

interface UseDocumentsListOptions {
  filters: DocumentFilters;
  categoriesMap?: Map<string, BackendCategory>;
  currentEmployeeProfileId?: string;
  isEmployeeRole: boolean;
}

export function useDocumentsList({
  filters,
  categoriesMap,
  currentEmployeeProfileId,
  isEmployeeRole,
}: UseDocumentsListOptions) {
  const { tab, search, categoryId, status, sortBy, order, page, limit } = filters;

  const queryKey = [
    ...DOCUMENTS_LIST_QUERY_KEY,
    {
      tab,
      search: search || "",
      categoryId: categoryId || "",
      status: status || "",
      sortBy: sortBy || "created_at",
      order: order || "desc",
      page,
      limit,
      currentEmployeeProfileId: isEmployeeRole ? currentEmployeeProfileId : "",
    },
  ];

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<{
      items: DocumentItem[];
      meta: PaginationMeta;
      hasPartialError?: boolean;
    }> => {
      // 1. Tab = "Company Documents"
      if (tab === "Company Documents") {
        const res = await documentsApi.getCompanyDocuments({
          category_id: categoryId,
          search,
          sort_by: sortBy,
          order,
          page,
          limit,
        });
        const items = (res.data || []).map((d) =>
          mapBackendDocument(d, "company", categoriesMap)
        );
        return {
          items,
          meta: {
            total: res.meta?.total ?? items.length,
            page: res.meta?.page ?? page,
            limit: res.meta?.limit ?? limit,
            has_more: Boolean(res.meta?.has_more ?? res.meta?.hasMore),
          },
        };
      }

      // 2. Tab = "Employee Documents", "Pending", "Verified", "Rejected", "Expired"
      if (
        tab === "Employee Documents" ||
        tab === "Pending" ||
        tab === "Verified" ||
        tab === "Rejected" ||
        tab === "Expired"
      ) {
        let apiStatus: string | undefined = undefined;
        if (tab === "Pending") apiStatus = "PENDING";
        else if (tab === "Verified") apiStatus = "VERIFIED";
        else if (tab === "Rejected") apiStatus = "REJECTED";

        const res = await documentsApi.getEmployeeDocuments({
          employee_id: isEmployeeRole ? currentEmployeeProfileId : undefined,
          category_id: categoryId,
          status: apiStatus || status,
          search,
          sort_by: sortBy,
          order,
          page,
          limit,
        });

        let items = (res.data || []).map((d) =>
          mapBackendDocument(d, "employee", categoriesMap)
        );

        if (tab === "Expired") {
          items = items.filter((d) => d.isExpired);
        }

        return {
          items,
          meta: {
            total: res.meta?.total ?? items.length,
            page: res.meta?.page ?? page,
            limit: res.meta?.limit ?? limit,
            has_more: Boolean(res.meta?.has_more ?? res.meta?.hasMore),
          },
        };
      }

      // 3. Tab = "all"
      // Fetch both employee documents and company documents
      const [empRes, compRes] = await Promise.allSettled([
        documentsApi.getEmployeeDocuments({
          employee_id: isEmployeeRole ? currentEmployeeProfileId : undefined,
          category_id: categoryId,
          status,
          search,
          sort_by: sortBy,
          order,
          page,
          limit,
        }),
        documentsApi.getCompanyDocuments({
          category_id: categoryId,
          search,
          sort_by: sortBy,
          order,
          page,
          limit,
        }),
      ]);

      const hasPartialError = empRes.status === "rejected" || compRes.status === "rejected";
      if (empRes.status === "rejected" && compRes.status === "rejected") {
        throw new Error("Failed to load documents from server.");
      }

      const allItems: DocumentItem[] = [];
      let totalCount = 0;
      let hasMore = false;

      if (empRes.status === "fulfilled") {
        const empDocs = (empRes.value.data || []).map((d) =>
          mapBackendDocument(d, "employee", categoriesMap)
        );
        allItems.push(...empDocs);
        totalCount += empRes.value.meta?.total ?? empDocs.length;
        if (empRes.value.meta?.has_more) hasMore = true;
      }

      if (compRes.status === "fulfilled") {
        const compDocs = (compRes.value.data || []).map((d) =>
          mapBackendDocument(d, "company", categoriesMap)
        );
        // Avoid duplicate IDs if any
        const existingIds = new Set(allItems.map((d) => d.id));
        for (const cd of compDocs) {
          if (!existingIds.has(cd.id)) {
            allItems.push(cd);
          }
        }
        totalCount += compRes.value.meta?.total ?? compDocs.length;
        if (compRes.value.meta?.has_more) hasMore = true;
      }

      return {
        items: allItems,
        meta: {
          total: totalCount,
          page,
          limit,
          has_more: hasMore,
        },
        hasPartialError,
      };
    },
    staleTime: 60 * 1000, // 1 min
    placeholderData: (previousData) => previousData,
  });

  return {
    items: query.data?.items ?? [],
    meta: query.data?.meta ?? { total: 0, page, limit, has_more: false },
    hasPartialError: query.data?.hasPartialError ?? false,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
