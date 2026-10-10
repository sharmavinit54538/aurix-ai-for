import { useQuery } from "@tanstack/react-query";
import { documentsApi } from "../api/documentsApi";
import { mapBackendDocument, matchesExpiryWindow } from "../lib/mappers";
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
  const {
    tab,
    search,
    employeeId,
    categoryId,
    documentType,
    status,
    verificationStatus,
    expiryWindow,
    sortBy,
    order,
    page,
    limit,
  } = filters;

  const effectiveEmployeeId = isEmployeeRole ? currentEmployeeProfileId : employeeId;

  const queryKey = [
    ...DOCUMENTS_LIST_QUERY_KEY,
    {
      tab,
      search: search || "",
      employeeId: effectiveEmployeeId || "",
      categoryId: categoryId || "",
      documentType: documentType || "",
      status: status || "",
      verificationStatus: verificationStatus || "",
      expiryWindow: expiryWindow || "",
      sortBy: sortBy || "created_at",
      order: order || "desc",
      page,
      limit,
    },
  ];

  const enabled = !isEmployeeRole || !!currentEmployeeProfileId;

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<{
      items: DocumentItem[];
      meta: PaginationMeta;
      hasPartialError?: boolean;
    }> => {
      // 1. Company Documents Only
      if (tab === "company-docs" || tab === "Company Documents") {
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

      // 2. Employee Documents / Verification Queue / Expiry
      if (
        tab === "employee-docs" ||
        tab === "Employee Documents" ||
        tab === "verification" ||
        tab === "Pending" ||
        tab === "Verified" ||
        tab === "Rejected" ||
        tab === "expiry" ||
        tab === "Expired"
      ) {
        let apiStatus: string | undefined = undefined;
        if (tab === "Pending") apiStatus = "PENDING";
        else if (tab === "Verified") apiStatus = "VERIFIED";
        else if (tab === "Rejected") apiStatus = "REJECTED";
        else if (verificationStatus && verificationStatus !== "ALL") apiStatus = verificationStatus;

        const res = await documentsApi.getEmployeeDocuments({
          employee_id: effectiveEmployeeId,
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

        // Client-side refinement for document type or expiry window if applicable
        // TODO: Backend doesn't support document_type or expiry_window query params yet
        // When available, send them as query params and remove client-side filtering
        if (documentType) {
          const dtLower = documentType.toLowerCase();
          items = items.filter(
            (d) =>
              (d.documentType && d.documentType.toLowerCase().includes(dtLower)) ||
              d.categoryName.toLowerCase().includes(dtLower)
          );
        }

        if (tab === "Expired") {
          items = items.filter((d) => d.isExpired);
        } else if (tab === "expiry" || expiryWindow) {
          items = items.filter((d) => matchesExpiryWindow(d.expiryDate, expiryWindow));
        }

        // Adjust total to reflect client-side filtered count since backend doesn't support these filters yet
        const filteredTotal = items.length;
        const hasMore = res.meta?.has_more ?? false;

        return {
          items,
          meta: {
            total: filteredTotal,
            page: res.meta?.page ?? page,
            limit: res.meta?.limit ?? limit,
            has_more: hasMore && filteredTotal >= limit,
          },
        };
      }

      // 3. Tab = "all" - Fetch both employee and company documents with split limit
      // Strategy: fetch limit/2 from each source to ensure we never exceed limit rows per page
      const splitLimit = Math.ceil(limit / 2);

      const [empRes, compRes] = await Promise.allSettled([
        documentsApi.getEmployeeDocuments({
          employee_id: effectiveEmployeeId,
          category_id: categoryId,
          status,
          search,
          sort_by: sortBy,
          order,
          page,
          limit: splitLimit,
        }),
        documentsApi.getCompanyDocuments({
          category_id: categoryId,
          search,
          sort_by: sortBy,
          order,
          page,
          limit: splitLimit,
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
        // Dedupe by composite key: ${source}:${id}
        const existingKeys = new Set(allItems.map((d) => `${d.source}:${d.id}`));
        for (const cd of compDocs) {
          const key = `company:${cd.id}`;
          if (!existingKeys.has(key)) {
            allItems.push(cd);
            existingKeys.add(key);
          }
        }
        totalCount += compRes.value.meta?.total ?? compDocs.length;
        if (compRes.value.meta?.has_more) hasMore = true;
      }

      let filteredItems = allItems;
      if (documentType) {
        const dtLower = documentType.toLowerCase();
        filteredItems = filteredItems.filter(
          (d) =>
            (d.documentType && d.documentType.toLowerCase().includes(dtLower)) ||
            d.categoryName.toLowerCase().includes(dtLower)
        );
      }
      if (expiryWindow) {
        filteredItems = filteredItems.filter((d) => matchesExpiryWindow(d.expiryDate, expiryWindow));
      }

      // When client-side filtering applies, total should reflect filtered count
      // TODO: Remove client-side filtering when backend supports document_type and expiry_window params
      const finalTotal = (documentType || expiryWindow) ? filteredItems.length : totalCount;
      const finalHasMore = hasMore && filteredItems.length >= limit;

      return {
        items: filteredItems.slice(0, limit), // Ensure we never return more than limit
        meta: {
          total: finalTotal,
          page,
          limit,
          has_more: finalHasMore,
        },
        hasPartialError,
      };
    },
    staleTime: 60 * 1000,
    enabled,
  });

  return {
    items: query.data?.items ?? [],
    meta: query.data?.meta ?? { total: 0, page: 1, limit, has_more: false },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    hasPartialError: query.data?.hasPartialError ?? false,
    refetch: query.refetch,
    isEnabled: enabled,
  };
}
