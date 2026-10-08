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

function matchesExpiryWindow(doc: DocumentItem, window?: string): boolean {
  if (!window || window === "all") return true;
  if (!doc.expiryDate) return window === "valid";

  const expiryTime = new Date(doc.expiryDate).getTime();
  if (isNaN(expiryTime)) return true;

  const now = Date.now();
  const diffDays = Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24));

  if (window === "expired") return diffDays <= 0;
  if (window === "7d") return diffDays > 0 && diffDays <= 7;
  if (window === "30d") return diffDays > 0 && diffDays <= 30;
  if (window === "60d") return diffDays > 0 && diffDays <= 60;
  if (window === "valid") return diffDays > 60;

  return true;
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
          items = items.filter((d) => matchesExpiryWindow(d, expiryWindow));
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
          employee_id: effectiveEmployeeId,
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
        const existingIds = new Set(allItems.map((d) => d.id));
        for (const cd of compDocs) {
          if (!existingIds.has(cd.id)) {
            allItems.push(cd);
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
        filteredItems = filteredItems.filter((d) => matchesExpiryWindow(d, expiryWindow));
      }

      return {
        items: filteredItems,
        meta: {
          total: totalCount,
          page,
          limit,
          has_more: hasMore,
        },
        hasPartialError,
      };
    },
    staleTime: 60 * 1000,
  });

  return {
    items: query.data?.items ?? [],
    meta: query.data?.meta ?? { total: 0, page: 1, limit, has_more: false },
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    hasPartialError: query.data?.hasPartialError ?? false,
    refetch: query.refetch,
  };
}
