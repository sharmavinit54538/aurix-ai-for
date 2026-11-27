import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Download,
  RefreshCw,
  Search,
  Tag,
  Trash2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { getErrorMessage } from "@/api/utils";
import { recruitmentApi } from "@/services/recruitmentApi";
import { AddCandidateDialog } from "@/features/admin/recruitment/components/AddCandidateDialog";
import { CandidateRow } from "@/features/admin/recruitment/components/Bits";
import { useRecruitment } from "@/features/admin/recruitment/hooks/useRecruitment";
import { EmptyState } from "@/components/hrms/Shared";
import {
  STAGES,
  STAGE_LABEL,
  type Candidate,
  type Stage,
} from "@/features/admin/recruitment/types";

export function CandidatesPage() {
  const {
    jobs,
    deleteCandidate,
    bulkMoveApplications,
    bulkTagApplications,
  } = useRecruitment();

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [stage, setStage] = useState<"all" | Stage>("all");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [minScore, setMinScore] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 25;

  const [items, setItems] = useState<Candidate[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkMoveStage, setBulkMoveStage] = useState<Stage>("screening");
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [bulkSubmitting, setBulkSubmitting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Candidate | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQ(q.trim());
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [q]);

  const loadCandidatesAndStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [listRes, statsRes] = await Promise.allSettled([
        recruitmentApi.getCandidatesPaginated({
          page,
          limit,
          ...(debouncedQ ? { search: debouncedQ } : {}),
          ...(stage !== "all" ? { stage } : {}),
          ...(jobFilter !== "all" ? { job_id: jobFilter } : {}),
          ...(minScore > 0 ? { min_score: minScore } : {}),
        }),
        recruitmentApi.getApplicationStats(),
      ]);

      if (listRes.status === "rejected") {
        throw listRes.reason;
      }

      setItems(listRes.value.items);
      setTotal(listRes.value.total);
      if (statsRes.status === "fulfilled" && statsRes.value && typeof statsRes.value === "object") {
        setStats(statsRes.value as Record<string, unknown>);
      }
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load candidates from backend."));
    } finally {
      setLoading(false);
    }
  }, [page, limit, debouncedQ, stage, jobFilter, minScore]);

  useEffect(() => {
    void loadCandidatesAndStats();
  }, [loadCandidatesAndStats]);

  const visibleCandidates = useMemo(() => {
    return items.filter((c) => {
      if (stage !== "all" && c.stage !== stage) return false;
      if (jobFilter !== "all" && c.jobId !== jobFilter) return false;
      if (minScore > 0 && (c.atsScore ?? 0) < minScore) return false;
      return true;
    });
  }, [items, stage, jobFilter, minScore]);

  const selectedCandidates = useMemo(
    () => visibleCandidates.filter((c) => selectedIds.includes(c.id)),
    [visibleCandidates, selectedIds],
  );

  const selectedApplicationIds = useMemo(
    () =>
      selectedCandidates
        .map((c) => c.applicationId)
        .filter((id): id is string => Boolean(id)),
    [selectedCandidates],
  );

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === visibleCandidates.length && visibleCandidates.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(visibleCandidates.map((c) => c.id));
    }
  };

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const blobData = await recruitmentApi.exportCandidatesCsv({
        ...(debouncedQ ? { search: debouncedQ } : {}),
        ...(stage !== "all" ? { stage } : {}),
        ...(jobFilter !== "all" ? { job_id: jobFilter } : {}),
      });
      const blob = blobData instanceof Blob ? blobData : new Blob([blobData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `candidates_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("Candidates CSV exported.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to export candidates CSV."));
    } finally {
      setExporting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    try {
      await deleteCandidate(deleteTarget.id);
      toast.success(`Candidate "${deleteTarget.name}" deleted.`);
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      setDeleteTarget(null);
      await loadCandidatesAndStats();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to delete candidate."));
    } finally {
      setDeletingId(null);
    }
  };

  const handleBulkMoveSubmit = async () => {
    if (selectedApplicationIds.length === 0) {
      toast.error("Selected candidates have no active backend application IDs.");
      return;
    }
    setBulkSubmitting(true);
    try {
      await bulkMoveApplications(selectedApplicationIds, bulkMoveStage);
      toast.success(
        `Moved ${selectedApplicationIds.length} application(s) to ${STAGE_LABEL[bulkMoveStage]}.`,
      );
      setShowMoveModal(false);
      setSelectedIds([]);
      await loadCandidatesAndStats();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to bulk move applications."));
    } finally {
      setBulkSubmitting(false);
    }
  };

  const handleBulkTagSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    if (tags.length === 0) {
      toast.error("Enter at least one tag.");
      return;
    }
    if (selectedApplicationIds.length === 0) {
      toast.error("Selected candidates have no active backend application IDs.");
      return;
    }
    setBulkSubmitting(true);
    try {
      await bulkTagApplications(selectedApplicationIds, tags);
      toast.success(`Applied ${tags.length} tag(s) to ${selectedApplicationIds.length} application(s).`);
      setShowTagModal(false);
      setTagsInput("");
      setSelectedIds([]);
      await loadCandidatesAndStats();
    } catch (err) {
      toast.error(getErrorMessage(err, "Failed to tag applications."));
    } finally {
      setBulkSubmitting(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          {stats ? (
            <>
              <span className="rounded-lg border border-border bg-card/60 px-2.5 py-1">
                Total Apps: <strong>{Number(stats.total ?? stats.total_applications ?? total)}</strong>
              </span>
              {typeof stats.shortlisted === "number" && (
                <span className="rounded-lg border border-border bg-card/60 px-2.5 py-1">
                  Shortlisted: <strong>{stats.shortlisted}</strong>
                </span>
              )}
              {typeof stats.hired === "number" && (
                <span className="rounded-lg border border-border bg-card/60 px-2.5 py-1">
                  Hired: <strong>{stats.hired}</strong>
                </span>
              )}
            </>
          ) : (
            <span className="rounded-lg border border-border bg-card/60 px-2.5 py-1">
              Showing {visibleCandidates.length} of {total} candidate(s)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void loadCandidatesAndStats()}
            disabled={loading}
          >
            <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void handleExportCsv()}
            disabled={exporting}
          >
            <Download className="mr-1.5 h-3.5 w-3.5" />
            {exporting ? "Exporting..." : "Export CSV"}
          </Button>
          <AddCandidateDialog jobs={jobs} onCreated={() => void loadCandidatesAndStats()} />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
          <Button size="sm" variant="outline" onClick={() => void loadCandidatesAndStats()}>
            Retry
          </Button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card/60 p-3 backdrop-blur-xl">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, role, skill..."
            className="h-9 pl-9"
          />
        </div>

        <select
          aria-label="Filter by stage"
          value={stage}
          onChange={(e) => {
            setStage(e.target.value as "all" | Stage);
            setPage(1);
          }}
          className="h-9 rounded-md border border-border bg-background px-2.5 text-xs"
        >
          <option value="all">All Stages</option>
          {STAGES.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABEL[s]}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by job"
          value={jobFilter}
          onChange={(e) => {
            setJobFilter(e.target.value);
            setPage(1);
          }}
          className="h-9 max-w-[180px] rounded-md border border-border bg-background px-2.5 text-xs"
        >
          <option value="all">All Jobs</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span>Min Score:</span>
          <Input
            type="number"
            min={0}
            max={100}
            value={minScore}
            onChange={(e) => setMinScore(Math.max(0, Math.min(100, Number(e.target.value) || 0)))}
            className="h-9 w-16 text-xs"
          />
        </div>
      </div>

      {/* Bulk Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card/40 px-3 py-2 text-xs">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            aria-label="Select all visible candidates"
            checked={
              visibleCandidates.length > 0 && selectedIds.length === visibleCandidates.length
            }
            onChange={toggleSelectAll}
            className="h-4 w-4 rounded border-border"
          />
          <span className="text-muted-foreground">
            {selectedIds.length} selected ({selectedApplicationIds.length} with application ID)
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={selectedIds.length === 0}
            onClick={() => setShowMoveModal(true)}
          >
            Move to stage
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={selectedIds.length === 0}
            onClick={() => setShowTagModal(true)}
          >
            <Tag className="mr-1.5 h-3.5 w-3.5" />
            Tag
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled
            title="Blocked by backend: outbound candidate email dispatch API is unavailable"
          >
            Email (Unavailable)
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card/60 p-10 text-center text-sm text-muted-foreground">
          Loading candidates...
        </div>
      ) : visibleCandidates.length === 0 ? (
        <EmptyState
          title="No candidates match your filters"
          description="Try clearing search filters or add a new candidate."
          icon={Users}
        />
      ) : (
        <div className="space-y-2">
          {visibleCandidates.map((c) => (
            <div key={c.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                aria-label={`Select ${c.name}`}
                checked={selectedIds.includes(c.id)}
                onChange={() => toggleSelect(c.id)}
                className="h-4 w-4 shrink-0 rounded border-border"
              />
              <div className="min-w-0 flex-1">
                <CandidateRow c={c} />
              </div>
              <Button
                size="icon"
                variant="outline"
                aria-label={`Delete ${c.name}`}
                className="h-9 w-9 shrink-0 text-destructive hover:bg-destructive/10"
                onClick={() => setDeleteTarget(c)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2 text-xs text-muted-foreground">
          <span>
            Page {page} of {totalPages}
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Bulk Move Stage Modal */}
      <Dialog open={showMoveModal} onOpenChange={setShowMoveModal}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Bulk Move Applications</DialogTitle>
            <DialogDescription>
              Move {selectedApplicationIds.length} application(s) to a new pipeline stage.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3 text-xs">
            <Label htmlFor="bulk-stage-select">Target Stage</Label>
            <select
              id="bulk-stage-select"
              value={bulkMoveStage}
              onChange={(e) => setBulkMoveStage(e.target.value as Stage)}
              className="mt-1.5 h-9 w-full rounded-md border border-border bg-background px-2.5 text-sm"
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {STAGE_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMoveModal(false)}>
              Cancel
            </Button>
            <Button disabled={bulkSubmitting} onClick={() => void handleBulkMoveSubmit()}>
              {bulkSubmitting ? "Moving..." : "Confirm Move"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Bulk Tag Modal */}
      <Dialog open={showTagModal} onOpenChange={setShowTagModal}>
        <DialogContent className="max-w-sm">
          <form onSubmit={handleBulkTagSubmit}>
            <DialogHeader>
              <DialogTitle>Bulk Tag Applications</DialogTitle>
              <DialogDescription>
                Apply comma-separated tags to {selectedApplicationIds.length} application(s).
              </DialogDescription>
            </DialogHeader>
            <div className="py-3 text-xs">
              <Label htmlFor="bulk-tags-input">Tags (comma-separated) *</Label>
              <Input
                id="bulk-tags-input"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Fast-Track, Referral, Senior"
                required
                className="mt-1.5"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowTagModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={bulkSubmitting}>
                {bulkSubmitting ? "Saving..." : "Apply Tags"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Candidate</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently remove {deleteTarget?.name}? This action calls{" "}
              <code>DELETE /api/v1/candidates/&#123;id&#125;</code> and cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={Boolean(deletingId)}
              onClick={() => void handleConfirmDelete()}
            >
              {deletingId ? "Deleting..." : "Delete Candidate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
