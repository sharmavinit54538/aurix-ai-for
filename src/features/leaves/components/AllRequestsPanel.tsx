import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, RefreshCw, AlertCircle, Loader2, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { api } from "@/api";
import { toast } from "sonner";
import type { LeaveRequestExtended } from "../types";
import { mapLeaveExtended, unwrapList, formatDateStr, statusBadgeClass } from "../mappers";
import { cn } from "@/lib/utils";

interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export function AllRequestsPanel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);

  const [requests, setRequests] = useState<LeaveRequestExtended[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchSeqRef = useRef(0);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Build query params
  const buildParams = useCallback(() => {
    const params = new URLSearchParams();
    if (debouncedQuery.trim()) params.set("q", debouncedQuery.trim());
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (dateFrom) params.set("from", dateFrom);
    if (dateTo) params.set("to", dateTo);
    params.set("page", String(page));
    params.set("limit", String(limit));
    return params.toString();
  }, [debouncedQuery, statusFilter, dateFrom, dateTo, page, limit]);

  const fetchRequests = useCallback(async () => {
    const seq = ++searchSeqRef.current;
    setLoading(true);
    setError(null);

    try {
      const params = buildParams();
      const res = await api.get<any>(`/leaves/requests?${params}`, {
        headers: { "x-skip-cache": "true" },
      });

      if (seq !== searchSeqRef.current) return;

      const rawList = unwrapList(res);
      const mappedList: LeaveRequestExtended[] = rawList.map(mapLeaveExtended);
      setRequests(mappedList);

      // Try to get total from response
      if (res?.data && typeof res.data === "object" && "total" in res.data) {
        setTotal(res.data.total);
      } else if (res?.total) {
        setTotal(res.total);
      } else {
        setTotal(mappedList.length);
      }
    } catch (err: any) {
      if (seq !== searchSeqRef.current) return;
      console.error("Error fetching all leave requests", err);
      setError(err?.data?.message || err?.message || "Failed to load leave requests.");
      setRequests([]);
      setTotal(0);
    } finally {
      if (seq === searchSeqRef.current) {
        setLoading(false);
      }
    }
  }, [buildParams]);

  useEffect(() => {
    void fetchRequests();
  }, [fetchRequests]);

  const totalPages = Math.ceil(total / limit) || 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleRefresh = () => {
    setPage(1);
    void fetchRequests();
  };

  const statusOptions = [
    { value: "all", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "cancelled", label: "Cancelled" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground">All Leave Requests</h3>
        <p className="text-sm text-muted-foreground">
          View and filter leave requests across the organization.
        </p>
      </div>

      {/* Filters */}
      <Card className="border border-border bg-card p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative w-full sm:w-[280px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by employee name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            {loading && requests.length > 0 && (
              <Loader2 className="absolute right-3 top-2.5 h-4 w-4 text-primary animate-spin" aria-hidden="true" />
            )}
          </div>

          <div className="w-full sm:w-[180px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 w-full sm:w-[360px]">
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                placeholder="From"
                value={dateFrom}
                onChange={(e) => {
                  setDateFrom(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
                max={dateTo || undefined}
              />
            </div>
            <div className="relative flex-1">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="date"
                placeholder="To"
                value={dateTo}
                onChange={(e) => {
                  setDateTo(e.target.value);
                  setPage(1);
                }}
                className="pl-9"
                min={dateFrom || undefined}
              />
            </div>
          </div>

          <Button variant="outline" onClick={handleRefresh} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </Card>

      {/* Table */}
      <Card className="border border-border bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="pl-6 py-4">Employee</TableHead>
              <TableHead className="py-4">Department</TableHead>
              <TableHead className="py-4">Leave Type</TableHead>
              <TableHead className="py-4">Dates</TableHead>
              <TableHead className="text-center py-4">Days</TableHead>
              <TableHead className="py-4 max-w-[200px]">Reason</TableHead>
              <TableHead className="py-4">Status</TableHead>
              <TableHead className="py-4">Rejection Reason</TableHead>
              <TableHead className="py-4">Reviewed By / Date</TableHead>
              <TableHead className="pr-6 py-4 text-right">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-10 text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                    <span>Loading leave requests...</span>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {error && requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-destructive">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <span className="text-xs">{error}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRefresh}
                      className="text-xs gap-1"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Retry
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {requests.map((req) => (
              <TableRow
                key={req.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                <TableCell className="pl-6 py-4">
                  <div className="font-semibold text-foreground">{req.employee_name || "Unknown employee"}</div>
                  {req.employee_code && (
                    <div className="text-xs text-muted-foreground font-mono">{req.employee_code}</div>
                  )}
                </TableCell>
                <TableCell className="py-4 text-muted-foreground text-xs">{req.department}</TableCell>
                <TableCell className="py-4 text-muted-foreground text-xs">{req.leave_type}</TableCell>
                <TableCell className="py-4 text-muted-foreground whitespace-nowrap text-xs">
                  {formatDateStr(req.start_date)} – {formatDateStr(req.end_date)}
                </TableCell>
                <TableCell className="text-center py-4 font-semibold tabular-nums text-foreground text-xs">
                  {req.total_days} d
                </TableCell>
                <TableCell className="py-4 text-muted-foreground max-w-[200px] truncate text-xs" title={req.reason}>
                  {req.reason}
                </TableCell>
                <TableCell className="py-4">
                  <Badge
                    variant="outline"
                    className={cn("text-xs capitalize border", statusBadgeClass(req.status))}
                  >
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell className="py-4 text-muted-foreground max-w-[200px] truncate text-xs" title={req.rejection_reason || ""}>
                  {req.rejection_reason || "—"}
                </TableCell>
                <TableCell className="py-4 text-muted-foreground text-xs">
                  {req.reviewed_by ? (
                    <>
                      <div>{req.reviewed_by}</div>
                      {req.reviewed_at && (
                        <div>{formatDateStr(req.reviewed_at)}</div>
                      )}
                    </>
                  ) : (
                    "—"
                  )}
                </TableCell>
                <TableCell className="pr-6 py-4 text-right text-muted-foreground text-xs">
                  {req.created_at ? formatDateStr(req.created_at) : "—"}
                </TableCell>
              </TableRow>
            ))}

            {!loading && !error && requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                  No leave requests match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border p-4">
            <div className="text-sm text-muted-foreground">
              Page {page} of {totalPages} · {total} total
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || loading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages || loading}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}