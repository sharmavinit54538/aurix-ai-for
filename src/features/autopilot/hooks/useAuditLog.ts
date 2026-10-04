import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { autopilotApi, type AuditQueryParams } from "../services/autopilotApi";
import type { AuditLogEntry, AutopilotWorkflowId } from "../types";
import { sanitizeCsvField } from "../utils/mappers";

export interface UseAuditLogReturn {
  items: AuditLogEntry[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  error: string | null;
  backendUnavailable: boolean;
  filterWorkflow: string;
  filterDecision: string;
  confidenceMin: number;
  confidenceMax: number;
  startDate: string;
  endDate: string;
  searchQuery: string;
  selectedEntry: AuditLogEntry | null;
  setSelectedEntry: (entry: AuditLogEntry | null) => void;
  setPage: (p: number) => void;
  setFilterWorkflow: (w: string) => void;
  setFilterDecision: (d: string) => void;
  setConfidenceMin: (c: number) => void;
  setConfidenceMax: (c: number) => void;
  setStartDate: (d: string) => void;
  setEndDate: (d: string) => void;
  setSearchQuery: (s: string) => void;
  refetch: () => Promise<void>;
  undoAction: (id: string, reason: string) => Promise<boolean>;
  overrideAction: (id: string, newDecision: string, reason: string) => Promise<boolean>;
  exportCsv: () => void;
}

export function useAuditLog(): UseAuditLogReturn {
  const [items, setItems] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendUnavailable, setBackendUnavailable] = useState(false);

  const [filterWorkflow, setFilterWorkflow] = useState<string>("all");
  const [filterDecision, setFilterDecision] = useState<string>("all");
  const [confidenceMin, setConfidenceMin] = useState<number>(0);
  const [confidenceMax, setConfidenceMax] = useState<number>(100);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);

  const fetchAuditLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: AuditQueryParams = {
        page,
        limit,
        workflow: filterWorkflow !== "all" ? (filterWorkflow as AutopilotWorkflowId) : undefined,
        decision: filterDecision !== "all" ? filterDecision : undefined,
        confidenceMin: confidenceMin > 0 ? confidenceMin : undefined,
        confidenceMax: confidenceMax < 100 ? confidenceMax : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        search: searchQuery.trim() || undefined,
      };

      const res = await autopilotApi.getAuditLogs(params);
      setItems(res.items);
      setTotal(res.total);
      setError(null);
      setBackendUnavailable(false);
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404 || status === 501) {
        setBackendUnavailable(true);
        setItems([]);
        setTotal(0);
        setError(null);
      } else {
        const msg = err?.response?.data?.message || err?.message || "Failed to load audit logs";
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, filterWorkflow, filterDecision, confidenceMin, confidenceMax, startDate, endDate, searchQuery]);

  useEffect(() => {
    void fetchAuditLogs();
  }, [fetchAuditLogs]);

  const undoAction = useCallback(async (id: string, reason: string): Promise<boolean> => {
    try {
      const updated = await autopilotApi.undoAuditAction(id, reason);
      setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
      if (selectedEntry?.id === id) {
        setSelectedEntry(updated);
      }
      toast.success("Action undone successfully");
      return true;
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 404 || status === 501) {
        toast.error("Feature unavailable — backend pending");
      } else {
        const msg = err?.response?.data?.message || err?.message || "Failed to undo action";
        toast.error(msg);
      }
      return false;
    }
  }, [selectedEntry]);

  const overrideAction = useCallback(
    async (id: string, newDecision: string, reason: string): Promise<boolean> => {
      try {
        const updated = await autopilotApi.overrideAuditAction(id, { newDecision, reason });
        setItems((prev) => prev.map((item) => (item.id === id ? updated : item)));
        if (selectedEntry?.id === id) {
          setSelectedEntry(updated);
        }
        toast.success("Decision overridden and recorded in audit ledger");
        return true;
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 404 || status === 501) {
          toast.error("Feature unavailable — backend pending");
        } else {
          const msg = err?.response?.data?.message || err?.message || "Failed to override action";
          toast.error(msg);
        }
        return false;
      }
    },
    [selectedEntry],
  );

  const exportCsv = useCallback(() => {
    if (items.length === 0) {
      toast.info("No audit records to export");
      return;
    }

    const headers = [
      "ID",
      "Timestamp",
      "Workflow",
      "Subject",
      "Action Taken",
      "Decision",
      "Confidence (%)",
      "Policy Clause",
      "Overridden By",
      "Override Reason",
    ];

    const rows = items.map((row) => [
      sanitizeCsvField(row.id),
      sanitizeCsvField(row.timestamp),
      sanitizeCsvField(row.workflow),
      sanitizeCsvField(row.subject),
      sanitizeCsvField(row.actionTaken),
      sanitizeCsvField(row.decision),
      sanitizeCsvField(row.confidence),
      sanitizeCsvField(row.policyClause),
      sanitizeCsvField(row.overrideBy?.name || "None"),
      sanitizeCsvField(row.overrideReason || ""),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `autopilot-action-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Audit trail exported to sanitized CSV");
  }, [items]);

  return {
    items,
    total,
    page,
    limit,
    loading,
    error,
    backendUnavailable,
    filterWorkflow,
    filterDecision,
    confidenceMin,
    confidenceMax,
    startDate,
    endDate,
    searchQuery,
    selectedEntry,
    setSelectedEntry,
    setPage,
    setFilterWorkflow,
    setFilterDecision,
    setConfidenceMin,
    setConfidenceMax,
    setStartDate,
    setEndDate,
    setSearchQuery,
    refetch: fetchAuditLogs,
    undoAction,
    overrideAction,
    exportCsv,
  };
}
