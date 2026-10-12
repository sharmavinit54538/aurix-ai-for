"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { formatInstant } from "@/lib/datetime";
import { useChangeRequestsAdminQuery, useReviewChangeRequest } from "../hooks/useShifts";
import type { ShiftChangeRequest } from "@/services/attendance/types";

const STATUS_BADGES: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  approved: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  rejected: "bg-destructive/15 text-destructive border-destructive/30",
  cancelled: "bg-muted/40 text-muted-foreground border-border",
};

export function ChangeRequestsPanel() {
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected" | "cancelled">("pending");
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ShiftChangeRequest | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject">("approve");
  const [reviewNote, setReviewNote] = useState("");

  const { data, isLoading, refetch } = useChangeRequestsAdminQuery(
    statusFilter !== "all" ? { status: statusFilter } : undefined
  );

  const reviewMutation = useReviewChangeRequest({
    onSuccess: () => {
      toast.success(`Request ${reviewAction}d successfully`);
      setReviewDialogOpen(false);
      setSelectedRequest(null);
      setReviewNote("");
      refetch();
    },
    onError: (error: any) => {
      if (error?.response?.data?.detail?.code === "CHANGE_REQUEST_INVALID_STATE") {
        toast.error("This request was already processed");
      } else {
        toast.error(error?.message || "Failed to process request");
      }
    },
  });

  const openReviewDialog = (request: ShiftChangeRequest, action: "approve" | "reject") => {
    if (request.status !== "pending") return;
    setSelectedRequest(request);
    setReviewAction(action);
    setReviewNote("");
    setReviewDialogOpen(true);
  };

  const handleReviewSubmit = () => {
    if (!selectedRequest) return;
    if (reviewAction === "reject" && reviewNote.trim().length < 3) {
      toast.error("Rejection note must be at least 3 characters");
      return;
    }
    reviewMutation.mutate({
      id: selectedRequest.id,
      action: reviewAction,
      note: reviewNote.trim() || undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 border border-border rounded-2xl bg-card/30 gap-3 text-muted-foreground text-sm">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span>Loading change requests...</span>
      </div>
    );
  }

  const requests = data?.items ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="font-display text-xl font-bold tracking-tight text-foreground">Shift Change Requests</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Review and approve/reject employee shift change requests.</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter as any}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={() => refetch()} className="gap-1.5">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </Button>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 border border-dashed border-border rounded-2xl bg-card/20 gap-3 text-center">
          <svg className="h-10 w-10 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <h3 className="font-semibold text-sm">No Change Requests</h3>
          <p className="text-xs text-muted-foreground max-w-md">
            {statusFilter === "pending"
              ? "No pending shift change requests at the moment."
              : `No ${statusFilter} requests found.`}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Current → Requested</th>
                  <th className="px-4 py-3">Effective Date</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/15 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{req.employee_name || "Unknown"}</div>
                      {req.employee_id && <div className="text-[11px] text-muted-foreground font-mono">{req.employee_id}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-muted-foreground">{req.current_shift_name || "—"}</span>
                        <svg className="h-3 w-3 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        <span className="font-medium text-foreground">{req.requested_shift_name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{req.effective_date}</td>
                    <td className="px-4 py-3 text-muted-foreground max-w-xs truncate" title={req.reason}>{req.reason}</td>
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{formatInstant(req.created_at)}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`${STATUS_BADGES[req.status] || STATUS_BADGES.pending} text-[10px]`}>
                        {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {req.status === "pending" && (
                        <div className="flex items-center gap-1.5">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1.5 text-emerald-400 border-emerald-400/40 hover:bg-emerald-400/10"
                            onClick={() => openReviewDialog(req, "approve")}
                            disabled={reviewMutation.isPending}
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs gap-1.5 text-destructive border-destructive/40 hover:bg-destructive/10"
                            onClick={() => openReviewDialog(req, "reject")}
                            disabled={reviewMutation.isPending}
                          >
                            <XCircle className="h-3.5 w-3.5" /> Reject
                          </Button>
                        </div>
                      )}
                      {req.status !== "pending" && req.review_note && (
                        <div className="text-[10px] text-muted-foreground max-w-xs truncate" title={req.review_note}>
                          {req.review_note}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{reviewAction === "approve" ? "Approve" : "Reject"} Shift Change Request</DialogTitle>
            <DialogDescription>
              {selectedRequest?.employee_name} — {selectedRequest?.current_shift_name} → {selectedRequest?.requested_shift_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Effective Date</span>
                <span className="font-medium">{selectedRequest?.effective_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reason</span>
                <span className="font-medium text-foreground truncate max-w-[200px]">{selectedRequest?.reason}</span>
              </div>
            </div>

            {reviewAction === "reject" && (
              <div>
                <Label htmlFor="review-note" className="text-xs font-medium text-foreground">
                  Rejection Note <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="review-note"
                  rows={3}
                  placeholder="Provide a reason for rejecting this request (minimum 3 characters)..."
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="mt-1 text-xs border-border"
                  required
                />
                <p className="text-[10px] text-muted-foreground mt-1">
                  {reviewNote.length}/500 characters
                </p>
              </div>
            )}

            {reviewAction === "approve" && (
              <div>
                <Label htmlFor="approve-note" className="text-xs font-medium text-foreground">Approval Note (optional)</Label>
                <Textarea
                  id="approve-note"
                  rows={2}
                  placeholder="Optional note for the employee..."
                  value={reviewNote}
                  onChange={(e) => setReviewNote(e.target.value)}
                  className="mt-1 text-xs border-border"
                />
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" size="sm" onClick={() => setReviewDialogOpen(false)} disabled={reviewMutation.isPending}>
              Cancel
            </Button>
            <Button
              variant={reviewAction === "reject" ? "destructive" : "default"}
              size="sm"
              onClick={handleReviewSubmit}
              disabled={reviewMutation.isPending || (reviewAction === "reject" && reviewNote.trim().length < 3)}
              className="gap-1.5"
            >
              {reviewMutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {reviewAction === "approve" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}