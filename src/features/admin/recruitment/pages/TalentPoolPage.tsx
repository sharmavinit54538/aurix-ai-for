import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Bookmark,
  BookmarkPlus,
  Download,
  Filter,
  Search,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Upload,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AddCandidateDialog } from "@/features/admin/recruitment/components/AddCandidateDialog";
import { useRecruitment } from "@/features/admin/recruitment/hooks/useRecruitment";
import {
  CandidateAvatar,
  ScoreRing,
  StageBadge,
} from "@/features/admin/recruitment/components/Bits";
import { apiInstance } from "@/api";

interface SavedSearch {
  id: string;
  name: string;
  query: string;
  createdAt?: string;
}

const STORAGE_KEY = "ofc360:talent_pool_saved_searches";


export function TalentPoolPage() {
  const { candidates, jobs, refreshAll } = useRecruitment();
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const [minScore, setMinScore] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);

  // Saved Searches state — user-created only
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed;
          }
        }
      } catch {
        /* ignore */
      }
    }
    return [];
  });

  const [saveSearchModalOpen, setSaveSearchModalOpen] = useState(false);
  const [newSearchName, setNewSearchName] = useState("");

  const saveSearchesToStorage = (updated: SavedSearch[]) => {
    setSavedSearches(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
  };

  const handleSaveSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSearchName.trim()) {
      toast.error("Please enter a name for this search");
      return;
    }
    const newSearch: SavedSearch = {
      id: `ss-${Date.now()}`,
      name: newSearchName.trim(),
      query: q.trim(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newSearch, ...savedSearches];
    saveSearchesToStorage(updated);
    setSaveSearchModalOpen(false);
    setNewSearchName("");
    toast.success(`Search "${newSearch.name}" saved successfully`);
  };

  const handleDeleteSearch = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedSearches.filter((s) => s.id !== id);
    saveSearchesToStorage(updated);
    toast.success("Saved search removed");
  };

  // Calculate dynamic candidate counts for real user saved searches
  const computedSavedSearches = useMemo(() => {
    return savedSearches.map((s) => {
      const ql = s.query.toLowerCase().split(" ").filter(Boolean);
      const count = candidates.filter((c) => {
        const text =
          `${c.name} ${c.appliedPosition} ${c.currentRole} ${c.location} ${c.skills.join(" ")} ${c.tags.join(" ")}`.toLowerCase();
        return ql.every((term) => text.includes(term));
      }).length;
      return { ...s, count };
    });
  }, [savedSearches, candidates]);

  const allTags = useMemo(
    () =>
      Array.from(new Set(candidates.flatMap((c) => [...c.skills, ...c.tags]))).slice(
        0,
        28,
      ),
    [candidates],
  );

  const results = useMemo(() => {
    const ql = q.toLowerCase().trim();
    return candidates.filter((c) => {
      if (minScore && (c.atsScore ?? 0) < minScore) return false;
      if (tag && ![...c.skills, ...c.tags].includes(tag)) return false;
      if (!ql) return true;
      const terms = ql.split(" ").filter(Boolean);
      const text =
        `${c.name} ${c.appliedPosition} ${c.currentRole} ${c.currentCompany} ${c.location} ${c.skills.join(" ")} ${c.tags.join(" ")}`.toLowerCase();
      return terms.every((term) => text.includes(term));
    });
  }, [candidates, q, tag, minScore]);

  // Executive KPI stats derived directly from candidate data
  const evaluatedCount = useMemo(
    () => candidates.filter((c) => (c.atsScore ?? 0) > 0).length,
    [candidates],
  );

  const avgExp = useMemo(() => {
    if (!candidates.length) return 0;
    const total = candidates.reduce((sum, c) => sum + (c.yearsExperience || 0), 0);
    return Math.round((total / candidates.length) * 10) / 10;
  }, [candidates]);

  const handleExportCSV = async () => {
    try {
      const response = await apiInstance.get("/candidates/export/csv", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `talent_pool_${new Date().toISOString().slice(0, 10)}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("CSV export downloaded successfully!");
    } catch {
      // Graceful fallback to client-side CSV generation
      if (results.length === 0) {
        toast.error("No candidates available to export.");
        return;
      }
      const headers = [
        "Candidate ID",
        "Full Name",
        "Email",
        "Phone",
        "Applied Position",
        "Current Role",
        "Current Company",
        "Location",
        "Experience (Yrs)",
        "Skills",
        "Stage",
        "ATS Score",
        "Source",
      ];
      const rows = results.map((c) => [
        c.id,
        c.name,
        c.email,
        c.phone,
        c.appliedPosition,
        c.currentRole,
        c.currentCompany,
        c.location,
        c.yearsExperience,
        c.skills.join("; "),
        c.stage,
        c.atsScore ?? "",
        c.source,
      ]);
      const csvContent = [
        headers.join(","),
        ...rows.map((row) =>
          row.map((val) => `"${String(val ?? "").replace(/"/g, '""')}"`).join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `talent_pool_${new Date().toISOString().slice(0, 10)}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success(`Exported ${results.length} talent pool candidates to CSV.`);
    }
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileData = new FormData();
    fileData.append("file", file);

    try {
      const response = await apiInstance.post("/candidates/import", fileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data?.success) {
        toast.success(response.data?.message || "Successfully imported candidates!");
        await refreshAll();
      } else {
        toast.error("Import failed");
      }
    } catch {
      toast.error("Failed to import candidates. Make sure the file format is correct.");
    } finally {
      // Clear file input so the same file can be re-selected if needed
      e.target.value = "";
    }
  };

  const hasActiveFilters = Boolean(q || tag || minScore > 0);

  const resetAllFilters = () => {
    setQ("");
    setTag(null);
    setMinScore(0);
  };

  return (
    <>
      <input
        type="file"
        id="csv-import-input"
        accept=".csv"
        className="hidden"
        onChange={handleImportCSV}
      />

      <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => document.getElementById("csv-import-input")?.click()}
        >
          <Upload className="mr-1.5 h-3.5 w-3.5" />
          Import CSV
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportCSV}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          Export CSV
        </Button>
        <Button size="sm" onClick={() => setShowAddModal(true)}>
          <UserPlus className="mr-1.5 h-3.5 w-3.5" />
          Add to Pool
        </Button>
      </div>

      {/* Dynamic Talent Pool KPI Summary */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card/60 p-3.5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Total in Pool</span>
            <Users className="h-4 w-4" />
          </div>
          <div className="mt-1 font-display text-2xl font-bold">{candidates.length}</div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Active candidate profiles
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-3.5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Filtered Results</span>
            <Search className="h-4 w-4" />
          </div>
          <div className="mt-1 font-display text-2xl font-bold">{results.length}</div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {hasActiveFilters ? "Matches current filters" : "All records visible"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-3.5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">ATS Evaluated</span>
            <Sparkles className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-1 font-display text-2xl font-bold">{evaluatedCount}</div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {candidates.length
              ? `${Math.round((evaluatedCount / candidates.length) * 100)}% of candidates`
              : "No candidates"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-card/60 p-3.5 backdrop-blur-xl">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">Avg Experience</span>
            <Star className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-1 font-display text-2xl font-bold">{avgExp}y</div>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {allTags.length} distinct skills indexed
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <aside className="space-y-4 lg:col-span-1">
          {/* Saved Searches (Zero mock data, user-defined) */}
          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Bookmark className="h-4 w-4 text-primary" />
                Saved Searches
              </div>
              {q.trim() && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs text-primary hover:text-primary"
                  onClick={() => {
                    setNewSearchName(q.trim());
                    setSaveSearchModalOpen(true);
                  }}
                >
                  <BookmarkPlus className="mr-1 h-3.5 w-3.5" />
                  Save
                </Button>
              )}
            </div>

            {computedSavedSearches.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border/70 p-3.5 text-center">
                <p className="text-xs font-medium text-foreground">No saved searches</p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Search by skills or title above and bookmark your favorite queries.
                </p>
              </div>
            ) : (
              <ul className="space-y-1.5">
                {computedSavedSearches.map((s) => {
                  const isActive = q.toLowerCase() === s.query.toLowerCase();
                  return (
                    <li key={s.id} className="group/item flex items-center gap-1">
                      <button
                        onClick={() => setQ(isActive ? "" : s.query)}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-sm transition-colors text-left ${
                          isActive
                            ? "bg-accent text-accent-foreground font-medium"
                            : "hover:bg-accent/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span className="truncate">{s.name}</span>
                        <Badge
                          variant={isActive ? "default" : "secondary"}
                          className="ml-2"
                        >
                          {s.count}
                        </Badge>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDeleteSearch(s.id, e)}
                        title="Delete saved search"
                        className="opacity-0 group-hover/item:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-opacity rounded"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Dynamic Skills & Tags */}
          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="mb-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Tag className="h-4 w-4 text-primary" />
                Skills & Tags
              </div>
              {tag && (
                <button
                  onClick={() => setTag(null)}
                  className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2"
                >
                  Clear
                </button>
              )}
            </div>

            {allTags.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                No candidate skills or tags recorded yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setTag(null)}
                  className={`rounded-full px-2.5 py-0.5 text-xs transition-colors ring-1 ${
                    !tag
                      ? "bg-foreground text-background ring-foreground font-medium"
                      : "ring-border hover:bg-accent/40 text-muted-foreground"
                  }`}
                >
                  All ({candidates.length})
                </button>
                {allTags.map((t) => {
                  const tagCount = candidates.filter((c) =>
                    [...c.skills, ...c.tags].includes(t),
                  ).length;
                  const isSelected = tag === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setTag(isSelected ? null : t)}
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs transition-colors ring-1 ${
                        isSelected
                          ? "bg-foreground text-background ring-foreground font-medium"
                          : "ring-border hover:bg-accent/40 text-muted-foreground"
                      }`}
                    >
                      <span>{t}</span>
                      <span className="text-[10px] opacity-70">({tagCount})</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Min ATS Score */}
          <div className="rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Filter className="h-4 w-4 text-primary" />
                Min ATS Score
              </div>
              {minScore > 0 && (
                <button
                  onClick={() => setMinScore(0)}
                  className="text-[11px] text-muted-foreground hover:text-foreground underline underline-offset-2"
                >
                  Reset
                </button>
              )}
            </div>
            <input
              type="range"
              min={0}
              max={95}
              step={5}
              value={minScore}
              onChange={(e) => setMinScore(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
              <span>≥ {minScore} score</span>
              <span>
                {candidates.filter((c) => (c.atsScore ?? 0) >= minScore).length}{" "}
                candidates
              </span>
            </div>
          </div>
        </aside>

        <section className="space-y-3 lg:col-span-3">
          {/* Search Input Bar */}
          <div className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 backdrop-blur-xl focus-within:ring-1 focus-within:ring-primary">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by candidate name, role, skills, location, or company…"
              className="border-0 bg-transparent shadow-none focus-visible:ring-0 p-0 h-auto text-sm placeholder:text-muted-foreground"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="p-1 text-muted-foreground hover:text-foreground rounded"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            {q.trim() && (
              <Button
                variant="secondary"
                size="sm"
                className="h-7 text-xs shrink-0"
                onClick={() => {
                  setNewSearchName(q.trim());
                  setSaveSearchModalOpen(true);
                }}
              >
                <BookmarkPlus className="mr-1 h-3 w-3" />
                Save Search
              </Button>
            )}
            <Badge variant="outline" className="shrink-0">
              <Sparkles className="mr-1 h-3 w-3 text-amber-500" />
              Live Match
            </Badge>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {results.length} candidate{results.length === 1 ? "" : "s"} found
              {hasActiveFilters ? " (filters active)" : ""}
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="hover:text-foreground underline underline-offset-2"
              >
                Reset all filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {results.map((c) => (
              <Link
                key={c.id}
                to="/dashboard/recruitment/candidates/$candidateId"
                params={{ candidateId: c.id }}
                className="group block rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-elegant"
              >
                <div className="flex items-start gap-3">
                  <CandidateAvatar name={c.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate font-semibold group-hover:text-primary transition-colors">
                        {c.name}
                      </div>
                      <StageBadge stage={c.stage} />
                    </div>
                    <div className="truncate text-xs text-muted-foreground mt-0.5">
                      {c.currentRole || c.appliedPosition || "Candidate"} ·{" "}
                      {c.location || "Location not specified"}
                    </div>
                    {c.currentCompany && (
                      <div className="truncate text-[11px] text-muted-foreground/80 mt-0.5">
                        Currently at {c.currentCompany}
                      </div>
                    )}
                    <div className="mt-2.5 flex flex-wrap gap-1">
                      {c.skills.slice(0, 5).map((s) => (
                        <Badge
                          key={s}
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 font-normal"
                        >
                          {s}
                        </Badge>
                      ))}
                      {c.skills.length > 5 && (
                        <span className="text-[10px] text-muted-foreground self-center">
                          +{c.skills.length - 5}
                        </span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 text-amber-500" />
                        <span>{c.yearsExperience || 0}y exp</span>
                        <span>·</span>
                        <span className="capitalize">
                          {c.source?.toLowerCase() || "Direct"}
                        </span>
                      </div>
                      <ScoreRing value={c.atsScore} size={40} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}

            {candidates.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-border bg-card/30 p-10 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-muted/60 text-muted-foreground mb-3">
                  <UserPlus className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold">No Candidates in Talent Pool</h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
                  Your talent pool is currently empty. Add prospective candidates or import
                  a CSV file to build your candidate database.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById("csv-import-input")?.click()}
                  >
                    <Upload className="mr-1.5 h-3.5 w-3.5" />
                    Import CSV
                  </Button>
                  <Button size="sm" onClick={() => setShowAddModal(true)}>
                    <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                    Add Candidate
                  </Button>
                </div>
              </div>
            ) : results.length === 0 ? (
              <div className="col-span-full rounded-2xl border border-dashed border-border bg-card/30 p-10 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-muted/60 text-muted-foreground mb-3">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold">No Matching Candidates</h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-md mx-auto">
                  No candidates match your current search and filter criteria. Try
                  adjusting your query or resetting filters.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={resetAllFilters}>
                    Reset All Filters
                  </Button>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      {/* Save Search Modal */}
      <Dialog open={saveSearchModalOpen} onOpenChange={setSaveSearchModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Talent Pool Search</DialogTitle>
            <DialogDescription>
              Bookmark this query to quickly filter candidate profiles in the future.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveSearch} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Search Bookmark Name
              </label>
              <Input
                placeholder="e.g. Senior Frontend Specialists"
                value={newSearchName}
                onChange={(e) => setNewSearchName(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div className="space-y-1 rounded-lg bg-muted/50 p-2.5 text-xs">
              <span className="text-muted-foreground">Search Query: </span>
              <code className="text-foreground font-mono">
                {q || "(all candidates)"}
              </code>
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSaveSearchModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Search</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AddCandidateDialog
        open={showAddModal}
        onOpenChange={setShowAddModal}
        title="Add Candidate to Pool"
        description="Create a new candidate profile to include in the talent pool database."
        successMessage="Candidate added to Talent Pool successfully."
        stage="screening"
        jobs={jobs}
        appliedPositionFallback="Candidate"
      />
    </>
  );
}


