import { useState, useMemo, useEffect, useCallback } from "react";
import { useAurix } from "@/lib/aurix-store";
import { apiInstance } from "@/api";
import { myDocumentsApi } from "@/services/myDocumentsApi";
import type {
  EmployeeDocument,
  DocumentCategory,
  SalarySlipRecord,
  ProvisionSlip,
  ActiveTab,
  SummaryMetrics,
} from "../types";

export function useEmployeeDocumentsData(activeTab: ActiveTab, searchQuery: string) {
  const ws = useAurix();
  const currentUserId = ws.user?.id || (ws.user as any)?.employeeId || "";

  // Data State
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [salarySlips, setSalarySlips] = useState<SalarySlipRecord[]>([]);
  const [provisionSlips, setProvisionSlips] = useState<ProvisionSlip[]>([]);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [employeeId, setEmployeeId] = useState<string>(currentUserId);

  // Loading and Error State
  const [isLoadingDocs, setIsLoadingDocs] = useState<boolean>(true);
  const [isLoadingSalary, setIsLoadingSalary] = useState<boolean>(false);
  const [isLoadingProvision, setIsLoadingProvision] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // ── Resolve Employee ID ──────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    async function resolveEmployee() {
      // If we already have a UUID in currentUserId, use it
      if (
        currentUserId &&
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(currentUserId)
      ) {
        setEmployeeId(currentUserId);
        return;
      }
      try {
        const res = await apiInstance.get("/employees", {
          params: { search: ws.user?.email || ws.user?.fullName || undefined, limit: 10 },
        });
        const data = res.data?.data?.items ?? res.data?.data ?? res.data ?? [];
        if (Array.isArray(data) && data.length > 0) {
          const match = data.find(
            (e: any) =>
              e.user_id === currentUserId ||
              e.company_email === ws.user?.email ||
              e.personal_email === ws.user?.email ||
              e.id === currentUserId,
          );
          if (match && isMounted) {
            setEmployeeId(match.id);
            return;
          }
        }
      } catch {
        // Fallback to currentUserId
      }
      if (isMounted && currentUserId) {
        setEmployeeId(currentUserId);
      }
    }
    resolveEmployee();
    return () => {
      isMounted = false;
    };
  }, [currentUserId, ws.user?.email, ws.user?.fullName]);

  // ── Fetch Categories ─────────────────────────────────────────────
  useEffect(() => {
    async function loadCategories() {
      try {
        const cats = await myDocumentsApi.listCategories();
        setCategories(cats);
      } catch {
        // Handled in api
      }
    }
    loadCategories();
  }, []);

  // ── Fetch Documents from Real Backend ────────────────────────────
  const fetchDocuments = useCallback(async () => {
    setIsLoadingDocs(true);
    setLoadError(null);
    try {
      if (!employeeId) {
        setDocuments([]);
        setLoadError("Unable to identify the authenticated employee.");
        return;
      }
      const data = await myDocumentsApi.listMyDocuments(employeeId);
      setDocuments(data);
    } catch (err: any) {
      console.error("Failed to fetch employee documents:", err);
      setLoadError("Unable to load your documents. Please try again.");
    } finally {
      setIsLoadingDocs(false);
    }
  }, [employeeId]);

  // ── Fetch Salary Slips from Real Backend ─────────────────────────
  const fetchSalarySlips = useCallback(async () => {
    setIsLoadingSalary(true);
    try {
      const data = await myDocumentsApi.listMySalarySlips();
      setSalarySlips(data);
    } catch (err) {
      console.error("Failed to fetch salary slips:", err);
    } finally {
      setIsLoadingSalary(false);
    }
  }, []);

  // ── Fetch Provision Slips from Real Backend ──────────────────────
  const fetchProvisionSlips = useCallback(async () => {
    setIsLoadingProvision(true);
    try {
      const data = await myDocumentsApi.listMyProvisionSlips(employeeId || undefined);
      setProvisionSlips(data);
    } catch (err) {
      console.error("Failed to fetch provision slips:", err);
    } finally {
      setIsLoadingProvision(false);
    }
  }, [employeeId]);

  // Initial load
  useEffect(() => {
    fetchDocuments();
    fetchSalarySlips();
    fetchProvisionSlips();
  }, [fetchDocuments, fetchSalarySlips, fetchProvisionSlips]);

  // ── Summary Cards Calculations (Strictly Real Data) ──────────────
  const summaryMetrics: SummaryMetrics = useMemo(() => {
    const total = documents.length;
    let verified = 0;
    let pending = 0;
    let rejected = 0;
    let expiring = 0;

    const now = new Date();
    const in90Days = new Date();
    in90Days.setDate(now.getDate() + 90);

    for (const doc of documents) {
      const s = doc.status.toUpperCase();
      if (s === "VERIFIED" || s === "APPROVED") {
        verified++;
      } else if (s === "PENDING" || s === "IN_REVIEW" || s === "SUBMITTED") {
        pending++;
      } else if (s === "REJECTED") {
        rejected++;
      }

      if (doc.expiryDate) {
        const exp = new Date(doc.expiryDate);
        if (!isNaN(exp.getTime()) && exp >= now && exp <= in90Days) {
          expiring++;
        }
      }
    }

    return { total, verified, pending, rejected, expiring };
  }, [documents]);

  // ── Filtered Documents by Tab and Search ─────────────────────────
  const filteredDocuments = useMemo(() => {
    let list = documents;

    // Filter by tab
    if (activeTab === "employment") {
      list = list.filter((doc) => {
        const cat = (doc.category || "").toLowerCase();
        const typ = (doc.type || "").toLowerCase();
        return (
          cat.includes("employment") ||
          typ.includes("offer") ||
          typ.includes("appointment") ||
          typ.includes("relieving") ||
          typ.includes("experience") ||
          typ.includes("contract")
        );
      });
    } else if (activeTab === "pending") {
      list = list.filter((doc) => {
        const s = doc.status.toUpperCase();
        return s === "PENDING" || s === "IN_REVIEW" || s === "SUBMITTED";
      });
    } else if (activeTab === "verified") {
      list = list.filter((doc) => {
        const s = doc.status.toUpperCase();
        return s === "VERIFIED" || s === "APPROVED";
      });
    } else if (activeTab === "rejected") {
      list = list.filter((doc) => doc.status.toUpperCase() === "REJECTED");
    }

    // Filter by search query (Document Name, Category, Type)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((doc) => {
        const name = (doc.title || doc.fileName || "").toLowerCase();
        const cat = (doc.category || "").toLowerCase();
        const typ = (doc.type || "").toLowerCase();
        return name.includes(q) || cat.includes(q) || typ.includes(q);
      });
    }

    return list;
  }, [documents, activeTab, searchQuery]);

  // Filtered Salary Slips by Search
  const filteredSalarySlips = useMemo(() => {
    if (!searchQuery.trim()) return salarySlips;
    const q = searchQuery.toLowerCase().trim();
    return salarySlips.filter((s) => {
      const period = (s.periodName || "").toLowerCase();
      const num = (s.payslipNumber || "").toLowerCase();
      return period.includes(q) || num.includes(q);
    });
  }, [salarySlips, searchQuery]);

  // Filtered Provision Slips by Search
  const filteredProvisionSlips = useMemo(() => {
    if (!searchQuery.trim()) return provisionSlips;
    const q = searchQuery.toLowerCase().trim();
    return provisionSlips.filter((p) => {
      const period = (p.periodName || "").toLowerCase();
      const num = (p.slipNumber || "").toLowerCase();
      return period.includes(q) || num.includes(q);
    });
  }, [provisionSlips, searchQuery]);

  return {
    documents,
    salarySlips,
    provisionSlips,
    categories,
    employeeId,
    isLoadingDocs,
    isLoadingSalary,
    isLoadingProvision,
    loadError,
    fetchDocuments,
    summaryMetrics,
    filteredDocuments,
    filteredSalarySlips,
    filteredProvisionSlips,
  };
}
